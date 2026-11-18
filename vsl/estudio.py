"""Estudio de VSL: arma un video completo a partir de una receta (JSON) del panel.

Uso local:   python3 vsl/estudio.py receta.json salida.mp4 [carpeta]
             (carpeta/el/<E1>.jpg = elementos reales; carpeta/fo/<1>.jpg = fondos; carpeta/<escena>.jpg = imagen propia de una escena)
En GitHub:   lo llama .github/workflows/vsl.yml (baja la receta y las imágenes del panel y sube el video).
"""
import json, os, sys, time
import numpy as np
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import audio, video  # noqa: E402

MAXIMO = {'upsell40': 40, 'ventas3': 180}
# efecto de sonido al entrar a cada escena
SFX_POR_TIPO = {'gancho': 'golpe', 'acceso': 'whoosh', 'desbloqueo': 'riser', 'producto': 'whoosh', 'lista': 'whoosh', 'elementos': 'whoosh',
                'precio': 'riser', 'garantia': 'ding', 'cta': 'whoosh', 'imagen': 'whoosh', 'texto': 'whoosh', 'felicita': 'golpe', 'ruta': 'whoosh',
                'elemento': 'whoosh', 'valor': 'whoosh', 'etapas': 'whoosh'}
# qué tan fuerte va la música en cada tipo de escena (sube en los momentos importantes)
NIVEL = {'gancho': 1.0, 'felicita': 1.0, 'desbloqueo': 1.05, 'producto': 1.0, 'precio': 1.15, 'cta': 1.15, 'garantia': 0.7, 'etapas': 0.75, 'ruta': 0.8,
         'lista': 0.8, 'valor': 0.9, 'acceso': 0.8, 'elemento': 0.85, 'texto': 0.8}
_REMBG = {}


def quitar_fondo(im, log=print):
    """Recorta el fondo de un elemento que viene con fondo liso (los mockups que hacen los trabajadores)."""
    if video.tiene_alfa(im):
        return im
    try:
        import rembg
        if 's' not in _REMBG:
            _REMBG['s'] = rembg.new_session('u2net')
        out = rembg.remove(im.convert('RGB'), session=_REMBG['s']).convert('RGBA')
        h = out.getchannel('A').histogram()
        visto = sum(h[128:]) / (out.width * out.height)
        return out if 0.06 < visto < 0.97 else im
    except Exception as ex:  # sin la herramienta, el elemento se usa tal cual
        log(f'sin recorte de fondo: {type(ex).__name__}: {ex}')
        return im


def dinero(v):
    try:
        f = float(str(v).replace('$', '').replace(',', ''))
    except Exception:
        return str(v or '')
    return f'${f:,.0f}' if abs(f - round(f)) < 1e-9 else f'${f:,.2f}'


def preparar(receta, imagenes, elementos, fondos):
    P = dict(receta.get('producto') or {})
    P['precio_txt'] = P.get('precio_txt') or dinero(P.get('precio'))
    P['valor_txt'] = P.get('valor_txt') or (dinero(P.get('valor')) if P.get('valor') else '')
    est = receta.get('estilo') or {}
    ctx = {'producto': P, 'acento': est.get('acento') or '#22d3ee', 'animacion': est.get('animacion') or 'neon', 'subtitulos': bool(receta.get('subtitulos')),
           'imagenes': imagenes, 'elementos': elementos, 'fondos': {str(k): v for k, v in fondos.items()}}
    escenas = [dict(e) for e in receta.get('escenas') or [] if (e.get('voz') or '').strip()]
    for e in escenas:
        # la lista usa los contenidos del producto si el guion no trae sus puntos
        if e.get('tipo') == 'lista' and not e.get('items'):
            e['items'] = [{'texto': c.get('titulo') or c.get('texto'), 'valor': c.get('valor') or None, 'elemento': c.get('elemento')}
                          for c in (P.get('contenidos') or []) if (c.get('titulo') or c.get('texto'))]
        if e.get('tipo') == 'valor':  # la lista de valor siempre sale de los contenidos y valores aprobados
            e['items'] = [{'texto': c.get('titulo'), 'valor': c.get('valor') or None, 'elemento': c.get('elemento')} for c in (P.get('contenidos') or []) if c.get('titulo')]
        e['elementos'] = [x for x in (e.get('elementos') or []) if x in elementos]
    unos = [e for e in escenas if e.get('tipo') == 'elemento']
    for j, e in enumerate(unos):
        e['n'], e['de'] = j + 1, len(unos)
    return ctx, escenas


