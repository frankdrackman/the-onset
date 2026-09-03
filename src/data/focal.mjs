// Per-image focal points.
//
// A 16:9 card cropped from the centre cuts the top off a portrait, because faces sit
// in the upper third of a frame far more often than the middle. Most images are fine
// on the default; these are the ones that are not.
//
// The value is a CSS object-position: "50% 30%" keeps the horizontal centre and pulls
// the crop up so the face lands in the middle of the card. Lower percentage = crop
// higher up the source image.
//
// Art direction lives here rather than in the templates, so tuning a crop never means
// touching layout code.

export const FOCAL = {
  // Portrait source (1200x1305) in a landscape card: the subject's eyes sit about
  // 17% down the frame, so there is not enough image above them to put them at dead
  // centre. Anchoring to the top shows the whole face — forehead included — and
  // places the eyes as near the middle as the source allows.
  'a-chance-encounter-saved-paul-with-a-living-liver-donor-1000-miles-awa': '50% 0%',
};

/** Patient portraits default to an upward bias — they are portraits, and a centred
 *  crop reliably clips the head. Everything else uses the browser default. */
export const focalFor = (item) =>
  FOCAL[item.slug] ?? (item.kind === 'journey' ? '50% 32%' : null);
