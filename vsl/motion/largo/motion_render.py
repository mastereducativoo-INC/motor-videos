"""Corre en GitHub (lo llama vsl/gh_render.py) para los proyectos del estudio v3.
modo vista: cuadros de cada escena + revisión de calidad (sin video).  modo video: video completo + revisión de calidad."""
import asyncio, io, json, os, sys
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, AQUI)
import hacer, qa, estudio3  # noqa: E402
from PIL import Image  # noqa: E402


async def _vista(v):
    html, _, _ = hacer.preparar(v)
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b, pg, err = await hacer.abrir(p, html)
        ims = []
        for sc in v['escenas']:
            await pg.evaluate('t => window.__seek(t)', sc['t0'] + sc['vd'] * 0.93)
            ims.append(Image.open(io.BytesIO(await pg.screenshot(type='jpeg', quality=80))).resize((640, 360)))
        errores = await qa.qa_pagina(pg, v)
        lectura = await qa.qa_lectura(pg, v)
        await b.close()
    cols = 4; r = (len(ims) + cols - 1) // cols
    g = Image.new('RGB', (640 * cols, 360 * r), '#222')
    for i, im in enumerate(ims):
        g.paste(im, ((i % cols) * 640, (i // cols) * 360))
    out = os.path.join(AQUI, 'build', 'hoja-' + v['id'] + '.jpg'); g.save(out, quality=78)
    return out, errores + ['Error en la página: ' + e for e in err], lectura


async def _revisar_pagina(v):
    html, _, _ = hacer.preparar(v)
    from playwright.async_api import async_playwright
    async with async_playwright() as p:
        b, pg, err = await hacer.abrir(p, html)
        errores = await qa.qa_pagina(pg, v)
        lectura = await qa.qa_lectura(pg, v)
        # portada: la escena del paquete (o la del medio)
        sc = next((s for s in v['escenas'] if s['c'] == 'revela'), v['escenas'][len(v['escenas']) // 2])
        await pg.evaluate('t => window.__seek(t)', sc['t0'] + sc['vd'] * 0.9)
        await pg.screenshot(path=os.path.join(hacer.SALIDA, v['id'] + '.jpg'), type='jpeg', quality=82)
        await b.close()
    return errores, lectura


def correr(receta, bajar, paso=print, parte=None, partes=1, carpeta=None):
    """parte = None: todo en esta máquina. parte = k: solo el pedazo k de `partes` (la parte 0 además deja el audio,
    la revisión de la página y la portada en `carpeta`; unir_y_revisar() termina el trabajo en otra máquina)."""
    r = receta['motion']
    v, avisos = estudio3.armar(r, bajar)
    hacer.PRON[:] = v.get('pronuncia') or []
    eg, ag = qa.qa_guion(v['escenas'], r.get('prod') or {})
    if r.get('modo') == 'vista':
        paso(f'Armando la vista previa de {len(v["escenas"])} escenas')
        hoja, ep, al = asyncio.run(_vista(v))
        return {'modo': 'vista', 'hoja': hoja, 'qa': {'ok': not (eg + ep), 'errores': eg + ep, 'avisos': avisos + ag + al, 'medidas': {'seg': round(v['dur'], 1), 'escenas': len(v['escenas'])}}}
    if parte is not None:
        paso(f'Animando la parte {parte + 1} de {partes}')
        asyncio.run(hacer.video(v, partes=partes, solo=parte, carpeta=carpeta))
        if parte == 0:
            ep, al = asyncio.run(_revisar_pagina(v))
            import shutil
            shutil.copy(os.path.join(hacer.SALIDA, v['id'] + '.jpg'), os.path.join(carpeta, 'poster.jpg'))
            json.dump({'id': v['id'], 'duracion': v['dur'], 'escenas': len(v['escenas']), 'errores': eg + ep, 'avisos': avisos + ag + al, 'tiempos': v.get('tiempos'), 't0s': [round(e['t0'], 2) for e in v['escenas']]},
                      open(os.path.join(carpeta, 'revision.json'), 'w'), ensure_ascii=False)
        return {'modo': 'parte', 'tiempos': v.get('tiempos')}
    paso(f'Grabando la voz y animando {len(v["escenas"])} escenas')
    asyncio.run(hacer.video(v))
    salida = os.path.join(hacer.SALIDA, v['id'] + '.mp4')
    paso('Revisando la calidad')
    ep, al = asyncio.run(_revisar_pagina(v))
    ev, av, med = qa.qa_video(salida, v['dur'], [e['t0'] for e in v['escenas']])
    errores = eg + ep + ev
    med['tiempos'] = v.get('tiempos'); med['t0s'] = [round(e['t0'], 2) for e in v['escenas']]  # inicio exacto de cada escena (para corregir por escena)
    return {'modo': 'video', 'salida': salida, 'duracion': v['dur'], 'escenas': len(v['escenas']),
            'qa': {'ok': not errores, 'errores': errores, 'avisos': avisos + ag + al + av, 'medidas': med}}


def unir_y_revisar(carpeta):
    rv = json.load(open(os.path.join(carpeta, 'revision.json')))
    salida = os.path.join(carpeta, 'final.mp4')
    hacer.unir(carpeta, salida)
    shutil_poster = os.path.join(carpeta, 'poster.jpg')
    os.replace(shutil_poster, os.path.join(carpeta, 'final.jpg'))
    ev, av, med = qa.qa_video(salida, rv['duracion'], rv.get('t0s'))
    errores = rv['errores'] + ev
    med['tiempos'] = rv.get('tiempos'); med['t0s'] = rv.get('t0s')
    return {'modo': 'video', 'salida': salida, 'duracion': rv['duracion'], 'escenas': rv['escenas'],
            'qa': {'ok': not errores, 'errores': errores, 'avisos': rv['avisos'] + av, 'medidas': med}}