def producir(receta, salida, imagenes=None, elementos=None, fondos=None, log=print, props=None):
    t0 = time.time()
    elementos = dict(elementos or {})
    usados = {k for e in receta.get('escenas') or [] for k in (e.get('elementos') or [])} | {it.get('elemento') for e in receta.get('escenas') or [] for it in (e.get('items') or []) if isinstance(it, dict)}
    for k in list(elementos):
        if k in usados:
            elementos[k] = quitar_fondo(elementos[k], log)
    ctx, escenas = preparar(receta, imagenes or {}, elementos, fondos or {})
    ctx['motivos'] = receta.get('motivos')
    ctx['musical'] = receta.get('musical')
    ctx['props'] = [quitar_fondo(x, log) for x in (props or [])]
    if not escenas:
        raise RuntimeError('La receta no tiene escenas con voz')
    v = receta.get('voz') or {}
    log(f'voz: {len(escenas)} escenas · estilo {ctx["animacion"]}')
    vel = float(v.get('velocidad') or 1.12)
    pistas = audio.voces(escenas, v.get('id') or 'em_alex', vel)
    SR = audio.SR
    # si pasa del largo de la plantilla, la voz se acelera un poco (hasta 1.25) en vez de cortar el guion
    limite = receta.get('max_seg') or MAXIMO.get(receta.get('plantilla'))
    if limite:
        cierre = float(receta.get('cierre') or 1.0)
        est = sum(len(p) / SR for p in pistas) + len(pistas) * 0.32 + 0.3 + cierre
        if est > limite and vel < 1.25:
            vel2 = min(1.25, vel * est / (limite - 0.4))
            log(f'voz: {est:.1f} s pasa de {limite} s; velocidad {vel:.2f} → {vel2:.2f}')
            pistas = audio.voces(escenas, v.get('id') or 'em_alex', vel2)
    # al terminar la voz el video sigue unos segundos con música y el llamado en pantalla
    colchon_ini, colchon_fin = 0.35, float(receta.get('cierre') or 1.0)
    duraciones, partes, eventos = [], [], []
    for i, (e, p) in enumerate(zip(escenas, pistas)):
        tp = e.get('tipo') or 'imagen'
        antes = float(e.get('pausa_antes') or (0.4 if tp in ('precio', 'desbloqueo') else 0.1))
        # escenas con animación larga necesitan un mínimo para lucirse
        minimo = {'desbloqueo': 3.2, 'precio': 5.0, 'lista': 3.0, 'acceso': 3.0, 'felicita': 2.8, 'ruta': 4.5, 'elemento': 2.8, 'valor': 5.5, 'etapas': 6.0, 'garantia': 3.2}.get(tp, 1.6)
        d = max(minimo, antes + len(p) / SR + 0.16) + (colchon_fin if i == len(escenas) - 1 else 0) + (colchon_ini if i == 0 else 0)
        ini = sum(duraciones)
        partes.append((ini + (colchon_ini if i == 0 else 0) + antes, p))
        s = SFX_POR_TIPO.get(tp)
        if s and i > 0:
            eventos.append((max(0, ini - (0.9 if s == 'riser' else 0.18)), s))
        if tp == 'gancho':
            eventos.append((ini + 0.02, 'golpe'))
        if tp == 'desbloqueo':
            eventos.append((ini + min(1.3, d * 0.32) - 0.05, 'click'))
            eventos.append((ini + min(1.3, d * 0.32), 'golpe'))
        if tp == 'precio':
            eventos.append((ini + 0.9, 'whoosh'))
            eventos.append((ini + d * 0.45, 'golpe'))
            eventos.append((ini + d * 0.45 + 0.04, 'ding'))
        if tp in ('lista', 'valor', 'ruta'):
            n = len(e.get('items') or [])
            ventana = max(0.6, d * (0.62 if tp == 'valor' else 0.75 if tp == 'ruta' else 0.8))
            if tp == 'valor':
                eventos.append((ini + 0.3 + ventana + 0.25, 'ding'))
            eventos += [(ini + 0.3 + ventana * j / max(1, n), 'pop') for j in range(n)]
        if tp == 'elementos':
            n = max(1, min(4, len(e.get('elementos') or [])))
            eventos += [(ini + 0.2 + j * min(0.55, d * 0.6 / n), 'pop') for j in range(n)]
        if tp in ('acceso', 'felicita'):
            eventos.append((ini + 0.5, 'ding'))
        if tp == 'precio':
            eventos.append((ini + 1.5, 'pop'))
        duraciones.append(d)
    total = sum(duraciones)
    voz = np.zeros(int(total * SR) + SR, np.float32)
    for st, p in partes:
        a = int(st * SR)
        voz[a:a + len(p)] += p[:max(0, len(voz) - a)]
    wav = salida + '.wav'
    musica = (receta.get('estilo') or {}).get('musica') or 'suave'
    niveles, acum = [], 0.0
    for e, d in zip(escenas, duraciones):
        niveles.append((acum, acum + d, NIVEL.get(e.get('tipo'), 0.85)))
        acum += d
    audio.mezcla(voz, eventos, total, musica, wav, niveles)
    log(f'audio listo: {total:.1f} s')
    bpm = audio.ESTILOS.get(musica, audio.ESTILOS['suave'])[0]
    dur, poster = video.render(escenas, duraciones, ctx, wav, salida, bpm=bpm if musica in ('dj', 'energia') else None)
    try:
        os.remove(wav)
    except Exception:
        pass
    if poster is not None:
        poster.save(salida.rsplit('.', 1)[0] + '.jpg', quality=88)
    log(f'video listo: {dur:.1f} s en {time.time() - t0:.0f} s')
    return {'duracion': round(dur, 2), 'escenas': [{'id': e.get('id'), 'inicio': round(sum(duraciones[:i]), 2), 'dur': round(d, 2)} for i, (e, d) in enumerate(zip(escenas, duraciones))]}


