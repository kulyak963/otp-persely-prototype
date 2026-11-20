/* ================= Simple Persely, Phase 1: the first 30 seconds (docs/simple-persely-plan.md 2a, docs/simple-persely-phase1-notes.md) =================
   Flag: SIMPLE_PERSELY (js/01, ?simple=0 falls back). Everything here is gated by spOn().
   Path: Home card "Save your first 1 000 Ft" (or the Persely tab icon) -> one of 4 tiles -> ONE confirm screen -> "Save 1 000 Ft now".
   That last tap creates the goal AND moves the first deposit (one undoable() entry, 10 s chip), starts the streak (week 1) and plays the reward
   on the Persely tab: coin into Persi, a coin chime (Settings > Persely > Sound, follows the silent switch), a haptic tick, "Week 1 done", "1 000 Ft saved!", Great.
   No "Start your streak?" sheet and no Sunday nudge sheet on day 0: Persi asks "Want a nudge on Sunday?" on the next visit to the tab. */
let SP_LEGACY = false;   // self-checks only: render the ?simple=0 first run in the same page (SIMPLE_PERSELY is read once from the address)
const spOn = () => SIMPLE_PERSELY && !SP_LEGACY;
const spFirstRun = () => spOn() && !S.goals.length;
// runtime state of this file; force* and dry are for the self-checks and the demo (never saved)
const SP = {celebrated:false, rewardOn:false, last:null, forceOffline:false, forceFail:false, forceRM:null, dry:false};
const SP_FLOOR = 20000;   // the first deposit keeps 20 000 Ft on the Junior account, like the payday rule
// D10: 4 first-run tiles. Trip and Safety net come from GOAL_PRESETS; Phone or tech is new (no preset existed); Something else is the neutral custom goal
const SP_TILES = [['travel', 'Trip', 'plane'], ['tech', 'Phone or tech', 'phone'], ['safety', 'Safety net', 'lock'], ['custom', 'Something else', 'plus']];
const SP_NAMES = {travel:'Trip', tech:'New phone', safety:'Safety net', custom:'My goal'};
const spPreset = key => key === 'tech' ? {ic:'phone', name:'New phone', target:120000} : key === 'custom' ? {...customGoal(), name:'My goal'} : (GOAL_PRESETS[key] || GOAL_PRESETS.travel);
const spAutoAmt = () => { const j = acc('junior').v; return j >= SP_FLOOR + 1000 ? 1000 : j >= SP_FLOOR + 500 ? 500 : 0; };
const spFits = v => acc('junior').v - v >= SP_FLOOR;
const spAmt = () => { const v = O.amt || 0; if(!v || spFits(v)) return v; return O.first ? spAutoAmt() : 0; };
const spOffline = () => SP.forceOffline || navigator.onLine === false;
const spReduced = () => SP.forceRM !== null ? SP.forceRM : pkReduced();
const spEnd = () => S.bridge ? juniorEndLabel(12) : juniorEndLabel();
// the honesty line (plan 2e): rate and end date, withdraw any time, protected, and Learn more (opens the Good to know conditions)
const spHonesty = cls => `<p class="fine sphon ${cls || ''}"><!-- CONFIRM WITH OTP --><span>${S.verified || S.bridge ? `${rateLabel()} until ${spEnd()}` : 'Standard rate 0.01%'}</span> · <span>Withdraw any time</span> · <span>Protected</span><button class="sphi" data-sheet="spgtk"><span aria-hidden="true">ⓘ</span><span class="vhid">Learn more: Good to know</span></button></p>`;
SHEETS.spgtk = () => `<h2>Good to know</h2>${gtkHTML()}<button class="btn ghost" data-closesheet>Close</button>`;

