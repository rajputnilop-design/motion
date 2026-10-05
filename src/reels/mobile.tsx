import {ArrowLeft, AudioLines, ChevronDown, CircleUserRound, FileText, GraduationCap, Gift, Menu, MessageCircle, Sparkles} from 'lucide-react';
import React from 'react';
import {Img, staticFile, useCurrentFrame} from 'remotion';
import {easeInOut, tween} from '../anim';
import {C, SANS, SERIF} from '../theme';

// Logical size of the phone screen below the status bar (Phone width 400).
export const SCREEN_W = 376;
export const HEADER_H = 58;
export const NAV_H = 66;
export const CONTENT_H = 750 - HEADER_H - NAV_H;

export type Tab = 'chat' | 'studio' | 'tools' | 'courses' | 'more';

const NAV_ITEMS: {key: Tab; label: string; Icon: typeof MessageCircle}[] = [
  {key: 'chat', label: 'Chat', Icon: MessageCircle},
  {key: 'studio', label: 'Studio', Icon: FileText},
  {key: 'tools', label: 'Tools', Icon: Sparkles},
  {key: 'courses', label: 'Courses', Icon: GraduationCap},
  {key: 'more', label: 'More', Icon: Menu},
];

/** Mobile app chrome as in the live app: brand header and the five-tab bottom bar. */
export const MobileShell: React.FC<{tab: Tab; children: React.ReactNode; hideChrome?: boolean}> = ({tab, children, hideChrome}) => (
  <div style={{position: 'absolute', inset: 0, background: C.app, fontFamily: SANS, overflow: 'hidden'}}>
    {!hideChrome ? (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: HEADER_H,
          display: 'flex',
          alignItems: 'center',
          gap: 9,
          padding: '0 14px',
          borderBottom: `1px solid ${C.line}`,
          background: '#0B0B0E',
          zIndex: 5,
        }}
      >
        <Img src={staticFile('brand/logo.png')} style={{width: 30, height: 30}} />
        <div style={{display: 'flex', flexDirection: 'column', lineHeight: 1.05}}>
          <span style={{fontFamily: SERIF, fontWeight: 600, fontSize: 19, color: C.text}}>AIShikshaMitra</span>
          <span style={{fontSize: 7, fontWeight: 700, letterSpacing: '0.2em', color: '#7B60E1', marginTop: 2}}>THE AI BUILT FOR BHARAT</span>
        </div>
        <div style={{flex: 1}} />
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            border: '2px solid #C9A64A',
            background: 'radial-gradient(circle at 40% 35%, #2B3A7A, #121838)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircleUserRound size={22} color="#E8D49A" strokeWidth={1.6} />
        </div>
      </div>
    ) : null}
    <div style={{position: 'absolute', left: 0, right: 0, top: hideChrome ? 0 : HEADER_H, bottom: hideChrome ? 0 : NAV_H, overflow: 'hidden'}}>
      {children}
    </div>
    {!hideChrome ? (
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: NAV_H,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          borderTop: `1px solid ${C.line}`,
          background: '#0B0B0E',
          paddingBottom: 6,
          zIndex: 5,
        }}
      >
        {NAV_ITEMS.map(({key, label, Icon}) => {
          const active = key === tab;
          return (
            <div key={key} style={{position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, width: 64}}>
              <Icon size={21} color={active ? '#8B6CF6' : '#9A98A6'} strokeWidth={1.9} />
              {key === 'courses' ? (
                <div style={{position: 'absolute', left: 36, top: -6, width: 15, height: 15, borderRadius: 8, background: '#DABE47', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <Gift size={9} color="#3F3510" strokeWidth={2.6} />
                </div>
              ) : null}
              <span style={{fontSize: 11, fontWeight: 500, color: active ? '#8B6CF6' : '#9A98A6'}}>{label}</span>
            </div>
          );
        })}
      </div>
    ) : null}
  </div>
);

/** Screens that push in from the right like app navigation (or cross-fade, for tab switches). */
export const ScreenStack: React.FC<{screens: {from: number; to?: number; node: React.ReactNode; fade?: boolean}[]}> = ({screens}) => {
  const frame = useCurrentFrame();
  return (
    <>
      {screens.map((s, i) => {
        const next = screens[i + 1];
        const to = s.to ?? next?.from ?? 99999;
        if (frame < s.from - 1 || frame > to + 12) return null;
        const enter = i === 0 ? 1 : tween(frame, [s.from, s.from + (s.fade ? 8 : 11)], [0, 1], easeInOut);
        const exit = next?.fade ? 0 : tween(frame, [to, to + 11], [0, 1], easeInOut);
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              inset: 0,
              background: C.app,
              transform: s.fade ? `translateY(${(1 - enter) * 10}px)` : `translateX(${(1 - enter) * SCREEN_W - exit * SCREEN_W * 0.3}px)`,
              opacity: i === 0 ? 1 : Math.min(1, enter * 1.5),
              zIndex: i,
            }}
          >
            {s.node}
          </div>
        );
      })}
    </>
  );
};

