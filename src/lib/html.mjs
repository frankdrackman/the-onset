// Tiny server-render helpers. Everything this build emits is a string of HTML
// written to disk — there is no client framework and no hydration, which is how the
// brief's "server-side HTML for all core content and all schema" requirement is met.

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

// Template tag: arrays are joined, null/undefined/false render as nothing.
// Values are NOT auto-escaped — call esc() at the point of interpolation. This keeps
// composed HTML fragments (which are already escaped) from being double-escaped.
export const html = (strings, ...vals) =>
  strings.reduce((out, s, i) => {
    const v = vals[i - 1];
    const piece = v == null || v === false ? '' : Array.isArray(v) ? v.join('') : v;
    return out + piece + s;
  });

export const cls = (...xs) => xs.filter(Boolean).join(' ');

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

/** "24 August 2026" — the wireframe's date form. */
export const longDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
};
/** "24 August" — the compact card form. */
export const cardDate = (iso) => {
  const [, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]}`;
};

export const jsonld = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj, null, 2)
    .replace(/</g, '\\u003c')}</script>`;
