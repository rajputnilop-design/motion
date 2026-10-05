"""Generate the voice-over lines with Kokoro (offline neural TTS).

Usage:
    pip install -r audio-tools/requirements.txt
    # model files: https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
    python audio-tools/generate_vo.py --models /path/to/model-dir

Writes public/audio/vo/<id>.wav and prints each line's duration so the scene
timings in src/timeline.ts can be checked against it.
"""
import argparse
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio" / "vo"

LINES = {
    "vo02": "Meet AI Shiksha Mitra — your smart AI companion for teaching.",
    "vo03": "Create engaging lesson plans in seconds.",
    "vo04": "Generate question papers tailored to your class, subject, and difficulty.",
    "vo05": "Turn your ideas into powerful educational visuals.",
    "vo06": "Build presentations that make complex topics easier to understand.",
    "vo07": "And create engaging educational videos, stories, and learning content with AI.",
    "vo08": "From planning your lesson, to creating your teaching resources — everything is in one place.",
    "vo09": "Because AI should not replace teachers. It should empower them.",
    "vo10": "AI Shiksha Mitra. Teach smarter. Create faster. Inspire more.",
}

# Closer to the Hindi pronunciation of शिक्षा (shik-shaa).
PHONEME_FIXES = {"ʃˈɪkʃə": "ʃˈɪkʃɑː"}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", default=".", help="folder with kokoro-v1.0.onnx and voices-v1.0.bin")
    ap.add_argument("--voice", default="af_heart")
    ap.add_argument("--speed", type=float, default=0.95)
    args = ap.parse_args()

    models = Path(args.models)
    kokoro = Kokoro(str(models / "kokoro-v1.0.onnx"), str(models / "voices-v1.0.bin"))
    OUT.mkdir(parents=True, exist_ok=True)

    durations = {}
    for key, text in LINES.items():
        phonemes = kokoro.tokenizer.phonemize(text, "en-us")
        for a, b in PHONEME_FIXES.items():
            phonemes = phonemes.replace(a, b)
        samples, sr = kokoro.create(phonemes, voice=args.voice, speed=args.speed, is_phonemes=True)
        # 40 ms fade in/out, normalise to -3 dBFS peak.
        fade = int(0.04 * sr)
        env = np.ones_like(samples)
        env[:fade] = np.linspace(0, 1, fade)
        env[-fade:] = np.linspace(1, 0, fade)
        samples = samples * env
        samples = samples / (np.abs(samples).max() + 1e-9) * 0.708
        sf.write(OUT / f"{key}.wav", samples.astype(np.float32), sr, subtype="PCM_16")
        durations[key] = round(len(samples) / sr, 3)
        print(f"{key}  {durations[key]:5.2f}s  {text}")

    print(json.dumps(durations))


if __name__ == "__main__":
    main()
