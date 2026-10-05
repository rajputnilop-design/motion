"""Placeholder narration for previewing the demo before the ElevenLabs lines exist (Kokoro, offline).

    python audio-tools/scratch_demo_vo.py --models /path/to/kokoro-models

Writes public/audio/demo-scratch/<lang>/<id>.wav. These are timing guides only, not for publishing.
"""
import argparse
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
SCRIPT = json.loads((ROOT / 'src/demo/script.json').read_text())
VOICE = {'en': ('af_heart', 'en-us'), 'hi': ('hf_alpha', 'hi'), 'mr': ('hf_alpha', 'mr')}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--models', default='.')
    ap.add_argument('--lang', nargs='+', default=['en', 'hi', 'mr'])
    a = ap.parse_args()
    k = Kokoro(str(Path(a.models) / 'kokoro-v1.0.onnx'), str(Path(a.models) / 'voices-v1.0.bin'))
    for lang in a.lang:
        voice, code = VOICE[lang]
        out = ROOT / 'public/audio/demo-scratch' / lang
        out.mkdir(parents=True, exist_ok=True)
        for s in SCRIPT['steps']:
            x, sr = k.create(s['vo'][lang], voice=voice, speed=1.0, lang=code)
            x = x / max(1e-6, np.abs(x).max()) * 0.6
            sf.write(out / f"{s['id']}.wav", x.astype(np.float32), sr, subtype='PCM_16')
        print(lang, 'done')


if __name__ == '__main__':
    main()
