import {
  estimateMonthStartLikelihoodAtSunset,
  getCivilHolidaysForGregorianYearWithEstimate,
  meetsCrescentVisibilityCriteriaAtSunset
} from '@hijri/calendar-engine';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LocationPicker from '../components/LocationPicker';
import { useAppLocation } from '../location/LocationContext';
import { useMethod } from '../method/MethodContext';
import { getTimeZoneForLocation } from '../timezone';

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

export default function HolidaysPage() {
  const { t, i18n } = useTranslation();
  const { methodId } = useMethod();
  const { location } = useAppLocation();
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);

  const timeZone = useMemo(
    () => getTimeZoneForLocation(location.latitude, location.longitude),
    [location.latitude, location.longitude]
  );

  const localTimeFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(i18n.language, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
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

  const holidays = useMemo(() => {
    if (methodId === 'civil' || methodId === 'estimate') {
      return getCivilHolidaysForGregorianYearWithEstimate(year, {
        latitude: location.latitude,
        longitude: location.longitude
      });
    }
    return [];
  }, [year, methodId, location.latitude, location.longitude]);

  const renderMoonStatusForEveBefore = (label: string, shownDate: { year: number; month: number; day: number }) => {
    // The evening estimate on date D affects the next Gregorian date D+1.
    // To explain why a shown date is the start of a month (or differs), we display the estimate
    // for the *eve before* the shown date.
    const eve = addDaysUtc(shownDate, -1);

    const est = estimateMonthStartLikelihoodAtSunset(
      { year: eve.year, month: eve.month, day: eve.day },
      { latitude: location.latitude, longitude: location.longitude }
    );

    const likelihoodLabel = t(`probability.${est.likelihood}`);
    const visibility = typeof est.metrics.visibilityPercent === 'number' ? `${est.metrics.visibilityPercent}%` : '—';
    const sunsetLocal = fmtLocalTime(est.metrics.sunsetUtcIso) ?? '—';
    const moonsetLocal = fmtLocalTime(est.metrics.moonsetUtcIso) ?? '—';
    const lag = typeof est.metrics.lagMinutes === 'number' ? `${Math.round(est.metrics.lagMinutes)}m` : '—';
    const alt = typeof est.metrics.moonAltitudeDeg === 'number' ? `${est.metrics.moonAltitudeDeg.toFixed(1)}°` : '—';
    const elong = typeof est.metrics.moonElongationDeg === 'number' ? `${est.metrics.moonElongationDeg.toFixed(1)}°` : '—';
    const age = typeof est.metrics.moonAgeHours === 'number' ? `${est.metrics.moonAgeHours.toFixed(1)}h` : '—';
    const illum =
      typeof est.metrics.moonIlluminationFraction === 'number'
        ? `${Math.round(est.metrics.moonIlluminationFraction * 100)}%`
        : '—';

    const showMonthStartRuleNote = meetsCrescentVisibilityCriteriaAtSunset(est);

    return (
      <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-[11px] text-slate-700">
        <div className="font-medium">{t('holidays.moonStatus')}: {label} <span className="text-slate-500">({t('holidays.eveOf')} {fmtGregorianIso(eve)})</span></div>
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
          <span>
            {t('holidays.eveningEstimate')}: {likelihoodLabel} ({visibility})
          </span>
          <span>
            {t('probability.sunsetLocal')}: {sunsetLocal}
          </span>
          <span>
            {t('probability.moonsetLocal')}: {moonsetLocal}
          </span>
          <span>
            {t('probability.lagMinutes')}: {lag}
          </span>
          <span>
            {t('holidays.moonAltitude')}: {alt}
          </span>
          <span>
            {t('holidays.moonElongation')}: {elong}
          </span>
          <span>
            {t('holidays.moonAge')}: {age}
          </span>
          <span>
            {t('holidays.moonIllumination')}: {illum}
          </span>
        </div>
        {showMonthStartRuleNote && (
          <div className="mt-1 text-slate-600">
            {t('holidays.monthStartRuleNote')}
          </div>
        )}
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

              {methodId === 'estimate' && h.estimatedGregorian && h.estimatedHijri ? (
                <>
                  <div className="mt-1 text-xs text-slate-600">
                    <span className="muted">{t('holidays.estimated')}:</span>{' '}
                    {fmtGregorianIso(h.estimatedGregorian)} —{' '}
                    {h.estimatedHijri.day}/{h.estimatedHijri.month}/{h.estimatedHijri.year}
                  </div>
                  {renderMoonStatusForEveBefore(t('holidays.estimated'), h.estimatedGregorian)}

                  <div className="mt-2 text-xs text-slate-600">
                    <span className="muted">{t('holidays.civil')}:</span>{' '}
                    {fmtGregorianIso(h.gregorian)} —{' '}
                    {h.hijri.day}/{h.hijri.month}/{h.hijri.year}
                  </div>
                  {renderMoonStatusForEveBefore(t('holidays.civil'), h.gregorian)}
                </>
              ) : (
                <>
                  <div className="mt-1 text-xs text-slate-600">
                    <span className="muted">{t('holidays.civil')}:</span>{' '}
                    {fmtGregorianIso(h.gregorian)} —{' '}
                    {h.hijri.day}/{h.hijri.month}/{h.hijri.year}
                  </div>

                  {renderMoonStatusForEveBefore(t('holidays.civil'), h.gregorian)}

                  {h.estimatedGregorian && h.estimatedHijri ? (
                    <>
                      <div className="mt-2 text-xs text-slate-600">
                        <span className="muted">{t('holidays.estimated')}:</span>{' '}
                        {fmtGregorianIso(h.estimatedGregorian)} —{' '}
                        {h.estimatedHijri.day}/{h.estimatedHijri.month}/{h.estimatedHijri.year}
                      </div>
                      {renderMoonStatusForEveBefore(t('holidays.estimated'), h.estimatedGregorian)}
                    </>
                  ) : null}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      <LocationPicker />

      <div className="text-xs text-slate-600">
        {t('app.method.label')}: {t(`app.method.${methodId}`)}
      </div>
    </div>
  );
}
