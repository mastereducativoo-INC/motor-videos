import json, subprocess, sys
SUF=sys.argv[1] if len(sys.argv)>1 else ''
T=json.load(open(f'tiempos{SUF}.json')); END=T['END']
SFXD='/home/claude/panel-master-educativo/vsl/motion/sfx/elegidos/'
MUS='/home/claude/panel-master-educativo/vsl/motion/musica/infinity.mp3'
ins=[]; f=[]; n=0
for s in T['S']:
    ins+=['-i',f"v{SUF}_{s['k']}.wav"]; f.append(f"[{n}:a]aresample=48000,aformat=channel_layouts=stereo,adelay={int(s['a']*1000)}|{int(s['a']*1000)},volume=1.0[v{n}]"); n+=1
nv=n
for x in T['SFX']:
    ins+=['-i',SFXD+x['f']+'.wav']; f.append(f"[{n}:a]aresample=48000,aformat=channel_layouts=stereo,volume={x['g']*0.55},adelay={int(max(0,x['t'])*1000)}|{int(max(0,x['t'])*1000)}[s{n}]"); n+=1
ins+=['-i',MUS]; m=n
f.append(f"{''.join(f'[v{i}]' for i in range(nv))}amix=inputs={nv}:normalize=0,asplit=2[voz][vozsc]")
f.append(f"[{m}:a]aresample=48000,aformat=channel_layouts=stereo,atrim=0:{END},volume=0.22,afade=t=in:d=1.5,afade=t=out:st={END-2.5}:d=2.5[mus]")
f.append("[mus][vozsc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[musd]")
f.append(f"[voz]{''.join(f'[s{i}]' for i in range(nv,m))}[musd]amix=inputs={2+m-nv}:normalize=0,alimiter=limit=0.95,apad=whole_dur={END}[out]")
cmd=['ffmpeg','-y','-loglevel','error']+ins+['-filter_complex',';'.join(f),'-map','[out]','-t',str(END),'-c:a','pcm_s16le',f'audio{SUF}.wav']
subprocess.run(cmd,check=True); print('ok')
