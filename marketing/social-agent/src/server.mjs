import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { SocialAgent } from "./agent.mjs";

const host = process.env.SOCIAL_AGENT_HOST ?? "127.0.0.1";
const port = Number(process.env.SOCIAL_AGENT_PORT ?? 3210);
const agent = new SocialAgent();

function json(response, status, body) {
  const payload = Buffer.from(`${JSON.stringify(body, null, 2)}\n`);
  response.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": payload.length,
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
  });
  response.end(payload);
}

function text(response, status, body, type = "text/plain; charset=utf-8") {
  const payload = Buffer.from(body);
  response.writeHead(status, {
    "content-type": type,
    "content-length": payload.length,
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "content-security-policy":
      "default-src 'self'; img-src 'self' data:; media-src 'self'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'",
  });
  response.end(payload);
}

function isLoopback(address = "") {
  return ["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(address);
}

function requestOriginAllowed(request) {
  const origin = request.headers.origin;
  if (origin) {
    return new Set([
      `http://127.0.0.1:${port}`,
      `http://localhost:${port}`,
    ]).has(origin);
  }
  const expectedKey = process.env.SOCIAL_AGENT_INTERNAL_KEY;
  const suppliedKey = request.headers["x-social-agent-key"];
  return Boolean(expectedKey && suppliedKey && expectedKey === suppliedKey);
}

async function bodyJson(request) {
  const chunks = [];
  let total = 0;
  for await (const chunk of request) {
    total += chunk.length;
    if (total > 1024 * 1024) {
      throw new Error("Request body is too large");
    }
    chunks.push(chunk);
  }
  if (chunks.length === 0) {
    return {};
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function publicStatus() {
  const status = agent.status();
  status.queue = status.queue.map((item) => ({
    ...item,
    mediaUrls: item.assets.map(
      (_asset, index) => `/media/${encodeURIComponent(item.id)}/${index}`,
    ),
  }));
  return status;
}

function contentType(filePath) {
  switch (path.extname(filePath).toLowerCase()) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".mp4":
      return "video/mp4";
    default:
      return "application/octet-stream";
  }
}

function serveMedia(request, response, pathname) {
  const match = /^\/media\/([^/]+)\/(\d+)$/.exec(pathname);
  if (!match) {
    return false;
  }
  const state = agent.loadState();
  const item = state.queue.find(
    (candidate) => candidate.id === decodeURIComponent(match[1]),
  );
  const index = Number(match[2]);
  if (!item || !item.assets[index]) {
    json(response, 404, { ok: false, error: "Media not found" });
    return true;
  }
  const filePath = path.resolve(agent.rootDir, item.assets[index]);
  const content = agent.library.find(
    (candidate) => candidate.id === item.contentId,
  );
  if (!content || !agent.resolveAssets(content).includes(filePath)) {
    json(response, 403, { ok: false, error: "Media path rejected" });
    return true;
  }
  if (!fs.existsSync(filePath)) {
    json(response, 404, { ok: false, error: "Media file is missing" });
    return true;
  }
  const stat = fs.statSync(filePath);
  response.writeHead(200, {
    "content-type": contentType(filePath),
    "content-length": stat.size,
    "cache-control": "private, max-age=60",
    "accept-ranges": "bytes",
    "x-content-type-options": "nosniff",
  });
  fs.createReadStream(filePath).pipe(response);
  return true;
}

const dashboard = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>AppealMate Social Agent</title>
  <style>
    :root{color-scheme:light;--ink:#14213d;--muted:#64748b;--line:#dbe4ef;--card:#fff;--bg:#f4f7fb;--blue:#2563eb;--green:#12805c;--red:#b42318;--amber:#9a6700}
    *{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}
    header{background:linear-gradient(135deg,#102a56,#2458a8);color:#fff;padding:26px 5vw 30px}header h1{margin:0 0 6px;font-size:clamp(25px,4vw,40px)}header p{margin:0;opacity:.86}
    main{max-width:1280px;margin:-15px auto 60px;padding:0 22px}.bar,.card{background:var(--card);border:1px solid var(--line);box-shadow:0 12px 35px rgba(22,43,77,.07);border-radius:16px}
    .bar{display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:15px;margin-bottom:18px}.bar .spacer{flex:1}.guard{font-size:13px;color:var(--green);font-weight:700}.warning{color:var(--amber)}
    button{border:0;border-radius:10px;padding:10px 14px;font-weight:750;cursor:pointer;background:var(--blue);color:#fff}button.secondary{background:#e8eef7;color:var(--ink)}button.danger{background:#fee4e2;color:var(--red)}button:disabled{opacity:.45;cursor:not-allowed}
    .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px;margin:18px 0}.stat{background:#fff;border:1px solid var(--line);border-radius:13px;padding:14px}.stat b{display:block;font-size:25px}.stat span{font-size:12px;color:var(--muted);text-transform:uppercase;letter-spacing:.06em}
    .queue{display:grid;grid-template-columns:repeat(auto-fit,minmax(310px,1fr));gap:16px}.card{overflow:hidden}.media{background:#e9eef5;aspect-ratio:4/3;display:flex;gap:3px;overflow:auto}.media img,.media video{width:100%;height:100%;object-fit:contain;background:#eef2f7;min-width:100%}
    .body{padding:17px}.topline{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.topline h2{font-size:18px;margin:0}.badge{border-radius:99px;padding:5px 9px;font-size:11px;font-weight:850;text-transform:uppercase}.draft{background:#e8eef7}.approved{background:#dcfce7;color:#166534}.rejected,.failed{background:#fee2e2;color:#991b1b}.ready{background:#fef3c7;color:#854d0e}.posted{background:#dbeafe;color:#1d4ed8}
    .meta{font-size:12px;color:var(--muted);margin:10px 0}.caption{white-space:pre-wrap;font-size:14px;line-height:1.48;max-height:180px;overflow:auto;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:12px 0}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:13px}.empty{text-align:center;padding:50px;color:var(--muted)}
    #toast{position:fixed;right:18px;bottom:18px;background:#102a56;color:#fff;padding:12px 16px;border-radius:10px;opacity:0;transform:translateY(8px);transition:.2s;pointer-events:none}#toast.show{opacity:1;transform:none}
    @media(max-width:600px){header{padding-left:22px;padding-right:22px}main{padding:0 12px}.queue{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <header><h1>AppealMate Social Agent</h1><p>Review, correct and approve the always-on content queue.</p></header>
  <main>
    <section class="bar">
      <span id="guard" class="guard">Loading safeguards...</span><span class="spacer"></span>
      <button class="secondary" onclick="cycle()">Generate drafts</button>
      <button class="secondary" onclick="dispatchNow()">Prepare due approved posts</button>
      <button onclick="load()">Refresh</button>
    </section>
    <section id="stats" class="stats"></section>
    <section id="queue" class="queue"><div class="empty">Loading queue...</div></section>
  </main>
  <div id="toast"></div>
  <script>
    var current = null;
    function esc(value){return String(value == null ? '' : value).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
    function toast(message){var node=document.getElementById('toast');node.textContent=message;node.classList.add('show');setTimeout(function(){node.classList.remove('show')},2600)}
    async function api(url,options){var response=await fetch(url,options||{});var data=await response.json();if(!response.ok||data.ok===false)throw new Error(data.error||'Request failed');return data}
    function when(iso){return new Intl.DateTimeFormat('en-GB',{dateStyle:'medium',timeStyle:'short'}).format(new Date(iso))}
    function media(item){return '<div class="media">'+item.mediaUrls.map(function(url){return item.format==='reel'?'<video controls muted preload="metadata" src="'+esc(url)+'"></video>':'<img loading="lazy" src="'+esc(url)+'" alt="Creative preview">'}).join('')+'</div>'}
    function card(item){var locked=item.status==='posted';var q='&quot;';return '<article class="card">'+media(item)+'<div class="body"><div class="topline"><h2>'+esc(item.headline)+'</h2><span class="badge '+esc(item.status)+'">'+esc(item.status)+'</span></div><div class="meta">'+esc(when(item.scheduledAt))+' · '+esc(item.channels.join(', '))+' · '+esc(item.format)+'</div><div class="caption">'+esc(item.caption)+'</div><div class="actions"><button '+(locked?'disabled':'')+' onclick="approve('+q+esc(item.id)+q+')">Approve</button><button class="secondary" '+(locked?'disabled':'')+' onclick="editItem('+q+esc(item.id)+q+')">Edit</button><button class="danger" '+(locked?'disabled':'')+' onclick="rejectItem('+q+esc(item.id)+q+')">Reject</button><button class="secondary" onclick="metrics('+q+esc(item.id)+q+','+q+esc(item.channels[0])+q+')">Metrics</button></div></div></article>'}
    function render(data){current=data;var safe=data.safeguards;document.getElementById('guard').innerHTML='Approval required: '+esc(safe.approvalRequired)+' · Publisher: <span class="warning">'+esc(safe.publisherMode)+'</span> · Auto ad spend: '+esc(safe.autoSpend);document.getElementById('stats').innerHTML=Object.keys(data.counts).map(function(key){return '<div class="stat"><b>'+esc(data.counts[key])+'</b><span>'+esc(key)+'</span></div>'}).join('');document.getElementById('queue').innerHTML=data.queue.length?data.queue.map(card).join(''):'<div class="empty">No drafts yet. Generate the first four-week queue.</div>'}
    async function load(){try{render(await api('/api/status'))}catch(error){toast(error.message)}}
    async function post(url,body){return api(url,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body||{})})}
    async function cycle(){try{var result=await post('/api/cycle');toast('Created '+result.created+' new drafts');await load()}catch(error){toast(error.message)}}
    async function dispatchNow(){try{var result=await post('/api/dispatch');toast(result.publicPostsMade?'Published '+result.publicPostsMade:'Prepared '+result.considered+' locally; nothing public');await load()}catch(error){toast(error.message)}}
    async function approve(id){try{await post('/api/items/'+encodeURIComponent(id)+'/approve');toast('Approved');await load()}catch(error){toast(error.message)}}
    async function rejectItem(id){var reason=prompt('What should be corrected?','Needs revision');if(reason===null)return;try{await post('/api/items/'+encodeURIComponent(id)+'/reject',{reason:reason});toast('Rejected for revision');await load()}catch(error){toast(error.message)}}
    async function editItem(id){var item=current.queue.find(function(candidate){return candidate.id===id});var caption=prompt('Edit caption. Keep the disclaimer.',item.caption);if(caption===null)return;var scheduled=prompt('Schedule as an ISO date/time.',item.scheduledAt);if(scheduled===null)return;try{await post('/api/items/'+encodeURIComponent(id)+'/edit',{caption:caption,scheduledAt:scheduled});toast('Saved as a new draft');await load()}catch(error){toast(error.message)}}
    async function metrics(id,channel){var impressions=prompt('Impressions','0');if(impressions===null)return;var clicks=prompt('Link clicks','0');if(clicks===null)return;var starts=prompt('Tool starts','0');if(starts===null)return;var purchases=prompt('Purchases','0');if(purchases===null)return;var spend=prompt('Spend in GBP','0');if(spend===null)return;try{await post('/api/metrics',{id:id,channel:channel,impressions:impressions,clicks:clicks,toolStarts:starts,purchases:purchases,spendGbp:spend});toast('Metrics recorded; future choices will learn from them');await load()}catch(error){toast(error.message)}}
    load();
  </script>
</body>
</html>`;

const server = http.createServer(async (request, response) => {
  if (!isLoopback(request.socket.remoteAddress)) {
    json(response, 403, { ok: false, error: "Local access only" });
    return;
  }

  try {
    const url = new URL(request.url, `http://${request.headers.host ?? host}`);
    if (request.method === "GET" && url.pathname === "/healthz") {
      const verification = agent.verify();
      json(response, verification.ok ? 200 : 503, {
        ok: verification.ok,
        service: "appealmate-social-agent",
        safeguards: verification.safeguards,
        errors: verification.errors,
      });
      return;
    }
    if (request.method === "GET" && url.pathname === "/api/status") {
      json(response, 200, publicStatus());
      return;
    }
    if (request.method === "GET" && url.pathname === "/") {
      text(response, 200, dashboard, "text/html; charset=utf-8");
      return;
    }
    if (request.method === "GET" && serveMedia(request, response, url.pathname)) {
      return;
    }

    if (request.method !== "POST") {
      json(response, 404, { ok: false, error: "Route not found" });
      return;
    }

    if (url.pathname === "/api/cycle") {
      json(response, 200, agent.cycle());
      return;
    }
    if (!requestOriginAllowed(request)) {
      json(response, 403, {
        ok: false,
        error: "Mutation requires the local dashboard or internal key",
      });
      return;
    }
    if (url.pathname === "/api/dispatch") {
      json(response, 200, await agent.dispatch());
      return;
    }
    if (url.pathname === "/api/metrics") {
      json(response, 200, {
        ok: true,
        metric: agent.recordMetrics(await bodyJson(request)),
      });
      return;
    }
    const itemAction = /^\/api\/items\/([^/]+)\/(approve|reject|edit)$/.exec(
      url.pathname,
    );
    if (itemAction) {
      const id = decodeURIComponent(itemAction[1]);
      const action = itemAction[2];
      const body = await bodyJson(request);
      let item;
      if (action === "approve") {
        item = agent.approve(id);
      } else if (action === "reject") {
        item = agent.reject(id, body.reason);
      } else {
        item = agent.edit(id, body);
      }
      json(response, 200, { ok: true, item });
      return;
    }
    json(response, 404, { ok: false, error: "Route not found" });
  } catch (error) {
    json(response, 400, { ok: false, error: error.message });
  }
});

const verification = agent.verify();
if (!verification.ok) {
  console.error(JSON.stringify(verification, null, 2));
  process.exit(1);
}

agent.cycle();
server.listen(port, host, () => {
  console.log(
    JSON.stringify({
      ok: true,
      service: "appealmate-social-agent",
      dashboard: `http://${host}:${port}`,
      approvalRequired: true,
      publisherMode: agent.config.publisher.mode,
      autoSpend: false,
    }),
  );
});

function shutdown(signal) {
  console.log(JSON.stringify({ ok: true, signal, event: "shutdown" }));
  server.close(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
