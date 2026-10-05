#!/usr/bin/env bash
# Build the how-to demo videos (English, Hindi, Marathi), 16:9.
#   python audio-tools/generate_demo_vo.py --lang en hi mr     # once: ElevenLabs narration (needs ELEVENLABS_API_KEY)
#   bash scripts/make_demo.sh                                  # set REMOTION_BROWSER to use an existing headless Chrome
#   LANGS="hi" SCALE=2 bash scripts/make_demo.sh               # one language, rendered at 2x for a 4K master
# Without ElevenLabs lines a language falls back to the scratch narration (python audio-tools/scratch_demo_vo.py),
# which is for previews only.
set -euo pipefail
cd "$(dirname "$0")/.."
FF="ffmpeg -hide_banner -loglevel error -y"
OUT=out/demo
LANGS=${LANGS:-"en hi mr"}
SCALE=${SCALE:-1}
BROWSER=()
[ -n "${REMOTION_BROWSER:-}" ] && BROWSER=(--browser-executable="$REMOTION_BROWSER")
declare -A COMP=([en]=Demo-EN [hi]=Demo-HI [mr]=Demo-MR)
declare -A NAME=([en]=English [hi]=Hindi [mr]=Marathi)
mkdir -p "$OUT"

python3 audio-tools/generate_demo_vo.py --convert-only --lang en hi mr   # WAVs + src/demo/timeline.json
(cd audio-tools && python3 generate_demo_music.py)

for L in $LANGS; do
  src=$(python3 -c "import json; print(json.load(open('src/demo/timeline.json'))['$L']['source'])")
  [ "$src" = final ] || echo "warning: $L uses $src narration (not the ElevenLabs lines)"
  npx remotion render "${COMP[$L]}" "$OUT/raw-$L.mp4" --scale="$SCALE" --crf=16 "${BROWSER[@]}"
  npx remotion render "${COMP[$L]}" "$OUT/mix-$L.wav" --codec=wav "${BROWSER[@]}"
  I=$(ffmpeg -hide_banner -i "$OUT/mix-$L.wav" -af loudnorm=print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p' |
    python3 -c "import json,sys; print(json.load(sys.stdin)['input_i'])")
  G=$(python3 -c "print(round(-14 - ($I), 2))")
  AF="afade=t=in:d=0.04,aresample=192000,volume=${G}dB,alimiter=limit=0.708:attack=2:release=60:level=false,aresample=48000"
  $FF -i "$OUT/raw-$L.mp4" -i "$OUT/mix-$L.wav" -map 0:v -map 1:a -vf scale=1920:1080:flags=lanczos \
    -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -af "$AF" -c:a aac -b:a 192k -shortest -movflags +faststart \
    "$OUT/AIShikshaMitra-HowTo-${NAME[$L]}.mp4"
  if [ "$SCALE" = 2 ]; then
    $FF -i "$OUT/raw-$L.mp4" -i "$OUT/mix-$L.wav" -map 0:v -map 1:a -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p \
      -af "$AF" -c:a aac -b:a 256k -shortest -movflags +faststart "$OUT/AIShikshaMitra-HowTo-${NAME[$L]}-4K.mp4"
  fi
  # Under-30 MB copy for WhatsApp / email.
  secs=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/raw-$L.mp4")
  kbps=$(python3 -c "print(int(27.5 * 8192 / $secs - 160))")
  LOG=$(mktemp -d)/x264
  $FF -i "$OUT/raw-$L.mp4" -vf scale=1280:720:flags=lanczos -c:v libx264 -preset slow -b:v ${kbps}k -pass 1 -passlogfile "$LOG" -an -f mp4 /dev/null
  $FF -i "$OUT/raw-$L.mp4" -i "$OUT/mix-$L.wav" -map 0:v -map 1:a -vf scale=1280:720:flags=lanczos -c:v libx264 -preset slow \
    -b:v ${kbps}k -pass 2 -passlogfile "$LOG" -pix_fmt yuv420p -af "$AF" -c:a aac -b:a 128k -shortest -movflags +faststart \
    "$OUT/AIShikshaMitra-HowTo-${NAME[$L]}-share.mp4"
  ls -la "$OUT"/AIShikshaMitra-HowTo-"${NAME[$L]}"*.mp4
done
