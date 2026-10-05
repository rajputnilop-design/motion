import {ArrowUp, AudioLines, BookOpen, Captions, Copy, History, Keyboard, MessageCircle, Mic, NotebookPen, Paperclip, SlidersHorizontal, Sparkles, X} from 'lucide-react';
import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {caretVisible, tween, typed} from '../anim';
import {GeneratingOrb} from '../components/Orb';
import {Tap} from '../components/ui';
import {C, gradientText, MONO, namasteGradient, SANS, SERIF} from '../theme';
import {BackTitle, Chip, FieldLabel, PrimaryButton, SCREEN_W, SelectBox, VoiceFab} from './mobile';

/** "Namaste 👋 I'm Aasha" home with the composer and the voice button. */
export const ChatHomeM: React.FC<{tapFabAt?: number}> = ({tapFabAt = -99}) => (
  <div style={{position: 'absolute', inset: 0}}>
    <div style={{position: 'absolute', left: 14, top: 12, display: 'flex', alignItems: 'center', gap: 10}}>
      <div style={{width: 36, height: 36, borderRadius: 10, background: C.panel, border: `1px solid ${C.line2}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <History size={17} color="#A1A1AA" />
      </div>
      <span style={{fontSize: 14, color: '#D4D4D8'}}>New chat</span>
    </div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 120, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <Img src={staticFile('brand/logo.png')} style={{width: 74, height: 74, filter: 'drop-shadow(0 0 16px rgba(10,140,240,0.5))'}} />
      <div style={{display: 'flex', alignItems: 'center', gap: 8, marginTop: 14}}>
        <span style={{fontFamily: SERIF, fontSize: 36, ...gradientText(namasteGradient)}}>Namaste</span>
        <span style={{fontSize: 30}}>👋</span>
      </div>
      <div style={{fontFamily: SERIF, fontSize: 24, color: C.text, marginTop: 2}}>I’m Aasha</div>
      <div style={{fontSize: 13.5, color: '#8F8AA3', marginTop: 8, textAlign: 'center', width: 280, lineHeight: 1.45}}>
        Your teaching companion for papers, lessons, and more.
      </div>
    </div>
    <div style={{position: 'absolute', right: 16, top: 380}}>
      <VoiceFab pulse />
    </div>
    <div style={{position: 'absolute', left: 14, right: 14, bottom: 40}}>
      <div style={{height: 100, borderRadius: 16, background: '#131315', border: '1px solid #26262A', padding: '14px 14px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
        <div style={{fontSize: 14.5, color: '#8E8C99'}}>Ask Aasha...</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <Paperclip size={17} color="#A1A1AA" />
          <Mic size={17} color="#A1A1AA" />
          <AudioLines size={17} color="#8B6CF6" />
          <div style={{display: 'flex', padding: 3, borderRadius: 999, background: '#1D1D20', border: '1px solid #2A2A2E'}}>
            <span style={{padding: '4px 12px', borderRadius: 999, background: '#3B2A6B', color: '#9B7CF8', fontSize: 12}}>Auto</span>
            <span style={{padding: '4px 12px', color: '#6B6974', fontSize: 12}}>Pro</span>
          </div>
          <div style={{flex: 1}} />
          <div style={{width: 38, height: 38, borderRadius: 11, background: '#2E2650', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <ArrowUp size={17} color="#6E6A85" />
          </div>
        </div>
      </div>
      <div style={{textAlign: 'center', fontSize: 10, color: '#71717A', marginTop: 8}}>AIShikshaMitra can make mistakes. Please check important information.</div>
    </div>
    <Tap x={SCREEN_W - 43} y={407} at={tapFabAt} />
  </div>
);

type Line = {who: 'You' | 'Aasha'; text: string; at: number};

/** Full-screen voice call with Aasha: orb, status, live captions and call controls. */
export const VoiceCallM: React.FC<{lines: Line[]; listenAt: number; speakAt: number[]}> = ({lines, listenAt, speakAt}) => {
  const frame = useCurrentFrame();
  const speaking = speakAt.some((s, i) => frame >= s && (i % 2 === 0 ? frame < (speakAt[i + 1] ?? 99999) : false));
  const status = frame < listenAt ? 'Connecting…' : speaking ? 'Aasha is speaking · tap to interrupt' : 'Listening';
  const pulse = speaking ? 1 + 0.06 * Math.sin(frame / 2.2) + 0.03 * Math.sin(frame / 1.3) : 1 + 0.02 * Math.sin(frame / 8);
  const secs = Math.max(0, Math.floor((frame - listenAt) / 30)) + 18;
  return (
    <div style={{position: 'absolute', inset: 0, background: '#060608', fontFamily: SANS}}>
      <div style={{position: 'absolute', left: 18, top: 14}}>
        <div style={{fontFamily: SERIF, fontSize: 22, color: C.text}}>Aasha</div>
        <div style={{fontSize: 12, color: '#8E8C99'}}>Voice call</div>
      </div>
      <div style={{position: 'absolute', right: 18, top: 22, fontFamily: MONO, fontSize: 14, color: '#A1A1AA'}}>
        0:{String(secs % 60).padStart(2, '0')}
      </div>
      <div style={{position: 'absolute', left: SCREEN_W / 2 - 115, top: 120, width: 230, height: 230}}>
        <div
          style={{
            position: 'absolute',
            inset: -60,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(116,80,239,0.45) 0%, rgba(116,80,239,0.12) 45%, transparent 70%)',
            transform: `scale(${pulse})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 30%, #C9C2FF 0%, #8E7BFA 30%, #5A44D8 62%, #2B1C7A 100%)',
            boxShadow: '0 0 60px rgba(116,80,239,0.7)',
            transform: `scale(${pulse})`,
          }}
        />
        {frame < listenAt ? (
          <div
            style={{
              position: 'absolute',
              inset: -14,
              borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: 'rgba(255,255,255,0.5)',
              transform: `rotate(${frame * 12}deg)`,
            }}
          />
        ) : null}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 386, textAlign: 'center', fontSize: 13.5, color: '#A9A6B8'}}>{status}</div>
      <div style={{position: 'absolute', left: 18, right: 18, top: 430, display: 'flex', flexDirection: 'column', gap: 8}}>
        {lines
          .filter((l) => frame >= l.at)
          .slice(-4)
          .map((l, i) => {
            const shown = typed(l.text, frame, l.at, 1.5);
            return (
              <div key={i} style={{fontSize: 14.5, lineHeight: 1.4, color: C.text, opacity: tween(frame, [l.at, l.at + 5], [0, 1])}}>
                <span style={{color: l.who === 'Aasha' ? '#8B6CF6' : '#A1A1AA', fontWeight: 600, marginRight: 6}}>{l.who}</span>
                {shown}
                {shown.length < l.text.length && caretVisible(frame) ? <span style={{color: '#8B6CF6'}}>|</span> : null}
              </div>
            );
          })}
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 26, display: 'flex', justifyContent: 'space-around'}}>
        {[
          {Icon: Mic, label: 'Mute', bg: '#1D1D20', fg: C.text},
          {Icon: Captions, label: 'Captions', bg: C.white, fg: C.ink},
          {Icon: Keyboard, label: 'Type', bg: '#1D1D20', fg: C.text},
          {Icon: X, label: 'End', bg: '#EF4444', fg: C.white},
        ].map(({Icon, label, bg, fg}) => (
          <div key={label} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
            <div style={{width: 58, height: 58, borderRadius: 29, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Icon size={22} color={fg} />
            </div>
            <span style={{fontSize: 11, color: '#A1A1AA'}}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SUBJECTS = ['Art Education', 'English', 'Mathematics', 'Physical Education', 'Science', 'Social Science', 'Vocational/Skill Education'];
const CHAPTERS = ['The Wonderful World of Science', 'Diversity in the Living World', 'Mindful Eating: A Path to a Healthy Body', 'Exploring Magnets', 'Measurement of Length and Motion'];

/** Tools → Lesson Planner: pull a chapter from the CBSE / NCERT syllabus bank. */
export const LessonPlannerM: React.FC<{classAt: number; subjectAt: number; chapterAt: number}> = ({classAt, subjectAt, chapterAt}) => {
  const frame = useCurrentFrame();
  const cls = frame >= classAt + 2;
  const subj = frame >= subjectAt + 2;
  const chap = frame >= chapterAt + 2;
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <BackTitle
        title="Lesson Planner"
        sub="A period-by-period plan for your class"
        icon={
          <div style={{width: 38, height: 38, borderRadius: 11, background: C.activeNav, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <NotebookPen size={18} color="#A88BFA" />
          </div>
        }
      />
      <div style={{margin: '6px 14px 0', display: 'flex', padding: 4, borderRadius: 14, background: '#121214', border: `1px solid ${C.line}`}}>
        <div style={{flex: 1, textAlign: 'center', padding: '9px 0', borderRadius: 10, background: C.activeNav, color: '#B9A3FF', fontSize: 13.5, fontWeight: 600}}>Syllabus Bank</div>
        <div style={{flex: 1, textAlign: 'center', padding: '9px 0', color: '#A1A1AA', fontSize: 13.5}}>My material</div>
      </div>
      <div style={{margin: '12px 14px 0', borderRadius: 16, background: '#121214', border: `1px solid ${C.line}`, padding: '14px 14px'}}>
        <div style={{display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.35}}>
          <BookOpen size={16} color="#8B6CF6" style={{marginTop: 2}} /> Pull a chapter from the CBSE / NCERT syllabus
        </div>
        <FieldLabel>CLASS</FieldLabel>
        <div style={{display: 'flex', gap: 8}}>
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <div
              key={n}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 600,
                color: cls && n === 6 ? '#B9A3FF' : C.text,
                background: cls && n === 6 ? C.activeNav : '#17171A',
                border: `1px solid ${cls && n === 6 ? 'rgba(139,108,246,0.7)' : '#2A2A2E'}`,
              }}
            >
              {n}
            </div>
          ))}
        </div>
        <FieldLabel>SUBJECT</FieldLabel>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 7}}>
          {SUBJECTS.map((s) => (
            <Chip key={s} label={s} small on={subj ? s === 'Science' : s === 'Art Education'} />
          ))}
        </div>
        <FieldLabel>CHAPTER</FieldLabel>
        <div style={{display: 'flex', flexDirection: 'column', gap: 6, opacity: subj ? 1 : 0.35}}>
          {CHAPTERS.map((c) => {
            const on = chap && c === 'Diversity in the Living World';
            return (
              <div
                key={c}
                style={{
                  padding: '9px 12px',
                  borderRadius: 10,
                  fontSize: 13,
                  color: on ? '#C4B5FD' : '#D4D4D8',
                  background: on ? C.activeNav : '#17171A',
                  border: `1px solid ${on ? 'rgba(139,108,246,0.7)' : '#232327'}`,
                }}
              >
                {c}
              </div>
            );
          })}
        </div>
      </div>
      <Tap x={14 + 15 + 5 * 46 + 19} y={232} at={classAt} />
      <Tap x={204} y={340} at={subjectAt} />
      <Tap x={130} y={486} at={chapterAt} />
    </div>
  );
};

