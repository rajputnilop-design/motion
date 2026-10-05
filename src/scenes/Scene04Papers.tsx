import {Check, ChevronLeft, Download, FileCheck, PenLine, RefreshCw, SlidersHorizontal} from 'lucide-react';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, pop, tween} from '../anim';
import {SelectField} from '../components/Form';
import {Phone} from '../components/Phone';
import {GenerateButton, Kicker, MaskWords, Sfx, Tap} from '../components/ui';
import {brandGradient, C, cardShadow, FONT} from '../theme';

const T = {class: 16, subject: 32, chapter: 48, level: 64, generate: 82, paper: 86, customize: 150, swap: 160, download: 176};
const Q_AT = [100, 107, 114, 124, 131, 141];
const DONE = T.download + 16;

const PAPER_LEFT = 560;
const PAPER_TOP = 96;

const Difficulty: React.FC<{tapAt: number}> = ({tapAt}) => {
  const frame = useCurrentFrame();
  const move = tween(frame, [tapAt, tapAt + 8], [0, 1], easeInOut);
  const labels = ['Easy', 'Medium', 'Hard'];
  const w = 336 / 3;
  return (
    <div style={{position: 'absolute', top: 320, left: 20, width: 336, opacity: tween(frame, [14, 22], [0, 1])}}>
      <div style={{fontSize: 13, fontWeight: 600, color: C.slate500, marginBottom: 6, letterSpacing: '0.02em'}}>DIFFICULTY</div>
      <div style={{position: 'relative', height: 50, borderRadius: 14, background: '#E9EBF3', padding: 4, display: 'flex'}}>
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: 4 + move * (w - 2),
            width: w - 4,
            height: 42,
            borderRadius: 11,
            background: frame >= tapAt ? brandGradient : C.white,
            boxShadow: '0 4px 10px rgba(15,23,42,0.15)',
          }}
        />
        {labels.map((l, i) => {
          const active = (i === 0 && move < 0.5) || (i === 1 && move >= 0.5);
          return (
            <div
              key={l}
              style={{
                position: 'relative',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: 600,
                color: active && frame >= tapAt ? C.white : active ? C.ink : C.slate500,
              }}
            >
              {l}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Question: React.FC<{at: number; n: number; marks: number; children: React.ReactNode; options?: string[]; highlight?: number}> = ({
  at,
  n,
  marks,
  children,
  options,
  highlight = 0,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, at, 16, 140);
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        gap: 10,
        marginTop: 10,
        padding: '8px 12px',
        marginLeft: -12,
        marginRight: -12,
        borderRadius: 12,
        background: `rgba(91, 91, 247, ${0.08 * highlight})`,
        boxShadow: `inset 0 0 0 ${2 * highlight}px rgba(91, 91, 247, ${highlight})`,
        opacity: tween(frame, [at, at + 6], [0, 1]),
        transform: `translateX(${(1 - p) * -60}px)`,
      }}
    >
      <span style={{fontWeight: 700, color: C.ink, minWidth: 30}}>Q{n}.</span>
      <div style={{flex: 1}}>
        <div style={{color: C.slate700}}>{children}</div>
        {options ? (
          <div style={{display: 'flex', gap: 22, marginTop: 4, color: C.slate600}}>
            {options.map((o, i) => (
              <span key={o}>
                ({'abcd'[i]}) {o}
              </span>
            ))}
          </div>
        ) : null}
      </div>
      <span style={{fontWeight: 600, color: C.slate500}}>[{marks}]</span>
    </div>
  );
};

const SectionTitle: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        marginTop: 16,
        padding: '7px 12px',
        borderRadius: 8,
        background: '#EEF0FF',
        color: C.indigoDeep,
        fontWeight: 700,
        fontSize: 14,
        letterSpacing: '0.03em',
        opacity: tween(frame, [at - 4, at + 2], [0, 1]),
      }}
    >
      {children}
    </div>
  );
};

