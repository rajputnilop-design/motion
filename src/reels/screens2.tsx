import {ArrowLeft, ArrowRight, Bell, CircleCheck, Copy, FileDown, FileText, KeyRound, Minus, Plus, Search, Send, Sparkles, Users, X} from 'lucide-react';
import React from 'react';
import {Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, tween} from '../anim';
import {Tap} from '../components/ui';
import {C, MONO, SANS, SERIF} from '../theme';
import {BackTitle, Chip, CONTENT_H, FieldLabel, PrimaryButton, SCREEN_W, SelectBox} from './mobile';

const reveal = (frame: number, at: number): React.CSSProperties => ({
  opacity: tween(frame, [at, at + 8], [0, 1]),
  transform: `translateY(${tween(frame, [at, at + 12], [12, 0])}px)`,
});

/** Lock screen late at night, with the test reminder nobody wants to see. */
export const LockScreenM: React.FC<{tickAt: number}> = ({tickAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = pop(frame, fps, 14, 13, 150);
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 50% 18%, #2A2160 0%, #120F2E 45%, #060608 100%)',
        fontFamily: SANS,
      }}
    >
      <div style={{position: 'absolute', top: 36, left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.75)', fontSize: 15, fontWeight: 500}}>
        Sunday
      </div>
      <div
        style={{
          position: 'absolute',
          top: 54,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: C.white,
          fontSize: 92,
          fontWeight: 300,
          letterSpacing: '-0.03em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {frame < tickAt ? '11:58' : '11:59'}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 14,
          right: 14,
          top: 214,
          borderRadius: 18,
          padding: '12px 14px',
          background: 'rgba(40,38,58,0.78)',
          border: '1px solid rgba(255,255,255,0.08)',
          opacity: Math.min(1, n * 1.4),
          transform: `translateY(${(1 - n) * -30}px) scale(${0.9 + 0.1 * n})`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.6)'}}>
          <div style={{width: 20, height: 20, borderRadius: 6, background: '#F59E0B', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Bell size={12} color="#3B2604" strokeWidth={2.6} />
          </div>
          REMINDERS <span style={{marginLeft: 'auto'}}>now</span>
        </div>
        <div style={{fontSize: 15, fontWeight: 600, color: C.white, marginTop: 8}}>Class 8 Science unit test</div>
        <div style={{fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 2}}>Tomorrow, 9:00 AM · question paper not ready</div>
      </div>
    </div>
  );
};

const PAPERS = [
  {t: 'Class 8 General Science Examination', m: 'State · Class 8 · General Science · 30 marks', b: 'Published'},
  {t: 'CBSE Class 5 Science Exam', m: 'CBSE · Class 5 · Science · 30 marks', b: 'Draft'},
  {t: 'CBSE Class 8 Science Test', m: 'CBSE · Class 8 · Science · 30 marks', b: 'Published'},
  {t: 'Class 4 Marathi — विशेषण', m: 'State · Class 4 · Marathi · 20 marks', b: 'Published'},
  {t: 'CBSE Class 8 Science Exam', m: 'CBSE · Class 8 · Science · 30 marks', b: 'Draft'},
];

/** Studio → Question Paper Studio: the list of papers and the Create button. */
export const QPStudioM: React.FC<{createAt: number}> = ({createAt}) => (
  <div style={{position: 'absolute', inset: 0, padding: '14px 14px 0'}}>
    <div style={{fontFamily: SERIF, fontSize: 25, color: C.text}}>Question Paper Studio</div>
    <div style={{fontSize: 12.5, color: '#8E8C99', marginTop: 3}}>Board-aligned papers in minutes, not evenings.</div>
    <PrimaryButton label="Create new paper" pressAt={createAt} icon={<Plus size={17} />} style={{marginTop: 14, height: 46}} />
    <div style={{marginTop: 12, height: 40, borderRadius: 11, background: '#131315', border: '1px solid #26262A', display: 'flex', alignItems: 'center', gap: 8, padding: '0 12px', fontSize: 13.5, color: '#71717A'}}>
      <Search size={15} /> Search papers...
    </div>
    <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12}}>
      {PAPERS.map((p) => (
        <div key={p.t} style={{borderRadius: 13, background: '#131315', border: '1px solid #232327', padding: '11px 12px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <span style={{flex: 1, fontSize: 14, fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{p.t}</span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: 999,
                color: p.b === 'Published' ? '#B9A3FF' : '#A1A1AA',
                background: p.b === 'Published' ? C.activeNav : '#1E1E22',
              }}
            >
              {p.b}
            </span>
          </div>
          <div style={{fontSize: 11.5, color: '#8E8C99', marginTop: 4}}>{p.m}</div>
        </div>
      ))}
    </div>
    <Tap x={SCREEN_W / 2} y={112} at={createAt} />
  </div>
);

