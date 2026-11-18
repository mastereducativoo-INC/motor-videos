# Los 20 videos completos del Súper Pack DJ. Solo datos aprobados: $12, valor $120 (90 %), 7 días de garantía (Hotmart),
# 7 contenidos con sus valores, "solo en esta página", acceso inmediato y de por vida, +7,593 alumnos (dato de Christian).
def S(c, voz=None, **k):
    d = dict(c=c, **k)
    if voz: d['voz'] = voz
    return d

TV = {  # lo que dice la voz de cada herramienta (variantes)
    0: ['Guiones completos de evento: la noche ordenada de principio a fin, para que no improvises.', 'Primero, los guiones completos de evento. Llegas con la noche ya organizada.', 'Con los guiones completos de evento sabes cómo empezar, cómo seguir y cómo cerrar.'],
    1: ['Kit de emergencia en vivo: qué hacer cuando algo no sale como esperabas.', 'El kit de emergencia en vivo. Para que un imprevisto no te tome por sorpresa.', 'Para los imprevistos, el kit de emergencia en vivo.'],
    2: ['Checklist profesional antes de tocar: revisas todo y llegas tranquilo.', 'El checklist profesional. Lo repasas antes de tocar y no se te escapa nada.', 'Antes de empezar, el checklist profesional: todo revisado.'],
    3: ['Pack de intros, cortes y transiciones: recursos listos para usar en tu set.', 'El pack de intros, cortes y transiciones. Recursos listos para tu set.', 'Intros, cortes y transiciones, listos para usar.'],
    4: ['Sistema para leer la pista: para decidir qué sigue según cómo responde la gente.', 'El sistema para leer la pista. Aprendes a decidir qué poner después.', 'Con el sistema para leer la pista decides mejor, en tiempo real.'],
    5: ['Plan de preparación en siete días: una ruta, día por día, antes de tu evento.', 'El plan de preparación en siete días. Sabes qué hacer cada día antes de tocar.', 'Un plan de siete días para llegar listo al evento.'],
    6: ['Mensajes para conseguir y cerrar eventos: textos listos para ofrecer tu servicio, dar seguimiento y responder sobre el precio.', 'Los mensajes para conseguir y cerrar eventos. Textos listos para hablar con tus clientes.', 'Y mensajes listos para conseguir y cerrar eventos.'],
}
TS = ['La noche ordenada de principio a fin.', 'Qué hacer cuando algo no sale como esperabas.', 'Revisas todo y llegas tranquilo.', 'Recursos listos para usar en tu set.', 'Decide qué sigue según la gente.', 'Una ruta, día por día, antes de tu evento.', 'Textos listos para hablar con tus clientes.']
def tool(i, v=0, **k): return S('tool', TV[i][v], i=i, s=TS[i], **k)

VAL_L = 'Mira lo que vale cada una. Guiones de evento: veinticinco dólares. Kit de emergencia: quince. Checklist: diez. Intros, cortes y transiciones: veinte. Sistema para leer la pista: quince. Plan de siete días: quince. Mensajes para cerrar eventos: veinte. En total… ciento veinte dólares.'
VAL_C = 'Por separado, estas siete herramientas tienen un valor de ciento veinte dólares.'
PR = ['Pero hoy no vas a pagar ciento veinte dólares. Por tu compra tienes noventa por ciento de descuento. Te llevas todo… por solo doce dólares.',
      'Valor total: ciento veinte dólares. Con tu noventa por ciento de descuento… hoy pagas solo doce dólares.',
      '¿Ciento veinte dólares? No. Hoy, en esta página, el Súper Pack DJ completo es tuyo por doce dólares.']
GA = ['Y lo pruebas sin riesgo. Tienes siete días de garantía. Si no te gusta, te devolvemos tu dinero. Así de sencillo.',
      'Pruébalo durante siete días. Si no es para ti, pides tu reembolso por Hotmart y listo.',
      'Además, tienes siete días para revisarlo con calma. Si no te convence, te devolvemos tu dinero.']
CT = ['Haz clic en el botón de aquí abajo y agrega el Súper Pack DJ a tu compra por solo doce dólares.',
      'Toca el botón de abajo y llévate hoy el Súper Pack DJ. Doce dólares, solo en esta página.',
      'El botón está aquí abajo. Haz clic ahora y suma el Súper Pack DJ a tu curso.',
      'Haz clic en el botón de abajo y aprovecha esta oferta especial antes de salir de esta página.']
RAF = 'Guiones de evento. Kit de emergencia. Checklist profesional. Intros, cortes y transiciones. Sistema para leer la pista. Plan de siete días. Y mensajes para cerrar eventos.'
CAR = 'Incluye guiones completos de evento. Kit de emergencia en vivo. Checklist profesional. Pack de intros, cortes y transiciones. Sistema para leer la pista. Plan de preparación en siete días. Y mensajes para conseguir y cerrar eventos.'

