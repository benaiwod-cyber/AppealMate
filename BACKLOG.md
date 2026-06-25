# AppealMate — Backlog

## Pre-public-launch gate
- [ ] Buy **appealmate.co.uk** (~£10/yr) and connect to Netlify BEFORE promoting publicly.
      (Site is technically live on appealmate-uk.netlify.app but not promoted yet.)

## Step 3 — email win-loop (weekend)
- [ ] 3.1 Buy + connect appealmate.co.uk
- [ ] 3.2 Verify domain in Resend -> send from noreply@appealmate.co.uk (free tier only sends to own email until this is done)
- [x] 3.3 Recreate Stripe webhook in LIVE mode -> set live whsec_  (in progress)

## Agents to build (Benjamin's "run like a company" vision)
- [ ] **Promotion agent** — generates cheap/free promotion ideas (Reddit r/LegalAdviceUK, MoneySavingExpert forums, TikTok/Reels, parking-appeal SEO content, Facebook groups) and runs/schedules them. Low/zero ad budget focus.
- [ ] **Play Store submission agent** — walks Benjamin through every Google Play Console step (store listing, content rating, Data safety form, screenshots, AAB upload, release tracks), answers each questionnaire, tells him exactly where to click. Goal: make shipping apps repeatable so he can launch more.

## Android / Google Play decision (Benjamin already has a paid Play dev account)
- [x] PWA done (manifest + service worker + icon) — site is now installable + offline, and TWA-ready.
- [ ] Wrap as a **TWA (Trusted Web Activity)** via PWABuilder or Bubblewrap -> AAB -> upload to Play Console.
- Keep payments on the web via Stripe (TWA loads the live site; checkout works in-app, we keep ~100% minus Stripe fee).
  NOTE: Google Play policy technically wants Google Play Billing for in-app digital goods; TWAs linking to web checkout are a grey area. Watch for review pushback; worst case the app is a free funnel that sends users to pay on web.
- Need real PNG icons (192/512) for the store — PWABuilder generates these from icon.svg.
- Recommendation: web first (done), buy domain + first revenue, THEN do the TWA wrap with the submission agent.

## Other deferred
- [ ] Support contact: email now, WhatsApp business number later.
- [ ] PayPal as a second payment option (Stripe already covers cards + Apple/Google Pay).
- [ ] Deeper template library (more grounds), expand from success-paste wins.
- [ ] Rotate secrets that passed through chat (Netlify token, sk_live, Resend key).
