import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {REEL} from './reels/Reel';
import {ReelAasha, ReelPapers, ReelToolkit} from './reels/Reels';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './timeline';
import {AIShikshaMitraVideo, videoSchemaDefaults} from './Video';

const reelProps = {music: true, voiceover: true};

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="AIShikshaMitra"
      component={AIShikshaMitraVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
      defaultProps={videoSchemaDefaults}
    />
    <Composition id="Reel-Aasha" component={ReelAasha} durationInFrames={REEL.duration} fps={REEL.fps} width={REEL.width} height={REEL.height} defaultProps={reelProps} />
    <Composition id="Reel-Papers" component={ReelPapers} durationInFrames={REEL.duration} fps={REEL.fps} width={REEL.width} height={REEL.height} defaultProps={reelProps} />
    <Composition id="Reel-Toolkit" component={ReelToolkit} durationInFrames={REEL.duration} fps={REEL.fps} width={REEL.width} height={REEL.height} defaultProps={reelProps} />
  </>
);
