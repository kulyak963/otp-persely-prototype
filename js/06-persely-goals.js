/* ================= Persely tab: mascot, streak, level, goals, challenge, friends ================= */
// Our own 3D piggy (see "3D piggy" below). Here only a placeholder; the single 3D canvas is moved into it.
// Without the 3D library the flat drawing is shown instead.
function pig(mood='happy', size=120){
  if(!window.THREE) return pigSvg(mood, size);
  return `<div class="pig pig3d" data-mood="${mood}" style="width:${size}px;height:${size}px" aria-label="Persely piggy, drag to turn"></div>`;
}
// Flat fallback drawing. Persi's colours all come from the palette (body --green, details derived with mixHex), the same as the 3D pig.
const PIG = {body:PALETTE.green, dark:PALETTE.greenI, belly:mixHex(PALETTE.green, .12), slot:PALETTE.act, snout:PALETTE.greenLt, nose:PALETTE.greenDk,
  ink:mixHex(PALETTE.greenDk, -.35), eye:PALETTE.white, cheek:mixHex(PALETTE.red, .4), gold:PALETTE.cYellow, z:PALETTE.muted};
function pigSvg(mood='happy', size=120){
  const look = mood==='concerned' ? 49 : 47;
  const eyes = mood==='proud' ? `<path d="M39 49q6-7 12 0M69 49q6-7 12 0" stroke="${PIG.ink}" stroke-width="3.2" fill="none" stroke-linecap="round"/>`
    : mood==='sleepy' ? `<path d="M39 50h12M69 50h12" stroke="${PIG.ink}" stroke-width="3.2" stroke-linecap="round"/>`
    : `<circle cx="45" cy="48" r="7.5" fill="${PIG.eye}"/><circle cx="75" cy="48" r="7.5" fill="${PIG.eye}"/><circle cx="46" cy="${look}" r="3.8" fill="${PIG.ink}"/><circle cx="76" cy="${look}" r="3.8" fill="${PIG.ink}"/><circle cx="47.3" cy="45.6" r="1.3" fill="${PIG.eye}"/><circle cx="77.3" cy="45.6" r="1.3" fill="${PIG.eye}"/>`;
  const brows = mood==='concerned' ? `<path d="M38 39l12-4M82 39l-12-4" stroke="${PIG.ink}" stroke-width="2.6" stroke-linecap="round"/>` : '';
  const mouth = mood==='concerned' ? `<path d="M54 82q6-4 12 0" stroke="${PIG.ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`
    : `<path d="M53 80q7 6 14 0" stroke="${PIG.ink}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  const extra = mood==='proud' ? `<path d="M100 16l2.5 6 6 2.5-6 2.5-2.5 6-2.5-6-6-2.5 6-2.5z" fill="${PIG.gold}"/><path d="M15 28l1.6 4 4 1.6-4 1.6-1.6 4-1.6-4-4-1.6 4-1.6z" fill="${PIG.gold}"/>`
    : mood==='sleepy' ? `<text x="92" y="26" font-size="14" font-weight="700" fill="${PIG.z}" font-family="sans-serif">z</text><text x="101" y="16" font-size="10" font-weight="700" fill="${PIG.z}" font-family="sans-serif">z</text>` : '';
  return `<svg class="pig" width="${size}" height="${Math.round(size*110/120)}" viewBox="0 0 120 110" role="img" aria-label="Persely piggy">
    <ellipse cx="60" cy="104" rx="34" ry="4" fill="rgba(0,0,0,.08)"/>
    <rect x="37" y="80" width="13" height="21" rx="6.5" fill="${PIG.dark}"/><rect x="70" y="80" width="13" height="21" rx="6.5" fill="${PIG.dark}"/>
    <path d="M33 36 28 11l24 15z" fill="${PIG.dark}"/><path d="M87 36l5-25-24 15z" fill="${PIG.dark}"/>
    <ellipse cx="60" cy="60" rx="45" ry="39" fill="${PIG.body}"/>
    <ellipse cx="60" cy="74" rx="30" ry="19" fill="${PIG.belly}"/>
    <rect x="47" y="23" width="26" height="5" rx="2.5" fill="${PIG.slot}"/>
    <circle cx="35" cy="64" r="5.5" fill="${PIG.cheek}" opacity=".45"/><circle cx="85" cy="64" r="5.5" fill="${PIG.cheek}" opacity=".45"/>
    <ellipse cx="60" cy="65" rx="15" ry="11" fill="${PIG.snout}"/>
    <ellipse cx="55" cy="65" rx="2.3" ry="3" fill="${PIG.nose}"/><ellipse cx="65" cy="65" rx="2.3" ry="3" fill="${PIG.nose}"/>
    ${eyes}${brows}${mouth}${extra}</svg>`;
}
/* Persely tab: the economics come from the team handoff (Levente), the experience from the research.
   - 3.0% a year for every Junior customer, automatically (no extra check), on the first 500 000 Ft, 28% tax on interest → about 2.2% net. Otherwise 0.01%.
   - money in: payday rule (asks first), weekly transfer, round-ups (next 100 Ft, ×2)
   - shared Persely (2–5 people), euro Persely (no student rate), graduation bridge (3.0% for 12 months if the salary comes to OTP)
   - weekly streak is for motivation only and never changes the rate */
const RATE = 3.0, LOW_RATE = 0.01, TAX = 0.28, CAP = 500000, EUR_RATE = 390, ROUND_EST = 3000;
const rate = () => (S.verified || S.bridge) ? RATE : LOW_RATE;
const rateLabel = () => (S.verified || S.bridge) ? '3.0%' : '0.01%';
const isEur = g => g.cur === 'EUR';
const eur = v => '€' + (Math.round(v*100)/100).toLocaleString('en-US');
const money = (g, v) => isEur(g) ? eur(v) : ft(v);
const goalById = id => S.goals.find(g => g.id === id);
const NOGOAL = {id:'', name:'your next goal', ic:'star', saved:0, target:1, pace:0, date:null};   // stands in when every goal is deleted
/* saving rules per goal (see migrateRules for the allocation rules). Helpers take a state (st) so the self-checks can use copies */
const PAY_CAP = 50, RULE_PCTS = [5, 10, 15, 20], WK_AMTS = [1000, 2000, 3000, 5000], WK_DAYS = [['mon', 'Monday'], ['tue', 'Tuesday'], ['wed', 'Wednesday'], ['thu', 'Thursday'], ['fri', 'Friday'], ['sat', 'Saturday'], ['sun', 'Sunday']];
const dayName = k => (WK_DAYS.find(x => x[0] === k) || WK_DAYS[0])[1];
const OFF_RULES = Object.freeze({pay:Object.freeze({on:false, pct:10}), wk:Object.freeze({on:false, amt:2000, day:'mon'}), rr:Object.freeze({on:false})});
const plainGoals = (st = S) => (st.goals || []).filter(g => !g.shared && !isEur(g));
const rulesOf = g => (g && g.rules && !g.shared && !isEur(g)) ? g.rules : OFF_RULES;   // read only for goals without rules
const ownRules = g => { if(!g.rules) g.rules = offRules(); return g.rules; };   // the goal's own (writable) rules
const ruleDefaults = (st = S) => st.ruleDefaults || (st.ruleDefaults = RULE_DEFAULTS());
const payGoals = (st = S) => plainGoals(st).filter(g => rulesOf(g).pay.on);
const wkGoals = (st = S) => plainGoals(st).filter(g => rulesOf(g).wk.on);
const rrGoals = (st = S) => plainGoals(st).filter(g => rulesOf(g).rr.on);
const payOn = (st = S) => payGoals(st).length > 0;
const payPct = (st = S) => payGoals(st).reduce((a, g) => a + g.rules.pay.pct, 0);   // all goals together, % of each salary
const anyRule = (st = S) => plainGoals(st).some(g => { const r = rulesOf(g); return r.pay.on || r.wk.on || r.rr.on; });
const wkTotal = (st = S) => wkGoals(st).reduce((a, g) => a + g.rules.wk.amt, 0);
const wkMonthly = amt => Math.round(amt * 52 / 12);
// the payday total if goal g took pct% (the cap check): the other goals' %s plus this one
const payPctWith = (g, pct, st = S) => payGoals(st).filter(x => !g || x.id !== g.id).reduce((a, x) => a + x.rules.pay.pct, 0) + pct;
const capText = tot => `That makes ${tot}% of your salary across your goals. The most is ${PAY_CAP}%, so lower this or another goal's payday rule first.`;
// v forints shared by weight, in whole forints; what is left after rounding goes to the first
function splitBy(v, ws){ const tot = ws.reduce((a, b) => a + b, 0); if(!tot || v <= 0) return ws.map(() => 0); const out = ws.map(w => Math.floor(v * w / tot)); out[0] += v - out.reduce((a, b) => a + b, 0); return out; }
const juniorOf = st => ((st.accounts || []).find(a => a.id === 'junior') || {v:0}).v;
const floorRoom = (st = S) => st.payday && st.payday.floor ? Math.max(0, juniorOf(st) - 20000) : Infinity;   // keeps 20 000 Ft on the account
// one salary: what each goal's payday rule moves. room = what may move (the 20 000 Ft floor); tight -> each goal gets its share of what can move
function paydayAlloc(st = S, room = floorRoom(st)){
  const gs = payGoals(st), want = gs.map(g => Math.round(st.income.amount * g.rules.pay.pct / 100)), need = want.reduce((a, b) => a + b, 0), v = Math.max(0, Math.min(need, room)), got = v >= need ? want : splitBy(v, want);
  return {rows:gs.map((g, i) => ({g, pct:g.rules.pay.pct, want:want[i], v:got[i]})), need, total:v, pct:payPct(st), tight:v < need};
}
// one week: every goal's weekly transfer (n weeks at once for the month step), the same floor
function weeklyAlloc(st = S, n = 1, room = floorRoom(st)){
  const gs = wkGoals(st), want = gs.map(g => g.rules.wk.amt * n), need = want.reduce((a, b) => a + b, 0), v = Math.max(0, Math.min(need, room)), got = v >= need ? want : splitBy(v, want);
  return {rows:gs.map((g, i) => ({g, v:got[i]})), need, total:v};
}
// a round-up coin split equally between the goals with round-ups on
const roundupAlloc = (coin, st = S) => { const gs = rrGoals(st); return splitBy(coin, gs.map(() => 1)).map((v, i) => ({g:gs[i], v})); };
// one line per goal for overviews: "10% of salary · 2 000 Ft a week · round-ups"
function rulesLine(g){ const r = rulesOf(g), b = [r.pay.on ? `${r.pay.pct}% of salary` : '', r.wk.on ? `${ft(r.wk.amt)} a week${r.wk.day !== 'mon' ? ' on ' + dayName(r.wk.day) : ''}` : '', r.rr.on ? 'round-ups' : ''].filter(Boolean); return b.length ? b.join(' · ') : 'No rules. You add money yourself'; }
// the goal the payday rule feeds first (Persi, the payday sheet title, insights): the first goal with a payday rule on, else the remembered main goal
const ruleGoal = () => payGoals()[0] || goalById(S.ruleGoal) || S.goals.find(g => !g.shared && !isEur(g)) || S.goals[0] || NOGOAL;
const weeklyGoal = () => wkGoals()[0] || ruleGoal();
const weeklyOn = g => !!g && rulesOf(g).wk.on;
// the analyst's "use this split" turns the payday rule on: on the main goal, at its own % (within the cap). Returns true when it turned one on
// self-checks and demo: one rule of a state's main goal (st.ruleGoal, else its first plain goal). patch = {pct} / {amt, day}
function setMain(st, k, on, patch){ const g = (st.goals || []).find(x => x.id === st.ruleGoal && !x.shared && !isEur(x)) || plainGoals(st)[0]; if(!g) return null; const r = ownRules(g); r[k].on = on; if(patch) Object.assign(r[k], patch); return g; }
function mainPayOn(){ if(payOn()) return false; const g = ruleGoal(); if(!goalIsPlain(g)) return false; const r = ownRules(g); if(payPctWith(g, r.pay.pct) > PAY_CAP) return false; r.pay.on = true; return true; }
// My split saves a payday total: the main goal takes the difference (the other goals keep theirs), never below 1% and never over the cap
function setPayTotal(tot){ const g = ruleGoal(); if(!goalIsPlain(g)) return; const r = ownRules(g), rest = payPctWith(g, 0); r.pay.on = true; r.pay.pct = Math.max(1, Math.min(PAY_CAP - rest, tot - rest)); }
const gSaved = g => g.id==='holiday' ? acc('persely').v : g.shared ? g.members.reduce((a,m) => a + m.amt, 0) : g.saved;
const gTarget = g => g.id==='holiday' ? S.persely.target : g.target;
const mine = g => g.shared ? (g.members.find(m => m.me) || {amt:0}).amt : gSaved(g);
const incomeShare = pct => Math.round(S.income.amount * pct / 100);
// how much reaches a goal per month from its own rules
function paceOf(g){
  if(g.shared || isEur(g)) return 0;
  let v = g.pace || 0; const r = rulesOf(g);
  if(r.pay.on) v += incomeShare(r.pay.pct);
  if(r.wk.on) v += wkMonthly(r.wk.amt);
  if(r.rr.on) v += Math.round(ROUND_EST / Math.max(1, rrGoals().length));   // round-ups are shared equally
  return v;
}
const gMonths = g => { const left = gTarget(g) - gSaved(g); if(left <= 0) return 0; const p = paceOf(g); return p ? Math.max(1, Math.ceil(left / p)) : -1; };
// the forecast lands after the goal's own date
// goal dates run on the demo clock (demoNow(): today + the demo months, key O), so after 12 demo months the forecast moves 12 months too
const isLate = g => { const m = gMonths(g); if(m <= 0 || !g.date) return false; const d = demoNow(); d.setMonth(d.getMonth() + m); return d > new Date(g.date + 'T12:00:00'); };
const inMonths = m => { const d = demoNow(); d.setMonth(d.getMonth() + m); return d.toLocaleDateString('en-GB',{month:'long', year:'numeric'}); };
/* the user's own first name for copy (Hungarian name order: family name first, so the last word) */
const userFirst = () => String(S.name || '').trim().split(/\s+/).pop() || 'you';
const txDate = x => /^\d{1,2} [A-Za-z]+$/.test(x.d || '') && x.ym ? fDate(`${x.ym}-${String(x.day).padStart(2, '0')}`) : x.d;   // a transaction date in the full format ("10 November 2026"); Today and Yesterday stay
const fDate = s => new Date(s + 'T12:00:00').toLocaleDateString('en-GB',{day:'numeric', month:'long', year:'numeric'});
const monthsTo = s => Math.max(0, (new Date(s + 'T12:00:00') - demoNow()) / (30.44 * 864e5));
// N6, one weekly figure: what a goal asks of a week to be there on its date, in 100 Ft steps. The wizard, the goal card and the goal page all show this one number.
const weeklyNeed = (target, saved, date) => { const left = target - saved; return left <= 0 || !date ? 0 : Math.ceil(left / (Math.max(.5, monthsTo(date)) * 4.345) / 100) * 100; };
const weeklyOf = g => weeklyNeed(gTarget(g), gSaved(g), g.date);
const weeklyShown = g => !!g && !g.shared && !isEur(g) && !!g.date && !isExact(g) && toGo(g) > 0;   // an exact day close by has its own Behind text
const total = () => S.goals.filter(g => !isEur(g)).reduce((a,g) => a + mine(g), 0);
const eurTotal = () => S.goals.filter(isEur).reduce((a,g) => a + g.saved, 0);
const r10 = v => v < 100 ? Math.round(v) : Math.round(v / 10) * 10;
const yearNet = (base = total()) => r10(Math.min(base, CAP) * rate() / 100 * (1 - TAX));
const plural = (n, w) => `${n} ${w}${n===1?'':'s'}`;
// the day the Junior package ends, on the demo clock (placeholder until OTP confirms the end rule)
const juniorEndLabel = (add = 0) => { const d = new Date(2026, 10 + (S.months || 0) + add, S.demoDay || 14); d.setDate(d.getDate() + (S.juniorDays || 0)); return d.toLocaleDateString('en-GB', {day:'numeric', month:'long', year:'numeric'}); };
// Junior transparency (flow A4, D2): the date is always a concrete day, never "soon". The conditions are placeholders until OTP confirms them.
// Keep my 3.0% (flow A4, D2): a request, then pending, then Graduate 3.0% when the first salary arrives at OTP. Months left: the request is good for 6 months (CONFIRM WITH OTP)
const keepPending = () => !!(S.keep && S.keep.pending) && !S.bridge;
const keepLeft = () => { const n = Math.max(0, 6 - ((S.months || 0) - ((S.keep && S.keep.at) || 0))); return n > 1 ? `${n} months left` : n === 1 ? '1 month left' : 'less than a month left'; };
function keepSalary(){ if(!keepPending()) return false; S.keep.pending = false; S.bridge = true; return true; }   // the first salary arrived: the badge becomes Graduate 3.0%
const RATE_COND = () => `On the first ${ft(CAP)} · 28% tax · Without a salary at OTP the rate returns to standard after 30 days' notice`;
const juniorRow = () => {   // Home, Persely tab (both states): one line, one date
  const d = S.juniorDays || 0, chev = `<span class="chev">${I('chev',20)}</span>`;
  if(keepPending()) return `<button class="row" data-go="grad"><span class="t24d" style="color:var(--green-i)">${I('sched',26)}</span><span class="t"><b class="u-bk-title">Waiting for your first salary at OTP · ${keepLeft()}</b><small>Junior 3.0% on the first ${ft(CAP)} until ${juniorEndLabel()}</small></span>${chev}</button>`;
  if(S.bridge) return `<button class="row" data-go="grad"><span class="t24d" style="color:var(--green-i)">${I('sched',26)}</span><span class="t"><b class="u-bk-title">3.0% until ${juniorEndLabel(12)}</b><small>On the first ${ft(CAP)}, while your salary comes to OTP</small></span>${chev}</button>`;
  return `<button class="row" data-go="grad">${d > 0 ? `<span class="t24d"><b class="num">${d}</b><small>${d === 1 ? 'day' : 'days'}</small></span>` : `<span class="t24d" style="color:var(--green-i)">${I('sched',26)}</span>`}<span class="t"><b class="u-bk-title">Junior package until ${juniorEndLabel()}</b><small>${d > 0 ? '' : 'Ends today · '}Keep my 3.0% on the first ${ft(CAP)}</small></span>${chev}</button>`;
};
const juniorPill = () => S.bridge ? `Graduate 3.0% until ${juniorEndLabel(12)}` : S.verified ? `Junior package until ${juniorEndLabel()}` : 'Standard rate';
// Good to know (A5-1): the facts behind the rate in one place. Wizard step 3, the trust line on the Persely tab and How Persely works open it.
const gtkHTML = () => `<!-- CONFIRM WITH OTP -->
  <ul class="gtk">
    <li><span class="gi">${I('rate',20)}</span><span><b>Rate and cap</b>3.0% a year on the first ${ft(CAP)}, until ${juniorEndLabel()}</span></li>
    <li><span class="gi">${I('info',20)}</span><span><b>Tax</b>28% tax on the interest, about 2.2% after tax</span></li>
    <li><span class="gi">${I('check',20)}</span><span><b>Access</b>Withdraw any time</span></li>
    <li><span class="gi">${I('check',20)}</span><span><b>Fees</b>No fees</span></li>
    <li><span class="gi">${I('shield',20)}</span><span><b>Safety</b><button class="link lnk44 gtk-l" data-depprot>Deposit protection ${I('chev',16)}</button></span></li>
    <li><span class="gi">${I('sched',20)}</span><span><b>Junior package</b>Junior package until ${juniorEndLabel()}</span></li>
  </ul>`;
const gtkCard = () => `<div class="card gtkc"><b class="gtk-h">Good to know</b>${gtkHTML()}</div>`;
const seedKind = () => S.seed || (S.goals.length ? 'existing' : 'new');
// streak flame (lit = orange, unlit = grey)
const flame = (s=22, lit=true) => `<svg class="flame" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true" style="flex:none"><path fill="${lit?PALETTE.orange:PALETTE.line2}" d="M12 2c1 4 5.2 5.6 5.2 11.2a5.2 5.2 0 0 1-10.4 0c0-2.1 1-3.6 2-4.6 0 2 1 3 2.1 3 0-3-1-5.2 1.1-9.6z"/><path fill="${lit?PALETTE.cYellow:PALETTE.bg}" d="M12 12.5c.6 1.6 2.4 2.2 2.4 4.3a2.4 2.4 0 0 1-4.8 0c0-1.2.8-2 1.5-2.4 0 .8.4 1.2.9 1.2 0-1.2-.4-2 0-3.1z"/></svg>`;
const fromName = id => acc(id).n;
const avBg = c => { const m = /^#([0-9a-f]{6})$/i.exec(c || ''); if(!m) return c; let v = [0,2,4].map(i => parseInt(m[1].substr(i,2),16)); const L = a => { const f = x => { x /= 255; return x <= .03928 ? x/12.92 : Math.pow((x+.055)/1.055, 2.4); }; return .2126*f(a[0]) + .7152*f(a[1]) + .0722*f(a[2]); };
  for(let i = 0; i < 40 && 1.05/(L(v)+.05) < 4.6; i++) v = v.map(x => Math.round(x*.95)); return '#' + v.map(x => x.toString(16).padStart(2,'0')).join(''); };   // white initials on an avatar need 4.5:1
const avatar = (m, s=26) => `<span class="fav" style="background:${avBg(m.c)};width:${s}px;height:${s}px;font-size:${Math.round(s*.42)}px">${m.me ? 'KA' : m.n[0]}</span>`;
/* ---------- a goal with an exact day (GTA VI launch day) that is close or past ----------
   Dates are normally the 1st of a month. A goal with another day is an exact deadline. Within 14 days of it (or after it) a weekly top-up can no longer
   help, so the goal is "behind": no forecast month, no weekly fix. Instead: a new date (with a small weekly top-up if needed) or a lump sum from Junior.
   "Today" for the deadline is the real date plus the demo months (key O), so pressing O moves past it. */
const demoNow = () => { const d = new Date(); d.setMonth(d.getMonth() + (S.months || 0)); return d; };
const isExact = g => !!g.date && g.date.slice(8) !== '01';
const toGo = g => Math.max(0, gTarget(g) - gSaved(g));
const daysTo = g => { const t = demoNow(); t.setHours(12,0,0,0); return Math.round((new Date(g.date + 'T12:00:00') - t) / 864e5); };
const isTight = g => !g.shared && !isEur(g) && isExact(g) && toGo(g) > 0 && daysTo(g) <= 14;
const dueTxt = g => { const n = daysTo(g); return n < 0 ? 'Goal date passed' : n === 0 ? 'Due today' : n === 1 ? 'Due tomorrow' : `Due in ${n} days`; };
/* ---------- forecast text when the money arrives well before the goal date ----------
   fcCalc(target, saved, monthly, date, now): pure. Reach month = now + ceil(left / monthly) months (the same count as gMonths()). over = the projected amount at the date
   (monthly x months to the date) is at least what is left, so the goal is reached before its date: show the reach month, never an amount above the target.
   far = over and the reach month is 6 or more months before the date (only then do the goal card and goal page add a word about it). */
function fcCalc(target, saved, monthly, date, now = demoNow()){
  const left = target - saved, n = left <= 0 ? 0 : monthly > 0 ? Math.max(1, Math.ceil(left / monthly)) : -1;
  if(n < 0) return {n, reachYm:null, over:false, far:false, gap:0, when:'', dateTxt:'', text:''};
  const r = new Date(now); r.setMonth(r.getMonth() + n);
  const reachYm = `${r.getFullYear()}-${String(r.getMonth() + 1).padStart(2, '0')}`, mName = r.toLocaleDateString('en-GB', {month:'long', year:'numeric'});
  const d = new Date(date + 'T12:00:00'), mo = Math.max(0, (d - now) / (30.44 * 864e5)), over = left > 0 && Math.round(monthly * mo) >= left;
  const gap = (d.getFullYear() * 12 + d.getMonth()) - (r.getFullYear() * 12 + r.getMonth()), when = n <= 0 ? 'this month' : n === 1 ? 'next month' : mName;
  const dateTxt = date.slice(8) === '01' ? d.toLocaleDateString('en-GB', {month:'long', year:'numeric'}) : fDate(date);
  const text = over ? (gap < 1 ? `You reach ${ft(target)} by ${dateTxt}.` : `You reach ${ft(target)} ${n <= 1 ? when : 'in ' + mName}, ${gap >= 6 ? 'well before' : 'before'} ${dateTxt}.`) : '';
  return {n, reachYm, over, far: over && gap >= 6, gap, when, dateTxt, text};
}
// the same for a goal, from its own rules (paceOf)
function forecastText(g){
  const none = {n:-1, reachYm:null, over:false, far:false, gap:0, when:'', dateTxt:'', text:''};
  if(!g || g.shared || isEur(g) || !g.date) return none;
  return fcCalc(gTarget(g), gSaved(g), paceOf(g), g.date);
}
const forecast = g => { if(isEur(g)) return 'Euro · no Junior rate'; if(g.shared) return `With ${g.members.filter(m=>!m.me).map(m=>m.n).join(', ') || 'nobody yet'} · you put in ${ft(mine(g))}`;
  if(isTight(g)) return daysTo(g) < 0 ? `<span class="late">Goal date passed · ${ft(toGo(g))} to go</span>` : `<span class="late">Behind · ${dueTxt(g).toLowerCase()}</span>`;
  const m = gMonths(g); return m === 0 ? 'Goal reached' : m < 0 ? 'Add a rule to see the date' : isLate(g) ? `<span class="late">${inMonths(m)} · late</span>` : forecastText(g).far ? `${forecastText(g).n <= 1 ? 'Next month' : inMonths(m)} · ahead` : inMonths(m); };

/* ---------- a late goal always gets a fix ----------
   lateFix(g): the smallest weekly top-up (500 Ft steps) that gets the goal there by its date. Applied to the weekly transfer that feeds this goal. */
function bumpWeekly(g, x){ const w = ownRules(g).wk;   // a fix tried on the goal's own weekly transfer (turned on for the try, back off when it returns to 0)
  if(!w.on){ w.on = true; w._was = w.amt; w.amt = 0; } w.amt += x;
  if(w.amt <= 0 && '_was' in w){ w.on = false; w.amt = w._was; delete w._was; } }
const keepBump = g => { if(g && g.rules) delete g.rules.wk._was; };   // a fix that was applied stays
function lateFix(g){
  if(g.shared || isEur(g) || isTight(g) || !isLate(g)) return 0;
  let x = 0; while(isLate(g) && x < 100000){ bumpWeekly(g, 500); x += 500; }
  bumpWeekly(g, -x); return x;
}
// a goal that is behind: the nearest month from which a weekly top-up of at most 2 000 Ft gets it there (tried on the goal, then put back)
function behindFix(g){
  if(!isTight(g)) return null;
  const keep = g.date, b = demoNow(), i0 = b.getFullYear() * 12 + b.getMonth(); let out = null;
  for(let n = 6; n <= 36 && !out; n++){
    g.date = pkIdxDate(i0 + n); let x = 0;
    while(isLate(g) && x < 2000){ bumpWeekly(g, 500); x += 500; }
    const ok = !isLate(g); bumpWeekly(g, -x);
    if(ok) out = {date:g.date, x};
  }
  g.date = keep; return out;
}
const lumpOf = g => { const v = Math.min(toGo(g), Math.floor((acc('junior').v - 20000) / 5000) * 5000); return v >= 10000 ? v : 0; };   // keeps 20 000 Ft in Junior
const behindLabel = f => `New date: ${pkMonthShort(f.date)}${f.x ? ` · +${ft(f.x)} a week` : ''}`;
const fixLabel = x => `+${ft(x)} a week → on time`;
// progress shown for a goal: never "0%" when money is in it, and a bar you can see (first step)
function pctOf(g){ const s = gSaved(g), r = s / gTarget(g) * 100, p = Math.min(100, Math.round(r));
  const tiny = s > 0 && r < 1, reached = s > 0 && s >= gTarget(g);   // under 1%: no percentage, the forint amount and "first step" instead. Reached: the word, never "192 881 Ft of 134 000 Ft"
  return {p, txt: reached ? 'Reached' : tiny ? '' : p + '%', tiny, reached, saved:s, w: s > 0 ? Math.max(p, 4) : p, first: s > 0 && r < 2}; }
const shownSaved = g => Math.min(gSaved(g), gTarget(g));   // the amount next to "of target" never goes above the target
const goalReached = g => !!g && !g.shared && gTarget(g) > 0 && gSaved(g) >= gTarget(g);

// the week counts for the streak (once per week)
function markSaved(){
  if(S.savedWeek) return false;
  S.savedWeek = true; S.streak++; S.best = Math.max(S.best, S.streak); S.history.push(S.week);
  if(S.streak % 4 === 0) S.skips = Math.min(2, S.skips + 1);   // 1 skip week for every 4 weeks of streak
  return true;
}
// one place where forints go into a goal: balances, transaction, streak
function depositTo(g, v, fromId='junior', how='Between my accounts'){
  const wasDone = gSaved(g) >= gTarget(g);
  acc(fromId).v -= v;
  if(g.id==='holiday') acc('persely').v += v; else if(g.shared) g.members.find(m => m.me).amt += v; else g.saved += v;
  S.monthSaved = (S.monthSaved || 0) + v;
  S.tx.unshift({...stamp(), d:'Today', n:'PERSELY DEPOSIT', s:how, a:-v, ic:'piggy', note:g.name});
  if(!wasDone && gSaved(g) >= gTarget(g) && S.analyst && S.analyst.on && !S.goalRewarded.includes(g.id)){   // goal reached: offer a goal-linked partner offer
    S.goalRewarded.push(g.id); S._offer = g.id; qSheet(() => S._offer ? SHEETS.goaloffer() : '', 'goaloffer', true);
  }
  return markSaved();
}
/* ---------- take out, edit, delete a goal ----------
   A goal can be edited or deleted only when no money is inside (the balance is 0): take it out first. Withdraw = the existing withdrawal to the Junior account.
   Delete removes the goal everywhere and moves or stops every rule that pointed at it (payday rule, weekly transfer, round-ups). */
const GOAL_ICONS = ['home','plane','car','lock','edu','game','fun','star'];
const goalEmpty = g => !!g && gSaved(g) === 0;
const goalIsPlain = g => !!g && !g.shared && !isEur(g);   // edit works on plain Ft goals; shared and euro Perselys can only be deleted
function withdrawFrom(g, v){   // v in the goal's own currency; returns the forints that arrive on Junior
  const huf = isEur(g) ? v * EUR_RATE : v;
  if(g.id === 'holiday') acc('persely').v -= v; else if(g.shared) g.members.find(m => m.me).amt -= v; else g.saved -= v;
  acc('junior').v += huf;
  S.tx.unshift({...stamp(), d:'Today', n: isEur(g) ? 'CURRENCY EXCHANGE' : 'PERSELY WITHDRAWAL', s:'Between my accounts', a:huf, ic:'piggy', note:g.name});
  return huf;
}
// where the saving rules go when a goal is deleted: the next plain goal, or nowhere (rules off)
const ruleHeirOf = id => S.goals.find(x => x.id !== id && goalIsPlain(x));
function goalRulesOf(g){   // which of the goal's own rules are on
  const x = rulesOf(g), r = []; if(x.pay.on) r.push('payday rule'); if(x.wk.on) r.push('weekly transfer'); if(x.rr.on) r.push('round-ups'); return r;
}
// money out of a goal into another plain forint goal (own money, nothing leaves Persely)
function takeInto(g, h, v){
  if(g.id === 'holiday') acc('persely').v -= v; else g.saved -= v;
  if(h.id === 'holiday') acc('persely').v += v; else h.saved += v;
}
// delete a goal. With money inside, dest says where it goes: 'junior' (withdraw) or the id of another plain goal. No dest and money inside: nothing happens (flow B2: "Move 59 000 Ft to ... and delete")
function removeGoal(id, dest){
  const g = goalById(id); if(!g) return null;
  let movedAmt = 0, movedTo = '';
  if(!goalEmpty(g)){
    if(g.shared || !dest) return null;
    if(dest === 'junior'){ movedAmt = gSaved(g); withdrawFrom(g, movedAmt); movedTo = 'your Junior account'; }
    else { const h = goalById(dest); if(!h || h.id === id || !goalIsPlain(h) || isEur(g)) return null; movedAmt = gSaved(g); takeInto(g, h, movedAmt); movedTo = h.name; }
  }
  // the rules belong to the goal, so they stop with it; the other goals keep theirs. The remembered main goal moves on
  const dg = dest && dest !== 'junior' ? goalById(dest) : null, heir = dg && goalIsPlain(dg) && dg.id !== id ? dg : ruleHeirOf(id), moved = goalRulesOf(g);
  if(S.ruleGoal === id) S.ruleGoal = heir ? heir.id : '';
  S.goals = S.goals.filter(x => x.id !== id);
  if(id === 'holiday') S.accounts = S.accounts.filter(a => a.id !== 'persely' || a.v !== 0);   // its empty Persely account goes with it
  S.goalRewarded = (S.goalRewarded || []).filter(x => x !== id);
  ['_detail','_goal','_out'].forEach(k => { if(S[k] === id) S[k] = ''; });
  if(S._offer === id) S._offer = null;
  syncSplit();
  return {name:g.name, moved, heir:'', amt:movedAmt, to:movedTo};   // heir stays '' : rules never move to another goal
}
// the Persely account of the holiday goal comes back when the demo brings that goal back
function healGoalAccounts(){ if(S.goals.some(g => g.id === 'holiday') && !acc('persely')){ const a = fresh('existing').accounts.find(x => x.id === 'persely'); if(a){ a.v = 0; S.accounts.splice(Math.min(1, S.accounts.length), 0, a); } } }
/* ---------- Persi's hints (replace the tour) ----------
   One hint per block, shown on the block's first appearance. A hint counts as seen only after it has been inside the visible area for 1 second
   (IntersectionObserver in watchHints), never because the user left the tab or opened a page. Got it also counts. S.hints remembers the seen ones.
   HINT_SHOWN holds the hints drawn on this visit, so a hint that has just counted stays until the next visit. Nothing shows before onboarding is done (the demo key T forces them). */
const HINTS = [['total','Your savings','3.0% a year on the first 500 000 Ft until {end}. Add or withdraw any time, no fees.'],
  ['goals','Your goals','Each goal shows the month you get there.'],
  ['auto','Money in each month','What moves in by itself. Change it on each goal.'],
  ['week','Your habits','Save any amount once a week to keep your streak going. Automatic savings count too.']];
let SETUP_COLLAPSED = false;   // "Not now" on the setup card: one row until the next visit to the Persely tab
const HINT_SHOWN = new Set(); let HINT_FORCE = false, HINT_OBS = null; const HINT_TIMERS = {};
const hintOn = key => (S.onboarded || HINT_FORCE) && (!S.hints[key] || HINT_SHOWN.has(key));
function pickHint(force){ if(force) HINT_FORCE = true; }
function markHintSeen(key){ if(S.hints[key]) return; S.hints[key] = 1; save(); }   // the one place a hint becomes "seen"
function endHint(key){ if(!key) return; markHintSeen(key); HINT_SHOWN.delete(key); renderView('hub'); }   // Got it
function showHints(){ S.hints = {}; HINT_SHOWN.clear(); HINT_FORCE = true; save(); closeSheet(); tab('hub'); }   // demo: show them again
function hintSeenAfter1s(key){   // called when a hint has stayed on screen for 1 s
  if(cur !== 'hub' || stack.length || document.hidden || (typeof demo !== 'undefined' && demo.locked)) return false;
  markHintSeen(key); return true; }
function watchHints(){   // after every render of the Persely tab: start the 1 s clock for each hint that is at least 60% inside the visible area
  if(HINT_OBS){ HINT_OBS.disconnect(); HINT_OBS = null; }
  Object.keys(HINT_TIMERS).forEach(k => { clearTimeout(HINT_TIMERS[k]); delete HINT_TIMERS[k]; });
  const els = document.querySelectorAll('#v-hub .hint[data-hk]'); if(!els.length || typeof IntersectionObserver === 'undefined') return;
  HINT_OBS = new IntersectionObserver(es => es.forEach(en => { const k = en.target.dataset.hk;
    if(en.isIntersecting && en.intersectionRatio >= .6){ if(!HINT_TIMERS[k] && !S.hints[k]) HINT_TIMERS[k] = setTimeout(() => { delete HINT_TIMERS[k]; hintSeenAfter1s(k); }, 1000); }
    else if(HINT_TIMERS[k]){ clearTimeout(HINT_TIMERS[k]); delete HINT_TIMERS[k]; } }), {threshold:[0, .6, 1]});
  els.forEach(e => HINT_OBS.observe(e));
}
const hintHTML = key => { const h = hintOn(key) && HINTS.find(x => x[0] === key); if(h) HINT_SHOWN.add(key); return h ? `<div class="hint" data-hk="${key}"><span class="hint-p">Persi</span><span class="hint-t"><b>${h[1]}.</b> ${h[2].replace('{end}', juniorEndLabel())}</span><button class="hint-x" data-hintok="${key}">Got it</button></div>` : ''; };
// Persi: one short line
function persiSays(){
  const g = ruleGoal(), pct = Math.min(100, Math.round(gSaved(g) / gTarget(g) * 100));
  if(!S.onboarded) return {mood:'happy', text:"Hi, I'm Persi. Let's pick a goal."};
  const rg = S.goals.find(x => goalReached(x) && !x.cont); if(rg) return {mood:'proud', text:`You did it: ${rg.name} is fully saved.`};   // a reached goal waits for Withdraw, New goal or Keep saving
  const bf = bfNow(); if(bf.on) return {mood:'concerned', text:`${bf.text}.`};   // late bills only
  if(S.analyst.on && S.bfDone) return {mood:'proud', text:'Bills paid. Fun is back on.'};
  if(!S.savedWeek && S.streak > 0) return {mood:'concerned', text:'Any amount by Sunday keeps your streak.'};
  if(!S.savedWeek) return {mood:'happy', text:'Any amount this week starts your streak.'};
  const bh = S.goals.find(isTight); if(bh) return {mood:'concerned', text:`${bh.name} is behind. That is okay, a new date can fix it.`};
  if(pctOf(g).first) return {mood:'proud', text:`First ${money(g, gSaved(g))} is in. ${money(g, gTarget(g) - gSaved(g))} to go.`};
  return {mood:'proud', text:`Week done. ${g.name}: ${pct}%.`};
}
