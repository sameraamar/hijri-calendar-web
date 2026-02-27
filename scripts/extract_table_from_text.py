#!/usr/bin/env python3
"""
Extract a structured table from moonsighting_all_text.txt.

For each sighting report, extracts:
  year_greg, month_greg, year_hijri, month_hijri, country, city, status

Also extracts country-level announcements/declarations.

Outputs as a pipe-delimited table prepended to the file.
"""

import re
import sys
from pathlib import Path
from datetime import datetime

INPUT = Path(r"C:\Users\saaamar\repos\hijri\scripts\moonsighting_all_text.txt")

HIJRI_MONTH_MAP = {
    'MUH': ('Muharram', 1),
    'SFR': ('Safar', 2),
    'RBA': ("Rabi' al-Awwal", 3),
    'RBT': ("Rabi' al-Thani", 4),
    'JMO': ('Jumada al-Ula', 5),
    'JMT': ('Jumada al-Thani', 6),
    'RJB': ('Rajab', 7),
    'SHB': ("Sha'ban", 8),
    'RMD': ('Ramadan', 9),
    'SHW': ('Shawwal', 10),
    'ZQD': ("Dhul Qi'dah", 11),
    'ZHJ': ('Dhul Hijjah', 12),
}

# Regex patterns
RE_YEAR = re.compile(r'^#+ YEAR (\d{4}) AH', re.MULTILINE)
RE_MONTH_SECTION = re.compile(
    r'^== (\d{4}) ([A-Z]{3}) - .+?\(month (\d+)\)',
    re.MULTILINE
)
RE_DATE = re.compile(
    r'^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),\s+(\d{4})\s+\(',
    re.MULTILINE
)
# European date format: "Friday, 20 July 2012:" or "Friday 20 July 2012:"
RE_DATE_EU = re.compile(
    r'^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+(\d{1,2})\s+'
    r'(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})',
    re.MULTILINE
)
# Date format in OFFICIAL sections: "August 21, 2009 (Friday): text..."
RE_DATE_OFFICIAL = re.compile(
    r'^(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{1,2}),?\s+(\d{4})\s+\(',
    re.MULTILINE
)
RE_REPORTER = re.compile(
    r'^(.+?)\s+reported:\s*$',
    re.MULTILINE
)
RE_STATUS = re.compile(
    r'^(Seen|Not Seen|30 days completed)\s*$',
    re.MULTILINE
)
RE_ANNOUNCEMENT_DECLARED = re.compile(
    r'^(.+?)\s+(?:offic[ia]*lly\s+)?declared\s+(.+?)$',
    re.MULTILINE | re.IGNORECASE
)
# Country declaration blocks like "Afghanistan (Follow Saudi)\n????" or
# "Saudi Arabia (Local Sighting - Official Announcement)\nShawwal 1, 1438 AH: Saturday, June 26, 2017"
RE_COUNTRY_BLOCK = re.compile(
    r'^([A-Z][A-Za-z\s\.\'\-&]+?)(?:\s*\(([^)]+)\))?\s*$',
)

MONTH_TO_NUM = {
    'January': 1, 'February': 2, 'March': 3, 'April': 4,
    'May': 5, 'June': 6, 'July': 7, 'August': 8,
    'September': 9, 'October': 10, 'November': 11, 'December': 12,
}

# Known country names and aliases to help parse reporter lines
KNOWN_COUNTRIES = [
    'Afghanistan', 'Albania', 'Algeria', 'Angola', 'Argentina', 'Armenia',
    'Australia', 'Austria', 'Azerbaijan', 'Bahrain', 'Bangladesh', 'Barbados',
    'Belgium', 'Bolivia', 'Bosnia', 'Brunei', 'Bulgaria', 'Burkina Faso',
    'Cambodia', 'Cameroon', 'Canada', 'Chad', 'Chile', 'China', 'Colombia',
    'Croatia', 'Dagestan', 'Denmark', 'Ecuador', 'Egypt', 'Ethiopia',
    'Fiji', 'Finland', 'France', 'Georgia', 'Germany', 'Ghana', 'Greece',
    'Guatemala', 'Guyana', 'Hungary', 'Iceland', 'India', 'Indonesia',
    'Iran', 'Iraq', 'Ireland', 'Italy', 'Jamaica', 'Japan', 'Jordan',
    'Kazakhstan', 'Kenya', 'Kosovo', 'Kuwait', 'Kyrgyzstan', 'Lebanon',
    'Libya', 'Luxembourg', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia',
    'Mali', 'Mauritania', 'Mauritius', 'Mexico', 'Montenegro', 'Morocco',
    'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Netherlands', 'New Zealand',
    'Niger', 'Nigeria', 'Norway', 'Oman', 'Pakistan', 'Palestine', 'Panama',
    'Paraguay', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
    'Romania', 'Russia', 'Saudi Arabia', 'Senegal', 'Serbia', 'Singapore',
    'Slovakia', 'Slovenia', 'Somalia', 'South Africa', 'South Korea', 'Spain',
    'Sri Lanka', 'Sudan', 'Suriname', 'Sweden', 'Switzerland', 'Syria',
    'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Trinidad',
    'Trinidad & Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'UAE', 'U.A.E.',
    'Uganda', 'UK', 'USA', 'United Kingdom', 'United States', 'Uzbekistan',
    'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe',
    # Short/alternate forms found in reports
    'S. Africa', 'S Africa',
]

