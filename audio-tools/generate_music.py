"""Synthesise the background music bed, locked to the scene timeline in src/timeline.json.

Structure (seconds are derived from the timeline):
  0 → freeze        tension: low drone, ticking clock, slow riser
  freeze → reveal   tape-stop, silence, reverse swell
  reveal            bright D-major chord + bells; 2 bars of pads/plucks
  groove            I–V–vi–IV with bass, plucks, light drums (scenes 3–8)
  breakdown         drums drop out for "Built for Teachers"
  build             riser + snare roll into the final hit
  final hit → end   full chord, short groove, ringing out
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import fftconvolve

from dsp import SR, bandpass, env_adsr, highpass, lowpass, make_ir, midi, noise, pan, reverb, sweep_filter, t_axis

ROOT = Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / "src" / "timeline.json").read_text())
FPS = TL["fps"]


def scene_start(scene_id):
    start = 0
    for s in TL["scenes"]:
        if s["id"] == scene_id:
            return start
        start += s["duration"] - TL["transition"]
    raise KeyError(scene_id)


TOTAL = (sum(s["duration"] for s in TL["scenes"]) - TL["transition"] * (len(TL["scenes"]) - 1)) / FPS
cue = {k: (scene_start(v["scene"]) + v["at"]) / FPS for k, v in TL["cues"].items()}
FREEZE, REVEAL, HIT = cue["freeze"], cue["reveal"], cue["finalHit"]
BARS_TO_HIT = 21
BAR = (HIT - REVEAL) / BARS_TO_HIT
BEAT = BAR / 4
print(f"total {TOTAL:.2f}s  freeze {FREEZE:.2f}  reveal {REVEAL:.2f}  hit {HIT:.2f}  bar {BAR:.3f}s ({240 / BAR:.1f} bpm)")

N = int((TOTAL + 0.5) * SR)
IR = make_ir(2.4, 6500)

# Buses (stereo)
bus = {k: np.zeros((N, 2)) for k in ["pad", "pluck", "bass", "drums", "fx", "bells", "keys"]}
send = {"pad": 0.28, "pluck": 0.3, "bass": 0.0, "drums": 0.12, "fx": 0.35, "bells": 0.45, "keys": 0.35}


def add(name, x, at):
    k = int(at * SR)
    if k >= N:
        return
    if x.ndim == 1:
        x = np.stack([x, x], axis=1)
    end = min(N, k + len(x))
    bus[name][k:end] += x[: end - k]


def bar_time(n):
    return REVEAL + n * BAR


# ---------- instruments ----------

def saw(f, seconds, harmonics=14):
    t = t_axis(seconds)
    y = np.zeros_like(t)
    for k in range(1, harmonics + 1):
        if f * k > 9000:
            break
        y += np.sin(2 * np.pi * f * k * t + k * 0.7) / k
    return y


def pad_chord(notes, seconds, attack=0.45, release=0.9):
    n = int((seconds + release) * SR)
    st = np.zeros((n, 2))
    for m in notes:
        f = midi(m)
        for det, p in [(-0.0045, -0.7), (0.0, 0.0), (0.0045, 0.7)]:
            v = saw(f * (1 + det), seconds + release, 10)
            st += pan(v, p) * 0.33
    env = env_adsr(n, attack, 0.3, 0.8, release)
    st = lowpass(st * env[:, None], 3800)
    return st / max(1, len(notes))


def pluck(m, seconds=0.6, bright=1.0):
    t = t_axis(seconds)
    f = midi(m)
    y = np.zeros_like(t)
    for k in range(1, 9):
        y += np.sin(2 * np.pi * f * k * t) / k ** 1.25 * np.exp(-t * (3.5 + 5.5 * k / bright))
    return y * np.minimum(1, t / 0.002)


def bass_note(m, seconds):
    t = t_axis(seconds)
    f = midi(m)
    y = np.sin(2 * np.pi * f * t) + 0.35 * np.sin(2 * np.pi * 2 * f * t) + 0.12 * np.sin(2 * np.pi * 3 * f * t)
    return y * env_adsr(len(t), 0.01, 0.15, 0.75, 0.08)


def kick():
    t = t_axis(0.5)
    f = 44 + 120 * np.exp(-t * 32)
    y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 7.5)
    y[: int(0.003 * SR)] += highpass(noise(0.003), 2000) * 0.4
    return y


def clap():
    n = int(0.35 * SR)
    y = np.zeros(n)
    for k, a in [(0, 0.8), (0.011, 0.9), (0.022, 1.0)]:
        i = int(k * SR)
        m = int(0.012 * SR)
        y[i : i + m] += noise(0.012) * a
    tail = noise(0.35) * np.exp(-t_axis(0.35) * 16) * 0.7
    y += tail
    return bandpass(y, 900, 4200)


def hat(open_=False):
    s = 0.25 if open_ else 0.05
    return highpass(noise(s), 7500) * np.exp(-t_axis(s) * (14 if open_ else 80))


def bell(m, seconds=2.2, decay=2.2):
    t = t_axis(seconds)
    f = midi(m)
    y = np.sin(2 * np.pi * f * t) + 0.4 * np.sin(2 * np.pi * f * 2.0 * t) * np.exp(-t * 3) + 0.2 * np.sin(2 * np.pi * f * 3.0 * t) * np.exp(-t * 6)
    return y * np.exp(-t * decay) * np.minimum(1, t / 0.003)


def keys(m, seconds=1.8):
    t = t_axis(seconds)
    f = midi(m)
    y = (np.sin(2 * np.pi * f * t) + 0.3 * np.sin(2 * np.pi * 2 * f * t) * np.exp(-t * 4) + 0.1 * np.sin(2 * np.pi * 3 * f * t) * np.exp(-t * 8))
    return y * np.exp(-t * 1.6) * np.minimum(1, t / 0.004)


# ---------- harmony ----------
CHORDS = {
    "D": {"pad": [50, 57, 62, 66, 69], "bass": 38, "arp": [74, 78, 81, 86]},
    "A": {"pad": [52, 57, 61, 64, 69], "bass": 45, "arp": [73, 76, 81, 85]},
    "Bm": {"pad": [54, 59, 62, 66, 71], "bass": 47, "arp": [71, 74, 78, 83]},
    "G": {"pad": [50, 55, 59, 62, 67], "bass": 43, "arp": [71, 74, 79, 83]},
}
PROG = ["D", "A", "Bm", "G"]
ARP_PATTERN = [0, 1, 2, 3, 2, 1, 2, 3]

# ---------- section 1: tension ----------
t1 = t_axis(FREEZE + 0.5)
stop = np.clip((t1 - FREEZE) / 0.45, 0, 1)
pitch = 1 - 0.75 * stop ** 1.5
amp = np.clip(t1 / 4.5, 0, 1) ** 1.3 * (1 - stop)
drone = np.zeros_like(t1)
for m, a in [(38, 1.0), (45, 0.6), (50, 0.35), (51, 0.12)]:
    drone += np.sin(2 * np.pi * np.cumsum(midi(m) * pitch) / SR) * a
trem = 1 - 0.25 * (0.5 + 0.5 * np.sin(2 * np.pi * (2 + 3 * t1 / FREEZE) * t1))
drone *= amp * trem * 0.3
rumble = lowpass(noise(FREEZE + 0.5), 220) * amp * 0.35
riser = np.sin(2 * np.pi * np.cumsum(220 * 2 ** (t1 / FREEZE * 1.0) * pitch) / SR) * amp * 0.12
add("fx", np.stack([drone + rumble + riser, drone * 0.96 + rumble + riser], axis=1), 0)

tk = 0.35
k = 0
while tk < FREEZE - 0.05:
    tt = t_axis(0.04)
    f = 3200 if k % 2 == 0 else 2500
    click = np.sin(2 * np.pi * f * tt) * np.exp(-tt * 170) + highpass(noise(0.04), 5000) * np.exp(-tt * 300) * 0.4
    add("drums", pan(click * (0.3 + 0.3 * tk / FREEZE), 0.35 if k % 2 else -0.35), tk)
    tk += 0.5 - 0.22 * (tk / FREEZE) ** 1.5
    k += 1

# reverse swell into the reveal
sw = 1.25
swell = noise(sw) * np.exp(-t_axis(sw) * 3.2)
swell = reverb(swell, IR, 0.6)[: int(sw * SR)][::-1]
swell = lowpass(swell, 5000) * np.linspace(0.2, 1, len(swell))[:, None] ** 2
add("fx", swell * 0.55, REVEAL - sw)

# ---------- reveal ----------
add("pad", pad_chord([50, 57, 62, 66, 69, 76], BAR * 2, attack=0.03, release=1.2) * 1.3, REVEAL)
for i, m in enumerate([74, 78, 81, 86, 90, 93]):
    add("bells", pan(bell(m) * 0.45, -0.6 + i * 0.24), REVEAL + 0.06 * i)
add("bass", bass_note(38, BAR * 2) * 0.5, REVEAL)
impact_t = t_axis(2.0)
boom = np.sin(2 * np.pi * np.cumsum(34 + 70 * np.exp(-impact_t * 10)) / SR) * np.exp(-impact_t * 2.5)
add("fx", boom * 0.45, REVEAL)

# ---------- main harmony: bars 0..24 ----------
LAST_BAR = int(np.floor((TOTAL - REVEAL) / BAR))
BREAK_START, BUILD_BAR = 18, 20
FINAL_BAR = BARS_TO_HIT
for b in range(2, LAST_BAR + 1):
    t0 = bar_time(b)
    if BREAK_START <= b < BUILD_BAR:
        name = ["G", "A"][b - BREAK_START]
    elif b == BUILD_BAR:
        name = "A"
    elif b >= FINAL_BAR:
        name = ["D", "A", "G", "D"][min(3, b - FINAL_BAR)]
    else:
        name = PROG[(b - 2) % 4]
    ch = CHORDS[name]
    is_tail = b >= FINAL_BAR + 2
    pad_len = BAR * (2.6 if b == LAST_BAR else 1)
    add("pad", pad_chord(ch["pad"], pad_len, release=2.2 if b == LAST_BAR else 0.9) * (1.15 if b >= FINAL_BAR else 1.0), t0)
    # plucked arpeggio
    if b < BREAK_START or (FINAL_BAR <= b < FINAL_BAR + 2):
        for s in range(8):
            m = ch["arp"][ARP_PATTERN[s]]
            vel = 0.55 if s % 2 else 0.75
            add("pluck", pan(pluck(m) * vel, -0.35 if s % 2 else 0.35), t0 + s * BEAT / 2)
    # bass
    if b < BREAK_START or b >= FINAL_BAR:
        if is_tail:
            add("bass", bass_note(ch["bass"], BAR) * 0.45, t0)
        else:
            for q in range(4):
                add("bass", bass_note(ch["bass"], BEAT * 0.9) * (0.85 if q == 0 else 0.65), t0 + q * BEAT)
    # drums
    drums_on = (4 <= b < BREAK_START) or (FINAL_BAR <= b < FINAL_BAR + 2)
    light = b in (2, 3)
    if drums_on or light:
        for q in range(4):
            if q in (0, 2) and (drums_on or q == 0):
                add("drums", kick() * (0.7 if drums_on else 0.45), t0 + q * BEAT)
            if drums_on and q in (1, 3):
                add("drums", pan(clap() * 0.45, 0.05), t0 + q * BEAT)
        for e in range(8):
            if drums_on or e % 2:
                add("drums", pan(hat(open_=(e == 7 and b % 2 == 1)) * (0.32 if e % 2 else 0.18), 0.25), t0 + e * BEAT / 2)
    # sidechain-style pump on pad & bass while drums play
    if drums_on:
        k0, k1 = int(t0 * SR), int((t0 + BAR) * SR)
        tt = (np.arange(k1 - k0) / SR) % BEAT
        pump = 1 - 0.35 * np.exp(-tt * 9)
        for nm in ("pad", "bass"):
            bus[nm][k0:k1] *= pump[: len(bus[nm][k0:k1]), None]

# breakdown keys melody (bars 18-19): gentle and hopeful
for (b, s, m) in [(18, 0, 71), (18, 1, 74), (18, 2, 79), (18, 3, 78), (19, 0, 76), (19, 1, 73), (19, 2, 76), (19, 3, 81)]:
    add("keys", pan(keys(m) * 0.5, -0.15 + 0.1 * s), bar_time(b) + s * BEAT)

# build: riser + snare roll into the hit
bt0 = bar_time(BUILD_BAR)
rs = HIT - bt0
r = sweep_filter(noise(rs), 300, 7000, q=1.4) * np.linspace(0, 1, int(rs * SR)) ** 2
add("fx", pan(r, 0) * 0.5, bt0)
tone = np.sin(2 * np.pi * np.cumsum(np.geomspace(180, 900, int(rs * SR))) / SR) * np.linspace(0, 1, int(rs * SR)) ** 3 * 0.12
add("fx", tone, bt0)
steps = 16
for s in range(steps):
    frac = s / steps
    sub = 2 if frac > 0.5 else 1
    for u in range(sub):
        add("drums", pan(clap() * (0.12 + 0.4 * frac), 0), bt0 + (s + u / sub) * BAR / steps)

# final hit
crash_env = np.exp(-t_axis(3.0) * 1.6) * 0.35
add("fx", np.stack([highpass(noise(3.0), 4000) * crash_env, highpass(noise(3.0), 4000) * crash_env], axis=1), HIT)
add("fx", boom * 0.6, HIT)
for i, m in enumerate([74, 78, 81, 86, 90]):
    add("bells", pan(bell(m) * 0.4, -0.5 + i * 0.25), HIT + 0.05 * i)
add("drums", kick() * 1.0, HIT)

# ---------- mix ----------
gains = {"pad": 0.6, "pluck": 0.5, "bass": 0.3, "drums": 0.55, "fx": 0.55, "bells": 0.32, "keys": 0.45}
mix = np.zeros((N + len(IR) - 1, 2))
wet_in = np.zeros((N, 2))
for name, x in bus.items():
    mix[:N] += x * gains[name]
    wet_in += x * gains[name] * send[name]
wet = np.stack([fftconvolve(wet_in[:, c], IR[:, c]) for c in range(2)], axis=1)
mix += wet * 0.9
mix = mix[:N]
mix = highpass(mix, 35)
mix = mix - 0.35 * lowpass(mix, 130)  # gentle low-shelf cut to keep the bed out of the voice's way

# master fade-out at the end
fade_start = TOTAL - 2.6
fo = np.clip((np.arange(N) / SR - fade_start) / 2.4, 0, 1)
mix *= ((1 - fo) ** 1.5)[:, None]

# gentle soft-clip + normalise
mix = np.tanh(mix * 1.2) / np.tanh(1.2)
mix = mix / np.max(np.abs(mix)) * 0.89
mix = mix[: int(TOTAL * SR)]

out = ROOT / "public" / "audio" / "music.wav"
sf.write(out, mix.astype(np.float32), SR, subtype="PCM_16")
rms = np.sqrt(np.mean(mix ** 2))
print(f"wrote {out} {len(mix) / SR:.2f}s  rms {20 * np.log10(rms):.1f} dBFS")
