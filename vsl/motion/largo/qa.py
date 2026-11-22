"""Revisión de calidad antes de entregar un video (lo que aprendimos con el primer upsell).
- En la página (cuadro a cuadro): textos o tarjetas fuera del cuadro, cortados o encimados sobre imágenes, imágenes que no cargaron.
- En el MP4: duración, tamaño (< 24 MB), resolución, silencios de más de 1 s, picos, volumen de la música.
- Agregado el 22 nov 2026 (tomado de Huashu Design): cuadros negros, cuadros que parpadean, volumen en LUFS
  y letras demasiado chicas para celular. Los negros son error; lo demás solo avisa.
- En el guion: palabras prohibidas y datos que no coinciden con el producto.
Devuelve {'ok': bool, 'errores': [...], 'avisos': [...], 'medidas': {...}}."""
import json, re, subprocess
import numpy as np

JS = r"""(i) => {
  const sc = window.V.escenas[i], el = sc && sc.el; if (!el) return [];
  const op = (e) => { let o = 1; for (let x = e; x && x !== document.body; x = x.parentElement) { const c = getComputedStyle(x); if (c.display === 'none' || c.visibility === 'hidden') return 0; o *= +c.opacity; } return o; };
  const R = (e) => e.getBoundingClientRect(), area = (r) => Math.max(0, r.width) * Math.max(0, r.height);
  const inter = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const nombre = (e) => (e.className && typeof e.className === 'string' ? e.className.split(' ')[0] : e.tagName.toLowerCase()) + (e.textContent ? ' «' + e.textContent.trim().slice(0, 40) + '»' : '');
  const out = [];
  const textos = [...el.querySelectorAll('h1,h2,h3,h4,.T,.P,.K,.chip,.fila,.btn,.bt,.hoja,.ej')].filter((e) => op(e) > .6 && area(R(e)) > 40);
  const imgs = [...el.querySelectorAll('img')].filter((e) => op(e) > .6);
  for (const im of imgs) if (!im.complete || !im.naturalWidth) out.push(['imagen', 'No cargó la imagen ' + (im.getAttribute('src') || '').split('/').pop()]);
  for (const e of textos) {
    const r = R(e);
    if (r.left < -3 || r.top < -3 || r.right > 1923 || r.bottom > 1083) out.push(['fuera', 'Se sale del cuadro: ' + nombre(e)]);
    if (/h1|h2|h3|T|P|K/.test(e.tagName + ' ' + e.className) && e.scrollWidth > e.clientWidth + 6 && getComputedStyle(e).overflow !== 'visible') out.push(['cortado', 'Texto cortado: ' + nombre(e)]);
    for (const im of imgs) {
      if (e.contains(im) || im.contains(e)) continue;
      const ri = R(im), a = inter(r, ri), m = Math.min(area(r), area(ri));
      if (m > 0 && a / m > .28) out.push(['encima', 'Tarjeta o texto encima de una imagen: ' + nombre(e)]);
    }
  }
  return out;
}"""

PROHIBIDAS = [(r'\bhotmart\b', 'No se menciona Hotmart'), (r'pago [úu]nico', 'No se dice "pago único"'), (r'\brecarg', 'No se dice "si recargas" (no está comprobado)'),
              (r'garantizad[oa]s?\b(?!.*devoluci)', 'Nada de resultados garantizados'), (r'\b(vas a|vas|van a) ganar\b', 'Sin promesas de ingresos'),
              (r'\bganar[áa]s\b', 'Sin promesas de ingresos'), (r'\b(millonari|hazte rico|dinero f[áa]cil)', 'Sin promesas de ingresos'),
              (r'[úu]ltimas? (horas|unidades|lugares)', 'Sin escasez inventada')]


def qa_guion(escenas, prod):
    errores, avisos = [], []
    for k, sc in enumerate(escenas, 1):
        txt = ' '.join(str(sc.get(x) or '') for x in ('voz', 't', 's', 'k'))
        for rx, msg in PROHIBIDAS:
            if re.search(rx, txt, re.I):
                errores.append(f'Escena {k}: {msg}.')
        if '{' in txt or '}' in txt:
            errores.append(f'Escena {k}: quedó un dato sin llenar ({re.findall(r"{[^}]*}", txt)[:1]}).')
    pre, val = str(prod.get('precio') or ''), str(prod.get('valor') or '')
    todo = ' '.join(str(sc.get('t') or '') + ' ' + str(sc.get('s') or '') for sc in escenas)
    for m in re.findall(r'\$\s?(\d+)', todo):
        if m not in (pre, val):
            errores.append(f'En pantalla aparece ${m}, que no es ni el precio (${pre}) ni el valor (${val}).')
    if not prod.get('alumnos_ok') and any(sc.get('c') == 'multitud' for sc in escenas):
        errores.append('La escena de alumnos necesita una cifra confirmada.')
    return errores, avisos