def fel(v, t='¡Felicidades!', s='Tu curso DJ Profesional ya es tuyo.'): return S('felicita', v, t=t, s=s)
def prod(v, k='El siguiente nivel de tu curso', **kw): return S('producto', v, k=k, t='Súper Pack DJ', s='Listo para *cualquier evento.*', **kw)
def desb(v='Y por tu compra, acabas de desbloquear una oferta especial.'): return S('titulo', v, icono='candado', t='Desbloqueaste una *oferta especial*', s='Por haber comprado tu curso.')
def excl(n=0): return S('titulo', ['Esta oferta solo aparece en esta página, justo después de tu compra.', 'Recuerda: este precio solo aparece aquí, en esta página.', 'Y un detalle importante: este precio solo existe en esta página.'][n], k='Oferta exclusiva', t='Solo aparece en *esta página*', s='Justo después de tu compra.')
def gar(n=0, forma='aro', t='Pruébalo *7 días*', s='Si no te gusta, te devolvemos tu dinero.'): return S('garantia', GA[n], forma=forma, k='Garantía', t=t, s=s)
def cta(n=0, t='Agrégalo *ahora* a tu compra', **k): return S('cta', CT[n], t=t, **k)
def alumnos(): return S('titulo', 'Más de siete mil quinientos alumnos ya han confiado en nosotros.', t='Más de *7,593 alumnos* ya han confiado en nosotros')
def rejilla(v): return S('rejilla', v, t='Las *7 herramientas* del pack')

V = []
def video(id, titulo, estilo, escenas): V.append(dict(id=id, titulo=titulo, estilo=estilo, escenas=escenas))

video('01', 'Directo al punto', dict(pal=dict(bg='#140a08', ink='#fff3ea', mut='#c9a89a', a='#ff4d2e', b='#ffb199', c='#ffd23f', sobre='#140a08'), ft='Anton', tam=1.12, fw=400, caps=1, ls='.01em', lh=1.06, fb='DMSans',
      texto='escala', acento='color', fondo='barras', trans='corte', deco='sol', marco=['barra'], musica='energia'), [
    fel('¡Felicidades! Tu curso DJ Profesional ya es tuyo.'),
    desb('Y por tu compra, acabas de desbloquear una oferta que solo aparece en esta página.'),
    prod('Se llama Súper Pack DJ: listo para cualquier evento. Siete herramientas para pasar de saber mezclar… a llegar preparado a tocar.'),
    S('rafaga', RAF),
    S('valor', VAL_C, forma='lista', t='Valor de las *7 herramientas*'),
    S('precio', PR[0], forma='tachado'),
    gar(0, 'aro'),
    cta(0)])

video('02', 'La historia de Julián', dict(pal=dict(bg='#1a0f2e', ink='#f4efff', mut='#b3a6d6', a='#c6f432', b='#b79cff', c='#c6f432', sobre='#1a0f2e'), ft='Sora', fw=800, fk='Fraunces', fb='Nunito',
      texto='sube', acento='italica', fondo='ondas', trans='fundido', deco='aro', marco=['vin'], musica='suave'), [
    fel('¡Felicidades por dar el primer paso! Tu curso de DJ ya es tuyo.', t='¡Felicidades por dar *el primer paso!*', s='Tu curso de DJ ya es tuyo.'),
    S('historia', 'Déjame contarte una historia de ejemplo. Julián aprendió a mezclar en su cuarto. Practicó, mejoró y se sentía listo.', img='j_practica', fondo='f_cuarto', t='Julián aprendió a mezclar *en su cuarto.*'),
    S('historia', 'Hasta que llegó su primer evento. Y ahí aparecieron las dudas: ¿con qué abro?, ¿qué hago si la gente no baila?, ¿y si algo falla?', img='j_nervioso', fondo='f_evento', lado='der', t='Llegó su *primer evento.*', s='¿Con qué abro? ¿Y si algo falla?'),
    S('titulo', 'A Julián no le faltaba talento. Le faltaba preparación.', t='No le faltaba talento.\nLe faltaba *preparación.*'),
    prod('Para eso existe el Súper Pack DJ: listo para cualquier evento. Es el complemento de tu curso para llegar con un plan.', k='La oferta que desbloqueaste'),
    tool(0), tool(1, 1), tool(2), tool(6, 1),
    rejilla('Y además incluye el pack de intros, cortes y transiciones, el sistema para leer la pista y el plan de preparación en siete días. Siete herramientas en total.'),
    S('precio', PR[1], forma='aro'),
    excl(0),
    gar(1, 'escudo'),
    cta(1, t='Llega preparado a *tu próximo evento*')])

