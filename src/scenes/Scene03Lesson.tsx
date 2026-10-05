import {ChevronLeft, CircleCheck, Clock3, Download, FlaskConical, Lightbulb, PenLine, Share2, Sparkles, Target, Zap} from 'lucide-react';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, tween} from '../anim';
import {SelectField, TypeField} from '../components/Form';
import {LogoMark} from '../components/Logo';
import {Phone} from '../components/Phone';
import {Breadcrumb, CheckItem, GenerateButton, Kicker, MaskWords, Sfx, Skeleton, Tap} from '../components/ui';
import {brandGradient, C, cardShadow, FONT} from '../theme';

const T = {class: 18, subject: 36, chapter: 54, type: 70, generate: 96, doc: 100};
const BLOCKS_AT = [110, 122, 134, 146, 158];
const READY = 168;

const RayDiagram: React.FC<{progress: number}> = ({progress}) => (
  <svg width="170" height="96" viewBox="0 0 170 96">
    <rect x="10" y="78" width="150" height="7" rx="3" fill="#94A3B8" />
    {new Array(10).fill(0).map((_, i) => (
      <line key={i} x1={16 + i * 15} y1="85" x2={10 + i * 15} y2="93" stroke="#CBD5E1" strokeWidth="2" />
    ))}
    <line x1="85" y1="10" x2="85" y2="78" stroke="#94A3B8" strokeWidth="2" strokeDasharray="5 5" />
    <line x1="25" y1="14" x2="85" y2="78" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" strokeDasharray="90" strokeDashoffset={90 * (1 - Math.min(1, progress * 2))} />
    <line x1="85" y1="78" x2="145" y2="14" stroke="#5B5BF7" strokeWidth="4" strokeLinecap="round" strokeDasharray="90" strokeDashoffset={90 * (1 - Math.max(0, progress * 2 - 1))} />
    <text x="66" y="50" fontFamily="Poppins" fontWeight="600" fontSize="14" fill="#B45309">i</text>
    <text x="96" y="50" fontFamily="Poppins" fontWeight="600" fontSize="14" fill="#4338CA">r</text>
  </svg>
);

const Block: React.FC<{
  at: number;
  icon: React.ReactNode;
  color: string;
  title: string;
  time?: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}> = ({at, icon, color, title, time, children, aside}) => {
  const frame = useCurrentFrame();
  const show = tween(frame, [at, at + 8], [0, 1]);
  return (
    <div style={{position: 'relative', marginTop: 14}}>
      <div style={{position: 'absolute', inset: 0, opacity: 1 - show, display: 'flex', gap: 14}}>
        <Skeleton w={40} h={40} r={12} />
        <div style={{flex: 1}}>
          <Skeleton w="45%" h={14} />
          <Skeleton w="90%" h={10} style={{marginTop: 12}} />
          <Skeleton w="70%" h={10} style={{marginTop: 10}} />
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 14,
          padding: '14px 16px',
          borderRadius: 16,
          background: '#F8F9FD',
          borderLeft: `5px solid ${color}`,
          opacity: show,
          transform: `translateY(${(1 - show) * 10}px)`,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            minWidth: 40,
            borderRadius: 12,
            background: `${color}1F`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        <div style={{flex: 1}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 10, fontWeight: 700, fontSize: 18, color: C.ink}}>
            {title}
            {time ? (
              <span style={{display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color: C.slate500}}>
                <Clock3 size={14} /> {time}
              </span>
            ) : null}
          </div>
          <div style={{fontSize: 15, lineHeight: 1.5, color: C.slate600, marginTop: 4, fontWeight: 500}}>{children}</div>
        </div>
        {aside}
      </div>
    </div>
  );
};