/* ---------- Home (new user): one Persely card above the fold, the analyst notice as one line ---------- */
const spHomeCard = () => `<button class="card hubteaser sphome" data-tab="hub">${pig('happy', 52)}<span><b>Save your first ${ft(1000)}</b></span>${I('chev', 20)}</button>`;
// CONFIRM WITH OTP / LEGAL: lawful basis for default-on processing of transaction data; wording is not final.
function spAnLine(){
  if(S.anNote || !S.analyst.on) return '';
  return `<div class="annote one" role="region" aria-label="Financial analyst"><!-- CONFIRM WITH OTP / LEGAL: lawful basis --><span>Your analyst reads your OTP payments to show Safe to spend. Nothing leaves OTP.</span> <span class="anl"><button class="link lnk44" data-anread>Learn more</button><span aria-hidden="true">·</span><button class="link lnk44" data-anask>Turn off</button></span></div>`;
}

/* ---------- Persely tab, no goal yet ---------- */
const spTiles = () => `<div class="wn-grid sptiles">${SP_TILES.map(([k, l, ic]) => `<button data-tilepick="${k}">${I(ic, 28)}${l}</button>`).join('')}</div>`;
function spHubFirst(){
  return `<div class="tabtitle tt-gear">Persely<button class="tgear" data-settings="persely" aria-label="Persely settings">${I('gear', 24)}</button></div>
  <div class="spfirst">
    <div class="persi sppersi">${pig('happy', 72)}<div class="persi-t"><b>Persi</b><span>Hi! Let's save your first ${ft(1000)}.</span></div></div>
    <h2 class="sph2">What are you saving for?</h2>
    ${spTiles()}
    <button class="link lnk44 spmore" data-spmore>More goals ${I('chev', 16)}</button>
  </div>`;
}
// New goal (second and later goals): the same 4 tiles; More goals opens the existing tile set (Own home, Driving licence, Studies, Shared, Euro)
const spOldNewgoal = SHEETS.newgoal;
SHEETS.newgoal = () => spOn() ? `<h2>What are you saving for?</h2><div class="u-sheet-sub2">Up to 5 Perselys.</div>${spTiles()}<button class="link lnk44 spmore" data-spmore>More goals ${I('chev', 16)}</button>` : spOldNewgoal();