video('03', 'Haz la cuenta', dict(claro=1, pal=dict(bg='#f3ecdd', ink='#1b1a16', mut='#6e6a5c', a='#0f7a4a', b='#c2331f', c='#0f7a4a', sobre='#f3ecdd', sup='#e7dec9'), ft='DMSerif', tam=1.12, fw=400, ls='-.015em', fk='DMSerif', fkw=400, fb='DMSans',
      texto='lado', acento='italica', fondo='papel', trans='sube', deco='pedestal', lado='izq', musica='calma', voz='ef_dora'), [
    fel('¡Listo! Tu compra está confirmada. Gracias por confiar en nosotros.', t='Compra *confirmada*', s='Gracias por confiar en nosotros.'),
    S('curso', 'Tu curso tiene cuatro módulos: conexión de equipos, mezcla y transiciones, construcción de sets y creación de remixes. Con certificado incluido.', k='DJ Profesional', t='Esto ya es *tuyo*'),
    S('titulo', 'Ahora, déjame mostrarte algo que solo vas a ver en esta página.', t='Y ahora, algo que solo verás en *esta página*'),
    prod('El Súper Pack DJ. Siete herramientas para llevar lo que aprendas a un evento real.', k='Oferta desbloqueada por tu compra'),
    S('valor', VAL_L, forma='recibo', t='Haz *la cuenta*', s='Lo que vale cada herramienta.'),
    S('precio', PR[0], forma='contador'),
    S('lista', 'Con doce dólares recibes las siete herramientas, con acceso inmediato y de por vida.', t='Por *$12* recibes', items=['Las 7 herramientas del pack', 'Acceso inmediato', 'Acceso de por vida', '7 días de garantía'], img='pack_1'),
    gar(2, 'calendario', t='7 días para *revisarlo*'),
    cta(0, t='Súmalo a tu compra *por $12*')])

video('04', 'Cuatro preguntas', dict(claro=1, pal=dict(bg='#efeee9', ink='#141414', mut='#6b6b66', a='#e8391d', b='#141414', c='#e8391d', sobre='#ffffff', sup='#e3e2dc'), ft='SpaceG', fw=700, ls='-.045em', fb='SpaceG',
      texto='letra', acento='marca', fondo='puntos', trans='empuje', deco='bloque', alterna=1, marco=['cuenta', 'marca'], musica='funk'), [
    fel('¡Felicidades! Tu curso DJ Profesional ya es tuyo.'),
    S('titulo', 'Antes de tu primer evento, vas a tener cuatro preguntas.', t='Antes de tu primer evento vas a tener *4 preguntas*'),
    S('titulo', 'Primera: ¿cómo organizo toda la noche?', k='Pregunta 1', t='¿Cómo organizo *toda la noche?*'),
    S('tool', 'Con los guiones completos de evento. La noche ordenada de principio a fin.', i=0, s=TS[0]),
    S('titulo', 'Segunda: ¿y si algo sale mal?', k='Pregunta 2', t='¿Y si algo *sale mal?*'),
    S('tool', 'Para eso está el kit de emergencia en vivo.', i=1, s=TS[1]),
    S('titulo', 'Tercera: ¿se me está olvidando algo?', k='Pregunta 3', t='¿Se me está *olvidando algo?*'),
    S('tool', 'Lo revisas con el checklist profesional antes de tocar.', i=2, s=TS[2]),
    S('titulo', 'Y la cuarta: ¿cómo consigo el evento?', k='Pregunta 4', t='¿Cómo *consigo el evento?*'),
    S('tool', 'Con los mensajes para conseguir y cerrar eventos.', i=6, s=TS[6]),
    rejilla('Y hay más: intros, cortes y transiciones, el sistema para leer la pista y un plan de siete días. Todo está en el Súper Pack DJ.'),
    S('precio', PR[2], forma='giro'),
    excl(1),
    gar(1, 'aro'),
    cta(2, t='Responde tus 4 preguntas *hoy*')])

