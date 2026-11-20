/* ================= Simple Persely, Phase 2: the Persely tab for a student who has a goal (docs/simple-persely-plan.md 2b, 2c) =================
   Behind SIMPLE_PERSELY (js/01-tokens-helpers.js; ?simple=0 renders the classic tab in vHub). The tab without a goal (vHubNew) is not touched here.
   The tab is 4 blocks + one honesty line + one More row, with no scroll at 390 x 844:
     1 Persi + ONE sentence from a fixed priority (persiLine, a pure function); at month end a ring around Persi opens the story
     2 up to 3 jars (fill = progress, no numbers inside, "+2" for more) and the one big number: total saved, the same figure as Home's Persely balance
     3 one 56 px "Add money" (last amount pre-selected, D5) and the 44 px "Withdraw" link (D6)
     4 the streak: flame, "Week N", 4 dots (this week ringed), "Save once a week" (skips are used silently, see nextWeek)
   Everything that left the tab sits on the More page (PAGES.persmore), one tap away, grouped. Habits (streak detail, skips, health score, rewards) is PAGES.habits. */

/* ---------- Persi's one sentence: a fixed priority (plan 2b). Pure: it reads only the object it is given ----------
   st = {goals, reached, payAsk, juniorDays, bridge, keepPending, storyNew, period, savedWeek, weekday (0 Sunday .. 6 Saturday), weekN, awayDays, total}
   Order of the checks: 1 no goal, 2 goal reached, 3 payday asked and open, 4 Junior ends in 90 days or less, 5 story ready, 6 week open Friday to Sunday,
   8 back after 3 or more days away, 7 default. Rule 8 is checked before the default 7: the default always matches, so 8 could never show after it. */
const SP_WORDS = t => String(t).replace(/(\d)[\s  ](?=\d)/g, '$1').split(/\s+/).filter(w => /[A-Za-z0-9]/.test(w)).length;   // a number like 12 000 is one word
function persiLine(st){
  const mk = (p, text, mood, act) => ({p, text, mood, act:act || ''});
  if(!st.goals) return mk(1, "Hi! Let's save your first 1 000 Ft.", 'happy');
  if(st.reached){ const t = `You did it! ${st.reached} is full.`; return mk(2, SP_WORDS(t) <= 8 ? t : 'You did it! Your goal is full.', 'proud', 'goal'); }
  if(st.payAsk > 0) return mk(3, `Payday! Save ${ft(st.payAsk)}?`, 'happy', 'payday');
  if(!st.bridge && !st.keepPending && st.juniorDays >= 0 && st.juniorDays <= 90) return mk(4, st.juniorDays > 0 ? `Keep your 3.0%? ${plural(st.juniorDays, 'day')} left.` : 'Keep your 3.0%? It ends today.', 'happy', 'grad');
  if(st.storyNew){ const t = `Your ${st.period} story is here.`; return mk(5, SP_WORDS(t) <= 8 ? t : 'Your story is here.', 'proud', 'story'); }
  if(!st.savedWeek && (st.weekday === 5 || st.weekday === 6 || st.weekday === 0)) return mk(6, `Add any amount to keep week ${st.weekN}.`, 'happy', 'add');
  if(st.awayDays >= 3) return mk(8, `Welcome back. Your ${ft(st.total)} is safe.`, 'happy');
  return mk(7, 'Nice! Your money is safe here.', 'happy');
}
// the week of the streak the student is in now: a saved week is part of S.streak, an open week is the next one (never "Week 0")
const spWeekN = (st = S) => Math.max(1, (st.streak || 0) + (st.savedWeek ? 0 : 1));
// the demo day count: real days plus the simulated months (fast forward), so "days away" also follows the demo clock
const spDayNow = () => Math.floor(Date.now() / 864e5) + Math.round((S.months || 0) * 30.44);
let SP_AWAY = 0;   // days since the last open, measured once when the app starts
try{ if(S.seenDay) SP_AWAY = Math.max(0, spDayNow() - S.seenDay); S.seenDay = spDayNow(); }catch(e){}
function persiState(){
  const rg = S.goals.find(x => goalReached(x) && !x.cont);
  return {goals:S.goals.length, reached:rg ? rg.name : '', payAsk:S.payOpen ? (paydayAlloc().total || 0) : 0, juniorDays:S.juniorDays || 0, bridge:!!S.bridge, keepPending:keepPending(),
    storyNew:storyReady() && !S.storySeen, period:S.period || '', savedWeek:!!S.savedWeek, weekday:demoNow().getDay(), weekN:spWeekN(), awayDays:SP_AWAY, total:total()};
}

