import {
  buildEstimatedHijriCalendarRange,
  estimateMonthStartLikelihoodAtSunset,
  getMonthStartSignalLevel,
  gregorianToHijriCivil,
  meetsCrescentVisibilityCriteriaAtSunset,
  yallopMonthStartEstimate,
  meetsYallopCriteriaAtSunset,
  odehMonthStartEstimate,
  meetsOdehCriteriaAtSunset
} from '@hijri/calendar-engine';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LocationPicker from '../components/LocationPicker';
import MoonPhaseIcon from '../components/MoonPhaseIcon';
import HorizonDiagram from '../components/HorizonDiagram';
import CrescentScoreBar from '../components/CrescentScoreBar';
import { useAppLocation } from '../location/LocationContext';
import { useMethod } from '../method/MethodContext';
import { getTimeZoneForLocation } from '../timezone';

function daysInGregorianMonth(year: number, month: number): number {
  // month: 1-12
  return new Date(year, month, 0).getDate();
}

type DayEstimate = {
  likelihoodKey: string;
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
};

type MonthStartHeat = {
  percent: number;
  className: string;
};

type CalendarDay = {
  day: number;
  hijri: string;
  hijriDay?: number;
  hijriMonth?: number;
  hijriYear?: number;
  isToday: boolean;
  isHijriMonthStart: boolean;
  isPotentialMonthStartEve: boolean;
  showIndicator: boolean;
};

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function isoDate(y: number, m: number, d: number): string {
  return `${y}-${pad2(m)}-${pad2(d)}`;
}

function heatClassForPercent(p: number): string {
  if (p >= 85) return 'bg-slate-300';
  if (p >= 65) return 'bg-slate-200';
  if (p >= 40) return 'bg-slate-100';
  if (p >= 20) return 'bg-slate-50';
  return '';
}

function clamp0to100(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(100, Math.round(n)));
}

type VisibilityStatusKey = 'noChance' | 'veryLow' | 'low' | 'medium' | 'high' | 'unknown';

function visibilityStatusFromEstimate(
  est: ReturnType<typeof estimateMonthStartLikelihoodAtSunset> | undefined
): VisibilityStatusKey {
  const status = getMonthStartSignalLevel(est);
  return status === 'unknown' ? 'unknown' : status;
}