video('05', 'El camino del DJ', dict(pal=dict(bg='#2a0f1f', ink='#fff1e6', mut='#dcb6a6', a='#ffb347', b='#ff6a2b', c='#ffd98a', sobre='#2a0f1f'), grad='linear-gradient(160deg,#3d1226 0%,#2a0f1f 45%,#5a1f14 100%)', ft='Bricolage', fw=800, fb='DMSans',
      texto='desenfoque', acento='subraya', fondo='halo', trans='zoom', deco='ondas', musica='pop'), [
    fel('¡Felicidades por dar el primer paso! Tu curso de DJ ya es tuyo.', t='¡Diste *el primer paso!*', s='Tu curso de DJ ya es tuyo.'),
    S('camino', 'Este es el camino de un DJ: aprender, practicar, conseguir clientes, cobrar y crecer.', t='El camino de un DJ'),
    S('titulo', 'Tu curso cubre los dos primeros pasos: aprender y practicar.', t='Tu curso cubre *aprender y practicar*'),
    prod('Para los siguientes pasos está el Súper Pack DJ, la oferta que desbloqueaste con tu compra.', k='Para los siguientes pasos'),
    S('tool', TV[5][0], i=5, s=TS[5], demo='plan'),
    S('tool', TV[6][0], i=6, s=TS[6], demo='chat'),
    S('tool', TV[0][2], i=0, s=TS[0], demo='curva'),
    tool(4),
    S('etapas', 'Ya tienes tu curso. Tu siguiente paso es el Súper Pack. Y con los dos, llegas mejor preparado a cada evento.', t='Tu *siguiente paso*'),
    S('valor', VAL_C, forma='lista', t='7 herramientas, *$120 de valor*'),
    S('precio', PR[1], forma='tachado'),
    gar(0, 'escudo'),
    cta(3, t='Da tu *siguiente paso*')])

video('06', 'Mensajes que cierran eventos', dict(pal=dict(bg='#0c1513', ink='#eafff6', mut='#8fb3a6', a='#3df5b0', b='#ffd166', c='#3df5b0', sobre='#06231a'), ft='DMSans', fw=800, ls='-.045em', fb='DMSans',
      texto='sube', acento='color', fondo='particulas', trans='sube', deco='flota', lado='izq', musica='house'), [
    S('titulo', '¡Espera! Antes de entrar a tu curso, mira esto.', tono='gancho', t='¡Espera! *Mira esto* antes de entrar'),
    fel('Tu compra está confirmada. ¡Felicidades!', t='Compra confirmada', s='¡Felicidades por tu curso de DJ!'),
    S('titulo', 'Saber mezclar es una parte. La otra es que alguien te contrate.', t='Mezclar es una parte.\nLa otra: *que te contraten.*'),
    S('demo', 'Imagina que te escriben para una boda. ¿Qué respondes? ¿Cómo presentas tu servicio? ¿Qué dices cuando preguntan el precio?', demo='chat', t='¿Qué respondes cuando *te escriben?*'),
    S('tool', 'El Súper Pack DJ incluye mensajes para conseguir y cerrar eventos: textos listos para ofrecer tu servicio, dar seguimiento y responder sobre el precio.', i=6, s=TS[6]),
    S('titulo', 'Y cuando te digan que sí, llegas preparado.', t='Y cuando te digan que sí, *llegas preparado*'),
    tool(0, 1), tool(2, 1), tool(1, 2),
    rejilla('En total son siete herramientas en un solo pack.'),
    S('valor', VAL_C, forma='barras', t='Lo que vale *cada una*'),
    S('precio', PR[2], forma='contador'),
    gar(1, 'calendario'),
    cta(1, t='Empieza a *cerrar eventos*')])

video('07', '¿Estarías listo mañana?', dict(claro=1, pal=dict(bg='#ffd21f', ink='#141207', mut='#5c5210', a='#141207', b='#c81e0f', c='#c81e0f', sobre='#ffd21f', sup='#f5c400'), ft='Archivo', fw=900, caps=1, ls='-.02em', fb='Archivo',
      texto='cae', acento='marca', fondo='rayas', trans='barrido', deco='bloque', marco=['esquinas'], musica='funk'), [
    S('titulo', 'Una pregunta rápida. Si tu primer evento fuera mañana… ¿estarías listo?', tono='gancho', t='Si tu evento fuera mañana, *¿estarías listo?*'),
    fel('Primero, ¡felicidades! Tu curso DJ Profesional ya es tuyo.'),
    S('demo', 'Un DJ preparado revisa todo antes de tocar: conexiones, equipo, música, el guion del evento y un plan B.', demo='checklist', t='Antes de tocar, *revisa todo*'),
    tool(2),
    prod('Ese checklist es parte del Súper Pack DJ: listo para cualquier evento.', k='Oferta desbloqueada'),
    S('carrusel', CAR, t='Todo lo que incluye'),
    S('precio', PR[0], forma='tachado'),
    excl(0),
    gar(2, 'aro'),
    cta(0, t='Llega *listo* a tu evento')])

