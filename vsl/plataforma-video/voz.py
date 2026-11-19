import json, soundfile as sf, numpy as np, sys
from kokoro_onnx import Kokoro
K = Kokoro("../kok/kokoro-v1.0.onnx", "../kok/voices-v1.0.bin")
G = [
 ("bienvenida","Bienvenido a Master Educativo. Gracias por confiar en nosotros. Ahora te muestro, paso a paso, cómo funciona tu plataforma."),
 ("curso","Arriba siempre vas a encontrar el curso que compraste. Tocas «Abrir mi curso», y se abre en Gúgol Dráiv: puedes verlo en línea o descargarlo, y tu acceso no caduca."),
 ("instalar","Si quieres tenerlo siempre a un toque, presiona «Instalar», y la plataforma queda en tu celular con el logo de Master Educativo."),
 ("complementos","Debajo de este video están los complementos de tu curso: herramientas extra que lo acompañan, cada una con su descripción, para que sepas exactamente qué incluye. Y por ser alumno, tienen un precio especial."),
 ("superpack","Al final está el Súper Pak: el siguiente nivel. Es la versión más completa, para quien quiere llevar su aprendizaje mucho más lejos."),
 ("activa","Desbloquearlos es muy fácil. Tocas el botón, pagas, y en cuanto se aprueba tu pago, se activa aquí mismo: el candado se abre, y lo encuentras en tu biblioteca, listo para abrir."),
 ("todo","Y si lo quieres todo, con «Lo quiero todo» te llevas todos los complementos y el Súper Pak en una sola compra, a un mejor precio. Así tienes tu curso completo, en un mismo lugar."),
 ("cierre","Eso es todo. Disfruta tu curso. Y otra vez: bienvenido a Master Educativo."),
]
voz = sys.argv[1] if len(sys.argv)>1 else "em_alex"
out=[]; sr=24000
for k,t in G:
    s, sr = K.create(t, voice=voz, speed=1.04, lang="es")
    # recorta silencios de los extremos
    a=np.abs(s); idx=np.where(a>0.01)[0]; s=s[max(0,idx[0]-1200):idx[-1]+2400]
    sf.write(f"v_{k}.wav", s, sr); out.append({"k":k,"t":t,"d":round(len(s)/sr,3)})
json.dump(out, open("voz.json","w"), ensure_ascii=False, indent=1)
print(json.dumps([(o["k"],o["d"]) for o in out]), sum(o["d"] for o in out))
