// Cloudflare Pages Function — Stripe Checkout session creator.
// Ported from the Netlify Function. Uses the Stripe REST API via fetch (no SDK),
// so it runs on the Workers runtime with no bundling. Payment is verified
// SERVER-SIDE: the success redirect only carries ?paid=<serverToken> after Stripe
// confirms payment, so the client cannot self-unlock.

const PRICES = { first: 199, return: 199, bundle: 599 }; // pence

const ALLOWED_HOSTS = [
  'appealmate-uk.netlify.app',
  'appealmate.uk',
  'www.appealmate.uk',
  'appealmate-cf.pages.dev',
];

function isAllowedReturnUrl(raw) {
  try {
    const { hostname, protocol } = new URL(raw);
    if (protocol !== 'https:' && protocol !== 'http:') return false;
    // Exact-match only. NO prefix checks: hostname.startsWith('10.') would match
    // a registrable domain like "10.evil.com" -> open redirect + key leak.
    if (['localhost', '127.0.0.1'].includes(hostname)) return true;
    if (hostname === 'appealmate-cf.pages.dev') return true;
    return ALLOWED_HOSTS.includes(hostname);
  } catch { return false; }
}

function hex(bytes) {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const secret = env.STRIPE_SECRET_KEY;
  if (!secret) return new Response(JSON.stringify({ error: 'Stripe not configured yet' }), { status: 501 });

  let body;
  try { body = await request.json(); } catch { return new Response('Bad JSON', { status: 400 }); }

  const { tool, key, returnUrl, tier = 'first', ground = '' } = body || {};
  if (!key || !returnUrl) return new Response('Missing key/returnUrl', { status: 400 });
  if (!isAllowedReturnUrl(returnUrl)) return new Response('Invalid returnUrl', { status: 400 });

  const amount = PRICES[tier] || PRICES.first;
  const base = returnUrl.split('#')[0].split('?')[0];
  const serverToken = hex(crypto.getRandomValues(new Uint8Array(16)));

  // Stripe Checkout Sessions via REST (form-encoded, nested keys)
  const form = new URLSearchParams();
  form.set('mode', 'payment');
  form.set('line_items[0][price_data][currency]', 'gbp');
  form.set('line_items[0][price_data][product_data][name]', `AppealMate letter (${tool || 'appeal'})`);
  form.set('line_items[0][price_data][unit_amount]', String(amount));
  form.set('line_items[0][quantity]', '1');
  // {CHECKOUT_SESSION_ID} is substituted by Stripe on redirect; the client then
  // calls /verify with it so unlock is gated on Stripe confirming payment.
  form.set('success_url', `${base}?paid=1&key=${encodeURIComponent(key)}&session_id={CHECKOUT_SESSION_ID}`);
  form.set('cancel_url', returnUrl);
  form.set('metadata[tool]', String(tool || ''));
  form.set('metadata[key]', String(key));
  form.set('metadata[ground]', String(ground || ''));
  form.set('metadata[serverToken]', serverToken);

  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/x-www-form-urlencoded' },
      body: form.toString(),
    });
    const data = await res.json();
    if (!res.ok) return new Response(JSON.stringify({ error: data.error?.message || 'stripe error' }), { status: 500 });
    return new Response(JSON.stringify({ url: data.url }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    console.error('create-checkout error', e);
    return new Response(JSON.stringify({ error: 'checkout unavailable' }), { status: 500 });
  }
}
