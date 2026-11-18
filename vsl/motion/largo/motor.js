// Motor de videos completos. window.V = {estilo, escenas:[{c, t0, vd, dur, ...}]}. Cada escena se arma con un componente;
// el estilo del video cambia colores, tipografías, fondo animado, transición, animación de texto y adornos.
(() => {
const V = window.V, E = V.estilo, P = E.pal, A = V.assets || '../../assets/dj/', MS = E.set || 5;
// datos del producto (estudio de VSL). Si no vienen, son los del Súper Pack DJ (los videos aprobados no cambian).
const PR = Object.assign({oferta: 'Súper Pack DJ', curso: 'DJ Profesional', valor: 120, precio: 12, alumnos: 7593, dias: 7, unidad: 'herramientas',
  mods: ['Conexión de equipos', 'Mezcla y transiciones', 'Construcción de sets', 'Creación de remixes'], cont: null}, V.prod || {});
const CONT = PR.cont ? PR.cont.map((c) => [c.titulo, c.valor, c.corto || c.titulo]) : [['Guiones completos de evento', 25, 'Guiones de evento'], ['Kit de emergencia en vivo', 15, 'Kit de emergencia'], ['Checklist profesional antes de tocar', 10, 'Checklist profesional'], ['Pack de intros, cortes y transiciones', 20, 'Intros, cortes y transiciones'], ['Sistema para leer la pista', 15, 'Sistema para leer la pista'], ['Plan de preparación en 7 días', 15, 'Plan de 7 días'], ['Mensajes para conseguir y cerrar eventos', 20, 'Mensajes para cerrar eventos']];
const cl = (x) => Math.max(0, Math.min(1, x)), out = (x) => 1 - Math.pow(1 - cl(x), 4), io = (x) => { x = cl(x); return x * x * (3 - 2 * x); };
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const tx = (s) => esc(s).replace(/\*(.+?)\*/g, '<i class="k">$1</i>').replace(/\n/g, '<br>');
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
window.SFX = []; const fx = (t, n) => window.SFX.push([Math.max(0, +(+t).toFixed(2)), n]);
const R = document.documentElement.style, B = document.body;
const claro = !!E.claro;
const vars = {bg: P.bg, bg2: P.bg2 || P.bg, ink: P.ink, mut: P.mut, a: P.a, b: P.b || P.a, c: P.c || P.a, sobre: P.sobre || P.bg, sup: P.sup || rgba(P.ink, .07), linea: rgba(P.ink, .16),
  ft: E.ft, fw: E.fw || 800, fb: E.fb || 'Nunito', fk: E.fk || E.ft, fkw: E.fkw || 500, ls: E.ls || '-.035em', lh: E.lh || 1.05, tt: E.caps ? 'uppercase' : 'none', sombra: claro ? .22 : .5, vin: claro ? 0 : .4, fst: E.fst || "100%", grad: E.grad || 'none', rbtn: E.rbtn || '22px'};
for (const k in vars) R.setProperty('--' + k, vars[k]);
B.classList.add('t-' + (E.texto || 'sube'), 'k-' + (E.acento || 'color'));
B.innerHTML = '<div id="grad"></div><canvas id="fx" width="1920" height="1080"></canvas><div id="st"></div>';
const st = document.getElementById('st'), g = document.getElementById('fx').getContext('2d');
(E.marco || []).forEach((m) => {
  if (m === 'barra') B.insertAdjacentHTML('beforeend', '<div class="barra" id="pb"></div>');
  if (m === 'esquinas') B.insertAdjacentHTML('beforeend', '<i class="esq" style="left:36px;top:36px;border-right:0;border-bottom:0"></i><i class="esq" style="right:36px;top:36px;border-left:0;border-bottom:0"></i><i class="esq" style="left:36px;bottom:36px;border-right:0;border-top:0"></i><i class="esq" style="right:36px;bottom:36px;border-left:0;border-top:0"></i>');
  if (m === 'cine') B.insertAdjacentHTML('beforeend', '<div class="cine" style="top:0"></div><div class="cine" style="bottom:0"></div>');
  if (m === 'marca') B.insertAdjacentHTML('beforeend', '<div class="marca">Master Educativo · Súper Pack DJ</div>');
  if (m === 'cuenta') B.insertAdjacentHTML('beforeend', '<div class="cuenta" id="ct"></div>');
  if (m === 'vin') B.insertAdjacentHTML('beforeend', '<div class="vin"></div>');
});

// ---------- fondos animados ----------
let sd = 11; const rnd = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
const PT = [...Array(110)].map(() => ({x: rnd() * 1920, y: rnd() * 1080, v: .3 + rnd(), r: 1.5 + rnd() * 3, f: rnd() * 6.28}));
const al = claro ? 1.5 : 1;
const F = {
  nada() {},
  ondas(t) { for (let j = 0; j < 4; j++) { g.strokeStyle = rgba(j % 2 ? P.b || P.a : P.a, .17 * al); g.lineWidth = 3; g.beginPath(); for (let x = 0; x <= 1920; x += 24) { const y = 800 + j * 56 + Math.sin(x * .006 + t * (.6 + j * .15) + j) * 70 * Math.sin(x * .002 + t * .2 + j); x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); } },
  rejilla(t) { g.strokeStyle = rgba(P.a, .16 * al); g.lineWidth = 2; const hz = 640; for (let i = -14; i <= 14; i++) { g.beginPath(); g.moveTo(960 + i * 50, hz); g.lineTo(960 + i * 460, 1080); g.stroke(); } for (let k = 0; k < 10; k++) { const z = ((k + t * .5) % 10) / 10, y = hz + z * z * 440; g.globalAlpha = z; g.beginPath(); g.moveTo(0, y); g.lineTo(1920, y); g.stroke(); } g.globalAlpha = 1; },
  particulas(t) { PT.forEach((p, i) => { const y = ((p.y - t * 26 * p.v) % 1080 + 1080) % 1080, x = p.x + Math.sin(t * .5 * p.v + p.f) * 30; g.fillStyle = rgba(i % 3 ? P.a : P.b || P.a, .32 * al); g.beginPath(); g.arc(x, y, p.r, 0, 7); g.fill(); }); },
  vinilo(t) { const cx = E.vx == null ? 1780 : E.vx, cy = 980; for (let r = 150; r < 760; r += 30) { g.strokeStyle = rgba(P.a, .13 * al); g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, r, 0, 7); g.stroke(); } g.strokeStyle = rgba(P.b || P.a, .4 * al); g.lineWidth = 5; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(cx, cy, 260 + k * 170, t * .6 + k * 2, t * .6 + k * 2 + .9); g.stroke(); } },
  barras(t) { for (let i = 0; i < 64; i++) { const hgt = 60 + 150 * Math.abs(Math.sin(i * .37 + t * 2.1) * Math.sin(i * .11 - t * .9)); g.fillStyle = rgba(i % 5 === 0 ? P.b || P.a : P.a, .16 * al); g.fillRect(i * 30 + 4, 1080 - hgt, 20, hgt); } },
  rayas(t) { g.save(); g.translate(960, 540); g.rotate(-.5); for (let k = -14; k < 14; k++) { g.fillStyle = rgba(k % 2 ? P.a : P.b || P.a, .07 * al); g.fillRect(-1800, k * 150 + (t * 40) % 300, 3600, 60); } g.restore(); },
  halo(t) { [[P.a, 500 + Math.sin(t * .3) * 300, 300 + Math.cos(t * .25) * 160], [P.b || P.a, 1400 + Math.cos(t * .22) * 300, 800 + Math.sin(t * .31) * 160]].forEach(([c, x, y]) => { const gr = g.createRadialGradient(x, y, 0, x, y, 620); gr.addColorStop(0, rgba(c, .34 * al)); gr.addColorStop(1, rgba(c, 0)); g.fillStyle = gr; g.fillRect(0, 0, 1920, 1080); }); },
  puntos(t) { for (let y = 40; y < 1080; y += 64) for (let x = 40; x < 1920; x += 64) { const d = Math.hypot(x - 960, y - 540), r = 2.5 + 2.5 * Math.sin(d * .012 - t * 1.6); g.fillStyle = rgba(P.a, .2 * al); g.beginPath(); g.arc(x, y, Math.max(.5, r), 0, 7); g.fill(); } },
  luces(t) { for (let k = 0; k < 5; k++) { const x0 = 240 + k * 360, an = Math.sin(t * .5 + k * 1.3) * .35, x1 = x0 + Math.tan(an) * 1080; const gr = g.createLinearGradient(x0, 0, x1, 1080); gr.addColorStop(0, rgba(P.b || P.a, .26 * al)); gr.addColorStop(1, rgba(P.b || P.a, 0)); g.fillStyle = gr; g.beginPath(); g.moveTo(x0 - 14, 0); g.lineTo(x0 + 14, 0); g.lineTo(x1 + 190, 1080); g.lineTo(x1 - 190, 1080); g.fill(); } },
  circulos(t) { for (let k = 0; k < 6; k++) { const ph = ((t * .16 + k / 6) % 1); g.strokeStyle = rgba(k % 2 ? P.b || P.a : P.a, (1 - ph) * .3 * al); g.lineWidth = 4; g.beginPath(); g.arc(E.vx == null ? 1920 : E.vx, 1080, ph * 1500, 0, 7); g.stroke(); } },
  papel(t) { [[P.a, 1700 + Math.sin(t * .2) * 60, 140, 330], [P.b || P.a, 160, 980 + Math.cos(t * .25) * 50, 280], [P.c || P.a, 1820, 1010, 150]].forEach(([c, x, y, r]) => { g.fillStyle = rgba(c, .22); g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }); },
  cinta(t) { g.font = `${E.fw || 800} 260px ${E.ft}`; g.lineWidth = 3; g.strokeStyle = rgba(P.ink, .08 * al); const s = (E.cinta ? E.cinta + ' · ' + E.cinta + ' · ' : 'SÚPER PACK DJ · LISTO PARA CUALQUIER EVENTO · '); [[120, -90], [1010, 70]].forEach(([y, v]) => g.strokeText(s + s, (v < 0 ? 0 : -2600) + ((t * v) % 2600), y + 190)); },
  // ----- fondos de los temas por nicho (17 nov 2026): sobrios, sin elementos de audio -----
  brillo(t) { const x = ((t * 90) % 3400) - 700, gr = g.createLinearGradient(x, 0, x + 520, 1080); gr.addColorStop(0, rgba(P.a, 0)); gr.addColorStop(.5, rgba(P.a, .07 * al)); gr.addColorStop(1, rgba(P.a, 0)); g.save(); g.transform(1, 0, -.35, 1, 0, 0); g.fillStyle = gr; g.fillRect(x, 0, 900, 1080); g.restore();
    [[P.b || P.a, 1500 + Math.sin(t * .13) * 160, 180, 760, .16], [P.a, 260 + Math.cos(t * .11) * 140, 980, 640, .09]].forEach(([c, cx, cy, r, o]) => { const q = g.createRadialGradient(cx, cy, 0, cx, cy, r); q.addColorStop(0, rgba(c, o * al)); q.addColorStop(1, rgba(c, 0)); g.fillStyle = q; g.fillRect(0, 0, 1920, 1080); }); },
  polvo(t) { PT.forEach((p, i) => { if (i % 2) return; const y = ((p.y - t * 9 * p.v) % 1080 + 1080) % 1080, x = p.x + Math.sin(t * .22 * p.v + p.f) * 46, tw = .5 + .5 * Math.sin(t * 1.1 * p.v + p.f * 3); g.fillStyle = rgba(i % 6 ? P.a : P.c || P.a, (.1 + .3 * tw) * al); g.beginPath(); g.arc(x, y, p.r * .62, 0, 7); g.fill(); }); },
  pilares(t) { for (let i = 0; i < 9; i++) { const x = 1040 + i * 108 + Math.sin(t * .1 + i) * 6, w = 62, gr = g.createLinearGradient(x, 0, x + w, 0); gr.addColorStop(0, rgba(P.a, 0)); gr.addColorStop(.5, rgba(P.a, (.05 + .025 * Math.sin(t * .4 + i * .9)) * al)); gr.addColorStop(1, rgba(P.a, 0)); g.fillStyle = gr; g.fillRect(x, 0, w, 1080); g.fillStyle = rgba(P.a, .09 * al); g.fillRect(x, 0, 1.5, 1080); g.fillRect(x + w, 0, 1.5, 1080); } },
  filigrana(t) { g.strokeStyle = rgba(P.a, .22 * al); g.lineWidth = 1.5; const k = io(cl(t / 2.4)); [[70, 70], [1010, 1010]].forEach(([y1, y2], j) => { g.beginPath(); g.moveTo(960 - 890 * k, j ? y2 : y1); g.lineTo(960 + 890 * k, j ? y2 : y1); g.stroke(); g.beginPath(); g.moveTo(960 - 860 * k, (j ? y2 : y1) + (j ? -8 : 8)); g.lineTo(960 + 860 * k, (j ? y2 : y1) + (j ? -8 : 8)); g.stroke(); });
    for (let i = 0; i < 5; i++) { const ph = ((t * .05 + i / 5) % 1), y = 140 + ph * 800; g.strokeStyle = rgba(P.a, .06 * Math.sin(ph * Math.PI) * al); g.beginPath(); g.moveTo(0, y); g.lineTo(1920, y - 120); g.stroke(); } },
  cuadricula(t) { g.lineWidth = 1; for (let x = 0; x <= 1920; x += 80) { g.strokeStyle = rgba(P.a, (x % 400 ? .05 : .1) * al); g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 1080); g.stroke(); } for (let y = 0; y <= 1080; y += 80) { g.strokeStyle = rgba(P.a, (y % 400 ? .05 : .1) * al); g.beginPath(); g.moveTo(0, y); g.lineTo(1920, y); g.stroke(); }
    const sy = ((t * 120) % 1500) - 200, gr = g.createLinearGradient(0, sy - 160, 0, sy); gr.addColorStop(0, rgba(P.a, 0)); gr.addColorStop(1, rgba(P.a, .1 * al)); g.fillStyle = gr; g.fillRect(0, sy - 160, 1920, 160); g.fillStyle = rgba(P.a, .28 * al); g.fillRect(0, sy, 1920, 1.5); },
  codigo(t) { const X0 = 1240, LH = 34, N = 26, tot = t * 7; for (let i = 0; i < N; i++) { const s = (i * 7919) % 97, ind = (s % 4) * 34, y = 110 + i * LH, vis = cl(tot - i * .9); if (vis <= 0) break; let x = X0 + ind; const segs = 2 + (s % 3);
      for (let k = 0; k < segs; k++) { const w = (40 + ((s * (k + 3)) % 150)) * (k === segs - 1 ? vis : 1); g.fillStyle = rgba(k === 0 ? P.a : k === 1 ? P.ink : P.c || P.a, (k === 0 ? .2 : .08) * al); g.fillRect(x, y, w, 12); x += w + 16; }
      if (vis < 1 && Math.floor(t * 2.5) % 2 === 0) { g.fillStyle = rgba(P.a, .6 * al); g.fillRect(x - 10, y - 4, 10, 20); } g.fillStyle = rgba(P.mut, .12 * al); g.fillRect(X0 - 46, y, 22, 12); } },
  nodos(t) { const Q = PT.slice(0, 46).map((p, i) => [p.x + Math.sin(t * .18 * p.v + p.f) * 60, p.y + Math.cos(t * .15 * p.v + p.f * 2) * 50, i]); g.lineWidth = 1.2;
    for (let i = 0; i < Q.length; i++) for (let j = i + 1; j < Q.length; j++) { const d = Math.hypot(Q[i][0] - Q[j][0], Q[i][1] - Q[j][1]); if (d < 260) { g.strokeStyle = rgba(P.a, (1 - d / 260) * .16 * al); g.beginPath(); g.moveTo(Q[i][0], Q[i][1]); g.lineTo(Q[j][0], Q[j][1]); g.stroke(); } }
    Q.forEach(([x, y, i]) => { const pu = .5 + .5 * Math.sin(t * 1.4 + i); g.fillStyle = rgba(i % 7 ? P.a : P.c || P.a, (.25 + .35 * pu) * al); g.beginPath(); g.arc(x, y, 3 + pu * 1.5, 0, 7); g.fill(); }); },
  // emblema del nicho en línea fina, dibujándose solo y con un vaivén lento (esquina inferior derecha)
  emblema(t) { const k = io(cl((t - .4) / 3)), cx = 1610, cy = 760; if (!E.emblema || k <= 0) return; g.save(); g.translate(cx, cy); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = rgba(P.a, .1 * al); g.lineWidth = 5;
    const seg = (pts, a, b) => { const u = cl((k - a) / (b - a)); if (u <= 0) return; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) { const f = cl(u * (pts.length - 1) - (i - 1)); if (f <= 0) break; g.lineTo(pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * f, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * f); } g.stroke(); };
    if (E.emblema === 'balanza') { const an = Math.sin(t * .7) * .045 * k; seg([[0, 250], [0, -210]], 0, .3); seg([[-120, 250], [120, 250]], .1, .3); g.beginPath(); g.arc(0, -226, 16, 0, 6.3 * cl(k / .35)); g.stroke();
      g.save(); g.translate(0, -180); g.rotate(an); seg([[-250, 0], [250, 0]], .25, .5); [-250, 250].forEach((x, j) => { g.save(); g.translate(x, 0); g.rotate(-an); seg([[0, 0], [-80, 170]], .45, .65); seg([[0, 0], [80, 170]], .45, .65); const u = cl((k - .65) / .3); if (u > 0) { g.beginPath(); g.arc(0, 170, 84, 0, Math.PI * u); g.stroke(); seg([[-84, 170], [84, 170]], .65, .9); } g.restore(); }); g.restore(); }
    if (E.emblema === 'llaves') { g.lineWidth = 7; seg([[-150, -150], [-290, 0], [-150, 150]], 0, .4); seg([[150, -150], [290, 0], [150, 150]], .25, .65); seg([[50, -190], [-50, 190]], .55, .9); if (k >= 1 && Math.floor(t * 2) % 2 === 0) { g.fillStyle = rgba(P.a, .12 * al); g.fillRect(330, 110, 26, 46); } }
    g.restore(); },
  rombos(t) { for (let k = 0; k < 7; k++) { g.save(); g.translate(1920, 0); g.rotate(Math.PI / 4 + t * .03); g.strokeStyle = rgba(k % 2 ? P.a : P.b || P.a, .15 * al); g.lineWidth = 3; const s = 200 + k * 150 + Math.sin(t + k) * 20; g.strokeRect(-s / 2, -s / 2, s, s); g.restore(); } },
};

