import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ROOT = path.resolve(MODULE_DIR, "..");
const VALID_STATUSES = new Set([
  "draft",
  "approved",
  "rejected",
  "ready",
  "posted",
  "failed",
]);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function ensureFiniteNonNegative(value, name) {
  const number = Number(value ?? 0);
  if (!Number.isFinite(number) || number < 0) {
    throw new Error(`${name} must be a non-negative number`);
  }
  return number;
}

function writeJsonAtomic(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const temporary = `${filePath}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  try {
    fs.renameSync(temporary, filePath);
  } catch (error) {
    if (!fs.existsSync(temporary)) {
      throw error;
    }
    fs.copyFileSync(temporary, filePath);
    fs.unlinkSync(temporary);
  }
}

function makeId(parts) {
  return crypto
    .createHash("sha256")
    .update(parts.join("|"))
    .digest("hex")
    .slice(0, 16);
}

function parseClock(clock) {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(clock);
  if (!match) {
    throw new Error(`Invalid time: ${clock}`);
  }
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

function firstOccurrence(now, dayOfWeek, clock) {
  const { hour, minute } = parseClock(clock);
  const result = new Date(now);
  result.setSeconds(0, 0);
  result.setHours(hour, minute, 0, 0);
  let daysAhead = (dayOfWeek - result.getDay() + 7) % 7;
  if (daysAhead === 0 && result <= now) {
    daysAhead = 7;
  }
  result.setDate(result.getDate() + daysAhead);
  return result;
}

function isWithin(childPath, parentPath) {
  const relative = path.relative(parentPath, childPath);
  return (
    relative === "" ||
    (!relative.startsWith(`..${path.sep}`) &&
      relative !== ".." &&
      !path.isAbsolute(relative))
  );
}

function appendHistory(item, action, at, details = {}) {
  item.history ??= [];
  item.history.push({ action, at, ...details });
  item.history = item.history.slice(-40);
}

export class SocialAgent {
  constructor(options = {}) {
    this.rootDir = path.resolve(options.rootDir ?? DEFAULT_ROOT);
    this.stateDir = path.resolve(
      options.stateDir ??
        process.env.APPEALMATE_SOCIAL_STATE_DIR ??
        path.join(this.rootDir, "state"),
    );
    this.outboxDir = path.resolve(
      options.outboxDir ?? path.join(this.rootDir, "outbox"),
    );
    this.reportsDir = path.resolve(
      options.reportsDir ?? path.join(this.rootDir, "reports"),
    );
    this.configPath = path.resolve(
      options.configPath ?? path.join(this.rootDir, "config", "agent.json"),
    );
    this.libraryPath = path.resolve(
      options.libraryPath ??
        path.join(this.rootDir, "config", "content-library.json"),
    );
    this.statePath = path.join(this.stateDir, "queue.json");
    this.now = options.now ?? (() => new Date());
    this.fetchImpl = options.fetchImpl ?? globalThis.fetch;
    this.config = readJson(this.configPath);
    this.library = readJson(this.libraryPath);
    this.campaignRoot = path.resolve(this.rootDir, "..", "campaign-2026-07");
    fs.mkdirSync(this.stateDir, { recursive: true });
    fs.mkdirSync(this.outboxDir, { recursive: true });
    fs.mkdirSync(this.reportsDir, { recursive: true });
  }

  createEmptyState(now = this.now()) {
    const timestamp = new Date(now).toISOString();
    return {
      version: 1,
      revision: 0,
      createdAt: timestamp,
      updatedAt: timestamp,
      queue: [],
      metrics: [],
      runs: [],
    };
  }

  loadState() {
    if (!fs.existsSync(this.statePath)) {
      return this.createEmptyState();
    }
    const state = readJson(this.statePath);
    if (
      state.version !== 1 ||
      !Array.isArray(state.queue) ||
      !Array.isArray(state.metrics)
    ) {
      throw new Error("Unsupported or corrupt social-agent state file");
    }
    for (const item of state.queue) {
      if (!VALID_STATUSES.has(item.status)) {
        throw new Error(`Queue item ${item.id} has invalid status ${item.status}`);
      }
    }
    state.runs ??= [];
    return state;
  }

  saveState(state, now = this.now()) {
    state.revision = Number(state.revision ?? 0) + 1;
    state.updatedAt = new Date(now).toISOString();
    state.runs = (state.runs ?? []).slice(-60);
    writeJsonAtomic(this.statePath, state);
    return state;
  }

  resolveAssets(content) {
    return content.assets.map((asset) => {
      const resolved = path.resolve(this.rootDir, asset);
      if (!isWithin(resolved, this.campaignRoot)) {
        throw new Error(
          `Content ${content.id} points outside the campaign directory`,
        );
      }
      return resolved;
    });
  }

  verify() {
    const errors = [];
    const warnings = [];
    if (this.config.approvalRequired !== true) {
      errors.push("approvalRequired must remain true");
    }
    if (this.config.paidAds?.autoSpend !== false) {
      errors.push("paidAds.autoSpend must remain false");
    }
    if (!["outbox", "webhook"].includes(this.config.publisher?.mode)) {
      errors.push("publisher.mode must be outbox or webhook");
    }
    if (!Array.isArray(this.config.cadence) || this.config.cadence.length === 0) {
      errors.push("At least one cadence slot is required");
    }
    if (!Array.isArray(this.library) || this.library.length === 0) {
      errors.push("The content library is empty");
    }

    const ids = new Set();
    for (const content of this.library) {
      if (ids.has(content.id)) {
        errors.push(`Duplicate content id: ${content.id}`);
      }
      ids.add(content.id);
      if (!content.caption?.includes("Outcomes are not guaranteed")) {
        errors.push(`Content ${content.id} is missing the outcome disclaimer`);
      }
      if (!content.destination?.startsWith("https://appealmate.uk/")) {
        errors.push(`Content ${content.id} uses a non-production destination`);
      }
      try {
        const assets = this.resolveAssets(content);
        for (const asset of assets) {
          if (!fs.existsSync(asset)) {
            errors.push(`Missing asset for ${content.id}: ${asset}`);
          }
        }
      } catch (error) {
        errors.push(error.message);
      }
    }

    if (
      this.config.publisher.mode === "webhook" &&
      !process.env.SOCIAL_PUBLISH_WEBHOOK_URL
    ) {
      warnings.push(
        "Webhook publishing is selected but SOCIAL_PUBLISH_WEBHOOK_URL is unset",
      );
    }

    return {
      ok: errors.length === 0,
      errors,
      warnings,
      contentItems: this.library.length,
      assetFiles: this.library.reduce(
        (total, content) => total + content.assets.length,
        0,
      ),
      safeguards: {
        approvalRequired: this.config.approvalRequired,
        autoSpend: this.config.paidAds.autoSpend,
        publisherMode: this.config.publisher.mode,
      },
    };
  }

  aggregateMetrics(state) {
    const result = new Map(
      this.library.map((content) => [
        content.id,
        {
          contentId: content.id,
          impressions: 0,
          clicks: 0,
          toolStarts: 0,
          purchases: 0,
          spendGbp: 0,
          observations: 0,
        },
      ]),
    );
    for (const metric of state.metrics) {
      const item = state.queue.find((candidate) => candidate.id === metric.itemId);
      if (!item || !result.has(item.contentId)) {
        continue;
      }
      const aggregate = result.get(item.contentId);
      aggregate.impressions += Number(metric.impressions ?? 0);
      aggregate.clicks += Number(metric.clicks ?? 0);
      aggregate.toolStarts += Number(metric.toolStarts ?? 0);
      aggregate.purchases += Number(metric.purchases ?? 0);
      aggregate.spendGbp += Number(metric.spendGbp ?? 0);
      aggregate.observations += 1;
    }
    const totalImpressions = [...result.values()].reduce(
      (sum, metric) => sum + metric.impressions,
      0,
    );
    for (const metric of result.values()) {
      const clickRate = (metric.clicks + 1) / (metric.impressions + 100);
      const purchaseRate = (metric.purchases + 0.2) / (metric.clicks + 10);
      const revenue =
        metric.purchases * Number(this.config.learning.letterRevenueGbp ?? 1.99);
      const exploration = Math.sqrt(
        Math.log(totalImpressions + 2) / (metric.impressions + 100),
      );
      metric.score =
        clickRate * 20 +
        purchaseRate * 80 +
        metric.toolStarts * 0.2 +
        revenue -
        metric.spendGbp +
        exploration;
    }
    return result;
  }

  chooseContent(state, slot, sequence) {
    const candidates = this.library.filter(
      (content) =>
        slot.formats.includes(content.format) &&
        slot.channels.some((channel) => content.channels.includes(channel)),
    );
    if (candidates.length === 0) {
      throw new Error(
        `No content matches ${slot.formats.join(", ")} for ${slot.channels.join(", ")}`,
      );
    }

    const metrics = this.aggregateMetrics(state);
    const hasObservations = [...metrics.values()].some(
      (metric) => metric.observations > 0,
    );
    if (!hasObservations) {
      return candidates[sequence % candidates.length];
    }

    const exploreEvery = Math.max(
      2,
      Number(this.config.learning.exploreEvery ?? 4),
    );
    if ((sequence + 1) % exploreEvery === 0) {
      return [...candidates].sort(
        (left, right) =>
          metrics.get(left.id).impressions - metrics.get(right.id).impressions,
      )[0];
    }
    return [...candidates].sort(
      (left, right) =>
        metrics.get(right.id).score - metrics.get(left.id).score,
    )[0];
  }

  buildSchedule(now) {
    const end = new Date(now);
    end.setDate(end.getDate() + Number(this.config.horizonDays ?? 28));
    const occurrences = [];
    for (const slot of this.config.cadence) {
      let scheduled = firstOccurrence(
        now,
        Number(slot.dayOfWeek),
        slot.time,
      );
      while (scheduled <= end) {
        occurrences.push({ slot, scheduled: new Date(scheduled) });
        scheduled = new Date(scheduled);
        scheduled.setDate(scheduled.getDate() + 7);
      }
    }
    return occurrences.sort(
      (left, right) => left.scheduled.getTime() - right.scheduled.getTime(),
    );
  }

  cycle(options = {}) {
    const verification = this.verify();
    if (!verification.ok) {
      throw new Error(
        `Verification failed: ${verification.errors.join("; ")}`,
      );
    }
    const now = new Date(options.now ?? this.now());
    const timestamp = now.toISOString();
    const state = this.loadState();
    const existing = new Set(state.queue.map((item) => item.id));
    const created = [];
    const schedule = this.buildSchedule(now);

    schedule.forEach((occurrence, sequence) => {
      const content = this.chooseContent(state, occurrence.slot, sequence);
      const scheduledAt = occurrence.scheduled.toISOString();
      const channels = occurrence.slot.channels.filter((channel) =>
        content.channels.includes(channel),
      );
      const id = makeId([content.id, scheduledAt, channels.join(",")]);
      if (existing.has(id)) {
        return;
      }
      const item = {
        id,
        contentId: content.id,
        status: "draft",
        scheduledAt,
        channels,
        format: content.format,
        assets: [...content.assets],
        caption: content.caption,
        headline: content.headline,
        destination: content.destination,
        createdAt: timestamp,
        updatedAt: timestamp,
        approval: null,
        publishResult: null,
        history: [{ action: "drafted", at: timestamp, source: "cycle" }],
      };
      state.queue.push(item);
      existing.add(id);
      created.push(item.id);
    });

    state.queue.sort(
      (left, right) =>
        new Date(left.scheduledAt).getTime() -
        new Date(right.scheduledAt).getTime(),
    );
    state.runs.push({
      type: "cycle",
      at: timestamp,
      created: created.length,
      queueSize: state.queue.length,
    });
    this.saveState(state, now);
    return {
      ok: true,
      created: created.length,
      createdIds: created,
      queueSize: state.queue.length,
      approvalRequired: true,
      publishingTriggered: false,
    };
  }

  findItem(state, id) {
    const item = state.queue.find((candidate) => candidate.id === id);
    if (!item) {
      throw new Error(`Unknown queue item: ${id}`);
    }
    return item;
  }

  approve(id, options = {}) {
    const now = new Date(options.now ?? this.now());
    const state = this.loadState();
    const item = this.findItem(state, id);
    if (item.status === "posted") {
      throw new Error("Posted items cannot be re-approved");
    }
    item.status = "approved";
    item.approval = {
      at: now.toISOString(),
      by: options.by ?? "local-dashboard",
    };
    item.updatedAt = now.toISOString();
    item.publishResult = null;
    appendHistory(item, "approved", now.toISOString(), {
      by: item.approval.by,
    });
    this.saveState(state, now);
    return clone(item);
  }

  reject(id, reason = "Needs revision", options = {}) {
    const now = new Date(options.now ?? this.now());
    const state = this.loadState();
    const item = this.findItem(state, id);
    if (item.status === "posted") {
      throw new Error("Posted items cannot be rejected");
    }
    item.status = "rejected";
    item.approval = null;
    item.updatedAt = now.toISOString();
    appendHistory(item, "rejected", now.toISOString(), {
      reason: String(reason).slice(0, 500),
    });
    this.saveState(state, now);
    return clone(item);
  }

  edit(id, patch, options = {}) {
    const now = new Date(options.now ?? this.now());
    const state = this.loadState();
    const item = this.findItem(state, id);
    if (item.status === "posted") {
      throw new Error("Posted items cannot be edited");
    }
    const changed = [];
    if (patch.caption !== undefined) {
      const caption = String(patch.caption).trim();
      if (caption.length < 20 || caption.length > 2200) {
        throw new Error("Caption must be between 20 and 2200 characters");
      }
      if (!caption.includes("Outcomes are not guaranteed")) {
        throw new Error("Caption must retain the outcome disclaimer");
      }
      item.caption = caption;
      changed.push("caption");
    }
    if (patch.scheduledAt !== undefined) {
      const scheduled = new Date(patch.scheduledAt);
      if (Number.isNaN(scheduled.getTime())) {
        throw new Error("scheduledAt must be a valid date");
      }
      item.scheduledAt = scheduled.toISOString();
      changed.push("scheduledAt");
    }
    if (patch.channels !== undefined) {
      const channels = [...new Set(patch.channels.map(String))];
      if (
        channels.length === 0 ||
        channels.some(
          (channel) => !this.config.supportedChannels.includes(channel),
        )
      ) {
        throw new Error("channels contains an unsupported value");
      }
      item.channels = channels;
      changed.push("channels");
    }
    if (changed.length === 0) {
      throw new Error("No editable fields supplied");
    }
    item.status = "draft";
    item.approval = null;
    item.publishResult = null;
    item.updatedAt = now.toISOString();
    appendHistory(item, "edited", now.toISOString(), {
      fields: changed,
      by: options.by ?? "local-dashboard",
    });
    state.queue.sort(
      (left, right) =>
        new Date(left.scheduledAt).getTime() -
        new Date(right.scheduledAt).getTime(),
    );
    this.saveState(state, now);
    return clone(item);
  }

  recordMetrics(input, options = {}) {
    const now = new Date(options.now ?? this.now());
    const state = this.loadState();
    const item = this.findItem(state, input.id);
    const channel = String(input.channel);
    if (!this.config.supportedChannels.includes(channel)) {
      throw new Error(`Unsupported channel: ${channel}`);
    }
    const metric = {
      id: makeId([item.id, channel, now.toISOString(), String(state.revision)]),
      itemId: item.id,
      channel,
      impressions: ensureFiniteNonNegative(
        input.impressions,
        "impressions",
      ),
      clicks: ensureFiniteNonNegative(input.clicks, "clicks"),
      toolStarts: ensureFiniteNonNegative(input.toolStarts, "toolStarts"),
      purchases: ensureFiniteNonNegative(input.purchases, "purchases"),
      spendGbp: ensureFiniteNonNegative(input.spendGbp, "spendGbp"),
      recordedAt: now.toISOString(),
    };
    state.metrics.push(metric);
    state.metrics = state.metrics.slice(-2000);
    appendHistory(item, "metrics-recorded", now.toISOString(), {
      metricId: metric.id,
      channel,
    });
    this.saveState(state, now);
    return clone(metric);
  }

  outboxManifest(item, now = this.now()) {
    return {
      schemaVersion: 1,
      idempotencyKey: item.id,
      brand: this.config.brand,
      status: "ready-for-publisher",
      scheduledAt: item.scheduledAt,
      channels: item.channels,
      format: item.format,
      assets: item.assets.map((asset) => path.resolve(this.rootDir, asset)),
      caption: item.caption,
      headline: item.headline,
      destination: item.destination,
      approvedAt: item.approval?.at ?? null,
      generatedAt: new Date(now).toISOString(),
    };
  }

  async dispatch(options = {}) {
    const now = new Date(options.now ?? this.now());
    const state = this.loadState();
    const mode = options.mode ?? this.config.publisher.mode;
    const eligible = state.queue.filter(
      (item) =>
        item.status === "approved" &&
        (options.force === true || new Date(item.scheduledAt) <= now),
    );
    const results = [];

    for (const item of eligible) {
      const manifest = this.outboxManifest(item, now);
      if (mode === "outbox") {
        const manifestPath = path.join(this.outboxDir, `${item.id}.json`);
        writeJsonAtomic(manifestPath, manifest);
        item.status = "ready";
        item.publishResult = {
          mode,
          at: now.toISOString(),
          manifestPath,
          note: "Prepared locally; no public post was made",
        };
        item.updatedAt = now.toISOString();
        appendHistory(item, "prepared-in-outbox", now.toISOString(), {
          manifestPath,
        });
        results.push({ id: item.id, status: "ready", manifestPath });
        continue;
      }

      if (mode !== "webhook") {
        throw new Error(`Unsupported publisher mode: ${mode}`);
      }
      const url = process.env.SOCIAL_PUBLISH_WEBHOOK_URL;
      if (!url) {
        throw new Error("SOCIAL_PUBLISH_WEBHOOK_URL is required");
      }
      const headers = {
        "content-type": "application/json",
        "idempotency-key": item.id,
      };
      if (process.env.SOCIAL_PUBLISH_WEBHOOK_TOKEN) {
        headers.authorization = `Bearer ${process.env.SOCIAL_PUBLISH_WEBHOOK_TOKEN}`;
      }
      try {
        const response = await this.fetchImpl(url, {
          method: "POST",
          headers,
          body: JSON.stringify(manifest),
        });
        const responseText = await response.text();
        let responseBody = null;
        try {
          responseBody = responseText ? JSON.parse(responseText) : null;
        } catch {
          responseBody = { raw: responseText.slice(0, 1000) };
        }
        if (!response.ok || responseBody?.ok === false) {
          throw new Error(
            `Publisher returned ${response.status}: ${responseText.slice(0, 500)}`,
          );
        }
        item.status = "posted";
        item.publishResult = {
          mode,
          at: now.toISOString(),
          response: responseBody,
        };
        item.updatedAt = now.toISOString();
        appendHistory(item, "published", now.toISOString(), { mode });
        results.push({ id: item.id, status: "posted" });
      } catch (error) {
        item.status = "failed";
        item.publishResult = {
          mode,
          at: now.toISOString(),
          error: error.message,
        };
        item.updatedAt = now.toISOString();
        appendHistory(item, "publish-failed", now.toISOString(), {
          error: error.message,
        });
        results.push({ id: item.id, status: "failed", error: error.message });
      }
    }

    state.runs.push({
      type: "dispatch",
      at: now.toISOString(),
      mode,
      eligible: eligible.length,
      results,
    });
    this.saveState(state, now);
    return {
      ok: results.every((result) => result.status !== "failed"),
      mode,
      considered: eligible.length,
      results,
      publicPostsMade: results.filter((result) => result.status === "posted")
        .length,
    };
  }

  status() {
    const state = this.loadState();
    const metrics = this.aggregateMetrics(state);
    const counts = {};
    for (const status of VALID_STATUSES) {
      counts[status] = state.queue.filter(
        (item) => item.status === status,
      ).length;
    }
    const rankedContent = [...metrics.values()]
      .sort((left, right) => right.score - left.score)
      .map((metric) => ({
        ...metric,
        score: Number(metric.score.toFixed(4)),
      }));
    return {
      ok: true,
      revision: state.revision,
      updatedAt: state.updatedAt,
      safeguards: {
        approvalRequired: this.config.approvalRequired,
        publisherMode: this.config.publisher.mode,
        autoSpend: this.config.paidAds.autoSpend,
        weeklyAdsBudgetGbp: this.config.paidAds.weeklyBudgetGbp,
      },
      counts,
      queue: clone(state.queue),
      rankedContent,
      recentRuns: clone((state.runs ?? []).slice(-10)),
    };
  }

  exportReport(options = {}) {
    const now = new Date(options.now ?? this.now());
    const status = this.status();
    const day = now.toISOString().slice(0, 10);
    const reportPath = path.join(this.reportsDir, `queue-${day}.md`);
    const lines = [
      `# AppealMate social queue - ${day}`,
      "",
      `Approval required: ${status.safeguards.approvalRequired}`,
      `Publisher mode: ${status.safeguards.publisherMode}`,
      `Automatic ad spend: ${status.safeguards.autoSpend}`,
      "",
      "## Queue",
      "",
    ];
    for (const item of status.queue) {
      lines.push(
        `### ${item.scheduledAt} - ${item.contentId}`,
        "",
        `- Status: ${item.status}`,
        `- Channels: ${item.channels.join(", ")}`,
        `- Format: ${item.format}`,
        `- ID: ${item.id}`,
        "",
        item.caption,
        "",
      );
    }
    fs.writeFileSync(reportPath, `${lines.join("\n")}\n`, "utf8");
    return { ok: true, reportPath, items: status.queue.length };
  }
}

export function defaultRoot() {
  return DEFAULT_ROOT;
}
