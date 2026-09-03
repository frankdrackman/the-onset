#!/usr/bin/env node
/**
 * INGEST — turn saved article pages into the hub's body copy.
 *
 * The retrieval half of this is yours: lohud.com's robots.txt disallows automated
 * agents, so this build never fetches from it. You open the pages; this reads
 * whatever you save.
 *
 *   1. Save each article from ingest/NEEDED.md into ingest/pages/
 *      Any of these works:
 *        · Cmd-S → "Web Page, HTML Only"  →  <anything>.html
 *        · Select all → copy → paste into  →  <anything>.txt
 *        · Reader mode → print to PDF is NOT read; use text or HTML.
 *      Name the file after the article's slug if you can (best match), otherwise
 *      the matcher falls back to the URL or the headline found inside.
 *
 *   2. node ingest.mjs        → writes src/data/bodies.mjs
 *   3. node build.mjs         → the bodies appear on the detail pages
 *
 * Nothing is invented: a file that cannot be matched to a known article is
 * reported and skipped, and paragraphs that look like site furniture are dropped.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, dirname, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ITEMS } from './src/data/articles.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const PAGES = join(ROOT, 'ingest', 'pages');

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const bySlug = new Map(ITEMS.map((i) => [i.slug, i]));
const byId = new Map(ITEMS.map((i) => [(/\/(\d+)\/?$/.exec(i.lohudUrl || '') || [])[1], i]).filter(([k]) => k));
const byTitle = new Map(ITEMS.map((i) => [norm(i.title), i]));

/** Strip a saved HTML page down to its article paragraphs. */
function fromHtml(html) {
  let s = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ');
  // Prefer an <article> or the Gannett body container when present.
  const m = /<article[\s\S]*?<\/article>/i.exec(s) || /<div[^>]+class="[^"]*(?:gnt_ar_b|article-body|story-body)[^"]*"[\s\S]*?<\/div>\s*<\/div>/i.exec(s);
  if (m) s = m[0];
  const paras = [];
  for (const p of s.matchAll(/<(p|h2|h3)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
    const tag = p[1].toLowerCase();
    const text = p[2].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&').replace(/&#39;|&rsquo;/g, '’').replace(/&quot;/g, '"')
      .replace(/&mdash;/g, '—').replace(/&ldquo;/g, '“').replace(/&rdquo;/g, '”')
      .replace(/\s+/g, ' ').trim();
    if (text) paras.push({ tag, text });
  }
  return paras;
}

/** Plain text: blank-line separated paragraphs; a short line with no full stop is a heading. */
function fromText(txt) {
  return txt.split(/\n\s*\n/).map((b) => b.replace(/\s+/g, ' ').trim()).filter(Boolean)
    .map((text) => ({ tag: text.length < 80 && !/[.!?]$/.test(text) ? 'h2' : 'p', text }));
}

const JUNK = /^(advertisement|sign up|subscribe|share this|read more|more:|related:|follow us|this content is|paid (for )?by|sponsored by|view comments|story from)/i;

// A byline line: "Name, MD, <role>, for Montefiore Einstein" — sometimes "By Name...".
const BYLINE = /^(?:By\s+)?([A-Z][A-Za-z.'’\-]+(?:\s+[A-Z]\.?)?(?:\s+[A-Z][A-Za-z.'’\-]+){0,3}),\s*((?:MD|DO|PhD|RD|RDN|MS|MSc|MPH|CDN|CNSC|FACC|FHRS|FACOG|NP|PA)[A-Za-z0-9.,&\-\/\s]*?),?\s*(?:for\s+Montefiore\s+Einstein)\.?$/;

// The article's own link to its Spanish twin.
const ES = /^EN\s+ESPA(?:\u00d1|N\u0303)OL:\s*(.+)$/i;

// Closing appointment/CTA furniture — real ME copy, but page chrome, not article body.
const CTA = /(?:call\s*\(\d{3}\)|to (?:make|schedule) an appointment|learn more (?:at|about)|find a doctor|visit\s+montefiore)/i;

