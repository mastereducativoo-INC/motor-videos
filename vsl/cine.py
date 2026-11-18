"""Motor "cine" de los VSL: el video se arma toma por toma a partir de un storyboard.
Cada toma tiene su propia composición: fondo (ilustración, foto o degradado), cámara con movimiento suave,
capas con profundidad (personajes y objetos recortados que se mueven distinto que el fondo), pantalla dividida
y tipografía editorial (Sora + Fraunces itálica + Nunito Sans) que entra línea por línea.
Sin destellos, confeti ni resplandores: movimiento con intención."""
import math, os, re, subprocess, time
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

import audio

W, H, FPS = 1920, 1080, 30
AQUI = os.path.dirname(os.path.abspath(__file__))
_F = {}
FUENTES = {'sora': ('Sora.ttf', 'ExtraBold'), 'sora-l': ('Sora.ttf', 'Light'), 'sora-m': ('Sora.ttf', 'SemiBold'),
           'serif': ('Fraunces-Italic.ttf', 'Italic'), 'serif-b': ('Fraunces-Italic.ttf', 'SemiBold Italic'), 'serif-r': ('Fraunces.ttf', 'Regular'),
           'nunito': ('NunitoSans.ttf', 'SemiBold'), 'nunito-b': ('NunitoSans.ttf', 'ExtraBold')}


def fuente(clave, tam):
    k = (clave, int(tam))
    if k not in _F:
        arch, peso = FUENTES.get(clave, FUENTES['sora'])
        f = ImageFont.truetype(os.path.join(AQUI, 'fonts', arch), int(tam))
        try:
            f.set_variation_by_name(peso)
        except Exception:
            pass
        _F[k] = f
    return _F[k]


def rgb(h, a=255):
    h = str(h or '#ffffff').lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


def cl(x):
    return max(0.0, min(1.0, x))


def suave(x):  # entra rápido y frena (ease-out quint)
    x = cl(x)
    return 1 - (1 - x) ** 4


def vaiven(x):  # ease-in-out
    x = cl(x)
    return x * x * (3 - 2 * x)


def cubrir(img, w, h):
    r = max(w / img.width, h / img.height)
    im = img.resize((max(w, int(img.width * r + 0.5)), max(h, int(img.height * r + 0.5))), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))


def degradado(c1, c2, luz=None):
    """Degradado vertical suave con un foco de luz opcional: [x, y, color, radio]."""
    a, b = np.array(rgb(c1)[:3], np.float32), np.array(rgb(c2)[:3], np.float32)
    k = np.linspace(0, 1, H, dtype=np.float32)[:, None, None]
    arr = np.broadcast_to(a * (1 - k) + b * k, (H, W, 3)).copy()
    if luz:
        lx, ly, lc, lr = luz[0] * W, luz[1] * H, np.array(rgb(luz[2])[:3], np.float32), (luz[3] if len(luz) > 3 else 0.6) * W
        yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
        d = np.clip(1 - np.sqrt((xx - lx) ** 2 + (yy - ly) ** 2) / lr, 0, 1) ** 2
        arr += (lc - arr) * d[:, :, None] * 0.55
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), 'RGB')


def con_alfa(im, a):
    if a >= 0.999:
        return im
    out = im.copy()
    out.putalpha(out.getchannel('A').point(lambda v: int(v * a)))
    return out


def pegar(fr, im, cx, cy, alfa=1.0):
    if alfa <= 0.01:
        return
    im = con_alfa(im, alfa)
    fr.paste(im, (int(cx - im.width / 2), int(cy - im.height / 2)), im)


def recortar(im):
    bb = im.getchannel('A').point(lambda v: 255 if v > 12 else 0).getbbox()
    return im.crop(bb) if bb else im


def con_sombra(im, radio=38, alfa=120, dy=26):
    m = radio * 2
    out = Image.new('RGBA', (im.width + m * 2, im.height + m * 2), (0, 0, 0, 0))
    s = Image.new('RGBA', out.size, (0, 0, 0, 0))
    s.paste(Image.new('RGBA', im.size, (0, 0, 0, alfa)), (m, m + dy), im.getchannel('A'))
    out = Image.alpha_composite(out, s.filter(ImageFilter.GaussianBlur(radio)))
    out.alpha_composite(im, (m, m))
    return out


