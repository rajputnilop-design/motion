import {
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Check,
  CircleCheck,
  ClipboardCheck,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Flame,
  GraduationCap,
  Image,
  Languages,
  Mic,
  PenLine,
  Plus,
  Radio,
  Sheet,
  Timer,
  Upload,
  Users,
  Volume2,
} from 'lucide-react';
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {easeInOut, pop, tween, typed} from '../anim';
import {Tap} from '../components/ui';
import {C, HAND, MONO, SANS, SERIF} from '../theme';
import {BackTitle, Chip, CONTENT_H, FieldLabel, PrimaryButton, SCREEN_W} from './mobile';

const reveal = (frame: number, at: number): React.CSSProperties => ({
  opacity: tween(frame, [at, at + 8], [0, 1]),
  transform: `translateY(${tween(frame, [at, at + 12], [12, 0])}px)`,
});

const MiniOrb: React.FC<{size?: number}> = ({size = 44}) => {
  const frame = useCurrentFrame();
  const s = 1 + 0.04 * Math.sin(frame / 9);
  return (
    <div style={{position: 'relative', width: size, height: size, margin: '0 auto'}}>
      <div style={{position: 'absolute', inset: -size * 0.6, borderRadius: '50%', background: 'radial-gradient(circle, rgba(116,80,239,0.45), transparent 65%)', transform: `scale(${s})`}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 38% 30%, #D4CCFF 0%, #8E7BFA 35%, #5A44D8 70%, #2B1C7A 100%)',
          boxShadow: '0 0 24px rgba(116,80,239,0.7)',
          transform: `scale(${s})`,
        }}
      />
    </div>
  );
};

/** The glowing intro card used at the top of the Lab, English and MahaTET pages. */
const HeroCard: React.FC<{kicker?: string; title: string; text: string; children?: React.ReactNode}> = ({kicker, title, text, children}) => (
  <div
    style={{
      margin: '12px 14px 0',
      borderRadius: 18,
      padding: '18px 16px 16px',
      textAlign: 'center',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(116,80,239,0.28), rgba(19,19,22,1) 70%)',
      border: '1px solid #26262A',
    }}
  >
    <MiniOrb />
    {kicker ? <div style={{fontSize: 10.5, fontWeight: 700, letterSpacing: '0.22em', color: '#9B7CF8', marginTop: 14}}>{kicker}</div> : null}
    <div style={{fontFamily: SERIF, fontSize: 25, color: C.text, marginTop: kicker ? 4 : 14, lineHeight: 1.1}}>{title}</div>
    <div style={{fontSize: 12.5, color: '#A1A1AA', marginTop: 7, lineHeight: 1.45}}>{text}</div>
    {children}
  </div>
);

const REGISTER = [
  {r: 1, n: 'Aditi', m: 18, s: 17, e: 19},
  {r: 2, n: 'Bhavesh', m: 15, s: 16, e: 14},
  {r: 3, n: 'Chaitali', m: 19, s: 18, e: 17},
  {r: 4, n: 'Dinesh', m: 12, s: 14, e: 15},
  {r: 5, n: 'Esha', m: 17, s: 19, e: 18},
  {r: 6, n: 'Farhan', m: 16, s: 15, e: 17},
  {r: 7, n: 'Gauri', m: 20, s: 18, e: 19},
  {r: 8, n: 'Harsh', m: 14, s: 13, e: 16},
];

const PAPER_W = 318;
const ROW_H = 34;
const COLS = [34, 112, 54, 54, 54];

