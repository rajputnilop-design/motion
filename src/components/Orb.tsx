import React from 'react';
import {useCurrentFrame} from 'remotion';
import {C, SANS} from '../theme';

/** The app's "Generating" orb with the moving highlight across the word. */
export const GeneratingOrb: React.FC<{caption: string; size?: number}> = ({caption, size = 150}) => {
  const frame = useCurrentFrame();
  const word = 'Generating';
  const hi = (frame / 2.2) % (word.length + 4);
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: SANS}}>
      <div style={{position: 'relative', width: size, height: size}}>
        <div
          style={{
            position: 'absolute',
            inset: -size * 0.25,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(194,90,185,0.35) 0%, rgba(116,80,239,0.18) 40%, transparent 70%)',
            transform: `scale(${1 + 0.06 * Math.sin(frame / 6)})`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 22% 50%, #F7C6E6 0%, #D77AC4 14%, #7A3AA8 34%, #2A1150 58%, #120822 80%)',
            boxShadow: 'inset -10px -14px 30px rgba(0,0,0,0.55), 0 0 40px rgba(194,90,185,0.35)',
            transform: `rotate(${frame * 2.2}deg)`,
          }}
        />
        <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.1, letterSpacing: '0.02em'}}>
          {word.split('').map((ch, i) => {
            const d = Math.abs(i - hi + 2);
            const glow = Math.max(0, 1 - d / 2.5);
            return (
              <span key={i} style={{color: `rgba(255,255,255,${0.55 + 0.45 * glow})`, fontWeight: glow > 0.5 ? 600 : 400}}>
                {ch}
              </span>
            );
          })}
        </div>
      </div>
      <div style={{marginTop: size * 0.22, fontSize: 17, color: C.text2}}>{caption}</div>
    </div>
  );
};
