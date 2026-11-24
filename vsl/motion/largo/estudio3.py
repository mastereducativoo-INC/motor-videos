"""Estudio de VSL v3: convierte la receta del panel (producto + guion aprobado + configuración) en un video del motor de animación.
La receta trae las escenas ya escritas (plantilla upsell con los datos del producto); aquí solo se arma el estilo con la paleta elegida,
se bajan los materiales con los nombres que espera el motor y se quitan las escenas a las que les faltan imágenes."""
import os, re, shutil
from PIL import Image

AQUI = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(os.path.dirname(AQUI), 'assets')

# materiales del panel -> archivo que usa el motor
NOMBRES = {'pack': 'pack_5.png', 'prop1': 'prop1.png', 'f_cuarto': 'f_cuarto.jpg', 'f_evento': 'f_evento.jpg',
           **{f'c{i}': f'c{i}_5.png' for i in range(12)}, **{f'x{i}': f'x{i}.jpg' for i in range(1, 13)},
           **{f'kf{i}': f'kf{i}.jpg' for i in range(9)}, **{f'ko{i}': f'ko{i}.png' for i in range(1, 9)},  # kf/ko: kit fotográfico del nicho (22 nov)
           **{f'ki{i}': f'ki{i}.png' for i in range(1, 9)},  # ki: objetos 3D ilustrados (23 nov, versiones con estilo «ilus»)
           **{f'j_{x}': f'j_{x}.png' for x in ('estudia', 'practica', 'celular', 'trato', 'cabina', 'feliz', 'ref')}}
CURSO = {**{f'm{i}': f'm{i}.png' for i in range(1, 13)}, 'cert': 'cert.png', 'consola': 'consola.png', 'logo': 'logo.png'}
PIDE = {'recorrido': ['j_estudia', 'j_celular', 'j_cabina'], 'gracias': ['m1'], 'revela': ['pack'], 'todas': ['pack'], 'cta2': ['pack'], 'porque': ['pack', 'm1']}


def quitar_fondo(im):
    """Deja transparente el fondo liso de una imagen (croma o negro de estudio) para que el objeto no salga en un recuadro.
    Regla de Christian (17 nov 2026): todas las imágenes que entran al video van recortadas, con fondo transparente.
    Croma de color vivo: se quita en TODA la imagen (también los huecos encerrados, p. ej. entre las cadenas de una balanza)
    y se limpia el tinte del croma en los bordes. Fondo oscuro o gris: solo lo que toca el borde."""
    import numpy as np
    from PIL import ImageDraw, ImageFilter
    im = im.convert('RGBA'); a = np.asarray(im).astype(np.int16)
    if (a[..., 3] < 250).mean() > .02:
        return im, True  # ya viene recortada
    rgb = a[..., :3]; h, w = rgb.shape[:2]
    borde = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    ref = np.median(borde, axis=0)
    if (np.abs(borde - ref).sum(1) < 70).mean() < .8:
        return im, False  # el fondo no es liso: no se toca
    if int(ref.max() - ref.min()) > 110:  # croma
        d = np.sqrt(((rgb - ref) ** 2).sum(2).astype(np.float32))
        alfa = np.clip((d - 95) / 85, 0, 1)
        if (alfa < .5).mean() < .08 or (alfa < .5).mean() > .97:
            return im, False
        out = rgb.astype(np.float32)
        cerca = np.asarray(Image.fromarray(((alfa < .98) * 255).astype('uint8'), 'L').filter(ImageFilter.MaxFilter(7))) > 0
        alto = [i for i in range(3) if ref[i] > 150]; bajo = [i for i in range(3) if ref[i] <= 150]
        if alto and bajo:  # quita el tinte: los canales del croma no pueden pasar del canal que el croma no tiene
            tope = out[..., bajo].max(2)
            exc = np.clip(out[..., alto].min(2) - tope, 0, None) * cerca
            for i in alto:
                out[..., i] -= exc
        res = np.dstack([np.clip(out, 0, 255), alfa * 255]).astype('uint8')
        o = Image.fromarray(res, 'RGBA')
        al = o.getchannel('A').filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(.8)); o.putalpha(al)
        caja = al.point(lambda v: 255 if v > 12 else 0).getbbox()
        return (o.crop(caja) if caja else o), True
    cerca = (np.abs(rgb - ref).sum(2) < 48)
    m = Image.fromarray((cerca * 255).astype('uint8'), 'L').copy()
    for x in range(0, w, 6):
        for y in (0, h - 1):
            if m.getpixel((x, y)) == 255:
                ImageDraw.floodfill(m, (x, y), 128)
    for y in range(0, h, 6):
        for x in (0, w - 1):
            if m.getpixel((x, y)) == 255:
                ImageDraw.floodfill(m, (x, y), 128)
    fondo = np.asarray(m) == 128
    if fondo.mean() < .08 or fondo.mean() > .97:
        return im, False
    alfa = Image.fromarray(((~fondo) * 255).astype('uint8'), 'L').filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.1))
    out = im.copy(); out.putalpha(alfa)
    caja = alfa.point(lambda v: 255 if v > 12 else 0).getbbox()
    return (out.crop(caja) if caja else out), True


