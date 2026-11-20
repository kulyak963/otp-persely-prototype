/* ================= demo data ================= */
const KEY='otp-clone-en-v5';
/* ---------- Saving rules per goal ----------
   Every plain forint goal owns its rules: g.rules = {pay:{on, pct}, wk:{on, amt, day}, rr:{on}}. Shared and euro goals have none.
   (Before: three global rules S.payday / S.weekly / S.roundup, each pointing at one goal, decision D9. migrateRules() moves saved state over.)
   How money is shared when several goals have rules (docs/per-goal-rules-notes.md):
   - Payday rule: each goal takes its own % of each salary; the %s add up. All goals together may take at most PAY_CAP (50%) of the salary:
     a change that would pass it is blocked with a message. With "Keep 20 000 Ft" on, at most the Junior balance minus 20 000 Ft moves; when that is
     less than the total, each goal gets the same part of what can move (in proportion to its %), and nothing moves when nothing is free.
   - Weekly transfer: each goal moves its own amount on its own day; the amounts add up. The same 20 000 Ft floor applies to the week's total.
   - Round-ups: the rounded coin of a card payment is split equally between the goals with round-ups on (the forint left over goes to the first); one goal gets it all.
   New goals start from S.ruleDefaults (Settings > Persely > Default saving rules for new goals). Existing goals never change when a default changes. */
function RULE_DEFAULTS(){ return {pct:10, wkAmt:0, wkDay:'mon', rr:false}; }   // pct 0 = Payday rule off, wkAmt 0 = Weekly transfer off
function offRules(){ return {pay:{on:false, pct:10}, wk:{on:false, amt:2000, day:'mon'}, rr:{on:false}}; }
function rulesFromDefaults(d){ d = d || RULE_DEFAULTS(); return {pay:{on:d.pct > 0, pct:d.pct > 0 ? d.pct : 10}, wk:{on:d.wkAmt > 0, amt:d.wkAmt > 0 ? d.wkAmt : 2000, day:d.wkDay || 'mon'}, rr:{on:!!d.rr}}; }
// old saved state (global rules) -> per goal rules. Self contained (function declaration): it runs inside the seeds and at load, before the helpers further down exist
function migrateRules(st){
  if(!st) return st;
  try{ if(st.persely && st.persely.auto){ st.weekly = {...(st.weekly || {}), on:true, amt:st.persely.amt || (st.weekly && st.weekly.amt) || 2000}; st.persely.auto = false; } }catch(e){}
  const P = st.payday || {}, W = st.weekly || {}, R = st.roundup || {}, goals = st.goals || [], plain = g => !!g && !g.shared && g.cur !== 'EUR', has = id => goals.some(g => g.id === id && plain(g));
  const main = has(st.ruleGoal) ? st.ruleGoal : (goals.find(plain) || {}).id, wkTo = has(W.goal) ? W.goal : main, rrTo = has(R.goal) ? R.goal : main, legacy = 'on' in P || 'on' in W || 'on' in R;
  goals.forEach(g => {
    if(!plain(g)){ delete g.rules; delete g.weekly; return; }
    if(!g.rules || legacy){
      const r = g.rules || offRules(), wkOn = !!W.on && wkTo === g.id, own = g.weekly || 0;
      if(legacy){ r.pay = {on:!!P.on && main === g.id, pct:P.pct || 10}; r.wk = {on:wkOn || own > 0, amt:(wkOn ? (W.amt || 2000) : 0) + own || W.amt || 2000, day:'mon'}; r.rr = {on:!!R.on && rrTo === g.id}; }
      g.rules = r;
    }
    const r = g.rules; r.pay = {on:!!(r.pay && r.pay.on), pct:(r.pay && r.pay.pct) || 10}; r.wk = {on:!!(r.wk && r.wk.on), amt:(r.wk && r.wk.amt) || 2000, day:(r.wk && r.wk.day) || 'mon'}; r.rr = {on:!!(r.rr && r.rr.on)};
    delete g.weekly;
  });
  st.payday = {ask:P.ask !== false, floor:P.floor !== false}; delete st.weekly; delete st.roundup;
  if(!st.ruleDefaults) st.ruleDefaults = RULE_DEFAULTS();
  return st;
}
/* Two seeds (decision D1). fresh() = the brand-new user, the pitch default: 0 Ft on Persely, no goals, no streak, not onboarded.
   fresh('existing') = the existing user (Summer holiday, PS5, Festival, an 8-week streak). The demo panel switches between them (key X). */