// ---------- utilidades de escena ----------
const txt = (sc, h, o = {}) => `${sc.k ? `<div class="K fade" style="--d:${h.T(o.k == null ? .02 : o.k)}s">${esc(sc.k)}</div>` : ''}<h1 class="T rv" style="--d:${h.T(o.t == null ? .05 : o.t)}s;--fs:${Math.round((sc.tam || o.tam || 112) * (E.tam || 1))}px">${tx(sc.t)}</h1>${sc.s ? `<p class="P fade" style="--d:${h.T(o.s == null ? .45 : o.s)}s">${tx(sc.s)}</p>` : ''}`;
const img = (n, d, deco, extra = '') => `${deco && deco !== 'flota' && deco !== 'inclina' ? `<div class="deco d-${deco}"><i></i><b></b></div>` : ''}<img class="im flo pop" style="--d:${d}s;${deco === 'inclina' ? 'rotate:-6deg;' : ''}${extra}" src="${A}${n}.png" alt="">`;
const lado = (el, k) => { el.classList.add('dos'); if ((E.lado === 'izq') !== (!!E.alterna && k % 2 === 1)) el.classList.add('inv'); };
const C = {}, D = {};

C.titulo = (el, sc, h) => {
  let ic = '';
  if (sc.icono === 'candado') { ic = `<svg width="150" height="170" viewBox="0 0 150 170" style="margin-bottom:26px;overflow:visible"><path class="arc" d="M40 78 V52 a35 35 0 0 1 70 0 V78" fill="none" stroke="var(--a)" stroke-width="13" stroke-linecap="round"/><rect x="18" y="76" width="114" height="88" rx="18" fill="var(--a)"/><circle cx="75" cy="116" r="11" fill="var(--sobre)"/></svg>`; fx(h.T(.3), 'click'); sc.fr = (p) => { const k = out((p - .3) / .25), a = el.querySelector('.arc'); a.style.transformOrigin = '110px 78px'; a.style.transform = `translateY(${-k * 16}px) rotate(${k * 28}deg)`; }; }
  if (sc.img) { lado(el, h.i); el.innerHTML = `<div class="ct">${ic}${txt(sc, h, {tam: 106})}</div><div class="ci">${img(sc.img, h.T(.04), sc.deco === undefined ? E.deco : sc.deco)}</div>`; } else { el.classList.add(E.alinear === 'izq' ? 'izq' : 'cen'); el.innerHTML = `<div class="blk">${ic}${txt(sc, h, {tam: 124})}</div>`; }
};
C.felicita = (el, sc, h) => {
  el.classList.add(E.alinear === 'izq' ? 'izq' : 'cen'); fx(h.T(.02) + .8, 'ding');
  el.innerHTML = `<div class="blk"><svg width="190" height="190" viewBox="0 0 230 230" style="margin-bottom:34px"><circle class="tr" cx="115" cy="115" r="100" stroke="var(--a)" stroke-width="12" style="--len:630;--d:${h.T(.02)}s;--du:1s" transform="rotate(-90 115 115)"/><path class="tr" d="M70 118 l32 32 l60 -66" stroke="var(--a)" stroke-width="14" style="--len:160;--d:${h.T(.02) + .7}s;--du:.5s"/></svg>${txt(sc, h, {tam: 118, t: .12})}</div>`;
};
C.numero = (el, sc, h) => {
  lado(el, h.i); el.innerHTML = `<div class="ct">${txt(sc, h, {tam: 96, t: .15})}</div><div class="ci"><div class="pop" style="--d:${h.T(.02)}s;font-family:var(--ft);font-weight:var(--fw);font-size:${sc.n.length > 2 ? 330 : 560}px;line-height:.9;letter-spacing:-.06em;color:var(--a)">${esc(sc.n)}</div></div>`; fx(h.T(.02), 'golpe');
};
C.curso = (el, sc, h) => {
  lado(el, 0); const M = PR.mods;
  el.innerHTML = `<div class="ct">${txt(sc, h, {tam: 100})}<div class="chips">${M.map((m, i) => `<span class="fade" style="--d:${h.T(.3 + i * .13)}s">${m}</span>`).join('')}<span class="fade" style="--d:${h.T(.84)}s;border-color:var(--a);color:var(--a)">Certificado incluido</span></div></div><div class="ci">${img('E1', h.T(.05), E.deco)}</div>`;
  M.forEach((_, i) => fx(h.T(.3 + i * .13), 'pop'));
};
C.camino = (el, sc, h) => {
  el.classList.add('cen'); const N = ['Aprender', 'Practicar', 'Conseguir clientes', 'Cobrar', 'Crecer'].map((x, i) => (PR.camino || [])[i] || x), es = sc.forma === 'escalera', X = (i) => 170 + i * 330, Y = (i) => es ? 360 - i * 70 : 70;
  el.innerHTML = `<div class="blk" style="width:100%;max-width:none">${txt(sc, h, {tam: 104})}<div style="position:relative;width:1660px;height:${es ? 540 : 330}px;margin:80px auto 0;text-align:center">
    <svg width="1660" height="${es ? 540 : 330}" style="position:absolute;left:0;top:0"><path d="M${N.map((_, i) => X(i) + ' ' + Y(i)).join(' L')}" fill="none" stroke="var(--linea)" stroke-width="8"/><path class="pr" d="M${N.map((_, i) => X(i) + ' ' + Y(i)).join(' L')}" fill="none" stroke="var(--a)" stroke-width="8" stroke-linecap="round"/></svg>
    ${N.map((n, i) => `<div class="nd" style="position:absolute;left:${X(i) - 165}px;top:${Y(i) - 44}px;width:330px"><i style="display:block;width:88px;height:88px;border-radius:50%;margin:0 auto;border:5px solid var(--a);background:var(--bg);font-style:normal;font-family:var(--ft);font-weight:var(--fw);font-size:38px;line-height:78px">${i + 1}</i><b style="display:block;margin-top:20px;font-size:42px;line-height:1.1;font-weight:800">${n}</b><em style="display:block;margin-top:8px;font-style:normal;font-weight:800;font-size:23px;letter-spacing:.14em;text-transform:uppercase;color:${i < 2 ? 'var(--mut)' : 'var(--a)'}">${i < 2 ? 'Tu curso' : 'Súper Pack DJ'}</em></div>`).join('')}</div></div>`;
  const pr = el.querySelector('.pr'), nd = [...el.querySelectorAll('.nd')]; let L = 0;
  N.forEach((_, i) => fx(h.T(.15 + i * .16), 'pop'));
  sc.fr = (p) => { L = L || pr.getTotalLength(); const u = cl((p - .15) / .64); pr.style.strokeDasharray = L; pr.style.strokeDashoffset = L * (1 - io(u)); nd.forEach((n, i) => { const ok = u >= i / 4 - .01; n.firstChild.style.background = ok ? 'var(--a)' : 'var(--bg)'; n.firstChild.style.color = ok ? 'var(--sobre)' : 'var(--ink)'; n.style.opacity = ok ? 1 : .45; }); };
};
C.producto = (el, sc, h) => { lado(el, h.i); el.innerHTML = `<div class="ct">${txt(sc, h, {tam: 128})}</div><div class="ci">${img(sc.img || 'pack_' + MS, h.T(.03), sc.deco === undefined ? E.deco : sc.deco)}</div>`; };
C.tool = (el, sc, h) => {
  const i = sc.i, c = CONT[i]; lado(el, h.i); sc.k = sc.k || `${PR.etiqueta || 'Herramienta'} ${i + 1} de ${CONT.length}`; sc.t = sc.t || c[0];
  el.innerHTML = `<div class="ct">${txt(sc, h, {tam: 98, s: .38})}<div class="chip fade" style="--d:${h.T(.72)}s">Valor <b>$${c[1]}</b></div></div><div class="ci">${sc.demo ? '' : img('c' + i + '_5', h.T(.03), E.deco)}</div>`;
  if (sc.demo) D[sc.demo](el.querySelector('.ci'), sc, h); fx(h.T(.72), 'pop');
};
C.demo = (el, sc, h) => { lado(el, h.i); el.innerHTML = `<div class="ct">${txt(sc, h, {tam: 92})}</div><div class="ci"></div>`; D[sc.demo](el.querySelector('.ci'), sc, h); };
D.chat = (ci, sc, h) => {
  const M = [['e', 'Hola, vi tu perfil. ¿Tocas en bodas?'], ['y', '¡Hola! Sí. Te cuento cómo trabajo y qué incluye mi servicio.'], ['e', 'Me interesa. ¿Cuánto cobras?'], ['y', 'Te envío la propuesta con todo detallado.']];
  ci.innerHTML = `<div class="tel pop" style="--d:${h.T(.02)}s"><div class="cab"><span>Cliente · Boda</span><em>EJEMPLO</em></div>${M.map(([q, t], i) => `<div class="bu ${q} fade" style="--d:${h.T(.14 + i * .19)}s">${t}</div>`).join('')}</div>`;
  M.forEach((_, i) => fx(h.T(.14 + i * .19), 'pop'));
};
D.checklist = (ci, sc, h) => {
  const M = (sc.puntos && sc.puntos.length ? sc.puntos : ['Conexiones revisadas', 'Equipo probado', 'Música organizada', 'Guion del evento a la mano', 'Plan B preparado', 'Listo para tocar']).slice(0, 6);
  ci.innerHTML = `<div class="hoja pop" style="--d:${h.T(.02)}s"><h4>${esc(sc.demoT || 'Antes del evento')} <em>EJEMPLO</em></h4>${M.map((m) => `<div class="chk"><i>✓</i>${m}</div>`).join('')}</div>`;
  const cs = [...ci.querySelectorAll('.chk')]; M.forEach((_, i) => fx(h.T(.16 + i * .12), 'click'));
  sc.fr = (p) => cs.forEach((c, i) => c.classList.toggle('ok', p >= .16 + i * .12));
};
D.plan = (ci, sc, h) => {
  ci.innerHTML = `<div class="dias">${[1, 2, 3, 4, 5, 6, 7].map((d, i) => `<div class="dia pop" style="--d:${h.T(.03 + i * .04)}s"><div>DÍA<b>${d}</b></div></div>`).join('')}<div class="dia pop" style="--d:${h.T(.34)}s;border-style:dashed;font-size:20px"><div>TU<br>EVENTO</div></div></div>`;
  const ds = [...ci.querySelectorAll('.dia')]; for (let i = 0; i < 7; i++) fx(h.T(.3 + i * .08), 'click');
  sc.fr = (p) => ds.forEach((d, i) => d.classList.toggle('ok', p >= .3 + i * .08));
};
D.curva = (ci, sc, h) => {
  const Fz = [['Inicio', 60], ['Subida', 250], ['Clímax', 470], ['Cierre', 660]];
  ci.innerHTML = `<div style="position:relative;width:740px;height:560px"><div class="ej">Ejemplo</div><svg width="740" height="470" viewBox="0 0 740 470"><line x1="20" y1="440" x2="720" y2="440" stroke="var(--linea)" stroke-width="3"/><path class="cv" d="M20 410 C 150 400, 200 340, 290 300 S 420 120, 500 90 S 640 240, 720 380" fill="none" stroke="var(--a)" stroke-width="10" stroke-linecap="round"/></svg>${Fz.map(([n, x], i) => `<div class="fade" style="--d:${h.T(.18 + i * .17)}s;position:absolute;left:${x - 60}px;top:490px;width:140px;text-align:center;font-weight:800;font-size:28px">${n}</div>`).join('')}</div>`;
  const cv = ci.querySelector('.cv'); let L = 0;
  sc.fr = (p) => { L = L || cv.getTotalLength(); cv.style.strokeDasharray = L; cv.style.strokeDashoffset = L * (1 - io((p - .1) / .7)); };
};
D.kit = (ci, sc, h) => {
  const M = ['La pista se apaga', 'Falla en cabina', 'Imprevisto en vivo'];
  ci.innerHTML = `<div class="kit"><span class="ej" style="position:static;text-align:right">Ejemplo</span>${M.map((m, i) => `<div class="fade" style="--d:${h.T(.05 + i * .08)}s">${m}<em>Problema</em></div>`).join('')}</div>`;
  const ks = [...ci.querySelectorAll('.kit div.fade')]; M.forEach((_, i) => fx(h.T(.45 + i * .14), 'ding'));
  sc.fr = (p) => ks.forEach((k, i) => { const ok = p >= .45 + i * .14; k.classList.toggle('ok', ok); k.lastChild.textContent = ok ? 'Solución lista' : 'Problema'; });
};
C.rafaga = (el, sc, h) => {
  el.classList.add('cen'); el.innerHTML = CONT.map((c, i) => `<div style="position:absolute;inset:0;display:grid;place-items:center;opacity:0;padding:0 130px"><div style="width:100%"><div class="K" style="color:var(--a);font-size:34px">${String(i + 1).padStart(2, '0')} / 07</div><div class="T" data-mh="420" style="--fs:150px">${esc(c[2])}</div></div></div>`).join('');
  const N = sc.n || 7; for (let i = 0; i < 7; i++) fx(h.T(.03 + .94 * i / 7), 'pop');
  sc.fr = (p) => { const u = cl((p - .03) / .94) * 7, k = Math.min(6, Math.floor(u)), q = u - k; [...el.children].forEach((e, i) => { e.style.opacity = i === k ? 1 : 0; if (i === k) e.firstChild.style.transform = `scale(${1 + .22 * (1 - out(q * 3))})`; }); };
};
C.rejilla = (el, sc, h) => {
  el.classList.add('cen'); el.innerHTML = `<div class="blk" style="width:100%;max-width:none">${txt(sc, h, {tam: 70})}<div style="display:flex;flex-wrap:wrap;justify-content:center;gap:26px 40px;margin-top:46px">${CONT.map((c, i) => `<div class="pop" style="--d:${h.T(.12 + i * .115)}s;width:370px;text-align:center"><img src="${A}c${i}_${MS}.png" style="height:220px;max-width:330px;object-fit:contain;filter:drop-shadow(0 20px 24px rgba(0,0,0,.35))" alt=""><div style="font-weight:800;font-size:25px;margin-top:10px">${esc(c[2])}</div></div>`).join('')}</div></div>`;
  CONT.forEach((_, i) => fx(h.T(.12 + i * .115), 'pop'));
};
C.carrusel = (el, sc, h) => {
  el.classList.add('cen'); const Rr = 760;
  el.innerHTML = `<div class="blk" style="width:100%;max-width:none">${txt(sc, h, {tam: 70})}<div style="position:relative;height:470px;perspective:1800px;margin-top:30px"><div class="aro" style="position:absolute;left:50%;top:50%;transform-style:preserve-3d">${CONT.map((_, i) => `<div style="position:absolute;width:400px;height:420px;margin:-210px 0 0 -200px;display:grid;place-items:center;transform:rotateY(${i * 360 / 7}deg) translateZ(${Rr}px)"><img src="${A}c${i}_${MS}.png" style="max-width:100%;max-height:100%;filter:drop-shadow(0 30px 40px rgba(0,0,0,.45))" alt=""></div>`).join('')}</div></div><div style="margin-top:70px"><div class="K n1" style="color:var(--a);margin-bottom:6px"></div><div class="n2" style="font-family:var(--ft);font-weight:var(--fw);font-size:56px;letter-spacing:var(--ls);text-transform:var(--tt)"></div></div></div>`;
  const aro = el.querySelector('.aro'), n1 = el.querySelector('.n1'), n2 = el.querySelector('.n2'); for (let i = 1; i < 7; i++) fx(h.T(.06 + .9 * i / 7), 'whoosh');
  sc.fr = (p) => { const u = cl((p - .06) / .9) * 7, k = Math.min(6, Math.floor(u)), f = io(cl((u - k - .7) / .3)), pos = Math.min(6, k + f); aro.style.transform = `translateZ(${-Rr - 400}px) rotateY(${-pos * 360 / 7}deg)`; const s = Math.round(pos); n1.textContent = String(s + 1).padStart(2, '0') + ' / 07'; n2.textContent = CONT[s][0]; [...aro.children].forEach((c, i) => { const d = Math.min(Math.abs(i - pos), 7 - Math.abs(i - pos)); c.style.opacity = d < .6 ? 1 : (d < 1.6 ? .3 : .06); }); };
};
C.valor = (el, sc, h) => {
  const f0 = .1, df = .105, fT = .86, forma = sc.forma || 'lista';
  CONT.forEach((_, i) => fx(h.T(f0 + i * df), forma === 'consola' ? 'click' : 'pop')); fx(h.T(fT), 'ding');
  if (forma === 'lista') {
    lado(el, 1); el.innerHTML = `<div class="ct">${txt(sc, h, {tam: 100})}</div><div style="flex:0 0 860px">${CONT.map((c, i) => `<div class="fila fade" style="--d:${h.T(f0 + i * df)}s"><span>${c[0]}</span><b>$${c[1]}</b></div>`).join('')}<div class="fila tot fade" style="--d:${h.T(fT)}s"><span>Valor total</span><b>$120</b></div></div>`;
  } else if (forma === 'recibo') {
    lado(el, 0); el.innerHTML = `<div class="ct">${txt(sc, h, {tam: 88})}</div><div class="ci" style="align-items:start"><div class="pap" style="width:640px;background:#f6f2e7;color:#17171d;padding:40px 44px 46px;font-family:var(--fb);box-shadow:0 40px 80px rgba(0,0,0,.35)"><div style="font-family:var(--ft);font-weight:var(--fw);font-size:36px">Súper Pack DJ</div><div style="font-size:19px;font-weight:800;letter-spacing:.14em;color:#7d7a8c;margin:6px 0 20px">VALOR DE REFERENCIA</div>${CONT.map((c) => `<div class="rl" style="display:flex;justify-content:space-between;gap:16px;height:64px;align-items:center;border-top:2px dashed #cfcab8;font-size:24px;font-weight:700"><span>${c[0]}</span><b>$${c[1]}</b></div>`).join('')}<div class="rl" style="display:flex;justify-content:space-between;height:92px;align-items:center;border-top:4px solid #17171d;font-size:32px;font-weight:800"><span>Valor total</span><b style="font-size:46px">$120</b></div></div></div>`;
    const pap = el.querySelector('.pap'); sc.fr = (p) => { const Hh = pap.offsetHeight, n = p < f0 ? 0 : Math.min(8, Math.floor((p - f0) / df) + 1), v = p >= fT ? Hh : 138 + Math.min(n, 7) * 64 + 4; pap.style.clipPath = `inset(0 0 ${Math.max(0, Hh - v)}px 0)`; };
  } else if (forma === 'barras') {
    el.classList.add('cen'); el.innerHTML = `<div style="width:100%"><div style="display:flex;justify-content:space-between;align-items:flex-end;text-align:left"><div style="max-width:1050px">${txt(sc, h, {tam: 78})}</div><div style="text-align:right"><div class="K" style="margin:0">Valor de referencia</div><div class="tt" style="font-family:var(--ft);font-weight:var(--fw);font-size:120px;line-height:1;letter-spacing:-.04em;color:var(--c)">$0</div></div></div><div class="eq" style="display:flex;gap:30px;height:440px;margin-top:40px;border-bottom:3px solid var(--linea)">${CONT.map((c, i) => `<div style="flex:1;position:relative"><div class="bb" style="position:absolute;left:0;right:0;bottom:0;height:0;border-radius:12px 12px 0 0;background:${sc.colores ? sc.colores[i % sc.colores.length] : 'var(--a)'}"></div><div class="vv" style="position:absolute;left:0;right:0;text-align:center;font-family:var(--ft);font-weight:var(--fw);font-size:46px;opacity:0">$${c[1]}</div></div>`).join('')}</div><div style="display:flex;gap:30px;margin-top:16px">${CONT.map((c) => `<span style="flex:1;font-size:24px;font-weight:700;line-height:1.2;color:var(--mut)">${c[2]}</span>`).join('')}</div></div>`;
    const bs = [...el.querySelectorAll('.bb')], vs = [...el.querySelectorAll('.vv')], tt = el.querySelector('.tt');
    sc.fr = (p, lt) => { let tot = 0; bs.forEach((b, i) => { const k = out((p - f0 - i * df) / .12), hh = CONT[i][1] / 25 * 360 * k + (k > 0 ? Math.sin(lt * 6 + i * 1.7) * 8 * k : 0); b.style.height = hh + 'px'; vs[i].style.opacity = k; vs[i].style.bottom = (hh + 12) + 'px'; if (k > .5) tot += CONT[i][1]; }); tt.textContent = '$' + tot; };
  } else if (forma === 'consola') {
    el.classList.add('cen'); el.innerHTML = `<div style="width:1500px;border-radius:24px;background:var(--sup);border:2px solid var(--linea);overflow:hidden;text-align:left"><div style="height:70px;display:flex;align-items:center;gap:12px;padding:0 28px;border-bottom:2px solid var(--linea);font-weight:700;font-size:24px;color:var(--mut)"><i style="width:16px;height:16px;border-radius:50%;background:var(--a)"></i><i style="width:16px;height:16px;border-radius:50%;background:var(--linea)"></i><i style="width:16px;height:16px;border-radius:50%;background:var(--linea)"></i><span style="margin-left:16px">super-pack-dj · valor de referencia</span></div><div style="padding:34px 54px 40px">${CONT.map((c) => `<div class="cn" style="display:flex;align-items:center;gap:26px;height:76px;opacity:0"><span style="flex:none;width:800px;font-size:32px;font-weight:700;white-space:nowrap">${c[0]}</span><span style="flex:1;height:12px;border-radius:6px;background:var(--linea);overflow:hidden"><u style="display:block;height:100%;width:0;background:var(--a)"></u></span><b style="flex:none;width:100px;text-align:right;font-size:34px;color:var(--a)">$${c[1]}</b></div>`).join('')}<div class="ct2" style="display:flex;justify-content:space-between;align-items:center;height:110px;margin-top:10px;border-top:3px solid var(--a);font-family:var(--ft);font-weight:var(--fw);font-size:46px;opacity:0"><span>Valor total</span><span style="color:var(--c);font-size:76px">$120</span></div></div></div>`;
    const ls = [...el.querySelectorAll('.cn')], tot = el.querySelector('.ct2');
    sc.fr = (p) => { ls.forEach((e, i) => { const u = (p - f0 - i * df); e.style.opacity = cl(u / .02); e.children[1].firstChild.style.width = (io(u / .09) * 100) + '%'; e.children[2].style.opacity = u > .08 ? 1 : 0; }); tot.style.opacity = cl((p - fT) / .04); };
  }
};
C.precio = (el, sc, h) => {
  const f = sc.f || [.3, .5, .68], forma = sc.forma || 'tachado'; fx(h.T(f[0]), 'whoosh'); fx(h.T(f[2]) - 1, 'riser'); fx(h.T(f[2]), 'golpe');
  const big = (s, col, sz) => `<span style="font-family:var(--ft);font-weight:var(--fw);font-size:${sz}px;letter-spacing:-.05em;line-height:.95;color:${col}">${s}</span>`;
  if (forma === 'tachado') {
    el.classList.add('cen'); el.innerHTML = `<div style="position:relative;width:100%;height:760px"><div class="v1" style="position:absolute;left:0;right:0;top:120px"><div class="K">Valor total</div><div style="position:relative;display:inline-block">${big('$120', 'var(--ink)', 300)}<i class="ry" style="position:absolute;left:-4%;right:-4%;top:50%;height:20px;background:var(--b);transform-origin:0 50%;border-radius:10px"></i></div></div><div class="ds chip" style="position:absolute;left:50%;top:520px;translate:-50% 0;margin:0;font-size:38px;background:var(--bg)">90% de descuento</div><div class="v2" style="position:absolute;left:0;right:0;top:250px"><div class="K" style="color:var(--a)">${esc(sc.k || 'Hoy, por tu compra')}</div>${big('$12', 'var(--c)', 420)}<div class="P" style="margin-top:6px;color:var(--ink);font-weight:700">USD · solo en esta página</div></div></div>`;
    const v1 = el.querySelector('.v1'), ry = el.querySelector('.ry'), ds = el.querySelector('.ds'), v2 = el.querySelector('.v2');
    sc.fr = (p) => { const a = out((p - f[0]) / .1), b = out((p - f[1]) / .08), c2 = out((p - f[2]) / .1); ry.style.transform = `scaleX(${a}) rotate(-6deg)`; ds.style.opacity = b * (1 - c2); ds.style.scale = .8 + .2 * b; v1.style.opacity = cl(p / .04) * (1 - c2 * .86); v1.style.transform = `translateY(${-c2 * 130}px) scale(${1 - c2 * .62})`; v2.style.opacity = c2; v2.style.transform = `scale(${1.5 - .5 * c2})`; };
  } else if (forma === 'aro') {
    lado(el, 0); el.innerHTML = `<div class="ct"><div class="K">Valor total</div><div style="position:relative;display:inline-block">${big('$120', 'var(--mut)', 150)}<i class="ry" style="position:absolute;left:-4%;right:-4%;top:50%;height:12px;background:var(--b);transform-origin:0 50%"></i></div><div class="v2" style="margin-top:20px"><div class="K" style="color:var(--a)">${esc(sc.k || 'Tu precio hoy')}</div>${big('$12', 'var(--c)', 330)}<div class="P" style="margin-top:0;color:var(--ink);font-weight:700">USD · solo en esta página</div></div></div><div class="ci"><svg width="640" height="640" viewBox="-320 -320 640 640"><circle r="270" fill="none" stroke="var(--linea)" stroke-width="44"/><circle class="ar" r="270" fill="none" stroke="var(--a)" stroke-width="44" stroke-linecap="round" transform="rotate(-90)" stroke-dasharray="1697" stroke-dashoffset="1697"/></svg><div style="position:absolute;text-align:center"><div class="pc" style="font-family:var(--ft);font-weight:var(--fw);font-size:170px;letter-spacing:-.05em;line-height:1">0%</div><div class="K" style="margin:6px 0 0">de descuento</div></div></div>`;
    const ry = el.querySelector('.ry'), ar = el.querySelector('.ar'), pc = el.querySelector('.pc'), v2 = el.querySelector('.v2');
    sc.fr = (p) => { const a = out((p - f[0]) / .1), b = io((p - f[1] + .06) / .16), c2 = out((p - f[2]) / .1); ry.style.transform = `scaleX(${a})`; ar.style.strokeDashoffset = 1697 * (1 - .9 * b); pc.textContent = Math.round(90 * b) + '%'; v2.style.opacity = c2; v2.style.transform = `translateY(${(1 - c2) * 50}px)`; };
  } else if (forma === 'contador') {
    for (let k = 0; k < 8; k++) fx(h.T(f[0] + (f[2] - f[0]) * k / 8), 'tick'); fx(h.T(f[2]) + .12, 'monedas');
    el.classList.add('cen'); el.innerHTML = `<div><div class="K kk" style="font-size:34px">Valor total</div><div class="nn" style="font-family:var(--ft);font-weight:var(--fw);font-size:520px;letter-spacing:-.06em;line-height:.92">$120</div><div class="P pp" style="margin-top:0;font-weight:700;opacity:0;color:var(--ink)">USD · 90% de descuento · solo en esta página</div></div>`;
    const nn = el.querySelector('.nn'), kk = el.querySelector('.kk'), pp = el.querySelector('.pp');
    sc.fr = (p) => { const u = io((p - f[0]) / (f[2] - f[0])), fin = u >= 1; nn.textContent = '$' + Math.round(PR.valor - (PR.valor - PR.precio) * u); nn.style.color = fin ? 'var(--c)' : 'var(--ink)'; nn.style.transform = `scale(${fin ? 1 + .12 * (1 - out((p - f[2]) / .08)) : 1})`; kk.textContent = fin ? (sc.k || 'Tu precio hoy') : 'Valor total'; kk.style.color = fin ? 'var(--a)' : 'var(--mut)'; pp.style.opacity = cl((p - f[2]) / .06); };
  } else if (forma === 'giro') {
    el.classList.add('cen'); const cara = (bg, col, k, n, s) => `<div style="position:absolute;inset:0;border-radius:44px;backface-visibility:hidden;background:${bg};color:${col};display:grid;place-items:center;box-shadow:0 50px 100px rgba(0,0,0,.35)${s}"><div><div style="font-weight:800;font-size:30px;letter-spacing:.16em;text-transform:uppercase;opacity:.8">${k}</div><div style="font-family:var(--ft);font-weight:var(--fw);font-size:330px;letter-spacing:-.05em;line-height:1">${n}</div></div></div>`;
    el.innerHTML = `<div style="perspective:2200px"><div class="cd" style="position:relative;width:1100px;height:600px;transform-style:preserve-3d">${cara('var(--sup)', 'var(--ink)', 'Valor total', '$120', ';border:2px solid var(--linea)')}${cara('var(--a)', 'var(--sobre)', esc(sc.k || 'Hoy, solo en esta página'), '$12', ';transform:rotateY(180deg)')}</div><div class="P pp" style="font-weight:700;color:var(--ink);opacity:0">90% de descuento por tu compra</div></div>`;
    const cd = el.querySelector('.cd'), pp = el.querySelector('.pp');
    sc.fr = (p, lt) => { const k = io((p - f[1]) / (f[2] - f[1] + .04)); cd.style.transform = `rotateY(${k * 180 + (k >= 1 ? Math.sin(lt) * 3 : 0)}deg) scale(${1 - Math.sin(k * Math.PI) * .12})`; pp.style.opacity = cl((p - f[2]) / .06); };
  }
};
C.garantia = (el, sc, h) => {
  lado(el, 1); const forma = sc.forma || 'aro'; let gfx = '';
  const f0 = .1, df = .07;
  if (forma === 'aro') { const Rr = 290, gap = 5; let s = ''; for (let i = 0; i < 7; i++) { const a0 = (-90 + i * 360 / 7 + gap / 2) * Math.PI / 180, a1 = (-90 + (i + 1) * 360 / 7 - gap / 2) * Math.PI / 180, d = `M${Rr * Math.cos(a0)} ${Rr * Math.sin(a0)} A${Rr} ${Rr} 0 0 1 ${Rr * Math.cos(a1)} ${Rr * Math.sin(a1)}`; s += `<path d="${d}" fill="none" stroke="var(--linea)" stroke-width="46"/><path class="sg" d="${d}" fill="none" stroke="var(--a)" stroke-width="46" opacity="0"/>`; } gfx = `<svg width="700" height="700" viewBox="-350 -350 700 700">${s}</svg><div style="position:absolute;text-align:center"><b class="gn" style="display:block;font-family:var(--ft);font-weight:var(--fw);font-size:290px;letter-spacing:-.06em;line-height:.9">0</b><span class="K" style="margin:0">días</span></div>`; }
  if (forma === 'calendario') gfx = `<div class="dias">${[...Array(Math.min(14, PR.dias))].map((_, d) => d + 1).map((d) => `<div class="dia sg2"><div>DÍA<b>${d}</b></div></div>`).join('')}<div class="dia" style="border-style:dashed;font-size:19px"><div>SI NO TE<br>GUSTA,<br>REEMBOLSO</div></div></div>`;
  if (forma === 'escudo2') gfx = `<svg width="660" height="760" viewBox="-30 -30 660 760" style="overflow:visible"><defs><linearGradient id="eg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--a)"/><stop offset="1" stop-color="var(--b)"/></linearGradient></defs>
    <circle class="hl" cx="300" cy="340" r="330" fill="none" stroke="var(--a)" stroke-width="3" opacity=".3"/>${[...Array(7)].map((_, k) => { const a = (-150 + k * 50) * Math.PI / 180; return `<circle class="dt" cx="${300 + Math.cos(a) * 365}" cy="${340 + Math.sin(a) * 365}" r="16" fill="var(--a)" opacity=".15"/>`; }).join('')}
    <path class="sf" d="M300 30 L560 130 V340 C560 500 450 610 300 670 C150 610 40 500 40 340 V130 Z" fill="url(#eg)" opacity="0"/><path class="tr" d="M300 30 L560 130 V340 C560 500 450 610 300 670 C150 610 40 500 40 340 V130 Z" fill="none" stroke="var(--a)" stroke-width="16" style="--len:2000;--d:${h.T(.03)}s;--du:1.4s"/>
    <path class="tr" d="M200 345 l70 70 l135 -150" fill="none" stroke="var(--sobre)" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" style="--len:420;--d:${h.T(.62)}s;--du:.6s"/></svg><div style="position:absolute;bottom:30px;left:0;right:0;text-align:center"><span class="K" style="margin:0">7 días de garantía</span></div>`;
  if (forma === 'escudo') gfx = `<svg width="600" height="700" viewBox="0 0 600 700"><path class="tr" d="M300 30 L560 130 V340 C560 500 450 610 300 670 C150 610 40 500 40 340 V130 Z" stroke="var(--a)" stroke-width="18" style="--len:2000;--d:${h.T(.03)}s;--du:1.6s"/></svg><div style="position:absolute;text-align:center"><b style="display:block;font-family:var(--ft);font-weight:var(--fw);font-size:230px;letter-spacing:-.06em;line-height:1.08" class="gn">7</b><span class="K" style="margin:0">días de garantía</span></div>`;
  el.innerHTML = `<div class="ct">${txt(sc, h, {tam: 106})}<div class="pill fade" style="--d:${h.T(.8)}s">${esc(sc.pill || "Devolución de tu dinero")}</div></div><div class="ci">${gfx}</div>`;
  for (let i = 0; i < 7; i++) fx(h.T(f0 + i * df), 'click'); fx(h.T(f0 + 7 * df), 'ding');
  const sg = [...el.querySelectorAll('.sg')], s2 = [...el.querySelectorAll('.sg2')], gn = el.querySelector('.gn');
  const sf = el.querySelector('.sf'), dts = [...el.querySelectorAll('.dt')], hl = el.querySelector('.hl');
  sc.fr = (p, lt) => { if (sf) { sf.setAttribute('opacity', .92 * cl((p - .5) / .1)); hl.setAttribute('r', 330 + Math.sin(lt * 2) * 8); dts.forEach((d, i) => d.setAttribute('opacity', p >= f0 + i * df ? 1 : .15)); }
    const n = Math.max(0, Math.min(7, Math.floor((p - f0) / df) + 1)); sg.forEach((s, i) => s.setAttribute('opacity', i < n ? 1 : 0)); s2.forEach((s, i) => s.classList.toggle('ok', i < n)); if (gn && forma === 'aro') gn.textContent = n; };
};
C.compara = (el, sc, h) => {
  const I = [['Mezclas y transiciones', 1], ['Guion para el evento', 0], ['Plan si algo falla', 0], ['Checklist antes de tocar', 0], ['Mensajes para conseguir eventos', 0]];
  const row = (t, s, d, nuevo) => `<div class="fade" style="--d:${d}s;display:flex;align-items:center;gap:22px;height:92px;border-bottom:1px solid var(--linea);font-size:34px;font-weight:700;${s ? '' : 'color:var(--mut)'}"><i style="width:44px;height:44px;border-radius:50%;flex:none;display:grid;place-items:center;font-style:normal;font-weight:900;font-size:26px;background:${s ? (nuevo ? 'var(--c)' : 'var(--a)') : 'var(--linea)'};color:${s ? 'var(--sobre)' : 'var(--mut)'}">${s ? '✓' : '—'}</i>${t}</div>`;
  el.style.padding = '0'; el.innerHTML = `<div style="position:absolute;left:0;top:0;bottom:0;width:960px;padding:120px 100px"><div class="K fade" style="--d:${h.T(.02)}s">Solo con tu curso</div><h1 class="T rv" style="--d:${h.T(.04)}s;--fs:68px;height:160px">Sabes mezclar.</h1>${I.map(([t, s], i) => row(t, s, h.T(.1 + i * .05), 0)).join('')}</div><div class="cr" style="position:absolute;right:0;top:0;bottom:0;width:960px;padding:120px 100px;background:var(--sup);border-left:5px solid var(--a)"><div class="K fade" style="--d:${h.T(.46)}s;color:var(--a)">Curso + Súper Pack DJ</div><h1 class="T rv" style="--d:${h.T(.48)}s;--fs:62px;height:160px">${tx('Sabes mezclar *y llegas preparado.*')}</h1>${I.map(([t, s], i) => row(t, 1, h.T(.56 + i * .07), !s)).join('')}</div>`;
  const cr = el.querySelector('.cr'); fx(h.T(.42), 'whoosh'); I.forEach((_, i) => fx(h.T(.56 + i * .07), 'pop'));
  sc.fr = (p) => { cr.style.clipPath = `inset(0 0 0 ${(1 - io((p - .4) / .08)) * 100}%)`; };
};
C.historia = (el, sc, h) => {
  const der = sc.lado === 'der'; el.style.padding = '0'; el.style.color = '#fff';
  el.innerHTML = `<div class="ft" style="position:absolute;inset:-60px;background:url(${A}${sc.fondo || 'f_cuarto'}.jpg) center/cover"></div><div style="position:absolute;inset:0;background:linear-gradient(${der ? 270 : 90}deg,rgba(6,5,14,.94) 0%,rgba(6,5,14,.6) 46%,transparent 76%)"></div><img class="ent" src="${A}${sc.img}.png" style="--d:${h.T(.03)}s;--dx:${der ? -120 : 120}px;position:absolute;bottom:${E.marco && E.marco.includes('cine') ? 84 : 40}px;${der ? 'left' : 'right'}:110px;height:860px;filter:drop-shadow(0 40px 60px rgba(0,0,0,.7))" alt=""><div style="position:absolute;top:0;bottom:0;${der ? 'right' : 'left'}:130px;width:820px;display:flex;flex-direction:column;justify-content:center;--mut:#d8d4ea;--ink:#fff">${txt(Object.assign({k: 'Historia de ejemplo'}, sc), h, {tam: 96})}</div>`;
  const ft = el.querySelector('.ft'); sc.fr = (p) => { ft.style.transform = `scale(${1.02 + .1 * p}) translateX(${(der ? 1 : -1) * 30 * p}px)`; };
};
C.etapas = (el, sc, h) => {
  el.classList.add('cen'); const Pz = sc.pasos || [['Lo que ya compraste', 'Tu curso DJ Profesional'], ['Tu siguiente paso', 'Súper Pack DJ'], ['Lo que puedes construir', 'Eventos mejor preparados']];
  el.innerHTML = `<div class="blk" style="width:100%;max-width:none">${txt(sc, h, {tam: 78})}<div style="display:flex;gap:40px;margin-top:70px;text-align:left;position:relative"><div style="position:absolute;left:0;right:0;top:36px;height:6px;background:var(--linea)"><div class="ln" style="height:100%;width:0;background:var(--a)"></div></div>${Pz.map(([a, b], i) => `<div class="fade" style="--d:${h.T(.18 + i * .24)}s;flex:1;position:relative"><i style="display:grid;place-items:center;width:78px;height:78px;border-radius:50%;background:${i === 1 ? 'var(--a)' : 'var(--bg)'};border:5px solid var(--a);color:${i === 1 ? 'var(--sobre)' : 'var(--ink)'};font-style:normal;font-family:var(--ft);font-weight:var(--fw);font-size:34px">${i + 1}</i><div class="K" style="margin:30px 0 10px">${a}</div><div style="font-family:var(--ft);font-weight:var(--fw);font-size:52px;letter-spacing:var(--ls);line-height:1.08;text-transform:var(--tt)">${b}</div></div>`).join('')}</div></div>`;
  const ln = el.querySelector('.ln'); Pz.forEach((_, i) => fx(h.T(.18 + i * .24), 'pop')); sc.fr = (p) => { ln.style.width = (io((p - .15) / .6) * 100) + '%'; };
};
C.lista = (el, sc, h) => {
  const n = sc.items.length, body = `${txt(sc, h, {tam: 100})}<div style="margin-top:40px">${sc.items.map((t, i) => `<div class="fade" style="--d:${h.T(.22 + i * (.66 / n))}s;display:flex;align-items:center;gap:24px;font-size:42px;font-weight:700;height:86px"><i style="flex:none;width:18px;height:18px;border-radius:50%;background:var(--a)"></i><span>${tx(t)}</span></div>`).join('')}</div>`;
  sc.items.forEach((_, i) => fx(h.T(.22 + i * (.66 / n)), 'pop'));
  if (sc.img) { lado(el, h.i); el.innerHTML = `<div class="ct">${body}</div><div class="ci">${img(sc.img, h.T(.04), sc.deco === undefined ? E.deco : sc.deco)}</div>`; } else { el.classList.add('izq'); el.innerHTML = `<div class="blk">${body}</div>`; }
};
C.cta = (el, sc, h) => {
  lado(el, 0);
  el.innerHTML = `<div class="ct">${txt(sc, h, {tam: 98})}<div class="fade" style="--d:${h.T(.3)}s;display:flex;align-items:baseline;gap:24px;margin-top:26px"><s style="font-size:56px;color:var(--mut);font-weight:700">$120</s><b style="font-family:var(--ft);font-weight:var(--fw);font-size:170px;letter-spacing:-.05em;color:var(--c);line-height:1">$12</b><span style="font-size:28px;font-weight:800;color:var(--mut)">USD · solo en<br>esta página</span></div><div class="btn pop" style="--d:${h.T(.55)}s">${esc(sc.boton || 'Sí, quiero mi Súper Pack DJ')}<svg class="fl" width="40" height="46" viewBox="0 0 40 46"><path d="M20 4 V38 M6 26 L20 40 L34 26" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg></div><div class="fade" style="--d:${h.T(.75)}s;margin-top:30px;font-size:27px;font-weight:700;color:var(--mut)">7 días de garantía · Acceso inmediato y de por vida</div></div><div class="ci">${img(sc.img || 'pack_' + MS, h.T(.04), E.deco)}</div>`;
  const btn = el.querySelector('.btn'), fl = el.querySelector('.fl'); fx(h.T(.55), 'golpe');
  sc.fr = (p, lt) => { btn.style.scale = 1 + .025 * Math.sin(lt * 4.2); fl.style.translate = `0 ${Math.abs(Math.sin(lt * 4.2)) * 8}px`; };
};

