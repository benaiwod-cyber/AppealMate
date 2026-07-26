# AppealMate Meta campaign pack - July 2026

## Objective and constraints

- Objective: turn high-intent UK visitors into starts on `https://appealmate.uk/`.
- Primary product proof: a formal self-help letter in around two minutes; every live tool is currently £1.99 per letter.
- Hard constraints: do not imply that AppealMate is a law firm, provides legal advice, or guarantees an appeal or claim outcome.
- Creative system: 1:1 and 4:5 feed assets plus 9:16 Stories/Reels assets, with important text kept away from the top and bottom interface areas.
- The social profiles could not be inspected without a logged-in Meta session. Their supplied URLs were checked, but Meta returned a login/access wall.

## Ranked campaign approaches

| Rank | Approach | Intent | Clarity | Evidence risk | Recommended use |
|---:|---|---:|---:|---:|---|
| 1 | Parking direct-response | High | High | Low | First paid test; one clear use case and CTA |
| 2 | Three-step product demo | High | High | Low | Feed, Stories and retargeting |
| 3 | Nine-tool discovery | Medium | Medium | Low | Broad awareness and warm audiences |
| 4 | Helpful educational carousel | Medium | High | Medium | Organic first; fact-check each legal point before boosting |
| 5 | Outcome/testimonial creative | High | High | High | Hold until there are verified, permissioned customer outcomes |

## Delivered creatives

| File | Format | Angle | Best placement |
|---|---|---|---|
| `exports/appealmate-parking-square-1080.png` | 1080x1080 | Parking direct response | Facebook/Instagram feed |
| `exports/appealmate-steps-portrait-1080x1350.png` | 1080x1350 | Three-step explanation | Instagram/Facebook feed |
| `exports/appealmate-nine-tools-square-1080.png` | 1080x1080 | Full product range | Feed/retargeting |
| `exports/appealmate-parking-story-1080x1920.png` | 1080x1920 | Parking Stories card | Stories |
| `exports/appealmate-parking-reel-12s.mp4` | 1080x1920, 12s | Parking product demo | Reels/Stories |
| `exports/appealmate-nine-tools-reel-12s.mp4` | 1080x1920, 12s | Product-range demo | Reels/Stories |

## Copy variants

### A - Parking direct response

Primary text:

> Appealing a council PCN or private parking charge? Answer a few questions, choose the reason that fits, and create a formal letter ready to review and send. £1.99 per letter.

Headline: `Create your parking appeal letter`

Description: `Around 2 minutes. Formal PDF. £1.99.`

CTA: `Learn More`

Destination:

`https://appealmate.uk/?utm_source=meta&utm_medium=paid-social&utm_campaign=launch_2026_07&utm_content=parking_a#/tool/parking`

### B - Three-step product demo

Primary text:

> Skip the blank page. Add the details, choose the reason that fits, then download a formal PDF to review and send. Every live AppealMate tool is currently £1.99 per letter.

Headline: `Your letter in three clear steps`

Description: `UK self-help document service.`

CTA: `Learn More`

Destination:

`https://appealmate.uk/?utm_source=meta&utm_medium=paid-social&utm_campaign=launch_2026_07&utm_content=steps_b`

### C - Nine-tool discovery

Primary text:

> Parking tickets, rejected appeals, deposit disputes, travel delays, parcels, council tax, energy bills, holiday complaints and money claims. Start a formal UK self-help letter from £1.99.

Headline: `Nine everyday problems. One clear place to start.`

Description: `Explore AppealMate's live letter tools.`

CTA: `Learn More`

Destination:

`https://appealmate.uk/?utm_source=meta&utm_medium=paid-social&utm_campaign=launch_2026_07&utm_content=nine_tools_c`

Add this final line to each primary text where space permits:

`Self-help document service. Not legal advice. Outcomes are not guaranteed.`

## Small-budget test

1. Install and verify a Meta Pixel event for landing-page view, tool start and successful payment before spending beyond a small test.
2. Run one campaign with a website-sales objective and separate parking and broad-problem ad sets.
3. Give each ad set the parking static, steps portrait and matching Reel; do not split the budget across all six creatives at once.
4. Start with a controlled test budget you can afford to lose, collect at least several days of delivery, then cut ads with weak click-through or no tool starts.
5. Judge the funnel in order: outbound click-through rate, landing-page views, tool starts, checkout starts, paid letters and cost per paid letter.
6. Do not scale from clicks alone. Scale only when paid-letter revenue and cost-per-purchase are measured reliably.

## Publishing notes

- Upload through Meta Ads Manager rather than boosting from an iPhone, to avoid the possible Apple service fee and to retain placement controls.
- Use 9:16 assets for Reels/Stories. Keep key text inside the safe zone; this pack leaves the approximate top 14% and bottom 20% free on 9:16 creatives.
- The videos include a quiet original audio bed and burned-in copy, so the message works with sound on or off.
- Do not use the old promotion hooks claiming a fine was cancelled unless there is a real, documented customer result and permission to use it.
- Do not use “most tickets are appealable”, “probably invalid”, “appeals win”, or similar objective outcome claims without robust evidence.

## Source audit notes

- Active source currently exposes nine tools, not the four listed in the older README.
- Active launch pricing is flat £1.99 per letter. The three-letter bundle exists in code but is not presented in the campaign.
- Parking ticket photo scanning exists as a beta feature, but it is intentionally not advertised in this pack because beta OCR performance has not been independently verified.
- `promote.py` still points to the old Netlify URL and uses unsubstantiated outcome-oriented hooks. It was read but not edited or run.
- No source, payment, deployment, social-account or existing promotion files were changed by this campaign build.