video('08', 'Siete días', dict(pal=dict(bg='#0d0b2b', ink='#fdf2ff', mut='#b0a3d9', a='#ff2e93', b='#7df9ff', c='#ffe14d', sobre='#ffffff'), ft='Unbounded', tam=.88, fw=800, ls='-.04em', lh=1.1, fb='Outfit',
      texto='gira', acento='color', fondo='circulos', trans='giro', deco='aro', alterna=1, musica='dj'), [
    fel('¡Felicidades! Tu curso DJ Profesional ya es tuyo.'),
    S('numero', 'Siete días. Ese es el plan de preparación que incluye la oferta que acabas de desbloquear.', n='7', t='Un plan de *7 días* para llegar preparado'),
    S('demo', 'Una ruta, día por día, antes de tu evento. Para que no llegues a improvisar.', demo='plan', t='Día por día, *antes de tu evento*'),
    prod('Es parte del Súper Pack DJ: listo para cualquier evento.', k='Oferta desbloqueada por tu compra'),
    tool(0, 2), tool(3), tool(4, 1), tool(1),
    rejilla('Más el checklist profesional y los mensajes para conseguir y cerrar eventos. Siete herramientas.'),
    S('valor', VAL_C, forma='lista', t='El valor de *todo el pack*'),
    S('precio', PR[1], forma='aro'),
    S('garantia', 'Y otros siete días importantes: los de tu garantía. Si no te gusta, te devolvemos tu dinero.', forma='calendario', k='Garantía', t='Y *7 días* de garantía', s='Si no te gusta, te devolvemos tu dinero.'),
    cta(3, t='Empieza tus *7 días*')])

video('09', 'La curva de energía', dict(pal=dict(bg='#062a2c', ink='#eafffb', mut='#8fbdb8', a='#ffb020', b='#2fe0d0', c='#ffb020', sobre='#062a2c'), ft='Syne', fw=800, fb='Manrope',
      texto='lado', acento='subraya', fondo='vinilo', vx=120, trans='barrido', deco='pedestal', lado='izq', musica='house', voz='ef_dora'), [
    fel('Tu compra quedó confirmada. Bienvenido a DJ Profesional.', t='Bienvenido a *DJ Profesional*', s='Tu compra quedó confirmada.'),
    S('titulo', 'Un evento no es una lista de canciones. Es una curva de energía.', t='Un evento no es una lista de canciones.\nEs *una curva.*'),
    S('demo', 'Empieza suave, sube poco a poco, llega a su punto más alto y cierra con fuerza. Y eso se planea.', demo='curva', t='Inicio, subida, clímax *y cierre*'),
    prod('Con el Súper Pack DJ llegas con esa curva planeada. Es la oferta que desbloqueaste con tu compra.', k='Oferta desbloqueada'),
    tool(0), tool(4), tool(3, 1),
    S('lista', 'Además incluye el kit de emergencia, el checklist, el plan de siete días y los mensajes para cerrar eventos.', t='Y *además*', items=['Kit de emergencia en vivo', 'Checklist profesional antes de tocar', 'Plan de preparación en 7 días', 'Mensajes para conseguir y cerrar eventos'], img='pack_1'),
    S('valor', VAL_C, forma='barras', t='El valor de *cada herramienta*'),
    S('precio', PR[0], forma='giro'),
    excl(2),
    gar(0, 'escudo'),
    cta(2, t='Planea *tu curva*')])

video('10', 'Plan de emergencia', dict(pal=dict(bg='#23070a', ink='#fff0ee', mut='#d9a7a2', a='#38e07b', b='#ff3b3b', c='#38e07b', sobre='#06200f'), grad='radial-gradient(1200px 700px at 50% 0%,#4a0d12 0%,#23070a 70%)', ft='Oswald', tam=1.15, fw=700, caps=1, ls='0', lh=1.1, fb='DMSans',
      texto='escala', acento='color', fondo='luces', trans='corte', deco='flota', marco=['barra', 'vin'], musica='energia'), [
    S('titulo', 'Estás tocando… y de pronto, la pista se apaga. ¿Qué haces?', tono='gancho', t='La pista se apaga.\n*¿Qué haces?*'),
    fel('Tranquilo. Primero: ¡felicidades por tu curso de DJ!', t='Primero: *¡felicidades!*', s='Tu curso de DJ ya es tuyo.'),
    S('demo', 'En un evento real pueden pasar cosas: la pista se apaga, algo falla en cabina, surge un imprevisto. La diferencia es tener un plan.', demo='kit', t='Con un plan, *todo bajo control*'),
    tool(1),
    S('titulo', 'No es suerte. Es preparación.', t='No es suerte.\nEs *preparación.*'),
    prod('Y la preparación completa está en el Súper Pack DJ, la oferta que desbloqueaste con tu compra.', k='Oferta desbloqueada'),
    S('rafaga', RAF),
    S('precio', PR[2], forma='tachado'),
    excl(1),
    gar(1, 'aro'),
    cta(1, t='Toca con *un plan*')])

