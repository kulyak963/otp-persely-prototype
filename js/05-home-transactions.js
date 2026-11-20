/* ================= tab screens ================= */
/* UX change 5 + 12 (plan: ux-change-plan-persely.md). true: the Persely tab is about saving, the analytics live on one "Spending analysis" page (one Home card, one Persely row), and Friends is opt-in.
   false: the old layout (My split, Bills and next month and Friends in the tab, Next month and Must-pay bills linked from Home). Kept until the run-through. */
const NEW_PERSELY_IA = true;
/* First-run notice (A5 item 3, D10): the analyst is on by default, so Home says so once, with What it reads and Turn off.
   It goes away when one of its buttons is used or when the student leaves Home (anNoteSeen). */
// CONFIRM WITH OTP / LEGAL: lawful basis for default-on processing of transaction data; wording is not final.
function anNoticeCard(){
  if(S.anNote || !S.analyst.on) return '';
  return `<div class="card annote" role="region" aria-label="Financial analyst"><!-- CONFIRM WITH OTP / LEGAL: lawful basis -->
    <b>Your Financial analyst is on.</b>
    <div class="fine">It reads your transactions to show Safe to spend, bills and categories.</div>
    <div class="anbtns"><button class="btn w" data-anread>What it reads</button><button class="btn ghost" data-anask>Turn off</button></div></div>`;
}
function anNoteSeen(){ if(!S.anNote && document.querySelector('#v-fooldal .annote')){ S.anNote = true; save(); } }
// the story exists only at month end (C3, D3). S.monthEnd is the demo month clock: the demo keys M and E set it, +1 month (O) starts a new month and clears it.
const storyReady = () => !!S.monthEnd;
const storyDateTxt = () => { const mo = shownMonth(); return `${mo.last} ${mo.name} ${mo.year}`; };   // full date: "30 November 2026" (glossary: no short or year-less dates)
// Home card "Your November is ready": month end only, until the story has been watched
function storyCard(){
  if(!storyReady() || S.storySeen) return '';
  const nm = S.period === 'Autumn semester' ? 'Autumn semester' : S.period;
  return `<button class="card hubteaser storycard" data-story data-tour="storycard">${pig('proud', 52)}<span><b>Your ${esc(nm)} is ready</b><small>Take a look. It takes about a minute</small></span>${I('chev',20)}</button>`;
}
// the ring on the Persely tab: active at month end, grey before it with the date it arrives
function storyRing(){
  const lab = S.period === 'Autumn semester' ? 'SEM' : S.period.slice(0,3).toUpperCase();
  if(storyReady()) return `<button class="sring ${S.storySeen ? 'seen' : ''}" data-story data-tour="story" aria-label="Your ${S.period} story"><span class="sring-in">${lab}</span><small>${S.storySeen ? 'Watched' : 'New story'}</small></button>`;
  return `<button class="sring off" data-storywait data-tour="story" aria-label="Your story arrives on ${storyDateTxt()}" title="Your story arrives on ${storyDateTxt()}"><span class="sring-in">${lab}</span><small>At month end</small></button>`;
}
function vFooldal(){
  const mo = shownMonth(), sp = catSpend(mo.ym), spent = sumVals(sp), avg = avgSpend() || spent;
  // the month circle: 270 degree ring, gap at the bottom, one arc per category (catRing)
  return `
  <div class="hhead"><button class="hprof" data-settings="" aria-label="Profile and Settings"><span class="avatar" aria-hidden="true">${S.ini}</span><span class="hn"><b>${S.name}</b><small>Profile and settings</small></span></button><button class="bell hic" data-go="inbox" aria-label="Notifications${inboxUnread() ? ', ' + inboxUnread() + ' unread' : ''}"><span class="hi">${I('bell',24)}${inboxUnread() ? '<i class="bdot" aria-hidden="true"></i>' : ''}</span><small aria-hidden="true">Notifications</small></button><button class="mail hic" data-go="neked" aria-label="For you"><span class="hi">${I('gift',24)}</span><small aria-hidden="true">For you</small></button></div>
  ${bfCard()}
  ${spFirstRun() ? '' : anNoticeCard()}
  <div class="sec"><span>Balance</span><a data-go="szamlaim">All accounts ${I('chev',16)}</a></div>
  <div class="accs" id="accs">${S.accounts.map(a => a.id === 'persely'
    ? `<button class="acc" data-tab="hub"><div class="n">Persely · total</div><div class="v num">${ft(total())}</div><div class="h">${S.goals.length ? plural(S.goals.filter(g => !isEur(g)).length,'goal') : 'No goals yet'}${eurTotal() ? ` + ${eur(eurTotal())}` : ''}</div><div class="go">Open Persely ${I('chev',14)}</div></button>`
    : a.id === 'megt' ? `<div class="acc"><button class="accin" data-go="szamlaim"><div class="n">${a.n}</div><div class="v num">${ft(a.v)}</div><div class="h">${a.h}</div><div class="go">Account details ${I('chev',14)}</div></button><button class="link lnk44 whyl" data-sheet="whyp">Why Persely?</button></div>`
    : `<button class="acc" data-go="szamlaim"><div class="n">${a.n}</div><div class="v num">${ft(a.v)}</div><div class="h">${a.h}</div><div class="go">Account details ${I('chev',14)}</div></button>`).join('')}</div>
  <div class="dots">${S.accounts.map((_,i)=>`<i class="${i?'':'on'}"></i>`).join('')}</div>
  ${spFirstRun() ? spHomeCard() + spAnLine() : ''}
  ${S.verified || S.bridge ? juniorRow() : ''}
  ${safeRow()}
  <div class="sec"><span>Quick actions</span></div>
  <div class="short" role="group" aria-label="Quick actions">${[
    ['data-sheet="hubsave"', 'plus', 'Add money to a goal', 'Put money into your Persely savings'],
    ['data-go="bills"', 'doc', 'Pay a bill', 'See what is due and pay it'],
    ['data-go="kartyaim"', 'cards', 'Manage my card', 'Block it and see your Discounts']
  ].map(([at, ic, l, h]) => `<button ${at}><span class="c" aria-hidden="true">${I(ic)}</span><span class="t"><b>${l}</b><small>${h}</small></span><span class="chev" aria-hidden="true">${I('chev', 18)}</span></button>`).join('')}</div>
  ${spFirstRun() ? '' : `<button class="card hubteaser" ${S.goals.length ? 'data-tab="hub"' : 'data-sheet="newgoal"'}>${pig(S.savedWeek ? 'proud' : 'happy', 52)}<span>${!S.goals.length
    ? `<b>Start your first goal</b><small>Pick what you are saving for</small>`
    : `<b style="display:flex;align-items:center;gap:var(--sp-1)">${flame(17, S.streak > 0)} ${S.streak}-week streak</b><small>${S.savedWeek ? 'Persely savings. Safe this week' : 'Persely savings. Save by Sunday to keep it'}</small>`}</span>${I('chev',20)}</button>`}
  ${storyCard()}
  ${insightCard()}
  <div class="sec"><span>My monthly spending</span></div>
  <div class="mlab">${mo.label}. What you paid by card, by category</div>
  ${catRing(sp, mo)}
  ${outLine()}
  <div class="avg">Average card spending a month: <span class="num">${ft(avg)}</span></div>
  ${catLegend(sp)}
  <button class="btn w dbtn" data-go="mymoney">See spending details ${I('chev',18)}</button>
  ${S.analyst.on && !NEW_PERSELY_IA ? `<div class="lrow"><button class="link lnk44" data-go="nextmonth">Next month ${I('chev',16)}</button><button class="link lnk44" data-go="bills">Must-pay bills ${I('chev',16)}</button></div>` : ''}
  ${S.analyst.on && S.analyst.accepted ? '' : `<button class="link lnk44" data-sheet="analyst">See how it fits your income ${I('chev',16)}</button>`}
  <div class="sec"><span>For you</span><a data-go="neked">See all ${I('chev',16)}</a></div>
  <div class="fine sec-sub">Offers, tips and news from OTP</div>
  ${nekedCards(true)}`;
}
// the monthly tip (the Home card uses this one; the Wrapped story has no tip slide). State-aware and from a regular habit:
//   {kind:'bill'}  a must-pay bill is late: no saving tip, the action is Pay now
//   {kind:'short'} this month is overspent (more out than in): no saving tip
//   {kind:'tip'}   10% of the 3-month average of a regular Fun category (the category of "The biggest change" when that slide shows it), never under 1 000 Ft, moves to the goal every month
//   null           nothing worth a button
function tipOf(){
  const bf = bfNow(); if(bf.on) return {kind:'bill', row:bf.late[0], late:bf.late, total:bf.lateTotal};
  const ym = ymAt(S.months || 0), left = stAgg([ym]).left; if(left < 0) return {kind:'short', over:-left};
  const g = ruleGoal(), rem = g ? gTarget(g) - gSaved(g) : 0; if(!g || rem <= 0) return null;
  const base = (S.closedYm || []).filter(y => y < ym).slice(-3); if(base.length < 2) return null;
  const hist = base.map(y => monthUse(y).spend), avgOf = c => hist.reduce((a, h) => a + (h[c] || 0), 0) / hist.length, regular = c => { const v = hist.map(h => h[c] || 0), mx = Math.max(...v), rest = (v.reduce((a, b) => a + b, 0) - mx) / (v.length - 1); return v.filter(x => x > 0).length >= 2 && mx <= 2.5 * rest; },   // in at least 2 of the 3 months, and no month driven by one big purchase
    isFun = c => CATEGORY[c] && CATEGORY[c][2] === 'fun' && !/^mix_/.test(c), dr = stDrift(ym);
  const cat = dr && isFun(dr.cat) && regular(dr.cat) ? dr.cat : Object.keys(CATEGORY).filter(c => isFun(c) && regular(c)).sort((a, b) => avgOf(b) - avgOf(a))[0];
  if(!cat) return null;
  const avg = avgOf(cat), ten = Math.round(avg / 10 / 100) * 100; if(ten < 1000) return null;
  const p = paceOf(g), wk = p ? Math.round((rem / p - rem / (p + ten)) * 4.345) : 0;
  return {kind:'tip', g, cat, label:CATEGORY[cat][0].toLowerCase(), amt:Math.round(avg), ten, wk};
}
// monthly insight on Home: the tip above, one action (same rule as the story's Set it up)
function insightCard(){
  if(!S.insight || S.insightUsed) return '';
  const t = tipOf(); if(!t || t.kind !== 'tip') return '';   // a late bill has its own Bills first card; an overspent month gets no tip
  const a = S.analyst, line = `Move 10% of ${t.label} (${ft(t.ten)}) to ${esc(t.g.name)} each month${t.wk >= 1 ? ` and get there <b>${plural(t.wk,'week')} sooner</b>` : ''}.`;
  if(a.on && a.accepted){   // analyst on: one headline from the split and exactly one action
    const use = splitUse(), sv = splitView(), pc = k => { const b = sv.by[k].amt; return b ? Math.round(use[k] / b * 100) : 0; };
    const over = ['ess','fun'].filter(k => pc(k) > 100).map(bucketName);
    const head = over.length ? `${over.join(' and ')} went over your split` : `You stayed within your split: Everyday essentials ${pc('ess')}%, Fun ${pc('fun')}% used`;
    return `<div class="card insight"><div class="hrow"><span class="pill ok">Analyst</span><span class="k">This month</span></div>
    <div class="u-tip-p"><b>${head}.</b> ${line}</div>
    <div class="hero-btns u-m0"><button class="btn" data-insyes="${t.ten}">Move 10% a month</button></div></div>`;
  }
  return `<div class="card insight"><div class="hrow"><span class="pill ok">Persi's tip</span><span class="k">This month</span></div>
    <div class="u-tip-p">${line}</div>
    <div class="hero-btns u-m0"><button class="btn" data-insyes="${t.ten}">Move 10% a month</button><button class="btn w" data-insno>Not now</button></div>
    <button class="btn ghost" data-sheet="analyst">${a.on ? 'See your suggested split' : 'See how this fits your split'}</button></div>`;
}

