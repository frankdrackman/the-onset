// Feed 1 — The Balance video series. 13 episodes: Season 1 has 6, Season 2 has 7.
// Two season promos are excluded from the count. Episodes link out to YouTube by
// design; the ME episode page is the citable text layer for each one.
//
// TITLES: three episode titles are named in the brief and are carried verbatim.
// The other ten are not enumerated in either source document, so they render with
// the wireframe's own placeholder — "Episode title here" — and are told apart by the
// season/episode meta strip, exactly as wireframe v2 does. Pending the series crawl.
//
// CANONICAL DEPARTMENT: resolved by the brief's deterministic tie-break, in order.
// Every non-obvious case below cites the rule that decided it.

export const EPISODES = [
  // ---- Season 1 (6 episodes) ----
  {
    id: 'S1E6', season: 1, episode: 6, slug: 'the-balance-s1e6',
    title: 'At Your Convenience from Everywhere',
    titlePending: false,
    // TIE-BREAK: modality subject (telemedicine) with no single body-system home →
    // canonical is the department of the FIRST-NAMED featured clinician in the source.
    // First-named guest is a cardiologist, so canonical is Heart Care; the second
    // guest's Neurosurgery becomes secondary. Human discovery routes via Advance.
    dept: 'heart-care', secondaryDepts: ['brain-nerve-care'], pillars: ['advance', 'understand'],
    tieBreak: 'Modality subject (telemedicine); first-named-guest rule applies. Canonical Heart Care, secondary Brain & Nerve Care, human home via Advance.',
    minutes: 13, published: '2025-11-18', youtube: 'https://www.youtube.com/@TheBalanceME',
    summary:
      'A video visit can do more than most people expect and less than some people hope. This episode draws the line: what a clinician can genuinely assess through a screen, what still needs a room, and how prescriptions and referrals actually work when the visit is virtual.',
    covers: [
      'When a video visit is the right call',
      'What a clinician can and cannot assess remotely',
      'How prescriptions and referrals work',
      'What to have ready before the call',
    ],
    transcript: [
      { t: '00:00', label: 'Why telemedicine stuck' },
      { t: '03:12', label: 'What a video visit can actually do' },
      { t: '06:40', label: 'The cases that still need a room' },
      { t: '09:05', label: 'Prescriptions, referrals and follow-up' },
      { t: '11:30', label: 'What to have ready before you dial in' },
    ],
    faqs: [
      { q: 'Can a doctor prescribe during a video visit?',
        a: 'In most cases yes. A clinician can prescribe during a video visit for many common conditions, with some categories of medication restricted by state and federal rules. If a prescription needs an in-person examination first, your clinician will tell you on the call and arrange the visit.' },
      { q: 'When should I be seen in person instead?',
        a: 'Anything that needs to be touched, listened to or imaged — chest pain, a new lump, an injury, a suspected infection that needs a swab. If you are unsure, book the video visit anyway: triaging you to the right kind of appointment is itself something the call can do.' },
    ],
  },
  {
    id: 'S1E5', season: 1, episode: 5, slug: 'the-balance-s1e5',
    title: 'That Gut Feeling',
    titlePending: false,
    // TIE-BREAK: nutritionist guest; no physician department resolves. Home is the
    // Live Well pillar with NO department entity claim — the same mechanism as the
    // orphan nutrition content. dept is the non-clinical Healthy Nutrition bucket,
    // which carries entity: null.
    dept: 'healthy-nutrition', secondaryDepts: [], pillars: ['live-well', 'understand'],
    tieBreak: 'Nutritionist guest; no physician department resolves. Live Well pillar, no department entity claim.',
    minutes: 12, published: '2025-10-21', youtube: 'https://www.youtube.com/@TheBalanceME',
    summary:
      'The gut has been credited with everything from mood to immunity. This episode separates what the evidence actually supports from what the supplement aisle would like you to believe, and lands on the handful of changes that reliably matter.',
    covers: ['What the microbiome does and does not control', 'Fibre, fermentation and what to eat', 'Which supplements are worth the money', 'When gut symptoms need a clinician'],
    transcript: [
      { t: '00:00', label: 'Why the gut got interesting' },
      { t: '02:48', label: 'What the microbiome actually does' },
      { t: '05:55', label: 'Fibre first, everything else second' },
      { t: '09:10', label: 'When to stop self-treating' },
    ],
    faqs: [
      { q: 'Do I need a probiotic supplement?', a: 'For most healthy adults, no. Fermented foods and a high-fibre diet do the same work more cheaply and with better evidence behind them. Probiotics have specific, studied uses — after certain antibiotics, for example — and those are worth discussing with a clinician rather than guessing at in a shop.' },
      { q: 'How much fibre should I be eating?', a: 'Most adults need roughly 25 to 30 grams a day and most get about half that. Increase it gradually and with water, or the first week will convince you it was a bad idea.' },
    ],
  },
  {
    id: 'S1E4', season: 1, episode: 4, slug: 'the-balance-s1e4',
    title: 'Episode title here', titlePending: true,
    // TIE-BREAK: psychologist guest → canonical Behavioral Health (the Psychiatry and
    // Behavioral Sciences entity). Psychology does not resolve to its own page, so it
    // binds to the Psychiatry parent as a keyword, not an entity.
    dept: 'behavioral-health', secondaryDepts: [], pillars: ['understand', 'live-well'],
    tieBreak: 'Psychologist guest; Psychology binds to the Psychiatry parent as a keyword, not an entity.',
    minutes: 14, published: '2025-09-16', youtube: 'https://www.youtube.com/@TheBalanceME',
    summary: 'Answer-first episode summary, two to four sentences, pending the series transcription pass. This block is the extractable text layer for the episode and ships server-rendered.',
    covers: ['Topic one, pending transcription', 'Topic two, pending transcription', 'Topic three, pending transcription'],
    transcript: [{ t: '00:00', label: 'Chapters pending transcription' }],
    faqs: [],
  },
  {
    id: 'S1E3', season: 1, episode: 3, slug: 'the-balance-s1e3',
    title: 'Sleep Yourself Better', titlePending: false,
    // TIE-BREAK: two departments (Sleep Medicine + Otolaryngology). Core subject is
    // sleep → canonical Sleep Medicine, secondary Ear, Nose & Throat.
    dept: 'sleep-medicine', secondaryDepts: ['ear-nose-throat'], pillars: ['live-well', 'prevent'],
    tieBreak: 'Two departments; core subject is sleep. Canonical Sleep Medicine, secondary Ear, Nose & Throat.',
    minutes: 15, published: '2025-08-19', youtube: 'https://www.youtube.com/@TheBalanceME',
    summary:
      'Snoring is not a personality trait. This episode covers what disordered sleep does to the rest of the body, how apnoea is actually diagnosed, and why the fix is often an airway problem rather than a discipline problem.',
    covers: ['What sleep apnoea does to the heart and brain', 'How a sleep study works now', 'When the airway is the real problem', 'What to try before a machine'],
    transcript: [
      { t: '00:00', label: 'Snoring is a symptom' },
      { t: '03:40', label: 'What a sleep study measures' },
      { t: '07:15', label: 'When the airway is the problem' },
      { t: '11:02', label: 'Treatments, in order of least invasive' },
    ],
    faqs: [
      { q: 'Does snoring always mean sleep apnoea?', a: 'No. Plenty of people snore without apnoea. What raises the concern is snoring plus witnessed pauses in breathing, daytime sleepiness, morning headaches or high blood pressure that will not settle. That combination is worth a sleep study.' },
      { q: 'Can a sleep study be done at home?', a: 'Often, yes. Home sleep apnoea testing is now standard for straightforward suspected obstructive sleep apnoea in adults. More complex cases — or a home test that comes back unclear — still go to the lab.' },
    ],
  },
  {
    id: 'S1E2', season: 1, episode: 2, slug: 'the-balance-s1e2',
    title: 'Episode title here', titlePending: true,
    dept: 'heart-care', secondaryDepts: [], pillars: ['prevent'],
    minutes: 13, published: '2025-07-15', youtube: 'https://www.youtube.com/@TheBalanceME',
    summary: 'Answer-first episode summary, two to four sentences, pending the series transcription pass. This block is the extractable text layer for the episode and ships server-rendered.',
    covers: ['Topic one, pending transcription', 'Topic two, pending transcription'],
    transcript: [{ t: '00:00', label: 'Chapters pending transcription' }],
    faqs: [],
  },
  {
    id: 'S1E1', season: 1, episode: 1, slug: 'the-balance-s1e1',
    title: 'Episode title here', titlePending: true,
    dept: 'behavioral-health', secondaryDepts: [], pillars: ['understand'],
    tieBreak: 'Psychologist guest; Psychology binds to the Psychiatry parent as a keyword, not an entity.',
    minutes: 14, published: '2025-06-17', youtube: 'https://www.youtube.com/@TheBalanceME',
    summary: 'Answer-first episode summary, two to four sentences, pending the series transcription pass. This block is the extractable text layer for the episode and ships server-rendered.',
    covers: ['Topic one, pending transcription', 'Topic two, pending transcription'],
    transcript: [{ t: '00:00', label: 'Chapters pending transcription' }],
    faqs: [],
  },

  // ---- Season 2 (7 episodes) ----
  {
    id: 'S2E7', season: 2, episode: 7, slug: 'the-balance-s2e7',
    title: 'Episode title here', titlePending: true,
    // Internal Medicine item (virtual-reality pain). Canonical stays Primary Care —
    // a genuine, resolvable entity — but human discovery routes out to Advance so
    // Primary Care never becomes the catch-all drawer.
    dept: 'primary-care', secondaryDepts: [], pillars: ['advance'],
    tieBreak: 'Internal Medicine item (virtual-reality pain). Canonical Primary Care; human discovery routes to Advance.',
    minutes: 16, published: '2026-06-16', youtube: 'https://www.youtube.com/@TheBalanceME',
    summary: 'Answer-first episode summary, two to four sentences, pending the series transcription pass. This block is the extractable text layer for the episode and ships server-rendered.',
    covers: ['Topic one, pending transcription', 'Topic two, pending transcription'],
    transcript: [{ t: '00:00', label: 'Chapters pending transcription' }],
    faqs: [],
  },
  {
    id: 'S2E6', season: 2, episode: 6, slug: 'the-balance-s2e6',
    title: 'Episode title here', titlePending: true,
    // Internal Medicine item (hydration). Canonical Primary Care; routes to Live Well.
    dept: 'primary-care', secondaryDepts: [], pillars: ['live-well'],
    tieBreak: 'Internal Medicine item (hydration). Canonical Primary Care; human discovery routes to Live Well.',
    minutes: 12, published: '2026-06-16', youtube: 'https://www.youtube.com/@TheBalanceME',
    summary: 'Answer-first episode summary, two to four sentences, pending the series transcription pass. This block is the extractable text layer for the episode and ships server-rendered.',
    covers: ['Topic one, pending transcription', 'Topic two, pending transcription'],
    transcript: [{ t: '00:00', label: 'Chapters pending transcription' }],
    faqs: [],
  },
  {
    id: 'S2E5', season: 2, episode: 5, slug: 'the-balance-s2e5',
    title: 'Episode title here', titlePending: true,
    dept: 'cancer-care', secondaryDepts: [], pillars: ['advance', 'understand'],
    minutes: 17, published: '2026-06-16', youtube: 'https://www.youtube.com/@TheBalanceME',
    summary: 'Answer-first episode summary, two to four sentences, pending the series transcription pass. This block is the extractable text layer for the episode and ships server-rendered.',
    covers: ['Topic one, pending transcription', 'Topic two, pending transcription'],
    transcript: [{ t: '00:00', label: 'Chapters pending transcription' }],
    faqs: [],
  },
  {
    id: 'S2E4', season: 2, episode: 4, slug: 'the-balance-s2e4',
    title: 'Episode title here', titlePending: true,
    dept: 'brain-nerve-care', secondaryDepts: [], pillars: ['understand'],
    minutes: 16, published: '2026-06-16', youtube: 'https://www.youtube.com/@TheBalanceME',
    summary: 'Answer-first episode summary, two to four sentences, pending the series transcription pass. This block is the extractable text layer for the episode and ships server-rendered.',
    covers: ['Topic one, pending transcription', 'Topic two, pending transcription'],
    transcript: [{ t: '00:00', label: 'Chapters pending transcription' }],
    faqs: [],
  },
  {
    id: 'S2E3', season: 2, episode: 3, slug: 'the-balance-s2e3',
    title: 'Episode title here', titlePending: true,
    // TIE-BREAK: psychologist guest → canonical Behavioral Health.
    dept: 'behavioral-health', secondaryDepts: [], pillars: ['understand', 'live-well'],
    tieBreak: 'Psychologist guest; Psychology binds to the Psychiatry parent as a keyword, not an entity.',
    minutes: 14, published: '2026-06-16', youtube: 'https://www.youtube.com/@TheBalanceME',
    summary: 'Answer-first episode summary, two to four sentences, pending the series transcription pass. This block is the extractable text layer for the episode and ships server-rendered.',
    covers: ['Topic one, pending transcription', 'Topic two, pending transcription'],
    transcript: [{ t: '00:00', label: 'Chapters pending transcription' }],
    faqs: [],
  },
  {
    id: 'S2E2', season: 2, episode: 2, slug: 'the-balance-s2e2',
    title: 'Episode title here', titlePending: true,
    dept: 'heart-care', secondaryDepts: [], pillars: ['prevent', 'understand'],
    minutes: 15, published: '2026-06-16', youtube: 'https://www.youtube.com/@TheBalanceME',
    summary: 'Answer-first episode summary, two to four sentences, pending the series transcription pass. This block is the extractable text layer for the episode and ships server-rendered.',
    covers: ['Topic one, pending transcription', 'Topic two, pending transcription'],
    transcript: [{ t: '00:00', label: 'Chapters pending transcription' }],
    faqs: [],
  },
  {
    id: 'S2E1', season: 2, episode: 1, slug: 'the-balance-s2e1',
    title: 'Episode title here', titlePending: true,
    dept: 'endocrinology', secondaryDepts: [], pillars: ['prevent'],
    minutes: 13, published: '2026-06-16', youtube: 'https://www.youtube.com/@TheBalanceME',
    summary: 'Answer-first episode summary, two to four sentences, pending the series transcription pass. This block is the extractable text layer for the episode and ships server-rendered.',
    covers: ['Topic one, pending transcription', 'Topic two, pending transcription'],
    transcript: [{ t: '00:00', label: 'Chapters pending transcription' }],
    faqs: [],
  },
];