video('11', 'Póster', dict(claro=1, pal=dict(bg='#ff5a1f', ink='#140a04', mut='#5a2208', a='#140a04', b='#ffffff', c='#ffffff', sobre='#ff5a1f', sup='#f04c12'), ft='BigShoulders', tam=1.25, fw=900, caps=1, ls='0', lh=.98, fb='Archivo',
      texto='cae', acento='contorno', fondo='cinta', trans='empuje', deco='inclina', musica='energia', vel=1.1), [
    fel('¡Compra confirmada! Tu curso de DJ ya es tuyo.', t='¡Compra *confirmada!*', s='Tu curso de DJ ya es tuyo.'),
    S('titulo', 'Ya vas a saber mezclar. Ahora, prepárate para tocar en eventos reales.', t='Ya vas a saber mezclar.\nAhora: *eventos reales.*'),
    prod('Desbloqueaste el Súper Pack DJ: listo para cualquier evento.', k='Oferta desbloqueada'),
    S('rafaga', RAF),
    S('numero', 'Todo, por doce dólares. Noventa por ciento menos que su valor de ciento veinte.', n='$12', tono='precio', t='Valor $120.\nHoy, *90% menos.*'),
    gar(1, 'aro', t='*7 días* de garantía'),
    excl(1),
    cta(0, t='Súmalo *ahora*')])

video('12', 'Orden', dict(pal=dict(bg='#0b0a08', ink='#f6efe0', mut='#a39a86', a='#d9b25f', b='#8a6f2f', c='#f0cf7a', sobre='#0b0a08'), ft='Playfair', tam=1.08, fw=700, ls='-.02em', fk='Playfair', fkw=500, fb='Manrope',
      texto='desenfoque', acento='italica', fondo='vinilo', trans='fundido', deco='pedestal', marco=['vin'], musica='noche', vel=1.03), [
    fel('¡Listo! Tu compra está confirmada. Gracias por confiar en nosotros.', t='Gracias por *confiar*', s='Tu compra está confirmada.'),
    S('curso', 'Con tu curso vas a aprender a conectar tus equipos, a mezclar con transiciones profesionales, a construir tus sets y a crear tus propios remixes.', k='DJ Profesional', t='Lo que ya es *tuyo*'),
    desb(),
    S('titulo', 'Con tu curso tienes las piezas. Con el Súper Pack, les das orden.', t='El curso te da las piezas.\nEl pack, *el orden.*'),
    prod('Súper Pack DJ: listo para cualquier evento. Siete herramientas, una para cada momento.', k='Oferta desbloqueada'),
    tool(0), tool(1), tool(2), tool(3), tool(4), tool(5), tool(6),
    S('valor', VAL_C, forma='lista', t='Siete herramientas, *un valor*'),
    S('precio', PR[0], forma='aro'),
    gar(2, 'escudo'),
    S('etapas', 'Ya tienes tu curso. Tu siguiente paso es el Súper Pack. Y con los dos, llegas mejor preparado a cada evento.', t='Tres *etapas*'),
    excl(1),
    cta(3, t='Dale orden a *lo que aprendes*')])

video('13', 'Con y sin el pack', dict(pal=dict(bg='#3a0d1e', ink='#fff0ee', mut='#d6a9b0', a='#ffc2c7', b='#f5c84a', c='#f5c84a', sobre='#3a0d1e'), ft='Manrope', fw=800, ls='-.045em', fb='Manrope',
      texto='sube', acento='color', fondo='rombos', trans='empuje', deco='aro', alterna=1, musica='pop'), [
    fel('¡Felicidades! Tu curso DJ Profesional ya es tuyo.'),
    S('compara', 'Solo con tu curso, sabes mezclar. Pero te faltan el guion del evento, el plan si algo falla, el checklist y los mensajes para conseguir eventos. Con el curso más el Súper Pack DJ… lo tienes todo.'),
    prod('Por eso, con tu compra desbloqueaste el Súper Pack DJ: listo para cualquier evento.', k='Oferta desbloqueada'),
    tool(0, 1), tool(1), tool(2, 2), tool(6),
    rejilla('Más intros, cortes y transiciones, el sistema para leer la pista y el plan de siete días. Siete herramientas.'),
    S('precio', PR[1], forma='contador'),
    excl(0),
    gar(0, 'calendario'),
    cta(2, t='Completa *tu preparación*')])

