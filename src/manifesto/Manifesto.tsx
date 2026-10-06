import {ChartColumn, ClipboardList, FileText, Send} from 'lucide-react';
import React, {useMemo} from 'react';
import {AbsoluteFill, Audio, Img, interpolate, Sequence, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, easeOut, pop, tween} from '../anim';
import {Grain} from '../components/Background';
import {LogoMark, Wordmark} from '../components/Logo';
import {MaskWords, Sfx, SfxName} from '../components/ui';
import {C, SANS, SERIF, SERIF_IN} from '../theme';
import {ChalkDefs, ChalkWrite, circ, INK, rrect, Sketch, Strike, Struck, sceneOpacity} from './chalk';
import {displayText, Lang, STEPS, Timing, W} from './data';
import * as F from './figures';

export const manifestoDefaults: {lang: Lang; music: boolean; voiceover: boolean} = {lang: 'mr', music: true, voiceover: true};

const CX = 540;
const MUSIC = 0.5;
const DUCKED = 0.2;
const NO_CAPTION = new Set(['m07', 'm12']);
const stepOf = (id: string) => STEPS.find((s) => s.id === id)!;

/** Places a figure so that its own origin lands on (cx, cy) of the canvas. */
const Draw: React.FC<{
  fig: F.Fig;
  cx: number;
  cy: number;
  scale: number;
  at: number;
  dur?: number;
  color?: string;
  w?: number;
  neon?: boolean;
  out?: number;
  style?: React.CSSProperties;
}> = ({fig, cx, cy, scale, at, dur, color, w = 6, neon, out, style}) => {
  const [x0, y0, vw, vh] = fig.vb;
  return (
    <Sketch
      strokes={fig.strokes}
      at={at}
      dur={dur}
      color={color}
      w={w / scale}
      neon={neon}
      out={out}
      x={cx + x0 * scale}
      y={cy + y0 * scale}
      width={vw * scale}
      height={vh * scale}
      vb={fig.vb}
      style={style}
    />
  );
};

const Center: React.FC<{y: number; children: React.ReactNode; style?: React.CSSProperties}> = ({y, children, style}) => (
  <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', flexDirection: 'column', alignItems: 'center', ...style}}>{children}</div>
);

/** A soft light on the board. */
const Glow: React.FC<{x: number; y: number; r: number; color: string; o: number}> = ({x, y, r, color, o}) =>
  o <= 0 ? null : (
    <div style={{position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: '50%', background: `radial-gradient(circle, ${color} 0%, transparent 68%)`, opacity: o}} />
  );

/** The machine: a crisp cyan orb with slow rings. */
const Orb: React.FC<{x: number; y: number; size: number; o?: number; dim?: number}> = ({x, y, size, o = 1, dim = 0}) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 9) * 0.035;
  const lit = 1 - dim * 0.75;
  return (
    <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, opacity: o}}>
      <Glow x={size / 2} y={size / 2} r={size * 1.6} color={`rgba(95,230,238,${0.32 * lit})`} o={1} />
      {[0, 1, 2].map((i) => {
        const t = ((frame + i * 20) % 60) / 60;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `2px solid rgba(95,230,238,${(1 - t) * 0.5 * lit})`,
              transform: `scale(${1 + t * 1.1})`,
            }}
          />
        );
      })}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          transform: `scale(${pulse})`,
          background: `radial-gradient(circle at 36% 32%, rgba(255,255,255,${0.95 * lit}) 0%, rgba(140,245,250,${lit}) 18%, rgba(10,140,240,${0.9 * lit}) 55%, rgba(20,60,200,${0.85 * lit}) 100%)`,
          boxShadow: `0 0 ${size * 0.35}px rgba(95,230,238,${0.8 * lit}), inset 0 0 ${size * 0.2}px rgba(255,255,255,${0.3 * lit})`,
          filter: dim > 0 ? `saturate(${1 - dim * 0.8})` : undefined,
        }}
      />
    </div>
  );
};

/** Crisp cyan text for the machine's words. */
const neonText = (size: number): React.CSSProperties => ({
  fontFamily: SANS,
  fontSize: size,
  fontWeight: 600,
  color: '#C9FBFF',
  textShadow: `0 0 ${size * 0.2}px ${INK.cyan}, 0 0 ${size * 0.5}px rgba(95,230,238,0.5)`,
});

const useScene = (T: Timing, id: string) => {
  const frame = useCurrentFrame();
  const s = T.start(id);
  const e = T.end(id);
  return {frame, s, e, on: frame >= s - 3 && frame < e + 8, o: sceneOpacity(frame, s, e)};
};

/** Wrapper every scene shares: fades in, and on the way out is wiped off like chalk under a duster. */
const Scene: React.FC<{T: Timing; id: string; children: React.ReactNode; push?: number}> = ({T, id, children, push = 0.035}) => {
  const {frame, s, e, on, o} = useScene(T, id);
  if (!on) return null;
  const exit = tween(frame, [e - 4, e + 6], [0, 1], easeInOut);
  const z = 1 + push * tween(frame, [s, e], [0, 1], (t) => t);
  return (
    <AbsoluteFill style={{opacity: o, transform: `scale(${z}) translateX(${exit * 24}px)`, transformOrigin: '50% 42%', filter: exit > 0 ? `blur(${exit * 7}px)` : undefined}}>
      {children}
    </AbsoluteFill>
  );
};

/** The slate itself, darkened for the typographic beats. */
const Board: React.FC<{T: Timing}> = ({T}) => {
  const frame = useCurrentFrame();
  const span = (id: string, depth: number) => depth * tween(frame, [T.start(id) - 6, T.start(id) + 10], [0, 1]) * tween(frame, [T.end(id) - 6, T.end(id) + 8], [1, 0]);
  const dark = Math.max(span('m07', 0.62), span('m12', 0.55), span('m10', 0.3), span('m13', 0.35));
  return (
    <AbsoluteFill>
      <Img src={staticFile('manifesto/board.jpg')} style={{width: 1080, height: 1920}} />
      <AbsoluteFill style={{background: '#030504', opacity: dark}} />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, transparent 45%, rgba(0,0,0,0.6) 100%)'}} />
    </AbsoluteFill>
  );
};

