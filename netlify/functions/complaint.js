// Support/complaint capture from the chatbot. Emails the team via Resend so
// Benjamin sees every question/complaint and can draft a reply. Free, serverless.
// Falls back to logging if Resend isn't configured. Needs RESEND_API_KEY +
// ALERT_EMAIL (defaults to benaiwod@gmail.com) + FROM_EMAIL.

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method not allowed' };
  let body;
  try { body = JSON.parse(event.body || '{}'); } catch { return { statusCode: 400, body: 'Bad JSON' }; }

  const email = (body.email || '').slice(0, 200);
  const message = (body.message || '').slice(0, 4000);
  const page = (body.page || '').slice(0, 200);
  if (!message) return { statusCode: 400, body: 'Empty message' };

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.FROM_EMAIL || 'AppealMate <onboarding@resend.dev>';
  const alertTo = process.env.ALERT_EMAIL || 'benaiwod@gmail.com';

  if (!resendKey) {
    console.log('COMPLAINT (no resend):', { email, message, page });
    return { statusCode: 200, body: 'received' };
  }

  const html = `<h3>New AppealMate message / complaint</h3>
    <p><b>From:</b> ${email || '(no email given)'}</p>
    <p><b>Page:</b> ${page}</p>
    <p><b>Message:</b></p>
    <p style="white-space:pre-wrap">${message.replace(/</g, '&lt;')}</p>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: alertTo,
        reply_to: email || undefined,
        subject: `AppealMate: new ${email ? 'message' : 'anonymous message'}`,
        html,
      }),
    });
    return { statusCode: res.ok ? 200 : 502, body: res.ok ? 'sent' : 'send failed' };
  } catch (e) {
    console.log('COMPLAINT send error:', e.message, { email, message });
    return { statusCode: 200, body: 'received' }; // don't lose the message
  }
};
