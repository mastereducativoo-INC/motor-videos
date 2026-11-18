# Estilo aprobado "Compra confirmada": 5 variaciones con las correcciones de Christian (15 nov 2026).
# Cada variación: su voz, su juego de mockups, colores, tipografía, transiciones, ritmo y presentación.
# Recorrido: compra confirmada → lo que ya tienes → aprender y practicar → complementar (clientes, cobrar, crecer)
# → desbloqueaste el Súper Pack por $12 → las 7 herramientas → garantía y oferta especial. Sin la palabra "Hotmart".
import os
ASSETS = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'assets', 'dj')
def img(n, alt):  # imagen nueva de los trabajadores si ya llegó; si no, la de la galería
    return n if os.path.exists(os.path.join(ASSETS, n + '.png')) else alt
def bg(n, alt): return n if os.path.exists(os.path.join(ASSETS, n + '.jpg')) else alt

def S(c, voz=None, **k):
    d = dict(c=c, **k)
    if voz: d['voz'] = voz
    return d

SUB = ['La noche ordenada, de principio a fin.', 'Qué hacer si algo falla.', 'Revisas todo antes de tocar.', 'Recursos listos para tu set.', 'Decide qué sigue según la gente.',
       'Qué hacer cada día antes del evento.', 'Textos listos para hablar con clientes.']
TA = ['Guiones completos de evento: así se ve tu noche, ordenada de principio a fin.', 'Kit de emergencia en vivo, por si algo falla.', 'Checklist profesional: revisas todo antes de tocar.',
      'Intros, cortes y transiciones, listos para tu set.', 'Sistema para leer la pista: decides qué sigue según la gente.', 'Plan de preparación en siete días.',
      'Y mensajes para conseguir y cerrar eventos: así le respondes a un cliente.']
TB = ['Con los guiones de evento, llegas con la noche organizada.', 'Si algo falla en vivo, tienes el kit de emergencia.', 'Antes de tocar, repasas el checklist.',
      'Tienes intros, cortes y transiciones listos.', 'El sistema para leer la pista te ayuda a decidir qué poner.', 'El plan de siete días te dice qué hacer cada día.',
      'Y con los mensajes para cerrar eventos, sabes qué responderle a un cliente.']
def tools(T, dz=.74): return [S('tool2', T[i], i=i, s=SUB[i], dz=dz) for i in range(7)]

def confirmada(v): return S('felicita', v, t='¡Compra *confirmada!*', s='Gracias por confiar en nosotros.')
def adquiriste(v='Esto es todo lo que acabas de adquirir: cuatro módulos completos, para aprender desde conectar tu equipo hasta crear tus propios remixes. Y tu certificado.'):
    return S('gracias', v, k='DJ Profesional', t='Esto ya *es tuyo*', s='Todo lo que acabas de adquirir.')
ESC = 'Con tu curso vas a aprender y a practicar. Esa es la base de todo DJ. Y cuando estés listo para dar el siguiente paso, vienen tres más: conseguir clientes, cobrar por tus eventos y crecer.'
def escalera(v=ESC, pt=(.12, .22, .58, .67, .76)):
    return S('escalera', v, t='Tu *siguiente escalón*', pasoT=list(pt),
             imgs=[[img('j_estudia', 'j_practica'), 250], [img('j_practica', 'j_practica'), 250], [img('j_celular', 'j_ref'), 262], [img('j_trato', 'j_ref'), 262], [img('j_feliz', 'j_ref'), 262]])
REC = 'Imagina el recorrido: aprendes en casa, te preparas para tu primer evento, un cliente te escribe… y cobras por tu trabajo.'
def recorrido(v=REC):
    return S('recorrido', v, t='De tu casa *a tu primer evento*', pt=[.1, .3, .5, .7], pasos=[
        dict(img=img('j_estudia', 'j_practica'), bg='f_cuarto', t='Aprendes en casa', h=360),
        dict(img='c5_' + '{set}', t='Te preparas', h=360),
        dict(img=img('j_celular', 'c6_5'), t='Un cliente te escribe', h=380),
        dict(img=img('j_cabina', 'j_practica'), bg=bg('f_salon', 'f_evento'), t='Cobras por tu evento', h=360)])
