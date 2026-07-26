# t049 — Secret Rotation Runbook (USER ACTION)

**Why:** 4 live secrets were exposed in chat. They are NOT in git (`.env` gitignored, never
committed; source only has doc references) — exposure was conversational only. Still must roll.

## Rotate each (in the provider dashboard), then update BOTH .env and Netlify env:

### 1. STRIPE_SECRET_KEY (`sk_live_...`) — HIGHEST PRIORITY (live payments)
- Stripe Dashboard → Developers → API keys → **Roll** the live secret key.
- Update `.env` `STRIPE_SECRET_KEY=` + Netlify env var.

### 2. STRIPE_WEBHOOK_SECRET (`whsec_...`)
- Stripe → Developers → Webhooks → your endpoint → **Roll signing secret**.
- Update `.env` `STRIPE_WEBHOOK_SECRET=` + Netlify env var.

### 3. RESEND_API_KEY (`re_...`)
- Resend Dashboard → API Keys → delete old, **Create** new.
- Update `.env` `RESEND_API_KEY=` + Netlify env var.

### 4. NETLIFY_AUTH_TOKEN (`nfp_...`)
- Netlify → User settings → Applications → Personal access tokens → revoke old, **New token**.
- Update `.env` `NETLIFY_AUTH_TOKEN=` (and any CI/local netlify-cli auth).

## After rotation
- Redeploy AppealMate so functions pick up new env (`netlify deploy --prod` or trigger).
- Test a Stripe test-card checkout + a Resend email to confirm new keys work.
- Tell me the new values (or set them yourself) and I'll sync `.env` + verify.

**Verified by automation:** .env gitignored + never in git history; no real secrets hardcoded
in tracked source (only doc references in README/BACKLOG). So no GitHub leak — chat-only.
