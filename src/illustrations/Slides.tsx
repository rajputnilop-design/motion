import {CircleCheck} from 'lucide-react';
import React from 'react';
import {random, useCurrentFrame} from 'remotion';
import {tween} from '../anim';
import {C, SANS as FONT} from '../theme';

// Slides are designed at 900x506 and scaled down for thumbnails.
export const SLIDE_W = 900;
export const SLIDE_H = 506;

const PLANETS = [
  {name: 'Mercury', r: 10, color: '#A8A29E'},
  {name: 'Venus', r: 16, color: '#E8B86D'},
  {name: 'Earth', r: 17, color: '#3B82F6', land: '#22C55E'},
  {name: 'Mars', r: 12, color: '#DC5A3C'},
  {name: 'Jupiter', r: 44, color: '#D9A066', stripes: true},
  {name: 'Saturn', r: 34, color: '#E8CF8F', ring: true},
  {name: 'Uranus', r: 24, color: '#7DD3FC'},
  {name: 'Neptune', r: 23, color: '#3B6FF6'},
];

const Planet: React.FC<{p: (typeof PLANETS)[number]; cx: number; cy: number; scale?: number}> = ({p, cx, cy, scale = 1}) => {
  const r = p.r * scale;
  return (
    <g>
      {p.ring ? <ellipse cx={cx} cy={cy} rx={r * 1.9} ry={r * 0.45} fill="none" stroke="#C9A96E" strokeWidth={r * 0.18} /> : null}
      <circle cx={cx} cy={cy} r={r} fill={p.color} />
      {p.stripes ? (
        <>
          <rect x={cx - r} y={cy - r * 0.35} width={r * 2} height={r * 0.18} fill="#B7794A" opacity="0.7" />
          <rect x={cx - r} y={cy + r * 0.2} width={r * 2} height={r * 0.14} fill="#B7794A" opacity="0.6" />
          <ellipse cx={cx + r * 0.35} cy={cy + r * 0.35} rx={r * 0.22} ry={r * 0.12} fill="#C2410C" opacity="0.8" />
        </>
      ) : null}
      {p.land ? <path d={`M ${cx - r * 0.6} ${cy - r * 0.2} q ${r * 0.4} ${-r * 0.6} ${r * 0.8} ${-r * 0.1} q ${-r * 0.2} ${r * 0.6} ${-r * 0.8} ${r * 0.1} z`} fill={p.land} /> : null}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="2" />
      {p.ring ? (
        <path d={`M ${cx - r * 1.9} ${cy} A ${r * 1.9} ${r * 0.45} 0 0 0 ${cx + r * 1.9} ${cy}`} fill="none" stroke="#C9A96E" strokeWidth={r * 0.18} />
      ) : null}
    </g>
  );
};

const Frame: React.FC<{bg: string; children: React.ReactNode}> = ({bg, children}) => (
  <div style={{position: 'relative', width: SLIDE_W, height: SLIDE_H, background: bg, overflow: 'hidden', fontFamily: FONT}}>{children}</div>
);

const SlideNumber: React.FC<{n: number; dark?: boolean}> = ({n, dark}) => (
  <div style={{position: 'absolute', right: 28, bottom: 20, fontSize: 16, fontWeight: 600, color: dark ? 'rgba(255,255,255,0.5)' : C.slate400}}>
    {n} / 5
  </div>
);

