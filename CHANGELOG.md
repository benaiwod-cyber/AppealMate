# Changelog

## 1.2.0 — 2026-07-26
- Added Cloudflare analytics integration to admin dashboard (pageviews & requests, 24h window).
- Displays analytics metrics alongside Stripe sales data in stats endpoint (`/api/stats`).
- Admin UI conditionally shows analytics section when Cloudflare credentials are configured.
- Falls back to Stripe-only view when Cloudflare analytics unavailable.
- Added `wrangler.toml` configuration file (Cloudflare Pages deployment config).

## 1.1.2 — 2026-07-18
- Migrated to Cloudflare Pages + Pages Functions (`/api/*`); Netlify Functions removed.
- Fixed: client API calls hardcoded to `/.netlify/functions/*` — now use `/api/*` via `API_BASE` constant.
- Fixed: stats admin panel used insecure `?pass=` query string; now uses `x-admin-pass` header.
- Fixed: error messages from Stripe/fetch leaked in 500 responses; replaced with generic strings.
- Added inline validation: radio group (appeal reason) shows inline error instead of `alert()`.
- Added inline validation: required text fields get red outline + auto-focus instead of `alert()`.
- Added `public/_headers` with CSP, HSTS, X-Frame-Options, Referrer-Policy for CF Pages.
- Added `deploy_cf.ps1` deploy script (DPAPI-encrypted token, targets `appealmate-cf` CF project).
- Added BACKLOG.md with backlog items and priorities.

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
