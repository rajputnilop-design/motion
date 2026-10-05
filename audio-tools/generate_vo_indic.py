"""Generate the Marathi and Hindi voice-overs with AI4Bharat Indic-TTS (FastPitch + HiFi-GAN).

Models: https://github.com/AI4Bharat/Indic-TTS/releases/tag/v1-checkpoints-release (mr.zip, hi.zip)
Runtime: pip install TTS==0.22.0   (Coqui TTS; pulls in PyTorch). With PyTorch >= 2.6 run with
         TORCH_FORCE_NO_WEIGHTS_ONLY_LOAD=1, as these checkpoints predate the weights-only loader.

Usage:
    python audio-tools/generate_vo_indic.py --models /path/to/checkpoints --lang mr hi

Writes public/audio/vo/<lang>/<id>.wav and the placements in src/voiceover.json. Each line is fitted to the
time the English line has in the same scene (gently sped up if needed, never more than 15%).
"""
import argparse
import json
import subprocess
import tempfile
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

ROOT = Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / "src" / "timeline.json").read_text())
FPS = TL["fps"]
OUT_SR = 48000

# (id, scene, earliest start frame, latest end frame within the scene, text)
# End frames keep each line inside its scene, clear of the next scene's line. Lines that share a scene are
# placed one after another; the three end-title phrases (CTA frames 66 / 97 / 126) share one window and
# one tempo so they keep an even rhythm.
LINES = {
    "hi": [
        ("vo02", "intro", 18, 189, "मिलिए ए आई शिक्षामित्र से, पढ़ाने में आपका स्मार्ट ए आई साथी."),
        ("vo03", "lesson", 15, 204, "कुछ ही सेकंड में बनाइए, रोचक पाठ योजनाएँ."),
        ("vo04", "papers", 15, 234, "अपनी कक्षा, विषय और कठिनाई के अनुसार, प्रश्न पत्र तैयार कीजिए."),
        ("vo05", "visuals", 18, 194, "अपने विचारों को, असरदार शैक्षिक चित्रों में बदलिए."),
        ("vo06", "slides", 15, 204, "ऐसे प्रेज़ेंटेशन बनाइए, जो कठिन विषयों को भी आसान बना दें."),
        ("vo07", "videos", 15, 219, "और ए आई की मदद से बनाइए, रोचक शैक्षिक वीडियो, कहानियाँ और सीखने की सामग्री."),
        ("vo08", "all", 15, 209, "पाठ की योजना से लेकर, पढ़ाने की हर सामग्री तक, सब कुछ, एक ही जगह."),
        ("vo09", "teachers", 26, 194, "क्योंकि ए आई को शिक्षकों की जगह नहीं लेनी चाहिए, बल्कि उन्हें सशक्त बनाना चाहिए."),
        ("vo10a", "cta", 18, 62, "ए आई शिक्षामित्र."),
        ("vo10b", "cta", 66, 186, "स्मार्ट तरीके से पढ़ाइए."),
        ("vo10c", "cta", 97, 186, "तेज़ी से बनाइए."),
        ("vo10d", "cta", 126, 186, "और ज़्यादा प्रेरित कीजिए."),
    ],
    "mr": [
        ("vo02", "intro", 18, 189, "भेटा ए आय शिक्षामित्रला, शिकवण्यासाठी तुमचा स्मार्ट साथी."),
        ("vo03", "lesson", 15, 204, "काही सेकंदांत तयार करा, आकर्षक पाठ नियोजन."),
        ("vo04", "papers", 15, 234, "तुमचा वर्ग, विषय आणि काठिण्य पातळीनुसार, प्रश्नपत्रिका तयार करा."),
        ("vo05", "visuals", 18, 194, "तुमच्या कल्पनांना, प्रभावी शैक्षणिक चित्रांमध्ये बदला."),
        ("vo06", "slides", 15, 204, "अवघड विषयही सोपे करणारी, सादरीकरणे तयार करा."),
        ("vo07", "videos", 15, 219, "आणि ए आयने तयार करा, शैक्षणिक व्हिडिओ, गोष्टी आणि अध्ययन साहित्य."),
        ("vo08", "all", 15, 209, "पाठ नियोजनापासून शिकवण्याच्या साहित्यापर्यंत, सर्व काही एकाच ठिकाणी."),
        ("vo09", "teachers", 26, 194, "कारण ए आयने शिक्षकांची जागा घेऊ नये, तर त्यांना सक्षम करावे."),
        ("vo10a", "cta", 18, 62, "ए आय शिक्षामित्र."),
        ("vo10b", "cta", 66, 186, "स्मार्ट शिकवा."),
        ("vo10c", "cta", 97, 186, "झटपट बनवा."),
        ("vo10d", "cta", 126, 186, "अधिक प्रेरणा द्या."),
    ],
}