const LessonPlanDoc: React.FC = () => {
  const frame = useCurrentFrame();
  const ready = frame >= READY;
  return (
    <div
      style={{
        width: 620,
        borderRadius: 28,
        background: C.white,
        boxShadow: cardShadow,
        padding: '30px 34px',
        fontFamily: FONT,
        overflow: 'hidden',
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <LogoMark size={30} shadow={false} />
          <span style={{fontSize: 14, fontWeight: 600, color: C.slate500, letterSpacing: '0.1em'}}>LESSON PLAN</span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 14px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            background: ready ? '#DCFCE7' : '#EEEEFE',
            color: ready ? C.greenDeep : C.indigo,
          }}
        >
          {ready ? <CircleCheck size={16} /> : <Sparkles size={16} />}
          {ready ? 'Ready to teach' : 'Generating…'}
        </div>
      </div>
      <div style={{fontSize: 31, fontWeight: 700, color: C.ink, marginTop: 18, letterSpacing: '-0.01em'}}>
        Light: Reflection &amp; Mirrors
      </div>
      <div style={{display: 'flex', gap: 8, marginTop: 10}}>
        {[
          {t: 'Class 8', c: C.indigo, b: '#EEEEFE'},
          {t: 'Science', c: '#C2410C', b: '#FFF1E2'},
          {t: '40 minutes', c: C.greenDeep, b: '#DCFCE7'},
        ].map((chip) => (
          <span key={chip.t} style={{padding: '5px 14px', borderRadius: 999, fontSize: 14, fontWeight: 600, color: chip.c, background: chip.b}}>
            {chip.t}
          </span>
        ))}
      </div>
      <div style={{height: 1, background: C.slate200, margin: '18px 0 4px'}} />
      <Block at={BLOCKS_AT[0]} icon={<Target size={22} color={C.indigo} />} color={C.indigo} title="Learning Objectives">
        • Explain how light is reflected
        <br />• State the two laws of reflection
        <br />• Compare regular and diffused reflection
      </Block>
      <Block at={BLOCKS_AT[1]} icon={<Zap size={22} color={C.saffron} />} color={C.saffron} title="Warm-up" time="5 min">
        “Why can we see ourselves in a mirror, but not in a wall?”
      </Block>
      <Block at={BLOCKS_AT[2]} icon={<FlaskConical size={22} color={C.pink} />} color={C.pink} title="Activity" time="15 min">
        Build a simple periscope using two plane mirrors.
      </Block>
      <Block
        at={BLOCKS_AT[3]}
        icon={<Lightbulb size={22} color={C.sky} />}
        color={C.sky}
        title="Explanation"
        time="10 min"
        aside={<RayDiagram progress={tween(frame, [BLOCKS_AT[3] + 4, BLOCKS_AT[3] + 26], [0, 1])} />}
      >
        Angle of incidence
        <br />= angle of reflection
      </Block>
      <Block at={BLOCKS_AT[4]} icon={<CircleCheck size={22} color={C.green} />} color={C.green} title="Assessment" time="10 min">
        5-question quiz + exit ticket
      </Block>
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginTop: 20,
          opacity: tween(frame, [READY, READY + 8], [0, 1]),
          transform: `translateY(${tween(frame, [READY, READY + 12], [12, 0])}px)`,
        }}
      >
        {[
          {t: 'Download PDF', Icon: Download, primary: true},
          {t: 'Edit', Icon: PenLine},
          {t: 'Share', Icon: Share2},
        ].map(({t, Icon, primary}) => (
          <div
            key={t}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              background: primary ? brandGradient : C.slate100,
              color: primary ? C.white : C.slate700,
            }}
          >
            <Icon size={17} /> {t}
          </div>
        ))}
      </div>
    </div>
  );
};

