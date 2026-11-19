// Motor MKT (19 nov 2026): video de venta del producto PRINCIPAL (el que va en el Marketplace de Hotmart).
// window.V = {estilo:{mk:1..5}, escenas:[{c, voz, t, s, k, items, i, t0, vd, vz, dur}], prod:{...}, assets, assets2}
// 5 directores = 5 mundos visuales completos; cada escena se monta distinto en cada uno:
//   1 Club (neón, láser, ecualizador)   2 Vinilo (analógico cálido, disco girando)   3 Software (cabinas, ondas, BPM)
//   4 Cartel (festival, tipografía gigante)   5 Cine (fotos reales a pantalla completa, grano, franjas)
// Reglas de Christian: se entiende a primera vista, lo que dice la voz se ve en ese momento, lo que se ofrece se ve GRANDE,
// nada estático, textos ordenados y nunca encima de una imagen, colores y objetos del nicho.
(() => {
const V = window.V, E = V.estilo || {}, A = V.assets || '', A2 = V.assets2 || A, PR = V.prod || {};
const DIR = Math.min(5, Math.max(1, +E.mk || 1));
gsap.defaults({lazy: false, overwrite: false}); gsap.config({nullTargetWarn: false});
const PAL = {
  1: {bg: '#07060f', ink: '#ffffff', mut: '#cfc8ee', a: '#ff2bd6', b: '#22e5ff', c: '#ffe14d', sobre: '#0a0612', panel: 'rgba(255,255,255,.06)', line: 'rgba(255,43,214,.55)', sombra: 'rgba(255,43,214,.45)',
      ft: 'Unbounded', fw: 800, fb: 'Outfit', fm: 'SpaceG', tt: 'uppercase', ls: '-.01em', rad: '14px', acc: 'linear-gradient(90deg,#ff2bd6,#22e5ff,#ff2bd6)'},
  2: {bg: '#150e09', ink: '#f6ead3', mut: '#d2bf9f', a: '#ff8a2a', b: '#e6452e', c: '#f2c14e', sobre: '#1a0f06', panel: 'rgba(246,234,211,.06)', line: 'rgba(255,138,42,.45)', sombra: 'rgba(0,0,0,.6)',
      ft: 'DMSerif', fw: 400, fb: 'Archivo', fm: 'Archivo', tt: 'none', ls: '0', rad: '999px', acc: 'linear-gradient(90deg,#ff8a2a,#f2c14e,#ff8a2a)'},
  3: {bg: '#0b0e12', ink: '#eef3f8', mut: '#93a5ba', a: '#00e0a4', b: '#ff4d6d', c: '#ffd23f', sobre: '#04140f', panel: '#18202a', line: '#263040', sombra: 'rgba(0,224,164,.25)',
      ft: 'SpaceG', fw: 700, fb: 'SpaceG', fm: 'JetBrains', tt: 'none', ls: '-.02em', rad: '10px', acc: 'linear-gradient(90deg,#00e0a4,#8ff7dc,#00e0a4)'},
  4: {bg: '#ffd400', ink: '#111111', mut: '#222222', a: '#e62e2e', b: '#111111', c: '#ffffff', sobre: '#ffffff', panel: '#111', line: '#111', sombra: 'rgba(0,0,0,.35)',
      ft: 'Anton', fw: 400, fb: 'Archivo', fm: 'Archivo', tt: 'uppercase', ls: '.01em', rad: '0px', acc: 'linear-gradient(90deg,#e62e2e,#e62e2e)'},
  5: {bg: '#050505', ink: '#f7f1e6', mut: '#d6ccbb', a: '#e2b866', b: '#9a6b2f', c: '#e2b866', sobre: '#140e05', panel: 'rgba(255,255,255,.06)', line: 'rgba(226,184,102,.45)', sombra: 'rgba(0,0,0,.6)',
      ft: 'Instrument', fw: 400, fb: 'Manrope', fm: 'Manrope', tt: 'none', ls: '-.01em', rad: '6px', acc: 'linear-gradient(90deg,#e2b866,#fff1c9,#e2b866)'},
}[DIR];
if (E.pal) Object.assign(PAL, E.pal);  // un tema puede cambiar los colores del director
const R = document.documentElement.style;
for (const k of ['bg', 'ink', 'mut', 'a', 'b', 'c', 'sobre', 'panel', 'line', 'sombra', 'tt', 'ls', 'rad', 'acc']) R.setProperty('--' + k, PAL[k]);
R.setProperty('--ft', PAL.ft); R.setProperty('--fb', PAL.fb); R.setProperty('--fm', PAL.fm); R.setProperty('--fw', PAL.fw);
document.body.classList.add('d' + DIR);

let seed = 11 + DIR * 97; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const $ = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; };
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
const pal = (s) => String(s || '').split('*').map((seg, j) => seg.split(/\s+/).filter(Boolean).map((w) => `<span class="w${j % 2 ? ' k' : ''}"><span class="wi">${esc(w)}</span></span>`).join(' ')).join(' ');
window.SFX = []; const sfx = (t, n) => window.SFX.push([Math.max(0, +(+t).toFixed(2)), n]);
const fmt = (n) => Math.round(n).toLocaleString('en-US');
const OK = '<svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="22" fill="none" stroke="currentColor" stroke-width="4"/><path d="M14 26l7 7 15-16" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const NO = '<svg viewBox="0 0 50 50" width="58" height="58"><circle cx="25" cy="25" r="22" fill="none" stroke="currentColor" stroke-width="4"/><path d="M16 16l18 18M34 16L16 34" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>';

// ---------- imágenes ----------
const IM = {};
const carga = (k, src) => new Promise((ok) => { const im = new Image(); im.onload = () => { IM[k] = {src, w: im.naturalWidth, h: im.naturalHeight, ok: im.naturalWidth > 16}; ok(); }; im.onerror = () => { IM[k] = {ok: false}; ok(); }; im.src = src; });
const LISTA = [['logo', A2 + 'logo.png'], ['cert', A2 + 'cert.png'], ['consola', A2 + 'consola.png'], ...[1, 2, 3, 4, 5, 6, 7, 8].map((i) => ['m' + i, A2 + 'm' + i + '.png']),
  ...[0, 1, 2, 3, 4, 5].map((i) => ['c' + i, A + 'c' + i + '_5.png']), ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => ['x' + i, A + 'x' + i + '.jpg'])];
