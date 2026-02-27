# Hijri Month Starts – Pre-filled Template (1400–1447 AH)

## What this package contains

- **Main table**: `hijri_month_starts_template_1400_1447.csv`
  - Pre-filled key columns for 15 representative countries/regions and Hijri years 1400–1447 (inclusive).
  - **Rows**: 8,640 (= countries × years × 12 months).
  - Non-key fields are blank by design (safe for missing data; fill as you discover sources).

- **Conflicts table**: `conflicting_declarations_template.csv`
  - Use when multiple official declarations/calendars disagree for the same (Country, City, HijriYear, HijriMonth).

## Representative country set (with one reference city each)

Saudi Arabia → Makkah
All other countries → capital city (reference city only; does not imply the declaration was city-scoped).

Countries included:
- Saudi Arabia — Makkah
- Egypt — Cairo
- Türkiye — Ankara
- Palestine — Jerusalem
- Jordan — Amman
- Morocco — Rabat
- Libya — Tripoli
- South Africa — Pretoria
- Nigeria — Abuja
- Malaysia — Kuala Lumpur
- Pakistan — Islamabad
- Indonesia — Jakarta
- United States — Washington DC
- Canada — Ottawa
- Australia — Canberra

## Columns (main table)

- Country, City, HijriYear, HijriMonth, HijriMonthName: **pre-filled**
- GregorianStartDate: ISO YYYY-MM-DD (blank if missing)
- GregorianYear: derived from GregorianStartDate (blank if missing)
- Authority: issuing body (blank until filled)
- Method: recommended controlled vocabulary
  - CalculatedCalendar
  - SightingConfirmed
  - NotSighted_Istikmal
  - Hybrid_Hisab_Rukyat
  - Derived_From_Official_Calendar
  - Missing_Official_Data
- SourceURL: provenance link (blank if missing)
- ConfidenceScore: 0–100
  - 95–100: primary official source on authority domain
  - 70–94: official statement reproduced by reputable outlet or official PDF mirror
  - 40–69: secondary aggregator with explicit attribution
  - 0–39: unverified/low-quality source (avoid)
- Notes: free text
- RecordId: stable 16-char SHA1 prefix of (Country|City|HijriYear|HijriMonth) for joining

## No-fail / missing-data rule

If you can’t find an official declaration/calendar for a month:
- leave GregorianStartDate blank
- set Method = Missing_Official_Data (optional)
- add a short Notes reason (e.g., Not Found / Site blocked / No archive)

The pipeline should never drop rows.
