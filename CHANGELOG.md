# Changelog

## 1.1.1 — 2026-07-01 (security patch)
- Fixed open redirect: returnUrl now validated against allowed origins before Stripe checkout creation.
- Fixed paywall bypass: success_url now uses server-generated crypto token, not client-computed hash.
- Removed ?pass= query string auth from stats endpoint (header-only now).
- Added security headers: CSP, X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy.
- Added crossorigin attribute to CDN script tags.

## 1.1.0 — 2026-07-01
- Added 4 new tools: Lost/Damaged Parcel, Council Tax Challenge, Energy Bill Dispute, Holiday Complaint.
- Added EU261 denied boarding ground to Flight/Train Delay tool.
- Total: 8 tools, 28 letter grounds.

## 1.0.0 — 2026-06-25
- Initial build of AppealMate (free, self-owned rebuild of ClaimRight).
- 4 tools: Parking/PCN appeal (hero, 7 grounds), Tenancy deposit (3), Train/flight delay (UK261 + Delay Repay), Letter Before Action.
- Template letter engine (deterministic, no AI), client-side PDF via pdf-lib.
- Stripe Checkout via Netlify Function; pricing £1.99 first / £3.99 after / £5.99 bundle.
- Legal: disclaimer on every page + checkout, Terms + Privacy.
- Phase 2 start: success-paste capture via Netlify Forms.
- Dev-only payment stub gated to localhost/LAN (public deploy can't leak free letters).
