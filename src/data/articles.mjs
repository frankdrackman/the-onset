// Feed 2 — the ME-sponsored LoHud articles, plus recipes and patient journeys.
//
// SCOPE NOTE. The brief states ~135 English articles as "a labeled floor rather than
// a certified total", with the item-level LoHud crawl still pending. This prototype
// therefore carries a REPRESENTATIVE SAMPLE, not a claimed archive, and every count
// rendered anywhere in the build is computed from this file rather than asserted.
// When the certified crawl lands, replace this file; nothing else changes.
//
// BYLINES. Physician bylines follow wireframe v2's own convention — "Dr. Byline
// Name, MD" plus the real department — rather than naming ME clinicians. The Person
// entity, the credential strip and the Find a Doctor sameAs are all wired and will
// bind to real physicians the moment the crawl supplies them. No attribution is
// invented here.

const BYLINE = 'Dr. Byline Name, MD';
const RD = 'Name, RD, CDN';

// [slug, title, dept, topic, pillars, published, minutes, standfirst, opts]
const A = (slug, title, dept, topic, pillars, published, minutes, standfirst, opts = {}) => ({
  kind: 'article', slug, title, dept, topic, pillars, published,
  updated: opts.updated ?? published, minutes,
  standfirst,
  byline: { name: BYLINE, credential: 'MD', dept: opts.bylineDept ?? dept, pending: true },
  secondaryDepts: opts.secondaryDepts ?? [],
  lang: 'en', es: opts.es ?? false,
  lohud: opts.lohud ?? true,
  featured: opts.featured ?? false,
  ...opts,
});

const R = (slug, title, topic, published, opts = {}) => ({
  kind: 'recipe', slug, title, dept: 'healthy-nutrition', topic,
  pillars: ['live-well'], published, updated: opts.updated ?? published,
  minutes: opts.minutes ?? 5,
  standfirst: opts.standfirst ?? '',
  byline: { name: RD, credential: 'RD, CDN', dept: 'healthy-nutrition', pending: true, reviewer: true },
  secondaryDepts: opts.secondaryDepts ?? [],
  lang: 'en', es: opts.es ?? false, lohud: true, featured: opts.featured ?? false,
  recipe: { cookTime: opts.cookTime ?? 30, serves: opts.serves ?? 4, plans: opts.plans ?? [] },
  ...opts,
});

const J = (slug, title, dept, published, standfirst, opts = {}) => ({
  kind: 'journey', slug, title, dept, topic: 'Patient Journey',
  pillars: opts.pillars ?? ['understand'], published, updated: published,
  minutes: opts.minutes ?? 6, standfirst,
  byline: { name: BYLINE, credential: 'MD', dept, pending: true },
  clinician: 'Dr. Clinician Name',
  secondaryDepts: [], lang: 'en', es: opts.es ?? false, lohud: true,
  featured: opts.featured ?? false, ...opts,
});