const Steps: React.FC<{step: number; label: string}> = ({step, label}) => (
  <>
    <BackTitle title="New Question Paper" sub={`Step ${step} of 4 — ${label}`} />
    <div style={{display: 'flex', gap: 5, margin: '0 14px'}}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{flex: 1, height: 4, borderRadius: 2, background: i <= step ? C.purple : '#26262A'}} />
      ))}
    </div>
  </>
);

const NavButtons: React.FC<{nextAt: number; label?: string; icon?: React.ReactNode; back?: boolean; disabled?: boolean}> = ({
  nextAt,
  label = 'Next',
  icon,
  back = true,
  disabled,
}) => (
  <div style={{position: 'absolute', left: 14, right: 14, top: CONTENT_H - 64, display: 'flex', gap: 10}}>
    {back ? (
      <div style={{width: 110, height: 48, borderRadius: 13, border: '1px solid #2A2A2E', background: '#141416', color: '#D4D4D8', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6}}>
        <ArrowLeft size={16} /> Back
      </div>
    ) : null}
    <PrimaryButton
      label={label}
      pressAt={nextAt}
      icon={icon}
      trailing={icon ? undefined : <ArrowRight size={17} />}
      style={{flex: 1, opacity: disabled ? 0.45 : 1}}
    />
  </div>
);

const NEXT_X = 14 + 110 + 10 + (SCREEN_W - 28 - 120) / 2;
const NEXT_X1 = SCREEN_W / 2;
const NEXT_Y = CONTENT_H - 40;

const SUBJECTS = ['Art Education', 'English', 'Mathematics', 'Physical Education', 'Science', 'Social Science', 'Vocational/Skill Education'];

/** Step 1 — board, class and subject. */
export const QPBasicsM: React.FC<{boardAt: number; classAt: number; subjectAt: number; nextAt: number}> = ({boardAt, classAt, subjectAt, nextAt}) => {
  const frame = useCurrentFrame();
  const board = frame >= boardAt + 2;
  const cls = frame >= classAt + 2;
  const subj = frame >= subjectAt + 2;
  const cellW = (SCREEN_W - 28 - 5 * 8) / 6;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Steps step={1} label="Basics" />
      <div style={{padding: '0 14px'}}>
        <FieldLabel>BOARD</FieldLabel>
        <div style={{display: 'flex', gap: 8}}>
          {['NCERT', 'CBSE', 'ICSE', 'State'].map((b) => (
            <Chip key={b} label={b} on={board ? b === 'NCERT' : b === 'State'} />
          ))}
        </div>
        <FieldLabel>CLASS</FieldLabel>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 8}}>
          {Array.from({length: 12}, (_, i) => i + 1).map((n) => {
            const on = cls ? n === 8 : n === 4;
            return (
              <div
                key={n}
                style={{
                  width: cellW,
                  height: 36,
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 14,
                  fontWeight: 600,
                  color: on ? '#B9A3FF' : C.text,
                  background: on ? C.activeNav : '#17171A',
                  border: `1px solid ${on ? 'rgba(139,108,246,0.7)' : '#2A2A2E'}`,
                }}
              >
                {n}
              </div>
            );
          })}
        </div>
        <FieldLabel>SUBJECT</FieldLabel>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 7}}>
          {SUBJECTS.map((s) => (
            <Chip key={s} label={s} small on={subj && s === 'Science'} />
          ))}
        </div>
      </div>
      <NavButtons nextAt={nextAt} back={false} disabled={!subj} />
      <Tap x={68} y={122} at={boardAt} />
      <Tap x={14 + cellW * 1.5 + 8} y={238} at={classAt} />
      <Tap x={186} y={339} at={subjectAt} />
      <Tap x={NEXT_X1} y={NEXT_Y} at={nextAt} />
    </div>
  );
};

