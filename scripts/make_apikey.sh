#!/usr/bin/env bash
# Build the API key setup reels (English, Hindi, Marathi), 1080x1920.
#   python3 audio-tools/cut_lines.py voiceover/apikey/<lang>-full.mp3 voiceover/apikey/<lang>-cuts.json public/audio/apikey/<lang>
#   python3 audio-tools/vo_timeline.py src/apikey/script.json public/audio/apikey src/apikey/timeline.json
#   bash scripts/make_apikey.sh            # set REMOTION_BROWSER to use an existing headless Chrome
# Rendered at 1.5x and downscaled (sharper UI text), soundtrack mastered to -14 LUFS. The files come out under
# 30 MB, small enough for WhatsApp as they are.
set -euo pipefail
cd "$(dirname "$0")/.."
FF="ffmpeg -hide_banner -loglevel error -y"
OUT=out/apikey
LANGS=${LANGS:-"en hi mr"}
SCALE=${SCALE:-1.5}
BROWSER=()
[ -n "${REMOTION_BROWSER:-}" ] && BROWSER=(--browser-executable="$REMOTION_BROWSER")
declare -A COMP=([en]=ApiKey-EN [hi]=ApiKey-HI [mr]=ApiKey-MR)
declare -A NAME=([en]=English [hi]=Hindi [mr]=Marathi)
mkdir -p "$OUT"

for L in en hi mr; do
  python3 audio-tools/cut_lines.py "voiceover/apikey/$L-full.mp3" "voiceover/apikey/$L-cuts.json" "public/audio/apikey/$L" > /dev/null
done
python3 audio-tools/vo_timeline.py src/apikey/script.json public/audio/apikey src/apikey/timeline.json
(cd audio-tools && python3 generate_apikey_music.py)

for L in $LANGS; do
  npx remotion render "${COMP[$L]}" "$OUT/raw-$L.mp4" --scale="$SCALE" --crf=16 "${BROWSER[@]}"
  npx remotion render "${COMP[$L]}" "$OUT/mix-$L.wav" --codec=wav "${BROWSER[@]}"
  I=$(ffmpeg -hide_banner -i "$OUT/mix-$L.wav" -af loudnorm=print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p' |
    python3 -c "import json,sys; print(json.load(sys.stdin)['input_i'])")
  G=$(python3 -c "print(round(-14 - ($I), 2))")
  AF="afade=t=in:d=0.04,aresample=192000,volume=${G}dB,alimiter=limit=0.708:attack=2:release=60:level=false,aresample=48000"
  $FF -i "$OUT/raw-$L.mp4" -i "$OUT/mix-$L.wav" -map 0:v -map 1:a -vf scale=1080:1920:flags=lanczos \
    -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high -af "$AF" -c:a aac -b:a 192k -shortest \
    -movflags +faststart "$OUT/AIShikshaMitra-APIKey-${NAME[$L]}.mp4"
  ls -la "$OUT"/AIShikshaMitra-APIKey-"${NAME[$L]}"*.mp4
done
