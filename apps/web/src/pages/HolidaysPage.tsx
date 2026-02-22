import {
  estimateMonthStartLikelihoodAtSunset,
  getCivilHolidaysForGregorianYearWithEstimate,
  getMonthStartSignalLevel,
  meetsCrescentVisibilityCriteriaAtSunset
} from '@hijri/calendar-engine';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LocationPicker from '../components/LocationPicker';
import { useAppLocation } from '../location/LocationContext';
import { useMethod } from '../method/MethodContext';

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

function fmtGregorianIso(d: { year: number; month: number; day: number }): string {
  return `${d.year}-${pad2(d.month)}-${pad2(d.day)}`;
}

function addDaysUtc(d: { year: number; month: number; day: number }, deltaDays: number): { year: number; month: number; day: number } {
  const dt = new Date(Date.UTC(d.year, d.month - 1, d.day, 0, 0, 0));
  dt.setUTCDate(dt.getUTCDate() + deltaDays);
  return { year: dt.getUTCFullYear(), month: dt.getUTCMonth() + 1, day: dt.getUTCDate() };
}

function utcKey(d: { year: number; month: number; day: number }): number {
  return Date.UTC(d.year, d.month - 1, d.day, 0, 0, 0);
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

function likelihoodStyle(likelihood: string): { badgeClass: string; dotClass: string } {
  if (likelihood === 'noChance') {
    return { badgeClass: 'bg-slate-100 text-slate-800 ring-1 ring-slate-200', dotClass: 'bg-slate-500' };
  }
  if (likelihood === 'veryLow') {
    return { badgeClass: 'bg-rose-50 text-rose-700 ring-1 ring-rose-100', dotClass: 'bg-rose-400' };
  }
  if (likelihood === 'high') {
    return { badgeClass: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200', dotClass: 'bg-emerald-500' };
  }
  if (likelihood === 'medium') {
    return { badgeClass: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200', dotClass: 'bg-amber-500' };
  }
  if (likelihood === 'low') {
    return { badgeClass: 'bg-rose-50 text-rose-800 ring-1 ring-rose-200', dotClass: 'bg-rose-500' };
  }
  return { badgeClass: 'bg-slate-50 text-slate-700 ring-1 ring-slate-200', dotClass: 'bg-slate-400' };
}

export default function HolidaysPage() {
  const { t } = useTranslation();
  const { methodId } = useMethod();
  const { location } = useAppLocation();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);

  const holidays = useMemo(() => {
    if (methodId === 'civil' || methodId === 'estimate') {
      return getCivilHolidaysForGregorianYearWithEstimate(year, {
        latitude: location.latitude,
        longitude: location.longitude
      });
    }
    return [];
  }, [year, methodId, location.latitude, location.longitude]);

  const renderCandidateDates = (
    eventDate: { year: number; month: number; day: number },
    hijri: { year: number; month: number; day: number },
    preferredEventDate?: { year: number; month: number; day: number }
  ) => {
    // For events that aren't on Hijri day 1, the uncertainty comes from when the Hijri month starts.
    // So we score candidate *month start* dates (1/{month}/{year}), then shift by (hijri.day - 1).
    const offsetDays = Math.max(0, hijri.day - 1);

    const baseMonthStart = addDaysUtc(eventDate, -offsetDays);
    const preferredMonthStart = preferredEventDate ? addDaysUtc(preferredEventDate, -offsetDays) : undefined;

    const a = baseMonthStart;
    const b = preferredMonthStart ?? baseMonthStart;
    const start = utcKey(a) <= utcKey(b) ? a : b;
    const end = utcKey(a) <= utcKey(b) ? b : a;

    const monthStartDays: { year: number; month: number; day: number }[] = [];
    let cursor = start;
    while (utcKey(cursor) <= utcKey(end)) {
      monthStartDays.push(cursor);
      cursor = addDaysUtc(cursor, 1);
    }
    while (monthStartDays.length < 3) {
      monthStartDays.push(addDaysUtc(monthStartDays[monthStartDays.length - 1], 1));
    }

    let candidates = monthStartDays
      .map((monthStart) => {
        const eve = addDaysUtc(monthStart, -1);
        const est = estimateMonthStartLikelihoodAtSunset(
          { year: eve.year, month: eve.month, day: eve.day },
          { latitude: location.latitude, longitude: location.longitude }
        );

        const statusKey = visibilityStatusFromEstimate(est);
        if (statusKey === 'noChance') return null;

        const percent = typeof est.metrics.visibilityPercent === 'number' ? clamp0to100(est.metrics.visibilityPercent) : null;
        const lagMinutes = typeof est.metrics.lagMinutes === 'number' ? Math.round(est.metrics.lagMinutes) : null;
        const illumPercent =
          typeof est.metrics.moonIlluminationFraction === 'number'
            ? Math.round(est.metrics.moonIlluminationFraction * 100)
            : null;

        const event = addDaysUtc(monthStart, offsetDays);

        return {
          monthStart,
          monthStartIso: fmtGregorianIso(monthStart),
          eveIso: fmtGregorianIso(eve),
          event,
          eventIso: fmtGregorianIso(event),
          statusKey,
          style: likelihoodStyle(statusKey),
          percent,
          lagMinutes,
          illumPercent,
          showMonthStartRuleNote: meetsCrescentVisibilityCriteriaAtSunset(est)
        };
      })
      .filter((x): x is NonNullable<typeof x> => Boolean(x));

    // If we already have a strong signal (High or Very high), suppress later candidates.
    const firstStrongIdx = candidates.findIndex((c) => c.statusKey === 'medium' || c.statusKey === 'high');
    if (firstStrongIdx >= 0) candidates = candidates.slice(0, firstStrongIdx + 1);

    if (candidates.length === 0) return null;

    const isMonthStartEvent = hijri.day === 1;
    const monthStartLabel = `${1}/${hijri.month}/${hijri.year}`;

    return (
      <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-700">
        <div className="font-medium">
          {isMonthStartEvent ? t('probability.monthStartSignalFor') : t('holidays.possibleEventDates')}:
        </div>
        {!isMonthStartEvent ? (
          <div className="mt-0.5 text-[11px] text-slate-600">
            {t('holidays.dependsOnMonthStart')}: {monthStartLabel}
          </div>
        ) : null}

        <div className="mt-1 space-y-1">
          {candidates.map((c) => (
            <div key={c.eventIso} className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-semibold text-slate-900">{isMonthStartEvent ? c.monthStartIso : c.eventIso}</span>

              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${c.style.badgeClass}`}
                title={`${t('probability.monthStartSignalFor')}: ${c.monthStartIso} (${t('holidays.eveOf')} ${c.eveIso}) — ${t(`probability.${c.statusKey}`)}${typeof c.percent === 'number' ? ` (${t('probability.crescentScore')}: ${c.percent}%)` : ''}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${c.style.dotClass}`} />
                {t(`probability.${c.statusKey}`)}
              </span>

              {typeof c.percent === 'number' ? <span className="text-[11px] text-slate-600">{c.percent}%</span> : null}
              {typeof c.lagMinutes === 'number' ? (
                <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200" title={t('probability.lagMinutes')}>
                  {c.lagMinutes}m
                </span>
              ) : null}
              {typeof c.illumPercent === 'number' ? (
                <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 ring-1 ring-slate-200" title={t('holidays.moonIllumination')}>
                  {c.illumPercent}%
                </span>
              ) : null}

              <span className="text-[11px] text-slate-500">
                ({t('probability.basedOn')}: {t('holidays.eveOf')} {c.eveIso}
                {!isMonthStartEvent ? `; ${t('holidays.monthStart')}: ${c.monthStartIso}` : ''})
              </span>
            </div>
          ))}
        </div>

        {candidates.some((c) => c.showMonthStartRuleNote) ? (
          <div className="mt-1 text-slate-600">{t('holidays.monthStartRuleNote')}</div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="muted">{t('calendar.year')}</div>
          <div className="text-2xl font-semibold tracking-tight">{t('holidays.title')}</div>
        </div>
        <input
          className="control w-32"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          aria-label={t('calendar.year')}
        />
      </div>

      <div className="card">
        <div className="grid grid-cols-1 divide-y divide-slate-200">
          {holidays.map((h) => (
            <div
              key={`${h.id}-${h.gregorian.year}-${h.gregorian.month}-${h.gregorian.day}`}
              className="p-3"
            >
              <div className="text-sm font-medium">{t(h.nameKey)}</div>

              {methodId === 'estimate' ? (
                <>
                  {renderCandidateDates(h.gregorian, h.hijri, h.estimatedGregorian ?? undefined)}
                </>
              ) : (
                <div className="mt-1 text-xs text-slate-600">
                  <span className="text-slate-900 font-semibold">{fmtGregorianIso(h.gregorian)}</span>
                  {' — '}
                  {h.hijri.day}/{h.hijri.month}/{h.hijri.year}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {methodId === 'estimate' ? <LocationPicker /> : null}

      <div className="text-xs text-slate-600">
        {t('app.method.label')}: {t(`app.method.${methodId}`)}
      </div>
    </div>
  );
}
