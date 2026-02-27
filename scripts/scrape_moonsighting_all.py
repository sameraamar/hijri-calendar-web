"""
scrape_moonsighting_all.py

Scrapes https://www.moonsighting.com/{year}{month_code}.html
for years 1430–1447, all 12 Hijri months.

Month codes:  MUH SFR RBA RBT JMO JMT RJB SHB RMD SHW ZQD ZHJ

Outputs:
  scripts/moonsighting_all_data.json   (structured)
  scripts/moonsighting_all_data.csv    (flat)

Target countries:
  Saudi Arabia, Egypt, Jordan, Palestine, Pakistan, Indonesia,
  Morocco, Libya, South Africa, USA, Canada, Turkey, Nigeria,
  Malaysia, Australia
"""

import json
import csv
import re
import sys
import time
from pathlib import Path
from datetime import datetime, date

import requests
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
START_YEAR = 1430
END_YEAR = 1447  # inclusive

# (code used in URL, hijri month number, display name)
HIJRI_MONTHS = [
    ("muh", 1,  "Muharram"),
    ("sfr", 2,  "Safar"),
    ("rba", 3,  "Rabi al-Awwal"),
    ("rbt", 4,  "Rabi al-Thani"),
    ("jmo", 5,  "Jumada al-Ula"),
    ("jmt", 6,  "Jumada al-Thani"),
    ("rjb", 7,  "Rajab"),
    ("shb", 8,  "Sha'ban"),
    ("rmd", 9,  "Ramadan"),
    ("shw", 10, "Shawwal"),
    ("zqd", 11, "Dhul Qi'dah"),
    ("zhj", 12, "Dhul Hijjah"),
]

BASE_URL = "https://www.moonsighting.com/{year}{month_code}.html"
HTML_DIR  = Path(__file__).resolve().parent / "moonsighting_html"

SCRIPTS_DIR = Path(__file__).resolve().parent
OUT_JSON = SCRIPTS_DIR / "moonsighting_all_data.json"
OUT_CSV  = SCRIPTS_DIR / "moonsighting_all_data.csv"

# Country name → our ISO code  (case-insensitive matching)
COUNTRY_MAP = {
    "saudi arabia":    "sa",
    "saudi":           "sa",
    "egypt":           "eg",
    "jordan":          "jo",
    "palestine":       "ps",
    "pakistan":         "pk",
    "indonesia":       "id",
    "morocco":         "ma",
    "libya":           "ly",
    "south africa":    "za",
    "s. africa":       "za",
    "usa":             "us",
    "united states":   "us",
    "u.s.a.":          "us",
    "canada":          "ca",
    "turkey":          "tr",
    "türkiye":         "tr",
    "turkiye":         "tr",
    "nigeria":         "ng",
    "malaysia":        "my",
    "australia":       "au",
}


def normalise_method(raw: str) -> str:
    """Map raw method annotation to a controlled vocabulary."""
    raw_lower = raw.strip().lower()
    if not raw_lower:
        return "Unknown"
    if "sighting" in raw_lower or "sighted" in raw_lower:
        return "SightingConfirmed"
    if "calculation" in raw_lower or "calculated" in raw_lower:
        return "CalculatedCalendar"
    if "30 day" in raw_lower or "completion" in raw_lower:
        return "NotSighted_Istikmal"
    if "follow saudi" in raw_lower or "follows saudi" in raw_lower:
        return "FollowSaudiArabia"
    if "follow turkey" in raw_lower or "follows turkey" in raw_lower:
        return "FollowOther"
    if "follow" in raw_lower:
        return "FollowOther"
    if "moon born" in raw_lower or "moon set" in raw_lower or "moonset" in raw_lower:
        return "CalculatedCalendar"
    if "astronomical" in raw_lower:
        return "CalculatedCalendar"
    if "announcement" in raw_lower or "announced" in raw_lower:
        return "SightingConfirmed"
    if "official" in raw_lower:
        return "SightingConfirmed"
    if "criteria" in raw_lower or "altitude" in raw_lower or "elongation" in raw_lower:
        return "CalculatedCalendar"
    return "Unknown"