# Map alternate country names to canonical form
COUNTRY_ALIASES = {
    'S. Africa': 'South Africa',
    'S Africa': 'South Africa',
    'U.A.E.': 'UAE',
    'United Kingdom': 'UK',
    'United States': 'USA',
    'Trinidad': 'Trinidad & Tobago',
}

# US state abbreviations or names that indicate USA
US_STATES = {
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 'HI',
    'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI',
    'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC',
    'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT',
    'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC',
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
    'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
    'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
    'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
    'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina',
    'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas',
    'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin',
    'Wyoming',
}


def parse_location(location_str):
    """Parse location string after '(MCW member)' or from reporter line.
    Returns (city, country)."""
    loc = location_str.strip().rstrip('.')
    if not loc:
        return ('', '')

    # Remove leading "from " or "from near "
    loc = re.sub(r'^from\s+(near\s+)?', '', loc, flags=re.IGNORECASE).strip()

    # Check for country in parentheses, e.g. "AVIGNON (south FRANCE)"
    paren_country = re.search(r'\(.*?(' + '|'.join(re.escape(c) for c in KNOWN_COUNTRIES) + r')\s*\)', loc, re.IGNORECASE)
    if paren_country:
        country = paren_country.group(1)
        city = re.sub(r'\s*\([^)]*\)', '', loc).strip()
        canonical = COUNTRY_ALIASES.get(country, country)
        return (city, canonical)

    # Try known countries (longest first to match "South Africa" before "South")
    sorted_countries = sorted(KNOWN_COUNTRIES, key=len, reverse=True)
    for country in sorted_countries:
        if loc.endswith(country):
            city_part = loc[:len(loc) - len(country)].strip().rstrip(',').strip()
            canonical = COUNTRY_ALIASES.get(country, country)
            return (city_part, canonical)
        # Also try case-insensitive
        if loc.lower().endswith(country.lower()):
            city_part = loc[:len(loc) - len(country)].strip().rstrip(',').strip()
            canonical = COUNTRY_ALIASES.get(country, country)
            return (city_part, canonical)

    # Check if last token is a US state abbreviation/name or Canadian province
    CANADIAN_PROVINCES = {'Ontario', 'Quebec', 'British Columbia', 'Alberta',
                          'Manitoba', 'Saskatchewan', 'Nova Scotia',
                          'New Brunswick', 'Newfoundland', 'PEI', 'BC', 'ON', 'QC', 'AB'}
    parts = loc.split(',')
    last_part = parts[-1].strip() if parts else loc
    if last_part in US_STATES:
        city_part = ','.join(parts[:-1]).strip() if len(parts) > 1 else ''
        return (city_part, 'USA')
    if last_part in CANADIAN_PROVINCES:
        city_part = ','.join(parts[:-1]).strip() if len(parts) > 1 else ''
        return (city_part, 'Canada')
    # Also check if the last word(s) of the whole string match a US state
    words = loc.split()
    for n in (2, 1):  # try 2-word states first ("New York"), then single
        if len(words) >= n + 1:
            candidate = ' '.join(words[-n:])
            if candidate in US_STATES:
                city_part = ' '.join(words[:-n]).rstrip(',').strip()
                return (city_part, 'USA')

    # Known city->country mappings for common reporter locations without country
    CITY_COUNTRY = {
        'Berlin': 'Germany',
        'Hamburg': 'Germany',
        'Munich': 'Germany',
        'Oxford': 'UK',
        'London': 'UK',
        'Paris': 'France',
        'Brampton': 'Canada',
        'Mississauga': 'Canada',
        'Toronto': 'Canada',
        'Montreal': 'Canada',
        'Vancouver': 'Canada',
        'Ottawa': 'Canada',
        'Peterborough Ontario': 'Canada',
        'AVIGNON': 'France',
        'St. Thomas, Virgin Islands': 'USA',
    }
    # Check if the location is or starts with a known city
    for city_name, country_name in CITY_COUNTRY.items():
        if loc == city_name or loc.startswith(city_name + ',') or loc.startswith(city_name + ' '):
            return (loc, country_name)

    # Fallback: treat whole string as location
    return (loc, '')


