// THE ONE CARD LANGUAGE.
// Image, headline, hairline, meta. No cards, no borders, no boxes — the hairline
// does the separating. Articles, recipes, episodes and patient journeys all use it,
// and are told apart by the META STRIP, which states the content type in words.
// Content type is therefore never conveyed by colour alone.

import { html, esc, cardDate, longDate } from '../lib/html.mjs';
import { byDept } from '../data/departments.mjs';
import { focalFor } from '../data/focal.mjs';
import { itemPath, deptPath, TYPE_LABEL, displayTitle } from '../lib/taxonomy.mjs';

const href = (r, item) => `${r}${itemPath(item).replace(/^\//, '')}index.html`;
const deptHref = (r, slug) => `${r}${deptPath(slug).replace(/^\//, '')}index.html`;

/** Decorative tint rotation. Carries no meaning — meaning lives in the meta strip. */
// Warm tints belong to recipes; editorial stories stay in the cool half of the ME
// palette so a stroke story is never served on a buttercup field.
const TINTS = ['', 'ph--mint', 'ph--sky'];
const WARM = ['ph--wheat', 'ph--warm2', 'ph--warm3'];
const hash = (s) => { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 997; return h; };
const tintFor = (item) => {
  if (item.kind === 'recipe') return WARM[hash(item.slug) % WARM.length];
  if (item.kind === 'journey') return 'ph--flesh';
  if (item.kind === 'episode') return 'ph--dark';
  let h = 0;
  for (const ch of item.slug) h = (h * 31 + ch.charCodeAt(0)) % 997;
  return TINTS[h % TINTS.length];
};

const labelFor = (item) => {
  if (item.kind === 'recipe') return 'Recipe photograph';
  if (item.kind === 'journey') return 'Patient portrait';
  if (item.kind === 'episode') return 'Episode still';
  return 'Photograph';
};

/** Media block at a stated ratio. */
export const media = (item, ratio = '16x9', label = null, r = '') => {
  const play = item.kind === 'episode' ? '<span class="ph__play" aria-hidden="true">▶</span>' : '';
  if (item.image) {
    // alt is empty on purpose: the headline beside it is the accessible name, so
    // describing the image again would just make a screen reader say it twice.
    const src = /^https?:\/\//.test(item.image) ? item.image : `${r}assets/${item.image}`;
    const focal = focalFor(item);
    return html`
<div class="ph ph--${ratio} ph--has-img">
  <img class="ph__img" src="${esc(src)}" alt="" loading="lazy" decoding="async"
       referrerpolicy="no-referrer"${focal ? ` style="object-position:${esc(focal)}"` : ''}>
  ${play}
</div>`;
  }
  return html`
<div class="ph ph--${ratio} ${tintFor(item)}" data-label="${esc(label ?? labelFor(item))}" role="img"
     aria-label="${esc(label ?? labelFor(item))} — art pending for ${esc(displayTitle(item))}">
  ${play}
</div>`;
};

/**
 * The meta strip: date · department · content type, separated by navy dots.
 * This is where a reader learns this is a recipe and not an article.
 */
export const metaStrip = (item, r, { long = false, extra = [], omitByline = false } = {}) => {
  const dept = byDept[item.dept];
  const bits = [];
  bits.push(`<span>${esc(long ? longDate(item.updated) : cardDate(item.updated))}</span>`);
  if (item.kind === 'episode') {
    bits.push(`<span>S${item.season} · E${item.episode}</span>`);
  }
  bits.push(`<a href="${deptHref(r, item.dept)}">${esc(dept.label)}</a>`);
  bits.push(`<span class="meta__type">${esc(TYPE_LABEL[item.kind])}</span>`);
  if (item.kind === 'episode') {
    bits.push(`<span>${item.minutes} min</span>`);
    bits.push(`<span>transcript</span>`);
  } else if (!omitByline) {
    // An unknown byline or read time renders as nothing at all. Never a placeholder.
    if (item.byline?.name) {
      bits.push(`<span>${item.byline.reviewer ? 'Reviewed by ' : ''}${esc(item.byline.name)}</span>`);
    }
    if (item.minutes) bits.push(`<span>${item.minutes} min read</span>`);
  }
  if (item.es) bits.push(`<span class="meta__lang" title="Also available in Spanish">EN/ES</span>`);
  for (const e of extra) bits.push(`<span>${esc(e)}</span>`);
  return html`<p class="meta">${bits.join('<span class="sep" aria-hidden="true">·</span>')}</p>`;
};

