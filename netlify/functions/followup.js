// Scheduled follow-up: once a day, find purchases 5+ days old that haven't been
// emailed yet, and send a "how did your appeal go?" email with a link to the
// feedback page. Verified by the Stripe-captured email = we know it's them.
//
// Runs on a schedule (see config below). Needs a free email provider key:
// RESEND_API_KEY (resend.com, 3,000 free/month) + FROM_EMAIL (a verified sender).
// Site base URL from SITE_URL env (e.g. https://appealmate-uk.netlify.app).

const { getStore } = require('@netlify/blobs');

exports.handler = async () => {
  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || 'AppealMate <onboarding@resend.dev>';
  const base = process.env.SITE_URL || 'https://appealmate-uk.netlify.app';
  if (!resendKey) return { statusCode: 200, body: 'no RESEND_API_KEY — skipping send' };

  const store = getStore('purchases');
  const { blobs } = await store.list();
  const fiveDays = 5 * 24 * 60 * 60 * 1000;
  let sent = 0;

  for (const b of blobs) {
    const rec = await store.get(b.key, { type: 'json' });
    if (!rec || rec.emailed || !rec.email) continue;
    if (Date.now() - rec.ts < fiveDays) continue;

    const link = `${base}/#/feedback?p=${encodeURIComponent(b.key)}`;
    const html = `<p>Hi,</p>
      <p>A few days ago you used AppealMate for a ${rec.tool || 'letter'}. We'd love to know how it went — it helps us improve the templates for everyone.</p>
      <p><a href="${link}">Tell us how your appeal went</a> (takes 10 seconds).</p>
      <p>Thanks,<br>AppealMate</p>
      <p style="font-size:12px;color:#888">AppealMate provides self-help letter templates. It is not a law firm and does not provide legal advice.</p>`;

    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from, to: rec.email, subject: 'How did your appeal go?', html }),
      });
      if (res.ok) { rec.emailed = true; await store.setJSON(b.key, rec); sent++; }
    } catch (e) { /* try again next run */ }
  }
  return { statusCode: 200, body: `follow-ups sent: ${sent}` };
};

// Netlify scheduled function: run once a day at 09:00 UTC.
exports.config = { schedule: '0 9 * * *' };
