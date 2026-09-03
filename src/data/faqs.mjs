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
