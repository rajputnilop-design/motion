import timeline from './timeline.json';

export type SceneId = (typeof timeline.scenes)[number]['id'];

export const FPS = timeline.fps;
export const WIDTH = timeline.width;
export const HEIGHT = timeline.height;
export const TRANSITION = timeline.transition;
export const SCENES = timeline.scenes;

// Absolute start frame of each scene, accounting for the overlap of each transition.
export const sceneStart = (id: SceneId): number => {
  let start = 0;
  for (const scene of SCENES) {
    if (scene.id === id) return start;
    start += scene.duration - TRANSITION;
  }
  throw new Error(`Unknown scene ${id}`);
};

export const sceneDuration = (id: SceneId): number => {
  const scene = SCENES.find((s) => s.id === id);
  if (!scene) throw new Error(`Unknown scene ${id}`);
  return scene.duration;
};

export const TOTAL_FRAMES = SCENES.reduce((sum, s) => sum + s.duration, 0) - TRANSITION * (SCENES.length - 1);

export const voiceOvers = SCENES.flatMap((s) =>
  'vo' in s && s.vo
    ? [{file: s.vo.file, from: sceneStart(s.id) + s.vo.at, frames: Math.ceil(s.vo.seconds * FPS)}]
    : [],
);

export const cueFrame = (cue: keyof typeof timeline.cues): number => {
  const c = timeline.cues[cue];
  return sceneStart(c.scene as SceneId) + c.at;
};
