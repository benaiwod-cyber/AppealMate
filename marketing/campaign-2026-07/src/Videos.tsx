import React from 'react';
import {Audio} from '@remotion/media';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND, Cta, Disclaimer, DocumentCard, Logo, PricePill, StepCard, ToolChip} from './Brand';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const Reveal: React.FC<{children: React.ReactNode; delay?: number; distance?: number}> = ({children, delay = 0, distance = 46}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({frame: frame - delay, fps, config: {damping: 200}, durationInFrames: 0.6 * fps});
  return <div style={{opacity: progress, transform: `translateY(${(1 - progress) * distance}px)`}}>{children}</div>;
};

const Scene: React.FC<{children: React.ReactNode; dark?: boolean}> = ({children, dark = false}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const fadeIn = interpolate(frame, [0, 0.25 * fps], [0, 1], clamp);
  const fadeOut = interpolate(frame, [durationInFrames - 0.3 * fps, durationInFrames], [1, 0], clamp);
  return (
    <AbsoluteFill
      style={{
        background: dark ? `linear-gradient(150deg, ${BRAND.blueDark}, #0B356C)` : BRAND.background,
        color: dark ? '#FFFFFF' : BRAND.ink,
        opacity: fadeIn * fadeOut,
        overflow: 'hidden',
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

const Soundtrack: React.FC = () => (
  <Audio
    src={staticFile('appealmate-bed.wav')}
    volume={(frame) => interpolate(frame, [0, 20, 320, 359], [0, 0.18, 0.18, 0], clamp)}
  />
);

const Footer: React.FC<{inverse?: boolean}> = ({inverse = false}) => (
  <div style={{position: 'absolute', left: 72, right: 72, bottom: 395}}>
    <Disclaimer inverse={inverse} compact />
  </div>
);

const ParkingIntro: React.FC = () => (
  <Scene>
    <div style={{padding: '290px 72px 390px'}}>
      <Reveal><Logo size={76} /></Reveal>
      <div style={{marginTop: 130}}>
        <Reveal delay={5}>
          <div style={{fontFamily: BRAND.hanken, color: BRAND.blue, fontSize: 32, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase'}}>
            Parking appeal letters
          </div>
        </Reveal>
        <Reveal delay={10}>
          <h1 style={{fontFamily: BRAND.fraunces, fontSize: 120, lineHeight: 0.98, letterSpacing: '-0.055em', margin: '28px 0 38px', maxWidth: 930}}>
            A clear next step after a parking ticket.
          </h1>
        </Reveal>
        <Reveal delay={18}>
          <div style={{fontFamily: BRAND.hanken, color: BRAND.muted, fontSize: 42, lineHeight: 1.35, maxWidth: 850}}>
            Council PCN or private parking charge — start in the right place.
          </div>
        </Reveal>
      </div>
    </div>
    <Footer />
  </Scene>
);

const ParkingChoose: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const first = spring({frame, fps, config: {damping: 200}, durationInFrames: 0.5 * fps});
  const second = spring({frame: frame - 12, fps, config: {damping: 200}, durationInFrames: 0.5 * fps});
  const third = spring({frame: frame - 24, fps, config: {damping: 200}, durationInFrames: 0.5 * fps});
  return (
    <Scene>
      <div style={{padding: '290px 72px 390px'}}>
        <Logo size={68} />
        <div style={{marginTop: 70, fontFamily: BRAND.hanken, color: BRAND.blue, fontSize: 30, fontWeight: 700}}>STEP 1 + 2</div>
        <h2 style={{fontFamily: BRAND.fraunces, fontSize: 92, lineHeight: 1.02, letterSpacing: '-0.045em', margin: '22px 0 28px'}}>
          Add the details. Choose the reason that fits.
        </h2>
        <div style={{fontFamily: BRAND.hanken, color: BRAND.muted, fontSize: 34}}>Plain-English guidance helps you decide.</div>
        <div style={{display: 'grid', gap: 24, marginTop: 76}}>
          {[
            ['Unclear or inadequate signs', first],
            ['Payment or machine issue', second],
            ['Grace period or timing', third],
          ].map(([label, progress], index) => (
            <div
              key={String(label)}
              style={{
                opacity: Number(progress),
                transform: `translateX(${(1 - Number(progress)) * 80}px)`,
                display: 'flex',
                alignItems: 'center',
                gap: 24,
                padding: '30px 32px',
                borderRadius: 28,
                background: index === 0 ? '#F2F7FF' : '#FFFFFF',
                outline: `2px solid ${index === 0 ? BRAND.blue : BRAND.line}`,
                boxShadow: '0 16px 40px rgba(18, 44, 78, 0.1)',
                fontFamily: BRAND.hanken,
                fontSize: 34,
                fontWeight: 600,
              }}
            >
              <div style={{width: 52, height: 52, borderRadius: '50%', display: 'grid', placeItems: 'center', background: index === 0 ? BRAND.blue : '#EAF0F8', color: index === 0 ? '#FFFFFF' : BRAND.blue}}>
                {index === 0 ? '✓' : ''}
              </div>
              {String(label)}
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </Scene>
  );
};

const ParkingResult: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const doc = spring({frame, fps, config: {damping: 20, stiffness: 170}, durationInFrames: 0.8 * fps});
  return (
    <Scene>
      <div style={{padding: '290px 72px 390px', textAlign: 'center'}}>
        <Logo size={68} />
        <Reveal delay={4}>
          <div style={{marginTop: 60, fontFamily: BRAND.hanken, color: BRAND.green, fontSize: 30, fontWeight: 700}}>STEP 3</div>
          <h2 style={{fontFamily: BRAND.fraunces, fontSize: 94, lineHeight: 1.02, letterSpacing: '-0.045em', margin: '18px 0 24px'}}>
            Review and download your formal PDF.
          </h2>
          <div style={{fontFamily: BRAND.hanken, color: BRAND.muted, fontSize: 34}}>Built from the details and reason you selected.</div>
        </Reveal>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 48, transform: `scale(${0.75 + 0.25 * doc}) rotate(${(1 - doc) * -7}deg)`, opacity: doc}}>
          <DocumentCard scale={0.78} />
        </div>
      </div>
      <Footer />
    </Scene>
  );
};

const ParkingCta: React.FC = () => (
  <Scene dark>
    <div style={{padding: '290px 72px 390px', textAlign: 'center'}}>
      <Reveal><Logo size={80} inverse /></Reveal>
      <Reveal delay={8}>
        <h2 style={{fontFamily: BRAND.fraunces, fontSize: 110, lineHeight: 0.98, letterSpacing: '-0.05em', margin: '120px 0 32px'}}>
          Less blank page.<br />More clear next step.
        </h2>
      </Reveal>
      <Reveal delay={16}>
        <div style={{fontFamily: BRAND.hanken, fontSize: 39, lineHeight: 1.35, color: 'rgba(255,255,255,.78)'}}>
          Parking appeal letters in around two minutes.
        </div>
      </Reveal>
      <Reveal delay={24}>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 58}}><PricePill large /></div>
        <div style={{display: 'flex', justifyContent: 'center', marginTop: 32}}><Cta inverse /></div>
      </Reveal>
    </div>
    <Footer inverse />
  </Scene>
);

export const ParkingReel: React.FC = () => (
  <AbsoluteFill>
    <Soundtrack />
    <Sequence from={0} durationInFrames={84} premountFor={30}><ParkingIntro /></Sequence>
    <Sequence from={78} durationInFrames={102} premountFor={30}><ParkingChoose /></Sequence>
    <Sequence from={174} durationInFrames={96} premountFor={30}><ParkingResult /></Sequence>
    <Sequence from={264} durationInFrames={96} premountFor={30}><ParkingCta /></Sequence>
  </AbsoluteFill>
);

const toolSets = [
  [['🅿️', 'Parking tickets'], ['↗️', 'Rejected appeals'], ['🏠', 'Deposit disputes']],
  [['✈️', 'Travel delays'], ['📦', 'Parcel problems'], ['🏛️', 'Council tax']],
  [['⚡', 'Energy bills'], ['☀️', 'Holiday complaints'], ['£', 'Money claims']],
] as const;

const ToolWall: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <Scene dark>
      <div style={{padding: '290px 72px 390px'}}>
        <Logo size={72} inverse />
        <Reveal delay={5}>
          <h1 style={{fontFamily: BRAND.fraunces, fontSize: 100, lineHeight: 0.98, letterSpacing: '-0.05em', margin: '105px 0 30px'}}>
            Nine everyday problems. One place to start.
          </h1>
        </Reveal>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 56}}>
          {toolSets.flat().map(([icon, label], index) => {
            const start = index * 4;
            const p = spring({frame: frame - start, fps, config: {damping: 200}, durationInFrames: 0.45 * fps});
            return <div key={label} style={{opacity: p, transform: `translateX(${(1 - p) * 70}px)`}}><ToolChip icon={icon} label={label} inverse /></div>;
          })}
        </div>
      </div>
      <Footer inverse />
    </Scene>
  );
};

