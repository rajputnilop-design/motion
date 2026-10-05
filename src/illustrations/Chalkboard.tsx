import {ArrowRight} from 'lucide-react';
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, tween} from '../anim';
import {SANS as FONT} from '../theme';

export const PLAYER_W = 1000;
export const PLAYER_H = 562;

/** Element that flies from (fromX, fromY) — in player coordinates — to its final place. */
const Fly: React.FC<{at: number; from: [number, number]; children: React.ReactNode; style?: React.CSSProperties}> = ({at, from, children, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, at, 15, 110);
  if (frame < at) return null;
  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(${from[0] * (1 - p)}px, ${from[1] * (1 - p)}px) scale(${0.4 + 0.6 * p})`,
        opacity: tween(frame, [at, at + 5], [0, 1]),
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const chalk = (color: string): React.CSSProperties => ({
  fontFamily: FONT,
  fontWeight: 600,
  color,
  textShadow: `0 0 1px ${color}, 0 0 8px rgba(255,255,255,0.15)`,
});

/** Classroom-style explainer frame that assembles itself. `at` = start frame; `from` = offset of the source node. */
export const ChalkboardLesson: React.FC<{at: number; from: [number, number]}> = ({at, from}) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame / 14) * 2;
  const rays = tween(frame, [at + 28, at + 40], [0, 1]);
  return (
    <div
      style={{
        position: 'relative',
        width: PLAYER_W,
        height: PLAYER_H,
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 40%, #24533F 0%, #1A4031 60%, #12301F 100%)',
        opacity: tween(frame, [at, at + 8], [0, 1]),
      }}
    >
      <div style={{position: 'absolute', inset: 0, boxShadow: 'inset 0 0 0 14px #8B5A2B, inset 0 0 0 18px #6B4220', borderRadius: 4}} />
      <div style={{position: 'absolute', left: 40, top: 34, fontSize: 46, letterSpacing: '0.02em', ...chalk('#F8FAF5'), opacity: tween(frame, [at + 6, at + 14], [0, 1])}}>
        Photosynthesis
      </div>
      <div style={{position: 'absolute', left: 42, top: 100, width: 300, height: 4, borderRadius: 2, background: 'rgba(253,230,138,0.85)', transform: `scaleX(${tween(frame, [at + 10, at + 20], [0, 1])})`, transformOrigin: 'left'}} />

      {/* Sun */}
      <Fly at={at + 12} from={from} style={{left: 640, top: 34}}>
        <svg width="140" height="140" viewBox="-70 -70 140 140">
          <g transform={`rotate(${frame * 0.8})`}>
            {new Array(10).fill(0).map((_, i) => (
              <line key={i} x1="0" y1="-48" x2="0" y2="-64" stroke="#FDE68A" strokeWidth="6" strokeLinecap="round" transform={`rotate(${i * 36})`} />
            ))}
          </g>
          <circle r="38" fill="#FCD34D" />
        </svg>
      </Fly>

      {/* Sunlight rays */}
      <svg width={PLAYER_W} height={PLAYER_H} style={{position: 'absolute', inset: 0}}>
        {[
          [672, 128, 556, 196],
          [690, 150, 572, 238],
          [712, 160, 618, 250],
        ].map(([x1, y1, x2, y2], i) => (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#FDE68A"
            strokeWidth="5"
            strokeDasharray="12 10"
            strokeLinecap="round"
            opacity={rays}
            strokeDashoffset={-frame * 2}
          />
        ))}
      </svg>

      {/* Plant */}
      <Fly at={at + 18} from={from} style={{left: 420, top: 140}}>
        <svg width="187" height="255" viewBox="0 0 220 300">
          <g transform={`rotate(${sway} 110 230)`}>
            <path d="M 110 230 C 108 180 112 130 110 80" stroke="#4ADE80" strokeWidth="8" fill="none" strokeLinecap="round" />
            <path d="M 110 150 C 70 140 40 110 36 80 C 76 84 104 112 110 150 Z" fill="#4ADE80" />
            <path d="M 110 120 C 150 110 180 80 186 50 C 146 54 116 82 110 120 Z" fill="#22C55E" />
            <path d="M 110 190 C 150 186 178 160 186 132 C 146 134 118 160 110 190 Z" fill="#4ADE80" />
            <path d="M 110 84 C 96 60 98 36 112 18 C 124 40 122 64 110 84 Z" fill="#86EFAC" />
          </g>
          <path d="M 64 226 L 156 226 L 146 296 L 74 296 Z" fill="#E07A4F" />
          <rect x="56" y="216" width="108" height="18" rx="5" fill="#C2410C" />
        </svg>
      </Fly>

      {/* CO2 in */}
      <Fly at={at + 30} from={from} style={{left: 196, top: 252}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 30, ...chalk('#E2E8F0')}}>
          <span>
            CO<sub style={{fontSize: 18}}>2</sub>
          </span>
          <svg width="150" height="20">
            <line x1="0" y1="10" x2="136" y2="10" stroke="#E2E8F0" strokeWidth="4" strokeDasharray="10 8" />
            <path d="M 132 2 L 146 10 L 132 18" fill="none" stroke="#E2E8F0" strokeWidth="4" />
          </svg>
        </div>
      </Fly>

      {/* O2 out */}
      <Fly at={at + 36} from={from} style={{left: 606, top: 300}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 30, ...chalk('#93C5FD')}}>
          <svg width="150" height="20">
            <line x1="0" y1="10" x2="136" y2="10" stroke="#93C5FD" strokeWidth="4" strokeDasharray="10 8" />
            <path d="M 132 2 L 146 10 L 132 18" fill="none" stroke="#93C5FD" strokeWidth="4" />
          </svg>
          <span>
            O<sub style={{fontSize: 18}}>2</sub>
          </span>
        </div>
      </Fly>

      {/* Water */}
      <Fly at={at + 42} from={from} style={{left: 200, top: 330}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, fontSize: 30, ...chalk('#7DD3FC')}}>
          <span>
            H<sub style={{fontSize: 18}}>2</sub>O
          </span>
          <svg width="120" height="40">
            <path d="M 0 30 C 40 30 70 24 104 12" fill="none" stroke="#7DD3FC" strokeWidth="4" strokeDasharray="10 8" />
            <path d="M 94 6 L 110 10 L 100 22" fill="none" stroke="#7DD3FC" strokeWidth="4" />
          </svg>
        </div>
      </Fly>

      {/* Word equation */}
      <Fly at={at + 50} from={from} style={{left: 40, top: 126}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 4, fontSize: 22, ...chalk('#FDE68A')}}>
          <span>carbon dioxide + water</span>
          <span style={{display: 'flex', alignItems: 'center', gap: 8, color: '#F9A8D4'}}>
            <ArrowRight size={22} /> glucose + oxygen
          </span>
        </div>
      </Fly>
    </div>
  );
};
