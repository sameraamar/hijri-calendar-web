"""
scrape_moonsighting_ramadan.py

Scrapes https://www.moonsighting.com/{year}rmd.html for years 1430–1447
and extracts the "OFFICIAL 1st Day of Ramadan in Different Countries" table.

Outputs: scripts/moonsighting_ramadan_data.json  (structured)
         scripts/moonsighting_ramadan_data.csv   (flat)

Target countries (mapped to our country IDs):
  Saudi Arabia → sa
  Egypt → eg
  Jordan → jo
  Palestine → ps
  Pakistan → pk
  Indonesia → id
  Morocco → ma
  Libya → ly
  South Africa → za
  USA → us  (North America)
  Canada → ca (North America)
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
BASE_URL = "https://www.moonsighting.com/{year}rmd.html"

SCRIPTS_DIR = Path(__file__).resolve().parent
OUT_JSON = SCRIPTS_DIR / "moonsighting_ramadan_data.json"
OUT_CSV = SCRIPTS_DIR / "moonsighting_ramadan_data.csv"

# Country name → our ISO code  (case-insensitive matching)
COUNTRY_MAP = {
    "saudi arabia":  "sa",
    "saudi":         "sa",
    "egypt":         "eg",
    "jordan":        "jo",
    "palestine":     "ps",
    "pakistan":       "pk",
    "indonesia":     "id",
    "morocco":       "ma",
    "libya":         "ly",
    "south africa":  "za",
    "s. africa":     "za",
    "usa":           "us",
    "united states": "us",
    "u.s.a.":        "us",
    "canada":        "ca",
    "turkey":        "tr",
    "türkiye":       "tr",
    "turkiye":       "tr",
    "nigeria":       "ng",
    "malaysia":      "my",
    "australia":     "au",
}

# Normalise method strings
def normalise_method(raw: str) -> str:
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
    if "follow" in raw_lower:
        return "FollowOther"
    if "moon born" in raw_lower or "moon set" in raw_lower or "moonset" in raw_lower:
        return "CalculatedCalendar"
    if "astronomical" in raw_lower:
        return "CalculatedCalendar"
    if "announcement" in raw_lower or "announced" in raw_lower:
        return "SightingConfirmed"
    return "Unknown"


# ---------------------------------------------------------------------------
# Date parsing helpers
# ---------------------------------------------------------------------------
MONTH_NAMES = {
    "january": 1, "february": 2, "march": 3, "april": 4,
    "may": 5, "june": 6, "july": 7, "august": 8,
    "september": 9, "october": 10, "november": 11, "december": 12,
}

# Pattern 1: "August 22, 2009 (Saturday):"   (US format)
DATE_HEADER_US = re.compile(
    r"(?P<month>\w+)\s+(?P<day>\d{1,2}),?\s+(?P<year>\d{4})\s*\(",
    re.IGNORECASE,
)
# Pattern 2: "Friday, 20 July 2012:"   (UK/intl format)
DATE_HEADER_UK = re.compile(
    r"(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s+"
    r"(?P<day>\d{1,2})\s+(?P<month>\w+)\s+(?P<year>\d{4})",
    re.IGNORECASE,
)


def parse_date_header(text: str):
    """Try to parse a date from a header like 'August 22, 2009 (Saturday):'
    or 'Friday, 20 July 2012:'."""
    for pattern in (DATE_HEADER_US, DATE_HEADER_UK):
        m = pattern.search(text)
        if m:
            month_name = m.group("month").lower()
            if month_name in MONTH_NAMES:
                return date(int(m.group("year")), MONTH_NAMES[month_name], int(m.group("day")))
    return None


# ---------------------------------------------------------------------------
# Parse the OFFICIAL section
# ---------------------------------------------------------------------------
def extract_official_section(html: str, hijri_year: int) -> list[dict]:
    """
    Find the 'OFFICIAL 1st Day of Ramadan' heading and parse the
    date groups and numbered country lists that follow.
    """
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text("\n", strip=True)

    # Find the official section (various spellings)
    patterns = [
        r"OFFICIAL\s+1st\s+Day\s+of\s+Ramadan\s+in\s+Different\s+Countries",
        r"Official\s+Date.+Different\s+Countries",
        r"OFFICIAL.+Ramadan.+Countries",
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
        d = parse_date_header(line)
        if d:
            current_date = d
            continue

        if current_date is None:
            continue

        # Stop if we hit footer / navigation / new major section
        if line.startswith("Home") or line.startswith("[Home"):
            break
        if "Back to Top" in line:
            break
        if re.match(r"^(Visibility|Sighting Reports|Ramadan Timetable|Moon Sighting)\b", line, re.IGNORECASE):
            break

        # Try to match numbered country entry:  "1. Saudi Arabia (30 days completion)"
        #  or "32. Saudi Arabia (30 days completion)"
        m = re.match(
            r"^\d+\.\s*(.+?)(?:\s*\(([^)]*)\))?\s*$",
            line,
        )
        if not m:
            # Also try without number: "Saudi Arabia (30 days completion)"
            m = re.match(
                r"^([A-Z][A-Za-z\s.'-]+?)(?:\s*\(([^)]*)\))?\s*$",
                line,
            )
        if not m:
            continue

        country_raw = m.group(1).strip().rstrip(" -–")
        method_raw = (m.group(2) or "").strip()
        country_lower = country_raw.lower().strip()

        country_id = COUNTRY_MAP.get(country_lower)
        if not country_id:
            # Try partial match
            for key, cid in COUNTRY_MAP.items():
                if key in country_lower or country_lower in key:
                    country_id = cid
                    break

        if not country_id:
            continue  # Not a target country

        results.append({
            "hijriYear": hijri_year,
            "hijriMonth": 9,
            "countryId": country_id,
            "countryName": country_raw,
            "gregorianStartDate": current_date.isoformat(),
            "gregorianYear": current_date.year,
            "method": normalise_method(method_raw),
            "methodRaw": method_raw,
            "source": f"moonsighting.com/{hijri_year}rmd.html",
        })

    return results


# ---------------------------------------------------------------------------
# Fallback: parse from sighting reports body
# ---------------------------------------------------------------------------
def extract_from_sighting_reports(html: str, hijri_year: int) -> list[dict]:
    """
    As a fallback, look for patterns in the sighting report text that
    mention specific countries and their Ramadan start dates.
    """
    soup = BeautifulSoup(html, "html.parser")
    text = soup.get_text("\n", strip=True)
    results = []

    # Pattern: "the first day of Ramadan <country> ... <date>"
    # or "Ramadan will start/begin on <date> in <country>"
    # This is very heuristic — the OFFICIAL section is much better.
    # We'll skip this for now and rely on the OFFICIAL section.
    return results


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    all_results = []
    errors = []

    for year in range(START_YEAR, END_YEAR + 1):
        url = BASE_URL.format(year=year)
        print(f"Fetching {url} ...", end=" ", flush=True)

        try:
            resp = requests.get(url, timeout=30)
            resp.raise_for_status()
        except Exception as e:
            print(f"ERROR: {e}")
            errors.append({"year": year, "error": str(e)})
            continue

        results = extract_official_section(resp.text, year)
        if not results:
            # Try fallback
            results = extract_from_sighting_reports(resp.text, year)

        print(f"found {len(results)} entries")
        all_results.extend(results)

        # Be polite
        time.sleep(1.0)

    # Summary
    print(f"\n{'='*60}")
    print(f"Total entries extracted: {len(all_results)}")
    by_country = {}
    for r in all_results:
        by_country.setdefault(r["countryId"], []).append(r)
    for cid, entries in sorted(by_country.items()):
        print(f"  {cid}: {len(entries)} years")

    if errors:
        print(f"\nErrors ({len(errors)}):")
        for e in errors:
            print(f"  Year {e['year']}: {e['error']}")

    # Write JSON
    with open(OUT_JSON, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    print(f"\nWritten {OUT_JSON}")

    # Write CSV
    if all_results:
        fieldnames = ["hijriYear", "hijriMonth", "countryId", "countryName",
                       "gregorianStartDate", "gregorianYear", "method", "methodRaw", "source"]
        with open(OUT_CSV, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(all_results)
        print(f"Written {OUT_CSV}")


if __name__ == "__main__":
    main()
