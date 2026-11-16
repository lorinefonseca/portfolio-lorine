var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
document.documentElement.classList.add('js');

/* =========================================================
   TRILHA SONORA — "A Trilha Sonora da Minha Vida" (Spotify)
   Para trocar as músicas: edite a lista abaixo.
   uri = Spotify > ··· > Compartilhar > Copiar link da música
         (o link vira spotify:track:ID)
   ========================================================= */
var PLAYLIST = 'spotify:playlist:3jPBRkM489i16rdP3VZsXd';
var TRACKS = [
  { title: 'Dreams', artist: 'Fleetwood Mac', uri: 'spotify:track:0ofHAoxe9vBkTCp2UQIavz', cover: 'https://i.scdn.co/image/ab67616d00001e02e52a59a28efa4773dd2bfe1b' },
  { title: 'Take A Chance On Me', artist: 'ABBA', uri: 'spotify:track:5BckPAYcKEJuYs1eV1BHHe', cover: 'https://i.scdn.co/image/ab67616d00001e026f705bef76c1d861c4d51d8c' },
  { title: 'Mockingbird', artist: 'Larkin Poe', uri: 'spotify:track:6ww6Jhl1ciBSMARpaQkDp4', cover: 'https://i.scdn.co/image/ab67616d00001e02d10f20af17289cd723bf5e03' },
  { title: 'Bloom Again', artist: 'Larkin Poe', uri: 'spotify:track:0gB4RgvX1XOV5LEgRWliGo', cover: 'https://i.scdn.co/image/ab67616d00001e02d10f20af17289cd723bf5e03' },
  { title: 'Procession', artist: 'Nightwish', uri: 'spotify:track:7aIxfEHjebCNbs6bpKv9Go', cover: 'https://i.scdn.co/image/ab67616d00001e024fadb2c3b4790efd1ed1e369' },
  { title: "How's the Heart?", artist: 'Nightwish', uri: 'spotify:track:6lkVbijlh932FSS2I0gDrR', cover: 'https://i.scdn.co/image/ab67616d00001e024fadb2c3b4790efd1ed1e369' },
  { title: 'Rivers', artist: 'Epica', uri: 'spotify:track:6SO03S6E3WsdfUsrdz447z', cover: 'https://i.scdn.co/image/ab67616d00001e029c939252c5024c6584db122b' },
  { title: 'Send Me On My Way', artist: 'Rusted Root', uri: 'spotify:track:6XK6Zw6JkFsHXzAcMWNiIr', cover: 'https://i.scdn.co/image/ab67616d00001e0279e5734d0c151415e3fa8d6f' },
  { title: 'Walk Of Life', artist: 'Dire Straits', uri: 'spotify:track:5Hk4Mpex0s2ndUpDQ5v2rU', cover: 'https://i.scdn.co/image/ab67616d00001e027ed2600002d1482f1fa4c1c6' },
  { title: 'I Shot The Sheriff', artist: 'Eric Clapton', uri: 'spotify:track:0UOxp1BpnD8uPQMKU4wKjz', cover: 'https://i.scdn.co/image/ab67616d00001e02d752956b8a82ffa07baa835e' },
  { title: 'Lady Writer', artist: 'Dire Straits', uri: 'spotify:track:2RBcYkonAofm0rYycVrCGt', cover: 'https://i.scdn.co/image/ab67616d00001e02b1f7f1d5898b28c1ce3f4947' },
  { title: 'Sisters of the Moon', artist: 'Fleetwood Mac', uri: 'spotify:track:7Gjj6NxSsVwXfOXUjvjCXv', cover: 'https://i.scdn.co/image/ab67616d00001e02d46213c0dd0b032092ea6db3' },
  { title: 'Tusk (ao vivo)', artist: 'Fleetwood Mac', uri: 'spotify:track:66iVi7pfwvuaZgraZEbgpP', cover: 'https://i.scdn.co/image/ab6742d3000052b76f0897bc1c4494225123c775' },
  { title: 'Somewhere Only We Know', artist: 'Keane', uri: 'spotify:track:1SKPmfSYaPsETbRHaiA18G', cover: 'https://i.scdn.co/image/ab67616d00001e027d6cd95a046a3c0dacbc7d33' },
  { title: "Everybody's Changing", artist: 'Keane', uri: 'spotify:track:0yac0FPhLRH9i9lOng3f81', cover: 'https://i.scdn.co/image/ab67616d00001e027d6cd95a046a3c0dacbc7d33' }
];

