import { describe, expect, it } from 'vitest';

import { meetsCrescentVisibilityCriteriaAtSunset, type MonthStartEstimate } from '../src/monthStartEstimate.js';

describe('meetsCrescentVisibilityCriteriaAtSunset', () => {
  const base: MonthStartEstimate = {
    likelihood: 'medium',
    metrics: {
      lagMinutes: 10,
      moonAltitudeDeg: 2,
      moonAgeHours: 13,
      moonElongationDeg: 6.1,
      visibilityScore: 0.41,
      visibilityPercent: 41
    }
  };

  it('returns true for minimal default cutoffs', () => {
    expect(meetsCrescentVisibilityCriteriaAtSunset(base)).toBe(true);
  });

  it('returns false when elongation is below cutoff', () => {
    expect(
      meetsCrescentVisibilityCriteriaAtSunset({
        ...base,
        metrics: { ...base.metrics, moonElongationDeg: 5.99 }
      })
    ).toBe(false);
  });

  it('returns false when age is below cutoff', () => {
    expect(
      meetsCrescentVisibilityCriteriaAtSunset({
        ...base,
        metrics: { ...base.metrics, moonAgeHours: 11.9 }
      })
    ).toBe(false);
  });

  it('returns false when moon sets before sunset (lag <= 0)', () => {
    expect(
      meetsCrescentVisibilityCriteriaAtSunset({
        ...base,
        metrics: { ...base.metrics, lagMinutes: 0 }
      })
    ).toBe(false);
  });

  it('allows stricter custom criteria', () => {
    expect(
      meetsCrescentVisibilityCriteriaAtSunset(base, {
        minMoonAgeHours: 20,
        minMoonElongationDeg: 10
      })
    ).toBe(false);
  });
});
