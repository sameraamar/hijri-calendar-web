import type { DatedHoliday, DatedHolidayWithEstimate, GregorianDate, HijriDate, Holiday } from './types.js';
import { gregorianToHijriCivil, hijriCivilToGregorian } from './civil.js';
import { buildEstimatedHijriCalendarRange, findEstimatedGregorianForHijriMonthDay } from './estimatedCalendar.js';

export const CIVIL_HOLIDAYS: Holiday[] = [
  { id: 'islamic-new-year', hijri: { month: 1, day: 1 }, nameKey: 'holidays.islamicNewYear' },
  { id: 'ashura', hijri: { month: 1, day: 10 }, nameKey: 'holidays.ashura' },
  { id: 'ramadan-1', hijri: { month: 9, day: 1 }, nameKey: 'holidays.ramadan1' },
  { id: 'eid-al-fitr', hijri: { month: 10, day: 1 }, nameKey: 'holidays.eidAlFitr' },
  { id: 'dhul-hijjah-1', hijri: { month: 12, day: 1 }, nameKey: 'holidays.dhulHijjah1' },
  { id: 'arafah', hijri: { month: 12, day: 9 }, nameKey: 'holidays.arafah' },
  { id: 'eid-al-adha', hijri: { month: 12, day: 10 }, nameKey: 'holidays.eidAlAdha' }
];

function isValidGregorianDate({ year, month, day }: GregorianDate): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) return false;
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  return true;
}

function compareGregorian(a: GregorianDate, b: GregorianDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

export function getCivilHolidaysForGregorianYear(gregorianYear: number): DatedHoliday[] {
  // Strategy:
  // - Find which Hijri years overlap this Gregorian year by converting Jan 1 and Dec 31.
  // - For each overlapping Hijri year, compute each holiday's Gregorian date.
  // - Filter to the requested Gregorian year and sort.

  const jan1Hijri = gregorianToHijriCivil({ year: gregorianYear, month: 1, day: 1 });
  const dec31Hijri = gregorianToHijriCivil({ year: gregorianYear, month: 12, day: 31 });

  const hijriYears = new Set<number>();
  hijriYears.add(jan1Hijri.year);
  hijriYears.add(dec31Hijri.year);
  // Add neighbors to be safe for edge cases
  hijriYears.add(jan1Hijri.year - 1);
  hijriYears.add(dec31Hijri.year + 1);

  const results: DatedHoliday[] = [];

  for (const hijriYear of hijriYears) {
    for (const holiday of CIVIL_HOLIDAYS) {
      const hijri: HijriDate = { year: hijriYear, month: holiday.hijri.month, day: holiday.hijri.day };
      const gregorian = hijriCivilToGregorian(hijri);
      if (!isValidGregorianDate(gregorian)) continue;
      if (gregorian.year !== gregorianYear) continue;
      results.push({
        id: holiday.id,
        nameKey: holiday.nameKey,
        gregorian,
        hijri: gregorianToHijriCivil(gregorian)
      });
    }
  }

  results.sort((a, b) => compareGregorian(a.gregorian, b.gregorian));

  // Deduplicate in the very unlikely case of overlap duplicates
  const seen = new Set<string>();
  return results.filter((h) => {
    const key = `${h.id}-${h.gregorian.year}-${h.gregorian.month}-${h.gregorian.day}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function getCivilHolidaysForGregorianYearWithEstimate(
  gregorianYear: number,
  location: { latitude: number; longitude: number }
): DatedHolidayWithEstimate[] {
  const civil = getCivilHolidaysForGregorianYear(gregorianYear);

  // Build a slightly wider range so estimates that shift across Jan 1 / Dec 31 are still found.
  const start: GregorianDate = { year: gregorianYear - 1, month: 12, day: 1 };
  const end: GregorianDate = { year: gregorianYear + 1, month: 1, day: 31 };
  const estimatedCalendar = buildEstimatedHijriCalendarRange(start, end, location, {
    minEndOfMonthDay: 29,
    monthStartRule: 'geometric'
  });

  return civil.map((h) => {
    const match = findEstimatedGregorianForHijriMonthDay(
      estimatedCalendar,
      h.hijri.month,
      h.hijri.day,
      h.gregorian
    );

    if (!match) return h;
    return {
      ...h,
      estimatedGregorian: match.gregorian,
      estimatedHijri: match.hijri
    };
  });
}
