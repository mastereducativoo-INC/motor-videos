# Motor de animación de los VSL (v2).
# Cada escena es una plantilla animada fija; lo que cambia por producto son los textos, los fondos (hechos por los
# trabajadores) y los ELEMENTOS reales de las páginas de ventas (mockups, portadas, bonos), que aparecen dentro del video.
# Cada video lleva un estilo de animación (neon, urgencia, premium, festival, cine) con su paleta, transiciones y efectos.
import math, os, random, re, subprocess
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageOps

W, H, FPS = 1920, 1080, 30
AQUI = os.path.dirname(os.path.abspath(__file__))
_FONTS = {}

ESTILOS = {
    # 1 venta directa: limpio, colores planos, mockup a la izquierda
    'neon':     {'ac2': '#22d3ee', 'trans': 'whip',  'tinte': None, 'part': None, 'beat': False, 'flash': False, 'shake': 0.6, 'barras': False, 'grano': False, 'grado': None,
                 'fondo': 'plano', 'lado': 'izq', 'motivos': ['ondas']},
    # 2 urgencia: edición rápida, destellos, mockup a la derecha
    'urgencia': {'ac': '#facc15', 'ac2': '#ef4444', 'trans': 'flash', 'tinte': (90, 0, 0), 'part': 'chispas', 'beat': True, 'flash': True, 'shake': 1.6, 'barras': False, 'grano': False,
                 'grado': ('contraste', 1.35), 'fondo': 'foto', 'lado': 'der', 'motivos': ['ecualizador', 'franjas']},
    # 3 valor: estudio oscuro elegante, mockup protagonista al centro
    'premium':  {'ac': '#f5c451', 'ac2': '#fff7e0', 'trans': 'fade',  'tinte': None, 'part': 'polvo', 'beat': False, 'flash': False, 'shake': 0.3, 'barras': False, 'grano': False, 'grado': None,
                 'fondo': 'estudio', 'lado': 'centro', 'motivos': []},
    # 4 experiencia: cinematográfico e inmersivo, escenas del tema a la vista
    'festival': {'ac': '#c026d3', 'ac2': '#22d3ee', 'trans': 'zoom',  'tinte': (40, 0, 90), 'part': 'bokeh', 'beat': True, 'flash': False, 'shake': 0.8, 'barras': True, 'grano': False,
                 'grado': ('duo', (26, 0, 48), (110, 230, 255), 0.45), 'fondo': 'foto', 'lado': 'izq', 'claro': 0.16, 'motivos': ['haces', 'ecualizador']},
    # 5 historia: tono de película, grano, mockup a la derecha
    'cine':     {'ac': '#fb923c', 'ac2': '#7dd3fc', 'trans': 'fade',  'tinte': (10, 18, 40), 'part': 'polvo', 'beat': False, 'flash': False, 'shake': 0.4, 'barras': False, 'grano': True,
                 'grado': ('duo', (6, 22, 30), (255, 186, 120), 0.62), 'fondo': 'foto', 'lado': 'der', 'motivos': ['ondas']},
}


def fuente(nombre, tam, peso=None):
    k = (nombre, int(tam), peso)
    if k not in _FONTS:
        f = ImageFont.truetype(os.path.join(AQUI, 'fonts', nombre), int(tam))
        if peso:
            try:
                f.set_variation_by_name(peso)
            except Exception:
                pass
        _FONTS[k] = f
    return _FONTS[k]


# toda la tipografía es Montserrat Black (la más gruesa); los tamaños pensados para Anton se ajustan a su ancho
ANTON = lambda t: fuente('Montserrat.ttf', max(10, t * 0.7), 'Black')
MONT = lambda t, p='ExtraBold': fuente('Montserrat.ttf', t, p)


def hexrgb(h, a=255):
    h = str(h or '#22d3ee').lstrip('#')
    if len(h) == 3:
        h = ''.join(c * 2 for c in h)
    try:
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)
    except ValueError:
        return (34, 211, 238, a)


def cl(x, a=0.0, b=1.0):
    return max(a, min(b, x))


def ease(x):
    x = cl(x)
    return 1 - (1 - x) ** 3


def eio(x):
    x = cl(x)
    return 3 * x * x - 2 * x ** 3


def back(x, s=1.70158):
    x = cl(x) - 1
    return x * x * ((s + 1) * x + s) + 1


def con_alfa(im, a):
    if a >= 0.995:
        return im
    o = im.copy()
    o.putalpha(im.getchannel('A').point(lambda v: int(v * a)))
    return o


def pegar(fr, ov, cx, cy, escala=1.0, alfa=1.0, giro=0.0):
    if ov is None or alfa <= 0.01 or escala <= 0.01:
        return
    o = ov
    if abs(escala - 1) > 0.005:
        o = o.resize((max(1, int(o.width * escala)), max(1, int(o.height * escala))), Image.BILINEAR)
    if abs(giro) > 0.2:
        o = o.rotate(giro, Image.BICUBIC, expand=True)
    o = con_alfa(o, alfa)
    fr.paste(o, (int(cx - o.width / 2), int(cy - o.height / 2)), o)


def cubrir(img, w, h):
    r = max(w / img.width, h / img.height)
    im = img.resize((max(w, round(img.width * r)), max(h, round(img.height * r))), Image.LANCZOS)
    x, y = (im.width - w) // 2, (im.height - h) // 2
    return im.crop((x, y, x + w, y + h))


