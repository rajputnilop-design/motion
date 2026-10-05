import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, easeOut, pop, tween} from '../anim';
import {GRID, gridSlot, HomeScreen, ToolTile} from '../components/HomeScreen';
import {Phone, PHONE_RATIO} from '../components/Phone';
import {MaskWords, Sfx} from '../components/ui';
import {C, FONT, gradientText, saffronGradient} from '../theme';
import {TOOLS} from '../tools';

const PHONE_SCALE = 0.9;
const PX = 960 - (400 * PHONE_SCALE) / 2;
const PY = 205;
const CENTER = {x: 960, y: PY + (400 * PHONE_RATIO * PHONE_SCALE) / 2};
const ORBIT = {rx: 700, ry: 300};
const OMEGA = 0.022;
const MERGE_AT = 104;
const MERGE_STAGGER = 5;
const MERGE_LEN = 18;
const ORBIT_SCALE = 1.35;

const slotCenter = (i: number) => {
  const s = gridSlot(i);
  return {
    x: PX + (12 + s.x + GRID.cellW / 2) * PHONE_SCALE,
    y: PY + (12 + 50 + s.y + GRID.cellH / 2) * PHONE_SCALE,
  };
};

export const Scene08All: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const phoneIn = pop(frame, fps, 0, 16, 110);
  const spread = tween(frame, [2, 36], [0, 1], easeOut);
  const allMerged = MERGE_AT + MERGE_STAGGER * (TOOLS.length - 1) + MERGE_LEN;
  const glow = tween(frame, [allMerged - 4, allMerged + 6], [0, 1]) * tween(frame, [allMerged + 6, allMerged + 40], [1, 0.4]);
  const ringOpacity = tween(frame, [6, 30], [0, 1]) * tween(frame, [MERGE_AT, MERGE_AT + 30], [1, 0]);

  const landed = (i: number) => tween(frame, [MERGE_AT + i * MERGE_STAGGER + MERGE_LEN - 2, MERGE_AT + i * MERGE_STAGGER + MERGE_LEN], [0, 1]);

  const tiles = TOOLS.map((tool, i) => {
    const theta = (i / TOOLS.length) * Math.PI * 2 + frame * OMEGA + (1 - spread) * Math.PI * 1.2 - Math.PI / 2;
    const ox = CENTER.x + Math.cos(theta) * ORBIT.rx * spread;
    const oy = CENTER.y + Math.sin(theta) * ORBIT.ry * spread;
    const depth = Math.sin(theta);
    const orbitScale = ORBIT_SCALE * (0.82 + 0.18 * (depth + 1) / 2) * (0.3 + 0.7 * spread);
    const m = tween(frame, [MERGE_AT + i * MERGE_STAGGER, MERGE_AT + i * MERGE_STAGGER + MERGE_LEN], [0, 1], easeInOut);
    const target = slotCenter(i);
    const x = ox + (target.x - ox) * m;
    const y = oy + (target.y - oy) * m;
    const scale = orbitScale + (PHONE_SCALE - orbitScale) * m;
    const front = depth > -0.15 || m > 0;
    const opacity = (0.55 + 0.45 * (depth + 1) / 2) * (1 - m) + m;
    return {tool, i, x, y, scale, front, opacity, rot: (1 - m) * Math.cos(theta) * 6};
  });

  const renderTile = (t: (typeof tiles)[number]) => (
    <div
      key={t.tool.key}
      style={{
        position: 'absolute',
        left: t.x,
        top: t.y,
        width: 0,
        height: 0,
        opacity: t.opacity * tween(frame, [2, 10], [0, 1]),
      }}
    >
      <div style={{transform: `translate(-50%, -50%) scale(${t.scale}) rotate(${t.rot}deg)`, width: GRID.cellW, height: GRID.cellH}}>
        <ToolTile index={t.i} style={{boxShadow: '0 20px 40px -12px rgba(2,6,23,0.6)'}} />
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 58, display: 'flex', justifyContent: 'center'}}>
        <MaskWords
          text="Everything in one place"
          at={8}
          style={{fontSize: 76, fontWeight: 800, color: C.white, letterSpacing: '-0.03em'}}
          wordStyle={(i) => (i >= 2 ? gradientText(saffronGradient) : {})}
        />
      </div>

      <AbsoluteFill style={{transform: `scale(${1 + 0.05 * tween(frame, [130, 210], [0, 1], easeInOut)})`, transformOrigin: `${CENTER.x}px ${CENTER.y}px`}}>
      {/* Orbit path */}
      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: ringOpacity}}>
        <ellipse cx={CENTER.x} cy={CENTER.y} rx={ORBIT.rx * spread} ry={ORBIT.ry * spread} fill="none" stroke="rgba(165,180,252,0.35)" strokeWidth="2" strokeDasharray="4 12" />
        <ellipse cx={CENTER.x} cy={CENTER.y} rx={ORBIT.rx * spread * 0.62} ry={ORBIT.ry * spread * 0.62} fill="none" stroke="rgba(255,182,92,0.18)" strokeWidth="2" />
      </svg>

      {tiles.filter((t) => !t.front).map(renderTile)}

      {/* Phone */}
      <div
        style={{
          position: 'absolute',
          left: CENTER.x - 450,
          top: CENTER.y - 450,
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(91,91,247,0.18) 35%, transparent 65%)',
          opacity: 0.5 + glow * 0.5,
          transform: `scale(${0.9 + glow * 0.2})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: PX,
          top: PY,
          transform: `translateY(${(1 - phoneIn) * 500}px) scale(${PHONE_SCALE})`,
          transformOrigin: '0 0',
          opacity: tween(frame, [0, 6], [0, 1]),
        }}
      >
        <Phone width={400}>
          <HomeScreen at={-40} showTiles={false} tileProgress={landed} />
        </Phone>
      </div>

      {tiles.filter((t) => t.front).map(renderTile)}

      {TOOLS.map((_, i) => {
        const at = MERGE_AT + i * MERGE_STAGGER + MERGE_LEN;
        const ring = tween(frame, [at, at + 14], [0, 1]);
        if (ring <= 0 || ring >= 1) return null;
        const c = slotCenter(i);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: c.x - 90,
              top: c.y - 60,
              width: 180,
              height: 120,
              borderRadius: 30,
              border: `3px solid ${TOOLS[i].color}`,
              opacity: 1 - ring,
              transform: `scale(${0.8 + ring * 0.5})`,
            }}
          />
        );
      })}

      </AbsoluteFill>

      <Sfx at={2} name="whoosh" volume={0.45} />
      {TOOLS.map((_, i) => (
        <React.Fragment key={i}>
          <Sfx at={MERGE_AT + i * MERGE_STAGGER} name="whoosh-soft" volume={0.16} />
          <Sfx at={MERGE_AT + i * MERGE_STAGGER + MERGE_LEN} name={i % 2 ? 'pop' : 'pop-high'} volume={0.3} />
        </React.Fragment>
      ))}
      <Sfx at={allMerged} name="shimmer" volume={0.45} />
    </AbsoluteFill>
  );
};
