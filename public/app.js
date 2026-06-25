import { TOOLS, TOOL_ORDER } from './templates.js';

// ---- config ----
const PRICE_FIRST = '£1.99';     // first letter (hook)
const PRICE_RETURN = '£3.99';    // subsequent
const PRICE_BUNDLE = '£5.99';    // 3-letter bundle
const DISCLAIMER = 'AppealMate provides self-help letter templates and document assistance. It is not a law firm and does not provide legal advice.';

const app = document.getElementById('app');

// ---- tiny helpers ----
const el = (html) => { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c]));
const hasPaid = () => localStorage.getItem('am_paid_count') ? Number(localStorage.getItem('am_paid_count')) : 0;
const firstTime = () => hasPaid() === 0;

// fill {{placeholders}} from the collected values; drop empty optional lines cleanly
function renderLetter(bodyTemplate, values) {
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  let out = bodyTemplate.replace(/\{\{(\w+)\}\}/g, (_, key) => values[key] ? String(values[key]).trim() : '');
  // collapse the gap left by an empty optional {{detail}} sentence
  out = out.replace(/[ \t]{2,}/g, ' ').replace(/\n{3,}/g, '\n\n').trim();
  return `${today}\n\n${out}`;
}

// ---- router ----
function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  const [view, arg] = hash.split('/');
  window.scrollTo(0, 0);
  if (view === 'tool' && TOOLS[arg]) return renderTool(arg);
  if (view === 'terms') return renderLegal('terms');
  if (view === 'privacy') return renderLegal('privacy');
  return renderHome();
}
window.addEventListener('hashchange', route);

// ---- home ----
function renderHome() {
  const cards = TOOL_ORDER.map((id, i) => {
    const t = TOOLS[id];
    return `<button class="card ${t.hero ? 'hero-card' : ''} fade-up d${Math.min(i,3)}" onclick="location.hash='#/tool/${id}'">
      ${t.hero ? '<span class="tag">Most popular</span>' : '<span class="tag">&nbsp;</span>'}
      <h3>${esc(t.label)}</h3>
      <p>${esc(t.blurb)}</p>
      <span class="go">Start &rarr;</span>
    </button>`;
  }).join('');

  app.innerHTML = `
    <section class="hero wrap">
      <h1 class="fade-up">Fight your parking ticket<br>in 2 minutes.</h1>
      <p class="sub fade-up d1">Council PCN, private parking charge, deposit dispute, delayed train or flight. Answer a few questions and get a formal letter ready to send.</p>
      <div class="trust fade-up d2">
        <span>✅ Letter in 2 minutes</span>
        <span>✅ From ${PRICE_FIRST}</span>
        <span>✅ Council &amp; private parking</span>
      </div>
    </section>
    <div class="wrap"><div class="cards">${cards}</div>
      <p class="disclaimer">${DISCLAIMER}</p>
    </div>`;
}

// ---- tool flow ----
const draft = {}; // in-memory working state for the active tool

function renderTool(id) {
  const t = TOOLS[id];
  draft.tool = id; draft.values = draft.values || {}; draft.ground = null;

  const fields = t.fields.map(f => {
    const v = esc(draft.values[f.id] || '');
    if (f.type === 'textarea') return field(f, `<textarea id="f_${f.id}" ${f.required?'required':''}>${v}</textarea>`);
    if (f.type === 'select') return field(f, `<select id="f_${f.id}" ${f.required?'required':''}>${
      ['<option value="">Choose…</option>'].concat(f.options.map(o => `<option ${draft.values[f.id]===o?'selected':''}>${esc(o)}</option>`)).join('')
    }</select>`);
    return field(f, `<input id="f_${f.id}" type="${f.type}" value="${v}" ${f.required?'required':''}>`);
  }).join('');

  const grounds = t.grounds.map(g => `
    <label class="ground" data-g="${g.id}">
      <input type="radio" name="ground" value="${g.id}">
      <span>${esc(g.label)}</span>
    </label>`).join('');

  app.innerHTML = `
    <div class="wrap">
      <div class="back" onclick="location.hash=''">&larr; All tools</div>
      <h2 class="fade-up">${esc(t.label)}</h2>
      <p class="sub fade-up d1" style="color:var(--muted)">${esc(t.blurb)}</p>
      <div class="panel fade-up d2">
        <div class="steps"><b>1. Your details</b> · 2. Pick your reason · 3. Get your letter</div>
        ${fields}
        <h3 style="font-size:1.05rem;margin-top:1.2rem">What's your reason for appealing?</h3>
        <div class="grounds">${grounds}</div>
        <p class="disclaimer">${DISCLAIMER}</p>
        <button class="btn block" id="genBtn">Generate my letter</button>
      </div>
    </div>`;

  app.querySelectorAll('.ground').forEach(node => {
    node.addEventListener('click', () => {
      app.querySelectorAll('.ground').forEach(n => n.classList.remove('sel'));
      node.classList.add('sel');
      node.querySelector('input').checked = true;
      draft.ground = node.dataset.g;
    });
  });
  document.getElementById('genBtn').addEventListener('click', () => onGenerate(id));
}