def porque(v='Y como confiaste en nosotros, tu compra desbloqueó una oferta especial.'): return S('porque', v, t='Por confiar en nosotros, *desbloqueaste esta oferta*')
def revela(v='El Súper Pack DJ: un complemento para llevar lo que aprendes a eventos reales: conseguir clientes, preparar tus eventos y cobrar por tu servicio.'):
    return S('revela', v, k='Oferta desbloqueada', t='Súper Pack DJ', s='Listo para *cualquier evento.*')
def todas(v='Siete herramientas en un solo pack, con un valor de referencia de ciento veinte dólares.'): return S('todas', v, t='Las 7 herramientas, *juntas*')
PRE = 'Por haber comprado DJ Profesional, tienes noventa por ciento de descuento. El pack tiene un valor de ciento veinte dólares… y hoy lo llevas por solo doce.'
def precio(forma, v=PRE): return S('precio', v, forma=forma, k='Tu precio por confiar en nosotros')
def exclusiva(v='Este precio solo existe en esta página, justo después de tu compra. Si sales de esta página, podrías no volver a verlo.'):
    return S('exclusiva', v, k='Beneficio exclusivo', t='Solo aparece *en esta página*', s='Justo después de tu compra.')
INV = 'Y piénsalo así: con un solo evento que consigas, esos doce dólares ya se pagaron.'
def inversion(v=INV): return S('inversion', v, t='Un solo evento *y tu inversión ya se pagó*', s='Lo demás es para seguir creciendo.')
def multitud(v='Y no estás solo: más de siete mil quinientos noventa y tres alumnos ya han confiado en nosotros.'): return S('multitud', v, t='alumnos ya han confiado *en nosotros*')
GAR = 'Además, tienes siete días de garantía. Si el pack no te convence, pides la devolución de tu dinero. Sin riesgo.'
def garantia(forma='escudo2', v=GAR): return S('garantia', v, forma=forma, k='Garantía', t='Pruébalo *7 días*', s='Si no te convence, te devolvemos tu dinero.')
CTA = 'Ya tienes tu curso para aprender. Ahora suma las siete herramientas para conseguir clientes y preparar tus eventos. Haz clic en el botón de aquí abajo y llévate el Súper Pack DJ por solo doce dólares.'
def cta(t='Complementa tu curso *hoy*', v=CTA): return S('cta2', v, t=t)

def fija_set(escenas, n):
    for e in escenas:
        for p in e.get('pasos', []):
            p['img'] = p['img'].replace('{set}', str(n))
    return escenas

V = []
def var(id, titulo, cambia, estilo, escenas): V.append(dict(id=id, titulo=titulo, cambia=cambia, estilo=estilo, escenas=fija_set(escenas, estilo.get('set', 5))))

var('k1', 'Compra · azul rey', 'Voz 1 (masculina, la original). Blanco con azul rey, mockups del juego 5, tarjetas que giran en 3D, palabras que caen.',
    dict(claro=1, pal=dict(bg='#ffffff', ink='#0c1440', mut='#5b6390', a='#1437e6', b='#ffc400', c='#1437e6', sobre='#ffffff', sup='#eef1ff'), grad='linear-gradient(160deg,#ffffff 0%,#eef2ff 100%)',
         ft='Montserrat', fw=900, ls='-.045em', fb='Montserrat', texto='cae', acento='marca', fondo='circulos', trans='giro', deco='disco', musica='pop', voz='em_alex', vel=1.06, set=5), [
    confirmada('¡Felicidades! Tu compra de DJ Profesional está confirmada. Gracias por confiar en nosotros.'), adquiriste(), escalera(), recorrido(), porque(), revela(),
    *tools(TA), todas(), precio('giro'), exclusiva(), inversion(), multitud(), garantia(), cta()])

var('k2', 'Compra · crema y verde', 'Voz 3 (femenina, Kokoro). Crema con verde bosque y dorado, títulos con serif elegante, entradas con desenfoque, mockups del juego 1.',
    dict(claro=1, pal=dict(bg='#f6f1e7', ink='#1c2a22', mut='#6b6a5c', a='#1f7a55', b='#d9a441', c='#1f7a55', sobre='#f6f1e7', sup='#ece4d3'), grad='radial-gradient(1200px 700px at 80% 0%,#fffaf0 0%,#f6f1e7 60%,#efe6d4 100%)',
         ft='Playfair', fw=700, ls='-.02em', fk='Playfair', fkw=500, fb='DMSans', texto='desenfoque', acento='italica', fondo='papel', trans='desenfoque', deco='pedestal', musica='calma', voz='ef_dora', vel=1.04, set=1), [
    confirmada('¡Listo! Tu compra de DJ Profesional está confirmada. Gracias por confiar en nosotros.'), adquiriste(), escalera(), recorrido(), porque(), revela(),
    *tools(TB), todas(), multitud(), precio('aro'), exclusiva(), inversion(), garantia(), cta('Tu siguiente paso, *hoy*')])

