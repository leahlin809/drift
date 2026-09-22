import type {CSSProperties, ReactNode} from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const colors = {
  background: '#E8EAE7',
  paper: '#F7F8F6',
  ink: '#18221D',
  muted: '#6D756F',
  accent: '#31715F',
  accentSoft: '#DCE8E2',
  sand: '#E8E0D2',
  line: '#C9CEC9',
};

const fontFamily = '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif';

const easeOut = Easing.bezier(0.22, 1, 0.36, 1);

const fadeWindow = (frame: number, duration: number, edge = 14) =>
  Math.min(
    interpolate(frame, [0, edge], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
    interpolate(frame, [duration - edge, duration], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
  );

const Scene = ({children, duration}: {children: ReactNode; duration: number}) => {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{opacity: fadeWindow(frame, duration)}}>{children}</AbsoluteFill>;
};

const Kicker = ({children}: {children: ReactNode}) => (
  <div
    style={{
      color: colors.accent,
      fontFamily,
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: 3.5,
      textTransform: 'uppercase',
    }}
  >
    {children}
  </div>
);

const Headline = ({children, size = 68}: {children: ReactNode; size?: number}) => (
  <div
    style={{
      color: colors.ink,
      fontFamily,
      fontSize: size,
      fontWeight: 730,
      letterSpacing: -2.6,
      lineHeight: 1.17,
    }}
  >
    {children}
  </div>
);

const Body = ({children}: {children: ReactNode}) => (
  <div
    style={{
      color: colors.muted,
      fontFamily,
      fontSize: 29,
      fontWeight: 450,
      lineHeight: 1.65,
    }}
  >
    {children}
  </div>
);

const PhoneShot = ({
  file,
  height = 930,
  style,
  delay = 0,
}: {
  file: string;
  height?: number;
  style?: CSSProperties;
  delay?: number;
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = spring({frame: frame - delay, fps, config: {damping: 19, stiffness: 92, mass: 0.9}});
  const drift = Math.sin((frame + delay) / 34) * 5;
  return (
    <Img
      src={staticFile(`assets/${file}`)}
      style={{
        position: 'absolute',
        height,
        width: 'auto',
        objectFit: 'contain',
        opacity: reveal,
        transform: `translateY(${interpolate(reveal, [0, 1], [72, 0]) + drift}px) scale(${interpolate(reveal, [0, 1], [0.94, 1])})`,
        filter: 'drop-shadow(0 28px 40px rgba(28, 39, 33, 0.14))',
        ...style,
      }}
    />
  );
};

const DotField = ({frame}: {frame: number}) => (
  <>
    {[0, 1, 2, 3, 4].map((index) => {
      const size = 8 + index * 3;
      const angle = frame / (50 + index * 9) + index * 1.4;
      return (
        <div
          key={index}
          style={{
            position: 'absolute',
            left: 960 + Math.cos(angle) * (280 + index * 46),
            top: 540 + Math.sin(angle) * (180 + index * 32),
            width: size,
            height: size,
            borderRadius: '50%',
            backgroundColor: index % 2 === 0 ? colors.accent : colors.sand,
            opacity: 0.45,
          }}
        />
      );
    })}
  </>
);

const Intro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const title = spring({frame: frame - 8, fps, config: {damping: 18, stiffness: 75}});
  const line = interpolate(frame, [28, 76], [0, 1], {easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Scene duration={105}>
      <DotField frame={frame} />
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 540,
          width: 600,
          height: 600,
          borderRadius: '50%',
          border: `2px solid ${colors.line}`,
          transform: `translate(-50%, -50%) scale(${0.8 + line * 0.2})`,
          opacity: 0.6 * line,
        }}
      />
      <div style={{position: 'absolute', left: 960, top: 540, transform: `translate(-50%, -50%) translateY(${(1 - title) * 40}px)`, opacity: title, textAlign: 'center'}}>
        <div style={{fontFamily, fontSize: 112, fontWeight: 760, color: colors.ink, letterSpacing: -8}}>所见</div>
        <div style={{fontFamily, fontSize: 25, fontWeight: 700, color: colors.accent, letterSpacing: 8, marginTop: 10}}>DRIFT</div>
        <div style={{width: 250 * line, height: 2, backgroundColor: colors.accent, margin: '34px auto 30px'}} />
        <div style={{fontFamily, fontSize: 34, color: colors.muted, letterSpacing: 2}}>你的私人文化地图</div>
      </div>
    </Scene>
  );
};