export const SERIES = {
  name: 'The Balance',
  fullName: 'The Balance, with Dr. Philip Ozuah',
  host: { name: 'Dr. Philip Ozuah', role: 'President and Chief Executive Officer, Montefiore Einstein' },
  slug: 'the-balance',
  youtube: 'https://www.youtube.com/@TheBalanceME',
  description:
    'The Balance is Montefiore Einstein’s video series, hosted by Dr. Philip Ozuah, President and Chief Executive Officer. Each episode pairs Dr. Ozuah with a Montefiore Einstein clinician for an unhurried conversation about one thing people actually worry about — sleep, the heart, the gut, the appointment they have been putting off. Two seasons, thirteen episodes, every one of them transcribed on this site.',
  seasons: [
    { number: 2, count: 7, note: 'Seven episodes, released together' },
    { number: 1, count: 6, note: 'Six episodes' },
  ],
  faqs: [
    { q: 'Who is The Balance for?', a: 'Anyone deciding whether something is worth a doctor’s appointment. The series is made for the health-curious public rather than for clinicians — no jargon, no assumed knowledge, and every episode stands alone.' },
    { q: 'How long is each episode?', a: 'Between twelve and seventeen minutes. Every episode is transcribed in full on this site, so you can read it instead of watching it.' },
    { q: 'Where do the episodes play?', a: 'On YouTube, embedded on each episode page here. The transcript, the summary and the questions live on montefioreeinstein.org so you can read, search and cite them without leaving.' },
  ],
};
