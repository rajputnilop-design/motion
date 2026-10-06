import {circ, line, rrect, Stroke} from './chalk';

/** Each figure is a list of strokes in its own coordinates, plus the viewBox that frames it. */
export type Fig = {vb: [number, number, number, number]; strokes: Stroke[]};

const dot = (x: number, y: number) => `M${x} ${y} l0.1 0`;

/** A child at a desk, facing us; origin is the middle of the desk's top edge. */
export const kid = ({girl = false, down = false, desk = true} = {}): Fig => ({
  vb: [-70, -150, 140, 200],
  strokes: [
    circ(0, -80, 26),
    girl ? 'M-27 -82 Q-30 -112 0 -110 Q30 -112 27 -82' : 'M-25 -88 Q-18 -112 2 -108 Q24 -110 26 -88',
    ...(girl ? ['M-25 -76 Q-34 -52 -28 -30', 'M25 -76 Q34 -52 28 -30'] : []),
    dot(-9, down ? -74 : -82),
    dot(9, down ? -74 : -82),
    down ? 'M-6 -64 L6 -64' : 'M-9 -68 Q0 -61 9 -68',
    'M-42 0 Q-42 -38 -16 -48 L16 -48 Q42 -38 42 0',
    ...(desk ? ['M-66 0 H66', 'M-60 0 V36', 'M60 0 V36'] : []),
  ],
});

/** The raised arm for `kid` (same coordinates), drawn separately so hands can go up on cue. */
export const kidHand: Fig = {vb: [-70, -150, 140, 200], strokes: ['M30 -38 Q50 -74 44 -122', circ(44, -132, 9)]};

/** A child seen from behind (the class looking at the board); origin at the bottom middle. */
export const kidBack = (girl = false): Fig => ({
  vb: [-60, -130, 120, 140],
  strokes: [
    circ(0, -84, 30),
    'M-24 -98 Q0 -120 24 -98',
    'M-28 -84 Q-4 -100 20 -110',
    ...(girl ? ['M-6 -56 Q-10 -34 -4 -14'] : []),
    'M-52 0 Q-52 -40 -18 -52',
    'M18 -52 Q52 -40 52 0',
  ],
});

/** A teacher in a saree, standing, one arm out toward a board on her right (our left). Origin at her feet. */
export const teacher: Fig = {
  vb: [-140, -360, 220, 370],
  strokes: [
    circ(0, -312, 30),
    circ(26, -332, 13),
    'M-26 -322 Q-6 -350 28 -320',
    'M-7 -282 V-266 M7 -282 V-266',
    'M-38 -260 Q0 -274 38 -260',
    'M-38 -260 Q-50 -140 -58 0',
    'M38 -260 Q48 -140 58 0',
    'M-58 0 H58',
    'M32 -258 Q-6 -196 -52 -96',
    'M-36 -250 Q-80 -232 -122 -262',
    circ(-128, -266, 7),
    'M36 -248 Q54 -206 34 -176',
    rrect(8, -196, 44, 32, 4),
  ],
};

/** A small standing child (stick-figure style) for crowds; origin at the feet. */
export const walker = (girl = false): Fig => ({
  vb: [-40, -160, 80, 165],
  strokes: [
    circ(0, -134, 17),
    ...(girl ? ['M-15 -126 Q-22 -110 -16 -96'] : ['M-15 -142 Q0 -158 15 -142']),
    'M0 -116 V-52',
    'M0 -100 L-22 -72',
    'M0 -100 L22 -72',
    'M0 -52 L-16 0',
    'M0 -52 L16 0',
  ],
});

/** The teacher's desk; origin at the middle of the top edge. */
export const desk: Fig = {
  vb: [-280, -10, 560, 180],
  strokes: ['M-262 0 H262', 'M-252 0 V24 H252 V0', 'M-232 24 V158', 'M232 24 V158', rrect(-90, 24, 180, 52, 6), 'M-20 50 H20'],
};

/** A phone standing on its edge; origin at the bottom middle. */
export const phone: Fig = {
  vb: [-70, -240, 140, 250],
  strokes: [rrect(-62, -232, 124, 230, 20), 'M-16 -216 H16', circ(0, -22, 6)],
};

