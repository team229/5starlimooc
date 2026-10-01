# 5 Star Limousine — Astro rebuild of 5starlimooc.com

Full-site rebuild (152 pages) of **https://5starlimooc.com/** in
[Astro](https://astro.build/) + [Tailwind CSS v4](https://tailwindcss.com/).
Every image, font, stylesheet and content block is stored **locally** —
no page loads any asset from the original site's URLs.

## Quick start

```bash
npm install
npm run build        # static output in dist/
npm run preview      # serve dist/ locally
```

Python scraping needs bs4/lxml on this machine:

```bash
PYTHONPATH=/home/abhay/.local/lib/python3.14/site-packages python3 scripts/scrape.py
```

## Pipeline

```
original site
  │  scripts/scrape.py --pages    (HTML → src/content/pages/*.json, cached in /tmp/opencode/scrape-cache/)
  │  scripts/scrape.py --images   (all <img>/og:image/CSS backgrounds → public/images/, 68 MB)
  │  scripts/scrape.py --fonts    (20 woff2 → public/fonts/)
  │  scripts/trustindex.py        (reviews widget markup → src/data/, CSS + assets local)
  ▼
Astro build
  │  hand-built routes            (homepage, about, contact, blog/services/fleet/city indexes,
  │                                gallery, sitemap, legal, thank-you, 404)
  │  catch-all [...path].astro    (everything else, rendered from scraped JSON)
  ▼
dist/  →  scripts/verify.py       (audit: no hot-linking, no broken links, tracking present)
```

## Key files

| Path | Purpose |
|---|---|
| `scripts/scrape.py` | Fetches sitemap URLs, extracts semantic blocks (h1–h6/p/ul/ol/img/quote/table/link), rewrites internal links to local routes, downloads images/fonts. Idempotent via `/tmp/opencode/scrape-cache/`. |
| `scripts/trustindex.py` | Captures the Trustindex reviews widget markup + CSS + avatar/platform assets locally. Re-run safe (downloads missing assets before rewriting URLs). |
| `scripts/verify.py` | Post-build audit: fails on (1) any resource loaded from `5starlimooc.com`, (2) broken internal href/src, (3) missing GA4/GTM/Trustindex/form markers. |
| `src/content/pages/*.json` | 147 scraped page records: `{path,title,description,h1,date,kind,featured,images[],blocks[]}`. Homepage (`/`) is excluded — it is hand-built. |
| `src/content.config.ts` | Content-collection schema for the records. |
| `src/data/` | Hand-authored data: `site.ts` (NAP, `tracking` IDs/endpoints), `nav.ts`, `fleet.ts`, `services.ts`, `cities.ts`, `testimonials.ts`, `homepage.ts`, `routes.ts` (`HAND_BUILT`, breadcrumb groups). |
| `src/components/Tracking.astro` | GA4 (`G-9F9GDE33Z9`), GTM (`GTM-KHQFFXS4` + noscript), Trustindex loader. Included on every page via `BaseLayout`. |
| `src/pages/[...path].astro` | Catch-all: renders any scraped record not in `HAND_BUILT` with `PageHero` + `ContentBlocks` + `CtaBand`. |

## Link normalisation (`local_route()` in scrape.py)

The original site's quirks are normalised at scrape time:

- `/locations/` → `/cities/`, `/contact-us/` → `/contact/`, `/index.php/X/` → `/X/`
- Six slugs linked in original content return **404 on the original site**
  (`/24-hour-limo-service/`, `/airport-car-service/`, `/bachelor-party-limo-rental/`,
  `/limousine-service-for-wedding/`, `/services-limos/`, `/wine-tour-limo-rental/`)
  — they are remapped to the closest live page instead of reproducing dead links.
- `/privacy-policy/`, `/terms-of-service/`, `/sitemap/` return 404 on the original;
  they are created locally as hand-built pages.

## Tracking & third-party services (intentionally kept)

| Service | Where | Notes |
|---|---|---|
| GA4 `G-9F9GDE33Z9` | `Tracking.astro` (head) | same ID as original |
| GTM `GTM-KHQFFXS4` | `Tracking.astro` (head + body noscript) | same ID as original |
| Trustindex loader `cdn.trustindex.io/loader.js` | `Tracking.astro` + `Reviews.astro` | widget markup/CSS/avatars served locally; loader hydrates live reviews |
| Quote form → `api-inform.bythub.in` | `QuoteForm.astro` | same endpoint as original, redirects to `/thankyou/` |
| Contact form → `api.web3forms.com` | `contact.astro` | same key as original |
| Hero video `youtube-nocookie.com/embed/EOsQl5ABpaA` | `Hero.astro` | privacy-enhanced embed, same video as original |
| Google Maps embed iframe | `contact.astro` | business-location map, same as original |

`scripts/verify.py` treats these as the **only** allowed external loads.
SEO metadata (canonical, `og:image`, JSON-LD `sameAs`/business URLs) still uses
absolute `https://5starlimooc.com/…` URLs — that is correct and required for
production SEO; browsers do not fetch them as page resources.

## Known caveats

- `@astrojs/compiler` (this Astro version) corrupts frontmatter lines that
  **start with `|`** — union types must be written on a single line
  (see `src/components/Icon.astro`).
- Never `new URL(..., import.meta.url)` to read source files at build time —
  use `join(process.cwd(), ...)` (built chunks live in `dist/`, see `gallery.astro`).
- Google avatar URLs in the Trustindex widget rotate between captures;
  homepage review avatars are snapshotted to stable
  `public/images/ext/avatar-<reviewer>.png` files so re-captures can't break them.
- The original server intermittently returns empty bodies under parallel load;
  the scraper retries, and flaky pages can be re-fetched (cache is per-URL).
- `dist/` is ~76 MB (68 MB images) — deploy as static files.
