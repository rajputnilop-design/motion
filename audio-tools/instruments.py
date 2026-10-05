"""Synth instruments shared by the music generators."""
import numpy as np

from dsp import SR, bandpass, env_adsr, highpass, lowpass, midi, noise, pan, t_axis


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