export const ITEMS = [
  // ================= Heart Care =================
  A('heart-attack-cardiac-arrest-heart-failure', 'Is it a heart attack, cardiac arrest, or heart failure?',
    'heart-care', 'Heart rhythm', ['understand', 'prevent'], '2026-08-24', 6,
    'Three conditions, three different emergencies, and one set of symptoms people routinely confuse. Here is how a cardiologist tells them apart — and what to do in the first ten minutes of each.',
    { featured: true, es: true, updated: '2026-08-24' }),
  A('eat-for-your-blood-pressure', 'Eat for your blood pressure: what actually changes the number',
    'heart-care', 'Blood pressure', ['prevent', 'live-well'], '2026-08-18', 5,
    'Salt is the headline, but it is not the whole story. What the evidence says moves a blood pressure reading, ranked by how much difference it makes.',
    { secondaryDepts: ['healthy-nutrition'], es: true }),
  A('recovery-from-heart-surgery', 'What recovery from heart surgery really looks like',
    'heart-care', 'Heart surgery', ['understand'], '2026-08-11', 7,
    'Week by week, what to expect after cardiac surgery — including the parts nobody warns you about, and the point at which most people turn a corner.'),
  A('cholesterol-numbers-explained', 'Your cholesterol panel, line by line',
    'heart-care', 'Cholesterol', ['understand', 'prevent'], '2026-07-28', 6,
    'LDL, HDL, triglycerides, and the ratio your clinician is actually looking at. A plain reading of the report you were handed.'),
  A('atrial-fibrillation-what-it-feels-like', 'Atrial fibrillation: what it feels like, and why it matters',
    'heart-care', 'Heart rhythm', ['understand'], '2026-07-14', 5,
    'A flutter, a skip, a sudden thud. Which irregular heartbeats are worth a call, and why AFib raises stroke risk even when it feels like nothing.',
    { secondaryDepts: ['brain-nerve-care'] }),
  A('statins-myths-vs-facts', 'Statins: myths versus facts',
    'heart-care', 'Cholesterol', ['understand'], '2026-06-30', 6,
    'Muscle aches, memory, "natural alternatives" — the five statin claims patients raise most often, checked against the evidence.'),
  A('women-heart-attack-symptoms', 'Why a heart attack can look different in women',
    'heart-care', 'Heart rhythm', ['prevent', 'understand'], '2026-06-16', 5,
    'The crushing chest pain of the films is one presentation, not the only one. What else counts, and why it is missed.',
    { es: true }),
  A('blood-pressure-at-home', 'How to take your own blood pressure and get it right',
    'heart-care', 'Blood pressure', ['prevent'], '2026-05-26', 4,
    'Cuff position, timing, the coffee rule and the five-minute sit. Small errors that move a reading more than most medications do.'),
  A('cardiac-rehab-worth-it', 'Cardiac rehab: the most skipped treatment in cardiology',
    'heart-care', 'Heart surgery', ['advance'], '2026-05-12', 6,
    'It reduces the chance of a second event more than most people expect, and roughly two thirds of eligible patients never start it.'),

  // ================= Brain & Nerve Care =================
  A('stroke-symptoms-people-miss', 'The stroke symptoms people miss at home',
    'brain-nerve-care', 'Stroke', ['prevent', 'understand'], '2026-08-15', 4,
    'FAST catches most strokes. These are the presentations it does not — and the reason a "wait and see" hour costs more brain than almost any other delay in medicine.',
    { featured: true, es: true }),
  A('memory-lapse-or-something-else', 'Normal forgetting, or something else?',
    'brain-nerve-care', 'Memory', ['understand'], '2026-08-06', 6,
    'Losing your keys is not the warning sign. Losing the thread of a conversation you are having might be. Where clinicians draw the line.'),
  A('migraine-triggers-evidence', 'Migraine triggers: which ones the evidence supports',
    'brain-nerve-care', 'Migraine', ['understand', 'live-well'], '2026-07-22', 5,
    'Chocolate, cheese and red wine get blamed. Sleep, skipped meals and hormonal shifts do more of the work.'),
  A('epilepsy-first-seizure', 'Someone just had a seizure. What now?',
    'brain-nerve-care', 'Epilepsy', ['understand'], '2026-07-08', 5,
    'What to do in the room, what to time, what to tell the clinician afterwards, and why a first seizure is not automatically epilepsy.'),
  A('concussion-return-to-normal', 'Concussion: when it is safe to go back',
    'brain-nerve-care', 'Stroke', ['understand'], '2026-06-24', 5,
    'Back to school, back to work, back to the field — the staged return, and the symptoms that mean you moved too fast.',
    { secondaryDepts: ['orthopedics-rehab'] }),
  A('brain-health-in-your-fifties', 'What protects the brain in your fifties',
    'brain-nerve-care', 'Memory', ['prevent', 'live-well'], '2026-06-02', 6,
    'Hearing, blood pressure, sleep and movement. The modifiable risks with the strongest evidence behind them, in order.'),

  // ================= Cancer Care =================
  A('cancer-screening-by-age', 'Which cancer screenings you need, and when',
    'cancer-care', 'Screening', ['prevent'], '2026-08-20', 7,
    'A plain schedule by age and risk, with the tests that changed guidance recently and the ones people put off longest.',
    { es: true }),
  A('eating-through-treatment', 'Eating through treatment, when nothing tastes right',
    'cancer-care', 'Nutrition', ['live-well', 'understand'], '2026-08-04', 7,
    'Taste changes, nausea, mouth sores and the weeks when food is work. Practical answers from the clinicians and dietitians who manage it daily.',
    { secondaryDepts: ['healthy-nutrition'] }),
  A('what-a-biopsy-result-says', 'Reading a biopsy report without panicking',
    'cancer-care', 'Treatment', ['understand'], '2026-07-21', 6,
    'Grade, stage, margins, receptor status. What each line means, and which ones change the plan.'),
  A('immunotherapy-explained', 'Immunotherapy, explained without the hype',
    'cancer-care', 'Treatment', ['advance', 'understand'], '2026-07-07', 6,
    'What it does, which cancers it works in, what the side effects actually feel like, and why it is not a universal answer.'),
  A('life-after-treatment', 'Survivorship: the year after treatment ends',
    'cancer-care', 'Survivorship', ['live-well'], '2026-06-10', 6,
    'Follow-up scans, fatigue that outlasts the drugs, and the strange difficulty of the moment everyone else thinks it is over.'),
  A('colonoscopy-what-happens', 'Colonoscopy: the whole thing, start to finish',
    'cancer-care', 'Screening', ['prevent', 'understand'], '2026-05-19', 5,
    'The prep is the hard part and it has got easier. What happens, what you will feel, and what the results mean.'),

  // ================= Endocrinology =================
  A('borderline-blood-sugar', 'What to eat when your blood sugar is borderline',
    'endocrinology', 'Blood sugar', ['prevent', 'live-well'], '2026-08-11', 5,
    'Prediabetes is the most reversible diagnosis in medicine, and the window is wider than most people are told. Where to start.',
    { featured: true, secondaryDepts: ['healthy-nutrition'], es: true }),
  A('thyroid-tired-all-the-time', 'Thyroid trouble, or just tired?',
    'endocrinology', 'Thyroid', ['understand'], '2026-07-30', 5,
    'Fatigue, weight change, cold hands, thinning hair. When the thyroid is genuinely the answer, and when the test comes back normal.'),
  A('a1c-what-it-measures', 'What your A1c actually measures',
    'endocrinology', 'Diabetes', ['understand'], '2026-07-16', 4,
    'A three-month average, not a snapshot — which is why one good week does not move it, and one bad month does.'),
  A('continuous-glucose-monitors', 'Continuous glucose monitors: who they help',
    'endocrinology', 'Diabetes', ['advance'], '2026-06-25', 6,
    'The sensors moved from type 1 care to the pharmacy shelf. What they show, what they do not, and who genuinely benefits.'),
  A('menopause-metabolic-shift', 'The metabolic shift nobody warns you about at menopause',
    'endocrinology', 'Blood sugar', ['understand', 'live-well'], '2026-06-04', 6,
    'Body composition, insulin sensitivity and sleep change together. What is hormonal, what is age, and what responds to what.'),

  // ================= Behavioral Health =================
  A('anxiety-or-something-physical', 'Anxiety, or something physical?',
    'behavioral-health', 'Anxiety', ['understand'], '2026-08-13', 6,
    'Racing heart, breathlessness, chest tightness. Why the two are so hard to tell apart, and how clinicians work it out.',
    { secondaryDepts: ['heart-care'] }),
  A('first-therapy-appointment', 'What actually happens at a first therapy appointment',
    'behavioral-health', 'Mood', ['understand'], '2026-07-25', 5,
    'The most common reason people do not go is not knowing what it will be like. Here is the hour, described plainly.',
    { es: true }),
  A('sleep-and-mood', 'Sleep and mood: which one is driving',
    'behavioral-health', 'Stress', ['live-well'], '2026-07-02', 5,
    'Poor sleep worsens mood and low mood wrecks sleep. Which end clinicians treat first, and why it matters.',
    { secondaryDepts: ['sleep-medicine'] }),
  A('talking-to-a-teenager', 'How to ask a teenager if they are all right',
    'behavioral-health', 'Family', ['prevent'], '2026-06-11', 6,
    'The questions that get an answer, the ones that close the door, and the signs that mean today rather than next week.'),
  A('burnout-vs-depression', 'Burnout and depression are not the same thing',
    'behavioral-health', 'Mood', ['understand'], '2026-05-21', 5,
    'They overlap enough to be confused and differ enough to need different treatment. Where the line sits.'),

  // ================= Primary Care =================
  A('annual-physical-worth-it', 'Is the annual physical worth it?',
    'primary-care', 'Prevention', ['prevent'], '2026-08-08', 5,
    'The evidence on the yearly check-up is mixed, and the parts that hold up are not the parts people expect.'),
  A('hydration-how-much-water', 'How much water do you actually need?',
    'primary-care', 'Hydration', ['live-well'], '2026-07-18', 4,
    'Eight glasses is a slogan, not a guideline. What determines your requirement, and the signs you are behind.',
    { secondaryDepts: ['healthy-nutrition'] }),
  A('when-a-fever-needs-a-doctor', 'When a fever needs a doctor',
    'primary-care', 'Prevention', ['understand'], '2026-06-27', 4,
    'Numbers, duration and company. The thresholds that matter in adults, and the different ones for children and older adults.',
    { es: true }),
  A('vaccines-adults-forget', 'The vaccines adults forget',
    'primary-care', 'Prevention', ['prevent'], '2026-06-05', 5,
    'Shingles, pneumococcal, tetanus, RSV. What is recommended at what age, and the ones most often missed.'),
  A('blood-test-panel-explained', 'The standard blood panel, line by line',
    'primary-care', 'Screening', ['understand'], '2026-05-14', 6,
    'What each abbreviation on the printout means, which flags are common and harmless, and which ones warrant a follow-up call.'),

  // ================= Urology =================
  A('prostate-screening-decision', 'The prostate screening conversation, in plain terms',
    'urology', 'Prostate', ['prevent', 'understand'], '2026-08-01', 6,
    'PSA testing is a decision, not a default. What the number means, what it misses, and how to weigh it at your age.'),
  A('kidney-stones-prevention', 'Kidney stones: how to not have another one',
    'urology', 'Kidney', ['prevent'], '2026-07-11', 5,
    'Most people who form one stone form another. Fluid, salt, oxalate and the changes that measurably reduce the odds.'),
  A('urinary-symptoms-men-over-50', 'Urinary symptoms after fifty: what is normal',
    'urology', 'Bladder', ['understand'], '2026-06-13', 5,
    'Frequency, urgency, a weaker stream. What is ordinary ageing of the prostate, and what is worth investigating.'),
  A('recurrent-utis', 'Recurrent urinary tract infections, and what finally stops them',
    'urology', 'Bladder', ['understand'], '2026-05-08', 5,
    'Why they come back, which prevention strategies hold up in trials, and when it is time for a specialist.',
    { es: true }),

  // ================= Orthopedics & Rehab =================
  A('knee-pain-when-to-worry', 'Knee pain: when it is worth an X-ray',
    'orthopedics-rehab', 'Joints', ['understand'], '2026-08-19', 5,
    'Most knee pain settles. These are the features that mean imaging now rather than in six weeks.'),
  A('joint-replacement-recovery', 'What the first six weeks after a joint replacement ask of you',
    'orthopedics-rehab', 'Recovery', ['understand'], '2026-07-24', 6,
    'Physiotherapy is the operation’s second half. What the schedule looks like, and why the hardest fortnight is the second.'),
  A('back-pain-first-two-weeks', 'Back pain: the first two weeks',
    'orthopedics-rehab', 'Injury', ['understand', 'live-well'], '2026-06-20', 5,
    'Rest is no longer the advice. What helps, what delays recovery, and the red flags that change the plan.',
    { es: true }),
  A('running-injury-prevention', 'The running injuries that are actually preventable',
    'orthopedics-rehab', 'Injury', ['prevent', 'live-well'], '2026-05-29', 5,
    'Load, not form, causes most of them. How to increase distance without buying an injury.'),

  // ================= Sleep Medicine (thin) =================
  A('sleep-apnea-signs', 'The signs of sleep apnoea a partner notices first',
    'sleep-medicine', 'Sleep apnoea', ['prevent', 'understand'], '2026-07-31', 5,
    'Snoring with pauses, morning headaches, blood pressure that will not settle. What to do with the observation.',
    { secondaryDepts: ['ear-nose-throat'] }),
  A('insomnia-what-works', 'Insomnia: what works, in order',
    'sleep-medicine', 'Insomnia', ['live-well'], '2026-06-18', 6,
    'Cognitive behavioural therapy for insomnia outperforms medication over time. What it involves and how to get it.',
    { secondaryDepts: ['behavioral-health'] }),

  // ================= Allergy & Immunology (thin) =================
  A('allergy-or-cold', 'Allergy or a cold? Tell them apart in a minute',
    'allergy-immunology', 'Allergies', ['understand'], '2026-07-09', 4,
    'Itch, timing and duration do most of the work. A quick, reliable way to sort one from the other.'),
  A('adult-onset-asthma', 'Asthma that starts in adulthood',
    'allergy-immunology', 'Asthma', ['understand'], '2026-05-27', 5,
    'It is more common than most people assume, presents differently from childhood asthma, and is frequently mistaken for being unfit.'),

  // ================= Ear, Nose & Throat (thin) =================
  A('hearing-loss-and-the-brain', 'Hearing loss and the brain: why it is not just about hearing',
    'ear-nose-throat', 'Hearing', ['prevent'], '2026-08-05', 5,
    'Untreated hearing loss is one of the largest modifiable dementia risk factors. Why, and what to do about it.',
    { secondaryDepts: ['brain-nerve-care'] }),
  A('sinus-infection-antibiotics', 'Does a sinus infection need antibiotics?',
    'ear-nose-throat', 'Sinus', ['understand'], '2026-06-09', 4,
    'Usually not, and the timing rule that tells you when it does.'),

  // ================= Recipes (Healthy Nutrition) =================
  R('one-pot-white-bean-greens-soup', 'One-pot white bean and greens soup', 'Recipes', '2026-08-18',
    { featured: true, cookTime: 35, serves: 4, plans: ['Low sodium'], es: true,
      standfirst: 'A weeknight soup that gets its body from beans rather than salt or cream, and reheats better than it cooks.' }),
  R('sheet-pan-salmon-lemon-dill', 'Sheet-pan salmon with lemon and dill', 'Recipes', '2026-08-12',
    { cookTime: 25, serves: 2, plans: [], standfirst: 'One tray, twenty-five minutes, and the omega-3 target for the week in a single meal.' }),
  R('black-bean-sweet-potato-tacos', 'Black bean and sweet potato tacos', 'Recipes', '2026-08-05',
    { cookTime: 30, serves: 4, plans: ['Plant-based'], es: true,
      standfirst: 'Fibre-forward, freezer-friendly, and cheap enough to make a habit of.' }),
  R('overnight-oats-three-ways', 'Overnight oats, three ways', 'Recipes', '2026-07-29',
    { cookTime: 10, serves: 2, plans: ['Diabetes-friendly'], standfirst: 'A breakfast that holds blood sugar steady until lunch, assembled the night before.' }),
  R('roasted-vegetable-grain-bowl', 'Roasted vegetable and barley bowl', 'Recipes', '2026-07-15',
    { cookTime: 40, serves: 4, plans: ['Plant-based', 'Low sodium'], standfirst: 'Batch-roast on Sunday, eat four different lunches from it.' }),
  R('lentil-shepherds-pie', 'Lentil shepherd’s pie', 'Recipes', '2026-07-01',
    { cookTime: 55, serves: 6, plans: ['Plant-based'], standfirst: 'The comfort dish, rebuilt around lentils, with none of the compromise people expect.' }),
  R('greek-yogurt-breakfast-bowl', 'Greek yoghurt breakfast bowl', 'Recipes', '2026-06-24',
    { cookTime: 5, serves: 1, plans: ['Diabetes-friendly'], standfirst: 'Thirty grams of protein before nine, in five minutes and one bowl.' }),
  R('chicken-vegetable-traybake', 'Chicken and root vegetable traybake', 'Recipes', '2026-06-10',
    { cookTime: 45, serves: 4, plans: ['Low sodium'], standfirst: 'Herbs and lemon doing the work salt usually does.' }),
  R('mediterranean-chickpea-salad', 'Mediterranean chickpea salad', 'Recipes', '2026-05-28',
    { cookTime: 15, serves: 4, plans: ['Plant-based', 'Low sodium'], es: true,
      standfirst: 'Better on day two, which makes it the most useful thing in the fridge.' }),
  R('salmon-cakes-with-herbs', 'Herbed salmon cakes', 'Recipes', '2026-05-13',
    { cookTime: 25, serves: 4, plans: [], standfirst: 'Tinned salmon, treated properly. Weeknight protein for the price of a sandwich.' }),
  R('turkey-white-bean-chilli', 'Turkey and white bean chilli', 'Recipes', '2026-04-29',
    { cookTime: 50, serves: 6, plans: ['Low sodium'], standfirst: 'Freezes in portions, defrosts into a real meal, and carries a day’s fibre.' }),
  R('spiced-vegetable-soup', 'Spiced carrot and red lentil soup', 'Recipes', '2026-04-15',
    { cookTime: 35, serves: 4, plans: ['Plant-based', 'Diabetes-friendly'], standfirst: 'Six ingredients, one pot, and enough warmth to make it a habit.' }),

  // ================= Patient Journeys =================
  J('a-fuller-life-in-her-words', 'A fuller life, in her words', 'heart-care', '2026-08-12',
    'She put the breathlessness down to age for two years. What changed after the diagnosis was not only the treatment — it was what she decided the rest of her life was for.',
    { featured: true, pillars: ['understand'], es: true }),
  J('back-on-the-court-at-seventy-one', 'Back on the court at seventy-one', 'orthopedics-rehab', '2026-08-02',
    'A knee that had stopped him playing, a replacement he put off twice, and the eleven-month road back to a Tuesday-night doubles game.'),
  J('what-a-second-opinion-changed', 'What a second opinion changed', 'cancer-care', '2026-07-21',
    'The first plan was reasonable. The second read the pathology differently, and the difference was two years of treatment he did not need.'),
  J('the-morning-she-noticed-the-drift', 'The morning she noticed the drift', 'brain-nerve-care', '2026-07-06',
    'Her husband’s smile was uneven for about ninety seconds. She called anyway. That call is the reason he still writes with his right hand.',
    { es: true }),
  J('running-again-after-the-stent', 'Running again, after the stent', 'heart-care', '2026-06-14',
    'He was told he would be fine and heard "be careful". Cardiac rehab is where he learned the difference.'),
  J('the-appointment-she-almost-skipped', 'The appointment she almost skipped', 'cancer-care', '2026-05-30',
    'A screening she rescheduled three times, a finding small enough to be simple, and a year that could have gone very differently.'),
];

export const ARTICLES = ITEMS.filter((i) => i.kind === 'article');
export const RECIPES  = ITEMS.filter((i) => i.kind === 'recipe');
export const JOURNEYS = ITEMS.filter((i) => i.kind === 'journey');
