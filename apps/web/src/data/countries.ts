/**
 * Reference countries and cities for multi-country Hijri calendar comparison.
 *
 * Each entry has the coordinates of one reference city per country.
 * Coordinates are used by the astronomical crescent-visibility methods
 * (Estimate, Yallop, Odeh) and do NOT imply that an official declaration
 * was scoped to that city.
 */

export interface CountryInfo {
  /** ISO-3166-1 alpha-2 (lowercase) */
  id: string;
  /** i18n key for the country name */
  nameKey: string;
  /** Reference city (English) */
  city: string;
  /** i18n key for the city name */
  cityKey: string;
  /** Latitude (decimal degrees, negative = south) */
  latitude: number;
  /** Longitude (decimal degrees, negative = west) */
  longitude: number;
}

export const COUNTRIES: CountryInfo[] = [
  { id: 'sa', nameKey: 'countries.sa', city: 'Makkah',          cityKey: 'cities.makkah',       latitude:  21.4225, longitude:   39.8262 },
  { id: 'eg', nameKey: 'countries.eg', city: 'Cairo',           cityKey: 'cities.cairo',        latitude:  30.0444, longitude:   31.2357 },
  { id: 'tr', nameKey: 'countries.tr', city: 'Ankara',          cityKey: 'cities.ankara',       latitude:  39.9334, longitude:   32.8597 },
  { id: 'ps', nameKey: 'countries.ps', city: 'Jerusalem',       cityKey: 'cities.jerusalem',    latitude:  31.7683, longitude:   35.2137 },
  { id: 'jo', nameKey: 'countries.jo', city: 'Amman',           cityKey: 'cities.amman',        latitude:  31.9454, longitude:   35.9284 },
  { id: 'ma', nameKey: 'countries.ma', city: 'Rabat',           cityKey: 'cities.rabat',        latitude:  34.0209, longitude:   -6.8416 },
  { id: 'ly', nameKey: 'countries.ly', city: 'Tripoli',         cityKey: 'cities.tripoli',      latitude:  32.8872, longitude:   13.1913 },
  { id: 'za', nameKey: 'countries.za', city: 'Pretoria',        cityKey: 'cities.pretoria',     latitude: -25.7479, longitude:   28.2293 },
  { id: 'ng', nameKey: 'countries.ng', city: 'Abuja',           cityKey: 'cities.abuja',        latitude:   9.0579, longitude:    7.4951 },
  { id: 'my', nameKey: 'countries.my', city: 'Kuala Lumpur',    cityKey: 'cities.kualaLumpur',  latitude:   3.1390, longitude:  101.6869 },
  { id: 'pk', nameKey: 'countries.pk', city: 'Islamabad',       cityKey: 'cities.islamabad',    latitude:  33.6844, longitude:   73.0479 },
  { id: 'id', nameKey: 'countries.id', city: 'Jakarta',         cityKey: 'cities.jakarta',      latitude:  -6.2088, longitude:  106.8456 },
  { id: 'us', nameKey: 'countries.us', city: 'Washington, D.C.', cityKey: 'cities.washington',  latitude:  38.9072, longitude:  -77.0369 },
  { id: 'ca', nameKey: 'countries.ca', city: 'Ottawa',          cityKey: 'cities.ottawa',       latitude:  45.4215, longitude:  -75.6972 },
  { id: 'au', nameKey: 'countries.au', city: 'Canberra',        cityKey: 'cities.canberra',     latitude: -35.2809, longitude:  149.1300 },
];