// ── m01 — your students have found a new teacher ─────────────────────────────────────────────────────────────
const S01: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const s = T.start('m01');
  const rise = tween(frame, [T.v('m01', 0.3), T.v('m01', 0.62)], [0, 1], easeInOut);
  const kids = [130, 330, 540, 750, 950];
  return (
    <Scene T={T} id="m01" push={0.05}>
      <Glow x={CX} y={680} r={520} color="rgba(95,230,238,0.16)" o={rise} />
      <Center y={270}>
        <ChalkWrite text={W.board[lang]} at={T.v('m01', 0.5)} dur={20} size={110} />
      </Center>
      <Draw fig={F.desk} cx={CX} cy={1010} scale={1} at={s + 2} dur={18} />
      <Draw fig={F.phone} cx={CX} cy={1010} scale={0.78} at={s + 12} dur={14} color={INK.cyan} w={5} neon />
      {rise > 0 ? <Orb x={CX} y={930 - rise * 300} size={110 + rise * 70} o={Math.min(1, rise * 3)} /> : null}
      {kids.map((x, i) => (
        <Draw key={x} fig={F.kidBack(i % 2 === 1)} cx={x} cy={1340} scale={1.45} at={s + 6 + i * 3} dur={14} />
      ))}
    </Scene>
  );
};

// ── m02 — answers in three seconds, never tired, no off switch ───────────────────────────────────────────────
const IconBeat: React.FC<{fig: F.Fig; at: number; next?: number; slot: [number, number]; children?: React.ReactNode}> = ({fig, at, next, slot, children}) => {
  const frame = useCurrentFrame();
  if (frame < at - 1) return null;
  const m = next === undefined ? 0 : tween(frame, [next - 2, next + 12], [0, 1], easeInOut);
  const size = 400;
  const cx = CX + (slot[0] - CX) * m;
  const cy = 700 + (slot[1] - 700) * m;
  const k = 1 - 0.62 * m;
  return (
    <div style={{position: 'absolute', left: cx - size / 2, top: cy - size / 2, width: size, height: size, transform: `scale(${k})`}}>
      <Sketch strokes={fig.strokes} at={at} dur={14} color={INK.cyan} w={1.05} neon width={size} height={size} vb={fig.vb} />
      {children}
    </div>
  );
};

const S02: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const b = [T.b('m02', 0, 0), T.b('m02', 1, 0.3), T.b('m02', 2, 0.58)];
  const k = 400 / 24;
  const spin = tween(frame, [b[0] + 6, b[0] + 40], [0, 3 * 360], easeOut);
  const fill = tween(frame, [b[1] + 8, b[1] + 26], [0, 1], easeOut);
  const bubbles = [
    [-250, -160],
    [250, -190],
    [-300, 60],
    [290, 90],
    [-170, 250],
    [200, 270],
  ];
  return (
    <Scene T={T} id="m02" push={0.02}>
      <IconBeat fig={F.timer} at={b[0]} next={b[1]} slot={[220, 360]}>
        <svg width={400} height={400} viewBox="0 0 24 24" style={{position: 'absolute', inset: 0, overflow: 'visible', filter: `drop-shadow(0 0 6px ${INK.cyan})`}}>
          <line x1={12} y1={14} x2={12 + 5.6 * Math.sin((spin * Math.PI) / 180)} y2={14 - 5.6 * Math.cos((spin * Math.PI) / 180)} stroke={INK.cyan} strokeWidth={1.05} strokeLinecap="round" opacity={tween(frame, [b[0] + 4, b[0] + 8], [0, 1])} />
        </svg>
        <div style={{position: 'absolute', top: 420, left: -100, right: -100, textAlign: 'center', ...neonText(64), opacity: tween(frame, [b[0] + 30, b[0] + 36], [0, 1]) * tween(frame, [b[1] - 4, b[1] + 4], [1, 0])}}>
          {W.secs[lang]}
        </div>
      </IconBeat>
      {bubbles.map(([dx, dy], i) => {
        const at = b[0] + 36 + i * 2;
        const p = pop(frame, 30, at, 12, 160);
        const fade = tween(frame, [b[1] - 6, b[1] + 4], [1, 0]);
        if (frame < at || fade <= 0) return null;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: CX + dx * (0.7 + 0.3 * p) - 70,
              top: 700 + dy * (0.7 + 0.3 * p) - 34,
              width: 140,
              height: 68,
              borderRadius: 20,
              border: `3px solid ${INK.cyan}`,
              boxShadow: `0 0 16px ${INK.cyan}`,
              opacity: Math.min(1, p) * fade,
              transform: `scale(${p})`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 9,
              padding: '0 20px',
            }}
          >
            <div style={{height: 5, borderRadius: 3, background: INK.cyan, width: '90%'}} />
            <div style={{height: 5, borderRadius: 3, background: INK.cyan, width: '60%'}} />
          </div>
        );
      })}
      <IconBeat fig={F.battery} at={b[1]} next={b[2]} slot={[CX, 360]}>
        <div style={{position: 'absolute', left: (3.3 / 24) * 400, top: (7.3 / 24) * 400, height: (9.4 / 24) * 400, width: (13.4 / 24) * 400 * fill, borderRadius: 14, background: 'rgba(95,230,238,0.22)'}} />
      </IconBeat>
      <IconBeat fig={F.power} at={b[2]} slot={[860, 360]}>
        <Sketch strokes={[`M${2 * k} ${22 * k} L${22 * k} ${2 * k}`]} at={T.v('m02', 0.86)} dur={8} color={INK.rose} w={16} width={400} height={400} />
      </IconBeat>
    </Scene>
  );
};

