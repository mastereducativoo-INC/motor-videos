# python3 empalme.py base.mp4 salida.mp4 tramo.mp4:DESDE:HASTA ...   (segundos alineados a 30 fps)
import sys, subprocess
base, sal, tramos = sys.argv[1], sys.argv[2], [x.split(':') for x in sys.argv[3:]]
F = 30; ins = ['-i', base]; f = []; partes = []; pos = 0
for n, (arch, d, h) in enumerate(tramos, 1):
    a, b = round(float(d) * F), round(float(h) * F)
    ins += ['-i', arch]
    f.append(f"[0:v]trim=start_frame={pos}:end_frame={a},setpts=PTS-STARTPTS[p{n}]"); partes.append(f'[p{n}]')
    f.append(f"[{n}:v]setpts=PTS-STARTPTS[t{n}]"); partes.append(f'[t{n}]')
    pos = b
f.append(f"[0:v]trim=start_frame={pos},setpts=PTS-STARTPTS[fin]"); partes.append('[fin]')
f.append(''.join(partes) + f"concat=n={len(partes)}:v=1:a=0[v]")
subprocess.run(['ffmpeg', '-y', '-loglevel', 'error'] + ins + ['-filter_complex', ';'.join(f), '-map', '[v]', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', '30', sal], check=True)
print('ok', sal)
