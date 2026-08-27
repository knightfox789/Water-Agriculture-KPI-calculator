#!/usr/bin/env python3
from pathlib import Path
from bs4 import BeautifulSoup
import json, sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]
for p in sorted(ROOT.rglob('*.html')):
    rel=p.relative_to(ROOT)
    s=BeautifulSoup(p.read_text(encoding='utf-8'),'html.parser')
    title=s.title.string.strip() if s.title and s.title.string else ''
    desc=s.find('meta',attrs={'name':'description'})
    canonical=s.find('link',rel='canonical')
    robots=s.find('meta',attrs={'name':'robots'})
    h1=s.find_all('h1')
    viewport=s.find('meta',attrs={'name':'viewport'})
    ld=s.find('script',attrs={'type':'application/ld+json'})
    checks=[('title',bool(title)),('description',bool(desc and desc.get('content'))),('canonical',bool(canonical and canonical.get('href'))),('robots',bool(robots)),('viewport',bool(viewport)),('single H1',len(h1)==1),('JSON-LD',bool(ld))]
    failed=[name for name,ok in checks if not ok]
    if failed: errors.append((str(rel),failed))
    print(f"{rel}: {'PASS' if not failed else 'FAIL ' + ', '.join(failed)}")
for required in ['robots.txt','sitemap.xml','manifest.webmanifest']:
    if not (ROOT/required).exists(): errors.append((required,['missing']))
if errors:
    print('\nSEO audit failed:')
    for x in errors: print(x)
    sys.exit(1)
print('\nSEO audit passed for all public HTML pages.')
