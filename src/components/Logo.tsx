import React from 'react';
import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeOut, pop, tween} from '../anim';
import {C, SANS, SERIF} from '../theme';

// Layer geometry in the 888x888 logo canvas (see public/brand/logo-*.png).
const CANVAS = 888;
const pct = (x: number, y: number) => `${(x / CANVAS) * 100}% ${(y / CANVAS) * 100}%`;

type Part = {file: string; origin: string; style: (p: number, q: number) => React.CSSProperties};

const PARTS: Part[] = [
  {
    file: 'book-lower',
    origin: pct(444, 834),
    style: (p) => ({opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 60}px) scaleX(${0.4 + 0.6 * p})`}),
  },
  {
    file: 'book-upper',
    origin: pct(444, 795),
    style: (p) => ({opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 50}px) scaleX(${0.3 + 0.7 * p})`}),
  },
  {file: 'petal-left', origin: pct(430, 640), style: (p) => ({opacity: Math.min(1, p * 2), transform: `rotate(${(1 - p) * 48}deg) scale(${0.5 + 0.5 * p})`})},
  {file: 'petal-right', origin: pct(458, 640), style: (p) => ({opacity: Math.min(1, p * 2), transform: `rotate(${(1 - p) * -48}deg) scale(${0.5 + 0.5 * p})`})},
  {file: 'petal-top', origin: pct(444, 600), style: (p) => ({opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 70}px) scale(${0.4 + 0.6 * p})`})},
  {file: 'star', origin: pct(444, 561), style: (p) => ({opacity: Math.min(1, p * 3), transform: `rotate(${(1 - p) * 120}deg) scale(${p})`})},
  {file: 'dots', origin: pct(444, 645), style: (p) => ({opacity: p, transform: `scale(${0.3 + 0.7 * p})`})},
];

// Start offset (frames) of each part, relative to `at`.
const DELAYS = [0, 4, 10, 10, 14, 22, 28];

/** The real AIShikshaMitra lotus-book logo. With `at`, it blooms part by part from that frame. */
export const LogoMark: React.FC<{size: number; at?: number; glow?: number; style?: React.CSSProperties}> = ({
  size,
  at,
  glow = 0.6,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const flare = at === undefined ? 0 : tween(frame, [at + 24, at + 30], [0, 1]) * tween(frame, [at + 30, at + 50], [1, 0]);
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        filter: glow > 0 ? `drop-shadow(0 0 ${size * 0.08}px rgba(10, 140, 240, ${0.55 * glow})) drop-shadow(0 0 ${size * 0.2}px rgba(20, 80, 245, ${0.35 * glow}))` : undefined,
        ...style,
      }}
    >
      {PARTS.map((part, i) => {
        const p = at === undefined ? 1 : pop(frame, fps, at + DELAYS[i], i === 5 ? 9 : 14, i === 5 ? 170 : 110);
        const s = part.style(Math.max(0, p), p);
        return (
          <Img
            key={part.file}
            src={staticFile(`brand/logo-${part.file}.png`)}
            style={{position: 'absolute', inset: 0, width: size, height: size, transformOrigin: part.origin, ...s}}
          />
        );
      })}
      {flare > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: (444 / CANVAS) * size - size * 0.6,
            top: (561 / CANVAS) * size - size * 0.04,
            width: size * 1.2,
            height: size * 0.08,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, rgba(120,200,255,0.5) 30%, transparent 70%)',
            opacity: flare,
            transform: `scaleX(${0.4 + 0.6 * easeOut(flare)})`,
          }}
        />
      ) : null}
    </div>
  );
};

/** "AIShikshaMitra" in the app's serif, with the "THE AI BUILT FOR BHARAT" line beneath. */
export const Wordmark: React.FC<{size: number; tagline?: boolean; align?: 'left' | 'center'; style?: React.CSSProperties}> = ({
  size,
  tagline = true,
  align = 'left',
  style,
}) => (
  <div style={{display: 'flex', flexDirection: 'column', alignItems: align === 'center' ? 'center' : 'flex-start', ...style}}>
    <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: size, lineHeight: 1.05, color: C.text, letterSpacing: '-0.01em', whiteSpace: 'nowrap'}}>
      AIShikshaMitra
    </div>
    {tagline ? (
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 600,
          fontSize: size * 0.2,
          letterSpacing: '0.32em',
          color: C.purpleLight,
          marginTop: size * 0.12,
          marginLeft: align === 'left' ? size * 0.02 : 0,
          whiteSpace: 'nowrap',
        }}
      >
        THE AI BUILT FOR BHARAT
      </div>
    ) : null}
  </div>
);