video('14', 'Del cuarto al evento', dict(pal=dict(bg='#17110b', ink='#f3e6cf', mut='#b9a78a', a='#e0733a', b='#f3e6cf', c='#f3c56b', sobre='#17110b'), grad='radial-gradient(1100px 700px at 30% 40%,#2c1d10 0%,#17110b 70%)', ft='Instrument', tam=1.3, fw=400, ls='-.02em', lh=1.02, fk='Instrument', fkw=400, fb='DMSans',
      texto='desenfoque', acento='italica', fondo='nada', trans='fundido', deco='flota', marco=['cine', 'vin'], musica='noche', voz='em_santa', vel=1.02), [
    S('historia', 'Todo empieza en un cuarto. Unos audífonos, una controladora y muchas ganas de aprender.', img='j_practica', fondo='f_cuarto', t='Todo empieza *en un cuarto.*'),
    fel('Ese paso ya lo diste. ¡Felicidades por tu curso de DJ!', t='Ese paso *ya lo diste*', s='¡Felicidades por tu curso de DJ!'),
    S('historia', 'Pero practicar en casa no es lo mismo que tocar frente a la gente. Y eso puede frustrar.', img='j_frustrado', fondo='f_cuarto', lado='der', t='Practicar en casa *no es lo mismo.*'),
    S('historia', 'Porque el día del evento, los nervios aparecen. Es normal. Lo que cambia todo es llegar preparado.', img='j_nervioso', fondo='f_evento', t='El día del evento, *llega preparado.*'),
    prod('Para eso desbloqueaste el Súper Pack DJ: listo para cualquier evento.', k='Oferta desbloqueada por tu compra'),
    tool(0), tool(5), tool(1, 1), tool(4, 2),
    rejilla('Y además: checklist profesional, intros, cortes y transiciones, y mensajes para conseguir y cerrar eventos.'),
    S('valor', VAL_C, forma='lista', t='El valor de *las siete*'),
    S('precio', PR[1], forma='giro'),
    gar(2, 'aro'),
    excl(2),
    cta(1, t='Del cuarto *al evento*')])

video('15', 'Carrusel', dict(claro=1, pal=dict(bg='#e9e3ff', ink='#1d1140', mut='#5f528a', a='#4a1fb8', b='#e0218a', c='#e0218a', sobre='#ffffff', sup='#d9d0fb'), ft='Outfit', fw=800, ls='-.04em', fb='Outfit',
      texto='letra', acento='color', fondo='papel', trans='zoom', deco='disco', musica='pop', voz='ef_dora'), [
    fel('¡Felicidades! Tu curso DJ Profesional ya es tuyo.'),
    desb('Y por tu compra, desbloqueaste una oferta que solo aparece en esta página.'),
    prod('El Súper Pack DJ: listo para cualquier evento. Te lo muestro por dentro.', k='Oferta desbloqueada'),
    S('carrusel', CAR, t='Por dentro del *Súper Pack DJ*'),
    S('valor', VAL_C, forma='lista', t='Lo que vale *por separado*'),
    S('precio', PR[2], forma='aro'),
    alumnos(),
    gar(1, 'calendario'),
    cta(0, t='Llévate *las 7 herramientas*')])

video('16', 'Sin riesgo', dict(pal=dict(bg='#07130d', ink='#effff5', mut='#8fb5a0', a='#19c37d', b='#b6f5d2', c='#ffffff', sobre='#04130b'), ft='Epilogue', fw=800, ls='-.05em', fb='Epilogue',
      texto='lado', acento='subraya', fondo='halo', trans='sube', deco='ondas', lado='izq', musica='suave'), [
    fel('¡Listo! Tu compra está confirmada. Gracias por confiar en nosotros.', t='Compra confirmada', s='Gracias por confiar en nosotros.'),
    S('garantia', 'Te voy a mostrar una oferta. Y quiero que la veas tranquilo, porque tiene siete días de garantía. Si no te gusta, te devolvemos tu dinero.', forma='aro', k='Antes que nada', t='Primero, lo importante: *7 días de garantía*', s='Si no te gusta, te devolvemos tu dinero.'),
    S('titulo', 'Con esa tranquilidad, mira lo que desbloqueaste.', icono='candado', t='Ahora sí: mira lo que *desbloqueaste*'),
    prod('El Súper Pack DJ: listo para cualquier evento. El complemento de tu curso.'),
    tool(0, 2), tool(1, 1), tool(2), tool(6, 1),
    rejilla('Y tres más: intros, cortes y transiciones, sistema para leer la pista y plan de siete días.'),
    S('valor', VAL_C, forma='consola'),
    S('precio', PR[0], forma='tachado'),
    S('titulo', 'Pruébalo. Y si no es para ti, pides tu reembolso por Hotmart.', t='Cero riesgo.\n*Pruébalo.*', s='Reembolso por Hotmart durante 7 días.'),
    cta(3, t='Pruébalo *sin riesgo*')])

