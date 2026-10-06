import React from 'react';
import {Composition} from 'remotion';
import './fonts';
import {ApiKeyReel, apiKeyDuration} from './apikey/ApiKeyReel';
import {Demo, demoDuration} from './demo/Demo';
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
    <Composition id="Demo-EN" component={Demo} durationInFrames={demoDuration('en')} fps={30} width={1920} height={1080} defaultProps={{lang: 'en' as const}} />
    <Composition id="Demo-HI" component={Demo} durationInFrames={demoDuration('hi')} fps={30} width={1920} height={1080} defaultProps={{lang: 'hi' as const}} />
    <Composition id="Demo-MR" component={Demo} durationInFrames={demoDuration('mr')} fps={30} width={1920} height={1080} defaultProps={{lang: 'mr' as const}} />
    <Composition id="ApiKey-EN" component={ApiKeyReel} durationInFrames={apiKeyDuration('en')} fps={30} width={1080} height={1920} defaultProps={{lang: 'en' as const}} />
    <Composition id="ApiKey-HI" component={ApiKeyReel} durationInFrames={apiKeyDuration('hi')} fps={30} width={1080} height={1920} defaultProps={{lang: 'hi' as const}} />
    <Composition id="ApiKey-MR" component={ApiKeyReel} durationInFrames={apiKeyDuration('mr')} fps={30} width={1080} height={1920} defaultProps={{lang: 'mr' as const}} />
    <Composition id="Reel-Aasha" component={ReelAasha} durationInFrames={REEL.duration} fps={REEL.fps} width={REEL.width} height={REEL.height} defaultProps={reelProps} />
    <Composition id="Reel-Papers" component={ReelPapers} durationInFrames={REEL.duration} fps={REEL.fps} width={REEL.width} height={REEL.height} defaultProps={reelProps} />
    <Composition id="Reel-Toolkit" component={ReelToolkit} durationInFrames={REEL.duration} fps={REEL.fps} width={REEL.width} height={REEL.height} defaultProps={reelProps} />
  </>
);
