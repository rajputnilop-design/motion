import {Clock} from 'lucide-react';
import React from 'react';
import {AbsoluteFill, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeIn, easeInOut, pop, tween} from '../anim';
import {MaskWords, Sfx} from '../components/ui';
import {C, FONT, gradientText, saffronGradient} from '../theme';
import timeline from '../timeline.json';

const FREEZE = timeline.cues.freeze.at;
const SWEEP = 178;

const KINDS = [
  {label: 'PDF', color: '#EF4444'},
  {label: 'DOC', color: '#3B82F6'},
  {label: 'PPT', color: '#F97316'},
  {label: 'NOTES', color: '#EAB308'},
  {label: 'XLS', color: '#16A34A'},
];

const TITLES = [
  'Lesson Plan – Ch 5',
  'Question Paper (Final)',
  'Science PPT',
  'Worksheet_v2',
  'Notes – Light',
  'Unit Test 2',
  'Homework Sheet',
  'Quiz Ideas',
  'Syllabus 2025-26',
  'Diagram Refs',
  'Marks Register',
  'Class 7 Notes',
  'Revision Sheet',
  'Rubric Draft',
  'Parent Circular',
  'Timetable',
  'Project Ideas',
  'Answer Key',
  'Lab Activity',
  'Chapter Summary',
];

const TABS = [
  'Lesson Plan – Ch 5',
  'Question Paper (Final)',
  'Science PPT – draft',
  'Worksheet_v2.docx',
  'Notes – Light.pdf',
  'diagram water cycle',
  'Unit Test 2',
  'Syllabus 2025-26',
  'Quiz ideas class 8',
  'Answer Key',
  'Marks Register',
  'Revision Sheet',
  'Project Ideas',
  'Rubric Draft',
  'Timetable',
  'Parent Circular',
  'Lab Activity',
  'Chapter Summary',
];

const STICKIES = ['Grade 120 copies!', 'PPT by Monday', 'Make unit test', 'Print worksheets'];

const N_DOCS = 44;

type Doc = {
  x: number;
  y: number;
  rot: number;
  spawn: number;
  kind: (typeof KINDS)[number];
  title: string;
  sticky?: string;
  scale: number;
};

const DOCS: Doc[] = new Array(N_DOCS).fill(0).map((_, i) => {
  const r = (k: string) => random(`doc-${i}-${k}`);
  let x = 0;
  let y = 0;
  // Keep the first wave of documents out of the central headline area.
  for (let attempt = 0; attempt < 20; attempt++) {
    x = -40 + r(`x${attempt}`) * 1800;
    y = 70 + r(`y${attempt}`) * 880;
    const inCenter = x > 380 && x < 1340 && y > 300 && y < 640;
    if (!inCenter || i > 26) break;
  }
  const isSticky = i % 9 === 4;
  return {
    x,
    y,
    rot: (r('rot') - 0.5) * 34,
    spawn: Math.round(6 + 148 * Math.pow(i / N_DOCS, 0.62)),
    kind: KINDS[Math.floor(r('kind') * KINDS.length)],
    title: TITLES[i % TITLES.length],
    sticky: isSticky ? STICKIES[Math.floor(i / 9) % STICKIES.length] : undefined,
    scale: 0.85 + r('s') * 0.3,
  };
});

const DocCard: React.FC<{doc: Doc}> = ({doc}) => {
  if (doc.sticky) {
    return (
      <div
        style={{
          width: 190,
          height: 170,
          background: 'linear-gradient(160deg, #FEF08A, #FDE047)',
          borderRadius: 6,
          boxShadow: '0 18px 30px -10px rgba(0,0,0,0.5)',
          padding: 20,
          fontFamily: FONT,
          fontWeight: 600,
          fontSize: 24,
          lineHeight: 1.25,
          color: '#713F12',
        }}
      >
        {doc.sticky}
      </div>
    );
  }
  return (
    <div
      style={{
        width: 200,
        height: 250,
        background: C.white,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 22px 40px -12px rgba(0,0,0,0.55)',
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          height: 44,
          background: doc.kind.color,
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
          color: C.white,
          fontWeight: 700,
          fontSize: 17,
          letterSpacing: '0.06em',
        }}
      >
        {doc.kind.label}
      </div>
      <div style={{padding: 16}}>
        <div style={{fontWeight: 600, fontSize: 16, color: C.ink, lineHeight: 1.25, height: 42}}>{doc.title}</div>
        {[0.95, 0.8, 0.9, 0.6, 0.85, 0.7].map((w, k) => (
          <div key={k} style={{height: 8, width: `${w * 100}%`, borderRadius: 4, background: C.slate200, marginTop: 12}} />
        ))}
      </div>
    </div>
  );
};

