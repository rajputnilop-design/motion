"""Cut narration lines out of one long recording.

    python audio-tools/cut_lines.py voiceover/apikey/hi-full.mp3 voiceover/apikey/hi-cuts.json public/audio/apikey/hi

cuts.json is a list of {id, start, end} in seconds. Every line gets the same gain (to -19 LUFS for the whole
recording), so the narrator's natural dynamics are kept; silence is trimmed and the edges get short fades.
"""
import json
import subprocess
import sys
from pathlib import Path

src, cuts_path, out_dir = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
out_dir.mkdir(parents=True, exist_ok=True)
err = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(src), '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
gain = -19.0 - float(json.loads(err[err.rindex('{'):])['input_i'])
trim = 'silenceremove=start_periods=1:start_threshold=-48dB:start_silence=0.05'
for c in json.loads(cuts_path.read_text()):
    dst = out_dir / f"{c['id']}.wav"
    af = f'{trim},areverse,{trim},areverse,volume={gain:.2f}dB,afade=t=in:d=0.01,areverse,afade=t=in:d=0.03,areverse,aresample=48000'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f"{c['start']:.3f}", '-to', f"{c['end']:.3f}", '-i', str(src), '-af', af, '-ac', '1', '-c:a', 'pcm_s16le', str(dst)], check=True)
    secs = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(dst)], capture_output=True, text=True).stdout)
    print(f"  {dst.parent.name}/{c['id']}: {secs:.2f}s")
