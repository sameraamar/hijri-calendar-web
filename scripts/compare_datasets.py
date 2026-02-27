#!/usr/bin/env python3
"""
Compare the extracted table from moonsighting_all_text.txt with
primary_countries_all_years_inferred.csv to find mismatches.
"""

import csv
from collections import defaultdict
from pathlib import Path

EXTRACTED = Path(r"C:\Users\saaamar\repos\hijri\scripts\moonsighting_all_text.txt")
REFERENCE = Path(r"C:\Users\saaamar\repos\hijri\scripts\primary_countries_all_years_inferred.csv")

HIJRI_MONTH_NAMES = {
    1: 'Muharram', 2: 'Safar', 3: "Rabi al-Awwal", 4: "Rabi al-Thani",
    5: 'Jumada al-Ula', 6: 'Jumada al-Thani', 7: 'Rajab', 8: "Sha'ban",
    9: 'Ramadan', 10: 'Shawwal', 11: "Dhul Qi'dah", 12: 'Dhul Hijjah',
}
HIJRI_MONTH_NUMS = {v: k for k, v in HIJRI_MONTH_NAMES.items()}
# Handle alternate spellings
HIJRI_MONTH_NUMS["Rabi' al-Awwal"] = 3
HIJRI_MONTH_NUMS["Rabi' al-Thani"] = 4
HIJRI_MONTH_NUMS["Jumada al-Ula"] = 5

# Map "North America" -> "USA" for comparison, etc.
COUNTRY_NORMALIZE = {
    'North America': 'USA',
    'United Kingdom': 'UK',
}


