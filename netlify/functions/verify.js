// Netlify Function — server-side payment verification (mirror of the Cloudflare
// /api/verify). The unlock gate: the client must NOT trust ?paid= presence; it
// calls this with the Stripe Checkout Session id and only unlocks if Stripe
// confirms payment_status === 'paid'. Uses the Stripe REST API via fetch.

exports.handler = async (event) => {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) return json({ paid: false, error: 'not configured' }, 501);

  const sessionId = (event.queryStringParameters && event.queryStringParameters.session_id) || '';
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    return json({ paid: false, error: 'bad session_id' }, 400);
  }

  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const s = await res.json();
    if (!res.ok) return json({ paid: false, error: 'could not verify' }, 502);

    // Reject stale sessions to blunt replay of a leaked session_id.
    const ageOk = s.created && (Date.now() / 1000 - s.created) < 86400;
    const paid = s.payment_status === 'paid' && ageOk;
    return json({ paid, key: paid ? (s.metadata && s.metadata.key) || '' : '' }, 200);
  } catch (e) {
    return json({ paid: false, error: 'error' }, 500);
  }
};

function json(obj, statusCode) {
  return { statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(obj) };
}
