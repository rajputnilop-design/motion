import {Atom, BookOpen, Calculator, Download, FlaskConical, Globe, GraduationCap, Lightbulb, Music, Pencil, Ruler, Palette} from 'lucide-react';
import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeIn, pop, tween} from '../anim';
import {LogoMark, Wordmark} from '../components/Logo';
import {Sfx, Tap} from '../components/ui';
import {brandGradient, C, FONT, gradientText, saffronGradient} from '../theme';
import timeline from '../timeline.json';

const HIT = timeline.cues.finalHit.at;
const LINES = [
  {text: 'TEACH SMARTER.', at: 66},
  {text: 'CREATE FASTER.', at: 97},
  {text: 'INSPIRE MORE.', at: 126},
];
const LINES_OUT = 172;
const LOCKUP = 184;
const CTA = 204;
const PRESS = 238;

const ICONS = [BookOpen, Pencil, Atom, Globe, Lightbulb, Ruler, Calculator, FlaskConical, GraduationCap, Music, Palette];
const GLYPHS = ['π', 'a²+b²', 'अ', 'ABC', 'E=mc²', '÷', '123', 'क', '%', 'H₂O'];

type Floater = {x: number; y: number; size: number; speed: number; rot: number; kind: number; tint: string};

const FLOATERS: Floater[] = (() => {
  const out: Floater[] = [];
  let i = 0;
  while (out.length < 26 && i < 2000) {
    const x = random(`fx${i}`) * 1920;
    const y = random(`fy${i}`) * 1080;
    i++;
    const dx = (x - 960) / 700;
    const dy = (y - 540) / 330;
    if (dx * dx + dy * dy < 1) continue; // keep the centre clear for the typography
    if (out.some((o) => Math.hypot(o.x - x, o.y - y) < 190)) continue;
    const n = out.length;
    out.push({
      x,
      y,
      size: 34 + random(`fs${n}`) * 46,
      speed: 0.25 + random(`fv${n}`) * 0.5,
      rot: (random(`fr${n}`) - 0.5) * 40,
      kind: n,
      tint: [C.white, C.saffronLight, '#A5B4FC', C.white][n % 4],
    });
  }
  return out;
})();

const Floaters: React.FC = () => {
  const frame = useCurrentFrame();
  const appear = tween(frame, [0, 30], [0, 1]);
  return (
    <>
      {FLOATERS.map((f, i) => {
        const y = f.y - frame * f.speed;
        const x = f.x + Math.sin((frame + i * 30) / 40) * 12;
        const isIcon = i % 2 === 0;
        const Icon = ICONS[(i / 2) % ICONS.length | 0];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              opacity: (0.1 + (f.size / 80) * 0.14) * appear,
              transform: `translate(-50%, -50%) rotate(${f.rot + Math.sin(frame / 50 + i) * 8}deg)`,
              color: f.tint,
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: f.size * 0.8,
              whiteSpace: 'nowrap',
            }}
          >
            {isIcon ? <Icon size={f.size} strokeWidth={1.8} /> : GLYPHS[Math.floor(i / 2) % GLYPHS.length]}
          </div>
        );
      })}
    </>
  );
};

const Burst: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const t = tween(frame, [at, at + 40], [0, 1]);
  if (t <= 0 || t >= 1) return null;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 960 - 700,
          top: 470 - 700,
          width: 1400,
          height: 1400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,153,51,0.45) 0%, rgba(139,92,246,0.25) 30%, transparent 62%)',
          opacity: 1 - t,
          transform: `scale(${0.3 + t * 1.2})`,
        }}
      />
      {[0, 1].map((k) => {
        const tt = Math.max(0, t - k * 0.12);
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: 960 - 200,
              top: 470 - 200,
              width: 400,
              height: 400,
              borderRadius: '50%',
              border: `${4 - k}px solid ${k ? 'rgba(165,180,252,0.7)' : 'rgba(255,182,92,0.85)'}`,
              opacity: (1 - tt) * (tt > 0 ? 1 : 0),
              transform: `scale(${0.4 + tt * 1.8})`,
            }}
          />
        );
      })}
    </>
  );
};