const tiene = (k) => !!(IM[k] && IM[k].ok);
const img = (k, st = '') => (tiene(k) ? `<img class="img" src="${IM[k].src}" style="${st}">` : '');
const mods = () => [1, 2, 3, 4, 5, 6, 7, 8].map((i) => 'm' + i).filter(tiene);
const fotos = () => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => 'x' + i).filter(tiene);
const recortes = () => [0, 1, 2, 3, 4, 5].map((i) => 'c' + i).filter(tiene);

// ---------- piezas ----------
const fit = (el, maxH, min = 34) => { let fs = parseFloat(getComputedStyle(el).fontSize), n = 0; while ((el.offsetHeight > maxH || el.scrollWidth > el.clientWidth + 2) && fs > min && n++ < 50) { fs *= .94; el.style.fontSize = fs + 'px'; } };
// bloque de texto: etiqueta (k), título (t) y frase (s)
function texto(c, o) {
  const b = $(`<div class="abs${o.c ? ' ctr' : ''}" style="left:${o.x}px;top:${o.y}px;width:${o.w}px"></div>`), at = o.at == null ? .15 : o.at;
  let K, T, S;
  if (o.k) b.appendChild(K = $(`<div class="K" style="margin-bottom:22px${o.kc ? ';color:' + o.kc : ''}">${esc(o.k)}</div>`));
  if (o.t) b.appendChild(T = $(`<div class="T" style="font-size:${o.size || 110}px${o.tc ? ';color:' + o.tc : ''}">${pal(o.t)}</div>`));
  if (o.s) b.appendChild(S = $(`<div class="P" style="margin-top:${o.sm || 26}px;font-size:${o.ss || 44}px${o.sc ? ';color:' + o.sc : ''}">${pal(o.s)}</div>`));
  (o.en || c.cam).appendChild(b);
  if (T) fit(T, o.maxH || 420);
  const tl = c.tl;
  if (K) tl.from(K, {autoAlpha: 0, x: o.c ? 0 : -40, letterSpacing: '.7em', duration: .8, ease: 'power3.out'}, at);
  if (T) {
    const w = T.querySelectorAll('.wi');
    if (DIR === 4) tl.from(w, {scale: 2.4, autoAlpha: 0, duration: .45, ease: 'power4.out', stagger: .09}, at + .05);
    else if (DIR === 5) tl.from(w, {yPercent: 40, autoAlpha: 0, filter: 'blur(14px)', duration: 1.1, ease: 'power2.out', stagger: .09}, at + .1);
    else if (DIR === 3) tl.from(w, {autoAlpha: 0, x: -18, duration: .05, stagger: .06}, at + .1);
    else if (DIR === 2) tl.from(w, {yPercent: 110, rotation: 4, duration: .9, ease: 'expo.out', stagger: .07}, at + .1);
    else tl.from(w, {yPercent: 125, duration: .9, ease: 'expo.out', stagger: .07}, at + .1);
    const kk = T.querySelectorAll('.k .wi'); if (kk.length) tl.fromTo(kk, {backgroundPosition: '0% 0'}, {backgroundPosition: '100% 0', duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(c.D / 2.4) + 1}, at + .8);
  }
  if (S) tl.from(S.querySelectorAll('.wi'), {yPercent: 120, autoAlpha: 0, duration: .7, ease: 'expo.out', stagger: .03}, o.sAt == null ? at + .6 : o.sAt);
  return b;
}
// imagen grande con su entrada propia de cada director, flotación y brillo
function objeto(c, k, o) {
  if (!tiene(k)) return null;
  const box = $(`<div class="abs" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"></div>`);
  if (o.halo !== false) box.appendChild($(`<div class="abs" style="inset:-12%;border-radius:50%;background:radial-gradient(closest-side,${DIR === 4 ? 'rgba(255,255,255,.5)' : 'var(--sombra)'},transparent 70%);opacity:.9"></div>`));
  const ob = $(`<div class="abs sombra" style="inset:0">${img(k, o.st || '')}</div>`); box.appendChild(ob);
  (o.en || c.cam).appendChild(box);
  const at = o.at == null ? .25 : o.at, tl = c.tl, d = o.dir || 1;
  if (DIR === 1) { tl.from(ob, {scale: .6, autoAlpha: 0, duration: .9, ease: 'back.out(1.6)'}, at); tl.fromTo(ob, {filter: 'drop-shadow(0 0 0 rgba(255,43,214,0)) brightness(2)'}, {filter: 'drop-shadow(0 0 40px rgba(255,43,214,.55)) brightness(1)', duration: .6}, at + .1); }
  else if (DIR === 2) tl.from(ob, {y: 260, rotation: d * 8, autoAlpha: 0, duration: 1.1, ease: 'expo.out'}, at);
  else if (DIR === 3) { tl.from(ob, {x: d * 120, autoAlpha: 0, duration: .5, ease: 'power3.out'}, at); tl.from(ob, {clipPath: 'inset(0 0 100% 0)', duration: .55, ease: 'power2.inOut'}, at); }
  else if (DIR === 4) tl.from(ob, {scale: 1.9, rotation: d * -14, autoAlpha: 0, duration: .45, ease: 'power4.out'}, at);
  else tl.from(ob, {y: 70, autoAlpha: 0, scale: .94, duration: 1.4, ease: 'power2.out'}, at);
  if (o.rot) gsap.set(ob, {rotation: o.rot});
  tl.to(ob, {y: '-=14', rotation: (o.rot || 0) + d * .8, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(c.D / 2.6) + 1}, at + 1.1);
  if (o.sfx !== false) c.fx(at + .1, DIR === 4 ? 'golpe' : 'whoosh');
  return box;
}
// lista de puntos: cada uno aparece cuando la voz lo nombra
function puntos(c, items, o) {
  const b = $(`<div class="abs" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;display:flex;flex-direction:column;gap:${o.gap || 24}px"></div>`);
  (o.en || c.cam).appendChild(b);
  items.forEach((it, j) => {
    const lab = DIR === 2 ? 'A' + (j + 1) : DIR === 3 ? String(j + 1).padStart(2, '0') : DIR === 5 ? '' : String(j + 1);
    const f = $(`<div class="fila" style="font-size:${o.size || 44}px">${DIR === 5 ? `<span style="flex:0 0 46px;height:2px;background:var(--a);margin-top:4px"></span>` : `<span class="n">${lab}</span>`}<span>${esc(it)}</span></div>`);
    if (DIR === 1) f.style.cssText += ';padding:16px 24px;border-radius:14px;background:rgba(255,255,255,.05);border:2px solid var(--line)';
    if (DIR === 4) f.style.cssText += ';background:#111;color:#fff;padding:16px 22px;font-family:Archivo;font-weight:800;text-transform:uppercase';
    b.appendChild(f);
    const t = c.cue(it.split(/\s+/).slice(0, 2).join(' '), (o.from || .32) + j * (o.paso || .17), (o.at || .6) + j * .25);
    if (DIR === 4) c.tl.from(f, {x: -260, autoAlpha: 0, duration: .32, ease: 'power4.out'}, t);
    else if (DIR === 3) c.tl.from(f, {autoAlpha: 0, x: 40, duration: .25}, t);
    else if (DIR === 5) c.tl.from(f, {autoAlpha: 0, y: 24, filter: 'blur(8px)', duration: .8, ease: 'power2.out'}, t);
    else c.tl.from(f, {autoAlpha: 0, x: -60, duration: .6, ease: 'expo.out'}, t);
    c.fx(t, DIR === 3 ? 'click' : 'pop');
  });
  if (o.maxH) { let fs = o.size || 44, n = 0; while (b.offsetHeight > o.maxH && fs > 30 && n++ < 20) { fs *= .94; b.querySelectorAll('.fila').forEach((x) => { x.style.fontSize = fs + 'px'; }); } }
  return b;
}
// ventana de software (director 3)
function ventana(c, o) {
  const w = $(`<div class="ui" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"><div class="bar"><b>●</b>${esc(o.titulo || '')}<span style="margin-left:auto">${esc(o.der || '')}</span></div></div>`);
  c.cam.appendChild(w);
  c.tl.from(w, {scaleY: .02, autoAlpha: 0, duration: .45, ease: 'power3.out'}, o.at || 0);
  return w;
}
function onda(c, o) {
  const w = $(`<div class="onda${o.b ? ' b' : ''}" style="left:${o.x}px;top:${o.y}px;width:${o.w}px;height:${o.h}px"></div>`);
  const n = Math.floor(o.w / 9);
  for (let i = 0; i < n; i++) { const v = .25 + .75 * Math.abs(Math.sin(i * .37 + DIR) * Math.cos(i * .11)); w.appendChild($(`<i style="height:${Math.round(v * o.h)}px"></i>`)); }
  (o.en || c.cam).appendChild(w);
  return w;
}
// el disco de vinilo (director 2)
function disco(c, o) {
  const d = $(`<div class="disco" style="left:${o.x}px;top:${o.y}px;width:${o.s}px;height:${o.s}px"><div class="lab">${esc(o.lab || '')}</div></div>`);
  c.cam.appendChild(d);
  c.tl.from(d, {x: o.desde || 600, autoAlpha: 0, duration: 1.2, ease: 'expo.out'}, o.at || 0);
  c.tl.fromTo(d, {rotation: 0}, {rotation: 33 * 6 * (c.D + 1) / 60 * 6, duration: c.D + 1, ease: 'none'}, 0);
  return d;
}
// fondo de foto real a pantalla completa (director 5); es un fondo, no una imagen encima del texto
function foto(c, k, o = {}) {
  if (!tiene(k)) return null;
  const f = $(`<div class="foto" style="background-image:url('${IM[k].src}')"></div>`); c.cam.insertBefore(f, c.cam.firstChild);
  const v = $(`<div class="velo${o.centro ? ' c' : ''}"></div>`); f.after(v);
  const dx = (o.dir || 1) * 50;
  c.tl.fromTo(f, {scale: 1.14, x: -dx}, {scale: 1.02, x: dx, duration: c.D + 1, ease: 'none'}, 0);
  return f;
}
// color de fondo por escena (director 4: cada escena cambia de color, como un cartel)
const C4 = [['#ffd400', '#111111', '#e62e2e'], ['#111111', '#ffd400', '#ffd400'], ['#e62e2e', '#ffffff', '#111111'], ['#f2efe6', '#111111', '#e62e2e']];
function cartel(c, n) {
  const [bg, ink, a] = C4[n % C4.length];
  c.el.style.setProperty('--ink', ink); c.el.style.setProperty('--cbg', bg); c.el.style.setProperty('--a', a); c.el.style.setProperty('--mut', ink); c.el.style.setProperty('--acc', `linear-gradient(90deg,${a},${a})`);
  c.cam.appendChild($(`<div class="abs" style="inset:0;background:${bg}"></div>`)); c.cam.appendChild($('<div class="trama"></div>'));
  return {bg, ink, a};
}
const flash = (c, at) => { const f = $('<div class="abs" style="inset:0;background:#fff;mix-blend-mode:screen;opacity:0"></div>'); c.cam.appendChild(f); c.tl.fromTo(f, {opacity: .85}, {opacity: 0, duration: .35}, at); };
const cuenta = (tl, el, a, b, at, dur, f = fmt) => { const o = {v: a}; el.textContent = f(a); tl.to(o, {v: b, duration: dur, ease: 'power2.out', onUpdate: () => { el.textContent = f(o.v); }}, at); };

