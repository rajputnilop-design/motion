import {ArrowLeft, Check, ChevronDown, Copy, Eye, FileDown, FileText, Send, Sparkles} from 'lucide-react';
import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {caretVisible, easeInOut, pop, tween, typed} from '../anim';
import {C, DEVA, purpleGradient, SANS, SERIF} from '../theme';
import {Tap} from './ui';

export const STUDIO_TABS = ['Question Paper', 'Lesson Plan', 'Worksheet', 'Presentation'];

export type StudioField = {label: string; placeholder: string; value: string; options: string[]; tapAt?: number; deva?: boolean};

const CARD_W = 900;
const PAD = 30;
const COL_GAP = 22;
const ROW_H = 92;
const COL_W = (CARD_W - PAD * 2 - COL_GAP) / 2;

const Select: React.FC<{f: StudioField; x: number; y: number}> = ({f, x, y}) => {
  const frame = useCurrentFrame();
  const tapAt = f.tapAt ?? -100;
  const open = tween(frame, [tapAt + 1, tapAt + 5], [0, 1]) * tween(frame, [tapAt + 13, tapAt + 17], [1, 0]);
  const chosen = frame >= tapAt + 14;
  const focused = frame >= tapAt && frame < tapAt + 18;
  const font = f.deva ? DEVA : SANS;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: COL_W, zIndex: open > 0 ? 20 : 1}}>
      <div style={{fontSize: 12, fontWeight: 600, color: '#8E8C99', letterSpacing: '0.08em', marginBottom: 8}}>{f.label}</div>
      <div
        style={{
          height: 50,
          borderRadius: 12,
          background: '#1D1D20',
          border: `1.5px solid ${focused ? '#8B6CF6' : '#2A2A2E'}`,
          boxShadow: focused ? '0 0 0 4px rgba(116,80,239,0.15)' : undefined,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          fontFamily: chosen ? font : SANS,
          fontSize: 16,
          fontWeight: chosen ? 500 : 400,
          color: chosen ? C.text : '#6B6974',
        }}
      >
        <span>{chosen ? f.value : f.placeholder}</span>
        {chosen ? (
          <div style={{width: 22, height: 22, borderRadius: 11, background: 'rgba(34,197,94,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Check size={14} color={C.green} strokeWidth={3} />
          </div>
        ) : (
          <ChevronDown size={18} color="#6B6974" />
        )}
      </div>
      {open > 0 ? (
        <div
          style={{
            position: 'absolute',
            top: 84,
            left: 0,
            right: 0,
            borderRadius: 14,
            background: '#1D1D20',
            border: '1px solid #2E2E33',
            boxShadow: '0 24px 40px -12px rgba(0,0,0,0.8)',
            padding: 6,
            opacity: open,
            transform: `translateY(${(1 - open) * -8}px)`,
          }}
        >
          {f.options.map((o) => {
            const active = frame >= tapAt + 7 && o === f.value;
            return (
              <div
                key={o}
                style={{
                  height: 40,
                  borderRadius: 10,
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  fontFamily: f.deva ? DEVA : SANS,
                  fontSize: 15,
                  color: active ? '#A88BFA' : '#C4C2CE',
                  background: active ? C.activeNav : 'transparent',
                }}
              >
                {o}
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

const Difficulty: React.FC<{x: number; y: number; tapAt: number}> = ({x, y, tapAt}) => {
  const frame = useCurrentFrame();
  const move = tween(frame, [tapAt, tapAt + 8], [0, 1], easeInOut);
  const w = (CARD_W - PAD * 2) / 3;
  return (
    <div style={{position: 'absolute', left: x, top: y, width: CARD_W - PAD * 2}}>
      <div style={{fontSize: 12, fontWeight: 600, color: '#8E8C99', letterSpacing: '0.08em', marginBottom: 8}}>DIFFICULTY</div>
      <div style={{position: 'relative', height: 50, borderRadius: 12, background: '#1D1D20', border: '1.5px solid #2A2A2E', display: 'flex'}}>
        <div
          style={{
            position: 'absolute',
            top: 4,
            left: 4 + move * w,
            width: w - 8,
            height: 39,
            borderRadius: 9,
            background: frame >= tapAt ? C.activeNav : '#2A2A2E',
            border: frame >= tapAt ? '1px solid rgba(139,108,246,0.5)' : undefined,
          }}
        />
        {['Easy', 'Medium', 'Hard'].map((l, i) => {
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
                fontWeight: 500,
                color: active ? (frame >= tapAt ? '#A88BFA' : C.text) : '#6B6974',
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

/** Studio page with the content-type tabs and a generation form. Coordinates are within the app content area. */
export const StudioForm: React.FC<{
  tab: string;
  fields: StudioField[];
  difficultyAt?: number;
  generateAt: number;
  buttonLabel: string;
  left?: number;
  top?: number;
  topic?: {text: string; typeAt: number};
}> = ({tab, fields, difficultyAt, generateAt, buttonLabel, left = 60, top = 40, topic}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cardTop = top + 150;
  const rows = Math.ceil(fields.length / 2);
  const topicH = topic ? ROW_H : 0;
  const diffY = PAD + topicH + rows * ROW_H;
  const shownTopic = topic ? typed(topic.text, frame, topic.typeAt, 0.9) : '';
  const typingTopic = topic ? frame >= topic.typeAt - 4 && frame < topic.typeAt + topic.text.length / 0.9 + 8 : false;
  const btnY = diffY + (difficultyAt !== undefined ? ROW_H : 0) + 8;
  const pressed = frame >= generateAt - 2 && frame <= generateAt + 4 ? 0.97 : 1;
  const glow = tween(frame, [generateAt, generateAt + 6], [0, 1]) * tween(frame, [generateAt + 10, generateAt + 26], [1, 0]);
  return (
    <div style={{position: 'absolute', inset: 0, fontFamily: SANS}}>
      <div style={{position: 'absolute', left, top}}>
        <div style={{fontFamily: SERIF, fontSize: 36, color: C.text}}>Studio</div>
        <div style={{fontSize: 15, color: C.text2, marginTop: 4}}>Create classroom-ready material in seconds.</div>
        <div style={{display: 'flex', gap: 10, marginTop: 22}}>
          {STUDIO_TABS.map((t) => (
            <div
              key={t}
              style={{
                padding: '9px 18px',
                borderRadius: 999,
                fontSize: 14,
                fontWeight: 500,
                color: t === tab ? '#B9A3FF' : '#A8A6B3',
                background: t === tab ? C.activeNav : '#161617',
                border: `1px solid ${t === tab ? 'rgba(139,108,246,0.45)' : '#26262A'}`,
              }}
            >
              {t}
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left,
          top: cardTop,
          width: CARD_W,
          height: btnY + 56 + PAD,
          borderRadius: 22,
          background: C.panel,
          border: `1px solid ${C.line}`,
        }}
      >
        {topic ? (
          <div style={{position: 'absolute', left: PAD, top: PAD, width: CARD_W - PAD * 2}}>
            <div style={{fontSize: 12, fontWeight: 600, color: '#8E8C99', letterSpacing: '0.08em', marginBottom: 8}}>TOPIC</div>
            <div
              style={{
                height: 50,
                borderRadius: 12,
                background: '#1D1D20',
                border: `1.5px solid ${typingTopic ? '#8B6CF6' : '#2A2A2E'}`,
                boxShadow: typingTopic ? '0 0 0 4px rgba(116,80,239,0.15)' : undefined,
                display: 'flex',
                alignItems: 'center',
                padding: '0 16px',
                fontSize: 17,
                color: shownTopic ? C.text : '#6B6974',
              }}
            >
              {shownTopic || 'Enter a topic…'}
              {typingTopic && caretVisible(frame) ? <span style={{color: '#8B6CF6'}}>|</span> : null}
            </div>
          </div>
        ) : null}
        {fields.map((f, i) => (
          <Select key={f.label} f={f} x={PAD + (i % 2) * (COL_W + COL_GAP)} y={PAD + topicH + Math.floor(i / 2) * ROW_H} />
        ))}
        {difficultyAt !== undefined ? <Difficulty x={PAD} y={diffY} tapAt={difficultyAt} /> : null}
        <div
          style={{
            position: 'absolute',
            left: PAD,
            top: btnY,
            width: CARD_W - PAD * 2,
            height: 56,
            borderRadius: 14,
            background: purpleGradient,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            color: C.white,
            fontSize: 17,
            fontWeight: 600,
            transform: `scale(${pressed})`,
            boxShadow: `0 12px 30px -10px rgba(116,80,239,0.8), 0 0 ${glow * 50}px rgba(139,108,246,${glow})`,
            opacity: tween(frame, [0, 10], [0, 1]) * (0.85 + 0.15 * pop(frame, fps, 0)),
          }}
        >
          <Sparkles size={19} /> {buttonLabel}
        </div>
        {fields.map((f, i) =>
          f.tapAt !== undefined ? (
            <Tap key={f.label} x={PAD + (i % 2) * (COL_W + COL_GAP) + COL_W * 0.55} y={PAD + topicH + Math.floor(i / 2) * ROW_H + 45} at={f.tapAt} />
          ) : null,
        )}
        {difficultyAt !== undefined ? <Tap x={PAD + (CARD_W - PAD * 2) / 2} y={diffY + 45} at={difficultyAt} /> : null}
        <Tap x={CARD_W / 2} y={btnY + 28} at={generateAt} />
      </div>
    </div>
  );
};

/** Header + toolbar of a generated document, as on the real question-paper page. */
export const DocHeader: React.FC<{
  title: string;
  meta: string;
  deva?: boolean;
  answerKeyAt?: number;
  pdfAt?: number;
}> = ({title, meta, deva, answerKeyAt = 99999, pdfAt = 99999}) => {
  const frame = useCurrentFrame();
  const btn = (label: string, Icon: React.FC<{size?: number}> | null, active: boolean, at: number) => (
    <div
      key={label}
      style={{
        height: 44,
        padding: '0 18px',
        borderRadius: 22,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 15,
        fontWeight: 500,
        color: active ? '#C4B5FD' : C.text,
        background: active ? C.activeNav : C.panel,
        border: `1px solid ${active ? 'rgba(139,108,246,0.5)' : '#2D2D2F'}`,
        transform: `scale(${frame >= at - 2 && frame <= at + 3 ? 0.94 : 1})`,
      }}
    >
      {Icon ? <Icon size={17} /> : null}
      {label}
    </div>
  );
  return (
    <div style={{fontFamily: SANS}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 12,
            background: C.panel,
            border: '1px solid #2D2D2F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={19} color="#A1A1AA" />
        </div>
        <div>
          <div style={{fontFamily: deva ? DEVA : SANS, fontSize: 20, fontWeight: 600, color: C.text}}>{title}</div>
          <div style={{fontSize: 13, color: '#8A8597', marginTop: 2}}>{meta}</div>
        </div>
      </div>
      <div style={{display: 'flex', gap: 10, marginTop: 18}}>
        {btn(frame >= answerKeyAt ? 'Hide answer key' : 'Show answer key', frame >= answerKeyAt ? Eye : null, frame >= answerKeyAt, answerKeyAt)}
        {btn('Copy', Copy, false, 99999)}
        {btn('PDF', FileDown, frame >= pdfAt && frame < pdfAt + 30, pdfAt)}
        {btn('DOCX', FileText, false, 99999)}
        <div
          style={{
            height: 44,
            padding: '0 20px',
            borderRadius: 22,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 15,
            fontWeight: 600,
            color: C.white,
            background: '#7A52F0',
            boxShadow: '0 10px 24px -8px rgba(122,82,240,0.8)',
          }}
        >
          <Send size={16} /> Publish
        </div>
      </div>
    </div>
  );
};

/** Bottom-right toast. */
export const Toast: React.FC<{at: number; children: React.ReactNode}> = ({at, children}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (frame < at) return null;
  const p = pop(frame, fps, at, 15, 140);
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 20px',
        borderRadius: 14,
        background: '#1D1D20',
        border: '1px solid #2E2E33',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.8)',
        fontFamily: SANS,
        fontSize: 15,
        color: C.text,
        transform: `translateY(${(1 - p) * 40}px)`,
        opacity: tween(frame, [at, at + 5], [0, 1]),
      }}
    >
      <div style={{width: 26, height: 26, borderRadius: 13, background: 'rgba(34,197,94,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Check size={16} color={C.green} strokeWidth={3} />
      </div>
      {children}
    </div>
  );
};
