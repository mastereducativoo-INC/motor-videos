"""Escucha el video terminado con earshot y devuelve un resumen corto para la revisión de calidad (18 nov 2026)."""
import json, subprocess, sys


def escuchar(video):
    r = subprocess.run(['earshot', 'critique', video, '--json'], capture_output=True, text=True, timeout=900)
    try:
        o = json.loads(r.stdout)
    except Exception:
        return {'ok': False, 'error': (r.stderr or '')[-300:]}
    txt = json.dumps(o, ensure_ascii=False)
    acc = [{'peso': a.get('weight'), 'que': a.get('metric'), 'arreglo': a.get('action')} for a in (o.get('actions') or []) if isinstance(a, dict)]
    return {'ok': True, 'veredicto': o.get('verdict') or '', 'puntaje': o.get('score'), 'en_rango': f"{o.get('in_range')} de {o.get('scored')}", 'arreglos': acc[:6], 'crudo': txt[:4000]}


if __name__ == '__main__':
    print(json.dumps(escuchar(sys.argv[1]), ensure_ascii=False))