/** The handwritten register page. */
const RegisterPaper: React.FC<{scan?: number}> = ({scan = -1}) => {
  const head = {fontFamily: HAND, fontWeight: 700, fontSize: 16, color: '#1E3A8A'};
  const cell = (i: number, v: string | number, row: number, col: number) => {
    const y = 92 + row * ROW_H;
    const passed = scan >= 0 && scan * 420 > y + ROW_H / 2;
    const x = 18 + COLS.slice(0, col).reduce((a, b) => a + b, 0);
    return (
      <div
        key={`${row}-${col}`}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: COLS[col],
          height: ROW_H,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 4,
          fontFamily: HAND,
          fontSize: 18,
          color: '#1E3A8A',
          transform: `rotate(${((row * 7 + col * 3) % 5) - 2}deg)`,
          outline: passed ? '1.5px solid rgba(124,92,246,0.9)' : undefined,
          outlineOffset: -3,
          borderRadius: 4,
          background: passed ? 'rgba(124,92,246,0.10)' : undefined,
        }}
      >
        {v}
      </div>
    );
  };
  return (
    <div
      style={{
        position: 'relative',
        width: PAPER_W,
        height: 420,
        background: '#F8F3E3',
        borderRadius: 4,
        boxShadow: '0 20px 40px rgba(0,0,0,0.55)',
        backgroundImage: 'repeating-linear-gradient(180deg, transparent 0 33px, rgba(59,130,246,0.25) 33px 34px)',
        backgroundPosition: '0 92px',
        overflow: 'hidden',
      }}
    >
      <div style={{position: 'absolute', left: 48, top: 0, bottom: 0, width: 1.5, background: 'rgba(239,68,68,0.45)'}} />
      <div style={{position: 'absolute', left: 18, top: 14, ...head, fontSize: 20, transform: 'rotate(-1.5deg)'}}>Marks Register — Class 7 B</div>
      <div style={{position: 'absolute', left: 20, top: 42, ...head, fontWeight: 400, fontSize: 15}}>Unit Test 1 · out of 20</div>
      {['Roll', 'Name', 'Maths', 'Sci', 'Eng'].map((h, i) => (
        <div key={h} style={{position: 'absolute', left: 22 + COLS.slice(0, i).reduce((a, b) => a + b, 0), top: 66, ...head, fontSize: 15, textDecoration: 'underline'}}>
          {h}
        </div>
      ))}
      {REGISTER.map((r, row) => [cell(0, r.r, row, 0), cell(1, r.n, row, 1), cell(2, r.m, row, 2), cell(3, r.s, row, 3), cell(4, r.e, row, 4)])}
      {scan >= 0 && scan <= 1 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: scan * 420 - 2,
            height: 4,
            background: '#8B6CF6',
            boxShadow: '0 0 18px 6px rgba(139,108,246,0.65)',
          }}
        />
      ) : null}
    </div>
  );
};

