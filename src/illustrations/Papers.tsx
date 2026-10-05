import {Check} from 'lucide-react';
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {tween} from '../anim';
import {C, DEVA, SANS, SERIF} from '../theme';

export const PAPER_W = 780;

const reveal = (frame: number, at: number): React.CSSProperties => ({
  opacity: tween(frame, [at, at + 8], [0, 1]),
  transform: `translateY(${tween(frame, [at, at + 12], [14, 0])}px)`,
});

const Paper: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{width: PAPER_W, borderRadius: 14, background: C.white, padding: '40px 46px 48px', color: C.ink, ...style}}>{children}</div>
);

const PaperHead: React.FC<{kicker: string; title: string; subject: string; left: string; right: string; deva?: boolean; at: number}> = ({
  kicker,
  title,
  subject,
  left,
  right,
  deva,
  at,
}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{fontFamily: SANS, ...reveal(frame, at)}}>
      <div style={{textAlign: 'center', fontSize: 14, fontWeight: 600, letterSpacing: '0.1em', color: '#374151'}}>{kicker}</div>
      <div style={{textAlign: 'center', fontFamily: deva ? DEVA : SANS, fontSize: 28, fontWeight: 700, marginTop: 8, color: '#111827'}}>{title}</div>
      <div style={{textAlign: 'center', fontSize: 18, color: '#374151', marginTop: 6}}>{subject}</div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 22,
          paddingBottom: 14,
          borderBottom: '2px solid #111827',
          fontSize: 16.5,
          fontWeight: 600,
          color: '#111827',
        }}
      >
        <span>{left}</span>
        <span>{right}</span>
      </div>
    </div>
  );
};

const SectionTitle: React.FC<{title: string; sub?: string; at: number}> = ({title, sub, at}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{textAlign: 'center', marginTop: 30, ...reveal(frame, at)}}>
      <div style={{fontFamily: SERIF, fontSize: 19, fontWeight: 600, letterSpacing: '0.05em', color: '#171719', fontVariantNumeric: 'lining-nums'}}>{title}</div>
      {sub ? <div style={{fontFamily: SANS, fontSize: 15, color: '#4B5563', marginTop: 4}}>{sub}</div> : null}
    </div>
  );
};

type MCQ = {q: string; options: string[]; answer: number};

const MARATHI_MCQS: MCQ[] = [
  {q: "खालील वाक्यातील विशेषण ओळखा: 'हिरवे रान सुंदर दिसते.'", options: ['हिरवे', 'रान', 'सुंदर', 'अ आणि क दोन्ही'], answer: 3},
  {q: "'गोड आंबा' या शब्दसमूहात विशेषण कोणता शब्द आहे?", options: ['आंबा', 'गोड', 'दोन्ही नाही', 'फळ'], answer: 1},
  {q: 'विशेषण म्हणजे काय?', options: ['नावा ऐवजी येणारा शब्द', 'नामाबद्दल अधिक माहिती सांगणारा शब्द', 'क्रिया दाखवणारा शब्द', 'दोन वाक्ये जोडणारा शब्द'], answer: 1},
  {q: "'पाच आंबे' यातील संख्यावाचक विशेषण कोणते?", options: ['पाच', 'आंबे', 'दोन्ही', 'कोणतेही नाही'], answer: 0},
];

