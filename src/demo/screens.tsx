import {
  BookOpen,
  CalendarDays,
  ChartColumn,
  CircleCheck,
  ClipboardCheck,
  Compass,
  Info,
  KeyRound,
  Languages,
  Library,
  MessageCircle,
  MessagesSquare,
  NotebookPen,
  NotebookText,
  School,
  Settings,
  Speech,
  Users,
  WandSparkles,
} from 'lucide-react';
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {easeInOut, easeOut, tween} from '../anim';
import {AppShell} from '../components/AppShell';
import {Browser} from '../components/Browser';
import {ChatPage, Composer} from '../components/Chat';
import {Tap} from '../components/ui';
import {C, SERIF} from '../theme';
import {CONTENT_H, HEADER_H, NAV_H, SCREEN_W} from '../reels/mobile';

export const SCREEN_H = HEADER_H + CONTENT_H + NAV_H;

export type Rect = {x: number; y: number; w: number; h: number};

/** Dims the phone screen except for one rounded rectangle (screen coordinates, 376 x 750), with a glowing ring. */
export const Spotlight: React.FC<{rect: Rect; from: number; to: number; radius?: number}> = ({rect, from, to, radius = 14}) => {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 10) return null;
  const a = tween(frame, [from, from + 9], [0, 1], easeOut) * tween(frame, [to, to + 9], [1, 0], easeInOut);
  const grow = 1 + (1 - tween(frame, [from, from + 12], [0, 1], easeOut)) * 0.18;
  const pulse = 0.5 + 0.5 * Math.sin((frame - from) / 6);
  const pad = 5;
  const w = (rect.w + pad * 2) * grow;
  const h = (rect.h + pad * 2) * grow;
  const cx = rect.x + rect.w / 2;
  const cy = rect.y + rect.h / 2;
  return (
    <div style={{position: 'absolute', inset: 0, zIndex: 80, pointerEvents: 'none', overflow: 'hidden'}}>
      <div
        style={{
          position: 'absolute',
          left: cx - w / 2,
          top: cy - h / 2,
          width: w,
          height: h,
          borderRadius: radius + pad,
          boxShadow: `0 0 0 2000px rgba(3,3,8,${0.58 * a})`,
          border: `2px solid rgba(168,139,250,${a})`,
          outline: `${2 + 4 * pulse}px solid rgba(139,108,246,${0.25 * a})`,
          outlineOffset: 2,
        }}
      />
    </div>
  );
};

/** The bottom tab bar, lit up one tab at a time (screen coordinates). */
export const NavTour: React.FC<{from: number; to: number; marks: number[]}> = ({from, to, marks}) => {
  const frame = useCurrentFrame();
  const i = marks.filter((m) => frame >= m).length - 1;
  const slot = SCREEN_W / 5;
  return (
    <>
      <Spotlight rect={{x: 4, y: SCREEN_H - NAV_H + 3, w: SCREEN_W - 8, h: NAV_H - 8}} from={from} to={to} radius={16} />
      {i >= 0 && frame <= to + 6 ? (
        <div
          style={{
            position: 'absolute',
            zIndex: 81,
            left: slot * i + slot / 2 - 30,
            top: SCREEN_H - NAV_H + 6,
            width: 60,
            height: NAV_H - 14,
            borderRadius: 14,
            background: 'rgba(139,108,246,0.22)',
            border: '1.5px solid rgba(196,181,253,0.9)',
            transform: `scale(${1 + 0.12 * (1 - tween(frame, [marks[i], marks[i] + 8], [0, 1]))})`,
            opacity: tween(frame, [to, to + 6], [1, 0]),
          }}
        />
      ) : null}
    </>
  );
};

export const Toast: React.FC<{at: number; label: string; y?: number}> = ({at, label, y = 20}) => {
  const frame = useCurrentFrame();
  const o = tween(frame, [at, at + 6], [0, 1]) * tween(frame, [at + 34, at + 42], [1, 0]);
  if (o <= 0) return null;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, bottom: y, display: 'flex', justifyContent: 'center', opacity: o, transform: `translateY(${(1 - o) * 14}px)`, zIndex: 60}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 999, background: '#F4F4F5', color: C.ink, fontSize: 13.5, fontWeight: 600, boxShadow: '0 10px 30px rgba(0,0,0,0.5)'}}>
        <CircleCheck size={16} color="#16A34A" /> {label}
      </div>
    </div>
  );
};

const TOOLS = [
  {t: 'Lesson Planner', d: 'A period-by-period plan for your chapter, in your language.', I: NotebookPen},
  {t: 'Content Assistant', d: 'Explanations, examples, and board notes in seconds.', I: BookOpen},
  {t: 'Student Report Generator', d: 'Kind, specific report-card remarks. No student names needed.', I: NotebookText},
  {t: 'Smart Communication', d: 'Notes to parents, notices, and messages — done right.', I: MessagesSquare},
  {t: '', d: '', I: CalendarDays},
  {t: '', d: '', I: Languages},
];