// ---------- escenas del estilo "El camino del DJ" (correcciones de Christian, 15 nov 2026) ----------
const A2 = V.assets2 || '../../assets/curso-dj/';
const CK = (d) => `<svg width="120" height="120" viewBox="0 0 230 230" style="margin-bottom:22px"><circle class="tr" cx="115" cy="115" r="100" stroke="var(--a)" stroke-width="12" style="--len:630;--d:${d}s;--du:1s" transform="rotate(-90 115 115)"/><path class="tr" d="M70 118 l32 32 l60 -66" stroke="var(--a)" stroke-width="14" style="--len:160;--d:${d + .7}s;--du:.5s"/></svg>`;
const FAN = (d, alto, ancho, extra = '') => ['m1', 'm2', 'm3', 'm4'].map((m, i) => `<img class="pop" src="${A2}${m}.png" style="--d:${(d + i * .12).toFixed(2)}s;position:absolute;left:${i * ancho}px;bottom:0;height:${alto}px;rotate:${(i - 1.5) * 5}deg;transform-origin:50% 100%;filter:drop-shadow(0 24px 30px rgba(0,0,0,.45));z-index:${i}${extra}" alt="">`).join('');
C.gracias = (el, sc, h) => {
  el.classList.add('dos'); fx(h.T(.02) + .8, 'ding');
  const M = PR.mods;
  el.innerHTML = `<div class="ct" style="flex:0 0 700px">${CK(h.T(.02))}${txt(sc, h, {tam: 96, t: .1})}<div class="chips">${M.map((m, i) => `<span class="fade" style="--d:${h.T(.35 + i * .08)}s">${m}</span>`).join('')}<span class="fade" style="--d:${h.T(.67)}s;border-color:var(--a);color:var(--a)">Certificado</span></div></div>
    <div style="flex:1;position:relative;height:820px"><div class="flo" style="position:absolute;left:30px;right:0;top:40px;height:560px">${FAN(h.T(.08), 430, 178)}</div>
      <img class="pop flo" src="${A2}consola.png" style="--d:${h.T(.42)}s;position:absolute;left:120px;bottom:40px;width:700px;filter:drop-shadow(0 30px 40px rgba(0,0,0,.5));z-index:9" alt="">
      <img class="pop" src="${A2}cert.png" style="--d:${h.T(.55)}s;position:absolute;right:-40px;bottom:170px;width:300px;rotate:8deg;filter:drop-shadow(0 20px 30px rgba(0,0,0,.45));z-index:10" alt=""></div>`;
};
const ICO = {
  cobrar: `<svg width="230" height="200" viewBox="0 0 230 200">${[0, 1, 2, 3, 4].map((k) => `<g class="cn" data-k="${k}"><ellipse cx="${k < 3 ? 80 : 150}" cy="${170 - (k < 3 ? k : k - 3) * 26}" rx="58" ry="20" fill="var(--a)" stroke="var(--bg)" stroke-width="4"/><ellipse cx="${k < 3 ? 80 : 150}" cy="${162 - (k < 3 ? k : k - 3) * 26}" rx="58" ry="20" fill="var(--c)" stroke="var(--bg)" stroke-width="3"/><text x="${k < 3 ? 80 : 150}" y="${172 - (k < 3 ? k : k - 3) * 26}" text-anchor="middle" font-size="26" font-weight="900" fill="var(--bg)" font-family="var(--ft)">$</text></g>`).join('')}</svg>`,
  crecer: `<svg width="240" height="210" viewBox="0 0 240 210">${[0, 1, 2, 3].map((k) => `<rect class="br" data-k="${k}" x="${18 + k * 54}" y="${190 - (50 + k * 40)}" width="40" height="${50 + k * 40}" rx="8" fill="var(--a)" opacity="${.45 + k * .18}"/>`).join('')}<path class="ar" d="M14 150 L80 105 L130 120 L214 34" fill="none" stroke="var(--c)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path class="ar2" d="M180 30 L216 32 L212 68" fill="none" stroke="var(--c)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};
C.escalera = (el, sc, h) => {
  el.style.padding = '0';
  const P = [['Aprender', 'Tu curso', `<img src="${A2}m2.png" style="height:235px;filter:drop-shadow(0 16px 20px rgba(0,0,0,.45))" alt="">`],
    ['Practicar', 'Tu curso', `<img src="${A2}consola.png" style="max-width:310px;max-height:215px;object-fit:contain;filter:drop-shadow(0 16px 20px rgba(0,0,0,.45))" alt="">`],
    ['Conseguir clientes', 'Súper Pack DJ', `<img src="${A}c${CONT.length - 1}_${MS}.png" style="height:225px;filter:drop-shadow(0 16px 20px rgba(0,0,0,.45))" alt="">`],
    ['Cobrar', 'Súper Pack DJ', ICO.cobrar], ['Crecer', 'Súper Pack DJ', ICO.crecer]];
  (PR.camino || []).forEach((x, i) => { if (x && P[i]) P[i][0] = x; });
  if (sc.imgs) sc.imgs.forEach((x, i) => { if (x) P[i][2] = `<img src="${A}${x[0]}.png" style="height:${x[1]}px;max-width:330px;object-fit:contain;filter:drop-shadow(0 16px 20px rgba(0,0,0,.4))" alt="">`; });
  const X = (i) => 130 + i * 336, W = 318, HH = (i) => sc.imgs ? 150 + i * 104 : 170 + i * 118, BOT = 930;
  el.innerHTML = `<div style="position:absolute;left:130px;top:96px;width:900px">${txt(sc, h, {tam: 92})}</div>
    ${P.map(([n, g, ic], i) => `<div class="st" style="position:absolute;left:${X(i)}px;width:${W}px;top:${BOT - HH(i)}px;height:${HH(i)}px;border-radius:22px 22px 0 0;background:${i < 2 ? 'var(--sup)' : 'linear-gradient(180deg,var(--a),var(--b))'};border:2px solid ${i < 2 ? 'var(--linea)' : 'transparent'};transform-origin:50% 100%;padding:22px 24px">
      <div style="font-family:var(--ft);font-weight:var(--fw);font-size:34px;line-height:1.05;letter-spacing:var(--ls);color:${i < 2 ? 'var(--ink)' : 'var(--sobre)'}">${n}</div>
      <div style="margin-top:6px;font-weight:800;font-size:19px;letter-spacing:.12em;text-transform:uppercase;color:${i < 2 ? 'var(--mut)' : 'var(--sobre)'};opacity:.85">${i < 2 ? '✓ ' : ''}${g}</div></div>
      <div class="sti" style="position:absolute;left:${X(i)}px;width:${W}px;top:${BOT - HH(i) - (sc.imgs ? 280 : 230)}px;height:${sc.imgs ? 272 : 220}px;display:grid;place-items:end center">${ic}</div>`).join('')}
    <div class="gl" style="position:absolute;left:${X(0)}px;width:${X(1) + W - X(0)}px;top:${BOT + 22}px;border-top:3px solid var(--mut);padding-top:12px;font-weight:800;font-size:24px;color:var(--mut)">Con tu curso DJ Profesional</div>
    <div class="gl" style="position:absolute;left:${X(2)}px;width:${X(4) + W - X(2)}px;top:${BOT + 22}px;border-top:3px solid var(--a);padding-top:12px;font-weight:800;font-size:24px;color:var(--a)">Con el Súper Pack DJ</div>`;
  const st = [...el.querySelectorAll('.st')], si = [...el.querySelectorAll('.sti')], gl = [...el.querySelectorAll('.gl')], cn = [...el.querySelectorAll('.cn')], brs = [...el.querySelectorAll('.br')], ar = el.querySelectorAll('.ar,.ar2');
  const T0 = sc.pasoT || [.1, .24, .44, .6, .74];
  T0.forEach((x) => fx(h.T(x), 'pop'));
  sc.fr = (p) => {
    st.forEach((s, i) => { const k = out((p - T0[i]) / .08); s.style.transform = `scaleY(${k})`; s.style.opacity = k > 0 ? 1 : 0; });
    si.forEach((s, i) => { const k = out((p - T0[i] - .04) / .09); s.style.opacity = k; s.style.transform = `translateY(${(1 - k) * 40}px) scale(${.85 + .15 * k})`; });
    gl[0].style.opacity = cl((p - .3) / .05); gl[1].style.opacity = cl((p - .5) / .05);
    cn.forEach((c) => { const k = +c.dataset.k, u = out((p - T0[3] - .02 - k * .02) / .05); c.style.transform = `translateY(${(1 - u) * -120}px)`; c.style.opacity = u; });
    brs.forEach((b) => { const k = +b.dataset.k, u = out((p - T0[4] - .02 - k * .02) / .05); b.style.transformOrigin = '50% 100%'; b.style.transformBox = 'fill-box'; b.style.transform = `scaleY(${u})`; });
    ar.forEach((a) => { const L = 320; a.style.strokeDasharray = L; a.style.strokeDashoffset = L * (1 - io((p - T0[4] - .08) / .1)); });
  };
};
D.mezcla = (ci, sc, h) => {
  const bar = (n, s) => [...Array(n)].map((_, k) => `<i style="height:${18 + Math.abs(Math.sin(k * .9 + s) * Math.sin(k * .27 + s)) * 80}px"></i>`).join('');
  ci.innerHTML = `<div style="width:640px;padding:30px 32px;border-radius:28px;background:var(--sup);border:2px solid var(--linea)"><div class="ej" style="position:static;text-align:right;margin-bottom:6px">Ejemplo</div>
    ${['A', 'B'].map((x, j) => `<div class="pz${j}" style="display:flex;align-items:center;gap:16px;height:120px"><b style="width:40px;font-family:var(--ft);font-size:34px;color:${j ? 'var(--a)' : 'var(--ink)'}">${x}</b><div style="flex:1;display:flex;align-items:center;gap:4px">${bar(34, j * 2)}</div></div>`).join('')}
    <div style="display:flex;gap:12px;margin-top:16px">${['Intro', 'Corte', 'Transición'].map((x) => `<span class="mz" style="flex:1;text-align:center;padding:12px;border-radius:14px;border:2px solid var(--linea);font-weight:800;font-size:24px">${x}</span>`).join('')}</div></div>`;
  ci.querySelectorAll('.pz0 i,.pz1 i').forEach((i) => { i.style.cssText += ';flex:1;border-radius:4px;background:currentColor'; });
  ci.querySelector('.pz1').style.color = 'var(--a)';
  const a = ci.querySelector('.pz0'), b = ci.querySelector('.pz1'), mz = [...ci.querySelectorAll('.mz')];
  [.25, .45, .65].forEach((x) => fx(h.T(x), 'click'));
  sc.fr = (p) => { const k = io((p - .3) / .5); a.style.opacity = 1 - .7 * k; b.style.opacity = .3 + .7 * k; mz.forEach((m, i) => { const on = p >= .25 + i * .2; m.style.background = on ? 'var(--a)' : 'transparent'; m.style.color = on ? 'var(--sobre)' : 'var(--ink)'; m.style.borderColor = on ? 'var(--a)' : 'var(--linea)'; }); };
};
D.pista = (ci, sc, h) => {
  ci.innerHTML = `<div style="width:600px;padding:30px 32px 34px;border-radius:28px;background:var(--sup);border:2px solid var(--linea);text-align:center"><div class="ej" style="position:static;text-align:right">Ejemplo</div>
    <svg width="440" height="250" viewBox="0 0 440 250"><path d="M40 220 A180 180 0 0 1 400 220" fill="none" stroke="var(--linea)" stroke-width="34" stroke-linecap="round"/><path class="gz" d="M40 220 A180 180 0 0 1 400 220" fill="none" stroke="var(--a)" stroke-width="34" stroke-linecap="round" stroke-dasharray="566" stroke-dashoffset="566"/><line class="ag" x1="220" y1="220" x2="220" y2="70" stroke="var(--ink)" stroke-width="10" stroke-linecap="round"/><circle cx="220" cy="220" r="16" fill="var(--ink)"/></svg>
    <div style="font-weight:800;font-size:24px;letter-spacing:.12em;text-transform:uppercase;color:var(--mut)">Energía de la pista</div>
    <div class="lp" style="margin-top:14px;font-family:var(--ft);font-weight:var(--fw);font-size:40px">Observa</div></div>`;
  const gz = ci.querySelector('.gz'), ag = ci.querySelector('.ag'), lp = ci.querySelector('.lp'), L = ['Observa', 'Decide', 'Sube la energía'];
  [.2, .45, .7].forEach((x) => fx(h.T(x), 'click'));
  sc.fr = (p) => { const k = io((p - .2) / .6), v = .18 + .74 * k + Math.sin(p * 30) * .015; gz.style.strokeDashoffset = 566 * (1 - v); ag.setAttribute('transform', `rotate(${-90 + 180 * v} 220 220)`); lp.textContent = L[p < .45 ? 0 : p < .7 ? 1 : 2]; };
};
const DEMO = {0: 'curva', 1: 'kit', 2: 'checklist', 3: 'mezcla', 4: 'pista', 5: 'plan', 6: 'chat'};
const DZ = {0: .55, 1: .7, 2: .68, 3: .66, 4: .7, 5: .62, 6: .75};
C.tool2 = (el, sc, h) => {
  const i = sc.i, c = CONT[i]; el.classList.add('dos'); if ((E.lado === 'izq') !== (!!E.alterna && h.i % 2 === 1)) el.classList.add('inv');
  sc.k = sc.k || `${PR.etiqueta || 'Herramienta'} ${i + 1} de ${CONT.length}`; sc.t = sc.t || c[0];
  el.innerHTML = `<div class="ct" style="flex:0 0 620px">${txt(sc, h, {tam: 84, s: .32})}<div class="chip fade" style="--d:${h.T(.6)}s">Valor <b>$${c[1]}</b></div></div>
    <div style="flex:1;position:relative;height:860px;display:flex;align-items:center;gap:28px">${E.lado2 ? '' : `<div class="deco d-${E.deco || 'flota'}" style="right:auto;width:520px"><i></i><b></b></div>`}<div style="flex:0 0 440px;height:820px;display:grid;place-items:center;position:relative"><img class="im flo pop" src="${A}c${i}_${MS}.png" style="--d:${h.T(.02)}s;max-height:620px;max-width:420px" alt=""></div>
      <div class="dm ent" style="--d:${h.T(.18)}s;--dx:90px;flex:1;height:820px;display:grid;place-items:center;position:relative"><div class="dmi" style="transform:scale(${sc.dz || DZ[i] || .74});transform-origin:50% 50%"></div></div></div>`;
  D[sc.demo || (PR.cont ? 'checklist' : DEMO[i])](el.querySelector('.dmi'), sc, h); fx(h.T(.6), 'pop');
};
C.todas = (el, sc, h) => {
  el.style.padding = '0';
  el.innerHTML = `<div style="position:absolute;left:0;right:0;top:80px;text-align:center">${txt(sc, h, {tam: 84})}</div>
    <img class="pk pop" src="${A}pack_${MS}.png" style="--d:${h.T(.02)}s;position:absolute;left:50%;top:600px;height:440px;translate:-50% -50%;filter:drop-shadow(0 40px 50px rgba(0,0,0,.55));z-index:50" alt="">
    ${CONT.map((_, i) => `<img class="o" src="${A}c${i}_${MS}.png" style="position:absolute;left:0;top:0;height:260px;max-width:280px;object-fit:contain;filter:drop-shadow(0 20px 26px rgba(0,0,0,.45))" alt="">`).join('')}
    <div class="chip tt" style="position:absolute;left:50%;top:${E.todasChip || 210}px;translate:-50% 0;margin:0;font-size:32px;background:var(--bg);z-index:100">Valor de referencia <b>$120</b></div>`;
  const os = [...el.querySelectorAll('.o')], tt = el.querySelector('.tt'); CONT.forEach((_, i) => fx(h.T(.06 + i * .07), 'whoosh'));
  sc.fr = (p, lt) => {
    os.forEach((o, i) => { const k = out((p - .06 - i * .07) / .12), a = i / os.length * Math.PI * 2 + lt * .18 - Math.PI / 2, x = 960 + Math.cos(a) * 690, y = 660 + Math.sin(a) * 250, z = Math.sin(a), sx = (i % 2 ? 1 : -1) * 1400, sy = -600;
      const px = x + (1 - k) * sx, py = y + (1 - k) * sy, s = .72 + .3 * (z + 1) / 2; o.style.transform = `translate(${px - 140}px,${py - 130}px) scale(${s})`; o.style.opacity = k; o.style.zIndex = z > .2 ? 60 : 10; });
    tt.style.opacity = cl((p - .65) / .08);
  };
};
C.etapas2 = (el, sc, h) => {
  el.classList.add('cen');
  const col = (i, img, k, b, s) => `<div class="fade" style="--d:${h.T(.12 + i * .24)}s;flex:1;text-align:left"><div style="position:relative;height:440px;border-radius:26px;background:var(--sup);border:2px solid ${i === 1 ? 'var(--a)' : 'var(--linea)'};overflow:hidden">${img}</div>
    <div class="K" style="margin:22px 0 8px;color:${i === 1 ? 'var(--a)' : 'var(--mut)'}">${i + 1} · ${k}</div><div style="font-family:var(--ft);font-weight:var(--fw);font-size:44px;letter-spacing:var(--ls);line-height:1.08">${b}</div><div style="font-size:26px;color:var(--mut);margin-top:10px;line-height:1.3">${s}</div></div>`;
  el.innerHTML = `<div style="width:100%">${txt(sc, h, {tam: 80})}<div style="display:flex;gap:56px;margin-top:46px;align-items:flex-start">
    ${col(0, `<div style="position:absolute;left:30px;right:0;top:50px;height:360px">${FAN(h.T(.14), 330, 100)}</div>`, 'Lo que ya compraste', 'Curso DJ Profesional', 'Aprendes y practicas.')}
    ${col(1, `<img src="${A}pack_${MS}.png" style="position:absolute;left:50%;top:50%;translate:-50% -50%;height:390px;filter:drop-shadow(0 20px 26px rgba(0,0,0,.45))" alt="">`, 'Lo que puedes sumar hoy', 'Súper Pack DJ', 'Las 7 herramientas.')}
    ${col(2, `<img src="${A}f_evento.jpg" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" alt=""><div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 40%,rgba(0,0,0,.6))"></div><span class="chip" style="position:absolute;left:18px;bottom:18px;margin:0;font-size:22px;background:rgba(0,0,0,.55);border-color:rgba(255,255,255,.4);color:#fff">Ejemplo</span>`, 'Lo que puedes construir', 'Más preparado para tus eventos', 'Conseguir clientes, cobrar y crecer.')}</div></div>`;
  [0, 1, 2].forEach((i) => fx(h.T(.12 + i * .24), 'pop'));
};
C.alumnos = (el, sc, h) => {
  el.classList.add('dos');
  const N = 96, cs = [...Array(N)].map((_, k) => `<svg class="av" width="62" height="62" viewBox="0 0 62 62"><circle cx="31" cy="22" r="12" fill="currentColor"/><path d="M8 58 C10 40 52 40 54 58 Z" fill="currentColor"/></svg>`).join('');
  el.innerHTML = `<div class="ct" style="flex:0 0 720px">${sc.k ? `<div class="K fade" style="--d:${h.T(.02)}s">${esc(sc.k)}</div>` : ''}<div class="cnt" style="font-family:var(--ft);font-weight:var(--fw);font-size:200px;letter-spacing:-.05em;line-height:.95;color:var(--a)">0</div><h1 class="T rv" style="--d:${h.T(.15)}s;--fs:64px;margin-top:14px">${tx(sc.t)}</h1></div>
    <div style="flex:1;position:relative;height:760px;border-radius:30px;background:var(--sup);border:2px solid var(--linea);padding:34px;display:flex;flex-wrap:wrap;gap:10px;align-content:center;justify-content:center;overflow:hidden">${cs}
      <img class="flo" src="${A}prop1.png" style="position:absolute;right:-30px;top:-20px;height:250px;rotate:12deg;filter:drop-shadow(0 20px 26px rgba(0,0,0,.5))" alt=""><img class="flo" src="${A2}m3.png" style="position:absolute;left:-20px;bottom:-30px;height:250px;rotate:-10deg;filter:drop-shadow(0 20px 26px rgba(0,0,0,.5))" alt=""></div>`;
  const cnt = el.querySelector('.cnt'), av = [...el.querySelectorAll('.av')], ord = av.map((_, k) => (k * 37) % N);
  fx(h.T(.75), 'ding');
  sc.fr = (p) => { const k = io((p - .05) / .7); cnt.textContent = Math.round(PR.alumnos * k).toLocaleString('en-US'); av.forEach((a, j) => { const on = ord[j] / N < k; a.style.color = on ? (j % 5 === 0 ? 'var(--b)' : 'var(--a)') : 'var(--linea)'; a.style.transform = `scale(${on ? 1 : .8})`; }); };
};
C.porque = (el, sc, h) => {
  el.style.padding = '0';
  el.innerHTML = `<div style="position:absolute;left:130px;right:130px;top:90px;text-align:center">${txt(sc, h, {tam: 80})}</div>
    <div class="ca" style="position:absolute;left:170px;top:420px;width:620px;height:460px">${FAN(h.T(.12), 380, 140)}</div>
    <div class="fade" style="--d:${h.T(.12)}s;position:absolute;left:170px;top:910px;width:620px;text-align:center;font-weight:800;font-size:28px;color:var(--mut)">Tu compra: DJ Profesional</div>
    <svg class="pop" style="--d:${h.T(.4)}s;position:absolute;left:910px;top:590px" width="100" height="100" viewBox="0 0 100 100"><path d="M50 14 V86 M14 50 H86" stroke="var(--a)" stroke-width="14" stroke-linecap="round"/></svg>
    <img class="pop flo" src="${A}pack_${MS}.png" style="--d:${h.T(.5)}s;position:absolute;left:1130px;top:380px;height:500px;filter:drop-shadow(0 40px 50px rgba(0,0,0,.55))" alt="">
    <div class="fade" style="--d:${h.T(.58)}s;position:absolute;left:1080px;top:910px;width:620px;text-align:center;font-weight:800;font-size:28px;color:var(--a)">Desbloqueado: Súper Pack DJ</div>`;
  fx(h.T(.5), 'click');
};
C.inversion = (el, sc, h) => {
  el.classList.add('dos', 'inv');
  el.innerHTML = `<div class="ct" style="flex:0 0 700px">${txt(sc, h, {tam: 92})}</div>
    <div style="flex:1;position:relative;height:760px"><svg width="900" height="760" viewBox="0 0 900 760" style="position:absolute;left:0;top:0;overflow:visible">
      <path d="M450 700 L450 300" stroke="var(--mut)" stroke-width="16" stroke-linecap="round"/><path d="M360 712 H540" stroke="var(--mut)" stroke-width="18" stroke-linecap="round"/>
      <g class="bm"><line x1="110" y1="300" x2="790" y2="300" stroke="var(--ink)" stroke-width="14" stroke-linecap="round"/>
        <g class="pl"><line x1="110" y1="300" x2="110" y2="400" stroke="var(--mut)" stroke-width="5"/><rect x="0" y="400" width="220" height="150" rx="24" fill="var(--sup)" stroke="var(--linea)" stroke-width="3"/><text x="110" y="470" text-anchor="middle" font-family="var(--ft)" font-weight="900" font-size="66" fill="var(--c)">$12</text><text x="110" y="515" text-anchor="middle" font-size="24" font-weight="800" fill="var(--mut)">Súper Pack DJ</text></g>
        <g class="pr"><line x1="790" y1="300" x2="790" y2="400" stroke="var(--mut)" stroke-width="5"/><g class="ev"><rect x="680" y="400" width="220" height="190" rx="24" fill="var(--a)"/><rect x="680" y="400" width="220" height="52" rx="24" fill="var(--b)"/><text x="790" y="510" text-anchor="middle" font-family="var(--ft)" font-weight="900" font-size="60" fill="var(--sobre)">1</text><text x="790" y="556" text-anchor="middle" font-size="26" font-weight="800" fill="var(--sobre)">evento</text></g></g></g>
      <circle cx="450" cy="300" r="22" fill="var(--ink)"/></svg></div>`;
  const bm = el.querySelector('.bm'), pl = el.querySelector('.pl'), pr = el.querySelector('.pr'), ev = el.querySelector('.ev');
  fx(h.T(.35), 'golpe');
  sc.fr = (p) => { const d = out((p - .3) / .12), a = d * 14 - 0 + (1 - d) * -10; ev.style.transform = `translateY(${(1 - out((p - .2) / .12)) * -500}px)`; ev.style.opacity = cl((p - .2) / .05);
    bm.setAttribute('transform', `rotate(${a} 450 300)`); pl.setAttribute('transform', `rotate(${-a} 110 300)`); pr.setAttribute('transform', `rotate(${-a} 790 300)`); };
};
C.exclusiva = (el, sc, h) => {
  el.classList.add('dos');
  el.innerHTML = `<div class="ct" style="flex:0 0 720px">${txt(sc, h, {tam: 92})}</div>
    <div style="flex:1;position:relative;height:760px"><div class="pop" style="--d:${h.T(.04)}s;position:absolute;inset:76px 0 150px 20px;border-radius:26px;background:var(--sup);border:2px solid var(--linea);overflow:hidden">
      <div style="height:64px;display:flex;align-items:center;gap:12px;padding:0 26px;border-bottom:2px solid var(--linea)"><i style="width:16px;height:16px;border-radius:50%;background:var(--b)"></i><i style="width:16px;height:16px;border-radius:50%;background:var(--linea)"></i><i style="width:16px;height:16px;border-radius:50%;background:var(--linea)"></i><span style="margin-left:14px;flex:1;height:30px;border-radius:15px;background:var(--linea)"></span></div>
      <img src="${A}pack_${MS}.png" style="position:absolute;left:40px;top:110px;height:400px;filter:drop-shadow(0 20px 26px rgba(0,0,0,.45))" alt="">
      <div style="position:absolute;right:40px;top:150px;width:330px"><div style="height:26px;width:80%;border-radius:13px;background:var(--linea)"></div><div style="height:26px;width:60%;border-radius:13px;background:var(--linea);margin-top:16px"></div><div style="font-family:var(--ft);font-weight:var(--fw);font-size:96px;color:var(--c);margin-top:30px;letter-spacing:-.04em">$12</div><div style="margin-top:26px;padding:22px;border-radius:16px;background:var(--a);color:var(--sobre);font-weight:900;font-size:26px;text-align:center">Agregar a mi compra</div></div></div>
      <div class="chip bd2" style="position:absolute;left:20px;top:0;margin:0;font-size:30px;background:var(--a);color:var(--sobre);border-color:var(--a)">Solo en esta página</div>
      <div class="ad" style="position:absolute;left:20px;right:0;bottom:0;padding:22px 26px;border-radius:20px;background:var(--bg);border:2px solid var(--b);font-weight:800;font-size:27px;line-height:1.3">Si sales de esta página, podrías no volver a verla.</div></div>`;
  const bd = el.querySelector('.bd2'), ad = el.querySelector('.ad'); fx(h.T(.3), 'pop'); fx(h.T(.6), 'click');
  sc.fr = (p) => { bd.style.opacity = cl((p - .3) / .05); bd.style.transform = `scale(${.8 + .2 * out((p - .3) / .08)})`; ad.style.opacity = cl((p - .6) / .06); ad.style.transform = `translateY(${(1 - out((p - .6) / .1)) * 40}px)`; };
};

// ---------- escenas del estilo "Compra confirmada" (correcciones de Christian, 15 nov 2026) ----------
const IM = (f, st = '') => `<img src="${A}${f}.png" style="filter:drop-shadow(0 22px 28px rgba(0,0,0,.35));${st}" alt="">`;
C.revela = (el, sc, h) => {
  el.classList.add('dos');
  el.innerHTML = `<div class="ct" style="flex:0 0 720px">${txt(sc, h, {tam: 110})}</div>
    <div style="flex:1;position:relative;height:880px"><div class="haz" style="position:absolute;left:50%;bottom:60px;width:560px;height:820px;translate:-50% 0;background:linear-gradient(0deg,var(--a),transparent);opacity:0;border-radius:50% 50% 0 0/20% 20% 0 0;filter:blur(30px)"></div>
      ${CONT.map((_, i) => `<img class="fa" src="${A}c${i}_${MS}.png" style="position:absolute;left:50%;top:52%;height:250px;max-width:260px;object-fit:contain;filter:drop-shadow(0 20px 24px rgba(0,0,0,.4));opacity:0" alt="">`).join('')}
      <div class="pk" style="position:absolute;left:0;right:0;bottom:90px;display:flex;justify-content:center;z-index:20"><img class="flo" src="${A}pack_${MS}.png" style="max-height:520px;max-width:600px;filter:drop-shadow(0 40px 50px rgba(0,0,0,.5))" alt=""></div></div>`;
  const pk = el.querySelector('.pk'), haz = el.querySelector('.haz'), fa = [...el.querySelectorAll('.fa')]; fx(h.T(.05), 'riser'); fx(h.T(.25), 'golpe');
  sc.fr = (p) => { const k = out((p - .05) / .2); pk.style.transform = `translateY(${(1 - k) * 700}px)`; haz.style.opacity = .55 * k * (1 - .4 * cl((p - .5) / .3));
    fa.forEach((f, i) => { const u = out((p - .3 - i * .04) / .14), a = (-62 + i * 124 / Math.max(1, fa.length - 1)) * Math.PI / 180, r = 360 * u; f.style.opacity = u; f.style.transform = `translate(calc(-50% + ${Math.sin(a) * r}px), calc(-50% + ${-Math.cos(a) * r * .75 - 40}px)) scale(${.55 + .25 * u}) rotate(${(i - 3) * 6}deg)`; }); };
};
C.recorrido = (el, sc, h) => {
  el.classList.add('cen');
  const K = sc.pasos, n = K.length;
  el.innerHTML = `<div style="width:100%">${txt(sc, h, {tam: 80})}<div style="display:flex;gap:28px;margin-top:50px;align-items:stretch">${K.map((x, i) => `<div class="rc" style="flex:1;opacity:0;text-align:left">
      <div style="position:relative;height:430px;border-radius:26px;overflow:hidden;background:${x.bg ? `url(${A}${x.bg}.jpg) center/cover` : 'var(--sup)'};border:2px solid ${i === n - 1 ? 'var(--a)' : 'var(--linea)'}">${x.bg ? '<div style="position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(0,0,0,.55))"></div>' : ''}
        <img src="${A}${x.img}.png" style="position:absolute;left:50%;bottom:${x.bg ? 0 : 24}px;translate:-50% 0;height:${x.h || 380}px;max-width:94%;object-fit:contain;filter:drop-shadow(0 20px 26px rgba(0,0,0,.45))" alt="">
</div>
      <div style="display:flex;gap:14px;align-items:flex-start;margin-top:20px"><span style="flex:none;width:50px;height:50px;border-radius:50%;background:var(--a);color:var(--sobre);display:grid;place-items:center;font-family:var(--ft);font-weight:var(--fw);font-size:26px">${i + 1}</span><span style="font-family:var(--ft);font-weight:var(--fw);font-size:36px;letter-spacing:var(--ls);line-height:1.12">${x.t}</span></div></div>`).join('')}</div></div>`;
  const rc = [...el.querySelectorAll('.rc')], T0 = sc.pt || K.map((_, i) => .12 + i * .2); T0.forEach((x) => fx(h.T(x), 'pop'));
  sc.fr = (p) => rc.forEach((c, i) => { const k = out((p - T0[i]) / .1); c.style.opacity = k; c.style.transform = `translateY(${(1 - k) * 60}px)`; });
};
C.multitud = (el, sc, h) => {
  el.style.padding = '0';
  const F = 9, row = (r) => 24 + r * 3; let av = '';
  for (let r = 0; r < F; r++) { const s = 34 + r * 9, y = 470 + r * r * 5.2 + r * 30, nn = row(r); for (let c = 0; c < nn; c++) { const x = (c + .5) / nn * 2020 - 50 + (r % 2) * 14; av += `<svg class="av" data-r="${r}" data-x="${x}" width="${s}" height="${s}" viewBox="0 0 62 62" style="position:absolute;left:${x - s / 2}px;top:${y}px"><circle cx="31" cy="22" r="12" fill="currentColor"/><path d="M8 58 C10 40 52 40 54 58 Z" fill="currentColor"/></svg>`; } }
  el.innerHTML = `${av}<div style="position:absolute;inset:0;background:linear-gradient(180deg,var(--bg) 6%,transparent 42%)"></div>
    <div class="lz" style="position:absolute;left:0;top:300px;width:520px;height:900px;background:radial-gradient(closest-side,var(--a),transparent);opacity:.3;filter:blur(20px)"></div>
    <img class="flo" src="${A}prop1.png" style="position:absolute;left:90px;top:120px;height:230px;rotate:-14deg;filter:drop-shadow(0 20px 26px rgba(0,0,0,.4))" alt="">
    <img class="flo" src="${A2}consola.png" style="position:absolute;right:70px;top:150px;width:330px;rotate:9deg;filter:drop-shadow(0 20px 26px rgba(0,0,0,.4))" alt="">
    <svg class="flo" style="position:absolute;left:120px;top:400px;${E.tema ? 'display:none' : ''}" width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="56" fill="var(--ink)"/><circle cx="60" cy="60" r="40" fill="none" stroke="var(--bg)" stroke-width="3" opacity=".5"/><circle cx="60" cy="60" r="16" fill="var(--a)"/></svg>
    <div style="position:absolute;left:0;right:0;top:110px;text-align:center"><div class="K fade" style="--d:${h.T(.02)}s">${esc(sc.k || 'Nuestra comunidad')}</div><div class="cnt" style="font-family:var(--ft);font-weight:var(--fw);font-size:190px;letter-spacing:-.05em;line-height:.95;color:var(--a)">0</div>
      <h1 class="T rv" style="--d:${h.T(.2)}s;--fs:62px;margin-top:10px">${tx(sc.t)}</h1></div>`;
  const cnt = el.querySelector('.cnt'), avs = [...el.querySelectorAll('.av')], lz = el.querySelector('.lz'); fx(h.T(.78), 'ding');
  sc.fr = (p, lt) => { const k = io((p - .05) / .72); cnt.textContent = (k >= 1 ? 'Más de ' : '') + Math.round(PR.alumnos * k).toLocaleString('en-US');
    const lx = 960 + Math.sin(lt * .9) * 760; lz.style.transform = `translateX(${lx - 260}px)`;
    avs.forEach((a, j) => { const r = +a.dataset.r, x = +a.dataset.x, on = ((j * 53) % avs.length) / avs.length < k, near = Math.abs(x - lx) < 240; a.style.color = on ? (near ? 'var(--c)' : (j % 7 === 0 ? 'var(--b)' : 'var(--a)')) : 'var(--linea)'; a.style.opacity = .35 + .65 * (r / F) ; a.style.transform = `translateY(${on ? Math.sin(lt * 4 + j) * 3 : 0}px)`; }); };
};
C.cta2 = (el, sc, h) => {
  el.classList.add('cen');
  el.innerHTML = `<div style="width:100%;position:relative">
    <div style="position:relative;height:430px">${CONT.map((_, i) => `<img class="mi pop" src="${A}c${i}_${MS}.png" style="--d:${h.T(.08 + i * .04)}s;position:absolute;left:${960 - 130 + (i - (CONT.length - 1) / 2) * 230 - 130}px;top:${70 + Math.abs(i - (CONT.length - 1) / 2) * 30}px;height:230px;width:260px;object-fit:contain;filter:drop-shadow(0 16px 20px rgba(0,0,0,.35))" alt="">`).join('')}
      <div class="pop" style="--d:${h.T(.02)}s;position:absolute;left:0;right:0;top:-10px;display:flex;justify-content:center;z-index:5"><img class="flo" src="${A}pack_${MS}.png" style="max-height:440px;max-width:560px;filter:drop-shadow(0 34px 44px rgba(0,0,0,.45))" alt=""></div></div>
    <h1 class="T rv" style="--d:${h.T(.2)}s;--fs:80px;margin-top:30px">${tx(sc.t)}</h1>
    <div class="fade" style="--d:${h.T(.35)}s;display:flex;justify-content:center;align-items:baseline;gap:26px;margin-top:10px"><s style="font-size:48px;color:var(--mut);font-weight:700">$120</s><b style="font-family:var(--ft);font-weight:var(--fw);font-size:120px;letter-spacing:-.05em;color:var(--c);line-height:1">$12</b><span style="font-size:28px;font-weight:800;color:var(--mut);text-align:left">USD<br>7 herramientas</span></div>
    <div class="bt pop" style="--d:${h.T(.5)}s;display:inline-flex;position:relative;overflow:hidden;align-items:center;gap:20px;margin-top:24px;padding:32px 64px;border-radius:var(--rbtn,22px);background:var(--a);color:var(--sobre);font-family:var(--ft);font-weight:var(--fw);font-size:42px;box-shadow:0 26px 60px rgba(0,0,0,.3)">${esc(sc.boton || 'Sí, quiero mi Súper Pack DJ')}<svg class="fl" width="40" height="46" viewBox="0 0 40 46"><path d="M20 4 V38 M6 26 L20 40 L34 26" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg><i class="sh" style="position:absolute;top:0;bottom:0;width:120px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent);transform:skewX(-20deg)"></i></div>
    <div class="fade" style="--d:${h.T(.7)}s;margin-top:22px;font-size:26px;font-weight:700;color:var(--mut)">7 días de garantía · ${PR.vida === false ? 'Acceso inmediato' : 'Acceso inmediato y de por vida'} · Solo en esta página</div></div>`;
  const bt = el.querySelector('.bt'), fl = el.querySelector('.fl'), sh = el.querySelector('.sh'); fx(h.T(.5), 'golpe');
  sc.fr = (p, lt) => { bt.style.scale = 1 + .02 * Math.sin(lt * 3.6); fl.style.translate = `0 ${Math.abs(Math.sin(lt * 3.6)) * 8}px`; const c = (lt % 2.6) / 2.6; sh.style.left = (-150 + c * 1100) + 'px'; };
};

// ---------- variantes de escena de los temas por nicho (17 nov 2026) ----------
// Cada versión del video (E.var = 1, 2 o 3) muestra las mismas ideas con una animación distinta, para comparar y elegir.
if (E.tema) {
  B.classList.add('tema', 'var' + (E.var || 1));
  const VAR = E.var || 1, base = {felicita: C.felicita, escalera: C.escalera, tool2: C.tool2};
  const chk = (d, tam = 120) => `<svg width="${tam}" height="${tam}" viewBox="0 0 120 120"><path class="tr" d="M34 62 l18 18 l36 -40" fill="none" stroke="var(--sobre)" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" style="--len:90;--d:${d}s;--du:.45s"/></svg>`;
  // Compra confirmada · 1: sello que cae y sella, con destello y filetes
  const sello = (el, sc, h) => {
    el.classList.add('cen'); fx(h.T(.1), 'golpe'); fx(h.T(.1) + .5, 'ding');
    const rayos = [...Array(28)].map((_, i) => `<line x1="0" y1="-190" x2="0" y2="-${230 + (i % 3) * 26}" stroke="var(--a)" stroke-width="${i % 2 ? 3 : 5}" stroke-linecap="round" transform="rotate(${i * 360 / 28})"/>`).join('');
    el.innerHTML = `<div class="blk" style="display:grid;justify-items:center"><div style="position:relative;width:340px;height:340px;margin-bottom:38px">
        <svg class="ry" width="700" height="700" viewBox="-350 -350 700 700" style="position:absolute;left:-180px;top:-180px;opacity:0">${rayos}</svg>
        <svg class="an" width="340" height="340" viewBox="-170 -170 340 340" style="position:absolute;inset:0;opacity:0"><circle r="160" fill="none" stroke="var(--a)" stroke-width="3"/><circle r="146" fill="none" stroke="var(--a)" stroke-width="2" stroke-dasharray="3 9"/></svg>
        <div class="se" style="position:absolute;inset:38px;border-radius:50%;background:radial-gradient(circle at 35% 30%,var(--c),var(--a) 62%);box-shadow:0 30px 60px rgba(0,0,0,.5),inset 0 -10px 24px rgba(0,0,0,.22);display:grid;place-items:center;opacity:0">${chk(h.T(.1) + .25, 150)}</div></div>
      <div class="fl" style="display:flex;align-items:center;gap:26px;width:1100px;justify-content:center;margin-bottom:22px"><i style="flex:1;height:2px;background:linear-gradient(90deg,transparent,var(--a));transform-origin:100% 50%"></i><span class="K" style="margin:0;color:var(--a)">${esc(sc.k || PR.curso || '')}</span><i style="flex:1;height:2px;background:linear-gradient(270deg,transparent,var(--a));transform-origin:0 50%"></i></div>
      ${txt(Object.assign({}, sc, {k: ''}), h, {tam: 122, t: .3, s: .62})}</div>`;
    const se = el.querySelector('.se'), ry = el.querySelector('.ry'), an = el.querySelector('.an'), fl = [...el.querySelectorAll('.fl i')];
    sc.fr = (p, lt) => { const k = out((p - .06) / .1); se.style.opacity = cl((p - .06) / .03); se.style.transform = `scale(${2.6 - 1.6 * k}) rotate(${-22 * (1 - k)}deg)`;
      const b = cl((p - .14) / .22); ry.style.opacity = b > 0 && b < 1 ? (1 - b) * .9 : 0; ry.style.transform = `scale(${.7 + .55 * out(b)})`;
      an.style.opacity = cl((p - .16) / .1) * .9; an.style.transform = `rotate(${lt * 8}deg)`; fl.forEach((f) => { f.style.transform = `scaleX(${io((p - .22) / .25)})`; }); };
  };
  // Compra confirmada · 2: comprobante que sube y recibe el sello de APROBADA
  const comprobante = (el, sc, h) => {
    el.classList.add('dos'); fx(h.T(.12), 'whoosh'); fx(h.T(.56), 'golpe'); fx(h.T(.56) + .3, 'ding');
    const fila = (a, b2, d) => `<div class="fade" style="--d:${h.T(d)}s;display:flex;justify-content:space-between;gap:20px;padding:20px 0;border-top:1.5px solid rgba(20,16,12,.14);font-size:27px"><span style="color:#7a7266;font-weight:700">${a}</span><b style="font-weight:800;text-align:right">${b2}</b></div>`;
    el.innerHTML = `<div class="ct" style="flex:0 0 760px">${txt(sc, h, {tam: 112, t: .1, s: .5})}</div>
      <div style="flex:1;position:relative;height:820px;display:grid;place-items:center"><div class="cp" style="position:relative;width:600px;padding:46px 50px 150px;border-radius:14px;background:#f8f4ea;color:#17130f;box-shadow:0 60px 110px rgba(0,0,0,.55);opacity:0">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:22px"><span style="font-family:var(--ft);font-weight:var(--fw);font-size:40px;letter-spacing:var(--ls)">Comprobante</span><span style="font-size:17px;font-weight:800;letter-spacing:.18em;color:#8a8275">MASTER EDUCATIVO</span></div>
        ${fila('Producto', esc(PR.curso || ''), .22)}${fila('Estado', 'Pago recibido', .3)}${fila('Acceso', 'Inmediato', .38)}
        <div style="height:1.5px;background:rgba(20,16,12,.14)"></div>
        <div class="sl" style="position:absolute;right:34px;bottom:30px;padding:12px 26px;border:5px solid var(--b);border-radius:12px;color:var(--b);font-family:var(--ft);font-weight:900;font-size:46px;letter-spacing:.06em;opacity:0;background:rgba(248,244,234,.6)">APROBADA</div></div></div>`;
    const cp = el.querySelector('.cp'), sl = el.querySelector('.sl');
    sc.fr = (p) => { const k = out((p - .08) / .16); cp.style.opacity = cl((p - .08) / .05); cp.style.transform = `translateY(${(1 - k) * 420}px) rotate(${-7 + 4 * k}deg)`;
      const u = out((p - .56) / .07); sl.style.opacity = cl((p - .56) / .02); sl.style.transform = `rotate(-11deg) scale(${2.4 - 1.4 * u})`; };
  };
  // Compra confirmada · 3: escudo que se dibuja y franja que barre la pantalla
  const escudo = (el, sc, h) => {
    el.classList.add('cen'); fx(h.T(.04), 'whoosh'); fx(h.T(.34), 'ding');
    el.innerHTML = `<div class="bn" style="position:absolute;left:0;right:0;top:0;bottom:0;background:linear-gradient(100deg,var(--b),var(--a));transform-origin:0 50%;z-index:3"></div>
      <div class="blk" style="display:grid;justify-items:center"><svg width="230" height="270" viewBox="0 0 230 270" style="margin-bottom:34px;overflow:visible"><path class="tr" d="M115 12 L214 48 V128 C214 196 170 240 115 258 C60 240 16 196 16 128 V48 Z" fill="none" stroke="var(--a)" stroke-width="9" stroke-linejoin="round" style="--len:760;--d:${h.T(.14)}s;--du:1s"/><path class="rl" d="M115 30 L198 60 V128 C198 186 162 224 115 240 C68 224 32 186 32 128 V60 Z" fill="var(--a)" opacity="0"/><path class="tr" d="M72 132 l30 30 l58 -66" fill="none" stroke="var(--sobre)" stroke-width="15" stroke-linecap="round" stroke-linejoin="round" style="--len:150;--d:${h.T(.34)}s;--du:.45s"/></svg>
      ${txt(sc, h, {tam: 126, t: .26, s: .6})}</div>`;
    const bn = el.querySelector('.bn'), rl = el.querySelector('.rl');
    sc.fr = (p) => { const a = io(p / .09), b2 = io((p - .09) / .1); bn.style.transform = `scaleX(${p < .09 ? a : 1 - b2})`; bn.style.transformOrigin = p < .09 ? '0 50%' : '100% 50%'; rl.setAttribute('opacity', cl((p - .3) / .08)); };
  };
  C.felicita = [sello, comprobante, escudo][(VAR - 1) % 3];

  // Tu siguiente escalón · 1: ruta en línea · 2: puente de dos tarjetas · 3: la escalera original
  const puente = (el, sc, h) => {
    el.style.padding = '0'; const N = ['Aprender', 'Practicar', 'Conseguir clientes', 'Cobrar', 'Crecer'].map((x, i) => (PR.camino || [])[i] || x);
    const it = (n, i, oro) => `<div class="pi" style="display:flex;align-items:center;gap:22px;padding:20px 0;border-top:1.5px solid ${oro ? 'rgba(0,0,0,.16)' : 'var(--linea)'};opacity:0"><i style="flex:none;width:54px;height:54px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-family:var(--ft);font-weight:var(--fw);font-size:26px;background:${oro ? 'var(--sobre)' : 'transparent'};color:${oro ? 'var(--a)' : 'var(--mut)'};border:2px solid ${oro ? 'var(--sobre)' : 'var(--mut)'}">${i + 1}</i><span style="font-family:var(--ft);font-weight:var(--fw);font-size:46px;letter-spacing:var(--ls);line-height:1.05">${esc(n)}</span></div>`;
    el.innerHTML = `<div style="position:absolute;left:130px;right:130px;top:84px;text-align:center">${txt(sc, h, {tam: 92})}</div>
      <div class="c1" style="position:absolute;left:150px;top:440px;width:640px;padding:40px 46px 30px;border-radius:26px;background:var(--sup);border:2px solid var(--linea);opacity:0"><div class="K" style="margin-bottom:14px">Con tu curso</div>${N.slice(0, 2).map((n, i) => it(n, i, 0)).join('')}</div>
      <svg style="position:absolute;left:810px;top:560px" width="300" height="120" viewBox="0 0 300 120"><path class="fa" d="M10 60 H250 M210 22 L262 60 L210 98" fill="none" stroke="var(--a)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>
      <div class="c2" style="position:absolute;left:1130px;top:380px;width:640px;padding:40px 46px 30px;border-radius:26px;background:linear-gradient(170deg,var(--c),var(--a));color:var(--sobre);box-shadow:0 50px 90px rgba(0,0,0,.45);opacity:0"><div class="K" style="margin-bottom:14px;color:var(--sobre);opacity:.8">Con el Súper Pack DJ</div>${N.slice(2).map((n, i) => it(n, i + 2, 1)).join('')}</div>
      <img class="flo pk" src="${A}pack_${MS}.png" style="position:absolute;left:1500px;top:190px;height:210px;max-width:260px;object-fit:contain;filter:drop-shadow(0 30px 40px rgba(0,0,0,.5));opacity:0" alt="">`;
    const c1 = el.querySelector('.c1'), c2 = el.querySelector('.c2'), pi = [...el.querySelectorAll('.pi')], fa = el.querySelector('.fa'), pk = el.querySelector('.pk'), T0 = sc.pasoT || [.12, .22, .58, .67, .76];
    T0.forEach((x) => fx(h.T(x), 'pop')); fx(h.T(.46), 'whoosh');
    sc.fr = (p) => { const a = out((p - .06) / .1), b2 = out((p - .5) / .1); c1.style.opacity = a; c1.style.transform = `translateY(${(1 - a) * 60}px)`; c2.style.opacity = b2; c2.style.transform = `translateY(${(1 - b2) * 80}px) scale(${.94 + .06 * b2})`;
      pi.forEach((x, i) => { const k = out((p - T0[i]) / .07); x.style.opacity = k; x.style.transform = `translateX(${(1 - k) * 40}px)`; });
      fa.style.strokeDasharray = 420; fa.style.strokeDashoffset = 420 * (1 - io((p - .36) / .16)); pk.style.opacity = cl((p - .62) / .08); };
  };
  C.escalera = VAR === 1 ? (el, sc, h) => C.camino(el, Object.assign(sc, {forma: 'linea'}), h) : VAR === 2 ? puente : base.escalera;
  // Contenidos: la ficha de puntos va con los colores del tema; cada variante acomoda distinto la imagen y la ficha
  C.tool2 = (el, sc, h) => { base.tool2(el, sc, h); if (VAR === 2) el.classList.toggle('inv'); };
}

