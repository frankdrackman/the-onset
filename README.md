# The Onset — prototype

A working prototype of the Montefiore Einstein content hub, built from **wireframe
version 2** (the offset-hero-on-white cut) and the **Design & Build** section of the
Agency Creative Brief v2, 19 July 2026.

*The Onset* is a **working title**. The brief marks the hub name as an open decision
between Loreen Babcock and Les and uses `[HUB NAME PENDING]` throughout. The name is
wired here from a single constant in `src/data/site.mjs` — change it there and every
surface follows, including the schema `Brand`.

```bash
node build.mjs          # build to dist/
node build.mjs --serve  # build and serve on http://localhost:4173
node check.mjs          # link, schema, heading-order and accessibility checks
```

No dependencies. Node 18+.

---

## What it covers

All seven screens of wireframe v2, plus the archive:

| | Screen | Route |
|---|---|---|
| 2a | Hub home | `/the-onset/` |
| 2b | The Balance series | `/the-onset/the-balance/` |
| 2c | Balance episode | `/the-onset/heart-care/the-balance-s1e6/` |
| 2d | Department (×12) | `/the-onset/heart-care/` |
| 2e | Topic | `/the-onset/topics/nutrition/` |
| 2f | Article detail | `/the-onset/heart-care/cardiac-arrest-heart-attack-or-heart-failure-whats-the-difference/` |
| 2g | ME homepage, two streams | `/` |
| — | Archive | `/the-onset/archive/` |

184 pages in total: every one of the 154 catalog items has a real detail page, so
nothing dead-ends. `/notes.html` documents every decision and is linked from the
banner on every page.

## How it is built

A dependency-free Node generator emitting static HTML. Every page — copy, headings
and all JSON-LD — is in the initial payload; there is no client render step. That is
the brief's stated precondition before any schema helps, and the simplest way to
prove it is to have no hydration at all. Client JavaScript does two things only, both
progressive enhancement over working server-rendered markup: the ticker's manual
advance, and the archive's filter/sort/search.

```
src/
  data/         site identity · 12 departments · 4 pillars · 13 episodes · 141 articles
  lib/          html helpers · taxonomy resolver · JSON-LD builders
  components/   page chrome · the one card language · the accessible ticker
  pages/        one module per screen; department.mjs renders all twelve
  assets/       ME Storybook tokens · hub stylesheet · ticker.js · archive.js · fonts
```

The design system is the **real ME Storybook v5.8.0**, lifted from the wireframe
canvas: the full colour, type, spacing, radius, elevation, breakpoint and motion
scales. Headlines are set in Leitura News, everything else in Arial, per the web
platform pairing. Radii never exceed 4px and the deprecated legacy fuchsia is never
used.

**One adaptation to `tokens.css`:** the Storybook's `.me` base rules are wrapped in
`@layer me-base`. The declarations are verbatim; only their cascade position changes.
Unwrapped, `.me a` (0,1,1) out-specifies a component class like `.btn` (0,1,0), so a
navy button renders navy-on-navy text. A base layer should behave as one.

## The content is real

**The Balance — all 13 episodes**, harvested from the public series channel
`youtube.com/@thebalancewithdrozuah`. Real titles, publish dates, durations, view
counts, thumbnails, guest clinicians, and full timestamped transcripts (91–182 lines
each). The channel holds 15 videos; the two season promos are excluded exactly as the
brief specifies.

The publish dates settle an editorial argument: all six Season 1 episodes published
2022-05-11, all seven Season 2 on 2023-06-12. A season really does land at once, so
the two streams must not interleave. And every one of the brief's deterministic
tie-breaks holds against the real descriptions — including S1-E6, where the
first-named-guest rule resolves telemedicine to Heart Care and the real description
does name Dr. Slipczuk (Cardiology) before Dr. Altschul (Neurosurgery).

**LoHud — 141 articles**, with real headlines, exact dates, canonical URLs and teaser
text. That clears the brief's "roughly 135" and confirms it as a floor.
**lohud.com was never crawled**: its robots.txt disallows every Claude and Anthropic
agent identifier, so the archive was enumerated from Google's public index of
`lohud.com/story/sponsor-story/montefiore-health-system/` instead.

Three ME clinicians appear in **both** feeds — Dr. Vafa Tabatabaie, Dr. David
Altschul and Jessica Shapiro, RD — which is the corroborable cross-feed entity signal
the GEO section asks for, demonstrated rather than asserted.

### What is still missing, and shows as missing

Unknown values render as nothing at all, never as a placeholder.

- **Bylines** for 111 of 141 articles (30 are real, with the clinician's role). Three
  more survive only as a surname.
- **Spanish twins** — confirmed to exist by the brief, but absent from the public
  index. They need a LoHud manifest.
- **Body text, read times, recipe cook-times** — these need the article bodies, which
  belong to LoHud and are not reproduced. Each detail page is Option C: an
  ME-authored, self-canonical page owning the citable summary, linking out with
  `rel="sponsored"`.
- **Photography** is not commissioned. Placeholders hold the exact ratios the
  direction calls for — 4:3 lead, 16:9 secondary, 21:9 detail — and say what they are.
- **Fonts** are the ME-licensed Leitura brand faces, shipped so the prototype renders
  in the real type. `node build.mjs --no-brand-fonts` builds without them and falls
  back to the stack the Storybook token itself declares (Georgia, Times New Roman,
  serif), if a deploy ever needs to omit them.
- Every page carries `noindex`, and `robots.txt` disallows everything by default.

## The taxonomy, as implemented

One browse axis, one editorial layer, two cross-cutting devices — kept deliberately
separate, and enforced in code rather than by convention.

- **Layer 1, departments** (entity-bearing). Twelve buckets: the eleven clinical
  departments plus Healthy Nutrition, which carries `entity: null` and makes no
  entity claim — the canonical exception that lets recipes live somewhere without
  wearing a department tag they have not earned.
- **Layer 2, four pillars** (no schema weight). `check.mjs` fails the build if a
  pillar is ever emitted as an `about` entity.
- **Layer 3**, Patient Journeys and The Latest. Neither is a topic or a department.

The brief's deterministic canonical tie-break is applied to all thirteen episodes,
and each non-obvious case carries the rule that decided it as a comment in
`src/data/episodes.mjs`.

## Verified

`node check.mjs` passes across all 184 pages: no broken internal links, valid JSON-LD
on every page, no pillar emitted as an entity, no empty `FAQPage`, exactly one `h1`
per page, no skipped heading levels, skip link and `#main` landmark everywhere, no
`<details>` gating citable text, every `role="img"` labelled.

Browser-verified with JavaScript **off**: both ticker sets render stacked, every
rotation control stays hidden, all 134 links work, the archive shows its
server-rendered results and numbered pagination. With JavaScript **on**: manual
advance is the default, `aria-pressed="false"` on auto-rotate, Pause and Stop
disabled until rotation is enabled, Stop permanently ends it, and a reduced-motion
preference disables auto-rotation outright.

## Open questions the prototype did not resolve

The hub name; the tagging method and owner; the LoHud canonical option (this build
assumes **Option C**, with `rel="sponsored"` on the paid boundary); the LoHud archive
unit; the empty-department policy; whether the ticker rotates at launch; and the
certified item-level LoHud crawl. All are listed with the build's working assumption
in `/notes.html`.
