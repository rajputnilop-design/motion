import React from 'react';
import {AbsoluteFill, staticFile, useCurrentFrame} from 'remotion';

const glow = (x: number, y: number, size: number, color: string) =>
  `radial-gradient(circle at ${x}% ${y}%, ${color} 0%, transparent ${size}%)`;

/** Near-black stage with slow aurora glows in the logo's blue / aqua and the app's purple. */
export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const glows = [
    glow(14 + Math.sin(t * 0.17) * 7, 18 + Math.cos(t * 0.13) * 6, 44, 'rgba(20, 80, 245, 0.26)'),
    glow(88 + Math.cos(t * 0.15) * 5, 26 + Math.sin(t * 0.19) * 7, 40, 'rgba(116, 80, 239, 0.24)'),
    glow(72 + Math.sin(t * 0.11) * 9, 96 + Math.cos(t * 0.09) * 4, 42, 'rgba(0, 229, 200, 0.12)'),
    glow(6, 92, 30, 'rgba(10, 140, 240, 0.10)'),
  ].join(', ');
  return (
    <AbsoluteFill style={{background: `${glows}, #050507`}}>
      <AbsoluteFill
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1.2px, transparent 1.2px)',
          backgroundSize: '40px 40px',
          backgroundPosition: `${(frame * 0.12) % 40}px ${(frame * 0.25) % 40}px`,
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 55%, black 15%, transparent 72%)',
          maskImage: 'radial-gradient(ellipse at 50% 55%, black 15%, transparent 72%)',
        }}
      />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, transparent 50%, rgba(0,0,0,0.65) 100%)'}} />
    </AbsoluteFill>
  );
};

/** Static film grain on top of everything: hides gradient banding and adds texture. */
export const Grain: React.FC = () => (
  <AbsoluteFill style={{backgroundImage: `url(${staticFile('brand/grain.png')})`, backgroundSize: '256px 256px', pointerEvents: 'none'}} />
);
