/* Progressive reveal for the department shelves.
 *
 * Every shelf is already in the HTML — this only eases them in as they come into
 * view. Two things it must never do: hide content from a crawler (it cannot; the
 * markup is server-rendered and the hiding is CSS applied only once JS is present),
 * and leave a shelf invisible because the reader jumped past it.
 *
 * That second case is why this is not a bare IntersectionObserver: an instant scroll,
 * an anchor jump or a browser find can skip the intersection entirely. So anything
 * that has reached the viewport bottom is revealed on scroll regardless, and
 * everything is revealed unconditionally shortly after load.
 */
(function () {
  'use strict';
  var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  if (!els.length) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('js');
  var show = function (el) { el.classList.add('is-in'); };

  // Anything at or above the fold is revealed — covers jumps, anchors and find.
  var sweep = function () {
    var h = window.innerHeight;
    for (var i = els.length - 1; i >= 0; i--) {
      if (els[i].getBoundingClientRect().top < h) { show(els[i]); els.splice(i, 1); }
    }
    if (!els.length) window.removeEventListener('scroll', onScroll);
  };

  var ticking = false;
  var onScroll = function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () { sweep(); ticking = false; });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  sweep();

  // Last resort: never let a shelf stay hidden.
  window.addEventListener('load', function () {
    setTimeout(function () {
      document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(show);
    }, 3000);
  });
})();
