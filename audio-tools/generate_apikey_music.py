"""Music beds for the API key setup reels, one per language, locked to src/apikey/timeline.json.

A calm 96 bpm I-V-vi-IV bed: a pad-and-bells swell under the logo, then light and fuller sections that follow
the chapters (lighter for overview chapters, a soft groove for the walkthroughs), and a resolving hit when the
outro starts that rings out to the end.
    python audio-tools/generate_apikey_music.py        # writes public/audio/apikey/music-<lang>.wav
"""
import json
from pathlib import Path

import numpy as np
import soundfile as sf
from scipy.signal import fftconvolve

import dsp
from dsp import SR, highpass, lowpass, make_ir, noise, pan, sweep_filter, t_axis
from instruments import bass_note, bell, hat, keys, kick, pad_chord, pluck

ROOT = Path(__file__).resolve().parent.parent
TL = json.loads((ROOT / 'src/apikey/timeline.json').read_text())
SCRIPT = json.loads((ROOT / 'src/apikey/script.json').read_text())
FPS = TL['fps']
BAR = 2.5  # 96 bpm
BEAT = BAR / 4

CHORDS = {
    'D': {'pad': [50, 57, 62, 66, 69], 'bass': 38, 'arp': [74, 78, 81, 86]},
    'A': {'pad': [45, 57, 61, 64, 69], 'bass': 45, 'arp': [73, 76, 81, 85]},
    'Bm': {'pad': [47, 54, 59, 62, 66], 'bass': 47, 'arp': [71, 74, 78, 83]},
    'G': {'pad': [43, 55, 59, 62, 67], 'bass': 43, 'arp': [71, 74, 79, 83]},
    'Em': {'pad': [40, 52, 55, 59, 64], 'bass': 40, 'arp': [71, 76, 79, 83]},
}
PROG = ['D', 'A', 'Bm', 'G']
PROG_B = ['G', 'D', 'Em', 'A']
ARP = [0, 1, 2, 3, 2, 1, 2, 3]
# Energy per chapter: 0 = pad only, 1 = light (pluck + hats), 2 = groove (adds kick and bass).
ENERGY = {'k01': 1, 'k02': 1, 'k03': 1, 'k04': 2, 'k05': 2, 'k06': 2, 'k07': 2, 'k08': 2, 'k09': 1, 'k10': 1, 'k11': 0}