export const TOOL_GRID = {top: 92, gap: 10, h: 178, w: (SCREEN_W - 28 - 10) / 2};
/** Screen-space rectangle of tool card `i` on the AI Tools page. */
export const toolRect = (i: number): Rect => ({
  x: 14 + (i % 2) * (TOOL_GRID.w + TOOL_GRID.gap),
  y: HEADER_H + TOOL_GRID.top + Math.floor(i / 2) * (TOOL_GRID.h + TOOL_GRID.gap),
  w: TOOL_GRID.w,
  h: TOOL_GRID.h,
});

/** Tools tab: "AI Tools — Purpose-built helpers for everyday teaching work." */
export const AIToolsM: React.FC<{tapAt?: number}> = ({tapAt = -99}) => (
  <div style={{position: 'absolute', inset: 0, padding: '14px 14px 0'}}>
    <div style={{fontFamily: SERIF, fontSize: 26, color: C.text}}>AI Tools</div>
    <div style={{fontSize: 13, color: '#8E8C99', marginTop: 4, lineHeight: 1.4}}>Purpose-built helpers for everyday teaching work.</div>
    {TOOLS.map(({t, d, I}, i) => {
      const r = toolRect(i);
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y - HEADER_H,
            width: r.w,
            height: r.h,
            borderRadius: 16,
            background: '#131315',
            border: '1px solid #232327',
            padding: '14px 13px',
          }}
        >
          <div style={{width: 38, height: 38, borderRadius: 11, background: C.activeNav, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <I size={18} color="#A88BFA" />
          </div>
          <div style={{fontSize: 14.5, fontWeight: 700, color: C.text, marginTop: 12, lineHeight: 1.25}}>{t}</div>
          <div style={{fontSize: 11.5, color: '#8E8C99', marginTop: 5, lineHeight: 1.4}}>{d}</div>
        </div>
      );
    })}
    <Tap x={toolRect(0).x + toolRect(0).w / 2} y={toolRect(0).y - HEADER_H + 70} at={tapAt} />
  </div>
);

export const MORE_ITEMS: {t: string; I: typeof ChartColumn; color?: string}[] = [
  {t: 'Analytics', I: ChartColumn},
  {t: 'Assessment', I: ClipboardCheck},
  {t: 'MahaTET Practice', I: School},
  {t: 'The Lab', I: WandSparkles},
  {t: 'Student Hub', I: Users},
  {t: 'App Guide', I: Compass},
  {t: 'Banks', I: Library},
  {t: 'English Speaking', I: Speech},
  {t: 'Books', I: BookOpen},
  {t: 'About', I: Info},
  {t: 'Settings', I: Settings},
  {t: 'Your API key', I: KeyRound},
  {t: 'WhatsApp Support', I: MessageCircle, color: '#25D366'},
];
const ROW = 44;

/** More tab: the full menu, with items lighting up as they are named. */
export const MoreMenuM: React.FC<{hl: {t: string; at: number}[]; until: number}> = ({hl, until}) => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', inset: 0, padding: '10px 10px 0'}}>
      {MORE_ITEMS.map(({t, I, color}, i) => {
        const at = hl.find((h) => h.t === t)?.at;
        const on = at !== undefined ? tween(frame, [at, at + 6], [0, 1]) * tween(frame, [until, until + 10], [1, 0]) : 0;
        const pop = at !== undefined ? tween(frame, [at, at + 5], [0, 1]) * tween(frame, [at + 5, at + 16], [1, 0]) : 0;
        return (
          <div
            key={t}
            style={{
              height: ROW - 4,
              marginBottom: 4,
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '0 14px',
              fontSize: 15,
              fontWeight: 500,
              color: on > 0.5 ? '#E9E3FF' : '#C9C7D1',
              background: `rgba(116,80,239,${0.28 * on})`,
              border: `1px solid rgba(168,139,250,${0.7 * on})`,
              boxShadow: on > 0 ? `0 0 ${18 * on}px -4px rgba(116,80,239,0.8)` : undefined,
              transform: `scale(${1 + 0.03 * pop})`,
            }}
          >
            <I size={19} color={color ?? (on > 0.5 ? '#B9A3FF' : '#8E8C99')} />
            {t}
          </div>
        );
      })}
    </div>
  );
};

/** aishikshamitra.com on a laptop: sidebar, chats and the Aasha welcome. */
export const DesktopView: React.FC = () => (
  <Browser url="aishikshamitra.com/chat">
    <AppShell active="chat">
      <ChatPage
        name="Aasha"
        chats={['🎙️ Aasha · Voice call', '🎙️ Aasha · Voice call', 'Lesson plan — Class 6', 'teach me', 'Question paper ideas', '🎙️ Aasha · Voice call']}
        composer={<Composer width={680} placeholder="Ask Aasha..." />}
      />
    </AppShell>
  </Browser>
);
