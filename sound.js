/* Efeitos sonoros do site, sintetizados na hora (Web Audio), sem arquivos de áudio.
   loSound.play('flip' | 'page' | 'ribbon' | 'sparkle')
   O navegador só libera som depois do primeiro clique/toque da pessoa.
   Há um botão para ligar/desligar (a escolha fica salva neste navegador). */
(function () {
  var AC = window.AudioContext || window.webkitAudioContext;
  var api = { play: function () {} };
  window.loSound = api;
  if (!AC) return;

  var on = true;
  try { on = localStorage.getItem('lo-som') !== 'off'; } catch (e) {}
  var ctx = null, master = null, noise = null, last = {};

  function init() {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.45;
    master.connect(ctx.destination);
    var len = ctx.sampleRate;
    noise = ctx.createBuffer(1, len, ctx.sampleRate);
    var d = noise.getChannelData(0);
    for (var i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  }
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, init, { passive: true, capture: true });
  });

  function env(g, t, a, peak, dur) {
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  }
  // sopro de papel: ruído filtrado com varredura
  function rustle(t, f0, f1, dur, peak, q) {
    var src = ctx.createBufferSource(); src.buffer = noise;
    src.playbackRate.value = 0.8 + Math.random() * 0.4;
    var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = q || 0.9;
    bp.frequency.setValueAtTime(f0, t); bp.frequency.exponentialRampToValueAtTime(f1, t + dur);
    var g = ctx.createGain(); env(g, t, 0.012, peak, dur);
    src.connect(bp); bp.connect(g); g.connect(master);
    src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.05);
  }
  function tone(t, freq, dur, peak, type) {
    var o = ctx.createOscillator(); o.type = type || 'sine';
    o.frequency.setValueAtTime(freq, t);
    var g = ctx.createGain(); env(g, t, 0.006, peak, dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.05);
  }

  var SOUNDS = {
    flip: function (t) {           // card virando: papel rápido + toque leve
      rustle(t, 2600, 700, 0.2, 0.5, 0.8);
      tone(t + 0.16, 150, 0.09, 0.12);
    },
    page: function (t) {           // página do fichário: folha mais longa
      rustle(t, 1400, 3200, 0.16, 0.22, 0.7);
      rustle(t + 0.14, 2600, 520, 0.42, 0.42, 0.8);
      tone(t + 0.5, 110, 0.12, 0.1);
    },
    ribbon: function (t) {         // marcador: fitinha + plim bem suave
      rustle(t, 4200, 2600, 0.12, 0.1, 1.4);
      tone(t + 0.02, 1318.5, 0.32, 0.035, 'triangle');
    },
    sparkle: function (t) {        // pólen: brilhinhos agudos
      var notes = [2093, 2349.3, 2637, 3136, 3520, 4186];
      for (var i = 0; i < 5; i++) {
        var f = notes[Math.floor(Math.random() * notes.length)] * (1 + (Math.random() - 0.5) * 0.01);
        tone(t + i * 0.035 + Math.random() * 0.02, f, 0.28 + Math.random() * 0.2, 0.035, 'sine');
      }
    }
  };
  var GAP = { flip: 120, page: 300, ribbon: 220, sparkle: 70 };

  api.play = function (name) {
    if (!on || !ctx || ctx.state !== 'running' || !SOUNDS[name]) return;
    var now = performance.now();
    if (last[name] && now - last[name] < GAP[name]) return;
    last[name] = now;
    SOUNDS[name](ctx.currentTime + 0.005);
  };

  // botão de som (canto inferior esquerdo)
  function addToggle() {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'sound-toggle';
    function paint() {
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.setAttribute('aria-label', on ? 'Desligar os sons do site' : 'Ligar os sons do site');
      b.innerHTML = '<span aria-hidden="true">' + (on ? '♪' : '♪̸') + '</span><span class="st-label">' + (on ? 'som ligado' : 'som desligado') + '</span>';
    }
    b.addEventListener('click', function () {
      on = !on;
      try { localStorage.setItem('lo-som', on ? 'on' : 'off'); } catch (e) {}
      paint();
      if (on) { init(); setTimeout(function () { api.play('ribbon'); }, 30); }
    });
    paint();
    document.body.appendChild(b);
  }
  if (document.body) addToggle(); else document.addEventListener('DOMContentLoaded', addToggle);
})();
