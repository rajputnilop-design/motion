import {Easing, interpolate, spring} from 'remotion';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);
export const easeIn = Easing.bezier(0.7, 0, 0.84, 0);

/** Clamped interpolation between two frames with an ease-out curve by default. */
export const tween = (
  frame: number,
  [f0, f1]: [number, number],
  [v0, v1]: [number, number],
  easing: (t: number) => number = easeOut,
): number => interpolate(frame, [f0, f1], [v0, v1], {...clamp, easing});

export const pop = (frame: number, fps: number, delay = 0, damping = 12, stiffness = 140): number =>
  spring({frame: frame - delay, fps, config: {damping, stiffness, mass: 0.7}});

export const smooth = (frame: number, fps: number, delay = 0): number =>
  spring({frame: frame - delay, fps, config: {damping: 200, stiffness: 90}});

/** Characters of `text` revealed so far when typing starts at `start` at `cpf` chars per frame. */
export const typed = (text: string, frame: number, start: number, cpf = 1): string =>
  text.slice(0, Math.max(0, Math.floor((frame - start) * cpf)));

export const caretVisible = (frame: number): boolean => Math.floor(frame / 8) % 2 === 0;
