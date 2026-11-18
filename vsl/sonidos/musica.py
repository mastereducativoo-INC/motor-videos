"""Escucha toda la música de fondo con earshot y la califica por nicho (Christian, 18 nov: la música debe coincidir con el video).
Resultado: vsl/motion/musica/escuchada.json → {archivo: {tags, por_nicho: {nicho: parecido}}}. temas.py elige con esto."""
import glob, json, os, subprocess

AQUI = os.path.dirname(os.path.abspath(__file__))
MUS = os.path.join(AQUI, '..', 'motion', 'musica')
NICHOS = {
    'legal': 'calm elegant orchestral or piano background music, serious, trustworthy and premium, for a law firm',
    'tec': 'modern clean electronic corporate background music, confident and focused, for technology and programming',
    'dj': 'energetic electronic dance music with a strong beat, club and festival vibe',
    'educacion': 'warm inspiring acoustic background music, hopeful and motivating, for online learning',
    'creativo': 'light playful creative background music, curious and friendly, for art and drawing',
    'musica': 'warm melodic piano background music, emotional and musical',
}


def ej(*a):
    r = subprocess.run(['earshot', *a, '--json'], capture_output=True, text=True)
    try:
        return json.loads(r.stdout)
    except Exception:
        print('earshot', a[0], r.stderr[-300:], flush=True); return {}


def main():
    out = {}
    for f in sorted(glob.glob(os.path.join(MUS, '*.mp3'))):
        cl = '/tmp/clip.wav'  # 45 s del centro bastan para saber el carácter
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', '20', '-t', '45', '-i', f, '-ac', '1', '-ar', '48000', cl])
        d = ej('describe', cl)
        tags = [t.get('tag') or t.get('label') for t in (d.get('tags') or [])[:8] if isinstance(t, dict)]
        por = {}
        for k, q in NICHOS.items():
            m = ej('match', cl, q)
            por[k] = round(float(m.get('cosine') or 0), 3)
        out['musica/' + os.path.basename(f)] = {'tags': tags, 'resumen': (d.get('summary') or '')[:200], 'por_nicho': por}
        print(os.path.basename(f), por, flush=True)
    json.dump(out, open(os.path.join(MUS, 'escuchada.json'), 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    main()
