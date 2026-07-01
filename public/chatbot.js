// AppealMate support chatbot — self-contained widget, no dependencies.
// Phase 1: rule-based FAQ (free, no LLM). Complaints/questions it can't answer
// get captured and emailed to us via /.netlify/functions/complaint, and the user
// is told we'll reply. Injects its own styles + DOM so index.html only loads it.
(function () {
  const DISCLAIMER = 'AppealMate provides self-help letter templates. It is not a law firm and does not give legal advice.';

  // keyword -> answer. First matching entry wins. Order: most specific first.
  const FAQ = [
    { k: ['refund', 'money back', 'cancel my payment'], a: 'We refund for technical faults, double charges, or if no letter was produced. We can\'t refund a change of mind after unlocking, or the outcome of your appeal. Full policy: <a href="#/refunds">Refunds</a>.' },
    { k: ['scam', 'legit', 'safe', 'trust', 'real', 'con'], a: 'Totally fair to check. Payments run through Stripe (we never see your card). ' + DISCLAIMER + ' You can read our <a href="#/terms">Terms</a> and <a href="#/privacy">Privacy</a> any time.' },
    { k: ['how much', 'price', 'cost', 'pay', 'fee'], a: 'Every letter is £1.99. You only pay to unlock and download the finished letter, and you can re-download it any time from “My letters” at no extra charge.' },
    { k: ['how', 'work', 'use', 'start'], a: 'Pick a tool (e.g. Parking Appeal), answer a few quick questions, choose your reason, and we generate a formal letter. Unlock it for £1.99 and download the PDF. Takes about 2 minutes.' },
    { k: ['legal', 'law firm', 'advice', 'solicitor', 'lawyer'], a: DISCLAIMER + ' We give you a strong, ready-to-send template based on the ground you pick — you stay in control.' },
    { k: ['guarantee', 'will it work', 'win', 'success', 'cancel the fine'], a: 'We can\'t guarantee an outcome — no one honestly can. We give you a well-structured letter using proven appeal grounds, which gives you the best fair shot.' },
    { k: ['pdf', 'download', 'letter', 'copy'], a: 'After you unlock (£1.99), you get a Download PDF button and a Copy button. The letter is ready to send to the council or parking company.' },
    { k: ['parking', 'pcn', 'ticket', 'fine', 'charge'], a: 'For a parking ticket, open the Parking Appeal tool, choose your reason (unclear signage, grace period, already paid, valid permit, broken machine, and more), and we write the letter. Want me to take you there? <a href="#/tool/parking">Open Parking Appeal</a>.' },
    { k: ['deposit', 'landlord', 'tenancy'], a: 'Use the Tenancy Deposit tool to challenge unfair deductions. <a href="#/tool/deposit">Open Deposit Dispute</a>.' },
    { k: ['delay', 'flight', 'train', 'compensation'], a: 'Use the Train & Flight Delay tool to claim compensation. <a href="#/tool/delay">Open Delay Claim</a>.' },
    { k: ['contact', 'email', 'human', 'help', 'speak', 'phone'], a: 'You can reach us any time on the <a href="#/contact">Contact</a> page, or tell me your question/complaint below and I\'ll pass it to the team with your email.' },
  ];

  function answer(text) {
    const t = text.toLowerCase();
    for (const f of FAQ) if (f.k.some((kw) => t.includes(kw))) return f.a;
    return null;
  }

  const css = `
  #amChatBtn{position:fixed;right:18px;bottom:18px;z-index:50;background:#1f6feb;color:#fff;border:none;border-radius:999px;padding:12px 18px;font:600 15px 'Hanken Grotesk',system-ui,sans-serif;box-shadow:0 8px 24px rgba(20,40,70,.22);cursor:pointer}
  #amChatBtn:hover{background:#1554c0}
  #amChatPanel{position:fixed;right:18px;bottom:74px;z-index:50;width:min(360px,calc(100vw - 36px));max-height:70vh;background:#fff;border:1px solid #e4e8ef;border-radius:16px;box-shadow:0 18px 50px rgba(20,40,70,.22);display:none;flex-direction:column;overflow:hidden;font-family:'Hanken Grotesk',system-ui,sans-serif}
  #amChatPanel.open{display:flex}
  #amChatHead{background:#1f6feb;color:#fff;padding:14px 16px;font-weight:600}
  #amChatHead small{display:block;font-weight:400;opacity:.85;font-size:.8rem}
  #amChatLog{padding:14px;overflow-y:auto;flex:1;display:flex;flex-direction:column;gap:10px;font-size:.92rem}
  .amMsg{padding:9px 12px;border-radius:12px;max-width:85%}
  .amBot{background:#f2f7ff;border:1px solid #e1ecff;align-self:flex-start}
  .amUser{background:#1f6feb;color:#fff;align-self:flex-end}
  .amMsg a{color:#1f6feb;font-weight:600}
  .amUser a{color:#fff}
  #amChatForm{display:flex;gap:8px;padding:12px;border-top:1px solid #e4e8ef}
  #amChatInput{flex:1;padding:10px 12px;border:1px solid #e4e8ef;border-radius:10px;font:inherit}
  #amChatSend{background:#1f6feb;color:#fff;border:none;border-radius:10px;padding:0 14px;font-weight:600;cursor:pointer}
  .amChips{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}
  .amChip{background:#eef2f8;border:1px solid #e4e8ef;border-radius:999px;padding:6px 10px;font-size:.82rem;cursor:pointer}
  .amChip:hover{background:#e3e9f2}`;

  function el(html){const t=document.createElement('template');t.innerHTML=html.trim();return t.content.firstChild;}
  let awaitingComplaint = false;

  function init() {
    const style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);
    const btn = el('<button id="amChatBtn" aria-label="Help">💬 Help</button>');
    const panel = el(`<div id="amChatPanel" role="dialog" aria-label="AppealMate help">
      <div id="amChatHead">AppealMate help<small>Quick answers, or leave a message</small></div>
      <div id="amChatLog"></div>
      <form id="amChatForm"><input id="amChatInput" placeholder="Ask a question…" autocomplete="off"><button id="amChatSend" type="submit">Send</button></form>
    </div>`);
    document.body.appendChild(btn); document.body.appendChild(panel);
    const log = panel.querySelector('#amChatLog');

    const add = (html, who) => { const m = el(`<div class="amMsg ${who}"></div>`); m.innerHTML = html; log.appendChild(m); log.scrollTop = log.scrollHeight; return m; };
    const greet = () => {
      add('Hi! I can answer quick questions about AppealMate. Try one:', 'amBot');
      const chips = el('<div class="amChips"></div>');
      ['How does it work?', 'How much is it?', 'Is it legit?', 'Refunds', 'Contact a human'].forEach((c) => {
        const chip = el(`<button class="amChip" type="button">${c}</button>`);
        chip.onclick = () => handle(c); chips.appendChild(chip);
      });
      log.appendChild(chips);
    };
    btn.onclick = () => { panel.classList.toggle('open'); if (panel.classList.contains('open') && !log.childElementCount) greet(); };

    async function handle(text) {
      add(text.replace(/</g,'&lt;'), 'amUser');
      if (awaitingComplaint) { awaitingComplaint = await sendComplaint(text); return; }
      // "contact" / "contact a human" -> go straight into message capture, don't
      // just repeat the FAQ blurb (that was the bug: it promised to take details
      // but never switched into capture mode).
      const t = text.toLowerCase();
      if (t.includes('contact') || t.includes('a human') || t === 'human' || t.includes('speak to')) {
        add('Sure — I\'ll pass this to the team. Please paste your <b>email + your question or complaint in one message</b> and I\'ll send it on. We reply within 3 working days.', 'amBot');
        awaitingComplaint = true;
        return;
      }
      const a = answer(text);
      if (a) { add(a, 'amBot'); add('Anything else? If you\'d rather a person looks at it, type <b>contact</b>.', 'amBot'); return; }
      // no FAQ match -> offer to capture as a message/complaint
      add('I\'m not sure on that one. I can pass it to the team — just paste your <b>email + your question or complaint</b> in one message and I\'ll send it on.', 'amBot');
      awaitingComplaint = true;
    }

    async function sendComplaint(text) {
      const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
      if (!emailMatch) {
        add('I just need an <b>email address</b> so we can reply. Please include it with your message.', 'amBot');
        return true; // stay in capture mode for their next line
      }
      try {
        await fetch('/.netlify/functions/complaint', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: emailMatch[0], message: text, page: location.hash || '/' })
        });
      } catch (e) {}
      add('Thanks — that\'s been sent to the team and we\'ll reply by email. Anything else?', 'amBot');
      return false; // capture complete
    }

    panel.querySelector('#amChatForm').addEventListener('submit', (e) => {
      e.preventDefault(); const inp = panel.querySelector('#amChatInput'); const v = inp.value.trim(); if (!v) return; inp.value=''; handle(v);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
