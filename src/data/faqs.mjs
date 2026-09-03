// Article-level FAQs — the editorial store.
//
// WHY THIS IS EMPTY. The brief allows FAQPage "only where genuine question-and-answer
// content exists". All 141 source articles were checked: none carries FAQPage
// structured data, and none carries a reader question with a standalone answer. So
// there is nothing here to lift. Writing the questions and clinical answers is an
// editorial task for Montefiore Einstein — they publish under named physicians on
// ME's own domain, so they need the same review any clinical copy gets.
//
// THE CONTRACT. Key on the article slug from articles.mjs. Two or three questions is
// the useful range; more reads as padding. Write the question the way a reader would
// type it, not the way a clinician would title it, and make each answer stand alone —
// an engine lifting it will not carry the surrounding page with it.
//
//   'most-strokes-are-preventable-cut-your-stroke-risk-by-80': {
//     reviewedBy: 'Charles C. Esenwa, MD',
//     reviewed: '2026-09-03',
//     items: [
//       { q: 'Can you really cut stroke risk by 80 percent?',
//         a: 'Two or three sentences that answer the question on their own…' },
//     ],
//   },
//
// Anything added here appears on the detail page and emits FAQPage schema
// automatically. Nothing else needs changing.

export const ARTICLE_FAQS = {};

/**
 * PLACEHOLDER Q&A, so the section can be judged on every article before the copy
 * exists. Deliberately Latin: it is unmistakably not content, and it cannot be read
 * as a medical claim under a named physician's byline — which invented English
 * questions and answers on these pages would be.
 *
 * Placeholder entries NEVER emit FAQPage schema. Only real copy in ARTICLE_FAQS does.
 */
export const PLACEHOLDER_FAQS = [
  { q: 'Quaestio prima de hac re quam lector saepe rogat?',
    a: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.' },
  { q: 'Quaestio altera, brevior sed non minus utilis?',
    a: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.' },
  { q: 'Quaestio tertia quae rem totam concludit?',
    a: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.' },
];

/** Entries for one article, or null. Empty objects never reach the page or schema. */
export const faqsFor = (slug) => {
  const rec = ARTICLE_FAQS[slug];
  return rec?.items?.length ? rec : null;
};

/** Editorial coverage, for the build report. */
export const faqCoverage = (slugs) => {
  const done = slugs.filter((s) => faqsFor(s));
  return { done: done.length, total: slugs.length, slugs: done };
};