/* Notas da margem: cada palavra destacada do título acende a nota correspondente. */
(function () {
  var notes = Array.prototype.slice.call(document.querySelectorAll('.margin .hand'));
  var words = Array.prototype.slice.call(document.querySelectorAll('.hero .w'));
  function show(id) {
    notes.forEach(function (n) {
      var match = n.getAttribute('data-note') === id;
      n.classList.toggle('dim', !match);
      n.classList.toggle('lit', match);
    });
  }
  function clear() {
    notes.forEach(function (n) { n.classList.remove('dim', 'lit'); });
    words.forEach(function (w) { w.classList.remove('on'); });
  }
  words.forEach(function (w) {
    var id = w.getAttribute('data-for');
    w.addEventListener('mouseenter', function () { show(id); });
    w.addEventListener('focus', function () { show(id); });
    w.addEventListener('mouseleave', clear);
    w.addEventListener('blur', clear);
    w.addEventListener('click', function () {
      var on = w.classList.contains('on');
      clear();
      if (!on) { w.classList.add('on'); show(id); }
    });
  });
})();

/* Máquina de escrever (estilo "Text Type"): escreve um texto letra por letra. */
function typeText(el, str, speed, done) {
  if (el._typing) clearTimeout(el._typing);
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { el.textContent = str; if (done) done(); return; }
  var i = 0;
  el.textContent = '';
  (function step() {
    el.textContent = str.slice(0, ++i);
    if (i < str.length) el._typing = setTimeout(step, speed + Math.random() * speed * 0.6);
    else { el._typing = 0; if (done) done(); }
  })();
}
function eraseText(el, speed, done) {
  if (el._typing) clearTimeout(el._typing);
  (function step() {
    el.textContent = el.textContent.slice(0, -1);
    if (el.textContent.length) el._typing = setTimeout(step, speed);
    else { el._typing = 0; if (done) done(); }
  })();
}

/* Notas soltas: cada toque datilografa outra frase. */
(function () {
  var btn = document.getElementById('phrase');
  var text = document.getElementById('phrase-text');
  if (!btn || !text) return;
  var phrases = [
    'Nem toda boa ideia começa fazendo sentido.',
    'O extraordinário também mora nos detalhes.',
    'Algumas ideias precisam de espaço para florescer.',
    'Gosto das perguntas que abrem novas possibilidades.',
    'Criar é encontrar novos sentidos para o que já existe.',
    'Sensibilidade para perceber. Inteligência para transformar.',
    'Ainda bem que nem tudo precisa ser óbvio.',
    'O processo também faz parte da obra.'
  ];
  var i = 0;
  btn.addEventListener('click', function () {
    i = (i + 1) % phrases.length;
    btn.classList.add('typing');
    typeText(text, phrases[i], 38, function () { btn.classList.remove('typing'); });
  });
})();

/* Vitrola: estante de discos + player oficial do Spotify (IFrame API).
   O disco gira quando a música toca e para quando pausa. */
