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
import { faqsFor, PLACEHOLDER_FAQS } from '../data/faqs.mjs';
import * as T from '../lib/taxonomy.mjs';
import * as S from '../lib/schema.mjs';

export const detailPage = (item) => {
  const r = rel(3);
  const dept = byDept[item.dept];
  // Option C, as the brief carries it: this ME-domain page owns the citable summary
  // and links out to the full piece on lohud.com. The body text is LoHud's; it is not
  // reproduced here, and nothing is invented to fill the space.
  // Prefer the article's own opening paragraph — it is complete prose. The search
  // snippet is the fallback, and only when it is not visibly truncated.
  const opener = item.body?.find((b) => b.tag === 'p' && b.text.length > 140);
  const faqRec = faqsFor(item.slug);
  const inShort = opener ? [opener.text]
    : item.standfirst && !/\.\.\.$/.test(item.standfirst) ? [item.standfirst]
    : item.standfirst ? [item.standfirst.replace(/\s*\.\.\.$/, '')] : [];
  // Real copy renders as content and emits schema. Otherwise the section still
  // renders, filled with visibly-placeholder Latin and emitting no schema at all.
  const faqs = faqRec?.items ?? PLACEHOLDER_FAQS;
  const faqsAreReal = !!faqRec?.items?.length;
  const related = T.surfacingIn(item.dept).filter((i) => i !== item).slice(0, 3);
  const sameByline = item.byline?.name
    ? T.CATALOG.filter((i) => i.byline?.name === item.byline.name && i.kind !== 'episode').length : 0;

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
      // Schema only for real, reviewed Q&A. Placeholder copy emits nothing —
      // an FAQPage full of Latin would be worse than no FAQPage at all.
      faqsAreReal ? S.faqPage(faqs) : null,
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
        ${media(item, '21x9', item.kind === 'recipe' ? 'Recipe photograph' : 'Lead photograph', r)}
        <div class="detail__col">
        <div style="margin-top:var(--space-28)">
          ${metaStrip(item, r, { long: true, omitByline: true })}
          <h1 class="detail__title">${esc(item.title)}</h1>
          ${item.byline?.name ? html`
          <p class="detail__byline byline">
            ${item.byline.reviewer ? 'Reviewed by' : 'By'} <strong>${esc(item.byline.name)}</strong>${item.byline.role ? `, ${esc(item.byline.role)}` : `, ${esc(dept.label)}`}
            ${item.minutes ? `· ${item.minutes} min read` : ''}
            ${item.spanishTitle ? `· <a href="${esc(item.lohudUrl)}" rel="sponsored noopener" hreflang="es" lang="es">${esc(item.spanishTitle)}</a>` : ''}
          </p>` : html`
          <p class="detail__byline byline">
            Published by <strong>Montefiore Einstein</strong> on lohud.com.
          </p>`}

        </div>

        <!-- Answer-first. Speakable. Above the body. Never behind an interaction. -->
        <section class="in-short" aria-labelledby="inshort-h">
          <h2 id="inshort-h">In short</h2>
          ${inShort.map((p) => `<p>${p}</p>`)}
          ${item.kind === 'recipe' && item.byline?.reviewer ? html`
            <ul><li>Reviewed by ${esc(item.byline.name)}, Montefiore Einstein</li></ul>` : ''}
        </section>

        <div class="prose">
          ${item.body?.length
            ? (() => {
                const blocks = item.body.filter((b) => b !== opener);
                // Drop the pull quote in after the first section, so it lands in the
                // body rather than on top of it.
                let at = blocks.findIndex((b, i) => i > 1 && b.tag === 'h2');
                if (at < 0) at = Math.min(3, blocks.length);
                return blocks.map((b, i) => {
                  const el = b.tag === 'p' ? `<p>${esc(b.text)}</p>` : `<h2>${esc(b.text)}</h2>`;
                  return i === at && item.pullQuote
                    ? `<blockquote class="pull"><em class="pull-quote">${esc(item.pullQuote)}</em></blockquote>${el}`
                    : el;
                });
              })()
            : html`
              <p>
                This is the Montefiore Einstein page for a piece published in the
                ${esc(HUB.publisher)} series on lohud.com. The summary above is the citable text
                Montefiore Einstein owns on its own domain; the full article is linked below.
              </p>`}
        </div>

        ${faqs.length ? html`
        <section class="qa${faqsAreReal ? '' : ' qa--placeholder'}" aria-labelledby="qa-h">
          <h2 class="mod__h" id="qa-h">Common questions</h2>
          ${faqs.map((f) => html`
            <div class="qa__item">
              <h3 class="qa__q">${esc(f.q)}</h3>
              <p class="qa__a">${esc(f.a)}</p>
            </div>`)}
          ${faqRec?.reviewedBy ? `<p class="mod__note" style="margin-top:var(--space-16)">Reviewed by ${esc(faqRec.reviewedBy)}${faqRec.reviewed ? `, ${esc(faqRec.reviewed)}` : ''}.</p>` : ''}
        </section>` : ''}

        <!-- The Person entity made visible — rendered only where a real named
             clinician is known. No author card for an unknown byline. -->
        ${item.byline?.name ? html`
        <aside class="author" aria-label="About the author">
          ${item.byline.photo
            ? `<img class="author__photo author__photo--real" src="${r}assets/${esc(item.byline.photo)}" alt="" loading="lazy">`
            : '<div class="ph author__photo" data-label="Photo" role="img" aria-label="Author photograph pending"></div>'}
          <div>
            <h2 class="author__name">${esc(item.byline.name)}</h2>
            <p class="byline">
              ${esc(item.byline?.role || dept.label)}, Montefiore Einstein
              · ${sameByline} piece${sameByline === 1 ? '' : 's'} on ${esc(HUB.name)}
            </p>
          </div>
          <span class="mod__spacer"></span>
          <a class="btn btn--ghost" href="${esc(item.byline?.profileUrl || dept.findCare.url)}">
            ${item.byline?.profileUrl ? 'View profile in Find a Doctor' : 'Find a clinician'} <span aria-hidden="true">↗</span>
          </a>
        </aside>` : ''}

        <!-- Paid custom content boundary: rel="sponsored", passing no link authority.
             This replaces the old "more stories on LoHud.com" component, which
             pointed authority outward. -->
        ${item.lohudUrl ? html`
        <div style="border-top:var(--rule);padding-top:var(--space-24);margin-top:var(--space-32)">
          <a class="btn" href="${esc(item.lohudUrl)}" rel="sponsored noopener" target="_blank">
            Read the full article on lohud.com <span aria-hidden="true">↗</span>
          </a>
        </div>` : ''}
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
