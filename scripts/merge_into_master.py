#!/usr/bin/env python3
"""
Merge extracted moonsighting data and reference CSV into the master CSV.

Reads:
  1. scripts/moonsighting_all_text.txt  (pipe-delimited table at top)
  2. scripts/primary_countries_all_years_inferred.csv
  3. docs/data-collection/hijri_month_starts_template_1400_1447.csv

Writes updated master CSV in-place.
"""

import csv
import sys
from datetime import date, timedelta
from pathlib import Path
from collections import defaultdict

ROOT = Path(__file__).resolve().parent.parent
MASTER_CSV = ROOT / 'docs' / 'data-collection' / 'hijri_month_starts_template_1400_1447.csv'
EXTRACTED_TABLE = ROOT / 'scripts' / 'moonsighting_all_text.txt'
REFERENCE_CSV = ROOT / 'scripts' / 'primary_countries_all_years_inferred.csv'

# ---------------------------------------------------------------------------
# Country name mapping:  extracted-name → master-CSV-name
# ---------------------------------------------------------------------------
COUNTRY_TO_MASTER = {
    'Saudi Arabia': 'Saudi Arabia',
    'Egypt': 'Egypt',
    'Turkey': 'Türkiye',
    'Palestine': 'Palestine',
    'Jordan': 'Jordan',
    'Morocco': 'Morocco',
    'Libya': 'Libya',
    'South Africa': 'South Africa',
    'S. Africa': 'South Africa',
    'S Africa': 'South Africa',
    'Nigeria': 'Nigeria',
    'Malaysia': 'Malaysia',
    'Pakistan': 'Pakistan',
    'Indonesia': 'Indonesia',
    'USA': 'United States',
    'United States': 'United States',
    'Canada': 'Canada',
    'Australia': 'Australia',
    'North America': 'United States',   # reference CSV
    'Türkiye': 'Türkiye',
}

# Master CSV countries (the only ones we care about)
MASTER_COUNTRIES = {
    'Saudi Arabia', 'Egypt', 'Türkiye', 'Palestine', 'Jordan', 'Morocco',
    'Libya', 'South Africa', 'Nigeria', 'Malaysia', 'Pakistan', 'Indonesia',
    'United States', 'Canada', 'Australia',
}

# ---------------------------------------------------------------------------
# Hijri month name → number  (for reference CSV)
# ---------------------------------------------------------------------------
HIJRI_MONTH_NAME_TO_NUM = {
    'Muharram': 1,
    'Safar': 2,
    'Rabi al-Awwal': 3, "Rabi' al-Awwal": 3,
    'Rabi al-Thani': 4, "Rabi' al-Thani": 4,
    'Jumada al-Ula': 5, 'Jumada al-Akhirah': 6,
    'Jumada al-Thani': 6,
    'Rajab': 7,
    'Shaban': 8, "Sha'ban": 8,
    'Ramadan': 9,
    'Shawwal': 10,
    "Dhu al-Qadah": 11, "Dhul Qi'dah": 11,
    "Dhu al-Hijjah": 12, "Dhul Hijjah": 12,
}

# ---------------------------------------------------------------------------
# Status → Method mapping for master CSV
# ---------------------------------------------------------------------------
STATUS_TO_METHOD = {
    'Sighting': 'SightingConfirmed',
    'Seen': 'SightingConfirmed',
    '30 days completed': 'SightingConfirmed',
    'Calculations': 'CalculatedCalendar',
    'Follow Saudi': 'Derived_From_Official_Calendar',
    'Following Saudi': 'Derived_From_Official_Calendar',
    'Follow Turkey': 'Derived_From_Official_Calendar',
    'follow Turkey': 'Derived_From_Official_Calendar',
    'Following MeccaCalendar.org': 'CalculatedCalendar',
    'Sunnis Follow Saudi': 'Derived_From_Official_Calendar',
    'Some follow Saudi': 'Derived_From_Official_Calendar',
    'Official Declaration': 'SightingConfirmed',
    'Official Announcement': 'SightingConfirmed',
    'Announced': 'SightingConfirmed',
    'Officially declared': 'SightingConfirmed',
    'Officially Announced': 'SightingConfirmed',
    'Declared': 'SightingConfirmed',
}

