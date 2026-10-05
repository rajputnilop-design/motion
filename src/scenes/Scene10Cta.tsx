import {Atom, BookOpen, Calculator, Download, FlaskConical, Globe, GraduationCap, Lightbulb, Music, Palette, Pencil, Ruler} from 'lucide-react';
import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeIn, pop, tween} from '../anim';
import {LogoMark, Wordmark} from '../components/Logo';
import {Sfx, Tap} from '../components/ui';
import {C, gradientText, logoGradient, purpleGradient, SANS, SERIF} from '../theme';
import timeline from '../timeline.json';

const HIT = timeline.cues.finalHit.at;
const LINES = [
  {text: 'TEACH SMARTER.', at: 66},
  {text: 'CREATE FASTER.', at: 97},
  {text: 'INSPIRE MORE.', at: 126},
];
const LINES_OUT = 172;
const LOCKUP = 184;
const CTA = 206;
const PRESS = 240;

const ICONS = [BookOpen, Pencil, Atom, Globe, Lightbulb, Ruler, Calculator, FlaskConical, GraduationCap, Music, Palette];
const GLYPHS = ['π', 'a²+b²', 'अ', 'ABC', 'E=mc²', '÷', 'क', '123', 'H₂O', 'ज्ञान'];

type Floater = {x: number; y: number; size: number; speed: number; rot: number; tint: string};

const FLOATERS: Floater[] = (() => {
  const out: Floater[] = [];
  let i = 0;
  while (out.length < 26 && i < 2000) {
    const x = random(`fx${i}`) * 1920;
    const y = random(`fy${i}`) * 1080;
    i++;
    const dx = (x - 960) / 720;
    const dy = (y - 520) / 340;
    if (dx * dx + dy * dy < 1) continue;
    if (out.some((o) => Math.hypot(o.x - x, o.y - y) < 190)) continue;
    const n = out.length;
    out.push({
      x,
      y,
      size: 32 + random(`fs${n}`) * 44,
      speed: 0.25 + random(`fv${n}`) * 0.45,
      rot: (random(`fr${n}`) - 0.5) * 36,
      tint: [C.white, C.lavender, C.cyan, C.white][n % 4],
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
        const Icon = ICONS[Math.floor(i / 2) % ICONS.length];
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: f.x + Math.sin((frame + i * 30) / 40) * 12,
              top: f.y - frame * f.speed,
              opacity: (0.08 + (f.size / 76) * 0.12) * appear,
              transform: `translate(-50%, -50%) rotate(${f.rot + Math.sin(frame / 50 + i) * 8}deg)`,
              color: f.tint,
              fontFamily: SERIF,
              fontWeight: 600,
              fontSize: f.size * 0.8,
              whiteSpace: 'nowrap',
            }}
          >
            {i % 2 === 0 ? <Icon size={f.size} strokeWidth={1.6} /> : GLYPHS[Math.floor(i / 2) % GLYPHS.length]}
          </div>
        );
      })}
    </>
  );
};

