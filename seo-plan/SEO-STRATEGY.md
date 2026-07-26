# AppealMate.uk — SEO Strategy & Programmatic Roadmap
_Generated 2026-07-19 via /seo-plan. Builds on appealmate.uk-audit/ACTION-PLAN.md (health 54/100)._

## 1. Discovery
- **Business**: UK consumer letter generator (parking/PCN appeals, deposit disputes, train+flight delay compensation, letter before action). Transactional £1.99-£4.99 per letter.
- **Audience**: UK drivers/renters/commuters, mobile-heavy, searching in the hours after receiving a ticket/deduction.
- **Goal**: 1M users long-term; near-term = organic traffic engine that makes paid ads optional.
- **Current state**: static site on Netlify (Cloudflare cutover pending), 4 tool pages + 3 guides indexed-ish, robots/sitemap still point at netlify.app (CRITICAL, unfixed).

## 2. Competitors
| Competitor | Strength | Gap we exploit |
|---|---|---|
| Resolver.co.uk | Huge DA, every complaint type | Slow, form-heavy; we win on "letter in 2 minutes" speed + price clarity |
| MoneySavingExpert (guides) | Trust, DA 90+ | No tool — we are the action step their readers need |
| AppealNow / parking-specific apps | App-store presence | Weak web SEO, few per-council pages |
| DoNotPay | Brand press | US-focused, UK trust issues — "UK-built" angle |
| Council/POPLA official pages | Authority for exact terms | Bureaucratic language; we rank for "how to win" intent |

Positioning: **the fastest UK-specific action tool** — every content page ends in a tool CTA.

## 3. Architecture (the 1M-user engine = programmatic pages)
```
/                              home
/parking-ticket-appeal         tool LPs (exist — keep enriching)
/tenancy-deposit-dispute
/train-flight-delay-compensation
/letter-before-action
/guides/...                    evergreen how-tos (3 exist)
/councils/{council}-pcn-appeal        ~350 pages  ← programmatic tier 1
/operators/{toc}-delay-repay          ~25 train operator pages
/airlines/{airline}-flight-delay-compensation  ~30 pages
/parking-companies/{company}-appeal   ~50 private operators (ParkingEye, Euro Car Parks…)
/tools/appeal-checker                 FREE checker (lead magnet + links)
```
Per-council template (unique data = not thin content): council name, PCN volume/stats, appeal address & portal link, deadlines (14/28 day), success-rate notes, local grounds examples, FAQ schema, tool CTA. Source data: gov.uk, council sites, FOI stats (PATROL annual report has per-council PCN counts).

Quality gates: min 400 unique words/page, unique data table per page, no page ships without ≥3 internal links in/out. Batch-generate ~25/wk, not all at once (avoid index-bloat flag).

## 4. Content strategy
- **Pillar-cluster**: each tool LP = pillar; councils/operators/airlines = spokes linking up; guides = informational capture linking down.
- **Cadence**: 1 evergreen guide/wk (Claude-drafted, human-checked) + 25 programmatic pages/wk once template proven.
- **E-E-A-T**: About page with founder story, cite POPLA/TPT stats, "letters generated" counter, testimonials/win screenshots, last-reviewed dates on guides.
- **GEO/AI search**: llms.txt already present ✅ — keep FAQ schema on everything; write in citable, direct-answer paragraphs.

## 5. Technical foundation (order matters)
1. **Fix robots.txt + sitemap.xml domain** (still netlify.app — 5 min, blocks everything else).
2. Complete Cloudflare Pages cutover (uncapped hosting needed before 400+ pages).
3. Organization + WebSite(SearchAction) schema on home; HowTo+FAQPage on guides; FAQPage on programmatic pages (in template).
4. OG/Twitter tags + 1200×630 image sitewide.
5. Sitemap auto-generated at build (index + per-section sitemaps once >500 URLs).
6. Search Console: submit sitemap, monitor coverage weekly.

## 6. Roadmap
- **Phase 1 (wk 1-2, Foundation)**: technical fixes 1-5 above, GSC + GA4, appeal-checker free tool spec.
- **Phase 2 (wk 3-8, Expansion)**: council page template + first 50 councils (biggest cities), airline + train operator pages, 6 new guides, launch free checker.
- **Phase 3 (wk 9-24, Scale)**: remaining ~300 councils + 50 parking companies, digital PR (FOI-based "worst councils for PCNs" data story → journalists + MSE forum), referral loop.
- **Phase 4 (mo 7-12, Authority)**: annual PCN report (link magnet), partnerships (renter/driver communities), continuous CRO on tool LPs.

## 7. KPIs
| Metric | Now | 3mo | 6mo | 12mo |
|---|---|---|---|---|
| Indexed pages | ~8 | 120 | 450 | 500+ |
| Organic clicks/mo | ~0 | 1,000 | 8,000 | 30,000+ |
| Ranking keywords (top 100) | <20 | 500 | 3,000 | 10,000 |
| Letters sold/mo (organic) | ~0 | 40 | 300 | 1,200 |

Risks: thin-content penalty (mitigate w/ quality gates), data staleness (annual refresh job — n8n candidate), Netlify bandwidth cap (cutover first).

**Next 3 actions**: (1) fix robots/sitemap domain, (2) finish Cloudflare cutover, (3) build council-page template + 10-page pilot, submit to GSC, watch indexing before scaling.
