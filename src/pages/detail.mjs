// SCREEN 2f — Article detail, and the same template for recipes and patient
// journeys. "Same meta strip as every card in this direction, so the detail page
// feels like the card opened rather than a different template."
//
// GEO posture on this page:
//   · This URL is canonical. LoHud runs the syndicated copy and points back here.
//   · "In short" is the speakable block: answer-first, above the body, expanded.
//   · Body is H2-chunked in reader phrasing, measure capped at 64ch.
//   · FAQPage in the reader's words, server-rendered and expanded on load.
//   · The author card links out to Find a Doctor — the Person entity made visible.
//   · The cross-boundary link to lohud.com carries rel="sponsored" (paid custom
//     content passes no link authority) and rel="noopener".

import { html, esc, longDate } from '../lib/html.mjs';
import { page, masthead, crumbs, rel } from '../components/chrome.mjs';
import { card, media, metaStrip } from '../components/cards.mjs';
import { HUB } from '../data/site.mjs';
import { byDept } from '../data/departments.mjs';
import { LONGFORM } from '../data/longform.mjs';
import * as T from '../lib/taxonomy.mjs';
import * as S from '../lib/schema.mjs';

export const detailPage = (item) => {
  const r = rel(3);
  const dept = byDept[item.dept];
  const long = LONGFORM[item.slug];
  const inShort = long?.inShort ?? [item.standfirst];
  const faqs = long?.faqs ?? [];
  const related = T.surfacingIn(item.dept).filter((i) => i !== item).slice(0, 3);
  const sameByline = T.CATALOG.filter((i) => i.byline?.name === item.byline.name && i.kind !== 'episode').length;

  const trail = [
    { label: 'Montefiore Einstein', href: 'index.html' },
    { label: HUB.name, href: 'the-onset/index.html' },
    { label: dept.label, href: `the-onset/${item.dept}/index.html` },
    { label: item.title },
  ];

  const schemaNode = item.kind === 'recipe' ? S.recipePage(item) : S.articlePage(item);

  return page({
    title: `${item.title} — ${HUB.name} | Montefiore Einstein`,
    description: item.standfirst,
    depth: 3,
    canonical: T.itemPath(item),
    // English and Spanish twins carry reciprocal hreflang on DISTINCT URLs, each
    // self-canonical. A language toggle at one URL is invisible to engines.
    hreflang: item.es
      ? [
          { lang: 'en', href: `${HUB.origin}${T.itemPath(item)}` },
          { lang: 'es', href: `${HUB.origin}${T.itemPath(item)}es/` },
          { lang: 'x-default', href: `${HUB.origin}${T.itemPath(item)}` },
        ]
      : null,
    schema: S.graph(
      S.meOrganization(),
      S.hubCollection(),
      schemaNode,
      S.faqPage(faqs),
      S.breadcrumbs([
        { label: 'Montefiore Einstein', href: '/' },
        { label: HUB.name, href: `${HUB.path}/` },
        { label: dept.label, href: T.deptPath(item.dept) },
        { label: item.title },
      ]),
    ),
    children: html`
${masthead(r, { current: item.dept })}
${crumbs(trail, r)}
<main id="main">
  <article>
    <div class="wrap">
      <div class="detail">
        ${media(item, '21x9', item.kind === 'recipe' ? 'Recipe photograph' : 'Lead photograph')}
        <div class="detail__col">
        <div style="margin-top:var(--space-28)">
          ${metaStrip(item, r, { long: true, omitByline: true })}
          <h1 class="detail__title">${esc(item.title)}</h1>
          <p class="detail__byline byline">
            ${item.kind === 'recipe' ? 'Reviewed by' : 'By'} <strong>${esc(item.byline.name)}</strong>${item.byline.reviewer ? '' : `, ${esc(dept.label)}`}
            · ${item.minutes} min read
            ${item.es ? '· <span class="meta__lang">Also in Spanish</span>' : ''}
          </p>
          ${item.kind === 'journey' ? html`
            <p class="byline">With <strong>${esc(item.clinician)}</strong>, ${esc(dept.label)}</p>` : ''}
        </div>

        <!-- Answer-first. Speakable. Above the body. Never behind an interaction. -->
        <section class="in-short" aria-labelledby="inshort-h">
          <h2 id="inshort-h">In short</h2>
          ${inShort.map((p) => `<p>${p}</p>`)}
          ${item.kind === 'recipe' ? html`
            <ul>
              <li><strong>${item.recipe.cookTime} minutes</strong>, serves ${item.recipe.serves}</li>
              ${item.recipe.plans.length ? `<li>${esc(item.recipe.plans.join(' · '))}</li>` : ''}
              <li>Reviewed by a Montefiore Einstein registered dietitian</li>
            </ul>` : ''}
        </section>

        <div class="prose">
          ${long
            ? long.body.map((sec) => html`
                <h2>${esc(sec.h2)}</h2>
                ${sec.paras.map((p) => `<p>${p}</p>`)}`)
            : html`
              <h2>Full article body continues</h2>
              <p>
                The body copy for this piece is a production task, not a template gap. Every detail page on the hub
                renders this same structure: an answer-first summary above, then H2-chunked sections in reader
                phrasing, the measure capped at 64 characters, then the question-and-answer block, then the author
                card. ${esc(item.standfirst)}
              </p>
              <p>
                Each H2 on a finished page is written as a question someone actually asks, because those headings are
                what an AI engine lifts when it answers on the hub's behalf.
              </p>`}
        </div>

        ${faqs.length ? html`
        <section class="qa" aria-labelledby="qa-h">
          <h2 class="mod__h" id="qa-h">Common questions</h2>
          ${faqs.map((f) => html`
            <div class="qa__item">
              <h3 class="qa__q">${esc(f.q)}</h3>
              <p class="qa__a">${esc(f.a)}</p>
            </div>`)}
        </section>` : ''}

        <!-- The Person entity made visible. -->
        <aside class="author" aria-label="About the author">
          <div class="ph author__photo" data-label="Photo" role="img" aria-label="Author photograph pending"></div>
          <div>
            <h2 class="author__name">${esc(item.byline.name)}</h2>
            <p class="byline">
              ${esc(item.byline.reviewer ? 'Registered dietitian' : dept.label)}, Montefiore Einstein
              · ${sameByline} piece${sameByline === 1 ? '' : 's'} on ${esc(HUB.name)}
            </p>
            <p class="mod__note">Byline is a prototype placeholder; the Find a Doctor <code>sameAs</code> binds when the crawl supplies the named clinician.</p>
          </div>
          <span class="mod__spacer"></span>
          <a class="btn btn--ghost" href="${esc(dept.findCare.url)}">View profile <span aria-hidden="true">↗</span></a>
        </aside>

        <!-- Paid custom content boundary: rel="sponsored", passing no link authority.
             This replaces the old "more stories on LoHud.com" component, which
             pointed authority outward. -->
        ${item.lohud ? html`
        <p class="mod__note" style="border-top:var(--rule);padding-top:var(--space-20)">
          Montefiore Einstein publishes this piece here first. A syndicated copy runs on
          <a href="https://www.lohud.com/" rel="sponsored noopener" target="_blank">lohud.com</a>
          as paid custom content and points back to this page.
        </p>` : ''}
        </div><!-- /.detail__col -->
      </div>
    </div>

    <!-- The related row mixes article, episode and patient journey on the ONE card
         grid — the point of this direction is that every content type shares a
         single card language. -->
    ${related.length ? html`
    <section class="mod" aria-labelledby="related-h">
      <div class="wrap">
        <div class="mod__bar">
          <h2 class="mod__h" id="related-h">More in ${esc(dept.label)}</h2>
          <span class="mod__spacer"></span>
          <a class="seeall" href="${r}the-onset/${esc(item.dept)}/index.html">All ${esc(dept.label)} <span aria-hidden="true">→</span></a>
        </div>
        <div class="row row--3">${related.map((it) => card(it, r, { size: 'card--sm' }))}</div>
      </div>
    </section>` : ''}
  </article>
</main>`,
  });
};
