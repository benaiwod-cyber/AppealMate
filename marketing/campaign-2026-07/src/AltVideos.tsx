import React from 'react';
import {Audio} from '@remotion/media';
import {
  AbsoluteFill,
  Img,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {BRAND, Cta, DocumentCard, Logo, PricePill} from './Brand';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const AudioBed: React.FC = () => (
  <Audio src={staticFile('appealmate-bed.wav')} volume={0.12} loop />
);

const SafeScene: React.FC<{children: React.ReactNode; background?: string; dark?: boolean}> = ({
  children,
  background = '#EDE9FF',
  dark = false,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const opacity = interpolate(frame, [0, 8, durationInFrames - 8, durationInFrames], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill style={{background, color: dark ? '#FFF' : BRAND.ink, opacity, overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 290, left: 70, right: 70, bottom: 402}}>{children}</div>
    </AbsoluteFill>
  );
};

const Heading: React.FC<{kicker: string; children: React.ReactNode; light?: boolean}> = ({kicker, children, light = false}) => (
  <>
    <div style={{fontFamily: BRAND.hanken, fontSize: 25, fontWeight: 800, letterSpacing: 2.4, textTransform: 'uppercase', color: light ? '#B9D9FF' : '#7357FF'}}>
      {kicker}
    </div>
    <h1 style={{fontFamily: BRAND.fraunces, fontSize: 78, lineHeight: .98, letterSpacing: '-.045em', margin: '28px 0 48px', color: light ? '#FFF' : BRAND.ink}}>
      {children}
    </h1>
  </>
);

const VideoChoice: React.FC<{label: string; index: number; tapAt: number}> = ({label, index, tapAt}) => {
  const frame = useCurrentFrame();
  const active = index === 0 && frame >= tapAt;
  const pop = spring({frame: frame - tapAt, fps: 30, config: {damping: 14, stiffness: 170}});
  return (
    <div style={{
      padding: '29px 30px',
      borderRadius: 24,
      background: active ? '#7357FF' : '#FFF',
      color: active ? '#FFF' : BRAND.ink,
      outline: '3px solid ' + (active ? '#7357FF' : '#DCE2EA'),
      fontFamily: BRAND.hanken,
      fontSize: 31,
      fontWeight: 750,
      boxShadow: active ? '0 18px 42px rgba(70,48,170,.3)' : '0 12px 28px rgba(23,32,44,.08)',
      transform: active ? 'scale(' + (1 + .025 * Math.sin(pop * Math.PI)) + ')' : 'none',
    }}>
      <span style={{display: 'inline-grid', placeItems: 'center', width: 38, height: 38, borderRadius: '50%', marginRight: 18, background: active ? '#FFF' : '#EEF1F6', color: '#7357FF'}}>
        {active ? '✓' : ''}
      </span>
      {label}
    </div>
  );
};

const Cursor: React.FC<{tapAt: number; y: number}> = ({tapAt, y}) => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame, [12, tapAt], [0, 1], clamp);
  const pulse = interpolate(frame, [tapAt - 2, tapAt, tapAt + 8], [0, 1, 0], clamp);
  return (
    <>
      <div style={{position: 'absolute', right: 65 + travel * 180, top: y - travel * 10, fontSize: 62, filter: 'drop-shadow(0 7px 9px rgba(0,0,0,.3))'}}>☝</div>
      <div style={{position: 'absolute', right: 244, top: y + 10, width: 82, height: 82, borderRadius: '50%', border: '5px solid #FF4D83', opacity: pulse, transform: 'scale(' + (.5 + pulse) + ')'}} />
    </>
  );
};

const QuestionScene: React.FC<{second?: boolean}> = ({second = false}) => {
  const frame = useCurrentFrame();
  const reveal = spring({frame, fps: 30, config: {damping: 18}});
  const tapAt = 46;
  const labels = second ? ['Unclear or missing signs', 'Payment machine problem', 'Other circumstances'] : ['Council PCN', 'Private parking charge', 'Other parking notice'];
  return (
    <SafeScene>
      <div style={{opacity: reveal, transform: 'translateY(' + (1 - reveal) * 35 + 'px)'}}>
        <Heading kicker={second ? 'Question 2 of 3' : 'Question 1 of 3'}>
          {second ? 'Which reason fits best?' : 'What type of notice is it?'}
        </Heading>
        <div style={{display: 'grid', gap: 21}}>
          {labels.map((label, index) => <VideoChoice key={label} label={label} index={index} tapAt={tapAt} />)}
        </div>
        <div style={{marginTop: 34, fontFamily: BRAND.hanken, fontSize: 25, color: BRAND.muted}}>Tap a choice to shape the next question.</div>
      </div>
      <Cursor tapAt={tapAt} y={second ? 320 : 322} />
    </SafeScene>
  );
};