(function () {
  var box = document.getElementById('trilha');
  var shelf = document.getElementById('shelf');
  if (!box || !shelf) return;
  var playBtn = document.getElementById('play');
  var prevBtn = document.getElementById('prev');
  var nextBtn = document.getElementById('next');
  var table = document.getElementById('turntable');
  var nowTitle = document.getElementById('now-title');
  var nowArtist = document.getElementById('now-artist');
  var nowLabel = document.getElementById('now-label');
  var bar = document.getElementById('progress-bar');
  var embedEl = document.getElementById('spotify-embed');
  var LABELS = ['#882C3D', '#516345', '#C29A51', '#A87D82', '#5E1A28', '#818D47'];

  var controller = null, current = -1, paused = true, pending = null;
  var sleeves = [];

  TRACKS.forEach(function (t, i) {
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'sleeve';
    b.style.setProperty('--label', LABELS[i % LABELS.length]);
    b.style.setProperty('--tilt', ((i * 37) % 7 - 3) * 0.6 + 'deg');
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = '<span class="disc" aria-hidden="true"><span class="disc-art"></span></span><span class="cover"><img class="cover-img" alt="" loading="lazy"><span class="s-n"></span><span class="s-artist"></span><span class="s-title"></span></span>';
    if (t.cover) {
      b.querySelector('.cover-img').src = t.cover;
      b.querySelector('.disc-art').style.backgroundImage = 'url(' + t.cover + ')';
      b.classList.add('has-cover');
    } else { b.querySelector('.cover-img').remove(); }
    b.querySelector('.s-n').textContent = 'lado A · ' + String(i + 1).padStart(2, '0');
    b.querySelector('.s-artist').textContent = t.artist;
    b.querySelector('.s-title').textContent = t.title;
    b.setAttribute('aria-label', t.title + ', ' + t.artist);
    b.addEventListener('click', function () { choose(i, true); });
    li.appendChild(b);
    shelf.appendChild(li);
    sleeves.push(b);
  });

  var vinylLabel = document.getElementById('vinyl-label');
  function setArt(url) {
    if (!vinylLabel) return;
    vinylLabel.style.backgroundImage = url ? 'url(' + url + ')' : '';
    vinylLabel.classList.toggle('has-art', !!url);
  }
  function setPlaying(isPlaying) {
    paused = !isPlaying;
    box.classList.toggle('playing', isPlaying);
    playBtn.setAttribute('aria-label', isPlaying ? 'Pausar' : 'Tocar');
    playBtn.classList.toggle('is-playing', isPlaying);
    if (current >= 0 && nowLabel) nowLabel.textContent = isPlaying ? 'tocando agora' : 'pausado';
  }
  function choose(i, play) {
    current = (i + TRACKS.length) % TRACKS.length;
    var t = TRACKS[current];
    sleeves.forEach(function (s, k) { s.setAttribute('aria-pressed', k === current ? 'true' : 'false'); });
    box.style.setProperty('--label', LABELS[current % LABELS.length]);
    setArt(t.cover);
    nowTitle.textContent = t.title;
    nowArtist.textContent = t.artist;
    if (bar) bar.style.width = '0%';
    var s = sleeves[current];
    if (s && s.scrollIntoView && play) s.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    if (controller) {
      controller.loadUri(t.uri);
      if (play) { controller.play(); setPlaying(true); }
    } else {
      pending = { uri: t.uri, play: play };
      if (play) setPlaying(true);
      if (usingFallback) fallback(t.uri); else loadApi();
    }
  }
  function toggle() {
    if (current < 0) { choose(0, true); return; }
    if (controller) { controller.togglePlay(); setPlaying(paused); }
    else setPlaying(paused);
  }
  playBtn.addEventListener('click', toggle);
  table.addEventListener('click', toggle);
  prevBtn.addEventListener('click', function () { choose(current - 1, true); });
  nextBtn.addEventListener('click', function () { choose(current + 1, true); });

  // Sem a API (bloqueada ou offline): player comum do Spotify com a faixa escolhida.
  var usingFallback = false;
  function fallback(uri) {
    if (controller) return;
    var id = (uri || PLAYLIST).split(':');
    var f = embedEl.tagName === 'IFRAME' ? embedEl : null;
    if (!f) {
      f = document.createElement('iframe');
      f.title = 'Player do Spotify';
      f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
      f.loading = 'lazy';
      embedEl.replaceWith(f);
      embedEl = f;
    }
    f.src = 'https://open.spotify.com/embed/' + id[1] + '/' + id[2] + '?utm_source=generator&theme=0';
    usingFallback = true;
  }

  // Carrega a API do Spotify quando a vitrola se aproxima da tela.
  var loaded = false;
  function loadApi() {
    if (loaded) return; loaded = true;
    window.onSpotifyIframeApiReady = function (IFrameAPI) {
      if (usingFallback) return;
      IFrameAPI.createController(embedEl, { uri: PLAYLIST, width: '100%', height: 152 }, function (c) {
        controller = c;
        c.addListener('playback_update', function (e) {
          var d = e && e.data; if (!d) return;
          setPlaying(!d.isPaused);
          if (bar && d.duration) bar.style.width = Math.min(100, d.position / d.duration * 100) + '%';
          if (d.playingURI) {
            var k = TRACKS.findIndex(function (t) { return t.uri === d.playingURI; });
            if (k >= 0 && k !== current) {
              current = k;
              sleeves.forEach(function (s, j) { s.setAttribute('aria-pressed', j === k ? 'true' : 'false'); });
              nowTitle.textContent = TRACKS[k].title; nowArtist.textContent = TRACKS[k].artist;
              box.style.setProperty('--label', LABELS[k % LABELS.length]);
              setArt(TRACKS[k].cover);
            }
          }
        });
        if (pending) { c.loadUri(pending.uri); if (pending.play) c.play(); pending = null; }
      });
    };
    var s = document.createElement('script');
    s.src = 'https://open.spotify.com/embed/iframe-api/v1';
    s.async = true;
    s.onerror = function () { fallback(null); };
    document.body.appendChild(s);
    setTimeout(function () { if (!controller) fallback(pending ? pending.uri : null); }, 8000);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (e) { if (e[0].isIntersecting) { loadApi(); io.disconnect(); } }, { rootMargin: '600px' });
    io.observe(box);
  } else loadApi();
})();

