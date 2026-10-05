import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, pop, tween} from '../anim';
import {HomeScreen} from '../components/HomeScreen';
import {LogoMark, Wordmark} from '../components/Logo';
import {Phone} from '../components/Phone';
import {Sfx} from '../components/ui';
import {brandGradient, C, FONT, gradientText, saffronGradient} from '../theme';
import timeline from '../timeline.json';

const REVEAL = timeline.cues.reveal.at;
const MOVE = [44, 74] as const;
const WORDMARK = 62;
const PHONE_IN = 56;
const HOME = 100;

const BurstParticles: React.FC<{at: number; cx: number; cy: number}> = ({at, cx, cy}) => {
  const frame = useCurrentFrame();
  const t = tween(frame, [at, at + 34], [0, 1]);
  if (t <= 0 || t >= 1) return null;
  return (
    <>
      {new Array(16).fill(0).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2 + random(`a${i}`) * 0.3;
        const dist = 160 + random(`d${i}`) * 220;
        const size = 10 + random(`s${i}`) * 16;
        const x = cx + Math.cos(angle) * dist * t;
        const y = cy + Math.sin(angle) * dist * t;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              borderRadius: '50%',
              background: i % 3 === 0 ? C.saffron : i % 3 === 1 ? '#A5B4FC' : C.white,
              opacity: 1 - t,
              transform: `scale(${1 - t * 0.6})`,
            }}
          />
        );
      })}
    </>
  );
};

export const Scene02Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Logo: pops in at the centre, then glides to the left lock-up.
  const logoPop = pop(frame, fps, REVEAL, 10, 120);
  const move = tween(frame, [MOVE[0], MOVE[1]], [0, 1], easeInOut);
  const startC = {x: 960, y: 500, size: 260};
  const endC = {x: 150 + 75, y: 330 + 75, size: 150};
  const lx = startC.x + (endC.x - startC.x) * move;
  const ly = startC.y + (endC.y - startC.y) * move;
  const lsize = startC.size + (endC.size - startC.size) * move;
  const open = tween(frame, [REVEAL + 4, REVEAL + 24], [0, 1]);
  const sparkle = pop(frame, fps, REVEAL + 14, 8, 160);

  const glow = tween(frame, [REVEAL, REVEAL + 40], [0, 1]);
  const ring = tween(frame, [REVEAL + 2, REVEAL + 30], [0, 1]);

  const phoneP = pop(frame, fps, PHONE_IN, 16, 90);
  const splash = 1 - tween(frame, [HOME - 6, HOME + 4], [0, 1]);

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      {/* Reveal glow */}
      <div
        style={{
          position: 'absolute',
          left: 960 - 700,
          top: 500 - 700,
          width: 1400,
          height: 1400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(255,153,51,0.18) 35%, transparent 65%)',
          opacity: (1 - glow) * (frame >= REVEAL ? 1 : 0),
          transform: `scale(${0.3 + glow * 1.2})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 960 - 200,
          top: 500 - 200,
          width: 400,
          height: 400,
          borderRadius: '50%',
          border: '4px solid rgba(255, 182, 92, 0.8)',
          opacity: (1 - ring) * (frame >= REVEAL + 2 ? 1 : 0),
          transform: `scale(${0.4 + ring * 1.6})`,
        }}
      />
      <BurstParticles at={REVEAL + 2} cx={960} cy={500} />

      {/* Logo */}
      <div
        style={{
          position: 'absolute',
          left: lx - lsize / 2,
          top: ly - lsize / 2,
          transform: `scale(${logoPop}) rotate(${(1 - logoPop) * -30}deg)`,
        }}
      >
        <LogoMark size={lsize} open={open} sparkle={sparkle} sparkleRotation={(1 - sparkle) * 90} />
      </div>

      {/* Wordmark + tagline */}
      <div style={{position: 'absolute', left: 150, top: 520}}>
        <div style={{overflow: 'hidden', paddingBottom: 8}}>
          <div style={{display: 'flex'}}>
            {'AIShikshaMitra'.split('').map((ch, i) => {
              const at = WORDMARK + i * 1.3;
              const p = pop(frame, fps, at, 16, 140);
              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    fontWeight: 700,
                    fontSize: 112,
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em',
                    color: C.white,
                    ...(i < 2 ? gradientText(saffronGradient) : {}),
                    opacity: tween(frame, [at, at + 6], [0, 1]),
                    transform: `translateY(${(1 - p) * 120}%)`,
                  }}
                >
                  {ch}
                </span>
              );
            })}
          </div>
        </div>
        <div
          style={{
            marginTop: 10,
            fontSize: 42,
            fontWeight: 500,
            color: C.slate300,
            letterSpacing: '0.01em',
            opacity: tween(frame, [WORDMARK + 22, WORDMARK + 34], [0, 1]),
            transform: `translateY(${tween(frame, [WORDMARK + 22, WORDMARK + 40], [24, 0])}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 18,
          }}
        >
          <div style={{width: 56, height: 4, borderRadius: 2, background: brandGradient}} />
          Your AI Teaching Assistant
        </div>
      </div>

      {/* Phone */}
      <div
        style={{
          position: 'absolute',
          left: 1250,
          top: 128,
          transform: `translateY(${(1 - phoneP) * 900}px) rotate(${(1 - phoneP) * 8}deg)`,
          opacity: frame >= PHONE_IN ? 1 : 0,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: -200,
            top: -100,
            width: 800,
            height: 1000,
            background: 'radial-gradient(ellipse at center, rgba(91,91,247,0.35) 0%, transparent 60%)',
          }}
        />
        <Phone width={400} darkStatus={splash > 0.5}>
          <HomeScreen at={HOME} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              top: -50,
              background: brandGradient,
              opacity: splash,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24,
            }}
          >
            <LogoMark size={120} shadow={false} style={{transform: `scale(${pop(frame, fps, PHONE_IN + 10, 12, 140)})`}} />
            <Wordmark size={34} />
          </div>
        </Phone>
      </div>

      <Sfx at={REVEAL - 2} name="impact" volume={0.55} />
      <Sfx at={REVEAL + 12} name="shimmer" volume={0.45} />
      <Sfx at={MOVE[0]} name="whoosh-soft" volume={0.4} />
      <Sfx at={PHONE_IN} name="whoosh" volume={0.45} />
      <Sfx at={HOME + 12} name="pop" volume={0.25} />
    </AbsoluteFill>
  );
};
