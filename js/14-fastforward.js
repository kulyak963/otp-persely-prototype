/* ================= demo presentation (plan section 16): Face ID start, fast-forward cash-flow river, the year =================
   U / Reset = demoStart(): fresh data, the lock screen with a Face ID unlock, the splash, then Home (the new-user seed, no pop-up). Junior ends in 300 days (month 10 of the year).
   O = +1 month, Q = +2 months, Y = to month 12: fastForward(n, mode) runs one month at a time on the app's own screens (Home, then the Persely tab):
   numbers roll to their new values and bars grow while a small bar above the tab bar shows the month and what happens. Y stops once when the
   Junior package ends: the summary sheet opens the graduation screen and "Keep my 3.0%" carries on with the rest of the year (S._ffRest).
   The year ends on PAGES.year ("Your year in Persely"). */
let fidTimers = [];
function faceIdUnlock(done){
  fidTimers.forEach(clearTimeout); fidTimers = [];
  lockPhone(); const l = $('#lock'); let f = l.querySelector('.fid');
  if(!f){ f = document.createElement('div'); f.className = 'fid'; f.setAttribute('aria-hidden', 'true');
    f.innerHTML = `<svg viewBox="0 0 64 64" width="76" height="76" fill="none" stroke="${PALETTE.white}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <g class="fid-c"><path d="M6 20V12a6 6 0 0 1 6-6h8"/><path d="M44 6h8a6 6 0 0 1 6 6v8"/><path d="M58 44v8a6 6 0 0 1-6 6h-8"/><path d="M20 58h-8a6 6 0 0 1-6-6v-8"/></g>
      <g class="fid-face"><path d="M23 23v5"/><path d="M41 23v5"/><path d="M32 23v11h-3"/><path d="M23 42q9 7 18 0"/></g>
      <path class="fid-ok" d="M20 33l8 8 16-17"/></svg><span>Face ID</span>`; l.appendChild(f); }
  l.classList.add('fidon'); f.classList.remove('fid-done'); f.classList.add('fid-scan');
  fidTimers.push(setTimeout(() => { f.classList.remove('fid-scan'); f.classList.add('fid-done'); }, 1000));
  fidTimers.push(setTimeout(() => { unlockPhone(); setTimeout(() => l.classList.remove('fidon'), 360); if(done) done(); }, 1600));
}
// load a seed: 'new' (brand-new user, the pitch default) or 'existing' (goals, 8-week streak). Same clean start as the reset, without Face ID. Demo key X.
function loadSeed(kind){
  closeOnb(); closeWhatsNew(); closeStory(); ffClose(); closeSheet(); while(stack.length) popPage(true);
  S = fresh(kind); S.juniorDays = 300; S.flowLog = []; S.savInt = 0; S._ffRest = 0; S.jrShown = false; HINT_SHOWN.clear(); HINT_FORCE = false; SETUP_COLLAPSED = false;
  unlockPhone(); renderAll(); tab('fooldal'); renderDemoPanel(); toast(kind === 'existing' ? 'Demo: existing user' : 'Demo: new user');
}
const toggleSeed = () => loadSeed(seedKind() === 'new' ? 'existing' : 'new');
function demoStart(kind){
  closeOnb(); closeWhatsNew(); closeStory(); ffClose(); closeSheet(); while(stack.length) popPage(true);
  S = fresh(kind === 'existing' ? 'existing' : 'new'); S.juniorDays = 300; HINT_SHOWN.clear(); HINT_FORCE = false; SETUP_COLLAPSED = false; S.flowLog = []; S.savInt = 0; S._ffRest = 0; S.jrShown = false; renderAll(); tab('fooldal');
  faceIdUnlock(() => { showSplash(900); });
}
// ---------- fast forward, live on the app's own screens ----------
// Each simulated month: snapshot the numbers and bars on the screen, run monthStep(), then the real screen re-renders and every number
// that changed rolls from its old to its new value while the bars grow, so the jury watches Anna's actual balances move.
// A small dark bar above the tab bar shows the month, the day running and what is happening ("+75 000 Ft · Salary").
// Tap the bar to skip to the end. The jump ends on a summary sheet in the app's own sheet style.
const FF = {on:false, skip:false, months:[], mode:'month', stop:false, timers:[], raf:new Set()};
const ffWait = ms => new Promise(r => { if(FF.skip) return r(); const t = setTimeout(r, ms); FF.timers.push(t); FF.wake = r; });
const ffView = () => document.querySelector('.view.on');
function ffKey(el, root){   // a stable key for a number or bar: its nearest marked ancestor + its index inside it
  let a = el.parentElement;
  while(a && a !== root){ if(a.classList.contains('acc') || a.classList.contains('hero') || [...a.attributes].some(x => x.name.startsWith('data-'))) break; a = a.parentElement; }
  const sig = a && a !== root ? a.className + '|' + [...a.attributes].filter(x => x.name.startsWith('data-')).map(x => x.name + '=' + x.value).join(',') : 'root';
  const peers = a && a !== root ? [...a.querySelectorAll(el.matches('.num') ? '.num' : '.prog i, .bar i')] : [];
  return sig + '#' + peers.indexOf(el);
}
function ffSnap(){
  const v = ffView(), m = new Map(); if(!v) return m;
  v.querySelectorAll('.num').forEach(el => m.set('n:' + ffKey(el, v), el.textContent));
  v.querySelectorAll('.prog i, .bar i').forEach(el => m.set('b:' + ffKey(el, v), el.style.width));
  return m;
}
const ffParse = s => { const mt = /-?\d(?:[\d.,]|[\s\u00a0\u202f](?=\d))*/.exec(s || ''); if(!mt) return null; const raw = mt[0].trim(), dec = /[.,]\d$/.test(raw);
  const n = parseFloat(raw.replace(/[\s  ]/g, '').replace(/,(?=\d$)/, '.').replace(/,/g, '')); return isNaN(n) ? null : {pre:s.slice(0, mt.index), post:s.slice(mt.index + mt[0].length), n, dec, raw}; };