/* Fichário: abas laterais e botão "vire a página".
   A folha levanta, cruza a costura e assenta do outro lado (duas etapas). */
(function () {
  var binder = document.getElementById('fichario');
  if (!binder) return;
  var tabs = Array.prototype.slice.call(binder.querySelectorAll('[role="tab"]'));
  var spreads = Array.prototype.slice.call(binder.querySelectorAll('.spread'));
  var current = 0, busy = false;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HALF = 420;

  function setTabs(i) {
    tabs.forEach(function (t, k) {
      t.setAttribute('aria-selected', k === i ? 'true' : 'false');
      t.tabIndex = k === i ? 0 : -1;
    });
    spreads.forEach(function (s, k) {
      if (k === i) { s.removeAttribute('inert'); s.removeAttribute('aria-hidden'); }
      else { s.setAttribute('inert', ''); s.setAttribute('aria-hidden', 'true'); }
    });
  }
  function clean(el) { el.classList.remove('turn-out-next', 'turn-out-prev', 'turn-in-next', 'turn-in-prev', 'under', 'gone-next', 'gone-prev'); }
  function go(i, focusTab) {
    if (i === current || busy || i < 0 || i >= spreads.length) return;
    var from = spreads[current], to = spreads[i];
    var dir = i > current ? 'next' : 'prev';
    setTabs(i);
    if (focusTab) tabs[i].focus();
    current = i;
    if (reduce) { from.classList.remove('is-active'); to.classList.add('is-active'); return; }
    busy = true;
    // etapa 1: a nova página dupla fica embaixo; a folha da antiga levanta até ficar de pé
    to.classList.add('under');
    from.classList.add('turn-out-' + dir);
    setTimeout(function () {
      // etapa 2: a antiga sai; a folha da nova assenta do outro lado da costura
      // a página antiga fica por baixo (sem a folha que virou) até a nova assentar
      from.classList.remove('is-active', 'turn-out-' + dir); from.classList.add('under', 'gone-' + dir);
      to.classList.remove('under'); to.classList.add('is-active', 'turn-in-' + dir);
      setTimeout(function () { clean(from); clean(to); busy = false; }, HALF + 40);
    }, HALF);
    var top = binder.getBoundingClientRect().top;
    if (top < 0) binder.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  tabs.forEach(function (t, k) {
    t.addEventListener('click', function () { go(k); });
    t.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go((current + 1) % tabs.length, true); }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); go((current - 1 + tabs.length) % tabs.length, true); }
    });
  });
  Array.prototype.forEach.call(binder.querySelectorAll('.turn'), function (b) {
    b.addEventListener('click', function () { go(parseInt(b.getAttribute('data-go'), 10) - 1); });
  });
  // no celular: deslizar o dedo para os lados vira a página
  var sx = 0, sy = 0, tracking = false;
  var area = binder.querySelector('.spreads');
  area.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) return;
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; tracking = true;
  }, { passive: true });
  area.addEventListener('touchend', function (e) {
    if (!tracking) return; tracking = false;
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4) go(current + (dx < 0 ? 1 : -1));
  }, { passive: true });
  setTabs(0);
})();

