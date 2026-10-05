export const C = {
  navy950: '#050818',
  navy900: '#0A0F2E',
  navy800: '#111A4D',
  navy700: '#1C2670',
  indigo: '#5B5BF7',
  indigoDeep: '#4338CA',
  violet: '#8B5CF6',
  saffron: '#FF9933',
  saffronLight: '#FFB65C',
  saffronDeep: '#FF6B3D',
  green: '#22C55E',
  greenDeep: '#16A34A',
  teal: '#14B8A6',
  sky: '#38BDF8',
  pink: '#EC4899',
  rose: '#F43F5E',
  amber: '#F59E0B',
  white: '#FFFFFF',
  slate50: '#F8FAFC',
  slate100: '#F1F5F9',
  slate200: '#E2E8F0',
  slate300: '#CBD5E1',
  slate400: '#94A3B8',
  slate500: '#64748B',
  slate600: '#475569',
  slate700: '#334155',
  ink: '#0F172A',
};

export const FONT = "'Poppins', 'Noto Sans Devanagari', 'DejaVu Sans', sans-serif";

export const brandGradient = `linear-gradient(135deg, ${C.indigo} 0%, ${C.violet} 100%)`;
export const saffronGradient = `linear-gradient(135deg, #FFC46B 0%, ${C.saffron} 45%, ${C.saffronDeep} 100%)`;

export const gradientText = (gradient: string): React.CSSProperties => ({
  backgroundImage: gradient,
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
});

export const cardShadow = '0 30px 60px -12px rgba(2, 6, 23, 0.55), 0 12px 24px -8px rgba(2, 6, 23, 0.35)';
export const softShadow = '0 12px 30px -8px rgba(15, 23, 42, 0.25)';
