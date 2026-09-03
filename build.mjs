#!/usr/bin/env node
/**
 * THE ONSET — static build.
 *
 * Emits real server-rendered HTML to dist/. No framework, no dependencies, no
 * hydration: everything load-bearing, including all structured data, is in the
 * initial payload of every page. That is the brief's precondition for GEO, and it
 * is easiest to prove by simply not having a client render step.
 *
 *   node build.mjs          build to dist/
 *   node build.mjs --serve  build, then serve dist/ on :4173
 */

import { mkdir, writeFile, rm, cp, readFile } from 'node:fs/promises';
import { dirname, join, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

import { DEPARTMENTS } from './src/data/departments.mjs';
import { HUB } from './src/data/site.mjs';
import * as T from './src/lib/taxonomy.mjs';
import { tickerCss } from './src/components/ticker.mjs';

import { meHome } from './src/pages/me-home.mjs';
import { hubHome } from './src/pages/hub-home.mjs';
import { seriesPage } from './src/pages/series.mjs';
import { departmentPage } from './src/pages/department.mjs';
import { detailPage } from './src/pages/detail.mjs';
import { episodePage } from './src/pages/episode.mjs';
import { topicPage } from './src/pages/topic.mjs';
import { archivePages, archivePage } from './src/pages/archive.mjs';
import { notesPage } from './src/pages/notes.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const DIST = join(ROOT, 'dist');
const SRC = join(ROOT, 'src');

/**
 * --no-brand-fonts: omit the ME-licensed Leitura faces and fall back to the serif
 * stack the Storybook token itself declares (Georgia, Times New Roman, serif).
 * Used for the public preview deploy, where shipping licensed brand fonts would
 * put them outside ME's licence. The local build keeps the real faces.
 */
const BRAND_FONTS = !process.argv.includes('--no-brand-fonts');

let count = 0;
async function emit(relPath, htmlStr) {
  const out = join(DIST, relPath);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, htmlStr, 'utf8');
  count++;
}

async function build() {
  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  // ---- assets ----
  await cp(join(SRC, 'assets'), join(DIST, 'assets'), {
    recursive: true,
    filter: (src) => BRAND_FONTS || !src.includes(`${sep}fonts`),
  });
  // The ticker's own styles live with the component; append them to the built sheet
  // so there is one stylesheet request and no chance of the two drifting apart.
  const css = await readFile(join(SRC, 'assets', 'onset.css'), 'utf8');
  await writeFile(join(DIST, 'assets', 'onset.css'), css + '\n' + tickerCss, 'utf8');

  if (!BRAND_FONTS) {
    // Strip the @font-face rules rather than leaving them to 404. The declared
    // fallback in --font-serif then applies cleanly.
    let tokens = await readFile(join(DIST, 'assets', 'tokens.css'), 'utf8');
    tokens = tokens.replace(/@font-face \{[^}]*\}\n?/g, '');
    tokens = tokens.replace(
      '/* ---------- Leitura News (display serif — ME web + print) ----------',
      '/* ---------- BRAND FACES OMITTED IN THIS BUILD ----------\n   Built with --no-brand-fonts: the ME-licensed Leitura News and Leitura Headline\n   faces are not shipped here. Type falls back to the stack the Storybook token\n   itself declares — Georgia, Times New Roman, serif. Run a local build without\n   the flag to see the real faces.\n   ----------------------------------------------------------');
    await writeFile(join(DIST, 'assets', 'tokens.css'), tokens, 'utf8');
  }

  // ---- 2g: montefioreeinstein.org homepage ----
  await emit('index.html', meHome());

  // ---- 2a: hub home ----
  await emit('the-onset/index.html', hubHome());

  // ---- 2b: The Balance series page ----
  await emit('the-onset/the-balance/index.html', seriesPage());

  // ---- 2d: department pages. ONE TEMPLATE, twelve renderings. ----
  for (const d of DEPARTMENTS) await emit(`the-onset/${d.slug}/index.html`, departmentPage(d));

  // ---- 2e: topic pages ----
  for (const t of T.TOPICS) await emit(`the-onset/topics/${t.slug}/index.html`, topicPage(t));

  // ---- 2c + 2f: every item gets a real detail page, so nothing dead-ends ----
  for (const item of T.CATALOG) {
    const path = `${T.itemPath(item).replace(/^\/|\/$/g, '')}/index.html`;
    await emit(path, item.kind === 'episode' ? episodePage(item) : detailPage(item));
  }

  // ---- archive, numbered pagination, each page a stable citable URL ----
  const pages = archivePages();
  for (const p of pages) {
    await emit(p.n === 1 ? 'the-onset/archive/index.html' : `the-onset/archive/page/${p.n}/index.html`, archivePage(p));
  }

  // ---- build notes ----
  await emit('notes.html', notesPage());

  // ---- robots.txt: the AI-search crawlers the GEO goal serves, explicitly ----
  await writeFile(join(DIST, 'robots.txt'), ROBOTS, 'utf8');

  // ---- sitemap ----
  await writeFile(join(DIST, 'sitemap.xml'), sitemap(pages.length), 'utf8');

  console.log(`✓ ${count} pages → dist/${BRAND_FONTS ? '' : '  (brand faces omitted)'}`);
  console.log(`  ${T.CATALOG.length} catalog items · ${DEPARTMENTS.length} departments · ${pages.length} archive pages`);
}

// Crawler access for the AI-search crawlers, not only Googlebot. The brief lists
// these by name as a foundational requirement.
const ROBOTS = `# ${HUB.name} — PROTOTYPE. Every page also carries a noindex meta tag.
# On the live build, remove the blanket Disallow below and keep the allowances.

User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: PerplexityBot
User-agent: Google-Extended
User-agent: Googlebot
User-agent: Bingbot
Allow: /the-onset/

User-agent: *
Disallow: /
`;

const sitemap = (archiveCount) => {
  const urls = [
    `${HUB.path}/`,
    `${T.seriesPath()}`,
    ...DEPARTMENTS.map((d) => T.deptPath(d.slug)),
    ...T.TOPICS.map((t) => T.topicPath(t.slug)),
    ...T.CATALOG.map((i) => T.itemPath(i)),
    T.archivePath(),
    ...Array.from({ length: archiveCount - 1 }, (_, i) => `${T.archivePath()}page/${i + 2}/`),
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.w3.org/1999/xhtml/sitemap" xmlns:x="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${HUB.origin}${u}</loc></url>`).join('\n')}
</urlset>
`;
};

await build();

// ---- optional dev server ----
if (process.argv.includes('--serve')) {
  const { createServer } = await import('node:http');
  const { stat, readFile: rf } = await import('node:fs/promises');
  const PORT = Number(process.env.PORT ?? 4173);
  const MIME = {
    '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
    '.otf': 'font/otf', '.ttf': 'font/ttf', '.xml': 'application/xml', '.txt': 'text/plain',
  };
  createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let file = join(DIST, p);
      if ((await stat(file).catch(() => null))?.isDirectory()) file = join(file, 'index.html');
      if (!file.startsWith(DIST)) { res.writeHead(403).end(); return; }
      const body = await rf(file);
      const ext = file.slice(file.lastIndexOf('.'));
      res.writeHead(200, { 'content-type': MIME[ext] ?? 'application/octet-stream' }).end(body);
    } catch {
      res.writeHead(404, { 'content-type': 'text/html' }).end('<h1>404</h1>');
    }
  }).listen(PORT, () => console.log(`→ http://localhost:${PORT}/`));
}