# For picking the best entry when multiple exist for same country/year/month.
# Higher = more authoritative.
STATUS_PRIORITY = {
    'Official Declaration': 10,
    'Official Announcement': 9,
    'Announced': 9,
    'Officially declared': 9,
    'Officially Announced': 9,
    'Sighting': 8,
    'Calculations': 7,
    '30 days completed': 6,
    'Follow Saudi': 5,
    'Following Saudi': 5,
    'Follow Turkey': 5,
    'follow Turkey': 5,
    'Sunnis Follow Saudi': 5,
    'Some follow Saudi': 5,
    'Following MeccaCalendar.org': 4,
    'Seen': 3,
    'Declared': 3,
    'Not Seen': 0,
    'Pending/Unknown': 0,
}


def make_date(year, month, day):
    """Safely create a date, returning None on bad inputs."""
    try:
        if year and month and day:
            return date(int(year), int(month), int(day))
    except (ValueError, TypeError):
        pass
    return None


def compute_start_date(greg_date, status):
    """
    Determine the GregorianStartDate (1st day of the hijri month)
    from the sighting/declaration date and status.

    In OFFICIAL sections (status = Sighting/Calculations/30 days completed/Follow*),
    the date listed IS the first day.
    For individual sighting reports (status = Seen), the first day is the next day.
    """
    if greg_date is None:
        return None

    official_statuses = {
        'Sighting', 'Calculations', '30 days completed',
        'Follow Saudi', 'Following Saudi', 'Follow Turkey', 'follow Turkey',
        'Sunnis Follow Saudi', 'Some follow Saudi',
        'Following MeccaCalendar.org',
        'Official Declaration', 'Official Announcement',
        'Announced', 'Officially declared', 'Officially Announced',
    }

    if status in official_statuses:
        return greg_date  # date IS the 1st day
    elif status == 'Seen':
        return greg_date + timedelta(days=1)  # 1st day is day after sighting
    else:
        return greg_date  # fallback: use date as-is


def get_method(status):
    """Map extracted status to the master CSV Method value."""
    return STATUS_TO_METHOD.get(status, 'Unknown')


def read_extracted_table():
    """Read the pipe-delimited table from moonsighting_all_text.txt.
    Returns dict: (master_country, hijri_year, hijri_month) → list of entries.
    """
    data = defaultdict(list)
    text = EXTRACTED_TABLE.read_text(encoding='utf-8', errors='replace')
    lines = text.split('\n')

    if not lines[0].startswith('year_greg|'):
        print("ERROR: No table found at top of moonsighting_all_text.txt")
        return data

    for line in lines[1:]:
        line = line.strip()
        if not line or '|' not in line:
            break  # end of table
        parts = line.split('|')
        if len(parts) < 8:
            continue

        year_greg = parts[0]
        month_greg = parts[1]
        day_greg = parts[2]
        year_hijri = parts[3]
        month_hijri = parts[4]
        country = parts[5]
        city = parts[6]
        status = parts[7]

        # Map to master country
        master_country = COUNTRY_TO_MASTER.get(country)
        if not master_country:
            continue  # country not in master CSV

        try:
            hijri_yr = int(year_hijri)
            hijri_mn = int(month_hijri)
        except (ValueError, TypeError):
            continue

        greg_date = make_date(year_greg, month_greg, day_greg)

        data[(master_country, hijri_yr, hijri_mn)].append({
            'greg_date': greg_date,
            'status': status,
            'city': city,
            'country_raw': country,
        })

    return data


