import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, tween} from '../anim';
import {C, FONT} from '../theme';

const cloud = (cx: number, cy: number, s: number) =>
  `M ${cx - 70 * s} ${cy + 28 * s}
   a ${30 * s} ${30 * s} 0 0 1 ${10 * s} ${-56 * s}
   a ${42 * s} ${42 * s} 0 0 1 ${70 * s} ${-22 * s}
   a ${34 * s} ${34 * s} 0 0 1 ${56 * s} ${30 * s}
   a ${26 * s} ${26 * s} 0 0 1 ${4 * s} ${48 * s} Z`;

const Label: React.FC<{x: number; y: number; at: number; color: string; children: React.ReactNode}> = ({x, y, at, color, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, at, 11, 170);
  if (frame < at) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${p})`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '8px 16px',
        borderRadius: 999,
        background: C.white,
        boxShadow: '0 8px 20px -6px rgba(15,23,42,0.35)',
        fontFamily: FONT,
        fontWeight: 600,
        fontSize: 19,
        color: C.ink,
        whiteSpace: 'nowrap',
      }}
    >
      <div style={{width: 12, height: 12, borderRadius: 6, background: color}} />
      {children}
    </div>
  );
};

/** Animated water-cycle diagram. `at` is the frame at which drawing starts. Size 1000x540. */
export const WaterCycle: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const f = frame - at;
  const show = (d: number, len = 10) => tween(f, [d, d + len], [0, 1]);
  const t = frame / 30;

  const wave = (() => {
    let d = 'M 0 540 L 0 450';
    for (let x = 0; x <= 480; x += 20) d += ` L ${x} ${446 + Math.sin(x / 38 + t * 2.2) * 6}`;
    return `${d} C 505 450 525 462 540 475 L 600 540 Z`;
  })();

  const evapX = [190, 280, 370];
  const evap = (x0: number) => `M ${x0} 418 C ${x0 - 22} 372 ${x0 + 22} 330 ${x0} 290 C ${x0 - 22} 250 ${x0 + 22} 222 ${x0} 196`;
  const river = 'M 838 452 C 770 470 720 452 660 478 S 540 500 470 492';

  return (
    <div style={{position: 'relative', width: 1000, height: 540}}>
      <svg width="1000" height="540" viewBox="0 0 1000 540" style={{display: 'block'}}>
        <defs>
          <linearGradient id="wc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#9ED8FF" />
            <stop offset="1" stopColor="#E7F6FF" />
          </linearGradient>
          <linearGradient id="wc-sea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3B9BF6" />
            <stop offset="1" stopColor="#1E4FD8" />
          </linearGradient>
          <radialGradient id="wc-sun">
            <stop offset="0" stopColor="#FFF3B0" />
            <stop offset="0.6" stopColor="#FFC93C" />
            <stop offset="1" stopColor="#FFA41B" />
          </radialGradient>
          <linearGradient id="wc-rain" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F1F5F9" />
            <stop offset="1" stopColor="#94A3B8" />
          </linearGradient>
        </defs>
        <rect width="1000" height="540" fill="url(#wc-sky)" opacity={show(0, 8)} />

        {/* Sun */}
        <g opacity={show(4)} transform={`translate(120 105) scale(${0.6 + 0.4 * show(4, 14)})`}>
          <g transform={`rotate(${frame * 0.6})`}>
            {new Array(12).fill(0).map((_, i) => (
              <line
                key={i}
                x1="0"
                y1="-68"
                x2="0"
                y2="-90"
                stroke="#FFB020"
                strokeWidth="7"
                strokeLinecap="round"
                transform={`rotate(${i * 30})`}
              />
            ))}
          </g>
          <circle r="54" fill="url(#wc-sun)" />
        </g>

        {/* Mountains */}
        <g opacity={show(10)} transform={`translate(0 ${(1 - show(10, 14)) * 40})`}>
          <path d="M 690 470 L 865 300 L 1000 410 L 1000 470 Z" fill="#4C7A59" />
          <path d="M 560 470 L 770 216 L 980 470 Z" fill="#5E9168" />
          <path d="M 770 216 L 728 267 L 750 260 L 770 280 L 791 258 L 812 267 Z" fill="#FFFFFF" />
          <path d="M 865 300 L 838 326 L 853 322 L 866 334 L 880 321 L 892 325 Z" fill="#FFFFFF" opacity="0.9" />
        </g>

        {/* Land */}
        <path d="M 440 540 C 468 476 520 468 566 466 L 1000 455 L 1000 540 Z" fill="#8CCB7E" opacity={show(8)} />
        {[600, 636, 930, 960].map((x, i) => (
          <g key={x} opacity={show(16 + i * 2)} transform={`translate(${x} ${458 - (i % 2) * 6})`}>
            <rect x="-3" y="0" width="6" height="18" fill="#7C5A3A" />
            <circle cy="-8" r="16" fill={i % 2 ? '#2F9E55' : '#3BB067'} />
          </g>
        ))}

        {/* River (collection) */}
        <path
          d={river}
          fill="none"
          stroke="#5AA8FA"
          strokeWidth="13"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset={1 - show(56, 24)}
        />

        {/* Sea */}
        <path d={wave} fill="url(#wc-sea)" opacity={show(6)} />

        {/* Evaporation */}
        {evapX.map((x, i) => {
          const p = show(28 + i * 4, 18);
          return (
            <g key={x}>
              <path
                d={evap(x)}
                fill="none"
                stroke="#FB923C"
                strokeWidth="6"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset={1 - p}
                opacity={0.95}
              />
              <path d={`M ${x - 13} 206 L ${x} 186 L ${x + 13} 206`} fill="none" stroke="#FB923C" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" opacity={p >= 1 ? 1 : 0} />
            </g>
          );
        })}

        {/* Clouds */}
        <g opacity={show(36)} transform={`translate(${(1 - show(36, 16)) * -60} 0)`}>
          <path d={cloud(500, 128, 1)} fill="#FFFFFF" />
        </g>
        <g opacity={show(42)} transform={`translate(${(1 - show(42, 16)) * 60} 0)`}>
          <path d={cloud(790, 112, 1.25)} fill="url(#wc-rain)" />
        </g>

        {/* Condensation arrow */}
        <path
          d="M 395 170 Q 425 140 452 136"
          fill="none"
          stroke="#94A3B8"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray="10 10"
          opacity={show(48)}
        />

        {/* Rain */}
        {f > 48
          ? new Array(14).fill(0).map((_, i) => {
              const x = 712 + (i % 7) * 26 + (i > 6 ? 13 : 0);
              const y = 156 + (((frame - at) * 9 + i * 41) % 150);
              return <line key={i} x1={x} y1={y} x2={x - 5} y2={y + 18} stroke="#3B82F6" strokeWidth="4" strokeLinecap="round" opacity={show(48)} />;
            })
          : null}
      </svg>
      <Label x={290} y={322} at={at + 40} color="#FB923C">
        Evaporation
      </Label>
      <Label x={505} y={208} at={at + 52} color="#94A3B8">
        Condensation
      </Label>
      <Label x={905} y={238} at={at + 60} color="#3B82F6">
        Precipitation
      </Label>
      <Label x={660} y={512} at={at + 74} color="#22C55E">
        Collection
      </Label>
    </div>
  );
};
