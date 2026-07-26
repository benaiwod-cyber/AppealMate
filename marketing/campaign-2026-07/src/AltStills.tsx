import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {BRAND, Cta, DocumentCard, Logo, PricePill} from './Brand';

const Photo: React.FC<{position?: string; opacity?: number}> = ({position = 'center', opacity = 1}) => (
  <Img
    src={staticFile('parking-photo.png')}
    style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: position, opacity}}
  />
);

const FinePrint: React.FC<{light?: boolean}> = ({light = false}) => (
  <div style={{fontFamily: BRAND.hanken, fontSize: 18, lineHeight: 1.35, color: light ? 'rgba(255,255,255,.76)' : BRAND.muted}}>
    Self-help document service. Not a law firm. No legal advice. Outcomes are not guaranteed.
  </div>
);

const Kicker: React.FC<{children: React.ReactNode; light?: boolean}> = ({children, light = false}) => (
  <div style={{fontFamily: BRAND.hanken, fontSize: 24, fontWeight: 700, letterSpacing: 2.5, textTransform: 'uppercase', color: light ? '#B9D9FF' : BRAND.blue}}>
    {children}
  </div>
);

export const PhotoFeed: React.FC = () => (
  <AbsoluteFill style={{background: '#0C1624', overflow: 'hidden'}}>
    <Photo position="55% center" />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(5,13,25,.92) 0%, rgba(5,13,25,.72) 48%, rgba(5,13,25,.08) 82%)'}} />
    <div style={{position: 'absolute', inset: '76px 72px', width: 570, display: 'flex', flexDirection: 'column'}}>
      <Logo size={62} inverse />
      <div style={{marginTop: 120}}><Kicker light>Parking appeal help</Kicker></div>
      <h1 style={{fontFamily: BRAND.fraunces, color: '#FFF', fontSize: 76, lineHeight: .98, letterSpacing: '-.045em', margin: '28px 0 24px'}}>
        A parking ticket. A clearer next step.
      </h1>
      <p style={{fontFamily: BRAND.hanken, color: 'rgba(255,255,255,.86)', fontSize: 30, lineHeight: 1.3, margin: 0}}>
        Answer a few guided questions and create a formal PDF to review.
      </p>
      <div style={{display: 'flex', gap: 18, alignItems: 'center', marginTop: 46}}>
        <PricePill />
        <div style={{fontFamily: BRAND.hanken, color: '#FFF', fontWeight: 700, fontSize: 25}}>Around 2 minutes</div>
      </div>
      <div style={{marginTop: 40}}><Cta label="Build your letter" inverse /></div>
      <div style={{marginTop: 'auto'}}><FinePrint light /></div>
    </div>
  </AbsoluteFill>
);

export const PhotoStory: React.FC = () => (
  <AbsoluteFill style={{background: '#0B1422', overflow: 'hidden'}}>
    <Photo position="61% center" />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,11,21,.7) 0%, rgba(4,11,21,.2) 42%, rgba(4,11,21,.92) 100%)'}} />
    <div style={{position: 'absolute', top: 290, left: 72, right: 72}}>
      <Logo size={64} inverse />
      <div style={{marginTop: 86}}><Kicker light>Parking notice?</Kicker></div>
      <h1 style={{fontFamily: BRAND.fraunces, color: '#FFF', fontSize: 94, lineHeight: .98, letterSpacing: '-.05em', margin: '28px 0'}}>
        Start with the right questions.
      </h1>
    </div>
    <div style={{position: 'absolute', left: 72, right: 72, bottom: 402}}>
      <p style={{fontFamily: BRAND.hanken, color: '#FFF', fontSize: 32, lineHeight: 1.3, fontWeight: 500, margin: '0 0 30px'}}>
        Guided choices. Your details. A formal PDF to review.
      </p>
      <Cta label="Create yours from £1.99" inverse />
      <div style={{marginTop: 26}}><FinePrint light /></div>
    </div>
  </AbsoluteFill>
);

export const EditorialSquare: React.FC = () => (
  <AbsoluteFill style={{background: '#F3EBDD', color: '#101010', overflow: 'hidden'}}>
    <div style={{position: 'absolute', width: 485, height: 570, right: -10, top: 42, transform: 'rotate(5deg)', border: '12px solid #101010', boxShadow: '18px 18px 0 #FF4D33'}}>
      <Photo position="58% center" />
    </div>
    <div style={{position: 'absolute', width: 220, height: 62, top: 76, left: 58, background: '#FFE24A', transform: 'rotate(-3deg)'}} />
    <div style={{position: 'absolute', left: 62, top: 72, fontFamily: BRAND.hanken, fontSize: 25, fontWeight: 800, letterSpacing: 2}}>APPEALMATE.UK</div>
    <div style={{position: 'absolute', left: 56, top: 195, width: 610}}>
      <h1 style={{fontFamily: 'Impact, Arial Black, sans-serif', fontSize: 82, lineHeight: .91, letterSpacing: 1, margin: 0}}>
        DO NOT<br />START WITH<br /><span style={{color: '#FF4D33'}}>A BLANK PAGE.</span>
      </h1>
    </div>
    <div style={{position: 'absolute', left: 60, right: 50, top: 670, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12}}>
      {['PICK THE REASON.', 'ADD THE DETAILS.', 'DOWNLOAD THE PDF.'].map((text, index) => (
        <div key={text} style={{background: index === 1 ? '#FF4D33' : '#101010', color: '#FFF', minHeight: 142, padding: 20, fontFamily: BRAND.hanken, fontSize: 27, lineHeight: 1.05, fontWeight: 800, transform: 'rotate(' + (index - 1) * 1.4 + 'deg)'}}>{text}</div>
      ))}
    </div>
    <div style={{position: 'absolute', left: 60, right: 56, bottom: 58, display: 'flex', alignItems: 'end', justifyContent: 'space-between'}}>
      <FinePrint />
      <div style={{fontFamily: 'Impact, Arial Black, sans-serif', fontSize: 58, whiteSpace: 'nowrap'}}>£1.99</div>
    </div>
  </AbsoluteFill>
);