def read_reference_csv():
    """Read primary_countries_all_years_inferred.csv.
    Returns dict: (master_country, hijri_year, hijri_month) → list of entries.
    """
    data = defaultdict(list)
    if not REFERENCE_CSV.exists():
        print(f"WARNING: Reference CSV not found: {REFERENCE_CSV}")
        return data

    with open(REFERENCE_CSV, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            country = row.get('Country', '').strip()
            master_country = COUNTRY_TO_MASTER.get(country)
            if not master_country:
                continue

            hijri_month_name = row.get('Hijri_Month', '').strip()
            hijri_mn = HIJRI_MONTH_NAME_TO_NUM.get(hijri_month_name)
            if not hijri_mn:
                continue

            try:
                hijri_yr = int(row.get('Hijri_Year', 0))
            except (ValueError, TypeError):
                continue

            status = row.get('Official_Status', '').strip()
            confidence = row.get('Confidence', '').strip()

            data[(master_country, hijri_yr, hijri_mn)].append({
                'status': status,
                'confidence': float(confidence) if confidence else 0.5,
                'city': row.get('City', '').strip(),
            })

    return data


def pick_best_entry(entries):
    """From a list of extracted entries, pick the best one.
    Returns (start_date, method, confidence, notes) or None.
    """
    if not entries:
        return None

    # Filter to entries that can produce a date
    scored = []
    for e in entries:
        status = e['status']
        if status in ('Not Seen', 'Pending/Unknown'):
            continue
        priority = STATUS_PRIORITY.get(status, 1)
        start_date = compute_start_date(e['greg_date'], status)
        if start_date is None:
            continue
        method = get_method(status)
        scored.append((priority, start_date, method, status, e))

    if not scored:
        return None

    # Pick highest priority; if tie, prefer the earliest date
    scored.sort(key=lambda x: (-x[0], x[1]))
    best = scored[0]
    _, start_date, method, status, entry = best

    # Set confidence based on status type
    if status in ('Official Declaration', 'Official Announcement', 'Announced',
                  'Officially declared', 'Officially Announced'):
        confidence = 0.9
    elif status in ('Sighting', 'Calculations'):
        confidence = 0.8
    elif status == '30 days completed':
        confidence = 0.8
    elif status.startswith('Follow'):
        confidence = 0.7
    elif status == 'Seen':
        confidence = 0.6
    else:
        confidence = 0.5

    notes = f"moonsighting.com: {status}"
    return (start_date, method, confidence, notes)


def main():
    print("Reading extracted table...")
    extracted = read_extracted_table()
    print(f"  {sum(len(v) for v in extracted.values())} entries for {len(extracted)} country/year/month combos")

    print("Reading reference CSV...")
    reference = read_reference_csv()
    print(f"  {sum(len(v) for v in reference.values())} entries for {len(reference)} country/year/month combos")

    print("Reading master CSV...")
    rows = []
    with open(MASTER_CSV, encoding='utf-8') as f:
        reader = csv.DictReader(f)
        fieldnames = reader.fieldnames
        for row in reader:
            rows.append(row)
    print(f"  {len(rows)} rows, {len(fieldnames)} columns")

    # Count stats
    already_filled = 0
    newly_filled = 0
    no_data = 0
    skipped_existing = 0

    for row in rows:
        country = row['Country']
        try:
            hijri_yr = int(row['HijriYear'])
            hijri_mn = int(row['HijriMonth'])
        except (ValueError, TypeError):
            continue

        # Skip if already has ORIGINAL data (not from our merge)
        # Original data has Authority field set (e.g., "Supreme Court")
        if row['GregorianStartDate'] and row['GregorianStartDate'].strip():
            if row.get('Authority', '').strip():
                already_filled += 1
                skipped_existing += 1
                continue
            # Previously merged data — allow re-merge with updated dates

        key = (country, hijri_yr, hijri_mn)

        # Try extracted data first
        extracted_entries = extracted.get(key, [])
        result = pick_best_entry(extracted_entries)

        if result:
            start_date, method, confidence, notes = result
            row['GregorianStartDate'] = start_date.isoformat()
            row['GregorianYear'] = str(start_date.year)
            row['Method'] = method
            row['ConfidenceScore'] = str(confidence)
            row['Notes'] = notes
            row['SourceURL'] = 'https://www.moonsighting.com'
            newly_filled += 1
        else:
            # Try reference CSV as fallback
            ref_entries = reference.get(key, [])
            if ref_entries:
                # Reference CSV doesn't have specific dates, so we can only
                # set the method and note. Check if there's ANY useful info.
                best_ref = ref_entries[0]
                ref_status = best_ref['status']
                ref_confidence = best_ref['confidence']

                # We don't have a date, so we can't fill GregorianStartDate
                # But let's note the status for documentation
                ref_method = get_method(ref_status)
                if ref_method and ref_method != 'Unknown':
                    row['Method'] = ref_method
                    row['ConfidenceScore'] = str(ref_confidence)
                    row['Notes'] = f"reference: {ref_status} (no date)"
                no_data += 1
            else:
                no_data += 1

    # Write updated CSV
    with open(MASTER_CSV, 'w', encoding='utf-8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"\nResults:")
    print(f"  Already filled (preserved): {already_filled}")
    print(f"  Newly filled:               {newly_filled}")
    print(f"  No data available:          {no_data}")
    print(f"  Total rows:                 {len(rows)}")
    print(f"\nMaster CSV updated: {MASTER_CSV}")


if __name__ == '__main__':
    main()
