# AppealMate SEO Audit — https://appealmate.uk
_Audited 2026-07-08. Health score: ~54/100 (fixable — most issues are quick wins)._
Business type: UK self-help legal/consumer letter generator (transactional + informational).

## 🔴 CRITICAL (fix first)

### 1. robots.txt + sitemap.xml point to the WRONG domain
- `robots.txt` → `Sitemap: https://appealmate-uk.netlify.app/sitemap.xml`
- Every `<loc>` in `sitemap.xml` is `https://appealmate-uk.netlify.app/...`
- Impact: Google indexes the **netlify.app** URLs, splits authority away from `appealmate.uk`, and treats the real domain as secondary/duplicate. This is the single biggest issue.
- Fix: replace all `appealmate-uk.netlify.app` with `https://appealmate.uk` in `public/robots.txt` and `public/sitemap.xml`. (Do this as part of the Cloudflare cutover.)

### 2. Core money pages are invisible to Google (SPA hash routing)
- Tools load via `#/tool`, `#/mine`, `#/refunds` fragments. Google does NOT index URL fragments as separate pages.
- So the 4 revenue tools (parking appeal, deposit dispute, flight/train delay, letter before action) have **no crawlable URL** — the exact keyword landing pages you'd want to rank for don't exist to search engines.
- Only the homepage + 3 static `/guides/*.html` are indexable.
- Fix options: (a) give each tool a real crawlable path (`/parking-ticket-appeal`, `/deposit-dispute`, …) with server-rendered intro content, or (b) build static SEO landing pages per tool that deep-link into the app. Highest-ROI SEO work on the site.

## 🟠 HIGH

### 3. Zero structured data (0 JSON-LD blocks)
- No Organization, WebSite (+SearchAction), FAQPage, or HowTo schema anywhere.
- The 3 guides are perfect for **HowTo** + **FAQPage** schema (rich results + AI citation).
- Add `Organization` + `WebSite` on the homepage; `HowTo`/`FAQPage` on each guide.

### 4. No canonical tag
- No `<link rel="canonical">` in `<head>`. Combined with the netlify.app duplication (#1), this invites duplicate-content dilution.
- Add `<link rel="canonical" href="https://appealmate.uk/">` (and per-page canonicals on guides).

## 🟡 MEDIUM

### 5. No Open Graph / Twitter Card tags
- Missing `og:title`, `og:description`, `og:image`, `twitter:card`. Shares on WhatsApp/X/FB render bare with no image — hurts CTR on social.
- Add OG tags + a 1200×630 preview image.

### 6. Thin sitemap (4 URLs)
- Only homepage + 3 guides. Add the tool landing pages (after #2) and any new guides.

## ✅ What's already good
- Strong security headers: CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options, Referrer-Policy ✅
- Title + meta description are keyword-rich and compelling ("Fight your parking ticket in 2 minutes … from £1.99") ✅
- `lang="en-GB"`, mobile viewport ✅
- `llms.txt` present (HTTP 200) — ahead of most sites for AI search ✅
- Lightweight, fast homepage; HTTPS enforced ✅
- 3 genuine SEO guide pages targeting parking-ticket keywords — good content seed ✅

## Priority order
1. Fix robots.txt + sitemap domain (5 min, do at cutover)
2. Add canonical + Organization/WebSite schema (30 min)
3. Add HowTo/FAQ schema to the 3 guides (1 hr)
4. Build crawlable per-tool landing pages (biggest ranking upside)
5. OG/Twitter tags + preview image
