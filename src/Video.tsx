import {linearTiming, TransitionSeries} from '@remotion/transitions';
import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {easeInOut} from './anim';
import {Background, Grain} from './components/Background';
import {Scene01Problem} from './scenes/Scene01Problem';
import {Scene02Intro} from './scenes/Scene02Intro';
import {Scene03Lesson} from './scenes/Scene03Lesson';
import {Scene04Papers} from './scenes/Scene04Papers';
import {Scene05Visuals} from './scenes/Scene05Visuals';
import {Scene06Slides} from './scenes/Scene06Slides';
import {Scene07Videos} from './scenes/Scene07Videos';
import {Scene08All} from './scenes/Scene08All';
import {Scene09Teachers} from './scenes/Scene09Teachers';
import {Scene10Cta} from './scenes/Scene10Cta';
import {SceneId, SCENES, TOTAL_FRAMES, TRANSITION, voiceOvers} from './timeline';
import {zoomFade} from './transitions';

export const videoSchemaDefaults = {voiceover: true, music: true};
type Props = typeof videoSchemaDefaults;

const SCENE_COMPONENTS: Record<SceneId, React.FC> = {
  problem: Scene01Problem,
  intro: Scene02Intro,
  lesson: Scene03Lesson,
  papers: Scene04Papers,
  visuals: Scene05Visuals,
  slides: Scene06Slides,
  videos: Scene07Videos,
  all: Scene08All,
  teachers: Scene09Teachers,
  cta: Scene10Cta,
};

const MUSIC_VOLUME = 0.42;
const DUCKED = 0.22;

const musicVolume = (f: number): number => {
  // Duck the music under each voice-over line, with short ramps either side.
  let v = MUSIC_VOLUME;
  for (const vo of voiceOvers) {
    const ramp = interpolate(f, [vo.from - 8, vo.from, vo.from + vo.frames, vo.from + vo.frames + 14], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    v = Math.min(v, MUSIC_VOLUME - (MUSIC_VOLUME - DUCKED) * ramp);
  }
  return v;
};

const EndFade: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [TOTAL_FRAMES - 14, TOTAL_FRAMES - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return <AbsoluteFill style={{backgroundColor: '#000', opacity}} />;
};

export const AIShikshaMitraVideo: React.FC<Props> = ({voiceover, music}) => {
  return (
    <AbsoluteFill style={{backgroundColor: '#060920'}}>
      <Background />
      <TransitionSeries>
        {SCENES.flatMap((scene, i) => {
          const Comp = SCENE_COMPONENTS[scene.id as SceneId];
          const items = [
            <TransitionSeries.Sequence key={scene.id} durationInFrames={scene.duration} name={scene.id}>
              <Comp />
            </TransitionSeries.Sequence>,
          ];
          if (i < SCENES.length - 1) {
            items.push(
              <TransitionSeries.Transition
                key={`${scene.id}-t`}
                presentation={zoomFade()}
                timing={linearTiming({durationInFrames: TRANSITION, easing: easeInOut})}
              />,
            );
          }
          return items;
        })}
      </TransitionSeries>
      {music ? <Audio src={staticFile('audio/music.wav')} volume={musicVolume} /> : null}
      {voiceover
        ? voiceOvers.map((vo) => (
            <Sequence key={vo.file} from={vo.from} layout="none" name={vo.file}>
              <Audio src={staticFile(`audio/vo/${vo.file}.wav`)} volume={1} />
            </Sequence>
          ))
        : null}
      <Grain />
      <EndFade />
    </AbsoluteFill>
  );
};
