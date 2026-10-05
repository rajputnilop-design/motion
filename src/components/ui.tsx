import {Check as CheckIcon, ChevronRight as ChevronRightIcon} from 'lucide-react';
import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, tween} from '../anim';
import {C, SANS, SERIF} from '../theme';

export type SfxName =
  | 'whoosh'
  | 'whoosh-soft'
  | 'pop'
  | 'pop-high'
  | 'tap'
  | 'type'
  | 'shimmer'
  | 'success'
  | 'impact'
  | 'glitch'
  | 'swipe'
  | 'ding'
  | 'tick';

const SFX_MASTER = 0.7;

/** Places a one-shot sound effect at a frame relative to the enclosing scene. */
export const Sfx: React.FC<{at: number; name: SfxName; volume?: number; frames?: number}> = ({at, name, volume = 0.5, frames}) => (
  <Sequence from={Math.round(at)} durationInFrames={frames} layout="none">
    <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={volume * SFX_MASTER} />
  </Sequence>
);

/** A touch/click indicator: fades in, presses, and emits a ripple at frame `at`. */
export const Tap: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const frame = useCurrentFrame();
  const visible = tween(frame, [at - 10, at - 4], [0, 1]) * tween(frame, [at + 8, at + 16], [1, 0]);
  if (visible <= 0) return null;
  const press = frame < at ? tween(frame, [at - 4, at], [1, 0.78]) : tween(frame, [at, at + 6], [0.78, 1]);
  const ripple = tween(frame, [at, at + 16], [0, 1]);
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, zIndex: 50, opacity: visible}}>
      <div
        style={{
          position: 'absolute',
          width: 36 + ripple * 64,
          height: 36 + ripple * 64,
          left: -(18 + ripple * 32),
          top: -(18 + ripple * 32),
          borderRadius: '50%',
          border: `3px solid rgba(167, 139, 250, ${(1 - ripple) * 0.9})`,
          opacity: frame >= at ? 1 : 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 38,
          height: 38,
          left: -19,
          top: -19,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.22)',
          border: '2.5px solid rgba(255,255,255,0.95)',
          boxShadow: '0 6px 18px rgba(0,0,0,0.5)',
          transform: `scale(${press})`,
        }}
      />
    </div>
  );
};

/** Placeholder bar with a moving shimmer highlight. */
export const Skeleton: React.FC<{w: number | string; h: number; r?: number; dark?: boolean; style?: React.CSSProperties}> = ({
  w,
  h,
  r = 6,
  dark,
  style,
}) => {
  const frame = useCurrentFrame();
  const [a, b] = dark ? ['#1D1D20', '#2A2A30'] : ['#E9EBF1', '#F6F7FA'];
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        backgroundImage: `linear-gradient(90deg, ${a} 0%, ${b} 45%, ${a} 90%)`,
        backgroundSize: '300% 100%',
        backgroundPosition: `${100 - ((frame * 4) % 100)}% 0`,
        ...style,
      }}
    />
  );
};

/** Text that slides up from behind a mask, one word at a time. */
export const MaskWords: React.FC<{
  text: string;
  at: number;
  stagger?: number;
  style?: React.CSSProperties;
  wordStyle?: (i: number) => React.CSSProperties;
}> = ({text, at, stagger = 3, style, wordStyle}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  return (
    <div style={{display: 'flex', flexWrap: 'wrap', columnGap: '0.26em', ...style}}>
      {words.map((w, i) => {
        const p = pop(frame, fps, at + i * stagger, 20, 130);
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', padding: '0.04em 0.06em 0.16em', margin: '-0.04em -0.06em -0.16em'}}>
            <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 115}%)`, ...wordStyle?.(i)}}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

/** Small uppercase label above a scene title. */
export const Kicker: React.FC<{children: React.ReactNode; at?: number; style?: React.CSSProperties}> = ({children, at = 0, style}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 19,
        letterSpacing: '0.28em',
        color: C.purpleLight,
        opacity: tween(frame, [at, at + 10], [0, 1]),
        ...style,
      }}
    >
      <div style={{width: tween(frame, [at, at + 16], [0, 44]), height: 2, background: C.purpleLight, borderRadius: 1}} />
      {children}
    </div>
  );
};

/** Big serif scene title. */
export const SceneTitle: React.FC<{
  text: string;
  at: number;
  size?: number;
  style?: React.CSSProperties;
  italicFrom?: number;
  italicIdx?: number[];
}> = ({
  text,
  at,
  size = 92,
  style,
  italicFrom,
  italicIdx,
}) => (
  <MaskWords
    text={text}
    at={at}
    style={{fontFamily: SERIF, fontSize: size, fontWeight: 600, color: C.text, letterSpacing: '-0.01em', lineHeight: 1.06, ...style}}
    wordStyle={(i) => ((italicFrom !== undefined && i >= italicFrom) || italicIdx?.includes(i) ? {fontStyle: 'italic', color: C.lavender} : {})}
  />
);

/** Tick + label that pops in at `at`. */
export const CheckItem: React.FC<{label: string; at: number; size?: number}> = ({label, at, size = 36}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, at, 11, 160);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: size * 0.5,
        fontFamily: SANS,
        fontWeight: 500,
        fontSize: size,
        color: C.text,
        opacity: tween(frame, [at, at + 6], [0, 1]),
        transform: `translateX(${(1 - p) * -30}px)`,
      }}
    >
      <div
        style={{
          width: size * 1.05,
          height: size * 1.05,
          borderRadius: '50%',
          background: 'rgba(116,80,239,0.18)',
          border: '1.5px solid rgba(139,108,246,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${p})`,
        }}
      >
        <CheckIcon size={size * 0.58} color="#B9A3FF" strokeWidth={3} />
      </div>
      {label}
    </div>
  );
};

/** Row of chips separated by chevrons; each chip lights up at its own frame. */
export const Breadcrumb: React.FC<{items: {label: string; at: number; deva?: boolean}[]; size?: number; style?: React.CSSProperties}> = ({
  items,
  size = 26,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', rowGap: 12, fontFamily: SANS, ...style}}>
      {items.map((it, i) => {
        const p = pop(frame, fps, it.at, 12, 150);
        const on = frame >= it.at;
        return (
          <React.Fragment key={i}>
            {i > 0 ? <ChevronRightIcon size={size} color={on ? C.purpleLight : 'rgba(255,255,255,0.2)'} strokeWidth={2.4} /> : null}
            <div
              style={{
                padding: `${size * 0.3}px ${size * 0.68}px`,
                borderRadius: 999,
                fontSize: size,
                fontWeight: 500,
                color: on ? C.text : 'rgba(255,255,255,0.32)',
                background: on ? 'rgba(116,80,239,0.22)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${on ? 'rgba(139,108,246,0.7)' : 'rgba(255,255,255,0.1)'}`,
                transform: `scale(${on ? 0.85 + 0.15 * p : 0.95})`,
              }}
            >
              {it.label}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
