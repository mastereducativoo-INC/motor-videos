# Voz con IA (Kokoro), música propia y efectos. Todo se genera aquí: sin derechos de terceros.
import os, re, numpy as np, soundfile as sf

SR = 24000


def _kokoro():
    from kokoro_onnx import Kokoro
    d = os.environ.get('KOKORO_DIR', os.path.join(os.path.dirname(__file__), 'modelo'))
    return Kokoro(os.path.join(d, 'kokoro-v1.0.onnx'), os.path.join(d, 'voices-v1.0.bin'))


def frases(texto):
    """Parte un texto en frases cortas para que la voz respire donde debe."""
    t = re.sub(r'\s+', ' ', str(texto or '')).strip()
    return [p.strip() for p in re.split(r'(?<=[.!?¡¿…:;])\s+', t) if p.strip()]


# cómo se dice cada tipo de escena: (velocidad, volumen, tono). La voz cambia de ritmo e intensidad según el momento.
ENTREGA = {'gancho': (1.07, 1.12, 1.03), 'felicita': (1.05, 1.1, 1.035), 'desbloqueo': (1.03, 1.06, 1.02), 'producto': (1.02, 1.05, 1.015), 'elemento': (1.04, 1.0, 1.0),
           'precio': (0.97, 1.12, 1.02), 'cta': (1.04, 1.14, 1.03), 'garantia': (0.93, 0.92, 0.985), 'etapas': (0.98, 0.96, 1.0), 'ruta': (1.0, 1.0, 1.0),
           'valor': (1.02, 1.0, 1.0), 'texto': (0.98, 1.0, 0.99), 'acceso': (1.0, 1.0, 1.0)}


def _tono(s, k):
    """Sube o baja un poco el tono (y con él la energía) de una frase."""
    if abs(k - 1) < 0.004:
        return s
    n = max(1, int(len(s) / k))
    return np.interp(np.linspace(0, len(s) - 1, n), np.arange(len(s)), s).astype(np.float32)


def voces(escenas, voz='em_alex', velocidad=1.08, pausa=0.18):
    """Una pista de voz por escena, con entrega variada: cada frase cambia de velocidad, volumen y tono según la escena
    y su puntuación (exclamación = más energía; puntos suspensivos = pausa de expectativa)."""
    k = _kokoro()
    out = []
    for e in escenas:
        ve, ga, to = ENTREGA.get(e.get('tipo'), (1.0, 1.0, 1.0))
        partes = []
        fs = frases(e.get('voz') or '')
        for n, f in enumerate(fs):
            exc, preg, susp = f.endswith('!'), f.endswith('?'), f.endswith('…') or f.endswith('...')
            v = float(velocidad) * ve * (1.04 if exc else 0.97 if (preg or susp) else 1.0) * (1.0 if n % 2 == 0 else 0.98)
            s, sr = k.create(f, voice=voz, speed=max(0.8, min(1.4, v)), lang='es')
            if sr != SR:
                raise RuntimeError('frecuencia inesperada de Kokoro')
            s = _recorta(np.asarray(s, dtype=np.float32))
            s = _tono(s, to * (1.02 if exc else 1.0)) * (ga * (1.08 if exc else 1.0))
            p = 0.5 if susp else 0.3 if (exc or preg) else pausa
            if e.get('tipo') in ('precio', 'garantia'):
                p += 0.14
            partes += [s, np.zeros(int(SR * p), np.float32)]
        a = np.concatenate(partes) if partes else np.zeros(int(SR * 1.2), np.float32)
        out.append(a)
    return out


def _recorta(s, umbral=0.01):
    idx = np.where(np.abs(s) > umbral)[0]
    if not len(idx):
        return s
    a, b = max(0, idx[0] - int(SR * 0.03)), min(len(s), idx[-1] + int(SR * 0.06))
    return s[a:b]


# ---------- música ----------
def _env(n, a=0.002, r=0.2):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / max(r, 1e-4))


def _nota(f, n, tipo='saw'):
    t = np.arange(n) / SR
    if tipo == 'sine':
        return np.sin(2 * np.pi * f * t)
    # sierra suave (pocos armónicos) para pads y bajos
    return sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, 7)) * 0.6


