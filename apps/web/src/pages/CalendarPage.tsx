import {
  buildEstimatedHijriCalendarRange,
  estimateMonthStartLikelihoodAtSunset,
  gregorianToHijriCivil,
  meetsCrescentVisibilityCriteriaAtSunset
} from '@hijri/calendar-engine';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import LocationPicker from '../components/LocationPicker';
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
  moonAltitudeDeg?: number;
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
  isToday: boolean;
  isHijriMonthStart: boolean;
  isPotentialMonthStartEve: boolean;
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

type CalendarTab = 'calendar' | 'details';

export default function CalendarPage() {
  const { t, i18n } = useTranslation();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
  const [tab, setTab] = useState<CalendarTab>('calendar');
  const { location } = useAppLocation();
  const { methodId } = useMethod();

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
    if (methodId === 'estimate') {
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
        { monthStartRule: 'geometric' }
      );

      for (const item of calendar) {
        estimatedByIso.set(isoDate(item.gregorian.year, item.gregorian.month, item.gregorian.day), item.hijri);
      }
    }

    // Precompute evening estimates for all days in the month (+ the day before),
    // so we can show a per-day details table and a subtle month-start "heat".
    const estimateByIso = new Map<string, ReturnType<typeof estimateMonthStartLikelihoodAtSunset>>();
    const estimateStart = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
    estimateStart.setUTCDate(estimateStart.getUTCDate() - 1);
    const estimateEnd = new Date(Date.UTC(year, month - 1, dim, 0, 0, 0));

    for (let dt = new Date(estimateStart); dt.getTime() <= estimateEnd.getTime(); ) {
      const y = dt.getUTCFullYear();
      const m = dt.getUTCMonth() + 1;
      const d = dt.getUTCDate();
      const key = isoDate(y, m, d);
      estimateByIso.set(
        key,
        estimateMonthStartLikelihoodAtSunset(
          { year: y, month: m, day: d },
          { latitude: location.latitude, longitude: location.longitude }
        )
      );
      dt.setUTCDate(dt.getUTCDate() + 1);
    }

    const getHijriForDay = (d: number) => {
      const iso = isoDate(year, month, d);
      if (methodId === 'civil') return gregorianToHijriCivil({ year, month, day: d });
      if (methodId === 'estimate') return estimatedByIso.get(iso) ?? null;
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
      if (!meetsCrescentVisibilityCriteriaAtSunset(est)) return 0;
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

    for (let d = 1; d <= dim; d += 1) {
      const h = getHijriForDay(d);
      const hijriText = h ? `${h.day}/${h.month}/${h.year}` : '—';

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
        moonAltitudeDeg: est?.metrics.moonAltitudeDeg,
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
          : methodId === 'estimate'
            ? (estimatedByIso.get(isoDate(nextDate.getFullYear(), nextDate.getMonth() + 1, nextDate.getDate())) ?? null)
            : null;

      const isPotentialMonthStartEve = nextHijri ? nextHijri.day === 1 : false;
      const isToday = year === todayY && month === todayM && d === todayD;
      const isHijriMonthStart = h ? h.day === 1 : false;

      days.push({
        day: d,
        hijri: hijriText,
        isToday,
        isHijriMonthStart,
        isPotentialMonthStartEve
      });
    }

    return { month, days, offset, heatByDay, details, estimateByIso };
  }, [location.latitude, location.longitude, methodId, month, year, todayD, todayM, todayY]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="muted">{t('calendar.year')}</div>
          <div className="text-3xl font-semibold tracking-tight">{year}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className="btn-sm" onClick={goPrevMonth} aria-label={t('calendar.prevMonth')}>
            {t('calendar.prevMonthShort')}
          </button>
          <select
            className="control-sm w-40"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            aria-label={t('calendar.month')}
          >
            {monthOptions.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <input
            className="control-sm w-28"
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            aria-label={t('calendar.year')}
          />
          <button type="button" className="btn-sm" onClick={goNextMonth} aria-label={t('calendar.nextMonth')}>
            {t('calendar.nextMonthShort')}
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={`btn-sm ${tab === 'calendar' ? 'bg-slate-100' : ''}`}
          onClick={() => setTab('calendar')}
        >
          {t('calendar.tabCalendar')}
        </button>
        <button
          type="button"
          className={`btn-sm ${tab === 'details' ? 'bg-slate-100' : ''}`}
          onClick={() => setTab('details')}
        >
          {t('calendar.tabDetails')}
        </button>
      </div>

      {tab === 'calendar' ? (
        <section className="card">
          <div className="card-header">
            {new Date(year, monthData.month - 1, 1).toLocaleString(i18n.language, { month: 'long', year: 'numeric' })}
          </div>
          <div className="grid grid-cols-7 gap-px bg-slate-200 p-px">
            {weekdayLabels.map((w) => (
              <div key={w} className="bg-slate-50 px-2 py-2 text-center text-xs font-semibold text-slate-700">
                {w}
              </div>
            ))}
            {Array.from({ length: monthData.offset }, (_, idx) => (
              <div key={`blank-${monthData.month}-${idx}`} className="bg-white p-2" />
            ))}
            {monthData.days.map((d) => {
              const heat = monthData.heatByDay.get(d.day);
              const bg = heat?.className ? heat.className : d.isHijriMonthStart ? 'bg-slate-50' : 'bg-white';

              const heatTitle = (() => {
                if (!heat) return undefined;

                const prev = new Date(Date.UTC(year, month - 1, d.day, 0, 0, 0));
                prev.setUTCDate(prev.getUTCDate() - 1);
                const prevIso = isoDate(prev.getUTCFullYear(), prev.getUTCMonth() + 1, prev.getUTCDate());

                const est = monthData.estimateByIso.get(prevIso);
                if (!est) return `${t('probability.crescentScore')}: ${heat.percent}%`;

                const likelihoodLabel = t(`probability.${est.likelihood}`);
                const visibilityPercent =
                  typeof est.metrics.visibilityPercent === 'number' ? est.metrics.visibilityPercent : heat.percent;

                const sunsetLocal = fmtLocalTime(est.metrics.sunsetUtcIso) ?? '—';
                const moonsetLocal = fmtLocalTime(est.metrics.moonsetUtcIso) ?? '—';
                const lagMinutes = typeof est.metrics.lagMinutes === 'number' ? Math.round(est.metrics.lagMinutes) : null;
                const alt = typeof est.metrics.moonAltitudeDeg === 'number' ? est.metrics.moonAltitudeDeg.toFixed(1) : null;
                const elong = typeof est.metrics.moonElongationDeg === 'number' ? est.metrics.moonElongationDeg.toFixed(1) : null;
                const age = typeof est.metrics.moonAgeHours === 'number' ? est.metrics.moonAgeHours.toFixed(1) : null;

                const lines: string[] = [];
                lines.push(t('holidays.monthStartRuleNote'));
                lines.push(`${t('holidays.eveOf')} ${prevIso}`);
                lines.push(`${t('probability.label')}: ${likelihoodLabel}`);
                lines.push(`${t('probability.crescentScore')}: ${visibilityPercent}%`);
                lines.push(`${t('probability.sunsetLocal')}: ${sunsetLocal}`);
                lines.push(`${t('probability.moonsetLocal')}: ${moonsetLocal}`);
                lines.push(`${t('probability.lagMinutes')}: ${lagMinutes ?? '—'}`);
                if (alt) lines.push(`${t('holidays.moonAltitude')}: ${alt}°`);
                if (elong) lines.push(`${t('holidays.moonElongation')}: ${elong}°`);
                if (age) lines.push(`${t('holidays.moonAge')}: ${age}h`);

                return lines.join('\n');
              })();

              return (
                <div
                  key={d.day}
                  className={
                    `${bg} p-2.5 text-start transition-colors hover:bg-slate-50 ` +
                    `${d.isToday ? 'ring-1 ring-slate-300' : ''}`
                  }
                  title={heatTitle}
                >
                  <div className="flex min-h-16 flex-col gap-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="text-base font-semibold leading-none text-slate-900">{d.day}</div>
                      <div className="text-[11px] leading-none text-slate-700">{d.hijri}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="card">
          <div className="card-header">
            <div className="card-title">{t('probability.eveningEstimate')}</div>
            <div className="text-xs text-slate-600">{t('probability.eveningEstimateHint')}</div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full border-separate border-spacing-0">
              <thead>
                <tr className="text-left text-xs font-semibold text-slate-700">
                  <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-2">{t('convert.gregorianDate')}</th>
                  <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-2">{t('convert.hijriDate')}</th>
                  <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-2">{t('probability.label')}</th>
                  <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-2">{t('probability.crescentScore')}</th>
                  <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-2">{t('holidays.moonIllumination')}</th>
                  <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-2">{t('holidays.moonAltitude')}</th>
                  <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-2">{t('holidays.moonElongation')}</th>
                  <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-2">{t('holidays.moonAge')}</th>
                  <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-2">{t('probability.sunriseLocal')}</th>
                  <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-2">{t('probability.sunsetLocal')}</th>
                  <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-2">{t('probability.moonriseLocal')}</th>
                  <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-2">{t('probability.moonsetLocal')}</th>
                  <th className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-2">{t('probability.lagMinutes')}</th>
                </tr>
              </thead>
              <tbody>
                {monthData.details.map((row) => (
                  <tr key={row.gregorianIso} className="text-xs text-slate-800">
                    <td className="border-b border-slate-100 px-3 py-2 font-medium text-slate-900 whitespace-nowrap">
                      {row.gregorianIso}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 whitespace-nowrap">{row.hijriText}</td>
                    <td className="border-b border-slate-100 px-3 py-2 whitespace-nowrap">{t(row.estimate.likelihoodKey)}</td>
                    <td className="border-b border-slate-100 px-3 py-2 whitespace-nowrap">
                      {typeof row.estimate.crescentScorePercent === 'number' ? `${row.estimate.crescentScorePercent}%` : '—'}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 whitespace-nowrap">
                      {typeof row.estimate.moonIlluminationPercent === 'number' ? `${row.estimate.moonIlluminationPercent}%` : '—'}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 whitespace-nowrap">
                      {typeof row.estimate.moonAltitudeDeg === 'number' ? `${row.estimate.moonAltitudeDeg.toFixed(1)}°` : '—'}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 whitespace-nowrap">
                      {typeof row.estimate.moonElongationDeg === 'number' ? `${row.estimate.moonElongationDeg.toFixed(1)}°` : '—'}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 whitespace-nowrap">
                      {typeof row.estimate.moonAgeHours === 'number' ? `${row.estimate.moonAgeHours.toFixed(1)}h` : '—'}
                    </td>
                    <td className="border-b border-slate-100 px-3 py-2 whitespace-nowrap">{fmtLocalTime(row.estimate.sunriseUtcIso) ?? '—'}</td>
                    <td className="border-b border-slate-100 px-3 py-2 whitespace-nowrap">{fmtLocalTime(row.estimate.sunsetUtcIso) ?? '—'}</td>
                    <td className="border-b border-slate-100 px-3 py-2 whitespace-nowrap">{fmtLocalTime(row.estimate.moonriseUtcIso) ?? '—'}</td>
                    <td className="border-b border-slate-100 px-3 py-2 whitespace-nowrap">{fmtLocalTime(row.estimate.moonsetUtcIso) ?? '—'}</td>
                    <td className="border-b border-slate-100 px-3 py-2 whitespace-nowrap">
                      {typeof row.estimate.lagMinutes === 'number' ? Math.round(row.estimate.lagMinutes) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <LocationPicker />

      <div className="text-xs text-slate-600">
        {t('app.method.label')}: {t(`app.method.${methodId}`)}
      </div>

      {methodId === 'civil' || methodId === 'estimate' ? (
        <div className="space-y-2 text-xs text-slate-600">
          <div>{t('probability.disclaimer')}</div>

          <div className="card p-3">
            <div className="text-xs font-semibold text-slate-900">{t('probability.legendTitle')}</div>
            <div className="mt-2 space-y-1 leading-relaxed">
              <div>{t('probability.lowDesc')}</div>
              <div>{t('probability.mediumDesc')}</div>
              <div>{t('probability.highDesc')}</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