/* Aparecer suave ao rolar (o conteúdo continua visível sem JavaScript). */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll('.about-art, .about-copy, .ai-copy, .ledger, .work, .pressed, .cat, .soundtrack, .file-card, .hobby');
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  Array.prototype.forEach.call(els, function (el) {
    var r = el.getBoundingClientRect();
    if (r.top > window.innerHeight) { el.classList.add('reveal'); io.observe(el); }
  });
})();

/* Cursor de borboleta: segue o mouse batendo as asas e vira na direção do voo.
   Deixa um rastro de pontinhos bem sutis. Sobre um botão, pousa na borda dele;
   ao clicar, solta um pólen brilhante. Só em computador (mouse). */
(function () {
  if (!window.matchMedia || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var HEAD = -90; // a cabeça da borboleta aponta para cima na imagem
  var LAND_ON = 'a, button, [role="tab"], .nav-contact';
  var fly = new Image();
  fly.className = 'bee-cursor';
  fly.alt = '';
  fly.setAttribute('aria-hidden', 'true');
  fly.onload = function () {
    var cv = document.createElement('canvas');
    cv.className = 'cursor-trail';
    cv.setAttribute('aria-hidden', 'true');
    var ctx = cv.getContext('2d');
    document.body.appendChild(cv);
    document.body.appendChild(fly);
    document.documentElement.classList.add('has-bee');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    function size() { cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    size(); window.addEventListener('resize', size);

    var mx = -100, my = -100, x = -100, y = -100, ang = 0, raf = 0, hidden = false;
    var perch = null;            // botão onde a borboleta pousou
    var pts = [], LIFE = 900, GAP = 7;
    var pollen = [];

    function tick(t) {
      var tx = mx, ty = my, landed = false;
      if (perch && document.contains(perch)) {
        var r = perch.getBoundingClientRect();
        tx = r.left + Math.min(r.width - 14, Math.max(14, r.width * 0.78));
        ty = r.top - 8; // em cima da borda superior
        landed = true;
      }
      var dx = tx - x, dy = ty - y;
      var ease = landed ? 0.16 : 0.2;
      x += dx * ease; y += dy * ease;
      var dist = Math.abs(dx) + Math.abs(dy);
      var moving = dist > 2;
      var targetAng = ang;
      if (landed && dist < 18) targetAng = 0; // pousada: cabeça para cima
      else if (moving) targetAng = Math.atan2(dy, dx) * 180 / Math.PI - HEAD;
      ang += (((targetAng - ang + 540) % 360) - 180) * (landed ? 0.18 : 0.1);
      // pousada: asas abrem e fecham devagar; voando: batem rápido
      var flap = landed && dist < 18
        ? 0.55 + 0.45 * Math.abs(Math.sin(t / 420))
        : 0.62 + 0.38 * Math.abs(Math.sin(t / (moving ? 70 : 160)));
      var bob = landed ? 0 : Math.sin(t / 220) * 3;
      fly.style.transform = 'translate(' + (x - 21) + 'px,' + (y - 15 + bob) + 'px) rotate(' + ang.toFixed(1) + 'deg) scaleX(' + flap.toFixed(3) + ')';

      // rastro: pontinhos bem pequenos e sutis
      var last = pts[pts.length - 1];
      if (!hidden && moving && (!last || Math.hypot(x - last.x, y - last.y) > GAP)) pts.push({ x: x, y: y + bob, t: t });
      while (pts.length && t - pts[0].t > LIFE) pts.shift();
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.fillStyle = '#1c1310';
      for (var i = 0; i < pts.length; i++) {
        var a = 1 - (t - pts[i].t) / LIFE;
        ctx.globalAlpha = a * 0.28;
        ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 0.85, 0, 6.2832); ctx.fill();
      }
      // pólen brilhante
      for (var k = pollen.length - 1; k >= 0; k--) {
        var p = pollen[k], age = (t - p.t0) / p.life;
        if (age >= 1) { pollen.splice(k, 1); continue; }
        p.vx *= 0.97; p.vy = p.vy * 0.97 + 0.025;
        p.x += p.vx; p.y += p.vy;
        var al = (1 - age) * (age < 0.15 ? age / 0.15 : 1);
        ctx.globalAlpha = al * 0.85;
        ctx.shadowColor = '#f6e2a8'; ctx.shadowBlur = 6;
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (1 - age * 0.4), 0, 6.2832); ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
      raf = (pts.length || pollen.length || moving || landed) ? requestAnimationFrame(tick) : 0;
    }
    function kick() { if (!raf) raf = requestAnimationFrame(tick); }

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY; hidden = false; fly.classList.add('on');
      var b = e.target.closest ? e.target.closest(LAND_ON) : null;
      perch = b;
      fly.classList.toggle('landed', !!b);
      kick();
    });
    document.addEventListener('mouseover', function (e) { if (e.target.tagName === 'IFRAME') { hidden = true; perch = null; fly.classList.remove('on'); } });
    document.documentElement.addEventListener('mouseleave', function () { hidden = true; perch = null; fly.classList.remove('on'); });
    // ao clicar: um pouquinho de pólen brilhante
    document.addEventListener('mousedown', function () {
      var now = performance.now();
      var cx = x, cy = y;
      for (var i = 0; i < 12; i++) {
        var aa = Math.random() * Math.PI * 2, sp = 0.4 + Math.random() * 1.3;
        pollen.push({ x: cx, y: cy, vx: Math.cos(aa) * sp, vy: Math.sin(aa) * sp - 0.6, r: 0.8 + Math.random() * 1.1,
          c: Math.random() < 0.6 ? '#f3d98f' : '#fff7e0', t0: now, life: 650 + Math.random() * 450 });
      }
      kick();
    });
  };
  fly.src = 'assets/objetos/borboleta-cursor.webp';
})();

