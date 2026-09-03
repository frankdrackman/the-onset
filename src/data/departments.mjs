// Layer 1 — the clinical-department axis (primary, entity-bearing).
//
// TWO-LAYER LABEL DISCIPLINE (brief, GEO & AI-Search Requirements):
//   `label`  is the friendly human browse label. It is never re-cut to the entity
//            name and it carries NO schema weight.
//   `entity` is the live ME entity the label binds to behind the scenes. This is
//            what carries the schema weight, via sameAs/about on the department page.
//
// Entity URLs below are prototype bindings, structurally correct but pending SEO's
// certified entity map. See README, Known gaps.

export const DEPARTMENTS = [
  {
    slug: 'heart-care', label: 'Heart Care', clinical: true,
    entity: { name: 'Montefiore Einstein Department of Cardiology', url: 'https://www.montefioreeinstein.org/care/heart/' },
    intro: 'Heart Care gathers what Montefiore Einstein cardiologists write and say about the heart — how to read your own risk, what the numbers on a lab report actually mean, and what treatment looks like from the inside. Every piece is bylined by a named clinician who treats these conditions.',
    findCare: { label: 'Find a cardiologist', url: 'https://www.montefioreeinstein.org/doctors/?specialty=cardiology' },
    topics: ['Blood pressure', 'Heart rhythm', 'Cholesterol', 'Heart surgery', 'Nutrition'],
  },
  {
    slug: 'brain-nerve-care', label: 'Brain & Nerve Care', clinical: true,
    // Binds to the neuroscience umbrella; Neurology and Neurosurgery bind at item level.
    entity: { name: 'Montefiore Einstein Neuroscience', url: 'https://www.montefioreeinstein.org/care/neuroscience/' },
    intro: 'Brain & Nerve Care covers stroke, memory, epilepsy, migraine and the nervous system, written by the Montefiore Einstein neurologists and neurosurgeons who treat them. Start here when you want to know what a symptom means and when it needs to be seen today.',
    findCare: { label: 'Find a neurologist', url: 'https://www.montefioreeinstein.org/doctors/?specialty=neurology' },
    topics: ['Stroke', 'Memory', 'Epilepsy', 'Migraine'],
  },
  {
    slug: 'cancer-care', label: 'Cancer Care', clinical: true,
    entity: { name: 'Montefiore Einstein Comprehensive Cancer Center', url: 'https://www.montefioreeinstein.org/cancer/' },
    intro: 'Cancer Care brings together screening guidance, treatment explainers and survivorship from the Montefiore Einstein Comprehensive Cancer Center, an NCI-designated centre. It is written for the moment before a decision, not after one.',
    findCare: { label: 'Find an oncologist', url: 'https://www.montefioreeinstein.org/doctors/?specialty=oncology' },
    topics: ['Screening', 'Treatment', 'Survivorship', 'Nutrition'],
  },
  {
    slug: 'urology', label: 'Urology', clinical: true,
    entity: { name: 'Montefiore Einstein Department of Urology', url: 'https://www.montefioreeinstein.org/care/urology/' },
    intro: 'Urology covers the kidneys, bladder and prostate — the conditions people are least likely to ask about and most likely to search for. Written plainly by Montefiore Einstein urologists.',
    findCare: { label: 'Find a urologist', url: 'https://www.montefioreeinstein.org/doctors/?specialty=urology' },
    topics: ['Prostate', 'Kidney', 'Bladder'],
  },
  {
    slug: 'endocrinology', label: 'Endocrinology', clinical: true,
    entity: { name: 'Montefiore Einstein Division of Endocrinology', url: 'https://www.montefioreeinstein.org/care/endocrinology/' },
    intro: 'Endocrinology covers diabetes, thyroid and metabolic health — the systems that shift slowly and are easiest to change early. Montefiore Einstein endocrinologists explain what the numbers mean and what actually moves them.',
    findCare: { label: 'Find an endocrinologist', url: 'https://www.montefioreeinstein.org/doctors/?specialty=endocrinology' },
    topics: ['Diabetes', 'Thyroid', 'Blood sugar', 'Nutrition'],
  },
  {
    slug: 'behavioral-health', label: 'Behavioral Health', clinical: true,
    // Psychology and Child & Adolescent Psychiatry bind here as keywords, not entities.
    entity: { name: 'Montefiore Einstein Department of Psychiatry and Behavioral Sciences', url: 'https://www.montefioreeinstein.org/care/psychiatry/' },
    intro: 'Behavioral Health covers mood, anxiety, sleep and stress, and the everyday mechanics of getting help. Written by Montefiore Einstein psychiatrists and psychologists in the language people actually use about their own minds.',
    findCare: { label: 'Find a behavioral health clinician', url: 'https://www.montefioreeinstein.org/doctors/?specialty=psychiatry' },
    topics: ['Anxiety', 'Mood', 'Stress', 'Family'],
  },
  {
    slug: 'orthopedics-rehab', label: 'Orthopedics & Rehab', clinical: true,
    entity: { name: 'Montefiore Einstein Department of Orthopedic Surgery', url: 'https://www.montefioreeinstein.org/care/orthopedics/' },
    intro: 'Orthopedics & Rehab covers joints, bones, injury and the long road back to moving well. Montefiore Einstein surgeons and rehabilitation clinicians on what recovery really asks of you.',
    findCare: { label: 'Find an orthopedic specialist', url: 'https://www.montefioreeinstein.org/doctors/?specialty=orthopedics' },
    topics: ['Joints', 'Injury', 'Recovery'],
  },
  {
    slug: 'primary-care', label: 'Primary Care', clinical: true,
    entity: { name: 'Montefiore Einstein Department of Medicine', url: 'https://www.montefioreeinstein.org/care/primary-care/' },
    intro: 'Primary Care is the front door — screening, prevention, and the judgement call about whether something needs a visit. Written by the Montefiore Einstein internists who make that call every day.',
    findCare: { label: 'Find a primary care doctor', url: 'https://www.montefioreeinstein.org/doctors/?specialty=primary-care' },
    topics: ['Screening', 'Prevention', 'Hydration'],
  },
  {
    slug: 'allergy-immunology', label: 'Allergy & Immunology', clinical: true, thin: true,
    entity: { name: 'Montefiore Einstein Division of Allergy and Immunology', url: 'https://www.montefioreeinstein.org/care/allergy/' },
    intro: 'Allergy & Immunology covers reactions, asthma and the immune system, from Montefiore Einstein allergists.',
    findCare: { label: 'Find an allergist', url: 'https://www.montefioreeinstein.org/doctors/?specialty=allergy' },
    topics: ['Allergies', 'Asthma'],
  },
  {
    slug: 'sleep-medicine', label: 'Sleep Medicine', clinical: true, thin: true,
    entity: { name: 'Montefiore Einstein Sleep-Wake Disorders Center', url: 'https://www.montefioreeinstein.org/care/sleep/' },
    intro: 'Sleep Medicine covers apnoea, insomnia and the rest that does not come, from the Montefiore Einstein Sleep-Wake Disorders Center.',
    findCare: { label: 'Find a sleep specialist', url: 'https://www.montefioreeinstein.org/doctors/?specialty=sleep-medicine' },
    topics: ['Sleep apnoea', 'Insomnia'],
  },
  {
    slug: 'ear-nose-throat', label: 'Ear, Nose & Throat', clinical: true, thin: true,
    entity: { name: 'Montefiore Einstein Department of Otorhinolaryngology', url: 'https://www.montefioreeinstein.org/care/ent/' },
    intro: 'Ear, Nose & Throat covers hearing, breathing, sinus and voice, from Montefiore Einstein otolaryngologists.',
    findCare: { label: 'Find an ENT specialist', url: 'https://www.montefioreeinstein.org/doctors/?specialty=ent' },
    topics: ['Hearing', 'Sinus', 'Voice'],
  },
  {
    // NOT a clinical department. The Live Well orphan home, so recipes and general
    // healthy-living content never wear a fake department tag. Deliberately carries
    // NO entity binding — no entity claim is made for it. (Brief: the canonical
    // exception; "recipes ... having no clinical department, their home is
    // Healthy Nutrition".)
    slug: 'healthy-nutrition', label: 'Healthy Nutrition', clinical: false,
    entity: null,
    intro: 'Healthy Nutrition is where the recipes live, alongside everyday healthy living — sleep, movement, hydration, stress. Reviewed by Montefiore Einstein dietitians. It is not a clinical department, and it does not pretend to be one.',
    findCare: { label: 'Find a dietitian', url: 'https://www.montefioreeinstein.org/doctors/?specialty=nutrition' },
    topics: ['Recipes', 'Movement', 'Sleep', 'Hydration'],
  },
];

export const byDept = Object.fromEntries(DEPARTMENTS.map((d) => [d.slug, d]));
export const deptLabel = (slug) => byDept[slug]?.label ?? slug;
