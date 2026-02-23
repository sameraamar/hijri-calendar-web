# Hijri Calendar — Calculation Methods

> **Purpose**: This document catalogues every acceptable method for determining the start of an Islamic (Hijri) lunar month, from pure arithmetic to advanced physical models. Each section includes the method's rationale, the variables it depends on, formulae / pseudocode, and accurate citations to the reference material stored in [docs/](.).

---

## Table of Contents

1. [Tabular / Islamic Civil Calendar](#1-tabular--islamic-civil-calendar)
2. [Umm al-Qura Calendar](#2-umm-al-qura-calendar)
3. [Global Conjunction ("Moon Birth on Earth")](#3-global-conjunction-moon-birth-on-earth)
4. [New Moon at Makkah](#4-new-moon-at-makkah)
5. [Babylonian Criterion (Age + Lag)](#5-babylonian-criterion-age--lag)
6. [Altitude / Azimuth Criteria (Maunder, Indian, Fotheringham)](#6-altitude--azimuth-criteria)
7. [Bruin Physical Model (1977)](#7-bruin-physical-model-1977)
8. [Yallop q-Test (1997)](#8-yallop-q-test-1997)
9. [Odeh Criterion (2004)](#9-odeh-criterion-2004)
10. [Schaefer Modern Theoretical Algorithm (1988 / 1996)](#10-schaefer-modern-theoretical-algorithm)
11. [SAAO Criterion (Caldwell & Laney 2001)](#11-saao-criterion-caldwell--laney-2001)
12. [Segura Illuminance Model (2021)](#12-segura-illuminance-model-2021)
13. [Danjon Limit](#13-danjon-limit)
14. [Country-Specific Rules](#14-country-specific-rules)
15. [Our Implementation — Weighted Heuristic (MVP)](#15-our-implementation--weighted-heuristic-mvp)
16. [References & Credits](#16-references--credits)

---

## 1. Tabular / Islamic Civil Calendar

### What it is

An **arithmetic** (tabular) Hijri calendar that follows a fixed set of rules with no astronomical observation. It was developed by Muslim astronomers in the 2nd century AH (8th century CE). An example is the **Fatimid (Misri) calendar** used by the Ismaili-Taiyebi Bohra community.

### Rules

| Element | Value |
|---|---|
| Epoch | 1 Muharram 1 AH = Friday, **16 July 622 CE** (Julian) |
| Year length | 354 days (common) or 355 days (leap) |
| Month lengths | Odd months = 30 d, even months = 29 d |
| Leap adjustment | Month 12 (Dhū al-Ḥijjah) = 30 d in a leap year |
| Cycle | 11 leap years in every 30-year cycle |
| Mean month | 29.53̄056 d (29 d 12 h 44 m) |
| Days per 30-year cycle | 10,631 |

### Intercalary Scheme Variants

Five documented variants differ only in which years of the 30-year cycle are leap:

| Variant | Leap years |
|---|---|
| **Type IIa** — al-Khwārizmī, al-Battānī, "Kuwaiti algorithm" | 2, 5, 7, 10, 13, **16**, 18, 21, 24, 26, 29 |
| Kūshyār ibn Labbān, Ulugh Beg | 2, 5, 7, 10, 13, **15**, 18, 21, 24, 26, 29 |
| al-Jamāʾirī of Seville | 2, 5, **8**, 10, 13, 16, 18, 21, 24, 26, 29 |
| Fāṭimid / Ismāʿīlī / Bohorā | 2, 5, **8**, 10, 13, 16, **19**, 21, 24, **27**, 29 |
| Ḥabash al-Ḥāsib, al-Bīrūnī | 2, 5, **8**, **11**, 13, 16, **19**, 21, 24, **27**, **30** |

This project uses **Type IIa** (the "Kuwaiti algorithm"), which is also the algorithm used by Microsoft Windows for Gregorian ↔ Islamic date conversion.

### Algorithm (JDN-based)

Our engine converts dates via the Julian Day Number (JDN). The implementation is in [`packages/calendar-engine/src/civil.ts`](../packages/calendar-engine/src/civil.ts).

```
constant ISLAMIC_EPOCH_JDN = 1948439  // JDN for 1 Muharram 1 AH

function isLeapYear(year):
    yearInCycle = ((year - 1) mod 30) + 1
    return yearInCycle in {2,5,7,10,13,16,18,21,24,26,29}

function monthLength(year, month):
    if month == 12:
        return 30 if isLeapYear(year) else 29
    return 30 if month is odd else 29

function hijriToJdn(year, month, day):
    monthDays = ceil(29.5 × (month - 1))
    yearDays  = (year - 1) × 354 + floor((3 + 11 × year) / 30)
    return day + monthDays + yearDays + ISLAMIC_EPOCH_JDN - 1

function jdnToHijri(jdn):
    L = jdn - ISLAMIC_EPOCH_JDN + 1
    year = floor((30 × L + 10646) / 10631)
    // refine year, then find month by iterating month lengths
    ...
    return (year, month, day)
```

Gregorian ↔ JDN uses the Fliegel-Van Flandern algorithm (proleptic Gregorian).

### Accuracy

- **Long-term (30-year mean)**: drifts ~1 day per 2,500 solar years.
- **Short-term**: can differ by **1–2 days** from observation-based calendars on any given month.

> **Sources**: [Tabular Islamic calendar — Wikipedia](https://en.wikipedia.org/wiki/Tabular_Islamic_calendar); Reingold & Dershowitz, *Calendrical Calculations* (1990, 2018).

---

## 2. Umm al-Qura Calendar

### What it is

The official **administrative / civil** calendar of Saudi Arabia. It is based on **astronomical calculations** (not naked-eye sighting), and is used for scheduling government affairs, paychecks, and airline flights. Religious dates (Ramadan, Eid, Hajj) are still determined by actual sighting committees.

### Rules (three eras)

| Period | Rule | Reference point |
|---|---|---|
| **Before AH 1420** (pre-18 Apr 1999) | Moon's age at sunset in Riyadh ≥ 12 hours → month begins | Riyadh |
| **AH 1420–1422** (1999–2002) | Moonset after sunset at Makkah → month begins | Makkah |
| **AH 1423 onward** (since 16 Mar 2002) | Geocentric conjunction **before** sunset **AND** moonset **after** sunset at Makkah → month begins | Makkah |

### Pseudocode (current rule, AH 1423+)

```
function ummAlQuraNewMonth(lunation):
    conjunctionUtc = astronomicalNewMoon(lunation)
    sunsetMakkah   = sunset(lat=21.4225, lon=39.8262, date=conjunctionUtc.date)
    moonsetMakkah  = moonset(lat=21.4225, lon=39.8262, after=sunsetMakkah)

    if conjunctionUtc < sunsetMakkah AND moonsetMakkah > sunsetMakkah:
        return sunsetMakkah.date        // this evening starts day 1
    else:
        return nextDay(sunsetMakkah.date) // month starts one day later
```

### Notes

- The ISNA, FCNA, and ECFR (2007) adopted the same Umm al-Qura parameters for North America and Europe: conjunction before sunset at Makkah + moonset after sunset at Makkah.
- Pre-AH 1420 dates were often 1–2 days ahead of other countries due to the generous "age ≥ 12 h" rule.

> **Source**: [Islamic calendar — Wikipedia](https://en.wikipedia.org/wiki/Islamic_calendar) (section "Umm al-Qura"); King Abdulaziz City for Science and Technology (KACST).

---

## 3. Global Conjunction ("Moon Birth on Earth")

### What it is

The **simplest astronomical method**: a new Hijri month begins for the **entire world** at the moment of the astronomical **conjunction** (new moon), regardless of whether the crescent would be visible anywhere.

### Rationale

- The conjunction is a **single, unique, location-independent instant** defined geocentrically (the moment the Moon's ecliptic longitude equals the Sun's).
- This yields a **universal calendar** — every country, every timezone, same Hijri date.
- It removes all ambiguity: the "moon is born" on Earth, and the month starts.

### Pseudocode

```
function globalConjunctionNewMonth(lunation):
    conjunctionUtc = astronomicalNewMoon(lunation)
    // The Hijri day that contains this conjunction begins at the
    // preceding sunset (Islamic day starts at sunset).
    //
    // Two common sub-rules:
    //   (a) The day starts at sunset *anywhere on Earth* that sees
    //       sunset after the conjunction. (Earliest timezone first.)
    //   (b) The month begins on the calendar day the conjunction
    //       falls on, uniformly for all timezones.
    return conjunctionUtc
```

### Key variables

| Variable | Source |
|---|---|
| Conjunction time (UTC) | Ephemeris computation (e.g., `astronomy-engine` `SearchMoonPhase(0, ...)`) |

### Pros and cons

| Pros | Cons |
|---|---|
| Perfectly predictable years in advance | Does **not** correspond to any possible crescent sighting |
| Single worldwide calendar | The crescent becomes visible only ~15–24 h after conjunction |
| No location dependency | Departs from the traditional Quranic emphasis on *seeing* the hilal |

> **Sources**: [New moon — Wikipedia](https://en.wikipedia.org/wiki/New_moon); Ilyas, M., *A Modern Guide to Astronomical Calculations of Islamic Calendar* (1984).

---

## 4. New Moon at Makkah

### What it is

A variant of the conjunction method that uses **Makkah** (21.4225° N, 39.8262° E) as a **single decision point** for the entire Muslim world. The month begins when the astronomical new moon (conjunction) occurs **before sunset at Makkah**.

### Rationale

- Makkah is the holiest city in Islam and the **qibla** direction for prayer; using it as a reference point has religious significance.
- It is a compromise between the global conjunction approach and local sighting.
- It produces a **single worldwide calendar** with a religious anchor point.

### Pseudocode

```
function makkahConjunctionNewMonth(lunation):
    conjunctionUtc = astronomicalNewMoon(lunation)
    sunsetMakkah   = sunset(lat=21.4225, lon=39.8262, date=conjunctionUtc.date)

    if conjunctionUtc < sunsetMakkah:
        // Conjunction happened before Makkah's sunset today
        // → tonight (after sunset) is the 1st night of the new month
        return sunsetMakkah.date
    else:
        // Conjunction is after Makkah's sunset → month begins next evening
        return nextDay(sunsetMakkah.date)
```

### Difference from Umm al-Qura

Umm al-Qura adds a second condition: moonset must also be after sunset at Makkah. This "New Moon at Makkah" method drops that condition and only requires conjunction before sunset.

### Pros and cons

| Pros | Cons |
|---|---|
| Religiously meaningful anchor | Still no actual crescent sighting |
| Single worldwide calendar | Western hemisphere may not see crescent for another day |
| Fully predictable | Different from most traditional fiqh positions on hilal |

---

## 5. Babylonian Criterion (Age + Lag)

### What it is

The oldest known crescent visibility criterion, dating back to the Babylonian era. Two simple checks:

1. **Moon's age** (hours since conjunction) > 24 hours.
2. **Lag time** (moonset − sunset) > 48 minutes.

### Pseudocode

```
function babylonianCriterion(sunset, moonset, conjunctionTime):
    age = (sunset - conjunctionTime) in hours
    lag = (moonset - sunset) in minutes
    return age > 24 AND lag > 48
```

### Performance

Schaefer (1996) tested this criterion against 294 individual observations and the five Moonwatches (1490 reports) and concluded:

- **Age criterion**: Zone of uncertainty spans the **entire world** (~238° of longitude). A 15.0-hour crescent has been sighted; a 51.3-hour crescent has been missed. Age is a "bad predictor of lunar visibility."
- **Moonset lag criterion**: Zone of uncertainty covers the entire world (~240° of longitude). Crescents with lags as short as 35 min have been seen; crescents with lags of 75 min have been missed.

> **Sources**: Odeh (2004), §2.1; Schaefer (1996), "Age" and "Moonset Lag" sections.

---

## 6. Altitude / Azimuth Criteria

### Maunder (1911)

The crescent is visible if:

ARCV > 11 − |DAZ|/20 − DAZ²/100

| DAZ | 0° | 5° | 10° | 15° | 20° |
|---|---|---|---|---|---|
| ARCV threshold | 11.0° | 10.5° | 9.5° | 8.0° | 6.0° |

> **Source**: Maunder, E.W. (1911), "On the smallest visible phase of the Moon," *Journal of the British Astronomical Association*, 21, 355–362.

### Indian Astronomical Ephemeris (Schoch, 1930)

The crescent is visible if:

ARCV > 10.3743 − 0.0137·|DAZ| − 0.0097·DAZ²

| DAZ | 0° | 5° | 10° | 15° | 20° |
|---|---|---|---|---|---|
| ARCV threshold | 10.4° | 10.0° | 9.3° | 8.0° | 6.2° |

> **Source**: Schoch, C. (1930), *Ergänzungsheft zu den Astronomischen Nachrichten*, 8 (2); cited in Yallop (1997), §3.

### Performance (Schaefer 1996 testing)

The altitude/azimuth criteria can make a **confident prediction only about one-quarter of the time**. The zone of uncertainty covers ~94° of longitude (~3/4 of the world). The main failure is that they do not account for atmospheric haze, which varies drastically by season, latitude, elevation, and humidity.

> **Source**: Schaefer (1996), "Altitude/azimuth" section and Table II.

---

## 7. Bruin Physical Model (1977)

### What it is

Bruin proposed expressing the visibility criterion as ARCV vs. the **crescent width** W (arcminutes), rather than ARCV vs. DAZ. This is a more physically meaningful parameterisation because W directly relates to the crescent's intrinsic brightness. He also provides a method for calculating the **best time** for observation and curves for different values of W.

### Criterion

The crescent is visible if:

ARCV > 12.4023 − 9.4878·W + 3.9512·W² − 0.5632·W³

where W = width of the crescent in arcminutes:

W = 15·(1 − cos ARCL)

(Bruin assumed a constant semi-diameter of 15'.)

| W | 0.3' | 0.5' | 0.7' | 1' | 2' | 3' |
|---|---|---|---|---|---|---|
| ARCV threshold | 10.0° | 8.4° | 7.5° | 6.4° | 4.7° | 4.3° |

### Limitations

Bruin applied a "Gestalt" factor to his curves. Doggett & Schaefer (1994) criticized some of his atmospheric assumptions as being "orders of magnitude out." Nevertheless, Yallop (1997) considered Bruin's approach foundational because it addresses the physics of the problem.

> **Sources**: Bruin, F. (1977), "The first visibility of the lunar crescent," *Vistas in Astronomy*, 21, 331–358; Yallop (1997), §3; Odeh (2004), Table III.

---

## 8. Yallop q-Test (1997)

### What it is

A **single-parameter** visibility criterion developed by B.D. Yallop at the Royal Greenwich Observatory. It combines the Indian method's ARCV-vs-DAZ curve with Bruin's crescent width approach, using the **topocentric** crescent width and a single test parameter *q*.

### Key Variables

| Symbol | Definition |
|---|---|
| ARCL | Geocentric angular separation of Sun and Moon centres (elongation) |
| ARCV | Geocentric difference in altitude between Sun and Moon centres |
| DAZ | Difference in azimuth (Sun − Moon) |
| W' | Topocentric width of the crescent (arcminutes) |
| π | Parallax of the Moon |
| h | Geocentric altitude of the Moon |
| q | Single test parameter |

### Topocentric Crescent Width

SD = 0.27245 × π

SD' = SD × (1 + sin(h) × sin(π))

W' = SD' × (1 − cos ARCL)

where SD is the geocentric semi-diameter and SD' is the topocentric semi-diameter.

### Best Time for Observation

Yallop derived a simple rule from Bruin's curves:

Tb = Ts + (4/9) × Lag

where Tb is the best time, Ts is the time of sunset, and Lag = moonset − sunset (in the same time units).

### The q-Test Formula

q = (ARCV − (11.8371 − 6.3226·W' + 0.7319·W'² − 0.1018·W'³)) / 10

The polynomial inside the parentheses is the Indian method's visibility curve expressed as a function of W', and the division by 10 confines q roughly to the range [−1, +1].

### Visibility Zones

| Zone | q range | Meaning |
|---|---|---|
| **A** | q > +0.216 | Easily visible to the unaided eye (ARCL ≥ 12°) |
| **B** | +0.216 ≥ q > −0.014 | Visible under perfect atmospheric conditions |
| **C** | −0.014 ≥ q > −0.160 | May need optical aid to find crescent, then visible to eye |
| **D** | −0.160 ≥ q > −0.232 | Only visible with binoculars or telescope |
| **E** | −0.232 ≥ q > −0.293 | Below normal limit for telescope detection |
| **F** | q ≤ −0.293 | Not visible — below the Danjon limit |

### Pseudocode

```
function yallopQTest(ARCV, ARCL, moonParallax, moonGeoAlt):
    SD  = 0.27245 * moonParallax
    SD_topo = SD * (1 + sin(moonGeoAlt) * sin(moonParallax))
    W_prime = SD_topo * (1 - cos(ARCL))         // arcminutes

    curve = 11.8371 - 6.3226*W_prime + 0.7319*W_prime^2 - 0.1018*W_prime^3
    q = (ARCV - curve) / 10

    if q > +0.216:   return "A — Easily visible"
    if q > -0.014:   return "B — Visible under perfect conditions"
    if q > -0.160:   return "C — May need optical aid"
    if q > -0.232:   return "D — Telescope only"
    if q > -0.293:   return "E — Below telescope limit"
    return                    "F — Not visible (Danjon limit)"

function bestTime(sunsetTime, lagMinutes):
    return sunsetTime + (4/9) * lagMinutes
```

### Calibration

The q-test was calibrated against **295 historical observations** spanning 1859–1996 (Schaefer's database with Yallop's corrections). The data are listed in Table 4 of the paper, sorted by decreasing q. Zone boundaries were set empirically by matching Schaefer's coded visibility descriptions.

> **Source**: Yallop, B.D. (1997), "A Method for Predicting the First Sighting of the New Crescent Moon," NAO Technical Note No. 69 (Royal Greenwich Observatory). PDF: [`docs/yallop_1997.pdf`](yallop_1997.pdf).

---

## 9. Odeh Criterion (2004)

### What it is

An updated criterion by Mohammad Sh. Odeh (Arab Union for Astronomy and Space Sciences), calibrated against a much larger database of **737 observations** — nearly half from the Islamic Crescent Observation Project (ICOP, established 1998).

### Key Advance

- Uses **topocentric** values (not geocentric) for both ARCV and W.
- Predicts visibility for **both naked eye and optical aid**.
- Found a **Danjon limit of 6.4°** (from observation #697).

### Variables

| Symbol | Definition |
|---|---|
| ARCV | **Airless topocentric** arc of vision (degrees) |
| W | **Topocentric** crescent width (arcminutes) |
| V | Visibility prediction value |

The calculations are performed at **best time** (Yallop's formula: Tb = Ts + (4/9) × Lag).

### The V Formula

V = ARCV − (−0.1018·W³ + 0.7319·W² − 6.3226·W + 7.1651)

### Visibility Zones

| Zone | V range | Meaning |
|---|---|---|
| **A** | V ≥ 5.65 | Visible by **naked eye** |
| **B** | 2 ≤ V < 5.65 | Visible by **optical aid**, may be seen by naked eye |
| **C** | −0.96 ≤ V < 2 | Visible by **optical aid only** |
| **D** | V < −0.96 | **Not visible** even with optical aid |

### Tabular Form

| W | 0.1' | 0.2' | 0.3' | 0.4' | 0.5' | 0.6' | 0.7' | 0.8' | 0.9' |
|---|---|---|---|---|---|---|---|---|---|
| ARCV₁ (Zone C lower) | 5.6° | 5.0° | 4.4° | 3.8° | 3.2° | 2.7° | 2.1° | 1.6° | 1.0° |
| ARCV₂ (Zone B lower) | 8.5° | 7.9° | 7.3° | 6.7° | 6.2° | 5.6° | 5.1° | 4.5° | 4.0° |
| ARCV₃ (Zone A lower) | 12.2° | 11.6° | 11.0° | 10.4° | 9.8° | 9.3° | 8.7° | 8.2° | 7.6° |

### Pseudocode

```
function odehCriterion(ARCV_topo, W_topo):
    // ARCV and W must be airless, topocentric, at best time
    V = ARCV_topo - (-0.1018 * W_topo^3 + 0.7319 * W_topo^2
                      - 6.3226 * W_topo + 7.1651)

    if V >= 5.65:   return "A — Naked-eye visible"
    if V >= 2.0:    return "B — Optical aid, possibly naked-eye"
    if V >= -0.96:  return "C — Optical aid only"
    return                   "D — Not visible"
```

### Youngest Crescent Records (from 737 observations)

| Record | Age | Observer |
|---|---|---|
| Youngest by optical aid | 13 h 14 min (topocentric) | Jim Stamm, 21 Jan 1996 |
| Youngest by naked eye | 15 h 33 min (topocentric) | John Pierce, 25 Feb 1990 |
| Minimum elongation (optical) | 6.4° | Stamm #697 |
| Minimum elongation (naked eye) | 7.7° | Pierce #274 |

> **Source**: Odeh, M.Sh. (2004), "New Criterion for Lunar Crescent Visibility," *Experimental Astronomy*, 18, 39–64. PDF: [`docs/New_Criterion_for_Lunar_Crescent_Visibility.pdf`](New_Criterion_for_Lunar_Crescent_Visibility.pdf).

---

## 10. Schaefer Modern Theoretical Algorithm

### What it is

Bradley E. Schaefer developed a **physics-based model** that calculates whether the crescent Moon can actually be detected by the human eye given specific atmospheric and sky conditions. Rather than using empirical altitude/azimuth thresholds, it models the underlying physical and physiological processes.

### Approach

The algorithm computes an **R-parameter**:

R = log₁₀(B_moon_actual / B_moon_threshold)

where:
- B_moon_actual = actual surface brightness of the crescent moon as seen through the atmosphere
- B_moon_threshold = minimum brightness detectable by the human eye against the twilight sky

The algorithm also calculates ΔR (estimated 1σ uncertainty). The ratio R / ΔR measures **confidence** in the visibility prediction:
- Large positive → easily visible
- Near zero → on the boundary (zone of uncertainty)
- Large negative → invisible

### Components modelled

1. **Orbital mechanics**: Sun/Moon positions (ARCL, ARCV, DAZ)
2. **Lunar scattering**: crescent brightness as a function of phase angle (using Allen 1963)
3. **Atmospheric extinction**: Rayleigh scattering, aerosol scattering, ozone absorption — each handled separately due to distinct vertical structure
4. **Twilight sky brightness**: as a function of Sun depression and azimuth
5. **Visual physiology**: human detection threshold for a thin crescent shape

### Key advantage

The atmospheric haziness is calculated on a **site-by-site, month-by-month** basis using seasonal, latitudinal, and elevation correlations corrected for average evening relative humidity. This accounts for the large visibility differences between (e.g.) a clear Arizona desert sky and turbid Louisiana summer air — something altitude/azimuth criteria cannot do.

### Performance (tested on 294 observations + 1490 Moonwatch reports)

| Algorithm | Avg. error (longitude) | Max error (longitude) | Zone of uncertainty |
|---|---|---|---|
| Age (24 h) | — | — | 238° (entire world) |
| Moonset lag (48 min) | 66° | 144° | 240° (entire world) |
| Altitude/azimuth | ~40° | ~70° | 94° (~3/4 of world) |
| **Schaefer theoretical** | **11°** | **23°** | **59°** |

### Pseudocode (conceptual — the actual model is complex)

```
function schaeferVisibility(observer, date):
    // 1. Compute Sun/Moon ephemeris at best time
    (ARCL, ARCV, DAZ, moonAlt, sunDepression) = computeEphemeris(observer, date)

    // 2. Compute crescent brightness
    phaseMag = allenLunarMagnitude(ARCL)
    crescentBrightness = mag_to_luminance(phaseMag)

    // 3. Apply atmospheric extinction
    k_rayleigh = rayleighCoefficient(observer.elevation, observer.latitude, month)
    k_aerosol  = aerosolCoefficient(observer.elevation, observer.latitude, month, humidity)
    k_ozone    = ozoneCoefficient(observer.latitude, month)
    k_total    = k_rayleigh + k_aerosol + k_ozone
    airmass    = 1 / cos(zenithAngle)  // simplified; Schaefer uses Rozenberg formula
    B_moon     = crescentBrightness * 10^(-0.4 * k_total * airmass)

    // 4. Compute twilight sky brightness
    B_sky = twilightModel(sunDepression, azimuthFromSun, k_total)

    // 5. Human eye detection threshold
    B_threshold = contrastThreshold(B_sky, crescentAngularSize)

    // 6. Calculate R
    R = log10(B_moon / B_threshold)
    DR = estimateUncertainty(...)

    if R > 0:  return "Visible (confidence: R/DR)"
    else:      return "Not visible"
```

### Software

Schaefer implemented this as [LunarCal](http://www.cfa.harvard.edu/~bschaefer/) (Westwind Computing, 1990).

> **Sources**: Schaefer, B.E. (1988), "Visibility of the Lunar Crescent," *Quarterly Journal of the Royal Astronomical Society*, 29, 511–523. PDF: [`docs/1988QJRAS__29__511S.pdf`](1988QJRAS__29__511S.pdf); Schaefer, B.E. (1996), "Lunar Crescent Visibility," *QJRAS*, 37, 759–768. PDF: [`docs/schaefer_1996.pdf`](schaefer_1996.pdf).

---

## 11. SAAO Criterion (Caldwell & Laney 2001)

### What it is

A criterion from the South African Astronomical Observatory (SAAO), based on Schaefer's observation database plus additional records. It uses DALT (apparent altitude of the lower edge of the Moon at sunset) vs. DAZ.

### Thresholds

| DAZ | 0° | 5° | 10° | 15° | 20° |
|---|---|---|---|---|---|
| DALT₁ (impossible below) | 6.3° | 5.9° | 4.9° | 3.8° | 2.6° |
| DALT₂ (improbable below) | 8.2° | 7.8° | 6.8° | 5.7° | 4.5° |

- Below DALT₁: visibility **impossible** even with optical aid.
- Between DALT₁ and DALT₂: naked-eye visibility **improbable**; optical aid may succeed.
- Above DALT₂: **probable** naked-eye visibility.

> **Source**: Caldwell, J. & Laney, C. (2001), "First visibility of the Lunar crescent," SAAO, *African Skies*, 5. Cited in Odeh (2004), Table IV.

---

## 12. Segura Illuminance Model (2021)

### What it is

Wenceslao Segura proposes a **probabilistic** physical method. Rather than producing a binary visible/invisible answer, the model outputs a **probability of seeing the crescent Moon**.

### Key Insight

Blackwell (1946) showed that threshold vision is a probabilistic process with three zones:
1. **100% visibility**: contrast is very high → always seen.
2. **0% visibility**: contrast is too low → never seen.
3. **Critical zone**: intermediate contrast → probability depends on C / C_th.

### Approach

1. Find the **topocentric altitude, azimuth difference (DZ), Sun depression (d)**, Earth-Moon distance, and phase angle.
2. Compute the **luminance** of the Moon (without atmospheric absorption) using the phase angle.
3. Apply the **atmospheric extinction coefficient** for the observation site to get B_m (Moon luminance at Earth's surface).
4. Compute the **twilight sky luminance** B_s as f(d, DZ).
5. Compute contrast C = B_m / B_s and threshold illuminance E_th from Blackwell data.
6. Use E / E_th and Blackwell's probability distribution to find the **probability of seeing the crescent**.

### Important observations

- When the crescent width is **smaller than the eye's optical resolution** (~1 arcminute), we must use **illuminance** (flux reaching the pupil) rather than **luminance**, since the retina responds to photon count per unit area.
- Danjon (1932, 1936) showed that lunar horns shorten with increasing phase angle, so only the **central part** of the crescent needs analysis.
- The extinction coefficient is impossible to predict even one day in advance, and even small variations significantly affect visibility prediction.

> **Source**: Segura, W. (2021), "Predicting the First Visibility of the Lunar Crescent," *Academia Letters*, Article 2878. PDF: [`docs/Predicting_the_First_Visibility_of_the_L.pdf`](Predicting_the_First_Visibility_of_the_L.pdf).

---

## 13. Danjon Limit

### What it is

The **minimum elongation** (angular separation between Moon and Sun) below which the crescent cannot be seen, regardless of observing conditions.

### Values in the literature

| Author | Year | Danjon limit | Basis |
|---|---|---|---|
| Danjon | 1936 | **7°** | Attributed to shadow of lunar mountains |
| McNally | 1983 | **5°** | Attributed to atmospheric seeing effects |
| Schaefer | 1991 | **7°** | Crescent brightness below detection threshold |
| Odeh | 2004 | **6.4°** | Observation #697 from 737-record database |

### In Yallop's formulation

The Danjon limit corresponds to ARCL ≈ 7°. Allowing 1° for horizontal parallax and ignoring refraction, ARCL = 8°. With DAZ = 0, this gives q ≈ −0.293 (the boundary between zones E and F).

> **Sources**: Danjon (1936); Odeh (2004), §8; Yallop (1997), §6.

---

## 14. Country-Specific Rules

Different countries use different methods for determining the start of each Hijri month:

| Country / Body | Method |
|---|---|
| **Saudi Arabia** (religious) | Actual sighting by hilal committees; testimony before courts |
| **Saudi Arabia** (civil) | Umm al-Qura (§2 above) |
| **Malaysia, Indonesia** | Moonset after sunset (imkān al-ru'yah) |
| **Egypt** | Moon sets at least **5 minutes** after sunset |
| **Turkey** (Diyanet, AH 1400–1435) | Crescent > 5° altitude AND > 8° elongation (geocentric), evaluated globally |
| **Turkey** (current) | Crescent visible above Ankara's local horizon at sunset |
| **Pakistan** | Central Ruet-e-Hilal Committee with ~150 meteorological observatories |
| **ISNA / FCNA / ECFR** (2007) | Umm al-Qura parameters (conjunction before sunset + moonset after sunset at Makkah) |
| **Ismaili-Taiyebi Bohras** | Tabular (Fatimid) calendar (§1 above) |

> **Source**: [Islamic calendar — Wikipedia](https://en.wikipedia.org/wiki/Islamic_calendar).

---

## 15. Our Implementation — Weighted Heuristic (MVP)

### What it is

Our current calendar engine uses a **simplified weighted heuristic** for estimating crescent visibility. It is implemented in [`packages/calendar-engine/src/monthStartEstimate.ts`](../packages/calendar-engine/src/monthStartEstimate.ts).

This is **not** a direct implementation of any single criterion (Yallop, Odeh, or Schaefer). It is an **education-oriented approximation** inspired by their work that uses easily computed parameters from the `astronomy-engine` library.

### Inputs (computed at local sunset)

| Parameter | Symbol | Source |
|---|---|---|
| Moon altitude | `moonAltitudeDeg` | Topocentric horizon coordinates at sunset |
| Sun-Moon elongation | `moonElongationDeg` | Geocentric angular separation at sunset |
| Moon age | `moonAgeHours` | Hours since last conjunction (`SearchMoonPhase(0, ...)`) |
| Moonset lag | `lagMinutes` | Moonset time − sunset time (minutes) |

### Score formula

Each parameter is normalized linearly to [0, 1]:

```
sAltitude = normalize(moonAltitude,   low=0°,   high=10°)
sElong    = normalize(moonElongation, low=6°,   high=15°)
sAge      = normalize(moonAge,        low=12h,  high=24h)
sLag      = normalize(lagMinutes,     low=0min, high=60min)

visibilityScore = 0.35 × sAltitude
                + 0.35 × sElong
                + 0.20 × sAge
                + 0.10 × sLag
```

The score is clamped to [0, 1] and mapped to a percentage (0–100%).

### Override rules

- **Waning phase** (phase > 0.5) or **far from conjunction** (age > 72 h): score = 0 (not a new crescent).
- **Hard fail**: Moon below horizon, elongation < 6° (Danjon-inspired), or age < 12 h → score capped at 0.20.
- **Strong pass**: altitude ≥ 7° AND elongation ≥ 12° AND age ≥ 20 h → score floored at 0.75.

### Signal levels

| Level | Score range |
|---|---|
| **noChance** | 0 (Moon below horizon or lag ≤ 0) |
| **veryLow** | 0–10% |
| **low** | 10–35% |
| **medium** | 35–65% |
| **high** | > 65% |

### Exclusive month-start rule

If day X is "medium" or "high," day X+1 is forced to "noChance" — a month can only start once.

### Relationship to the literature

| Our parameter | Comparable to |
|---|---|
| `moonAltitudeDeg` | ARCV (approximately, when Sun is near horizon) |
| `moonElongationDeg` | ARCL |
| `moonAgeHours` | Age (Babylonian / Yallop column 12) |
| `lagMinutes` | Lag (Babylonian / Yallop column 13) |
| Danjon cutoff at 6° | Odeh's Danjon limit of 6.4° |

We do **not** compute crescent width W, topocentric corrections to W, atmospheric extinction, or sky brightness — all of which the Yallop, Odeh, and Schaefer models use. This is a deliberate simplification for the MVP.

### Closest established method: Yallop q-test

The Yallop q-test (§8) is the most comparable published criterion. Both produce a single scalar mapped to discrete visibility zones and both apply a Danjon-inspired cutoff around 6–7°. The key differences are:

| Aspect | Yallop q-test | Our heuristic |
|---|---|---|
| **Core variable** | Topocentric crescent width **W'** (arcmin), derived from ARCL + moon parallax + altitude | Raw ARCL (elongation) — no crescent width computation |
| **Formula** | Cubic polynomial: `q = (ARCV − (11.8371 − 6.3226W' + 0.7319W'² − 0.1018W'³)) / 10` | Linear weighted sum: `0.35·alt + 0.35·elong + 0.20·age + 0.10·lag` |
| **Evaluation time** | **Best time**: `Tb = Ts + 4/9 × Lag` (optimum contrast between crescent and sky) | **Sunset** (not the optimal observation moment) |
| **Inputs** | 2 variables (ARCV, W') that encode the physics | 4 variables with ad-hoc weights |
| **Topocentric correction** | Yes — SD' accounts for parallax and observer's horizon position | No — uses raw topocentric altitude but no W correction |
| **Calibration** | Empirically fitted to **295 historical observations** (1859–1996) | Not calibrated against observations |
| **Zones** | 6 (A–F), with optical-aid distinction | 5 levels (noChance → high), no optical-aid distinction |

### Upgrade path to Yallop

To move from our heuristic to a proper Yallop implementation:

1. **Compute W'** — requires moon parallax (π) and geocentric altitude (h) from `astronomy-engine`, then: `SD = 0.27245×π`, `SD' = SD×(1+sin(h)×sin(π))`, `W' = SD'×(1−cos(ARCL))`
2. **Evaluate at best time** instead of sunset — shift by `(4/9) × lag`
3. **Replace the weighted sum** with the cubic polynomial q formula
4. **Drop age and lag** as direct inputs (they're implicitly captured by ARCV and W' at best time)

The `astronomy-engine` library already provides everything needed (moon parallax via `Equator()`, geocentric altitude, ARCL via `AngleFromSun()`), so this is a realistic next step without adding any new dependencies.

---

## 16. References & Credits

### Primary references (PDFs in `docs/`)

| Citation | File |
|---|---|
| Yallop, B.D. (1997). "A Method for Predicting the First Sighting of the New Crescent Moon." NAO Technical Note No. 69, Royal Greenwich Observatory. | [`yallop_1997.pdf`](yallop_1997.pdf) |
| Odeh, M.Sh. (2004). "New Criterion for Lunar Crescent Visibility." *Experimental Astronomy*, 18, 39–64. | [`New_Criterion_for_Lunar_Crescent_Visibility.pdf`](New_Criterion_for_Lunar_Crescent_Visibility.pdf) |
| Schaefer, B.E. (1988). "Visibility of the Lunar Crescent." *QJRAS*, 29, 511–523. | [`1988QJRAS__29__511S.pdf`](1988QJRAS__29__511S.pdf) |
| Schaefer, B.E. (1996). "Lunar Crescent Visibility." *QJRAS*, 37, 759–768. | [`schaefer_1996.pdf`](schaefer_1996.pdf) |
| Segura, W. (2021). "Predicting the First Visibility of the Lunar Crescent." *Academia Letters*, Article 2878. | [`Predicting_the_First_Visibility_of_the_L.pdf`](Predicting_the_First_Visibility_of_the_L.pdf) |
| Reingold, E.M., Dershowitz, N. & Clamen, S.M. (1993). "Calendrical Calculations, II." *Software—Practice and Experience*, 23(4), 383–404. | [`CalendricalCalculationsII.pdf`](CalendricalCalculationsII.pdf) |

### Additional references cited in the papers

- Bruin, F. (1977). "The first visibility of the lunar crescent." *Vistas in Astronomy*, 21, 331–358.
- Maunder, E.W. (1911). "On the smallest visible phase of the Moon." *J. British Astronomical Association*, 21, 355–362.
- Schoch, C. (1930). *Ergänzungsheft zu den Astronomischen Nachrichten*, 8 (2).
- Danjon, A. (1936). "Le croissant lunaire." *L'Astronomie*, 50, 57–65.
- McNally, D. (1983). *QJRAS*, 24, 417.
- Caldwell, J. & Laney, C. (2001). "First visibility of the Lunar crescent." SAAO, *African Skies*, 5.
- Doggett, L.E. & Schaefer, B.E. (1994). *Icarus*, 107, 388.
- Fatoohi, L.J., Stephenson, F.R. & Al-Dargazelli, S.S. (1998). "The Danjon limit of first visibility of the lunar crescent." *Observatory*, 118, 65–72.
- Ilyas, M. (1994). *QJRAS*, 35, 425.
- Blackwell, H. (1946). "Contrast Thresholds of the Human Eye." *J. Optical Society of America*, 36(1), 624–643.
- Allen, C.W. (1973). *Astrophysical Quantities*. University of London.
- Reingold, E.M. & Dershowitz, N. (2018). *Calendrical Calculations: The Ultimate Edition*. Cambridge University Press.

### Wikipedia articles (HTML in `docs/`)

- [Islamic calendar](https://en.wikipedia.org/wiki/Islamic_calendar)
- [Tabular Islamic calendar](https://en.wikipedia.org/wiki/Tabular_Islamic_calendar)
- [New moon](https://en.wikipedia.org/wiki/New_moon)
- [Lunar phase](https://en.wikipedia.org/wiki/Lunar_phase)

### Software

- [`astronomy-engine`](https://github.com/cosinekitty/astronomy) (npm ^2.1.19) — Sun/Moon ephemeris, rise/set times, conjunction search.