// ── m03 — but there are things AI will never do ──────────────────────────────────────────────────────────────
const S03: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const at = T.b('m03', 0, 0);
  const dim = tween(frame, [T.v('m03', 0.55), T.v('m03', 0.95)], [0, 1], easeInOut);
  return (
    <Scene T={T} id="m03">
      <Glow x={CX} y={700} r={480} color="rgba(255,200,112,0.14)" o={tween(frame, [at + 8, at + 30], [0, 1])} />
      <Center y={520}>
        <ChalkWrite text={W.but[lang]} at={at + 2} dur={22} size={250} color={INK.amber} glow />
      </Center>
      <Strike x={300} y={900} w={480} at={at + 30} color={INK.amber} thick={9} />
      <Orb x={CX} y={1120} size={90} dim={dim} o={tween(frame, [T.start('m03') + 4, T.start('m03') + 14], [0, 1])} />
    </Scene>
  );
};

// ── m04 — "I understood"... and didn't ───────────────────────────────────────────────────────────────────────
const S04: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const s = T.start('m04');
  const b = [T.b('m04', 0, 0), T.b('m04', 1, 0.36), T.b('m04', 2, 0.68)];
  const bub = {x: 510, y: 640, w: 400, h: 160};
  const scan = tween(frame, [b[2] + 2, b[2] + 18], [0, 1], easeInOut);
  const scanOn = frame >= b[2] && frame < b[2] + 22;
  const cloudP = F.cloud(270, 560, 190, 120, 10);
  return (
    <Scene T={T} id="m04">
      <Draw fig={F.kid({desk: false})} cx={470} cy={1330} scale={3.3} at={s + 2} dur={20} w={7} />
      <Sketch strokes={[F.speech(bub.w, bub.h)]} at={b[0] + 4} dur={12} x={bub.x} y={bub.y} width={bub.w} height={bub.h + 60} w={6} />
      <div style={{position: 'absolute', left: bub.x, top: bub.y + 18, width: bub.w, textAlign: 'center'}}>
        <ChalkWrite text={W.understood[lang]} at={b[0] + 14} dur={14} size={86} />
      </div>
      <Sketch
        strokes={[{d: cloudP}, {d: circ(430, 760, 18)}, {d: circ(458, 830, 11)}]}
        at={b[1] + 2}
        dur={16}
        width={1080}
        height={1000}
        color={INK.amber}
        w={6}
      />
      <div style={{position: 'absolute', left: 80, width: 380, top: 500, textAlign: 'center'}}>
        <ChalkWrite text="???" at={b[1] + 16} dur={12} size={104} color={INK.amber} glow />
      </div>
      {/* The machine reads only the words: its scan passes the bubble and ticks it. */}
      {scanOn ? (
        <div style={{position: 'absolute', left: bub.x - 20, width: bub.w + 40, top: bub.y - 10 + scan * (bub.h + 20), height: 4, background: INK.cyan, boxShadow: `0 0 18px ${INK.cyan}`, opacity: 1 - Math.abs(scan - 0.5)}} />
      ) : null}
      <Sketch
        strokes={[
          `M0 40 V0 H40`,
          `M${bub.w + 40 - 40} 0 H${bub.w + 40} V40`,
          `M0 ${bub.h + 20 - 40} V${bub.h + 20} H40`,
          `M${bub.w} ${bub.h + 20} H${bub.w + 40} V${bub.h + 20 - 40}`,
        ]}
        at={b[2]}
        dur={6}
        x={bub.x - 20}
        y={bub.y - 10}
        width={bub.w + 40}
        height={bub.h + 20}
        color={INK.cyan}
        w={4}
        neon
      />
      <Sketch strokes={['M10 46 L36 72 L90 14']} at={b[2] + 20} dur={8} x={bub.x + bub.w + 6} y={bub.y - 50} width={100} height={90} color={INK.cyan} w={8} neon />
    </Scene>
  );
};

// ── m05 — the girl on the last bench ─────────────────────────────────────────────────────────────────────────
type Seat = {x: number; y: number; s: number; girl?: boolean; hand?: boolean; her?: boolean};
const ROWS: Seat[] = [
  ...[250, 440, 630].map((x) => ({x, y: 600, s: 0.78, hand: true})),
  {x: 830, y: 600, s: 0.78, girl: true, her: true},
  ...[190, 410, 640, 870].map((x, i) => ({x, y: 820, s: 0.96, girl: i === 2, hand: true})),
  ...[160, 400, 660, 910].map((x, i) => ({x, y: 1080, s: 1.18, girl: i === 1, hand: true})),
];

const S05: React.FC<{T: Timing}> = ({T}) => {
  const frame = useCurrentFrame();
  const s = T.start('m05');
  const b = [T.b('m05', 0, 0), T.b('m05', 1, 0.27), T.b('m05', 2, 0.78)];
  const scanY = tween(frame, [b[2] + 2, b[2] + 30], [380, 1180], easeInOut);
  const her = ROWS.find((r) => r.her)!;
  const warm = tween(frame, [T.step('m05').voAt + T.step('m05').voFrames - 8, T.step('m05').voAt + T.step('m05').voFrames + 10], [0, 1], easeInOut);
  const hands = ROWS.filter((r) => r.hand);
  return (
    <Scene T={T} id="m05" push={0.025}>
      <Glow x={her.x} y={her.y - 70} r={230} color="rgba(255,200,112,0.45)" o={warm} />
      {ROWS.map((r, i) => (
        <Draw key={i} fig={F.kid({girl: r.girl, down: r.her})} cx={r.x} cy={r.y} scale={r.s} at={s + 2 + (r.her ? 20 : i * 1.6)} dur={12} w={5.5} color={r.her ? INK.white : INK.white} />
      ))}
      {hands.map((r, i) => (
        <Draw key={i} fig={F.kidHand} cx={r.x} cy={r.y} scale={r.s} at={b[1] + 6 + i * 3} dur={8} w={5.5} />
      ))}
      {frame >= b[2] && frame < b[2] + 34 ? (
        <div style={{position: 'absolute', left: 60, right: 60, top: scanY, height: 4, background: INK.cyan, boxShadow: `0 0 22px ${INK.cyan}`, opacity: tween(frame, [b[2], b[2] + 4], [0, 1]) * tween(frame, [b[2] + 28, b[2] + 34], [1, 0])}} />
      ) : null}
      {hands.map((r, i) => {
        const hy = r.y - 132 * r.s;
        const at = interpolate(hy, [380, 1180], [b[2] + 2, b[2] + 30]);
        const p = pop(frame, 30, at, 12, 170);
        if (frame < at) return null;
        return (
          <div
            key={`ring${i}`}
            style={{
              position: 'absolute',
              left: r.x + 44 * r.s - 30,
              top: hy - 30,
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: `3px solid ${INK.cyan}`,
              boxShadow: `0 0 14px ${INK.cyan}`,
              transform: `scale(${p})`,
              opacity: Math.min(1, p) * (1 - warm * 0.6),
            }}
          />
        );
      })}
      <Sketch strokes={[circ(0, 0, 100)]} at={T.step('m05').voAt + T.step('m05').voFrames - 4} dur={14} x={her.x - 110} y={her.y - 190} width={220} height={220} vb={[-110, -110, 220, 220]} color={INK.amber} w={6} />
    </Scene>
  );
};