def pastilla(w, h, color, radio=None):
    im = Image.new('RGBA', (int(w), int(h)), (0, 0, 0, 0))
    ImageDraw.Draw(im).rounded_rectangle([0, 0, int(w) - 1, int(h) - 1], radius=radio if radio is not None else int(h) // 2, fill=color)
    return im


def resplandor(im, color, radio=22, fuerza=1.0, margen=50):
    """Copia del objeto con un halo de color detrás."""
    g = Image.new('RGBA', (im.width + 2 * margen, im.height + 2 * margen), (0, 0, 0, 0))
    s = Image.new('RGBA', im.size, tuple(color[:3]) + (0,))
    s.putalpha(im.getchannel('A').point(lambda v: int(min(255, v * fuerza))))
    g.paste(s, (margen, margen), s)
    g = g.filter(ImageFilter.GaussianBlur(radio))
    g.alpha_composite(im, (margen, margen))
    return g


def sombra(im, desp=(0, 26), radio=26, alfa=170, margen=60):
    g = Image.new('RGBA', (im.width + 2 * margen, im.height + 2 * margen), (0, 0, 0, 0))
    s = Image.new('RGBA', im.size, (0, 0, 0, 0))
    s.putalpha(im.getchannel('A').point(lambda v: int(v * alfa / 255)))
    g.paste(s, (margen + desp[0], margen + desp[1]), s)
    g = g.filter(ImageFilter.GaussianBlur(radio))
    g.alpha_composite(im, (margen, margen))
    return g


# ---------- textos ----------
def lineas(texto, fnt, ancho):
    out, act = [], ''
    for p in str(texto).split():
        prueba = (act + ' ' + p).strip()
        if fnt.getlength(prueba) <= ancho or not act:
            act = prueba
        else:
            out.append(act)
            act = p
    if act:
        out.append(act)
    return out


def caja_texto(texto, fnt, ancho, color=(255, 255, 255, 255), borde=0, borde_color=(0, 0, 0, 255), inter=1.04, centro=True):
    ls = lineas(texto, fnt, ancho)
    asc, desc = fnt.getmetrics()
    lh = int((asc + desc) * inter)
    w = int(max([fnt.getlength(l) for l in ls] + [1])) + borde * 2 + 10
    h = lh * len(ls) + borde * 2 + 10
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for i, l in enumerate(ls):
        x = (w - fnt.getlength(l)) / 2 if centro else borde + 5
        d.text((x, borde + 5 + i * lh), l, font=fnt, fill=color, stroke_width=borde, stroke_fill=borde_color)
    return im


def oscurecer(c, k):
    return tuple(int(v * k) for v in c[:3]) + (255,)


class Cinetico:
    """Título en MAYÚSCULAS, Montserrat Black, con volumen 3D (extrusión) y sombra: entra palabra por palabra flotando."""

    def __init__(self, texto, tam, ancho, color=(255, 255, 255, 255), acento=None, resaltar=None, borde=6):
        txt = str(texto).upper()
        tam = tam * 0.8
        while True:
            f = MONT(tam, 'Black')
            ls = lineas(txt, f, ancho)
            if tam <= 40 or (len(ls) <= 3 and max(f.getlength(l) for l in ls) <= ancho):
                break
            tam *= 0.92
        self.palabras = []
        asc, desc = f.getmetrics()
        lh = int((asc + desc) * 1.02)
        esp = f.getlength(' ')
        prof = max(6, int(tam * 0.12))
        lado_c = oscurecer(acento or (120, 120, 140), 0.55)
        y = 0
        resaltar = set((resaltar or []))
        for li, l in enumerate(ls):
            ws = l.split(' ')
            tot = sum(f.getlength(x) for x in ws) + esp * (len(ws) - 1)
            x = -tot / 2
            for wtxt in ws:
                wl = f.getlength(wtxt)
                col = acento if (acento and (wtxt.strip('¡!¿?.,:') in resaltar or re.search(r'\$|\d', wtxt))) else color
                m = prof + 26
                im = Image.new('RGBA', (int(wl) + m * 2, asc + desc + m * 2), (0, 0, 0, 0))
                d = ImageDraw.Draw(im)
                d.text((m + prof * 0.8 + 6, m + prof + 12), wtxt, font=f, fill=(0, 0, 0, 150))
                im = im.filter(ImageFilter.GaussianBlur(9))
                d = ImageDraw.Draw(im)
                for k in range(prof, 0, -1):
                    d.text((m + k * 0.6, m + k), wtxt, font=f, fill=oscurecer(lado_c, 0.55 + 0.45 * (1 - k / prof)), stroke_width=2, stroke_fill=oscurecer(lado_c, 0.4))
                d.text((m, m), wtxt, font=f, fill=col, stroke_width=2, stroke_fill=(0, 0, 0, 255))
                self.palabras.append((im, x + wl / 2, y + lh / 2))
                x += wl + esp
            y += lh
        self.alto = y
        self.palabras = [(im, x, yy - self.alto / 2) for im, x, yy in self.palabras]

    def dibujar(self, fr, t, cx, cy, inicio=0.0, paso=0.09, dur=0.32, golpe=1.4, alfa=1.0):
        for i, (im, x, y) in enumerate(self.palabras):
            k = (t - inicio - i * paso) / dur
            if k <= 0:
                continue
            e = ease(k)
            flot = math.sin(t * 1.7 + i * 0.6) * 5
            pegar(fr, im, cx + x, cy + y + flot, golpe - (golpe - 1) * e, min(1, k * 2.2) * alfa)


# ---------- elementos reales (mockups de la página) ----------
def tiene_alfa(im):
    """True si la imagen ya viene recortada (fondo transparente)."""
    h = im.getchannel('A').histogram()
    return sum(h[:40]) > 0.03 * im.width * im.height


def tarjeta(img, maxw, maxh, acento, radio=26, borde=7):
    """Elemento real flotando en la escena: sin recuadro ni borde, solo su sombra y un halo suave."""
    im = img.convert('RGBA')
    recortado = tiene_alfa(im)
    if recortado:
        bb = im.getchannel('A').point(lambda v: 255 if v > 12 else 0).getbbox()
        if bb:
            im = im.crop(bb)
    r = min(maxw / im.width, maxh / im.height)
    im = im.resize((max(1, int(im.width * r)), max(1, int(im.height * r))), Image.LANCZOS)
    if r > 1.25:
        a = im.getchannel('A')
        im = im.convert('RGB').filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2)).convert('RGBA')
        im.putalpha(a)
    if not recortado:
        m = Image.new('L', im.size, 0)
        ImageDraw.Draw(m).rounded_rectangle([0, 0, im.width - 1, im.height - 1], radius=radio, fill=255)
        im.putalpha(m)
    return sombra(resplandor(im, acento, radio=36, fuerza=0.38, margen=50), desp=(0, 34), radio=30, alfa=150, margen=60)


