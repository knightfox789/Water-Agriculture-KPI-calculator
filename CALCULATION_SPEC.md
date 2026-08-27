# Calculation Specification

## Water Measurement

- Pump: `TH = SWL + FL + DH`; `Q(L/min)=60×HP×75×efficiency/TH`.
- Field-depth: average 5 depth points; `litres = depth(mm) × area(m²)`.
- V-notch: `Q=1.38×H^2.5`; `V=Q×t`.
- Drip: `N=area/(emitter spacing×lateral spacing)`; `V=N×q×time`.
- Sprinkler: `Q(LPH/head)=ml collected in 30s × 0.12`; `V=N×Q×time`.

## Water Saving

- Same crop / crop change: `Control water − Programme water`.
- Intercropping: allocate programme water by crop-area share, compare water-use-per-kg with control, extrapolate to programme yield.
- Rainfed: `WP=yield/rainfall`; `Saving(mm)=R×(WPp−WPc)/WPp`; `m³=mm×ha×10`.

## Additional Production

- Same crop: `(Yp−Yc)×area`.
- Crop change: `CEY=Yp×Pricep/Pricec`; increment `CEY−Yc`.
- Intercrop: area-weight each crop, convert each to control-crop equivalent, sum CEY, subtract control yield.

## Additional Income

Project/Form 3C crop-economics pathway:

`Net Income = Gross Income − Relevant Production Cost`

`Additional Income = Programme Net − Control Net`

## Person-Days

`Labour Days/ha = Human Labour Cost / Daily Wage`

`Labour Days/qtl = Labour Days/ha / Yield`

`Person-Days = Additional Production(qtl) × Labour Days/qtl`

The labour-days coefficient is a derived proxy from the CACP price-policy inputs used.