const ThreeSteps: React.FC = () => (
  <Scene>
    <div style={{padding: '290px 72px 390px'}}>
      <Logo size={72} />
      <Reveal delay={4}>
        <div style={{marginTop: 86, fontFamily: BRAND.hanken, color: BRAND.blue, fontSize: 30, fontWeight: 700}}>HOW IT WORKS</div>
        <h2 style={{fontFamily: BRAND.fraunces, fontSize: 94, lineHeight: 1, letterSpacing: '-0.05em', margin: '18px 0 24px'}}>No blank page. No legal jargon.</h2>
      </Reveal>
      <div style={{display: 'grid', gap: 20, marginTop: 48}}>
        <Reveal delay={12}><StepCard number="1" title="Answer a few questions" detail="Tell AppealMate what happened." active /></Reveal>
        <Reveal delay={21}><StepCard number="2" title="Choose the reason" detail="Use the plain-English guidance." /></Reveal>
        <Reveal delay={30}><StepCard number="3" title="Download your PDF" detail="Review it and send it." /></Reveal>
      </div>
      <Reveal delay={38}>
        <div style={{marginTop: 42, fontFamily: BRAND.hanken, color: BRAND.muted, fontSize: 32, lineHeight: 1.35, textAlign: 'center'}}>
          Every live tool is currently £1.99 per letter.
        </div>
      </Reveal>
    </div>
    <Footer />
  </Scene>
);