// moved here from js/13-settings-demo.js: used by the code below, and separate script files do not hoist function declarations across files
function notifDefault(){ return SIMPLE_PERSELY ? {bills:true, payday:true, story:true, card:true, incoming:true, junior:true, goal:true, mkt:false, quiet:false, qfrom:'22:00', qto:'07:00'} : {bills:true, payday:true, story:true, card:true, incoming:true, quiet:false, qfrom:'22:00', qto:'07:00'}; }   // money events and late bills on; the weekly reminder is S.remind and is an opt-in (B7)
const seedExisting = () => { const H = demoHistory(); const o = ({
  name:'Kiss Anna', ini:'KA',
  updateSeen:true, onboarded:true,     // existing user (the new-user seed turns onboarding off)
  verified:true, bridge:false,         // Junior customers get 3.0% automatically; bridge = 3.0% for 12 more months after Junior ends
  income:{amount:75000, day:5},        // money the bank sees coming in around the 5th (salary, scholarship, family)
  // money in: payday rule (share of each payment of 10 000 Ft or more, asks first), weekly transfer, round-ups
  // saving rules belong to each goal (g.rules, see migrateRules); payday keeps the account wide settings only: ask first, keep 20 000 Ft. ruleDefaults = Settings > Default saving rules for new goals
  payday:{ask:true, floor:true}, ruleGoal:'holiday', ruleDefaults:RULE_DEFAULTS(),
  // financial analyst: ON BY DEFAULT with an easy switch off (D10; CONFIRM WITH OTP / LEGAL: lawful basis). accepted:true = the split on screen is the suggestion, no opt-in step. anNote = the first-run notice on Home was dealt with. split = % of the monthly income base (must, ess, fun, save); only fun is a choice, the rest is refreshed from the data by syncSplit()
  analyst:{on:true, accepted:true, split:{must:44, ess:31, fun:20, save:5}}, anNote:false, monthEnd:false, txMark:H.old,   // txMark = rows before this month (the Aug-Oct history)
  // analytics (section 14): finished months, bill list (detected, locks kept), Bills pocket (built later; its balance is held outside the Junior balance), remembered categories, bills dismissed for a month, demo "today"
  closedYm:['2026-08','2026-09','2026-10'], bills:[], billsConfirmed:false, billsPocket:{on:false, bal:0}, catRules:{}, billSkip:{}, billSkipWhy:{}, bfDone:false, bfPush:'', demoDay:14, histV:3,
  // health score history: one entry per finished month, 1 = the indicator held that month. Score = 25 points per indicator x share of the last 3 months. Rewards earned / goal offers already used
  scoreHist:[{m:'July',earn:1,safe:1,buf:0,goal:0},{m:'August',earn:0,safe:1,buf:0,goal:0},{m:'September',earn:0,safe:1,buf:0,goal:1},{m:'October',earn:1,safe:1,buf:0,goal:1}], rewards:[], goalRewarded:[],   // txMark: how many transactions existed when this month began; this month = S.tx.slice(0, S.tx.length - S.txMark)
  // weekly streak: any amount once a week keeps it (automatic savings count too); it never changes the rate
  week:40, streak:8, best:8, savedWeek:false, skips:1, juniorDays:41, remind:true, keep:{pending:false, at:0},
  history:[32,33,34,35,36,37,38,39], skipped:[],
  challenges:{},
  friends:[{n:'Bence',c:PALETTE.blueI,s:11,g:62},{n:'Lili',c:PALETTE.cPink,s:6,g:35},{n:'Márk',c:PALETTE.yellow,s:3,g:71}], friendsOptIn:false, friendsOpen:false,   // hidden until the student taps "Add friends"
  rankBy:'streak', toured:true, hints:{}, monthSaved:23500, months:0, period:'November', interest:0, roundCount:0, roundSum:0, insight:false, insightUsed:false,
  goals:[
    {id:'holiday', name:'Summer holiday', ic:'plane', pace:6000, date:'2027-06-01', rules:offRules()},
    {id:'ps5', name:'PS5 + GTA VI', ic:'game', saved:46000, target:230000, pace:12000, date:'2026-11-19', rules:offRules()},
    {id:'fest', name:'Festival ticket', ic:'fun', saved:30000, target:45000, pace:5000, date:'2027-07-01', rules:offRules()}
  ],
  accounts:[
    {id:'junior', n:'Junior account', no:'11773119 - 10066592', v:87450, h:'Credit limit: 0 Ft'},
    {id:'persely', n:'Persely – Summer holiday', no:'11770116 - 10066592', v:64000, h:'Goal: 134 000 Ft'},
    {id:'megt', n:'Savings account', no:'11770116 - 10066601', v:120000, h:'Interest: 3.5%'}
  ],
  persely:{name:'Summer holiday', target:134000, auto:false, freq:'Monthly', day:'On the 1st of the month', amt:4000},
  disc:{activated:[]}, notif:notifDefault(), inbox:[],
  tx:H.tx
});
  o.bills = mergeBills([], detectRecurring(o).bills); o.seed = 'existing'; return o; };
// brand-new user: same bank history (money in, card payments, bills) but nothing in Persely yet. Nothing in the data contradicts "Pick a goal"
const seedNew = () => { const o = seedExisting();
  Object.assign(o, {seed:'new', updateSeen:true, onboarded:false, streak:0, best:0, skips:0, history:[], skipped:[], savedWeek:false, challenges:{}, friends:[], friendsOpen:false, friendsOptIn:false,
    toured:false, hints:{}, monthSaved:0, juniorDays:300, goals:[], rewards:[], goalRewarded:[],
    payday:{ask:true, floor:true}, ruleGoal:'holiday', ruleDefaults:RULE_DEFAULTS(), insight:false, insightUsed:false,
    remind:false});   // the weekly reminder is an opt-in (B7): the first goal asks, Settings can turn it on
  o.accounts = o.accounts.map(a => a.id === 'persely' ? {...a, n:'Persely', v:0, h:'No goals yet'} : a);
  return o; };
