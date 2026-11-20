# Video «Así funciona tu plataforma» (19 nov 2026)
Video genérico (sirve para todos los productos, con 3 o 5 order bumps): no dice nombres de curso ni cuántos complementos hay.
Se muestra en la plataforma de alumnos a quien solo compró el curso (`VIDEO` en `public/acceso/estilos.js`).

Cómo se rehace:
1. `voz3.py` → voz Kokoro (em_alex) por escena a **velocidad 1.1** (pedido de Christian, 19 nov). Fonemas corregidos («Máster», «Google Drive», acento latino).
   El guion va partido en frases con `|`; se genera la escena completa (suena natural) y cada frase se ubica en el silencio más cercano,
   así `voz.json` trae el segundo exacto de cada frase y los toques del dedo caen cuando la voz los dice. `||` = pausa larga (en «todo» deja ver «¡Todo desbloqueado!» antes del «Ojo»).
2. `cov.js` → portadas de ejemplo genéricas (`cov/*.png`).
3. `render.js video` → abre `video.html`, que muestra la plataforma REAL (`/acceso/`) dentro de un celular con datos de ejemplo,
   y `escenas.js` deja cada cuadro exacto (30 fps) → `mudo.mp4`. `render.js previa 4,12` saca capturas sueltas.
4. `mezcla.py` → voz + música «infinity» (baja con la voz) + efectos → `audio.wav`; luego ffmpeg con loudnorm -16 LUFS.
5. `tiempos.json` trae `oferta`: segundo en que se dice «Lo quiero todo»; ese número va en `VIDEO.oferta` (ahí aparece el botón dentro del video).
6. Versiones: `node render.js video x <1-5>` (1 Estudio dorado, 2 Primer plano, 3 Marfil, 4 Escenario, 5 Capítulos). Christian eligió 1, 4 y 5 (en la plataforma va la 1).
   `lanes.sh "VER:DESDE:HASTA:SALIDA" …` renderiza por tramos (DSF=0.6667 → 720p, 30 fps).

## Reglas de movimiento (corrección de Christian, 19 nov: «se traba, muy rápido, confunde»)
- El celular está **quieto** casi todo el video (sin balanceo). Solo hay **5 acercamientos**: «Abrir mi curso», «Instalar», el candado que se abre, «Lo quiero todo» y «Cómo funciona».
- Cada acercamiento entra en 1.6 s y sale en 1.6 s con curva muy suave, a un nivel moderado (1.36× en la versión 1). Nunca se enciman (el motor avisa si pasa).
- El punto al que va la cámara se mide una sola vez; el celular no se sale de cuadro ni tapa el texto.
- El dedo viaja de un punto a otro en ~0.9 s (antes saltaba).
- Los cambios de pantalla (de «uno comprado» a «nada», de «nada» a «todo») pasan con un fundido corto dentro del celular, nunca un salto.
- Capas (Drive, pantalla de inicio, pago, «aprobado») entran en 0.6–0.7 s y la hoja de detalle se anima a mano.

## Arreglos y revisión (19 nov, tarde)
- Los desplazamientos dentro del celular empiezan justo en el cambio de escena (antes brincaban un poco al cambiar).
- Versión 4: el degradado de los subtítulos es una capa fija (`#grad`); antes aparecía de golpe en cada escena.
- `tramos.sh "VER:DESDE:HASTA:SALIDA"` vuelve a hacer solo un tramo y `empalme.py base.mp4 salida.mp4 tramo.mp4:DESDE:HASTA …` lo pega cuadro exacto.
- Revisión obligatoria antes de entregar: medir el cambio entre cuadros seguidos; no debe haber ningún cuadro con un cambio mucho mayor que sus vecinos (un salto).
- En la plataforma va la versión 1: `video-plataforma-3.mp4`, oferta en el segundo 59.9.

## Videos B y C (19 nov, noche) — mismo estilo que la versión 1
- `GUION=B` (compró algo y le falta algo): bienvenida, tu curso, instalar, tu biblioteca («Abrir»), lo que te falta (candado, descripción, precio de alumno, Súper Pack si no lo tiene), cómo desbloquear uno, cierre. Sin la oferta de $19. 1:02.
- `GUION=C` (ya tiene todo): bienvenida, tu curso, instalar, tu biblioteca (todo abierto, «Abrir»), cierre. Sin venta. 0:43.
- Voz: `python3 voz3.py B` / `C` → `voz_b.json`, `v_b_<escena>.wav`; mezcla: `python3 mezcla.py _b`; render: `GUION=B PORT=8796 ./tramos.sh "1:::mb.mp4"`.
- En la plataforma: `VIDEOS.parcial` = `video-plataforma-b1.mp4`, `VIDEOS.completo` = `video-plataforma-c1.mp4`.

## 20 nov — el video ya no vende (Christian: «todo el tiempo estamos vende y vende»)
- Video A: la escena «todo» solo explica que, si quiere todos, la opción especial está en su plataforma arriba de los complementos y que solo aparece si no ha comprado ninguno. Ya no toca «Lo quiero todo» ni muestra «¡Todo desbloqueado!». 1:16. En vivo: `video-plataforma-4.mp4`.
- Pantalla del video (los 3): sin botones de compra (ni dentro del video ni al terminar). «Omitir video» discreto a los 15 s; si ya lo vio, «Volver» desde el inicio. Al terminar: «¡Listo! Ya sabes cómo funciona tu plataforma», «Entrar a mi plataforma» y «Volver a ver el video».