def preset(nombre):
    import temas
    t = temas.estilo(nombre)
    if t:
        return t
    from estilo_final import VIDEOS as FINAL
    for v in FINAL:
        if v['id'] == nombre:
            return dict(v['estilo'])
    return dict(FINAL[4]['estilo'])


def armar(r, bajar):
    """r = receta['motion']; bajar(blob_id) -> PIL.Image o None. Devuelve (video, avisos)."""
    avisos = []
    carpeta = os.path.join(ASSETS, 'est', r['id']); curso = carpeta + '-curso'
    for c in (carpeta, curso):
        shutil.rmtree(c, ignore_errors=True); os.makedirs(c)
    tiene = set()
    for k, blob in (r.get('materiales') or {}).items():
        dest = NOMBRES.get(k) and os.path.join(carpeta, NOMBRES[k]) or CURSO.get(k) and os.path.join(curso, CURSO[k])
        if not dest:
            continue
        im = bajar(blob)
        if im is None:
            avisos.append(f'No se pudo bajar el material «{k}».'); continue
        if dest.endswith('.png') and k == 'cert':
            im = im.convert('RGBA')  # el certificado es una hoja: su propio papel no se recorta
        elif dest.endswith('.png'):
            im, ok = quitar_fondo(im)
            if not ok and k not in ('f_cuarto', 'f_evento'):
                # 23 nov (Matemáticas): la caja, los cursos y los objetos que llegan con escenario (escritorio, pared) salen como un cuadro
                # con fondo en el video. Eso es ERROR (regla F9), no aviso: hay que pedir la imagen otra vez.
                if re.match(r'^ki\d$', k):  # una ilustración con fondo no entra al video (se vería el recuadro): se omite
                    avisos.append(f'La ilustración «{k}» llegó con fondo: no se usó (se vería el recuadro). Pídela otra vez.'); continue
                if re.match(r'^ko\d$', k):  # un objeto decorativo con fondo no se usa (el video sigue con los demás)
                    avisos.append(f'El objeto «{k}» llegó con fondo: no se usó. Pídelo otra vez.'); continue
                if k == 'pack' or re.match(r'^c\d+$', k):
                    avisos.append(f'ERROR IMAGEN: «{k}» llegó con fondo o escenario (no es un color liso): se ve como un cuadro en el video. Pídela otra vez.')
                else:
                    avisos.append(f'La imagen «{k}» no tiene fondo liso: no se pudo recortar.')
        else:
            im = im.convert('RGB')
        im.thumbnail((1400, 1400)); im.save(dest); tiene.add(k)
    # respaldos para que ninguna imagen salga rota
    def copia(a, b, d=curso):
        src = os.path.join(d, a) if os.path.exists(os.path.join(d, a)) else None
        if src and not os.path.exists(os.path.join(d, b)):
            shutil.copy(src, os.path.join(d, b))
    # 19 nov (regla M8): ya NO se copia m1 en m2–m4 (salían mockups repetidos); los que faltan los pide la Fábrica al Laboratorio
    for k in ('consola',):
        copia('m1.png', CURSO[k])
    if 'prop1' not in tiene:  # objeto del nicho opcional: si no hay, no se dibuja nada
        Image.new('RGBA', (8, 8), (0, 0, 0, 0)).save(os.path.join(carpeta, 'prop1.png'))
    if not os.path.exists(os.path.join(curso, 'cert.png')):
        Image.new('RGBA', (8, 8), (0, 0, 0, 0)).save(os.path.join(curso, 'cert.png'))
    prod = r.get('prod') or {}
    n = len([c for c in prod.get('contenidos') or [] if c.get('titulo')])
    for i in range(n):
        if f'c{i}' not in tiene and 'pack' in tiene:
            shutil.copy(os.path.join(carpeta, 'pack_5.png'), os.path.join(carpeta, f'c{i}_5.png')); avisos.append(f'El contenido {i + 1} no tiene imagen: se usa la del paquete.')
    escenas = []
    for sc in r.get('escenas') or []:
        falta = [k for k in PIDE.get(sc.get('c'), []) if k not in tiene]
        if falta:
            avisos.append(f'Se quitó la escena «{sc.get("nombre") or sc.get("c")}»: faltan imágenes ({", ".join(falta)}).'); continue
        e = {k: v for k, v in sc.items() if k not in ('id', 'nombre', 'on', 'ayuda')}
        if e.get('c') == 'recorrido':
            e['pasos'] = [dict(img='j_estudia', bg='f_cuarto' if 'f_cuarto' in tiene else None, t=(prod.get('recorrido') or [''] * 4)[0] or 'Aprendes en casa', h=360),
                          dict(img='c%d_5' % max(0, n - 2), t=(prod.get('recorrido') or [''] * 4)[1] or 'Te preparas', h=360),
                          dict(img='j_celular', t=(prod.get('recorrido') or [''] * 4)[2] or 'Un cliente te escribe', h=380),
                          dict(img='j_cabina', bg='f_evento' if 'f_evento' in tiene else None, t=(prod.get('recorrido') or [''] * 4)[3] or 'Cobras por tu trabajo', h=360)]
            for p in e['pasos']:
                if not p['bg']:
                    p.pop('bg')
        escenas.append(e)
    E = preset((r.get('estilo') or {}).get('preset') or 'f05')
    st = r.get('estilo') or {}
    E.update(ritmo=float(st.get('ritmo') or 1.1), voz=st.get('voz') or 'em_alex', set=5)
    if str(st.get('musica') or '').startswith('!'):  # música elegida en una corrección ("no me gusta la música"): manda sobre el tema
        E['musica'] = st['musica'][1:]
    elif st.get('musica') and not E.get('tema') and not E.get('musicaFija') and E.get('motor') != 'mkt':  # Marketplace: la música la decide el director  # en los temas por nicho la música la decide el tema
        E['musica'] = st['musica']
    # 22 nov: colores pedidos en una corrección ("fondo azul, detalles dorados"): mandan sobre la paleta del diseño y del kit
    col = st.get('colores')
    if isinstance(col, dict):
        col = {k: v for k, v in col.items() if k in ('bg', 'sup', 'ink', 'mut', 'a', 'c', 'b', 'sobre') and re.match(r'^#[0-9a-fA-F]{6}$', str(v))}
        if col:
            E['colores'] = col
            if isinstance(E.get('pal'), dict):
                E['pal'] = {**E['pal'], **col}
    # 23 nov: estilo pedido para ESTA versión en una corrección (v.estilo del panel): letra de títulos, fondo gráfico pastel, objetos ilustrados
    ver = st.get('ver')
    if isinstance(ver, dict):
        ver = {k: v for k, v in ver.items() if (k == 'letra' and v in ('Montserrat', 'Outfit', 'Sora', 'Fraunces', 'Manrope')) or (k == 'peso' and v in (600, 700, 800, 900))
               or (k == 'fondo' and v in ('pastel',)) or (k == 'ilus' and v is True)}
        if ver:
            E['ver'] = ver
    from temas import kit_de
    kit = kit_de(prod, E)
    if kit:  # 20 nov: kit del nicho (fondos, elementos, animaciones, letras, colores y música del nicho; ver pro/kit.js)
        E['kit'], E['kitv'] = kit['nicho'], kit['v']
        if kit.get('foto'):  # 22 nov: kit fotográfico (pro/kit-foto.js): fotos del Laboratorio, paleta, letras y transiciones del nicho
            E['kitf'] = kit['foto']
        if not str(st.get('musica') or '').startswith('!'):
            E['musica'] = kit['musica']
    if E.get('tema'):
        E['cinta'] = (prod.get('oferta') or '').upper()
    cont = [dict(titulo=c.get('titulo'), valor=c.get('valor'), corto=c.get('corto') or c.get('titulo')) for c in (prod.get('contenidos') or []) if c.get('titulo')]
    PR = dict(nicho=prod.get('nicho'), oferta=prod.get('oferta'), curso=prod.get('curso'), valor=_num(prod.get('valor')), precio=_num(prod.get('precio')), alumnos=_num(prod.get('alumnos')) or 0,
              dias=int(_num(prod.get('garantia_dias')) or 7), unidad=prod.get('unidad') or 'herramientas', etiqueta=prod.get('etiqueta') or 'Herramienta',
              mods=[m for m in prod.get('mods') or [] if m] or None, logro=prod.get('logro'), cimgs=[f'm{i}' for i in range(1, 13) if f'm{i}' in tiene] or None, vida=bool(prod.get('acceso_vida')) if 'acceso_vida' in prod else None, camino=prod.get('camino') or None, cont=cont or None, objetivo=prod.get('objetivo') or None)
    PR = {k: v for k, v in PR.items() if v is False or v not in (None, '', [])}
    if E.get('motor') == 'mkt':  # Marketplace: el motor usa los datos del curso tal cual (módulos con sus puntos, logros, alumnos, testimonios)
        PR = {k: prod.get(k) for k in ('curso', 'curso_corto', 'alumnos', 'rating', 'dias', 'mods', 'logros', 'testimonios') if prod.get(k) not in (None, '', [])}
    v = dict(id=r['id'], titulo=r.get('titulo') or r['id'], estilo=E, escenas=escenas, prod=PR,
             assets='../../assets/est/%s/' % r['id'], assets2='../../assets/est/%s-curso/' % r['id'],
             pronuncia=prod.get('pronuncia') or [])
    return v, avisos


def _num(x):
    try:
        n = float(str(x).replace(',', '').replace('$', '').strip()) if str(x).strip() else None
        return int(n) if n is not None and n == int(n) else n
    except ValueError:
        return None
