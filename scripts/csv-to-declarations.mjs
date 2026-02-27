/**
 * csv-to-declarations.mjs
 *
 * Reads the master CSV (docs/data-collection/hijri_month_starts_template_1400_1447.csv)
 * and generates apps/web/src/data/officialDeclarations.ts.
 *
 * Usage:
 *   node scripts/csv-to-declarations.mjs
 *
 * Only rows with a non-empty GregorianStartDate are emitted as declarations.
 * The CSV remains the single source of truth.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const CSV_PATH = resolve(ROOT, 'docs/data-collection/hijri_month_starts_template_1400_1447.csv');
const OUT_PATH = resolve(ROOT, 'apps/web/src/data/officialDeclarations.ts');

// ---------------------------------------------------------------------------
// Country name → ISO-3166-1 alpha-2 (lowercase)
// ---------------------------------------------------------------------------
const COUNTRY_ID_MAP = {
  'Saudi Arabia': 'sa',
  'Egypt': 'eg',
  'Türkiye': 'tr',
  'Turkey': 'tr',
  'Palestine': 'ps',
  'Jordan': 'jo',
  'Morocco': 'ma',
  'Libya': 'ly',
  'South Africa': 'za',
  'Nigeria': 'ng',
  'Malaysia': 'my',
  'Pakistan': 'pk',
  'Indonesia': 'id',
  'United States': 'us',
  'Canada': 'ca',
  'Australia': 'au',
};

// ---------------------------------------------------------------------------
// Normalise Method values to the TypeScript union
// ---------------------------------------------------------------------------
const METHOD_MAP = {
  'SightingConfirmed': 'SightingConfirmed',
  'CalculatedCalendar': 'CalculatedCalendar',
  'NotSighted_Istikmal': 'CalculatedCalendar', // fallback
  'Hybrid_Hisab_Rukyat': 'Hybrid',
  'Derived_From_Official_Calendar': 'CalculatedCalendar',
  'Missing_Official_Data': undefined,
  'Unknown': 'Unknown',
  '': undefined,
};

// ---------------------------------------------------------------------------
// Parse CSV (simple — no quoted fields with commas expected)
// ---------------------------------------------------------------------------
function parseCsv(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n').filter(Boolean);
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    const row = {};
    for (let i = 0; i < headers.length; i++) {
      row[headers[i].trim()] = (values[i] ?? '').trim();
    }
    return row;
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
const csvText = readFileSync(CSV_PATH, 'utf-8');
const rows = parseCsv(csvText);

// Filter to rows with actual data
const filled = rows.filter((r) => r.GregorianStartDate && r.GregorianStartDate.length >= 10);

console.log(`CSV rows: ${rows.length}, with data: ${filled.length}`);

// Group by country
const byCountry = new Map();
for (const r of filled) {
  const countryId = COUNTRY_ID_MAP[r.Country];
  if (!countryId) {
    console.warn(`  Unknown country: "${r.Country}" — skipping`);
    continue;
  }
  if (!byCountry.has(countryId)) byCountry.set(countryId, []);
  byCountry.get(countryId).push(r);
}

// Sort each country block by year, then month
for (const [, entries] of byCountry) {
  entries.sort((a, b) => {
    const ya = Number(a.HijriYear), yb = Number(b.HijriYear);
    if (ya !== yb) return ya - yb;
    return Number(a.HijriMonth) - Number(b.HijriMonth);
  });
}

// ---------------------------------------------------------------------------
// Emit TypeScript
// ---------------------------------------------------------------------------
let ts = `/**
 * Official month-start declarations from national authorities.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  AUTO-GENERATED — do not edit by hand.                                  │
 * │  Source: docs/data-collection/hijri_month_starts_template_1400_1447.csv │
 * │  Script: scripts/csv-to-declarations.mjs                               │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

export interface OfficialDeclaration {
  /** ISO-3166-1 alpha-2 (lowercase) – must match countries.ts ids */
  countryId: string;
  /** Hijri year (AH) */
  hijriYear: number;
  /** Hijri month (1–12) */
  hijriMonth: number;
  /** Gregorian date (ISO YYYY-MM-DD) */
  gregorian: string;
  /** Method used by the authority */
  method?: 'SightingConfirmed' | 'CalculatedCalendar' | 'Hybrid' | 'Unknown';
  /** Issuing body name */
  authority?: string;
  /** Confidence score 0-100 (see docs/data-collection/README) */
  confidence?: number;
}

