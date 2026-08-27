# Water & Agriculture KPI Calculator

A multi-page static website framework for five connected calculation modules:

1. Water Measurement
2. Demand-Side Water Saving
3. Additional Agricultural Production
4. Additional Farmer Income
5. Person-Days Generated

The site includes Leaflet state-boundary integration, CACP master data, personal branding, a configurable **Visit My Website** button, and a **Buy Me a Coffee** modal showing the supplied UPI QR image.

## Preview locally

Do not open the HTML files with `file://` because the map/data pages use `fetch()`.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Change personal branding

Edit only:

```text
assets/js/site-config.js
```

Important fields:

```js
brandName: "Kaushal Gadariya",
portfolioUrl: "https://github.com/YOUR_GITHUB_USERNAME",
upiQrImage: "assets/images/upi-qr.jpeg"
```

Replace `YOUR_GITHUB_USERNAME` with the real GitHub portfolio/repository/profile URL when ready.

## CACP update architecture

Human-maintained canonical master:

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

This package is **not deployed** and does not activate a GitHub Action yet. An inactive workflow template is provided at:

```text
deployment/pages.yml.example
```

After the UI/methodology is approved, it can be copied to `.github/workflows/pages.yml` and adapted to deploy the complete multi-page site.

## Method caution

This is an independent calculation aid. It should not be described as an official HUF portal. The Additional Income module follows the project/Form 3C crop-economics pathway; the reviewed Demand-Side SOP does not contain a dedicated numbered Additional Income methodology section equivalent to the other KPI sections.
