"""Blackboard texture for the manifesto reel: slate base, eraser smudges, chalk dust.
    python3 scripts/make_board.py        # writes public/manifesto/board.jpg (1080x1920)
"""
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter

W, H = 1080, 1920
rng = np.random.default_rng(7)
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)


def field(sigma, amp):
    f = gaussian_filter(rng.standard_normal((H, W)).astype(np.float32), sigma)
    return f / (np.abs(f).max() + 1e-9) * amp


# Slate base: lighter in the middle, darker to the edges.
r = np.sqrt(((xx - W / 2) / W) ** 2 + ((yy - H * 0.45) / H) ** 2)
lum = 0.15 - 0.085 * np.clip(r / 0.75, 0, 1) ** 1.6
lum += field(140, 0.02) + field(35, 0.008)

# Eraser smudges: wide arcs of faint chalk residue, streaked along the stroke.
smudge = np.zeros((H, W), np.float32)
for _ in range(16):
    cx, cy = rng.uniform(-200, W + 200), rng.uniform(-200, H + 200)
    rad = rng.uniform(250, 700)
    width = rng.uniform(50, 130)
    d = np.abs(np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2) - rad)
    ang = np.arctan2(yy - cy, xx - cx)
    a0 = rng.uniform(-np.pi, np.pi)
    span = rng.uniform(0.5, 1.5)
    da = np.angle(np.exp(1j * (ang - a0)))
    arc = np.exp(-(d / width) ** 2) * np.clip(1 - np.abs(da) / span, 0, 1) ** 0.7
    smudge += arc * rng.uniform(0.25, 1.0)
streak = gaussian_filter(rng.standard_normal((H, W)).astype(np.float32), (1.0, 14))
streak = 0.6 + 0.4 * streak / np.abs(streak).max()
lum += np.clip(smudge, 0, 1.6) * streak * 0.055

# Chalk dust: sparse specks, a little denser along the bottom ledge.
dust = (rng.random((H, W)) > 0.9985 - 0.0012 * (yy / H) ** 4).astype(np.float32)
lum += gaussian_filter(dust, 0.7) * 0.25
lum += field(1.2, 0.006)

rgb = np.stack([lum * 0.84, lum * 1.0, lum * 0.93], -1)
img = (np.clip(rgb, 0, 1) ** (1 / 1.0) * 255).astype(np.uint8)
out = Path(__file__).resolve().parent.parent / 'public/manifesto/board.jpg'
Image.fromarray(img).save(out, quality=92)
print(out, img.mean(axis=(0, 1)))
