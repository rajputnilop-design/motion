import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, pop, tween} from '../anim';
import {Background, Grain} from '../components/Background';
import {LogoMark, Wordmark} from '../components/Logo';
import {Phone, PHONE_RATIO} from '../components/Phone';
import {MaskWords, Sfx, SfxName} from '../components/ui';
import {C, SANS, SERIF} from '../theme';
import {HEADER_H} from './mobile';
import config from './reels.json';

export type ReelId = keyof typeof config.reels;
export const REEL = {fps: config.fps, width: config.width, height: config.height, duration: config.duration, endCard: config.endCard};

export type Beat = {from: number; to: number; text: string; italic?: number[]; kicker?: string};
/** Camera keyframe: zoom `s` around the phone's logical point (400 x 824 space) at height `fy`. */
export type Cam = {f: number; s: number; fy?: number};

export type ReelSpec = {
  id: ReelId;
  beats: Beat[];
  cam: Cam[];
  sfx: {at: number; name: SfxName; volume?: number}[];
  endLine: string;
  endItalic?: number[];
  time?: (frame: number) => string;
  Screen: React.FC;
};

const PHONE_W = 400;
const PHONE_SCALE = 1.6;
const PHONE_TOP = 598;
const HEAD_TOP = 284;

const MUSIC = 0.46;
const DUCKED = 0.2;

const camAt = (cam: Cam[], f: number): {s: number; fy: number} => {
  if (f <= cam[0].f) return {s: cam[0].s, fy: cam[0].fy ?? 400};
  for (let i = 0; i < cam.length - 1; i++) {
    const a = cam[i];
    const b = cam[i + 1];
    if (f <= b.f) {
      const t = easeInOut((f - a.f) / (b.f - a.f));
      return {s: a.s + (b.s - a.s) * t, fy: (a.fy ?? 400) + ((b.fy ?? 400) - (a.fy ?? 400)) * t};
    }
  }
  const z = cam[cam.length - 1];
  return {s: z.s, fy: z.fy ?? 400};
};

const BrandBug: React.FC = () => {
  const frame = useCurrentFrame();
  const o = tween(frame, [REEL.endCard - 8, REEL.endCard + 4], [1, 0]);
  return (
    <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 16, opacity: o}}>
      <LogoMark size={70} glow={0.5} />
      <Wordmark size={40} />
    </div>
  );
};

const Headline: React.FC<{beat: Beat}> = ({beat}) => {
  const frame = useCurrentFrame();
  if (frame < beat.from - 1 || frame > beat.to + 1) return null;
  const out = tween(frame, [beat.to - 7, beat.to], [0, 1], easeInOut);
  return (
    <div
      style={{
        position: 'absolute',
        left: 60,
        right: 60,
        top: HEAD_TOP,
        height: 260,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 1 - out,
        transform: `translateY(${-out * 26}px)`,
      }}
    >
      {beat.kicker ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: '0.28em',
            color: C.purpleLight,
            marginBottom: 18,
            opacity: tween(frame, [beat.from, beat.from + 8], [0, 1]),
          }}
        >
          <div style={{width: tween(frame, [beat.from, beat.from + 14], [0, 40]), height: 2, background: C.purpleLight}} />
          {beat.kicker}
          <div style={{width: tween(frame, [beat.from, beat.from + 14], [0, 40]), height: 2, background: C.purpleLight}} />
        </div>
      ) : null}
      <MaskWords
        text={beat.text}
        at={beat.from}
        stagger={2}
        style={{
          justifyContent: 'center',
          textAlign: 'center',
          fontFamily: SERIF,
          fontSize: 82,
          fontWeight: 600,
          lineHeight: 1.08,
          color: C.text,
          letterSpacing: '-0.01em',
          fontVariantNumeric: 'lining-nums',
          textShadow: '0 4px 30px rgba(0,0,0,0.6)',
        }}
        wordStyle={(i) => (beat.italic?.includes(i) ? {fontStyle: 'italic', color: C.lavender} : {})}
      />
    </div>
  );
};

/** Debug overlay: a 25 px grid in the app's content coordinates (below the header), for placing taps. */
export const TapGrid: React.FC = () => (
  <div style={{position: 'absolute', left: 0, right: 0, top: HEADER_H, bottom: 0, zIndex: 99, pointerEvents: 'none'}}>
    {Array.from({length: 26}, (_, i) => (
      <div key={`h${i}`} style={{position: 'absolute', left: 0, right: 0, top: i * 25, height: 1, background: i % 2 ? 'rgba(0,255,0,0.35)' : 'rgba(255,0,0,0.7)'}}>
        {i % 2 ? null : <span style={{position: 'absolute', left: 2, top: -9, fontSize: 9, color: '#f00', background: '#000'}}>{i * 25}</span>}
      </div>
    ))}
    {Array.from({length: 16}, (_, i) => (
      <div key={`v${i}`} style={{position: 'absolute', top: 0, bottom: 0, left: i * 25, width: 1, background: i % 2 ? 'rgba(0,255,0,0.35)' : 'rgba(255,0,0,0.7)'}}>
        {i % 2 ? null : <span style={{position: 'absolute', top: 2, left: 2, fontSize: 9, color: '#f00', background: '#000'}}>{i * 25}</span>}
      </div>
    ))}
  </div>
);