const CHAPTERS = [
  'Electricity and its Magnetic Effects',
  'Exploring Forces',
  'Pressure, Winds, Storms and Cyclones',
  'Particulate Nature of Matter',
  'Nature of Matter: Metals and Non-metals',
  'The Amazing World of Solutes, Solvents and Solutions',
  'Light: Mirrors and Lenses',
  'Keeping Time with the Skies',
  'How Nature Works in Harmony',
  'Our Home: Earth and its Environment',
];

/** Step 2 — pick the chapter. */
export const QPChapterM: React.FC<{chapterAt: number; nextAt: number}> = ({chapterAt, nextAt}) => {
  const frame = useCurrentFrame();
  const chap = frame >= chapterAt + 2;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Steps step={2} label="Chapters" />
      <div style={{padding: '0 14px'}}>
        <FieldLabel>NCERT · CLASS 8 · SCIENCE</FieldLabel>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6}}>
          {CHAPTERS.map((c) => {
            const on = chap && c === 'Light: Mirrors and Lenses';
            return (
              <div
                key={c}
                style={{
                  maxWidth: '100%',
                  padding: '9px 14px',
                  borderRadius: 999,
                  fontSize: 13,
                  color: on ? '#C4B5FD' : '#D4D4D8',
                  background: on ? C.activeNav : '#151518',
                  border: `1px solid ${on ? 'rgba(139,108,246,0.7)' : '#232327'}`,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {c}
              </div>
            );
          })}
        </div>
      </div>
      <NavButtons nextAt={nextAt} disabled={!chap} />
      <Tap x={110} y={375} at={chapterAt} />
      <Tap x={NEXT_X} y={NEXT_Y} at={nextAt} />
    </div>
  );
};

