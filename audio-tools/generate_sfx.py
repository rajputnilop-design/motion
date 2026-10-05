"""Synthesise the UI / transition sound effects into public/audio/sfx/*.wav."""
from pathlib import Path

import numpy as np
import soundfile as sf

from dsp import (SR, RNG, exp_decay, fade, highpass, lowpass, make_ir, midi, noise, normalize, pan, reverb,
                 sweep_filter, t_axis)

OUT = Path(__file__).resolve().parent.parent / "public" / "audio" / "sfx"
IR_SHORT = make_ir(0.9, 7000, seed=11)
IR_LONG = make_ir(2.4, 6000, seed=12)


def write(name, x, peak=0.89):
    x = fade(normalize(x, peak))
    sf.write(OUT / f"{name}.wav", x.astype(np.float32), SR, subtype="PCM_16")
    print(f"{name:12s} {len(x) / SR:5.2f}s")


def whoosh(seconds=0.75, lo=250, hi=3200, pan_from=-0.7, pan_to=0.7):
    n = int(seconds * SR)
    x = noise(seconds)
    half = n // 2
    freqs = np.concatenate([np.geomspace(lo, hi, half), np.geomspace(hi, lo * 2, n - half)])
    y = sweep_filter(x, None, freqs, q=1.6)
    env = np.sin(np.linspace(0, np.pi, n)) ** 1.6
    y *= env
    p = np.linspace(pan_from, pan_to, n)
    angle = (p + 1) * np.pi / 4
    st = np.stack([y * np.cos(angle), y * np.sin(angle)], axis=1)
    return reverb(st, IR_SHORT, 0.25)


def pop(f0=900, f1=380):
    t = t_axis(0.16)
    f = f1 + (f0 - f1) * np.exp(-t * 45)
    ph = 2 * np.pi * np.cumsum(f) / SR
    y = np.sin(ph) * exp_decay(len(t), 32)
    y[: int(0.002 * SR)] += noise(0.002) * 0.3
    return reverb(y, IR_SHORT, 0.12)


def tap():
    t = t_axis(0.06)
    click = highpass(noise(0.06), 2500) * exp_decay(len(t), 260)
    body = np.sin(2 * np.pi * 1800 * t) * exp_decay(len(t), 140) * 0.5
    thump = np.sin(2 * np.pi * 180 * t) * exp_decay(len(t), 60) * 0.6
    return reverb(click * 0.6 + body + thump, IR_SHORT, 0.1)


def typing(seconds=2.2):
    n = int(seconds * SR)
    y = np.zeros(n)
    pos = 0.0
    while pos < seconds - 0.05:
        k = int(pos * SR)
        m = int(0.03 * SR)
        click = highpass(noise(0.03), 1800 + RNG.uniform(0, 1500)) * exp_decay(m, 220)
        thock = np.sin(2 * np.pi * RNG.uniform(220, 320) * np.arange(m) / SR) * exp_decay(m, 90) * 0.4
        y[k : k + m] += (click + thock) * RNG.uniform(0.5, 1.0)
        pos += RNG.uniform(0.055, 0.1)
    return reverb(y, IR_SHORT, 0.12)


def bell(f, seconds=1.6, decay=3.0):
    t = t_axis(seconds)
    y = (np.sin(2 * np.pi * f * t) + 0.45 * np.sin(2 * np.pi * f * 2.0 * t) * exp_decay(len(t), 3)
         + 0.22 * np.sin(2 * np.pi * f * 3.01 * t) * exp_decay(len(t), 6))
    return y * exp_decay(len(t), decay) * np.minimum(1, t / 0.004)


def shimmer():
    notes = [86, 90, 93, 98, 102, 105]  # D6 F#6 A6 D7 F#7 A7
    n = int(1.9 * SR)
    st = np.zeros((n, 2))
    for i, m in enumerate(notes):
        b = bell(midi(m), 1.5, 3.5) * (0.9 - i * 0.08)
        k = int(i * 0.055 * SR)
        st[k : k + len(b)] += pan(b, -0.6 + i * 0.24)[: n - k]
    sparkle = highpass(noise(1.9), 7000) * np.exp(-t_axis(1.9) * 3) * 0.08
    st += pan(sparkle, 0)
    return reverb(st, IR_LONG, 0.35)


def success():
    n = int(1.4 * SR)
    st = np.zeros((n, 2))
    for i, m in enumerate([81, 86, 90]):  # A5 D6 F#6
        b = bell(midi(m), 1.2, 4.0)
        k = int(i * 0.08 * SR)
        st[k : k + len(b)] += pan(b, -0.3 + i * 0.3)[: n - k]
    return reverb(st, IR_LONG, 0.3)


def ding():
    b = bell(midi(88), 1.3, 3.2) + 0.6 * bell(midi(93), 1.3, 3.6)
    return reverb(b, IR_LONG, 0.28)


def impact():
    t = t_axis(2.6)
    f = 32 + 90 * np.exp(-t * 9)
    ph = 2 * np.pi * np.cumsum(f) / SR
    boom = np.sin(ph) * exp_decay(len(t), 2.2)
    thud = lowpass(noise(2.6), 900) * exp_decay(len(t), 14) * 1.2
    crash = highpass(noise(2.6), 4500) * exp_decay(len(t), 2.5) * 0.25
    y = boom * 1.0 + thud + crash
    return reverb(y, IR_LONG, 0.3)


def glitch():
    seconds = 0.42
    n = int(seconds * SR)
    y = np.zeros(n)
    k = 0
    while k < n:
        seg = int(RNG.uniform(0.012, 0.04) * SR)
        f = RNG.choice([180, 360, 720, 1440, 95])
        tt = np.arange(seg) / SR
        sq = np.sign(np.sin(2 * np.pi * f * tt))
        sq = np.round(sq * 4) / 4
        y[k : k + seg] += sq[: n - k] * RNG.uniform(0.3, 1.0)
        k += seg + int(RNG.uniform(0, 0.012) * SR)
    y += highpass(noise(seconds), 3000) * 0.25
    y *= np.linspace(1, 0.3, n)
    return lowpass(y, 6000)


def swipe():
    n = int(0.28 * SR)
    y = sweep_filter(noise(0.28), 1500, 7000, q=1.0) * np.sin(np.linspace(0, np.pi, n)) ** 2
    return reverb(y, IR_SHORT, 0.15)


def tick():
    t = t_axis(0.05)
    y = np.sin(2 * np.pi * 3200 * t) * exp_decay(len(t), 160) + highpass(noise(0.05), 4000) * exp_decay(len(t), 300) * 0.5
    return y


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    write("whoosh", whoosh())
    write("whoosh-soft", lowpass(whoosh(0.55, 200, 1600, -0.3, 0.3), 3000), 0.6)
    write("pop", pop(900, 380), 0.8)
    write("pop-high", pop(1500, 700), 0.7)
    write("tap", tap(), 0.75)
    write("type", typing(), 0.6)
    write("shimmer", shimmer(), 0.7)
    write("success", success(), 0.7)
    write("ding", ding(), 0.75)
    write("impact", impact(), 0.95)
    write("glitch", glitch(), 0.7)
    write("swipe", swipe(), 0.55)
    write("tick", tick(), 0.6)


if __name__ == "__main__":
    main()
