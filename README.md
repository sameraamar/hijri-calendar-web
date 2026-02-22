# Hijri Date Calculator

A bilingual (English/Arabic) web app to:
- Convert Gregorian ↔ Hijri dates
- Generate a full-year calendar
- Show key Islamic holidays/events

## Method (default)
Default method is **Tabular / Islamic Civil calendar (algorithmic)**.

This is deterministic and does not depend on moon sighting. Some countries and authorities may use different official calendars.

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
