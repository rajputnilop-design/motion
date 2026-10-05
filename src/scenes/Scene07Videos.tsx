import {BookOpen, Captions, Clapperboard, Droplets, Film, Leaf, Lightbulb, Maximize2, Music, Palette, Pause, Play, ScrollText, Sun, Volume2, Brain} from 'lucide-react';
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {caretVisible, easeInOut, pop, tween, typed} from '../anim';
import {SceneTitle, Sfx} from '../components/ui';
import {ChalkboardLesson, PLAYER_H, PLAYER_W} from '../illustrations/Chalkboard';
import {C, cardShadow, SANS as FONT, SERIF} from '../theme';

const NODE_AT = [16, 38, 60, 82];
const PLAYER_AT = 92;
const PLAY_AT = 160;
const CHIPS_AT = 150;

const NODE_W = 330;
const NODE_GAP = 80;
const NODES_LEFT = (1920 - (NODE_W * 4 + NODE_GAP * 3)) / 2;
const NODE_TOP = 196;
const nodeX = (i: number) => NODES_LEFT + i * (NODE_W + NODE_GAP);

const PLAYER_LEFT = (1920 - PLAYER_W) / 2;
const PLAYER_TOP = 372;

const NODES = [
  {label: 'Topic', Icon: Lightbulb, color: '#F59E0B'},
  {label: 'Script', Icon: ScrollText, color: '#5B5BF7'},
  {label: 'Visuals', Icon: Palette, color: '#E43F8F'},
  {label: 'Video', Icon: Clapperboard, color: '#F43F5E'},
];

const NodeBody: React.FC<{i: number; at: number}> = ({i, at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (i === 0) {
    const txt = typed('Photosynthesis', frame, at + 2, 1);
    return (
      <span style={{fontSize: 21, fontWeight: 600, color: C.text}}>
        {txt}
        {frame < at + 20 && caretVisible(frame) ? <span style={{color: '#8B6CF6'}}>|</span> : null}
      </span>
    );
  }
  if (i === 1) {
    const txt = typed('Scene 1: How do plants make food?', frame, at + 2, 2);
    return <span style={{fontSize: 15, fontWeight: 500, color: C.text2, lineHeight: 1.35}}>{txt}</span>;
  }
  if (i === 2) {
    return (
      <div style={{display: 'flex', gap: 8}}>
        {[
          {I: Leaf, c: '#4ADE80', b: 'rgba(74,222,128,0.14)'},
          {I: Sun, c: '#FBBF24', b: 'rgba(251,191,36,0.14)'},
          {I: Droplets, c: '#38BDF8', b: 'rgba(56,189,248,0.14)'},
        ].map(({I, c, b}, k) => (
          <div
            key={k}
            style={{
              width: 44,
              height: 36,
              borderRadius: 9,
              background: b,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `scale(${pop(frame, fps, at + 2 + k * 3, 12, 160)})`,
            }}
          >
            <I size={20} color={c} />
          </div>
        ))}
      </div>
    );
  }
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, fontWeight: 600, color: C.text}}>
      <div style={{width: 28, height: 28, borderRadius: 14, background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Play size={14} color={C.white} fill={C.white} />
      </div>
      1:30 · HD
    </div>
  );
};

const Node: React.FC<{i: number}> = ({i}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = NODE_AT[i];
  const p = pop(frame, fps, at, 14, 140);
  const active = frame >= at;
  const node = NODES[i];
  return (
    <div
      style={{
        position: 'absolute',
        left: nodeX(i),
        top: NODE_TOP,
        width: NODE_W,
        height: 124,
        borderRadius: 24,
        background: active ? 'rgba(22,22,23,0.92)' : 'rgba(255,255,255,0.03)',
        border: active ? '1px solid rgba(139,108,246,0.45)' : '1.5px dashed rgba(255,255,255,0.16)',
        boxShadow: active ? `${cardShadow}, 0 0 ${40 * (1 - tween(frame, [at, at + 20], [0, 1]))}px ${node.color}` : 'none',
        transform: `scale(${active ? 0.85 + 0.15 * p : 0.92})`,
        opacity: tween(frame, [0, 10], [0, 1]),
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        padding: '0 20px',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          minWidth: 64,
          borderRadius: 18,
          background: active ? `${node.color}26` : 'rgba(255,255,255,0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <node.Icon size={32} color={active ? node.color : 'rgba(255,255,255,0.5)'} />
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 4, minWidth: 0}}>
        <span style={{fontSize: 13, fontWeight: 600, letterSpacing: '0.16em', color: active ? C.purpleLight : 'rgba(255,255,255,0.45)'}}>
          {`0${i + 1} · ${node.label.toUpperCase()}`}
        </span>
        {active ? <NodeBody i={i} at={at} /> : <span style={{fontSize: 21, fontWeight: 600, color: 'rgba(255,255,255,0.5)'}}>{node.label}</span>}
      </div>
    </div>
  );
};