const Burst: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const t = tween(frame, [at, at + 44], [0, 1]);
  if (t <= 0 || t >= 1) return null;
  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: 960 - 800,
          top: 420 - 800,
          width: 1600,
          height: 1600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10,140,240,0.5) 0%, rgba(116,80,239,0.25) 28%, transparent 60%)',
          opacity: 1 - t,
          transform: `scale(${0.3 + t * 1.1})`,
        }}
      />
      {[0, 1].map((k) => {
        const tt = Math.max(0, t - k * 0.12);
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: 960 - 220,
              top: 420 - 220,
              width: 440,
              height: 440,
              borderRadius: '50%',
              border: `${3 - k}px solid ${k ? 'rgba(0,229,200,0.6)' : 'rgba(163,166,249,0.8)'}`,
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
  const heroOut = tween(frame, [56, 68], [0, 1], easeIn);
  const linesOut = tween(frame, [LINES_OUT, LINES_OUT + 12], [0, 1], easeIn);
  const lock = pop(frame, fps, LOCKUP, 16, 110);
  const cta = pop(frame, fps, CTA, 11, 130);
  const shine = ((frame - CTA - 10) % 45) / 45;
  const press = frame >= PRESS - 2 && frame <= PRESS + 4 ? 0.95 : 1;
  const pulse = frame > CTA + 12 ? ((frame - CTA - 12) % 40) / 40 : -1;

  return (
    <AbsoluteFill style={{fontFamily: SANS}}>
      <Floaters />
      <Burst at={HIT} />

      {heroOut < 1 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 210, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 1 - heroOut, transform: `scale(${1 - heroOut * 0.25})`}}>
          <LogoMark size={280} at={HIT} glow={1} />
          <div style={{marginTop: 24, opacity: tween(frame, [HIT + 14, HIT + 24], [0, 1]), transform: `translateY(${tween(frame, [HIT + 14, HIT + 28], [26, 0])}px)`}}>
            <Wordmark size={100} align="center" />
          </div>
        </div>
      ) : null}

      {frame >= LINES[0].at - 2 && linesOut < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 226,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: 1 - linesOut,
            transform: `translateY(${-linesOut * 60}px) scale(${1 - linesOut * 0.06})`,
          }}
        >
          {LINES.map((l, i) => {
            const p = pop(frame, fps, l.at, 16, 150);
            return (
              <div key={l.text} style={{overflow: 'hidden', padding: '0 24px 8px'}}>
                <div
                  style={{
                    fontFamily: SERIF,
                    fontSize: 142,
                    fontWeight: 600,
                    letterSpacing: '0.01em',
                    lineHeight: 1.08,
                    color: C.text,
                    transform: `translateY(${(1 - p) * 112}%)`,
                    ...(i === 2 ? {...gradientText(logoGradient), fontStyle: 'italic'} : {}),
                  }}
                >
                  {l.text}
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {frame >= LOCKUP ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 236,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            opacity: tween(frame, [LOCKUP, LOCKUP + 8], [0, 1]),
            transform: `translateY(${(1 - lock) * 40}px)`,
          }}
        >
          <div style={{display: 'flex', alignItems: 'center', gap: 34}}>
            <LogoMark size={190} glow={0.9} />
            <Wordmark size={118} />
          </div>
          <div
            style={{
              marginTop: 26,
              fontFamily: SERIF,
              fontStyle: 'italic',
              fontSize: 48,
              color: C.lavender,
              display: 'flex',
              alignItems: 'center',
              gap: 22,
              opacity: tween(frame, [LOCKUP + 8, LOCKUP + 18], [0, 1]),
            }}
          >
            <div style={{width: 60, height: 1.5, background: C.lavender, opacity: 0.6}} />
            Your AI Teaching Assistant
            <div style={{width: 60, height: 1.5, background: C.lavender, opacity: 0.6}} />
          </div>
        </div>
      ) : null}

      {frame >= CTA ? (
        <>
          <div style={{position: 'absolute', left: 960 - 370, top: 676, width: 740, height: 116}}>
            {pulse >= 0 ? (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 58,
                  border: '2px solid rgba(139,116,242,0.8)',
                  opacity: 1 - pulse,
                  transform: `scale(${1 + pulse * 0.16}, ${1 + pulse * 0.42})`,
                }}
              />
            ) : null}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 58,
                background: purpleGradient,
                boxShadow: '0 24px 60px -12px rgba(116,80,239,0.75), inset 0 1px 0 rgba(255,255,255,0.35)',
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
                  background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.45) 50%, transparent 100%)',
                  opacity: frame > CTA + 10 ? 1 : 0,
                }}
              />
              <div style={{width: 66, height: 66, borderRadius: 33, background: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Download size={34} color={C.purple} strokeWidth={2.8} />
              </div>
              <span style={{fontSize: 44, fontWeight: 700, letterSpacing: '0.08em', color: C.white}}>DOWNLOAD THE APP</span>
            </div>
            <Tap x={500} y={58} at={PRESS} />
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 830,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 12,
              fontSize: 30,
              fontWeight: 500,
              color: C.text2,
              letterSpacing: '0.02em',
              opacity: tween(frame, [CTA + 12, CTA + 24], [0, 1]),
            }}
          >
            <Globe size={28} color={C.cyan} /> aishikshamitra.com
          </div>
        </>
      ) : null}

      <Sfx at={HIT - 2} name="impact" volume={0.7} />
      <Sfx at={HIT + 20} name="shimmer" volume={0.45} />
      {LINES.map((l) => (
        <Sfx key={l.at} at={l.at - 2} name="whoosh" volume={0.32} />
      ))}
      <Sfx at={LINES_OUT} name="whoosh-soft" volume={0.32} />
      <Sfx at={LOCKUP} name="shimmer" volume={0.4} />
      <Sfx at={CTA} name="pop" volume={0.42} />
      <Sfx at={PRESS} name="tap" volume={0.5} />
      <Sfx at={PRESS + 2} name="success" volume={0.42} />
    </AbsoluteFill>
  );
};
