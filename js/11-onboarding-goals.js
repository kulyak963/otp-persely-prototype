/* ================= update pop-up + onboarding =================
   Pop-up: one question ("What are you saving for?"). Then: goal with a date → how money gets in
   (with a live projection) → summary with an optional first deposit and one Create goal button. No tour: Persi shows a hint per block instead. */
const cleanName = s => String(s || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 30);   // custom names are typed by the user: no markup, one line, 30 characters
const customGoal = () => ({ic:'star', name:'', target:100000, date:presetDate(100000)});   // "Something else": own name, 100 000 Ft, a date the default rules reach
const GOAL_PRESETS = {
  home:{label:'Own home', ic:'home', name:'First home fund', target:500000, date:'2029-06-01'},
  travel:{label:'Travel', ic:'plane', name:'Erasmus in Lisbon', target:150000, date:'2027-09-01'},
  car:{label:'Driving licence', ic:'car', name:'Driving licence', target:350000, date:'2028-06-01'},
  safety:{label:'Safety net', ic:'lock', name:'Safety net', target:200000, date:'2027-12-01'},
  study:{label:'Studies', ic:'edu', name:'Study fund', target:120000, date:'2027-09-01'}
};
/* ================= goal step: amount and date (shared by onboarding step 1 and New Persely step 1) =================
   k = 'onb' (the O object) or 'cg' (the S._draft object). Both have .target and .date ('YYYY-MM-01').
   Amount: type it, tap a chip, or drag the slider. The slider is not linear: 5 000 to 300 000 Ft take the first 70% of the track in
   5 000 steps, 300 000 to 1 000 000 Ft the last 30% in 25 000 steps. Above 1 000 000 Ft only typing works. */
