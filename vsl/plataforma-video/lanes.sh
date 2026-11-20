#!/bin/bash
# uso: ./lanes.sh "VER:DESDE:HASTA:SALIDA" ...   (en serie)
cd "$(dirname "$0")"
for job in "$@"; do IFS=: read v d h o <<< "$job"
  DSF=0.6667 FPS=30 DESDE=$d HASTA=$h OUT=$o node render.js video x $v > "log_$o.txt" 2>&1; echo "listo $o" >> lanes.log; done
