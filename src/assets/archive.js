/* THE ONSET — archive filter, sort and search.
 *
 * Progressive enhancement. The server-rendered results and the numbered pages are
 * the archive; this makes them interactive. If anything here throws, the error
 * state shows and the server list stays on the page — never a dead archive.
 *
 * Filter state is a query parameter and the page goes noindex while filtered, so no
 * facet combination becomes a competing indexable URL.
 */
(function () {
  'use strict';

  var DEPTS = {}, root = document.querySelector('[data-facets]');
  if (!root) return;

  var data = window.__ONSET_DATA__ || [];
  var results = document.querySelector('[data-results]');
  var countEl = document.querySelector('[data-count]');
  var emptyEl = document.querySelector('[data-empty]');
  var errorEl = document.querySelector('[data-error]');
  var pagination = document.querySelector('[data-pagination]');
  var sortEl = document.querySelector('[data-sort]');
  var resetEls = [document.querySelector('[data-reset]'), document.querySelector('[data-reset-2]')].filter(Boolean);
  var searchInput = document.getElementById('q');
  var searchForm = searchInput && searchInput.form;

  // Read the department labels off the rail so the client never keeps a second copy.
  Array.prototype.forEach.call(document.querySelectorAll('.rail a'), function (a) {
    var m = a.getAttribute('href').match(/the-onset\/([^/]+)\//);
    if (m && m[1] !== 'archive') DEPTS[m[1]] = a.textContent.trim();
  });

  var TYPE = { article: 'Article', recipe: 'Recipe', journey: 'Patient Journey', episode: 'The Balance' };
  var state = { dept: [], pillar: [], type: [], lang: [], season: [], flag: [], q: '', sort: 'recent' };

  // ---------- URL <-> state ----------
  function readUrl() {
    var p = new URLSearchParams(location.search);
    ['dept', 'pillar', 'type', 'lang', 'season', 'flag'].forEach(function (k) {
      var v = p.get(k);
      state[k] = v ? v.split(',').filter(Boolean) : [];
    });
    state.q = p.get('q') || '';
    state.sort = p.get('sort') || 'recent';
  }

  function writeUrl() {
    var p = new URLSearchParams();
    ['dept', 'pillar', 'type', 'lang', 'season', 'flag'].forEach(function (k) {
      if (state[k].length) p.set(k, state[k].join(','));
    });
    if (state.q) p.set('q', state.q);
    if (state.sort !== 'recent') p.set('sort', state.sort);
    var qs = p.toString();
    history.replaceState(null, '', qs ? location.pathname + '?' + qs : location.pathname);
    // Filtered views are noindex — they must never compete with the canonical
    // paginated URLs for indexing.
    setNoindex(!!qs);
  }

  function setNoindex(on) {
    var m = document.querySelector('meta[name="robots"]');
    if (!m) { m = document.createElement('meta'); m.name = 'robots'; document.head.appendChild(m); }
    m.content = on ? 'noindex, follow' : 'noindex, nofollow';
  }

  function active() {
    return state.dept.length || state.pillar.length || state.type.length ||
      state.lang.length || state.season.length || state.flag.length || state.q;
  }

  // ---------- filtering ----------
  function matches(it) {
    if (state.dept.length && !state.dept.some(function (d) { return it.d === d || it.sd.indexOf(d) > -1; })) return false;
    if (state.pillar.length && !state.pillar.some(function (p) { return it.p.indexOf(p) > -1; })) return false;
    if (state.type.length && state.type.indexOf(it.k) < 0) return false;
    // Language is orthogonal: English is always present; Spanish means a twin exists.
    if (state.lang.indexOf('es') > -1 && !it.es) return false;
    if (state.season.length && (it.s === null || state.season.indexOf(String(it.s)) < 0)) return false;
    if (state.flag.indexOf('featured') > -1 && !it.f) return false;
    if (state.q) {
      var hay = (it.t + ' ' + it.st + ' ' + it.b + ' ' + it.tp + ' ' + (DEPTS[it.d] || '')).toLowerCase();
      var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.every(function (t) { return hay.indexOf(t) > -1; })) return false;
    }
    return true;
  }

  var SORTS = {
    recent: function (a, b) { return a.dt < b.dt ? 1 : a.dt > b.dt ? -1 : 0; },
    oldest: function (a, b) { return a.dt > b.dt ? 1 : a.dt < b.dt ? -1 : 0; },
    // Season sort is the Balance completeness view: episodes in order, then the rest.
    season: function (a, b) {
      if (a.s === null && b.s === null) return SORTS.recent(a, b);
      if (a.s === null) return 1;
      if (b.s === null) return -1;
      return a.s - b.s || a.e - b.e;
    },
    dept: function (a, b) {
      var x = DEPTS[a.d] || a.d, y = DEPTS[b.d] || b.d;
      return x < y ? -1 : x > y ? 1 : SORTS.recent(a, b);
    },
  };

  // ---------- rendering ----------
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function relPrefix() {
    // Derive the relative depth from where this page sits.
    var seg = location.pathname.split('/').filter(Boolean);
    var i = seg.indexOf('archive');
    return i < 0 ? './' : new Array(seg.length - i + 1).join('../');
  }

  function render(list) {
    var r = relPrefix();
    var isList = document.querySelector('[data-view="list"]').getAttribute('aria-pressed') === 'true';
    results.className = isList ? 'arch-list' : 'row row--3';
    results.innerHTML = list.map(function (it) {
      var url = r + it.u.replace(/^\//, '') + 'index.html';
      var meta = [
        fmtDate(it.dt),
        it.s !== null ? 'S' + it.s + ' · E' + it.e : null,
        esc(DEPTS[it.d] || it.d),
        '<span class="meta__type">' + TYPE[it.k] + '</span>',
        it.k === 'episode' ? it.m + ' min' : it.m + ' min read',
        it.es ? '<span class="meta__lang">EN/ES</span>' : null,
      ].filter(Boolean).join('<span class="sep" aria-hidden="true">·</span>');

      if (isList) {
        return '<li><a href="' + url + '">' + esc(it.t) + '</a><p class="meta">' + meta + '</p></li>';
      }
      return '<article class="card card--sm">' +
        '<a class="card__media" href="' + url + '" tabindex="-1" aria-hidden="true">' +
          '<div class="ph ph--16x9 ' + tint(it) + '" data-label="' + phLabel(it) + '" role="img" aria-label="Art pending"></div>' +
        '</a>' +
        '<h3 class="card__title"><a href="' + url + '">' + esc(it.t) + '</a></h3>' +
        '<hr class="card__hr">' +
        '<p class="meta">' + meta + '</p>' +
        '</article>';
    }).join('');
    if (isList) results.innerHTML = '<ul class="tick-list">' + results.innerHTML + '</ul>';
  }

  function tint(it) {
    if (it.k === 'recipe') return 'ph--wheat';
    if (it.k === 'journey') return 'ph--flesh';
    if (it.k === 'episode') return 'ph--dark';
    return '';
  }
  function phLabel(it) {
    return it.k === 'recipe' ? 'Recipe photograph' : it.k === 'journey' ? 'Patient portrait'
      : it.k === 'episode' ? 'Episode still' : 'Photograph';
  }

  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  function fmtDate(iso) {
    var p = iso.split('-');
    return parseInt(p[2], 10) + ' ' + MONTHS[parseInt(p[1], 10) - 1];
  }

  function apply() {
    try {
      if (!active() && state.sort === 'recent') {
        // Unfiltered: hand the page back to the server-rendered, paginated view.
        location.search ? location.assign(location.pathname) : restoreServer();
        return;
      }
      var list = data.filter(matches).sort(SORTS[state.sort] || SORTS.recent);
      errorEl.hidden = true;
      pagination.hidden = true;
      resetEls.forEach(function (b) { b.hidden = false; });
      if (!list.length) {
        results.innerHTML = '';
        emptyEl.hidden = false;
        countEl.textContent = 'No items match these filters';
      } else {
        emptyEl.hidden = true;
        render(list);
        countEl.textContent = 'Showing ' + list.length + ' of ' + data.length + ' items';
      }
      writeUrl();
    } catch (err) {
      errorEl.hidden = false;
      pagination.hidden = false;
    }
  }

  var serverHtml = results.innerHTML, serverClass = results.className, serverCount = countEl.textContent;
  function restoreServer() {
    results.innerHTML = serverHtml;
    results.className = serverClass;
    countEl.textContent = serverCount;
    emptyEl.hidden = true;
    pagination.hidden = false;
    resetEls.forEach(function (b) { b.hidden = true; });
    setNoindex(false);
  }

  // ---------- wiring ----------
  Array.prototype.forEach.call(root.querySelectorAll('[data-facet]'), function (group) {
    var key = group.getAttribute('data-facet');
    group.addEventListener('click', function (e) {
      var chip = e.target.closest('.chip');
      if (!chip || !chip.hasAttribute('data-val')) return;
      var val = chip.getAttribute('data-val');
      var i = state[key].indexOf(val);
      if (i > -1) state[key].splice(i, 1); else state[key].push(val);
      chip.setAttribute('aria-pressed', i > -1 ? 'false' : 'true');
      apply();
    });
  });

  sortEl.addEventListener('change', function () { state.sort = sortEl.value; apply(); });

  document.querySelector('[data-arch-view]').addEventListener('click', function (e) {
    var b = e.target.closest('[data-view]');
    if (!b) return;
    var mode = b.getAttribute('data-view');
    Array.prototype.forEach.call(this.querySelectorAll('[data-view]'), function (x) {
      x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
    });
    if (active()) apply(); else { results.className = mode === 'list' ? 'arch-list' : 'row row--3'; }
  });

  resetEls.forEach(function (b) {
    b.addEventListener('click', function () {
      state = { dept: [], pillar: [], type: [], lang: [], season: [], flag: [], q: '', sort: 'recent' };
      Array.prototype.forEach.call(root.querySelectorAll('.chip'), function (c) { c.setAttribute('aria-pressed', 'false'); });
      sortEl.value = 'recent';
      if (searchInput) searchInput.value = '';
      history.replaceState(null, '', location.pathname);
      restoreServer();
    });
  });

  if (searchForm) {
    searchForm.addEventListener('submit', function (e) {
      // Stay on the page rather than navigating — search and filters combine.
      if (location.pathname.indexOf('/archive') > -1) {
        e.preventDefault();
        state.q = searchInput.value.trim();
        apply();
      }
    });
  }

  // Restore state from the URL on load (department chips, topic chips and See-all
  // links all arrive here with query parameters set).
  readUrl();
  if (searchInput && state.q) searchInput.value = state.q;
  sortEl.value = state.sort;
  ['dept', 'pillar', 'type', 'lang', 'season', 'flag'].forEach(function (k) {
    state[k].forEach(function (v) {
      var chip = root.querySelector('[data-facet="' + k + '"] .chip[data-val="' + v + '"]');
      if (chip) chip.setAttribute('aria-pressed', 'true');
    });
  });
  if (active() || state.sort !== 'recent') apply();
})();