export const Scene03Lesson: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const phoneIn = pop(frame, fps, 2, 18, 90);
  const doc = pop(frame, fps, T.doc, 16, 110);
  const pressed = frame >= T.generate - 2 && frame <= T.generate + 4 ? 1 : 0;
  const glow = tween(frame, [T.generate, T.generate + 6], [0, 1]) * tween(frame, [T.generate + 10, T.generate + 30], [1, 0]);

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      {/* Left: on-screen text */}
      <div style={{position: 'absolute', left: 120, top: 250, width: 660}}>
        <div style={{opacity: tween(frame, [4, 14], [0, 1])}}>
          <Kicker>AI Lesson Planner</Kicker>
        </div>
        <MaskWords text="Lesson Plans" at={8} style={{fontSize: 92, fontWeight: 800, color: C.white, letterSpacing: '-0.03em', marginTop: 22}} />
        <Breadcrumb
          style={{marginTop: 26}}
          size={27}
          items={[
            {label: 'Class 8', at: T.class + 14},
            {label: 'Science', at: T.subject + 14},
            {label: 'Light', at: T.chapter + 14},
          ]}
        />
        <div style={{display: 'flex', flexDirection: 'column', gap: 22, marginTop: 50}}>
          <CheckItem label="Structured" at={BLOCKS_AT[0] + 6} />
          <CheckItem label="Creative" at={BLOCKS_AT[2] + 6} />
          <CheckItem label="Classroom-ready" at={READY} />
        </div>
      </div>

      {/* Phone */}
      <div
        style={{
          position: 'absolute',
          left: 790,
          top: 128,
          transform: `translateY(${(1 - phoneIn) * 700}px) scale(${1 - doc * 0.04})`,
          opacity: tween(frame, [0, 6], [0, 1]) * (1 - doc * 0.12),
        }}
      >
        <Phone width={400}>
          <div style={{display: 'flex', alignItems: 'center', gap: 6, padding: '8px 18px', fontWeight: 700, fontSize: 19, color: C.ink}}>
            <ChevronLeft size={24} color={C.slate600} /> New Lesson Plan
          </div>
          <SelectField top={56} label="CLASS" placeholder="Select class" value="Class 8" options={['Class 7', 'Class 8', 'Class 9']} tapAt={T.class} enterAt={6} />
          <SelectField top={144} label="SUBJECT" placeholder="Select subject" value="Science" options={['Mathematics', 'Science', 'English']} tapAt={T.subject} enterAt={9} />
          <SelectField top={232} label="CHAPTER" placeholder="Select chapter" value="Light" options={['Sound', 'Light', 'Force & Pressure']} tapAt={T.chapter} enterAt={12} />
          <TypeField top={320} label="INSTRUCTIONS (OPTIONAL)" text="Activity-based, with a fun experiment" typeAt={T.type} enterAt={15} />
          <div style={{position: 'absolute', left: 20, right: 20, top: 440}}>
            <GenerateButton label="Generate Lesson Plan" pressed={pressed} glow={glow} />
          </div>
          <div style={{position: 'absolute', left: 20, right: 20, top: 520, opacity: tween(frame, [18, 28], [0, 1])}}>
            <div style={{fontSize: 14, fontWeight: 600, color: C.slate500}}>Recent plans</div>
            {[
              {t: 'Fractions', s: 'Class 6 · Maths'},
              {t: 'Photosynthesis', s: 'Class 7 · Science'},
            ].map((r) => (
              <div key={r.t} style={{marginTop: 10, padding: '10px 14px', borderRadius: 14, background: C.white, display: 'flex', flexDirection: 'column'}}>
                <span style={{fontSize: 15, fontWeight: 600, color: C.ink}}>{r.t}</span>
                <span style={{fontSize: 13, color: C.slate500}}>{r.s}</span>
              </div>
            ))}
          </div>
          <Tap x={188} y={56 + 20 + 25} at={T.class} />
          <Tap x={188} y={144 + 20 + 25} at={T.subject} />
          <Tap x={188} y={232 + 20 + 25} at={T.chapter} />
          <Tap x={188} y={467} at={T.generate} />
        </Phone>
      </div>

      {/* Generated lesson plan */}
      <div
        style={{
          position: 'absolute',
          left: 1230,
          top: 110,
          opacity: tween(frame, [T.doc, T.doc + 6], [0, 1]),
          transform: `translateX(${(1 - doc) * -320}px) scale(${0.55 + 0.45 * doc})`,
          transformOrigin: '0% 50%',
        }}
      >
        <LessonPlanDoc />
      </div>

      <Sfx at={T.class} name="tap" volume={0.5} />
      <Sfx at={T.subject} name="tap" volume={0.5} />
      <Sfx at={T.chapter} name="tap" volume={0.5} />
      <Sfx at={T.type} name="type" volume={0.35} frames={24} />
      <Sfx at={T.generate} name="tap" volume={0.5} />
      <Sfx at={T.generate + 2} name="shimmer" volume={0.4} />
      <Sfx at={T.doc} name="whoosh" volume={0.4} />
      {BLOCKS_AT.map((b) => (
        <Sfx key={b} at={b} name="pop-high" volume={0.18} />
      ))}
      <Sfx at={READY} name="success" volume={0.4} />
    </AbsoluteFill>
  );
};
