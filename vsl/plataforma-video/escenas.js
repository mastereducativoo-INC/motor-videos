/* Video «Así funciona tu plataforma». render(t) deja el cuadro exacto del segundo t.
   Celular quieto casi todo el tiempo; solo 5 acercamientos lentos (1.6 s de entrada y 1.6 s de salida), nunca encimados. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const cl = (x) => Math.max(0, Math.min(1, x));
  const seg = (t, a, b) => cl((t - a) / (b - a));
  const eio = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const eo = (x) => 1 - Math.pow(1 - x, 3);
  const back = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const lerp = (a, b, x) => a + (b - a) * x;
  const sm = (x) => x * x * x * (x * (x * 6 - 15) + 10);  // entrada y salida muy suaves
  const LEAD = 0.5, GAP = 0.7;
  // versiones: dónde va el celular, cuánto se acerca la cámara y a qué punto lleva lo importante
  const VERS = {
    1: {cx: 600, cy: 540, lv: [1.0, 1.36], A: [610, 520], tilt: -6},                 // Estudio dorado
    2: {cx: 560, cy: 540, lv: [1.6, 1.9], A: [540, 540], tilt: 0},                   // Primer plano
    3: {cx: 1330, cy: 540, lv: [1.0, 1.36], A: [1320, 520], tilt: 6, lx: [-60, 220]},                // Marfil
    4: {cx: 960, cy: 440, lv: [.86, 1.16], A: [960, 390], tilt: 0, orbita: 3, lx: [-240, 240]},        // Escenario
    5: {cx: 560, cy: 612, lv: [.9, 1.26], A: [560, 590], tilt: 0},                   // Capítulos
  };
  let G = 'A', VR, S = [], END = 0, SFX = [], ZM = [], DEDO = [], I = {}, T = {}, cambio = false;
  const ICO = {
    nube: '<svg viewBox="0 0 24 24"><path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6.1 9.6 4.2 4.2 0 0 0 7 18z" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    baja: '<svg viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    inf: '<svg viewBox="0 0 24 24"><path d="M7 9a3 3 0 1 0 0 6c3 0 7-6 10-6a3 3 0 1 1 0 6c-3 0-7-6-10-6z" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    cel: '<svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M11 18h2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    estrella: '<svg viewBox="0 0 24 24"><path d="M12 3l2.6 5.6 6.1.7-4.5 4.1 1.2 6L12 16.4 6.6 19.4l1.2-6L3.3 9.3l6.1-.7z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    capas: '<svg viewBox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5z M3 12.5l9 5 9-5M3 17l9 5 9-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    texto: '<svg viewBox="0 0 24 24"><path d="M5 6h14M5 11h14M5 16h9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    eti: '<svg viewBox="0 0 24 24"><path d="M3 12V4h8l10 10-8 8z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="7.5" cy="8.5" r="1.5" fill="currentColor"/></svg>',
    corona: '<svg viewBox="0 0 24 24"><path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
    flecha: '<svg viewBox="0 0 24 24"><path d="M5 19L19 5M9 5h10v10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    pago: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="13" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M3 10h18" stroke="currentColor" stroke-width="2"/></svg>',
    abre: '<svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 11V8a4 4 0 0 1 7.6-1.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    toque: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.5" fill="currentColor"/><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
    abajo: '<svg viewBox="0 0 24 24"><path d="M12 4v15M6 13l6 6 6-6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    ojo: '<svg viewBox="0 0 24 24"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };
  // segundo en que la voz dice w (la voz viene por frases con su segundo exacto)
  const cue = (i, w, frac) => { const s = S[i];
    if (s.p) for (const p of s.p) { const k = p.t.indexOf(w); if (k >= 0) return s.a + p.a + (p.h || p.d) * .9 * (k / p.t.length); }
    const k = s.t.indexOf(w); return s.a + s.d * (k >= 0 ? k / s.t.length : (frac == null ? .5 : frac)); };
  const fin = (i) => (i + 1 < S.length ? S[i + 1].a : END) - .3;
  const ini = (i) => S[i].a - .3;
  const CHIP = () => S[0].t.includes('Ahora') ? 'Ahora' : 'te muestro';

  /* ---------- plataforma (iframe) ---------- */
  const app = () => $('#app'), W = () => app().contentWindow, D = () => app().contentDocument;
  let estado = null;
  function poner(nombre) {
    if (estado === nombre) return;
    const M = W().MA; M.S.d = JSON.parse(JSON.stringify(window.DATA[nombre])); M.S.vista = 'pagina';
    M.pintar(); estado = nombre; cambio = true;
    D().querySelectorAll('.rv').forEach((x) => x.classList.add('in'));
    const h = D().querySelector('#hoja'); if (h && h.open) h.close();
    if (!D().getElementById('min')) { const st = D().createElement('style'); st.id = 'min'; st.textContent = '.quien,.cf-aviso,.ins-tarjeta{display:none!important}.v1 .barra-top{padding-top:56px!important}.hoja[open]{animation:none!important}.hoja::backdrop{opacity:var(--bo,1)}*{scroll-behavior:auto!important}'; D().head.appendChild(st); }
  }
  const q = (sel, i) => { const L = D().querySelectorAll(sel); return L[i || 0] || null; };
  const arriba = (sel, i) => { const e = q(sel, i); return e ? e.getBoundingClientRect().top + W().scrollY : 0; };
  const maxY = () => D().scrollingElement.scrollHeight - 844;
  function scroll(y) { W().scrollTo({top: Math.max(0, Math.min(maxY(), y)), behavior: 'instant'}); }
  // un foco en coordenadas de la pantalla (390x844)
  function foco(f) {
    if (!f) return [195, 422];
    if (f.cap) { const e = $(f.cap); return [e.offsetLeft + e.offsetWidth * (f.dx ?? .5), e.offsetTop + e.offsetHeight * (f.dy ?? .5)]; }
    const e = q(f.sel, f.i); if (!e) return [195, 422];
    const r = e.getBoundingClientRect(); return [r.left + r.width * (f.dx ?? .5), r.top + r.height * (f.dy ?? .5)];
  }
  function punto(f) {
    if (f.xy) return f.xy;
    if (f.cap) { const r = $(f.cap).getBoundingClientRect(); return [r.left + r.width * (f.dx ?? .5), r.top + r.height * (f.dy ?? .5)]; }
    const e = q(f.sel, f.i); if (!e) return null;
    const r = e.getBoundingClientRect(), fr = app().getBoundingClientRect(), s = fr.width / 390;
    return [fr.left + (r.left + r.width * (f.dx ?? .5)) * s, fr.top + (r.top + r.height * (f.dy ?? .5)) * s];
  }
  function marca(id, sel, i, op, cls, pad) {
    const m = $(id); m.className = 'marca ' + (cls || '');
    const e = sel ? q(sel, i) : null;
    if (!e || op <= 0) { m.style.opacity = 0; return; }
    const r = e.getBoundingClientRect(), p = pad == null ? 6 : pad;
    Object.assign(m.style, {left: r.left - p + 'px', top: r.top - p + 'px', width: r.width + 2 * p + 'px', height: r.height + 2 * p + 'px', opacity: op,
      borderRadius: (parseFloat(getComputedStyle(e).borderRadius) || 20) + p + 'px'});
  }
  function congelar(doc, t) { for (const a of doc.getAnimations()) { try { if (a.playState !== 'paused') a.pause(); a.currentTime = t * 1000; } catch (e) {} } }
  function capa(id, op, dy) { const c = $(id); c.style.opacity = op; c.style.transform = `translateY(${dy || 0}px)`; }

  /* ---------- cámara ---------- */
  // cada acercamiento: entra en [a, a+r], se queda, sale en [b, b+r]; el punto al que va se mide una sola vez (no tiembla)
  function zLleno(Z) {
    const [fx, fy] = Z.xy, ox = VR.cx - 238 + 23, oy = VR.cy - 487 + 23, P = [ox + fx * 1.1026, oy + fy * 1.1026], s = VR.lv[1];
    let tx = VR.A[0] - VR.cx - s * (P[0] - VR.cx), ty = VR.A[1] - VR.cy - s * (P[1] - VR.cy);
    // que el celular no se vaya de lado: sin huecos arriba/abajo y sin tapar el texto
    const h = 487 * s, m = 24, lim = VR.lx || [-220, 60];
    tx = Math.max(lim[0], Math.min(lim[1], tx));
    ty = Math.max(1080 - m - VR.cy - h, Math.min(m - VR.cy + h, ty));
    return {s, tx, ty};
  }
  function camara(t) {
    for (const Z of ZM) {
      if (t <= Z.a || t >= Z.b + Z.r) continue;
      const x = Math.min(sm(seg(t, Z.a, Z.a + Z.r)), 1 - sm(seg(t, Z.b, Z.b + Z.r)));
      return {s: lerp(VR.lv[0], Z.E.s, x), tx: Z.E.tx * x, ty: Z.E.ty * x, L: x};
    }
    return {s: VR.lv[0], tx: 0, ty: 0, L: 0};
  }

  /* ---------- dedo ---------- */
  function dedo(t, escala) {
    const d = $('#dedo'), pt = d.querySelector('.pt'), on = d.querySelector('.onda');
    let vis = 0, pos = null;
    for (const g of DEDO) {
      if (t < g.k[0].t - .5 || t > g.hasta) continue;
      vis = sm(Math.min(seg(t, g.k[0].t - .6, g.k[0].t - .1), 1 - seg(t, g.hasta - .45, g.hasta)));
      // k = último punto al que ya llegó; viaja al siguiente durante D segundos antes de llegar
      let k = 0; while (k + 1 < g.k.length && t >= g.k[k + 1].t) k++;
      const A = punto(g.k[k].p), B = k + 1 < g.k.length ? punto(g.k[k + 1].p) : null;
      const D = B ? Math.min(.95, g.k[k + 1].t - g.k[k].t - .05) : 0;
      if (A && B && t >= g.k[k + 1].t - D) { const x = sm(seg(t, g.k[k + 1].t - D, g.k[k + 1].t)); pos = [lerp(A[0], B[0], x), lerp(A[1], B[1], x)]; } else pos = A;
      let sc = 1, oo = 0, os = .4;
      for (const kk of g.k) if (kk.tap != null) { const u = t - kk.tap;
        if (u > -.12 && u < .18) sc = 1 - .22 * Math.sin(cl((u + .12) / .3) * Math.PI);
        if (u >= 0 && u < .6) { oo = 1 - u / .6; os = .4 + 1.4 * eo(u / .6); } }
      pt.style.transform = `scale(${sc})`; on.style.opacity = oo; on.style.transform = `scale(${os})`;
    }
    d.style.opacity = vis; if (pos) { d.style.left = pos[0] + 'px'; d.style.top = pos[1] + 'px'; }
    const dz = 64 * Math.max(.9, escala); d.style.width = d.style.height = dz + 'px'; d.style.margin = -dz / 2 + 'px 0 0 ' + -dz / 2 + 'px';
  }

  /* ---------- texto ---------- */
  let derDe = -1;
  function panel(i, t) {
    const P = S[i].panel, der = $('#der');
    if (derDe !== i) {
      derDe = i;
      der.innerHTML = P ? `<span class="num">${P.num || ''}</span><span class="paso ${P.c || ''}" data-a="${S[i].a + .1}"><b>${P.n}</b>${P.p}</span><h2 data-a="${S[i].a + .3}">${P.h}</h2>
        <ul class="${P.c || ''}">${P.li.map(([ic, tx, w]) => `<li data-a="${cue(i, w) - .15}"${P.ojo ? ` data-b="${cue(i, P.ojo[1]) - .3}"` : ''}><i>${ICO[ic]}</i><span>${tx}</span></li>`).join('')}</ul>
        ${P.ojo ? `<div class="ojo" data-a="${cue(i, P.ojo[1]) - .1}"><i>${ICO.ojo}</i><span>${P.ojo[0]}</span></div>` : ''}` : '';
      der.querySelectorAll('[data-a]').forEach((e) => { e._a = +e.dataset.a; e._b = e.dataset.b ? +e.dataset.b : null; });
    }
    if (!P) { der.style.opacity = 0; return; }
    const fx = P.hasta ? P.hasta() : fin(i), sal = seg(t, fx - .35, fx);
    der.style.opacity = 1 - sal; der.style.transform = VR.n === 4 ? `translateY(${30 * eio(sal)}px)` : `translateX(${(VR.n === 3 ? 30 : -30) * eio(sal)}px)`;
    der.querySelectorAll('[data-a]').forEach((e) => {
      const x = eo(seg(t, e._a, e._a + .55));
      if (e.classList.contains('ojo')) { e.style.opacity = x; e.style.transform = `scale(${.9 + .1 * back(seg(t, e._a, e._a + .6))})`; return; }
      e.style.opacity = x * (e._b != null && t > e._b ? lerp(1, .35, seg(t, e._b, e._b + .4)) : 1);
      e.style.transform = e.tagName === 'LI' ? `translate${VR.n === 4 ? 'Y' : 'X'}(${(1 - x) * (VR.n === 3 ? -60 : 60)}px)` : `translateY(${(1 - x) * 40}px)`;
      if (e.classList.contains('num')) e.style.opacity = x * .9;
    });
  }

  /* ---------- fondo ---------- */
  const POLVO = Array.from({length: 46}, (_, i) => ({x: (i * 137.5) % 100, y: (i * 61.8) % 100, v: 10 + (i % 7) * 3, s: .5 + (i % 5) * .25, f: i * .7}));
  function fondo(t) {
    $('.b1').style.transform = `translate(${Math.sin(t * .21) * 80}px,${Math.cos(t * .17) * 60}px)`;
    $('.b2').style.transform = `translate(${Math.cos(t * .19) * 90}px,${Math.sin(t * .23) * 50}px)`;
    $('.b3').style.transform = `translate(${Math.sin(t * .15 + 1) * 70}px,${Math.cos(t * .2) * 40}px)`;
    const pv = $('#polvo'); if (!pv.children.length) pv.innerHTML = POLVO.map(() => '<i></i>').join('');
    [...pv.children].forEach((e, k) => { const p = POLVO[k]; const y = ((p.y - t * p.v * .6) % 110 + 110) % 110 - 5;
      e.style.left = p.x + '%'; e.style.top = y + '%'; e.style.opacity = (.2 + .45 * (.5 + .5 * Math.sin(t * 1.3 + p.f))) * p.s; e.style.transform = `scale(${p.s})`; });
    $('.foco').style.transform = `rotate(${Math.sin(t * .3) * 4}deg)`;
  }
  function capitulos(t) {
    if (VR.n !== 5) return;
    const C = [['curso', 'Tu curso'], ['instalar', 'Instalar'], ['complementos', 'Complementos'], ['superpack', 'Súper Pack'], ['activa', 'Desbloquear']];
    const cp = $('#caps'); if (!cp.children.length) cp.innerHTML = C.map(([, n]) => `<div><i><b></b></i>${n}</div>`).join('');
    const vis = Math.min(eo(seg(t, ini(I.curso), ini(I.curso) + .6)), 1 - seg(t, ini(I.cierre), ini(I.cierre) + .5));
    cp.style.opacity = vis;
    C.forEach(([k], n) => { const a = S[I[k]].a, b = k === 'activa' ? fin(I.todo) : fin(I[k]);
      const d = cp.children[n]; d.querySelector('b').style.width = seg(t, a, b) * 100 + '%'; d.classList.toggle('on', t >= a - .3 && t < b + .3); });
  }

  /* ---------- armado ---------- */
  window.init = function (voz, ver, guion) {
    G = guion || 'A';
    VR = Object.assign({n: ver}, VERS[ver]); $('#st').className = 'v' + ver;
    let a = LEAD; S = voz.map((v) => { const s = {k: v.k, t: v.t, d: v.d, p: v.p, a}; a += v.d + GAP; return s; });
    END = S[S.length - 1].a + S[S.length - 1].d + 1.6;
    S.forEach((s, i) => I[s.k] = i);
    const F = (sel, i, dx, dy) => ({sel, i, dx, dy}), C = (cap, dx, dy) => ({cap, dx, dy});
    const reposo = {xy: [VR.n === 3 ? 1240 : VR.n === 4 ? 1080 : 760, 880]};
    const s = (k) => S[I[k]].a;
    S[I.curso].panel = {num: '01', n: 1, p: 'Tu curso', h: 'Tu curso, siempre arriba', li: [['nube', 'Se abre en Google Drive', 'Google'], ['baja', 'Míralo en línea o descárgalo', 'verlo'], ['inf', 'Tu acceso no caduca', 'acceso no']]};
    S[I.instalar].panel = {num: '02', n: 2, p: 'En tu celular', h: 'Llévala a un toque', li: [['cel', 'Toca «Instalar»', 'presiona'], ['estrella', 'Queda con el logo de Master Educativo', 'logo']]};
    T.tc = cue(I.curso, 'Tocas') + .35; T.ti = cue(I.instalar, 'presiona') + .55;
    T.tcf = cue(I.cierre, 'toca «Cómo'); T.tdis = cue(I.cierre, 'Disfruta');
    const zCurso = {a: T.tc - 1.9, b: T.tc + .45, f: F('.b-play')}, zIns = {a: T.ti - 1.9, b: T.ti + .4, f: F('.ins-btn')}, zCf = {a: T.tcf - 1.8, b: T.tcf + .25, f: F('.cf-btn'), r: 1.4};
    const dCurso = {k: [{t: s('curso') + 1.2, p: reposo}, {t: T.tc, p: F('.b-play'), tap: T.tc}], hasta: T.tc + .9};
    const dIns = {k: [{t: s('instalar') + .5, p: reposo}, {t: T.ti, p: F('.ins-btn'), tap: T.ti}], hasta: T.ti + .8};
    const dCf = {k: [{t: T.tcf - .9, p: reposo}, {t: T.tcf + .2, p: F('.cf-btn'), tap: T.tcf + .2}], hasta: T.tcf + 1.1};
    SFX = [{t: .2, f: 'riser', g: .35}, {t: T.tc, f: 'click', g: .8}, {t: T.ti, f: 'click', g: .8}, {t: T.ti + .9, f: 'pop', g: .7}];
    const pago = () => {  // tiempos de «Desbloquear → pagas → aprobado → candado» (A y B)
      T.tdes = cue(I.activa, G === 'A' ? 'Tocas' : 'tocas') + .25; T.tpag = Math.max(cue(I.activa, 'pagas') + .2, T.tdes + 1.05); T.tap = Math.max(cue(I.activa, 'aprueba'), T.tpag + .4);
      T.ta = cue(I.activa, 'se activa'); T.tcand = cue(I.activa, 'candado');
      SFX.push({t: T.tdes, f: 'click', g: .8}, {t: T.tpag, f: 'click', g: .8}, {t: T.tap, f: 'ding', g: .55}, {t: T.tcand, f: 'venta', g: .5});
    };
    const fin_ = {num: '✓', n: '✓', p: 'Listo', c: 'verde', li: [['toque', 'Para volver a ver este video: «Cómo funciona»', 'Cómo funciona']], hasta: () => T.tdis - .5};
    if (G === 'A') {
      S[I.complementos].panel = {num: '03', n: 3, p: 'Complementos', h: 'Herramientas extra para tu curso', li: [['capas', 'Acompañan a tu curso', 'herramientas'], ['texto', 'Cada uno con su descripción', 'descripción'], ['eti', 'Precio especial de alumno', 'precio']]};
      S[I.superpack].panel = {num: '04', n: 4, p: 'Súper Pack', c: 'vio', h: 'El siguiente nivel', li: [['corona', 'La versión más completa', 'completa'], ['flecha', 'Para llegar mucho más lejos', 'lejos']]};
      S[I.activa].panel = {num: '05', n: 5, p: 'Uno por uno', c: 'verde', h: 'Compra solo lo que quieras', li: [['toque', 'Tocas «Desbloquear»', 'Tocas'], ['pago', 'Pagas', 'pagas'], ['abre', 'Se activa al instante', 'candado']]};
      S[I.todo].panel = {num: '★', n: '★', p: 'Todo junto', h: 'Si los quieres todos', li: [['capas', 'Todos los complementos + el Súper Pack', 'todos los complementos'], ['eti', 'Una sola compra, mejor precio', 'una sola'], ['abajo', 'En tu plataforma, arriba de los complementos', 'justo arriba']],
        ojo: ['Solo aparece si no has comprado ninguno por separado', 'Solo aparece']};
      S[I.cierre].panel = Object.assign({h: VR.n === 3 ? 'Todo en un lugar' : 'Tu curso completo, en un lugar'}, fin_);
      T.tdet = cue(I.complementos, 'descripción') + .1; T.thf = cue(I.complementos, 'Y por ser') - .1; T.tsep = cue(I.activa, 'por separado');
      pago();
      // 20 nov (Christian): el video ya no toca «Lo quiero todo»; solo muestra dónde está la opción en la plataforma
      T.tesp = cue(I.todo, 'opción especial'); T.tarr = cue(I.todo, 'justo arriba'); T.tojo = cue(I.todo, 'Solo aparece');
      ZM = [zCurso, zIns, {a: T.ta - .15, b: fin(I.activa) - 1.75, f: F('.gal2 .g2', 0, .5, .45)}, {a: T.tarr - .6, b: fin(I.todo) - 1.9, f: F('.tj', 0, .5, .5)}, zCf];
      DEDO = [dCurso, dIns,
        {k: [{t: T.tdet - 1.1, p: reposo}, {t: T.tdet, p: F('.bp .ver'), tap: T.tdet}], hasta: T.tdet + .7},
        {k: [{t: T.tdes - 1.2, p: reposo}, {t: T.tdes, p: F('.bp .b-oro'), tap: T.tdes}, {t: T.tpag, p: C('#bPagar'), tap: T.tpag}], hasta: T.tpag + .7},
        dCf];
      SFX.push({t: T.tdet, f: 'click', g: .8});
    } else if (G === 'B') {  // compró algo y le falta algo
      S[I.biblioteca].panel = {num: '03', n: 3, p: 'Tu biblioteca', c: 'verde', h: 'Lo que ya es tuyo', li: [['check', 'Todo lo que ya compraste', 'compraste'], ['abre', 'Se abre con su botón «Abrir»', 'Abrir']]};
      S[I.falta].panel = {num: '04', n: 4, p: 'Lo que te falta', h: 'Listo para desbloquear', li: [['texto', 'Cada uno con su descripción', 'descripción'], ['eti', 'Precio especial de alumno', 'precio'], ['corona', 'Y el Súper Pack, si aún no lo tienes', 'Súper Pack']]};
      S[I.activa].panel = {num: '05', n: 5, p: 'Desbloquear', c: 'verde', h: 'Se activa al instante', li: [['toque', 'Tocas «Desbloquear»', 'tocas'], ['pago', 'Pagas', 'pagas'], ['abre', 'Aparece en tu biblioteca', 'biblioteca']]};
      S[I.cierre].panel = Object.assign({h: 'Todo en un mismo lugar'}, fin_);
      T.tab = cue(I.biblioteca, 'Abrir') + .35; T.tbib = cue(I.biblioteca, 'Tu biblioteca');
      T.tdet = cue(I.falta, 'descripción') + .1; T.thf = cue(I.falta, 'y, por ser') - .1; T.tsp = cue(I.falta, 'Y si aún'); T.tsep = cue(I.activa, 'Para activar');
      pago();
      ZM = [zCurso, zIns, {a: T.tab - 1.9, b: T.tab + .45, f: F('.g2 .b-abrir', 0)}, {a: T.ta - .15, b: fin(I.activa) - 1.75, f: F('.gal2 .g2', 1, .5, .45)}, zCf];
      DEDO = [dCurso, dIns,
        {k: [{t: T.tab - 1.2, p: reposo}, {t: T.tab, p: F('.g2 .b-abrir', 0), tap: T.tab}], hasta: T.tab + .8},
        {k: [{t: T.tdet - 1.1, p: reposo}, {t: T.tdet, p: F('.bp .ver'), tap: T.tdet}], hasta: T.tdet + .7},
        {k: [{t: T.tdes - 1.2, p: reposo}, {t: T.tdes, p: F('.bp .b-oro'), tap: T.tdes}, {t: T.tpag, p: C('#bPagar'), tap: T.tpag}], hasta: T.tpag + .7}, dCf];
      SFX.push({t: T.tab, f: 'click', g: .8}, {t: T.tdet, f: 'click', g: .8});
    } else {  // C: ya tiene todo
      S[I.biblioteca].panel = {num: '03', n: 3, p: 'Tu biblioteca', c: 'verde', h: 'Ya tienes todo', li: [['capas', 'Todos tus complementos', 'complementos'], ['corona', 'Y el Súper Pack', 'Súper Pack'], ['abre', 'Cada uno con su botón «Abrir»', 'Abrir']]};
      S[I.cierre].panel = Object.assign({h: 'Todo en un mismo lugar'}, fin_);
      T.tab = cue(I.biblioteca, 'Abrir') + .35; T.tsp = cue(I.biblioteca, 'Súper Pack');
      ZM = [zCurso, zIns, {a: T.tab - 1.9, b: T.tab + .45, f: F('.g2 .b-abrir', 3)}, zCf];
      DEDO = [dCurso, dIns, {k: [{t: T.tab - 1.2, p: reposo}, {t: T.tab, p: F('.g2 .b-abrir', 3), tap: T.tab}], hasta: T.tab + .8}, dCf];
      SFX.push({t: T.tab, f: 'click', g: .8});
    }
    ZM = ZM.map((z) => Object.assign({r: 1.6}, z));
    for (let i = 1; i < S.length; i++) SFX.push({t: ini(i), f: 'whoosh', g: .3});
    // pantalla de inicio
    const nombres = ['Notas', 'Fotos', 'Cámara', 'Música', 'Mapas', 'Clima', '', 'Correo', 'Calendario', 'Reloj', 'Ajustes', 'Tienda', 'Libros', 'Salud', 'Archivos', 'Contactos'];
    const col = ['#ffcf5c,#ff9f1a', '#ff7eb3,#7a5cff', '#9aa4b2,#4b5563', '#ff5f6d,#ffc371', '#4facfe,#00f2fe', '#56ccf2,#2f80ed', '', '#4facfe,#2b5876', '#ff6a88,#ff99ac', '#2c3e50,#4ca1af', '#8e9eab,#5a6772', '#43cea2,#185a9d', '#f7971e,#ffd200', '#ff416c,#ff4b2b', '#36d1dc,#5b86e5', '#bdc3c7,#2c3e50'];
    $('#rej').innerHTML = nombres.map((n, k) => k === 6 ? `<span class="ap me"><img src="/_bv/icono-192.png" alt=""><span>Master Edu</span></span>` : `<span class="ap"><i style="background:linear-gradient(140deg,${col[k]})"></i><span>${n}</span></span>`).join('');
    $('#chispas').innerHTML = Array.from({length: 18}, () => '<i class="chispa"></i>').join('');
    const tel = $('#tel'); tel.style.left = VR.cx - 238 + 'px'; tel.style.top = VR.cy - 487 + 'px';
    // medir una sola vez el punto de cada acercamiento (con la pantalla como se ve en ese momento)
    for (const Z of ZM) { const tt = Z.a + Z.r + .05, sc = S.findIndex((x, n) => tt >= ini(n) && tt < fin(n) + .3); plataforma(tt, sc); Z.xy = foco(Z.f); Z.E = zLleno(Z); }
    for (let n = 1; n < ZM.length; n++) if (ZM[n - 1].b + ZM[n - 1].r > ZM[n].a) console.error('acercamientos encimados', n);
    estado = null;
    window.TIEMPOS = {END, oferta: null /* 20 nov: ya no hay botón de compra dentro del video */, S: S.map((x) => ({k: x.k, a: +x.a.toFixed(3), d: x.d})), SFX, ZM: ZM.map((z) => [+z.a.toFixed(2), +z.b.toFixed(2)])};
    return window.TIEMPOS;
  };

  /* ---------- un cuadro ---------- */
  window.render = function (t) {
    cambio = false;
    fondo(t); capitulos(t);
    const sc = S.findIndex((s, i) => t >= ini(i) && t < fin(i) + .3); const i = sc < 0 ? (t < 1 ? 0 : S.length - 1) : sc;
    // intro
    const si = I.bienvenida, so = seg(t, fin(si) - .45, fin(si));
    $('#intro').style.opacity = 1 - so; $('#intro').style.transform = `translateY(${-40 * eio(so)}px) scale(${1 - .05 * so})`;
    const lg = eo(seg(t, .25, 1.3)); $('#iLogo').style.opacity = lg; $('#iLogo').style.letterSpacing = lerp(.95, .55, lg) + 'em';
    $('#iLinea').style.transform = `scaleX(${eio(seg(t, .6, 1.6))})`;
    const bg = eo(seg(t, cue(si, 'Bienvenido') - .1, cue(si, 'Bienvenido') + .7)); $('#iBig').style.opacity = bg; $('#iBig').style.transform = `translateY(${(1 - bg) * 50}px)`; $('#iBig').style.filter = `blur(${(1 - bg) * 10}px)`;
    const sb = eo(seg(t, cue(si, 'Gracias') - .1, cue(si, 'Gracias') + .5)); $('#iSub').style.opacity = sb; $('#iSub').style.transform = `translateY(${(1 - sb) * 30}px)`;
    const ch = back(seg(t, cue(si, CHIP()) - .1, cue(si, CHIP()) + .5)); $('#iChip').style.opacity = cl(ch); $('#iChip').style.transform = `scale(${.8 + .2 * ch})`;
    // fin
    const fi = I.cierre, fo = seg(t, END - 1, END), tf = T.tdis - .2;
    $('#fin').style.opacity = eo(seg(t, tf, tf + .6)) * (1 - fo);
    const ic = back(seg(t, tf, tf + .7)); $('#fIco').style.transform = `scale(${.5 + .5 * ic})`;
    const fb = eo(seg(t, tf + .1, tf + .7)); $('#fBig').style.opacity = fb; $('#fBig').style.transform = `translateY(${(1 - fb) * 40}px)`;
    $('#fLogo').style.opacity = eo(seg(t, cue(fi, 'bienvenido') - .2, cue(fi, 'bienvenido') + .6));
    $('#st').style.filter = fo > 0 ? `brightness(${1 - fo})` : '';
    // plataforma, cámara y celular
    plataforma(t, i);
    const tel = $('#tel'), en = sm(seg(t, ini(I.curso) - .2, ini(I.curso) + 1.3)), sale = sm(seg(t, tf - .25, tf + .85));
    const c = camara(t);
    const orb = VR.orbita ? Math.sin(t * .22) * VR.orbita * (1 - c.L) : 0, tilt = VR.tilt * (1 - c.L);
    tel.style.opacity = Math.min(en, 1 - sale);
    const sEnt = (.94 + .06 * en) * (1 - .06 * sale);
    tel.style.transform = `translate(${c.tx}px,${c.ty + (1 - en) * 90 + sale * 60}px) perspective(2400px) rotateY(${tilt + orb}deg) scale(${c.s * sEnt})`;
    panel(i, t);
    // v4: el degradado de los subtítulos queda fijo (antes aparecía de golpe en cada escena)
    $('#grad').style.opacity = sm(seg(t, ini(I.curso) - .2, ini(I.curso) + 1)) * (1 - sm(seg(t, tf - .25, tf + .6)));
    dedo(t, c.s);
    congelar(document, t); try { congelar(D(), t); } catch (e) {}
    return cambio;
  };

  const texto = (sel, i) => { const e = q(sel, i); return e ? e.textContent.trim() : ''; };
  const srcImg = (sel, i) => { const e = q(sel, i); return e ? e.getAttribute('src') : '/_bv/cov/curso.png'; };
  function drive(nombre, img) {
    const b = $('#cDrive .dtop b'); if (b.textContent === nombre) return;
    b.textContent = nombre; $('#cDrive .ruta').textContent = 'Mi unidad › ' + nombre; $('#cDrive .vista img').src = img; cambio = true;
  }
  function plataforma(t, i) {
    const k = S[i].k;
    ['#cDrive', '#cHome', '#cPago', '#cOk'].forEach((x) => capa(x, 0));
    const cortes = G === 'A' ? [S[I.todo].a, S[I.cierre].a] : G === 'B' ? [S[I.cierre].a] : []; let vl = 0;
    const BASE = {A: 'nada', B: 'uno', C: 'todo'}[G], NI = G === 'B' ? 1 : 0;
    for (const c of cortes) vl = Math.max(vl, sm(1 - cl(Math.abs(t - c) / .4)));
    $('#velo').style.opacity = vl;
    ['#m1', '#m2', '#m3'].forEach((m) => marca(m, null, 0, 0));
    $('#cand').style.opacity = 0; $('#etiq').style.opacity = 0; document.querySelectorAll('.chispa').forEach((c) => c.style.opacity = 0);
    const hoja = D().querySelector('#hoja');
    const quiereHoja = k === (G === 'B' ? 'falta' : 'complementos') && t >= T.tdet + .15 && t < T.thf;
    if (['bienvenida', 'curso', 'instalar'].includes(k)) poner(BASE);
    if (['complementos', 'superpack'].includes(k)) poner('nada');
    if (['bienvenida', 'curso', 'instalar'].includes(k)) scroll(0);
    if (k === 'curso') { drive('Tu curso', '/_bv/cov/curso.png'); const a = T.tc + .2, b = fin(I.curso) - .6, x = sm(seg(t, a, a + .7)) * (1 - sm(seg(t, b, b + .6))); capa('#cDrive', x, (1 - x) * 70); }
    if (k === 'instalar') {
      const a = T.ti + .25, b = fin(I.instalar) - .6, x = sm(seg(t, a, a + .7)) * (1 - sm(seg(t, b, b + .6)));
      capa('#cHome', x, (1 - x) * 30);
      $('#rej .me img').style.transform = `scale(${t < a + .55 ? 0 : back(seg(t, a + .55, a + 1.1))})`;
    }
    if (k === 'complementos') {
      const s0 = S[i].a, b0 = arriba('.bp', 0) - 110;
      scroll(lerp(0, b0, sm(seg(t, s0, s0 + 2.4))));  // empieza justo al cambiar de escena (sin brinco)
      const th = cue(I.complementos, 'herramientas');
      for (let n = 0; n < 3; n++) { const ap = th + n * .35; marca('#m' + (n + 1), '.bp', n, eo(seg(t, ap, ap + .4)) * (1 - seg(t, T.tdet - .6, T.tdet - .3)), '', 5); }
      const tp = cue(I.complementos, 'precio');
      if (t >= tp - .3) for (let n = 0; n < 3; n++) marca('#m' + (n + 1), '.bp-pie', n, eo(seg(t, tp - .2 + n * .25, tp + .2 + n * .25)) * (1 - seg(t, fin(i) - .5, fin(i) - .2)), '', 6);
    }
    if (hoja) { if (quiereHoja && !hoja.open) { const b = q('.bp .ver'); b && b.click(); cambio = true; } else if (!quiereHoja && hoja.open) hoja.close();
      if (quiereHoja) { const h0 = T.tdet + .15, h1 = T.thf, u = sm(seg(t, h0, h0 + .6)) * (1 - sm(seg(t, h1 - .5, h1)));
        hoja.style.opacity = u; hoja.style.transform = `translateY(${(1 - u) * 36}px)`; hoja.style.setProperty('--bo', u); } }
    if (k === 'superpack') {
      const s0 = S[i].a, b0 = arriba('.bp', 0) - 110, sp = arriba('.spx') - 40;
      scroll(lerp(b0, sp, sm(seg(t, s0, s0 + 2.0))));
      const ts = cue(I.superpack, 'siguiente'); marca('#m1', '.spx', 0, eo(seg(t, ts - .4, ts + .2)) * (1 - seg(t, fin(i) - .5, fin(i) - .2)), 'vio', 6);
    }
    if (k === 'activa') {
      const s0 = S[i].a;
      if (t < T.ta) {
        poner(G === 'B' ? 'uno' : 'nada');
        const sp = arriba('.spx') - 40, b0 = arriba('.bp', 0) - 110; scroll(lerp(sp, b0, sm(seg(t, s0, s0 + 1.8))));
        const tsep = T.tsep;
        for (let n = 0; n < 3; n++) marca('#m' + (n + 1), '.bp', n, eo(seg(t, tsep - .2 + n * .2, tsep + .2 + n * .2)) * (1 - seg(t, T.tdes - .9, T.tdes - .6)), 'verde', 5);
        const x = sm(seg(t, T.tdes + .15, T.tdes + .75)); capa('#cPago', x, (1 - x) * 80);
        $('#bPagar').textContent = t >= T.tpag + .1 ? 'Procesando…' : 'Comprar ahora';
        const o = sm(seg(t, T.tap - .3, T.tap + .3)); capa('#cOk', o);
        $('#okT').textContent = 'Pago aprobado'; $('#okS').textContent = 'Se está activando en tu plataforma…';
        $('#cOk .circ').style.transform = `scale(${.6 + .4 * back(seg(t, T.tap - .3, T.tap + .3))})`;
      } else {
        poner(G === 'B' ? 'dos' : 'uno'); scroll(arriba('.gal2 .g2', NI) - 260);
        const out = 1 - sm(seg(t, T.ta, T.ta + .7)); capa('#cOk', out); capa('#cPago', out);
        const card = q('.gal2 .g2', NI);
        if (card) card.style.filter = `grayscale(${1 - eo(seg(t, T.tcand, T.tcand + .6))}) brightness(${.55 + .45 * eo(seg(t, T.tcand, T.tcand + .6))})`;
        const cov = q('.gal2 .g2-cov', NI);
        if (cov) {
          const r = cov.getBoundingClientRect(), c = $('#cand'), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          c.style.left = cx + 'px'; c.style.top = cy + 'px';
          c.style.opacity = eo(seg(t, T.ta + .1, T.ta + .5)) * (1 - seg(t, T.tcand + .5, T.tcand + .9));
          c.style.transform = `scale(${.8 + .2 * eo(seg(t, T.ta + .1, T.ta + .5)) + .3 * seg(t, T.tcand + .5, T.tcand + .9)})`;
          const u = eo(seg(t, T.tcand - .1, T.tcand + .3)); $('#arco').setAttribute('transform', `translate(${u * 3.5} ${-u * 3}) rotate(${u * 18} 16 11)`);
          document.querySelectorAll('.chispa').forEach((e, n) => { const ang = n / 18 * Math.PI * 2, x = seg(t, T.tcand + .1, T.tcand + .9);
            e.style.left = cx + Math.cos(ang) * 110 * eo(x) + 'px'; e.style.top = cy + Math.sin(ang) * 110 * eo(x) + 'px'; e.style.opacity = x > 0 && x < 1 ? 1 - x : 0; });
        }
        const tb = cue(I.activa, 'biblioteca'); marca('#m1', '.gal2 .g2', NI, eo(seg(t, tb - .3, tb + .2)) * (1 - seg(t, fin(i) - .4, fin(i) - .1)), 'verde', 5);
      }
    }
    if (k === 'todo') {
      poner('nada'); scroll(arriba('.tj') - 150);
      marca('#m1', '.tj', 0, eo(seg(t, T.tesp - .3, T.tesp + .2)) * (1 - seg(t, T.tojo - .5, T.tojo - .2)), '', 6);
      marca('#m2', '.tj', 0, eo(seg(t, T.tojo - .2, T.tojo + .3)) * (1 - seg(t, fin(i) - .4, fin(i) - .1)), '', 6);
      const tj = q('.tj'); if (tj) { const r = tj.getBoundingClientRect(), e = $('#etiq'); e.style.left = r.left + r.width / 2 - e.offsetWidth / 2 + 'px'; e.style.top = r.top - 36 + 'px';
        const x = back(seg(t, T.tojo, T.tojo + .5)); e.style.opacity = cl(x) * (1 - seg(t, fin(i) - .4, fin(i) - .1)); e.style.transform = `scale(${.7 + .3 * x})`; }
    }
    if (k === 'biblioteca') {  // B y C
      poner(BASE); const s0 = S[i].a, yb = arriba('#biblioteca') - 40;
      if (G === 'B') {
        scroll(lerp(0, yb, sm(seg(t, s0, s0 + 2.4))));
        marca('#m1', '.gal2 .g2', 0, eo(seg(t, T.tbib - .3, T.tbib + .2)) * (1 - seg(t, T.tab - 1.4, T.tab - 1.1)), 'verde', 5);
        drive(texto('.gal2 .g2 h3', 0) || 'Tu complemento', srcImg('.gal2 .g2 img', 0));
      } else {
        const tsp = T.tsp;
        scroll(t < tsp - .4 ? lerp(0, yb, sm(seg(t, s0, s0 + 2.4))) : lerp(yb, maxY(), sm(seg(t, tsp - .4, tsp + 1.4))));
        const tc0 = cue(I.biblioteca, 'todos tus');
        for (let n = 0; n < 4; n++) { const ap = (n < 3 ? tc0 : tsp) + (n < 3 ? n * .3 : 0); marca('#m' + (n % 3 + 1), '.gal2 .g2', n, eo(seg(t, ap, ap + .4)) * (1 - seg(t, n < 3 ? tsp - .5 : T.tab - 1.4, n < 3 ? tsp - .2 : T.tab - 1.1)), 'verde', 5); }
        drive(texto('.gal2 .g2 h3', 3) || 'Súper Pack', srcImg('.gal2 .g2 img', 3));
      }
      const a = T.tab + .2, b = fin(i) - .6, x = sm(seg(t, a, a + .7)) * (1 - sm(seg(t, b, b + .6))); capa('#cDrive', x, (1 - x) * 70);
    }
    if (k === 'falta') {  // B: lo que aún le falta
      poner('uno'); const s0 = S[i].a, yb = arriba('#biblioteca') - 40, b0 = arriba('.bp', 0) - 110, sp = arriba('.spx') - 40;
      scroll(t < T.tsp - .3 ? lerp(yb, b0, sm(seg(t, s0, s0 + 2.4))) : lerp(b0, sp, sm(seg(t, T.tsp - .3, T.tsp + 1.7))));
      const tcd = cue(I.falta, 'candado');
      for (let n = 0; n < 2; n++) { const ap = tcd + n * .35; marca('#m' + (n + 1), '.bp', n, eo(seg(t, ap, ap + .4)) * (1 - seg(t, T.tdet - .6, T.tdet - .3)), '', 5); }
      const tp = cue(I.falta, 'precio');
      if (t >= tp - .3 && t < T.tsp) for (let n = 0; n < 2; n++) marca('#m' + (n + 1), '.bp-pie', n, eo(seg(t, tp - .2 + n * .25, tp + .2 + n * .25)) * (1 - seg(t, T.tsp - .6, T.tsp - .3)), '', 6);
      const tv = cue(I.falta, 'Súper Pack'); if (t >= T.tsp) marca('#m3', '.spx', 0, eo(seg(t, tv, tv + .5)) * (1 - seg(t, fin(i) - .5, fin(i) - .2)), 'vio', 6);
    }
    if (k === 'cierre') {
      poner(G === 'B' ? 'dos' : 'todo');
      const s0 = S[i].a, yb = arriba('#biblioteca') - 30;
      if (G === 'C') scroll(maxY());
      else scroll(lerp(0, yb + 360, sm(seg(t, s0 + .2, T.tcf - 2.1))));  // la barra de arriba (con «Cómo funciona») se queda fija
      marca('#m1', '.cf-btn', 0, eo(seg(t, T.tcf - .2, T.tcf + .3)) * (1 - seg(t, T.tdis - .6, T.tdis - .3)), '', 5);
    }
  }
})();
