/* the tile chooser: the single entry to goal setup (flow A2). First block of the Persely tab for a user with no goal. */
function setupCard(){   // the 500 000 Ft cap and the end date in the line below are placeholders until OTP confirms the end rule
  if(SETUP_COLLAPSED) return `<button class="setup" data-setupopen><span class="u-ico-g">${I('star',24)}</span><span class="u-fx1"><b>Pick a goal when you're ready</b></span><span class="u-ico-g">${I('chev',20)}</span></button>`;
  return `<div class="card setupcard" id="setupcard"><h2>What are you saving for?</h2>
    <!-- CONFIRM WITH OTP -->
    <div class="k">${typeof spOn === 'function' && spOn() ? `3.0% a year on up to ${ft(CAP)}. Until ${juniorEndLabel()}.` : `3.0% a year on up to 500 000 Ft with your Junior account until ${juniorEndLabel()}`}</div>
    ${S.draft ? `<button class="row" data-onbresume><span class="ic">${I('star')}</span><span class="t">Continue your draft<small>${esc(S.draft.name || 'Your goal')}, ${ft(S.draft.target)}</small></span><span class="chev">${I('chev',20)}</span></button>` : ''}
    <div class="wn-grid three">${Object.entries(GOAL_PRESETS).map(([k,g]) => `<button data-tilepick="${k}">${I(g.ic,24)}${g.label}</button>`).join('')}<button data-tilepick="custom">${I('plus',24)}Something else</button></div>
    <button class="later" data-setuplater>Not now</button></div>`;
}
// the Persely tab before the first goal (flow 3.3, left column)
function vHubNew(){
  const chev = `<span class="chev">${I('chev',20)}</span>`, R = 104, C = 2 * Math.PI * R, arc = C * .75;
  const junior = juniorRow();
  return `<div class="tabtitle tt-gear">Persely<button class="tgear" data-settings="persely" aria-label="Persely settings">${I('gear',24)}</button></div>
  ${setupCard()}
  ${hintHTML('total')}<div class="ptot" data-tour="total">
    <div class="persi" data-tour="persi">${pig('happy', 48)}${hintOn('total') ? '<div class="persi-t"></div>' : `<div class="persi-t"><b>Persi</b><span>Hi, I'm Persi. Let's pick a goal.</span></div>`}
      ${storyRing()}</div>
    <div class="sec wrapsec"><span>Total in Persely</span><span class="pill ok">${juniorPill()}</span></div>
    <div class="gauge">
      <svg viewBox="0 0 250 250" style="transform:rotate(135deg)" aria-hidden="true"><circle cx="125" cy="125" r="${R}" fill="none" stroke="${PALETTE.line}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${arc} ${C}"/></svg>
      <div class="core"><small>Saved so far</small><b class="num">${ft(0)}</b></div>
    </div>
    <button class="trust" data-sheet="goodtoknow" aria-label="Good to know: withdraw any time, no fees, deposit protection"><span>${I('check',15)} Withdraw any time</span><span>${I('check',15)} No fees</span><span>${I('shield',15)} Deposit protection ›</span></button>
  </div>
  ${junior}
  ${hintHTML('week')}<div class="sec"><span>Your habits</span></div>
  <div class="card hab" data-tour="week"><div class="u-rowc">${flame(36, false)}<div class="u-fx1"><div style="font-size:1.0625rem;font-weight:700">Your streak starts with the first deposit</div><div class="u-k-sm">Any amount once a week keeps it going</div></div></div></div>
  <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:0 var(--sp-4);margin:var(--sp-2) 0 var(--sp-2)"><a class="link lnk44" style="display:inline-flex;align-items:center" data-sheet="how">How Persely works ${I('chev',16)}</a></div>`;
}
// one goal card with its fix button (Persely tab; the More page when SIMPLE_PERSELY is on)
function goalCardHTML(g){ const s=gSaved(g), t=gTarget(g), pc=pctOf(g), fx=lateFix(g), bf=behindFix(g);
  const attr = `data-goal="${g.id}"`;
  const right = g.shared ? `<span class="avs">${g.members.map(m=>avatar(m,24)).join('')}</span>` : pc.txt ? `<b class="u-c-gt">${pc.txt}</b>` : '';
  const wkTxt = weeklyShown(g) && !fx && !bf ? ` · about ${ft(weeklyOf(g))} a week` : '';   // N6: the same weekly figure as the wizard and the goal page
  const sub = pc.first && !g.shared ? `${money(g,s)} in · first step · ${forecast(g)}${wkTxt}` : `${money(g, Math.min(s, t))} of ${money(g,t)} · ${forecast(g)}${wkTxt}`;
  return `<div class="gwrap ${fx || bf ? 'fx' : ''}"><button class="card goal" ${attr}><div class="u-rowc"><span class="gic">${I(g.shared ? 'user' : isEur(g) ? 'euro' : g.ic,22)}</span><span class="u-fx0"><b class="u-bk-m">${esc(g.name)}</b><span class="num u-k-sm">${sub}</span></span>${right}</div><div class="prog" style="margin:var(--sp-3) 0 0"><i style="width:${pc.w}%"></i></div></button>${fx ? `<button class="gfix" data-latefix="${g.id}">${fixLabel(fx)}</button>` : bf ? `<button class="gfix" data-behindfix="${g.id}">${behindLabel(bf)}</button>` : ''}</div>`; }
function vHub(){
  if(!S.goals.length) return spOn() ? spHubFirst() : vHubNew();   // Phase 1: the first-run tab (js/14b-simple-persely.js); ?simple=0 keeps vHubNew
  if(spOn()) return vHubSimple();   // Phase 2: 4 blocks + honesty line + More (js/14b-simple-tab.js); ?simple=0 keeps the tab below
  const tot = total(), et = eurTotal(), ps = persiSays(), st = S.verified || S.bridge;
  const weeks = Array.from({length:8}, (_,i) => S.week - 7 + i);
  const gl = S.goals.filter(g => !isEur(g)), gT = gl.reduce((x, g) => x + gTarget(g), 0), gp = gT > 0 ? Math.min(1, gl.reduce((x, g) => x + gSaved(g), 0) / gT) : 0, R = 104, C = 2 * Math.PI * R, arc = C * .75;   // the ring: saved across goals against all targets, as Home shows spent against plan
  const chev = `<span class="chev">${I('chev',20)}</span>`;
  const junior = juniorRow();
  const juniorTop = !S.bridge && S.juniorDays <= 90;   // in the last 90 days it moves to the top
  return `<div class="tabtitle tt-gear">Persely<button class="tgear" data-settings="persely" aria-label="Persely settings">${I('gear',24)}</button></div>
  ${hintHTML('total')}<div class="ptot" data-tour="total">
    <div class="persi" data-tour="persi">${pig(ps.mood, 48)}${spNudgeHTML() || (hintOn('total') ? '<div class="persi-t"></div>' : `<div class="persi-t"><b>Persi</b><span>${ps.text}</span></div>`)}
      ${storyRing()}</div>
    <div class="sec wrapsec"><span>Total in Persely</span><span class="pill ${st?'ok':''}">${juniorPill()}</span></div>
    <div style="margin:-6px 0 0 var(--sp-2);font-size:0.78125rem;color:var(--muted-t)">${gl.length ? `${Math.round(gp * 100)}% of what your goals need` : 'Set a goal to fill the ring'}${et ? ` · + ${eur(et)} in euro goals` : ''}</div>
    <div class="gauge">
      <svg viewBox="0 0 250 250" style="transform:rotate(135deg)" aria-hidden="true">
        <circle cx="125" cy="125" r="${R}" fill="none" stroke="${PALETTE.line}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${arc} ${C}"/>${gp > 0 ? `
        <circle cx="125" cy="125" r="${R}" fill="none" stroke="${PALETTE.green}" stroke-width="16" stroke-linecap="round" stroke-dasharray="${arc*gp} ${C}"/>` : ''}
      </svg>
      <div class="core"><small>Saved so far</small><b class="num">${ft(tot)}</b></div>
    </div>
    <div class="avg">${st ? `<span style="text-align:center"><b class="g">${rateLabel()}</b> · about <span class="num">${ft(yearNet())}</span> a year after tax</span>` : `<span style="text-align:center">0.01% · about <span class="num">${ft(yearNet())}</span> a year</span>`}</div>
    <div class="hero-btns"><button class="btn" data-sheet="hubsave">Add money</button><button class="btn w" data-sheet="hubout">Withdraw</button></div>
    <button class="trust" data-sheet="goodtoknow" aria-label="Good to know: withdraw any time, no fees, deposit protection"><span>${I('check',15)} Withdraw any time</span><span>${I('check',15)} No fees</span><span>${I('shield',15)} Deposit protection ›</span></button>
    ${st ? `<div class="fine" style="margin-top:var(--sp-2)">${S.bridge ? `Graduate: 3.0% on the first ${ft(CAP)} until ${juniorEndLabel(12)}, while your salary comes to OTP` : `3.0% on the first ${ft(CAP)} is included in your Junior package until ${juniorEndLabel()}. Nothing to sign up for`}</div>` : ''}
  </div>

  ${S.onboarded ? '' : `<button class="setup" data-onbstart><span class="u-ico-g">${I('star',24)}</span><span class="u-fx1"><b>Set a goal and a saving rule</b><small>Takes 1 minute</small></span><span class="u-ico-g">${I('chev',20)}</span></button>`}

  ${juniorTop ? junior : ''}

  ${hintHTML('goals')}<div class="sec" data-tour="goals"><span>Goals</span><a data-sheet="newgoal">New ${I('plus',16)}</a></div>
  ${S.goals.map(goalCardHTML).join('')}
  ${S.goals.length ? '' : `<div class="card"><b class="u-bk-m">No goals yet</b><div class="k" style="margin:var(--sp-1) 0 var(--sp-3)">Set a goal and Persely shows you the month you get there.</div><button class="btn" data-sheet="newgoal">Set a goal</button></div>`}

  ${S.goals.length ? savingRulesBlock() : ''}

  ${moneyInPanel()}

  ${juniorTop ? '' : junior}

  ${hintHTML('week')}<div class="sec"><span>Your habits</span></div>
  <div class="card hab" data-tour="week" style="${!S.savedWeek && S.streak ? 'box-shadow:inset 0 0 0 1.5px var(--orange-lt),var(--sh)' : ''}">
    <div class="u-rowc">${flame(36, S.streak > 0)}<div class="u-fx1"><div style="font-size:1.375rem;font-weight:700">${S.streak}-week streak</div><div class="u-k-sm">Best: ${S.best} · ${plural(S.skips,'skip')} left</div></div>${S.savedWeek ? '<span class="pill ok">Saved</span>' : S.streak ? '<span class="pill open">Ends Sunday</span>' : ''}</div>
    <div class="wk">${weeks.map(w=>{ const on = S.history.includes(w), sk = (S.skipped||[]).includes(w);
      return `<div class="${on?'on':''} ${sk?'sk':''} ${w===S.week?'today':''}"><i>${on ? '✓' : sk ? '–' : ''}</i><span>${w===S.week ? 'Now' : ''}</span></div>`; }).join('')}</div>
    ${remindRow()}${scoreRow()}
  </div>

  ${NEW_PERSELY_IA ? '' : splitCard() + billsBlock()}
  <div class="prow">${NEW_PERSELY_IA ? analysisRow() : ''}${perksRow()}${yearRow()}</div>

  ${!NEW_PERSELY_IA || S.friendsOptIn ? friendsCard() : ''}
  <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:0 var(--sp-4);margin:var(--sp-2) 0 var(--sp-2)"><a class="link lnk44" style="display:inline-flex;align-items:center" data-sheet="how">How Persely works ${I('chev',16)}</a>${NEW_PERSELY_IA && !S.friendsOptIn ? addFriendsLink() : ''}</div>`;
}
// demo: one week passes
function nextWeek(){
  let note = 'New week. Save any amount by Sunday.';
  if(!S.savedWeek && S.streak > 0){
    if(S.skips > 0){ S.skips--; S.skipped = (S.skipped||[]).concat(S.week); note = 'Last week was open. A skip week kept your streak.'; }
    else { S.streak = 0; note = 'Streak started again. Any amount this week starts a new one.'; }
  }
  S.week++; S.savedWeek = false; S.juniorDays = Math.max(0, S.juniorDays - 7);
  { const W = weeklyAlloc();   // every goal's own weekly transfer; the amounts add up, the 20 000 Ft floor applies to the total
    W.rows.forEach(r => { if(r.v > 0) depositTo(r.g, r.v, 'junior', 'Weekly transfer'); });
    if(W.total > 0) note = W.rows.filter(r => r.v > 0).length > 1 ? `New week. Your weekly transfers moved ${ft(W.total)}, so this week is done.` : `New week. ${ft(W.total)} moved by your weekly transfer, so this week is done.`; }
  renderAll(); toast(note);
}
// demo: one month passes (salary, rules, card payments with round-ups, interest)
const MONTH_CARD = 63900, MONTH_ROUND = 3000, MONTH_TX = 30;
// small month-to-month differences in card spending (index = S.months % 12; index 1 = the first simulated month, kept at 0 for the self-checks). Essentials only go down, so they stay within the split
const ESS_VAR = [-500, 0, -900, -400, -1600, -200, -1100, -700, -1300, -300, -1000, -600], FUN_VAR = [600, 0, 1800, -1200, 2400, -600, 1500, -1800, 900, -300, 2100, -900];
const SAV_RATE = 3.5;   // the Savings account's demo rate (shown on its card); interest after tax is credited each simulated month
function monthStep(quiet){
  const g = ruleGoal(), inc = S.income.amount, planDone = splitView(); let moved = 0, lenBefore = S.tx.length;   // planDone: the split the student saw during the month that ends
  const done = new Date(2026, 10 + S.months, 1).toLocaleDateString('en-GB',{month:'long'});   // the month that just ended
  S.txMark = S.tx.length;   // a new month starts: the split use counts from here
  S.months++; if(!S.closedYm.includes(ymAt(S.months))) S.closedYm.push(ymAt(S.months));   // the simulated month is a full month for the projection
  S.period = new Date(2026, 10 + S.months, 1).toLocaleDateString('en-GB',{month:'long'}); S.storySeen = false; S.monthEnd = false;   // a new month: the story is not ready until its month end
  // four weeks pass; the rules keep the streak alive
  const ran = anyRule();
  for(let i = 0; i < 4; i++){ S.week++; if(ran){ S.streak++; S.best = Math.max(S.best, S.streak); S.history.push(S.week); } else S.streak = 0; }
  S.savedWeek = ran; S.monthSaved = 0; S.juniorDays = Math.max(0, S.juniorDays - 30);
  acc('junior').v += inc; S.tx.unshift({...stamp(), d:'Today', n:'SALARY', s:'Incoming transfer', a:inc, ic:'money'}); keepSalary();
  paydayAlloc().rows.forEach(r => { if(r.v > 0){ depositTo(r.g, r.v, 'junior', `Payday rule: ${r.pct}%`); moved += r.v; } });   // each goal its own %, the floor on the total
  weeklyAlloc(S, 4).rows.forEach(r => { if(r.v > 0){ depositTo(r.g, r.v, 'junior', 'Weekly transfers (4)'); moved += r.v; } });
  { const vi = S.months % 12, ev = ESS_VAR[vi], fv = FUN_VAR[vi], card = MONTH_CARD + ev + fv;   // months differ a little, so the fast-forward and the year look real (month 1 is the reference month)
    acc('junior').v -= card; S.tx.unshift({...stamp(), d:'Today', n:`CARD PAYMENTS (${MONTH_TX})`, s:'Shops, food, transport', a:-card, ic:'cart', parts:{ess:36900 + ev, fun:27000 + fv, cats:{...spreadCats(36900 + ev, 'ess'), ...spreadCats(27000 + fv, 'fun')}}}); }
  if(rrGoals().length){ roundupAlloc(MONTH_ROUND).forEach(r => { if(r.v > 0) depositTo(r.g, r.v, 'junior', `Round-ups (${MONTH_TX} payments)`); }); S.roundCount += MONTH_TX; S.roundSum += MONTH_ROUND; moved += MONTH_ROUND; }   // shared equally
  // interest after tax, credited to each forint Persely by its share
  const base = total(), net = Math.round(Math.min(base, CAP) * rate() / 100 / 12 * (1 - TAX));
  if(net > 0 && base > 0){
    S.goals.filter(x => !isEur(x)).forEach(x => { const part = Math.round(net * mine(x) / base); if(part <= 0) return;
      if(x.id==='holiday') acc('persely').v += part; else if(x.shared) x.members.find(m=>m.me).amt += part; else x.saved += part; });
    S.tx.unshift({...stamp(), d:'Today', n:'INTEREST', s:`Persely · ${rateLabel()}, after tax`, a:net, ic:'piggy'});
    S.interest += net;
  }
  if(!S.insightUsed) S.insight = true;
  { const sv = acc('megt'); if(sv){ const r = Math.round(sv.v * SAV_RATE / 100 / 12 * (1 - TAX)); sv.v += r; S.savInt = (S.savInt || 0) + r; S._savNow = r; } }
  // section 14: the family transfer on the 1st, and the must-pay bills on their days up to "today" (the phone, on the 20th, is still to come). Paid from the Bills pocket while it has money.
  const mday = S.demoDay || 14, brows = [{...stamp(), day:1, d:'1 ' + S.period, n:'KISS ISTVÁN', s:'Incoming transfer', a:FAMILY_IN, ic:'money', ref:'havi támogatás'}]; acc('junior').v += FAMILY_IN;
  // one small friend transfer in each simulated month, so the "other transfers in" part of the projection never drops to 0 (a different friend each month, so it never reads as a regular income)
  { const fr = FRIEND_IN[S.months % FRIEND_IN.length]; acc('junior').v += FRIEND_IN_AMT; brows.push({...stamp(), day:9, d:'9 ' + S.period, n:fr[0], s:'Instant transfer', a:FRIEND_IN_AMT, ic:'money', ref:fr[1]}); }
  mustBills().filter(b => b.day <= mday).forEach(b => { const fp = pocketBal() >= b.exp, last = S.tx.find(t => t.a < 0 && payeeKey(t) === b.key);
    if(fp) S.billsPocket.bal -= b.exp; else acc('junior').v -= b.exp;
    brows.push({...stamp(), day:b.day, d:b.day + ' ' + S.period, n:b.key, s:last ? last.s : 'Transfer out', a:-b.exp, ic:last ? last.ic : 'wallet', ...(last && last.ref ? {ref:refBase(last.ref)} : {}), ...(fp ? {note:'Paid from Bills pocket'} : {})}); });
  { const mine = S.tx.splice(0, S.tx.length - lenBefore).concat(brows); mine.sort((x, y) => y.day - x.day); S.tx.unshift(...mine); }   // newest day first
  S.bfDone = false; S.bfPush = '';
  S.flowLog = (S.flowLog || []).concat([flowOf(S.tx.slice(0, S.tx.length - lenBefore), net)]).slice(-24);   // what this month moved, for the fast-forward and the year screen
  // health score: log the finished month; reward when the analyst is on and Fun and Essentials stayed within the split
  const oldScore = scoreNow(), u = splitUse(), spent = u.ess + u.fun, a = S.analyst;
  S.scoreHist.push({m:done, earn: spent < inc ? 1 : 0, safe: acc('junior').v >= 0 ? 1 : 0, buf: acc('junior').v >= spent ? 1 : 0, goal: u.save > 0 ? 1 : 0});
  S.scoreHist = S.scoreHist.slice(-8);
  const newScore = scoreNow(); S._rw = null;
  const sv = planDone;   // budgets of the split as My split showed them during the month, in the same base
  if(a.on && a.accepted && u.ess <= sv.by.ess.amt && u.fun <= sv.by.fun.amt){
    const rew = {id:'r' + S.months, title:'5% cashback at a partner', partner:'Corner Market', steps:REWARD_STEPS, note:`Valid in ${nextMonthName()}. Up to 2 000 Ft back.`, why:`Stayed within the split in ${done}`};
    S.rewards.unshift(rew); S._rw = {old:oldScore.t, now:newScore.t, rew, ess:u.ess, fun:u.fun, essB:sv.by.ess.amt, funB:sv.by.fun.amt};
  }
  renderAll();
  if(!quiet){   // one thing at a time: the reward push, then the reward sheet, then the summary toast
    if(S._rw) notify({title:'Persi · Persely', persi:true, body:`Reward earned: ${S._rw.rew.title}. ${S._rw.rew.why}.`, url:'hub'});
    if(S._rw) qSheet(() => SHEETS.reward(), 'reward');
    toast(`One month later. Salary in, ${ft(moved)} saved by your rules${net ? `, +${ft(net)} interest` : ''}.`);
  }
  return net;
}

