// Stripe Checkout session creator (Netlify Function).
// Verifies payment SERVER-SIDE: the client cannot self-unlock, because the
// success redirect only carries ?paid=<key> after Stripe confirms payment.
//
// Wire it up: set STRIPE_SECRET_KEY in Netlify env (Site settings → Environment),
// then `npm i stripe` so this function can require it. Until then the function
// returns 501 and the front end falls back to its TEST-MODE unlock stub.

const crypto = require('crypto');

const PRICES = {
  // amounts in pence. Flat 199 for launch phase (first === return) until we have
  // 100+ verified paying users; then raise `return` to introduce tiered pricing.
  first: 199,
  return: 199,
  bundle: 599,
};

// Allowed origins for returnUrl — prevents open-redirect phishing via Stripe checkout
const ALLOWED_HOSTS = [
  'appealmate-uk.netlify.app',
  'appealmate.co.uk',
  'www.appealmate.co.uk',
];

function isAllowedReturnUrl(raw) {
  // Also allow localhost / LAN IPs for development
  try {
    const { hostname, protocol } = new URL(raw);
    if (protocol !== 'https:' && protocol !== 'http:') return false;
    if (['localhost', '127.0.0.1'].includes(hostname)) return true;
    if (hostname.startsWith('192.168.') || hostname.startsWith('10.')) return true;
    return ALLOWED_HOSTS.includes(hostname);
  } catch { return false; }
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return { statusCode: 501, body: JSON.stringify({ error: 'Stripe not configured yet' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, body: 'Bad JSON' }; }

  const { tool, key, returnUrl, tier = 'first', ground = '' } = body;
  if (!key || !returnUrl) return { statusCode: 400, body: 'Missing key/returnUrl' };

  // Validate returnUrl to prevent open-redirect phishing via Stripe cancel/success URLs
  if (!isAllowedReturnUrl(returnUrl)) {
    return { statusCode: 400, body: 'Invalid returnUrl' };
  }

  const amount = PRICES[tier] || PRICES.first;
  const base = returnUrl.split('#')[0].split('?')[0];

  // Server-generated token so the ?paid= param cannot be guessed or computed from
  // public client-side code — only a real Stripe success redirect carries this token
  const serverToken = crypto.randomBytes(16).toString('hex');

  try {
    const stripe = require('stripe')(secret);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price_data: {
          currency: 'gbp',
          product_data: { name: `AppealMate letter (${tool || 'appeal'})` },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      success_url: `${base}?paid=${encodeURIComponent(serverToken)}&key=${encodeURIComponent(key)}`,
      cancel_url: returnUrl,
      metadata: { tool: String(tool || ''), key: String(key), ground: String(ground || ''), serverToken },
    });
    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
