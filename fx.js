// Preloader (first visit), page-transition curtain, desktop cursor. No dependencies.
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var E = 'cubic-bezier(.16,1,.3,1)';
  var NAMES = { 'index.html': 'Home', 'BeachHouse.dc.html': 'Home', 'house.html': 'The House', 'House.dc.html': 'The House', 'location.html': 'Location', 'Location.dc.html': 'Location', 'gallery.html': 'Gallery', 'Gallery.dc.html': 'Gallery', 'book.html': 'Book', 'Book.dc.html': 'Book' };
  function el(css, html) { var d = document.createElement('div'); d.style.cssText = css; if (html) d.innerHTML = html; document.documentElement.appendChild(d); return d; }
  var serif = "font-family:'Instrument Serif',Georgia,serif;";
  var curtainCss = 'position:fixed;inset:0;z-index:9999;background:#0C1820;color:#F4F1EA;display:flex;align-items:center;justify-content:center;' + serif;

  // Curtain that lifts on load (covers both preloader and arriving from a transition)
  var first = !sessionStorage.getItem('vbh-seen');
  var arriving = sessionStorage.getItem('vbh-nav');
  sessionStorage.removeItem('vbh-nav');
  if (!reduce && (first || arriving)) {
    var c = el(curtainCss + 'transition:transform 1.2s ' + E + ';', '<span id="vbh-n" style="font-size:clamp(72px,16vw,220px);line-height:1;font-style:italic">' + (first ? '0' : arriving) + '</span>');
    var lift = function () { c.style.transform = 'translateY(-100%)'; setTimeout(function () { c.remove(); }, 1300); };
    if (first) {
      sessionStorage.setItem('vbh-seen', '1');
      var n = c.querySelector('#vbh-n'), t0 = performance.now(), dur = 1600;
      (function tick(t) { var k = Math.min(1, (t - t0) / dur); n.textContent = Math.round(100 * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); else setTimeout(lift, 200); })(t0);
    } else setTimeout(lift, 350);
  } else sessionStorage.setItem('vbh-seen', '1');

  // Outgoing transition
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || reduce || a.target === '_blank' || e.metaKey || e.ctrlKey) return;
    var href = a.getAttribute('href'), file = href.split('#')[0].split('?')[0];
    if (!NAMES[file] || location.pathname.endsWith('/' + file) && href.indexOf('#') > -1) return;
    e.preventDefault();
    sessionStorage.setItem('vbh-nav', NAMES[file]);
    var o = el(curtainCss + 'transform:translateY(100%);transition:transform .9s ' + E + ';', '<span style="font-size:clamp(56px,10vw,140px);font-style:italic">' + NAMES[file] + '</span>');
    requestAnimationFrame(function () { requestAnimationFrame(function () { o.style.transform = 'none'; }); });
    setTimeout(function () { location.href = href; }, 900);
  }, true);

  // Cursor (desktop only)
  if (!matchMedia('(pointer: fine)').matches || reduce) return;
  var cur = el('position:fixed;left:0;top:0;z-index:9998;pointer-events:none;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:999px;background:#0E1A24;color:#F4F1EA;display:flex;align-items:center;justify-content:center;font:500 12px "Inter Tight",sans-serif;mix-blend-mode:normal;transition:width .5s ' + E + ',height .5s ' + E + ',margin .5s ' + E + ',background .4s;');
  var x = 0, y = 0, cx = 0, cy = 0;
  addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; var t = e.target;
    var img = t.closest && t.closest('img,[data-view]'), link = t.closest && t.closest('a,button');
    var s = img && !(link && !link.querySelector('img')) ? 72 : link ? 6 : 12;
    cur.style.width = cur.style.height = s + 'px'; cur.style.margin = (-s / 2) + 'px 0 0 ' + (-s / 2) + 'px';
    cur.textContent = s === 72 ? 'View' : ''; cur.style.background = s === 72 ? 'rgba(12,24,32,.85)' : '#0E1A24';
  }, { passive: true });
  (function loop() { cx += (x - cx) * 0.2; cy += (y - cy) * 0.2; cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px)'; requestAnimationFrame(loop); })();
})();
