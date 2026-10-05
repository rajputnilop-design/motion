import React, {useId} from 'react';
import {C, FONT, gradientText, saffronGradient} from '../theme';

const star = (cx: number, cy: number, r: number) => {
  const k = r * 0.2;
  return `M ${cx} ${cy - r} Q ${cx + k} ${cy - k} ${cx + r} ${cy} Q ${cx + k} ${cy + k} ${cx} ${cy + r} Q ${cx - k} ${cy + k} ${cx - r} ${cy} Q ${cx - k} ${cy - k} ${cx} ${cy - r} Z`;
};

type LogoProps = {
  size: number;
  /** 0 = book closed, 1 = fully open */
  open?: number;
  /** 0..1 scale of the AI sparkle */
  sparkle?: number;
  /** rotation of the sparkle in degrees */
  sparkleRotation?: number;
  shadow?: boolean;
  style?: React.CSSProperties;
};

/** App icon: an open book with an AI sparkle on an indigo-violet tile. */
export const LogoMark: React.FC<LogoProps> = ({size, open = 1, sparkle = 1, sparkleRotation = 0, shadow = true, style}) => {
  const id = useId().replace(/:/g, '');
  const sx = 0.25 + 0.75 * open;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        overflow: 'visible',
        filter: shadow ? `drop-shadow(0 ${size * 0.08}px ${size * 0.12}px rgba(76, 60, 230, 0.45))` : undefined,
        ...style,
      }}
    >
      <defs>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6C6CFF" />
          <stop offset="1" stopColor="#8E4FF0" />
        </linearGradient>
        <linearGradient id={`${id}sf`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFD08A" />
          <stop offset="0.5" stopColor={C.saffron} />
          <stop offset="1" stopColor={C.saffronDeep} />
        </linearGradient>
        <linearGradient id={`${id}sh`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="100" height="100" rx="27" fill={`url(#${id}bg)`} />
      <path d="M0 27 A27 27 0 0 1 27 0 H73 A27 27 0 0 1 100 27 V40 C68 50 32 50 0 40 Z" fill={`url(#${id}sh)`} />
      <g transform={`translate(50 0) scale(${sx} 1) translate(-50 0)`}>
        <path d="M47.5 41 C40 35.5 29.5 34.5 19 36.5 L19 72 C29.5 70 40 71 47.5 77 Z" fill="#fff" />
        <path d="M52.5 41 C60 35.5 70.5 34.5 81 36.5 L81 72 C70.5 70 60 71 52.5 77 Z" fill="#fff" />
        <g stroke="#7B6CF6" strokeOpacity="0.45" strokeWidth="2.4" strokeLinecap="round" fill="none">
          <path d="M26 47 C31.5 46 36.5 46.5 41.5 48.5" />
          <path d="M26 55 C31.5 54 36.5 54.5 41.5 56.5" />
          <path d="M26 63 C31.5 62 36.5 62.5 41.5 64.5" />
          <path d="M74 47 C68.5 46 63.5 46.5 58.5 48.5" />
          <path d="M74 55 C68.5 54 63.5 54.5 58.5 56.5" />
          <path d="M74 63 C68.5 62 63.5 62.5 58.5 64.5" />
        </g>
      </g>
      <g transform={`translate(50 22) rotate(${sparkleRotation}) scale(${sparkle}) translate(-50 -22)`}>
        <path d={star(50, 22, 12.5)} fill={`url(#${id}sf)`} />
      </g>
      <g transform={`translate(68 13) scale(${sparkle}) translate(-68 -13)`}>
        <path d={star(68, 13, 5)} fill="#FFE2B3" />
      </g>
    </svg>
  );
};

export const Wordmark: React.FC<{size: number; color?: string; style?: React.CSSProperties}> = ({
  size,
  color = C.white,
  style,
}) => (
  <div
    style={{
      fontFamily: FONT,
      fontWeight: 700,
      fontSize: size,
      letterSpacing: '-0.02em',
      lineHeight: 1.1,
      color,
      display: 'flex',
      whiteSpace: 'nowrap',
      ...style,
    }}
  >
    <span style={gradientText(saffronGradient)}>AI</span>
    <span>ShikshaMitra</span>
  </div>
);