function field(f, inner) {
  return `<div class="field"><label for="f_${f.id}">${esc(f.label)}${f.required?'':' <span style="color:var(--muted);font-weight:400">(optional)</span>'}</label>${inner}</div>`;
}

function onGenerate(id) {
  const t = TOOLS[id];
  const values = {};
  let missing = null;
  for (const f of t.fields) {
    const node = document.getElementById('f_' + f.id);
    values[f.id] = node ? node.value.trim() : '';
    if (f.required && !values[f.id] && !missing) missing = f.label;
  }
  draft.values = values;
  if (missing) return alert('Please fill in: ' + missing);
  if (!draft.ground) return alert('Please pick a reason for appealing.');

  const ground = t.grounds.find(g => g.id === draft.ground);
  const letter = renderLetter(ground.body, values);
  draft.letter = letter;
  renderResult(id, letter);
}

// ---- result + paywall ----
function renderResult(id, letter) {
  const unlocked = sessionStorage.getItem('am_unlock_' + hashKey(letter)) === '1';
  const price = firstTime() ? PRICE_FIRST : PRICE_RETURN;
  const wasPrice = firstTime() ? `<s>£6.99</s> ` : '';

  app.innerHTML = `
    <div class="wrap">
      <div class="back" onclick="location.hash='#/tool/${id}'">&larr; Edit details</div>
      <h2 class="fade-up">Your letter is ready</h2>
      <div class="panel fade-up d1">
        <div class="letter ${unlocked ? '' : 'locked'}" id="letterBox">${esc(letter)}</div>
        ${unlocked ? `
          <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
            <button class="btn" id="pdfBtn">⬇ Download PDF</button>
            <button class="btn secondary" id="copyBtn">Copy text</button>
          </div>
          <div id="winBox" style="margin-top:20px;border-top:1px solid var(--line);padding-top:18px">
            <h3 style="font-size:1.05rem">Did your appeal work? Help the next person</h3>
            <p style="color:var(--muted);font-size:.92rem;margin-top:-4px">Tell us how it went. We use real wins to improve the templates (kept anonymous).</p>
            <div class="field"><label>How did it go?</label>
              <select id="winOutcome">
                <option value="">Choose…</option>
                <option>Won — charge cancelled / money back</option>
                <option>Partially won</option>
                <option>Still waiting to hear</option>
                <option>Rejected</option>
              </select>
            </div>
            <div class="field"><label>Anything that helped? (optional)</label>
              <textarea id="winNotes" placeholder="e.g. they cancelled within 3 days after I mentioned POFA…"></textarea>
            </div>
            <button class="btn secondary" id="winBtn">Share my result</button>
          </div>` : `
          <div class="paywall">
            <p class="price">${wasPrice}${price}</p>
            <p style="color:var(--muted);margin-top:-6px">Unlock the full letter and download it as a PDF.</p>
            <button class="btn block" id="payBtn">Unlock &amp; download — ${price}</button>
            <p style="font-size:.8rem;color:var(--muted);margin-top:10px">Secure payment by Stripe. ${esc(DISCLAIMER)}</p>
          </div>`}
      </div>
    </div>`;

  if (unlocked) {
    document.getElementById('pdfBtn').addEventListener('click', () => downloadPdf(letter, id));
    document.getElementById('copyBtn').addEventListener('click', () => {
      navigator.clipboard.writeText(letter); document.getElementById('copyBtn').textContent = 'Copied ✓';
    });
    document.getElementById('winBtn').addEventListener('click', () => submitWin(id));
  } else {
    document.getElementById('payBtn').addEventListener('click', () => startCheckout(id, letter));
  }
}

function hashKey(s) { let h = 0; for (let i=0;i<s.length;i++){ h = (h*31 + s.charCodeAt(i))|0; } return Math.abs(h); }

