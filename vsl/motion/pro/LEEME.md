# Motor PRO de videos (17 nov 2026)

Motor de animación nuevo para los videos del embudo. Sustituye al motor de `../largo/motor.js` cuando el estilo trae `motor: 'pro'`
(todos los temas `t-<familia>-<n>` de `../largo/temas.py`).

- `pro.js` + `pro.css`: una escena = un componente con su propia línea de tiempo (GSAP, pausada). `window.__seek(t)` coloca todo el video
  en el segundo `t`; el resultado es idéntico cuadro a cuadro, así que se puede repartir en varias máquinas.
- `lib/gsap.min.js`: GSAP 3.15 (licencia estándar "sin costo" de GSAP/Webflow, permite uso comercial).
- La voz manda: cada escena recibe `vz` (segundos de voz) y `cue('palabra')` calcula en qué momento se dice esa palabra para que
  la animación aparezca justo cuando se nombra.
- Reglas de diseño: ver el documento del proyecto `claude/video-reglas-de-calidad.md`.