`;

// Country block labels
const COUNTRY_LABELS = {
  sa: 'Saudi Arabia',
  eg: 'Egypt',
  tr: 'Türkiye',
  ps: 'Palestine',
  jo: 'Jordan',
  ma: 'Morocco',
  ly: 'Libya',
  za: 'South Africa',
  ng: 'Nigeria',
  my: 'Malaysia',
  pk: 'Pakistan',
  id: 'Indonesia',
  us: 'United States',
  ca: 'Canada',
  au: 'Australia',
};

// Emit each country block as a const array
const blockNames = [];
for (const [countryId, entries] of byCountry) {
  const label = COUNTRY_LABELS[countryId] ?? countryId.toUpperCase();
  const varName = `${countryId.toUpperCase()}_DATA`;
  blockNames.push(varName);

  // Determine year range
  const years = entries.map((e) => Number(e.HijriYear));
  const minY = Math.min(...years);
  const maxY = Math.max(...years);

  // Determine which months are covered
  const months = [...new Set(entries.map((e) => Number(e.HijriMonth)))].sort((a, b) => a - b);
  const monthNames = months.map((m) => entries.find((e) => Number(e.HijriMonth) === m)?.HijriMonthName ?? String(m));
  const monthDesc = months.length === 12 ? 'all months' : monthNames.join(', ');

  ts += `// ---------------------------------------------------------------------------\n`;
  ts += `// ${label} — ${monthDesc} — AH ${minY}–${maxY}\n`;
  ts += `// ---------------------------------------------------------------------------\n`;
  ts += `const ${varName}: OfficialDeclaration[] = [\n`;

  for (const r of entries) {
    const method = METHOD_MAP[r.Method] ?? (r.Method ? `'Unknown'` : undefined);
    const methodStr = method ? `, method: '${method}'` : '';
    const authorityStr = r.Authority ? `, authority: '${r.Authority.replace(/'/g, "\\'")}'` : '';
    const confStr = r.ConfidenceScore ? `, confidence: ${r.ConfidenceScore}` : '';
    ts += `  { countryId: '${countryId}', hijriYear: ${r.HijriYear}, hijriMonth: ${r.HijriMonth}, gregorian: '${r.GregorianStartDate}'${methodStr}${authorityStr}${confStr} },\n`;
  }

  ts += `];\n\n`;
}

// Aggregate
ts += `// ---------------------------------------------------------------------------\n`;
ts += `// Aggregate all declarations\n`;
ts += `// ---------------------------------------------------------------------------\n`;
ts += `export const OFFICIAL_DECLARATIONS: OfficialDeclaration[] = [\n`;
for (const name of blockNames) {
  ts += `  ...${name},\n`;
}
ts += `];\n\n`;

// Lookup map
ts += `// ---------------------------------------------------------------------------\n`;
ts += `// Fast lookup map:  "countryId|hijriYear|hijriMonth" → declaration\n`;
ts += `// ---------------------------------------------------------------------------\n`;
ts += `const _lookup = new Map<string, OfficialDeclaration>();\n`;
ts += `for (const d of OFFICIAL_DECLARATIONS) {\n`;
ts += `  _lookup.set(\`\${d.countryId}|\${d.hijriYear}|\${d.hijriMonth}\`, d);\n`;
ts += `}\n\n`;

// Helper functions
ts += `/** Get the official declaration for a given country, year and month (or undefined). */\n`;
ts += `export function getOfficialDeclaration(\n`;
ts += `  countryId: string,\n`;
ts += `  hijriYear: number,\n`;
ts += `  hijriMonth: number,\n`;
ts += `): OfficialDeclaration | undefined {\n`;
ts += `  return _lookup.get(\`\${countryId}|\${hijriYear}|\${hijriMonth}\`);\n`;
ts += `}\n\n`;

ts += `/** Check whether any official data exists for a given country. */\n`;
ts += `export function hasAnyOfficialData(countryId: string): boolean {\n`;
ts += `  for (const d of OFFICIAL_DECLARATIONS) {\n`;
ts += `    if (d.countryId === countryId) return true;\n`;
ts += `  }\n`;
ts += `  return false;\n`;
ts += `}\n\n`;

ts += `/** Return the set of Hijri months that have at least one official entry for a country. */\n`;
ts += `export function officialMonthsForCountry(countryId: string): Set<number> {\n`;
ts += `  const months = new Set<number>();\n`;
ts += `  for (const d of OFFICIAL_DECLARATIONS) {\n`;
ts += `    if (d.countryId === countryId) months.add(d.hijriMonth);\n`;
ts += `  }\n`;
ts += `  return months;\n`;
ts += `}\n`;

writeFileSync(OUT_PATH, ts, 'utf-8');
console.log(`Written ${OUT_PATH}`);
console.log(`  ${filled.length} declarations across ${byCountry.size} country/countries`);