def match_country(name: str):
    """Return (country_id, cleaned_name) or (None, None)."""
    clean = name.strip().rstrip(" -–—").strip()
    lower = clean.lower()
    cid = COUNTRY_MAP.get(lower)
    if cid:
        return cid, clean
    # Partial / fuzzy
    for key, kid in COUNTRY_MAP.items():
        if key in lower or lower in key:
            return kid, clean
    return None, clean


# ---------------------------------------------------------------------------
# Date parsing helpers
# ---------------------------------------------------------------------------
MONTH_NAMES = {
    "january": 1, "february": 2, "march": 3, "april": 4,
    "may": 5, "june": 6, "july": 7, "august": 8,
    "september": 9, "october": 10, "november": 11, "december": 12,
}

# Pattern A:  "August 22, 2009 (Saturday):"
DATE_PAT_US = re.compile(
    r"(?P<month>[A-Za-z]+)\s+(?P<day>\d{1,2}),?\s+(?P<year>\d{4})\s*\(",
    re.IGNORECASE,
)
# Pattern B:  "Friday, 20 July 2012:"
DATE_PAT_UK = re.compile(
    r"(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+"
    r"(?P<day>\d{1,2})\s+(?P<month>[A-Za-z]+)\s+(?P<year>\d{4})",
    re.IGNORECASE,
)
# Pattern C (table cell):  "May 27, 2017 (Saturday)"
DATE_PAT_TABLE = re.compile(
    r"(?P<month>[A-Za-z]+)\s+(?P<day>\d{1,2}),?\s+(?P<year>\d{4})",
    re.IGNORECASE,
)


def parse_date(text: str):
    """Try to extract a Gregorian date from text."""
    for pattern in (DATE_PAT_US, DATE_PAT_UK, DATE_PAT_TABLE):
        m = pattern.search(text)
        if m:
            mn = m.group("month").lower()
            if mn in MONTH_NAMES:
                try:
                    return date(int(m.group("year")), MONTH_NAMES[mn], int(m.group("day")))
                except ValueError:
                    pass
    return None


# ---------------------------------------------------------------------------
# Strategy 1: Parse the OFFICIAL section (numbered list under date headers)
# Works for 1430-1435 style pages (Ramadan, Shawwal, sometimes others)
# ---------------------------------------------------------------------------
def extract_official_list(text: str, hijri_year: int, hijri_month: int) -> list[dict]:
    """Parse 'OFFICIAL 1st Day of …' section with numbered country lists."""
    # Find the official section (various headings)
    patterns = [
        r"OFFICIAL\s+1st\s+Day\s+of\s+\w+",
        r"OFFICIAL\s+Date.+Different\s+Countries",
        r"OFFICIAL\s+Day\s+of\s+.+Different\s+Countries",
        r"OFFICIAL.+Different\s+Countries",
    ]
    start_idx = -1
    for pat in patterns:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            start_idx = m.end()
            break
    if start_idx < 0:
        return []

    section = text[start_idx:]
    results = []
    current_date = None

    for line in section.split("\n"):
        line = line.strip()
        if not line:
            continue

        # Check for date header
        d = parse_date(line)
        if d and (len(line) < 80 or ":" in line[:60]):
            current_date = d
            continue

        if current_date is None:
            continue

        # Stop conditions
        if line.startswith("Home") or line.startswith("[Home"):
            break
        if "Back to Top" in line:
            break
        if re.match(r"^(Visibility|Sighting Reports|Ramadan Timetable|Moon Sighting)\b", line, re.IGNORECASE):
            break

        # Match: "1. Saudi Arabia (30 days completion)"
        m = re.match(r"^\d+\.\s*(.+?)(?:\s*\(([^)]*)\))?\s*$", line)
        if not m:
            m = re.match(r"^([A-Z][A-Za-z\s.'\-]+?)(?:\s*\(([^)]*)\))?\s*$", line)
        if not m:
            continue

        country_raw = m.group(1).strip().rstrip(" -–")
        method_raw = (m.group(2) or "").strip()
        cid, cname = match_country(country_raw)
        if not cid:
            continue

        results.append(make_entry(hijri_year, hijri_month, cid, cname,
                                  current_date, method_raw,
                                  f"moonsighting.com/{hijri_year}{HIJRI_MONTHS[hijri_month-1][0]}.html"))
    return results


