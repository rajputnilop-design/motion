import {Check} from 'lucide-react';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, pop, tween} from '../anim';
import {AppShell} from '../components/AppShell';
import {Browser} from '../components/Browser';
import {camAt, Device} from '../components/Device';
import {GeneratingOrb} from '../components/Orb';
import {DocHeader, StudioForm, Toast} from '../components/Studio';
import {Kicker, SceneTitle, Sfx, Tap} from '../components/ui';
import {MarathiPaper, PAPER_W} from '../illustrations/Papers';
import {C, DEVA, SANS, SERIF} from '../theme';

const T = {board: 12, class: 26, subject: 40, chapter: 54, level: 68, generate: 84, orb: 88, doc: 120, answers: 172, pdf: 200};
const CONTENT_W = 1440 - 72;
const COL_LEFT = (CONTENT_W - PAPER_W) / 2;

const Step: React.FC<{n: number; label: string; value: string; at: number; last?: boolean; deva?: boolean}> = ({n, label, value, at, last, deva}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const done = frame >= at;
  const p = pop(frame, fps, at, 12, 160);
  return (
    <div style={{display: 'flex', gap: 20, position: 'relative', height: last ? 66 : 86}}>
      {!last ? (
        <div style={{position: 'absolute', left: 20, top: 44, width: 2, height: 42, background: done ? C.purpleLight : 'rgba(255,255,255,0.12)'}} />
      ) : null}
      <div
        style={{
          width: 42,
          height: 42,
          minWidth: 42,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: done ? 'rgba(116,80,239,0.25)' : 'rgba(255,255,255,0.04)',
          border: `1.5px solid ${done ? 'rgba(139,108,246,0.8)' : 'rgba(255,255,255,0.15)'}`,
          color: done ? '#C4B5FD' : C.text3,
          fontWeight: 600,
          fontSize: 17,
          transform: `scale(${done ? 0.82 + 0.18 * p : 1})`,
        }}
      >
        {done ? <Check size={21} strokeWidth={3} /> : n}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.2}}>
        <span style={{fontSize: 15, fontWeight: 600, color: C.text3, letterSpacing: '0.16em'}}>{label}</span>
        <span style={{fontFamily: deva && done ? DEVA : SANS, fontSize: 28, fontWeight: 500, lineHeight: deva && done ? 1.45 : 1.2, color: done ? C.text : 'rgba(255,255,255,0.25)'}}>
          {done ? value : '—'}
        </span>
      </div>
    </div>
  );
};

