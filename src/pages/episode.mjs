// SCREEN 2c — The Balance episode page.
// The video lives on YouTube by design; this ME-domain page is the CITABLE TEXT
// LAYER for it — transcript, self-canonical URL, Hub › Department › Episode
// breadcrumb, and VideoObject schema naming ME as publisher.
//
// Canonical home is the DEPARTMENT path, not /the-balance/. The episode belongs to
// its department; the series page links to it.

import { html, esc, longDate } from '../lib/html.mjs';
import { page, masthead, crumbs, rel } from '../components/chrome.mjs';
import { card, metaStrip } from '../components/cards.mjs';
import { HUB } from '../data/site.mjs';
import { byDept } from '../data/departments.mjs';
import { SERIES } from '../data/episodes.mjs';
import * as T from '../lib/taxonomy.mjs';
import * as S from '../lib/schema.mjs';

export const episodePage = (ep) => {
  const r = rel(3);
  const dept = byDept[ep.dept];
  const others = T.ofKind('episode').filter((e) => e.slug !== ep.slug).sort(T.byEpisode).slice(0, 2);
  const alsoArticle = T.surfacingIn(ep.dept).find((i) => i.kind === 'article');
  const related = [...others, alsoArticle].filter(Boolean);
  const title = T.displayTitle(ep);

  const trail = [
    { label: 'Montefiore Einstein', href: 'index.html' },
    { label: HUB.name, href: 'the-onset/index.html' },
    { label: dept.label, href: `the-onset/${ep.dept}/index.html` },
    { label: SERIES.name, href: 'the-onset/the-balance/index.html' },
    { label: `S${ep.season} E${ep.episode}` },
  ];

  return page({
    title: `${title} — ${SERIES.name} | ${HUB.name}`,
    description: ep.summary,
    depth: 3,
    canonical: T.itemPath(ep),
    schema: S.graph(
      S.meOrganization(),
      S.hubCollection(),
      S.videoPage(ep),
      S.breadcrumbs([
        { label: 'Montefiore Einstein', href: '/' },
        { label: HUB.name, href: `${HUB.path}/` },
        { label: dept.label, href: T.deptPath(ep.dept) },
        { label: SERIES.name, href: T.seriesPath() },
        { label: `S${ep.season} E${ep.episode}` },
      ]),
    ),
    children: html`
${masthead(r, { current: ep.dept })}
${crumbs(trail, r)}
<main id="main">
  <article>
    <div class="wrap">
      <div class="detail">
        <div class="detail__col">
        <p class="meta">
          <span>Season ${ep.season}, Episode ${ep.episode}</span>
          <span class="sep" aria-hidden="true">·</span>
          <a href="${r}the-onset/${esc(ep.dept)}/index.html">${esc(dept.label)}</a>
          <span class="sep" aria-hidden="true">·</span>
          <span class="meta__type">${esc(SERIES.name)}</span>
          <span class="sep" aria-hidden="true">·</span>
          <span>${ep.minutes} min</span>
          <span class="sep" aria-hidden="true">·</span>
          <span>Full transcript below</span>
        </p>
        <h1 class="detail__title">${esc(title)}</h1>

        <!-- Embedded from and linking out to YouTube. The hub does not re-host. -->
        <div class="embed" style="margin-block:var(--space-28)">
          <p class="embed__label">
            <span aria-hidden="true" style="font-size:32px">▶</span><br>
            YouTube embed — <a href="${esc(ep.youtube)}" rel="noopener" target="_blank">watch on YouTube ↗</a><br>
            <span style="font-size:var(--text-200);opacity:.8">The video lives on YouTube by design. This page owns the citable text.</span>
          </p>
        </div>

        <div class="author" style="margin-top:0">
          <div style="flex:1 1 320px">
            <p class="byline"><strong>Host</strong> ${esc(SERIES.host.name)} — ${esc(SERIES.host.role)}</p>
            <p class="byline"><strong>Guest</strong> ${esc(ep.guest)}${ep.guestSpecialty ? `, ${esc(ep.guestSpecialty)}` : ''}, Montefiore Einstein</p>
            <p class="mod__note" style="margin-top:var(--space-8)">Both are Person entities. The guest carries a <code>sameAs</code> to Find a Doctor, which makes the byline corroborable rather than asserted.</p>
          </div>
          <a class="btn btn--ghost" href="${esc(dept.findCare.url)}">View profile in Find a Doctor <span aria-hidden="true">↗</span></a>
        </div>

        <!-- "In short" plus "what this episode covers" — the extractable pair.
             Server-rendered and expanded on load. -->
        <section class="in-short" aria-labelledby="ep-inshort">
          <h2 id="ep-inshort">In short</h2>
          <p>${esc(ep.summary)}</p>
        </section>

        ${ep.topics.length ? html`
        <section class="prose" aria-labelledby="ep-covers">
          <h2 id="ep-covers">What this episode covers</h2>
          <div class="chips chips--tap" style="margin-bottom:var(--space-16)">
            ${ep.topics.map((t) => `<span class="chip">${esc(t)}</span>`)}
          </div>
          <p class="mod__note">Montefiore Einstein's own subject tags for this episode. On the live hub this block also carries two or three answer-first bullets written for the page.</p>
        </section>` : ''}

        <!-- Transcript: chaptered with timestamps, mirrored in VideoObject
             hasPart/Clip. Ships in the initial HTML, EXPANDED on load.
             Per-chapter collapsing would be fine; fetch-on-click is not. -->
        <section class="transcript" aria-labelledby="ep-transcript">
          <h2 class="mod__h" id="ep-transcript">Jump to a moment</h2>
          <p class="mod__note" style="margin-block:var(--space-8) var(--space-16)">
            Timestamps taken from the episode's own words. The whole ${ep.transcript.length}-line transcript
            ships in this page’s HTML and is expanded on load — never fetched on click, because text behind an
            interaction is text an engine cannot cite.
          </p>
          <ol>
            ${ep.chapters.map((c, i) => html`
              <li id="t${i}"><span class="t">${esc(c.t)}</span><span class="c">${esc(c.label)}</span></li>`)}
          </ol>
        </section>

        <section class="transcript" aria-labelledby="ep-fulltext">
          <h2 class="mod__h" id="ep-fulltext">Full transcript</h2>
          <ol>
            ${ep.transcript.map((c) => html`
              <li><span class="t">${esc(c.t)}</span><span class="c">${esc(c.text)}</span></li>`)}
          </ol>
        </section>

        ${ep.tieBreak ? html`
        <aside class="mod__note" style="border-top:var(--rule);padding-top:var(--space-20);margin-top:var(--space-32)">
          <strong>Classification note.</strong> ${esc(ep.tieBreak)}
        </aside>` : ''}
        </div><!-- /.detail__col -->
      </div>
    </div>

    ${related.length ? html`
    <section class="mod" aria-labelledby="ep-related">
      <div class="wrap">
        <div class="mod__bar">
          <h2 class="mod__h" id="ep-related">More from ${esc(SERIES.name)}</h2>
          <span class="mod__spacer"></span>
          <a class="seeall" href="${r}the-onset/the-balance/index.html">All 13 episodes <span aria-hidden="true">→</span></a>
        </div>
        <div class="row row--3">${related.map((it) => card(it, r, { size: 'card--sm' }))}</div>
      </div>
    </section>` : ''}
  </article>
</main>`,
  });
};