function vUtalas(){
  const chev = `<span class="chev">${I('chev',20)}</span>`;
  return `<div class="tabtitle">Transfer</div>
  <div class="qa">
    <button data-sheet="uj"><span class="c">${I('plus')}</span>New transfer</button>
    <button data-sheet="sajat"><span class="c">${I('swap')}</span>Between my accounts</button>
    <button data-demo="Currency transfer"><span class="c">${I('euro')}</span>Currency transfer</button>
    <button data-demo="New qvik request"><span class="c">${I('plane')}</span>New qvik request</button>
  </div>
  <button class="row" data-demo="Request money easily"><span class="ic">${I('req')}</span><span class="t">Request money easily<small>free | NFC | QR code</small></span><span class="badge">New</span>${chev}</button>
  <button class="row" data-saverules="wk"><span class="ic">${I('sched')}</span><span class="t">Scheduled and recurring transfers</span>${chev}</button>
  <button class="row" data-tab="tranzakciok"><span class="ic">${I('hist')}</span><span class="t">Previous transfers</span>${chev}</button>
  <button class="row" data-demo="qvik requests"><span class="ic">${I('plane')}</span><span class="t">qvik requests</span>${chev}</button>`;
}

let txMode = 0;
const txBill = t => t.a < 0 && ['card', 'debit', 'out'].includes(txType(t)) ? (S.bills || []).find(x => x.key === payeeKey(t) && !x.ignored) : null;
/* ---------- Transactions: search, chips, Filter sheet (D14) ----------
   Search matches the payee and the student's own bill label (and a goal name). Chips: Category, Date, In/Out, Persely, Bills. The list is drawn in chunks of 50
   so 191 rows stay fast; typing only redraws the list, never the search field. Screen state (not saved): txQ, txF, txN. */
