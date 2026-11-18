"""Biblioteca de efectos reales con licencia CC0 (Openverse) elegidos "escuchando" con earshot (18 nov 2026).

Corre en GitHub Actions (allí hay internet): por cada tipo de efecto busca candidatos CC0 cortos en Openverse,
los recorta, earshot los ordena por parecido con la descripción y descarta los sintéticos; el mejor se normaliza
y se guarda en vsl/motion/sfx/cc0/<tipo>.wav con sus créditos. Solo CC0: uso comercial sin atribución.
"""
import json, os, subprocess, sys, urllib.parse, urllib.request

AQUI = os.path.dirname(os.path.abspath(__file__))
DEST = os.path.join(AQUI, '..', 'motion', 'sfx', 'cc0')
TMP = '/tmp/sonidos'
UA = {'user-agent': 'MasterEducativo-motor/1.0 (+https://github.com/mastereducativoo-INC/motor-videos)'}
# tipo: (búsqueda en Openverse, descripción para earshot, duración máxima en s)
TIPOS = {
    'golpe': ('cinematic impact hit', 'a deep cinematic impact boom, powerful and clean', 2.5),
    'whoosh': ('whoosh', 'a fast clean air whoosh transition', 1.2),
    'riser': ('riser swell', 'a smooth rising swell that builds tension', 4),
    'ding': ('notification bell', 'a bright clean notification bell ding', 2),
    'pop': ('pop', 'a soft short bubble pop for an interface', .6),
    'tick': ('tick click soft', 'a soft subtle interface tick', .4),
    'click': ('button click', 'a crisp mouse or button click', .5),
    'monedas': ('coins', 'coins dropping and jingling', 2.5),
    'venta': ('cash register', 'a cash register sale ka-ching', 2.5),
    'sello': ('rubber stamp', 'a rubber stamp pressed on paper on a desk', 1.2),
    'mazo': ('gavel', 'a wooden judge gavel strike', 1.5),
    'papel': ('paper slide', 'a sheet of paper sliding on a desk', 1.5),
    'pluma': ('pen writing', 'a pen writing a signature on paper', 2.5),
    'pagina': ('page turn', 'a book page turning', 1.5),
}


def get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=40).read()


def sh(*a, **k):
    return subprocess.run(list(a), capture_output=True, text=True, **k)


def earshot_json(*args):
    r = sh('earshot', *args, '--json')
    try:
        return json.loads(r.stdout)
    except Exception:
        print('earshot', args[0], r.stderr[-400:], flush=True); return None


def candidatos(tipo, q, maxd):
    url = 'https://api.openverse.org/v1/audio/?' + urllib.parse.urlencode({'q': q, 'license': 'cc0', 'page_size': 20, 'length': 'shortest,short'})
    try:
        res = json.loads(get(url)).get('results') or []
    except Exception as e:
        print(tipo, 'openverse no respondió', e, flush=True); return []
    out = []
    os.makedirs(f'{TMP}/{tipo}', exist_ok=True)
    for i, x in enumerate(res):
        if (x.get('license') or '').lower() != 'cc0' or not x.get('url'):
            continue
        crudo, wav = f'{TMP}/{tipo}/{i}.src', f'{TMP}/{tipo}/{i}.wav'
        try:
            open(crudo, 'wb').write(get(x['url']))
        except Exception:
            continue
        # quita silencio al inicio y deja solo lo que dura el efecto
        r = sh('ffmpeg', '-v', 'error', '-y', '-i', crudo, '-af', 'silenceremove=start_periods=1:start_threshold=-45dB', '-t', str(maxd), '-ac', '1', '-ar', '48000', wav)
        if r.returncode == 0 and os.path.getsize(wav) > 4000:
            out.append((wav, x))
        if len(out) >= 12:
            break
    return out


def elegir(tipo, desc, cands):
    if not cands:
        return None
    rk = earshot_json('rank', desc, *[w for w, _ in cands]) or {}
    orden = [r.get('path') or r.get('file') for r in (rk.get('results') or rk.get('ranking') or []) if isinstance(r, dict)] or [w for w, _ in cands]
    for w in orden[:4]:
        rl = earshot_json('realness', w) or {}
        txt = json.dumps(rl).lower()
        if 'synth' in txt and 'real' not in txt.split('synth')[0][-80:]:
            print(tipo, 'descartado por sonar sintético:', w, flush=True); continue
        return next((c for c in cands if c[0] == w), cands[0])
    return next((c for c in cands if c[0] == orden[0]), cands[0])


def main():
    os.makedirs(DEST, exist_ok=True)
    cred_f = os.path.join(DEST, 'creditos.json')
    cred = json.load(open(cred_f)) if os.path.exists(cred_f) else {}
    solo = [t for t in (os.environ.get('TIPOS') or '').split(',') if t]
    for tipo, (q, desc, maxd) in TIPOS.items():
        if solo and tipo not in solo:
            continue
        el = elegir(tipo, desc, candidatos(tipo, q, maxd))
        if not el:
            print(tipo, 'sin candidatos CC0', flush=True); continue
        w, x = el
        dest = os.path.join(DEST, tipo + '.wav')
        sh('ffmpeg', '-v', 'error', '-y', '-i', w, '-af', 'loudnorm=I=-16:TP=-1.5,afade=t=out:st=%.2f:d=0.15' % max(.05, maxd - .15), '-ar', '48000', '-ac', '1', dest)
        m = earshot_json('match', dest, desc) or {}
        cred[tipo] = {'titulo': x.get('title'), 'autor': x.get('creator'), 'fuente': x.get('foreign_landing_url') or x.get('url'), 'licencia': 'CC0', 'proveedor': x.get('provider'), 'parecido': m.get('verdict') or m.get('cosine')}
        print(tipo, '→', cred[tipo], flush=True)
    json.dump(cred, open(cred_f, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    sys.exit(main())
