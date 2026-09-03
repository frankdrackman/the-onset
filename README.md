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
| 2f | Article detail | `/the-onset/heart-care/heart-attack-cardiac-arrest-heart-failure/` |
| 2g | ME homepage, two streams | `/` |
| — | Archive | `/the-onset/archive/` |

105 pages in total: every one of the 81 catalog items has a real detail page, so
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
  data/         site identity · 12 departments · 4 pillars · 13 episodes · 68 items
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

## Content honesty

Every number on the site is **computed from the data**, never asserted. The archive
holds a representative sample of 81 items — the brief states ~135 English articles as
a labelled floor with the item-level LoHud crawl still pending, so the prototype does
not claim 135. When the crawl lands, `src/data/articles.mjs` is replaced and nothing
else changes.

- **Bylines** follow the wireframe's own `Dr. Byline Name, MD` convention plus the
  real department. No ME clinician is named. The `Person`/`Physician` entity, the
  credential strip and the Find a Doctor `sameAs` are wired and bind on real names.
- **Episode titles**: the three named in the brief are carried verbatim. The other
  ten are not enumerated in either source, so they are identified by season and
  episode.
- **Photography** is not commissioned. Placeholders hold the exact ratios the
  direction calls for — 4:3 lead, 16:9 secondary, 21:9 detail — and say what they are.
- **Fonts** are ME-licensed brand faces, carried locally so the prototype renders in
  the real face for review. Not for public deployment without ME's licence.
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

`node check.mjs` passes across all 105 pages: no broken internal links, valid JSON-LD
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