const fresh = (kind = 'new') => kind === 'existing' ? seedExisting() : seedNew();
let S; try{ S = JSON.parse(localStorage.getItem(KEY)) || fresh(); }catch(e){ S = fresh(); }
try{ (S.goals || []).forEach(g => { if(g.id === 'ps5' && g.name === 'PS5 + GTA 6'){ g.name = 'PS5 + GTA VI'; g.date = '2026-11-19'; } }); }catch(e){}   // older saved demo state
if(!S.analyst) S.analyst = fresh().analyst;   // state saved before the analyst existed
if(S.txMark === undefined) S.txMark = 0;
if(!S.scoreHist) S.scoreHist = fresh().scoreHist;   // state saved before the health score existed
if(!S.rewards) S.rewards = [];
if(!S.notif) S.notif = notifDefault();   // state saved before Settings > Notifications existed
if(SIMPLE_PERSELY) S.notif = {...notifDefault(), ...S.notif};   // new switches (Junior ends, goal milestones, offers) for older saved state
if(!S.inbox) S.inbox = [];
if(!S.hints) S.hints = {};   // Persi's one-time hints already shown
if(!S.goalRewarded) S.goalRewarded = [];
// state saved before the 3-month history: tag old rows with month + day, add the history behind them (older = further down, so txMark grows by the same number), then find the bills
if(!S.histV){ try{
  const H = demoHistory(); S.tx.forEach(t => { if(!t.ym){ const w = txWhen(t); t.ym = w.ym; t.day = w.day; } });
  if(S.months > 0) S.tx = S.tx.concat(H.nov, H.hist), S.txMark = (S.txMark || 0) + H.nov.length + H.hist.length;
  else { H.nov.forEach(e => { const k = e.ym.replace('-', '') * 100 + e.day, at = S.tx.findIndex(t => t.ym.replace('-', '') * 100 + t.day <= k); if(at < 0) S.tx.push(e); else S.tx.splice(at, 0, e); });
    S.tx = S.tx.concat(H.hist); S.txMark = (S.txMark || 0) + H.hist.length; }
  S.closedYm = ['2026-08','2026-09','2026-10'].concat(S.months > 0 ? [ymAt(S.months)] : []);
  S.histV = 2;
}catch(e){ S.histV = 2; } }
// saved history from before the small "Other" payments were lowered (so the main demo state projects a little left): bring the old rows in line. They sit in the older part of S.tx, so txMark shrinks with them
if(S.histV === 1){ try{
  const had = S.tx.length;
  S.tx = S.tx.filter(t => !((t.ym === '2026-09' && t.n === 'SZŐKE ANNA' && t.a === -2000) || (t.ym === '2026-10' && t.n === 'REVOLUT TOP-UP' && t.a === -1500)));
  S.tx.forEach(t => { if(t.n === 'TÓTH LILI' && t.a === -2000 && (t.ym === '2026-08' || t.ym === '2026-10')) t.a = -1000; if(t.n === 'REVOLUT TOP-UP' && t.ym === '2026-09' && t.a === -1500) t.a = -1000; });
  S.txMark = Math.max(0, (S.txMark || 0) - (had - S.tx.length)); S.histV = 2;
}catch(e){ S.histV = 2; } }
// saved history from before the family transfer was raised to 67 000 Ft: the four seeded months (Aug-Nov) follow it, so the projection reads one regular amount
if(S.histV === 2){ try{ S.tx.forEach(t => { if(t.n === 'KISS ISTVÁN' && t.a === 60000 && ['2026-08', '2026-09', '2026-10', '2026-11'].includes(t.ym)) t.a = FAMILY_AMT; }); S.histV = 3; }catch(e){ S.histV = 3; } }
if(S.friendsOptIn === undefined) S.friendsOptIn = !!S.friendsOpen;   // Friends is opt-in: saved state that never opened it stays hidden
if(!S.closedYm) S.closedYm = ['2026-08','2026-09','2026-10'];
if(!S.catRules) S.catRules = {};
if(!S.billSkip) S.billSkip = {};
if(!S.billSkipWhy) S.billSkipWhy = {};
if(!S.billsPocket) S.billsPocket = {on:false, bal:0};
if(!S.demoDay) S.demoDay = 14;
if(!S.keep) S.keep = {pending:false, at:0};   // Keep my 3.0% request (flow A4): pending until the first salary arrives at OTP
// the legacy Recurring transfer (Persely details) is the Weekly transfer rule now (D9), and the global rules are per goal now: old saved state moves over once
migrateRules(S);
if(!S.bills || !S.bills.length){ try{ refreshBills(S); }catch(e){ S.bills = []; } }
const save = () => { try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} };
const acc = id => S.accounts.find(a=>a.id===id);

