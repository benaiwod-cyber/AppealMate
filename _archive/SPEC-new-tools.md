# SPEC — New AppealMate Tools (Parcel, Council Tax, Energy/Broadband, Holiday) + Flight EU261

Authored 2026-06-26. Scope picked by Benjamin: tools 1, 3, 5, 7 from the research
ranking, plus extending the existing `delay` tool to cover EU flights (UK + Europe
only — no worldwide).

## Context

AppealMate is a multi-tool letter engine. A new tool = one object appended to
`TOOLS` in `public/templates.js` + its id added to `TOOL_ORDER`. Letters are
deterministic `{{placeholder}}` templates, not AI output. Pricing is global
(app.js PRICE_*: £1.99 first / £3.99 return / £5.99 bundle) — new tools inherit it,
no per-tool pricing.

## Current state (verified 2026-06-26)

- `public/templates.js` defines 4 tools: parking (hero, 11 grounds), deposit (5),
  delay (2: flight UK261 + train), lba (1). Shape confirmed by reading the file.
- `public/app.js:1` imports `{ TOOLS, TOOL_ORDER }`. `app.js:44` renders a card per
  `TOOL_ORDER` id. `app.js:98` has the only tool-id special-case (`id === 'parking'`
  OCR zone). Adding tools touches no other logic.
- Field types in use: `text`, `textarea`, `date`, `select` (+ `options:[]`).
- Letter body convention: open by identifying the matter + key facts, state the
  ground citing the law, request the remedy, name the escalation route. Keep that
  voice in every new ground.

## Out of scope

- Per-tool pricing (global ladder stays).
- OCR/photo-scan for new tools (parking-only, deferred).
- Section 75, HMRC, used-car, employment tools (later batch — higher legal review).
- Worldwide flight (Canada/Brazil/US). EU + UK only.
- Any deploy — Netlify cap blocks new deploys until ~2026-06-29. Build + batch now.

## Acceptance criteria

1. Four new tool objects appended to `TOOLS`; `TOOL_ORDER` updated to include them.
2. `delay` tool gains a third ground `flight-eu` (EU261); blurb updated to mention EU.
3. Every ground body renders with no orphan `{{placeholders}}` for its tool's fields.
4. Each new tool appears as a card on the home screen and completes the full flow:
   form → pick ground → preview letter → pay (TEST MODE locally) → PDF download.
5. Existing 4 tools unchanged in behaviour (no regression — they share the engine).
6. Disclaimer (not legal advice) shows on every new tool, same as existing.

## Files reference

| File | Change |
|------|--------|
| `public/templates.js` | Append 4 tool objects; add `flight-eu` ground to `delay`; update `delay.blurb`; extend `TOOL_ORDER` |
| `public/app.js:98` | No change needed (parking special-case only) — verify new tools don't need OCR |
| `public/sitemap.xml` | Add `#/tool/<id>` entries for the 4 new tools (SEO) |
| `README.md` | Update tool count / list |

---

## Tool 1 — Parcel / Delivery Complaint  (`id: 'parcel'`)

**Situation:** A retailer's delivery arrived damaged or never came; the retailer
(not the courier) is liable under the Consumer Rights Act 2015. Letter demands
refund/replacement and names the retailer's liability.

**Fields**

| id | label | type | required | options |
|----|-------|------|----------|---------|
| yourName | Your full name | text | yes | |
| yourAddress | Your address | textarea | yes | |
| retailer | Retailer / seller name | text | yes | |
| orderRef | Order number / reference | text | yes | |
| orderDate | Date of order | date | yes | |
| itemValue | Value of the goods (£) | text | yes | |
| detail | What went wrong (optional) | textarea | no | |

**Grounds (3)**

- `damaged` — Goods arrived damaged
- `notdelivered` — Order never arrived
- `retailer-liable` — Retailer told me to chase the courier

---

## Tool 3 — Council Tax Challenge  (`id: 'counciltax'`)

**Situation:** Householder wants to challenge their band (overvalued), claim/restore
single person discount, or apply for an exemption. Note: band challenges are
addressed to the **Valuation Office Agency (VOA)**; discounts/exemptions to the
**council**. The ground body states the correct addressee.

**Fields**

| id | label | type | required | options |
|----|-------|------|----------|---------|
| yourName | Your full name | text | yes | |
| yourAddress | Property address | textarea | yes | |
| council | Council name | text | yes | |
| accountRef | Council tax account / reference | text | no | |
| currentBand | Current council tax band | select | yes | A,B,C,D,E,F,G,H,Not sure |
| detail | Extra detail (optional) | textarea | no | |

**Grounds (5)**