// ── m06 — teach a child to question an answer ────────────────────────────────────────────────────────────────
const S06: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = T.start('m06');
  const b = [T.b('m06', 0, 0), T.b('m06', 1, 0.6)];
  const card = pop(frame, fps, s + 2, 14, 140);
  const dimCard = tween(frame, [b[1], b[1] + 14], [0, 1]);
  const qAt = T.v('m06', 0.22);
  return (
    <Scene T={T} id="m06">
      <div
        style={{
          position: 'absolute',
          left: 90,
          top: 600,
          width: 500,
          height: 210,
          borderRadius: 30,
          border: `3px solid ${INK.cyan}`,
          boxShadow: `0 0 26px rgba(95,230,238,0.6), inset 0 0 30px rgba(95,230,238,0.12)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 22,
          opacity: Math.min(1, card * 1.4) * (1 - dimCard * 0.6),
          transform: `scale(${0.8 + 0.2 * card}) rotate(-3deg)`,
          ...neonText(84),
        }}
      >
        {W.answer[lang]} <span style={{fontSize: 80}}>✓</span>
      </div>
      <Glow x={790} y={680} r={360} color="rgba(255,200,112,0.3)" o={tween(frame, [qAt + 20, qAt + 40], [0, 1]) * (0.6 + 0.4 * dimCard)} />
      <Draw fig={F.question} cx={630} cy={400} scale={1.7} at={qAt} dur={26} color={INK.amber} w={13} />
      <Draw fig={F.kid({girl: true})} cx={CX} cy={1240} scale={1.2} at={s + 6} dur={14} w={5.5} />
      <Draw fig={F.kidHand} cx={CX} cy={1240} scale={1.2} at={qAt + 18} dur={8} w={5.5} />
    </Scene>
  );
};

// ── m07 — the real danger ────────────────────────────────────────────────────────────────────────────────────
const S07: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const s = T.start('m07');
  const b = [T.b('m07', 0, 0), T.b('m07', 1, 0.46), T.b('m07', 2, 0.66)];
  const voEnd = T.step('m07').voAt + T.step('m07').voFrames;
  const dies = b[2] + (voEnd - b[2]) * 0.62;
  const flicker = frame < dies ? 1 : frame < dies + 18 ? (Math.floor((frame - dies) / 2) % 3 === 0 ? 0.25 : 0.85) * (1 - (frame - dies) / 18) : 0;
  const lit = tween(frame, [s + 10, s + 24], [0, 1]) * flicker;
  const lines = lang === 'mr' ? ['आपण विचार करणं', 'सोडून देऊ.'] : [W.weStop[lang]];
  const strikeAt = b[0] + (b[1] - b[0]) * 0.78;
  return (
    <Scene T={T} id="m07" push={0.03}>
      <Glow x={CX} y={380} r={330} color="rgba(255,200,112,0.5)" o={lit} />
      <Draw fig={F.bulb} cx={CX - 130} cy={250} scale={260 / 24} at={s + 2} dur={16} color={lit > 0.3 ? INK.gold : INK.dim} w={7} />
      <Sketch strokes={[F.filament]} at={s + 8} dur={8} x={CX - 130} y={250} width={260} height={260} vb={[0, 0, 24, 24]} color={INK.gold} w={0.6} style={{opacity: 0.3 + 0.7 * lit}} />
      <Center y={640}>
        <Struck at={strikeAt}>
          <MaskWords text={W.machines[lang]} at={b[0] + 4} stagger={3} style={{justifyContent: 'center', ...neonText(70)}} />
        </Struck>
      </Center>
      <Center y={790}>
        <ChalkWrite text={W.danger[lang]} at={b[1] + 2} dur={14} size={66} color={INK.dim} />
      </Center>
      <Center y={900}>
        <ChalkWrite text={lines[0]} at={b[2] + 2} dur={lines.length > 1 ? 24 : 20} size={lang === 'mr' ? 110 : 120} glow />
        {lines[1] ? <ChalkWrite text={lines[1]} at={b[2] + (voEnd - b[2]) * 0.5} dur={16} size={110} glow /> : null}
      </Center>
    </Scene>
  );
};

// ── m08 — once teachers taught India to read; now to think ───────────────────────────────────────────────────
const S08: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const s = T.start('m08');
  const b = [T.b('m08', 0, 0), T.b('m08', 1, 0.55)];
  const lift = tween(frame, [b[1] - 4, b[1] + 14], [0, 1], easeInOut);
  const on = T.v('m08', 0.88);
  const lit = tween(frame, [on, on + 6], [0, 1]);
  return (
    <Scene T={T} id="m08">
      <div style={{position: 'absolute', left: 230, top: 400, width: 620, height: 440, transform: `translateY(${-lift * 150}px) scale(${1 - lift * 0.42})`, transformOrigin: '50% 0%', opacity: 1 - lift * 0.45}}>
        <div style={{position: 'absolute', left: 34, top: 34, width: 552, height: 372, borderRadius: 8, background: '#121614', opacity: tween(frame, [s + 4, s + 12], [0, 1])}} />
        <Sketch strokes={F.slateFrame.strokes} at={s + 2} dur={14} width={620} height={440} color={INK.wood} w={9} />
        <Center y={90}>
          <ChalkWrite text={W.letters[lang]} at={b[0] + 10} dur={26} size={100} />
        </Center>
        <Center y={240}>
          <ChalkWrite text={W.letters2[lang]} at={b[0] + 44} dur={24} size={100} />
        </Center>
      </div>
      <Glow x={CX} y={880} r={420} color="rgba(255,200,112,0.55)" o={lit} />
      {lit > 0 ? (
        <Sketch
          strokes={[-70, -40, -10, 20, 50, 80, 110, 140, 170, 200, 230, 250].map((deg, i) => {
            const a = ((deg - 90 - 60) * Math.PI) / 180;
            return {d: `M${300 + Math.cos(a) * 230} ${300 + Math.sin(a) * 230} L${300 + Math.cos(a) * 300} ${300 + Math.sin(a) * 300}`, at: i * 0.6, dur: 6};
          })}
          at={on}
          x={CX - 300}
          y={860 - 300}
          width={600}
          height={600}
          color={INK.gold}
          w={6}
        />
      ) : null}
      <Draw fig={F.bulb} cx={CX - 180} cy={680} scale={360 / 24} at={b[1] + 6} dur={18} color={lit > 0 ? INK.gold : INK.white} w={8} />
      <Sketch strokes={[F.filament]} at={b[1] + 14} dur={8} x={CX - 180} y={680} width={360} height={360} vb={[0, 0, 24, 24]} color={INK.gold} w={0.5} />
      <Center y={1080}>
        <ChalkWrite text={W.think[lang]} at={b[1] + 26} dur={14} size={96} color={INK.amber} glow />
      </Center>
    </Scene>
  );
};

// ── m09 — the future belongs to those who use it well; they're in your classroom ─────────────────────────────
const CLASS: Seat[] = [
  ...[200, 420, 660, 880].map((x, i) => ({x, y: 900, s: 0.95, girl: i % 2 === 1})),
  ...[160, 400, 680, 920].map((x, i) => ({x, y: 1180, s: 1.15, girl: i % 2 === 0})),
];

const S09: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const s = T.start('m09');
  const b = [T.b('m09', 0, 0), T.b('m09', 1, 0.34), T.b('m09', 2, 0.63), T.b('m09', 3, 0.78)];
  const up = tween(frame, [b[2] - 4, b[2] + 14], [0, 1], easeInOut);
  return (
    <Scene T={T} id="m09" push={0.02}>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${-up * 150}px) scale(${1 - up * 0.25})`, transformOrigin: '50% 0%'}}>
        <Draw fig={F.globe(140)} cx={CX} cy={430} scale={1} at={s + 2} dur={22} out={b[2] + 4} w={6} />
        <Center y={630}>
          <Struck at={b[1] - 14}>
            <div style={{...neonText(70), opacity: tween(frame, [b[0] + 26, b[0] + 32], [0, 1])}}>{W.haveAI[lang]}</div>
          </Struck>
        </Center>
        <Center y={760}>
          <ChalkWrite text={W.useAI[lang]} at={b[1] + 6} dur={18} size={100} color={INK.amber} glow />
        </Center>
        <Strike x={300} y={905} w={480} at={b[1] + 30} color={INK.amber} tilt={2} thick={8} />
      </div>
      {CLASS.map((r, i) => {
        const at = b[3] + 4 + i * 5;
        const lit = tween(frame, [at, at + 6], [0, 1]);
        return (
          <React.Fragment key={i}>
            <Glow x={r.x} y={r.y - 190 * r.s} r={90} color="rgba(255,200,112,0.6)" o={lit} />
            <Draw fig={F.kid({girl: r.girl})} cx={r.x} cy={r.y} scale={r.s} at={b[2] + 2 + i * 1.5} dur={12} w={5.5} />
            <Draw fig={F.bulb} cx={r.x - 26 * r.s} cy={r.y - 222 * r.s} scale={(52 * r.s) / 24} at={at} dur={6} color={INK.gold} w={4} />
          </React.Fragment>
        );
      })}
    </Scene>
  );
};

