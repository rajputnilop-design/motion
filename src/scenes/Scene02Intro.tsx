import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, pop, tween} from '../anim';
import {AppShell} from '../components/AppShell';
import {BROWSER_H, BROWSER_W, Browser} from '../components/Browser';
import {ChatPage, ChatWelcome, Composer} from '../components/Chat';
import {camAt, Device} from '../components/Device';
import {LogoMark} from '../components/Logo';
import {Phone} from '../components/Phone';
import {Sfx} from '../components/ui';
import {C, SANS, SERIF} from '../theme';
import timeline from '../timeline.json';

const REVEAL = timeline.cues.reveal.at;
const WORD = 32;
const TAG = 52;
const SUB = 64;
const MOVE: [number, number] = [90, 122];
const BROWSER_IN = 98;
const PHONE_IN = 116;

const Sparks: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const t = tween(frame, [at, at + 40], [0, 1]);
  if (t <= 0 || t >= 1) return null;
  return (
    <>
      {new Array(22).fill(0).map((_, i) => {
        const a = (i / 22) * Math.PI * 2 + random(`sa${i}`) * 0.4;
        const d = 180 + random(`sd${i}`) * 300;
        const s = 4 + random(`ss${i}`) * 7;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: 960 + Math.cos(a) * d * t - s / 2,
              top: 380 + Math.sin(a) * d * t - s / 2,
              width: s,
              height: s,
              borderRadius: '50%',
              background: i % 3 === 0 ? C.aqua : i % 3 === 1 ? C.lavender : C.white,
              opacity: (1 - t) * 0.9,
              boxShadow: `0 0 10px ${i % 2 ? C.cyan : C.purpleLight}`,
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
  const move = tween(frame, [MOVE[0], MOVE[1]], [0, 1], easeInOut);
  const glow = tween(frame, [REVEAL, REVEAL + 45], [0, 1]);

  const cam = camAt(
    frame,
    [
      {f: BROWSER_IN, cam: {look: [BROWSER_W / 2, BROWSER_H / 2], at: [1560, 600], scale: 0.56, ry: -40, rx: 4, opacity: 0}},
      {f: BROWSER_IN + 30, cam: {look: [BROWSER_W / 2, BROWSER_H / 2], at: [1300, 540], scale: 0.66, ry: -17, rx: 3, opacity: 1}},
      {f: 200, cam: {look: [BROWSER_W / 2, BROWSER_H / 2], at: [1285, 540], scale: 0.68, ry: -12, rx: 2, opacity: 1}},
    ],
    easeInOut,
  );
  const phoneP = pop(frame, fps, PHONE_IN, 16, 90);

  return (
    <AbsoluteFill style={{fontFamily: SANS}}>
      {/* bloom light */}
      <div
        style={{
          position: 'absolute',
          left: 960 - 800,
          top: 380 - 800,
          width: 1600,
          height: 1600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(10,140,240,0.45) 0%, rgba(116,80,239,0.22) 28%, transparent 60%)',
          opacity: frame >= REVEAL ? (1 - glow) * (1 - move) : 0,
          transform: `scale(${0.3 + glow})`,
        }}
      />
      <Sparks at={REVEAL + 20} />

      {/* Lock-up: logo, wordmark, taglines */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          transform: `translate(${-490 * move}px, ${20 * move}px) scale(${1 - 0.38 * move})`,
          transformOrigin: '960px 540px',
        }}
      >
        <div style={{position: 'absolute', left: 960 - 150, top: 160}}>
          <LogoMark size={300} at={REVEAL} glow={0.9} />
        </div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 486, display: 'flex', justifyContent: 'center'}}>
          {'AIShikshaMitra'.split('').map((ch, i) => {
            const at = WORD + i * 1.4;
            const p = pop(frame, fps, at, 16, 140);
            return (
              <span key={i} style={{display: 'inline-block', overflow: 'hidden', padding: '0 0 14px'}}>
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: SERIF,
                    fontWeight: 600,
                    fontSize: 124,
                    lineHeight: 1.1,
                    color: C.text,
                    transform: `translateY(${(1 - p) * 110}%)`,
                    opacity: tween(frame, [at, at + 5], [0, 1]),
                  }}
                >
                  {ch}
                </span>
              </span>
            );
          })}
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 650,
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: `${tween(frame, [TAG, TAG + 30], [0.6, 0.34])}em`,
            color: C.purpleLight,
            opacity: tween(frame, [TAG, TAG + 12], [0, 1]),
          }}
        >
          THE AI BUILT FOR BHARAT
        </div>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 712,
            textAlign: 'center',
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 46,
            color: C.lavender,
            opacity: tween(frame, [SUB, SUB + 12], [0, 1]),
            transform: `translateY(${tween(frame, [SUB, SUB + 18], [20, 0])}px)`,
          }}
        >
          Your AI Teaching Assistant
        </div>
      </div>

      {/* The real web app */}
      {frame >= BROWSER_IN ? (
        <Device cam={cam}>
          <Browser url="aishikshamitra.com/chat">
            <AppShell active="chat">
              <ChatPage at={BROWSER_IN + 6} />
            </AppShell>
          </Browser>
        </Device>
      ) : null}

      {/* Phone (installable app) */}
      {frame >= PHONE_IN ? (
        <div
          style={{
            position: 'absolute',
            left: 1610,
            top: 360,
            transform: `translateY(${(1 - phoneP) * 700}px) rotate(${(1 - phoneP) * 10 + 4}deg) scale(0.6)`,
            transformOrigin: '0 0',
          }}
        >
          <Phone width={400} darkStatus screenStyle={{background: C.app}}>
            <div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', justifyContent: 'center'}}>
              <ChatWelcome at={PHONE_IN + 8} scale={0.78} maxWidth={400} />
            </div>
            <div style={{position: 'absolute', left: 0, right: 0, bottom: 24, display: 'flex', justifyContent: 'center', zoom: 0.92}}>
              <Composer width={360} />
            </div>
          </Phone>
        </div>
      ) : null}

      <Sfx at={REVEAL - 2} name="impact" volume={0.55} />
      <Sfx at={REVEAL + 20} name="shimmer" volume={0.5} />
      <Sfx at={WORD} name="whoosh-soft" volume={0.3} />
      <Sfx at={MOVE[0]} name="whoosh" volume={0.4} />
      <Sfx at={PHONE_IN} name="whoosh-soft" volume={0.35} />
    </AbsoluteFill>
  );
};
