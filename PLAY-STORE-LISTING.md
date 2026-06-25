# AppealMate — Google Play listing pack (paste-ready)

App: AppealMate  ·  Package id: `app.appealmate.uk`  ·  Category: Tools (or Finance)
PWA source: https://appealmate-uk.netlify.app

---

## A. Build the Android app (TWA) — do this first
Use **PWABuilder** (free, browser, no coding):
1. Go to https://www.pwabuilder.com
2. Enter: `https://appealmate-uk.netlify.app` → Start.
3. It scores the PWA (we already have manifest + service worker + icon, so it passes).
4. Click **Package for stores → Android → Generate**.
5. Options: Package id `app.appealmate.uk`, app name `AppealMate`. Let it generate a **new signing key** (DOWNLOAD AND KEEP the .keystore + passwords — losing it means you can never update the app).
6. Download the zip. It contains:
   - `app-release-bundle.aab`  ← upload this to Play
   - `assetlinks.json`  ← send me this; I host it at /.well-known/ so the app opens fullscreen (no browser bar)
   - the signing key + a readme with the SHA256 fingerprint

Send me the `assetlinks.json` (or the SHA256 fingerprint) and I'll deploy it to the site.

---

## B. Store listing — paste these

**App name (30 max):**
`AppealMate: Appeal Parking Fines`

**Short description (80 max):**
`Appeal parking tickets, PCNs & deposit disputes. A formal letter in 2 minutes.`

**Full description (paste as-is):**
```
Got a parking ticket you think is unfair? AppealMate writes your appeal letter in
2 minutes.

Answer a few quick questions, choose your reason, and get a formal, ready-to-send
letter — for council PCNs, private parking charges, tenancy deposit disputes,
train and flight delay compensation, and letters before action.

• Built for UK rules — council and private parking, POPLA/IAS, deposit schemes,
  Delay Repay and UK261.
• Proven grounds to choose from: unclear signage, grace period, already paid,
  valid permit/Blue Badge, loading, broken machine, and more.
• Scan your ticket with your camera and we fill the form for you.
• Download your letter as a PDF, ready to send.
• From just £1.99.

AppealMate provides self-help letter templates and document assistance. It is not
a law firm and does not provide legal advice, and does not guarantee any outcome.
```

**Contact email:** benaiwod@gmail.com
**Privacy policy URL:** https://appealmate-uk.netlify.app/#/privacy
**Website:** https://appealmate-uk.netlify.app

---

## C. Content rating questionnaire (answers)
- Category: **Utility / Productivity / Communication**
- Violence, sexual, profanity, drugs, gambling: **No** to all.
- Does the app share user location / sensitive content: **No.**
→ Expected rating: **PEGI 3 / Everyone.**

## D. Data safety form (answers)
Data collected:
- **Name, address, vehicle registration** — used by the user to fill their own letter
  (processed in-browser). Purpose: **App functionality.** Not shared. Not used for ads.
- **Email + payment** — collected by **Stripe** at checkout. Purpose: **Payments.**
  Processed by Stripe; we don't store card data.
Answers:
- Does your app collect or share user data? **Yes (collects, does not share).**
- Is data encrypted in transit? **Yes.**
- Can users request deletion? **Yes — via the contact email.**

## E. Store assets needed
- App icon 512×512 PNG (PWABuilder generates from icon.svg).
- Feature graphic 1024×500 PNG.
- At least 2 phone screenshots (open the live site on your phone, screenshot the
  home + a letter result). I can also generate simple branded screenshots if you want.

## F. Release path (new personal account)
1. Play Console → **Create app** → name AppealMate, app, free, declarations.
2. Fill **Store listing** (section B), **Content rating** (C), **Data safety** (D).
3. **Closed testing** → create a track → add **12+ testers** (emails) → upload the `.aab`.
4. Run the closed test **14 days** (Google requirement for new accounts).
5. Apply for **Production** → upload same/updated `.aab` → submit for review.
6. Review ~1–7 days → live.