/* ---------- what one simulated month moved (for the fast-forward river and "Your year in Persely") ----------
   rows = the transactions monthStep added. in = income; bills = must-pay bills paid; ess / fun = card spending; saved = into Persely (rules, round-ups, manual); interest = Persely interest after tax */
function flowOf(rows, net){
  const locked = new Set(mustBills().map(b => b.key)), f = {ym:ymAt(S.months), name:S.period, in:0, salary:0, family:0, bills:0, ess:0, fun:0, other:0, saved:0, interest:net || 0, sav:S._savNow || 0, billsN:0};
  rows.forEach(t => { const ty = txType(t);
    if(ty === 'in'){ f.in += t.a; if(/SALARY/.test(t.n)) f.salary += t.a; else f.family += t.a; return; }
    if(t.n === 'PERSELY DEPOSIT'){ f.saved += -t.a; return; }
    if(ty === 'own') return;
    if(t.parts){ f.ess += t.parts.ess || 0; f.fun += t.parts.fun || 0; return; }
    if(t.a < 0 && locked.has(payeeKey(t))){ f.bills += -t.a; f.billsN++; return; }
    if(t.a < 0) f.other += -t.a; });
  f.ptotal = total(); return f;
}
/* ================= sub pages ================= */
function nekedCards(compact){
  const art = (bg,icon,col='var(--white)') => `<div class="im" style="background:${bg};color:${col}">${I(icon,54)}</div>`;
  return `<div class="hcar">
    <button class="nk" data-demo="New features in MobilBank">${art('linear-gradient(135deg,var(--act),var(--green-i))','cards')}<div class="tx2"><b>New features in MobilBank</b><p>Check out our latest features!</p><span class="tag new"><span>New</span></span></div></button>
    <button class="nk" data-demo="Fraud quiz">${art('linear-gradient(135deg,var(--blue-t),var(--blue-i))','lock')}<div class="tx2"><b>How well prepared are you against fraud?</b><p>Test your knowledge!</p><span class="tag tip"><span>Tip</span></span></div></button>
  </div>
  ${compact?'':'<div class="dots" style="margin-bottom:var(--sp-4)"><i class="on"></i><i></i><i></i></div>'}
  ${S.goals.length ? '' : `<button class="card offer" data-tab="hub" style="width:100%;text-align:left"><div class="tx2"><b class="u-fs-m">Start saving efficiently!</b><p style="margin:var(--sp-2) 0 var(--sp-3);font-size:var(--fs-s);color:var(--muted-t)">Create your Persely and save for your goals free of charge.</p><span class="tag off"><span>Offer</span></span></div><div class="im" style="background:linear-gradient(135deg,var(--c-violet),var(--blue));color:var(--green-lt)">${I('piggy',56)}</div></button>`}`;
}

let nekTab = 0;
// edit and delete live on the goal page. Edit works with money inside (D8); delete with money asks where it goes. Only a shared Persely with other people's money has to be emptied first.
function goalManageHTML(g){
  if(g.shared && !goalEmpty(g)) return `<div class="card u-mt6" role="group" aria-label="Edit or delete this goal"><div class="k" style="font-size:var(--fs-m);line-height:1.45;color:var(--ink2)">Edit or delete works when everyone has taken their money out.</div></div>`;
  return `<div class="card u-mt6" role="group" aria-label="Edit or delete this goal"><div class="hero-btns u-m0">${goalIsPlain(g) ? `<button class="btn w" data-gedit="${g.id}" aria-label="Edit ${esc(g.name)}">Edit goal</button>` : ''}<button class="btn w" data-gdel="${g.id}" aria-label="Delete ${esc(g.name)}" style="color:var(--orange-t)">Delete goal</button></div></div>`;
}
// the goal's own saving rules, edited right here (switch, % or amount, day), each change saved at once with a 10 s Undo.
// The forecast line under them uses the one weekly figure (weeklyNeed) and says what the rules add a week.
const rulesWeek = g => Math.round(paceOf(g) * 12 / 52 / 100) * 100;   // what the goal's rules (and planned extras) add in a week, in the weeklyNeed steps
function rulesEffect(g){
  const left = toGo(g), m = gMonths(g);
  if(left <= 0) return 'Goal reached. Your rules keep adding to it until you change them.';
  if(!g.date) return m > 0 ? `With these rules: there in ${inMonths(m)}` : 'Switch a rule on to see when you get there';
  const need = weeklyOf(g), have = rulesWeek(g);
  if(!paceOf(g)) return `No rule is on. On time needs about ${ft(need)} a week`;
  return `${isLate(g) ? 'Late with these rules' : 'On time with these rules'} · needs about ${ft(need)} a week, your rules add about ${ft(have)}`;
}
function ruleRowsHTML(g){
  const r = rulesOf(g), id = g.id, cap = S._cap && S._cap.id === id ? S._cap.text : '', tot = payPct(), others = rrGoals().filter(x => x.id !== id);
  const blk = (key, title, sub, on, body) => `<div class="srb" data-grblock="${key}"><button class="opt slim ${on ? 'on' : ''}" data-grtog="${key}:${id}" role="switch" aria-checked="${on}"><span class="t"><b>${title}</b><small>${sub}</small></span><span class="tg ${on ? 'on' : ''}"></span></button>${on && body ? `<div class="subopts">${body}</div>` : ''}${key === 'pay' && cap ? `<div class="fine capmsg" role="alert">${cap}</div>` : ''}</div>`;
  const chip = (attr, val, on, label, extra = '') => `<button class="chip ${on ? 'on' : ''}" ${attr}="${id}:${val}" aria-pressed="${on}"${extra}>${label}</button>`;
  const wks = [...new Set([...WK_AMTS, r.wk.amt])].sort((a, b) => a - b);
  return `<div class="sec" data-rules="${id}"><span>Saving rules for this goal</span></div>
  <div class="grules">
    ${blk('pay', 'Payday rule', r.pay.on ? `${r.pay.pct}% of each salary, about ${ft(incomeShare(r.pay.pct))}` : 'A share of each salary or scholarship. We ask first.', r.pay.on,
      `<div class="chips eq u-m0" role="group" aria-label="Share of each salary">${RULE_PCTS.map(x => chip('data-grpct', x, r.pay.pct === x, x + '%')).join('')}</div>
       <div class="fine u-mt4-b12">Keeps ${ft(20000)} on your account; if money is tight, less or nothing moves. All goals together: ${tot}% of your salary (the most is ${PAY_CAP}%).</div>`)}
    ${blk('wk', 'Weekly transfer', r.wk.on ? `${ft(r.wk.amt)} every ${dayName(r.wk.day)}` : 'The same amount every week. Counts for your streak.', r.wk.on,
      `<div class="chips eq u-m0" role="group" aria-label="Amount">${wks.map(x => chip('data-grwk', x, r.wk.amt === x, ft(x))).join('')}</div>
       <div class="flabel">Day</div><div class="chips eq u-m0" role="group" aria-label="Day">${WK_DAYS.map(([k, n]) => chip('data-grday', k, r.wk.day === k, n.slice(0, 3), ` aria-label="${n}"`)).join('')}</div>
       <div class="fine u-mt4-b12">About ${ft(wkMonthly(r.wk.amt))} a month.${wkGoals().length > 1 ? ` Weekly transfers on all goals add up to ${ft(wkTotal())} a week.` : ''}</div>`)}
    ${blk('rr', 'Round-ups', r.rr.on && others.length ? `On, shared equally with ${others.map(x => esc(x.name)).join(' and ')}` : 'A 1 190 Ft coffee moves 20 Ft; we double it', r.rr.on, '')}
    <div class="fine grfc" role="status">${rulesEffect(g)}</div>
  </div>`;
}
/* ---------- Simple Persely goal page (plan 2c, 2f items 12 to 14) ----------
   On top: the reached card (as before), saved of target, the bar, one date sentence, Add money / Withdraw and the honesty line.
   Edit, Delete, the goal's own saving rules and the rate line sit under "Settings for this goal" (one tap opens it; S._gset holds the open goal,
   screen state only). The rules, Undo, Delete with Move and the late fixes are the same code as before. */
