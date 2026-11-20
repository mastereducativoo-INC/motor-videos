// Diseños por producto (regla V1, Christian 19 nov): cada producto lleva 9 videos y los 9 DISEÑOS son todos distintos
// (colores, fondo, tipografía, composición de cada escena, animaciones, transiciones y música). Solo se repiten las imágenes.
// Ajedrez: 11 Tablero (dir.js) + 12 Reloj · 13 Ranking · 14 Pizarra · 15 Mármol · 16 Planilla · 17 Blitz · 18 Isométrico · 19 Geométrico.
// Cada escena tiene varias composiciones (FEL, GRA, ESC, TOOL, REV, TOD, PRE, INV, CTA) y cada diseño usa una distinta.
// LEY T6: textos e imágenes nunca se enciman: cada composición separa la zona del texto de la zona de la imagen.
(() => {
const PRO = window.PRO, X = PRO.X; if (!X) return;
const {D, S, E, P, PR, IM, $, esc, pal, rgba, norm, money, rnd, fit, img, OK, ICO, texto, objeto, draw, sube, salta, flota, onda, cuenta} = PRO;
const {camino, YA, tool, precio, puntos, PAL, sobre, MODS, cuandoDice, CHESS} = X;
// Estos diseños nacieron en Ajedrez y ahora son la biblioteca automática de TODOS los productos (19 nov): fuera de ajedrez
// ninguna pieza de ajedrez. El peón pasa a ser una persona (alumno) y el rey/la reina, un trofeo del color del diseño.
const PERSONA = '<circle cx="50" cy="38" r="24"/><path d="M8 140c0-34 18-62 42-62s42 28 42 62z"/>';
const TROFEO = '<path d="M22 14h56v26c0 22-12 38-28 40-16-2-28-18-28-40z"/><path d="M22 22H6v8c0 14 8 22 18 22M78 22h16v8c0 14-8 22-18 22" fill="none" stroke="currentColor" stroke-width="7"/><rect x="43" y="78" width="14" height="26"/><rect x="26" y="104" width="48" height="12" rx="3"/><rect x="18" y="118" width="64" height="18" rx="4"/>';
const pieza = CHESS ? X.pieza : (k, h, col, st = '') => `<svg viewBox="0 0 100 140" width="${Math.round(h * 100 / 140)}" height="${h}" style="overflow:visible;color:${col};${st}" fill="${col}">${k === 'peon' ? PERSONA : TROFEO}</svg>`;
const N = () => PRO.N();
const CLARO = () => { const n = parseInt(P.bg.slice(1), 16); return ((n >> 16) * .3 + ((n >> 8) & 255) * .59 + (n & 255) * .11) > 150; };
const SOMBRA = (a) => `drop-shadow(0 ${CLARO() ? 22 : 30}px ${CLARO() ? 26 : 36}px rgba(0,0,0,${CLARO() ? a * .5 : a}))`;
// imagen contenida en una caja (nunca se deforma)
const caja = (c, k, x, y, w, h, o = {}) => { if (!IM[k] || !IM[k].ok) return null;
  const e = $(`<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;display:flex;align-items:${o.al || 'center'};justify-content:${o.ju || 'center'};${o.st || ''}">${img(k, `max-width:100%;max-height:100%;filter:${SOMBRA(o.sh || .5)};${o.ist || ''}`)}</div>`);
  (o.en || c.cam).appendChild(e); return e; };
const svg = (c, inner, st = '') => { const e = $(`<svg class="abs" style="left:0;top:0;overflow:visible;${st}" width="1920" height="1080" viewBox="0 0 1920 1080">${inner}</svg>`); c.cam.appendChild(e); return e; };
const div = (c, st, html = '', cls = 'abs') => { const e = $(`<div class="${cls}" style="${st}">${html}</div>`); c.cam.appendChild(e); return e; };
const lbl = (t, st = '') => `<div class="K" style="${st}">${esc(t)}</div>`;
const nomb = (s) => String(s || '').replace(/\*/g, '');
const tP = (c) => Math.max(c.cue('llevas', null) || c.cue('por solo', null) || c.cue(' por ', .72), 2.4);

// ======================= FONDOS (uno por diseño) =======================
const FONDO = {
  12: (c) => { // Reloj: papel crema, un reloj de ajedrez enorme y tenue que marca el tiempo
    div(c, `inset:0;background:radial-gradient(1400px 900px at 30% 10%,#fbf6ec 0%,${P.bg} 60%,#e2d7c2 100%)`);
    const r = 520, cx = 1640, cy = 860;
    const s = svg(c, `<g opacity=".09" stroke="${P.ink}" fill="none"><circle cx="${cx}" cy="${cy}" r="${r}" stroke-width="10"/>${Array.from({length: 60}, (_, j) => { const a = j * Math.PI / 30, r2 = r - (j % 5 ? 26 : 60); return `<line x1="${cx + Math.sin(a) * (r - 14)}" y1="${cy - Math.cos(a) * (r - 14)}" x2="${cx + Math.sin(a) * r2}" y2="${cy - Math.cos(a) * r2}" stroke-width="${j % 5 ? 4 : 10}"/>`; }).join('')}<line class="mh" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r + 80}" stroke-width="14" stroke-linecap="round"/></g>`);
    c.tl.fromTo(s.querySelector('.mh'), {rotation: -30}, {rotation: 40, svgOrigin: `${cx} ${cy}`, duration: c.D + .5, ease: 'none'}, 0); },
  13: (c) => { // Ranking: cuadrícula clara de gráfica y una línea que sube al fondo
    div(c, `inset:0;background:${P.bg};background-image:linear-gradient(${rgba(P.b, .07)} 1px,transparent 1px),linear-gradient(90deg,${rgba(P.b, .07)} 1px,transparent 1px);background-size:120px 120px`);
    const s = svg(c, `<polyline points="0,1010 260,960 520,985 780,880 1040,900 1300,780 1560,700 1920,560" fill="none" stroke="${rgba(P.a, .18)}" stroke-width="12" stroke-linejoin="round" pathLength="1" class="ln2"/>`);
    c.tl.fromTo(s.querySelector('polyline'), {strokeDasharray: 1, strokeDashoffset: 1}, {strokeDashoffset: 0, duration: 2.4, ease: 'power2.out'}, 0); },
  14: (c) => { // Pizarra: pizarrón de gis con marco de madera y polvo de gis
    div(c, `inset:0;background:radial-gradient(1200px 700px at 40% 30%,#323a40 0%,${P.bg} 70%);box-shadow:inset 0 0 0 26px #5b4330,inset 0 0 0 32px #3f2e21,inset 0 0 160px rgba(0,0,0,.6)`);
    div(c, `inset:0;opacity:.5;background:radial-gradient(500px 120px at 25% 78%,rgba(255,255,255,.06),transparent 70%),radial-gradient(600px 160px at 70% 22%,rgba(255,255,255,.05),transparent 70%),radial-gradient(400px 100px at 80% 70%,rgba(255,255,255,.04),transparent 70%)`); },
  15: (c) => { // Mármol: blanco con vetas grises y una línea de bronce
    div(c, `inset:0;background:radial-gradient(1500px 900px at 50% 20%,#ffffff 0%,${P.bg} 70%,#e7e1d8 100%)`);
    svg(c, `<g fill="none" stroke="#8c8580" stroke-linecap="round" opacity=".16" style="filter:blur(1.4px)"><path d="M-40 220C300 160 420 340 760 300S1200 120 1500 220 1900 180 1980 140" stroke-width="3"/><path d="M-40 760C260 700 520 880 900 820S1400 640 1980 760" stroke-width="2.4"/><path d="M200 1100C320 900 300 760 520 640" stroke-width="1.8"/><path d="M1400 -20C1460 160 1360 300 1520 420" stroke-width="2"/></g>`);
    div(c, `left:0;right:0;bottom:0;height:8px;background:linear-gradient(90deg,transparent,${P.a},transparent)`); },
  16: (c) => { // Planilla: hoja de anotación de partidas con renglones y margen rojo
    div(c, `inset:0;background:${P.bg};background-image:repeating-linear-gradient(180deg,transparent 0 63px,${rgba(P.b, .14)} 63px 65px);background-position:0 30px`);
    div(c, `left:96px;top:0;bottom:0;width:3px;background:${rgba(P.a, .45)}`); div(c, `left:104px;top:0;bottom:0;width:1.5px;background:${rgba(P.a, .3)}`); },
  17: (c) => { // Blitz: oscuro con franjas de velocidad en diagonal
    div(c, `inset:0;background:${P.bg}`);
    const f = div(c, `left:-400px;top:-200px;width:2800px;height:1500px;transform:rotate(-14deg);background:repeating-linear-gradient(90deg,transparent 0 140px,${rgba(P.ink, .035)} 140px 150px,transparent 150px 330px,${rgba(P.a, .06)} 330px 336px)`);
    c.tl.fromTo(f, {x: 0}, {x: -420, duration: c.D + .5, ease: 'none'}, 0);
    const sl = div(c, `left:-60px;top:1062px;width:520px;height:14px;background:${P.a};transform:rotate(-14deg);transform-origin:0 0;opacity:.9`); c.tl.from(sl, {scaleX: 0, duration: .5, ease: 'expo.out'}, .05); },
  18: (c) => { // Isométrico: noche índigo con un tablero isométrico al fondo
    div(c, `inset:0;background:radial-gradient(1400px 800px at 50% 0%,#2b2f63 0%,${P.bg} 65%)`);
    const W = 110, H = 64, rows = 9, cols = 9, ox = 960, oy = 610; let g = '';
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) { const x = ox + (q - r) * W / 2, y = oy + (q + r) * H / 2; g += `<path d="M${x} ${y}l${W / 2} ${H / 2}l${-W / 2} ${H / 2}l${-W / 2} ${-H / 2}z" fill="${(q + r) % 2 ? rgba(P.ink, .045) : rgba(P.b, .14)}"/>`; }
    const s = svg(c, `<g>${g}</g>`); c.tl.fromTo(s, {y: 120, opacity: 0}, {y: 0, opacity: 1, duration: 1.1, ease: 'expo.out'}, 0); },
  19: (c) => { // Geométrico: formas planas grandes en las esquinas (círculo, cuarto de círculo, barra)
    div(c, `inset:0;background:${P.bg}`);
    const a = div(c, `right:-250px;top:-280px;width:520px;height:520px;border-radius:50%;background:${P.c};opacity:.85`);
    const b = div(c, `left:-200px;bottom:-200px;width:420px;height:420px;border-top-right-radius:100%;background:${P.a};opacity:.85`);
    const d = div(c, `right:120px;bottom:70px;width:300px;height:40px;background:${P.b}`);
    c.tl.from(a, {scale: .3, opacity: 0, duration: .9, ease: 'back.out(1.4)'}, 0); c.tl.from(b, {x: -300, duration: .8, ease: 'expo.out'}, .05); c.tl.from(d, {scaleX: 0, transformOrigin: '0 50%', duration: .6, ease: 'expo.out'}, .2); },
};

// ======================= ¡COMPRA CONFIRMADA! =======================
const FEL = {
  esfera: (c) => { // el logo dentro de un reloj; la manecilla da la vuelta y "marca" la compra
    const cx = 960, cy = 340, r = 300;
    const s = svg(c, `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${rgba(P.sup, .9)}" stroke="${P.a}" stroke-width="10"/>${Array.from({length: 12}, (_, j) => { const a = j * Math.PI / 6; return `<line x1="${cx + Math.sin(a) * (r - 20)}" y1="${cy - Math.cos(a) * (r - 20)}" x2="${cx + Math.sin(a) * (r - 46)}" y2="${cy - Math.cos(a) * (r - 46)}" stroke="${P.ink}" stroke-width="6" stroke-linecap="round"/>`; }).join('')}<line class="mh" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r + 34}" stroke="${P.a}" stroke-width="8" stroke-linecap="round" opacity=".55"/>`);
    c.tl.from(s, {scale: .5, opacity: 0, transformOrigin: `${cx}px ${cy}px`, duration: .9, ease: 'back.out(1.5)'}, .05);
    c.tl.fromTo(s.querySelector('.mh'), {rotation: 0}, {rotation: 360, svgOrigin: `${cx} ${cy}`, duration: 1.3, ease: 'power2.inOut'}, .3); c.fx(1.6, 'click');
    const lo = caja(c, IM.logo && IM.logo.ok ? 'logo' : 'pack', cx - 230, cy - 170, 460, 340); if (lo) c.tl.from(lo, {scale: .3, opacity: 0, duration: .8, ease: 'back.out(1.7)'}, 1.5);
    texto(c, {x: 160, y: 700, w: 1600, c: 1, t: c.sc.t, s: c.sc.s, size: 104, maxH: 130, at: .9}); c.fx(1.6, 'venta'); },
  dividido: (c) => { // logo a la izquierda, título a la derecha con su línea que sube
    const lo = caja(c, IM.logo && IM.logo.ok ? 'logo' : 'pack', 110, 190, 760, 560); if (lo) { c.tl.from(lo, {x: -200, opacity: 0, duration: .9, ease: 'expo.out'}, .2); flota(c.tl, lo, c.D, {at: 1.2}); }
    const b = div(c, `left:960px;top:300px;width:6px;height:420px;background:${P.a}`); c.tl.from(b, {scaleY: 0, transformOrigin: '50% 100%', duration: .6, ease: 'expo.out'}, .3);
    texto(c, {x: 1010, y: 330, w: 820, k: 'Pedido confirmado', t: c.sc.t, s: c.sc.s, size: 112, maxH: 270, at: .5}); c.fx(.9, 'venta'); },
  gis: (c) => { // un círculo de gis se dibuja alrededor del logo; subrayado a mano
    const lo = caja(c, IM.logo && IM.logo.ok ? 'logo' : 'pack', 610, 80, 700, 440); if (lo) c.tl.from(lo, {opacity: 0, scale: .85, duration: .8, ease: 'power3.out'}, .2);
    const s = svg(c, `<ellipse cx="960" cy="300" rx="470" ry="268" fill="none" stroke="${P.a}" stroke-width="7" stroke-linecap="round" pathLength="1" transform="rotate(-3 960 300)"/><path d="M640 930C820 910 1100 912 1290 928" fill="none" stroke="${P.a}" stroke-width="6" stroke-linecap="round" pathLength="1"/>`);
    draw(c.tl, s.querySelector('ellipse'), .6, 1.1); draw(c.tl, s.querySelector('path'), 1.9, .6); c.fx(.7, 'whoosh');
    texto(c, {x: 160, y: 650, w: 1600, c: 1, t: c.sc.t, s: c.sc.s, size: 110, maxH: 140, at: .9, ul: false}); },
  marco: (c) => { // marco de bronce con el logo, como una obra en museo
    const f = div(c, `left:540px;top:60px;width:840px;height:500px;border:3px solid ${P.a};box-shadow:inset 0 0 0 16px ${P.bg},inset 0 0 0 17px ${rgba(P.a, .6)},0 30px 60px rgba(0,0,0,.12);background:${rgba('#ffffff', .55)}`);
    c.tl.from(f, {opacity: 0, scale: 1.08, duration: 1, ease: 'expo.out'}, .1);
    const lo = caja(c, IM.logo && IM.logo.ok ? 'logo' : 'pack', 600, 100, 720, 420); if (lo) c.tl.from(lo, {opacity: 0, y: 30, duration: .9, ease: 'power3.out'}, .5);
    const pl = div(c, `left:810px;top:540px;width:300px;height:42px;background:${P.a};color:${P.sobre};font:700 18px/42px Montserrat;letter-spacing:.3em;text-align:center`, 'CONFIRMADA'); c.tl.from(pl, {scaleX: 0, duration: .5, ease: 'expo.out'}, 1);
    texto(c, {x: 160, y: 650, w: 1600, c: 1, t: c.sc.t, s: c.sc.s, size: 104, maxH: 130, at: .8}); },
  resultado: (c) => { // marcador de partida "1–0" (ganaste; fuera de ajedrez "100%") y el logo en la hoja
    const r = div(c, `left:150px;top:110px;width:760px`, `<div style="font:700 26px JetBrains,monospace;letter-spacing:.3em;color:${P.a}">RESULTADO</div><div class="num" style="font:800 300px/1 JetBrains,monospace;color:${P.ink};margin-top:10px">${CHESS ? '1–0' : '100%'}</div>`);
    c.tl.from(r.children, {y: 40, opacity: 0, duration: .7, ease: 'expo.out', stagger: .15}, .2); c.fx(.6, 'golpe');
    const h = div(c, `left:1060px;top:110px;width:700px;height:620px;background:${P.sup};box-shadow:0 30px 60px rgba(0,0,0,.14);transform:rotate(2deg)`); c.tl.from(h, {y: 400, rotation: 12, opacity: 0, duration: .9, ease: 'expo.out'}, .3);
    const lo = caja(c, IM.logo && IM.logo.ok ? 'logo' : 'pack', 1100, 160, 620, 520); if (lo) c.tl.from(lo, {opacity: 0, scale: .8, duration: .7, ease: 'back.out(1.5)'}, .9);
    texto(c, {x: 150, y: 560, w: 860, t: c.sc.t, s: c.sc.s, size: 96, maxH: 240, at: .7}); },
  rafaga: (c) => { // ráfaga: el logo entra de golpe con estela de velocidad
    for (let j = 0; j < 7; j++) { const l = div(c, `left:0;top:${180 + j * 70}px;width:1200px;height:${6 + (j % 3) * 4}px;background:${j % 2 ? P.a : rgba(P.ink, .5)}`); c.tl.fromTo(l, {x: -1400}, {x: 2200, duration: .5, ease: 'power2.in'}, .15 + j * .04); }
    const lo = caja(c, IM.logo && IM.logo.ok ? 'logo' : 'pack', 1010, 110, 800, 560); if (lo) { c.tl.from(lo, {x: 900, skewX: -20, opacity: 0, filter: 'blur(20px)', duration: .55, ease: 'expo.out'}, .45); c.tl.to(lo, {x: -14, duration: .08, yoyo: true, repeat: 3}, 1); }
    c.fx(.5, 'whoosh'); c.fx(1, 'golpe');
    texto(c, {x: 120, y: 690, w: 1680, t: c.sc.t, s: c.sc.s, size: 124, maxH: 160, at: .9}); },
  pila: (c) => { // tres losas isométricas se apilan y el logo flota encima
    const cx = 960; let g = ''; [0, 1, 2].forEach((j) => { const y = 560 - j * 46, w = 560 - j * 90, h = w * .5; g += `<g class="l"><path d="M${cx} ${y - h / 2}l${w / 2} ${h / 2}l${-w / 2} ${h / 2}l${-w / 2} ${-h / 2}z" fill="${j === 2 ? P.a : rgba(P.b, .55 + j * .15)}"/><path d="M${cx - w / 2} ${y}l${w / 2} ${h / 2}v36l${-w / 2} ${-h / 2}z" fill="${rgba('#000000', .35)}"/><path d="M${cx + w / 2} ${y}l${-w / 2} ${h / 2}v36l${w / 2} ${-h / 2}z" fill="${rgba('#000000', .5)}"/></g>`; });
    const s = svg(c, g); c.tl.from(s.querySelectorAll('.l'), {y: -260, opacity: 0, duration: .55, ease: 'bounce.out', stagger: .22}, .1); c.fx(.6, 'pop'); c.fx(.85, 'pop');
    const lo = caja(c, IM.logo && IM.logo.ok ? 'logo' : 'pack', 660, 40, 600, 380); if (lo) { c.tl.from(lo, {y: -200, opacity: 0, duration: .8, ease: 'back.out(1.4)'}, .9); flota(c.tl, lo, c.D, {at: 1.8}); }
    texto(c, {x: 160, y: 700, w: 1600, c: 1, t: c.sc.t, s: c.sc.s, size: 104, maxH: 130, at: 1}); },
  formas: (c) => { // un círculo, un cuadrado y un medio círculo se arman y dentro aparece el logo
    const ci = div(c, `left:150px;top:230px;width:640px;height:640px;border-radius:50%;background:${P.c}`), sq = div(c, `left:560px;top:160px;width:220px;height:220px;background:${P.b}`), me = div(c, `left:120px;top:700px;width:300px;height:150px;border-radius:150px 150px 0 0;background:${P.a}`);
    c.tl.from(ci, {scale: 0, duration: .7, ease: 'back.out(1.6)'}, .1); c.tl.from(sq, {rotation: 90, scale: 0, duration: .6, ease: 'back.out(1.6)'}, .35); c.tl.from(me, {y: 200, opacity: 0, duration: .6, ease: 'expo.out'}, .5);
    const lo = caja(c, IM.logo && IM.logo.ok ? 'logo' : 'pack', 210, 330, 520, 440); if (lo) c.tl.from(lo, {scale: .4, opacity: 0, duration: .7, ease: 'back.out(1.7)'}, .9);
    texto(c, {x: 960, y: 330, w: 860, t: c.sc.t, s: c.sc.s, size: 112, maxH: 270, at: .6}); c.fx(1, 'pop'); },
};

// ======================= ESTO YA ES TUYO (todas las cajitas, con su nombre) =======================
const nomMod = (j) => (PR.mods || [])[j] || '';
const entraMod = (c, j, n) => cuandoDice(c, nomMod(j), .12 + .6 * j / Math.max(1, n));
const GRA = {
  arco: (c) => { // las cajitas en arco, como las horas de un reloj
    texto(c, {x: 160, y: 40, w: 1600, c: 1, k: c.sc.k || PR.curso, t: c.sc.t, size: 84, maxH: 110, at: .2});
    const ks = MODS(), n = ks.length, cx = 960, cy = 1130, R = 700, W = Math.min(300, 1500 / Math.max(1, n)), H = n > 6 ? 230 : 290;
    ks.forEach((k, j) => { const a = Math.PI * (1.17 + .66 * (n === 1 ? .5 : j / (n - 1))), x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R * .78;
      const b = caja(c, k, x - W / 2, y - H / 2 - 40, W, H, {al: 'flex-end'}), nm = div(c, `left:${x - W / 2}px;top:${y + H / 2 - 30}px;width:${W}px;text-align:center;font:700 ${n > 6 ? 20 : 24}px/1.2 var(--fb);color:${P.ink}`, esc(nomMod(j)));
      const at = entraMod(c, j, n); if (b) c.tl.from(b, {y: 220, opacity: 0, rotation: (j - (n - 1) / 2) * 6, duration: .8, ease: 'back.out(1.4)'}, at); c.tl.from(nm, {opacity: 0, y: 14, duration: .4}, at + .4); c.fx(at + .3, 'tick'); }); },
  tabla: (c) => { // tabla de posiciones: cada módulo es una fila con su número, su cajita y su nombre
    texto(c, {x: 120, y: 300, w: 640, k: c.sc.k || PR.curso, t: c.sc.t, s: c.sc.s, size: 104, maxH: 260, at: .2});
    const ks = MODS(), n = ks.length, hR = Math.min(170, (980 - 60) / Math.max(1, n)), y0 = (1080 - n * hR) / 2;
    ks.forEach((k, j) => { const y = y0 + j * hR;
      const f = div(c, `left:820px;top:${y + 8}px;width:1000px;height:${hR - 16}px;border-radius:18px;background:${P.sup};box-shadow:0 14px 30px rgba(0,0,0,.08);display:flex;align-items:center;gap:30px;padding:0 34px`, `<b style="font:800 ${hR * .36}px var(--ft);color:${P.a};width:70px">#${j + 1}</b><span style="width:${hR * 1.1}px;height:${hR - 34}px;display:flex;align-items:center;justify-content:center">${img(k, 'max-width:100%;max-height:100%')}</span><span style="font:700 ${Math.min(36, hR * .24)}px/1.2 var(--fb);color:${P.ink}">${esc(nomMod(j))}</span>`);
      const at = entraMod(c, j, n); c.tl.from(f, {x: 300, opacity: 0, duration: .6, ease: 'expo.out'}, at); c.fx(at + .2, 'tick'); }); },
  pizarra: (c) => { // cajitas en el pizarrón (3 + 2) con su nombre escrito con gis
    texto(c, {x: 160, y: 50, w: 1600, c: 1, k: c.sc.k || PR.curso, t: c.sc.t, size: 80, maxH: 100, at: .2, ul: false});
    const ks = MODS(), n = ks.length, f1 = Math.ceil(n / 2), H = n > 4 ? 260 : 360;
    ks.forEach((k, j) => { const fila = j < f1 ? 0 : 1, enF = fila ? n - f1 : f1, q = fila ? j - f1 : j, W = Math.min(360, 1500 / enF), x = 960 - enF * W / 2 + q * W, y = n > 4 ? (fila ? 640 : 250) : 330;
      const b = caja(c, k, x + 20, y, W - 40, H), nm = div(c, `left:${x}px;top:${y + H + 6}px;width:${W}px;text-align:center;font:400 30px/1.15 var(--ft);color:${P.ink}`, esc(nomMod(j)));
      const at = entraMod(c, j, n); if (b) c.tl.from(b, {opacity: 0, scale: .6, duration: .6, ease: 'back.out(1.6)'}, at); c.tl.from(nm, {clipPath: 'inset(0 100% 0 0)', duration: .6, ease: 'power2.out'}, at + .3); c.fx(at + .2, 'tick'); }); },
  galeria: (c) => { // galería: cada cajita en su marco con una placa con el nombre
    texto(c, {x: 160, y: 50, w: 1600, c: 1, k: c.sc.k || PR.curso, t: c.sc.t, size: 84, maxH: 104, at: .2});
    const ks = MODS(), n = ks.length, W = Math.min(330, 1680 / Math.max(1, n)), x0 = 960 - n * W / 2, H = 420;
    ks.forEach((k, j) => { const x = x0 + j * W;
      const fr = div(c, `left:${x + 14}px;top:270px;width:${W - 28}px;height:${H}px;border:3px solid ${P.a};background:#fff;box-shadow:0 20px 40px rgba(0,0,0,.1)`);
      const b = caja(c, k, x + 34, 300, W - 68, H - 60), nm = div(c, `left:${x + 24}px;top:${270 + H + 26}px;width:${W - 48}px;padding:10px 8px;text-align:center;background:${P.a};color:${P.sobre};font:600 ${n > 5 ? 17 : 20}px/1.2 var(--fb)`, esc(nomMod(j)));
      const at = entraMod(c, j, n); c.tl.from([fr, b].filter(Boolean), {opacity: 0, y: 40, duration: .7, ease: 'power3.out'}, at); c.tl.from(nm, {scaleX: 0, duration: .4, ease: 'expo.out'}, at + .4); c.fx(at + .2, 'tick'); }); },
  lista: (c) => { // lista numerada como anotación; las cajitas caen en una pila a la derecha
    texto(c, {x: 160, y: 70, w: 900, k: c.sc.k || PR.curso, t: c.sc.t, size: 92, maxH: 120, at: .2});
    const ks = MODS(), n = ks.length;
    ks.forEach((k, j) => { const at = entraMod(c, j, n), y = 290 + j * Math.min(120, 640 / Math.max(1, n));
      const f = div(c, `left:170px;top:${y}px;width:860px;display:flex;align-items:center;gap:26px;font:600 40px/1.15 var(--fb);color:${P.ink}`, `<b style="font:700 36px JetBrains,monospace;color:${P.a};width:70px">${j + 1}.</b><span>${esc(nomMod(j))}</span><b class="ok2" style="margin-left:auto;font:800 40px JetBrains;color:${P.a}">✓</b>`);
      c.tl.from(f, {opacity: 0, x: -30, duration: .45, ease: 'power3.out'}, at); c.tl.from(f.querySelector('.ok2'), {scale: 0, duration: .3, ease: 'back.out(2)'}, at + .35);
      const b = caja(c, k, 1180 + (j % 2 ? 60 : -20), 250 + j * 10, 560, 620); if (b) { c.tl.from(b, {y: -700, rotation: (j % 2 ? 1 : -1) * 18, opacity: 0, duration: .6, ease: 'power3.in'}, at); c.tl.to(b, {rotation: (j - (n - 1) / 2) * 4, duration: .2}, at + .6); } c.fx(at + .6, 'pop'); }); },
  cinta: (c) => { // banda veloz: las cajitas entran disparadas, con su nombre en mayúsculas
    texto(c, {x: 120, y: 60, w: 1680, k: c.sc.k || PR.curso, t: c.sc.t, size: 100, maxH: 120, at: .1});
    const ks = MODS(), n = ks.length, W = Math.min(340, 1700 / Math.max(1, n)), x0 = 960 - n * W / 2;
    ks.forEach((k, j) => { const x = x0 + j * W, at = entraMod(c, j, n);
      const b = caja(c, k, x + 14, 300, W - 28, 440), nm = div(c, `left:${x + 6}px;top:770px;width:${W - 12}px;text-align:center;font:800 ${n > 5 ? 20 : 24}px/1.15 var(--ft);text-transform:uppercase;color:${P.ink}`, esc(nomMod(j)));
      if (b) c.tl.from(b, {x: 1600, skewX: -18, filter: 'blur(14px)', duration: .45, ease: 'expo.out'}, at); c.tl.from(nm, {opacity: 0, x: 60, duration: .35}, at + .25); c.fx(at, 'whoosh'); }); },
  diagonal: (c) => { // en diagonal hacia arriba, como subir de nivel, cada una sobre su losa
    texto(c, {x: 120, y: 60, w: 1000, k: c.sc.k || PR.curso, t: c.sc.t, size: 90, maxH: 120, at: .2});
    const ks = MODS(), n = ks.length, W = Math.min(330, 1700 / Math.max(1, n));
    ks.forEach((k, j) => { const x = 110 + j * (1700 - W) / Math.max(1, n - 1), y = 560 - j * (300 / Math.max(1, n - 1)), at = entraMod(c, j, n);
      const lo = svg(c, `<path d="M${x + W / 2} ${y + 290}l${W / 2 - 10} 34l${-(W / 2 - 10)} 34l${-(W / 2 - 10)} -34z" fill="${rgba(P.a, .45)}"/>`);
      const b = caja(c, k, x + 20, y, W - 40, 310, {al: 'flex-end'}), nm = div(c, `left:${x}px;top:${y + 370}px;width:${W}px;text-align:center;font:700 ${n > 5 ? 19 : 23}px/1.2 var(--fb);color:${P.ink}`, esc(nomMod(j)));
      c.tl.from(lo, {opacity: 0, duration: .3}, at); if (b) c.tl.from(b, {y: -160, opacity: 0, duration: .6, ease: 'bounce.out'}, at); c.tl.from(nm, {opacity: 0, duration: .4}, at + .4); c.fx(at + .4, 'pop'); }); },
  mosaico: (c) => { // cada cajita sobre una figura de color distinta
    texto(c, {x: 160, y: 40, w: 1600, c: 1, k: c.sc.k || PR.curso, t: c.sc.t, size: 84, maxH: 104, at: .2});
    const ks = MODS(), n = ks.length, W = Math.min(330, 1700 / Math.max(1, n)), x0 = 960 - n * W / 2, cols = [P.c, P.a, P.b], fs = ['50%', '0', '160px 160px 0 0'];
    ks.forEach((k, j) => { const x = x0 + j * W, at = entraMod(c, j, n);
      const sh = div(c, `left:${x + 22}px;top:360px;width:${W - 44}px;height:${W - 44}px;border-radius:${fs[j % 3]};background:${cols[j % 3]}`);
      const b = caja(c, k, x + 16, 250, W - 32, 440), nm = div(c, `left:${x + 4}px;top:730px;width:${W - 8}px;text-align:center;font:800 ${n > 5 ? 20 : 24}px/1.2 var(--ft);color:${P.ink}`, esc(nomMod(j)));
      c.tl.from(sh, {scale: 0, rotation: 45, duration: .5, ease: 'back.out(1.6)'}, at - .1); if (b) c.tl.from(b, {y: -60, opacity: 0, duration: .5, ease: 'power3.out'}, at + .1); c.tl.from(nm, {opacity: 0, y: 12, duration: .4}, at + .35); c.fx(at, 'pop'); }); },
};

// ======================= TU SIGUIENTE OBJETIVO (el camino del curso al objetivo) =======================
const tSig = (c) => Math.max(1.8, c.cue(norm(c.sc.voz || '').includes('falta') ? 'falta' : 'siguiente', .45));
const ESC = {
  reloj: (c) => { // reloj de ajedrez: un lado "ya lo tienes", el otro "tu siguiente objetivo"; se presiona el botón y cambia de lado
    texto(c, {x: 160, y: 40, w: 1600, c: 1, t: c.sc.t, size: 92, maxH: 112, at: .2});
    const cm = camino(), ya = YA(), tf = tSig(c);
    const cuerpo = div(c, `left:260px;top:300px;width:1400px;height:600px;border-radius:40px;background:${P.ink};box-shadow:0 40px 80px rgba(0,0,0,.25)`);
    const bt = [div(c, `left:520px;top:236px;width:200px;height:70px;border-radius:18px 18px 0 0;background:${P.a}`), div(c, `left:1200px;top:236px;width:200px;height:70px;border-radius:18px 18px 0 0;background:${rgba(P.ink, .7)}`)];
    const cara = (x, tit, items, on) => div(c, `left:${x}px;top:340px;width:620px;height:520px;border-radius:28px;background:${on ? P.sup : rgba(P.sup, .55)};padding:44px 50px`, `<div class="K" style="font-size:22px">${esc(tit)}</div>${items.map((t) => `<div class="it" style="margin-top:28px;font:700 46px/1.1 var(--ft);color:${P.ink};display:flex;gap:18px;align-items:center"><span style="color:${P.a}">${on ? '✓' : '→'}</span>${esc(t)}</div>`).join('')}`);
    const A = cara(300, 'Ya lo tienes · tu curso', cm.slice(0, ya), true), B = cara(1000, 'Tu siguiente objetivo', cm.slice(ya), false);
    c.tl.from([cuerpo, ...bt], {y: 60, opacity: 0, duration: .7, ease: 'expo.out'}, .3); c.tl.from([A, B], {opacity: 0, duration: .5}, .6);
    c.tl.from(A.querySelectorAll('.it'), {x: -30, opacity: 0, duration: .4, stagger: .25}, .9);
    c.tl.to(bt[0], {y: 26, duration: .15}, tf - .2); c.tl.to(bt[1], {y: -16, backgroundColor: P.a, duration: .2}, tf - .1); c.fx(tf - .1, 'click');
    c.tl.to(B, {backgroundColor: P.sup, duration: .3}, tf); c.tl.from(B.querySelectorAll('.it'), {x: 30, opacity: 0, duration: .45, stagger: .35}, tf + .1); },
  grafica: (c) => { // gráfica que sube: cada paso es un punto; el último es el objetivo
    texto(c, {x: 120, y: 60, w: 1100, t: c.sc.t, size: 96, maxH: 120, at: .2});
    const cm = camino(), ya = YA(), tf = tSig(c), n = cm.length, x0 = 200, x1 = 1720, yA = 880, yB = 330, X = (j) => x0 + (x1 - x0) * j / Math.max(1, n - 1), Y = (j) => yA - (yA - yB) * Math.pow(j / Math.max(1, n - 1), 1.35);
    const s = svg(c, `<line x1="${x0 - 40}" y1="${yA + 40}" x2="${x1 + 40}" y2="${yA + 40}" stroke="${rgba(P.ink, .25)}" stroke-width="3"/><polyline class="a1" points="${cm.slice(0, ya).map((_, j) => X(j) + ',' + Y(j)).join(' ')}" fill="none" stroke="${P.b}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/><polyline class="a2" points="${cm.slice(ya - 1).map((_, j) => X(j + ya - 1) + ',' + Y(j + ya - 1)).join(' ')}" fill="none" stroke="${P.a}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>`);
    draw(c.tl, s.querySelector('.a1'), .6, .8); draw(c.tl, s.querySelector('.a2'), tf, 1.4, 'power1.inOut');
    cm.forEach((t, j) => { const on = j < ya, at = on ? .6 + j * .35 : tf + (j - ya + 1) * 1.4 / Math.max(1, n - ya);
      const p = div(c, `left:${X(j) - 22}px;top:${Y(j) - 22}px;width:44px;height:44px;border-radius:50%;background:${on ? P.b : P.a};border:6px solid ${P.bg};box-shadow:0 6px 16px rgba(0,0,0,.2)`);
      const l = div(c, `left:${X(j) - 130}px;top:${yA + 64}px;width:260px;text-align:center;font:700 32px var(--ft);color:${on ? P.mut : P.ink}`, esc(t));
      c.tl.from([p, l], {scale: 0, opacity: 0, duration: .4, ease: 'back.out(2)'}, at); c.fx(at, 'tick'); });
    const fl = div(c, `left:${X(n - 1) - 150}px;top:${Y(n - 1) - 130}px;width:300px;text-align:center`, `<span class="chip lleno" style="font-size:26px">${sobre(PAL)}Tu objetivo</span>`); c.tl.from(fl, {y: 30, opacity: 0, duration: .5, ease: 'back.out(2)'}, tf + 1.5); },
  flechas: (c) => { // en el pizarrón: los pasos escritos con gis, unidos por flechas; el último se encierra en un círculo
    texto(c, {x: 160, y: 50, w: 1600, c: 1, t: c.sc.t, size: 92, maxH: 112, at: .2, ul: false});
    const cm = camino(), ya = YA(), tf = tSig(c), n = cm.length, pos = cm.map((_, j) => [280 + j * 1360 / Math.max(1, n - 1), j % 2 ? 470 : 760]);
    let arr = ''; for (let j = 0; j < n - 1; j++) { const [a, b] = pos[j], [x, y] = pos[j + 1], mx = (a + x) / 2, my = Math.min(b, y) - 120; arr += `<path class="f${j}" d="M${a + 80} ${b - 50}Q${mx} ${my} ${x - 80} ${y - 50}" fill="none" stroke="${j < ya - 1 ? rgba(P.ink, .6) : P.a}" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 14" pathLength="1"/>`; }
    const s = svg(c, arr + `<ellipse class="ci" cx="${pos[n - 1][0]}" cy="${pos[n - 1][1]}" rx="190" ry="95" fill="none" stroke="${P.a}" stroke-width="7" pathLength="1"/>`);
    cm.forEach((t, j) => { const [x, y] = pos[j], at = j < ya ? .6 + j * .4 : tf + (j - ya) * .6;
      const w = div(c, `left:${x - 170}px;top:${y - 40}px;width:340px;text-align:center;font:400 60px/1 var(--ft);color:${j < ya ? rgba(P.ink, .75) : P.ink}`, esc(t) + (j < ya ? ' ✓' : ''));
      c.tl.from(w, {clipPath: 'inset(0 100% 0 0)', duration: .5, ease: 'power1.out'}, at); if (j) c.tl.fromTo(s.querySelector('.f' + (j - 1)), {opacity: 0}, {opacity: 1, duration: .3}, at - .25); c.fx(at, 'tick'); });
    draw(c.tl, s.querySelector('.ci'), tf + (n - ya) * .6, .7); },
  peldanos: (c) => { // escalinata de mármol: cada escalón es un paso; el rey de bronce sube hasta el objetivo
    texto(c, {x: 120, y: 60, w: 900, t: c.sc.t, size: 96, maxH: 230, at: .2});
    const cm = camino(), ya = YA(), tf = tSig(c), n = cm.length, W = 1400 / n, h = 104, X = (j) => 160 + j * W, Y = (j) => 960 - (j + 1) * h;
    cm.forEach((t, j) => { const st = div(c, `left:${X(j)}px;top:${Y(j)}px;width:${1760 - X(j)}px;height:${h * (j + 1) + 60}px;background:linear-gradient(180deg,#ffffff,#ece6dc);border-top:4px solid ${j < ya ? rgba(P.ink, .2) : P.a};box-shadow:0 -6px 20px rgba(0,0,0,.06)`, `<span style="position:absolute;left:24px;top:18px;font:700 44px var(--ft);color:${j < ya ? P.mut : P.ink}">${esc(t)}${j < ya ? ' ✓' : ''}</span>`);
      c.tl.from(st, {y: 300, opacity: 0, duration: .6, ease: 'expo.out'}, .3 + j * .12); });
    const k = div(c, `left:${X(0) + W / 2 - 50}px;top:${Y(0) - 150}px`, pieza('rey', 140, P.a, 'filter:drop-shadow(0 10px 12px rgba(0,0,0,.25))')); c.tl.from(k, {opacity: 0, y: -60, duration: .5}, 1);
    for (let j = 1; j < n; j++) { const at = j < ya ? 1.2 + j * .5 : tf + (j - ya) * .55; c.tl.to(k, {x: (X(j) - X(0)), y: (Y(j) - Y(0)), duration: .4, ease: 'power2.inOut'}, at); c.fx(at + .3, 'click'); } },
  jugadas: (c) => { // anotación: 1. Aprender ✓ 2. Practicar ✓ 3. … hasta la jugada brillante "!!"
    texto(c, {x: 160, y: 60, w: 1000, t: c.sc.t, size: 96, maxH: 120, at: .2});
    const cm = camino(), ya = YA(), tf = tSig(c), n = cm.length;
    cm.forEach((t, j) => { const at = j < ya ? .7 + j * .45 : tf + (j - ya) * .55, fin = j === n - 1;
      const f = div(c, `left:180px;top:${260 + j * 128}px;width:1000px;display:flex;gap:30px;align-items:baseline;font:600 56px/1 var(--ft);color:${j < ya ? P.mut : P.ink}`, `<b style="font:700 46px JetBrains,monospace;color:${P.a};width:90px">${j + 1}.</b><span>${esc(t)}</span><b style="font:800 50px JetBrains;color:${fin ? P.a : P.b}">${j < ya ? '✓' : fin ? '!!' : ''}</b>`);
      c.tl.from(f, {clipPath: 'inset(0 100% 0 0)', duration: .45, ease: 'steps(14)'}, at); c.fx(at, 'tick'); });
    const k = div(c, `left:1340px;top:240px`, pieza(cm.length > ya ? 'reina' : 'rey', 620, rgba(P.b, .9), 'filter:drop-shadow(0 26px 30px rgba(0,0,0,.18))')); c.tl.from(k, {opacity: 0, x: 120, duration: 1, ease: 'expo.out'}, tf); },
  barra: (c) => { // barra de progreso segmentada que se llena a toda velocidad hasta el objetivo
    texto(c, {x: 120, y: 80, w: 1680, t: c.sc.t, size: 120, maxH: 150, at: .1});
    const cm = camino(), ya = YA(), tf = tSig(c), n = cm.length, W = 1680 / n;
    cm.forEach((t, j) => { const at = j < ya ? .5 + j * .25 : tf + (j - ya) * .35;
      const seg = div(c, `left:${120 + j * W}px;top:560px;width:${W - 16}px;height:110px;background:${rgba(P.ink, .08)};transform:skewX(-14deg);overflow:hidden`, `<i style="position:absolute;inset:0;background:${j < ya ? P.b : P.a};transform-origin:0 50%"></i>`);
      const l = div(c, `left:${120 + j * W}px;top:470px;width:${W - 16}px;font:800 36px var(--ft);text-transform:uppercase;color:${j < ya ? P.mut : P.ink}`, esc(t));
      c.tl.from(seg.firstChild, {scaleX: 0, duration: .3, ease: 'power3.out'}, at); c.tl.from(l, {opacity: 0, y: 20, duration: .3}, at); c.fx(at, 'tick'); });
    const fin = div(c, `left:${120 + (n - 1) * W}px;top:710px;width:${W}px`, `<span class="chip lleno" style="font-size:28px">${sobre(PAL)}Tu objetivo</span>`); c.tl.from(fin, {x: 80, opacity: 0, duration: .4, ease: 'expo.out'}, tf + (n - ya) * .35 + .1); },
  diana: (c) => { // diana: cada anillo es un paso; el centro es el objetivo
    texto(c, {x: 120, y: 330, w: 760, t: c.sc.t, size: 100, maxH: 260, at: .2});
    const cm = camino(), ya = YA(), tf = tSig(c), n = cm.length, cx = 1340, cy = 560, R = 440;
    cm.forEach((t, j) => { const r = R * (1 - j / n), on = j < ya, at = on ? .5 + j * .35 : tf + (j - ya) * .45, fin = j === n - 1;
      const a = div(c, `left:${cx - r}px;top:${cy - r}px;width:${2 * r}px;height:${2 * r}px;border-radius:50%;background:${fin ? P.a : on ? rgba(P.b, .35 + j * .1) : rgba(P.ink, .07)};border:3px solid ${rgba(P.ink, .2)}`);
      const l = div(c, `left:${cx - 150}px;top:${cy - r + (fin ? r - 26 : 14)}px;width:300px;text-align:center;font:700 ${fin ? 38 : 28}px var(--ft);color:${fin ? P.sobre : P.ink}`, esc(t));
      c.tl.from(a, {scale: 0, duration: .5, ease: 'back.out(1.4)'}, at); c.tl.from(l, {opacity: 0, duration: .3}, at + .2); c.fx(at, 'pop'); }); },
  torre: (c) => { // bloques que se apilan: cada paso es un bloque; el de arriba es el objetivo
    texto(c, {x: 1010, y: 330, w: 800, t: c.sc.t, size: 104, maxH: 270, at: .2});
    const cm = camino(), ya = YA(), tf = tSig(c), n = cm.length, h = Math.min(140, 760 / n), cols = [P.b, P.c, P.a];
    cm.forEach((t, j) => { const at = j < ya ? .4 + j * .35 : tf + (j - ya) * .5, w = 680 - j * 50, fin = j === n - 1;
      const b = div(c, `left:${520 - w / 2}px;top:${960 - (j + 1) * h}px;width:${w}px;height:${h - 10}px;border-radius:${j % 2 ? '0' : '14px'};background:${fin ? P.a : j < ya ? rgba(P.ink, .14) : cols[j % 3]};display:flex;align-items:center;justify-content:center;font:800 ${Math.min(44, h * .38)}px var(--ft);color:${fin || j >= ya ? P.sobre : P.ink}`, esc(t));
      c.tl.from(b, {y: -700, rotation: (j % 2 ? 6 : -6), duration: .5, ease: 'bounce.out'}, at); c.fx(at + .35, 'pop'); }); },
};

// ======================= CADA HERRAMIENTA =======================
const cab = (c, k, en, at = .2) => { const e = $(`<div class="K" style="margin-bottom:22px">${esc(k.et)}</div>`); en.appendChild(e); c.tl.from(e, {opacity: 0, x: -30, duration: .6}, at); };
const pts = (c, en, list, o = {}) => list.forEach((p, j) => { const f = $(`<div class="fila" style="font-size:${o.fs || 38}px;margin-top:${o.gap || 18}px">${OK}<span>${esc(p)}</span></div>`); en.appendChild(f);
  const at = .3 + c.vz * (.4 + .5 * j / list.length); c.tl.from(f, {x: -30, autoAlpha: 0, duration: .5, ease: 'power3.out'}, at); draw(c.tl, f.querySelectorAll('circle,path'), at + .08, .4); c.fx(at + .1, 'tick'); });
const TOOL = {
  inclinada: (c) => { const k = tool(c); // imagen a la izquierda, inclinada como una carta, texto a la derecha
    const fr = div(c, `left:110px;top:120px;width:760px;height:840px;border-radius:30px;background:${P.sup};transform:rotate(-4deg);box-shadow:0 30px 60px rgba(0,0,0,.14)`); c.tl.from(fr, {rotation: -18, x: -200, opacity: 0, duration: .8, ease: 'expo.out'}, .05);
    const b = caja(c, 'c' + k.i, 150, 160, 680, 760); if (b) { c.tl.from(b, {scale: .7, opacity: 0, duration: .8, ease: 'back.out(1.4)'}, .25); flota(c.tl, b, c.D, {at: 1.2}); }
    const t = div(c, `left:990px;top:170px;width:820px`); cab(c, k, t); texto(c, {en: t, x: 0, y: 0, w: 820, t: k.t, s: k.s, size: 84, maxH: 200, at: .3}).style.position = 'relative'; pts(c, t, k.pts); },
  centro: (c) => { const k = tool(c); // imagen arriba al centro; título y frase abajo; los puntos como fichas en fila
    const b = caja(c, 'c' + k.i, 560, 60, 800, 500); if (b) c.tl.from(b, {y: -60, opacity: 0, duration: .8, ease: 'expo.out'}, .1);
    const et = div(c, `left:0;right:0;top:590px;text-align:center`, `<span class="chip" style="font-size:22px">${esc(k.et)}</span>`); c.tl.from(et, {opacity: 0, duration: .4}, .3);
    texto(c, {x: 160, y: 650, w: 1600, c: 1, t: k.t, s: k.s, size: 76, maxH: 90, ss: 38, sm: 10, at: .35});
    const row = div(c, `left:100px;right:100px;top:900px;display:flex;justify-content:center;gap:18px;flex-wrap:nowrap`);
    k.pts.forEach((p, j) => { const e = $(`<span class="chip lleno" style="font-size:24px;padding:12px 24px">${esc(p)}</span>`); row.appendChild(e); const at = .3 + c.vz * (.45 + .45 * j / k.pts.length); c.tl.from(e, {y: 40, opacity: 0, duration: .45, ease: 'back.out(2)'}, at); c.fx(at, 'tick'); });
    fit(row, 90, 16); },
  tarjeta: (c) => { const k = tool(c); // número gigante y texto a la izquierda; la herramienta en una tarjeta enmarcada con gis
    const nu = div(c, `left:120px;top:90px;font:400 220px/1 var(--ft);color:${rgba(P.a, .9)}`, String(k.i + 1).padStart(2, '0')); c.tl.from(nu, {opacity: 0, y: 40, duration: .6}, .1);
    const t = div(c, `left:130px;top:360px;width:800px`); texto(c, {en: t, x: 0, y: 0, w: 800, t: k.t, s: k.s, size: 78, maxH: 190, at: .3, ul: false}).style.position = 'relative'; pts(c, t, k.pts, {fs: 34});
    const s = svg(c, `<rect x="1040" y="110" width="760" height="860" rx="18" fill="none" stroke="${rgba(P.ink, .7)}" stroke-width="5" stroke-dasharray="18 10" pathLength="1"/>`); draw(c.tl, s.querySelector('rect'), .1, .9);
    const b = caja(c, 'c' + k.i, 1080, 150, 680, 780); if (b) c.tl.from(b, {opacity: 0, scale: .8, duration: .7, ease: 'back.out(1.5)'}, .5); },
  franja: (c) => { const k = tool(c); // panel de color a la izquierda con la herramienta; texto a la derecha
    const pn = div(c, `left:0;top:0;width:860px;height:1080px;background:linear-gradient(160deg,${rgba(P.a, .16)},${rgba(P.a, .06)})`); c.tl.from(pn, {x: -860, duration: .6, ease: 'expo.out'}, 0);
    const b = caja(c, 'c' + k.i, 80, 140, 700, 800); if (b) { c.tl.from(b, {x: -300, opacity: 0, duration: .8, ease: 'expo.out'}, .2); flota(c.tl, b, c.D, {at: 1.2}); }
    const t = div(c, `left:960px;top:200px;width:840px`); cab(c, k, t); texto(c, {en: t, x: 0, y: 0, w: 840, t: k.t, s: k.s, size: 86, maxH: 200, at: .3}).style.position = 'relative'; pts(c, t, k.pts); },
  hoja: (c) => { const k = tool(c); // el texto en una hoja de anotación a la izquierda; la herramienta a la derecha
    const h = div(c, `left:140px;top:100px;width:820px;height:880px;background:${P.sup};box-shadow:0 30px 60px rgba(0,0,0,.12);transform:rotate(-1.5deg);padding:60px 60px`); c.tl.from(h, {y: 300, opacity: 0, rotation: -8, duration: .8, ease: 'expo.out'}, .05);
    const t = div(c, `left:200px;top:160px;width:700px`); const et = $(`<div style="font:700 24px JetBrains,monospace;color:${P.a};letter-spacing:.2em;margin-bottom:20px">${esc(k.et.toUpperCase())}</div>`); t.appendChild(et); c.tl.from(et, {opacity: 0, duration: .4}, .3);
    texto(c, {en: t, x: 0, y: 0, w: 700, t: k.t, s: k.s, size: 76, maxH: 190, at: .35}).style.position = 'relative'; pts(c, t, k.pts, {fs: 34});
    const b = caja(c, 'c' + k.i, 1060, 110, 740, 860); if (b) c.tl.from(b, {x: 200, opacity: 0, duration: .8, ease: 'expo.out'}, .3); },
  diagonal: (c) => { const k = tool(c); // corte en diagonal: título arriba a la izquierda, herramienta abajo a la derecha
    const bd = div(c, `left:-200px;top:520px;width:2400px;height:900px;background:${rgba(P.a, .12)};transform:rotate(-14deg);transform-origin:0 0`); c.tl.from(bd, {x: 900, duration: .5, ease: 'expo.out'}, 0);
    const t = div(c, `left:110px;top:90px;width:980px`); cab(c, k, t, .15); texto(c, {en: t, x: 0, y: 0, w: 980, t: k.t, s: k.s, size: 92, maxH: 210, at: .2}).style.position = 'relative';
    const L = div(c, `left:110px;top:600px;width:820px`); pts(c, L, k.pts, {fs: 34, gap: 14});
    const b = caja(c, 'c' + k.i, 1060, 300, 760, 720); if (b) c.tl.from(b, {x: 600, skewX: -12, opacity: 0, duration: .55, ease: 'expo.out'}, .25); c.fx(.25, 'whoosh'); },
  foco: (c) => { const k = tool(c); // la herramienta al centro bajo un foco; puntos a los lados con líneas
    texto(c, {x: 160, y: 40, w: 1600, c: 1, k: k.et, t: k.t, size: 76, maxH: 96, at: .15});
    const sp = div(c, `left:560px;top:150px;width:800px;height:900px;background:radial-gradient(closest-side,${rgba(P.a, .3)},transparent 75%)`); c.tl.from(sp, {opacity: 0, scale: .6, duration: .8}, .1);
    const b = caja(c, 'c' + k.i, 640, 260, 640, 700); if (b) c.tl.from(b, {opacity: 0, y: 60, duration: .8, ease: 'expo.out'}, .3);
    k.pts.forEach((p, j) => { const izq = j % 2 === 0, y = 360 + Math.floor(j / 2) * 260, at = .3 + c.vz * (.45 + .45 * j / k.pts.length);
      const e = div(c, `left:${izq ? 100 : 1340}px;top:${y}px;width:480px;text-align:${izq ? 'right' : 'left'};font:700 34px/1.2 var(--fb);color:${P.ink}`, `<span style="display:block;font:800 22px var(--ft);color:${P.a};letter-spacing:.2em">0${j + 1}</span>${esc(p)}`);
      const l = svg(c, `<line x1="${izq ? 600 : 1320}" y1="${y + 40}" x2="${izq ? 680 : 1240}" y2="${y + 40}" stroke="${P.a}" stroke-width="3" pathLength="1"/>`);
      c.tl.from(e, {opacity: 0, x: izq ? -30 : 30, duration: .45}, at); draw(c.tl, l.querySelector('line'), at + .1, .3); c.fx(at, 'tick'); });
    if (k.s) { const sl = div(c, `left:160px;right:160px;top:985px;text-align:center`, `<span class="P s" style="font-size:36px">${esc(k.s)}</span>`); c.tl.from(sl, {opacity: 0, duration: .5}, 1); } },
  bloque: (c) => { const k = tool(c); // figura de color grande detrás de la herramienta; puntos numerados en círculos
    const fg = div(c, `left:1090px;top:170px;width:700px;height:700px;border-radius:${['50%', '0', '350px 350px 0 0'][k.i % 3]};background:${[P.c, P.b, P.a][k.i % 3]}`); c.tl.from(fg, {scale: 0, rotation: -30, duration: .6, ease: 'back.out(1.5)'}, .05);
    const b = caja(c, 'c' + k.i, 1060, 120, 760, 820); if (b) c.tl.from(b, {y: 80, opacity: 0, duration: .7, ease: 'expo.out'}, .3);
    const t = div(c, `left:130px;top:160px;width:860px`); cab(c, k, t); texto(c, {en: t, x: 0, y: 0, w: 860, t: k.t, s: k.s, size: 88, maxH: 200, at: .3}).style.position = 'relative';
    k.pts.forEach((p, j) => { const e = $(`<div style="display:flex;gap:22px;align-items:center;margin-top:20px;font:700 34px/1.15 var(--fb);color:${P.ink}"><b style="flex:none;width:58px;height:58px;border-radius:50%;background:${[P.a, P.b, P.c][j % 3]};color:#fff;display:flex;align-items:center;justify-content:center;font:800 26px var(--ft)">${j + 1}</b>${esc(p)}</div>`); t.appendChild(e);
      const at = .3 + c.vz * (.4 + .5 * j / k.pts.length); c.tl.from(e, {opacity: 0, x: -30, duration: .45}, at); c.fx(at, 'tick'); }); },
};

// ======================= EL SÚPER PACK APARECE (las herramientas giran solas a su alrededor) =======================
const REV = {
  base: (c) => S.revela(c),
  centro: (c) => { // título arriba, el pack al centro, la frase abajo
    texto(c, {x: 160, y: 40, w: 1600, c: 1, k: c.sc.k, t: nomb(c.sc.t || PR.oferta), size: 96, maxH: 110, at: .3});
    const b = caja(c, 'pack', 610, 230, 700, 640); if (b) { c.tl.from(b, {scale: .4, opacity: 0, duration: 1, ease: 'back.out(1.5)'}, .5); c.fx(.6, 'riser'); c.fx(1.2, 'golpe'); }
    if (c.sc.s) texto(c, {x: 160, y: 930, w: 1600, c: 1, t: c.sc.s, size: 56, maxH: 70, at: Math.max(1.4, c.cue('compet', .4))}); },
  derecha: (c) => { // el pack a la izquierda, el texto a la derecha
    const b = caja(c, 'pack', 110, 170, 760, 760); if (b) { c.tl.from(b, {x: -300, opacity: 0, duration: 1, ease: 'expo.out'}, .3); c.fx(.4, 'riser'); }
    texto(c, {x: 1030, y: 280, w: 790, k: c.sc.k, t: nomb(c.sc.t || PR.oferta), s: c.sc.s, size: 104, maxH: 260, ss: 46, at: .6}); },
};

// ======================= LAS 8 JUNTAS =======================
const valorTot = () => (PR.cont || []).reduce((a, x) => a + (+x.valor || 0), 0) || +PR.valor || 0;
const TOD = {
  base: (c) => S.todas(c),
  fila: (c) => { // todas en una fila que se va armando; abajo el valor de referencia
    texto(c, {x: 160, y: 60, w: 1600, c: 1, t: c.sc.t, size: 86, maxH: 106, at: .1});
    const L = PR.cont || [], n = L.length, W = Math.min(230, 1760 / Math.max(1, n)), x0 = 960 - n * W / 2;
    L.forEach((ct, j) => { const at = .5 + j * .18, b = caja(c, 'c' + j, x0 + j * W + 6, 260, W - 12, 400, {sh: .35}), nm = div(c, `left:${x0 + j * W}px;top:690px;width:${W}px;text-align:center;font:700 19px/1.2 var(--fb);color:${P.ink}`, esc(ct.corto || ct.titulo));
      if (b) c.tl.from(b, {y: 300, opacity: 0, duration: .5, ease: 'back.out(1.4)'}, at); c.tl.from(nm, {opacity: 0, duration: .3}, at + .3); c.fx(at, 'tick'); });
    const v = div(c, `left:560px;width:800px;top:800px;text-align:center`, `<div class="K c" style="justify-content:center;font-size:22px">Valor de referencia</div><div class="num oro" style="font-size:150px;margin-top:6px">${money(valorTot())}</div>`); c.tl.from(v, {opacity: 0, y: 40, duration: .6, ease: 'expo.out'}, .5 + n * .18); c.fx(.6 + n * .18, 'monedas'); },
  anillo: (c) => { // las herramientas en círculo alrededor del valor
    texto(c, {x: 160, y: 40, w: 1600, c: 1, t: c.sc.t, size: 80, maxH: 96, at: .1});
    const L = PR.cont || [], n = L.length, cx = 960, cy = 610, R = 330, s = 190;
    L.forEach((_, j) => { const a = -Math.PI / 2 + j * 2 * Math.PI / Math.max(1, n), b = caja(c, 'c' + j, cx + Math.cos(a) * R * 1.35 - s / 2, cy + Math.sin(a) * R - s / 2, s, s, {sh: .35}); if (b) { c.tl.from(b, {x: -Math.cos(a) * 300, y: -Math.sin(a) * 300, opacity: 0, duration: .6, ease: 'back.out(1.4)'}, .4 + j * .14); c.fx(.5 + j * .14, 'tick'); } });
    const v = div(c, `left:${cx - 260}px;top:${cy - 110}px;width:520px;text-align:center`, `<div class="K c" style="justify-content:center;font-size:22px">Valor de referencia</div><div class="num oro" style="font-size:130px;margin-top:4px">${money(valorTot())}</div>`); c.tl.from(v, {scale: .4, opacity: 0, duration: .6, ease: 'back.out(1.6)'}, .5 + n * .14); c.fx(.6 + n * .14, 'monedas'); },
};

// ======================= PRECIO =======================
const PRE = {
  base: (c) => S.precio(c),
  ticket: (c) => { // un recibo: valor tachado, descuento y el precio de hoy
    const {val, pre, desc} = precio(), tp = tP(c), tD = Math.max(1.1, c.cue('por ciento', .2));
    const h = div(c, `left:560px;top:90px;width:800px;height:900px;background:${CLARO() ? '#ffffff' : P.sup};box-shadow:0 30px 70px rgba(0,0,0,.18);padding:60px 70px;border-radius:6px`, `<div class="K c" style="justify-content:center">${esc(c.sc.k || 'Tu precio')}</div><div class="r1" style="margin-top:60px;display:flex;justify-content:space-between;font:600 40px var(--fb);color:${P.mut}"><span>Valor de referencia</span><span class="v">${money(val)}</span></div><div class="r2" style="margin-top:34px;display:flex;justify-content:space-between;font:700 40px var(--fb);color:${P.a}"><span>Descuento por tu compra</span><span>−${desc}%</span></div><div style="margin:50px 0 30px;border-top:4px dashed ${rgba(P.ink, .2)}"></div><div class="K c" style="justify-content:center;font-size:24px">Hoy pagas</div><div class="num oro t" style="font-size:250px;text-align:center;margin-top:10px">${money(pre)}</div>`);
    c.tl.from(h, {y: 600, duration: .8, ease: 'expo.out'}, .1); c.tl.from(h.querySelector('.r1'), {opacity: 0, x: -30, duration: .5}, .7); c.tl.from(h.querySelector('.r2'), {opacity: 0, x: -30, duration: .5}, tD); c.fx(tD, 'pop');
    c.tl.to(h.querySelector('.v'), {textDecoration: 'line-through', opacity: .5, duration: .2}, tp - .4); const t = h.querySelector('.t'); c.tl.from(t, {scale: 1.8, opacity: 0, duration: .6, ease: 'expo.out'}, tp); cuenta(c.tl, t, val, pre, tp, .8, money, 'power3.out'); c.fx(tp + .2, 'golpe'); c.fx(tp + .5, 'monedas'); },
  barras: (c) => { // dos barras: el valor (alta) y lo que pagas hoy (pequeña)
    const {val, pre, desc} = precio(), tp = tP(c);
    texto(c, {x: 120, y: 70, w: 1680, k: c.sc.k || 'Tu precio', t: `*${desc}%* de descuento`, size: 92, maxH: 110, at: .2});
    const base = 930, H = 560;
    const b1 = div(c, `left:420px;top:${base - H}px;width:300px;height:${H}px;background:${rgba(P.ink, .14)};transform-origin:50% 100%`), l1 = div(c, `left:380px;top:${base - H - 110}px;width:380px;text-align:center`, `<div class="P" style="font-size:28px;text-transform:uppercase;letter-spacing:.14em;font-weight:700">Valor</div><div class="num" style="font-size:84px;color:${P.mut}">${money(val)}</div>`);
    const h2 = Math.max(60, H * pre / Math.max(1, val)), b2 = div(c, `left:1180px;top:${base - h2}px;width:300px;height:${h2}px;background:${P.a};transform-origin:50% 100%`), l2 = div(c, `left:1040px;top:${base - h2 - 330}px;width:580px;text-align:center`, `<div class="P" style="font-size:32px;text-transform:uppercase;letter-spacing:.14em;font-weight:800;color:${P.a}">Hoy pagas</div><div class="num oro t" style="font-size:220px">${money(pre)}</div>`);
    div(c, `left:300px;top:${base}px;width:1320px;height:4px;background:${rgba(P.ink, .3)}`);
    c.tl.from(b1, {scaleY: 0, duration: .9, ease: 'expo.out'}, .5); c.tl.from(l1, {opacity: 0, duration: .5}, .9);
    c.tl.from(b2, {scaleY: 0, duration: .5, ease: 'expo.out'}, tp); c.tl.from(l2, {opacity: 0, y: 40, duration: .6, ease: 'expo.out'}, tp); cuenta(c.tl, l2.querySelector('.t'), val, pre, tp, .8, money, 'power3.out'); c.fx(tp + .2, 'golpe'); c.fx(tp + .5, 'monedas'); },
};

// ======================= LA INVERSIÓN (explicada con el objetivo, sin prometer dinero) =======================
const INV = {
  frase: (c) => { // la frase grande y abajo: precio → peón → reina (de jugar a competir)
    texto(c, {x: 160, y: 200, w: 1600, c: 1, t: c.sc.t, s: c.sc.s, size: 104, maxH: 260, at: .2});
    const r = div(c, `left:0;right:0;top:700px;display:flex;align-items:center;justify-content:center;gap:60px`, `<span class="chip lleno" style="font-size:52px;padding:18px 44px">${money(+PR.precio || 0)}</span><span style="font:800 70px var(--ft);color:${P.a}">→</span>${pieza('peon', 190, rgba(P.ink, .55))}<span style="font:800 70px var(--ft);color:${P.a}">→</span>${pieza('reina', 230, P.a)}`);
    c.tl.from(r.children, {opacity: 0, y: 40, duration: .5, ease: 'back.out(1.6)', stagger: .3}, 1); c.fx(1.9, 'pop'); c.fx(2.2, 'golpe'); },
  lado: (c) => { // el precio en un círculo a la izquierda y la idea a la derecha
    const ci = div(c, `left:170px;top:240px;width:600px;height:600px;border-radius:50%;border:12px solid ${P.a};display:flex;align-items:center;justify-content:center`, `<div class="num oro" style="font-size:200px">${money(+PR.precio || 0)}</div>`);
    c.tl.from(ci, {scale: .3, opacity: 0, rotation: -90, duration: .9, ease: 'back.out(1.4)'}, .2); c.fx(.5, 'pop');
    texto(c, {x: 900, y: 320, w: 900, t: c.sc.t, s: c.sc.s, size: 96, maxH: 260, at: .6}); },
};

// ======================= ÚLTIMO LLAMADO =======================
const CTA = {
  base: (c) => S.cta2(c),
  centro: (c) => { const {val, pre} = precio(); // título arriba, el pack al centro y el botón abajo
    texto(c, {x: 160, y: 40, w: 1600, c: 1, t: c.sc.t, size: 92, maxH: 110, at: .2});
    const b = caja(c, 'pack', 660, 190, 600, 560); if (b) { c.tl.from(b, {scale: .5, opacity: 0, duration: .8, ease: 'back.out(1.5)'}, .4); flota(c.tl, b, c.D, {at: 1.3}); }
    const r = div(c, `left:0;right:0;top:790px;display:flex;align-items:center;justify-content:center;gap:40px`, `<span class="num" style="font-size:70px;color:${P.mut};text-decoration:line-through">${money(val)}</span><span class="num oro" style="font-size:130px">${money(pre)}</span><span class="btn" style="font-size:36px;padding:26px 56px">Sí, lo quiero</span>`);
    c.tl.from(r.children, {opacity: 0, y: 40, duration: .5, ease: 'expo.out', stagger: .15}, 1); const bt = r.querySelector('.btn'); c.tl.to(bt, {scale: 1.06, duration: .6, yoyo: true, repeat: 12, ease: 'sine.inOut'}, 2); c.fx(1.2, 'pop'); },
  tarjeta: (c) => { const {val, pre} = precio(); // el pack a la izquierda; una tarjeta con precio y botón a la derecha
    const b = caja(c, 'pack', 100, 150, 760, 780); if (b) c.tl.from(b, {x: -300, opacity: 0, duration: .8, ease: 'expo.out'}, .2);
    const t = div(c, `left:960px;top:180px;width:860px;height:720px;border-radius:30px;background:${CLARO() ? '#ffffff' : P.sup};box-shadow:0 30px 70px rgba(0,0,0,.16);padding:56px 60px`); c.tl.from(t, {x: 300, opacity: 0, duration: .8, ease: 'expo.out'}, .3);
    texto(c, {en: t, x: 0, y: 0, w: 740, t: c.sc.t, size: 80, maxH: 200, at: .5}).style.position = 'relative';
    const r = $(`<div style="margin-top:40px;display:flex;align-items:baseline;gap:26px"><span class="num" style="font-size:64px;color:${P.mut};text-decoration:line-through">${money(val)}</span><span class="num oro" style="font-size:150px">${money(pre)}</span></div>`); t.appendChild(r); c.tl.from(r, {opacity: 0, y: 30, duration: .5}, 1);
    const bt = $(`<div style="margin-top:40px"><span class="btn" style="font-size:34px;padding:24px 50px">Sí, lo quiero</span></div>`); t.appendChild(bt); c.tl.from(bt, {opacity: 0, scale: .7, duration: .5, ease: 'back.out(2)'}, 1.4); c.tl.to(bt.firstChild, {scale: 1.05, duration: .6, yoyo: true, repeat: 12, ease: 'sine.inOut'}, 2.2); c.fx(1.5, 'pop'); },
};


// ======================= BIENVENIDO AL CLUB =======================
const nAl = () => +PR.alumnos || 0;
const MULT = {
  base: (c) => S.multitud(c),
  contador: (c) => { // número gigante a la izquierda; a la derecha una fila de peones que se llena y uno eres tú
    const n = nAl(); const k = div(c, `left:120px;top:250px;width:900px`, `${c.sc.k ? `<div class="K">${esc(c.sc.k)}</div>` : ''}<div class="num oro" style="font-size:260px;margin-top:20px">${n.toLocaleString('en-US')}</div>`);
    c.tl.from(k.children, {opacity: 0, y: 40, duration: .7, stagger: .12, ease: 'expo.out'}, .2); if (n) cuenta(c.tl, k.querySelector('.num'), Math.round(n * .5), n, .4, 2, (v) => v.toLocaleString('en-US'), 'power3.out'); c.fx(.5, 'riser');
    texto(c, {x: 120, y: 640, w: 900, t: c.sc.t, size: 84, maxH: 210, at: 1.1});
    for (let j = 0; j < 24; j++) { const q = j % 6, r = Math.floor(j / 6), yo = j === 14, e = div(c, `left:${1140 + q * 110}px;top:${200 + r * 180}px`, pieza('peon', 140, yo ? P.a : rgba(P.ink, .22)));
      c.tl.from(e, {y: -80, opacity: 0, duration: .4, ease: 'back.out(2)'}, .5 + j * .05);
      if (yo) { const t = div(c, `left:${1140 + q * 110 - 10}px;top:${200 + r * 180 - 56}px;width:120px;text-align:center`, '<span class="chip lleno" style="font-size:22px;padding:6px 16px">TÚ</span>'); c.tl.from(t, {opacity: 0, y: -20, duration: .4, ease: 'back.out(2)'}, 2); } } },
  tablero: (c) => { // un tablero de 8×8 que se enciende casilla por casilla; en una estás tú
    const n = nAl(); texto(c, {x: 120, y: 200, w: 820, k: c.sc.k, t: c.sc.t, size: 88, maxH: 230, at: .9});
    if (n) { const nu = div(c, `left:120px;top:640px;width:820px`, `<div class="P" style="font-size:30px;letter-spacing:.2em;text-transform:uppercase;font-weight:700">Más de</div><div class="num oro" style="font-size:180px">${n.toLocaleString('en-US')}</div>`); c.tl.from(nu, {opacity: 0, y: 40, duration: .6}, .3); cuenta(c.tl, nu.querySelector('.num'), Math.round(n * .5), n, .4, 2, (v) => v.toLocaleString('en-US'), 'power3.out'); }
    const S0 = 100, x0 = 1060, y0 = 140; for (let j = 0; j < 64; j++) { const q = j % 8, r = Math.floor(j / 8), yo = j === 27;
      const e = div(c, `left:${x0 + q * S0}px;top:${y0 + r * S0}px;width:${S0}px;height:${S0}px;background:${(q + r) % 2 ? rgba(P.ink, .1) : rgba(P.ink, .03)};display:flex;align-items:center;justify-content:center`, `<i style="width:${yo ? 54 : 26}px;height:${yo ? 54 : 26}px;border-radius:50%;background:${yo ? P.a : rgba(P.a, .45)}"></i>`);
      c.tl.from(e.firstChild, {scale: 0, duration: .3, ease: 'back.out(2)'}, .4 + (q + r) * .09); }
    const t = div(c, `left:${x0 + 3 * S0 - 10}px;top:${y0 + 3 * S0 - 46}px;width:120px;text-align:center`, '<span class="chip lleno" style="font-size:22px;padding:6px 16px">TÚ</span>'); c.tl.from(t, {opacity: 0, y: -20, duration: .4, ease: 'back.out(2)'}, 2.2); },
};
// ======================= DESBLOQUEASTE ESTA OFERTA =======================
const PORQ = {
  base: (c) => S.porque(c),
  sello: (c) => { // un sello "DESBLOQUEADA" cae sobre la tarjeta de la oferta
    texto(c, {x: 160, y: 80, w: 1600, c: 1, t: c.sc.t, size: 92, maxH: 220, at: .2});
    const t = div(c, `left:560px;top:420px;width:800px;height:440px;border-radius:24px;background:${CLARO() ? '#ffffff' : P.sup};box-shadow:0 30px 60px rgba(0,0,0,.16);display:flex;align-items:center;justify-content:center`, '');
    caja(c, 'pack', 600, 450, 360, 380); const sl = div(c, `left:960px;top:560px;padding:18px 34px;border:8px solid ${P.a};border-radius:14px;color:${P.a};font:900 54px var(--ft);letter-spacing:.06em;transform:rotate(-12deg)`, 'DESBLOQUEADA');
    c.tl.from(t, {y: 300, opacity: 0, duration: .7, ease: 'expo.out'}, .4); const at = Math.max(1.2, c.cue('desbloque', .55)); c.tl.from(sl, {scale: 3, opacity: 0, duration: .35, ease: 'power4.in'}, at); c.fx(at + .3, 'golpe'); },
  llave: (c) => { // una llave entra en la cerradura; la cerradura se enciende
    texto(c, {x: 160, y: 680, w: 1600, c: 1, t: c.sc.t, size: 92, maxH: 230, at: .3});
    const s = svg(c, `<g class="cr"><circle cx="1060" cy="350" r="170" fill="${rgba(P.a, .12)}" stroke="${P.a}" stroke-width="14"/><circle cx="1060" cy="325" r="34" fill="${P.ink}"/><path d="M1044 345h32l14 80h-60z" fill="${P.ink}"/></g><g class="ll"><circle cx="560" cy="350" r="62" fill="none" stroke="${P.c}" stroke-width="22"/><rect x="618" y="339" width="300" height="22" rx="8" fill="${P.c}"/><rect x="860" y="361" width="22" height="44" fill="${P.c}"/><rect x="810" y="361" width="22" height="32" fill="${P.c}"/></g>`);
    const at = Math.max(1.2, c.cue('desbloque', .55)); c.tl.from(s.querySelector('.ll'), {x: -500, opacity: 0, duration: .8, ease: 'expo.out'}, .3); c.tl.to(s.querySelector('.ll'), {x: 60, duration: .35, ease: 'power3.in'}, at - .4); c.fx(at - .05, 'click');
    c.tl.to(s.querySelector('.cr circle'), {fill: rgba(P.a, .45), duration: .3}, at); c.tl.fromTo(s.querySelector('.cr'), {scale: 1}, {scale: 1.08, svgOrigin: '1060 350', duration: .25, yoyo: true, repeat: 1}, at); },
  cofre: (c) => { // la tapa de una caja se levanta, sale luz y aparece el pack
    texto(c, {x: 160, y: 50, w: 1600, c: 1, t: c.sc.t, size: 88, maxH: 220, at: .2});
    const at = Math.max(1.2, c.cue('desbloque', .55));
    const luz = div(c, `left:560px;top:330px;width:800px;height:500px;background:radial-gradient(closest-side,${rgba(P.c, .6)},transparent 70%)`); c.tl.from(luz, {opacity: 0, scale: .3, duration: .8}, at);
    const cu = div(c, `left:660px;top:700px;width:600px;height:260px;border-radius:0 0 24px 24px;background:${P.a};box-shadow:0 30px 60px rgba(0,0,0,.25)`), ta = div(c, `left:640px;top:640px;width:640px;height:72px;border-radius:18px;background:${P.c}`);
    c.tl.from([cu, ta], {y: 200, opacity: 0, duration: .7, ease: 'expo.out'}, .3); c.tl.to(ta, {y: -330, rotation: -8, opacity: 0, duration: .6, ease: 'power2.out'}, at); c.fx(at, 'riser');
    const b = caja(c, 'pack', 735, 330, 450, 360); if (b) c.tl.from(b, {y: 300, opacity: 0, scale: .6, duration: .8, ease: 'back.out(1.5)'}, at + .15); },
};
// ======================= SOLO EN ESTA PÁGINA =======================
const EXCL = {
  base: (c) => S.exclusiva(c),
  pin: (c) => { // un marcador "estás aquí" sobre esta página; fuera de ella, la oferta no está
    texto(c, {x: 120, y: 120, w: 820, k: c.sc.k, t: c.sc.t, s: c.sc.s, size: 96, maxH: 260, at: .2});
    const pg = div(c, `left:1080px;top:200px;width:620px;height:720px;border-radius:24px;background:${CLARO() ? '#ffffff' : P.sup};box-shadow:0 30px 60px rgba(0,0,0,.16);border:3px solid ${P.a}`, `<div style="height:64px;border-bottom:2px solid ${rgba(P.ink, .1)}"></div>`);
    caja(c, 'pack', 1150, 300, 480, 420); const pr = div(c, `left:1080px;top:760px;width:620px;text-align:center`, `<span class="num oro" style="font-size:110px">${money(+PR.precio || 0)}</span>`);
    const pin = div(c, `left:1640px;top:110px`, `<svg width="120" height="160" viewBox="0 0 60 80"><path d="M30 2C14 2 4 14 4 28c0 20 26 48 26 48s26-28 26-48C56 14 46 2 30 2z" fill="${P.a}"/><circle cx="30" cy="28" r="10" fill="#fff"/></svg>`);
    c.tl.from(pg, {y: 200, opacity: 0, duration: .7, ease: 'expo.out'}, .3); c.tl.from(pr, {opacity: 0, duration: .5}, .9); c.tl.from(pin, {y: -200, opacity: 0, duration: .6, ease: 'bounce.out'}, 1.1); c.fx(1.5, 'pop');
    const lab = div(c, `left:1480px;top:280px;width:300px;text-align:center`, '<span class="chip lleno" style="font-size:22px">Solo aquí</span>'); c.tl.from(lab, {opacity: 0, x: 30, duration: .4}, 1.6); },
  foco: (c) => { // la frase bajo un foco de luz; alrededor todo se oscurece
    const f = div(c, `inset:0;background:radial-gradient(900px 520px at 50% 48%,transparent 0,${rgba('#000000', CLARO() ? .12 : .55)} 100%)`); c.tl.from(f, {opacity: 0, duration: 1}, .2);
    texto(c, {x: 160, y: 300, w: 1600, c: 1, k: c.sc.k, t: c.sc.t, s: c.sc.s, size: 120, maxH: 300, at: .3});
    const ch = div(c, `left:0;right:0;top:800px;text-align:center`, `<span class="chip lleno" style="font-size:30px;padding:14px 32px">${sobre(PAL)}Si sales de esta página, podrías no volver a verla</span>`); c.tl.from(ch, {opacity: 0, y: 30, duration: .6, ease: 'expo.out'}, Math.max(1.6, c.cue('sales', .6))); },
};
// ======================= GARANTÍA =======================
const GAR = {
  base: (c) => S.garantia(c),
  escudo: (c) => { // escudo con el 7
    const d = +PR.dias || 7, s = svg(c, `<path d="M520 160l300 90v230c0 190-130 300-300 380C350 780 220 670 220 480V250z" fill="${rgba(P.a, .14)}" stroke="${P.a}" stroke-width="12" stroke-linejoin="round" pathLength="1"/>`);
    draw(c.tl, s.querySelector('path'), .2, 1); const n = div(c, `left:220px;top:330px;width:600px;text-align:center`, `<div class="num oro" style="font-size:300px;line-height:.9">${d}</div><div class="K c" style="justify-content:center">días</div>`); c.tl.from(n, {scale: .4, opacity: 0, duration: .7, ease: 'back.out(1.7)'}, .8); c.fx(1, 'pop');
    texto(c, {x: 980, y: 320, w: 820, k: c.sc.k, t: c.sc.t, s: c.sc.s, size: 100, maxH: 240, at: .5}); },
  calendario: (c) => { // siete días que se marcan uno por uno
    const d = +PR.dias || 7; texto(c, {x: 160, y: 80, w: 1600, c: 1, k: c.sc.k, t: c.sc.t, s: c.sc.s, size: 96, maxH: 120, at: .2});
    for (let j = 0; j < d; j++) { const W = Math.min(210, 1600 / d), x = 960 - d * W / 2 + j * W, e = div(c, `left:${x + 10}px;top:520px;width:${W - 20}px;height:${W + 30}px;border-radius:16px;background:${CLARO() ? '#ffffff' : P.sup};box-shadow:0 18px 36px rgba(0,0,0,.12);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px`, `<span style="font:700 22px var(--fb);color:${P.mut};letter-spacing:.14em">DÍA</span><b style="font:800 70px var(--ft);color:${P.ink}">${j + 1}</b><i class="pl" style="font-style:normal;font:800 34px var(--fb);color:${P.a}">✓</i>`);
      const at = .8 + j * .22; c.tl.from(e, {y: 80, opacity: 0, duration: .4, ease: 'back.out(1.6)'}, at); c.tl.from(e.querySelector('.pl'), {scale: 0, duration: .3, ease: 'back.out(2)'}, at + .3); c.fx(at + .3, 'tick'); } },
  sello: (c) => { // sello redondo de garantía que gira y se estampa
    const d = +PR.dias || 7, s = svg(c, `<g class="se"><circle cx="560" cy="540" r="300" fill="none" stroke="${P.a}" stroke-width="10"/><circle cx="560" cy="540" r="250" fill="none" stroke="${P.a}" stroke-width="4" stroke-dasharray="6 12"/><text x="560" y="600" text-anchor="middle" font-family="${E.dirFt || 'Montserrat'}" font-weight="800" font-size="230" fill="${P.a}">${d}</text><text x="560" y="690" text-anchor="middle" font-family="Montserrat" font-weight="800" font-size="40" letter-spacing="10" fill="${P.ink}">DÍAS</text></g>`);
    c.tl.from(s.querySelector('.se'), {scale: 2.4, rotation: -60, opacity: 0, svgOrigin: '560 540', duration: .55, ease: 'power4.in'}, .4); c.fx(.95, 'golpe');
    texto(c, {x: 1000, y: 330, w: 820, k: c.sc.k, t: c.sc.t, s: c.sc.s, size: 100, maxH: 240, at: .7}); },
};

// ======================= LOS DISEÑOS =======================
// composición de cada escena por diseño: ninguna combinación se repite entre los 9 diseños
const DIS = {
  12: {fel: 'esfera', gra: 'arco', esc: 'reloj', tool: 'inclinada', rev: 'base', tod: 'base', pre: 'ticket', inv: 'frase', cta: 'tarjeta', mult: 'tablero', porq: 'sello', excl: 'base', gar: 'calendario'},
  13: {fel: 'dividido', gra: 'tabla', esc: 'grafica', tool: 'centro', rev: 'centro', tod: 'fila', pre: 'barras', inv: 'lado', cta: 'centro', mult: 'contador', porq: 'base', excl: 'pin', gar: 'escudo'},
  14: {fel: 'gis', gra: 'pizarra', esc: 'flechas', tool: 'tarjeta', rev: 'derecha', tod: 'anillo', pre: 'base', inv: 'frase', cta: 'base', mult: 'base', porq: 'llave', excl: 'foco', gar: 'sello'},
  15: {fel: 'marco', gra: 'galeria', esc: 'peldanos', tool: 'franja', rev: 'centro', tod: 'base', pre: 'ticket', inv: 'lado', cta: 'tarjeta', mult: 'contador', porq: 'cofre', excl: 'base', gar: 'sello'},
  16: {fel: 'resultado', gra: 'lista', esc: 'jugadas', tool: 'hoja', rev: 'base', tod: 'fila', pre: 'ticket', inv: 'frase', cta: 'centro', mult: 'tablero', porq: 'sello', excl: 'pin', gar: 'calendario'},
  17: {fel: 'rafaga', gra: 'cinta', esc: 'barra', tool: 'diagonal', rev: 'derecha', tod: 'anillo', pre: 'barras', inv: 'lado', cta: 'base', mult: 'base', porq: 'llave', excl: 'foco', gar: 'escudo'},
  18: {fel: 'pila', gra: 'diagonal', esc: 'diana', tool: 'foco', rev: 'centro', tod: 'anillo', pre: 'ticket', inv: 'frase', cta: 'tarjeta', mult: 'tablero', porq: 'cofre', excl: 'pin', gar: 'base'},
  19: {fel: 'formas', gra: 'mosaico', esc: 'torre', tool: 'bloque', rev: 'derecha', tod: 'fila', pre: 'barras', inv: 'lado', cta: 'centro', mult: 'contador', porq: 'base', excl: 'foco', gar: 'calendario'},
};
const BASE = ['generico', 'recorrido'];
Object.entries(DIS).forEach(([n, L]) => { n = +n; const f = (c) => FONDO[n](c), d = D[n] = {};
  d.felicita = (c) => { f(c); FEL[L.fel](c); }; d.gracias = (c) => { f(c); GRA[L.gra](c); }; d.escalera = (c) => { f(c); ESC[L.esc](c); };
  d.tool2 = (c) => { f(c); TOOL[L.tool](c); }; d.revela = (c) => { f(c); REV[L.rev](c); }; d.todas = (c) => { f(c); TOD[L.tod](c); };
  d.precio = (c) => { f(c); PRE[L.pre](c); }; d.inversion = (c) => { f(c); INV[L.inv](c); }; d.cta2 = (c) => { f(c); CTA[L.cta](c); };
  d.multitud = (c) => { f(c); MULT[L.mult](c); }; d.porque = (c) => { f(c); PORQ[L.porq](c); }; d.exclusiva = (c) => { f(c); EXCL[L.excl](c); }; d.garantia = (c) => { f(c); GAR[L.gar](c); };
  BASE.forEach((k) => { d[k] = (c) => { f(c); (S[k] || S.generico)(c); }; }); });
// Tablero (11): la inversión ya no promete "se paga con una partida" (el objetivo de Ajedrez no es ganar dinero)
if (D[11]) D[11].inversion = (c) => { X.fondo11(c); INV.frase(c); };

// estilos propios de cada diseño (solo se cargan para el diseño que se está grabando)
const CSS = {
  12: `.dir12 .vid{background:#fffaf0;border-color:${rgba(P.a, .25)};box-shadow:0 24px 50px rgba(60,40,20,.12)} .dir12 .chip:not(.lleno){background:rgba(255,255,255,.6)} .dir12 .gente svg{fill:rgba(0,0,0,.12)} .dir12 .gente svg.on{fill:${rgba(P.a, .6)}} .dir12 #top{opacity:.25}`,
  13: `.dir13 .vid{background:#fff;border:0;box-shadow:0 20px 44px rgba(20,33,61,.1);border-radius:20px} .dir13 .chip{border-radius:10px} .dir13 .chip:not(.lleno){background:#fff} .dir13 .gente svg{fill:rgba(20,33,61,.12)} .dir13 .gente svg.on{fill:${rgba(P.a, .7)}} .dir13 #top{opacity:.15} .dir13 .K{letter-spacing:.2em}`,
  14: `.dir14 .vid{background:rgba(255,255,255,.04);border:3px dashed rgba(255,255,255,.35);border-radius:14px;box-shadow:none} .dir14 .chip{border-style:dashed} .dir14 .T .k .wi{background:none;-webkit-text-fill-color:${P.a}} .dir14 .K{color:${P.c}}`,
  15: `.dir15 .vid{background:#fff;border:1.5px solid ${rgba(P.a, .5)};border-radius:2px;box-shadow:0 20px 40px rgba(0,0,0,.08)} .dir15 .chip{border-radius:2px} .dir15 .chip:not(.lleno){background:#fff} .dir15 .gente svg{fill:rgba(0,0,0,.12)} .dir15 .gente svg.on{fill:${rgba(P.a, .7)}} .dir15 #top{opacity:.18} .dir15 .T .k{font-style:italic}`,
  16: `.dir16 .vid{background:#fffdf6;border:2px solid ${rgba(P.b, .25)};border-radius:4px;box-shadow:0 14px 30px rgba(0,0,0,.08)} .dir16 .chip{border-radius:4px;font-family:JetBrains,monospace} .dir16 .chip:not(.lleno){background:#fff} .dir16 .num{font-family:JetBrains,monospace} .dir16 .gente svg{fill:rgba(31,58,107,.14)} .dir16 .gente svg.on{fill:${rgba(P.a, .7)}} .dir16 #top{opacity:.2}`,
  17: `.dir17 .T{text-transform:uppercase;font-style:italic} .dir17 .vid{border-radius:0;background:${P.sup};border:0;border-left:8px solid ${P.a};box-shadow:0 30px 60px rgba(0,0,0,.5)} .dir17 .chip{border-radius:0;transform:skewX(-10deg)} .dir17 .btn{border-radius:0}`,
  18: `.dir18 .vid{border-radius:0;clip-path:polygon(24px 0,100% 0,100% calc(100% - 24px),calc(100% - 24px) 100%,0 100%,0 24px)} .dir18 .chip{border-radius:8px}`,
  19: `.dir19 .vid{background:#fff;border:4px solid ${P.ink};border-radius:0;box-shadow:12px 12px 0 ${P.ink}} .dir19 .chip{border-radius:0;border:3px solid ${P.ink}} .dir19 .chip:not(.lleno){background:#fff;color:${P.ink}} .dir19 .btn{border-radius:0;box-shadow:8px 8px 0 ${P.ink}} .dir19 .gente svg{fill:rgba(0,0,0,.14)} .dir19 .gente svg.on{fill:${P.a}} .dir19 #top{opacity:.12}`,
};
if (CSS[E.dir]) { const st = document.createElement('style'); st.textContent = CSS[E.dir]; document.head.appendChild(st); }
if (DIS[E.dir]) document.documentElement.classList.add('nicho');
})();