def render(lang: str, seed: int) -> None:
    dsp.RNG = np.random.default_rng(seed)
    tl = TL[lang]
    total = tl['total'] / FPS
    chap_of = {s['id']: s['id'] for s in SCRIPT['steps']}
    starts = [(r['start'] / FPS, chap_of[r['id']]) for r in tl['steps']]
    outro = next(r['start'] for r in tl['steps'] if r['id'] == 'k11') / FPS + 0.35
    intro_end = 1.6  # short swell, then the bed starts
    n = int((total + 0.5) * SR)
    bus = {k: np.zeros((n, 2)) for k in ['pad', 'pluck', 'bass', 'drums', 'fx', 'bells', 'keys']}

    def add(k, x, at):
        i = int(at * SR)
        if i >= n or i < 0:
            return
        if x.ndim == 1:
            x = np.stack([x, x], axis=1)
        e = min(n, i + len(x))
        bus[k][i:e] += x[: e - i]

    def chapter_at(t):
        c = starts[0][1]
        for s, ch in starts:
            if s <= t:
                c = ch
        return c

    # Bars start when the tour starts so the downbeats sit on the first walkthrough step; the intro gets a swell.
    grid0 = intro_end
    add('pad', pad_chord(CHORDS['D']['pad'], intro_end + 0.5, attack=1.6, release=1.2) * 0.9, 0)
    for i, m in enumerate([86, 90, 93, 98]):
        add('bells', pan(bell(m, 2.6) * 0.3, -0.4 + i * 0.27), 1.2 + 0.09 * i)
    r = sweep_filter(noise(1.2), 400, 6000, q=1.3) * np.linspace(0, 1, int(1.2 * SR)) ** 2
    add('fx', pan(r, 0) * 0.25, grid0 - 1.2)

    b = 0
    while grid0 + b * BAR < outro - 0.01:
        t0 = grid0 + b * BAR
        ch_name = chapter_at(t0 + 0.01)
        energy = ENERGY[ch_name]
        prog = PROG_B if ch_name in ('k09', 'k10') else PROG
        ch = CHORDS[prog[b % 4]]
        bar_len = min(BAR, outro - t0)
        add('pad', pad_chord(ch['pad'], bar_len, release=0.7) * (0.8 if energy < 2 else 0.7), t0)
        for s in range(8):
            if t0 + s * BEAT / 2 >= outro:
                break
            vel = (0.42 if s % 2 else 0.58) * (0.8 if energy == 1 else 1.0)
            add('pluck', pan(pluck(ch['arp'][ARP[s]], bright=0.75) * vel, -0.35 if s % 2 else 0.35), t0 + s * BEAT / 2)
        if b % 2 == 0:
            add('keys', pan(keys(ch['arp'][0] - 12) * 0.22, 0.15), t0)
        for e in range(8):
            if t0 + e * BEAT / 2 < outro:
                add('drums', pan(hat() * (0.16 if e % 2 else 0.09), 0.25), t0 + e * BEAT / 2)
        if energy == 2:
            for q in range(4):
                if t0 + q * BEAT >= outro:
                    break
                add('bass', bass_note(ch['bass'], BEAT * 0.85) * (0.7 if q == 0 else 0.5), t0 + q * BEAT)
                if q in (0, 2):
                    add('drums', kick() * 0.5, t0 + q * BEAT)
        else:
            add('bass', bass_note(ch['bass'], bar_len * 0.95) * 0.45, t0)
        b += 1

    # Outro: resolving chord, bells and a soft boom, ringing out to the end.
    rest = total - outro + 0.4
    add('pad', pad_chord(CHORDS['D']['pad'], rest, attack=0.05, release=2.5) * 1.1, outro)
    add('bass', bass_note(38, min(rest, 4.0)) * 0.55, outro)
    add('drums', kick() * 0.8, outro)
    t = t_axis(2.4)
    boom = np.sin(2 * np.pi * np.cumsum(36 + 60 * np.exp(-t * 10)) / SR) * np.exp(-t * 2.4)
    add('fx', boom * 0.45, outro)
    for i, m in enumerate([86, 90, 93, 98]):
        add('bells', pan(bell(m) * 0.32, -0.45 + i * 0.3), outro + 0.06 * i)

    ir = make_ir(2.6, 6000)
    gains = {'pad': 0.5, 'pluck': 0.42, 'bass': 0.3, 'drums': 0.42, 'fx': 0.45, 'bells': 0.3, 'keys': 0.4}
    send = {'pad': 0.3, 'pluck': 0.32, 'bass': 0.0, 'drums': 0.08, 'fx': 0.3, 'bells': 0.5, 'keys': 0.35}
    mix = np.zeros((n, 2))
    wet_in = np.zeros((n, 2))
    for k, x in bus.items():
        mix += x * gains[k]
        wet_in += x * gains[k] * send[k]
    wet = np.stack([fftconvolve(wet_in[:, c], ir[:, c])[:n] for c in range(2)], axis=1)
    mix = highpass(mix + wet * 0.9, 35)
    mix = mix - 0.3 * lowpass(mix, 140)
    fo = np.clip((np.arange(n) / SR - (total - 2.5)) / 2.4, 0, 1)
    mix *= ((1 - fo) ** 1.5)[:, None]
    mix = np.tanh(mix * 1.15) / np.tanh(1.15)
    mix = (mix / np.max(np.abs(mix)) * 0.89)[: int(total * SR)]
    out = ROOT / 'public/audio/apikey' / f'music-{lang}.wav'
    out.parent.mkdir(parents=True, exist_ok=True)
    sf.write(out, mix.astype(np.float32), SR, subtype='PCM_16')
    print(f'{lang}: {len(mix) / SR:.1f}s, outro hit at {outro:.2f}s')


if __name__ == '__main__':
    for i, lang in enumerate(['en', 'hi', 'mr']):
        render(lang, 70 + i)
