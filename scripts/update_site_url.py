#!/usr/bin/env python3
"""Update canonical/OpenGraph/sitemap/robots URLs if the GitHub Pages repo path changes."""
from pathlib import Path
import re, sys

ROOT = Path(__file__).resolve().parents[1]
OLD = "https://knightfox789.github.io/water-agriculture-kpi-calculator/"
NEW = (sys.argv[1] if len(sys.argv) > 1 else OLD).rstrip('/') + '/'

for p in list(ROOT.rglob('*.html')) + [ROOT/'sitemap.xml', ROOT/'robots.txt', ROOT/'assets/js/site-config.js']:
    if p.exists():
        t=p.read_text(encoding='utf-8').replace(OLD,NEW)
        p.write_text(t,encoding='utf-8')
print(f"Updated public site URL to {NEW}")
