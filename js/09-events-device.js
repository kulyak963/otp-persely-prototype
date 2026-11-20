/* ================= events ================= */
document.addEventListener('keydown', e => {   // Esc closes the top layer: sheet, set-up flow, pop-up, story
  if(e.key !== 'Escape' || demo.locked) return;
  if(sheetOpen()){ e.preventDefault(); closeSheet(); return; }
  if($('#story').classList.contains('on') && typeof closeStory === 'function'){ e.preventDefault(); closeStory(); return; }
  if($('#onb').classList.contains('on')){ e.preventDefault(); const q = $('#onb [data-onbquit]'); if(q) q.click(); else closeOnb(); return; }
  if($('#wn').classList.contains('on')){ e.preventDefault(); closeWhatsNew(); }
});
document.addEventListener('click', e=>{
  if(e.target.id==='back'){ closeSheet(); return; }
  const t = e.target.closest('button,a,[data-go],[data-tab],circle[data-fcat]'); if(!t) return;
  const d = t.dataset;
  if('undo' in d){ const f = UCH.fn; hideChip(true); if(f) f(); return; }
  if(d.sw){   // switches: the switch itself toggles; the row beside it opens the settings sheet
    const k = d.sw, before = snap();
    if(k === 'payday' || k === 'weekly' || k === 'round'){ const g = ruleGoal(); if(!goalIsPlain(g)) return; const r = ownRules(g), key = k === 'payday' ? 'pay' : k === 'weekly' ? 'wk' : 'rr';   // older switches: the main goal's own rule
      if(key === 'pay' && !r.pay.on && payPctWith(g, r.pay.pct) > PAY_CAP){ toast(capText(payPctWith(g, r.pay.pct))); return; }
      r[key].on = !r[key].on; syncSplit(); renderAll(); undoable(before, `${key === 'pay' ? 'Payday rule' : key === 'wk' ? 'Weekly transfer' : 'Round-ups'} ${r[key].on ? 'on' : 'off'} for ${g.name}`); }
    else if(k === 'rdrr'){ const dd = ruleDefaults(); dd.rr = !dd.rr; renderAll(); undoable(before, `New goals: round-ups ${dd.rr ? 'on' : 'off'}`); }
    else if(k === 'remind'){ S.remind = !S.remind; renderAll(); toast(S.remind ? 'Sunday streak reminder on: Sunday 18:00' : 'Sunday streak reminder off'); }
    else if(k.indexOf('n:') === 0){ const key = k.slice(2); if(!(key in notifDefault())) return; S.notif[key] = !S.notif[key]; renderAll(); }
    else if(k === 'analyst'){   // on by default (D10): turning it off asks first, turning it on is one tap
      if(S.analyst.on) sheet(SHEETS.anoffcfm());
      else { S.analyst.on = true; S.analyst.accepted = true; renderAll(); undoable(before, 'Financial analyst on'); } }
    return; }
  if('settings' in d){ if(sheetOpen()) closeSheet(); openSettings(d.settings); return; }
  if(d.inb !== undefined){ const it = (S.inbox || [])[+d.inb]; if(!it) return; it.read = true; save(); popPage(true); renderAll(); openFromNote(it.url); return; }
  if('inbread' in d){ (S.inbox || []).forEach(x => { x.read = true; }); renderAll(); return; }
  if('ver' in d){ VER_TAPS++; if(VER_TAPS >= 5){ VER_TAPS = 0; setDemoMode(!DEMO_ON); toast(DEMO_ON ? 'Demo controls are on' : 'Demo controls are off'); } return; }
  if(d.tab){ closeSheet(); tab(d.tab); return; }
  if(d.go){ if(sheetOpen()) closeSheet(); pushPage(d.go); return; }
  if('pop' in d){ popPage(); return; }
  if(d.demo){ demoToast(d.demo); return; }
  if(d.toast){ toast(d.toast); return; }
  if(d.sheet){ if((d.sheet === 'hubsave' || d.sheet === 'hubout') && !S.goals.length){ sheet(SHEETS.newgoal()); sheetNote('Create a goal first'); return; }
    if(RULE_SHEETS.includes(d.sheet)) UNDO.base = snap(); sheet(SHEETS[d.sheet]()); return; }
  if(d.setv){ const f = $('#' + (d.into || 'mv')); if(f){ f.value = d.setv; ferrClear(f.id); if(PEND) cfmBack(); } return; }
  if('cfmok' in d){ const p = PEND; PEND = null; if(p) p.ok(); return; }
  if('cfmback' in d){ cfmBack(); return; }
  if(d.dmove || d.wall === 'move'){
    const kind = d.dmove || 'kivesz', out = kind === 'kivesz';
    const run = v => { const from = out ? acc('persely') : acc('junior'), to = out ? acc('junior') : acc('persely');
      if(from.v < v){ ferr('mv', `Not enough money on ${from.n}`); return; }
      const before = snap();
      if(out){ from.v -= v; to.v += v; S.tx.unshift({...stamp(), d:'Today', n:'PERSELY WITHDRAWAL', s:'Between my accounts', a:v, ic:'piggy', note:S.persely.name}); }
      else depositTo(S.goals.find(g => g.id === 'holiday') || S.goals[0], v);
      closeSheet(); renderAll(); undoable(before, out ? `Withdrawn: ${ft(v)}` : `Added to Persely: ${ft(v)}`); };
    if(d.wall){ const v = acc('persely').v; if(v <= 0) return; $('#mv').value = v; askInline(`Withdraw all ${ft(v)} to Junior account?`, () => run(v)); return; }
    const v = Math.max(0, parseInt(($('#mv').value||'0').replace(/\D/g,''))||0); if(!v){ ferr('mv', E_AMT); return; }
    if((out ? acc('persely') : acc('junior')).v < v){ ferr('mv', `Not enough money on ${fromName(out ? 'persely' : 'junior')}`); return; }
    if(out && v > REVIEW_OVER){ askInline(`Review: Withdraw ${ft(v)} to Junior account?`, () => run(v)); return; }
    run(v); return;
  }
  if('dout' in d){
    ferrClear();
    const n = ($('#un').value||'').trim(), a = ($('#ua').value||'').trim(), digits = a.replace(/[\s-]/g,''), v = parseInt(($('#uv').value||'').replace(/\D/g,''))||0;
    let bad = null; const fail = (id, m) => { ferr(id, m); bad = bad || id; };
    if(!n) fail('un', E_NAME);
    if(!/^[\d\s-]+$/.test(a) || !/^(\d{16}|\d{24})$/.test(digits)) fail('ua', E_ACC);
    if(!v) fail('uv', E_AMT); else if(acc('junior').v < v) fail('uv', E_FUNDS);
    if(bad){ const f = $('#' + bad); if(f) try{ f.focus({preventScroll:true}); }catch(e){} return; }
    const send = () => { if(acc('junior').v < v){ ferr('uv', E_FUNDS); cfmBack(); return; } const before = snap();
      acc('junior').v -= v; S.tx.unshift({...stamp(), d:'13 November', n:n.toUpperCase(), s:'Instant transfer', a:-v, ic:'money', note:a});
      closeSheet(); renderAll(); undoable(before, `Transfer sent: ${ft(v)} to ${n}`); };
    if(v > REVIEW_OVER){ askInline(`Review: Send ${ft(v)} to ${n}, ${a}?`, send); return; }
    send(); return;
  }
  if(d.txmode){ txMode=+d.txmode; renderView('tranzakciok'); return; }
  /* Transactions: search, chips, Filter sheet, category passed in from Spending */
  if(d.fcat){ txReset(); if(d.fcat === 'persely') txF.pers = true; else txF.cat = d.fcat; txMode = 0; tab('tranzakciok'); return; }
  if('txclr' in d){ txReset(); renderView('tranzakciok'); return; }
  if('txqclr' in d){ txQ = ''; txN = TX_STEP; const f = $('#txq'); if(f){ f.value = ''; f.focus({preventScroll:true}); } txRefresh(); return; }
  if('txmore' in d){ txN += TX_STEP; txRefresh(); return; }
  if(d.txrm){ txF[d.txrm] = ''; txN = TX_STEP; renderView('tranzakciok'); return; }
  if(d.txtog){ txF[d.txtog] = !txF[d.txtog]; txN = TX_STEP; renderView('tranzakciok'); return; }
  if('txfilter' in d){ txDraft = {...txF}; sheet(SHEETS.txfilter()); return; }
  if(d.txfd){ const [k, v] = d.txfd.split('|'); if(!txDraft) txDraft = {...txF}; txDraft[k] = k === 'pers' || k === 'bills' ? !txDraft[k] : (txDraft[k] === v ? '' : v); const st = $('#sheet').scrollTop; sheet(SHEETS.txfilter()); $('#sheet').scrollTop = st; return; }
  if('txfclear' in d){ txDraft = {...TX_BLANK}; const st = $('#sheet').scrollTop; sheet(SHEETS.txfilter()); $('#sheet').scrollTop = st; return; }
  if('txfapply' in d){ txF = {...(txDraft || txF)}; txDraft = null; txN = TX_STEP; closeSheet(); renderView('tranzakciok'); return; }
  if('freeze' in d){ S.frozen=!S.frozen; renderAll(); toast(S.frozen?'Your card is temporarily blocked':'Your card is active again'); return; }
  if(d.perktab){ perkTab = +d.perktab; refreshPages(); return; }
  if(d.perk){ S._perk = d.perk; sheet(SHEETS.perk()); return; }
  if(d.perkact){ const x = DISC.find(q => q.id === d.perkact); if(!x || S.disc.activated.includes(x.id)) return; const before = snap();
    S.disc.activated.push(x.id); closeSheet(); renderAll(); undoable(before, `Discount activated: ${x.n}`); return; }
  if(d.perkadd){ const x = DISC.find(q => q.id === d.perkadd); if(!x) return; const had = S.rewards.some(r => r.id === 'p' + x.id);
    if(!had) S.rewards.unshift({id:'p' + x.id, title:`${x.n}: ${x.t}`, partner:x.n, steps:x.steps, note:'Valid until 31 December 2026.', why:'Added from Perks'});
    perkTab = 1; closeSheet(); renderAll(); toast(had ? 'Already in my rewards' : `Added to my rewards: ${x.n}`); return; }
  if(d.nektab){ nekTab=+d.nektab; refreshPages(); return; }
  if('reset' in d){ closeOnb(); closeWhatsNew(); S=fresh(); renderAll(); tab('fooldal'); showSplash(1100); return; }
  if('pushon' in d){ enablePush(); return; }
  if('pushtest' in d){ testPush(); return; }
  /* Persely tab */
  if('closesheet' in d){ closeSheet(); return; }
  if('copyacc' in d){ const no = (S.accounts.find(a => a.id === 'junior') || {}).no || '', done = () => toast('Account number copied'); try{ navigator.clipboard.writeText(no).then(done, done); }catch(err){ done(); } return; }
  if('depprot' in d){ toast('Opens OTP deposit protection in the live app'); return; }
  if(d.latefix){ const g = goalById(d.latefix), fx = g ? lateFix(g) : 0; if(!fx) return; const before = snap();
    bumpWeekly(g, fx); keepBump(g); renderAll(); undoable(before, `${fixLabel(fx)}: ${g.name} now ${inMonths(gMonths(g))}`); return; }
  if(d.behindfix){ const g = goalById(d.behindfix), f = g ? behindFix(g) : null; if(!f) return; const before = snap();
    g.date = f.date; if(f.x){ bumpWeekly(g, f.x); keepBump(g); } renderAll(); undoable(before, `${g.name}: new date ${pkMonthName(f.date)}${f.x ? `, +${ft(f.x)} a week` : ''}`); return; }
  if(d.behindlump){ const g = goalById(d.behindlump), v = g ? lumpOf(g) : 0; if(!v) return; const before = snap();
    depositTo(g, v); renderAll(); undoable(before, `${ft(v)} moved to ${g.name}`); return; }
  if(d.hintok){ endHint(d.hintok); return; }
  if(d.goal){ S._detail = d.goal; closeSheet(); pushPage('goal'); return; }
  if(d.dm){ closeSheet(); ({payday:salaryArrives, coffee, dori:doriJoins, week:nextWeek, month:()=>fastForward(1, 'month'), month2:()=>fastForward(2, 'month'), year:()=>fastForward(S.months < 12 ? 12 - S.months : 12, 'year'), sem:endSemester, grad:graduation, update:demoUpdateDay, seed:toggleSeed,
    bills:billMissed, reset:demoStart})[d.dm](); return; }
  // rules from inside one Persely
  // rules from inside one Persely: each goal edits its own rules (switch, % or amount, day). Every change saves at once with a 10 s Undo; a payday % over the cap is blocked with a message
  if(d.grtog || d.grpct || d.grwk || d.grday){
    const [a, b] = (d.grtog || d.grpct || d.grwk || d.grday).split(':'), g = goalById(d.grtog ? b : a); if(!goalIsPlain(g)) return;
    const r = ownRules(g), before = snap(), blocked = tot => { S._cap = {id:g.id, text:capText(tot)}; refreshPages(); const m = document.querySelector('.page .capmsg'); if(m) m.scrollIntoView({block:'nearest'}); };
    let msg = ''; S._cap = null;
    if(d.grtog){
      if(a === 'pay'){ if(!r.pay.on && payPctWith(g, r.pay.pct) > PAY_CAP) return blocked(payPctWith(g, r.pay.pct)); r.pay.on = !r.pay.on; msg = r.pay.on ? `Payday rule on for ${g.name}: ${r.pay.pct}% of each salary` : `Payday rule off for ${g.name}`; }
      else if(a === 'wk'){ r.wk.on = !r.wk.on; msg = r.wk.on ? `${g.name}: ${ft(r.wk.amt)} every ${dayName(r.wk.day)}` : `Weekly transfer off for ${g.name}`; }
      else if(a === 'rr'){ r.rr.on = !r.rr.on; const n = rrGoals().length; msg = r.rr.on ? `Round-ups on for ${g.name}${n > 1 ? `, shared equally with ${n - 1} other ${n - 1 === 1 ? 'goal' : 'goals'}` : ''}` : `Round-ups off for ${g.name}`; }
      else return;
      if(!S.ruleGoal || !goalById(S.ruleGoal)) S.ruleGoal = g.id;
    }
    else if(d.grpct){ const x = +b; if(payPctWith(g, x) > PAY_CAP) return blocked(payPctWith(g, x)); r.pay.pct = x; r.pay.on = true; msg = `Payday rule for ${g.name}: ${x}% of each salary`; }
    else if(d.grwk){ r.wk.amt = +b; r.wk.on = true; msg = `${g.name}: ${ft(r.wk.amt)} every ${dayName(r.wk.day)}`; }
    else if(d.grday){ if(!WK_DAYS.some(x => x[0] === b)) return; r.wk.day = b; msg = `${g.name}: ${ft(r.wk.amt)} every ${dayName(b)}`; }
    syncSplit(); renderAll(); undoable(before, msg); return; }
  // amount and month pickers (shared by the wizard and Edit goal)
  if(d.pkamt){ const k = pkKind(t); pkSet(k, +d.pkamt); return; }
  if(d.pkdate){ const k = pkKind(t); pkObj(k).date = d.pkdate; pkSync(k); return; }
  if('pkmonth' in d){ const k = pkKind(t), o = pkObj(k), now = pkNow(), idx = Math.min(pkLast(), Math.max(now + 1, pkDateIdx(o.date)));
    PKM = {k, year:Math.floor(idx / 12), sel:o.date}; sheet(SHEETS.month()); pkYearsView(); return; }
  if(d.pkyear || d.pkystep){ const y0 = Math.floor(pkNow() / 12), y1 = Math.floor(pkLast() / 12);
    PKM.year = Math.min(y1, Math.max(y0, d.pkystep ? PKM.year + (+d.pkystep) : +d.pkyear)); pkSheetRender(d.pkystep ? [`[data-pkystep="${d.pkystep}"]:not(:disabled)`, `[data-pkystep="${-d.pkystep}"]`] : `[data-pkyear="${PKM.year}"]`); return; }
  if(d.pkmo){ PKM.sel = pkIdxDate(+d.pkmo); pkSheetRender(`[data-pkmo="${d.pkmo}"]`); return; }
  if('pkdone' in d){ pkObj(PKM.k).date = PKM.sel; closeSheet(); pkSync(PKM.k); const b = document.querySelector(`[data-pk="${PKM.k}"] [data-pkmonth]`); if(b) b.focus({preventScroll:true}); return; }
  if(d.pickgoal){ keepAmt(); if(S._goal !== d.pickgoal) S._amt = 0; S._goal = d.pickgoal; sheet(SHEETS.hubsave()); return; }
  if(d.hubfrom){ keepAmt(); S._from = d.hubfrom; sheet(SHEETS.hubsave()); return; }
  if(d.mvfrom || d.mvto){ keepAmt(); if(d.mvfrom) S._mf = d.mvfrom; else S._mt = d.mvto; sheet(SHEETS.hubsave()); return; }
  if('mvgo' in d){
    const f = S._mf, t = S._mt, v = amt(); if(!v){ ferr('mv', E_AMT); return; }
    if(f === t || !placeKey(f) || !placeKey(t)){ ferr('mv', 'Choose two different places'); return; }
    if(placeHas(f) < v){ ferr('mv', `Not enough money on ${placeName(f)}`); return; }
    const run = () => { const before = snap(), counted = moveBetween(f, t, v), tg = t[0] === 'g' ? goalById(t.slice(2)) : null; if(tg) S._goal = tg.id; S._amt = 0; closeSheet(); renderAll();
      undoable(before, `${ft(v)} moved from ${placeName(f)} to ${placeName(t)}${counted ? `. ${S.streak}-week streak` : ''}`); };
    if(v > REVIEW_OVER){ askInline(`Review: Move ${ft(v)} from ${placeName(f)} to ${placeName(t)}?`, run); return; }
    run(); return; }
  if('hubsave' in d){
    const v = amt(), g = goalById(S._goal) || S.goals[0], from = S._from || 'junior'; if(!v){ ferr('mv', E_AMT); return; }
    const before = snap(); let counted;
    if(isEur(g)){
      const huf = v * EUR_RATE; if(acc(from).v < huf){ ferr('mv', `Not enough money on ${fromName(from)}`); return; }
      acc(from).v -= huf; g.saved += v; S.tx.unshift({...stamp(), d:'Today', n:'CURRENCY EXCHANGE', s:`${eur(v)} for ${g.name}`, a:-huf, ic:'euro', note:g.name}); counted = markSaved();
    } else {
      if(acc(from).v < v){ ferr('mv', `Not enough money on ${fromName(from)}`); return; }
      counted = depositTo(g, v, from);
    }
    S._amt = 0; closeSheet(); renderAll();
    if(pig3d && cur === 'hub') setTimeout(() => pig3d.celebrate(), 250);   // a coin drops into Persi
    undoable(before, counted ? `🔥 ${S.streak}-week streak${S.streak % 4 === 0 ? ' · +1 skip week' : ''}. ${money(g, v)} added to ${g.name}` : `${money(g, v)} added to ${g.name}`);
    if(!isEur(g)){ S.lastAddAmount = v; save(); }   // D5: the next Add money starts with this amount (after the Undo snapshot, so Undo leaves it)
    return;
  }
  if(d.outgoal){ S._out = d.outgoal; sheet(SHEETS.hubout()); return; }
  if('hubout' in d || d.wall === 'out'){
    const g = goalById(S._out) || S.goals[0];
    const run = v => { if(mine(g) < v){ ferr('mv', g.shared ? `You can withdraw up to ${ft(mine(g))}` : `${g.name} has ${money(g, mine(g))}`); return; }
      const before = snap(), huf = withdrawFrom(g, v); closeSheet(); renderAll(); undoable(before, `${ft(huf)} is on your Junior account. No fee`); };
    if(d.wall){ const v = mine(g); if(v <= 0) return; $('#mv').value = v; askInline(`Withdraw all ${money(g, v)} to Junior account?`, () => run(v)); return; }
    const v = amt(); if(!v){ ferr('mv', E_AMT); return; }
    if(mine(g) < v){ ferr('mv', g.shared ? `You can withdraw up to ${ft(mine(g))}` : `${g.name} has ${money(g, mine(g))}`); return; }
    if((isEur(g) ? v * EUR_RATE : v) > REVIEW_OVER){ askInline(`Review: Withdraw ${money(g, v)} to Junior account?`, () => run(v)); return; }
    run(v); return;
  }
  // take everything out of one goal (from its page): one line to confirm, then the balance goes to 0, so it can be edited or deleted
  if(d.outall){ const g = goalById(d.outall); if(!g || g.shared || gSaved(g) <= 0) return; S._outall = g.id; sheet(SHEETS.outallc()); return; }
  if(d.outallok){ const g = goalById(d.outallok); if(!g || g.shared || gSaved(g) <= 0){ closeSheet(); return; } const before = snap(), huf = withdrawFrom(g, gSaved(g));
    closeSheet(); renderAll(); undoable(before, `${ft(huf)} is on your Junior account. ${g.name} is empty, so you can edit or delete it`); return; }
  if(d.gedit){ const g = goalById(d.gedit); if(!g || !goalIsPlain(g)) return;   // one edit for name, amount, date and icon, even with money inside (D8)
    S._draft = {edit:g.id, name:g.name, ic:g.ic || 'star', target:gTarget(g), saved:gSaved(g), typeAmt:0, date:g.date || pkIdxDate(pkNow() + 10)};
    pushPage('create'); return; }
  if(d.gdel){ const g = goalById(d.gdel); if(!g || (g.shared && !goalEmpty(g))) return; S._del = d.gdel; sheet(SHEETS.gdel()); return; }
  if(d.gdelok){ const g = goalById(d.gdelok); if(!g){ closeSheet(); return; } const before = snap(), name = g.name, inPage = stack.some(el => el.dataset.id === 'goal'), r = removeGoal(g.id, d.dest || '');
    if(!r){ closeSheet(); return; }
    S._del = null; closeSheet(); if(inPage) popPage(true); renderAll();
    undoable(before, `${name} deleted.${r.amt ? ` ${money(g, r.amt)} moved to ${r.to}.` : ''}${r.moved.length ? ` Its ${r.moved.join(' and ')} stopped.` : ''}`); return; }
  if(d.cgic){ keepCgName(); S._draft.ic = d.cgic; refreshPages(); const b = document.querySelector(`[data-cgic="${d.cgic}"]`); if(b) b.focus({preventScroll:true}); return; }
  if('cgsave' in d){ keepCgName(); const dr = S._draft, g = dr && goalById(dr.edit); if(!g) return;
    const why = cgGate(); if(why){ gateSync(); return; }
    const before = snap(), old = g.name, nm = cleanName(dr.name);
    g.name = nm; g.ic = dr.ic || g.ic; g.date = dr.date;
    if(g.id === 'holiday'){ S.persely.name = nm; S.persely.target = dr.target; const a = acc('persely'); if(a){ a.n = 'Persely – ' + nm; a.h = 'Goal: ' + ft(dr.target); } } else g.target = dr.target;
    if(old !== nm) S.tx.forEach(x => { if(x.note === old) x.note = nm; });
    S._draft = null; popPage(true); renderAll(); undoable(before, `${nm} saved`); return; }
  if(d.keepsaving){ const g = goalById(d.keepsaving); if(!g) return; const before = snap(); g.cont = true; renderAll(); undoable(before, `${g.name}: your rules keep saving here`); return; }
  if(d.sharedgoal){ S._shared = d.sharedgoal; sheet(SHEETS.sharedgoal()); return; }
  if(d.shgoal){ S._shGoal = +d.shgoal; keepShName(); sheet(SHEETS.newshared()); restoreShName(); return; }
  if(d.shfirst){ S._shFirst = +d.shfirst; keepShName(); sheet(SHEETS.newshared()); restoreShName(); return; }
  if('shcreate' in d){
    if(S.goals.length >= 5){ toast('You can have up to 5 Perselys'); return; }
    const name = (($('#shName') && $('#shName').value) || 'Shared goal').trim().slice(0,30) || 'Shared goal', first = S._shFirst || 15000;
    if(acc('junior').v < first){ toast('Not enough money on your Junior account'); return; }
    const g = {id:'s'+Date.now(), name, ic:'user', shared:true, target:S._shGoal || 120000, date:'2027-06-30', members:[{n:userFirst(), me:true, amt:0, c:PALETTE.orange}]};
    S.goals.push(g); S.onboarded = true; depositTo(g, first, 'junior', 'Shared Persely');
    renderAll(); closeSheet(); S._detail = g.id; pushPage('goal'); toast('Shared Persely created. Invite link ready to send'); return;
  }
  if('neweur' in d){
    if(S.goals.length >= 5){ toast('You can have up to 5 Perselys'); return; }
    S.goals.push({id:'e'+Date.now(), name:'Lisbon spending money', ic:'euro', cur:'EUR', saved:0, target:300, date:'2027-09-01'}); S.onboarded = true;
    closeSheet(); renderAll(); S._detail = S.goals[S.goals.length-1].id; pushPage('goal'); toast('Euro Persely created. Buy euros bit by bit before the trip'); return;
  }
  if(d.addgoal){
    if(S.goals.length >= 5){ toast('You can have up to 5 Perselys'); return; }
    const [n, ic, t] = d.addgoal.split('|');
    const before = snap(); S.goals.push({id:'g'+Date.now(), name:n, ic, target:+t, saved:0, pace:0, date:'2028-06-01'}); S.onboarded = true;
    closeSheet(); renderAll(); undoable(before, `${n} added`); return;
  }
  /* bills: pay, skip, lock, confirm, Bills pocket, transaction detail */
  if(d.billopen){ S._bill = d.billopen; sheet(SHEETS.bill()); return; }
  if(d.paybill){ S._bill = d.paybill; sheet(SHEETS.paybill()); return; }
  if(d.billskipask){ const [id, why] = d.billskipask.split(':'); S._bill = id; S._why = why; sheet(SHEETS.billskip()); return; }
  if(d.dopay){ const b0 = billById(d.dopay), left = b0 ? billStatus(b0).left : 0;
    const go = () => { const was = bfNow().on, before = snap(), r = payBill(d.dopay); if(r.err){ toast(r.err); return; }
      const off = billsDone(was); closeSheet(); renderAll(); undoable(before, `${r.name} paid: ${ft(r.amt)}${r.fromPocket ? ' from your Bills pocket' : ''}.${off ? ' Fun is back on.' : ''}`); };
    if(b0 && left > REVIEW_OVER){ askInline(`Review: Send ${ft(left)} to ${b0.key}, ${payeeAcct(b0.key)}?`, go); return; }
    go(); return; }
  if(d.billskip){ const [id, why] = d.billskip.split(':'), b = billById(id); if(!b) return; const was = bfNow().on, before = snap();
    S.billSkip[id] = billToday().ym; S.billSkipWhy = S.billSkipWhy || {}; S.billSkipWhy[id] = why; const off = billsDone(was); closeSheet(); renderAll();
    undoable(before, `${b.name}: ${why === 'paid' ? 'already paid elsewhere' : 'not due this month'}.${off ? ' Fun is back on.' : ''}`); return; }
  if(d.billunskip){ const before = snap(); delete S.billSkip[d.billunskip]; closeSheet(); renderAll(); undoable(before, 'Back on the list for this month'); return; }
  if(d.lockbill){ const b = billById(d.lockbill); if(!b) return; const before = snap(), was = bfNow().on; b.locked = !b.locked; billsDone(was); renderAll();
    if(d.resheet) sheet(SHEETS[d.resheet]()); undoable(before, b.locked ? `${b.name} is now a must-pay bill` : `${b.name} is not locked any more`); return; }
  if('confirmbills' in d){ const before = snap(); S.billsConfirmed = true; renderAll(); undoable(before, `${plural(mustBills().length, 'bill')} locked as must-pay`); return; }
  if(d.pocketmove){ const x = +d.pocketmove, before = snap();
    if(!pocketMove(x)){ toast('Not enough money on your Junior account'); return; }
    closeSheet(); renderAll(); undoable(before, `${ft(x)} moved to your Bills pocket. Safe to spend: ${ft(safeToSpend().safe)}`); return; }
  if(d.paycover !== undefined){   // payday sheet: the unpaid bills to the Bills pocket and (unless "only") the saving rule, both undone by one Undo
    const x = +d.paycover, before = snap(), P = paydayPlan(), both = !('only' in d) && P.canSave && x === P.toMove;
    if(x > 0 && !pocketMove(x)){ toast('Not enough money on your Junior account'); return; }
    if(both) paydayAlloc(S, P.rule).rows.forEach(r => { if(r.v > 0) depositTo(r.g, r.v, 'junior', `Payday rule: ${r.pct}%`); });
    closeSheet(); renderAll(); if(both && pig3d && cur === 'hub') setTimeout(() => pig3d.celebrate(), 250);
    undoable(before, `Bills covered: ${ft(x)} in Bills pocket${both ? `, ${ft(P.rule)} to ${payGoals().length > 1 ? 'your goals' : P.g.name}. ${ft(P.left)} free for Fun` : ''}`); return; }
  if('pocketback' in d){ const before = snap(), x = pocketBack(); if(!x) return; renderAll(); undoable(before, `${ft(x)} moved back to your Junior account`); return; }
  if(d.txd !== undefined){ S._txi = +d.txd; sheet(SHEETS.txd()); return; }
  if('txcat2' in d){ sheet(SHEETS.txcat()); return; }
  /* financial analyst */
  if('claimoffer' in d){ const g = goalById(S._offer); if(g){ const travel = g.ic === 'plane';
      S.rewards.unshift({id:'o' + g.id, title: travel ? 'Travel partner offer' : '5% cashback at a partner', partner: travel ? 'Horizon Travel' : 'Corner Market', steps: travel ? ['Book one trip with the partner travel agency.', 'Pay with your OTP card.', 'The 8% (up to 10 000 Ft) arrives on your Junior account within 5 working days.'] : REWARD_STEPS, note: travel ? '8% back on one booking. Up to 10 000 Ft.' : 'Up to 2 000 Ft back.', why:`Reached ${g.name}`}); }
    S._offer = null; closeSheet(); renderAll(); toast('Offer added to your rewards'); return; }
  if('anon' in d){ const before = snap(); S.analyst.on = true; S.analyst.accepted = true; closeSheet(); renderAll(); undoable(before, 'Financial analyst on'); return; }
  if('anread' in d){ S.anNote = true; save(); renderView('fooldal'); if(ohOn()) refreshPages(); sheet(SHEETS.anread()); return; }
  if('anask' in d || 'anoff' in d){ S.anNote = true; save(); renderView('fooldal'); if(ohOn()) refreshPages(); sheet(SHEETS.anoffcfm()); return; }   // Turn off always asks first
  if('anoffgo' in d){ const before = snap(); S.analyst.on = false; S.anNote = true; closeSheet(); renderAll(); undoable(before, 'Financial analyst off. Safe to spend is a simpler estimate'); return; }
  if('storywait' in d){ toast(`Your story arrives on ${storyDateTxt()}.`); return; }
  if('planback' in d){ popPage(); setTimeout(() => { const t = stack.length ? stack[stack.length - 1] : null, el = t && t.querySelector('[data-tour="plan"]'); if(el) el.scrollIntoView({block:'start'}); }, 260); return; }
  if('stdetails' in d){ closeStory(); pushPage('mymoney'); return; }
  if('anaccept' in d){ const before = snap(), sg = suggestSplit(), turnedOn = mainPayOn();
    S.analyst.split = {must:sg.must, ess:sg.ess, fun:sg.fun, save:sg.save}; S.analyst.accepted = true;
    closeSheet(); renderAll(); undoable(before, `Split saved: Fun ${sg.fun}%, Saving ${sg.save}%. Saving is your payday rule${turnedOn ? ', now on' : ''}`);
    if(!S.billsConfirmed){ const n0 = NAVC.n; let tries = 0, go = () => { if(NAVC.n !== n0 || ++tries > 20) return; if(MQ.toast || sheetOpen()) return setTimeout(go, 400);
      if(S.analyst.on && !S.billsConfirmed && !stack.length) pushPage('bills'); }; setTimeout(go, 400); } return; }   // then one screen: what it found, lock the bills you must pay. It opens after the Undo toast is gone, so the toast never covers it
  if('splitopen' in d || ('plangear' in d && S.analyst.on && S.analyst.accepted)){ UNDO.base = snap(); S._split = {fun:splitView(S, {forceRule:!S.analyst.accepted}).funPct, rule:savePlan(S, true).rulePct, inv:S.analyst.invest || 0}; sheet(SHEETS.splitedit()); return; }
  if('plangear' in d){ sheet(SHEETS.analyst()); return; }   // analyst off or split not chosen yet: the opt-in first
  if(d.splitinv){ S._split = S._split || {fun:S.analyst.split.fun, rule:savePlan(S, true).rulePct, inv:S.analyst.invest || 0};
    const v = splitView(S, {fun:S._split.fun, rule:S._split.rule, forceRule:!S.analyst.accepted}); S._split.inv = Math.max(0, Math.min(v.by.save.amt, (S._split.inv || 0) + +d.splitinv)); sheet(SHEETS.splitedit()); return; }
  if(d.splitstep){ const [k, n] = d.splitstep.split(':'); S._split = S._split || {fun:S.analyst.split.fun, rule:savePlan(S, true).rulePct};
    if(k === 'fun'){ const v = splitView(S, {fun:S._split.fun, rule:S._split.rule, forceRule:!S.analyst.accepted}), hi = Math.floor((v.by.fun.pct + v.by.ess.pct) / 5) * 5; S._split.fun = Math.min(hi, Math.max(0, S._split.fun + +n)); }
    else S._split.rule = Math.min(PAY_CAP, Math.max(5, S._split.rule + +n));
    sheet(SHEETS.splitedit()); return; }
  if('splitsuggest' in d){ S._split = {fun:suggestSplit().fun, rule:S._split ? S._split.rule : savePlan(S, true).rulePct, inv:S._split ? S._split.inv : (S.analyst.invest || 0)}; sheet(SHEETS.splitedit()); return; }
  if('splitsave' in d){ const sp = S._split; if(!sp) return; const before = UNDO.base || snap(), turnedOn = !S.analyst.accepted && !payOn(); UNDO.base = null;
    if(turnedOn || sp.rule !== payPct()) setPayTotal(sp.rule); S.analyst.split = {...S.analyst.split, fun:sp.fun}; S.analyst.accepted = true; S._split = null; syncSplit();
    const sv = splitView(); S.analyst.invest = Math.min(sp.inv !== undefined ? sp.inv : (S.analyst.invest || 0), sv.by.save.amt);
    closeSheet(); renderAll(); undoable(before, `Split saved: Fun ${sv.by.fun.pct}%, Saving ${sv.by.save.pct}%. Payday rule is now ${sp.rule}% of each salary`); return; }
  if(d.txcat !== undefined){ S._txi = +d.txcat; sheet(SHEETS.txcat()); return; }
  if(d.setcat){ const t = S.tx[S._txi]; if(!t) return; const before = snap(); t.cat = d.setcat; S.catRules[payeeKey(t)] = d.setcat; closeSheet(); renderAll();
    const u = splitUse(), cc = CATEGORY[d.setcat], b = cc[1], must = cc[2] === 'must', bud = b && !must && S.analyst.accepted ? splitBudget(b) : 0, pc = bud ? Math.round(u[b] / bud * 100) : 0;
    undoable(before, b ? `Moved to ${must ? 'Must-pay' : bucketName(b)}${bud ? ` · ${pc}% used` : ''}` : `Moved to ${cc[0]}`); return; }
  /* money in: payday rule, weekly transfer, round-ups */
  if('paymove' in d){   // every goal its own payday %, the 20 000 Ft floor on the total
    const A = paydayAlloc(), v = A.total;
    if(!v || acc('junior').v < v){ toast('Not enough money on your Junior account'); return; }
    const before = snap(); S.pdAsk = false; let counted = false; A.rows.forEach(r => { if(r.v > 0) counted = depositTo(r.g, r.v, 'junior', `Payday rule: ${r.pct}%`) || counted; });
    closeSheet(); renderAll(); if(pig3d && cur === 'hub') setTimeout(() => pig3d.celebrate(), 250);
    const to = A.rows.filter(r => r.v > 0); undoable(before, `${to.length > 1 ? to.map(r => `${ft(r.v)} to ${r.g.name}`).join(', ') : `${ft(v)} moved to ${to[0].g.name}`}.${counted ? ` 🔥 ${S.streak}-week streak` : ''}`); return;
  }
  if('prask' in d){ S.payday.ask = !S.payday.ask; sheet(SHEETS.payrule()); return; }
  if('prfloor' in d){ S.payday.floor = !S.payday.floor; sheet(SHEETS.payrule()); return; }
  if('keepreq' in d){ sheet(SHEETS.keepconfirm()); return; }
  if('keepok' in d){ closeSheet(); S.keep = {pending:true, at:S.months || 0}; renderAll(); tab('hub'); toast('Request sent. Waiting for your first salary at OTP');
    if(S._ffRest){ const r = S._ffRest; S._ffRest = 0; setTimeout(() => fastForward(r, 'year'), 1400); }   // the year jump carries on after the Junior moment
    return; }
  if('keepcancel' in d){ S.keep = {pending:false, at:0}; renderAll(); toast('Request cancelled. Your Junior package ends on the date shown'); return; }
  if('yearstory' in d){ S._yearStory = true; openStory(); return; }
  if('ffdone' in d){ closeSheet(); tab('fooldal'); if(S._rw){ notify({title:'Persi · Persely', persi:true, body:`Reward earned: ${S._rw.rew.title}. ${S._rw.rew.why}.`, url:'hub'}); qSheet(() => SHEETS.reward(), 'reward'); } return; }
  if('ffgrad' in d){ closeSheet(); tab('hub'); pushPage('grad'); return; }
  if('ffyear' in d){ closeSheet(); tab('hub'); pushPage('year'); return; }
  if('raise' in d){ const g = ruleGoal(); if(!goalIsPlain(g)) return; const r = ownRules(g), x = Math.min(20, r.pay.pct + 5); if(payPctWith(g, x) > PAY_CAP){ toast(capText(payPctWith(g, x))); return; } const before = snap(); r.pay.pct = x; r.pay.on = true; syncSplit(); renderAll(); undoable(before, `Payday rule for ${g.name} is now ${x}%`); return; }
  if('insyes' in d){ const before = snap(), g = ruleGoal(); g.pace = (g.pace || 0) + (+d.insyes); S.insightUsed = true; renderAll(); undoable(before, `Done: ${ft(+d.insyes)} more a month goes to ${g.name}`); return; }
  if('insno' in d){ S.insightUsed = true; renderAll(); return; }
  if('remindtg' in d){ S.remind = !S.remind; renderAll(); toast(S.remind ? 'Weekly reminder on: Sunday 18:00' : 'Weekly reminder off'); return; }
  /* friends */
  if('frjoin' in d){ S.friendsOptIn = true; S.friendsOpen = true; save(); renderAll(); sheet(SHEETS.addfriend()); return; }
  if('frtoggle' in d){ S.friendsOpen = !S.friendsOpen; save(); renderAll(); return; }
  if(d.nudge){ toast(`Reminder sent to ${d.nudge}`); return; }
  if('invite' in d){ toast('Invite link copied. Send it in any chat'); return; }
  if(d.addfriend){
    const p = SUGGEST.find(x => x.n === d.addfriend);
    if(p && !S.friends.some(f => f.n === p.n)) S.friends.push({...p});
    renderAll(); sheet(SHEETS.addfriend()); toast(`${d.addfriend} added`); return;
  }
  /* tour, story */
  if('tourstart' in d){ showHints(); return; }
  if('story' in d){ openStory(); return; }
  if('stclose' in d){ closeStory(); return; }
  if('stpause' in d){ stHold('user', !ST.hold.has('user')); return; }
  if('stgoal' in d){ const g = goalById(d.stgoal); if(!g) return; closeStory(); S._detail = g.id; pushPage('goal'); return; }   // Pick a new date on the progress slide: the story closes, the goal page opens (its date and Behind fix are there)
  if('stshare' in d){ demoToast('Share'); return; }
  /* update pop-up + onboarding */
  if(d.wnpick){ S.updateSeen = true; save(); closeWhatsNew(); startOnb(d.wnpick); return; }
  if('wnlater' in d){ S.updateSeen = true; save(); closeWhatsNew(); toast('You can set it up any time in the Persely tab'); return; }
  /* saving rules sheet (master): switch, amount and goal, each change saves at once with a 10 s Undo */
  /* saving rules: the overview sheet (read only). A link that names one rule opens the goal that has it when only one does, else the overview */
  if('saverules' in d){ const k = d.saverules || '', has = k ? plainGoals().filter(g => rulesOf(g)[k] && rulesOf(g)[k].on) : [];
    if(has.length === 1){ openGoalRules(has[0].id, k); return; }
    S._srf = k; sheet(SHEETS.saverules()); const b = $(`#sheet [data-srblock="${S._srf}"]`); if(b) b.scrollIntoView({block:'nearest'}); return; }
  if(d.goalrules){ openGoalRules(d.goalrules); return; }
  // Settings > Persely > Default saving rules for new goals (existing goals never change)
  if(d.rdpct !== undefined || d.rdwk !== undefined || d.rdday){ const dd = ruleDefaults(), before = snap(); let msg = '';
    if(d.rdpct !== undefined){ dd.pct = +d.rdpct; msg = `New goals: payday rule ${dd.pct ? dd.pct + '%' : 'off'}`; }
    else if(d.rdwk !== undefined){ dd.wkAmt = +d.rdwk; msg = `New goals: weekly transfer ${dd.wkAmt ? ft(dd.wkAmt) : 'off'}`; }
    else if(WK_DAYS.some(x => x[0] === d.rdday)){ dd.wkDay = d.rdday; msg = `New goals: weekly transfer on ${dayName(dd.wkDay)}`; }
    renderAll(); undoable(before, msg); return; }
  if('onbstart' in d){ sheet(SHEETS.newgoal()); return; }
  if(d.tilepick){ if(S.goals.length >= 5){ toast('You can have up to 5 Perselys'); return; } if(sheetOpen()) closeSheet(); startOnb(d.tilepick); return; }
  if('onbresume' in d){ if(!S.draft) return; if(sheetOpen()) closeSheet(); startOnb(S.draft.key, true); return; }
  if('setuplater' in d){ SETUP_COLLAPSED = true; renderView('hub'); return; }
  if('setupopen' in d){ SETUP_COLLAPSED = false; renderView('hub'); return; }
  if('onbnext' in d){
    if(STEPS[O.i] === 'goal'){ keepOnbName(); const r = onbGate(); if(r){ gateSync(); return; } }
    if(STEPS[O.i] === 'how' && onbCapGate()){ renderOnb(); return; }   // payday rules over the cap: the step says why and waits
    O.i = Math.min(STEPS.length - 1, O.i + 1); renderOnb(); const sc = $('#onb .onb-body'); if(sc) sc.scrollTop = 0; return;
  }
  if('onbback' in d){ keepOnbName();
    if(O.i > 0){ O.i--; renderOnb(); return; }
    closeOnb(); if(S.goals.length) sheet(SHEETS.newgoal()); else { SETUP_COLLAPSED = false; tab('hub'); } return; }   // step 1: the Back arrow returns to the tiles
  if('onbquit' in d){ keepOnbName(); sheet(SHEETS.draftq()); return; }
  if('onbdraft' in d){
    if(d.onbdraft === '1'){ S.draft = {key:O.key, ic:O.ic, name:cleanName(O.name), target:O.target, typeAmt:O.typeAmt, date:O.date, payOn:O.payOn, pct:O.pct, weeklyOn:O.weeklyOn, weekly:O.weekly, day:O.day, roundOn:O.roundOn}; closeSheet(); closeOnb(); renderAll(); toast('Draft saved. Pick it up from the Persely tab'); }
    else { S.draft = null; closeSheet(); closeOnb(); renderAll(); toast('You can set it up any time in the Persely tab'); }
    return; }
  if('onbpay' in d && !d.onbpay){ O.payOn = !O.payOn; renderOnb(); return; }
  if('onbwk' in d && !d.onbwk){ O.weeklyOn = !O.weeklyOn; renderOnb(); return; }
  if('onbrr' in d){ O.roundOn = !O.roundOn; renderOnb(); return; }
  if(d.onbpct){ O.pct = +d.onbpct; renderOnb(); return; }
  if(d.onbweekly){ O.weekly = +d.onbweekly; O.weeklyOn = true; renderOnb(); return; }
  if(d.onbday){ if(WK_DAYS.some(x => x[0] === d.onbday)) O.day = d.onbday; renderOnb(); return; }
  if(d.onbboost){ O.weeklyOn = true; O.weekly = +d.onbboost; renderOnb(); toast(`Weekly transfer set to ${ft(O.weekly)}`); return; }
  if('onbcreate' in d){
    if(S.goals.length >= 5){ toast('You can have up to 5 Perselys'); return; }
    const r = applyOnb(), g = r.g;
    closeOnb(); renderAll(); S._detail = g.id; S._hl = g.id; pushPage('goal'); setTimeout(() => { if(S._hl === g.id) S._hl = ''; }, 3200);   // the new goal's page, the goal highlighted
    toast(`${g.name} created. No money has moved.${r.notes.length ? ' ' + r.notes.join('. ') + '.' : ''}`);
    if(r.first){   // first goal only: "Start your streak?" with an empty amount, then the soft reminder question
      qSheet(() => { if(!goalById(g.id)) return ''; S._goal = g.id; S._amt = 0; S._fa = true; return SHEETS.hubsave(); }, 'firstadd', true);
      qSheet(() => SHEETS.nudge(), 'nudge', true); }
    return;
  }
  if('nudgeon' in d){ S.remind = true; closeSheet(); enablePush(); return; }   // the system permission is asked here and nowhere else
  if('nudgeoff' in d){ S.remind = false; closeSheet(); toast('No reminder. You can turn it on from the streak card'); return; }
});
/* goal step pickers: slider drag and keys, typed amount, swipe-down on the month sheet */
let PKD = null;
const pkKind = el => { const r = el.closest('[data-pk]'); return r ? r.dataset.pk : 'onb'; };
function pkDrag(e){
  const r = PKD.inn.getBoundingClientRect(), v = pkVal((e.clientX - r.left) / r.width);
  if(v !== pkObj(PKD.k).target){ pkSet(PKD.k, v); PKD.moved = true; }
}
document.addEventListener('pointerdown', e => {
  const s = e.target.closest && e.target.closest('.pksl'); if(s){
    PKD = {s, inn:s.querySelector('.pkin'), k:pkKind(s), moved:false}; try{ s.setPointerCapture(e.pointerId); }catch(x){}
    s.focus({preventScroll:true}); pkDrag(e); return; }
  const m = e.target.closest && e.target.closest('#sheet'); if(m && m.querySelector('.pkm') && !e.target.closest('.btn')) PKD = {sw:true, y:e.clientY, id:e.pointerId, dy:0, el:$('#sheet')};
});
document.addEventListener('pointermove', e => {
  if(!PKD) return;
  if(PKD.sw){ const dy = e.clientY - PKD.y; if(!PKD.cap && dy > 10){ PKD.cap = true; try{ PKD.el.setPointerCapture(PKD.id); }catch(x){} }
    if(PKD.cap){ PKD.dy = Math.max(0, dy); PKD.el.style.transform = `translateY(${PKD.dy}px)`; PKD.el.style.transition = 'none'; } return; }
  pkDrag(e);
});
const pkUp = e => {
  if(!PKD) return; const p = PKD; PKD = null;
  if(p.sw){ if(p.cap){ p.el.style.transition = 'transform .18s ease-out'; if(p.dy > 70 && e.type === 'pointerup'){ closeSheet(); setTimeout(() => { p.el.style.transform = ''; p.el.style.transition = ''; }, 300); } else { p.el.style.transform = ''; setTimeout(() => { p.el.style.transition = ''; }, 200); } } return; }
  if(p.moved && e.type === 'pointerup') coinSound();
};
document.addEventListener('pointerup', pkUp); document.addEventListener('pointercancel', pkUp);
document.addEventListener('keydown', e => {
  const s = e.target.closest && e.target.closest('.pksl'); if(s){
    const k = pkKind(s), v = pkObj(k).target, n = pkIdx(v), st = {ArrowRight:1, ArrowUp:1, ArrowLeft:-1, ArrowDown:-1, PageUp:10, PageDown:-10}[e.key];
    let nv = null;
    if(st){ const t = st > 0 ? Math.floor(n + 1e-9) + st : Math.ceil(n - 1e-9) + st; nv = pkAt(Math.max(0, Math.min(PK_N, t))); if(v > PK_MAX && st < 0) nv = PK_MAX; if(v > PK_MAX && st > 0) nv = v; }
    else if(e.key === 'Home') nv = PK_MIN; else if(e.key === 'End') nv = PK_MAX;
    if(nv !== null){ e.preventDefault(); if(nv !== v) pkSet(k, nv); } return; }
  if(e.key === 'Enter' && e.target.classList && e.target.classList.contains('pkamt')){ e.preventDefault(); e.target.blur(); }
});
document.addEventListener('input', e => { if(e.target && e.target.id === 'txq'){ txQ = e.target.value; txN = TX_STEP; txRefresh(); } });   // Transactions search: only the list is redrawn, the field keeps its focus
document.addEventListener('input', e => {
  const t = e.target; if(!t.classList || !t.classList.contains('pkamt')) return;
  const before = t.value.slice(0, t.selectionStart || 0).replace(/\D/g, '').length, n = +t.value.replace(/\D/g, '').slice(0, 8) || 0;
  t.value = n ? pkSpace(n) : '';
  let pos = 0, seen = 0; while(pos < t.value.length && seen < before){ if(/\d/.test(t.value[pos])) seen++; pos++; }
  try{ t.setSelectionRange(pos, pos); }catch(x){}
  pkSet(pkKind(t), n, 'type');
});
document.addEventListener('focusout', e => {
  const t = e.target; if(!t.classList || !t.classList.contains('pkamt')) return;
  const k = pkKind(t); if(typeof gateSync === 'function') gateSync();   // below the minimum: the line says so and Next waits (no silent change)
});
document.addEventListener('input', e => { const t = e.target; if(t && t.id === 'mv' && /\D/.test(t.value)) t.value = t.value.replace(/\D/g, ''); });   // Add money: digits only
const amt = () => parseFloat((($('#mv') && $('#mv').value) || '').replace(/[^\d.]/g,'')) || 0;
const keepAmt = () => { if($('#mv')) S._amt = amt(); };
/* ---- one error style, one wording: inline under the field; one review step for a money out above REVIEW_OVER ---- */
const E_NAME = 'Enter a name', E_ACC = 'Check the account number (16 or 24 digits)', E_AMT = 'Enter an amount', E_FUNDS = 'Not enough money on Junior account';
const ferr = (id, msg) => { const e = $('#e-' + id), f = $('#' + id); if(!e || !f){ toast(msg); return false; }
  e.textContent = msg; f.setAttribute('aria-invalid', 'true'); const w = f.closest('.fld'); if(w) w.classList.add('bad'); return false; };
