"""Arma un video completo: voz por escena (Kokoro) -> tiempos -> HTML -> cuadros (Chromium) -> MP4 con voz, música y efectos.
Uso: python hacer.py hoja 01 [02 ...]   (revisión rápida: un cuadro por escena)
     python hacer.py video 01 [02 ...]  (video final en ../salida-largo/)"""
import asyncio, hashlib, json, os, subprocess, sys
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(os.path.dirname(AQUI)))
import audio
from videos import VIDEOS
from estilo_camino import VIDEOS as CAMINO
from estilo_compra import VIDEOS as COMPRA
from estilo_final import VIDEOS as FINAL
VIDEOS = VIDEOS + CAMINO + COMPRA + FINAL
from playwright.async_api import async_playwright

FPS, SR = 30, audio.SR
TIPO = {'felicita': 'felicita', 'titulo': 'texto', 'numero': 'gancho', 'curso': 'acceso', 'camino': 'ruta', 'producto': 'producto', 'tool': 'elemento', 'demo': 'elemento', 'rafaga': 'gancho',
        'rejilla': 'elemento', 'carrusel': 'elemento', 'valor': 'valor', 'precio': 'precio', 'garantia': 'garantia', 'compara': 'texto', 'historia': 'texto', 'etapas': 'etapas', 'lista': 'texto', 'cta': 'cta', 'gracias': 'felicita', 'escalera': 'ruta', 'tool2': 'elemento', 'todas': 'valor', 'etapas2': 'etapas', 'alumnos': 'texto', 'porque': 'desbloqueo', 'inversion': 'valor', 'exclusiva': 'texto', 'revela': 'producto', 'recorrido': 'ruta', 'multitud': 'texto', 'cta2': 'cta'}
MIN = {'k_gancho': 4, 'k_dolor': 6, 'k_curso': 5.5, 'k_mod': 6, 'k_logros': 6, 'k_escena': 5, 'k_cert': 4.5, 'k_alumnos': 6, 'k_garantia': 6, 'k_cta': 6, 'rafaga': 5.5, 'carrusel': 9, 'valor': 7, 'precio': 6, 'garantia': 5.5, 'camino': 6, 'compara': 8, 'rejilla': 6, 'demo': 5, 'tool': 4.2, 'curso': 5, 'etapas': 6, 'gracias': 6.5, 'escalera': 10, 'tool2': 4.8, 'todas': 8, 'etapas2': 8, 'alumnos': 6.5, 'porque': 6, 'inversion': 7, 'exclusiva': 6, 'revela': 6, 'recorrido': 9, 'multitud': 7, 'cta2': 6}
CACHE = os.path.join(AQUI, 'build', 'voz'); os.makedirs(CACHE, exist_ok=True)
SALIDA = os.path.join(os.path.dirname(AQUI), 'salida-largo'); os.makedirs(SALIDA, exist_ok=True)


PRON = []  # pronunciación propia del producto (estudio v3): [[como se escribe, como se dice], ...]


def decir(t):
    for a, b in PRON:
        if a:
            t = t.replace(a, b)
    return t.replace('DJ', 'diyéi').replace('Súper Pack', 'Súper Pac').replace('*', '')


PIPER = os.path.join(AQUI, 'voces'); FALTAN = []


def voz_piper(sc, voz, vel):
    """Voces Piper (es_MX, es_AR, es_ES): se generan en GitHub (vsl-voz.yml) y aquí se leen ya hechas."""
    import soundfile as sf
    texto = decir(sc['voz'])
    k = 'p' + hashlib.sha1(json.dumps([texto, voz]).encode()).hexdigest()[:14]
    f = os.path.join(PIPER, k + '.wav')
    if not os.path.exists(f):
        FALTAN.append({'id': k, 'voz': voz, 'texto': texto})
        return np.zeros(int(SR * max(2.0, len(texto) / 15)), np.float32)
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-filter:a', f'atempo={vel:.3f},aresample={SR}', '-ac', '1', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.float32).copy()
    idx = np.where(np.abs(a) > 0.01)[0]
    return a[idx[0]:idx[-1] + 1] if len(idx) else a