async def qa_pagina(pg, v):
    errores, vistos = [], set()
    for i, sc in enumerate(v['escenas']):
        for f in (0.6, 0.93):
            await pg.evaluate('t => window.__seek(t)', sc['t0'] + sc['vd'] * f)
            for tipo, msg in await pg.evaluate(JS, i):
                k = (i, tipo, msg)
                if k not in vistos:
                    vistos.add(k); errores.append(f'Escena {i + 1} ({sc["c"]}): {msg}')
    return errores


# Tamaño mínimo de letra (px en 1920x1080). Tomado de la regla de lectura de Huashu Design (deck: texto ≥ 24 px);
# aquí se pide un poco más porque el video se ve sobre todo en celular. Solo avisa, no bloquea.
LETRA_MIN = 26
JS_LECTURA = r"""([i, min]) => {
  const sc = window.V.escenas[i], el = sc && sc.el; if (!el) return [];
  const op = (e) => { let o = 1; for (let x = e; x && x !== document.body; x = x.parentElement) { const c = getComputedStyle(x); if (c.display === 'none' || c.visibility === 'hidden') return 0; o *= +c.opacity; } return o; };
  const out = [];
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let n = w.nextNode(); n; n = w.nextNode()) {
    const s = n.textContent.trim(), e = n.parentElement; if (s.length < 2 || !e || op(e) < .6) continue;
    const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) continue;
    const m = new DOMMatrix(getComputedStyle(e).transform === 'none' ? undefined : getComputedStyle(e).transform);
    const px = parseFloat(getComputedStyle(e).fontSize) * Math.hypot(m.a, m.b);
    let k = 1; for (let x = e.parentElement; x && x !== document.body; x = x.parentElement) { const t = getComputedStyle(x).transform; if (t && t !== 'none') { const q = new DOMMatrix(t); k *= Math.hypot(q.a, q.b); } }
    if (px * k < min) out.push(Math.round(px * k) + ' px «' + s.slice(0, 40) + '»');
  }
  return out;
}"""


async def qa_lectura(pg, v):
    """Avisos (no errores) de textos demasiado chicos para leerse en un celular. Un aviso por escena."""
    avisos = []
    for i, sc in enumerate(v['escenas']):
        chicos = {}
        for f in (0.6, 0.93):
            await pg.evaluate('t => window.__seek(t)', sc['t0'] + sc['vd'] * f)
            for msg in await pg.evaluate(JS_LECTURA, [i, LETRA_MIN]):
                px, txt = msg.split(' px «', 1)
                chicos.setdefault(txt.rstrip('»'), int(px))
        if chicos:
            tam = sorted(chicos.values()); ej = sorted(chicos, key=chicos.get)[:2]
            rango = f'{tam[0]} px' if tam[0] == tam[-1] else f'{tam[0]}–{tam[-1]} px'
            avisos.append(f'Escena {i + 1} ({sc["c"]}): {len(chicos)} texto(s) muy chico(s) para celular ({rango}; mínimo {LETRA_MIN}), '
                          f'por ejemplo «{ej[0]}»' + (f' y «{ej[1]}»' if len(ej) > 1 else '') + '.')
    return avisos


def _cuadros(mp4, ancho=64, alto=36):
    """Todos los cuadros del video en gris y muy pequeños (para medir negros y parpadeos)."""
    pr = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'json', mp4],
                                   capture_output=True, text=True).stdout or '{}')
    a, b = (pr.get('streams') or [{}])[0].get('r_frame_rate', '30/1').split('/')
    fps = float(a) / float(b or 1)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-vf', f'scale={ancho}:{alto}:flags=area,format=gray', '-f', 'rawvideo', '-'], capture_output=True).stdout
    return np.frombuffer(raw, np.uint8).reshape(-1, alto * ancho).astype(np.float32), fps