// ================= ESCENAS =================
const S = {};
const tt = (sc, d) => sc.t || d;

// 1. Gancho: la idea del video en una frase grande
S.k_gancho = (c) => {
  const {sc} = c, t = tt(sc, PR.curso), s = sc.s, k = sc.k;
  if (DIR === 1) {
    flash(c, .05);
    texto(c, {x: 160, y: 250, w: 1600, c: 1, k, t, s, size: 132, maxH: 470});
    for (let i = 0; i < 6; i++) { const l = $(`<div class="laser${i % 2 ? ' c' : ''}" style="left:${200 + i * 300}px"></div>`); c.cam.insertBefore(l, c.cam.firstChild); c.tl.fromTo(l, {rotation: -35 + i * 12}, {rotation: 35 - i * 9, duration: c.D, ease: 'sine.inOut'}, 0); }
    c.fx(.05, 'golpe');
  } else if (DIR === 2) {
    disco(c, {x: 1080, y: 150, s: 820, lab: PR.curso_corto || '', at: 0});
    texto(c, {x: 120, y: 250, w: 920, k, t, s, size: 132, maxH: 560});
    c.fx(.1, 'whoosh');
  } else if (DIR === 3) {
    const w1 = ventana(c, {x: 80, y: 90, w: 1760, h: 230, titulo: 'DECK A', der: '124.0 BPM'}); onda(c, {x: 30, y: 80, w: 1700, h: 120, en: w1});
    const w2 = ventana(c, {x: 80, y: 760, w: 1760, h: 230, titulo: 'DECK B', der: '124.0 BPM', at: .1}); onda(c, {x: 30, y: 80, w: 1700, h: 120, b: 1, en: w2});
    texto(c, {x: 140, y: 360, w: 1640, c: 1, k, t, s, size: 100, maxH: 330, ss: 40});
    c.fx(.1, 'click');
  } else if (DIR === 4) {
    cartel(c, 0); const f = $('<div class="franja" style="top:880px;transform:rotate(-4deg)"></div>'); c.cam.appendChild(f); c.tl.from(f, {x: -900, duration: .6, ease: 'power4.out'}, .05);
    texto(c, {x: 110, y: 110, w: 1700, k, t, s, size: 190, maxH: 640, ss: 46});
    c.fx(.05, 'golpe');
  } else {
    foto(c, fotos()[0] || 'x1', {dir: 1});
    c.cam.appendChild($('<div class="abs franjas" style="inset:0"></div>'));
    texto(c, {x: 150, y: 300, w: 1100, k, t, s, size: 120, maxH: 520});
    c.fx(.1, 'riser');
  }
};

