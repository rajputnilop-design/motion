"""Score and sound effects for the brand manifesto reel, locked to src/manifesto/timeline.json.

The score follows the story: a ticking, machine-fast pulse while AI is introduced; it cuts at "But..." to warm
felt keys for what only a teacher can do; near silence and a heartbeat under "the real danger", with a low
boom on "we will stop"; hope returns in F major for "now teach it to think" and builds into the brand reveal;
a breakdown under the tagline with a resolving hit on "teachers build minds"; a soft outro under the call to
action.
    python audio-tools/generate_manifesto_audio.py   # writes public/audio/manifesto/{music-<lang>,chalk,chalk-long,tick-on}.wav
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import fftconvolve

import dsp
from dsp import SR, bandpass, exp_decay, fade, highpass, lowpass, make_ir, noise, normalize, pan, reverb, sweep_filter, t_axis
from instruments import bass_note, bell, clap, hat, keys, kick, pad_chord, pluck

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public/audio/manifesto'
TL = json.loads((ROOT / 'src/manifesto/timeline.json').read_text())
FPS = TL['fps']
BEAT = 0.75  # 80 bpm
BAR = 4 * BEAT

CH = {
    'Dm': {'pad': [50, 57, 62, 65, 69], 'bass': 38, 'arp': [62, 69, 65, 74]},
    'Bb': {'pad': [46, 58, 62, 65, 70], 'bass': 34, 'arp': [58, 65, 62, 70]},
    'F': {'pad': [41, 57, 60, 65, 69], 'bass': 41, 'arp': [65, 72, 69, 77]},
    'C': {'pad': [48, 55, 60, 64, 67], 'bass': 36, 'arp': [60, 67, 64, 72]},
    'Gm': {'pad': [43, 55, 58, 62, 67], 'bass': 43, 'arp': [62, 67, 70, 74]},
}


# ── sound effects ────────────────────────────────────────────────────────────────────────────────────────────
def chalk(strokes: int, seed: int) -> np.ndarray:
    """Chalk on slate: gritty stick-slip strokes with a soft knock where each stroke lands."""
    rng = np.random.default_rng(seed)
    parts, t = [], 0.0
    for _ in range(strokes):
        dur = rng.uniform(0.12, 0.3)
        n = int(dur * SR)
        # Stick-slip: an irregular train of tiny impulses through a bright band, rate wandering 250-700 Hz.
        rate = rng.uniform(250, 700) * (1 + 0.3 * np.sin(np.linspace(0, rng.uniform(2, 6), n)))
        phase = np.cumsum(rate / SR)
        train = (np.diff(np.floor(phase), prepend=0) > 0).astype(float) * rng.uniform(0.4, 1.0, n)
        grit = bandpass(train + noise(dur) * 0.35, 1400, 7000)
        env = np.sin(np.linspace(0, np.pi, n)) ** 0.6 * rng.uniform(0.6, 1.0)
        knock = np.sin(2 * np.pi * rng.uniform(600, 900) * t_axis(0.03)) * exp_decay(int(0.03 * SR), 160) * 0.5
        y = grit * env
        y[: len(knock)] += knock
        parts.append((t, y))
        t += dur + rng.uniform(0.03, 0.09)
    out = np.zeros(int((t + 0.1) * SR))
    for s, y in parts:
        i = int(s * SR)
        out[i : i + len(y)] += y
    return reverb(out, make_ir(0.5, 7000, seed=5), 0.12)


def tick_on() -> np.ndarray:
    """The machine's cue: a quick glassy chirp and two clean blips."""
    t = t_axis(0.09)
    f = 700 + 2200 * (t / t[-1]) ** 0.6
    chirp = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.linspace(0, np.pi, len(t))) * 0.5
    y = np.zeros(int(0.45 * SR))
    y[: len(chirp)] += chirp
    for k, (fr, a) in enumerate([(2400, 0.5), (3600, 0.35)]):
        tb = t_axis(0.12)
        i = int((0.07 + 0.06 * k) * SR)
        y[i : i + len(tb)] += np.sin(2 * np.pi * fr * tb) * exp_decay(len(tb), 40) * a
    return reverb(y, make_ir(0.8, 9000, seed=8), 0.22)