def extract_reporter_location(line):
    """Extract location info from a reporter line like:
    'Name (MCW member) City Country reported:'
    or 'Name from City Country reported:'
    """
    # Remove "reported:" and strip
    line = line.replace('reported:', '').strip()

    # Try to extract after "(MCW member)"
    mcw_match = re.search(r'\(MCW member\)\s*(.*)', line)
    if mcw_match:
        loc = mcw_match.group(1).strip()
        # Strip leading role/title prefixes like "Imam of ... Mosque"
        loc = re.sub(r'^(?:Imam\s+of\s+\S+\s+\S+\s+(?:Mosque|Masjid)\s*)', '', loc).strip()
        return parse_location(loc)

    # Try "from Location"
    from_match = re.search(r'\bfrom\s+(.*)', line, re.IGNORECASE)
    if from_match:
        loc = from_match.group(1).strip()
        return parse_location(loc)

    # Try after last comma or parenthetical
    # e.g. "Dr. Khaja Muzaffaruddin, Retired Prof OU, Hyderabad, India"
    paren_match = re.search(r'\)\s*(.*)', line)
    if paren_match:
        loc = paren_match.group(1).strip()
        if loc:
            return parse_location(loc)

    # Fallback: try to find country in the whole line
    sorted_countries = sorted(KNOWN_COUNTRIES, key=len, reverse=True)
    for country in sorted_countries:
        if country in line:
            idx = line.rfind(country)
            before = line[:idx].strip()
            # Try to get city from the part before country
            # Take last comma-separated part
            parts = before.split(',')
            city = parts[-1].strip() if parts else ''
            canonical = COUNTRY_ALIASES.get(country, country)
            return (city, canonical)

    return ('', '')