/* ---------- block 2: the jars ---------- */
const spJars = () => S.goals.slice(0, 3);
// the jar that shows the target under it: the tapped one, else the one closest to done (not yet full), else the first
function spPickJar(){
  const js = spJars(); if(!js.length) return null;
  const t = js.find(g => g.id === S._jar); if(t) return t;
  const open = js.filter(g => gSaved(g) < gTarget(g)).sort((a, b) => gSaved(b) / gTarget(b) - gSaved(a) / gTarget(a));
  return open[0] || js[0];
}
function jarSvg(g, on){
  const p = Math.max(0, Math.min(1, gSaved(g) / Math.max(1, gTarget(g)))), H = 58, fh = Math.round(H * p * 10) / 10, id = 'jc' + String(g.id).replace(/[^\w-]/g, '');
  const ic = g.shared ? 'user' : isEur(g) ? 'euro' : (P[g.ic] ? g.ic : 'star');
  return `<svg class="jar ${on ? 'on' : ''}" viewBox="0 0 60 76" aria-hidden="true"><defs><clipPath id="${id}"><rect x="6" y="14" width="48" height="${H}" rx="14"/></clipPath></defs>
    <rect class="jar-lid" x="15" y="4" width="30" height="8" rx="3"/>
    <rect class="jar-glass" x="6" y="14" width="48" height="${H}" rx="14"/>
    <rect class="jar-fill" clip-path="url(#${id})" x="6" y="${14 + H - fh}" width="48" height="${fh}"/>
    <svg class="i jar-i" x="18" y="31" width="24" height="24" viewBox="0 0 24 24">${P[ic]}</svg></svg>`;
}

/* ---------- the tab ---------- */
function vHubSimple(){
  try{ S.seenDay = spDayNow(); }catch(e){}
  const pl = persiLine(persiState()), js = spJars(), more = S.goals.length - js.length, pick = spPickJar(), st = S.verified || S.bridge;
  const showTarget = !/\d/.test(pl.text.replace(/3\.0%/g, '')) && pick;   // at most 3 numbers on the tab (plus the rate): the target only when Persi's line has none
  const ring = storyReady();
  const act = {payday:'data-spact="payday"', grad:'data-go="grad"', story:'data-story', goal:`data-goal="${(S.goals.find(x => goalReached(x) && !x.cont) || {}).id}"`, add:'data-sheet="hubsave" data-lastamt'}[pl.act] || '';
  const nudge = typeof spNudgeHTML === 'function' ? spNudgeHTML() : '';   // Phase 1: "Want a nudge on Sunday?" (Yes / Not now) takes Persi's line while it is pending
  const say = nudge ? nudge : act ? `<button class="sp-say" ${act}><span>${esc(pl.text)}</span>${I('chev', 16)}</button>` : `<div class="sp-say"><span>${esc(pl.text)}</span></div>`;
  const persi = ring ? `<button class="sp-ring ${S.storySeen ? 'seen' : ''}" data-story data-persi-ring aria-label="Your ${esc(S.period)} story">${pig(pl.mood, 60)}</button>` : `<span class="sp-pig">${pig(pl.mood, 60)}</span>`;
  const weeks = Array.from({length:4}, (_, i) => S.week - 3 + i), wn = spWeekN();
  const rate = st ? `${rateLabel()} until ${S.bridge ? juniorEndLabel(12) : juniorEndLabel()}` : `${rateLabel()} a year`;
  return `<div class="tabtitle">Persely</div>
  <div class="sp-blk sp-persi" data-block="persi">${persi}${say}</div>
  <div class="sp-blk sp-pic" data-block="picture">
    <div class="sp-big"><b class="num" data-sptotal>${ft(total())}</b><small>Saved</small></div>
    <div class="sp-jars">${js.map(g => `<button class="sp-jar ${pick && pick.id === g.id ? 'on' : ''}" data-jar="${g.id}"${showTarget && !(pick && pick.id === g.id) ? '' : ' data-jaropen'} aria-label="${esc(g.name)}: ${pctOf(g).txt || '0%'} saved. ${showTarget && !(pick && pick.id === g.id) ? 'Show its target' : 'Open the goal'}"${pick && pick.id === g.id ? ' aria-pressed="true"' : ''}>${jarSvg(g, pick && pick.id === g.id)}<span class="sp-jt">${showTarget && pick.id === g.id ? `of ${money(g, gTarget(g))}` : ''}</span></button>`).join('')}${more > 0 ? `<span class="sp-plus" aria-label="${plural(more, 'more goal')} on the More page">+${more}</span>` : ''}</div>
  </div>
  <div class="sp-blk sp-act" data-block="add"><button class="btn sp-add" data-sheet="hubsave" data-lastamt>Add money</button><button class="link sp-out" data-sheet="hubout">Withdraw</button></div>
  <div class="sp-blk sp-streak" data-block="streak">${flame(30, S.streak > 0 || S.savedWeek)}<span class="sp-wk"><b>Week ${wn}</b><small>Save once a week</small></span>
    <span class="sp-dots" aria-label="Last 4 weeks">${weeks.map(w => { const on = S.history.includes(w) || (S.skipped || []).includes(w); return `<i class="${on ? 'on' : ''} ${w === S.week ? 'now' : ''}"></i>`; }).join('')}</span></div>
  <!-- CONFIRM WITH OTP -->
  <button class="sp-honest" data-sheet="ratesafe" aria-label="Rate and safety: rate, withdraw any time and deposit protection. Learn more"><span class="sp-rate">${rate} · Withdraw any time · Protected ⓘ</span> <span class="sp-learn">Learn more</span></button>
  <button class="row sp-more" data-go="persmore"><span class="ic">${I('menu')}</span><span class="t"><b>More: goals, rules, rate</b></span><span class="chev">${I('chev', 20)}</span></button>`;
}

