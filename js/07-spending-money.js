/* ---------- financial analyst: one income base, four buckets ----------
   Base = the projected monthly income from Next month (regular income + the lowest of the last 3 months of other transfers; about 145 000 Ft in the demo).
   Four buckets, in that base: Must-pay (locked: the bills you lock, at their usual amounts) · Everyday essentials (whatever is left, so Other payments and the rounding are in here) ·
   Fun (the one number you choose: a share of the base, in steps of 5%) · Saving (what the rules move: payday rule + weekly transfer + round-ups, so it always equals the real rules).
   The four amounts add up to the base. splitView() is the only place that computes them: My split, the analyst sheet, Next month, the reward rule and the insight all read it.
   S.analyst.split = {must, ess, fun, save} (% of the base, whole numbers, sum 100). Only fun is a choice; must, ess and save are refreshed from the data by syncSplit().
   Saving is not stored as a choice: the payday rules (each goal's g.rules.pay.pct, % of each salary, added up: payPct()) are the setting, and Saving in the base follows from it.
   Use this month is computed from S.tx (card payments by category; Persely deposits count as Saving). Under 2 months of data there are no percentages, only amounts. */
const SPLIT_BUCKETS = [['must','Must-pay'], ['ess','Everyday essentials'], ['fun','Fun'], ['save','Saving']];
const BKT_COL = {must:PALETTE.blueT, ess:PALETTE.blue, fun:PALETTE.orange, save:PALETTE.green};   // the same four on every screen (the story uses lighter tints of the same hues on its green background)
// spending categories a card payment can have, and the bucket each one belongs to
const isCardTx = t => t.a < 0 && t.s === 'Card payment';
const bucketName = k => SPLIT_BUCKETS.find(b => b[0] === k)[1];
// splitView(st, {fun: draft Fun %, rule: draft payday %, forceRule: count the payday rule as on}) -> {B, about, n, rough, label, base, deficit, plan, by:{must,ess,fun,save:{amt,pct}}, rows:[{k,name,col,amt,pct}], funPct, p}
function splitView(st = S, o = {}){
  const pst = o.rule !== undefined ? {...st, _rulePct:o.rule} : st, p = project(pst, {rule:o.forceRule});
  const B = p.income.total || 1, n = p.months, rough = n < 2, must = p.mustPay, save = p.saving, about = Math.round(B / 1000) * 1000;
  const sugFun = Math.max(0, Math.min(60, Math.round(p.fun / B * 20) * 5)), sp = st.analyst && st.analyst.split;
  const funPct = o.fun !== undefined ? o.fun : (st.analyst && st.analyst.accepted && sp && sp.must !== undefined ? sp.fun : sugFun);
  let fun = rough ? p.fun : Math.round(B * funPct / 100), ess = B - must - save - fun;
  if(ess < 0){ ess = 0; fun = Math.max(0, B - must - save); }
  const mustP = Math.round(must / B * 100), saveP = Math.round(save / B * 100), funP = Math.round(fun / B * 100), essP = Math.max(0, 100 - mustP - saveP - funP);
  const by = {must:{amt:must, pct:mustP}, ess:{amt:ess, pct:essP}, fun:{amt:fun, pct:funP}, save:{amt:save, pct:saveP}};
  const base = rough ? `${p.confidence.label} · about ${ft(about)} a month in` : `Based on about ${ft(about)} a month in${n < 3 ? ` · ${n} months, still rough` : ''}`;
  return {B, about, n, rough, label:p.confidence.label, base, deficit:p.deficit, plan:p.plan, by, funPct:funP, p, ym:p.ym, income:p.income,
    rows:SPLIT_BUCKETS.map(([k, name]) => ({k, name, col:BKT_COL[k], amt:by[k].amt, pct:by[k].pct}))};
}
// the share as text: nothing but the amount while there is too little history
const bPct = (v, k) => v.rough ? '' : v.by[k].pct + '%';
// "7 500 Ft = 10% of your salary" (+ the weekly transfer and round-ups when they are on)
function saveNote(v){
  const pl = v.plan, bits = [pl.rule ? `${ft(pl.rule)} = ${pl.rulePct}% of your salary` : '', pl.weekly ? `${ft(pl.weekly)} weekly transfer` : '', pl.round ? `${ft(pl.round)} round-ups` : ''].filter(Boolean);
  return bits.length ? bits.join(' + ') : 'No saving rule is on, so this is what you usually move';
}
function syncSplit(){   // keep the stored split in line with the data: only Fun is a choice (state saved with the old 3-share split falls back to the suggestion)
  const sp = S.analyst && S.analyst.split; if(!sp) return;
  try{ const w = splitView(); sp.must = w.by.must.pct; sp.ess = w.by.ess.pct; sp.fun = w.by.fun.pct; sp.save = w.by.save.pct; }catch(e){}
}
// the suggested split: the projection with Fun rounded to 5%, Saving = the rules (the payday rule counts as on, because using the split turns it on)
function suggestSplit(){ const v = splitView(S, {fun:undefined, forceRule:true}), r = {}; v.rows.forEach(x => { r[x.k] = x.pct; }); r.view = v; return r; }
// budget of one bucket in forints (the reward rule and the insight compare this month's use with it)
const splitBudget = k => splitView().by[k].amt;
// the view every screen shows: the accepted split, or the suggestion until it is accepted (using it turns the payday rule on)
const curView = () => splitView(S, {forceRule:!S.analyst.accepted});
// what this month's transactions add up to per bucket
function splitUse(){
  const u = {ess:0, fun:0, save:0};
  S.tx.slice(0, Math.max(0, S.tx.length - (S.txMark || 0))).forEach(t => {
    if(t.parts){ u.ess += t.parts.ess || 0; u.fun += t.parts.fun || 0; return; }
    if(t.a < 0 && t.n === 'PERSELY DEPOSIT'){ u.save -= t.a; return; }
    if(isCardTx(t)){ const c = CATEGORY[classify(t)]; if(c && (c[1] === 'ess' || c[1] === 'fun')) u[c[1]] -= t.a; }
  });
  return u;
}
function daysLeftInMonth(){ return shownMonth().left; }   // the demo "today" (the 14th), the same count as the Home and Spending circles
// must-pay paid so far this month (for the first bar of My split)
const mustPaid = () => billsFirst().rows.reduce((a, r) => a + (r.s.st === 'paid' || r.s.st === 'less' ? r.s.paid : r.s.st === 'skipped' ? r.bill.exp : 0), 0);
function splitCard(){
  const a = S.analyst; if(!a.on) return '';
  const head = `<div class="sec" data-tour="split"><span>My split</span>${a.accepted ? `<a data-splitopen>Edit ${I('chev',16)}</a>` : ''}</div>`;
  if(!a.accepted) return `${head}<div class="card" style="padding:var(--sp-4)"><b class="u-fs-m">Choose your monthly split</b><div class="fine u-mt4-b12">The analyst suggests Must-pay, Everyday essentials, Fun and Saving from your last 3 months.</div><button class="btn" data-sheet="analyst">See the suggestion</button></div>`;
  syncSplit();
  const v = splitView(), use = splitUse(), left = daysLeftInMonth(), dl = left === null ? '' : left === 0 ? ' · last day' : ` · ${plural(left,'day')} left`, bf = bfNow(), paid = mustPaid();
  const rows = v.rows.map(({k, name, col, amt}) => { const used = k === 'must' ? paid : use[k], p = amt ? Math.round(used / amt * 100) : 0, over = k !== 'save' && k !== 'must' && p > 100, hold = k === 'fun' && bf.on, pc = bPct(v, k);
    return `<div class="u-p10v"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:var(--sp-2)"><b style="font-size:0.90625rem;display:flex;align-items:center;gap:var(--sp-2)"><span class="dotc" style="background:${col}"></span>${k === 'must' ? I('lock', 14) : ''}${name}${pc ? ' · ' + pc : ''}</b><span class="num" style="font-size:0.78125rem;white-space:nowrap;color:${over ? 'var(--orange-t)' : 'var(--muted-t)'}">${ft(used)} of ${ft(amt)}</span></div>
      <div class="prog" style="margin:var(--sp-2) 0 var(--sp-1)"><i style="width:${Math.min(100,p)}%;${over ? 'background:var(--orange)' : ''}"></i></div>
      <div class="k" style="font-size:0.78125rem">${hold ? `<b style="color:var(--orange-t)">Bills first: ${ft(bf.lateTotal)} late</b> · ${p}% used` : k === 'must' ? `${p}% paid · locked bills` : k === 'save' ? `${p}% moved to Persely · ${saveNote(v)}` : k === 'ess' ? `${p}% used · what is left after the other three` : `${p}% used${k === 'fun' ? dl : ''}`}${over ? ' · over your split' : ''}</div></div>`; }).join('');
  return `${head}<div class="card" style="padding:var(--sp-2) var(--sp-4) var(--sp-4)"><div class="fine" style="padding:var(--sp-2) 0 0"><b>${v.base}</b></div>${rows}
    ${NEW_PERSELY_IA ? '' : `<button class="li-safe" data-sheet="safe"><span>Safe to spend now</span><b class="num">${ft(safeToSpend().safe)}</b>${I('chev',16)}</button>`}
    <div class="fine" style="border-top:1px solid var(--line);padding-top:var(--sp-3)">${payOn() ? 'Your saving rules move the Saving amount to Persely.' : 'No payday rule is on, so Saving does not move by itself. Turn one on on a goal\'s page.'} Saving is the payday rule plus any weekly transfer and round-ups. Everyday essentials is what is left of your income.</div></div>`;
}
/* ---------- bills: screens, alerts and the Bills pocket (section 14, steps 6-9 and 12) ----------
   Everything here needs the analyst on. It tells, it never blocks: no card is declined and no money moves without a tap.
   State: S.bills (locks), S.billsConfirmed, S.billSkip {billId: ym} + S.billSkipWhy {billId: 'paid'|'notdue'},
   S.billsPocket {on, bal} (held outside the Junior balance), S.bfDone (Persi's "Bills paid" line), S.bfPush (day of the last bills push). */
