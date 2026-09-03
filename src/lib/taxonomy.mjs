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
import { BODIES } from '../data/bodies.mjs';
import { findProfile } from '../data/profiles.mjs';
import { headshotFor } from '../data/headshots.mjs';

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
  image: `img/${e.slug}.jpg`,
  topic: `S${e.season} · E${e.episode}`,
  published: e.published,
  updated: e.published,
  standfirst: e.summary,
  byline: { name: e.guest, role: e.guestSpecialty, dept: e.dept, pending: false, guest: true },
  lang: 'en',
  es: false,
  lohud: false,
  series: SERIES.name,
});

/**
 * Canonical department from the CONTRIBUTOR'S OWN SPECIALTY.
 *
 * The brief's classification order tags by topic first and falls back to the author's
 * department. In practice topic keywords misfile pieces — an IBS article bylined by a
 * gastroenterologist landed under Primary Care — so the contributor's stated
 * specialty wins where they state one, and topic classification is the fallback.
 *
 * Ordered most specific first: a body-system specialty beats an age group, so
 * "Pediatric Urology" resolves to Urology rather than Children's Health.
 */
const SPECIALTY_DEPT = [
  [/\b(RD|RDN|CDN|CDCES|Clinical Nutrition|Nutrition Program|dietiti)/i, 'healthy-nutrition'],
  [/gastroenterolog|hepatolog|inflammatory bowel/i, 'gastroenterology'],
  [/transplant/i,                                   'transplant'],
  [/urolog/i,                                       'urology'],
  [/dermatolog/i,                                   'dermatology'],
  [/cardiolog|heart failure|electrophysiolog|cardiothoracic|cardiovascular/i, 'heart-care'],
  [/neurolog|neurosurg|stroke|epileps|headache|multiple sclerosis/i,          'brain-nerve-care'],
  [/oncolog|cancer|hematolog|breast patholog|radiation/i,                     'cancer-care'],
  [/endocrinolog|diabet|thyroid/i,                  'endocrinology'],
  [/psychiatr|psycholog|behavioral health/i,        'behavioral-health'],
  [/obstetric|gynecolog|women'?s health|urogynecolog|maternal/i, 'womens-health'],
  [/allerg|immunolog/i,                             'allergy-immunology'],
  [/sleep/i,                                        'sleep-medicine'],
  [/otolaryngolog|otorhinolaryngolog|\bENT\b/i,     'ear-nose-throat'],
  [/orthoped|rehabilitat|physiatr|sports medicine/i, 'orthopedics-rehab'],
  [/pediatric|adolescent|children/i,                'pediatrics'],
  [/pulmonar|infectious|geriatric|internal medicine|family medicine|primary care|general medicine/i, 'primary-care'],
];
const deptFromSpecialty = (byline) => {
  const hay = `${byline?.role ?? ''} ${byline?.name ?? ''}`;
  if (!hay.trim()) return null;
  for (const [re, slug] of SPECIALTY_DEPT) if (re.test(hay)) return slug;
  return null;
};

/** Merge in anything the ingested article bodies tell us. The body is the primary
 *  source: it carries the byline the public index did not, the article's own link to
 *  its Spanish twin, and enough words to compute a real read time. */
const enrich = (i) => {
  const b = BODIES[i.slug];
  // Bind any known byline to its live Find a Doctor profile, whichever source named it.
  const bind = (by) => {
    if (!by?.name) return by;
    const p = findProfile(by.name);
    const merged = p ? { ...by, name: p.name, profileUrl: p.sameAs, npi: p.npi } : by;
    const photo = headshotFor(merged.name);
    return photo ? { ...merged, photo } : merged;
  };
  if (!b) return { ...i, byline: bind(i.byline) };
  const words = b.paras.reduce((n, p) => n + p.text.split(/\s+/).length, 0);
  // PULL QUOTE — a line lifted from the article's own body, typographic emphasis
  // only. Per the wireframe these pieces do not quote physicians, so there is no
  // attribution and no speaker. Prefer a sentence the piece already sets in quotes;
  // otherwise take a substantial sentence from the middle, never the opener.
  const sentences = [];
  b.paras.forEach((para, idx) => {
    if (para.tag !== 'p' || idx === 0) return;
    const quoted = para.text.match(/[\u201c"][^\u201d"]{50,200}[\u201d"]/);
    if (quoted) sentences.push({ text: quoted[0].replace(/^[\u201c"]|[\u201d",]$/g, '').trim(), rank: 0, idx });
    para.text.split(/(?<=[.!?])\s+/).forEach((sent) => {
      const t = sent.trim();
      if (t.length >= 90 && t.length <= 210 && !/^[\u201c"]/.test(t) && !/\b(call|appointment|visit|learn more)\b/i.test(t)) {
        sentences.push({ text: t, rank: 1, idx });
      }
    });
  });
  const mid = b.paras.length / 2;
  sentences.sort((a, x) => a.rank - x.rank || Math.abs(a.idx - mid) - Math.abs(x.idx - mid));
  const pullQuote = sentences.length ? sentences[0].text : null;

  // CARD SUBHEAD. Prefer the publisher's own teaser; where that was dropped as a
  // fragment, fall back to the article's opening sentences. Both are the piece's own
  // words — nothing is written here.
  const firstPara = b.paras.find((p) => p.tag === 'p' && p.text.length > 80);
  let subhead = null;
  if (firstPara) {
    const t = firstPara.text.trim();
    if (t.length <= 240) subhead = t;
    else {
      // Trim back to a sentence boundary rather than cutting mid-word.
      const cut = t.slice(0, 240);
      const stop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('? '), cut.lastIndexOf('! '));
      subhead = stop > 90 ? cut.slice(0, stop + 1) : cut.slice(0, cut.lastIndexOf(' ')) + '…';
    }
  }

  // The publisher's own lead image, referenced at a sensible width. This is the
  // viewer's browser loading an image, not a crawl. For a self-contained build the
  // art should be downloaded and served locally — see ingest/CODEX-PROMPT-HTML.md.
  const img = b.meta?.image
    ? b.meta.image.split('?')[0] + '?width=1200&disable=upscale&format=pjpg&auto=webp'
    : null;
  return {
    ...i,
    body: b.paras,
    ...(pullQuote ? { pullQuote } : {}),
    subhead: i.standfirst || subhead || null,
    ...(img ? { image: img, imageRemote: true, imageCredit: b.meta?.imageAlt ?? null } : {}),
    words,
    minutes: Math.max(1, Math.round(words / 225)),
    // The article's own byline fills gaps the search index left, but where we already
    // bound the clinician to a live Find a Doctor profile, that directory name is the
    // canonical entity name and wins.
    byline: b.byline
      ? {
          ...i.byline,
          name: i.byline?.profileUrl ? i.byline.name : b.byline.name.split(',').slice(0, 2).join(',').trim(),
          // Drop credential tokens from the role — they are already in the name.
          role: (b.byline.role || '')
            .replace(/^(?:(?:MSc|RDN|CNSC|FACOG|FACC|FHRS|MPH|PhD|CDN|MD|DO|RD|MS|NP|PA)\.?,?\s*)+/i, '')
            .replace(/^(?:and|for)\s+/i, '').trim().replace(/[,\s]+$/, '') || null,
          dept: i.dept,
          pending: false,
          reviewer: /\b(RD|RDN|CDN)\b/.test(b.byline.name),
        }
      : i.byline,
    // The article links its own Spanish version, so the twin is confirmed, not assumed.
    es: !!b.spanish,
    spanishTitle: b.spanish?.title ?? null,
  };
};

const enrichBound = (i) => {
  const e = enrich(i);
  if (!e.byline?.name) return e;
  // Bind the profile only if one is not already attached, but ALWAYS look for a
  // headshot — an article can carry a profile URL from the search-index pass and
  // still have no photo attached.
  const p = e.byline.profileUrl ? null : findProfile(e.byline.name);
  const b = p ? { ...e.byline, name: p.name, profileUrl: p.sameAs, npi: p.npi } : e.byline;
  const photo = b.photo ?? headshotFor(b.name);
  const withByline = { ...e, byline: photo ? { ...b, photo } : b };

  // Align the canonical department to the contributor's own specialty. Recipes stay
  // in Healthy Nutrition; the department the topic keywords had guessed drops to a
  // secondary tag, so the item still cross-surfaces where it used to appear.
  const aligned = withByline.kind === 'recipe' ? null : deptFromSpecialty(withByline.byline);
  if (!aligned || aligned === withByline.dept) return withByline;
  const secondary = [...new Set([...(withByline.secondaryDepts ?? []), withByline.dept])]
    .filter((d) => d !== aligned);
  return { ...withByline, dept: aligned, secondaryDepts: secondary, deptFromByline: true };
};

export const CATALOG = [...ITEMS.map(enrichBound), ...EPISODES.map(fromEpisode)];

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

/** Every title in both feeds is now the publisher's real headline. */
export const displayTitle = (i) => i.title;

/** The offset hero is built around a standfirst, so a hero slot prefers an item that
 *  actually has one. Not every LoHud teaser survived the fragment filter, and a hero
 *  with a bare headline wastes the module. */
export const preferWithStandfirst = (items) => {
  const withText = items.filter((i) => i.standfirst);
  return withText.length ? [...withText, ...items.filter((i) => !i.standfirst)] : items;
};

/** The Latest — the ticker's source lens. Curated: editorial pins lead, then
 *  reverse-chronological by editor-set date. Capped at 6–10 items per the brief. */
export const theLatest = (limit = 8) =>
  // Reverse-chronological by editor-set date, which is what The Latest is. Editorial
  // pins would lead here; there is no editorial mandate in the prototype, so the feed
  // speaks for itself. Episodes are excluded — a season drop would flood every slot.
  CATALOG.filter((i) => i.kind !== 'episode').sort(byDate).slice(0, limit);

/** Department shelves for the hub home — only departments that actually have
 *  content, ordered by how much they have. Zero-item sections are never padded. */
export const shelves = (n = Infinity, per = 4) =>
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