# ---------- tipografía editorial ----------
class Texto:
    """Bloque de texto que entra línea por línea (cada línea sube desde detrás de una máscara).
    Lo que va entre *asteriscos* sale en Fraunces itálica del color de acento, con una línea fina debajo."""

    def __init__(self, c, pal):
        self.c = c
        f1 = fuente(c.get('f', 'sora'), c.get('tam', 84))
        f2 = fuente(c.get('f2', 'serif'), c.get('tam', 84) * c.get('k2', 1.08))
        col, ac = rgb(c.get('color') or pal['texto']), rgb(c.get('acento') or pal['acento'])
        ancho = c.get('ancho', 0.5) * W
        toks, it = [], False
        for parte in re.split(r'(\*)', str(c.get('t') or '')):
            if parte == '*':
                it = not it
                continue
            for linea_i, seg in enumerate(parte.split('\n')):
                if linea_i:
                    toks.append(None)
                toks += [(w, it) for w in seg.split(' ') if w]
        lineas, act, x = [], [], 0
        esp = f1.getlength(' ')
        for tk in toks:
            if tk is None:
                lineas.append(act)
                act, x = [], 0
                continue
            wl = (f2 if tk[1] else f1).getlength(tk[0])
            if act and x + wl > ancho:
                lineas.append(act)
                act, x = [], 0
            act.append((tk[0], tk[1], wl))
            x += wl + esp
        if act:
            lineas.append(act)
        asc, desc = f1.getmetrics()
        self.lh = int((asc + desc) * c.get('inter', 1.12))
        self.ims = []
        for ln in lineas:
            tot = sum(w for _, _, w in ln) + esp * (len(ln) - 1)
            im = Image.new('RGBA', (int(tot) + 24, self.lh + 16), (0, 0, 0, 0))
            d = ImageDraw.Draw(im)
            x = 12
            sub = []
            for txt, ital, wl in ln:
                d.text((x, 4), txt, font=f2 if ital else f1, fill=ac if ital else col)
                if ital and c.get('linea', True):
                    sub.append((x, x + wl))
                x += wl + esp
            if sub:
                y = 4 + asc + int(desc * 0.55)
                d.line([(sub[0][0], y), (sub[-1][1], y)], fill=rgb(pal.get('oro', '#f5c84a')), width=max(3, int(c.get('tam', 84) * 0.045)))
            self.ims.append(im)
        self.alto = self.lh * len(self.ims)

    def dibujar(self, fr, t, D):
        c = self.c
        t0 = c.get('t0', 0.3)
        fin = c.get('hasta') or D + 9
        if t < t0 or t > fin + 0.35:
            return
        sale = 1 - cl((t - fin) / 0.3)
        x0, y0 = c.get('x', 0.08) * W, c.get('y', 0.5) * H - self.alto / 2
        for i, im in enumerate(self.ims):
            p = suave((t - t0 - i * 0.13) / 0.7)
            if p <= 0:
                continue
            al = c.get('al', 'izq')
            x = x0 - 12 if al == 'izq' else (x0 - im.width / 2 if al == 'centro' else x0 - im.width + 12)
            off = int((1 - p) * im.height)
            vis = im.crop((0, 0, im.width, im.height - off))
            fr.paste(con_alfa(vis, sale * min(1, p * 1.6)), (int(x), int(y0 + i * self.lh + off)), con_alfa(vis, sale * min(1, p * 1.6)))


