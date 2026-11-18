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


# Colores extra para un director (Christian, 17 nov 22:56: "no me gusta el verde"): 'd3-tec-2' = director 3, familia tec, color 2.
# Ninguno usa verde. Fondos sólidos y profundos; el acento es el color protagonista.
COLORES = [
    dict(nombre='Azul eléctrico', pal=_pal('#070b14', '#3b82f6', '#d2a94c', '#8ab8ff', '#0f1626', ink='#eef3fb', mut='#9aa8bf', sobre='#ffffff'), grad='radial-gradient(1200px 800px at 80% 0%,#12244a 0%,#070b14 62%)'),
    dict(nombre='Violeta y ámbar', pal=_pal('#0d0a16', '#8b5cf6', '#f5b84a', '#c4a6ff', '#18132a', ink='#f3f0fb', mut='#aaa2bf', sobre='#ffffff'), grad='radial-gradient(1200px 800px at 80% 0%,#2a1a4a 0%,#0d0a16 62%)'),
    dict(nombre='Carbón y oro', pal=_pal('#0d0d0e', '#d4a84a', '#6b7280', '#f3cf6b', '#18181a', ink='#f4f2ec', mut='#aca89e', sobre='#140f05'), grad='radial-gradient(1000px 700px at 15% 100%,#2a2414 0%,#0d0d0e 62%)'),
    dict(nombre='Medianoche y cian', pal=_pal('#061018', '#22b8e0', '#f2b24a', '#7fe3ff', '#0d1b26', ink='#eef7fb', mut='#98adb8', sobre='#03141c'), grad='radial-gradient(1200px 800px at 80% 0%,#0c3046 0%,#061018 62%)'),
    dict(nombre='Grafito y coral', pal=_pal('#0f0f12', '#f2665a', '#3b82f6', '#ffb199', '#19191d', ink='#f5f2f1', mut='#b0a9a7', sobre='#ffffff'), grad='radial-gradient(1000px 700px at 15% 100%,#3a1a17 0%,#0f0f12 62%)'),
    dict(nombre='Índigo y magenta', pal=_pal('#0b0b1a', '#6366f1', '#ec4899', '#a5b4fc', '#15152b', ink='#f1f1fb', mut='#a5a6c0', sobre='#ffffff'), grad='radial-gradient(1200px 800px at 80% 0%,#23234f 0%,#0b0b1a 62%)'),
]


# Directores exclusivos de abogados (18 nov): 5 mundos visuales del derecho, cada uno con su paleta, tipografía y música.
DIR_LEGAL = {
    6: dict(nombre='Despacho', pal=_pal('#120d09', '#c39548', '#5a2e1f', '#e6c27a', '#1d150f', ink='#f4ece0', mut='#b5a796', sobre='#1a1208'), grad='none', ft=None, musica='musica/special-days.mp3'),
    7: dict(nombre='Expediente', pal=_pal('#111214', '#b3262c', '#c9a46a', '#e0524b', '#1b1c20', ink='#f2efe9', mut='#a7a49d', sobre='#ffffff'), grad='none', ft=None, musica='musica/it-s-love.mp3'),
    # 18 nov: a Christian no le gustó la serifa del Tribunal; Código y Legal digital descartados → Cine y Keynote
    8: dict(nombre='Tribunal', pal=_pal('#0c0c0e', '#c9a654', '#e8e3d8', '#ecd08a', '#17171a', ink='#f5f2ea', mut='#aaa59a', sobre='#16120a'), grad='none', ft=None, musica='musica/romantic-getaway.mp3'),
    9: dict(nombre='Cine', pal=_pal('#0a0a0b', '#d4b06a', '#8a6a3a', '#f0d79a', '#141416', ink='#f7f3ea', mut='#b9b2a4', sobre='#16120a'), grad='none', ft=None, musica='musica/possible-dreams.mp3'),
    10: dict(nombre='Keynote', pal=_pal('#000000', '#c9a654', '#5b6b8a', '#f2d48c', '#0e0e10', ink='#ffffff', mut='#9a9aa2', sobre='#14100a'), grad='none', ft=None, musica='musica/skyline.mp3'),
}


# Música elegida ESCUCHÁNDOLA (Christian, 18 nov: "la música tiene que coincidir con el video, es lo primordial").
# earshot calificó cada pista contra la descripción de cada nicho (vsl/sonidos/musica.py → musica/escuchada.json).
import json as _json, os as _os
_NICHO = {'legal': 'legal', 'tec': 'tec', 'gen': 'educacion', 'dj': 'dj'}
try:
    _ESC = _json.load(open(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', 'musica', 'escuchada.json')))
    _ESC.pop('_ejemplo_crudo', None)
except Exception:
    _ESC = {}


def musica_para(fam, n, respaldo):
    """La n-ésima pista que mejor coincide con el nicho de la familia (n empieza en 0). Solo pistas con parecido ≥ 0.3."""
    nicho = _NICHO.get(fam)
    orden = sorted(((v['por_nicho'].get(nicho, 0), k) for k, v in _ESC.items() if nicho and isinstance(v, dict) and 'por_nicho' in v), reverse=True)
    buenas = [k for sc, k in orden if sc >= 0.3]
    return buenas[n % len(buenas)] if buenas else respaldo


def estilo(clave):
    """'t-legal-1' -> estilo completo del motor, o None si la clave no es un tema."""
    clave = str(clave or '')
    if len(clave) > 3 and clave[0] == 'd' and clave[1].isdigit() and (clave[2] == '-' or (clave[2].isdigit() and clave[3] == '-')):
        # 'd3-legal' = director 3 (otra interpretación visual de todas las escenas) con la familia legal
        resto = clave[clave.index('-') + 1:].split('-'); fam = resto[0]
        num = ''.join(ch for ch in clave[1:3] if ch.isdigit()); k = int(num)
        if k in DIR_LEGAL:  # 'd6-legal' … 'd10-legal'
            L = DIR_LEGAL[k]; e = estilo('t-legal-1'); e['dir'] = k; e['fam'] = 'legal'; e['pal'] = dict(L['pal']); e['grad'] = L['grad']; e['musica'] = L['musica']; e['dirFt'] = L['ft']; e['color'] = L['nombre']
            return e
        e = estilo('t-%s-%d' % (fam, k)); e['dir'] = k; e['fam'] = fam if fam in FAMILIAS else 'gen'
        if len(resto) > 1 and resto[1].isdigit():  # color extra: 'd3-tec-2'
            col = COLORES[(int(resto[1]) - 1) % len(COLORES)]; e['pal'] = dict(col['pal']); e['grad'] = col['grad']; e['color'] = col['nombre']
            e['musica'] = musica_para(e['fam'], int(resto[1]), e.get('musica'))  # cada color suena distinto
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
    fk = next((k for k, f in FAMILIAS.items() if f is fam), 'gen'); e['musica'] = musica_para(fk, n, e.get('musica'))
    e['var'] = n % len(fam['variantes']) + 1  # cada variante cambia además el orden de composiciones y transiciones
    return e
