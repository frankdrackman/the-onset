// Structured data. Every builder here emits into the SERVER-RENDERED HTML — nothing
// is injected after load, which the brief lists as a foundational condition before
// any schema helps at all.
//
// Rules encoded here, straight from the brief:
//   · ME is the MedicalOrganization publisher. The hub is a Brand ON that
//     organization and a CollectionPage that isPartOf it — never a competing
//     Organization of its own.
//   · Pillars carry NO schema weight. Nothing below ever emits a pillar as `about`.
//   · Friendly browse labels are never the entity. `about` binds to the live ME
//     entity behind the label, via its sameAs URL.
//   · Every physician byline is a Person with a sameAs to Find a Doctor, so the
//     byline is corroborable rather than asserted.
//   · Recipes and Healthy Nutrition make NO entity claim (entity: null).

import { HUB } from '../data/site.mjs';
import { byDept } from '../data/departments.mjs';
import { SERIES } from '../data/episodes.mjs';
import { itemPath, deptPath, seriesPath, TYPE_LABEL, displayTitle } from './taxonomy.mjs';

const abs = (path) => `${HUB.origin}${path}`;
const ME_ID = `${HUB.origin}/#organization`;
const HUB_ID = `${HUB.origin}${HUB.path}/#collection`;

/** ME as publisher. One node, referenced by @id everywhere else. */
export const meOrganization = () => ({
  '@type': 'MedicalOrganization',
  '@id': ME_ID,
  name: 'Montefiore Einstein',
  url: HUB.publisherUrl,
  brand: {
    // The hub's own name lives here — a Brand on ME, not a rival Organization.
    '@type': 'Brand',
    '@id': `${HUB.origin}${HUB.path}/#brand`,
    name: HUB.name,
    slogan: HUB.tagline,
    url: abs(`${HUB.path}/`),
  },
});

/** The hub itself. */
export const hubCollection = () => ({
  '@type': 'CollectionPage',
  '@id': HUB_ID,
  name: HUB.name,
  headline: HUB.tagline,
  description: HUB.standfirst,
  url: abs(`${HUB.path}/`),
  isPartOf: { '@id': ME_ID },
  publisher: { '@id': ME_ID },
  inLanguage: ['en', 'es'],
});

/** Breadcrumbs on every content page. */
export const breadcrumbs = (trail) => ({
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((c, i) => ({
    '@type': 'ListItem', position: i + 1, name: c.label,
    ...(c.href ? { item: abs(c.href) } : {}),
  })),
});

/** A physician byline as a corroborable Person.
 *  `pending: true` bylines are the wireframe's placeholders — they still emit the
 *  correct shape, minus the sameAs, which would otherwise be a fabricated claim. */
export const person = (byline) => {
  if (!byline?.name) return undefined;   // no author node where there is no author
  const dept = byDept[byline.dept];
  const node = {
    '@type': byline.reviewer ? 'Person' : 'Physician',
    name: byline.name,
    ...(byline.role ? { jobTitle: byline.role } : {}),
    ...(byline.reviewer ? {} : { medicalSpecialty: dept?.entity?.name ?? undefined }),
    affiliation: { '@id': ME_ID },
  };
  // sameAs binds the byline to the live Find a Doctor profile. Omitted while the
  // byline is a placeholder rather than a named clinician.
  if (!byline.pending && byline.profileUrl) node.sameAs = byline.profileUrl;
  return node;
};

/** The answer-first block, marked speakable. */
export const speakable = () => ({
  '@type': 'SpeakableSpecification',
  cssSelector: ['.in-short', '.answer-first'],
});

