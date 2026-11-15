/* Chuva no vidro — fundo da seção do caderno (#metodo).
   Shader "Rain" por ittybitty (https://ittybitty.dev), licença MIT. Adaptado para este site:
   usa a imagem da seção, roda só quando a seção está visível e respeita "movimento reduzido".
   Sem WebGL2, o fundo em CSS continua. */
(function () {
  var CONFIG = {
    image: 'assets/fotos/bokeh.webp',
    speed: 0.6, amount: 0.3, size: 0.6, fog: 0.7, refraction: 0.8,
    liquid: '#cfe6f2', opacity: 0.6 * 0.25 // água: o shader original usa 25% da opacidade
  };

  var section = document.getElementById('metodo');
  if (!section) return;
  var canvas = document.createElement('canvas');
  canvas.className = 'rain';
  canvas.setAttribute('aria-hidden', 'true');
  var gl = canvas.getContext('webgl2', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  if (!gl) return;

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var VERT = '#version 300 es\nvoid main(){ vec2 p = vec2(gl_VertexID & 1, gl_VertexID >> 1) * 4.0 - 1.0; gl_Position = vec4(p, 0.0, 1.0); }';
  var FRAG = `#version 300 es
precision highp float;
uniform vec2 uResolution;
uniform float uShowDrops;
uniform float uShowFog;
uniform float uPixelRatio;
uniform float uTime;
uniform sampler2D uImage;
uniform vec2 uImageSize;
uniform float uImageReady;
uniform float uAmount;
uniform float uSize;
uniform float uFog;
uniform float uRefraction;
uniform vec3 uLiquid;
uniform float uOpacity;
out vec4 fragColor;

float hash12(vec2 p) {
  vec3 q = fract(p.xyx * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}
vec3 hash32(vec2 p) {
  vec3 q = fract(p.xyx * vec3(0.1031, 0.1030, 0.0973));
  q += dot(q, q.yxz + 33.33);
  return fract((q.xxy + q.yzz) * q.zyx);
}
vec4 source(vec2 px, float blur) {
  vec2 uv = px / uResolution;
  float ca = uResolution.x / uResolution.y;
  float ia = uImageSize.x / max(uImageSize.y, 1.0);
  vec2 s = ca > ia ? vec2(1.0, ia / ca) : vec2(ca / ia, 1.0);
  return vec4(texture(uImage, clamp((uv - 0.5) * s + 0.5, 0.0, 1.0), blur).rgb, 1.0);
}
vec4 glass(vec2 p, float t) {
  vec4 w = vec4(0.0);
  for (int s = 0; s < 2; s++) {
    float scale = s == 0 ? 3.0 : 7.3;
    vec2 q = p * scale + float(s) * vec2(0.37, 0.71);
    vec2 cell = floor(q);
    vec2 f = fract(q);
    vec3 h = hash32(cell + float(s) * 19.0);
    if (h.z < uAmount * (s == 0 ? 0.75 : 0.6)) {
      float life = fract(t * 0.04 + h.x * 7.0);
      float r = (0.1 + 0.3 * h.y * h.y) * smoothstep(0.0, 0.02, life);
      vec2 d = f - (0.3 + 0.4 * h.xy);
      float k = length(d) / max(r, 1e-3);
      float bead = smoothstep(1.0, 0.85, k);
      w.xy += d / max(r, 1e-3) * bead;
      w.z = max(w.z, bead);
    }
  }
  float lane = floor(p.x);
  vec3 l = hash32(vec2(lane, 17.0));
  if (l.x < uAmount * 1.1) {
    float cycle = t * (0.18 + 0.3 * l.y) + l.z * 11.0;
    float n = floor(cycle);
    float fall = fract(cycle);
    float steps = 5.0 + floor(l.x * 4.0);
    float stair = (floor(fall * steps) + smoothstep(0.35, 1.0, fract(fall * steps))) / steps;
    fall = mix(fall, stair, 0.8);
    float top = uResolution.y / uPixelRatio / (110.0 * max(uSize, 0.3));
    float drop_y = top * (1.15 - fall * 1.3);
    float cx = lane + 0.5 + (hash12(vec2(lane, n)) - 0.5) * 0.3;
    float wob = 0.07 * sin(p.y * 1.9 + l.y * 20.0) + 0.025 * sin(p.y * 4.7 + l.x * 9.0);
    vec2 d = p - vec2(cx + wob, drop_y);
    d.y *= d.y > 0.0 ? 0.55 : 1.05;
    float r = 0.16 + 0.08 * l.y;
    float head = smoothstep(r, r * 0.75, length(d));
    float above = step(drop_y, p.y) * smoothstep(drop_y + top * 0.9, drop_y, p.y);
    float streak = smoothstep(0.065, 0.015, abs(p.x - cx - wob)) * above * 0.85;
    float left = smoothstep(0.35, 0.2, length(vec2(p.x - cx - wob, fract(p.y * 4.0 + l.x) - 0.5) * vec2(4.0, 1.0))) * streak * step(0.55, hash12(vec2(lane, floor(p.y * 4.0 + l.x))));
    w.xy = mix(w.xy, d / r * head, max(head, streak * 0.8));
    w.xy += vec2(p.x - cx - wob, 0.0) * streak * 1.5;
    w.z = max(max(w.z * (1.0 - streak), head), left);
    w.w = streak * (1.0 - head);
  }
  return w;
}
vec3 linearToSrgb(vec3 c) {
  c = max(c, 0.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
}
void main() {
  vec2 px = gl_FragCoord.xy;
  vec2 p = px / uPixelRatio / (110.0 * max(uSize, 0.3));
  vec4 w = glass(p, uTime) * uShowDrops;
  float cover = w.z;
  vec2 bend = -w.xy * uRefraction * 28.0 * uPixelRatio * max(uSize, 0.3);
  float fog = uFog * uShowFog * (1.0 - max(cover, w.w));
  vec3 behind = srgbToLinear(source(px + bend * cover, mix(4.5 * uFog, 0.0, max(cover, w.w))).rgb);
  vec3 scene = mix(behind, behind * 0.7 + 0.08, fog * 0.6);
  vec3 filterColour = min(uLiquid * 1.5, vec3(1.0));
  vec3 through = mix(behind, behind * filterColour + uLiquid * 0.2, uOpacity);
  float rim = smoothstep(0.62, 1.0, length(w.xy)) * cover;
  through *= 1.0 - rim * 0.6;
  float caustic = smoothstep(0.35, 0.8, dot(w.xy, vec2(0.45, -0.75))) * (1.0 - smoothstep(0.8, 0.98, length(w.xy))) * cover;
  through += caustic * 0.35 * (behind + 0.15);
  float spec = pow(max(dot(normalize(vec3(w.xy, 0.5)), normalize(vec3(-0.4, 0.6, 0.7))), 0.0), 40.0) * cover;
  vec3 colour = mix(scene, through, cover);
  colour = mix(colour, mix(behind, through, 0.6), w.w * 0.5);
  colour += spec * mix(vec3(0.95), uLiquid + 0.6, 0.2) * 0.9;
  colour = linearToSrgb(colour);
  colour += (hash12(px) - 0.5) / 255.0;
  fragColor = vec4(colour, 1.0);
}`;

  function compile(type, src) {
    var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  var prog;
  try {
    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) { if (window.console) console.warn('chuva desativada:', e); return; }
  gl.useProgram(prog);
  gl.bindVertexArray(gl.createVertexArray());

  function U(name) { return gl.getUniformLocation(prog, name); }
  function linear(hex) {
    var n = parseInt(hex.slice(1), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255].map(function (v) { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); });
  }
  var L = linear(CONFIG.liquid);
  gl.uniform1f(U('uShowDrops'), 1);
  gl.uniform1f(U('uShowFog'), 1);
  gl.uniform1f(U('uAmount'), CONFIG.amount);
  gl.uniform1f(U('uSize'), CONFIG.size);
  gl.uniform1f(U('uFog'), CONFIG.fog);
  gl.uniform1f(U('uRefraction'), CONFIG.refraction);
  gl.uniform3f(U('uLiquid'), L[0], L[1], L[2]);
  gl.uniform1f(U('uOpacity'), CONFIG.opacity);
  gl.uniform1i(U('uImage'), 0);
  gl.uniform1f(U('uImageReady'), 0);
  var uRes = U('uResolution'), uPR = U('uPixelRatio'), uTime = U('uTime');

  var ready = false, visible = false, raf = 0, last = 0, t = 6;

  function resize() {
    var r = section.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var w = Math.max(1, Math.round(r.width * dpr)), h = Math.max(1, Math.round(r.height * dpr));
    var max = 2200000; // limita os pixels para continuar leve em telas grandes
    if (w * h > max) { var k = Math.sqrt(max / (w * h)); w = Math.round(w * k); h = Math.round(h * k); }
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    gl.uniform2f(uRes, w, h);
    gl.uniform1f(uPR, w / Math.max(1, r.width));
  }
  function draw() { gl.uniform1f(uTime, t); gl.drawArrays(gl.TRIANGLES, 0, 3); }
  function loop(now) {
    raf = 0;
    if (!ready || !visible || document.hidden) { last = 0; return; }
    if (last) t += Math.min(Math.max(now - last, 0), 100) / 1000 * CONFIG.speed;
    last = now;
    draw();
    if (!reduce) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf && ready && visible) raf = requestAnimationFrame(loop); }

  var img = new Image();
  img.decoding = 'async';
  img.onload = function () {
    var tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.uniform2f(U('uImageSize'), img.naturalWidth, img.naturalHeight);
    gl.uniform1f(U('uImageReady'), 1);
    section.insertBefore(canvas, section.firstChild);
    var tint = document.createElement('div');
    tint.className = 'rain-tint';
    tint.setAttribute('aria-hidden', 'true');
    canvas.after(tint);
    section.classList.add('has-rain');
    ready = true;
    resize();
    draw();
    kick();
  };
  img.src = CONFIG.image;

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[e.length - 1].isIntersecting; kick(); }, { rootMargin: '80px' }).observe(section);
  } else { visible = true; }
  document.addEventListener('visibilitychange', kick);
  if (window.ResizeObserver) new ResizeObserver(function () { if (ready) { resize(); draw(); } }).observe(section);
})();
