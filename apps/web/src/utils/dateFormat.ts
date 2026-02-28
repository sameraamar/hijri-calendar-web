export function formatIsoDateDisplay(iso: string, locale: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return iso;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
    return iso;
  }

  void locale;
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
}

export function formatGregorianDateDisplay(
  value: { year: number; month: number; day: number },
  locale: string
): string {
  const iso = `${value.year}-${String(value.month).padStart(2, '0')}-${String(value.day).padStart(2, '0')}`;
  return formatIsoDateDisplay(iso, locale);
}

export function formatLocalizedNumber(value: number, locale: string): string {
  if (!Number.isFinite(value)) return String(value);
  void locale;
  return String(value);
}

export function formatHijriDateDisplay(
  value: { year: number; month: number; day: number },
  locale: string
): string {
  return `${formatLocalizedNumber(value.day, locale)}/${formatLocalizedNumber(value.month, locale)}/${formatLocalizedNumber(value.year, locale)}`;
}
