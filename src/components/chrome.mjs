import { html, esc } from '../lib/html.mjs';
import { jsonld } from '../lib/html.mjs';
import { HUB, ME_NAV, CREDENTIALS } from '../data/site.mjs';
import { DEPARTMENTS } from '../data/departments.mjs';
import { deptPath, archivePath, seriesPath } from '../lib/taxonomy.mjs';

/** Relative depth prefix so the build works from any directory, including file://. */
export const rel = (depth) => (depth === 0 ? './' : '../'.repeat(depth));

/**
 * The page shell.
 * Everything load-bearing — copy, headings, schema — is in this initial payload.
 * There is no hydration step and no fetch-on-load for citable text.
 */
export const page = ({
  title, description, depth = 0, canonical, lang = 'en', hreflang = null,
  schema = null, bodyClass = '', head = '', children,
}) => {
  const r = rel(depth);
  return `<!DOCTYPE html>
<html lang="${esc(lang)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
${canonical ? `<link rel="canonical" href="${esc(HUB.origin + canonical)}">` : ''}
${hreflang ? hreflang.map((h) => `<link rel="alternate" hreflang="${esc(h.lang)}" href="${esc(h.href)}">`).join('\n') : ''}
<meta property="og:site_name" content="${esc(HUB.name)} — ${esc(HUB.publisher)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta name="robots" content="noindex, nofollow"><!-- PROTOTYPE ONLY. Never ships. -->
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' fill='%23003769'/%3E%3Ctext x='16' y='23' font-family='Georgia,serif' font-size='20' fill='%23fff' text-anchor='middle'%3EO%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="${r}assets/tokens.css">
<link rel="stylesheet" href="${r}assets/onset.css">
${schema ? jsonld(schema) : ''}
${head}
</head>
<body class="me ${bodyClass}">
<a class="skip" href="#main">Skip to content</a>
${protoBanner(r)}
${meBar(r)}
${children}
${footer(r)}
</body>
</html>
`;
};

const protoBanner = (r) => html`
<div class="proto">
  <div class="wrap">
    <span><strong>Prototype</strong> — ${esc(HUB.name)} is a working title; hub name is an open Loreen/Les decision. Photography, bylines and the full LoHud archive are placeholders.</span>
    <a href="${r}notes.html">Build notes &amp; decisions →</a>
  </div>
</div>`;

const meBar = (r) => html`
<div class="me-bar">
  <div class="wrap">
    <a class="me-bar__brand" href="${r}index.html">Montefiore Einstein</a>
    <nav class="me-bar__nav" aria-label="Montefiore Einstein">
      ${ME_NAV.map((n) => `<a href="${n.href}">${esc(n.label)}</a>`)}
      <a href="${r}the-onset/index.html">${esc(HUB.name)}</a>
      <a href="${r}the-onset/archive/index.html">Search</a>
    </nav>
  </div>
</div>`;

/** Hub masthead — the publication identity. Constant across every surface so the
 *  human and the machine learn one entity. */
export const masthead = (r, { current = null, showSearch = true, isHubHome = false } = {}) => html`
<header class="masthead">
  <div class="wrap">
    <div class="masthead__row">
      <div>
        ${isHubHome
          /* The publication title is the page's h1 only on the hub home. On every
             other page the page's own subject owns the h1, and the masthead is a
             branded link — so no page ever carries two h1s. */
          ? `<h1 class="masthead__title"><a href="${r}the-onset/index.html">${esc(HUB.name)}</a></h1>`
          : `<p class="masthead__title"><a href="${r}the-onset/index.html">${esc(HUB.name)}</a></p>`}
        <p class="masthead__stand">${esc(HUB.standfirst)}</p>
      </div>
      ${showSearch ? searchForm(r) : ''}
    </div>
  </div>
</header>
${deptRail(r, current)}`;

export const searchForm = (r, value = '') => html`
<form class="search" role="search" action="${r}the-onset/archive/index.html" method="get">
  <label class="vh" for="q">Search all stories and episodes</label>
  <input id="q" name="q" type="search" value="${esc(value)}" placeholder="Search all stories and episodes" autocomplete="off">
  <button type="submit"><span aria-hidden="true">⌕</span><span class="vh">Search</span></button>
</form>`;

export const deptRail = (r, current) => html`
<nav class="rail" aria-label="Departments">
  <div class="wrap">
    <ul>
      ${DEPARTMENTS.map((d) => html`
        <li><a href="${r}the-onset/${d.slug}/index.html"${current === d.slug ? ' aria-current="page"' : ''}>${esc(d.label)}</a></li>`)}
      <li><a class="rail__all" href="${r}the-onset/archive/index.html">Browse all <span aria-hidden="true">→</span></a></li>
    </ul>
  </div>
</nav>`;

/** Breadcrumbs. Visible trail and BreadcrumbList schema are generated from the same
 *  array, so they can never drift apart. */
export const crumbs = (trail, r) => html`
<nav class="crumbs" aria-label="Breadcrumb">
  <div class="wrap">
    <ol>
      ${trail.map((c, i) => html`
        <li>${i > 0 ? '<span aria-hidden="true">›</span> ' : ''}${
          c.href ? `<a href="${r}${c.href}">${esc(c.label)}</a>` : `<span aria-current="page">${esc(c.label)}</span>`
        }</li>`)}
    </ol>
  </div>
</nav>`;

const footer = (r) => html`
<footer class="foot">
  <div class="wrap">
    <div class="foot__grid">
      <div>
        <h2 class="foot__h">${esc(HUB.name)}</h2>
        <p class="foot__cred">${esc(HUB.tagline)} A publication of <strong>Montefiore Einstein</strong>.</p>
        ${CREDENTIALS.map((c) => `<p class="foot__cred"><strong>${esc(c.label)}</strong> — ${esc(c.source)}</p>`)}
      </div>
      <div>
        <h2 class="foot__h">Browse</h2>
        <ul>
          <li><a href="${r}the-onset/index.html">Hub home</a></li>
          <li><a href="${r}the-onset/archive/index.html">The archive</a></li>
          <li><a href="${r}the-onset/the-balance/index.html">The Balance</a></li>
          <li><a href="${r}the-onset/topics/nutrition/index.html">Nutrition</a></li>
        </ul>
      </div>
      <div>
        <h2 class="foot__h">Montefiore Einstein</h2>
        <ul>
          <li><a href="https://www.montefioreeinstein.org/">montefioreeinstein.org</a></li>
          <li><a href="https://www.montefioreeinstein.org/news/">Newsroom</a></li>
          <li><a href="https://www.montefioreeinstein.org/doctors/">Find a doctor</a></li>
        </ul>
      </div>
    </div>
    <p class="foot__legal">
      Prototype build for internal review. Content is representative sample data pending the certified LoHud crawl;
      photography is not commissioned; physician bylines are placeholders. Credentials shown are cited to their sources.
      Not for public distribution.
    </p>
  </div>
</footer>`;
