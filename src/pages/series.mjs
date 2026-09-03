// SCREEN 2b — The Balance series page.
// Seasons are the organising unit, not dates: a season lands at once, so
// "most recent" is meaningless. Each season is its own three-up block on the same
// grid as every other module in this direction.

import { html, esc } from '../lib/html.mjs';
import { page, masthead, crumbs, rel } from '../components/chrome.mjs';
import { card, media } from '../components/cards.mjs';
import { HUB } from '../data/site.mjs';
import { SERIES } from '../data/episodes.mjs';
import * as T from '../lib/taxonomy.mjs';
import * as S from '../lib/schema.mjs';

export const seriesPage = () => {
  const r = rel(2);
  const eps = T.ofKind('episode').sort(T.byEpisode);
  const latest = eps[0];
  const trail = [
    { label: 'Montefiore Einstein', href: 'index.html' },
    { label: HUB.name, href: 'the-onset/index.html' },
    { label: SERIES.name },
  ];

  return page({
    title: `${SERIES.fullName} — ${HUB.name} | Montefiore Einstein`,
    description: SERIES.description,
    depth: 2,
    canonical: T.seriesPath(),
    schema: S.graph(
      S.meOrganization(),
      S.hubCollection(),
      S.seriesGraph(eps),
      S.faqPage(SERIES.faqs),
      S.breadcrumbs([
        { label: 'Montefiore Einstein', href: '/' },
        { label: HUB.name, href: `${HUB.path}/` },
        { label: SERIES.name },
      ]),
    ),
    children: html`
${masthead(r)}
${crumbs(trail, r)}
<main id="main">

  <!-- The series takes the offset hero established on the hub home — a 4:3 still
       beside the definition, rather than a title band. One pattern opens every
       page in this set. -->
  <section class="mod" aria-labelledby="series-h">
    <div class="wrap">
      <div class="hero">
        <div class="hero__media">${media({ kind: 'episode', slug: 'series', title: SERIES.name }, '4x3', 'Series still')}</div>
        <div class="hero__body">
          <p class="meta">
            <span class="meta__type">Video series</span>
            <span class="sep" aria-hidden="true">·</span><span>Two seasons</span>
            <span class="sep" aria-hidden="true">·</span><span>13 episodes</span>
          </p>
          <h1 class="hero__title" id="series-h">${esc(SERIES.fullName)}</h1>
          <p class="hero__stand answer-first">${esc(SERIES.description)}</p>
          <div class="hero__action">
            <a class="btn" href="${r}the-onset/${esc(latest.dept)}/${esc(latest.slug)}/index.html">Watch the latest episode <span aria-hidden="true">→</span></a>
            <p class="byline"><strong>Every episode transcribed</strong><br>The transcript promise sits in the hero because it is what makes the series citable.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  ${SERIES.seasons.map((season) => {
    const list = eps.filter((e) => e.season === season.number);
    const shown = list.slice(0, 3);
    return html`
    <section class="mod" aria-labelledby="season-${season.number}">
      <div class="wrap">
        <div class="mod__bar">
          <h2 class="mod__h" id="season-${season.number}">Season ${season.number}</h2>
          <span class="mod__spacer"></span>
          <p class="mod__note">${esc(season.note)}</p>
        </div>
        <div class="row row--3">${shown.map((e) => card(e, r, { size: 'card--sm' }))}</div>
        ${list.length > 3 ? html`
          <div class="row row--3" style="margin-top:var(--row-gap)">
            ${list.slice(3).map((e) => card(e, r, { size: 'card--sm' }))}
          </div>` : ''}
      </div>
    </section>`;
  })}

  <!-- Series-level FAQPage. Without it the page is a grid of stills and gets cited
       by nothing. -->
  <section class="mod" aria-labelledby="series-qa">
    <div class="wrap">
      <div class="qa">
        <h2 class="mod__h" id="series-qa">Common questions about the series</h2>
        ${SERIES.faqs.map((f) => html`
          <div class="qa__item">
            <h3 class="qa__q">${esc(f.q)}</h3>
            <p class="qa__a">${esc(f.a)}</p>
          </div>`)}
      </div>
      <div class="hero__action" style="margin-top:var(--space-32)">
        <a class="btn btn--ghost" href="${r}the-onset/index.html"><span aria-hidden="true">←</span> Back to ${esc(HUB.name)}</a>
        <a class="btn btn--ghost" href="${r}the-onset/archive/index.html">Open the archive <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>

</main>`,
  });
};