function goalDateLine(g){
  const s = gSaved(g), m = gMonths(g), late = isLate(g), fc = forecastText(g);
  if(isEur(g) || g.shared) return g.date ? `Your date is ${fDate(g.date)}.` : '';
  if(isTight(g)) return daysTo(g) < 0 ? `Your date has passed. ${ft(toGo(g))} to go. Nothing is lost, pick a new date.` : `${dueTxt(g)}. ${ft(toGo(g))} to go. Moving the date is fine.`;
  if(m === 0) return g.cont ? 'Reached. Your rules keep adding here.' : 'Reached. Choose what to do above.';
  if(m < 0) return s > 0 ? 'Add money or turn on a rule. Then you see when you get there.' : (S.verified || S.bridge ? 'Add money and it starts to earn 3.0%.' : 'Add money to start. Then you see when you get there.');
  const when = fc.far && fc.n <= 1 ? fc.when : 'in ' + inMonths(m);
  return `At this pace you get there ${when}.${g.date ? late ? ' That is after your date.' : ' That is before your date.' : ''}`;
}
function goalRateHTML(g){   // plan 2f items 12 and 13: the after tax figure for this goal, or the empty state (no more "About 0 Ft a year after tax on 0 Ft")
  const s = gSaved(g), on = S.verified || S.bridge;
  const head = s <= 0 ? (on ? 'Add money and it starts to earn 3.0%.' : 'Add money and it starts to earn 0.01%.') : `This goal earns about ${ft(yearNet(s))} a year, after tax.`;
  return `<div class="li"><span class="ic">${I('rate')}</span><span class="t"><b>${head}</b><small>${on ? `3.0% a year on up to ${ft(CAP)}. Until ${S.bridge ? juniorEndLabel(12) : juniorEndLabel()}.` : 'Standard rate 0.01% a year.'}</small></span></div>`;
}
function goalPageSimple(g){
  const s = gSaved(g), t = gTarget(g), pc = pctOf(g), late = isLate(g), fx = lateFix(g), tight = isTight(g), bf = behindFix(g), lump = tight ? lumpOf(g) : 0, rch = goalReached(g), open = S._gset === g.id;
  let html = `${rch && !g.cont ? `<div class="card u-mt6 reached" role="group" aria-label="Goal reached"><b class="u-fs-m">You did it: ${esc(g.name)} is fully saved</b><div class="k u-mt4-b12">${gSaved(g) > t ? `${money(g, gSaved(g) - t)} more is in it. ` : ''}Your saving rules stay on this goal until you choose.</div>
      <div class="hero-btns u-m0"><button class="btn w" data-outgoal="${g.id}">Withdraw</button><button class="btn w" data-sheet="newgoal">New goal</button><button class="btn" data-keepsaving="${g.id}">Keep saving</button></div></div>` : ''}<div class="card gsimple ${rch && !g.cont ? '' : 'u-mt6'} ${S._hl === g.id ? 'hl' : ''}">${S._hl === g.id ? '<span class="pill ok">New goal</span>' : ''}${g.shared ? `<span class="pill ok">Shared Persely · ${plural(g.members.length,'member')}</span>` : ''}
    <div class="hero-v num" style="margin-top:${g.shared || S._hl === g.id ? 8 : 0}px">${money(g, Math.min(s, t))} <small class="k u-fs-14b">of ${money(g,t)}</small></div>
    <div class="prog" style="margin:var(--sp-2) 0 var(--sp-2);height:10px"><i style="width:${pc.w}%"></i></div>
    <p class="gdate${late || tight ? ' late' : ''}">${goalDateLine(g)}</p>
    ${!g.shared && !isEur(g) && late && (fx || bf || lump) ? `${fx ? `<button class="btn" data-latefix="${g.id}">${fixLabel(fx)}</button>` : ''}${!fx && bf ? `<button class="btn" data-behindfix="${g.id}">${behindLabel(bf)}</button>` : ''}${!fx && lump ? `<button class="btn w" data-behindlump="${g.id}">Add ${ft(lump)} from Junior</button>` : ''}${S.analyst.on && S.analyst.accepted ? '' : '<button class="btn ghost" data-sheet="analyst">Or see what the analyst suggests</button>'}` : ''}
    ${isEur(g) ? `<div class="note" style="margin:var(--sp-3) 0 0">Buy euros bit by bit. Demo rate: 1 € = ${EUR_RATE} Ft. No Junior rate.</div>` : ''}
    <div class="hero-btns" style="margin:var(--sp-4) 0 var(--sp-2)"><button class="btn" data-pickgoal="${g.id}">Add money</button><button class="btn w" data-outgoal="${g.id}">Withdraw</button></div>
    ${isEur(g) ? '' : rsLine()}</div>`;
  if(g.shared) html += `<div class="sec"><span>Who put in what</span></div><div class="card lst">${g.members.map(mb=>`<div class="li">${avatar(mb,32)}<span class="t"><b>${mb.me ? esc(userFirst()) + ' (you)' : esc(mb.n)}</b><div class="prog" style="margin:var(--sp-2) 0 0;height:6px"><i style="width:${Math.round(mb.amt / Math.max(1,s) * 100)}%"></i></div></span><b class="num">${ft(mb.amt)}</b></div>`).join('')}</div>
      ${g.members.length < 5 ? `<button class="btn w" style="margin:var(--sp-2) 0 var(--sp-1)" data-invite>Invite a friend</button>` : ''}`;
  html += `<button class="row gsetb u-mt6" data-gset="${g.id}" aria-expanded="${open}" aria-controls="gset-${g.id}"><span class="ic">${I('gear')}</span><span class="t">Settings for this goal<small>${isEur(g) || g.shared ? 'Edit or delete.' : 'Rules and rate. Edit or delete.'}</small></span><span class="chev${open ? ' up' : ''}">${I('chev',20)}</span></button>
    <div class="gset" id="gset-${g.id}"${open ? '' : ' hidden'}>`;
  if(!g.shared && !isEur(g)) html += `<div class="card lst">${goalRateHTML(g)}${g.date ? `<div class="li"><span class="ic">${I('cal')}</span><span class="t"><b>Goal date: ${fDate(g.date)}</b>${weeklyShown(g) ? `<small class="wkfig">${money(g, t)} by ${pkMonthShort(g.date)} needs about ${ft(weeklyOf(g))} a week.</small>` : ''}</span></div>` : ''}</div>${ruleRowsHTML(g)}`;
  if(g.shared) html += `<div class="card u-card-bul"><ul class="bul sm"><li><b>You can always withdraw what you put in.</b></li><li>Paying out the whole pot needs everyone to agree.</li><li>Each share earns 3.0% on the first 500 000 Ft until ${juniorEndLabel()} and counts toward that member's own 500 000 Ft limit.</li></ul></div>`;
  html += goalManageHTML(g) + '</div>';
  const acts = S.tx.filter(x => x.note === g.name).slice(0, 5);
  if(acts.length) html += `<div class="sec"><span>Activity</span></div><div class="card lst">${acts.map(x=>`<div class="li"><span class="t"><b>${esc(x.s)}</b><small>${txDate(x)}</small></span><b class="num ${x.a>0?'':'pos'}">${x.a>0?'−':'+'}${ft(Math.abs(x.a))}</b></div>`).join('')}</div>`;
  return html;
}
const PAGES = {
  // one Persely: balance, forecast against its date, its rate, the rules that feed it, members (shared) and activity
  goal:{title:()=> (goalById(S._detail) || {name:'Persely'}).name, html:()=>{
    const g = goalById(S._detail); if(!g) return '';
    if(SIMPLE_PERSELY) return goalPageSimple(g);
    const s = gSaved(g), t = gTarget(g), pc = pctOf(g), m = gMonths(g), late = isLate(g), fx = lateFix(g), tight = isTight(g), bf = behindFix(g), lump = tight ? lumpOf(g) : 0, fc = forecastText(g);
    const sw = swBtn;
    const rch = goalReached(g);
    let html = `${rch && !g.cont ? `<div class="card u-mt6 reached" role="group" aria-label="Goal reached"><b class="u-fs-m">You did it: ${esc(g.name)} is fully saved</b><div class="k u-mt4-b12">${gSaved(g) > t ? `${money(g, gSaved(g) - t)} more is in it. ` : ''}Your saving rules stay on this goal until you choose.</div>
        <div class="hero-btns u-m0"><button class="btn w" data-outgoal="${g.id}">Withdraw</button><button class="btn w" data-sheet="newgoal">New goal</button><button class="btn" data-keepsaving="${g.id}">Keep saving</button></div></div>` : ''}<div class="card ${rch && !g.cont ? '' : 'u-mt6'} ${S._hl === g.id ? 'hl' : ''}">${S._hl === g.id ? '<span class="pill ok">New goal</span>' : ''}${g.shared ? `<span class="pill ok">Shared Persely · ${plural(g.members.length,'member')}</span>` : ''}
      <div class="hero-v num" style="margin-top:${g.shared || S._hl === g.id ? 8 : 0}px">${money(g, Math.min(s, t))} <small class="k u-fs-14b">of ${money(g,t)}</small></div>
      <div class="prog" style="margin:var(--sp-2) 0 var(--sp-2);height:10px"><i style="width:${pc.w}%"></i></div>
      <div style="display:flex;justify-content:space-between;gap:var(--sp-2)" class="k"><span>${pc.reached ? 'Reached' : pc.tiny ? `First step · ${money(g, s)} in` : `${pc.first ? 'First step · ' : ''}${pc.txt} saved`}</span><span>${tight ? dueTxt(g) + ' · ' : 'Goal date: '}${g.date ? fDate(g.date) : '—'}</span></div>
      ${!g.shared && !isEur(g) ? `<div class="note" style="margin:var(--sp-3) 0 0;${late ? 'background:var(--orange-l)' : ''}">${tight ? (daysTo(g) < 0 ? `<b>Goal date passed: ${ft(toGo(g))} to go.</b> Nothing is lost. Your ${ft(s)} is still yours and still earns interest. Pick a date that fits.` : `<b>Behind: ${ft(toGo(g))} to go by ${daysTo(g) === 1 ? 'tomorrow' : daysTo(g) === 0 ? 'today' : 'the date'}.</b> At about ${ft(Math.round(paceOf(g)/100)*100)} a month this date is out of reach. Moving it is fine, most goals shift.`) : m === 0 ? (g.cont ? '<b>Reached.</b> Your rules keep adding here. Raise the amount with Edit goal if you want a bigger goal.' : 'Your goal is reached. Choose what to do above.') : m < 0 ? 'Add a rule below to see when you get there.' : `At your pace (about ${ft(Math.round(paceOf(g)/100)*100)} a month) you get there ${fc.far && fc.n <= 1 ? `<b>${fc.when}</b>` : `in <b>${inMonths(m)}</b>`}${late ? ', <b>after your goal date</b>.' : fc.far ? `, well before your goal date (${fc.dateTxt}).` : '.'}`}${weeklyShown(g) ? `<div class="k u-mt4-b12 wkfig">${money(g, t)} by ${pkMonthShort(g.date)} needs about <b>${ft(weeklyOf(g))} a week</b>.</div>` : ''}</div>${late && (fx || bf || lump) ? `${fx ? `<button class="btn" data-latefix="${g.id}">${fixLabel(fx)}</button>` : ''}${!fx && bf ? `<button class="btn" data-behindfix="${g.id}">${behindLabel(bf)}</button>` : ''}${!fx && lump ? `<button class="btn w" data-behindlump="${g.id}">Add ${ft(lump)} from Junior</button>` : ''}${S.analyst.on && S.analyst.accepted ? '' : '<button class="btn ghost" data-sheet="analyst">Or see what the analyst suggests</button>'}` : ''}` : ''}
      ${isEur(g) ? `<div class="note" style="margin:var(--sp-3) 0 0">Buy euros bit by bit instead of all at once before the trip. Demo rate: 1 € = ${EUR_RATE} Ft.</div>` : ''}
      <div class="hero-btns" style="margin:var(--sp-4) 0 0"><button class="btn" data-pickgoal="${g.id}">Add money</button><button class="btn w" data-outgoal="${g.id}">Withdraw</button></div></div>`;
    html += goalManageHTML(g);
    if(g.shared){
      html += `<div class="sec"><span>Who put in what</span></div><div class="card lst">${g.members.map(mb=>`<div class="li">${avatar(mb,32)}<span class="t"><b>${mb.me ? esc(userFirst()) + ' (you)' : esc(mb.n)}</b><div class="prog" style="margin:var(--sp-2) 0 0;height:6px"><i style="width:${Math.round(mb.amt / Math.max(1,s) * 100)}%"></i></div></span><b class="num">${ft(mb.amt)}</b></div>`).join('')}</div>
        <div class="card u-card-bul"><ul class="bul sm"><li><b>You can always withdraw what you put in.</b></li><li>Paying out the whole pot needs everyone to agree.</li><li>Each share earns 3.0% on the first 500 000 Ft until ${juniorEndLabel()} and counts toward that member's own 500 000 Ft limit.</li></ul>
        ${g.members.length < 5 ? `<button class="btn w" style="margin:var(--sp-2) 0 var(--sp-1)" data-invite>Invite a friend</button>` : ''}</div>`;
    } else if(!isEur(g)){
      html += `<div class="card lst"><div class="li"><span class="ic">${I('rate')}</span><span class="t"><b>${(S.verified||S.bridge) ? 'Junior rate 3.0% on the first 500 000 Ft' : 'Standard rate 0.01%'}</b><small>About ${ft(yearNet(s))} a year after tax on ${ft(s)}${(S.verified||S.bridge) ? `, until ${juniorEndLabel()}` : ''}</small></span></div></div>
        ${ruleRowsHTML(g)}`;
    }
    const acts = S.tx.filter(x => x.note === g.name).slice(0, 5);
    if(acts.length) html += `<div class="sec"><span>Activity</span></div><div class="card lst">${acts.map(x=>`<div class="li"><span class="t"><b>${esc(x.s)}</b><small>${txDate(x)}</small></span><b class="num ${x.a>0?'':'pos'}">${x.a>0?'−':'+'}${isEur(g) && x.n==='CURRENCY EXCHANGE' ? ft(Math.abs(x.a)) : ft(Math.abs(x.a))}</b></div>`).join('')}</div>`;
    return html + `<p class="fine" style="text-align:center;margin:var(--sp-4) 0 var(--sp-1)">Withdraw any time, free of charge.</p>`; }},
  // Edit goal: the one edit for name, icon, amount and date, also with money inside (D8). Creating a goal is the wizard (startOnb), not a page.
  create:{title:'Edit goal', html:()=>{
    const d = S._draft; if(!d) return '';
    return `<div class="flabel u-mt6">Name</div><div class="fld"><span class="t"><input id="cgName" maxlength="30" value="${esc(d.name)}" placeholder="e.g. New laptop" autocomplete="off" enterkeyhint="done" aria-label="Goal name"></span></div>
      <div class="flabel">Icon</div><div class="chips u-mb6" role="group" aria-label="Goal icon">${GOAL_ICONS.map(k => `<button class="chip cgic ${d.ic === k ? 'on' : ''}" data-cgic="${k}" aria-pressed="${d.ic === k}" aria-label="Icon ${k}" style="min-width:var(--tap)">${I(k, 22)}</button>`).join('')}</div>
      <div class="flabel">Amount</div>${amountPicker('cg')}
      ${monthPicker('cg')}
      <div class="fine u-note-t6">Your money stays where it is. Changing the amount or the date only moves the forecast.</div>`; },
    foot:()=>{ const d = S._draft; if(!d) return ''; const why = cgGate(); return `<div class="onb-why fine" role="status">${why}</div><button class="btn" data-cgsave ${why ? 'disabled' : ''}>Save changes</button>`; }},
  // graduation bridge: the retention moment, the 3.0% rate continues if the salary comes to OTP
  grad:{title:'Your 3.0% rate', html:()=>{ const pr = rulesOf(ruleGoal()).pay, no = (S.accounts.find(a => a.id === 'junior') || {}).no || '';
    return `<div class="u-pig-row">${pig('proud',110)}</div>
    <div class="card" style="padding:var(--sp-5) var(--sp-4)"><h2 style="margin:0 0 var(--sp-2);font-size:1.375rem;line-height:1.25">${S.bridge ? `Your 3.0% continues until ${juniorEndLabel(12)}` : keepPending() ? 'Waiting for your first salary at OTP' : S.juniorDays ? `Junior package until ${juniorEndLabel()}` : 'Your Junior package ended today'}</h2>
      <!-- CONFIRM WITH OTP -->
      <p class="gcond">${RATE_COND()}</p>
      <div style="font-size:var(--fs-m);line-height:1.5;color:var(--ink2)">${S.bridge ? 'For 12 months after graduation, while your salary comes to OTP.' : keepPending() ? `${keepLeft()}. When it arrives your 3.0% continues until ${juniorEndLabel(12)}. Until then you stay on Junior 3.0%.` : `${S.juniorDays ? `That is in ${plural(S.juniorDays, 'day')}.` : `Your Junior package ended today, ${esc(userFirst())}.`} Have your first salary paid into OTP and <b>request to keep 3.0% for 12 more months.</b>`}</div></div>
    <div class="sec"><span>How it works</span></div>
    <div class="card lst">${[['1','Give your employer your OTP account number',`<span class="num">${esc(no)}</span><button class="btn sm w gcopy" data-copyacc>Copy account number</button>`],['2','Your first salary arrives at OTP','Within 6 months of graduating'],['3','Your goals keep 3.0% for 12 months',`On the first ${ft(CAP)}, until ${juniorEndLabel(12)}`]].map(([n,t,x])=>`<div class="li" style="align-items:flex-start"><span class="stepn">${n}</span><span class="t"><b>${t}</b><small>${x}</small></span></div>`).join('')}</div>
    <div class="card u-card-bul"><ul class="bul sm"><li>Your goals, streak and friends stay as they are</li></ul></div>
    ${SIMPLE_PERSELY ? `<button class="row" data-sheet="ratesafe"><span class="ic">${I('shield')}</span><span class="t">Rate and safety<small>Rate, tax, withdraw and protection</small></span><span class="chev">${I('chev',20)}</span></button>` : ''}
    ${pr.on && pr.pct < 20 ? `<div class="note"><b>Tip:</b> most people earn more after 24. Saving ${pr.pct+5}% instead of ${pr.pct}% is about ${ft(incomeShare(5))} more a month. <a class="link" data-raise>Raise to ${pr.pct+5}%</a></div>` : ''}`; },
    foot:()=> S.bridge ? '' : keepPending() ? `<button class="btn ghost" data-keepcancel>Cancel request</button>` : `<button class="btn" data-keepreq>Request to keep 3.0%</button>`},
  year:{title:'Your year in Persely', html:()=>yearHTML(), foot:()=> yearMonths().length ? `<button class="btn" data-yearstory>See your year story</button>` : ''},
  kartyaim:{title:'My cards', html:()=>vKartyaim().replace('<div class="tabtitle">My cards</div>','')},
  szamlaim:{title:'My accounts', html:()=>S.accounts.map(a=>`<div class="card"><b class="u-fs-m">${a.n}</b><div class="u-k-xs">${a.no}</div>
    <div style="display:flex;justify-content:space-between;margin-top:var(--sp-3);font-size:0.84375rem"><span>${a.id==='persely'?'Balance':'Available balance'}</span><b class="num u-fs-16">${ft(a.v)}</b></div>
    <div style="display:flex;justify-content:space-between;margin-top:var(--sp-2);font-size:0.78125rem;color:var(--muted-t)"><span>${a.h.split(':')[0]}</span><span class="num">${a.h.split(':')[1]||''}</span></div></div>`).join('')},
  perks:{title:'Perks', html:() => perksHTML()},
  neked:{title:'For you', right:`<span style="display:flex;color:var(--blue-i)">${I('info',24)}</span>`, html:()=>`
    <div class="utabs">${['All','Tips','News','Offers'].map((t,i)=>`<button class="${nekTab===i?'on':''}" data-nektab="${i}">${t}</button>`).join('')}</div>
    <div class="sec u-mt6"><span>Featured</span></div>${nekedCards(false)}`},
  inbox:{title:'Notifications', right:`<button data-settings="notif" aria-label="Notification settings" style="display:flex;color:inherit">${I('gear',22)}</button>`, html:() => inboxHTML()},
  settings:{title:'Settings', html:() => settingsHTML()},
  challenges:{title:'Weekly challenges', html:()=>`<div class="card" style="padding:var(--sp-1) var(--sp-4) var(--sp-3);margin-top:var(--sp-2)"><ul class="bul sm"><li>New challenges every Monday, the week ends on Sunday</li><li>Progress is checked automatically from your card payments</li><li>Join as many as you like</li></ul></div>${CH_DEFS.map(chCard).join('')}`},
  kiadas:{title:'Monthly spending', right:`<button data-plangear aria-label="Edit my monthly plan" style="display:flex;color:inherit">${I('gear',22)}</button>`, html:()=>{
    const mo = shownMonth(), sp = catSpend(mo.ym);
    return `<div style="margin:var(--sp-4) auto var(--sp-5);width:230px;padding:var(--sp-4);border-radius:40px;text-align:center;background:linear-gradient(145deg,var(--white),var(--fill));box-shadow:8px 8px 18px rgba(var(--ink-rgb),.15),-8px -8px 18px var(--white)"><b class="num u-fs-22">${ft(sumVals(sp))}</b><div style="color:var(--act-d);font-size:var(--fs-s)">${mo.name}${mo.year !== 2026 ? ' ' + mo.year : ''} · card spending</div></div>
    ${catBars(sp)}
    ${recentCards()}
    ${S.analyst.on && S.analyst.accepted ? '' : `<div class="card"><b class="u-bk-m14">How does this fit your income?</b><div class="fine u-mt4-b12">The analyst shows how your ${ft(S.income.amount)} splits into Essentials, Fun and Saving.</div><button class="btn" data-sheet="analyst">See the suggested split</button></div>`}`;}},
  mymoney:{title:'Spending', html:() => myMoneyHTML()},
  nextmonth:{title:'Next month', html:() => nextMonthHTML()},
  bills:{title:'Must-pay bills', html:() => billsHTML()}
};
let perkTab = 0;   // 0 Discounts, 1 My rewards
/* Partner names are placeholders: <!-- CONFIRM WITH OTP: partners --> the real list and the redemption steps come from OTP (D12, C6). */
const DISC = [
  {id:'d1',lg:'PZ',n:'Pizzeria Roma',t:'15% instant discount.',bg:'var(--red-l)',c:'var(--red-t)',steps:['Tap Activate here.','At the restaurant, say you pay with your OTP card.','Pay by card. The 15% comes off the bill.']},
  {id:'d2',lg:'TH',n:'Theatre (junior offer)',t:'10% off every purchase.',bg:'var(--blue-l)',c:'var(--blue-t)',steps:['Tap Activate here.','Buy tickets at the box office or online with your OTP card.','The 10% comes off at the payment.']},
  {id:'d3',lg:'SP',n:'Sport Outlet',t:'10% off every purchase over 25 000 Ft.',bg:'var(--fill)',c:'var(--ink2)',steps:['Tap Activate here.','Shop for 25 000 Ft or more.','Pay with your OTP card. The 10% comes off at the till.']},
  {id:'d4',lg:'CR',n:'Car rental',t:'12% off weekend rentals.',bg:'var(--yellow-l)',c:'var(--yellow-t)',steps:['Tap Activate here.','Book a rental that starts on a Friday, Saturday or Sunday.','Pay with your OTP card. The 12% comes off the price.']},
  {id:'d5',lg:'CF',n:'Coffee chain',t:'Every 5th coffee is free when you pay by card.',bg:'var(--orange-l)',c:'var(--orange-t)',steps:['Tap Activate here.','Pay for your coffee with your OTP card.','Your 5th coffee is free. The shop counts them for you.']}
];
/* Rewards earned from the health score or a reached goal carry a partner name and steps (placeholders until OTP confirms: partners). */
const REWARD_STEPS = ['Shop at the partner with your OTP card.', 'Pay by card before the reward ends.', 'The cashback arrives on your Junior account within 5 working days.'];
const rewardPartner = r => r.partner || 'Corner Market';
const rewardSteps = r => (r.steps && r.steps.length) ? r.steps : REWARD_STEPS;

