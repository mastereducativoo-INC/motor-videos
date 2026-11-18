"""Lo que corre en GitHub Actions: baja la receta de una versión y sus imágenes del panel, arma el video y lo sube.
Variables: VSL_ID, VSL_N (versión 1 a 5), PANEL, ACTIONS_ID_TOKEN_REQUEST_URL/TOKEN (las pone GitHub), KOKORO_DIR."""
import io, json, os, sys, time, traceback, urllib.request, urllib.parse
from PIL import Image

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import estudio  # noqa: E402

PANEL = os.environ['PANEL'].rstrip('/')
PROY = os.environ['VSL_ID']
N = os.environ.get('VSL_N') or '0'
RUN = os.environ.get('GITHUB_RUN_ID', '')
_TOK = {'v': None, 'at': 0}


def token():
    if not _TOK['v'] or time.time() - _TOK['at'] > 240:
        u = os.environ['ACTIONS_ID_TOKEN_REQUEST_URL'] + '&audience=panel-me-vsl'
        rq = urllib.request.Request(u, headers={'Authorization': 'Bearer ' + os.environ['ACTIONS_ID_TOKEN_REQUEST_TOKEN']})
        _TOK['v'] = json.load(urllib.request.urlopen(rq, timeout=30))['value']
        _TOK['at'] = time.time()
    return _TOK['v']


def api(accion, datos=None, crudo=False, **q):
    q.update(accion=accion, id=PROY, n=N)
    url = f'{PANEL}/api/vsl/render?' + urllib.parse.urlencode(q)
    for intento in range(4):
        body, head = None, {'Authorization': 'Bearer ' + token(), 'User-Agent': 'vsl-estudio'}
        if isinstance(datos, (bytes, bytearray)):
            body, head['Content-Type'] = bytes(datos), 'application/octet-stream'
        elif datos is not None:
            body, head['Content-Type'] = json.dumps(datos).encode(), 'application/json'
        try:
            r = urllib.request.urlopen(urllib.request.Request(url, data=body, headers=head, method='POST' if body is not None else 'GET'), timeout=120)
            return r.read() if crudo else json.load(r)
        except Exception:
            if intento == 3:
                raise
            time.sleep(3 * (intento + 1))


def paso(t):
    print('»', t, flush=True)
    try:
        api('paso', {}, paso=t, run=RUN)
    except Exception:
        pass


def bajar(k, modo):
    try:
        return Image.open(io.BytesIO(api('img', crudo=True, k=k))).convert(modo)
    except Exception as ex:
        print('imagen no disponible', k, ex, flush=True)
        return None


def datos():
    """VSL_MODO=datos: deja la receta y sus imágenes en /tmp/datos (se guardan como artefacto para probar el motor fuera del panel)."""
    r = api('receta')
    os.makedirs('/tmp/datos', exist_ok=True)
    json.dump(r, open('/tmp/datos/receta.json', 'w'), ensure_ascii=False)
    for k, blob in ((r.get('motion') or {}).get('materiales') or {}).items():
        try:
            open(f'/tmp/datos/{k}.bin', 'wb').write(api('img', crudo=True, k=blob))
        except Exception as ex:
            print('sin imagen', k, ex, flush=True)


