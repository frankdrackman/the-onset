// Prototype self-check: internal links, JSON-LD validity, heading order, a11y basics.
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, dirname, resolve, relative, extname } from 'node:path';

const DIST = new URL('./dist/', import.meta.url).pathname;
const files = [];
async function walk(d) {
  for (const e of await readdir(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) await walk(p); else files.push(p);
  }
}
await walk(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));

let errors = [], warns = [];
const exists = async (p) => !!(await stat(p).catch(() => null));

for (const f of htmlFiles) {
  const src = await readFile(f, 'utf8');
  const rel = relative(DIST, f);

  // --- internal links resolve ---
  for (const m of src.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|#|data:|tel:)/.test(url) || url === '') continue;
    const clean = url.split(/[?#]/)[0];
    if (!clean) continue;
    const target = resolve(dirname(f), clean);
    if (!(await exists(target))) errors.push(`${rel}: broken link → ${url}`);
  }

  // --- JSON-LD parses, and rule checks ---
  for (const m of src.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    let g;
    try { g = JSON.parse(m[1].replace(/\\u003c/g, '<')); }
    catch (e) { errors.push(`${rel}: invalid JSON-LD — ${e.message}`); continue; }
    const flat = JSON.stringify(g);
    // Pillars must NEVER appear as an entity claim.
    for (const p of ['Prevent', 'Understand', 'Live Well', 'Advance']) {
      if (new RegExp(`"about":\\s*\\{[^}]*"name":\\s*"${p}"`).test(flat))
        errors.push(`${rel}: pillar "${p}" emitted as an about entity`);
    }
    if (!g['@context']) errors.push(`${rel}: JSON-LD missing @context`);
    // Empty FAQPage is worse than none.
    if (/"@type":"FAQPage","mainEntity":\[\]/.test(flat)) errors.push(`${rel}: empty FAQPage emitted`);
  }

  // --- exactly one h1 ---
  const h1s = [...src.matchAll(/<h1[\s>]/g)].length;
  if (h1s !== 1) warns.push(`${rel}: ${h1s} <h1> elements`);

  // --- heading order never skips a level ---
  const levels = [...src.matchAll(/<h([1-6])[\s>]/g)].map((m) => +m[1]);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] > levels[i - 1] + 1) { warns.push(`${rel}: heading jumps h${levels[i - 1]} → h${levels[i]}`); break; }
  }

  // --- a11y basics ---
  if (!src.includes('class="skip"')) errors.push(`${rel}: no skip link`);
  if (!src.includes('id="main"')) errors.push(`${rel}: no #main landmark`);
  if (!/<html lang="/.test(src)) errors.push(`${rel}: no lang attribute`);
  // Interaction must never gate citable text.
  if (/<details/.test(src)) errors.push(`${rel}: <details> gates content`);
  // Unrendered template artifacts.
  if (/\$\{|\[object |undefined<|>undefined/.test(src)) errors.push(`${rel}: unrendered template artifact`);
  // Every img-role placeholder needs a label.
  for (const m of src.matchAll(/role="img"(?![^>]*aria-label)/g)) errors.push(`${rel}: role="img" without aria-label`);
}

console.log(`checked ${htmlFiles.length} pages`);
if (errors.length) { console.log('\nERRORS'); for (const e of [...new Set(errors)].slice(0, 40)) console.log(' ✗', e); }
if (warns.length) { console.log('\nWARNINGS'); for (const w of [...new Set(warns)].slice(0, 20)) console.log(' !', w); }
if (!errors.length) console.log('\n✓ no errors');
process.exit(errors.length ? 1 : 0);
