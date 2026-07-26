# AppealMate Social Agent

Approval-first social scheduling for AppealMate. It turns the finished July 2026 campaign pack into a rolling four-week queue, gives the owner a local review dashboard, records performance, and changes future content selection using measured results.

## What works now

- Maintains three proposed posts per week for Instagram, Facebook and video-compatible TikTok slots.
- Uses 12 compliant content variants backed by 14 finished PNG/MP4 assets.
- Lets the owner preview, edit, approve, reject and reschedule each post at `http://127.0.0.1:3210`.
- Records impressions, clicks, tool starts, purchases and spend by post.
- Ranks future content using smoothed click/purchase performance with a fixed exploration slot.
- Generates idempotent outbox manifests for approved, due posts.
- Includes an n8n daily-draft workflow and a separately locked dispatch workflow.

## Hard safety gates

- Every new item starts as `draft`.
- Editing an approved item returns it to `draft`.
- The default publisher is `outbox`; it cannot make a public post.
- Automatic ad spend is hard-disabled. The £5 weekly figure is stored only as a planning limit.
- Community/group replies are not automated. They must remain permission-aware and help-first.
- Captions must retain the legal/outcome disclaimer and production domain.
- The server binds to localhost only.

## Commands

```powershell
cd C:\Users\benja\appealmate\marketing\social-agent
npm run check
npm run verify
npm run seed
npm start
```

Useful queue commands:

```powershell
node src/cli.mjs status
node src/cli.mjs approve ITEM_ID
node src/cli.mjs reject ITEM_ID "Reason to revise"
node src/cli.mjs dispatch --force
node src/cli.mjs metrics ITEM_ID instagram 1000 50 12 2 0
node src/cli.mjs export
```

`dispatch --force` in the default `outbox` mode writes a JSON manifest under `outbox/`; it does not publish.

## n8n workflows

- `workflows/daily-drafts.json`: safe to activate. At 06:30 Europe/London it calls `/api/cycle`, which only maintains drafts.
- `workflows/dispatch-approved.json`: intentionally inactive and its dispatch node is disabled. Enable it only after a publisher and a shared internal key are configured.

The local n8n user folder is `C:\Users\benja\.n8n-local`. Import with:

```powershell
$env:N8N_USER_FOLDER = 'C:\Users\benja\.n8n-local'
n8n import:workflow --input=workflows\daily-drafts.json
n8n import:workflow --input=workflows\dispatch-approved.json
```

## n8n-only direct publishing

The publishing control plane is local n8n at `http://127.0.0.1:5678`. Postiz is not part of the design.

- `workflows/daily-drafts.json` is active and only maintains the draft queue.
- `workflows/n8n-only-direct.json` previews due approved posts and routes them to Facebook, Instagram, and TikTok sections.
- The direct publishing workflow and all five external publishing nodes remain disabled until credentials and media hosting are verified.

Required one-time setup:

1. Create an n8n Facebook Graph API credential using Meta OAuth or a suitable Page access token.
2. Enter the Facebook Page ID and Instagram Professional Account ID in the labelled nodes.
3. Grant the required Meta permissions, including `pages_manage_posts`, `pages_read_engagement`, `instagram_basic`, and `instagram_content_publish`.
4. Register and approve a TikTok developer app with `video.publish`, then connect the authorized account token/open ID through an n8n OAuth credential.
5. Provide public media URLs for Instagram images and TikTok photos. Videos may use each platform's resumable/file-upload flow.
6. Run private/non-public tests first. Activate the schedule only after all platform results are verified.

The owner process stays simple: approve in the AppealMate dashboard, inspect the n8n preview, then review executions in n8n. Automatic ad spend remains disabled.

## Recovery

Runtime state is under `state/queue.json`. PM2 should run `src/server.mjs` as `appealmate-social-agent` and save the process list. n8n recreates missing future drafts daily; IDs are deterministic, so repeated cycles do not duplicate the same slot.

See `DESIGN.md` for the approach ranking, growth loop and 1M-user reality check.
