"""Music beds for the 30-second reels, locked to src/reels/reels.json.

Twelve bars of groove from the first frame (no slow intro on a reel), a one-bar lift into the end card,
a hit exactly on the end-card frame, then the last chord rings out.
    python audio-tools/generate_reel_music.py
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import fftconvolve

import dsp
from dsp import SR, highpass, lowpass, make_ir, noise, pan, sweep_filter, t_axis
from instruments import bass_note, bell, clap, hat, kick, pad_chord, pluck

ROOT = Path(__file__).resolve().parent.parent
CFG = json.loads((ROOT / "src" / "reels" / "reels.json").read_text())
FPS = CFG["fps"]
TOTAL = CFG["duration"] / FPS
HIT = CFG["endCard"] / FPS
BARS = 12
BAR = HIT / BARS
BEAT = BAR / 4

CHORDS = {
    "C": {"pad": [48, 55, 60, 64, 67], "bass": 36, "arp": [72, 76, 79, 84]},
    "G": {"pad": [50, 55, 59, 62, 67], "bass": 43, "arp": [71, 74, 79, 83]},
    "Am": {"pad": [52, 57, 60, 64, 69], "bass": 45, "arp": [69, 72, 76, 81]},
    "F": {"pad": [48, 53, 57, 60, 65], "bass": 41, "arp": [69, 72, 77, 81]},
}
ARP = [0, 1, 2, 3, 2, 1, 2, 3]


def render(name: str, prog: list, seed: int) -> None:
    dsp.RNG = np.random.default_rng(seed)
    n = int((TOTAL + 0.3) * SR)
    bus = {k: np.zeros((n, 2)) for k in ["pad", "pluck", "bass", "drums", "fx", "bells"]}

    def add(k, x, at):
        i = int(at * SR)
        if i >= n:
            return
        if x.ndim == 1:
            x = np.stack([x, x], axis=1)
        e = min(n, i + len(x))
        bus[k][i:e] += x[: e - i]

    for b in range(BARS + 3):
        t0 = b * BAR
        final = b >= BARS
        ch = CHORDS[prog[b % 4]] if not final else CHORDS[prog[0]]
        lift = b == BARS - 1
        add("pad", pad_chord(ch["pad"], BAR * (3 if final else 1), release=2.5 if final else 0.6) * (1.2 if final else 0.9), t0)
        if final and b > BARS:
            continue
        if not final or b == BARS:
            for s in range(8):
                vel = 0.5 if s % 2 else 0.7
                add("pluck", pan(pluck(ch["arp"][ARP[s]]) * vel, -0.35 if s % 2 else 0.35), t0 + s * BEAT / 2)
        if final:
            add("bass", bass_note(ch["bass"], BAR * 2) * 0.6, t0)
            continue
        for q in range(4):
            add("bass", bass_note(ch["bass"], BEAT * 0.85) * (0.8 if q == 0 else 0.6), t0 + q * BEAT)
            if (not lift or q < 2) and (q in (0, 2) or (b % 2 and q == 3)):
                add("drums", kick() * 0.75, t0 + q * BEAT)
            if q in (1, 3) and not lift:
                add("drums", pan(clap() * 0.45, 0.05), t0 + q * BEAT)
        for e in range(8):
            if not lift:
                add("drums", pan(hat(open_=(e == 7 and b % 2 == 1)) * (0.3 if e % 2 else 0.16), 0.25), t0 + e * BEAT / 2)
        if lift:
            for s in range(16):
                add("drums", pan(clap() * (0.1 + 0.35 * s / 16), 0), t0 + s * BAR / 16)
            r = sweep_filter(noise(BAR), 300, 7000, q=1.4) * np.linspace(0, 1, int(BAR * SR)) ** 2
            add("fx", pan(r, 0) * 0.45, t0)
        # gentle pump on pad and bass
        k0, k1 = int(t0 * SR), int((t0 + BAR) * SR)
        tt = (np.arange(k1 - k0) / SR) % BEAT
        for k in ("pad", "bass"):
            bus[k][k0:k1] *= (1 - 0.3 * np.exp(-tt * 9))[: len(bus[k][k0:k1]), None]

    # opening hit so the reel starts with energy, and the end-card hit
    t = t_axis(2.0)
    boom = np.sin(2 * np.pi * np.cumsum(34 + 70 * np.exp(-t * 10)) / SR) * np.exp(-t * 2.6)
    for at, g in [(0.0, 0.45), (HIT, 0.65)]:
        add("fx", boom * g, at)
        add("drums", kick() * 0.9, at)
        env = np.exp(-t_axis(2.5) * 1.8) * 0.3
        add("fx", np.stack([highpass(noise(2.5), 4000) * env, highpass(noise(2.5), 4000) * env], axis=1), at)
    for i, m in enumerate([84, 88, 91, 96]):
        add("bells", pan(bell(m) * 0.35, -0.45 + i * 0.3), HIT + 0.05 * i)

    ir = make_ir(2.0, 6500)
    gains = {"pad": 0.55, "pluck": 0.5, "bass": 0.32, "drums": 0.55, "fx": 0.5, "bells": 0.32}
    send = {"pad": 0.25, "pluck": 0.28, "bass": 0.0, "drums": 0.1, "fx": 0.3, "bells": 0.45}
    mix = np.zeros((n, 2))
    wet_in = np.zeros((n, 2))
    for k, x in bus.items():
        mix += x * gains[k]
        wet_in += x * gains[k] * send[k]
    wet = np.stack([fftconvolve(wet_in[:, c], ir[:, c])[:n] for c in range(2)], axis=1)
    mix = highpass(mix + wet * 0.9, 35)
    mix = mix - 0.35 * lowpass(mix, 130)
    fo = np.clip((np.arange(n) / SR - (TOTAL - 1.6)) / 1.5, 0, 1)
    mix *= ((1 - fo) ** 1.5)[:, None]
    mix = np.tanh(mix * 1.2) / np.tanh(1.2)
    mix = (mix / np.max(np.abs(mix)) * 0.89)[: int(TOTAL * SR)]
    out = ROOT / "public" / "audio" / "reels" / f"music-{name}.wav"
    sf.write(out, mix.astype(np.float32), SR, subtype="PCM_16")
    print(f"{name}: {len(mix) / SR:.2f}s, bar {BAR:.3f}s ({240 / BAR:.1f} bpm), hit at {HIT:.2f}s")


if __name__ == "__main__":
    for name, reel in CFG["reels"].items():
        render(name, reel["music"]["prog"], reel["music"]["seed"])
