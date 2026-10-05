import type {TransitionPresentation, TransitionPresentationComponentProps} from '@remotion/transitions';
import React from 'react';
import {AbsoluteFill, interpolate} from 'remotion';

type ZoomFadeProps = Record<string, never>;

const ZoomFade: React.FC<TransitionPresentationComponentProps<ZoomFadeProps>> = ({
  children,
  presentationDirection,
  presentationProgress,
}) => {
  const entering = presentationDirection === 'entering';
  // Dip through the shared background: the outgoing scene is mostly gone before the next one appears,
  // so two busy layouts never sit on top of each other.
  const opacity = entering
    ? interpolate(presentationProgress, [0.4, 1], [0, 1], {extrapolateLeft: 'clamp'})
    : interpolate(presentationProgress, [0, 0.6], [1, 0], {extrapolateRight: 'clamp'});
  const scale = entering
    ? interpolate(presentationProgress, [0, 1], [0.94, 1])
    : interpolate(presentationProgress, [0, 1], [1, 1.06]);
  return <AbsoluteFill style={{opacity, transform: `scale(${scale})`}}>{children}</AbsoluteFill>;
};

/** Dip-fade where the outgoing scene pushes towards the camera and the incoming one settles in. */
export const zoomFade = (): TransitionPresentation<ZoomFadeProps> => ({component: ZoomFade, props: {}});
