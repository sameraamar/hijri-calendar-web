export type GregorianDate = {
  year: number;
  month: number; // 1-12
  day: number; // 1-31
};

export type HijriDate = {
  year: number;
  month: number; // 1-12
  day: number; // 1-30
};

export type CalendarMethodId = 'civil';

export type CalendarMethod = {
  id: CalendarMethodId;
  name: string;
  description: string;
};

export type HolidayId =
  | 'islamic-new-year'
  | 'ashura'
  | 'ramadan-1'
  | 'eid-al-fitr'
  | 'dhul-hijjah-1'
  | 'arafah'
  | 'eid-al-adha';

export type Holiday = {
  id: HolidayId;
  hijri: { month: number; day: number };
  nameKey: string;
};

export type DatedHoliday = {
  id: HolidayId;
  nameKey: string;
  gregorian: GregorianDate;
  hijri: HijriDate;
};

export type DatedHolidayWithEstimate = DatedHoliday & {
  estimatedGregorian?: GregorianDate;
  estimatedHijri?: HijriDate;
};
