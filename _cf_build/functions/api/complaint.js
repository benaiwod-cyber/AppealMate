// Cloudflare Pages Function — support/complaint capture from the chatbot.
// Emails the team via Resend. Falls back to a 200 (never lose the message) if
// Resend isn't configured. Ported 1:1 from the Netlify Function.

export async function onRequestPost(context) {
  const { request, env } = context;
  let body;
  try { body = await request.json(); } catch { return new Response('Bad JSON', { status: 400 }); }

  const email = (body.email || '').slice(0, 200);
  const message = (body.message || '').slice(0, 4000);
  const page = (body.page || '').slice(0, 200);
  if (!message) return new Response('Empty message', { status: 400 });

  const resendKey = env.RESEND_API_KEY;
  const from = env.FROM_EMAIL || 'AppealMate <onboarding@resend.dev>';
  const alertTo = env.ALERT_EMAIL || 'benaiwod@gmail.com';

  if (!resendKey) return new Response('received', { status: 200 });

  const esc = (s) => String(s).replace(/[<>&"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]));
  const html = `<h3>New AppealMate message / complaint</h3>
    <p><b>From:</b> ${esc(email) || '(no email given)'}</p>
    <p><b>Page:</b> ${esc(page)}</p>
    <p><b>Message:</b></p>
    <p style="white-space:pre-wrap">${esc(message)}</p>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: alertTo, reply_to: email || undefined, subject: `AppealMate: new ${email ? 'message' : 'anonymous message'}`, html }),
    });
    return new Response(res.ok ? 'sent' : 'send failed', { status: res.ok ? 200 : 502 });
  } catch {
    return new Response('received', { status: 200 });
  }
}