/** The plan form after a chapter is picked. */
export const LessonFormM: React.FC<{generateAt: number}> = ({generateAt}) => (
  <div style={{position: 'absolute', inset: 0, padding: '6px 14px'}}>
    <div style={{borderRadius: 16, background: '#121214', border: `1px solid ${C.line}`, padding: '4px 14px 16px'}}>
      <FieldLabel>CLASS *</FieldLabel>
      <SelectBox value="6" />
      <FieldLabel>SUBJECT *</FieldLabel>
      <SelectBox value="Science" />
      <FieldLabel>CHAPTER OR TOPIC *</FieldLabel>
      <SelectBox value="Diversity in the Living World" />
      <div style={{fontSize: 11.5, color: '#8E8C99', marginTop: 6, lineHeight: 1.4}}>Pick it from the Syllabus Bank above and the plan uses that exact chapter.</div>
      <FieldLabel>WRITE THE PLAN IN</FieldLabel>
      <SelectBox value="English" />
      <div style={{fontSize: 11.5, color: '#8E8C99', marginTop: 6, lineHeight: 1.4}}>The whole plan — headings, questions, board work — comes in this language.</div>
      <div style={{marginTop: 14, borderRadius: 12, border: '1px solid #26262A', padding: '10px 12px'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 13.5, color: C.text}}>
          <SlidersHorizontal size={15} color="#8B6CF6" /> More options
        </div>
        <div style={{fontSize: 11, color: '#8E8C99', marginTop: 3}}>period length, class size, what you have in the room</div>
      </div>
      <PrimaryButton label="Generate" pressAt={generateAt} icon={<Sparkles size={17} color="#FFE2B3" />} style={{marginTop: 16}} />
    </div>
    <Tap x={SCREEN_W / 2} y={517} at={generateAt} />
  </div>
);

