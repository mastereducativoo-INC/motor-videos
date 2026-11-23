// KIT FOTOGRÁFICO DEL NICHO (Christian, 22 nov 2026, al rehacer Canto y Recetas para bebés: «cada video debe tener una identidad
// visual completamente relacionada con su nicho… imágenes hiperrealistas… los materiales deben verse como productos reales…
// la música, los colores, las escenas y las transiciones deben adaptarse al producto… no reutilices fondos, objetos, música o
// estilos de otros cursos… no quiero seguir repitiendo las mismas correcciones»).
// Sobre cualquiera de los 9 diseños pone el NICHO con FOTOS reales del Laboratorio (no dibujos):
//   · fondo: la foto hiperrealista del diseño (kf0–kf8) con movimiento lento de cámara y un velo para que el texto se lea
//   · firma del nicho encima del fondo: ondas de voz y reflectores (canto), burbujas suaves (bebés), fórmulas de gis (matemáticas)
//   · objetos reales del nicho (ko1–ko8, recortados) que flotan en las orillas de cada escena, sin tapar ningún texto ni imagen
//   · ráfaga del nicho en los momentos clave (notas musicales, corazones, símbolos matemáticos)
//   · transiciones propias del nicho, paleta, letras y vocabulario del nicho (la música la elige temas.kit_de)
// Configuración: vsl/motion/pro/nichos.json (un nicho nuevo se agrega ahí). Lo activa estudio3.py con E.kitf.
(() => {
const X = window.PRO; if (!X) return;
const {E, P, IM, $, rgba} = X;
const K = E.kitf; if (!K || !E.kit || !Array.isArray(K.paleta)) return;
const NICHO = E.kit, v = +E.kitv || 0;
let sd = 29 + v * 157 + NICHO.length * 13;
const r = () => { sd |= 0; sd = sd + 0x6D2B79F5 | 0; let t = Math.imul(sd ^ sd >>> 15, 1 | sd); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const lum = (h) => { const n = parseInt(String(h).slice(1), 16); return ((n >> 16) * .3 + ((n >> 8) & 255) * .59 + (n & 255) * .11); };

// ---------------- paleta, letras y transiciones del nicho ----------------
const [bg, sup, ink, mut, a, c, b, sobre, vig] = K.paleta;
const PL = Object.assign({bg, sup, ink, mut, a, c, b, sobre, vig}, E.colores && typeof E.colores === 'object' ? E.colores : {});  // V6: colores pedidos mandan
Object.assign(P, PL);
const CLARO = lum(P.bg) > 150;
const LET = (K.letras || [])[v % Math.max(1, (K.letras || []).length)] || {ft: 'Outfit', fw: 700, fb: 'Manrope', fn: 'Outfit', fk: 'Caveat', ls: '-.01em'};
Object.assign(E, {dirFt: LET.ft, dirFw: LET.fw, dirLs: LET.ls, fb: LET.fb});
if (Array.isArray(K.trs) && K.trs.length) E.trs = K.trs;
if (X.PAPEL) Object.assign(X.PAPEL, {bg: CLARO ? '#ffffff' : '#fbf7f2', sup: CLARO ? P.sup : '#efe8df', ink: CLARO ? P.ink : '#211c22', mut: CLARO ? P.mut : '#6d6470', a: P.a, c: P.c, b: CLARO ? P.b : '#d9cfc4', sobre: '#ffffff'});
const SUB = (col) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 30' preserveAspectRatio='none'><path d='M4 19C60 9 120 25 180 14S270 9 296 15' fill='none' stroke='${col}' stroke-width='7' stroke-linecap='round'/></svg>`)}")`;
const R = document.documentElement.style;
Object.entries({bg: P.bg, a: P.a, b: P.b, c: P.c, sup: P.sup, ink: P.ink, mut: P.mut, sobre: P.sobre, aB: rgba(P.a, .5), aS: rgba(P.a, .32), halo: rgba(P.a, .22), luz: rgba(P.b, .3), luz2: rgba(P.a, .08),
  mutB: rgba(P.mut, .3), inkB: rgba(P.ink, .42), ft: LET.ft, fb: LET.fb, fw: LET.fw, ls: LET.ls, fn: LET.fn, fk: LET.fk, vig: PL.vig || 'rgba(0,0,0,.5)', trazo: SUB(P.a), goma: P.c, kst: 'normal'})
  .forEach(([k, val]) => R.setProperty('--' + k, val));
document.body.classList.add('kit', 'kit-foto', 'kit-' + NICHO, 'kitv' + v, CLARO ? 'kf-claro' : 'kf-oscuro');
X.precarga.push(() => Promise.all([LET.ft, LET.fb, LET.fn, LET.fk].flatMap((f) => [400, 600, 700, 800].map((w) => document.fonts.load(`${w} 60px ${f}`).catch(() => null)))));

// ---------------- emblema del nicho (en lugar de repetir el logo) ----------------
const svg = (w, h, inner, vb) => `<svg width="${w}" height="${h}" viewBox="${vb || `0 0 ${w} ${h}`}" style="overflow:visible">${inner}</svg>`;
const EMB = {
  microfono: (h, col) => svg(h * .62, h, `<rect x="18" y="4" width="26" height="46" rx="13" fill="${col}"/><path d="M10 34c0 14 10 24 21 24s21-10 21-24" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round"/><path d="M31 58v14M19 74h24" stroke="${col}" stroke-width="5" stroke-linecap="round"/>`, '0 0 62 80'),
  biberon: (h, col) => svg(h * .5, h, `<path d="M16 2h8l2 8h-12z" fill="${col}"/><rect x="9" y="10" width="22" height="8" rx="3" fill="${col}"/><rect x="7" y="18" width="26" height="58" rx="10" fill="none" stroke="${col}" stroke-width="5"/><path d="M12 44h16M12 54h12M12 64h16" stroke="${col}" stroke-width="3.4" stroke-linecap="round"/>`, '0 0 40 80'),
  compas: (h, col) => svg(h * .8, h, `<circle cx="32" cy="10" r="7" fill="${col}"/><path d="M29 16L8 76M35 16l21 60" stroke="${col}" stroke-width="5.5" stroke-linecap="round"/><path d="M14 56c10 6 26 6 36 0" fill="none" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`, '0 0 64 80'),
};
X.KIT = {nicho: NICHO, v, foto: true, icono: (h, col) => (EMB[K.emblema] || EMB.compas)(h, col)};

// ---------------- FONDO: la foto del nicho, viva ----------------
const capa = (L, html, st = '') => { const e = $(`<div style="position:absolute;${st}">${html}</div>`); L.appendChild(e); return e; };
const fotoFondo = () => { const k = 'kf' + (v % 9); if (IM[k] && IM[k].ok) return k;
  for (let j = 1; j < 9; j++) { const q = 'kf' + ((v + j) % 9); if (IM[q] && IM[q].ok) return q; } return null; };
const ups = [];
const FIRMA = {
  ondas: (L) => { // canto: reflectores rosas que se mueven + ondas de voz + ecualizador suave abajo
    const haces = [0, 1, 2, 3].map((j) => capa(L, '', `left:${180 + j * 470}px;top:-260px;width:260px;height:1500px;transform-origin:50% 0;background:linear-gradient(180deg,${rgba(P.a, CLARO ? .18 : .26)},${rgba(P.a, 0)} 78%);filter:blur(18px);clip-path:polygon(42% 0,58% 0,100% 100%,0 100%)`));
    const ondas = capa(L, svg(1920, 260, [0, 1, 2].map((j) => `<path class="kw${j}" fill="none" stroke="${j === 1 ? P.c : P.a}" stroke-width="${5 - j}" stroke-linecap="round" opacity="${.55 - j * .12}"/>`).join('')), 'left:0;top:820px');
    const barras = Array.from({length: 46}, (_, j) => capa(L, '', `left:${j * 42 + 4}px;bottom:0;width:26px;height:120px;border-radius:13px 13px 0 0;background:linear-gradient(0deg,${rgba(P.a, .5)},${rgba(P.c, .12)});transform-origin:50% 100%`));
    const pth = ondas.querySelectorAll('path');
    return (t) => {
      haces.forEach((e, j) => { e.style.transform = `rotate(${Math.sin(t * .5 + j * 1.3) * 16}deg)`; e.style.opacity = .7 + .3 * Math.sin(t * .9 + j); });
      pth.forEach((p, j) => { let d = ''; for (let x = 0; x <= 1920; x += 24) { const y = 130 + Math.sin(x / (160 + j * 50) + t * (2.1 + j * .4)) * (52 - j * 12) * (.55 + .45 * Math.sin(x / 520 + t)); d += (x ? 'L' : 'M') + x + ' ' + y.toFixed(1); } p.setAttribute('d', d); });
      barras.forEach((e, j) => { e.style.transform = `scaleY(${.12 + .55 * Math.abs(Math.sin(t * 3.1 + j * .7) * Math.cos(t * 1.7 + j * .23))})`; });
    };
  },
  burbujas: (L) => { // bebés: burbujas y luces suaves que suben + corazones y estrellitas
    const cols = [P.a, P.c, P.b, '#ffffff'];
    const ob = CLARO ? 1 : .55;  // en fondos oscuros las burbujas van más suaves (si no, se ven grises)
    const bs = Array.from({length: CLARO ? 22 : 15}, (_, j) => { const s = 40 + r() * 150, x = r() * 1920, y0 = r() * 1300, vel = 14 + r() * 26, col = cols[j % 3];
      return {e: capa(L, '', `left:${x}px;top:0;width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle at 35% 30%,${rgba('#ffffff', .5 * ob)},${rgba(col, .34 * ob)} 45%,${rgba(col, .05)} 72%,transparent);filter:blur(${r() < .4 ? 3 : 0}px)`), y0, vel, s}; });
    const fig = (k, s, col) => k ? svg(s, s, `<path d="M12 21s-7-4.6-9.5-9C.6 8.4 2.6 4 6.6 4 9 4 10.6 5.5 12 7.4 13.4 5.5 15 4 17.4 4c4 0 6 4.4 4.1 8-2.5 4.4-9.5 9-9.5 9z" fill="${col}"/>`, '0 0 24 24')
      : svg(s, s, `<path d="M12 2l2.6 6.4 6.9.5-5.3 4.4 1.7 6.7L12 16.3 6.1 20l1.7-6.7L2.5 8.9l6.9-.5z" fill="${col}"/>`, '0 0 24 24');
    const fs = Array.from({length: 10}, (_, j) => ({e: capa(L, fig(j % 2, 30 + r() * 22, rgba(j % 3 ? P.a : P.c, .55)), `left:${r() * 1860}px;top:0`), y0: r() * 1200, vel: 20 + r() * 20, f: r() * 6}));
    return (t) => {
      bs.forEach((q) => { const y = ((q.y0 - t * q.vel) % 1320 + 1320) % 1320 - 200; q.e.style.transform = `translate(${Math.sin(t * .6 + q.y0) * 26}px,${y}px)`; });
      fs.forEach((q) => { const y = ((q.y0 - t * q.vel) % 1260 + 1260) % 1260 - 120; q.e.style.transform = `translate(${Math.sin(t + q.f) * 18}px,${y}px) rotate(${Math.sin(t * .8 + q.f) * 16}deg)`; });
    };
  },
  formulas: (L) => { // matemáticas: fórmulas de gis que aparecen y se borran, y figuras que se trazan solas
    const F = ['a² + b² = c²', 'y = mx + b', 'x = (−b ± √(b² − 4ac)) / 2a', 'sen²θ + cos²θ = 1', 'A = πr²', 'Σ n = n(n+1)/2', '(a + b)² = a² + 2ab + b²', 'Δ = b² − 4ac', 'V = l³', 'f(x) = x²', 'π ≈ 3.1416', '√144 = 12'];
    const lug = [[60, 70], [1300, 90], [80, 930], [1260, 960], [40, 470], [1560, 520], [700, 40], [620, 1000]];
    const col = CLARO ? rgba(P.ink, .24) : rgba('#f4f1e8', .26);
    const fx = lug.map(([x, y], j) => ({e: capa(L, `<span style="font-family:${LET.fk},cursive;font-size:${38 + (j % 3) * 8}px;color:${j % 3 === 1 ? rgba(P.a, .38) : col};white-space:nowrap">${F[(j + v * 3) % F.length]}</span>`, `left:${x}px;top:${y}px`), f: j * 1.37}));
    const tri = capa(L, svg(1920, 1080, `<path d="M1500 360L1820 360L1820 140Z" fill="none" stroke="${rgba(P.a, .3)}" stroke-width="5" pathLength="1" stroke-dasharray="1 1"/><circle cx="230" cy="330" r="120" fill="none" stroke="${rgba(P.c, .26)}" stroke-width="5" pathLength="1" stroke-dasharray="1 1"/><path d="M230 330L350 330" stroke="${rgba(P.c, .3)}" stroke-width="4"/>`), 'inset:0');
    const ps = tri.querySelectorAll('[pathLength]');
    return (t) => {
      fx.forEach((q) => { const ph = ((t * .32 + q.f) % 3) / 3; q.e.style.opacity = ph < .15 ? ph / .15 : ph < .75 ? 1 : 1 - (ph - .75) / .25; q.e.style.transform = `translateY(${Math.sin(t * .4 + q.f) * 8}px)`; });
      ps.forEach((p, j) => { const f = ((t + j * 2) % 8) / 8; p.style.strokeDashoffset = f < .5 ? 1 - f / .5 : f < .85 ? 0 : -(f - .85) / .15; });
    };
  },
};
X.alMontar.push(({bg: B}) => {
  const L = $('<div class="kbg"></div>'); B.appendChild(L); L.style.background = P.bg;
  const k = fotoFondo(); let foto = null;
  if (k) foto = capa(L, '', `left:-60px;top:-40px;width:2040px;height:1160px;background:url("${IM[k].src}") center/cover no-repeat;filter:blur(${CLARO ? 2 : 1.5}px) saturate(1.06)`);
  // velo: la foto se ve y el texto se lee (más denso del lado donde suelen ir los títulos)
  capa(L, '', `inset:0;background:linear-gradient(100deg,${rgba(P.bg, CLARO ? .86 : .82)} 0%,${rgba(P.bg, CLARO ? .62 : .5)} 48%,${rgba(P.bg, CLARO ? .74 : .66)} 100%)`);
  const fi = FIRMA[K.firma] ? FIRMA[K.firma](L) : null;
  L.appendChild($('<div class="vig"></div>'));
  ups.push((t) => { if (foto) foto.style.transform = `scale(${1.04 + .035 * Math.sin(t * .07)}) translate(${Math.sin(t * .05) * 22}px,${Math.cos(t * .04) * 12}px)`; if (fi) fi(t); });
});
X.alSeek.push((t) => ups.forEach((u) => u(t)));

// ---------------- ESCENAS: fuera los fondos de otros nichos, objetos reales del nicho, vocabulario y ráfagas ----------------
const rel = (cam, e) => { const q = cam.getBoundingClientRect(), w = e.getBoundingClientRect(), s = q.width / 1920 || 1; return {l: (w.left - q.left) / s, t: (w.top - q.top) / s, r: (w.right - q.left) / s, b: (w.bottom - q.top) / s, w: w.width / s, h: w.height / s}; };
const choca = (p, q, m = 18) => p.l - m < q.r && p.r + m > q.l && p.t - m < q.b && p.b + m > q.t;
const ocupado = (cam) => [...cam.querySelectorAll('.T,.P,.K,.chip,.fila,.btn,.bt,.num,.call,.ped,h4,.ej,.vid,img')].map((e) => rel(cam, e)).filter((q) => q.w * q.h > 60);
const PAL = (K.vocab || []).map(([re, nv]) => [new RegExp(re, 'gi'), nv]);
const vocab = (raiz) => { if (!PAL.length) return; const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { let t = n.nodeValue; if (!t || t.length < 4) continue; PAL.forEach(([re, nv]) => { t = t.replace(re, (m) => (m === m.toUpperCase() ? nv.toUpperCase() : nv)); }); if (t !== n.nodeValue) n.nodeValue = t; } };
const objetos = () => Array.from({length: 8}, (_, j) => 'ko' + (j + 1)).filter((k) => IM[k] && IM[k].ok);  // se miden al armar cada escena (las imágenes cargan después)
const SIMB = {ondas: ['♪', '♫', '♬', '♩'], burbujas: ['♥', '★', '♥', '✿'], formulas: ['+', '×', '=', 'π', '√', '÷', '∑']}[K.firma] || ['★'];
function rafaga(c, x, y, at) { const {cam, tl} = c;
  for (let j = 0; j < 14; j++) { const e = $(`<i class="kel" style="position:absolute;left:${x}px;top:${y}px;font-style:normal;font-family:${LET.fk},serif;font-weight:700;font-size:${34 + r() * 40}px;color:${[P.a, P.c, P.ink][j % 3]};z-index:3;pointer-events:none">${SIMB[j % SIMB.length]}</i>`);
    cam.appendChild(e); const ang = -Math.PI / 2 + (r() - .5) * 2.2, d = 180 + r() * 260;
    tl.fromTo(e, {x: 0, y: 0, opacity: 0, scale: .4, rotation: (r() - .5) * 60}, {x: Math.cos(ang) * d, y: Math.sin(ang) * d, opacity: .95, scale: 1, duration: .9, ease: 'power2.out'}, at + j * .03);
    tl.to(e, {opacity: 0, y: '-=60', duration: .7, ease: 'power1.in'}, at + .95 + j * .03); } }
X.alEscena.push((c) => {
  const {cam, tl, sc, i} = c;
  vocab(cam);
  // 1) los diseños traían el fondo de su nicho de origen (madera de despacho, mármol de tribunal, negro de keynote…): fuera
  [...cam.children].forEach((e) => { if (e.classList.contains('kel')) return; const q = rel(cam, e);
    if (q.w >= 1780 && q.h >= 1000 && e.children.length < 8 && !e.querySelector('img,.T,.P,.K,.num,.chip,.btn,.bt,.app,.papel,.vid,canvas') && !String(e.textContent || '').trim()) e.style.display = 'none'; });
  // 2) objetos reales del nicho en las orillas, solo donde no tapan nada (se mide con la escena ya armada)
  const OBJ = objetos();
  if (OBJ.length) {
    tl.time(Math.min(2.6, c.D * .62), true); const ocup = ocupado(cam); tl.time(0, true);
    const lugares = [[-40, 790, 300], [1660, 800, 290], [-30, -20, 250], [1690, -30, 250], [1700, 380, 230], [-50, 390, 230]];  // nunca abajo al centro: ahí suelen ir el precio y los textos
    const n = 2 + (i % 2); let puestos = 0;
    for (let j = 0; j < lugares.length && puestos < n; j++) {
      const [x, y, s] = lugares[(j + i) % lugares.length], box = {l: x, t: y, r: x + s, b: y + s};
      if (ocup.some((q) => choca(q, box))) continue;
      const k = OBJ[(i * 2 + j + v) % OBJ.length];
      const e = $(`<div class="kel" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;display:flex;align-items:center;justify-content:center;z-index:1"><img src="${IM[k].src}" style="max-width:100%;max-height:100%;filter:drop-shadow(0 26px 30px rgba(0,0,0,${CLARO ? .22 : .5}))"></div>`);
      cam.insertBefore(e, cam.firstChild); puestos++;
      const rot = (j % 2 ? 1 : -1) * (6 + j * 4);
      tl.fromTo(e, {scale: .4, opacity: 0, rotation: rot * 2.5, y: 40}, {scale: 1, opacity: 1, rotation: rot, y: 0, duration: .9, ease: 'back.out(1.5)'}, .15 + j * .14);
      tl.to(e, {y: '-=14', rotation: rot + (j % 2 ? 3 : -3), duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(c.D / 2.4) + 1}, 1.1);
    }
  }
  // 3) ráfaga del nicho en los momentos clave (compra, revelación del pack, precio y cierre)
  if (['felicita', 'revela', 'precio', 'cta2'].includes(sc.c)) rafaga(c, sc.c === 'felicita' ? 960 : 1500, sc.c === 'felicita' ? 420 : 760, sc.c === 'precio' ? 1.2 : .7);
});

// ---------------- TRANSICIONES DEL NICHO ----------------
const FXel = {};
const una = (k, FX, html) => { if (!FXel[k]) { FXel[k] = $(html); FX.appendChild(FXel[k]); } return FXel[k]; };
X.TRX.onda = ({M, t, FX}) => { // canto: una ola rosa con forma de onda de voz cruza la pantalla
  const e = una('onda', FX, `<div class="abs" style="left:0;top:0;width:2700px;height:1080px;z-index:5;transform:translateX(-2700px)"><div style="position:absolute;left:300px;top:0;width:2400px;height:1080px;background:linear-gradient(90deg,${P.a},${P.c} 45%,${P.bg})"></div>${svg(320, 1080, `<path d="M320 0C140 90 300 180 140 270S300 450 140 540 300 720 140 810 300 990 140 1080H320Z" fill="${P.a}"/>`, '0 0 320 1080')}</div>`);
  M.fromTo(e, {x: -2700}, {x: -350, duration: .34, ease: 'power3.in'}, t - .34); M.to(e, {x: 2100, duration: .4, ease: 'power3.out'}, t + .02); M.set(e, {x: -2700}, t + .5);
  return {on: t - .02, off: t + .02}; };
X.TRX.reflector = ({M, el, t, FX}) => { // canto: la escena nueva se abre como un reflector que se enciende
  const ring = una('ref', FX, `<div class="abs" style="left:960px;top:500px;width:10px;height:10px;margin:-5px 0 0 -5px;border-radius:50%;box-shadow:0 0 0 6px ${rgba(P.c, .9)},0 0 80px 30px ${rgba(P.a, .55)};z-index:5;opacity:0"></div>`);
  M.fromTo(el, {clipPath: 'circle(0% at 50% 46%)'}, {clipPath: 'circle(75% at 50% 46%)', duration: .5, ease: 'power2.inOut'}, t - .3); M.set(el, {clipPath: 'none'}, t + .22);
  M.fromTo(ring, {scale: 1, opacity: 1}, {scale: 230, opacity: 0, duration: .55, ease: 'power2.out'}, t - .3);
  return {on: t - .3, off: t + .22}; };
X.TRX.nube = ({M, t, FX}) => { // bebés: una nube suave y esponjosa pasa y deja la escena nueva
  const e = una('nube', FX, `<div class="abs" style="left:0;top:0;width:2900px;height:1080px;z-index:5;transform:translateX(-2900px)"><div style="position:absolute;inset:0 0 0 420px;background:${CLARO ? '#ffffff' : P.sup}"></div>${[[300, 80, 260], [210, 330, 300], [330, 600, 280], [230, 860, 300], [120, 1060, 260]].map(([x, y, s]) => `<i style="position:absolute;left:${x}px;top:${y - s / 2}px;width:${s}px;height:${s}px;border-radius:50%;background:${CLARO ? '#ffffff' : P.sup}"></i>`).join('')}<div style="position:absolute;inset:0 0 0 420px;background:radial-gradient(circle at 30% 40%,${rgba(P.a, .18)},transparent 50%),radial-gradient(circle at 70% 70%,${rgba(P.c, .18)},transparent 50%)"></div></div>`);
  M.fromTo(e, {x: -2900}, {x: -420, duration: .38, ease: 'power2.in'}, t - .38); M.to(e, {x: 2100, duration: .44, ease: 'power2.out'}, t + .02); M.set(e, {x: -2900}, t + .55);
  return {on: t - .02, off: t + .02}; };
X.TRX.burbuja = ({M, el, t, FX}) => { // bebés: una burbuja crece desde abajo y trae la escena nueva
  const bu = una('bur', FX, `<div class="abs" style="left:960px;top:1000px;width:20px;height:20px;margin:-10px 0 0 -10px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#ffffff,${rgba(P.a, .5)} 60%,transparent 72%);z-index:5;opacity:0"></div>`);
  M.fromTo(el, {clipPath: 'circle(0% at 50% 92%)'}, {clipPath: 'circle(130% at 50% 92%)', duration: .55, ease: 'power2.inOut'}, t - .32); M.set(el, {clipPath: 'none'}, t + .24);
  M.fromTo(bu, {scale: 1, opacity: .9}, {scale: 80, opacity: 0, duration: .6, ease: 'power2.out'}, t - .32);
  return {on: t - .32, off: t + .24}; };
X.TRX.tiza = ({M, t, FX}) => { // matemáticas: un borrador de pizarrón con gis barre la pantalla
  const e = una('tiza', FX, `<div class="abs" style="left:-2700px;top:-300px;width:2500px;height:1680px;z-index:5;transform:skewX(-12deg);background:${CLARO ? '#2b3446' : '#3a4558'};box-shadow:0 0 120px rgba(0,0,0,.6)"><div style="position:absolute;inset:0;background:repeating-linear-gradient(92deg,rgba(255,255,255,.05) 0 3px,transparent 3px 11px)"></div><div style="position:absolute;right:0;top:0;bottom:0;width:30px;background:${P.a}"></div></div>`);
  M.fromTo(e, {x: 0}, {x: 2600, duration: .32, ease: 'power3.in'}, t - .32); M.to(e, {x: 5200, duration: .36, ease: 'power3.out'}, t + .02); M.set(e, {x: 0}, t + .45);
  return {on: t - .02, off: t + .02}; };
X.TRX.cuadricula = ({M, el, t, FX}) => { // matemáticas: la escena nueva se dibuja de arriba abajo sobre una hoja cuadriculada
  const g = una('cua', FX, `<div class="abs" style="left:0;top:0;width:1920px;height:1080px;z-index:5;opacity:0;background:${CLARO ? '#ffffff' : P.sup};background-image:linear-gradient(${rgba(P.a, .25)} 2px,transparent 2px),linear-gradient(90deg,${rgba(P.a, .25)} 2px,transparent 2px);background-size:60px 60px"></div>`);
  M.fromTo(g, {opacity: 0}, {opacity: 1, duration: .16, ease: 'none'}, t - .3); M.to(g, {opacity: 0, duration: .2, ease: 'none'}, t + .08);
  M.fromTo(el, {clipPath: 'inset(0% 0% 100% 0%)'}, {clipPath: 'inset(0% 0% 0% 0%)', duration: .4, ease: 'power2.inOut'}, t - .14); M.set(el, {clipPath: 'none'}, t + .28);
  return {on: t - .14, off: t + .1}; };
})();