const ferrClear = id => document.querySelectorAll('#sheet .ferr').forEach(e => { if(id && e.id !== 'e-' + id) return; e.textContent = ''; const f = $('#' + e.id.slice(2)); if(f){ f.removeAttribute('aria-invalid'); const w = f.closest('.fld'); if(w) w.classList.remove('bad'); } });
let PEND = null;
function askInline(text, ok){ const c = $('#cfm'); if(!c){ ok(); return; } PEND = {ok};
  c.innerHTML = `<div class="cfm" role="group" aria-label="Review"><p>${esc(text)}</p><button class="btn" data-cfmok>Confirm</button><button class="btn ghost" data-cfmback>Back</button></div>`;
  const b = $('#sheet .pbtn'); if(b) b.style.display = 'none'; const ok2 = $('#sheet [data-cfmok]'); if(ok2){ ok2.scrollIntoView({block:'nearest'}); try{ ok2.focus({preventScroll:true}); }catch(e){} } }
function cfmBack(){ PEND = null; const c = $('#cfm'); if(c) c.innerHTML = ''; const b = $('#sheet .pbtn'); if(b) b.style.display = ''; }
document.addEventListener('input', e => { const t = e.target; if(!t || !t.closest || !t.closest('#sheet')) return; if(t.id) ferrClear(t.id); if(PEND) cfmBack(); });
const keepOnbName = () => { if($('#onbName')) O.name = $('#onbName').value; };
document.addEventListener('input', e => {   // Edit goal: Save waits until the name has a letter in it, and says why
  if(e.target.id !== 'cgName' || !S._draft) return;
  S._draft.name = e.target.value; gateSync();
});
const keepCgName = () => { if($('#cgName') && S._draft) S._draft.name = $('#cgName').value; };
let shNameKeep = '';
const keepShName = () => { if($('#shName')) shNameKeep = $('#shName').value; };
const restoreShName = () => { if($('#shName') && shNameKeep) $('#shName').value = shNameKeep; };

