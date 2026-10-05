import React from 'react';

export type AvatarStyle = {
  bg: string;
  skin: string;
  hair: string;
  shirt: string;
  style: 'short' | 'long' | 'bun' | 'wavy';
  glasses?: boolean;
};

/** Flat, friendly illustrated avatar (no real likeness). */
export const Avatar: React.FC<{a: AvatarStyle; size: number}> = ({a, size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{borderRadius: '50%', display: 'block'}}>
    <rect width="100" height="100" fill={a.bg} />
    {a.style === 'long' ? <path d="M 27 44 C 25 70 24 84 30 92 L 70 92 C 76 84 75 70 73 44 Z" fill={a.hair} /> : null}
    <path d="M 16 104 C 18 80 32 72 50 72 C 68 72 82 80 84 104 Z" fill={a.shirt} />
    <rect x="43" y="58" width="14" height="16" rx="6" fill={a.skin} />
    <path d="M 42 72 L 50 82 L 58 72" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3" strokeLinejoin="round" />
    <ellipse cx="50" cy="44" rx="20" ry="23" fill={a.skin} />
    {a.style === 'short' ? <path d="M 29 42 C 28 24 38 17 50 17 C 63 17 72 24 71 40 C 66 32 58 29 50 30 C 40 30 33 34 29 42 Z" fill={a.hair} /> : null}
    {a.style === 'wavy' ? (
      <path d="M 28 46 C 24 26 36 15 51 16 C 66 16 76 28 72 46 C 70 36 66 31 60 30 C 54 34 44 34 38 30 C 33 32 30 38 28 46 Z" fill={a.hair} />
    ) : null}
    {a.style === 'long' || a.style === 'bun' ? (
      <path d="M 29 46 C 26 26 37 17 50 17 C 63 17 74 26 71 46 C 69 36 62 29 50 28 C 46 34 36 38 29 46 Z" fill={a.hair} />
    ) : null}
    {a.style === 'bun' ? <circle cx="50" cy="14" r="9" fill={a.hair} /> : null}
    <ellipse cx="42.5" cy="46" rx="2.4" ry="2.8" fill="#1F2937" />
    <ellipse cx="57.5" cy="46" rx="2.4" ry="2.8" fill="#1F2937" />
    <path d="M 43 55 Q 50 60 57 55" fill="none" stroke="#7C2D12" strokeWidth="2.4" strokeLinecap="round" />
    {a.glasses ? (
      <g fill="none" stroke="#1F2937" strokeWidth="2">
        <circle cx="42.5" cy="46" r="6" />
        <circle cx="57.5" cy="46" r="6" />
        <line x1="48.5" y1="46" x2="51.5" y2="46" />
      </g>
    ) : null}
  </svg>
);
