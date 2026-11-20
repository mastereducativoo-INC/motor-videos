// node grabar.js previa 1,3.9,6.2   |  node grabar.js video
const {chromium} = require('playwright'); const http = require('http'), fs = require('fs'), path = require('path'), {spawn} = require('child_process');
const PUB = '/home/claude/panel-master-educativo/public', R = __dirname, FS = path.resolve(__dirname, '../pdf/node_modules/@fontsource');
const tipos = {'.html': 'text/html', '.png': 'image/png', '.woff2': 'font/woff2'};
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); const f = u.startsWith('/_f/') ? path.join(FS, u.slice(4)) : u.startsWith('/_r/') ? path.join(R, u.slice(4)) : path.join(PUB, u);
  fs.readFile(f, (e, b) => { if (e) { r.writeHead(404); return r.end(); } r.writeHead(200, {'content-type': tipos[path.extname(f)] || 'application/octet-stream'}); r.end(b); }); });
(async () => {
  await new Promise((r) => srv.listen(8811, r));
  const b = await chromium.launch(); const p = await b.newPage({viewport: {width: 390, height: 600}, deviceScaleFactor: 2});
  await p.goto('http://localhost:8811/_r/ios.html'); await p.waitForTimeout(800);
  if (process.argv[2] === 'previa') { for (const t of process.argv[3].split(',')) { await p.evaluate((t) => render(t), +t); await p.screenshot({path: `pv-${t}.png`}); } }
  else {
    const fps = 30, END = await p.evaluate(() => END), n = Math.ceil(END * fps);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-', '-vf', 'scale=540:-2', '-c:v', 'libx264', '-preset', 'slow', '-crf', '26', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', 'instalar-ios.mp4']);
    for (let k = 0; k < n; k++) { await p.evaluate((t) => render(t), k / fps); const buf = await p.screenshot({type: 'png'}); if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r)); }
    ff.stdin.end(); await new Promise((r) => ff.on('close', r));
    await p.evaluate(() => render(12.6)); await p.screenshot({path: 'instalar-ios.jpg', type: 'jpeg', quality: 80});
  }
  await b.close(); srv.close();
})();