/* ---------- the one confirm screen (in the #onb layer; O is the shared goal draft, so the existing amount and month pickers work on it) ---------- */
function spOpen(key){
  if(S.goals.length >= 5){ toast('You can have up to 5 Perselys'); return; }
  if(sheetOpen()) closeSheet();
  const g = spPreset(key), first = !S.goals.length, dr = rulesFromDefaults(ruleDefaults());
  Object.keys(O).forEach(k => delete O[k]);
  Object.assign(O, {i:0, sp:true, key, ic:g.ic, name:SP_NAMES[key] || g.name, target:g.target, typeAmt:0, date:presetDate(g.target), first,
    payOn:dr.pay.on && payPctWith(null, dr.pay.pct) <= PAY_CAP, pct:dr.pay.pct, weeklyOn:dr.wk.on, weekly:dr.wk.amt, day:dr.wk.day, roundOn:dr.rr.on,
    amt:first ? spAutoAmt() : 0, edit:'', err:''});
  tab('hub'); $('#onb').classList.add('on'); spRender();
}
const spChg = (k, lab) => `<button class="link lnk44 spchg" data-spchg="${k}" aria-label="${lab}" aria-expanded="${O.edit === k}">Change</button>`;
function spRender(){
  const o = $('#onb'); if(!o.classList.contains('on') || !O.sp) return;
  const v = spAmt(), off = spOffline(), why = onbGate(), first = O.first;
  const btn = off ? 'No connection. Try again.' : v ? `Save ${ft(v)} now` : 'Create goal';
  const chips = (first ? [] : [0]).concat([500, 1000, 2000, 5000]);
  const chipRow = `<div class="chips spchips" role="group" aria-label="First deposit">${chips.map(x => `<button class="chip ${v === x ? 'on' : ''}" data-spamt="${x}" aria-pressed="${v === x}" ${x && !spFits(x) ? 'disabled' : ''}>${x ? ft(x) : 'No deposit'}</button>`).join('')}</div>`;
  const amt = first ? (v ? `<div class="card spamt"><div class="sprow"><b class="spbig num">${ft(v)} now</b>${spChg('amt', 'Change amount')}</div><div class="k">From your Junior account</div>${O.edit === 'amt' ? chipRow : ''}</div>` : '')
    : `<div class="card spamt"><b class="spbig num">${v ? `${ft(v)} now` : 'No deposit'}</b><div class="k">From your Junior account</div>${chipRow}</div>`;
  const persi = first && !v && O.payOn ? `<div class="persi sppersi">${pig('happy', 48)}<div class="persi-t"><span>Persi will ask on payday.</span></div></div>` : '';
  const also = [O.weeklyOn && `${ft(O.weekly)} every ${dayName(O.day)}`, O.roundOn && 'round-ups'].filter(Boolean);
  o.innerHTML = `<div class="onb-top"><button class="onb-back" data-spback aria-label="Back to goal types">${I('back', 22)}</button></div>
    <div class="onb-body spconfirm">
      <div class="sphead"><span class="spic" aria-hidden="true">${I(O.ic || 'star', 30)}</span><div class="sprows">
        <div class="sprow"><h2 class="spname">${esc(cleanName(O.name) || 'Your goal')}</h2>${spChg('name', 'Change name')}</div>
        <div class="sprow"><span class="k spgoalv num">${ft(O.target)} · ${pkMonthName(O.date)}</span>${spChg('goal', 'Change target and date')}</div></div></div>
      ${O.edit === 'name' ? `<div class="fld"><span class="t"><input id="spName" maxlength="30" value="${esc(O.name)}" placeholder="e.g. New laptop" autocomplete="off" enterkeyhint="done" aria-label="Goal name"></span></div>` : ''}
      ${O.edit === 'goal' ? amountPicker('onb') + monthPicker('onb') : ''}
      ${persi}${amt}
      <div class="opt slim spsw ${O.payOn ? 'on' : ''}"><span class="t"><b>On payday, Persi ${S.payday && S.payday.ask === false ? 'saves' : 'asks to save'} ${O.pct}%</b></span>${swBtn(O.payOn, 'data-sppay', 'Payday rule, ' + O.pct + '% of each salary')}</div>
      ${also.length ? `<div class="fine">Also: ${also.join(', ')}</div>` : ''}
      ${spHonesty()}
    </div>
    <div class="onb-foot">${O.err ? '<div class="sperr" role="alert">That did not work. Your money did not move. Try again.</div>' : ''}<div class="onb-why fine" role="status">${why}</div><button class="btn" data-spsave ${off || why ? 'disabled' : ''}>${btn}</button></div>`;
  const nm = $('#spName'); if(nm){ nm.addEventListener('input', e => { O.name = e.target.value; spGate(); }); nm.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); nm.blur(); } }); }
  mountPig();
}
// called by gateSync() and pkSync() (js/11): keep the summary rows and the button in step with the pickers and the name field
function spSyncRows(){
  if(!O.sp || !$('#onb').classList.contains('on')) return;
  const gv = $('#onb .spgoalv'); if(gv) gv.textContent = `${ft(O.target)} · ${pkMonthName(O.date)}`;
  const nm = $('#onb .spname'); if(nm) nm.textContent = cleanName(O.name) || 'Your goal';
}
function spGate(){
  if(!O.sp || !$('#onb').classList.contains('on')) return;
  const r = onbGate(), b = $('#onb [data-spsave]'), w = $('#onb .onb-why'); if(b) b.disabled = !!r || spOffline(); if(w) w.textContent = r; spSyncRows();
}
// the one tap: create the goal and move the deposit, as ONE undo entry
function spSave(){
  if(!O.sp) return;
  if(spOffline()){ spRender(); return; }
  if(onbGate()){ spGate(); return; }
  if(S.goals.length >= 5){ toast('You can have up to 5 Perselys'); return; }
  const t0 = performance.now(), before = snap(), v = spAmt(), first = O.first; let r, counted = false;
  try{
    if(SP.forceFail) throw new Error('demo failure');
    O.name = cleanName(O.name) || 'My goal';
    r = applyOnb();   // the goal with its own rules (Payday rule from the switch); it moves no money by itself
    if(v > 0){ if(!spFits(v)) throw new Error('funds'); counted = depositTo(r.g, v, 'junior', 'First deposit'); }
    if(first) HINTS.forEach(h => { S.hints[h[0]] = 1; });   // the first run has no hint strips: Persi's one line replaces them
    if(first && v > 0 && !S.remind) S.nudgeAsk = 'wait';     // Sunday nudge: asked by Persi on the next visit, never on day 0
    S._goal = r.g.id;
  }catch(e){ S = JSON.parse(before); O.err = 'fail'; spRender(); return; }   // nothing moved
  O.sp = false; closeOnb(); while(stack.length) popPage(true);
  if(cur !== 'hub') tab('hub'); renderAll();
  undoable(before, v ? `${r.g.name}: ${ft(v)} saved${counted ? `. Week ${S.streak}` : ''}` : `${r.g.name} created. No money has moved`);
  const undo = UCH.fn; UCH.fn = () => { spHideReward(true); if(undo) undo(); };
  if(v > 0 && first && !SP.celebrated) spReward(v, t0);
  else if(v > 0 && pig3d && !spReduced()) setTimeout(() => pig3d.celebrate(), 250);
  if(r.notes.length) toast(r.notes.join('. ') + '.');
}

