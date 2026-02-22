import { describe, expect, test } from 'vitest';

import * as Astronomy from 'astronomy-engine';

import { estimateMonthStartLikelihoodAtSunset } from '../src/monthStartEstimate.js';

function minutesBetween(a: Date, b: Date): number {
  return Math.abs(a.getTime() - b.getTime()) / 60000;
}

function isoUtcMinute(d: Date): string {
  // Example: 2026-02-17T15:27
  return d.toISOString().slice(0, 16);
}

describe('month-start estimate (heuristic)', () => {
  test('returns a structured estimate with numeric metrics', () => {
    const est = estimateMonthStartLikelihoodAtSunset(
      { year: 2026, month: 2, day: 18 },
      { latitude: 21.3891, longitude: 39.8579 } // Makkah
    );

    expect(['low', 'medium', 'high', 'unknown']).toContain(est.likelihood);

    // We should have a sunset time and some metrics for most non-polar locations.
    if (est.likelihood !== 'unknown') {
      expect(typeof est.metrics.sunsetUtcIso).toBe('string');
      expect(Number.isFinite(est.metrics.moonAltitudeDeg)).toBe(true);
      expect(Number.isFinite(est.metrics.moonElongationDeg)).toBe(true);
      expect(Number.isFinite(est.metrics.moonAgeHours)).toBe(true);
      expect(Number.isFinite(est.metrics.moonIlluminationFraction)).toBe(true);

      expect(Number.isFinite(est.metrics.moonAzimuthDeg)).toBe(true);
      expect(Number.isFinite(est.metrics.sunAltitudeDeg)).toBe(true);
      expect(Number.isFinite(est.metrics.sunAzimuthDeg)).toBe(true);
      expect(Number.isFinite(est.metrics.relativeAzimuthDeg)).toBe(true);

      expect(Number.isFinite(est.metrics.visibilityScore)).toBe(true);
      expect(est.metrics.visibilityScore).toBeGreaterThanOrEqual(0);
      expect(est.metrics.visibilityScore).toBeLessThanOrEqual(1);

      expect(Number.isFinite(est.metrics.visibilityPercent)).toBe(true);
      expect(est.metrics.visibilityPercent).toBeGreaterThanOrEqual(0);
      expect(est.metrics.visibilityPercent).toBeLessThanOrEqual(100);
    }
  });

  test('Jerusalem 2026-02-17 sunset/moonset align with reference (17:27/17:30 local)', () => {
    // Reference (user provided): Jerusalem sunset 17:27, moonset 17:30.
    // On 2026-02-17, Jerusalem is typically UTC+02:00, so expected times are ~15:27Z and ~15:30Z.
    const jerusalem = { latitude: 31.7683, longitude: 35.2137 };

    const est = estimateMonthStartLikelihoodAtSunset({ year: 2026, month: 2, day: 17 }, jerusalem);
    expect(est.likelihood).not.toBe('unknown');

    expect(typeof est.metrics.sunsetUtcIso).toBe('string');
    expect(typeof est.metrics.moonsetUtcIso).toBe('string');

    const sunset = new Date(est.metrics.sunsetUtcIso!);
    const moonset = new Date(est.metrics.moonsetUtcIso!);

    const expectedSunsetUtc = new Date('2026-02-17T15:27:00.000Z');
    const expectedMoonsetUtc = new Date('2026-02-17T15:30:00.000Z');

    // The reference times are minute-rounded. Enforce a strict "0 minute" match.
    expect(isoUtcMinute(sunset)).toBe('2026-02-17T15:27');
    expect(isoUtcMinute(moonset)).toBe('2026-02-17T15:30');

    // Allow only seconds-level differences within the matching minute.
    expect(minutesBetween(sunset, expectedSunsetUtc)).toBeLessThan(1);
    expect(minutesBetween(moonset, expectedMoonsetUtc)).toBeLessThan(1);

    // Cross-check via direct astronomy-engine calls ("different method" vs our wrapper).
    const startOfDayUtc = new Date(Date.UTC(2026, 1, 17, 0, 0, 0));
    const observer = new Astronomy.Observer(jerusalem.latitude, jerusalem.longitude, 0);
    const directSunsetTime = Astronomy.SearchRiseSet(Astronomy.Body.Sun, observer, -1, startOfDayUtc, 2);
    const directMoonsetTime = directSunsetTime
      ? Astronomy.SearchRiseSet(Astronomy.Body.Moon, observer, -1, directSunsetTime.date, 2)
      : null;

    expect(directSunsetTime).not.toBeNull();
    expect(directMoonsetTime).not.toBeNull();

    if (directSunsetTime && directMoonsetTime) {
      expect(minutesBetween(sunset, directSunsetTime.date)).toBeLessThanOrEqual(0.5);
      expect(minutesBetween(moonset, directMoonsetTime.date)).toBeLessThanOrEqual(0.5);
    }

    // Lag should be roughly 3 minutes (moonset - sunset).
    expect(typeof est.metrics.lagMinutes).toBe('number');
    expect(Math.abs((est.metrics.lagMinutes ?? 0) - 3)).toBeLessThanOrEqual(10);
  });
});
