// Stripe webhook: on a completed checkout, capture the buyer's email + what
// they bought into Netlify Blobs (free built-in store, no external DB).
// The scheduled follow-up function later emails them "how did it go?".
//
// To activate: in Stripe → Developers → Webhooks, add endpoint
//   https://<your-site>/.netlify/functions/stripe-webhook
// for event `checkout.session.completed`, then set STRIPE_WEBHOOK_SECRET
// (the whsec_... signing secret) in Netlify env.

const { getStore } = require('@netlify/blobs');

exports.handler = async (event) => {
  const secret = process.env.STRIPE_SECRET_KEY;
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return { statusCode: 501, body: 'stripe not configured' };

  // Require a signing secret. No unverified fallback: without it, anyone could
  // POST a fake checkout.session.completed and inject arbitrary emails into the
  // purchases store (which the follow-up job then emails). Fail closed instead.
  if (!whSecret) return { statusCode: 503, body: 'webhook not configured' };

  const stripe = require('stripe')(secret);
  // Netlify may deliver the body base64-encoded; constructEvent needs the raw
  // bytes Stripe signed, or every event fails signature verification.
  const rawBody = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
  let evt;
  try {
    evt = stripe.webhooks.constructEvent(rawBody, event.headers['stripe-signature'], whSecret);
  } catch (e) {
    return { statusCode: 400, body: `signature error: ${e.message}` };
  }

  if (evt.type === 'checkout.session.completed') {
    const s = evt.data.object;
    const record = {
      email: (s.customer_details && s.customer_details.email) || s.customer_email || '',
      tool: (s.metadata && s.metadata.tool) || '',
      ground: (s.metadata && s.metadata.ground) || '',
      amount: s.amount_total || 0,
      ts: Date.now(),
      emailed: false,
      outcome: null,
    };
    try {
      const store = getStore('purchases');
      await store.setJSON(s.id, record);
    } catch (e) {
      // store unavailable — don't fail the webhook (Stripe would retry)
      return { statusCode: 200, body: 'ok (store skipped)' };
    }
  }
  return { statusCode: 200, body: 'ok' };
};
