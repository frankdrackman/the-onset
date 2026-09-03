# Codex task — archive all 141 articles as raw HTML

## Why HTML rather than an image list

Save the page and every derived field comes from it, now and later, without
re-fetching: body text, section headings, byline, lead image, in-body figures with
captions and credits, published/modified timestamps, the Spanish twin's URL, the
canonical tag, and whatever structured data the publisher already ships. An image
list solves today's gap and leaves the next one. Pages also change and rot, so the
saved HTML becomes the archive of record for the migration.

Text-only saves have already cost us two passes. This is the last one needed.

## Input

`ingest/all-urls.txt` — 141 URLs. `ingest/MANIFEST.csv` has slug, title, date,
department and priority for each.

## Output

### 1. `archive/html/<slug>.html` — required

The response body, **unmodified**. Do not prettify, minify, re-encode, or strip
anything. The slug is the second-to-last path segment of the URL and is in the
manifest.

- Write as UTF-8.
- Do not normalise or transform the text. (Note: the previous text pass arrived in
  decomposed Unicode — `N` + combining tilde rather than `Ñ`. Writing raw bytes
  avoids that class of problem entirely.)

### 2. `archive/img/<slug>/` — preferred

Every image referenced by the article: the `og:image` and any in-body `<figure>`
images. Keep the original filename from the URL. Images are on
`www.gannett-cdn.com`, whose robots.txt is `User-agent: *` with `Crawl-Delay: 1` —
honour that delay.

If this is inconvenient, skip it: the URLs are in the HTML and I can fetch them.

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
  "images": ["archive/img/6-tips-for-a-stronger-healthier-heart/lead.jpg"],
  "error": null
}
```

Record failures with `status` and `error` rather than dropping them — a known gap is
worth more than a silent one.

## Rules

- Fetch sequentially with at least 1s between requests. There is no deadline here.
- Do not retry a 4xx more than once.
- Do not alter, summarise or rewrite any page content. Byte-for-byte.
- `lohud.com/robots.txt` disallows automated agents. Decide how to proceed on that
  basis before starting.

## Done when

All 141 have a record in `archive/manifest.json`, and every record with
`status: 200` has an HTML file on disk. Report the count of 200s, non-200s, and
total bytes.

## Hand back

The `archive/` directory. On my side:

```bash
cp archive/html/*.html ingest/pages/
node ingest.mjs && node build.mjs && node check.mjs
```

`ingest.mjs` reads HTML natively — it pulls the byline, the lead image, figure
captions, the Spanish twin URL, published/modified dates and the publisher's
structured-data types, and reports anything it cannot confidently match to a known
article rather than guessing.