/* ================= app feel: nothing moves except the lists =================
   iPhone drags the whole page when a finger moves on a part that cannot scroll
   (tab bar, headers). Block that; let only real scroll areas move. */
document.addEventListener('touchmove', e=>{
  if(e.touches.length > 1) return;
  if(e.target.closest && e.target.closest('input')) return;   // sliders must stay draggable
  for(let n = e.target; n && n !== document.body; n = n.parentElement){
    if(n.classList && (n.classList.contains('tabbar') || n.classList.contains('ph') || n.classList.contains('pig3d'))) { e.preventDefault(); return; }
    const cs = getComputedStyle(n);
    if((/(auto|scroll)/.test(cs.overflowY) && n.scrollHeight > n.clientHeight) ||
       (/(auto|scroll)/.test(cs.overflowX) && n.scrollWidth > n.clientWidth)) return;
  }
  e.preventDefault();
}, { passive:false });

/* ================= push notifications ================= */
const PUSH = { supported:false, standalone:false, ios:false, perm:'default', on:false };
function pushInfo(){
  PUSH.supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  PUSH.standalone = navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
  PUSH.ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1);
  PUSH.perm = 'Notification' in window ? Notification.permission : 'default';
}
async function pushRefresh(){
  pushInfo();
  try{
    if(PUSH.supported && PUSH.perm==='granted'){
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      PUSH.on = !!sub;
      if(sub) fetch('api/subscribe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(sub)}).catch(()=>{});
    } else PUSH.on = false;
  }catch(e){ PUSH.on = false; }
  refreshPages();
}
/* reminders row (streak card, onboarding step 3): never a dead end. Off: say what is lost and offer Turn on. Denied or no push (offline demo): say you can still save, no button. */
function remindRow(){
  pushInfo(); if(PUSH.on || PUSH.perm === 'granted') return '';
  const can = PUSH.supported && !window.__STANDALONE && PUSH.perm !== 'denied' && (PUSH.standalone || !PUSH.ios);
  const txt = can ? '<b>Reminders are off.</b> Turn on notifications to get your Sunday reminder.' : PUSH.ios && !PUSH.standalone && PUSH.perm !== 'denied' && !window.__STANDALONE ? '<b>No reminders yet:</b> add the app to your Home Screen to get them. You can still save any time.' : PUSH.perm === 'denied' ? '<b>No reminders:</b> you can still save any time. To get them back, allow notifications for this app in your phone Settings.' : '<b>No reminders:</b> you can still save any time.';
  return `<div class="rem"><span class="rem-i">${I('bell', 18)}</span><span class="rem-t">${txt}</span>${can ? '<button class="btn sm rem-b" data-pushon>Turn on</button>' : ''}</div>`;
}
const b64 = s => { const p='='.repeat((4-s.length%4)%4), r=atob((s+p).replace(/-/g,'+').replace(/_/g,'/')); return Uint8Array.from([...r].map(c=>c.charCodeAt(0))); };
async function enablePush(){
  pushInfo();
  if(!PUSH.supported){ toast("This browser doesn't support push notifications"); return; }
  // iOS: the permission prompt must be the first thing after the tap
  const perm = await Notification.requestPermission();
  PUSH.perm = perm;
  if(perm !== 'granted'){ refreshPages(); renderAll(); if($('#onb').classList.contains('on')) renderOnb(); return; }   // no toast: the Reminders row says what is off, here and on the streak card
  try{
    const reg = await navigator.serviceWorker.ready;
    const { publicKey } = await (await fetch('api/vapid')).json();
    const sub = (await reg.pushManager.getSubscription()) || await reg.pushManager.subscribe({ userVisibleOnly:true, applicationServerKey:b64(publicKey) });
    const r = await fetch('api/subscribe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(sub)});
    if(!r.ok) throw new Error('server');
    PUSH.on = true; renderAll(); if($('#onb').classList.contains('on')) renderOnb(); toast('Notifications turned on');
  }catch(e){ toast("Couldn't turn them on. Check your internet connection."); }
  refreshPages();
}
async function testPush(){
  try{
    const sub = await (await navigator.serviceWorker.ready).pushManager.getSubscription();
    if(!sub){ PUSH.on=false; refreshPages(); return; }
    const r = await fetch('api/test',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({endpoint:sub.endpoint, delay:5})});
    if(r.status===404){ await fetch('api/subscribe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(sub)}); return testPush(); }
    toast('The notification arrives in 5 seconds. Lock your phone now.');
  }catch(e){ toast("Can't reach the server"); }
}

/* open the right screen when a notification is tapped (link like ./#persely) */
function routeHash(){
  const h = location.hash.slice(1); if(!h) return;
  if(h === 'story'){ tab('hub'); openStory(); }
  else if(h === 'payday'){ tab('hub'); if(payOn() || paydayBills()) setTimeout(() => sheet(SHEETS.payday()), 300); }
  else if(h === 'grad'){ tab('hub'); pushPage('grad'); }
  else if(TABS.some(t=>t[0]===h)) tab(h);
  else if(PAGES[h] || ROUTE_PAGE[h]){ tab('fooldal'); pushPage(h); }
  history.replaceState(null,'',location.pathname);
}
addEventListener('hashchange', routeHash);
document.addEventListener('change', e => { const f = e.target; if(!f || !f.dataset || !f.dataset.qh || !/^\d\d:\d\d$/.test(f.value)) return; S.notif[f.dataset.qh] = f.value; save(); refreshPages(); });

/* ================= keep headers below the iPhone status bar =================
   New iOS shows the page under the status bar, and taps there go to iOS, not to the page.
   Measure the real safe area; if iOS reports 0 while in the browser, use a safe minimum. */
function setTop(){
  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;top:0;left:0;width:1px;visibility:hidden;height:env(safe-area-inset-top,0px)';
  document.body.appendChild(probe);
  const env = probe.offsetHeight; probe.remove();
  const iphone = /iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==='MacIntel' && navigator.maxTouchPoints>1 && !matchMedia('(min-width:760px) and (hover:hover)').matches);
  const standalone = navigator.standalone === true || matchMedia('(display-mode: standalone)').matches;
  // normal mode: iOS itself keeps the page below the clock, so only the real safe area is used
  document.documentElement.style.setProperty('--top', env + 'px');
}
setTop(); addEventListener('resize', setTop); addEventListener('orientationchange', ()=>setTimeout(setTop,300));

/* app height = the area the phone really gives the app (keeps the tab bar on the bottom edge) */
/* the iPhone frame shows only on a real desktop: wide, tall and with a mouse (same query as the CSS) */
const DESK = matchMedia('(min-width:760px) and (hover:hover)');
const isTyping = () => { const a = document.activeElement; return !!a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA') && !/^(range|checkbox|radio|button)$/.test(a.type); };
function setAppH(){
  const R = document.documentElement, vv = window.visualViewport;
  // keypad open (iOS: visual viewport shrinks, window.innerHeight does not): fit the app to the visible part and lift it by the scroll offset
  const kb = vv && !DESK.matches && vv.scale <= 1.01 && isTyping() && (window.innerHeight - vv.height - vv.offsetTop > 100 || window.innerHeight - vv.height > 100);
  R.classList.toggle('kb', !!kb);
  R.style.setProperty('--app-h', (kb ? vv.height : window.innerHeight) + 'px');
  R.style.setProperty('--vv-top', (kb ? vv.offsetTop : 0) + 'px');
  if(kb) keepFieldVisible();
}
let kvT = 0;
function keepFieldVisible(){
  clearTimeout(kvT);
  kvT = setTimeout(() => { const a = document.activeElement; if(a && isTyping()) a.scrollIntoView({block:'center', behavior:'smooth'}); }, 60);
}
setAppH(); addEventListener('resize', setAppH); addEventListener('orientationchange', ()=>setTimeout(setAppH,300));
if(window.visualViewport){ visualViewport.addEventListener('resize', setAppH); visualViewport.addEventListener('scroll', setAppH); }
addEventListener('focusin', () => { setTimeout(setAppH, 50); setTimeout(setAppH, 350); });   // keypad animation takes ~250ms
addEventListener('focusout', () => setTimeout(setAppH, 80));

/* ================= iPhone body: fit to window, live clock ================= */
function fit(){
  const d = $('#device');
  if(!DESK.matches){ d.style.transform=''; d.style.margin=''; return; }
  const s = Math.min(1, (innerHeight-80)/952, (innerWidth-40)/450);
  d.style.transform = `scale(${s})`;
  d.style.margin = `${-(952*(1-s))/2}px 0`; // remove empty space left by scaling
}
addEventListener('resize', fit); DESK.addEventListener?.('change', fit); DESK.addEventListener?.('change', setAppH); fit();
$('#rotate').innerHTML = `${pigSvg('happy',72)}<div class="rb"><b>Turn your phone upright</b><span>Persely works in portrait, like the OTP app.</span></div>`;
function clock(){ const n=new Date(); $('#clock').textContent = n.getHours()+':'+String(n.getMinutes()).padStart(2,'0'); }
clock(); setInterval(clock, 15000);

/* ================= mouse works like a finger: drag to scroll ================= */
(function(){
  let el=null, sx=0, sy=0, sl=0, st=0, moved=false, horiz=false;
  const phone = $('#phone');
  const scroller = (t, h) => {
    for(let n=t; n && n!==phone; n=n.parentElement){
      const cs = getComputedStyle(n);
      if(h && /(auto|scroll)/.test(cs.overflowX) && n.scrollWidth>n.clientWidth) return n;
      if(!h && /(auto|scroll)/.test(cs.overflowY) && n.scrollHeight>n.clientHeight) return n;
    }
    return null;
  };
  phone.addEventListener('pointerdown', e=>{
    if(e.pointerType!=='mouse' || e.button!==0 || e.target.closest('input,.pig3d')) return;
    el = e.target; sx=e.clientX; sy=e.clientY; moved=false; horiz=null;
  });
  addEventListener('pointermove', e=>{
    if(!el) return;
    const dx=e.clientX-sx, dy=e.clientY-sy, s=parseFloat(($('#device').style.transform.match(/[\d.]+/)||[1])[0])||1;
    if(!moved){
      if(Math.hypot(dx,dy)<6) return;
      horiz = Math.abs(dx)>Math.abs(dy);
      const sc = scroller(el, horiz) || (horiz ? null : scroller(el,false));
      if(!sc){ el=null; return; }
      el = sc; sl=sc.scrollLeft; st=sc.scrollTop; moved=true; phone.classList.add('drag');
      el.style.scrollSnapType='none';
    }
    if(horiz) el.scrollLeft = sl - dx/s; else el.scrollTop = st - dy/s;
  });
  addEventListener('pointerup', ()=>{
    if(moved && el){ el.style.scrollSnapType=''; setTimeout(()=>phone.classList.remove('drag'),0); }
    if(moved){ const kill = ev=>{ ev.stopPropagation(); ev.preventDefault(); }; addEventListener('click', kill, {capture:true, once:true}); setTimeout(()=>removeEventListener('click', kill, {capture:true}), 60); }
    el=null; moved=false;
  });
})();

