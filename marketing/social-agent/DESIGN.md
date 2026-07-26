# AppealMate promotion agent design

## Objective, variables and hard constraints

Objective: build a promotion system that can prepare and eventually publish AppealMate content with minimal owner effort, while the owner monitors, corrects and approves. The commercial ambition is 1M users by the end of 2026, but the system must optimize measurable leading indicators rather than pretend a £5 weekly ad budget can buy that reach.

Key variables:

- Distribution: Instagram, Facebook, TikTok, SEO, referrals and permission-aware communities.
- Inputs: 14 finished campaign assets, compliant copy, `appealmate.uk` landing routes and UTM tags.
- Funnel: impressions -> clicks -> tool starts -> checkout starts -> paid letters.
- Resources: always-on Windows PC, local n8n, PM2, no working Postiz install, and £5/week maximum experimental ad spend.
- Control: the owner wants low-touch monitoring but must retain approval while accounts and claims are being proven.

Hard constraints:

- No public post, paid spend, account change or group spam without explicit authorization.
- No claim that AppealMate is a law firm, gives legal advice or guarantees an outcome.
- Platform APIs and account permissions are real limits. They cannot be bypassed by browser automation.
- A failed publisher request must be retryable and idempotent.
- Existing AppealMate application, payment and deployment files remain untouched.

## Ranked approaches

| Rank | Approach | Automation | Setup cost | Safety | Learning | Decision |
|---:|---|---:|---:|---:|---:|---|
| 1 | n8n scheduler + local approval dashboard + publisher adapter | High | Low | High | High | Selected |
| 2 | n8n directly to Meta and TikTok APIs | High | Medium/high | Medium | High | Add after app/account approvals |
| 3 | Rebuild the full Postiz/Postgres/Redis/Temporal stack locally | High | High | Medium | Medium | Defer; too heavy for the current PC and absent install |
| 4 | Local generator with manual uploads | Medium | Low | High | Medium | Current fallback via outbox |
| 5 | Fully autonomous browser/group posting agent | Superficially high | High | Very low | Low | Rejected: spam/account-ban and reliability risk |

The selected design can start immediately, preserves the finished creatives, and does not depend on a publisher that is currently offline. Its adapter boundary allows Postiz or direct platform APIs to be added later without rewriting the queue or learning loop.

## Architecture

```text
06:30 n8n schedule
        |
        v
local /api/cycle ----> deterministic four-week draft queue
                              |
                              v
                  localhost review dashboard
                   edit / reject / approve
                              |
                              v
                  due + approved eligibility gate
                              |
                 +------------+-------------+
                 |                          |
          outbox manifest              webhook adapter
          (current, no post)       (future Postiz/Meta bridge)
                 |                          |
                 +------------+-------------+
                              v
                   metrics + ranked learning
                              |
                              +----> next content cycle
```

State changes are persisted to `state/queue.json` using a temporary file and replace operation. Queue IDs are hashes of content, scheduled time and channels, providing deterministic de-duplication. Publisher calls carry the same ID as an idempotency key.

## Approval and failure model

1. `draft`: generated, editable, never publishable.
2. `approved`: owner accepted this exact caption, schedule and channel set.
3. `ready`: default outbox manifest prepared; nothing public happened.
4. `posted`: a configured publisher acknowledged the idempotent request.
5. `rejected`: owner supplied revision feedback.
6. `failed`: publisher failed; the item must be reviewed/re-approved before retry.

Any edit clears approval. Posted items are immutable. No state path automatically changes ad-spend settings.

## Learning loop

The agent records impressions, link clicks, tool starts, purchases and spend by post/channel. It calculates smoothed click and purchase rates so tiny samples cannot dominate. Most future slots exploit the top score; every fourth selection explores the least-exposed compatible creative. This is deliberately simple, explainable and reversible.

Optimization order:

1. Correct tracking and destination URL.
2. Tool starts per 100 link clicks.
3. Paid letters and cost per paid letter.
4. Repeat/referral signals.
5. Reach only when it improves the above.

## Growth strategy toward 1M users

The agent is the execution loop, not the entire acquisition strategy. At £5/week, paid social is an experiment and winner amplifier, not the volume engine.

| Priority | Engine | Agent role | Owner gate |
|---:|---|---|---|
| 1 | Programmatic SEO and useful free tools | Repurpose new pages/tools into social posts; monitor indexed-page and tool-start data | Legal/factual review before publishing pages |
| 2 | Organic short video and carousel education | Maintain cadence, test hooks/formats, reuse winners | Approve exact post during initial phase |
| 3 | Referral/win loop | Draft requests for permissioned stories and referral prompts | Customer permission required |
| 4 | Help-first communities | Surface opportunities and draft useful replies | Manual posting only; obey each community's rules |
| 5 | Paid Meta tests | Recommend the best measured organic creative | Pixel/events verified and spend explicitly authorized |

Near-term milestones should be evidence based:

- Week 1: tracking verified, queue running, three organic posts shipped, first baseline metrics.
- Weeks 2-4: at least 12 posts, two creative controls identified, tool-start conversion measured.
- Quarter: SEO/content engine and referral loop produce compounding acquisition; paid spend only amplifies proven content.
- 1M users: requires viral distribution, high-ranking search inventory or partnerships at a scale far beyond £5/week. The agent should report the gap honestly rather than optimize vanity reach.

## Policy evidence used by the recovered design

- Postiz public API: https://docs.postiz.com/public-api/introduction
- Instagram content publishing: https://developers.facebook.com/docs/instagram-platform/content-publishing
- TikTok Content Posting API: https://developers.tiktok.com/doc/content-posting-api-get-started
- Reddit community conduct: https://support.reddithelp.com/hc/en-us/articles/205926439-Reddiquette
- ASA misleading advertising rules: https://www.asa.org.uk/type/non_broadcast/code_section/03.html
- n8n Facebook Graph API node: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.facebookgraphapi/
- Google scaled-content spam policy: https://developers.google.com/search/docs/essentials/spam-policies#scaled-content
