# AppealMate — Backlog

## 🧰 NEW TOOLS PIPELINE (research 2026-06-26, ranked by demand × engine-reuse × low legal risk)
AppealMate = multi-tool letter engine. Each new tool = ONE data object in public/templates.js
(fields[] + grounds[{label, body}]). No new app/auth/payments.

NEXT BATCH (build now, deploy together after Netlify cap resets ~06-29):
1. [BEST NEXT] Parcel lost/damaged -> RETAILER complaint (CRA 2015). 15M ppl/month hit a parcel
   problem; £2.5bn/yr damage. Grounds: s29 risk-on-delivery, s28 non-delivery, s9 damaged/quality,
   "retailer liable not courier", s75 escalation. Reuse HIGH, licence risk VERY LOW. Price £1.99.
2. HMRC PAYE tax rebate. 3M P800 letters/yr, avg £750; HMRC stopped auto-cheques May 2024.
   Grounds: P800 claim, emergency tax code, multiple PAYE jobs, unused personal allowance.
   Reuse HIGH, risk VERY LOW. Price £2.99.
3. Council tax band challenge / single-person discount / exemptions. 43,820 challenges/yr, 27% win,
   saves £200-500/yr. Grounds: comparables, structural change, SPD reinstatement, disabled relief,
   exemptions. Reuse HIGH, risk VERY LOW. Price £2.99.

LATER:
4. Section 75 / chargeback (card complaints to FOS +147%). Reuse HIGH, risk LOW-MED (FCA sector —
   get £200-300 solicitor sign-off on template-vs-representation line). Price £2.99.
5. Energy/broadband bill + ADR escalation (92,938 ombudsman cases, 58% billing). VERY LOW risk. £1.99.
6. Faulty used car rejection (CRA 30-day). Motor HP = #1 FOS complaint. LOW risk (MED if finance). £3.99.
7. Holiday/package complaint (PTR 2018, ABTA/ATOL escalation). LOW risk. £2.99.
8. Unlawful wage/holiday-pay deduction (ERA 1996, ACAS). MED risk (FCA employment sector — scope to
   pay only, NOT unfair dismissal; legal sign-off needed). £2.99.

WORLDWIDE FLIGHT DELAY (extend existing delay tool, add departure/arrival country field):
EU261 (€250/400/600), UK261 (£220/350/520), Canada APPR (CAD125-1000), Israel, Turkey, Brazil.
US = NO cash comp; add a "US DOT refund request" letter instead.

Full sourced report from web-researcher agent in chat 2026-06-26.


## 🔐 SECURITY (from /cso audit 2026-06-26)

DONE (code fixed locally — deploys with next batch after ~06-29):
- [x] stripe-webhook.js: removed unsigned fallback; now fails closed (503) if
      STRIPE_WEBHOOK_SECRET missing. Prevents fake checkout events injecting emails.
      NOTE: STRIPE_WEBHOOK_SECRET MUST be set in Netlify env or the webhook returns 503.
- [x] stats.js: constant-time pass compare + x-admin-pass HEADER (query ?pass= still
      works but deprecated — update the dashboard to send the header so the secret
      stops appearing in logs/history).
- [x] complaint.js: escape email + page (not just message) in the alert email HTML.

TODO — BENJAMIN ONLY (cannot be automated):
- [ ] ROTATE exposed live secrets NOW (passed through chat): STRIPE_SECRET_KEY,
      RESEND_API_KEY, NETLIFY_AUTH_TOKEN. Roll each in its dashboard, update Netlify
      env + local .env, check Stripe/Resend logs for abuse in the exposure window.
- [ ] After deploy: switch the stats dashboard call to send `x-admin-pass` header,
      then rotate ADMIN_PASS.

LATER (hardening, low risk):
- [ ] Add Content-Security-Policy + security headers via netlify.toml.
- [ ] create-checkout.js: validate returnUrl against an allowlist of own domains.
- [ ] ICO data-protection fee registration (compliance, not security — we collect PII).

## ⛔ BLOCKED — Netlify deploy cap (resume ~2026-06-29)
- Netlify free account (benaiwod, shared with Every Pound) hit "Account credit usage exceeded — new deploys blocked".
- LIVE site + payments UNAFFECTED (still up, still taking money). Only NEW deploys blocked.
- Ready-but-undeployed change: SVG-free manifest (PNG icons) — needed for PWABuilder/Android.
- RESUME ~2026-06-29 (3-day wait for monthly credit reset): redeploy, then continue Android/PWABuilder build.
- DEPLOY DISCIPLINE (decided 2026-06-26): batch ALL changes locally, deploy ONCE per launch cycle (~monthly). Do NOT deploy per-edit. Conserve credits across BOTH apps (AppealMate + Every Pound share the account).
- PERMANENT FIX (later): migrate hosting to Cloudflare Pages (free, uncapped) when we set up appealmate.co.uk.



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

## Support chatbot + complaint routing (Benjamin's idea, future upgrade)
- [ ] FAQ chatbot widget: answers "what do you do / how does it work / is it legal / refunds" from a fixed Q&A set (rule-based first = free, no LLM cost; upgrade to LLM later).
- [ ] Complaint capture: if a user has a complaint, the bot collects it -> emails it to us (via Resend) -> we draft a reply.
- [ ] Alert Benjamin: ping on new complaint (email now; Telegram/WhatsApp later).
- Build approach: small client-side widget + a Netlify Function that posts complaints to Resend. Keep it free/serverless (same crash-proof pattern). Needs the verified domain (Resend) to email reliably.

## Other deferred
- [ ] Support contact: email now, WhatsApp business number later.
- [ ] PayPal as a second payment option (Stripe already covers cards + Apple/Google Pay).
- [ ] Deeper template library (more grounds), expand from success-paste wins.
- [ ] Rotate secrets that passed through chat (Netlify token, sk_live, Resend key).