def _abrir(ruta):
    for ext in ('jpg', 'png', 'webp', 'jpeg'):
        if os.path.exists(f'{ruta}.{ext}'):
            return Image.open(f'{ruta}.{ext}').convert('RGBA')
    return None


def cargar_local(receta, carpeta):
    imgs, els, fos = {}, {}, {}
    for e in receta.get('escenas') or []:
        x = _abrir(os.path.join(carpeta, str(e.get('id'))))
        if x is not None:
            imgs[e.get('id')] = x.convert('RGB')
    if os.path.isdir(os.path.join(carpeta, 'el')):
        for f in os.listdir(os.path.join(carpeta, 'el')):
            els[f.rsplit('.', 1)[0]] = Image.open(os.path.join(carpeta, 'el', f)).convert('RGBA')
    if os.path.isdir(os.path.join(carpeta, 'fo')):
        for f in os.listdir(os.path.join(carpeta, 'fo')):
            fos[f.rsplit('.', 1)[0]] = Image.open(os.path.join(carpeta, 'fo', f)).convert('RGB')
    return imgs, els, fos


if __name__ == '__main__':
    r = json.load(open(sys.argv[1], encoding='utf-8'))
    i, el, fo = cargar_local(r, sys.argv[3]) if len(sys.argv) > 3 else ({}, {}, {})
    print(json.dumps(producir(r, sys.argv[2], i, el, fo), ensure_ascii=False))