# ---------- una toma ----------
class Toma:
    def __init__(self, c, dur, imgs, pal, i):
        self.c, self.dur, self.i = c, dur, i
        f = c.get('fondo') or {}
        M = 1.2
        if f.get('img') and f['img'] in imgs:
            base = cubrir(imgs[f['img']].convert('RGB'), int(W * M), int(H * M))
            if f.get('desenfoque'):
                base = base.filter(ImageFilter.GaussianBlur(f['desenfoque']))
            else:
                base = base.filter(ImageFilter.UnsharpMask(radius=2, percent=55, threshold=2))
            if f.get('osc'):
                base = Image.blend(base, Image.new('RGB', base.size, rgb(f.get('tinte', '#05050f'))[:3]), f['osc'])
            if f.get('velo'):  # degradado oscuro en un lado para que el texto respire: ['izq'|'der'|'abajo', fuerza]
                lado, k = f['velo']
                g = np.linspace(1, 0, base.width if lado != 'abajo' else base.height, dtype=np.float32) ** 1.6 * k
                if lado == 'der':
                    g = g[::-1]
                m = np.tile(g[None, :], (base.height, 1)) if lado != 'abajo' else np.tile(g[::-1][:, None], (1, base.width))
                base = Image.composite(Image.new('RGB', base.size, rgb(pal['fondo'])[:3]), base, Image.fromarray((m * 255).astype(np.uint8), 'L'))
        else:
            g = f.get('grad') or [pal['fondo2'], pal['fondo']]
            base = degradado(g[0], g[1], f.get('luz')).resize((int(W * M), int(H * M)), Image.BILINEAR)
        self.base = base
        self.capas = []
        for k in c.get('capas') or []:
            im = imgs.get(k.get('img'))
            if im is None:
                continue
            im = recortar(im.convert('RGBA'))
            if k.get('espejo'):
                im = im.transpose(Image.FLIP_LEFT_RIGHT)
            h = k.get('alto', 0.8) * H
            im = im.resize((max(1, int(im.width * h / im.height)), int(h)), Image.LANCZOS)
            if k.get('sombra', True):
                im = con_sombra(im)
            self.capas.append((k, im))
        self.textos = [Texto(x, pal) for x in c.get('textos') or []]
        p = c.get('panel')
        self.panel = None
        if p:  # pantalla dividida: un panel de color liso entra desde un lado
            self.panel = (p, Image.new('RGB', (int(W * p.get('ancho', 0.5)), H), rgb(p.get('color') or pal['fondo'])[:3]))

    def frame(self, t):
        D = self.dur
        cam = self.c.get('cam') or [1.0, 1.08, 0, 0]
        k = vaiven(t / D)
        z = cam[0] + (cam[1] - cam[0]) * k
        ox, oy = cam[2] * k * W, cam[3] * k * H
        BW, BH = self.base.size
        z = max(z, W / BW + 0.001)
        bw, bh = W / z, H / z
        cx, cy = BW / 2 + ox * 0.6, BH / 2 + oy * 0.6
        x0, y0 = max(0, min(BW - bw, cx - bw / 2)), max(0, min(BH - bh, cy - bh / 2))
        fr = self.base.resize((W, H), Image.BICUBIC, box=(x0, y0, x0 + bw, y0 + bh))
        for kc, im in self.capas:
            t0 = kc.get('t0', 0.0)
            fin = kc.get('hasta') or D + 9
            if t < t0 or t > fin + 0.3:
                continue
            p = suave((t - t0) / 0.9)
            par = kc.get('par', 1.35)
            esc = 1 + (z - 1) * par
            dx, dy = {'izq': (-120, 0), 'der': (120, 0), 'sube': (0, 90), 'fade': (0, 0)}.get(kc.get('entra', 'sube'), (0, 90))
            x = kc.get('x', 0.5) * W - ox * par + dx * (1 - p)
            y = kc.get('y', 0.55) * H - oy * par + dy * (1 - p) + math.sin(t * 0.9 + self.i) * kc.get('flota', 0)
            a = min(1, (t - t0) / 0.35) * (1 - cl((t - fin) / 0.3))
            capa = im if abs(esc - 1) < 0.004 else im.resize((int(im.width * esc), int(im.height * esc)), Image.BILINEAR)
            pegar(fr, capa, x, y, a)
        if self.panel:
            p, im = self.panel
            e = suave((t - p.get('t0', 0.0)) / 0.8)
            wpx = im.width
            if p.get('lado', 'der') == 'der':
                fr.paste(im, (int(W - wpx * e), 0))
            else:
                fr.paste(im, (int(-wpx * (1 - e)), 0))
        for tx in self.textos:
            tx.dibujar(fr, t, D)
        return fr


def transicion(tipo, a, b, k):
    k = vaiven(k)
    if tipo == 'barrido':  # cortina con borde suave de izquierda a derecha
        x = np.linspace(0, 1, W, dtype=np.float32)
        m = np.clip((k * 1.3 - x) / 0.3, 0, 1)
        return Image.composite(b, a, Image.fromarray(np.tile((m * 255).astype(np.uint8)[None, :], (H, 1)), 'L'))
    if tipo == 'empuje':  # la toma nueva empuja a la anterior hacia arriba
        out = Image.new('RGB', (W, H))
        out.paste(a, (0, int(-H * k)))
        out.paste(b, (0, int(H * (1 - k))))
        return out
    return Image.blend(a, b, k)


