# Hijri Date Calculator – Product + Engineering Plan (Azure-friendly)

## 1) Goal
Build a simple, modern, mobile-friendly web app that:
- Generates a month-by-month calendar view (full-year view deferred).
- Converts Gregorian ↔ Hijri dates.
- Shows key Islamic holidays/events for a selected year.
- Shows a *probability/likelihood* score for whether a given Gregorian day is the start of a Hijri month.
- Is easy to deploy and maintain on Azure.

## 2) Non-goals (MVP)
- No user accounts / registration.
- No ads.
- No paid features.
- No public API yet (but the codebase should be structured to add one later).
- No Qibla direction feature in MVP.

## 3) Key product decisions (must be explicit)
Hijri date calculations are not universally agreed upon. “Acceptable” depends on region and authority.

MVP approach: support *multiple calculation methods* with clear labels and documentation; users can choose the method.

### 3.1 Supported calendar methods (planned)
We implement a small “calendar engine” interface and provide at least these methods:

1) **Tabular / Islamic Civil calendar (algorithmic) (default)**
- Pros: deterministic, no external data.
- Cons: may differ from local official calendars.

2) **Umm al-Qura (Saudi official)**
- Pros: widely used; matches many published calendars.
- Cons: effectively a published calendar (rules/data), may require a dataset or a trusted library.

3) **Astronomical visibility-based estimate (for probability scoring)**
- Pros: gives a *likelihood* estimate tied to conjunction + sunset/moonset/elongation.
- Cons: complex; depends on location and observation criterion; still not “certain”.

MVP requirement mapping:
- Conversions and fixed calendars can come from (1) and/or (2).
- Probability scoring comes from (3) and is always shown as “estimate”.

### 3.2 Location & timezone policy
Probability of month-start depends on *where* you are observing.
MVP default:
- Default location: Makkah (or user’s current location if they allow browser geolocation).
- Always show timezone used.

MVP UX for location (to support probability scoring):
- A “Use my location” button (browser geolocation).
- A map picker to choose coordinates manually.
- Always show “Location used” (name/coordinates/timezone).

What “location” means (we must model this explicitly):
- Latitude/longitude (city-level), optionally elevation.
- Timezone (for correct local sunset/moonset calculations).

Country matters in two different ways:
- **Official calendar policy**: some countries follow specific published calendars (e.g., Umm al-Qura for Saudi). This affects *deterministic* Hijri dates if the user chooses that policy.
- **Astronomical visibility**: even with the same “visibility criterion”, different cities can have different outcomes due to sunset time, moon altitude, and sky conditions.

## 4) Features (MVP)

### 4.1 Calendar view (month-by-month)
- Controls:
  - Year selector (Gregorian year).
  - Month selector + Prev/Next month navigation.
- Calendar month view with:
  - Gregorian day number.
  - Hijri day + month name.
  - Highlight month boundaries.
  - Mark holidays/events.

Deferred (low priority):
- Full-year (12-month) grid view.

### 4.2 Date conversion
- Two converters:
  - Gregorian → Hijri
  - Hijri → Gregorian
- Input formats:
  - Date picker for Gregorian.
  - Hijri inputs: day/month/year selectors.

### 4.3 Holidays & events
Show dates for a selected year based on the selected method.
Initial list (MVP):
- Ramadan 1
- Eid al-Fitr (Shawwal 1)
- Dhul Hijjah 1
- Day of Arafah (Dhul Hijjah 9)
- Eid al-Adha (Dhul Hijjah 10)
- Islamic New Year (Muharram 1)
- Ashura (Muharram 10)
- Mawlid (Rabi’ al-Awwal 12) — optional depending on regional practice
- Isra and Mi’raj (Rajab 27) — optional depending on regional practice

Notes:
- Some events are observed differently (e.g., Laylat al-Qadr is commonly on odd nights in the last 10 days). For MVP we avoid asserting a single date unless it’s a fixed Hijri date.

### 4.4 Probability/likelihood of month start
Purpose: help users understand that month start can differ by method/region.

Output:
- For each day near potential month boundaries: a likelihood score (e.g., Low/Medium/High) with the criterion used.

Implementation plan (phased):
- Phase A (MVP): rule-based *heuristic* derived from astronomy inputs (conjunction time, moon age at sunset, elongation, moon altitude at sunset).
- Phase B (later): implement a published criterion (e.g., Yallop/Odeh style) and validate against historical sightings datasets.

Important: This feature must be presented as “estimate” and not as religious or official determination.

Geography note (for the documentation + UX text):
- It’s correct that **different countries can plausibly see the crescent on different evenings**.
- However, it’s *not* a strict “South-West sees first, North-East sees last” rule.
- Visibility tends to vary mostly with **longitude (west vs east)** because local sunset happens later as you go west, giving the Moon more time to separate from the Sun after conjunction.
- **Latitude** also matters because the angle of the ecliptic to the horizon changes with season/latitude, affecting the Moon’s altitude at sunset.
- Weather/atmospheric clarity and observation method (naked eye vs optical aid) also change results.