const Stepper: React.FC<{value: number; label: string; plusAt?: number}> = ({value, label, plusAt = -99}) => {
  const frame = useCurrentFrame();
  const flash = tween(frame, [plusAt, plusAt + 4], [0, 1]) * tween(frame, [plusAt + 6, plusAt + 20], [1, 0]);
  return (
    <div style={{flex: 1}}>
      <div style={{fontSize: 11, color: '#8E8C99', marginBottom: 5}}>{label}</div>
      <div style={{display: 'flex', alignItems: 'center', height: 34, borderRadius: 9, background: '#0E0E10', border: '1px solid #26262A', overflow: 'hidden'}}>
        <div style={{width: 34, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #26262A'}}>
          <Minus size={14} color="#A1A1AA" />
        </div>
        <div style={{flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 600, color: flash > 0 ? '#C4B5FD' : C.text, transform: `scale(${1 + 0.25 * flash})`}}>{value}</div>
        <div style={{width: 34, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderLeft: '1px solid #26262A', background: `rgba(116,80,239,${0.5 * flash})`}}>
          <Plus size={14} color="#D4D4D8" />
        </div>
      </div>
    </div>
  );
};

/** Step 3 — the marks blueprint. */
export const QPBlueprintM: React.FC<{mcqAt: number; longAt: number; nextAt: number}> = ({mcqAt, longAt, nextAt}) => {
  const frame = useCurrentFrame();
  const mcq = frame >= mcqAt + 2 ? 5 : 4;
  const long = frame >= longAt + 2 ? 3 : 2;
  const rows = [
    {t: 'Multiple Choice', q: mcq, m: 1, at: mcqAt},
    {t: 'Short Answer', q: 5, m: 2},
    {t: 'Long Answer', q: long, m: 5, at: longAt},
    {t: 'Case-based', q: 0, m: 4},
  ];
  const totalQ = rows.reduce((a, r) => a + r.q, 0);
  const totalM = rows.reduce((a, r) => a + r.q * r.m, 0);
  const done = totalM === 30;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Steps step={3} label="Blueprint" />
      <div style={{display: 'flex', flexDirection: 'column', gap: 8, padding: '12px 14px 0'}}>
        {rows.map((r) => (
          <div key={r.t} style={{borderRadius: 13, background: '#131315', border: '1px solid #232327', padding: '9px 12px 8px'}}>
            <div style={{fontSize: 14, fontWeight: 600, color: C.text, marginBottom: 6}}>{r.t}</div>
            <div style={{display: 'flex', gap: 14}}>
              <Stepper label="Questions" value={r.q} plusAt={r.at} />
              <Stepper label="Marks each" value={r.m} />
            </div>
            <div style={{fontSize: 12, color: '#9B7CF8', marginTop: 6}}>= {r.q * r.m} marks</div>
          </div>
        ))}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 4px', fontSize: 13.5}}>
          <span style={{color: '#A1A1AA'}}>{totalQ} questions total</span>
          <span style={{color: done ? '#B9A3FF' : C.text, fontWeight: 700, fontSize: 16}}>{totalM} marks</span>
        </div>
      </div>
      <NavButtons nextAt={nextAt} />
      <Tap x={14 + 12 + (SCREEN_W - 28 - 24 - 14) / 2 - 17} y={64 + 12 + 9 + 26 + 16 + 17} at={mcqAt} />
      <Tap x={14 + 12 + (SCREEN_W - 28 - 24 - 14) / 2 - 17} y={64 + 12 + 9 + 26 + 16 + 17 + 2 * 121} at={longAt} />
      <Tap x={NEXT_X} y={NEXT_Y} at={nextAt} />
    </div>
  );
};

/** Step 4 — difficulty, language and Generate. */
export const QPFinishM: React.FC<{generateAt: number}> = ({generateAt}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <Steps step={4} label="Final touches" />
    <div style={{padding: '0 14px'}}>
      <FieldLabel>DIFFICULTY</FieldLabel>
      <div style={{display: 'flex', gap: 8}}>
        {['Easy', 'Medium', 'Hard', 'Mixed'].map((d) => (
          <Chip key={d} label={d} on={d === 'Medium'} />
        ))}
      </div>
      <FieldLabel>QUESTION LANGUAGE</FieldLabel>
      <SelectBox value="English" />
      <FieldLabel>TITLE</FieldLabel>
      <SelectBox value="Class 8 Science Examination" />
      <div style={{marginTop: 16, borderRadius: 13, background: '#131315', border: '1px solid #232327', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 10}}>
        {['Answer key included', '13 questions · 30 marks · 90 min', 'NCERT · Class 8 · Light: Mirrors and Lenses'].map((t) => (
          <div key={t} style={{display: 'flex', alignItems: 'center', gap: 9, fontSize: 13, color: '#D4D4D8'}}>
            <CircleCheck size={16} color="#8B6CF6" /> {t}
          </div>
        ))}
      </div>
    </div>
    <NavButtons nextAt={generateAt} label="Generate" icon={<Sparkles size={17} color="#FFE2B3" />} />
    <Tap x={NEXT_X} y={NEXT_Y} at={generateAt} />
  </div>
);

const Pill: React.FC<{icon: React.ReactNode; label: string; primary?: boolean; pressAt?: number}> = ({icon, label, primary, pressAt = -99}) => {
  const frame = useCurrentFrame();
  const press = frame >= pressAt - 2 && frame <= pressAt + 3 ? 0.92 : 1;
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '7px 10px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        color: primary ? C.white : C.text,
        background: primary ? C.purple : C.panel,
        border: `1px solid ${primary ? C.purple : '#2D2D2F'}`,
        transform: `scale(${press})`,
      }}
    >
      {icon}
      {label}
    </div>
  );
};

