import {Plus} from 'lucide-react';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, easeOut, pop, tween} from '../anim';
import {AppShell, NAV, NavKey, SIDEBAR_W} from '../components/AppShell';
import {BROWSER_H, BROWSER_W, Browser, CHROME_H} from '../components/Browser';
import {camAt, Device} from '../components/Device';
import {SceneTitle, Sfx} from '../components/ui';
import {C, SANS, SERIF} from '../theme';
import {TOOLS} from '../tools';

const TILE_W = 262;
const TILE_H = 150;
const GAP = 18;
const GRID_LEFT = SIDEBAR_W + 48;
const GRID_TOP = 130;
const MERGE_AT = 100;
const STAGGER = 5;
const LEN = 18;
const ORBIT = {cx: 960, cy: 610, rx: 800, ry: 330};
const ORBIT_SCALE = 1.25;
const CHIPS_AT = 156;
const EXTRA: NavKey[] = ['courses', 'analytics', 'assessment', 'mahatet', 'lab', 'students', 'english', 'books', 'banks'];

const slot = (i: number) => ({x: GRID_LEFT + (i % 4) * (TILE_W + GAP), y: GRID_TOP + Math.floor(i / 4) * (TILE_H + GAP)});

const ToolCard: React.FC<{i: number}> = ({i}) => {
  const t = TOOLS[i];
  return (
    <div
      style={{
        width: TILE_W,
        height: TILE_H,
        borderRadius: 18,
        background: C.panel,
        border: `1px solid ${C.line2}`,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: SANS,
        boxShadow: '0 20px 40px -16px rgba(0,0,0,0.8)',
      }}
    >
      <div style={{width: 46, height: 46, borderRadius: 13, background: `${t.color}26`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <t.Icon size={24} color={t.color} />
      </div>
      <div>
        <div style={{fontSize: 18, fontWeight: 600, color: C.text}}>{t.label}</div>
        <div style={{fontSize: 13, color: C.text3, marginTop: 3}}>{t.hint}</div>
      </div>
    </div>
  );
};

const ToolsPage: React.FC<{landed: (i: number) => number}> = ({landed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const label = (k: NavKey) => NAV.find((n) => n.key === k)!;
  return (
    <div style={{position: 'absolute', inset: 0, left: 0, fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 48, top: 36}}>
        <div style={{fontFamily: SERIF, fontSize: 34, color: C.text}}>Tools</div>
        <div style={{fontSize: 15, color: C.text2, marginTop: 4}}>Pick a tool to start creating.</div>
      </div>
      {TOOLS.map((_, i) => {
        const s = slot(i);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: s.x - SIDEBAR_W,
              top: s.y,
              width: TILE_W,
              height: TILE_H,
              borderRadius: 18,
              border: '1.5px dashed rgba(255,255,255,0.22)',
              background: 'rgba(255,255,255,0.02)',
              opacity: 1 - landed(i),
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          left: slot(7).x - SIDEBAR_W,
          top: slot(7).y,
          width: TILE_W,
          height: TILE_H,
          borderRadius: 18,
          background: 'rgba(116,80,239,0.12)',
          border: '1px solid rgba(139,108,246,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          color: '#B9A3FF',
          fontSize: 16,
          fontWeight: 600,
          opacity: tween(frame, [MERGE_AT + 40, MERGE_AT + 50], [0, 1]),
        }}
      >
        <Plus size={18} /> More tools
      </div>
      <div style={{position: 'absolute', left: 48, top: GRID_TOP + 2 * (TILE_H + GAP) + 26}}>
        <div style={{fontSize: 13, fontWeight: 600, letterSpacing: '0.14em', color: C.text3, opacity: tween(frame, [CHIPS_AT - 6, CHIPS_AT + 4], [0, 1])}}>
          ALSO ON AISHIKSHAMITRA
        </div>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, width: 1100, marginTop: 14}}>
          {EXTRA.map((k, i) => {
            const at = CHIPS_AT + i * 3;
            const p = pop(frame, fps, at, 14, 160);
            const item = label(k);
            return (
              <div
                key={k}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 16px',
                  borderRadius: 999,
                  background: C.panel,
                  border: `1px solid ${C.line2}`,
                  fontSize: 15,
                  color: '#D4D4D8',
                  opacity: tween(frame, [at, at + 5], [0, 1]),
                  transform: `scale(${0.7 + 0.3 * p})`,
                }}
              >
                <item.Icon size={16} color="#8B6CF6" />
                {item.label}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const Scene08All: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = camAt(
    frame,
    [
      {f: 0, cam: {look: [BROWSER_W / 2, BROWSER_H / 2], at: [960, 640], scale: 0.58, opacity: 0}},
      {f: 16, cam: {look: [BROWSER_W / 2, BROWSER_H / 2], at: [960, 610], scale: 0.64}},
      {f: 150, cam: {look: [BROWSER_W / 2, BROWSER_H / 2], at: [960, 610], scale: 0.64}},
      {f: 215, cam: {look: [BROWSER_W / 2 + 60, BROWSER_H / 2 - 20], at: [960, 600], scale: 0.8}},
    ],
    easeInOut,
  );
  const spread = tween(frame, [2, 36], [0, 1], easeOut);
  const landed = (i: number) => tween(frame, [MERGE_AT + i * STAGGER + LEN - 2, MERGE_AT + i * STAGGER + LEN], [0, 1]);
  const toScreen = (x: number, y: number) => ({
    x: cam.at[0] + cam.scale * (x - cam.look[0]),
    y: cam.at[1] + cam.scale * (y - cam.look[1]),
  });
  const allMerged = MERGE_AT + STAGGER * (TOOLS.length - 1) + LEN;
  const ring = tween(frame, [6, 30], [0, 1]) * tween(frame, [MERGE_AT, MERGE_AT + 30], [1, 0]);
  const highlight = (k: NavKey) => {
    const idx = NAV.findIndex((n) => n.key === k);
    const at = CHIPS_AT - 6 + idx * 3;
    return tween(frame, [at, at + 5], [0, 1]) * tween(frame, [at + 10, at + 22], [1, 0.25]);
  };

  const tiles = TOOLS.map((_, i) => {
    const theta = (i / TOOLS.length) * Math.PI * 2 + frame * 0.022 + (1 - spread) * Math.PI * 1.2 - Math.PI / 2;
    const ox = ORBIT.cx + Math.cos(theta) * ORBIT.rx * spread;
    const oy = ORBIT.cy + Math.sin(theta) * ORBIT.ry * spread;
    const depth = Math.sin(theta);
    const m = tween(frame, [MERGE_AT + i * STAGGER, MERGE_AT + i * STAGGER + LEN], [0, 1], easeInOut);
    const s = slot(i);
    const target = toScreen(s.x + TILE_W / 2, CHROME_H + s.y + TILE_H / 2);
    const orbitScale = ORBIT_SCALE * (0.8 + 0.2 * (depth + 1) / 2) * (0.3 + 0.7 * spread);
    return {
      i,
      x: ox + (target.x - ox) * m,
      y: oy + (target.y - oy) * m,
      scale: orbitScale + (cam.scale - orbitScale) * m,
      front: depth > -0.2 || m > 0,
      opacity: ((0.5 + 0.5 * (depth + 1) / 2) * (1 - m) + m) * tween(frame, [2, 10], [0, 1]),
      rot: (1 - m) * Math.cos(theta) * 5,
    };
  });

  const renderTile = (t: (typeof tiles)[number]) => (
    <div key={t.i} style={{position: 'absolute', left: t.x, top: t.y, width: 0, height: 0, opacity: t.opacity}}>
      <div style={{transform: `translate(-50%, -50%) scale(${t.scale}) rotate(${t.rot}deg)`, width: TILE_W, height: TILE_H}}>
        <ToolCard i={t.i} />
      </div>
    </div>
  );

  return (
    <AbsoluteFill style={{fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 56, display: 'flex', justifyContent: 'center'}}>
        <SceneTitle text="Everything in one place" at={6} size={80} italicIdx={[2, 3]} style={{justifyContent: 'center'}} />
      </div>

      <svg width="1920" height="1080" style={{position: 'absolute', inset: 0, opacity: ring}}>
        <ellipse cx={ORBIT.cx} cy={ORBIT.cy} rx={ORBIT.rx * spread} ry={ORBIT.ry * spread} fill="none" stroke="rgba(139,116,242,0.35)" strokeWidth="1.5" strokeDasharray="3 10" />
        <ellipse cx={ORBIT.cx} cy={ORBIT.cy} rx={ORBIT.rx * spread * 0.66} ry={ORBIT.ry * spread * 0.66} fill="none" stroke="rgba(0,210,230,0.18)" strokeWidth="1.5" />
      </svg>

      {tiles.filter((t) => !t.front).map(renderTile)}

      <div
        style={{
          position: 'absolute',
          left: 960 - 700,
          top: 610 - 500,
          width: 1400,
          height: 1000,
          background: 'radial-gradient(ellipse, rgba(116,80,239,0.28) 0%, rgba(20,80,245,0.12) 35%, transparent 65%)',
          opacity: 0.7 + 0.3 * tween(frame, [allMerged - 4, allMerged + 8], [0, 1]),
        }}
      />
      <Device cam={cam}>
        <Browser url="aishikshamitra.com/tools">
          <AppShell active="tools" highlight={highlight}>
            <ToolsPage landed={landed} />
          </AppShell>
        </Browser>
      </Device>

      {tiles.filter((t) => t.front).map(renderTile)}

      <Sfx at={2} name="whoosh" volume={0.45} />
      {TOOLS.map((_, i) => (
        <React.Fragment key={i}>
          <Sfx at={MERGE_AT + i * STAGGER} name="whoosh-soft" volume={0.14} />
          <Sfx at={MERGE_AT + i * STAGGER + LEN} name={i % 2 ? 'pop' : 'pop-high'} volume={0.28} />
        </React.Fragment>
      ))}
      <Sfx at={allMerged} name="shimmer" volume={0.4} />
      <Sfx at={CHIPS_AT} name="swipe" volume={0.2} />
    </AbsoluteFill>
  );
};