### 4.5 Language (English + Arabic)
MVP ships bilingual from day 1:
- UI language toggle: English / العربية.
- Full RTL support when Arabic is selected (layout direction, alignment, and calendar grid labels).
- All user-facing strings translated (including holiday/event names, method descriptions, and disclaimers).
- Dates formatted using the selected locale; numerals follow locale conventions where possible.

Non-goals for MVP:
- No auto-translation.
- No additional languages beyond English/Arabic.

## 5) Calculation engine design
Create a small package/module that contains all date logic and can be reused later by an API.

### 5.1 Core interfaces
- `CalendarMethod` (name, description, conversion functions)
- `HolidayDefinition` (Hijri month/day rules, formatting)
- `MonthStartEstimator` (inputs: location, date range; outputs: scored candidates)

### 5.2 Validation strategy
- Unit tests with known reference pairs (Gregorian ↔ Hijri) for each method.
- Golden test cases for holiday dates (a handful per year) using a chosen authoritative reference.
- Edge cases: leap years in tabular calendar, timezone boundaries, daylight savings.
- i18n checks: ensure no missing keys for `en`/`ar`, and ensure RTL mode doesn’t break layout.

## 6) App architecture (Azure-first, low maintenance)
Recommended MVP deployment: **Azure Static Web Apps (SWA)**.
- Frontend: single-page app (SPA).
- No backend required for MVP.
- Future: add serverless API via **Azure Functions** attached to SWA when needed.

Why SWA:
- Simple deploy (GitHub Actions built-in).
- Low ops overhead.
- Easy to add Functions later without redesign.

### 6.1 Proposed tech stack (MVP)
- TypeScript
- React + Vite (or Next.js if we decide we want server rendering later)
- Lightweight date utils (only what we need)
- Tests: Vitest

i18n / RTL:
- `react-i18next` (or equivalent) with JSON resource files.
- A simple `LanguageProvider` that sets `document.documentElement.lang` and `dir` (`ltr`/`rtl`).
- Localized routing is not required for MVP (single URL).

(We can finalize framework after confirming whether SEO matters. For an internal utility app, a SPA is usually enough.)

### 6.2 Repo structure (planned)
- `apps/web/` UI
- `packages/calendar-engine/` pure calculation library
- `docs/` calculation method docs

Inside `apps/web/`:
- `src/i18n/` translation resources (`en.json`, `ar.json`) and initialization.
- `src/components/` RTL-safe components (avoid left/right assumptions; rely on logical CSS where possible).

## 7) Documentation deliverables

### 7.1 README
- What the app does.
- Supported calculation methods and what they mean.
- Known limitations and disclaimers.
- How to run locally.
- How to deploy to Azure Static Web Apps.
- Language support: how to switch English/Arabic.

### 7.2 Calculation-method documentation (detailed)
A dedicated doc explaining:
- Definitions (Hijri months, leap years in tabular calendar, etc.).
- The exact algorithms used.
- For probability scoring: what signals are used and what each score means.
- References and rationale for why these methods are “acceptable” for the intended use.

## 8) Added value (what makes this worth building?)
If we ship “just a converter”, many libraries already exist. Potential differentiators:
- Multi-method comparison (Civil vs Umm al-Qura vs estimate) with clear explanation.
- Month-start *likelihood* visualization (help users understand uncertainty).
- Holiday/event calendar exports (later): iCal/Google Calendar.
- Qibla direction utility (later): compute direction from user’s city/coordinates with map-friendly UI.
- Moon crescent visualization (later): show crescent “view”, visibility %, elongation, and sky position/angles at local sunset.
- “API-ready” architecture: same engine can power a signed API later.

If you want a sharper unique value for v1, the best candidate is:
- “Trusted explanation + transparency” (show method, assumptions, and uncertainty), not just a number.

## 9) Milestones

### Milestone 0 — Confirm assumptions (1–2 hours)
- Pick initial method(s) for MVP (Civil only vs Civil + Umm al-Qura).
- Pick default location policy for probability scoring.
- Decide SPA (Vite) vs Next.js.

### Milestone 1 — Engine + conversions (1–2 days)
- Implement `calendar-engine` with 1 method (Civil) and tests.
- Implement Gregorian ↔ Hijri conversion.

### Milestone 2 — Holidays + calendar UI (2–4 days)
- Month-by-month calendar view.
- Holiday/event overlays.
- Mobile-friendly layout.

### Milestone 3 — Probability estimate (2–5 days)
- Implement heuristic estimator.
- Display scores around month boundaries.
- Add documentation and disclaimers.

### Milestone 4 — Azure SWA deploy (0.5–1 day)
- GitHub Actions deployment.
- Environment configuration.

## 10) Open questions (need your answers)
1) Default method is confirmed: Tabular / Islamic Civil calendar. Should we ship Umm al-Qura as an optional method in v1, or add it later?
2) Should probability scoring be location-specific (user chooses city / geolocation), or keep it fixed to one location for simplicity?
3) Bilingual in MVP is confirmed: English + Arabic. Any specific terminology preferences (e.g., Hijri month names transliteration vs Arabic script only)?
