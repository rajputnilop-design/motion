import React from 'react';
import {useCurrentFrame} from 'remotion';

// Small, self-contained educational illustrations (viewBox 240x146).

export const AtomArt: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <svg viewBox="0 0 240 146" width="100%" height="100%">
      <rect width="240" height="146" fill="#EEF0FF" />
      <g transform="translate(120 73)">
        {[0, 60, 120].map((rot, i) => {
          const th = frame / 9 + i * 2.1;
          return (
            <g key={rot} transform={`rotate(${rot})`}>
              <ellipse rx="86" ry="27" fill="none" stroke="#6366F1" strokeWidth="3" opacity="0.75" />
              <circle cx={86 * Math.cos(th)} cy={27 * Math.sin(th)} r="7" fill="#F97316" />
            </g>
          );
        })}
        <circle cx="-6" cy="-4" r="11" fill="#EF4444" />
        <circle cx="7" cy="-3" r="11" fill="#3B82F6" />
        <circle cx="0" cy="8" r="11" fill="#EF4444" />
      </g>
    </svg>
  );
};

export const PlantCellArt: React.FC = () => (
  <svg viewBox="0 0 240 146" width="100%" height="100%">
    <rect width="240" height="146" fill="#ECFDF3" />
    <rect x="34" y="14" width="172" height="118" rx="18" fill="#BBF7D0" stroke="#16A34A" strokeWidth="6" />
    <rect x="44" y="24" width="152" height="98" rx="12" fill="#DCFCE7" stroke="#4ADE80" strokeWidth="2" />
    <rect x="96" y="36" width="88" height="62" rx="26" fill="#BAE6FD" stroke="#38BDF8" strokeWidth="2" />
    <circle cx="72" cy="88" r="20" fill="#C4B5FD" stroke="#7C3AED" strokeWidth="2" />
    <circle cx="72" cy="88" r="7" fill="#7C3AED" />
    {[
      [64, 44],
      [112, 110],
      [160, 110],
      [188, 70],
    ].map(([x, y], i) => (
      <ellipse key={i} cx={x} cy={y} rx="13" ry="7" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" transform={`rotate(${i * 35} ${x} ${y})`} />
    ))}
  </svg>
);

export const PhotosynthesisArt: React.FC = () => {
  const frame = useCurrentFrame();
  const o = 0.5 + 0.5 * Math.sin(frame / 8);
  return (
    <svg viewBox="0 0 240 146" width="100%" height="100%">
      <rect width="240" height="146" fill="#FEFCE8" />
      <circle cx="38" cy="34" r="20" fill="#FBBF24" />
      {[0, 1, 2].map((i) => (
        <line key={i} x1={58 + i * 4} y1={44 + i * 8} x2={92 + i * 6} y2={62 + i * 6} stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" opacity={o} />
      ))}
      <path d="M 96 120 C 96 70 140 40 196 36 C 192 92 160 122 96 120 Z" fill="#4ADE80" stroke="#16A34A" strokeWidth="3" />
      <path d="M 100 116 C 130 96 160 70 188 42" stroke="#15803D" strokeWidth="3" fill="none" />
      <text x="20" y="112" fontFamily="Poppins" fontWeight="700" fontSize="17" fill="#475569">
        CO<tspan fontSize="11" dy="4">2</tspan>
      </text>
      <path d="M 58 108 L 86 104" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
      <text x="196" y="124" fontFamily="Poppins" fontWeight="700" fontSize="17" fill="#0EA5E9">
        O<tspan fontSize="11" dy="4">2</tspan>
      </text>
      <path d="M 170 116 L 192 116" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export const PythagorasArt: React.FC = () => (
  <svg viewBox="0 0 240 146" width="100%" height="100%">
    <rect width="240" height="146" fill="#FFF7ED" />
    <g transform="translate(40 18)">
      <path d="M 0 90 L 72 90 L 0 36 Z" fill="#FDBA74" stroke="#EA580C" strokeWidth="3" strokeLinejoin="round" />
      <rect x="0" y="80" width="10" height="10" fill="none" stroke="#EA580C" strokeWidth="2" />
      <text x="28" y="108" fontFamily="Poppins" fontWeight="700" fontSize="15" fill="#9A3412">b</text>
      <text x="-14" y="68" fontFamily="Poppins" fontWeight="700" fontSize="15" fill="#9A3412">a</text>
      <text x="40" y="58" fontFamily="Poppins" fontWeight="700" fontSize="15" fill="#9A3412">c</text>
    </g>
    <text x="126" y="84" fontFamily="Poppins" fontWeight="700" fontSize="19" fill="#0F172A">
      a² + b² = c²
    </text>
  </svg>
);

export const CircuitArt: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.6 + 0.4 * Math.sin(frame / 6);
  return (
    <svg viewBox="0 0 240 146" width="100%" height="100%">
      <rect width="240" height="146" fill="#F0F9FF" />
      <rect x="40" y="30" width="160" height="86" rx="6" fill="none" stroke="#334155" strokeWidth="4" />
      <rect x="96" y="104" width="48" height="24" fill="#F0F9FF" />
      <line x1="108" y1="96" x2="108" y2="136" stroke="#334155" strokeWidth="5" />
      <line x1="126" y1="106" x2="126" y2="126" stroke="#334155" strokeWidth="5" />
      <circle cx="120" cy="30" r={26 * glow} fill="#FDE047" opacity="0.45" />
      <circle cx="120" cy="30" r="15" fill="#FACC15" stroke="#334155" strokeWidth="3" />
      <path d="M 113 30 L 117 24 L 121 34 L 126 26" fill="none" stroke="#92400E" strokeWidth="2" />
      <circle cx="200" cy="73" r="5" fill="#334155" />
    </svg>
  );
};

export const MoonPhasesArt: React.FC = () => {
  const r = 20;
  const phases = [
    {lit: (cx: number, cy: number) => `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${r * 0.55} ${r} 0 0 0 ${cx} ${cy - r} Z`},
    {lit: (cx: number, cy: number) => `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z`},
    {lit: (cx: number, cy: number) => `M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${r * 0.55} ${r} 0 0 1 ${cx} ${cy - r} Z`},
    {lit: (cx: number, cy: number) => `M ${cx - r} ${cy} A ${r} ${r} 0 1 1 ${cx + r} ${cy} A ${r} ${r} 0 1 1 ${cx - r} ${cy} Z`},
  ];
  return (
    <svg viewBox="0 0 240 146" width="100%" height="100%">
      <rect width="240" height="146" fill="#1E1B4B" />
      {[
        [30, 22],
        [200, 30],
        [120, 124],
        [70, 120],
        [180, 118],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill="#fff" opacity="0.8" />
      ))}
      {phases.map((p, i) => {
        const cx = 36 + i * 56;
        const cy = 73;
        return (
          <g key={i}>
            <circle cx={cx} cy={cy} r={r} fill="#312E81" />
            <path d={p.lit(cx, cy)} fill="#FEF3C7" />
          </g>
        );
      })}
    </svg>
  );
};

export const MINI_DIAGRAMS = [
  {title: 'Atom Structure', Art: AtomArt},
  {title: 'Plant Cell', Art: PlantCellArt},
  {title: 'Photosynthesis', Art: PhotosynthesisArt},
  {title: 'Pythagoras Theorem', Art: PythagorasArt},
  {title: 'Electric Circuit', Art: CircuitArt},
  {title: 'Phases of the Moon', Art: MoonPhasesArt},
];