# ---------------------------------------------------------------------------
# Strategy 2: Parse an HTML table format (1438+ style)
# Rows like: "| May 27, 2017 (Saturday) | Saudi Arabia (Local Sighting) |"
# ---------------------------------------------------------------------------
def extract_official_table(html: str, hijri_year: int, hijri_month: int) -> list[dict]:
    """Parse table-based official start dates (1438+ format)."""
    soup = BeautifulSoup(html, "html.parser")
    results = []

    for table in soup.find_all("table"):
        rows = table.find_all("tr")
        for row in rows:
            cells = row.find_all("td")
            if len(cells) < 2:
                continue
            date_text = cells[0].get_text(strip=True)
            country_text = cells[1].get_text(strip=True) if len(cells) > 1 else ""

            # Skip header-like rows
            if "will be added" in date_text.lower() or "1st day" in date_text.lower():
                continue
            if "????" in date_text:
                continue  # Unknown date

            d = parse_date(date_text)
            if not d:
                continue

            # Parse country + method from "Saudi Arabia (Local Sighting)"
            cm = re.match(r"^(.+?)(?:\s*[-–]\s*|\s*\()(.*?)(?:\))?$", country_text)
            if cm:
                country_raw = cm.group(1).strip()
                method_raw = cm.group(2).strip().rstrip(")")
            else:
                country_raw = country_text.strip()
                method_raw = ""

            # Handle special: "Egypt - Moon Born before sunset..."
            if " - " in country_text and not cm:
                parts = country_text.split(" - ", 1)
                country_raw = parts[0].strip()
                method_raw = parts[1].strip()

            cid, cname = match_country(country_raw)
            if not cid:
                continue

            results.append(make_entry(hijri_year, hijri_month, cid, cname,
                                      d, method_raw,
                                      f"moonsighting.com/{hijri_year}{HIJRI_MONTHS[hijri_month-1][0]}.html"))

    return results


# ---------------------------------------------------------------------------
# Strategy 3: Parse announcements at the bottom of text (non-Ramadan months)
# Lines like: "Saudi Arabia initially declared Muharram 1, 1430 hijri to be on Monday,
#              December 29, 2008."
# Or: "India, Pakistan and Bangladesh offically declared Muharram 1, 1430
#      hijri to be on Tuesday, December 30, 2008."
# ---------------------------------------------------------------------------
DECL_RE = re.compile(
    r"(?P<countries>[A-Z][\w,\s&]+?)\s+"
    r"(?:offici?ally|initially)?\s*(?:declared|announced|have|has)\b.*?"
    r"(?:to be|will be|is)\s+(?:on\s+)?(?:(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+)?"
    r"(?P<month>[A-Za-z]+)\s+(?P<day>\d{1,2}),?\s+(?P<year>\d{4})",
    re.IGNORECASE | re.DOTALL,
)


def extract_announcements(text: str, hijri_year: int, hijri_month: int) -> list[dict]:
    """Heuristic: find announcement sentences mentioning countries + dates."""
    results = []
    seen = set()

    for m in DECL_RE.finditer(text):
        countries_str = m.group("countries")
        mn = m.group("month").lower()
        if mn not in MONTH_NAMES:
            continue
        try:
            d = date(int(m.group("year")), MONTH_NAMES[mn], int(m.group("day")))
        except ValueError:
            continue

        # Split "India, Pakistan and Bangladesh" into individual countries
        parts = re.split(r",\s*|\s+and\s+", countries_str)
        for part in parts:
            part = part.strip()
            cid, cname = match_country(part)
            if cid and (cid, d) not in seen:
                seen.add((cid, d))
                results.append(make_entry(hijri_year, hijri_month, cid, cname,
                                          d, "Official Announcement",
                                          f"moonsighting.com/{hijri_year}{HIJRI_MONTHS[hijri_month-1][0]}.html"))
    return results


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def make_entry(hijri_year, hijri_month, country_id, country_name,
               greg_date, method_raw, source):
    return {
        "hijriYear":          hijri_year,
        "hijriMonth":         hijri_month,
        "hijriMonthCode":     HIJRI_MONTHS[hijri_month - 1][0].upper(),
        "hijriMonthName":     HIJRI_MONTHS[hijri_month - 1][2],
        "countryId":          country_id,
        "countryName":        country_name,
        "gregorianStartDate": greg_date.isoformat(),
        "gregorianYear":      greg_date.year,
        "method":             normalise_method(method_raw),
        "methodRaw":          method_raw,
        "source":             source,
    }