const ResultScene: React.FC = () => {
  const frame = useCurrentFrame();
  const card = spring({frame: frame - 6, fps: 30, config: {damping: 17, stiffness: 120}});
  return (
    <SafeScene background="#DFF7EC">
      <Heading kicker="Created from your answers">Your formal PDF is ready.</Heading>
      <div style={{position: 'absolute', left: 150, top: 300, transform: 'translateY(' + (1 - card) * 150 + 'px) scale(' + (.82 + card * .18) + ')', opacity: card}}>
        <DocumentCard scale={1.05} />
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, textAlign: 'center', fontFamily: BRAND.hanken, color: BRAND.muted, fontSize: 24}}>
        Review it before deciding whether to send.
      </div>
    </SafeScene>
  );
};

const TapCtaScene: React.FC = () => {
  const frame = useCurrentFrame();
  const enter = spring({frame, fps: 30, config: {damping: 16}});
  return (
    <SafeScene background="linear-gradient(150deg, #185FCB, #0A376F)" dark>
      <div style={{opacity: enter, transform: 'scale(' + (.9 + .1 * enter) + ')'}}>
        <Logo size={66} inverse />
        <div style={{marginTop: 110}}><Heading kicker="Guided from start to PDF" light>Tap. Choose. Download.</Heading></div>
        <p style={{fontFamily: BRAND.hanken, fontSize: 34, lineHeight: 1.35, color: 'rgba(255,255,255,.84)', margin: '-10px 0 42px'}}>
          Build a formal letter in around 2 minutes.
        </p>
        <Cta label="Start at AppealMate.uk" inverse />
        <div style={{marginTop: 30}}><PricePill large /></div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, fontFamily: BRAND.hanken, color: 'rgba(255,255,255,.7)', fontSize: 19, textAlign: 'center'}}>
        Self-help document service. No legal advice. Outcomes are not guaranteed.
      </div>
    </SafeScene>
  );
};

export const TapThroughReel: React.FC = () => (
  <AbsoluteFill>
    <AudioBed />
    <Sequence from={0} durationInFrames={86}><QuestionScene /></Sequence>
    <Sequence from={78} durationInFrames={104}><QuestionScene second /></Sequence>
    <Sequence from={174} durationInFrames={76}><ResultScene /></Sequence>
    <Sequence from={242} durationInFrames={58}><TapCtaScene /></Sequence>
  </AbsoluteFill>
);

const PhotoLine: React.FC<{kicker: string; title: string; detail?: string; final?: boolean}> = ({kicker, title, detail, final = false}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const reveal = spring({frame, fps: 30, config: {damping: 18}});
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], clamp);
  return (
    <div style={{opacity: reveal * out, transform: 'translateY(' + (1 - reveal) * 52 + 'px)'}}>
      <Heading kicker={kicker} light>{title}</Heading>
      {detail ? <p style={{fontFamily: BRAND.hanken, color: 'rgba(255,255,255,.85)', fontSize: 33, lineHeight: 1.35, marginTop: -12}}>{detail}</p> : null}
      {final ? <div style={{marginTop: 38, display: 'grid', gap: 26, justifyItems: 'start'}}><Cta label="Try AppealMate.uk" inverse /><PricePill /></div> : null}
    </div>
  );
};

export const PhotoKineticReel: React.FC = () => {
  const frame = useCurrentFrame();
  const zoom = interpolate(frame, [0, 299], [1.04, 1.16], clamp);
  const pan = interpolate(frame, [0, 299], [-18, 22], clamp);
  return (
    <AbsoluteFill style={{background: '#09111D', overflow: 'hidden'}}>
      <AudioBed />
      <Img src={staticFile('parking-photo.png')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '58% center', transform: 'translateX(' + pan + 'px) scale(' + zoom + ')'}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(3,10,19,.68) 0%, rgba(3,10,19,.18) 42%, rgba(3,10,19,.9) 100%)'}} />
      <div style={{position: 'absolute', top: 290, left: 70, right: 70}}><Logo size={64} inverse /></div>
      <div style={{position: 'absolute', top: 760, left: 70, right: 70, bottom: 402}}>
        <Sequence from={0} durationInFrames={78}><PhotoLine kicker="Parking notice?" title="Start with the right question." /></Sequence>
        <Sequence from={70} durationInFrames={78}><PhotoLine kicker="Guided choices" title="Add the details. Pick the reason." /></Sequence>
        <Sequence from={140} durationInFrames={80}><PhotoLine kicker="Built for review" title="Get a formal PDF." detail="A clear document created from your answers." /></Sequence>
        <Sequence from={212} durationInFrames={88}><PhotoLine kicker="A clearer next step" title="From £1.99." detail="Around 2 minutes to create." final /></Sequence>
      </div>
      <div style={{position: 'absolute', left: 70, right: 70, bottom: 348, fontFamily: BRAND.hanken, color: 'rgba(255,255,255,.7)', fontSize: 18, textAlign: 'center'}}>
        Self-help document service. No legal advice. Outcomes are not guaranteed.
      </div>
    </AbsoluteFill>
  );
};
