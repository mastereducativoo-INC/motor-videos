# Voz por frases (velocidad 1.1 respecto a la anterior) -> sabemos el segundo exacto de cada frase
import json, soundfile as sf, numpy as np, sys
from kokoro_onnx import Kokoro
K = Kokoro("../kok/kokoro-v1.0.onnx", "../kok/voices-v1.0.bin")
# "|" separa frases; "||" = frase con pausa larga después
A = [
 ("bienvenida","Bienvenido a Máster Educativo. | Gracias por confiar en nosotros. | Ahora te muestro, paso a paso, cómo funciona tu plataforma."),
 ("curso","Arriba siempre vas a encontrar el curso que compraste. | Tocas «Abrir mi curso», | y se abre en Google Drive: | puedes verlo en línea o descargarlo, | y tu acceso no caduca."),
 ("instalar","Si quieres tenerlo siempre a un toque, | presiona «Instalar», | y la plataforma queda en tu celular con el logo de Máster Educativo."),
 ("complementos","Debajo de tu curso están los complementos: | herramientas extra que lo acompañan. | Cada uno tiene su descripción, | para que sepas exactamente qué incluye. | Y por ser alumno, tienen un precio especial."),
 ("superpack","Al final está el Súper Pack: | el siguiente nivel. | Es la versión más completa, | para quien quiere llevar su aprendizaje mucho más lejos."),
 ("activa","Puedes comprar cada uno por separado. | Tocas «Desbloquear», pagas, | y en cuanto se aprueba tu pago, | se activa aquí mismo: | el candado se abre, | y lo encuentras en tu biblioteca."),
 ("todo","Y si los quieres todos, también hay una opción especial: | todos los complementos y el Súper Pack juntos, | en una sola compra y a mejor precio. | La encuentras en tu plataforma, justo arriba de los complementos. | Solo aparece mientras no hayas comprado ninguno por separado."),  # 20 nov: sin «toca Lo quiero todo» (Christian: no vender tanto)
 ("cierre","Así tienes tu curso completo, en un mismo lugar. | Y si quieres volver a ver este video, | toca «Cómo funciona», arriba. || Disfruta tu curso, | y otra vez: bienvenido a Máster Educativo."),
]
# B: compró algo y le falta algo (sin la oferta de $19: a ellos ya no les aparece)
B = [
 ("bienvenida","Bienvenido a Máster Educativo. | Gracias por confiar en nosotros. | Ahora te muestro, paso a paso, cómo funciona tu plataforma."),
 A[1], A[2],
 ("biblioteca","Todo lo que ya compraste | está aquí, en «Tu biblioteca». | Cada uno tiene su botón «Abrir», | y se abre igual que tu curso."),
 ("falta","Más abajo está lo que aún te falta, con su candado. | Cada uno tiene su descripción, | para que sepas qué incluye, | y, por ser alumno, un precio especial. | Y si aún no tienes el Súper Pack, | también está aquí: es el nivel más completo."),
 ("activa","Para activar el que quieras, | tocas «Desbloquear», pagas, | y en cuanto se aprueba tu pago, | se activa aquí mismo: | el candado se abre, | y lo encuentras en tu biblioteca."),
 ("cierre","Así vas completando tu curso, en un mismo lugar. | Y si quieres volver a ver este video, | toca «Cómo funciona», arriba. || Disfruta tu curso, | y otra vez: bienvenido a Máster Educativo."),
]
# C: ya tiene todo (sin venta)
C = [
 ("bienvenida","Bienvenido a Máster Educativo. | Gracias por confiar en nosotros. | Ya tienes acceso a todo, | y ahora te muestro cómo funciona tu plataforma."),
 ("curso","Arriba siempre vas a encontrar tu curso principal. | Tocas «Abrir mi curso», | y se abre en Google Drive: | puedes verlo en línea o descargarlo, | y tu acceso no caduca."),
 A[2],
 ("biblioteca","Más abajo, en «Tu biblioteca», | están todos tus complementos | y también el Súper Pack. | Cada uno se abre con su botón «Abrir», | igual que tu curso."),
 ("cierre","Así tienes todo, en un mismo lugar. | Y si quieres volver a ver este video, | toca «Cómo funciona», arriba. || Disfruta tu curso, | y otra vez: bienvenido a Máster Educativo."),
]
GUION = (sys.argv[1] if len(sys.argv) > 1 else 'A').upper()
G = {'A': A, 'B': B, 'C': C}[GUION]
SUF = '' if GUION == 'A' else '_' + GUION.lower()   # A: voz.json y v_<escena>.wav ; B: voz_b.json y v_b_<escena>.wav
FIX = [("ɡˈuɣəl ðɾˈaɪβ", "ɡˈuɡel dɾˈaif"), ("ðɾˈaɪβ", "dɾˈaif"), ("θ", "s"), ("ʎ", "ʝ")]
VEL = 1.04 * 1.1 * 1.053  # = 1.1 respecto al video anterior (medido)
voz = "em_alex"; sr = 24000; out = []
def fon(tx):
    ph = K.tokenizer.phonemize(tx, "es")
    for a, b in FIX: ph = ph.replace(a, b)
    assert "mastˈeɾ" not in ph, ph
    return ph