const QuestionPaper: React.FC = () => {
  const frame = useCurrentFrame();
  const highlight = tween(frame, [T.customize, T.customize + 6], [0, 1]) * tween(frame, [T.swap + 10, T.swap + 18], [1, 0]);
  const swap = tween(frame, [T.swap - 3, T.swap + 5], [0, 1], easeInOut);
  return (
    <div
      style={{
        width: 680,
        height: 900,
        borderRadius: 18,
        background: '#FFFEFB',
        boxShadow: cardShadow,
        padding: '34px 44px',
        fontFamily: FONT,
        fontSize: 15.5,
        lineHeight: 1.45,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div style={{textAlign: 'center', opacity: tween(frame, [T.paper + 4, T.paper + 12], [0, 1])}}>
        <div style={{fontSize: 13, letterSpacing: '0.2em', color: C.slate500, fontWeight: 600}}>UNIT TEST · 2025–26</div>
        <div style={{fontSize: 32, fontWeight: 700, color: C.ink, marginTop: 4}}>Mathematics</div>
        <div style={{fontSize: 16, color: C.slate600, fontWeight: 500}}>Chapter 4 · Quadratic Equations</div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 14,
            padding: '9px 0',
            borderTop: `1.5px solid ${C.slate300}`,
            borderBottom: `1.5px solid ${C.slate300}`,
            fontWeight: 600,
            color: C.slate700,
            fontSize: 15,
          }}
        >
          <span>Class: X</span>
          <span>Time: 1 Hour</span>
          <span>Max. Marks: 40</span>
        </div>
      </div>
      <SectionTitle at={Q_AT[0]}>SECTION A · Multiple Choice Questions (1 mark each)</SectionTitle>
      <Question at={Q_AT[0]} n={1} marks={1} options={['2, 3', '−2, −3', '1, 6', '−1, −6']}>
        The roots of x² − 5x + 6 = 0 are:
      </Question>
      <Question at={Q_AT[1]} n={2} marks={1} options={['−8', '8', '40', '−40']}>
        The discriminant of 2x² − 4x + 3 = 0 is:
      </Question>
      <Question at={Q_AT[2]} n={3} marks={1} options={['1', '−1', '2', '3']}>
        If x = 2 is a root of x² + kx − 6 = 0, then k is:
      </Question>
      <SectionTitle at={Q_AT[3]}>SECTION B · Short Answer Questions (3 marks each)</SectionTitle>
      <Question at={Q_AT[3]} n={4} marks={3}>
        Solve 2x² + x − 6 = 0 by factorisation.
      </Question>
      <Question at={Q_AT[4]} n={5} marks={3} highlight={highlight}>
        <div style={{position: 'relative', height: 44}}>
          <div style={{position: 'absolute', opacity: 1 - swap, transform: `translateX(${-swap * 30}px)`}}>
            The product of two consecutive positive integers is 306. Find the integers.
          </div>
          <div style={{position: 'absolute', opacity: swap, transform: `translateX(${(1 - swap) * 30}px)`}}>
            Find two numbers whose sum is 27 and whose product is 182.
          </div>
        </div>
      </Question>
      <SectionTitle at={Q_AT[5]}>SECTION C · Long Answer Question (5 marks)</SectionTitle>
      <Question at={Q_AT[5]} n={6} marks={5}>
        A train travels 360 km at a uniform speed. Had the speed been 5 km/h more, it would have taken 1 hour less. Find
        the speed of the train.
      </Question>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: 120,
          background: 'linear-gradient(to bottom, rgba(255,254,251,0), #FFFEFB 70%)',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          paddingBottom: 18,
          fontSize: 13,
          color: C.slate400,
          fontWeight: 600,
        }}
      >
        Page 1 of 2
      </div>
    </div>
  );
};

const CustomizeToolbar: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, T.customize - 2, 14, 160);
  const out = tween(frame, [T.swap + 10, T.swap + 18], [1, 0]);
  const spin = tween(frame, [T.customize + 4, T.swap + 2], [0, 540], easeInOut);
  if (frame < T.customize - 2) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: PAPER_LEFT + 400,
        top: PAPER_TOP + 514,
        display: 'flex',
        gap: 6,
        padding: 6,
        borderRadius: 14,
        background: C.ink,
        boxShadow: '0 14px 30px -8px rgba(2,6,23,0.6)',
        transform: `scale(${p})`,
        opacity: out,
        fontFamily: FONT,
        zIndex: 5,
      }}
    >
      {[
        {t: 'Regenerate', Icon: RefreshCw, active: true},
        {t: 'Edit', Icon: PenLine},
        {t: '', Icon: SlidersHorizontal},
      ].map(({t, Icon, active}, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            padding: '8px 12px',
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            color: C.white,
            background: active ? brandGradient : 'rgba(255,255,255,0.08)',
          }}
        >
          <Icon size={16} style={active ? {transform: `rotate(${spin}deg)`} : undefined} />
          {t}
        </div>
      ))}
    </div>
  );
};