/* ---------- the reward: same tap, on the Persely tab, at most once per app open ---------- */
function spPlayCoin(){   // the in-app Sound switch and the demo sound; on iPhone the 'ambient' audio session follows the silent switch
  if(S.sound === false || !demo.sound) return false;
  try{ if(navigator.audioSession) navigator.audioSession.type = 'ambient'; }catch(e){}
  if(!SP.dry) coinSound(); return true;
}
function spHaptic(){ try{ if(navigator.vibrate){ if(!SP.dry) navigator.vibrate(12); return true; } }catch(e){} return false; }
function spPlaceReward(){
  const el = $('#sprw'); if(!el || !el.classList.contains('on')) return;
  const ph = $('#phone'), pr = ph.getBoundingClientRect(), sc = pr.width / ph.offsetWidth || 1, tb = $('#tabbar').getBoundingClientRect(), lift = UCH.on ? $('#uchip').offsetHeight + 8 : 0;
  el.style.setProperty('--sprw-b', Math.round((pr.bottom - tb.top) / sc + 12 + lift) + 'px');
}
function spReward(v, t0){
  SP.celebrated = true;
  let el = $('#sprw'); if(!el){ el = document.createElement('div'); el.id = 'sprw'; el.className = 'sprw'; $('#phone').appendChild(el); }
  const rm = spReduced();
  el.innerHTML = `<div class="sprw-card" role="status" aria-live="polite">${pig('proud', 112)}<div class="sprw-fl">${flame(26, true)}<b>Week ${S.streak} done</b></div><b class="sprw-big num">${ft(v)} saved!</b><button class="btn" data-spgreat>Great</button></div>`;
  el.classList.toggle('fade', rm); el.classList.toggle('pop', !rm); el.classList.add('on'); SP.rewardOn = true;
  spPlaceReward(); mountPig();
  let coin = false; if(!rm && pig3d){ pig3d.celebrate(); coin = true; }   // reduced motion: a fade, no jump and no falling coin
  const sound = spPlayCoin(), haptic = spHaptic();
  SP.last = {ms:Math.round(performance.now() - t0), coin, sound, haptic, fade:rm, sheet:sheetOpen(), pages:stack.length, cur};
  const b = el.querySelector('[data-spgreat]'); if(b) try{ b.focus({preventScroll:true}); }catch(e){}
}
function spHideReward(quiet){
  const el = $('#sprw'); if(!el || !SP.rewardOn) return;
  el.classList.remove('on', 'pop', 'fade'); el.innerHTML = ''; SP.rewardOn = false; mountPig(); if(!quiet) mqPump();
}