// 2. El problema: lo que hoy le frena (cada cosa se tacha cuando se nombra)
S.k_dolor = (c) => {
  const {sc} = c, items = (sc.items || []).slice(0, 4);
  const lista = (x, y, w, size) => {
    const b = $(`<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;display:flex;flex-direction:column;gap:26px"></div>`); c.cam.appendChild(b);
    items.forEach((it, j) => {
      const col = DIR === 4 ? 'var(--a)' : 'var(--b)', f = $(`<div class="fila" style="font-size:${size}px;color:var(--ink)"><span style="color:${col};flex:0 0 58px">${NO}</span><span class="tx" style="position:relative">${esc(it)}<i style="position:absolute;left:0;right:0;top:54%;height:5px;background:${col};transform-origin:0 50%"></i></span></div>`);
      if (DIR === 3) f.style.cssText += ';background:#1f141a;border:2px solid #4a2230;border-radius:12px;padding:18px 24px;font-family:JetBrains;font-size:' + (size - 6) + 'px';
      if (DIR === 4) f.style.cssText += ';background:#111;color:#fff;padding:16px 22px;font-family:Archivo;font-weight:800;text-transform:uppercase';
      b.appendChild(f);
      const t = c.cue(it.split(/\s+/).slice(0, 2).join(' '), .3 + j * .16, .5 + j * .3);
      c.tl.from(f, {autoAlpha: 0, x: -50, duration: .5, ease: 'expo.out'}, t);
      c.tl.from(f.querySelector('i'), {scaleX: 0, duration: .45, ease: 'power2.inOut'}, t + .55);
      c.fx(t + .55, 'click');
    });
    return b;
  };
  if (DIR === 1) { texto(c, {x: 140, y: 120, w: 1640, k: sc.k, t: sc.t, size: 96, maxH: 240}); lista(260, 430, 1400, 46); }
  else if (DIR === 2) { disco(c, {x: -420, y: 180, s: 820, lab: '', desde: -600}); texto(c, {x: 520, y: 120, w: 1280, k: sc.k, t: sc.t, size: 92, maxH: 260}); lista(520, 430, 1300, 44); }
  else if (DIR === 3) { const w = ventana(c, {x: 140, y: 90, w: 1640, h: 900, titulo: 'REGISTRO', der: '⚠ ' + items.length}); texto(c, {x: 200, y: 190, w: 1520, k: sc.k, t: sc.t, size: 84, maxH: 220}); lista(200, 450, 1520, 40); c.tl.from(w, {autoAlpha: 0}, 0); }
  else if (DIR === 4) { cartel(c, 1); texto(c, {x: 110, y: 90, w: 1700, k: sc.k, t: sc.t, size: 140, maxH: 330}); lista(110, 470, 1500, 46); }
  else { foto(c, fotos()[1] || fotos()[0], {dir: -1}); c.cam.appendChild($('<div class="abs franjas" style="inset:0"></div>')); texto(c, {x: 150, y: 170, w: 1300, k: sc.k, t: sc.t, size: 100, maxH: 280}); lista(150, 480, 1250, 42); }
};

