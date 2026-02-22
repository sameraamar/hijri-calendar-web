import type { GregorianDate, HijriDate } from './types.js';

// Islamic (tabular/civil) calendar conversion using arithmetic rules.
//
// Notes:
// - This is an *algorithmic* calendar (not observation-based).
// - Leap years follow a 30-year cycle with 11 leap years.
// - Months alternate 30 and 29 days; Dhu al-Hijjah is 30 days in leap years.
//
// Implementation approach:
// - Convert Gregorian <-> Julian Day Number (JDN)
// - Convert JDN <-> Islamic civil date
//
// This keeps the engine deterministic and independent of timezones.

const ISLAMIC_EPOCH_JDN = 1948439; // JDN for 1 Muharram 1 AH (civil), at midnight-based day counting.

function isGregorianLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function gregorianToJdn({ year, month, day }: GregorianDate): number {
  // Fliegel-Van Flandern algorithm (proleptic Gregorian)
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

function jdnToGregorian(jdn: number): GregorianDate {
  // Inverse Fliegel-Van Flandern
  const f = jdn + 1401 + Math.floor((Math.floor((4 * jdn + 274277) / 146097) * 3) / 4) - 38;
  const e = 4 * f + 3;
  const g = Math.floor((e % 1461) / 4);
  const h = 5 * g + 2;
  const day = Math.floor((h % 153) / 5) + 1;
  const month = ((Math.floor(h / 153) + 2) % 12) + 1;
  const year = Math.floor(e / 1461) - 4716 + Math.floor((12 + 2 - month) / 12);
  return { year, month, day };
}

function isHijriCivilLeapYear(year: number): boolean {
  // Leap years in a 30-year cycle at years:
  // 2,5,7,10,13,16,18,21,24,26,29
  const yearInCycle = ((year - 1) % 30) + 1;
  return [2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29].includes(yearInCycle);
}

function hijriCivilMonthLength(year: number, month: number): number {
  if (month < 1 || month > 12) throw new Error('Hijri month out of range');
  // Months alternate 30 (odd) and 29 (even), except month 12 can be 30 in leap years.
  if (month === 12) return isHijriCivilLeapYear(year) ? 30 : 29;
  return month % 2 === 1 ? 30 : 29;
}

function hijriCivilToJdn({ year, month, day }: HijriDate): number {
  if (month < 1 || month > 12) throw new Error('Hijri month out of range');
  if (day < 1 || day > 30) throw new Error('Hijri day out of range');
  const monthDays = Math.ceil(29.5 * (month - 1));
  const yearDays = (year - 1) * 354 + Math.floor((3 + 11 * year) / 30);
  return day + monthDays + yearDays + ISLAMIC_EPOCH_JDN - 1;
}

function jdnToHijriCivil(jdn: number): HijriDate {
  const daysSinceEpoch = jdn - ISLAMIC_EPOCH_JDN + 1;
  // Approximate year
  let year = Math.floor((30 * daysSinceEpoch + 10646) / 10631);
  // Find first day of computed year
  let firstDayOfYear = hijriCivilToJdn({ year, month: 1, day: 1 });
  if (jdn < firstDayOfYear) {
    year -= 1;
    firstDayOfYear = hijriCivilToJdn({ year, month: 1, day: 1 });
  }

  let month = 1;
  while (month <= 12) {
    const monthLen = hijriCivilMonthLength(year, month);
    const firstDayOfMonth = hijriCivilToJdn({ year, month, day: 1 });
    const lastDayOfMonth = firstDayOfMonth + monthLen - 1;
    if (jdn >= firstDayOfMonth && jdn <= lastDayOfMonth) {
      const day = jdn - firstDayOfMonth + 1;
      return { year, month, day };
    }
    month += 1;
  }

  // Should never happen
  throw new Error('Failed to convert JDN to Hijri civil date');
}

export function gregorianToHijriCivil(date: GregorianDate): HijriDate {
  const jdn = gregorianToJdn(date);
  return jdnToHijriCivil(jdn);
}

export function hijriCivilToGregorian(date: HijriDate): GregorianDate {
  const jdn = hijriCivilToJdn(date);
  return jdnToGregorian(jdn);
}

export function getHijriCivilMonthLength(year: number, month: number): number {
  return hijriCivilMonthLength(year, month);
}

export function isHijriCivilLeapYearPublic(year: number): boolean {
  return isHijriCivilLeapYear(year);
}

export function isGregorianLeapYearPublic(year: number): boolean {
  return isGregorianLeapYear(year);
}
