import {Wifi} from 'lucide-react';
import React from 'react';
import {C, SANS} from '../theme';

const StatusBar: React.FC<{dark?: boolean; scale: number}> = ({dark, scale}) => {
  const color = dark ? C.white : C.ink;
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 46 * scale,
        padding: `0 ${26 * scale}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: SANS,
        fontWeight: 600,
        fontSize: 15 * scale,
        color,
        zIndex: 20,
      }}
    >
      <span>10:30</span>
      <div style={{display: 'flex', alignItems: 'center', gap: 6 * scale}}>
        <div style={{display: 'flex', alignItems: 'flex-end', gap: 2 * scale, height: 12 * scale}}>
          {[0.4, 0.6, 0.8, 1].map((h) => (
            <div key={h} style={{width: 3 * scale, height: 12 * scale * h, borderRadius: 1, background: color}} />
          ))}
        </div>
        <Wifi size={15 * scale} color={color} strokeWidth={2.6} />
        <div
          style={{
            width: 24 * scale,
            height: 12 * scale,
            borderRadius: 3.5 * scale,
            border: `${1.5 * scale}px solid ${color}`,
            padding: 1.5 * scale,
            opacity: 0.9,
          }}
        >
          <div style={{width: '75%', height: '100%', borderRadius: 1.5 * scale, background: color}} />
        </div>
      </div>
    </div>
  );
};

type PhoneProps = {
  width?: number;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  screenStyle?: React.CSSProperties;
  darkStatus?: boolean;
};

export const PHONE_RATIO = 2.06;

/** Generic modern smartphone mockup. Children render inside the screen (below the status bar). */
export const Phone: React.FC<PhoneProps> = ({width = 400, children, style, screenStyle, darkStatus}) => {
  const height = width * PHONE_RATIO;
  const scale = width / 400;
  const bezel = 12 * scale;
  return (
    <div
      style={{
        position: 'absolute',
        width,
        height,
        borderRadius: 62 * scale,
        padding: bezel,
        background: 'linear-gradient(150deg, #4A4D5C 0%, #1A1B23 22%, #0B0C11 70%, #2B2D38 100%)',
        boxShadow:
          '0 60px 120px -30px rgba(0,0,0,0.75), 0 30px 60px -20px rgba(20, 16, 80, 0.6), inset 0 0 0 1.5px rgba(255,255,255,0.12)',
        ...style,
      }}
    >
      {[
        {side: 'left', top: 0.2, h: 0.06},
        {side: 'left', top: 0.29, h: 0.1},
        {side: 'right', top: 0.26, h: 0.13},
      ].map((b, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            [b.side]: -3 * scale,
            top: height * b.top,
            width: 4 * scale,
            height: height * b.h,
            borderRadius: 3,
            background: '#2A2C37',
          }}
        />
      ))}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 50 * scale,
          overflow: 'hidden',
          background: '#F5F6FB',
          ...screenStyle,
        }}
      >
        <div style={{position: 'absolute', top: 50 * scale, left: 0, right: 0, bottom: 0, fontFamily: SANS}}>{children}</div>
        <StatusBar dark={darkStatus} scale={scale} />
        <div
          style={{
            position: 'absolute',
            top: 11 * scale,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 112 * scale,
            height: 30 * scale,
            borderRadius: 20 * scale,
            background: '#050507',
            zIndex: 30,
          }}
        />
      </div>
    </div>
  );
};