def main():
    if os.environ.get('VSL_MODO') == 'datos':
        return datos()
    paso('Preparando el estudio')
    r = api('receta')
    if r.get('motion'):
        # estudio v3: motor de animación aprobado (vsl/motion/largo) + revisión de calidad
        sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'motion', 'largo'))
        import motion_render
        partes = int(os.environ.get('VSL_PARTES') or 1)
        if partes > 1 and r['motion'].get('modo') != 'vista':
            k = int(os.environ.get('VSL_PARTE') or 0)
            res = motion_render.correr(r, lambda x: bajar(x, 'RGBA'), paso, parte=k, partes=partes, carpeta=os.environ.get('VSL_CARPETA', '/tmp/partes'))
            print('parte', k, 'lista:', res.get('tiempos'), flush=True)
            return
        res = motion_render.correr(r, lambda k: bajar(k, 'RGBA'), paso)
        try:
            api('qa', res['qa'])
        except Exception as ex:
            print('no se pudo guardar la revisión', ex, flush=True)
        if res['modo'] == 'vista':
            paso('Subiendo la vista previa')
            print('vista:', api('hoja', open(res['hoja'], 'rb').read()), flush=True)
            return
        return subir(res['salida'], {'duracion': res['duracion'], 'escenas': res['escenas']})
    if r.get('cine'):
        # motor de cine: storyboard toma por toma, con sus recursos propios
        import cine
        usados = {t.get('fondo', {}).get('img') for t in r['cine'].get('tomas', [])} | {c.get('img') for t in r['cine'].get('tomas', []) for c in t.get('capas') or []}
        imgs = {}
        for k in usados - {None}:
            blob = (r.get('recursos') or {}).get(k) or k
            x = bajar(blob, 'RGBA')
            if x is not None:
                imgs[k] = x
        for t in r['cine'].get('tomas', []):
            for c in t.get('capas') or []:
                if c.get('img') in imgs:
                    imgs[c['img']] = estudio.quitar_fondo(imgs[c['img']], print)
        paso(f'Grabando la voz y animando {len(r["cine"]["tomas"])} tomas')
        salida = '/tmp/vsl.mp4'
        info = cine.producir(r['cine'], salida, imgs, log=lambda m: print(m, flush=True))
        return subir(salida, info)
    imgs, els, fos = {}, {}, {}
    for e in r.get('escenas') or []:
        if e.get('img'):
            x = bajar(e['img'], 'RGB')
            if x is not None:
                imgs[e['id']] = x
    usados = {k for e in r.get('escenas') or [] for k in (e.get('elementos') or [])} | {it.get('elemento') for e in r.get('escenas') or [] for it in (e.get('items') or []) if isinstance(it, dict)}
    for el in r.get('elementos') or []:
        if el['id'] in usados:
            x = bajar(el['img'], 'RGBA')
            if x is not None:
                els[el['id']] = x
    for f in r.get('fondos') or []:
        x = bajar(f['img'], 'RGB')
        if x is not None:
            fos[str(f['n'])] = x
    props = [x for x in (bajar(k, 'RGBA') for k in (r.get('props') or [])[:3]) if x is not None]
    paso(f'Grabando la voz y animando {len(r.get("escenas") or [])} escenas')
    salida = '/tmp/vsl.mp4'
    info = estudio.producir(r, salida, imgs, els, fos, log=lambda m: print(m, flush=True), props=props)
    return subir(salida, info)


def subir(salida, info):
    paso('Subiendo el video al panel')
    vid = api('nuevoVid', {})['vid']
    datos = open(salida, 'rb').read()
    TAM = 20 * 1024 * 1024
    partes = []
    for i in range(0, len(datos), TAM):
        trozo = datos[i:i + TAM]
        api('parte', trozo, vid=vid, parte=len(partes))
        partes.append(len(trozo))
    poster = salida.rsplit('.', 1)[0] + '.jpg'
    tiene = os.path.exists(poster)
    if tiene:
        api('poster', open(poster, 'rb').read(), vid=vid)
    res = api('fin', {'vid': vid, 'partes': partes, 'duracion': info['duracion'], 'poster': tiene, 'escenas': info['escenas']})
    print('listo:', res, flush=True)


def unir_partes():
    """Última máquina: junta las partes, revisa la calidad y sube el video (VSL_UNIR=1)."""
    sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'motion', 'largo'))
    import motion_render
    paso('Uniendo las partes del video')
    res = motion_render.unir_y_revisar(os.environ.get('VSL_CARPETA', '/tmp/partes'))
    try:
        api('qa', res['qa'])
    except Exception as ex:
        print('no se pudo guardar la revisión', ex, flush=True)
    return subir(res['salida'], {'duracion': res['duracion'], 'escenas': res['escenas']})


if __name__ == '__main__':
    try:
        unir_partes() if os.environ.get('VSL_UNIR') else main()
    except Exception as e:
        traceback.print_exc()
        try:
            api('error', {'error': f'{type(e).__name__}: {e}'[:480]})
        except Exception:
            pass
        sys.exit(1)