function likelihoodStyle(likelihood: string): { badgeClass: string; dotClass: string; scoreClass: string } {
  // Keep this compact and consistent across calendar + details.
  // Uses Tailwind's built-in semantic colors (no custom hex).
  if (likelihood === 'noChance') {
    return { badgeClass: 'bg-slate-100 text-slate-800 ring-1 ring-slate-200', dotClass: 'bg-slate-500', scoreClass: 'bg-slate-200/80 text-slate-700' };
  }
  if (likelihood === 'veryLow') {
    return { badgeClass: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100', dotClass: 'bg-rose-400', scoreClass: 'bg-rose-100/80 text-rose-700' };
  }
  if (likelihood === 'high') {
    return { badgeClass: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200', dotClass: 'bg-emerald-500', scoreClass: 'bg-emerald-100/80 text-emerald-800' };
  }
  if (likelihood === 'medium') {
    return { badgeClass: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200', dotClass: 'bg-amber-500', scoreClass: 'bg-amber-100/80 text-amber-800' };
  }
  if (likelihood === 'low') {
    return { badgeClass: 'bg-rose-50 text-rose-800 ring-1 ring-rose-200', dotClass: 'bg-rose-500', scoreClass: 'bg-rose-100/80 text-rose-800' };
  }
  return { badgeClass: 'bg-slate-50 text-slate-700 ring-1 ring-slate-200', dotClass: 'bg-slate-400', scoreClass: 'bg-slate-200/80 text-slate-700' };
}


function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-3">
      <div className="text-slate-600">{label}</div>
      <div className="text-slate-900 whitespace-nowrap">{value}</div>
    </div>
  );
}

export default function CalendarPage() {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const { location } = useAppLocation();
  const { methodId } = useMethod();

  // Close expanded popup when month/year changes
  useEffect(() => { setExpandedDay(null); }, [month, year]);

  // Close expanded popup on outside click
  const calendarRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
        setExpandedDay(null);
      }
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, []);

  const today = new Date();
  const todayY = today.getFullYear();
  const todayM = today.getMonth() + 1;
  const todayD = today.getDate();

  const weekdayLabels = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(i18n.language, { weekday: 'short' });
    // 2023-01-01 is a Sunday in the Gregorian calendar.
    const base = new Date(2023, 0, 1);
    return Array.from({ length: 7 }, (_, idx) => formatter.format(new Date(base.getFullYear(), base.getMonth(), base.getDate() + idx)));
  }, [i18n.language]);

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
    if (month > 1) {
      setMonth(month - 1);
    } else {
      setYear(year - 1);
      setMonth(12);
    }
  };

  const goNextMonth = () => {
    if (month < 12) {
      setMonth(month + 1);
    } else {
      setYear(year + 1);
      setMonth(1);
    }
  };

  const monthData = useMemo(() => {
    const days: CalendarDay[] = [];
    const dim = daysInGregorianMonth(year, month);
    const offset = new Date(year, month - 1, 1).getDay();

    // Build estimate-mode Hijri mapping with some "warm-up" days before the month,
    // otherwise starting mid-stream can seed the estimated calendar incorrectly.
    const estimatedByIso = new Map<string, { year: number; month: number; day: number }>();
    if (methodId === 'estimate' || methodId === 'yallop' || methodId === 'odeh') {
      const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      startDate.setUTCDate(startDate.getUTCDate() - 90);
      const endDate = new Date(Date.UTC(year, month - 1, dim, 0, 0, 0));
      endDate.setUTCDate(endDate.getUTCDate() + 1);

      const start = { year: startDate.getUTCFullYear(), month: startDate.getUTCMonth() + 1, day: startDate.getUTCDate() };
      const end = { year: endDate.getUTCFullYear(), month: endDate.getUTCMonth() + 1, day: endDate.getUTCDate() };

      const calendar = buildEstimatedHijriCalendarRange(
        start,
        end,
        { latitude: location.latitude, longitude: location.longitude },
        methodId === 'yallop'
          ? { monthStartRule: 'yallop' }
          : methodId === 'odeh'
            ? { monthStartRule: 'odeh' }
            : { monthStartRule: 'geometric' }
      );

      for (const item of calendar) {
        estimatedByIso.set(isoDate(item.gregorian.year, item.gregorian.month, item.gregorian.day), item.hijri);
      }
    }

    // Precompute evening estimates for all days in the month (+ the day before),
    // so we can show a per-day details table and a subtle month-start "heat".
    const estimateFn = methodId === 'yallop' ? yallopMonthStartEstimate : methodId === 'odeh' ? odehMonthStartEstimate : estimateMonthStartLikelihoodAtSunset;
    const estimateByIso = new Map<string, ReturnType<typeof estimateMonthStartLikelihoodAtSunset>>();
    const estimateStart = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    // We look back far enough to support dynamic month-boundary windows.
    estimateStart.setUTCDate(estimateStart.getUTCDate() - 40);
    const estimateEnd = new Date(Date.UTC(year, month - 1, dim, 0, 0, 0));

    for (let dt = new Date(estimateStart); dt.getTime() <= estimateEnd.getTime(); ) {
      const y = dt.getUTCFullYear();
      const m = dt.getUTCMonth() + 1;
      const d = dt.getUTCDate();
      const key = isoDate(y, m, d);
      estimateByIso.set(
        key,
        estimateFn(
          { year: y, month: m, day: d },
          { latitude: location.latitude, longitude: location.longitude }
        )
      );
      dt.setUTCDate(dt.getUTCDate() + 1);
    }

    const getHijriForDay = (d: number) => {
      const iso = isoDate(year, month, d);
      if (methodId === 'civil') return gregorianToHijriCivil({ year, month, day: d });
      if (methodId === 'estimate' || methodId === 'yallop' || methodId === 'odeh') return estimatedByIso.get(iso) ?? null;
      return null;
    };

    // Heatmap: only show around detected month-start days, and only when ambiguous.
    const heatByDay = new Map<number, MonthStartHeat>();

    const candidatePercentForDay = (d: number): number => {
      const prev = new Date(Date.UTC(year, month - 1, d, 0, 0, 0));
      prev.setUTCDate(prev.getUTCDate() - 1);
      const prevIso = isoDate(prev.getUTCFullYear(), prev.getUTCMonth() + 1, prev.getUTCDate());
      const est = estimateByIso.get(prevIso);
      if (!est) return 0;
      const meetsCriteria = methodId === 'yallop'
        ? meetsYallopCriteriaAtSunset(est)
        : methodId === 'odeh'
          ? meetsOdehCriteriaAtSunset(est)
          : meetsCrescentVisibilityCriteriaAtSunset(est);
      if (!meetsCriteria) return 0;
      return clamp0to100(est.metrics.visibilityPercent ?? 0);
    };

    const monthStartDays: number[] = [];
    for (let d = 1; d <= dim; d += 1) {
      const h = getHijriForDay(d);
      if (h?.day === 1) monthStartDays.push(d);
    }

    for (const startDay of monthStartDays) {
      const window = [startDay - 1, startDay, startDay + 1].filter((d) => d >= 1 && d <= dim);
      const scored = window.map((d) => ({ d, p: candidatePercentForDay(d) }));
      const sorted = [...scored].sort((a, b) => b.p - a.p);
      const top = sorted[0]?.p ?? 0;
      const second = sorted[1]?.p ?? 0;

      // If the "best" candidate isn't decisive, treat as doubtful and show heat.
      const isDoubtful = top < 80 || second >= 20;
      if (!isDoubtful) continue;

      for (const s of scored) {
        const cls = heatClassForPercent(s.p);
        if (!cls) continue;
        heatByDay.set(s.d, { percent: s.p, className: cls });
      }
    }

    const details: Array<{
      gregorianIso: string;
      day: number;
      hijriText: string;
      estimate: DayEstimate;
    }> = [];

    // Gregorian dates (ISO) that are Hijri day 1 (including possible month-start on the day
    // immediately after this Gregorian month, so we can still mark the last days correctly).
    const monthStartCandidatesIso = new Set<string>();

    for (let d = 1; d <= dim; d += 1) {
      const h = getHijriForDay(d);
      const hijriText = h ? `${h.day}/${h.month}/${h.year}` : '—';
      const showIndicator = false;

      // Evening estimate for *this* date (affects next day after sunset)
      const est = estimateByIso.get(isoDate(year, month, d));
      const metrics = (est?.metrics ?? {}) as ReturnType<typeof estimateMonthStartLikelihoodAtSunset>['metrics'] & {
        sunriseUtcIso?: string;
        moonriseUtcIso?: string;
      };
      const estimate: DayEstimate = {
        likelihoodKey: `probability.${est?.likelihood ?? 'unknown'}`,
        sunriseUtcIso: metrics.sunriseUtcIso,
        sunsetUtcIso: est?.metrics.sunsetUtcIso,
        moonriseUtcIso: metrics.moonriseUtcIso,
        moonsetUtcIso: est?.metrics.moonsetUtcIso,
        lagMinutes: est?.metrics.lagMinutes,
        crescentScorePercent: est?.metrics.visibilityPercent,
        moonIlluminationPercent:
          typeof est?.metrics.moonIlluminationFraction === 'number'
            ? Math.round(est.metrics.moonIlluminationFraction * 100)
            : undefined,
        moonIlluminationFraction: est?.metrics.moonIlluminationFraction,
        moonAltitudeDeg: est?.metrics.moonAltitudeDeg,
        sunAltitudeDeg: est?.metrics.sunAltitudeDeg,
        moonElongationDeg: est?.metrics.moonElongationDeg,
        moonAgeHours: est?.metrics.moonAgeHours
      };

      details.push({
        gregorianIso: isoDate(year, month, d),
        day: d,
        hijriText,
        estimate
      });

      // Islamic days begin at sunset. If the crescent is seen on the *evening* of day D,
      // then day D+1 becomes Hijri day 1.
      const nextDate = new Date(year, month - 1, d);
      nextDate.setDate(nextDate.getDate() + 1);
      const nextHijri =
        methodId === 'civil'
          ? gregorianToHijriCivil({
              year: nextDate.getFullYear(),
              month: nextDate.getMonth() + 1,
              day: nextDate.getDate()
            })
          : (methodId === 'estimate' || methodId === 'yallop' || methodId === 'odeh')
            ? (estimatedByIso.get(isoDate(nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate())) ?? null)
            : null;

      const isPotentialMonthStartEve = nextHijri ? nextHijri.day === 1 : false;
      const isToday = year === todayY && month === todayM && d === todayD;
      const isHijriMonthStart = h ? h.day === 1 : false;

      if (isHijriMonthStart) {
        monthStartCandidatesIso.add(isoDate(year, month, d));
      }
      if (isPotentialMonthStartEve) {
        monthStartCandidatesIso.add(
          isoDate(nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate())
        );
      }

      days.push({
        day: d,
        hijri: hijriText,
        hijriDay: h?.day,
        hijriMonth: h?.month,
        hijriYear: h?.year,
        isToday,
        isHijriMonthStart,
        isPotentialMonthStartEve,
        showIndicator
      });
    }

    // Dynamic indicator days around each month start.
    // For each month start date S, find the first day X in the leading window where the Moon
    // sets after sunset (lagMinutes > 0). Then show indicators on X-1, X, X+1.
    const indicatorDays = new Set<number>();
    for (const startIso of monthStartCandidatesIso) {
      const s = new Date(`${startIso}T00:00:00.000Z`);
      if (!Number.isFinite(s.getTime())) continue;

      const sPrev = new Date(s);
      sPrev.setUTCDate(sPrev.getUTCDate() - 1);
      const sPrevIso = isoDate(sPrev.getUTCFullYear(), sPrev.getUTCMonth() + 1, sPrev.getUTCDate());
      const sSignal = visibilityStatusFromEstimate(estimateByIso.get(sPrevIso));
      const stopAfterMonthStart =
        (sSignal === 'medium' || sSignal === 'high') && s.getUTCFullYear() === year && s.getUTCMonth() + 1 === month;

      // Search the days leading up to S (exclude S itself).
      const searchStart = new Date(s);
      searchStart.setUTCDate(searchStart.getUTCDate() - 25);
      const searchEnd = new Date(s);
      searchEnd.setUTCDate(searchEnd.getUTCDate() - 1);

      let foundXIso: string | null = null;
      let prevLagWasPositive = false;

      let latestPositiveLagIso: string | null = null;

      for (let dt = new Date(searchStart); dt.getTime() <= searchEnd.getTime(); dt.setUTCDate(dt.getUTCDate() + 1)) {
        const key = isoDate(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
        const est = estimateByIso.get(key);
        const lag = est?.metrics.lagMinutes;
        const lagIsPositive = typeof lag === 'number' && lag > 0;

        if (lagIsPositive) latestPositiveLagIso = key;

        // Find transitions into positive lag. We want the one closest to the month start.
        if (lagIsPositive && !prevLagWasPositive) foundXIso = key;

        prevLagWasPositive = lagIsPositive;
      }

      // Fallback: if lag is always positive in the window (no transition), choose the latest
      // positive-lag day (closest to the month start) so X lands near the boundary.
      if (!foundXIso) foundXIso = latestPositiveLagIso;

      if (!foundXIso) continue;

      const x = new Date(`${foundXIso}T00:00:00.000Z`);
      if (!Number.isFinite(x.getTime())) continue;

      for (const delta of [-1, 0, 1, 2, 3]) {
        const dd = new Date(x);
        dd.setUTCDate(dd.getUTCDate() + delta);
        if (dd.getUTCFullYear() !== year || dd.getUTCMonth() + 1 !== month) continue;

        // If the month start is very-high confidence, don't keep showing indicators after it.
        if (stopAfterMonthStart && dd.getTime() > s.getTime()) continue;

        // Suppress pure "no chance" days unless they're immediately adjacent to the boundary.
        const ddPrev = new Date(dd);
        ddPrev.setUTCDate(ddPrev.getUTCDate() - 1);
        const ddPrevIso = isoDate(ddPrev.getUTCFullYear(), ddPrev.getUTCMonth() + 1, ddPrev.getUTCDate());
        const ddSignal = visibilityStatusFromEstimate(estimateByIso.get(ddPrevIso));
        if (ddSignal === 'noChance') {
          const daysFromX = Math.round((dd.getTime() - x.getTime()) / 86400000);
          const daysFromS = Math.round((dd.getTime() - s.getTime()) / 86400000);
          const isAdjacent = Math.abs(daysFromX) <= 1 || Math.abs(daysFromS) <= 1;
          if (!isAdjacent) continue;
        }

        indicatorDays.add(dd.getUTCDate());
      }
    }

    for (const d of days) {
      d.showIndicator = indicatorDays.has(d.day);
    }

    // If two adjacent days would both display "noChance" (e.g., moonset before sunset),
    // suppress the earlier one to reduce redundant noise.
    const signalStatusForGregorianDay = (dayOfMonth: number): VisibilityStatusKey => {
      const prev = new Date(Date.UTC(year, month - 1, dayOfMonth, 0, 0, 0));
      prev.setUTCDate(prev.getUTCDate() - 1);
      const prevIso = isoDate(prev.getUTCFullYear(), prev.getUTCMonth() + 1, prev.getUTCDate());
      return visibilityStatusFromEstimate(estimateByIso.get(prevIso));
    };

    for (let d = 1; d < dim; d += 1) {
      if (!indicatorDays.has(d) || !indicatorDays.has(d + 1)) continue;
      const a = signalStatusForGregorianDay(d);
      const b = signalStatusForGregorianDay(d + 1);
      if (a === 'noChance' && b === 'noChance') indicatorDays.delete(d);
      if ((a === 'medium' || a === 'high') && b !== 'unknown') indicatorDays.delete(d + 1);
    }

    for (const d of days) {
      d.showIndicator = indicatorDays.has(d.day);
    }

    return { month, days, offset, heatByDay, details, estimateByIso, indicatorDays };
  }, [location.latitude, location.longitude, methodId, month, year, todayD, todayM, todayY]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="text-2xl font-semibold tracking-tight sm:text-3xl">{t('app.nav.calendar')}</div>
          <div className="muted">{t('app.method.label')}: {t(`app.method.${methodId}`)}</div>
        </div>
      </div>

      {(() => {
        // Compute Hijri month/year range from the first and last day of the Gregorian month.
        const hijriRangeLabel = (() => {
          const first = monthData.days[0];
          const last = monthData.days[monthData.days.length - 1];
          if (!first?.hijriMonth || !last?.hijriMonth) return null;
          const fmName = t(`hijriMonths.${first.hijriMonth}`);
          const lmName = t(`hijriMonths.${last.hijriMonth}`);
          if (first.hijriMonth === last.hijriMonth && first.hijriYear === last.hijriYear) {
            return `${fmName} ${first.hijriYear}`;
          }
          if (first.hijriYear === last.hijriYear) {
            return `${fmName} – ${lmName} ${first.hijriYear}`;
          }
          return `${fmName} ${first.hijriYear} – ${lmName} ${last.hijriYear}`;
        })();
        return (
        <section ref={calendarRef} className="card overflow-visible relative z-10">
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
              <select
                className="control-sm w-24 sm:w-36 text-center"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                aria-label={t('calendar.month')}
              >
                {monthOptions.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <input
                className="control-sm w-16 sm:w-20 text-center"
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                aria-label={t('calendar.year')}
              />
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
          <div className="grid grid-cols-7 gap-px bg-slate-200 p-px">
            {weekdayLabels.map((w) => (
              <div key={w} className="bg-slate-50 px-1 py-1.5 text-center text-[10px] font-semibold text-slate-700 sm:px-2 sm:py-2 sm:text-xs">
                {w}
              </div>
            ))}
            {Array.from({ length: monthData.offset }, (_, idx) => (
              <div key={`blank-${monthData.month}-${idx}`} className="bg-white p-2" />
            ))}
            {monthData.days.map((d) => {
              const bg = d.isHijriMonthStart ? 'bg-slate-50' : 'bg-white';

              // Previous evening context for this Gregorian day.
              const prev = new Date(Date.UTC(year, month - 1, d.day, 0, 0, 0));
              prev.setUTCDate(prev.getUTCDate() - 1);
              const prevIso = isoDate(prev.getUTCFullYear(), prev.getUTCMonth() + 1, prev.getUTCDate());
              const eveEst = monthData.estimateByIso.get(prevIso);

              // Day metrics for this specific date.
              const thisIso = isoDate(year, month, d.day);
              const thisEst = monthData.estimateByIso.get(thisIso);
              const dayLagMinutes = typeof thisEst?.metrics.lagMinutes === 'number' ? Math.round(thisEst.metrics.lagMinutes) : null;
              const dayIllumPercent =
                typeof thisEst?.metrics.moonIlluminationFraction === 'number'
                  ? Math.round(thisEst.metrics.moonIlluminationFraction * 100)
                  : null;
              const evePercent = clamp0to100(eveEst?.metrics.visibilityPercent ?? 0);
              const eveStatusKey = visibilityStatusFromEstimate(eveEst);
              const eveStyle = likelihoodStyle(eveStatusKey);

              return (
                <div
                  key={d.day}
                  className={
                    `group relative ${bg} p-1 text-start transition-colors sm:p-2.5 ` +
                    `${d.isToday ? 'ring-2 ring-blue-400' : ''} ` +
                    `${expandedDay === d.day ? 'bg-blue-50' : 'hover:bg-slate-50'} ` +
                    'cursor-pointer'
                  }
                  tabIndex={0}
                  onClick={() => {
                    setExpandedDay(expandedDay === d.day ? null : d.day);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setExpandedDay(expandedDay === d.day ? null : d.day);
                    }
                  }}
                >
                  {/* ── Mobile cell: compact ── */}
                  <div className="flex flex-col items-center gap-0.5 sm:hidden" style={{ minHeight: '2.25rem' }}>
                    <div className="text-sm font-semibold leading-none text-slate-900">{d.day}</div>
                    <div className="text-[8px] leading-none text-slate-500">{d.hijriDay ?? ''}</div>
                    {d.showIndicator ? (
                      <span className={`mt-auto h-1.5 w-1.5 rounded-full ${eveStyle.dotClass}`} />
                    ) : null}
                  </div>

                  {/* ── Desktop cell: full detail ── */}
                  <div className="hidden sm:flex sm:min-h-16 sm:flex-col sm:gap-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="text-base font-semibold leading-none text-slate-900">{d.day}</div>
                      <div className="text-[11px] leading-none text-slate-700">{d.hijri}</div>
                    </div>

                    {d.showIndicator ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className="inline-flex items-center overflow-hidden rounded-full ring-1 ring-black/10"
                            title={`${t('probability.monthStartSignalFor')}: ${thisIso} (${t('holidays.eveOf')} ${prevIso}) — ${t(`probability.${eveStatusKey}`)} (${t('probability.crescentScore')}: ${evePercent}%)`}
                          >
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium ${eveStyle.badgeClass} ring-0`}>
                              <span className={`h-1.5 w-1.5 rounded-full ${eveStyle.dotClass}`} />
                              {t(`probability.${eveStatusKey}`)}
                            </span>
                            {typeof eveEst?.metrics.visibilityPercent === 'number' ? (
                              <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold ${eveStyle.scoreClass}`}>
                                {evePercent}%
                              </span>
                            ) : null}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {dayLagMinutes !== null ? (
                            <span
                              className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200"
                              title={t('probability.lagMinutes')}
                            >
                              <span className="text-[10px] leading-none text-slate-500" aria-hidden="true">⏱</span>
                              {dayLagMinutes}m
                            </span>
                          ) : null}

                          {dayIllumPercent !== null ? (
                            <span
                              className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200"
                              title={t('holidays.moonIllumination')}
                            >
                              {typeof thisEst?.metrics.moonIlluminationFraction === 'number'
                                ? <MoonPhaseIcon illumination={thisEst.metrics.moonIlluminationFraction} size={14} />
                                : <span className="text-[10px] leading-none text-slate-500" aria-hidden="true">☾</span>}
                              {dayIllumPercent}%
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  {expandedDay === d.day ? (
                    <div className="hidden sm:block absolute left-0 right-0 top-full z-50 mt-1 sm:left-2 sm:right-auto sm:w-96 sm:max-w-[calc(100vw-2rem)]">
                      <div className="max-h-[60vh] overflow-auto select-text rounded-md border border-slate-200 bg-white p-2.5 text-xs shadow-lg sm:max-h-[70vh] sm:p-3">
                        <div className="space-y-3">
                          <div className="text-[11px] leading-relaxed text-slate-600">{t('holidays.monthStartRuleNote')}</div>

                          <div>
                            <div className="text-[11px] font-semibold text-slate-900">
                              {t('probability.eveningEstimate')}: {t('holidays.eveOf')}{' '}
                              <span className="font-mono font-normal">{thisIso}</span>
                            </div>

                            {thisEst ? (
                              <div className="mt-2 space-y-1">
                                {methodId === 'yallop' && thisEst.metrics.yallopQ != null ? (
                                  <>
                                    <MetricRow label={t('probability.yallopQ')} value={thisEst.metrics.yallopQ.toFixed(3)} />
                                    <MetricRow label={t('probability.yallopZone')} value={thisEst.metrics.yallopZone ? `${thisEst.metrics.yallopZone} — ${thisEst.metrics.yallopZoneDescription ?? ''}` : '—'} />
                                    {typeof thisEst.metrics.yallopArcvDeg === 'number' ? <MetricRow label={t('probability.yallopArcv')} value={`${thisEst.metrics.yallopArcvDeg.toFixed(2)}°`} /> : null}
                                    {typeof thisEst.metrics.yallopWidthArcmin === 'number' ? <MetricRow label={t('probability.yallopWidth')} value={`${thisEst.metrics.yallopWidthArcmin.toFixed(2)}'`} /> : null}
                                    {thisEst.metrics.yallopBestTimeUtcIso ? <MetricRow label={t('probability.yallopBestTime')} value={fmtLocalTime(thisEst.metrics.yallopBestTimeUtcIso) ?? '—'} /> : null}
                                    <div className="border-t border-slate-100 pt-1 mt-1" />
                                  </>
                                ) : methodId === 'odeh' && thisEst.metrics.odehV != null ? (
                                  <>
                                    <MetricRow label={t('probability.odehV')} value={thisEst.metrics.odehV.toFixed(3)} />
                                    <MetricRow label={t('probability.odehZone')} value={thisEst.metrics.odehZone ? `${thisEst.metrics.odehZone} — ${thisEst.metrics.odehZoneDescription ?? ''}` : '—'} />
                                    {typeof thisEst.metrics.odehArcvDeg === 'number' ? <MetricRow label={t('probability.odehArcv')} value={`${thisEst.metrics.odehArcvDeg.toFixed(2)}°`} /> : null}
                                    {typeof thisEst.metrics.odehWidthArcmin === 'number' ? <MetricRow label={t('probability.odehWidth')} value={`${thisEst.metrics.odehWidthArcmin.toFixed(2)}'`} /> : null}
                                    {thisEst.metrics.odehBestTimeUtcIso ? <MetricRow label={t('probability.odehBestTime')} value={fmtLocalTime(thisEst.metrics.odehBestTimeUtcIso) ?? '—'} /> : null}
                                    <div className="border-t border-slate-100 pt-1 mt-1" />
                                  </>
                                ) : (
                                  <>
                                    <MetricRow
                                      label={t('probability.crescentScore')}
                                      value={
                                        typeof thisEst.metrics.visibilityPercent === 'number'
                                          ? `${clamp0to100(thisEst.metrics.visibilityPercent)}%`
                                          : '—'
                                      }
                                    />
                                    <div className="border-t border-slate-100 pt-1 mt-1" />
                                  </>
                                )}
                                <MetricRow label={t('probability.sunsetLocal')} value={fmtLocalTime(thisEst.metrics.sunsetUtcIso) ?? '—'} />
                                <MetricRow label={t('probability.moonsetLocal')} value={fmtLocalTime(thisEst.metrics.moonsetUtcIso) ?? '—'} />
                                <MetricRow
                                  label={t('probability.lagMinutes')}
                                  value={
                                    typeof thisEst.metrics.lagMinutes === 'number'
                                      ? String(Math.round(thisEst.metrics.lagMinutes))
                                      : '—'
                                  }
                                />
                                <MetricRow
                                  label={t('holidays.moonIllumination')}
                                  value={
                                    typeof thisEst.metrics.moonIlluminationFraction === 'number'
                                      ? `${Math.round(thisEst.metrics.moonIlluminationFraction * 100)}%`
                                      : '—'
                                  }
                                />
                                <MetricRow
                                  label={t('holidays.moonAltitude')}
                                  value={
                                    typeof thisEst.metrics.moonAltitudeDeg === 'number'
                                      ? `${thisEst.metrics.moonAltitudeDeg.toFixed(1)}°`
                                      : '—'
                                  }
                                />
                                <MetricRow
                                  label={t('holidays.moonElongation')}
                                  value={
                                    typeof thisEst.metrics.moonElongationDeg === 'number'
                                      ? `${thisEst.metrics.moonElongationDeg.toFixed(1)}°`
                                      : '—'
                                  }
                                />
                                <MetricRow
                                  label={t('holidays.moonAge')}
                                  value={
                                    typeof thisEst.metrics.moonAgeHours === 'number'
                                      ? `${thisEst.metrics.moonAgeHours.toFixed(1)}h`
                                      : '—'
                                  }
                                />
                                {/* Visual: Horizon diagram + Moon phase */}
                                <div className="mt-3 flex items-center justify-center gap-4 border-t border-slate-100 pt-2">
                                  {typeof thisEst.metrics.moonAltitudeDeg === 'number' && (
                                    <HorizonDiagram
                                      moonAltitudeDeg={thisEst.metrics.moonAltitudeDeg}
                                      sunAltitudeDeg={thisEst.metrics.sunAltitudeDeg ?? -1}
                                      arcDeg={thisEst.metrics.moonElongationDeg}
                                      lagMinutes={thisEst.metrics.lagMinutes}
                                      width={150}
                                      height={90}
                                    />
                                  )}
                                  {typeof thisEst.metrics.moonIlluminationFraction === 'number' && (
                                    <div className="flex flex-col items-center gap-1">
                                      <MoonPhaseIcon illumination={thisEst.metrics.moonIlluminationFraction} size={36} />
                                      <span className="text-[10px] text-slate-500">{Math.round(thisEst.metrics.moonIlluminationFraction * 100)}%</span>
                                    </div>
                                  )}
                                </div>
                                {typeof thisEst.metrics.visibilityPercent === 'number' && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <span className="text-[11px] text-slate-500">{t('probability.crescentScore')}:</span>
                                    <CrescentScoreBar percent={thisEst.metrics.visibilityPercent} width={80} />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="mt-2 text-[11px] text-slate-600">—</div>
                            )}
                          </div>

                          {eveEst ? (
                            <div className="border-t border-slate-100 pt-3">
                              <div className="text-[11px] font-semibold text-slate-900">
                                {t('probability.monthStartSignalFor')}{' '}
                                <span className="font-mono font-normal">{prevIso}</span>
                              </div>
                              <div className="mt-1 space-y-1">
                                {methodId === 'yallop' && eveEst.metrics.yallopQ != null ? (
                                  <>
                                    <MetricRow label={t('probability.yallopQ')} value={eveEst.metrics.yallopQ.toFixed(3)} />
                                    <MetricRow label={t('probability.yallopZone')} value={eveEst.metrics.yallopZone ? `${eveEst.metrics.yallopZone} — ${eveEst.metrics.yallopZoneDescription ?? ''}` : '—'} />
                                  </>
                                ) : methodId === 'odeh' && eveEst.metrics.odehV != null ? (
                                  <>
                                    <MetricRow label={t('probability.odehV')} value={eveEst.metrics.odehV.toFixed(3)} />
                                    <MetricRow label={t('probability.odehZone')} value={eveEst.metrics.odehZone ? `${eveEst.metrics.odehZone} — ${eveEst.metrics.odehZoneDescription ?? ''}` : '—'} />
                                  </>
                                ) : (
                                  <MetricRow label={t('probability.crescentScore')} value={`${evePercent}%`} />
                                )}
                                <MetricRow
                                  label={t('probability.lagMinutes')}
                                  value={
                                    typeof eveEst.metrics.lagMinutes === 'number'
                                      ? String(Math.round(eveEst.metrics.lagMinutes))
                                      : '—'
                                  }
                                />
                                {eveStatusKey === 'noChance' ? (
                                  <div className="text-[11px] text-slate-600">{t('probability.noChanceHint')}</div>
                                ) : null}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ); })()}

      {/* ── Mobile: detail panel below grid for tapped day ── */}
      {expandedDay !== null ? (() => {
        const d = monthData.days.find(dd => dd.day === expandedDay);
        if (!d) return null;
        const prev = new Date(Date.UTC(year, month - 1, d.day, 0, 0, 0));
        prev.setUTCDate(prev.getUTCDate() - 1);
        const prevIso = isoDate(prev.getUTCFullYear(), prev.getUTCMonth() + 1, prev.getUTCDate());
        const eveEst = monthData.estimateByIso.get(prevIso);
        const thisIso = isoDate(year, month, d.day);
        const thisEst = monthData.estimateByIso.get(thisIso);
        const eveStatusKey = visibilityStatusFromEstimate(eveEst);
        const eveStyle = likelihoodStyle(eveStatusKey);
        const evePercent = clamp0to100(eveEst?.metrics.visibilityPercent ?? 0);

        return (
          <div className="sm:hidden card p-3 text-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="font-semibold text-slate-900">
                {d.day} — <span className="text-slate-600 font-normal">{d.hijri}</span>
              </div>
              <button type="button" className="text-slate-400 hover:text-slate-600" onClick={() => setExpandedDay(null)} aria-label="Close">✕</button>
            </div>

            <div className="mb-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${eveStyle.badgeClass}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${eveStyle.dotClass}`} />
                {t(`probability.${eveStatusKey}`)} {evePercent}%
              </span>
            </div>

            {thisEst ? (
              <div className="text-xs space-y-0.5">
                {methodId === 'yallop' && thisEst.metrics.yallopQ != null ? (
                  <>
                    <MetricRow label={t('probability.yallopQ')} value={thisEst.metrics.yallopQ.toFixed(3)} />
                    <MetricRow label={t('probability.yallopZone')} value={thisEst.metrics.yallopZone ? `${thisEst.metrics.yallopZone} — ${thisEst.metrics.yallopZoneDescription ?? ''}` : '—'} />
                    {typeof thisEst.metrics.yallopArcvDeg === 'number' ? <MetricRow label={t('probability.yallopArcv')} value={`${thisEst.metrics.yallopArcvDeg.toFixed(2)}°`} /> : null}
                    {typeof thisEst.metrics.yallopWidthArcmin === 'number' ? <MetricRow label={t('probability.yallopWidth')} value={`${thisEst.metrics.yallopWidthArcmin.toFixed(2)}'`} /> : null}
                    {thisEst.metrics.yallopBestTimeUtcIso ? <MetricRow label={t('probability.yallopBestTime')} value={fmtLocalTime(thisEst.metrics.yallopBestTimeUtcIso) ?? '—'} /> : null}
                  </>
                ) : methodId === 'odeh' && thisEst.metrics.odehV != null ? (
                  <>
                    <MetricRow label={t('probability.odehV')} value={thisEst.metrics.odehV.toFixed(3)} />
                    <MetricRow label={t('probability.odehZone')} value={thisEst.metrics.odehZone ? `${thisEst.metrics.odehZone} — ${thisEst.metrics.odehZoneDescription ?? ''}` : '—'} />
                    {typeof thisEst.metrics.odehArcvDeg === 'number' ? <MetricRow label={t('probability.odehArcv')} value={`${thisEst.metrics.odehArcvDeg.toFixed(2)}°`} /> : null}
                    {typeof thisEst.metrics.odehWidthArcmin === 'number' ? <MetricRow label={t('probability.odehWidth')} value={`${thisEst.metrics.odehWidthArcmin.toFixed(2)}'`} /> : null}
                    {thisEst.metrics.odehBestTimeUtcIso ? <MetricRow label={t('probability.odehBestTime')} value={fmtLocalTime(thisEst.metrics.odehBestTimeUtcIso) ?? '—'} /> : null}
                  </>
                ) : (
                  <>
                    <MetricRow label={t('probability.crescentScore')} value={typeof thisEst.metrics.visibilityPercent === 'number' ? `${clamp0to100(thisEst.metrics.visibilityPercent)}%` : '—'} />
                    <div className="border-t border-slate-100 pt-1 mt-1" />
                  </>
                )}
                <MetricRow label={t('probability.lagMinutes')} value={typeof thisEst.metrics.lagMinutes === 'number' ? String(Math.round(thisEst.metrics.lagMinutes)) : '—'} />
                <MetricRow label={t('holidays.moonIllumination')} value={typeof thisEst.metrics.moonIlluminationFraction === 'number' ? `${Math.round(thisEst.metrics.moonIlluminationFraction * 100)}%` : '—'} />
                <MetricRow label={t('holidays.moonAltitude')} value={typeof thisEst.metrics.moonAltitudeDeg === 'number' ? `${thisEst.metrics.moonAltitudeDeg.toFixed(1)}°` : '—'} />
                <MetricRow label={t('holidays.moonElongation')} value={typeof thisEst.metrics.moonElongationDeg === 'number' ? `${thisEst.metrics.moonElongationDeg.toFixed(1)}°` : '—'} />
                <MetricRow label={t('holidays.moonAge')} value={typeof thisEst.metrics.moonAgeHours === 'number' ? `${thisEst.metrics.moonAgeHours.toFixed(1)}h` : '—'} />
                <div className="border-t border-slate-100 pt-1 mt-1">
                  <MetricRow label={t('probability.sunsetLocal')} value={fmtLocalTime(thisEst.metrics.sunsetUtcIso) ?? '—'} />
                  <MetricRow label={t('probability.moonsetLocal')} value={fmtLocalTime(thisEst.metrics.moonsetUtcIso) ?? '—'} />
                </div>
              </div>
            ) : <div className="text-xs text-slate-500">—</div>}
          </div>
        );
      })() : null}

      <LocationPicker />

      <div className="text-xs text-slate-600">
        {t('app.method.label')}: {t(`app.method.${methodId}`)}
      </div>

      {methodId === 'civil' || methodId === 'estimate' || methodId === 'yallop' || methodId === 'odeh' ? (
        <div className="space-y-2 text-xs text-slate-600">
          <div>{t('probability.disclaimer')}</div>

          <div className="card p-3">
            <div className="text-xs font-semibold text-slate-900">{t('probability.legendTitle')}</div>
            <div className="mt-2 space-y-2 leading-relaxed">
              {(['noChance', 'veryLow', 'low', 'medium', 'high'] as VisibilityStatusKey[]).map((k) => {
                const style = likelihoodStyle(k);
                return (
                  <div key={k} className="flex flex-wrap items-start gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${style.badgeClass}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${style.dotClass}`} />
                      {t(`probability.${k}`)}
                    </span>
                    <span className="text-slate-600">{t(`probability.${k}Desc`)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