const ffFmt = (n, p) => p.dec ? n.toFixed(1) : (Math.abs(p.n) >= 1000 || /\s/.test(p.raw) ? Math.round(n).toLocaleString('hu-HU').replace(/ /g, ' ') : String(Math.round(n)));
function ffMorph(old, ms){   // roll every changed number on the current screen, grow every changed bar
  const v = ffView(); if(!v || !old.size) return;
  v.querySelectorAll('.num').forEach(el => {
    const was = old.get('n:' + ffKey(el, v)), now = el.textContent; if(was == null || was === now) return;
    const a = ffParse(was), b = ffParse(now); if(!a || !b || a.pre !== b.pre || a.post !== b.post || a.n === b.n) return;
    el.classList.add('ff-chg');
    if(FF.skip || ms <= 0){ el.textContent = now; return; }
    const t0 = performance.now(); el.textContent = was;
    const step = t => { const p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 3); el.textContent = p >= 1 || FF.skip ? now : b.pre + ffFmt(a.n + (b.n - a.n) * e, b) + b.post;
      if(p < 1 && !FF.skip){ const id = requestAnimationFrame(step); FF.raf.add(id); } };
    FF.raf.add(requestAnimationFrame(step));
  });
  v.querySelectorAll('.prog i, .bar i').forEach(el => {
    const was = old.get('b:' + ffKey(el, v)), now = el.style.width; if(!was || was === now) return;
    el.style.transition = 'none'; el.style.width = was; void el.offsetWidth;
    el.style.transition = `width ${FF.skip ? 0 : ms}ms cubic-bezier(.2,.7,.2,1)`; el.style.width = now;
  });
}
function ffEvents(f){   // what happened in a month, in the order it happens, for the bar's ticker
  const e = [];
  if(f.salary) e.push(['+' + ft(f.salary), 'Salary', 'in']);
  if(f.family) e.push(['+' + ft(f.family), 'Family transfer', 'in']);
  if(f.bills) e.push(['−' + ft(f.bills), `${plural(f.billsN, 'bill')} paid`, 'out']);
  if(f.ess + f.fun) e.push(['−' + ft(f.ess + f.fun + f.other), 'Card payments', 'out']);
  if(f.saved) e.push(['+' + ft(f.saved), 'To Persely', 'save']);
  if(f.interest) e.push(['+' + ft(f.interest), `Interest at ${rateLabel()}`, 'save']);
  return e;
}
function ffHud(f, i, n){
  const el = $('#ff'); el.querySelector('[data-ffm]').textContent = `${f.name} ${f.ym.slice(0, 4)}`;
  el.querySelector('[data-ffn]').textContent = n > 1 ? `Month ${i + 1} of ${n}` : 'Fast forward';
}
function ffTicker(ev, ms){
  const t = $('#ff [data-fft]'); if(!t) return;
  const show = ([a, b, k]) => { t.className = 'ff-ev ' + k; t.innerHTML = `<b class="num">${a}</b><span>${b}</span>`; t.classList.remove('in'); void t.offsetWidth; t.classList.add('in'); };
  if(!ev.length) return; const gap = ms / ev.length; ev.forEach((x, k) => { const id = setTimeout(() => { if(!FF.skip) show(x); }, k * gap); FF.timers.push(id); });
}
function ffDay(ms){ const d = $('#ff [data-ffday]'); d.style.transition = 'none'; d.style.width = '0%'; void d.offsetWidth; d.style.transition = `width ${FF.skip ? 0 : ms}ms linear`; d.style.width = '100%'; }
async function fastForward(n, mode){
  if(FF.on) return;
  unlockPhone(); closeSheet(); closeOnb(); closeWhatsNew(); closeStory(); hideBanners(); hideToast(true); hideChip(true); while(stack.length) popPage(true);
  window.__ffOn = true; Object.assign(FF, {on:true, skip:false, months:[], mode, stop:false, timers:[], start:total()});
  const el = $('#ff');
  el.innerHTML = `<div class="ff-hud" data-ffskip role="status" aria-live="polite"><div class="ff-hl"><span class="ff-ic">${I('sched', 18)}</span><span><small data-ffn></small><b data-ffm></b></span></div>
    <div class="ff-ev" data-fft></div><div class="ff-day"><i data-ffday></i></div></div>`;
  el.classList.add('on'); $('#phone').classList.add('ffon');
  const reduced = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches; if(reduced) FF.skip = true;
  const plan = i => mode === 'year' ? 'hub' : n === 1 ? 'fooldal' : (i === 0 ? 'fooldal' : 'hub');
  await ffWait(250);
  for(let i = 0; i < n; i++){
    const scr = plan(i); if(document.querySelector('.view.on') !== document.getElementById('v-' + scr)){ tab(scr); ffScroll(scr); await ffWait(FF.skip ? 0 : 450); }
    const dur = n === 1 ? 4200 : n === 2 ? 3000 : Math.max(800, 1900 - i * 160), old = ffSnap();
    monthStep(true); ffScroll(scr); const f = S.flowLog[S.flowLog.length - 1]; FF.months.push(f);
    ffHud(f, i, n); ffDay(dur); ffMorph(old, dur * .8); ffTicker(n <= 2 ? ffEvents(f) : ffEvents(f).filter(x => x[2] === 'save'), dur * .8);
    await ffWait(FF.skip ? 0 : dur);
    if(mode === 'year' && S.juniorDays === 0 && !S.bridge && !S.jrShown){ S.jrShown = true; FF.stop = true; S._ffRest = n - i - 1; break; }
  }
  save(); FF.skip = true; FF.raf.forEach(cancelAnimationFrame); FF.raf.clear(); renderAll();
  await new Promise(r => setTimeout(r, 300));
  ffEnd(); sheet(ffLandHTML());
}
function ffScroll(scr){ const v = document.getElementById('v-' + scr); if(!v) return;
  if(scr === 'hub'){ const g = v.querySelector('[data-tour="goals"]'); v.scrollTop = g ? Math.max(0, g.offsetTop - 330) : 0; } else v.scrollTop = 0; }