const PK_MIN = 5000, PK_MID = 300000, PK_MAX = 1000000, PK_N1 = 59, PK_N2 = 28, PK_SPLIT = .7, PK_N = PK_N1 + PK_N2;   // PK_N = last notch index (86)
const pkObj = k => k === 'onb' ? O : S._draft;
const pkIdx = v => v <= PK_MID ? (Math.max(v, PK_MIN) - PK_MIN) / 5000 : PK_N1 + (Math.min(v, PK_MAX) - PK_MID) / 25000;   // notch number, can be fractional for typed values
const pkAt = n => n <= PK_N1 ? PK_MIN + n * 5000 : PK_MID + (n - PK_N1) * 25000;
const pkPos = v => { const n = pkIdx(v); return n <= PK_N1 ? n / PK_N1 * PK_SPLIT : PK_SPLIT + (n - PK_N1) / PK_N2 * (1 - PK_SPLIT); };
const pkVal = p => { p = Math.min(1, Math.max(0, p)); return pkAt(p <= PK_SPLIT ? Math.round(p / PK_SPLIT * PK_N1) : PK_N1 + Math.round((p - PK_SPLIT) / (1 - PK_SPLIT) * PK_N2)); };
const pkLayers = v => v > 0 ? Math.min(12, Math.max(1, Math.ceil(pkPos(v) * 12))) : 0;   // follows the slider position, so it grows evenly
const pkSpace = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const pkShort = v => ft(v);   // chips read "50 000 Ft", never "50k" or "1 M"
const pkReduced = () => window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
const pkNow = () => { const d = new Date(); return d.getFullYear() * 12 + d.getMonth(); };
const PK_YEARS = 50, pkLast = () => pkNow() + PK_YEARS * 12;   // furthest goal date: 50 years from this month (keeps dates representable and the maths sane)
const pkDateIdx = s => +s.slice(0, 4) * 12 + (+s.slice(5, 7) - 1);
const pkIdxDate = i => `${Math.floor(i / 12)}-${String(i % 12 + 1).padStart(2, '0')}-01`;
const pkMonthName = s => new Date(s + 'T12:00:00').toLocaleDateString('en-GB', {month:'long', year:'numeric'});
const pkMonthShort = s => new Date(s + 'T12:00:00').toLocaleDateString('en-GB', {month:'long', year:'numeric'});
const pkIn = n => n <= 0 ? 'this month' : n === 1 ? 'next month' : n < 24 ? `in ${n} months` : `in ${Math.floor(n / 12)} years${n % 12 ? ` ${n % 12} month${n % 12 > 1 ? 's' : ''}` : ''}`;
const pkInS = n => n >= 60 && n % 12 ? `in about ${Math.round(n / 12)} years` : pkIn(n);   // short form for the date row: long spans do not wrap on a 360 px screen
// what the amount and date ask of a week: the same maths as the forecast on the next step
function pkMath(target, date, saved = 0){
  const m = Math.max(.5, monthsTo(date)), wk = weeklyNeed(target, saved, date), cap = incomeShare(10) * 12 / 52 + 5000;   // payday rule + 5 000 Ft a week
  return {m, wk, hard: wk > cap};
}
function pkRealHTML(o){
  if(!o.target) return 'Type how much you need.';
  const r = pkMath(o.target, o.date, o.saved || 0);
  return `${ft(o.target)} by ${pkMonthShort(o.date)} ≈ <b class="${r.hard ? 'late' : ''}">${ft(r.wk)} a week</b>${r.hard ? `<div class="fine">That is a lot for a week. A later date or a smaller amount makes it easier.</div>` : ''}`;
}
const pkStackHTML = v => `<span class="pkstack ${v >= 500000 ? 'strap' : ''}" style="--L:${pkLayers(v)}" aria-hidden="true">${Array.from({length: pkLayers(v)}, (_, i) => `<i class="${i < 2 ? 'c' : 'n'}" style="--k:${i}"></i>`).join('')}<s></s></span>`;
function pkStackSync(st, v){
  const L = pkLayers(v), red = pkReduced(), cur = [...st.querySelectorAll('i:not(.off)')];
  for(let i = cur.length; i < L; i++){ const e = document.createElement('i'); e.className = (i < 2 ? 'c' : 'n') + (red ? '' : ' drop'); e.style.setProperty('--k', i); st.insertBefore(e, st.querySelector('s')); }
  for(let i = cur.length - 1; i >= L; i--){ const e = cur[i]; if(red) e.remove(); else { e.classList.remove('drop'); e.classList.add('off'); setTimeout(() => e.remove(), 160); } }
  st.style.setProperty('--L', L); st.classList.toggle('strap', v >= 500000);
}
// the line above the chips: the Minimum, or what 3.0% covers when the goal is bigger than the cap (A3)
const pkCapHTML = v => v > 0 && v < PK_MIN ? `<b class="late">Minimum is ${ft(PK_MIN)}</b>` : v > CAP ? `3.0% applies to the first ${ft(CAP)}` : '';
function amountPicker(k){
  const o = pkObj(k), v = o.target, chips = [...new Set([o.typeAmt, 50000, 150000, 300000, 500000].filter(Boolean))].sort((a, b) => a - b).slice(0, 5);
  return `<div class="card pk" data-pk="${k}">
    <div class="pkrow"><div class="pkfld"><input class="pkamt" inputmode="numeric" pattern="[0-9 ]*" enterkeyhint="done" autocomplete="off" maxlength="11" value="${v ? pkSpace(v) : ''}" aria-label="Amount you need, in forints. Type it, or use the slider"><span>Ft</span></div>${pkStackHTML(v)}</div>
    <div class="pksl" role="slider" tabindex="0" aria-label="Amount you need" aria-valuemin="${PK_MIN}" aria-valuemax="${PK_MAX}" aria-valuenow="${Math.min(PK_MAX, Math.max(PK_MIN, v))}" aria-valuetext="${pkSpace(v)} forints" style="--p:${(pkPos(v) * 100).toFixed(2)}%"><div class="pkin"><i class="pkfill"></i><b class="pkthumb"></b></div></div>
    <div class="fine pkcap" data-pk="${k}" role="status">${pkCapHTML(v)}</div>
    <div class="chips pkchips">${chips.map(c => `<button class="chip ${v === c ? 'on' : ''}" data-pkamt="${c}" aria-pressed="${v === c}" aria-label="${pkSpace(c)} forints${c === o.typeAmt ? ', suggested for this goal' : ''}">${pkShort(c)}</button>`).join('')}</div></div>`;
}
function monthPicker(k){
  const o = pkObj(k), n = pkDateIdx(o.date) - pkNow(), now = pkNow(), y = Math.floor(now / 12), mo = now % 12;
  const quick = [['In 6 months', pkIdxDate(now + 6)], ['Next summer (June)', pkIdxDate((mo < 5 ? y : y + 1) * 12 + 5)], ['In a year', pkIdxDate(now + 12)]];
  return `<div class="pkd" data-pk="${k}">
    <button class="fld" data-pkmonth aria-haspopup="dialog" aria-label="By when? ${pkMonthName(o.date)}, ${pkIn(n)}. Change month"><span class="t"><span class="pkl">By when?</span><b>${pkMonthName(o.date)}</b> <span class="pks">· ${pkInS(n)}</span></span><span class="chev">${I('chev', 20)}</span></button>
    <div class="chips pkchips pkdc">${quick.map(([l, v]) => `<button class="chip ${o.date === v ? 'on' : ''}" data-pkdate="${v}" aria-pressed="${o.date === v}">${l}</button>`).join('')}</div></div>
    <div class="note pkreal ${o.target && pkMath(o.target, o.date, o.saved || 0).hard ? 'hard' : ''}" data-pk="${k}" role="status">${pkRealHTML(o)}</div>`;
}
// update everything that shows the amount or the date, without redrawing (so the keypad stays open and a drag is not interrupted)
function pkSync(k, from){
  const o = pkObj(k), v = o.target;
  document.querySelectorAll(`[data-pk="${k}"]`).forEach(r => {
    if(r.classList.contains('pk')){
      const inp = r.querySelector('.pkamt'); if(from !== 'type') inp.value = v ? pkSpace(v) : '';
      const sl = r.querySelector('.pksl'); sl.style.setProperty('--p', (pkPos(v) * 100).toFixed(2) + '%');
      sl.setAttribute('aria-valuenow', Math.min(PK_MAX, Math.max(PK_MIN, v))); sl.setAttribute('aria-valuetext', `${pkSpace(v)} forints`);
      pkStackSync(r.querySelector('.pkstack'), v);
      r.querySelectorAll('[data-pkamt]').forEach(b => { const on = +b.dataset.pkamt === v; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    } else if(r.classList.contains('pkcap')){
      r.innerHTML = pkCapHTML(v);
    } else if(r.classList.contains('pkd')){
      const n = pkDateIdx(o.date) - pkNow(), f = r.querySelector('.fld');
      f.querySelector('b').textContent = pkMonthName(o.date); f.querySelector('.pks').textContent = `· ${pkInS(n)}`;
      f.setAttribute('aria-label', `By when? ${pkMonthName(o.date)}, ${pkIn(n)}. Change month`);
      r.querySelectorAll('[data-pkdate]').forEach(b => { const on = b.dataset.pkdate === o.date; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
    } else if(r.classList.contains('pkreal')){
      r.innerHTML = pkRealHTML(o); r.classList.toggle('hard', !!(v && pkMath(v, o.date, o.saved || 0).hard));
    }
  });
}
function pkSet(k, v, from){ pkObj(k).target = v; pkSync(k, from); if(typeof gateSync === 'function') gateSync(); }
// month sheet: tentative choice until Done; tapping outside or swiping down closes without changing
let PKM = {k:'onb', year:0, sel:''};
// years: a stepper (‹ 2031 ›) plus a scrolling row of quick years (the next 8, then every 5th year), up to PK_YEARS from now
function pkMonthSheet(){
  const o = pkObj(PKM.k), now = pkNow(), last = pkLast(), y0 = Math.floor(now / 12), y1 = Math.floor(last / 12), r = pkMath(o.target, PKM.sel, o.saved || 0), n = pkDateIdx(PKM.sel) - now;
  const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], full = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const years = [...new Set([...Array.from({length: 8}, (_, i) => y0 + i), ...Array.from({length: y1 - y0 + 1}, (_, i) => y0 + i).filter(y => y % 5 === 0 && y > y0 + 7)])].filter(y => y <= y1);
  return `<div class="pkm"><h2>By when?</h2>
    <div class="pkyr" role="group" aria-label="Year">
      <button class="pkstep l" data-pkystep="-1" ${PKM.year <= y0 ? 'disabled' : ''} aria-label="Previous year, ${PKM.year - 1}">${I('chev', 22)}</button>
      <b class="pkyv" role="status" aria-label="Year ${PKM.year}">${PKM.year}</b>
      <button class="pkstep" data-pkystep="1" ${PKM.year >= y1 ? 'disabled' : ''} aria-label="Next year, ${PKM.year + 1}">${I('chev', 22)}</button></div>
    <div class="pkyq" role="group" aria-label="Quick years, scroll sideways for later ones">${years.map(y => `<button class="chip ${PKM.year === y ? 'on' : ''}" data-pkyear="${y}" aria-pressed="${PKM.year === y}">${y}</button>`).join('')}</div>
    <div class="pkgrid" role="group" aria-label="Month in ${PKM.year}">${names.map((nm, m) => { const idx = PKM.year * 12 + m, ok = idx > now && idx <= last, on = idx === pkDateIdx(PKM.sel);
      return `<button class="chip pkmo ${on ? 'on' : ''} ${idx === now ? 'cur' : ''}" data-pkmo="${idx}" ${ok ? '' : 'disabled'} aria-pressed="${on}" aria-label="${full[m]} ${PKM.year}${idx === now ? ', this month, not available' : !ok ? ', not available' : ''}">${nm}</button>`; }).join('')}</div>
    <div class="note pkreal ${r.hard ? 'hard' : ''}" role="status">${pkIn(n).replace(/^in /, '')} · about <b class="${r.hard ? 'late' : ''}">${ft(r.wk)} a week</b>${r.hard ? `<div class="fine">That is a lot for a week. A later date makes it easier.</div>` : ''}</div>
    <button class="btn" data-pkdone>Done</button></div>`;
}
// redraw the open sheet but keep the quick-years scroll position, then put focus back on a control
function pkSheetRender(focus){
  const old = $('#sheet .pkyq'), sl = old ? old.scrollLeft : 0;
  $('#sheet').innerHTML = sheetShell(SHEETS.month()); pkYearsView(sl);
  const b = [].concat(focus || []).map(f => $('#sheet').querySelector(f)).find(Boolean); if(b) b.focus({preventScroll:true});
}
function pkYearsView(sl){
  const q = $('#sheet .pkyq'); if(!q) return;
  if(sl != null) q.scrollLeft = sl;
  const on = q.querySelector('.on'); if(on) q.scrollTo({left: on.offsetLeft - (q.clientWidth - on.offsetWidth) / 2, behavior: sl == null || pkReduced() ? 'auto' : 'smooth'});
}
function coinSound(){   // a short coin clink, once, when the slider is let go
  if(!demo.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime;
    [[1568,0],[2349,.06]].forEach(([f, d]) => {
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'triangle'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t + d); g.gain.linearRampToValueAtTime(.14, t + d + .008); g.gain.exponentialRampToValueAtTime(.001, t + d + .22);
      o.connect(g).connect(audioCtx.destination); o.start(t + d); o.stop(t + d + .25);
    });
  }catch(e){}
}
const O = { i:0 };
const STEPS = ['goal','how','sum'];   // 3 screens: goal, money in, summary with the optional first deposit
const onbMonthly = () => (O.payOn ? incomeShare(O.pct) : 0) + (O.weeklyOn ? Math.round(O.weekly * 52 / 12) : 0) + (O.roundOn ? ROUND_EST : 0);
// 8 weeks later: Junior customer, payday rule on, habit formed (the state used for the main demo)
function week8State(){
  const f = fresh('existing'), hadHoliday = S.goals.some(g => g.id === 'holiday');
  Object.assign(S, {seed:'existing', streak:8, best:8, savedWeek:false, skips:1, updateSeen:true, onboarded:true, verified:true,
    history: Array.from({length:8}, (_,i) => S.week - 8 + i), skipped:[], friends:f.friends, friendsOptIn:false, friendsOpen:false, toured:true, hints:Object.fromEntries(HINTS.map(h => [h[0], 1])), monthSaved:23500,
    payday:{ask:true, floor:true}, insight:true, insightUsed:false});
  if(!goalById(S.ruleGoal)) S.ruleGoal = 'holiday';
  f.goals.forEach(g => { if(!S.goals.some(x => x.id === g.id || x.name === g.name) && S.goals.length < 5) S.goals.push(g); });
  if(!goalIsPlain(goalById(S.ruleGoal))) S.ruleGoal = (plainGoals()[0] || {id:'holiday'}).id;
  // the main demo state: the main goal has the Payday rule at 10% and Round-ups; the other goals' payday rule and round-ups are off (their weekly transfers stay)
  plainGoals().forEach(g => { const r = ownRules(g), main = g.id === S.ruleGoal; r.pay = {on:main, pct:main ? 10 : r.pay.pct}; r.rr = {on:main}; });
  healGoalAccounts();
  if(!hadHoliday && S.goals.some(g => g.id === 'holiday')){ const pa = f.accounts.find(x => x.id === 'persely'), cu = acc('persely'); if(pa && cu) Object.assign(cu, pa); }   // coming from the new-user seed: Summer holiday brings its Persely balance
  closeWhatsNew(); closeOnb(); renderAll(); toast('Demo: 8 weeks later');
}
function showWhatsNew(){
  const w = $('#wn');
  w.innerHTML = `<div class="wn-card">${pig('happy',112)}<span class="newpill">New in Persely</span>
    <h2>What are you saving for?</h2>
    <ul class="bul left"><li>3.0% a year on the first 500 000 Ft until ${juniorEndLabel()}</li><li>See the month you reach your goal</li><li>Save a little from every salary</li></ul>
    <div class="wn-grid three">${Object.entries(GOAL_PRESETS).map(([k,g])=>`<button class="${g.hot?'hot':''}" data-wnpick="${k}">${g.hot ? '<span class="hotb">Trending</span>' : ''}${I(g.ic,24)}${g.label}</button>`).join('')}<button data-wnpick="custom">${I('plus',24)}Something else</button></div>
    <button class="later" data-wnlater>Not now</button></div>`;
  w.onclick = e => { if(e.target === w){ S.updateSeen = true; save(); closeWhatsNew(); toast('You can set it up any time in the Persely tab'); } };   // tap outside the card = Not now
  w.classList.add('on'); mountPig();
}
function closeWhatsNew(){ const w = $('#wn'); w.classList.remove('on'); w.innerHTML = ''; mountPig(); }
// The automatic what's-new pop-up is retired (flow A2): nothing opens at launch, Home shows after the splash. The tile chooser is the setup card on the Persely tab.
// showWhatsNew() / closeWhatsNew() stay in the file but nothing calls showWhatsNew any more.
function launchFlow(){ /* no pop-up */ }
// preset dates are matched to the default rules (the Payday rule at 10%), so the forecast never opens with a shortfall (N6). One extra month: the goal date is the 1st, today is mid month.
const presetDate = target => { const d = demoNow(), i0 = d.getFullYear() * 12 + d.getMonth(), m = Math.max(3, Math.ceil(target / Math.max(1, incomeShare(10)))) + 1; return pkIdxDate(Math.min(i0 + m, pkLast())); };
// the ONE wizard (flow A3): every entry (tile chooser on the Persely tab, New +, the Home card) starts it here: Your goal, How should money get in?, Check and create
function startOnb(key, resume){
  const custom = key === 'custom', g = custom ? customGoal() : (GOAL_PRESETS[key] || GOAL_PRESETS.travel), first = !S.goals.length;
  const dr = rulesFromDefaults(ruleDefaults());   // pre-filled from Settings > Default saving rules for new goals. Out of the box that is the plan for the first goal: Payday rule only, at 10%
  if(resume && S.draft) Object.assign(O, {day:dr.wk.day}, S.draft, {i:0, first, focusName:false});
  else Object.assign(O, {i:0, key, ic:g.ic, name:g.name, target:g.target, typeAmt:custom ? 0 : g.target, date:presetDate(g.target), focusName:custom, first,
    payOn:dr.pay.on, pct:dr.pay.pct, weeklyOn:dr.wk.on, weekly:dr.wk.amt, day:dr.wk.day, roundOn:dr.rr.on});
  tab('hub'); $('#onb').classList.add('on'); renderOnb();
}
function closeOnb(){ const o = $('#onb'); o.classList.remove('on'); o.innerHTML = ''; mountPig(); }
// why the button waits (A3): shown as a line above it, never a silent grey button
const onbGate = () => O.i !== 0 ? '' : !cleanName(O.name) ? 'Give your goal a name' : !O.target ? 'Type how much you need' : O.target < PK_MIN ? `Minimum is ${ft(PK_MIN)}` : '';
const cgGate = () => { const d = S._draft; return !d ? '' : !cleanName(d.name) ? 'Give your goal a name' : !d.target ? 'Type how much you need' : d.target < PK_MIN ? `Minimum is ${ft(PK_MIN)}` : ''; };
function gateSync(){
  if($('#onb').classList.contains('on') && STEPS[O.i] === 'goal'){ const r = onbGate(), b = $('#onb [data-onbnext]'), w = $('#onb .onb-why'); if(b) b.disabled = !!r; if(w) w.textContent = r; }
  const sv = document.querySelector('.page [data-cgsave]'); if(sv && S._draft){ const r = cgGate(), w = sv.closest('.foot').querySelector('.onb-why'); sv.disabled = !!r; if(w) w.textContent = r; }
}
// allocation hints on step 2 (replaces "[Rule] now goes to X instead of Y"): rules are per goal now, so say how they add up with the other goals
const onbPayTotal = () => payPctWith(null, O.payOn ? O.pct : 0);
const onbCapGate = () => O.payOn && onbPayTotal() > PAY_CAP ? capText(onbPayTotal()) : '';
const allocLine = k => {
  if(k === 'pay'){ if(!O.payOn) return ''; const cap = onbCapGate(); if(cap) return `<div class="fine capmsg" role="alert">${cap}</div>`; return payOn() ? `<div class="fine rpt" role="status">All goals together: ${onbPayTotal()}% of your salary (the most is ${PAY_CAP}%)</div>` : ''; }
  if(k === 'wk'){ if(!O.weeklyOn || !wkGoals().length) return ''; return `<div class="fine rpt" role="status">Weekly transfers add up: ${ft(wkTotal() + O.weekly)} a week across your goals</div>`; }
  if(!O.roundOn || !rrGoals().length) return ''; const gs = rrGoals();
  return `<div class="fine rpt" role="status">Round-ups are shared equally with ${gs.map(g => esc(g.name)).join(' and ')}</div>`;
};
const onbHave = () => Math.round(onbMonthly() * 12 / 52 / 100) * 100;   // what the chosen rules add in a week, in the same 100 Ft steps as the weekly figure
function renderOnb(){
  const i = O.i, step = STEPS[i], n = STEPS.length;
  const bars = STEPS.map((_,k) => `<i class="${k<=i?'on':''}"></i>`).join('');
  const tg = (on, attr, title, sub, extra='') => `<button class="opt slim ${on?'on':''}" ${attr}><span class="t"><b>${title}</b><small>${sub}</small></span><span class="tg ${on?'on':''}"></span></button>${on && extra ? `<div class="subopts">${extra}</div>` : ''}`;
  const why = step === 'goal' ? onbGate() : step === 'how' && onbCapGate() ? 'Lower the payday rule to go on' : '';
  let body = '', foot = `<div class="onb-why fine" role="status">${why}</div><button class="btn" data-onbnext ${why ? 'disabled' : ''}>Next</button>`;
  if(step === 'goal'){
    body = `<div class="onb-step">Step 1 of ${n}</div><h2>Your goal</h2><p class="lead">It earns 3.0% a year on the first ${ft(CAP)} until ${juniorEndLabel()}. You can change it later.</p>
      <div class="flabel">Name</div>
      <div class="fld"><span class="t"><input id="onbName" maxlength="30" value="${esc(O.name)}" placeholder="e.g. New laptop" autocomplete="off" enterkeyhint="done" aria-label="Goal name"></span></div>
      <div class="flabel">Amount</div>
      ${amountPicker('onb')}
      ${monthPicker('onb')}`;
  } else if(step === 'how'){
    const m = monthsTo(O.date), proj = Math.round(onbMonthly() * m), p = Math.min(100, Math.round(proj / O.target * 100)), short = O.target - proj;
    const fc = fcCalc(O.target, 0, onbMonthly(), O.date), weeks = Math.max(1, m * 4.345), extra = short > 0 ? Math.ceil(short / weeks / 500) * 500 : 0;
    const wks = [...new Set([1000, 2000, 3000, 5000, O.weekly])].sort((a, b) => a - b);
    body = `<div class="onb-step">Step 2 of ${n}</div><h2>How should money get in?</h2><p class="lead">Switch on what suits you. Change it any time.</p>
      ${tg(O.payOn, 'data-onbpay', 'Payday rule <span class="rec">Recommended</span>', 'A share of each salary or scholarship. We ask first.',
        `<div class="chips eq u-m0">${[5,10,15,20].map(x=>`<button class="chip ${O.pct===x?'on':''}" data-onbpct="${x}">${x}%</button>`).join('')}</div><div class="fine u-mt4-b12">Keeps ${ft(20000)} on your account; if money is tight, less or nothing moves</div>`)}${allocLine('pay')}
      ${tg(O.weeklyOn, 'data-onbwk', 'Weekly transfer', `The same amount every ${dayName(O.day)}.`,
        `<div class="chips eq u-m0">${wks.map(x=>`<button class="chip ${O.weekly===x?'on':''}" data-onbweekly="${x}">${ft(x)}</button>`).join('')}</div>
         <div class="flabel">Day</div><div class="chips eq u-m0" role="group" aria-label="Day">${WK_DAYS.map(([k, n]) => `<button class="chip ${O.day===k?'on':''}" data-onbday="${k}" aria-label="${n}" aria-pressed="${O.day===k}">${n.slice(0, 3)}</button>`).join('')}</div>`)}${allocLine('wk')}
      <!-- the round-up amount is an example, not a promise about this user's spending -->
      ${tg(O.roundOn, 'data-onbrr', 'Round-ups', 'A 1 190 Ft coffee moves 20 Ft; we double it')}${allocLine('rr')}
      <div class="card" style="padding:var(--sp-4) var(--sp-4);margin-top:var(--sp-2)">
        <b class="u-bk-m14">${onbMonthly() ? (fc.over ? fc.text : `About ${ft(Math.round(proj/1000)*1000)} by ${fDate(O.date)}`) : 'Switch something on to see your forecast'}</b>
        ${onbMonthly() ? `<div class="prog" style="margin:var(--sp-3) 0 var(--sp-2)"><i style="width:${p}%"></i></div><div class="k">${fc.over ? 'On time' : `${p}% of ${ft(O.target)} · ${short > 0 ? `about ${ft(Math.round(short/1000)*1000)} short` : 'on time'}`}</div>` : ''}
        <div class="k u-mt4-b12">${ft(O.target)} by ${pkMonthShort(O.date)} needs about <b>${ft(weeklyNeed(O.target, 0, O.date))} a week</b>${onbMonthly() ? ` · your rules add about ${ft(onbHave())} a week` : ''}</div>
        ${short > 0 && onbMonthly() ? `<button class="btn w u-mt12" data-onbboost="${(O.weeklyOn ? O.weekly : 0) + extra}">Add ${ft(extra)} a week to make it</button>` : ''}
      </div>`;
  } else {
    const rules = [O.payOn && `${O.pct}% of each salary (asks first)`, O.weeklyOn && `${ft(O.weekly)} every ${dayName(O.day)}`, O.roundOn && 'round-ups'].filter(Boolean).join(', ') || 'You add money yourself';
    const rows = [['Goal', `${esc(O.name)}, ${ft(O.target)}`], ['By', fDate(O.date)], ['Rate', (S.verified || S.bridge) ? `3.0% on the first ${ft(CAP)}, until ${juniorEndLabel()}` : '0.01% standard rate'], ['Money in', rules]];
    body = `<div class="onb-step">Step 3 of ${n}</div><h2>Check and create</h2>
      <div class="card sumcard">${rows.map(([k,v])=>`<div class="sr"><span>${k}</span><b>${v}</b></div>`).join('')}</div>
      ${gtkCard()}
      <div class="fine u-mt4-b12">Creating the goal moves no money. You choose when to add the first amount.</div>`;
    foot = `<button class="btn" data-onbcreate>Create goal</button>`;
  }
  $('#onb').innerHTML = `<div class="onb-top"><button class="onb-back" data-onbback aria-label="${i > 0 ? 'Back' : 'Back to goal types'}">${I('back',22)}</button><div class="onb-bars" role="progressbar" aria-label="New goal, step ${i + 1} of ${n}" aria-valuemin="1" aria-valuemax="${n}" aria-valuenow="${i + 1}">${bars}</div><button class="onb-skip" data-onbquit>Not now</button></div>
    <div class="onb-body">${body}</div><div class="onb-foot">${foot}</div>`;
  if(step === 'goal'){
    const nm = $('#onbName');
    nm.addEventListener('input', e => { O.name = e.target.value; gateSync(); });
    nm.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); nm.blur(); } });
    if(O.focusName){ O.focusName = false; nm.focus({preventScroll:true}); }   // custom goal: the keypad opens on the empty name
  }
  mountPig();
}
// create the goal from what the user chose. It moves NO money. The goal gets its own rules (step 2); the other goals keep theirs
function applyOnb(){
  const first = !S.goals.length, name = cleanName(O.name) || 'My goal', id = 'g' + Date.now() + 'n' + S.goals.length, notes = [];
  const payOk = O.payOn && onbPayTotal() <= PAY_CAP;   // the step waits while over the cap; a draft that is over starts with the payday rule off
  const g = {id, name, ic:O.ic || (GOAL_PRESETS[O.key] || GOAL_PRESETS.travel).ic, saved:0, target:O.target, pace:0, date:O.date,
    rules:{pay:{on:payOk, pct:O.pct || 10}, wk:{on:!!O.weeklyOn, amt:O.weekly || 2000, day:O.day || 'mon'}, rr:{on:!!O.roundOn}}};
  S.goals.push(g);
  if(first || !goalById(S.ruleGoal)) S.ruleGoal = id;
  if(payOk && payGoals().length > 1) notes.push(`Payday rules now take ${payPct()}% of your salary across ${payGoals().length} goals`);
  if(O.payOn && !payOk) notes.push(`Payday rule is off: the most for all goals is ${PAY_CAP}% of your salary`);
  if(g.rules.rr.on && rrGoals().length > 1) notes.push(`Round-ups are shared equally between ${rrGoals().length} goals`);
  S.onboarded = true; S.updateSeen = true; S.draft = null; syncSplit(); save();
  return {g, notes, first};
}