const Toast: React.FC<{at: number; label: string}> = ({at, label}) => {
  const frame = useCurrentFrame();
  const o = tween(frame, [at, at + 6], [0, 1]) * tween(frame, [at + 30, at + 38], [1, 0]);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 20, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - o) * 14}px)`, zIndex: 20}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 999, background: '#F4F4F5', color: C.ink, fontSize: 13.5, fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
        <CircleCheck size={16} color="#16A34A" /> {label}
      </div>
    </div>
  );
};

const Q: React.FC<{n: number; q: string; opts?: string[]; m: number; style?: React.CSSProperties}> = ({n, q, opts, m, style}) => (
  <div style={{marginTop: 10, ...style}}>
    <div style={{display: 'flex', gap: 6, fontSize: 13, lineHeight: 1.45, color: '#111827'}}>
      <span style={{fontWeight: 700}}>{n}.</span>
      <span style={{flex: 1}}>{q}</span>
      <span style={{color: '#6B7280', fontSize: 11.5}}>[{m}]</span>
    </div>
    {opts ? (
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px 10px', margin: '3px 0 0 18px', fontSize: 12.5, color: '#374151'}}>
        {opts.map((o, i) => (
          <span key={o}>
            ({'abcd'[i]}) {o}
          </span>
        ))}
      </div>
    ) : null}
  </div>
);

/** The generated paper with its actions: answer key, PDF, DOCX, Publish. */
export const PaperM: React.FC<{at: number; scroll: number; pdfAt: number; docxAt: number; publishAt: number}> = ({at, scroll, pdfAt, docxAt, publishAt}) => {
  const frame = useCurrentFrame();
  const r = (d: number) => reveal(frame, at + d);
  const sec: React.CSSProperties = {fontFamily: SERIF, fontWeight: 700, fontSize: 14, color: '#111827', textAlign: 'center', marginTop: 14, lineHeight: 1.3};
  return (
    <div style={{position: 'absolute', inset: 0, background: C.app}}>
      <BackTitle title="Class 8 Science Examination" sub="NCERT · Class 8 · Science · 30 marks" />
      <div style={{display: 'flex', gap: 5, padding: '0 14px'}}>
        <Pill icon={<KeyRound size={12} />} label="Answer key" />
        <Pill icon={<FileDown size={12} />} label="PDF" pressAt={pdfAt} />
        <Pill icon={<FileText size={12} />} label="DOCX" pressAt={docxAt} />
        <Pill icon={<Send size={12} />} label="Publish" primary pressAt={publishAt} />
      </div>
      <div style={{position: 'absolute', left: 12, right: 12, top: 112, bottom: 0, overflow: 'hidden', borderRadius: '14px 14px 0 0'}}>
        <div style={{background: C.white, padding: '16px 16px 30px', transform: `translateY(${-scroll}px)`, minHeight: 1200}}>
          <div style={{textAlign: 'center', fontSize: 10.5, letterSpacing: '0.16em', fontWeight: 700, color: '#6B7280', ...r(0)}}>NCERT · CLASS 8</div>
          <div style={{fontFamily: SERIF, fontWeight: 700, fontSize: 19, color: '#111827', textAlign: 'center', lineHeight: 1.2, marginTop: 4, ...r(2)}}>
            Class 8 Science Examination: Light: Mirrors and Lenses
          </div>
          <div style={{textAlign: 'center', fontSize: 12.5, color: '#374151', marginTop: 4, ...r(4)}}>Subject: Science</div>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12.5, fontWeight: 600, color: '#111827', marginTop: 6, paddingBottom: 8, borderBottom: '1.5px solid #111827', ...r(5)}}>
            <span>Time: 90 min</span>
            <span>Maximum Marks: 30</span>
          </div>
          <div style={{...r(8)}}>
            <div style={{fontSize: 12.5, fontWeight: 700, color: '#111827', marginTop: 10, textDecoration: 'underline'}}>General Instructions:</div>
            <ul style={{margin: '4px 0 0', paddingLeft: 18, fontSize: 12, lineHeight: 1.5, color: '#374151'}}>
              <li>All questions are compulsory.</li>
              <li>Read each question carefully before answering.</li>
              <li>Marks for each question are indicated against it.</li>
            </ul>
          </div>
          <div style={{...sec, ...r(12)}}>
            SECTION A — MULTIPLE CHOICE QUESTIONS
            <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 11.5, color: '#6B7280'}}>(5 × 1 marks)</div>
          </div>
          <div style={r(14)}>
            <Q n={1} m={1} q="Which of the following mirrors can form a real image?" opts={['Plane mirror', 'Convex mirror', 'Concave mirror', 'None of these']} />
          </div>
          <div style={r(17)}>
            <Q n={2} m={1} q="The image formed by a plane mirror is:" opts={['Real and inverted', 'Virtual and erect', 'Real and erect', 'Virtual and inverted']} />
          </div>
          <div style={r(20)}>
            <Q n={3} m={1} q="A lens that is thicker in the middle than at the edges is a:" opts={['Concave lens', 'Convex lens', 'Plane lens', 'Prism']} />
          </div>
          <Q n={4} m={1} q="Which mirror is used as a rear-view mirror in vehicles?" opts={['Concave', 'Plane', 'Convex', 'Cylindrical']} />
          <Q n={5} m={1} q="A magnifying glass is a:" opts={['Concave mirror', 'Convex lens', 'Concave lens', 'Plane mirror']} />
          <div style={sec}>
            SECTION B — SHORT ANSWER QUESTIONS
            <div style={{fontFamily: SANS, fontWeight: 500, fontSize: 11.5, color: '#6B7280'}}>(5 × 2 marks)</div>
          </div>
          <Q n={6} m={2} q="Why is a concave mirror used as a shaving mirror?" />
          <Q n={7} m={2} q="What is lateral inversion? Give one example from daily life." />
          <Q n={8} m={2} q="Draw a ray diagram to show the image formed by a convex lens when the object is beyond 2F." />
        </div>
      </div>
      <Tap x={14 + 108 + 6 + 30} y={82} at={pdfAt} />
      <Tap x={14 + 108 + 6 + 62 + 6 + 36} y={82} at={docxAt} />
      <Tap x={14 + 108 + 6 + 62 + 6 + 74 + 6 + 44} y={82} at={publishAt} />
      <Toast at={pdfAt + 6} label="PDF downloaded" />
      <Toast at={docxAt + 6} label="Word file downloaded" />
    </div>
  );
};

/** "Paper published!" sheet with the join code, as in the app. */
export const PublishedM: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = pop(frame, fps, at, 13, 150);
  const dim = tween(frame, [at - 4, at + 6], [0, 1]);
  const code = 'LTTHN596';
  const field = (label: string, value: string, mono?: boolean) => (
    <div style={{textAlign: 'left', marginTop: 10}}>
      <div style={{fontSize: 11, color: '#8E8C99', marginBottom: 5}}>{label}</div>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, height: 40, borderRadius: 10, background: '#0B0B0D', border: '1px solid #26262A', padding: '0 12px'}}>
        <span style={{flex: 1, fontFamily: mono ? MONO : SANS, fontSize: 13.5, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{value}</span>
        <Copy size={15} color="#A1A1AA" />
      </div>
    </div>
  );
  return (
    <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.62 * dim})`, zIndex: 40}}>
      <div
        style={{
          position: 'absolute',
          left: 14,
          right: 14,
          top: 120,
          borderRadius: 22,
          background: '#131316',
          border: '1px solid #2A2A2E',
          padding: '20px 18px 18px',
          textAlign: 'center',
          opacity: Math.min(1, p * 1.5),
          transform: `translateY(${(1 - p) * 60}px) scale(${0.92 + 0.08 * p})`,
          boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
        }}
      >
        <X size={16} color="#71717A" style={{position: 'absolute', right: 16, top: 16}} />
        <Img src={staticFile('brand/logo.png')} style={{width: 46, height: 46, filter: 'drop-shadow(0 0 12px rgba(10,140,240,0.5))'}} />
        <div style={{fontFamily: SERIF, fontSize: 24, color: C.text, marginTop: 6}}>Paper published!</div>
        <div style={{fontSize: 13.5, color: '#A1A1AA', marginTop: 4}}>Share this join code with your students.</div>
        <div style={{display: 'flex', justifyContent: 'center', gap: 7, marginTop: 14}}>
          {code.split('').map((ch, i) => {
            const c = tween(frame, [at + 8 + i * 2, at + 14 + i * 2], [0, 1]);
            return (
              <span
                key={i}
                style={{
                  fontFamily: SERIF,
                  fontSize: 34,
                  fontWeight: 600,
                  color: '#8B74F2',
                  textShadow: '0 0 18px rgba(139,116,242,0.5)',
                  opacity: c,
                  transform: `translateY(${(1 - c) * 10}px)`,
                  display: 'inline-block',
                }}
              >
                {ch}
              </span>
            );
          })}
        </div>
        {field('Join code', code, true)}
        {field('Shareable link', 'https://aishikshamitra.com/...')}
      </div>
    </div>
  );
};

