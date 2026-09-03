// SCREEN 2g — montefioreeinstein.org homepage. Two streams, the same card language
// as the hub.
//
// TWO STREAMS, NEVER MERGED. Articles arrive weekly; The Balance arrives a season at
// once and then goes quiet. Interleaved, a season drop floods every slot on launch
// day and the series is invisible the rest of the year. At most one crossover: a
// single hero episode may be promoted into Stream 1 on launch day, never the season.

import { html, esc } from '../lib/html.mjs';
import { page, rel } from '../components/chrome.mjs';
import { card } from '../components/cards.mjs';
import { ticker } from '../components/ticker.mjs';
import { HUB } from '../data/site.mjs';
import { SERIES } from '../data/episodes.mjs';
import * as T from '../lib/taxonomy.mjs';
import * as S from '../lib/schema.mjs';

export const meHome = () => {
  const r = rel(0);
  const stream1 = T.theLatest(8).filter((i) => i.kind !== 'episode').slice(0, 8);
  const stream2 = T.ofKind('episode').sort(T.byEpisode).slice(0, 3);

  return page({
    title: 'Montefiore Einstein',
    description: `Montefiore Einstein homepage — prototype showing the two ${HUB.name} streams in place.`,
    depth: 0,
    canonical: '/',
    schema: S.graph(S.meOrganization(), S.hubCollection()),
    head: `<script src="${r}assets/ticker.js" defer></script>`,
    children: html`
<main id="main">
  <h1 class="vh">Montefiore Einstein</h1>

  <section class="mod" aria-label="Homepage hero">
    <div class="wrap">
      <div class="ph ph--21x9 ph--sky" data-label="Existing Montefiore Einstein homepage hero — unchanged" role="img" aria-label="Existing Montefiore Einstein homepage hero, unchanged in this prototype"></div>
      <p class="mod__note" style="margin-top:var(--space-16)">
        The existing homepage hero is untouched. Everything below is what ${esc(HUB.name)} adds.
      </p>
    </div>
  </section>

  <!-- STREAM 1 — the steady article and recipe feed, using the hub home's offset
       hero and three-up so the homepage and the hub read as one property.
       [DDR] The heading carries the HUB name, not "Our Latest on Lohud.com".
       The existing heading names the third-party domain as the entity, which is
       exactly the authority leak the brief's canonical and attribution rules
       close. One name in the nav, both module headings and the hub itself. -->
  ${ticker(stream1, r, {
    heading: `The Latest on ${HUB.name}`,
    id: 'stream1',
    seeAll: 'the-onset/index.html',
    seeAllLabel: `All of ${HUB.name}`,
  })}

  <!-- STREAM 2 — The Balance. Persistent: a module that disappears for four months
       teaches readers the series ended. Two states, one flag — a "new season" badge
       on drop, relaxing after about four weeks to "Catch up on all 13 episodes." -->
  <section class="mod" aria-labelledby="stream2-h">
    <div class="wrap">
      <div class="mod__bar">
        <h2 class="mod__h" id="stream2-h">${esc(SERIES.fullName)}</h2>
        <p class="pos"><strong>Season 2 · new</strong></p>
        <span class="mod__spacer"></span>
        <a class="seeall" href="${r}the-onset/the-balance/index.html">All 13 episodes <span aria-hidden="true">→</span></a>
      </div>
      <div class="row row--3">${stream2.map((e) => card(e, r, { size: 'card--sm' }))}</div>
      <p class="mod__note" style="margin-top:var(--space-20)">
        Showing 3 of 7 episodes in Season 2. A season is a set, so the count is stated in words and the rest sit behind the series page. Ordered by episode, not date — and this rail never auto-advances.
      </p>
    </div>
  </section>

  <section class="strip">
    <div class="wrap">
      <h2 class="strip__h">Rest of homepage continues</h2>
      <p>Everything below this point on the live homepage is unchanged by ${esc(HUB.name)}.</p>
      <a class="btn" href="${r}the-onset/index.html">Go to ${esc(HUB.name)} <span aria-hidden="true">→</span></a>
    </div>
  </section>

</main>`,
  });
};