/** FAQPage — only where genuine question-and-answer content exists. */
export const faqPage = (faqs) =>
  faqs?.length
    ? {
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({
          '@type': 'Question', name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

/** Department / clinical collection page. `about` binds to the ME ENTITY behind the
 *  friendly label — and is omitted entirely where there is no entity to claim. */
export const departmentPage = (dept, count) => {
  const node = {
    '@type': 'MedicalWebPage',
    '@id': `${abs(deptPath(dept.slug))}#page`,
    name: `${dept.label} — ${HUB.name}`,
    description: dept.intro,
    url: abs(deptPath(dept.slug)),
    isPartOf: { '@id': HUB_ID },
    publisher: { '@id': ME_ID },
    inLanguage: 'en',
    speakable: speakable(),
    mainEntity: { '@type': 'ItemList', numberOfItems: count },
  };
  if (dept.entity) {
    node.about = {
      '@type': 'MedicalOrganization',
      name: dept.entity.name,
      url: dept.entity.url,
      sameAs: dept.entity.url,
      parentOrganization: { '@id': ME_ID },
    };
  }
  return node;
};

/** A LoHud-sourced article or patient journey on its ME-canonical page.
 *  publisher AND sponsor are both ME — the brief's attribution rule, which is how
 *  authority accrues to ME rather than to the third-party domain. */
export const articlePage = (item) => ({
  '@type': ['Article', 'MedicalWebPage'],
  '@id': `${abs(itemPath(item))}#article`,
  headline: item.title,
  description: item.standfirst,
  url: abs(itemPath(item)),
  datePublished: item.published,
  dateModified: item.updated,
  inLanguage: item.lang,
  ...(person(item.byline) ? { author: person(item.byline) } : {}),
  publisher: { '@id': ME_ID },
  sponsor: { '@id': ME_ID },
  isPartOf: { '@id': HUB_ID },
  speakable: speakable(),
  ...(byDept[item.dept]?.entity
    ? { about: { '@type': 'MedicalOrganization', name: byDept[item.dept].entity.name, sameAs: byDept[item.dept].entity.url } }
    : {}),
  ...(item.es ? { workTranslation: { '@type': 'Article', inLanguage: 'es', url: `${abs(itemPath(item))}?lang=es` } } : {}),
});

/** Recipe schema — the most winnable content on the hub. */
export const recipePage = (item) => ({
  '@type': 'Recipe',
  '@id': `${abs(itemPath(item))}#recipe`,
  name: item.title,
  description: item.standfirst,
  url: abs(itemPath(item)),
  datePublished: item.published,
  inLanguage: item.lang,
  publisher: { '@id': ME_ID },
  isPartOf: { '@id': HUB_ID },
  // The dietitian is the reviewer, not the author — the credibility signal that
  // separates this from a food blog. Emitted only where the reviewer is known.
  ...(person(item.byline)
    ? { review: { '@type': 'Review', author: person(item.byline),
        reviewBody: 'Reviewed by a Montefiore Einstein registered dietitian.' } }
    : {}),
});

/** A Balance episode. The video lives on YouTube; this page owns the citable text. */
export const videoPage = (ep) => ({
  '@type': 'VideoObject',
  '@id': `${abs(itemPath(ep))}#video`,
  name: ep.title,
  thumbnailUrl: ep.thumbnail,
  interactionStatistic: { '@type': 'InteractionCounter',
    interactionType: 'https://schema.org/WatchAction', userInteractionCount: ep.views },
  description: ep.summary,
  url: abs(itemPath(ep)),
  contentUrl: ep.youtube,
  embedUrl: ep.youtube,
  uploadDate: ep.published,
  duration: `PT${ep.minutes}M`,
  inLanguage: 'en',
  publisher: { '@id': ME_ID },
  isPartOf: { '@id': HUB_ID },
  partOfSeries: { '@type': 'CreativeWorkSeries', name: SERIES.fullName, url: abs(seriesPath()) },
  partOfSeason: { '@type': 'CreativeWorkSeason', seasonNumber: ep.season },
  episodeNumber: ep.episode,
  // The on-page transcript as extractable text, chaptered and mirrored in hasPart.
  // The real, complete transcript as extractable text — this is what makes the
  // ME-domain page the citable layer for a video that lives on YouTube.
  transcript: ep.transcript.map((c) => c.text).join(' ').replace(/\s+/g, ' ').trim(),
  hasPart: ep.chapters.map((c, i) => ({
    '@type': 'Clip', name: c.label, startOffset: Math.round(c.ms / 1000),
    url: `${abs(itemPath(ep))}#t${i}`,
  })),
  actor: [
    { '@type': 'Person', name: SERIES.host.name, jobTitle: SERIES.host.role, affiliation: { '@id': ME_ID } },
    { '@type': 'Physician', name: ep.guest, medicalSpecialty: ep.guestSpecialty, affiliation: { '@id': ME_ID } },
  ],
  speakable: speakable(),
});

const toSeconds = (t) => {
  const [m, s] = t.split(':').map(Number);
  return m * 60 + s;
};

/** The series page. */
export const seriesGraph = (episodes) => ({
  '@type': 'CreativeWorkSeries',
  '@id': `${abs(seriesPath())}#series`,
  name: SERIES.fullName,
  alternateName: SERIES.name,
  description: SERIES.description,
  url: abs(seriesPath()),
  publisher: { '@id': ME_ID },
  isPartOf: { '@id': HUB_ID },
  numberOfEpisodes: episodes.length,
  numberOfSeasons: SERIES.seasons.length,
  author: { '@type': 'Person', name: SERIES.host.name, jobTitle: SERIES.host.role, affiliation: { '@id': ME_ID } },
  hasPart: episodes.map((e) => ({ '@type': 'VideoObject', name: e.title, url: abs(itemPath(e)) })),
});

/** Assemble one @graph per page. Nulls are dropped so we never emit empty nodes —
 *  an empty FAQPage is worse than no FAQPage. */
export const graph = (...nodes) => ({
  '@context': 'https://schema.org',
  '@graph': nodes.flat().filter(Boolean),
});

export { ME_ID, HUB_ID, abs };
