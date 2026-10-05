import {Copy, Download, RefreshCw} from 'lucide-react';
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, pop, tween} from '../anim';
import {AppShell} from '../components/AppShell';
import {BROWSER_W, Browser} from '../components/Browser';
import {ChatWelcome, Composer, VoiceFab} from '../components/Chat';
import {camAt, Device} from '../components/Device';
import {Sfx} from '../components/ui';
import {MINI_DIAGRAMS} from '../illustrations/MiniDiagrams';
import {WaterCycle} from '../illustrations/WaterCycle';
import {C, cardShadow, SANS, SERIF} from '../theme';

const PROMPT = 'Create a diagram explaining the water cycle.';
const T = {type: 10, send: 58, reply: 72, image: 80, side: 128, text: 140};
const CONTENT_W = 1440 - 72;

const SIDE = [
  {x: 90, y: 170, from: [-520, -60], rot: -3},
  {x: 90, y: 400, from: [-540, 0], rot: 2},
  {x: 90, y: 630, from: [-520, 60], rot: -2},
  {x: 1590, y: 170, from: [520, -60], rot: 3},
  {x: 1590, y: 400, from: [540, 0], rot: -2},
  {x: 1590, y: 630, from: [520, 60], rot: 2},
];

const Conversation: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const bubble = pop(frame, fps, T.send + 2, 16, 140);
  const dots = frame >= T.send + 6 && frame < T.reply;
  const card = pop(frame, fps, T.image, 16, 110);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS}}>
      <div
        style={{
          position: 'absolute',
          right: 150,
          top: 44,
          padding: '13px 20px',
          borderRadius: '18px 18px 4px 18px',
          background: C.activeNav,
          border: '1px solid rgba(139,108,246,0.35)',
          color: C.text,
          fontSize: 16,
          opacity: tween(frame, [T.send + 2, T.send + 8], [0, 1]),
          transform: `translateY(${(1 - bubble) * 30}px)`,
        }}
      >
        {PROMPT}
      </div>
      <div style={{position: 'absolute', left: 150, top: 118, display: 'flex', gap: 14, opacity: tween(frame, [T.send + 6, T.send + 12], [0, 1])}}>
        <Img src={staticFile('brand/logo.png')} style={{width: 34, height: 34}} />
        <div>
          {dots ? (
            <div style={{display: 'flex', gap: 6, marginTop: 12}}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{width: 8, height: 8, borderRadius: 4, background: '#8B6CF6', opacity: 0.4 + 0.6 * Math.max(0, Math.sin((frame - i * 3) / 3))}} />
              ))}
            </div>
          ) : (
            <div style={{fontSize: 16, color: '#D4D4D8', marginTop: 6, opacity: tween(frame, [T.reply, T.reply + 6], [0, 1])}}>
              Here’s a labelled diagram of the water cycle you can use in class:
            </div>
          )}
          {frame >= T.image ? (
            <div
              style={{
                marginTop: 16,
                width: 720,
                borderRadius: 18,
                overflow: 'hidden',
                border: '1px solid #2A2A2E',
                background: C.panel,
                opacity: tween(frame, [T.image, T.image + 6], [0, 1]),
                transform: `scale(${0.92 + 0.08 * card})`,
                transformOrigin: '0 0',
              }}
            >
              <div style={{width: 720, height: 389, overflow: 'hidden'}}>
                <div style={{transform: 'scale(0.72)', transformOrigin: '0 0'}}>
                  <WaterCycle at={T.image + 2} />
                </div>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 18, padding: '12px 16px', color: '#A1A1AA', fontSize: 14}}>
                <span style={{color: C.text, fontWeight: 500}}>The Water Cycle · Class 6 Science</span>
                <div style={{flex: 1}} />
                <Download size={17} />
                <Copy size={17} />
                <RefreshCw size={17} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export const Scene05Visuals: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cam = camAt(
    frame,
    [
      {f: 0, cam: {look: [BROWSER_W / 2, 690], at: [960, 700], scale: 0.7, rx: 14, opacity: 0}},
      {f: 14, cam: {look: [BROWSER_W / 2, 690], at: [960, 640], scale: 0.98, rx: 5}},
      {f: 56, cam: {look: [BROWSER_W / 2, 690], at: [960, 640], scale: 1.02, rx: 3}},
      {f: 84, cam: {look: [BROWSER_W / 2, 455], at: [960, 520], scale: 0.74, rx: 0}},
      {f: 124, cam: {look: [BROWSER_W / 2, 455], at: [960, 512], scale: 0.75, rx: 0}},
      {f: 150, cam: {look: [BROWSER_W / 2, 455], at: [960, 486], scale: 0.62, rx: 0}},
      {f: 200, cam: {look: [BROWSER_W / 2, 455], at: [960, 486], scale: 0.63, rx: 0}},
    ],
    easeInOut,
  );
  const welcome = tween(frame, [T.send, T.send + 6], [1, 0]);

  return (
    <AbsoluteFill style={{fontFamily: SANS}}>
      <Device cam={cam}>
        <Browser url="aishikshamitra.com/chat">
          <AppShell active="chat" collapsed>
            <div style={{position: 'absolute', left: 18, top: 18, fontSize: 15, color: '#D4D4D8'}}>New chat</div>
            {welcome > 0 ? (
              <div style={{position: 'absolute', left: 0, right: 0, top: 170, display: 'flex', justifyContent: 'center', opacity: welcome}}>
                <ChatWelcome />
              </div>
            ) : null}
            {frame >= T.send ? <Conversation /> : null}
            <div style={{position: 'absolute', left: 0, width: CONTENT_W, bottom: 26, display: 'flex', justifyContent: 'center'}}>
              <Composer text={PROMPT} typeAt={T.type} sendAt={T.send} width={760} />
            </div>
            <div style={{position: 'absolute', right: 30, bottom: 160}}>
              <VoiceFab />
            </div>
          </AppShell>
        </Browser>
      </Device>

      {MINI_DIAGRAMS.map((d, i) => {
        const s = SIDE[i];
        const at = T.side + (i % 3) * 5 + (i >= 3 ? 3 : 0);
        const p = pop(frame, fps, at, 15, 110);
        const float = Math.sin((frame + i * 20) / 22) * 6;
        return (
          <div
            key={d.title}
            style={{
              position: 'absolute',
              left: s.x,
              top: s.y,
              width: 240,
              borderRadius: 18,
              overflow: 'hidden',
              background: C.panel,
              border: `1px solid ${C.line2}`,
              boxShadow: cardShadow,
              opacity: tween(frame, [at, at + 6], [0, 1]),
              transform: `translate(${s.from[0] * (1 - p)}px, ${s.from[1] * (1 - p) + float}px) rotate(${s.rot * p}deg)`,
            }}
          >
            <div style={{height: 146}}>
              <d.Art />
            </div>
            <div style={{padding: '10px 14px', fontSize: 15, fontWeight: 500, color: C.text}}>{d.title}</div>
          </div>
        );
      })}

      <div style={{position: 'absolute', left: 0, right: 0, top: 878, display: 'flex', justifyContent: 'center', gap: 30, fontFamily: SERIF, fontSize: 76, fontWeight: 600, color: C.text}}>
        {['Images', 'Diagrams', 'Visuals'].map((w, i) => {
          const at = T.text + i * 6;
          const p = pop(frame, fps, at, 16, 140);
          return (
            <React.Fragment key={w}>
              {i > 0 ? <span style={{color: C.lavender, opacity: tween(frame, [at - 2, at + 4], [0, 1])}}>·</span> : null}
              <span style={{display: 'inline-block', overflow: 'hidden', paddingBottom: 10}}>
                <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`, fontStyle: i === 2 ? 'italic' : 'normal', color: i === 2 ? C.lavender : C.text}}>{w}</span>
              </span>
            </React.Fragment>
          );
        })}
      </div>

      <Sfx at={0} name="whoosh-soft" volume={0.35} />
      <Sfx at={T.type} name="type" volume={0.35} frames={46} />
      <Sfx at={T.send} name="tap" volume={0.5} />
      <Sfx at={T.send + 2} name="swipe" volume={0.3} />
      <Sfx at={T.image} name="shimmer" volume={0.4} />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} at={T.side + i * 5} name="whoosh-soft" volume={0.22} />
      ))}
      <Sfx at={T.text} name="pop" volume={0.3} />
    </AbsoluteFill>
  );
};
