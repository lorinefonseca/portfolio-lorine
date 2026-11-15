var yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
document.documentElement.classList.add('js');

/* =========================================================
   TRILHA SONORA
   Para colocar as músicas, preencha a lista abaixo.
   - title / artist: o que aparece na vitrola
   - spotify: link da faixa no Spotify (Compartilhar > Copiar link da música)
   Se quiser mostrar a playlist inteira também, cole o link em PLAYLIST.
   ========================================================= */
var PLAYLIST = '';
var TRACKS = [
  // { title: 'Nome da música', artist: 'Artista', spotify: 'https://open.spotify.com/track/...' },
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

/* Vitrola: lista de faixas; ao escolher uma, o disco gira e o player do Spotify carrega a faixa. */
(function () {
  var box = document.getElementById('trilha');
  var list = document.getElementById('tracks');
  var player = document.getElementById('spotify');
  var label = document.getElementById('now-label');
  if (!box || !list || !player) return;

  function embedUrl(url) {
    var m = (url || '').match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|playlist|album)\/([A-Za-z0-9]+)/);
    return m ? 'https://open.spotify.com/embed/' + m[1] + '/' + m[2] + '?utm_source=generator&theme=0' : '';
  }
  function load(url, big) {
    var src = embedUrl(url);
    if (!src) return;
    player.innerHTML = '';
    player.classList.toggle('big', !!big);
    var f = document.createElement('iframe');
    f.src = src;
    f.title = 'Player do Spotify';
    f.loading = 'lazy';
    f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
    player.appendChild(f);
  }

  if (!TRACKS.length) {
    // ainda sem faixas: mostra o lado A "em gravação"
    ['lado A em gravação', 'as faixas chegam em breve', 'enquanto isso, a agulha espera'].forEach(function (t) {
      var li = document.createElement('li');
      li.innerHTML = '<span class="soon"><span class="t-title"></span><span></span></span>';
      li.querySelector('.t-title').textContent = t;
      list.appendChild(li);
    });
    if (PLAYLIST) load(PLAYLIST, true);
    return;
  }

  var buttons = [];
  TRACKS.forEach(function (t, idx) {
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-pressed', 'false');
    b.innerHTML = '<span class="t-title"></span><span class="t-artist"></span>';
    b.querySelector('.t-title').textContent = t.title;
    b.querySelector('.t-artist').textContent = t.artist || '';
    b.addEventListener('click', function () {
      var already = b.getAttribute('aria-pressed') === 'true';
      buttons.forEach(function (o) { o.setAttribute('aria-pressed', 'false'); });
      if (already) {
        box.classList.remove('playing');
        if (label) label.textContent = 'trilha sonora';
        return;
      }
      b.setAttribute('aria-pressed', 'true');
      box.classList.add('playing');
      if (label) label.textContent = 'tocando agora · ' + t.title;
      if (t.spotify) load(t.spotify, false);
    });
    buttons.push(b);
    li.appendChild(b);
    list.appendChild(li);
  });
  if (PLAYLIST) load(PLAYLIST, true);
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

/* Fichário: abas laterais e botão "vire a página" com animação de folha virando. */
(function () {
  var binder = document.getElementById('fichario');
  if (!binder) return;
  var tabs = Array.prototype.slice.call(binder.querySelectorAll('[role="tab"]'));
  var spreads = Array.prototype.slice.call(binder.querySelectorAll('.spread'));
  var current = 0, busy = false;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  function go(i, focusTab) {
    if (i === current || busy || i < 0 || i >= spreads.length) return;
    var from = spreads[current], to = spreads[i];
    var dir = i > current ? 'to-next' : 'to-prev';
    setTabs(i);
    if (focusTab) tabs[i].focus();
    if (reduce) {
      from.classList.remove('is-active'); to.classList.add('is-active');
      current = i; return;
    }
    busy = true;
    from.classList.remove('is-active');
    from.classList.add('is-leaving', dir);
    to.classList.add('is-active', 'is-entering');
    setTimeout(function () {
      from.classList.remove('is-leaving', 'to-next', 'to-prev');
      to.classList.remove('is-entering');
      busy = false;
    }, 950);
    current = i;
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

/* Cursor de abelha: segue o mouse voando, vira na direção do movimento.
   Só em computador (mouse) e só se a imagem assets/objetos/abelha.webp existir. */
(function () {
  if (!window.matchMedia || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
      if (Math.abs(dx) + Math.abs(dy) > 2) ang += ((Math.atan2(dy, dx) * 180 / Math.PI + 90) - ang) * 0.12;
      var hover = Math.sin(t / 140) * 2;
      bee.style.transform = 'translate(' + (x - 22) + 'px,' + (y - 22 + hover) + 'px) rotate(' + ang + 'deg)';
      raf = requestAnimationFrame(tick);
    }
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY; bee.classList.add('on');
      bee.classList.toggle('big', !!e.target.closest('a, button, [role="tab"]'));
      if (!raf) raf = requestAnimationFrame(tick);
    });
    document.addEventListener('mouseleave', function () { bee.classList.remove('on'); });
  };
  bee.src = 'assets/objetos/abelha.webp';
})();
