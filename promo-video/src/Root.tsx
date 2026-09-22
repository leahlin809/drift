import {Composition} from 'remotion';

import {DriftPromo} from './DriftPromo';

export const RemotionRoot = () => (
  <Composition
    id="DriftPromo"
    component={DriftPromo}
    durationInFrames={720}
    fps={30}
    width={1920}
    height={1080}
  />
);
