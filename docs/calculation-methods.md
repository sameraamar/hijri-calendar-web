# Calculation Methods (Draft)

## Tabular / Islamic Civil calendar (default)
This project’s default method is the **Islamic civil (tabular) calendar**.

### What it is
- An **arithmetic** Hijri calendar that follows a fixed set of rules.
- It is *not* based on local moon sighting.

### Rules
- Year length: 354 days (common) or 355 days (leap)
- Leap years: 11 leap years in a 30-year cycle
  - Cycle years: 2, 5, 7, 10, 13, 16, 18, 21, 24, 26, 29
- Month lengths:
  - Alternating 30 and 29 days starting with Muharram = 30
  - Dhu al-Hijjah (month 12) is 30 days in leap years, otherwise 29

### Conversion approach
The engine converts dates by:
1) Converting Gregorian dates to a Julian Day Number (JDN)
2) Converting JDN to/from the Islamic civil date using the rules above

### Limitations
- Results can differ from official country calendars.
- Results can differ from observational (sighting-based) month starts.

## Umm al-Qura (planned)
This will be added as an optional method if we include a trusted dataset/library.

## Month-start probability (planned)
This will be location-aware and will provide an **estimate** only.
The estimate depends on longitude/latitude/timezone and on the chosen visibility criterion.

### What the UI labels mean (current MVP heuristic)
In the calendar, you may see an **Estimate: Low / Medium / High** badge on some days.

These badges are shown on days that are **Hijri day 1** under the currently selected calendar method (currently: Islamic Civil).
They answer this question:

> “If the month start were decided by crescent visibility, how likely is it that the crescent could be seen on the evening of this Gregorian date at the selected location?”

Important notes:
- This is an **astronomy-based heuristic**, not a religious ruling and not an official calendar.
- It depends on the selected **location** (latitude/longitude) because sunset/moon position changes by place.

### Inputs used (at local sunset)
The heuristic evaluates simplified “visibility signals” at **local sunset** for the selected location:
- Moon altitude above the horizon
- Moon elongation (angular separation from the Sun)
- Moon age (hours since conjunction/new moon)
- Moonset lag (minutes the Moon stays above horizon after sunset)

The engine also computes extra sky-position metrics (for future UI): sun/moon azimuth and relative azimuth.

### Low / Medium / High mapping
Internally we compute a continuous `visibilityScore` in the range **0..1** and map it to labels:
- **Low**: score ≤ ~0.33, or basic conditions fail (Moon below horizon, very small elongation, very young Moon, or waning phase)
- **Medium**: score between ~0.33 and ~0.66
- **High**: score ≥ ~0.66, or strong conditions (higher altitude + larger elongation + older crescent)

This is intentionally conservative and meant for *education and comparison*, not certainty.

### Where sunset/moonset times come from
Sunset and moonset times are computed locally in the app (no external API calls) using the `astronomy-engine` library.

- **Inputs**: Gregorian date + selected latitude/longitude.
- **Outputs**: sunset time (Sun below horizon), moonset time (Moon below horizon), and derived lag minutes.

Notes:
- These are *astronomical approximations* and can differ slightly from official almanacs depending on assumptions (e.g., refraction, observer elevation, and definition of twilight/sunset).
- The UI stores event instants as ISO timestamps (UTC) and then **formats them in the location’s local time** using an IANA timezone derived from the selected coordinates.
