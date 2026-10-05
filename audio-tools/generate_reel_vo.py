"""Voice-over for the three 30-second reels (Kokoro, voice af_heart).

    python audio-tools/generate_reel_vo.py --models /path/to/kokoro-models

Writes public/audio/reels/<id>.wav and prints the durations used in src/reels/reels.json.
"""
import argparse
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio" / "reels"

LINES = {
    "r1_1": "Teachers, what if planning a lesson took just one sentence?",
    "r1_2": "Meet Aasha, your AI teaching assistant. Just talk to her.",
    "r1_3": "Ask for a lesson plan, and she takes you straight to the planner.",
    "r1_4": "Pick your class and chapter, right from the NCERT syllabus.",
    "r1_5": "And get a period-by-period plan, with a board plan, questions to ask, and homework.",
    "r1_6": "Even local examples your students will recognise.",
    "r1_7": "AI Shiksha Mitra. Plan smarter, starting today.",
    "r2_1": "Still making question papers late at night?",
    "r2_2": "Open Question Paper Studio.",
    "r2_3": "Choose your board, class and chapter. Set the marks you want.",
    "r2_4": "And get a paper aligned to your board, in minutes.",
    "r2_5": "Download it as PDF or Word. Or publish it, and students join with a code.",
    "r2_6": "Their answers are checked for you, with an AI report you can share on WhatsApp.",
    "r2_7": "AI Shiksha Mitra. Papers in minutes, not evenings.",
    "r3_1": "Snap a photo of your marks register,",
    "r3_2": "and get a clean spreadsheet.",
    "r3_3": "The Lab turns photos and notes into sheets, reports, and Word files.",
    "r3_4": "Practise spoken English with Aasha. She explains in your own language.",
    "r3_5": "Preparing for MahaTET? Take real mock tests with official answer keys.",
    "r3_6": "Manage your classes, and learn AI with live courses.",
    "r3_7": "AI Shiksha Mitra. The AI built for Bharat.",
}

PHONEME_FIXES = {"ʃˈɪkʃə": "ʃˈɪkʃɑː", "ˈɛnsˈɜːt": "ˈɛn sˈiː ˈiː ˈɑːɹ tˈiː", "bˈæɹæt": "bˈɑːɹət"}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--models", default=".")
    ap.add_argument("--voice", default="af_heart")
    ap.add_argument("--speed", type=float, default=1.06)
    args = ap.parse_args()
    kokoro = Kokoro(str(Path(args.models) / "kokoro-v1.0.onnx"), str(Path(args.models) / "voices-v1.0.bin"))
    OUT.mkdir(parents=True, exist_ok=True)
    durations = {}
    for key, text in LINES.items():
        ph = kokoro.tokenizer.phonemize(text, "en-us")
        for a, b in PHONEME_FIXES.items():
            ph = ph.replace(a, b)
        x, sr = kokoro.create(ph, voice=args.voice, speed=args.speed, is_phonemes=True)
        fade = int(0.03 * sr)
        x[:fade] *= np.linspace(0, 1, fade)
        x[-fade:] *= np.linspace(1, 0, fade)
        x = x / (np.abs(x).max() + 1e-9) * 0.708
        sf.write(OUT / f"{key}.wav", x.astype(np.float32), sr, subtype="PCM_16")
        durations[key] = round(len(x) / sr, 3)
        print(f"{key}  {durations[key]:5.2f}s  {text}")
    print(json.dumps(durations))


if __name__ == "__main__":
    main()
