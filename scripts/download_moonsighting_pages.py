"""
download_moonsighting_pages.py

Downloads all moonsighting.com month pages to a local folder for offline parsing.
Years 1430–1447, all 12 months = up to 216 pages.

Output: scripts/moonsighting_html/{year}{month_code}.html
"""

import time
import sys
from pathlib import Path

import requests

START_YEAR = 1430
END_YEAR = 1447

MONTH_CODES = ["muh", "sfr", "rba", "rbt", "jmo", "jmt",
               "rjb", "shb", "rmd", "shw", "zqd", "zhj"]

BASE_URL = "https://www.moonsighting.com/{year}{code}.html"
OUT_DIR = Path(__file__).resolve().parent / "moonsighting_html"


def main():
    OUT_DIR.mkdir(exist_ok=True)

    total = 0
    downloaded = 0
    skipped = 0
    errors = []

    for year in range(START_YEAR, END_YEAR + 1):
        for code in MONTH_CODES:
            total += 1
            filename = f"{year}{code}.html"
            filepath = OUT_DIR / filename
            url = BASE_URL.format(year=year, code=code)

            # Skip if already downloaded
            if filepath.exists() and filepath.stat().st_size > 500:
                print(f"  SKIP (exists) {filename}")
                skipped += 1
                continue

            print(f"  GET  {filename:20s} ... ", end="", flush=True)

            try:
                resp = requests.get(url, timeout=30)
                resp.raise_for_status()
                filepath.write_text(resp.text, encoding="utf-8")
                size_kb = len(resp.text) / 1024
                print(f"OK  ({size_kb:.0f} KB)")
                downloaded += 1
            except Exception as e:
                err_short = str(e).split("for url")[0].strip()
                print(f"ERROR: {err_short}")
                errors.append({"file": filename, "error": str(e)})

            time.sleep(0.5)

    print(f"\n{'='*60}")
    print(f"Total pages:  {total}")
    print(f"Downloaded:   {downloaded}")
    print(f"Skipped:      {skipped}")
    print(f"Errors:       {len(errors)}")
    if errors:
        print("\nFailed pages:")
        for e in errors:
            print(f"  {e['file']}: {e['error'][:80]}")
    print(f"\nFiles saved to: {OUT_DIR}")


if __name__ == "__main__":
    main()
