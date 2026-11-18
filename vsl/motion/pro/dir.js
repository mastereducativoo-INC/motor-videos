// Directores (17 nov 2026): cinco interpretaciones visuales de las mismas escenas, para que 5 versiones sean 5 propuestas distintas.
// 1 Cine 3D (Three.js) · 2 Tipografía cinética · 3 Pantalla viva · 4 Escritorio físico · 5 Infografía isométrica.
// Cada director registra PRO.D[n][escena]; lo que no defina cae en la escena base de pro.js.
(() => {
const {D, V, E, P, PR, IM, $, esc, pal, rgba, money, rnd, fit, img, OK, ICO, texto, objeto, draw, sube, salta, flota, onda, cuenta} = window.PRO;
const N = () => window.PRO.N(), FAM = E.fam || 'gen', TEC = FAM === 'tec';
const camino = () => (PR.camino || ['Aprender', 'Practicar', 'Aplicar', 'Cobrar']).slice(0, 6), YA = () => Math.min(camino().length - 1, PR.camino_ya || 2);
const tool = (c) => { const i = c.sc.i || 0, ct = (PR.cont || [])[i] || {}; return {i, ct, t: ct.titulo || c.sc.demoT || '', s: c.sc.s || ct.sub || '', pts: (c.sc.puntos || []).slice(0, 4), et: (PR.etiqueta || 'Herramienta') + ' ' + (i + 1) + ' de ' + (N() || i + 1)}; };
const precio = () => { const val = +PR.valor || 0, pre = +PR.precio || 0; return {val, pre, desc: val ? Math.round((1 - pre / val) * 100) : 0}; };
const PAL = ICO.palomita, CAN = ICO.candado, sobre = (s) => s.replace('var(--bg)', P.c).replace('currentColor', P.sobre);
const puntos = (c, en, pts, o = {}) => pts.forEach((p, j) => { const f = $(`<div class="fila" style="font-size:${o.fs || 42}px;margin-top:${o.gap || 22}px">${OK}<span>${esc(p)}</span></div>`); en.appendChild(f); const at = .22 + c.vz * (.4 + .5 * j / pts.length); c.tl.from(f, {x: -40, autoAlpha: 0, duration: .55, ease: 'power3.out'}, at); draw(c.tl, f.querySelectorAll('circle,path'), at + .08, .4); c.fx(at + .1, 'tick'); });

// ============ 1 · CINE 3D ============
const T = window.THREE; let ren, cv; const tres = [];
if (E.dir === 1 && T) {
  window.PRO.alMontar.push(({ESC}) => { cv = document.createElement('canvas'); cv.style.cssText = 'position:absolute;inset:0;width:1920px;height:1080px'; ESC.parentNode.insertBefore(cv, ESC);
    ren = new T.WebGLRenderer({canvas: cv, alpha: true, antialias: true, preserveDrawingBuffer: true}); ren.setPixelRatio(1); ren.setSize(1920, 1080, false); ren.setClearColor(0, 0); });
  window.PRO.alSeek.push((t) => { if (!ren) return; const a = tres.find((x) => t >= x.a && t < x.b); if (!a) { ren.clear(); cv.style.opacity = 0; return; } a.upd && a.upd(t - a.a); ren.render(a.scene, a.cam); cv.style.opacity = Math.max(0, Math.min(1, (t - a.a) / .3, (a.b - t) / .22)); });
}
const col = (h) => new T.Color(h);
function mundo(c, o = {}) {
  const scene = new T.Scene(), cam = new T.PerspectiveCamera(o.fov || 30, 16 / 9, .1, 200); scene.add(new T.AmbientLight(0xffffff, .38));
  const d = new T.DirectionalLight(0xffffff, .62); d.position.set(4, 9, 7); scene.add(d); const pl = new T.PointLight(col(P.c), .7, 40); pl.position.set(-6, 4, 6); scene.add(pl);
  const w = {scene, cam, a: c.t0, b: c.t0 + c.D + .16, mira: new T.Vector3(0, 0, 0)}; tres.push(w);
  w.upd = (t) => { o.upd && o.upd(t); cam.lookAt(w.mira); }; return w;
}
const lienzo = (w, h, f) => { const cn = document.createElement('canvas'); cn.width = w; cn.height = h; const x = cn.getContext('2d'); f(x, w, h); const tx = new T.CanvasTexture(cn); tx.anisotropy = 4; return tx; };
const plano = (tx, w, h, o = {}) => new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial(Object.assign({map: tx, transparent: true, alphaTest: .02, side: T.DoubleSide}, o)));
const foto = (k, w, o) => { const im = IM[k]; if (!im || !im.ok) return null; const tx = new T.Texture(im.el); tx.needsUpdate = true; tx.anisotropy = 4; return plano(tx, w, w * im.h / im.w, o); };
const oro = (o = {}) => new T.MeshPhongMaterial(Object.assign({color: col(P.a), specular: 0x8a7a50, shininess: 70, emissive: col(P.a), emissiveIntensity: .1}, o));
const suelo = (w) => { const m = new T.Mesh(new T.PlaneGeometry(80, 60), new T.MeshPhongMaterial({color: col(P.bg).lerp(col(P.sup), .9), shininess: 12})); m.rotation.x = -Math.PI / 2; w.scene.add(m); w.scene.fog = new T.Fog(col(P.bg), 14, 34); return m; };
const polvo3 = (w, n = 260) => { const g = new T.BufferGeometry(), a = new Float32Array(n * 3); for (let i = 0; i < n * 3; i += 3) { a[i] = (rnd() - .5) * 26; a[i + 1] = (rnd() - .5) * 14; a[i + 2] = -rnd() * 16 + 3; } g.setAttribute('position', new T.BufferAttribute(a, 3)); const p = new T.Points(g, new T.PointsMaterial({color: col(P.c), size: .06, transparent: true, opacity: .7})); w.scene.add(p); return p; };
const rot = (x, w, h, t, f, color, peso = 900) => { x.font = `${peso} ${f}px Montserrat`; x.fillStyle = color; x.textAlign = 'center'; x.textBaseline = 'middle'; const ls = String(t).split('\n'); ls.forEach((l, j) => x.fillText(l, w / 2, h / 2 + (j - (ls.length - 1) / 2) * f * 1.05)); };
D[1] = {
  felicita: (c) => {
    const w = mundo(c), g = new T.Group(), pv = polvo3(w); w.scene.add(g); g.position.set(0, 1.5, 0);
    const aro = new T.Mesh(new T.CylinderGeometry(1.32, 1.32, .22, 72), oro()); aro.rotation.x = Math.PI / 2; g.add(aro);
    const cara = plano(lienzo(512, 512, (x) => { const gr = x.createRadialGradient(256, 200, 20, 256, 256, 256); gr.addColorStop(0, P.c); gr.addColorStop(1, P.a); x.fillStyle = gr; x.beginPath(); x.arc(256, 256, 236, 0, 7); x.fill(); x.strokeStyle = P.sobre; x.lineWidth = 46; x.lineCap = x.lineJoin = 'round'; x.beginPath(); x.moveTo(150, 266); x.lineTo(228, 344); x.lineTo(372, 180); x.stroke(); x.lineWidth = 6; x.globalAlpha = .5; x.beginPath(); x.arc(256, 256, 206, 0, 7); x.stroke(); }), 2.36, 2.36); cara.position.z = .12; g.add(cara);
    const ks = (PR.cimgs || ['m1', 'm2', 'm3', 'm4']).filter((k) => IM[k] && IM[k].ok && IM[k].h > IM[k].w), pos = [[-5.2, -.1, -3, .45], [5.2, -.1, -3, -.45], [-3.4, .9, -6.5, .3], [3.4, .9, -6.5, -.3]];
    ks.slice(0, 4).forEach((k, j) => { const m = foto(k, 2.5); m.position.set(pos[j][0], pos[j][1], pos[j][2]); m.rotation.y = pos[j][3]; w.scene.add(m); c.tl.from(m.position, {y: -7, duration: 1.3, ease: 'expo.out'}, .3 + j * .12); c.tl.to(m.position, {y: '+=.25', duration: 2.4 + j * .3, ease: 'sine.inOut', yoyo: true, repeat: 5}, 1.6); });
    w.cam.position.set(-.9, .5, 11); c.tl.to(w.cam.position, {x: .9, z: 9, duration: c.D + .4, ease: 'none'}, 0); w.mira.set(0, .5, 0); w.upd0 = w.upd; w.upd = (t) => { pv.rotation.y = t * .03; w.upd0(t); };
    c.tl.from(g.rotation, {y: Math.PI * 5, duration: 1.6, ease: 'expo.out'}, .1); c.tl.from(g.scale, {x: .1, y: .1, z: .1, duration: 1.1, ease: 'back.out(1.6)'}, .1); c.tl.to(g.rotation, {y: .5, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: 3}, 1.9); c.fx(.6, 'ding');
    texto(c, {x: 160, y: 670, w: 1600, c: 1, t: c.sc.t, size: 150, maxH: 180, at: .7});
    const ch = $(`<div class="abs ctr" style="left:160px;top:880px;width:1600px"><span class="chip" style="font-size:36px;padding:18px 38px">${esc(PR.curso || '')}</span> <span class="chip lleno" style="font-size:36px;padding:18px 38px;margin-left:14px">${sobre(PAL)}Confirmado</span></div>`); c.cam.appendChild(ch); salta(c.tl, ch.children, c.cue('compra', .3, 1.7));
  },
  escalera: (c) => {
    const cm = camino(), n = cm.length, ya = YA(), w = mundo(c), bw = 1.72, X = (i) => (i - (n - 1) / 2) * 1.86, Hh = (i) => (i + 1) * .62; polvo3(w, 140);
    suelo(w);
    cm.forEach((t, i) => {
      const h = Hh(i), g = new T.Group(), geo = new T.BoxGeometry(bw, h, 1.9); g.position.set(X(i), 0, 0); w.scene.add(g);
      if (i < ya) { const b = new T.Mesh(geo, new T.MeshPhongMaterial({color: col(P.a).multiplyScalar(.45), shininess: 50})); b.position.y = h / 2; g.add(b); const tp = new T.Mesh(new T.BoxGeometry(bw, .07, 1.9), oro({emissiveIntensity: .35})); tp.position.y = h + .035; g.add(tp); }
      else { const b = new T.Mesh(geo, new T.MeshBasicMaterial({color: col(P.ink), transparent: true, opacity: .05, depthWrite: false})); b.position.y = h / 2; g.add(b); const e = new T.LineSegments(new T.EdgesGeometry(geo), new T.LineDashedMaterial({color: col(P.ink), dashSize: .13, gapSize: .1, transparent: true, opacity: .6})); e.computeLineDistances(); e.position.y = h / 2; g.add(e); g.userData.e = e; }
      const lb = plano(lienzo(600, 300, (x, W, H) => { const f = i < ya; x.fillStyle = f ? P.c : rgba(P.ink, .7); x.beginPath(); x.arc(W / 2, 62, 34, 0, 7); x.fill(); x.strokeStyle = f ? P.sobre : P.bg; x.lineWidth = 9; x.lineCap = x.lineJoin = 'round'; x.beginPath(); if (f) { x.moveTo(W / 2 - 16, 64); x.lineTo(W / 2 - 4, 76); x.lineTo(W / 2 + 18, 50); } else { x.rect(W / 2 - 12, 60, 24, 16); x.moveTo(W / 2 - 8, 58); x.arc(W / 2, 56, 8, Math.PI, 0); } x.stroke(); const ws = t.split(' '); rot(x, W, H + 110, ws.length > 1 ? ws[0] + '\n' + ws.slice(1).join(' ') : t, 72, f ? '#fff' : rgba(P.ink, .78), 800); }), 1.7, .85); lb.position.set(0, Math.max(.44, h - .52), .96); g.add(lb);
      c.tl.from(g.scale, {y: .001, duration: .9, ease: i < ya ? 'back.out(1.5)' : 'power3.out'}, .3 + i * .16);
      if (i >= ya) { const at = Math.max(c.cue('cliente', .42) + .4 + (i - ya) * .45, c.cue(String(t).split(/\s+/).pop(), .55 + .12 * (i - ya))); c.tl.to(g.userData.e.material.color, {r: col(P.c).r, g: col(P.c).g, b: col(P.c).b, duration: .3}, at); c.tl.to(g.userData.e.material, {opacity: 1, duration: .3}, at); c.fx(at, 'click'); }
    });
    const tu = new T.Group(), bola = new T.Mesh(new T.SphereGeometry(.2, 32, 32), oro({emissiveIntensity: .7})); tu.add(bola);
    const et = plano(lienzo(256, 128, (x, W, H) => { x.fillStyle = P.c; x.beginPath(); x.roundRect(28, 20, 200, 88, 44); x.fill(); rot(x, W, H, 'TÚ', 60, P.sobre); }), .9, .45); et.position.y = .6; tu.add(et); w.scene.add(tu);
    c.tl.fromTo(tu.position, {x: X(0), y: Hh(0) + 5, z: .2}, {y: Hh(0) + .32, duration: .8, ease: 'bounce.out'}, 1.1);
    for (let i = 1; i < ya; i++) { const at = 2 + (i - 1) * .9; c.tl.to(tu.position, {x: X(i), duration: .6, ease: 'power1.inOut'}, at); c.tl.to(tu.position, {y: Hh(i) + 1.3, duration: .3, ease: 'power2.out'}, at); c.tl.to(tu.position, {y: Hh(i) + .32, duration: .3, ease: 'power2.in'}, at + .3); c.fx(at + .58, 'pop'); }
    w.cam.position.set(-5.5, 4.4, 11.5); c.tl.to(w.cam.position, {x: 3.2, y: 3.6, z: 11.8, duration: c.D + .4, ease: 'sine.inOut'}, 0); w.mira.set(.2, 1.5, 0);
    texto(c, {x: 120, y: 64, w: 1300, t: c.sc.t, size: 112, maxH: 130, at: .15});
    const tg = $(`<div class="abs" style="left:120px;top:952px;display:flex;gap:22px"><span class="chip lleno" style="font-size:32px;padding:16px 32px">${sobre(PAL)}Ya lo tienes · tu curso</span><span class="chip" style="font-size:32px;padding:16px 32px;border-style:dashed;color:${P.ink};border-color:${rgba(P.ink, .45)}">${CAN}Lo que aún te falta</span></div>`); c.cam.appendChild(tg);
    salta(c.tl, tg.children[0], 1.2); salta(c.tl, tg.children[1], c.cue('cliente', .42));
  },
  tool2: (c) => {
    const k = tool(c), w = mundo(c), der = k.i % 2 === 0, sx = der ? 1 : -1; polvo3(w, 160);
    const m = foto('c' + k.i, 5.7); if (m) { m.position.set(sx * 4.1, 0, 0); m.rotation.y = -sx * .34; w.scene.add(m); c.tl.from(m.position, {x: sx * 12, duration: 1.3, ease: 'expo.out'}, .1); c.tl.from(m.rotation, {y: -sx * 1.5, duration: 1.4, ease: 'expo.out'}, .1); c.tl.to(m.rotation, {y: -sx * .16, duration: c.D, ease: 'sine.inOut'}, 1.5); c.tl.to(m.position, {y: .18, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: 4}, 1.4);
      [[-4.5, .9, 1.25], [-9, -1.2, 1.5]].forEach(([z, y, s], j) => { const f = foto('c' + k.i, 6.4 * s, {opacity: .13 - j * .04, alphaTest: 0, depthWrite: false}); f.position.set(sx * (5.5 + j * 2.5), y, z); f.rotation.y = -sx * .34; w.scene.add(f); }); }
    w.cam.position.set(-sx * 1.4, .3, 12.5); c.tl.to(w.cam.position, {x: sx * 1.2, z: 11.6, duration: c.D + .4, ease: 'none'}, 0); w.mira.set(sx * .5, 0, 0); c.fx(.12, 'whoosh');
    const bx = $(`<div class="abs" style="left:${der ? 120 : 1020}px;top:90px;width:800px;height:880px;display:flex;flex-direction:column;justify-content:center"></div>`); c.cam.appendChild(bx);
    const cab = $(`<div style="display:flex;align-items:center;gap:26px;margin-bottom:26px"><div class="K">${esc(k.et)}</div>${k.ct.valor ? `<span class="chip" style="font-size:24px;padding:9px 20px">Valor ${money(+k.ct.valor)}</span>` : ''}</div>`); bx.appendChild(cab); sube(c.tl, cab.children, .2);
    texto(c, {en: bx, x: 0, y: 0, w: 800, t: k.t, size: 100, maxH: 225, s: k.s, plano: 1, ss: 44, sm: 22, at: .3, sAt: 1}).style.position = 'relative'; puntos(c, bx, k.pts);
  },
  precio: (c) => {
    const {val, pre, desc} = precio(), w = mundo(c), nA = Math.max(2, Math.min(14, Math.round(val / Math.max(1, pre)))); polvo3(w, 160);
    suelo(w);
    const tP = Math.max(c.cue('llevas', null) || c.cue('por solo', null) || c.cue(' por ', .72), 2.8);
    const mate = new T.MeshPhongMaterial({color: col(P.mut).multiplyScalar(.5), shininess: 30, transparent: true}), geo = new T.CylinderGeometry(.95, .95, .2, 48);
    for (let j = 0; j < nA; j++) { const m = new T.Mesh(geo, mate); m.position.set(-3.6 + (rnd() - .5) * .12, .1 + j * .215, (rnd() - .5) * .12); w.scene.add(m); c.tl.from(m.position, {y: 9 + j, duration: .7, ease: 'bounce.out'}, .35 + j * .09); if (j % 3 === 0) c.fx(.9 + j * .09, 'tick'); }
    const rA = plano(lienzo(700, 380, (x, W, H) => { rot(x, W, 150, 'VALOR DE REFERENCIA', 40, rgba(P.ink, .7), 800); rot(x, W, H + 110, money(val), 210, rgba(P.ink, .92)); }), 4, 2.17); rA.position.set(-3.6, nA * .215 + 1.5, 0); w.scene.add(rA); c.tl.from(rA.scale, {x: .01, y: .01, duration: .6, ease: 'back.out(1.6)'}, 1.2);
    const tacha = new T.Mesh(new T.BoxGeometry(3.7, .1, .02), new T.MeshBasicMaterial({color: col(P.c)})); tacha.position.set(-3.6, nA * .215 + 1.25, .05); tacha.rotation.z = .17; w.scene.add(tacha); c.tl.from(tacha.scale, {x: .001, duration: .35, ease: 'power3.in'}, tP - .5); c.tl.to(mate, {opacity: .6, duration: .6}, tP - .1);
    const ped = new T.Mesh(new T.CylinderGeometry(1.5, 1.7, .5, 64), new T.MeshPhongMaterial({color: col(P.a).multiplyScalar(.35), shininess: 60})); ped.position.set(3.4, .25, 0); w.scene.add(ped);
    const mon = new T.Mesh(new T.CylinderGeometry(1.25, 1.25, .26, 64), oro({emissiveIntensity: .22})); mon.position.set(3.4, .66, 0); w.scene.add(mon); c.tl.from(mon.position, {y: 12, duration: .7, ease: 'bounce.out'}, tP); c.tl.to(mon.rotation, {y: 6.28, duration: 6, ease: 'none', repeat: 2}, tP);
    const luz = new T.PointLight(col(P.c), 0, 14); luz.position.set(3.4, 3, 3); w.scene.add(luz); c.tl.to(luz, {intensity: 1.1, duration: .5}, tP + .3);
    const rB = plano(lienzo(900, 560, (x, W, H) => { rot(x, W, 150, 'HOY LO LLEVAS POR', 50, P.c, 800); const g = x.createLinearGradient(0, 150, W, 500); g.addColorStop(0, P.c); g.addColorStop(.5, P.a); g.addColorStop(1, P.c); rot(x, W, H + 120, money(pre), 360, g); }), 5.6, 3.48); rB.position.set(3.4, 3.4, 0); w.scene.add(rB); c.tl.from(rB.scale, {x: .01, y: .01, duration: .7, ease: 'back.out(1.5)'}, tP + .15); c.fx(tP + .3, 'golpe'); c.fx(tP + .55, 'monedas');
    w.cam.position.set(-2.2, 3.4, 15); c.tl.to(w.cam.position, {x: 1.8, y: 2.9, z: 12.4, duration: c.D + .4, ease: 'sine.inOut'}, 0); w.mira.set(.2, 2.2, 0);
    const bn = $(`<div class="abs ctr" style="left:120px;right:120px;top:940px"><div class="K c" style="display:none">${esc(c.sc.k || 'Precio exclusivo')}</div><span class="chip lleno" style="font-size:46px;padding:16px 46px">${desc}% de descuento</span></div>`); c.cam.appendChild(bn); sube(c.tl, bn.children, .2, {stagger: .9});
  },
};

// ============ 2 · TIPOGRAFÍA CINÉTICA ============
const marq = (c, t, y, dir) => { const m = $(`<div class="marq" style="top:${y}px">${(esc(t) + ' · ').repeat(8)}</div>`); c.cam.appendChild(m); c.tl.fromTo(m, {x: dir > 0 ? -700 : 0}, {x: dir > 0 ? 0 : -700, duration: c.D + 1, ease: 'none'}, 0); c.tl.from(m, {opacity: 0, duration: 1}, .2); return m; };
const letras = (c, el, at, o = {}) => { const t = el.textContent; el.innerHTML = [...t].map((l) => `<span style="display:inline-block;white-space:pre">${esc(l)}</span>`).join(''); c.tl.from(el.children, Object.assign({yPercent: 110, rotation: 8, opacity: 0, duration: .7, ease: 'back.out(1.7)', stagger: .035}, o), at); };
D[2] = {
  felicita: (c) => {
    const ws = String(c.sc.t || '¡Compra *confirmada!*').replace(/[¡!*]/g, '').trim().split(/\s+/), a = ws[0] || 'Compra', b = ws.slice(1).join(' ') || 'confirmada';
    marq(c, a + ' ' + b, 40, 1); marq(c, a + ' ' + b, 920, -1);
    const A1 = $(`<div class="abs big" style="left:120px;top:250px;font-size:300px;color:${P.ink}">${esc(a)}</div>`), B1 = $(`<div class="abs big" style="left:130px;top:570px;font-size:150px;transform:rotate(-3deg)"><span class="blq">${esc(b)} ✓</span></div>`); c.cam.append(A1, B1); A1.style.width = '1700px'; fit(A1, 330, 120);
    letras(c, A1, .15); c.tl.from(B1, {xPercent: -120, duration: .8, ease: 'expo.out'}, .7); c.tl.from(B1.firstChild, {scaleX: .2, transformOrigin: '0 50%', duration: .7, ease: 'expo.out'}, .7); c.fx(.75, 'golpe'); c.fx(1.1, 'ding');
    const p = $(`<div class="abs" style="right:120px;top:640px;width:560px;text-align:right"><div class="K" style="justify-content:flex-end">Tu pedido</div><div class="T" style="font-size:58px;margin-top:18px">${esc(PR.curso || '')}</div><div class="P" style="margin-top:18px;font-size:32px">${esc(c.sc.s || '')}</div></div>`); c.cam.appendChild(p); sube(c.tl, p.children, c.cue('compra', .3, 1.6), {stagger: .25});
  },
  escalera: (c) => {
    const cm = camino(), n = cm.length, ya = YA(), fs = Math.min(132, 760 / n), dx = Math.min(150, 620 / n);
    c.cam.appendChild($(`<div class="abs K" style="left:120px;top:70px">${esc(String(c.sc.t || 'Tu siguiente escalón').replace(/\*/g, ''))}</div>`));
    cm.forEach((t, i) => { const f = i < ya, y = 930 - (i + 1) * (fs * 1.18), e = $(`<div class="abs big" style="left:${120 + i * dx}px;top:${y}px;font-size:${fs}px;display:flex;align-items:center;gap:26px"><span class="${f ? '' : 'hue'}" style="${f ? 'color:' + (i === ya - 1 ? P.c : P.ink) : ''}">${esc(t)}</span><span style="color:${f ? P.c : rgba(P.ink, .5)};display:inline-flex;transform:scale(${fs / 50});margin:0 ${fs * .32}px">${f ? PAL : CAN}</span></div>`); c.cam.appendChild(e);
      const at = f ? .4 + i * .5 : Math.max(c.cue('cliente', .42) + (i - ya) * .45, c.cue(String(t).split(/\s+/).pop(), .55 + .12 * (i - ya)));
      c.tl.from(e, {x: -300, opacity: 0, duration: .7, ease: 'expo.out'}, f ? at : .9 + i * .1); if (!f) { c.tl.to(e.firstChild, {webkitTextStroke: '3px ' + P.c, duration: .25}, at); c.tl.fromTo(e, {x: 0}, {x: 26, duration: .12, yoyo: true, repeat: 1}, at); } c.fx(at, f ? 'pop' : 'click'); });
    const yM = 930 - ya * fs * 1.18, l1 = $(`<div class="abs" style="left:60px;top:${yM}px;height:${ya * fs * 1.18 - 20}px;width:10px;border-radius:9px;background:linear-gradient(${P.c},${P.a})"></div>`), l2 = $(`<div class="abs" style="left:60px;top:${930 - n * fs * 1.18}px;height:${(n - ya) * fs * 1.18 - 20}px;width:0;border-left:8px dashed ${rgba(P.ink, .4)}"></div>`);
    const t1 = $(`<div class="abs" style="left:120px;top:950px"><span class="chip lleno" style="font-size:34px;padding:16px 34px">${sobre(PAL)}Ya lo tienes · tu curso</span></div>`), t2 = $(`<div class="abs" style="left:760px;top:950px"><span class="chip" style="font-size:34px;padding:16px 34px;border-style:dashed;color:${P.ink};border-color:${rgba(P.ink, .45)}">${CAN}Lo que aún te falta</span></div>`);
    c.cam.append(l1, l2, t1, t2); c.tl.from(l1, {scaleY: 0, transformOrigin: '50% 100%', duration: .8, ease: 'expo.out'}, .5); c.tl.from(l2, {scaleY: 0, transformOrigin: '50% 100%', duration: .8, ease: 'expo.out'}, 1.2); salta(c.tl, t1.firstChild, 1.3); salta(c.tl, t2.firstChild, c.cue('cliente', .42));
  },
  tool2: (c) => {
    const k = tool(c), der = k.i % 2 === 0;
    const num = $(`<div class="abs big hue o" style="${der ? 'left:60px' : 'right:60px'};top:-40px;font-size:640px;opacity:.5">${String(k.i + 1).padStart(2, '0')}</div>`); c.cam.appendChild(num); c.tl.from(num, {y: 260, opacity: 0, duration: 1.1, ease: 'expo.out'}, .05);
    objeto(c, 'c' + k.i, {x: der ? 1000 : 20, y: 60, s: 900, dir: der ? 1 : -1, at: .15}); c.fx(.12, 'whoosh');
    const bx = $(`<div class="abs" style="left:${der ? 120 : 960}px;top:120px;width:860px"></div>`); c.cam.appendChild(bx);
    const K = $(`<div class="K">${esc(k.et)}</div>`), Tt = $(`<div class="big" style="font-size:132px;white-space:normal;margin-top:26px;color:${P.ink}">${esc(k.t)}</div>`), S = $(`<div class="big" style="font-size:50px;margin-top:30px;letter-spacing:-.01em;white-space:normal"><span class="blq">${esc(k.s)}</span></div>`); bx.append(K, Tt, S); fit(Tt, 380, 60);
    sube(c.tl, K, .2); c.tl.from(Tt, {clipPath: 'inset(0 100% 0 0)', x: -60, duration: .9, ease: 'expo.out'}, .3); c.tl.from(S.firstChild, {scaleX: 0, transformOrigin: '0 50%', duration: .6, ease: 'expo.out'}, 1);
    const ban = $(`<div class="abs" style="left:0;right:0;bottom:70px;height:110px;background:${rgba(P.ink, .06)};border-top:2px solid ${rgba(P.ink, .14)};border-bottom:2px solid ${rgba(P.ink, .14)};display:flex;align-items:center;justify-content:center;gap:50px;font:800 36px Montserrat;text-transform:uppercase;letter-spacing:.02em">${k.pts.map((p) => `<span style="display:flex;align-items:center;gap:16px"><i style="width:16px;height:16px;border-radius:50%;background:${P.c}"></i>${esc(p)}</span>`).join('')}</div>`); c.cam.appendChild(ban); let fs = 36; while (ban.scrollWidth > 1900 && fs > 20) { fs -= 2; ban.style.fontSize = fs + 'px'; ban.style.gap = fs + 'px'; }
    c.tl.from(ban, {scaleX: 0, duration: .8, ease: 'expo.out'}, .22 + c.vz * .35); c.tl.from(ban.children, {y: 40, opacity: 0, duration: .5, stagger: c.vz * .12, ease: 'back.out(1.6)'}, .22 + c.vz * .4);
  },
  precio: (c) => {
    const {val, pre, desc} = precio(), tP = Math.max(c.cue('llevas', null) || c.cue('por solo', null) || c.cue(' por ', .72), 2.6);
    marq(c, (c.sc.k || 'Precio exclusivo'), 30, 1);
    const a = $(`<div class="abs big hue" style="left:110px;top:240px;font-size:340px">${money(val)}</div>`), ta = $(`<div class="abs" style="left:80px;top:420px;width:${130 + String(val).length * 215}px;height:34px;border-radius:9px;background:linear-gradient(90deg,${P.a},${P.c});transform:rotate(-8deg)"></div>`);
    const b = $(`<div class="abs big oro" style="right:80px;top:400px;font-size:560px">${money(pre)}</div>`), d = $(`<div class="abs big" style="left:150px;top:740px;font-size:150px;transform:rotate(-5deg)"><span class="blq">−${desc}%</span></div>`), h = $(`<div class="abs K" style="right:110px;top:330px">Hoy lo llevas por</div>`);
    c.cam.append(a, ta, h, b, d); letras(c, a, .3); c.tl.from(ta, {scaleX: 0, transformOrigin: '0 50%', duration: .35, ease: 'power3.in'}, tP - .5); c.fx(tP - .45, 'whoosh'); c.tl.to(a, {opacity: .45, duration: .5}, tP - .1);
    c.tl.from(d, {scale: 3, opacity: 0, duration: .5, ease: 'back.out(1.6)'}, Math.max(1.2, c.cue('por ciento', .16))); c.tl.from(h, {opacity: 0, x: 40, duration: .5}, tP - .1);
    c.tl.from(b, {yPercent: 130, duration: .7, ease: 'expo.out'}, tP); cuenta(c.tl, b, val, pre, tP, .8, money, 'power3.out'); c.fx(tP + .3, 'golpe'); c.fx(tP + .5, 'monedas'); c.tl.to(b, {scale: 1.04, transformOrigin: '100% 100%', duration: 1, yoyo: true, repeat: 7, ease: 'sine.inOut'}, tP + 1);
  },
};

// ============ 3 · PANTALLA VIVA ============
const app = (c, tit, o = {}) => { const x = o.x == null ? 190 : o.x, y = o.y == null ? 110 : o.y, w = o.w || 1540, h = o.h || 860; const a = $(`<div class="app" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><div class="bar"><i></i><i></i><i></i>${esc(tit)}</div><div class="cu" style="position:absolute;left:${o.lado ? 330 : 0}px;right:0;top:64px;bottom:0;padding:${o.pad || '46px 60px'}"></div></div>`); c.cam.appendChild(a);
  c.tl.from(a, {y: 120, scale: .9, opacity: 0, rotationX: 14, transformPerspective: 1800, duration: 1, ease: 'expo.out'}, .1); c.fx(.15, 'whoosh'); return {a, cu: a.querySelector('.cu')}; };
const cursor = (c) => { const cu = $(`<svg class="abs" style="left:0;top:0;z-index:9" width="58" height="58" viewBox="0 0 24 24"><path d="M5 2l14 11h-8l-2 9z" fill="#fff" stroke="#111" stroke-width="1.4" stroke-linejoin="round"/></svg>`); c.cam.appendChild(cu); return cu; };
const ruta = TEC ? '~/' + String(PR.curso || 'curso').toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'Mi cuenta · ' + (PR.curso || '');
D[3] = {
  felicita: (c) => {
    const {cu} = app(c, TEC ? ruta + ' — terminal' : ruta), tp = c.cue('compra', .3, 1.6);
    cu.innerHTML = `<div style="display:flex;gap:60px;height:100%"><div style="flex:1.15;display:flex;flex-direction:column;justify-content:center"><div class="K">${TEC ? '$ pedido --estado' : 'Estado de tu pedido'}</div><div class="T" style="font-size:112px;margin-top:26px">${pal(c.sc.t)}</div><div class="P" style="margin-top:26px">${esc(c.sc.s || '')}</div></div>
      <div class="reg" style="flex:1;position:relative"></div></div>`;
    const reg = cu.querySelector('.reg'), ks = (PR.cimgs || ['m1', 'm2', 'm3', 'm4']).filter((k) => IM[k] && IM[k].ok), alto = ks.filter((k) => IM[k].h > IM[k].w), usar = (alto.length ? alto : ks).slice(0, 3), mid = (usar.length - 1) / 2;
    usar.forEach((k, j) => { const o = j - mid, e = $(img(k, `position:absolute;left:${50 + (o + mid) * (usar.length > 1 ? 150 : 0) + (usar.length === 1 ? 120 : 0)}px;top:${60 + Math.abs(o) * 26}px;height:${alto.length ? 400 : 240}px;z-index:${9 - Math.abs(o)};filter:drop-shadow(0 30px 34px rgba(0,0,0,.6))`)); reg.appendChild(e);
      c.tl.fromTo(e, {y: 300, rotation: 0, opacity: 0, scale: .7}, {y: 0, rotation: o * 7, opacity: 1, scale: 1, duration: .9, ease: 'back.out(1.4)', transformOrigin: '50% 100%'}, tp - .3 + j * .18); });
    const ya = $(`<div style="position:absolute;left:0;right:0;bottom:0;text-align:center"><span class="chip lleno" style="font-size:27px;padding:14px 28px;white-space:nowrap">${sobre(PAL)}Ya es tuyo</span><div style="font:700 26px Montserrat;margin-top:12px;white-space:nowrap">${esc(PR.curso || 'Tu curso')}</div></div>`); reg.appendChild(ya);
    salta(c.tl, ya.firstChild, tp + .5); c.fx(tp + .5, 'pop'); c.fx(.75, 'monedas');
    fit(cu.querySelector('.T'), 260, 50); c.tl.from(cu.querySelectorAll('.T .wi'), {yPercent: 125, duration: .9, ease: 'expo.out', stagger: .07}, .6); c.tl.from(cu.querySelectorAll('.T .ul'), {scaleX: 0, duration: .7, stagger: .1}, 1.1);
    c.fx(.7, 'venta');
  },
  escalera: (c) => {
    const cm = camino(), ya = YA(), {cu} = app(c, TEC ? ruta + '/ruta.md' : 'Tu ruta'), tf = c.cue('cliente', .42);
    cu.innerHTML = `<div class="T" style="font-size:78px;margin-bottom:34px">${pal(c.sc.t)}</div><div style="display:flex;flex-direction:column;gap:${cm.length > 5 ? 10 : 14}px">${cm.map((t, i) => (i === 0 ? `<div class="K gr" style="color:${P.c}">Esto ya lo tienes con tu curso</div>` : i === ya ? `<div class="K gr" style="margin-top:14px;color:${P.ink}">Esto es lo que te vamos a mostrar ahora</div>` : '') + (i < ya ? `<div class="rowp"><span style="color:${P.c};display:inline-flex;transform:scale(1.3)">${PAL}</span><span style="width:420px">${esc(t)}</span><span class="br"><b style="width:100%"></b></span><em style="color:${P.c}">Ya lo tienes · tu curso</em></div>` : `<div class="rowp no"><span style="display:inline-flex;transform:scale(1.2)">${CAN}</span><span style="width:420px">${esc(t)}</span><span class="br"></span><em>Lo vemos ahora</em></div>`)).join('')}</div>`;
    const rs = cu.querySelectorAll('.rowp'), gr = cu.querySelectorAll('.gr'); c.tl.from(cu.querySelectorAll('.T .wi'), {yPercent: 125, duration: .9, ease: 'expo.out', stagger: .07}, .5);
    c.tl.from(gr[0], {opacity: 0, x: -30, duration: .5}, .7); if (gr[1]) c.tl.from(gr[1], {opacity: 0, x: -30, duration: .5}, Math.max(1.2, tf - .2));
    rs.forEach((r, i) => { c.tl.from(r, {y: 50, opacity: 0, duration: .6, ease: 'expo.out'}, .8 + i * .14); if (i < ya) { c.tl.from(r.querySelector('b'), {width: '0%', duration: .9, ease: 'power2.out'}, 1.3 + i * .5); c.fx(2.1 + i * .5, 'pop'); }
      else { const at = Math.max(tf + .3 + (i - ya) * .45, c.cue(String(cm[i]).split(/\s+/).pop(), .55 + .12 * (i - ya))); c.tl.to(r, {borderColor: P.c, color: P.ink, backgroundColor: rgba(P.a, .1), duration: .25}, at); c.tl.fromTo(r, {x: 0}, {x: 14, duration: .08, yoyo: true, repeat: 3}, at); c.fx(at, 'click'); } });
    const k = cursor(c); c.tl.fromTo(k, {x: 1500, y: 1000, opacity: 0}, {x: 900, y: 480, opacity: 1, duration: .8, ease: 'power2.out'}, 1.2); c.tl.to(k, {x: 760, y: 560 + ya * 96, duration: .7, ease: 'power2.inOut'}, tf - .5);
  },
  tool2: (c) => {
    const k = tool(c), {a, cu} = app(c, TEC ? ruta + '/' + (PR.oferta || 'pack').toLowerCase().replace(/[^a-z0-9]+/g, '-') : (PR.oferta || 'Tu pack'), {x: 110, w: 1700, lado: 1, pad: '34px 44px'});
    const ld = $(`<div class="lado">${(PR.cont || []).slice(0, 12).map((x, j) => `<div class="${j === k.i ? 'on' : ''}">${String(j + 1).padStart(2, '0')} · ${esc(x.corto || x.titulo)}</div>`).join('')}</div>`); a.appendChild(ld); c.tl.from(ld.children, {x: -40, opacity: 0, duration: .4, stagger: .04}, .5);
    cu.innerHTML = `<div style="display:flex;gap:40px;height:100%"><div style="flex:1.15;position:relative;display:flex;align-items:center;justify-content:center">${img('c' + k.i, 'max-width:100%;max-height:100%;filter:drop-shadow(0 30px 40px rgba(0,0,0,.6))')}</div><div class="in" style="flex:1;display:flex;flex-direction:column;justify-content:center"><div style="display:flex;gap:18px;align-items:center"><div class="K">${esc(k.et)}</div></div><div class="T" style="font-size:74px;margin-top:20px">${esc(k.t)}</div><div class="P s" style="font-size:38px;margin-top:16px;font-style:normal;font-weight:700">${esc(k.s)}</div></div></div>`;
    fit(cu.querySelector('.T'), 180, 40); const im = cu.querySelector('img'); if (im) { c.tl.from(im, {scale: .7, opacity: 0, rotation: -6, duration: 1, ease: 'back.out(1.4)'}, .5); c.tl.to(im, {scale: 1.05, duration: c.D, ease: 'none'}, 1.5); }
    sube(c.tl, cu.querySelector('.in').children, .7, {stagger: .15}); puntos(c, cu.querySelector('.in'), k.pts, {fs: 34, gap: 18});
  },
  precio: (c) => {
    const {val, pre, desc} = precio(), {cu} = app(c, TEC ? ruta + ' — pago' : 'Tu oferta de hoy', {x: 330, w: 1260, pad: '50px 80px'}), tP = Math.max(c.cue('llevas', null) || c.cue('por solo', null) || c.cue(' por ', .72), 2.6), tD = Math.max(1.3, c.cue('por ciento', .16));
    cu.innerHTML = `<div class="K">${esc(c.sc.k || 'Precio exclusivo')}</div><div style="display:flex;align-items:center;gap:30px;margin:26px 0 14px"><div style="width:130px;height:130px;display:flex">${img('pack', 'max-width:100%;max-height:100%;margin:auto')}</div><div class="T" style="font-size:60px">${esc(PR.oferta || '')}</div></div>
      <div class="lin"><span>Valor de referencia</span><b class="num v">${money(val)}</b></div><div class="lin d"><span>Descuento exclusivo (${desc}%)</span><b class="num" style="color:${P.c}">−${money(val - pre)}</b></div>
      <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:30px"><div><div class="K">Hoy pagas</div><span class="btn" style="font-size:38px;padding:24px 54px;margin-top:26px">Sí, lo quiero</span></div><div class="num oro t" style="font-size:300px">${money(pre)}</div></div>`;
    const ls = cu.querySelectorAll('.lin'); sube(c.tl, [cu.children[0], cu.children[1], ls[0]], .6, {stagger: .2}); c.tl.from(ls[1], {x: 80, opacity: 0, duration: .6, ease: 'expo.out'}, tD); c.fx(tD, 'pop');
    c.tl.to(cu.querySelector('.v'), {opacity: .45, textDecoration: 'line-through', duration: .3}, tP - .3); const t = cu.querySelector('.t'); c.tl.from(t, {scale: 1.8, opacity: 0, duration: .6, ease: 'expo.out', transformOrigin: '100% 100%'}, tP); cuenta(c.tl, t, val, pre, tP + .1, 1.9, money, 'power2.inOut'); c.fx(tP + .3, 'riser'); c.fx(tP + 1.9, 'golpe'); c.fx(tP + 2.1, 'monedas');
    salta(c.tl, cu.querySelector('.btn'), tP + 2.3); const k = cursor(c); c.tl.fromTo(k, {x: 1700, y: 1050, opacity: 0}, {x: 560, y: 900, opacity: 1, duration: 1, ease: 'power2.inOut'}, tP + 2.4);
  },
  // 5) presentación del pack: el pack con escáner y, en tecnología, código que se escribe solo
  revela: (c) => {
    const {cu} = app(c, (TEC ? ruta + '/' : '') + (PR.oferta || ''), {x: 130, y: 70, w: 1660, h: 940, pad: '50px 64px'});
    const cod = TEC ? [['const', ' pack ', '= new', ' SuperPack', '();'], ['pack', '.agregar', '(proyectos);', '', ''], ['pack', '.ordenar', '(plantillas);', '', ''], ['pack', '.publicar', '();', '', ''], ['// ✔ listo para mostrarlo', '', '', '', '']] : [];
    cu.innerHTML = `<div style="display:flex;gap:50px;height:100%"><div style="flex:1;display:flex;flex-direction:column;justify-content:center"><div class="K">${esc(c.sc.k || 'Oferta desbloqueada')}</div><div class="T oro" style="font-size:118px;margin-top:22px">${esc(String(c.sc.t || PR.oferta || '').replace(/\*/g, ''))}</div><div class="P s" style="font-style:normal;font-weight:700;font-size:42px;margin-top:20px">${pal(c.sc.s || '')}</div>
      ${cod.length ? `<div class="mono cd" style="margin-top:34px;padding:24px 28px;border-radius:16px;background:rgba(0,0,0,.36);border:1.5px solid rgba(255,255,255,.1);font:600 28px/1.6 JetBrains,monospace">${cod.map((l) => `<div style="white-space:nowrap;overflow:hidden"><span style="color:#c792ea">${esc(l[0])}</span><span style="color:${P.ink}">${esc(l[1])}</span><span style="color:${P.c}">${esc(l[2])}</span><span style="color:#82aaff">${esc(l[3])}</span><span style="color:${P.mut}">${esc(l[4])}</span></div>`).join('')}</div>` : ''}</div>
      <div class="pk" style="flex:1;position:relative;display:flex;align-items:center;justify-content:center"><div class="halo" style="width:760px;height:760px"></div>${img('pack', 'position:relative;max-width:100%;max-height:100%;filter:drop-shadow(0 40px 50px rgba(0,0,0,.6))')}
        <div class="esc" style="position:absolute;left:4%;right:4%;top:6%;height:5px;border-radius:9px;background:${P.c};box-shadow:0 0 30px 8px ${rgba(P.c, .55)}"></div>
        ${[[0, 0, 'tl'], [1, 0, 'tr'], [0, 1, 'bl'], [1, 1, 'br']].map(([x, y]) => `<i class="mk" style="position:absolute;${x ? 'right' : 'left'}:2%;${y ? 'bottom' : 'top'}:4%;width:64px;height:64px;border:5px solid ${P.c};border-${x ? 'left' : 'right'}:none;border-${y ? 'top' : 'bottom'}:none"></i>`).join('')}</div></div>`;
    fit(cu.querySelector('.T'), 270, 50); const pk = cu.querySelector('.pk'), im = pk.querySelector('img'), ln = pk.querySelector('.esc');
    sube(c.tl, [cu.querySelector('.K'), cu.querySelector('.T'), cu.querySelector('.P')], .5, {stagger: .18});
    if (im) { c.tl.from(im, {y: 220, scale: .6, opacity: 0, duration: 1.1, ease: 'back.out(1.3)'}, .4); c.tl.to(im, {y: -14, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: 6}, 1.6); } c.fx(.3, 'riser'); c.fx(1.05, 'golpe');
    c.tl.from(pk.querySelectorAll('.mk'), {scale: 2.2, opacity: 0, duration: .5, ease: 'expo.out', stagger: .06}, 1.2);
    c.tl.fromTo(ln, {top: '6%', opacity: 0}, {top: '92%', opacity: 1, duration: 1.5, ease: 'sine.inOut', yoyo: true, repeat: Math.ceil(c.D / 1.5)}, 1.4);
    cu.querySelectorAll('.cd > div').forEach((l, j) => { const at = .22 + c.vz * (.3 + .55 * j / cod.length); c.tl.from(l, {width: 0, duration: .7, ease: 'steps(22)'}, at); c.fx(at, 'tick'); });
    if (cod.length) c.tl.from(cu.querySelector('.cd'), {opacity: 0, y: 30, duration: .5}, .22 + c.vz * .25);
  },
  // 14) todo junto, en carrusel: cada herramienta pasa por el centro y el valor se va sumando
  todas: (c) => {
    const L = (PR.cont || []), n = L.length, {cu} = app(c, (TEC ? ruta + '/' : '') + (PR.oferta || ''), {x: 130, y: 70, w: 1660, h: 940, pad: '40px 0 0'}), W = 1660, paso = 400, t0 = .9, dt = Math.max(.5, c.vz * .72 / Math.max(1, n));
    cu.innerHTML = `<div class="T ctr" style="font-size:76px;padding:0 60px">${pal(c.sc.t)}</div><div style="position:relative;height:500px;margin-top:34px;overflow:hidden;-webkit-mask:linear-gradient(90deg,transparent,#000 16%,#000 84%,transparent)"><div class="tr" style="position:absolute;left:${W / 2 - 170}px;top:50px;display:flex;gap:${paso - 340}px">${L.map((ct, j) => `<div class="cc vid" style="flex:none;width:340px;height:400px;padding:20px;display:flex;flex-direction:column;align-items:center;gap:10px;text-align:center"><div style="flex:1;min-height:0;display:flex">${img('c' + j, 'max-width:100%;max-height:100%;margin:auto;filter:drop-shadow(0 16px 18px rgba(0,0,0,.5))')}</div><b style="font:700 25px/1.15 Montserrat">${esc(ct.corto || ct.titulo)}</b><u style="text-decoration:none;font:800 28px Montserrat;color:${P.c}">${money(+ct.valor || 0)}</u></div>`).join('')}</div></div>
      <div style="display:flex;align-items:center;justify-content:center;gap:36px;margin-top:22px"><div class="K">Valor de referencia</div><div class="num oro tt" style="font-size:112px">$0</div></div>`;
    fit(cu.querySelector('.T'), 96, 36); c.tl.from(cu.querySelectorAll('.T .wi'), {yPercent: 125, duration: .9, ease: 'expo.out', stagger: .06}, .4);
    const tr = cu.querySelector('.tr'), cs = cu.querySelectorAll('.cc'), tt = cu.querySelector('.tt'), o = {v: 0}; let sum = 0;
    c.tl.from(tr, {x: 900, opacity: 0, duration: .9, ease: 'expo.out'}, .5); c.tl.set(cs, {opacity: .45, scale: .86}, 0);
    L.forEach((ct, j) => { const at = t0 + j * dt; sum += +ct.valor || 0; const hasta = sum;
      if (j) c.tl.to(tr, {x: -j * paso, duration: Math.min(.5, dt * .8), ease: 'power3.inOut'}, at - .1);
      c.tl.to(cs[j], {opacity: 1, scale: 1.12, borderColor: P.c, duration: .35, ease: 'back.out(1.6)'}, at + .1); if (j < n - 1) c.tl.to(cs[j], {opacity: .45, scale: .86, borderColor: 'rgba(255,255,255,.1)', duration: .3}, at + dt - .05);
      c.tl.to(o, {v: hasta, duration: Math.min(.5, dt * .7), ease: 'power1.out', onUpdate: () => { tt.textContent = money(Math.round(o.v)); }}, at + .25); c.fx(at + .25, 'tick'); });
    const fin = t0 + n * dt + .2; c.tl.to(tt, {scale: 1.18, duration: .22, yoyo: true, repeat: 1, ease: 'power2.out'}, fin); c.fx(fin, 'monedas');
  },
  // 17) "un {logro} puede pagarlo": llega el aviso de pago y la barra supera de sobra el precio del pack
  inversion: (c) => {
    const {pre} = precio(), logro = PR.logro || 'cliente', {cu} = app(c, TEC ? ruta + ' — ingresos' : 'Tus ingresos', {x: 190, y: 90, w: 1540, h: 900, pad: '46px 70px'}), t1 = Math.min(Math.max(1.6, c.cue('concret', .4)), .22 + c.vz * .45);
    cu.innerHTML = `<div class="T" style="font-size:80px">${pal(c.sc.t)}</div>
      <div class="av rowp" style="margin-top:34px;border-color:${P.c};background:${rgba(P.a, .14)};font-size:40px;padding:26px 32px"><span style="color:${P.c};display:inline-flex;transform:scale(1.6);margin:0 10px">${PAL}</span><span style="flex:1">Pago recibido · 1 ${esc(logro)}</span><em style="color:${P.c};font-size:26px">Ahora</em></div>
      <div style="margin-top:44px;display:grid;gap:26px"><div><div class="K" style="font-size:22px;margin-bottom:12px">Lo que deja 1 ${esc(logro)}</div><div style="height:74px;border-radius:14px;background:rgba(255,255,255,.07);overflow:hidden"><div class="b1" style="height:100%;width:100%;border-radius:14px;background:linear-gradient(90deg,${P.a},${P.c})"></div></div></div>
        <div><div class="K" style="font-size:22px;margin-bottom:12px;color:${P.mut}">Lo que cuesta el ${esc(PR.oferta || 'pack')}</div><div style="display:flex;align-items:center;gap:24px"><div style="height:74px;width:11%;border-radius:14px;background:rgba(255,255,255,.3)" class="b2"></div><span class="num" style="font-size:74px">${money(pre)}</span></div></div></div>
      <div style="margin-top:34px;display:flex;align-items:center;gap:22px"><span class="chip lleno ok" style="font-size:36px;padding:16px 36px">${sobre(PAL)}Inversión cubierta</span><span class="P" style="font-size:34px">${esc(c.sc.s || '')}</span></div>`;
    fit(cu.querySelector('.T'), 100, 40); c.tl.from(cu.querySelectorAll('.T .wi'), {yPercent: 125, duration: .9, ease: 'expo.out', stagger: .07}, .5);
    const av = cu.querySelector('.av'); c.tl.from(av, {y: -90, opacity: 0, scale: .9, duration: .7, ease: 'back.out(1.6)'}, t1); c.fx(t1, 'ding'); c.fx(t1 + .25, 'monedas');
    c.tl.from(cu.querySelector('.b2'), {scaleX: 0, transformOrigin: '0 50%', duration: .6, ease: 'power3.out'}, 1.1); c.tl.from(cu.querySelector('.b1'), {scaleX: 0, transformOrigin: '0 50%', duration: 1.5, ease: 'power2.out'}, t1 + .4);
    salta(c.tl, cu.querySelector('.ok'), t1 + 1.8); c.fx(t1 + 1.8, 'pop'); c.tl.from(cu.querySelector('.P'), {opacity: 0, x: 30, duration: .6}, Math.min(t1 + 2.3, .22 + c.vz * .8));
  },
};

// ============ 4 · ESCRITORIO FÍSICO ============
const cosa = (c, k, st, o = {}) => { if (!IM[k] || !IM[k].ok) return null; const e = $(`<div class="abs" style="${st};aspect-ratio:${IM[k].w}/${IM[k].h};background:url(${IM[k].src}) center/contain no-repeat;filter:drop-shadow(0 34px 30px rgba(0,0,0,.6))"></div>`); c.cam.appendChild(e); c.tl.from(e, Object.assign({scale: 1.25, opacity: 0, duration: 1, ease: 'power3.out'}, o), o.at || .1); return e; };
const mesa = (c) => { cosa(c, 'consola', 'right:-150px;bottom:-190px;width:760px;transform:rotate(-14deg)', {x: 200, y: 200}); cosa(c, 'prop', 'left:-130px;top:-150px;width:520px;transform:rotate(12deg);opacity:.95', {x: -200, y: -200}); };
const cae = (c, e, at, r) => { c.tl.from(e, {y: -500, x: (rnd() - .5) * 300, rotation: r + (rnd() - .5) * 50, scale: 1.3, opacity: 0, duration: .8, ease: 'power3.out'}, at); c.fx(at + .5, 'pop'); };
const TINTA = '#7c1f2e';
D[4] = {
  felicita: (c) => {
    mesa(c); const ks = (PR.cimgs || ['m1', 'm2', 'm3', 'm4']).filter((k) => IM[k] && IM[k].ok && IM[k].h > IM[k].w).slice(0, 3);
    ks.forEach((k, j) => { const f = $(`<div class="papel" style="left:${1230 + j * 150}px;top:${150 + j * 60}px;width:330px;padding:16px 16px 54px;transform:rotate(${-8 + j * 9}deg)">${img(k, 'width:100%;display:block')}</div>`); c.cam.appendChild(f); cae(c, f, .5 + j * .18, -8 + j * 9); });
    const r = $(`<div class="papel" style="left:330px;top:150px;width:860px;height:800px;padding:70px 76px;transform:rotate(-3deg)"><h4>Comprobante de compra</h4><div style="font:900 84px/1 Montserrat;letter-spacing:-.04em;margin-top:30px">${esc(PR.curso || '')}</div><div style="border-top:3px dashed #b9ab8f;margin:44px 0 30px"></div>${[['Pago', 'Recibido'], ['Acceso', 'Activado'], ['Fecha', 'Hoy']].map(([a, b]) => `<div style="display:flex;justify-content:space-between;font:700 40px Montserrat;margin-top:22px"><span style="color:#8a7a62">${a}</span><span>${b}</span></div>`).join('')}<div style="position:absolute;left:76px;bottom:46px;width:250px;font:600 22px/1.25 Montserrat;color:#8a7a62">${esc(c.sc.s || '')}</div></div>`); c.cam.appendChild(r); fit(r.children[1], 180, 40); cae(c, r, .15, -3);
    const s = $(`<div class="sello" style="left:650px;top:740px;color:${TINTA};transform:rotate(-10deg)">${esc(String(c.sc.t || 'Compra confirmada').replace(/[¡!*]/g, '').split(' ').pop())} ✓</div>`); c.cam.appendChild(s); const ts = Math.max(1.3, c.cue('confirmada', .35));
    c.tl.from(s, {scale: 3.4, opacity: 0, duration: .28, ease: 'power4.in'}, ts); c.tl.fromTo(r, {scale: 1}, {scale: .985, duration: .08, yoyo: true, repeat: 1}, ts + .28); c.fx(ts + .26, 'golpe'); c.fx(ts + .5, 'ding');
  },
  escalera: (c) => {
    const cm = camino(), n = cm.length, ya = YA(), w = Math.min(310, 1560 / n), X = (i) => 180 + i * (1560 / n), Y = (i) => 640 - i * (430 / (n - 1)); mesa(c);
    c.cam.appendChild($(`<div class="papel" style="left:150px;top:60px;padding:22px 40px;transform:rotate(-2deg);font:900 60px Montserrat;letter-spacing:-.03em">${esc(String(c.sc.t || '').replace(/\*/g, ''))}</div>`));
    const ln = $(`<svg class="ln"><path d="M${X(0) + 140} ${Y(0) + 130} ${cm.map((_, i) => `L${X(i) + 140} ${Y(i) + 130}`).join(' ')}" pathLength="1" style="stroke:${rgba('#ffffff', .5)};stroke-width:6;stroke-dasharray:.012 .012"/></svg>`); c.cam.appendChild(ln); c.tl.from(ln, {opacity: 0, duration: 1}, .4);
    cm.forEach((t, i) => { const f = i < ya, e = $(`<div class="nota${f ? '' : ' no'}" style="left:${X(i)}px;top:${Y(i)}px;width:${w - 20}px;transform:rotate(${(i % 2 ? 3 : -4)}deg)"><span>${esc(t)}</span><span style="color:${f ? '#2f7d3b' : '#8a8171'};display:inline-flex;transform:scale(${f ? 2.2 : 1.7});margin-top:8px">${f ? '<svg viewBox="0 0 40 40" width="34" height="34"><path d="M7 22l9 9L34 9" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>' : CAN}</span></div>`); c.cam.appendChild(e); fit(e.firstChild, 100, 22);
      cae(c, e, .4 + i * .22, i % 2 ? 3 : -4); if (f) draw(c.tl, e.querySelector('path'), 1.5 + i * .5, .35);
      else { const at = Math.max(c.cue('cliente', .42) + .3 + (i - ya) * .45, c.cue(String(t).split(/\s+/).pop(), .55 + .12 * (i - ya))); c.tl.to(e, {rotation: (i % 2 ? 3 : -4) + 5, scale: 1.08, duration: .12, yoyo: true, repeat: 3}, at); c.fx(at, 'click'); } });
    const c1 = $(`<div class="cinta" style="left:${X(0) - 10}px;top:${Y(0) + 300}px;width:${Math.max(520, (ya - 1) * (1560 / n) + w)}px;background:#2f7d3b;color:#fff;transform:rotate(-2deg)">✓ Ya lo tienes · tu curso</div>`), c2 = $(`<div class="cinta" style="left:${X(ya) + 60}px;top:${Y(ya) + 304}px;width:${Math.min(1700 - X(ya), (n - ya - 1) * (1560 / n) + w)}px;background:${TINTA};color:#fff;transform:rotate(-1deg)">${CAN} Lo que aún te falta</div>`); c.cam.append(c1, c2);
    c.tl.from(c1, {scaleX: 0, transformOrigin: '0 50%', duration: .5, ease: 'expo.out'}, 1.4); c.tl.from(c2, {scaleX: 0, transformOrigin: '0 50%', duration: .5, ease: 'expo.out'}, c.cue('cliente', .42));
  },
  tool2: (c) => {
    const k = tool(c), der = k.i % 2 === 0; cosa(c, 'prop', `${der ? 'left' : 'right'}:-160px;top:-170px;width:480px;transform:rotate(${der ? 14 : -14}deg)`);
    const o = $(`<div class="abs" style="left:${der ? 60 : 960}px;top:70px;width:900px;height:940px;display:flex;align-items:center;justify-content:center;transform:rotate(${der ? -4 : 4}deg)">${img('c' + k.i, 'max-width:100%;max-height:100%;filter:drop-shadow(0 40px 34px rgba(0,0,0,.65))')}</div>`); c.cam.appendChild(o); cae(c, o, .1, der ? -4 : 4); c.tl.to(o, {scale: 1.04, duration: c.D, ease: 'none'}, 1);
    const p = $(`<div class="papel" style="left:${der ? 1010 : 110}px;top:110px;width:800px;padding:64px 64px 70px;transform:rotate(${der ? 2 : -2}deg)"><div style="position:absolute;left:50%;top:-30px;width:210px;height:74px;margin-left:-105px;border-radius:14px;background:linear-gradient(#9a9a9a,#5c5c5c);box-shadow:0 8px 12px rgba(0,0,0,.4)"></div><h4>${esc(k.et)}${k.ct.valor ? ' · valor ' + money(+k.ct.valor) : ''}</h4><div class="tt" style="font:900 84px/1 Montserrat;letter-spacing:-.04em;margin-top:24px">${esc(k.t)}</div><div style="font:700 38px/1.2 Montserrat;color:${TINTA};margin-top:20px">${esc(k.s)}</div><div style="border-top:3px dashed #b9ab8f;margin:34px 0 8px"></div>${k.pts.map((x) => `<div class="pp" style="display:flex;align-items:center;gap:22px;font:700 40px/1.15 Montserrat;margin-top:26px"><svg viewBox="0 0 44 44" width="52" height="52" style="flex:none"><rect x="3" y="3" width="38" height="38" rx="6" fill="none" stroke="#8a7a62" stroke-width="3"/><path d="M9 22l9 9L40 4" fill="none" stroke="#2f7d3b" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/></svg>${esc(x)}</div>`).join('')}</div>`); c.cam.appendChild(p); fit(p.querySelector('.tt'), 180, 40); cae(c, p, .35, der ? 2 : -2);
    p.querySelectorAll('.pp').forEach((e, j) => { const at = .22 + c.vz * (.4 + .5 * j / k.pts.length); draw(c.tl, e.querySelector('path'), at, .3, 'power2.out'); c.fx(at + .1, 'tick'); });
  },
  precio: (c) => {
    const {val, pre, desc} = precio(), tP = Math.max(c.cue('llevas', null) || c.cue('por solo', null) || c.cue(' por ', .72), 2.6); mesa(c);
    const a = $(`<div class="etq" style="left:230px;top:300px;width:760px;height:400px;background:linear-gradient(170deg,#d9c39b,#c2a878);color:#2a2110;transform:rotate(-7deg)"><div style="font:800 30px Montserrat;letter-spacing:.2em">VALOR DE REFERENCIA</div><div style="font-size:230px;letter-spacing:-.05em;line-height:1">${money(val)}</div><svg style="position:absolute;inset:0;width:100%;height:100%;overflow:visible"><path d="M150 300C330 250 520 180 720 120" pathLength="1" fill="none" stroke="${TINTA}" stroke-width="22" stroke-linecap="round"/></svg></div>`);
    const b = $(`<div class="etq" style="left:820px;top:330px;width:900px;height:520px;background:linear-gradient(160deg,${P.c},${P.a});color:${P.sobre};transform:rotate(4deg)"><div style="font:800 36px Montserrat;letter-spacing:.2em">HOY LO LLEVAS POR</div><div class="nb" style="font-size:360px;letter-spacing:-.05em;line-height:.95">${money(pre)}</div></div>`);
    const s = $(`<div class="abs big" style="left:560px;top:690px;width:310px;height:310px;border-radius:50%;background:${TINTA};color:#fff;display:flex;align-items:center;justify-content:center;font-size:120px;transform:rotate(12deg);box-shadow:0 26px 30px rgba(0,0,0,.5)">−${desc}%</div>`);
    c.cam.append(a, b, s); c.cam.appendChild($(`<div class="papel" style="left:150px;top:70px;padding:20px 38px;transform:rotate(-2deg);font:900 52px Montserrat;letter-spacing:-.02em">${esc(c.sc.k || 'Precio exclusivo')}</div>`));
    cae(c, a, .3, -7); draw(c.tl, a.querySelector('path'), tP - .6, .4, 'power2.in'); c.fx(tP - .5, 'whoosh'); cae(c, b, tP, 4); c.fx(tP + .5, 'golpe'); c.fx(tP + .7, 'monedas');
    c.tl.from(s, {scale: 3, opacity: 0, duration: .3, ease: 'power4.in'}, Math.max(1.3, c.cue('por ciento', .16))); c.fx(Math.max(1.3, c.cue('por ciento', .16)) + .28, 'golpe');
  },
};

// ============ 5 · INFOGRAFÍA ISOMÉTRICA ============
const U = 78, C30 = Math.cos(Math.PI / 6), iso = (o, x, y, z) => [o[0] + (x - y) * C30 * U, o[1] + (x + y) * .5 * U - z * U], pt = (a) => a.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
const cubo = (o, x, y, w, d, h, s = {}) => { const q = (a, b, c2) => iso(o, a, b, c2), dash = s.dash ? `stroke-dasharray="12 10" stroke="${rgba(P.ink, .5)}" stroke-width="3"` : `stroke="${rgba(P.bg, .6)}" stroke-width="2"`;
  return `<g class="cb"><polygon points="${pt([q(x, y + d, 0), q(x + w, y + d, 0), q(x + w, y + d, h), q(x, y + d, h)])}" fill="${s.izq}" ${dash}/><polygon points="${pt([q(x + w, y, 0), q(x + w, y + d, 0), q(x + w, y + d, h), q(x + w, y, h)])}" fill="${s.der}" ${dash}/><polygon points="${pt([q(x, y, h), q(x + w, y, h), q(x + w, y + d, h), q(x, y + d, h)])}" fill="${s.top}" ${dash}/></g>`; };
const ORO5 = () => ({top: P.c, izq: P.a, der: rgba(P.a, .62)}), GRIS5 = () => ({top: rgba(P.ink, .09), izq: rgba(P.ink, .05), der: rgba(P.ink, .03), dash: 1}), BASE5 = () => ({top: P.sup, izq: rgba(P.ink, .1), der: rgba(P.ink, .06)});
const sv5 = (c, html) => { const s = $(`<svg class="abs" style="inset:0;overflow:visible" width="1920" height="1080">${html}</svg>`); c.cam.appendChild(s); return s; };
const call = (c, x, y, k, t, at, o = {}) => { const e = $(`<div class="call" style="left:${x}px;top:${y}px;${o.st || ''}"><small>${esc(k)}</small>${esc(t)}</div>`); c.cam.appendChild(e); c.tl.from(e, {scale: .6, opacity: 0, duration: .5, ease: 'back.out(1.8)'}, at); return e; };
D[5] = {
  felicita: (c) => {
    const o = [560, 640]; const s = sv5(c, cubo(o, -2.6, -2.6, 5.2, 5.2, .35, BASE5()) + cubo(o, -1.9, -1.9, 3.8, 3.8, .9, {top: rgba(P.a, .5), izq: rgba(P.a, .32), der: rgba(P.a, .2)}) + cubo(o, -1.2, -1.2, 2.4, 2.4, 1.9, ORO5()) + (() => { const a = iso(o, -.55, .1, 1.92), b = iso(o, -.05, .6, 1.92), d = iso(o, .7, -.6, 1.92); return `<path class="ck" d="M${a} L${b} L${d}" fill="none" stroke="${P.sobre}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" pathLength="1"/>`; })()
      + `<path class="fl" d="M900 420H1000M900 620H1000M900 820H1000" pathLength="1" fill="none" stroke="${P.a}" stroke-width="4" stroke-dasharray=".03 .03"/>`);
    c.tl.from(s.querySelectorAll('.cb'), {y: -500, opacity: 0, duration: .8, ease: 'bounce.out', stagger: .25}, .15); draw(c.tl, s.querySelector('.ck'), 1.05, .4); c.fx(.9, 'golpe'); c.fx(1.2, 'ding'); onda(c, 560, 500, 1.15, 330);
    texto(c, {x: 120, y: 60, w: 1700, t: c.sc.t, size: 118, maxH: 140, at: .3});
    const tp = c.cue('compra', .3, 1.6); [['Paso 1', 'Pago recibido'], ['Paso 2', (PR.curso || 'Tu curso') + ': acceso activado'], ['Paso 3', 'Ya eres parte de la comunidad']].forEach(([k, t], j) => { const e = call(c, 1010, 360 + j * 200, k, t, tp + j * .45, {st: 'white-space:normal;width:760px;font-size:40px;padding:26px 34px'}); c.fx(tp + j * .45, 'tick'); });
    c.tl.from(s.querySelector('.fl'), {opacity: 0, duration: .6}, tp);
  },
  escalera: (c) => {
    const cm = camino(), n = cm.length, ya = YA(), w = Math.min(2.6, 10.4 / (n - 1)), o = [330, 800], tf = c.cue('cliente', .42), Hh = (i) => .6 + i * .55; let h = cubo(o, -.5, -(n - 1) * w - .5, 2.3, n * w + 1, .2, BASE5());
    for (let i = n - 1; i >= 0; i--) h += cubo(o, 0, -i * w, 1.3, w, Hh(i), i < ya ? ORO5() : GRIS5());  // de atrás hacia adelante
    const s = sv5(c, h), cb = s.querySelectorAll('.cb'), ln = sv5(c, ''); c.tl.from(cb[0], {opacity: 0, y: 60, duration: .7}, .1);
    cm.forEach((t, i) => { const f = i < ya, p = iso(o, .65, -i * w + w / 2, Hh(i)), g = cb[n - i], y = 850 - i * (640 / Math.max(1, n - 1)); c.tl.from(g, {y: -700, opacity: 0, duration: .7, ease: f ? 'bounce.out' : 'power3.out'}, .4 + i * .18);
      const at = f ? 1 + i * .45 : Math.max(tf + .3 + (i - ya) * .45, c.cue(String(t).split(/\s+/).pop(), .55 + .12 * (i - ya)));
      const e = call(c, 1320, y, f ? '✓ Ya lo tienes · tu curso' : 'Lo que aún te falta', t, f ? at : .9 + i * .12, {st: `width:480px;font-size:40px;${f ? 'border-color:' + P.c : 'border-style:dashed;border-color:' + rgba(P.ink, .4) + ';color:' + P.mut}`}); fit(e, 130, 22);
      const L = document.createElementNS('http://www.w3.org/2000/svg', 'path'); L.setAttribute('d', `M${p[0]} ${p[1]}H1230L1270 ${y + 56}H1320`); L.setAttribute('pathLength', 1); L.setAttribute('fill', 'none'); L.setAttribute('stroke', f ? P.c : rgba(P.ink, .45)); L.setAttribute('stroke-width', 4); if (!f) L.setAttribute('stroke-dasharray', '.02 .02'); ln.appendChild(L);
      if (f) draw(c.tl, L, at - .2, .5); else c.tl.from(L, {opacity: 0, duration: .5}, .9 + i * .12);
      if (!f) { c.tl.to(e, {borderColor: P.c, color: P.ink, x: -14, duration: .25, ease: 'back.out(2)'}, at); c.tl.to(g.querySelectorAll('polygon'), {stroke: P.c, duration: .25}, at); c.fx(at, 'click'); } else c.fx(at, 'pop'); });
    const m = iso(o, .65, -(ya - 1) * w + w / 2, Hh(ya - 1)), tu = $(`<div class="tu" style="left:${m[0] - 60}px;top:${m[1] - 96}px;width:120px"><b>TÚ</b><i></i></div>`); c.cam.appendChild(tu); c.tl.from(tu, {y: -300, opacity: 0, duration: .7, ease: 'bounce.out'}, 1.9);
    texto(c, {x: 120, y: 60, w: 1100, t: c.sc.t, size: 108, maxH: 128, at: .15});
  },
  tool2: (c) => {
    const k = tool(c), o = [960, 800], s = sv5(c, cubo(o, -3.4, -3.4, 6.8, 6.8, .3, BASE5()) + cubo(o, -2.9, -2.9, 5.8, 5.8, .14, {top: rgba(P.a, .34), izq: rgba(P.a, .5), der: rgba(P.a, .3)}));
    c.tl.from(s.querySelectorAll('.cb'), {y: 200, opacity: 0, duration: .8, ease: 'expo.out', stagger: .15}, .1);
    const im = $(`<div class="abs" style="left:560px;top:150px;width:800px;height:720px;display:flex;align-items:center;justify-content:center">${img('c' + k.i, 'max-width:100%;max-height:100%;filter:drop-shadow(0 50px 40px rgba(0,0,0,.6))')}</div>`); c.cam.appendChild(im); c.tl.from(im, {y: -500, opacity: 0, scale: .7, duration: 1, ease: 'back.out(1.3)'}, .3); flota(c.tl, im, c.D, {at: 1.5}); c.fx(.9, 'pop');
    const hd = $(`<div class="abs ctr" style="left:120px;right:120px;top:36px"><div class="K c">${esc(k.et)}${k.ct.valor ? ' · valor ' + money(+k.ct.valor) : ''}</div><div class="T" style="font-size:84px;margin-top:10px">${esc(k.t)}</div></div>`); c.cam.appendChild(hd); fit(hd.querySelector('.T'), 100, 40); sube(c.tl, hd.children, .2);
    const pos = [[80, 300, 560, 380], [1400, 300, 1360, 380], [80, 640, 560, 680], [1400, 640, 1360, 680]], ln = sv5(c, '');
    k.pts.forEach((p, j) => { const [x, y, ax, ay] = pos[j], at = .22 + c.vz * (.4 + .5 * j / k.pts.length), e = call(c, x, y, '0' + (j + 1), p, at, {st: 'width:440px;white-space:normal'}); const L = document.createElementNS('http://www.w3.org/2000/svg', 'path'); L.setAttribute('d', `M${x < 900 ? x + 440 : x} ${y + 60}L${ax} ${ay + 20}`); L.setAttribute('pathLength', 1); L.setAttribute('fill', 'none'); L.setAttribute('stroke', P.a); L.setAttribute('stroke-width', 4); ln.appendChild(L); draw(c.tl, L, at + .1, .4); c.fx(at, 'tick'); });
    const sb = $(`<div class="abs ctr" style="left:120px;right:120px;bottom:44px"><span class="chip lleno" style="font-size:36px;padding:16px 40px">${esc(k.s)}</span></div>`); c.cam.appendChild(sb); salta(c.tl, sb.firstChild, 1.1);
  },
  precio: (c) => {
    const {val, pre, desc} = precio(), o = [600, 670], tP = Math.max(c.cue('llevas', null) || c.cue('por solo', null) || c.cue(' por ', .72), 2.6), hA = 5, hB = Math.max(.45, hA * pre / Math.max(1, val));
    const s = sv5(c, cubo(o, -.6, -.6, 8.4, 3, .25, BASE5()) + cubo(o, .4, 0, 2, 2, hA, {top: rgba(P.ink, .3), izq: rgba(P.ink, .2), der: rgba(P.ink, .13)}) + cubo(o, 5, 0, 2, 2, hB, ORO5()));
    const cb = s.querySelectorAll('.cb'), a = iso(o, 1.4, 1, hA), b = iso(o, 6, 1, hB); c.tl.from(cb[0], {opacity: 0, y: 60, duration: .7}, .1); c.tl.from(cb[1], {y: -800, opacity: 0, duration: .9, ease: 'bounce.out'}, .4); c.tl.from(cb[2], {y: -800, opacity: 0, duration: .7, ease: 'bounce.out'}, tP);
    const ea = call(c, a[0] - 230, a[1] - 215, 'Valor de referencia', money(val), 1.3, {st: 'font-size:104px;font-weight:900;line-height:1;padding:16px 40px 20px;text-align:center;width:460px'});
    const eb = call(c, 1180, 250, 'Hoy lo llevas por', money(pre), tP + .3, {st: `font-size:330px;font-weight:900;line-height:.95;padding:30px 56px 36px;text-align:center;border-color:${P.c};color:${P.c}`});
    c.tl.to(ea, {opacity: .5, textDecoration: 'line-through', duration: .3}, tP - .2); c.tl.to(cb[1], {opacity: .5, duration: .4}, tP - .2); c.fx(tP + .5, 'golpe'); c.fx(tP + .7, 'monedas');
    const fl = sv5(c, `<path d="M${b[0]} ${b[1] - 10}L${b[0]} ${b[1] - 60}L1110 560H1180" pathLength="1" fill="none" stroke="${P.c}" stroke-width="5"/>`); draw(c.tl, fl.querySelector('path'), tP + .2, .5);
    const d = $(`<div class="abs" style="left:1180px;top:790px"><span class="chip lleno" style="font-size:52px;padding:18px 44px;font-weight:900">−${desc}% de descuento</span></div>`); c.cam.appendChild(d); c.tl.from(d.firstChild, {scale: 2.2, opacity: 0, duration: .5, ease: 'back.out(1.7)'}, Math.max(1.5, c.cue('por ciento', .16)));
    texto(c, {x: 120, y: 60, w: 1100, k: c.sc.k || 'Precio exclusivo', at: .15});
  },
};
// ============ PUESTA EN ESCENA GENERAL ============
// Las escenas que un director todavía no reinterpreta por completo se montan dentro de su mundo:
// 1 fondo 3D con los objetos del producto · 2 palabra gigante de fondo · 3 dentro de la ventana · 4 sobre una hoja en el escritorio · 5 sobre la retícula con plataforma isométrica.
const BASES = ['multitud', 'gracias', 'porque', 'revela', 'todas', 'exclusiva', 'inversion', 'garantia', 'cta2', 'generico'];
const caja = (cont, esc0, dx, dy) => { const h = $(`<div style="position:absolute;left:${dx}px;top:${dy}px;width:1920px;height:1080px;transform-origin:0 0;transform:scale(${esc0})"></div>`); cont.appendChild(h); return h; };
const PAPEL = {bg: '#f3ecdc', sup: '#e6dcc6', ink: '#1e1712', mut: '#6f6352', a: '#7c1f2e', c: '#a23445', b: '#c9b98f', sobre: '#ffffff'};
const conPaleta = (pal, el, f) => { const o = Object.assign({}, P); Object.assign(P, pal); const st = el.style;
  Object.entries({bg: P.bg, a: P.a, b: P.b, c: P.c, sup: P.sup, ink: P.ink, mut: P.mut, sobre: P.sobre, aB: rgba(P.a, .5), aS: rgba(P.a, .25), halo: rgba(P.a, .16), mutB: rgba(P.mut, .3), inkB: rgba(P.ink, .42)}).forEach(([k, v]) => st.setProperty('--' + k, v));
  try { f(); } finally { Object.assign(P, o); } };
const puesta = {
  1: (c, n) => { const w = mundo(c); polvo3(w, 200); suelo(w).position.y = -3.2;
    [['pack', -8.5, 1.2, -9, .5, 5], ['prop', 8.5, 1.6, -11, -.5, 5], [(PR.cimgs || ['m2'])[1] || 'm2', -6.5, -1.2, -15, .4, 4], [(PR.cimgs || ['m3'])[2] || 'm3', 7, -1, -16, -.4, 4]].forEach(([k, x, y, z, r, tam], j) => { if (['revela', 'cta2', 'exclusiva'].includes(n) && k === 'pack') return; const m = foto(k, tam, {opacity: .26, alphaTest: 0, depthWrite: false}); if (!m) return; m.position.set(x, y, z); m.rotation.y = r; w.scene.add(m); c.tl.from(m.position, {y: y - 6, duration: 1.6, ease: 'expo.out'}, .1 + j * .1); c.tl.to(m.rotation, {y: -r * .4, duration: c.D + 1, ease: 'sine.inOut'}, 0); });
    w.cam.position.set(-1.6, .4, 12); c.tl.to(w.cam.position, {x: 1.6, z: 10.4, duration: c.D + .4, ease: 'none'}, 0); window.PRO.S[n](c); },
  2: (c, n) => { const t = String(c.sc.k || String(c.sc.t || c.sc.nombre || '').replace(/[*¡!]/g, '')).trim().split(/\s+/).slice(0, 2).join(' '), g = $(`<div class="abs big hue" style="left:-60px;bottom:-70px;font-size:430px;opacity:.55;-webkit-text-stroke:3px ${rgba(P.mut, .22)}">${esc(t)}</div>`); c.cam.appendChild(g);
    c.tl.fromTo(g, {x: 120}, {x: -260, duration: c.D + 1, ease: 'none'}, 0); c.tl.from(g, {opacity: 0, duration: 1}, .1); window.PRO.S[n](c); },
  3: (c, n) => { const {cu} = app(c, (TEC ? ruta + '/' : '') + (c.sc.nombre || PR.oferta || ''), {x: 130, y: 70, w: 1660, h: 940, pad: '0'}); window.PRO.S[n](Object.assign({}, c, {cam: caja(cu, .8, 62, 6)})); },
  4: (c, n) => { cosa(c, 'consola', 'right:-190px;bottom:-230px;width:700px;transform:rotate(-14deg)', {x: 200, y: 200}); cosa(c, 'prop', 'left:-170px;top:-190px;width:480px;transform:rotate(12deg)', {x: -200, y: -200});
    const h = $(`<div class="papel" style="left:170px;top:64px;width:1580px;height:950px;transform:rotate(${(c.i % 2 ? 1 : -1.2)}deg);overflow:hidden"></div>`); c.cam.appendChild(h); cae(c, h, .05, c.i % 2 ? 1 : -1.2);
    conPaleta(PAPEL, h, () => window.PRO.S[n](Object.assign({}, c, {cam: caja(h, .8, 22, 43)}))); },
  5: (c, n) => { const o = [1640, 900], s = sv5(c, cubo(o, -1.5, -1.5, 3, 3, .3, BASE5()) + cubo(o, -1, -1, 2, 2, .9, {top: rgba(P.a, .5), izq: rgba(P.a, .32), der: rgba(P.a, .2)}) + cubo([200, 980], -1.2, -1.2, 2.4, 2.4, .5, GRIS5())); s.style.opacity = .5; c.tl.from(s.querySelectorAll('.cb'), {y: 200, opacity: 0, duration: .9, ease: 'expo.out', stagger: .15}, .1); window.PRO.S[n](c); },
};
[1, 2, 3, 4, 5].forEach((d) => BASES.forEach((n) => { if (!D[d][n]) D[d][n] = (c) => puesta[d](c, window.PRO.S[n] ? n : 'generico'); }));
})();