// ---------- armado ----------
const S = V.escenas;
S.forEach((sc, i) => {
  const el = document.createElement('section'); el.className = 'sc'; sc.t1 = sc.t0 + sc.dur;
  const h = {T: (f) => +(sc.t0 + .15 + f * (sc.vd - .15)).toFixed(2), i};
  C[sc.c](el, sc, h); st.append(el); sc.el = el; sc.flo = [...el.querySelectorAll('.flo')]; sc.rot = [...el.querySelectorAll('.d-aro i,.d-sol i,.d-ondas i')];
  if (i) fx(sc.t0 - .08, E.trans === 'corte' ? 'click' : 'whoosh');
});
// cambia en pantalla los datos fijos del pack DJ por los del producto (si son los mismos, no cambia nada)
(() => {
  const N = CONT.length, MAP = {'Súper Pack DJ': PR.oferta, 'DJ Profesional': PR.curso, '$120': '$' + PR.valor, '$12': '$' + PR.precio, '7 días': PR.dias + ' días', '7 herramientas': N + ' ' + PR.unidad};
  const RX = /Súper Pack DJ|DJ Profesional|\$120|\$12(?!\d)|\b7 días|\b7 herramientas/g;
  const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) if (PR.logro && n.nodeValue.trim() === 'evento') n.nodeValue = PR.logro; else if (RX.test(n.nodeValue)) { RX.lastIndex = 0; n.nodeValue = n.nodeValue.replace(RX, (m) => MAP[m]); } else RX.lastIndex = 0;
})();
const LET = ['letra', 'maquina'].includes(E.texto);
document.querySelectorAll('.rv').forEach((el) => {
  let n = 0;
  const walk = (node) => [...node.childNodes].forEach((c) => {
    if (c.nodeType === 3) {
      const f = document.createDocumentFragment();
      c.textContent.split(/(\s+)/).forEach((p) => {
        if (!p) return; if (/^\s+$/.test(p)) { f.append(' '); return; }
        const w = document.createElement('span'); w.className = 'w';
        (LET ? [...p] : [p]).forEach((ch) => { const s = document.createElement('span'); s.className = 'i'; s.textContent = ch; s.style.setProperty('--i', n++); w.append(s); });
        f.append(w);
      });
      c.replaceWith(f);
    } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
  });
  walk(el);
});
const TI = .5, TO = .3;
const TR = {
  fundido: (e, a, b) => { e.style.opacity = a * b; },
  empuje: (e, a, b) => { e.style.opacity = Math.min(1, a * 2) * b; e.style.transform = `translateX(${(1 - out(a)) * 160 - (1 - io(b)) * 160}px)`; },
  sube: (e, a, b) => { e.style.opacity = Math.min(1, a * 2) * b; e.style.transform = `translateY(${(1 - out(a)) * 110 - (1 - io(b)) * 80}px)`; },
  zoom: (e, a, b) => { e.style.opacity = a * b; e.style.transform = `scale(${.9 + .1 * out(a) + .07 * (1 - b)})`; },
  barrido: (e, a, b) => { e.style.clipPath = b < 1 ? `inset(0 0 0 ${(1 - io(b)) * 100}%)` : `inset(0 ${(1 - io(a)) * 100}% 0 0)`; },
  corte: (e, a) => { e.style.transform = `scale(${1 + .05 * (1 - out(a))})`; },
  giro: (e, a, b) => { e.style.opacity = a * b; e.style.transform = `perspective(1800px) rotateY(${(1 - out(a)) * -24 + (1 - io(b)) * 24}deg)`; },
  desenfoque: (e, a, b) => { e.style.opacity = a * b; e.style.filter = a * b < 1 ? `blur(${(1 - a * b) * 22}px)` : 'none'; },
  cortina: (e, a, b) => { e.style.opacity = b; e.style.clipPath = `inset(${(1 - io(a)) * 50}% 0)`; },
};
const tr = TR[E.trans] || TR.fundido, FL = [].concat(E.fondo || []).map((k) => F[k]).filter(Boolean), fondo = (t) => FL.forEach((f) => f(t)), DUR = window.DUR = V.dur;
window.MUSICA = E.musica || 'dj';
function fit() {
  B.classList.add('midiendo'); S.forEach((sc) => sc.el.classList.add('on'));
  S.forEach((sc) => sc.el.querySelectorAll('.T').forEach((t) => {
    const cont = t.closest('.ct,.blk') || t.parentElement, mh = +(t.dataset.mh || (sc.el.classList.contains('dos') ? 470 : 520)); let fs = parseFloat(getComputedStyle(t).fontSize), n = 0;
    while ((t.scrollHeight > mh || t.scrollWidth > t.clientWidth + 10 || cont.scrollHeight > Math.max(860, cont.clientHeight) || cont.scrollWidth > cont.clientWidth + 10) && fs > 38 && n++ < 40) { fs *= .94; t.style.fontSize = fs + 'px'; }
  }));
  S.forEach((sc) => sc.el.classList.remove('on')); B.classList.remove('midiendo');
}
window.__seek = (t) => {
  S.forEach((sc, i) => {
    const on = t >= sc.t0 && (t < sc.t1 || i === S.length - 1);
    if (on !== sc.on) { sc.on = on; sc.el.classList.toggle('on', on); }
    if (on) tr(sc.el, cl((t - sc.t0) / TI), i === S.length - 1 ? 1 : cl((sc.t1 - t) / TO));
  });
  document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t * 1000; });
  g.clearRect(0, 0, 1920, 1080); fondo(t);
  S.forEach((sc, i) => { if (!sc.on) return; const lt = t - sc.t0; if (sc.fr) sc.fr(cl((lt - .15) / (sc.vd - .15)), lt); sc.flo.forEach((e, j) => { e.style.translate = `0 ${Math.sin(t * 1.3 + j + i) * 11}px`; }); sc.rot.forEach((e) => { e.style.rotate = (t * 7) + 'deg'; }); const c = document.getElementById('ct'); if (c) c.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(S.length).padStart(2, '0'); });
  const pb = document.getElementById('pb'); if (pb) pb.style.width = (t / DUR * 100) + '%';
};
S.forEach((sc) => sc.el.classList.add('on')); document.body.offsetHeight;
Promise.all([`${E.fw || 800} 40px "${E.ft}"`, `700 40px "${E.fb || 'Nunito'}"`, `italic ${E.fkw || 500} 40px "${E.fk || E.ft}"`, `${E.fkw || 500} 40px "${E.fk || E.ft}"`].map((f) => document.fonts.load(f).catch(() => 0)))
  .then(() => document.fonts.ready).then(() => Promise.all([...document.images].map((im) => im.decode().catch(() => 0)))).then(() => { fit(); window.__seek(0); window.__listo = true; });
})();
