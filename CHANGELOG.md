# Changelog

## 1.0.0 — 2026-06-25
- Initial build of AppealMate (free, self-owned rebuild of ClaimRight).
- 4 tools: Parking/PCN appeal (hero, 7 grounds), Tenancy deposit (3), Train/flight delay (UK261 + Delay Repay), Letter Before Action.
- Template letter engine (deterministic, no AI), client-side PDF via pdf-lib.
- Stripe Checkout via Netlify Function; pricing £1.99 first / £3.99 after / £5.99 bundle.
- Legal: disclaimer on every page + checkout, Terms + Privacy.
- Phase 2 start: success-paste capture via Netlify Forms.
- Dev-only payment stub gated to localhost/LAN (public deploy can't leak free letters).