function ffEnd(){ FF.timers.forEach(clearTimeout); FF.timers = []; FF.raf.forEach(cancelAnimationFrame); FF.raf.clear(); FF.on = false; window.__ffOn = false; const el = $('#ff'); el.classList.remove('on'); el.innerHTML = ''; $('#phone').classList.remove('ffon'); setTimeout(mqPump, 400); }
$('#ff').addEventListener('click', e => { if(e.target.closest('[data-ffskip]') && FF.on){ FF.skip = true; if(FF.wake) FF.wake(); } });
const ffVal = (m, key) => key === 'spent' ? m.ess + m.fun + m.other : m[key];
function ffLandHTML(){
  const M = FF.mode === 'year' ? (S.flowLog || []).slice(-Math.min(12, S.months)) : FF.months, n = M.length, sum = key => M.reduce((a, m) => a + ffVal(m, key), 0), first = M[0], last = M[n - 1];
  const span = n === 1 ? `${last.name} ${last.ym.slice(0, 4)}` : `${first.name.slice(0, 3)} ${first.ym.slice(0, 4)} – ${last.name.slice(0, 3)} ${last.ym.slice(0, 4)}`;
  const due = n * dueBills(), paid = M.reduce((a, m) => a + m.billsN, 0);
  if(FF.mode === 'year'){ const yms = (S.closedYm || []).filter(y => y >= ymAt(1) && y <= ymAt(S.months)), A = stAgg(yms);   // same totals as the year screen and the year story
    const tot = {in:A.inc, bills:A.must, spent:A.ess + A.fun + A.other, saved:A.save, interest:A.interest}; var sumY = key => tot[key]; }
  const S2 = FF.mode === 'year' ? sumY : sum;
  const head = FF.stop ? 'Your Junior package ends' : FF.mode === 'year' && S.months >= 12 ? 'One year with Persely' : `${plural(n, 'month')} later`;
  const btn = FF.stop ? `<button class="btn" data-ffgrad>See what's next</button>` : FF.mode === 'year' && S.months >= 12 ? `<button class="btn" data-ffyear>See your year</button>` : `<button class="btn" data-ffdone>Continue</button>`;
  return `<div class="ff-ck">${span}</div><h2 class="ff-h">${head}</h2>
    ${FF.stop ? `<p class="fine" style="text-align:center;margin:-6px 0 var(--sp-3)">Month ${S.months}: have your salary paid into OTP and keep my 3.0% on the first 500 000 Ft for 12 more months.</p>` : ''}
    <div class="card lst">${[['Money in', ft(S2('in'))], [`Bills paid${due ? ` · ${paid} of ${due} on time` : ''}`, ft(S2('bills'))], ['Card spending', ft(S2('spent'))], ['Put aside in Persely', ft(S2('saved'))], [`Interest at ${rateLabel()}, after tax`, '+' + ft(S2('interest'))]].map(([a, b]) => `<div class="li"><span class="t"><b>${a}</b></span><b class="num">${b}</b></div>`).join('')}
      <div class="li"><span class="t"><b>Now in Persely</b></span><b class="num u-c-gt">${ft(total())}</b></div></div>${btn}`;
}
const dueBills = () => mustBills().filter(b => b.day <= (S.demoDay || 14)).length;   // bills that fall due by the demo "today" (the 14th) of each simulated month
function ffClose(){ if(FF.on){ FF.skip = true; if(FF.wake) FF.wake(); } ffEnd(); }
function yearMonths(){ return (S.flowLog || []).slice(-Math.min(12, S.months || 0) || -1); }
function yearHTML(){
  const M = yearMonths(), n = M.length, sum = key => M.reduce((a, m) => a + ffVal(m, key), 0); if(!n) return '<div class="card" style="padding:var(--sp-4)">Fast-forward a month first (O).</div>';
  const I0 = sum('interest'), sav = M.reduce((a, m) => a + (m.sav || 0), 0);
  // What your rate earned, per 100 000 Ft for a year, after 28% tax, all three on the same bar scale (C4.2). Same amount for every row, so the rates are what differ.
  const P100 = 100000, net = r => Math.round(P100 * r / 100 * (1 - TAX)), R3 = [['Persely', RATE, 'g', 'On your first 500 000 Ft with your Junior package'], ['Savings account', SAV_RATE, 'g2', 'Interest credited each month'], ['Before Persely', LOW_RATE, 'l', 'What the same money earned until now']], mx = Math.max(...R3.map(r => net(r[1])), 1);
  const bar = ([label, r, cls, note]) => `<div class="yr-b"><div class="yr-bl"><span>${label}, ${r.toFixed(r < 1 ? 2 : 1)}%</span><b class="num">+${ft(net(r))}</b></div><div class="yr-bt"><i class="${cls}" style="--w:${Math.max(1.5, net(r) / mx * 100)}%"></i></div><small>${note}</small></div>`;
  // CONFIRM WITH OTP: whether Persely may be shown beside a higher Savings account rate, and the Savings account access terms. The sentence does not claim Persely earns more.
  const verdict = `The Savings account pays the higher rate, ${SAV_RATE}% against ${RATE.toFixed(1)}%, both after the same 28% tax, while Persely keeps each goal apart and you can withdraw any time.`;
  const due = n * dueBills(), paid = M.reduce((a, m) => a + m.billsN, 0);
  const yms = (S.closedYm || []).filter(y => y >= ymAt(1) && y <= ymAt(S.months)).slice(-12), A = stAgg(yms);   // the same totals as the year story
  const goals = S.goals.filter(g => !isEur(g)).map(g => { const sv = gSaved(g), tg = gTarget(g), done = sv >= tg, p = Math.min(100, Math.round(sv / tg * 100));   // a reached goal shows the target, not the surplus
    return `<div class="li"><span class="t"><b>${esc(g.name)}</b><small>${ft(Math.min(sv, tg))} of ${ft(tg)}</small><span class="prog" style="display:block;margin:var(--sp-2) 0 0"><i style="width:${p}%"></i></span></span>${done ? '<span class="pill ok">Reached</span>' : `<b class="num u-c-gt">${p}%</b>`}</div>`; }).join('');
  // the health score once: the first month of the year against the last
  const H = S.scoreHist || [], sFirst = H.length ? scoreOf(H.slice(0, Math.max(1, H.length - n + 1))).t : null, sLast = H.length ? scoreOf(H).t : null;
  return `<div class="yr-hero card"><div class="u-k-xs">${M[0].name.slice(0, 3)} ${M[0].ym.slice(0, 4)} – ${M[n - 1].name.slice(0, 3)} ${M[n - 1].ym.slice(0, 4)} · ${plural(n, 'month')}</div>
      <div class="yr-big num">${ft(total())}</div><div class="u-fs-s">in Persely now · ${ft(A.save)} put aside this year</div></div>
    <div class="sec"><span>What your rate earned</span></div>
    <div class="card yr-bars"><div class="k" style="margin-bottom:var(--sp-2)">Per 100 000 Ft for a year, after tax</div>${R3.map(bar).join('')}<div class="fine yr-v">${verdict}<!-- CONFIRM WITH OTP --></div></div>
    <div class="sec"><span>Your money this year</span></div>
    <div class="card lst">${[['Money in', ft(A.inc)], ['Must-pay bills', `${ft(A.must)}${due ? ` · ${paid} of ${due} on time` : ''}`], ['Everyday essentials', ft(A.ess)], ['Fun', ft(A.fun)], ['Put aside in Persely', ft(A.save)], ['Interest, all accounts', '+' + ft(I0 + sav)]].map(([a, b]) => `<div class="li"><span class="t"><b>${a}</b></span><b class="num">${b}</b></div>`).join('')}</div>
    <div class="sec"><span>Your goals</span></div><div class="card lst">${goals || '<div class="li"><span class="t"><small>No goals yet</small></span></div>'}</div>
    ${sFirst !== null ? `<div class="sec"><span>Financial health score</span></div><div class="card yr-sav"><span class="t"><b>First month ${sFirst}, last month ${sLast} of 100</b><small>Spending under income, no overdraft, a buffer and regular saving</small></span><b class="num ${sLast > sFirst ? 'u-c-gt' : ''}">${sLast > sFirst ? '▲ ' + (sLast - sFirst) : sLast < sFirst ? '▼ ' + (sFirst - sLast) : 'No change'}</b></div>` : ''}`;
}
function renderDemoPanel(){
  const p = $('#demoPanel');
  p.classList.toggle('hidden', demo.hidden); $('#demoShow').classList.toggle('on', demo.hidden);
  p.innerHTML = `<h4><span>Demo notifications</span><span>H hides</span></h4>
    ${DEMO.map((n,i)=>`<button data-dp="${i}">${n.e} ${n.label}<kbd>${i+1}</kbd></button>`).join('')}
    <div class="sep"></div>
    <button data-dlock class="${demo.locked?'on':''}">${demo.locked?'🔓 Unlock phone':'🔒 Lock phone'}<kbd>L</kbd></button>
    <button data-dsalary>💰 Payday<kbd>P</kbd></button>
    <button data-dcoffee>☕ Card purchase<kbd>C</kbd></button>
    <button data-ddori>👯 Dóri joins<kbd>D</kbd></button>
    <button data-dnext>⏭ Next week<kbd>N</kbd></button>
    <button data-dbill>🧾 Bill missed (rent)<kbd>B</kbd></button>
    <button data-dmonth>⏩ +1 month<kbd>O</kbd></button>
    <button data-dmonth2>⏩ +2 months<kbd>Q</kbd></button>
    <button data-dyear>⏩ To month 12<kbd>Y</kbd></button>
    <button data-dsem>🎓 End of semester<kbd>E</kbd></button>
    <button data-dgrad>🎉 Junior ends / graduation<kbd>G</kbd></button>
    <button data-dstory>📊 Story<kbd>M</kbd></button>
    <button data-dtour>💡 Persi hints again<kbd>T</kbd></button>
    <button data-dupdate>▶ Demo start: Face ID<kbd>U</kbd></button>
    <button data-djump>📅 8 weeks later<kbd>J</kbd></button>
    <button data-dseed>👤 Seed: ${seedKind() === 'new' ? 'new user (switch to existing)' : 'existing user (switch to new)'}<kbd>X</kbd></button>
    <button data-ddelay>⏱ Delay: ${demo.delay ? demo.delay+' s' : 'none'}</button>
    <button data-dphone class="${demo.phone?'on':''}">📱 Also send to iPhone: ${demo.phone?'on':'off'}</button>
    <button data-dsound>${demo.sound?'🔔 Sound: on':'🔕 Sound: off'}</button>${SIMPLE_PERSELY ? `\n    <button data-dday>🌅 Reset day<kbd>Z</kbd></button>` : ''}
    <button data-dreset>↺ Reset app</button>
    <button data-dhide>Hide panel<kbd>H</kbd></button>`;
}
$('#demoPanel').addEventListener('click', e=>{
  const b = e.target.closest('button'); if(!b) return;
  const d = b.dataset;
  if(d.dp !== undefined) sendDemo(+d.dp);
  else if('dlock' in d) demo.locked ? unlockPhone() : lockPhone();
  else if('dnext' in d) nextWeek();
  else if('dsalary' in d) salaryArrives();
  else if('dcoffee' in d) coffee();
  else if('ddori' in d) doriJoins();
  else if('dbill' in d) billMissed();
  else if('dmonth' in d) fastForward(1, 'month');
  else if('dmonth2' in d) fastForward(2, 'month');
  else if('dyear' in d) fastForward(S.months < 12 ? 12 - S.months : 12, 'year');
  else if('dsem' in d) endSemester();
  else if('dgrad' in d) graduation();
  else if('dstory' in d) demoStory();
  else if('dtour' in d){ unlockPhone(); showHints(); }
  else if('dupdate' in d) demoUpdateDay();
  else if('djump' in d) week8State();
  else if('dseed' in d) toggleSeed();
  else if('ddelay' in d){ demo.delay = {0:3, 3:10, 10:0}[demo.delay]; renderDemoPanel(); }
  else if('dphone' in d){ demo.phone = !demo.phone; renderDemoPanel(); }
  else if('dday' in d){ resetPushDay(); toast('New day: one push can land again'); }
  else if('dsound' in d){ demo.sound = !demo.sound; renderDemoPanel(); }
  else if('dreset' in d) demoStart();   // back to the start of act 1 (logged out, update not seen)
  else if('dhide' in d){ demo.hidden = true; renderDemoPanel(); }
});
$('#demoShow').addEventListener('click', ()=>{ demo.hidden = false; renderDemoPanel(); });
// on the phone itself, with the demo flag on: long-press the avatar on Home opens the demo controls (idea from the team handoff). A tap on the avatar opens Settings.
function demoSheet(){
  const b = (a, e, t, s) => `<button data-dm="${a}">${e} ${t}<small>${s}</small></button>`;
  return `<h2>Demo controls</h2><div class="dsheet">${b('payday','💰','Payday','Salary, asks 10%')}${b('coffee','☕','Card purchase','Coffee, round-up')}${b('dori','👯','Dóri joins','Shared Persely')}${b('week','⏭','Next week','')}${b('bills','🧾','Bill missed','Rent unpaid, Bills first')}${b('month','⏩','+1 month','Cash flow, rules, interest')}${b('month2','⏩','+2 months','Cash flow')}${b('year','⏩','To month 12','Stops at Junior ends')}${b('sem','🎓','End of semester','Semester story')}${b('grad','🎉','Junior ends','Keep my 3.0%')}${b('seed','👤','Seed','New or existing user')}${b('update','▶','Demo start','Face ID, new user')}${b('reset','↺','Reset','Back to the start')}</div>`;
}
let lpTimer = null;
document.addEventListener('pointerdown', e => { if(!DEMO_ON || !(e.target.closest && e.target.closest('.hhead .avatar'))) return; clearTimeout(lpTimer); lpTimer = setTimeout(() => { lpTimer = null; sheet(demoSheet()); }, 650); });
['pointerup','pointercancel','pointermove'].forEach(ev => document.addEventListener(ev, e => { if(ev === 'pointermove' && !(e.target.closest && e.target.closest('.hhead .avatar'))) clearTimeout(lpTimer); else if(ev !== 'pointermove') clearTimeout(lpTimer); }));
addEventListener('keydown', e=>{
  if(e.target.closest && e.target.closest('input')) return;
  if(!DEMO_ON || e.metaKey || e.ctrlKey || e.altKey) return;   // the presenter keys work while the demo flag is on
  const k = e.key.toLowerCase();
  if(k >= '1' && k <= String(DEMO.length)) sendDemo(+k - 1);
  else if(k === 'l') demo.locked ? unlockPhone() : lockPhone();
  else if(k === 'n') nextWeek();
  else if(k === 'p') salaryArrives();
  else if(k === 'c') coffee();
  else if(k === 'd') doriJoins();
  else if(k === 'b') billMissed();
  else if(k === 'o') fastForward(1, 'month');
  else if(k === 'q') fastForward(2, 'month');
  else if(k === 'y') fastForward(S.months < 12 ? 12 - S.months : 12, 'year');
  else if(k === 'e') endSemester();
  else if(k === 'g') graduation();
  else if(k === 'm') demoStory();
  else if(k === 't'){ unlockPhone(); showHints(); }
  else if(k === 'u') demoUpdateDay();
  else if(k === 'j') week8State();
  else if(k === 'x') toggleSeed();
  else if(k === 'z' && SIMPLE_PERSELY){ resetPushDay(); toast('New day: one push can land again'); }
  else if(k === 'h'){ demo.hidden = !demo.hidden; renderDemoPanel(); }
});
renderDemoPanel();

