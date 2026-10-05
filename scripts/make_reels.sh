#!/usr/bin/env bash
# Render and master the three 30-second 9:16 reel ads.
#   bash scripts/make_reels.sh                  (set REMOTION_BROWSER to use an existing headless Chrome)
#   SKIP_RENDER=1 bash scripts/make_reels.sh    (re-master existing renders only)
# Each reel is rendered at 2x (2160x3840), downscaled to 1080x1920 with lanczos for sharper text, and its
# soundtrack (rendered separately as WAV) is mastered to -14 LUFS (peaks under -1 dBTP), the usual target for Reels/Shorts.
set -euo pipefail
cd "$(dirname "$0")/.."
FF="ffmpeg -hide_banner -loglevel error -y"
OUT=out/reels
BROWSER=()
[ -n "${REMOTION_BROWSER:-}" ] && BROWSER=(--browser-executable="$REMOTION_BROWSER")
mkdir -p "$OUT"

for spec in "Aasha:aasha:Reel1-Aasha" "Papers:papers:Reel2-QuestionPapers" "Toolkit:toolkit:Reel3-Toolkit"; do
  IFS=: read -r comp id name <<<"$spec"
  if [ -z "${SKIP_RENDER:-}" ]; then
    npx remotion render "Reel-$comp" "$OUT/raw-$id.mp4" --scale=2 --crf=16 "${BROWSER[@]}"
    npx remotion render "Reel-$comp" "$OUT/mix-$id.wav" --codec=wav "${BROWSER[@]}"
  fi
  # Gain to -14 LUFS, then a 4x-oversampled limiter at -3 dBFS so the AAC file stays under -1 dBTP.
  I=$(ffmpeg -hide_banner -i "$OUT/mix-$id.wav" -af loudnorm=print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p' |
    python3 -c "import json,sys; print(json.load(sys.stdin)['input_i'])")
  G=$(python3 -c "print(round(-14 - ($I), 2))")
  LN="afade=t=in:d=0.04,aresample=192000,volume=${G}dB,alimiter=limit=0.708:attack=2:release=60:level=false,aresample=48000"
  $FF -i "$OUT/raw-$id.mp4" -i "$OUT/mix-$id.wav" -map 0:v -map 1:a \
    -vf scale=1080:1920:flags=lanczos -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high \
    -af "$LN" -ar 48000 -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT/AIShikshaMitra-$name.mp4"
  echo "$OUT/AIShikshaMitra-$name.mp4"
done