def sint(tx):
    s, _ = K.create(fon(tx), voice=voz, speed=VEL, lang="es", is_phonemes=True)
    a = np.abs(s); idx = np.where(a > 0.012)[0]; return s[max(0, idx[0] - 600):idx[-1] + 1800]
def huecos(s):
    h = int(sr * .01); n = len(s) // h
    e = np.array([np.sqrt(np.mean(s[k*h:(k+1)*h]**2)) for k in range(n)])
    sil = e < max(.004, e.max() * .03); G = []; k = 0
    while k < n:
        if sil[k]:
            j = k
            while j < n and sil[j]: j += 1
            if j - k >= 5: G.append(((k) * .01, j * .01))
            k = j
        else: k += 1
    return G
for k, txt in G:
    trozos = [x.strip() for x in txt.replace('||', '|§').split('|')]
    larga = [t.startswith('§') for t in trozos]; trozos = [t.lstrip('§').strip() for t in trozos]
    full = sint(' '.join(trozos)); D = len(full) / sr
    dd = [len(sint(t)) / sr for t in trozos]; tot = sum(dd)
    G2 = huecos(full); ini = [0.0]; acc = 0
    if k in ("cierre", "activa"): print(k, "huecos", [(round(a,2), round(b,2)) for a, b in G2], [round(x,2) for x in dd], round(D,2))
    ult = 0.0
    for j in range(len(trozos) - 1):
        esp = ult + dd[j] * D / tot
        cand = [g for g in G2 if abs((g[0] + g[1]) / 2 - esp) < .7 and g[0] > ult + .3]
        if cand: g = min(cand, key=lambda g: abs((g[0] + g[1]) / 2 - esp) - 2 * (g[1] - g[0])); ini.append(g); ult = g[1]
        else: print('SIN HUECO', k, trozos[j + 1]); ini.append((esp, esp)); ult = esp
    # insertar pausas largas y armar tiempos
    partes = []; cur = 0; audio = []; desfase = 0.0; P = []
    cortes = []
    for j in range(1, len(trozos)):
        g = ini[j]; cortes.append(((g[0] + g[1]) / 2, g[1] - .03, larga[j]))
    pos = 0  # pausa larga: en «todo» da tiempo de ver «¡Todo desbloqueado!» antes del «Ojo»
    for j, (mid, st, lg) in enumerate(cortes):
        if lg:
            m = int(mid * sr); audio.append(full[pos:m]); pl = .9 if k == 'cierre' else 1.5; audio.append(np.zeros(int(pl * sr), dtype=full.dtype)); pos = m; desfase += pl
        cortes[j] = (mid, st + (desfase if True else 0), lg)
    audio.append(full[pos:]); s = np.concatenate(audio)
    starts = [0.0] + [c[1] for c in cortes]
    for j, t in enumerate(trozos):
        fin_ = starts[j + 1] if j + 1 < len(starts) else len(s) / sr
        hab = fin_ - starts[j] - ((.9 if k == 'cierre' else 1.5) if j + 1 < len(trozos) and larga[j + 1] else 0)
        P.append({'t': t, 'a': round(starts[j], 3), 'd': round(fin_ - starts[j], 3), 'h': round(hab, 3)})
    sf.write(f"v{SUF}_{k}.wav", s, sr)
    out.append({'k': k, 't': ' '.join(trozos), 'd': round(len(s) / sr, 3), 'p': P})
    print(k, round(len(s)/sr,2), [(p['a'], p['t'][:18]) for p in P])
json.dump(out, open(f"voz{SUF}.json", "w"), ensure_ascii=False, indent=1)
print([(o['k'], o['d']) for o in out], round(sum(o['d'] for o in out), 1))