const MultiCta: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const float = interpolate(frame, [0, fps, 2 * fps], [0, -18, 0], {easing: Easing.inOut(Easing.sin), ...clamp});
  return (
    <Scene dark>
      <div style={{padding: '290px 72px 390px', textAlign: 'center'}}>
        <Logo size={80} inverse />
        <Reveal delay={4}>
          <div style={{transform: `translateY(${float}px)`, marginTop: 92, display: 'flex', justifyContent: 'center'}}>
            <DocumentCard scale={0.7} />
          </div>
        </Reveal>
        <Reveal delay={12}>
          <h2 style={{fontFamily: BRAND.fraunces, fontSize: 92, lineHeight: 1, letterSpacing: '-0.05em', margin: '48px 0 24px'}}>
            Start the letter.<br />Keep the next step clear.
          </h2>
        </Reveal>
        <Reveal delay={20}>
          <div style={{display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'center'}}>
            <PricePill />
            <Cta label="Explore AppealMate.uk" inverse />
          </div>
        </Reveal>
      </div>
      <Footer inverse />
    </Scene>
  );
};

export const MultiToolReel: React.FC = () => (
  <AbsoluteFill>
    <Soundtrack />
    <Sequence from={0} durationInFrames={132} premountFor={30}><ToolWall /></Sequence>
    <Sequence from={126} durationInFrames={126} premountFor={30}><ThreeSteps /></Sequence>
    <Sequence from={246} durationInFrames={114} premountFor={30}><MultiCta /></Sequence>
  </AbsoluteFill>
);

