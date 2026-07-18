// Cloudflare Pages Function — server-side payment verification.
// The unlock gate. The client must NOT trust the presence of ?paid= alone;
// it calls this endpoint with the Stripe Checkout Session id and only unlocks
// if Stripe itself confirms payment_status === 'paid'. Uses the Stripe REST API.

export async function onRequestGet(context) {
  const { request, env } = context;
  const secret = env.STRIPE_SECRET_KEY;
  if (!secret) return json({ paid: false, error: 'not configured' }, 501);

  const url = new URL(request.url);
  const sessionId = url.searchParams.get('session_id') || '';
  // Stripe session ids look like cs_test_... / cs_live_... — reject anything else
  // before spending a Stripe API call on it.
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    return json({ paid: false, error: 'bad session_id' }, 400);
  }

  try {
    const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const s = await res.json();
    // Unknown/expired session = simply "not paid", not a server error. Return 200
    // {paid:false} so the client reads clean JSON (a 5xx gets masked by Cloudflare's
    // error page) and still fails closed (no unlock). Generic message, no Stripe leak.
    if (!res.ok) return json({ paid: false, error: 'not verified' }, 200);

    // Reject stale sessions to blunt replay of a leaked session_id. A real
    // payment completes within minutes; Stripe sessions expire in ~24h anyway.
    const ageOk = s.created && (Date.now() / 1000 - s.created) < 86400;
    const paid = s.payment_status === 'paid' && ageOk;
    // Return the letter key from metadata so the client unlocks the RIGHT letter,
    // and only that one — the client cannot substitute a different key.
    return json({ paid, key: paid ? (s.metadata && s.metadata.key) || '' : '' }, 200);
  } catch (e) {
    console.error('verify error', e);
    return json({ paid: false, error: 'verification unavailable' }, 500);
  }
}

function json(obj, status) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });
}
