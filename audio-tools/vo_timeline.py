"""Timeline for a narration-driven video: each step lasts max(min seconds, lead + line + tail).

    python audio-tools/vo_timeline.py src/apikey/script.json public/audio/apikey src/apikey/timeline.json

Lines are read from <audio dir>/<lang>/<id>.wav; a language with missing lines falls back to an estimate
from the text length (for previews).
"""
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
script_path, audio_dir, out_path = (ROOT / a for a in sys.argv[1:4])
SCRIPT = json.loads(script_path.read_text())
FPS = SCRIPT['fps']
LEAD = SCRIPT.get('lead', {})          # per-step frames before the line starts
DEFAULT_LEAD = SCRIPT.get('defaultLead', 8)
TAIL = SCRIPT.get('tail', 12)
CPS = {'en': 14.5, 'hi': 13.4, 'mr': 12.6}


def seconds(p: Path) -> float:
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(p)], capture_output=True, text=True)
    return float(out.stdout.strip())


tl = {'fps': FPS}
for lang in ('en', 'hi', 'mr'):
    d = audio_dir / lang
    have = all((d / f"{s['id']}.wav").exists() for s in SCRIPT['steps'])
    t, rows = 0, []
    for s in SCRIPT['steps']:
        sec = seconds(d / f"{s['id']}.wav") if have else len(s['vo'][lang]) / CPS[lang]
        vo = round(sec * FPS)
        lead = LEAD.get(s['id'], DEFAULT_LEAD)
        dur = max(round(s.get('min', 0) * FPS), lead + vo + TAIL)
        rows.append({'id': s['id'], 'start': t, 'dur': dur, 'voAt': t + lead, 'voFrames': vo})
        t += dur
    tl[lang] = {'source': 'final' if have else 'estimate', 'voDir': str(d.relative_to(ROOT / 'public')) if have else None, 'total': t, 'steps': rows}
    print(f"{lang}: {tl[lang]['source']}, {t / FPS:.1f}s")
out_path.write_text(json.dumps(tl, indent=1) + '\n')
