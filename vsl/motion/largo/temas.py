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
    # 19 nov: colores para adaptar los estilos aprobados a nichos clásicos (ajedrez, oficios, educación)
    dict(nombre='Azul real y marfil', pal=_pal('#0a1022', '#c9a654', '#e8e1d0', '#f0d79a', '#131b33', ink='#f5f1e8', mut='#a9b0c4', sobre='#14100a'), grad='radial-gradient(1200px 800px at 80% 0%,#1a2650 0%,#0a1022 62%)'),
    dict(nombre='Nogal y marfil', pal=_pal('#120d09', '#d2b07a', '#efe6d2', '#f0d79a', '#1d150f', ink='#f6efe2', mut='#b8a994', sobre='#1a1208'), grad='radial-gradient(1200px 800px at 80% 0%,#2e2015 0%,#120d09 62%)'),
]

# Estilos EXCLUSIVOS de un producto (regla V1, 19 nov): el 3er diseño de cada producto lo crea Claude para su nicho.
# 'd11-gen' = director 11. Paleta, música y tipografía propias; el código de las escenas vive en vsl/motion/pro/dir.js.
DIR_PRODUCTO = {
    11: dict(nombre='Tablero', prod='ajedrez', pal=_pal('#0c0a08', '#d4b06a', '#efe6d2', '#f0d79a', '#17130e', ink='#f6f1e6', mut='#b8ad99', sobre='#14100a'), grad='none', ft=None, musica='musica/expressive-courage.mp3'),
    # 19 nov (regla V1, 2.ª versión): 9 diseños TODOS distintos por producto. Ajedrez: 11 Tablero + estos 8 (código en vsl/motion/pro/nicho.js).
    12: dict(nombre='Reloj', prod='ajedrez', pal=_pal('#efe8da', '#7a2333', '#c9a66b', '#a83a4a', '#f8f3ea', ink='#231a14', mut='#6e6152', sobre='#ffffff'), grad='none', ft='Fraunces', fw=700, ls='-.02em', trs=['fundido', 'barrido'], musica='musica/possible-dreams.mp3'),
    13: dict(nombre='Ranking', prod='ajedrez', pal=_pal('#eef1f6', '#e4572e', '#14213d', '#f08a5d', '#ffffff', ink='#14213d', mut='#5c6b82', sobre='#ffffff'), grad='none', ft='Sora', fw=800, ls='-.03em', trs=['lateral', 'sube'], musica='musica/uplifting-bass.mp3'),
    14: dict(nombre='Pizarra', prod='ajedrez', pal=_pal('#22272b', '#f2c94c', '#8fb3d9', '#f7dc8a', '#2c3237', ink='#f1efe8', mut='#a7adb2', sobre='#1d1f21'), grad='none', ft='DMSerif', fw=400, ls='0em', trs=['fundido', 'zoom'], musica='musica/infinity.mp3'),
    15: dict(nombre='Mármol', prod='ajedrez', pal=_pal('#f5f2ed', '#9c6b2f', '#2b2b2b', '#c08a45', '#ffffff', ink='#1f1d1a', mut='#77706a', sobre='#ffffff'), grad='none', ft='Playfair', fw=700, ls='-.01em', trs=['fundido'], musica='musica/special-days.mp3'),
    16: dict(nombre='Planilla', prod='ajedrez', pal=_pal('#f7f4ea', '#c0392b', '#1f3a6b', '#e05a4c', '#fffdf6', ink='#17233b', mut='#5b6476', sobre='#ffffff'), grad='none', ft='Epilogue', fw=800, ls='-.03em', trs=['sube', 'barrido'], musica='musica/talent-in-the-air.mp3'),
    17: dict(nombre='Blitz', prod='ajedrez', pal=_pal('#121212', '#ff6b1a', '#f5f5f5', '#ffa45c', '#1d1d1d', ink='#fafafa', mut='#a0a0a0', sobre='#121212'), grad='none', ft='BigShoulders', fw=900, ls='0em', trs=['zoom', 'lateral', 'panel'], musica='musica/gear.mp3'),
    18: dict(nombre='Isométrico', prod='ajedrez', pal=_pal('#1b1d3a', '#e9c46a', '#6c7bd1', '#f4d58d', '#24274a', ink='#f3f1ea', mut='#a5a8c4', sobre='#1b1d3a'), grad='none', ft='Syne', fw=800, ls='-.02em', trs=['zoom', 'sube'], musica='musica/close-up.mp3'),
    19: dict(nombre='Geométrico', prod='ajedrez', pal=_pal('#f1ece1', '#d1495b', '#00798c', '#edae49', '#ffffff', ink='#1d1d1b', mut='#6b675f', sobre='#ffffff'), grad='none', ft='Archivo', fw=800, ls='-.025em', trs=['barrido', 'panel'], musica='musica/skyline.mp3'),
}