// ---- payment ----
// Real flow: POST to /.netlify/functions/create-checkout -> Stripe Checkout ->
// success redirect back with ?paid=<key>. Until a Stripe key is wired, a
// confirm() stub lets the whole flow be tested end to end.
async function startCheckout(id, letter) {
  const key = hashKey(letter);
  try {
    const res = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool: id, key, returnUrl: location.href })
    });
    if (res.ok) {
      const { url } = await res.json();
      if (url) { sessionStorage.setItem('am_pending', key); location.href = url; return; }
    }
    throw new Error('no checkout');
  } catch (e) {
    // DEV-ONLY stub: lets the unlock + PDF flow be tested before Stripe is wired.
    // Gated to localhost/LAN so a PUBLIC deploy can never hand out free letters.
    const host = location.hostname;
    const isDev = host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.');
    if (isDev) {
      if (confirm('[DEV TEST MODE] Stripe not connected. Simulate a successful payment and unlock?')) unlock(key);
    } else {
      alert('Payments are being set up — please check back shortly.');
    }
  }
}

function unlock(key) {
  sessionStorage.setItem('am_unlock_' + key, '1');
  localStorage.setItem('am_paid_count', String(hasPaid() + 1));
  renderResult(draft.tool, draft.letter);
}

// handle Stripe success redirect (?paid=<key>)
function checkPaidRedirect() {
  const p = new URLSearchParams(location.search).get('paid');
  if (p) { sessionStorage.setItem('am_unlock_' + p, '1'); localStorage.setItem('am_paid_count', String(hasPaid() + 1)); }
}

// ---- Phase 2: success-paste capture (Netlify Forms, no backend) ----
async function submitWin(toolId) {
  const outcome = document.getElementById('winOutcome').value;
  const notes = document.getElementById('winNotes').value.trim();
  if (!outcome) return alert('Pick how it went first.');
  const data = new URLSearchParams({
    'form-name': 'wins',
    tool: toolId,
    ground: draft.ground || '',
    outcome,
    notes,
    'bot-field': '' // honeypot stays empty
  });
  try {
    await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data.toString() });
  } catch (e) { /* offline / local: still thank the user, capture is best-effort */ }
  const box = document.getElementById('winBox');
  if (box) box.innerHTML = '<p style="color:var(--accent);font-weight:600">Thanks — that helps us improve the templates. 🙏</p>';
}

// ---- PDF (pdf-lib from CDN, loaded in index.html) ----
async function downloadPdf(text, id) {
  const { PDFDocument, StandardFonts } = window.PDFLib;
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const size = 11, margin = 56, lineH = 16, pageW = 595.28, pageH = 841.89, maxW = pageW - margin*2;
  let page = pdf.addPage([pageW, pageH]); let y = pageH - margin;

  const wrap = (line) => {
    const words = line.split(' '); const out = []; let cur = '';
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w;
      if (font.widthOfTextAtSize(test, size) > maxW && cur) { out.push(cur); cur = w; } else { cur = test; }
    }
    if (cur) out.push(cur); return out.length ? out : [''];
  };

  for (const raw of text.split('\n')) {
    for (const line of wrap(raw)) {
      if (y < margin) { page = pdf.addPage([pageW, pageH]); y = pageH - margin; }
      page.drawText(line, { x: margin, y, size, font });
      y -= lineH;
    }
  }
  const bytes = await pdf.save();
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = `appealmate-${id}-letter.pdf`; a.click();
  URL.revokeObjectURL(a.href);
}

// ---- legal pages ----
function renderLegal(which) {
  const terms = `<h2>Terms of Service</h2>
    <p>${DISCLAIMER}</p>
    <p>AppealMate provides template-based letters that you complete using information you supply. We do not check the accuracy of the information you enter, we do not guarantee any outcome, and using a letter does not guarantee a fine, charge or claim will be cancelled, paid or succeed.</p>
    <p>You are responsible for reviewing your letter before sending it and for meeting any deadlines that apply to your appeal or claim. Payments are processed securely by Stripe. Because letters are generated and delivered instantly, sales are final once a letter is unlocked, except where required by law.</p>`;
  const privacy = `<h2>Privacy Policy</h2>
    <p>We take your privacy seriously and follow UK GDPR.</p>
    <p>The details you type into a letter (such as your name, address and vehicle registration) are processed in your browser to generate that letter. We do not sell your data. Card details are handled entirely by Stripe; AppealMate never sees or stores your card number.</p>
    <p>If you have any questions about your data, contact us through the site.</p>`;
  app.innerHTML = `<div class="wrap"><div class="back" onclick="location.hash=''">&larr; Home</div>
    <div class="panel fade-up">${which === 'terms' ? terms : privacy}</div></div>`;
}

// ---- boot ----
checkPaidRedirect();
route();
