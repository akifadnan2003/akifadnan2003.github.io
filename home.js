/* Akif Adnan · v5 "Kinetic type" */
(function () {
  'use strict';

  var root = document.documentElement;
  var force = root.classList.contains('force-motion');
  var prefersReduce = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  var reduce = prefersReduce && !force;
  var finePointer = window.matchMedia ? matchMedia('(hover: hover) and (pointer: fine)').matches : true;

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function lerp(a, b, t) { return a + (b - a) * t; }

  /* ---------------- Intro ---------------- */
  var intro = document.getElementById('intro');
  var introTimers = [];
  function heroIn() { root.classList.add('hero-in'); }
  function finishIntro() {
    introTimers.forEach(clearTimeout);
    heroIn();
    root.classList.add('intro-done');
  }
  if (root.classList.contains('intro-on') && intro) {
    var skip = function () {
      if (root.classList.contains('intro-done')) return;
      intro.classList.add('is-split');
      heroIn();
      introTimers.forEach(clearTimeout);
      introTimers = [setTimeout(finishIntro, 650)];
    };
    intro.addEventListener('click', skip);
    document.getElementById('introSkip').addEventListener('click', function (e) { e.stopPropagation(); skip(); });
    window.addEventListener('keydown', function onKey(e) {
      if (root.classList.contains('intro-done')) { window.removeEventListener('keydown', onKey); return; }
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') skip();
    });
    introTimers.push(setTimeout(function () { intro.classList.add('is-in'); }, 80));
    introTimers.push(setTimeout(function () { intro.classList.add('is-split'); }, 1050));
    introTimers.push(setTimeout(heroIn, 1250));
    introTimers.push(setTimeout(finishIntro, 2150));
  } else {
    finishIntro();
  }

  /* ---------------- Kinetic rows ---------------- */
  var rows = [].slice.call(document.querySelectorAll('.row')).map(function (el, i) {
    var track = el.querySelector('.row__track');
    var unit = track.querySelector('.row__unit');
    return {
      el: el, track: track, unit: unit,
      speed: parseFloat(el.getAttribute('data-speed')) || 30,
      dir: parseFloat(el.getAttribute('data-dir')) || -1,
      x: 0, w: 1, visible: true, seed: i
    };
  });

  function buildRows() {
    rows.forEach(function (r) {
      // keep only the first unit, then clone enough copies to cover the row twice
      while (r.track.children.length > 1) r.track.removeChild(r.track.lastChild);
      r.w = r.unit.getBoundingClientRect().width || 1;
      var need = Math.ceil((r.el.clientWidth || window.innerWidth) / r.w) + 1;
      for (var k = 0; k < need; k++) {
        var c = r.unit.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        r.track.appendChild(c);
      }
      // a different starting offset per row so the rows never line up
      r.x = -((r.seed * 0.37) % 1) * r.w;
      r.track.style.transform = 'translate3d(' + r.x.toFixed(2) + 'px,0,0)';
    });
  }

  if ('IntersectionObserver' in window) {
    var rowIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        rows.forEach(function (r) { if (r.el === en.target) r.visible = en.isIntersecting; });
      });
    }, { rootMargin: '80px 0px' });
    rows.forEach(function (r) { rowIO.observe(r.el); });
  }

  /* ---------------- Scroll-linked word reveal ---------------- */
  var revealBlocks = [].slice.call(document.querySelectorAll('[data-reveal-words]')).map(function (block) {
    var target = block.querySelector('p') || block;
    var words = target.textContent.split(/ +/).filter(Boolean);
    target.textContent = '';
    var spans = words.map(function (w, i) {
      var s = document.createElement('span');
      s.className = 'w';
      s.textContent = w;
      target.appendChild(s);
      if (i < words.length - 1) target.appendChild(document.createTextNode(' '));
      return s;
    });
    if (!reduce) block.classList.add('reveal-ready');
    return { el: block, spans: spans, lit: -1 };
  });

  function updateReveal(vh) {
    for (var i = 0; i < revealBlocks.length; i++) {
      var b = revealBlocks[i];
      var rect = b.el.getBoundingClientRect();
      if (rect.bottom < -vh || rect.top > vh * 2) continue;
      var p = clamp((vh * 0.88 - rect.top) / (rect.height + vh * 0.3), 0, 1);
      var lit = Math.round(p * b.spans.length);
      if (lit === b.lit) continue;
      b.lit = lit;
      for (var j = 0; j < b.spans.length; j++) b.spans[j].classList.toggle('on', j < lit);
    }
  }

  /* ---------------- Nav state ---------------- */
  var nav = document.getElementById('nav');
  function updateNav(y) { nav.classList.toggle('is-scrolled', y > 40); }

  /* ---------------- Spotlight ---------------- */
  var spot = document.getElementById('spot');
  var spotT = { x: window.innerWidth / 2, y: window.innerHeight / 3 };
  var spotP = { x: spotT.x, y: spotT.y };
  var spotActive = false;
  if (finePointer && spot) {
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      spotT.x = e.clientX; spotT.y = e.clientY;
      if (!spotActive) {
        spotActive = true;
        spotP.x = spotT.x; spotP.y = spotT.y;
        spot.classList.add('is-on');
      }
      if (reduce) spot.style.transform = 'translate3d(' + spotT.x + 'px,' + spotT.y + 'px,0)';
    }, { passive: true });
    document.addEventListener('pointerleave', function () { spot.classList.remove('is-on'); spotActive = false; });
  }

  /* ---------------- Hero parallax targets ---------------- */
  var heroImg = document.querySelector('.hero__portrait img');
  var rowsWrap = document.querySelector('.rows');
  var hero = document.querySelector('.hero');

  /* ---------------- Main loop ---------------- */
  var scrollY = window.pageYOffset;
  var lastY = scrollY;
  var vel = 0;          // smoothed scroll velocity, px/s
  var skew = 0;
  var scrollDir = 1;    // 1 = scrolling down (or idle), -1 = last scrolled up
  var lastT = 0;
  var dirtyScroll = true;

  window.addEventListener('scroll', function () {
    scrollY = window.pageYOffset;
    dirtyScroll = true;
    if (reduce) { updateNav(scrollY); updateReveal(window.innerHeight); }
  }, { passive: true });

  function frame(t) {
    var dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 0.016;
    lastT = t;
    var vh = window.innerHeight;

    var dy = scrollY - lastY;
    lastY = scrollY;
    var instV = dt > 0 ? dy / dt : 0;
    vel = lerp(vel, instV, 0.18);
    if (Math.abs(vel) < 0.5) vel = 0;
    if (dy > 0.5) scrollDir = 1; else if (dy < -0.5) scrollDir = -1;
    skew = lerp(skew, clamp(-vel / 140, -10, 10), 0.12);
    if (Math.abs(skew) < 0.01) skew = 0;
    var boost = 1 + Math.min(Math.abs(vel) / 260, 7);

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (!r.visible) continue;
      r.x += r.dir * scrollDir * r.speed * boost * dt;
      if (r.x <= -r.w) r.x += r.w;
      else if (r.x > 0) r.x -= r.w;
      r.track.style.transform = 'translate3d(' + r.x.toFixed(2) + 'px,0,0) skewX(' + (skew * (i % 2 ? -1 : 1)).toFixed(2) + 'deg)';
    }

    if (dirtyScroll) {
      dirtyScroll = false;
      updateNav(scrollY);
      updateReveal(vh);
      if (scrollY < vh * 1.2 && root.classList.contains('intro-done')) {
        heroImg.style.transform = 'translate3d(0,' + (scrollY * 0.12).toFixed(1) + 'px,0)';
        rowsWrap.style.transform = 'translate3d(0,' + (scrollY * -0.08).toFixed(1) + 'px,0)';
      }
    }

    if (spotActive) {
      spotP.x = lerp(spotP.x, spotT.x, 0.14);
      spotP.y = lerp(spotP.y, spotT.y, 0.14);
      spot.style.transform = 'translate3d(' + spotP.x.toFixed(1) + 'px,' + spotP.y.toFixed(1) + 'px,0)';
    }

    requestAnimationFrame(frame);
  }

  /* ---------------- Counters ---------------- */
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  function runCounter(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-dec'), 10) || 0;
    var dur = 1400, t0 = null;
    function step(t) {
      if (t0 === null) t0 = t;
      var p = clamp((t - t0) / dur, 0, 1);
      var e = 1 - Math.pow(1 - p, 3);
      el.textContent = (end * e).toFixed(dec);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (!reduce && 'IntersectionObserver' in window) {
    var cIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        cIO.unobserve(en.target);
        runCounter(en.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) {
      el.textContent = (0).toFixed(parseInt(el.getAttribute('data-dec'), 10) || 0);
      cIO.observe(el);
    });
  }

  /* ---------------- Services list ---------------- */
  [].slice.call(document.querySelectorAll('.svc__item')).forEach(function (item) {
    var btn = item.querySelector('.svc__head');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
      if (open) item.classList.remove('is-open');
    });
    if (finePointer) {
      item.addEventListener('mouseenter', function () { item.classList.add('is-open'); });
      item.addEventListener('mouseleave', function () { item.classList.remove('is-open'); });
    }
  });

  /* ---------------- Email: fit to width ---------------- */
  var mail = document.getElementById('mail');
  var mailText = mail ? mail.querySelector('.contact__mail-text') : null;
  function fitMail() {
    if (!mail || !mailText) return;
    mail.style.transition = 'none';
    mail.style.fontSize = '100px';
    var w = mailText.getBoundingClientRect().width;
    var avail = mail.clientWidth;
    if (!w || !avail) { mail.style.fontSize = ''; return; }
    mail.style.fontSize = Math.min(260, (avail / w) * 100 * 0.99).toFixed(1) + 'px';
  }

  /* ---------------- Copy email ---------------- */
  var copyBtn = document.getElementById('copyMail');
  var copyStatus = document.getElementById('copyStatus');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var email = copyBtn.getAttribute('data-email');
      var tr = document.documentElement.lang === 'tr';
      var done = function () { copyStatus.textContent = tr ? 'Kopyalandı' : 'Copied to clipboard'; setTimeout(function () { copyStatus.textContent = ''; }, 2400); };
      var fail = function () { copyStatus.textContent = (tr ? 'Kopyalanamadı. Adres: ' : 'Could not copy. The address is ') + email; };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, fail);
      } else {
        try {
          var ta = document.createElement('textarea');
          ta.value = email; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
          document.body.appendChild(ta); ta.select();
          document.execCommand('copy') ? done() : fail();
          document.body.removeChild(ta);
        } catch (e) { fail(); }
      }
    });
  }

  /* ---------------- Start ---------------- */
  function layout() { buildRows(); fitMail(); }
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { layout(); dirtyScroll = true; if (reduce) updateReveal(window.innerHeight); }, 150);
  });

  layout();
  updateNav(scrollY);
  updateReveal(window.innerHeight);
  if (document.fonts) {
    if (document.fonts.ready) document.fonts.ready.then(layout);
    if (document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', layout);
    if (document.fonts.load) {
      Promise.all([
        document.fonts.load('850 100px Archivo', 'AKIF'),
        document.fonts.load('400 13px "JetBrains Mono"', 'a')
      ]).then(layout, function () {});
    }
  }
  window.addEventListener('load', layout);

  if (!reduce) requestAnimationFrame(frame);
})();
