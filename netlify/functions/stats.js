// Business dashboard data — aggregates sales from Stripe.
// Admin-gated by ADMIN_PASS env var. Uses STRIPE_SECRET_KEY server-side only;
// the secret never reaches the browser.

const crypto = require('crypto');

// Constant-time string compare that does not leak length-mismatch via throw.
function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

exports.handler = async (event) => {
  // Admin password via header only — never via query string (would appear in logs)
  const headers = event.headers || {};
  const pass = headers['x-admin-pass'] || '';
  const adminPass = process.env.ADMIN_PASS;
  if (!adminPass || !safeEqual(pass, adminPass)) return { statusCode: 401, body: 'unauthorized' };

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return { statusCode: 200, body: JSON.stringify({ count: 0, gross: 0, last24: 0, byTool: {}, mode: 'no-stripe' }) };

  try {
    const stripe = require('stripe')(secret);
    const since = Math.floor(Date.now() / 1000) - 60 * 60 * 24 * 90; // last 90 days
    let starting_after, count = 0, gross = 0, last24 = 0;
    const dayAgo = Math.floor(Date.now() / 1000) - 86400;
    const byTool = {};

    // page through completed checkout sessions
    for (let i = 0; i < 10; i++) {
      const page = await stripe.checkout.sessions.list({ limit: 100, created: { gte: since }, ...(starting_after ? { starting_after } : {}) });
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
    return { statusCode: 200, body: JSON.stringify({ count, gross, last24, byTool, mode }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