def voz_escena(sc, voz, vel, pausa=0.18):
    if not sc.get('voz'):
        return np.zeros(0, np.float32)
    if voz.startswith('es_'):
        return voz_piper(sc, voz, vel)
    tipo = sc.get('tono') or TIPO.get(sc['c'], 'texto')
    k = hashlib.sha1(json.dumps([decir(sc['voz']), voz, vel, tipo] + ([pausa] if pausa != 0.18 else [])).encode()).hexdigest()[:16]
    f = os.path.join(CACHE, k + '.npy')
    if os.path.exists(f):
        return np.load(f)
    a = audio.voces([{'tipo': tipo, 'voz': decir(sc['voz'])}], voz=voz, velocidad=vel, pausa=pausa)[0]
    np.save(f, a)
    return a


def preparar(v):
    E = v['estilo']; t = 0.0; pista = []; niv = []
    for sc in v['escenas']:
        r = E.get('ritmo', 1.0)  # 1.15 = todo el video un 15 % más rápido (voz y tiempos de escena)
        a = voz_escena(sc, E.get('voz', 'em_alex'), E.get('vel', 1.06) * r, 0.18 / r)
        # 18 nov (Christian): la escena siguiente entra en cuanto termina la voz; la animación tiene a lo más 0.9 s extra
        voz_s = len(a) / SR
        vd = max(voz_s + 0.28 / r, min(MIN.get(sc['c'], 2.4) / r, voz_s + 0.9 / r), sc.get('seg', 0))
        sc['t0'] = round(t, 3); sc['vd'] = round(vd, 3); sc['vz'] = round(len(a) / SR, 3); sc['dur'] = round(vd + (5.0 if sc['c'] in ('cta', 'cta2', 'k_cta') else 0), 3)
        pista.append((t + 0.22, a))
        if sc['c'] in ('precio', 'cta', 'cta2', 'k_cta'): niv.append((t, t + sc['dur'], 1.15))
        if sc['c'] in ('garantia', 'k_garantia'): niv.append((t, t + sc['dur'], 0.8))
        t += sc['dur']
    v['dur'] = round(t, 3)
    voz = np.zeros(int(t * SR) + SR, np.float32)
    for t0, a in pista:
        p = int(t0 * SR); voz[p:p + len(a)] += a[:len(voz) - p]
    html = os.path.join(AQUI, 'build', v['id'] + '.html')
    datos = json.dumps({k: v[k] for k in ('id', 'titulo', 'estilo', 'escenas', 'dur', 'prod', 'assets', 'assets2') if k in v}, ensure_ascii=False).replace('</', '<\\/')
    if E.get('motor') == 'mkt':  # video del producto principal (Marketplace): vsl/motion/mkt
        cab, pie = '<link rel="stylesheet" href="../../mkt/mkt.css">', '<script src="../../pro/lib/gsap.min.js"></script><script src="../../mkt/mundos.js"></script><script src="../../mkt/mkt.js"></script>'
    elif E.get('motor') == 'pro':  # motor nuevo (vsl/motion/pro): GSAP + escenas sincronizadas con la voz
        cab, pie = '<link rel="stylesheet" href="../../pro/pro.css">', '<script src="../../pro/lib/gsap.min.js"></script><script src="../../pro/pro.js"></script>' + ('<link rel="stylesheet" href="../../pro/dir.css"><script src="../../pro/lib/three.min.js"></script><script src="../../pro/dir.js"></script><script src="../../pro/nicho.js"></script><link rel="stylesheet" href="../../pro/kit.css"><script src="../../pro/kit.js"></script><script src="../../pro/kit-foto.js"></script>' if E.get('dir') else '')
    else:
        cab, pie = '<link rel="stylesheet" href="../motor.css">', '<script src="../motor.js"></script>'
    open(html, 'w').write('<!doctype html><html lang="es"><head><meta charset="utf-8"><title>%s</title>%s</head><body><script>window.V=%s</script>%s</body></html>' % (v['titulo'], cab, datos, pie))
    return html, voz, niv