MAX_SPEEDUP = 1.15
GAP_FRAMES = 4


def trim(x: np.ndarray, sr: int, thresh_db: float = -45) -> np.ndarray:
    hop = int(sr * 0.01)
    rms = np.array([np.sqrt(np.mean(x[i : i + hop] ** 2) + 1e-12) for i in range(0, len(x) - hop, hop)])
    on = np.where(20 * np.log10(rms + 1e-12) > thresh_db + 20 * np.log10(np.max(np.abs(x)) + 1e-9))[0]
    if len(on) == 0:
        return x
    a = max(0, on[0] * hop - int(0.03 * sr))
    b = min(len(x), (on[-1] + 1) * hop + int(0.08 * sr))
    return x[a:b]


def atempo(x: np.ndarray, sr: int, factor: float) -> np.ndarray:
    with tempfile.TemporaryDirectory() as d:
        src, dst = Path(d) / "in.wav", Path(d) / "out.wav"
        sf.write(src, x, sr)
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(src), "-af", f"atempo={factor:.4f}", str(dst)], check=True)
        y, _ = sf.read(dst, dtype="float32")
    return y


def main() -> None:
    from TTS.utils.synthesizer import Synthesizer

    ap = argparse.ArgumentParser()
    ap.add_argument("--models", required=True, help="folder containing mr/ and hi/ checkpoint folders")
    ap.add_argument("--lang", nargs="+", default=["mr", "hi"])
    ap.add_argument("--speaker", default="female")
    args = ap.parse_args()

    placements = json.loads((ROOT / "src" / "voiceover.json").read_text())
    for lang in args.lang:
        m = Path(args.models) / lang
        # The released configs point at the speakers file by its training path; point it at this copy.
        cfg = json.loads((m / "fastpitch" / "config.json").read_text())
        speakers = str((m / "fastpitch" / "speakers.pth").resolve())
        cfg["speakers_file"] = speakers
        cfg.setdefault("model_args", {})["speakers_file"] = speakers
        cfg_path = Path(tempfile.mkdtemp()) / "config.json"
        cfg_path.write_text(json.dumps(cfg))
        synth = Synthesizer(
            tts_checkpoint=str(m / "fastpitch" / "best_model.pth"),
            tts_config_path=str(cfg_path),
            tts_speakers_file=str(m / "fastpitch" / "speakers.pth"),
            vocoder_checkpoint=str(m / "hifigan" / "best_model.pth"),
            vocoder_config=str(m / "hifigan" / "config.json"),
            use_cuda=False,
        )
        sr = synth.output_sample_rate
        out_dir = ROOT / "public" / "audio" / "vo" / lang
        out_dir.mkdir(parents=True, exist_ok=True)
        clips = []
        for vid, scene, start, end, text in LINES[lang]:
            wav = trim(np.array(synth.tts(text, speaker_name=args.speaker), dtype=np.float32), sr)
            clips.append([vid, scene, start, end, text, wav])

        # One tempo per (scene, end) window, just fast enough for every line in it to fit.
        windows = {}
        for vid, scene, start, end, text, wav in clips:
            w = windows.setdefault((scene, end), {"start": start, "frames": 0})
            w["frames"] += int(np.ceil(len(wav) / sr * FPS)) + GAP_FRAMES
        rows = []
        prev_end = {}
        for vid, scene, start, end, text, wav in clips:
            w = windows[(scene, end)]
            factor = max(1.0, w["frames"] / (end - w["start"]))
            if factor > MAX_SPEEDUP:
                print(f"  ! {lang} {vid}: needs x{factor:.2f}, capped at x{MAX_SPEEDUP}")
                factor = MAX_SPEEDUP
            if factor > 1.001:
                wav = atempo(wav, sr, factor)
            at = max(start, prev_end.get(scene, 0) + GAP_FRAMES)
            dur = len(wav) / sr
            fade = int(0.03 * sr)
            wav[:fade] *= np.linspace(0, 1, fade)
            wav[-fade:] *= np.linspace(1, 0, fade)
            wav = wav / (np.abs(wav).max() + 1e-9) * 0.708
            sf.write(out_dir / f"{vid}.wav", resample_poly(wav, OUT_SR, sr).astype(np.float32), OUT_SR, subtype="PCM_16")
            prev_end[scene] = at + int(np.ceil(dur * FPS))
            fits = "ok" if prev_end[scene] <= end else f"OVER by {(prev_end[scene] - end) / FPS:.2f}s"
            print(f"{lang} {vid:6s} at {at:3d}  {dur:5.2f}s  ends {prev_end[scene]:3d}/{end}  x{factor:.2f}  {fits}  {text}")
            rows.append({"file": vid, "scene": scene, "at": int(at), "seconds": round(dur, 3)})
        placements[lang] = rows
    (ROOT / "src" / "voiceover.json").write_text(json.dumps(placements, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
