import {Bell, House, Library, Mic, Plus, Sparkles, User} from 'lucide-react';
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, tween} from '../anim';
import {brandGradient, C, FONT} from '../theme';
import {TOOLS} from '../tools';
import {AppHeader} from './ui';

/** Geometry of the tool grid inside a 400px-wide phone, used to fly icons into their slots. */
export const GRID = {
  top: 256,
  left: 20,
  cellW: 162,
  cellH: 92,
  gap: 10,
};

export const gridSlot = (i: number) => ({
  x: GRID.left + (i % 2) * (GRID.cellW + GRID.gap),
  y: GRID.top + Math.floor(i / 2) * (GRID.cellH + GRID.gap),
});

export const ToolTile: React.FC<{index: number; style?: React.CSSProperties}> = ({index, style}) => {
  const tool = TOOLS[index];
  return (
    <div
      style={{
        width: GRID.cellW,
        height: GRID.cellH,
        borderRadius: 20,
        background: C.white,
        boxShadow: '0 6px 16px -6px rgba(15, 23, 42, 0.18)',
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: FONT,
        ...style,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          background: tool.tint,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <tool.Icon size={22} color={tool.color} strokeWidth={2.2} />
      </div>
      <div style={{fontWeight: 600, fontSize: 15, color: C.ink}}>{tool.label}</div>
    </div>
  );
};

type HomeProps = {
  /** Frame (relative to the parent) at which the content starts animating in. */
  at: number;
  /** Render tiles? Scene 8 flies its own tiles in, so it hides the built-in ones. */
  showTiles?: boolean;
  /** Per-tile visibility override (0..1) used by scene 8. */
  tileProgress?: (i: number) => number;
};

export const HomeScreen: React.FC<HomeProps> = ({at, showTiles = true, tileProgress}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = (d: number) => {
    const p = pop(frame, fps, at + d, 18, 120);
    return {opacity: tween(frame, [at + d, at + d + 8], [0, 1]), transform: `translateY(${(1 - p) * 24}px)`};
  };
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: FONT}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 20, ...enter(0)}}>
        <AppHeader />
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            background: C.white,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(15,23,42,0.08)',
          }}
        >
          <Bell size={20} color={C.slate600} />
        </div>
      </div>
      <div style={{padding: '14px 22px 0', ...enter(4)}}>
        <div style={{fontWeight: 700, fontSize: 25, color: C.ink, letterSpacing: '-0.01em'}}>Namaste, Teacher!</div>
        <div style={{fontWeight: 500, fontSize: 15, color: C.slate500, marginTop: 2}}>What would you like to create today?</div>
      </div>
      <div
        style={{
          margin: '16px 20px 0',
          height: 54,
          borderRadius: 18,
          background: C.white,
          border: '1.5px solid #E3E6F0',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '0 16px',
          ...enter(8),
        }}
      >
        <Sparkles size={20} color={C.violet} />
        <span style={{flex: 1, fontSize: 15, color: C.slate400, fontWeight: 500}}>Ask AIShikshaMitra…</span>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            background: brandGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Mic size={18} color={C.white} />
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 22,
          top: GRID.top - 30,
          fontWeight: 600,
          fontSize: 15,
          color: C.slate600,
          ...enter(10),
        }}
      >
        Create with AI
      </div>
      {TOOLS.map((_, i) => {
        const slot = gridSlot(i);
        if (!showTiles) {
          const p = tileProgress ? tileProgress(i) : 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: slot.x,
                top: slot.y,
                width: GRID.cellW,
                height: GRID.cellH,
                borderRadius: 20,
                border: '2px dashed #D5D9E6',
                opacity: 1 - p,
              }}
            />
          );
        }
        const p = pop(frame, fps, at + 12 + i * 3, 13, 150);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: slot.x,
              top: slot.y,
              opacity: tween(frame, [at + 12 + i * 3, at + 18 + i * 3], [0, 1]),
              transform: `scale(${0.6 + 0.4 * p})`,
            }}
          >
            <ToolTile index={i} />
          </div>
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: gridSlot(7).x,
          top: gridSlot(7).y,
          width: GRID.cellW,
          height: GRID.cellH,
          borderRadius: 20,
          background: brandGradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          color: C.white,
          fontWeight: 600,
          fontSize: 15,
          ...enter(34),
        }}
      >
        <Plus size={20} /> More tools
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 78,
          background: C.white,
          borderTop: '1px solid #ECEEF4',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          paddingBottom: 10,
          ...enter(14),
        }}
      >
        {[House, Library, User].map((Icon, i) => (
          <Icon key={i} size={24} color={i === 0 ? C.indigo : C.slate400} strokeWidth={2.2} />
        ))}
      </div>
    </div>
  );
};
