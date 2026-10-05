import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {easeInOut, tween} from '../anim';
import {AppShell} from '../components/AppShell';
import {Browser} from '../components/Browser';
import {camAt, Device} from '../components/Device';
import {GeneratingOrb} from '../components/Orb';
import {DocHeader, StudioForm} from '../components/Studio';
import {Breadcrumb, CheckItem, Kicker, SceneTitle, Sfx} from '../components/ui';
import {LessonPlanPaper, PAPER_W} from '../illustrations/Papers';
import {SANS} from '../theme';

const T = {class: 18, subject: 34, chapter: 50, generate: 66, orb: 70, doc: 98};
const CONTENT_W = 1440 - 72;

export const Scene03Lesson: React.FC = () => {
  const frame = useCurrentFrame();
  const cam = camAt(
    frame,
    [
      {f: 0, cam: {look: [520, 430], at: [1290, 560], scale: 0.62, ry: -24, rx: 3, opacity: 0}},
      {f: 18, cam: {look: [520, 430], at: [1250, 560], scale: 0.82, ry: -8, rx: 2}},
      {f: 66, cam: {look: [520, 440], at: [1250, 560], scale: 0.88, ry: -6, rx: 1}},
      {f: 96, cam: {look: [720, 455], at: [1258, 548], scale: 0.78, ry: -5, rx: 1}},
      {f: 210, cam: {look: [720, 470], at: [1262, 548], scale: 0.82, ry: -3, rx: 0}},
    ],
    easeInOut,
  );
  const formOut = tween(frame, [T.orb, T.orb + 8], [1, 0]);
  const orbIn = tween(frame, [T.orb, T.orb + 8], [0, 1]) * tween(frame, [T.doc - 4, T.doc + 4], [1, 0]);
  const docIn = tween(frame, [T.doc, T.doc + 8], [0, 1]);
  const scroll = tween(frame, [128, 205], [0, -330], easeInOut);

  return (
    <AbsoluteFill style={{fontFamily: SANS}}>
      <Device cam={cam}>
        <Browser url="aishikshamitra.com/studio">
          <AppShell active="studio" collapsed>
            {formOut > 0 ? (
              <div style={{position: 'absolute', inset: 0, opacity: formOut}}>
                <StudioForm
                  tab="Lesson Plan"
                  buttonLabel="Generate lesson plan"
                  generateAt={T.generate}
                  fields={[
                    {label: 'BOARD', placeholder: 'Select board', value: 'State Board', options: []},
                    {label: 'CLASS', placeholder: 'Select class', value: 'Class 8', options: ['Class 7', 'Class 8', 'Class 9'], tapAt: T.class},
                    {label: 'SUBJECT', placeholder: 'Select subject', value: 'Science', options: ['Mathematics', 'Science', 'English'], tapAt: T.subject},
                    {label: 'CHAPTER', placeholder: 'Select chapter', value: 'Light', options: ['Sound', 'Light', 'Force & Pressure'], tapAt: T.chapter},
                    {label: 'DURATION', placeholder: '', value: '40 minutes', options: []},
                    {label: 'LANGUAGE', placeholder: '', value: 'English', options: []},
                  ]}
                />
              </div>
            ) : null}
            {orbIn > 0 ? (
              <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: orbIn}}>
                <GeneratingOrb caption="Creating your lesson plan..." />
              </div>
            ) : null}
            {docIn > 0 ? (
              <div style={{position: 'absolute', inset: 0, opacity: docIn}}>
                <div style={{position: 'absolute', left: (CONTENT_W - PAPER_W) / 2, top: 30, zIndex: 2}}>
                  <DocHeader title="Light: Reflection & Mirrors" meta="State · Class 8 · Science · 40 min" />
                </div>
                <div style={{position: 'absolute', left: (CONTENT_W - PAPER_W) / 2, top: 168, transform: `translateY(${scroll}px)`}}>
                  <LessonPlanPaper at={T.doc + 6} />
                </div>
              </div>
            ) : null}
          </AppShell>
        </Browser>
      </Device>

      <div style={{position: 'absolute', left: 110, top: 250, width: 560}}>
        <Kicker at={2}>STUDIO · LESSON PLAN</Kicker>
        <SceneTitle text="Lesson Plans" at={6} size={94} style={{marginTop: 24}} />
        <Breadcrumb
          style={{marginTop: 30}}
          size={25}
          items={[
            {label: 'Class 8', at: T.class + 14},
            {label: 'Science', at: T.subject + 14},
            {label: 'Light', at: T.chapter + 14},
          ]}
        />
        <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 54}}>
          <CheckItem label="Structured" at={118} />
          <CheckItem label="Creative" at={138} />
          <CheckItem label="Classroom-ready" at={158} />
        </div>
      </div>

      <Sfx at={0} name="whoosh-soft" volume={0.35} />
      {[T.class, T.subject, T.chapter, T.generate].map((t) => (
        <Sfx key={t} at={t} name="tap" volume={0.5} />
      ))}
      <Sfx at={T.generate + 2} name="shimmer" volume={0.4} />
      <Sfx at={T.doc} name="whoosh" volume={0.35} />
      {[118, 138, 158].map((t) => (
        <Sfx key={t} at={t} name="pop-high" volume={0.22} />
      ))}
      <Sfx at={160} name="success" volume={0.35} />
    </AbsoluteFill>
  );
};
