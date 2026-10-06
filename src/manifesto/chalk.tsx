import React from 'react';
import {useCurrentFrame} from 'remotion';
import {easeInOut, easeOut, tween} from '../anim';
import {HAND} from '../theme';

/** Chalk on slate for people and ideas; crisp neon cyan for the machine. */
export const INK = {
  white: '#EEF0E8',
  dim: 'rgba(238,240,232,0.42)',
  amber: '#FFC870',
  gold: '#FFD98A',
  cyan: '#5FE6EE',
  rose: '#FF8A94',
  wood: '#C08A55',
};

/** Filters every chalk element references: a slight wobble on the edges and a grainy, broken fill. */
export const ChalkDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}}>
    <defs>
      <filter id="chalk" x="-6%" y="-6%" width="112%" height="112%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="4" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="5" xChannelSelector="R" yChannelSelector="G" result="wob" />
        <feTurbulence type="fractalNoise" baseFrequency="1.25" numOctaves="1" seed="11" result="grain" />
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.4 0 0 0 -1.15" result="mask" />
        <feComposite in="wob" in2="mask" operator="in" />
      </filter>
      <filter id="chalkText" x="-4%" y="-10%" width="108%" height="120%" colorInterpolationFilters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="2" seed="7" result="warp" />
        <feDisplacementMap in="SourceGraphic" in2="warp" scale="3.5" xChannelSelector="R" yChannelSelector="G" result="wob" />
        <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="3" result="grain" />
        <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  3.0 0 0 0 -0.85" result="mask" />
        <feComposite in="wob" in2="mask" operator="in" />
      </filter>
    </defs>
  </svg>
);

// Path builders, so drawings can be written as lists of strokes.
export const circ = (cx: number, cy: number, r: number, start = -90) => {
  const a = (start * Math.PI) / 180;
  const x0 = cx + r * Math.cos(a);
  const y0 = cy + r * Math.sin(a);
  const x1 = cx - r * Math.cos(a);
  const y1 = cy - r * Math.sin(a);
  return `M${x0} ${y0} A${r} ${r} 0 1 1 ${x1} ${y1} A${r} ${r} 0 1 1 ${x0} ${y0}`;
};
export const rrect = (x: number, y: number, w: number, h: number, r = 0) =>
  r > 0
    ? `M${x + r} ${y} H${x + w - r} Q${x + w} ${y} ${x + w} ${y + r} V${y + h - r} Q${x + w} ${y + h} ${x + w - r} ${y + h} H${x + r} Q${x} ${y + h} ${x} ${y + h - r} V${y + r} Q${x} ${y} ${x + r} ${y}`
    : `M${x} ${y} H${x + w} V${y + h} H${x} Z`;
export const line = (x1: number, y1: number, x2: number, y2: number) => `M${x1} ${y1} L${x2} ${y2}`;

/** A path, or a path with its own colour, width, fill ('ink' = the stroke colour) and timing. */
export type Stroke = string | {d: string; color?: string; w?: number; fill?: string; at?: number; dur?: number};

/**
 * A drawing that draws itself on: strokes are revealed one after another between `at` and `at + dur`
 * (a stroke can carry its own `at`/`dur`, in frames relative to `at`). `neon` draws a crisp glowing line
 * instead of chalk.
 */
export const Sketch: React.FC<{
  strokes: Stroke[];
  at: number;
  dur?: number;
  color?: string;
  w?: number;
  neon?: boolean;
  /** Box on the canvas, and the viewBox the strokes are written in (defaults to the same size). */
  x?: number;
  y?: number;
  width: number;
  height: number;
  vb?: [number, number, number, number];
  style?: React.CSSProperties;
  out?: number;
}> = ({strokes, at, dur = 24, color = INK.white, w = 6, neon, x = 0, y = 0, width, height, vb, style, out}) => {
  const frame = useCurrentFrame();
  if (frame < at - 1) return null;
  const gone = out === undefined ? 1 : tween(frame, [out, out + 10], [1, 0]);
  if (gone <= 0) return null;
  const n = strokes.length;
  const slot = dur / Math.max(1, n);
  return (
    <svg
      width={width}
      height={height}
      viewBox={(vb ?? [0, 0, width, height]).join(' ')}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        overflow: 'visible',
        opacity: gone,
        // On the <svg> itself, so the chalk grain is in screen pixels whatever the drawing's viewBox scale.
        filter: neon ? `drop-shadow(0 0 6px ${color}) drop-shadow(0 0 18px ${color}88)` : 'url(#chalk)',
        ...style,
      }}
    >
      <g>
        {strokes.map((s, i) => {
          const o = typeof s === 'string' ? {d: s} : s;
          const s0 = at + (o.at ?? i * slot);
          const s1 = s0 + (o.dur ?? slot * 1.15);
          const p = tween(frame, [s0, s1], [0, 1], easeInOut);
          if (p <= 0) return null;
          return (
            <path
              key={i}
              d={o.d}
              pathLength={1}
              fill={o.fill ? (o.fill === 'ink' ? o.color ?? color : o.fill) : 'none'}
              fillOpacity={o.fill ? tween(frame, [s1 - 2, s1 + 8], [0, 1]) : undefined}
              stroke={o.color ?? color}
              strokeWidth={o.w ?? w}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1 2"
              strokeDashoffset={1 - p}
            />
          );
        })}
      </g>
    </svg>
  );
};