/* ---------- the More page: one level, grouped, icon + 1 to 3 words, verbs first. Every block that left the tab is here (SP_MORE_MAP) ---------- */
const spRow = (attr, ic, label, sub) => `<button class="row" ${attr} aria-label="${String(label).replace(/<[^>]+>/g, '')}${sub ? '. ' + String(sub).replace(/<[^>]+>/g, '') : ''}"><span class="ic">${ic}</span><span class="t"><b>${label}</b>${sub ? `<small>${sub}</small>` : ''}</span><span class="chev">${I('chev', 20)}</span></button>`;
function moreHTML(){
  const gl = S.goals.filter(g => !isEur(g)), gT = gl.reduce((x, g) => x + gTarget(g), 0), gp = gT > 0 ? Math.min(1, gl.reduce((x, g) => x + gSaved(g), 0) / gT) : 0;
  const hasShared = S.goals.some(g => g.shared), hasEur = S.goals.some(isEur), m = moneyIn(), st = S.verified || S.bridge, et = eurTotal();
  const junior = keepPending() ? `Waiting for your first salary at OTP · ${keepLeft()}` : S.bridge ? `3.0% until ${juniorEndLabel(12)}` : S.juniorDays > 0 ? `Your 3.0% ends on ${juniorEndLabel()}` : 'Your Junior package ended today';
  const sc = S.analyst.on ? ` · Health score ${scoreNow().t} of 100` : '';
  return `<div class="sec u-mt6" data-more="goals"><span>Goals</span></div>
  <div class="fine sp-msub">${gl.length ? `${Math.round(gp * 100)}% of what your goals need` : 'Set a goal to see how far you are'}${et ? ` · + ${eur(et)} in euro goals` : ''}</div>
  ${S.goals.map(goalCardHTML).join('')}
  ${spRow('data-sheet="newgoal"', I('plus'), 'New goal', 'Up to 5 goals')}
  ${hasShared ? '' : spRow('data-sheet="newshared"', I('user'), 'Share a goal', 'Save together with friends')}
  ${hasEur ? '' : spRow('data-neweur', I('euro'), 'Save in euro', 'For Erasmus and travel. No Junior rate')}
  ${plainGoals().length ? `<div class="sec" data-more="rules"><span>Saving rules</span></div>
  <div class="card lst srlist">${plainGoals().map(g => `<button class="li" data-goalrules="${g.id}" aria-label="${esc(g.name)}: ${rulesLine(g)}. Change"><span class="ic">${I(g.ic)}</span><span class="t"><b>${esc(g.name)}</b><small>${rulesLine(g)}</small></span><span class="chev">${I('chev', 18)}</span></button>`).join('')}</div>
  ${spRow('data-sheet="moneyin" data-more="moneyin"', I('coins'), m.total ? `<span class="num">${ft(m.total)}</span> a month moves in by itself` : 'Nothing moves in by itself yet', m.ask ? 'Payday asks first' : 'Each goal has its own rules')}` : ''}
  <div class="sec" data-more="rate"><span>Your rate</span></div>
  ${spRow('data-sheet="ratesafe" data-more="ratesafe"', I('shield'), 'Rate and safety', st ? `${rateLabel()} · about <span class="num">${ft(yearNet())}</span> a year after tax` : `${rateLabel()} · about <span class="num">${ft(yearNet())}</span> a year`)}
  <!-- CONFIRM WITH OTP -->
  ${spRow('data-go="grad" data-more="junior"', I('sched'), 'Keep my 3.0%', junior)}
  <div class="sec" data-more="you"><span>You</span></div>
  ${spRow('data-go="habits" data-more="habits"', flame(24, S.streak > 0), 'Habits', `Week ${spWeekN()}${sc}`)}
  ${analysisRow()}
  ${perksRow()}
  ${S.friendsOptIn ? friendsCard() : spRow('data-frjoin data-more="friends"', I('user'), 'Add friends', 'Compare weekly streaks. Nobody sees your balance')}
  ${yearRow()}
  <div class="sec" data-more="account"><span>Account</span></div>
  ${spRow('data-go="inbox" data-more="notif"', I('bell'), 'Notifications', S.inbox && S.inbox.some(n => !n.read) ? 'New messages' : 'Your messages')}
  ${spRow('data-go="bills" data-more="bills"', I('doc'), 'Bills', 'See what is due and pay it')}
  ${spRow('data-go="kartyaim" data-more="cards"', I('cards'), 'My cards', 'Block it and see your Discounts')}
  <div class="sec" data-more="help"><span>Help and settings</span></div>
  ${spRow('data-sheet="how" data-more="how"', I('info'), 'How Persely works', '')}
  ${spRow('data-settings="persely" data-more="settings"', I('gear'), 'Persely settings', 'Reminders and default rules')}`;
}
// Habits: the old "Your habits" card (8 weeks, best, skips, reminders notice, health score with its line) and the rewards
function habitsHTML(){
  const weeks = Array.from({length:8}, (_, i) => S.week - 7 + i);
  return `<div class="card hab u-mt6">
    <div class="u-rowc">${flame(36, S.streak > 0)}<div class="u-fx1"><div style="font-size:1.375rem;font-weight:700">${S.streak}-week streak</div><div class="u-k-sm">Best: ${S.best} · ${plural(S.skips, 'skip')} left</div></div>${S.savedWeek ? '<span class="pill ok">Saved</span>' : ''}</div>
    <div class="wk">${weeks.map(w => { const on = S.history.includes(w), sk = (S.skipped || []).includes(w);
      return `<div class="${on ? 'on' : ''} ${sk ? 'sk' : ''} ${w === S.week ? 'today' : ''}"><i>${on ? '✓' : sk ? '–' : ''}</i><span>${w === S.week ? 'Now' : ''}</span></div>`; }).join('')}</div>
    ${remindRow()}${scoreRow()}
  </div>
  <div class="card u-card-bul"><ul class="bul sm"><li>Save any amount once a week. Automatic savings count too.</li><li>You get 1 skip week for every 4 weeks. A missed week uses it by itself.</li><li>The streak never changes your rate.</li></ul></div>
  ${spRow('data-go="perks" data-rewards', I('gift'), 'My rewards', plural(S.rewards.length, 'reward'))}`;
}
PAGES.persmore = {title:'More', html:() => moreHTML()};
PAGES.habits = {title:'Habits', html:() => habitsHTML()};
// every block that left the tab -> where it lives now (More page selector, one tap). chk-simple-more-complete walks this map.
const SP_MORE_MAP = [
  ['goal cards', '[data-goal]'], ['fix buttons on goal cards', '.gwrap'], ['New goal', '[data-sheet="newgoal"]'], ['gauge and % of what your goals need', '.sp-msub'],
  ['Saving rules list', '.srlist [data-goalrules]'], ['Money in each month panel', '[data-sheet="moneyin"]'], ['interest line in Ft and fine print (Rate and safety)', '[data-sheet="ratesafe"]'],
  ['Junior row', '[data-go="grad"]'], ['reminders notice, health score, streak detail', '[data-go="habits"]'], ['Spending row', '[data-go="mymoney"]'], ['Perks row', '[data-go="perks"]'],
  ['friends and Add friends', '[data-frjoin], [data-frtoggle]'], ['How Persely works', '[data-sheet="how"]'], ['gear icon', '[data-settings="persely"]'],
  ['Notifications (inbox)', '[data-go="inbox"]'], ['Bills', '[data-go="bills"]'], ['My cards', '[data-go="kartyaim"]']];

