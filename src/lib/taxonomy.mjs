// Resolves the content model into one queryable catalog.
//
// One browse axis (department, entity-bearing), one editorial layer (pillars, no
// schema weight), two cross-cutting devices (Patient Journeys, The Latest).
// Cross-surfacing is by secondary tag and pillar; every surfacing links to the ONE
// canonical URL. There is never a second self-canonical page for the same item.

import { ITEMS } from '../data/articles.mjs';
import { EPISODES, SERIES } from '../data/episodes.mjs';
import { HUB } from '../data/site.mjs';
import { byDept } from '../data/departments.mjs';

const HUB_PATH = HUB.path;

/** Canonical URL for any item. Department is the canonical axis — including for
 *  Balance episodes, whose home is the department path, not /the-balance/. */
export const itemPath = (it) => `${HUB_PATH}/${it.dept}/${it.slug}/`;
export const deptPath = (slug) => `${HUB_PATH}/${slug}/`;
export const topicPath = (slug) => `${HUB_PATH}/topics/${slug}/`;
export const seriesPath = () => `${HUB_PATH}/${SERIES.slug}/`;
export const archivePath = () => `${HUB_PATH}/archive/`;
export const pillarPath = (slug) => `${HUB_PATH}/pillars/${slug}/`;

/** Normalise an episode into the shared item shape so one card language, one
 *  archive and one sort can handle every content type. */
const fromEpisode = (e) => ({
  ...e,
  kind: 'episode',
  topic: `S${e.season} · E${e.episode}`,
  published: e.published,
  updated: e.published,
  standfirst: e.summary,
  byline: { name: 'Dr. Guest, MD', credential: 'MD', dept: e.dept, pending: true, guest: true },
  lang: 'en',
  es: false,
  lohud: false,
  series: SERIES.name,
});

export const CATALOG = [...ITEMS, ...EPISODES.map(fromEpisode)];

// ---- content-type labels. Type is always stated in words on the meta strip, so it
// is never conveyed by colour alone (WCAG 1.4.1 / brief accessibility rule).
export const TYPE_LABEL = {
  article: 'Article', recipe: 'Recipe', journey: 'Patient Journey', episode: 'The Balance',
};

export const byDate = (a, b) => (a.updated < b.updated ? 1 : a.updated > b.updated ? -1 : 0);
export const byEpisode = (a, b) =>
  b.season - a.season || b.episode - a.episode;

/** Items whose CANONICAL department is this one. Used for counts and for the
 *  department page body — the only-its-content rule. */
export const canonicalIn = (slug) => CATALOG.filter((i) => i.dept === slug).sort(byDate);

/** Items that SURFACE on this department page: canonical plus cross-surfaced by
 *  secondary tag. Every one still links to its single canonical URL. */
export const surfacingIn = (slug) =>
  CATALOG.filter((i) => i.dept === slug || (i.secondaryDepts ?? []).includes(slug)).sort(byDate);

export const inPillar = (slug) => CATALOG.filter((i) => (i.pillars ?? []).includes(slug)).sort(byDate);
export const ofKind = (k) => CATALOG.filter((i) => i.kind === k);
export const journeysIn = (slug) => CATALOG.filter((i) => i.kind === 'journey' && i.dept === slug).sort(byDate);
export const episodesIn = (slug) =>
  CATALOG.filter((i) => i.kind === 'episode' && (i.dept === slug || (i.secondaryDepts ?? []).includes(slug)))
    .sort(byEpisode);

export const findItem = (slug) => CATALOG.find((i) => i.slug === slug);

/** Display title. Ten of the thirteen episode titles are not enumerated in either
 *  source document, so a pending episode is identified by the thing that actually
 *  identifies it — its season and episode — rather than by a repeated placeholder
 *  that makes three cards in a row look identical. */
export const displayTitle = (i) =>
  i.kind === 'episode' && i.titlePending
    ? `The Balance, Season ${i.season} Episode ${i.episode}`
    : i.title;

/** The Latest — the ticker's source lens. Curated: editorial pins lead, then
 *  reverse-chronological by editor-set date. Capped at 6–10 items per the brief. */
export const theLatest = (limit = 8) => {
  const pinned = CATALOG.filter((i) => i.featured).sort(byDate);
  const rest = CATALOG.filter((i) => !i.featured && i.kind !== 'episode').sort(byDate);
  return [...pinned, ...rest].slice(0, limit);
};

/** Department shelves for the hub home — only departments that actually have
 *  content, ordered by how much they have. Zero-item sections are never padded. */
export const shelves = (n = 3, per = 4) =>
  Object.keys(byDept)
    .map((slug) => ({ slug, label: byDept[slug].label, items: canonicalIn(slug).slice(0, per), total: canonicalIn(slug).length }))
    .filter((s) => s.items.length > 0)
    .sort((a, b) => b.total - a.total)
    .slice(0, n);

/** Topic pages gather across departments; departments own. */
export const TOPICS = [
  {
    slug: 'nutrition', label: 'Nutrition',
    intro:
      'Nutrition on The Onset means two things at once: recipes cooked for real weeknights and reviewed by Montefiore Einstein dietitians, and the clinical guidance that explains why they are worth cooking. The recipes come first because that is how most people arrive.',
    facets: { Meal: ['Breakfast', 'Dinner'], Plan: ['Low sodium', 'Diabetes-friendly', 'Plant-based'] },
    findCare: { label: 'Find a dietitian', url: 'https://www.montefioreeinstein.org/doctors/?specialty=nutrition' },
    related: { label: 'Endocrinology', url: 'https://www.montefioreeinstein.org/care/endocrinology/' },
    match: (i) => i.kind === 'recipe' || i.topic === 'Nutrition' || (i.secondaryDepts ?? []).includes('healthy-nutrition'),
    faqs: [
      { q: 'Can changing what I eat reverse prediabetes?',
        a: 'Often, yes. Prediabetes is among the most reversible diagnoses in medicine. Sustained changes to diet and activity return blood sugar to a normal range for a substantial share of people, and the earlier the change, the better it works. It is worth doing with a clinician rather than alone, because the target is a durable habit rather than a short diet.' },
      { q: 'How much sugar a day is too much?',
        a: 'Guidance sets added sugar at under about 10 per cent of daily calories, roughly 50 grams for most adults, with real benefit below 25 grams. The practical version: sugar you add is the one to count, and the largest single source for most households is what they drink rather than what they eat.' },
    ],
  },
];
export const topicItems = (t) => CATALOG.filter(t.match).sort(byDate);