def dedup(results: list[dict]) -> list[dict]:
    """Remove duplicates: keep first entry per (hijriYear, hijriMonth, countryId)."""
    seen = set()
    out = []
    for r in results:
        key = (r["hijriYear"], r["hijriMonth"], r["countryId"])
        if key not in seen:
            seen.add(key)
            out.append(r)
    return out


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    all_results = []
    errors = []
    page_count = 0
    zero_pages = []

    for year in range(START_YEAR, END_YEAR + 1):
        for month_code, month_num, month_name in HIJRI_MONTHS:
            filename = f"{year}{month_code}.html"
            filepath = HTML_DIR / filename
            label = f"{year} {month_code.upper()} ({month_name})"

            if not filepath.exists():
                print(f"  {label:30s} MISSING")
                errors.append({"file": filename, "error": "file not found"})
                continue

            # Skip tiny stub pages (< 1 KB of real content)
            size = filepath.stat().st_size
            if size < 500:
                print(f"  {label:30s} STUB ({size} bytes)")
                continue

            html = filepath.read_text(encoding="utf-8", errors="replace")
            text = BeautifulSoup(html, "html.parser").get_text("\n", strip=True)
            page_count += 1

            # Try all strategies, combine results
            r1 = extract_official_list(text, year, month_num)
            r2 = extract_official_table(html, year, month_num)
            r3 = extract_announcements(text, year, month_num)

            combined = dedup(r1 + r2 + r3)
            target_count = sum(1 for r in combined if r["countryId"] in
                               {"sa","eg","jo","ps","pk","id","ma","ly","za","us","ca"})

            status = f"{len(combined):3d} entries ({target_count} target) [L={len(r1)} T={len(r2)} A={len(r3)}]"
            print(f"  {label:30s} {status}")

            if len(combined) == 0 and size > 3000:
                zero_pages.append(filename)

            all_results.extend(combined)

    # Deduplicate across all pages
    all_results = dedup(all_results)

    # Summary
    print(f"\n{'='*70}")
    print(f"Pages fetched: {page_count}")
    print(f"Total entries (deduped): {len(all_results)}")

    by_month = {}
    for r in all_results:
        by_month.setdefault(r["hijriMonth"], []).append(r)
    print("\nBy month:")
    for mn in range(1, 13):
        entries = by_month.get(mn, [])
        code = HIJRI_MONTHS[mn-1][0].upper()
        name = HIJRI_MONTHS[mn-1][2]
        print(f"  {code} ({name:16s}): {len(entries):4d} entries")

    by_country = {}
    for r in all_results:
        by_country.setdefault(r["countryId"], []).append(r)
    print("\nBy country:")
    for cid, entries in sorted(by_country.items()):
        print(f"  {cid}: {len(entries):4d} entries across {len(set(e['hijriMonth'] for e in entries))} months")

    if errors:
        print(f"\nErrors ({len(errors)}):")
        for e in errors:
            print(f"  {e['file']}: {e['error'][:80]}")

    if zero_pages:
        print(f"\nZero-entry pages needing review ({len(zero_pages)}):")
        for f in zero_pages:
            print(f"  {f}")

    # Write JSON
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    print(f"\nWritten {OUT_JSON}")

    # Write CSV
    if all_results:
        fieldnames = ["hijriYear", "hijriMonth", "hijriMonthCode", "hijriMonthName",
                       "countryId", "countryName", "gregorianStartDate", "gregorianYear",
                       "method", "methodRaw", "source"]
        with open(OUT_CSV, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(all_results)
        print(f"Written {OUT_CSV}")


if __name__ == "__main__":
    main()
