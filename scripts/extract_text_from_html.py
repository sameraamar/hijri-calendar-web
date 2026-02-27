"""
extract_text_from_html.py

Reads all downloaded moonsighting HTML files and produces one big .txt file
with the text content organized by year and month.
"""

from pathlib import Path
from bs4 import BeautifulSoup

HTML_DIR = Path(__file__).resolve().parent / "moonsighting_html"
OUT_FILE = Path(__file__).resolve().parent / "moonsighting_all_text.txt"

MONTH_CODES = ["muh", "sfr", "rba", "rbt", "jmo", "jmt",
               "rjb", "shb", "rmd", "shw", "zqd", "zhj"]
MONTH_NAMES = {
    "muh": "Muharram", "sfr": "Safar", "rba": "Rabi al-Awwal",
    "rbt": "Rabi al-Thani", "jmo": "Jumada al-Ula", "jmt": "Jumada al-Thani",
    "rjb": "Rajab", "shb": "Sha'ban", "rmd": "Ramadan", "shw": "Shawwal",
    "zqd": "Dhul Qi'dah", "zhj": "Dhul Hijjah",
}

START_YEAR = 1430
END_YEAR = 1447


def extract_text(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    # Remove script/style
    for tag in soup(["script", "style"]):
        tag.decompose()
    return soup.get_text("\n", strip=True)


def main():
    lines = []
    for year in range(START_YEAR, END_YEAR + 1):
        lines.append(f"{'#'*80}")
        lines.append(f"# YEAR {year} AH")
        lines.append(f"{'#'*80}")
        lines.append("")

        for code in MONTH_CODES:
            month_num = MONTH_CODES.index(code) + 1
            name = MONTH_NAMES[code]
            filepath = HTML_DIR / f"{year}{code}.html"

            lines.append(f"{'='*70}")
            lines.append(f"== {year} {code.upper()} - {name} (month {month_num})")
            lines.append(f"== Source: {year}{code}.html")
            lines.append(f"{'='*70}")

            if not filepath.exists():
                lines.append("[FILE NOT FOUND - page returned 404]")
                lines.append("")
                continue

            html = filepath.read_text(encoding="utf-8", errors="replace")
            size = len(html)

            if size < 500:
                lines.append(f"[STUB PAGE - only {size} bytes]")
                lines.append("")
                continue

            text = extract_text(html)

            # Trim navigation boilerplate from top and bottom
            # Top nav usually ends before "Moonsighting for" or "The Astronomical"
            start_markers = ["Moonsighting for", "The Astronomical", "Al urjoonul"]
            for marker in start_markers:
                idx = text.find(marker)
                if idx > 0:
                    text = text[idx:]
                    break

            # Bottom nav usually starts with "Home Moon" or "top Back to Top"
            end_markers = ["top\nBack to Top", "top Back to Top", "\nHome\nMoon"]
            for marker in end_markers:
                idx = text.find(marker)
                if idx > 0:
                    text = text[:idx]
                    break

            lines.append(text)
            lines.append("")

    output = "\n".join(lines)
    OUT_FILE.write_text(output, encoding="utf-8")
    size_mb = len(output) / (1024 * 1024)
    print(f"Written {OUT_FILE} ({size_mb:.1f} MB, {len(lines)} lines)")


if __name__ == "__main__":
    main()
