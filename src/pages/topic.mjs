// SCREEN 2e — Topic page. Nutrition, recipe-led, on the shared grid.
// Topics sit on their own /topics/ path so the URL says this is a subject
// collection, not a department. TOPICS GATHER; DEPARTMENTS OWN — every item here
// still links to its one canonical URL under its owning department.

import { html, esc, cardDate } from '../lib/html.mjs';
import { page, masthead, crumbs, rel } from '../components/chrome.mjs';
import { card, media, itemHref } from '../components/cards.mjs';
import { HUB } from '../data/site.mjs';
import { byDept } from '../data/departments.mjs';
import * as T from '../lib/taxonomy.mjs';
import * as S from '../lib/schema.mjs';

export const topicPage = (topic) => {
  const r = rel(3);
  const items = T.topicItems(topic);
  const recipes = items.filter((i) => i.kind === 'recipe');
  const articles = items.filter((i) => i.kind !== 'recipe');
  const feature = T.preferWithStandfirst(recipes)[0];

  // "Where this content lives" — recipes head the list because Healthy Nutrition is
  // the canonical exception: no clinical department, so no entity claim.
  const homes = {};
  for (const i of items) homes[i.dept] = (homes[i.dept] ?? 0) + 1;
  const homeList = Object.entries(homes).sort((a, b) => b[1] - a[1]);

  const trail = [
    { label: 'Montefiore Einstein', href: 'index.html' },
    { label: HUB.name, href: 'the-onset/index.html' },
    { label: 'Topics' },
    { label: topic.label },
  ];

  return page({
    title: `${topic.label} — ${HUB.name} | Montefiore Einstein`,
    description: topic.intro,
    depth: 3,
    canonical: T.topicPath(topic.slug),
    schema: S.graph(
      S.meOrganization(),
      S.hubCollection(),
      {
        // A subject collection. It makes NO canonical entity claim — keyword and
        // internal-link relationships only.
        '@type': 'CollectionPage',
        '@id': `${S.abs(T.topicPath(topic.slug))}#page`,
        name: `${topic.label} — ${HUB.name}`,
        description: topic.intro,
        url: S.abs(T.topicPath(topic.slug)),
        isPartOf: { '@id': S.HUB_ID },
        publisher: { '@id': S.ME_ID },
        speakable: S.speakable(),
        mainEntity: { '@type': 'ItemList', numberOfItems: items.length },
      },
      S.faqPage(topic.faqs),
      S.breadcrumbs([
        { label: 'Montefiore Einstein', href: '/' },
        { label: HUB.name, href: `${HUB.path}/` },
        { label: 'Topics' },
        { label: topic.label },
      ]),
    ),
    children: html`
${masthead(r)}
${crumbs(trail, r)}
<main id="main">

  <section class="mod" aria-labelledby="topic-h">
    <div class="wrap">
      <div class="hero">
        <div class="hero__media">${media({ kind: 'recipe', slug: topic.slug, title: topic.label }, '4x3', 'Recipe photograph')}</div>
        <div class="hero__body">
          <p class="meta">
            <span class="meta__type">Topic</span>
            <span class="sep" aria-hidden="true">·</span><span>${recipes.length} recipes</span>
            <span class="sep" aria-hidden="true">·</span><span>${articles.length} articles</span>
          </p>
          <h1 class="hero__title" id="topic-h">${esc(topic.label)}</h1>
          <p class="hero__stand answer-first">${esc(topic.intro)}</p>
          <div class="hero__action">
            <a class="btn" href="${esc(topic.findCare.url)}">${esc(topic.findCare.label)} <span aria-hidden="true">↗</span></a>
            <a class="btn btn--ghost" href="${esc(topic.related.url)}">${esc(topic.related.label)} <span aria-hidden="true">↗</span></a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Recipe readers arrive with a constraint, not a browsing mood — so the facets
       are the ones cooks actually use. -->
  <div class="wrap">
    <div class="mod__bar" style="border-bottom-width:1px;border-bottom-color:var(--color-gray-300)">
      ${Object.entries(topic.facets).map(([group, opts]) => html`
        <div class="chips chips--tap">
          <span class="chips__label">${esc(group)}:</span>
          ${opts.map((o) => `<a class="chip" href="${r}the-onset/archive/index.html?q=${encodeURIComponent(o)}" rel="nofollow">${esc(o)}</a>`)}
        </div>`)}
    </div>
  </div>

  <!-- Recipe-led by design, so a recipe takes the hero and recipes are the first
       grid. Every one carries Recipe schema — the most winnable content on the hub. -->
  <section class="mod" aria-labelledby="recipes-h">
    <div class="wrap">
      <div class="mod__bar">
        <h2 class="mod__h" id="recipes-h">Recipes</h2>
        <span class="mod__spacer"></span>
        <p class="pos">${recipes.length} recipes</p>
        <a class="seeall" href="${r}the-onset/archive/index.html?type=recipe">See all <span aria-hidden="true">→</span></a>
      </div>
      <div class="row row--3">
        ${recipes.slice(0, 6).map((it) => html`
          <article class="card card--sm">
            <a class="card__media" href="${itemHref(r, it)}" tabindex="-1" aria-hidden="true">${media(it, '3x2', 'Recipe photograph', r)}</a>
            <h3 class="card__title"><a href="${itemHref(r, it)}">${esc(it.title)}</a></h3>
            <hr class="card__hr">
            <p class="meta">
              <span>${esc(cardDate(it.published))}</span>
              <span class="sep" aria-hidden="true">·</span><span class="meta__type">Recipe</span>
              ${it.byline?.name ? `<span class="sep" aria-hidden="true">·</span><span>Reviewed by ${esc(it.byline.name)}</span>` : ''}
            </p>
          </article>`)}
      </div>
    </div>
  </section>

  <section class="mod mod--tight" aria-labelledby="topic-qa">
    <div class="wrap">
      <div class="qa">
        <h2 class="mod__h" id="topic-qa">Common questions about ${esc(topic.label.toLowerCase())}</h2>
        ${topic.faqs.map((f) => html`
          <div class="qa__item">
            <h3 class="qa__q">${esc(f.q)}</h3>
            <p class="qa__a">${esc(f.a)}</p>
          </div>`)}
      </div>
    </div>
  </section>

  <!-- The clinical side is what makes this not a food blog. Named-physician
       articles behind the cooking, each showing its OWNING department. -->
  <section class="mod" aria-labelledby="why-h">
    <div class="wrap">
      <div class="mod__bar">
        <h2 class="mod__h" id="why-h">Why these foods matter</h2>
        <span class="mod__spacer"></span>
        <p class="pos">${articles.length} articles</p>
      </div>
      <div class="row row--3">${articles.slice(0, 6).map((it) => card(it, r, { size: 'card--sm' }))}</div>
    </div>
  </section>

  <aside class="tinted" aria-labelledby="lives-h">
    <div class="wrap">
      <h2 class="mod__h" id="lives-h">Where this content lives</h2>
      <div class="chips chips--tap">
        ${homeList.map(([slug, n]) => `<a class="chip" href="${r}the-onset/${esc(slug)}/index.html">${esc(byDept[slug].label)} (${n}) <span aria-hidden="true">→</span></a>`)}
      </div>
    </div>
  </aside>

</main>`,
  });
};
