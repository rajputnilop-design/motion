"""Build src/demo/timeline.json from the demo narration lengths.

Each step lasts max(step.min seconds, lead + line + tail). Uses the final ElevenLabs lines in
public/audio/demo/<lang>/ when every line of a language exists, otherwise the scratch lines in
public/audio/demo-scratch/<lang>/ (for previews), otherwise an estimate from the text length.
"""
import json
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = json.loads((ROOT / 'src/demo/script.json').read_text())
FPS = SCRIPT['fps']
LEAD = {'s01': 46, 's27': 20}  # frames before the line starts (s01 waits for the logo bloom)
DEFAULT_LEAD = 9
TAIL = 15                      # frames of air after each line
CHARS_PER_SEC = {'en': 14.5, 'hi': 13.0, 'mr': 13.0}


def seconds(p: Path) -> float:
    out = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(p)], capture_output=True, text=True)
    return float(out.stdout.strip())


def main():
    steps = SCRIPT['steps']
    tl = {'fps': FPS}
    for lang in ('en', 'hi', 'mr'):
        final = ROOT / 'public/audio/demo' / lang
        scratch = ROOT / 'public/audio/demo-scratch' / lang
        if all((final / f"{s['id']}.wav").exists() for s in steps):
            src, kind = final, 'final'
        elif all((scratch / f"{s['id']}.wav").exists() for s in steps):
            src, kind = scratch, 'scratch'
        else:
            src, kind = None, 'estimate'
        t, rows = 0, []
        for s in steps:
            sec = seconds(src / f"{s['id']}.wav") if src else len(s['vo'][lang]) / CHARS_PER_SEC[lang]
            vo = round(sec * FPS)
            lead = LEAD.get(s['id'], DEFAULT_LEAD)
            dur = max(round(s['min'] * FPS), lead + vo + TAIL)
            rows.append({'id': s['id'], 'start': t, 'dur': dur, 'voAt': t + lead, 'voFrames': vo})
            t += dur
        tl[lang] = {'source': kind, 'voDir': (str(src.relative_to(ROOT / 'public')) if src else None), 'total': t, 'steps': rows}
        print(f'{lang}: {kind}, {t / FPS:.1f}s')
    (ROOT / 'src/demo/timeline.json').write_text(json.dumps(tl, indent=1) + '\n')


if __name__ == '__main__':
    main()
