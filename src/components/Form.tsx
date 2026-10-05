import {Check, ChevronDown} from 'lucide-react';
import React from 'react';
import {useCurrentFrame} from 'remotion';
import {caretVisible, tween, typed} from '../anim';
import {C, FONT} from '../theme';

const FIELD_LEFT = 20;
const FIELD_WIDTH = 336;

/** A dropdown field that opens, highlights `value` and closes around the tap at frame `tapAt`. */
export const SelectField: React.FC<{
  top: number;
  label: string;
  placeholder: string;
  value: string;
  options: string[];
  tapAt: number;
  enterAt?: number;
}> = ({top, label, placeholder, value, options, tapAt, enterAt = 0}) => {
  const frame = useCurrentFrame();
  const open = tween(frame, [tapAt + 1, tapAt + 5], [0, 1]) * tween(frame, [tapAt + 13, tapAt + 17], [1, 0]);
  const chosen = frame >= tapAt + 14;
  const highlight = frame >= tapAt + 7;
  const focused = frame >= tapAt && frame < tapAt + 17;
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: FIELD_LEFT,
        width: FIELD_WIDTH,
        fontFamily: FONT,
        zIndex: open > 0 ? 10 : 1,
        opacity: tween(frame, [enterAt, enterAt + 8], [0, 1]),
        transform: `translateY(${tween(frame, [enterAt, enterAt + 12], [16, 0])}px)`,
      }}
    >
      <div style={{fontSize: 13, fontWeight: 600, color: C.slate500, marginBottom: 6, letterSpacing: '0.02em'}}>{label}</div>
      <div
        style={{
          height: 50,
          borderRadius: 14,
          background: C.white,
          border: `2px solid ${focused ? C.indigo : chosen ? '#C7C9FB' : '#E3E6F0'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 14px',
          fontSize: 16,
          fontWeight: chosen ? 600 : 500,
          color: chosen ? C.ink : C.slate400,
        }}
      >
        <span>{chosen ? value : placeholder}</span>
        {chosen ? (
          <div style={{width: 24, height: 24, borderRadius: 12, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Check size={15} color={C.white} strokeWidth={3.2} />
          </div>
        ) : (
          <ChevronDown size={20} color={C.slate400} />
        )}
      </div>
      {open > 0 ? (
        <div
          style={{
            position: 'absolute',
            top: 78,
            left: 0,
            right: 0,
            borderRadius: 14,
            background: C.white,
            boxShadow: '0 18px 36px -10px rgba(15,23,42,0.35)',
            padding: 6,
            opacity: open,
            transform: `translateY(${(1 - open) * -10}px)`,
          }}
        >
          {options.map((o) => {
            const active = highlight && o === value;
            return (
              <div
                key={o}
                style={{
                  height: 38,
                  borderRadius: 10,
                  padding: '0 12px',
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 15,
                  fontWeight: active ? 600 : 500,
                  color: active ? C.indigo : C.slate600,
                  background: active ? '#EEEEFE' : 'transparent',
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

/** A text area that types `text` starting at frame `typeAt`. */
export const TypeField: React.FC<{top: number; label: string; text: string; typeAt: number; enterAt?: number; height?: number}> = ({
  top,
  label,
  text,
  typeAt,
  enterAt = 0,
  height = 80,
}) => {
  const frame = useCurrentFrame();
  const shown = typed(text, frame, typeAt, 1.6);
  const typing = frame >= typeAt - 4 && frame < typeAt + text.length / 1.6 + 10;
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left: FIELD_LEFT,
        width: FIELD_WIDTH,
        fontFamily: FONT,
        opacity: tween(frame, [enterAt, enterAt + 8], [0, 1]),
        transform: `translateY(${tween(frame, [enterAt, enterAt + 12], [16, 0])}px)`,
      }}
    >
      <div style={{fontSize: 13, fontWeight: 600, color: C.slate500, marginBottom: 6, letterSpacing: '0.02em'}}>{label}</div>
      <div
        style={{
          height,
          borderRadius: 14,
          background: C.white,
          border: `2px solid ${typing ? C.indigo : '#E3E6F0'}`,
          padding: '12px 14px',
          fontSize: 15,
          lineHeight: 1.4,
          fontWeight: 500,
          color: shown ? C.ink : C.slate400,
        }}
      >
        {shown || 'Add instructions…'}
        {typing && caretVisible(frame) ? <span style={{color: C.indigo, fontWeight: 400}}>|</span> : null}
      </div>
    </div>
  );
};
