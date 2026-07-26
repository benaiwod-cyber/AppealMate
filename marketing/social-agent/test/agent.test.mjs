import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { SocialAgent } from "../src/agent.mjs";

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(TEST_DIR, "..");
const FIXED_NOW = new Date("2026-07-23T09:00:00+01:00");

function fixture(fetchImpl) {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), "appealmate-social-"));
  const agent = new SocialAgent({
    rootDir: ROOT,
    stateDir: path.join(temporary, "state"),
    outboxDir: path.join(temporary, "outbox"),
    reportsDir: path.join(temporary, "reports"),
    now: () => new Date(FIXED_NOW),
    fetchImpl,
  });
  return {
    agent,
    temporary,
    cleanup: () => fs.rmSync(temporary, { recursive: true, force: true }),
  };
}

test("configuration verifies every finished campaign asset and safeguard", (t) => {
  const { agent, cleanup } = fixture();
  t.after(cleanup);
  const result = agent.verify();
  assert.equal(result.ok, true);
  assert.equal(result.contentItems, 12);
  assert.equal(result.assetFiles, 14);
  assert.deepEqual(result.safeguards, {
    approvalRequired: true,
    autoSpend: false,
    publisherMode: "outbox",
  });
});

test("cycle creates an idempotent four-week draft queue without publishing", (t) => {
  const { agent, cleanup } = fixture();
  t.after(cleanup);
  const first = agent.cycle();
  const second = agent.cycle();
  const status = agent.status();
  assert.equal(first.created, 12);
  assert.equal(first.publishingTriggered, false);
  assert.equal(second.created, 0);
  assert.equal(status.queue.length, 12);
  assert.ok(status.queue.every((item) => item.status === "draft"));
  assert.ok(
    status.queue.every((item) =>
      item.caption.includes("Outcomes are not guaranteed"),
    ),
  );
});

test("approval plus outbox dispatch prepares a manifest but makes no public post", async (t) => {
  const { agent, temporary, cleanup } = fixture();
  t.after(cleanup);
  agent.cycle();
  const item = agent.status().queue[0];
  agent.approve(item.id, { by: "test" });
  const result = await agent.dispatch({ force: true });
  const updated = agent.status().queue.find((candidate) => candidate.id === item.id);
  assert.equal(result.publicPostsMade, 0);
  assert.equal(result.considered, 1);
  assert.equal(updated.status, "ready");
  assert.ok(fs.existsSync(path.join(temporary, "outbox", `${item.id}.json`)));
});

test("editing an approved item returns it to draft for re-approval", (t) => {
  const { agent, cleanup } = fixture();
  t.after(cleanup);
  agent.cycle();
  const item = agent.status().queue[0];
  agent.approve(item.id, { by: "test" });
  const edited = agent.edit(item.id, {
    caption: `${item.caption}\n\nUpdated after review.`,
  });
  assert.equal(edited.status, "draft");
  assert.equal(edited.approval, null);
});

test("recorded performance metrics feed the ranked learning view", (t) => {
  const { agent, cleanup } = fixture();
  t.after(cleanup);
  agent.cycle();
  const item = agent.status().queue[0];
  agent.recordMetrics({
    id: item.id,
    channel: item.channels[0],
    impressions: 1000,
    clicks: 80,
    toolStarts: 20,
    purchases: 4,
    spendGbp: 0,
  });
  const ranking = agent.status().rankedContent;
  const measured = ranking.find(
    (candidate) => candidate.contentId === item.contentId,
  );
  assert.equal(measured.observations, 1);
  assert.equal(measured.purchases, 4);
  assert.ok(Number.isFinite(measured.score));
});

test("webhook publisher sends an idempotency key only after approval", async (t) => {
  const calls = [];
  const fetchImpl = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ ok: true, externalId: "post-1" }),
    };
  };
  const { agent, cleanup } = fixture(fetchImpl);
  t.after(() => {
    delete process.env.SOCIAL_PUBLISH_WEBHOOK_URL;
    cleanup();
  });
  process.env.SOCIAL_PUBLISH_WEBHOOK_URL = "https://publisher.invalid/queue";
  agent.cycle();
  const item = agent.status().queue[0];
  const beforeApproval = await agent.dispatch({ mode: "webhook", force: true });
  assert.equal(beforeApproval.considered, 0);
  agent.approve(item.id, { by: "test" });
  const result = await agent.dispatch({ mode: "webhook", force: true });
  assert.equal(result.publicPostsMade, 1);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].options.headers["idempotency-key"], item.id);
  assert.equal(
    agent.status().queue.find((candidate) => candidate.id === item.id).status,
    "posted",
  );
});
