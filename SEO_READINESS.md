# Google SEO Readiness

## Current status

The static website has been prepared for Google Search crawling and indexing using a proposed GitHub Pages URL:

```text
https://knightfox789.github.io/water-agriculture-kpi-calculator/
```

If the final repository name differs, update all public URLs with:

```bash
python scripts/update_site_url.py https://knightfox789.github.io/YOUR-FINAL-REPO/
```

## Implemented

- Unique `<title>` on every public page.
- Unique meta description on every public page.
- `index,follow` robots meta directives.
- Canonical URL on every public page.
- Open Graph title, description, site name and URL.
- Twitter summary metadata.
- JSON-LD structured data.
- One H1 per public page.
- Responsive viewport.
- Semantic internal links with descriptive anchor text.
- `robots.txt`.
- `sitemap.xml`.
- Favicon and web app manifest.
- Mobile-responsive layout.
- No hidden SEO keyword stuffing or duplicate landing pages.

## Local validation

Run:

```bash
python scripts/seo_check.py
```

The current package passes the local technical SEO checks for all public HTML pages.

## After GitHub deployment

1. Confirm the final public URL and rerun `update_site_url.py` if needed.
2. Open every public URL and confirm HTTP 200 responses.
3. Add the site to Google Search Console.
4. Submit `/sitemap.xml` in Search Console.
5. Use URL Inspection for the home page and main calculator pages.
6. Monitor indexing, Core Web Vitals and search queries after Google crawls the site.

## Important limitation

Technical SEO makes the site easier for search engines to crawl and understand; it does not guarantee rankings. Search visibility also depends on useful content, external references/links, user value, page performance and Google indexing decisions.
