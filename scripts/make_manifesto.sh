#!/usr/bin/env bash
# Build the brand manifesto reel ("AI gives answers. Teachers build minds."), 1080x1920.
#   python3 audio-tools/cut_lines.py voiceover/manifesto/<lang>-full.mp3 voiceover/manifesto/<lang>-cuts.json public/audio/manifesto/<lang>
#   python3 audio-tools/vo_timeline.py src/manifesto/script.json public/audio/manifesto src/manifesto/timeline.json
#   LANGS=mr bash scripts/make_manifesto.sh     # set REMOTION_BROWSER to use an existing headless Chrome
# Rendered at 1.5x and downscaled, soundtrack mastered to -14 LUFS. A file over 30 MB is re-encoded in two passes
# to about 27.5 MB, small enough to forward on WhatsApp quickly.
set -euo pipefail
cd "$(dirname "$0")/.."
FF="ffmpeg -hide_banner -loglevel error -y"
OUT=out/manifesto
LANGS=${LANGS:-"mr"}
SCALE=${SCALE:-1.5}
BROWSER=()
[ -n "${REMOTION_BROWSER:-}" ] && BROWSER=(--browser-executable="$REMOTION_BROWSER")
declare -A COMP=([en]=Manifesto-EN [mr]=Manifesto-MR)
declare -A NAME=([en]=English [mr]=Marathi)
mkdir -p "$OUT"

for L in $LANGS; do
  python3 audio-tools/cut_lines.py "voiceover/manifesto/$L-full.mp3" "voiceover/manifesto/$L-cuts.json" "public/audio/manifesto/$L" > /dev/null
done
python3 audio-tools/vo_timeline.py src/manifesto/script.json public/audio/manifesto src/manifesto/timeline.json
(cd audio-tools && python3 generate_manifesto_audio.py)

for L in $LANGS; do
  npx remotion render "${COMP[$L]}" "$OUT/raw-$L.mp4" --scale="$SCALE" --crf=16 "${BROWSER[@]}"
  npx remotion render "${COMP[$L]}" "$OUT/mix-$L.wav" --codec=wav "${BROWSER[@]}"
  I=$(ffmpeg -hide_banner -i "$OUT/mix-$L.wav" -af loudnorm=print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p' |
    python3 -c "import json,sys; print(json.load(sys.stdin)['input_i'])")
  G=$(python3 -c "print(round(-14 - ($I), 2))")
  AF="afade=t=in:d=0.04,aresample=192000,volume=${G}dB,alimiter=limit=0.708:attack=2:release=60:level=false,aresample=48000"
  DST="$OUT/AIShikshaMitra-TeachersBuildMinds-${NAME[$L]}.mp4"
  $FF -i "$OUT/raw-$L.mp4" -i "$OUT/mix-$L.wav" -map 0:v -map 1:a -vf scale=1080:1920:flags=lanczos \
    -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -profile:v high -af "$AF" -c:a aac -b:a 192k -shortest \
    -movflags +faststart "$DST"
  if [ "$(stat -c %s "$DST")" -gt 30000000 ]; then
    D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$DST")
    V=$(python3 -c "print(int(27.5e6 * 8 / $D / 1000 - 192))")
    P="$OUT/pass-$L"
    $FF -i "$OUT/raw-$L.mp4" -vf scale=1080:1920:flags=lanczos -c:v libx264 -preset slow -b:v "${V}k" -pass 1 -passlogfile "$P" -an -f null /dev/null
    $FF -i "$OUT/raw-$L.mp4" -i "$OUT/mix-$L.wav" -map 0:v -map 1:a -vf scale=1080:1920:flags=lanczos \
      -c:v libx264 -preset slow -b:v "${V}k" -pass 2 -passlogfile "$P" -pix_fmt yuv420p -profile:v high -af "$AF" \
      -c:a aac -b:a 192k -shortest -movflags +faststart "$DST"
    rm -f "$P"-0.log "$P"-0.log.mbtree
  fi
  ls -la "$DST"
done