export const Scene04Papers: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = camAt(
    frame,
    [
      {f: 0, cam: {look: [520, 440], at: [600, 560], scale: 0.62, ry: 24, rx: 3, opacity: 0}},
      {f: 18, cam: {look: [520, 440], at: [590, 560], scale: 0.84, ry: 8, rx: 2}},
      {f: 86, cam: {look: [520, 455], at: [590, 560], scale: 0.9, ry: 6, rx: 1}},
      {f: 118, cam: {look: [756, 460], at: [690, 548], scale: 0.8, ry: 5, rx: 1}},
      {f: 240, cam: {look: [756, 470], at: [690, 548], scale: 0.85, ry: 3, rx: 0}},
    ],
    easeInOut,
  );
  const formOut = tween(frame, [T.orb, T.orb + 8], [1, 0]);
  const orbIn = tween(frame, [T.orb, T.orb + 8], [0, 1]) * tween(frame, [T.doc - 4, T.doc + 4], [1, 0]);
  const docIn = tween(frame, [T.doc, T.doc + 8], [0, 1]);
  const scroll = tween(frame, [150, 232], [0, -430], easeInOut);
  const words = [
    {w: 'Create.', at: T.doc + 8},
    {w: 'Customize.', at: T.answers},
    {w: 'Download.', at: T.pdf},
  ];

  return (
    <AbsoluteFill style={{fontFamily: SANS}}>
      <Device cam={cam}>
        <Browser url="aishikshamitra.com/studio">
          <AppShell active="studio" collapsed>
            {formOut > 0 ? (
              <div style={{position: 'absolute', inset: 0, opacity: formOut}}>
                <StudioForm
                  tab="Question Paper"
                  buttonLabel="Generate question paper"
                  generateAt={T.generate}
                  difficultyAt={T.level}
                  fields={[
                    {label: 'BOARD', placeholder: 'Select board', value: 'State Board', options: ['CBSE', 'State Board', 'ICSE'], tapAt: T.board},
                    {label: 'CLASS', placeholder: 'Select class', value: 'Class 4', options: ['Class 3', 'Class 4', 'Class 5'], tapAt: T.class},
                    {label: 'SUBJECT', placeholder: 'Select subject', value: 'Marathi', options: ['English', 'Marathi', 'Mathematics'], tapAt: T.subject},
                    {label: 'CHAPTER', placeholder: 'Select chapter', value: 'विशेषण', options: ['नाम', 'सर्वनाम', 'विशेषण'], tapAt: T.chapter, deva: true},
                    {label: 'TOTAL MARKS', placeholder: '', value: '120', options: []},
                    {label: 'DURATION', placeholder: '', value: '90 minutes', options: []},
                  ]}
                />
              </div>
            ) : null}
            {orbIn > 0 ? (
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: orbIn}}>
                <GeneratingOrb caption="Creating your question paper..." />
              </div>
            ) : null}
            {docIn > 0 ? (
              <div style={{position: 'absolute', inset: 0, opacity: docIn}}>
                <div style={{position: 'absolute', left: COL_LEFT, top: 168, transform: `translateY(${scroll}px)`}}>
                  <MarathiPaper at={T.doc + 4} answersAt={T.answers + 2} />
                </div>
                <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 158, background: 'linear-gradient(to bottom, #09090B 85%, rgba(9,9,11,0))'}} />
                <div style={{position: 'absolute', left: COL_LEFT, top: 30}}>
                  <DocHeader
                    title="इयत्ता चौथी - मराठी (विशेषण विशेष)"
                    meta="State · Class 4 · Marathi · 120 marks · 90 min"
                    deva
                    answerKeyAt={T.answers}
                    pdfAt={T.pdf}
                  />
                </div>
                <Tap x={COL_LEFT + 84} y={116} at={T.answers} />
                <Tap x={COL_LEFT + 338} y={116} at={T.pdf} />
                <div style={{position: 'absolute', right: 36, bottom: 30}}>
                  <Toast at={T.pdf + 8}>
                    Saved <span style={{fontFamily: DEVA, fontWeight: 600}}>इयत्ता चौथी - मराठी.pdf</span>
                  </Toast>
                </div>
              </div>
            ) : null}
          </AppShell>
        </Browser>
      </Device>

      <div style={{position: 'absolute', left: 1400, top: 130, width: 470}}>
        <Kicker at={2}>STUDIO · QUESTION PAPER</Kicker>
        <SceneTitle text="Question Papers" at={6} size={88} style={{marginTop: 22, width: 460}} />
        <div style={{marginTop: 40}}>
          <Step n={1} label="CLASS" value="Class 4" at={T.class + 14} />
          <Step n={2} label="SUBJECT" value="Marathi" at={T.subject + 14} />
          <Step n={3} label="CHAPTER" value="विशेषण" at={T.chapter + 14} deva />
          <Step n={4} label="DIFFICULTY" value="Medium" at={T.level + 6} last />
        </div>
        <div style={{display: 'flex', gap: 14, marginTop: 34, fontFamily: SERIF, fontStyle: 'italic', fontSize: 34}}>
          {words.map(({w, at}) => {
            const on = tween(frame, [at, at + 8], [0, 1]);
            return (
              <span key={w} style={{color: on > 0.5 ? C.lavender : 'rgba(255,255,255,0.22)', transform: `translateY(${-4 * Math.sin(on * Math.PI)}px)`, display: 'inline-block'}}>
                {w}
              </span>
            );
          })}
        </div>
      </div>

      <Sfx at={0} name="whoosh-soft" volume={0.35} />
      {[T.board, T.class, T.subject, T.chapter, T.level, T.generate].map((t) => (
        <Sfx key={t} at={t} name="tap" volume={0.5} />
      ))}
      <Sfx at={T.generate + 2} name="shimmer" volume={0.4} />
      <Sfx at={T.doc} name="whoosh" volume={0.35} />
      {[0, 1, 2, 3].map((i) => (
        <Sfx key={i} at={T.doc + 22 + i * 8} name="swipe" volume={0.14} />
      ))}
      <Sfx at={T.answers} name="tap" volume={0.5} />
      <Sfx at={T.answers + 4} name="success" volume={0.3} />
      <Sfx at={T.pdf} name="tap" volume={0.5} />
      <Sfx at={T.pdf + 8} name="ding" volume={0.4} />
    </AbsoluteFill>
  );
};
