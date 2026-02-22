import tzLookup from 'tz-lookup';

export function getTimeZoneForLocation(latitude: number, longitude: number): string {
  try {
    return tzLookup(latitude, longitude);
  } catch {
    // Fallback to browser timezone if lookup fails for any reason.
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }
}
