// MUNDOS DEL NICHO para el video del Marketplace (motor mkt) · 23 nov 2026
// Christian (23 nov, Dibujo): «me lo hiciste con todo el diseño y estilo de DJ… eso no puede volver a pasar». Los 5 directores del
// motor mkt (Club, Vinilo, Cabina, Cartel, Cine) nacieron en DJ: láseres, disco de vinilo, decks con BPM, ondas de audio, ecualizador.
// Este archivo pone el NICHO encima de cada director: colores, letras, fondo animado, objetos, textos de las ventanas, transiciones
// y el objeto que gira (en vez del disco). Lo que cuenta cada escena (módulos, logros, alumnos, garantía) lo sigue armando mkt.js.
// Un nicho nuevo = una entrada nueva en MUNDOS. Si el nicho no está aquí, el panel NO deja generar los videos (regla V8).
(() => {
const rgba = (hex, a) => { const h = hex.replace('#', ''); const n = parseInt(h.length === 3 ? h.split('').map((x) => x + x).join('') : h, 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
const svg = (w, h, inner, st = '', vb) => `<svg width="${w}" height="${h}" viewBox="${vb || `0 0 ${w} ${h}`}" style="overflow:visible;${st}">${inner}</svg>`;
const engranePath = (R0, n) => { const ri = R0 * .8, w = Math.PI / n; let d = '';
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2; [[ri, a - w * .55], [R0, a - w * .32], [R0, a + w * .32], [ri, a + w * .55]].forEach(([rr, aa], j) => { d += (i === 0 && j === 0 ? 'M' : 'L') + (rr * Math.cos(aa)).toFixed(1) + ' ' + (rr * Math.sin(aa)).toFixed(1); }); }
  const h = R0 * .32; return d + 'Z' + `M${h} 0A${h} ${h} 0 1 0 ${-h} 0A${h} ${h} 0 1 0 ${h} 0Z`; };
// objetos del nicho (SVG; los mismos del kit de la Fábrica)
const ICO = {
  lapiz: (s, col) => svg(s, s * .14, `<path d="M18 2h150v24H18z" fill="${col}"/><path d="M18 10h150M18 18h150" stroke="rgba(0,0,0,.14)" stroke-width="2"/><path d="M168 2l26 12-26 12z" fill="#e9c9a0"/><path d="M186 10l8 4-8 4z" fill="#2b2b2b"/><rect x="4" y="1" width="16" height="26" rx="2" fill="#b9bdc3"/><path d="M4 1h-2a4 4 0 0 0 0 26h2z" fill="#f29bb0"/>`, '', '0 0 200 28'),
  goma: (s, col) => svg(s, s * .5, `<rect x="2" y="2" width="96" height="46" rx="10" fill="#f6d3db"/><rect x="2" y="2" width="44" height="46" rx="10" fill="${col}"/><rect x="36" y="2" width="12" height="46" fill="${col}"/>`, '', '0 0 100 50'),
  regla: (s, col) => svg(s, s * .16, `<rect x="0" y="0" width="300" height="48" rx="4" fill="${col}" opacity=".92"/>${Array.from({length: 29}, (_, j) => `<path d="M${10 + j * 10} 0v${j % 5 ? 12 : 22}" stroke="rgba(0,0,0,.5)" stroke-width="2"/>`).join('')}`, '', '0 0 300 48'),
  pincel: (s, col) => svg(s, s * .12, `<path d="M0 10h120l10-4v16l-10-4H0z" fill="#3b2b22"/><rect x="128" y="3" width="30" height="22" rx="3" fill="#c9ccd1"/><path d="M158 4c24 0 40 6 46 10-6 4-22 10-46 10z" fill="${col}"/>`, '', '0 0 210 28'),
  paleta: (s, bg, cols) => svg(s, s * .8, `<path d="M60 4C24 4 2 28 2 52s20 44 52 44c12 0 14-10 8-18s0-16 12-16h12c14 0 22-8 22-22C108 20 90 4 60 4z" fill="#e8d5b5"/><circle cx="74" cy="64" r="9" fill="${bg}"/>${[[30, 30], [56, 20], [84, 30], [26, 58], [44, 78]].map(([x, y], j) => `<circle cx="${x}" cy="${y}" r="9" fill="${cols[j % cols.length]}"/>`).join('')}`, '', '0 0 110 100'),
  sacapuntas: (s, col) => svg(s * .7, s * .5, `<rect x="2" y="6" width="60" height="38" rx="6" fill="${col}"/><path d="M14 18l26 7-26 7z" fill="#2b2b2b"/><rect x="40" y="10" width="18" height="30" rx="3" fill="#c9ccd1"/>`, '', '0 0 64 50'),
  engrane: (s, col, n = 12) => svg(s, s, `<g transform="translate(${s / 2} ${s / 2})"><path class="gira" d="${engranePath(s / 2, n)}" fill="${col}" fill-rule="evenodd"/></g>`),
  llave: (s, col) => svg(s, s * .3, `<g fill="${col}"><rect x="34" y="22" width="132" height="16" rx="7"/><path fill-rule="evenodd" d="M28 6a24 24 0 1 0 .1 0ZM2 23H30V37H2Z"/><path fill-rule="evenodd" d="M174 7a23 23 0 1 0 .1 0ZM174 18a12 12 0 1 0 .1 0Z"/></g>`, '', '0 0 200 60'),
  tuerca: (s, col, bg) => svg(s, s, `<path d="M50 4l40 23v46L50 96 10 73V27z" fill="${col}"/><circle cx="50" cy="50" r="19" fill="${bg}"/>`, '', '0 0 100 100'),
  bujia: (s, col) => svg(s * .36, s, `<rect x="14" y="0" width="22" height="40" rx="4" fill="#e9e9ea"/><rect x="6" y="40" width="38" height="34" rx="3" fill="${col}"/><path d="M6 46h38M6 54h38M6 62h38" stroke="rgba(0,0,0,.35)" stroke-width="3"/><rect x="12" y="74" width="26" height="40" fill="#c9ccd1"/><path d="M12 82h26M12 92h26M12 102h26" stroke="#8b9097" stroke-width="3"/><path d="M25 114v14h10" fill="none" stroke="#c9ccd1" stroke-width="4"/>`, '', '0 0 50 140'),
  llanta: (s, col) => svg(s, s, `<circle cx="50" cy="50" r="46" fill="#151618"/><circle cx="50" cy="50" r="46" fill="none" stroke="#2a2c30" stroke-width="8" stroke-dasharray="6 5"/><circle cx="50" cy="50" r="28" fill="${col}"/><g class="gira" style="transform-origin:50px 50px">${[0, 72, 144, 216, 288].map((a) => `<rect x="47" y="25" width="6" height="22" rx="3" fill="rgba(0,0,0,.45)" transform="rotate(${a} 50 50)"/>`).join('')}</g><circle cx="50" cy="50" r="7" fill="#151618"/>`, '', '0 0 100 100'),
  carro: (w, col) => svg(w, w * .36, `<ellipse cx="210" cy="140" rx="196" ry="9" fill="rgba(0,0,0,.45)"/><path d="M18 108L26 82Q32 68 52 64L122 57Q152 30 198 24L262 22Q302 24 332 52L374 60Q400 65 406 86L410 106Q410 118 398 120L24 120Q12 118 18 108Z" fill="${col}"/><path d="M140 57Q164 36 200 32L254 31Q286 33 306 55Z" fill="#0f151c"/><rect x="392" y="72" width="16" height="12" rx="4" fill="#fff3c4"/><rect x="18" y="74" width="12" height="14" rx="3" fill="#ff3b30"/>${[100, 322].map((cx) => `<g class="rueda" style="transform-origin:${cx}px 114px"><circle cx="${cx}" cy="114" r="31" fill="#111214"/><circle cx="${cx}" cy="114" r="19" fill="#c9ccd1"/>${[0, 72, 144, 216, 288].map((a) => `<rect x="${cx - 3}" y="97" width="6" height="15" rx="3" fill="#6d727a" transform="rotate(${a} ${cx} 114)"/>`).join('')}</g>`).join('')}`, '', '0 0 420 150'),
  // canto (23 nov 2026)
  micro: (s, col) => svg(s * .42, s, `<rect x="6" y="2" width="72" height="104" rx="36" fill="#2a2a2e"/><g fill="rgba(255,255,255,.16)">${Array.from({length: 40}, (_, j) => `<circle cx="${16 + (j % 5) * 13}" cy="${14 + Math.floor(j / 5) * 11}" r="2.6"/>`).join('')}</g><rect x="4" y="58" width="76" height="10" rx="5" fill="${col}"/><path d="M42 106v44" stroke="${col}" stroke-width="10"/><path d="M14 92c0 22 12 34 28 34s28-12 28-34" fill="none" stroke="${col}" stroke-width="7"/><rect x="18" y="150" width="48" height="10" rx="5" fill="${col}"/>`, '', '0 0 84 200'),
  audifonos: (s, col) => svg(s, s * .9, `<path d="M18 82V60a52 52 0 0 1 104 0v22" fill="none" stroke="#2b2b30" stroke-width="12" stroke-linecap="round"/><rect x="4" y="70" width="30" height="46" rx="12" fill="${col}"/><rect x="106" y="70" width="30" height="46" rx="12" fill="${col}"/>`, '', '0 0 140 126'),
  nota: (s, col) => svg(s * .7, s, `<ellipse cx="22" cy="84" rx="20" ry="14" fill="${col}" transform="rotate(-20 22 84)"/><path d="M40 80V8c18 6 30 16 30 34" fill="none" stroke="${col}" stroke-width="8" stroke-linecap="round"/>`, '', '0 0 72 100'),
  // ajedrez (24 nov 2026): piezas Staunton de perfil (s = alto), el reloj de torneo y un tablero visto de arriba
  pieza: (tipo, s, col, borde) => { const B = 'M18 156H82V146Q82 137 72 135', st = borde ? ` stroke="${borde}" stroke-width="2.5"` : '';
    const D = {
      peon: `${B}L64 132Q57 112 60 96H68V88H32V96H40Q43 112 36 132L28 135Q18 137 18 146Z M50 50a17 17 0 1 0 .1 0Z`,
      torre: `${B}L67 96H74V62H64V72H56V62H44V72H36V62H26V96H33L28 135Q18 137 18 146Z`,
      alfil: `${B}L62 104H70V96H30V104H38L28 135Q18 137 18 146Z M50 34C66 48 71 70 62 90H38C29 70 34 48 50 34Z M50 22a7 7 0 1 0 .1 0Z`,
      dama: `${B}L62 100H70V92H30V100H38L28 135Q18 137 18 146Z M31 90L23 50L38 70L43 40L50 66L57 40L62 70L77 50L69 90Z M23 46a5 5 0 1 0 .1 0ZM43 36a5 5 0 1 0 .1 0ZM57 36a5 5 0 1 0 .1 0ZM77 46a5 5 0 1 0 .1 0Z`,
      rey: `${B}L62 100H70V92H30V100H38L28 135Q18 137 18 146Z M33 90C27 72 30 56 50 52C70 56 73 72 67 90Z M46 18H54V30H64V38H54V50H46V38H36V30H46Z`,
      caballo: 'M20 156H84V146Q84 137 74 135L72 118C79 96 77 70 62 50C55 40 44 33 34 31L36 42C27 45 19 56 15 69C13 76 18 80 25 78C32 76 37 73 42 75C35 87 29 101 31 118L29 135Q20 137 20 146Z',
    };
    const ojo = tipo === 'caballo' ? `<circle cx="38" cy="52" r="3.5" fill="rgba(0,0,0,.55)"/>` : '';
    return svg(s * .64, s, `<path d="${D[tipo] || D.peon}" fill="${col}" fill-rule="nonzero"${st}/>${ojo}`, '', '0 0 100 160'); },
  // reloj de ajedrez de dos caras; .ag1 y .ag2 son las agujas (se giran desde fondo())
  reloj: (s, col, cara) => svg(s, s * .62, `<rect x="6" y="40" width="288" height="140" rx="18" fill="${col}"/><rect x="58" y="22" width="44" height="22" rx="6" fill="${col}"/><rect x="198" y="16" width="44" height="28" rx="6" fill="${col}"/>
    ${[78, 222].map((cx, j) => `<circle cx="${cx}" cy="110" r="52" fill="${cara}" stroke="rgba(0,0,0,.35)" stroke-width="4"/>${Array.from({length: 12}, (_, k) => { const a = k * Math.PI / 6; return `<path d="M${cx + Math.cos(a) * 44} ${110 + Math.sin(a) * 44}L${cx + Math.cos(a) * 50} ${110 + Math.sin(a) * 50}" stroke="#222" stroke-width="3"/>`; }).join('')}<g class="ag${j + 1}" style="transform-origin:${cx}px 110px"><path d="M${cx - 3} 110L${cx} 66L${cx + 3} 110Z" fill="#c0392b"/></g><circle cx="${cx}" cy="110" r="5" fill="#222"/>`).join('')}`, '', '0 0 300 186'),
  // tablero 8×8 visto de arriba (claras, oscuras), con o sin coordenadas
  tablero: (s, cl, os, coord) => svg(s, s, `${Array.from({length: 64}, (_, k) => { const f = Math.floor(k / 8), c = k % 8; return `<rect x="${c * 100}" y="${f * 100}" width="100" height="100" fill="${(f + c) % 2 ? os : cl}"/>`; }).join('')}${coord ? 'abcdefgh'.split('').map((l, j) => `<text x="${j * 100 + 88}" y="794" font-family="Manrope" font-weight="700" font-size="20" fill="${j % 2 ? cl : os}">${l}</text>`).join('') + Array.from({length: 8}, (_, j) => `<text x="6" y="${j * 100 + 24}" font-family="Manrope" font-weight="700" font-size="20" fill="${j % 2 ? cl : os}">${8 - j}</text>`).join('') : ''}`, '', '0 0 800 800'),
  // legal (24 nov 2026): mazo de juez, bloque de sonido, balanza, columna, sello de lacre, pluma y carpeta de expediente
  mazo: (s, wood, gold) => svg(s, s * 1.25, `<g class="golpe" style="transform-origin:80px 190px"><rect x="71" y="62" width="18" height="128" rx="9" fill="${wood}"/><rect x="71" y="62" width="18" height="128" rx="9" fill="url(#vt)" opacity=".5"/><rect x="8" y="16" width="144" height="56" rx="16" fill="${wood}"/><rect x="8" y="16" width="144" height="18" rx="9" fill="rgba(255,255,255,.12)"/><rect x="8" y="16" width="22" height="56" rx="8" fill="${gold}"/><rect x="130" y="16" width="22" height="56" rx="8" fill="${gold}"/><rect x="62" y="20" width="10" height="48" fill="${gold}" opacity=".85"/><rect x="88" y="20" width="10" height="48" fill="${gold}" opacity=".85"/></g><defs><linearGradient id="vt" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".4"/><stop offset=".5" stop-color="#fff" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient></defs>`, '', '0 0 160 200'),
  bloque: (s, wood, gold) => svg(s, s * .32, `<ellipse cx="100" cy="52" rx="96" ry="12" fill="rgba(0,0,0,.45)"/><rect x="18" y="18" width="164" height="30" rx="8" fill="${wood}"/><ellipse cx="100" cy="18" rx="82" ry="14" fill="${wood}"/><ellipse cx="100" cy="18" rx="82" ry="14" fill="none" stroke="${gold}" stroke-width="4"/>`, '', '0 0 200 64'),
  balanza: (s, col, base) => svg(s, s * .9, `<rect x="96" y="34" width="8" height="128" fill="${col}"/><path d="M62 172h76l-10-14H72z" fill="${base || col}"/><circle cx="100" cy="26" r="10" fill="${col}"/><g class="brazo" style="transform-origin:100px 40px"><path d="M14 40H186" stroke="${col}" stroke-width="7" stroke-linecap="round"/><g class="pi"><path d="M14 40L-6 104M14 40L34 104" stroke="${col}" stroke-width="2.5"/><path d="M-14 104h56c-4 16-16 22-28 22s-24-6-28-22z" fill="${col}"/></g><g class="pd"><path d="M186 40L166 104M186 40L206 104" stroke="${col}" stroke-width="2.5"/><path d="M158 104h56c-4 16-16 22-28 22s-24-6-28-22z" fill="${col}"/></g></g>`, '', '-20 0 240 180'),
  columna: (s, col, sombra) => svg(s * .3, s, `<rect x="0" y="0" width="120" height="22" fill="${col}"/><path d="M6 22h108l-8 18H14z" fill="${col}"/><circle cx="14" cy="34" r="11" fill="none" stroke="${col}" stroke-width="6"/><circle cx="106" cy="34" r="11" fill="none" stroke="${col}" stroke-width="6"/><rect x="18" y="40" width="84" height="320" fill="${col}"/>${[30, 46, 62, 78, 94].map((x) => `<path d="M${x} 46v308" stroke="${sombra}" stroke-width="5" stroke-linecap="round"/>`).join('')}<path d="M10 360h100v14H10zM2 374h116v26H2z" fill="${col}"/>`, '', '0 0 120 400'),
  sello: (s, col, ink) => svg(s, s, `<path d="${Array.from({length: 24}, (_, j) => { const a = j / 24 * Math.PI * 2, r = j % 2 ? 46 : 50; return (j ? 'L' : 'M') + (50 + Math.cos(a) * r).toFixed(1) + ' ' + (50 + Math.sin(a) * r).toFixed(1); }).join('')}Z" fill="${col}"/><circle cx="50" cy="50" r="34" fill="none" stroke="${ink}" stroke-width="2.5" opacity=".7"/><path d="M50 30v34M34 38h32M34 38l-7 15h14zM66 38l-7 15h14zM42 66h16" fill="none" stroke="${ink}" stroke-width="3" stroke-linejoin="round" opacity=".85"/>`, '', '0 0 100 100'),
  pluma: (s, col, gold) => svg(s, s * .16, `<path d="M0 16L150 6Q168 6 168 16T150 26L0 16Z" fill="${col}"/><rect x="40" y="10" width="10" height="12" fill="${gold}"/><path d="M168 10l34 6-34 6z" fill="${gold}"/><path d="M178 16h20" stroke="rgba(0,0,0,.4)" stroke-width="1.5"/>`, '', '0 0 204 32'),
  carpeta: (s, col, papel) => svg(s, s * .78, `<path d="M4 18h70l14 14h108v126H4z" fill="${col}"/><rect x="14" y="30" width="172" height="118" fill="${papel}" transform="rotate(-2 100 90)"/>${[52, 70, 88, 106, 124].map((y) => `<path d="M30 ${y}h${y === 124 ? 80 : 140}" stroke="rgba(0,0,0,.18)" stroke-width="4" transform="rotate(-2 100 90)"/>`).join('')}<path d="M4 44h192v114H4z" fill="${col}" opacity=".92"/><rect x="70" y="80" width="60" height="14" rx="3" fill="rgba(255,255,255,.75)"/>`, '', '0 0 200 160'),
};
const P = (bg, ink, mut, a, b, c, sobre, panel, line, sombra, ft, fw, fb, fm, tt, ls, rad) => ({bg, ink, mut, a, b, c, sobre, panel, line, sombra, ft, fw, fb, fm, tt, ls, rad, acc: `linear-gradient(90deg,${a},${c},${a})`});

// ======================= DIBUJO =======================
const DIBUJO = {
  nombres: ['Mesa de dibujo', 'Rueda de color', 'App de dibujo', 'Cuaderno de bocetos', 'Galería'],
  pal: [
    P('#f3ede1', '#1f1c1a', '#5f584f', '#2747c9', '#e4572e', '#f2a900', '#ffffff', 'rgba(39,71,201,.07)', 'rgba(39,71,201,.32)', 'rgba(80,60,30,.30)', 'Fraunces', 700, 'DMSans', 'DMSans', 'none', '-.015em', '14px'),
    P('#1b1512', '#f6efe4', '#c9bba8', '#f2a03d', '#e4572e', '#ffc86b', '#1b1512', 'rgba(246,239,228,.06)', 'rgba(242,160,61,.42)', 'rgba(0,0,0,.6)', 'DMSerif', 400, 'DMSans', 'DMSans', 'none', '-.01em', '999px'),
    P('#1d1e23', '#f4f4f6', '#a3a5ae', '#ff6b3d', '#7cc3ff', '#ffb03a', '#ffffff', '#2a2b31', '#3a3c44', 'rgba(255,107,61,.25)', 'Fraunces', 650, 'DMSans', 'DMSans', 'none', '-.015em', '12px'),
    P('#f8f4eb', '#24211f', '#3d3934', '#1f6feb', '#24211f', '#f2a900', '#ffffff', '#24211f', '#24211f', 'rgba(60,45,25,.3)', 'Fraunces', 800, 'DMSans', 'DMSans', 'none', '-.02em', '6px'),
    P('#1c1714', '#f7f0e6', '#d0c3b0', '#d6a54a', '#8a6a3a', '#f0cf7d', '#1c1714', 'rgba(255,255,255,.06)', 'rgba(214,165,74,.45)', 'rgba(0,0,0,.6)', 'Instrument', 400, 'DMSans', 'DMSans', 'none', '-.01em', '6px'),
  ],
  musica: ['sounds-good', 'light-it-up-boy', 'funky-martian', 'year-2001', 'dirty-thinkin'],
  // textos de las ventanas (director 3) y etiquetas que en DJ decían DECK, BPM, ERROR…
  txt: {deck: (i) => 'CAPA ' + (i + 1), bpm: 'PINCEL · 12 PX', error: (j) => 'BOCETO ' + (j + 1), registro: 'BOCETOS', biblioteca: 'MIS LIENZOS', nuevas: 'NUEVAS TÉCNICAS', desbloq: 'APRENDIDAS', cert: 'CERTIFICADO.PNG', modulo: 'MÓDULO'},
  // director 4: cada escena es otra hoja del cuaderno
  cartel: [['#f8f4eb', '#24211f', '#1f6feb'], ['#1f6feb', '#ffffff', '#f2c94c'], ['#f2c94c', '#24211f', '#1f6feb'], ['#24211f', '#f8f4eb', '#f2c94c']],
  barras: ['#f8f4eb', '#f2c94c', '#1f6feb'],
  css: `
body.mu-dibujo .trama{background-image:repeating-linear-gradient(0deg,transparent 0 46px,rgba(31,111,235,.22) 46px 48px),linear-gradient(90deg,transparent 0 150px,rgba(228,87,46,.45) 150px 153px,transparent 153px);opacity:.9}
body.mu-dibujo .franja{height:96px;background:rgba(242,201,76,.85);background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.18) 0 18px,transparent 18px 36px);clip-path:polygon(0 8%,2% 0,98% 6%,100% 0,100% 92%,98% 100%,2% 94%,0 100%);opacity:.95}
body.mu-dibujo .ui{background:#25262c;border:2px solid #3a3c44;border-radius:14px;box-shadow:0 30px 60px rgba(0,0,0,.35)}
body.mu-dibujo .ui .bar{background:#2f3037;border-bottom:2px solid #3a3c44;color:#b9bbc4;font-family:DMSans}
body.mu-dibujo.d3 .fila{background:#2a2b31;border:2px solid #3a3c44}
body.mu-dibujo .disco{background:conic-gradient(from 0deg,#e4572e,#f2a03d,#f2c94c,#9bd06a,#3fb39b,#3a86ff,#5b4bd6,#b04bd6,#e85d75,#e4572e);box-shadow:0 40px 120px rgba(0,0,0,.6),inset 0 0 0 14px rgba(255,255,255,.08)}
body.mu-dibujo .disco::before{background:radial-gradient(closest-side,rgba(255,255,255,.95),rgba(255,255,255,.35) 55%,transparent 72%);mix-blend-mode:normal}
body.mu-dibujo .disco .lab{background:#f6efe4;color:#1b1512;font-family:DMSerif}
body.mu-dibujo .disco .lab::after{display:none}
body.mu-dibujo .fuga{background:radial-gradient(closest-side,rgba(214,165,74,.3),transparent 70%)}
body.mu-dibujo .cita b{font-family:Caveat;font-size:40px;letter-spacing:0}`,
  // fondos animados de cada director: dibujos del nicho que se trazan y se mueven (nada del mundo DJ)
  fondo(DIR, bg, AMB, H) {
    const {capa, linea, pal} = H, p = pal;
    if (DIR === 1) { // papel cuadriculado, estudio de cubo y esfera que se dibuja, lápices y goma sobre la mesa
      bg.style.background = `linear-gradient(${rgba(p.a, .08)} 1px,transparent 1px) 0 0/44px 44px,linear-gradient(90deg,${rgba(p.a, .08)} 1px,transparent 1px) 0 0/44px 44px,${p.bg}`;
      const d1 = linea(bg, 'M1460 250L1700 170L1860 260L1620 340ZM1460 250V520L1620 610V340M1860 260V530L1620 610', rgba(p.ink, .2), 3, 9);
      const d2 = linea(bg, 'M200 860a150 150 0 1 0 300 0a150 150 0 1 0 -300 0M200 860c60 40 240 40 300 0', rgba(p.ink, .16), 3, 11, 4);
      const l1 = capa(bg, ICO.lapiz(420, '#f2c14e'), 'left:-90px;top:120px;transform:rotate(-18deg);opacity:.85;filter:drop-shadow(8px 10px 6px rgba(80,60,30,.25))');
      const l2 = capa(bg, ICO.lapiz(360, p.a), 'left:1560px;top:930px;transform:rotate(12deg);opacity:.85;filter:drop-shadow(8px 10px 6px rgba(80,60,30,.25))');
      capa(bg, ICO.goma(150, p.b), 'left:1750px;top:760px;transform:rotate(-10deg);opacity:.85');
      capa(bg, ICO.regla(560, '#f2d6a2'), 'left:-60px;top:1010px;transform:rotate(3deg);opacity:.7');
      AMB.push((t) => { d1(t); d2(t); l1.style.transform = `rotate(${-18 + Math.sin(t * .5) * 2}deg)`; l2.style.transform = `rotate(${12 + Math.sin(t * .6 + 1) * 2}deg) translateX(${Math.sin(t * .4) * 12}px)`; });
    } else if (DIR === 2) { // escritorio de nogal con paleta, pinceles y manchas de pintura
      bg.style.background = `repeating-linear-gradient(91deg,rgba(0,0,0,0) 0 22px,rgba(0,0,0,.16) 22px 24px,rgba(0,0,0,0) 24px 58px),radial-gradient(1300px 900px at 70% 45%,${rgba(p.a, .16)},transparent 62%),${p.bg}`;
      [[140, 120, p.b, 90], [1700, 940, '#3a86ff', 70], [300, 960, p.c, 60], [1820, 120, '#e85d75', 50]].forEach(([x, y, cc, r]) => capa(bg, '', `left:${x - r}px;top:${y - r}px;width:${r * 2}px;height:${r * 1.7}px;border-radius:46% 54% 60% 40%/50% 42% 58% 50%;background:${rgba(cc, .22)};filter:blur(1px)`));
      const pb = capa(bg, ICO.pincel(520, p.a), 'left:60px;top:880px;transform:rotate(-8deg);opacity:.6');
      capa(bg, ICO.paleta(260, p.bg, [p.a, p.c, '#3a86ff', '#e85d75', '#9bd06a']), 'left:40px;top:60px;transform:rotate(-14deg);opacity:.55');
      AMB.push((t) => { pb.style.transform = `rotate(${-8 + Math.sin(t * .7) * 3}deg)`; });
    } else if (DIR === 3) { // lienzo de una app de dibujo: cuadros de transparencia, barra de herramientas y un trazo que se pinta
      bg.style.background = `conic-gradient(#25262c 25%,#2c2d34 0 50%,#25262c 0 75%,#2c2d34 0) 0 0/64px 64px`;
      capa(bg, '', `inset:0;background:radial-gradient(1200px 800px at 50% 50%,transparent,${rgba(p.bg, .85)})`);
      capa(bg, ['lapiz', 'pincel', 'goma', 'regla', 'sacapuntas'].map((k, j) => `<div style="width:64px;height:64px;margin:14px 0;border-radius:14px;background:${j === 1 ? rgba(p.a, .25) : '#2f3037'};display:flex;align-items:center;justify-content:center;overflow:hidden">${k === 'goma' ? ICO.goma(44, p.a) : k === 'sacapuntas' ? ICO.sacapuntas(52, p.c) : `<div style="transform:rotate(-45deg)">${ICO[k](60, k === 'regla' ? '#f2d6a2' : p.c)}</div>`}</div>`).join(''), 'left:18px;top:120px;opacity:.55');
      const cp = capa(bg, `<svg width="180" height="180"><circle cx="90" cy="90" r="80" fill="none" stroke-width="22" stroke="url(#mug)"/><defs><linearGradient id="mug"><stop offset="0" stop-color="#e4572e"/><stop offset=".5" stop-color="#f2c94c"/><stop offset="1" stop-color="#3a86ff"/></linearGradient></defs></svg>`, 'right:30px;bottom:40px;opacity:.45');
      const tr = linea(bg, 'M220 980C520 900 760 1010 1060 930S1560 880 1760 960', rgba(p.a, .35), 26, 10);
      AMB.push((t) => { tr(t); cp.style.transform = `rotate(${t * 20}deg)`; });
    } else if (DIR === 4) { // hoja de cuaderno con renglones y margen (se ve detrás de las hojas de cada escena)
      bg.style.background = p.bg; bg.appendChild(H.$('<div class="trama"></div>'));
    } else { // galería: muro cálido con marcos y una luz que se mueve
      bg.style.background = `radial-gradient(1400px 900px at 50% 0%,#2a221d,${p.bg} 70%)`;
      const f = H.$('<div class="fuga" style="left:-300px;top:-400px"></div>'); bg.appendChild(f);
      // marcos colgados en el muro con bocetos a carboncillo que se van trazando
      [[40, 120, 230, 300], [1650, 640, 240, 300], [1700, 90, 180, 220], [60, 700, 190, 240]].forEach(([x, y, w, h]) => capa(bg, '', `left:${x}px;top:${y}px;width:${w}px;height:${h}px;border:10px solid ${rgba(p.a, .22)};box-shadow:inset 0 0 0 14px ${rgba('#f3ead8', .04)},0 20px 40px rgba(0,0,0,.35)`));
      const s1 = linea(bg, 'M155 330c-50-6-70-60-52-104c16-40 74-52 100-18c26 34 6 100-48 122M120 345c10 40 60 50 80 20', rgba('#f3ead8', .2), 2.5, 10);
      const s2 = linea(bg, 'M1700 880c30-120 120-180 190-150M1720 900l150-40M1760 760c20-30 70-30 90 0s-10 60-45 60-60-30-45-60', rgba('#f3ead8', .18), 2.5, 12, 3);
      const s3 = linea(bg, 'M1730 270l60-110l60 110zM1745 270h90', rgba('#f3ead8', .16), 2.5, 9, 5);
      const s4 = linea(bg, 'M95 900c40-60 100-80 130-40c20 30-10 70-50 70s-60-40-40-80M100 920h110', rgba('#f3ead8', .16), 2.5, 11, 7);
      AMB.push((t) => { s1(t); s2(t); s3(t); s4(t); });
      AMB.push((t) => { f.style.transform = `translate(${Math.sin(t * .2) * 600 + 700}px,${Math.cos(t * .15) * 200}px)`; f.style.opacity = .5 + .4 * Math.sin(t * .7); });
    }
  },
  // director 1: trazos de lápiz que cruzan detrás del texto (en DJ eran láseres)
  rayos(c, H, inverso) {
    const {pal} = H;
    for (let i = 0; i < 4; i++) {
      const y = 160 + i * 230, d = `M-60 ${y}C400 ${y - 70} 800 ${y + 80} 1200 ${y - 10}S1800 ${y - 60} 1990 ${y + 20}`;
      const e = H.$(`<svg class="abs" width="1920" height="1080" style="left:0;top:0;overflow:visible"><path d="${d}" fill="none" stroke="${i % 2 ? rgba(pal.b, .22) : rgba(pal.a, .18)}" stroke-width="${14 - i * 2}" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/></svg>`);
      c.cam.insertBefore(e, c.cam.firstChild);
      c.tl.fromTo(e.firstChild, {strokeDashoffset: inverso ? -1 : 1}, {strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut'}, .05 + i * .18);
    }
  },
  // director 3: un trazo de pincel en lugar de la onda de audio
  onda(c, o, H) {
    const {pal} = H, col = o.b ? pal.b : pal.a, h = o.h, w = o.w;
    const d = `M10 ${h / 2}C${w * .2} ${h * .15} ${w * .35} ${h * .85} ${w * .5} ${h / 2}S${w * .8} ${h * .1} ${w - 10} ${h / 2}`;
    const e = H.$(`<div class="abs" style="left:${o.x}px;top:${o.y}px;width:${w}px;height:${h}px"><svg width="${w}" height="${h}" style="overflow:visible"><path d="${d}" fill="none" stroke="${col}" stroke-width="${h * .32}" stroke-linecap="round" opacity=".85" pathLength="1" stroke-dasharray="1 1"/><path d="${d}" fill="none" stroke="#fff" stroke-width="${h * .06}" stroke-linecap="round" opacity=".35" transform="translate(0 ${-h * .07})"/></svg></div>`);
    (o.en || c.cam).appendChild(e);
    c.tl.fromTo(e.querySelector('path'), {strokeDashoffset: 1}, {strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut'}, .3);
    return e;
  },
  chip: {bg: '#24211f', ink: '#f8f4eb', font: 'DMSans', tt: 'none'},
};

// ======================= MECÁNICA =======================
const MECANICA = {
  nombres: ['Pista', 'Velocímetro', 'Escáner', 'Orden de servicio', 'Taller'],
  pal: [
    P('#101114', '#f4f2ee', '#a9adb3', '#ff6a13', '#ffae2b', '#ffd659', '#111111', 'rgba(255,255,255,.05)', 'rgba(255,106,19,.45)', 'rgba(255,106,19,.3)', 'BarlowC', 800, 'Archivo', 'Rajdhani', 'uppercase', '.005em', '10px'),
    P('#07090c', '#eef2f6', '#98a2ad', '#e3262e', '#ff5a4e', '#ffd659', '#ffffff', 'rgba(255,255,255,.05)', 'rgba(227,38,46,.45)', 'rgba(0,0,0,.6)', 'Oswald', 600, 'Archivo', 'Rajdhani', 'uppercase', '.01em', '999px'),
    P('#0a0f15', '#e9f1f8', '#8aa0b4', '#2f8cff', '#ff8a1f', '#7cc4ff', '#ffffff', '#111a23', '#1d2b3a', 'rgba(47,140,255,.25)', 'BarlowC', 700, 'Archivo', 'Rajdhani', 'none', '.005em', '10px'),
    P('#ffd400', '#111111', '#222222', '#e2531e', '#111111', '#ffffff', '#ffffff', '#111', '#111', 'rgba(0,0,0,.35)', 'BigShoulders', 800, 'Archivo', 'Rajdhani', 'uppercase', '.01em', '0px'),
    P('#0b0b0d', '#f1f1f3', '#b5b6bb', '#ff8a1f', '#c8361f', '#ffc24a', '#111111', 'rgba(255,255,255,.06)', 'rgba(255,138,31,.45)', 'rgba(0,0,0,.6)', 'BarlowC', 700, 'Archivo', 'Rajdhani', 'uppercase', '.01em', '6px'),
  ],
  musica: ['ko', 'sports-rock', 'caught-on-tape', 'rock-the-game', 'im-all-heart'],
  txt: {deck: (i) => 'SENSOR ' + 'ABCD'[i % 4], bpm: 'OBD2 · CONECTADO', error: (j) => 'FALLA ' + (j + 1), registro: 'DIAGNÓSTICO', biblioteca: 'MANUALES', nuevas: 'NUEVAS HABILIDADES', desbloq: 'LISTAS', cert: 'CERTIFICADO.PDF', modulo: 'MÓDULO'},
  cartel: [['#ffd400', '#111111', '#e2531e'], ['#111111', '#ffd400', '#ffd400'], ['#e2531e', '#ffffff', '#111111'], ['#f2efe8', '#111111', '#e2531e']],
  barras: ['#111', '#e2531e', '#ffd400'],
  css: `
body.mu-mecanica .trama{background-image:repeating-linear-gradient(45deg,rgba(0,0,0,.08) 0 6px,transparent 6px 26px),repeating-linear-gradient(-45deg,rgba(0,0,0,.08) 0 6px,transparent 6px 26px);background-size:auto;opacity:.8}
body.mu-mecanica .disco{background:radial-gradient(circle,#2a2c30 0 34%,#151618 35% 47%,#0d0e10 48% 100%);box-shadow:0 40px 120px rgba(0,0,0,.6),inset 0 0 0 26px #111214,inset 0 0 0 34px #2a2c30}
body.mu-mecanica .disco::before{background:repeating-conic-gradient(from 0deg,rgba(200,204,209,.75) 0 7deg,transparent 7deg 36deg);-webkit-mask:radial-gradient(circle,transparent 0 12%,#000 13% 46%,transparent 47%);mask:radial-gradient(circle,transparent 0 12%,#000 13% 46%,transparent 47%)}
body.mu-mecanica .disco .lab{background:var(--a);color:#fff;font-family:BarlowC;left:41%;top:41%;width:18%;height:18%;font-size:0}
body.mu-mecanica .disco .lab::after{background:#111214}
body.mu-mecanica .ui{background:#0f1720;border:2px solid #1d2b3a}
body.mu-mecanica .ui .bar{background:#132030;border-bottom:2px solid #1d2b3a;color:#7f9ab3;font-family:Rajdhani}
body.mu-mecanica.d3 .fila{background:#111a23;border:2px solid #1d2b3a}
body.mu-mecanica .fuga{background:radial-gradient(closest-side,rgba(255,138,31,.3),transparent 70%)}`,
  fondo(DIR, bg, AMB, H) {
    const {capa, linea, pal} = H, p = pal;
    const engranes = (lista) => { const gs = lista.map(([x, y, s, n, col, vel]) => ({e: capa(bg, ICO.engrane(s, col, n), `left:${x - s / 2}px;top:${y - s / 2}px`), vel}));
      return (t) => gs.forEach((g) => { g.e.querySelector('.gira').style.transform = `rotate(${t * g.vel}deg)`; }); };
    const carro = (y, col, cada, des) => { const k = capa(bg, ICO.carro(420, col), `left:0;top:${y}px;opacity:.75`);
      return (t) => { const f = ((t + des) % cada) / cada; k.style.transform = `translateX(${-520 + f * 3000}px)`; k.querySelectorAll('.rueda').forEach((r) => { r.style.transform = `rotate(${t * 600}deg)`; }); }; };
    if (DIR === 1) { // muro del taller con lámparas, llantas, engranes y un carro que pasa
      bg.style.background = `repeating-linear-gradient(0deg,transparent 0 47px,rgba(255,255,255,.03) 47px 49px),linear-gradient(180deg,#1a1c20 0%,${p.bg} 58%,#08090a 100%)`;
      const lamps = [360, 960, 1560].map((x) => capa(bg, `<div style="position:absolute;left:-22px;top:0;width:44px;height:28px;border-radius:0 0 22px 22px;background:#2b2f35;box-shadow:0 6px 30px ${rgba(p.c, .6)}"></div><div style="position:absolute;left:-380px;top:24px;width:760px;height:900px;background:linear-gradient(180deg,${rgba(p.c, .18)},transparent 75%);clip-path:polygon(46% 0,54% 0,100% 100%,0 100%);filter:blur(6px)"></div>`, `left:${x}px;top:-6px`));
      [[40, 830], [40, 720], [160, 830]].forEach(([x, y]) => capa(bg, ICO.llanta(150, '#3a3f47'), `left:${x}px;top:${y}px;opacity:.5`));
      const g = engranes([[1760, 210, 300, 14, rgba(p.a, .16), 9], [1580, 330, 190, 10, rgba(p.ink, .08), -14]]), k = carro(930, p.a, 14, 6);
      AMB.push((t) => { g(t); k(t); lamps.forEach((l, j) => { l.style.opacity = .82 + .18 * Math.sin(t * 2.3 + j * 2) * Math.sin(t * .7 + j); }); });
    } else if (DIR === 2) { // tablero de instrumentos con velocímetro y tacómetro de fondo
      bg.style.background = `radial-gradient(1400px 800px at 50% 110%,#1a1d22,${p.bg} 70%)`;
      const dial = (cx, cy, rr, lbl) => { const tk = Array.from({length: 41}, (_, j) => { const a = (-225 + j * 6.75) * Math.PI / 180, l = j % 5 ? 22 : 46; return `<path d="M${cx + Math.cos(a) * rr} ${cy + Math.sin(a) * rr}L${cx + Math.cos(a) * (rr - l)} ${cy + Math.sin(a) * (rr - l)}" stroke="${j > 32 ? p.a : rgba(p.ink, .5)}" stroke-width="${j % 5 ? 4 : 8}"/>`; }).join('');
        const e = capa(bg, `<svg width="1920" height="1080"><circle cx="${cx}" cy="${cy}" r="${rr + 26}" fill="none" stroke="${rgba(p.a, .35)}" stroke-width="6"/>${tk}<text x="${cx}" y="${cy + rr * .45}" text-anchor="middle" font-family="Rajdhani" font-weight="700" font-size="40" letter-spacing="8" fill="${rgba(p.ink, .4)}">${lbl}</text><g class="ag"><path d="M${cx - 8} ${cy}L${cx} ${cy - rr + 40}L${cx + 8} ${cy}Z" fill="${p.a}"/><circle cx="${cx}" cy="${cy}" r="30" fill="#22262c" stroke="${p.a}" stroke-width="5"/></g></svg>`, 'inset:0;opacity:.28');
        return e.querySelector('.ag'); };
      const a1 = dial(300, 700, 380, 'KM/H'), a2 = dial(1620, 700, 380, 'RPM ×1000');
      AMB.push((t) => { a1.setAttribute('transform', `rotate(${15 + Math.sin(t * .6) * 60} 300 700)`); a2.setAttribute('transform', `rotate(${-15 + Math.sin(t * .9 + 1) * 80} 1620 700)`); });
    } else if (DIR === 3) { // escáner: cuadrícula, silueta del auto que se dibuja y línea de escaneo
      bg.style.background = `linear-gradient(${rgba(p.a, .06)} 1px,transparent 1px) 0 0/48px 48px,linear-gradient(90deg,${rgba(p.a, .06)} 1px,transparent 1px) 0 0/48px 48px,radial-gradient(1200px 700px at 50% 55%,#13202d,${p.bg} 72%)`;
      const auto = linea(bg, 'M180 760C200 700 260 680 360 670L560 560C640 520 760 500 920 500C1080 500 1200 520 1300 580L1440 660C1560 670 1660 690 1720 730L1740 780L1700 820H1560A120 120 0 0 0 1320 820H660A120 120 0 0 0 420 820H220Z', rgba(p.a, .35), 4, 9);
      const sc = capa(bg, '', `left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,transparent,${p.c},transparent);box-shadow:0 0 30px ${p.c}`);
      AMB.push((t) => { auto(t); sc.style.transform = `translateY(${(t * 160) % 1080}px)`; });
    } else if (DIR === 4) {
      bg.style.background = p.bg; bg.appendChild(H.$('<div class="trama"></div>'));
    } else {
      bg.style.background = `radial-gradient(1200px 800px at 50% 0%,#1b1b1f,${p.bg} 70%)`;
      const f = H.$('<div class="fuga" style="left:-300px;top:-400px"></div>'); bg.appendChild(f);
      AMB.push((t) => { f.style.transform = `translate(${Math.sin(t * .2) * 600 + 700}px,${Math.cos(t * .15) * 200}px)`; f.style.opacity = .5 + .4 * Math.sin(t * .7); });
    }
  },
  // director 1: haces de luz de faros (en DJ eran láseres) y chispas
  rayos(c, H, inverso) {
    const {pal} = H;
    for (let i = 0; i < 4; i++) {
      const l = H.$(`<div class="abs" style="left:${260 + i * 440}px;top:-200px;width:240px;height:1700px;background:linear-gradient(${rgba(pal.c, .22)},transparent 70%);clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);transform-origin:50% 0;filter:blur(4px)"></div>`);
      c.cam.insertBefore(l, c.cam.firstChild);
      c.tl.fromTo(l, {rotation: (inverso ? 1 : -1) * (24 - i * 10)}, {rotation: (inverso ? -1 : 1) * (18 - i * 8), duration: c.D, ease: 'sine.inOut'}, 0);
    }
  },
  // director 3: la señal del sensor (gráfica de diagnóstico) en lugar de la onda de audio
  onda(c, o, H) {
    const {pal} = H, col = o.b ? pal.b : pal.a, w = o.w, h = o.h; let d = `M0 ${h / 2}`;
    for (let x = 0; x <= w; x += 24) d += `L${x} ${(h / 2 + Math.sin(x * .021 + (o.b ? 1 : 0)) * h * .32 + (x % 240 < 24 ? -h * .25 : 0)).toFixed(1)}`;
    const e = H.$(`<div class="abs" style="left:${o.x}px;top:${o.y}px;width:${w}px;height:${h}px"><svg width="${w}" height="${h}"><path d="M0 ${h / 2}H${w}" stroke="${rgba(col, .25)}" stroke-width="2" stroke-dasharray="6 8"/><path d="${d}" fill="none" stroke="${col}" stroke-width="5" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/></svg></div>`);
    (o.en || c.cam).appendChild(e);
    c.tl.fromTo(e.querySelectorAll('path')[1], {strokeDashoffset: 1}, {strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut'}, .3);
    return e;
  },
  chip: {bg: '#111', ink: '#fff', font: 'BarlowC', tt: 'uppercase'},
};

// ======================= CANTO (23 nov 2026) =======================
// Mundo hecho desde cero para el nicho de canto (regla V8: nada de DJ). Escenario con telón y focos, estudio de grabación con
// paneles acústicos y luz ON AIR, afinador de voz con aguja y línea de tono, cancionero con pentagramas y concierto con público.
// El objeto que gira del director 2 es la rejilla de un micrófono visto de frente (en DJ era el disco).
const CANTO = {
  nombres: ['Escenario', 'Estudio de grabación', 'Afinador', 'Cancionero', 'Concierto'],
  pal: [
    P('#0d0608', '#fff4ea', '#c9b3a6', '#e0263a', '#f5b83d', '#ffd97a', '#ffffff', 'rgba(255,255,255,.05)', 'rgba(224,38,58,.45)', 'rgba(224,38,58,.3)', 'Outfit', 800, 'Manrope', 'Manrope', 'none', '-.015em', '999px'),
    P('#120d0a', '#f7efe6', '#c7b8a8', '#ff3b3b', '#d9a24a', '#ffcf6b', '#120d0a', 'rgba(247,239,230,.06)', 'rgba(217,162,74,.42)', 'rgba(0,0,0,.6)', 'DMSerif', 400, 'DMSans', 'DMSans', 'none', '-.01em', '14px'),
    P('#0f1016', '#f2f3f8', '#9da1b3', '#ff4f8b', '#3ee0c2', '#ffd166', '#ffffff', '#1a1c26', '#2a2d3b', 'rgba(255,79,139,.25)', 'Unbounded', 700, 'Manrope', 'SpaceG', 'none', '-.02em', '12px'),
    P('#f7efe3', '#1c1412', '#3a2e2a', '#c8102e', '#1c1412', '#f2b632', '#ffffff', '#1c1412', '#1c1412', 'rgba(60,30,20,.3)', 'Fraunces', 800, 'DMSans', 'DMSans', 'none', '-.02em', '6px'),
    P('#0b0710', '#f7f0fb', '#c9bcd6', '#f5b83d', '#b0387a', '#ffe08a', '#0b0710', 'rgba(255,255,255,.06)', 'rgba(245,184,61,.45)', 'rgba(0,0,0,.6)', 'Instrument', 400, 'DMSans', 'DMSans', 'none', '-.01em', '6px'),
  ],
  musica: ['it-s-love', 'tears-of-joy', 'talent-in-the-air', 'expressive-courage', 'possible-dreams'],
  txt: {deck: (i) => 'PISTA ' + (i + 1), bpm: 'TONO · LA 440 HZ', error: (j) => 'NOTA ' + (j + 1), registro: 'ENSAYOS', biblioteca: 'MIS CANCIONES', nuevas: 'NUEVAS TÉCNICAS', desbloq: 'DOMINADAS', cert: 'CERTIFICADO.PDF', modulo: 'MÓDULO'},
  // director 4: cada escena es otra hoja del cancionero
  cartel: [['#f7efe3', '#1c1412', '#c8102e'], ['#c8102e', '#ffffff', '#f2b632'], ['#f2b632', '#1c1412', '#c8102e'], ['#1c1412', '#f7efe3', '#f2b632']],
  barras: ['#f7efe3', '#f2b632', '#c8102e'],
  css: `
body.mu-canto .trama{background-image:repeating-linear-gradient(180deg,transparent 0 60px,rgba(28,20,18,.17) 60px 62px,transparent 62px 80px,rgba(28,20,18,.17) 80px 82px,transparent 82px 100px,rgba(28,20,18,.17) 100px 102px,transparent 102px 120px,rgba(28,20,18,.17) 120px 122px,transparent 122px 140px,rgba(28,20,18,.17) 140px 142px,transparent 142px 220px);opacity:.95}
body.mu-canto .franja{height:96px;background:rgba(200,16,46,.88);background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.14) 0 14px,transparent 14px 34px);opacity:.95}
body.mu-canto .ui{background:#151722;border:2px solid #2a2d3b;border-radius:16px;box-shadow:0 30px 60px rgba(0,0,0,.4)}
body.mu-canto .ui .bar{background:#1b1e2b;border-bottom:2px solid #2a2d3b;color:#9da1b3;font-family:SpaceG}
body.mu-canto.d3 .fila{background:#1a1c26;border:2px solid #2a2d3b}
body.mu-canto .disco{background:radial-gradient(circle,rgba(255,255,255,.22) 0 1.6px,transparent 2.2px) 0 0/22px 22px,radial-gradient(circle,#3a3a40 0 60%,#1d1d21 100%);box-shadow:0 40px 120px rgba(0,0,0,.6),inset 0 0 0 22px #2a2a2e,inset 0 0 0 30px var(--b)}
body.mu-canto .disco::before{background:radial-gradient(closest-side at 35% 30%,rgba(255,255,255,.35),transparent 60%);mix-blend-mode:normal}
body.mu-canto .disco .lab{left:44%;top:44%;width:12%;height:12%;background:var(--a);font-size:0;box-shadow:0 0 30px var(--a)}
body.mu-canto .disco .lab::after{display:none}
body.mu-canto .fuga{background:radial-gradient(closest-side,rgba(224,38,58,.32),transparent 70%)}
body.mu-canto .cita b{font-family:Caveat;font-size:40px;letter-spacing:0}`,
  fondo(DIR, bg, AMB, H) {
    const {capa, linea, pal} = H, p = pal;
    // notas que suben despacio y se desvanecen (las usan varios directores)
    const notas = (lista, col) => { const ns = lista.map(([x, y, s, v, d]) => ({e: capa(bg, ICO.nota(s, col), `left:${x}px;top:${y}px`), x, y, v, d}));
      return (t) => ns.forEach((n) => { const f = ((t * n.v + n.d) % 1); n.e.style.transform = `translate(${Math.sin(t + n.d * 6) * 18}px,${-f * 260}px) rotate(${Math.sin(t * .8 + n.d) * 10}deg)`; n.e.style.opacity = String(Math.sin(f * Math.PI) * .5); }); };
    if (DIR === 1) { // escenario: telón rojo a los lados, focos que barren desde arriba y un círculo de luz en el piso
      bg.style.background = `radial-gradient(900px 260px at 50% 100%,${rgba(p.c, .22)},transparent 70%),linear-gradient(180deg,#14080b 0%,${p.bg} 60%,#050203 100%)`;
      const tel = (lado) => capa(bg, '', `${lado}:-30px;top:-20px;width:300px;height:1120px;background:repeating-linear-gradient(90deg,#6e0d1a 0 26px,#3c0710 26px 52px),linear-gradient(90deg,rgba(0,0,0,.4),transparent);box-shadow:inset ${lado === 'left' ? '-' : ''}60px 0 80px rgba(0,0,0,.6);transform-origin:50% 0`);
      const t1 = tel('left'), t2 = tel('right');
      capa(bg, '', `left:0;right:0;top:-10px;height:120px;background:repeating-linear-gradient(90deg,#7a0f1e 0 40px,#4a0812 40px 80px);clip-path:polygon(0 0,100% 0,100% 70%,95% 100%,90% 70%,85% 100%,80% 70%,75% 100%,70% 70%,65% 100%,60% 70%,55% 100%,50% 70%,45% 100%,40% 70%,35% 100%,30% 70%,25% 100%,20% 70%,15% 100%,10% 70%,5% 100%,0 70%)`);
      const focos = [520, 960, 1400].map((x, j) => capa(bg, '', `left:${x - 260}px;top:-60px;width:520px;height:1200px;background:linear-gradient(180deg,${rgba(j === 1 ? p.c : p.a, .2)},transparent 75%);clip-path:polygon(45% 0,55% 0,100% 100%,0 100%);transform-origin:50% 0;filter:blur(3px)`));
      const n = notas([[300, 760, 70, .09, .1], [1560, 700, 60, .07, .5], [880, 820, 50, .08, .8]], rgba(p.c, .9));
      AMB.push((t) => { focos.forEach((f, j) => { f.style.transform = `rotate(${Math.sin(t * .5 + j * 2) * 16}deg)`; }); t1.style.transform = `skewX(${Math.sin(t * .6) * 1.2}deg)`; t2.style.transform = `skewX(${-Math.sin(t * .6 + 1) * 1.2}deg)`; n(t); });
    } else if (DIR === 2) { // estudio de grabación: pared de madera, paneles acústicos, luz ON AIR, micrófono y audífonos
      bg.style.background = `repeating-linear-gradient(90deg,rgba(0,0,0,0) 0 64px,rgba(0,0,0,.22) 64px 68px),linear-gradient(180deg,#2a1b12,${p.bg} 70%)`;
      [[0, 140], [1690, 140], [0, 600], [1690, 600]].forEach(([x, y]) => capa(bg, '', `left:${x}px;top:${y}px;width:230px;height:380px;background:conic-gradient(from 45deg,#1b1b1f 25%,#26262b 0 50%,#1b1b1f 0 75%,#26262b 0) 0 0/46px 46px;box-shadow:inset 0 0 0 6px #111;opacity:.9`));
      const air = capa(bg, `<div style="padding:12px 26px;border-radius:10px;border:3px solid ${p.a};color:${p.a};font-family:SpaceG;font-weight:700;font-size:34px;letter-spacing:6px">● ON AIR</div>`, 'right:300px;top:60px');
      const mic = capa(bg, ICO.micro(380, p.b), 'left:330px;top:640px;transform-origin:50% 100%;filter:drop-shadow(0 20px 30px rgba(0,0,0,.6))');
      capa(bg, ICO.audifonos(220, p.a), 'left:1430px;top:860px;transform:rotate(-12deg);opacity:.85');
      AMB.push((t) => { const on = Math.sin(t * 2.2) > -.2; air.style.opacity = on ? '1' : '.45'; air.firstChild.style.boxShadow = on ? `0 0 40px ${rgba(p.a, .7)}` : 'none'; mic.style.transform = `rotate(${Math.sin(t * .7) * 2}deg)`; });
    } else if (DIR === 3) { // afinador de voz: cuadrícula, aguja que oscila sobre el arco y la línea de tono que se dibuja
      bg.style.background = `linear-gradient(${rgba(p.b, .05)} 1px,transparent 1px) 0 0/48px 48px,linear-gradient(90deg,${rgba(p.b, .05)} 1px,transparent 1px) 0 0/48px 48px,radial-gradient(1200px 700px at 50% 55%,#191b27,${p.bg} 72%)`;
      const cx = 1700, cy = 980, rr = 300;
      const tk = Array.from({length: 21}, (_, j) => { const a = (-160 + j * 7) * Math.PI / 180, l = j % 5 ? 20 : 40; return `<path d="M${cx + Math.cos(a) * rr} ${cy + Math.sin(a) * rr}L${cx + Math.cos(a) * (rr - l)} ${cy + Math.sin(a) * (rr - l)}" stroke="${j === 10 ? p.b : rgba(p.ink, .4)}" stroke-width="${j % 5 ? 3 : 6}"/>`; }).join('');
      const af = capa(bg, `<svg width="1920" height="1080">${tk}<text x="${cx - 120}" y="${cy - 120}" text-anchor="middle" font-family="SpaceG" font-weight="700" font-size="44" fill="${rgba(p.ink, .35)}">LA 440</text><g class="ag"><path d="M${cx - 6} ${cy}L${cx} ${cy - rr + 30}L${cx + 6} ${cy}Z" fill="${p.a}"/></g></svg>`, 'inset:0;opacity:.8');
      const ag = af.querySelector('.ag');
      let d = 'M-20 860'; [[160, 860], [160, 800], [420, 800], [420, 740], [700, 740], [700, 820], [980, 820], [980, 700], [1260, 700], [1260, 780]].forEach(([x, y]) => { d += `L${x} ${y}`; });
      const tono = linea(bg, d, rgba(p.a, .45), 10, 9);
      const n = notas([[220, 300, 60, .08, .2], [1500, 260, 54, .06, .6]], rgba(p.b, .9));
      AMB.push((t) => { ag.setAttribute('transform', `rotate(${-70 + Math.sin(t * 1.3) * 30 + Math.sin(t * 3.1) * 6} ${cx} ${cy})`); tono(t); n(t); });
    } else if (DIR === 4) { // hoja del cancionero con pentagramas (se ve detrás de las hojas de cada escena)
      bg.style.background = p.bg; bg.appendChild(H.$('<div class="trama"></div>'));
    } else { // concierto: escenario morado, haces de luz que barren, público y luces de celulares
      bg.style.background = `radial-gradient(1400px 800px at 50% 0%,#2a1236,${p.bg} 70%)`;
      const f = H.$('<div class="fuga" style="left:-300px;top:-400px"></div>'); bg.appendChild(f);
      const haz = [300, 760, 1160, 1620].map((x, j) => capa(bg, '', `left:${x - 200}px;top:-80px;width:400px;height:1200px;background:linear-gradient(180deg,${rgba(j % 2 ? p.b : p.a, .2)},transparent 72%);clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);transform-origin:50% 0;filter:blur(4px)`));
      let pub = ''; for (let x = -40; x < 1960; x += 70) { const h = 90 + ((x * 37) % 60); pub += `<ellipse cx="${x}" cy="${1080 - h + 30}" rx="30" ry="34" fill="#07040a"/><rect x="${x - 40}" y="${1080 - h + 52}" width="80" height="${h}" rx="30" fill="#07040a"/>`; }
      capa(bg, `<svg width="1920" height="1080">${pub}</svg>`, 'inset:0');
      const cel = Array.from({length: 26}, (_, j) => capa(bg, '', `left:${(j * 151) % 1880 + 20}px;top:${900 + (j * 53) % 120}px;width:8px;height:12px;border-radius:2px;background:#fff7d6;box-shadow:0 0 18px #fff3b0`));
      AMB.push((t) => { haz.forEach((h, j) => { h.style.transform = `rotate(${Math.sin(t * .45 + j * 1.7) * 22}deg)`; }); cel.forEach((c, j) => { c.style.opacity = String(.35 + .65 * Math.abs(Math.sin(t * 1.4 + j))); }); f.style.transform = `translate(${Math.sin(t * .2) * 600 + 700}px,${Math.cos(t * .15) * 200}px)`; f.style.opacity = .5 + .4 * Math.sin(t * .7); });
    }
  },
  // director 1: focos del escenario que cruzan desde las esquinas (en DJ eran láseres)
  rayos(c, H, inverso) {
    const {pal} = H;
    [[-120, 1], [2040, -1], [600, 1], [1320, -1]].forEach(([x, s], i) => {
      const l = H.$(`<div class="abs" style="left:${x - 160}px;top:-160px;width:320px;height:1600px;background:linear-gradient(${rgba(i % 2 ? pal.c : pal.a, .24)},transparent 72%);clip-path:polygon(42% 0,58% 0,100% 100%,0 100%);transform-origin:50% 0;filter:blur(5px)"></div>`);
      c.cam.insertBefore(l, c.cam.firstChild);
      c.tl.fromTo(l, {rotation: s * (inverso ? -1 : 1) * (32 - i * 6)}, {rotation: s * (inverso ? 1 : -1) * (14 - i * 3), duration: c.D, ease: 'sine.inOut'}, 0);
    });
  },
  // director 3: la línea de tono sobre un pentagrama (en DJ era la onda de audio)
  onda(c, o, H) {
    const {pal} = H, col = o.b ? pal.b : pal.a, w = o.w, h = o.h; let d = `M0 ${h * .7}`, x = 0, k = 0;
    while (x < w) { const y = h * (.2 + .6 * ((Math.sin(k * 1.7 + (o.b ? 2 : 0)) + 1) / 2)); d += `L${x} ${y.toFixed(1)}L${Math.min(w, x + 70)} ${y.toFixed(1)}`; x += 70; k++; }
    const pent = [0, 1, 2, 3, 4].map((j) => `<path d="M0 ${h * (.2 + j * .15)}H${w}" stroke="${rgba(col, .22)}" stroke-width="2"/>`).join('');
    const e = H.$(`<div class="abs" style="left:${o.x}px;top:${o.y}px;width:${w}px;height:${h}px"><svg width="${w}" height="${h}" style="overflow:visible">${pent}<path d="${d}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/></svg></div>`);
    (o.en || c.cam).appendChild(e);
    c.tl.fromTo(e.querySelectorAll('path')[5], {strokeDashoffset: 1}, {strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut'}, .3);
    return e;
  },
  chip: {bg: '#1c1412', ink: '#f7efe3', font: 'DMSans', tt: 'none'},
};

// ======================= AJEDREZ (24 nov 2026) =======================
// Mundo hecho desde cero para el nicho de ajedrez (regla V8: nada de DJ ni de otros nichos). Christian, 24 nov: «prepara los 5 videos».
// 1 Torneo: sala de torneo con tablero en perspectiva, focos y flechas de jugada. 2 Tablero de madera: mesa de nogal, piezas
// talladas y reloj de torneo; lo que gira es un tablero redondo (en DJ era el disco). 3 Análisis: programa de análisis con tablero
// verde, barra de evaluación y lista de jugadas. 4 Planilla: cada escena es otra planilla de anotación. 5 Gran maestro: fotos del
// curso con luz dorada y un rey gigante que se recorta.
const AJEDREZ = {
  nombres: ['Torneo', 'Tablero de madera', 'Análisis', 'Planilla', 'Gran maestro'],
  pal: [
    P('#0c1712', '#f4efe3', '#bdb6a5', '#d6b25e', '#e9e4d8', '#f3dc9c', '#0c1712', 'rgba(255,255,255,.05)', 'rgba(214,178,94,.45)', 'rgba(214,178,94,.28)', 'Montserrat', 800, 'Manrope', 'Manrope', 'none', '-.025em', '12px'),
    P('#1b120b', '#f6ead4', '#d4bd9b', '#e3a857', '#a5532a', '#f5d49a', '#1b120b', 'rgba(246,234,212,.06)', 'rgba(227,168,87,.45)', 'rgba(0,0,0,.6)', 'Playfair', 700, 'DMSans', 'DMSans', 'none', '-.01em', '999px'),
    P('#262421', '#f3f0ea', '#aaa59c', '#81b64c', '#e05252', '#f7c631', '#1b1a17', '#302e2b', '#45423d', 'rgba(0,0,0,.45)', 'Sora', 800, 'Manrope', 'Manrope', 'none', '-.03em', '8px'),
    P('#efede6', '#17140f', '#2e2a23', '#7d1d2c', '#17140f', '#b8902e', '#ffffff', '#17140f', '#17140f', 'rgba(40,30,20,.3)', 'Epilogue', 900, 'DMSans', 'DMSans', 'uppercase', '-.02em', '2px'),
    P('#070605', '#f7f1e6', '#d6ccbb', '#c9a227', '#8c1c2b', '#f1dd9a', '#0e0b06', 'rgba(255,255,255,.06)', 'rgba(201,162,39,.45)', 'rgba(0,0,0,.6)', 'Fraunces', 500, 'Manrope', 'Manrope', 'none', '-.02em', '6px'),
  ],
  musica: ['close-up', 'special-days', 'digital-clouds', 'pop-track-03', 'romantic-getaway'],
  txt: {deck: (i) => 'PARTIDA ' + (i + 1), bpm: 'EVALUACIÓN +1.4', error: (j) => 'ERROR ?? ' + (j + 1), registro: 'MIS PARTIDAS', biblioteca: 'MI REPERTORIO', nuevas: 'TU NUEVO NIVEL', desbloq: 'LOGRADAS', cert: 'CERTIFICADO.PDF', modulo: 'MÓDULO'},
  // director 4: cada escena es otra planilla (papel, tinta, granate, oro)
  cartel: [['#efede6', '#17140f', '#7d1d2c'], ['#17140f', '#efede6', '#d9b44a'], ['#7d1d2c', '#ffffff', '#f1d27a'], ['#d9b44a', '#17140f', '#17140f']],
  barras: ['#17140f', '#efede6', '#7d1d2c'],
  css: `
body.mu-ajedrez .trama{background-image:repeating-linear-gradient(180deg,transparent 0 70px,rgba(23,20,15,.16) 70px 72px),linear-gradient(90deg,transparent 0 150px,rgba(125,29,44,.38) 150px 153px,transparent 153px 1010px,rgba(23,20,15,.16) 1010px 1012px,transparent 1012px);opacity:.9}
body.mu-ajedrez .franja{height:96px;background:conic-gradient(#17140f 25%,#efede6 0 50%,#17140f 0 75%,#efede6 0) 0 0/96px 96px;opacity:.95}
body.mu-ajedrez .ui{background:#302e2b;border:2px solid #45423d;border-radius:12px;box-shadow:0 30px 70px rgba(0,0,0,.45)}
body.mu-ajedrez .ui .bar{background:#3a3835;border-bottom:2px solid #45423d;color:#bdb8ae;font-family:Manrope;font-weight:800}
body.mu-ajedrez .ui .bar b{color:#81b64c}
body.mu-ajedrez.d3 .fila{background:#2b2926;border:2px solid #45423d}
body.mu-ajedrez .disco{background:radial-gradient(circle,transparent 0 69%,#5a3418 70% 76%,#2a170a 77% 100%),conic-gradient(#ead2a6 25%,#7b4a25 0 50%,#ead2a6 0 75%,#7b4a25 0) 50% 50%/25% 25%;box-shadow:0 40px 120px rgba(0,0,0,.6),inset 0 0 0 10px #1c0f06}
body.mu-ajedrez .disco::before{background:radial-gradient(closest-side at 35% 30%,rgba(255,240,210,.28),transparent 60%);mix-blend-mode:normal}
body.mu-ajedrez .disco .lab{left:36%;top:36%;width:28%;height:28%;background:#1c0f06;color:#f5d49a;font-family:Playfair;font-weight:700;box-shadow:0 0 0 8px #e3a857,0 20px 40px rgba(0,0,0,.5)}
body.mu-ajedrez .disco .lab::after{display:none}
body.mu-ajedrez .fuga{background:radial-gradient(closest-side,rgba(201,162,39,.32),transparent 70%)}
body.mu-ajedrez .cita b{font-family:Manrope;letter-spacing:.04em}
body.mu-ajedrez.d5 .T .k .wi{font-family:Playfair;padding-right:.16em;margin-right:-.12em}`,
  fondo(DIR, bg, AMB, H) {
    const {capa, linea, pal} = H, p = pal;
    // piezas que flotan despacio (las usan varios directores)
    const piezas = (lista) => { const ps = lista.map(([t, x, y, s, col, op, des]) => ({e: capa(bg, ICO.pieza(t, s, col), `left:${x}px;top:${y}px;opacity:${op};transform-origin:50% 100%`), des}));
      return (tt) => ps.forEach((q) => { q.e.style.transform = `translateY(${Math.sin(tt * .5 + q.des) * 12}px) rotate(${Math.sin(tt * .35 + q.des) * 1.5}deg)`; }); };
    if (DIR === 1) { // sala de torneo: tablero en perspectiva que avanza, focos dorados, rey y dama a los lados
      bg.style.background = `radial-gradient(1100px 600px at 50% 0%,${rgba(p.a, .18)},transparent 70%),linear-gradient(180deg,#09120e 0%,${p.bg} 55%,#050b08 100%)`;
      const piso = capa(bg, '', `left:-1200px;right:-1200px;top:560px;height:1400px;background:conic-gradient(${rgba(p.b, .2)} 25%,rgba(0,0,0,.25) 0 50%,${rgba(p.b, .2)} 0 75%,rgba(0,0,0,.25) 0) 0 0/240px 240px;transform:perspective(900px) rotateX(64deg);transform-origin:50% 0;-webkit-mask:linear-gradient(180deg,transparent,#000 35%);mask:linear-gradient(180deg,transparent,#000 35%)`);
      const focos = [420, 960, 1500].map((x, j) => capa(bg, '', `left:${x - 230}px;top:-60px;width:460px;height:1200px;background:linear-gradient(180deg,${rgba(j === 1 ? p.c : p.a, .16)},transparent 72%);clip-path:polygon(45% 0,55% 0,100% 100%,0 100%);transform-origin:50% 0;filter:blur(4px)`));
      const pz = piezas([['rey', -30, 420, 560, rgba(p.a, .13), 1, 0], ['dama', 1660, 470, 500, rgba(p.b, .1), 1, 2], ['caballo', 230, 700, 300, rgba(p.b, .08), 1, 4], ['torre', 1520, 780, 260, rgba(p.a, .1), 1, 1]]);
      AMB.push((t) => { piso.style.backgroundPosition = `0 ${(t * 60) % 240}px`; focos.forEach((f, j) => { f.style.transform = `rotate(${Math.sin(t * .4 + j * 2) * 12}deg)`; f.style.opacity = String(.75 + .25 * Math.sin(t * 1.3 + j)); }); pz(t); });
    } else if (DIR === 2) { // mesa de nogal: esquina de un tablero de madera, piezas talladas, reloj de torneo y luz cálida
      bg.style.background = `repeating-linear-gradient(176deg,rgba(0,0,0,0) 0 36px,rgba(0,0,0,.18) 36px 39px,rgba(0,0,0,0) 39px 90px),radial-gradient(1300px 900px at 30% 40%,${rgba(p.a, .2)},transparent 65%),${p.bg}`;
      capa(bg, ICO.tablero(900, '#d9bb8b', '#6e4021'), 'left:-260px;top:520px;transform:rotate(-14deg);opacity:.32;filter:blur(1.5px);box-shadow:0 0 0 22px #3a210f');
      const pz = piezas([['caballo', 140, 300, 260, '#e9d3a8', .35, 0], ['peon', 420, 420, 170, '#2a170a', .5, 1.5], ['alfil', 1700, 120, 240, '#e9d3a8', .22, 3]]);
      const rl = capa(bg, ICO.reloj(360, '#2a170a', '#f3e6cc'), 'left:1500px;top:780px;opacity:.75;filter:drop-shadow(0 20px 30px rgba(0,0,0,.5))');
      const a1 = rl.querySelector('.ag1'), a2 = rl.querySelector('.ag2');
      AMB.push((t) => { pz(t); a1.style.transform = `rotate(${t * 36}deg)`; a2.style.transform = `rotate(${(t * 6) % 360}deg)`; });
    } else if (DIR === 3) { // programa de análisis: tablero verde con coordenadas, barra de evaluación y la lista de jugadas
      bg.style.background = `radial-gradient(1200px 800px at 50% 50%,#2c2a27,${p.bg} 75%)`;
      capa(bg, ICO.tablero(760, '#eeeed2', '#769656', true), 'left:-120px;top:160px;opacity:.16;transform:rotate(-6deg)');
      const ev = capa(bg, `<div class="bl" style="position:absolute;left:0;right:0;bottom:0;height:50%;background:#f3f0ea"></div><div style="position:absolute;left:0;right:0;top:50%;height:3px;background:${p.c}"></div>`, 'left:18px;top:60px;width:34px;height:960px;border-radius:6px;overflow:hidden;background:#3c3a37;opacity:.6');
      const bl = ev.querySelector('.bl');
      const J = ['1. e4 e5', '2. Cf3 Cc6', '3. Ab5 a6', '4. Aa4 Cf6', '5. O-O Ae7', '6. Te1 b5', '7. Ab3 d6', '8. c3 O-O', '9. h3 Ca5', '10. Ac2 c5', '11. d4 Dc7', '12. Cbd2 Ad7', '13. Cf1 Tac8', '14. Ce3 cxd4'];
      const lista = capa(bg, J.concat(J).map((x, j) => `<div style="height:58px;font-family:Manrope;font-weight:700;font-size:30px;color:${j % 7 === 3 ? p.a : 'rgba(243,240,234,.5)'}">${x}</div>`).join(''), 'right:40px;top:0;width:300px;opacity:.35');
      const fl = linea(bg, 'M240 860L380 720L520 580', rgba(p.a, .55), 18, 7);
      const f2 = linea(bg, 'M520 900V760H600', rgba(p.c, .5), 18, 9, 3);
      AMB.push((t) => { bl.style.height = (50 + Math.sin(t * .6) * 14 + Math.sin(t * 1.7) * 4) + '%'; lista.style.transform = `translateY(${-((t * 30) % (J.length * 58))}px)`; fl(t); f2(t); });
    } else if (DIR === 4) { // planilla de anotación (se ve detrás de las hojas de cada escena)
      bg.style.background = p.bg; bg.appendChild(H.$('<div class="trama"></div>'));
    } else { // gran maestro: penumbra dorada, un rey gigante que se recorta y luz que barre
      bg.style.background = `radial-gradient(1400px 900px at 70% 30%,#1c160c,${p.bg} 70%)`;
      const f = H.$('<div class="fuga" style="left:-300px;top:-400px"></div>'); bg.appendChild(f);
      const rey = capa(bg, ICO.pieza('rey', 1150, rgba(p.a, .07), rgba(p.a, .22)), 'left:1260px;top:40px');
      const pz = piezas([['dama', 40, 640, 380, rgba(p.c, .06), 1, 1], ['peon', 330, 860, 200, rgba(p.c, .05), 1, 3]]);
      AMB.push((t) => { f.style.transform = `translate(${Math.sin(t * .2) * 600 + 700}px,${Math.cos(t * .15) * 200}px)`; f.style.opacity = .5 + .4 * Math.sin(t * .7); rey.style.transform = `translateY(${Math.sin(t * .3) * 18}px)`; pz(t); });
    }
  },
  // director 1: flechas de jugada que se trazan detrás del texto (diagonal de alfil, salto de caballo, columna de torre)
  rayos(c, H, inverso) {
    const {pal} = H, R = [['M120 1000L620 500L1000 120', pal.a], ['M1780 980V560H1560', pal.b], ['M1500 120L1860 480', pal.c], ['M380 120V560H160', pal.b]];
    R.forEach(([d, col], i) => {
      const e = H.$(`<svg class="abs" width="1920" height="1080" style="left:0;top:0;overflow:visible"><defs><marker id="pu${i}" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="3.2" markerHeight="3.2" orient="auto"><path d="M0 0L10 5L0 10Z" fill="${rgba(col, .4)}"/></marker></defs><path d="${d}" fill="none" stroke="${rgba(col, .26)}" stroke-width="${26 - i * 3}" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#pu${i})" pathLength="1" stroke-dasharray="1 1"/></svg>`);
      c.cam.insertBefore(e, c.cam.firstChild);
      c.tl.fromTo(e.querySelector('path:last-child'), {strokeDashoffset: inverso ? -1 : 1}, {strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut'}, .05 + i * .2);
    });
  },
  // director 3: la gráfica de evaluación de la partida (en DJ era la onda de audio)
  onda(c, o, H) {
    const {pal} = H, w = o.w, h = o.h, m = h / 2; let d = `M0 ${m}`;
    for (let x = 0; x <= w; x += 20) d += `L${x} ${(m - (Math.sin(x * .006 + (o.b ? 2 : 0)) * .55 + Math.sin(x * .021) * .2 + x / w * .35) * h * .42).toFixed(1)}`;
    const e = H.$(`<div class="abs" style="left:${o.x}px;top:${o.y}px;width:${w}px;height:${h}px"><svg width="${w}" height="${h}" style="overflow:visible"><path d="M0 ${m}H${w}" stroke="${rgba(pal.ink, .3)}" stroke-width="2"/><path d="${d}L${w} ${m}Z" fill="${rgba('#f3f0ea', .14)}"/><path d="${d}" fill="none" stroke="${o.b ? pal.c : pal.a}" stroke-width="5" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/></svg></div>`);
    (o.en || c.cam).appendChild(e);
    c.tl.fromTo(e.querySelectorAll('path')[2], {strokeDashoffset: 1}, {strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut'}, .3);
    c.tl.from(e.querySelectorAll('path')[1], {autoAlpha: 0, duration: .8}, 1.1);
    return e;
  },
  chip: {bg: '#17140f', ink: '#efede6', font: 'Manrope', tt: 'none'},
};

// ======================= LEGAL (24 nov 2026) =======================
// Christian (23 nov, Abogados): «no están bien los diseños de los videos ya que tienen diseño de DJ… tienes que crear el video por
// completo respecto al nicho, no te bases en ningún video anterior». Mundo hecho desde cero para Derecho: vino/burdeos, dorado y
// crema; letras serif clásicas con Montserrat para leer; tribunal con columnas y mazo que golpea, biblioteca jurídica con lomos de
// libros, expediente en papel con sello que se estampa y firma que se traza, contrato con sellos y despacho con la balanza.
// Nada de láseres, vinilos, ondas de audio ni ecualizadores. Música seria: metales y cuerdas, nada electrónico.
const LEGAL = {
  nombres: ['Tribunal', 'Biblioteca jurídica', 'Expediente', 'Contrato', 'Despacho'],
  pal: [
    P('#150a0c', '#f6efe3', '#cdbfae', '#c9a24a', '#8e1b2c', '#f0d58c', '#150a0c', 'rgba(246,239,227,.06)', 'rgba(201,162,74,.45)', 'rgba(0,0,0,.6)', 'Playfair', 800, 'Montserrat', 'Montserrat', 'none', '-.01em', '8px'),
    P('#0e1611', '#f3ecdd', '#c3baa6', '#d4af5a', '#7a1a2a', '#ecd28e', '#0e1611', 'rgba(243,236,221,.06)', 'rgba(212,175,90,.42)', 'rgba(0,0,0,.6)', 'DMSerif', 400, 'Montserrat', 'Montserrat', 'none', '0', '999px'),
    P('#f2ebdd', '#1e1a17', '#4a423a', '#7a1428', '#1f3b5c', '#b8892e', '#ffffff', '#fffaf0', 'rgba(122,20,40,.32)', 'rgba(60,40,20,.25)', 'Fraunces', 700, 'Montserrat', 'Montserrat', 'none', '-.015em', '6px'),
    P('#5a0f1e', '#f7f0e3', '#ead9c0', '#d9b45a', '#f7f0e3', '#ffffff', '#ffffff', '#2a070e', '#d9b45a', 'rgba(0,0,0,.45)', 'Playfair', 800, 'Montserrat', 'Montserrat', 'uppercase', '.005em', '2px'),
    P('#0b0c12', '#f5efe4', '#c9c0b2', '#e0bd6e', '#8a2433', '#f3dc9c', '#0b0c12', 'rgba(255,255,255,.06)', 'rgba(224,189,110,.45)', 'rgba(0,0,0,.6)', 'Instrument', 400, 'Montserrat', 'Montserrat', 'none', '-.01em', '6px'),
  ],
  musica: ['welcome-to-the-games', 'a-new-life', 'golden-storm', 'epical-drums-05', 'motivating-mornings'],
  txt: {deck: (i) => 'TOMO ' + ['I', 'II', 'III', 'IV', 'V', 'VI'][i % 6], bpm: 'AUDIENCIA · 10:00 H', error: (j) => 'PENDIENTE ' + (j + 1), registro: 'EXPEDIENTE', biblioteca: 'MI BIBLIOTECA JURÍDICA', nuevas: 'NUEVAS COMPETENCIAS', desbloq: 'DOMINADAS', cert: 'CERTIFICADO.PDF', modulo: 'MÓDULO'},
  // director 4: cada escena es otra hoja del contrato (papel, vino, oro y tinta)
  cartel: [['#f4ecdc', '#3a0a14', '#7a1428'], ['#5a0f1e', '#f7f0e3', '#d9b45a'], ['#d9b45a', '#2a070e', '#5a0f1e'], ['#1b1a22', '#f4ecdc', '#d9b45a']],
  barras: ['#f4ecdc', '#d9b45a', '#5a0f1e'],
  css: `
body.mu-legal .trama{background-image:linear-gradient(90deg,transparent 0 140px,rgba(122,20,40,.55) 140px 143px,transparent 143px 150px,rgba(122,20,40,.55) 150px 153px,transparent 153px),repeating-linear-gradient(180deg,transparent 0 58px,rgba(58,10,20,.12) 58px 60px);opacity:.9}
body.mu-legal .franja{height:96px;background:linear-gradient(180deg,#d9b45a 0 6px,#5a0f1e 6px calc(100% - 6px),#d9b45a calc(100% - 6px));opacity:.95}
body.mu-legal .ui{background:#fffaf0;border:2px solid rgba(122,20,40,.28);border-radius:6px;box-shadow:0 30px 60px rgba(60,40,20,.25)}
body.mu-legal .ui .bar{background:#7a1428;border-bottom:3px solid #b8892e;color:#f4ecdc;font-family:Montserrat;letter-spacing:.12em}
body.mu-legal .ui .bar b{color:#f0d58c}
body.mu-legal.d3 .fila{background:#ffffff;border:2px solid rgba(122,20,40,.18);color:#1e1a17}
body.mu-legal .disco{background:radial-gradient(circle at 38% 32%,#f6e3a6 0,#d4af5a 34%,#9b7a32 70%,#6d5420 100%);box-shadow:0 40px 120px rgba(0,0,0,.65),inset 0 0 0 16px rgba(110,84,32,.85),inset 0 0 0 22px #e8c877,inset 0 0 0 30px rgba(110,84,32,.6)}
body.mu-legal .disco::before{background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.16) 0 2deg,transparent 2deg 6deg);-webkit-mask:radial-gradient(circle,transparent 0 62%,#000 63% 72%,transparent 73%);mask:radial-gradient(circle,transparent 0 62%,#000 63% 72%,transparent 73%)}
body.mu-legal .disco .lab{left:30%;top:30%;width:40%;height:40%;background:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><g fill='none' stroke='%23f0d58c' stroke-width='3.5' stroke-linecap='round' stroke-linejoin='round'><path d='M50 22v54M30 30h40M30 30l-9 20h18zM70 30l-9 20h18zM38 78h24'/></g><circle cx='50' cy='20' r='4' fill='%23f0d58c'/></svg>\") center/62% no-repeat,#7a1a2a;color:transparent;font-size:0;box-shadow:inset 0 0 0 6px #d4af5a,0 0 0 4px rgba(0,0,0,.25)}
body.mu-legal .disco .lab::after{display:none}
body.mu-legal .fuga{background:radial-gradient(closest-side,rgba(224,189,110,.3),transparent 70%)}
body.mu-legal .cita b{font-family:Playfair;font-style:italic;font-size:40px;letter-spacing:0}`,
  fondo(DIR, bg, AMB, H) {
    const {capa, linea, pal} = H, p = pal;
    if (DIR === 1) { // tribunal: madera oscura, columnas, ventanales con luz, estrado con el mazo que golpea
      bg.style.background = `repeating-linear-gradient(90deg,rgba(0,0,0,0) 0 118px,rgba(0,0,0,.28) 118px 122px),linear-gradient(180deg,#2a1510 0%,${p.bg} 62%,#070304 100%)`;
      const ven = [430, 960, 1490].map((x) => capa(bg, `<div style="position:absolute;left:-110px;top:0;width:220px;height:330px;border-radius:110px 110px 0 0;background:linear-gradient(180deg,${rgba(p.c, .28)},${rgba(p.c, .06)});box-shadow:inset 0 0 0 10px rgba(0,0,0,.35)"></div><div style="position:absolute;left:-4px;top:0;width:8px;height:330px;background:rgba(0,0,0,.35)"></div><div style="position:absolute;left:-110px;top:150px;width:220px;height:8px;background:rgba(0,0,0,.35)"></div><div style="position:absolute;left:-260px;top:300px;width:520px;height:900px;background:linear-gradient(180deg,${rgba(p.c, .16)},transparent 75%);clip-path:polygon(28% 0,72% 0,100% 100%,0 100%);filter:blur(8px)"></div>`, `left:${x}px;top:40px`));
      capa(bg, ICO.columna(760, '#3a2418', 'rgba(0,0,0,.35)'), 'left:-20px;top:330px;opacity:.9');
      capa(bg, ICO.columna(760, '#3a2418', 'rgba(0,0,0,.35)'), 'left:1712px;top:330px;opacity:.9');
      capa(bg, '', `left:0;right:0;top:930px;height:150px;background:linear-gradient(180deg,#3a1f14,#1a0c08);border-top:6px solid ${rgba(p.a, .6)}`);
      capa(bg, ICO.bloque(200, '#4a2a1a', p.a), 'left:1700px;top:922px');  // en la esquina: no tapa textos (24 nov)
      const mz = capa(bg, ICO.mazo(130, '#5b3420', p.a), 'left:1790px;top:782px;transform-origin:65px 162px');
      const pol = Array.from({length: 18}, (_, j) => capa(bg, '', `left:${(j * 113) % 1880 + 20}px;top:${(j * 271) % 900 + 60}px;width:4px;height:4px;border-radius:50%;background:${rgba(p.c, .7)};filter:blur(.5px)`));
      AMB.push((t) => { const f = (t % 4) / 4, g = f < .08 ? -32 * (f / .08) : f < .14 ? -32 + 32 * ((f - .08) / .06) : 0; mz.style.transform = `rotate(${-58 + g}deg)`;
        ven.forEach((v, j) => { v.style.opacity = String(.85 + .15 * Math.sin(t * .6 + j)); });
        pol.forEach((d, j) => { d.style.transform = `translate(${Math.sin(t * .3 + j) * 30}px,${((t * 14 + j * 40) % 200) - 100}px)`; d.style.opacity = String(.25 + .35 * Math.sin(t + j)); }); });
    } else if (DIR === 2) { // biblioteca jurídica: estantes con lomos de libros de derecho y una lámpara cálida
      bg.style.background = `radial-gradient(1100px 700px at 50% 45%,${rgba(p.c, .14)},transparent 70%),linear-gradient(180deg,#14100c,${p.bg} 55%,#060806)`;
      const cols = ['#5a0f1e', '#1f3b2a', '#1f2e4a', '#4a2a16', '#6b1424', '#2a2a2a'];
      const estante = (y, sem) => { let x = 0, s = ''; let k = sem; while (x < 1920) { const w = 34 + (k * 17) % 30, h = 150 + (k * 29) % 60, c = cols[k % cols.length];
          s += `<rect x="${x}" y="${190 - h}" width="${w}" height="${h}" rx="3" fill="${c}"/><rect x="${x + 4}" y="${190 - h + 18}" width="${w - 8}" height="6" fill="${rgba(p.a, .75)}"/><rect x="${x + 4}" y="${190 - h + 34}" width="${w - 8}" height="3" fill="${rgba(p.a, .55)}"/><rect x="${x + 4}" y="${170}" width="${w - 8}" height="4" fill="${rgba(p.a, .5)}"/>`; x += w + 3; k++; }
        return capa(bg, `<svg width="1920" height="210">${s}<rect x="0" y="190" width="1920" height="20" fill="#2b1a10"/></svg>`, `left:0;top:${y}px;opacity:.55`); };
      const e1 = estante(-30, 1), e2 = estante(890, 4);
      const lam = capa(bg, '', `left:660px;top:120px;width:600px;height:600px;border-radius:50%;background:radial-gradient(closest-side,${rgba(p.c, .28)},transparent 70%)`);
      AMB.push((t) => { e1.style.transform = `translateX(${Math.sin(t * .12) * 30 - 30}px)`; e2.style.transform = `translateX(${-Math.sin(t * .12) * 30 - 30}px)`; lam.style.opacity = String(.8 + .2 * Math.sin(t * 1.1)); });
    } else if (DIR === 3) { // expediente: escritorio de papel, carpetas, pluma que firma y sello que se estampa
      bg.style.background = `linear-gradient(${rgba(p.a, .05)} 1px,transparent 1px) 0 0/100% 56px,radial-gradient(1300px 800px at 50% 50%,#fbf6ea,${p.bg} 75%)`;
      capa(bg, ICO.carpeta(300, '#c9a86a', '#fffaf0'), 'left:-60px;top:40px;transform:rotate(-9deg);opacity:.75');
      capa(bg, ICO.carpeta(220, '#1f3b5c', '#fffaf0'), 'left:1720px;top:40px;transform:rotate(-6deg);opacity:.6');
      const pl = capa(bg, ICO.pluma(380, '#1e1a17', p.c), 'left:1500px;top:960px;transform:rotate(-14deg);opacity:.8');
      const firma = linea(bg, 'M1240 1030c30-70 60-90 70-60s-30 70-10 60 40-70 70-50-10 50 20 40 50-40 80-30', rgba('#1e1a17', .4), 4, 8, 2);
      const se = capa(bg, ICO.sello(150, '#8e1b2c', '#f0d58c'), 'left:50px;top:880px;filter:drop-shadow(0 10px 14px rgba(60,20,10,.35))');
      AMB.push((t) => { firma(t); pl.style.transform = `rotate(${-14 + Math.sin(t * .8) * 3}deg) translateX(${Math.sin(t * .5) * 14}px)`;
        const f = (t % 5) / 5; se.style.transform = f < .06 ? `scale(${1.6 - f / .06 * .6})` : 'scale(1)'; se.style.opacity = f < .02 ? '0' : '1'; });
    } else if (DIR === 4) { // hoja del contrato (se ve detrás de las hojas de cada escena)
      bg.style.background = p.bg; bg.appendChild(H.$('<div class="trama"></div>'));
    } else { // despacho de noche: ventanal, la balanza grande que se equilibra y una luz dorada que recorre
      bg.style.background = `radial-gradient(1400px 900px at 50% 0%,#1b1c26,${p.bg} 70%)`;
      capa(bg, '', `left:160px;top:60px;width:560px;height:700px;background:linear-gradient(90deg,transparent 0 268px,rgba(0,0,0,.5) 268px 292px,transparent 292px),linear-gradient(180deg,transparent 0 338px,rgba(0,0,0,.5) 338px 362px,transparent 362px),linear-gradient(180deg,#1c2a44,#10131c);box-shadow:inset 0 0 0 16px #2a1a14;opacity:.55`);
      const f = H.$('<div class="fuga" style="left:-300px;top:-400px"></div>'); bg.appendChild(f);
      const bz = capa(bg, ICO.balanza(760, rgba(p.a, .28), rgba(p.a, .22)), 'left:1100px;top:250px');
      const br = bz.querySelector('.brazo'), pi = bz.querySelector('.pi'), pd = bz.querySelector('.pd');
      AMB.push((t) => { const a = Math.sin(t * .6) * 8; br.style.transform = `rotate(${a}deg)`; pi.style.transform = `rotate(${-a}deg)`; pi.style.transformOrigin = '14px 40px'; pd.style.transform = `rotate(${-a}deg)`; pd.style.transformOrigin = '186px 40px';
        f.style.transform = `translate(${Math.sin(t * .2) * 600 + 700}px,${Math.cos(t * .15) * 200}px)`; f.style.opacity = .5 + .4 * Math.sin(t * .7); });
    }
  },
  // director 1: haces de luz de los ventanales del tribunal (en DJ eran láseres)
  rayos(c, H, inverso) {
    const {pal} = H;
    [[300, 1], [960, -1], [1620, 1]].forEach(([x, s], i) => {
      const l = H.$(`<div class="abs" style="left:${x - 230}px;top:-120px;width:460px;height:1500px;background:linear-gradient(${rgba(i === 1 ? pal.c : pal.a, .2)},transparent 70%);clip-path:polygon(36% 0,64% 0,100% 100%,0 100%);transform-origin:50% 0;filter:blur(6px)"></div>`);
      c.cam.insertBefore(l, c.cam.firstChild);
      c.tl.fromTo(l, {rotation: s * (inverso ? -1 : 1) * (14 - i * 3), opacity: 0}, {rotation: s * (inverso ? 1 : -1) * 6, opacity: 1, duration: c.D, ease: 'sine.inOut'}, 0);
    });
  },
  // director 3: una firma que se traza sobre la línea del documento (en DJ era la onda de audio)
  onda(c, o, H) {
    const {pal} = H, col = o.b ? pal.b : pal.a, w = o.w, h = o.h; let d = `M10 ${h * .62}`, x = 10, k = 0;
    while (x < w * .62) { const dx = 46 + (k * 13) % 30; d += `c${dx * .3} ${-h * (.42 + (k % 3) * .08)} ${dx * .7} ${-h * .1} ${dx * .45} ${h * .18}s${dx * .2} ${h * .22} ${dx * .55} ${-h * .12}`; x += dx; k++; }
    const e = H.$(`<div class="abs" style="left:${o.x}px;top:${o.y}px;width:${w}px;height:${h}px"><svg width="${w}" height="${h}" style="overflow:visible"><path d="M0 ${h * .82}H${w}" stroke="${rgba(col, .35)}" stroke-width="2" stroke-dasharray="4 8"/><path d="${d}" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/></svg></div>`);
    (o.en || c.cam).appendChild(e);
    c.tl.fromTo(e.querySelectorAll('path')[1], {strokeDashoffset: 1}, {strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut'}, .3);
    return e;
  },
  chip: {bg: '#5a0f1e', ink: '#f4ecdc', font: 'Montserrat', tt: 'uppercase'},
};

// ======================= BEBÉS · RECETAS PARA BEBÉS (25 nov 2026) =======================
// Mundo hecho desde cero para el nicho de alimentación y recetas para bebés (regla V8: nada de DJ ni de otros nichos).
// Christian (22 nov): «cálido, tierno, familiar; biberones, platos de silicona, peluches, comida de bebé; colores suaves;
// sobre todo recetas, preparación y nutrición infantil». 1 Cocina de papillas: pared de azulejos pastel, vapor que sube de un
// tazón, cuchara y biberón. 2 Hora de comer: cuarto del bebé con lunares y nubes; lo que gira es un plato de silicona con
// compartimentos (en DJ era el disco). 3 Mi menú: noche en el cuarto, estrellas, ventanas de un planificador de comidas y la
// curva de crecimiento (en DJ era la onda de audio). 4 Recetario: cada escena es otra tarjeta de receta sobre un mantel de
// cuadritos. 5 Álbum familiar: fotos del curso con bordes de álbum, luz cálida y corazones que flotan.
ICO.biberon = (s, col, tapa) => svg(s * .46, s, `<path d="M40 8h20l4 16H36z" fill="${tapa}"/><rect x="28" y="22" width="44" height="18" rx="6" fill="${col}"/><rect x="22" y="38" width="56" height="110" rx="20" fill="rgba(255,255,255,.92)" stroke="${col}" stroke-width="4"/><rect x="26" y="88" width="48" height="56" rx="14" fill="#fff6dc"/>${[60, 76, 92, 108, 124].map((y) => `<path d="M24 ${y}h12" stroke="${col}" stroke-width="3"/>`).join('')}`, '', '0 0 100 156');
ICO.cuchara = (s, col) => svg(s, s * .22, `<ellipse cx="34" cy="22" rx="32" ry="20" fill="${col}"/><ellipse cx="30" cy="18" rx="16" ry="8" fill="rgba(255,255,255,.4)"/><path d="M64 20L208 14Q218 14 218 22T208 30L64 24Z" fill="${col}"/>`, '', '0 0 220 44');
ICO.plato = (s, a, b, c, borde) => svg(s, s, `<circle cx="100" cy="100" r="96" fill="${borde}"/><circle cx="100" cy="100" r="80" fill="#fffaf3"/><path d="M100 100V22A78 78 0 0 1 167.5 139Z" fill="${a}" opacity=".85"/><path d="M100 100L167.5 139A78 78 0 0 1 32.5 139Z" fill="${b}" opacity=".85"/><path d="M100 100L32.5 139A78 78 0 0 1 100 22Z" fill="${c}" opacity=".85"/><path d="M100 100V20M100 100L170 140M100 100L30 140" stroke="${borde}" stroke-width="7"/>`, '', '0 0 200 200');
ICO.osito = (s, col, claro) => svg(s, s, `<circle cx="42" cy="38" r="22" fill="${col}"/><circle cx="158" cy="38" r="22" fill="${col}"/><circle cx="42" cy="38" r="11" fill="${claro}"/><circle cx="158" cy="38" r="11" fill="${claro}"/><circle cx="100" cy="92" r="66" fill="${col}"/><ellipse cx="100" cy="118" rx="30" ry="24" fill="${claro}"/><circle cx="76" cy="84" r="7" fill="#3a2a22"/><circle cx="124" cy="84" r="7" fill="#3a2a22"/><ellipse cx="100" cy="108" rx="10" ry="7" fill="#3a2a22"/><path d="M92 124q8 7 16 0" fill="none" stroke="#3a2a22" stroke-width="3" stroke-linecap="round"/><circle cx="64" cy="108" r="8" fill="#f7a8bd" opacity=".6"/><circle cx="136" cy="108" r="8" fill="#f7a8bd" opacity=".6"/><ellipse cx="100" cy="186" rx="54" ry="30" fill="${col}"/>`, '', '0 0 200 216');
ICO.corazon = (s, col) => svg(s, s * .9, `<path d="M50 88C20 66 4 50 4 30A22 22 0 0 1 50 18A22 22 0 0 1 96 30C96 50 80 66 50 88Z" fill="${col}"/>`, '', '0 0 100 90');
ICO.estrella = (s, col) => svg(s, s, `<path d="M50 6l12 30 32 2-25 20 9 32-28-18-28 18 9-32L6 38l32-2z" fill="${col}" stroke="${col}" stroke-width="6" stroke-linejoin="round"/>`, '', '0 0 100 100');
ICO.nube = (s, col) => svg(s, s * .55, `<path d="M40 100a36 36 0 0 1 4-72a46 46 0 0 1 86-8a36 36 0 0 1 50 34a30 30 0 0 1-6 46z" fill="${col}"/>`, '', '0 0 200 110');
ICO.sonaja = (s, col, b) => svg(s * .5, s, `<circle cx="50" cy="40" r="34" fill="${col}"/><circle cx="50" cy="40" r="20" fill="rgba(255,255,255,.5)"/><rect x="44" y="72" width="12" height="80" rx="6" fill="${b}"/><circle cx="50" cy="168" r="18" fill="${b}"/>`, '', '0 0 100 190');
const BEBES = {
  nombres: ['Cocina de papillas', 'Hora de comer', 'Mi menú', 'Recetario', 'Álbum familiar'],
  pal: [
    P('#fff6ec', '#4a3428', '#8c7466', '#ee7f56', '#6faee6', '#f6b93b', '#ffffff', 'rgba(238,127,86,.08)', 'rgba(238,127,86,.42)', 'rgba(140,100,70,.22)', 'Fraunces', 700, 'Manrope', 'Manrope', 'none', '-.015em', '22px'),
    P('#eef5fc', '#2f3b52', '#5d6b83', '#ef7fa0', '#5b9fe0', '#f6b93b', '#ffffff', 'rgba(47,59,82,.06)', 'rgba(239,127,160,.5)', 'rgba(60,80,120,.2)', 'Outfit', 800, 'Manrope', 'Manrope', 'none', '-.02em', '999px'),
    P('#2f2a3d', '#fffaf4', '#d0c9de', '#f8a68e', '#9cc8f2', '#ffd37a', '#2f2a3d', '#3c364d', '#56506e', 'rgba(248,166,142,.25)', 'Sora', 700, 'Manrope', 'Manrope', 'none', '-.02em', '18px'),
    P('#fdf1e4', '#4b3326', '#6e5646', '#e07a48', '#4b3326', '#f6c453', '#ffffff', '#4b3326', '#4b3326', 'rgba(140,100,70,.25)', 'Fraunces', 800, 'DMSans', 'DMSans', 'none', '-.02em', '14px'),
    P('#3f2630', '#fff4f6', '#e9cdd5', '#f7a8bd', '#9cc8ec', '#ffd37a', '#3f2630', 'rgba(255,255,255,.07)', 'rgba(247,168,189,.45)', 'rgba(0,0,0,.5)', 'Fraunces', 600, 'Manrope', 'Manrope', 'none', '-.01em', '20px'),
  ],
  musica: ['little-bells', 'smile', 'positive-energy', 'feeling-happy', 'a-baby-story'],
  txt: {deck: (i) => ['DESAYUNO', 'COMIDA', 'MERIENDA', 'CENA'][i % 4], bpm: 'ETAPA · 6 A 12 MESES', error: (j) => 'DUDA ' + (j + 1), registro: 'MI MENÚ', biblioteca: 'MIS RECETAS', nuevas: 'LO QUE VAS A LOGRAR', desbloq: 'LISTAS', cert: 'CERTIFICADO.PDF', modulo: 'RECETARIO'},
  // director 4: cada escena es otra tarjeta de receta
  cartel: [['#fdf1e4', '#4b3326', '#e07a48'], ['#f7c3d0', '#3f2630', '#b23a5e'], ['#cfe3f7', '#26324a', '#2f6fb3'], ['#ffe3a3', '#40301f', '#c0602e']],
  barras: ['#f7c3d0', '#ffe3a3', '#cfe3f7'],
  css: `
body.mu-bebes .trama{background-image:linear-gradient(90deg,rgba(224,122,72,.13) 50%,transparent 50%),linear-gradient(rgba(224,122,72,.13) 50%,transparent 50%);background-size:72px 72px;opacity:.9}
body.mu-bebes .franja{height:96px;background:rgba(247,168,189,.9);background-image:radial-gradient(circle,rgba(255,255,255,.55) 0 9px,transparent 10px);background-size:46px 46px;opacity:.95}
body.mu-bebes .ui{background:#3c364d;border:2px solid #56506e;border-radius:22px;box-shadow:0 30px 60px rgba(0,0,0,.35)}
body.mu-bebes .ui .bar{background:#463f5a;border-bottom:2px solid #56506e;color:#d0c9de;font-family:Manrope;letter-spacing:.12em}
body.mu-bebes .ui .bar b{color:#ffd37a}
body.mu-bebes.d3 .fila{background:#3c364d;border:2px solid #56506e}
body.mu-bebes .disco{background:conic-gradient(from -30deg,#ffe2a6 0 120deg,#fbcbd8 0 240deg,#cde2f7 0);box-shadow:0 40px 110px rgba(60,80,120,.35),inset 0 0 0 30px #f7c3d0,inset 0 0 0 36px #fff}
body.mu-bebes .disco::before{background:conic-gradient(from -30deg,#f7c3d0 0 2deg,transparent 0 118deg,#f7c3d0 0 122deg,transparent 0 238deg,#f7c3d0 0 242deg,transparent 0 358deg,#f7c3d0 0)}
body.mu-bebes .disco .lab{left:30%;top:30%;width:40%;height:40%;background:#fffaf3;color:#2f3b52;font-family:Outfit;font-weight:800;font-size:28px;padding:20px;box-shadow:inset 0 0 0 6px #f7c3d0}
body.mu-bebes .disco .lab::after{display:none}
body.mu-bebes .fuga{background:radial-gradient(closest-side,rgba(255,200,150,.32),transparent 70%)}
body.mu-bebes .franjas::before,body.mu-bebes .franjas::after{background:#fff4f6;height:56px;box-shadow:0 0 0 2px rgba(247,168,189,.5)}
body.mu-bebes .cita b{font-family:Caveat;font-size:40px;letter-spacing:0}`,
  fondo(DIR, bg, AMB, H) {
    const {capa, linea, pal} = H, p = pal;
    // burbujas suaves que suben y corazones que flotan (las usan varios directores)
    const burbujas = (n, cols, op) => { const bs = Array.from({length: n}, (_, j) => { const r = 14 + (j * 37) % 34, x = (j * 271) % 1880 + 20; return {e: capa(bg, '', `left:${x}px;top:1100px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle at 32% 30%,rgba(255,255,255,.9),${rgba(cols[j % cols.length], .35)} 60%);border:2px solid ${rgba(cols[j % cols.length], .45)}`), v: .05 + (j % 5) * .012, d: j * .137}; });
      return (t) => bs.forEach((b) => { const f = (t * b.v + b.d) % 1; b.e.style.transform = `translate(${Math.sin(t * .9 + b.d * 9) * 30}px,${-f * 1300}px)`; b.e.style.opacity = String(Math.sin(f * Math.PI) * op); }); };
    const corazones = (lista, col) => { const cs = lista.map(([x, y, s, v, d]) => ({e: capa(bg, ICO.corazon(s, col), `left:${x}px;top:${y}px`), v, d}));
      return (t) => cs.forEach((c) => { const f = (t * c.v + c.d) % 1; c.e.style.transform = `translate(${Math.sin(t + c.d * 6) * 16}px,${-f * 240}px) rotate(${Math.sin(t * .8 + c.d) * 12}deg)`; c.e.style.opacity = String(Math.sin(f * Math.PI) * .6); }); };
    if (DIR === 1) { // cocina de papillas: azulejos pastel, tazón con vapor, cuchara y biberón
      bg.style.background = `linear-gradient(${rgba('#ffffff', .7)} 3px,transparent 3px) 0 0/120px 60px,linear-gradient(90deg,${rgba('#ffffff', .7)} 3px,transparent 3px) 0 0/120px 60px,linear-gradient(180deg,#fff3e4,${p.bg} 70%)`;
      capa(bg, '', `left:0;right:0;bottom:0;height:170px;background:linear-gradient(180deg,#f2d9bf,#e9c9a8);box-shadow:0 -10px 30px rgba(140,100,70,.18)`);
      capa(bg, `<svg width="300" height="150"><path d="M10 20h280c0 70-60 120-140 120S10 90 10 20z" fill="${p.a}"/><ellipse cx="150" cy="20" rx="140" ry="18" fill="#ffc98a"/><ellipse cx="150" cy="20" rx="140" ry="18" fill="none" stroke="${rgba('#000', .1)}" stroke-width="3"/></svg>`, 'left:1590px;top:885px');
      const v1 = linea(bg, 'M1660 830c-30-60 30-90 0-150s30-90 0-150', rgba('#ffffff', .95), 10, 6), v2 = linea(bg, 'M1730 830c-30-60 30-90 0-150s30-90 0-140', rgba('#ffffff', .85), 8, 6, 2), v3 = linea(bg, 'M1800 830c-30-60 30-90 0-150', rgba('#ffffff', .8), 7, 6, 4);
      const cu = capa(bg, ICO.cuchara(340, p.b), 'left:-40px;top:880px;transform:rotate(-12deg);filter:drop-shadow(6px 10px 8px rgba(140,100,70,.25))');
      capa(bg, ICO.biberon(210, p.b, p.c), 'left:230px;top:875px;transform:rotate(-6deg);filter:drop-shadow(8px 12px 10px rgba(140,100,70,.22))');
      const b = burbujas(10, [p.a, p.b, p.c], .55);
      AMB.push((t) => { v1(t); v2(t); v3(t); cu.style.transform = `rotate(${-12 + Math.sin(t * .8) * 4}deg)`; b(t); });
    } else if (DIR === 2) { // cuarto del bebé: lunares, nubes que pasan, móvil de estrellas y osito
      bg.style.background = `radial-gradient(circle,${rgba(p.a, .16)} 0 9px,transparent 10px) 0 0/90px 90px,radial-gradient(circle,${rgba(p.b, .14)} 0 7px,transparent 8px) 45px 45px/90px 90px,linear-gradient(180deg,#f6fbff,${p.bg})`;
      const nubes = [[120, 110, 300], [1450, 70, 360], [700, 960, 260]].map(([x, y, s]) => ({e: capa(bg, ICO.nube(s, '#ffffff'), `left:${x}px;top:${y}px;filter:drop-shadow(0 10px 20px rgba(60,80,120,.12))`), x}));
      const movil = capa(bg, `<svg width="420" height="320" style="overflow:visible"><path d="M20 20H400" stroke="${rgba(p.ink, .35)}" stroke-width="5" stroke-linecap="round"/>${[60, 160, 260, 360].map((x, j) => `<path d="M${x} 20V${110 + (j % 2) * 60}" stroke="${rgba(p.ink, .3)}" stroke-width="2"/>`).join('')}</svg>`, 'left:1440px;top:250px;transform-origin:210px 20px');
      [p.c, p.a, p.b, p.c].forEach((col, j) => capa(movil, j % 2 ? ICO.corazon(60, col) : ICO.estrella(64, col), `left:${28 + j * 100}px;top:${100 + (j % 2) * 60}px`));
      capa(bg, ICO.osito(210, '#d9a77c', '#f3d6bb'), 'left:1690px;top:850px;filter:drop-shadow(0 16px 20px rgba(60,80,120,.2))');
      capa(bg, ICO.sonaja(150, p.a, p.c), 'left:30px;top:920px;transform:rotate(-24deg);opacity:.85');
      AMB.push((t) => { nubes.forEach((n, j) => { n.e.style.transform = `translateX(${Math.sin(t * .18 + j * 2) * 120}px)`; }); movil.style.transform = `rotate(${Math.sin(t * .9) * 5}deg)`; });
    } else if (DIR === 3) { // noche en el cuarto: estrellas que titilan, luna y la curva de crecimiento de fondo
      bg.style.background = `radial-gradient(1200px 700px at 50% 60%,#3a3350,${p.bg} 72%)`;
      const es = Array.from({length: 34}, (_, j) => capa(bg, ICO.estrella(14 + (j % 4) * 6, j % 3 ? '#fff3c4' : p.a), `left:${(j * 173) % 1880 + 20}px;top:${(j * 97) % 1000 + 20}px`));
      capa(bg, `<svg width="220" height="220"><circle cx="110" cy="110" r="90" fill="#fff3c4"/><circle cx="150" cy="86" r="80" fill="#3a3350"/></svg>`, 'right:50px;top:20px;opacity:.3;transform:scale(.7);transform-origin:100% 0;filter:drop-shadow(0 0 40px rgba(255,243,196,.5))');
      const cur = linea(bg, 'M-20 1000C300 990 520 930 800 840S1300 640 1560 560 1880 470 1960 450', rgba(p.b, .35), 8, 12);
      AMB.push((t) => { es.forEach((e, j) => { e.style.opacity = String(.25 + .75 * Math.abs(Math.sin(t * 1.1 + j * 1.7))); }); cur(t); });
    } else if (DIR === 4) { // mantel de cuadritos (se ve detrás de las tarjetas de receta)
      bg.style.background = p.bg; bg.appendChild(H.$('<div class="trama"></div>'));
    } else { // álbum familiar: luz cálida que se mueve, burbujas de luz y corazones
      bg.style.background = `radial-gradient(1400px 900px at 50% 0%,#5a3442,${p.bg} 70%)`;
      const f = H.$('<div class="fuga" style="left:-300px;top:-400px"></div>'); bg.appendChild(f);
      const b = burbujas(14, [p.a, p.c, '#ffffff'], .35);
      const co = corazones([[160, 820, 70, .07, .1], [1700, 760, 60, .06, .5], [940, 900, 46, .08, .8], [420, 300, 40, .05, .3]], rgba(p.a, .95));
      AMB.push((t) => { b(t); co(t); f.style.transform = `translate(${Math.sin(t * .2) * 600 + 700}px,${Math.cos(t * .15) * 200}px)`; f.style.opacity = .5 + .4 * Math.sin(t * .7); });
    }
  },
  // director 1: burbujas que suben detrás del texto (en DJ eran láseres)
  rayos(c, H, inverso) {
    const {pal} = H, cols = [pal.a, pal.b, pal.c];
    for (let i = 0; i < 14; i++) {
      const r = 18 + (i * 29) % 40, x = (i * 139 + (inverso ? 70 : 0)) % 1860 + 30;
      const e = H.$(`<div class="abs" style="left:${x}px;top:1120px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle at 32% 30%,rgba(255,255,255,.95),${rgba(cols[i % 3], .4)} 62%);border:2px solid ${rgba(cols[i % 3], .55)}"></div>`);
      c.cam.insertBefore(e, c.cam.firstChild);
      c.tl.fromTo(e, {y: 0, x: 0}, {y: -1300 - (i % 3) * 120, x: (i % 2 ? 1 : -1) * 60, duration: c.D * (.8 + (i % 4) * .1), ease: 'sine.inOut'}, (i % 5) * .12);
    }
  },
  // director 3: la curva de crecimiento con puntos de control (en DJ era la onda de audio)
  onda(c, o, H) {
    const {pal} = H, col = o.b ? pal.b : pal.a, w = o.w, h = o.h;
    const pts = Array.from({length: 9}, (_, j) => [j * w / 8, h * (.85 - .7 * Math.pow(j / 8, .7)) + (o.b ? h * .05 : 0)]);
    let d = `M${pts[0][0]} ${pts[0][1]}`; for (let j = 1; j < pts.length; j++) { const [x0, y0] = pts[j - 1], [x1, y1] = pts[j]; d += `C${x0 + (x1 - x0) / 2} ${y0} ${x0 + (x1 - x0) / 2} ${y1} ${x1} ${y1}`; }
    const pun = pts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="${col}"/>`).join('');
    const e = H.$(`<div class="abs" style="left:${o.x}px;top:${o.y}px;width:${w}px;height:${h}px"><svg width="${w}" height="${h}" style="overflow:visible"><path d="M0 ${h}H${w}" stroke="${rgba(col, .25)}" stroke-width="2" stroke-dasharray="6 10"/><path d="${d}" fill="none" stroke="${col}" stroke-width="7" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/><g opacity="0">${pun}</g></svg></div>`);
    (o.en || c.cam).appendChild(e);
    c.tl.fromTo(e.querySelectorAll('path')[1], {strokeDashoffset: 1}, {strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut'}, .3);
    c.tl.to(e.querySelector('g'), {opacity: 1, duration: .4}, 1.3);
    return e;
  },
  chip: {bg: '#4b3326', ink: '#fff6ec', font: 'DMSans', tt: 'none'},
};

// ================= MATEMÁTICAS (25 nov 2026) =================
// Christian (25 nov): «le estoy dando en generar 5 videos y me está diciendo que el nicho no tiene estilo propio». Mundo hecho desde
// cero para Matemáticas con lo aprobado del kit del nicho (pro/nichos.json): pizarrón GRIS (nunca verde) con fórmulas de gis que se
// escriben solas, azul marino, grafito y amarillo gis; títulos en Rubik y Unbounded, textos en Outfit y Manrope, y Kalam como letra
// de gis. Objetos propios: escuadra, compás que traza su círculo, transportador, calculadora, cuaderno cuadriculado y plano cartesiano
// con funciones que se trazan. Cortes propios: el borrador que limpia el pizarrón (director 1) y la cuadrícula que se llena (director 4).
// Nada de láseres, vinilos, ondas de audio, mazos, piezas de ajedrez ni lápices de dibujo. Música: pistas del kit de Matemáticas.
const MATE_ICO = {
  escuadra: (s, col, borde) => svg(s, s * .58, `<path d="M6 226L6 8L392 226Z" fill="${col}" stroke="${borde}" stroke-width="4" stroke-linejoin="round"/><path d="M52 190L52 112L190 190Z" fill="rgba(0,0,0,.28)" stroke="${borde}" stroke-width="3" stroke-linejoin="round"/>${Array.from({length: 19}, (_, j) => `<path d="M${24 + j * 19} 226v${j % 5 ? -12 : -22}" stroke="${borde}" stroke-width="2.5"/>`).join('')}`, '', '0 0 400 232'),
  compas: (s, col, met) => svg(s * .62, s, `<rect x="54" y="0" width="16" height="30" rx="6" fill="${met}"/><circle cx="62" cy="42" r="16" fill="${col}"/><circle cx="62" cy="42" r="6" fill="${met}"/><path d="M56 52L20 186" stroke="${col}" stroke-width="12" stroke-linecap="round"/><path d="M68 52L104 186" stroke="${col}" stroke-width="12" stroke-linecap="round"/><path d="M20 186L16 200" stroke="${met}" stroke-width="4" stroke-linecap="round"/><path d="M98 184l6 16 6-16z" fill="#f2d27a"/><path d="M36 128H88" stroke="${met}" stroke-width="5"/>`, '', '0 0 124 200'),
  transp: (s, col, ink) => svg(s, s * .55, `<path d="M10 210A190 190 0 0 1 390 210Z" fill="${col}" stroke="${ink}" stroke-width="3"/><path d="M80 210A120 120 0 0 1 320 210" fill="none" stroke="${ink}" stroke-width="2" opacity=".6"/>${Array.from({length: 37}, (_, j) => { const a = Math.PI * j / 36, r2 = j % 9 ? 176 : 158; return `<path d="M${(200 - Math.cos(a) * 190).toFixed(1)} ${(210 - Math.sin(a) * 190).toFixed(1)}L${(200 - Math.cos(a) * r2).toFixed(1)} ${(210 - Math.sin(a) * r2).toFixed(1)}" stroke="${ink}" stroke-width="2"/>`; }).join('')}${[0, 30, 60, 90, 120, 150, 180].map((g) => { const a = Math.PI * g / 180; return `<text x="${(200 - Math.cos(a) * 140).toFixed(1)}" y="${(216 - Math.sin(a) * 140).toFixed(1)}" font-family="Rubik" font-weight="700" font-size="18" fill="${ink}" text-anchor="middle">${g}</text>`; }).join('')}<circle cx="200" cy="206" r="5" fill="${ink}"/>`, '', '0 0 400 220'),
  calc: (s, cuerpo, pant, tecla, acento) => { const T = [['sin', 'cos', '√', 'π'], ['7', '8', '9', '÷'], ['4', '5', '6', '×'], ['1', '2', '3', '−'], ['0', '.', '=', '+']];
    return svg(s * .62, s, `<rect x="0" y="0" width="248" height="400" rx="26" fill="${cuerpo}"/><rect x="22" y="24" width="204" height="90" rx="10" fill="${pant}"/><text class="lcd" x="212" y="88" font-family="Unbounded" font-weight="600" font-size="38" fill="#1f2a33" text-anchor="end">3.1416</text>${T.map((f, r) => f.map((k, j) => `<rect x="${22 + j * 52}" y="${140 + r * 50}" width="44" height="36" rx="8" fill="${j === 3 || (r === 4 && j === 2) ? acento : tecla}"/><text x="${44 + j * 52}" y="${164 + r * 50}" font-family="Rubik" font-weight="700" font-size="${k.length > 1 ? 15 : 19}" fill="${j === 3 || (r === 4 && j === 2) ? '#1f2a33' : '#eef2f6'}" text-anchor="middle">${k}</text>`).join('')).join('')}`, '', '0 0 248 400'); },
  cubo: (s, col) => svg(s, s, `<g fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round"><path d="M30 60L100 30L170 60L100 90Z"/><path d="M30 60V150L100 180V90M170 60V150L100 180"/><path d="M30 150L100 120L170 150M100 120V30" stroke-dasharray="8 8" opacity=".6"/></g>`, '', '0 0 200 200'),
  piramide: (s, col) => svg(s, s, `<g fill="none" stroke="${col}" stroke-width="3" stroke-linejoin="round"><path d="M100 20L30 150L110 180L100 20L170 140L110 180"/><path d="M30 150L170 140" stroke-dasharray="8 8" opacity=".6"/></g>`, '', '0 0 200 200'),
};
// texto de gis que se escribe solo (de izquierda a derecha), se queda y se borra
const gis = (H, L, txt, x, y, fs, col, rot, per, des) => {
  const e = H.capa(L, `<div style="font-family:Kalam;font-weight:700;font-size:${fs}px;line-height:1.1;white-space:nowrap;color:${col};text-shadow:0 0 2px ${col},0 0 10px rgba(255,255,255,.08)">${txt}</div>`, `left:${x}px;top:${y}px;transform:rotate(${rot}deg)`);
  return (t) => { const f = ((t + des) % per) / per; e.style.clipPath = `inset(-20% ${f < .3 ? (1 - f / .3) * 100 : 0}% -20% 0)`; e.style.opacity = f < .86 ? '1' : String(Math.max(0, 1 - (f - .86) / .1)); };
};
const MATEMATICAS = {
  nombres: ['Pizarrón', 'Geometría', 'Calculadora', 'Cuaderno cuadriculado', 'Plano cartesiano'],
  pal: [
    P('#2b2f33', '#f4f1e8', '#cfcbc0', '#ffd84a', '#ff8a65', '#8fd3ff', '#1d2024', 'rgba(244,241,232,.06)', 'rgba(255,216,74,.45)', 'rgba(0,0,0,.55)', 'Rubik', 800, 'Outfit', 'Kalam', 'none', '-.02em', '10px'),
    P('#0d1f4a', '#f5f7ff', '#c2cdf0', '#ffc93c', '#ff6b6b', '#7fb2ff', '#0a1636', 'rgba(255,255,255,.06)', 'rgba(255,201,60,.45)', 'rgba(0,0,0,.6)', 'Unbounded', 700, 'Outfit', 'Rubik', 'none', '-.03em', '999px'),
    P('#15181c', '#eef2f6', '#9aa6b2', '#ffd23f', '#ff5d73', '#3dd6ff', '#121416', '#20252b', '#2f3842', 'rgba(0,0,0,.5)', 'Rubik', 900, 'Manrope', 'Unbounded', 'none', '-.025em', '12px'),
    P('#fbfaf4', '#16285a', '#3d4a70', '#2563eb', '#e8483b', '#f59e0b', '#ffffff', '#ffffff', 'rgba(37,99,235,.35)', 'rgba(30,50,110,.18)', 'Rubik', 800, 'Outfit', 'Kalam', 'none', '-.02em', '6px'),
    P('#0a1330', '#f3f6ff', '#b9c4e6', '#ffcf33', '#ff5d73', '#38bdf8', '#0a1330', 'rgba(255,255,255,.06)', 'rgba(255,207,51,.45)', 'rgba(0,0,0,.6)', 'Unbounded', 600, 'Outfit', 'Rubik', 'none', '-.02em', '8px'),
  ],
  musica: ['driving-ambition', 'just-keep-walking', 'new-bass-01', 'upbeat-jazz', 'epical-drums-02'],
  txt: {deck: (i) => 'EJERCICIO ' + (i + 1), bpm: 'MODO · DEG', error: (j) => 'DUDA ' + (j + 1), registro: 'MIS DUDAS', biblioteca: 'MIS TEMAS', nuevas: 'NUEVAS HABILIDADES', desbloq: 'RESUELTAS', cert: 'CERTIFICADO.PDF', modulo: 'MÓDULO'},
  // director 4: cada escena es otra hoja del cuaderno (papel, tinta azul, roja y amarillo)
  cartel: [['#fbfaf4', '#16285a', '#2563eb'], ['#16285a', '#fbfaf4', '#ffd23f'], ['#fff6d6', '#16285a', '#e8483b'], ['#eaf1ff', '#16285a', '#2563eb']],
  barras: ['#16285a', '#2563eb', '#ffd23f'],
  css: `
body.mu-matematicas .trama{background-image:linear-gradient(rgba(96,130,214,.2) 2px,transparent 2px),linear-gradient(90deg,rgba(96,130,214,.2) 2px,transparent 2px),linear-gradient(90deg,transparent 0 76px,rgba(232,72,59,.6) 76px 79px,transparent 79px);background-size:48px 48px,48px 48px,100% 100%;opacity:1}
body.mu-matematicas .trama::before{content:"";position:absolute;left:12px;top:0;bottom:0;width:34px;background:radial-gradient(circle at 17px 24px,#c9ced8 0 9px,rgba(0,0,0,.35) 9px 12px,transparent 12px) 0 0/34px 56px}
body.mu-matematicas .franja{height:100px;background:#16285a url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='520' height='100'><g font-family='Rubik' font-weight='800' font-size='54' fill='%23ffd23f'><text x='20' y='70'>+</text><text x='95' y='70'>−</text><text x='170' y='70'>×</text><text x='245' y='70'>÷</text><text x='320' y='70'>=</text><text x='395' y='70'>π</text><text x='465' y='70'>√</text></g></svg>") 0 0/520px 100px repeat-x;opacity:.97}
body.mu-matematicas .ui{background:#1c2026;border:2px solid #2f3842;border-radius:18px;box-shadow:0 30px 70px rgba(0,0,0,.45)}
body.mu-matematicas .ui .bar{background:#262c33;border-bottom:2px solid #2f3842;color:#9aa6b2;font-family:Unbounded;font-weight:600;font-size:22px;letter-spacing:.06em}
body.mu-matematicas .ui .bar b{color:#ffd23f}
body.mu-matematicas.d3 .fila{background:#20252b !important;border:2px solid #2f3842 !important;font-family:Manrope !important}
body.mu-matematicas .disco{background:radial-gradient(circle,transparent 0 58%,rgba(255,201,60,.8) 58.3% 58.9%,transparent 59.2%),radial-gradient(circle,transparent 0 30%,rgba(255,255,255,.35) 30.3% 30.8%,transparent 31.1%),radial-gradient(circle at 36% 30%,rgba(214,230,255,.34),rgba(127,178,255,.16) 60%,rgba(127,178,255,.24) 100%);box-shadow:0 40px 120px rgba(0,0,0,.45),inset 0 0 0 5px rgba(255,201,60,.85),inset 0 0 40px rgba(255,255,255,.12)}
body.mu-matematicas .disco::before{background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.85) 0 .5deg,transparent .5deg 5deg),repeating-conic-gradient(from 0deg,#ffc93c 0 .9deg,transparent .9deg 30deg);-webkit-mask:radial-gradient(circle,transparent 0 80%,#000 81% 97%,transparent 97.5%);mask:radial-gradient(circle,transparent 0 80%,#000 81% 97%,transparent 97.5%)}
body.mu-matematicas .disco .lab{left:38%;top:38%;width:24%;height:24%;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='M50 4V96M4 50H96' stroke='%23ffc93c' stroke-width='3'/><circle cx='50' cy='50' r='30' fill='none' stroke='%23ffc93c' stroke-width='3'/><text x='50' y='64' font-family='Rubik' font-weight='800' font-size='40' fill='%23ffffff' text-anchor='middle'>π</text></svg>") center/90% no-repeat,#0d1f4a;color:transparent;font-size:0;box-shadow:0 0 0 6px rgba(13,31,74,.35)}
body.mu-matematicas .disco .lab::after{display:none}
body.mu-matematicas .fuga{background:radial-gradient(closest-side,rgba(255,207,51,.22),transparent 70%)}
body.mu-matematicas .velo{background:linear-gradient(90deg,rgba(10,19,48,.95) 0%,rgba(10,19,48,.86) 48%,rgba(10,19,48,.5) 100%)}
body.mu-matematicas .velo.c{background:radial-gradient(1200px 700px at 50% 50%,rgba(10,19,48,.74),rgba(10,19,48,.95))}
body.mu-matematicas .franjas{display:none}
body.mu-matematicas.d5 .T .k .wi{font-style:normal}
body.mu-matematicas.d1 .fila{font-family:Outfit}
body.mu-matematicas .cita b{font-family:Outfit;letter-spacing:.04em}`,
  fondo(DIR, bg, AMB, H) {
    const {capa, linea, pal} = H, p = pal;
    if (DIR === 1) { // pizarrón gris con marco de aluminio, repisa con gises y borrador, fórmulas de gis que se escriben y se borran
      bg.style.background = `radial-gradient(900px 420px at 22% 28%,rgba(255,255,255,.07),transparent 70%),radial-gradient(800px 460px at 78% 72%,rgba(255,255,255,.05),transparent 70%),radial-gradient(1500px 950px at 50% 45%,#3b4045,${p.bg} 82%)`;
      [[-80, 210, 820, 240, -5], [1180, 330, 760, 220, 4], [420, 640, 900, 260, -2]].forEach(([x, y, w, h, r]) => capa(bg, '', `left:${x}px;top:${y}px;width:${w}px;height:${h}px;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,.05),transparent);transform:rotate(${r}deg)`));
      const F = [['a² + b² = c²', 90, 46, 62, .34, -3, 9, 0], ['y = mx + b', 1440, 56, 58, .32, 2, 10, 3], ['x = (−b ± √(b² − 4ac)) ÷ 2a', 640, 150, 42, .24, -1, 11, 6], ['π ≈ 3.1416', 110, 860, 56, .3, 2, 9, 4.5], ['f(x) = 2x + 3', 1420, 850, 54, .3, -2, 10, 1.5], ['3x − 7 = 11  →  x = 6', 600, 900, 46, .26, 1, 12, 8]];
      const fs = F.map(([s, x, y, z, op, r, per, des], j) => gis(H, bg, s, x, y, z, j % 3 === 1 ? rgba(p.a, op + .12) : rgba(p.ink, op), r, per, des));
      const tri = linea(bg, 'M1650 640V400L1860 640Z', rgba(p.ink, .28), 5, 8, 1), tri2 = linea(bg, 'M1650 610H1680V640', rgba(p.ink, .28), 4, 8, 1);
      const circ = linea(bg, 'M170 520m-110 0a110 110 0 1 0 220 0a110 110 0 1 0 -220 0M170 520H280', rgba(p.c, .3), 5, 9, 5);
      capa(bg, `<div style="position:absolute;left:1600px;top:500px;font-family:Kalam;font-weight:700;font-size:34px;color:${rgba(p.ink, .3)}">a</div><div style="position:absolute;left:1740px;top:650px;font-family:Kalam;font-weight:700;font-size:34px;color:${rgba(p.ink, .3)}">b</div><div style="position:absolute;left:1770px;top:470px;font-family:Kalam;font-weight:700;font-size:34px;color:${rgba(p.ink, .3)}">c</div><div style="position:absolute;left:200px;top:478px;font-family:Kalam;font-weight:700;font-size:30px;color:${rgba(p.c, .35)}">r</div>`, 'inset:0');
      capa(bg, '', 'left:0;right:0;top:0;height:18px;background:linear-gradient(#a7adb3,#6f767d);box-shadow:0 4px 10px rgba(0,0,0,.4)');
      capa(bg, '', 'left:0;top:0;bottom:0;width:18px;background:linear-gradient(90deg,#a7adb3,#6f767d)');
      capa(bg, '', 'right:0;top:0;bottom:0;width:18px;background:linear-gradient(270deg,#a7adb3,#6f767d)');
      capa(bg, `<div style="position:absolute;left:0;right:0;top:0;height:16px;background:linear-gradient(#b5bbc1,#7b8288)"></div><div style="position:absolute;left:0;right:0;top:16px;bottom:0;background:linear-gradient(#5d646a,#3e4449)"></div><div style="position:absolute;left:300px;top:-12px;width:110px;height:22px;border-radius:11px;background:#f4f1e8"></div><div style="position:absolute;left:430px;top:-10px;width:80px;height:20px;border-radius:10px;background:#ffd84a"></div><div style="position:absolute;left:1420px;top:-46px;width:220px;height:56px;border-radius:10px;background:linear-gradient(#b48a54 0 60%,#6b7076 60%)"></div>`, 'left:0;right:0;top:1040px;height:40px');
      const polvo = Array.from({length: 16}, (_, j) => capa(bg, '', `left:${(j * 131) % 1860 + 30}px;top:${(j * 211) % 900 + 60}px;width:5px;height:5px;border-radius:50%;background:rgba(244,241,232,.55);filter:blur(1px)`));
      AMB.push((t) => { fs.forEach((f) => f(t)); tri(t); tri2(t); circ(t);
        polvo.forEach((d, j) => { d.style.transform = `translate(${Math.sin(t * .4 + j) * 20}px,${(t * 18 + j * 50) % 160}px)`; d.style.opacity = String(.2 + .3 * Math.sin(t * .8 + j)); }); });
    } else if (DIR === 2) { // geometría: construcción con regla y compás, escuadra translúcida, compás que traza su círculo, cuerpos geométricos
      bg.style.background = `radial-gradient(1200px 800px at 30% 40%,${rgba(p.c, .16)},transparent 65%),linear-gradient(180deg,#10265a,${p.bg} 60%,#081430)`;
      const cons = capa(bg, svg(1100, 1100, `<g fill="none" stroke="${rgba(p.c, .16)}" stroke-width="2"><circle cx="550" cy="550" r="300"/><circle cx="850" cy="550" r="300"/><circle cx="250" cy="550" r="300"/><circle cx="700" cy="290" r="300"/><circle cx="400" cy="290" r="300"/><circle cx="700" cy="810" r="300"/><circle cx="400" cy="810" r="300"/><path d="M850 550L700 810L400 810L250 550L400 290L700 290Z" stroke="${rgba(p.a, .22)}" stroke-width="3"/><path d="M250 550H850M400 290L700 810M700 290L400 810"/></g>`), 'left:1060px;top:-80px;opacity:.9');
      capa(bg, MATE_ICO.escuadra(620, rgba(p.a, .14), rgba(p.a, .4)), 'left:-60px;top:760px;transform:rotate(-8deg)');
      capa(bg, MATE_ICO.transp(520, rgba(p.c, .1), rgba(p.c, .35)), 'left:40px;top:-40px;transform:rotate(180deg)');
      const cu = capa(bg, MATE_ICO.cubo(220, rgba(p.ink, .2)), 'left:1640px;top:820px'), pi = capa(bg, MATE_ICO.piramide(200, rgba(p.a, .22)), 'left:820px;top:880px');
      const cx = 1500, cy = 760, R = 150;
      const arco = capa(bg, `<svg width="1920" height="1080" style="overflow:visible"><path d="M${cx + R} ${cy}a${R} ${R} 0 1 1 -.1 0" fill="none" stroke="${rgba(p.a, .55)}" stroke-width="4" pathLength="1" stroke-dasharray="1 1"/><circle cx="${cx}" cy="${cy}" r="5" fill="${rgba(p.a, .7)}"/></svg>`, 'inset:0'), ap = arco.querySelector('path');
      const cp = capa(bg, MATE_ICO.compas(250, rgba(p.ink, .55), rgba(p.c, .7)), `left:${cx - 250 * .62 * 16 / 124}px;top:${cy - 250}px;transform-origin:${16 / 124 * 100}% 100%`);
      AMB.push((t) => { const f = (t % 6) / 6, q = f < .7 ? f / .7 : 1; ap.style.strokeDashoffset = String(1 - q); ap.style.opacity = f < .9 ? '1' : String(1 - (f - .9) / .1);
        cp.style.transform = `rotate(${q * 360 + 18}deg)`; cons.style.transform = `rotate(${t * 2}deg)`;
        cu.style.transform = `translateY(${Math.sin(t * .5) * 14}px) rotate(${Math.sin(t * .3) * 6}deg)`; pi.style.transform = `translateY(${Math.sin(t * .45 + 2) * 12}px)`; });
    } else if (DIR === 3) { // calculadora: grafito, una calculadora científica grande, teclas que flotan y una gráfica que se traza
      bg.style.background = `radial-gradient(rgba(255,255,255,.05) 1.5px,transparent 2px) 0 0/36px 36px,radial-gradient(1300px 800px at 50% 50%,#22272e,${p.bg} 75%)`;
      const ca = capa(bg, MATE_ICO.calc(980, '#262c33', '#c9d1c7', '#3a424b', p.a), 'left:1500px;top:110px;opacity:.28;transform:rotate(8deg)'), lcd = ca.querySelector('.lcd');
      const V = ['3.1416', '1.4142', '2.7183', '144', '0.5', '12.25', '√2', '42'];
      const ks = [['+', 90, 120], ['×', 260, 880], ['√', 60, 560], ['π', 1380, 940], ['÷', 700, 960], ['=', 1160, 60], ['%', 520, 70]].map(([k, x, y], j) => ({e: capa(bg, `<div style="width:96px;height:80px;border-radius:16px;background:${j % 3 === 0 ? rgba(p.a, .22) : 'rgba(255,255,255,.06)'};border:2px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;font-family:Rubik;font-weight:800;font-size:44px;color:${j % 3 === 0 ? rgba(p.a, .6) : 'rgba(238,242,246,.35)'}">${k}</div>`, `left:${x}px;top:${y}px`), j}));
      const gr = linea(bg, 'M120 1000C260 700 340 700 420 860S600 1020 700 760', rgba(p.c, .35), 6, 7, 2);
      capa(bg, '', 'left:110px;top:740px;width:620px;height:2px;background:rgba(255,255,255,.12)'); capa(bg, '', 'left:130px;top:640px;width:2px;height:400px;background:rgba(255,255,255,.12)');
      AMB.push((t) => { lcd.textContent = V[Math.floor(t / 1.6) % V.length]; gr(t);
        ks.forEach(({e, j}) => { const f = ((t + j * .9) % 5) / 5; e.style.transform = `translateY(${Math.sin(t * .5 + j) * 14}px) scale(${f < .05 ? .9 : 1})`; }); });
    } else if (DIR === 4) { // hoja del cuaderno cuadriculado (se ve detrás de las hojas de cada escena)
      bg.style.background = p.bg; bg.appendChild(H.$('<div class="trama"></div>'));
    } else { // plano cartesiano de noche: cuadrícula, ejes, parábola y seno que se trazan, puntos con coordenadas
      bg.style.background = `radial-gradient(1400px 900px at 60% 30%,#16245a,${p.bg} 70%)`;
      capa(bg, '', `inset:0;background-image:linear-gradient(${rgba('#8ca8ff', .1)} 1px,transparent 1px),linear-gradient(90deg,${rgba('#8ca8ff', .1)} 1px,transparent 1px),linear-gradient(${rgba('#8ca8ff', .16)} 2px,transparent 2px),linear-gradient(90deg,${rgba('#8ca8ff', .16)} 2px,transparent 2px);background-size:60px 60px,60px 60px,240px 240px,240px 240px`);
      capa(bg, '', `left:0;right:0;top:779px;height:3px;background:${rgba(p.a, .45)}`); capa(bg, '', `left:1439px;top:0;bottom:0;width:3px;background:${rgba(p.a, .45)}`);
      capa(bg, `<div style="position:absolute;left:1890px;top:790px;font-family:Rubik;font-weight:700;font-size:30px;color:${rgba(p.a, .6)}">x</div><div style="position:absolute;left:1456px;top:10px;font-family:Rubik;font-weight:700;font-size:30px;color:${rgba(p.a, .6)}">y</div>`, 'inset:0');
      let d = 'M960 40'; for (let x = 960; x <= 1920; x += 20) { const u = (x - 1440) / 240; d += `L${x} ${(780 - u * u * 240 * .75).toFixed(1)}`; }
      const par = linea(bg, d, rgba(p.c, .5), 5, 8, 0);
      let s = 'M0 780'; for (let x = 0; x <= 1920; x += 16) s += `L${x} ${(780 - Math.sin((x - 1440) / 120) * 160).toFixed(1)}`;
      const sen = linea(bg, s, rgba(p.b, .32), 4, 11, 4);
      const pts = [[1680, 540, '(1, 0.75)'], [1200, 540, '(−1, 0.75)'], [1440, 780, '(0, 0)']].map(([x, y, l], j) => capa(bg, `<div style="position:absolute;left:-9px;top:-9px;width:18px;height:18px;border-radius:50%;background:${p.a};box-shadow:0 0 0 8px ${rgba(p.a, .2)}"></div><div style="position:absolute;left:18px;top:-48px;font-family:Rubik;font-weight:700;font-size:28px;white-space:nowrap;color:${rgba(p.ink, .45)}">${l}</div>`, `left:${x}px;top:${y}px;opacity:.85`));
      const f = H.$('<div class="fuga" style="left:-300px;top:-400px"></div>'); bg.appendChild(f);
      AMB.push((t) => { par(t); sen(t); pts.forEach((e, j) => { e.style.transform = `scale(${1 + .15 * Math.sin(t * 2 + j)})`; });
        f.style.transform = `translate(${Math.sin(t * .2) * 600 + 700}px,${Math.cos(t * .15) * 200}px)`; f.style.opacity = .5 + .4 * Math.sin(t * .7); });
    }
  },
  // director 1: trazos de gis que se dibujan detrás del texto (triángulo, círculo con su radio, flecha y subrayado)
  rayos(c, H, inverso) {
    const {pal} = H, R = [['M70 960V600L330 960Z', pal.ink], ['M1770 300m-120 0a120 120 0 1 0 240 0a120 120 0 1 0 -240 0M1770 300H1890', pal.c], ['M640 80H1240M1196 50L1240 80L1196 110', pal.a], ['M460 1000C800 960 1160 1040 1480 990', pal.a]];
    R.forEach(([d, col], i) => {
      const e = H.$(`<svg class="abs" width="1920" height="1080" style="left:0;top:0;overflow:visible"><path d="${d}" fill="none" stroke="${rgba(col, .42)}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/></svg>`);
      c.cam.insertBefore(e, c.cam.firstChild);
      c.tl.fromTo(e.querySelector('path'), {strokeDashoffset: inverso ? -1 : 1}, {strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut'}, .05 + i * .22);
    });
  },
  // director 3: la gráfica de una función en su plano (en DJ era la onda de audio)
  onda(c, o, H) {
    const {pal} = H, w = o.w, h = o.h, m = h / 2; let d = `M0 ${m}`;
    for (let x = 0; x <= w; x += 12) d += `L${x} ${(m - Math.sin(x / w * Math.PI * (o.b ? 3 : 4) + (o.b ? 1 : 0)) * h * .38).toFixed(1)}`;
    const tic = Array.from({length: Math.floor(w / 60)}, (_, j) => `<path d="M${j * 60} ${m - 6}v12" stroke="${rgba(pal.ink, .3)}" stroke-width="2"/>`).join('');
    const e = H.$(`<div class="abs" style="left:${o.x}px;top:${o.y}px;width:${w}px;height:${h}px"><svg width="${w}" height="${h}" style="overflow:visible"><path d="M0 ${m}H${w}" stroke="${rgba(pal.ink, .3)}" stroke-width="2"/>${tic}<path d="${d}" fill="none" stroke="${o.b ? pal.c : pal.a}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/></svg></div>`);
    (o.en || c.cam).appendChild(e);
    const ps = e.querySelectorAll('path'); c.tl.fromTo(ps[ps.length - 1], {strokeDashoffset: 1}, {strokeDashoffset: 0, duration: 1.4, ease: 'power1.inOut'}, .3);
    return e;
  },
  // cortes propios: el borrador limpia el pizarrón (1), la cuadrícula se llena (4) y un fundido con luz de gis (5)
  corte(DIR, k) {
    const {M, el, pv, t, FX, $, i} = k;
    if (DIR === 1) {
      const b = $(`<div class="abs" style="left:0;top:0;width:430px;height:1080px;opacity:0"><div class="abs" style="left:0;top:0;width:310px;height:1080px;background:linear-gradient(90deg,transparent,rgba(214,218,222,.22) 60%,rgba(214,218,222,.5))"></div><div class="abs" style="left:296px;top:400px;width:130px;height:280px;border-radius:16px;background:linear-gradient(90deg,#6b7076 0 26%,#c39558 26%);box-shadow:0 20px 40px rgba(0,0,0,.45)"></div></div>`); FX.appendChild(b);
      M.set(b, {opacity: 1}, t - .36); M.fromTo(b, {x: -430}, {x: 1920, duration: .52, ease: 'power2.inOut'}, t - .36); M.set(b, {opacity: 0}, t + .17);
      M.fromTo(el, {clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 0% 0 0)', duration: .52, ease: 'power2.inOut'}, t - .36); M.set(el, {clipPath: 'none'}, t + .17);
      M.fromTo(pv, {clipPath: 'inset(0 0 0 0%)'}, {clipPath: 'inset(0 0 0 100%)', duration: .52, ease: 'power2.inOut'}, t - .36); M.set(pv, {clipPath: 'none'}, t + .2);  // lo borrado ya no se ve
      return {on: t - .36, off: t + .17, sfx: i % 2 ? '' : 'whoosh'};
    }
    if (DIR === 4) {
      const cel = []; for (let r = 0; r < 5; r++) for (let q = 0; q < 8; q++) { const e = $(`<div class="abs" style="left:${q * 240}px;top:${r * 216}px;width:241px;height:217px;background:${(q + r) % 5 === 2 ? '#ffd23f' : (q + r) % 2 ? '#2563eb' : '#16285a'};transform:scale(0)"></div>`); FX.appendChild(e); cel.push([e, q + r]); }
      cel.forEach(([e, n]) => { M.fromTo(e, {scale: 0}, {scale: 1, duration: .14, ease: 'power2.out'}, t - .3 + n * .016); M.to(e, {scale: 0, duration: .16, ease: 'power2.in'}, t + .05 + n * .016); });
      return {on: t + .02, off: t + .04, sfx: 'whoosh'};
    }
    if (DIR === 5) {
      const f = $('<div class="abs" style="inset:0;opacity:0;background:#9cc0ff"></div>'); FX.appendChild(f);
      M.fromTo(el, {opacity: 0}, {opacity: 1, duration: .8, ease: 'sine.inOut'}, t - .4);
      M.fromTo(f, {opacity: 0}, {opacity: .14, duration: .4, yoyo: true, repeat: 1}, t - .4);
      return {on: t - .4, off: t + .4, sfx: i % 3 ? '' : 'whoosh'};
    }
    return null;
  },
  num: (DIR, j) => DIR === 3 ? String(j + 1).padStart(2, '0') : DIR === 5 ? '' : String(j + 1),
  chip: {bg: '#16285a', ink: '#ffffff', font: 'Rubik', tt: 'none'},
};

window.MKT_MUNDOS = {dibujo: DIBUJO, mecanica: MECANICA, canto: CANTO, ajedrez: AJEDREZ, legal: LEGAL, bebes: BEBES, matematicas: MATEMATICAS};
// el nicho del curso por su nombre (igual que temas.kit_de en Python)
window.MKT_NICHO_DE = (txt) => { const t = String(txt || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return /\bdj\b|disc ?jockey/.test(t) ? 'dj' : /mecanic|automotr|motocicl|\bmotos?\b/.test(t) ? 'mecanica' : /dibuj|ilustrac|boceto|acuarel/.test(t) ? 'dibujo' : /\bcanto\b|aprende a cantar|\bcantar\b|tecnica vocal|afinando voces/.test(t) ? 'canto' : /ajedrez|\bchess\b/.test(t) ? 'ajedrez' : /abogad|\bderecho\b|juridic|\bleyes\b|litigac|notari/.test(t) ? 'legal' : /recetas?( para| de)? beb|papillas?|alimentacion (infantil|complementaria)|comida para beb/.test(t) ? 'bebes' : /matematic|algebra|geometri|aritmetic|trigonometr|calculo diferencial/.test(t) ? 'matematicas' : ''; };
window.MKT_RGBA = rgba;
})();
