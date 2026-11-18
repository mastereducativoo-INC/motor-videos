"""Renderiza un motion graphic (HTML) a MP4: recorre el tiempo cuadro por cuadro en Chromium y le pone música y efectos.
Uso: python render.py <nombre> [salida.mp4]"""
import asyncio, os, subprocess, sys
import numpy as np
AQUI = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(AQUI))
import audio
from playwright.async_api import async_playwright

FPS = 30


async def main(nombre, salida):
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width': 1920, 'height': 1080}, device_scale_factor=1)
        await pg.goto('file://' + os.path.join(AQUI, nombre + '.html'))
        await pg.wait_for_load_state('networkidle')
        await pg.evaluate('document.fonts.ready')
        dur = float(await pg.evaluate('window.DUR'))
        sfx = await pg.evaluate('window.SFX || []')
        mus = await pg.evaluate('window.MUSICA || "dj"')
        wav = salida + '.wav'
        audio.mezcla(np.zeros(int(dur * audio.SR) + audio.SR, np.float32), [(float(a), str(n)) for a, n in sfx], dur, mus, wav)
        ff = subprocess.Popen(['ffmpeg', '-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-r', str(FPS), '-i', '-', '-i', wav,
                               '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', salida], stdin=subprocess.PIPE)
        for f in range(int(dur * FPS)):
            await pg.evaluate('t => window.__seek(t)', f / FPS)
            ff.stdin.write(await pg.screenshot(type='jpeg', quality=93))
        ff.stdin.close()
        ff.wait()
        os.remove(wav)
        await b.close()
    print('listo', salida, dur)

if __name__ == '__main__':
    n = sys.argv[1]
    asyncio.run(main(n, sys.argv[2] if len(sys.argv) > 2 else os.path.join(AQUI, 'salida', n + '.mp4')))