// ── m10 — AIShikshaMitra: it does the paperwork, you do the teaching ─────────────────────────────────────────
const S10: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = [T.b('m10', 0, 0), T.b('m10', 1, 0.18), T.b('m10', 2, 0.55), T.b('m10', 3, 0.77), T.b('m10', 4, 0.9)];
  const shrink = tween(frame, [b[2] - 8, b[2] + 10], [0, 1], easeInOut);
  const word = pop(frame, fps, b[0] + 16, 14, 120);
  const cards = [
    {I: FileText, label: W.paper[lang], x: 190},
    {I: ClipboardList, label: W.plan[lang], x: CX},
    {I: ChartColumn, label: W.report[lang], x: 890},
  ];
  const teach = tween(frame, [b[3] - 6, b[3] + 8], [0, 1], easeInOut);
  const logoY = 330 - shrink * 120;
  return (
    <Scene T={T} id="m10" push={0.015}>
      <Glow x={CX} y={logoY + 150} r={560 - shrink * 220} color="rgba(20,80,245,0.35)" o={tween(frame, [b[0] - 4, b[0] + 16], [0, 1])} />
      <div style={{position: 'absolute', left: 0, right: 0, top: logoY, display: 'flex', flexDirection: 'column', alignItems: 'center', transform: `scale(${1 - shrink * 0.45})`, transformOrigin: '50% 0%'}}>
        <LogoMark size={300} at={b[0] - 6} glow={1} />
        <div style={{marginTop: 40, opacity: Math.min(1, word * 1.4), transform: `translateY(${(1 - word) * 30}px)`}}>
          <Wordmark size={96} align="center" />
        </div>
      </div>
      <Center y={900} style={{opacity: 1 - shrink}}>
        <MaskWords text={W.forTeachers[lang]} at={b[1] + 4} stagger={3} style={{justifyContent: 'center', fontFamily: SANS, fontSize: 52, fontWeight: 600, color: C.lavender, maxWidth: 900, textAlign: 'center'}} />
      </Center>
      {cards.map((c, i) => {
        const at = b[2] + 4 + i * 6;
        const p = pop(frame, fps, at, 14, 150);
        const done = b[2] + 26 + i * 7;
        const fly = tween(frame, [done + 10, done + 24], [0, 1], easeInOut);
        if (frame < at || fly >= 1) return null;
        const tx = (CX - c.x) * fly;
        const ty = (logoY + 90 - 800) * fly;
        return (
          <div
            key={c.label}
            style={{
              position: 'absolute',
              left: c.x - 150,
              top: 680,
              width: 300,
              height: 290,
              borderRadius: 28,
              background: 'rgba(22,22,28,0.9)',
              border: '2px solid rgba(139,108,246,0.5)',
              boxShadow: '0 0 40px -10px rgba(116,80,239,0.6)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 22,
              opacity: Math.min(1, p * 1.4) * (1 - fly * 0.6),
              transform: `translate(${tx}px, ${ty}px) scale(${(0.7 + 0.3 * p) * (1 - fly * 0.85)})`,
            }}
          >
            <c.I size={96} color="#B9A3FF" strokeWidth={1.6} />
            <div style={{fontFamily: SANS, fontSize: 36, fontWeight: 600, color: C.text, textAlign: 'center', padding: '0 12px'}}>{c.label}</div>
            <div
              style={{
                position: 'absolute',
                top: -22,
                right: -22,
                width: 62,
                height: 62,
                borderRadius: '50%',
                background: '#22C55E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: SANS,
                fontSize: 40,
                fontWeight: 700,
                color: '#fff',
                transform: `scale(${pop(frame, fps, done, 10, 180)})`,
              }}
            >
              ✓
            </div>
          </div>
        );
      })}
      {teach > 0 ? (
        <div style={{position: 'absolute', inset: 0, opacity: teach}}>
          <Glow x={700} y={1000} r={420} color="rgba(255,200,112,0.32)" o={tween(frame, [b[4], b[4] + 14], [0.4, 1])} />
          <Sketch strokes={[rrect(80, 640, 420, 300, 10)]} at={b[3] - 4} dur={10} width={1080} height={1920} color={INK.wood} w={8} />
          <Sketch
            strokes={['M130 720 Q200 700 270 722 T420 716', 'M130 790 Q190 776 250 792', 'M130 860 L210 820 L290 860 L370 800']}
            at={b[3] + 4}
            dur={16}
            width={1080}
            height={1920}
            w={5}
          />
          <Draw fig={F.teacher} cx={700} cy={1240} scale={1.5} at={b[3] - 2} dur={20} color={INK.amber} w={7} />
          {[140, 330, 830, 990].map((x, i) => (
            <Draw key={x} fig={F.kidBack(i % 2 === 0)} cx={x} cy={1350} scale={1.1} at={b[3] + 6 + i * 3} dur={12} w={6} />
          ))}
        </div>
      ) : null}
    </Scene>
  );
};