_SRV = {}


def _servidor():
    """Sirve vsl/ por http local: las texturas 3D (WebGL) no aceptan imágenes abiertas como archivo."""
    if not _SRV:
        import functools, http.server, threading
        raiz = os.path.dirname(os.path.dirname(AQUI))
        class _H(http.server.SimpleHTTPRequestHandler):
            def log_message(self, *a, **k):
                pass
        h = functools.partial(_H, directory=raiz)
        srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), h)
        threading.Thread(target=srv.serve_forever, daemon=True).start()
        _SRV.update(raiz=raiz, puerto=srv.server_address[1])
    return _SRV


async def abrir(p, html):
    b = await p.chromium.launch()
    errores = []
    pg = await b.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
    pg.on('pageerror', lambda e: errores.append(str(e)))
    sv = _servidor()
    await pg.goto('http://127.0.0.1:%d/%s' % (sv['puerto'], os.path.relpath(html, sv['raiz']).replace(os.sep, '/')))
    try:
        await pg.wait_for_function('window.__listo === true', timeout=20000)
    except Exception:
        raise RuntimeError('no cargó: ' + ' | '.join(errores))
    return b, pg, errores


async def hoja(v):
    from PIL import Image
    import io
    html, _, _ = preparar(v)
    async with async_playwright() as p:
        b, pg, err = await abrir(p, html)
        ims = []
        for sc in v['escenas']:
            for f in ([0.55, 0.97] if sc['c'] in ('precio', 'compara', 'camino', 'valor', 'garantia', 'rafaga', 'carrusel', 'escalera', 'todas', 'alumnos', 'inversion', 'revela', 'recorrido', 'multitud') else [0.93]):
                await pg.evaluate('t => window.__seek(t)', sc['t0'] + sc['vd'] * f)
                ims.append(Image.open(io.BytesIO(await pg.screenshot(type='jpeg', quality=80))).resize((640, 360)))
        await b.close()
    cols = 4; r = (len(ims) + cols - 1) // cols
    g = Image.new('RGB', (640 * cols, 360 * r), '#333')
    for i, im in enumerate(ims):
        g.paste(im, ((i % cols) * 640, (i // cols) * 360))
    out = os.path.join(AQUI, 'build', 'hoja-' + v['id'] + '.jpg'); g.save(out, quality=80)
    print('hoja', v['id'], '%.0f s' % v['dur'], len(v['escenas']), 'escenas', err or '')


async def video(v, partes=1, solo=None, carpeta=None):
    """Video completo. Los cuadros se pueden repartir en partes: en la misma máquina (partes > 1) o en varias máquinas de GitHub
    (solo = número de esta parte; cada una deja su pedazo en `carpeta` y otra máquina los une con unir()).
    __seek(t) es determinista, así que el resultado es el mismo que tomándolos uno por uno."""
    import time
    t0 = time.time()
    html, voz, niv = preparar(v)
    t1 = time.time()
    salida = os.path.join(SALIDA, v['id'] + '.mp4')
    carpeta = carpeta or os.path.join(SALIDA, v['id'] + '-partes'); os.makedirs(carpeta, exist_ok=True)
    wav = os.path.join(carpeta, 'audio.wav')
    dur = v['dur']; total = int(dur * FPS)
    n = partes if solo is None else 1
    tramos = [solo] if solo is not None else list(range(partes))
    paso = (total + partes - 1) // partes
    async with async_playwright() as p:
        b, pg, err = await abrir(p, html)
        if solo in (None, 0):
            sfx = await pg.evaluate('window.SFX || []')
            audio.mezcla(voz, [(float(a), str(x)) for a, x in sfx if a < dur - .2], dur, v['estilo'].get('musica', 'dj'), wav, niv)

        async def parte(k, pagina):
            a0, a1 = k * paso, min(total, (k + 1) * paso)
            seg = os.path.join(carpeta, 'seg_%02d.mp4' % k)
            ff = await asyncio.create_subprocess_exec('ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-r', str(FPS), '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '25',
                                                      '-maxrate', '1000k', '-bufsize', '2000k', '-pix_fmt', 'yuv420p', seg, stdin=asyncio.subprocess.PIPE)
            for f in range(a0, a1):
                await pagina.evaluate('t => window.__seek(t)', f / FPS)
                ff.stdin.write(await pagina.screenshot(type='jpeg', quality=90))
                await ff.stdin.drain()
            ff.stdin.close(); await ff.wait()
            return seg
        extra = [await abrir(p, html) for _ in range(n - 1)]
        paginas = [pg] + [x[1] for x in extra]
        await asyncio.gather(*[parte(k, paginas[i]) for i, k in enumerate(tramos)])
        for x in [b] + [x[0] for x in extra]:
            await x.close()
    t2 = time.time()
    v['tiempos'] = {'voz': round(t1 - t0, 1), 'cuadros': round(t2 - t1, 1), 'partes': partes, 'parte': solo}
    json.dump({'dur': dur, 'cuadros': total, 'partes': partes}, open(os.path.join(carpeta, 'info_%s.json' % ('todo' if solo is None else solo)), 'w'))
    if solo is not None:
        print('parte lista', v['id'], solo, v['tiempos'], err or '', flush=True)
        return
    unir(carpeta, salida)
    v['tiempos']['unir'] = round(time.time() - t2, 1)
    print('listo', v['id'], '%.0f s' % dur, v['tiempos'], err or '', flush=True)


def unir(carpeta, salida):
    """Une los pedazos (seg_00.mp4, seg_01.mp4…) sin volver a codificar y les pone el audio."""
    import glob
    infos = [json.load(open(f)) for f in glob.glob(os.path.join(carpeta, 'info_*.json'))]
    durs = [i['dur'] for i in infos]
    if durs and max(durs) - min(durs) > 0.05:  # tolerancia: milésimas de diferencia por redondeo no son un error
        raise RuntimeError('Las partes no midieron lo mismo: ' + str([i['dur'] for i in infos]))
    segs = sorted(glob.glob(os.path.join(carpeta, 'seg_*.mp4')))
    esperadas = infos[0]['partes'] if infos else len(segs)
    if len(segs) != esperadas:
        raise RuntimeError(f'Faltan partes del video: llegaron {len(segs)} de {esperadas}.')
    lista = os.path.join(carpeta, 'lista.txt')
    open(lista, 'w').write(''.join(f"file '{s}'\n" for s in segs))
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', lista, '-i', os.path.join(carpeta, 'audio.wav'), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k',
                    '-shortest', '-movflags', '+faststart', salida], check=True)

if __name__ == '__main__':
    modo, ids = sys.argv[1], sys.argv[2:]
    if modo == 'piper':  # escribe el lote de voces Piper que faltan; luego se corre vsl-voz.yml con ese lote
        for v in VIDEOS:
            if v['id'] in ids:
                preparar(v)
        lote = 'lote-' + '-'.join(ids)
        json.dump(FALTAN, open(os.path.join(PIPER, lote + '.json'), 'w'), ensure_ascii=False, indent=1)
        print(lote, len(FALTAN), 'voces por generar'); sys.exit(0)
    for v in VIDEOS:
        if v['id'] in ids or 'todos' in ids:
            asyncio.run(hoja(v) if modo == 'hoja' else video(v))
