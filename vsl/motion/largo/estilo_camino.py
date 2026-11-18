# Estilo aprobado "El camino del DJ": 5 variaciones con las correcciones de Christian (15 nov 2026).
# Misma voz (em_alex). Cambian colores, transiciones, ritmo, orden y presentación de escenas.
# Sin la palabra "Hotmart". Datos aprobados: $12, valor $120, 90 %, 7 días de garantía, 7 contenidos, +7,593 alumnos.
def S(c, voz=None, **k):
    d = dict(c=c, **k)
    if voz: d['voz'] = voz
    return d

TA = ['Guiones completos de evento: tu noche ordenada de principio a fin.', 'Kit de emergencia en vivo: qué hacer si algo falla.', 'Checklist profesional: revisas todo antes de tocar.',
      'Pack de intros, cortes y transiciones, listos para tu set.', 'Sistema para leer la pista: decides qué sigue según la gente.', 'Plan de preparación en siete días: sabes qué hacer cada día.',
      'Y mensajes para conseguir y cerrar eventos: textos listos para hablar con tus clientes.']
TB = ['Con los guiones de evento llegas con la noche ya organizada.', 'Si algo falla en vivo, tienes el kit de emergencia.', 'Antes de tocar, repasas el checklist profesional.',
      'Tienes intros, cortes y transiciones listos para usar.', 'Con el sistema para leer la pista sabes qué poner después.', 'El plan de siete días te dice qué hacer cada día antes del evento.',
      'Y con los mensajes para cerrar eventos sabes qué responderle a un cliente.']
TC = ['Guiones de evento: la noche, ordenada.', 'Kit de emergencia: por si algo falla.', 'Checklist: todo revisado.', 'Intros, cortes y transiciones.', 'Leer la pista: decide qué sigue.',
      'Plan de siete días.', 'Y mensajes para cerrar eventos.']
SUB = ['La noche ordenada, de principio a fin.', 'Qué hacer si algo falla.', 'Revisas todo antes de tocar.', 'Recursos listos para tu set.', 'Decide qué sigue según la gente.',
       'Qué hacer cada día antes del evento.', 'Textos listos para hablar con clientes.']
def tools(T, dz=.74): return [S('tool2', T[i], i=i, s=SUB[i], dz=dz) for i in range(7)]

def gracias(v): return S('gracias', v, k='DJ Profesional · compra confirmada', t='¡Gracias por *confiar en nosotros!*', s='Esto ya es tuyo.')
ESC = 'Así se ve el camino de un DJ. Con tu curso vas a aprender y a practicar. Los siguientes pasos son conseguir clientes, cobrar por tus eventos y crecer. Y para esos pasos, preparamos algo especial para ti.'
def escalera(v=ESC, pt=(.26, .35, .55, .64, .73)): return S('escalera', v, t='El camino *de un DJ*', pasoT=list(pt))
def producto(v='Por tu compra desbloqueaste el Súper Pack DJ: siete herramientas para llevar lo que aprendes a eventos reales.'):
    return S('producto', v, k='Desbloqueado por tu compra', t='Súper Pack DJ', s='Listo para *cualquier evento.*')
def todas(v='Siete herramientas en un solo pack. Por separado, tienen un valor de ciento veinte dólares.'): return S('todas', v, t='Las 7 herramientas, *en un solo pack*')
def etapas(v='Ya tienes el curso para aprender y practicar. Ahora puedes sumar las siete herramientas, para llegar más preparado a tus eventos, conseguir clientes y cobrar por tu servicio.'):
    return S('etapas2', v, t='Tu *siguiente paso*')