/* ================= weekly challenges: concrete, tied to the user's own spending ================= */
const CH_DEFS = [
  {id:'nodelivery', t:'No food delivery this week', d:'You spent 28 140 Ft on delivery in November.', ic:'food', goal:7, unit:'days', on:'week', reward:'+1 skip week'},
  {id:'twice', t:'Save twice this week', d:'Two deposits of any size.', ic:'piggy', goal:2, unit:'deposits', on:'save', reward:'+0.1% interest this month'},
  {id:'round', t:'Round up card payments', d:'Round each card payment up to the next 100 Ft for 7 days.', ic:'limit', goal:7, unit:'days', on:'week', reward:'+0.1% interest this month'},
  {id:'buddy', t:'Save with a friend', d:'You and one friend both save this week.', ic:'user', goal:2, unit:'people', on:'save', reward:'+1 skip week each'}
];
const chState = id => (S.challenges[id] = S.challenges[id] || {joined:false, done:0});
function progressChallenges(kind){
  CH_DEFS.forEach(c => {
    const s = chState(c.id);
    if(!s.joined || s.done >= c.goal) return;
    if(kind === 'week'){ if(c.on === 'week') s.done = c.goal; else { s.done = 0; return; } }   // week ends: day-based ones complete, the rest reset
    else if(c.on === kind) s.done++;
    else return;
    if(s.done >= c.goal){ if(c.reward.includes('skip')) S.skips++; setTimeout(()=>toast(`Challenge done: ${c.t}. ${c.reward}`), 900); }
  });
}
function chCard(c, compact){
  const s = chState(c.id), p = Math.min(100, Math.round(s.done / c.goal * 100));
  return `<div class="card"><div class="u-rowc"><span class="gic">${I(c.ic,22)}</span><span class="u-fx0"><b style="display:block">${c.t}</b>${compact ? '' : `<span class="u-k-sm">${c.d}</span>`}</span></div>
    ${s.joined
      ? `<div class="prog" style="margin:var(--sp-3) 0 var(--sp-2)"><i style="width:${p}%"></i></div><div style="display:flex;justify-content:space-between;gap:var(--sp-2);font-size:0.78125rem;color:var(--ink2)"><span>${s.done >= c.goal ? 'Done' : `${s.done} of ${c.goal} ${c.unit}`}</span><span class="u-c-muted">Reward: ${c.reward}</span></div>`
      : `<div style="display:flex;align-items:center;justify-content:space-between;gap:var(--sp-2);margin-top:var(--sp-3)"><span class="u-k-sm">Reward: ${c.reward}</span><button class="btn sm" data-chjoin="${c.id}">Join</button></div>`}</div>`;
}

