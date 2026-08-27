# Water & Agriculture KPI Calculator

A multi-page static website for five connected calculation modules:

1. Water Measurement
2. Demand-Side Water Saving
3. Additional Agricultural Production
4. Additional Farmer Income
5. Person-Days Generated

The site includes Leaflet state-boundary integration, CACP master data, personal branding, a single **Visit My Website** portfolio button on the About page, a **Buy Me a Coffee** UPI QR modal, SEO metadata, sitemap/robots files, and clean A4 Print / Save PDF calculation reports.

## Portfolio

Configured portfolio URL:

```text
https://knightfox789.github.io/kaushal-gadariya-portfolio/
```

The portfolio button intentionally appears only on the **About** page.

## Preview locally

Do not open the HTML files with `file://` because map/data pages use `fetch()`.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Print / Save PDF

Each calculator result panel contains **Print / Save PDF**. It creates a clean A4 calculation report containing:

- calculator name and timestamp,
- current visible inputs,
- formula/method,
- calculated results,
- methodology/data notes,
- calculator branding and disclaimer.

Use the browser print dialog and choose **Save as PDF**.

## SEO readiness

Prepared public URL:

```text
https://knightfox789.github.io/water-agriculture-kpi-calculator/
```

Included:

- unique page titles and meta descriptions,
- index/follow robots directives,
- canonical URLs,
- Open Graph and Twitter metadata,
- JSON-LD structured data,
- semantic single-H1 pages,
- `robots.txt`,
- `sitemap.xml`,
- responsive viewport,
- favicon and web manifest.

If the final GitHub repository path is different, run:

```bash
python scripts/update_site_url.py https://knightfox789.github.io/YOUR-FINAL-REPO/
```

Local SEO audit:

```bash
python scripts/seo_check.py
```

## CACP update architecture

Canonical master:

```text
source_data/Consolidated_Person_Days_Master_Input_Data.xlsx
```

Build scripts:

```bash
python scripts/xlsx_to_csv.py
python scripts/build_data.py
```

Generated browser files:

```text
data/master.json
data/states.geojson
data/version.json
```

## GitHub status

This package is not deployed and does not activate a GitHub Action yet. An inactive workflow template remains at `deployment/pages.yml.example`.

## Method caution

This is an independent calculation aid. It should not be described as an official HUF portal. The Additional Income module follows the project/Form 3C crop-economics pathway; the reviewed Demand-Side SOP does not contain a dedicated numbered Additional Income methodology section equivalent to the other KPI sections.