def load_extracted():
    """Load the pipe-delimited table from moonsighting_all_text.txt"""
    rows = []
    with open(EXTRACTED, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            if line.startswith('#') or line.startswith('='):
                break  # End of table, start of original content
            parts = line.split('|')
            if len(parts) == 7 and parts[0] != 'year_greg':
                try:
                    rows.append({
                        'greg_year': int(parts[0]),
                        'greg_month': int(parts[1]) if parts[1] else None,
                        'hijri_year': int(parts[2]),
                        'hijri_month': int(parts[3]),
                        'country': parts[4],
                        'city': parts[5],
                        'status': parts[6],
                    })
                except (ValueError, IndexError):
                    pass
    return rows


def load_reference():
    """Load the reference CSV"""
    rows = []
    with open(REFERENCE, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            hijri_month_name = row['Hijri_Month'].strip()
            hijri_month_num = HIJRI_MONTH_NUMS.get(hijri_month_name)
            if hijri_month_num is None:
                print(f"  WARNING: Unknown hijri month name: '{hijri_month_name}'")
                continue
            rows.append({
                'greg_year': int(row['Gregorian_Year']),
                'greg_month': row['Gregorian_Month'],  # "Unknown" in most cases
                'hijri_year': int(row['Hijri_Year']),
                'hijri_month': hijri_month_num,
                'hijri_month_name': hijri_month_name,
                'country': row['Country'].strip(),
                'city': row['City'].strip(),
                'status': row['Official_Status'].strip(),
                'confidence': float(row['Confidence']),
            })
    return rows


def normalize_status(status):
    """Normalize status for comparison"""
    s = status.lower().strip()
    if s == 'seen':
        return 'Seen'
    elif s == 'not seen':
        return 'Not Seen'
    elif '30 days' in s:
        return '30 days completed'
    elif 'declar' in s:
        return 'Declared'
    elif 'official' in s:
        return 'Declared'
    elif 'pending' in s:
        return 'Pending'
    elif 'calculation' in s:
        return 'Calculations'
    return status


def normalize_country(country):
    return COUNTRY_NORMALIZE.get(country, country)


def main():
    extracted = load_extracted()
    reference = load_reference()

    print(f"Extracted rows: {len(extracted)}")
    print(f"Reference rows: {len(reference)}")
    print()

    # Build lookup from extracted: key = (hijri_year, hijri_month, country_normalized)
    # Value = list of statuses seen for that combination
    ext_lookup = defaultdict(list)
    for r in extracted:
        country = normalize_country(r['country'])
        key = (r['hijri_year'], r['hijri_month'], country)
        ext_lookup[key].append({
            'status': normalize_status(r['status']),
            'city': r['city'],
            'greg_year': r['greg_year'],
            'greg_month': r['greg_month'],
            'raw_status': r['status'],
        })

    # Now check each reference row against extracted data
    matches = 0
    mismatches = []
    missing = []

    for ref in reference:
        ref_country = normalize_country(ref['country'])
        ref_status = ref['status']
        key = (ref['hijri_year'], ref['hijri_month'], ref_country)

        ext_entries = ext_lookup.get(key, [])

        if not ext_entries:
            missing.append(ref)
            continue

        # Check if any extracted entry has a matching status
        ext_statuses = set(e['status'] for e in ext_entries)
        ext_raw_statuses = set(e['raw_status'] for e in ext_entries)

        if ref_status in ext_statuses:
            matches += 1
        elif ref_status == 'Declared' and ('Declared' in ext_statuses or
              any('Declar' in s for s in ext_raw_statuses) or
              'Official Declaration' in ext_raw_statuses):
            matches += 1
        elif ref_status == 'Calculations' and any('Calculation' in s or 'calculation' in s for s in ext_raw_statuses):
            matches += 1
        else:
            mismatches.append({
                'ref': ref,
                'ext_statuses': ext_raw_statuses,
                'ext_entries': ext_entries,
            })

    print("=" * 80)
    print(f"SUMMARY: {matches} matches, {len(mismatches)} status mismatches, {len(missing)} not found in extracted")
    print("=" * 80)

    if mismatches:
        print(f"\n--- STATUS MISMATCHES ({len(mismatches)}) ---")
        for m in mismatches:
            ref = m['ref']
            print(f"  Hijri {ref['hijri_year']}/{ref['hijri_month_name']}, "
                  f"Country={ref['country']}, City={ref['city']}")
            print(f"    Reference status: {ref['status']} (confidence={ref['confidence']})")
            print(f"    Extracted statuses: {m['ext_statuses']}")
            # Show cities from extracted
            ext_cities = set(e['city'] for e in m['ext_entries'])
            print(f"    Extracted cities: {ext_cities}")
            print()

    if missing:
        print(f"\n--- NOT FOUND IN EXTRACTED ({len(missing)}) ---")
        for ref in missing:
            print(f"  Hijri {ref['hijri_year']}/{ref['hijri_month_name']}, "
                  f"Country={ref['country']}, City={ref['city']}, "
                  f"Status={ref['status']} (conf={ref['confidence']})")

    # Also check: reference has "North America" - see if extracted has USA entries
    print("\n--- COUNTRY MAPPING NOTES ---")
    ref_countries = set(r['country'] for r in reference)
    ext_countries = set(r['country'] for r in extracted)
    print(f"  Reference countries: {sorted(ref_countries)}")
    print(f"  Extracted countries (sample): {sorted(list(ext_countries))[:20]}")

    # Check for reference entries where Hijri year/month combos don't appear at all in extracted
    ext_hijri_combos = set((r['hijri_year'], r['hijri_month']) for r in extracted)
    ref_hijri_combos = set((r['hijri_year'], r['hijri_month']) for r in reference)
    missing_combos = ref_hijri_combos - ext_hijri_combos
    if missing_combos:
        print(f"\n  Hijri year/month combos in reference but NOT in extracted ({len(missing_combos)}):")
        for yy, mm in sorted(missing_combos):
            print(f"    {yy}/{HIJRI_MONTH_NAMES[mm]}")

    # Check reference entries with specific countries not in extracted
    print(f"\n--- GREG YEAR CROSS-CHECK ---")
    ref_years = set(r['greg_year'] for r in reference)
    ext_years = set(r['greg_year'] for r in extracted)
    print(f"  Reference greg years: {sorted(ref_years)}")
    print(f"  Extracted greg years: {sorted(ext_years)}")


if __name__ == '__main__':
    main()