export const TitleSlide: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Frame bg="radial-gradient(ellipse at 20% 50%, #2A1F6B 0%, #0B1026 70%)">
      <svg width={SLIDE_W} height={SLIDE_H} style={{position: 'absolute', inset: 0}}>
        {new Array(40).fill(0).map((_, i) => (
          <circle key={i} cx={random(`sx${i}`) * SLIDE_W} cy={random(`sy${i}`) * SLIDE_H} r={0.8 + random(`sr${i}`) * 1.6} fill="#fff" opacity={0.3 + random(`so${i}`) * 0.6} />
        ))}
        <defs>
          <radialGradient id="ts-sun">
            <stop offset="0" stopColor="#FFF4C2" />
            <stop offset="0.5" stopColor="#FFB020" />
            <stop offset="1" stopColor="#FF7A1A" />
          </radialGradient>
        </defs>
        <circle cx="-40" cy="253" r="170" fill="#FF9933" opacity="0.18" />
        <circle cx="-40" cy="253" r="130" fill="url(#ts-sun)" />
        {[200, 270, 340].map((rx, i) => {
          const th = frame / (25 + i * 12) + i * 1.7;
          const p = PLANETS[[2, 3, 4][i]];
          return (
            <g key={rx}>
              <ellipse cx="-40" cy="253" rx={rx} ry={rx * 0.62} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
              <Planet p={p} cx={-40 + rx * Math.cos(th)} cy={253 + rx * 0.62 * Math.sin(th)} scale={i === 2 ? 0.55 : 1} />
            </g>
          );
        })}
      </svg>
      <div style={{position: 'absolute', left: 380, top: 150}}>
        <div style={{display: 'inline-block', padding: '6px 16px', borderRadius: 999, background: 'rgba(255,153,51,0.18)', color: '#FFB65C', fontWeight: 600, fontSize: 18}}>
          Class 6 · Science
        </div>
        <div style={{fontSize: 66, fontWeight: 800, color: C.white, lineHeight: 1.05, marginTop: 16, letterSpacing: '-0.02em'}}>
          The Solar
          <br />
          System
        </div>
        <div style={{fontSize: 24, color: C.slate300, marginTop: 14, fontWeight: 500}}>Our home in space</div>
      </div>
      <SlideNumber n={1} dark />
    </Frame>
  );
};

export const SunSlide: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <Frame bg="linear-gradient(135deg, #FFF8EB 0%, #FFEFD6 100%)">
      <svg width="360" height="506" style={{position: 'absolute', left: 0, top: 0}}>
        <defs>
          <radialGradient id="ss-sun">
            <stop offset="0" stopColor="#FFF4C2" />
            <stop offset="0.55" stopColor="#FFB020" />
            <stop offset="1" stopColor="#FF6B1A" />
          </radialGradient>
        </defs>
        <g transform={`translate(180 253) rotate(${frame * 0.5})`}>
          {new Array(16).fill(0).map((_, i) => (
            <line key={i} x1="0" y1="-150" x2="0" y2="-178" stroke="#FFB020" strokeWidth="9" strokeLinecap="round" transform={`rotate(${i * 22.5})`} />
          ))}
        </g>
        <circle cx="180" cy="253" r="132" fill="url(#ss-sun)" />
      </svg>
      <div style={{position: 'absolute', left: 390, top: 92, right: 40}}>
        <div style={{fontSize: 52, fontWeight: 800, color: C.ink, letterSpacing: '-0.02em'}}>Our Sun</div>
        {['A star at the centre of our Solar System', 'Gives Earth its light and heat', 'Sunlight reaches Earth in about 8 minutes'].map((b, i) => (
          <div key={b} style={{display: 'flex', gap: 14, marginTop: i ? 18 : 22, fontSize: 25, lineHeight: 1.35, fontWeight: 500, color: C.slate700}}>
            <div style={{width: 12, height: 12, minWidth: 12, borderRadius: 6, background: '#FF9933', marginTop: 12}} />
            {b}
          </div>
        ))}
      </div>
      <SlideNumber n={2} />
    </Frame>
  );
};