const DownloadButton: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const appear = pop(frame, fps, T.download - 22, 14, 140);
  const progress = tween(frame, [T.download + 2, DONE], [0, 1], easeInOut);
  const done = frame >= DONE;
  const press = frame >= T.download - 1 && frame <= T.download + 3 ? 0.94 : 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: PAPER_LEFT + 680 - 250,
        top: PAPER_TOP + 900 - 30,
        width: 270,
        height: 64,
        borderRadius: 18,
        overflow: 'hidden',
        background: done ? 'linear-gradient(135deg, #34D399, #16A34A)' : C.ink,
        boxShadow: '0 18px 36px -10px rgba(2,6,23,0.6)',
        transform: `scale(${appear * press})`,
        fontFamily: FONT,
        zIndex: 6,
      }}
    >
      {!done ? <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: `${progress * 100}%`, background: brandGradient}} /> : null}
      <div
        style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          color: C.white,
          fontWeight: 600,
          fontSize: 18,
        }}
      >
        {done ? <FileCheck size={22} /> : <Download size={22} />}
        {done ? 'Saved as PDF' : progress > 0 ? `Downloading… ${Math.round(progress * 100)}%` : 'Download PDF'}
      </div>
    </div>
  );
};

const Step: React.FC<{n: number; label: string; value: string; at: number; last?: boolean}> = ({n, label, value, at, last}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const done = frame >= at;
  const p = pop(frame, fps, at, 12, 160);
  return (
    <div style={{display: 'flex', gap: 20, position: 'relative', height: last ? 70 : 92}}>
      {!last ? (
        <div style={{position: 'absolute', left: 21, top: 46, width: 3, height: 46, background: done ? C.saffron : 'rgba(255,255,255,0.15)', borderRadius: 2}} />
      ) : null}
      <div
        style={{
          width: 45,
          height: 45,
          minWidth: 45,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: done ? 'linear-gradient(135deg, #FFC46B, #FF7A3D)' : 'rgba(255,255,255,0.08)',
          border: done ? 'none' : '2px solid rgba(255,255,255,0.2)',
          color: C.white,
          fontWeight: 700,
          fontSize: 20,
          transform: `scale(${done ? 0.8 + 0.2 * p : 1})`,
        }}
      >
        {done ? <Check size={24} strokeWidth={3.2} /> : n}
      </div>
      <div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.15}}>
        <span style={{fontSize: 20, fontWeight: 600, color: C.slate400, letterSpacing: '0.04em'}}>{label}</span>
        <span style={{fontSize: 30, fontWeight: 600, color: done ? C.white : 'rgba(255,255,255,0.3)'}}>{done ? value : '—'}</span>
      </div>
    </div>
  );
};