const Connector: React.FC<{i: number}> = ({i}) => {
  const frame = useCurrentFrame();
  const start = NODE_AT[i] + 8;
  const end = NODE_AT[i + 1];
  const p = tween(frame, [start, end], [0, 1], easeInOut);
  const x0 = nodeX(i) + NODE_W + 8;
  const w = NODE_GAP - 16;
  return (
    <div style={{position: 'absolute', left: x0, top: NODE_TOP + 60, width: w, height: 4}}>
      <div style={{position: 'absolute', inset: 0, borderRadius: 2, background: 'rgba(255,255,255,0.15)'}} />
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${p * 100}%`, borderRadius: 2, background: 'linear-gradient(90deg, #7450EF, #00D2E6)'}} />
      {p > 0 && p < 1 ? (
        <div style={{position: 'absolute', left: p * w - 7, top: -5, width: 14, height: 14, borderRadius: 7, background: '#A3E9FF', boxShadow: '0 0 16px #00D2E6'}} />
      ) : null}
      <svg width="16" height="20" style={{position: 'absolute', right: -10, top: -8, opacity: p >= 1 ? 1 : 0}}>
        <path d="M 2 2 L 12 10 L 2 18" fill="none" stroke={C.cyan} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const Player: React.FC = () => {
  const frame = useCurrentFrame();
  const playing = frame >= PLAY_AT;
  const progress = 0.06 + tween(frame, [PLAY_AT, PLAY_AT + 120], [0, 0.4], (t) => t);
  const seconds = Math.round(progress * 90);
  const bigPlay = tween(frame, [PLAYER_AT + 50, PLAYER_AT + 58], [0, 1]) * tween(frame, [PLAY_AT, PLAY_AT + 8], [1, 0]);
  const visualsCenter: [number, number] = [nodeX(2) + NODE_W / 2 - PLAYER_LEFT - PLAYER_W / 2, NODE_TOP + 62 - PLAYER_TOP - PLAYER_H / 2];
  return (
    <div style={{position: 'relative', width: PLAYER_W, height: PLAYER_H, borderRadius: 26, overflow: 'hidden', background: '#05070F', boxShadow: cardShadow}}>
      <ChalkboardLesson at={PLAYER_AT + 4} from={visualsCenter} />
      <div
        style={{
          position: 'absolute',
          right: 28,
          top: 26,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px 6px 8px',
          borderRadius: 999,
          background: 'rgba(0,0,0,0.35)',
          fontFamily: SERIF,
          fontSize: 15,
          color: 'rgba(255,255,255,0.85)',
          opacity: tween(frame, [PLAYER_AT + 10, PLAYER_AT + 20], [0, 1]),
        }}
      >
        <Img src={staticFile('brand/logo.png')} style={{width: 22, height: 22}} />
        AIShikshaMitra
      </div>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          bottom: 92,
          transform: 'translateX(-50%)',
          padding: '8px 20px',
          borderRadius: 10,
          background: 'rgba(0,0,0,0.6)',
          color: C.white,
          fontFamily: FONT,
          fontSize: 24,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          opacity: tween(frame, [PLAYER_AT + 56, PLAYER_AT + 64], [0, 1]),
        }}
      >
        Plants use sunlight to make their own food.
      </div>
      {bigPlay > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: PLAYER_W / 2 - 50,
            top: PLAYER_H / 2 - 70,
            width: 100,
            height: 100,
            borderRadius: 50,
            background: 'rgba(255,255,255,0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: bigPlay,
            transform: `scale(${0.8 + 0.2 * bigPlay + 0.05 * Math.sin(frame / 3)})`,
          }}
        >
          <Play size={46} color={C.purple} fill={C.purple} style={{marginLeft: 6}} />
        </div>
      ) : null}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 76,
          background: 'linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0))',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '14px 26px 0',
          color: C.white,
          fontFamily: FONT,
          fontSize: 17,
          fontWeight: 600,
          opacity: tween(frame, [PLAYER_AT + 6, PLAYER_AT + 14], [0, 1]),
        }}
      >
        {playing ? <Pause size={24} fill={C.white} /> : <Play size={24} fill={C.white} />}
        <span style={{minWidth: 100}}>
          0:{seconds.toString().padStart(2, '0')} / 1:30
        </span>
        <div style={{flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.25)', position: 'relative'}}>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress * 100}%`, borderRadius: 3, background: 'linear-gradient(90deg, #7450EF, #A3A6F9)'}} />
          <div style={{position: 'absolute', left: `calc(${progress * 100}% - 8px)`, top: -5, width: 16, height: 16, borderRadius: 8, background: C.white}} />
        </div>
        <Captions size={24} />
        <Volume2 size={24} />
        <Maximize2 size={22} />
      </div>
    </div>
  );
};