const SlideNumber: React.FC<{number: string; light?: boolean}> = ({number, light = false}) => (
  <div style={{position: 'absolute', right: 52, top: 48, width: 58, height: 58, borderRadius: '50%', display: 'grid', placeItems: 'center', background: light ? '#FFF' : BRAND.ink, color: light ? BRAND.ink : '#FFF', fontFamily: BRAND.hanken, fontWeight: 800, fontSize: 22}}>{number}</div>
);

export const CarouselHook: React.FC = () => (
  <AbsoluteFill style={{background: '#0A1422', overflow: 'hidden'}}>
    <Photo position="58% center" />
    <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(4,10,18,.18), rgba(4,10,18,.9))'}} />
    <SlideNumber number="01" light />
    <div style={{position: 'absolute', left: 64, right: 64, bottom: 76}}>
      <Kicker light>Swipe to see how</Kicker>
      <h1 style={{fontFamily: BRAND.fraunces, color: '#FFF', fontSize: 91, lineHeight: .96, letterSpacing: '-.05em', margin: '24px 0'}}>Parking notice?<br />Start here.</h1>
      <div style={{fontFamily: BRAND.hanken, color: '#FFF', fontSize: 29, fontWeight: 700}}>No blank page. No legal jargon maze. →</div>
    </div>
  </AbsoluteFill>
);

const Choice: React.FC<{label: string; selected?: boolean}> = ({label, selected = false}) => (
  <div style={{padding: '25px 28px', borderRadius: 22, background: selected ? '#7357FF' : '#FFF', color: selected ? '#FFF' : BRAND.ink, outline: '3px solid ' + (selected ? '#7357FF' : '#DCE2EA'), fontFamily: BRAND.hanken, fontSize: 29, fontWeight: 700, boxShadow: selected ? '0 18px 38px rgba(58,35,155,.3)' : 'none'}}>
    <span style={{display: 'inline-grid', placeItems: 'center', width: 34, height: 34, borderRadius: '50%', marginRight: 18, background: selected ? '#FFF' : '#EEF1F6', color: '#7357FF'}}>{selected ? '✓' : ''}</span>{label}
  </div>
);

export const CarouselTap: React.FC = () => (
  <AbsoluteFill style={{background: '#EDE9FF', padding: 68}}>
    <SlideNumber number="02" />
    <Kicker>Tap to build</Kicker>
    <h1 style={{fontFamily: BRAND.fraunces, fontSize: 69, lineHeight: 1, letterSpacing: '-.04em', margin: '32px 0 42px', color: BRAND.ink}}>What type of notice is it?</h1>
    <div style={{display: 'grid', gap: 20}}>
      <Choice label="Council PCN" selected />
      <Choice label="Private parking charge" />
      <Choice label="Other parking notice" />
    </div>
    <div style={{marginTop: 38, borderRadius: 26, background: '#FFF', padding: 26, fontFamily: BRAND.hanken, color: BRAND.muted, fontSize: 25}}>
      We use your choices to shape the next question.
    </div>
  </AbsoluteFill>
);

export const CarouselResult: React.FC = () => (
  <AbsoluteFill style={{background: '#DFF7EC', overflow: 'hidden'}}>
    <SlideNumber number="03" />
    <div style={{position: 'absolute', left: 62, top: 72, width: 505}}>
      <Kicker>Your next step</Kicker>
      <h1 style={{fontFamily: BRAND.fraunces, color: BRAND.ink, fontSize: 72, lineHeight: .98, letterSpacing: '-.05em', margin: '28px 0 24px'}}>Your formal PDF is ready to review.</h1>
      <p style={{fontFamily: BRAND.hanken, fontSize: 28, lineHeight: 1.3, color: BRAND.muted}}>Built from your details and selected reason.</p>
      <div style={{marginTop: 34}}><Cta label="Try AppealMate" /></div>
      <div style={{marginTop: 24}}><PricePill /></div>
    </div>
    <div style={{position: 'absolute', right: -36, bottom: -55, transform: 'rotate(-5deg)'}}><DocumentCard scale={.9} /></div>
    <div style={{position: 'absolute', left: 62, right: 62, bottom: 38}}><FinePrint /></div>
  </AbsoluteFill>
);
