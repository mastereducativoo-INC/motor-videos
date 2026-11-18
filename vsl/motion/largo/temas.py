"""Temas visuales por familia de nicho (17 nov 2026). Cada producto usa el tema de su familia: colores, tipografía,
fondos animados, transición, adornos y marco propios. Nada del estilo de DJ (vinilo, ecualizador, ondas de audio).
Id del estilo en el panel: t-<familia>-<variante>  (ej. t-legal-1). Cada familia tiene 3 variantes para que las
3 versiones de un guion se vean distintas sin salirse de la identidad del nicho."""

def _pal(bg, a, b, c, sup, ink='#f6f1e7', mut='#b8ad9e', sobre='#14100c'):
    return dict(bg=bg, a=a, b=b, c=c, sup=sup, ink=ink, mut=mut, sobre=sobre)

COMUN = dict(voz='em_alex', vel=1.06, ritmo=1.1, set=5, tema=True, motor='pro')  # motor='pro': vsl/motion/pro (animación nueva)

FAMILIAS = {
    # Derecho, contabilidad, finanzas, consultoría, administración: sobrio, editorial, dorado mate.
    'legal': dict(nombre='Legal y profesional', base=dict(ft='Playfair', fw=800, ls='-.02em', lh=1.08, fb='Montserrat', acento='subraya', marco=['esquinas', 'vin'], emblema='balanza'), variantes=[
        # fondos SÓLIDOS (nota de Christian, 17 nov): un solo color profundo, con detalles finos; sin franjas ni degradados llamativos
        dict(nombre='Borgoña y oro', pal=_pal('#1c0b11', '#c8a24a', '#7c2233', '#e6c877', '#2a141c'), grad='none',
             fondo=['filigrana', 'emblema'], trans='desenfoque', texto='sube', deco='pedestal', musica='musica/it-s-love.mp3'),
        dict(nombre='Azul medianoche y oro', pal=_pal('#0b1220', '#c9a654', '#1f3a66', '#ecd08a', '#141d30', mut='#a9b0c2'), grad='none',
             fondo=['polvo', 'emblema'], trans='cortina', texto='desenfoque', deco='aro', musica='musica/possible-dreams.mp3'),
        dict(nombre='Grafito y champán', pal=_pal('#131314', '#d2b77c', '#5a4a3a', '#f0ddb0', '#1e1e20', mut='#b3aea6'), grad='none',
             fondo=['brillo'], trans='fundido', texto='escala', deco='pedestal', musica='musica/infinity.mp3'),
        dict(nombre='Verde inglés y oro', pal=_pal('#0a1611', '#c9a654', '#1f4a3a', '#ecd08a', '#12221b', mut='#a9b8b0'), grad='none',
             fondo=['polvo'], trans='desenfoque', texto='sube', deco='pedestal', musica='musica/it-s-love.mp3'),
        dict(nombre='Ciruela y cobre', pal=_pal('#150e17', '#cf9a6b', '#4a2850', '#f0c9a4', '#211726', mut='#b5a9b8'), grad='none',
             fondo=['brillo'], trans='fundido', texto='escala', deco='pedestal', musica='musica/possible-dreams.mp3'),
    ]),
    # Programación, IA, datos, diseño web, marketing digital: técnico, limpio, preciso.
    'tec': dict(nombre='Tecnología', base=dict(ft='SpaceG', fw=700, ls='-.04em', fb='Montserrat', acento='marca', marco=['barra'], emblema='llaves'), variantes=[
        dict(nombre='Esmeralda y grafito', pal=_pal('#07100c', '#17b877', '#d2a94c', '#f1c95f', '#0e1c16', ink='#eef7f1', mut='#9db3a8', sobre='#04110b'), grad='radial-gradient(1200px 800px at 80% 0%,#0f3a2a 0%,#07100c 62%)',
             fondo=['cuadricula', 'codigo', 'emblema'], trans='desenfoque', texto='sube', deco='pedestal', musica='musica/digital-clouds.mp3'),
        dict(nombre='Noche y verde menta', pal=_pal('#0a0f14', '#2fd39a', '#3b82f6', '#ffd166', '#121a22', ink='#eef4f8', mut='#9aa9b6', sobre='#05130e'), grad='linear-gradient(155deg,#10202c 0%,#0a0f14 60%)',
             fondo=['nodos', 'emblema'], trans='zoom', texto='desenfoque', deco='aro', musica='musica/close-up.mp3'),
        dict(nombre='Carbón y oro', pal=_pal('#0d0e0d', '#12a36a', '#caa24a', '#f3cf6b', '#171a18', ink='#f1f4f0', mut='#a3aca6', sobre='#04110b'), grad='radial-gradient(1000px 700px at 15% 100%,#17302a 0%,#0d0e0d 62%)',
             fondo=['codigo', 'brillo', 'emblema'], trans='empuje', texto='sube', deco='pedestal', musica='musica/uplifting-bass.mp3'),
    ]),
    # Cualquier otro nicho mientras no tenga familia propia: neutro y premium, sin elementos de audio.
    'gen': dict(nombre='Premium neutro', base=dict(ft='Montserrat', fw=900, ls='-.045em', fb='Montserrat', acento='marca', marco=['vin'], emblema=None), variantes=[
        dict(nombre='Tinta y ámbar', pal=_pal('#0c0d12', '#e0a53a', '#3b4a7a', '#ffd27a', '#161823', ink='#f2f3f7', mut='#a6abbb'), grad='radial-gradient(1200px 800px at 78% 0%,#1d2340 0%,#0c0d12 62%)',
             fondo=['brillo', 'polvo'], trans='desenfoque', texto='sube', deco='pedestal', musica='musica/it-s-love.mp3'),
        dict(nombre='Pizarra y coral', pal=_pal('#0e1114', '#ef6f5a', '#2f6f8f', '#ffd166', '#171c21', ink='#f1f4f6', mut='#a2adb5', sobre='#ffffff'), grad='linear-gradient(160deg,#162029 0%,#0e1114 60%)',
             fondo=['filigrana', 'polvo'], trans='zoom', texto='desenfoque', deco='aro', musica='musica/wind-leaves.mp3'),
        dict(nombre='Noche y turquesa', pal=_pal('#0a0f12', '#1fb5a6', '#d2a94c', '#f3cf6b', '#121b1f', ink='#eef5f5', mut='#9db0b0', sobre='#04110f'), grad='radial-gradient(1000px 700px at 15% 100%,#12303a 0%,#0a0f12 62%)',
             fondo=['brillo', 'cuadricula'], trans='fundido', texto='sube', deco='pedestal', musica='musica/tears-of-joy.mp3'),
    ]),
}


def estilo(clave):
    """'t-legal-1' -> estilo completo del motor, o None si la clave no es un tema."""
    clave = str(clave or '')
    if len(clave) > 3 and clave[0] == 'd' and clave[1].isdigit() and clave[2] == '-':
        # 'd3-legal' = director 3 (otra interpretación visual de todas las escenas) con la familia legal
        k = int(clave[1]); e = estilo('t-%s-%d' % (clave[3:], k)); e['dir'] = k; e['fam'] = clave[3:] if clave[3:] in FAMILIAS else 'gen'
        return e
    if not clave.startswith('t-'):
        return None
    partes = clave.split('-')
    fam = FAMILIAS.get(partes[1] if len(partes) > 1 else '') or FAMILIAS['gen']
    try:
        n = max(1, int(partes[2])) - 1
    except (IndexError, ValueError):
        n = 0
    v = fam['variantes'][n % len(fam['variantes'])]
    e = dict(COMUN); e.update(fam['base']); e.update({k: x for k, x in v.items() if k != 'nombre'})
    e['var'] = n % len(fam['variantes']) + 1  # cada variante cambia además el orden de composiciones y transiciones
    return e
