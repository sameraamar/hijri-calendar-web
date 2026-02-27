/**
 * Official month-start declarations from national authorities.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  AUTO-GENERATED — do not edit by hand.                                  │
 * │  Source: docs/data-collection/hijri_month_starts_template_1400_1447.csv │
 * │  Script: scripts/csv-to-declarations.mjs                               │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

export interface OfficialDeclaration {
  /** ISO-3166-1 alpha-2 (lowercase) – must match countries.ts ids */
  countryId: string;
  /** Hijri year (AH) */
  hijriYear: number;
  /** Hijri month (1–12) */
  hijriMonth: number;
  /** Gregorian date (ISO YYYY-MM-DD) */
  gregorian: string;
  /** Method used by the authority */
  method?: 'SightingConfirmed' | 'CalculatedCalendar' | 'Hybrid' | 'Unknown';
  /** Issuing body name */
  authority?: string;
  /** Confidence score 0-100 (see docs/data-collection/README) */
  confidence?: number;
}

// ---------------------------------------------------------------------------
// Saudi Arabia — Muharram, Ramadan, Shawwal, Dhu al-Hijjah — AH 1427–1447
// ---------------------------------------------------------------------------
const SA_DATA: OfficialDeclaration[] = [
  { countryId: 'sa', hijriYear: 1427, hijriMonth: 9, gregorian: '2006-09-23', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1428, hijriMonth: 9, gregorian: '2007-09-13', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1429, hijriMonth: 9, gregorian: '2008-09-01', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1430, hijriMonth: 9, gregorian: '2009-08-22', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1430, hijriMonth: 10, gregorian: '2009-09-20', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1430, hijriMonth: 12, gregorian: '2009-11-27', method: 'Unknown', confidence: 0.5 },
  { countryId: 'sa', hijriYear: 1431, hijriMonth: 9, gregorian: '2010-08-11', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1431, hijriMonth: 10, gregorian: '2010-09-10', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1431, hijriMonth: 12, gregorian: '2010-11-16', method: 'Unknown', confidence: 0.5 },
  { countryId: 'sa', hijriYear: 1432, hijriMonth: 9, gregorian: '2011-08-01', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1432, hijriMonth: 10, gregorian: '2011-08-30', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1432, hijriMonth: 12, gregorian: '2011-11-06', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1433, hijriMonth: 9, gregorian: '2012-07-20', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1433, hijriMonth: 10, gregorian: '2012-08-19', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1433, hijriMonth: 12, gregorian: '2012-10-26', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1434, hijriMonth: 9, gregorian: '2013-07-10', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1434, hijriMonth: 10, gregorian: '2013-08-08', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1434, hijriMonth: 12, gregorian: '2013-10-15', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1435, hijriMonth: 9, gregorian: '2014-06-29', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1435, hijriMonth: 10, gregorian: '2014-07-28', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'sa', hijriYear: 1435, hijriMonth: 12, gregorian: '2014-10-04', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'sa', hijriYear: 1436, hijriMonth: 1, gregorian: '2014-10-25', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'sa', hijriYear: 1436, hijriMonth: 9, gregorian: '2015-06-18', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1437, hijriMonth: 9, gregorian: '2016-06-06', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1438, hijriMonth: 9, gregorian: '2017-05-27', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1438, hijriMonth: 10, gregorian: '2017-06-25', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'sa', hijriYear: 1438, hijriMonth: 12, gregorian: '2017-09-01', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1439, hijriMonth: 9, gregorian: '2018-05-17', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1440, hijriMonth: 9, gregorian: '2019-05-06', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1441, hijriMonth: 9, gregorian: '2020-04-24', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1441, hijriMonth: 10, gregorian: '2020-05-23', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1441, hijriMonth: 12, gregorian: '2020-07-22', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'sa', hijriYear: 1442, hijriMonth: 9, gregorian: '2021-04-13', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1442, hijriMonth: 10, gregorian: '2021-05-13', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1442, hijriMonth: 12, gregorian: '2021-07-11', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1443, hijriMonth: 9, gregorian: '2022-04-02', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1443, hijriMonth: 10, gregorian: '2022-05-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1443, hijriMonth: 12, gregorian: '2022-06-30', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1444, hijriMonth: 9, gregorian: '2023-03-23', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1444, hijriMonth: 10, gregorian: '2023-04-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1445, hijriMonth: 9, gregorian: '2024-03-11', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1445, hijriMonth: 12, gregorian: '2024-06-08', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1446, hijriMonth: 9, gregorian: '2025-03-01', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1446, hijriMonth: 10, gregorian: '2025-03-31', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1446, hijriMonth: 12, gregorian: '2025-05-28', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1447, hijriMonth: 9, gregorian: '2026-02-18', method: 'SightingConfirmed', authority: 'Supreme Court', confidence: 90 },
  { countryId: 'sa', hijriYear: 1447, hijriMonth: 10, gregorian: '2026-03-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'sa', hijriYear: 1447, hijriMonth: 12, gregorian: '2026-05-18', method: 'SightingConfirmed', confidence: 0.8 },
];

// ---------------------------------------------------------------------------
// Egypt — Muharram, Ramadan, Shawwal, Dhu al-Hijjah — AH 1430–1443
// ---------------------------------------------------------------------------
const EG_DATA: OfficialDeclaration[] = [
  { countryId: 'eg', hijriYear: 1430, hijriMonth: 9, gregorian: '2009-08-22', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'eg', hijriYear: 1430, hijriMonth: 12, gregorian: '2009-11-27', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'eg', hijriYear: 1431, hijriMonth: 12, gregorian: '2010-11-16', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'eg', hijriYear: 1433, hijriMonth: 10, gregorian: '2012-08-19', method: 'Unknown', confidence: 0.5 },
  { countryId: 'eg', hijriYear: 1433, hijriMonth: 12, gregorian: '2012-10-26', method: 'Unknown', confidence: 0.5 },
  { countryId: 'eg', hijriYear: 1436, hijriMonth: 1, gregorian: '2014-10-25', method: 'Unknown', confidence: 0.5 },
  { countryId: 'eg', hijriYear: 1443, hijriMonth: 12, gregorian: '2022-06-30', method: 'SightingConfirmed', confidence: 0.8 },
];

// ---------------------------------------------------------------------------
// Türkiye — Muharram, Ramadan, Shawwal, Dhu al-Hijjah — AH 1430–1447
// ---------------------------------------------------------------------------
const TR_DATA: OfficialDeclaration[] = [
  { countryId: 'tr', hijriYear: 1430, hijriMonth: 9, gregorian: '2009-08-21', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1430, hijriMonth: 10, gregorian: '2009-09-20', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1431, hijriMonth: 10, gregorian: '2010-09-09', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'tr', hijriYear: 1431, hijriMonth: 12, gregorian: '2010-11-16', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1432, hijriMonth: 9, gregorian: '2011-08-01', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1433, hijriMonth: 9, gregorian: '2012-07-20', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1433, hijriMonth: 10, gregorian: '2012-08-19', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1434, hijriMonth: 10, gregorian: '2013-08-08', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1435, hijriMonth: 9, gregorian: '2014-06-28', method: 'Unknown', confidence: 0.5 },
  { countryId: 'tr', hijriYear: 1435, hijriMonth: 10, gregorian: '2014-07-28', method: 'Unknown', confidence: 0.5 },
  { countryId: 'tr', hijriYear: 1435, hijriMonth: 12, gregorian: '2014-10-04', method: 'Unknown', confidence: 0.5 },
  { countryId: 'tr', hijriYear: 1436, hijriMonth: 1, gregorian: '2014-10-25', method: 'Unknown', confidence: 0.5 },
  { countryId: 'tr', hijriYear: 1438, hijriMonth: 9, gregorian: '2017-05-27', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1438, hijriMonth: 10, gregorian: '2017-06-25', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1438, hijriMonth: 12, gregorian: '2017-09-01', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1439, hijriMonth: 9, gregorian: '2018-05-16', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1441, hijriMonth: 9, gregorian: '2020-04-24', method: 'Unknown', confidence: 0.5 },
  { countryId: 'tr', hijriYear: 1441, hijriMonth: 10, gregorian: '2020-05-23', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1441, hijriMonth: 12, gregorian: '2020-07-22', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1443, hijriMonth: 10, gregorian: '2022-05-02', method: 'Unknown', confidence: 0.5 },
  { countryId: 'tr', hijriYear: 1444, hijriMonth: 10, gregorian: '2023-04-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1445, hijriMonth: 12, gregorian: '2024-06-08', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1446, hijriMonth: 9, gregorian: '2025-03-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1446, hijriMonth: 10, gregorian: '2025-03-31', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1446, hijriMonth: 12, gregorian: '2025-05-28', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1447, hijriMonth: 9, gregorian: '2026-02-19', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1447, hijriMonth: 10, gregorian: '2026-03-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'tr', hijriYear: 1447, hijriMonth: 12, gregorian: '2026-05-18', method: 'SightingConfirmed', confidence: 0.8 },
];

// ---------------------------------------------------------------------------
// Palestine — Muharram, Ramadan, Shawwal, Dhu al-Hijjah — AH 1430–1447
// ---------------------------------------------------------------------------
const PS_DATA: OfficialDeclaration[] = [
  { countryId: 'ps', hijriYear: 1430, hijriMonth: 9, gregorian: '2009-08-22', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ps', hijriYear: 1430, hijriMonth: 10, gregorian: '2009-09-20', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1430, hijriMonth: 12, gregorian: '2009-11-27', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1431, hijriMonth: 9, gregorian: '2010-08-11', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1431, hijriMonth: 10, gregorian: '2010-09-10', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1431, hijriMonth: 12, gregorian: '2010-11-16', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1432, hijriMonth: 9, gregorian: '2011-08-01', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1432, hijriMonth: 10, gregorian: '2011-08-30', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1432, hijriMonth: 12, gregorian: '2011-11-06', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1433, hijriMonth: 9, gregorian: '2012-07-20', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1433, hijriMonth: 10, gregorian: '2012-08-19', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1433, hijriMonth: 12, gregorian: '2012-10-26', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1434, hijriMonth: 9, gregorian: '2013-07-10', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1434, hijriMonth: 10, gregorian: '2013-08-08', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1434, hijriMonth: 12, gregorian: '2013-10-15', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1435, hijriMonth: 9, gregorian: '2014-06-29', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1435, hijriMonth: 10, gregorian: '2014-07-28', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1435, hijriMonth: 12, gregorian: '2014-10-04', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1436, hijriMonth: 1, gregorian: '2014-10-25', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1438, hijriMonth: 9, gregorian: '2017-05-27', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1438, hijriMonth: 10, gregorian: '2017-06-25', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1438, hijriMonth: 12, gregorian: '2017-09-01', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1439, hijriMonth: 9, gregorian: '2018-05-17', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1441, hijriMonth: 9, gregorian: '2020-04-24', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1441, hijriMonth: 10, gregorian: '2020-05-23', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1441, hijriMonth: 12, gregorian: '2020-07-22', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1442, hijriMonth: 9, gregorian: '2021-04-13', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1442, hijriMonth: 10, gregorian: '2021-05-13', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1442, hijriMonth: 12, gregorian: '2021-07-11', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1443, hijriMonth: 10, gregorian: '2022-05-02', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1443, hijriMonth: 12, gregorian: '2022-06-30', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1444, hijriMonth: 10, gregorian: '2023-04-21', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1445, hijriMonth: 12, gregorian: '2024-06-08', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1446, hijriMonth: 9, gregorian: '2025-03-02', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1446, hijriMonth: 10, gregorian: '2025-03-31', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1446, hijriMonth: 12, gregorian: '2025-05-28', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1447, hijriMonth: 9, gregorian: '2026-02-19', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1447, hijriMonth: 10, gregorian: '2026-03-21', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ps', hijriYear: 1447, hijriMonth: 12, gregorian: '2026-05-18', method: 'CalculatedCalendar', confidence: 0.7 },
];

// ---------------------------------------------------------------------------
// Jordan — Muharram, Safar, Jumada al-Akhirah, Rajab, Ramadan, Shawwal, Dhu al-Hijjah — AH 1430–1447
// ---------------------------------------------------------------------------
const JO_DATA: OfficialDeclaration[] = [
  { countryId: 'jo', hijriYear: 1430, hijriMonth: 2, gregorian: '2009-01-28', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'jo', hijriYear: 1430, hijriMonth: 6, gregorian: '2009-05-26', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'jo', hijriYear: 1430, hijriMonth: 7, gregorian: '2009-06-25', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'jo', hijriYear: 1430, hijriMonth: 9, gregorian: '2009-08-22', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'jo', hijriYear: 1430, hijriMonth: 10, gregorian: '2009-09-20', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1430, hijriMonth: 12, gregorian: '2009-11-27', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1431, hijriMonth: 9, gregorian: '2010-08-11', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1431, hijriMonth: 10, gregorian: '2010-09-10', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1431, hijriMonth: 12, gregorian: '2010-11-16', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1432, hijriMonth: 9, gregorian: '2011-08-01', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1432, hijriMonth: 10, gregorian: '2011-08-30', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1432, hijriMonth: 12, gregorian: '2011-11-06', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1433, hijriMonth: 9, gregorian: '2012-07-20', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1433, hijriMonth: 10, gregorian: '2012-08-19', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1433, hijriMonth: 12, gregorian: '2012-10-26', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1434, hijriMonth: 9, gregorian: '2013-07-10', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1434, hijriMonth: 10, gregorian: '2013-08-08', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1434, hijriMonth: 12, gregorian: '2013-10-15', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1435, hijriMonth: 9, gregorian: '2014-06-29', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1435, hijriMonth: 10, gregorian: '2014-07-28', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1435, hijriMonth: 12, gregorian: '2014-10-04', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1436, hijriMonth: 1, gregorian: '2014-10-25', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1438, hijriMonth: 9, gregorian: '2017-05-27', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1438, hijriMonth: 10, gregorian: '2017-06-25', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1438, hijriMonth: 12, gregorian: '2017-09-01', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1439, hijriMonth: 9, gregorian: '2018-05-17', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1441, hijriMonth: 9, gregorian: '2020-04-24', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1441, hijriMonth: 10, gregorian: '2020-05-23', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1441, hijriMonth: 12, gregorian: '2020-07-22', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'jo', hijriYear: 1442, hijriMonth: 9, gregorian: '2021-04-13', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1442, hijriMonth: 10, gregorian: '2021-05-13', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1442, hijriMonth: 12, gregorian: '2021-07-11', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1443, hijriMonth: 10, gregorian: '2022-05-02', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1443, hijriMonth: 12, gregorian: '2022-06-30', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1444, hijriMonth: 10, gregorian: '2023-04-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'jo', hijriYear: 1445, hijriMonth: 12, gregorian: '2024-06-08', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1446, hijriMonth: 9, gregorian: '2025-03-02', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1446, hijriMonth: 10, gregorian: '2025-03-31', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1446, hijriMonth: 12, gregorian: '2025-05-28', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1447, hijriMonth: 9, gregorian: '2026-02-19', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1447, hijriMonth: 10, gregorian: '2026-03-21', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'jo', hijriYear: 1447, hijriMonth: 12, gregorian: '2026-05-18', method: 'CalculatedCalendar', confidence: 0.7 },
];

// ---------------------------------------------------------------------------
// Morocco — Muharram, Rabi al-Thani, Ramadan, Shawwal, Dhu al-Hijjah — AH 1430–1447
// ---------------------------------------------------------------------------
const MA_DATA: OfficialDeclaration[] = [
  { countryId: 'ma', hijriYear: 1430, hijriMonth: 4, gregorian: '2009-03-28', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'ma', hijriYear: 1430, hijriMonth: 9, gregorian: '2009-08-22', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1431, hijriMonth: 9, gregorian: '2010-08-12', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1431, hijriMonth: 12, gregorian: '2010-11-17', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1432, hijriMonth: 10, gregorian: '2011-08-31', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1432, hijriMonth: 12, gregorian: '2011-11-07', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1433, hijriMonth: 9, gregorian: '2012-07-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1433, hijriMonth: 10, gregorian: '2012-08-20', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1433, hijriMonth: 12, gregorian: '2012-10-26', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1434, hijriMonth: 9, gregorian: '2013-07-10', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1434, hijriMonth: 10, gregorian: '2013-08-09', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1435, hijriMonth: 10, gregorian: '2014-07-29', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1436, hijriMonth: 1, gregorian: '2014-10-26', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1438, hijriMonth: 9, gregorian: '2017-05-27', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1438, hijriMonth: 10, gregorian: '2017-06-26', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1438, hijriMonth: 12, gregorian: '2017-09-01', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1439, hijriMonth: 9, gregorian: '2018-05-17', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1440, hijriMonth: 9, gregorian: '2019-05-06', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ma', hijriYear: 1440, hijriMonth: 12, gregorian: '2019-08-02', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ma', hijriYear: 1441, hijriMonth: 9, gregorian: '2020-04-24', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1441, hijriMonth: 10, gregorian: '2020-05-23', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1441, hijriMonth: 12, gregorian: '2020-07-22', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1442, hijriMonth: 9, gregorian: '2021-04-13', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1442, hijriMonth: 10, gregorian: '2021-05-13', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1442, hijriMonth: 12, gregorian: '2021-07-11', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1443, hijriMonth: 10, gregorian: '2022-05-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1443, hijriMonth: 12, gregorian: '2022-06-30', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1444, hijriMonth: 10, gregorian: '2023-04-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1445, hijriMonth: 12, gregorian: '2024-06-08', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1446, hijriMonth: 9, gregorian: '2025-03-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1446, hijriMonth: 10, gregorian: '2025-03-31', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1446, hijriMonth: 12, gregorian: '2025-05-28', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1447, hijriMonth: 9, gregorian: '2026-02-19', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1447, hijriMonth: 10, gregorian: '2026-03-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ma', hijriYear: 1447, hijriMonth: 12, gregorian: '2026-05-18', method: 'SightingConfirmed', confidence: 0.8 },
];

// ---------------------------------------------------------------------------
// Libya — Muharram, Ramadan, Shawwal, Dhu al-Hijjah — AH 1430–1447
// ---------------------------------------------------------------------------
const LY_DATA: OfficialDeclaration[] = [
  { countryId: 'ly', hijriYear: 1430, hijriMonth: 9, gregorian: '2009-08-21', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'ly', hijriYear: 1430, hijriMonth: 10, gregorian: '2009-09-19', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'ly', hijriYear: 1431, hijriMonth: 9, gregorian: '2010-08-11', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'ly', hijriYear: 1431, hijriMonth: 10, gregorian: '2010-09-09', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'ly', hijriYear: 1431, hijriMonth: 12, gregorian: '2010-11-16', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ly', hijriYear: 1432, hijriMonth: 9, gregorian: '2011-08-01', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'ly', hijriYear: 1433, hijriMonth: 9, gregorian: '2012-07-20', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ly', hijriYear: 1433, hijriMonth: 10, gregorian: '2012-08-19', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ly', hijriYear: 1434, hijriMonth: 9, gregorian: '2013-07-10', method: 'CalculatedCalendar', confidence: 0.7 },
  { countryId: 'ly', hijriYear: 1434, hijriMonth: 10, gregorian: '2013-08-08', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'ly', hijriYear: 1435, hijriMonth: 9, gregorian: '2014-06-28', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ly', hijriYear: 1436, hijriMonth: 1, gregorian: '2014-10-25', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ly', hijriYear: 1438, hijriMonth: 9, gregorian: '2017-05-27', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1438, hijriMonth: 10, gregorian: '2017-06-25', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1438, hijriMonth: 12, gregorian: '2017-09-01', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1439, hijriMonth: 9, gregorian: '2018-05-17', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1439, hijriMonth: 10, gregorian: '2018-06-14', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1439, hijriMonth: 12, gregorian: '2018-08-12', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1440, hijriMonth: 9, gregorian: '2019-05-06', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1440, hijriMonth: 10, gregorian: '2019-06-04', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1441, hijriMonth: 9, gregorian: '2020-04-24', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1441, hijriMonth: 10, gregorian: '2020-05-23', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1441, hijriMonth: 12, gregorian: '2020-07-22', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1442, hijriMonth: 9, gregorian: '2021-04-13', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1442, hijriMonth: 10, gregorian: '2021-05-13', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1442, hijriMonth: 12, gregorian: '2021-07-11', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1443, hijriMonth: 10, gregorian: '2022-05-02', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1443, hijriMonth: 12, gregorian: '2022-06-30', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1444, hijriMonth: 10, gregorian: '2023-04-21', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1445, hijriMonth: 12, gregorian: '2024-06-08', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1446, hijriMonth: 9, gregorian: '2025-03-02', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1446, hijriMonth: 10, gregorian: '2025-03-31', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1446, hijriMonth: 12, gregorian: '2025-05-28', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1447, hijriMonth: 9, gregorian: '2026-02-19', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1447, hijriMonth: 10, gregorian: '2026-03-21', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'ly', hijriYear: 1447, hijriMonth: 12, gregorian: '2026-05-18', method: 'SightingConfirmed', confidence: 0.9 },
];

// ---------------------------------------------------------------------------
// South Africa — Muharram, Jumada al-Ula, Jumada al-Akhirah, Rajab, Ramadan, Shawwal, Dhu al-Hijjah — AH 1430–1447
// ---------------------------------------------------------------------------
const ZA_DATA: OfficialDeclaration[] = [
  { countryId: 'za', hijriYear: 1430, hijriMonth: 5, gregorian: '2009-04-27', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'za', hijriYear: 1430, hijriMonth: 6, gregorian: '2009-05-26', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'za', hijriYear: 1430, hijriMonth: 7, gregorian: '2009-06-24', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'za', hijriYear: 1430, hijriMonth: 9, gregorian: '2009-08-22', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'za', hijriYear: 1430, hijriMonth: 10, gregorian: '2009-09-20', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1430, hijriMonth: 12, gregorian: '2009-11-27', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1431, hijriMonth: 9, gregorian: '2010-08-12', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1431, hijriMonth: 12, gregorian: '2010-11-17', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1432, hijriMonth: 9, gregorian: '2011-08-01', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1432, hijriMonth: 10, gregorian: '2011-08-31', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1433, hijriMonth: 9, gregorian: '2012-07-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1433, hijriMonth: 12, gregorian: '2012-10-26', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1434, hijriMonth: 9, gregorian: '2013-07-10', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1434, hijriMonth: 10, gregorian: '2013-08-09', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1434, hijriMonth: 12, gregorian: '2013-10-16', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1435, hijriMonth: 9, gregorian: '2014-06-29', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1435, hijriMonth: 10, gregorian: '2014-07-28', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1435, hijriMonth: 12, gregorian: '2014-10-04', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1436, hijriMonth: 1, gregorian: '2014-10-26', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1438, hijriMonth: 9, gregorian: '2017-05-27', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1438, hijriMonth: 10, gregorian: '2017-06-26', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1438, hijriMonth: 12, gregorian: '2017-09-01', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1439, hijriMonth: 9, gregorian: '2018-05-17', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1440, hijriMonth: 9, gregorian: '2019-05-06', method: 'Unknown', confidence: 0.5 },
  { countryId: 'za', hijriYear: 1440, hijriMonth: 12, gregorian: '2019-08-02', method: 'Unknown', confidence: 0.5 },
  { countryId: 'za', hijriYear: 1441, hijriMonth: 9, gregorian: '2020-04-24', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1441, hijriMonth: 10, gregorian: '2020-05-23', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1441, hijriMonth: 12, gregorian: '2020-07-22', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1442, hijriMonth: 9, gregorian: '2021-04-13', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1442, hijriMonth: 10, gregorian: '2021-05-13', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1442, hijriMonth: 12, gregorian: '2021-07-11', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1443, hijriMonth: 10, gregorian: '2022-05-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1443, hijriMonth: 12, gregorian: '2022-06-30', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1444, hijriMonth: 10, gregorian: '2023-04-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1445, hijriMonth: 12, gregorian: '2024-06-08', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1446, hijriMonth: 9, gregorian: '2025-03-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1446, hijriMonth: 10, gregorian: '2025-03-31', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1446, hijriMonth: 12, gregorian: '2025-05-28', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1447, hijriMonth: 9, gregorian: '2026-02-19', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1447, hijriMonth: 10, gregorian: '2026-03-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'za', hijriYear: 1447, hijriMonth: 12, gregorian: '2026-05-18', method: 'SightingConfirmed', confidence: 0.8 },
];

// ---------------------------------------------------------------------------
// Nigeria — Ramadan — AH 1430–1430
// ---------------------------------------------------------------------------
const NG_DATA: OfficialDeclaration[] = [
  { countryId: 'ng', hijriYear: 1430, hijriMonth: 9, gregorian: '2009-08-22', method: 'SightingConfirmed', confidence: 0.6 },
];

// ---------------------------------------------------------------------------
// Malaysia — Muharram, Ramadan, Shawwal, Dhu al-Hijjah — AH 1430–1447
// ---------------------------------------------------------------------------
const MY_DATA: OfficialDeclaration[] = [
  { countryId: 'my', hijriYear: 1430, hijriMonth: 10, gregorian: '2009-09-20', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'my', hijriYear: 1431, hijriMonth: 9, gregorian: '2010-08-11', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'my', hijriYear: 1431, hijriMonth: 12, gregorian: '2010-11-17', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'my', hijriYear: 1432, hijriMonth: 9, gregorian: '2011-08-01', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'my', hijriYear: 1433, hijriMonth: 9, gregorian: '2012-07-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'my', hijriYear: 1433, hijriMonth: 10, gregorian: '2012-08-19', method: 'Unknown', confidence: 0.5 },
  { countryId: 'my', hijriYear: 1433, hijriMonth: 12, gregorian: '2012-10-27', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'my', hijriYear: 1434, hijriMonth: 9, gregorian: '2013-07-10', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'my', hijriYear: 1434, hijriMonth: 10, gregorian: '2013-08-08', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'my', hijriYear: 1435, hijriMonth: 10, gregorian: '2014-07-29', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'my', hijriYear: 1435, hijriMonth: 12, gregorian: '2014-10-04', method: 'Unknown', confidence: 0.5 },
  { countryId: 'my', hijriYear: 1436, hijriMonth: 1, gregorian: '2014-10-25', method: 'Unknown', confidence: 0.5 },
  { countryId: 'my', hijriYear: 1438, hijriMonth: 9, gregorian: '2017-05-27', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1438, hijriMonth: 10, gregorian: '2017-06-25', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1438, hijriMonth: 12, gregorian: '2017-09-01', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1439, hijriMonth: 9, gregorian: '2018-05-16', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1439, hijriMonth: 10, gregorian: '2018-06-14', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1439, hijriMonth: 12, gregorian: '2018-08-12', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1440, hijriMonth: 9, gregorian: '2019-05-06', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1440, hijriMonth: 10, gregorian: '2019-06-04', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1440, hijriMonth: 12, gregorian: '2019-08-02', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1441, hijriMonth: 9, gregorian: '2020-04-24', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1441, hijriMonth: 10, gregorian: '2020-05-23', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1441, hijriMonth: 12, gregorian: '2020-07-22', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1442, hijriMonth: 9, gregorian: '2021-04-13', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1442, hijriMonth: 10, gregorian: '2021-05-13', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1442, hijriMonth: 12, gregorian: '2021-07-11', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1443, hijriMonth: 10, gregorian: '2022-05-02', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1443, hijriMonth: 12, gregorian: '2022-06-30', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1444, hijriMonth: 10, gregorian: '2023-04-21', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1445, hijriMonth: 12, gregorian: '2024-06-08', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1446, hijriMonth: 9, gregorian: '2025-03-02', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1446, hijriMonth: 10, gregorian: '2025-03-31', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1446, hijriMonth: 12, gregorian: '2025-05-28', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1447, hijriMonth: 9, gregorian: '2026-02-19', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1447, hijriMonth: 10, gregorian: '2026-03-21', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'my', hijriYear: 1447, hijriMonth: 12, gregorian: '2026-05-18', method: 'SightingConfirmed', confidence: 0.9 },
];

// ---------------------------------------------------------------------------
// Pakistan — Muharram, Safar, Rabi al-Awwal, Rabi al-Thani, Jumada al-Ula, Jumada al-Akhirah, Rajab, Shaban, Ramadan, Shawwal, Dhu al-Hijjah — AH 1430–1447
// ---------------------------------------------------------------------------
const PK_DATA: OfficialDeclaration[] = [
  { countryId: 'pk', hijriYear: 1430, hijriMonth: 1, gregorian: '2008-12-30', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'pk', hijriYear: 1430, hijriMonth: 2, gregorian: '2009-01-28', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'pk', hijriYear: 1430, hijriMonth: 3, gregorian: '2009-02-27', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'pk', hijriYear: 1430, hijriMonth: 4, gregorian: '2009-03-29', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'pk', hijriYear: 1430, hijriMonth: 5, gregorian: '2009-04-27', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'pk', hijriYear: 1430, hijriMonth: 6, gregorian: '2009-05-26', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'pk', hijriYear: 1430, hijriMonth: 7, gregorian: '2009-06-25', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'pk', hijriYear: 1430, hijriMonth: 8, gregorian: '2009-07-24', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'pk', hijriYear: 1430, hijriMonth: 9, gregorian: '2009-08-23', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1430, hijriMonth: 10, gregorian: '2009-09-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1430, hijriMonth: 12, gregorian: '2009-11-28', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1431, hijriMonth: 1, gregorian: '2008-12-30', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'pk', hijriYear: 1431, hijriMonth: 9, gregorian: '2010-08-12', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1431, hijriMonth: 10, gregorian: '2010-09-11', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1431, hijriMonth: 12, gregorian: '2010-11-17', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1432, hijriMonth: 9, gregorian: '2011-08-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1432, hijriMonth: 10, gregorian: '2011-08-31', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1432, hijriMonth: 12, gregorian: '2011-11-07', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1433, hijriMonth: 9, gregorian: '2012-07-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1433, hijriMonth: 10, gregorian: '2012-08-18', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1433, hijriMonth: 12, gregorian: '2012-10-27', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1434, hijriMonth: 9, gregorian: '2013-07-11', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1434, hijriMonth: 10, gregorian: '2013-08-09', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1434, hijriMonth: 12, gregorian: '2013-10-16', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1435, hijriMonth: 9, gregorian: '2014-06-30', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1435, hijriMonth: 10, gregorian: '2014-07-29', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1435, hijriMonth: 12, gregorian: '2014-10-06', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1436, hijriMonth: 1, gregorian: '2014-10-26', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1438, hijriMonth: 9, gregorian: '2017-05-28', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1438, hijriMonth: 10, gregorian: '2017-06-26', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1438, hijriMonth: 12, gregorian: '2017-09-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1439, hijriMonth: 9, gregorian: '2018-05-17', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1440, hijriMonth: 9, gregorian: '2019-05-06', method: 'Unknown', confidence: 0.5 },
  { countryId: 'pk', hijriYear: 1440, hijriMonth: 12, gregorian: '2019-08-02', method: 'Unknown', confidence: 0.5 },
  { countryId: 'pk', hijriYear: 1441, hijriMonth: 9, gregorian: '2020-04-24', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1441, hijriMonth: 10, gregorian: '2020-05-23', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1441, hijriMonth: 12, gregorian: '2020-07-22', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1442, hijriMonth: 9, gregorian: '2021-04-13', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1442, hijriMonth: 10, gregorian: '2021-05-13', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1442, hijriMonth: 12, gregorian: '2021-07-11', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1443, hijriMonth: 10, gregorian: '2022-05-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1443, hijriMonth: 12, gregorian: '2022-06-30', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1444, hijriMonth: 10, gregorian: '2023-04-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1445, hijriMonth: 12, gregorian: '2024-06-08', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1446, hijriMonth: 9, gregorian: '2025-03-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1446, hijriMonth: 10, gregorian: '2025-03-31', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1446, hijriMonth: 12, gregorian: '2025-05-28', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1447, hijriMonth: 9, gregorian: '2026-02-19', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1447, hijriMonth: 10, gregorian: '2026-03-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'pk', hijriYear: 1447, hijriMonth: 12, gregorian: '2026-05-18', method: 'SightingConfirmed', confidence: 0.8 },
];

// ---------------------------------------------------------------------------
// Indonesia — Muharram, Jumada al-Akhirah, Rajab, Shaban, Ramadan, Shawwal, Dhu al-Hijjah — AH 1430–1447
// ---------------------------------------------------------------------------
const ID_DATA: OfficialDeclaration[] = [
  { countryId: 'id', hijriYear: 1430, hijriMonth: 1, gregorian: '2008-12-29', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'id', hijriYear: 1430, hijriMonth: 6, gregorian: '2009-05-26', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'id', hijriYear: 1430, hijriMonth: 7, gregorian: '2009-06-25', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'id', hijriYear: 1430, hijriMonth: 8, gregorian: '2009-07-24', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'id', hijriYear: 1430, hijriMonth: 9, gregorian: '2009-08-22', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'id', hijriYear: 1430, hijriMonth: 10, gregorian: '2009-09-20', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'id', hijriYear: 1431, hijriMonth: 1, gregorian: '2008-12-29', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'id', hijriYear: 1431, hijriMonth: 9, gregorian: '2010-08-11', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'id', hijriYear: 1431, hijriMonth: 10, gregorian: '2010-09-10', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'id', hijriYear: 1431, hijriMonth: 12, gregorian: '2010-11-17', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'id', hijriYear: 1432, hijriMonth: 10, gregorian: '2011-08-31', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'id', hijriYear: 1433, hijriMonth: 9, gregorian: '2012-07-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'id', hijriYear: 1433, hijriMonth: 10, gregorian: '2012-08-19', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'id', hijriYear: 1434, hijriMonth: 9, gregorian: '2013-07-10', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'id', hijriYear: 1434, hijriMonth: 10, gregorian: '2013-08-09', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'id', hijriYear: 1434, hijriMonth: 12, gregorian: '2013-10-16', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'id', hijriYear: 1435, hijriMonth: 9, gregorian: '2014-06-29', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'id', hijriYear: 1435, hijriMonth: 10, gregorian: '2014-07-28', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'id', hijriYear: 1435, hijriMonth: 12, gregorian: '2014-10-05', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'id', hijriYear: 1436, hijriMonth: 1, gregorian: '2014-10-25', method: 'Unknown', confidence: 0.5 },
  { countryId: 'id', hijriYear: 1438, hijriMonth: 9, gregorian: '2017-05-27', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1438, hijriMonth: 10, gregorian: '2017-06-25', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1438, hijriMonth: 12, gregorian: '2017-09-01', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1439, hijriMonth: 9, gregorian: '2018-05-17', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1439, hijriMonth: 10, gregorian: '2018-06-14', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1439, hijriMonth: 12, gregorian: '2018-08-12', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1440, hijriMonth: 9, gregorian: '2019-05-06', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1440, hijriMonth: 12, gregorian: '2019-08-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'id', hijriYear: 1441, hijriMonth: 9, gregorian: '2020-04-24', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1441, hijriMonth: 10, gregorian: '2020-05-23', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1441, hijriMonth: 12, gregorian: '2020-07-22', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1442, hijriMonth: 9, gregorian: '2021-04-13', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1442, hijriMonth: 10, gregorian: '2021-05-13', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1442, hijriMonth: 12, gregorian: '2021-07-11', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1443, hijriMonth: 10, gregorian: '2022-05-02', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1443, hijriMonth: 12, gregorian: '2022-06-30', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1444, hijriMonth: 10, gregorian: '2023-04-21', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1445, hijriMonth: 12, gregorian: '2024-06-08', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1446, hijriMonth: 9, gregorian: '2025-03-02', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1446, hijriMonth: 10, gregorian: '2025-03-31', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1446, hijriMonth: 12, gregorian: '2025-05-28', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1447, hijriMonth: 9, gregorian: '2026-02-19', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1447, hijriMonth: 10, gregorian: '2026-03-21', method: 'SightingConfirmed', confidence: 0.9 },
  { countryId: 'id', hijriYear: 1447, hijriMonth: 12, gregorian: '2026-05-18', method: 'SightingConfirmed', confidence: 0.9 },
];

// ---------------------------------------------------------------------------
// United States — Muharram, Safar, Rabi al-Awwal, Rabi al-Thani, Jumada al-Ula, Rajab, Shaban, Ramadan, Shawwal, Dhu al-Hijjah — AH 1430–1447
// ---------------------------------------------------------------------------
const US_DATA: OfficialDeclaration[] = [
  { countryId: 'us', hijriYear: 1430, hijriMonth: 1, gregorian: '2008-12-29', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'us', hijriYear: 1430, hijriMonth: 2, gregorian: '2009-01-28', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'us', hijriYear: 1430, hijriMonth: 3, gregorian: '2009-02-27', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'us', hijriYear: 1430, hijriMonth: 4, gregorian: '2009-03-28', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'us', hijriYear: 1430, hijriMonth: 5, gregorian: '2009-04-26', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'us', hijriYear: 1430, hijriMonth: 7, gregorian: '2009-06-24', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'us', hijriYear: 1430, hijriMonth: 8, gregorian: '2009-07-24', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'us', hijriYear: 1430, hijriMonth: 9, gregorian: '2009-08-22', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1430, hijriMonth: 10, gregorian: '2009-09-20', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1430, hijriMonth: 12, gregorian: '2009-11-27', method: 'Unknown', confidence: 0.5 },
  { countryId: 'us', hijriYear: 1431, hijriMonth: 1, gregorian: '2008-12-29', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'us', hijriYear: 1431, hijriMonth: 12, gregorian: '2010-11-17', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1433, hijriMonth: 10, gregorian: '2012-08-19', method: 'CalculatedCalendar', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1433, hijriMonth: 12, gregorian: '2012-10-26', method: 'Unknown', confidence: 0.5 },
  { countryId: 'us', hijriYear: 1434, hijriMonth: 9, gregorian: '2013-07-09', method: 'Unknown', confidence: 0.5 },
  { countryId: 'us', hijriYear: 1434, hijriMonth: 10, gregorian: '2013-08-09', method: 'Unknown', confidence: 0.5 },
  { countryId: 'us', hijriYear: 1434, hijriMonth: 12, gregorian: '2013-10-16', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1435, hijriMonth: 9, gregorian: '2014-06-28', method: 'Unknown', confidence: 0.5 },
  { countryId: 'us', hijriYear: 1435, hijriMonth: 10, gregorian: '2014-07-28', method: 'Unknown', confidence: 0.5 },
  { countryId: 'us', hijriYear: 1435, hijriMonth: 12, gregorian: '2014-10-04', method: 'Unknown', confidence: 0.5 },
  { countryId: 'us', hijriYear: 1438, hijriMonth: 9, gregorian: '2017-05-27', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1438, hijriMonth: 10, gregorian: '2017-06-25', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1438, hijriMonth: 12, gregorian: '2017-09-01', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1439, hijriMonth: 9, gregorian: '2018-05-16', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1439, hijriMonth: 10, gregorian: '2018-06-14', method: 'Unknown', confidence: 0.5 },
  { countryId: 'us', hijriYear: 1439, hijriMonth: 12, gregorian: '2018-08-12', method: 'Unknown', confidence: 0.5 },
  { countryId: 'us', hijriYear: 1441, hijriMonth: 9, gregorian: '2020-04-24', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1441, hijriMonth: 10, gregorian: '2020-05-23', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1441, hijriMonth: 12, gregorian: '2020-07-22', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1442, hijriMonth: 9, gregorian: '2021-04-13', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1442, hijriMonth: 10, gregorian: '2021-05-13', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1442, hijriMonth: 12, gregorian: '2021-07-11', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1443, hijriMonth: 10, gregorian: '2022-05-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1443, hijriMonth: 12, gregorian: '2022-06-30', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1444, hijriMonth: 10, gregorian: '2023-04-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1445, hijriMonth: 12, gregorian: '2024-06-08', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1446, hijriMonth: 9, gregorian: '2025-03-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1446, hijriMonth: 10, gregorian: '2025-03-31', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1446, hijriMonth: 12, gregorian: '2025-05-28', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1447, hijriMonth: 9, gregorian: '2026-02-19', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1447, hijriMonth: 10, gregorian: '2026-03-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'us', hijriYear: 1447, hijriMonth: 12, gregorian: '2026-05-18', method: 'SightingConfirmed', confidence: 0.8 },
];

// ---------------------------------------------------------------------------
// Canada — Muharram, Rabi al-Thani, Jumada al-Akhirah, Rajab, Ramadan, Shawwal, Dhu al-Hijjah — AH 1430–1447
// ---------------------------------------------------------------------------
const CA_DATA: OfficialDeclaration[] = [
  { countryId: 'ca', hijriYear: 1430, hijriMonth: 4, gregorian: '2009-03-29', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'ca', hijriYear: 1430, hijriMonth: 6, gregorian: '2009-05-26', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'ca', hijriYear: 1430, hijriMonth: 7, gregorian: '2009-06-24', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'ca', hijriYear: 1430, hijriMonth: 9, gregorian: '2009-08-22', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ca', hijriYear: 1430, hijriMonth: 12, gregorian: '2009-11-27', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ca', hijriYear: 1431, hijriMonth: 9, gregorian: '2010-08-11', method: 'Unknown', confidence: 0.7 },
  { countryId: 'ca', hijriYear: 1431, hijriMonth: 10, gregorian: '2010-09-10', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ca', hijriYear: 1431, hijriMonth: 12, gregorian: '2010-11-16', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1432, hijriMonth: 9, gregorian: '2011-08-01', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1433, hijriMonth: 9, gregorian: '2012-07-21', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1433, hijriMonth: 10, gregorian: '2012-08-19', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1434, hijriMonth: 9, gregorian: '2013-07-09', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1434, hijriMonth: 10, gregorian: '2013-08-08', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1434, hijriMonth: 12, gregorian: '2013-10-16', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'ca', hijriYear: 1435, hijriMonth: 9, gregorian: '2014-06-28', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1435, hijriMonth: 10, gregorian: '2014-07-28', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1435, hijriMonth: 12, gregorian: '2014-10-04', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1436, hijriMonth: 1, gregorian: '2014-10-25', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1438, hijriMonth: 9, gregorian: '2017-05-27', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1438, hijriMonth: 10, gregorian: '2017-06-25', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1438, hijriMonth: 12, gregorian: '2017-09-01', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1439, hijriMonth: 9, gregorian: '2018-05-16', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1439, hijriMonth: 10, gregorian: '2018-06-14', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1439, hijriMonth: 12, gregorian: '2018-08-12', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1440, hijriMonth: 9, gregorian: '2019-05-06', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1440, hijriMonth: 10, gregorian: '2019-06-04', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1440, hijriMonth: 12, gregorian: '2019-08-02', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1441, hijriMonth: 9, gregorian: '2020-04-24', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1441, hijriMonth: 10, gregorian: '2020-05-23', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1441, hijriMonth: 12, gregorian: '2020-07-22', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1442, hijriMonth: 9, gregorian: '2021-04-13', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1442, hijriMonth: 10, gregorian: '2021-05-13', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1442, hijriMonth: 12, gregorian: '2021-07-11', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1443, hijriMonth: 10, gregorian: '2022-05-02', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1443, hijriMonth: 12, gregorian: '2022-06-30', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1444, hijriMonth: 10, gregorian: '2023-04-21', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1445, hijriMonth: 12, gregorian: '2024-06-08', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1446, hijriMonth: 9, gregorian: '2025-03-02', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1446, hijriMonth: 10, gregorian: '2025-03-31', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1446, hijriMonth: 12, gregorian: '2025-05-28', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1447, hijriMonth: 9, gregorian: '2026-02-19', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1447, hijriMonth: 10, gregorian: '2026-03-21', method: 'Unknown', confidence: 0.5 },
  { countryId: 'ca', hijriYear: 1447, hijriMonth: 12, gregorian: '2026-05-18', method: 'Unknown', confidence: 0.5 },
];

// ---------------------------------------------------------------------------
// Australia — Muharram, Rabi al-Thani, Rajab, Shaban, Ramadan, Shawwal, Dhu al-Hijjah — AH 1430–1447
// ---------------------------------------------------------------------------
const AU_DATA: OfficialDeclaration[] = [
  { countryId: 'au', hijriYear: 1430, hijriMonth: 4, gregorian: '2009-03-29', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'au', hijriYear: 1430, hijriMonth: 7, gregorian: '2009-06-25', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'au', hijriYear: 1430, hijriMonth: 8, gregorian: '2009-07-24', method: 'SightingConfirmed', confidence: 0.6 },
  { countryId: 'au', hijriYear: 1430, hijriMonth: 9, gregorian: '2009-08-22', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1430, hijriMonth: 10, gregorian: '2009-09-20', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1431, hijriMonth: 9, gregorian: '2010-08-11', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1431, hijriMonth: 12, gregorian: '2010-11-17', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1432, hijriMonth: 9, gregorian: '2011-08-01', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1432, hijriMonth: 10, gregorian: '2011-08-31', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1432, hijriMonth: 12, gregorian: '2011-11-07', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1433, hijriMonth: 9, gregorian: '2012-07-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1433, hijriMonth: 10, gregorian: '2012-08-19', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1434, hijriMonth: 10, gregorian: '2013-08-09', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1434, hijriMonth: 12, gregorian: '2013-10-16', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1435, hijriMonth: 9, gregorian: '2014-06-29', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1435, hijriMonth: 10, gregorian: '2014-07-29', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1435, hijriMonth: 12, gregorian: '2014-10-05', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1436, hijriMonth: 1, gregorian: '2014-10-26', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1438, hijriMonth: 9, gregorian: '2017-05-28', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1438, hijriMonth: 10, gregorian: '2017-06-26', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1438, hijriMonth: 12, gregorian: '2017-09-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1439, hijriMonth: 9, gregorian: '2018-05-17', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1439, hijriMonth: 10, gregorian: '2018-06-14', method: 'Unknown', confidence: 0.5 },
  { countryId: 'au', hijriYear: 1440, hijriMonth: 9, gregorian: '2019-05-06', method: 'Unknown', confidence: 0.5 },
  { countryId: 'au', hijriYear: 1440, hijriMonth: 10, gregorian: '2019-06-04', method: 'Unknown', confidence: 0.5 },
  { countryId: 'au', hijriYear: 1440, hijriMonth: 12, gregorian: '2019-08-02', method: 'Unknown', confidence: 0.5 },
  { countryId: 'au', hijriYear: 1441, hijriMonth: 9, gregorian: '2020-04-24', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1441, hijriMonth: 10, gregorian: '2020-05-23', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1441, hijriMonth: 12, gregorian: '2020-07-22', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1442, hijriMonth: 9, gregorian: '2021-04-13', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1442, hijriMonth: 10, gregorian: '2021-05-13', method: 'Unknown', confidence: 0.5 },
  { countryId: 'au', hijriYear: 1442, hijriMonth: 12, gregorian: '2021-07-11', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1443, hijriMonth: 10, gregorian: '2022-05-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1443, hijriMonth: 12, gregorian: '2022-06-30', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1444, hijriMonth: 10, gregorian: '2023-04-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1445, hijriMonth: 12, gregorian: '2024-06-08', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1446, hijriMonth: 9, gregorian: '2025-03-02', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1446, hijriMonth: 10, gregorian: '2025-03-31', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1446, hijriMonth: 12, gregorian: '2025-05-28', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1447, hijriMonth: 9, gregorian: '2026-02-19', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1447, hijriMonth: 10, gregorian: '2026-03-21', method: 'SightingConfirmed', confidence: 0.8 },
  { countryId: 'au', hijriYear: 1447, hijriMonth: 12, gregorian: '2026-05-18', method: 'SightingConfirmed', confidence: 0.8 },
];

// ---------------------------------------------------------------------------
// Aggregate all declarations
// ---------------------------------------------------------------------------
export const OFFICIAL_DECLARATIONS: OfficialDeclaration[] = [
  ...SA_DATA,
  ...EG_DATA,
  ...TR_DATA,
  ...PS_DATA,
  ...JO_DATA,
  ...MA_DATA,
  ...LY_DATA,
  ...ZA_DATA,
  ...NG_DATA,
  ...MY_DATA,
  ...PK_DATA,
  ...ID_DATA,
  ...US_DATA,
  ...CA_DATA,
  ...AU_DATA,
];

// ---------------------------------------------------------------------------
// Fast lookup map:  "countryId|hijriYear|hijriMonth" → declaration
// ---------------------------------------------------------------------------
const _lookup = new Map<string, OfficialDeclaration>();
for (const d of OFFICIAL_DECLARATIONS) {
  _lookup.set(`${d.countryId}|${d.hijriYear}|${d.hijriMonth}`, d);
}

/** Get the official declaration for a given country, year and month (or undefined). */
export function getOfficialDeclaration(
  countryId: string,
  hijriYear: number,
  hijriMonth: number,
): OfficialDeclaration | undefined {
  return _lookup.get(`${countryId}|${hijriYear}|${hijriMonth}`);
}

/** Check whether any official data exists for a given country. */
export function hasAnyOfficialData(countryId: string): boolean {
  for (const d of OFFICIAL_DECLARATIONS) {
    if (d.countryId === countryId) return true;
  }
  return false;
}

/** Return the set of Hijri months that have at least one official entry for a country. */
export function officialMonthsForCountry(countryId: string): Set<number> {
  const months = new Set<number>();
  for (const d of OFFICIAL_DECLARATIONS) {
    if (d.countryId === countryId) months.add(d.hijriMonth);
  }
  return months;
}
