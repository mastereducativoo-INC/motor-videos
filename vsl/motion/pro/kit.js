// KIT DEL NICHO (Christian, 20 nov 2026): «no estoy viendo ningún video que tenga elementos, interfaz, fondo o animaciones
// relacionados con dibujo ni con mecánica… colores que no relaciono con el nicho, tipografías demasiado bruscas».
// Sobre cualquiera de los 9 diseños (la diagramación y la secuencia las pone el diseño) este archivo pone el NICHO:
//   · fondo propio y animado de cada diseño (9 fondos distintos por nicho), sin luces ni partículas genéricas
//   · elementos del nicho en cada escena (engranes, llaves, bujías… / lápices, gomas, reglas, pinceles…) que nunca tapan un texto
//   · animaciones del nicho (chispas, engranes que giran, aguja del tacómetro / trazos de lápiz que se dibujan, boceto que se colorea)
//   · transiciones del nicho (cortina de taller, banda de acero / página que se voltea, goma que borra)
//   · 9 paletas del nicho, letras del nicho (legibles, no bruscas) y la música la elige temas.kit_de (enérgica y del nicho)
// Se activa solo cuando el producto es de un nicho con kit (E.kit lo manda temas.py; si no, se detecta por el nombre del curso).
(() => {
const X = window.PRO; if (!X) return;
const {V, E, P, PR, IM, $, esc, rgba, norm, draw} = X;
const TX = norm([PR.nicho, PR.curso, PR.oferta].join(' '));
const NICHO = E.kit || (/mecanic|automotr|motocicl|\bmotos?\b/.test(TX) ? 'mecanica' : /dibuj|ilustrac|boceto|acuarel/.test(TX) ? 'dibujo' : '');
if (NICHO !== 'mecanica' && NICHO !== 'dibujo') return;
const ORDEN = [11, 4, 10, 3, 7, 5, 8, 6, 2], v = E.kitv != null ? +E.kitv : Math.max(0, ORDEN.indexOf(+E.dir));
let sd = 17 + v * 131 + (NICHO === 'dibujo' ? 7 : 0);
const r = () => { sd |= 0; sd = sd + 0x6D2B79F5 | 0; let t = Math.imul(sd ^ sd >>> 15, 1 | sd); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const MEC = NICHO === 'mecanica';

// ---------------- paletas (9 por nicho; ninguna con verde dominante) ----------------
const pal = (bg, sup, ink, mut, a, c, b, sobre, vig) => ({bg, sup, ink, mut, a, c, b, sobre, vig});
const PALS = {
  mecanica: [
    pal('#101114', '#1b1d22', '#f4f2ee', '#a3a7ad', '#ff6a13', '#ffae2b', '#3a3f47', '#111111', 'rgba(0,0,0,.75)'),   // Pista: asfalto y naranja de seguridad
    pal('#14110e', '#221c16', '#f5efe5', '#b9ab97', '#f2b01e', '#ffd659', '#5a4630', '#14110e', 'rgba(0,0,0,.7)'),     // Banco de trabajo: herramienta amarilla
    pal('#07090c', '#12161b', '#eef2f6', '#8f99a5', '#e3262e', '#ff5a4e', '#28303a', '#ffffff', 'rgba(0,0,0,.8)'),     // Tablero de instrumentos: rojo de tacómetro
    pal('#0a0f15', '#111a23', '#e9f1f8', '#8396a8', '#2f8cff', '#7cc4ff', '#1d2b3a', '#ffffff', 'rgba(0,0,0,.72)'),    // Escáner: azul de diagnóstico
    pal('#15171a', '#22252a', '#f3f4f5', '#a7adb4', '#e2531e', '#ff8a3d', '#4a4f57', '#ffffff', 'rgba(0,0,0,.7)'),     // Orden de servicio: acero y rojo óxido
    pal('#0c2744', '#12345a', '#eaf3ff', '#a7c1dd', '#ff8a1f', '#ffc24a', '#2a5a8a', '#0c2744', 'rgba(4,14,28,.7)'),    // Plano del motor: azul plano
    pal('#0b0b0d', '#18181c', '#f1f1f3', '#9b9ca3', '#d9d9de', '#ff3b30', '#3c3d44', '#0b0b0d', 'rgba(0,0,0,.8)'),     // Taller premium: fibra de carbono, cromo y rojo
    pal('#1e0a0c', '#2e1013', '#fff3ee', '#e2b4ab', '#ffc629', '#ffe08a', '#7a1c22', '#1e0a0c', 'rgba(10,0,2,.72)'),    // Caja de herramientas: rojo y amarillo
    pal('#0f0f10', '#1b1b1d', '#ffffff', '#a2a2a6', '#ffd400', '#ff7a00', '#38383c', '#111111', 'rgba(0,0,0,.75)'),     // Velocidad: amarillo bandera
  ],
  dibujo: [
    pal('#f3ede1', '#fffaf1', '#1f1c1a', '#6f685f', '#2747c9', '#e4572e', '#cfc5b2', '#ffffff', 'rgba(120,96,60,.28)'), // Mesa de dibujo: papel, grafito y ultramar
    pal('#1b1512', '#2a211b', '#f6efe4', '#c2b4a1', '#f2a03d', '#ffc86b', '#5c4532', '#1b1512', 'rgba(0,0,0,.7)'),      // Escritorio del artista: nogal y ocre
    pal('#161616', '#222222', '#f2eee7', '#a9a49b', '#e7e1d6', '#e0603a', '#3c3c3c', '#161616', 'rgba(0,0,0,.72)'),     // Carboncillo: carbón, tiza y sanguina
    pal('#1d1e23', '#2a2b31', '#f4f4f6', '#9b9da6', '#ff6b3d', '#ffb03a', '#3a3c44', '#ffffff', 'rgba(0,0,0,.62)'),     // App de dibujo: pincel coral
    pal('#f8f4eb', '#fffdf8', '#24211f', '#77726b', '#1f6feb', '#f2a900', '#d9d2c3', '#ffffff', 'rgba(110,90,60,.22)'), // Cuaderno de bocetos: tinta azul y marcatextos
    pal('#14213d', '#1d2d52', '#fdf6e3', '#b8c0d6', '#fca311', '#ffd166', '#2e4473', '#14213d', 'rgba(5,10,25,.7)'),    // Perspectiva: azul noche y ámbar
    pal('#1c1714', '#2a221d', '#f7f0e6', '#bcae9c', '#d6a54a', '#f0cf7d', '#4f3f33', '#1c1714', 'rgba(0,0,0,.72)'),     // Galería: muro cálido y marcos dorados
    pal('#1d1a2b', '#2a2540', '#f7f2ff', '#bdb3d6', '#ff7aa8', '#7cc3ff', '#3b3354', '#1d1a2b', 'rgba(0,0,0,.6)'),      // Acuarela: noche índigo con rosa y azul de acuarela
    pal('#0f1020', '#1a1b33', '#ffffff', '#a9abc9', '#ffbe0b', '#fb5607', '#3a2a8a', '#0f1020', 'rgba(0,0,10,.7)'),     // Tinta: noche y amarillo
  ],
};
// letras: legibles y del nicho (Christian: «tipografías demasiado bruscas»). Título, texto, números y etiquetas
const LETRAS = {
  mecanica: [{ft: 'BarlowC', fw: 800, fb: 'Archivo', fn: 'BarlowC', fk: 'Rajdhani', ls: '.005em'}, {ft: 'Oswald', fw: 600, fb: 'Archivo', fn: 'Oswald', fk: 'Rajdhani', ls: '.01em'}, {ft: 'BigShoulders', fw: 800, fb: 'Archivo', fn: 'BigShoulders', fk: 'Rajdhani', ls: '.01em'}],
  dibujo: [{ft: 'Fraunces', fw: 650, fb: 'DMSans', fn: 'Fraunces', fk: 'Caveat', ls: '-.015em'}, {ft: 'DMSerif', fw: 400, fb: 'DMSans', fn: 'DMSerif', fk: 'Kalam', ls: '-.01em'}, {ft: 'Instrument', fw: 400, fb: 'DMSans', fn: 'Fraunces', fk: 'Caveat', ls: '-.005em'}],
}[NICHO][v % 3];
const PL = PALS[NICHO][v];
Object.assign(P, PL);
Object.assign(E, {dirFt: LETRAS.ft, dirFw: LETRAS.fw, dirLs: LETRAS.ls, fb: LETRAS.fb});
// transiciones del nicho (cada diseño su propia mezcla)
E.trs = (MEC ? [['cortina', 'zoom', 'banda', 'lateral'], ['banda', 'sube', 'cortina', 'fundido'], ['zoom', 'cortina', 'lateral', 'banda'], ['cortina', 'barrido', 'banda', 'sube'], ['banda', 'fundido', 'cortina', 'zoom'], ['lateral', 'banda', 'sube', 'cortina'], ['cortina', 'zoom', 'fundido', 'banda'], ['banda', 'cortina', 'barrido', 'lateral'], ['zoom', 'banda', 'cortina', 'sube']]
  : [['pagina', 'fundido', 'borrador', 'sube'], ['borrador', 'lateral', 'pagina', 'zoom'], ['fundido', 'pagina', 'sube', 'borrador'], ['pagina', 'borrador', 'zoom', 'fundido'], ['borrador', 'sube', 'pagina', 'lateral'], ['pagina', 'zoom', 'borrador', 'barrido'], ['fundido', 'borrador', 'pagina', 'sube'], ['borrador', 'pagina', 'lateral', 'fundido'], ['sube', 'pagina', 'borrador', 'zoom']])[v];
if (X.PAPEL) Object.assign(X.PAPEL, MEC ? {bg: '#f2efe8', sup: '#e3ded2', ink: '#16181b', mut: '#5d636b', a: PL.a === '#d9d9de' ? '#c8361f' : PL.a, c: '#c8361f', b: '#b9b2a2', sobre: '#ffffff'}
  : {bg: '#fbf8f1', sup: '#efe8da', ink: '#1f1c1a', mut: '#6f685f', a: '#2747c9', c: '#e4572e', b: '#cfc5b2', sobre: '#ffffff'});

const TRAZO = (col) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 30' preserveAspectRatio='none'><path d='M4 19C60 9 120 25 180 14S270 9 296 15' fill='none' stroke='${col}' stroke-width='7' stroke-linecap='round'/><path d='M14 24C80 17 150 27 210 20S280 18 292 21' fill='none' stroke='${col}' stroke-width='3.5' stroke-linecap='round' opacity='.65'/></svg>`)}")`;
const R = document.documentElement.style;
Object.entries({bg: P.bg, a: P.a, b: P.b, c: P.c, sup: P.sup, ink: P.ink, mut: P.mut, sobre: P.sobre, aB: rgba(P.a, .5), aS: rgba(P.a, .32), halo: rgba(P.a, .2), luz: rgba(P.b, .3), luz2: rgba(P.a, .08),
  mutB: rgba(P.mut, .3), inkB: rgba(P.ink, .42), ft: LETRAS.ft, fb: LETRAS.fb, fw: LETRAS.fw, ls: LETRAS.ls, fn: LETRAS.fn, fk: LETRAS.fk, vig: PL.vig, trazo: TRAZO(P.c), goma: MEC ? '#ffb020' : '#f29bb0', kst: 'normal'})
  .forEach(([k, val]) => R.setProperty('--' + k, val));
document.body.classList.add('kit', 'kit-' + NICHO, 'kitv' + v);
X.precarga.push(() => Promise.all([LETRAS.ft, LETRAS.fb, LETRAS.fn, LETRAS.fk].flatMap((f) => [400, 600, 700, 800].map((w) => document.fonts.load(`${w} 60px ${f}`).catch(() => null)))));
X.KIT = {nicho: NICHO, v};  // X.KIT.icono: el emblema del nicho (engrane / paleta) en lugar de repetir el logo

// ---------------- dibujos del nicho (SVG) ----------------
const svg = (w, h, inner, st = '', vb) => `<svg width="${w}" height="${h}" viewBox="${vb || `0 0 ${w} ${h}`}" style="overflow:visible;${st}">${inner}</svg>`;
const engranePath = (R0, n) => { const ri = R0 * .8, w = Math.PI / n; let d = '';
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, p = [[ri, a - w * .55], [R0, a - w * .32], [R0, a + w * .32], [ri, a + w * .55]];
    p.forEach(([rr, aa], j) => { d += (i === 0 && j === 0 ? 'M' : 'L') + (rr * Math.cos(aa)).toFixed(1) + ' ' + (rr * Math.sin(aa)).toFixed(1); }); }
  const h = R0 * .32; return d + 'Z' + `M${h} 0A${h} ${h} 0 1 0 ${-h} 0A${h} ${h} 0 1 0 ${h} 0Z`; };
const ICO = {
  engrane: (s, col, o = .9, n = 12) => svg(s, s, `<g transform="translate(${s / 2} ${s / 2})"><path class="gira" d="${engranePath(s / 2, n)}" fill="${col}" fill-rule="evenodd" opacity="${o}"/></g>`),
  llave: (s, col) => svg(s, s * .3, `<g fill="${col}"><rect x="34" y="22" width="132" height="16" rx="7"/><path fill-rule="evenodd" d="M28 6a24 24 0 1 0 .1 0ZM2 23H30V37H2Z"/><path fill-rule="evenodd" d="M174 7a23 23 0 1 0 .1 0ZM174 18a12 12 0 1 0 .1 0Z"/></g><rect x="56" y="27" width="88" height="6" rx="3" fill="${rgba('#000000', .18)}"/>`, '', '0 0 200 60'),
  tuerca: (s, col) => svg(s, s, `<path d="M50 4l40 23v46L50 96 10 73V27z" fill="${col}"/><circle cx="50" cy="50" r="19" fill="${P.bg}"/><circle cx="50" cy="50" r="19" fill="none" stroke="${rgba(P.ink, .25)}" stroke-width="3"/>`, '', '0 0 100 100'),
  bujia: (s, col) => svg(s * .36, s, `<rect x="14" y="0" width="22" height="40" rx="4" fill="${rgba(P.ink, .9)}"/><rect x="6" y="40" width="38" height="34" rx="3" fill="${col}"/><path d="M6 46h38M6 54h38M6 62h38" stroke="${rgba('#000000', .35)}" stroke-width="3"/><rect x="12" y="74" width="26" height="40" fill="#c9ccd1"/><path d="M12 82h26M12 92h26M12 102h26" stroke="#8b9097" stroke-width="3"/><path d="M25 114v14h10" fill="none" stroke="#c9ccd1" stroke-width="4"/>`, '', '0 0 50 140'),
  piston: (s, col) => svg(s * .7, s, `<rect x="6" y="0" width="88" height="56" rx="8" fill="${col}"/><path d="M6 12h88M6 22h88" stroke="${rgba('#000000', .35)}" stroke-width="4"/><rect x="38" y="50" width="24" height="70" rx="6" fill="#c9ccd1"/><circle cx="50" cy="128" r="16" fill="none" stroke="#c9ccd1" stroke-width="10"/>`, '', '0 0 100 150'),
  llanta: (s, col) => svg(s, s, `<circle cx="50" cy="50" r="46" fill="#151618"/><circle cx="50" cy="50" r="46" fill="none" stroke="#2a2c30" stroke-width="8" stroke-dasharray="6 5"/><circle cx="50" cy="50" r="28" fill="${col}"/><g class="gira" style="transform-origin:50px 50px">${[0, 72, 144, 216, 288].map((a) => `<rect x="47" y="25" width="6" height="22" rx="3" fill="${rgba('#000000', .45)}" transform="rotate(${a} 50 50)"/>`).join('')}</g><circle cx="50" cy="50" r="7" fill="#151618"/>`, '', '0 0 100 100'),
  lapiz: (s, col) => svg(s, s * .14, `<path d="M18 2h150v24H18z" fill="${col}"/><path d="M18 10h150M18 18h150" stroke="${rgba('#000000', .14)}" stroke-width="2"/><path d="M168 2l26 12-26 12z" fill="#e9c9a0"/><path d="M186 10l8 4-8 4z" fill="#2b2b2b"/><rect x="4" y="1" width="16" height="26" rx="2" fill="#b9bdc3"/><path d="M4 1h-2a4 4 0 0 0 0 26h2z" fill="#f29bb0"/>`, '', '0 0 200 28'),
  goma: (s, col) => svg(s, s * .5, `<rect x="2" y="2" width="96" height="46" rx="10" fill="#f6d3db"/><rect x="2" y="2" width="44" height="46" rx="10" fill="${col}"/><rect x="36" y="2" width="12" height="46" fill="${col}"/>`, '', '0 0 100 50'),
  regla: (s, col) => svg(s, s * .16, `<rect x="0" y="0" width="300" height="48" rx="4" fill="${col}" opacity=".92"/>${Array.from({length: 29}, (_, j) => `<path d="M${10 + j * 10} 0v${j % 5 ? 12 : 22}" stroke="${rgba('#000000', .5)}" stroke-width="2"/>`).join('')}`, '', '0 0 300 48'),
  pincel: (s, col) => svg(s, s * .12, `<path d="M0 10h120l10-4v16l-10-4H0z" fill="#3b2b22"/><rect x="128" y="3" width="30" height="22" rx="3" fill="#c9ccd1"/><path d="M158 4c24 0 40 6 46 10-6 4-22 10-46 10z" fill="${col}"/>`, '', '0 0 210 28'),
  paleta: (s, col) => svg(s, s * .8, `<path d="M60 4C24 4 2 28 2 52s20 44 52 44c12 0 14-10 8-18s0-16 12-16h12c14 0 22-8 22-22C108 20 90 4 60 4z" fill="#e8d5b5"/><circle cx="74" cy="64" r="9" fill="${P.bg}"/>${[[30, 30, P.a], [56, 20, P.c], [84, 30, '#f2c14e'], [26, 58, '#e85d75'], [44, 78, '#3a86ff']].map(([x, y, cc]) => `<circle cx="${x}" cy="${y}" r="9" fill="${cc}"/>`).join('')}`, '', '0 0 110 100'),
  sacapuntas: (s, col) => svg(s * .7, s * .5, `<rect x="2" y="6" width="60" height="38" rx="6" fill="${col}"/><path d="M14 18l26 7-26 7z" fill="#2b2b2b"/><rect x="40" y="10" width="18" height="30" rx="3" fill="#c9ccd1"/>`, '', '0 0 64 50'),
};
X.KIT.icono = (h, col) => MEC ? ICO.engrane(h, col, 1, 12) : ICO.paleta(h, col);
const PROPS = MEC ? ['engrane', 'llave', 'tuerca', 'bujia', 'piston', 'llanta'] : ['lapiz', 'goma', 'regla', 'pincel', 'paleta', 'sacapuntas'];
const colProp = (k, j) => (MEC ? {engrane: rgba(P.a, .9), llave: '#c9ccd1', tuerca: '#9aa1a9', bujia: P.a, piston: '#b8bdc4', llanta: '#9aa1a9'}[k]
  : {lapiz: ['#f2c14e', P.a, P.c, '#e85d75'][j % 4], goma: P.a, regla: '#f2d6a2', pincel: P.c, paleta: P.a, sacapuntas: P.c}[k]);

// ---------------- FONDOS (9 por nicho) ----------------
// cada fondo devuelve una función upd(t) que lo mueve con el tiempo del video (nada estático)
const capa = (L, html, st = '') => { const e = $(`<div style="position:absolute;${st}">${html}</div>`); L.appendChild(e); return e; };
const textura = {
  rombo: (c1, c2) => `repeating-linear-gradient(45deg,${c1} 0 6px,transparent 6px 26px),repeating-linear-gradient(-45deg,${c1} 0 6px,transparent 6px 26px),linear-gradient(180deg,${c2},${c2})`,
  carbono: () => `repeating-linear-gradient(45deg,rgba(255,255,255,.035) 0 8px,rgba(0,0,0,.25) 8px 16px),repeating-linear-gradient(-45deg,rgba(255,255,255,.03) 0 8px,rgba(0,0,0,.2) 8px 16px)`,
  tablero: (c1) => `radial-gradient(circle at 50% 50%,${c1} 0 5px,transparent 6px)`,
  plano: (c1, c2) => `linear-gradient(${c1} 1px,transparent 1px),linear-gradient(90deg,${c1} 1px,transparent 1px),linear-gradient(${c2} 2px,transparent 2px),linear-gradient(90deg,${c2} 2px,transparent 2px)`,
  madera: () => `repeating-linear-gradient(91deg,rgba(0,0,0,0) 0 22px,rgba(0,0,0,.16) 22px 24px,rgba(0,0,0,0) 24px 58px),repeating-linear-gradient(89deg,rgba(255,255,255,.03) 0 3px,transparent 3px 9px)`,
  rayas: (c1) => `repeating-linear-gradient(0deg,transparent 0 47px,${c1} 47px 49px)`,
};
const grano = (L, o = .5, f = .8) => capa(L, `<svg width="1920" height="1080"><filter id="kgr${v}"><feTurbulence type="fractalNoise" baseFrequency="${f}" numOctaves="3" seed="${v + 3}"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .38  0 0 0 .55 0"/></filter><rect width="1920" height="1080" filter="url(#kgr${v})"/></svg>`, `inset:0;opacity:${o};mix-blend-mode:multiply`);
const engranes = (L, lista) => { const gs = lista.map(([x, y, s, n, col, o, vel]) => ({e: capa(L, ICO.engrane(s, col, o, n), `left:${x - s / 2}px;top:${y - s / 2}px`), vel}));
  return (t) => gs.forEach((g) => { g.e.firstChild.querySelector('.gira').style.transform = `rotate(${t * g.vel}deg)`; }); };
const lineaQueSeDibuja = (L, d, col, sw, per, des = 0, st = '') => { const e = capa(L, `<svg width="1920" height="1080" style="overflow:visible"><path d="${d}" fill="none" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/></svg>`, 'inset:0;' + st), p = e.querySelector('path');
  return (t) => { const f = ((t + des) % per) / per, d0 = f < .55 ? 1 - f / .55 : f < .8 ? 0 : -(f - .8) / .2; p.style.strokeDashoffset = d0; }; };
const ups = [];
const FONDOS = {
  mecanica: [
    (L) => { // 0 Pista: muro del taller con lámparas colgantes, llantas apiladas y engranes
      L.style.background = `linear-gradient(180deg,#1a1c20 0%,${P.bg} 58%,#08090a 100%)`;
      capa(L, '', `inset:0;background:${textura.rayas('rgba(255,255,255,.035)')}`);
      const lamps = [360, 960, 1560].map((x, j) => capa(L, `<div style="position:absolute;left:-22px;top:0;width:44px;height:28px;border-radius:0 0 22px 22px;background:#2b2f35;box-shadow:0 6px 30px ${rgba(P.c, .6)}"></div><div style="position:absolute;left:-380px;top:24px;width:760px;height:900px;background:linear-gradient(180deg,${rgba(P.c, .2)},transparent 75%);clip-path:polygon(46% 0,54% 0,100% 100%,0 100%);filter:blur(6px)"></div>`, `left:${x}px;top:-6px`));
      [[40, 980, 1], [40, 870, 1], [160, 980, 1]].forEach(([x, y]) => capa(L, ICO.llanta(150, '#3a3f47'), `left:${x}px;top:${y - 150}px;opacity:.55`));
      const g = engranes(L, [[1760, 210, 300, 14, rgba(P.a, .16), 1, 9], [1580, 330, 190, 10, rgba(P.ink, .08), 1, -14]]);
      return (t) => { g(t); lamps.forEach((l, j) => { l.style.opacity = .82 + .18 * Math.sin(t * 2.3 + j * 2) * Math.sin(t * .7 + j); }); };
    },
    (L) => { // 1 Banco de trabajo: tablero perforado con herramientas colgadas
      L.style.background = `${textura.tablero('rgba(0,0,0,.45)')} 0 0/34px 34px,linear-gradient(180deg,#3b2f22,#241b13)`;
      capa(L, '', `inset:0;background:radial-gradient(900px 600px at 30% 20%,${rgba(P.c, .18)},transparent 70%)`);
      const h = [[ICO.llave(300, '#b8bdc4'), 150, 120, -78], [ICO.llave(240, '#9aa1a9'), 300, 140, -96], [ICO.bujia(190, P.a), 1640, 110, 8], [ICO.engrane(220, rgba(P.a, .65), 1, 10), 1560, 640, 0], [ICO.llave(280, '#b8bdc4'), 1780, 560, -82], [ICO.tuerca(110, '#9aa1a9'), 90, 760, 0]]
        .map(([html, x, y, rot]) => capa(L, html, `left:${x}px;top:${y}px;transform:rotate(${rot}deg);transform-origin:50% 0;opacity:.62;filter:drop-shadow(10px 14px 6px rgba(0,0,0,.45))`));
      return (t) => h.forEach((e, j) => { const base = [-78, -96, 8, 0, -82, 0][j]; e.style.transform = `rotate(${base + Math.sin(t * .9 + j) * 2.2}deg)`; });
    },
    (L) => { // 2 Tablero de instrumentos: velocímetro y tacómetro enormes con agujas vivas
      L.style.background = `radial-gradient(1400px 800px at 50% 110%,#1a1d22,${P.bg} 70%)`;
      const dial = (cx, cy, rr, max, lbl) => { const tk = Array.from({length: 41}, (_, j) => { const a = (-225 + j * 6.75) * Math.PI / 180, l = j % 5 ? 22 : 46; return `<path d="M${cx + Math.cos(a) * rr} ${cy + Math.sin(a) * rr}L${cx + Math.cos(a) * (rr - l)} ${cy + Math.sin(a) * (rr - l)}" stroke="${j > 32 ? P.a : rgba(P.ink, .5)}" stroke-width="${j % 5 ? 4 : 8}"/>`; }).join('');
        const nums = Array.from({length: 9}, (_, j) => { const a = (-225 + j * 33.75) * Math.PI / 180; return `<text x="${cx + Math.cos(a) * (rr - 92)}" y="${cy + Math.sin(a) * (rr - 92) + 18}" text-anchor="middle" font-family="BarlowC" font-weight="700" font-size="52" fill="${rgba(P.ink, .55)}">${Math.round(max / 8 * j)}</text>`; }).join('');
        const e = capa(L, `<svg width="1920" height="1080"><circle cx="${cx}" cy="${cy}" r="${rr + 26}" fill="none" stroke="${rgba(P.a, .35)}" stroke-width="6"/><circle cx="${cx}" cy="${cy}" r="${rr + 10}" fill="${rgba('#000000', .35)}"/>${tk}${nums}<text x="${cx}" y="${cy + rr * .45}" text-anchor="middle" font-family="Rajdhani" font-weight="700" font-size="40" letter-spacing="8" fill="${rgba(P.ink, .4)}">${lbl}</text><g class="ag"><path d="M${cx - 8} ${cy}L${cx} ${cy - rr + 40}L${cx + 8} ${cy}Z" fill="${P.a}"/><circle cx="${cx}" cy="${cy}" r="30" fill="#22262c" stroke="${P.a}" stroke-width="5"/></g></svg>`, 'inset:0;opacity:.34');
        return e.querySelector('.ag'); };
      const a1 = dial(330, 640, 420, 240, 'KM/H'), a2 = dial(1590, 640, 420, 8, 'RPM ×1000');
      return (t) => { a1.setAttribute('transform', `rotate(${-135 + 150 + Math.sin(t * .6) * 60 + Math.sin(t * 2.1) * 6} 330 640)`); a2.setAttribute('transform', `rotate(${-135 + 120 + Math.sin(t * .9 + 1) * 80 + Math.sin(t * 5) * 4} 1590 640)`); };
    },
    (L) => { // 3 Escáner: silueta del auto en malla, anillos de diagnóstico y línea de escaneo
      L.style.background = `radial-gradient(1200px 700px at 50% 55%,#13202d,${P.bg} 72%)`;
      capa(L, '', `inset:0;background:${textura.plano(rgba(P.a, .06), rgba(P.a, .0))};background-size:48px 48px`);
      const auto = 'M180 760C200 700 260 680 360 670L560 560C640 520 760 500 920 500C1080 500 1200 520 1300 580L1440 660C1560 670 1660 690 1720 730L1740 780L1700 820H1560A120 120 0 0 0 1320 820H660A120 120 0 0 0 420 820H220Z M600 590L700 540H900V650H560Z M960 540H1140C1200 545 1250 570 1300 650H960Z';
      const d1 = lineaQueSeDibuja(L, auto, rgba(P.a, .5), 4, 9), w1 = capa(L, ICO.llanta(250, rgba(P.a, .25)), 'left:415px;top:695px;opacity:.5'), w2 = capa(L, ICO.llanta(250, rgba(P.a, .25)), 'left:1315px;top:695px;opacity:.5');
      const sc = capa(L, '', `left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,transparent,${P.c},transparent);box-shadow:0 0 30px ${P.c}`);
      const an = capa(L, `<svg width="900" height="900"><circle cx="450" cy="450" r="430" fill="none" stroke="${rgba(P.a, .18)}" stroke-width="2" stroke-dasharray="4 14"/><circle cx="450" cy="450" r="330" fill="none" stroke="${rgba(P.a, .14)}" stroke-width="2"/><path d="M450 20A430 430 0 0 1 880 450" fill="none" stroke="${rgba(P.c, .45)}" stroke-width="5"/></svg>`, 'left:510px;top:90px');
      return (t) => { d1(t); sc.style.transform = `translateY(${(t * 160) % 1080}px)`; an.style.transform = `rotate(${t * 12}deg)`; [w1, w2].forEach((w) => { w.querySelector('.gira').style.transform = `rotate(${t * 40}deg)`; }); };
    },
    (L) => { // 4 Orden de servicio: placa de acero antiderrapante con remaches y reflejo que corre
      L.style.background = textura.rombo('rgba(255,255,255,.045)', P.bg); L.style.backgroundSize = '52px 52px,52px 52px,auto';
      capa(L, Array.from({length: 26}, (_, j) => `<i style="position:absolute;left:${j < 13 ? 40 + j * 150 : 40 + (j - 13) * 150}px;top:${j < 13 ? 30 : 1032}px;width:18px;height:18px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#d7dbe0,#5c6168)"></i>`).join(''), 'inset:0');
      const br = capa(L, '', 'left:-600px;top:-200px;width:500px;height:1500px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.07),transparent);transform:rotate(18deg)');
      const g = engranes(L, [[110, 930, 240, 12, rgba(P.a, .22), 1, 10], [1830, 160, 200, 10, rgba(P.ink, .1), 1, -12]]);
      return (t) => { g(t); br.style.left = (((t * 260) % 3200) - 700) + 'px'; };
    },
    (L) => { // 5 Plano del motor: cuadrícula de plano y un pistón con biela que se dibuja con cotas
      L.style.background = `${textura.plano('rgba(255,255,255,.07)', 'rgba(255,255,255,.12)')},${P.bg}`; L.style.backgroundSize = '40px 40px,40px 40px,200px 200px,200px 200px,auto';
      const c = 'rgba(234,243,255,.55)', x0 = 1380, y0 = 160;
      const pist = `M${x0} ${y0}h300v190h-300zM${x0} ${y0 + 40}h300M${x0} ${y0 + 70}h300M${x0 + 150} ${y0 + 190}l-60 360M${x0 + 150} ${y0 + 190}l60 360M${x0 + 90} ${y0 + 550}a80 80 0 1 0 120 0`;
      const cig = `M60 900h500M60 880v40M560 880v40M${x0 - 60} ${y0}v190M${x0 - 80} ${y0}h40M${x0 - 80} ${y0 + 190}h40`;
      const d1 = lineaQueSeDibuja(L, pist, c, 4, 10), d2 = lineaQueSeDibuja(L, cig, rgba(P.a, .7), 3, 10, 3);
      const g = engranes(L, [[300, 300, 360, 18, 'rgba(234,243,255,.10)', 1, 6]]);
      capa(L, `<div style="font:700 26px Rajdhani,sans-serif;letter-spacing:.3em;color:rgba(234,243,255,.4)">PLANO N.º ${(PR.precio || 12) * 7 + 101} · ESC. 1:2</div>`, 'left:70px;top:960px');
      return (t) => { d1(t); d2(t); g(t); };
    },
    (L) => { // 6 Taller premium: fibra de carbono, haces de luz y un rin que gira
      L.style.background = `${textura.carbono()},${P.bg}`;
      const hz = [[-200, 0, 14], [1300, 0, -16]].map(([x, y, rt]) => capa(L, '', `left:${x}px;top:-200px;width:620px;height:1600px;background:linear-gradient(180deg,${rgba('#ffffff', .1)},transparent 70%);transform:rotate(${rt}deg);filter:blur(10px)`));
      const rin = capa(L, svg(900, 900, `<circle cx="450" cy="450" r="440" fill="none" stroke="${rgba('#ffffff', .07)}" stroke-width="60"/><circle cx="450" cy="450" r="380" fill="none" stroke="${rgba(P.c, .25)}" stroke-width="6"/><g class="gira" style="transform-origin:450px 450px">${Array.from({length: 10}, (_, j) => `<path d="M450 450L${450 + Math.cos(j * Math.PI / 5) * 360} ${450 + Math.sin(j * Math.PI / 5) * 360}" stroke="${rgba('#ffffff', .09)}" stroke-width="${j % 2 ? 26 : 12}"/>`).join('')}</g><circle cx="450" cy="450" r="70" fill="${rgba('#ffffff', .08)}"/>`), 'left:1300px;top:420px;opacity:.9');
      return (t) => { rin.querySelector('.gira').style.transform = `rotate(${t * 18}deg)`; hz.forEach((h, j) => { h.style.opacity = .7 + .3 * Math.sin(t * .8 + j * 2); }); };
    },
    (L) => { // 7 Caja de herramientas: cajones rojos con jaladeras cromadas
      L.style.background = P.bg;
      const filas = [80, 260, 440, 620, 800, 980]; capa(L, filas.map((y, j) => `<div style="position:absolute;left:-40px;right:-40px;top:${y}px;height:160px;border-radius:10px;background:linear-gradient(180deg,#7d1c22,#5c1217);box-shadow:inset 0 3px 0 rgba(255,255,255,.12),0 10px 18px rgba(0,0,0,.45)"><i style="position:absolute;left:50%;margin-left:-180px;top:56px;width:360px;height:22px;border-radius:12px;background:linear-gradient(180deg,#eef0f3,#9aa0a7)"></i></div>`).join(''), 'inset:0;opacity:.75');
      capa(L, '', `inset:0;background:linear-gradient(90deg,${rgba(P.bg, .85)} 0%,transparent 22%,transparent 78%,${rgba(P.bg, .85)} 100%)`);
      const g = engranes(L, [[1780, 920, 260, 12, rgba(P.a, .2), 1, 8], [150, 160, 200, 10, rgba(P.a, .16), 1, -10]]);
      return (t) => g(t);
    },
    (L) => { // 8 Velocidad: rayas de velocidad, bandera a cuadros y marcas de llanta
      L.style.background = `radial-gradient(1200px 700px at 70% 40%,#1f1f22,${P.bg} 70%)`;
      const ray = Array.from({length: 26}, () => capa(L, '', `left:0;top:${r() * 1080}px;width:${200 + r() * 600}px;height:${2 + r() * 4}px;border-radius:4px;background:linear-gradient(90deg,transparent,${rgba(r() > .5 ? P.a : P.ink, .25)})`));
      const vel = ray.map(() => 900 + r() * 1400), x0 = ray.map(() => r() * 2400);
      capa(L, '', `left:-100px;right:-100px;bottom:-40px;height:150px;background:conic-gradient(#ffffff 25%,#111 0 50%,#ffffff 0 75%,#111 0) 0 0/60px 60px;opacity:.16;transform:skewY(-4deg)`);
      lineaQueSeDibuja(L, 'M-50 520C400 500 700 560 1100 540S1700 480 2000 500', rgba('#000000', .55), 34, 30);
      return (t) => ray.forEach((e, j) => { e.style.transform = `translateX(${2200 - ((x0[j] + t * vel[j]) % 2600)}px)`; });
    },
  ],
  dibujo: [
    (L) => { // 0 Mesa de dibujo: papel con cuadrícula y un estudio de cubo y esfera que se dibuja
      L.style.background = `linear-gradient(${rgba(P.a, .07)} 1px,transparent 1px) 0 0/44px 44px,linear-gradient(90deg,${rgba(P.a, .07)} 1px,transparent 1px) 0 0/44px 44px,${P.bg}`;
      grano(L, .35);
      const cubo = 'M1500 260L1700 200L1840 290L1640 350ZM1500 260V500L1640 590V350M1840 290V530L1640 590';
      const esf = 'M1400 760m-150 0a150 150 0 1 0 300 0a150 150 0 1 0 -300 0M1250 760a150 50 0 0 0 300 0';
      const d1 = lineaQueSeDibuja(L, cubo, rgba(P.ink, .38), 4, 11), d2 = lineaQueSeDibuja(L, esf, rgba(P.ink, .3), 3.5, 11, 4);
      const h = capa(L, svg(400, 260, Array.from({length: 18}, (_, j) => `<path d="M${j * 22} 260L${j * 22 + 120} 0" stroke="${rgba(P.ink, .14)}" stroke-width="3"/>`).join('')), 'left:1290px;top:610px;opacity:.7');
      const lap = capa(L, ICO.lapiz(380, '#f2c14e'), 'left:60px;top:900px;transform:rotate(-14deg);filter:drop-shadow(8px 12px 6px rgba(0,0,0,.18))');
      return (t) => { d1(t); d2(t); lap.style.transform = `rotate(${-14 + Math.sin(t * .6) * 2}deg) translateX(${Math.sin(t * .4) * 18}px)`; };
    },
    (L) => { // 1 Escritorio del artista: madera de nogal con lápices, goma y virutas
      L.style.background = `${textura.madera()},linear-gradient(180deg,#3a2a1f,#22180f)`;
      capa(L, '', `inset:0;background:radial-gradient(1000px 650px at 25% 15%,${rgba(P.c, .2)},transparent 70%)`);
      const cosas = [[ICO.lapiz(420, '#f2c14e'), 40, 980, -8], [ICO.lapiz(360, P.a), 1500, 70, 168], [ICO.lapiz(380, '#e85d75'), 1520, 990, 176], [ICO.goma(150, P.a), 90, 80, 12], [ICO.sacapuntas(140, P.c), 1780, 520, -20], [ICO.regla(520, '#f2d6a2'), -120, 520, 84]]
        .map(([html, x, y, rot]) => capa(L, html, `left:${x}px;top:${y}px;transform:rotate(${rot}deg);opacity:.85;filter:drop-shadow(10px 14px 8px rgba(0,0,0,.45))`));
      capa(L, Array.from({length: 14}, () => `<i style="position:absolute;left:${1600 + r() * 260}px;top:${560 + r() * 160}px;width:${10 + r() * 16}px;height:${6 + r() * 8}px;border-radius:50% 40%;background:${r() > .5 ? '#e9c9a0' : P.c};transform:rotate(${r() * 180}deg)"></i>`).join(''), 'inset:0;opacity:.8');
      return (t) => cosas.forEach((e, j) => { e.style.translate = `${Math.sin(t * .5 + j) * 6}px ${Math.cos(t * .4 + j) * 4}px`; });
    },
    (L) => { // 2 Carboncillo: papel oscuro con manchas de carbón y trazos de tiza que se dibujan solos
      L.style.background = P.bg; grano(L, .55, .65);
      capa(L, [[300, 250, 520], [1500, 820, 600], [1650, 200, 380]].map(([x, y, s]) => `<i style="position:absolute;left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(closest-side,rgba(0,0,0,.6),transparent)"></i>`).join(''), 'inset:0');
      capa(L, svg(520, 340, Array.from({length: 30}, (_, j) => `<path d="M${j * 17} 340L${j * 17 + 170} 0" stroke="${rgba(P.a, .16)}" stroke-width="4"/>`).join('')), 'left:-40px;top:760px');
      capa(L, svg(420, 300, Array.from({length: 22}, (_, j) => `<path d="M0 ${j * 14}L420 ${j * 14 - 120}" stroke="${rgba(P.a, .12)}" stroke-width="3"/>`).join('')), 'left:1560px;top:420px');
      const ups2 = [lineaQueSeDibuja(L, 'M80 180C300 120 420 260 620 200S900 120 1000 170', rgba(P.a, .38), 10, 12), lineaQueSeDibuja(L, 'M1180 950C1350 860 1500 990 1700 900S1880 860 1900 880', rgba(P.c, .5), 14, 12, 5),
        lineaQueSeDibuja(L, 'M1580 140c60 20 90 80 60 140s-120 70-160 20-20-130 40-150c40-10 90 0 120 30', rgba(P.a, .35), 7, 14, 8),
        lineaQueSeDibuja(L, 'M300 760c-40-120 40-260 180-260s200 120 160 240-160 160-240 120', rgba(P.a, .22), 6, 16, 2)];
      return (t) => ups2.forEach((f) => f(t));
    },
    (L) => { // 3 App de dibujo: lienzo digital con muestras de color y trazos de pincel
      L.style.background = `radial-gradient(1200px 800px at 50% 40%,#26272d,${P.bg} 75%)`;
      capa(L, `<svg width="1920" height="1080">${Array.from({length: 7}, (_, j) => `<circle cx="${1820}" cy="${180 + j * 110}" r="34" fill="${[P.a, P.c, '#f2c14e', '#e85d75', '#3a86ff', '#8b6cff', '#ffffff'][j]}" opacity=".55"/>`).join('')}<rect x="40" y="160" width="84" height="760" rx="20" fill="rgba(255,255,255,.05)"/>${['M62 210l40 40M62 250l40-40', 'M60 330h44v44H60z', 'M82 430a22 22 0 1 0 .1 0'].map((d) => `<path d="${d}" stroke="${rgba(P.ink, .4)}" stroke-width="5" fill="none"/>`).join('')}</svg>`, 'inset:0');
      const a = lineaQueSeDibuja(L, 'M260 900C500 760 700 980 980 860S1400 700 1700 820', rgba(P.a, .35), 26, 10), b = lineaQueSeDibuja(L, 'M300 160C520 240 760 120 980 200S1400 260 1620 180', rgba(P.c, .25), 18, 12, 4);
      return (t) => { a(t); b(t); };
    },
    (L) => { // 4 Cuaderno de bocetos: hoja rayada con espiral y dibujitos en el margen
      L.style.background = `${textura.rayas(rgba(P.a, .13))},${P.bg}`;
      capa(L, '', `left:150px;top:0;bottom:0;width:3px;background:${rgba('#e85d75', .45)}`);
      capa(L, Array.from({length: 22}, (_, j) => `<i style="position:absolute;left:${60 + j * 86}px;top:-14px;width:30px;height:62px;border-radius:15px;border:6px solid #8d939b;border-bottom-color:transparent"></i>`).join(''), 'inset:0');
      grano(L, .3);
      const ds = [lineaQueSeDibuja(L, 'M60 300l14 30 32 4-24 22 6 32-28-16-28 16 6-32-24-22 32-4z', rgba(P.a, .5), 4, 9), lineaQueSeDibuja(L, 'M70 620c30-40 70-40 100 0M80 600a12 12 0 1 0 1 0M150 600a12 12 0 1 0 1 0', rgba(P.ink, .4), 4, 9, 3),
        lineaQueSeDibuja(L, 'M1760 900c40-60 120-60 140 0s-60 80-100 40 0-100 60-80', rgba(P.c, .55), 5, 9, 6)];
      return (t) => ds.forEach((f) => f(t));
    },
    (L) => { // 5 Perspectiva: horizonte, dos puntos de fuga y cajas en construcción
      L.style.background = `radial-gradient(1300px 800px at 50% 45%,#1d2d52,${P.bg} 72%)`;
      const h = 430, f1 = [-260, h], f2 = [2180, h];
      const lin = Array.from({length: 9}, (_, j) => { const y = 120 + j * 120; return `M${f1[0]} ${f1[1]}L${980} ${y}M${f2[0]} ${f2[1]}L${940} ${y}`; }).join('');
      const caja = 'M960 560L1240 470L1500 540L1220 640ZM960 560V820L1220 920V640M1500 540V780L1220 920';
      const a = lineaQueSeDibuja(L, `M-100 ${h}H2020`, rgba(P.a, .5), 3, 14), b = lineaQueSeDibuja(L, lin, rgba(P.ink, .12), 2, 14, 2), cc = lineaQueSeDibuja(L, caja, rgba(P.c, .45), 4, 14, 5);
      return (t) => { a(t); b(t); cc(t); };
    },
    (L) => { // 6 Galería: muro cálido, marcos dorados con bocetos y luces de galería
      L.style.background = `linear-gradient(180deg,#2a221d,${P.bg})`;
      const marco = (x, y, w, h, d) => capa(L, `<div style="position:absolute;inset:0;border:16px solid ${P.a};box-shadow:inset 0 0 0 6px ${rgba('#000000', .35)},0 20px 40px rgba(0,0,0,.55);background:#efe7d8"></div>${svg(w, h, `<path d="${d}" fill="none" stroke="${rgba('#2a2420', .55)}" stroke-width="4" stroke-linecap="round"/>`, 'position:absolute;inset:0')}`, `left:${x}px;top:${y}px;width:${w}px;height:${h}px;opacity:.5`);
      marco(40, 140, 260, 320, 'M60 240c20-80 80-140 140-120s20 90-40 110M110 120a30 30 0 1 0 1 0'); marco(1620, 120, 260, 220, 'M30 170L110 70L170 140L200 100L240 170'); marco(1640, 640, 230, 300, 'M115 60a50 50 0 1 0 1 0M70 260c10-60 80-60 90 0');
      const luz = [170, 1750, 1755].map((x) => capa(L, '', `left:${x - 260}px;top:-40px;width:520px;height:800px;background:radial-gradient(ellipse 50% 60% at 50% 0%,${rgba('#fff3d6', .18)},transparent 70%)`));
      return (t) => luz.forEach((e, j) => { e.style.opacity = .85 + .15 * Math.sin(t * .7 + j); });
    },
    (L) => { // 7 Acuarela: manchas de acuarela que florecen y pinceladas
      L.style.background = P.bg; grano(L, .4, .55);
      const ms = [[220, 220, 520, P.a], [1700, 850, 600, P.c], [1650, 160, 360, '#f2c14e'], [200, 900, 420, '#8b6cff']].map(([x, y, s, cc]) => capa(L, '', `left:${x - s / 2}px;top:${y - s / 2}px;width:${s}px;height:${s}px;border-radius:46% 54% 50% 50%;background:radial-gradient(closest-side,${rgba(cc, .32)},${rgba(cc, .14)} 60%,transparent);filter:blur(4px)`));
      const p = lineaQueSeDibuja(L, 'M80 560C300 500 520 620 760 560', rgba(P.a, .3), 30, 12, 2);
      return (t) => { p(t); ms.forEach((e, j) => { e.style.transform = `scale(${.86 + .14 * Math.sin(t * .35 + j * 1.7)}) rotate(${t * (j % 2 ? 4 : -4)}deg)`; }); };
    },
    (L) => { // 8 Tinta: salpicaduras de tinta, achurado y trazos de pluma
      L.style.background = `radial-gradient(1200px 800px at 50% 45%,#1a1b33,${P.bg} 72%)`;
      const spl = (x, y, s, cc) => capa(L, svg(s, s, Array.from({length: 16}, () => { const a = r() * 6.28, d = r() * s * .45, rr = 4 + r() * s * .06; return `<circle cx="${s / 2 + Math.cos(a) * d}" cy="${s / 2 + Math.sin(a) * d}" r="${rr}" fill="${cc}"/>`; }).join('') + `<circle cx="${s / 2}" cy="${s / 2}" r="${s * .16}" fill="${cc}"/>`), `left:${x}px;top:${y}px;opacity:.38`);
      const ss = [spl(80, 60, 360, P.a), spl(1540, 700, 400, P.c), spl(1600, 40, 260, '#ffffff')];
      capa(L, svg(460, 300, Array.from({length: 24}, (_, j) => `<path d="M${j * 20} 300L${j * 20 + 160} 0" stroke="${rgba(P.ink, .13)}" stroke-width="3"/>`).join('')), 'left:40px;top:740px');
      const pl = lineaQueSeDibuja(L, 'M700 1000C800 940 900 1010 1000 950S1200 900 1300 960', rgba(P.a, .5), 5, 10);
      return (t) => { pl(t); ss.forEach((e, j) => { e.style.transform = `scale(${1 + .03 * Math.sin(t * 1.3 + j)})`; }); };
    },
  ],
};
X.alMontar.push(({bg}) => { const L = $('<div class="kbg"></div>'); bg.appendChild(L); const u = FONDOS[NICHO][v](L); if (u) ups.push(u); L.appendChild($('<div class="vig"></div>')); });
X.alSeek.push((t) => ups.forEach((u) => u(t)));

// ---------------- ESCENAS: quitar los fondos de otros nichos y poner los elementos del nicho ----------------
const rel = (cam, e) => { const a = cam.getBoundingClientRect(), b = e.getBoundingClientRect(), k = a.width / 1920 || 1; return {l: (b.left - a.left) / k, t: (b.top - a.top) / k, r: (b.right - a.left) / k, b: (b.bottom - a.top) / k, w: b.width / k, h: b.height / k}; };
const choca = (a, b, m = 16) => a.l - m < b.r && a.r + m > b.l && a.t - m < b.b && a.b + m > b.t;
const textosDe = (cam) => [...cam.querySelectorAll('.T,.P,.K,.chip,.fila,.btn,.bt,.num,.call,.ped,h4,.ej,.vid,img')].map((e) => rel(cam, e)).filter((q) => q.w * q.h > 60);
// vocabulario: los diseños de abogados traían palabras del derecho (expediente, anexo, honorarios, despacho…)
const PALABRAS = MEC ? [[/expediente\s*n[ºo°]/gi, 'Orden de servicio Nº'], [/índice de anexos/gi, 'Inventario del pack'], [/\banexo\b/gi, 'Herramienta'], [/(recibo|nota) de honorarios/gi, 'Nota del taller'], [/honorarios/gi, 'servicio'], [/agenda del despacho/gi, 'Agenda del taller'],
  [/confidencial/gi, 'Exclusivo'], [/firma del titular/gi, 'Firma del mecánico'], [/constancia de compra/gi, 'Orden confirmada'], [/registro de miembros/gi, 'Registro del taller'], [/\bdespacho\b/gi, 'taller']]
  : [[/expediente\s*n[ºo°]/gi, 'Cuaderno Nº'], [/índice de anexos/gi, 'Índice de láminas'], [/\banexo\b/gi, 'Lámina'], [/(recibo|nota) de honorarios/gi, 'Nota del estudio'], [/honorarios/gi, 'trabajo'], [/agenda del despacho/gi, 'Agenda del estudio'],
  [/confidencial/gi, 'Exclusivo'], [/firma del titular/gi, 'Firma del artista'], [/constancia de compra/gi, 'Compra confirmada'], [/registro de miembros/gi, 'Registro de artistas'], [/\bdespacho\b/gi, 'estudio']];
const caso = (orig, nuevo) => (orig === orig.toUpperCase() ? nuevo.toUpperCase() : nuevo);
const vocab = (raiz) => { const w = document.createTreeWalker(raiz, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { let t = n.nodeValue; if (!t || t.length < 4) continue;
  PALABRAS.forEach(([re, nv]) => { t = t.replace(re, (m) => caso(m, nv)); }); if (t !== n.nodeValue) n.nodeValue = t; } };
X.alEscena.push((c) => {
  const {cam, tl, sc, i} = c;
  vocab(cam);
  // 1) los diseños traían fondos de su nicho de origen (madera de despacho, mármol de tribunal, negro de keynote…): fuera
  [...cam.children].forEach((e) => { if (e.classList.contains('kel')) return; const q = rel(cam, e);
    if (q.w >= 1780 && q.h >= 1000 && e.children.length < 8 && !e.querySelector('img,.T,.P,.K,.num,.chip,.btn,.bt,.app,.papel,.vid,canvas') && !String(e.textContent || '').trim()) e.style.display = 'none'; });
  // 2) elementos del nicho en las orillas, solo donde no tapan ningún texto ni imagen
  // (se mide con la escena ya armada: las entradas de los diseños mueven los textos al inicio)
  tl.time(Math.min(2.6, c.D * .62), true); const ocup = textosDe(cam), kw = MEC ? null : cam.querySelector('.T .k'), kq = kw ? rel(cam, kw) : null; tl.time(0, true);
  const lugares = [[-70, 820, 270], [1690, 840, 260], [-60, -40, 230], [1720, -50, 230], [860, 950, 200]], n = 2 + (i % 2);
  let puestos = 0;
  for (let j = 0; j < lugares.length && puestos < n; j++) {
    const [x, y, s] = lugares[(j + i) % lugares.length], k = PROPS[(i * 2 + j + v) % PROPS.length], box = {l: x, t: y, r: x + s, b: y + s};
    if (ocup.some((q) => choca(q, box))) continue;
    const e = $(`<div class="kel" style="left:${x}px;top:${y}px;width:${s}px;height:${s}px;display:flex;align-items:center;justify-content:center">${ICO[k](s * (MEC ? .9 : 1), colProp(k, j + i))}</div>`);
    cam.insertBefore(e, cam.firstChild); puestos++;
    const rot0 = (j % 2 ? 1 : -1) * (12 + j * 9);
    tl.fromTo(e, {scale: .3, opacity: 0, rotation: rot0 * 2}, {scale: 1, opacity: MEC ? .85 : .9, rotation: rot0, duration: .9, ease: 'back.out(1.6)'}, .15 + j * .12);
    const g = e.querySelector('.gira'); if (g) tl.fromTo(g, {rotation: 0}, {rotation: (j % 2 ? -1 : 1) * 30 * c.D, duration: c.D + .5, ease: 'none', transformOrigin: '50% 50%'}, 0);
    tl.to(e, {y: '-=12', duration: 2.2, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(c.D / 2.2) + 1}, 1.1);
  }
  // 3) animaciones firma del nicho
  if (MEC) {
    if (['felicita', 'precio', 'cta2', 'revela'].includes(sc.c)) chispas(c, sc.c === 'felicita' ? 960 : 1500, sc.c === 'felicita' ? 300 : 820, sc.c === 'felicita' ? .7 : 1.1);
  } else {
    bocetoAColor(c);
    if (kq && i % 2 === 0) circulo(c, kq, 1.05);
    if (['felicita', 'revela', 'cta2'].includes(sc.c)) migas(c);
  }
});
// chispas de esmeril (mecánica)
function chispas(c, x, y, at) { const {cam, tl} = c;
  for (let j = 0; j < 30; j++) { const e = $(`<i class="kchispa" style="left:${x}px;top:${y}px"></i>`); cam.appendChild(e);
    const a = -Math.PI * (.15 + .7 * r()), d = 180 + r() * 420; tl.fromTo(e, {x: 0, y: 0, rotation: a * 57.3 + 90, opacity: 1, scaleY: 1.4}, {x: Math.cos(a) * d, y: Math.sin(a) * d + 160, opacity: 0, scaleY: .4, duration: .7 + r() * .5, ease: 'power2.out'}, at + r() * .25); }
  c.fx(at, 'golpe'); }
// boceto → color: las imágenes aparecen primero como dibujo a lápiz y se colorean (dibujo)
function bocetoAColor(c) { const ims = [...c.cam.querySelectorAll('img')].filter((im) => !im.closest('.kel')); if (!ims.length) return;
  ims.forEach((im, j) => { const f0 = (im.style.filter || '').replace(/grayscale\([^)]*\)|contrast\([^)]*\)|sepia\([^)]*\)/g, '').trim();
    c.tl.fromTo(im, {filter: `${f0} grayscale(1) contrast(1.7) sepia(.15)`.trim()}, {filter: `${f0} grayscale(0) contrast(1) sepia(0)`.trim(), duration: 1.1, ease: 'power2.inOut'}, .55 + Math.min(j, 6) * .08); }); }