// 3. El curso: logo y todos los módulos juntos
S.k_curso = (c) => {
  const {sc} = c, M = mods(), n = M.length;
  const abanico = (cx, cy, h, sep, rot) => M.forEach((k, j) => {
    const w = h * ((IM[k].w / IM[k].h) || .73), x = cx + (j - (n - 1) / 2) * sep - w / 2;
    objeto(c, k, {x, y: cy - h / 2 + Math.abs(j - (n - 1) / 2) * 20, w, h, rot: (j - (n - 1) / 2) * rot, at: .5 + j * .18, halo: false, sfx: j === 0, dir: j % 2 ? 1 : -1});
  });
  if (DIR === 1) { objeto(c, 'logo', {x: 660, y: 70, w: 600, h: 300, at: .1}); abanico(960, 690, 400, 300, 5); texto(c, {x: 160, y: 930, w: 1600, c: 1, t: sc.t, size: 64, maxH: 110, at: 1.4}); }
  else if (DIR === 2) { objeto(c, 'logo', {x: 1160, y: 200, w: 640, h: 560, at: .3}); abanico(560, 540, 470, 200, 7); texto(c, {x: 120, y: 880, w: 900, t: sc.t, size: 60, maxH: 160, at: 1.4}); }
  else if (DIR === 3) {
    const w = ventana(c, {x: 80, y: 70, w: 1760, h: 940, titulo: 'BIBLIOTECA', der: n + ' MÓDULOS'});
    M.forEach((k, j) => { const x = 180 + j * 410, y = 220; objeto(c, k, {x, y, w: 340, h: 470, at: .4 + j * .2, halo: false, sfx: j === 0});
      const r = $(`<div class="abs" style="left:${x}px;top:${y + 500}px;width:340px;font-family:JetBrains;font-size:26px;color:var(--a);font-weight:700">MÓDULO ${String(j + 1).padStart(2, '0')}</div>`); c.cam.appendChild(r); c.tl.from(r, {autoAlpha: 0}, .6 + j * .2); });
    texto(c, {x: 180, y: 790, w: 1560, t: sc.t, size: 70, maxH: 180, at: 1.4}); c.tl.from(w, {autoAlpha: 0}, 0);
  } else if (DIR === 4) { cartel(c, 2); texto(c, {x: 100, y: 60, w: 1720, t: sc.t, size: 150, maxH: 300}); abanico(960, 700, 470, 390, 6); }
  else { foto(c, fotos()[2] || fotos()[0], {dir: 1, centro: 1}); c.cam.appendChild($('<div class="abs franjas" style="inset:0"></div>')); objeto(c, 'logo', {x: 710, y: 110, w: 500, h: 240, at: .2, halo: false}); abanico(960, 640, 400, 300, 4); texto(c, {x: 260, y: 880, w: 1400, c: 1, t: sc.t, size: 62, maxH: 110, at: 1.4}); }
};

// 4. Cada módulo: su portada grande, el nombre y 3 cosas que aprende
S.k_mod = (c) => {
  const {sc} = c, i = +sc.i || 0, mk = 'm' + (i + 1), M = (PR.mods || [])[i] || {}, items = (sc.items && sc.items.length ? sc.items : M.items || []).slice(0, 3);
  const k = sc.k || ('Módulo ' + (i + 1)), t = sc.t || M.t, s = sc.s || M.s, izq = (DIR === 2 || DIR === 4) ? i % 2 === 1 : i % 2 === 0;
  const ix = izq ? 120 : 1180, tx = izq ? 820 : 120;
  if (DIR === 3) {
    const w = ventana(c, {x: 70, y: 70, w: 1780, h: 940, titulo: 'DECK ' + 'ABCD'[i % 4], der: 'MÓDULO ' + String(i + 1).padStart(2, '0')});
    onda(c, {x: 30, y: 790, w: 1720, h: 90, en: w, b: i % 2});
    objeto(c, mk, {x: 150, y: 170, w: 470, h: 640, at: .25, halo: false});
    texto(c, {x: 700, y: 170, w: 1080, k, t, s, size: 74, maxH: 250, ss: 36});
    puntos(c, items, {x: 700, y: 560, w: 1080, size: 36, gap: 16, maxH: 270});
    c.tl.from(w, {autoAlpha: 0}, 0); return;
  }
  if (DIR === 4) cartel(c, 3 + i);
  if (DIR === 5) { foto(c, fotos()[(3 + i) % Math.max(1, fotos().length)], {dir: izq ? -1 : 1}); c.cam.appendChild($('<div class="abs franjas" style="inset:0"></div>')); }
  if (DIR === 2) disco(c, {x: izq ? 60 : 1100, y: 180, s: 760, lab: '', at: 0, desde: izq ? -600 : 600});
  objeto(c, mk, {x: ix + (DIR === 2 ? 60 : 0), y: DIR === 2 ? 170 : 120, w: 620, h: 840, at: .2, rot: DIR === 4 ? (izq ? -5 : 5) : 0, dir: izq ? -1 : 1});
  texto(c, {x: tx, y: 130, w: 980, k, t, s, size: DIR === 4 ? 116 : 90, maxH: 360, ss: 40});
  puntos(c, items, {x: tx, y: 560, w: 980, size: 40, gap: 20, maxH: 400});
};

// 5. Lo que va a poder hacer: 4 logros con su imagen
S.k_logros = (c) => {
  const {sc} = c, L = recortes().slice(0, 4), labs = (sc.items && sc.items.length ? sc.items : PR.logros || []).slice(0, L.length);
  if (DIR === 4) cartel(c, 1);
  if (DIR === 5) { foto(c, fotos()[4] || fotos()[0], {centro: 1}); c.cam.appendChild($('<div class="abs franjas" style="inset:0"></div>')); }
  texto(c, {x: 120, y: DIR === 5 ? 110 : 80, w: 1680, c: 1, k: sc.k, t: sc.t, size: DIR === 4 ? 120 : 84, maxH: 220});
  const n = L.length || 1, wcol = 1680 / n;
  L.forEach((k, j) => {
    const x = 120 + j * wcol, cuando = c.cue((labs[j] || '').split(/\s+/)[0], .28 + j * .16, .5 + j * .3);
    if (DIR === 3) { const w = ventana(c, {x: x + 14, y: 340, w: wcol - 28, h: 620, titulo: 'FX ' + (j + 1), at: cuando - .1}); }
    objeto(c, k, {x: x + 30, y: 370, w: wcol - 60, h: 420, at: cuando, halo: DIR !== 3, sfx: false, dir: j % 2 ? 1 : -1});
    const l = $(`<div class="abs ctr chip" style="left:${x + 20}px;top:820px;width:${wcol - 40}px;justify-content:center;font-size:36px">${esc(labs[j] || '')}</div>`);
    c.cam.appendChild(l); c.tl.from(l, {autoAlpha: 0, y: 30, duration: .5, ease: 'expo.out'}, cuando + .25); c.fx(cuando, DIR === 3 ? 'click' : 'pop');
  });
};