/* ================= rendering ================= */
const TABS = [['fooldal','home','Home',vFooldal],['utalas','money','Transfer',vUtalas],['hub','piggy','Persely',vHub],['tranzakciok','list','Transactions',vTranz],['tovabbiak','menu','More',vTovabbiak]];
let cur = 'fooldal';
// orange dot on the Persely tab while today's saving is still open
function renderTabs(){ $('#tabbar').innerHTML = TABS.map(([id,ic,l])=>`<button class="tb ${id===cur?'on':''}" data-tab="${id}">${I(ic)}${id==='hub' && !S.savedWeek && S.streak>0 ? '<i class="nd"></i>' : ''}${l}</button>`).join(''); }
function renderView(id){ const t=TABS.find(x=>x[0]===id); $('#v-'+id).innerHTML = t[3](); if(id === 'hub') watchHints(); }
function renderAll(){ syncSplit(); TABS.forEach(t=>renderView(t[0])); renderTabs(); refreshPages(); save(); if(typeof mountPig==='function') mountPig(); }
let NAVC = {n:0};   // counts page changes: something the app plans to open later checks that nothing else was opened meanwhile
function tab(id){
  if(typeof spOnTab === 'function') spOnTab(id);   // Simple Persely: ends the reward; a new visit to the Persely tab turns the Sunday nudge question on (js/14b)
  if(cur === 'tranzakciok' && id !== 'tranzakciok') txReset();   // search and chips (also a category passed in from Spending) clear when the student leaves the tab
  if(cur === 'fooldal' && id !== 'fooldal') anNoteSeen();
  NAVC.n++; hideToast(); setTimeout(placeChip, 60);   // a toast belongs to the page where the action happened: it closes when the student goes somewhere else
  if(id === 'hub' && cur !== 'hub'){ HINT_SHOWN.clear(); SETUP_COLLAPSED = false; }   // a new visit: hints show again if unseen, the setup card is whole again
  cur=id; document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on', v.id==='v-'+id));
  while(stack.length) popPage(true);
  renderView(id); renderTabs(); $('#v-'+id).scrollTop=0;
  if(typeof mountPig==='function') mountPig();
}

const stack = [];
// a goal's rules on its page (Persely tab overview rows, the Saving rules links): open the goal, scroll to its rules, mark the one rule when named
function openGoalRules(id, k){
  const g = goalById(id); if(!g) return; if(sheetOpen()) closeSheet(); S._detail = id; S._cap = null; if(SIMPLE_PERSELY) S._gset = id;   // the rules live under Settings for this goal
  const top = stack.length ? stack[stack.length - 1] : null; if(top && top.dataset.id === 'goal') refreshPages(); else pushPage('goal');
  const go = () => { const t = stack.length ? stack[stack.length - 1] : null, el = t && t.querySelector(`[data-rules="${id}"]`); if(!el) return; const sc = t.querySelector('.scroll'); if(sc) sc.scrollTop = Math.max(0, el.offsetTop - 8); if(k){ const b = t.querySelector(`[data-grblock="${k}"]`); if(b) b.classList.add('focus'); } };
  go(); setTimeout(go, 280);
}
function pageHTML(id){
  const p = PAGES[id];
  return `<div class="ph"><button class="l" data-pop aria-label="Back">${I('back',24)}</button><h1>${esc(typeof p.title === 'function' ? p.title() : p.title)}</h1>${p.right?`<span class="r">${p.right}</span>`:''}</div>
  <div class="scroll">${p.html()}</div>${p.foot&&p.foot()?`<div class="foot">${p.foot()}</div>`:''}`;
}
/* routes that no longer have a page (D4): the old Persely details and Savings options go to the Persely tab, the old Monthly spending page to the one Spending page */
const ROUTE_TAB = {persely:'hub', megtakaritas:'hub'}, ROUTE_PAGE = {kiadas:'mymoney', kedvezmenyek:'perks', ertesitesek:'inbox'};
function pushPage(id){
  if(ROUTE_TAB[id]){ closeSheet(); tab(ROUTE_TAB[id]); return; }
  if(ROUTE_PAGE[id]) id = ROUTE_PAGE[id];
  anNoteSeen(); if(typeof SP !== 'undefined' && SP.rewardOn) spHideReward(true);
  NAVC.n++; hideToast(); setTimeout(placeChip, 60); setTimeout(placeChip, 320);
  const el = document.createElement('div'); el.className='page'; el.dataset.id=id;
  el.innerHTML = pageHTML(id); $('#stack').appendChild(el); stack.push(el);
  if(typeof mountPig === 'function') setTimeout(mountPig, 30);
}
function popPage(instant){
  const el = stack.pop(); if(!el) return;
  NAVC.n++; hideToast(); setTimeout(placeChip, 60); setTimeout(placeChip, 320);
  if(!stack.length && MQ.q.length) setTimeout(mqPump, 300);   // the queued reward and goal sheets come after the page they waited for
  if(instant){ el.remove(); if(typeof mountPig === 'function') mountPig(); return; }
  el.classList.add('out'); setTimeout(()=>{ el.remove(); if(typeof mountPig === 'function') mountPig(); },220);
}
function refreshPages(){ stack.forEach(el=>{ const sc=el.querySelector('.scroll'); const top=sc?sc.scrollTop:0; el.innerHTML=pageHTML(el.dataset.id); const n=el.querySelector('.scroll'); if(n) n.scrollTop=top; }); }

/* ================= sheets & toast ================= */
/* ---- one message at a time ----
   Order: push banner, then sheet, then toast. A banner holds the rest back for about 4 seconds. A sheet the app opens by itself
   (qSheet) waits for an open sheet or a visible toast to go. A toast waits for a banner or a queued sheet, and is never shown over
   a sheet: while a sheet is open the message appears as a note inside the sheet instead. Sheets the user opens by tapping open at once. */
const MQ = {q:[], banner:false, toast:false};
const UNDO = {base:null};   // base = state saved when a rule sheet was opened
const RULE_SHEETS = ['payrule','weeklyrule','roundrule'];
const sheetOpen = () => $('#back').classList.contains('on');
/* every sheet is a dialog (N2): role and aria-modal live on #sheet, each one gets an explicit Close, focus moves in, Esc closes, and focus goes back to what opened it */
let SHEET_OPENER = null;
const sheetShell = html => `<div class="sclose-w"><button class="sclose" data-closesheet aria-label="Close">${I('close',22)}</button></div>${html}`;
function sheet(html){ hideToast(true); if(!sheetOpen()) SHEET_OPENER = document.activeElement; const sh = $('#sheet'); sh.innerHTML = sheetShell(html);
  const h = sh.querySelector('h2'); sh.setAttribute('aria-label', h ? h.textContent.trim() : 'Dialog'); $('#back').classList.add('on'); try{ sh.focus({preventScroll:true}); }catch(e){}
  if(typeof mountPig === 'function') mountPig(); }
function closeSheet(){ const was = sheetOpen(); S._fa = false; S._bw = false; S._hsx = false; $('#back').classList.remove('on'); if(was && SHEET_OPENER && document.contains(SHEET_OPENER) && SHEET_OPENER.focus){ try{ SHEET_OPENER.focus({preventScroll:true}); }catch(e){} } SHEET_OPENER = null; if(window.__stAway) stReturn(); if(typeof mountPig === 'function') mountPig(); if(was || MQ.q.length) setTimeout(mqPump, 280); }
const HOLD_FOR_PAGE = ['reward', 'goaloffer'];   // reward and goal sheets never open over a page: they wait until the page is closed (N7, C6.5)
function qSheet(fn, id, late){ if(id) MQ.q = MQ.q.filter(x => x.id !== id); MQ.q.push({k:'sheet', fn, id, late, hold:HOLD_FOR_PAGE.includes(id)}); mqPump(); }   // late: only after the toast
function mqDrop(id){ MQ.q = MQ.q.filter(x => x.id !== id); }
/* one demo toast for every row that is only a shell (D7): the row name, "is not part of this demo", a Demo tag, role=status, 3 s */
const DEMO_TOAST_MS = 3000;
const demoText = name => `${name} is not part of this demo. It works as in the OTP app.`;
function demoToast(name){ toast(demoText(name), {demo:name}); }
function toast(m, o){ if(sheetOpen()){ sheetNote(m); return; } MQ.q = MQ.q.filter(x => x.k !== 'toast'); MQ.q.push({k:'toast', m, o}); mqPump(); }
function mqPump(){
  if(MQ.banner || demo.locked || window.__ffOn || (typeof SP !== 'undefined' && SP.rewardOn)) return;   // nothing pops over the Simple Persely reward (js/14b)   // nothing pops up during a fast-forward; the queue continues after it
  const open = sheetOpen(), hasToast = MQ.q.some(x => x.k === 'toast'), onPage = stack.length > 0;   // N7: reward and goal sheets wait until the page that is open is closed
  const si = MQ.q.findIndex(x => x.k === 'sheet' && !(onPage && x.hold) && (!x.late || (!hasToast && !MQ.toast)));
  if(si >= 0){
    if(open || MQ.toast) return;
    const it = MQ.q.splice(si, 1)[0], html = it.fn();
    if(html) sheet(html); else mqPump();
    return;
  }
  if(open) return;
  const ti = MQ.q.findIndex(x => x.k === 'toast'); if(ti < 0) return;
  const it = MQ.q.splice(ti, 1)[0]; showToast(it.m, it.o);
}
// the toast sits just above the lowest control of the screen that is on top (tab bar, page button, onboarding button), so it never covers a button
function placeToast(){
  const t = $('#toast'), ph = $('#phone'), pr = ph.getBoundingClientRect(), sc = pr.width / ph.offsetWidth || 1;
  let top = null; const layer = el => { if(!el) return; const r = el.getBoundingClientRect(); if(r.height > 0) top = r.top; };
  if($('#story').classList.contains('on')) layer($('#story .st-foot'));
  else if($('#onb').classList.contains('on')) layer($('#onb .onb-foot'));
  else if(stack.length) layer(stack[stack.length - 1].querySelector('.foot'));
  else layer($('#tabbar'));
  const lift = UCH.on ? $('#uchip').offsetHeight + 8 : 0;
  t.style.bottom = top === null ? `calc(env(safe-area-inset-bottom) + ${16 + lift}px)` : Math.round((pr.bottom - top) / sc + 12 + lift) + 'px';
  placeChip();
}
function placeChip(){
  const c = $('#uchip'), ph = $('#phone'), pr = ph.getBoundingClientRect(), sc = pr.width / ph.offsetWidth || 1;
  let top = null; const layer = el => { if(!el) return; const r = el.getBoundingClientRect(); if(r.height > 0) top = r.top; };
  if($('#story').classList.contains('on')) layer($('#story .st-foot'));
  else if($('#onb').classList.contains('on')) layer($('#onb .onb-foot'));
  else if(stack.length) layer(stack[stack.length - 1].querySelector('.foot'));
  else layer($('#tabbar'));
  c.style.bottom = top === null ? 'calc(env(safe-area-inset-bottom) + 16px)' : Math.round((pr.bottom - top) / sc + 12) + 'px';
}
let tt;
function showToast(m, o){
  o = o || {}; const t = $('#toast');
  t.innerHTML = o.demo ? `<span class="dtag">Demo</span> <span class="tm"><b>${esc(o.demo)} is not part of this demo.</b> It works as in the OTP app.</span>` : `<span class="tm">${esc(m)}</span>`;
  t.classList.toggle('demo', !!o.demo); t.classList.remove('act'); placeToast();
  t.classList.add('on'); MQ.toast = true; $('#phone').style.setProperty('--toast-pad', (t.offsetHeight + 28) + 'px'); $('#phone').classList.add('toast-on'); clearTimeout(tt); tt = setTimeout(() => hideToast(), o.demo ? DEMO_TOAST_MS : 2400);
}
function hideToast(quiet){ clearTimeout(tt); $('#toast').classList.remove('on','act'); $('#phone').classList.remove('toast-on'); MQ.toast = false; if(!quiet) mqPump(); }
function sheetNote(m){   // a message while a sheet is open: shown at the top of the sheet, never over its buttons
  const sh = $('#sheet'); sh.querySelectorAll('.snote-w').forEach(n => n.remove());
  const w = document.createElement('div'); w.className = 'snote-w'; w.innerHTML = `<div class="snote" role="status">${esc(m)}</div>`; sh.prepend(w);
  setTimeout(() => w.remove(), 2800);
}
/* ---- Undo (10 s, one chip, one action) ----
   The chip is its own layer (#uchip): it is not a toast, so a tab or page change does not close it. It reverses ONLY the move it belongs to:
   undoable() compares the saved state from before the action with the state after it and keeps just the difference (a per move delta).
   Numbers are reversed by the amount they moved (a balance goes back by what this move took, not to an old total), list items by id or by content,
   other values are put back. Anything else that changed since (a later move, a rule) stays. Keys that start with "_" are screen state and are left alone.
   Limit: a real push already sent or the piggy animation cannot be taken back. */