/* ---------- small handlers (capture phase, before the app's click handler in js/09) ---------- */
document.addEventListener('click', e => {
  // Persi inside the month end ring: the 3D Persi keeps its own taps (it jumps), so the ring's story is opened from here
  if(e.target && e.target.closest && e.target.closest('[data-persi-ring] .pig3d') && typeof openStory === 'function'){ e.stopPropagation(); openStory(); return; }
  const t = e.target && e.target.closest ? e.target.closest('button,a,[data-go],[data-tab]') : null; if(!t) return; const d = t.dataset;
  if('lastamt' in d) S._amt = 0;   // D5: hubsaveSimple (js/08) pre-selects S.lastAddAmount, which js/09 stores after each forint deposit
  if('rewards' in d) perkTab = 1;
  // a jar: the first tap moves the target under it; a tap on the jar that already shows it (or when no target can show) opens the goal
  if(d.jar){ e.stopPropagation(); if('jaropen' in d){ S._detail = d.jar; closeSheet(); pushPage('goal'); return; } S._jar = d.jar; renderView('hub'); if(typeof mountPig === 'function') mountPig(); return; }
  if(d.spact === 'payday'){ e.stopPropagation(); if(payOn() || paydayBills()) sheet(SHEETS.payday()); return; }
  // the payday question is answered (Move, Cover or Not this time) or closed: Persi stops asking
  if(S.payOpen && ('paymove' in d || d.paycover !== undefined || ('closesheet' in d && $('#sheet') && $('#sheet').querySelector('[data-paymove],[data-paycover]')))) S.payOpen = false;
}, true);
// the payday rule asked: Persi's priority 3 stays until it is answered
if(typeof salaryArrives === 'function'){ const spSalary0 = salaryArrives;
  salaryArrives = function(){ const r = spSalary0.apply(this, arguments); if(payOn() && S.payday && S.payday.ask && (paydayAlloc().total || 0) > 0){ S.payOpen = true; save(); if(SIMPLE_PERSELY) renderView('hub'); } return r; }; }