const STUDENTS = [
  {n: 'Ananya Patil', s: 28, g: 'A', t: '24 min'},
  {n: 'Rohan Shinde', s: 25, g: 'A', t: '31 min'},
  {n: 'Sneha Kulkarni', s: 22, g: 'B', t: '28 min'},
  {n: 'Aarav Jadhav', s: 18, g: 'C', t: '35 min'},
];

/** Submissions coming in for the published paper. */
export const SubmissionsM: React.FC<{at: number; viewAt: number}> = ({at, viewAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <BackTitle title="Submissions — Class 8 Science" sub={`Code LTTHN596 · ${Math.min(4, Math.max(1, Math.floor((frame - at) / 7) + 1))} attempts`} />
      <div style={{display: 'flex', alignItems: 'center', gap: 8, margin: '4px 14px 10px', fontSize: 12, color: '#8E8C99'}}>
        <Users size={14} /> Answers checked automatically
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 9, padding: '0 14px'}}>
        {STUDENTS.map((s, i) => {
          const p = pop(frame, fps, at + i * 7, 14, 160);
          return (
            <div
              key={s.n}
              style={{
                borderRadius: 14,
                background: '#131315',
                border: `1px solid ${i === 0 ? 'rgba(139,108,246,0.5)' : '#232327'}`,
                padding: '12px 12px',
                opacity: Math.min(1, p * 1.5),
                transform: `translateY(${(1 - p) * 24}px)`,
              }}
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
                <div style={{width: 34, height: 34, borderRadius: 17, background: ['#3B2A6B', '#14365E', '#3D2A14', '#123B33'][i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#E4E4E7'}}>
                  {s.n[0]}
                </div>
                <div style={{flex: 1}}>
                  <div style={{fontSize: 14.5, fontWeight: 600, color: C.text}}>{s.n}</div>
                  <div style={{fontSize: 11.5, color: '#8E8C99', marginTop: 1}}>Class 8 · {s.t} · 13/13 answered</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: 15, fontWeight: 700, color: C.text}}>
                    {s.s}
                    <span style={{color: '#71717A', fontWeight: 500}}>/30</span>
                  </div>
                  <div style={{fontSize: 11, fontWeight: 700, color: s.g === 'A' ? '#4ADE80' : s.g === 'B' ? '#FACC15' : '#FB923C'}}>Grade {s.g}</div>
                </div>
              </div>
              {i === 0 ? (
                <PrimaryButton label="View report" pressAt={viewAt} style={{height: 38, marginTop: 10, fontSize: 13.5}} />
              ) : null}
            </div>
          );
        })}
      </div>
      <Tap x={SCREEN_W / 2} y={170} at={viewAt} />
    </div>
  );
};