def alumnos(v='Y no estás solo: más de siete mil quinientos noventa y tres alumnos ya han confiado en nosotros.'): return S('alumnos', v, k='Más de', t='alumnos ya han confiado *en nosotros*')
def porque(v='Y como confiaste en nosotros con DJ Profesional, tienes acceso a una oferta especial.'): return S('porque', v, t='Por confiar en nosotros, *desbloqueaste esta oferta*')
PRE = 'El Súper Pack DJ tiene un valor de ciento veinte dólares. Por tu compra tienes noventa por ciento de descuento. Hoy lo llevas por solo doce dólares.'
def precio(forma, v=PRE): return S('precio', v, forma=forma, k='Por tu compra de DJ Profesional')
INV = 'Piénsalo así: si con estas herramientas consigues un solo evento, esos doce dólares ya se pagaron. Y cada evento después de ese, es para seguir creciendo.'
def inversion(v=INV): return S('inversion', v, t='Un solo evento *y tu inversión ya se pagó*', s='Cada evento después de ese es para seguir creciendo.')
def exclusiva(v='Esta oferta solo aparece aquí, justo después de tu compra. Si sales de esta página, podrías no volver a verla.'):
    return S('exclusiva', v, k='Oferta exclusiva', t='Solo aparece *en esta página*', s='Justo después de tu compra.')
GAR = 'Y lo pruebas sin riesgo: tienes siete días de garantía. Si no te convence, pides la devolución de tu dinero. Así de sencillo.'
def garantia(forma, v=GAR): return S('garantia', v, forma=forma, k='Garantía', t='Pruébalo *7 días*', s='Si no te convence, te devolvemos tu dinero.')
CTA = 'Haz clic en el botón de aquí abajo y agrega el Súper Pack DJ a tu compra por solo doce dólares.'
def cta(t='Da tu *siguiente paso*', v=CTA): return S('cta', v, t=t)

BASE = dict(ft='Bricolage', fw=800, fb='DMSans', voz='em_alex', musica='pop')
def est(**k): d = dict(BASE); d.update(k); return d

V = []
def var(id, titulo, cambia, estilo, escenas): V.append(dict(id=id, titulo=titulo, cambia=cambia, estilo=estilo, escenas=escenas))

var('c1', 'Camino · original mejorado', 'Colores del original (vino y naranja), acercamiento entre escenas, ritmo normal. Orden: gracias → camino → pack → 7 herramientas → valor → siguiente paso → alumnos → precio.',
    est(pal=dict(bg='#2a0f1f', ink='#fff1e6', mut='#dcb6a6', a='#ffb347', b='#ff6a2b', c='#ffd98a', sobre='#2a0f1f'), grad='linear-gradient(160deg,#3d1226 0%,#2a0f1f 45%,#5a1f14 100%)',
        texto='desenfoque', acento='subraya', fondo='halo', trans='zoom', deco='ondas', vel=1.06), [
    gracias('¡Felicidades, y gracias por confiar en nosotros! Tu curso DJ Profesional ya es tuyo: cuatro módulos completos y tu certificado.'),
    escalera(), producto(), *tools(TA), todas(), etapas(), alumnos(), porque(), precio('tachado'), inversion(), exclusiva(), garantia('escudo'), cta()])

var('c2', 'Camino · noche y ámbar', 'Azul noche con ámbar, escenas que entran empujando, ritmo un poco más ágil. La confianza (alumnos) va al principio; el siguiente paso va justo antes del cierre.',
    est(pal=dict(bg='#0f1024', ink='#f3f1ff', mut='#a9a7c9', a='#ffb020', b='#5b7cfa', c='#ffd166', sobre='#0f1024'), grad='radial-gradient(1200px 700px at 50% 0%,#1b1f4a 0%,#0f1024 70%)',
        texto='sube', acento='subraya', fondo='luces', trans='empuje', deco='aro', vel=1.08), [
    gracias('¡Listo, tu compra está confirmada! Gracias por confiar en nosotros. Ya tienes DJ Profesional: cuatro módulos y tu certificado.'),
    alumnos('Te unes a una comunidad de más de siete mil quinientos noventa y tres alumnos que ya confiaron en nosotros.'),
    escalera(), producto('Y por tu compra, desbloqueaste el Súper Pack DJ: las herramientas para los siguientes pasos.'), *tools(TB), todas(),
    porque(), precio('aro'), inversion(), etapas(), exclusiva(), garantia('aro'), cta('Llega preparado a *tu próximo evento*')])

