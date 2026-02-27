/**
 * Official Saudi Arabia Ramadan 1 start dates, based on sighting committee announcements.
 *
 * Source: Saudi Supreme Court / Hilal Sighting Committee public announcements.
 * The 2024–2025 entries are corroborated by moonsighting.com (FCNA / Umm al-Qura calendar).
 */
export interface SaudiRamadanRecord {
  /** Gregorian date string (ISO 8601, YYYY-MM-DD) */
  gregorian: string;
  /** Hijri year (AH) */
  hijriYear: number;
  /** Gregorian day-of-week abbreviation (English) for display */
  weekday: string;
}

export const SAUDI_RAMADAN_HISTORY: SaudiRamadanRecord[] = [
  { gregorian: '2006-09-23', hijriYear: 1427, weekday: 'Sat' },
  { gregorian: '2007-09-13', hijriYear: 1428, weekday: 'Thu' },
  { gregorian: '2008-09-01', hijriYear: 1429, weekday: 'Mon' },
  { gregorian: '2009-08-22', hijriYear: 1430, weekday: 'Sat' },
  { gregorian: '2010-08-11', hijriYear: 1431, weekday: 'Wed' },
  { gregorian: '2011-08-01', hijriYear: 1432, weekday: 'Mon' },
  { gregorian: '2012-07-20', hijriYear: 1433, weekday: 'Fri' },
  { gregorian: '2013-07-10', hijriYear: 1434, weekday: 'Wed' },
  { gregorian: '2014-06-29', hijriYear: 1435, weekday: 'Sun' },
  { gregorian: '2015-06-18', hijriYear: 1436, weekday: 'Thu' },
  { gregorian: '2016-06-06', hijriYear: 1437, weekday: 'Mon' },
  { gregorian: '2017-05-27', hijriYear: 1438, weekday: 'Sat' },
  { gregorian: '2018-05-17', hijriYear: 1439, weekday: 'Thu' },
  { gregorian: '2019-05-06', hijriYear: 1440, weekday: 'Mon' },
  { gregorian: '2020-04-24', hijriYear: 1441, weekday: 'Fri' },
  { gregorian: '2021-04-13', hijriYear: 1442, weekday: 'Tue' },
  { gregorian: '2022-04-02', hijriYear: 1443, weekday: 'Sat' },
  { gregorian: '2023-03-23', hijriYear: 1444, weekday: 'Thu' },
  { gregorian: '2024-03-11', hijriYear: 1445, weekday: 'Mon' },
  { gregorian: '2025-03-01', hijriYear: 1446, weekday: 'Sat' },
  { gregorian: '2026-02-18', hijriYear: 1447, weekday: 'Wed' },
];
