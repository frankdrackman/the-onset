# Retrieval spec — LoHud article bodies

Hand this to whoever runs the retrieval. Output drops into `ingest/pages/`, then
`node ingest.mjs && node build.mjs` does the rest.

## Input

`ingest/urls.txt` — 29 URLs. These are the only articles the prototype surfaces, so
they are the only ones whose body text changes what a reviewer sees. The full
141-article index is in `src/data/articles.mjs`.

`ingest/NEEDED.md` — the same list grouped by department, with each article's slug
and why it appears.

## Output

One file per article in `ingest/pages/`. Either format works:

- **`<slug>.html`** — the page's HTML. Full save or view-source both fine.
- **`<slug>.txt`** — plain text, paragraphs separated by blank lines.

Name the file after the article slug (from `NEEDED.md`) for a guaranteed match.
Failing that, the ingester also matches on the LoHud numeric article ID if it appears
anywhere in the file, or on the headline if it appears as a block of text.

## What to capture

The article body only:

- Body paragraphs, in order.
- Section subheadings (`h2`/`h3`), which the hub renders as its own H2s.
- The physician byline line if present — usually `Name, MD, <role>, for Montefiore
  Einstein` near the top or bottom. 111 of 141 articles currently have no byline in
  the build, so this is the single most valuable field after the body.

Skip nav, ads, related-story rails, newsletter prompts, comment counts, and the
"More from Montefiore Einstein" block. The ingester filters most of these anyway
(`JUNK` in `ingest.mjs`), and drops `<p>` under 45 characters.

## Site notes

- URL pattern: `lohud.com/story/sponsor-story/montefiore-health-system/YYYY/MM/DD/<slug>/<id>/`
- Body container is `div.gnt_ar_b` on current Gannett templates; `ingest.mjs` also
  accepts a plain `<article>` element or raw text.
- `lohud.com/robots.txt` disallows automated agents, including all Claude/Anthropic
  and OpenAI identifiers. Whoever runs this should decide how to proceed on that
  basis; it is why the retrieval is not part of the build pipeline.
- Spanish twins: the brief confirms thirteen exist. None appear in the public search
  index under the sponsor-story path, so they will need a LoHud manifest. If the
  retrieval surfaces Spanish URLs, capture them the same way and note the pairing —
  the build already carries reciprocal `hreflang` wiring.

## Verify

```bash
node ingest.mjs     # reports matched / unmatched, block counts per article
node build.mjs      # 184 pages
node check.mjs      # links, JSON-LD, heading order, a11y
```

`ingest.mjs` never invents content: a file it cannot confidently match to a known
article is reported and skipped rather than guessed at.
