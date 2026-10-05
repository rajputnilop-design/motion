import React from 'react';
import {AbsoluteFill} from 'remotion';

export type Camera = {
  /** Point inside the device (device pixels) that the camera looks at. */
  look: [number, number];
  /** Where that point lands on screen. */
  at: [number, number];
  scale: number;
  rx?: number;
  ry?: number;
  opacity?: number;
};

/** Places a device (e.g. the browser) in 3D space, framed by a simple look-at camera. */
export const Device: React.FC<{cam: Camera; children: React.ReactNode; perspective?: number}> = ({cam, children, perspective = 2600}) => (
  <AbsoluteFill style={{perspective, perspectiveOrigin: `${cam.at[0]}px ${cam.at[1]}px`, pointerEvents: 'none'}}>
    <div style={{position: 'absolute', left: cam.at[0], top: cam.at[1], width: 0, height: 0, opacity: cam.opacity ?? 1}}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          transformOrigin: '0 0',
          transform: `rotateY(${cam.ry ?? 0}deg) rotateX(${cam.rx ?? 0}deg) scale(${cam.scale}) translate(${-cam.look[0]}px, ${-cam.look[1]}px)`,
        }}
      >
        {children}
      </div>
    </div>
  </AbsoluteFill>
);

/** Interpolate between camera keyframes [{f, cam}] with an easing function. */
export const camAt = (frame: number, keys: {f: number; cam: Camera}[], ease: (t: number) => number): Camera => {
  if (frame <= keys[0].f) return keys[0].cam;
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i];
    const b = keys[i + 1];
    if (frame <= b.f) {
      const t = ease((frame - a.f) / (b.f - a.f));
      const mix = (x: number, y: number) => x + (y - x) * t;
      return {
        look: [mix(a.cam.look[0], b.cam.look[0]), mix(a.cam.look[1], b.cam.look[1])],
        at: [mix(a.cam.at[0], b.cam.at[0]), mix(a.cam.at[1], b.cam.at[1])],
        scale: mix(a.cam.scale, b.cam.scale),
        rx: mix(a.cam.rx ?? 0, b.cam.rx ?? 0),
        ry: mix(a.cam.ry ?? 0, b.cam.ry ?? 0),
        opacity: mix(a.cam.opacity ?? 1, b.cam.opacity ?? 1),
      };
    }
  }
  return keys[keys.length - 1].cam;
};