const FAMILY_IN = FAMILY_AMT;   // the family transfer on the 1st (demo)
const FRIEND_IN_AMT = 3000, FRIEND_IN = [['FEKETE MÁRK', 'jegy'], ['KOVÁCS BENCE', 'mozi'], ['NAGY DÓRI', 'vacsora']];   // a small friend transfer on the 9th of each simulated month (demo)
const ordinal = n => { const s = ['th', 'st', 'nd', 'rd'], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
const NOBF = {on:false, total:0, count:0, rows:[], urgent:[], text:''};
const bfNow = () => billsFirst();   // bills stay on when the analyst is off (D10)
const pocketBal = () => S.billsPocket && S.billsPocket.on ? S.billsPocket.bal : 0;
const billById = id => (S.bills || []).find(b => b.id === id);
const GROUPN = {must:'Must-pay', flex:'Essentials', fun:'Fun', subs:'Subscriptions', save:'Saving', other:'Other', in:'Income'};
const catLabel = cat => { const c = CATEGORY[cat]; return c[2] === 'must' ? 'Must-pay' : c[1] ? bucketName(c[1]) : GROUPN[c[2]]; };
const monthOf = ym => MONTHN[+ym.slice(5) - 1];
const refBase = r => (r || '').replace(/\s*(január|február|március|április|május|június|július|augusztus|szeptember|október|november|december|january|february|march|april|may|june|july|august|september|october|december)\s*$/i, '');
// "Paid 2 Nov": the paid state is its own chip with the day the payment left the account
function billPaidOn(id){ const b = billById(id); if(!b) return ''; const now = billToday(); let last = null;
  S.tx.forEach(t => { if(t.a < 0 && ['card', 'debit', 'out'].includes(txType(t)) && payeeKey(t) === b.key){ const w = txWhen(t); if(w.ym === now.ym && (!last || w.day > last.day)) last = w; } });
  return last ? ` ${last.day} ${MONTHN[+now.ym.slice(5) - 1].slice(0, 3)}` : ''; }
function billLabel(s, id){ return s.st === 'skipped' ? ((S.billSkipWhy || {})[id] === 'paid' ? 'Already paid elsewhere' : 'Not due this month') : s.st === 'paid' ? 'Paid' + billPaidOn(id) : s.label; }
// the status chip: Paid, Due, Late, Skipped (and Paid less); billLabel keeps the long wording for the sheet and the sub line
const billChip = s => s.st === 'paid' ? 'Paid' : s.st === 'skipped' ? 'Skipped' : s.st === 'late' ? 'Late' : s.st === 'less' ? 'Paid less' : 'Due';
const billPill = s => s.st === 'paid' || s.st === 'skipped' ? 'ok' : s.st === 'late' || s.st === 'less' ? 'open' : '';
const mustTotal = () => mustBills().reduce((a, b) => a + b.exp, 0);
const pocketOffer = () => Math.max(0, billsFirst().total - pocketBal());   // "Move X Ft (unpaid) to Bills pocket": the bills still to pay this month (47 550 Ft in the demo), not the month total
// what skipping one bill does to Safe to spend this month (the confirm says it before anything changes)
function skipGain(id){ const a = safeToSpend().safe, had = S.billSkip[id]; S.billSkip[id] = billToday().ym; const z = safeToSpend().safe; if(had === undefined) delete S.billSkip[id]; else S.billSkip[id] = had; return z - a; }
// the payday sheet becomes "Bills first" when the analyst is on and a must-pay bill is still open (an automatic payday rule keeps moving by itself)
const paydayBills = () => billsFirst().count > 0 && !(payOn() && !S.payday.ask);
// pay one bill from the Bills pocket when it holds enough, else from the Junior account. Returns {amt, fromPocket} or {err}
const payeeAcct = key => { let h = 7; for(const c of key) h = (h * 31 + c.charCodeAt(0)) % 1000000007; const q = m => String(h * m % 100000000).padStart(8, '0'); return `1177${q(7919).slice(0, 4)}-${q(104729)}-${q(15485863)}`; };   // demo account number, the same every time for one payee
function payBill(id){
  const b = billById(id); if(!b) return {err:'Bill not found'};
  const amt = billStatus(b).left; if(amt <= 0) return {err:'Already paid'};
  const fromPocket = pocketBal() >= amt;
  if(!fromPocket && balanceOf() < amt) return {err:E_FUNDS};
  const last = S.tx.find(t => payeeKey(t) === b.key && t.a < 0);
  S.tx.unshift({...stamp(), d:'Today', n:b.key, s:'Transfer out', a:-amt, ic:last ? last.ic : 'wallet', ...(last && last.ref ? {ref:refBase(last.ref)} : {}), ...(fromPocket ? {note:'Paid from Bills pocket'} : {})});
  if(fromPocket) S.billsPocket.bal -= amt; else acc('junior').v -= amt;
  return {amt, fromPocket, name:b.name};
}
function pocketMove(x){   // Junior account -> Bills pocket (an own-account move: never spending, never income)
  if(x <= 0 || balanceOf() < x) return false;
  acc('junior').v -= x; S.billsPocket = {on:true, bal:pocketBal() + x};
  S.tx.unshift({...stamp(), d:'Today', n:'BILLS POCKET', s:'Between my accounts', a:-x, ic:'wallet', note:'Set aside for bills'}); return true;
}
function pocketBack(){
  const x = pocketBal(); if(x <= 0) return 0;
  acc('junior').v += x; S.billsPocket.bal = 0;
  S.tx.unshift({...stamp(), d:'Today', n:'BILLS POCKET', s:'Between my accounts', a:x, ic:'wallet', note:'Moved back'}); return x;
}
function billsDone(was){ const now = bfNow().on; if(was && !now) S.bfDone = true; else if(now) S.bfDone = false; return was && !now; }
// a card at the top of Home only (D13). Late bills: two actions, Pay now and All bills; the skips live in the bill sheet under More options. Nothing late but a bill due soon the balance cannot cover: an orange heads-up, no "Bills first".
const comingUp = bf => bf.soon.map(r => `${esc(r.bill.name)} ${ft(r.s.left)} on the ${ordinal(r.bill.day)}`).join(', ');
function bfCard(){
  const bf = bfNow(); if(!bf.on && !bf.warn) return '';
  if(!bf.on) return `<div class="card bfc"><div class="hrow"><span class="pill open">Coming up</span><span class="k">${plural(bf.soon.length, 'bill')}</span></div>
    <div class="u-tip-p"><b>${comingUp(bf)}: your balance won't cover it</b></div>
    <div class="hero-btns u-m0"><button class="btn w" data-go="bills">All bills</button></div></div>`;
  const r = bf.late[0], b = r.bill, many = bf.late.length > 1;
  const head = many ? `<details class="bfd"><summary><b>${bf.text}</b><span class="chev">${I('chev', 16)}</span></summary><div class="bfd-l">${bf.late.map(x => `<button class="bfd-r" data-paybill="${x.bill.id}"><span class="t"><b>${esc(x.bill.name)}</b><small>Due on the ${ordinal(x.bill.day)}</small></span><b class="num">${ft(x.s.left)}</b></button>`).join('')}</div></details>` : `<div class="u-tip-p"><b>${bf.text}</b></div>`;
  return `<div class="card bfc"><div class="hrow"><span class="pill open">Bills first</span><span class="k">${bf.late.length} late</span></div>
    ${head}${bf.soon.length ? `<div class="k bfu">Coming up: ${comingUp(bf)}</div>` : ''}
    <div class="hero-btns u-m0"><button class="btn" data-paybill="${b.id}">Pay now</button><button class="btn w" data-go="bills">All bills</button></div></div>`;
}
// Home, under the balance: one line with what is really free
// the one line about bills on the Home card: late, coming up, still to pay, or all paid
function billsLine(){
  const bf = bfNow();
  return bf.on ? `<span style="color:var(--orange-t);font-weight:600">${plural(bf.late.length, 'bill')} late: ${ft(bf.lateTotal)}</span>` : bf.soon.length ? `Coming up: ${comingUp(bf)}` : bf.count ? `${plural(bf.count, 'bill')} still to pay: ${ft(bf.total)}` : 'Must-pay bills are paid';
}
// Home (analyst on): the one card that opens Spending analysis. New layout: Safe to spend and the state of the bills. Old layout: Safe to spend opens its sheet.
function safeRow(){
  const s = safeToSpend();
  if(NEW_PERSELY_IA) return `<button class="safebtn" data-go="mymoney" data-tour="mymoney"><span class="t"><b>Safe to spend</b><small class="sh">What you can spend until payday</small><small>${billsLine()}</small></span><b class="num" style="color:${s.safe < 0 ? 'var(--orange-t)' : 'var(--ink)'}">${ft(s.safe)}</b><span class="chev">${I('chev', 18)}</span></button>`;
  return `<button class="safebtn" data-sheet="safe"><span class="t"><b>Safe to spend</b><small>${s.pocket ? `After bills, your saving rule and groceries. Bills pocket ${ft(s.pocket)} is apart` : 'After bills, your saving rule and groceries'}</small></span><b class="num" style="color:${s.safe < 0 ? 'var(--orange-t)' : 'var(--ink)'}">${ft(s.safe)}</b><span class="chev">${I('chev', 18)}</span></button>`;
}
// Persely tab, under My split: Next month, Must-pay bills, Bills pocket
function billsBlock(){
  if(!S.analyst.on) return '';
  const bf = billsFirst(), sv = curView(), n = mustBills().length, found = (S.bills || []).filter(b => !b.ignored).length;
  const row = (ic, t, sub, go) => `<button class="li" data-go="${go}"><span class="ic">${I(ic)}</span><span class="t"><b>${t}</b><small>${sub}</small></span><span class="chev">${I('chev', 20)}</span></button>`;
  return `<div class="sec"><span>Bills and next month</span></div>
  ${S.billsConfirmed ? '' : `<div class="card" style="padding:var(--sp-4)"><b class="u-fs-m">We found ${found} regular payments</b><div class="fine u-mt4-b12">Lock the ones you must pay. Housing, utilities, the pass and the phone are ticked already.</div><button class="btn" data-go="bills">Confirm my bills</button></div>`}
  <div class="card lst">
    ${row('chart', 'Next month', sv.rough ? `About ${ft(sv.B)} in · a rough guess` : `About ${ft(sv.B)} in · must-pay ${sv.by.must.pct}% · Fun ${sv.by.fun.pct}%`, 'nextmonth')}
    ${row('list', 'Must-pay bills', bf.on ? `<span style="color:var(--orange-t);font-weight:600">${bf.text}</span>` : `${plural(n, 'bill')} · ${ft(mustTotal())} a month`, 'bills')}
    ${row('wallet', 'Bills pocket', S.billsPocket.on && S.billsPocket.bal > 0 ? `${ft(S.billsPocket.bal)} set aside · no goal, no interest` : 'Set the bill money aside on payday', 'bills')}
  </div>`;
}
// Persely tab: the one row to Spending analysis (analyst on), or an offer to turn the analyst on (off)
function analysisRow(){
  if(!NEW_PERSELY_IA) return '';
  const chev = `<span class="chev">${I('chev', 20)}</span>`, row = (go, sub) => `<button class="row" ${go}><span class="ic">${I('chart')}</span><span class="t"><b>Spending</b><small>${sub}</small></span>${chev}</button>`;
  const sf = safeToSpend(), bf = bfNow();
  if(!S.analyst.on) return row('data-go="mymoney"', `Safe to spend ${ft(sf.safe)} · Turn on the analyst for your plan`);
  if(bf.on) return row('data-go="mymoney"', `Fun on hold · Safe to spend ${ft(sf.safe)}`);
  const v = splitView(), plan = v.by.ess.amt + v.by.fun.amt;
  return row('data-go="mymoney"', `Card spending ${ft(cardSpending())} of ${ft(plan)} planned`);
}
// Persely tab rows after the habits: Perks (Discounts and My rewards) and Your year (only after 12 months, C4.1)
const perksRow = () => `<button class="row" data-go="perks"><span class="ic">${I('gift')}</span><span class="t"><b>Perks</b><small>${SIMPLE_PERSELY ? plural(DISC.length - S.disc.activated.length, 'deal') + ' to turn on' : `${DISC.length - S.disc.activated.length} offers waiting for activation · ${plural(S.rewards.length, 'reward')}`}</small></span><span class="chev">${I('chev', 20)}</span></button>`;
const yearRow = () => (S.months || 0) >= 12 ? `<button class="row" data-go="year"><span class="ic">${I('star')}</span><span class="t"><b>Your year</b><small>12 months in Persely</small></span><span class="chev">${I('chev', 20)}</span></button>` : '';
/* The ONE Spending page (C2, D3), in this order: 1 Safe to spend, 2 month circle (Card spending, Total out, days left, month end projection),
   3 Bills row, 4 My plan (categories expandable, one Edit), 5 Persi's tips, 6 Next month row, 7 Latest card payments, 8 footer with the analyst switch.
   Analyst off: Safe to spend (simple) and bills stay; only the plan and categories are hidden ("Turn on to see your plan"). */
function safeCard(){
  const s = safeToSpend();
  return `<button class="safebtn safebig" data-sheet="safe" data-tour="mymoney" aria-label="Safe to spend ${ft(s.safe)}. A guide, not a limit. Opens how it is worked out"><span class="t"><small>Safe to spend</small><b class="num" style="color:${s.safe < 0 ? 'var(--orange-t)' : 'var(--ink)'}">${ft(s.safe)}</b><small>A guide, not a limit${s.simple ? ' · simpler estimate' : ''}</small></span><span class="chev">${I('chev', 18)}</span></button>`;
}
function billsRow(){
  const found = (S.bills || []).filter(b => !b.ignored).length, sub = !S.billsConfirmed && found ? `We found ${plural(found, 'regular payment')} · Confirm my bills` : billsLine();
  return `<div class="prow"><button class="row" data-go="bills" data-tour="billsrow"><span class="ic">${I('list')}</span><span class="t"><b>Bills</b><small>${sub}</small></span><span class="chev">${I('chev', 20)}</span></button></div>`;
}
function nextMonthRow(){
  const v = curView();
  return `<div class="prow"><button class="row" data-go="nextmonth"><span class="ic">${I('chart')}</span><span class="t"><b>Next month</b><small>${v.rough ? `About ${ft(v.B)} in · a rough guess` : `About ${ft(v.about)} in, spread like My plan`}</small></span><span class="chev">${I('chev', 20)}</span></button></div>`;
}
function analystFoot(){
  const on = S.analyst.on;
  return `<div class="anfoot" data-tour="anfoot"><span>Financial analyst is ${on ? 'on' : 'off'}</span><span aria-hidden="true">·</span>${on ? '<button class="link lnk44" data-anask>Turn off</button>' : '<button class="link lnk44" data-anon>Turn on</button>'}<span aria-hidden="true">·</span><button class="link lnk44" data-sheet="anread">What it reads</button></div>`;
}
function myMoneyHTML(){
  const an = S.analyst.on, mo = shownMonth(), enough = project().months >= 1, m = an && enough ? planModel() : null;
  // Phase 6 (plan 2h): the late-bill card (Pay now / All bills) and the analyst's one-line first-run notice left Home for the top of this page
  return `${ohOn() ? bfCard() + spAnLine() : ''}${safeCard()}
  ${analysisGauge(m)}
  ${billsRow()}
  ${!an ? `<div class="sec"><span>My plan</span></div><div class="card" style="padding:var(--sp-4)" data-tour="plan"><b class="u-fs-m">Turn on to see your plan</b><div class="fine u-mt4-b12">Categories and your monthly plan need the Financial analyst. Safe to spend and bills stay on.</div><button class="btn" data-anon>Turn on</button></div>`
    : !enough ? `<div class="sec"><span>My plan</span></div><div class="card" style="padding:var(--sp-4)" data-tour="plan"><b class="u-fs-m">We need a few weeks of payments to suggest a plan.</b><div class="fine u-mt4-b12">Safe to spend and your bills already work.</div></div>`
    : planHTML(m) + planTipsHTML(m)}
  ${an && enough ? nextMonthRow() : ''}
  ${recentCards()}
  ${analystFoot()}`;
}
// the same screen text for pages that need the analyst
const needAnalyst = what => `<div class="card" style="padding:var(--sp-4);margin-top:var(--sp-2)"><b class="u-fs-m">${what} needs the financial analyst</b><div class="fine u-mt4-b12">It is optional and off right now. Turn it on to see your bills and next month.</div><button class="btn" data-sheet="analyst">See what it measures</button></div>`;
function billRow(r){
  const b = r.bill, s = r.s, sub = `${ft(b.exp)} · due on the ${ordinal(b.day)}${s.paid && s.st !== 'skipped' ? ` · paid ${ft(s.paid)}${s.st === 'paid' && billPaidOn(b.id) ? ' on ' + billPaidOn(b.id).trim().replace(/ \w+$/, ' ' + monthOf(billToday().ym)) : ''}` : ''}${s.st === 'skipped' ? ` · ${billLabel(s, b.id)}` : ''}`;
  return `<div class="li sw"><button class="li-main" data-billopen="${b.id}"><span class="t"><b>${esc(b.name)}</b><small>${sub}</small><span class="pill ${billPill(s)}" data-chip="${billChip(s)}" style="display:inline-block;margin-top:var(--sp-1)">${billChip(s)}</span></span></button>${swBtn(b.locked, `data-lockbill="${b.id}"`, `Count ${esc(b.name)} as must-pay`)}</div>`;
}
function nextMonthHTML(){
  if(!S.analyst.on) return needAnalyst('Next month');
  const v = curView(), p = v.p, mn = monthOf(p.ym), pctOf4 = r => v.rough ? '' : r.pct + '%';
  const sent = v.rows.map(r => `${r.name.toLowerCase()} ${v.rough ? ft(r.amt) : r.pct + '%'}`).join(' · ');
  const spk = h => { const m = Math.max(1, ...h); return `<span class="spk" aria-hidden="true">${h.map(x => `<i style="height:${Math.max(8, Math.round(x / m * 100))}%"></i>`).join('')}</span>`; };
  return `<div class="card" style="margin-top:var(--sp-2)"><div class="k">${mn}</div>
    <div style="font-size:1.3125rem;font-weight:700;line-height:1.25;margin:var(--sp-1) 0 var(--sp-1)">${v.rough ? `About ${ft(v.about)} in` : `Based on about ${ft(v.about)} a month in`}</div>
    ${p.deficit ? `<div style="color:var(--orange-t);font-weight:600;font-size:var(--fs-s)">Spending is above income by ${ft(p.deficit)}.</div>` : `<div class="k">${v.rough || v.n < 3 ? v.label + ' · ' : ''}${ft(p.income.recurring)} regular${p.income.irregular ? ` + ${ft(p.income.irregular)} from other transfers (the lowest of your last ${p.months} months)` : ''}</div>`}
    <div class="pbar" role="img" aria-label="${esc(sent)}">${v.rows.filter(r => r.amt > 0).map(r => `<i style="width:${r.amt / v.B * 100}%;background:${r.col}"></i>`).join('')}</div>
    <div class="fine">${mn}: ${sent}.</div></div>
  <div class="card lst">${v.rows.map(r => `<div class="li"><span class="dotc" style="background:${r.col}"></span><span class="t"><b>${r.k === 'must' ? I('lock', 14) + ' ' : ''}${r.name}</b>${r.k === 'save' ? `<small>${saveNote(v)}</small>` : r.k === 'must' ? '<small>locked bills, at their usual amounts</small>' : r.k === 'ess' ? '<small>what is left, with other payments</small>' : ''}</span><b class="num">${pctOf4(r)}</b><b class="num" style="min-width:86px;text-align:right">${ft(r.amt)}</b></div>`).join('')}</div>
  <div class="sec"><span>Categories</span></div>
  <div class="card lst"><button class="li" data-go="bills"><span class="t"><b>Must-pay bills (${mustBills().length})</b><small>Rent, utilities, pass, phone · at their usual amounts</small></span><b class="num">${ft(p.mustPay)}</b><span class="chev">${I('chev', 18)}</span></button>
    ${p.cats.filter(c => c.amt > 0 && c.group !== 'save').map(c => `<div class="li"><span class="t"><b>${c.label}</b><small>${GROUPN[c.group]} · last ${c.hist.length} months</small></span>${spk(c.hist)}<b class="num" style="min-width:78px;text-align:right">${ft(c.amt)}</b></div>`).join('')}</div>
  ${p.oneOffs.length ? `<div class="sec"><span>Left out: one-off payments</span></div><div class="card lst">${p.oneOffs.map(o => `<div class="li"><span class="t"><b>${esc(titleCase(o.name))}</b><small>${o.label} · ${monthOf(o.ym)} · more than 3 times the usual, so it is not repeated</small></span><b class="num">${ft(o.amt)}</b></div>`).join('')}</div>` : ''}
  <button class="btn w" data-planback>Back to My plan</button>
  <div class="fine u-note-b14">A guess from your last ${p.months} months: recent months count more. Income only counts what comes regularly, plus the lowest of the others. These are the same four buckets as My split: Fun is your choice, Saving is your saving rules, Everyday essentials is what is left. Tips only: nothing is blocked and nothing moves by itself.</div>`;
}
function billsHTML(){
  const bf = billsFirst(), rows = bf.rows, sf = safeToSpend(), paid = rows.reduce((a, r) => a + (r.s.st === 'paid' || r.s.st === 'less' ? r.s.paid : 0), 0), monthTotal = rows.filter(r => r.s.st !== 'skipped').reduce((a, r) => a + r.bill.exp, 0);   // a skipped bill is not due this month
  const others = (S.bills || []).filter(b => !b.locked && !b.ignored).map(b => ({bill:b, s:billStatus(b)}));
  const offer = pocketOffer(), pk = S.billsPocket;
  return `${S.billsConfirmed ? '' : `<div class="card" style="margin-top:var(--sp-2);padding:var(--sp-4)"><b class="u-fs-m">We found ${(S.bills || []).filter(b => !b.ignored).length} regular payments</b><div class="fine u-mt4-b12">Lock the ones you must pay. Housing, utilities, the pass and the phone are ticked already. You can change any of them later.</div><button class="btn" data-confirmbills>Confirm my bills</button></div>`}
  <div class="card" style="${S.billsConfirmed ? 'margin-top:var(--sp-2)' : ''}"><div class="k">This month's must-pay bills</div>
    <div class="u-fs-m num" style="font-weight:700;margin:var(--sp-1) 0 var(--sp-2)" id="billsum">${ft(monthTotal)} this month · ${ft(paid)} paid · ${bf.total ? `${ft(bf.total)} still to pay` : 'nothing left to pay'}</div>
    <button class="link lnk44" data-sheet="safe" style="margin-top:var(--sp-1)">Safe to spend: ${ft(sf.safe)} ${I('chev', 16)}</button></div>
  <div class="sec"><span>Must-pay bills</span></div>
  <div class="card lst">${rows.length ? `<div class="bl-h" aria-hidden="true"><span>Must-pay</span></div>${rows.map(billRow).join('')}` : '<div class="li"><span class="t"><small>No bill is locked yet. Lock a regular payment below.</small></span></div>'}</div>
  ${others.length ? `<div class="sec"><span>Other regular payments</span></div><div class="card lst"><div class="bl-h" aria-hidden="true"><span>Must-pay</span></div>${others.map(billRow).join('')}</div><div class="fine u-note-b12">Subscriptions are not locked: they count as Fun. Still using them?</div>` : ''}
  <div class="sec"><span>Bills pocket</span></div>
  <div class="card"><div class="u-rowc"><span class="gic">${I('wallet', 22)}</span><span class="u-fx1"><b class="u-fs-m">${pk.on && pk.bal > 0 ? ft(pk.bal) : 'Not in use'}</b><div class="k">A pot for bills only. No goal, no interest. Each bill is paid from it while it has money. Safe to spend does not count it.</div></span></div>
    ${offer > 0 ? `<button class="btn w" data-pocketmove="${offer}" style="margin-top:var(--sp-3)">Move ${ft(offer)} (unpaid) to Bills pocket</button>` : ''}
    ${pk.on && pk.bal > 0 ? `<button class="btn ghost" data-pocketback>Move ${ft(pk.bal)} back to Junior account</button>` : ''}</div>
  <div class="fine u-note-b14">Bills first only tells you. No card is declined and no money moves without your tap. Only your own OTP account is seen: other banks and cash show as unknown.</div>`;
}
const SHEETS_BILLS = {
  // one bill: status, last payment, the three actions, the lock
  bill:() => { const b = billById(S._bill); if(!b) return ''; const s = billStatus(b), act = b.locked && s.st !== 'paid' && s.st !== 'skipped', last = S.tx.find(t => t.a < 0 && payeeKey(t) === b.key);
    return `<h2>${esc(b.name)}</h2><div class="u-sheet-sub"><span class="pill ${billPill(s)}">${billLabel(s, b.id)}</span></div>
    <div class="card lst"><div class="li"><span class="t"><b>Usual amount</b></span><b class="num">${ft(b.exp)}</b></div><div class="li"><span class="t"><b>Due</b></span><b class="num">on the ${ordinal(b.day)}</b></div>
      <div class="li"><span class="t"><b>Seen</b></span><b class="num">${b.months} months in a row</b></div>${last ? `<div class="li"><span class="t"><b>Last payment</b></span><b class="num">${ft(-last.a)}</b></div>` : ''}</div>
    <button class="opt slim ${b.locked ? 'on' : ''}" data-lockbill="${b.id}" data-resheet="bill"><span class="t"><b class="u-fs-14">This is a must-pay bill</b><small>Bills first watches it and Safe to spend leaves room for it</small></span><span class="tg ${b.locked ? 'on' : ''}"></span></button>
    ${act ? `<button class="btn" data-paybill="${b.id}">Pay now</button>
    <details class="bfd bfmore"><summary><b>More options</b><span class="chev">${I('chev', 16)}</span></summary><div class="bfd-l"><button class="bfd-r" data-billskipask="${b.id}:paid"><span class="t"><b>Already paid elsewhere</b><small>Leaves this month's list. Nothing is sent</small></span><span class="chev">${I('chev', 16)}</span></button><button class="bfd-r" data-billskipask="${b.id}:notdue"><span class="t"><b>Not due this month</b><small>Leaves this month's list. Nothing is sent</small></span><span class="chev">${I('chev', 16)}</span></button></div></details>` : ''}
    ${s.st === 'skipped' ? `<button class="btn w" data-billunskip="${b.id}">It is due this month</button>` : ''}
    <button class="btn ghost" data-closesheet>Close</button>`; },
  // skip confirm: says what skipping does to Safe to spend before anything changes; Confirm skips (with the Undo chip), Back returns to the bill
  billskip:() => { const b = billById(S._bill), why = S._why; if(!b) return ''; const g = skipGain(b.id), mn = monthOf(billToday().ym), q = why === 'paid' ? 'Already paid elsewhere?' : 'Not due this month?';
    return `<h2>${esc(b.name)}: ${q}</h2><div class="fine u-sheet-sub">${why === 'paid' ? `You paid it outside this account.` : `It does not need paying in ${mn}.`} It leaves your must-pay list for ${mn}. Nothing is sent.</div>
    <div class="cfm" role="group" aria-label="Review"><p>${g > 0 ? `Safe to spend goes up by ${ft(g)} this month` : 'Safe to spend stays the same this month'}</p></div>
    <button class="btn" data-billskip="${b.id}:${why}">Confirm</button><button class="btn ghost" data-billopen="${b.id}">Back</button>`; },
  // Pay now: who gets the money (name and account), reference, where it comes from and the amount; nothing is sent until the tap
  paybill:() => { const b = billById(S._bill); if(!b) return ''; const s = billStatus(b), pk = pocketBal() >= s.left, last = S.tx.find(t => t.a < 0 && payeeKey(t) === b.key), ref = last && last.ref ? refBase(last.ref) : b.name;
    return `<h2>Pay ${esc(b.name)}</h2><div class="fine u-sheet-sub">Nothing is sent until you tap Pay</div>
    <div class="card lst"><div class="li"><span class="t"><b>To</b><small>${esc(b.key)} · ${payeeAcct(b.key)}</small></span></div><div class="li"><span class="t"><b>Reference</b><small>${esc(ref)}</small></span></div>
      <div class="li"><span class="t"><b>From</b><small>${pk ? `Bills pocket · ${ft(pocketBal())}` : `Junior account · ${ft(balanceOf())}`}</small></span></div>
      <div class="li"><span class="t"><b>Amount</b></span><b class="num">${ft(s.left)}</b></div></div>
    <div id="cfm"></div>
    <button class="btn pbtn" data-dopay="${b.id}">Pay ${ft(s.left)}</button><button class="btn ghost" data-closesheet>Not now</button>`; },
  safe:() => { const s = safeToSpend(), bf = billsFirst(), row = (l, v, sub) => `<div class="li"><span class="t"><b>${l}</b>${sub ? `<small>${sub}</small>` : ''}</span><b class="num">${v}</b></div>`;
    return `<h2>Safe to spend</h2><div style="text-align:center;margin:-6px 0 var(--sp-3)"><span class="num" style="font-size:2.25rem;font-weight:700;line-height:1;color:${s.safe < 0 ? 'var(--orange-t)' : 'var(--ink)'}">${ft(s.safe)}</span></div>
    <div class="card lst">${row('Junior account', ft(s.balance))}${row('Bills still to pay', '− ' + ft(s.unpaidBills), s.pocket ? `${ft(bf.total)} to pay, ${ft(Math.min(bf.total, s.pocket))} covered by the Bills pocket` : bf.count ? plural(bf.count, 'bill') : 'All paid')}
      ${s.simple ? '' : `${row('Saving rule to move', '− ' + ft(s.savingRule), payOn() ? `Your payday rules, ${payPct()}% of this month's salary` : 'No payday rule is on')}${row('Groceries kept free', '− ' + ft(s.groceries), 'The lowest of your last 3 months')}`}</div>
    ${s.simple ? `<div class="fine u-note-b12">A simpler estimate: your balance minus the direct debits still to come. Turn the Financial analyst on for a closer figure that also leaves room for your saving rule and groceries.</div><button class="link lnk44" data-anon>Turn on the Financial analyst</button>` : ''}
    ${s.pocket ? `<div class="fine u-note-b12">Bills pocket: ${ft(s.pocket)}. It is held apart for bills, so it is not part of the balance above.</div>` : ''}
    ${bf.on ? `<div class="fine u-note-b12" id="latewhy">${bf.late.length === 1 ? esc(bf.late[0].bill.name) + ' is late' : bf.late.length + ' bills are late'}, but Safe to spend does not change: late or not, an unpaid bill was already taken off.</div>` : ''}
    <div class="fine u-note-b14">A guide, not a limit. No card is declined and no money is held without your tap.</div>
    <button class="btn" data-go="bills">Must-pay bills</button><button class="btn ghost" data-closesheet>Close</button>`; },
  // one transaction: category, payee, recurring badge, must-pay switch, change category
  txd:() => { const t = S.tx[S._txi]; if(!t) return ''; const ty = txType(t), cat = classify(t), w = txWhen(t), b = ty === 'in' ? null : (S.bills || []).find(x => x.key === payeeKey(t) && !x.ignored);
    const inc = ty === 'in' ? detectRecurring().income.find(i => i.key === payeeKey(t)) : null, rec = b || inc, canCat = !t.parts && ['card', 'refund', 'out', 'debit', 'cash', 'topup'].includes(ty);
    const li = (l, v) => `<div class="li"><span class="t"><b>${l}</b></span><span style="text-align:right;font-size:var(--fs-s)">${v}</span></div>`;
    const isP = txIsPers(t), pers = isP ? S.goals.find(g => g.name === t.note) : null, added = t.a < 0, gn = t.note || 'Persely', dateFull = fDate(`${w.ym}-${String(w.day).padStart(2, '0')}`);
    return `<h2>Payment</h2><div class="u-sheet-sub"><b style="text-transform:uppercase;font-size:var(--fs-s)">${esc(t.n)}</b> <span class="num k">${sft(t.a)}</span></div>
    ${rec ? `<div class="u-tc" style="margin:-4px 0 var(--sp-3)"><span class="pill ok">Repeats monthly · about ${ft(rec.exp)} on the ${ordinal(rec.day)}</span></div>` : ''}
    <div class="card lst">${txBill(t) ? li('Your label', esc(txBill(t).name)) + li('Paid to', esc(t.n)) : ''}${li('Date', dateFull)}${li('Type', t.s)}${li('Amount', sft(t.a))}${t.ref ? li('Reference', esc(t.ref)) : ''}${t.parts ? li('Split', `Essentials ${ft(t.parts.ess)} · Fun ${ft(t.parts.fun)}`) : li('Category', ty === 'in' ? 'Income' : ty === 'own' ? 'Saving: not spending' : `${CATEGORY[cat][0]} · ${catLabel(cat)}`)}</div>
    ${isP ? `${pers ? `<button class="card lst" data-goal="${pers.id}" style="width:100%;text-align:left"><span class="li"><span class="t"><b>${added ? 'Added to' : 'Withdrawn from'} ${esc(pers.name)}</b><small>Open the goal</small></span><span class="chev">${I('chev', 18)}</span></span></button>` : `<div class="card lst"><div class="li"><span class="t"><b>${added ? 'Added to' : 'Withdrawn from'} ${esc(gn)}</b></span></div></div>`}
    <div class="fine u-note-b12" id="txsign">${added ? `Here it is ${sft(t.a)} because the money left your Junior account. On the goal page it is +${ft(-t.a)} because it went into the goal.` : `Here it is ${sft(t.a)} because the money came back to your Junior account. On the goal page it is \u2212${ft(t.a)} because it left the goal.`}</div>` : ''}
    ${b ? `<button class="opt slim ${b.locked ? 'on' : ''}" data-lockbill="${b.id}" data-resheet="txd"><span class="t"><b class="u-fs-14">This is a must-pay bill</b><small>Bills first watches it</small></span><span class="tg ${b.locked ? 'on' : ''}"></span></button>` : ''}
    ${ty === 'cash' || ty === 'topup' ? `<div class="fine u-note-b12">${ty === 'cash' ? 'Cash is unknown: the app cannot see what you buy with it.' : 'Money moved to another app is unknown, so it is shown apart.'}</div>` : ''}
    ${canCat ? `<button class="btn" data-txcat2>Change category</button>` : ''}<button class="btn ghost" data-closesheet>Close</button>`; }
};
/* ---------- the monthly plan on the Monthly spending page (Kriszti's idea): one page with the split by category, progress, score and tips ----------
   Built on the analyst's split, so every screen shows the same numbers: Must-pay, Everyday essentials, Fun and Saving come from splitView();
   inside Everyday essentials and Fun, each category gets the share it had in the August-October history. Investing is the part of Saving
   the student plans to invest (S.analyst.invest, set in the split editor); the rest is Persely. A plan, not a limit: nothing is blocked. */
function planModel(){
  syncSplit();
  const v = splitView(), mo = shownMonth(), sp = catSpend(mo.ym), use = splitUse(), inv = Math.min(S.analyst.invest || 0, v.by.save.amt);
  const cats = b => { const pl = spreadCats(v.by[b].amt, b), keys = [...new Set([...Object.keys(pl), ...Object.keys(sp).filter(c => (CATEGORY[c] && CATEGORY[c][1] === b) || c === 'mix_' + b)])];
    return keys.map(c => ({c, name:SPEND_SHORT[c] || CATEGORY[c][0], plan:pl[c] || 0, spent:sp[c] || 0, col:catCol(c)})).sort((x, y) => y.plan - x.plan); };   // the same colour per category as the circle
  const groups = [
    {k:'must', name:'Must-pay bills', plan:v.by.must.amt, spent:mustPaid(), rows:[], note:'paid'},
    {k:'ess', name:'Everyday essentials', plan:v.by.ess.amt, spent:0, rows:cats('ess'), note:'used'},
    {k:'fun', name:'Fun', plan:v.by.fun.amt, spent:0, rows:cats('fun'), note:'used'},
    {k:'save', name:'Saving', plan:v.by.save.amt, spent:use.save, note:'saved', rows:[{c:'persely', name:'Persely', plan:v.by.save.amt - inv, spent:use.save, col:BKT_COL.save}].concat(inv ? [{c:'invest', name:'Investing', plan:inv, spent:null, col:PALETTE.cViolet}] : [])}
  ];
  groups.forEach(g => { if(g.k === 'ess' || g.k === 'fun') g.spent = g.rows.reduce((a, r) => a + r.spent, 0); });
  return {v, mo, groups, inv};
}
function planTips(m){
  const tips = [], pace = m.mo.today / m.mo.last, rows = m.groups.filter(g => g.k === 'ess' || g.k === 'fun').flatMap(g => g.rows).filter(r => r.plan > 0);
  const over = rows.filter(r => r.spent > r.plan).sort((a, b) => (b.spent - b.plan) - (a.spent - a.plan))[0];
  if(over) tips.push(`${over.name} is ${ft(over.spent - over.plan)} over its share this month. Going easy there for ${plural(m.mo.left, 'day')} keeps the rest of the plan on track.`);
  const fast = rows.filter(r => r.spent <= r.plan && r.spent / r.plan > pace + .25 && r.spent / r.plan >= .6).sort((a, b) => b.spent / b.plan - a.spent / a.plan)[0];
  if(fast) tips.push(`${fast.name} is at ${Math.round(fast.spent / fast.plan * 100)}% with ${plural(m.mo.left, 'day')} left: ${ft(fast.plan - fast.spent)} of its share remains.`);
  const t = tipOf();
  if(t && t.kind === 'tip') tips.push(`Move 10% of ${t.label} (${ft(t.ten)}) to ${esc(t.g.name)} each month${t.wk >= 1 ? ` and get there ${plural(t.wk, 'week')} sooner` : ''}.`);
  else if(t && t.kind === 'bill') tips.push(`A must-pay bill is late (${ft(t.total)}). Pay it first: bills come before saving.`);
  else if(t && t.kind === 'short') tips.push(`More went out than came in this month (${ft(t.over)}). Saving tips wait until that is fixed.`);
  if(!tips.length) tips.push('Everything is within your plan so far.');
  return tips.slice(0, 3);
}
// the plan card on Spending analysis: the four groups with their categories. The circle above it replaces the old donut, and the score stays in Your habits
function planHTML(m){
  const mo = m.mo;
  const bar = (spent, plan, col, k) => { const p = plan ? Math.min(100, spent / plan * 100) : 0, over = k !== 'save' && spent > plan; return `<div class="mp-bar" aria-hidden="true"><i style="width:${p}%;background:${over ? 'var(--orange)' : col}"></i></div>`; };
  const rowOf = (r, g) => { const go = SPEND_CATS.includes(r.c) || r.c === 'persely', tg = go ? 'button' : 'div'; return `<${tg} class="mp-r" ${go ? `data-fcat="${r.c}" aria-label="${esc(r.name)}. See these payments"` : ''}><span style="display:flex;align-items:center;gap:var(--sp-2)"><span class="dotc" style="background:${r.col};width:9px;height:9px"></span>${r.name}</span><span class="num">${r.spent === null ? `${ft(r.plan)} <small>planned, not moved</small>` : `${ft(r.spent)} <small>of ${ft(r.plan)}</small>`}${go ? ` <span class="chev" aria-hidden="true">${I('chev', 14)}</span>` : ''}</span></${tg}>${r.spent === null ? '' : bar(r.spent, r.plan, r.col, g.k)}`; };
  // one block, the four groups once. Saving is shown as an amount a month (no percentage). Groups with categories open and close.
  const head = g => `<b><span class="dotc" style="background:${BKT_COL[g.k]}"></span>${g.k === 'must' ? I('lock', 14) : ''}${g.name}</b><span class="num">${g.k === 'save' ? `${ft(g.plan)} a month` : `${ft(g.spent)} ${g.note} of ${ft(g.plan)}`}</span>`;
  const grp = g => g.rows.length
    ? `<details class="mp-d"><summary class="mp-g">${head(g)}<span class="chev" aria-hidden="true">${I('chev', 16)}</span></summary>${g.k === 'save' ? `<div class="fine mp-n">${ft(g.spent)} moved to Persely so far this month</div>` : ''}${g.rows.map(r => rowOf(r, g)).join('')}</details>${g.k === 'save' ? '' : bar(g.spent, g.plan, BKT_COL[g.k], g.k)}`
    : `<div class="mp-g">${head(g)}</div>${bar(g.spent, g.plan, BKT_COL[g.k], g.k)}`;
  const v = curView(), few = v.rough || v.n < 3, all = m.groups.reduce((a, g) => a + g.plan, 0);
  // the stacked bar: how the month is split between the four groups, by planned amount
  const stack = all ? `<div class="pstack" role="img" aria-label="${esc('My plan: ' + m.groups.map(g => `${g.name} ${ft(g.plan)}`).join(', '))}">${m.groups.filter(g => g.plan > 0).map(g => `<i style="width:${g.plan / all * 100}%;background:${BKT_COL[g.k]}"></i>`).join('')}</div><div class="pstack-k num">${ft(all)} planned for ${mo.name}</div>` : '';
  return `<div class="sec" data-tour="plan"><span>My plan for ${mo.name}</span><a class="lnk44" data-plangear>Edit ${I('chev',16)}</a></div>
  <div class="card mp-card">
    ${stack}
    ${m.groups.map(grp).join('')}
    ${few ? `<div class="fine mp-fine">${v.label}</div>` : ''}
    <div class="fine mp-fine"><b>A plan, not a limit.</b> Nothing is blocked and no money moves by itself.</div>
  </div>`;
}
// Persi's tips for the month (only when there is something to say)
function planTipsHTML(m){
  const tips = planTips(m);
  if(tips.length === 1 && /^Everything is within/.test(tips[0]) && !sumVals(catSpend(m.mo.ym))) return '';
  return `<div class="sec"><span>Persi's tips for ${m.mo.name}</span></div>
  <div class="card ptips"><span class="ptips-p" aria-hidden="true">${pigSvg('happy', 40)}</span>${tips.length > 1 ? `<ul>${tips.map(t => `<li>${t}</li>`).join('')}</ul>` : `<p>${tips[0]}</p>`}</div>`;
}
// the Spending circle, drawn like the Home gauge (270 degrees, round caps, grey track, soft core). The core is Card spending; Total out and the days left are under it, then the month end projection.
// With a plan: Everyday essentials spent, then Fun spent, over what the plan has for both. Without one: card spending against the usual month, as Home.
// Spending: the same category circle as Home, larger (catRing), then the month end card and "Where it went" (the legend as rows with share bars).
// The plan line: with a plan, Everyday essentials and Fun spent against what the plan has for both. Without one: the usual month, as Home.
function analysisGauge(m){
  const mo = shownMonth(), sp = catSpend(mo.ym), spent = sumVals(sp);
  let line = '', over = false;
  if(m){
    const P = m.groups[1].plan + m.groups[2].plan, e = m.groups[1].spent, f = m.groups[2].spent;
    over = e + f > P;
    line = over ? `<span class="num">${ft(e + f - P)}</span> over the plan for everyday and fun` : `Planned for everyday and fun: <span class="num">${ft(P)}</span>`;
  } else {
    const avg = avgSpend() || spent;
    line = `Average card spending a month: <span class="num">${ft(avg)}</span>`;
  }
  return `<div class="sec"><span>${mo.label}</span></div>
  ${catRing(sp, mo, true)}
  ${outLine()}
  <div class="card mend" data-tour="proj"><span class="ic" aria-hidden="true">${I('chart', 22)}</span><span class="t"><b>Month end</b><span class="p">${projLine()}</span><small${over ? ' class="ov"' : ''}>${line}</small></span></div>
  <div class="sec"><span>Where it went</span></div>
  ${catShareRows(sp)}`;
}
/* ---------- Money in each month: the one summary of what your rules move into Persely, under the balance ----------
   Read only. Every switch lives on its goal's page. Shared and euro goals have no rules. Same numbers as paceOf() without the planned extra deposits (g.pace). */
function moneyIn(){
  const gs = S.goals.filter(g => !g.shared && !isEur(g)); let pay = 0, wk = 0, rnd = 0;
  const rows = gs.map(g => {
    const x = rulesOf(g), p = x.pay.on ? incomeShare(x.pay.pct) : 0, w = x.wk.on ? wkMonthly(x.wk.amt) : 0, r = x.rr.on ? Math.round(ROUND_EST / Math.max(1, rrGoals().length)) : 0;
    pay += p; wk += w; rnd += r; return {g, pay:p, wk:w, rnd:r, total:p + w + r};
  });
  const dated = gs.filter(g => g.date && toGo(g) > 0 && daysTo(g) > 0), need = Math.ceil(dated.reduce((a, g) => a + toGo(g) / Math.max(1, Math.round(daysTo(g) / 30.4)), 0) / 100) * 100;   // a goal whose date is today or past is left out: no monthly amount can catch it up
  const late = gs.filter(g => g.date && toGo(g) > 0 && daysTo(g) <= 0);   // behind or due today: named on the panel, left out of need
  return {pay, wk, rnd, total:pay + wk + rnd, need, late, dated:dated.length, ask:!!(payOn() && S.payday.ask), rows};
}
// the Persely tab block: read only, one row per goal with its own rules in one line; a row opens that goal's rules on its page
function savingRulesBlock(){
  const gs = plainGoals(); if(!gs.length) return '';
  const tot = payPct();
  return `<div class="sec"><span>Saving rules</span></div>
  <div class="card lst srlist">${gs.map(g => `<button class="li" data-goalrules="${g.id}" aria-label="${esc(g.name)}: ${rulesLine(g)}. Change"><span class="ic">${I(g.ic)}</span><span class="t"><b>${esc(g.name)}</b><small>${rulesLine(g)}</small></span><span class="chev">${I('chev', 18)}</span></button>`).join('')}</div>
  <div class="fine u-mt4-b12" style="padding:0 var(--sp-1)">Each goal has its own rules.${tot ? ` Payday rules take ${tot}% of your salary in total (the most is ${PAY_CAP}%).` : ''}</div>`;
}
function moneyInPanel(){
  if(!S.goals.length) return '';
  const m = moneyIn(), R = 104, C = 2 * Math.PI * R, arc = C * .75, p = m.need ? Math.min(1, m.total / m.need) : (m.total ? 1 : 0);
  const nm = [m.pay ? 'Payday rule' : '', m.wk ? 'Weekly transfer' : '', m.rnd ? 'Round-ups' : ''].filter(Boolean).map((n, i) => i ? n.toLowerCase() : n), names = nm.length > 1 ? nm.slice(0, -1).join(', ') + ' and ' + nm[nm.length - 1] : nm[0] || '';
  const l3 = !m.total ? "Switch on a saving rule" : (m.dated ? (m.total >= m.need ? (m.late.length ? `Enough for goals with a date ahead. ${m.late.length > 1 ? m.late.length + ' goals are' : esc(m.late[0].name) + ' is'} behind.` : 'Enough for every goal date') : `Your goals need about ${ft(m.need)}`) : names) + (m.ask ? ' · payday asks first' : '');
  return `${hintHTML('auto')}<button class="card mgauge" data-sheet="moneyin" data-tour="auto">
    <span class="mg-ring"><svg viewBox="0 0 250 250" style="transform:rotate(135deg)" aria-hidden="true"><circle cx="125" cy="125" r="${R}" fill="none" stroke="${PALETTE.line}" stroke-width="24" stroke-linecap="round" stroke-dasharray="${arc} ${C}"/>${p > 0 ? `<circle cx="125" cy="125" r="${R}" fill="none" stroke="${PALETTE.green}" stroke-width="24" stroke-linecap="round" stroke-dasharray="${arc * p} ${C}"/>` : ''}</svg></span>
    <span class="t"><small>Money in each month</small><b class="num">${m.total ? ft(m.total) : 'Nothing yet'}</b><small>${l3}</small></span>
    <span class="chev">${I('chev', 20)}</span></button>`;
}
// the latest card payments of the month on screen
function recentCards(n = 3){
  const ym = shownMonth().ym, rows = S.tx.filter(t => txWhen(t).ym === ym && (t.parts || txType(t) === 'card' || txType(t) === 'refund')).slice(0, n);
  if(!rows.length) return '';
  return `<div class="sec"><span>Latest card payments</span><a data-tab="tranzakciok">All ${I('chev',16)}</a></div><div class="card lst rcards">${rows.map(t => { const c = t.parts ? null : classify(t);
    return `<div class="tx"><span class="ic">${I(t.ic)}</span><span class="t"><b>${esc(t.n)}</b><span>${t.d === 'Today' ? 'Today' : esc(t.d || '')}</span>${c ? `<em>${I(SPEND_IC[c] || 'tag',15)} ${SPEND_SHORT[c] || CATEGORY[c][0]}</em>` : ''}</span><span class="a num">${sft(t.a)}</span></div>`; }).join('')}</div>`;
}
/* ---------- financial health score (0-100), shown only when the analyst is on ----------
   Four indicators, 25 points each, over the last 3 finished months (S.scoreHist). Rewards trigger on improvement
   or on staying within the split, never on balance size. Neither the score nor the streak changes the rate. */
const SCORE_IND = [['earn','Spends less than it earns','Card spending below income','Spending vs income'], ['safe','No overdraft or failed payment','Every payment went through','Safe payments'],
  ['buf','Keeps about a month of spending','Junior account covers a month of card spending','Buffer'], ['goal',SIMPLE_PERSELY ? 'You keep saving for a goal' : 'Saves regularly toward a named goal','Money moved to a goal that month','Saving for a goal']];
function scoreOf(h){ const w = h.slice(-3), p = {}; let t = 0;
  SCORE_IND.forEach(([k]) => { p[k] = w.length ? Math.round(25 * w.filter(m => m[k]).length / w.length) : 0; t += p[k]; }); return {p, t, w}; }
const scoreNow = () => scoreOf(S.scoreHist), scorePrev = () => scoreOf(S.scoreHist.slice(0, -1));
const habitsHeld = () => { const n = scoreNow(); return SCORE_IND.filter(([k]) => n.w.filter(m => m[k]).length * 2 > n.w.length).length; };   // a habit "held" = it held in most of the last 3 months
const SCORE_LINE = SIMPLE_PERSELY ? 'Spend less than you get. Stay above zero. Keep a little extra. Save often.' : 'Spending under income · no overdraft · a buffer · regular saving';   // what the score means (plan 2f item 3)
const deltaTxt = d => d > 0 ? `▲ +${d}` : d < 0 ? `▼ −${-d}` : 'No change';
const deltaCol = d => d > 0 ? 'var(--green-t)' : d < 0 ? 'var(--orange-t)' : 'var(--muted-t)';
const nextMonthName = () => new Date(2026, 10 + S.months, 1).toLocaleDateString('en-GB',{month:'long'});
function scoreRow(){   // the score part of the "Your habits" card (analyst on only)
  if(!S.analyst.on) return '';
  const n = scoreNow(), d = n.t - scorePrev().t;
  return `<button class="hab-score" data-sheet="score" data-tour="score"><span class="t24d"><b class="num">${n.t}</b><small>of 100</small></span><span class="t"><b class="u-bk-title">Financial health score</b><small style="color:${deltaCol(d)}">${deltaTxt(d)} since last month</small><small class="hs-l">${SCORE_LINE}</small></span><span class="chev">${I('chev',20)}</span></button>`;
}
