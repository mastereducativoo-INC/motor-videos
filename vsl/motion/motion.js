// Utilidades de los motion graphics: todo el movimiento son animaciones CSS (o un dibujo por cuadro en onFrame),
// así el video se puede renderizar cuadro por cuadro de forma exacta con __seek(t).
window.M = {
  split(sel) {  // parte un texto en palabras que suben desde detrás de una máscara
    document.querySelectorAll(sel).forEach((el) => {
      let n = 0;
      const walk = (node) => [...node.childNodes].forEach((c) => {
        if (c.nodeType === 3) {
          const f = document.createDocumentFragment();
          c.textContent.split(/(\s+)/).forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { f.append(' '); return; }
            const w = document.createElement('span'); w.className = 'w';
            const i = document.createElement('span'); i.className = 'i'; i.textContent = p; i.style.setProperty('--i', n++);
            w.append(i); f.append(w);
          });
          c.replaceWith(f);
        } else if (c.nodeType === 1 && c.tagName !== 'BR') walk(c);
      });
      walk(el);
    });
  },
  cl: (x) => Math.max(0, Math.min(1, x)),
  out: (x) => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 4),
  io: (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); },
};
window.__seek = (t) => {
  document.getAnimations().forEach((a) => { a.pause(); a.currentTime = t * 1000; });
  if (window.onFrame) window.onFrame(t);
};
// vista previa en el navegador: ?play corre en tiempo real
if (location.search.includes('play')) { const t0 = performance.now(); const tick = () => { const t = ((performance.now() - t0) / 1000) % (window.DUR || 20); window.__seek(t); requestAnimationFrame(tick); }; window.addEventListener('load', tick); }
