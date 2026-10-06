"""Timeline for a narration-driven video: each step lasts max(min seconds, lead + line + tail).

    python audio-tools/vo_timeline.py src/apikey/script.json public/audio/apikey src/apikey/timeline.json

Lines are read from <audio dir>/<lang>/<id>.wav; a language with missing lines falls back to an estimate
from the text length (for previews). Only languages every step has a line for are laid out. If the script names
its cut lists ("cuts": "voiceover/x/{lang}-cuts.json") and a cut carries "beats" (phrase onsets in seconds from
the start of the line), they come out as absolute frames, so visuals can land on a phrase.
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
LANGS = [lang for lang in ('en', 'hi', 'mr') if all(lang in s['vo'] for s in SCRIPT['steps'])]


def beats(lang: str) -> dict:
    p = ROOT / SCRIPT['cuts'].format(lang=lang) if 'cuts' in SCRIPT else None
    return {c['id']: c.get('beats', [0]) for c in json.loads(p.read_text())} if p and p.exists() else {}


for lang in LANGS:
    d = audio_dir / lang
    have = all((d / f"{s['id']}.wav").exists() for s in SCRIPT['steps'])
    t, rows, b = 0, [], beats(lang) if have else {}
    for s in SCRIPT['steps']:
        sec = seconds(d / f"{s['id']}.wav") if have else len(s['vo'][lang]) / CPS[lang]
        vo = round(sec * FPS)
        lead = LEAD.get(s['id'], DEFAULT_LEAD)
        dur = max(round(s.get('min', 0) * FPS), lead + vo + TAIL)
        row = {'id': s['id'], 'start': t, 'dur': dur, 'voAt': t + lead, 'voFrames': vo}
        if s['id'] in b:
            row['beats'] = [t + lead + round(x * FPS) for x in b[s['id']]]
        rows.append(row)
        t += dur
    tl[lang] = {'source': 'final' if have else 'estimate', 'voDir': str(d.relative_to(ROOT / 'public')) if have else None, 'total': t, 'steps': rows}
    print(f"{lang}: {tl[lang]['source']}, {t / FPS:.1f}s")
out_path.write_text(json.dumps(tl, indent=1) + '\n')
