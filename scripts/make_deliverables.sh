#!/usr/bin/env bash
# Build every delivery file from the 4K render and the three language soundtracks.
#   npm run render:4k                                   -> out/raw-4k.mp4
#   npx remotion render AIShikshaMitra out/mix-<lang>.wav --codec=wav --props='{"voLang":"<lang>"}'
#   bash scripts/make_deliverables.sh
set -euo pipefail
cd "$(dirname "$0")/.."
FF="ffmpeg -hide_banner -loglevel error -y"
OUT=out
mkdir -p "$OUT/share"
declare -A NAME=([en]=English [mr]=Marathi [hi]=Hindi)

# 1. Loudness-mastered soundtracks (-16 LUFS, -1.5 dBTP) and voice-only stems.
for L in en mr hi; do
  $FF -i "$OUT/mix-$L.wav" -af loudnorm=I=-16:TP=-1.5:LRA=11 -ar 48000 -c:a pcm_s16le "$OUT/AIShikshaMitra-Soundtrack-${NAME[$L]}.wav"
done
python3 audio-tools/voice_stems.py

# 2. 1080p master, supersampled from the 4K render (English), plus Marathi and Hindi versions.
$FF -i "$OUT/raw-4k.mp4" -i "$OUT/AIShikshaMitra-Soundtrack-English.wav" -map 0:v -map 1:a \
  -vf scale=1920:1080:flags=lanczos -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 256k -movflags +faststart "$OUT/AIShikshaMitra.mp4"
for L in mr hi; do
  $FF -i "$OUT/AIShikshaMitra.mp4" -i "$OUT/AIShikshaMitra-Soundtrack-${NAME[$L]}.wav" -map 0:v -map 1:a \
    -c:v copy -c:a aac -b:a 256k -metadata:s:a:0 language=$( [ $L = mr ] && echo mar || echo hin ) \
    -movflags +faststart "$OUT/AIShikshaMitra-${NAME[$L]}.mp4"
done

# 3. 4K UHD: the full render (video stream as rendered, ~170 MB) and a ~90 MB copy that fits GitHub's
#    100 MB per-file limit (two-pass 10 Mbit/s; SSIM 0.993 against the full file).
$FF -i "$OUT/raw-4k.mp4" -i "$OUT/AIShikshaMitra-Soundtrack-English.wav" -map 0:v -map 1:a -c:v copy \
  -c:a aac -b:a 320k -movflags +faststart "$OUT/AIShikshaMitra-4K-full.mp4"
LOG4K=$(mktemp -d)/x264
$FF -i "$OUT/raw-4k.mp4" -c:v libx264 -preset medium -b:v 10000k -pass 1 -passlogfile "$LOG4K" -an -f mp4 /dev/null
$FF -i "$OUT/raw-4k.mp4" -i "$OUT/AIShikshaMitra-Soundtrack-English.wav" -map 0:v -map 1:a -c:v libx264 -preset medium \
  -b:v 10000k -pass 2 -passlogfile "$LOG4K" -pix_fmt yuv420p -c:a aac -b:a 256k -movflags +faststart "$OUT/AIShikshaMitra-4K.mp4"

# 4. Share copies under 30 MB (two-pass 1080p from the 4K source).
LOG=$(mktemp -d)/x264
$FF -i "$OUT/raw-4k.mp4" -vf scale=1920:1080:flags=lanczos -c:v libx264 -preset slow -b:v 3100k -pass 1 -passlogfile "$LOG" -an -f mp4 /dev/null
$FF -i "$OUT/raw-4k.mp4" -vf scale=1920:1080:flags=lanczos -c:v libx264 -preset slow -b:v 3100k -pass 2 -passlogfile "$LOG" -pix_fmt yuv420p -an "$OUT/share/video.mp4"
for L in en mr hi; do
  $FF -i "$OUT/share/video.mp4" -i "$OUT/AIShikshaMitra-Soundtrack-${NAME[$L]}.wav" -map 0:v -map 1:a -c:v copy \
    -c:a aac -b:a 160k -movflags +faststart "$OUT/share/AIShikshaMitra-${NAME[$L]}-share.mp4"
done
rm "$OUT/share/video.mp4"
ls -la "$OUT" "$OUT/share"
