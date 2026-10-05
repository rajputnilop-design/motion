// Palette sampled from the live AIShikshaMitra web app and its logo.
export const C = {
  bg: '#050507',
  app: '#09090B',
  panel: '#161617',
  panel2: '#1D1D20',
  panel3: '#26262B',
  line: 'rgba(255,255,255,0.08)',
  line2: 'rgba(255,255,255,0.14)',
  activeNav: '#241E38',
  purple: '#7450EF',
  purpleLight: '#8B74F2',
  lavender: '#A3A6F9',
  purpleDeep: '#4D3989',
  blue: '#1450F5',
  azure: '#0A8CF0',
  cyan: '#00D2E6',
  aqua: '#00E5C8',
  text: '#F4F4F5',
  text2: '#A1A1AA',
  text3: '#71717A',
  muted: '#52525B',
  white: '#FFFFFF',
  ink: '#111827',
  paperText: '#1F2937',
  paperMuted: '#4B5563',
  paperLine: '#E5E7EB',
  green: '#22C55E',
  greenDeep: '#16A34A',
  amber: '#F59E0B',
  rose: '#F43F5E',
  pink: '#EC4899',
  sky: '#38BDF8',
  orange: '#F97316',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
};

export const SERIF = "'Playfair Display', 'Noto Sans Devanagari', serif";
export const SANS = "'Inter', 'Noto Sans Devanagari', 'Noto Color Emoji', sans-serif";
export const DEVA = "'Noto Sans Devanagari', 'Inter', sans-serif";
export const HAND = "'Kalam', 'Noto Sans Devanagari', cursive";
export const MONO = "'DejaVu Sans Mono', 'Liberation Mono', monospace";

/** Logo gradient: royal blue → azure → aqua. */
export const logoGradient = `linear-gradient(120deg, ${C.blue} 0%, ${C.azure} 45%, ${C.aqua} 100%)`;
/** The app's "Namaste" headline gradient. */
export const namasteGradient = `linear-gradient(90deg, #7B57F1 0%, ${C.lavender} 50%, #7B57F1 100%)`;
export const purpleGradient = `linear-gradient(135deg, #6A45EC 0%, ${C.purple} 45%, #9A7BF7 100%)`;

export const gradientText = (gradient: string): React.CSSProperties => ({
  backgroundImage: gradient,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
});

export const windowShadow =
  '0 60px 120px -30px rgba(0,0,0,0.85), 0 30px 60px -30px rgba(20, 80, 245, 0.25), 0 0 0 1px rgba(255,255,255,0.08)';
export const cardShadow = '0 30px 60px -16px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255,255,255,0.06)';
export const paperShadow = '0 30px 60px -18px rgba(0,0,0,0.7)';
