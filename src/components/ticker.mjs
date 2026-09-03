// THE TICKER / ROTATING FEED — net-new, a sanctioned evolution of the design system.
//
// A curated, cross-department spotlight sourced from The Latest, capped at 6–10
// items from both feeds. It is a doorway into the hub, not the archive.
//
// ACCESSIBILITY CONTRACT (brief: "requirements, not suggestions"):
//   · Manual advance by DEFAULT. Auto-rotation is opt-in, never opt-out.
//   · Persistent, properly labelled Pause AND Stop controls (WCAG 2.2 SC 2.2.2).
//   · Interval never faster than 7s.
//   · Pauses on hover, on focus and on any interaction — and STAYS paused.
//   · Reduced-motion preference disables rotation entirely, control and all.
//   · Announces politely (aria-live="polite"), or not at all.
//   · Visible position indicator.
//   · NOTHING is available only in the ticker.
//   · Degrades to a static curated set — never a dead carousel. With JavaScript
//     off, every group below is simply visible, stacked. That is the fallback:
//     it is the same markup, unhidden.
//   · On each advance the WHOLE set swaps, never a single moving tile.

import { html, esc } from '../lib/html.mjs';
import { offsetHero, card, metaStrip, itemHref } from './cards.mjs';

/** Chunk The Latest into sets of (1 lead + 3 secondary). */
export const groupsOf = (items, per = 4) => {
  const out = [];
  for (let i = 0; i < items.length; i += per) out.push(items.slice(i, i + per));
  // The offset hero is built around a standfirst, so each set leads with an item that
  // has one. Order within a set is presentation, not chronology.
  return out.filter((g) => g.length > 1).map((g) => {
    const i = g.findIndex((x) => x.standfirst);
    return i > 0 ? [g[i], ...g.filter((_, n) => n !== i)] : g;
  });
};

export const ticker = (items, r, {
  heading = 'The Latest',
  id = 'latest',
  seeAll = 'the-onset/archive/index.html',
  seeAllLabel = 'See all',
} = {}) => {
  const groups = groupsOf(items);
  const n = groups.length;

  return html`
<section class="mod" id="${id}" aria-labelledby="${id}-h">
  <div class="wrap">
    <div class="mod__bar">
      <h2 class="mod__h" id="${id}-h">${esc(heading)}</h2>

      <div class="ctrl__group" data-tick-nav hidden>
        <button type="button" class="ctrl" data-tick="prev" aria-controls="${id}-sets">
          <span aria-hidden="true">‹</span> Previous<span class="vh"> set of stories</span>
        </button>
        <button type="button" class="ctrl" data-tick="next" aria-controls="${id}-sets">
          Next<span class="vh"> set of stories</span> <span aria-hidden="true">›</span>
        </button>
      </div>
      <p class="pos" data-tick-pos>Set <strong>1</strong> of ${n}</p>

      <span class="mod__spacer"></span>

      <!-- Auto-rotation is OFF until a reader asks for it. Under a reduced-motion
           preference the control is disabled outright and says why. -->
      <div class="ctrl__group" data-tick-auto hidden>
        <button type="button" class="ctrl" data-tick="auto" aria-pressed="false">
          <span aria-hidden="true">⟳</span> Auto-rotate<span class="vh"> the set of stories, advancing every 7 seconds</span>
        </button>
        <button type="button" class="ctrl" data-tick="pause" disabled>
          <span aria-hidden="true" data-icon>❙❙</span> <span data-label>Pause</span><span class="vh"> auto-rotation</span>
        </button>
        <button type="button" class="ctrl" data-tick="stop" disabled>
          <span aria-hidden="true">◼</span> Stop<span class="vh"> auto-rotation for this visit</span>
        </button>
      </div>

      <div class="ctrl__group" data-tick-view hidden>
        <button type="button" class="ctrl" data-tick="grid" aria-pressed="true" aria-controls="${id}-sets">
          <span aria-hidden="true">▦</span> Grid<span class="vh"> view</span>
        </button>
        <button type="button" class="ctrl" data-tick="list" aria-pressed="false" aria-controls="${id}-sets">
          <span aria-hidden="true">☰</span> List<span class="vh"> view</span>
        </button>
      </div>

      <a class="seeall" href="${r}${seeAll}">${esc(seeAllLabel)} <span aria-hidden="true">→</span><span class="vh"> in the archive</span></a>
    </div>

    <!-- Every set is server-rendered. Without JavaScript they all show, stacked;
         that is the static fallback, not a separate code path. -->
    <div id="${id}-sets" data-tick-sets aria-live="polite" aria-atomic="false">
      ${groups.map((g, gi) => html`
        <div class="tick-set" data-tick-set="${gi}">
          <h3 class="vh">Set ${gi + 1} of ${n}</h3>
          ${offsetHero(g[0], r, { headingLevel: 4 })}
          ${g.length > 1 ? html`
            <div class="row row--3" style="margin-top:var(--space-48)">
              ${g.slice(1).map((it) => card(it, r, { ratio: '16x9', size: 'card--sm' }))}
            </div>` : ''}
          <ul class="tick-list" hidden>
            ${g.map((it) => html`
              <li>
                <a href="${itemHref(r, it)}">${esc(it.title)}</a>
                ${metaStrip(it, r)}
              </li>`)}
          </ul>
        </div>`)}
    </div>

    <p class="mod__note" data-tick-note hidden>
      Manual advance is the default. Auto-rotation advances every 7 seconds, pauses when you hover or focus anything inside, and stays paused.
    </p>
  </div>
</section>`;
};

/** Styles for the ticker's two views. Kept with the component. */
export const tickerCss = `
.tick-set + .tick-set { margin-top: var(--space-64); padding-top: var(--space-48); border-top: var(--rule); }
.tick-set[hidden] { display: none; }
.tick-list { list-style: none; margin: 0; padding: 0; }
.tick-list li { border-top: var(--hairline); padding-block: var(--space-16); }
.tick-list li:last-child { border-bottom: var(--hairline); }
.tick-list a {
  font-family: var(--font-serif); font-size: var(--text-500); line-height: 1.25;
  color: var(--color-primary-montefiore-500); text-decoration: none;
  display: inline-block; margin-bottom: var(--space-8);
}
.tick-list a:hover { text-decoration: underline; text-underline-offset: 4px; }
/* List view hides the media-led set and shows the compact list. */
.tick-set.is-list .hero, .tick-set.is-list .row { display: none; }
.tick-set.is-list .tick-list { display: block !important; }
`;