def laptop(img, ancho, acento):
    """Computadora con la imagen del curso en pantalla."""
    sw = int(ancho)
    sh = int(sw * 0.62)
    pant = Image.new('RGBA', (sw, sh), (12, 12, 18, 255))
    if img is not None:
        x = cubrir(img.convert('RGB'), sw - 36, sh - 36)
        pant.paste(x, (18, 18))
    else:
        d = ImageDraw.Draw(pant)
        d.rectangle([18, 18, sw - 18, sh - 18], fill=tuple(acento[:3]))
    m = Image.new('L', pant.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, sw - 1, sh - 1], radius=26, fill=255)
    pant.putalpha(m)
    base_h = int(sw * 0.05)
    lap = Image.new('RGBA', (int(sw * 1.18), sh + base_h + 10), (0, 0, 0, 0))
    lap.alpha_composite(pant, (int(sw * 0.09), 0))
    d = ImageDraw.Draw(lap)
    bx0, bx1 = 0, lap.width - 1
    d.rounded_rectangle([bx0, sh + 2, bx1, sh + base_h], radius=base_h // 2, fill=(190, 192, 205, 255))
    d.rectangle([lap.width / 2 - sw * 0.08, sh + 2, lap.width / 2 + sw * 0.08, sh + 10], fill=(140, 142, 155, 255))
    return sombra(resplandor(lap, acento, radio=30, fuerza=0.45, margen=40), margen=40)


def rayos(tam, color, n=14):
    im = Image.new('RGBA', (tam, tam), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    c = tam / 2
    for i in range(n):
        a0 = 2 * math.pi * i / n
        a1 = a0 + math.pi / n * 0.55
        d.polygon([(c, c), (c + c * math.cos(a0), c + c * math.sin(a0)), (c + c * math.cos(a1), c + c * math.sin(a1))], fill=tuple(color[:3]) + (90,))
    m = Image.new('L', (tam, tam), 0)
    md = ImageDraw.Draw(m)
    for r in range(int(c), 0, -6):
        md.ellipse([c - r, c - r, c + r, c + r], fill=int(255 * (1 - r / c) ** 0.8))
    im.putalpha(Image.composite(im.getchannel('A'), Image.new('L', im.size, 0), m))
    return im.filter(ImageFilter.GaussianBlur(4))


def candado(abierto, color):
    """Candado dibujado; `abierto` de 0 a 1 sube el arco."""
    s = 360
    im = Image.new('RGBA', (s, s + 140), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    lift = int(70 * abierto)
    ox = int(46 * abierto)
    d.arc([70 + ox, 10 - lift, 290 + ox, 230 - lift], 180, 360, fill=(230, 232, 240, 255), width=34)
    d.line([(87 + ox, 120 - lift), (87 + ox, 190 - lift * (1 - abierto))], fill=(230, 232, 240, 255), width=34)
    if abierto < 0.5:
        d.line([(273, 120), (273, 190)], fill=(230, 232, 240, 255), width=34)
    d.rounded_rectangle([30, 170, 330, 440], radius=40, fill=tuple(color[:3]) + (255,))
    d.rounded_rectangle([30, 170, 330, 230], radius=40, fill=tuple(min(255, int(v * 1.2)) for v in color[:3]) + (255,))
    d.ellipse([155, 270, 205, 320], fill=(20, 20, 26, 255))
    d.polygon([(168, 310), (192, 310), (198, 380), (162, 380)], fill=(20, 20, 26, 255))
    return resplandor(im, color, radio=30, fuerza=0.6, margen=50)


def escudo(color, dias):
    s = 560
    im = Image.new('RGBA', (s, s + 80), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    pts = [(s / 2, 20), (s - 40, 110), (s - 70, 400), (s / 2, s + 50), (70, 400), (40, 110)]
    d.polygon(pts, fill=tuple(color[:3]) + (255,))
    inner = [(x * 0.86 + s / 2 * 0.14, y * 0.86 + 40) for x, y in pts]
    d.polygon(inner, fill=(18, 18, 26, 255))
    d.text((s / 2, 250), str(dias), font=ANTON(210), fill=(255, 255, 255, 255), anchor='mm')
    d.text((s / 2, 400), 'DÍAS DE', font=MONT(40), fill=tuple(color[:3]) + (255,), anchor='mm')
    d.text((s / 2, 450), 'GARANTÍA', font=MONT(40), fill=tuple(color[:3]) + (255,), anchor='mm')
    return resplandor(im, color, radio=34, fuerza=0.6, margen=50)


# ---------- capas globales ----------
class Particulas:
    def __init__(self, tipo, colores, n=34, seed=1):
        rnd = random.Random(seed)
        self.tipo = tipo
        self.sprites = []
        for c in colores:
            for r in (6, 12, 20, 34):
                s = Image.new('RGBA', (r * 4, r * 4), (0, 0, 0, 0))
                ImageDraw.Draw(s).ellipse([r, r, r * 3, r * 3], fill=tuple(c[:3]) + (150 if tipo == 'bokeh' else 220,))
                s = s.filter(ImageFilter.GaussianBlur(r * (0.5 if tipo == 'bokeh' else 0.25)))
                self.sprites.append(s)
        self.p = []
        for i in range(n):
            self.p.append((rnd.uniform(0, W), rnd.uniform(0, H), rnd.uniform(18, 70) * (2.2 if tipo == 'chispas' else 1), rnd.uniform(0, 6.28),
                           rnd.randrange(len(self.sprites)) if tipo == 'bokeh' else rnd.randrange(len(self.sprites)) // 4 * 4 + rnd.choice((0, 0, 1))))

    def dibujar(self, fr, t, fuerza=1.0):
        for x, y, v, ph, si in self.p:
            yy = (y - v * t) % (H + 100) - 50
            xx = x + math.sin(t * 0.7 + ph) * 30
            a = (0.35 + 0.35 * math.sin(t * 2.2 + ph)) * fuerza
            if a > 0.03:
                s = self.sprites[si]
                fr.paste(con_alfa(s, a), (int(xx - s.width / 2), int(yy - s.height / 2)), con_alfa(s, a))


class Confeti:
    def __init__(self, colores, n=110, seed=5):
        rnd = random.Random(seed)
        self.p = [(rnd.uniform(-1, 1) * 900, rnd.uniform(-1500, -650), rnd.uniform(0, 6.28), rnd.uniform(-8, 8), tuple(rnd.choice(colores)[:3]), rnd.uniform(10, 22)) for _ in range(n)]

    def dibujar(self, fr, t, cx, cy):
        if t < 0 or t > 2.6:
            return
        d = ImageDraw.Draw(fr)
        for vx, vy, a0, w, col, sz in self.p:
            x = cx + vx * t
            y = cy + vy * t + 1300 * t * t
            if y > H + 40:
                continue
            a = a0 + w * t
            dx, dy = math.cos(a) * sz, math.sin(a) * sz * 0.5
            d.polygon([(x - dx, y - dy), (x + dy, y - dx * 0.4), (x + dx, y + dy), (x - dy, y + dx * 0.4)], fill=col)


def vineta():
    m = Image.new('L', (W // 4, H // 4), 0)
    d = ImageDraw.Draw(m)
    for i in range(60):
        k = i / 60
        d.ellipse([-W / 8 * (1 - k) - 40, -H / 8 * (1 - k) - 40, W / 4 + W / 8 * (1 - k) + 40, H / 4 + H / 8 * (1 - k) + 40], outline=int(200 * (1 - k) ** 2))
    m = m.filter(ImageFilter.GaussianBlur(14)).resize((W, H), Image.BILINEAR)
    inv = Image.new('L', (W, H), 0)
    # borde oscuro: alfa alto afuera, cero al centro
    dd = Image.new('L', (W // 8, H // 8), 0)
    d2 = ImageDraw.Draw(dd)
    for i in range(40):
        k = i / 40
        d2.ellipse([W / 16 * k - W / 32, H / 16 * k - H / 32, W / 8 - W / 16 * k + W / 32, H / 8 - H / 16 * k + H / 32], fill=int(170 * (1 - k) ** 1.6))
    inv = Image.eval(dd.resize((W, H), Image.BILINEAR).filter(ImageFilter.GaussianBlur(30)), lambda v: v)
    return inv


def gradar(base, g):
    """Corrección de color propia de cada estilo, para que las 5 versiones no se vean iguales."""
    if g[0] == 'contraste':
        return ImageEnhance.Color(ImageEnhance.Contrast(base).enhance(g[1])).enhance(1.25)
    if g[0] == 'duo':
        d = ImageOps.colorize(ImageOps.autocontrast(base.convert('L'), cutoff=1), g[1], g[2])
        return Image.blend(base, d, g[3])
    return base


class Fondo:
    def __init__(self, img, oscuro=0.45, modo=0, desenfoque=0, tinte=None, alfa_tinte=0.18, grado=None):
        BW, BH = int(W * 1.12), int(H * 1.12)
        src = img.convert('RGB')
        base = cubrir(src, BW, BH)
        if BW / max(1, src.width) > 1.3 and not desenfoque:
            base = base.filter(ImageFilter.UnsharpMask(radius=2.2, percent=70, threshold=2))
        if desenfoque:
            base = base.filter(ImageFilter.GaussianBlur(desenfoque))
        if grado:
            base = gradar(base, grado)
        if tinte:
            base = Image.blend(base, Image.new('RGB', base.size, tinte), alfa_tinte)
        if oscuro:
            base = Image.blend(base, Image.new('RGB', base.size, (0, 0, 0)), oscuro)
        self.base, self.modo = base, modo % 4

    def frame(self, p, pulso=0.0):
        BW, BH = self.base.size
        z = 1 + 0.08 * (p if self.modo in (0, 2) else 1 - p) + pulso
        bw, bh = BW / z, BH / z
        dx = (BW - bw) * (0.5 + (0.16 * (p - 0.5) if self.modo in (1, 2) else -0.12 * (p - 0.5)))
        dy = (BH - bh) * 0.5
        return self.base.resize((W, H), Image.BILINEAR, box=(dx, dy, dx + bw, dy + bh))


def fondo_plano(ac, ac2, i):
    """Fondo limpio de colores planos (venta directa): bloques geométricos del color de acento."""
    rnd = random.Random(40 + i)
    base = oscurecer(ac, 0.2)[:3]
    g = Image.new('RGB', (W, H), tuple(int(v * 0.6 + 6) for v in base))
    d = ImageDraw.Draw(g, 'RGBA')
    for k in range(5):
        r = rnd.randint(260, 620)
        x, y = rnd.choice([rnd.randint(-100, 300), rnd.randint(W - 300, W + 100)]), rnd.randint(-100, H + 100)
        c = (ac if k % 2 == 0 else ac2)[:3]
        d.ellipse([x - r, y - r, x + r, y + r], fill=tuple(c) + (rnd.randint(26, 54),))
    d.polygon([(0, H), (0, H - 240), (W, H - 60 - rnd.randint(0, 120)), (W, H)], fill=tuple(ac[:3]) + (40,))
    return g


def fondo_estudio(ac, i):
    """Estudio oscuro con un foco suave (valor del producto): el mockup es el protagonista."""
    g = Image.new('RGB', (W // 4, H // 4), (6, 6, 9))
    d = ImageDraw.Draw(g)
    cx = W / 8 + (i % 3 - 1) * 30
    for r in range(210, 0, -3):
        k = r / 210
        c = tuple(int(6 + ac[j] * 0.3 * (1 - k) ** 1.6) for j in range(3))
        d.ellipse([cx - r * 1.5, H / 8 - r * 0.95, cx + r * 1.5, H / 8 + r * 0.95], fill=c)
    d.rectangle([0, H // 4 - 34, W // 4, H // 4], fill=(14, 12, 10))
    return g.filter(ImageFilter.GaussianBlur(16)).resize((W, H), Image.BILINEAR)


class Motivos:
    """Animaciones del tema del producto, detrás del contenido. Música: ecualizador, ondas de sonido y haces de luz."""

    def __init__(self, nombres, ac, ac2, props=None):
        self.n, self.ac, self.ac2 = set(nombres or []), tuple(ac[:3]), tuple(ac2[:3])
        rnd = random.Random(3)
        self.fases = [rnd.uniform(0, 6.28) for _ in range(64)]
        self.vel = [rnd.uniform(2.0, 5.5) for _ in range(64)]
        self.props = [tarjeta(im, 250, 250, ac) for im in (props or [])]

    def dibujar(self, fr, t, pulso, tipo):
        d = ImageDraw.Draw(fr, 'RGBA')
        if 'haces' in self.n and tipo in ('gancho', 'felicita', 'producto', 'cta', 'desbloqueo', 'texto', 'imagen'):
            for j in range(4):
                a = math.sin(t * 0.6 + j * 1.7) * 0.5
                x0 = W * (0.15 + 0.23 * j)
                x1 = x0 + math.tan(a) * H
                col = (self.ac if j % 2 == 0 else self.ac2) + (26,)
                d.polygon([(x0 - 14, 0), (x0 + 14, 0), (x1 + 150, H), (x1 - 150, H)], fill=col)
        if 'franjas' in self.n and tipo in ('gancho', 'precio', 'cta', 'texto'):
            off = (t * 260) % 160
            for x in range(-200, W + 200, 160):
                d.polygon([(x + off, H - 26), (x + off + 80, H - 26), (x + off + 60, H), (x + off - 20, H)], fill=self.ac + (190,))
                d.polygon([(x - off + 160, 0), (x - off + 240, 0), (x - off + 220, 26), (x - off + 140, 26)], fill=self.ac + (190,))
        if 'ecualizador' in self.n and tipo not in ('valor', 'lista', 'etapas'):
            bw = W / 64
            for j in range(64):
                h = (0.25 + 0.75 * abs(math.sin(t * self.vel[j] + self.fases[j]))) * (46 + 900 * pulso + 34 * abs(math.sin(j * 0.21 + t)))
                d.rectangle([j * bw + 5, H - h, (j + 1) * bw - 5, H], fill=(self.ac if j % 3 else self.ac2) + (120,))
        if 'ondas' in self.n and tipo in ('gancho', 'felicita', 'texto', 'ruta', 'garantia', 'cta', 'imagen'):
            for q, (yy, amp, col) in enumerate(((H - 70, 26, self.ac), (H - 96, 16, self.ac2))):
                pts = [(x, yy + math.sin(x * 0.012 + t * (2.2 + q)) * amp * (0.5 + 0.5 * math.sin(x * 0.003 + t))) for x in range(0, W + 24, 24)]
                d.line(pts, fill=col + (150,), width=5)
        if self.props and tipo in ('gancho', 'felicita', 'texto', 'ruta'):
            lug = [(150, H - 190), (W - 150, 190), (W - 160, H - 200)]
            for j, im in enumerate(self.props[:3]):
                x, y = lug[j]
                pegar(fr, im, x, y + math.sin(t * 1.3 + j * 2) * 14, 0.9, 0.92, math.sin(t * 0.8 + j) * 8)


def fondo_degradado(ac, ac2):
    g = Image.new('RGB', (W // 4, H // 4), (8, 8, 14))
    d = ImageDraw.Draw(g)
    for r in range(220, 0, -4):
        k = r / 220
        c = tuple(int(8 + ac[i] * 0.42 * (1 - k)) for i in range(3))
        d.ellipse([W / 8 - r * 1.6, H / 8 - r, W / 8 + r * 1.6, H / 8 + r], fill=c)
    return g.filter(ImageFilter.GaussianBlur(20)).resize((W, H), Image.BILINEAR)


# ---------- subtítulos ----------
class Subtitulos:
    def __init__(self, acento):
        self.f = MONT(56, 'Black')
        self.ac = acento
        self.cache = {}

    def bloques(self, texto, dur, t0):
        pal = [p for p in re.sub(r'\s+', ' ', str(texto or '')).strip().split(' ') if p]
        if not pal:
            return []
        grupos, act = [], []
        for p in pal:
            act.append(p)
            if len(act) >= 5 or (re.search(r'[.!?…:;,]$', p) and len(act) >= 2):
                grupos.append(act)
                act = []
        if act:
            grupos.append(act)
        total = sum(len(p) + 1 for p in pal)
        out, t = [], t0
        for g in grupos:
            chars = [len(p) + 1 for p in g]
            d = dur * sum(chars) / total
            tiempos, s = [], t
            for c in chars:
                tiempos.append(s)
                s += d * c / sum(chars)
            out.append((t, t + d, g, tiempos))
            t += d
        return out

    def imagen(self, g, k):
        key = (' '.join(g), k)
        if key in self.cache:
            return self.cache[key]
        txt = [p.upper() for p in g]
        esp = self.f.getlength(' ')
        anchos = [self.f.getlength(p) for p in txt]
        w = int(sum(anchos) + esp * (len(txt) - 1)) + 76
        asc, desc = self.f.getmetrics()
        h = asc + desc + 34
        im = pastilla(w, h, (0, 0, 0, 165), 22)
        d = ImageDraw.Draw(im)
        x = 38
        for i, p in enumerate(txt):
            if i == k:
                d.rounded_rectangle([x - 10, 9, x + anchos[i] + 10, h - 9], radius=14, fill=tuple(self.ac[:3]) + (255,))
                d.text((x, 15), p, font=self.f, fill=(10, 10, 14, 255))
            else:
                d.text((x, 15), p, font=self.f, fill=(255, 255, 255, 255), stroke_width=2, stroke_fill=(0, 0, 0, 255))
            x += anchos[i] + esp
        if w > W - 140:
            r = (W - 140) / w
            im = im.resize((int(w * r), int(h * r)), Image.LANCZOS)
        self.cache[key] = im
        return im

    def dibujar(self, fr, bloques, t, y=H - 105):
        for (a, b, g, ts) in bloques:
            if a <= t < b:
                k = max([i for i, s in enumerate(ts) if s <= t] or [0])
                im = self.imagen(g, k)
                ent = ease((t - a) / 0.12)
                pegar(fr, im, W / 2, y + (1 - ent) * 18, 0.95 + 0.05 * ent, ent)
                return


# ---------- escenas ----------
class Escena:
    def __init__(self, e, dur, ctx, i):
        self.e, self.dur, self.ctx, self.i = e, dur, ctx, i
        self.tipo = e.get('tipo') or 'imagen'
        est = ctx['estilo']
        self.est = est
        self.ac, self.ac2 = ctx['ac'], ctx['ac2']
        img = ctx['imagenes'].get(e.get('id')) or ctx['fondos'].get(str(e.get('fondo') or ''))
        if img is None and ctx['fondos']:
            img = list(ctx['fondos'].values())[i % len(ctx['fondos'])]
        self.lado = est.get('lado', 'izq')
        propio = est.get('fondo') in ('plano', 'estudio') and self.tipo != 'imagen'
        if propio:
            img = fondo_plano(self.ac, self.ac2, i) if est['fondo'] == 'plano' else fondo_estudio(self.ac, i)
        osc = {'felicita': 0.5, 'ruta': 0.72, 'elemento': 0.62, 'valor': 0.74, 'etapas': 0.76, 'gancho': 0.42, 'acceso': 0.62, 'desbloqueo': 0.6, 'producto': 0.55, 'lista': 0.68, 'elementos': 0.6, 'precio': 0.7, 'garantia': 0.6, 'cta': 0.62, 'texto': 0.5}.get(self.tipo, 0.28)
        blur = 10 if self.tipo in ('lista', 'precio', 'acceso', 'elementos', 'ruta', 'elemento', 'valor', 'etapas', 'garantia') else 0
        if propio:
            osc, blur = 0.0, 0
        elif est.get('claro'):
            osc, blur = max(0.2, osc - est['claro']), (6 if blur else 0)
        self.fondo = Fondo(img, osc, i, blur, None if propio else est['tinte'], 0.2, None if propio else est.get('grado')) if img is not None else None
        self.grad = None if self.fondo else fondo_degradado(self.ac, self.ac2)
        els = [ctx['elementos'][x] for x in (e.get('elementos') or []) if x in ctx['elementos']]
        self.els = els
        t = (e.get('titulo') or '').strip()
        tam = {'gancho': 250, 'felicita': 200, 'texto': 150, 'cta': 118, 'acceso': 100, 'producto': 104, 'desbloqueo': 104, 'elemento': 96, 'garantia': 100, 'ruta': 92, 'etapas': 84, 'valor': 84}.get(self.tipo, 96)
        ancho = {'acceso': 780, 'producto': 780, 'elemento': 780, 'garantia': 780}.get(self.tipo, W - 260)
        if self.lado == 'centro' and self.tipo in ('acceso', 'producto', 'elemento', 'garantia'):
            ancho = W - 300
        self.tit = Cinetico(t, tam, ancho, acento=self.ac, resaltar=e.get('resaltar')) if t else None
        fz = (e.get('frase') or '').strip()
        self.frase = caja_texto(fz, MONT(54, 'Black'), 760 if (self.tipo in ('acceso', 'elemento', 'garantia', 'producto') and self.lado != 'centro') else 1500, (255, 255, 255, 255), 4) if fz else None
        self.prep()

    # objetos de cada tipo (se preparan una vez)
    def prep(self):
        e, ac, P = self.e, self.ac, self.ctx['producto']
        tp = self.tipo
        if tp == 'acceso':
            n = len(self.els[:4]) or 1
            mx = {1: (720, 600), 2: (460, 540), 3: (380, 500), 4: (330, 460)}[n]
            self.cards = [tarjeta(x, mx[0], mx[1], ac) for x in self.els[:4]]
            self.badge = resplandor(self._badge((e.get('etiqueta') or 'COMPRA CONFIRMADA').upper(), (34, 197, 94, 255), check=True), (34, 197, 94, 255), 18, 0.6, 30)
        if tp in ('desbloqueo', 'producto', 'cta', 'precio', 'lista', 'valor', 'elemento') and self.els:
            mx = {'producto': (900, 640), 'desbloqueo': (820, 600), 'cta': (420, 340), 'precio': (380, 320), 'lista': (560, 620), 'valor': (520, 600), 'elemento': (780, 700)}[tp]
            if self.lado == 'centro' and tp in ('producto', 'elemento'):
                mx = (1100, 640)
            if self.lado != 'centro' and tp == 'producto':
                mx = (760, 620)
            self.card = tarjeta(self.els[0], mx[0], mx[1], ac)
            self.fan = [tarjeta(x, mx[0] * 0.55, mx[1] * 0.55, self.ac2, 18, 5) for x in self.els[1:3]] if tp == 'producto' else []
        else:
            self.card, self.fan = None, []
        if tp in ('desbloqueo', 'producto', 'precio', 'elemento', 'felicita'):
            self.rayo = rayos(1300, ac)
        if tp == 'felicita':
            self.badge = resplandor(self._badge((e.get('etiqueta') or 'COMPRA CONFIRMADA').upper(), (34, 197, 94, 255), check=True), (34, 197, 94, 255), 18, 0.6, 30)
            self.conf = Confeti([ac, self.ac2, (255, 255, 255)], 140, 5 + self.i)
        if tp == 'elemento':
            n, de = e.get('n'), e.get('de')
            self.chip = self._chip(f'{n} DE {de}', ac) if n and de else None
            v = str(e.get('valor') or '').strip().lstrip('$')
            self.chipv = self._chip(f'VALOR ${v}', self.ac2, oscuro=True) if v else None
        if tp == 'garantia':
            self.sello = self._chip((e.get('etiqueta') or 'REEMBOLSO POR HOTMART').upper(), (255, 255, 255, 255), oscuro=True)
        if tp == 'ruta':
            self.pasos = []
            items = [x for x in (e.get('items') or []) if x][:6]
            for j, it in enumerate(items):
                txt = (it.get('texto') if isinstance(it, dict) else str(it)) or ''
                c = Image.new('RGBA', (150, 150), (0, 0, 0, 0))
                d = ImageDraw.Draw(c)
                d.ellipse([4, 4, 146, 146], fill=tuple(ac[:3]) + (255,))
                d.text((75, 72), str(j + 1), font=ANTON(86), fill=(10, 10, 14, 255), anchor='mm')
                self.pasos.append((resplandor(c, ac, 22, 0.8, 34), caja_texto(txt.upper(), MONT(40, 'Black'), 300, (255, 255, 255, 255), 3)))
        if tp == 'etapas':
            self.cols = []
            items = [x for x in (e.get('items') or []) if isinstance(x, dict)][:3]
            cw = 540
            for j, it in enumerate(items):
                pts = [str(x) for x in (it.get('puntos') or [])][:4]
                col = ac if j % 2 == 0 else self.ac2
                cab = caja_texto(str(it.get('texto') or '').upper(), ANTON(58), cw - 70, (255, 255, 255, 255))
                lin = [caja_texto(x, MONT(33, 'Bold'), cw - 130, (236, 236, 244, 255), centro=False) for x in pts]
                hh = 150 + cab.height + sum(l.height + 16 for l in lin) + 40
                im = pastilla(cw, hh, (12, 12, 20, 215), 34)
                d = ImageDraw.Draw(im)
                d.rounded_rectangle([0, 0, cw - 1, 12], radius=6, fill=tuple(col[:3]) + (255,))
                ch = self._chip(f'ETAPA {j + 1}', col)
                im.alpha_composite(ch, ((cw - ch.width) // 2, 38))
                im.alpha_composite(cab, ((cw - cab.width) // 2, 130))
                y = 150 + cab.height
                for l in lin:
                    d.ellipse([44, y + 14, 62, y + 32], fill=tuple(col[:3]) + (255,))
                    im.alpha_composite(l, (78, y))
                    y += l.height + 16
                self.cols.append(im)
        if tp == 'elementos':
            n = len(self.els[:4]) or 1
            mw = {1: 900, 2: 760, 3: 540, 4: 420}[n]
            self.cards = [tarjeta(x, mw, 560 if n < 3 else 470, ac if j % 2 == 0 else self.ac2, 22, 6) for j, x in enumerate(self.els[:4])]
        if tp in ('lista', 'valor'):
            items = [x for x in (e.get('items') or []) if x][:7]
            self.items, self.valores = [], []
            con_card = self.card is not None
            w = 1060 if con_card else 1460
            f = MONT(46 if len(items) <= 5 else 40, 'ExtraBold')
            fv = MONT(38, 'Bold')
            for it in items:
                txt = it.get('texto') if isinstance(it, dict) else str(it)
                val = it.get('valor') if isinstance(it, dict) else None
                eid = it.get('elemento') if isinstance(it, dict) else None
                h = 96 if len(items) <= 5 else (78 if tp == 'valor' else 84)
                im = pastilla(w, h, (12, 12, 20, 205), 22)
                d = ImageDraw.Draw(im)
                d.rounded_rectangle([0, 0, 10, h - 1], radius=4, fill=ac)
                thumb = self.ctx['elementos'].get(eid) if eid else None
                if thumb is not None:
                    th = thumb.convert('RGBA')
                    rr = min((h - 12) / th.width, (h - 12) / th.height)
                    th = th.resize((max(1, int(th.width * rr)), max(1, int(th.height * rr))), Image.LANCZOS)
                    im.alpha_composite(th, (54 - th.width // 2, (h - th.height) // 2))
                else:
                    d.ellipse([28, h / 2 - 26, 80, h / 2 + 26], fill=ac)
                    d.line([(41, h / 2), (51, h / 2 + 11), (68, h / 2 - 12)], fill=(10, 10, 10, 255), width=8, joint='curve')
                tx = str(txt or '')
                lim = w - (300 if val else 150)
                while f.getlength(tx) > lim and len(tx) > 4:
                    tx = tx[:-2]
                if tx != str(txt):
                    tx = tx.rstrip() + '…'
                d.text((108, h / 2), tx, font=f, fill=(255, 255, 255, 255), anchor='lm')
                if val not in (None, '', 0):
                    vs = '$' + str(val).lstrip('$')
                    d.text((w - 30, h / 2), vs, font=fv, fill=tuple(self.ac2[:3]) + (255,), anchor='rm')
                    try:
                        self.valores.append(float(str(val).lstrip('$').replace(',', '')))
                    except ValueError:
                        self.valores.append(0)
                else:
                    self.valores.append(0)
                self.items.append(im)
        if tp == 'precio':
            self.valor = float(P.get('valor') or 0) if str(P.get('valor') or '').replace('.', '', 1).isdigit() else 0
            self.precio_txt = P.get('precio_txt') or ''
            self.precio = resplandor(caja_texto(self.precio_txt, ANTON(330), 1600, ac, 8), ac, 30, 0.8, 50)
            try:
                pr = float(str(P.get('precio')))
                pct = int(round((1 - pr / self.valor) * 100)) if self.valor else 0
            except Exception:
                pct = 0
            self.desc = None
            if 5 <= pct <= 95:
                c = Image.new('RGBA', (360, 360), (0, 0, 0, 0))
                d = ImageDraw.Draw(c)
                pts = []
                for k in range(32):
                    a = math.pi * 2 * k / 32
                    r = 176 if k % 2 == 0 else 150
                    pts.append((180 + r * math.cos(a), 180 + r * math.sin(a)))
                d.polygon(pts, fill=(239, 68, 68, 255))
                d.text((180, 150), f'{pct}%', font=ANTON(130), fill=(255, 255, 255, 255), anchor='mm')
                d.text((180, 240), 'DE DESCUENTO', font=MONT(30, 'Black'), fill=(255, 255, 255, 255), anchor='mm')
                self.desc = resplandor(c, (239, 68, 68, 255), 24, 0.7, 40)
            self.conf = Confeti([ac, self.ac2, (255, 255, 255)], 120, 3 + self.i)
        if tp == 'garantia':
            self.escudo = escudo(ac, self.ctx['producto'].get('garantia_dias') or 7)
        if tp == 'cta':
            f = MONT(62, 'Black')
            txt = (self.e.get('boton') or 'AGREGAR A MI COMPRA').upper()
            w = int(f.getlength(txt)) + 170
            b = pastilla(w, 150, tuple(ac[:3]) + (255,))
            ImageDraw.Draw(b).text((w / 2, 75), txt, font=f, fill=(10, 10, 14, 255), anchor='mm')
            self.boton = b
            fl = Image.new('RGBA', (130, 100), (0, 0, 0, 0))
            ImageDraw.Draw(fl).polygon([(10, 10), (120, 10), (65, 90)], fill=(255, 255, 255, 240))
            self.flecha = resplandor(fl, ac, 14, 0.7, 24)

    def X(self, x):
        """Espejo horizontal: en los sistemas con el mockup a la derecha todo el diseño se invierte."""
        return W - x if self.lado == 'der' else x

    def _chip(self, txt, color, oscuro=False):
        f = MONT(40, 'Black')
        w = int(f.getlength(txt)) + 70
        b = pastilla(w, 78, (14, 14, 22, 235) if oscuro else tuple(color[:3]) + (255,))
        d = ImageDraw.Draw(b)
        if oscuro:
            d.rounded_rectangle([0, 0, w - 1, 77], radius=39, outline=tuple(color[:3]) + (255,), width=4)
        d.text((w / 2, 39), txt, font=f, fill=tuple(color[:3]) + (255,) if oscuro else (10, 10, 14, 255), anchor='mm')
        return b

    def _frase(self, fr, t, x, y, t0=0.6):
        if self.frase is not None and t > t0:
            k = ease((t - t0) / 0.35)
            pegar(fr, self.frase, x, y + (1 - k) * 26, 1, k)

    def _badge(self, txt, color, check=False):
        f = MONT(44, 'Black')
        extra = 70 if check else 0
        w = int(f.getlength(txt)) + 90 + extra
        b = pastilla(w, 92, color)
        d = ImageDraw.Draw(b)
        if check:
            d.ellipse([22, 18, 78, 74], fill=(255, 255, 255, 255))
            d.line([(36, 47), (47, 58), (66, 34)], fill=tuple(color[:3]) + (255,), width=8, joint='curve')
        d.text((w / 2 + extra / 2, 46), txt, font=f, fill=(255, 255, 255, 255), anchor='mm')
        return b

    def fondo_frame(self, t, pulso):
        p = t / max(self.dur, 0.01)
        return self.fondo.frame(p, pulso) if self.fondo else self.grad.copy()

    def frame(self, t, pulso=0.0, motivos=None, tg=0.0):
        fr = self.fondo_frame(t, pulso)
        if motivos is not None:
            motivos.dibujar(fr, tg, pulso, self.tipo)
        tp, D = self.tipo, self.dur
        bob = math.sin(t * 2.0) * 9
        if tp == 'gancho':
            if self.tit:
                sh = self.est['shake'] * 10 * max(0, 1 - t / 0.45)
                self.tit.dibujar(fr, t, W / 2 + math.sin(t * 70) * sh, H / 2 - 70 + math.cos(t * 63) * sh, 0.02, 0.12, 0.28, 1.9)
            self._frase(fr, t, W / 2, H - 220, 0.8)
        elif tp == 'texto':
            if self.tit:
                self.tit.dibujar(fr, t, W / 2, H / 2 - 90, 0.1, 0.1, 0.35, 1.5)
            self._frase(fr, t, W / 2, H - 230, 0.9)
        elif tp == 'imagen':
            if self.tit:
                k = ease((t - 0.15) / 0.45)
                self.tit.dibujar(fr, t, W / 2, 230, 0.15, 0.08, 0.3, 1.35)
        elif tp == 'felicita':
            pegar(fr, self.rayo.rotate(t * 12, Image.BILINEAR), W / 2, H / 2 - 60, 1.0, 0.6 * min(1, t / 0.5))
            if self.tit:
                self.tit.dibujar(fr, t, W / 2, H / 2 - 130, 0.05, 0.12, 0.3, 1.8)
            if t > 0.55:
                kb = back((t - 0.55) / 0.45)
                pegar(fr, self.badge, W / 2, H / 2 + 110, 0.7 + 0.3 * kb, min(1, (t - 0.55) / 0.15))
            self._frase(fr, t, W / 2, H - 200, 0.9)
            self.conf.dibujar(fr, t - 0.15, W / 2, H / 2)
        elif tp == 'acceso':
            n = len(self.cards)
            cen = self.lado == 'centro'
            # zona de imágenes separada de la zona de texto
            x0, x1 = (260, W - 260) if cen else (70, 990)
            anchos = [c.width - 220 for c in self.cards]
            tot = sum(anchos)
            paso = min(1.0, (x1 - x0) / max(1, tot))
            x = (x0 + x1) / 2 - tot * paso / 2
            cy = 640 if cen else 560
            for j, c in enumerate(self.cards):
                cx = x + anchos[j] * paso / 2
                x += anchos[j] * paso
                t0 = 0.1 + j * 0.22
                if t > t0:
                    k = back((t - t0) / 0.5)
                    pegar(fr, c, self.X(cx), cy + math.sin(t * 1.8 + j) * 10 + (abs(j - (n - 1) / 2) * 26), 0.5 + 0.5 * k, min(1, (t - t0) / 0.2), (j - (n - 1) / 2) * -5)
            if cen:
                if self.tit:
                    self.tit.dibujar(fr, t, W / 2, 170, 0.5, 0.09, 0.3, 1.4)
                self._frase(fr, t, W / 2, H - 90, 1.0)
            else:
                if self.tit:
                    self.tit.dibujar(fr, t, self.X(1470), 430, 0.5, 0.09, 0.3, 1.4)
                self._frase(fr, t, self.X(1470), 720, 1.0)
        elif tp == 'desbloqueo':
            tu = min(1.3, D * 0.32)
            if t < tu + 0.4:
                ab = ease((t - tu + 0.25) / 0.3)
                esc = 1 + 0.06 * math.sin(t * 22) * (1 if t < tu - 0.2 else 0)
                pegar(fr, candado(ab, self.ac2), W / 2, H / 2 - 30, esc * (1 - ease((t - tu) / 0.4) * 0.6), 1 - ease((t - tu) / 0.4))
            if t >= tu - 0.05:
                k = t - tu
                pegar(fr, self.rayo.rotate(t * 18, Image.BILINEAR), W / 2, H / 2 - 30, 0.6 + 0.4 * ease(k / 0.5), min(1, k / 0.3))
                if self.card is not None:
                    pegar(fr, self.card, W / 2, H / 2 - 20 + bob, 0.5 + 0.5 * back(k / 0.55), min(1, k / 0.2), (1 - ease(k / 0.6)) * -12)
                if k < 0.3:
                    fr.paste(Image.new('RGB', (W, H), (255, 255, 255)), (0, 0), Image.new('L', (W, H), int(220 * (1 - k / 0.3))))
            if self.tit:
                self.tit.dibujar(fr, t, W / 2, 140, 0.1, 0.08, 0.3, 1.3)
            self._frase(fr, t, W / 2, H - 130, tu + 0.5)
        elif tp == 'elemento':
            cen = self.lado == 'centro'
            mxp, myp = (W / 2, 590) if cen else (self.X(520), H / 2 + 10)
            pegar(fr, self.rayo.rotate(t * 12, Image.BILINEAR), mxp, myp, 0.95, min(1, t / 0.4))
            if self.card is not None:
                k = back(t / 0.6)
                dx = 0 if cen else (-1 if self.lado == 'izq' else 1) * (1 - min(1, k)) * 240
                pegar(fr, self.card, mxp + dx, myp + bob, 0.6 + 0.4 * k, min(1, t / 0.2), (1 - ease(t / 0.7)) * -10)
            if cen:
                if self.tit:
                    self.tit.dibujar(fr, t, W / 2, 150, 0.35, 0.08, 0.3, 1.4)
                if self.chip is not None and t > 0.25:
                    pegar(fr, self.chip, 190, 150, 0.7 + 0.3 * back((t - 0.25) / 0.4), min(1, (t - 0.25) / 0.15))
                if self.chipv is not None and t > 1.2:
                    pegar(fr, self.chipv, W - 220, 150, 0.7 + 0.3 * back((t - 1.2) / 0.4), min(1, (t - 1.2) / 0.15))
                self._frase(fr, t, W / 2, H - 80, 0.9)
            else:
                tx = self.X(1460)
                if self.chip is not None and t > 0.25:
                    pegar(fr, self.chip, tx, 230, 0.7 + 0.3 * back((t - 0.25) / 0.4), min(1, (t - 0.25) / 0.15))
                if self.tit:
                    self.tit.dibujar(fr, t, tx, 440, 0.35, 0.08, 0.3, 1.4)
                self._frase(fr, t, tx, 700, 0.9)
                if self.chipv is not None and t > 1.2:
                    pegar(fr, self.chipv, tx, 880, 0.7 + 0.3 * back((t - 1.2) / 0.4), min(1, (t - 1.2) / 0.15))
        elif tp == 'ruta':
            if self.tit:
                self.tit.dibujar(fr, t, W / 2, 170, 0.0, 0.08, 0.3, 1.35)
            n = len(self.pasos)
            if n:
                x0, x1, y = 230, W - 230, 560
                ventana = max(1.0, D * 0.75)
                xs = [x0 + (x1 - x0) * j / max(1, n - 1) for j in range(n)]
                av = cl((t - 0.4) / ventana)
                d = ImageDraw.Draw(fr)
                d.line([(x0, y), (x1, y)], fill=(255, 255, 255), width=4)
                d.line([(x0, y), (x0 + (x1 - x0) * av, y)], fill=tuple(self.ac[:3]), width=14)
                for j, (c, lab) in enumerate(self.pasos):
                    t0 = 0.4 + ventana * j / n
                    if t < t0:
                        continue
                    k = back((t - t0) / 0.4)
                    pegar(fr, c, xs[j], y, 0.4 + 0.6 * k, min(1, (t - t0) / 0.15))
                    pegar(fr, lab, xs[j], y + 150 + (1 - min(1, k)) * 20, 1, min(1, (t - t0) / 0.25))
            self._frase(fr, t, W / 2, H - 150, D * 0.7)
        elif tp == 'etapas':
            if self.tit:
                self.tit.dibujar(fr, t, W / 2, 120, 0.0, 0.07, 0.28, 1.3)
            n = len(self.cols)
            xs = {1: [W / 2], 2: [W / 2 - 320, W / 2 + 320], 3: [340, W / 2, W - 340]}.get(n, [])
            for j, (im, x) in enumerate(zip(self.cols, xs)):
                t0 = 0.35 + j * max(0.9, D * 0.26)
                if t < t0:
                    continue
                k = back((t - t0) / 0.5)
                pegar(fr, im, x, 590 + (1 - min(1, k)) * 90, 1, min(1, (t - t0) / 0.25))
                if j < n - 1 and t > t0 + 0.5:
                    d = ImageDraw.Draw(fr)
                    ax = (x + xs[j + 1]) / 2
                    d.polygon([(ax - 18, 560), (ax + 20, 590), (ax - 18, 620)], fill=tuple(self.ac2[:3]))
        elif tp == 'producto':
            cen = self.lado == 'centro' or self.card is None
            cx, cy = (W / 2, 610) if cen else (self.X(500), H / 2 + 10)
            pegar(fr, self.rayo.rotate(t * 14, Image.BILINEAR), cx, cy, 0.85, min(1, t / 0.4))
            if self.card is not None:
                k = back(t / 0.6)
                pegar(fr, self.card, cx, cy + bob, 0.55 + 0.45 * k, min(1, t / 0.2), (1 - ease(t / 0.7)) * 10)
            if cen:
                if self.tit:
                    self.tit.dibujar(fr, t, W / 2, 160, 0.4, 0.09, 0.3, 1.45)
                self._frase(fr, t, W / 2, H - 80, 1.0)
            else:
                if self.tit:
                    self.tit.dibujar(fr, t, self.X(1460), H / 2 - 110, 0.4, 0.09, 0.3, 1.45)
                self._frase(fr, t, self.X(1460), H / 2 + 190, 1.0)
        elif tp in ('lista', 'valor'):
            cx_items = self.X(1250) if self.card is not None else W / 2
            if self.card is not None:
                k = back(t / 0.55)
                pegar(fr, self.card, self.X(360), 560 + bob, 0.6 + 0.4 * k, min(1, t / 0.2), -6 + 6 * ease(t / 0.6))
            if self.tit:
                self.tit.dibujar(fr, t, cx_items, 120, 0.0, 0.07, 0.28, 1.3)
            n = len(self.items)
            if n:
                h = self.items[0].height
                y0 = 210 if tp == 'valor' else 240
                paso = min(h + 16, (H - (300 if tp == 'valor' else 150) - y0) / n)
                ventana = max(0.6, D * (0.62 if tp == 'valor' else 0.8))
                acum = 0
                for j, im in enumerate(self.items):
                    t0 = 0.3 + ventana * j / n
                    if t < t0:
                        continue
                    k = back((t - t0) / 0.38)
                    acum += self.valores[j]
                    pegar(fr, im, cx_items + (1 - min(1, k)) * 260, y0 + paso * j + h / 2, 1, min(1, (t - t0) / 0.18))
                tt = 0.3 + ventana + 0.25
                if tp == 'valor' and t > tt and sum(self.valores):
                    k = ease((t - tt) / 0.7)
                    w = self.items[0].width
                    bar = pastilla(w, 116, tuple(self.ac[:3]) + (255,), 26)
                    d = ImageDraw.Draw(bar)
                    d.text((40, 58), 'VALOR TOTAL', font=MONT(46, 'Black'), fill=(10, 10, 14, 255), anchor='lm')
                    d.text((w - 36, 58), f'${sum(self.valores) * k:,.0f}', font=ANTON(84), fill=(10, 10, 14, 255), anchor='rm')
                    kb = back((t - tt) / 0.4)
                    pegar(fr, resplandor(bar, self.ac, 22, 0.7, 34), cx_items, H - 170, 0.7 + 0.3 * kb, min(1, (t - tt) / 0.15))
        elif tp == 'elementos':
            n = len(self.cards)
            if self.tit:
                self.tit.dibujar(fr, t, W / 2, 120, 0.0, 0.07, 0.28, 1.3)
            pos = {1: [(W / 2, 560)], 2: [(W / 2 - 430, 560), (W / 2 + 430, 560)], 3: [(W / 2 - 600, 570), (W / 2, 560), (W / 2 + 600, 570)],
                   4: [(W / 2 - 330, 410), (W / 2 + 330, 410), (W / 2 - 330, 760), (W / 2 + 330, 760)]}.get(n, [])
            for j, (c, (x, y)) in enumerate(zip(self.cards, pos)):
                t0 = 0.2 + j * min(0.55, D * 0.6 / max(1, n))
                k = back((t - t0) / 0.45)
                if t > t0:
                    pegar(fr, c, x, y + math.sin(t * 2 + j) * 8, 0.5 + 0.5 * k, min(1, (t - t0) / 0.18), (j % 2 * 2 - 1) * 4 * (1 - ease((t - t0) / 0.6)))
        elif tp == 'precio':
            ts = D * 0.45
            pegar(fr, self.rayo.rotate(t * 10, Image.BILINEAR), W / 2, 700, 0.9, 0.5 * min(1, t / 0.5) + 0.5 * (t > ts))
            if self.card is not None:
                pegar(fr, self.card, self.X(270), 660 + bob, 0.85 * back(t / 0.5), min(1, t / 0.2), -8)
            pegar(fr, caja_texto('VALOR DE REFERENCIA', MONT(46, 'Black'), 900, (255, 255, 255, 210)), W / 2, 170, 1, ease(t / 0.3))
            cuenta = self.valor * ease(t / 0.8) if self.valor else 0
            vt = f'${cuenta:,.0f}' if self.valor else (self.ctx['producto'].get('valor_txt') or '')
            vimg = caja_texto(vt, ANTON(150), 1200, (255, 255, 255, 235), 5)
            pegar(fr, vimg, W / 2, 300, 1, ease(t / 0.3))
            if t > 0.9:
                k = ease((t - 0.9) / 0.3)
                d = ImageDraw.Draw(fr)
                x0, x1 = W / 2 - vimg.width / 2 - 20, W / 2 + vimg.width / 2 + 20
                d.line([(x0, 330), (x0 + (x1 - x0) * k, 270)], fill=(239, 68, 68), width=18)
            if self.desc is not None and t > 1.5:
                kd = back((t - 1.5) / 0.45)
                pegar(fr, self.desc, self.X(1560), 330, 0.5 + 0.5 * kd, min(1, (t - 1.5) / 0.15), -12 + 4 * math.sin(t * 3))
            if t > ts - 0.5:
                et = caja_texto((self.e.get('etiqueta_precio') or 'HOY SOLO').upper(), MONT(50, 'Black'), 1200, tuple(self.ac2[:3]) + (255,))
                pegar(fr, et, W / 2, 500, 1, min(1, (t - ts + 0.5) / 0.3))
            if t > ts:
                k = t - ts
                pul = 1 + 0.035 * math.sin(k * 6) if k > 0.6 else 1
                sh = self.est['shake'] * 14 * max(0, 1 - k / 0.3)
                pegar(fr, self.precio, W / 2 + math.sin(k * 80) * sh, 730, (2.2 - 1.2 * ease(k / 0.28)) * pul, min(1, k / 0.1))
                if k < 0.22:
                    fr.paste(Image.new('RGB', (W, H), (255, 255, 255)), (0, 0), Image.new('L', (W, H), int(200 * (1 - k / 0.22))))
                self.conf.dibujar(fr, k, W / 2, 760)
        elif tp == 'garantia':
            k = back(t / 0.55)
            if self.lado == 'centro' or self.frase is None:
                pegar(fr, self.escudo, W / 2, 530, (0.5 + 0.5 * k) * 0.7, min(1, t / 0.25), (1 - ease(t / 0.6)) * 10)
                if self.tit:
                    self.tit.dibujar(fr, t, W / 2, 130, 0.3, 0.08, 0.3, 1.3)
                self._frase(fr, t, W / 2, H - 200, 0.8)
                if t > 1.3:
                    pegar(fr, self.sello, W / 2, H - 60, 0.8, min(1, (t - 1.3) / 0.15))
            else:
                pegar(fr, self.escudo, self.X(520), H / 2, 0.5 + 0.5 * k, min(1, t / 0.25), (1 - ease(t / 0.6)) * 10)
                tx = self.X(1440)
                if self.tit:
                    self.tit.dibujar(fr, t, tx, 330, 0.3, 0.08, 0.3, 1.3)
                self._frase(fr, t, tx, 600, 0.8)
                if t > 1.3:
                    if self.els:
                        pegar(fr, tarjeta(self.els[0], 420, 130, (255, 255, 255, 255)), tx, 860, 1, min(1, (t - 1.3) / 0.3))
                    else:
                        pegar(fr, self.sello, tx, 850, 0.7 + 0.3 * back((t - 1.3) / 0.4), min(1, (t - 1.3) / 0.15))
        elif tp == 'cta':
            bx = W / 2 + ((-190 if self.lado == 'der' else 190) if self.card is not None else 0)
            if self.card is not None:
                pegar(fr, self.card, self.X(300), 640 + bob, 0.8 * back(t / 0.5), min(1, t / 0.2), -8)
            if self.tit:
                self.tit.dibujar(fr, t, W / 2, 250, 0.0, 0.08, 0.3, 1.4)
            k = back((t - 0.35) / 0.45)
            pul = 1 + 0.045 * math.sin(t * 6)
            b = self.boton.copy()
            sx = ((t * 0.9) % 1.6 - 0.3) * b.width
            brillo = Image.new('RGBA', b.size, (0, 0, 0, 0))
            ImageDraw.Draw(brillo).polygon([(sx, 0), (sx + 70, 0), (sx - 10, b.height), (sx - 80, b.height)], fill=(255, 255, 255, 110))
            brillo.putalpha(Image.composite(brillo.getchannel('A'), Image.new('L', b.size, 0), b.getchannel('A')))
            b.alpha_composite(brillo)
            pegar(fr, resplandor(b, self.ac, 26, 0.8, 40), bx, 560, (0.6 + 0.4 * k) * pul, min(1, max(0, t - 0.35) / 0.2))
            for j, dx in enumerate((-280, 0, 280)):
                bb = abs(math.sin(t * 4.2 + j * 0.6)) * 38
                pegar(fr, self.flecha, bx + dx, 760 + bb, 1, min(1, max(0, t - 0.6) / 0.3))
        return fr


def transicion(tipo, prev, cur, k):
    if tipo == 'fade':
        return Image.blend(prev, cur, ease(k))
    if tipo == 'zoom':
        z = 1 + 0.25 * ease(k)
        pz = prev.resize((int(W * z), int(H * z)), Image.BILINEAR).crop((int((W * z - W) / 2), int((H * z - H) / 2), int((W * z - W) / 2) + W, int((H * z - H) / 2) + H))
        return Image.blend(pz, cur, ease(k))
    if tipo == 'whip':
        e = eio(k)
        out = Image.new('RGB', (W, H))
        out.paste(prev, (int(-W * e), 0))
        out.paste(cur, (int(W * (1 - e)), 0))
        blur = out.filter(ImageFilter.BoxBlur(18)) if 0.15 < k < 0.85 else out
        return blur
    if tipo == 'flash':
        base = cur if k > 0.35 else prev
        a = 1 - abs(k - 0.35) / 0.65 if k > 0.35 else k / 0.35
        return Image.blend(base, Image.new('RGB', (W, H), (255, 255, 255)), cl(a) * 0.85)
    return cur


def render(escenas, duraciones, ctx, audio, salida, bpm=None):
    est = ESTILOS.get(ctx.get('animacion') or 'neon', ESTILOS['neon'])
    ctx['estilo'] = est
    ctx['ac'] = hexrgb(est.get('ac') or ctx.get('acento'))
    ctx['ac2'] = hexrgb(est.get('ac2'))
    subs = Subtitulos(ctx['ac'])
    objs, bloques, t0 = [], [], 0.0
    for i, (e, d) in enumerate(zip(escenas, duraciones)):
        objs.append(Escena(e, d, ctx, i))
        bloques += subs.bloques(e.get('sub') or e.get('voz') or '', d - 0.15, t0 + 0.05)
        t0 += d
    total = t0
    part = Particulas(est['part'], [ctx['ac'], ctx['ac2'], (255, 255, 255, 255)], 30, 7) if est.get('part') else None
    mot = ctx.get('motivos') if ctx.get('motivos') is not None else est.get('motivos') or []
    if ctx.get('musical') is False:
        mot = [m for m in mot if m not in ('ecualizador', 'ondas')] or ['haces']
    motivos = Motivos(mot, ctx['ac'], ctx['ac2'], ctx.get('props'))
    vin = vineta()
    negro = Image.new('RGB', (W, H), (0, 0, 0))
    cmd = ['ffmpeg', '-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
           '-i', audio, '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-maxrate', '5000k', '-bufsize', '10000k',
           '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', salida]
    pr = subprocess.Popen(cmd, stdin=subprocess.PIPE)
    nfr = int(total * FPS)
    inicio = [sum(duraciones[:i]) for i in range(len(duraciones))]
    TR = 0.32
    ultimo = {}
    poster = None
    beat = 60.0 / bpm if (bpm and est['beat']) else None
    rnd = random.Random(11)
    for f in range(nfr):
        t = f / FPS
        i = max(j for j in range(len(objs)) if inicio[j] <= t)
        lt = t - inicio[i]
        pulso = 0.0
        if beat:
            ph = (t % beat) / beat
            pulso = 0.012 * math.exp(-ph * 7)
        fr = objs[i].frame(lt, pulso, motivos, t)
        if i > 0 and lt < TR and (i - 1) in ultimo:
            fr = transicion(est['trans'], ultimo[i - 1], fr, lt / TR)
        if part and (objs[i].tipo != 'precio' or lt < objs[i].dur * 0.4):
            part.dibujar(fr, t, 0.9)
        fr.paste(negro, (0, 0), vin)
        if est.get('flash') and beat and objs[i].tipo in ('gancho', 'producto', 'cta', 'desbloqueo', 'felicita'):
            ph = (t % (beat * 4)) / (beat * 4)
            if ph < 0.06:
                fr.paste(Image.new('RGB', (W, H), tuple(ctx['ac'][:3])), (0, 0), Image.new('L', (W, H), int(50 * (1 - ph / 0.06))))
        if ctx.get('subtitulos') and objs[i].tipo != 'precio':
            subs.dibujar(fr, bloques, t, H - 105 - (70 if est.get('barras') else 0))
        if est.get('barras'):
            d = ImageDraw.Draw(fr)
            d.rectangle([0, 0, W, 70], fill=(0, 0, 0))
            d.rectangle([0, H - 70, W, H], fill=(0, 0, 0))
        if est.get('grano') and f % 2 == 0:
            g = Image.effect_noise((W // 4, H // 4), 40).resize((W, H), Image.NEAREST)
            fr = Image.blend(fr, Image.merge('RGB', (g, g, g)), 0.05)
        if lt >= objs[i].dur - 1.5 / FPS:
            ultimo[i] = fr.copy()
        if poster is None and objs[i].tipo == 'precio' and lt > objs[i].dur * 0.75:
            poster = fr.copy()
        pr.stdin.write(fr.tobytes())
    pr.stdin.close()
    if pr.wait() != 0:
        raise RuntimeError('ffmpeg falló al armar el video')
    return total, poster