const MapScene = () => {
  const frame = useCurrentFrame();
  const textIn = interpolate(frame, [12, 42], [0, 1], {easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Scene duration={120}>
      <div style={{position: 'absolute', left: 180, top: 245, width: 710, opacity: textIn, transform: `translateX(${(1 - textIn) * -36}px)`}}>
        <Kicker>MAP FIRST</Kicker>
        <div style={{height: 28}} />
        <Headline>把偶然遇见的内容，<br />放回世界里。</Headline>
        <div style={{height: 36}} />
        <Body>一本书、一部电影、一段历史。<br />从地图开始，留下你与地方的联系。</Body>
      </div>
      <div style={{position: 'absolute', left: 980, top: 88, width: 680, height: 900, borderRadius: 360, backgroundColor: colors.accentSoft, opacity: 0.62}} />
      <PhoneShot file="map-home.png" style={{right: 185, top: 74}} />
    </Scene>
  );
};

const CaptureScene = () => {
  const frame = useCurrentFrame();
  const copy = interpolate(frame, [10, 38], [0, 1], {easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const switcher = interpolate(frame, [58, 86], [0, 1], {easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Scene duration={135}>
      <div style={{position: 'absolute', left: 120, top: 76, width: 1020, height: 930, borderRadius: 60, backgroundColor: colors.paper}} />
      <PhoneShot file="add-entry.png" height={860} style={{left: 145, top: 110, opacity: 1 - switcher * 0.55, transform: `translateX(${-80 * switcher}px) scale(${1 - switcher * 0.055})`}} />
      <PhoneShot file="location-picker.png" height={900} style={{left: 570, top: 86, opacity: switcher, transform: `translateX(${80 * (1 - switcher)}px) scale(${0.95 + switcher * 0.05})`}} delay={54} />
      <div style={{position: 'absolute', left: 1240, top: 245, width: 540, opacity: copy, transform: `translateY(${(1 - copy) * 30}px)`}}>
        <Kicker>CAPTURE</Kicker>
        <div style={{height: 28}} />
        <Headline size={64}>先记录，<br />再慢慢整理。</Headline>
        <div style={{height: 34}} />
        <Body>关联国家、城市，<br />或一个具体的地点。</Body>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 38}}>
          {['书籍', '电影', '人物', '历史 / 事件'].map((item, index) => (
            <div key={item} style={{fontFamily, fontSize: 20, color: colors.accent, backgroundColor: index === 3 ? colors.sand : colors.accentSoft, padding: '12px 18px', borderRadius: 999}}>{item}</div>
          ))}
        </div>
      </div>
    </Scene>
  );
};

const LibraryScene = () => {
  const frame = useCurrentFrame();
  const copy = interpolate(frame, [14, 46], [0, 1], {easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Scene duration={135}>
      <div style={{position: 'absolute', left: 210, top: 82, width: 670, height: 920, borderRadius: 335, backgroundColor: colors.sand, opacity: 0.62}} />
      <PhoneShot file="library.png" style={{left: 220, top: 75}} />
      <div style={{position: 'absolute', left: 1050, top: 235, width: 690, opacity: copy, transform: `translateX(${(1 - copy) * 36}px)`}}>
        <Kicker>REDISCOVER</Kicker>
        <div style={{height: 28}} />
        <Headline>按内容收藏，<br />也按空间重逢。</Headline>
        <div style={{height: 38}} />
        <Body>当一个地方重新进入生活，<br />过去的兴趣也会再次浮现。</Body>
        <div style={{marginTop: 42, display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 54, height: 2, backgroundColor: colors.accent}} />
          <div style={{fontFamily, fontSize: 18, letterSpacing: 2, color: colors.muted}}>8 条内容 · 8 个空间</div>
        </div>
      </div>
    </Scene>
  );
};

const DetailScene = () => {
  const frame = useCurrentFrame();
  const quote = interpolate(frame, [18, 56], [0, 1], {easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Scene duration={120}>
      <div style={{position: 'absolute', left: 160, top: 230, width: 790, opacity: quote, transform: `translateY(${(1 - quote) * 32}px)`}}>
        <Kicker>PERSONAL ATLAS</Kicker>
        <div style={{height: 30}} />
        <div style={{fontFamily, fontSize: 48, lineHeight: 1.58, fontWeight: 570, color: colors.ink}}>
          “小时候读的是童话，长大后再看，<br />才发现它也在讨论告别、责任与远方。”
        </div>
        <div style={{marginTop: 34, fontFamily, fontSize: 22, color: colors.muted}}>《小王子》 · 圣埃克苏佩里 · 1943</div>
      </div>
      <div style={{position: 'absolute', right: 130, top: 65, width: 670, height: 940, borderRadius: 52, backgroundColor: colors.paper}} />
      <PhoneShot file="entry-detail.png" height={910} style={{right: 170, top: 85}} />
    </Scene>
  );
};

const EndCard = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const reveal = spring({frame: frame - 8, fps, config: {damping: 20, stiffness: 70}});
  const rule = interpolate(frame, [34, 74], [0, 1], {easing: easeOut, extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Scene duration={105}>
      <div style={{position: 'absolute', inset: 70, border: `1px solid ${colors.line}`, borderRadius: 48}} />
      <div style={{position: 'absolute', left: 960, top: 505, transform: `translate(-50%, -50%) scale(${0.96 + reveal * 0.04})`, opacity: reveal, textAlign: 'center'}}>
        <div style={{fontFamily, fontSize: 92, fontWeight: 760, color: colors.ink, letterSpacing: -6}}>所见</div>
        <div style={{fontFamily, fontSize: 22, fontWeight: 700, color: colors.accent, letterSpacing: 7, marginTop: 8}}>DRIFT</div>
        <div style={{height: 2, width: 290 * rule, margin: '34px auto', backgroundColor: colors.accent}} />
        <div style={{fontFamily, fontSize: 46, lineHeight: 1.35, color: colors.ink}}>看见自己如何认识世界。</div>
        <div style={{fontFamily, fontSize: 22, color: colors.muted, letterSpacing: 2.4, marginTop: 35}}>CAPTURE&nbsp;&nbsp;→&nbsp;&nbsp;SPATIALIZE&nbsp;&nbsp;→&nbsp;&nbsp;REDISCOVER</div>
      </div>
      <div style={{position: 'absolute', bottom: 95, left: 0, right: 0, textAlign: 'center', fontFamily, fontSize: 21, color: colors.muted}}>你的私人文化地图</div>
    </Scene>
  );
};

const ProgressLine = () => {
  const frame = useCurrentFrame();
  return (
    <div style={{position: 'absolute', left: 0, bottom: 0, width: `${(frame / 719) * 100}%`, height: 5, backgroundColor: colors.accent, opacity: 0.75}} />
  );
};

export const DriftPromo = () => (
  <AbsoluteFill style={{backgroundColor: colors.background, overflow: 'hidden'}}>
    <Sequence from={0} durationInFrames={105}><Intro /></Sequence>
    <Sequence from={105} durationInFrames={120}><MapScene /></Sequence>
    <Sequence from={225} durationInFrames={135}><CaptureScene /></Sequence>
    <Sequence from={360} durationInFrames={135}><LibraryScene /></Sequence>
    <Sequence from={495} durationInFrames={120}><DetailScene /></Sequence>
    <Sequence from={615} durationInFrames={105}><EndCard /></Sequence>
    <ProgressLine />
  </AbsoluteFill>
);
