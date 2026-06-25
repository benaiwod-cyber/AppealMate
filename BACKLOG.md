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
- [ ] **App Store submission agent** — if we wrap AppealMate as an iOS app: walks Benjamin through every App Store Connect step, answers the review questionnaire, tells him exactly where to click, handles metadata/screenshots/privacy declarations. Goal: make shipping apps repeatable so he can launch more.

## App Store decision (open)
- Benjamin already pays for an Apple Developer account.
- AppealMate is a web app; to ship on iOS, wrap the existing site with Capacitor (PWA -> native shell). Low effort, reuses 100% of the code.
- CAUTION: Apple often rejects "just a website in a wrapper" unless it adds native value (e.g. camera OCR scan, push notifications, saved letters). Our OCR photo-scan + saved letters could justify it.
- CAUTION: Apple takes 15-30% of in-app purchases. For £1.99 letters, paying via the website (Stripe) keeps 100% minus Stripe fee; in-app would lose 15-30%. Likely keep payment on web, app as a convenience funnel.
- Recommendation: launch web first (done), revisit iOS wrapper after first revenue + the domain.

## Other deferred
- [ ] Support contact: email now, WhatsApp business number later.
- [ ] PayPal as a second payment option (Stripe already covers cards + Apple/Google Pay).
- [ ] Deeper template library (more grounds), expand from success-paste wins.
- [ ] Rotate secrets that passed through chat (Netlify token, sk_live, Resend key).