const formatTime = (minutes: number) => {
  const h24 = Math.floor(minutes / 60);
  const m = Math.floor(minutes % 60);
  const h = ((h24 + 11) % 12) + 1;
  return `${h}:${m.toString().padStart(2, '0')} ${h24 >= 12 ? 'PM' : 'AM'}`;
};

export const Scene01Problem: React.FC = () => {
  const realFrame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const frame = Math.min(realFrame, FREEZE); // everything in the workspace stops at the freeze
  const frozen = realFrame >= FREEZE;

  const sweep = tween(realFrame, [SWEEP, SWEEP + 20], [0, 1], easeIn);
  const zoom = 1 + tween(frame, [0, FREEZE], [0, 0.07], easeInOut);
  const shakeAmp = tween(frame, [100, FREEZE], [0, 7]);
  const glitch = realFrame >= FREEZE && realFrame < FREEZE + 7;
  const shakeX = Math.sin(frame * 2.3) * shakeAmp + (glitch ? (random(`g${realFrame}`) - 0.5) * 40 : 0);
  const shakeY = Math.cos(frame * 1.7) * shakeAmp * 0.6;
  const desat = tween(realFrame, [FREEZE, FREEZE + 5], [0, 1]);

  const tabCount = Math.min(TABS.length, Math.floor(Math.max(0, frame - 4) / 7) + 1);
  const tabWidth = Math.min(230, 1480 / tabCount);
  const minutes = tween(frame, [0, FREEZE], [18 * 60 + 5, 23 * 60 + 58], (t) => t);

  const textOut = tween(realFrame, [SWEEP - 4, SWEEP + 12], [0, 1], easeIn);

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <AbsoluteFill
        style={{
          transform: `translate(${shakeX}px, ${shakeY}px) scale(${zoom * (1 - sweep * 0.08)})`,
          filter: desat > 0 ? `grayscale(${desat * 0.9}) brightness(${1 - desat * 0.3})` : undefined,
          opacity: 1 - sweep,
        }}
      >
        {/* Browser window with ever-growing tab bar */}
        <div
          style={{
            position: 'absolute',
            left: 170,
            top: 120,
            width: 1580,
            height: 880,
            borderRadius: 22,
            background: '#161C47',
            border: '1.5px solid rgba(255,255,255,0.1)',
            boxShadow: '0 40px 90px -20px rgba(0,0,0,0.7)',
            overflow: 'hidden',
            opacity: tween(realFrame, [0, 10], [0, 1]),
            transform: `scale(${0.96 + 0.04 * pop(realFrame, fps, 0, 20)})`,
          }}
        >
          <div style={{height: 58, background: '#0E1336', display: 'flex', alignItems: 'flex-end', padding: '0 14px', gap: 4}}>
            <div style={{display: 'flex', gap: 8, alignSelf: 'center', marginRight: 14}}>
              {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                <div key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />
              ))}
            </div>
            {TABS.slice(0, tabCount).map((t, i) => (
              <div
                key={i}
                style={{
                  width: tabWidth - 4,
                  height: 42,
                  borderRadius: '10px 10px 0 0',
                  background: i === tabCount - 1 ? '#161C47' : '#1F2759',
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 14,
                  fontWeight: 500,
                  color: C.slate300,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                <div style={{minWidth: 12, height: 12, borderRadius: 3, background: KINDS[i % KINDS.length].color, marginRight: 8}} />
                <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>{t}</span>
              </div>
            ))}
          </div>
          <div style={{padding: '50px 160px'}}>
            <div style={{fontSize: 30, fontWeight: 700, color: 'rgba(203,213,225,0.55)'}}>Untitled document</div>
            {[0.7, 0.5].map((w, k) => (
              <div key={k} style={{height: 14, width: `${w * 100}%`, borderRadius: 7, background: 'rgba(255,255,255,0.08)', marginTop: 24}} />
            ))}
          </div>
        </div>

        {/* Documents piling up */}
        {DOCS.map((doc, i) => {
          if (frame < doc.spawn) return null;
          const p = pop(frame, fps, doc.spawn, 11, 170);
          const float = Math.sin((frame + i * 13) / 18) * 4;
          const dx = (doc.x + 100 - 960) * sweep * 1.4;
          const dy = (doc.y + 125 - 540) * sweep * 1.4;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: doc.x,
                top: doc.y,
                transform: `translate(${dx}px, ${dy + float}px) rotate(${doc.rot + (1 - p) * 25}deg) scale(${p * doc.scale})`,
              }}
            >
              <DocCard doc={doc} />
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Late-night clock */}
      <div
        style={{
          position: 'absolute',
          right: 60,
          top: 34,
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 26px',
          borderRadius: 999,
          background: 'rgba(10, 15, 46, 0.85)',
          border: '1.5px solid rgba(255,255,255,0.15)',
          color: C.white,
          fontWeight: 600,
          fontSize: 28,
          opacity: tween(realFrame, [6, 16], [0, 1]) * (1 - sweep),
          filter: desat > 0 ? `grayscale(${desat})` : undefined,
        }}
      >
        <Clock size={30} color={frozen ? C.slate400 : C.saffron} />
        {formatTime(minutes)}
      </div>

      {/* Frost / freeze vignette */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(186, 220, 255, 0.28) 100%)',
          opacity: desat * (1 - sweep),
        }}
      />
      {glitch ? (
        <AbsoluteFill>
          {[0, 1, 2, 3].map((k) => (
            <div
              key={k}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: random(`gy${realFrame}-${k}`) * 1000,
                height: 12 + random(`gh${realFrame}-${k}`) * 50,
                background: k % 2 ? 'rgba(56, 189, 248, 0.35)' : 'rgba(236, 72, 153, 0.35)',
                transform: `translateX(${(random(`gx${realFrame}-${k}`) - 0.5) * 120}px)`,
                mixBlendMode: 'screen',
              }}
            />
          ))}
        </AbsoluteFill>
      ) : null}

      {/* Headline */}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse 900px 380px at 50% 50%, rgba(5, 8, 24, 0.9) 0%, rgba(5, 8, 24, 0.75) 45%, transparent 100%)',
          opacity: tween(realFrame, [6, 20], [0, 1]) * (1 - textOut),
        }}
      />
      <AbsoluteFill
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          opacity: 1 - textOut,
          transform: `translateY(${-textOut * 40}px)`,
        }}
      >
        <MaskWords
          text="Teaching takes time."
          at={10}
          style={{fontSize: 104, fontWeight: 800, color: C.white, letterSpacing: '-0.025em', justifyContent: 'center'}}
        />
        <MaskWords
          text="Creating everything takes even more."
          at={64}
          stagger={4}
          style={{fontSize: 62, fontWeight: 700, marginTop: 18, letterSpacing: '-0.015em', justifyContent: 'center'}}
          wordStyle={() => ({...gradientText(saffronGradient)})}
        />
      </AbsoluteFill>

      {/* Sound design */}
      {DOCS.filter((_, i) => i % 3 === 0 && i < 36).map((d, i) => (
        <Sfx key={i} at={d.spawn} name={i % 2 ? 'pop' : 'pop-high'} volume={0.22 + i * 0.012} />
      ))}
      <Sfx at={10} name="whoosh-soft" volume={0.35} />
      <Sfx at={64} name="whoosh-soft" volume={0.35} />
      <Sfx at={FREEZE} name="glitch" volume={0.6} />
      <Sfx at={SWEEP} name="whoosh" volume={0.55} />
    </AbsoluteFill>
  );
};
