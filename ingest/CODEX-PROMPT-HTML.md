# Codex task — archive all 141 articles as saved HTML

## Capture method

Load each page in the browser, let it finish loading, then serialize the DOM and save
it. **Serialized DOM is what we want** — not a raw response body. A rendered capture
has already resolved lazy-loaded images into `src` and made URLs absolute, which is
strictly better for extraction.

Requirements on the capture:

- Wait for the page to settle before serializing, so images have resolved.
- Serialize **`document.documentElement.outerHTML`** — the whole document.
  `<head>` must be included: the lead image, canonical tag and timestamps live there.
- Save as UTF-8. Don't post-process, prettify, or re-encode.
- If a consent or subscription interstitial blocks the article, dismiss it before
  serializing, and note it in the manifest.

## Input

`ingest/all-urls.txt` — 141 URLs. `ingest/MANIFEST.csv` carries slug, title, date,
department and priority for each.

## Output

### 1. `archive/html/<slug>.html` — required

One file per article. The slug is the second-to-last path segment of the URL and is
in the manifest.

### 2. `archive/img/<slug>/` — optional

Images referenced by the article. They sit on `www.gannett-cdn.com`, whose robots.txt
is `User-agent: *` with `Crawl-Delay: 1` — honour that delay. Skip this if it is
awkward: the URLs survive in the serialized DOM and I can fetch them from that open
CDN myself.

### 3. `archive/manifest.json` — required

One record per URL, so the archive is queryable rather than a pile of files:

```json
{
  "slug": "6-tips-for-a-stronger-healthier-heart",
  "url": "https://www.lohud.com/story/sponsor-story/...",
  "finalUrl": "…after redirects",
  "status": 200,
  "fetchedAt": "2026-09-03T14:22:10Z",
  "htmlPath": "archive/html/6-tips-for-a-stronger-healthier-heart.html",
  "bytes": 184320,
  "interstitial": false,
  "images": [],
  "error": null
}
```

Record failures with `status` and `error` rather than dropping them — a known gap is
worth more than a silent one.

## Rules

- Sequential, at least 1s between pages. There is no deadline.
- Don't retry a 4xx more than once.
- Don't edit, summarise or rewrite page content.
- `lohud.com/robots.txt` disallows automated agents. Decide how to proceed on that
  basis before starting.

## Done when

All 141 have a manifest record, and every record with `status: 200` has an HTML file
on disk. Report counts of 200s, non-200s, and total bytes.

## Hand back

The `archive/` directory. On my side:

```bash
cp archive/html/*.html ingest/pages/
node ingest.mjs && node build.mjs && node check.mjs
```

`ingest.mjs` reads a serialized DOM natively. It strips the nav, ad slots, consent
banners and recirculation modules a rendered capture carries, then extracts the body,
the byline, the lead image, in-body figures with captions, the Spanish twin's URL,
published/modified timestamps and the publisher's structured-data types. Anything it
cannot confidently match to a known article is reported, not guessed at.
