# Estilo final: "Compra confirmada · Azul Rey" (variación k1 aprobada por Christian), últimas correcciones del 15 nov 2026.
# 10 versiones del MISMO diseño: cambian fondo (azules y morados oscuros con degradado), animaciones de fondo
# (siempre con ondas o barras de audio), transición, entrada del texto, adorno de imagen y música (Mixkit, licencia gratuita).
# Fijo en todas: voz em_alex al 1.15x, guion de k1, orden de escenas (alumnos en la escena 2), Montserrat, acento en bloque,
# mockups del juego 5, precio que baja contando de $120 a $12, garantía con calendario del 1 al 7, sin tarjetas encima de imágenes.
from estilo_compra import (confirmada, adquiriste, escalera, recorrido, porque, revela, tools, TA, todas, precio, exclusiva, inversion,
                           multitud, garantia, cta, fija_set)

def guion():
    return fija_set([
        confirmada('¡Felicidades! Tu compra de DJ Profesional está confirmada. Gracias por confiar en nosotros.'),
        multitud('Y desde hoy eres parte de un club de más de siete mil quinientos noventa y tres alumnos que ya confiaron en nosotros.'),
        adquiriste(), escalera(), recorrido(), porque(), revela(), *tools(TA), todas(),
        precio('contador'), exclusiva(), inversion(), garantia('calendario'), cta()], 5)

def club(e):  # textos de la escena de alumnos como "club"
    for s in e:
        if s['c'] == 'multitud':
            s['k'] = 'Bienvenido al club'; s['t'] = 'alumnos ya confiaron *en nosotros*'
    return e

TXT = dict(ink='#eef1ff', mut='#aab2dc', sobre='#ffffff')
def pal(bg, a, b, c, sup): return dict(bg=bg, a=a, b=b, c=c, sup=sup, **TXT)
BASE = dict(ft='Montserrat', fw=900, ls='-.045em', fb='Montserrat', acento='marca', voz='em_alex', vel=1.06, ritmo=1.15, set=5)

V = []
def var(n, nombre, cambia, musica, pal_, grad, fondo, trans, texto, deco):
    e = dict(BASE); e.update(pal=pal_, grad=grad, fondo=fondo, trans=trans, texto=texto, deco=deco, musica=musica)
    V.append(dict(id='f%02d' % n, titulo='Azul Rey · ' + nombre, cambia=cambia, estilo=e, escenas=club(guion())))

var(1, 'noche azul', 'Fondo azul noche con luz azul rey. Halo de luz + ondas de audio. Giro 3D entre escenas (como el original). Música: Pop (EDM motivacional).',
    'musica/pop.mp3', pal('#0b1036', '#3d6bff', '#ffc400', '#ffd23f', '#16205a'), 'radial-gradient(1300px 800px at 75% 0%,#1d2f8f 0%,#0b1036 62%)', ['halo', 'ondas'], 'giro', 'cae', 'disco')
var(2, 'índigo y violeta', 'Degradado índigo a violeta. Partículas + barras de ecualizador. Acercamiento entre escenas. Música: Summer Dream (EDM enérgico).',
    'musica/summer-dream.mp3', pal('#120c2e', '#7c5cff', '#ff4fd8', '#ffd166', '#1f1650'), 'linear-gradient(150deg,#1b1450 0%,#120c2e 50%,#2a0f45 100%)', ['particulas', 'barras'], 'zoom', 'cae', 'aro')
var(3, 'petróleo y morado', 'Azul petróleo que pasa a morado. Haces de luz de escenario + ondas. Escenas que entran empujando. Música: House Fest (house potente).',
    'musica/house-fest.mp3', pal('#0a1a2f', '#2e8bff', '#9b6bff', '#ffe066', '#13294a'), 'linear-gradient(160deg,#0f2d4f 0%,#0a1a2f 45%,#1d1240 100%)', ['luces', 'ondas'], 'empuje', 'sube', 'ondas')
var(4, 'aurora', 'Medianoche con aurora morada y azul. Círculos que se abren + barras de audio. Escenas que suben. Música: Gear (house con ritmo constante).',
    'musica/gear.mp3', pal('#0d0f2b', '#5b8cff', '#b06bff', '#ffd23f', '#191c4a'), 'radial-gradient(1000px 700px at 15% 0%,#3b1d7a 0%,transparent 60%),radial-gradient(1000px 700px at 90% 100%,#0e3a6e 0%,transparent 60%),#0d0f2b', ['circulos', 'barras'], 'sube', 'escala', 'pedestal')
var(5, 'morado profundo', 'Morado profundo con acento lila. Disco de vinilo girando + ondas. Desenfoque elegante entre escenas. Música: Savana (EDM positivo).',
    'musica/savana.mp3', pal('#1a0b2e', '#9b5cff', '#22d3ee', '#fde047', '#2a1450'), 'linear-gradient(155deg,#2d1060 0%,#1a0b2e 60%,#120826 100%)', ['vinilo', 'ondas'], 'desenfoque', 'desenfoque', 'disco')
var(6, 'cobalto', 'Azul cobalto. Rejilla de escenario en perspectiva + barras de audio. Cortina en barrido. Música: Deep Techno (techno con energía).',
    'musica/deep-techno.mp3', pal('#071a3d', '#3d8bff', '#ff7ad9', '#ffcf33', '#0d2a5e'), 'linear-gradient(170deg,#0d2f6e 0%,#071a3d 70%)', ['rejilla', 'barras'], 'barrido', 'gira', 'sol')
var(7, 'ciruela y azul', 'Ciruela con azul. Puntos que laten + ondas de audio. Giro 3D. Música: Karma (EDM con fuerza).',
    'musica/karma.mp3', pal('#160f33', '#6d7dff', '#ff6b9a', '#ffd166', '#241a55'), 'linear-gradient(140deg,#251a5c 0%,#160f33 50%,#0d2350 100%)', ['puntos', 'ondas'], 'giro', 'cae', 'aro')
var(8, 'noche eléctrica', 'Azul eléctrico al centro. Rombos que giran + barras de audio. Fundido limpio. Música: Talent in the Air (house melódico).',
    'musica/talent-in-the-air.mp3', pal('#0c0a24', '#3b82f6', '#8b5cf6', '#facc15', '#18164a'), 'radial-gradient(1100px 800px at 50% 40%,#1f1b6b 0%,#0c0a24 70%)', ['rombos', 'barras'], 'fundido', 'lado', 'disco')
var(9, 'violeta diagonal', 'Diagonal de violeta a azul. Halo de luz + barras de ecualizador. Acercamiento. Música: B.O.R.N (EDM con empuje).',
    'musica/b-o-r-n.mp3', pal('#120f2a', '#8b7bff', '#38bdf8', '#fde68a', '#1e1a4e'), 'linear-gradient(120deg,#1e1b5e 0%,#120f2a 50%,#3a1660 100%)', ['halo', 'barras'], 'zoom', 'sube', 'ondas')
var(10, 'marino y magenta', 'Azul marino con toque magenta. Luces de escenario + ondas + partículas. Giro 3D. Música: Expressive Courage (EDM motivacional).',
    'musica/expressive-courage.mp3', pal('#0b1430', '#2f6bff', '#e14bff', '#ffd23f', '#152555'), 'linear-gradient(160deg,#122560 0%,#0b1430 55%,#3a0f4a 100%)', ['luces', 'ondas', 'particulas'], 'giro', 'cae', 'pedestal')

# Correcciones de Christian por versión
V[4]['estilo']['ritmo'] = 1.10  # f05 morado profundo: "bájale solo la velocidad a 1.10" (15 nov, 16:59)

VIDEOS = V
