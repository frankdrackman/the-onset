// Build notes — the decisions this prototype made, where it deviates, and what it
// deliberately did not resolve. Linked from the banner on every page.

import { html, esc } from '../lib/html.mjs';
import { page, rel } from '../components/chrome.mjs';
import { HUB } from '../data/site.mjs';
import * as T from '../lib/taxonomy.mjs';

const section = (h, rows) => html`
<h2>${esc(h)}</h2>
${rows.map((r) => html`<p><strong>${esc(r[0])}</strong> — ${r[1]}</p>`)}`;

export const notesPage = () => {
  const r = rel(0);
  return page({
    title: `Build notes — ${HUB.name} prototype`,
    description: 'Decisions, deviations and open questions in The Onset prototype.',
    depth: 0,
    children: html`
<main id="main">
  <div class="wrap">
    <div class="detail">
      <h1 class="detail__title">Build notes</h1>
      <p class="hero__stand">What this prototype decided, where it departs from its sources, and what it deliberately left open.</p>

      <div class="prose" style="max-width:76ch">

        ${section('What this is', [
          ['Scope', 'A working prototype of the seven screens in wireframe <strong>version 2</strong> — the offset-hero-on-white cut — with the functional layer from the Design &amp; Build section of the creative brief (v2, 19 July 2026) built in rather than described.'],
          ['Screens', '2a hub home · 2b Balance series · 2c Balance episode · 2d department · 2e topic · 2f article detail · 2g ME homepage with two streams. Plus the archive, which is not one of the seven but which every screen links into and the brief specifies in full.'],
          ['How it is built', 'A dependency-free Node generator emitting static HTML. Every page — copy, headings, JSON-LD — is in the initial payload. Nothing load-bearing is injected after load, which is the brief’s stated precondition before any schema helps.'],
          ['Design system', 'Real ME Storybook v5.8.0 tokens, lifted from the wireframe canvas: the full colour, type, spacing, radius, elevation, breakpoint and motion scales. Headlines are set in Leitura News; everything else is Arial, per the web platform pairing.'],
        ])}

        ${section('Deliberate design decisions for review', [
          ['The offset hero is the one net-new component', 'Everything else is existing token and component vocabulary. This is the sanctioned evolution the wireframe names, and it opens every page type in the set — hub home, series, department, topic — so a reader recognises the page shape immediately.'],
          ['Radii capped at 4px, no fuchsia', 'The reference the wireframe worked from used ~16px radii and a fuchsia CTA. The Storybook tops out at 4px on web and the fuchsia is the deprecated legacy secondary, so the CTA is white on navy instead.'],
          ['Homepage stream 1 is headed “The Latest on The Onset”, not “Our Latest on Lohud.com”', 'The wireframe shows the existing heading. The brief’s attribution rule and the one-entity requirement both point the other way: a heading that names the third-party domain makes lohud.com the entity on ME’s own homepage. Flagged rather than changed silently.'],
          ['Numbered pagination, not Load More', 'The brief lists “which comp revision board is authoritative” as open. This build takes numbered pagination: each page is a stable, citable URL and server-rendered, the stronger choice for GEO and for an older audience. Load More stays acceptable on shorter department lists.'],
          ['Auto-rotation is off by default and opt-in', 'The brief prefers manual advance and leaves “whether the ticker rotates at all” as an open launch decision. The prototype ships the full compliance surface — pause, stop, 7-second floor, position indicator, reduced-motion disable — with rotation off until a reader turns it on.'],
          ['Photography placeholders are labelled, not dressed up', 'Art is not commissioned. The blocks hold the exact ratios the direction calls for (4:3 lead, 16:9 secondaries, 21:9 detail) so proportions can be judged, and they say what they are.'],
        ])}

        ${section('Accessibility, as built', [
          ['Ticker', 'Manual by default · persistent, labelled Pause and Stop (WCAG 2.2 SC 2.2.2) · 7-second floor · pauses on hover, focus and any interaction and stays paused · reduced-motion disables it outright · aria-live="polite" · visible “Set n of N” indicator · every set server-rendered so nothing is available only in the ticker · with JavaScript off it degrades to a static stack, never a dead carousel.'],
          ['Colour is never the only signal', 'Content type is stated in words on the meta strip on every card. Filter state carries a checkmark as well as a fill. The video affordance is a shape.'],
          ['Contrast', 'The light Storybook greys are used as surface and border tokens only. Secondary text is gray-500 or darker on white; the patient-story scrim guarantees 4.5:1 over the portrait.'],
          ['Targets, keyboard, semantics', '44×44 minimum on every interactive element (32px chips carry a 44px hit area) · skip link · visible focus · landmarks and heading order · link text names the item rather than repeating “Read Full Article” · announced result counts.'],
          ['Citable text is never gated', 'No <code>&lt;details&gt;</code> anywhere. “In short”, the transcript and the Q&amp;A blocks all ship expanded in the HTML.'],
        ])}

        ${section('GEO, as built', [
          ['Entity model', 'ME is the MedicalOrganization publisher. The hub is a <code>Brand</code> on that organization and a <code>CollectionPage</code> that <code>isPartOf</code> it — never a competing Organization.'],
          ['Two-layer labels', 'Friendly browse labels (Heart Care, Brain &amp; Nerve Care, Cancer Care …) carry no schema weight. Each binds behind the scenes to a live ME entity that does: Heart Care → Cardiology, Cancer Care → the Comprehensive Cancer Center, Brain &amp; Nerve Care → the neuroscience umbrella. The labels are never re-cut to the entity names.'],
          ['Pillars carry no schema weight', 'Prevent, Understand, Live Well and Advance never appear as an <code>about</code> entity anywhere in the graph. Enforced in the schema builders, not by convention.'],
          ['No entity claim where there is none', 'Healthy Nutrition is an editorial collection with <code>entity: null</code>. Recipes live there and make no department claim — the canonical exception, handled structurally.'],
          ['Schema set', 'MedicalOrganization · CollectionPage · Brand · MedicalWebPage on departments · VideoObject with chaptered transcript as <code>hasPart</code>/<code>Clip</code> on all 13 episodes · Article/MedicalWebPage with named author, publisher ME and sponsor ME on the LoHud pieces · Recipe with the dietitian as reviewer · Person/Physician on every byline · BreadcrumbList everywhere · FAQPage only where genuine Q&amp;A exists · SpeakableSpecification on the answer-first block.'],
          ['Canonical and attribution', 'One canonical URL per item, under its owning department — including for Balance episodes, whose home is the department path, not /the-balance/. Cross-surfacing links back to that one URL; there is never a second self-canonical page. The lohud.com boundary carries <code>rel="sponsored"</code>. English/Spanish twins carry reciprocal hreflang on distinct URLs.'],
          ['Filtered views never compete', 'Facet state is a query parameter, <code>rel="nofollow"</code>, and the page flips to <code>noindex</code> while filtered.'],
        ])}

        ${section('Where the content came from', [
          ['The Balance — fully harvested', 'All 13 episodes from the public series channel <code>youtube.com/@thebalancewithdrozuah</code>: real titles, publish dates, durations, view counts, thumbnails, guest clinicians, and <strong>full timestamped transcripts</strong> — 91 to 182 lines each. The channel holds 15 videos; the two season promos (0:29 and 0:31) are excluded exactly as the brief specifies, leaving the 13 episodes it describes.'],
          ['The publish dates settle the two-streams argument', 'All six Season 1 episodes published 2022-05-11; all seven Season 2 episodes on 2023-06-12. A season really does land at once, so “most recent” is meaningless for this feed and interleaving it with the weekly article stream would flood every slot on drop day. The brief argued this; the data confirms it.'],
          ['Every tie-break confirmed against the real descriptions', 'S1-E6 is the decisive one: the brief’s first-named-guest rule resolves telemedicine to Heart Care, and the real YouTube description does name Dr. Leandro Slipczuk (Cardiology) before Dr. David Altschul (Neurosurgery). S1-E3 pairs a sleep physician with an ENT; S1-E5’s guest is a nutritionist with no physician department; S1-E1, E4 and S2-E3 are psychologists; S2-E6 and E7 are Internal Medicine. Every case the brief predicted, the data bears out.'],
          ['LoHud — 141 articles, enumerated without crawling the publisher', 'lohud.com’s robots.txt disallows every Claude and Anthropic agent identifier seven times over, so the site was never crawled. The archive was instead enumerated from Google’s public index of <code>lohud.com/story/sponsor-story/montefiore-health-system/</code>, yielding 141 distinct articles with real headlines, exact publish dates, canonical LoHud URLs and teaser text. That clears the brief’s “roughly 135” figure and confirms it as a floor.'],
          ['Three physicians appear in both feeds', 'Dr. Vafa Tabatabaie fronts Balance S2-E2 and bylines the LoHud “Thyroid myths vs. facts” article. Dr. David Altschul appears in S1-E6 and bylines a stroke article. Jessica Shapiro, RD appears in S1-E5 and reviews the recipes. That cross-feed consistency is precisely the corroborable-entity signal the GEO section asks for, and it is real rather than asserted.'],
        ])}

        ${section('Content honesty', [
          ['Counts are computed, never asserted', `Every number on the site is counted from the data. The archive holds ${T.CATALOG.length} items: 141 LoHud articles and 13 episodes.`],
          ['Unknown renders as nothing', 'A missing byline, read time, recipe cook-time or teaser renders as empty space, never as a placeholder value. 30 of the 141 articles carry a real named ME physician or dietitian with their role; the other 111 show no byline at all rather than a fake one. 80 carry a teaser; snippets that were mid-sentence fragments or byline strings were dropped rather than shown broken.'],
          ['No invented body copy', 'Article body text belongs to LoHud and is not reproduced. Each detail page is Option C as SEO carries it: an ME-authored, self-canonical page that owns the citable summary and links out with <code>rel="sponsored"</code>. The space where ME’s own teaser copy will go is labelled as such rather than filled with plausible-looking filler.'],
          ['No invented Q&amp;A', 'The episode FAQ blocks in the earlier build were written by me and have been removed — the brief allows <code>FAQPage</code> only where genuine question-and-answer content exists. The series-level FAQ survives because it is answerable from the real data (thirteen episodes, four to eight minutes, two season drops).'],
          ['Chapter markers are quotations, not editorial titles', 'The “jump to a moment” markers are complete sentences lifted from each episode’s own transcript at even intervals. They are real words from the episode. Editorially written chapter titles remain a production task.'],
          ['Entity URLs are structural placeholders', 'The ME entity URLs behind each browse label are plausible and correctly shaped, pending SEO’s certified entity map.'],
        ])}

        ${section('Not built, and why', [
          ['Pillar pages (four)', 'The brief lists them as a page type. They reuse the same tag-or-topic template as the department and topic pages, which this build already demonstrates twice. Pillar filtering is live in the archive.'],
          ['Spanish twin pages', 'The hreflang pairs, the language facet and the EN/ES badge are all wired. The Spanish copy itself is a translation task, and the full Spanish set is not yet enumerated.'],
          ['A real search index', 'Search is a client-side pass over the catalog, which is honest at this size. At 135-plus items with Spanish twins it wants a server-side index — and per the brief, results must stay server-rendered to be citable.'],
          ['The newsroom', 'montefioreeinstein.org/news stays the institutional press surface. The hub cross-links to it and does not absorb it.'],
        ])}

        <h2>Open questions the prototype did not resolve</h2>
        <ul>
          <li>The hub name itself — Loreen and Les. <strong>The Onset</strong> is wired as a working title from a single constant; changing it changes every surface including the schema <code>Brand</code>.</li>
          <li>Tagging method and owner: manual, author-department lookup, or automated.</li>
          <li>LoHud canonical option A, B or C. This build assumes <strong>Option C</strong> — an ME-authored, self-canonical page linking out, with <code>rel="sponsored"</code> on the paid boundary.</li>
          <li>LoHud archive unit: distinct articles with a language toggle, or article-language-versions as separate items. This build treats them as distinct articles with a twin flag.</li>
          <li>Empty-department policy. This build renders the redirect-to-filtered-archive message on a zero-item department rather than a live page.</li>
          <li>Whether the ticker rotates at all at launch, and whether it uses the external ME Carousel component or the net-new rotation built here.</li>
          <li>Bylines for the 111 articles where the public index does not carry one, and full names for the three where only a surname survived (Clearwater, Rochlani, Weston).</li>
          <li>The Spanish twins. The brief confirms thirteen exist, but none surface in the public index under the sponsor-story path, so they need a LoHud manifest or an authenticated pass.</li>
          <li>Read times, recipe cook-times and yields, and ME-authored teaser copy — all of which need the article bodies.</li>
          <li>The certified item-level LoHud crawl. Everything in <code>articles.mjs</code> is replaced by it; nothing else changes.</li>
        </ul>

        <p style="margin-top:var(--space-40)">
          <a class="btn" href="${r}index.html">Montefiore Einstein homepage <span aria-hidden="true">→</span></a>
          <a class="btn btn--ghost" href="${r}the-onset/index.html">${esc(HUB.name)} hub home <span aria-hidden="true">→</span></a>
        </p>
      </div>
    </div>
  </div>
</main>`,
  });
};