/* Animação nos textos — "Text Type" (máquina de escrever, inspirado no React Bits):
   os títulos se datilografam letra por letra, com cursor piscando, quando aparecem na tela.
   Mais: "lo faz · ..." em loop, e as assinaturas desenhadas à mão. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  var START = (!root.classList.contains('sem-abertura') && document.querySelector('.loader')) ? 3400 : 250;
  function onView(els, cls, margin) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add(cls); io.unobserve(e.target); } });
    }, { rootMargin: margin || '0px 0px -6% 0px' });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  }
  // separa o texto em letras (mantendo palavras inteiras na quebra de linha), sem mexer em botões e links
  function split(el) {
    Array.prototype.slice.call(el.childNodes).forEach(function (node) {
      if (node.nodeType === 3) {
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { var sp = document.createElement('span'); sp.className = 'char space'; sp.textContent = p; frag.appendChild(sp); return; }
          var w = document.createElement('span'); w.className = 'word';
          Array.from(p).forEach(function (ch) {
            var c = document.createElement('span'); c.className = 'char'; c.textContent = ch; w.appendChild(c);
          });
          frag.appendChild(w);
        });
        node.replaceWith(frag);
      } else if (node.nodeType === 1 && node.tagName !== 'BR') split(node);
    });
  }

  // Text Type nos títulos: as letras já ocupam o lugar (sem pular o layout) e aparecem uma a uma
  if (!reduce) {
    // frase inicial: palavras sobem rapidinho
    var heroH = document.querySelector('.hero h1');
    if (heroH) {
      var wi = 0;
      (function wrap(el) {
        Array.prototype.slice.call(el.childNodes).forEach(function (node) {
          if (node.nodeType === 3) {
            var frag = document.createDocumentFragment();
            node.textContent.split(/(\s+)/).forEach(function (p) {
              if (!p) return;
              if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); return; }
              var w = document.createElement('span'); w.className = 'rise'; w.style.setProperty('--w', wi++); w.textContent = p;
              frag.appendChild(w);
            });
            node.replaceWith(frag);
          } else if (node.nodeType === 1) {
            if (node.classList.contains('w')) { node.classList.add('rise'); node.style.setProperty('--w', wi++); }
            else wrap(node);
          }
        });
      })(heroH);
      heroH.classList.add('rise-words');
      setTimeout(function () { heroH.classList.add('rise-in'); }, START - 150);
    }
    var heads = Array.prototype.slice.call(document.querySelectorAll('.me-hero h1, main h2, .soundtrack-copy h3'));
    heads.forEach(function (h) { split(h); h.classList.add('type-text'); });
    function typeHead(h, speed) {
      var chars = h.querySelectorAll('.char');
      var caret = document.createElement('span');
      caret.className = 'type-caret'; caret.setAttribute('aria-hidden', 'true');
      var i = 0;
      h.classList.add('typing');
      (function step() {
        if (i < chars.length) {
          var c = chars[i++];
          c.classList.add('on');
          c.after(caret);
          var pause = /[.,;:!?]/.test(c.textContent) ? speed * 6 : c.classList.contains('space') ? speed * 0.6 : speed;
          setTimeout(step, pause + Math.random() * speed * 0.5);
        } else {
          h.classList.remove('typing');
          setTimeout(function () { caret.classList.add('done'); }, 1600);
          setTimeout(function () { caret.remove(); }, 2400);
        }
      })();
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var big = e.target.matches('.hero h1, .me-hero h1');
        var delay = e.target.matches('.hero h1') ? START - 100 : 120;
        setTimeout(function () { typeHead(e.target, big ? 42 : 34); }, delay);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    heads.forEach(function (h) { io.observe(h); });
  }

  // Text Type: "lo faz · design / publicidade / ..."
  Array.prototype.forEach.call(document.querySelectorAll('.typer'), function (el) {
    var words = (el.getAttribute('data-words') || el.textContent).split('|');
    if (reduce || words.length < 2) return;
    var k = 0;
    function next() {
      setTimeout(function () {
        eraseText(el, 32, function () {
          k = (k + 1) % words.length;
          setTimeout(function () { typeText(el, words[k], 75, next); }, 260);
        });
      }, 1900);
    }
    el.textContent = '';
    setTimeout(function () { typeText(el, words[0], 75, next); }, START + 500);
  });

  // Escrita à mão: o texto vira um desenho em SVG, traçado letra por letra
  var hands = document.querySelectorAll('.handwrite');
  if (!hands.length || reduce || !document.fonts) return;
  var NS = 'http://www.w3.org/2000/svg';
  document.fonts.ready.then(function () {
    Array.prototype.forEach.call(hands, function (el) {
      var txt = el.textContent.trim();
      var cs = getComputedStyle(el);
      var fs = parseFloat(cs.fontSize);
      var svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('class', 'hw-svg');
      svg.setAttribute('role', 'img');
      svg.setAttribute('aria-label', txt);
      var t = document.createElementNS(NS, 'text');
      t.setAttribute('x', '0'); t.setAttribute('y', String(fs));
      t.setAttribute('stroke-width', Math.max(0.6, fs / 42).toFixed(2));
      t.style.font = cs.fontStyle + ' ' + cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      t.style.setProperty('--dash', Math.round(fs * 9));
      Array.from(txt).forEach(function (ch, i) {
        var s = document.createElementNS(NS, 'tspan');
        s.textContent = ch;
        s.style.setProperty('--i', i);
        t.appendChild(s);
      });
      svg.appendChild(t);
      el.textContent = '';
      el.appendChild(svg);
      var bb = t.getBBox();
      var pad = fs * 0.15;
      svg.setAttribute('viewBox', [bb.x - pad, bb.y - pad, bb.width + pad * 2, bb.height + pad * 2].map(function (v) { return v.toFixed(1); }).join(' '));
      var w = bb.width + pad * 2, hgt = bb.height + pad * 2;
      var maxW = Math.max(120, el.parentElement.getBoundingClientRect().width || w);
      var k = Math.min(1, maxW / w);
      svg.style.width = (w * k).toFixed(1) + 'px';
      svg.style.height = (hgt * k).toFixed(1) + 'px';
    });
    var hero = Array.prototype.filter.call(hands, function (el) { return el.closest('.hero'); });
    var rest = Array.prototype.filter.call(hands, function (el) { return !el.closest('.hero'); });
    setTimeout(function () { hero.forEach(function (el) { el.classList.add('hw-on'); }); }, START + 900);
    onView(rest, 'hw-on', '0px 0px -10% 0px');
  });
})();

/* Celular: o marcador "conheça a Lo" se recolhe (só a pontinha aparece) depois do topo da página. */
(function () {
  var bm = document.querySelector('.bookmark');
  if (!bm || !window.matchMedia) return;
  var mq = matchMedia('(max-width: 650px)');
  var ticking = false;
  function update() {
    ticking = false;
    bm.classList.toggle('peek', mq.matches && window.scrollY > 300);
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
})();