def qa_cuadros(mp4, cortes=None):
    """Revisión de la imagen, cuadro por cuadro (idea tomada de verify-video de Huashu Design y de la regla de saltos del video de la plataforma).
    - Cuadros negros a mitad del video (p. ej. en la unión de las partes) → error.
    - Parpadeos: 1 a 3 cuadros sueltos distintos de lo que hay antes y después (y el video vuelve a lo de antes) → aviso.
    `cortes`: segundos donde empieza cada escena (ahí un cambio grande es normal)."""
    errores, avisos, med = [], [], {}
    f, fps = _cuadros(mp4)
    n = len(f)
    if n < 3:
        return errores, avisos, med
    seg = lambda i: f'{int(i / fps // 60)}:{i / fps % 60:04.1f}'
    # 1) negros
    negro = (f.mean(1) < 8) & (f.std(1) < 3)
    i, malos = 0, []
    while i < n:
        if negro[i]:
            j = i
            while j < n and negro[j]:
                j += 1
            if i > 0 and j < n and (j - i) >= 2:  # al inicio o al final puede ser un fundido a negro intencional
                malos.append(f'{seg(i)} ({(j - i) / fps:.2f} s)')
            i = j
        else:
            i += 1
    med['cuadros_negros'] = len(malos)
    if malos:
        errores.append('Cuadros negros a mitad del video en ' + ', '.join(malos[:5]) + '.')
    # 2) parpadeos: un cuadro suelto que no se parece ni al anterior ni al siguiente (cuadro equivocado, destello o
    #    cuadro negro aislado, típico al unir partes). Un cambio que se queda (contador, cambio de escena) no cuenta.
    d = np.abs(np.diff(f, axis=0)).mean(1)          # d[k] = cambio del cuadro k al k+1
    cerca = lambda t: bool(cortes) and any(abs(t - c) <= 0.2 for c in cortes)
    raros, k = [], 0
    while k < len(d):
        hecho = False
        if d[k] > 18:
            for L in (1, 2, 3):  # destellos de 1 a 3 cuadros
                if k + L < len(d) and d[k + L] > 18 and np.abs(f[k + L + 1] - f[k]).mean() < 0.3 * min(d[k], d[k + L]) and not cerca((k + 1) / fps):
                    raros.append(seg(k + 1)); k += L + 1; hecho = True; break
        if not hecho:
            k += 1
    med['parpadeos'] = len(raros)
    if raros:
        avisos.append('Cuadro suelto que parpadea en ' + ', '.join(raros[:6]) + (' y más' if len(raros) > 6 else '') + '. Revisa esos segundos.')
    return errores, avisos, med


def qa_video(mp4, dur_esperada=None, cortes=None):
    errores, avisos, med = [], [], {}
    import os
    tam = os.path.getsize(mp4); med['mb'] = round(tam / 1048576, 1)
    if tam > 24 * 1048576:
        errores.append(f'El video pesa {med["mb"]} MB (máximo 24 MB para publicarlo).')
    pr = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', mp4], capture_output=True, text=True).stdout or '{}')
    vs = [s for s in pr.get('streams', []) if s.get('codec_type') == 'video']; au = [s for s in pr.get('streams', []) if s.get('codec_type') == 'audio']
    if not vs or not au:
        errores.append('El video no tiene imagen o no tiene sonido.'); return errores, avisos, med
    med['res'] = f'{vs[0]["width"]}x{vs[0]["height"]}'
    if med['res'] != '1920x1080':
        errores.append('La resolución no es 1920x1080.')
    dur = float(pr['format']['duration']); med['seg'] = round(dur, 1)
    if dur_esperada and abs(dur - dur_esperada) > 1.5:
        errores.append(f'Dura {dur:.1f} s y se esperaban {dur_esperada:.1f} s.')
    a = subprocess.run(['ffmpeg', '-v', 'error', '-i', mp4, '-ac', '1', '-ar', '8000', '-f', 's16le', '-'], capture_output=True).stdout
    x = np.frombuffer(a, np.int16).astype(float) / 32768
    if len(x) < 8000:
        errores.append('No se pudo leer el audio.'); return errores, avisos, med
    w = x[:len(x) // 4000 * 4000].reshape(-1, 4000)
    db = 20 * np.log10(np.sqrt((w ** 2).mean(1)) + 1e-9)
    med['db_medio'] = round(float(db.mean()), 1); med['pico'] = round(float(np.abs(x).max()), 2)
    sil = 0; peor = 0
    for d in db[:-1]:
        sil = sil + 1 if d < -40 else 0; peor = max(peor, sil)
    if peor >= 2:
        errores.append(f'Hay {peor * 0.5:.1f} s seguidos casi en silencio.')
    if med['pico'] > 0.99:
        avisos.append('El audio llega al máximo (puede sonar saturado).')
    if med['db_medio'] < -30:
        errores.append('El volumen general está muy bajo.')
    # volumen percibido (LUFS), como lo mide Huashu Design (él recomienda -18 a -10; aquí solo se avisa si se aleja mucho de lo aprobado)
    try:
        r = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', mp4, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
        m = re.findall(r'I:\s*(-?[\d.]+) LUFS', r)
        if m:
            med['lufs'] = float(m[-1])
            if not -24 <= med['lufs'] <= -9:  # los videos aprobados del DJ miden cerca de -21.5
                avisos.append(f'El volumen percibido es {med["lufs"]:.0f} LUFS; muy distinto de los videos aprobados (cerca de -21).')
    except Exception:
        pass
    try:
        e2, a2, m2 = qa_cuadros(mp4, cortes)
        errores += e2; avisos += a2; med.update(m2)
    except Exception as e:  # la revisión de cuadros nunca debe tumbar la entrega
        avisos.append(f'No se pudo revisar la imagen cuadro por cuadro ({e}).')
    return errores, avisos, med