// 6. Hasta dónde llega: fotos reales del ambiente (montaje)
S.k_escena = (c) => {
  const {sc} = c, F = fotos().slice(0, 6);
  if (DIR === 5) {
    F.slice(0, 4).forEach((k, j) => { const f = $(`<div class="foto" style="background-image:url('${IM[k].src}');opacity:0"></div>`); c.cam.appendChild(f); const t0 = j * c.D / 4; c.tl.to(f, {opacity: 1, duration: .6}, t0); c.tl.fromTo(f, {scale: 1.15}, {scale: 1, duration: c.D / 4 + 1, ease: 'none'}, t0); });
    c.cam.appendChild($('<div class="velo"></div>')); c.cam.appendChild($('<div class="abs franjas" style="inset:0"></div>'));
    texto(c, {x: 150, y: 600, w: 1200, k: sc.k, t: sc.t, s: sc.s, size: 104, maxH: 300, at: .4}); return;
  }
  if (DIR === 4) cartel(c, 0);
  texto(c, {x: 120, y: 80, w: 1680, c: 1, k: sc.k, t: sc.t, size: DIR === 4 ? 130 : 86, maxH: 220});
  const n = Math.min(F.length, 5), W = 330, H = 420;
  F.slice(0, n).forEach((k, j) => {
    const x = 960 + (j - (n - 1) / 2) * (W + 24) - W / 2, y = 400 + (DIR === 2 ? Math.abs(j - (n - 1) / 2) * 30 : 0);
    const f = $(`<div class="abs" style="left:${x}px;top:${y}px;width:${W}px;height:${H}px;background:url('${IM[k].src}') center/cover;border-radius:${DIR === 4 ? 0 : 18}px;${DIR === 1 ? 'box-shadow:0 0 0 3px var(--a),0 0 40px var(--a)' : DIR === 2 ? 'border:10px solid #f6ead3;box-shadow:0 30px 60px rgba(0,0,0,.5)' : DIR === 3 ? 'border:2px solid #263040' : 'border:8px solid #111'}"></div>`);
    c.cam.appendChild(f);
    const at = .5 + j * .22;
    if (DIR === 2) c.tl.from(f, {y: 400, rotation: (j - 2) * 6, autoAlpha: 0, duration: .9, ease: 'expo.out'}, at);
    else if (DIR === 4) c.tl.from(f, {scale: 1.8, autoAlpha: 0, duration: .35, ease: 'power4.out'}, at);
    else c.tl.from(f, {y: 80, autoAlpha: 0, duration: .7, ease: 'expo.out'}, at);
    c.tl.fromTo(f, {backgroundPosition: '50% 40%'}, {backgroundPosition: '50% 60%', duration: c.D, ease: 'none'}, 0);
    if (j % 2 === 0) c.fx(at, DIR === 4 ? 'golpe' : 'whoosh');
  });
  if (sc.s) texto(c, {x: 120, y: 880, w: 1680, c: 1, s: sc.s, ss: 42, at: 1.6});
};

// 7. Certificado
S.k_cert = (c) => {
  const {sc} = c;
  if (DIR === 4) cartel(c, 3);
  if (DIR === 5) { foto(c, fotos()[5] || fotos()[0], {centro: 1}); c.cam.appendChild($('<div class="abs franjas" style="inset:0"></div>')); }
  if (DIR === 2) disco(c, {x: 1180, y: 160, s: 760, lab: '', at: 0});
  if (DIR === 3) ventana(c, {x: 900, y: 120, w: 900, h: 840, titulo: 'CERTIFICADO.PDF', der: '✓'});
  objeto(c, 'cert', {x: DIR === 3 ? 940 : 980, y: DIR === 3 ? 230 : 190, w: 820, h: 640, at: .3, rot: DIR === 4 ? 4 : DIR === 2 ? -3 : 0});
  texto(c, {x: 120, y: 260, w: 780, k: sc.k, t: sc.t, s: sc.s, size: DIR === 4 ? 120 : 92, maxH: 420, ss: 40});
  c.fx(c.cue('certificado', .5, .8), 'ding');
};

// 8. Alumnos: el contador sube, estrellas y lo que dicen
S.k_alumnos = (c) => {
  const {sc} = c, N = +PR.alumnos || 0, R5 = +PR.rating || 0, T = (PR.testimonios || []).slice(0, 2);
  if (DIR === 4) cartel(c, 1);
  if (DIR === 5) { foto(c, fotos()[6] || fotos()[0], {dir: 1}); c.cam.appendChild($('<div class="abs franjas" style="inset:0"></div>')); }
  const big = $(`<div class="abs ${DIR === 5 ? '' : 'ctr'}" style="left:${DIR === 5 ? 150 : 0}px;top:${DIR === 4 ? 70 : 110}px;width:${DIR === 5 ? 1000 : 1920}px"><div class="T" style="font-size:${DIR === 4 ? 300 : 210}px;line-height:1"><span class="w k"><span class="wi num">+0</span></span></div><div class="K" style="margin-top:14px">${esc(sc.k || 'alumnos')}</div></div>`);
  c.cam.appendChild(big);
  const num = big.querySelector('.num'), at = c.cue('alumnos', .2, .4);
  c.tl.from(big, {autoAlpha: 0, scale: .8, duration: .6, ease: 'expo.out'}, .1);
  const o = {v: 0}; c.tl.to(o, {v: N, duration: 1.8, ease: 'power2.out', onUpdate: () => { num.textContent = '+' + fmt(o.v); }}, Math.max(.2, at - .9));
  for (let i = 0; i < 6; i++) c.fx(Math.max(.2, at - .9) + i * .28, 'tick');
  if (R5) { const st = $(`<div class="abs ${DIR === 5 ? '' : 'ctr'}" style="left:${DIR === 5 ? 150 : 0}px;top:${DIR === 4 ? 470 : 430}px;width:${DIR === 5 ? 1000 : 1920}px;font-family:var(--fb);font-weight:700;font-size:44px;color:var(--ink)"><span class="estrella">★★★★★</span>&nbsp; ${String(R5).replace('.', ',')} de calificación</div>`); c.cam.appendChild(st); c.tl.from(st, {autoAlpha: 0, y: 30, duration: .6}, at + .6); }
  const wy = DIR === 4 ? 620 : 600;
  T.forEach((x, j) => {
    const left = DIR === 5 ? 150 + j * 820 : 160 + j * 820;
    const card = $(`<div class="abs cita" style="left:${left}px;top:${wy}px;width:780px;padding:30px 36px;border-radius:${DIR === 4 ? 0 : 18}px;background:${DIR === 4 ? '#111' : 'var(--panel)'};${DIR === 4 ? 'color:#fff' : ''};border:2px solid var(--line)">“${esc(x.txt)}”<b>— ${esc(x.nombre)}</b></div>`);
    c.cam.appendChild(card); c.tl.from(card, {autoAlpha: 0, y: 50, duration: .7, ease: 'expo.out'}, at + 1 + j * .5); c.fx(at + 1 + j * .5, 'pop');
  });
};