const PhoneRig: React.FC<{cam: Cam[]; time?: (f: number) => string; grid?: boolean; children: React.ReactNode}> = ({cam, time, grid, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {s, fy} = camAt(cam, frame);
  const enter = pop(frame, fps, 0, 16, 120);
  const exit = tween(frame, [REEL.endCard - 6, REEL.endCard + 14], [0, 1], easeInOut);
  if (exit >= 1) return null;
  const sway = Math.sin(frame / 55) * 5;
  const tilt = 3 + Math.cos(frame / 70) * 1.5;
  const float = Math.sin(frame / 38) * 6;
  return (
    <div
      style={{
        position: 'absolute',
        left: (REEL.width - PHONE_W) / 2,
        top: PHONE_TOP,
        width: PHONE_W,
        height: PHONE_W * PHONE_RATIO,
        transformOrigin: '50% 0',
        transform: `translateY(${(1 - enter) * 70 + float + exit * 260}px) scale(${PHONE_SCALE * (1 - 0.15 * exit)})`,
        opacity: 1 - exit,
        filter: exit > 0 ? `blur(${exit * 8}px)` : undefined,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: `50% ${fy}px`,
          transform: `perspective(2400px) rotateY(${sway}deg) rotateX(${tilt}deg) scale(${s})`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            top: '6%',
            bottom: '2%',
            borderRadius: 80,
            background: 'radial-gradient(ellipse, rgba(116,80,239,0.55), transparent 70%)',
            filter: 'blur(50px)',
          }}
        />
        <Phone width={PHONE_W} darkStatus time={time?.(frame)} screenStyle={{background: C.app}}>
          {children}
          {grid ? <TapGrid /> : null}
        </Phone>
      </div>
    </div>
  );
};

const EndCard: React.FC<{line: string; italic?: number[]}> = ({line, italic}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = REEL.endCard;
  if (frame < at) return null;
  const glow = tween(frame, [at, at + 20], [0, 1]);
  const word = pop(frame, fps, at + 22, 14, 120);
  const cta = pop(frame, fps, at + 52, 12, 150);
  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 540 - 520,
          top: 520 - 420,
          width: 1040,
          height: 1040,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(20,80,245,0.30) 0%, rgba(116,80,239,0.18) 35%, transparent 68%)',
          opacity: glow,
        }}
      />
      <div style={{position: 'absolute', left: 540 - 160, top: 400}}>
        <LogoMark size={320} at={at + 4} glow={1} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 770, display: 'flex', justifyContent: 'center', opacity: Math.min(1, word * 1.4), transform: `translateY(${(1 - word) * 40}px)`}}>
        <Wordmark size={104} align="center" />
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, top: 1010}}>
        <MaskWords
          text={line}
          at={at + 34}
          stagger={3}
          style={{justifyContent: 'center', fontFamily: SERIF, fontSize: 74, fontWeight: 600, color: C.text, lineHeight: 1.1, textAlign: 'center'}}
          wordStyle={(i) => (italic?.includes(i) ? {fontStyle: 'italic', color: C.lavender} : {})}
        />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 1260, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 26}}>
        <div
          style={{
            padding: '26px 64px',
            borderRadius: 999,
            background: 'linear-gradient(135deg, #6A45EC, #7450EF 50%, #8E6CF6)',
            boxShadow: '0 20px 50px -14px rgba(116,80,239,0.9)',
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: 44,
            color: C.white,
            opacity: Math.min(1, cta * 1.5),
            transform: `scale(${0.7 + 0.3 * cta})`,
          }}
        >
          Try it today
        </div>
        <div style={{fontFamily: SANS, fontWeight: 600, fontSize: 40, letterSpacing: '0.04em', color: C.text2, opacity: tween(frame, [at + 62, at + 72], [0, 1])}}>
          aishikshamitra.com
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const Reel: React.FC<{spec: ReelSpec; music?: boolean; voiceover?: boolean; grid?: boolean}> = ({spec, music = true, voiceover = true, grid}) => {
  const vo = config.reels[spec.id].vo.map((v) => ({...v, frames: Math.round(v.seconds * REEL.fps)}));
  const volume = (f: number) => {
    let v = MUSIC;
    if (voiceover) {
      for (const l of vo) {
        const ramp = interpolate(f, [l.at - 6, l.at, l.at + l.frames, l.at + l.frames + 10], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        v = Math.min(v, MUSIC - (MUSIC - DUCKED) * ramp);
      }
    }
    return v;
  };
  return (
    <AbsoluteFill style={{background: '#050507'}}>
      <Background />
      <BrandBug />
      {spec.beats.map((b, i) => (
        <Headline key={i} beat={b} />
      ))}
      <PhoneRig cam={spec.cam} time={spec.time} grid={grid}>
        <spec.Screen />
      </PhoneRig>
      <EndCard line={spec.endLine} italic={spec.endItalic} />
      {music ? <Audio src={staticFile(`audio/reels/music-${spec.id}.wav`)} volume={volume} /> : null}
      {voiceover
        ? vo.map((l) => (
            <Sequence key={l.file} from={l.at} layout="none" name={l.file}>
              <Audio src={staticFile(`audio/reels/${l.file}.wav`)} volume={1} />
            </Sequence>
          ))
        : null}
      {spec.sfx.map((s, i) => (
        <Sfx key={i} at={s.at} name={s.name} volume={s.volume ?? 0.4} />
      ))}
      <Grain />
    </AbsoluteFill>
  );
};
