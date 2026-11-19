// Motor PRO (17 nov 2026). window.V = {estilo, escenas:[{c, t0, vd, dur, vz, voz, ...}], prod, assets, assets2}.
// Cada escena es un componente con su línea de tiempo (GSAP en pausa). __seek(t) deja el video exactamente en el segundo t.
// Reglas: una idea por escena, lo que se nombra aparece cuando se nombra (cue), nada estático (cámara + flotación),
// imágenes grandes y recortadas, textos nunca encima de imágenes.
(() => {
const V = window.V, E = V.estilo, P = E.pal, A = V.assets, A2 = V.assets2 || A, PR = V.prod || {}, VAR = (E.var || 1) - 1;
gsap.defaults({lazy: false, overwrite: false}); gsap.config({nullTargetWarn: false});
const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
const R = document.documentElement.style;
Object.entries({bg: P.bg, a: P.a, b: P.b, c: P.c, sup: P.sup, ink: P.ink, mut: P.mut, sobre: P.sobre, aB: rgba(P.a, .5), aS: rgba(P.a, .32), halo: rgba(P.a, .26), luz: rgba(P.b, .34), luz2: rgba(P.a, .1),
  mutB: rgba(P.mut, .3), inkB: rgba(P.ink, .42), ft: E.dir ? E.dirFt || 'Montserrat' : E.ft || 'Montserrat', fb: E.fb || 'Montserrat', fw: E.dir ? E.dirFw || (E.dirFt ? 800 : 900) : E.fw || 800, ls: E.dir ? E.dirLs || (E.dirFt ? '-.015em' : '-.035em') : E.ls || '-.02em', kst: !E.dir && /Playfair|Fraunces/.test(E.ft || '') ? 'italic' : 'normal'})
  .forEach(([k, v]) => R.setProperty('--' + k, v));
let seed = 7 + VAR * 101; const rnd = () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const $ = (html) => { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; };
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
// texto en palabras enmascaradas; *así* marca el acento (dorado + subrayado)
const pal = (s, ul = true) => String(s || '').split('*').map((seg, j) => seg.split(/\s+/).filter(Boolean).map((w) =>
  `<span class="w${j % 2 ? ' k' : ''}"><span class="wi">${esc(w)}</span>${j % 2 && ul ? '<i class="ul"></i>' : ''}</span>`).join(' ')).join(' ');
window.SFX = []; const sfx = (t, n) => window.SFX.push([Math.max(0, +(+t).toFixed(2)), n]);
const money = (n) => '$' + (Math.round(n * 100) / 100).toLocaleString('en-US');
const OK = '<svg class="ok" viewBox="0 0 50 50"><circle cx="25" cy="25" r="22" pathLength="1" transform="rotate(-90 25 25)"/><path d="M15 26l7 7 14-15" pathLength="1"/></svg>';
const ICO = {
  candado: '<svg viewBox="0 0 40 40" width="34" height="34"><path d="M12 18v-5a8 8 0 0116 0v5" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/><rect x="7" y="18" width="26" height="18" rx="5" fill="currentColor"/></svg>',
  palomita: '<svg viewBox="0 0 40 40" width="34" height="34"><circle cx="20" cy="20" r="18" fill="currentColor"/><path d="M11 21l6 6 12-13" fill="none" stroke="var(--bg)" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  escudo: '<svg viewBox="0 0 40 40" width="34" height="34"><path d="M20 3l14 5v10c0 9-6 15-14 19C12 33 6 27 6 18V8z" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linejoin="round"/><path d="M13 20l5 5 9-10" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  vuelta: '<svg viewBox="0 0 40 40" width="38" height="38"><path d="M8 20a12 12 0 1 0 4-9" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round"/><path d="M6 6v8h8" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  equis: '<svg viewBox="0 0 40 40" width="64" height="64"><circle cx="20" cy="20" r="17" fill="none" stroke="currentColor" stroke-width="2.6"/><path d="M13 13l14 14M27 13L13 27" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
};

// ---------- imágenes ----------
const IM = {};
const carga = (k, src) => new Promise((ok) => { const im = new Image(); im.onload = () => { IM[k] = {src, el: im, w: im.naturalWidth, h: im.naturalHeight, ok: im.naturalWidth > 16}; ok(); }; im.onerror = () => { IM[k] = {src, ok: false}; ok(); }; im.src = src; });
const N = (PR.cont || []).length;
const lista = [['pack', A + 'pack_5.png'], ['prop', A + 'prop1.png'], ['cert', A2 + 'cert.png'], ['consola', A2 + 'consola.png'], ...[...Array.from({length: 12}, (_, i) => 'm' + (i + 1)), 'logo'].map((k) => [k, A2 + k + '.png']), ...Array.from({length: 12}, (_, i) => ['x' + (i + 1), A + 'x' + (i + 1) + '.jpg']), ...Array.from({length: N}, (_, i) => ['c' + i, A + 'c' + i + '_5.png'])];
const img = (k, st = '') => (IM[k] && IM[k].ok ? `<img src="${IM[k].src}" style="${st}">` : '');

// ---------- utilidades de animación ----------
const fit = (el, maxH, min = 30) => { let fs = parseFloat(getComputedStyle(el).fontSize), n = 0; while ((el.offsetHeight > maxH || el.scrollWidth > el.clientWidth + 2) && fs > min && n++ < 40) { fs *= .95; el.style.fontSize = fs + 'px'; } };
const draw = (tl, els, at, dur = .7, ease = 'power2.inOut') => { tl.fromTo(els, {strokeDasharray: 1, strokeDashoffset: 1}, {strokeDashoffset: 0, duration: dur, ease}, at); tl.fromTo(els, {opacity: 0}, {opacity: 1, duration: .04}, at); };
const sube = (tl, els, at, o = {}) => tl.from(els, Object.assign({y: 46, autoAlpha: 0, duration: .8, ease: 'power3.out', stagger: .08}, o), at);
const salta = (tl, els, at, o = {}) => tl.from(els, Object.assign({scale: .5, autoAlpha: 0, duration: .65, ease: 'back.out(1.9)', stagger: .07}, o), at);
const flota = (tl, el, D, o = {}) => { const d = o.d || 2.6; tl.to(el, Object.assign({y: '-=14', duration: d, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(D / d) + 1}, o.v || {}), o.at || 1.2); };
const onda = (c, x, y, at, r = 220) => { const o = $(`<div class="abs" style="left:${x - r}px;top:${y - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;border:3px solid var(--c)"></div>`); c.cam.appendChild(o); c.tl.fromTo(o, {scale: .25, opacity: 0}, {scale: 1, opacity: 0, duration: .9, ease: 'power2.out', keyframes: {opacity: [0, .8, 0]}}, at); return o; };
const cuenta = (tl, el, a, b, at, dur, f = money, ease = 'power2.out') => { const o = {v: a}; el.textContent = f(a); tl.to(o, {v: b, duration: dur, ease, onUpdate: () => { el.textContent = f(Math.round(o.v)); }}, at); };

// bloque de texto: etiqueta (K), título (T) y frase (S). Devuelve el bloque.
function texto(c, o) {
  const b = $(`<div class="abs${o.c ? ' ctr' : ''}" style="left:${o.x}px;top:${o.y}px;width:${o.w}px"></div>`), at = o.at == null ? .15 : o.at;
  let K, T, S;
  if (o.k) b.appendChild(K = $(`<div class="K${o.c ? ' c' : ''}" style="margin-bottom:24px">${esc(o.k)}</div>`));
  if (o.t) b.appendChild(T = $(`<div class="T" style="font-size:${o.size || 108}px">${pal(o.t, o.ul !== false)}</div>`));
  if (o.s) b.appendChild(S = $(`<div class="P${o.plano ? '' : ' s'}" style="margin-top:${o.sm || 26}px${o.ss ? ';font-size:' + o.ss + 'px' : ''}">${pal(o.s, false)}</div>`));
  (o.en || c.cam).appendChild(b);
  if (T && o.maxH) fit(T, o.maxH);
  if (K) c.tl.from(K, {autoAlpha: 0, x: o.c ? 0 : -40, letterSpacing: '.6em', duration: .8, ease: 'power3.out'}, at);
  if (T) { c.tl.from(T.querySelectorAll('.wi'), {yPercent: 125, duration: 1, ease: 'expo.out', stagger: .075}, at + .1); const u = T.querySelectorAll('.ul'); if (u.length) c.tl.from(u, {scaleX: 0, duration: .75, ease: 'power3.inOut', stagger: .1}, at + .6); }
  if (S) c.tl.from(S.querySelectorAll('.wi'), {yPercent: 125, duration: .8, ease: 'expo.out', stagger: .035}, o.sAt == null ? at + .65 : o.sAt);
  return b;
}
// objeto grande (imagen recortada) con halo, sombra de piso, entrada en 3D, flotación y un destello
function objeto(c, k, o) {
  const s = o.s, cx = o.x + s / 2, dir = o.dir || 1;
  const box = $(`<div class="abs" style="left:${o.x}px;top:${o.y}px;width:${s}px;height:${s}px"></div>`);
  if (o.rayos) box.appendChild($(`<div class="rayos" style="left:${-s * .22}px;top:${-s * .22}px;width:${s * 1.44}px;height:${s * 1.44}px"></div>`));
  box.appendChild($(`<div class="halo" style="left:${-s * .1}px;top:${-s * .1}px;width:${s * 1.2}px;height:${s * 1.2}px"></div>`));
  box.appendChild($(`<div class="piso" style="left:${s * .1}px;width:${s * .8}px;bottom:${-18}px"></div>`));
  const ob = $(`<div class="obj" style="inset:0"><div style="position:relative;width:100%;height:100%;display:flex;align-items:center;justify-content:center">${img(k)}<div class="brillo" style="-webkit-mask:url(${IM[k] && IM[k].src}) center/contain no-repeat;mask:url(${IM[k] && IM[k].src}) center/contain no-repeat;background-size:300% 100%"></div></div></div>`);
  box.appendChild(ob); c.cam.appendChild(box);
  const in_ = ob.firstChild, at = o.at == null ? .2 : o.at, tl = c.tl;
  const ry = box.querySelector('.rayos'), ha = box.querySelector('.halo'), pi = box.querySelector('.piso');
  if (ry) { tl.fromTo(ry, {scale: .2, opacity: 0}, {scale: 1, opacity: .55, duration: 1.4, ease: 'expo.out'}, at); tl.to(ry, {rotation: 40, duration: c.D + 1, ease: 'none'}, 0); }
  tl.from(ha, {scale: .4, opacity: 0, duration: 1.2, ease: 'power2.out'}, at);
  tl.from(pi, {scaleX: .3, opacity: 0, duration: 1, ease: 'power2.out'}, at + .2);
  tl.from(in_, o.sube ? {y: 300, scale: .5, autoAlpha: 0, duration: 1.25, ease: 'back.out(1.25)'} : {x: dir * 300, rotationY: -dir * 42, scale: .8, autoAlpha: 0, duration: 1.25, ease: 'expo.out'}, at);
  tl.fromTo(in_.querySelector('.brillo'), {backgroundPosition: '130% 0'}, {backgroundPosition: '-30% 0', duration: 1.1, ease: 'power2.inOut'}, at + .75);
  tl.fromTo(ob, {scale: 1}, {scale: 1.045, duration: c.D + .5, ease: 'none'}, 0);
  flota(tl, ob, c.D, {at: at + 1.2, v: {rotation: dir * .9}});
  return box;
}

// el objeto del nicho (imagen real) como capa de profundidad: grande, desenfocado y en movimiento lento
function decor(c, o) {
  if (!IM.prop || !IM.prop.ok) return;
  const d = $(`<div class="abs" style="left:${o.x}px;top:${o.y}px;width:${o.s}px;height:${o.s}px;opacity:${o.o || .5};filter:blur(${o.b == null ? 7 : o.b}px) saturate(.9)">${img('prop', 'width:100%;height:100%;object-fit:contain')}</div>`);
  c.cam.insertBefore(d, c.cam.firstChild);
  c.tl.from(d, {autoAlpha: 0, scale: .8, duration: 1.6, ease: 'power2.out'}, o.at || .1);
  c.tl.fromTo(d, {y: 30, rotation: (o.r || 0) - 3}, {y: -30, rotation: (o.r || 0) + 3, duration: c.D + 1, ease: 'sine.inOut'}, 0);
}

// ================= ESCENAS =================
const S = {};

// Compra confirmada: sello que se dibuja, destello, confeti dorado y la tarjeta del pedido
S.felicita = (c) => {
  const {cam, tl, sc} = c, cx = 960, cy = 290;
  decor(c, {x: -150, y: 420, s: 760, r: -8}); decor(c, {x: 1420, y: -120, s: 560, r: 10, b: 10, o: .35});
  cam.appendChild($(`<div class="rayos" style="left:${cx - 480}px;top:${cy - 480}px;width:960px;height:960px"></div>`));
  cam.appendChild($(`<div class="halo" style="left:${cx - 330}px;top:${cy - 330}px;width:660px;height:660px"></div>`));
  const cf = $('<div class="conf abs" style="inset:0"></div>'); cam.appendChild(cf);
  const se = $(`<svg class="abs" style="left:${cx - 215}px;top:${cy - 215}px;overflow:visible" width="430" height="430" viewBox="0 0 340 340">
    <circle cx="170" cy="170" r="138" fill="${rgba(P.a, .1)}"/><circle class="d" cx="170" cy="170" r="150" fill="none" stroke="${P.a}" stroke-width="8" pathLength="1" transform="rotate(-90 170 170)" stroke-linecap="round"/>
    <circle class="g" cx="170" cy="170" r="124" fill="none" stroke="${P.c}" stroke-width="2" stroke-dasharray="2 11" stroke-linecap="round"/>
    <path class="d" d="M104 174l46 46 88-98" fill="none" stroke="${P.c}" stroke-width="17" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>`);
  cam.appendChild(se);
  const ry = cam.querySelector('.rayos');
  tl.fromTo(ry, {scale: .2, opacity: 0}, {scale: 1, opacity: .5, duration: 1.5, ease: 'expo.out'}, .55); tl.to(ry, {rotation: 30, duration: c.D + 1, ease: 'none'}, 0);
  tl.from(cam.querySelector('.halo'), {scale: .3, opacity: 0, duration: 1.2, ease: 'power2.out'}, .2);
  tl.from(se, {scale: .55, duration: 1, ease: 'back.out(1.6)', transformOrigin: '50% 50%'}, .12);
  const d = se.querySelectorAll('.d'); draw(tl, d[0], .12, .8); draw(tl, d[1], .62, .5, 'power3.out');
  tl.to(se.querySelector('.g'), {rotation: 60, svgOrigin: '170 170', duration: c.D + 1, ease: 'none'}, 0);
  tl.to(se, {scale: 1.08, duration: .16, ease: 'power2.out', yoyo: true, repeat: 1, transformOrigin: '50% 50%'}, .92);
  onda(c, cx, cy, .9, 330); onda(c, cx, cy, 1.1, 430); c.fx(.6, 'ding');
  for (let j = 0; j < 46; j++) {
    const p = $(`<i style="background:${[P.c, P.a, P.ink][j % 3]};${j % 4 === 0 ? 'width:9px;height:9px;border-radius:50%' : ''}"></i>`); cf.appendChild(p);
    const an = -Math.PI * (.08 + .84 * rnd()), r = 260 + rnd() * 560, dx = Math.cos(an) * r, dy = Math.sin(an) * r * .75;
    tl.fromTo(p, {x: cx, y: cy, scale: 0, rotation: 0}, {x: cx + dx, y: cy + dy, scale: .7 + rnd() * .9, rotation: rnd() * 720 - 360, duration: 1.15 + rnd() * .4, ease: 'power3.out'}, .64 + rnd() * .1);
    tl.to(p, {y: '+=' + (240 + rnd() * 260), x: '+=' + (rnd() * 80 - 40), rotation: '+=200', opacity: 0, duration: 1.9 + rnd(), ease: 'power1.in'}, 1.6 + rnd() * .3);
  }
  texto(c, {x: 160, y: 520, w: 1600, c: 1, t: sc.t, size: 146, maxH: 180, at: .8});
  const tp = c.cue('compra', .3, 1.7);
  const pd = $(`<div class="ped vid oroB"><div class="mini">${img('m1')}</div><div><small>TU PEDIDO</small><b>${esc(PR.curso || '')}</b></div><span class="chip lleno">${ICO.palomita.replace('var(--bg)', P.a).replace('currentColor', P.sobre)}Confirmado</span></div>`);
  cam.appendChild(pd); fit(pd.querySelector('b'), 100, 26);
  tl.from(pd, {y: 70, autoAlpha: 0, rotationX: -40, transformPerspective: 1400, duration: .95, ease: 'expo.out'}, tp);
  salta(tl, pd.querySelector('.chip'), tp + .55); c.fx(tp + .55, 'pop');
  if (sc.s) texto(c, {x: 260, y: 962, w: 1400, c: 1, s: sc.s, plano: 1, at: tp + .5, sm: 0});
};

// Comunidad: el contador sube, se enciende la gente y al final entras tú
S.multitud = (c) => {
  const {cam, tl, sc} = c, n = +PR.alumnos || 0;
  const cab = $(`<div class="abs ctr" style="left:120px;right:120px;top:86px">${sc.k ? `<div class="K c">${esc(sc.k)}</div>` : ''}${n ? `<div class="P" style="margin-top:34px;font-size:40px;letter-spacing:.2em;text-transform:uppercase;font-weight:700">Más de</div><div class="num oro" style="font-size:290px;margin-top:-10px">0</div>` : ''}</div>`);
  cam.appendChild(cab);
  sube(tl, cab.children, .2, {stagger: .12});
  if (n) { cuenta(tl, cab.querySelector('.num'), Math.round(n * .62), n, .45, 2.1, (v) => v.toLocaleString('en-US'), 'power3.out'); c.fx(.5, 'riser'); }
  texto(c, {x: 160, y: n ? 540 : 300, w: 1600, c: 1, t: sc.t, size: 88, maxH: 110, at: n ? 1.2 : .4});
  const g = $('<div class="gente"></div>'); cam.appendChild(g);
  const cols = 23, rows = 4, dx = 76, dy = 76, x0 = (1920 - (cols - 1) * dx) / 2 - 38, tc = 11, tr = 1, tt = c.cue('comunidad', .5, 2.2);
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
    if (r === tr && q === tc) continue;
    const s = $(`<svg viewBox="0 0 46 46" style="left:${x0 + q * dx + (r % 2) * 20}px;top:${40 + r * dy}px;width:56px;height:56px"><circle cx="23" cy="13" r="9"/><path d="M4 45c0-12 8-19 19-19s19 7 19 19z"/></svg>`), on = rnd() < .34;
    if (on) s.classList.add('on'); g.appendChild(s);
    const dist = Math.hypot(q - tc, (r - tr) * 1.3);
    tl.from(s, {scale: 0, opacity: 0, duration: .5, ease: 'back.out(2)', transformOrigin: '50% 100%'}, .5 + (14 - Math.min(14, dist)) * .085 + rnd() * .15);
  }
  const tx = x0 + tc * dx + (tr % 2) * 20, ty = 40 + tr * dy;
  const yo = $(`<svg viewBox="0 0 46 46" style="left:${tx - 14}px;top:${ty - 28}px;width:84px;height:84px;fill:${P.c};filter:drop-shadow(0 0 22px ${P.a})"><circle cx="23" cy="13" r="9"/><path d="M4 45c0-12 8-19 19-19s19 7 19 19z"/></svg>`); g.appendChild(yo);
  const et = $(`<div class="tu" style="left:${tx - 32}px;top:${ty - 104}px;width:120px"><b>TÚ</b><i></i></div>`); g.appendChild(et);
  tl.from(yo, {scale: 0, y: -160, duration: .8, ease: 'bounce.out', transformOrigin: '50% 100%'}, tt);
  tl.from(et, {y: -30, autoAlpha: 0, duration: .5, ease: 'back.out(2)'}, tt + .55);
  onda(c, tx + 28, 1080 - 70 - 330 + ty + 14, tt + .5, 170); c.fx(tt + .5, 'ding');
};

// Esto ya es tuyo: los libros del curso en abanico y cada cosa se palomea cuando se nombra
S.gracias = (c) => {
  const {cam, tl, sc} = c, vv = norm(sc.voz);
  const filas = (PR.mods || []).slice(0, 6).map((m) => [m, m.split(/\s+/).slice(0, 3).join(' ')]);
  if (vv.includes('certificado')) filas.push(['Certificado de finalización', 'certificado']);
  if (vv.includes('acceso inmediato')) filas.push(['Acceso inmediato', 'acceso inmediato']);
  if (vv.includes('de por vida') && PR.vida !== false) filas.push(['Acceso de por vida', 'de por vida']);
  texto(c, {x: 130, y: 84, w: 900, k: sc.k || PR.curso, t: sc.t, size: 112, maxH: 130, at: .15});
  const fs = filas.length > 6 ? 42 : 46, gap = filas.length > 6 ? 76 : 84, y0 = 1016 - filas.length * gap;
  filas.forEach(([t, w], j) => {
    const f = $(`<div class="fila abs" style="left:134px;top:${y0 + j * gap}px;width:840px;font-size:${fs}px">${OK}<span>${esc(t)}</span></div>`); cam.appendChild(f);
    const at = c.cue(w, .12 + .8 * j / filas.length);
    tl.from(f, {x: -50, autoAlpha: 0, duration: .6, ease: 'power3.out'}, at); draw(tl, f.querySelectorAll('circle,path'), at + .1, .45); c.fx(at + .15, 'tick');
  });
  // REGLA M9 (Christian, 19 nov): aparecen TODOS los mockups del curso (uno por módulo); el logo va aparte, nunca ocupa el lugar de un mockup
  const ks = (PR.cimgs || Array.from({length: 12}, (_, q) => 'm' + (q + 1))).filter((k) => IM[k] && IM[k].ok);
  const fan = $('<div class="fan" style="left:990px;top:0;width:820px;height:1080px"></div>'); cam.appendChild(fan);
  fan.appendChild($('<div class="halo" style="left:10px;top:150px;width:800px;height:800px"></div>'));
  const hayLogo = IM.logo && IM.logo.ok, libros = ks, nL = libros.length, dos = nL > 5, fila1 = dos ? Math.ceil(nL / 2) : nL;
  const H = dos ? 300 : nL > 3 ? 400 : 470;
  if (hayLogo) { const l = $(img('logo', 'left:230px;top:40px;width:360px;max-height:230px;object-fit:contain')); fan.appendChild(l); tl.from(l, {y: -80, autoAlpha: 0, scale: .7, duration: .9, ease: 'back.out(1.5)'}, .3); }
  libros.forEach((k, j) => {
    const enFila = j < fila1 ? fila1 : nL - fila1, jj = j < fila1 ? j : j - fila1, midF = (enFila - 1) / 2, o = jj - midF, sep = Math.min(dos ? 200 : 236, 620 / Math.max(1, enFila - 1));
    const wd = H * IM[k].w / IM[k].h, top0 = dos ? (j < fila1 ? (hayLogo ? 280 : 200) : (hayLogo ? 640 : 580)) : (hayLogo ? 330 : 250);
    const b = $(img(k, `left:${410 - wd / 2 + o * sep}px;top:${top0 + Math.abs(o) * 22}px;height:${H}px;z-index:${(j < fila1 ? 10 : 20) - Math.abs(o)}`)); fan.appendChild(b);
    // cada mockup entra cuando se nombra su módulo (corrección de Christian, 17 nov): uno por uno hasta que estén todos
    const cuando = filas[j] && libros.length > 1 ? Math.max(.4 + j * .14, c.cue(filas[j][1], .12 + .8 * j / filas.length) - .15) : .4 + j * .14;
    tl.fromTo(b, {y: 420, rotation: 0, autoAlpha: 0, scale: .7}, {y: 0, rotation: o * 8, autoAlpha: 1, scale: 1, duration: 1.05, ease: 'back.out(1.3)', transformOrigin: '50% 100%'}, cuando); c.fx(cuando + .3, 'pop');
    flota(tl, b, c.D, {at: cuando + 1.3, d: 2.4 + j * .2});
  });
  c.fx(.5, 'whoosh');
  if (IM.cert && IM.cert.ok && vv.includes('certificado')) {
    const ce = $(img('cert', 'left:470px;top:770px;width:350px;z-index:20')); fan.appendChild(ce);
    tl.from(ce, {x: 300, y: 80, rotation: 14, autoAlpha: 0, duration: .9, ease: 'expo.out'}, c.cue('certificado', .6)); tl.set(ce, {rotation: -5}, 0);
  }
};

// Tu siguiente escalón: escalera. Los escalones del curso son sólidos y con palomita; los que faltan, punteados y con candado.
S.escalera = (c) => {
  const {cam, tl, sc} = c, cm = (PR.camino || ['Aprender', 'Practicar', 'Aplicar', 'Cobrar']).slice(0, 6), n = cm.length, ya = Math.min(n - 1, PR.camino_ya || 2);
  texto(c, {x: 130, y: 70, w: 1150, t: sc.t, size: 108, maxH: 130, at: .15});
  const w = 1640 / n, x0 = 140, piso = 900, sub = Math.min(118, 480 / (n - 1)), X = (i) => x0 + i * w, Y = (i) => 742 - i * sub;
  let s = `<svg class="abs" style="inset:0;overflow:visible" width="1920" height="1080"><defs><linearGradient id="gs" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${rgba(P.a, .34)}"/><stop offset="1" stop-color="${rgba(P.a, .04)}"/></linearGradient></defs>`;
  for (let i = 0; i < n; i++) s += i < ya
    ? `<g class="st"><rect x="${X(i)}" y="${Y(i)}" width="${w}" height="${piso - Y(i)}" fill="url(#gs)"/><line x1="${X(i)}" y1="${Y(i)}" x2="${X(i) + w}" y2="${Y(i)}" stroke="${P.c}" stroke-width="6" stroke-linecap="round"/></g>`
    : `<g class="gh"><rect x="${X(i) + 3}" y="${Y(i)}" width="${w - 6}" height="${piso - Y(i)}" rx="4" fill="${rgba(P.ink, .025)}" stroke="${rgba(P.ink, .4)}" stroke-width="3" stroke-dasharray="14 12"/></g>`;
  s += `<line class="pi" x1="${x0 - 60}" y1="${piso}" x2="${x0 + n * w + 60}" y2="${piso}" stroke="${rgba(P.ink, .25)}" stroke-width="3" pathLength="1"/></svg>`;
  const sv = $(s); cam.appendChild(sv);
  draw(tl, sv.querySelector('.pi'), .05, .8);
  const st = sv.querySelectorAll('.st'), gh = sv.querySelectorAll('.gh');
  tl.from(st, {scaleY: 0, svgOrigin: `0 ${piso}`, duration: .8, ease: 'expo.out', stagger: .16}, .2);
  tl.from(gh, {opacity: 0, y: 30, duration: .7, ease: 'power2.out', stagger: .1}, .6);
  const lb = cm.map((t, i) => { const f = i >= ya, e = $(`<div class="esc-lbl${f ? ' f' : ''}" style="left:${X(i) + 10}px;top:${Y(i) + 22}px;width:${w - 20}px"><span style="display:inline-flex;color:${f ? rgba(P.ink, .55) : P.c};margin-bottom:6px">${f ? ICO.candado : ICO.palomita}</span><br>${esc(t)}</div>`); cam.appendChild(e); fit(e, Math.max(96, piso - Y(i) - 30), 22); return e; });
  tl.from(lb.slice(0, ya), {autoAlpha: 0, y: 20, duration: .6, stagger: .16, ease: 'power2.out'}, .5);
  tl.from(lb.slice(ya), {autoAlpha: 0, y: 20, duration: .6, stagger: .1, ease: 'power2.out'}, .85);
  const t1 = $(`<div class="esc-tag ya" style="left:${X(0)}px;top:${piso + 22}px;width:${ya * w - 14}px">${ICO.palomita.replace('var(--bg)', P.c).replace('currentColor', P.sobre)}Ya lo tienes · tu curso</div>`);
  const t2 = $(`<div class="esc-tag falta" style="left:${X(ya) + 14}px;top:${piso + 22}px;width:${(n - ya) * w - 14}px">${ICO.candado}Lo que aún te falta</div>`);
  cam.append(t1, t2); fit(t1, 80, 18); fit(t2, 80, 18);
  tl.from(t1, {scaleX: 0, autoAlpha: 0, transformOrigin: '0 50%', duration: .7, ease: 'expo.out'}, 1.15);
  // tú: bajas al primer escalón, subes los del curso y te detienes frente a lo que falta
  const tu = $(`<div class="tu" style="left:0;top:0;width:120px"><b>TÚ</b><i></i><span style="width:20px;height:20px;border-radius:50%;background:${P.c};box-shadow:0 0 24px ${P.a};margin-top:-4px"></span></div>`); cam.appendChild(tu);
  const px = (i) => X(i) + w / 2 - 60, py = (i) => Y(i) - 100;
  tl.fromTo(tu, {x: px(0), y: py(0) - 220, autoAlpha: 0}, {y: py(0), autoAlpha: 1, duration: .7, ease: 'bounce.out'}, 1.0);
  const span = Math.max(.9, c.cue('cliente', .42) - 1.9) / Math.max(1, ya - 1);
  for (let i = 1; i < ya; i++) { const at = 1.9 + (i - 1) * span; tl.to(tu, {x: px(i), duration: .6, ease: 'power1.inOut'}, at); tl.to(tu, {y: py(i) - 70, duration: .3, ease: 'power2.out'}, at); tl.to(tu, {y: py(i), duration: .3, ease: 'power2.in'}, at + .3); c.fx(at + .58, 'pop'); }
  // lo que falta: cada escalón punteado se enciende cuando se nombra
  const tf = c.cue('cliente', .42);
  tl.from(t2, {scaleX: 0, autoAlpha: 0, transformOrigin: '0 50%', duration: .7, ease: 'expo.out'}, tf);
  tl.to(tu, {x: '+=26', duration: .35, ease: 'power2.out', yoyo: true, repeat: 1}, tf + .1);
  for (let i = ya; i < n; i++) {
    const at = Math.max(tf + .4 + (i - ya) * .45, c.cue(String(cm[i]).split(/\s+/).pop(), .55 + .12 * (i - ya)));
    const r = gh[i - ya].querySelector('rect');
    tl.to(r, {stroke: P.c, fill: rgba(P.a, .1), duration: .35, ease: 'power2.out'}, at); tl.to(lb[i], {color: P.ink, scale: 1.08, duration: .3, ease: 'back.out(2)'}, at);
    tl.to(lb[i].querySelector('span'), {color: P.c, rotation: -14, duration: .09, yoyo: true, repeat: 5, ease: 'sine.inOut'}, at); c.fx(at, 'click');
  }
};

// Desbloqueaste la oferta: tu compra abre el candado y aparece la oferta
S.porque = (c) => {
  const {cam, tl, sc} = c, y = 610;
  texto(c, {x: 210, y: 96, w: 1500, c: 1, t: sc.t, size: 96, maxH: 230, at: .15});
  const a = $(`<div class="vid abs ctr" style="left:120px;top:${y - 180}px;width:540px;height:360px;padding:52px 30px"><div style="color:${P.c};display:flex;justify-content:center;transform:scale(1.7);margin:14px 0 30px">${ICO.palomita}</div><div class="K c" style="font-size:20px">Hoy</div><div class="T" style="font-size:64px;margin-top:12px">Tu compra</div></div>`);
  const b = $(`<div class="vid oroB abs ctr" style="left:1260px;top:${y - 180}px;width:540px;height:360px;padding:56px 30px;background:linear-gradient(160deg,${rgba(P.a, .22)},${rgba(P.a, .04)})"><div class="K c" style="font-size:20px">Solo para ti</div><div class="T oro" style="font-size:68px;margin:16px 0 30px">Oferta especial</div><span class="chip lleno" style="font-size:30px">Desbloqueada</span></div>`);
  const lk = $(`<svg class="abs" style="left:${960 - 180}px;top:${y - 230}px;overflow:visible" width="360" height="408" viewBox="0 0 260 300"><defs><linearGradient id="gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${P.c}"/><stop offset=".5" stop-color="${P.a}"/><stop offset="1" stop-color="${P.c}"/></linearGradient></defs>
    <path class="sh" d="M70 135V92a60 60 0 01120 0v43" fill="none" stroke="${P.c}" stroke-width="22" stroke-linecap="round"/><rect x="34" y="128" width="192" height="150" rx="28" fill="url(#gl)"/><circle cx="130" cy="190" r="19" fill="${P.bg}"/><rect x="122" y="196" width="16" height="44" rx="7" fill="${P.bg}"/></svg>`);
  const ln = $(`<svg class="ln"><path d="M672 ${y}H770" pathLength="1"/><path d="M1150 ${y}H1248" pathLength="1"/></svg>`);
  cam.append($(`<div class="halo" style="left:${960 - 380}px;top:${y - 380}px;width:760px;height:760px"></div>`), ln, a, lk, b);
  const tA = .55, tL = c.cue('desbloque', .45, 2.2), ls = ln.querySelectorAll('path');
  tl.from(a, {x: -120, autoAlpha: 0, duration: .9, ease: 'expo.out'}, tA);
  tl.from(lk, {scale: .6, autoAlpha: 0, duration: .9, ease: 'back.out(1.5)', transformOrigin: '50% 60%'}, .35);
  draw(tl, ls[0], tL - .7, .6);
  tl.to(lk, {rotation: -7, duration: .07, yoyo: true, repeat: 5, ease: 'sine.inOut', transformOrigin: '50% 70%'}, tL - .25);
  tl.to(lk.querySelector('.sh'), {rotation: 38, y: -16, svgOrigin: '190 135', duration: .5, ease: 'back.out(2.5)'}, tL); c.fx(tL, 'tick'); c.fx(tL + .05, 'pop');
  onda(c, 960, y, tL, 300); onda(c, 960, y, tL + .18, 420);
  tl.from(cam.querySelector('.halo'), {scale: .3, opacity: 0, duration: 1, ease: 'power2.out'}, tL);
  draw(tl, ls[1], tL + .25, .5);
  tl.from(b, {x: 140, rotationY: -70, transformPerspective: 1400, autoAlpha: 0, duration: 1, ease: 'expo.out'}, tL + .55);
  salta(tl, b.querySelector('.chip'), tL + 1.15); c.fx(tL + .7, 'ding');
};

// Presentación del pack: sube a escena con rayos, destello y partículas
S.revela = (c) => {
  const {cam, tl, sc} = c;
  objeto(c, 'pack', {x: 1010, y: 120, s: 830, rayos: 1, sube: 1, at: .35}); c.fx(.25, 'riser'); c.fx(1.05, 'golpe');
  for (let j = 0; j < 22; j++) { const p = $(`<i class="abs" style="left:${1040 + rnd() * 770}px;top:920px;width:${4 + rnd() * 6}px;height:${4 + rnd() * 6}px;border-radius:50%;background:${P.c}"></i>`); cam.appendChild(p);
    tl.fromTo(p, {y: 0, opacity: 0}, {y: -(420 + rnd() * 420), duration: 3 + rnd() * 2.5, ease: 'none', repeat: 3, keyframes: {opacity: [0, .9, 0]}}, .9 + rnd() * 2.6); }
  texto(c, {x: 130, y: 250, w: 860, k: sc.k, t: '*' + String(sc.t || PR.oferta || '').replace(/\*/g, '') + '*', ul: false, size: 136, maxH: 320, s: sc.s, ss: 48, sm: 36, at: .75, sAt: c.cue('guiones', .35, 2.2)});
};

// Una herramienta: la imagen real, grande, y sus puntos aparecen uno por uno. Tres composiciones que se van turnando.
S.tool2 = (c) => {
  const {cam, tl, sc} = c, i = sc.i || 0, ct = (PR.cont || [])[i] || {}, modo = (i + VAR) % 3, izq = modo !== 0;
  objeto(c, 'c' + i, {x: izq ? 70 : 1010, y: 100, s: 850, dir: izq ? -1 : 1, at: .12}); c.fx(.12, 'whoosh');
  const bx = $(`<div class="abs" style="left:${izq ? 1000 : 130}px;top:90px;width:${izq ? 800 : 820}px;height:850px;display:flex;flex-direction:column;justify-content:center"></div>`); cam.appendChild(bx);
  const cab = $(`<div style="display:flex;align-items:center;gap:26px;margin-bottom:26px"><div class="K">${esc(PR.etiqueta || 'Herramienta')} ${i + 1} de ${N || i + 1}</div>${ct.valor ? `<span class="chip" style="font-size:23px;padding:9px 20px">Valor ${money(+ct.valor)}</span>` : ''}</div>`); bx.appendChild(cab);
  tl.from(cab.children, {autoAlpha: 0, x: -40, duration: .7, ease: 'power3.out', stagger: .12}, .2);
  texto(c, {en: bx, x: 0, y: 0, w: izq ? 800 : 820, t: ct.titulo || sc.demoT, size: 92, maxH: 215, s: sc.s, ss: 44, sm: 20, at: .3, sAt: 1.05}).style.position = 'relative';
  const pts = (sc.puntos || []).slice(0, 4), li = $(`<div style="margin-top:44px;display:flex;flex-direction:column;gap:${modo === 2 ? 16 : 24}px"></div>`); bx.appendChild(li);
  pts.forEach((p, j) => {
    const f = modo === 2 ? $(`<div class="ncard vid"><em class="oro">0${j + 1}</em><span>${esc(p)}</span></div>`) : $(`<div class="fila" style="font-size:42px">${OK}<span>${esc(p)}</span></div>`); li.appendChild(f);
    const at = .22 + c.vz * (.4 + .5 * j / pts.length);
    tl.from(f, modo === 2 ? {x: 90, autoAlpha: 0, duration: .65, ease: 'expo.out'} : {x: -40, autoAlpha: 0, duration: .55, ease: 'power3.out'}, at);
    if (modo !== 2) draw(tl, f.querySelectorAll('circle,path'), at + .08, .4); c.fx(at + .1, 'tick');
  });
  const pg = $(`<div class="pts">${Array.from({length: N}, (_, j) => `<i class="${j === i ? 'on' : j < i ? 'ya' : ''}"></i>`).join('')}</div>`); cam.appendChild(pg);
  tl.from(pg, {autoAlpha: 0, y: 20, duration: .6}, .3); tl.from(pg.querySelector('.on'), {width: 12, duration: .7, ease: 'power3.out'}, .4);
};

// Todo junto: las herramientas llegan una a una y el valor se va sumando
S.todas = (c) => {
  const {cam, tl, sc} = c, n = N, cols = Math.ceil(n / 2), w = Math.min(310, (1700 - (cols - 1) * 22) / cols), h = 282, gx = 22, x0 = (1920 - cols * w - (cols - 1) * gx) / 2, y0 = 214;
  texto(c, {x: 160, y: 64, w: 1600, c: 1, t: sc.t, size: 84, maxH: 104, at: .1});
  const tot = $(`<div class="vid oroB abs" style="left:560px;top:846px;width:800px;height:150px;display:flex;align-items:center;justify-content:center;gap:40px"><div class="K" style="font-size:24px">Valor de referencia</div><div class="num oro" style="font-size:108px">$0</div></div>`); cam.appendChild(tot);
  tl.from(tot, {y: 60, autoAlpha: 0, duration: .8, ease: 'expo.out'}, .35);
  const nm = tot.querySelector('.num'), o = {v: 0}, paso = Math.min(.3, Math.max(.16, c.vz * .55 / n)); let sum = 0;
  (PR.cont || []).forEach((ct, j) => {
    const col = j % cols, row = Math.floor(j / cols), k = $(`<div class="tarj vid" style="left:${x0 + col * (w + gx)}px;top:${y0 + row * (h + 22)}px;width:${w}px;height:${h}px"><div class="im">${img('c' + j)}</div><b>${esc(ct.corto || ct.titulo)}</b><u>${money(+ct.valor || 0)}</u></div>`); cam.appendChild(k);
    fit(k.querySelector('b'), 52, 15);
    const at = .6 + j * paso; sum += +ct.valor || 0; const hasta = sum;
    tl.from(k, {y: 260, x: (960 - (x0 + col * (w + gx) + w / 2)) * .5, scale: .4, rotation: rnd() * 30 - 15, autoAlpha: 0, duration: .8, ease: 'back.out(1.4)'}, at);
    tl.to(o, {v: hasta, duration: paso * .9, ease: 'power1.out', onUpdate: () => { nm.textContent = money(Math.round(o.v)); }}, at + .35);
    tl.fromTo(k.querySelector('u'), {scale: 1}, {scale: 1.35, duration: .14, yoyo: true, repeat: 1, ease: 'power2.out'}, at + .4); c.fx(at + .4, 'tick');
  });
  const fin = .6 + n * paso + .5;
  tl.to(tot, {scale: 1.1, duration: .22, ease: 'power2.out', yoyo: true, repeat: 1}, fin); onda(c, 960, 921, fin, 420); c.fx(fin, 'monedas');
};

// Precio: el valor se tacha y el precio de hoy cae con fuerza
S.precio = (c) => {
  const {cam, tl, sc} = c, val = +PR.valor || 0, pre = +PR.precio || 0, desc = val ? Math.round((1 - pre / val) * 100) : 0;
  const k = $(`<div class="abs ctr" style="left:120px;right:120px;top:78px"><div class="K c">${esc(sc.k || 'Precio exclusivo')}</div></div>`); cam.appendChild(k);
  tl.from(k, {autoAlpha: 0, y: -20, duration: .7, ease: 'power3.out'}, .15);
  const tD = Math.max(1.1, c.cue('por ciento', .16)), tP = Math.max(c.cue('llevas', null) || c.cue('por solo', null) || c.cue(' por ', .72), 2.6), tV = .45;
  decor(c, {x: -220, y: 520, s: 700, r: -10, o: .32, b: 9});
  const bn = $(`<div class="abs ctr" style="left:120px;right:120px;top:150px"><span class="chip lleno" style="font-size:44px;padding:16px 44px;letter-spacing:.02em">${desc}% de descuento</span></div>`); cam.appendChild(bn);
  if (desc > 0) { tl.from(bn.firstChild, {scale: 2.4, autoAlpha: 0, rotation: -8, duration: .55, ease: 'back.out(1.7)'}, tD); c.fx(tD, 'pop'); } else bn.remove();
  const iz = $(`<div class="abs ctr" style="left:150px;top:380px;width:680px"><div class="P" style="font-size:32px;letter-spacing:.14em;text-transform:uppercase;font-weight:700">Valor de referencia</div><div class="num" style="font-size:230px;color:${rgba(P.ink, .92)};margin-top:14px">${money(val)}</div></div>`);
  const de = $(`<div class="abs ctr" style="left:900px;top:300px;width:900px"><div class="P" style="font-size:36px;letter-spacing:.14em;text-transform:uppercase;font-weight:700;color:${P.c}">Hoy lo llevas por</div><div class="num oro" style="font-size:430px;margin-top:6px;padding:0 20px">${money(pre)}</div></div>`);
  const ta = $(`<svg class="ln"><path d="M210 640L770 500" pathLength="1" style="stroke-width:12;stroke:${P.c}"/><path d="M836 590h70m-26-26l26 26-26 26" pathLength="1" style="stroke-width:6"/></svg>`);
  cam.append($(`<div class="halo" style="left:920px;top:150px;width:860px;height:860px"></div>`), iz, de, ta);
  cuenta(tl, iz.querySelector('.num'), 0, val, tV + .1, 1.3, money, 'power2.out'); c.fx(tV + .2, 'riser');
  tl.fromTo(iz, {x: 470, y: 60, scale: 1.25, autoAlpha: 0}, {x: 470, y: 0, scale: 1.25, autoAlpha: 1, duration: .9, ease: 'expo.out'}, tV);
  tl.to(iz, {x: 0, scale: 1, duration: .7, ease: 'power3.inOut'}, tP - 1.25);
  const ps = ta.querySelectorAll('path'); draw(tl, ps[0], tP - .55, .4, 'power3.in'); c.fx(tP - .5, 'whoosh');
  tl.to(iz, {opacity: .38, scale: .86, x: -30, duration: .6, ease: 'power2.out'}, tP - .1); draw(tl, ps[1], tP - .1, .4);
  const nm = de.querySelector('.num');
  tl.from(de.firstChild, {autoAlpha: 0, y: 20, duration: .5}, tP - .1);
  tl.fromTo(nm, {scale: 2.3, autoAlpha: 0, filter: 'blur(18px)'}, {scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: .6, ease: 'expo.out'}, tP);
  cuenta(tl, nm, val, pre, tP, .75, money, 'power3.out');
  tl.from(cam.querySelector('.halo'), {scale: .3, opacity: 0, duration: .9, ease: 'power2.out'}, tP);
  onda(c, 1350, 600, tP + .3, 420); onda(c, 1350, 600, tP + .5, 560); c.fx(tP + .3, 'golpe'); c.fx(tP + .55, 'monedas');
  tl.to(nm, {scale: 1.05, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: 9}, tP + 1);
  const pie = texto(c, {x: 160, y: 900, w: 1600, c: 1, s: `Precio exclusivo por tu compra de ${PR.curso || 'hoy'}`, plano: 1, ss: 38, sm: 0, at: tP + .5});
  fit(pie.firstChild, 56, 22);
};

// Solo en esta página: aquí la oferta existe; si sales, ya no está
S.exclusiva = (c) => {
  const {cam, tl, sc} = c, y = 300, hh = 560;
  texto(c, {x: 160, y: 70, w: 1600, c: 1, t: sc.t, size: 88, maxH: 108, s: sc.s, ss: 40, sm: 16, at: .12});
  const a = $(`<div class="win" style="left:176px;top:${y}px;width:720px;height:${hh}px;border-color:${P.a};box-shadow:0 0 0 6px ${rgba(P.a, .16)},0 50px 100px rgba(0,0,0,.5)"><div class="bar"><i></i><i></i><i></i><u></u></div><div class="in"><div style="height:250px;display:flex">${img('pack', 'height:100%;filter:drop-shadow(0 16px 18px rgba(0,0,0,.5))')}</div><div class="T" style="font-size:44px">${esc(PR.oferta || '')}</div><div style="display:flex;align-items:center;gap:26px"><span class="num oro" style="font-size:96px">${money(+PR.precio || 0)}</span><span class="btn" style="font-size:30px;padding:18px 38px">Sí, lo quiero</span></div></div></div>`);
  const b = $(`<div class="win no" style="left:1024px;top:${y}px;width:720px;height:${hh}px"><div class="bar"><i></i><i></i><i></i><u></u></div><div class="in" style="color:${rgba(P.ink, .5)}">${ICO.equis}<div class="T" style="font-size:50px;color:${rgba(P.ink, .6)};margin-top:14px">Podrías no volver a verla</div></div></div>`);
  const ea = $(`<div class="abs ctr" style="left:176px;top:${y + hh + 34}px;width:720px"><span class="chip lleno" style="font-size:36px;padding:16px 34px">${ICO.palomita.replace('var(--bg)', P.c).replace('currentColor', P.sobre)}Aquí y ahora</span></div>`);
  const eb = $(`<div class="abs ctr" style="left:1024px;top:${y + hh + 34}px;width:720px"><span class="chip" style="font-size:36px;padding:16px 34px;border-style:dashed;color:${P.ink};border-color:${rgba(P.ink, .4)}">Si sales de esta página</span></div>`);
  const fl = $(`<svg class="ln"><path d="M916 ${y + hh / 2}h78m-28-28l28 28-28 28" pathLength="1" style="stroke-width:6;stroke:${rgba(P.ink, .5)}"/></svg>`);
  const cu = $(`<svg class="abs" style="left:0;top:0" width="54" height="54" viewBox="0 0 24 24"><path d="M5 2l14 11h-8l-2 9z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>`);
  cam.append(a, ea, fl, b, eb, cu);
  fit(a.querySelector('.T'), 60, 20);
  tl.fromTo([a, ea], {x: 424}, {x: 0, duration: .8, ease: 'power3.inOut'}, Math.max(1.5, c.cue('si sales', .55, 2.4) - 1.25));
  tl.from(a, {y: 80, scale: .85, autoAlpha: 0, duration: 1, ease: 'expo.out'}, .35); salta(tl, ea.firstChild, 1.1); c.fx(.4, 'whoosh');
  tl.to(a, {boxShadow: `0 0 0 16px ${rgba(P.a, .0)},0 50px 100px rgba(0,0,0,.5)`, duration: 1.2, ease: 'sine.out', repeat: 6}, 1.2);
  const ts = c.cue('si sales', .55, 2.4);
  tl.fromTo(cu, {x: 1100, y: 820, autoAlpha: 0}, {x: 900, y: 620, autoAlpha: 1, duration: .7, ease: 'power2.out'}, 1.0);
  tl.to(cu, {x: 206, y: y + 20, duration: .8, ease: 'power2.inOut'}, ts - .85); tl.to(cu, {scale: .8, duration: .1, yoyo: true, repeat: 1}, ts - .05); c.fx(ts, 'click');
  draw(tl, fl.querySelector('path'), ts + .05, .45);
  tl.from(b, {x: 160, autoAlpha: 0, duration: .9, ease: 'expo.out'}, ts + .2); salta(tl, eb.firstChild, ts + .7);
  tl.from(b.querySelector('svg'), {scale: 0, rotation: -90, duration: .6, ease: 'back.out(2)'}, ts + .6);
  tl.to(a, {scale: 1.03, duration: .5, ease: 'power2.out'}, ts + .9); tl.to(cu, {autoAlpha: 0, duration: .3}, ts + .5);
};

// Una sola {logro} lo paga: las monedas van de la consulta al precio y lo cubren por completo
S.inversion = (c) => {
  const {cam, tl, sc} = c, y = 500, cx = 1420, r = 200, logro = PR.logro || 'cliente';
  texto(c, {x: 160, y: 70, w: 1600, c: 1, t: sc.t, size: 88, maxH: 108, at: .12});
  const a = $(`<div class="vid oroB abs ctr" style="left:150px;top:${y - 225}px;width:600px;height:450px;padding:44px 30px"><svg width="150" height="150" viewBox="0 0 60 60" style="overflow:visible"><g fill="none" stroke="${P.c}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="11" width="46" height="42" rx="7" pathLength="1"/><path d="M7 23h46M19 6v9M41 6v9" pathLength="1"/><path d="M20 38l7 7 14-15" pathLength="1" stroke-width="4.5"/></g></svg><div class="K c" style="font-size:22px;margin-top:22px">Con solo</div><div class="T" style="font-size:80px;margin-top:10px">1 <span class="oro">${esc(logro)}</span></div></div>`);
  const ln = $(`<svg class="ln"><path d="M770 ${y}C920 ${y - 130} 1050 ${y - 130} ${cx - r - 30} ${y}" pathLength="1" style="stroke-dasharray:.02 .03;stroke-width:4;stroke:${rgba(P.a, .7)}"/><circle cx="${cx}" cy="${y}" r="${r}" style="stroke:${rgba(P.ink, .14)};stroke-width:16"/><circle class="pr" cx="${cx}" cy="${y}" r="${r}" pathLength="1" transform="rotate(-90 ${cx} ${y})" style="stroke:${P.c};stroke-width:16"/></svg>`);
  const pz = $(`<div class="abs ctr" style="left:${cx - r}px;top:${y - 82}px;width:${2 * r}px"><div class="num oro" style="font-size:150px">${money(+PR.precio || 0)}</div></div>`);
  const ok = $(`<div class="abs ctr" style="left:${cx - 300}px;top:${y + r + 40}px;width:600px"><span class="chip lleno" style="font-size:34px;padding:15px 32px">${ICO.palomita.replace('var(--bg)', P.c).replace('currentColor', P.sobre)}Inversión cubierta</span></div>`);
  cam.append($(`<div class="halo" style="left:${cx - 330}px;top:${y - 330}px;width:660px;height:660px"></div>`), ln, a, pz, ok);
  tl.from(a, {x: -120, autoAlpha: 0, duration: .9, ease: 'expo.out'}, .4); draw(tl, a.querySelectorAll('svg [pathLength]'), .7, .7);
  tl.from([ln.querySelectorAll('circle')[0], pz], {scale: .6, autoAlpha: 0, duration: .8, ease: 'back.out(1.6)', transformOrigin: '50% 50%', svgOrigin: `${cx} ${y}`}, .8);
  tl.from(ln.querySelector('path'), {opacity: 0, duration: .6}, 1.2);
  const t0 = Math.min(Math.max(1.6, c.cue('concret', .45)), .22 + c.vz * .5), nc = 6, pr = ln.querySelector('.pr');
  tl.fromTo(pr, {strokeDasharray: 1, strokeDashoffset: 1, opacity: 0}, {strokeDashoffset: 1, opacity: 1, duration: .01}, t0);
  for (let j = 0; j < nc; j++) {
    const m = $(`<div class="abs ctr" style="left:-26px;top:-26px;width:64px;height:64px;border-radius:50%;background:linear-gradient(140deg,${P.c},${P.a});color:${P.sobre};font-weight:900;font-size:36px;line-height:64px;box-shadow:0 8px 20px rgba(0,0,0,.4)">$</div>`); cam.appendChild(m);
    const at = t0 + j * .24;
    tl.fromTo(m, {x: 770, autoAlpha: 0, scale: .4}, {x: cx - r - 10, autoAlpha: 1, scale: 1, duration: .8, ease: 'power1.inOut'}, at);
    tl.fromTo(m, {y: y}, {y: y - 100, duration: .4, ease: 'sine.out'}, at); tl.to(m, {y: y, duration: .4, ease: 'sine.in'}, at + .4);
    tl.to(m, {autoAlpha: 0, scale: .3, duration: .15}, at + .8);
    tl.to(pr, {strokeDashoffset: 1 - (j + 1) / nc, duration: .3, ease: 'power2.out'}, at + .8); c.fx(at + .8, 'tick');
  }
  const tf = t0 + nc * .24 + .75;
  salta(tl, ok.firstChild, tf); onda(c, cx, y, tf, 300); c.fx(tf, 'ding'); tl.to(pz, {scale: 1.12, duration: .2, yoyo: true, repeat: 1, ease: 'power2.out'}, tf);
  const tira = $(`<div class="abs" style="left:0;right:0;top:836px;display:flex;justify-content:center;align-items:center;gap:16px">${Array.from({length: Math.min(N, 10)}, (_, j) => `<div style="width:112px;height:112px;display:flex">${img('c' + j, 'max-width:100%;max-height:100%;margin:auto;filter:drop-shadow(0 8px 10px rgba(0,0,0,.5))')}</div>`).join('')}</div>`); cam.appendChild(tira);
  const tt = Math.min(Math.max(tf + .4, c.cue('herramientas', .8)), .22 + c.vz * .7);
  tl.from(tira.children, {y: 40, autoAlpha: 0, duration: .5, ease: 'back.out(1.6)', stagger: .05}, tt);
  if (sc.s) texto(c, {x: 260, y: 966, w: 1400, c: 1, s: sc.s, plano: 1, ss: 38, sm: 0, at: tt + .2});
};

// Garantía: los días se van encendiendo en el aro y la flecha de regreso recuerda la devolución
S.garantia = (c) => {
  const {cam, tl, sc} = c, dias = +PR.dias || 7, n = Math.min(dias, 14), cx = 520, cy = 560, r = 232;
  const pol = (a, rr) => [cx + rr * Math.cos(a * Math.PI / 180), cy + rr * Math.sin(a * Math.PI / 180)], span = 360 / n, gap = 5;
  let s = '<svg class="ln">';
  for (let j = 0; j < n; j++) { const a0 = -90 + j * span + gap / 2, a1 = -90 + (j + 1) * span - gap / 2, p0 = pol(a0, r), p1 = pol(a1, r), d = `M${p0[0]} ${p0[1]}A${r} ${r} 0 0 1 ${p1[0]} ${p1[1]}`;
    s += `<path d="${d}" style="stroke:${rgba(P.ink, .13)};stroke-width:30;stroke-linecap:butt"/><path class="sg" d="${d}" pathLength="1" style="stroke:${P.c};stroke-width:30;stroke-linecap:butt"/>`; }
  const q0 = pol(-60, r + 62), q1 = pol(-120, r + 62);
  s += `<path class="vu" d="M${q0[0]} ${q0[1]}A${r + 62} ${r + 62} 0 1 1 ${q1[0]} ${q1[1]}" pathLength="1" style="stroke:${rgba(P.a, .75)};stroke-width:5;stroke-dasharray:.012 .012"/><path class="fl" d="M${q1[0] - 4} ${q1[1] + 34}L${q1[0]} ${q1[1]}l34 4" pathLength="1" style="stroke-width:6"/></svg>`;
  const sv = $(s), ce = $(`<div class="abs ctr" style="left:${cx - 200}px;top:${cy - 150}px;width:400px"><div class="num oro" style="font-size:230px">1</div><div class="K c" style="font-size:30px;margin-top:4px">${dias === 1 ? 'día' : 'días'}</div></div>`);
  cam.append($(`<div class="halo" style="left:${cx - 420}px;top:${cy - 420}px;width:840px;height:840px"></div>`), sv, ce);
  tl.from([sv, ce], {scale: .7, autoAlpha: 0, duration: .9, ease: 'back.out(1.4)', transformOrigin: `${cx}px ${cy}px`}, .25);
  const t0 = Math.max(.9, c.cue('dias', .2) - .3), paso = Math.min(.3, 1.9 / n), nm = ce.querySelector('.num');
  sv.querySelectorAll('.sg').forEach((g, j) => { draw(tl, g, t0 + j * paso, paso * .95, 'power1.inOut'); tl.call(() => {}, null, t0 + j * paso); c.fx(t0 + j * paso + paso * .8, 'tick'); });
  cuenta(tl, nm, 1, dias, t0, n * paso, (v) => String(v), 'none');
  tl.to(ce, {scale: 1.12, duration: .2, yoyo: true, repeat: 1, ease: 'power2.out'}, t0 + n * paso); onda(c, cx, cy, t0 + n * paso, 330); c.fx(t0 + n * paso, 'ding');
  const tb = texto(c, {x: 980, y: 250, w: 820, k: sc.k, t: sc.t, size: 112, maxH: 250, s: sc.s, plano: 1, ss: 46, sm: 30, at: .3, sAt: Math.min(c.cue('si no', .5), 2.4)});
  const tR = Math.min(Math.max(t0 + n * paso + .3, c.cue('devoluci', .62)), .22 + c.vz * .72);
  tl.fromTo(sv.querySelector('.vu'), {opacity: 0}, {opacity: 1, duration: .5}, tR); tl.fromTo(sv.querySelector('.vu'), {rotation: 60, svgOrigin: `${cx} ${cy}`}, {rotation: 0, duration: 1.2, ease: 'power3.out'}, tR); draw(tl, sv.querySelector('.fl'), tR + .6, .3);
  const ch = $(`<div style="margin-top:44px;display:flex;gap:20px;flex-wrap:wrap"><span class="chip" style="font-size:34px;padding:15px 30px">${ICO.vuelta}Devolución de tu dinero</span><span class="chip lleno" style="font-size:34px;padding:15px 30px">${ICO.escudo}Sin riesgo</span></div>`); tb.appendChild(ch);
  salta(tl, ch.children[0], tR + .2); salta(tl, ch.children[1], Math.max(tR + .8, c.cue('sin riesgo', .9))); c.fx(tR + .2, 'pop');
};

// Cierre: el pack, el precio y el botón que late, con flechas hacia abajo
S.cta2 = (c) => {
  const {cam, tl, sc} = c, val = +PR.valor || 0, pre = +PR.precio || 0;
  objeto(c, 'pack', {x: 90, y: 150, s: 780, rayos: 1, sube: 1, at: .2}); c.fx(.2, 'whoosh');
  const bx = $('<div class="abs" style="left:940px;top:60px;width:860px;height:960px;display:flex;flex-direction:column;justify-content:center"></div>'); cam.appendChild(bx);
  texto(c, {en: bx, x: 0, y: 0, w: 860, t: sc.t, size: 100, maxH: 230, at: .4}).style.position = 'relative';
  const pr = $(`<div style="display:flex;align-items:flex-end;gap:36px;margin-top:34px"><div style="position:relative"><div class="num" style="font-size:86px;color:${rgba(P.ink, .5)};padding-bottom:26px">${money(val)}</div><i style="position:absolute;left:-8px;right:-8px;top:38%;height:7px;border-radius:9px;background:${P.c};transform:rotate(-9deg)"></i></div><div class="num oro" style="font-size:240px">${money(pre)}</div></div>`);
  const ch = $(`<div style="display:flex;gap:18px;margin-top:22px">${N ? `<span class="chip" style="font-size:31px">${N} ${esc(PR.unidad || 'herramientas')}</span>` : ''}<span class="chip" style="font-size:31px">${ICO.escudo}${+PR.dias || 7} días de garantía</span></div>`);
  const bt = $(`<div style="margin-top:46px;position:relative;align-self:flex-start"><span class="btn" style="font-size:44px;height:124px;padding:0 64px">Sí, quiero el ${esc(PR.oferta || 'pack')}</span></div>`);
  const fl = $(`<svg width="90" height="110" viewBox="0 0 90 110" style="margin:22px 0 0 ${200}px;overflow:visible">${[0, 1, 2].map((j) => `<path d="M14 ${12 + j * 30}l31 26 31-26" fill="none" stroke="${P.c}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</svg>`);
  bx.append(pr, ch, bt, fl);
  const b = bt.firstChild; let fs = 44; while (b.offsetWidth > 850 && fs > 26) { fs -= 2; b.style.fontSize = fs + 'px'; b.style.padding = '0 ' + Math.round(fs * 1.3) + 'px'; }
  fl.style.marginLeft = Math.max(0, b.offsetWidth / 2 - 45) + 'px';
  const tp = Math.min(Math.max(1.5, c.cue('por solo', null) || c.cue('dolares', .6) - .6), .22 + c.vz * .42);
  tl.from(pr.children[0], {autoAlpha: 0, x: -40, duration: .6, ease: 'power3.out'}, tp - .5); tl.from(pr.querySelector('i'), {scaleX: 0, transformOrigin: '0 50%', duration: .35, ease: 'power3.in'}, tp - .15);
  tl.from(pr.children[1], {scale: 2, autoAlpha: 0, duration: .6, ease: 'expo.out', transformOrigin: '0 100%'}, tp + .1); c.fx(tp + .15, 'golpe');
  salta(tl, ch.children, tp + .6);
  const tb = Math.min(Math.max(tp + 1, c.cue('clic', .88) - .3), .22 + c.vz * .72);
  tl.from(b, {scale: .5, autoAlpha: 0, duration: .8, ease: 'elastic.out(1,.55)'}, tb); c.fx(tb, 'ding');
  const rep = Math.ceil((c.D - tb) / 1.4) + 1;
  tl.to(b, {scale: 1.045, duration: .7, ease: 'sine.inOut', yoyo: true, repeat: rep * 2}, tb + .9);
  tl.fromTo(b, {boxShadow: `0 24px 60px ${rgba(P.a, .32)},0 0 0 0 ${rgba(P.c, .55)},inset 0 2px 0 rgba(255,255,255,.4)`}, {boxShadow: `0 24px 60px ${rgba(P.a, .32)},0 0 0 34px ${rgba(P.c, 0)},inset 0 2px 0 rgba(255,255,255,.4)`, duration: 1.4, ease: 'power2.out', repeat: rep}, tb + .9);
  fl.querySelectorAll('path').forEach((p, j) => { tl.fromTo(p, {opacity: 0, y: -14}, {opacity: 1, y: 0, duration: .45, ease: 'power2.out', repeat: rep * 2, repeatDelay: .95, keyframes: {opacity: [0, 1, 1, .15]}}, tb + .5 + j * .16); });
};

S.generico = (c) => { const {sc} = c; texto(c, {x: 210, y: 330, w: 1500, c: 1, k: sc.k, t: sc.t || sc.nombre || '', size: 116, maxH: 300, s: sc.s, at: .2}); };
['titulo', 'alumnos', 'historia', 'lista', 'compara'].forEach((k) => { S[k] = S.generico; });

// los "directores" (dir.js) registran aquí otras interpretaciones de cada escena: PRO.D[n][escena]
window.PRO = {S, D: {}, alSeek: [], alMontar: [], V, E, P, PR, A, A2, IM, VAR, N: () => N, $, esc, pal, rgba, norm, money, rnd, fit, img, OK, ICO, texto, objeto, decor, draw, sube, salta, flota, onda, cuenta};

// Regla A7 (18 nov): la primera vez que se muestra el Súper Pack, sus herramientas giran alrededor del mockup principal.
// Funciona con cualquier director: busca la imagen del pack ya colocada y gira las herramientas a su alrededor.
function orbita(cam, tl, sc, cue) {
  const pk = [...cam.querySelectorAll('img')].find((x) => /pack_5/.test(x.getAttribute('src') || ''));
  const L = (PR.cont || []).map((_, j) => 'c' + j).filter((k) => IM[k] && IM[k].ok); if (!pk || L.length < 2) return;
  const caja = pk.closest('.abs') || pk.parentElement; if (caja) caja.style.zIndex = 30;
  const T0 = 1.1, n = L.length  /* Christian, 18 nov 2:02 p.m.: las herramientas giran durante TODA la escena del pack, no solo al final */, G = {cx: 960, cy: 540, rx: 520, ry: 160, s: 190};
  // se mide cuando el pack ya está quieto y visible (antes la escena está oculta y no tiene medidas)
  const medir = () => { const r = pk.getBoundingClientRect(), c = cam.getBoundingClientRect(), k = c.width / 1920 || 1; if (!r.width) return;
    const w = r.width / k, h = r.height / k; G.cx = (r.left - c.left) / k + w / 2; G.cy = (r.top - c.top) / k + h * .58; G.rx = Math.max(320, w * .86); G.ry = Math.max(120, h * .42); G.s = Math.max(130, Math.min(220, h * .3));
    // LEY T6: la órbita nunca cruza los textos. Se miden los textos de la escena y el giro se encoge para no llegar a ellos;
    // si aun así una herramienta pisaría un texto, en ese momento se vuelve invisible (pon() la apaga).
    G.tx = [...cam.querySelectorAll('h1,h2,h3,h4,.T,.P,.K,.chip,.fila,.btn,.bt,.ej')].filter((e) => !e.contains(pk) && !it.some((d) => d.contains(e)))
      .map((e) => e.getBoundingClientRect()).filter((q) => q.width * q.height > 40)
      .map((q) => ({l: (q.left - c.left) / k - 24, r: (q.right - c.left) / k + 24, t: (q.top - c.top) / k - 18, b: (q.bottom - c.top) / k + 18}));
    for (const q of G.tx) if (q.b > G.cy - G.ry - G.s && q.t < G.cy + G.ry + G.s) {
      if (q.r < G.cx) G.rx = Math.max(140, Math.min(G.rx, G.cx - q.r - G.s * .5)); else if (q.l > G.cx) G.rx = Math.max(140, Math.min(G.rx, q.l - G.cx - G.s * .5)); } };
  const it = L.map((k) => { const d = document.createElement('div'); d.className = 'abs'; d.style.cssText = 'left:0;top:0;display:flex;align-items:center;justify-content:center;opacity:0'; d.innerHTML = img(k, 'max-width:100%;max-height:100%;filter:drop-shadow(0 14px 18px rgba(0,0,0,.55))'); cam.appendChild(d); return d; });
  const st = {a: 0, o: 0}, pon = () => it.forEach((d, j) => { const an = st.a + j * Math.PI * 2 / n, z = Math.sin(an), s = .6 + .4 * (z + 1) / 2;
    d.style.width = d.style.height = G.s + 'px'; d.style.margin = -G.s / 2 + 'px 0 0 ' + -G.s / 2 + 'px';
    const x = G.cx + Math.cos(an) * G.rx, y = G.cy + z * G.ry, m = G.s * s / 2;
    const pisa = (G.tx || []).some((q) => x + m > q.l && x - m < q.r && y + m > q.t && y - m < q.b);
    d.style.transform = `translate(${x}px,${y}px) scale(${s})`; d.style.zIndex = z > 0 ? 40 : 20; d.style.opacity = pisa ? 0 : st.o * (.6 + .4 * (z + 1) / 2); });
  tl.call(medir, null, T0 - .05); tl.to(st, {o: 1, duration: .6, onUpdate: pon}, T0); tl.to(st, {a: Math.PI * 2 * Math.max(.6, (sc.dur - T0) / 9), duration: Math.max(1, sc.dur - T0 + .4), ease: 'none', onUpdate: () => { medir(); pon(); }}, T0);  // se mide siempre: el pack puede seguir moviéndose
}
// LEY T6 (Christian, 19 nov): ningún texto encima de una imagen ni imagen encima de un texto. Antes de grabar se mide cada escena
// en dos momentos; si una imagen pisa un texto, la imagen se achica y se aparta del texto (propiedades CSS scale/translate, que se
// suman a las animaciones de GSAP sin romperlas). Lo que no se pueda separar lo marca después la revisión de calidad (qa.py).
function desencimar() {
  const R = (e) => e.getBoundingClientRect(), area = (r) => Math.max(0, r.width) * Math.max(0, r.height);
  const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const op = (e) => { let o = 1; for (let x = e; x && x !== document.body; x = x.parentElement) { const s = getComputedStyle(x); if (s.display === 'none' || s.visibility === 'hidden') return 0; o *= +s.opacity; } return o; };
  const log = [];
  V.escenas.forEach((sc, i) => { const el = sc.el; if (!el) return;
    for (const f of [.6, .93]) {
      window.__seek(sc.t0 + sc.vd * f);
      const textos = [...el.querySelectorAll('h1,h2,h3,h4,.T,.P,.K,.chip,.fila,.btn,.bt,.ej')].filter((e) => op(e) > .6 && area(R(e)) > 40);
      const imgs = [...el.querySelectorAll('img')].filter((e) => op(e) > .6 && area(R(e)) > 400 && area(R(e)) < 1920 * 1080 * .42);
      for (const im of imgs) for (const tx of textos) {
        if (tx.contains(im) || im.contains(tx)) continue;
        let n = 0, ri = R(im); const rt = R(tx);
        while (n < 7 && area(ri) > 0 && inter(rt, ri) / Math.min(area(rt), area(ri)) > .1) {
          const cx = (ri.left + ri.right) / 2, tcx = (rt.left + rt.right) / 2, cy = (ri.top + ri.bottom) / 2, tcy = (rt.top + rt.bottom) / 2;
          const [dx0, dy0] = String(im.style.translate || '0px 0px').split(' ').map((v) => parseFloat(v) || 0);
          const horiz = Math.abs(cx - tcx) / Math.max(1, rt.width + ri.width) >= Math.abs(cy - tcy) / Math.max(1, rt.height + ri.height);
          const dx = horiz ? Math.sign(cx - tcx || 1) * 46 : 0, dy = horiz ? 0 : Math.sign(cy - tcy || 1) * 34;
          im.style.translate = `${dx0 + dx}px ${dy0 + dy}px`; im.style.scale = String((parseFloat(im.style.scale) || 1) * .88);
          ri = R(im); n++;
        }
        if (n) log.push(i + 1);
      }
    }
  });
  window.__desencimado = [...new Set(log)];
}
// ================= FONDO, TRANSICIONES Y MONTAJE =================
function montar() {
  const B = document.body, bg = $('<div id="bg"><div class="luz"></div><div class="luz b"></div></div>'), ESC = $('<div id="esc"></div>'), FX = $('<div id="fx"></div>');
  const top = $('<div id="top"><svg><filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 0"/></filter><rect width="100%" height="100%" filter="url(#gr)"/></svg></div>');
  B.append(bg, ESC, FX, top); if (E.dir) B.classList.add('dir', 'dir' + E.dir, 'fam-' + (E.fam || 'gen'));
  window.PRO.alMontar.forEach((f) => f({bg, ESC, FX, top}));
  const polvo = Array.from({length: 42}, () => { const e = document.createElement('i'), s = 2 + rnd() * 5; e.style.width = e.style.height = s + 'px'; bg.appendChild(e); return {e, x: rnd() * 1920, y: rnd() * 1180, v: 8 + rnd() * 22, f: .2 + rnd() * .5, ph: rnd() * 6.28, o: .12 + rnd() * .38}; });
  const luces = bg.querySelectorAll('.luz');
  const amb = (t) => {
    luces[0].style.transform = `translate(${Math.sin(t * .11) * 420}px,${Math.cos(t * .09) * 180 - 120}px)`;
    luces[1].style.transform = `translate(${Math.cos(t * .08 + 2) * 520}px,${Math.sin(t * .1 + 1) * 260 + 120}px)`;
    for (const p of polvo) { const y = ((p.y - t * p.v) % 1180 + 1180) % 1180 - 50; p.e.style.transform = `translate(${p.x + Math.sin(t * p.f + p.ph) * 34}px,${y}px)`; p.e.style.opacity = p.o * (.55 + .45 * Math.sin(t * p.f * 2 + p.ph)); }
  };
  const M = gsap.timeline({paused: true});
  const TR = E.trs && E.trs.length ? E.trs : ['fundido', 'sube', 'panel', 'zoom', 'barrido', 'lateral'];  // cada diseño por producto trae sus propias transiciones (19 nov)
  const pan = $(`<div class="abs" style="left:-2500px;top:-200px;width:2300px;height:1480px;background:${P.sup};border-right:6px solid ${P.a};border-left:6px solid ${P.a};transform:skewX(-10deg);box-shadow:0 0 120px rgba(0,0,0,.6)"></div>`); FX.appendChild(pan);
  V.escenas.forEach((sc, i) => {
    const el = $('<div class="sc"><div class="cam"></div></div>'); ESC.appendChild(el); sc.el = el;
    const tl = gsap.timeline(), vz = sc.vz || Math.max(1.2, sc.vd - .7), ade = i ? .16 : 0;  // cada escena empieza a moverse un instante antes del corte
    const cue = (w, def, min) => { const v = norm(sc.voz), k = w ? v.indexOf(norm(w)) : -1; const t = k < 0 ? (def == null ? null : .22 + def * vz) : Math.max(.2, .22 + (k / Math.max(1, v.length)) * vz - .12); return t == null ? null : Math.max(t, min || 0); };
    try { ((window.PRO.D[E.dir] || {})[sc.c] || S[sc.c] || S.generico)({sc, i, el, cam: el.firstChild, tl, D: sc.dur, vz, cue, t0: sc.t0 - ade, fx: (t, n) => sfx(sc.t0 - ade + t, n)}); }
    catch (e) { console.error(e); window.__errores = (window.__errores || []).concat(sc.c + ': ' + e.message); }
    if (sc.c === 'revela' && !V.__orbita) { V.__orbita = 1; try { orbita(el.firstChild, tl, sc, cue); } catch (e) { console.error(e); } }
    tl.fromTo(el.firstChild, {scale: 1}, {scale: 1.03, duration: sc.dur + .6, ease: 'none'}, 0);
    const oro = el.querySelectorAll('.oro,.T .k .wi'); if (oro.length) tl.fromTo(oro, {backgroundPosition: '0% 0'}, {backgroundPosition: '100% 0', duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(sc.dur / 2.6) + 1}, .5);
    M.add(tl, sc.t0 - ade);
    if (i === 0) { el.style.visibility = 'visible'; M.from(el, {opacity: 0, duration: .5}, 0); return; }
    const pv = V.escenas[i - 1].el, t = sc.t0, tool = sc.c === 'tool2' && V.escenas[i - 1].c === 'tool2';
    const tr = tool && !E.trs ? (i % 2 ? 'lateral' : 'sube') : TR[(i + VAR * 2) % TR.length];
    let on = t - .02, off = t + .02;
    if (tr === 'fundido') { on = t - .1; off = t + .22; M.to(pv, {opacity: 0, scale: 1.06, filter: 'blur(16px)', duration: .28, ease: 'power2.in'}, t - .2); M.from(el, {opacity: 0, scale: .96, filter: 'blur(16px)', duration: .38, ease: 'power2.out'}, t - .06); }
    else if (tr === 'sube') { off = t + .1; M.to(pv, {y: -160, opacity: 0, duration: .24, ease: 'power2.in'}, t - .18); M.from(el, {y: 200, opacity: 0, duration: .42, ease: 'expo.out'}, t - .04); }
    else if (tr === 'lateral') { off = t + .1; M.to(pv, {x: -260, opacity: 0, duration: .24, ease: 'power2.in'}, t - .18); M.from(el, {x: 320, opacity: 0, duration: .42, ease: 'expo.out'}, t - .04); }
    else if (tr === 'zoom') { off = t + .08; M.to(pv, {scale: 1.6, opacity: 0, filter: 'blur(10px)', duration: .26, ease: 'power2.in'}, t - .2); M.from(el, {scale: .72, opacity: 0, duration: .45, ease: 'expo.out'}, t - .04); }
    else if (tr === 'barrido') { on = t - .2; off = t + .22;  // las dos escenas comparten un borde que cruza la pantalla
      M.fromTo(el, {clipPath: 'inset(0% 100% 0% 0%)'}, {clipPath: 'inset(0% 0% 0% 0%)', duration: .4, ease: 'power2.inOut'}, on); M.set(el, {clipPath: 'none'}, on + .42);
      M.fromTo(pv, {clipPath: 'inset(0% 0% 0% 0%)'}, {clipPath: 'inset(0% 0% 0% 100%)', duration: .4, ease: 'power2.inOut'}, on); }
    else { M.fromTo(pan, {x: 0}, {x: 2440, duration: .3, ease: 'power3.in'}, t - .3); M.to(pan, {x: 4900, duration: .34, ease: 'power3.out'}, t + .02); M.set(pan, {x: 0}, t + .42); }
    M.set(el, {visibility: 'visible'}, on); M.set(pv, {visibility: 'hidden'}, off);
    if (i % 4 === 0) sfx(t - .2, 'whoosh');  // 18 nov: no un sonido en cada corte
  });
  window.__seek = (t) => { M.time(Math.max(0, t), false); amb(t); window.PRO.alSeek.forEach((f) => f(t)); };
  try { desencimar(); } catch (e) { console.error(e); }
  window.__seek(0); window.__listo = true;
}
const fu = [E.dir ? E.dirFt || 'Montserrat' : E.ft || 'Montserrat', E.fb || 'Montserrat', 'Montserrat'].concat(E.dir ? ['JetBrains'] : [], E.fuentes || []);
Promise.all([...lista.map(([k, s]) => carga(k, s)), ...fu.flatMap((f) => [document.fonts.load(`800 40px ${f}`), document.fonts.load(`italic 800 40px ${f}`), document.fonts.load(`500 40px ${f}`), document.fonts.load(`700 40px ${f}`), document.fonts.load(`900 40px ${f}`)])])
  .then(() => document.fonts.ready).then(montar).catch((e) => { console.error(e); window.__errores = [String(e)]; window.__listo = true; });
})();
