// THE ARCHIVE — the centralised, searchable destination holding both feeds in full.
//
// Not one of wireframe v2's seven screens, but every screen in the set links into it
// and the brief devotes a full section to its behaviour. Built to that spec, on this
// direction's card language.
//
// GEO choice: NUMBERED PAGINATION, not Load More. Each page is a stable, citable URL
// and is server-rendered — the stronger choice for GEO and for an older audience.
// (The brief flags "which comp revision board is authoritative" as open; this build
// takes the numbered-pagination side and says so.)
//
// Filters, sort and search are progressive enhancement over the server-rendered
// list. Filter state is a query parameter and carries noindex, so no facet
// combination ever becomes a competing indexable URL.

import { html, esc } from '../lib/html.mjs';
import { page, masthead, crumbs, rel, searchForm } from '../components/chrome.mjs';
import { card, itemHref } from '../components/cards.mjs';
import { HUB } from '../data/site.mjs';
import { DEPARTMENTS } from '../data/departments.mjs';
import { PILLARS } from '../data/pillars.mjs';
import * as T from '../lib/taxonomy.mjs';
import * as S from '../lib/schema.mjs';

export const PER_PAGE = 12;

export const archivePages = () => {
  const items = [...T.CATALOG].sort(T.byDate);
  const pages = Math.ceil(items.length / PER_PAGE);
  return Array.from({ length: pages }, (_, i) => ({
    n: i + 1,
    total: pages,
    items: items.slice(i * PER_PAGE, (i + 1) * PER_PAGE),
    all: items,
  }));
};