ESTILOS = {
    # bpm, acordes (frecuencias de la raíz), si lleva bombo, brillo
    'dj': (124, [55.0, 43.65, 65.41, 49.0], True, 1.0),
    'energia': (118, [58.27, 46.25, 69.3, 51.91], True, 0.8),
    'suave': (96, [65.41, 55.0, 43.65, 49.0], False, 0.5),
    'house': (122, [49.0, 58.27, 43.65, 65.41], True, 0.9),
    'funk': (108, [61.74, 55.0, 46.25, 51.91], True, 0.8),
    'pop': (112, [65.41, 49.0, 55.0, 43.65], True, 1.0),
    'noche': (88, [43.65, 49.0, 55.0, 41.2], False, 0.6),
    'calma': (80, [55.0, 65.41, 49.0, 43.65], False, 0.5),
}


MOTION = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'motion')


def _decodifica(ruta):
    import subprocess
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', ruta, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).copy()


def _media(x, w):  # promedio móvil rápido
    c = np.cumsum(np.concatenate([np.zeros(w // 2 + 1), x, np.zeros(w - w // 2)]))
    return ((c[w:] - c[:-w]) / w)[:len(x)]


def musica_archivo(dur, ruta):
    """Pista real (Mixkit, licencia gratuita): empieza donde ya suena fuerte; si es corta, se repite con un cruce suave."""
    a = _decodifica(ruta if os.path.isabs(ruta) else os.path.join(MOTION, ruta))
    w = SR // 2
    r = np.sqrt(np.maximum(_media(a ** 2, w), 0)) + 1e-6
    fuerte = 20 * np.log10(r) > 20 * np.log10(np.median(r)) - 6
    ini = int(np.argmax(fuerte))
    fin = len(a) - int(np.argmax(fuerte[::-1]))  # quita el final que se apaga (si no, quedan segundos en silencio)
    a = a[max(0, ini - SR // 4):fin]
    n = int(dur * SR); x = SR * 2
    out = a.copy()
    while len(out) < n:  # repetir con cruce de 2 s
        f = np.linspace(0, 1, x, dtype=np.float32)
        out = np.concatenate([out[:-x], out[-x:] * (1 - f) + a[:x] * f, a[x:]])
    out = out[:n]
    rms = np.sqrt(np.mean(out ** 2)) + 1e-6
    out = out * (0.16 / rms)
    # nivel parejo: sube las pausas de la canción (máx. 4x) para que la música no se caiga a silencio
    w = SR
    env = np.sqrt(np.maximum(_media(out ** 2, w), 0)) + 1e-6
    g = np.clip(0.12 / env, 1.0, 4.0)
    g = _media(g, SR // 2)
    return np.clip(out * g, -0.95, 0.95).astype(np.float32)


def musica(dur, estilo='dj', seed=7):
    if str(estilo).endswith('.mp3') or str(estilo).endswith('.wav'):
        return musica_archivo(dur, estilo)
    bpm, raices, bombo, brillo = ESTILOS.get(estilo, ESTILOS['suave'])
    rng = np.random.default_rng(seed)
    n = int(dur * SR) + SR
    out = np.zeros(n, np.float32)
    beat = 60.0 / bpm
    nb = int(dur / beat) + 2
    kick = (np.sin(2 * np.pi * np.cumsum(np.linspace(150, 45, int(SR * 0.25))) / SR) * _env(int(SR * 0.25), 0.001, 0.09)).astype(np.float32)
    hat = (rng.standard_normal(int(SR * 0.05)) * _env(int(SR * 0.05), 0.0005, 0.012)).astype(np.float32)
    hat = np.diff(hat, prepend=0) * 0.5
    clap = (rng.standard_normal(int(SR * 0.14)) * _env(int(SR * 0.14), 0.001, 0.04)).astype(np.float32)
    clap = np.convolve(clap, np.ones(4) / 4, mode='same').astype(np.float32)
    for i in range(nb):
        p = int(i * beat * SR)
        if p >= n:
            break
        if bombo:
            out[p:p + len(kick)] += kick[:max(0, min(len(kick), n - p))] * 0.9
        q = int((i + 0.5) * beat * SR)
        if q < n:
            out[q:q + len(hat)] += hat[:max(0, min(len(hat), n - q))] * 0.35 * brillo
        if bombo and i % 2 == 1:
            out[p:p + len(clap)] += clap[:max(0, min(len(clap), n - p))] * 0.4
    # bajo y pad: un acorde por compás (4 tiempos)
    compas = beat * 4
    for c in range(int(dur / compas) + 2):
        f = raices[c % len(raices)]
        p = int(c * compas * SR)
        if p >= n:
            break
        m = min(int(compas * SR), n - p)
        pad = (_nota(f * 4, m) + _nota(f * 5, m) * 0.8 + _nota(f * 6, m) * 0.7) * 0.05
        att = np.minimum(1, np.arange(m) / (SR * 0.4)) * np.minimum(1, (m - np.arange(m)) / (SR * 0.3))
        out[p:p + m] += (pad * att).astype(np.float32)
        if brillo >= 0.8:
            # arpegio en corcheas (se abre a partir del tercer compás)
            esc = [f * 4, f * 5, f * 6, f * 8, f * 6, f * 5, f * 4, f * 6]
            for a in range(8):
                q = p + int(a * beat * SR * 0.5)
                k = min(int(beat * SR * 0.42), n - q)
                if k > 0 and c >= 2:
                    out[q:q + k] += (_nota(esc[a] * 2, k, 'sine') * _env(k, 0.004, 0.09) * 0.09).astype(np.float32)
        for b in range(4):
            q = p + int(b * beat * SR + beat * SR * 0.5)
            k = min(int(beat * SR * 0.45), n - q)
            if k > 0:
                out[q:q + k] += (_nota(f, k, 'sine') * _env(k, 0.005, 0.15) * 0.35).astype(np.float32)
    # filtro suave para quitar aspereza
    out = np.convolve(out, np.ones(3) / 3, mode='same').astype(np.float32)
    return out[:int(dur * SR)] / (np.max(np.abs(out)) + 1e-6) * 0.8


PARECIDO = {'mazo': 'golpe', 'sello': 'golpe', 'papel': 'whoosh', 'pagina': 'whoosh', 'pluma': 'tick'}


def sfx(tipo):
    # 1º la biblioteca CC0 elegida escuchando (earshot + Openverse); 2º los elegidos de Mixkit; 3º el sintético
    f = os.path.join(MOTION, 'sfx', 'cc0', tipo + '.wav')
    if not os.path.exists(f):
        f = os.path.join(MOTION, 'sfx', 'elegidos', tipo + '.wav')
    if not os.path.exists(f) and tipo in PARECIDO:
        return sfx(PARECIDO[tipo])
    if os.path.exists(f):
        a = _decodifica(f)
        return (a / (np.max(np.abs(a)) + 1e-6) * 0.55).astype(np.float32)
    if tipo == 'tick':
        tipo = 'click'
    rng = np.random.default_rng(3)
    if tipo == 'whoosh':
        n = int(SR * 0.45)
        x = rng.standard_normal(n).astype(np.float32)
        t = np.linspace(0, 1, n)
        y = np.zeros(n, np.float32)
        a = 0.0
        for i in range(n):  # paso bajo que se abre y se cierra
            k = 0.02 + 0.5 * np.sin(np.pi * t[i])
            a += k * (x[i] - a)
            y[i] = a
        return y * np.sin(np.pi * t) * 0.5
    if tipo == 'golpe':
        n = int(SR * 0.6)
        f = np.cumsum(np.linspace(110, 35, n)) / SR
        return (np.sin(2 * np.pi * f) * _env(n, 0.001, 0.18) + rng.standard_normal(n) * _env(n, 0.001, 0.02) * 0.3).astype(np.float32) * 0.9
    if tipo == 'ding':
        n = int(SR * 0.7)
        return ((_nota(1318.5, n, 'sine') + _nota(1975.5, n, 'sine') * 0.5) * _env(n, 0.002, 0.25) * 0.35).astype(np.float32)
    if tipo == 'pop':
        n = int(SR * 0.12)
        return (_nota(880, n, 'sine') * _env(n, 0.001, 0.03) * 0.3).astype(np.float32)
    if tipo == 'riser':
        # subida de tensión de 1 s (ruido que se abre + tono que sube)
        n = int(SR * 1.0)
        t = np.linspace(0, 1, n)
        f = np.cumsum(220 + 900 * t ** 2) / SR
        ruido = rng.standard_normal(n).astype(np.float32)
        ruido = np.convolve(ruido, np.ones(6) / 6, mode='same')
        return ((np.sin(2 * np.pi * f) * 0.18 + ruido * 0.22) * t ** 1.6).astype(np.float32)
    if tipo == 'click':
        n = int(SR * 0.08)
        return (rng.standard_normal(n) * _env(n, 0.0005, 0.008) * 0.5 + _nota(2200, n, 'sine') * _env(n, 0.0005, 0.02) * 0.3).astype(np.float32)
    return np.zeros(1, np.float32)


def mezcla(voz, eventos, dur, estilo, ruta, niveles=None):
    """voz: pista completa; eventos: [(segundo, tipo_sfx)]. Música baja cuando hay voz y sube en las pausas."""
    n = int(dur * SR)
    v = np.zeros(n, np.float32)
    v[:min(n, len(voz))] = voz[:n]
    rms = np.sqrt(np.mean(v[np.abs(v) > 0.01] ** 2)) if np.any(np.abs(v) > 0.01) else 0.1
    v *= 0.2 / (rms + 1e-6)
    m = musica(dur + 1, estilo)[:n]
    if len(m) < n:
        m = np.pad(m, (0, n - len(m)))
    # duck: envolvente de la voz suavizada
    win = int(SR * 0.25)
    envv = np.convolve(np.abs(v), np.ones(win) / win, mode='same')
    real = str(estilo).endswith(('.mp3', '.wav'))
    duck = np.where(envv > 0.01, 0.42 if real else 0.34, 0.9 if real else 0.85).astype(np.float32)
    duck = np.convolve(duck, np.ones(win) / win, mode='same')
    fade = np.minimum(1, np.arange(n) / (SR * 0.6)) * np.minimum(1, (n - np.arange(n)) / (SR * 1.2))
    # intensidad por momento del video: [(inicio, fin, nivel)]
    niv = np.ones(n, np.float32)
    for a, b, g in niveles or []:
        niv[int(a * SR):int(b * SR)] = g
    niv = np.convolve(niv, np.ones(int(SR * 0.5)) / int(SR * 0.5), mode='same').astype(np.float32)
    mix = v + m * duck * fade * niv * 0.6
    # 18 nov (earshot): demasiados golpes por segundo → los grandes se quedan, los chicos van 6 dB más bajos y no se amontonan
    GRANDES = {'golpe', 'mazo', 'sello', 'venta', 'riser', 'monedas', 'ding'}
    ultimo = -9.0
    for s, tipo in sorted(eventos):
        grande = tipo in GRANDES
        if not grande and s - ultimo < 0.35:
            continue
        x = sfx(tipo)
        p = int(s * SR)
        if 0 <= p < n:
            k = min(len(x), n - p)
            mix[p:p + k] += x[:k] * (0.6 if grande else 0.3)
            if tipo in ('golpe', 'mazo'):  # graves en los impactos (earshot: "thin bottom")
                q = min(int(SR * 0.3), n - p)
                t = np.arange(q) / SR
                mix[p:p + q] += (np.sin(2 * np.pi * 52 * t) * np.exp(-t * 14) * 0.22).astype(np.float32)
        if not grande:
            ultimo = s
    return _master(mix, ruta)


def _master(mix, ruta, objetivo=-14.0):
    """Volumen de web: -14 LUFS integrados con limitador suave y techo de -1 dBTP (earshot, 18 nov)."""
    mix = mix.astype(np.float64)
    try:
        import pyloudnorm as pyln
        actual = pyln.Meter(SR).integrated_loudness(mix)
    except Exception:
        actual = 20 * np.log10(np.sqrt(np.mean(mix ** 2)) + 1e-9) + 3.0  # aproximación por RMS
    if np.isfinite(actual):
        mix *= 10 ** ((objetivo - actual) / 20)
    techo = 10 ** (-1.0 / 20)
    mix = np.where(np.abs(mix) > 0.7 * techo, np.sign(mix) * (0.7 * techo + (techo - 0.7 * techo) * np.tanh((np.abs(mix) - 0.7 * techo) / (techo - 0.7 * techo))), mix)
    sf.write(ruta, mix.astype(np.float32), SR)
    return ruta