def main():
    text = INPUT.read_text(encoding='utf-8', errors='replace')

    # Strip any previously prepended table (starts with "year_greg|" header)
    if text.startswith('year_greg|'):
        # Find the first line that starts with "# YEAR" (beginning of actual content)
        idx = text.find('\n# YEAR ')
        if idx == -1:
            idx = text.find('\n== ')
        if idx != -1:
            # Also skip any blank lines between table and content
            text = text[idx:].lstrip('\n')
            print(f"Stripped existing table, content starts at char {idx}")

    lines = text.split('\n')

    rows = []  # (year_greg, month_greg, day_greg, year_hijri, month_hijri, country, city, status)

    current_hijri_year = None
    current_hijri_month_num = None
    current_greg_year = None
    current_greg_month = None
    current_greg_day = None

    i = 0
    while i < len(lines):
        line = lines[i].rstrip()

        # Check for Hijri year header
        year_m = RE_YEAR.match(line)
        if year_m:
            current_hijri_year = int(year_m.group(1))
            i += 1
            continue

        # Check for month section header
        month_m = RE_MONTH_SECTION.match(line)
        if month_m:
            current_hijri_year = int(month_m.group(1))
            current_hijri_month_num = int(month_m.group(3))
            i += 1
            continue

        # Check for Gregorian date line (American format: "August 30, 2011 (...")
        date_m = RE_DATE.match(line)
        if date_m:
            current_greg_month = MONTH_TO_NUM[date_m.group(1)]
            current_greg_day = int(date_m.group(2))
            current_greg_year = int(date_m.group(3))
            i += 1
            continue

        # Check for European date format: "Friday, 20 July 2012:" or "Friday 20 July 2012:"
        date_eu_m = RE_DATE_EU.match(line)
        if date_eu_m:
            current_greg_day = int(date_eu_m.group(1))
            current_greg_month = MONTH_TO_NUM[date_eu_m.group(2)]
            current_greg_year = int(date_eu_m.group(3))
            i += 1
            continue

        # Check for reporter line
        reporter_m = RE_REPORTER.match(line)
        if reporter_m:
            reporter_text = reporter_m.group(1)
            city, country = extract_reporter_location(line)

            # Next non-empty line should be the status
            j = i + 1
            status = ''
            while j < len(lines):
                next_line = lines[j].strip()
                if next_line:
                    status_m = RE_STATUS.match(next_line)
                    if status_m:
                        status = status_m.group(1)
                    break
                j += 1

            if status and current_greg_year and current_hijri_year:
                rows.append((
                    current_greg_year,
                    current_greg_month,
                    current_greg_day,
                    current_hijri_year,
                    current_hijri_month_num,
                    country,
                    city,
                    status
                ))

            i = j + 1 if j < len(lines) else i + 1
            continue

        # Check for announcement/declaration lines
        # Pattern: "Country declared MonthName D, YYYY hijri to be on..."
        decl_m = RE_ANNOUNCEMENT_DECLARED.match(line)
        if decl_m and current_hijri_year and current_hijri_month_num:
            country_part = decl_m.group(1).strip()
            # Could be multi-country like "India, Pakistan and Bangladesh"
            rest = decl_m.group(2)

            # Try to extract the declared date
            date_in_decl = re.search(
                r'(?:on\s+)?(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+'
                r'(January|February|March|April|May|June|July|August|September|October|November|December)'
                r'\s+(\d{1,2}),?\s+(\d{4})',
                rest
            )
            greg_yr = current_greg_year
            greg_mn = current_greg_month
            greg_dy = current_greg_day
            if date_in_decl:
                greg_mn = MONTH_TO_NUM[date_in_decl.group(1)]
                greg_dy = int(date_in_decl.group(2))
                greg_yr = int(date_in_decl.group(3))

            # Split multiple countries
            # "India, Pakistan and Bangladesh"
            countries = re.split(r',\s*|\s+and\s+', country_part)
            for c in countries:
                c = c.strip()
                if c and len(c) > 1:
                    canonical = COUNTRY_ALIASES.get(c, c)
                    rows.append((
                        greg_yr,
                        greg_mn,
                        greg_dy,
                        current_hijri_year,
                        current_hijri_month_num,
                        canonical,
                        '',
                        'Official Declaration'
                    ))
            i += 1
            continue

        # Check for country block declarations (in Eid/Official sections etc.)
        # Pattern: "CountryName (method)" on its own line, or
        # "CountryName (method)\n????" or "CountryName\ndate"
        country_block_m = RE_COUNTRY_BLOCK.match(line)
        if (country_block_m
                and current_hijri_year
                and current_hijri_month_num):
            country_name = country_block_m.group(1).strip()
            method = (country_block_m.group(2) or '').strip()

            # Check if country_name is a known country or starts with one
            is_country = False
            matched_country = country_name
            for kc in KNOWN_COUNTRIES:
                if country_name == kc or country_name.startswith(kc):
                    is_country = True
                    matched_country = kc
                    break
            if is_country and len(country_name) < 60:
                canonical = COUNTRY_ALIASES.get(matched_country, matched_country)

                # Case 1: Line has a method in parentheses → standalone declaration
                if method:
                    # Normalize method text to a status
                    method_lower = method.lower()
                    if 'calculation' in method_lower:
                        status_text = 'Calculations'
                    elif 'sighting' in method_lower:
                        status_text = 'Sighting'
                    elif '30 day' in method_lower:
                        status_text = '30 days completed'
                    elif 'follow' in method_lower:
                        status_text = method  # e.g. "Follow Saudi"
                    else:
                        status_text = method

                    rows.append((
                        current_greg_year,
                        current_greg_month,
                        current_greg_day,
                        current_hijri_year,
                        current_hijri_month_num,
                        canonical,
                        '',
                        status_text
                    ))
                    i += 1  # Don't consume next line
                    continue

                # Case 2: No method in parens → check next line for ???? or date
                if i + 1 < len(lines):
                    next_line = lines[i + 1].strip()
                    if next_line and (next_line == '????' or re.match(r'\w+\s+\d', next_line)):
                        status_text = next_line
                        if status_text == '????':
                            status_text = 'Pending/Unknown'
                        else:
                            status_text = f'Declaration: {status_text}'

                        # Try to extract a date from the status line
                        decl_date = re.search(
                            r'(January|February|March|April|May|June|July|August|September|October|November|December)'
                            r'\s+(\d{1,2}),?\s+(\d{4})',
                            status_text
                        )
                        greg_yr = current_greg_year
                        greg_mn = current_greg_month
                        greg_dy = current_greg_day
                        if decl_date:
                            greg_mn = MONTH_TO_NUM[decl_date.group(1)]
                            greg_dy = int(decl_date.group(2))
                            greg_yr = int(decl_date.group(3))

                        rows.append((
                            greg_yr,
                            greg_mn,
                            greg_dy,
                            current_hijri_year,
                            current_hijri_month_num,
                            canonical,
                            '',
                            status_text
                        ))
                        i += 2
                        continue

        i += 1

    # Build table
    header = "year_greg|month_greg|day_greg|year_hijri|month_hijri|country|city|status"
    table_lines = [header]
    for row in rows:
        table_lines.append(
            f"{row[0]}|{row[1]}|{row[2]}|{row[3]}|{row[4]}|{row[5]}|{row[6]}|{row[7]}"
        )

    table_text = '\n'.join(table_lines)

    # Prepend to the file
    new_content = table_text + '\n\n' + text
    INPUT.write_text(new_content, encoding='utf-8')
    print(f"Extracted {len(rows)} rows. Table prepended to {INPUT}")


if __name__ == '__main__':
    main()
