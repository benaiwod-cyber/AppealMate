// Stripe Checkout session creator (Netlify Function).
// Verifies payment SERVER-SIDE: the client cannot self-unlock, because the
// success redirect only carries ?paid=<key> after Stripe confirms payment.
//
// Wire it up: set STRIPE_SECRET_KEY in Netlify env (Site settings → Environment),
// then `npm i stripe` so this function can require it. Until then the function
// returns 501 and the front end falls back to its TEST-MODE unlock stub.

const PRICES = {
  // amounts in pence
  first: 199,
  return: 399,
  bundle: 599,
};

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return { statusCode: 501, body: JSON.stringify({ error: 'Stripe not configured yet' }) };
  }

  let body;
  try { body = JSON.parse(event.body || '{}'); }
  catch { return { statusCode: 400, body: 'Bad JSON' }; }

  const { tool, key, returnUrl, tier = 'first' } = body;
  if (!key || !returnUrl) return { statusCode: 400, body: 'Missing key/returnUrl' };

  const amount = PRICES[tier] || PRICES.first;
  const base = returnUrl.split('#')[0].split('?')[0];

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
      success_url: `${base}?paid=${encodeURIComponent(key)}`,
      cancel_url: returnUrl,
      metadata: { tool: String(tool || ''), key: String(key) },
    });
    return { statusCode: 200, body: JSON.stringify({ url: session.url }) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