export const PlanetsSlide: React.FC = () => {
  const xs = [60, 120, 186, 246, 340, 478, 600, 690];
  return (
    <Frame bg="linear-gradient(180deg, #F5F7FF 0%, #E9EDFF 100%)">
      <div style={{position: 'absolute', left: 50, top: 40, fontSize: 46, fontWeight: 800, color: C.ink, letterSpacing: '-0.02em'}}>The 8 Planets</div>
      <div style={{position: 'absolute', left: 52, top: 104, fontSize: 20, color: C.slate500, fontWeight: 500}}>In order from the Sun (sizes not to scale)</div>
      <svg width={SLIDE_W} height={SLIDE_H} style={{position: 'absolute', inset: 0}}>
        <line x1="30" y1="290" x2="870" y2="290" stroke="#C7CCE8" strokeWidth="2" strokeDasharray="6 8" />
        {PLANETS.map((p, i) => (
          <g key={p.name}>
            <Planet p={p} cx={xs[i] + 40} cy={290} scale={1.25} />
            <text x={xs[i] + 40} y={385} textAnchor="middle" fontFamily="Inter" fontWeight="600" fontSize="17" fill="#334155">
              {p.name}
            </text>
          </g>
        ))}
      </svg>
      <SlideNumber n={3} />
    </Frame>
  );
};

export const InnerOuterSlide: React.FC = () => (
  <Frame bg="#FFFFFF">
    <div style={{position: 'absolute', left: 50, top: 40, fontSize: 44, fontWeight: 800, color: C.ink, letterSpacing: '-0.02em'}}>Inner vs Outer Planets</div>
    {[
      {title: 'Inner Planets', sub: 'Small & rocky', color: '#DC5A3C', bg: '#FFF1EC', planets: PLANETS.slice(0, 4)},
      {title: 'Outer Planets', sub: 'Giant & gassy', color: '#3B6FF6', bg: '#EEF3FF', planets: PLANETS.slice(4)},
    ].map((col, i) => (
      <div key={col.title} style={{position: 'absolute', left: 50 + i * 410, top: 128, width: 390, height: 320, borderRadius: 24, background: col.bg, padding: 28}}>
        <div style={{fontSize: 30, fontWeight: 700, color: col.color}}>{col.title}</div>
        <div style={{fontSize: 19, fontWeight: 500, color: C.slate600}}>{col.sub}</div>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 22}}>
          {col.planets.map((p) => (
            <div key={p.name} style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 21, fontWeight: 600, color: C.slate700}}>
              <div style={{width: 26, height: 26, borderRadius: 13, background: p.color}} />
              {p.name}
            </div>
          ))}
        </div>
      </div>
    ))}
    <SlideNumber n={4} />
  </Frame>
);

export const QuizSlide: React.FC<{revealAt?: number}> = ({revealAt = 99999}) => {
  const frame = useCurrentFrame();
  const reveal = tween(frame, [revealAt, revealAt + 8], [0, 1]);
  return (
    <Frame bg="linear-gradient(135deg, #5B5BF7 0%, #8B5CF6 100%)">
      <div style={{position: 'absolute', left: 50, top: 42, fontSize: 20, fontWeight: 700, letterSpacing: '0.16em', color: '#FFD9A8'}}>QUICK QUIZ</div>
      <div style={{position: 'absolute', left: 50, top: 78, fontSize: 46, fontWeight: 800, color: C.white, letterSpacing: '-0.02em'}}>
        Which is the largest planet?
      </div>
      <div style={{position: 'absolute', left: 50, top: 190, width: 800, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18}}>
        {['Earth', 'Jupiter', 'Mars', 'Venus'].map((o, i) => {
          const correct = i === 1;
          return (
            <div
              key={o}
              style={{
                height: 100,
                borderRadius: 20,
                background: correct && reveal > 0 ? `rgba(34,197,94,${0.25 + 0.75 * reveal})` : 'rgba(255,255,255,0.14)',
                border: '2px solid rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: 18,
                padding: '0 24px',
                fontSize: 30,
                fontWeight: 600,
                color: C.white,
              }}
            >
              <div style={{width: 46, height: 46, borderRadius: 14, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24}}>
                {'ABCD'[i]}
              </div>
              {o}
              {correct && reveal > 0.5 ? <CircleCheck size={34} style={{marginLeft: 'auto'}} /> : null}
            </div>
          );
        })}
      </div>
      <SlideNumber n={5} dark />
    </Frame>
  );
};
