import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './timeline';
import {AIShikshaMitraVideo, videoSchemaDefaults} from './Video';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="AIShikshaMitra"
    component={AIShikshaMitraVideo}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
    defaultProps={videoSchemaDefaults}
  />
);
