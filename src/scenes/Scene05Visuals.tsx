import {ArrowUp, Download, ImageIcon, Sparkles} from 'lucide-react';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {caretVisible, easeInOut, pop, tween, typed} from '../anim';
import {Sfx, Tap} from '../components/ui';
import {MINI_DIAGRAMS} from '../illustrations/MiniDiagrams';
import {WaterCycle} from '../illustrations/WaterCycle';
import {brandGradient, C, cardShadow, FONT} from '../theme';

const PROMPT = 'Create a diagram explaining the water cycle.';
const T = {type: 12, send: 60, morph: 62, card: 66, art: 72, side: 120, text: 134};

const SIDE_SLOTS = [
  {x: 110, y: 176, from: [-500, -80], rot: -4},
  {x: 110, y: 398, from: [-520, 0], rot: 3},
  {x: 110, y: 620, from: [-500, 80], rot: -2},
  {x: 1570, y: 176, from: [500, -80], rot: 4},
  {x: 1570, y: 398, from: [520, 0], rot: -3},
  {x: 1570, y: 620, from: [500, 80], rot: 2},
];

export const Scene05Visuals: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  const enter = pop(frame, fps, 0, 16, 110);
  const morph = tween(frame, [T.morph, T.morph + 16], [0, 1], easeInOut);
  const barY = 470 - (470 - 52) * morph;
  const barScale = (0.92 + 0.08 * enter) * (1 - 0.3 * morph);
  const shown = typed(PROMPT, frame, T.type, 1);
  const typing = frame >= T.type - 6 && frame < T.morph;
  const card = pop(frame, fps, T.card, 18, 100);
  const sendPress = frame >= T.send - 2 && frame <= T.send + 3 ? 0.88 : 1;

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      {/* Prompt bar */}
      <div
        style={{
          position: 'absolute',
          left: 960 - 560,
          top: barY,
          width: 1120,
          height: 112,
          transform: `scale(${barScale})`,
          transformOrigin: '50% 0%',
          opacity: tween(frame, [0, 8], [0, 1]),
          borderRadius: 32,
          background: C.white,
          boxShadow: `${cardShadow}, 0 0 ${60 * tween(frame, [T.send, T.send + 8], [0, 1]) * (1 - morph)}px rgba(139,92,246,0.8)`,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
          padding: '0 22px 0 26px',
          zIndex: 3,
        }}
      >
        <div style={{width: 64, height: 64, minWidth: 64, borderRadius: 20, background: brandGradient, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Sparkles size={34} color="#FFE2B3" />
        </div>
        <div style={{flex: 1, fontSize: 36, fontWeight: 500, color: shown ? C.ink : C.slate400, whiteSpace: 'nowrap', overflow: 'hidden'}}>
          {shown || 'Describe the visual you need…'}
          {typing && caretVisible(frame) ? <span style={{color: C.indigo, fontWeight: 300}}>|</span> : null}
        </div>
        <div
          style={{
            width: 72,
            height: 72,
            minWidth: 72,
            borderRadius: 36,
            background: shown.length === PROMPT.length ? 'linear-gradient(135deg, #FFC46B, #FF6B3D)' : C.slate200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${sendPress})`,
          }}
        >
          <ArrowUp size={36} color={C.white} strokeWidth={3} />
        </div>
        <Tap x={1120 - 58} y={56} at={T.send} />
      </div>

      {/* Generated diagram card */}
      <div
        style={{
          position: 'absolute',
          left: 460,
          top: 168,
          width: 1000,
          borderRadius: 30,
          overflow: 'hidden',
          background: C.white,
          boxShadow: cardShadow,
          opacity: tween(frame, [T.card, T.card + 6], [0, 1]),
          transform: `translateY(${(1 - card) * -80}px) scale(${0.7 + 0.3 * card})`,
          transformOrigin: '50% 0%',
          zIndex: 2,
        }}
      >
        <div style={{height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{width: 40, height: 40, borderRadius: 12, background: '#FDE8F2', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <ImageIcon size={22} color="#E43F8F" />
            </div>
            <span style={{fontSize: 26, fontWeight: 700, color: C.ink}}>The Water Cycle</span>
            <span style={{fontSize: 15, fontWeight: 600, color: C.indigo, background: '#EEEEFE', padding: '4px 12px', borderRadius: 999}}>Class 6 · Science</span>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 16, fontWeight: 600, color: C.slate600}}>
            <Download size={20} /> HD · PNG
          </div>
        </div>
        <WaterCycle at={T.art} />
      </div>

      {/* Surrounding diagrams */}
      {MINI_DIAGRAMS.map((d, i) => {
        const slot = SIDE_SLOTS[i];
        const at = T.side + (i % 3) * 5 + (i >= 3 ? 3 : 0);
        const p = pop(frame, fps, at, 15, 110);
        const float = Math.sin((frame + i * 20) / 22) * 6;
        return (
          <div
            key={d.title}
            style={{
              position: 'absolute',
              left: slot.x,
              top: slot.y,
              width: 240,
              borderRadius: 20,
              overflow: 'hidden',
              background: C.white,
              boxShadow: cardShadow,
              opacity: tween(frame, [at, at + 6], [0, 1]),
              transform: `translate(${slot.from[0] * (1 - p)}px, ${slot.from[1] * (1 - p) + float}px) rotate(${slot.rot * p}deg)`,
            }}
          >
            <div style={{height: 146}}>
              <d.Art />
            </div>
            <div style={{padding: '9px 14px', fontSize: 16, fontWeight: 600, color: C.ink}}>{d.title}</div>
          </div>
        );
      })}

      {/* On-screen text */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 870, display: 'flex', justifyContent: 'center', gap: 34, fontSize: 70, fontWeight: 800, color: C.white, letterSpacing: '-0.02em'}}>
        {['Images', 'Diagrams', 'Visuals'].map((w, i) => {
          const at = T.text + i * 6;
          const p = pop(frame, fps, at, 16, 140);
          return (
            <React.Fragment key={w}>
              {i > 0 ? (
                <span style={{color: C.saffron, opacity: tween(frame, [at - 2, at + 4], [0, 1]), transform: `scale(${p})`, display: 'inline-block'}}>•</span>
              ) : null}
              <span style={{display: 'inline-block', overflow: 'hidden'}}>
                <span style={{display: 'inline-block', transform: `translateY(${(1 - p) * 110}%)`}}>{w}</span>
              </span>
            </React.Fragment>
          );
        })}
      </div>

      <Sfx at={T.type} name="type" volume={0.35} frames={46} />
      <Sfx at={T.send} name="tap" volume={0.5} />
      <Sfx at={T.morph} name="whoosh" volume={0.45} />
      <Sfx at={T.card + 4} name="shimmer" volume={0.4} />
      {[0, 1, 2].map((i) => (
        <Sfx key={i} at={T.side + i * 5} name="whoosh-soft" volume={0.25} />
      ))}
      <Sfx at={T.text} name="pop" volume={0.3} />
    </AbsoluteFill>
  );
};