/** A full-screen layer above the app chrome (voice call, camera, lock screen) that slides in and out. */
export const Overlay: React.FC<{from: number; to: number; children: React.ReactNode; enter?: 'up' | 'none'; exit?: 'up' | 'down'}> = ({
  from,
  to,
  children,
  enter = 'up',
  exit = 'down',
}) => {
  const frame = useCurrentFrame();
  if (frame < from - 1 || frame > to + 14) return null;
  const e = enter === 'none' ? 1 : tween(frame, [from, from + 12], [0, 1], easeInOut);
  const x = tween(frame, [to, to + 13], [0, 1], easeInOut);
  const y = (1 - e) * 100 + (exit === 'down' ? x * 100 : -x * 100);
  return <div style={{position: 'absolute', inset: 0, zIndex: 50, transform: `translateY(${y}%)`}}>{children}</div>;
};

export const BackTitle: React.FC<{title: string; sub?: string; icon?: React.ReactNode}> = ({title, sub, icon}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '14px 14px 8px'}}>
    <div style={{width: 38, height: 38, minWidth: 38, borderRadius: 11, background: C.panel, border: `1px solid ${C.line2}`, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <ArrowLeft size={17} color="#A1A1AA" />
    </div>
    {icon}
    <div style={{minWidth: 0}}>
      <div style={{fontFamily: SERIF, fontSize: 19, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{title}</div>
      {sub ? <div style={{fontSize: 11, color: '#8A8597', marginTop: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{sub}</div> : null}
    </div>
  </div>
);

export const Chip: React.FC<{label: React.ReactNode; on?: boolean; small?: boolean; style?: React.CSSProperties}> = ({label, on, small, style}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: small ? '6px 11px' : '8px 14px',
      borderRadius: 999,
      fontSize: small ? 12 : 13.5,
      fontWeight: 500,
      color: on ? '#B9A3FF' : '#D4D4D8',
      background: on ? C.activeNav : '#17171A',
      border: `1px solid ${on ? 'rgba(139,108,246,0.6)' : '#2A2A2E'}`,
      boxShadow: on ? '0 0 16px -4px rgba(116,80,239,0.6)' : undefined,
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    {label}
  </div>
);

export const FieldLabel: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#8E8C99', margin: '14px 0 8px'}}>{children}</div>
);

export const SelectBox: React.FC<{value: string; placeholder?: boolean}> = ({value, placeholder}) => (
  <div
    style={{
      height: 44,
      borderRadius: 11,
      background: '#151518',
      border: '1px solid #2A2A2E',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 14px',
      fontSize: 15,
      color: placeholder ? '#8E8C99' : C.text,
    }}
  >
    {value}
    <ChevronDown size={16} color="#8E8C99" />
  </div>
);

export const PrimaryButton: React.FC<{label: string; pressAt?: number; icon?: React.ReactNode; trailing?: React.ReactNode; style?: React.CSSProperties}> = ({
  label,
  pressAt = -99,
  icon,
  trailing,
  style,
}) => {
  const frame = useCurrentFrame();
  const press = frame >= pressAt - 2 && frame <= pressAt + 3 ? 0.95 : 1;
  const glow = tween(frame, [pressAt, pressAt + 5], [0, 1]) * tween(frame, [pressAt + 8, pressAt + 24], [1, 0]);
  return (
    <div
      style={{
        height: 48,
        borderRadius: 13,
        background: 'linear-gradient(135deg, #6A45EC, #7450EF 50%, #8E6CF6)',
        color: C.white,
        fontSize: 15.5,
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transform: `scale(${press})`,
        boxShadow: `0 10px 24px -10px rgba(116,80,239,0.9), 0 0 ${36 * glow}px rgba(139,108,246,${glow})`,
        ...style,
      }}
    >
      {icon}
      {label}
      {trailing}
    </div>
  );
};

export const VoiceFab: React.FC<{pulse?: boolean}> = ({pulse}) => {
  const frame = useCurrentFrame();
  const t = (frame % 40) / 40;
  return (
    <div style={{position: 'relative', width: 54, height: 54}}>
      {pulse ? (
        <div style={{position: 'absolute', inset: 0, borderRadius: 27, border: '2px solid rgba(139,108,246,0.8)', transform: `scale(${1 + t * 0.8})`, opacity: 1 - t}} />
      ) : null}
      <div style={{position: 'absolute', inset: 0, borderRadius: 27, background: C.purple, boxShadow: '0 10px 30px -6px rgba(116,80,239,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <AudioLines size={24} color={C.white} />
      </div>
    </div>
  );
};