video('17', 'Doce dólares', dict(pal=dict(bg='#1d1f22', ink='#f5f6f1', mut='#a3a69c', a='#e8ff3a', b='#ff5d5d', c='#e8ff3a', sobre='#1d1f22'), ft='Rubik', fw=800, ls='-.04em', fb='Rubik',
      texto='escala', acento='marca', fondo='rayas', trans='corte', deco='bloque', alterna=1, marco=['cuenta'], musica='dj'), [
    S('numero', 'Doce dólares. Eso es todo lo que cuesta lo que te voy a mostrar. Y solo aparece en esta página.', n='$12', t='Solo *12 dólares.*\nSolo en esta página.'),
    fel('Pero primero: ¡felicidades! Tu curso DJ Profesional ya es tuyo.'),
    prod('Lo que desbloqueaste se llama Súper Pack DJ: listo para cualquier evento.', k='Oferta desbloqueada por tu compra'),
    tool(0), tool(3, 2), tool(4), tool(5, 1),
    rejilla('Y también el kit de emergencia, el checklist profesional y los mensajes para cerrar eventos. Siete herramientas.'),
    S('valor', VAL_L, forma='lista', t='¿Cuánto *vale* todo?'),
    S('precio', PR[1], forma='contador'),
    gar(1, 'escudo'),
    cta(0, t='Todo esto por *$12*')])

video('18', 'Ecualizador', dict(pal=dict(bg='#07080f', ink='#f4f4ff', mut='#9b9cc0', a='#ff3df0', b='#25e6ff', c='#ffe640', sobre='#07080f'), ft='Archivo', tam=1.25, fst='68%', fw=800, caps=1, ls='0', lh=1.04, fb='DMSans',
      texto='gira', acento='color', fondo='barras', trans='desenfoque', deco='aro', musica='dj'), [
    fel('Tu compra quedó confirmada. Bienvenido a DJ Profesional.', t='Bienvenido a *DJ Profesional*', s='Tu compra quedó confirmada.'),
    S('titulo', 'Un buen set se construye sumando. Pista por pista.', t='Un buen set se construye *sumando*'),
    prod('Tu preparación también. Por eso desbloqueaste el Súper Pack DJ.', k='Oferta desbloqueada por tu compra'),
    S('valor', VAL_L, forma='barras', t='Cada herramienta *suma*', colores=['#ff3df0', '#25e6ff', '#ffe640', '#7dff6b', '#ff8a3d', '#a78bff', '#ff5d7a']),
    S('precio', PR[0], forma='tachado'),
    tool(3), tool(4, 1), tool(0, 1),
    excl(0),
    gar(0, 'aro'),
    cta(1, t='Súmale a *tu curso*')])

video('19', 'Consola', dict(pal=dict(bg='#050805', ink='#d6ffd9', mut='#6fa276', a='#5cff7a', b='#ffb020', c='#ffb020', sobre='#021004'), ft='JetBrains', fw=800, ls='-.05em', lh=1.12, fb='JetBrains',
      texto='maquina', acento='color', fondo='rejilla', trans='cortina', deco='flota', marco=['marca'], musica='house'), [
    S('titulo', 'Procesando tu compra… Listo. Acceso confirmado.', t='> compra confirmada\n> *acceso listo*'),
    fel('¡Felicidades! Tu curso DJ Profesional ya es tuyo.'),
    S('titulo', 'Y hay algo más: una oferta desbloqueada por tu compra.', icono='candado', t='> oferta *desbloqueada*', s='Solo aparece en esta página.'),
    prod('Súper Pack DJ: listo para cualquier evento.', k='Cargando oferta'),
    S('valor', VAL_L, forma='consola'),
    S('precio', PR[2], forma='contador'),
    tool(6), tool(1, 2),
    gar(1, 'calendario'),
    cta(2, t='> agregar *Súper Pack DJ*')])

video('20', 'Compra confirmada', dict(claro=1, pal=dict(bg='#ffffff', ink='#0c1440', mut='#5b6390', a='#1437e6', b='#ffc400', c='#1437e6', sobre='#ffffff', sup='#eef1ff'), ft='Montserrat', fw=900, ls='-.045em', fb='Montserrat',
      texto='cae', acento='marca', fondo='circulos', trans='giro', deco='disco', musica='pop'), [
    fel('¡Listo! Tu compra está confirmada. Gracias por confiar en nosotros.', t='¡Compra *confirmada!*', s='Gracias por confiar en nosotros.'),
    S('curso', 'Tu curso tiene cuatro módulos: conexión de equipos, mezcla y transiciones, construcción de sets y creación de remixes. Con certificado incluido.', k='DJ Profesional', t='Tu curso ya *te espera*'),
    S('camino', 'Con el curso aprendes y practicas. El siguiente escalón es conseguir clientes, cobrar y crecer.', forma='escalera', t='Tu *siguiente escalón*'),
    desb(),
    prod('El Súper Pack DJ: listo para cualquier evento.', k='Oferta desbloqueada'),
    rejilla('Siete herramientas: guiones, kit de emergencia, checklist, intros y transiciones, sistema para leer la pista, plan de siete días y mensajes para cerrar eventos.'),
    tool(0, 1), tool(6),
    S('precio', PR[0], forma='giro'),
    alumnos(),
    gar(0, 'escudo'),
    cta(3, t='Sube *al siguiente escalón*')])

VIDEOS = V