var('k3', 'Compra · lavanda', 'Voz 2 (masculina grave, Kokoro). Lavanda con violeta y rosa, letra por letra, acercamientos, mockups del juego 2. La comunidad de alumnos aparece al principio.',
    dict(claro=1, pal=dict(bg='#f1edff', ink='#24164f', mut='#6a5f95', a='#6b3df5', b='#ff5fa2', c='#6b3df5', sobre='#ffffff', sup='#e6dfff'), grad='linear-gradient(150deg,#f6f3ff 0%,#ebe4ff 55%,#fde8f2 100%)',
         ft='Outfit', fw=800, ls='-.04em', fb='Outfit', texto='letra', acento='color', fondo='puntos', trans='zoom', deco='disco', musica='pop', voz='em_santa', vel=1.06, set=2), [
    confirmada('¡Bienvenido! Tu compra de DJ Profesional está confirmada. Gracias por tu confianza.'), multitud('Ya eres parte de una comunidad de más de siete mil quinientos noventa y tres alumnos.'),
    adquiriste(), escalera(), recorrido(), porque(), revela(), *tools(TA), todas(), precio('contador'), exclusiva(), inversion(), garantia(), cta()])

var('k4', 'Compra · noche azul', 'Voz 5 (femenina, acento mexicano, Piper). Versión oscura: azul noche con celeste, haces de luz, escenas que entran empujando, mockups del juego 3.',
    dict(pal=dict(bg='#0b1230', ink='#eef2ff', mut='#9aa6d1', a='#4f8dff', b='#7ef0ff', c='#ffd166', sobre='#0b1230'), grad='radial-gradient(1200px 700px at 50% 0%,#18245c 0%,#0b1230 70%)',
         ft='Manrope', fw=800, ls='-.045em', fb='Manrope', texto='sube', acento='subraya', fondo='luces', trans='empuje', deco='aro', musica='house', voz='es_MX-claude-high', vel=1.0, set=3), [
    confirmada('¡Felicidades! Tu compra de DJ Profesional está confirmada. Gracias por confiar en nosotros.'), adquiriste(), escalera(), recorrido(), porque(), revela(),
    *tools(TB), todas(), precio('tachado'), inversion(), exclusiva(), multitud(), garantia(), cta('Llega preparado a *tu primer evento*')])

var('k5', 'Compra · perla y coral', 'Voz 4 (masculina, acento mexicano, Piper). Gris perla con coral, letra técnica, cortinas en barrido, ritmo más ágil, mockups del juego 4.',
    dict(claro=1, pal=dict(bg='#f4f4f2', ink='#1d1d1f', mut='#66666b', a='#ff5a36', b='#2f2f33', c='#ff5a36', sobre='#ffffff', sup='#e8e8e5'), grad='linear-gradient(160deg,#fafaf8 0%,#ecece8 100%)',
         ft='SpaceG', fw=700, ls='-.045em', fb='DMSans', texto='lado', acento='marca', fondo='rombos', trans='barrido', deco='bloque', musica='energia', voz='es_MX-ald-medium', vel=1.05, set=4), [
    confirmada('¡Compra confirmada! Gracias por confiar en nosotros.'), adquiriste('Esto ya es tuyo: los cuatro módulos de DJ Profesional y tu certificado.'),
    escalera('Con tu curso aprendes y practicas. Después vienen tres pasos más: conseguir clientes, cobrar y crecer.', (.1, .22, .5, .62, .74)),
    recorrido(), porque(), revela('El Súper Pack DJ: herramientas para conseguir clientes, preparar tus eventos y cobrar.'), *tools(TB, .7), todas(),
    precio('giro', 'Valor: ciento veinte dólares. Por tu compra, noventa por ciento de descuento: solo doce dólares.'), inversion(), exclusiva(), multitud(), garantia(), cta('Súmalo *a tu curso*')])

VIDEOS = V