// 9. Garantía: los días se encienden uno a uno
S.k_garantia = (c) => {
  const {sc} = c, n = +PR.dias || 7;
  if (DIR === 4) cartel(c, 2);
  if (DIR === 5) { foto(c, fotos()[7] || fotos()[0], {centro: 1}); c.cam.appendChild($('<div class="abs franjas" style="inset:0"></div>')); }
  texto(c, {x: 120, y: 90, w: 1680, c: 1, k: sc.k, t: sc.t, size: DIR === 4 ? 130 : 96, maxH: 250});
  const W = 190, gap = 26, x0 = 960 - (n * W + (n - 1) * gap) / 2;
  for (let j = 0; j < n; j++) {
    const d = $(`<div class="abs ctr" style="left:${x0 + j * (W + gap)}px;top:430px;width:${W}px;height:230px;border-radius:${DIR === 2 ? '50%' : DIR === 4 ? '0' : '18px'};border:3px solid var(--line);background:var(--panel);display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:var(--ft);color:var(--ink)"><div style="font-family:var(--fm);font-size:24px;letter-spacing:.2em;color:var(--mut)">DÍA</div><div style="font-size:96px;line-height:1">${j + 1}</div></div>`);
    c.cam.appendChild(d);
    const at = .7 + j * Math.min(.35, (c.vz * .6) / n);
    c.tl.from(d, {autoAlpha: 0, y: 40, duration: .4, ease: 'back.out(2)'}, at);
    c.tl.to(d, {background: DIR === 4 ? '#111' : 'var(--a)', color: DIR === 4 ? '#fff' : 'var(--sobre)', borderColor: 'var(--a)', duration: .25}, at + .25);
    c.fx(at + .25, 'tick');
  }
  if (sc.s) texto(c, {x: 160, y: 740, w: 1600, c: 1, s: sc.s, ss: 46, at: c.cue('devolvemos', .55, 1.4)});
};

// 10. Cierre: todo lo que recibe y el llamado a comprar (+5 s finales)
S.k_cta = (c) => {
  const {sc} = c, items = (sc.items || []).slice(0, 4), M = mods();
  if (DIR === 4) cartel(c, 0);
  if (DIR === 5) { foto(c, fotos()[0], {centro: 1}); c.cam.appendChild($('<div class="abs franjas" style="inset:0"></div>')); }
    if (DIR === 1) for (let i = 0; i < 6; i++) { const l = $(`<div class="laser${i % 2 ? ' c' : ''}" style="left:${200 + i * 300}px"></div>`); c.cam.insertBefore(l, c.cam.firstChild); c.tl.fromTo(l, {rotation: 30 - i * 10}, {rotation: -30 + i * 12, duration: c.D, ease: 'sine.inOut'}, 0); }
  const kx = 160, k = M[0] || 'logo';
  objeto(c, tiene('logo') ? 'logo' : k, {x: kx, y: 200, w: 640, h: 420, at: .2, halo: DIR !== 3});
  if (M.length) M.slice(0, 4).forEach((m, j) => objeto(c, m, {x: kx + 20 + j * 150, y: 640, w: 170, h: 240, at: .6 + j * .12, halo: false, sfx: false}));
  texto(c, {x: 900, y: 120, w: 900, k: sc.k, t: sc.t, size: DIR === 4 ? 110 : 84, maxH: 300});
  puntos(c, items, {x: 900, y: 450, w: 900, size: 40, gap: 18, maxH: 330});
  const bt = $(`<div class="abs" style="left:900px;top:860px"><div class="btn">${esc(sc.boton || 'Comprar ahora')}</div></div>`); c.cam.appendChild(bt);
  const ab = c.cue(sc.boton || 'comprar', .7, 1.6);
  c.tl.from(bt, {autoAlpha: 0, scale: .6, duration: .6, ease: 'back.out(2)'}, ab);
  c.tl.to(bt.firstChild, {scale: 1.06, duration: .5, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil((c.D - ab) / .5) + 1}, ab + .6);
  c.fx(ab, 'venta');
};

S.k_texto = (c) => { const {sc} = c; if (DIR === 4) cartel(c, c.i); if (DIR === 5) { foto(c, fotos()[c.i % Math.max(1, fotos().length)], {centro: 1}); c.cam.appendChild($('<div class="abs franjas" style="inset:0"></div>')); }
  texto(c, {x: 160, y: 300, w: 1600, c: 1, k: sc.k, t: sc.t, s: sc.s, size: DIR === 4 ? 150 : 110, maxH: 480}); };