export const GeneratingM: React.FC<{caption: string}> = ({caption}) => (
  <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.app}}>
    <div style={{zoom: 0.85}}>
      <GeneratingOrb caption={caption} size={160} />
    </div>
  </div>
);

const H: React.FC<{children: React.ReactNode; at: number; hl?: number}> = ({children, at, hl = 0}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: SERIF,
        fontSize: 21,
        color: '#111827',
        margin: '18px 0 8px',
        opacity: tween(frame, [at, at + 8], [0, 1]),
        background: hl ? `rgba(139,108,246,${0.18 * hl})` : undefined,
        borderRadius: 6,
      }}
    >
      {children}
    </div>
  );
};

/** The generated lesson plan (board plan, questions to ask, homework, before the bell). */
export const LessonPlanM: React.FC<{at: number; scroll: number; highlightAt?: number}> = ({at, scroll, highlightAt = 99999}) => {
  const frame = useCurrentFrame();
  const r = (d: number): React.CSSProperties => ({opacity: tween(frame, [at + d, at + d + 8], [0, 1]), transform: `translateY(${tween(frame, [at + d, at + d + 12], [10, 0])}px)`});
  const hl = tween(frame, [highlightAt, highlightAt + 8], [0, 1]);
  const body: React.CSSProperties = {fontSize: 13.5, lineHeight: 1.55, color: '#1F2937'};
  return (
    <div style={{position: 'absolute', inset: 0, background: C.app}}>
      <div style={{position: 'absolute', left: 12, right: 12, top: 10, transform: `translateY(${-scroll}px)`}}>
        <div style={{borderRadius: 14, background: C.white, padding: '16px 18px 20px', boxShadow: '0 12px 30px -12px rgba(0,0,0,0.8)'}}>
          <div style={{fontSize: 10.5, letterSpacing: '0.14em', fontWeight: 700, color: '#6B7280', ...r(0)}}>LESSON PLAN · CLASS 6 SCIENCE</div>
          <div style={{fontFamily: SERIF, fontSize: 23, color: '#111827', marginTop: 4, ...r(2)}}>Diversity in the Living World</div>
          <div style={{fontSize: 12, color: '#6B7280', marginTop: 2, ...r(4)}}>Period 1 · 40 min · Board work, questions and homework</div>
          <H at={at + 8}>Board plan</H>
          <div style={{borderRadius: 10, background: '#9CA3AF', padding: '12px 12px', fontFamily: MONO, fontSize: 11, lineHeight: 1.55, color: '#111827', whiteSpace: 'pre', overflow: 'hidden', ...r(10)}}>
            {`CHAPTER: Diversity in the Living World

1. Living vs Non-Living
   - Living things: GROW, RESPIRE,
     REPRODUCE
2. Habitats
   - Where organisms live and find
     food: Forest, Pond, Desert
3. Grouping
   - Sorting based on characteristics

Activity Sort:
LIVING         | NON-LIVING
- Dog          | - Stone
- Neem tree    | - Plastic pen`}
          </div>
          <H at={at + 18}>Questions to ask</H>
          <div style={{...body, ...r(20)}}>
            1. “Is a car living or non-living? It moves and uses petrol.” <span style={{color: '#6B7280'}}>(Expected: Non-living; doesn’t grow or reproduce.)</span>
          </div>
          <div style={{...body, marginTop: 6, ...r(24)}}>
            2. “Do plants breathe?” <span style={{color: '#6B7280'}}>(Expected: Yes, all living things respire.)</span>
          </div>
          <H at={at + 28}>Homework</H>
          <div style={{...body, ...r(30)}}>
            Write down 5 living things and 5 non-living things seen in your house or street. Write the habitat of any two of the living things.
          </div>
          <H at={at + 34} hl={hl}>Before the bell</H>
          <div style={{...body, ...r(36)}}>
            1. Ensure chalk and duster are ready.
            <div style={{marginTop: 4, padding: '4px 6px', marginLeft: -6, borderRadius: 8, background: `rgba(139,108,246,${0.2 * hl})`, boxShadow: hl > 0 ? `inset 0 0 0 ${2 * hl}px rgba(139,108,246,0.8)` : undefined}}>
              2. Think of 2 local examples of animals and plants around Pune (like the gulmohar tree and a stray dog) to use during explanation.
            </div>
          </div>
        </div>
        <div style={{display: 'flex', gap: 10, marginTop: 12, ...r(40)}}>
          {[
            {t: 'Copy', I: Copy},
            {t: 'Send to Chat', I: MessageCircle},
          ].map(({t, I}) => (
            <div key={t} style={{display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 999, border: '1px solid #2D2D2F', background: C.panel, fontSize: 13.5, color: C.text}}>
              <I size={15} /> {t}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