- `band-comparables` — Band challenge: similar properties are in a lower band (to VOA)
- `band-change` — Band challenge: the property or area has materially changed (to VOA)
- `spd` — Single person discount: apply or restore wrongly removed 25% (to council)
- `disabled` — Disabled band reduction (to council)
- `exemption` — Exemption: student / empty / Class F deceased estate (to council)

---

## Tool 5 — Energy / Broadband Bill Complaint  (`id: 'energy'`)

**Situation:** Unresolved billing dispute with an energy or broadband/mobile
provider. Two-step: formal complaint, then ADR escalation after 8 weeks
(Energy Ombudsman / Communications Ombudsman). Modelled as separate grounds; a
`weeksUnresolved` field drives the escalation ground.

**Fields**

| id | label | type | required | options |
|----|-------|------|----------|---------|
| yourName | Your full name | text | yes | |
| yourAddress | Your address | textarea | yes | |
| provider | Provider name | text | yes | |
| serviceType | Service | select | yes | Energy, Broadband / mobile |
| accountRef | Account number | text | no | |
| issue | What is the billing problem? | textarea | yes | |
| weeksUnresolved | Weeks unresolved so far | text | no | |
| detail | Extra detail (optional) | textarea | no | |

**Grounds (5)**

- `backbilling` — Back-billing: charged for energy more than 12 months old (energy)
- `disputed-usage` — Estimated/disputed bill; actual meter readings given
- `price-rise` — Mid-contract price rise / right to exit
- `final-bill` — Disputed final bill / exit fees after switching
- `adr-escalation` — 8-week deadlock: escalate to the Ombudsman

---

## Tool 7 — Holiday / Package Complaint  (`id: 'holiday'`)

**Situation:** Package holiday materially different from what was sold, or operator
refusing a refund. Rights under the Package Travel Regulations 2018; escalation to
ABTA/ATOL after 28 days.

**Fields**

| id | label | type | required | options |
|----|-------|------|----------|---------|
| yourName | Your full name | text | yes | |
| yourAddress | Your address | textarea | yes | |
| operator | Tour operator / travel company | text | yes | |
| bookingRef | Booking reference | text | yes | |
| travelDate | Departure date | date | yes | |
| problem | What went wrong? | textarea | yes | |
| detail | Extra detail (optional) | textarea | no | |

**Grounds (5)**

- `pre-change` — Significant change before departure (Reg 11) — refund/alternative
- `nonperformance` — Downgrade / missing facilities during the holiday (Reg 15)
- `illness` — Holiday illness / food poisoning (Reg 16)
- `insolvency` — Operator went bust — ATOL/ABTA protection claim
- `abta-escalation` — 28-day deadlock: escalate to ABTA/ATOL arbitration

---

## Delay tool — add EU261 ground (UK + Europe only)

Add a third ground to the existing `delay` tool. No new fields. Update the blurb to
mention EU. Keep `flight` (UK261), add `flight-eu` (EU261 €250/€400/€600), keep `train`.

- New ground id: `flight-eu`, label: `Flight delay / cancellation (EU261 — flight from the EU)`
- Update `delay.blurb` to: "Delayed train or flight? Generate a compensation claim
  under Delay Repay, UK261 or EU261."

---

## TOOL_ORDER

```
export const TOOL_ORDER = ['parking', 'deposit', 'delay', 'parcel', 'counciltax', 'energy', 'holiday', 'lba'];
```

Rationale: keep parking hero first; group the consumer/letter tools; keep `lba`
(the generic pre-court demand) last as the catch-all.

## Testing plan

| Layer | What | Count |
|-------|------|-------|
| Manual | Each new tool: home card → form → each ground → preview → TEST-MODE pay → PDF | 4 tools × grounds |
| Manual | `delay` tool: new EU261 ground renders, UK261 + train unchanged | 3 |
| Manual | No orphan `{{placeholder}}` in any rendered letter | all |
| Manual | Existing parking/deposit/lba flows unchanged | 3 |

Run locally: `cd public && python -m http.server 8099` → http://localhost:8099.

## Rollback

Pure addition. To revert: remove the 4 tool objects + the `flight-eu` ground and
restore `TOOL_ORDER`. No data migration, no shared-state change.

## Legal note

Parcel, council tax, energy/broadband, holiday letters are all self-help templates
the user completes and sends themselves — outside FCA claims-management regulation
(FCA confirms aviation and similar are not regulated). The Section 75 / card-claim
ground was deliberately dropped to keep the whole batch clear of any FCA-regulated
sector — no legal sign-off needed. Keep the existing site-wide "not a law firm /
no legal advice" disclaimer prominent. No new licence required to ship these.