// ================= FONDO DE CADA DIRECTOR =================
const AMB = [];
function fondo(bg) {
  if (DIR === 1) {
    bg.appendChild($('<div class="piso"></div>'));
    const eq = $('<div class="eq"></div>'); const bars = Array.from({length: 64}, () => { const i = document.createElement('i'); eq.appendChild(i); return i; }); bg.appendChild(eq);
    AMB.push((t) => bars.forEach((b, j) => { b.style.height = (18 + 120 * Math.abs(Math.sin(t * 3.1 + j * .55) * Math.cos(t * 1.7 + j * .23))) + 'px'; }));
  } else if (DIR === 2) {
    const d = $('<div class="disco" style="left:1320px;top:560px;width:1100px;height:1100px;opacity:.22;filter:blur(2px)"></div>'); bg.appendChild(d);
    AMB.push((t) => { d.style.transform = `rotate(${t * 120}deg)`; });
  } else if (DIR === 3) {
    const o = $('<div class="onda" style="left:0;top:1030px;width:3840px;height:44px;opacity:.35"></div>'); for (let i = 0; i < 420; i++) o.appendChild($(`<i style="height:${Math.round(8 + 36 * Math.abs(Math.sin(i * .41) * Math.cos(i * .13)))}px"></i>`)); bg.appendChild(o);
    AMB.push((t) => { o.style.transform = `translateX(${-((t * 140) % 1920)}px)`; });
  } else if (DIR === 4) {
    bg.appendChild($('<div class="trama"></div>'));
  } else {
    const f = $('<div class="fuga" style="left:-300px;top:-400px"></div>'); bg.appendChild(f);
    AMB.push((t) => { f.style.transform = `translate(${Math.sin(t * .2) * 600 + 700}px,${Math.cos(t * .15) * 200}px)`; f.style.opacity = .5 + .4 * Math.sin(t * .7); });
  }
}

// ================= MONTAJE Y TRANSICIONES =================
function montar() {
  const B = document.body, bg = $('<div id="bg"></div>'), ESC = $('<div id="esc"></div>'), FX = $('<div id="fx"></div>'), top = $('<div id="top"><div class="grano"></div></div>');
  B.append(bg, ESC, FX, top); fondo(bg);
  const gr = top.firstChild; AMB.push((t) => { gr.style.transform = `translate(${(t * 997) % 40 - 20}px,${(t * 773) % 40 - 20}px)`; });
  const M = gsap.timeline({paused: true});
  const tapa = $('<div class="abs" style="inset:0;opacity:0;background:#fff"></div>'); FX.appendChild(tapa);
  const barras = [0, 1, 2].map((j) => { const b = $(`<div class="abs" style="left:-2200px;top:${j * 360}px;width:2000px;height:360px;background:${['#111', '#e62e2e', '#ffd400'][j]}"></div>`); FX.appendChild(b); return b; });
  V.escenas.forEach((sc, i) => {
    const el = $('<div class="sc"><div class="cam"></div></div>'); ESC.appendChild(el); sc.el = el;
    const tl = gsap.timeline(), vz = sc.vz || Math.max(1.2, sc.vd - .7), ade = i ? .14 : 0;
    const cue = (w, def, min) => { const v = norm(sc.voz), k = w ? v.indexOf(norm(w)) : -1; const t = k < 0 ? (def == null ? null : .22 + def * vz) : Math.max(.2, .22 + (k / Math.max(1, v.length)) * vz - .12); return t == null ? null : Math.max(t, min || 0); };
    try { (S[sc.c] || S.k_texto)({sc, i, el, cam: el.firstChild, tl, D: sc.dur, vz, cue, fx: (t, n) => sfx(sc.t0 - ade + t, n)}); }
    catch (e) { console.error(e); window.__errores = (window.__errores || []).concat(sc.c + ': ' + e.message); }
    tl.fromTo(el.firstChild, {scale: 1}, {scale: DIR === 5 ? 1.05 : 1.03, duration: sc.dur + .6, ease: 'none'}, 0);
    M.add(tl, sc.t0 - ade);
    if (i === 0) { el.style.visibility = 'visible'; M.from(el, {opacity: 0, duration: .5}, 0); return; }
    const pv = V.escenas[i - 1].el, t = sc.t0;
    let on = t - .02, off = t + .02;
    if (DIR === 1) {  // destello y corte con desfase de color
      M.fromTo(tapa, {opacity: 0}, {opacity: .9, duration: .06}, t - .06); M.to(tapa, {opacity: 0, duration: .28}, t);
      M.fromTo(el, {x: 40, filter: 'hue-rotate(90deg) saturate(2)'}, {x: 0, filter: 'hue-rotate(0deg) saturate(1)', duration: .3, ease: 'power2.out'}, t);
    } else if (DIR === 2) {  // se abre en círculo desde el centro del disco
      on = t - .3; off = t + .25;
      M.fromTo(el, {clipPath: 'circle(0% at 70% 50%)'}, {clipPath: 'circle(150% at 70% 50%)', duration: .6, ease: 'power2.inOut'}, on); M.set(el, {clipPath: 'none'}, on + .62);
    } else if (DIR === 3) {  // la cabina se desliza como cambiar de pista
      off = t + .1; M.to(pv, {x: -1920, duration: .3, ease: 'power3.in'}, t - .22); M.fromTo(el, {x: 1920}, {x: 0, duration: .36, ease: 'power3.out'}, t - .08);
    } else if (DIR === 4) {  // tres barras de color cruzan la pantalla
      on = t; off = t + .05;
      barras.forEach((b, j) => { M.fromTo(b, {x: 0}, {x: 2000 + 2200, duration: .5, ease: 'power3.inOut'}, t - .3 + j * .05); });
    } else {  // fundido lento con destello de luz
      on = t - .4; off = t + .4;
      M.fromTo(el, {opacity: 0}, {opacity: 1, duration: .8, ease: 'sine.inOut'}, on);
      M.fromTo(tapa, {opacity: 0, background: '#ffb35a'}, {opacity: .35, duration: .4, yoyo: true, repeat: 1}, t - .4);
    }
    M.set(el, {visibility: 'visible'}, on); M.set(pv, {visibility: 'hidden'}, off);
    if (DIR !== 4 && i % 3 === 0) sfx(t - .2, 'whoosh');
    if (DIR === 4) sfx(t - .1, 'golpe');
  });
  window.__seek = (t) => { M.time(Math.max(0, t), false); AMB.forEach((f) => f(t)); };
  window.__seek(0); window.__listo = true;
}
const FUENTES = [PAL.ft, PAL.fb, PAL.fm];
Promise.all([...LISTA.map(([k, s]) => carga(k, s)), ...FUENTES.flatMap((f) => [400, 500, 700, 800].map((w) => document.fonts.load(`${w} 40px ${f}`))), document.fonts.load('italic 400 40px Instrument'), document.fonts.load('italic 400 40px DMSerif')])
  .then(() => document.fonts.ready).then(montar).catch((e) => { console.error(e); window.__errores = [String(e)]; window.__listo = true; });
})();
