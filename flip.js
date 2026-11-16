/* Cards que viram: clique (ou Enter/Espaço) vira o card com efeito de mola.
   Inspirado no componente FlipCard (eixo Y, inclinação até 12°, brilho 0,22,
   zoom 1,03, perspectiva 1100, mola rigidez 170 / amortecimento 20).
   Sem JavaScript, frente e verso aparecem um embaixo do outro. */
(function () {
  var cards = document.querySelectorAll('.flip');
  if (!cards.length) return;
  var OPT = { tiltMax: 12, glare: 0.22, hoverScale: 1.03, perspective: 1100, stiffness: 170, damping: 20 };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;

  Array.prototype.forEach.call(cards, function (el) {
    var inner = el.querySelector('.flip-inner');
    var glare = el.querySelector('.flip-glare');
    var back = el.querySelector('.flip-back');
    var angle = 0, vel = 0, target = 0;
    var tx = 0, ty = 0, ttx = 0, tty = 0, s = 1, ts = 1;
    var raf = 0, last = 0;
    if (back) back.setAttribute('aria-hidden', 'true');
    setLinks(false);

    function setLinks(on) {
      Array.prototype.forEach.call(el.querySelectorAll('.flip-back a'), function (a) { a.tabIndex = on ? 0 : -1; });
    }
    function render() {
      inner.style.transform = 'perspective(' + OPT.perspective + 'px) rotateX(' + tx.toFixed(2) + 'deg) rotateY(' + (angle + ty).toFixed(2) + 'deg) scale(' + s.toFixed(4) + ')';
    }
    function frame(t) {
      var dt = last ? Math.min((t - last) / 1000, 0.032) : 0.016;
      last = t;
      var acc = -OPT.stiffness * (angle - target) - OPT.damping * vel;
      vel += acc * dt; angle += vel * dt;
      tx += (ttx - tx) * 0.16; ty += (tty - ty) * 0.16; s += (ts - s) * 0.16;
      render();
      var settled = Math.abs(angle - target) < 0.05 && Math.abs(vel) < 0.05 &&
        Math.abs(tx - ttx) < 0.02 && Math.abs(ty - tty) < 0.02 && Math.abs(s - ts) < 0.0005;
      if (settled) { angle = target; vel = 0; tx = ttx; ty = tty; s = ts; render(); raf = 0; last = 0; return; }
      raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }

    function toggle() {
      var flipped = target === 0;
      target = flipped ? 180 : 0;
      el.setAttribute('aria-pressed', flipped ? 'true' : 'false');
      el.classList.toggle('is-flipped', flipped);
      if (back) back.setAttribute('aria-hidden', flipped ? 'false' : 'true');
      setLinks(flipped);
      if (window.loSound) loSound.play('flip');
      if (reduce) { angle = target; render(); return; }
      kick();
    }

    el.addEventListener('click', function (e) {
      if (e.target.closest('a')) return; // o link do verso abre normalmente
      toggle();
    });
    el.addEventListener('keydown', function (e) {
      if (e.target !== el) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });

    if (finePointer && !reduce) {
      el.addEventListener('pointerenter', function () { ts = OPT.hoverScale; if (glare) glare.style.opacity = OPT.glare; kick(); });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        tty = px * OPT.tiltMax * 2;
        ttx = -py * OPT.tiltMax * 2;
        if (glare) { glare.style.setProperty('--gx', (px + 0.5) * 100 + '%'); glare.style.setProperty('--gy', (py + 0.5) * 100 + '%'); }
        kick();
      });
      el.addEventListener('pointerleave', function () { ttx = 0; tty = 0; ts = 1; if (glare) glare.style.opacity = 0; kick(); });
    }
  });
})();
