/* Video de bienvenida de la plataforma · línea de tiempo determinista: render(t) deja el cuadro exacto del segundo t. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const cl = (x) => Math.max(0, Math.min(1, x));
  const seg = (t, a, b) => cl((t - a) / (b - a));
  const eio = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const eo = (x) => 1 - Math.pow(1 - x, 3);
  const back = (x) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const lerp = (a, b, x) => a + (b - a) * x;
  const LEAD = 0.5, GAP = 0.75;
  let V, S = [], END = 0, SFX = [];
  const ICO = {
    play: '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l11-6.5z" fill="currentColor"/></svg>',
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
    lib: '<svg viewBox="0 0 24 24"><path d="M4 5v14M9 5v14M14 5l5 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.2 4.2L19 7" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  };

  /* ---------- tiempos a partir de la voz ---------- */
  function cue(i, w, frac) {
    const s = S[i]; const k = s.t.indexOf(w);
    return s.a + s.d * (k >= 0 ? k / s.t.length : (frac == null ? .5 : frac));
  }
  const fin = (i) => (i + 1 < S.length ? S[i + 1].a : END) - .35;
  const ini = (i) => S[i].a - .35;

  /* ---------- plataforma (iframe) ---------- */
  const app = () => $('#app');
  const W = () => app().contentWindow, D = () => app().contentDocument;
  let estado = null;
  function poner(nombre) {
    if (estado === nombre) return;
    const M = W().MA; M.S.d = JSON.parse(JSON.stringify(window.DATA[nombre])); M.S.vista = 'pagina';
    try { W().localStorage.removeItem('me_ultimo:' + String(M.S.t).slice(0, 16)); } catch (e) {}
    M.pintar(); estado = nombre;
    D().querySelectorAll('.rv').forEach((x) => x.classList.add('in'));
    const h = D().querySelector('#hoja'); if (h && h.open) h.close();
  }
  const q = (sel, i) => { const L = D().querySelectorAll(sel); return L[i || 0] || null; };
  const arriba = (sel, i) => { const e = q(sel, i); return e ? e.getBoundingClientRect().top + W().scrollY : 0; };
  const maxY = () => D().scrollingElement.scrollHeight - 844;
  function scroll(y) { W().scrollTo({top: Math.max(0, Math.min(maxY(), y)), behavior: 'instant'}); }
  // punto de un elemento (de la plataforma o de una capa) en coordenadas del video
  function punto(obj) {
    if (!obj) return null;
    if (obj.xy) return obj.xy;
    if (obj.cap) { const r = $(obj.cap).getBoundingClientRect(); return [r.left + r.width * (obj.dx ?? .5), r.top + r.height * (obj.dy ?? .5)]; }
    const e = q(obj.sel, obj.i); if (!e) return null;
    const r = e.getBoundingClientRect(), f = app().getBoundingClientRect(), s = f.width / 390;
    return [f.left + (r.left + r.width * (obj.dx ?? .5)) * s, f.top + (r.top + r.height * (obj.dy ?? .5)) * s];
  }
  // recuadro sobre un elemento de la plataforma (en coordenadas de 390x844)
  function marca(id, sel, i, op, cls, pad) {
    const m = $(id); m.className = 'marca ' + (cls || '');
    const e = sel ? q(sel, i) : null;
    if (!e || op <= 0) { m.style.opacity = 0; return; }
    const r = e.getBoundingClientRect(), p = pad == null ? 6 : pad;
    Object.assign(m.style, {left: r.left - p + 'px', top: r.top - p + 'px', width: r.width + 2 * p + 'px', height: r.height + 2 * p + 'px', opacity: op,
      borderRadius: (parseFloat(getComputedStyle(e).borderRadius) || 20) + p + 'px'});
  }

  /* ---------- congelar todas las animaciones en el segundo t ---------- */
  function congelar(doc, t) {
    for (const a of doc.getAnimations()) { try { if (a.playState !== 'paused') a.pause(); a.currentTime = t * 1000; } catch (e) {} }
  }

  /* ---------- dedo ---------- */
  let DEDO = [], CAM = [];
  function dedo(t) {
    const d = $('#dedo'), pt = d.querySelector('.pt'), on = d.querySelector('.onda');
    let vis = 0, pos = null;
    for (const g of DEDO) {
      if (t < g.k[0].t - .5 || t > g.hasta) continue;
      vis = Math.min(seg(t, g.k[0].t - .5, g.k[0].t - .15), 1 - seg(t, g.hasta - .35, g.hasta));
      let k = 0; while (k + 1 < g.k.length && t >= g.k[k + 1].t - .6) k++;
      const A = punto(g.k[k].p), B = k + 1 < g.k.length ? punto(g.k[k + 1].p) : null;
      if (B && t >= g.k[k + 1].t - .6) { const x = eio(seg(t, g.k[k + 1].t - .6, g.k[k + 1].t)); pos = [lerp(A[0], B[0], x), lerp(A[1], B[1], x)]; }
      else pos = A;
      // toques
      let sc = 1, oo = 0, os = .4;
      for (const kk of g.k) if (kk.tap != null) {
        const u = t - kk.tap;
        if (u > -.12 && u < .18) sc = 1 - .22 * Math.sin(cl((u + .12) / .3) * Math.PI);
        if (u >= 0 && u < .6) { oo = 1 - u / .6; os = .4 + 1.4 * eo(u / .6); }
      }
      pt.style.transform = `scale(${sc})`; on.style.opacity = oo; on.style.transform = `scale(${os})`;
    }
    d.style.opacity = vis;
    if (pos) { d.style.left = pos[0] + 'px'; d.style.top = pos[1] + 'px'; }
  }

  /* ---------- panel de la derecha ---------- */
  let derDe = -1;
  function panel(i, t) {
    const P = S[i].panel, der = $('#der');
    if (derDe !== i) {
      derDe = i;
      der.innerHTML = P ? `<span class="paso ${P.c || ''}" data-a="${S[i].a + .1}"><b>${P.n}</b>${P.p}</span><h2 data-a="${S[i].a + .3}">${P.h}</h2>
        <ul class="${P.c || ''}">${P.li.map(([ic, tx, w]) => `<li data-a="${cue(i, w) - .15}"><i>${ICO[ic]}</i><span>${tx}</span></li>`).join('')}</ul>` : '';
      der.querySelectorAll('[data-a]').forEach((e) => e._a = +e.dataset.a);
    }
    if (!P) return;
    const salida = seg(t, fin(i) - .35, fin(i));
    der.style.opacity = 1 - salida; der.style.transform = `translateX(${-30 * eio(salida)}px)`;
    der.querySelectorAll('[data-a]').forEach((e) => {
      const x = eo(seg(t, e._a, e._a + .55));
      e.style.opacity = x; e.style.transform = e.tagName === 'LI' ? `translateX(${(1 - x) * 60}px)` : `translateY(${(1 - x) * 40}px)`;
      if (e.tagName === 'LI' && P.marcar) e.classList.toggle('on', t >= e._a);
    });
  }

  /* ---------- fondo ---------- */
  const POLVO = Array.from({length: 46}, (_, i) => ({x: (i * 137.5) % 100, y: (i * 61.8) % 100, v: 10 + (i % 7) * 3, s: .5 + (i % 5) * .25, f: i * .7}));
  function fondo(t) {
    $('.b1').style.transform = `translate(${Math.sin(t * .21) * 80}px,${Math.cos(t * .17) * 60}px)`;
    $('.b2').style.transform = `translate(${Math.cos(t * .19) * 90}px,${Math.sin(t * .23) * 50}px)`;
    $('.b3').style.transform = `translate(${Math.sin(t * .15 + 1) * 70}px,${Math.cos(t * .2) * 40}px)`;
    const pv = $('#polvo');
    if (!pv.children.length) pv.innerHTML = POLVO.map(() => '<i></i>').join('');
    [...pv.children].forEach((e, k) => { const p = POLVO[k]; const y = ((p.y - t * p.v * .6) % 110 + 110) % 110 - 5;
      e.style.left = p.x + '%'; e.style.top = y + '%'; e.style.opacity = (.25 + .5 * (.5 + .5 * Math.sin(t * 1.3 + p.f))) * p.s; e.style.transform = `scale(${p.s})`; });
  }

  /* ---------- capas del celular ---------- */
  function capa(id, op, dy) { const c = $(id); c.style.opacity = op; c.style.transform = `translateY(${(dy || 0)}px)`; }

  /* ---------- armado ---------- */
  window.init = function (voz) {
    V = voz; let a = LEAD;
    S = V.map((v) => { const s = {k: v.k, t: v.t, d: v.d, a}; a += v.d + GAP; return s; });
    END = S[S.length - 1].a + S[S.length - 1].d + 1.8;
    const I = {}; S.forEach((s, i) => I[s.k] = i);
    const P = (sel, i, dx, dy) => ({sel, i, dx, dy});
    const reposo = {xy: [700, 900]};
    // paneles
    S[I.curso].panel = {n: 1, p: 'Tu curso', h: 'Tu curso, siempre arriba', li: [['nube', 'Se abre en Google Drive', 'Gúgol'], ['baja', 'Míralo en línea o descárgalo', 'verlo'], ['inf', 'Tu acceso no caduca', 'acceso no']]};
    S[I.instalar].panel = {n: 2, p: 'En tu celular', h: 'Llévala a un toque', li: [['cel', 'Toca «Instalar»', 'presiona'], ['estrella', 'Queda con el logo de Master Educativo', 'logo']]};
    S[I.complementos].panel = {n: 3, p: 'Complementos', h: 'Herramientas extra para tu curso', li: [['capas', 'Acompañan a tu curso', 'herramientas'], ['texto', 'Cada uno con su descripción', 'descripción'], ['eti', 'Precio especial de alumno', 'precio']]};
    S[I.superpack].panel = {n: 4, p: 'Súper Pack', c: 'vio', h: 'El siguiente nivel', li: [['corona', 'La versión más completa', 'completa'], ['flecha', 'Para llegar mucho más lejos', 'lejos']]};
    S[I.activa].panel = {n: '✓', p: 'Al instante', c: 'verde', h: 'Se activa aquí mismo', li: [['pago', 'Pagas', 'pagas'], ['abre', 'Se abre el candado', 'candado'], ['lib', 'Aparece en tu biblioteca', 'biblioteca']]};
    S[I.todo].panel = {n: '★', p: 'Todo junto', h: 'Tu curso completo', li: [['capas', 'Todos los complementos', 'todos los'], ['corona', 'Y el Súper Pack', 'Súper Pak'], ['eti', 'En una sola compra, a mejor precio', 'una sola']]};
    // toques
    const tc = cue(I.curso, 'Tocas') + .35, ti = cue(I.instalar, 'presiona') + .55;
    const tdet = cue(I.complementos, 'descripción') + .1;
    const tdes = cue(I.activa, 'Tocas') + .25, tpag = cue(I.activa, 'pagas') + .25;
    const tofe = cue(I.todo, 'Lo quiero') + .7;
    DEDO = [
      {k: [{t: S[I.curso].a + 1.1, p: reposo}, {t: tc, p: P('.b-play'), tap: tc}], hasta: tc + .9},
      {k: [{t: S[I.instalar].a + .4, p: reposo}, {t: ti, p: P('.ins-btn'), tap: ti}], hasta: ti + .8},
      {k: [{t: tdet - 1, p: reposo}, {t: tdet, p: P('.bp .ver'), tap: tdet}], hasta: tdet + .7},
      {k: [{t: tdes - 1.1, p: reposo}, {t: tdes, p: P('.bp .b-oro'), tap: tdes}, {t: tpag, p: {cap: '#bPagar'}, tap: tpag}], hasta: tpag + .7},
      {k: [{t: tofe - 1.2, p: reposo}, {t: tofe, p: P('.guia-of-btn'), tap: tofe}], hasta: tofe + .7},
    ];
    // cámara: acercamientos sobre lo que se toca o se explica
    const tcand = cue(I.activa, 'candado'), ta = cue(I.activa, 'activa'), tq = cue(I.todo, 'Lo quiero'), tas = cue(I.todo, 'Así tienes');
    CAM = [
      {a: tc - 1.6, b: tc + .35, z: 1.3, sel: '.b-play'},
      {a: ti - 1.4, b: ti + .45, z: 1.42, sel: '.ins-btn'},
      {a: cue(I.complementos, 'video') - .5, b: cue(I.complementos, 'complementos') + .3, z: 1.18, sel: '.guia-video'},
      {a: cue(I.complementos, 'herramientas') - .2, b: tdet - .2, z: 1.16, sel: '.bp', i: 1},
      {a: cue(I.complementos, 'precio') - .3, b: fin(I.complementos) - .2, z: 1.2, sel: '.bp', i: 1},
      {a: cue(I.superpack, 'siguiente') - .6, b: fin(I.superpack) - .3, z: 1.16, sel: '.spx', dy: .35},
      {a: tdes - 1.3, b: tdes + .3, z: 1.32, sel: '.bp .b-oro'},
      {a: ta + .1, b: fin(I.activa) - .25, z: 1.34, sel: '.gal2 .g2', dy: .5},
      {a: tq - 1, b: T0 => 0, z: 1.25, sel: '.guia-of', dy: .1},
    ];
    CAM[8].b = tofe + .4;
    // efectos de sonido
    SFX = [{t: .2, f: 'riser', g: .35}, {t: tc, f: 'click', g: .8}, {t: ti, f: 'click', g: .8}, {t: ti + .9, f: 'pop', g: .7}, {t: tdet, f: 'click', g: .8},
      {t: tdes, f: 'click', g: .8}, {t: tpag, f: 'click', g: .8}, {t: cue(I.activa, 'aprueba'), f: 'ding', g: .55}, {t: cue(I.activa, 'candado'), f: 'venta', g: .5},
      {t: tofe, f: 'click', g: .8}, {t: tofe + .35, f: 'ding', g: .55}];
    for (let i = 1; i < S.length; i++) SFX.push({t: ini(i), f: 'whoosh', g: .32});
    window.TIEMPOS = {END, oferta: +(cue(I.todo, 'Lo quiero') - .6).toFixed(2), S: S.map((s) => ({k: s.k, a: +s.a.toFixed(3), d: s.d})), SFX};
    window.__I = I; window.__T = {tc, ti, tdet, tdes, tpag, tofe};
    // pantalla de inicio con íconos genéricos
    const nombres = ['Notas', 'Fotos', 'Cámara', 'Música', 'Mapas', 'Clima', '', 'Correo', 'Calendario', 'Reloj', 'Ajustes', 'Tienda', 'Libros', 'Salud', 'Archivos', 'Contactos'];
    const col = ['#ffcf5c,#ff9f1a', '#ff7eb3,#7a5cff', '#9aa4b2,#4b5563', '#ff5f6d,#ffc371', '#4facfe,#00f2fe', '#56ccf2,#2f80ed', '', '#4facfe,#2b5876', '#ff6a88,#ff99ac', '#2c3e50,#4ca1af', '#8e9eab,#5a6772', '#43cea2,#185a9d', '#f7971e,#ffd200', '#ff416c,#ff4b2b', '#36d1dc,#5b86e5', '#bdc3c7,#2c3e50'];
    $('#rej').innerHTML = nombres.map((n, k) => k === 6 ? `<span class="ap me"><img src="/_bv/icono-192.png" alt=""><span>Master Edu</span></span>` : `<span class="ap"><i style="background:linear-gradient(140deg,${col[k]})"></i><span>${n}</span></span>`).join('');
    $('#chispas').innerHTML = Array.from({length: 18}, () => '<i class="chispa"></i>').join('');
    return window.TIEMPOS;
  };

  /* ---------- un cuadro ---------- */
  window.render = function (t) {
    const I = window.__I, T = window.__T;
    fondo(t);
    const sc = S.findIndex((s, i) => t >= ini(i) && t < fin(i) + .35); const i = sc < 0 ? S.length - 1 : sc;
    // intro
    const si = I.bienvenida, so = seg(t, fin(si) - .45, fin(si));
    $('#intro').style.opacity = 1 - so; $('#intro').style.transform = `translateY(${-40 * eio(so)}px) scale(${1 - .04 * so})`;
    const lg = eo(seg(t, .25, 1.3)); $('#iLogo').style.opacity = lg; $('#iLogo').style.letterSpacing = lerp(.95, .55, lg) + 'em';
    $('#iLinea').style.transform = `scaleX(${eio(seg(t, .6, 1.6))})`;
    const bg = eo(seg(t, cue(si, 'Bienvenido') - .1, cue(si, 'Bienvenido') + .7)); $('#iBig').style.opacity = bg; $('#iBig').style.transform = `translateY(${(1 - bg) * 50}px)`; $('#iBig').style.filter = `blur(${(1 - bg) * 10}px)`;
    const sb = eo(seg(t, cue(si, 'Gracias') - .1, cue(si, 'Gracias') + .5)); $('#iSub').style.opacity = sb; $('#iSub').style.transform = `translateY(${(1 - sb) * 30}px)`;
    const ch = back(seg(t, cue(si, 'Ahora') - .1, cue(si, 'Ahora') + .5)); $('#iChip').style.opacity = cl(ch); $('#iChip').style.transform = `scale(${.8 + .2 * ch})`;
    // celular
    const tel = $('#tel'), en = eo(seg(t, ini(I.curso) - .1, ini(I.curso) + .9)), sale = eio(seg(t, ini(I.cierre) - .2, ini(I.cierre) + .6));
    const zoomSp = Math.sin(Math.PI * seg(t, S[I.superpack].a, fin(I.superpack))) * .03;
    tel.style.opacity = Math.min(en, 1 - sale);
    plataforma(t, i, I, T);
    let cs = 1, ctx = 0, cty = 0;
    for (const c of CAM) {
      if (t < c.a || t > c.b) continue;
      const w = Math.min(eio(seg(t, c.a, c.a + .7)), 1 - eio(seg(t, c.b - .7, c.b)));
      const e = q(c.sel, c.i); if (!e || w <= 0) continue;
      const r = e.getBoundingClientRect(), fx = r.left + r.width * (c.dx ?? .5), fy = r.top + r.height * (c.dy ?? .5);
      const Px = 350 + fx * 1.1026, Py = 76 + fy * 1.1026, s = 1 + (c.z - 1) * w;
      cs = s; ctx = (Px - 565) * (1 - s - .5 * w); cty = (Py - 540) * (1 - s - .5 * w);
    }
    tel.style.transform = `translate(${ctx}px,${cty + (1 - en) * 140 + sale * 60}px) scale(${(.94 + .06 * en + zoomSp - sale * .08) * cs}) rotate(${Math.sin(t * .4) * .35 * (2 - cs)}deg)`;
    // fin
    const fi = I.cierre, fo = seg(t, END - .8, END);
    $('#fin').style.opacity = eo(seg(t, S[fi].a - .1, S[fi].a + .6)) * (1 - fo);
    const ic = back(seg(t, S[fi].a, S[fi].a + .7)); $('#fIco').style.transform = `scale(${.5 + .5 * ic})`;
    const fb = eo(seg(t, cue(fi, 'Disfruta') - .1, cue(fi, 'Disfruta') + .6)); $('#fBig').style.opacity = fb; $('#fBig').style.transform = `translateY(${(1 - fb) * 40}px)`;
    $('#fLogo').style.opacity = eo(seg(t, cue(fi, 'bienvenido') - .2, cue(fi, 'bienvenido') + .6));
    $('#st').style.filter = fo > 0 ? `brightness(${1 - fo})` : '';
    panel(i, t);
    dedo(t);
    congelar(document, t); try { congelar(D(), t); } catch (e) {}
  };

  function plataforma(t, i, I, T) {
    const k = S[i].k;
    capa('#cDrive', 0); capa('#cHome', 0); capa('#cPago', 0); capa('#cOk', 0);
    ['#m1', '#m2', '#m3'].forEach((m) => marca(m, null, 0, 0));
    $('#cand').style.opacity = 0; document.querySelectorAll('.chispa').forEach((c) => c.style.opacity = 0);
    const hoja = D().querySelector('#hoja');
    const quiereHoja = k === 'complementos' && t >= T.tdet + .15 && t < cue(I.complementos, 'Y por ser') - .1;
    if (k === 'bienvenida' || k === 'curso' || k === 'instalar' || k === 'complementos' || k === 'superpack') poner('nada');
    if (k === 'bienvenida' || k === 'curso' || k === 'instalar') scroll(0);
    if (k === 'curso') {
      const a = T.tc + .2, b = fin(I.curso) - .55;
      const x = eo(seg(t, a, a + .5)) * (1 - eio(seg(t, b, b + .45)));
      capa('#cDrive', x, (1 - x) * 160);
    }
    if (k === 'instalar') {
      const a = T.ti + .25, b = fin(I.instalar) - .5;
      const x = eo(seg(t, a, a + .5)) * (1 - eio(seg(t, b, b + .45)));
      capa('#cHome', x, (1 - x) * 40);
      const me = $('#rej .me img'), p = back(seg(t, a + .55, a + 1.1));
      me.style.transform = `scale(${t < a + .55 ? 0 : p})`;
    }
    if (k === 'complementos') {
      const s0 = S[i].a, g = arriba('.guia') - 60, b0 = arriba('.bp', 0) - 96;
      const tcomp = cue(I.complementos, 'complementos');
      let y = lerp(0, g, eio(seg(t, s0 - .2, s0 + 1.5)));
      y = lerp(y, b0, eio(seg(t, tcomp - .1, tcomp + 1.2)));
      scroll(y);
      const tv = cue(I.complementos, 'video');
      marca('#m1', '.guia-video', 0, eo(seg(t, tv - .3, tv + .2)) * (1 - seg(t, tcomp, tcomp + .4)), '', 8);
      const th = cue(I.complementos, 'herramientas');
      if (t >= tcomp + .4) for (let n = 0; n < 3; n++) {
        const ap = th + n * .35;
        marca('#m' + (n + 1), '.bp', n, eo(seg(t, ap, ap + .4)) * (1 - seg(t, T.tdet - .5, T.tdet - .2)), '', 5);
      }
      const tp = cue(I.complementos, 'precio');
      if (t >= tp - .3) for (let n = 0; n < 3; n++) marca('#m' + (n + 1), '.bp-pie', n, eo(seg(t, tp - .2 + n * .25, tp + .2 + n * .25)) * (1 - seg(t, fin(i) - .5, fin(i) - .2)), '', 6);
    }
    if (hoja) { if (quiereHoja && !hoja.open) { const b = q('.bp .ver'); b && b.click(); } else if (!quiereHoja && hoja.open) hoja.close(); }
    if (k === 'superpack') {
      const s0 = S[i].a, b0 = arriba('.bp', 0) - 96, sp = arriba('.spx') - 40;
      scroll(lerp(b0, sp, eio(seg(t, s0 - .3, s0 + 1.3))));
      const ts = cue(I.superpack, 'siguiente');
      marca('#m1', '.spx', 0, eo(seg(t, ts - .4, ts + .2)) * (1 - seg(t, fin(i) - .5, fin(i) - .2)), 'vio', 6);
    }
    if (k === 'activa') {
      const s0 = S[i].a, ta = cue(I.activa, 'activa'), tcand = cue(I.activa, 'candado'), tbib = cue(I.activa, 'biblioteca'), tap = cue(I.activa, 'aprueba');
      if (t < ta) {
        poner('nada');
        const sp = arriba('.spx') - 40, b0 = arriba('.bp', 0) - 96;
        scroll(lerp(sp, b0, eio(seg(t, s0 - .3, s0 + .9))));
        const x = eo(seg(t, T.tdes + .2, T.tdes + .7));
        capa('#cPago', x, (1 - x) * 200);
        $('#bPagar').textContent = t >= T.tpag + .1 ? 'Procesando…' : 'Comprar ahora';
        const o = eo(seg(t, tap - .3, tap + .2)); capa('#cOk', o);
        $('#okT').textContent = 'Pago aprobado'; $('#okS').textContent = 'Se está activando en tu plataforma…';
        $('#cOk .circ').style.transform = `scale(${.6 + .4 * back(seg(t, tap - .3, tap + .3))})`;
      } else {
        poner('uno');
        const yb = arriba('.gal2 .g2', 0) - 220; scroll(yb);
        const out = 1 - eo(seg(t, ta, ta + .45)); capa('#cOk', out); capa('#cPago', out);
        const card = q('.gal2 .g2', 0);
        if (card) card.style.filter = `grayscale(${1 - eo(seg(t, tcand, tcand + .6))}) brightness(${.55 + .45 * eo(seg(t, tcand, tcand + .6))})`;
        const cov = q('.gal2 .g2-cov', 0);
        if (cov) {
          const r = cov.getBoundingClientRect(), c = $('#cand'), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
          c.style.left = cx + 'px'; c.style.top = cy + 'px';
          const op = eo(seg(t, ta + .1, ta + .5)) * (1 - seg(t, tcand + .5, tcand + .9));
          c.style.opacity = op; c.style.transform = `scale(${.8 + .2 * eo(seg(t, ta + .1, ta + .5)) + .3 * seg(t, tcand + .5, tcand + .9)})`;
          const u = eo(seg(t, tcand - .1, tcand + .3)); $('#arco').setAttribute('transform', `translate(${u * 3.5} ${-u * 3}) rotate(${u * 18} 16 11)`);
          document.querySelectorAll('.chispa').forEach((e, n) => { const ang = n / 18 * Math.PI * 2, x = seg(t, tcand + .1, tcand + .9);
            e.style.left = cx + Math.cos(ang) * 110 * eo(x) + 'px'; e.style.top = cy + Math.sin(ang) * 110 * eo(x) + 'px'; e.style.opacity = x > 0 && x < 1 ? 1 - x : 0; });
        }
        marca('#m1', '.gal2 .g2', 0, eo(seg(t, tbib - .3, tbib + .2)) * (1 - seg(t, fin(i) - .4, fin(i) - .1)), 'verde', 5);
      }
    }
    if (k === 'todo') {
      const tq = cue(I.todo, 'Lo quiero'), tas = cue(I.todo, 'Así tienes');
      if (t < tas - .3) {
        poner('nada');
        scroll(arriba('.guia') - 60);
        const cta = q('.guia-cta'), x = back(seg(t, tq - .6, tq - .1));
        if (cta) { cta.style.opacity = cl(x * 1.2); cta.style.transform = `translateY(${(1 - x) * 14}px) scale(${.92 + .08 * x})`; cta.style.pointerEvents = 'none'; }
        const of = q('.guia-of'); if (of) of.classList.toggle('brilla', t >= tq - .4);
        const o = eo(seg(t, T.tofe + .3, T.tofe + .7)); capa('#cOk', o);
        $('#okT').textContent = '¡Todo desbloqueado!'; $('#okS').textContent = 'Tu curso completo, en un mismo lugar';
        $('#cOk .circ').style.transform = `scale(${.6 + .4 * back(seg(t, T.tofe + .3, T.tofe + .9))})`;
      } else {
        poner('todo');
        capa('#cOk', 1 - eo(seg(t, tas - .3, tas + .2)));
        $('#cOk .circ').style.transform = 'scale(1)';
        const yb = arriba('#biblioteca') - 30;
        scroll(lerp(0, yb + 700, eio(seg(t, tas - .2, fin(i) + .3))));
      }
    }
    if (k === 'cierre') { poner('todo'); }
  }
})();
