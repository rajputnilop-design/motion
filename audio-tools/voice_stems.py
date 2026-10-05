"""Write full-length voice-only stems (out/AIShikshaMitra-Voice-<Language>.wav), each line at its frame."""
import json
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / "src" / "timeline.json").read_text())
LOCAL = json.loads((ROOT / "src" / "voiceover.json").read_text())
FPS, SR = TL["fps"], 48000
NAMES = {"en": "English", "mr": "Marathi", "hi": "Hindi"}


def scene_start(scene_id):
    start = 0
    for s in TL["scenes"]:
        if s["id"] == scene_id:
            return start
        start += s["duration"] - TL["transition"]
    raise KeyError(scene_id)


total = sum(s["duration"] for s in TL["scenes"]) - TL["transition"] * (len(TL["scenes"]) - 1)
placements = {
    "en": [{"file": s["vo"]["file"], "scene": s["id"], "at": s["vo"]["at"]} for s in TL["scenes"] if "vo" in s],
    **LOCAL,
}
for lang, rows in placements.items():
    track = np.zeros(int(total / FPS * SR), np.float32)
    for r in rows:
        path = ROOT / "public" / "audio" / "vo" / ("" if lang == "en" else lang) / f"{r['file']}.wav"
        x, sr = sf.read(path, dtype="float32")
        if sr != SR:
            from scipy.signal import resample_poly

            x = resample_poly(x, SR, sr).astype(np.float32)
        k = int((scene_start(r["scene"]) + r["at"]) / FPS * SR)
        track[k : k + len(x)] += x[: len(track) - k]
    sf.write(ROOT / "out" / f"AIShikshaMitra-Voice-{NAMES[lang]}.wav", track, SR, subtype="PCM_16")
    print(f"voice stem {lang}: {len(rows)} lines")
