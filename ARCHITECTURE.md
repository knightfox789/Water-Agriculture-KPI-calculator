# Website Architecture

## Core layers

```text
User Interface
  ├─ Water Measurement
  ├─ Water Saving
  ├─ Additional Production
  ├─ Additional Income
  ├─ Person-Days
  └─ State Explorer

Shared Calculation Library
  └─ assets/js/calculators.js

Shared Browser Session
  └─ assets/js/app-state.js / localStorage

Reference Data
  ├─ data/master.json
  └─ data/states.geojson

Canonical Source Data
  ├─ Consolidated CACP Excel master
  └─ ESRI State_NWIC shapefile
```

## Cross-module result passing

- Water Measurement can save `Programme Water m³/ha` and `Control Water m³/ha`.
- Water Saving can read those saved values.
- Additional Production saves `Additional Production qtl`.
- Person-Days can load the saved production value.
- Home shows latest saved Water Saving, Production, Income and Person-Days results.

All session values remain in the browser only.
