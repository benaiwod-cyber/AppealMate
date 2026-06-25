# AppealMate

UK self-help letter generator. Four tools, parking-led:
1. **Parking Ticket / PCN Appeal** (hero — ~17m private tickets/yr + council PCNs)
2. Tenancy Deposit Dispute
3. Train & Flight Delay Claim
4. Letter Before Action

Form → pick a proven ground → template letter → Stripe unlock → PDF download.

## Stack (all free tier)
- Static site (`public/`), ES modules, no build step.
- `pdf-lib` (CDN) for client-side PDF.
- One Netlify Function (`netlify/functions/create-checkout.js`) for Stripe Checkout.
- £0/month. Stripe takes ~1.5% + 20p per sale only.

## Pricing
- First letter **£1.99** (hook) · returning **£3.99** · 3-bundle **£5.99**.
- Set in `public/app.js` (PRICE_*) and `netlify/functions/create-checkout.js` (PRICES).

## Run locally
```
cd C:/Users/benja/appealmate/public
python -m http.server 8099
# open http://localhost:8099
```
Without Netlify, the pay button drops to TEST MODE (confirm() simulates payment,
unlock + PDF work). Full Stripe needs `netlify dev` + a key.

## Go live (Netlify)
1. Push to a GitHub repo (or `netlify deploy`).
2. Netlify auto-detects `netlify.toml` (publish=public, functions wired).
3. Add env var `STRIPE_SECRET_KEY` (test key `sk_test_...` first).
4. In the functions folder, `npm i stripe` (or add a package.json dep) so the
   function can `require('stripe')`.
5. Test with Stripe test card `4242 4242 4242 4242`, then swap to `sk_live_...`.

## Legal
Disclaimer on every page + checkout: not a law firm, no legal advice, no
guaranteed outcome. Terms + Privacy at `#/terms` and `#/privacy`.

## Phase 2+ (deferred, not built)
- Success-paste: users submit winning letters → grow the library.
- Photo-scan (OCR) the ticket as a paid upsell.
- Operator/agent ecosystem + monitoring dashboard.
- Deeper template library (100s of grounds).
- Supabase for accounts + UGC when those land.
