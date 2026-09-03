// SCREEN 2d — Department page. ONE TEMPLATE, twelve renderings.
// Only the bound department tag and entity change; no new design work per department.
//
// Rules enforced here:
//   · Only-its-content. Nothing from another department appears in the body.
//     Cross-cutting lenses appear only filtered to this department.
//   · Thin and empty states. Zero-item sections are HIDDEN, never padded. Two
//     episodes render as two, never padded to three.
//   · The single global cross-promo block is page CHROME, visually distinct.

import { html, esc } from '../lib/html.mjs';
import { page, masthead, crumbs, rel } from '../components/chrome.mjs';
import { card, offsetHero, media } from '../components/cards.mjs';
import { HUB } from '../data/site.mjs';
import * as T from '../lib/taxonomy.mjs';
import * as S from '../lib/schema.mjs';

export const departmentPage = (dept) => {
  const r = rel(2);
  const all = T.surfacingIn(dept.slug);
  const stories = all.filter((i) => i.kind === 'article' || i.kind === 'recipe');
  const episodes = T.episodesIn(dept.slug);
  const journeys = T.journeysIn(dept.slug);
  const feature = T.preferWithStandfirst(stories)[0] ?? all[0];
  const rest = stories.filter((i) => i !== feature);
  const trail = [
    { label: 'Montefiore Einstein', href: 'index.html' },
    { label: HUB.name, href: 'the-onset/index.html' },
    { label: dept.label },
  ];

  return page({
    title: `${dept.label} — ${HUB.name} | Montefiore Einstein`,
    description: dept.intro,
    depth: 2,
    canonical: T.deptPath(dept.slug),
    schema: S.graph(
      S.meOrganization(),
      S.hubCollection(),
      S.departmentPage(dept, all.length),
      S.breadcrumbs(trail.map((c) => ({ label: c.label, href: c.href ? `/${c.href.replace('index.html', '')}` : undefined }))),
    ),
    children: html`
${masthead(r, { current: dept.slug })}
${crumbs(trail, r)}
<main id="main">

  <!-- Offset hero again, so a reader arriving from the hub home recognises the
       page shape immediately. -->
  <section class="mod" aria-labelledby="dept-h">
    <div class="wrap">
      <div class="hero">
        <div class="hero__media">${media({ kind: 'article', slug: dept.slug, title: dept.label }, '4x3', 'Department photograph')}</div>
        <div class="hero__body">
          <p class="meta">
            <span class="meta__type">Department</span>
            <span class="sep" aria-hidden="true">·</span>
            <span>${all.length} item${all.length === 1 ? '' : 's'}</span>
            ${dept.entity ? '' : '<span class="sep" aria-hidden="true">·</span><span>Editorial collection</span>'}
          </p>
          <h1 class="hero__title" id="dept-h">${esc(dept.label)}</h1>
          <!-- Answer-first intro: speakable, server-rendered, the paragraph that can
               win a "what is heart failure" style question. -->
          <p class="hero__stand answer-first">${esc(dept.intro)}</p>
          <div class="hero__action">
            <a class="btn" href="${esc(dept.findCare.url)}">${esc(dept.findCare.label)} <span aria-hidden="true">↗</span></a>
            ${dept.entity ? html`
              <a class="btn btn--ghost" href="${esc(dept.entity.url)}">${esc(dept.entity.name.replace('Montefiore Einstein ', ''))} at Montefiore Einstein <span aria-hidden="true">↗</span></a>` : ''}
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Topic chips FILTER; they do not navigate to a new self-canonical URL.
       Filter state is a query parameter and noindex. -->
  <div class="wrap">
    <div class="mod__bar" style="border-bottom-width:1px;border-bottom-color:var(--color-gray-300)">
      <div class="chips chips--tap">
        <span class="chips__label" id="topic-label">Topic:</span>
        ${dept.topics.map((t) => html`
          <a class="chip" href="${r}the-onset/archive/index.html?dept=${esc(dept.slug)}&amp;q=${encodeURIComponent(t)}" rel="nofollow">${esc(t)}</a>`)}
      </div>
      <span class="mod__spacer"></span>
      <p class="mod__note">Sorted by most recent</p>
    </div>
  </div>

  ${stories.length ? html`
  <section class="mod" aria-labelledby="stories-h">
    <div class="wrap">
      <div class="mod__bar">
        <h2 class="mod__h" id="stories-h">${esc(dept.label)} stories</h2>
        <span class="mod__spacer"></span>
        <p class="pos">${stories.length} item${stories.length === 1 ? '' : 's'}</p>
        <a class="seeall" href="${r}the-onset/archive/index.html?dept=${esc(dept.slug)}">See all in the archive <span aria-hidden="true">→</span></a>
      </div>
      ${feature ? offsetHero(feature, r, { headingLevel: 3 }) : ''}
      ${rest.length ? html`
        <div class="row row--3" style="margin-top:var(--space-48)">
          ${rest.slice(0, 6).map((it) => card(it, r, { size: 'card--sm' }))}
        </div>` : ''}
    </div>
  </section>` : ''}

  <!-- The Balance module appears ONLY where this department has episodes. Two
       render as two — never padded to three. -->
  ${episodes.length ? html`
  <section class="mod" aria-labelledby="dept-balance-h">
    <div class="wrap">
      <div class="mod__bar">
        <h2 class="mod__h" id="dept-balance-h">The Balance in ${esc(dept.label)}</h2>
        <span class="mod__spacer"></span>
        <a class="seeall" href="${r}the-onset/the-balance/index.html">All 13 episodes <span aria-hidden="true">→</span></a>
      </div>
      <div class="row row--3">${episodes.map((e) => card(e, r, { size: 'card--sm' }))}</div>
    </div>
  </section>` : ''}

  <!-- Patient journeys, filtered to THIS department only. -->
  ${journeys.length ? html`
  <section class="mod" aria-labelledby="dept-journeys-h">
    <div class="wrap">
      <div class="mod__bar">
        <h2 class="mod__h" id="dept-journeys-h">${esc(dept.label)} patient journeys</h2>
        <span class="mod__spacer"></span>
        <a class="seeall" href="${r}the-onset/archive/index.html?type=journey&amp;dept=${esc(dept.slug)}">All journeys <span aria-hidden="true">→</span></a>
      </div>
      <div class="row row--3">${journeys.map((j) => card(j, r, { ratio: '3x2', size: 'card--sm' }))}</div>
    </div>
  </section>` : ''}

  ${all.length === 0 ? html`
  <section class="mod">
    <div class="wrap">
      <p class="prose">This department has no tagged content yet. Rather than render an empty page, launch policy is to redirect to the filtered archive — an open build decision in the brief.</p>
      <a class="btn" href="${r}the-onset/archive/index.html?dept=${esc(dept.slug)}">Open the filtered archive <span aria-hidden="true">→</span></a>
    </div>
  </section>` : ''}

  <!-- The ONE permitted exception to only-its-content. It must read as chrome:
       tinted band, visually distinct from the department's own content. -->
  <aside class="tinted" aria-labelledby="crosspromo-h">
    <div class="wrap">
      <h2 class="mod__h" id="crosspromo-h">More from Montefiore Einstein</h2>
      <a class="btn btn--ghost" href="https://www.montefioreeinstein.org/news/">Newsroom <span aria-hidden="true">↗</span></a>
    </div>
  </aside>

</main>`,
  });
};