export const archivePage = ({ n, total, items, all }) => {
  const depth = n === 1 ? 2 : 4;                 // /the-onset/archive/ | /the-onset/archive/page/N/
  const r = rel(depth);
  const path = n === 1 ? T.archivePath() : `${T.archivePath()}page/${n}/`;
  const pageUrl = (k) => (k === 1 ? `${r}the-onset/archive/index.html` : `${r}the-onset/archive/page/${k}/index.html`);

  const trail = [
    { label: 'Montefiore Einstein', href: 'index.html' },
    { label: HUB.name, href: 'the-onset/index.html' },
    { label: n === 1 ? 'Archive' : `Archive — page ${n}` },
  ];

  const counts = {
    article: T.ofKind('article').length,
    recipe: T.ofKind('recipe').length,
    journey: T.ofKind('journey').length,
    episode: T.ofKind('episode').length,
  };

  return page({
    title: `Archive${n > 1 ? ` — page ${n}` : ''} — ${HUB.name} | Montefiore Einstein`,
    description: `Every story and every episode on ${HUB.name}, filterable by department, pillar, content type, language and season.`,
    depth,
    canonical: path,
    schema: S.graph(
      S.meOrganization(),
      S.hubCollection(),
      {
        '@type': 'CollectionPage',
        '@id': `${S.abs(path)}#page`,
        name: `${HUB.name} archive${n > 1 ? `, page ${n}` : ''}`,
        url: S.abs(path),
        isPartOf: { '@id': S.HUB_ID },
        publisher: { '@id': S.ME_ID },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: all.length,
          itemListElement: items.map((it, i) => ({
            '@type': 'ListItem', position: (n - 1) * PER_PAGE + i + 1,
            url: S.abs(T.itemPath(it)), name: it.title,
          })),
        },
      },
      S.breadcrumbs([
        { label: 'Montefiore Einstein', href: '/' },
        { label: HUB.name, href: `${HUB.path}/` },
        { label: 'Archive' },
      ]),
    ),
    head: `
${n > 1 ? `<link rel="prev" href="${esc(HUB.origin + (n === 2 ? T.archivePath() : `${T.archivePath()}page/${n - 1}/`))}">` : ''}
${n < total ? `<link rel="next" href="${esc(`${HUB.origin}${T.archivePath()}page/${n + 1}/`)}">` : ''}
<script>window.__ONSET_DATA__ = ${JSON.stringify(all.map(slim))};</script>
<script src="${r}assets/archive.js" defer></script>`,
    children: html`
${masthead(r, { showSearch: false })}
${crumbs(trail, r)}
<main id="main">

  <section class="mod mod--tight" aria-labelledby="arch-h">
    <div class="wrap">
      <div class="mod__bar">
        <h1 class="mod__h" id="arch-h">The archive</h1>
        <span class="mod__spacer"></span>
        <p class="mod__note">
          ${counts.article} articles · ${counts.recipe} recipes · ${counts.journey} patient journeys · ${counts.episode} episodes
        </p>
      </div>

      <div style="max-width:560px;margin-bottom:var(--space-28)">
        ${searchForm(r)}
        <p class="mod__note" style="margin-top:var(--space-8)">
          Search runs across both feeds. Results carry a content-type badge, department, date and language.
        </p>
      </div>

      <!-- FACETS — orthogonal and combinable. Every facet state is a query
           parameter, rel="nofollow", and the page carries noindex when filtered. -->
      <div class="facets" data-facets>
        <div class="chips chips--tap" data-facet="dept" role="group" aria-label="Filter by department">
          <span class="chips__label">Department:</span>
          ${DEPARTMENTS.map((d) => `<button type="button" class="chip" data-val="${esc(d.slug)}" aria-pressed="false">${esc(d.label)}</button>`)}
        </div>
        <div class="chips chips--tap" data-facet="pillar" role="group" aria-label="Filter by editorial pillar">
          <span class="chips__label">Pillar:</span>
          ${PILLARS.map((p) => `<button type="button" class="chip" data-val="${esc(p.slug)}" aria-pressed="false">${esc(p.label)}</button>`)}
        </div>
        <div class="chips chips--tap" data-facet="type" role="group" aria-label="Filter by content type">
          <span class="chips__label">Type:</span>
          <button type="button" class="chip" data-val="article" aria-pressed="false">Article</button>
          <button type="button" class="chip" data-val="recipe" aria-pressed="false">Recipe</button>
          <button type="button" class="chip" data-val="journey" aria-pressed="false">Patient Journey</button>
          <button type="button" class="chip" data-val="episode" aria-pressed="false">The Balance</button>
        </div>
        <div class="chips chips--tap" data-facet="lang" role="group" aria-label="Filter by language">
          <span class="chips__label">Language:</span>
          <button type="button" class="chip" data-val="en" aria-pressed="false">English</button>
          <button type="button" class="chip" data-val="es" aria-pressed="false">Español</button>
        </div>
        <div class="chips chips--tap" data-facet="season" role="group" aria-label="Filter by season (The Balance only)">
          <span class="chips__label">Season:</span>
          <button type="button" class="chip" data-val="1" aria-pressed="false">Season 1</button>
          <button type="button" class="chip" data-val="2" aria-pressed="false">Season 2</button>
        </div>
        <div class="chips chips--tap" data-facet="flag" role="group" aria-label="Filter by curation">
          <span class="chips__label">Curated:</span>
          <button type="button" class="chip" data-val="featured" aria-pressed="false">Our Picks</button>
        </div>
      </div>

      <div class="mod__bar" style="margin-top:var(--space-24)">
        <p class="pos" data-count aria-live="polite">
          Showing ${items.length} of ${all.length} items · page ${n} of ${total}
        </p>
        <span class="mod__spacer"></span>
        <label class="mod__note" for="sort">Sort:</label>
        <select id="sort" class="ctrl" data-sort>
          <option value="recent">Most recent</option>
          <option value="oldest">Oldest</option>
          <option value="season">By season (The Balance)</option>
          <option value="dept">A–Z by department</option>
        </select>
        <div class="ctrl__group" data-arch-view>
          <button type="button" class="ctrl" data-view="grid" aria-pressed="true"><span aria-hidden="true">▦</span> Grid<span class="vh"> view</span></button>
          <button type="button" class="ctrl" data-view="list" aria-pressed="false"><span aria-hidden="true">☰</span> List<span class="vh"> view</span></button>
        </div>
        <button type="button" class="ctrl" data-reset hidden>Reset filters</button>
      </div>

      <!-- Server-rendered results. JavaScript replaces the contents in place; with
           JavaScript off this list and the numbered pages below are the archive. -->
      <h2 class="vh">Results</h2>
      <div class="row row--3" data-results style="margin-top:var(--space-32)">
        ${items.map((it) => card(it, r, { size: 'card--sm' }))}
      </div>

      <!-- No-results state: plain language, suggested departments, and a reset.
           Never a dead end. -->
      <div data-empty hidden style="margin-top:var(--space-32)">
        <h2 class="mod__h">Nothing matched that</h2>
        <p class="prose" style="margin-block:var(--space-12) var(--space-20)">
          No stories or episodes match the filters you have set. Try removing one, or start from a department:
        </p>
        <div class="chips chips--tap">
          ${DEPARTMENTS.slice(0, 5).map((d) => `<a class="chip" href="${r}the-onset/${esc(d.slug)}/index.html">${esc(d.label)}</a>`)}
        </div>
        <p style="margin-top:var(--space-20)"><button type="button" class="btn" data-reset-2>Clear all filters</button></p>
      </div>

      <!-- Error state, shown only if the client filter fails. The server-rendered
           list stays on the page underneath — never a dead archive. -->
      <div data-error hidden style="margin-top:var(--space-32)">
        <p class="prose">Filtering is unavailable right now. The full archive is still below, and the numbered pages still work.</p>
      </div>
    </div>
  </section>

  <!-- NUMBERED PAGINATION — each page a stable, citable URL. -->
  <nav class="mod mod--tight" aria-label="Archive pages" data-pagination>
    <div class="wrap">
      <div class="ctrl__group" style="flex-wrap:wrap">
        ${n > 1 ? `<a class="ctrl" href="${pageUrl(n - 1)}" rel="prev"><span aria-hidden="true">‹</span> Previous</a>` : ''}
        ${Array.from({ length: total }, (_, i) => i + 1).map((k) =>
          k === n
            ? `<span class="ctrl" aria-current="page" aria-label="Page ${k}, current page">${k}</span>`
            : `<a class="ctrl" href="${pageUrl(k)}" aria-label="Page ${k}">${k}</a>`)}
        ${n < total ? `<a class="ctrl" href="${pageUrl(n + 1)}" rel="next">Next <span aria-hidden="true">›</span></a>` : ''}
      </div>
    </div>
  </nav>

</main>`,
  });
};

/** Trimmed item shape for the client filter. */
const slim = (i) => ({
  t: i.title, u: T.itemPath(i), k: i.kind, d: i.dept, p: i.pillars ?? [],
  sd: i.secondaryDepts ?? [], dt: i.updated, m: i.minutes, es: !!i.es,
  f: !!i.featured, s: i.season ?? null, e: i.episode ?? null,
  b: i.byline?.name ?? '', st: i.standfirst ?? '', tp: i.topic ?? '',
});