# Directores exclusivos de abogados (18 nov): 5 mundos visuales del derecho, cada uno con su paleta, tipografía y música.
DIR_LEGAL = {
    6: dict(nombre='Despacho', pal=_pal('#120d09', '#c39548', '#5a2e1f', '#e6c27a', '#1d150f', ink='#f4ece0', mut='#b5a796', sobre='#1a1208'), grad='none', ft=None, musica='musica/special-days.mp3'),
    7: dict(nombre='Expediente', pal=_pal('#111214', '#b3262c', '#c9a46a', '#e0524b', '#1b1c20', ink='#f2efe9', mut='#a7a49d', sobre='#ffffff'), grad='none', ft=None, musica='musica/it-s-love.mp3'),
    # 18 nov: a Christian no le gustó la serifa del Tribunal; Código y Legal digital descartados → Cine y Keynote
    8: dict(nombre='Tribunal', pal=_pal('#0c0c0e', '#c9a654', '#e8e3d8', '#ecd08a', '#17171a', ink='#f5f2ea', mut='#aaa59a', sobre='#16120a'), grad='none', ft=None, musica='musica/romantic-getaway.mp3'),
    9: dict(nombre='Cine', pal=_pal('#0a0a0b', '#d4b06a', '#8a6a3a', '#f0d79a', '#141416', ink='#f7f3ea', mut='#b9b2a4', sobre='#16120a'), grad='none', ft=None, musica='musica/tears-of-joy.mp3'),  # 19 nov: Cine entra a la biblioteca automática; su música ya no repite la de Reloj (d12)
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
    if clave[:2] == 'mk' and clave[2:3].isdigit():
        # 19 nov: video de venta del producto PRINCIPAL (Marketplace). Motor vsl/motion/mkt, 5 directores (mk1..mk5).
        k = max(1, min(5, int(clave[2]))); fam = clave.split('-')[1] if '-' in clave else 'gen'
        if fam in MKT_MUNDOS:  # 23 nov: el mundo del nicho (mkt/mundos.js) con la música de su kit; nada del estilo de DJ
            M = MKT_MUNDOS[fam]
            return dict(COMUN, motor='mkt', mk=k, tema=False, nicho=fam, musica='musica/%s.mp3' % M['musica'][k - 1], nombre=M['nombres'][k - 1])
        mus = {1: 'musica/house-fest.mp3', 2: 'musica/gear.mp3', 3: 'musica/deep-techno.mp3', 4: 'musica/uplifting-bass.mp3', 5: 'musica/b-o-r-n.mp3'}[k] if fam == 'dj' else musica_para(fam if fam in FAMILIAS else 'gen', k - 1, 'musica/savana.mp3')
        return dict(COMUN, motor='mkt', mk=k, tema=False, nicho='dj' if fam == 'dj' else '', musica=mus, nombre=['Club', 'Vinilo', 'Cabina', 'Cartel', 'Cine'][k - 1])
    if len(clave) > 4 and clave[0] == 'f' and clave[1:3].isdigit() and clave[3] == '-':
        # 19 nov 20:18 (Christian): el diseño APROBADO de DJ («Morado profundo», f05, motor clásico) se usa en todos los productos.
        # Fuera de DJ se quita todo lo de audio (vinilo, ondas, ecualizador, disco) y la música se elige para el nicho.
        from estilo_final import VIDEOS as _FIN
        fam = clave[4:].split('-')[0]; base = next((v for v in _FIN if v['id'] == clave[:3]), _FIN[4])
        e = dict(base['estilo']); e['fam'] = fam if fam in FAMILIAS else ('dj' if fam == 'dj' else 'gen'); e['color'] = base['titulo'].split('·')[-1].strip()
        if fam != 'dj':
            e['fondo'] = ['halo', 'particulas']; e['deco'] = 'aro' if e.get('deco') in ('disco', 'ondas', 'sol') else e.get('deco')
            e['musica'] = musica_para(e['fam'], 0, 'musica/summer-fun.mp3'); e['musicaFija'] = True
        return e
    if len(clave) > 3 and clave[0] == 'd' and clave[1].isdigit() and (clave[2] == '-' or (clave[2].isdigit() and clave[3] == '-')):
        # 'd3-legal' = director 3 (otra interpretación visual de todas las escenas) con la familia legal
        resto = clave[clave.index('-') + 1:].split('-'); fam = resto[0]
        num = ''.join(ch for ch in clave[1:3] if ch.isdigit()); k = int(num)
        if k in DIR_LEGAL or k in DIR_PRODUCTO:  # 'd6-legal' … 'd10-legal', 'd11-gen' …
            # 19 nov: el Tribunal (d8, aprobado) se reutiliza en otros nichos: la familia ya NO se fuerza a 'legal',
            # así dir.js cambia los objetos del derecho (mazo, balanza) por los del nicho.
            L = DIR_LEGAL.get(k) or DIR_PRODUCTO[k]; fam2 = fam if fam in FAMILIAS else 'gen'
            e = estilo('t-%s-1' % fam2); e['dir'] = k; e['fam'] = fam2; e['pal'] = dict(L['pal']); e['grad'] = L['grad']; e['musica'] = L['musica']; e['dirFt'] = L['ft']; e['color'] = L['nombre']
            for a, b in (('fw', 'dirFw'), ('ls', 'dirLs'), ('trs', 'trs'), ('fb', 'fb')):  # tipografía y transiciones propias (19 nov)
                if L.get(a) is not None: e[b] = L[a]
            if L.get('ft'): e['fuentes'] = [L['ft']]
            if len(resto) > 1 and resto[1].isdigit():  # color de adaptación al nicho: 'd8-gen-8'
                col = COLORES[(int(resto[1]) - 1) % len(COLORES)]; e['pal'] = dict(col['pal']); e['grad'] = col['grad']; e['color'] = L['nombre'] + ' · ' + col['nombre']
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


# ---------------- MUNDOS DEL MARKETPLACE (23 nov 2026) ----------------
# Video de venta del Marketplace (motor mkt): cada nicho con mundo propio en vsl/motion/mkt/mundos.js. Nombres y música de sus 5 directores.
# Un nicho nuevo se agrega aquí Y en mundos.js (y en NICHOS_MKT de functions/_lib/mkt.js).
MKT_MUNDOS = {
    'dibujo': dict(nombres=['Mesa de dibujo', 'Rueda de color', 'App de dibujo', 'Cuaderno de bocetos', 'Galería'],
                   musica=['sounds-good', 'light-it-up-boy', 'funky-martian', 'year-2001', 'dirty-thinkin']),
    'mecanica': dict(nombres=['Pista', 'Velocímetro', 'Escáner', 'Orden de servicio', 'Taller'],
                     musica=['ko', 'sports-rock', 'caught-on-tape', 'rock-the-game', 'im-all-heart']),
}


# ---------------- KIT DEL NICHO (Christian, 20 nov 2026) ----------------
# «la música… que sea relacionada con el nicho, que no sea tan tranquila». Cada uno de los 9 diseños de un nicho con kit
# lleva su propia pista enérgica del nicho (Mixkit, licencia gratuita). Mecánica: rock de autos y garage. Dibujo: funk creativo.
# El orden sigue la biblioteca automática (fabrica.js): Tablero, Mesa, Keynote, Pantalla viva, Expediente, Isométrico, Tribunal, Despacho, Cinético.
KIT_ORDEN = [11, 4, 10, 3, 7, 5, 8, 6, 2]
KIT_MUSICA = {
    'mecanica': ['ko', 'sports-rock', 'caught-on-tape', 'rock-the-game', 'im-all-heart', 'how-does-it-feel', 'cold-coffee', 'hooligans', 'oh-my-joe'],
    'dibujo': ['sounds-good', 'light-it-up-boy', 'funky-martian', 'year-2001', 'dirty-thinkin', 'cherry-on-top', 'simon-says', 'five', 'gimme-that-groove'],
}


def nichos_foto():
    """Kits fotográficos del nicho (vsl/motion/pro/nichos.json, 22 nov 2026): fotos hiperrealistas del Laboratorio, 9 paletas,
    letras, transiciones y 9 pistas propias por nicho. Un nicho nuevo solo se agrega en ese archivo."""
    import json
    try:
        N = json.load(open(_os.path.join(_os.path.dirname(_os.path.abspath(__file__)), '..', 'pro', 'nichos.json'), encoding='utf-8'))
    except Exception:
        return {}
    return {k: x for k, x in N.items() if not k.startswith('_') and isinstance(x, dict)}


def kit_de(prod, E):
    """Nicho con kit para este producto y diseño: {'nicho', 'v', 'musica'[, 'foto']} o None (sin kit: el diseño queda como está)."""
    import re, unicodedata
    t = ' '.join(str((prod or {}).get(k) or '') for k in ('nicho', 'curso', 'oferta', 'producto'))
    t = unicodedata.normalize('NFD', t.lower()); t = ''.join(ch for ch in t if unicodedata.category(ch) != 'Mn')
    nicho = 'mecanica' if re.search(r'mecanic|automotr|motocicl|\bmotos?\b', t) else 'dibujo' if re.search(r'dibuj|ilustrac|boceto|acuarel', t) else None
    foto = None
    if not nicho:
        for k, x in nichos_foto().items():
            if x.get('detecta') and re.search(x['detecta'], t):
                nicho, foto = k, x
                break
    if not nicho or not E or not E.get('dir'):
        return None
    d = int(E.get('dir'))
    v = KIT_ORDEN.index(d) if d in KIT_ORDEN else 0
    if foto:
        conf = {k: foto.get(k) for k in ('nombre', 'firma', 'emblema', 'letras', 'vocab', 'fondo')}
        conf.update(paleta=foto['paletas'][v % len(foto['paletas'])], trs=foto['trs'][v % len(foto['trs'])], diseno=foto['disenos'][v % len(foto['disenos'])])
        return dict(nicho=nicho, v=v, musica='musica/%s.mp3' % foto['musica'][v % len(foto['musica'])], foto=conf)
    return dict(nicho=nicho, v=v, musica='musica/%s.mp3' % KIT_MUSICA[nicho][v])
