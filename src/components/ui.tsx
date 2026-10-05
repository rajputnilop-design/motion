import {Check as CheckIcon, ChevronRight as ChevronRightIcon, Sparkles} from 'lucide-react';
import React from 'react';
import {Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, tween} from '../anim';
import {brandGradient, C, FONT} from '../theme';
import {LogoMark} from './Logo';

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
export const Sfx: React.FC<{at: number; name: SfxName; volume?: number; frames?: number}> = ({
  at,
  name,
  volume = 0.5,
  frames,
}) => (
  <Sequence from={Math.round(at)} durationInFrames={frames} layout="none">
    <Audio src={staticFile(`audio/sfx/${name}.wav`)} volume={volume * SFX_MASTER} />
  </Sequence>
);

/** A touch indicator: fades in, presses, and emits a ripple at frame `at`. */
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
          border: `3px solid rgba(91, 91, 247, ${(1 - ripple) * 0.8})`,
          opacity: frame >= at ? 1 : 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 40,
          height: 40,
          left: -20,
          top: -20,
          borderRadius: '50%',
          background: 'rgba(15, 23, 42, 0.28)',
          border: '3px solid rgba(255,255,255,0.95)',
          boxShadow: '0 6px 16px rgba(15,23,42,0.35)',
          transform: `scale(${press})`,
        }}
      />
    </div>
  );
};

/** Grey placeholder bar with a moving shimmer highlight. */
export const Skeleton: React.FC<{w: number | string; h: number; r?: number; style?: React.CSSProperties}> = ({
  w,
  h,
  r = 6,
  style,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: r,
        backgroundImage: 'linear-gradient(90deg, #E5E8F0 0%, #F4F5FA 45%, #E5E8F0 90%)',
        backgroundSize: '300% 100%',
        backgroundPosition: `${100 - ((frame * 4) % 100)}% 0`,
        ...style,
      }}
    />
  );
};

/** Fade + rise entrance driven by a spring. */
export const Rise: React.FC<{
  at: number;
  children: React.ReactNode;
  distance?: number;
  style?: React.CSSProperties;
  scaleFrom?: number;
}> = ({at, children, distance = 40, style, scaleFrom = 1}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, at, 18, 120);
  return (
    <div
      style={{
        opacity: tween(frame, [at, at + 10], [0, 1]),
        transform: `translateY(${(1 - p) * distance}px) scale(${scaleFrom + (1 - scaleFrom) * p})`,
        ...style,
      }}
    >
      {children}
    </div>
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
    <div style={{display: 'flex', flexWrap: 'wrap', columnGap: '0.28em', ...style}}>
      {words.map((w, i) => {
        const p = pop(frame, fps, at + i * stagger, 20, 130);
        return (
          <span key={i} style={{display: 'inline-block', overflow: 'hidden', paddingBottom: '0.12em', marginBottom: '-0.12em'}}>
            <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`, ...wordStyle?.(i)}}>
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

/** In-app header used on phone screens. */
export const AppHeader: React.FC<{title?: string; scale?: number}> = ({title, scale = 1}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10 * scale,
      padding: `${10 * scale}px ${20 * scale}px`,
      fontFamily: FONT,
    }}
  >
    <LogoMark size={34 * scale} shadow={false} />
    <div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.15}}>
      <span style={{fontWeight: 700, fontSize: 16 * scale, color: C.ink}}>
        <span style={{color: C.saffronDeep}}>AI</span>ShikshaMitra
      </span>
      {title ? <span style={{fontWeight: 500, fontSize: 12 * scale, color: C.slate500}}>{title}</span> : null}
    </div>
  </div>
);

/** Primary call-to-action button used inside the app UI. */
export const GenerateButton: React.FC<{label: string; pressed?: number; glow?: number; style?: React.CSSProperties}> = ({
  label,
  pressed = 0,
  glow = 0,
  style,
}) => (
  <div
    style={{
      height: 54,
      borderRadius: 16,
      background: brandGradient,
      color: C.white,
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: 17,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      transform: `scale(${1 - pressed * 0.05})`,
      boxShadow: `0 10px 24px -6px rgba(91, 91, 247, ${0.5 + glow * 0.4}), 0 0 ${glow * 40}px rgba(139, 92, 246, ${glow * 0.8})`,
      ...style,
    }}
  >
    <Sparkles size={20} color="#FFE2B3" fill="#FFE2B3" />
    {label}
  </div>
);

/** Section kicker: small saffron pill above a scene title. */
export const Kicker: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '10px 20px',
      borderRadius: 999,
      background: 'rgba(255, 153, 51, 0.12)',
      border: '1.5px solid rgba(255, 153, 51, 0.45)',
      color: C.saffronLight,
      fontFamily: FONT,
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      ...style,
    }}
  >
    <Sparkles size={20} color={C.saffronLight} />
    {children}
  </div>
);

/** Green tick + label that pops in at `at`. */
export const CheckItem: React.FC<{label: string; at: number; size?: number}> = ({label, at, size = 40}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, at, 11, 160);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: size * 0.45,
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: size,
        color: C.white,
        opacity: tween(frame, [at, at + 6], [0, 1]),
        transform: `translateX(${(1 - p) * -30}px)`,
      }}
    >
      <div
        style={{
          width: size * 1.05,
          height: size * 1.05,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #34D399, #16A34A)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${p})`,
          boxShadow: '0 8px 20px -6px rgba(34,197,94,0.6)',
        }}
      >
        <CheckIcon size={size * 0.62} color={C.white} strokeWidth={3.4} />
      </div>
      {label}
    </div>
  );
};

/** Row of chips separated by chevrons; each chip pops in at its own frame. */
export const Breadcrumb: React.FC<{items: {label: string; at: number}[]; size?: number; style?: React.CSSProperties}> = ({
  items,
  size = 28,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontFamily: FONT, ...style}}>
      {items.map((it, i) => {
        const p = pop(frame, fps, it.at, 12, 150);
        const visible = frame >= it.at;
        return (
          <React.Fragment key={i}>
            {i > 0 ? (
              <ChevronRightIcon size={size} color={visible ? C.saffron : 'rgba(255,255,255,0.25)'} strokeWidth={3} />
            ) : null}
            <div
              style={{
                padding: `${size * 0.32}px ${size * 0.7}px`,
                borderRadius: 999,
                fontSize: size,
                fontWeight: 600,
                color: visible ? C.white : 'rgba(255,255,255,0.35)',
                background: visible ? 'rgba(91, 91, 247, 0.35)' : 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${visible ? 'rgba(165, 180, 252, 0.7)' : 'rgba(255,255,255,0.12)'}`,
                transform: `scale(${visible ? 0.85 + 0.15 * p : 0.95})`,
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