// círculo a lápiz alrededor de la palabra clave (dibujo)
function circulo(c, q, at) { if (!q || q.w < 40 || q.w > 900) return; const w = q.w + 70, h = q.h + 40, x = q.l - 35, y = q.t - 18;
  const e = $(`<svg class="kcirc" style="left:${x}px;top:${y}px" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="M${w * .52} ${h * .06}C${w * .96} ${h * .02} ${w * 1.01} ${h * .78} ${w * .56} ${h * .95}S${-w * .02} ${h * .86} ${w * .05} ${h * .42}S${w * .5} ${-h * .04} ${w * .74} ${h * .12}" fill="none" stroke="${P.c}" stroke-width="5" stroke-linecap="round" pathLength="1"/></svg>`);
  c.cam.appendChild(e); draw(c.tl, e.querySelector('path'), at, .7, 'power2.inOut'); c.fx(at, 'tick'); }
// migas de goma (dibujo)
function migas(c) { const {cam, tl} = c; for (let j = 0; j < 18; j++) { const e = $(`<i class="kmiga" style="left:${300 + r() * 1320}px;top:${980}px"></i>`); cam.appendChild(e);
  tl.fromTo(e, {y: 0, x: 0, opacity: 0, rotation: 0}, {y: -60 - r() * 120, x: (r() - .5) * 160, opacity: .9, rotation: r() * 360, duration: .5, ease: 'power2.out'}, .5 + r() * .4);
  tl.to(e, {y: 40, opacity: 0, duration: .6, ease: 'power1.in'}, 1.2 + r() * .3); } }