export const Scene10Cta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  // Phase 1: hero logo
  const logoIn = pop(frame, fps, HIT, 10, 120);
  const heroOut = tween(frame, [56, 68], [0, 1], easeIn);
  const sparkle = pop(frame, fps, HIT + 10, 8, 160);

  // Phase 2: typography
  const linesOut = tween(frame, [LINES_OUT, LINES_OUT + 12], [0, 1], easeIn);

  // Phase 3: lock-up + CTA
  const lock = pop(frame, fps, LOCKUP, 16, 110);
  const cta = pop(frame, fps, CTA, 11, 130);
  const shine = ((frame - CTA - 10) % 45) / 45;
  const press = frame >= PRESS - 2 && frame <= PRESS + 4 ? 0.95 : 1;
  const pulse = frame > CTA + 12 ? ((frame - CTA - 12) % 40) / 40 : -1;

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <Floaters />
      <Burst at={HIT} />

      {/* Hero logo */}
      {heroOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 34,
            opacity: 1 - heroOut,
            transform: `scale(${1 - heroOut * 0.3})`,
          }}
        >
          <div style={{transform: `scale(${logoIn}) rotate(${(1 - logoIn) * -30}deg)`}}>
            <LogoMark size={230} sparkle={sparkle} sparkleRotation={(1 - sparkle) * 90} />
          </div>
          <div style={{opacity: tween(frame, [HIT + 12, HIT + 22], [0, 1]), transform: `translateY(${tween(frame, [HIT + 12, HIT + 26], [30, 0])}px)`}}>
            <Wordmark size={92} />
          </div>
        </div>
      ) : null}

      {/* Big typography */}
      {frame >= LINES[0].at - 2 && linesOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 250,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            opacity: 1 - linesOut,
            transform: `translateY(${-linesOut * 60}px) scale(${1 - linesOut * 0.08})`,
          }}
        >
          {LINES.map((l, i) => {
            const p = pop(frame, fps, l.at, 16, 150);
            return (
              <div key={l.text} style={{overflow: 'hidden', padding: '0 20px'}}>
                <div
                  style={{
                    fontSize: 138,
                    fontWeight: 800,
                    letterSpacing: '-0.01em',
                    lineHeight: 1.12,
                    color: C.white,
                    transform: `translateY(${(1 - p) * 110}%)`,
                    ...(i === 2 ? gradientText(saffronGradient) : {}),
                  }}
                >
                  {l.text}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {/* Lock-up */}
      {frame >= LOCKUP ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 300,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: tween(frame, [LOCKUP, LOCKUP + 8], [0, 1]),
            transform: `translateY(${(1 - lock) * 40}px)`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 36}}>
            <LogoMark size={150} />
            <Wordmark size={112} />
          </div>
          <div
            style={{
              marginTop: 22,
              fontSize: 44,
              fontWeight: 500,
              color: C.slate300,
              display: 'flex',
              alignItems: 'center',
              gap: 20,
              opacity: tween(frame, [LOCKUP + 8, LOCKUP + 18], [0, 1]),
            }}
          >
            <div style={{width: 60, height: 4, borderRadius: 2, background: brandGradient}} />
            Your AI Teaching Assistant
            <div style={{width: 60, height: 4, borderRadius: 2, background: brandGradient}} />
          </div>
        </div>
      ) : null}

      {/* CTA button */}
      {frame >= CTA ? (
        <div style={{position: 'absolute', left: 960 - 380, top: 680, width: 760, height: 124}}>
          {pulse >= 0 ? (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 62,
                border: '3px solid rgba(255,153,51,0.8)',
                opacity: 1 - pulse,
                transform: `scale(${1 + pulse * 0.18}, ${1 + pulse * 0.45})`,
              }}
            />
          ) : null}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 62,
              background: saffronGradient,
              boxShadow: '0 24px 60px -12px rgba(255,107,61,0.65), inset 0 2px 0 rgba(255,255,255,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 22,
              overflow: 'hidden',
              transform: `scale(${cta * press})`,
              opacity: tween(frame, [CTA, CTA + 4], [0, 1]),
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                width: 140,
                left: `${-20 + shine * 140}%`,
                background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.55) 50%, transparent 100%)',
                opacity: frame > CTA + 10 ? 1 : 0,
              }}
            />
            <div style={{width: 72, height: 72, borderRadius: 36, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Download size={38} color={C.saffronDeep} strokeWidth={3} />
            </div>
            <span style={{fontSize: 48, fontWeight: 800, letterSpacing: '0.04em', color: C.white, textShadow: '0 2px 10px rgba(124,45,18,0.35)'}}>
              DOWNLOAD THE APP
            </span>
          </div>
          <Tap x={500} y={62} at={PRESS} />
        </div>
      ) : null}

      <Sfx at={HIT - 2} name="impact" volume={0.7} />
      <Sfx at={HIT + 10} name="shimmer" volume={0.45} />
      {LINES.map((l) => (
        <Sfx key={l.at} at={l.at - 2} name="whoosh" volume={0.35} />
      ))}
      <Sfx at={LINES_OUT} name="whoosh-soft" volume={0.35} />
      <Sfx at={LOCKUP} name="shimmer" volume={0.4} />
      <Sfx at={CTA} name="pop" volume={0.45} />
      <Sfx at={PRESS} name="tap" volume={0.5} />
      <Sfx at={PRESS + 2} name="success" volume={0.45} />
    </AbsoluteFill>
  );
};
