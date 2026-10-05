import {MapPin, Play} from 'lucide-react';
import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {pop, tween} from '../anim';
import {Avatar, AvatarStyle} from '../components/Avatar';
import {LogoMark} from '../components/Logo';
import {MaskWords, Sfx} from '../components/ui';
import {PlantCellArt} from '../illustrations/MiniDiagrams';
import {C, cardShadow, FONT, gradientText, saffronGradient} from '../theme';
import {TOOLS} from '../tools';

type Teacher = {
  name: string;
  subject: string;
  place: string;
  tool: (typeof TOOLS)[number]['key'];
  screen: string;
  avatar: AvatarStyle;
  Mini: React.FC;
};

const Lines: React.FC<{n: number; color?: string}> = ({n, color = '#E2E8F0'}) => (
  <>
    {new Array(n).fill(0).map((_, i) => (
      <div key={i} style={{height: 6, width: `${[92, 78, 86, 64][i % 4]}%`, borderRadius: 3, background: color, marginTop: 7}} />
    ))}
  </>
);

const FractionsMini: React.FC = () => (
  <div>
    <svg width="74" height="74" viewBox="-37 -37 74 74" style={{display: 'block', margin: '4px auto 0'}}>
      <circle r="34" fill="#FFE8CC" />
      <path d="M 0 0 L 0 -34 A 34 34 0 0 1 34 0 Z" fill="#FF9933" />
      <path d="M 0 0 L 34 0 A 34 34 0 0 1 0 34 Z" fill="#FFB65C" />
      <circle r="34" fill="none" stroke="#C2410C" strokeWidth="2" />
    </svg>
    <div style={{fontSize: 12, fontWeight: 700, color: C.ink, textAlign: 'center', marginTop: 4}}>¼ + ¼ = ½</div>
    <Lines n={2} />
  </div>
);

const CellMini: React.FC = () => (
  <div>
    <div style={{height: 80, borderRadius: 8, overflow: 'hidden', marginTop: 4}}>
      <PlantCellArt />
    </div>
    <Lines n={3} />
  </div>
);

const PoemMini: React.FC = () => (
  <div style={{fontSize: 10.5, lineHeight: 1.5, color: C.slate600, fontStyle: 'italic', marginTop: 6}}>
    <div style={{fontWeight: 700, fontStyle: 'normal', color: '#7C3AED', fontSize: 12}}>♪ The Rain Song</div>
    Pitter-patter on my roof,
    <br />
    clouds are dancing high,
    <br />
    puddles giggle, frogs all sing…
    <Lines n={1} color="#EDE9FE" />
  </div>
);

const SlideMini: React.FC = () => (
  <div>
    <div style={{height: 70, borderRadius: 8, marginTop: 4, background: 'linear-gradient(135deg, #0EA5E9, #5B5BF7)', padding: 8, color: C.white, fontSize: 11, fontWeight: 700, lineHeight: 1.2}}>
      India’s Freedom Struggle
      <div style={{display: 'flex', alignItems: 'center', gap: 4, marginTop: 12}}>
        {[0, 1, 2, 3].map((i) => (
          <React.Fragment key={i}>
            <div style={{width: 9, height: 9, borderRadius: 5, background: C.white}} />
            {i < 3 ? <div style={{flex: 1, height: 2, background: 'rgba(255,255,255,0.6)'}} /> : null}
          </React.Fragment>
        ))}
      </div>
    </div>
    <Lines n={3} />
  </div>
);