/**
 * A card. Link text is the headline itself — never a repeated "Read Full Article" —
 * so a screen-reader user hearing the link list hears the actual items.
 */
export const card = (item, r, { ratio = '16x9', size = '', stand = true } = {}) => html`
<article class="card ${size}">
  <a class="card__media" href="${href(r, item)}" tabindex="-1" aria-hidden="true">${media(item, ratio, null, r)}</a>
  <h3 class="card__title"><a href="${href(r, item)}">${esc(displayTitle(item))}</a></h3>
  ${stand && (item.subhead || item.standfirst) ? `<p class="card__stand">${esc(item.subhead || item.standfirst)}</p>` : ''}
  <hr class="card__hr">
  ${metaStrip(item, r)}
</article>`;

/** Small shelf card — image, headline, meta. */
export const shelfCard = (item, r) => html`
<article class="card card--xs">
  <a class="card__media" href="${href(r, item)}" tabindex="-1" aria-hidden="true">${media(item, '3x2', null, r)}</a>
  <h3 class="card__title"><a href="${href(r, item)}">${esc(item.title)}</a></h3>
  <hr class="card__hr">
  ${metaStrip(item, r)}
</article>`;

/**
 * THE OFFSET HERO — the one net-new component in this direction.
 * 4:3 photograph at ~45% of the content width, text beside it, on white.
 * The byline sits BESIDE the button so credential and way-in read as one unit.
 */
export const offsetHero = (item, r, { headingLevel = 3 } = {}) => {
  const H = `h${headingLevel}`;
  // Editorial photography takes the 4:3 lead the direction calls for. A Balance still
  // is a 16:9 title card, and cropping it to 4:3 cuts the lettering off, so video
  // keeps its own ratio.
  const heroRatio = item.kind === 'episode' ? '16x9' : '4x3';
  return html`
<article class="hero">
  <div class="hero__media">
    <a href="${href(r, item)}" tabindex="-1" aria-hidden="true">${media(item, heroRatio, 'Lead photograph', r)}</a>
  </div>
  <div class="hero__body">
    ${metaStrip(item, r, { long: true })}
    <${H} class="hero__title"><a href="${href(r, item)}">${esc(displayTitle(item))}</a></${H}>
    ${item.standfirst ? `<p class="hero__stand">${esc(item.standfirst)}</p>` : ''}
    <div class="hero__action">
      <a class="btn" href="${href(r, item)}">
        ${item.kind === 'episode' ? 'Watch the episode' : 'Continue reading'} <span aria-hidden="true">→</span>
        <span class="vh">: ${esc(displayTitle(item))}</span>
      </a>
      ${item.byline?.name ? html`
      <p class="byline">
        ${item.kind === 'recipe' ? 'Reviewed by' : item.kind === 'episode' ? 'With' : 'By'} <strong>${esc(item.byline.name)}</strong><br>
        ${esc(item.byline.role || byDept[item.byline.dept]?.label || '')}${item.minutes ? ` · ${item.minutes} min${item.kind === 'episode' ? '' : ' read'}` : ''}
      </p>` : ''}
    </div>
  </div>
</article>`;
};

/**
 * PATIENT JOURNEYS — the signature module and the page's only dark field.
 * Cinematic full-bleed portrait with a scrim over the lower third; the scrim
 * guarantees 4.5:1 for every overlaid word.
 * Framed as a fuller life, never as a survivor or comeback arc.
 */
export const journeyBand = (item, r) => html`
<article class="journey">
  ${item.image
    ? `<img class="journey__img" src="${esc(/^https?:\/\//.test(item.image) ? item.image : `${r}assets/${item.image}`)}" alt="" loading="lazy" referrerpolicy="no-referrer">`
    : '<div class="journey__bg" data-label="Cinematic patient portrait — art pending"></div>'}
  <div class="journey__scrim" aria-hidden="true"></div>
  <div class="journey__body">
    <p class="journey__eyebrow">Patient Journeys</p>
    <h3 class="journey__title"><a href="${href(r, item)}">${esc(item.title)}</a></h3>
    <p class="journey__meta">
      ${item.byline?.name ? `With ${esc(item.byline.name)} · ` : ''}<a href="${deptHref(r, item.dept)}">${esc(byDept[item.dept].label)}</a>
      <span class="sep" aria-hidden="true"> · </span>${esc(cardDate(item.published))}
    </p>
  </div>
</article>`;

export { href as itemHref, deptHref };
