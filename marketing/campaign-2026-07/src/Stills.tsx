import React from 'react';
import {AbsoluteFill} from 'remotion';
import {BRAND, Cta, Disclaimer, DocumentCard, Logo, PricePill, StepCard, ToolChip} from './Brand';

const tools = [
  ['🅿️', 'Parking tickets'],
  ['↗️', 'Rejected appeals'],
  ['🏠', 'Deposit disputes'],
  ['✈️', 'Travel delays'],
  ['📦', 'Parcel problems'],
  ['🏛️', 'Council tax'],
  ['⚡', 'Energy bills'],
  ['☀️', 'Holiday complaints'],
  ['£', 'Money claims'],
] as const;

const Glow: React.FC<{top: number; left: number; colour: string; size: number}> = ({top, left, colour, size}) => (
  <div
    style={{
      position: 'absolute',
      top,
      left,
      width: size,
      height: size,
      borderRadius: '50%',
      background: colour,
      filter: 'blur(10px)',
      opacity: 0.75,
    }}
  />
);

export const ParkingSquare: React.FC = () => (
  <AbsoluteFill style={{background: BRAND.background, overflow: 'hidden', padding: 68}}>
    <Glow top={-150} left={760} size={430} colour="#DCEAFF" />
    <Glow top={760} left={-120} size={380} colour="#DDFBED" />
    <Logo size={72} />
    <div style={{display: 'flex', flex: 1, alignItems: 'center', gap: 52}}>
      <div style={{width: 540, zIndex: 2}}>
        <div style={{fontFamily: BRAND.hanken, color: BRAND.blue, fontSize: 26, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase'}}>
          Council PCN or private charge
        </div>
        <h1 style={{fontFamily: BRAND.fraunces, fontSize: 78, lineHeight: 0.98, letterSpacing: '-0.045em', color: BRAND.ink, margin: '22px 0 28px'}}>
          Parking appeal letters, simplified.
        </h1>
        <div style={{fontFamily: BRAND.hanken, color: BRAND.muted, fontSize: 30, lineHeight: 1.3, maxWidth: 500}}>
          Choose your reason. Get a formal letter ready to review and send.
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, marginTop: 34}}>
          <PricePill />
          <div style={{fontFamily: BRAND.hanken, color: BRAND.muted, fontSize: 23, fontWeight: 600}}>Around 2 minutes</div>
        </div>
      </div>
      <div style={{position: 'absolute', right: -34, top: 290, transform: 'scale(.78) rotate(-4deg)'}}>
        <DocumentCard />
      </div>
    </div>
    <div style={{display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'flex-start'}}>
      <Cta />
      <Disclaimer compact />
    </div>
  </AbsoluteFill>
);

export const StepsPortrait: React.FC = () => (
  <AbsoluteFill style={{background: BRAND.background, overflow: 'hidden', padding: '64px 72px 54px'}}>
    <Glow top={-130} left={760} size={430} colour="#DCEAFF" />
    <Logo size={68} />
    <div style={{marginTop: 66, textAlign: 'center'}}>
      <div style={{fontFamily: BRAND.hanken, color: BRAND.blue, fontSize: 27, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase'}}>
        From blank page to formal PDF
      </div>
      <h1 style={{fontFamily: BRAND.fraunces, fontSize: 82, lineHeight: 1.02, letterSpacing: '-0.045em', color: BRAND.ink, margin: '18px auto 26px', maxWidth: 850}}>
        Your letter in three clear steps.
      </h1>
      <div style={{fontFamily: BRAND.hanken, color: BRAND.muted, fontSize: 30}}>Simple questions. No legal jargon.</div>
    </div>
    <div style={{display: 'grid', gap: 20, margin: '56px auto 44px', width: 820}}>
      <StepCard number="1" title="Tell us what happened" detail="Add the details shown on your notice." active />
      <StepCard number="2" title="Choose the reason that fits" detail="Use the plain-English guidance to decide." />
      <StepCard number="3" title="Download your formal PDF" detail="Review it, then send it to the right organisation." />
    </div>
    <div style={{display: 'flex', justifyContent: 'center', gap: 22, alignItems: 'center'}}>
      <PricePill />
      <Cta />
    </div>
    <div style={{marginTop: 'auto'}}><Disclaimer /></div>
  </AbsoluteFill>
);

export const MultiToolSquare: React.FC = () => (
  <AbsoluteFill style={{background: `linear-gradient(150deg, ${BRAND.blueDark}, #0B356C)`, overflow: 'hidden', padding: 62}}>
    <Glow top={-180} left={740} size={520} colour="rgba(70, 175, 255, .42)" />
    <Logo size={68} inverse />
    <div style={{marginTop: 54, maxWidth: 860}}>
      <div style={{fontFamily: BRAND.hanken, color: '#9EE9C9', fontSize: 27, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase'}}>
        More than parking
      </div>
      <h1 style={{fontFamily: BRAND.fraunces, fontSize: 73, lineHeight: 1.02, letterSpacing: '-0.04em', color: '#FFFFFF', margin: '18px 0 20px'}}>
        Nine everyday problems. One place to start the letter.
      </h1>
    </div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, margin: '28px 0 36px'}}>
      {tools.map(([icon, label]) => <ToolChip key={label} icon={icon} label={label} inverse />)}
    </div>
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 22, marginTop: 'auto'}}>
      <div>
        <div style={{fontFamily: BRAND.hanken, color: '#FFFFFF', fontSize: 36, fontWeight: 700}}>Formal UK self-help letters</div>
        <div style={{fontFamily: BRAND.hanken, color: 'rgba(255,255,255,.72)', fontSize: 24, marginTop: 5}}>Every live tool is currently £1.99 per letter.</div>
      </div>
      <Cta label="Explore AppealMate.uk" inverse />
    </div>
    <div style={{marginTop: 22}}><Disclaimer inverse compact /></div>
  </AbsoluteFill>
);

export const ParkingStory: React.FC = () => (
  <AbsoluteFill style={{background: BRAND.background, overflow: 'hidden', padding: '290px 74px 390px'}}>
    <Glow top={-140} left={720} size={500} colour="#DCEAFF" />
    <Glow top={1320} left={-180} size={480} colour="#DDFBED" />
    <Logo size={76} />
    <div style={{marginTop: 76, textAlign: 'center'}}>
      <div style={{fontFamily: BRAND.hanken, color: BRAND.blue, fontSize: 29, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase'}}>
        Parking appeal letters
      </div>
      <h1 style={{fontFamily: BRAND.fraunces, fontSize: 94, lineHeight: 0.98, letterSpacing: '-0.05em', color: BRAND.ink, margin: '22px 0 28px'}}>
        Less blank page.<br />More clear next step.
      </h1>
      <div style={{fontFamily: BRAND.hanken, color: BRAND.muted, fontSize: 36, lineHeight: 1.35}}>
        Council PCN or private parking charge.<br />Choose your reason and create a formal PDF.
      </div>
    </div>
    <div style={{display: 'flex', justifyContent: 'center', marginTop: 46}}>
      <DocumentCard scale={0.76} />
    </div>
    <div style={{position: 'absolute', left: 76, right: 76, bottom: 535, display: 'flex', justifyContent: 'center'}}><PricePill large /></div>
    <div style={{position: 'absolute', left: 76, right: 76, bottom: 425, display: 'flex', justifyContent: 'center'}}><Cta /></div>
    <div style={{position: 'absolute', left: 76, right: 76, bottom: 390}}><Disclaimer /></div>
  </AbsoluteFill>
);

