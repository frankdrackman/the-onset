// Layer 2 — four editorial pillars (curation lenses).
//
// By design these carry NO entity or schema weight. They ride over the department
// axis as human-facing lenses so editorial labels never dilute the genuine ME entity
// signals. Nothing in schema.mjs may emit a pillar as an `about` entity.

export const PILLARS = [
  { slug: 'prevent',    label: 'Prevent',    blurb: 'Risk reduction, screening, know your risk, catch it early.' },
  { slug: 'understand', label: 'Understand', blurb: 'Demystify a condition, a diagnosis or a treatment — what is true, and what people fear.' },
  { slug: 'live-well',  label: 'Live Well',  blurb: 'Everyday wellbeing: nutrition, recipes, sleep, movement, stress, hydration.' },
  { slug: 'advance',    label: 'Advance',    blurb: 'What is newer and advancing at Montefiore Einstein — expertise, breakthroughs, innovation.' },
];

export const byPillar = Object.fromEntries(PILLARS.map((p) => [p.slug, p]));

// Layer 3 — two cross-cutting devices. Neither is a topic or a department.
export const DEVICES = {
  patientJourneys: { slug: 'patient-journeys', label: 'Patient Journeys' },
  theLatest:       { slug: 'the-latest',       label: 'The Latest' },
};