async function run() {
  let files = [];
  try { files = (await readdir(PAGES)).filter((f) => /\.(html?|txt)$/i.test(f)); }
  catch { console.log('No ingest/pages directory yet — create it and drop saved articles in.'); }

  if (!files.length) {
    console.log('No saved pages found in ingest/pages/.');
    console.log('See ingest/NEEDED.md for the 29 articles the prototype actually surfaces.');
    return;
  }

  const bodies = {}; const unmatched = [];
  for (const f of files) {
    const raw = (await readFile(join(PAGES, f), 'utf8')).normalize('NFC');
    const isHtml = extname(f).toLowerCase().startsWith('.htm') || /<html|<body|<article/i.test(raw);
    let paras = (isHtml ? fromHtml(raw) : fromText(raw))
      .filter((p) => !JUNK.test(p.text))
      .filter((p) => p.tag !== 'p' || p.text.length > 45);

    // Match the file to a known article: by filename slug, by LoHud id in the file,
    // or by a headline inside it. Never guess.
    const stem = norm(basename(f, extname(f)));
    const idHit = (/lohud\.com\/story\/sponsor-story\/montefiore-health-system\/[\d/]+\/[a-z0-9-]+\/(\d+)/i.exec(raw) || [])[1];
    const titleHit = paras.find((p) => byTitle.has(norm(p.text)));
    const item =
      bySlug.get(stem) ||
      [...bySlug.keys()].filter((s) => stem.includes(s) || s.includes(stem)).map((s) => bySlug.get(s))[0] ||
      byId.get(idHit) ||
      (titleHit ? byTitle.get(norm(titleHit.text)) : null);

    if (!item) { unmatched.push(f); continue; }

    // Drop a leading paragraph that merely repeats the headline.
    if (paras.length && norm(paras[0].text) === norm(item.title)) paras = paras.slice(1);

    // Lift the byline and the Spanish-twin link out of the body — they are metadata
    // the hub renders in its own furniture, not article prose.
    let byline = null, spanish = null;
    paras = paras.filter((p) => {
      const b = BYLINE.exec(p.text);
      if (b && !byline) {
        byline = { name: `${b[1]}, ${b[2].replace(/[,\s]+$/, '')}`, role: b[2].replace(/[,\s]+$/, '') };
        return false;
      }
      const e = ES.exec(p.text);
      if (e && !spanish) { spanish = { title: e[1].trim() }; return false; }
      return true;
    });

    // Trim closing CTA blocks from the tail only — the same words mid-article are
    // usually genuine copy.
    while (paras.length && CTA.test(paras[paras.length - 1].text)) paras.pop();

    if (paras.length < 2) { unmatched.push(`${f} (too little text extracted)`); continue; }
    bodies[item.slug] = { source: f, ...(byline ? { byline } : {}), ...(spanish ? { spanish } : {}), paras };
  }

  const out = `// Article bodies, ingested from saved pages by ingest.mjs.
// NOT fetched: lohud.com disallows automated agents, so these were retrieved by hand
// and parsed here. Slugs key into src/data/articles.mjs.
// Regenerate with: node ingest.mjs

export const BODIES = ${JSON.stringify(bodies, null, 1)};
`;
  await writeFile(join(ROOT, 'src', 'data', 'bodies.mjs'), out, 'utf8');

  const n = Object.keys(bodies).length;
  const withByline = Object.values(bodies).filter((b) => b.byline).length;
  const withEs = Object.values(bodies).filter((b) => b.spanish).length;
  console.log(`✓ ${n} article bod${n === 1 ? 'y' : 'ies'} → src/data/bodies.mjs`);
  console.log(`  ${withByline} carry a byline · ${withEs} carry a Spanish twin`);
  for (const [slug, b] of Object.entries(bodies)) {
    console.log(`   ${b.paras.length.toString().padStart(3)} blocks ${b.byline ? 'B' : ' '}${b.spanish ? 'E' : ' '}  ${slug}`);
  }
  if (unmatched.length) {
    console.log(`\n! could not match ${unmatched.length} file(s) — rename to the article slug:`);
    unmatched.forEach((f) => console.log('   ', f));
  }
  console.log('\nNext: node build.mjs');
}
await run();
