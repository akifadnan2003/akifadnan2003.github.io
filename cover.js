/* Cover layout: the name fills the width, the portrait's head sits over its lower edge,
   and the cover lines take the two sides. Below 1100px the cover stacks. */
(function () {
  'use strict';
  var root = document.documentElement;
  var mastText = document.getElementById('mastText');
  if (!mastText) return;
  var IMG_RATIO = 1125 / 900;   // portrait height / width
  var HEAD_TOP = 0.098;         // the head starts 9.8% down the image

  function px(n) { return (Math.round(n * 100) / 100) + 'px'; }

  function fit(avail) {
    mastText.style.fontSize = '100px';
    var w = mastText.getBoundingClientRect().width;
    mastText.style.fontSize = '';
    return w ? Math.max(40, Math.floor(100 * avail / w * 0.995)) : 0;
  }

  function layout() {
    var vw = root.clientWidth, vh = window.innerHeight;
    var g = Math.min(56, Math.max(16, vw * 0.04));
    var mh = fit(vw - 2 * g);
    if (!mh) return;
    root.style.setProperty('--mh', mh + 'px');

    var spread = false;
    if (vw >= 1100 && vh >= 600) {
      var coverH = Math.max(vh, 680);
      var T = 84;
      var H = (coverH - T - 0.26 * mh) / (1 - HEAD_TOP);
      var pw = H / IMG_RATIO;
      if (pw > vw * 0.5) { pw = vw * 0.5; }
      var side = (vw - pw) / 2 - g - 8;
      if (side >= 250) {
        spread = true;
        root.style.setProperty('--coverH', px(coverH));
        root.style.setProperty('--T', px(T));
        root.style.setProperty('--pw', px(pw));
        root.style.setProperty('--side', px(Math.min(side, 380)));
        root.style.setProperty('--linesTop', px(T + mh * 0.84 + 30));
      }
    }
    root.classList.toggle('spread-mode', spread);
  }

  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
  var t;
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(layout, 80); });
})();
