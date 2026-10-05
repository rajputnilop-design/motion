import {ArrowLeft, Download, Play} from 'lucide-react';
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {easeInOut, tween} from '../anim';
import {AppShell} from '../components/AppShell';
import {Browser} from '../components/Browser';
import {camAt, Device} from '../components/Device';
import {GeneratingOrb} from '../components/Orb';
import {StudioForm} from '../components/Studio';
import {Kicker, SceneTitle, Sfx, Skeleton} from '../components/ui';
import {InnerOuterSlide, PlanetsSlide, QuizSlide, SLIDE_H, SLIDE_W, SunSlide, TitleSlide} from '../illustrations/Slides';
import {C, SANS, SERIF} from '../theme';

const T = {type: 14, generate: 46, orb: 50, deck: 74};
const GEN_AT = [76, 82, 88, 94, 100];
const SHOW_AT = [76, 102, 126, 150, 174];
const QUIZ_REVEAL = 190;
const CONTENT_W = 1440 - 72;
const THUMB_W = 160;
const THUMB_SCALE = THUMB_W / SLIDE_W;

const SLIDES: React.FC[] = [TitleSlide, SunSlide, PlanetsSlide, InnerOuterSlide, () => <QuizSlide revealAt={QUIZ_REVEAL} />];

const Deck: React.FC = () => {
  const frame = useCurrentFrame();
  const current = SHOW_AT.reduce((acc, s, i) => (frame >= s ? i : acc), 0);
  const count = GEN_AT.filter((g) => frame >= g).length;
  const left = (CONTENT_W - SLIDE_W) / 2;
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS}}>
      <div style={{position: 'absolute', left, top: 26, right: left, display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{width: 44, height: 44, borderRadius: 12, background: C.panel, border: '1px solid #2D2D2F', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <ArrowLeft size={18} color="#A1A1AA" />
        </div>
        <div>
          <div style={{fontSize: 20, fontWeight: 600, color: C.text}}>The Solar System</div>
          <div style={{fontSize: 13, color: '#8A8597', marginTop: 2}}>State · Class 6 · Science · {count} slides</div>
        </div>
        <div style={{flex: 1}} />
        <div style={{height: 42, padding: '0 18px', borderRadius: 21, display: 'flex', alignItems: 'center', gap: 8, border: '1px solid #2D2D2F', background: C.panel, color: C.text, fontSize: 15}}>
          <Download size={16} /> Download
        </div>
        <div style={{height: 42, padding: '0 20px', borderRadius: 21, display: 'flex', alignItems: 'center', gap: 8, background: '#7A52F0', color: C.white, fontSize: 15, fontWeight: 600}}>
          <Play size={15} fill={C.white} /> Present
        </div>
      </div>
      <div style={{position: 'absolute', left, top: 100, width: SLIDE_W, height: SLIDE_H, borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 50px -12px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.08)'}}>
        {frame < SHOW_AT[0] ? <Skeleton w={SLIDE_W} h={SLIDE_H} r={0} dark /> : null}
        {SLIDES.map((S, i) => {
          const start = SHOW_AT[i];
          const next = SHOW_AT[i + 1] ?? 99999;
          if (frame < start || frame > next + 12) return null;
          const enterX = i === 0 ? 0 : (1 - tween(frame, [start, start + 12], [0, 1], easeInOut)) * SLIDE_W;
          const exitX = -tween(frame, [next, next + 12], [0, 1], easeInOut) * SLIDE_W * 0.35;
          return (
            <div key={i} style={{position: 'absolute', inset: 0, transform: `translateX(${enterX + exitX}px)`, opacity: i === 0 ? tween(frame, [start, start + 8], [0, 1]) : 1, zIndex: i}}>
              <S />
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', left: (CONTENT_W - (THUMB_W * 5 + 16 * 4)) / 2, top: 100 + SLIDE_H + 26, display: 'flex', gap: 16}}>
        {SLIDES.map((S, i) => {
          const ready = frame >= GEN_AT[i];
          const active = i === current && frame >= SHOW_AT[0];
          return (
            <div key={i} style={{position: 'relative', width: THUMB_W, height: SLIDE_H * THUMB_SCALE, borderRadius: 10, overflow: 'hidden', boxShadow: active ? '0 0 0 3px #8B6CF6' : '0 0 0 1px #2A2A2E'}}>
              <Skeleton w={THUMB_W} h={SLIDE_H * THUMB_SCALE} r={0} dark />
              {ready ? (
                <div style={{position: 'absolute', left: 0, top: 0, width: SLIDE_W, height: SLIDE_H, transform: `scale(${THUMB_SCALE})`, transformOrigin: '0 0', opacity: tween(frame, [GEN_AT[i], GEN_AT[i] + 6], [0, 1])}}>
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
  const cam = camAt(
    frame,
    [
      {f: 0, cam: {look: [520, 360], at: [1290, 540], scale: 0.62, ry: -24, rx: 3, opacity: 0}},
      {f: 18, cam: {look: [520, 360], at: [1250, 540], scale: 0.86, ry: -8, rx: 2}},
      {f: 48, cam: {look: [520, 370], at: [1250, 540], scale: 0.9, ry: -6, rx: 1}},
      {f: 74, cam: {look: [720, 430], at: [1262, 540], scale: 0.78, ry: -5, rx: 1}},
      {f: 210, cam: {look: [720, 440], at: [1266, 540], scale: 0.82, ry: -3, rx: 0}},
    ],
    easeInOut,
  );
  const formOut = tween(frame, [T.orb, T.orb + 8], [1, 0]);
  const orbIn = tween(frame, [T.orb, T.orb + 8], [0, 1]) * tween(frame, [T.deck - 4, T.deck + 4], [1, 0]);
  const deckIn = tween(frame, [T.deck, T.deck + 8], [0, 1]);

  return (
    <AbsoluteFill style={{fontFamily: SANS}}>
      <Device cam={cam}>
        <Browser url="aishikshamitra.com/studio">
          <AppShell active="studio" collapsed>
            {formOut > 0 ? (
              <div style={{position: 'absolute', inset: 0, opacity: formOut}}>
                <StudioForm
                  tab="Presentation"
                  buttonLabel="Create slides"
                  generateAt={T.generate}
                  topic={{text: 'The Solar System', typeAt: T.type}}
                  fields={[
                    {label: 'CLASS', placeholder: '', value: 'Class 6', options: []},
                    {label: 'SUBJECT', placeholder: '', value: 'Science', options: []},
                    {label: 'SLIDES', placeholder: '', value: '5 slides + quiz', options: []},
                    {label: 'LANGUAGE', placeholder: '', value: 'English', options: []},
                  ]}
                />
              </div>
            ) : null}
            {orbIn > 0 ? (
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: orbIn}}>
                <GeneratingOrb caption="Creating your presentation..." />
              </div>
            ) : null}
            {deckIn > 0 ? (
              <div style={{position: 'absolute', inset: 0, opacity: deckIn}}>
                <Deck />
              </div>
            ) : null}
          </AppShell>
        </Browser>
      </Device>

      <div style={{position: 'absolute', left: 110, top: 300, width: 560}}>
        <Kicker at={2}>STUDIO · PRESENTATION</Kicker>
        <SceneTitle text="Presentations" at={6} size={86} style={{marginTop: 24}} />
        <div
          style={{
            marginTop: 22,
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontSize: 40,
            lineHeight: 1.3,
            color: C.lavender,
            opacity: tween(frame, [16, 28], [0, 1]),
            transform: `translateY(${tween(frame, [16, 32], [20, 0])}px)`,
          }}
        >
          From topic to
          <br />
          classroom-ready slides.
        </div>
      </div>

      <Sfx at={0} name="whoosh-soft" volume={0.35} />
      <Sfx at={T.type} name="type" volume={0.3} frames={20} />
      <Sfx at={T.generate} name="tap" volume={0.5} />
      <Sfx at={T.generate + 2} name="shimmer" volume={0.4} />
      <Sfx at={T.deck} name="whoosh" volume={0.35} />
      {GEN_AT.map((g) => (
        <Sfx key={g} at={g} name="pop-high" volume={0.18} />
      ))}
      {SHOW_AT.slice(1).map((s) => (
        <Sfx key={s} at={s} name="swipe" volume={0.28} />
      ))}
      <Sfx at={QUIZ_REVEAL} name="success" volume={0.35} />
    </AbsoluteFill>
  );
};