var('c3', 'Camino · ciruela y coral', 'Ciruela con coral, cortinas en barrido, textos que entran de lado. Muestra el siguiente paso al inicio, como mapa de todo el video; el precio sube como contador.',
    est(pal=dict(bg='#231033', ink='#fff0f3', mut='#d2b3cf', a='#ff7a59', b='#c58cff', c='#ffc6a8', sobre='#231033'), grad='linear-gradient(150deg,#2e1342 0%,#231033 55%,#3a1430 100%)',
        texto='lado', acento='color', fondo='ondas', trans='barrido', deco='pedestal', vel=1.06), [
    gracias('¡Bienvenido a DJ Profesional! Gracias por tu confianza. Con tus cuatro módulos vas a aprender a conectar tu equipo, mezclar, armar tus sets y crear remixes.'),
    escalera(), etapas('Piénsalo en tres etapas: lo que ya compraste, lo que puedes sumar hoy, y lo que puedes construir con las dos cosas juntas.'),
    producto(), *tools(TA), todas(), alumnos(), porque(), precio('contador'), inversion(), exclusiva(), garantia('calendario'), cta('Suma las *7 herramientas*')])

var('c4', 'Camino · grafito y oro', 'Negro grafito con dorado, acentos en cursiva, transiciones con desenfoque y ritmo más pausado (más premium). El precio se revela con una tarjeta que gira.',
    est(pal=dict(bg='#121110', ink='#f6efe2', mut='#b3a993', a='#e6b35a', b='#9c7a3c', c='#f3d08a', sobre='#121110'), grad='radial-gradient(1100px 700px at 70% 30%,#24201a 0%,#121110 70%)',
        fk='Fraunces', fkw=500, texto='desenfoque', acento='italica', fondo='vinilo', trans='desenfoque', deco='pedestal', vel=1.02, musica='calma'), [
    gracias('¡Felicidades por tu compra, y gracias por confiar en nosotros! DJ Profesional ya es tuyo: cuatro módulos y tu certificado.'),
    escalera(), producto(), *tools(TB), todas(), porque(), precio('giro'), inversion(), alumnos(), etapas(), exclusiva(), garantia('escudo'), cta('Tu siguiente paso, *hoy*')])

var('c5', 'Camino · ritmo rápido', 'Verde petróleo con naranja, cortes secos, palabras que golpean y textos más cortos: la versión más breve de las cinco.',
    est(pal=dict(bg='#06201f', ink='#eafffa', mut='#94c2bb', a='#ff9f43', b='#2fd3c6', c='#ffd28a', sobre='#06201f'), grad='linear-gradient(160deg,#0a2b2a 0%,#06201f 60%)',
        texto='escala', acento='marca', fondo='barras', trans='corte', deco='ondas', vel=1.12, musica='energia'), [
    gracias('¡Felicidades y gracias por confiar en nosotros! DJ Profesional ya es tuyo.'),
    escalera('El camino de un DJ: con tu curso aprendes y practicas. Después vienen los clientes, cobrar y crecer. Para eso es esto.', (.24, .33, .5, .6, .7)),
    producto('Desbloqueaste el Súper Pack DJ: siete herramientas.'), *tools(TC, .7), todas('Siete herramientas, ciento veinte dólares de valor.'),
    alumnos('Más de siete mil quinientos noventa y tres alumnos ya confiaron en nosotros.'),
    precio('tachado', 'Valor: ciento veinte dólares. Por tu compra, noventa por ciento menos: solo doce dólares.'),
    inversion('Con un solo evento que consigas, esos doce dólares ya se pagaron.'),
    etapas('Ya tienes el curso. Suma las herramientas y llega más preparado a tus eventos.'),
    exclusiva('Solo aparece aquí. Si sales de esta página, podrías no volver a verla.'),
    garantia('aro', 'Y tienes siete días de garantía. Si no te convence, te devolvemos tu dinero.'), cta('Agrégalo *ahora*', 'Haz clic en el botón de abajo y agrégalo por doce dólares.')])

VIDEOS = V