/* ---------- Sunday nudge on the next visit (plan 2a, P32): equal Yes / Not now, the system permission only after Yes ---------- */
const spNudgeHTML = () => !spOn() || S.nudgeAsk !== 'ask' || !S.goals.length ? '' : `<div class="persi-t spnudge"><b>Persi</b><span>Want a nudge on Sunday?</span><span class="spyn"><button class="btn sm eq" data-spnudge="1">Yes</button><button class="btn sm eq" data-spnudge="0">Not now</button></span></div>`;
// tab() calls this first (js/08): a new visit to the Persely tab turns "wait" into "ask"; any tab change ends the reward
function spOnTab(id){ if(SP.rewardOn) spHideReward(true); if(spOn() && id === 'hub' && cur !== 'hub' && S.nudgeAsk === 'wait') S.nudgeAsk = 'ask'; }
if(S.nudgeAsk === 'wait') S.nudgeAsk = 'ask';   // a new app open is a new visit

/* ---------- honesty footer on the Add money sheet and the goal page ---------- */
const spHubsave = SHEETS.hubsave;
SHEETS.hubsave = () => { const h = spHubsave(); return spOn() && !S._bw && !/class="rsline"/.test(h) ? h + spHonesty('spfoot') : h; };   // Phase 3b's Rate and safety line, when there, is the one honesty line
const spGoalHtml = PAGES.goal.html;
PAGES.goal.html = () => { const h = spGoalHtml(); if(!spOn() || !h || /class="rsline"/.test(h)) return h;
  const old = /<p class="fine" style="text-align:center;margin:var\(--sp-4\) 0 var\(--sp-1\)">Withdraw any time, free of charge\.<\/p>\s*$/;
  return old.test(h) ? h.replace(old, spHonesty('spgoalf')) : /class="fine sphon/.test(h) ? h : h + spHonesty('spgoalf'); };

/* ---------- events (capture phase, before the main handler in js/09) ---------- */
document.addEventListener('click', e => {
  const t = e.target.closest && e.target.closest('button,a'); if(!t) return;
  const d = t.dataset, stop = () => { e.stopImmediatePropagation(); e.preventDefault(); };
  if(d.sw === 'sound'){ stop(); S.sound = S.sound === false; renderAll(); return; }
  if(!spOn()) return;
  if(d.tilepick){ stop(); spOpen(d.tilepick); return; }
  if('spmore' in d){ stop(); sheet(spOldNewgoal()); return; }
  if('spback' in d){ stop(); O.sp = false; closeOnb(); if(S.goals.length) sheet(SHEETS.newgoal()); else tab('hub'); return; }
  if(d.spchg){ stop(); const nm = $('#spName'); if(nm) O.name = nm.value; O.edit = O.edit === d.spchg ? '' : d.spchg; spRender(); const f = $('#spName'); if(f) f.focus({preventScroll:true}); return; }
  if('sppay' in d){ stop(); if(!O.payOn && payPctWith(null, O.pct) > PAY_CAP){ toast(capText(payPctWith(null, O.pct))); return; } O.payOn = !O.payOn; spRender(); return; }
  if(d.spamt !== undefined){ stop(); O.amt = +d.spamt; O.err = ''; spRender(); return; }
  if('spsave' in d){ stop(); spSave(); return; }
  if('spgreat' in d){ stop(); spHideReward(); return; }
  if(d.spnudge !== undefined){ stop(); S.nudgeAsk = 'done';
    if(d.spnudge === '1'){ S.remind = true; renderAll(); enablePush(); }   // the phone permission is asked here, after Yes, and nowhere earlier
    else { S.remind = false; renderAll(); }
    return; }
}, true);
addEventListener('online', spRender); addEventListener('offline', spRender);
addEventListener('resize', spPlaceReward);
window.__simple = SP;   // demo and checks: __simple.forceOffline / forceFail / forceRM
