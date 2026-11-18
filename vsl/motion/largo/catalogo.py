"""Pone las variaciones de cada estilo en public/vsls/estilos/catalogo.json (lo que ve el panel en VSLs → Estilos aprobados).
Uso: python catalogo.py   (después de que vsl-largo.yml subió los videos)"""
import json, os
AQUI = os.path.dirname(os.path.abspath(__file__))
RAIZ = os.path.dirname(os.path.dirname(os.path.dirname(AQUI)))
from estilo_camino import VIDEOS as CAMINO
from estilo_compra import VIDEOS as COMPRA
from estilo_final import VIDEOS as FINAL
f = os.path.join(RAIZ, 'public', 'vsls', 'estilos', 'catalogo.json')
cat = json.load(open(f))
for est, L, d in (('camino', CAMINO, 'camino'), ('compra', COMPRA, 'compra'), ('final', FINAL, 'final')):
    e = next(x for x in cat['estilos'] if x['id'] == est)
    prev = {v['n']: v for v in e.get('variaciones', [])}
    out = []
    for n, v in enumerate(L, 1):
        base = os.path.join(RAIZ, 'public', 'vsls', 'estilos', d, v['id'])
        if not os.path.exists(base + '.mp4'):
            continue
        s = float(open(base + '.dur').read()) if os.path.exists(base + '.dur') else 0
        p = prev.get(n, {})
        out.append({'n': n, 'id': v['id'], 'titulo': v['titulo'], 'cambia': v['cambia'], 'video': f'/vsls/estilos/{d}/{v["id"]}.mp4', 'poster': f'/vsls/estilos/{d}/{v["id"]}.jpg',
                    'duracion': '%d:%02d' % (s // 60, s % 60), 'version': p.get('version', 1), 'anteriores': p.get('anteriores', [])})
    e['variaciones'] = out
json.dump(cat, open(f, 'w'), ensure_ascii=False, indent=2)
print({e['id']: len(e['variaciones']) for e in cat['estilos']})
