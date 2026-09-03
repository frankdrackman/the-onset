// SCREEN 2a — Hub home. The offset hero on white, three-up rows beneath.
// The Balance is matched to the same rhythm so the two modules read as one system
// on a shared grid rather than two unrelated shelves.

import { html, esc } from '../lib/html.mjs';
import { page, masthead, rel } from '../components/chrome.mjs';
import { card, journeyBand, shelfCard } from '../components/cards.mjs';
import { ticker } from '../components/ticker.mjs';
import { HUB } from '../data/site.mjs';
import { SERIES } from '../data/episodes.mjs';
import * as T from '../lib/taxonomy.mjs';
import * as S from '../lib/schema.mjs';

export const hubHome = () => {
  const r = rel(1);
  const latest = T.theLatest(8);
  const balance = T.ofKind('episode').sort(T.byEpisode).slice(0, 3);
  const journey = T.ofKind('journey').sort(T.byDate)[0];
  const otherJourneys = T.ofKind('journey').sort(T.byDate).slice(1, 3);
  const shelves = T.shelves(3, 4);
  const total = T.CATALOG.length;

  return page({
    title: `${HUB.name} — ${HUB.tagline} | Montefiore Einstein`,
    description: HUB.standfirst,
    depth: 1,
    canonical: `${HUB.path}/`,
    schema: S.graph(
      S.meOrganization(),
      S.hubCollection(),
      S.breadcrumbs([{ label: 'Montefiore Einstein', href: '/' }, { label: HUB.name }]),
    ),
    head: `<script src="${r}assets/ticker.js" defer></script>`,
    children: html`
${masthead(r, { isHubHome: true })}
<main id="main">

  ${ticker(latest, r, { heading: 'The Latest', id: 'latest' })}

  <!-- THE BALANCE — same grid, same rhythm, same card language as The Latest.
       Two streams are never merged: articles arrive weekly, a Balance season
       arrives all at once and then goes quiet. -->
  <section class="mod" aria-labelledby="balance-h">
    <div class="wrap">
      <div class="mod__bar">
        <p class="eyebrow">Video series</p>
        <h2 class="mod__h" id="balance-h">${esc(SERIES.fullName)}</h2>
        <span class="mod__spacer"></span>
        <p class="pos"><strong>Season 2 · new</strong></p>
        <a class="seeall" href="${r}the-onset/the-balance/index.html">All 13 episodes <span aria-hidden="true">→</span></a>
      </div>
      <div class="row row--3">
        ${balance.map((e) => card(e, r, { ratio: '16x9', size: 'card--sm' }))}
      </div>
      <p class="mod__note" style="margin-top:var(--space-20)">
        Showing 3 of 7 episodes in Season 2. Ordered by episode, not date — a season is a set.
      </p>
    </div>
  </section>

  <!-- PATIENT JOURNEYS — the signature module, and the page's only dark field. -->
  <section class="mod" aria-labelledby="journeys-h">
    <div class="wrap">
      <div class="mod__bar">
        <h2 class="mod__h" id="journeys-h">Patient Journeys</h2>
        <span class="mod__spacer"></span>
        <p class="mod__note">A real person, a named clinician, a fuller life</p>
        <a class="seeall" href="${r}the-onset/archive/index.html?type=journey">All journeys <span aria-hidden="true">→</span></a>
      </div>
      ${journeyBand(journey, r)}
      <div class="row row--2" style="margin-top:var(--space-40)">
        ${otherJourneys.map((j) => card(j, r, { ratio: '3x2', size: 'card--sm' }))}
      </div>
    </div>
  </section>

  <!-- DEPARTMENT SHELVES — named, themed magazine sections, each a mini-hub. -->
  <div class="wrap">
    ${shelves.map((s) => html`
      <section class="shelf" aria-labelledby="shelf-${s.slug}">
        <div class="shelf__bar">
          <h2 class="shelf__h" id="shelf-${s.slug}">
            <a href="${r}the-onset/${s.slug}/index.html">${esc(s.label)}</a>
          </h2>
          <a class="seeall" href="${r}the-onset/${s.slug}/index.html">All ${esc(s.label)} (${s.total}) <span aria-hidden="true">→</span></a>
        </div>
        <div class="row row--4">${s.items.map((it) => shelfCard(it, r))}</div>
      </section>`)}
    <p class="mod__note" style="padding-block:var(--space-24)">
      Further department shelves follow the same template. Departments with no tagged items get no shelf — zero-item sections are hidden, never padded.
    </p>
  </div>

  <!-- ARCHIVE STRIP -->
  <section class="strip" aria-labelledby="archive-h">
    <div class="wrap">
      <h2 class="strip__h" id="archive-h">Browse everything</h2>
      <p>All ${T.ofKind('article').length + T.ofKind('recipe').length + T.ofKind('journey').length} stories and all 13 episodes — filter by department, pillar, type, language and season.</p>
      <a class="btn" href="${r}the-onset/archive/index.html">Open the archive <span aria-hidden="true">→</span></a>
    </div>
  </section>

</main>`,
  });
};