def producir(cine, salida, imgs, log=print):
    t0 = time.time()
    pal = {'fondo': '#0a0a1e', 'fondo2': '#22245a', 'texto': '#f2f0ff', 'acento': '#22d3ee', 'oro': '#f5c84a', 'rosa': '#f472d0'}
    pal.update(cine.get('paleta') or {})
    tomas = [x for x in cine.get('tomas') or []]
    v = cine.get('voz') or {}
    pistas = audio.voces([{'voz': x.get('voz') or '', 'tipo': x.get('entrega') or 'texto'} for x in tomas], v.get('id') or 'em_alex', float(v.get('velocidad') or 1.05))
    SR = audio.SR
    durs, partes = [], []
    for i, (x, p) in enumerate(zip(tomas, pistas)):
        tiene = bool((x.get('voz') or '').strip())
        antes = float(x.get('antes', 0.45))
        d = max(float(x.get('min', 2.5)), (antes + len(p) / SR + float(x.get('despues', 0.5))) if tiene else 0)
        if tiene:
            partes.append((sum(durs) + antes, p))
        durs.append(d)
    total = sum(durs)
    voz = np.zeros(int(total * SR) + SR, np.float32)
    for st, p in partes:
        a = int(st * SR)
        voz[a:a + len(p)] += p[:max(0, len(voz) - a)]
    wav = salida + '.wav'
    niveles, ac = [], 0.0
    for x, d in zip(tomas, durs):
        niveles.append((ac, ac + d, float(x.get('musica', 0.8))))
        ac += d
    eventos = [(sum(durs[:i]) - 0.15, 'whoosh') for i, x in enumerate(tomas) if i and x.get('trans') in ('barrido', 'empuje')]
    audio.mezcla(voz, eventos, total, cine.get('musica') or 'suave', wav, niveles)
    log(f'audio listo: {total:.1f} s')
    objs = [Toma(x, d, imgs, pal, i) for i, (x, d) in enumerate(zip(tomas, durs))]
    ini = [sum(durs[:i]) for i in range(len(durs))]
    # viñeta suave y grano fino: acabado de película sin efectos
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    vin = np.clip(((xx - W / 2) / (W / 2)) ** 2 + ((yy - H / 2) / (H / 2)) ** 2 - 0.55, 0, 1) * float(cine.get('vineta', 0.5))
    vin_m = Image.fromarray(np.clip(vin * 255, 0, 255).astype(np.uint8), 'L')
    negro = Image.new('RGB', (W, H), (0, 0, 0))
    barras = int(cine.get('barras', 0))
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-', '-i', wav,
           '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-maxrate', '6000k', '-bufsize', '12000k', '-pix_fmt', 'yuv420p',
           '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', salida]
    pr = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    TR = 0.6
    poster = None
    for f in range(int(total * FPS)):
        t = f / FPS
        i = max(j for j in range(len(objs)) if ini[j] <= t)
        lt = t - ini[i]
        fr = objs[i].frame(lt)
        tr = tomas[i].get('trans', 'fundido')
        if i > 0 and tr != 'corte' and lt < TR:
            prev = objs[i - 1].frame(durs[i - 1] + lt)
            fr = transicion(tr, prev, fr, lt / TR)
        fr.paste(negro, (0, 0), vin_m)
        if barras:
            d = ImageDraw.Draw(fr)
            d.rectangle([0, 0, W, barras], fill=(0, 0, 0))
            d.rectangle([0, H - barras, W, H], fill=(0, 0, 0))
        if t < 0.5:
            fr = Image.blend(negro, fr, t / 0.5)
        if t > total - 0.6:
            fr = Image.blend(negro, fr, max(0, (total - t) / 0.6))
        if poster is None and t > total * 0.35:
            poster = fr.copy()
        pr.stdin.write(fr.tobytes())
    pr.stdin.close()
    if pr.wait() != 0:
        raise RuntimeError('ffmpeg falló al armar el video')
    try:
        os.remove(wav)
    except Exception:
        pass
    if poster is not None:
        poster.save(salida.rsplit('.', 1)[0] + '.jpg', quality=88)
    log(f'video listo: {total:.1f} s en {time.time() - t0:.0f} s')
    return {'duracion': round(total, 2), 'escenas': [{'id': str(i), 'inicio': round(a, 2), 'dur': round(d, 2)} for i, (a, d) in enumerate(zip(ini, durs))]}
