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
  var els = document.querySelectorAll('.about-art, .about-copy, .page, .ai-copy, .ledger, .work, .pressed, .cat, .soundtrack, .file-card, .hobby');
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
