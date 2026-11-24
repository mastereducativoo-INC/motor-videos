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

window.MKT_MUNDOS = {dibujo: DIBUJO, mecanica: MECANICA, canto: CANTO};
// el nicho del curso por su nombre (igual que temas.kit_de en Python)
window.MKT_NICHO_DE = (txt) => { const t = String(txt || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  return /\bdj\b|disc ?jockey/.test(t) ? 'dj' : /mecanic|automotr|motocicl|\bmotos?\b/.test(t) ? 'mecanica' : /dibuj|ilustrac|boceto|acuarel/.test(t) ? 'dibujo' : /\bcanto\b|aprende a cantar|\bcantar\b|tecnica vocal|afinando voces/.test(t) ? 'canto' : ''; };
window.MKT_RGBA = rgba;
})();