/* ---------- self-checks (called from __checkAnalytics when SIMPLE_PERSELY is on) ---------- */
function simpleTabChecks(ok){
  const sv = S, cur0 = cur, stk = stack.splice(0), lock0 = demo.locked, views = [...document.querySelectorAll('.view')].map(v => v.classList.contains('on')), away0 = SP_AWAY, hf0 = HINT_FORCE; demo.locked = false;
  const showHub = () => { closeSheet(); cur = 'hub'; document.querySelectorAll('.view').forEach(v => v.classList.toggle('on', v.id === 'v-hub')); renderView('hub'); $('#v-hub').scrollTop = 0; return $('#v-hub'); };
  const vis = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const nums = (t) => (t.match(/\d(?:[\d.,]|[\s  ](?=\d))*%?/g) || []);
  const measure = () => { const v = showHub(), sc = $('#phone').getBoundingClientRect().width / $('#phone').offsetWidth || 1, top = v.getBoundingClientRect().top;
    const blocks = [...v.children].filter(el => el.dataset.block).map(el => el.dataset.block), kids = [...v.children].map(el => el.className.split(' ')[0]);
    const last = [...v.children].pop(), bottom = (last.getBoundingClientRect().bottom - top) / sc + parseFloat(getComputedStyle(v).paddingBottom);
    const honest = v.querySelector('.sp-honest'), plus = v.querySelector('.sp-plus');
    const all = v.innerText || '', rest = all.replace(honest ? honest.innerText : '', ' ').replace(plus ? plus.innerText : '', ' ').replace(/\d+\.\d+%/g, ' ');   // the rate and its date (honesty line) and the +2 badge of the picture are not counted
    const ctrls = [...v.querySelectorAll('button, a, [data-go], [data-sheet], [data-tab]')].filter(el => vis(el) && !el.closest('[data-jar], [data-persi-ring], .sp-say, .pig3d'));
    return {blocks, kids, height:Math.round(bottom), scroll:v.scrollHeight - v.clientHeight, words:SP_WORDS(all), nums:nums(rest), ctrls:ctrls.map(el => (el.innerText || el.getAttribute('aria-label') || '').trim().slice(0, 20)),
      honest:!!honest, more:v.querySelectorAll('[data-go="persmore"]').length, prim:[...v.querySelectorAll('button')].filter(b => vis(b) && getComputedStyle(b).backgroundColor === PRIM).length,
      hints:v.querySelectorAll('.hint, [data-hk]').length, grey:v.querySelectorAll('.sring.off, [data-storywait], .sring').length, html:v.innerHTML};
  };
  const probe = document.createElement('button'); probe.className = 'btn'; probe.style.position = 'absolute'; probe.style.left = '-999px'; $('#v-hub').appendChild(probe); const PRIM = getComputedStyle(probe).backgroundColor; probe.remove();
  const three = () => { S = fresh('existing'); S.goals = S.goals.slice(0, 3); return S; };
  const five = () => { S = fresh('existing'); ['a', 'b'].forEach((k, i) => S.goals.push({id:'x' + k, name:'Goal ' + k, ic:'star', saved:1000 * (i + 1), target:50000, pace:1000, date:'2027-09-01', rules:offRules()})); return S; };
  const one = () => { S = fresh('existing'); S.goals = [S.goals.find(g => g.id === 'fest')]; S.ruleGoal = 'fest'; return S; };
  // states: existing seed (Junior 41 days -> priority 4), a 3 goal state with a long Persi line, 1 goal, 5 goals (+2), month end ring
  const states = [['existing seed', () => { S = fresh('existing'); }], ['3 goals, week open on a weekend line', () => { three(); S.juniorDays = 300; SP_AWAY = 0; }],
    ['3 goals, welcome back', () => { three(); S.juniorDays = 300; S.savedWeek = true; SP_AWAY = 5; }], ['1 goal', () => { one(); S.juniorDays = 300; }],
    ['5 goals', () => { five(); S.juniorDays = 300; }], ['month end', () => { S = fresh('existing'); S.juniorDays = 300; S.monthEnd = true; }],
    ['goal reached, target shown', () => { S = fresh('existing'); const f = goalById('fest'); f.saved = f.target; }], ['payday asked', () => { S = fresh('existing'); setMain(S, 'pay', true); S.payOpen = true; }],
    ['existing seed, hints forced', () => { S = fresh('existing'); S.hints = {}; HINT_SHOWN.clear(); HINT_FORCE = true; }]];
  const R = {};
  try{
    states.forEach(([n, f]) => { f(); R[n] = measure(); HINT_FORCE = hf0; SP_AWAY = away0; });
    const vals = Object.values(R), bad = (k, test) => Object.entries(R).filter(([, r]) => !test(r)).map(([n, r]) => [n, r[k]]);
    const bBad = bad('blocks', r => r.blocks.length <= 4 && r.blocks.join() === 'persi,picture,add,streak' && r.honest && r.more === 1 && r.kids.join() === 'tabtitle,sp-blk,sp-blk,sp-blk,sp-blk,sp-honest,row'), hBad = bad('height', r => r.height <= 778 && r.scroll <= 0);
    ok('chk-simple-tab-blocks: the Persely tab (with a goal) is 4 blocks (Persi, jars with the big number, Add money, streak) + the honesty line + one More row; content height 778 px or less and no scroll at 390 x 844, for the existing user seed, 3 goals, 1 goal, 5 goals and month end', !bBad.length && !hBad.length, {bBad, hBad, h:Object.fromEntries(Object.entries(R).map(([n, r]) => [n, r.height])), w:innerWidth});
    const wBad = bad('words', r => r.words <= 40), nBad = bad('nums', r => r.nums.length <= 3), cBad = bad('ctrls', r => r.ctrls.length <= 4);
    ok('chk-simple-words-numbers: 40 words or less on the tab, 3 numbers or less plus the rate (the honesty line holds the rate and its date), 4 controls or less (Add money, Withdraw, Learn more, More) besides the jars and Persi', !wBad.length && !nBad.length && !cBad.length, {wBad, nBad, cBad, words:Object.fromEntries(Object.entries(R).map(([n, r]) => [n, r.words]))});
    ok('chk-simple-no-hints: no Persi hint strips and no grey story ring on the tab (hints forced on, before month end); at month end the ring around Persi opens the story', vals.every(r => !r.hints) && R['existing seed'].grey === 0 && R['existing seed, hints forced'].grey === 0 && /data-persi-ring/.test(R['month end'].html) && /data-story/.test(R['month end'].html) && !/data-storywait|sring off/.test(R['month end'].html), vals.map(r => [r.hints, r.grey]));
    ok('chk-simple-one-primary: one primary styled button on the tab (Add money, 56 px), Withdraw is a 44 px link under it', vals.every(r => r.prim === 1) && (() => { const v = showHub(), a = v.querySelector('.sp-add'), w = v.querySelector('.sp-out'); return a && w && Math.round(a.getBoundingClientRect().height) >= 56 && w.getBoundingClientRect().height >= 44 && w.getBoundingClientRect().top > a.getBoundingClientRect().top; })(), vals.map(r => r.prim));
    // Persi priority: constructed states, pure function
    const base = {goals:2, reached:'', payAsk:0, juniorDays:300, bridge:false, keepPending:false, storyNew:false, period:'November', savedWeek:true, weekday:3, weekN:4, awayDays:0, total:12000};
    const cases = [[{goals:0}, 1, "Hi! Let's save your first 1 000 Ft."], [{reached:'Summer holiday', payAsk:7500, juniorDays:30}, 2, 'You did it! Summer holiday is full.'], [{payAsk:7500, juniorDays:30, storyNew:true}, 3, `Payday! Save ${ft(7500)}?`],
      [{juniorDays:85, storyNew:true, savedWeek:false, weekday:5}, 4, 'Keep your 3.0%? 85 days left.'], [{juniorDays:85, bridge:true, storyNew:true}, 5, 'Your November story is here.'], [{savedWeek:false, weekday:0, awayDays:9}, 6, 'Add any amount to keep week 4.'],
      [{savedWeek:false, weekday:2}, 7, 'Nice! Your money is safe here.'], [{}, 7, 'Nice! Your money is safe here.'], [{awayDays:3, total:1000}, 8, `Welcome back. Your ${ft(1000)} is safe.`], [{awayDays:2}, 7, 'Nice! Your money is safe here.'],
      [{juniorDays:85, keepPending:true}, 7, 'Nice! Your money is safe here.'], [{reached:'A very long goal name for my trip'}, 2, 'You did it! Your goal is full.']];
    const pBad = cases.map(([o, p, t]) => { const r = persiLine({...base, ...o}); return r.p === p && r.text === t && SP_WORDS(r.text) <= 8 ? null : [o, r]; }).filter(Boolean);
    S = fresh('existing'); const live = persiLine(persiState()), shown = /class="sp-say"/.test(vHubSimple()) && vHubSimple().includes(esc(live.text)) && (vHubSimple().match(/class="sp-say"/g) || []).length === 1;
    ok('chk-simple-persi-priority: the 8 priority rules pick the right sentence (1 no goal, 2 goal reached, 3 payday open, 4 Junior ends in 90 days, 5 story, 6 week open Friday to Sunday, 8 back after 3 days, 7 default), every sentence 8 words or less, one Persi sentence on the tab, the same as persiLine', !pBad.length && shown && live.p === 4, {pBad, live});
    // More page: every removed block is one tap away
    S = fresh('existing'); S.analyst.on = true; S.months = 12;
    const openMore = () => { while(stack.length) popPage(true); closeSheet(); showHub(); const mb = $('#v-hub [data-go="persmore"]'); if(mb) mb.click(); return stack.length ? stack[stack.length - 1] : null; };
    const pg = openMore(), inMore = pg && pg.dataset.id === 'persmore', missing = SP_MORE_MAP.filter(([, sel]) => !(pg && pg.querySelector('.scroll ' + sel.split(', ').join(', .scroll '))));
    const old = (() => { const g = S.goals.map(goalCardHTML).join(''); return pg && g.length > 0 && (pg.innerHTML.match(/class="gfix"/g) || []).length === (g.match(/class="gfix"/g) || []).length; })();
    const go = (sel, want) => { const m = openMore(), b = m && m.dataset.id === 'persmore' && m.querySelector('.scroll ' + sel); if(!b) return 'missing'; b.click(); const t = stack.length ? stack[stack.length - 1].dataset.id : '';
      const r = sheetOpen() ? 'sheet:' + ($('#sheet h2') || {textContent:''}).textContent.trim() : t && t !== 'persmore' ? t + (t === 'settings' && $('.page [data-sec="persely"].focus') ? ':persely' : '') : 'none'; closeSheet(); return want.test(r) ? true : r; };
    const taps = {goal:go('[data-goal]', /^goal$/), newgoal:go('[data-sheet="newgoal"]', /What are you saving for/), rules:go('.srlist [data-goalrules]', /^goal$/), moneyin:go('[data-sheet="moneyin"]', /^sheet:/), rate:go('[data-sheet="ratesafe"]', /Rate and safety/), keep:go('[data-more="junior"]', /^grad$/),
      junior:go('[data-go="grad"]', /^grad$/), habits:go('[data-go="habits"]', /^habits$/), spending:go('[data-go="mymoney"]', /^mymoney$/), perks:go('[data-go="perks"]', /^perks$/), year:go('[data-go="year"]', /^year$/), how:go('[data-sheet="how"]', /How Persely works/), settings:go('[data-settings="persely"]', /^settings:persely$/),
      notif:go('[data-go="inbox"]', /^inbox$/), bills:go('[data-go="bills"]', /^bills$/), cards:go('[data-go="kartyaim"]', /^kartyaim$/)};
    const hm = openMore(), hb = hm && hm.querySelector('.scroll [data-go="habits"]'); if(hb) hb.click(); const hp = stack.length > 1 && stack[stack.length - 1].dataset.id === 'habits' ? stack[stack.length - 1].innerHTML : '';
    const habitsOk = /\d+-week streak/.test(hp) && /skip/.test(hp) && /data-sheet="score"/.test(hp) && /Spending under income|Spend less than you get/.test(hp) && /data-rewards/.test(hp);
    const tapBad = Object.entries(taps).filter(([, v]) => v !== true);
    while(stack.length) popPage(true);
    const noTab = (() => { S = fresh('existing'); S.analyst.on = true; S.months = 12; const h = vHubSimple().replace(/<button class="sp-say"[\s\S]*?<\/button>/, ''); return !/data-tour="goals"|class="gauge"|class="card mgauge"|srlist|data-go="mymoney"|data-go="perks"|data-go="year"|data-go="grad"|class="tgear"|data-sheet="how"|data-frjoin|class="hint"|hab-score|class="rem"|class="fine"|class="gfix"/.test(h); })();
    ok('chk-simple-more-complete: every block that left the tab (goal cards and fixes, New goal, % of goals, Saving rules, Money in, rate and fine print, Junior, habits with reminders and health score, Spending, Perks, Your year, friends, How Persely works, the gear) is on the More page and opens in 1 tap; none of them is left on the tab', inMore && !missing.length && old && !tapBad.length && habitsOk && noTab, {inMore, missing:missing.map(x => x[0]), old, tapBad, habitsOk, noTab});
    // Phase 1 + 3b on the new tab: the Sunday nudge question takes Persi's line while pending; the one honesty line opens Rate and safety
    S = fresh('existing'); S.juniorDays = 300; S.nudgeAsk = 'ask'; const rN = measure(), nv = $('#v-hub'), nb = [...nv.querySelectorAll('[data-block="persi"] .spnudge .btn')];
    const nudgeOn = nb.length === 2 && /Want a nudge on Sunday\?/.test(nv.querySelector('[data-block="persi"]').textContent) && !nv.querySelector('.sp-say') && rN.blocks.join() === 'persi,picture,add,streak' && rN.scroll <= 0 && rN.height <= 778 && rN.ctrls.length <= 6 && rN.words <= 44;
    nb[1] && nb[1].click(); const nudgeOff = S.nudgeAsk === 'done' && !$('#v-hub .spnudge') && !!$('#v-hub .sp-say');
    const hn = $('#v-hub').querySelectorAll('.sp-honest, .rsline, .sphon').length; $('#v-hub .sp-honest').click(); const hRs = sheetOpen() && /Rate and safety/.test($('#sheet h2').textContent) && /Keep my 3\.0%/.test($('#sheet').textContent); closeSheet();
    ok('chk-simple-tab-nudge-rate: with a nudge pending the Persi block holds "Want a nudge on Sunday?" with equal Yes / Not now (4 blocks, no scroll, counted only then: 6 controls, 44 words at most); Not now brings Persi\'s line back; exactly one honesty line on the tab, and it opens Rate and safety (with Keep my 3.0%)', nudgeOn && nudgeOff && hn === 1 && hRs, {nudgeOn, nudgeOff, hn, hRs, ctrls:rN.ctrls, words:rN.words, h:rN.height});
    // Add money: the last amount is pre-selected (D5; S.lastAddAmount, 1 000 Ft the first time, Phase 3b); Withdraw opens the withdraw sheet
    S = fresh('existing'); S.lastAddAmount = 0; showHub(); $('#v-hub .sp-add').click(); const empty0 = sheetOpen() && $('#mv') && $('#mv').value === '1000'; $('#mv').value = '2500'; const b0 = goalById(S._goal) || S.goals[0], s0 = gSaved(b0); $('#sheet [data-hubsave]').click(); hideChip(true); hideToast(true);
    const stored = S.lastAddAmount === 2500 && gSaved(b0) === s0 + 2500; $('#v-hub .sp-add').click(); const pre = sheetOpen() && $('#mv') && $('#mv').value === '2500'; closeSheet(); $('#v-hub .sp-out').click(); const wd = sheetOpen() && /Withdraw/.test($('#sheet h2').textContent); closeSheet();
    ok('chk-simple-add-last-amount: Add money on the tab opens the Add money sheet with the last amount pre-selected (S.lastAddAmount, stored after a deposit; 1 000 Ft the first time); the Withdraw link opens the withdraw sheet', empty0 && stored && pre && wd, {empty0, stored, pre, wd});
  } catch(e){ ok('chk-simple-tab: the simple tab checks ran without errors', false, String(e && e.stack || e)); }
  finally { HINT_FORCE = hf0; HINT_SHOWN.clear(); SP_AWAY = away0; hideChip(true); hideToast(true); closeSheet(); while(stack.length) popPage(true); S = sv; cur = cur0; stack.push(...stk); demo.locked = lock0; try{ renderAll(); }catch(e){} document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', views[i])); }
}
