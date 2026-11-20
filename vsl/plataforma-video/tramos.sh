#!/bin/bash
cd "$(dirname "$0")"
export PORT=${PORT:-8790}
for job in "$@"; do IFS=: read v d h o <<< "$job"
  DSF=0.6667 FPS=30 DESDE=$d HASTA=$h OUT=$o node render.js video x $v > "log_$o.txt" 2>&1 || echo "ERROR $o" >> lanes.log; echo "listo $o" >> lanes.log; done