const CHIPS = [
  {label: 'Explainer Videos', Icon: Film, color: '#F43F5E', side: 'left', y: 470},
  {label: 'Animated Stories', Icon: BookOpen, color: '#F59E0B', side: 'left', y: 640},
  {label: 'Learning Content', Icon: Brain, color: '#5B5BF7', side: 'right', y: 470},
  {label: 'Rhymes & Songs', Icon: Music, color: '#8B5CF6', side: 'right', y: 640},
];

export const Scene07Videos: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const player = pop(frame, fps, PLAYER_AT, 16, 100);
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 62, display: 'flex', justifyContent: 'center'}}>
        <SceneTitle text="AI-Powered Video Creation" at={4} size={80} italicIdx={[0]} style={{justifyContent: 'center'}} />
      </div>
      {NODES.map((_, i) => (
        <Node key={i} i={i} />
      ))}
      {[0, 1, 2].map((i) => (
        <Connector key={i} i={i} />
      ))}

      <div
        style={{
          position: 'absolute',
          left: PLAYER_LEFT,
          top: PLAYER_TOP,
          opacity: tween(frame, [PLAYER_AT, PLAYER_AT + 6], [0, 1]),
          transform: `translateY(${(1 - player) * 120}px) scale(${0.8 + 0.2 * player})`,
        }}
      >
        <Player />
      </div>

      {CHIPS.map((chip, i) => {
        const at = CHIPS_AT + i * 4;
        const p = pop(frame, fps, at, 14, 150);
        const left = chip.side === 'left' ? 90 : 1500;
        return (
          <div
            key={chip.label}
            style={{
              position: 'absolute',
              left,
              top: chip.y + Math.sin((frame + i * 25) / 20) * 5,
              width: 330,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '16px 20px',
              borderRadius: 20,
              background: 'rgba(22,22,23,0.85)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: C.white,
              fontSize: 23,
              fontWeight: 600,
              opacity: tween(frame, [at, at + 6], [0, 1]),
              transform: `translateX(${(1 - p) * (chip.side === 'left' ? -80 : 80)}px)`,
            }}
          >
            <div style={{width: 48, height: 48, minWidth: 48, borderRadius: 14, background: chip.color, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <chip.Icon size={26} color={C.white} />
            </div>
            {chip.label}
          </div>
        );
      })}

      {NODE_AT.map((n) => (
        <Sfx key={n} at={n} name="pop" volume={0.32} />
      ))}
      <Sfx at={NODE_AT[0] + 2} name="type" volume={0.25} frames={14} />
      <Sfx at={PLAYER_AT} name="whoosh" volume={0.45} />
      {[16, 22, 34, 40, 46, 54].map((d) => (
        <Sfx key={d} at={PLAYER_AT + 4 + d} name="pop-high" volume={0.16} />
      ))}
      <Sfx at={PLAY_AT} name="tap" volume={0.5} />
      {CHIPS.map((_, i) => (
        <Sfx key={i} at={CHIPS_AT + i * 4} name="whoosh-soft" volume={0.18} />
      ))}
    </AbsoluteFill>
  );
};