// ── m11 — learn it first, then lead the change ───────────────────────────────────────────────────────────────
const S11: React.FC<{T: Timing}> = ({T}) => {
  const frame = useCurrentFrame();
  const s = T.start('m11');
  const b = [T.b('m11', 0, 0), T.b('m11', 1, 0.48)];
  const walk = tween(frame, [b[1] + 10, T.end('m11') + 6], [0, 1], (t) => t);
  const followers: {x: number; y: number; s: number; girl?: boolean}[] = [
    {x: 440, y: 900, s: 0.78, girl: true},
    {x: 640, y: 880, s: 0.75},
    {x: 520, y: 800, s: 0.6},
    {x: 380, y: 780, s: 0.55},
    {x: 690, y: 770, s: 0.52, girl: true},
  ];
  return (
    <Scene T={T} id="m11" push={0.03}>
      <Draw fig={F.book} cx={CX - 190} cy={420} scale={380 / 24} at={s + 2} dur={18} out={b[1] - 2} w={7} />
      <Glow x={CX} y={560} r={500} color="rgba(255,200,112,0.42)" o={tween(frame, [b[1] + 8, b[1] + 26], [0, 1])} />
      <Draw fig={F.road} cx={0} cy={560} scale={1} at={b[1]} dur={22} color={INK.white} w={6} />
      <Sketch strokes={[F.road.strokes[1] as string]} at={b[1] + 2} dur={10} y={560 - 330} width={1080} height={1000} vb={F.road.vb} color={INK.amber} w={9} />
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${walk * 40}px)`}}>
        {followers.map((f, i) => (
          <Draw key={i} fig={F.walker(f.girl)} cx={f.x} cy={f.y} scale={f.s * 1.6} at={b[1] + 14 + i * 3} dur={10} w={5} />
        ))}
        <Draw fig={F.teacher} cx={CX + 60} cy={1180} scale={0.95} at={b[1] + 8} dur={18} color={INK.amber} w={6.5} />
      </div>
    </Scene>
  );
};

// ── m12 — AI gives answers. Teachers build minds. ────────────────────────────────────────────────────────────
const S12: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const b = [T.b('m12', 0, 0), T.b('m12', 1, 0.48)];
  return (
    <Scene T={T} id="m12" push={0.03}>
      <Glow x={CX} y={900} r={560} color="rgba(255,200,112,0.22)" o={tween(frame, [b[1], b[1] + 20], [0, 1])} />
      <Center y={600}>
        <MaskWords text={W.tagA[lang]} at={b[0]} stagger={3} style={{justifyContent: 'center', ...neonText(80)}} />
      </Center>
      <Center y={780}>
        <MaskWords
          text={W.tagB[lang]}
          at={b[1]}
          stagger={4}
          style={{
            justifyContent: 'center',
            textAlign: 'center',
            maxWidth: 900,
            fontFamily: SERIF_IN,
            fontSize: lang === 'mr' ? 132 : 128,
            fontWeight: 700,
            lineHeight: 1.18,
            color: INK.gold,
            textShadow: '0 0 40px rgba(255,200,112,0.45)',
          }}
        />
      </Center>
      <Strike x={270} y={1150} w={540} at={b[1] + 26} color={INK.amber} thick={9} tilt={2} />
    </Scene>
  );
};

// ── m13 — start today; send this to one teacher ──────────────────────────────────────────────────────────────
const S13: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = T.start('m13');
  const b = [T.b('m13', 0, 0), T.b('m13', 1, 0.17), T.b('m13', 2, 0.45), T.b('m13', 3, 0.6), T.b('m13', 4, 0.82)];
  const word = pop(frame, fps, s + 18, 14, 120);
  const url = pop(frame, fps, b[1] + 2, 12, 150);
  const chip = pop(frame, fps, b[2] + 4, 12, 150);
  const pulse = 1 + 0.06 * Math.max(0, Math.sin(((frame - b[3]) / 14) * Math.PI)) * (frame >= b[3] ? 1 : 0);
  const nudge = frame >= b[3] ? Math.sin((frame - b[3]) / 5) * 6 : 0;
  return (
    <Scene T={T} id="m13" push={0.012}>
      <Glow x={CX} y={460} r={560} color="rgba(20,80,245,0.32)" o={tween(frame, [s, s + 20], [0, 1])} />
      <Center y={250}>
        <LogoMark size={250} at={s} glow={1} />
      </Center>
      <Center y={560} style={{opacity: Math.min(1, word * 1.4), transform: `translateY(${(1 - word) * 30}px)`}}>
        <Wordmark size={92} align="center" />
      </Center>
      <Center y={790}>
        <ChalkWrite text={W.start[lang]} at={b[0] + 2} dur={16} size={78} color={INK.amber} glow />
      </Center>
      <Center y={930} style={{opacity: Math.min(1, url * 1.4), transform: `scale(${0.7 + 0.3 * url})`}}>
        <div style={{padding: '20px 46px', borderRadius: 999, border: '2px solid rgba(163,166,249,0.7)', background: 'rgba(116,80,239,0.16)', fontFamily: SANS, fontSize: 54, fontWeight: 600, color: C.text, letterSpacing: '0.01em'}}>
          aishikshamitra.com
        </div>
      </Center>
      <Center y={1110} style={{opacity: Math.min(1, chip * 1.4), transform: `scale(${(0.7 + 0.3 * chip) * pulse})`}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 20, padding: '22px 40px', borderRadius: 999, background: 'rgba(255,200,112,0.14)', border: `2px solid ${INK.amber}`, boxShadow: '0 0 40px -8px rgba(255,200,112,0.6)', fontFamily: SANS, fontSize: 46, fontWeight: 600, color: C.text}}>
          <Send size={44} color={INK.amber} style={{transform: `translateX(${nudge}px) rotate(${nudge}deg)`}} />
          {W.share[lang]}
        </div>
      </Center>
    </Scene>
  );
};

const BrandBug: React.FC<{T: Timing}> = ({T}) => {
  const frame = useCurrentFrame();
  const o = tween(frame, [8, 20], [0, 0.9]) * tween(frame, [T.start('m10') - 8, T.start('m10') + 2], [1, 0]);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, opacity: o}}>
      <LogoMark size={48} glow={0.4} />
      <div style={{fontFamily: SERIF, fontWeight: 600, fontSize: 30, color: C.text}}>AIShikshaMitra</div>
    </div>
  );
};

/** Word-by-word captions; with phrase timings from the recording, each phrase lights up on its own clock. */
const Caption: React.FC<{T: Timing; lang: Lang}> = ({T, lang}) => {
  const frame = useCurrentFrame();
  const st = T.at(frame);
  if (NO_CAPTION.has(st.id)) return null;
  const words = displayText(stepOf(st.id).vo[lang]).split(' ');
  const phraseOf: number[] = [];
  let k = 0;
  for (const w of words) {
    phraseOf.push(k);
    if (/[,.?!…]$/.test(w)) k++;
  }
  const nPhrases = k + (/[,.?!…]$/.test(words[words.length - 1]) ? 0 : 1);
  const voEnd = st.voAt + st.voFrames;
  const beats = st.beats && st.beats.length === nPhrases ? st.beats : null;
  const span = (p: number): [number, number] =>
    beats ? [beats[p], p + 1 < beats.length ? Math.max(beats[p] + 10, beats[p + 1] - 8) : voEnd] : [st.voAt, voEnd];
  const lens = words.map((w) => w.length + 1);
  const o = tween(frame, [st.start, st.start + 6], [0, 1]) * tween(frame, [st.end - 6, st.end], [1, 0.25]);
  return (
    <div style={{position: 'absolute', left: 70, right: 70, top: 1400, textAlign: 'center', fontFamily: SANS, fontSize: 44, lineHeight: 1.45, fontWeight: 500, opacity: o}}>
      {words.map((w, i) => {
        const p = phraseOf[i];
        const group = words.map((_, j) => j).filter((j) => (beats ? phraseOf[j] === p : true));
        const before = group.filter((j) => j < i).reduce((n, j) => n + lens[j], 0);
        const all = group.reduce((n, j) => n + lens[j], 0);
        const [a, z] = span(p);
        const at = a + (before / all) * (z - a);
        const lit = tween(frame, [at - 2, at + 3], [0, 1]);
        return (
          <span key={i} style={{color: `rgba(244,244,245,${0.34 + 0.66 * lit})`, textShadow: lit > 0.5 ? '0 0 18px rgba(255,255,255,0.18)' : undefined}}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};

type Cue = {at: number; name: SfxName | 'chalk' | 'chalk-long' | 'tick-on'; volume?: number};

/** Sound cues: chalk on every hand-drawn line, light electronic ticks for the machine. */
const cues = (T: Timing): Cue[] => {
  const c: Cue[] = [];
  const chalk = (at: number, long = false, volume = 0.5) => c.push({at, name: long ? 'chalk-long' : 'chalk', volume});
  chalk(T.start('m01') + 2, true, 0.35);
  chalk(T.v('m01', 0.5), true);
  c.push({at: T.v('m01', 0.3), name: 'shimmer', volume: 0.22});
  [0, 1, 2].forEach((k) => c.push({at: T.b('m02', k, [0, 0.3, 0.58][k]), name: 'tick-on', volume: 0.5}));
  c.push({at: T.b('m02', 0, 0) + 36, name: 'pop', volume: 0.18});
  chalk(T.v('m02', 0.86));
  chalk(T.b('m03', 0, 0) + 2, true, 0.6);
  chalk(T.start('m04') + 2, true, 0.35);
  chalk(T.b('m04', 0, 0) + 14);
  chalk(T.b('m04', 1, 0.36) + 2, true, 0.4);
  c.push({at: T.b('m04', 2, 0.68), name: 'tick-on', volume: 0.45});
  c.push({at: T.b('m04', 2, 0.68) + 20, name: 'pop-high', volume: 0.2});
  chalk(T.start('m05') + 2, true, 0.3);
  c.push({at: T.b('m05', 2, 0.78), name: 'tick-on', volume: 0.45});
  c.push({at: T.step('m05').voAt + T.step('m05').voFrames - 4, name: 'shimmer', volume: 0.2});
  chalk(T.v('m06', 0.22), true, 0.6);
  chalk(T.b('m07', 0, 0) + (T.b('m07', 1, 0.46) - T.b('m07', 0, 0)) * 0.78);
  chalk(T.b('m07', 1, 0.46) + 2, false, 0.35);
  chalk(T.b('m07', 2, 0.66) + 2, true, 0.55);
  chalk(T.b('m08', 0, 0) + 10, true, 0.4);
  chalk(T.b('m08', 0, 0) + 44, true, 0.4);
  chalk(T.b('m08', 1, 0.55) + 6, true, 0.35);
  c.push({at: T.v('m08', 0.88), name: 'ding', volume: 0.22});
  chalk(T.start('m09') + 2, true, 0.35);
  chalk(T.b('m09', 1, 0.34) - 14);
  chalk(T.b('m09', 1, 0.34) + 6, true, 0.5);
  c.push({at: T.b('m09', 3, 0.78) + 4, name: 'shimmer', volume: 0.2});
  c.push({at: T.b('m10', 0, 0) - 6, name: 'shimmer', volume: 0.35});
  [0, 1, 2].forEach((i) => c.push({at: T.b('m10', 2, 0.55) + 26 + i * 7, name: 'success', volume: 0.16}));
  chalk(T.b('m10', 3, 0.77) - 2, true, 0.35);
  chalk(T.b('m11', 1, 0.48), true, 0.35);
  chalk(T.b('m12', 1, 0.48) + 26);
  c.push({at: T.start('m13'), name: 'shimmer', volume: 0.3});
  c.push({at: T.b('m13', 2, 0.45) + 4, name: 'pop', volume: 0.2});
  return c;
};

export const Manifesto: React.FC<{lang: Lang; music?: boolean; voiceover?: boolean}> = ({lang, music = true, voiceover = true}) => {
  const T = useMemo(() => new Timing(lang), [lang]);
  const sounds = useMemo(() => cues(T), [T]);
  const volume = (f: number) => {
    let v = MUSIC;
    if (voiceover && T.voDir) {
      for (const l of T.rows) {
        const ramp = interpolate(f, [l.voAt - 8, l.voAt, l.voAt + l.voFrames, l.voAt + l.voFrames + 10], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
        v = Math.min(v, MUSIC - (MUSIC - DUCKED) * ramp);
      }
    }
    return v;
  };
  return (
    <AbsoluteFill style={{background: '#0B100E'}}>
      <ChalkDefs />
      <Board T={T} />
      <S01 T={T} lang={lang} />
      <S02 T={T} lang={lang} />
      <S03 T={T} lang={lang} />
      <S04 T={T} lang={lang} />
      <S05 T={T} />
      <S06 T={T} lang={lang} />
      <S07 T={T} lang={lang} />
      <S08 T={T} lang={lang} />
      <S09 T={T} lang={lang} />
      <S10 T={T} lang={lang} />
      <S11 T={T} />
      <S12 T={T} lang={lang} />
      <S13 T={T} lang={lang} />
      <BrandBug T={T} />
      <Caption T={T} lang={lang} />
      {music ? <Audio src={staticFile(`audio/manifesto/music-${lang}.wav`)} volume={volume} /> : null}
      {voiceover && T.voDir
        ? T.rows.map((l) => (
            <Sequence key={l.id} from={l.voAt} layout="none" name={`vo-${l.id}`}>
              <Audio src={staticFile(`${T.voDir}/${l.id}.wav`)} volume={1} />
            </Sequence>
          ))
        : null}
      {sounds.map((s, i) =>
        s.name === 'chalk' || s.name === 'chalk-long' || s.name === 'tick-on' ? (
          <Sequence key={i} from={Math.round(s.at)} layout="none">
            <Audio src={staticFile(`audio/manifesto/${s.name}.wav`)} volume={(s.volume ?? 0.5) * 0.7} />
          </Sequence>
        ) : (
          <Sfx key={i} at={s.at} name={s.name} volume={s.volume ?? 0.4} />
        ),
      )}
      <Grain />
    </AbsoluteFill>
  );
};

export const manifestoDuration = (lang: Lang) => new Timing(lang).total;
