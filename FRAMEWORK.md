# Approved Pre-GitHub Framework

## Website identity

**Water & Agriculture KPI Calculator**  
Developed by **Kaushal Gadariya**  
Water Security • GIS • Agriculture • Data & M&E

## Pages

- Home / KPI hub
- Water Measurement
- Water Saving
- Additional Production
- Additional Income
- Person-Days with Leaflet state map
- India State Data Explorer
- Methodology & Formula Register
- Data Sources & Update Model
- About / Personal Branding

## Shared result flow

```text
Water Measurement -> Programme/Control Water -> Water Saving
Additional Production -> Additional Production (qtl) -> Person-Days
Crop Economics -> Additional Income
All saved results -> Home session summary
```

## Branding controls

Edit only `assets/js/site-config.js` to change:

- developer/brand name
- tagline
- GitHub/portfolio website URL
- button label
- UPI QR image path

The **Visit My Website** button is wired to `portfolioUrl` in this config. It currently contains a placeholder until the real URL is supplied.

## Support button

Every shared header/footer has **Buy Me a Coffee**. It opens a modal containing the supplied UPI QR image at `assets/images/upi-qr.jpeg`.

## GitHub status

No GitHub deployment has been activated yet. `deployment/pages.yml.example` is only a future deployment template. Final GitHub configuration should happen after calculator/UI review.
