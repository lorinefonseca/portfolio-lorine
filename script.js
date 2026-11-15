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
  { title: 'Dreams', artist: 'Fleetwood Mac', uri: 'spotify:track:0ofHAoxe9vBkTCp2UQIavz' },
  { title: 'Take A Chance On Me', artist: 'ABBA', uri: 'spotify:track:5BckPAYcKEJuYs1eV1BHHe' },
  { title: 'Mockingbird', artist: 'Larkin Poe', uri: 'spotify:track:6ww6Jhl1ciBSMARpaQkDp4' },
  { title: 'Bloom Again', artist: 'Larkin Poe', uri: 'spotify:track:0gB4RgvX1XOV5LEgRWliGo' },
  { title: 'Procession', artist: 'Nightwish', uri: 'spotify:track:7aIxfEHjebCNbs6bpKv9Go' },
  { title: "How's the Heart?", artist: 'Nightwish', uri: 'spotify:track:6lkVbijlh932FSS2I0gDrR' },
  { title: 'Rivers', artist: 'Epica', uri: 'spotify:track:6SO03S6E3WsdfUsrdz447z' },
  { title: 'Send Me On My Way', artist: 'Rusted Root', uri: 'spotify:track:6XK6Zw6JkFsHXzAcMWNiIr' },
  { title: 'Walk Of Life', artist: 'Dire Straits', uri: 'spotify:track:5Hk4Mpex0s2ndUpDQ5v2rU' },
  { title: 'I Shot The Sheriff', artist: 'Eric Clapton', uri: 'spotify:track:0UOxp1BpnD8uPQMKU4wKjz' },
  { title: 'Lady Writer', artist: 'Dire Straits', uri: 'spotify:track:2RBcYkonAofm0rYycVrCGt' },
  { title: 'Sisters of the Moon', artist: 'Fleetwood Mac', uri: 'spotify:track:7Gjj6NxSsVwXfOXUjvjCXv' },
  { title: 'Tusk (ao vivo)', artist: 'Fleetwood Mac', uri: 'spotify:track:66iVi7pfwvuaZgraZEbgpP' },
  { title: 'Somewhere Only We Know', artist: 'Keane', uri: 'spotify:track:1SKPmfSYaPsETbRHaiA18G' },
  { title: "Everybody's Changing", artist: 'Keane', uri: 'spotify:track:0yac0FPhLRH9i9lOng3f81' }
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

/* Notas soltas: cada toque vira a página para outra frase. */
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
    text.classList.add('out');
    setTimeout(function () {
      text.textContent = phrases[i];
      text.classList.remove('out');
    }, 250);
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
    b.innerHTML = '<span class="disc" aria-hidden="true"></span><span class="cover"><span class="s-n"></span><span class="s-artist"></span><span class="s-title"></span></span>';
    b.querySelector('.s-n').textContent = 'lado A · ' + String(i + 1).padStart(2, '0');
    b.querySelector('.s-artist').textContent = t.artist;
    b.querySelector('.s-title').textContent = t.title;
    b.setAttribute('aria-label', t.title + ', ' + t.artist);
    b.addEventListener('click', function () { choose(i, true); });
    li.appendChild(b);
    shelf.appendChild(li);
    sleeves.push(b);
  });

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

/* Cursor de abelha: segue o mouse voando e vira a cabeça na direção do movimento.
   Só em computador (mouse). */
(function () {
  if (!window.matchMedia || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var HEAD = -128; // direção da cabeça na imagem (graus)
  var bee = new Image();
  bee.className = 'bee-cursor';
  bee.alt = '';
  bee.setAttribute('aria-hidden', 'true');
  bee.onload = function () {
    document.body.appendChild(bee);
    document.documentElement.classList.add('has-bee');
    var mx = -100, my = -100, x = -100, y = -100, ang = 0, raf = 0;
    function tick(t) {
      var dx = mx - x, dy = my - y;
      x += dx * 0.22; y += dy * 0.22;
      if (Math.abs(dx) + Math.abs(dy) > 3) {
        var target = Math.atan2(dy, dx) * 180 / Math.PI - HEAD;
        var diff = ((target - ang + 540) % 360) - 180; // menor caminho
        ang += diff * 0.12;
      }
      var hover = Math.sin(t / 140) * 2;
      bee.style.transform = 'translate(' + (x - 22) + 'px,' + (y - 18 + hover) + 'px) rotate(' + ang + 'deg)';
      raf = requestAnimationFrame(tick);
    }
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY; bee.classList.add('on');
      bee.classList.toggle('big', !!(e.target.closest && e.target.closest('a, button, [role="tab"]')));
      if (!raf) raf = requestAnimationFrame(tick);
    });
    document.documentElement.addEventListener('mouseleave', function () { bee.classList.remove('on'); });
  };
  bee.src = 'assets/objetos/abelha.webp';
})();