/** Handwritten chalk text, revealed left to right as if written. */
export const ChalkWrite: React.FC<{
  text: string;
  at: number;
  dur?: number;
  size: number;
  color?: string;
  weight?: number;
  font?: string;
  style?: React.CSSProperties;
  out?: number;
  glow?: boolean;
}> = ({text, at, dur, size, color = INK.white, weight = 700, font = HAND, style, out, glow}) => {
  const frame = useCurrentFrame();
  if (frame < at - 1) return null;
  const d = dur ?? Math.max(8, text.length * 1.6);
  const p = tween(frame, [at, at + d], [0, 1], (t) => t);
  const gone = out === undefined ? 1 : tween(frame, [out, out + 10], [1, 0]);
  if (gone <= 0) return null;
  return (
    <div
      style={{
        display: 'inline-block',
        fontFamily: font,
        fontSize: size,
        fontWeight: weight,
        lineHeight: 1.25,
        color,
        whiteSpace: 'nowrap',
        filter: 'url(#chalkText)',
        clipPath: `inset(-20% ${(1 - p) * 100}% -20% -4%)`,
        textShadow: glow ? `0 0 ${size * 0.25}px ${color}66` : undefined,
        opacity: gone,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

/** A chalk line drawn under or through something. */
export const Strike: React.FC<{x: number; y: number; w: number; at: number; color?: string; tilt?: number; thick?: number; dur?: number}> = ({
  x,
  y,
  w,
  at,
  color = INK.white,
  tilt = -2,
  thick = 7,
  dur = 9,
}) => (
  <Sketch
    strokes={[`M4 ${12 + tilt} Q${w * 0.5} ${12 - tilt * 0.6} ${w - 4} ${12 - tilt}`]}
    at={at}
    dur={dur}
    x={x}
    y={y - 12}
    width={w}
    height={24}
    color={color}
    w={thick}
  />
);

/** Wraps text and strikes it through with a chalk line sized to the text. */
export const Struck: React.FC<{at: number; color?: string; thick?: number; children: React.ReactNode}> = ({at, color = INK.white, thick = 8, children}) => {
  const frame = useCurrentFrame();
  const p = tween(frame, [at, at + 9], [0, 1], easeInOut);
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      {children}
      {p > 0 ? (
        <svg
          viewBox="0 0 100 20"
          preserveAspectRatio="none"
          style={{position: 'absolute', left: '-5%', width: '110%', top: 'calc(54% - 10px)', height: 20, overflow: 'visible', filter: 'url(#chalk)', clipPath: `inset(-50% ${(1 - p) * 100}% -50% 0)`}}
        >
          <path d="M1 13 Q50 9 99 7" stroke={color} strokeWidth={thick} vectorEffect="non-scaling-stroke" fill="none" strokeLinecap="round" />
        </svg>
      ) : null}
    </span>
  );
};

/** Fades a block out with a little blur, like a duster passing over it. */
export const useErase = (from: number, len = 10) => {
  const frame = useCurrentFrame();
  const p = tween(frame, [from, from + len], [0, 1], easeOut);
  return {opacity: 1 - p, filter: p > 0 ? `blur(${p * 8}px)` : undefined, transform: `translateX(${p * 18}px)`};
};

/** Visible-window helper for scenes: opacity in over `fadeIn`, erased after `end`. */
export const sceneOpacity = (frame: number, start: number, end: number, fadeIn = 6, fadeOut = 10) =>
  tween(frame, [start - 2, start + fadeIn], [0, 1]) * tween(frame, [end - 4, end - 4 + fadeOut], [1, 0], easeInOut);