const Sheet2: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const cols = ['A', 'B', 'C', 'D', 'E'];
  const widths = [40, 98, 62, 62, 62];
  const header = ['Roll', 'Name', 'Maths', 'Science', 'English'];
  const cellStyle = (w: number, extra?: React.CSSProperties): React.CSSProperties => ({
    width: w,
    height: 30,
    borderRight: '1px solid #E5E7EB',
    borderBottom: '1px solid #E5E7EB',
    display: 'flex',
    alignItems: 'center',
    padding: '0 6px',
    fontSize: 12.5,
    color: '#111827',
    ...extra,
  });
  return (
    <div style={{width: PAPER_W + 14, background: C.white, borderRadius: 10, overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.55)'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '9px 10px', background: '#F3F4F6', borderBottom: '1px solid #E5E7EB'}}>
        <FileSpreadsheet size={17} color="#16A34A" />
        <span style={{fontSize: 13, fontWeight: 600, color: '#111827'}}>marks-register-7B</span>
        <span style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 700, color: '#15803D', opacity: tween(frame, [at + 34, at + 40], [0, 1])}}>
          <CircleCheck size={13} /> Sheet ready
        </span>
      </div>
      <div style={{display: 'flex', background: '#F9FAFB'}}>
        <div style={cellStyle(26, {color: '#9CA3AF', justifyContent: 'center', fontSize: 11, height: 22})} />
        {cols.map((c, i) => (
          <div key={c} style={cellStyle(widths[i], {color: '#9CA3AF', justifyContent: 'center', fontSize: 11, height: 22})}>
            {c}
          </div>
        ))}
      </div>
      {[header, ...REGISTER.map((r) => [r.r, r.n, r.m, r.s, r.e])].map((row, ri) => {
        const o = tween(frame, [at + ri * 3, at + ri * 3 + 6], [0, 1]);
        return (
          <div key={ri} style={{display: 'flex'}}>
            <div style={cellStyle(26, {color: '#9CA3AF', justifyContent: 'center', fontSize: 11, background: '#F9FAFB'})}>{ri + 1}</div>
            {row.map((v, ci) => (
              <div
                key={ci}
                style={cellStyle(widths[ci], {
                  fontWeight: ri === 0 ? 700 : 400,
                  background: ri === 0 ? '#EDE9FE' : undefined,
                  justifyContent: ci >= 2 || ci === 0 ? 'flex-end' : 'flex-start',
                  opacity: o,
                })}
              >
                {v}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/** Hook: photograph a handwritten marks register, scan it, get a spreadsheet. */
export const RegisterToSheetM: React.FC<{shutterAt: number; sheetAt: number}> = ({shutterAt, sheetAt}) => {
  const frame = useCurrentFrame();
  const shot = frame >= shutterAt;
  const flash = tween(frame, [shutterAt, shutterAt + 2], [0, 1]) * tween(frame, [shutterAt + 3, shutterAt + 12], [1, 0]);
  const settle = tween(frame, [shutterAt, shutterAt + 14], [0, 1], easeInOut);
  const jx = shot ? 0 : Math.sin(frame / 7) * 3;
  const jy = shot ? 0 : Math.cos(frame / 9) * 3;
  const rot = (1 - settle) * -4;
  const tilt = (1 - settle) * 10;
  const scan = tween(frame, [shutterAt + 10, sheetAt - 4], [0, 1.02], (t) => t);
  const toSheet = tween(frame, [sheetAt - 4, sheetAt + 8], [0, 1], easeInOut);
  return (
    <div style={{position: 'absolute', inset: 0, background: shot ? '#0B0B0E' : '#2B2118', overflow: 'hidden', fontFamily: SANS}}>
      {!shot ? (
        <div style={{position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 45%, #5A4632 0%, #2B2118 70%)'}} />
      ) : null}
      <div style={{position: 'absolute', top: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 5}}>
        <Chip label={<><Sheet size={14} /> Data → Sheet</>} on small />
      </div>
      <div
        style={{
          position: 'absolute',
          left: (SCREEN_W - PAPER_W) / 2,
          top: 70,
          perspective: 900,
          opacity: 1 - toSheet,
          transform: `translate(${jx}px, ${jy}px) scale(${1 - 0.08 * toSheet})`,
        }}
      >
        <div style={{transform: `rotate(${rot}deg) rotateX(${tilt}deg)`}}>
          <RegisterPaper scan={shot ? scan : -1} />
        </div>
      </div>
      {toSheet > 0 ? (
        <div style={{position: 'absolute', left: (SCREEN_W - PAPER_W - 14) / 2, top: 70, opacity: toSheet, transform: `translateY(${(1 - toSheet) * 20}px)`}}>
          <Sheet2 at={sheetAt} />
        </div>
      ) : null}
      {!shot ? (
        <>
          {[
            {l: 18, t: 56, r: 0},
            {l: SCREEN_W - 46, t: 56, r: 90},
            {l: SCREEN_W - 46, t: 476, r: 180},
            {l: 18, t: 476, r: 270},
          ].map((c, i) => (
            <div key={i} style={{position: 'absolute', left: c.l, top: c.t, width: 28, height: 28, borderLeft: '3px solid #fff', borderTop: '3px solid #fff', borderRadius: '6px 0 0 0', transform: `rotate(${c.r}deg)`}} />
          ))}
          <div style={{position: 'absolute', left: 0, right: 0, top: 530, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.85)'}}>Fit the page inside the frame</div>
        </>
      ) : null}
      {shot && toSheet < 1 ? (
        <div style={{position: 'absolute', left: 0, right: 0, top: 530, textAlign: 'center', fontSize: 13.5, color: '#C4B5FD', opacity: 1 - toSheet}}>Reading your register…</div>
      ) : null}
      {toSheet > 0 ? (
        <div style={{position: 'absolute', left: 14, right: 14, top: 470, display: 'flex', gap: 10, ...reveal(frame, sheetAt + 30)}}>
          <PrimaryButton label="Download" icon={<Download size={16} />} style={{flex: 1, height: 44, fontSize: 14}} />
          <div style={{flex: 1, height: 44, borderRadius: 13, border: '1px solid #2D2D2F', background: C.panel, color: C.text, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7}}>
            <ExternalLink size={15} /> Open in Google
          </div>
        </div>
      ) : null}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center', opacity: 1 - settle}}>
        <div style={{width: 70, height: 70, borderRadius: 35, border: '4px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 54, height: 54, borderRadius: 27, background: '#fff', transform: `scale(${frame >= shutterAt - 2 && frame <= shutterAt + 3 ? 0.85 : 1})`}} />
        </div>
      </div>
      <Tap x={SCREEN_W / 2} y={750 - 34 - 35} at={shutterAt} />
      <div style={{position: 'absolute', inset: 0, background: '#fff', opacity: flash, zIndex: 60}} />
    </div>
  );
};

const LAB_TOOLS: {t: string; I: typeof Sheet; soon?: boolean}[] = [
  {t: 'Data → Sheet', I: Sheet},
  {t: 'Marks → Report', I: ClipboardCheck},
  {t: 'Attendance', I: CalendarCheck},
  {t: 'Timetable', I: CalendarDays},
  {t: 'Grade answer', I: PenLine},
  {t: 'Worksheet', I: FileText},
  {t: 'Notes → Word', I: FileText},
  {t: 'Translate', I: Languages},
  {t: 'Images', I: Image, soon: true},
];

/** More → The Lab: turn photos into files. */
export const LabM: React.FC<{hl: {tool: string; at: number}[]}> = ({hl}) => {
  const frame = useCurrentFrame();
  const current = [...hl].reverse().find((h) => frame >= h.at)?.tool ?? 'Data → Sheet';
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <HeroCard
        kicker="THE LAB"
        title="Turn photos into files"
        text="Snap a photo of your marks register, records or handwritten notes — the Lab reads it and gives you a clean spreadsheet, report, Word file or translation to download or open in Google."
      />
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '14px 14px 0'}}>
        {LAB_TOOLS.map(({t, I, soon}) => {
          const on = t === current;
          const at = hl.find((h) => h.tool === t)?.at ?? -99;
          const pulse = tween(frame, [at, at + 5], [0, 1]) * tween(frame, [at + 6, at + 22], [1, 0]);
          return (
            <div
              key={t}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                height: 38,
                padding: '0 12px',
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 500,
                color: on ? '#C4B5FD' : soon ? '#71717A' : '#D4D4D8',
                background: on ? C.activeNav : '#151518',
                border: `1px solid ${on ? 'rgba(139,108,246,0.7)' : '#232327'}`,
                boxShadow: on ? `0 0 ${10 + 18 * pulse}px -4px rgba(116,80,239,0.9)` : undefined,
                transform: `scale(${1 + 0.05 * pulse})`,
              }}
            >
              <I size={15} color={on ? '#A88BFA' : soon ? '#52525B' : '#A1A1AA'} />
              {t}
              {soon ? <span style={{marginLeft: 'auto', fontSize: 9.5, fontWeight: 700, color: '#3F3510', background: '#DABE47', borderRadius: 999, padding: '2px 6px'}}>SOON</span> : null}
            </div>
          );
        })}
      </div>
      <div style={{margin: '14px 14px 0', borderRadius: 14, background: '#131315', border: '1px solid #232327', padding: '12px 14px'}}>
        <div style={{fontSize: 14, fontWeight: 600, color: C.text}}>Upload your photos</div>
        <div style={{fontSize: 11.5, color: '#8E8C99', marginTop: 3}}>Photos of marks sheets, attendance, tables or data — anything with data.</div>
        <PrimaryButton label="Upload photos, PDFs or notes" icon={<Upload size={16} />} style={{height: 42, marginTop: 10, fontSize: 14}} />
      </div>
      {hl.map((h) => {
        const i = LAB_TOOLS.findIndex((t) => t.t === h.tool);
        const x = 14 + (i % 2) * ((SCREEN_W - 28 - 8) / 2 + 8) + 86;
        const y = 246 + Math.floor(i / 2) * 46 + 19;
        return <Tap key={h.tool} x={x} y={y} at={h.at} />;
      })}
    </div>
  );
};

const LANGS = ['Marathi', 'Hindi', 'Gujarati', 'Bengali', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Urdu', 'Assamese'];
const LESSONS = [
  {t: 'Introduce yourself', d: 'Your name, school and subject'},
  {t: 'In the classroom', d: 'Instructions you use every day'},
  {t: 'Talking to parents', d: 'Give a parent clear, kind updates'},
  {t: 'My daily routine', d: 'Describe your day from morning to night'},
];

/** More → English Speaking: English with Aasha. */
export const EnglishHomeM: React.FC<{levelAt: number; lessonAt: number; scrollAt: number}> = ({levelAt, lessonAt, scrollAt}) => {
  const frame = useCurrentFrame();
  const scroll = tween(frame, [scrollAt, scrollAt + 16], [0, 250], easeInOut);
  const lvl = frame >= levelAt + 2;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden'}}>
      <div style={{transform: `translateY(${-scroll}px)`}}>
        <HeroCard title="English with Aasha" text="Aasha explains in your language, says it in English — and then you say it. One phrase at a time, out loud.">
          <div style={{display: 'flex', justifyContent: 'center', gap: 8, marginTop: 10}}>
            <span style={{display: 'flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 600, color: '#FDBA74', background: 'rgba(249,115,22,0.15)', padding: '4px 10px', borderRadius: 999}}>
              <Flame size={13} /> 3 day streak
            </span>
            <span style={{fontSize: 11.5, fontWeight: 600, color: '#5EEAD4', background: 'rgba(20,184,166,0.15)', padding: '4px 10px', borderRadius: 999}}>2/9 lessons</span>
          </div>
        </HeroCard>
        <div style={{padding: '0 14px'}}>
          <FieldLabel>YOUR LANGUAGE — AASHA EXPLAINS IN THIS</FieldLabel>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6}}>
            {LANGS.map((l) => (
              <Chip key={l} label={l} small on={l === 'Marathi'} style={{justifyContent: 'center'}} />
            ))}
          </div>
          <FieldLabel>YOUR LEVEL</FieldLabel>
          <div style={{display: 'flex', gap: 6}}>
            {[
              {t: 'Beginner', d: 'Simple words and short sentences'},
              {t: 'Intermediate', d: 'Talk in full sentences'},
              {t: 'Advanced', d: 'Fluent, natural speech'},
            ].map((l) => {
              const on = lvl ? l.t === 'Beginner' : false;
              return (
                <div
                  key={l.t}
                  style={{
                    flex: 1,
                    borderRadius: 12,
                    padding: '9px 9px',
                    background: on ? C.activeNav : '#151518',
                    border: `1px solid ${on ? 'rgba(139,108,246,0.7)' : '#232327'}`,
                  }}
                >
                  <div style={{fontSize: 12.5, fontWeight: 700, color: on ? '#C4B5FD' : C.text}}>{l.t}</div>
                  <div style={{fontSize: 10.5, color: '#8E8C99', marginTop: 2, lineHeight: 1.3}}>{l.d}</div>
                </div>
              );
            })}
          </div>
          <FieldLabel>LESSONS</FieldLabel>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8}}>
            {LESSONS.map((l, i) => {
              const on = frame >= lessonAt + 2 && i === 1;
              return (
                <div
                  key={l.t}
                  style={{
                    borderRadius: 12,
                    padding: '10px 10px',
                    background: on ? C.activeNav : '#131315',
                    border: `1px solid ${on ? 'rgba(139,108,246,0.7)' : '#232327'}`,
                    height: 70,
                  }}
                >
                  <BookOpen size={15} color="#8B6CF6" />
                  <div style={{fontSize: 13, fontWeight: 600, color: C.text, marginTop: 4}}>{l.t}</div>
                  <div style={{fontSize: 10.5, color: '#8E8C99', marginTop: 1}}>{l.d}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Tap x={66} y={448} at={levelAt} />
      <Tap x={253} y={308} at={lessonAt} />
    </div>
  );
};

/** A practice turn: Aasha explains in Marathi, says it in English, you repeat. */
export const EnglishPracticeM: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = (d: number) => {
    const p = pop(frame, fps, at + d, 14, 160);
    return {opacity: Math.min(1, p * 1.5), transform: `translateY(${(1 - p) * 18}px)`};
  };
  const listening = frame >= at + 38 && frame < at + 62;
  const t = (frame % 30) / 30;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <BackTitle title="In the classroom" sub="Lesson 2 · Beginner · explained in Marathi" />
      <div style={{padding: '6px 14px', display: 'flex', flexDirection: 'column', gap: 10}}>
        <div style={{alignSelf: 'flex-start', maxWidth: '86%', borderRadius: '16px 16px 16px 4px', background: '#18181B', border: '1px solid #26262A', padding: '10px 12px', ...b(0)}}>
          <div style={{fontSize: 11, fontWeight: 700, color: '#8B6CF6', marginBottom: 3}}>Aasha</div>
          <div style={{fontSize: 14.5, color: C.text, lineHeight: 1.5}}>मुलांना पुस्तक उघडायला सांगायचं आहे? इंग्रजीत असं म्हणा:</div>
        </div>
        <div style={{borderRadius: 16, background: 'linear-gradient(135deg, rgba(116,80,239,0.3), rgba(20,80,245,0.2))', border: '1px solid rgba(139,108,246,0.5)', padding: '14px 14px', ...b(14)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <Volume2 size={18} color="#C4B5FD" />
            <span style={{fontSize: 11, fontWeight: 700, letterSpacing: '0.14em', color: '#C4B5FD'}}>SAY IT IN ENGLISH</span>
          </div>
          <div style={{fontFamily: SERIF, fontSize: 22, color: C.white, marginTop: 6, lineHeight: 1.25}}>“Please open your books to page 12.”</div>
        </div>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, marginTop: 6, ...b(30)}}>
          <div style={{position: 'relative', width: 66, height: 66}}>
            {listening ? <div style={{position: 'absolute', inset: 0, borderRadius: 33, border: '2px solid rgba(139,108,246,0.8)', transform: `scale(${1 + t * 0.7})`, opacity: 1 - t}} /> : null}
            <div style={{position: 'absolute', inset: 0, borderRadius: 33, background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px -6px rgba(116,80,239,0.8)'}}>
              <Mic size={26} color={C.white} />
            </div>
          </div>
          <div style={{fontSize: 13, color: '#A1A1AA'}}>{frame < at + 62 ? 'Your turn — say it out loud' : 'You said'}</div>
          {listening ? (
            <div style={{display: 'flex', gap: 3, alignItems: 'center', height: 24}}>
              {Array.from({length: 18}, (_, i) => (
                <div key={i} style={{width: 3, borderRadius: 2, background: '#A88BFA', height: 4 + Math.abs(Math.sin(frame / 2.5 + i * 0.8)) * 18}} />
              ))}
            </div>
          ) : null}
        </div>
        {frame >= at + 60 ? (
          <div style={{alignSelf: 'flex-end', maxWidth: '86%', borderRadius: '16px 16px 4px 16px', background: '#241E38', padding: '10px 12px', ...b(60)}}>
            <div style={{fontSize: 14.5, color: C.text}}>Please open your books to page twelve.</div>
          </div>
        ) : null}
        {frame >= at + 68 ? (
          <div style={{alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 999, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', padding: '7px 12px', fontSize: 13.5, fontWeight: 600, color: '#4ADE80', ...b(68)}}>
            <CircleCheck size={16} /> Well said!
          </div>
        ) : null}
      </div>
    </div>
  );
};

/** More → MahaTET Practice: pick the paper and the practice type. */
export const MahaTETM: React.FC<{p1At: number; mockAt: number; startAt: number}> = ({p1At, mockAt, startAt}) => {
  const frame = useCurrentFrame();
  const card = (title: string, sub: string, on: boolean) => (
    <div style={{flex: 1, borderRadius: 13, padding: '10px 12px', background: on ? C.activeNav : '#151518', border: `1px solid ${on ? 'rgba(139,108,246,0.7)' : '#232327'}`, minHeight: 58}}>
      <div style={{fontSize: 14.5, fontWeight: 700, color: on ? '#C4B5FD' : C.text}}>{title}</div>
      <div style={{fontSize: 11, color: '#8E8C99', marginTop: 2, lineHeight: 1.35}}>{sub}</div>
    </div>
  );
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <HeroCard
        kicker="MAHATET PRACTICE"
        title="MahaTET mock tests"
        text="Real Maharashtra TET questions with official answer keys. Take a full mock across all subjects, or drill a single subject."
      />
      <div style={{padding: '0 14px'}}>
        <FieldLabel>PAPER</FieldLabel>
        <div style={{display: 'flex', gap: 8}}>
          {card('P1', 'Primary, Classes 1–5', frame >= p1At + 2)}
          {card('P2', 'Upper Primary, Classes 6–8', false)}
        </div>
        <FieldLabel>PRACTICE TYPE</FieldLabel>
        <div style={{display: 'flex', gap: 8}}>
          {card('Full mock', 'All subjects together, exam-style', frame >= mockAt + 2)}
          {card('Subject-wise', 'Pick one or more subjects', false)}
        </div>
        <PrimaryButton label="Start mock test" pressAt={startAt} icon={<Timer size={17} />} style={{marginTop: 16}} />
      </div>
      <Tap x={88} y={284} at={p1At} />
      <Tap x={88} y={387} at={mockAt} />
      <Tap x={SCREEN_W / 2} y={466} at={startAt} />
    </div>
  );
};

const OPTIONS = ['0–2 years', '2–7 years', '7–11 years', '11 years and above'];

/** A mock-test question with the official answer key. */
export const MockQuestionM: React.FC<{at: number; answerAt: number}> = ({at, answerAt}) => {
  const frame = useCurrentFrame();
  const secs = 2 * 3600 + 22 * 60 + 18 - Math.max(0, Math.floor((frame - at) / 30));
  const time = `${Math.floor(secs / 3600)}:${String(Math.floor((secs % 3600) / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`;
  const answered = frame >= answerAt + 2;
  const r = (d: number) => reveal(frame, at + d);
  return (
    <div style={{position: 'absolute', inset: 0, padding: '12px 14px'}}>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div>
          <div style={{fontFamily: SERIF, fontSize: 19, color: C.text}}>Paper 1 · Full mock</div>
          <div style={{fontSize: 11.5, color: '#8E8C99'}}>MahaTET · Primary (Classes 1–5)</div>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '6px 10px', borderRadius: 999, background: '#18181B', border: '1px solid #26262A', fontFamily: MONO, fontSize: 13, color: '#FCD34D'}}>
          <Timer size={14} /> {time}
        </div>
      </div>
      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 14}}>
        <span style={{fontSize: 13, fontWeight: 700, color: C.text}}>Q 12 / 150</span>
        <div style={{flex: 1, height: 5, borderRadius: 3, background: '#26262A'}}>
          <div style={{width: '8%', height: '100%', borderRadius: 3, background: C.purple}} />
        </div>
      </div>
      <div style={{marginTop: 16, display: 'inline-block', fontSize: 11, fontWeight: 600, color: '#9B7CF8', background: C.activeNav, padding: '4px 10px', borderRadius: 999, ...r(0)}}>
        Child Development & Pedagogy
      </div>
      <div style={{fontSize: 17, lineHeight: 1.45, color: C.text, marginTop: 10, ...r(3)}}>
        According to Piaget, the pre-operational stage of cognitive development is usually seen in children aged:
      </div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14}}>
        {OPTIONS.map((o, i) => {
          const correct = answered && i === 1;
          return (
            <div
              key={o}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                height: 46,
                padding: '0 12px',
                borderRadius: 12,
                fontSize: 14.5,
                color: correct ? '#BBF7D0' : C.text,
                background: correct ? 'rgba(34,197,94,0.16)' : '#151518',
                border: `1px solid ${correct ? 'rgba(34,197,94,0.7)' : '#26262A'}`,
                ...r(6 + i * 2),
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  border: `1.5px solid ${correct ? '#22C55E' : '#3F3F46'}`,
                  background: correct ? '#22C55E' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: correct ? '#052E14' : '#A1A1AA',
                }}
              >
                {correct ? <Check size={14} strokeWidth={3} /> : 'ABCD'[i]}
              </span>
              {o}
            </div>
          );
        })}
      </div>
      {answered ? (
        <div style={{marginTop: 14, borderRadius: 12, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.35)', padding: '10px 12px', ...reveal(frame, answerAt + 4)}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 7, fontSize: 13.5, fontWeight: 700, color: '#4ADE80'}}>
            <CircleCheck size={16} /> Correct
          </div>
          <div style={{fontSize: 12, color: '#A7F3D0', marginTop: 3}}>Matches the official answer key: (B) 2–7 years</div>
        </div>
      ) : null}
      <Tap x={150} y={12 + 46 + 34 + 30 + 75 + 14 + 46 + 8 + 23} at={answerAt} />
    </div>
  );
};

/** More → Student Hub: add a class. */
export const StudentHubM: React.FC<{addAt: number; createAt: number}> = ({addAt, createAt}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sheet = tween(frame, [addAt + 2, addAt + 12], [0, 1], easeInOut) * tween(frame, [createAt + 4, createAt + 14], [1, 0], easeInOut);
  const created = frame >= createAt + 6;
  const p = pop(frame, fps, createAt + 8, 13, 160);
  return (
    <div style={{position: 'absolute', inset: 0, padding: '14px 14px 0'}}>
      <div style={{fontFamily: SERIF, fontSize: 25, color: C.text}}>Student Hub</div>
      <div style={{fontSize: 12.5, color: '#8E8C99', marginTop: 3}}>Your classes and students.</div>
      <PrimaryButton label="Add class" pressAt={addAt} icon={<Plus size={17} />} style={{marginTop: 14, height: 46}} />
      {!created ? (
        <div style={{marginTop: 14, borderRadius: 14, border: '1px dashed #3F3F46', padding: '22px 14px', textAlign: 'center'}}>
          <Users size={22} color="#71717A" />
          <div style={{fontSize: 14, fontWeight: 600, color: C.text, marginTop: 6}}>No classes yet</div>
          <div style={{fontSize: 12, color: '#8E8C99', marginTop: 3}}>Create a class like “8A” to start your roster.</div>
        </div>
      ) : (
        <div
          style={{
            marginTop: 14,
            borderRadius: 14,
            background: '#131315',
            border: '1px solid rgba(139,108,246,0.5)',
            padding: '14px 14px',
            opacity: Math.min(1, p * 1.5),
            transform: `scale(${0.9 + 0.1 * p})`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div style={{width: 44, height: 44, borderRadius: 12, background: C.activeNav, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#C4B5FD'}}>8A</div>
          <div style={{flex: 1}}>
            <div style={{fontSize: 15, fontWeight: 600, color: C.text}}>Class 8A</div>
            <div style={{fontSize: 12, color: '#8E8C99', marginTop: 2}}>Science · add students to start</div>
          </div>
          <div style={{fontSize: 12.5, fontWeight: 600, color: '#9B7CF8'}}>+ Students</div>
        </div>
      )}
      {sheet > 0 ? (
        <div style={{position: 'absolute', inset: 0, background: `rgba(0,0,0,${0.55 * sheet})`, zIndex: 30}}>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, transform: `translateY(${(1 - sheet) * 100}%)`, borderRadius: '20px 20px 0 0', background: '#141416', borderTop: '1px solid #2A2A2E', padding: '18px 16px 22px'}}>
            <div style={{fontFamily: SERIF, fontSize: 21, color: C.text}}>New class</div>
            <FieldLabel>CLASS NAME</FieldLabel>
            <div style={{height: 44, borderRadius: 11, background: '#0B0B0D', border: '1px solid rgba(139,108,246,0.7)', display: 'flex', alignItems: 'center', padding: '0 14px', fontSize: 15, color: C.text}}>
              {typed('8A', frame, addAt + 14, 0.25)}
              <span style={{width: 1.5, height: 18, background: '#A88BFA', marginLeft: 2}} />
            </div>
            <PrimaryButton label="Create class" pressAt={createAt} style={{marginTop: 14, height: 46}} />
          </div>
        </div>
      ) : null}
      <Tap x={SCREEN_W / 2} y={14 + 31 + 19 + 14 + 23} at={addAt} />
      <Tap x={SCREEN_W / 2} y={CONTENT_H - 22 - 23} at={createAt} />
    </div>
  );
};

/** Courses tab: live AI training for teachers. */
export const CoursesM: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const items = [
    {t: '7-Day Practical AI Training', d: '7 days · practical, with recordings', I: GraduationCap, live: false},
    {t: 'AI Ready Teachers — Batch 5', d: '7-day LIVE training for teachers', I: Radio, live: true},
    {t: 'AI for Teachers Books', d: 'E-books to read on the platform', I: BookOpen, live: false},
    {t: 'AI for Students', d: 'English course for Classes 6–12', I: Users, live: false},
  ];
  const blink = Math.floor(frame / 12) % 2 === 0;
  return (
    <div style={{position: 'absolute', inset: 0, padding: '14px 14px 0'}}>
      <div style={{fontFamily: SERIF, fontSize: 25, color: C.text}}>Courses</div>
      <div style={{fontSize: 12.5, color: '#8E8C99', marginTop: 3}}>Learn to teach with AI, step by step.</div>
      <div style={{display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14}}>
        {items.map(({t, d, I, live}, i) => (
          <div
            key={t}
            style={{
              borderRadius: 14,
              background: live ? 'linear-gradient(135deg, rgba(116,80,239,0.25), #131315 70%)' : '#131315',
              border: `1px solid ${live ? 'rgba(139,108,246,0.6)' : '#232327'}`,
              padding: '13px 14px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              ...reveal(frame, at + i * 4),
            }}
          >
            <div style={{width: 40, height: 40, borderRadius: 11, background: C.activeNav, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <I size={19} color="#A88BFA" />
            </div>
            <div style={{flex: 1}}>
              <div style={{fontSize: 14.5, fontWeight: 600, color: C.text}}>{t}</div>
              <div style={{fontSize: 11.5, color: '#8E8C99', marginTop: 2}}>{d}</div>
            </div>
            {live ? (
              <span style={{display: 'flex', alignItems: 'center', gap: 5, fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em', color: '#FCA5A5', background: 'rgba(239,68,68,0.18)', padding: '4px 8px', borderRadius: 999}}>
                <span style={{width: 6, height: 6, borderRadius: 3, background: '#EF4444', opacity: blink ? 1 : 0.3}} /> LIVE
              </span>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