const TX_STEP = 50, TX_BLANK = {cat:'', date:'', dir:'', pers:false, bills:false};
let txQ = '', txF = {...TX_BLANK}, txN = TX_STEP, txDraft = null;
const TX_DATES = {this:'This month', last:'Last month', older:'Earlier'}, TX_DIRS = {in:'Money in', out:'Money out'};
const TX_CAT_GROUPS = [['Must-pay', ['housing','utilities','pass','phone','insurance']], ['Essentials', ['groceries','transport','edu','health']], ['Fun', ['food','shopping','fun','travel','subs']], ['Other', ['other']]];
const txNorm = x => String(x || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const txIsPers = t => /^(PERSELY|CURRENCY EXCHANGE)/.test(t.n || '') || (txType(t) === 'own' && S.goals.some(g => g.name === t.note));
const txHas = f => !!(f.cat || f.date || f.dir || f.pers || f.bills);
function txReset(){ txQ = ''; txF = {...TX_BLANK}; txN = TX_STEP; txDraft = null; }
function txMatch(t, q, ym0, ym1){
  if(q.length){ const bl = txBill(t), hay = txNorm(t.n + ' ' + (bl ? bl.name : '') + ' ' + (t.note || '')); if(!q.every(w => hay.includes(w))) return false; }
  const f = txF;
  if(f.cat && classify(t) !== f.cat && !(t.parts && t.parts.cats && t.parts.cats[f.cat])) return false;
  if(f.date){ const y = txWhen(t).ym; if(f.date === 'this' ? y !== ym0 : f.date === 'last' ? y !== ym1 : y >= ym1) return false; }
  if(f.dir && (f.dir === 'in' ? t.a <= 0 : t.a >= 0)) return false;
  if(f.pers && !txIsPers(t)) return false;
  if(f.bills && !(txBill(t) || t.n === 'BILLS POCKET')) return false;
  return true;
}
function txRows(){   // the rows that match the search and chips: [transaction, index in S.tx]
  const q = txNorm(txQ).split(/\s+/).filter(Boolean), ym0 = shownMonth().ym, ym1 = ymAt((S.months || 0) - 1), out = [];
  S.tx.forEach((t, i) => { if(txMatch(t, q, ym0, ym1)) out.push([t, i]); });
  return out;
}
function txResHTML(){
  const rows = txRows();
  if(!rows.length) return `<div class="card txempty" id="txempty">${txQ.trim() ? `No payments match '${esc(txQ.trim())}'` : 'No payments match these filters.'}<button class="btn w" data-txclr>Clear</button></div>`;
  let last = null, html = '';
  rows.slice(0, txN).forEach(([t, i]) => {
    const dl = txDate(t); if(dl !== last){ html += `<div class="dh">${esc(dl)}</div>`; last = dl; }
    const c = S.analyst.on && !t.parts && txType(t) !== 'own' ? CATEGORY[classify(t)] : null, bl = txBill(t);   // the user's own bill label ("Rent share") with the bank payee as the second line
    html += `<button class="tx" data-txd="${i}"><span class="ic">${I(t.ic)}</span><span class="t"><b${bl ? ' class="own"' : ''}>${bl ? esc(bl.name) : t.n}</b>${bl ? `<span class="txp">${esc(t.n)}</span>` : ''}<span>${t.s}</span>${t.note?`<em>${I('piggy',15)} ${t.note}</em>`:''}${c && txType(t) !== 'in' ? `<em>${I('chart',15)} ${c[0]} · ${catLabel(classify(t))}</em>` : ''}</span><span class="a num ${t.a>0?'p':''}">${sft(t.a)}</span><span class="chev">${I('chev',18)}</span></button>`;
  });
  if(rows.length > txN) html += `<button class="btn w txmore" data-txmore>Show more (${rows.length - txN} left)</button>`;
  return html;
}
function txChipsHTML(){
  const f = txF, on = (k, label) => `<button class="chip on" data-txrm="${k}" aria-label="Remove filter ${esc(label)}">${esc(label)} ${I('close',14)}</button>`, off = (k, label) => `<button class="chip" data-txfilter="${k}">${label}</button>`;
  return (f.cat ? on('cat', CATEGORY[f.cat][0]) : off('cat', 'Category')) + (f.date ? on('date', TX_DATES[f.date]) : off('date', 'Date')) + (f.dir ? on('dir', TX_DIRS[f.dir]) : off('dir', 'In/Out'))
    + `<button class="chip ${f.pers ? 'on' : ''}" data-txtog="pers" aria-pressed="${f.pers}">Persely</button><button class="chip ${f.bills ? 'on' : ''}" data-txtog="bills" aria-pressed="${f.bills}">Bills</button>`;
}
function txRefresh(){ const r = $('#txres'); if(r) r.innerHTML = txResHTML(); const x = $('#txqx'); if(x) x.hidden = !txQ; }
function vTranz(){
  const head = `<div class="tabtitle">Transactions</div>
  <div class="seg"><button class="${txMode===0?'on':''}" data-txmode="0">Completed</button><button class="${txMode===1?'on':''}" data-txmode="1">Pending</button></div>`;
  if(txMode === 1) return head + `<div class="card" style="text-align:center;color:var(--muted-t);padding:var(--sp-6) var(--sp-4)">No pending transactions.</div>`;
  return head + `<label class="txq">${I('search',20)}<input id="txq" type="text" value="${esc(txQ)}" placeholder="Search payments" aria-label="Search payments" autocomplete="off" autocorrect="off" enterkeyhint="search"><button class="xq" id="txqx" data-txqclr aria-label="Clear search" ${txQ ? '' : 'hidden'}>${I('close',18)}</button></label>
  <div class="txfr"><button class="filter" data-txfilter="">${I('filter')} Filter</button><div class="chs" id="txchips">${txChipsHTML()}</div></div>
  <div id="txres">${txResHTML()}</div>`;
}

function vKartyaim(){
  const frozen = S.frozen, chev = `<span class="chev">${I('chev',20)}</span>`, rg = rrGoals();   // round-ups are per goal: the card shows where they go
  return `<div class="tabtitle">My cards</div>
  <div class="card bigcard">
    <div class="u-fw6">Main card</div>
    <div class="ccard" style="${frozen?'filter:grayscale(.85)':''}"><div class="bn">otpbank</div><div class="chip2"></div><div class="no">•••• •••• •••• 4821</div><div class="nm">KISS ANNA · JUNIOR</div><div class="mc"><i></i><i></i></div></div>
    ${frozen?'<span class="ok" style="background:var(--orange-l);color:var(--orange-t)">Temporarily blocked</span>':`<span class="ok">${I('check',18)} Your card is active</span>`}
  </div>
  <div class="row"><span class="ic">${I('snow')}</span><span class="t">Temporary block<small>You can turn it back on anytime</small></span>${swBtn(frozen, 'data-freeze', 'Temporary block')}</div>
  <button class="row" data-saverules="rr"><span class="ic">${I('piggy')}</span><span class="t">Round-ups: ${rg.length ? `on → ${rg.map(g => esc(g.name)).join(', ')}` : 'off'}<small class="g">${rg.length > 1 ? 'Shared equally. ' : ''}Set on each goal's page</small></span><span class="lnk44 u-edit">Edit</span></button>
  <button class="row" data-demo="Change daily limit"><span class="ic">${I('limit')}</span><span class="t">Change daily limit</span>${chev}</button>
  <button class="row" data-demo="View card details"><span class="ic">${I('eye')}</span><span class="t">View card details</span>${chev}</button>
  <button class="row" data-go="perks"><span class="ic">${I('tag')}</span><span class="t">Discounts<small class="g">${5-S.disc.activated.length} offers waiting for activation</small></span>${chev}</button>
  <button class="row" data-demo="Click to Pay"><span class="ic">${I('ctp')}</span><span class="t">Click to Pay</span>${chev}</button>`;
}

/* More: Profile and Settings on top (both open Settings), then Money, Persely and Help (flow plan 3.4). Every row of the old list is kept; a row with data-demo is a shell row and shows the one demo toast (D7).
   Perks (Discounts and My rewards) replaces the Discounts row; My partners opens Perks; Notifications opens Settings > Notifications. */
function vTovabbiak(){
  const it = (ic, t, attr) => `<button class="mi" ${attr || `data-demo="${t}"`}>${I(ic)}<span>${t}</span></button>`;
  return `<div class="menu">
  <div class="mtop"><button data-settings="profile">${I('user')}<span>Profile</span></button><button data-settings="">${I('gear')}<span>Settings</span></button></div>
  <div class="sec"><span>Money</span></div>
  ${it('wallet','My accounts','data-go="szamlaim"')}
  ${it('cards','My cards','data-go="kartyaim"')}
  ${it('limit','Spending','data-go="mymoney"')}
  ${it('phone','Mobile top-up')}${it('ctp','Click to Pay')}${it('road','Motorway vignette')}${it('rate','Exchange rates')}${it('qr','QR reader')}${it('doc','Documents')}
  <div class="sec"><span>Persely</span></div>
  ${it('piggy','Persely','data-tab="hub"')}
  ${it('coins','Savings options','data-tab="hub"')}
  ${it('tag','Perks','data-go="perks"')}${it('gift','My partners','data-go="perks"')}
  <div class="mi sw"><button class="mi-main" data-sheet="analyst">${I('analyst')}<span>Financial analyst</span></button>${swBtn(S.analyst.on, 'data-sw="analyst"', 'Financial analyst')}</div>
  ${it('mail','For you','data-go="neked"')}
  ${(S.months || 0) >= 12 ? it('star','Your year','data-go="year"') : ''}
  <div class="sec"><span>Help</span></div>
  ${it('bell','Notifications','data-settings="notif"')}
  ${it('info','How Persely works','data-sheet="how"')}
  ${it('help','Can we help?')}${it('invite','Invite a friend!')}
  ${it('mapq','OTP branches and ATMs in Hungary')}${it('mapp','ATMs abroad')}${it('cal','Book a branch appointment')}${it('lock','Block internet and mobile bank access')}
  <div class="mdiv"></div>
  ${it('logout','Log out','data-reset')}
  </div>`;
}

