#!/usr/bin/env bash
# Render and master the three 30-second 9:16 reel ads.
#   bash scripts/make_reels.sh                  (set REMOTION_BROWSER to use an existing headless Chrome)
#   SKIP_RENDER=1 bash scripts/make_reels.sh    (re-master existing renders only)
# Each reel is rendered at 2x (2160x3840), downscaled to 1080x1920 with lanczos for sharper text, and its
# soundtrack (rendered separately as WAV) is mastered to -14 LUFS / -1.5 dBTP, the usual target for Reels/Shorts.
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
  # Two-pass loudness normalisation: measure, then apply linearly.
  m=$(ffmpeg -hide_banner -i "$OUT/mix-$id.wav" -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
  get() { echo "$m" | python3 -c "import json,sys; print(json.load(sys.stdin)['$1'])"; }
  LN="loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true"
  $FF -i "$OUT/raw-$id.mp4" -i "$OUT/mix-$id.wav" -map 0:v -map 1:a \
    -vf scale=1080:1920:flags=lanczos -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high \
    -af "$LN" -ar 48000 -c:a aac -b:a 192k -movflags +faststart "$OUT/AIShikshaMitra-$name.mp4"
  echo "$OUT/AIShikshaMitra-$name.mp4"
done