/** Replica of the Marathi Class 4 paper generated on aishikshamitra.com/studio. */
export const MarathiPaper: React.FC<{at: number; answersAt?: number}> = ({at, answersAt = 99999}) => {
  const frame = useCurrentFrame();
  const answers = tween(frame, [answersAt, answersAt + 8], [0, 1]);
  return (
    <Paper>
      <PaperHead kicker="STATE · CLASS 4" title="इयत्ता चौथी - मराठी (विशेषण विशेष)" subject="Subject: Marathi" left="Time: 90 min" right="Maximum Marks: 120" deva at={at} />
      <div style={{marginTop: 26, fontFamily: SANS, ...reveal(frame, at + 6)}}>
        <div style={{fontSize: 18, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 4}}>General Instructions:</div>
        <ul style={{margin: '12px 0 0', paddingLeft: 24, fontFamily: DEVA, fontSize: 17, lineHeight: 1.9, color: '#1F2937'}}>
          <li>सर्व प्रश्न सोडवणे अनिवार्य आहे.</li>
          <li>उत्तरे अचूक लिहा.</li>
        </ul>
      </div>
      <SectionTitle title="SECTION A — MULTIPLE CHOICE QUESTIONS" sub="(5 × 1 marks)" at={at + 12} />
      {MARATHI_MCQS.map((m, i) => (
        <div key={i} style={{marginTop: 22, ...reveal(frame, at + 18 + i * 8)}}>
          <div style={{display: 'flex', gap: 10, fontFamily: DEVA, fontSize: 18, color: '#111827'}}>
            <span style={{fontFamily: SANS, fontWeight: 700}}>{i + 1}.</span>
            <span style={{flex: 1}}>{m.q}</span>
            <span style={{fontFamily: SANS}}>[1]</span>
          </div>
          <div style={{paddingLeft: 38, marginTop: 6}}>
            {m.options.map((o, k) => {
              const correct = k === m.answer;
              return (
                <div
                  key={k}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontFamily: DEVA,
                    fontSize: 16.5,
                    lineHeight: 1.85,
                    color: '#1F2937',
                    marginLeft: -8,
                    padding: '0 8px',
                    borderRadius: 8,
                    background: correct ? `rgba(34,197,94,${0.16 * answers})` : undefined,
                    width: 'fit-content',
                  }}
                >
                  <span style={{fontFamily: SANS}}>({'abcd'[k]})</span> {o}
                  {correct && answers > 0.5 ? <Check size={17} color={C.greenDeep} strokeWidth={3} /> : null}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </Paper>
  );
};

const RayDiagram: React.FC<{progress: number}> = ({progress}) => (
  <svg width="210" height="112" viewBox="0 0 170 96">
    <rect x="10" y="78" width="150" height="7" rx="3" fill="#94A3B8" />
    {new Array(10).fill(0).map((_, i) => (
      <line key={i} x1={16 + i * 15} y1="85" x2={10 + i * 15} y2="93" stroke="#CBD5E1" strokeWidth="2" />
    ))}
    <line x1="85" y1="10" x2="85" y2="78" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5 5" />
    <line x1="25" y1="14" x2="85" y2="78" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeDasharray="90" strokeDashoffset={90 * (1 - Math.min(1, progress * 2))} />
    <line x1="85" y1="78" x2="145" y2="14" stroke="#7450EF" strokeWidth="4" strokeLinecap="round" strokeDasharray="90" strokeDashoffset={90 * (1 - Math.max(0, progress * 2 - 1))} />
    <text x="66" y="50" fontFamily="Inter" fontWeight="600" fontSize="14" fill="#B45309">i</text>
    <text x="96" y="50" fontFamily="Inter" fontWeight="600" fontSize="14" fill="#4D3989">r</text>
  </svg>
);

/** English lesson plan in the same document style as the real question paper. */
export const LessonPlanPaper: React.FC<{at: number}> = ({at}) => {
  const frame = useCurrentFrame();
  const body: React.CSSProperties = {fontFamily: SANS, fontSize: 16.5, lineHeight: 1.7, color: '#1F2937', marginTop: 10};
  return (
    <Paper>
      <PaperHead kicker="STATE · CLASS 8" title="Light: Reflection & Mirrors" subject="Subject: Science" left="Duration: 40 min" right="Lesson Plan" at={at} />
      <div style={{marginTop: 24, fontFamily: SANS, ...reveal(frame, at + 8)}}>
        <div style={{fontSize: 18, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 4}}>Learning Objectives:</div>
        <ul style={{margin: '10px 0 0', paddingLeft: 24, ...body, marginTop: 8}}>
          <li>Explain how light is reflected from a surface</li>
          <li>State the two laws of reflection</li>
          <li>Compare regular and diffused reflection</li>
        </ul>
      </div>
      <SectionTitle title="WARM-UP · 5 MIN" at={at + 18} />
      <div style={{...body, textAlign: 'center', ...reveal(frame, at + 20)}}>“Why can we see ourselves in a mirror, but not in a wall?”</div>
      <SectionTitle title="ACTIVITY · 15 MIN" at={at + 28} />
      <div style={{...body, textAlign: 'center', ...reveal(frame, at + 30)}}>Build a simple periscope using two plane mirrors.</div>
      <SectionTitle title="EXPLANATION · 10 MIN" at={at + 38} />
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 28, marginTop: 8, ...reveal(frame, at + 40)}}>
        <div style={{...body, marginTop: 0}}>
          Angle of incidence
          <br />= angle of reflection
        </div>
        <RayDiagram progress={tween(frame, [at + 44, at + 66], [0, 1])} />
      </div>
      <SectionTitle title="ASSESSMENT · 10 MIN" at={at + 50} />
      <div style={{...body, textAlign: 'center', ...reveal(frame, at + 52)}}>5-question quiz + exit ticket</div>
    </Paper>
  );
};
