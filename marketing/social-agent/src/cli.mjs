import { SocialAgent } from "./agent.mjs";

const agent = new SocialAgent();
const [command = "status", ...args] = process.argv.slice(2);

function output(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function required(value, label) {
  if (!value) {
    throw new Error(`${label} is required`);
  }
  return value;
}

try {
  switch (command) {
    case "verify":
      output(agent.verify());
      break;
    case "cycle":
      output(agent.cycle());
      break;
    case "status":
      output(agent.status());
      break;
    case "approve":
      output({ ok: true, item: agent.approve(required(args[0], "item id"), { by: "cli" }) });
      break;
    case "reject":
      output({
        ok: true,
        item: agent.reject(required(args[0], "item id"), args.slice(1).join(" ") || "Needs revision", { by: "cli" }),
      });
      break;
    case "dispatch":
      output(await agent.dispatch({ force: args.includes("--force") }));
      break;
    case "metrics": {
      const [id, channel, impressions, clicks, toolStarts, purchases, spendGbp] = args;
      output({
        ok: true,
        metric: agent.recordMetrics({
          id: required(id, "item id"),
          channel: required(channel, "channel"),
          impressions,
          clicks,
          toolStarts,
          purchases,
          spendGbp,
        }),
      });
      break;
    }
    case "export":
      output(agent.exportReport());
      break;
    default:
      throw new Error(
        "Unknown command. Use verify, cycle, status, approve, reject, dispatch, metrics or export.",
      );
  }
} catch (error) {
  output({ ok: false, error: error.message });
  process.exitCode = 1;
}