// ---------------- TRANSICIONES DEL NICHO ----------------
let cortina, banda, borr;
X.TRX.cortina = ({M, pv, el, t, FX}) => { // cortina metálica de taller que baja y sube
  if (!cortina) { cortina = $(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;transform:translateY(-1100px);background:repeating-linear-gradient(180deg,#9aa0a7 0 52px,#6c727a 52px 58px,#b9bec4 58px 64px);box-shadow:0 30px 60px rgba(0,0,0,.6);z-index:5"><i style="position:absolute;left:0;right:0;bottom:0;height:34px;background:repeating-linear-gradient(-45deg,${P.a} 0 30px,#111 30px 60px)"></i></div>`); FX.appendChild(cortina); }
  M.fromTo(cortina, {y: -1100}, {y: 0, duration: .32, ease: 'power3.in'}, t - .34); M.to(cortina, {y: -1100, duration: .42, ease: 'power3.inOut'}, t + .04);
  return {on: t - .02, off: t + .02}; };
X.TRX.banda = ({M, t, FX}) => { // banda diagonal de acero antiderrapante con orillas de seguridad
  if (!banda) { banda = $(`<div class="abs" style="left:-2600px;top:-300px;width:2400px;height:1680px;transform:skewX(-14deg);background:${textura.rombo('rgba(255,255,255,.07)', '#2a2e34')};background-size:44px 44px,44px 44px,auto;border-left:26px solid ${P.a};border-right:26px solid ${P.a};box-shadow:0 0 120px rgba(0,0,0,.7);z-index:5"></div>`); FX.appendChild(banda); }
  M.fromTo(banda, {x: 0}, {x: 2500, duration: .3, ease: 'power3.in'}, t - .3); M.to(banda, {x: 5000, duration: .34, ease: 'power3.out'}, t + .02); M.set(banda, {x: 0}, t + .42);
  return {on: t - .02, off: t + .02}; };
X.TRX.pagina = ({M, pv, el, t}) => { // la escena anterior se voltea como una hoja del cuaderno
  M.set(el, {visibility: 'visible', zIndex: 1}, t - .42); M.set(pv, {zIndex: 2, transformOrigin: '0% 50%', transformPerspective: 2600}, t - .42);
  M.fromTo(pv, {rotationY: 0, boxShadow: '0 0 0 rgba(0,0,0,0)'}, {rotationY: -96, boxShadow: '-60px 0 120px rgba(0,0,0,.55)', duration: .44, ease: 'power2.in'}, t - .4);
  M.set(pv, {rotationY: 0, zIndex: '', boxShadow: 'none'}, t + .06); M.set(el, {zIndex: ''}, t + .06);
  return {on: t - .42, off: t + .05}; };
X.TRX.borrador = ({M, pv, el, t, FX}) => { // una goma pasa y borra la escena anterior dejando la nueva
  if (!borr) { borr = $(`<div class="abs" style="left:0;top:0;width:220px;height:1300px;z-index:6;transform:translate(-400px,-110px) rotate(8deg)"><div style="position:absolute;left:0;top:0;width:220px;height:1300px;border-radius:36px;background:linear-gradient(90deg,#f29bb0,#f6c2cf 60%,#e88aa1);box-shadow:20px 0 50px rgba(0,0,0,.35)"></div><div style="position:absolute;left:0;top:0;width:220px;height:1300px;border-radius:36px;background:repeating-linear-gradient(90deg,transparent 0 60px,rgba(255,255,255,.3) 60px 70px)"></div></div>`); FX.appendChild(borr); }
  M.fromTo(el, {clipPath: 'inset(0% 100% 0% 0%)'}, {clipPath: 'inset(0% 0% 0% 0%)', duration: .5, ease: 'power1.inOut'}, t - .3); M.set(el, {clipPath: 'none'}, t + .22);
  M.fromTo(borr, {x: -400}, {x: 2100, duration: .5, ease: 'power1.inOut'}, t - .3);
  return {on: t - .3, off: t + .22}; };
})();