const UNDO_MS = 10000, REVIEW_OVER = 20000;   // how long the chip stays; a money out above this many forints gets a review step
const UCH = {on:false, fn:null, t:0};
const snap = () => JSON.stringify(S);
const isO = x => !!x && typeof x === 'object' && !Array.isArray(x), cp = x => JSON.parse(JSON.stringify(x));
const akey = x => isO(x) && x.id !== undefined ? 'id:' + x.id : 'j:' + JSON.stringify(x);
function dlt(b, a){   // b = before, a = after; null when equal
  if(JSON.stringify(b) === JSON.stringify(a)) return null;
  if(isO(b) && isO(a)){ const o = {}; new Set([...Object.keys(b), ...Object.keys(a)]).forEach(k => { const d = dlt(b[k], a[k]); if(d) o[k] = d; }); return {o}; }
  if(typeof b === 'number' && typeof a === 'number') return {n:a - b};
  if(Array.isArray(b) && Array.isArray(a)){
    const ca = {}, cb = {}; a.forEach(x => { const k = akey(x); ca[k] = (ca[k] || 0) + 1; }); b.forEach(x => { const k = akey(x); cb[k] = (cb[k] || 0) + 1; });
    const rem = [], chg = [], add = [];
    b.forEach((x, i) => { const k = akey(x); if(ca[k] > 0){ ca[k]--; if(k[0] === 'i'){ const d = dlt(x, a.find(z => akey(z) === k)); if(d) chg.push({k, d}); } } else rem.push({i, x}); });
    a.forEach(x => { const k = akey(x); if(cb[k] > 0) cb[k]--; else add.push(k); });
    return {arr:{add, rem, chg}};
  }
  return b === undefined ? {del:1} : {v:cp(b)};
}
function undl(p, k, d){   // put the delta back into p[k]
  if(d.del){ delete p[k]; return; }
  if('v' in d){ p[k] = cp(d.v); return; }
  if('n' in d){ p[k] = (typeof p[k] === 'number' ? p[k] : 0) - d.n; return; }
  if(d.o){ if(!isO(p[k])) return; Object.keys(d.o).forEach(kk => undl(p[k], kk, d.o[kk])); return; }
  if(d.arr){ const arr = p[k]; if(!Array.isArray(arr)) return;
    d.arr.chg.forEach(c => { const i = arr.findIndex(z => akey(z) === c.k); if(i >= 0) undl(arr, i, c.d); });
    d.arr.add.forEach(key => { const i = arr.findIndex(z => akey(z) === key); if(i >= 0) arr.splice(i, 1); });
    d.arr.rem.forEach(r => arr.splice(Math.min(r.i, arr.length), 0, cp(r.x))); }
}
const pub = o => { const c = cp(o); Object.keys(c).forEach(k => { if(k[0] === '_') delete c[k]; }); return c; };
function undoDelta(before){ const d = dlt(pub(JSON.parse(before)), pub(S)); return () => { if(d) undl({S}, 'S', d); }; }
function chipText(m){ return `<span class="tm">${esc(m)}</span><button class="tundo" data-undo>Undo</button>`; }
function showChip(m, fn){
  const c = $('#uchip'); clearTimeout(UCH.t); UCH.fn = fn; UCH.on = true;
  c.innerHTML = chipText(m); c.classList.add('on'); $('#phone').classList.add('chip-on'); $('#phone').style.setProperty('--chip-pad', (c.offsetHeight + 28) + 'px'); placeChip(); placeToast();
  UCH.t = setTimeout(() => hideChip(), UNDO_MS);
}
function hideChip(quiet){ clearTimeout(UCH.t); const c = $('#uchip'); c.classList.remove('on'); $('#phone').classList.remove('chip-on'); UCH.fn = null; UCH.on = false; if(!quiet) mqPump(); }
function undoable(before, msg){
  const rev = undoDelta(before);
  showChip(msg, () => { rev(); mqDrop('goaloffer'); closeSheet(); if(stack.length && stack[stack.length - 1].dataset.id === 'goal' && !goalById(S._detail)) popPage(true); renderAll(); if(ST.on) stRefresh(true); toast('Undone'); });
}
// payday with bills open: what to move so the unpaid bills are covered, and what is left. unpaid = every must-pay bill not paid this month (late or still to come)
function paydayPlan(){
  const g = ruleGoal(), bf = billsFirst(), pk = pocketBal(), bal = balanceOf(), inc = S.income.amount, share = incomeShare(payPct()), unpaid = bf.total;
  const open = bf.rows.filter(r => r.s.left > 0).sort((a, b) => (b.s.over - a.s.over) || (a.bill.day - b.bill.day)), need = Math.max(0, unpaid - pk), pocketEnough = need === 0, partial = need > bal;
  let sum = 0, coverN = 0; if(partial){ for(const r of open){ if(sum + r.s.left > bal + pk) continue; sum += r.s.left; coverN++; } }
  const toMove = partial ? Math.max(0, sum - pk) : need, rule = payOn() ? share : 0, canSave = !partial && rule > 0 && bal - toMove >= rule;
  return {g, bf, pk, bal, inc, unpaid, open, pocketEnough, partial, coverN, toMove, rule, canSave, left:Math.max(0, inc - toMove - (canSave ? rule : 0))};
}
const SHEETS = {
  befizet:()=>moneySheet('Add money','Junior account → Persely','befizet'),
  kivesz:()=>moneySheet('Withdraw','Persely → Junior account','kivesz'),
  // Between my accounts is the shared Add money sheet with From and To choosers for accounts and goals; the last used goal is already chosen (D4)
  sajat:()=>{ S._bw = true; S._mf = 'a:junior'; const g = lastGoal(); S._mt = g ? 'g:' + g.id : 'a:megt'; S._amt = 0; return SHEETS.hubsave(); },
  uj:()=>`<h2>New transfer</h2>
    <div class="fld"><span class="t"><label for="un">Beneficiary name</label><input id="un" autocomplete="off" aria-describedby="e-un"></span></div><div class="ferr" id="e-un" role="alert"></div>
    <div class="fld"><span class="t"><label for="ua">Account number</label><input id="ua" inputmode="numeric" autocomplete="off" placeholder="16 or 24 digits" aria-describedby="e-ua"></span></div><div class="ferr" id="e-ua" role="alert"></div>
    <div class="fld"><span class="t"><label for="uv">Amount</label><input id="uv" inputmode="numeric" autocomplete="off" aria-describedby="e-uv"></span><b>Ft</b></div><div class="ferr" id="e-uv" role="alert"></div>
    <div class="chips u-mt0">${[5000,10000,20000,50000].map(v=>`<button class="chip" data-setv="${v}" data-into="uv">${ft(v)}</button>`).join('')}</div>
    <div id="cfm"></div>
    <button class="btn pbtn" data-dout>Send transfer</button>`,
  // add money: goal, amount and the account it comes from are all visible before confirming
  hubsave:()=>{ if(S._bw) return betweenSheet(); if(!S.goals.some(g=>g.id===S._goal)) S._goal = S.goals[0].id; S._from = S._from || 'junior';
    if(SIMPLE_PERSELY) return hubsaveSimple();
    const g = goalById(S._goal), e = isEur(g), v = S._amt || '';
    return `${S._fa ? `<h2>Start your streak?</h2><div class="u-sheet-sub2">Add money now. Any amount counts for this week.</div>` : '<h2>Add money</h2>'}
    <div class="flabel">To</div>
    <div class="chips u-mb4">${S.goals.map(x=>`<button class="chip ${S._goal===x.id?'on':''}" data-pickgoal="${x.id}">${esc(x.name)}</button>`).join('')}</div>
    <div class="flabel">Amount</div>
    <div class="fld"><span class="t"><input id="mv" inputmode="numeric" value="${v}" placeholder="Amount" aria-label="Amount" aria-describedby="e-mv"></span><b>${e ? '€' : 'Ft'}</b></div><div class="ferr" id="e-mv" role="alert"></div>
    <div class="chips u-mt0">${(e ? [10,20,50,100] : [500,1000,2000,5000]).map(x=>`<button class="chip" data-setv="${x}">${e ? eur(x) : ft(x)}</button>`).join('')}</div>
    <div class="flabel">From</div>
    ${S.accounts.filter(a=>a.id!=='persely').map(a=>`<button class="opt slim ${S._from===a.id?'on':''}" data-hubfrom="${a.id}"><span class="ic">${I('wallet',22)}</span><span class="t"><b>${a.n}</b><small class="num">${ft(a.v)} available</small></span>${S._from===a.id?`<span class="u-ico-g">${I('check',22)}</span>`:''}</button>`).join('')}
    <div class="fine u-note-t6">${e ? `Demo rate 1 € = ${EUR_RATE} Ft. Euro goals don't get the Junior rate.` : S.savedWeek ? 'This week already counts for your streak.' : `Counts for this week: your streak goes to ${S.streak+1}.`}</div>
    <button class="btn" data-hubsave>Add money</button>`; },
  // withdraw: the fear "my money is locked" is answered right here
  gdel:()=>{ const g = goalById(S._del); if(!g) return '<h2>Delete goal</h2><p class="fine">This goal is already gone.</p>';
    const rules = goalRulesOf(g), amt = gSaved(g), others = S.goals.filter(x => x.id !== g.id && goalIsPlain(x) && !isEur(g));
    const note = `<div class="note u-mb8">This removes <b>${esc(g.name)}</b>, its target and its date from your Persely, Home and your story. Your transactions stay. You have 10 seconds to undo it.</div>`;
    const rl = rules.length ? `<div class="fine u-note-b14">Its ${rules.join(' and ')} stop with it. Your other goals keep their own rules.</div>` : '';
    if(amt > 0) return `<h2>Delete ${esc(g.name)}?</h2>${note}${rl}
      <div class="fine u-note-b14">${money(g, amt)} is saved in this goal. Choose where it goes first.</div>
      <button class="btn" data-gdelok="${g.id}" data-dest="junior" style="background:var(--orange-t);color:var(--white)">Move ${money(g, amt)} to Junior account and delete</button>
      ${others.map(x => `<button class="btn w" data-gdelok="${g.id}" data-dest="${x.id}">Move ${money(g, amt)} to ${esc(x.name)} and delete</button>`).join('')}
      <button class="btn ghost" data-closesheet>Keep goal</button>`;
    return `<h2>Delete ${esc(g.name)}?</h2>${note}${rl}
    <button class="btn" data-gdelok="${g.id}" style="background:var(--orange-t);color:var(--white)">Delete ${esc(g.name)}</button>
    <button class="btn ghost" data-closesheet>Keep goal</button>`; },
  outallc:()=>{ const g = goalById(S._outall); if(!g || gSaved(g) <= 0) return '<h2>Withdraw all</h2><div class="fine">There is nothing to take out.</div>';
    return `<h2>Withdraw all?</h2><div class="cfm"><p>Withdraw all ${money(g, gSaved(g))} to Junior account?</p><button class="btn" data-outallok="${g.id}">Confirm</button><button class="btn ghost" data-closesheet>Back</button></div>`; },
  hubout:()=>{ if(!S.goals.some(g=>g.id===S._out)) S._out = S.goals[0].id; const g = goalById(S._out), max = mine(g);
    return `<h2>Withdraw</h2>
    <div class="flabel">From</div>
    <div class="chips u-mb4">${S.goals.map(x=>`<button class="chip ${S._out===x.id?'on':''}" data-outgoal="${x.id}">${esc(x.name)} · ${money(x, mine(x))}</button>`).join('')}</div>
    <div class="flabel">Amount</div>
    <div class="fld"><span class="t"><input id="mv" inputmode="numeric" placeholder="Amount" aria-label="Amount" aria-describedby="e-mv"></span><b>${isEur(g) ? '€' : 'Ft'}</b></div><div class="ferr" id="e-mv" role="alert"></div>
    <div class="chips u-mt0">${(isEur(g) ? [10, 20, 50] : [1000, 5000, 10000]).filter(x => x < max).map(x => `<button class="chip" data-setv="${x}">${money(g, x)}</button>`).join('')}${max > 0 ? `<button class="chip" data-wall="out" aria-label="Withdraw all, ${money(g, max)}">Withdraw all</button>` : ''}</div>
    <div id="cfm"></div>
    <div class="fine u-note-b14">${g.shared ? `You can withdraw what you put in: ${ft(max)}. ` : ''}Arrives on your Junior account instantly. No fee. Your streak is not affected.</div>
    <button class="btn pbtn" data-hubout>Withdraw</button>`; },
  // payday: the app asks before moving money (the user keeps control)
  payday:()=>{ const A = paydayAlloc(), g = ruleGoal(), share = A.total, s = gSaved(g), t = gTarget(g), many = A.rows.length > 1;
    if(paydayBills()){   // "Bills first": one recommended path with the exact unpaid amount and its result shown before the tap
      const P = paydayPlan(), li = (l, v, sub, c) => `<div class="li"><span class="t"><b>${l}</b>${sub ? `<small>${sub}</small>` : ''}</span><b class="num" style="${c ? 'color:' + c : ''}">${v}</b></div>`;
      const owed = P.open.map(r => `${esc(r.bill.name)} ${ft(r.s.left)}`).join(' · '), gn = payGoals().length > 1 ? 'your goals' : esc(P.g.name);
      const msg = P.pocketEnough ? `Your bills are covered by Bills pocket.`
        : P.partial ? `Your salary covers ${P.coverN} of ${P.open.length} bills.${P.toMove > 0 ? ` Move ${ft(P.toMove)} to Bills pocket; the saving rule waits this month.` : ' The saving rule waits this month.'}`
        : payOn() && !P.canSave ? 'The saving rule waits this month: your money does not cover both.' : '';
      const then = `<div class="fine u-pd-then"><b>Then:</b> ${P.partial ? `${P.coverN} of ${P.open.length} bills covered · saving waits` : `bills covered${P.canSave ? ` · ${ft(P.rule)} to ${gn}` : payOn() ? ' · saving waits' : ''} · ${ft(P.left)} free for Fun`}</div>`;
      let act;
      if(P.pocketEnough) act = P.canSave ? `<button class="btn" data-paymove>Save ${ft(P.rule)} to ${gn}</button>${then}<button class="link lnk44 u-pd-no" data-closesheet>Not this time</button>` : `<button class="btn ghost" data-closesheet>Close</button>`;
      else if(P.partial) act = P.toMove > 0 ? `<button class="btn" data-paycover="${P.toMove}" data-only>Move ${ft(P.toMove)} to Bills pocket</button>${then}<button class="link lnk44 u-pd-no" data-closesheet>Not this time</button>` : `<button class="btn ghost" data-closesheet>Close</button>`;
      else if(P.canSave) act = `<button class="btn" data-paycover="${P.toMove}">Cover bills and save ${ft(P.rule)}</button>${then}<button class="btn w" data-paycover="${P.toMove}" data-only>Only cover the bills</button><button class="link lnk44 u-pd-no" data-closesheet>Not this time</button>`;
      else act = `<button class="btn" data-paycover="${P.toMove}" data-only>Move ${ft(P.toMove)} to Bills pocket</button>${then}<button class="link lnk44 u-pd-no" data-closesheet>Not this time</button>`;
      return `<div class="u-rowc"><span class="gic">${I('money',24)}</span><div><div class="k">Salary · today</div><b class="u-fs-22">+${ft(P.inc)} arrived</b></div></div>
      <h2 style="text-align:left;margin:var(--sp-4) 0 var(--sp-3);font-size:1.125rem;line-height:1.35">${P.bf.on ? 'Bills first' : 'Cover your bills'}</h2>
      <div class="card lst">${li('Bills still to pay', ft(P.unpaid), owed + (P.pk ? ` · Bills pocket holds ${ft(P.pk)}` : ''))}</div>
      ${msg ? `<div class="u-pd-msg">${msg}</div>` : ''}${act}`; }
    return `<div class="u-rowc"><span class="gic">${I('money',24)}</span><div><div class="k">Salary · today</div><b class="u-fs-22">+${ft(S.income.amount)} arrived</b></div></div>
    <h2 style="text-align:left;margin:var(--sp-4) 0 var(--sp-3);font-size:1.125rem;line-height:1.35">${many ? `Move ${ft(share)} to your goals?` : `Move ${A.pct}% (${ft(share)}) to ${esc(g.name)}?`}</h2>
    ${many ? `<div class="card lst">${A.rows.map(r => `<div class="li"><span class="t"><b>${esc(r.g.name)}</b><small>${r.pct}% of your salary</small></span><b class="num">${ft(r.v)}</b></div>`).join('')}</div>`
      : `<div class="card" style="padding:var(--sp-3) var(--sp-4)"><div style="display:flex;justify-content:space-between;gap:var(--sp-2);font-size:var(--fs-s)"><span class="k">${esc(g.name)}</span><b class="num">${ft(s)} → ${ft(s+share)}</b></div><div class="prog" style="margin:var(--sp-2) 0 0"><i style="width:${Math.min(100,Math.round((s+share)/t*100))}%"></i></div></div>`}
    ${A.tight ? `<div class="fine u-mt4-b12">Keeps ${ft(20000)} on your account, so ${ft(share)} of ${ft(A.need)} moves this time.</div>` : ''}
    ${share > 0 ? `<button class="btn" data-paymove>Move ${ft(share)}</button><button class="btn ghost" data-closesheet>Not this time</button>` : `<div class="note">Your account keeps ${ft(20000)}, so nothing moves this time.</div><button class="btn ghost" data-closesheet>Close</button>`}
    <div class="fine" style="text-align:center;margin-top:var(--sp-1)">${many ? `Your payday rules: ${A.pct}% of every salary, each goal its own share.` : `Your payday rule: ${A.pct}% of every salary.`} Change it on your goal's page.</div>`; },
  moneyin:()=>{ const m = moneyIn(), p = S.payday;
    const sub = r => { const bits = [r.pay ? `Payday rule ${ft(r.pay)}` : '', r.wk ? `Weekly transfer ${ft(r.wk)}` : '', r.rnd ? `Round-ups ${ft(r.rnd)}` : ''].filter(Boolean); return bits.length ? bits.join(' · ') : 'No rules yet'; };
    return `<h2>Money in each month</h2>
    <div class="card lst">${m.rows.map(r => `<button class="li" data-goal="${r.g.id}"><span class="t"><b>${esc(r.g.name)}</b><small>${sub(r)}</small></span><b class="num">${ft(r.total)}</b><span class="chev">${I('chev', 18)}</span></button>`).join('')}
      <button class="li" data-sheet="payrule"><span class="t"><b>Payday rule settings</b><small>${payOn() ? `${payPct()}% of each salary in total · ${p.ask ? 'asks first' : 'automatic'}` : 'Off'}</small></span><span class="chev">${I('chev', 18)}</span></button></div>
    <button class="row" data-saverules=""><span class="ic">${I('sched')}</span><span class="t">Saving rules<small>Every goal with its own rules</small></span><span class="chev">${I('chev',18)}</span></button>
    <div class="fine" style="text-align:center;margin:var(--sp-2) 0 var(--sp-3)">Each goal has its own rules. Change them on the goal's page.</div>
    <button class="btn ghost" data-closesheet>Close</button>`; },
  // account wide payday settings (ask first, keep 20 000 Ft). The % is set per goal on its page
  payrule:()=>{ const p = S.payday, gs = payGoals();
    return `<h2>Payday rule</h2><div class="fine u-sheet-sub">A share of each payment of 10 000 Ft or more: salary, scholarship, money from family. Each goal sets its own share.</div>
    <div class="card lst">${gs.length ? gs.map(g => `<button class="li" data-goalrules="${g.id}"><span class="t"><b>${esc(g.name)}</b><small>${g.rules.pay.pct}% of each salary</small></span><b class="num">${ft(incomeShare(g.rules.pay.pct))}</b><span class="chev">${I('chev', 18)}</span></button>`).join('') : '<div class="li"><span class="t"><b>No payday rule is on</b><small>Turn one on on a goal\'s page</small></span></div>'}</div>
    <div class="fine u-note-t6">All goals together: ${payPct()}% of your salary, about ${ft(incomeShare(payPct()))}. The most is ${PAY_CAP}%.</div>
    <button class="opt slim ${p.ask?'on':''}" data-prask><span class="t"><b class="u-fs-14">Ask me each time</b><small>Off: moves automatically</small></span><span class="tg ${p.ask?'on':''}"></span></button>
    <button class="opt slim ${p.floor?'on':''}" data-prfloor><span class="t"><b class="u-fs-14">Always keep 20 000 Ft on my account</b><small>If money is tight, less or nothing moves</small></span><span class="tg ${p.floor?'on':''}"></span></button>
    <div class="fine u-note-t6">${S.analyst.on ? 'It is the biggest part of Saving in your monthly split, with any weekly transfer and round-ups.' : ''}</div>
    <button class="btn ghost" data-closesheet>Close</button>`; },
  // a discount: detail first (partner, offer, how to redeem), then Activate with Undo, or Add to my rewards (D12)
  perk:()=>{ const d = DISC.find(x => x.id === S._perk); if(!d) return '';
    const on = S.disc.activated.includes(d.id), inR = S.rewards.some(r => r.id === 'p' + d.id);
    return `<h2>${esc(d.n)}</h2><div class="fine u-sheet-sub">${esc(d.t)} Valid until 31 December 2026.</div>
    <div class="card" style="padding:var(--sp-3) var(--sp-4)"><div class="u-rowc"><span class="lg" style="background:${d.bg};color:${d.c};width:44px;height:30px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:var(--fs-xs);font-weight:800">${d.lg}</span><span><div class="k">Partner</div><b class="u-bk-m">${esc(d.n)}</b></span></div><!-- CONFIRM WITH OTP: partners -->
      <div class="k" style="margin-top:var(--sp-3)">Offer</div><b class="u-bk-m">${esc(d.t)}</b>
      <div class="k" style="margin-top:var(--sp-3)">How to redeem</div><ol class="steps">${d.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol></div>
    ${on ? `<div class="note"><b>Activated.</b> It is ready to use at the partner.</div>` : `<button class="btn" data-perkact="${d.id}">Activate</button>`}
    <button class="btn ghost" data-perkadd="${d.id}">${inR ? 'In my rewards' : 'Add to my rewards'}</button><button class="link lnk44 u-pd-no" data-closesheet>Close</button>`; },
  // what the analyst reads: opened from the first-run notice, the analyst sheet and the Spending footer
  anread:()=>{
    return `<h2>What it reads</h2><div class="fine u-sheet-sub">The Financial analyst is on by default. You can turn it off any time.</div>
    <div class="card u-card-bul"><ul class="bul sm"><li>Payee names, amounts and dates of your card and bank payments on this OTP account</li><li>${SIMPLE_PERSELY ? 'It uses them to show what you can spend. It also shows which bills are next.' : 'It uses them to show Safe to spend, your regular bills, your categories and a plan for next month'}</li><li>Nothing leaves the bank. Your data is not shared with anyone outside OTP</li></ul></div>
    <div class="fine u-note-b14">Saving is your payday rule (${savePlan(S, true).rulePct}% of each salary) plus any weekly transfer and round-ups. Bills only tell you: nothing is blocked and nothing moves unless you agree. Turn it off and Safe to spend becomes a simpler estimate, bills stay on.</div>
    <!-- CONFIRM WITH OTP / LEGAL: lawful basis and wording -->
    <button class="btn" data-closesheet>Close</button>${S.analyst.on ? '<button class="btn ghost" data-anask>Turn off</button>' : '<button class="btn ghost" data-anon>Turn on</button>'}`; },
  // Turn off asks first (D10): what changes, what stays
  anoffcfm:()=>`<h2>Turn off the Financial analyst?</h2>
    <div class="u-an-l"><p>Safe to spend becomes a simpler estimate; bills stay on.</p><p>Your categories and plan are hidden until you turn it on again.</p></div>
    <div class="hero-btns u-an-b"><button class="btn eq" data-anoffgo>Turn off</button><button class="btn eq" data-closesheet>Keep it on</button></div>`,
  // financial analyst: opt-in, two equal choices, the suggested split under three short lines; after Turn on: Use this split / Change it
  analyst:()=>{ const a = S.analyst, v = curView();
    const splitRows = `<div class="fine" style="margin:0 2px var(--sp-2)"><b>${v.base}</b></div><div class="card lst">${v.rows.map(r => `<div class="li"><span class="dotc" style="background:${r.col}"></span><span class="t"><b>${r.k === 'must' ? I('lock', 14) + ' ' : ''}${r.name}</b>${r.k === 'save' ? `<small>${saveNote(v)}</small>` : ''}</span><b class="num">${bPct(v, r.k) ? bPct(v, r.k) + ' · ' : ''}${ft(r.amt)}</b></div>`).join('')}</div>`;
    if(!a.on) return `<h2>Financial analyst</h2>
    <div class="u-an-l"><p>Sorts your payments, finds your regular bills and suggests a monthly split.</p><p>Only from this OTP account. Nothing moves without your tap.</p><p>Turn it off any time.</p></div>
    <div class="flabel">Suggested split</div>
    ${splitRows}
    <button class="link lnk44 u-an-read" data-sheet="anread">What it reads ${I('chev',16)}</button>
    <div class="hero-btns u-an-b"><button class="btn eq" data-anon>Turn on</button><button class="btn eq" data-closesheet>Not now</button></div>`;
    if(!a.accepted) return `<h2>Your suggested split</h2><div class="u-sheet-sub"><span class="pill ok">Suggested from your last 3 months</span></div>
    ${splitRows}
    <div class="fine u-note-b14">Saving is your payday rule (${savePlan(S, true).rulePct}% of your ${ft(S.income.amount)} salary) plus any weekly transfer and round-ups: ${payOn() ? `you already move ${payPct()}% of each salary to ${payGoals().length > 1 ? 'your goals' : esc(ruleGoal().name)}.` : `accepting turns the payday rule on for ${esc(ruleGoal().name)} at ${rulesOf(ruleGoal()).pay.pct}% and it asks you first each time.`} Changing the payday rule changes Saving here too.</div>
    <div class="hero-btns u-an-b"><button class="btn eq" data-anaccept>Use this split</button><button class="btn eq" data-splitopen>Change it</button></div><button class="link lnk44 u-an-read" data-anoff>Turn off the analyst</button>`;
    return `<h2>Financial analyst</h2><div class="u-sheet-sub k">The Financial analyst is on.</div>
    ${splitRows}
    <div class="fine u-note-b14">It reads your payments, transfers and income on this OTP account, finds your regular bills, builds your split and gives one insight a month. You can change a payment's category in Transactions. Turn it off and the split, the bills and the tip go away. Nothing is shared.</div>
    ${NEW_PERSELY_IA ? '<button class="btn w" data-go="mymoney">Spending</button>' : '<button class="btn w" data-go="nextmonth">Next month</button><button class="btn w" data-go="bills">Must-pay bills</button>'}<button class="btn w" data-splitopen>Edit my split</button><button class="btn ghost" data-anoff>Turn off the analyst</button>`; },
  // financial health score: four indicators, what they mean, rewards earned
  score:()=>{ const n = scoreNow(), pv = scorePrev(), d = n.t - pv.t;
    return `<h2>Financial health score</h2>
    <div style="text-align:center;margin:-8px 0 var(--sp-4)"><span class="num" style="font-size:2.875rem;font-weight:700;line-height:1">${n.t}</span><span class="k u-fs-16"> / 100</span>
      <div style="font-size:0.875rem;font-weight:600;margin-top:var(--sp-1);color:${deltaCol(d)}">${deltaTxt(d)} since last month</div>
      <div class="fine" style="margin-top:var(--sp-1)">${SCORE_LINE}</div></div>
    <div class="flabel">Four indicators, 25 points each</div>
    <div class="card lst">${SCORE_IND.map(([k,l,hint]) => { const c = n.w.filter(m => m[k]).length, dk = n.p[k] - pv.p[k];
      return `<div class="li"><span class="t"><b>${l}</b><small>${c} of ${n.w.length} months · ${hint}${dk ? ` · <span style="color:${deltaCol(dk)}">${deltaTxt(dk)}</span>` : ''}</small></span><b class="num">${n.p[k]} / 25</b></div>`; }).join('')}</div>
    <div class="flabel">Rewards</div>
    ${S.rewards.length ? `<div class="card lst">${S.rewards.map(r => `<div class="li"><span class="ic">${I('star')}</span><span class="t"><b>${esc(r.title)}</b><small>${esc(r.why)}. ${esc(r.note)}</small></span></div>`).join('')}</div>`
      : `<div class="fine u-note-b12">None yet. Stay within your split for a month and the first one arrives.</div>`}
    <div class="fine u-note-b14">Measured over your last 3 months. Rewards come when your score improves or you stay within your split, never because of how much money you have. Streaks and the score never change your Persely rate.</div>
    <button class="btn ghost" data-closesheet>Close</button>`; },
  // after +1 month: stayed within the split, score up, reward
  reward:()=>{ const r = S._rw; if(!r) return '';
    return `<div class="u-tc">${pig('proud', 84)}</div><h2>Reward earned</h2>
    <div style="text-align:center;margin:-6px 0 var(--sp-4)"><b class="u-fs-16">You stayed within your split</b><div class="fine" style="margin-top:var(--sp-1)">Everyday essentials ${ft(r.ess)} of ${ft(r.essB)} · Fun ${ft(r.fun)} of ${ft(r.funB)}</div></div>
    <div class="card" style="padding:var(--sp-3) var(--sp-4);text-align:center"><div class="k">Health score</div><b class="num u-fs-22">${r.old} → ${r.now}</b><div style="font-size:var(--fs-s);font-weight:600;color:${deltaCol(r.now - r.old)}">${deltaTxt(r.now - r.old)}</div></div>
    <div class="card u-card-offer"><span class="u-ico-g">${I('star',26)}</span><span><b class="u-bk-m">${esc(r.rew.title)}</b><span class="fine">${esc(r.rew.note)}</span></span></div>
    <div class="fine u-note-b14">Boosted cashback for your next month at partner shops. It is for staying within your split, not for how much you have.</div>
    <button class="btn" data-sheet="score">See my score</button><button class="btn ghost" data-closesheet>Close</button>`; },
  // a goal reached 100%: goal-linked partner offer (no fee waiver for students)
  goaloffer:()=>{ const g = goalById(S._offer); if(!g) return '';
    const travel = g.ic === 'plane', o = travel ? {title:'Travel partner offer', note:'8% back on one booking with a partner travel agency. Up to 10 000 Ft.'} : {title:'5% cashback at a partner', note:'Boosted cashback for one month. Up to 2 000 Ft back.'};
    return `<div class="u-tc">${pig('proud', 84)}</div><h2>${esc(g.name)} is fully saved</h2>
    <div class="fine" style="text-align:center;margin:-6px 0 var(--sp-3)">You reached 100%. Here is an offer that fits.</div>
    <div class="card u-card-offer"><span class="u-ico-g">${I(travel ? 'plane' : 'star',26)}</span><span><b class="u-bk-m">${o.title}</b><span class="fine">${o.note}</span></span></div>
    <div class="fine u-note-b14">Optional. Offers come from reaching a goal, not from how much you hold.</div>
    <button class="btn" data-claimoffer>Add to my rewards</button><button class="btn ghost" data-closesheet>Not now</button>`; },
  // edit the split: Must-pay is locked, Everyday essentials is what is left, Fun is a share of the base (steps of 5%), Saving follows the payday rule (% of each salary)
  splitedit:()=>{ const d = S._split || {fun:S.analyst.split.fun, rule:savePlan(S, true).rulePct}, v = splitView(S, {fun:d.fun, rule:d.rule, forceRule:!S.analyst.accepted}), by = v.by;
    const blk = (k, hint, ctl) => { const r = v.rows.find(x => x.k === k); return `<div style="padding:var(--sp-3) 0;border-top:${k === 'must' ? '0' : '1px solid var(--line)'}"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:var(--sp-2)"><b style="display:flex;align-items:center;gap:var(--sp-2)"><span class="dotc" style="background:${r.col}"></span>${k === 'must' ? I('lock', 14) : ''}${r.name}</b><b class="num">${bPct(v, k) ? bPct(v, k) + ' · ' : ''}${ft(r.amt)}</b></div><div class="fine" style="margin-top:2px">${hint}</div>${ctl || ''}</div>`; };
    const stp = (k, val, lo, hi, cap) => `<div style="display:flex;align-items:center;justify-content:flex-end;gap:var(--sp-3);margin-top:var(--sp-2)"><button class="chip sq" data-splitstep="${k}:-5" ${val <= lo ? 'disabled' : ''} aria-label="Less ${bucketName(k)}">−</button><span style="min-width:92px;text-align:center"><b class="num" style="font-size:1rem">${val}%</b> <small class="k">${cap}</small></span><button class="chip sq" data-splitstep="${k}:5" ${val >= hi ? 'disabled' : ''} aria-label="More ${bucketName(k)}">+</button></div>`;
    const funMax = Math.max(0, Math.floor((by.fun.pct + by.ess.pct) / 5) * 5);
    return `<h2>My split</h2><div class="fine" style="text-align:center;margin:-8px 0 var(--sp-2)"><b>${v.base}</b></div>
    <div class="card" style="padding:var(--sp-1) var(--sp-4)">${blk('must', 'locked bills, at their usual amounts')}${blk('ess', 'what is left, with other payments')}${blk('fun', 'your choice: a share of the base', stp('fun', d.fun, 0, funMax, 'of the base'))}${blk('save', `${saveNote(v)}`, `<div style="display:flex;justify-content:flex-end;margin-top:var(--sp-2)"><button class="link lnk44" data-saverules="pay" aria-label="Linked to your payday rule, ${d.rule}% of your salary. Edit">Linked to your payday rule · Edit</button></div>`)}</div>
    <div class="fine u-note-b14">The four add up to 100%. Fun is your choice; Everyday essentials is what is left. Saving here is the payday rule${v.plan.weekly || v.plan.round ? ' plus your weekly transfer and round-ups' : ''}: the % on its row is the share of your salary, and Saving is ${bPct(v, 'save') || ft(by.save.amt)} of the base. Changing it here changes the payday rule too.</div>
    ${(() => { const inv = Math.min(d.inv !== undefined ? d.inv : (S.analyst.invest || 0), by.save.amt); return `<div class="card" style="padding:var(--sp-3) var(--sp-4)"><div style="display:flex;justify-content:space-between;align-items:baseline;gap:var(--sp-2)"><b style="display:flex;align-items:center;gap:var(--sp-2)"><span class="dotc" style="background:var(--c-violet)"></span>Of Saving, for investing</b><span class="k num">${ft(by.save.amt - inv)} stays in Persely</span></div>
      <div style="display:flex;align-items:center;justify-content:flex-end;gap:var(--sp-3);margin-top:var(--sp-2)"><button class="chip sq" data-splitinv="-1000" ${inv <= 0 ? 'disabled' : ''} aria-label="Less for investing">−</button><b class="num" style="min-width:92px;text-align:center;font-size:1rem">${ft(inv)}</b><button class="chip sq" data-splitinv="1000" ${inv + 1000 > by.save.amt ? 'disabled' : ''} aria-label="More for investing">+</button></div>
      <div class="fine" style="margin-top:var(--sp-2)">A plan only: nothing is bought for you. It shows on your monthly plan.</div></div>`; })()}
    <button class="btn" data-splitsave>Save my split</button><button class="btn ghost" data-splitsuggest>Use the suggestion: Fun ${suggestSplit().fun}%</button>`; },
  // the Filter sheet on Transactions: the same options as the chips; nothing changes until Apply
  txfilter:()=>{ const f = txDraft || txF, ch = (k, v, label) => `<button class="chip ${f[k] === v ? 'on' : ''}" data-txfd="${k}|${v}" aria-pressed="${f[k] === v}">${label}</button>`;
    return `<h2>Filter</h2><div class="u-sheet-sub">Pick what to show. Nothing changes until you tap Apply.</div>
    <div class="flabel">Category</div>${TX_CAT_GROUPS.map(([l, ks]) => `<div class="fine" style="margin:var(--sp-2) 0 0">${l}</div><div class="chips u-mb4">${ks.map(c => ch('cat', c, CATEGORY[c][0])).join('')}</div>`).join('')}
    <div class="flabel">Date</div><div class="chips u-mb4">${Object.entries(TX_DATES).map(([v, l]) => ch('date', v, l)).join('')}</div>
    <div class="flabel">In or out</div><div class="chips u-mb4">${Object.entries(TX_DIRS).map(([v, l]) => ch('dir', v, l)).join('')}</div>
    <div class="flabel">Only show</div><div class="chips u-mb4"><button class="chip ${f.pers ? 'on' : ''}" data-txfd="pers|1" aria-pressed="${!!f.pers}">Persely moves</button><button class="chip ${f.bills ? 'on' : ''}" data-txfd="bills|1" aria-pressed="${!!f.bills}">Bills</button></div>
    <button class="btn" data-txfapply>Apply</button><button class="btn w" data-txfclear>Clear</button><button class="btn ghost" data-closesheet>Close</button>`; },
  // recategorise one card payment
  txcat:()=>{ const t = S.tx[S._txi]; if(!t) return '';
    const cur = classify(t), card = isCardTx(t) || txType(t) === 'refund';
    const chips = keys => keys.map(c => `<button class="chip ${cur === c ? 'on' : ''}" data-setcat="${c}">${CATEGORY[c][0]}</button>`).join('');
    const groups = card ? SPLIT_BUCKETS.filter(b => b[0] !== 'save' && b[0] !== 'must').map(([k,l]) => [l, Object.keys(SPLIT_CATS).filter(c => SPLIT_CATS[c][1] === k)])
      : [['Must-pay', ['housing','utilities','pass','phone','insurance']], ['Essentials', ['groceries','transport','edu','health']], ['Fun', ['food','shopping','fun','travel','subs']], ['Other', ['other']]];
    return `<h2>Category</h2><div class="u-sheet-sub"><b style="text-transform:uppercase;font-size:var(--fs-s)">${esc(t.n)}</b> <span class="num k">${sft(t.a)}</span></div>
    ${groups.map(([l, ks]) => `<div class="flabel">${l}</div><div class="chips u-mb4">${chips(ks)}</div>`).join('')}
    <div class="fine u-note-t8">${card ? 'Your split uses the category. Changing it moves this payment between Everyday essentials and Fun.' : 'The choice is remembered for this payee. Must-pay categories are locked bills by default.'}</div>
    <button class="btn ghost" data-closesheet>Close</button>`; },
  // older entries: the rules are per goal now, so these open the overview
  weeklyrule:()=>{ S._srf = 'wk'; return SHEETS.saverules(); },
  roundrule:()=>{ S._srf = 'rr'; return SHEETS.saverules(); },
  sharedgoal:()=>{ const g = goalById(S._shared); if(!g) return '';
    const s = gSaved(g), p = Math.min(100, Math.round(s / g.target * 100));
    return `<h2>${esc(g.name)}</h2><div class="u-sheet-sub"><span class="pill ok">Shared Persely · ${plural(g.members.length,'member')}</span></div>
    <div class="card"><div class="hero-v num" style="font-size:1.625rem">${ft(s)} <small class="k u-fs-14b">of ${ft(g.target)}</small></div><div class="prog" style="margin:var(--sp-2) 0 var(--sp-2)"><i style="width:${p}%"></i></div><div class="k">By ${fDate(g.date)}</div></div>
    <div class="flabel">Who put in what</div>
    <div class="card lst">${g.members.map(m=>`<div class="li">${avatar(m,30)}<span class="t"><b>${m.me ? esc(userFirst()) + ' (you)' : esc(m.n)}</b><small class="num">${ft(m.amt)}</small></span></div>`).join('')}</div>
    <div class="fine u-note-b12">You can always withdraw what you put in. Paying out the whole pot needs everyone to agree. Each share earns 3.0% on the first 500 000 Ft until ${juniorEndLabel()}.</div>
    <div class="hero-btns u-mb6"><button class="btn" data-pickgoal="${g.id}">Add money</button><button class="btn w" data-outgoal="${g.id}">Withdraw</button></div>
    ${g.members.length < 5 ? '<button class="btn ghost" data-invite>Invite a friend</button>' : ''}`; },
  newshared:()=>`<h2>New shared Persely</h2><div class="fine u-sheet-sub">Save with friends or flatmates who are also students. 2–5 people.</div>
    <div class="flabel">Name</div><div class="fld"><span class="t"><input id="shName" maxlength="30" value="Balaton in July" aria-label="Name"></span></div>
    <div class="flabel">Goal</div><div class="chips u-mb4">${[60000,120000,200000].map(v=>`<button class="chip ${(S._shGoal||120000)===v?'on':''}" data-shgoal="${v}">${ft(v)}</button>`).join('')}</div>
    <div class="flabel">Your first deposit</div><div class="chips u-mb4">${[5000,15000,30000].map(v=>`<button class="chip ${(S._shFirst||15000)===v?'on':''}" data-shfirst="${v}">${ft(v)}</button>`).join('')}</div>
    <div class="fine u-note-t8">Everyone can always withdraw what they put in. Paying out the whole pot needs everyone to agree.</div>
    <button class="btn" data-shcreate>Create and invite</button>`,
  addfriend:()=>`<h2>Add friends</h2><div class="u-sheet-sub2">Compare streaks and goal progress. Amounts stay private.</div>
    <button class="row" data-invite><span class="ic">${I('invite')}</span><span class="t">Invite with a link<small>Send it in any chat app</small></span><span class="chev">${I('chev',20)}</span></button>
    <div class="sec"><span>People you may know</span></div>
    ${SUGGEST.map(p=>{ const added = S.friends.some(f=>f.n===p.n);
      return `<div class="row" style="padding:var(--sp-3) var(--sp-4)"><span class="fav" style="background:${avBg(p.c)}">${p.n[0]}</span><span class="t">${p.n}<small>OTP customer · in your contacts</small></span>${added ? `<span style="color:var(--green-t);font-weight:700;font-size:var(--fs-s)">Added</span>` : `<button class="btn sm" data-addfriend="${p.n}">Add</button>`}</div>`; }).join('')}`,
  // the tile chooser as a sheet (New +, Set a goal, the Home card's tab): the same six tiles as the setup card, then the one wizard
  newgoal:()=>{ const hasShared = S.goals.some(g=>g.shared), hasEur = S.goals.some(isEur);
    return `<h2>What are you saving for?</h2><div class="u-sheet-sub2">Up to 5 Perselys.</div>
    <!-- CONFIRM WITH OTP -->
    <div class="fine u-sheet-sub">${SIMPLE_PERSELY ? `3.0% a year on up to ${ft(CAP)}. Until ${juniorEndLabel()}.` : `3.0% a year on up to ${ft(CAP)} with your Junior account until ${juniorEndLabel()}`}</div>
    ${S.draft ? `<button class="row" data-onbresume><span class="ic">${I('star')}</span><span class="t">Continue your draft<small>${esc(S.draft.name || 'Your goal')}, ${ft(S.draft.target)}</small></span><span class="chev">${I('chev',20)}</span></button>` : ''}
    <div class="wn-grid three tiles-s">${Object.entries(GOAL_PRESETS).map(([k,g]) => `<button data-tilepick="${k}">${I(g.ic,24)}${g.label}</button>`).join('')}<button data-tilepick="custom">${I('plus',24)}Something else</button></div>
    ${hasShared ? '' : `<button class="row" data-sheet="newshared"><span class="ic">${I('user')}</span><span class="t">Shared Persely<small>Save together with friends or flatmates</small></span><span class="chev">${I('chev',20)}</span></button>`}
    ${hasEur ? '' : `<button class="row" data-neweur><span class="ic">${I('euro')}</span><span class="t">Euro Persely<small>For Erasmus and travel. No Junior rate</small></span><span class="chev">${I('plus',20)}</span></button>`}`; },
  // Saving rules overview (replaces the D9 master sheet): read only, one row per goal with its own rules; a row opens that goal's rules
  saverules:()=>{
    const gs = plainGoals(), f = S._srf || '', what = {pay:'Payday rule', wk:'Weekly transfer', rr:'Round-ups'}[f];
    return `<h2>Saving rules</h2><div class="fine u-sheet-sub">Each goal has its own rules. Tap a goal to change them.</div>
    ${what ? `<div class="fine srb focus" data-srblock="${f}" style="padding:var(--sp-2) var(--sp-3)">${what} is set on each goal's page.</div>` : ''}
    ${gs.length ? `<div class="card lst srlist">${gs.map(g => `<button class="li" data-goalrules="${g.id}"><span class="ic">${I(g.ic)}</span><span class="t"><b>${esc(g.name)}</b><small>${rulesLine(g)}</small></span><span class="chev">${I('chev', 18)}</span></button>`).join('')}</div>
      <div class="fine u-note-t6">Payday rules: ${payPct()}% of your salary in total (the most is ${PAY_CAP}%). Weekly transfers add up${wkTotal() ? ` to ${ft(wkTotal())} a week` : ''}. Round-ups are shared equally between the goals that have them on.</div>`
      : '<div class="note">Create a goal first. Then choose how money gets in.</div>'}
    <button class="row" data-sheet="payrule"><span class="ic">${I('money')}</span><span class="t">Ask first and keep 20 000 Ft<small>For every payday rule</small></span><span class="chev">${I('chev', 18)}</span></button>
    <button class="row" data-settings="ruledefaults"><span class="ic">${I('gear')}</span><span class="t">Default saving rules for new goals<small>In Settings</small></span><span class="chev">${I('chev', 18)}</span></button>
    <button class="btn ghost" data-closesheet>Close</button>`; },
  keepconfirm:()=>`<h2>Request to keep 3.0%?</h2>
    <!-- CONFIRM WITH OTP -->
    <div class="card u-card-bul"><ul class="bul sm"><li>3.0% a year on the first ${ft(CAP)}, 28% tax on the interest</li><li>Your first salary has to arrive at OTP within 6 months</li><li>Then your goals keep 3.0% until ${juniorEndLabel(12)}</li><li>Without a salary at OTP the rate returns to standard after 30 days' notice</li></ul></div>
    <button class="btn" data-keepok>Confirm</button><button class="btn ghost" data-closesheet>Not now</button>`,
  draftq:()=>`<h2>Save as draft?</h2><div class="u-sheet-sub2">We keep your name, amount and date. Nothing moves.</div>
    <button class="btn" data-onbdraft="1">Save draft</button><button class="btn ghost" data-onbdraft="0">Discard</button>`,
  // soft reminder pre-prompt (flow A3): the system permission is only asked from Turn on
  nudge:()=>`<h2>Want a Sunday nudge?</h2><div class="u-sheet-sub2">One reminder on Sunday at 18:00, only if your week is still open. Change it any time.</div>
    <button class="btn" data-nudgeon>Turn on</button><button class="btn ghost" data-nudgeoff>Not now</button>`,
  month:()=>pkMonthSheet(),
  goodtoknow:()=>`<h2>Good to know</h2>${gtkHTML()}
    <button class="row" data-sheet="how"><span class="t">How Persely works</span><span class="chev">${I('chev',20)}</span></button>`,
  whyp:()=>{   // Savings account vs Persely per 100 000 Ft: one scale, one honest sentence. Rates and the Savings terms to confirm with OTP.
    const rows = [['Persely', RATE, 'var(--green)'], ['Savings account', 3.5, 'var(--blue-i)'], ['Old account', LOW_RATE, 'var(--muted)']], gross = r => Math.round(100000 * r / 100), mx = Math.max(...rows.map(r => gross(r[1])));
    return `<h2>Why Persely?</h2><div class="u-sheet-sub2">What ${ft(100000)} earns in a year</div>
    <!-- CONFIRM WITH OTP -->
    <div class="card whyc">${rows.map(([n, r, c]) => `<div class="why-r"><div class="why-t"><b>${n}</b><span class="num">${r}%</span></div><div class="why-bar"><i style="width:${Math.max(1.5, gross(r) / mx * 100)}%;background:${c}"></i></div><div class="why-s num">${ft(gross(r))} a year, ${ft(Math.round(gross(r) * (1 - TAX)))} after 28% tax</div></div>`).join('')}</div>
    <p class="why-c">The Savings account pays more a year (3.5% against 3.0%) and both are taxed at 28%, while Persely adds goals and lets you withdraw any time with no fees, so check how you reach your money in the Savings account.</p>
    <p class="fine">Persely pays 3.0% on the first ${ft(CAP)} until ${juniorEndLabel()}.</p>
    <button class="row" data-sheet="goodtoknow"><span class="t">Good to know</span><span class="chev">${I('chev',20)}</span></button>`; },
  // Simple Persely: Rate and safety, the one sheet behind every honesty line and every old Good to know / Why Persely? entry (plan 2e).
  // LEGAL CAUTION: this wording, and one line in place of the full conditions on the money screens, need OTP legal review before real use.
  // CONFIRM WITH OTP: the rate, the 500 000 Ft cap across all forint goals, monthly payment, the 12 month extension rule and 30 days' notice,
  // the 0.01% standard rate, the deposit protection scheme name and coverage limit, and the Savings account rate (3.5%) and its access terms.
  ratesafe:()=>{
    const rows = [['Persely', RATE, 'var(--green)'], ['Savings account', 3.5, 'var(--blue-i)'], ['Old account', LOW_RATE, 'var(--muted)']], net = r => Math.round(100000 * r / 100 * (1 - TAX)), mx = Math.max(...rows.map(r => net(r[1])));
    const on = S.verified || S.bridge, end = S.bridge ? juniorEndLabel(12) : juniorEndLabel();
    return `<h2>Rate and safety</h2>
    <!-- CONFIRM WITH OTP -->
    <ul class="gtk rs">
      <li><span class="gi">${I('rate',20)}</span><span><b>Your rate</b>${on ? `You get 3.0% a year on up to ${ft(CAP)}. It ends on ${end}. All your forint goals count together.` : `You get 0.01% a year now. Junior customers get 3.0% on up to ${ft(CAP)}.`}</span></li>
      <li><span class="gi">${I('info',20)}</span><span><b>Tax</b>28% tax comes off the interest. So you keep about 2.2%. We pay it every month.</span></li>
      <li><span class="gi">${I('check',20)}</span><span><b>Your money</b>Withdraw any time, for free. No fees.</span></li>
      ${S.bridge ? '' : `<li><span class="gi">${I('sched',20)}</span><span><b>Keep 3.0% for 12 more months</b>Your first salary must come to OTP within 6 months. If not, you get the standard rate after 30 days' notice.<button class="link lnk44 gtk-l" data-go="grad">Keep my 3.0% ${I('chev',16)}</button></span></li>`}
      <li><span class="gi">${I('piggy',20)}</span><span><b>Standard rate</b>Others get 0.01% a year.</span></li>
      <li><span class="gi">${I('shield',20)}</span><span><b>Protected</b>A state scheme protects your money up to a limit.<!-- CONFIRM WITH OTP: scheme name and coverage limit --><button class="link lnk44 gtk-l" data-depprot>Deposit protection ${I('chev',16)}</button></span></li>
    </ul>
    <div class="flabel">What ${ft(100000)} earns in a year, after tax</div>
    <!-- CONFIRM WITH OTP -->
    <div class="card whyc">${rows.map(([n, r, c]) => `<div class="why-r"><div class="why-t"><b>${n}</b><span class="num">${r.toFixed(r < 1 ? 2 : 1)}%</span></div><div class="why-bar"><i style="width:${Math.max(1.5, net(r) / mx * 100)}%;background:${c}"></i></div><div class="why-s num">${ft(net(r))} a year after tax</div></div>`).join('')}</div>
    <p class="why-c">The Savings account pays a bit more: 3.5%. Persely pays 3.0%. Both are taxed. Persely keeps each goal apart. You can withdraw any time, for free.</p>
    <button class="row" data-sheet="how"><span class="ic">${I('info')}</span><span class="t">How Persely works<small>Streak and saving rules</small></span><span class="chev">${I('chev',20)}</span></button>`; },
  how:()=> SIMPLE_PERSELY ? `<h2>How Persely works</h2>
    <button class="row" data-sheet="ratesafe"><span class="ic">${I('shield')}</span><span class="t">Rate and safety<small>You get 3.0% on up to ${ft(CAP)} until ${juniorEndLabel()}.</small></span><span class="chev">${I('chev',20)}</span></button>
    <div class="flabel">Money in</div>
    <div class="card u-card-bul"><ul class="bul sm"><li>Payday rule: a share of each salary. We ask first.</li><li>Weekly transfer, round-ups, or add money yourself.</li><li>Withdraw any time, for free.</li></ul></div>
    <div class="flabel">Streak</div>
    <div class="card u-card-bul"><ul class="bul sm"><li>Save any amount once a week. Your streak grows.</li><li>You get 1 skip week for every 4 weeks.</li><li>The streak never changes your rate.</li></ul></div>
    <button class="btn" data-tourstart>Show me Persi's hints again</button>` : `<h2>How Persely works</h2>
    <button class="row" data-sheet="goodtoknow"><span class="ic">${I('shield')}</span><span class="t">Good to know<small>Rate, cap, tax, fees and deposit protection</small></span><span class="chev">${I('chev',20)}</span></button>
    <div class="flabel">Junior rate</div>
    <div class="card u-card-bul"><ul class="bul sm"><li>3.0% a year for every Junior customer, automatically, on the first 500 000 Ft, until ${juniorEndLabel()}</li><li>Interest is paid monthly, 28% tax deducted: about 2.2% net</li><li>When Junior ends: 12 more months at 3.0% on the first 500 000 Ft, until ${juniorEndLabel(12)}, if your salary comes to OTP</li></ul></div>
    <div class="flabel">Money in</div>
    <div class="card u-card-bul"><ul class="bul sm"><li>Payday rule: a share of each salary, the app asks first</li><li>Weekly transfer, round-ups, or add money yourself</li><li>Withdraw any time, free of charge</li></ul></div>
    <div class="flabel">Streak</div>
    <div class="card u-card-bul"><ul class="bul sm"><li>Save any amount once a week and your streak grows</li><li>1 skip week for every 4 weeks of streak</li><li>The streak never changes your rate</li></ul></div>
    <button class="btn" data-tourstart>Show me Persi's hints again</button>`
};
Object.assign(SHEETS, SHEETS_BILLS);
if(SIMPLE_PERSELY){ SHEETS.goodtoknow = SHEETS.ratesafe; SHEETS.whyp = SHEETS.ratesafe; }   // every old Good to know and Why Persely? entry opens Rate and safety
/* ---- Simple Persely Add money (plan 2c, D5) ----
   Goal chips only with 2 or more goals; the account is one line, "From Junior account · Change" (Change shows the From chooser and the goal chips);
   the last amount used is already chosen (S.lastAddAmount; the first time 1 000 Ft); the button says the amount; the honesty line sits at the foot.
   The move itself is the unchanged data-hubsave code in 09-events-device.js (same checks, same Undo). */
const ADD_CHIPS = [500, 1000, 2000, 5000];
function hubsaveSimple(){
  const g = goalById(S._goal), e = isEur(g), many = S.goals.length > 1, open = !!S._hsx, pre = e ? 0 : (S.lastAddAmount || 1000), v = S._amt || pre || '';
  const chips = e ? [10, 20, 50, 100] : [...new Set([...ADD_CHIPS, pre])].sort((a, b) => a - b);
  return `${S._fa ? `<h2>Start your streak?</h2><div class="u-sheet-sub2">Add money now. Any amount counts for this week.</div>` : '<h2>Add money</h2>'}
    ${many || open ? `<div class="flabel">To</div><div class="chips u-mb4" role="group" aria-label="To">${S.goals.map(x=>`<button class="chip ${S._goal===x.id?'on':''}" data-pickgoal="${x.id}" aria-pressed="${S._goal===x.id}">${esc(x.name)}</button>`).join('')}</div>` : `<div class="u-sheet-sub2 hsto">To ${esc(g.name)}</div>`}
    <div class="flabel">Amount</div>
    <div class="fld"><span class="t"><input id="mv" inputmode="numeric" value="${v}" placeholder="Amount" aria-label="Amount" aria-describedby="e-mv"></span><b>${e ? '€' : 'Ft'}</b></div><div class="ferr" id="e-mv" role="alert"></div>
    <div class="chips u-mt0 hsamt" role="group" aria-label="Amount">${chips.map(x=>`<button class="chip ${+v === x ? 'on' : ''}" data-setv="${x}" aria-pressed="${+v === x}">${e ? eur(x) : ft(x)}</button>`).join('')}</div>
    ${open ? `<div class="flabel">From</div>${S.accounts.filter(a=>a.id!=='persely').map(a=>`<button class="opt slim ${S._from===a.id?'on':''}" data-hubfrom="${a.id}"><span class="ic">${I('wallet',22)}</span><span class="t"><b>${a.n}</b><small class="num">You have ${ft(a.v)}</small></span>${S._from===a.id?`<span class="u-ico-g">${I('check',22)}</span>`:''}</button>`).join('')}`
      : `<div class="hsfrom"><span>From ${esc(fromName(S._from))}</span><span aria-hidden="true">·</span><button class="link lnk44" data-hubchange aria-label="Change the account or the goal">Change</button></div>`}
    <div class="fine u-note-t6">${e ? `Demo rate 1 € = ${EUR_RATE} Ft. Euro goals don't get the Junior rate.` : S.savedWeek ? 'This week already counts for your streak.' : `Counts for this week: your streak goes to ${S.streak+1}.`}</div>
    <button class="btn" data-hubsave>${v ? `Add ${money(g, +v)}` : 'Add money'}</button>
    ${e ? '' : rsLine()}`;
}
// the chosen chip and the button label follow the amount field; Change and Settings for this goal open in place
function hsSync(){ const f = $('#sheet #mv'), b = $('#sheet [data-hubsave]'); if(!f || !b || !$('#sheet .hsamt')) return; const v = +f.value || 0, g = goalById(S._goal);
  document.querySelectorAll('#sheet .hsamt [data-setv]').forEach(c => { const on = +c.dataset.setv === v; c.classList.toggle('on', on); c.setAttribute('aria-pressed', String(on)); });
  b.textContent = v && g ? `Add ${money(g, v)}` : 'Add money'; }
if(SIMPLE_PERSELY){
  document.addEventListener('input', e => { if(e.target && e.target.id === 'mv') setTimeout(hsSync, 0); });
  document.addEventListener('click', e => { const t = e.target.closest && e.target.closest('[data-setv],[data-gset],[data-hubchange]'); if(!t) return;
    if('setv' in t.dataset){ setTimeout(hsSync, 0); return; }
    if('hubchange' in t.dataset){ if($('#mv')) S._amt = parseFloat($('#mv').value) || 0; S._hsx = true; sheet(SHEETS.hubsave()); return; }
    const id = t.dataset.gset; S._gset = S._gset === id ? null : id; refreshPages(); });
}
/* ---- Between my accounts: one list of places, accounts and plain forint goals; any place to any other ---- */
const lastGoal = () => { const ok = x => x && x.id && goalIsPlain(x) && !!goalById(x.id); return [goalById(S._goal), ruleGoal(), ...S.goals].find(ok) || null; };
const placeKey = (k) => k.startsWith('a:') ? acc(k.slice(2)) : goalById(k.slice(2));
const placeName = k => { const x = placeKey(k); return x ? (k[0] === 'a' ? x.n : x.name) : ''; };
const placeHas = k => { const x = placeKey(k); return !x ? 0 : k[0] === 'a' ? x.v : mine(x); };
const placesList = () => [...S.accounts.filter(a => a.id !== 'persely').map(a => 'a:' + a.id), ...S.goals.filter(goalIsPlain).map(g => 'g:' + g.id)];
function betweenSheet(){
  const ps = placesList(), v = S._amt || '', chips = (cur, attr, from) => ps.map(k => `<button class="chip ${cur === k ? 'on' : ''}" ${attr}="${k}" aria-pressed="${cur === k}">${esc(placeName(k))}${from ? ` · ${ft(placeHas(k))}` : ''}</button>`).join('');
  return `<h2>Between my accounts</h2>
    <div class="flabel">From</div><div class="chips u-mb4" role="group" aria-label="From">${chips(S._mf, 'data-mvfrom', true)}</div>
    <div class="flabel">To</div><div class="chips u-mb4" role="group" aria-label="To">${chips(S._mt, 'data-mvto', false)}</div>
    <div class="flabel">Amount</div>
    <div class="fld"><span class="t"><input id="mv" inputmode="numeric" value="${v}" placeholder="Amount" aria-label="Amount" aria-describedby="e-mv"></span><b>Ft</b></div><div class="ferr" id="e-mv" role="alert"></div>
    <div class="chips u-mt0">${[1000,5000,10000,20000].map(x=>`<button class="chip" data-setv="${x}">${ft(x)}</button>`).join('')}</div>
    <div id="cfm"></div>
    <div class="fine u-note-b14">Your money stays yours. Moving it to a goal counts for this week's streak.</div>
    <button class="btn pbtn" data-mvgo>Move money</button>`;
}
function moveBetween(f, t, v){   // f, t: 'a:junior' / 'g:holiday'; returns true when the move counted for the streak
  const fa = f[0] === 'a' ? acc(f.slice(2)) : null, ta = t[0] === 'a' ? acc(t.slice(2)) : null, fg = f[0] === 'g' ? goalById(f.slice(2)) : null, tg = t[0] === 'g' ? goalById(t.slice(2)) : null;
  if(fa && ta){ fa.v -= v; ta.v += v; S.tx.unshift({...stamp(), d:'Today', n:ta.n.toUpperCase(), s:'Between my accounts', a:-v, ic:'wallet'}); return false; }
  if(fa && tg) return depositTo(tg, v, fa.id);
  if(fg && ta){ if(ta.id === 'junior') withdrawFrom(fg, v); else { if(fg.id === 'holiday') acc('persely').v -= v; else fg.saved -= v; ta.v += v; S.tx.unshift({...stamp(), d:'Today', n:'PERSELY WITHDRAWAL', s:'Between my accounts', a:v, ic:'piggy', note:fg.name}); } return false; }
  if(fg && tg){ takeInto(fg, tg, v); return false; }
  return false;
}
function moneySheet(title,sub,kind){
  const out = kind === 'kivesz', max = out ? acc('persely').v : 0;
  return `<h2>${title}</h2><div class="u-sheet-sub2">${sub}</div>
  <div class="fld"><span class="t"><label for="mv">Amount</label><input id="mv" inputmode="numeric" autocomplete="off" aria-describedby="e-mv"></span><b>Ft</b></div><div class="ferr" id="e-mv" role="alert"></div>
  <div class="chips u-mt0">${[1000,5000,10000,20000].map(v=>`<button class="chip" data-setv="${v}">${ft(v)}</button>`).join('')}${out && max > 0 ? `<button class="chip" data-wall="move" aria-label="Withdraw all, ${ft(max)}">Withdraw all</button>` : ''}</div>
  <div id="cfm"></div>
  <button class="btn pbtn" data-dmove="${kind}">${out?'Withdraw':'Add money'}</button>`;
}