/* ================= friends: compare habits, never money ================= */
const SUGGEST = [{n:'Dóra',c:PALETTE.cCoral,s:2,g:22},{n:'Ádám',c:PALETTE.cMint,s:9,g:54},{n:'Zsófi',c:PALETTE.greenI,s:1,g:12},{n:'Gergő',c:PALETTE.cViolet,s:5,g:40}];
// Friends is opt-in: nothing about friends shows until the student taps this link (next to How Persely works)
const addFriendsLink = () => `<button class="link lnk44" data-frjoin data-tour="friends" aria-label="Add friends: compare weekly streaks, nobody sees your balance">Add friends ${I('plus', 16)}</button>`;
function friendsCard(){   // collapsed and opt-in: nothing is compared until the user opens it; ranked by streak only
  const open = !!S.friendsOpen;
  const head = `<button class="row frhead" data-frtoggle aria-expanded="${open}"><span class="ic">${I('user')}</span><span class="t"><b>Friends</b><small>${open ? 'Compared by weekly streak only. Nobody sees your balance' : 'Compare weekly streaks. Nobody sees your balance'}</small></span><span class="chev frchev ${open ? 'open' : ''}">${I('chev',20)}</span></button>`;
  if(!open) return `<div data-tour="friends">${head}</div>`;
  const rows = [...S.friends.map(f => ({...f})), {n:'You', c:PALETTE.orange, s:S.streak, g:0, me:true}].sort((a,b) => b.s - a.s);
  return `<div data-tour="friends">${head}
  <div class="card" style="padding:var(--sp-1) var(--sp-4) var(--sp-1);margin-top:-4px">
    ${S.friends.length
      ? rows.map((f,i)=>`<div class="fr ${f.me?'me':''}"><span class="rk">${i+1}</span><span class="fav" style="background:${avBg(f.c)}">${f.n[0]}</span><b>${f.n}</b><span class="fs num">${flame(16, f.s > 0)}${f.s}</span>${f.me ? '<span style="width:68px"></span>' : `<button class="nudge" data-nudge="${f.n}">Remind</button>`}</div>`).join('')
      : `<div style="text-align:center;padding:var(--sp-4) 0 var(--sp-2)"><b>Saving is easier with friends</b><div style="font-size:0.78125rem;color:var(--muted-t);margin:var(--sp-1) 0 var(--sp-3)">Compare weekly streaks. Nobody sees your balance.</div></div>`}
    <div class="frfoot"><button class="link lnk44" data-sheet="addfriend">Add friends ${I('plus',16)}</button></div></div></div>`;
}