def write(name: str, x: np.ndarray, peak=0.89) -> None:
    x = fade(normalize(x, peak), 0.002, 0.03)
    sf.write(OUT / f'{name}.wav', x.astype(np.float32), SR, subtype='PCM_16')
    print(f'{name}: {len(x) / SR:.2f}s')


# ── score ────────────────────────────────────────────────────────────────────────────────────────────────────
def boom(seconds=2.6, f0=34, f1=70) -> np.ndarray:
    t = t_axis(seconds)
    y = np.sin(2 * np.pi * np.cumsum(f0 + f1 * np.exp(-t * 9)) / SR) * np.exp(-t * 2.2)
    y += lowpass(noise(seconds), 300) * np.exp(-t * 6) * 0.4
    return y


def riser(seconds: float) -> np.ndarray:
    r = sweep_filter(noise(seconds), 300, 7000, q=1.4) * np.linspace(0, 1, int(seconds * SR)) ** 2.2
    return r


def tick() -> np.ndarray:
    t = t_axis(0.04)
    return bandpass(noise(0.04), 2500, 6000) * exp_decay(len(t), 180) + np.sin(2 * np.pi * 3100 * t) * exp_decay(len(t), 120) * 0.4


def render(lang: str, seed: int) -> None:
    dsp.RNG = np.random.default_rng(seed)
    tl = TL[lang]
    total = tl['total'] / FPS
    row = {r['id']: r for r in tl['steps']}
    at = lambda i: row[i]['start'] / FPS  # noqa: E731
    beat = lambda i, k: (row[i].get('beats') or [row[i]['voAt']] * 9)[k] / FPS  # noqa: E731
    n = int((total + 1.0) * SR)
    bus = {k: np.zeros((n, 2)) for k in ['pad', 'keys', 'pluck', 'bass', 'drums', 'fx', 'bells']}

    def add(k, x, t0, g=1.0):
        i = int(t0 * SR)
        if i >= n or i < 0:
            return
        if x.ndim == 1:
            x = np.stack([x, x], axis=1)
        e = min(n, i + len(x))
        bus[k][i:e] += x[: e - i] * g

    # A — m01-m02: the machine arrives. Low drone, a clock ticking at double time, a fast high arpeggio.
    turn = at('m03')
    add('pad', lowpass(pad_chord([38, 50, 57], turn + 0.3, attack=2.2, release=0.4), 1100), 0, 0.75)
    k = 0
    while 0.6 + k * 0.5 < turn - 0.2:
        add('drums', pan(tick(), 0.3 if k % 2 else -0.3), 0.6 + k * 0.5, 0.35 if k % 2 else 0.5)
        k += 1
    arp = [74, 77, 81, 84, 81, 77]
    k = 0
    while at('m02') + k * 0.125 < turn - 0.15:
        t0 = at('m02') + k * 0.125
        add('pluck', pan(pluck(arp[k % 6], 0.25, bright=1.4), -0.5 if k % 2 else 0.5), t0, 0.14 + 0.1 * (t0 - at('m02')) / (turn - at('m02')))
        k += 1
    add('fx', pan(riser(1.4), 0), turn - 1.4, 0.35)
    add('fx', boom(1.6, 40, 50), turn, 0.35)

    # B — m03-m06: what only a teacher can do. Felt keys over Dm-Bb-F-C, pad, a little bass later.
    danger = at('m07')
    prog = ['Dm', 'Bb', 'F', 'C']
    b = 0
    while turn + b * BAR < danger - 0.4:
        t0 = turn + b * BAR
        ch = CH[prog[b % 4]]
        bar = min(BAR, danger - t0)
        add('pad', pad_chord(ch['pad'], bar, attack=0.9, release=1.0), t0, 0.55)
        for q, m in enumerate(ch['arp']):
            if t0 + q * BEAT < danger - 0.5:
                add('keys', pan(keys(m, 2.4), [-0.3, 0.2, -0.1, 0.3][q]), t0 + q * BEAT, 0.5 if q == 0 else 0.36)
        if b >= 2:
            add('bass', bass_note(ch['bass'], bar * 0.95), t0, 0.35)
        b += 1

    # C — m07: near silence; a heartbeat; a low boom on "we will stop", then air.
    stop = beat('m07', 2)
    hope = at('m08')
    t = t_axis(stop - danger + 0.5)
    drone = (np.sin(2 * np.pi * 73.4 * t) + 0.3 * np.sin(2 * np.pi * 110.0 * t)) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.35 * t))
    drone *= np.minimum(1, t / 1.5) * np.clip((t[-1] - t) / 0.4, 0, 1)
    add('pad', drone * 0.18, danger)
    k = 0
    while danger + 0.8 + k * 1.4 < stop - 0.3:
        hb = lowpass(kick(), 160)
        add('drums', hb, danger + 0.8 + k * 1.4, 0.55)
        add('drums', hb, danger + 0.8 + k * 1.4 + 0.24, 0.35)
        k += 1
    add('fx', boom(3.4, 30, 60), stop, 0.9)
    add('bells', pan(bell(86, 3.0, 1.4), 0.2), stop + 0.05, 0.08)
    add('fx', pan(riser(1.2), 0), hope - 1.2, 0.14)

    # D — m08-m09: hope in F major. Keys first, then a soft groove from m09.
    brand = at('m10')
    groove = at('m09')
    prog = ['F', 'C', 'Dm', 'Bb']
    b = 0
    while hope + b * BAR < brand - 0.05:
        t0 = hope + b * BAR
        ch = CH[prog[b % 4]]
        bar = min(BAR, brand - t0)
        add('pad', pad_chord(ch['pad'], bar, attack=0.6 if b else 1.2, release=0.8), t0, 0.6)
        for e in range(8):
            te = t0 + e * BEAT / 2
            if te < brand - 0.1 and (b > 0 or e % 2 == 0):
                add('keys', pan(keys(ch['arp'][e % 4] + (12 if e >= 4 else 0), 1.4), -0.3 if e % 2 else 0.3), te, 0.3 if e else 0.42)
        for q in range(4):
            tq = t0 + q * BEAT
            if groove - 0.01 <= tq < brand - 0.1:
                add('bass', bass_note(ch['bass'], BEAT * 0.9), tq, 0.4)
                if q in (0, 2):
                    add('drums', kick(), tq, 0.45)
                add('drums', pan(hat(), 0.3), tq + BEAT / 2, 0.14)
        b += 1
    bulb = row['m08']['voAt'] / FPS + 0.88 * row['m08']['voFrames'] / FPS
    for i, m in enumerate([81, 84, 89]):
        add('bells', pan(bell(m, 2.4), -0.3 + i * 0.3), bulb + 0.05 * i, 0.22)
    add('fx', pan(riser(2.0), 0), brand - 2.0, 0.35)

    # E — m10-m11: the brand and the call to lead. Full groove; bells at the reveal and the peak.
    tag = at('m12')
    peak = at('m11')
    add('fx', boom(2.4, 36, 60), brand, 0.6)
    add('drums', kick(), brand, 0.8)
    for i, m in enumerate([77, 81, 84, 89]):
        add('bells', pan(bell(m, 2.8), -0.45 + i * 0.3), brand + 0.08 * i, 0.32)
    prog = ['Bb', 'F', 'C', 'Dm']
    b = 0
    while brand + b * BAR < tag - 0.05:
        t0 = brand + b * BAR
        ch = CH[prog[b % 4]]
        bar = min(BAR, tag - t0)
        add('pad', pad_chord(ch['pad'], bar, release=0.6), t0, 0.8)
        for e in range(8):
            te = t0 + e * BEAT / 2
            if te >= tag - 0.05:
                break
            add('pluck', pan(pluck(ch['arp'][e % 4] + 12, 0.5, bright=0.9), -0.4 if e % 2 else 0.4), te, 0.32)
            add('bass', bass_note(ch['bass'], BEAT / 2 * 0.85), te, 0.44 if e % 2 else 0.54)
            add('drums', pan(hat(), 0.25), te + BEAT / 4, 0.12)
        for q in range(4):
            tq = t0 + q * BEAT
            if tq >= tag - 0.05:
                break
            add('drums', kick(), tq, 0.62)
            if q in (1, 3):
                add('drums', pan(clap(), -0.1), tq, 0.16)
        if t0 >= peak - 0.01:
            add('bells', pan(bell(ch['arp'][3] + 12, 1.8), 0.3), t0, 0.14)
        b += 1
    add('fx', pan(riser(1.6), 0), tag - 1.6, 0.3)

    # F — m12: breakdown, then the resolving hit on "teachers build minds".
    minds = beat('m12', 1)
    cta = at('m13')
    add('pad', pad_chord(CH['Bb']['pad'], minds - tag, attack=0.3, release=0.6), tag, 0.5)
    add('bells', pan(bell(82, 2.4), -0.2), beat('m12', 0), 0.16)
    add('pad', pad_chord(CH['F']['pad'] + [72], cta - minds + 1.0, attack=0.04, release=1.8), minds, 0.75)
    add('bass', bass_note(29, 2.6), minds, 0.4)
    add('drums', kick(), minds, 0.8)
    add('fx', boom(2.8, 34, 60), minds, 0.55)
    for i, m in enumerate([77, 81, 84, 89]):
        add('bells', pan(bell(m, 3.0), -0.45 + i * 0.3), minds + 0.06 * i, 0.3)

    # G — m13: a gentle outro under the call to action, ringing out.
    prog = ['F', 'C', 'Bb', 'F']
    b = 0
    while cta + b * BAR < total - 2.2:
        t0 = cta + b * BAR
        ch = CH[prog[b % 4]]
        bar = min(BAR, total - 1.5 - t0)
        add('pad', pad_chord(ch['pad'], bar, attack=0.8, release=1.4), t0, 0.48)
        for q, m in enumerate(ch['arp']):
            if t0 + q * BEAT < total - 2.2:
                add('keys', pan(keys(m + 12, 1.8), [-0.3, 0.2, -0.1, 0.3][q]), t0 + q * BEAT, 0.26)
        add('bass', bass_note(ch['bass'], bar * 0.9), t0, 0.26)
        b += 1
    end = total - 2.4
    add('pad', pad_chord(CH['F']['pad'], 2.0, attack=0.3, release=1.8), end, 0.5)
    for i, m in enumerate([77, 81, 84]):
        add('bells', pan(bell(m, 2.6), -0.3 + i * 0.3), end + 0.06 * i, 0.2)

    ir = make_ir(2.8, 6000)
    gains = {'pad': 0.5, 'keys': 0.5, 'pluck': 0.4, 'bass': 0.32, 'drums': 0.42, 'fx': 0.5, 'bells': 0.32}
    send = {'pad': 0.3, 'keys': 0.4, 'pluck': 0.3, 'bass': 0.0, 'drums': 0.08, 'fx': 0.25, 'bells': 0.5}
    mix = np.zeros((n, 2))
    wet_in = np.zeros((n, 2))
    for kk, x in bus.items():
        mix += x * gains[kk]
        wet_in += x * gains[kk] * send[kk]
    wet = np.stack([fftconvolve(wet_in[:, c], ir[:, c])[:n] for c in range(2)], axis=1)
    mix = highpass(mix + wet * 0.9, 32)
    mix = mix - 0.3 * lowpass(mix, 140)
    fo = np.clip((np.arange(n) / SR - (total - 2.0)) / 1.9, 0, 1)
    mix *= ((1 - fo) ** 1.5)[:, None]
    mix = np.tanh(mix * 1.2) / np.tanh(1.2)
    mix = (mix / np.max(np.abs(mix)) * 0.89)[: int(total * SR)]
    sf.write(OUT / f'music-{lang}.wav', mix.astype(np.float32), SR, subtype='PCM_16')
    print(f'music-{lang}: {len(mix) / SR:.1f}s  turn {turn:.2f}  stop {stop:.2f}  brand {brand:.2f}  minds {minds:.2f}')


if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    dsp.RNG = np.random.default_rng(3)
    write('chalk', chalk(2, 21), 0.8)
    write('chalk-long', chalk(5, 22), 0.8)
    write('tick-on', tick_on(), 0.8)
    for i, lang in enumerate(k for k in TL if k != 'fps'):
        render(lang, 90 + i)
