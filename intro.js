/* =========================================================
   INTRODUÇÃO — a fechadura
   "Há coisas que só se revelam a quem olha mais de perto."

   Para trocar os vídeos: edite a lista abaixo. Cada item pode ter
   webm e/ou mp4. Os vídeos tocam em sequência dentro da fechadura,
   sem som. Se nenhum carregar, aparece a imagem de fallback.
   ========================================================= */
var INTRO_VIDEOS = [
  { webm: 'assets/intro/fechadura.webm', mp4: 'assets/intro/fechadura.mp4' }
  // { webm: 'assets/intro/outro-video.webm', mp4: 'assets/intro/outro-video.mp4' },
];
// trocas de cena dentro do vídeo (em segundos), para a luz reagir
var INTRO_CUTS = [3.8, 7.6, 11.4, 15.2];

(function () {
  var root = document.documentElement;
  var el = document.getElementById('intro');
  if (!el) { window.loIntroDone = true; return; }
  var video = document.getElementById('kh-video');
  var kh = document.getElementById('kh');
  var go = document.getElementById('intro-go');
  var skip = document.getElementById('intro-skip');
  var replay = document.getElementById('replay-intro');
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var vi = 0, raf = 0, flash = 0, nextFlash = 0, lastCut = -1, leaving = false, boost = 0;

  /* ---------- vídeos ---------- */
  function loadVideo(i) {
    var v = INTRO_VIDEOS[i];
    if (!v || !video) return;
    video.innerHTML = '';
    if (v.webm) { var s1 = document.createElement('source'); s1.src = v.webm; s1.type = 'video/webm'; video.appendChild(s1); }
    if (v.mp4) { var s2 = document.createElement('source'); s2.src = v.mp4; s2.type = 'video/mp4'; video.appendChild(s2); }
    video.loop = INTRO_VIDEOS.length === 1;
    video.load();
    var p = video.play(); if (p && p.catch) p.catch(function () {});
  }
  if (video) {
    video.addEventListener('playing', function () { el.classList.add('has-video'); });
    video.addEventListener('error', function () { el.classList.remove('has-video'); }, true);
    video.addEventListener('ended', function () { vi = (vi + 1) % INTRO_VIDEOS.length; loadVideo(vi); flash = 1; });
  }

  /* ---------- luz: pulsa devagar, com flashes ocasionais ---------- */
  function light(t) {
    raf = 0;
    if (!el.classList.contains('open')) return;
    var s = t / 1000;
    var g = 0.62 + 0.13 * Math.sin(s * 0.8) + 0.07 * Math.sin(s * 2.3 + 1.7) + 0.04 * Math.sin(s * 5.1 + 0.4);
    if (t > nextFlash) { flash = Math.max(flash, 0.45 + Math.random() * 0.35); nextFlash = t + 3500 + Math.random() * 4500; }
    if (video && !video.paused) {
      var ct = video.currentTime, cut = -1;
      for (var i = 0; i < INTRO_CUTS.length; i++) if (ct >= INTRO_CUTS[i] && ct < INTRO_CUTS[i] + 0.35) cut = i;
      if (cut !== -1 && cut !== lastCut) { flash = Math.max(flash, 0.7); }
      lastCut = cut;
    }
    flash *= 0.94;
    el.style.setProperty('--g', (g + flash * 0.55 + boost).toFixed(3));
    el.style.setProperty('--f', flash.toFixed(3));
    raf = requestAnimationFrame(light);
  }

  /* ---------- abrir / entrar ---------- */
  function open() {
    leaving = false; boost = 0;
    root.classList.add('intro-open');
    root.classList.remove('sem-abertura');
    el.hidden = false;
    el.classList.remove('going', 'gone', 'quick', 'bloom');
    kh.getAnimations && kh.getAnimations().forEach(function (a) { a.cancel(); });
    kh.style.transform = '';
    void el.offsetWidth;
    el.classList.add('open');
    nextFlash = performance.now() + 2500;
    if (video) { if (!video.currentSrc) loadVideo(vi); else { var p = video.play(); if (p && p.catch) p.catch(function () {}); } }
    if (!reduce && !raf) raf = requestAnimationFrame(light);
    setTimeout(function () { try { go.focus({ preventScroll: true }); } catch (e) {} }, 1600);
  }
  function finish() {
    try { sessionStorage.setItem('lo-abertura', '1'); } catch (e) {}
    root.classList.remove('intro-open');
    el.classList.add('gone');
    setTimeout(function () {
      el.classList.remove('open', 'going', 'quick', 'bloom', 'gone');
      kh.getAnimations && kh.getAnimations().forEach(function (a) { a.cancel(); });
      el.hidden = true;
      if (video) video.pause();
      kh.style.transform = '';
      window.loIntroDone = true;
      document.dispatchEvent(new CustomEvent('lo:entrou'));
    }, reduce ? 450 : 1100);
  }
  function enter(quick) {
    if (leaving) return;
    leaving = true;
    if (window.loSound) loSound.play('page');
    if (reduce) { finish(); return; }
    if (quick) { el.classList.add('quick'); setTimeout(finish, 450); return; }

    el.classList.add('going');                       // 1. a luz se intensifica
    var t0 = performance.now();
    (function ramp(t) { boost = Math.min(1.1, (t - t0) / 900); if (leaving && boost < 1.1) requestAnimationFrame(ramp); })(t0);

    // 2–5. a câmera se aproxima da fechadura até atravessar a tela
    var r = kh.getBoundingClientRect();
    var cx = r.left + r.width / 2, cy = r.top + r.height * 0.32;       // centro do círculo da fechadura
    var dx = innerWidth / 2 - cx, dy = innerHeight / 2 - cy;
    var S = 1.25 * Math.hypot(innerWidth, innerHeight) / (r.width * 0.8);
    kh.style.transformOrigin = '50% 32%';
    var anim = kh.animate([
      { transform: 'translate(0px, 0px) scale(1)' },
      { transform: 'translate(' + dx * 0.3 + 'px,' + dy * 0.3 + 'px) scale(1.25)', offset: 0.25 },
      { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + S.toFixed(2) + ')' }
    ], { duration: 1900, delay: 420, easing: 'cubic-bezier(.55, 0, .25, 1)', fill: 'forwards' });
    // 6–7. a luz quente preenche a tela e se dissolve no site
    setTimeout(function () { el.classList.add('bloom'); }, 1650);
    anim.onfinish = function () { setTimeout(finish, 250); };
  }

  go.addEventListener('click', function () { enter(false); });
  skip.addEventListener('click', function () { enter(true); });
  el.addEventListener('keydown', function (e) { if (e.key === 'Escape') enter(true); });
  if (replay) replay.addEventListener('click', function () {
    window.scrollTo(0, 0);
    open();
  });

  if (root.classList.contains('sem-abertura')) {
    el.hidden = true;
    window.loIntroDone = true;
  } else {
    open();
  }
})();