// Lucide-style icons on a 24-unit grid.
export const timer: Fig = {vb: [0, 0, 24, 24], strokes: [line(10, 2, 14, 2), circ(12, 14, 8)]};
export const battery: Fig = {
  vb: [0, 0, 24, 24],
  strokes: [rrect(2, 6, 16, 12, 2), 'M22 14 L22 10', 'M5 12 C5 9.6 8 9.6 10 12 C12 14.4 15 14.4 15 12 C15 9.6 12 9.6 10 12 C8 14.4 5 14.4 5 12'],
};
export const power: Fig = {vb: [0, 0, 24, 24], strokes: ['M12 2v10', 'M18.4 6.6a9 9 0 1 1-12.77.04']};
export const bulb: Fig = {
  vb: [0, 0, 24, 24],
  strokes: [
    'M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5',
    'M9 14 V18 M15 14 V18',
    'M9 18h6',
    'M10 22h4',
  ],
};
export const filament = 'M10 14 L10.6 10.6 L12 12 L13.4 10.6 L14 14';
export const book: Fig = {
  vb: [0, 0, 24, 24],
  strokes: ['M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z', 'M12 7v14'],
};

/** A globe of radius r around the origin. */
export const globe = (r: number): Fig => ({
  vb: [-r - 10, -r - 10, 2 * r + 20, 2 * r + 20],
  strokes: [
    circ(0, 0, r),
    `M0 ${-r} A${r * 0.45} ${r} 0 1 0 0 ${r} A${r * 0.45} ${r} 0 1 0 0 ${-r}`,
    `M${-r} 0 H${r}`,
    `M${-r * 0.86} ${-r * 0.5} Q0 ${-r * 0.36} ${r * 0.86} ${-r * 0.5}`,
    `M${-r * 0.86} ${r * 0.5} Q0 ${r * 0.64} ${r * 0.86} ${r * 0.5}`,
  ],
});

/** A big hand-drawn question mark, 200 x 300. */
export const question: Fig = {
  vb: [0, 0, 200, 300],
  strokes: ['M46 92 C40 26 156 18 154 92 C152 142 100 148 100 198 V214', {d: circ(100, 262, 7), fill: 'ink'}],
};

/** Speech bubble with a tail pointing down-left; `w` x `h` body. */
export const speech = (w: number, h: number): string =>
  `M30 0 H${w - 30} Q${w} 0 ${w} 30 V${h - 30} Q${w} ${h} ${w - 30} ${h} H110 L52 ${h + 50} L66 ${h} H30 Q0 ${h} 0 ${h - 30} V30 Q0 0 30 0`;

/** A thought cloud around (cx, cy). */
export const cloud = (cx: number, cy: number, rx: number, ry: number, n = 9): string => {
  const pts = Array.from({length: n}, (_, i) => {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2;
    return [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
  });
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i <= n; i++) {
    const [x0, y0] = pts[i - 1];
    const [x, y] = pts[i % n];
    const r = Math.hypot(x - x0, y - y0) * 0.62;
    d += ` A${r} ${r} 0 0 1 ${x} ${y}`;
  }
  return d;
};

/** A writing slate (paati) in a wooden frame, 620 x 440. */
export const slateFrame: Fig = {vb: [0, 0, 620, 440], strokes: [rrect(4, 4, 612, 432, 22), rrect(34, 34, 552, 372, 8)]};

/** Road to a sunrise, in canvas coordinates of a 1080-wide stage; horizon at y = 0. */
export const road: Fig = {
  vb: [0, -330, 1080, 1000],
  strokes: [
    'M60 0 H1020',
    'M430 0 A110 110 0 0 1 650 0',
    ...[-75, -45, -15, 15, 45, 75].map((deg) => {
      const a = ((deg - 90) * Math.PI) / 180;
      return line(540 + Math.cos(a) * 150, Math.sin(a) * 150, 540 + Math.cos(a) * 230, Math.sin(a) * 230);
    }),
    'M150 660 Q420 260 512 0',
    'M930 660 Q660 260 568 0',
    'M540 640 V560 M540 470 V410 M540 330 V290 M540 220 V196 M540 140 V126',
  ],
};
