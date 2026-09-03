/* THE ONSET — ticker behaviour.
 *
 * Progressive enhancement only. Without this file every set is visible and every
 * link works; the module degrades to a static curated stack rather than a dead
 * carousel. Nothing here is the sole route to any content.
 *
 * WCAG 2.2 SC 2.2.2 (Pause, Stop, Hide) is the governing criterion.
 */
(function () {
  'use strict';

  var MIN_INTERVAL = 7000; // never faster than 7 seconds
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');

  function init(root) {
    var sets = Array.prototype.slice.call(root.querySelectorAll('[data-tick-set]'));
    if (sets.length < 2) {
      // One set: no rotation to offer. Reveal only the view toggle.
      show(root.querySelector('[data-tick-view]'));
      wireView(root, sets);
      return;
    }

    var i = 0, timer = null, auto = false, paused = false, stopped = false;
    var posEl = root.querySelector('[data-tick-pos]');
    var btn = function (n) { return root.querySelector('[data-tick="' + n + '"]'); };
    var prev = btn('prev'), next = btn('next'), autoBtn = btn('auto'),
        pauseBtn = btn('pause'), stopBtn = btn('stop');

    // Reveal the controls now that they do something.
    show(root.querySelector('[data-tick-nav]'));
    show(root.querySelector('[data-tick-auto]'));
    show(root.querySelector('[data-tick-view]'));
    show(root.querySelector('[data-tick-note]'));

    function render() {
      sets.forEach(function (s, n) { s.hidden = n !== i; });
      if (posEl) posEl.innerHTML = 'Set <strong>' + (i + 1) + '</strong> of ' + sets.length;
    }

    // Every advance swaps the WHOLE set, never a single tile.
    function go(d) { i = (i + d + sets.length) % sets.length; render(); }

    function tick() { if (auto && !paused && !stopped) go(1); }

    function startTimer() { clearInterval(timer); timer = setInterval(tick, MIN_INTERVAL); }
    function clearTimer() { clearInterval(timer); timer = null; }

    function syncAuto() {
      autoBtn.setAttribute('aria-pressed', auto ? 'true' : 'false');
      pauseBtn.disabled = !auto || stopped;
      stopBtn.disabled = !auto || stopped;
      pauseBtn.querySelector('[data-icon]').textContent = paused ? '▶' : '❙❙';
      pauseBtn.querySelector('[data-label]').textContent = paused ? 'Resume' : 'Pause';
    }

    prev.addEventListener('click', function () { pauseForInteraction(); go(-1); });
    next.addEventListener('click', function () { pauseForInteraction(); go(1); });

    autoBtn.addEventListener('click', function () {
      if (stopped) return;
      auto = !auto; paused = false;
      if (auto) startTimer(); else clearTimer();
      syncAuto();
    });

    pauseBtn.addEventListener('click', function () {
      paused = !paused;
      syncAuto();
    });

    // Stop is permanent for the visit — the "stop" half of SC 2.2.2, distinct
    // from pause, which is resumable.
    stopBtn.addEventListener('click', function () {
      stopped = true; auto = false; paused = false;
      clearTimer();
      autoBtn.disabled = true;
      syncAuto();
    });

    // Any interaction pauses rotation and it STAYS paused.
    function pauseForInteraction() {
      if (auto && !paused) { paused = true; syncAuto(); }
    }
    root.addEventListener('click', function (e) {
      if (e.target.closest('a')) pauseForInteraction();
    });

    // Hover and focus pause. Leaving does NOT resume — staying paused is the
    // requirement; the reader restarts rotation deliberately.
    root.addEventListener('mouseenter', pauseForInteraction, true);
    root.addEventListener('focusin', pauseForInteraction);

    // A reduced-motion preference disables rotation outright, and says so.
    function applyMotion() {
      if (reduced && reduced.matches) {
        auto = false; clearTimer();
        autoBtn.disabled = true;
        autoBtn.title = 'Auto-rotation is off because your system asks for reduced motion.';
        syncAuto();
      } else if (!stopped) {
        autoBtn.disabled = false;
        autoBtn.removeAttribute('title');
      }
    }
    if (reduced) {
      applyMotion();
      if (reduced.addEventListener) reduced.addEventListener('change', applyMotion);
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) clearTimer(); else if (auto && !paused && !stopped) startTimer();
    });

    wireView(root, sets);
    render();
    syncAuto();
  }

  function wireView(root, sets) {
    var gridBtn = root.querySelector('[data-tick="grid"]');
    var listBtn = root.querySelector('[data-tick="list"]');
    if (!gridBtn || !listBtn) return;
    function set(mode) {
      var list = mode === 'list';
      sets.forEach(function (s) { s.classList.toggle('is-list', list); });
      gridBtn.setAttribute('aria-pressed', list ? 'false' : 'true');
      listBtn.setAttribute('aria-pressed', list ? 'true' : 'false');
      try { localStorage.setItem('onset:view', mode); } catch (e) { /* private mode */ }
    }
    gridBtn.addEventListener('click', function () { set('grid'); });
    listBtn.addEventListener('click', function () { set('list'); });
    var saved = null;
    try { saved = localStorage.getItem('onset:view'); } catch (e) { /* private mode */ }
    if (saved === 'list') set('list');
  }

  function show(el) { if (el) el.hidden = false; }

  document.addEventListener('DOMContentLoaded', function () {
    Array.prototype.forEach.call(document.querySelectorAll('[data-tick-sets]'), function (sets) {
      init(sets.closest('section'));
    });
  });
})();
