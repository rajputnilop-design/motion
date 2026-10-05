import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';

const blob = (x: number, y: number, size: number, color: string) =>
  `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, transparent ${size}%)`;

/** Deep navy backdrop with slowly drifting colour glows, shared by every scene. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const glows = [
    blob(18 + Math.sin(t * 0.21) * 8, 22 + Math.cos(t * 0.17) * 6, 42, 'rgba(91, 91, 247, 0.38)'),
    blob(84 + Math.cos(t * 0.19) * 6, 30 + Math.sin(t * 0.23) * 8, 38, 'rgba(139, 92, 246, 0.30)'),
    blob(70 + Math.sin(t * 0.13) * 10, 92 + Math.cos(t * 0.11) * 4, 40, 'rgba(255, 153, 51, 0.16)'),
    blob(10 + Math.cos(t * 0.15) * 5, 95, 34, 'rgba(20, 184, 166, 0.14)'),
  ].join(', ');

  return (
    <AbsoluteFill style={{background: `${glows}, linear-gradient(160deg, #0D1442 0%, #0A0F2E 45%, #060920 100%)`}}>
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.075) 1.3px, transparent 1.3px)',
          backgroundSize: '38px 38px',
          backgroundPosition: `${(frame * 0.15) % 38}px ${(frame * 0.3) % 38}px`,
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%)',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%)',
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(2, 4, 16, 0.55) 100%)'}} />
    </AbsoluteFill>
  );
};