export const Scene04Papers: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const phoneIn = pop(frame, fps, 0, 18, 90);
  const paper = pop(frame, fps, T.paper, 16, 110);
  const pressed = frame >= T.generate - 2 && frame <= T.generate + 4 ? 1 : 0;
  const glow = tween(frame, [T.generate, T.generate + 6], [0, 1]) * tween(frame, [T.generate + 10, T.generate + 30], [1, 0]);
  const words = [
    {w: 'Create.', at: Q_AT[0]},
    {w: 'Customize.', at: T.customize},
    {w: 'Download.', at: T.download},
  ];

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      {/* Phone */}
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 128,
          transform: `translateY(${(1 - phoneIn) * 700}px) scale(${1 - paper * 0.04})`,
          opacity: tween(frame, [0, 6], [0, 1]) * (1 - paper * 0.12),
        }}
      >
        <Phone width={400}>
          <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', fontWeight: 700, fontSize: 19, color: C.ink}}>
            <ChevronLeft size={24} color={C.slate600} /> Question Paper
          </div>
          <SelectField top={56} label="CLASS" placeholder="Select class" value="Class 10" options={['Class 9', 'Class 10', 'Class 11']} tapAt={T.class} enterAt={4} />
          <SelectField top={144} label="SUBJECT" placeholder="Select subject" value="Mathematics" options={['Science', 'Mathematics', 'English']} tapAt={T.subject} enterAt={7} />
          <SelectField
            top={232}
            label="CHAPTER"
            placeholder="Select chapter"
            value="Quadratic Equations"
            options={['Polynomials', 'Quadratic Equations', 'Triangles']}
            tapAt={T.chapter}
            enterAt={10}
          />
          <Difficulty tapAt={T.level} />
          <div style={{position: 'absolute', left: 20, right: 20, top: 412, display: 'flex', gap: 12, opacity: tween(frame, [16, 24], [0, 1])}}>
            {[
              {l: 'QUESTIONS', v: '12'},
              {l: 'TOTAL MARKS', v: '40'},
            ].map((b) => (
              <div key={b.l} style={{flex: 1}}>
                <div style={{fontSize: 13, fontWeight: 600, color: C.slate500, marginBottom: 6}}>{b.l}</div>
                <div style={{height: 50, borderRadius: 14, background: C.white, border: '2px solid #E3E6F0', display: 'flex', alignItems: 'center', padding: '0 14px', fontWeight: 600, fontSize: 16, color: C.ink}}>
                  {b.v}
                </div>
              </div>
            ))}
          </div>
          <div style={{position: 'absolute', left: 20, right: 20, top: 506}}>
            <GenerateButton label={frame >= T.paper + 4 ? 'Paper generated' : 'Generate Paper'} pressed={pressed} glow={glow} />
          </div>
          <Tap x={188} y={101} at={T.class} />
          <Tap x={188} y={189} at={T.subject} />
          <Tap x={188} y={277} at={T.chapter} />
          <Tap x={188} y={365} at={T.level} />
          <Tap x={188} y={533} at={T.generate} />
        </Phone>
      </div>

      {/* Question paper */}
      <div
        style={{
          position: 'absolute',
          left: PAPER_LEFT,
          top: PAPER_TOP,
          opacity: tween(frame, [T.paper, T.paper + 6], [0, 1]),
          transform: `translateX(${(1 - paper) * -300}px) scale(${0.5 + 0.5 * paper}) rotate(${(1 - paper) * -6}deg)`,
          transformOrigin: '0% 50%',
        }}
      >
        <QuestionPaper />
      </div>
      <CustomizeToolbar />
      <DownloadButton />
      <div style={{position: 'absolute', left: PAPER_LEFT + 470, top: PAPER_TOP + 538, width: 0, height: 0}}>
        <Tap x={0} y={0} at={T.customize} />
      </div>
      <div style={{position: 'absolute', left: PAPER_LEFT + 560, top: PAPER_TOP + 902, width: 0, height: 0}}>
        <Tap x={0} y={0} at={T.download} />
      </div>

      {/* Right: on-screen text */}
      <div style={{position: 'absolute', left: 1320, top: 110, width: 540}}>
        <div style={{opacity: tween(frame, [4, 14], [0, 1])}}>
          <Kicker>Paper Generator</Kicker>
        </div>
        <MaskWords
          text="Question Papers"
          at={8}
          style={{fontSize: 92, fontWeight: 800, color: C.white, letterSpacing: '-0.03em', marginTop: 18, lineHeight: 1.02, width: 520}}
        />
        <div style={{marginTop: 34}}>
          <Step n={1} label="CLASS" value="Class 10" at={T.class + 14} />
          <Step n={2} label="SUBJECT" value="Mathematics" at={T.subject + 14} />
          <Step n={3} label="CHAPTER" value="Quadratic Equations" at={T.chapter + 14} />
          <Step n={4} label="DIFFICULTY" value="Medium" at={T.level + 6} last />
        </div>
        <div style={{display: 'flex', gap: 12, marginTop: 30, fontSize: 33, fontWeight: 700, fontStyle: 'italic'}}>
          {words.map(({w, at}) => {
            const on = tween(frame, [at, at + 8], [0, 1]);
            return (
              <span
                key={w}
                style={{
                  color: on > 0.5 ? C.saffronLight : 'rgba(255,255,255,0.28)',
                  transform: `scale(${1 + 0.08 * Math.sin(on * Math.PI)})`,
                  display: 'inline-block',
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      </div>

      {[T.class, T.subject, T.chapter, T.level, T.generate].map((t) => (
        <Sfx key={t} at={t} name="tap" volume={0.5} />
      ))}
      <Sfx at={T.generate + 2} name="shimmer" volume={0.4} />
      <Sfx at={T.paper} name="whoosh" volume={0.4} />
      {Q_AT.map((q) => (
        <Sfx key={q} at={q} name="swipe" volume={0.16} />
      ))}
      <Sfx at={T.customize} name="tap" volume={0.5} />
      <Sfx at={T.swap} name="pop-high" volume={0.3} />
      <Sfx at={T.download} name="tap" volume={0.5} />
      <Sfx at={DONE} name="ding" volume={0.45} />
    </AbsoluteFill>
  );
};