const VideoMini: React.FC = () => (
  <div>
    <div style={{position: 'relative', height: 76, borderRadius: 8, marginTop: 4, background: 'linear-gradient(135deg, #1E293B, #334155)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg width="90" height="40" viewBox="0 0 90 40" style={{position: 'absolute', left: 8, top: 8}}>
        <rect x="6" y="20" width="26" height="14" rx="3" fill="#F97316" />
        <line x1="36" y1="27" x2="70" y2="27" stroke="#FDE68A" strokeWidth="3" strokeDasharray="5 4" />
        <path d="M 66 21 L 76 27 L 66 33" fill="none" stroke="#FDE68A" strokeWidth="3" />
      </svg>
      <div style={{width: 30, height: 30, borderRadius: 15, background: C.rose, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1}}>
        <Play size={14} fill={C.white} color={C.white} />
      </div>
    </div>
    <div style={{fontSize: 11, fontWeight: 700, color: C.ink, marginTop: 6}}>Newton’s Laws · 2:10</div>
    <Lines n={2} />
  </div>
);

const LessonMini: React.FC = () => (
  <div>
    <svg width="120" height="58" viewBox="0 0 120 58" style={{display: 'block', marginTop: 6}}>
      <rect width="120" height="58" rx="8" fill="#E0F2FE" />
      <path d="M 0 58 L 34 18 L 56 40 L 78 12 L 120 58 Z" fill="#60A5FA" />
      <path d="M 78 12 L 70 22 L 78 20 L 86 22 Z" fill="#fff" />
      <circle cx="100" cy="14" r="7" fill="#FBBF24" />
    </svg>
    {['Objectives', 'Activity', 'Quiz'].map((t, i) => (
      <div key={t} style={{display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 11, fontWeight: 600, color: C.slate600}}>
        <div style={{width: 8, height: 8, borderRadius: 2, background: ['#5B5BF7', '#EC4899', '#22C55E'][i]}} />
        {t}
      </div>
    ))}
  </div>
);

const TEACHERS: Teacher[] = [
  {
    name: 'Priya Sharma',
    subject: 'Mathematics',
    place: 'Jaipur, Rajasthan',
    tool: 'papers',
    screen: 'Fractions Test',
    avatar: {bg: '#FFE8CC', skin: '#C68642', hair: '#1F1410', shirt: '#F97316', style: 'long'},
    Mini: FractionsMini,
  },
  {
    name: 'Arjun Nair',
    subject: 'Biology',
    place: 'Kochi, Kerala',
    tool: 'images',
    screen: 'Plant Cell',
    avatar: {bg: '#DCFCE7', skin: '#8D5524', hair: '#111111', shirt: '#16A34A', style: 'short', glasses: true},
    Mini: CellMini,
  },
  {
    name: 'Ananya Iyer',
    subject: 'English',
    place: 'Chennai, Tamil Nadu',
    tool: 'songs',
    screen: 'Poem',
    avatar: {bg: '#EDE9FE', skin: '#A0662F', hair: '#1A1A1A', shirt: '#8B5CF6', style: 'bun'},
    Mini: PoemMini,
  },
  {
    name: 'Rohan Das',
    subject: 'History',
    place: 'Kolkata, West Bengal',
    tool: 'slides',
    screen: 'Slides',
    avatar: {bg: '#E0F2FE', skin: '#B97A50', hair: '#2A1A12', shirt: '#0EA5E9', style: 'wavy'},
    Mini: SlideMini,
  },
  {
    name: 'Gurpreet Kaur',
    subject: 'Physics',
    place: 'Ludhiana, Punjab',
    tool: 'videos',
    screen: 'Video',
    avatar: {bg: '#FFE4E6', skin: '#E0AC69', hair: '#2B1B14', shirt: '#F43F5E', style: 'long', glasses: true},
    Mini: VideoMini,
  },
  {
    name: 'Tenzin Bhutia',
    subject: 'Geography',
    place: 'Gangtok, Sikkim',
    tool: 'lesson',
    screen: 'Lesson Plan',
    avatar: {bg: '#E0E7FF', skin: '#D9A066', hair: '#121212', shirt: '#5B5BF7', style: 'short'},
    Mini: LessonMini,
  },
];

const CARD_W = 540;
const CARD_H = 252;
const POS = [
  {x: 110, y: 66},
  {x: 690, y: 66},
  {x: 1270, y: 66},
  {x: 110, y: 762},
  {x: 690, y: 762},
  {x: 1270, y: 762},
];
const FROM = [
  [-700, -300],
  [0, -500],
  [700, -300],
  [-700, 300],
  [0, 500],
  [700, 300],
];
const CARD_AT = [10, 16, 22, 13, 19, 25];

const TeacherCard: React.FC<{t: Teacher; i: number}> = ({t, i}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = CARD_AT[i];
  const p = pop(frame, fps, at, 15, 100);
  const tool = TOOLS.find((x) => x.key === t.tool)!;
  const float = Math.sin((frame + i * 17) / 24) * 5;
  return (
    <div
      style={{
        position: 'absolute',
        left: POS[i].x,
        top: POS[i].y,
        width: CARD_W,
        height: CARD_H,
        borderRadius: 28,
        background: C.white,
        boxShadow: cardShadow,
        fontFamily: FONT,
        opacity: tween(frame, [at, at + 6], [0, 1]),
        transform: `translate(${FROM[i][0] * (1 - p)}px, ${FROM[i][1] * (1 - p) + float}px) rotate(${(1 - p) * (i % 2 ? 8 : -8)}deg)`,
      }}
    >
      <div style={{position: 'absolute', left: 28, top: 28, display: 'flex', gap: 18, alignItems: 'center'}}>
        <div style={{borderRadius: '50%', boxShadow: `0 0 0 4px ${C.white}, 0 0 0 7px ${tool.color}55`}}>
          <Avatar a={t.avatar} size={92} />
        </div>
        <div style={{display: 'flex', flexDirection: 'column', gap: 4}}>
          <span style={{fontSize: 26, fontWeight: 700, color: C.ink, lineHeight: 1.1}}>{t.name}</span>
          <span style={{fontSize: 17, fontWeight: 600, color: tool.color}}>{t.subject} Teacher</span>
          <span style={{display: 'flex', alignItems: 'center', gap: 5, fontSize: 16, fontWeight: 500, color: C.slate500}}>
            <MapPin size={16} /> {t.place}
          </span>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 28,
          bottom: 26,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '9px 16px',
          borderRadius: 14,
          background: tool.tint,
          fontSize: 16,
          fontWeight: 600,
          color: C.ink,
        }}
      >
        <tool.Icon size={19} color={tool.color} />
        Creates {tool.label.toLowerCase()}
      </div>
      {/* Mini app screen */}
      <div
        style={{
          position: 'absolute',
          right: 26,
          top: -18,
          width: 150,
          height: 230,
          borderRadius: 22,
          background: '#0B0C11',
          padding: 6,
          boxShadow: '0 18px 30px -10px rgba(2,6,23,0.5)',
          transform: `rotate(${i % 2 ? 4 : -4}deg)`,
        }}
      >
        <div style={{width: '100%', height: '100%', borderRadius: 17, background: '#F5F6FB', padding: '10px 10px', overflow: 'hidden'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 5}}>
            <LogoMark size={16} shadow={false} />
            <span style={{fontSize: 10, fontWeight: 700, color: C.ink}}>{t.screen}</span>
          </div>
          <t.Mini />
        </div>
      </div>
    </div>
  );
};

export const Scene09Teachers: React.FC = () => {
  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 384, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6}}>
        <MaskWords text="Built for Teachers." at={6} style={{fontSize: 108, fontWeight: 800, color: C.white, letterSpacing: '-0.03em', justifyContent: 'center'}} />
        <MaskWords
          text="Designed for Real Classrooms."
          at={28}
          stagger={3}
          style={{fontSize: 62, fontWeight: 700, letterSpacing: '-0.02em', justifyContent: 'center'}}
          wordStyle={() => gradientText(saffronGradient)}
        />
      </div>
      {TEACHERS.map((t, i) => (
        <TeacherCard key={t.name} t={t} i={i} />
      ))}
      {CARD_AT.map((a, i) => (
        <Sfx key={i} at={a} name="whoosh-soft" volume={0.2} />
      ))}
      <Sfx at={6} name="pop" volume={0.25} />
    </AbsoluteFill>
  );
};
