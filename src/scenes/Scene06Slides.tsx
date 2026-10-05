import {Play, Presentation} from 'lucide-react';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {caretVisible, easeInOut, pop, tween, typed} from '../anim';
import {GenerateButton, Kicker, MaskWords, Sfx, Skeleton, Tap} from '../components/ui';
import {InnerOuterSlide, PlanetsSlide, QuizSlide, SLIDE_H, SLIDE_W, SunSlide, TitleSlide} from '../illustrations/Slides';
import {C, cardShadow, FONT} from '../theme';

const TOPIC = 'The Solar System';
const T = {topic: 14, type: 22, create: 46, deck: 50};
const GEN_AT = [58, 64, 70, 76, 82];
const SHOW_AT = [58, 82, 106, 130, 154];
const QUIZ_REVEAL = 180;

const SLIDES: React.FC[] = [TitleSlide, SunSlide, PlanetsSlide, InnerOuterSlide, () => <QuizSlide revealAt={QUIZ_REVEAL} />];

const THUMB_W = 160;
const THUMB_SCALE = THUMB_W / SLIDE_W;

const DeckViewer: React.FC = () => {
  const frame = useCurrentFrame();
  const current = SHOW_AT.reduce((acc, s, i) => (frame >= s ? i : acc), 0);
  return (
    <div style={{width: 950, borderRadius: 28, background: '#F4F5FA', boxShadow: cardShadow, overflow: 'hidden', fontFamily: FONT}}>
      <div style={{height: 64, background: C.white, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px', borderBottom: '1px solid #E6E8F0'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div style={{width: 38, height: 38, borderRadius: 11, background: '#E0F4FD', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Presentation size={21} color="#0EA5E9" />
          </div>
          <span style={{fontSize: 21, fontWeight: 700, color: C.ink}}>{TOPIC}</span>
          <span style={{fontSize: 15, fontWeight: 600, color: C.slate500}}>
            · {Math.max(0, GEN_AT.filter((g) => frame >= g).length)} slides
          </span>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '9px 18px', borderRadius: 12, background: C.ink, color: C.white, fontSize: 16, fontWeight: 600}}>
          <Play size={16} fill={C.white} /> Present
        </div>
      </div>
      <div style={{position: 'relative', margin: '22px 25px 0', width: SLIDE_W, height: SLIDE_H, borderRadius: 16, overflow: 'hidden', background: '#E5E8F0', boxShadow: '0 10px 30px -10px rgba(15,23,42,0.35)'}}>
        {frame < SHOW_AT[0] ? <Skeleton w={SLIDE_W} h={SLIDE_H} r={0} /> : null}
        {SLIDES.map((S, i) => {
          const start = SHOW_AT[i];
          const next = SHOW_AT[i + 1] ?? 99999;
          if (frame < start || frame > next + 12) return null;
          const enterX = i === 0 ? 0 : (1 - tween(frame, [start, start + 12], [0, 1], easeInOut)) * SLIDE_W;
          const exitX = -tween(frame, [next, next + 12], [0, 1], easeInOut) * SLIDE_W * 0.35;
          const fadeIn = i === 0 ? tween(frame, [start, start + 8], [0, 1]) : 1;
          return (
            <div key={i} style={{position: 'absolute', inset: 0, transform: `translateX(${enterX + exitX}px)`, opacity: fadeIn, zIndex: i}}>
              <S />
            </div>
          );
        })}
      </div>
      <div style={{display: 'flex', gap: 18, margin: '20px 25px 24px'}}>
        {SLIDES.map((S, i) => {
          const ready = frame >= GEN_AT[i];
          const p = tween(frame, [GEN_AT[i], GEN_AT[i] + 6], [0, 1]);
          const active = i === current && frame >= SHOW_AT[0];
          return (
            <div
              key={i}
              style={{
                position: 'relative',
                width: THUMB_W,
                height: SLIDE_H * THUMB_SCALE,
                borderRadius: 10,
                overflow: 'hidden',
                boxShadow: active ? `0 0 0 3px ${C.indigo}` : '0 0 0 1px #DDE1EC',
              }}
            >
              <Skeleton w={THUMB_W} h={SLIDE_H * THUMB_SCALE} r={0} />
              {ready ? (
                <div style={{position: 'absolute', left: 0, top: 0, width: SLIDE_W, height: SLIDE_H, transform: `scale(${THUMB_SCALE})`, transformOrigin: '0 0', opacity: p}}>
                  <S />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Scene06Slides: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const shown = typed(TOPIC, frame, T.type, 0.9);
  const typing = frame >= T.type - 4 && frame < T.create;
  const deck = pop(frame, fps, T.deck, 17, 100);
  const pressed = frame >= T.create - 2 && frame <= T.create + 4 ? 1 : 0;
  const glow = tween(frame, [T.create, T.create + 6], [0, 1]) * tween(frame, [T.create + 10, T.create + 30], [1, 0]);
  const topicIn = pop(frame, fps, T.topic, 16, 120);

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 120, top: 190, width: 680}}>
        <div style={{opacity: tween(frame, [2, 12], [0, 1])}}>
          <Kicker>Slide Maker</Kicker>
        </div>
        <MaskWords text="Presentations" at={6} style={{fontSize: 88, fontWeight: 800, color: C.white, letterSpacing: '-0.03em', marginTop: 20}} />
        <MaskWords
          text="From topic to classroom-ready slides."
          at={14}
          stagger={2}
          style={{fontSize: 34, fontWeight: 500, color: C.slate300, marginTop: 10, width: 700}}
        />

        <div
          style={{
            position: 'relative',
            marginTop: 56,
            width: 600,
            borderRadius: 26,
            background: C.white,
            boxShadow: cardShadow,
            padding: 26,
            opacity: tween(frame, [T.topic, T.topic + 8], [0, 1]),
            transform: `translateY(${(1 - topicIn) * 40}px)`,
          }}
        >
          <div style={{fontSize: 15, fontWeight: 600, color: C.slate500, letterSpacing: '0.08em'}}>TOPIC</div>
          <div
            style={{
              marginTop: 8,
              height: 70,
              borderRadius: 16,
              border: `2px solid ${typing ? C.indigo : '#E3E6F0'}`,
              display: 'flex',
              alignItems: 'center',
              padding: '0 20px',
              fontSize: 32,
              fontWeight: 600,
              color: shown ? C.ink : C.slate400,
            }}
          >
            {shown || 'Enter a topic…'}
            {typing && caretVisible(frame) ? <span style={{color: C.indigo, fontWeight: 300}}>|</span> : null}
          </div>
          <div style={{display: 'flex', gap: 10, marginTop: 14}}>
            {['5 slides', 'Class 6', 'Quiz included'].map((c) => (
              <span key={c} style={{padding: '6px 14px', borderRadius: 999, fontSize: 15, fontWeight: 600, color: C.slate600, background: C.slate100}}>
                {c}
              </span>
            ))}
          </div>
          <GenerateButton label="Create Slides" pressed={pressed} glow={glow} style={{marginTop: 18, height: 60, fontSize: 19}} />
          <Tap x={300} y={238} at={T.create} />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: 850,
          top: 170,
          opacity: tween(frame, [T.deck, T.deck + 6], [0, 1]),
          transform: `translateX(${(1 - deck) * -260}px) scale(${0.6 + 0.4 * deck})`,
          transformOrigin: '0% 70%',
        }}
      >
        <DeckViewer />
      </div>

      <Sfx at={T.type} name="type" volume={0.35} frames={20} />
      <Sfx at={T.create} name="tap" volume={0.5} />
      <Sfx at={T.create + 2} name="shimmer" volume={0.4} />
      <Sfx at={T.deck} name="whoosh" volume={0.4} />
      {GEN_AT.map((g) => (
        <Sfx key={g} at={g} name="pop-high" volume={0.2} />
      ))}
      {SHOW_AT.slice(1).map((s) => (
        <Sfx key={s} at={s} name="swipe" volume={0.3} />
      ))}
      <Sfx at={QUIZ_REVEAL} name="success" volume={0.4} />
    </AbsoluteFill>
  );
};
