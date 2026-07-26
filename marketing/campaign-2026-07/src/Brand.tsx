import React from 'react';
import {Img, staticFile} from 'remotion';
import {loadFont as loadFraunces} from '@remotion/google-fonts/Fraunces';
import {loadFont as loadHankenGrotesk} from '@remotion/google-fonts/HankenGrotesk';

const fraunces = loadFraunces('normal', {weights: ['600'], subsets: ['latin']});
const hanken = loadHankenGrotesk('normal', {weights: ['400', '500', '600', '700'], subsets: ['latin']});

export const BRAND = {
  blue: '#1F6FEB',
  blueDark: '#1554C0',
  green: '#15C47E',
  ink: '#16202C',
  muted: '#5C6B7A',
  line: '#E4E8EF',
  paper: '#FFFFFF',
  background: '#F7F8FB',
  warm: '#FFF8EC',
  fraunces: fraunces.fontFamily,
  hanken: hanken.fontFamily,
} as const;

export const Logo: React.FC<{size?: number; inverse?: boolean}> = ({size = 64, inverse = false}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.28}}>
    <Img
      src={staticFile('appealmate-icon.png')}
      style={{width: size, height: size, borderRadius: size * 0.2, boxShadow: '0 12px 28px rgba(10, 42, 88, 0.2)'}}
    />
    <div
      style={{
        fontFamily: BRAND.fraunces,
        fontSize: size * 0.58,
        fontWeight: 600,
        color: inverse ? '#FFFFFF' : BRAND.ink,
        letterSpacing: '-0.03em',
      }}
    >
      Appeal<span style={{color: inverse ? '#A8D1FF' : BRAND.blue}}>Mate</span>
    </div>
  </div>
);

export const Cta: React.FC<{label?: string; inverse?: boolean}> = ({label = 'Start at AppealMate.uk', inverse = false}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: '24px 34px',
      borderRadius: 24,
      background: inverse ? '#FFFFFF' : BRAND.blue,
      color: inverse ? BRAND.blueDark : '#FFFFFF',
      fontFamily: BRAND.hanken,
      fontSize: 34,
      fontWeight: 700,
      boxShadow: inverse ? '0 14px 36px rgba(3, 35, 80, 0.28)' : '0 14px 36px rgba(31, 111, 235, 0.28)',
    }}
  >
    {label}<span aria-hidden>→</span>
  </div>
);

export const Disclaimer: React.FC<{inverse?: boolean; compact?: boolean}> = ({inverse = false, compact = false}) => (
  <div
    style={{
      color: inverse ? 'rgba(255,255,255,0.78)' : BRAND.muted,
      fontFamily: BRAND.hanken,
      fontSize: compact ? 20 : 23,
      lineHeight: 1.35,
      textAlign: 'center',
    }}
  >
    Self-help document service. Not a law firm. No legal advice. Outcomes are not guaranteed.
  </div>
);

export const PricePill: React.FC<{large?: boolean}> = ({large = false}) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'baseline',
      gap: 10,
      borderRadius: 999,
      padding: large ? '20px 28px' : '14px 22px',
      background: '#E8FFF4',
      color: '#087A4C',
      fontFamily: BRAND.hanken,
      fontSize: large ? 42 : 29,
      fontWeight: 700,
      boxShadow: 'inset 0 0 0 2px rgba(21, 196, 126, 0.22)',
    }}
  >
    £1.99 <span style={{fontSize: large ? 24 : 19, fontWeight: 600}}>per letter</span>
  </div>
);

export const DocumentCard: React.FC<{scale?: number; checked?: boolean}> = ({scale = 1, checked = true}) => (
  <div
    style={{
      width: 450 * scale,
      height: 590 * scale,
      borderRadius: 28 * scale,
      background: BRAND.paper,
      padding: 42 * scale,
      boxShadow: '0 30px 80px rgba(18, 44, 78, 0.18)',
      transform: 'rotate(2deg)',
      outline: `2px solid ${BRAND.line}`,
    }}
  >
    <div style={{fontFamily: BRAND.fraunces, fontWeight: 600, fontSize: 38 * scale, color: BRAND.ink}}>Formal appeal</div>
    <div style={{fontFamily: BRAND.hanken, fontSize: 19 * scale, color: BRAND.muted, marginTop: 10 * scale}}>Ready to review and send</div>
    {[0.9, 1, 0.78, 0.96, 0.63, 0.86].map((width, index) => (
      <div
        key={index}
        style={{
          width: `${width * 100}%`,
          height: 13 * scale,
          borderRadius: 99,
          background: index === 0 ? '#CFE0FA' : '#E9EDF3',
          marginTop: (index === 0 ? 38 : 20) * scale,
        }}
      />
    ))}
    {checked ? (
      <div
        style={{
          marginTop: 52 * scale,
          display: 'flex',
          alignItems: 'center',
          gap: 13 * scale,
          color: '#087A4C',
          fontFamily: BRAND.hanken,
          fontSize: 22 * scale,
          fontWeight: 700,
        }}
      >
        <span
          style={{
            display: 'grid',
            placeItems: 'center',
            width: 34 * scale,
            height: 34 * scale,
            borderRadius: '50%',
            background: '#D9FBEA',
          }}
        >
          ✓
        </span>
        PDF ready
      </div>
    ) : null}
  </div>
);

export const StepCard: React.FC<{number: string; title: string; detail: string; active?: boolean}> = ({
  number,
  title,
  detail,
  active = false,
}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      padding: '24px 26px',
      borderRadius: 24,
      background: active ? '#F2F7FF' : BRAND.paper,
      outline: `2px solid ${active ? BRAND.blue : BRAND.line}`,
      boxShadow: active ? '0 18px 45px rgba(31, 111, 235, 0.14)' : '0 12px 32px rgba(18, 44, 78, 0.08)',
    }}
  >
    <div
      style={{
        flex: '0 0 auto',
        width: 62,
        height: 62,
        borderRadius: 20,
        background: active ? BRAND.blue : '#EAF0F8',
        color: active ? '#FFFFFF' : BRAND.blue,
        display: 'grid',
        placeItems: 'center',
        fontFamily: BRAND.hanken,
        fontSize: 30,
        fontWeight: 700,
      }}
    >
      {number}
    </div>
    <div>
      <div style={{fontFamily: BRAND.hanken, fontSize: 31, fontWeight: 700, color: BRAND.ink}}>{title}</div>
      <div style={{fontFamily: BRAND.hanken, fontSize: 22, color: BRAND.muted, marginTop: 2}}>{detail}</div>
    </div>
  </div>
);

export const ToolChip: React.FC<{icon: string; label: string; inverse?: boolean}> = ({icon, label, inverse = false}) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: '17px 21px',
      borderRadius: 18,
      background: inverse ? 'rgba(255,255,255,0.12)' : BRAND.paper,
      outline: inverse ? '1px solid rgba(255,255,255,0.22)' : `2px solid ${BRAND.line}`,
      color: inverse ? '#FFFFFF' : BRAND.ink,
      fontFamily: BRAND.hanken,
      fontSize: 24,
      fontWeight: 600,
    }}
  >
    <span style={{fontSize: 30}}>{icon}</span>{label}
  </div>
);
