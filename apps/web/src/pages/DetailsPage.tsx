import {
  estimateMonthStartLikelihoodAtSunset,
  getMonthStartSignalLevel,
  gregorianToHijriCivil,
  buildEstimatedHijriCalendarRange,
  yallopMonthStartEstimate,
  odehMonthStartEstimate
} from '@hijri/calendar-engine';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LocationPicker from '../components/LocationPicker';
import MoonPhaseIcon from '../components/MoonPhaseIcon';
import HorizonDiagram from '../components/HorizonDiagram';
import CrescentScoreBar from '../components/CrescentScoreBar';
import { useAppLocation } from '../location/LocationContext';
import { useMethod } from '../method/MethodContext';
import { getTimeZoneForLocation } from '../timezone';
import { formatHijriDateDisplay, formatLocalizedNumber, formatIsoDateDisplay } from '../utils/dateFormat';
import { usePageMeta } from '../hooks/usePageMeta';

function daysInGregorianMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function isoDate(y: number, m: number, d: number): string {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

type VisibilityStatusKey = 'noChance' | 'veryLow' | 'low' | 'medium' | 'high' | 'unknown';

function likelihoodStyle(likelihood: string): { badgeClass: string; dotClass: string } {
  if (likelihood === 'noChance') return { badgeClass: 'bg-slate-100 text-slate-800 ring-1 ring-slate-200', dotClass: 'bg-slate-500' };
  if (likelihood === 'veryLow') return { badgeClass: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100', dotClass: 'bg-rose-400' };
  if (likelihood === 'high') return { badgeClass: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200', dotClass: 'bg-emerald-500' };
  if (likelihood === 'medium') return { badgeClass: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200', dotClass: 'bg-amber-500' };
  if (likelihood === 'low') return { badgeClass: 'bg-rose-50 text-rose-800 ring-1 ring-rose-200', dotClass: 'bg-rose-500' };
  return { badgeClass: 'bg-slate-50 text-slate-700 ring-1 ring-slate-200', dotClass: 'bg-slate-400' };
}

type DetailRow = {
  gregorianIso: string;
  day: number;
  dayOfWeek: string;
  hijriText: string;
  hijriDay?: number;
  hijriMonth?: number;
  hijriYear?: number;
  estimate: {
    likelihoodKey: string;
    monthStartSignalKey: string;
    monthStartSignalScorePercent?: number;
    sunriseUtcIso?: string;
    sunsetUtcIso?: string;
    moonriseUtcIso?: string;
    moonsetUtcIso?: string;
    lagMinutes?: number;
    crescentScorePercent?: number;
    moonIlluminationPercent?: number;
    moonIlluminationFraction?: number;
    moonAltitudeDeg?: number;
    sunAltitudeDeg?: number;
    moonElongationDeg?: number;
    moonAgeHours?: number;
    // Yallop-specific
    yallopQ?: number;
    yallopZone?: string;
    yallopZoneDescription?: string;
    yallopArcvDeg?: number;
    yallopWidthArcmin?: number;
    yallopBestTimeUtcIso?: string;
    // Odeh-specific
    odehV?: number;
    odehZone?: string;
    odehZoneDescription?: string;
    odehArcvDeg?: number;
    odehWidthArcmin?: number;
    odehBestTimeUtcIso?: string;
  };
  isIndicatorDay: boolean;
};

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 py-0.5">
      <span className="text-slate-600">{label}</span>
      <span className="text-slate-900 font-medium whitespace-nowrap">{value}</span>
    </div>
  );
}

export default function DetailsPage() {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const { location } = useAppLocation();
  const { methodId } = useMethod();

  const timeZone = useMemo(
    () => getTimeZoneForLocation(location.latitude, location.longitude),
    [location.latitude, location.longitude]
  );

  const localTimeFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone
    });
  }, [i18n.language, timeZone]);

  const fmtLocalTime = (iso?: string): string | null => {
    if (!iso) return null;
    const d = new Date(iso);
    if (!Number.isFinite(d.getTime())) return null;
    return localTimeFormatter.format(d);
  };

  const monthOptions = useMemo(() => {
    return Array.from({ length: 12 }, (_, idx) => {
      const m = idx + 1;
      const label = new Date(year, m - 1, 1).toLocaleString(i18n.language, { month: 'long' });
      return { value: m, label };
    });
  }, [i18n.language, year]);

  const goPrevMonth = () => {
    if (month > 1) setMonth(month - 1);
    else { setYear(year - 1); setMonth(12); }
  };

  const goNextMonth = () => {
    if (month < 12) setMonth(month + 1);
    else { setYear(year + 1); setMonth(1); }
  };

  const data = useMemo(() => {
    const dim = daysInGregorianMonth(year, month);

    // Build estimated Hijri mapping
    const estimatedByIso = new Map<string, { year: number; month: number; day: number }>();
    if (methodId === 'estimate' || methodId === 'yallop' || methodId === 'odeh') {
      const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      startDate.setUTCDate(startDate.getUTCDate() - 90);
      const endDate = new Date(Date.UTC(year, month - 1, dim, 0, 0, 0));
      endDate.setUTCDate(endDate.getUTCDate() + 1);
      const start = { year: startDate.getUTCFullYear(), month: startDate.getUTCMonth() + 1, day: startDate.getUTCDate() };
      const end = { year: endDate.getUTCFullYear(), month: endDate.getUTCMonth() + 1, day: endDate.getUTCDate() };
      const calendar = buildEstimatedHijriCalendarRange(
        start, end,
        { latitude: location.latitude, longitude: location.longitude },
        { monthStartRule: methodId === 'yallop' ? 'yallop' : methodId === 'odeh' ? 'odeh' : 'geometric' }
      );
      for (const item of calendar) {
        estimatedByIso.set(isoDate(item.gregorian.year, item.gregorian.month, item.gregorian.day), item.hijri);
      }
    }

    // Evening estimates
    const estimateFn = methodId === 'yallop' ? yallopMonthStartEstimate : methodId === 'odeh' ? odehMonthStartEstimate : estimateMonthStartLikelihoodAtSunset;
    const estimateByIso = new Map<string, ReturnType<typeof estimateMonthStartLikelihoodAtSunset>>();
    const estimateStart = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    estimateStart.setUTCDate(estimateStart.getUTCDate() - 40);
    const estimateEnd = new Date(Date.UTC(year, month - 1, dim, 0, 0, 0));
    for (let dt = new Date(estimateStart); dt.getTime() <= estimateEnd.getTime(); ) {
      const y = dt.getUTCFullYear(); const m = dt.getUTCMonth() + 1; const d = dt.getUTCDate();
      const key = isoDate(y, m, d);
      estimateByIso.set(key, estimateFn(
        { year: y, month: m, day: d },
        { latitude: location.latitude, longitude: location.longitude }
      ));
      dt.setUTCDate(dt.getUTCDate() + 1);
    }

    const getHijriForDay = (d: number) => {
      const iso = isoDate(year, month, d);
      if (methodId === 'civil') return gregorianToHijriCivil({ year, month, day: d });
      if (methodId === 'estimate' || methodId === 'yallop' || methodId === 'odeh') return estimatedByIso.get(iso) ?? null;
      return null;
    };

    // Indicator days (same logic as calendar)
    const monthStartCandidatesIso = new Set<string>();
    for (let d = 1; d <= dim; d++) {
      const h = getHijriForDay(d);
      if (h?.day === 1) monthStartCandidatesIso.add(isoDate(year, month, d));
      const nextDate = new Date(year, month - 1, d);
      nextDate.setDate(nextDate.getDate() + 1);
      const nextHijri = methodId === 'civil'
        ? gregorianToHijriCivil({ year: nextDate.getFullYear(), month: nextDate.getMonth() + 1, day: nextDate.getDate() })
        : (methodId === 'estimate' || methodId === 'yallop' || methodId === 'odeh')
          ? (estimatedByIso.get(isoDate(nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate())) ?? null)
          : null;
      if (nextHijri?.day === 1) monthStartCandidatesIso.add(isoDate(nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate()));
    }

    const indicatorDays = new Set<number>();
    for (const startIso of monthStartCandidatesIso) {
      const s = new Date(`${startIso}T00:00:00.000Z`);
      if (!Number.isFinite(s.getTime())) continue;
      const sPrev = new Date(s);
      sPrev.setUTCDate(sPrev.getUTCDate() - 1);
      const sPrevIso = isoDate(sPrev.getUTCFullYear(), sPrev.getUTCMonth() + 1, sPrev.getUTCDate());
      const sEst = estimateByIso.get(sPrevIso);
      const sSignal = getMonthStartSignalLevel(sEst);
      const stopAfterMonthStart = (sSignal === 'medium' || sSignal === 'high') && s.getUTCFullYear() === year && s.getUTCMonth() + 1 === month;

      const searchStart = new Date(s); searchStart.setUTCDate(searchStart.getUTCDate() - 25);
      const searchEnd = new Date(s); searchEnd.setUTCDate(searchEnd.getUTCDate() - 1);
      let foundXIso: string | null = null;
      let prevLagWasPositive = false;
      let latestPositiveLagIso: string | null = null;
      for (let dt = new Date(searchStart); dt.getTime() <= searchEnd.getTime(); dt.setUTCDate(dt.getUTCDate() + 1)) {
        const key = isoDate(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
        const est = estimateByIso.get(key);
        const lag = est?.metrics.lagMinutes;
        const lagIsPositive = typeof lag === 'number' && lag > 0;
        if (lagIsPositive) latestPositiveLagIso = key;
        if (lagIsPositive && !prevLagWasPositive) foundXIso = key;
        prevLagWasPositive = lagIsPositive;
      }
      if (!foundXIso) foundXIso = latestPositiveLagIso;
      if (!foundXIso) continue;
      const x = new Date(`${foundXIso}T00:00:00.000Z`);
      if (!Number.isFinite(x.getTime())) continue;
      for (const delta of [-1, 0, 1, 2, 3]) {
        const dd = new Date(x); dd.setUTCDate(dd.getUTCDate() + delta);
        if (dd.getUTCFullYear() !== year || dd.getUTCMonth() + 1 !== month) continue;
        if (stopAfterMonthStart && dd.getTime() > s.getTime()) continue;
        const ddPrev = new Date(dd); ddPrev.setUTCDate(ddPrev.getUTCDate() - 1);
        const ddPrevIso = isoDate(ddPrev.getUTCFullYear(), ddPrev.getUTCMonth() + 1, ddPrev.getUTCDate());
        const ddSignal = getMonthStartSignalLevel(estimateByIso.get(ddPrevIso));
        if (ddSignal === 'noChance') {
          const daysFromX = Math.round((dd.getTime() - x.getTime()) / 86400000);
          const daysFromS = Math.round((dd.getTime() - s.getTime()) / 86400000);
          if (Math.abs(daysFromX) > 1 && Math.abs(daysFromS) > 1) continue;
        }
        indicatorDays.add(dd.getUTCDate());
      }
    }

    // Suppress adjacent noChance pairs
    const signalForDay = (dayOfMonth: number): string => {
      const prev = new Date(Date.UTC(year, month - 1, dayOfMonth, 0, 0, 0));
      prev.setUTCDate(prev.getUTCDate() - 1);
      return getMonthStartSignalLevel(estimateByIso.get(isoDate(prev.getUTCFullYear(), prev.getUTCMonth() + 1, prev.getUTCDate())));
    };
    for (let d = 1; d < dim; d++) {
      if (!indicatorDays.has(d) || !indicatorDays.has(d + 1)) continue;
      const a = signalForDay(d); const b = signalForDay(d + 1);
      if (a === 'noChance' && b === 'noChance') indicatorDays.delete(d);
      if ((a === 'medium' || a === 'high') && b !== 'unknown') indicatorDays.delete(d + 1);
    }

    const rows: DetailRow[] = [];
    for (let d = 1; d <= dim; d++) {
      const h = getHijriForDay(d);
      const hijriText = h ? `${h.day}/${h.month}/${h.year}` : '—';
      const dayOfWeek = new Date(year, month - 1, d).toLocaleDateString(i18n.language, { weekday: 'short' });
      const est = estimateByIso.get(isoDate(year, month, d));
      const prevForSignal = new Date(Date.UTC(year, month - 1, d, 0, 0, 0));
      prevForSignal.setUTCDate(prevForSignal.getUTCDate() - 1);
      const prevSignalIso = isoDate(prevForSignal.getUTCFullYear(), prevForSignal.getUTCMonth() + 1, prevForSignal.getUTCDate());
      const prevSignalEst = estimateByIso.get(prevSignalIso);
      const metrics = (est?.metrics ?? {}) as ReturnType<typeof estimateMonthStartLikelihoodAtSunset>['metrics'] & {
        sunriseUtcIso?: string; moonriseUtcIso?: string;
      };
      rows.push({
        gregorianIso: isoDate(year, month, d),
        day: d,
        dayOfWeek,
        hijriText,
        hijriDay: h?.day,
        hijriMonth: h?.month,
        hijriYear: h?.year,
        estimate: {
          likelihoodKey: `probability.${est?.likelihood ?? 'unknown'}`,
          monthStartSignalKey: `probability.${getMonthStartSignalLevel(prevSignalEst)}`,
          monthStartSignalScorePercent: prevSignalEst?.metrics.visibilityPercent,
          sunriseUtcIso: metrics.sunriseUtcIso,
          sunsetUtcIso: est?.metrics.sunsetUtcIso,
          moonriseUtcIso: metrics.moonriseUtcIso,
          moonsetUtcIso: est?.metrics.moonsetUtcIso,
          lagMinutes: est?.metrics.lagMinutes,
          crescentScorePercent: est?.metrics.visibilityPercent,
          moonIlluminationPercent: typeof est?.metrics.moonIlluminationFraction === 'number' ? Math.round(est.metrics.moonIlluminationFraction * 100) : undefined,
          moonIlluminationFraction: est?.metrics.moonIlluminationFraction,
          moonAltitudeDeg: est?.metrics.moonAltitudeDeg,
          sunAltitudeDeg: est?.metrics.sunAltitudeDeg,
          moonElongationDeg: est?.metrics.moonElongationDeg,
          moonAgeHours: est?.metrics.moonAgeHours,
          // Yallop-specific
          yallopQ: est?.metrics.yallopQ,
          yallopZone: est?.metrics.yallopZone,
          yallopZoneDescription: est?.metrics.yallopZoneDescription,
          yallopArcvDeg: est?.metrics.yallopArcvDeg,
          yallopWidthArcmin: est?.metrics.yallopWidthArcmin,
          yallopBestTimeUtcIso: est?.metrics.yallopBestTimeUtcIso,
          // Odeh-specific
          odehV: est?.metrics.odehV,
          odehZone: est?.metrics.odehZone,
          odehZoneDescription: est?.metrics.odehZoneDescription,
          odehArcvDeg: est?.metrics.odehArcvDeg,
          odehWidthArcmin: est?.metrics.odehWidthArcmin,
          odehBestTimeUtcIso: est?.metrics.odehBestTimeUtcIso
        },
        isIndicatorDay: indicatorDays.has(d)
      });
    }

    return { rows, indicatorDays };
  }, [i18n.language, location.latitude, location.longitude, methodId, month, year]);

  const mostLikelyIndicator = useMemo(() => {
    const candidates = data.rows
      .filter((row) => row.isIndicatorDay && typeof row.estimate.monthStartSignalScorePercent === 'number')
      .map((row) => ({ iso: row.gregorianIso, percent: Math.round(row.estimate.monthStartSignalScorePercent ?? 0) }));
    if (candidates.length === 0) return { iso: null as string | null, hasMultiple: false };
    const best = candidates.reduce((a, b) => (b.percent > a.percent ? b : a));
    return { iso: best.iso, hasMultiple: candidates.length > 1 };
  }, [data.rows]);

  const hijriRangeLabel = useMemo(() => {
    const first = data.rows[0];
    const last = data.rows[data.rows.length - 1];
    if (!first || !last || !first.hijriMonth || !first.hijriYear || !last.hijriMonth || !last.hijriYear) return null;

    const fmName = t(`hijriMonths.${first.hijriMonth}`);
    const lmName = t(`hijriMonths.${last.hijriMonth}`);
    const firstYear = formatLocalizedNumber(first.hijriYear, i18n.language);
    const lastYear = formatLocalizedNumber(last.hijriYear, i18n.language);

    if (first.hijriMonth === last.hijriMonth && first.hijriYear === last.hijriYear) {
      return `${fmName} ${firstYear}`;
    }
    if (first.hijriYear === last.hijriYear) {
      return `${fmName} – ${lmName} ${firstYear}`;
    }
    return `${fmName} ${firstYear} – ${lmName} ${lastYear}`;
  }, [data.rows, i18n.language, t]);

  usePageMeta('seo.details.title', 'seo.details.description');

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{t('calendar.tabDetails')}</h1>
          <div className="muted">{t('app.method.label')}: {t(`app.method.${methodId}`)}</div>
        </div>
      </div>

      <div className="card-header flex flex-col items-center gap-1">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={goPrevMonth}
            aria-label={t('calendar.prevMonth')}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 rtl:rotate-180"><path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd"/></svg>
          </button>
          <select className="control-sm w-24 sm:w-36 text-center" value={month} onChange={(e) => setMonth(Number(e.target.value))} aria-label={t('calendar.month')}>
            {monthOptions.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
          <input className="control-sm w-16 sm:w-20 text-center" type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} aria-label={t('calendar.year')} />
          <button
            type="button"
            onClick={goNextMonth}
            aria-label={t('calendar.nextMonth')}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 rtl:rotate-180"><path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd"/></svg>
          </button>
          <button
            type="button"
            onClick={() => { const now = new Date(); setYear(now.getFullYear()); setMonth(now.getMonth() + 1); }}
            aria-label={t('calendar.today')}
            title={t('calendar.today')}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/></svg>
          </button>
        </div>
        {hijriRangeLabel ? (
          <span className="text-xs text-slate-500">({hijriRangeLabel})</span>
        ) : null}
      </div>

      <div className="text-xs text-slate-500 mb-2">{t('probability.eveningEstimateHint')}</div>

      {/* ── Desktop: table ── */}
      <section className="card hidden sm:block">
        <div className="overflow-x-auto">
          <table className="min-w-[1080px] w-full border-separate border-spacing-0 [&_th]:text-center [&_td]:text-center">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-700">
                <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('convert.gregorianDateShort')}</th>
                <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('calendar.dayOfWeek')}</th>
                <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('convert.hijriDate')}</th>
                <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2 text-center">🌙</th>
                <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('probability.labelShort')}</th>
                {methodId === 'yallop' ? (
                  <>
                    <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('probability.yallopQ')}</th>
                    <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('probability.yallopZone')}</th>
                  </>
                ) : methodId === 'odeh' ? (
                  <>
                    <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('probability.odehV')}</th>
                    <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('probability.odehZone')}</th>
                  </>
                ) : (
                  <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('probability.crescentScore')}</th>
                )}
                <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('holidays.moonIllumination')}</th>
                <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('holidays.moonAltitude')}</th>
                <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('holidays.moonElongation')}</th>
                <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('holidays.moonAge')}</th>
                <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('probability.lagMinutes')}</th>
                <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('probability.sunRiseSetLocal')}</th>
                <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-2 py-2">{t('probability.moonRiseSetLocal')}</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row) => {
                const statusKey = row.estimate.monthStartSignalKey.replace('probability.', '') as VisibilityStatusKey;
                const style = likelihoodStyle(statusKey);
                const isMostLikely = mostLikelyIndicator.hasMultiple && mostLikelyIndicator.iso === row.gregorianIso;
                const gregorianDisplay = formatIsoDateDisplay(row.gregorianIso, i18n.language);
                const hijriDisplay = row.hijriDay && row.hijriMonth && row.hijriYear
                  ? formatHijriDateDisplay({ day: row.hijriDay, month: row.hijriMonth, year: row.hijriYear }, i18n.language)
                  : row.hijriText;
                return (
                  <tr key={row.gregorianIso} className="text-xs text-slate-800">
                    <td className="border-b border-slate-100 px-2 py-2 font-medium text-slate-900 whitespace-nowrap">{gregorianDisplay}</td>
                    <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap text-slate-600">{row.dayOfWeek}</td>
                    <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap">{hijriDisplay}</td>
                    <td className="border-b border-slate-100 px-2 py-2 text-center">
                      {typeof row.estimate.moonIlluminationFraction === 'number'
                        ? <MoonPhaseIcon illumination={row.estimate.moonIlluminationFraction} size={20} />
                        : '—'}
                    </td>
                    <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap">
                      {row.isIndicatorDay ? (
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${style.badgeClass}`}>
                          {isMostLikely ? (
                            <span className="text-[11px] leading-none" aria-hidden="true">★</span>
                          ) : (
                            <span className={`h-1.5 w-1.5 rounded-full ${style.dotClass}`} />
                          )}
                          {t(`probability.${statusKey}`)}
                        </span>
                      ) : (
                        <span className="text-slate-600">{t(`probability.${statusKey}`)}</span>
                      )}
                    </td>
                    {methodId === 'yallop' ? (
                      <>
                        <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap">{typeof row.estimate.yallopQ === 'number' ? row.estimate.yallopQ.toFixed(3) : '—'}</td>
                        <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap">{row.estimate.yallopZone ? `${row.estimate.yallopZone} — ${row.estimate.yallopZoneDescription ?? ''}` : '—'}</td>
                      </>
                    ) : methodId === 'odeh' ? (
                      <>
                        <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap">{typeof row.estimate.odehV === 'number' ? row.estimate.odehV.toFixed(3) : '—'}</td>
                        <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap">{row.estimate.odehZone ? `${row.estimate.odehZone} — ${row.estimate.odehZoneDescription ?? ''}` : '—'}</td>
                      </>
                    ) : (
                      <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap">
                        {typeof row.estimate.crescentScorePercent === 'number' ? (
                          (() => {
                            const pct = Math.max(0, Math.min(100, Math.round(row.estimate.crescentScorePercent ?? 0)));
                            const colorClass = pct >= 70
                              ? 'bg-emerald-500'
                              : pct >= 40
                                ? 'bg-amber-400'
                                : pct >= 15
                                  ? 'bg-orange-400'
                                  : 'bg-rose-400';
                            return (
                              <span
                                className={`inline-block h-4 w-1.5 rounded-full ${colorClass}`}
                                title={`${pct}%`}
                                aria-label={`${pct}%`}
                              />
                            );
                          })()
                        ) : '—'}
                      </td>
                    )}
                    <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap">{typeof row.estimate.moonIlluminationPercent === 'number' ? `${row.estimate.moonIlluminationPercent}%` : '—'}</td>
                    <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap">{typeof row.estimate.moonAltitudeDeg === 'number' ? `${row.estimate.moonAltitudeDeg.toFixed(1)}°` : '—'}</td>
                    <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap">{typeof row.estimate.moonElongationDeg === 'number' ? `${row.estimate.moonElongationDeg.toFixed(1)}°` : '—'}</td>
                    <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap">{typeof row.estimate.moonAgeHours === 'number' ? `${row.estimate.moonAgeHours.toFixed(1)}h` : '—'}</td>
                    <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap">{typeof row.estimate.lagMinutes === 'number' ? Math.round(row.estimate.lagMinutes) : '—'}</td>
                    <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap">
                      {`${fmtLocalTime(row.estimate.sunriseUtcIso) ?? '—'} → ${fmtLocalTime(row.estimate.sunsetUtcIso) ?? '—'}`}
                    </td>
                    <td className="border-b border-slate-100 px-2 py-2 whitespace-nowrap">
                      {`${fmtLocalTime(row.estimate.moonriseUtcIso) ?? '—'} → ${fmtLocalTime(row.estimate.moonsetUtcIso) ?? '—'}`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Mobile: card list ── */}
      <div className="space-y-2 sm:hidden">
        {data.rows.map((row) => {
          const statusKey = row.estimate.monthStartSignalKey.replace('probability.', '') as VisibilityStatusKey;
          const style = likelihoodStyle(statusKey);
          const isMostLikely = mostLikelyIndicator.hasMultiple && mostLikelyIndicator.iso === row.gregorianIso;
          const isExpanded = expandedDay === row.day;

          return (
            <div
              key={row.day}
              className={`rounded-lg border px-3 py-2.5 text-sm cursor-pointer transition-colors ${
                isExpanded ? 'border-blue-300 bg-blue-50/50' : 'border-slate-200 bg-white'
              }`}
              onClick={() => setExpandedDay(isExpanded ? null : row.day)}
            >
              {/* Summary row */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-900">{row.day}</span>
                  {typeof row.estimate.moonIlluminationFraction === 'number' && (
                    <MoonPhaseIcon illumination={row.estimate.moonIlluminationFraction} size={18} />
                  )}
                  <span className="text-xs text-slate-500">{row.dayOfWeek}</span>
                  <span className="text-xs text-slate-500">{row.hijriDay && row.hijriMonth && row.hijriYear ? formatHijriDateDisplay({ day: row.hijriDay, month: row.hijriMonth, year: row.hijriYear }, i18n.language) : row.hijriText}</span>
                </div>
                {row.isIndicatorDay ? (
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${style.badgeClass}`}>
                    {isMostLikely ? (
                      <span className="text-[11px] leading-none" aria-hidden="true">★</span>
                    ) : (
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dotClass}`} />
                    )}
                    {t(`probability.${statusKey}`)}
                  </span>
                ) : null}
              </div>

              {/* Expanded detail */}
              {isExpanded ? (
                <div className="mt-2 border-t border-slate-100 pt-2 text-xs">
                  {/* Horizon diagram */}
                  {typeof row.estimate.moonAltitudeDeg === 'number' && (
                    <div className="flex justify-center mb-2">
                      <HorizonDiagram
                        moonAltitudeDeg={row.estimate.moonAltitudeDeg}
                        sunAltitudeDeg={row.estimate.sunAltitudeDeg ?? -1}
                        arcDeg={row.estimate.moonElongationDeg}
                        lagMinutes={row.estimate.lagMinutes}
                        width={200}
                        height={110}
                      />
                    </div>
                  )}
                  {/* Crescent score bar */}
                  {typeof row.estimate.crescentScorePercent === 'number' && (
                    <div className="flex items-center justify-between gap-2 py-1">
                      <span className="text-slate-600">{t('probability.crescentScore')}</span>
                      <CrescentScoreBar percent={row.estimate.crescentScorePercent} width={80} />
                    </div>
                  )}
                  {methodId === 'yallop' && typeof row.estimate.yallopQ === 'number' ? (
                    <>
                      <MetricRow label={t('probability.yallopQ')} value={row.estimate.yallopQ.toFixed(3)} />
                      <MetricRow label={t('probability.yallopZone')} value={row.estimate.yallopZone ? `${row.estimate.yallopZone} — ${row.estimate.yallopZoneDescription ?? ''}` : '—'} />
                      {typeof row.estimate.yallopArcvDeg === 'number' ? <MetricRow label={t('probability.yallopArcv')} value={`${row.estimate.yallopArcvDeg.toFixed(2)}°`} /> : null}
                      {typeof row.estimate.yallopWidthArcmin === 'number' ? <MetricRow label={t('probability.yallopWidth')} value={`${row.estimate.yallopWidthArcmin.toFixed(2)}'`} /> : null}
                      {row.estimate.yallopBestTimeUtcIso ? <MetricRow label={t('probability.yallopBestTime')} value={fmtLocalTime(row.estimate.yallopBestTimeUtcIso) ?? '—'} /> : null}
                      <div className="mt-1 border-t border-slate-50 pt-1" />
                    </>
                  ) : methodId === 'odeh' && typeof row.estimate.odehV === 'number' ? (
                    <>
                      <MetricRow label={t('probability.odehV')} value={row.estimate.odehV.toFixed(3)} />
                      <MetricRow label={t('probability.odehZone')} value={row.estimate.odehZone ? `${row.estimate.odehZone} — ${row.estimate.odehZoneDescription ?? ''}` : '—'} />
                      {typeof row.estimate.odehArcvDeg === 'number' ? <MetricRow label={t('probability.odehArcv')} value={`${row.estimate.odehArcvDeg.toFixed(2)}°`} /> : null}
                      {typeof row.estimate.odehWidthArcmin === 'number' ? <MetricRow label={t('probability.odehWidth')} value={`${row.estimate.odehWidthArcmin.toFixed(2)}'`} /> : null}
                      {row.estimate.odehBestTimeUtcIso ? <MetricRow label={t('probability.odehBestTime')} value={fmtLocalTime(row.estimate.odehBestTimeUtcIso) ?? '—'} /> : null}
                      <div className="mt-1 border-t border-slate-50 pt-1" />
                    </>
                  ) : (
                    <MetricRow label={t('probability.crescentScore')} value={typeof row.estimate.crescentScorePercent === 'number' ? `${Math.round(row.estimate.crescentScorePercent)}%` : '—'} />
                  )}
                  <MetricRow label={t('probability.lagMinutes')} value={typeof row.estimate.lagMinutes === 'number' ? String(Math.round(row.estimate.lagMinutes)) : '—'} />
                  <MetricRow label={t('holidays.moonIllumination')} value={typeof row.estimate.moonIlluminationPercent === 'number' ? `${row.estimate.moonIlluminationPercent}%` : '—'} />
                  <MetricRow label={t('holidays.moonAltitude')} value={typeof row.estimate.moonAltitudeDeg === 'number' ? `${row.estimate.moonAltitudeDeg.toFixed(1)}°` : '—'} />
                  <MetricRow label={t('holidays.moonElongation')} value={typeof row.estimate.moonElongationDeg === 'number' ? `${row.estimate.moonElongationDeg.toFixed(1)}°` : '—'} />
                  <MetricRow label={t('holidays.moonAge')} value={typeof row.estimate.moonAgeHours === 'number' ? `${row.estimate.moonAgeHours.toFixed(1)}h` : '—'} />
                  <div className="mt-1 border-t border-slate-50 pt-1">
                    <MetricRow label={t('probability.sunriseLocal')} value={fmtLocalTime(row.estimate.sunriseUtcIso) ?? '—'} />
                    <MetricRow label={t('probability.sunsetLocal')} value={fmtLocalTime(row.estimate.sunsetUtcIso) ?? '—'} />
                    <MetricRow label={t('probability.moonriseLocal')} value={fmtLocalTime(row.estimate.moonriseUtcIso) ?? '—'} />
                    <MetricRow label={t('probability.moonsetLocal')} value={fmtLocalTime(row.estimate.moonsetUtcIso) ?? '—'} />
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <LocationPicker />
    </div>
  );
}
