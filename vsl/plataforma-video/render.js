// node render.js previa 4,12,20   → capturas sueltas  |  node render.js video  → cuadros a ffmpeg (sin audio)
const {chromium} = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path'), {spawn} = require('child_process');
const PUB = '/home/claude/panel-master-educativo/public', BV = __dirname, FS = path.resolve(__dirname, '../pdf/node_modules/@fontsource');
const tipos = {'.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.png': 'image/png', '.jpg': 'image/jpeg', '.json': 'application/json', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.webmanifest': 'application/json'};
const srv = http.createServer((q, r) => {
  let u = decodeURIComponent(q.url.split('?')[0]);
  let f = u.startsWith('/_bv/') ? path.join(BV, u.slice(5)) : u.startsWith('/_f/') ? path.join(FS, u.slice(4)) : path.join(PUB, u);
  if (u.endsWith('/')) f = path.join(f, 'index.html');
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, {'content-type': tipos[path.extname(f)] || 'application/octet-stream'}); r.end(b); });
});
const fontCss = () => { let c = ''; for (const [fam, dir, ws] of [['Montserrat', 'montserrat', [500, 600, 700, 800, 900]], ['Sora', 'sora', [400, 500, 600, 700, 800]]]) for (const w of ws) c += `@font-face{font-family:'${fam}';font-weight:${w};font-style:normal;src:url(http://localhost:8766/_f/${dir}/files/${dir}-latin-${w}-normal.woff2) format('woff2')}\n`; return c; };
const C = '/_bv/cov/';
const B = [
  {id: 1, orden: 1, nombre: 'Guía práctica paso a paso', texto: 'Aplica lo que aprendes con una guía clara, paso a paso, para avanzar con seguridad.', portada: C + 'c1.png'},
  {id: 2, orden: 2, nombre: 'Plantillas listas para usar', texto: 'Ahorra tiempo con plantillas listas: solo las abres y las adaptas a lo que necesitas.', portada: C + 'c2.png'},
  {id: 3, orden: 3, nombre: 'Biblioteca de recursos extra', texto: 'Material de apoyo para repasar, practicar y llevar tu curso todavía más lejos.', portada: C + 'c3.png'},
].map((b) => Object.assign(b, {precio: '6', antes: '60', desc: 90, pago: '#'}));
const inc = ['Material avanzado para profundizar', 'Casos prácticos resueltos', 'Plantillas profesionales', 'Recursos descargables', 'Bonos exclusivos para alumnos'];
const SP = {id: 9, orden: 9, nombre: 'Súper Pack · el nivel más completo', portada: C + 'sp.png', incluye: inc, precio: '12', antes: '120', desc: 90, pago: '#'};
const curso = {tipo: 'curso', nombre: 'Tu curso', portada: C + 'curso.png', abrir: '#'};
const mia = (b) => ({tipo: 'bump', id: b.id, orden: b.orden, nombre: b.nombre, texto: b.texto, portada: b.portada, abrir: '#'});
const base = () => ({id: 'demo', nombre: 'Tu curso', portada: C + 'curso.png', estado: 'activo', curso: '#'});
const DATA = {
  nada: {correo: 'tu•••••@gmail.com', prueba: false, estilo: 1, productos: [Object.assign(base(), {compras: [curso], bumps: B, sp: SP,
    paquete: {id: 99, nombre: 'Paquete completo', portada: C + 'sp.png', precio: '19', antes: '30', ahorro: '11', incluye: B.map((b) => ({nombre: b.nombre, portada: b.portada})).concat([{nombre: SP.nombre, portada: SP.portada}]), pago: '#'}})]},
  uno: {correo: 'tu•••••@gmail.com', prueba: false, estilo: 1, productos: [Object.assign(base(), {compras: [curso, mia(B[0])], bumps: B.slice(1), sp: SP, paquete: null})]},
  todo: {correo: 'tu•••••@gmail.com', prueba: false, estilo: 1, productos: [Object.assign(base(), {compras: [curso].concat(B.map(mia), [{tipo: 'sp', id: 9, orden: 9, nombre: SP.nombre, incluye: inc, portada: SP.portada, abrir: '#'}]), bumps: [], sp: null, paquete: null})]},
};
(async () => {
  await new Promise((r) => srv.listen(8766, r));
  const modo = process.argv[2] || 'previa', fps = 30;
  const b = await chromium.launch();
  const p = await b.newPage({viewport: {width: 1920, height: 1080}});
  await p.route(/fonts\.googleapis/, (r) => r.fulfill({contentType: 'text/css', body: fontCss()})); await p.route(/fonts\.gstatic/, (r) => r.abort());
  await p.route('**/api/acceso', (r) => { const q = JSON.parse(r.request().postData() || '{}'); r.fulfill({contentType: 'application/json', body: JSON.stringify(q.accion === 'pagina' ? DATA.nada : {ok: true})}); });
  await p.route('**/acceso/estilos.js', (r) => { const t = fs.readFileSync(PUB + '/acceso/estilos.js', 'utf8').replace(/const VIDEO = \{[^}]*\};/, "const VIDEO = {src: '/_bv/nada.mp4', poster: '/_bv/poster.jpg', oferta: 1e9};"); r.fulfill({contentType: 'text/javascript', body: t}); });
  await p.addInitScript(() => { try { if (location.pathname.startsWith('/acceso')) localStorage.setItem('me_acceso_t', 'a'.repeat(48)); } catch (e) {} });
  p.on('pageerror', (e) => console.log('ERR', e.message)); p.on('console', (m) => { if (m.type() === 'error') console.log('CONSOLE', m.text()); });
  await p.goto('http://localhost:8766/_bv/video.html', {waitUntil: 'load'});
  await p.waitForFunction(() => { const f = document.querySelector('#app'); return f && f.contentWindow.MA && f.contentDocument.querySelector('.hero'); }, null, {timeout: 20000});
  await p.waitForTimeout(800);
  const voz = JSON.parse(fs.readFileSync(path.join(BV, 'voz.json'), 'utf8'));
  const T = await p.evaluate(([v, d]) => { window.DATA = d; return window.init(v); }, [voz, DATA]);
  fs.writeFileSync(path.join(BV, 'tiempos.json'), JSON.stringify(T, null, 1));
  console.log('duración', T.END.toFixed(2), 'oferta', T.oferta);
  if (modo === 'previa') {
    const ts = (process.argv[3] || '4').split(',').map(Number);
    for (const t of ts) { await p.evaluate((t) => window.render(t), t); await p.waitForTimeout(120); await p.evaluate((t) => window.render(t), t); await p.screenshot({path: path.join(BV, `pv-${String(t).replace('.', '_')}.jpg`), type: 'jpeg', quality: 85}); }
  } else {
    const n = Math.ceil(T.END * fps);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', path.join(BV, 'mudo.mp4')]);
    ff.stderr.on('data', (d) => process.stderr.write(d));
    const t0 = Date.now();
    for (let k = 0; k < n; k++) {
      const t = k / fps;
      await p.evaluate((t) => window.render(t), t);
      const buf = await p.screenshot({type: 'jpeg', quality: 90});
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
      if (k % 150 === 0) console.log(`${k}/${n} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end(); await new Promise((r) => ff.on('close', r));
  }
  await b.close(); srv.close();
})();
