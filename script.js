document.getElementById('year').textContent = new Date().getFullYear();
document.documentElement.classList.add('js');

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

/* Aparecer suave ao rolar (o conteúdo continua visível sem JavaScript). */
(function () {
  if (!('IntersectionObserver' in window)) return;
  var els = document.querySelectorAll('.about-art, .about-copy, .page, .work, .pressed, .cat, .soundtrack');
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

/* Trilha sonora: quando houver link de playlist em data-playlist, mostra o player do Spotify. */
(function () {
  var box = document.querySelector('.spotify');
  if (!box) return;
  var url = box.getAttribute('data-playlist') || '';
  var m = url.match(/open\.spotify\.com\/(playlist|album)\/([A-Za-z0-9]+)/);
  if (!m) return;
  var f = document.createElement('iframe');
  f.src = 'https://open.spotify.com/embed/' + m[1] + '/' + m[2] + '?utm_source=generator&theme=0';
  f.title = 'Trilha sonora, playlist no Spotify';
  f.loading = 'lazy';
  f.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
  box.innerHTML = '';
  box.appendChild(f);
})();
