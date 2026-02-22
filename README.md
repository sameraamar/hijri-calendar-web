# Hijri Date Calculator

A bilingual (English/Arabic) web app to:
- Convert Gregorian ↔ Hijri dates
- Generate a full-year calendar
- Show key Islamic holidays/events

This site is free and open source:
- https://github.com/sameraamar/hijri-calendar-web

Direct contact / suggestions:
- samer.aamar@gmail.com

Disclaimer:
- The estimate mode is astronomy-based guidance and not an official religious announcement.

## Method (default)
Default method is **Tabular / Islamic Civil calendar (algorithmic)**.

This is deterministic and does not depend on moon sighting. Some countries and authorities may use different official calendars.

## Estimate model (how tags are calculated)

In estimate mode, the app separates two questions:
- Moon visibility question: is the crescent likely visible on this evening?
- Month-start question: how likely is the next Gregorian day to be Hijri day 1?

### Score components
For the evening estimate, each component is normalized to [0..1]:
- Moon altitude: 0°..10°
- Moon elongation: 6°..15°
- Moon age: 12h..24h
- Lag (moonset - sunset): 0..60 minutes

Visibility score:
- score = 0.35*altitude + 0.35*elongation + 0.20*age + 0.10*lag

Visibility percent:
- percent = round(100 * score)

Additional near-new-moon constraints are applied before final tagging.

### Tag thresholds used in code
- No chance: lag <= 0 minutes OR moon altitude <= 0°
- Very low: percent in (0..10]
- Low: percent in (10..35]
- Medium: percent in (35..65]
- High: percent > 65

### Exclusivity normalization
- If day X month-start signal is Medium or High, day X+1 is forced to No chance (0%).
- This keeps one clear primary day and avoids contradictory “strong” adjacent days.

## Development

### Prereqs
- Node.js 18+ recommended

### Install
From the repo root:
- `npm install`

### Run
- `npm run dev`

### Build
- `npm run build`

### Test
- `npm run test`

## Azure deployment (MVP)
Target deployment: **Azure Static Web Apps**.

Planned approach:
- Build output from `apps/web` (Vite)
- No backend for MVP
- Later: add Azure Functions for an API without restructuring

### Azure Static Web Apps settings
When creating the Static Web App (GitHub-based deployment), use:
- **App location**: `apps/web`
- **Api location**: *(leave empty for MVP)*
- **Output location**: `dist`

SPA routing fallback is configured in `apps/web/staticwebapp.config.json`.

See PLAN.md for full details.
