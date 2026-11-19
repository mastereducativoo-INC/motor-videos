# Video «Así funciona tu plataforma» (19 nov 2026)
Video genérico (sirve para todos los productos, con 3 o 5 order bumps): no dice nombres de curso ni cuántos complementos hay.
Se muestra en la plataforma de alumnos a quien solo compró el curso (`VIDEO` en `public/acceso/estilos.js`).

Cómo se rehace:
1. `voz.py` → voz Kokoro (em_alex) por escena (`v_<escena>.wav`, `voz.json`). Para que Kokoro pronuncie bien: «Gúgol Dráiv», «Súper Pak».
2. `cov.js` → portadas de ejemplo genéricas (`cov/*.png`).
3. `render.js video` → abre `video.html`, que muestra la plataforma REAL (`/acceso/`) dentro de un celular con datos de ejemplo,
   y `escenas.js` deja cada cuadro exacto (30 fps) → `mudo.mp4`. `render.js previa 4,12` saca capturas sueltas.
4. `mezcla.py` → voz + música «infinity» (baja con la voz) + efectos → `audio.wav`; luego ffmpeg con loudnorm -16 LUFS.
5. `tiempos.json` trae `oferta`: segundo en que se dice «Lo quiero todo»; ese número va en `VIDEO.oferta` (ahí aparece el botón dentro del video).
