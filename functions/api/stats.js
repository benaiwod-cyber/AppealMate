// Cloudflare Pages Function — business dashboard data, aggregated from Stripe.
// Admin-gated by ADMIN_PASS env via x-admin-pass header (never query string).
// Uses the Stripe REST API server-side; the secret never reaches the browser.

// Constant-time compare (length-safe) to avoid leaking the admin pass via timing.
function safeEqual(a, b) {
  a = String(a); b = String(b);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const pass = request.headers.get('x-admin-pass') || '';
  const adminPass = env.ADMIN_PASS;
  if (!adminPass || !safeEqual(pass, adminPass)) return new Response('unauthorized', { status: 401 });

  const secret = env.STRIPE_SECRET_KEY;
  if (!secret) return new Response(JSON.stringify({ count: 0, gross: 0, last24: 0, byTool: {}, mode: 'no-stripe' }), { status: 200 });

  try {
    const since = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 90;
    const dayAgo = Math.floor(Date.now() / 1000) - 86400;
    let starting_after = '', count = 0, gross = 0, last24 = 0;
    const byTool = {};

    for (let i = 0; i < 10; i++) {
      const qs = new URLSearchParams({ limit: '100', 'created[gte]': String(since) });
      if (starting_after) qs.set('starting_after', starting_after);
      const res = await fetch(`https://api.stripe.com/v1/checkout/sessions?${qs}`, {
        headers: { Authorization: `Bearer ${secret}` },
      });
      const page = await res.json();
      if (!res.ok) return new Response(JSON.stringify({ error: page.error?.message || 'stripe error' }), { status: 500 });
      for (const s of page.data) {
        if (s.payment_status !== 'paid') continue;
        count++; gross += s.amount_total || 0;
        if (s.created >= dayAgo) last24++;
        const tool = (s.metadata && s.metadata.tool) || 'unknown';
        byTool[tool] = byTool[tool] || { count: 0, amount: 0 };
        byTool[tool].count++; byTool[tool].amount += s.amount_total || 0;
      }
      if (!page.has_more) break;
      starting_after = page.data[page.data.length - 1].id;
    }

    const mode = secret.startsWith('sk_live') ? 'LIVE' : 'TEST';
    return new Response(JSON.stringify({ count, gross, last24, byTool, mode }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}