/** AI evaluation report with the WhatsApp share button. */
export const ReportM: React.FC<{at: number; whatsappAt: number}> = ({at, whatsappAt}) => {
  const frame = useCurrentFrame();
  const pct = Math.round(tween(frame, [at + 6, at + 40], [0, 93]));
  const R = 34;
  const circ = 2 * Math.PI * R;
  const glow = tween(frame, [whatsappAt - 20, whatsappAt - 8], [0, 1]) * tween(frame, [whatsappAt + 6, whatsappAt + 30], [1, 0.4]);
  const press = frame >= whatsappAt - 2 && frame <= whatsappAt + 3 ? 0.94 : 1;
  const r = (d: number) => reveal(frame, at + d);
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <BackTitle title="Report — Ananya Patil" sub="Class 8 Science Examination · NCERT" />
      <div style={{display: 'flex', gap: 10, padding: '0 14px'}}>
        <div
          style={{
            flex: 1.3,
            height: 42,
            borderRadius: 999,
            background: '#22C55E',
            color: '#052E14',
            fontSize: 14,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transform: `scale(${press})`,
            boxShadow: `0 0 ${30 * glow}px rgba(34,197,94,${0.9 * glow})`,
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="#052E14">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.3a.5.5 0 0 0 0-.5l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z" />
          </svg>
          WhatsApp
        </div>
        <div style={{flex: 1, height: 42, borderRadius: 999, border: '1px solid #2D2D2F', background: C.panel, color: C.text, fontSize: 13.5, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7}}>
          <Copy size={15} /> Copy report
        </div>
      </div>
      <div style={{margin: '12px 12px 0', borderRadius: 14, background: C.white, padding: '16px 16px 18px'}}>
        <div style={{textAlign: 'center', fontSize: 10.5, letterSpacing: '0.16em', fontWeight: 700, color: '#6B7280', ...r(0)}}>AI EVALUATION REPORT</div>
        <div style={{textAlign: 'center', fontFamily: SERIF, fontSize: 21, color: '#111827', marginTop: 3, ...r(2)}}>Ananya Patil</div>
        <div style={{textAlign: 'center', fontSize: 11.5, color: '#6B7280', ...r(3)}}>Class 8 Science Examination: Light: Mirrors and Lenses</div>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26, marginTop: 12, ...r(5)}}>
          <div style={{position: 'relative', width: 84, height: 84}}>
            <svg width="84" height="84" style={{transform: 'rotate(-90deg)'}}>
              <circle cx="42" cy="42" r={R} fill="none" stroke="#E5E7EB" strokeWidth="8" />
              <circle cx="42" cy="42" r={R} fill="none" stroke="#7450EF" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(circ * pct) / 100} ${circ}`} />
            </svg>
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19, fontWeight: 700, color: '#111827'}}>{pct}%</div>
          </div>
          <div>
            <div style={{fontSize: 30, fontWeight: 700, color: '#111827', lineHeight: 1}}>
              {Math.round((pct / 93) * 28)}
              <span style={{fontSize: 16, color: '#6B7280'}}>/30</span>
            </div>
            <div style={{marginTop: 6, display: 'inline-block', padding: '3px 10px', borderRadius: 999, background: '#DCFCE7', color: '#15803D', fontSize: 12, fontWeight: 700}}>Grade A</div>
          </div>
        </div>
        <div style={{fontSize: 12.5, lineHeight: 1.5, color: '#374151', marginTop: 12, ...r(14)}}>
          Excellent work. Ananya understands how mirrors and lenses form images and draws clear ray diagrams. Revising sign conventions will help her reach full marks.
        </div>
        <div style={{marginTop: 10, borderRadius: 10, background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '8px 10px', ...r(20)}}>
          <div style={{fontSize: 12.5, fontWeight: 700, color: '#15803D'}}>Strengths</div>
          <div style={{fontSize: 12, color: '#166534', marginTop: 2, lineHeight: 1.45}}>• All multiple-choice answers correct{'\n'}</div>
          <div style={{fontSize: 12, color: '#166534', lineHeight: 1.45}}>• Clear, labelled ray diagrams</div>
        </div>
        <div style={{marginTop: 8, borderRadius: 10, background: '#FFF7ED', border: '1px solid #FED7AA', padding: '8px 10px', ...r(26)}}>
          <div style={{fontSize: 12.5, fontWeight: 700, color: '#C2410C'}}>Weaknesses</div>
          <div style={{fontSize: 12, color: '#9A3412', marginTop: 2, lineHeight: 1.45}}>• Sign convention for the focal length of lenses</div>
        </div>
      </div>
      <Tap x={112} y={84} at={whatsappAt} />
    </div>
  );
};
