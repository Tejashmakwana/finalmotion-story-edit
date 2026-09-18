#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
export HYPERFRAMES_NO_TELEMETRY=1
export HYPERFRAMES_BROWSER_PATH="${HYPERFRAMES_BROWSER_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
export PRODUCER_FORCE_SCREENSHOT=true
mkdir -p review output
node node_modules/hyperframes/bin/hyperframes.mjs check . --json > review/check.json
node node_modules/hyperframes/bin/hyperframes.mjs render . --fps 30 --quality high --crf 16 --workers 1 --low-memory-mode --no-browser-gpu --output review/video-only.mp4 > review/render.log 2>&1
ffmpeg -y -v error -i review/video-only.mp4 -i assets/mix.wav -map 0:v:0 -map 1:a:0 -c:v copy -c:a aac -b:a 192k -shortest -movflags +faststart output/finalmotion-story-hyperframes.mp4
python3 scripts/verify.py
