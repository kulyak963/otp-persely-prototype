/* ---------- console self-checks: window.__checkAnalytics() ---------- */
function __checkAnalytics(){
  hideBanners();   // a banner from an earlier run would hold every toast back
  const stack0 = stack.length;   // earlier checks open pages (goal page); they are closed again at the end so the app is left as it was
  const out = [], ok = (name, cond, info) => { out.push({name, pass:!!cond, info}); };
  // Simple Persely (js/14b): with the flag on, a check that tests the pre-Simple first run runs its old assertion on the legacy first run (SP_LEGACY, the same
  // screens as ?simple=0) AND an equivalent new-world assertion; with ?simple=0 only the old assertion runs, unchanged.
  const SPF = typeof spOn === 'function' && spOn();
  const legacyR = fn => { if(typeof SP_LEGACY === 'undefined') return fn(); const k = SP_LEGACY; SP_LEGACY = true; try{ return fn(); } finally { SP_LEGACY = k; } };
  const SPL0 = typeof SP_LEGACY !== 'undefined' ? SP_LEGACY : false, SP0 = typeof SP !== 'undefined' ? {...SP} : null; if(SP0) SP.dry = true;   // no real sound or vibration while checking
  const spLeg = on => { if(typeof SP_LEGACY !== 'undefined') SP_LEGACY = on ? true : SPL0; };
  // Phase 6, OTP Home (plan 2h): with OTP_HOME on, every check written before Phase 6 runs unchanged on the Home from before Phase 6 (the Home ?otphome=0 shows,
  // rendered in this page with OH_LEGACY), and the block "Phase 6: OTP Home" at the end runs the new-world equivalents with OH_LEGACY off.
  // With ?otphome=0 or ?simple=0 only the old set runs, exactly as before.
  const OHF = typeof ohOn === 'function' && ohOn(), OHL0 = typeof OH_LEGACY !== 'undefined' ? OH_LEGACY : false;
  const ohLeg = on => { if(typeof OH_LEGACY !== 'undefined') OH_LEGACY = on ? true : OHL0; };
  if(OHF) ohLeg(true);
  const spProbe = key => { spOpen(key); const h = $('#onb').innerHTML; O.sp = false; closeOnb(); return h; };   // the confirm screen of a tile, as HTML
  const tabAll = () => spOn() && S.goals.length && typeof moreHTML === 'function' ? vHub() + moreHTML() : vHub();
  const SIMPLE_NOTE = spOn() ? ' (simple tab: on its More page, one tap away)' : '';
  // a Persely row the old tab held: with SIMPLE_PERSELY it is on the More page, so open More (the tab's More row) and look there
  const viaMore = sel => { if(!spOn() || !S.goals.length || !/^#v-hub /.test(sel) || document.querySelector(sel)) return sel; const m = document.querySelector('#v-hub [data-go="persmore"]'); if(m) m.click(); return '#stack .page:last-child ' + sel.replace(/^#v-hub (\.prow |\.sec )?/, ''); };   // the Persely tab, and with SIMPLE_PERSELY its More page (goal cards, rows), one tap away
  const F = fresh('existing'), clone = () => JSON.parse(JSON.stringify(F));   // the old default seed: the existing user
  const det = detectRecurring(F), keys = det.bills.map(b => b.key), want = {'SZABÓ DÓRA':42000, 'MVM NEXT ENERGIAKERESKEDŐ':3600, 'FŐGÁZ ZRT.':2400, 'DIGI KFT.':4000, 'BKK ZRT. DIÁKBÉRLET':3450, 'YETTEL MAGYARORSZÁG':5550, 'NETFLIX':3490, 'SPOTIFY':1790};
  Object.entries(want).forEach(([k, v]) => { const b = det.bills.find(x => x.key === k); ok('bill found: ' + k, b && b.exp === v, b && b.exp); });
  ok('no other recurring payments (groceries, food, transport are not bills)', keys.length === Object.keys(want).length, keys);
  ok('income found: salary 75 000 and family 67 000', det.income.length === 2 && det.income.some(i => i.key === 'SALARY' && i.exp === 75000 && i.day === 5) && det.income.some(i => i.key === 'KISS ISTVÁN' && i.exp === FAMILY_AMT && i.day === 1), det.income.map(i => i.key));
  ok('locked by default: 6 must-pay bills, subscriptions not', F.bills.filter(b => b.locked).length === 6 && F.bills.filter(b => !b.locked).every(b => CATEGORY[b.cat][2] === 'subs'));
  const p = project(F), sum = o => Object.values(o).reduce((a, b) => a + b, 0);
  ok('projection proportions add to 100%', sum(p.pct) === 100, p.pct);
  const sv0 = splitView(F, {forceRule:true}), pcs = k => sv0.by[k].pct;
  ok('one base, four buckets: suggested split is Must-pay 42 / Everyday essentials 33 / Fun 20 / Saving 5, adds to 100%, amounts add to the base 145 000', pcs('must') === 42 && pcs('ess') === 33 && pcs('fun') === 20 && pcs('save') === 5 && sum({a:pcs('must'), b:pcs('ess'), c:pcs('fun'), d:pcs('save')}) === 100 && sv0.rows.reduce((a, r) => a + r.amt, 0) === sv0.B && sv0.B === 145000 && sv0.by.must.amt === 61000 && sv0.by.save.amt === 7500, sv0.rows.map(r => [r.k, r.pct, r.amt]));
  ok('projection: must-pay 61 000, everyday essentials 36 900, Fun 27 000', p.mustPay === 61000 && p.everyday === 36900 && p.fun === 27000, [p.mustPay, p.everyday, p.fun]);
  ok('projection: income 145 000, confidence 3 months, no deficit', p.income.total === 145000 && p.months === 3 && p.confidence.label === 'Based on 3 months' && p.deficit === 0, p.income);
  ok('one-off listed and left out (MEDIAMARKT)', p.oneOffs.length === 1 && p.oneOffs[0].name === 'MEDIAMARKT', p.oneOffs);
  const few = clone(); few.closedYm = ['2026-10']; ok('less history: "Based on 1 month, a rough guess", no percentages, amounts still add to the base', project(few).confidence.label === 'Based on 1 month, a rough guess' && sum(project(few).pct) === 100 && splitView(few).rough && bPct(splitView(few), 'fun') === '' && splitView(few).rows.reduce((a, r) => a + r.amt, 0) === splitView(few).B);
  ['2026-08', '2026-09', '2026-10', '2026-11'].forEach(ym => { const u = monthUse(ym, F), all = F.tx.filter(t => txWhen(t, F).ym === ym), s = all.reduce((a, t) => a + t.a, 0);
    ok('nothing counted twice ' + ym, u.count === all.length && u.income - u.spendTotal - u.own - u.cash - u.topup === s && u.sumA === s, [u.count, all.length]);
    ok('own-account moves are not spending or income ' + ym, u.own >= 4000 && !u.spend.saving && !u.spend.income && !u.spend.other_own); });
  ok('Persely/Savings rows never reach the projection categories', !p.cats.some(c => c.cat === 'saving' || c.cat === 'income'));
  const b0 = billsFirst(F); ok('bills first OFF by default (phone due in 6 days, balance covers it)', !b0.on && b0.total === 5550 && b0.count === 1, b0.text);
  const c1 = clone(); c1.tx = c1.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); const b1 = billsFirst(c1);
  ok('bills first ON when rent is not paid (window passed): headline counts the late rent only, the phone is coming up', b1.on && b1.total === 47550 && b1.lateTotal === 42000 && b1.late.length === 1 && b1.soonTotal === 5550 && b1.text === 'Rent share is late: ' + ft(42000) + ' (due on the 2nd)', b1.text);
  const c2 = clone(); c2.accounts.find(a => a.id === 'junior').v = 3000; const w2 = billsFirst(c2); ok('due soon and the balance cannot cover it: warning only, Bills first stays OFF (no push, no Fun hold-off)', !w2.on && w2.warn && w2.late.length === 0 && w2.text === '' && w2.soonTotal === 5550, w2);
  const c2b = clone(); c2b.tx = c2b.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); c2b.tx = c2b.tx.filter(t => !(t.n === 'YETTEL MAGYARORSZÁG' && t.ym === '2026-11')); ok('several late bills: headline "2 bills are late" with the late total, due-soon bills left out', (() => { c2b.bills.forEach(b => { if(b.key === 'YETTEL MAGYARORSZÁG') b.day = 3; }); const x = billsFirst(c2b); return x.on && x.late.length === 2 && x.text === '2 bills are late: ' + ft(47550); })());
  const c3 = clone(); c3.billSkip = {'szab-d-ra':'2026-11'}; c3.tx = c3.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); ok('"Not due this month" clears the card', !billsFirst(c3).on);
  const c4 = clone(); c4.tx = c4.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); c4.tx.unshift({ym:'2026-11', day:14, d:'14 November', n:'SZABÓ DÓRA', s:'Transfer out', a:-42000, ic:'wallet'}); ok('paying the rent turns it off again', !billsFirst(c4).on);
  const c5 = clone(); c5.tx.unshift({ym:'2026-11', day:14, d:'14 November', n:'YETTEL MAGYARORSZÁG', s:'Direct debit', a:-2000, ic:'wallet'}); ok('paid less than usual', billStatus(c5.bills.find(b => b.id === 'yettel-magyarorsz-g'), c5).st === 'less');
  const g = groceriesProtected(F); ok('groceries protected = lowest of 3 months (23 800)', g === 23800, g);
  const s0 = safeToSpend(F); ok('safe to spend = balance - unpaid bills - groceries left', s0.safe === 87450 - 5550 - (23800 - 5240) && s0.pocket === 0, s0);
  const c6 = clone(); c6.billsPocket = {on:true, bal:10000}; const s6 = safeToSpend(c6);
  ok('Bills pocket balance is excluded from safe to spend (it only covers bills)', s6.safe === s0.safe + 5550 && s6.pocket === 10000 && s6.safe < s6.balance, s6);
  const c7 = clone(); setMain(c7, 'pay', true); ok('saving rule (7 500) less the 4 000 already moved to Persely this month is taken out of safe to spend', safeToSpend(c7).savingRule === 3500 && safeToSpend(c7).safe === s0.safe - 3500, safeToSpend(c7));
  const T = (t, c) => classify(t, F) === c;
  ok('classify: merchant, card icon, reference text, Other', T({n:'LIDL MAGYARORSZÁG', s:'Card payment', a:-1, ic:'cart'}, 'groceries') && T({n:'SZABÓ DÓRA', s:'Transfer out', a:-1, ref:'albérlet'}, 'housing') && T({n:'XYZ BOLT', s:'Card payment', a:-1, ic:'food'}, 'transport') && T({n:'X', s:'Card payment', a:-1, ic:'food'}, 'food') && T({n:'TÓTH LILI', s:'Instant transfer', a:-1, ref:'mozi'}, 'other') && T({n:'PERSELY DEPOSIT', s:'Between my accounts', a:-1}, 'saving'));
  const c8 = clone(); c8.catRules = {'WOLT HUNGARY':'groceries'}; const w = {n:'WOLT HUNGARY', s:'Card payment', a:-1, ic:'food'};
  ok('classify: payee rule beats merchant, own choice beats payee rule', classify(w, c8) === 'groceries' && classify({...w, cat:'fun'}, c8) === 'fun');
  // step 10: proportions, bills before/after +1 month, alert on/off, nothing counted twice, Safe to spend without the pocket
  const sB = clone(); sB.tx = sB.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); setMain(sB, 'pay', true);
  ok('proportions add to 100% in the default state and after key B (rent not paid)', sum(project(F).pct) === 100 && sum(project(sB).pct) === 100 && project(sB).pct.left >= 0, [project(F).pct, project(sB).pct]);
  const pd = clone(); setMain(pd, 'pay', true); const pdp = project(pd);
  const pdr = clone(); setMain(pdr, 'pay', true); setMain(pdr, 'rr', true); const pdrp = project(pdr), p0 = project(F);
  ok('payday rule on: small positive amount left, no deficit', pdp.deficit === 0 && pdp.left >= 2000 && pdp.left <= 12000 && pdp.saving === 7500 && sum(pdp.pct) === 100, [pdp.left, pdp.deficit, pdp.pct]);
  ok('main demo state (payday rule and round-ups on, saving 10 500): 1 000 to 10 000 Ft left, no deficit; default state stays positive', pdrp.deficit === 0 && pdrp.left >= 1000 && pdrp.left <= 10000 && pdrp.saving === 7500 + ROUND_EST && p0.deficit === 0 && p0.left > 0 && sum(pdrp.pct) === 100, [pdrp.left, pdrp.deficit, p0.left]);
  const detB = detectRecurring(sB); ok('after key B: all 8 demo bills and both income lines are still found', Object.keys(want).every(k => detB.bills.some(b => b.key === k && b.exp === want[k])) && detB.income.length === 2, detB.bills.map(b => b.key));
  ok('alert: default OFF, after key B ON, after paying the rent OFF', !billsFirst(F).on && billsFirst(sB).on && (() => { const x = JSON.parse(JSON.stringify(sB)); x.tx.unshift({ym:'2026-11', day:14, d:'14 November', n:'SZABÓ DÓRA', s:'Transfer out', a:-42000, ic:'wallet'}); return !billsFirst(x).on; })());
  const sP = clone(), spB = safeToSpend(sP); sP.accounts.find(a => a.id === 'junior').v -= 61000; sP.billsPocket = {on:true, bal:61000}; sP.tx.unshift({ym:'2026-11', day:14, d:'Today', n:'BILLS POCKET', s:'Between my accounts', a:-61000, ic:'wallet'});
  const spA = safeToSpend(sP), uP = monthUse('2026-11', sP), uF = monthUse('2026-11', F);
  ok('Safe to spend excludes the pocket: = Junior balance - unpaid bills not covered by the pocket - rule - groceries', spA.safe === balanceOf(sP) - spA.unpaidBills - spA.savingRule - spA.groceries && spA.safe === spB.safe - 61000 + 5550 && spA.pocket === 61000, [spB, spA]);
  ok('Bills pocket move is an own-account row: income and spending unchanged, nothing counted twice', uP.income === uF.income && uP.spendTotal === uF.spendTotal && uP.own === uF.own + 61000 && uP.income - uP.spendTotal - uP.own - uP.cash - uP.topup === uP.sumA, [uP, uF]);
  // steps 6-9 and 12 run against a copy of the app state, then the real state is put back
  const keep = S; try{
    S = clone(); S.analyst.on = true; S.onboarded = true; ok('suggestSplit comes from the projection: 42 / 33 / 20 / 5', (() => { const g = suggestSplit(); return g.must === 42 && g.ess === 33 && g.fun === 20 && g.save === 5; })(), suggestSplit());
    // every screen reads the same four buckets: analyst sheet, My split, Next month, editor, Persely tab row (the story carries no bucket figures, so it cannot disagree). The text on screen must carry the same percentages and amounts.
    const agree = (label) => { const v = curView(); let bad = [];
      const txt = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
      const sheetT = txt(SHEETS.analyst()), nextT = txt(nextMonthHTML()), splitT = S.analyst.accepted ? txt(splitCard()) : '';
      const nz = x => x.replace(/\s+/g, ' ');
      v.rows.forEach(r => { const pc = bPct(v, r.k), a = nz(ft(r.amt));
        if(!(sheetT.includes(`${r.name} ${pc ? pc + ' · ' : ''}${a}`) || sheetT.includes(`${r.name} `) && sheetT.includes(`${pc ? pc + ' · ' : ''}${a}`))) bad.push('sheet ' + r.k);
        if(!(nextT.includes(r.name) && nextT.includes(`${pc} ${a}`.trim()))) bad.push('next ' + r.k);
        if(S.analyst.accepted && !(splitT.includes(`${r.name}${pc ? ' · ' + pc : ''}`) && splitT.includes(`of ${a}`))) bad.push('split ' + r.k); });
      const slide = (() => { const sl = storySlides(); return !sl.some(x => ['next', 'donut', 'inout'].includes(x.id)) && !v.rows.some(r => sl.some(x => x.build && txt(x.build()).includes(r.name + ' ' + bPct(v, r.k)))); })();   // the Wrapped story has no split slide: no second copy of the bucket figures
      if(!slide) bad.push('story has a split slide');
      const tot = v.rows.reduce((a, r) => a + r.amt, 0), pt = v.rows.reduce((a, r) => a + r.pct, 0), saveOK = v.by.save.amt === savePlan(S, !S.analyst.accepted).total || (savePlan(S, !S.analyst.accepted).total === 0);
      if(tot !== v.B) bad.push('amounts ' + tot + ' != ' + v.B); if(!v.rough && pt !== 100) bad.push('pct sum ' + pt); if(!saveOK) bad.push('saving != rules');
      return bad; };
    S.analyst.accepted = false; ok('all screens agree: default, analyst on (suggestion), Saving = payday rule + weekly + round-ups', (() => { setMain(S, 'pay', false); const b = agree(); return b.length === 0; })(), agree());
    S.analyst.accepted = true; setMain(S, 'pay', true); syncSplit(); ok('all screens agree: after Use this split (payday rule on, 7 500 Ft = 10% of the salary)', agree().length === 0 && splitView().by.save.amt === 7500 && splitCard().replace(/\s/g, ' ').includes('7 500 Ft = 10% of your salary'), agree());
    setMain(S, 'wk', true); setMain(S, 'rr', true); syncSplit(); ok('Saving = payday rule + weekly transfer + round-ups, shown the same on every screen', (() => { const v = splitView(), pl = savePlan(); return v.by.save.amt === pl.rule + pl.weekly + pl.round && pl.weekly > 0 && pl.round > 0 && agree().length === 0 && splitCard().includes('weekly transfer') && splitCard().includes('round-ups') && (S.goals.some(g => g.weekly) || moneyIn().total === savePlan().total); })(), agree());
    setMain(S, 'wk', false); setMain(S, 'rr', false); syncSplit();
    S.tx = S.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); ok('all screens agree after key B (rent unpaid)', agree().length === 0 && splitView().by.must.amt === 61000, agree());
    { const x = JSON.parse(JSON.stringify(S)); S.billsPocket = {on:true, bal:61000}; ok('all screens agree after key O (Bills pocket 61 000)', agree().length === 0, agree()); S = x; }
    { const tr = S.tx.length; const d = JSON.parse(JSON.stringify(S)); S.analyst.split.fun = 25; syncSplit(); ok('all screens agree after Fun is changed to 25% (Everyday essentials gives way)', agree().length === 0 && splitView().by.fun.pct === 25 && splitView().by.ess.pct === 28, [agree(), splitView().rows.map(r => r.pct)]); S = d; syncSplit(); }
    S = clone(); S.analyst.on = true; S.onboarded = true;
    ok('bills first card, push text and Persi line when the rent is unpaid', (() => { S.tx = S.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); return bfNow().on && bfCard().includes('Rent share is late: ' + ft(42000) + ' (due on the 2nd)') && bfCard().includes('Coming up: Phone ' + ft(5550) + ' on the 20th') && persiSays().text === 'Rent share is late: ' + ft(42000) + ' (due on the 2nd).'; })());
    ok('analyst off: the bills-first card and the Persi line stay (bills stay on, D10); only the analyst parts go', (() => { S.analyst.on = false; const r = bfNow().on && bfCard() !== '' && persiSays().text.includes(bfNow().text) && !splitCard(); S.analyst.on = true; return r; })());
    S.billsPocket = {on:true, bal:61000}; const j0 = balanceOf(), r1 = payBill('szab-d-ra');
    ok('pay from the Bills pocket: pocket 61 000 -> 19 000, Junior balance untouched, rent paid, bills first off', r1.fromPocket && S.billsPocket.bal === 19000 && balanceOf() === j0 && !bfNow().on && billStatus(billById('szab-d-ra')).st === 'paid', [r1, S.billsPocket]);
    S = clone(); S.analyst.on = true; const j1 = balanceOf(); ok('move 61 000 Ft to the Bills pocket: Junior -61 000, pocket 61 000, an own-account row (not spending)', pocketMove(61000) && balanceOf() === j1 - 61000 && pocketBal() === 61000 && txType(S.tx[0]) === 'own' && safeToSpend().pocket === 61000);
    ok('pocket offer is the unpaid bills (47 550), not the month total (61 000), and 0 once the pocket holds it', pocketOffer() === 0 && (() => { S.billsPocket.bal = 0; const tx0 = S.tx; S.tx = S.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); const r = pocketOffer() === 47550 && mustTotal() === 61000; S.tx = tx0; return r; })());
    S = clone(); S.analyst = {on:true, accepted:true, split:{must:44, ess:31, fun:20, save:5}}; setMain(S, 'pay', true); S.billsConfirmed = true; monthStep(true);
    const uu = splitUse(), nb = billsFirst(), fam = S.tx.find(t => t.n === 'KISS ISTVÁN' && t.ym === ymAt(1));
    ok('+1 month: Everyday essentials 36 900 and Fun 27 000 are inside the split, reward earned, score 50 -> 75', uu.ess === 36900 && uu.fun === 27000 && !!S._rw && S._rw.essB >= 36900 && S._rw.funB >= 27000 && scoreNow().t === 75 && scorePrev().t === 50, [uu, scoreNow().t, S._rw]);
    ok('+1 month: family transfer on the 1st, bills paid on their days, only the phone still to come', fam && fam.a === FAMILY_AMT && fam.day === 1 && nb.total === 5550 && nb.count === 1 && !nb.on && S.tx.filter(t => t.ym === ymAt(1) && t.a < 0 && txType(t) !== 'card' && txType(t) !== 'own').length === 5, [nb.total, nb.count]);
    ok('after +1 month: all 8 demo bills found again, income still salary 75 000 + family 67 000, projection consistent', (() => { const d = detectRecurring(), pj = project(); return Object.keys(want).every(k => d.bills.some(b => b.key === k && b.exp === want[k])) && d.income.length === 2 && d.income.some(i => i.key === 'SALARY' && i.exp === 75000) && d.income.some(i => i.key === 'KISS ISTVÁN' && i.exp === FAMILY_AMT) && pj.income.recurring === 75000 + FAMILY_AMT && pj.mustPay === 61000 && pj.deficit === 0 && pj.left > 0; })(), detectRecurring().bills.map(b => b.key));
    ok('after +1 month: proportions add to 100%', sum(project().pct) === 100, project().pct);
    // no overspend on the demo path: the main demo rules (payday 10%, weekly 1 500 Ft, round-ups) after +1, +3, +10 and +12 months, plus the default, 8-weeks-later and rent-unpaid states
    { const keepS = S, path = {}, run = n => { S = clone(); S.analyst = {on:true, accepted:true, split:{must:42, ess:26, fun:20, save:12}}; setMain(S, 'pay', true); setMain(S, 'wk', true, {amt:1500}); setMain(S, 'rr', true); S.billsConfirmed = true; for(let i = 0; i < n; i++) monthStep(true); const q = project(); return {deficit:q.deficit, left:q.left, saving:q.saving}; };
      [1, 3, 10, 12].forEach(n => { path['+' + n] = run(n); });
      const dJ = (() => { S = clone(); setMain(S, 'pay', true); setMain(S, 'rr', true); const q = project(); return {deficit:q.deficit, left:q.left}; })(), dB = (() => { S = clone(); S.analyst.on = true; S.tx = S.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); const q = project(); return {deficit:q.deficit, left:q.left}; })(), d0 = project(F);
      ok('no state on the demo path shows a deficit: default, 8 weeks later, rent unpaid, +1, +3, +10 and +12 months all keep something left (full demo path: 1 000 to 5 000 Ft)', [d0, dJ, dB, ...Object.values(path)].every(x => x.deficit === 0 && x.left > 0) && Object.values(path).every(x => x.left <= 5000), {d0:[d0.deficit, d0.left], dJ, dB, path});
      S = keepS; }
    ok('after +1 month: nothing counted twice (every month in the window)', ['2026-09', '2026-10', '2026-11', '2026-12'].every(ym => { const u = monthUse(ym), all = S.tx.filter(t => txWhen(t).ym === ym), t = all.reduce((a, x) => a + x.a, 0); return u.count === all.length && u.income - u.spendTotal - u.own - u.cash - u.topup === t; }));
    S = clone(); S.analyst.on = true; S.tx = S.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); const was = bfNow().on, pr = payBill('szab-d-ra');
    ok('alert in the app: on after key B, off after Pay now rent', was && !pr.err && !bfNow().on && bfCard() === '', [was, pr]);
    // payday "Bills first" sheet: the amount moved is the unpaid amount, and the "Then:" line is what the balances show afterwards
    S = clone(); S.analyst.on = true; setMain(S, 'pay', true); S.tx = S.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11'));
    const P1 = paydayPlan(), jb = balanceOf(); pocketMove(P1.toMove);
    ok('payday sheet (key B, then P): moves exactly the unpaid 47 550 Ft (not 61 000), 7 500 Ft saving rule, 19 950 Ft free for Fun', P1.toMove === 47550 && P1.unpaid === 47550 && P1.rule === 7500 && P1.canSave && P1.left === 19950 && pocketBal() === 47550 && balanceOf() === jb - 47550 && paydayPlan().pocketEnough, P1);
    S = clone(); S.analyst.on = true; setMain(S, 'pay', true); S.billsPocket = {on:true, bal:61000}; const P2 = paydayPlan(); ok('payday sheet: pocket already holds enough -> nothing to move, saving action only', P2.pocketEnough && P2.toMove === 0 && P2.canSave && P2.left === 67500, P2);
    S = clone(); S.analyst.on = true; setMain(S, 'pay', true); S.tx = S.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); acc('junior').v = 30000; const P3 = paydayPlan(); ok('payday sheet: salary does not cover the bills -> covers 1 of 2, saving waits, moves only what it covers (5 550 Ft)', P3.partial && P3.coverN === 1 && P3.toMove === 5550 && !P3.canSave, P3);
    S = clone(); S.analyst.on = true; S.billSkip = {}; mustBills().forEach(b => { S.billSkip[b.id] = billToday().ym; }); ok('payday sheet: no unpaid bills -> the normal payday sheet', !paydayBills() && !SHEETS.payday().includes('Bills still to pay'));
    // change 5 and 12: one entry path per analytics page from each tab, Friends opt-in
    { const cnt = (h, k) => (h.match(new RegExp('data-go="' + k + '"', 'g')) || []).length, sheets = (h, k) => (h.match(new RegExp('data-sheet="' + k + '"', 'g')) || []).length, keepF = NEW_PERSELY_IA;
      S = clone(); S.analyst = {on:true, accepted:true, split:{must:44, ess:31, fun:20, save:5}}; S.onboarded = true; S.billsConfirmed = true; syncSplit();
      const H = vFooldal(), P = vHub(), mm = myMoneyHTML(), an = SHEETS.analyst(), PM = SIMPLE_PERSELY ? moreHTML() : P;   // SIMPLE_PERSELY: the Persely rows live on the More page (PM), the tab holds none
      if(keepF){
        ok('one entry path: Home reaches Spending from Safe to spend and Details only (the one page), has no direct link to Next month or Must-pay bills (the Pay a bill shortcut is the one way to the bills list) and no Safe to spend sheet', cnt(H, 'mymoney') === 2 && cnt(H, 'nextmonth') === 0 && cnt(H, 'bills') === 1 && sheets(H, 'safe') === 0, [cnt(H, 'mymoney'), cnt(H, 'nextmonth'), cnt(H, 'bills'), sheets(H, 'safe')]);
        ok(SIMPLE_PERSELY ? 'one entry path: the Persely More page has one Spending row, the tab none, and neither has a split, bills or Next month block (More has only the one Bills row in its Account group, plan 2h)' : 'one entry path: the Persely tab has one Spending row and no split, bills or Next month block', cnt(PM, 'mymoney') === 1 && (!SIMPLE_PERSELY || cnt(P, 'mymoney') === 0) && cnt(P + PM, 'kiadas') === 0 && cnt(P + PM, 'nextmonth') === 0 && cnt(P + PM, 'bills') === (SIMPLE_PERSELY ? 1 : 0) && (!SIMPLE_PERSELY || /data-go="bills" data-more="bills"/.test(PM)) && sheets(P + PM, 'safe') === 0 && !/data-splitopen/.test(P + PM) && !/Bills and next month/.test(P + PM), [cnt(PM, 'mymoney'), cnt(P, 'mymoney'), cnt(PM, 'nextmonth'), cnt(PM, 'bills')]);
        ok('Spending page holds Safe to spend, Bills, My plan and Next month, each once, and no second copy of the four buckets (no My split, no Bills pocket block)', sheets(mm, 'safe') === 1 && !/My split/.test(mm) && cnt(mm, 'nextmonth') === 1 && cnt(mm, 'bills') === 1 && (mm.match(/My plan for/g) || []).length === 1 && (mm.replace(/<[^>]+>/g, ' ').match(/Everyday essentials/g) || []).length <= 2 && !/Bills pocket/.test(mm), [cnt(mm, 'nextmonth'), cnt(mm, 'bills'), (mm.replace(/<[^>]+>/g, ' ').match(/Everyday essentials/g) || []).length]);
        ok('analyst sheet (on): one button to Spending, none to Next month or Must-pay bills', cnt(an, 'mymoney') === 1 && cnt(an, 'nextmonth') === 0 && cnt(an, 'bills') === 0);
        ok(SIMPLE_PERSELY ? 'Persely More page row shows what is spent of what is planned, from the data (the row is on More, not on the tab)' : 'Persely tab row shows what is spent of what is planned, from the data', (!SIMPLE_PERSELY || (PM.includes(analysisRow()) && !P.includes(analysisRow()))) && (() => { const v = splitView(), t = analysisRow().replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '); return t.includes('Spending') && t.includes(`Card spending ${ft(sumVals(catSpend(shownMonth().ym)))} of ${ft(v.by.ess.amt + v.by.fun.amt)} planned`.replace(/\s+/g, ' ')) && !/My money/.test(P + mm + an); })(), analysisRow());
        S.analyst.on = false; const Poff = SIMPLE_PERSELY ? moreHTML() : vHub();
        ok((SIMPLE_PERSELY ? 'analyst off: the Persely More row (Spending) opens' : 'analyst off: the Persely tab row (Spending) opens') + ' the one Spending page, which offers Turn on in place of the plan and keeps Safe to spend (simple) and Bills; Home keeps its Safe to spend row', cnt(Poff, 'mymoney') === 1 && /Turn on to see your plan/.test(myMoneyHTML()) && /data-anon/.test(myMoneyHTML()) && sheets(myMoneyHTML(), 'safe') === 1 && /safebtn/.test(vFooldal())); S.analyst.on = true;
        const late = clone(); late.analyst = {on:true, accepted:true, split:{must:44, ess:31, fun:20, save:5}}; late.onboarded = true; late.tx = late.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); S = late;
        ok('late bill: the Bills first card stays on top of Home and is gone from the Persely tab (D13)', vFooldal().indexOf('Bills first') > -1 && vFooldal().indexOf('Bills first') < vFooldal().indexOf('Balance') && vHub().indexOf('Bills first') === -1);
      }
      // Money in panel, Spending, investing (UI plan: persely-home-ui-plan.md)
      { const keepS = S, plain = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '), forint = g => !g.shared && !isEur(g);
        S = clone(); S.onboarded = true; S.analyst = {on:true, accepted:true, split:{must:44, ess:31, fun:20, save:5}}; S.billsConfirmed = true; syncSplit(); S.ruleGoal = S.goals.find(forint).id; setMain(S, 'pay', true); setMain(S, 'wk', true); setMain(S, 'rr', true);
        const Pt = vHub(), fg = S.goals.filter(forint), PtM = SIMPLE_PERSELY ? moreHTML() : Pt;
        if(SIMPLE_PERSELY) ok('Persely tab and its More page: no rule switches, no Money in section header, one Money in row ("... a month moves in by itself"), one Spending row, both on More and none on the tab', !/data-sw="(payday|weekly|round)"/.test(Pt + PtM) && !/<div class="sec"[^>]*><span>Money in<\/span>/.test(Pt + PtM) && (PtM.match(/data-sheet="moneyin"/g) || []).length === 1 && /a month moves in by itself/.test(PtM) && !/data-sheet="moneyin"|class="card mgauge"/.test(Pt) && (PtM.match(/data-go="mymoney"/g) || []).length === 1 && !/data-go="mymoney"/.test(Pt) && /<b>Spending<\/b>/.test(PtM));
        else ok('Persely tab: no rule switches, no Money in section header, one small panel, one Spending row', !/data-sw="(payday|weekly|round)"/.test(Pt) && !/<div class="sec"[^>]*><span>Money in<\/span>/.test(Pt) && (Pt.match(/class="card mgauge"/g) || []).length === 1 && (Pt.match(/data-go="mymoney"/g) || []).length === 1 && /<b>Spending<\/b>/.test(Pt));
        ok('every forint goal page edits its own Payday rule, Round-ups and Weekly transfer (switches for this goal, no link to one global sheet) with a forecast line', fg.length > 0 && fg.every(g => { S._detail = g.id; const h = PAGES.goal.html(); return ['pay', 'rr', 'wk'].every(k => h.includes(`data-grtog="${k}:${g.id}"`)) && !/data-saverules|data-gpay|data-grr|data-gwk/.test(h) && /Saving rules for this goal/.test(h) && /class="fine grfc"/.test(h); }), fg.map(g => g.id));
        const mi = SHEETS.moneyin();
        ok('Money in sheet: one row for every forint, not shared goal, one payrule row, no switches', fg.every(g => mi.includes(`data-goal="${g.id}"`)) && (mi.match(/data-goal=/g) || []).length === fg.length && (mi.match(/data-sheet="payrule"/g) || []).length === 1 && !/data-sw|data-gpay|data-grr|data-gwk/.test(mi) && !/deadline/i.test(mi));
        const m = moneyIn();
        ok('Money in panel: the amount is the sum of what the rules move into every goal, and the panel shows it', m.total === S.goals.reduce((a, g) => a + paceOf(g) - (g.pace || 0), 0) && m.total > 0 && plain(moneyInPanel()).includes(ft(m.total).replace(/\s+/g, ' ')), [m.total, S.goals.map(g => paceOf(g) - (g.pace || 0))]);
        ok('Saving in the split equals Money in (own goal weekly transfers included), and the days left match the Spending circle', savePlan().total === m.total && daysLeftInMonth() === shownMonth().left, [savePlan().total, m.total]);
        { const on = moneyInPanel(); ok('Money in panel: the ring is decorative and the three lines are the screen text', /<svg[^>]*aria-hidden="true"/.test(on) && !/aria-label/.test(on) && /Money in each month/.test(on) && /<b class="num">/.test(on)); }
        S.goals.forEach(g => { if(g.rules){ g.rules.pay.on = false; g.rules.wk.on = false; g.rules.rr.on = false; } });
        const off = plain(moneyInPanel());
        ok('Money in panel: all rules off reads Nothing yet and asks for a rule on a goal page', off.includes('Nothing yet') && off.includes("Switch on a saving rule") && moneyIn().total === 0);
        { const keepG = S.goals; S.goals = []; ok('Money in panel: hidden with no goals', moneyInPanel() === ''); S.goals = keepG; }
        setMain(S, 'pay', true); S.payday.ask = true; S.goals.forEach(g => { g.date = null; });
        ok('Money in panel: no goal with a date, so no need line; payday asks first is said', (() => { const t = plain(moneyInPanel()); return !/goals need/.test(t) && !/Enough for every goal date/.test(t) && t.includes('Payday rule') && t.includes('payday asks first'); })());
        S = clone(); S.onboarded = true; S.analyst = {on:true, accepted:true, split:{must:44, ess:31, fun:20, save:5}}; S.billsConfirmed = true; syncSplit();
        const sp0 = sumVals(catSpend(shownMonth().ym)), core = h => { const x = h.match(/Card spending<\/small><b class="num">([^<]*)</); return x ? x[1] : ''; };
        ok('Home "Card spending" = Spending "Card spending" = the category total of the month on screen', sp0 > 0 && core(vFooldal()) === ft(sp0) && core(myMoneyHTML()) === ft(sp0) && PAGES.kiadas.html().includes(`<b class="num u-fs-22">${ft(sp0)}</b>`), [sp0, core(vFooldal()), core(myMoneyHTML())]);
        monthStep(true); const sp1 = sumVals(catSpend(shownMonth().ym));
        ok('after one simulated month Home and Spending still show the same total, built from parts.cats', sp1 > 0 && S.tx.find(t => t.parts).parts.cats && sumVals(S.tx.find(t => t.parts).parts.cats) === S.tx.find(t => t.parts).parts.ess + S.tx.find(t => t.parts).parts.fun && core(vFooldal()) === ft(sp1) && core(myMoneyHTML()) === ft(sp1), [sp1, core(vFooldal()), core(myMoneyHTML())]);
        ok('spreadCats adds up exactly to the amount for Everyday essentials and Fun', [36900, 36000, 27000, 28800, 12345].every(a => ['ess', 'fun'].every(b => sumVals(spreadCats(a, b)) === a)));
        { const pm = planModel(), sv = splitView(); ok('plan groups equal the split, and the category rows of each group add up to the group', pm.groups.every(g => g.plan === sv.by[g.k].amt) && pm.groups.filter(g => g.k === 'ess' || g.k === 'fun').every(g => g.rows.reduce((a, r) => a + r.plan, 0) === g.plan), pm.groups.map(g => [g.k, g.plan, g.rows.reduce((a, r) => a + r.plan, 0)])); }
        ok('Home Details page has no plan (it lives on Spending only)', !/mp-g/.test(PAGES.kiadas.html()) && /mp-g/.test(myMoneyHTML()));
        { const before = S.tx.length, bal = JSON.stringify(S.accounts); S.analyst.invest = 0; const dflt = planModel().inv; S._split = {fun:S.analyst.split.fun, rule:payPct(), inv:0}; const room = splitView(S, {fun:S._split.fun, rule:S._split.rule}).by.save.amt;
          S.analyst.invest = room + 50000; const capped = planModel().inv; S.analyst.invest = 0; S._split = null;
          ok('investing: starts at 0, never more than Saving, and creates no transaction or balance change', dflt === 0 && capped === room && S.tx.length === before && JSON.stringify(S.accounts) === bal && SHEETS.splitedit().includes('data-splitinv'), [dflt, capped, room]); }
        { // 1: the Money in line never claims every goal when one is behind or due
          setMain(S, 'pay', true, {pct:60}); setMain(S, 'wk', true); setMain(S, 'rr', true); const g0 = S.goals.find(forint), keepD = g0.date; { const d = demoNow(); d.setDate(d.getDate() - 3); g0.date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
          const t1 = plain(moneyInPanel()); g0.date = keepD;
          ok('Money in panel: a goal that is behind is named and the line never says every goal date', !/Enough for every goal date/.test(t1) && (!/Enough for/.test(t1) || /(is|are) behind/.test(t1)) && !/deadline/i.test(t1), t1); }
        { // 2: Junior card never shows 0 or negative days
          S.bridge = false; S.juniorDays = 0; const h0 = plain(vHub()), hj = (() => { S.juniorDays = 41; return plain(vHub()); })(); S.juniorDays = 0;
          if(SIMPLE_PERSELY){ const m0 = plain(vHub() + moreHTML()), mj = (() => { S.juniorDays = 41; return plain(vHub() + moreHTML()); })(); S.juniorDays = 0;
            ok('Junior row at the end (simple tab: Persi line and More > Keep my 3.0%): "Your Junior package ended today" and Persi "It ends today", no 0 days; with days left Persi counts them ("41 days left"), More shows the full end date and nothing says soon', /Your Junior package ended today/.test(m0) && /Keep your 3\.0%\? It ends today\./.test(m0) && !/\b0 days\b|-\d+ days/.test(m0) && /Keep your 3\.0%\? 41 days left\./.test(mj) && /Your 3\.0% ends on \d{1,2} [A-Z][a-z]+ \d{4}/.test(mj) && !/ends soon/i.test(mj), [m0.slice(0, 120), mj.slice(0, 120)]); }
          else ok('Junior card at the end: "Junior package until [date]" and "Ends today", no 0 days; with days left it still counts them and never says soon', /Junior package until \d{1,2} [A-Z][a-z]+ \d{4}/.test(h0) && /Ends today/.test(h0) && !/\b0 days\b|-\d+ days/.test(h0) && /41 days/.test(hj) && /Junior package until/.test(hj) && !/ends soon/i.test(hj)); }
        { // 4: investing is shown truthfully: Persely + Investing = Saving, Persely spent is what was really moved
          S.analyst.invest = 2000; const pm = planModel(), sg = pm.groups.find(g => g.k === 'save'), pr = sg.rows[0], ir = sg.rows[1], h = plain(planHTML(pm)); S.analyst.invest = 0;
          ok('plan: Persely planned is Saving minus investing, Investing is plan only, and they add up to Saving', pr.plan + ir.plan === sg.plan && pr.plan === sg.plan - 2000 && ir.spent === null && pr.spent === splitUse().save && /planned, not moved/.test(h) && !/not tracked here/.test(h), [sg.plan, pr.plan, ir.plan, pr.spent]); }
        S = keepS; }
      S = clone(); S.onboarded = true; S.friendsOptIn = false;
      const hubF = () => SIMPLE_PERSELY ? moreHTML() : vHub();   // SIMPLE_PERSELY: friends sit on the More page (opt-in as before), never on the tab
      ok('Friends: hidden until opted in (a link to opt in, no ranking, no toggle); never shown in a fresh state', fresh().friendsOptIn === false && (!keepF || (!/data-frtoggle/.test(hubF()) && /data-frjoin/.test(hubF()) && !/class="fr /.test(hubF()))) && (!SIMPLE_PERSELY || !/data-frjoin|data-frtoggle/.test(vHub())));
      S.friendsOptIn = true; S.friendsOpen = true; const FH = hubF();
      ok('Friends: after opt-in the card shows, ranked by streak only (no amounts)', /data-frtoggle/.test(FH) && !/data-frjoin/.test(FH) && /Compared by weekly streak only/.test(FH) && !/ Ft/.test(friendsCard()));
    }
  } finally { S = keep; renderAll(); }
  // forecast text when the goal is reached well before its date (pure helper, fixed "today" = 19 Nov 2026)
  {
    const N = new Date(2026, 10, 19, 12), c = (t, sv, mo, dt) => fcCalc(t, sv, mo, dt, N);
    const demo = c(500000, 0, incomeShare(10) + ROUND_EST, '2029-06-01'), far = c(500000, 0, incomeShare(10) + ROUND_EST, '2046-06-01'), soon = c(45000, 0, 50000, '2031-06-01'), early = c(45000, 0, 40000, '2031-06-01');
    const late = c(500000, 0, 5000, '2029-06-01'), ex = c(35000, 30000, 7000, '2026-12-14');
    ok('forecast: demo preset (500 000 Ft by June 2029) is not over: old wording stays, no early text', !demo.over && demo.text === '' && demo.gap < 0, demo);
    ok('forecast: 500 000 Ft by June 2046 gives a reach month before the date, no amount above the target', far.over && far.far && /^2030-1\d$|^2030-0\d$/.test(far.reachYm) && /^You reach 500.000\sFt in \w+ 2030, well before June 2046\.$/.test(far.text), far);
    ok('forecast: reach next month says "next month", never "0 months"', soon.n === 1 && soon.text.includes('next month, well before June 2031') && !/0 month/.test(soon.text), soon);
    ok('forecast: reach in two months names the month', early.n === 2 && /^You reach 45.000\sFt in January 2027, well before June 2031\.$/.test(early.text), early);
    ok('forecast: a late goal is not "over" and has no early text', !late.over && !late.far && late.text === '' && late.gap < 0, late);
    ok('forecast: an exact-day goal reached in its own month says "by" and the full day', ex.over && /by 14 December 2026\.$/.test(ex.text), ex);
    const sv = S; S = clone(); try {
      const ps5 = S.goals.find(g => g.id === 'ps5' || /PS5|GTA/.test(g.name)), hol = S.goals.find(g => g.id === 'holiday');
      ok('forecast: PS5 + GTA VI (exact day) and Summer holiday cards keep their old wording', ps5 && hol && !forecastText(ps5).far && !forecastText(hol).far && !/ahead/.test(forecast(ps5) + forecast(hol)), [ps5 && forecast(ps5), hol && forecast(hol)]);
      const t = forecastText(S.goals.find(g => !g.shared && !isEur(g)));
      ok('forecastText(goal) returns {reachYm, over, text}', 'reachYm' in t && 'over' in t && 'text' in t, t);
    } finally { S = sv; }
  }
  // story (Wrapped style, Denis's from main): the tip stays on Home, no analytics or bills slides, Into Persely, facts, goal dates on the demo clock
  {
    const sv = S; S = clone(); S.onboarded = true; S.analyst.on = true; const ym0 = ymAt(S.months || 0), txt = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '), fz = v => ft(v).replace(/\s+/g, ' '); S.insight = true;
    try {
      const all = () => storySlides(), allT = () => all().map(x => x.share ? shareCard() : x.build()).map(txt).join(' '), btnAttr = () => all().filter(x => x.btn).map(x => x.btn.attr).join(' ');
      const t0 = tipOf();
      ok('tip: regular category, 10% of the 3-month average, never under 1 000 Ft (food and drink 11 467 -> 1 100)', t0 && t0.kind === 'tip' && t0.cat === 'food' && t0.amt === 11467 && t0.ten === 1100 && t0.ten >= 1000, t0 && [t0.kind, t0.cat, t0.amt, t0.ten]);
      ok('tip: the Home card shows the amount; the Wrapped story has no tip slide and no Set it up', txt(insightCard()).includes(fz(t0.ten)) && !all().some(x => x.id === 'next') && !/data-stinsight/.test(btnAttr()) && !/Set it up/.test(allT()), [txt(insightCard()).slice(0, 80), all().map(x => x.id)]);
      S.tx.unshift({ym:ym0, day:14, d:'Today', n:'WOLT HUNGARY', s:'Card payment', a:-15000, ic:'food'});
      const t1 = tipOf(), dr = stDrift(ym0); ok('tip: matches the biggest-change category (food and drink); the story shows habits, not a biggest-change chart', dr && dr.cat === 'food' && t1.kind === 'tip' && t1.cat === dr.cat && !all().some(x => x.id === 'change'), [dr && dr.cat, t1 && t1.cat]);
      S.tx.shift(); S.tx.unshift({ym:ym0, day:14, d:'Today', n:'H&M', s:'Card payment', a:-600000, ic:'tag'});
      const t2 = tipOf(); ok('overspent month: no saving tip on Home and none in the story, and every slide still builds', t2 && t2.kind === 'short' && !insightCard() && !/data-stinsight|Set it up/.test(btnAttr()) && all().every(x => x.share || txt(x.build()).trim().length > 0), t2);
      S.tx.shift();
      S.tx = S.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11'));
      const t3 = tipOf(), ids = all().map(x => x.id);
      ok('late bill: Home has no tip card and the late card has Pay now; the story has no Pay now (it belongs on Bills, not the story)', t3 && t3.kind === 'bill' && !insightCard() && /data-paybill=/.test(bfCard()) && !/data-stpay/.test(btnAttr()) && !/Pay now/.test(allT()), btnAttr());
      ok('late bill: the story keeps its Wrapped order (title first, no bills slide, share card last)', ids[0] === 'title' && !ids.includes('bills') && ids[ids.length - 1] === 'share', ids);
      ok('no late bill: the same slides in the same order as with a late bill (bills never reorder the story)', (() => { const c = clone(); c.analyst.on = true; const k = S; S = c; const o = storySlides().map(x => x.id); S = k; return o.join() === ids.join(); })(), ids);
      const A3 = stAgg([ym0]), io = txt(all().find(x => x.id === 'put').build());
      ok('Into Persely (rent late): the amount saved this month and what Persely holds now', io.includes(fz(A3.save)) && io.includes(fz(total())) && /Persely now holds/.test(io), io);
      const sB = S; S = clone(); S.analyst.on = true; const A4 = stAgg([ymAt(0)]), io4 = txt(storySlides().find(x => x.id === 'put').build()); S = sB;
      ok('Into Persely (default month): the same figures as the month (saved, interest when there is some)', io4.includes(fz(A4.save)) && (!(A4.interest > 0) || io4.includes(fz(A4.interest))), [A4.save, A4.interest, io4]);
      S = clone(); S.analyst.on = true;
      const F5 = stFacts(stRange()), sb5 = storySlides().find(x => x.id === 'subs'), su5 = sb5 ? txt(sb5.build()) : '';
      ok('subscriptions: the usual monthly amount of each (Netflix 3 490 + Spotify 1 790 = 5 280 Ft), and a year of it', F5.subsM === 5280 && su5.includes(fz(5280) + ' a month') && su5.includes(fz(5280 * 12) + ' a year'), [F5.subsM, F5.subsN, su5]);
      const bg5 = storySlides().find(x => x.id === 'biggest'), bt5 = bg5 ? txt(bg5.build()) : '', mx5 = S.tx.filter(t => !t.parts && txType(t) === 'card' && t.a < 0 && txWhen(t).ym === F5.yms[0] && classify(t) !== 'subs').reduce((m, t) => Math.min(m, t.a), 0);
      ok('biggest buy: the biggest single card payment of the facts month, the shop as people say it, and the line names the month when it is not the story month (never a wrong "this month")', bg5 && F5.big.a === mx5 && bt5.includes(fz(-mx5)) && bt5.includes(shopName(F5.big.n)) && (F5.yms[0] === ymAt(S.months || 0) ? /this month/.test(bt5) : bt5.includes('in ' + MONTHN[+F5.yms[0].slice(5) - 1] + ' ' + F5.yms[0].slice(0, 4)) && !/this month/.test(bt5)), [F5.yms, bt5]);
      // story batch 2: one text for screen and VoiceOver, progress, put aside, share card, no bills slide
      { const sl = storySlides(); sl.forEach(x => x.fin && x.fin(30));
        const wc = t => stNum(t).split(/\s+/).filter(Boolean).length, say = sl.map(x => [x.id, stSay(x)]);
        const heroOk = x => { const d = document.createElement('div'); d.innerHTML = x.build(); const sp = stSay(x).replace(/\s+/g, ' '); return [...d.querySelectorAll('.st-big')].every(e => sp.includes(e.textContent.replace(/\s+/g, ' ').trim())); };
        ok('VoiceOver text is built from the screen text: at most 25 words per slide (a figure like 145 000 Ft is one word), every spoken hero is on screen', say.every(([id, t]) => wc(t) <= 25) && sl.filter(x => x.build).every(heroOk), [say.map(([i, t]) => [i, wc(t)]), sl.filter(x => x.build && !heroOk(x)).map(x => x.id)]);
        const pg = sl.find(x => x.id === 'progress'), pgh = pg ? pg.build() : '', pgw = pg ? stWords(pg) : 0, pgt = txt(pgh), pgG = ruleGoal(), names = S.goals.filter(g => pgt.includes(g.name)).length;
        ok('progress slide: one goal (the one the rules feed), percent and bar, no "date passed" or "deadline"; a goal that is behind has Pick a new date (opens its goal page), one on pace has no button', pg && pgG && pgt.includes(pgG.name) && names === 1 && /\d+%/.test(pgt) && !/date passed|deadline|to go/i.test(pgt) && (isTight(pgG) ? (pg.btn && pg.btn.label === 'Pick a new date' && pg.btn.attr === `data-stgoal="${pgG.id}"` && /Behind/.test(pgt)) : !pg.btn) && pgw <= 20, [pgw, pgt.slice(0, 160)]);
        const keep = S.tx; S.tx = S.tx.filter(t => !(txType(t) === 'own' && t.a < 0 && !/^(BILLS POCKET|CURRENCY)/i.test(t.n)));
        const pg0 = storySlides().find(x => x.id === 'put'), put0 = pg0 ? txt(pg0.build()) : '', pu = () => txt(storySlides().find(x => x.id === 'put').build()); S.tx = keep;
        ok('put aside: never "added by you"; with no deposits the slide is left out or says 0 Ft saved (interest only), never a made-up amount', !/added by you/i.test(put0) && (!pg0 || put0.includes(fz(0) + ' saved')) && !/added by you/i.test(pu()), put0);
        const kg = S.goals.map(g => g.date), ks = S.streak; S.streak = 0; S.goals.forEach(g => { g.date = '2020-05-05'; }); const emptyCard = txt(shareCard()), esh = storySlides().find(x => x.share);
        S.goals.forEach((g, i) => { g.date = kg[i]; }); S.goals[0].date = '2020-05-05'; const noLate = txt(shareCard()), nm0 = S.goals[0].name; S.goals[0].date = kg[0];
        ok('share card: no "0 week streak", no goal whose date has passed, and nothing to share says so (Close only)', /Nothing to share this month yet/.test(emptyCard) && esh.empty && !/week streak/.test(emptyCard) && !noLate.includes(nm0) && !/^\s*0 week/.test(noLate) && !/0 week streak/.test(noLate), [emptyCard, noLate]);
        S.streak = ks;
        const msk = S.tx; S.tx = S.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === ymAt(S.months || 0))); const bl = storySlides().find(x => x.id === 'bills'), blt = allT(); S.tx = msk;
        ok('rent late: the story has no bills slide and never says "late" or "Not paid" (the late tag and Pay now are on Home and Bills)', !bl && !/\blate\b|Not paid|Bills first/i.test(blt), blt.slice(0, 200));
      }
      // chk-story-places: the top places are shops and cafés only (no subscriptions, BKK pass, MÁV, rides or delivery), at most 3, most visits first, and the slide lists them
      { S = clone(); const F = stFacts(stRange()), pl6 = storySlides().find(x => x.id === 'places'), pt6 = pl6 ? txt(pl6.build()) : '';
        ok('chk-story-places: the places slide lists at most 3 shops and cafés, most visits first, with their visits; subscriptions, transport (BKK, MÁV), rides (Bolt) and delivery (Wolt) are never places', pl6 && F.top.length >= 1 && F.top.length <= 3 && F.top.every((x, i) => !i || F.top[i - 1][1] >= x[1]) && !F.top.some(([n]) => /NETFLIX|SPOTIFY|BKK|MÁV|BOLT|WOLT|FOODPANDA/.test(n)) && F.top.every(([n]) => !['subs', 'transport'].includes(classify({n, s:'Card payment', a:-1}))) && F.top.every(([n, c]) => pt6.includes(shopName(n)) && pt6.includes(plural(c, 'visit'))) && /Your number one/.test(pt6), [F.top, pt6]); }
      // from main: Persi reacts on four slides; the demo month has a Wolt week
      { S = clone(); const sl = storySlides(), ids = sl.map(x => x.id), F = stFacts(stRange());
        ok('the pig reacts on the title, days off, the Wolt week and Into Persely only (jump or celebrate, poses that exist)', sl.filter(x => x.pig).map(x => x.id).join() === ['title', 'quiet', 'wolt', 'put'].filter(x => ids.includes(x)).join() && sl.filter(x => x.pig).every(x => !pig3d || typeof pig3d[x.pig] === 'function'), sl.filter(x => x.pig).map(x => [x.id, x.pig]));
        ok('Wolt week: the demo month has 7 Wolt orders in one week, and the slide says so', F.wolt.week === 7 && sl.some(x => x.id === 'wolt' && txt(x.build()).includes('7 Wolt orders in one week')), F.wolt); }
      // goal dates run on the demo clock: 12 demo months later the same forecast is one year on
      S = clone(); const a = inMonths(5); S.months = 12; const b = inMonths(5), la = a.split(' '), lb = b.split(' ');
      ok('goal dates on the demo clock: inMonths(5) is a year later after 12 demo months', la[0] === lb[0] && +lb[1] === +la[1] + 1, [a, b]);
    } finally { S = sv; }
  }
  // edit and delete a goal: only with 0 Ft inside; delete leaves no reference behind; taking money out is an own-account move
  { const sv3 = S; try{
    S = clone(); const ps = S.goals.find(g => g.id === 'ps5'); S.ruleGoal = 'ps5'; setMain(S, 'pay', true); setMain(S, 'wk', true); setMain(S, 'rr', true); goalById('holiday').rules.pay.on = true;   // PS5 has all three; Summer holiday has its own payday rule
    const gate1 = goalEmpty(ps) === false && removeGoal('ps5') === null && !!goalById('ps5');
    const u0 = monthUse(ymAt(S.months || 0), S), n0 = S.tx.length, tot = gSaved(ps); withdrawFrom(ps, tot); const u1 = monthUse(ymAt(S.months || 0), S);
    ok('goal with money inside cannot be deleted until you choose where the money goes (Delete asks); after taking it out (own-account row, income and spending unchanged) it can', gate1 && goalEmpty(ps) && S.tx.length === n0 + 1 && u1.income === u0.income && u1.spendTotal === u0.spendTotal && u1.own !== u0.own && goalIsPlain(ps), [u0.own, u1.own]);
    const r = removeGoal('ps5'), refs = JSON.stringify([S.ruleGoal, S._detail, S._goal, S._out, S.goalRewarded]).includes('ps5');
    ok('delete leaves no orphan reference: the goal, its own rules (they stop with it, the other goals keep theirs) and picks are gone, story, share card, pages and sheets still render', !!r && !goalById('ps5') && !refs && !!goalById(S.ruleGoal) && r.moved.length === 3 && payOn() && payGoals().map(g => g.id).join() === 'holiday' && !wkGoals().length && !rrGoals().length && (() => { try{ const t = [storySlides().map(x => x.build ? x.build() : '').join(''), shareCard(), PAGES.goal.html(), PAGES.year.html(), vHub(), SHEETS.payrule(), SHEETS.roundrule(), SHEETS.weeklyrule(), SHEETS.hubsave(), SHEETS.hubout()].join(''); return !/ps5|NaN/.test(t); }catch(e){ return String(e); } })() === true, [S.ruleGoal, r.moved]);
    S.goals.slice().forEach(g => { if(!goalEmpty(g)) withdrawFrom(g, gSaved(g)); removeGoal(g.id); });
    ok('delete every goal (also Summer holiday and its Persely account): rules off, tab, Home, story, share card and sheets render without errors', S.goals.length === 0 && !payOn() && !wkGoals().length && !rrGoals().length && !anyRule() && !acc('persely') && (() => { try{ const t = [vHub(), vFooldal(), storySlides().map(x => x.build ? x.build() : '').join(''), shareCard(), SHEETS.newgoal(), SHEETS.payrule(), SHEETS.weeklyrule(), SHEETS.roundrule(), SHEETS.moneyin(), myMoneyHTML(), PAGES.kiadas.html()].join(''); return typeof t === 'string'; }catch(e){ return String(e); } })() === true);
  } finally { S = sv3; } }
  { const lz = id => +getComputedStyle(document.getElementById(id)).zIndex || 0;
    ok('chk-lock-over-popup: the lock screen layers above the what\'s-new pop-up and the sheets', lz('lock') > lz('wn') && lz('lock') > lz('back'), [lz('lock'), lz('wn'), lz('back')]);
    const mv = document.createElement('input'); mv.id = 'mv'; document.body.appendChild(mv); mv.value = 'a1b,2.3 Ft-4'; mv.dispatchEvent(new Event('input', {bubbles:true})); const mvv = mv.value; mv.remove();
    ok('chk-addmoney-digits: the Add money amount keeps digits only', mvv === '1234', mvv);
    const sv5 = S; let z0 = '', z8 = '';
    try{ S = JSON.parse(JSON.stringify(F)); S.streak = 0; z0 = DEMO[2].body(); S.streak = 8; z8 = DEMO[2].body(); } finally { S = sv5; }
    ok('chk-push-zero-streak: no streak number in the push at 0 weeks, worded from 1 week', !/\d+-week|0 week/.test(z0) && /8-week streak/.test(z8), [z0, z8]);
    const sv6 = S, svt = document.createElement('button'); let onb0 = null;
    try{ S = JSON.parse(JSON.stringify(F)); S.goals = []; S.onboarded = false; startOnb('custom'); O.name = 'Check goal'; O.i = 2; renderOnb(); const cb = $('#onb [data-onbcreate]'); cb.click(); onb0 = S.onboarded; }
    catch(e){ onb0 = String(e); } finally { svt.remove(); while(stack.length) popPage(true); try{ closeOnb(); }catch(e){} MQ.q = []; hideToast(true); S = sv6; try{ renderAll(); }catch(e){} }
    ok('chk-onboarded-any-path: creating a goal through the one wizard marks the user onboarded', onb0 === true, onb0); }
  { // Phase 1a: two seeds, no auto pop-up, setup card above the fold, hints counted on screen
    const sv7 = S, cur7 = cur, txt7 = h => h.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    try{
      const nw = fresh(), ex = fresh('existing');
      S = nw; const hubN = txt7(legacyR(vHub)), homeN = txt7(legacyR(vFooldal)), spNew = !SPF || (/Hi! Let's save your first 1 000 Ft\./.test(txt7(vHub())) && /What are you saving for\?/.test(txt7(vHub())) && /Save your first 1 000 Ft/.test(txt7(vFooldal())));
      ok('chk-seed-new-default: fresh() is the brand-new user (0 Ft on Persely, no goals, not onboarded, no streak), and no screen contradicts it', nw.seed === 'new' && nw.goals.length === 0 && acc('persely').v === 0 && total() === 0 && !nw.onboarded && nw.streak === 0 && nw.history.length === 0 && nw.friends.length === 0
        && /What are you saving for\?/.test(hubN) && /Your streak starts with the first deposit/.test(hubN) && /Start your first goal/.test(homeN) && !/[1-9]\d*(\s\d{3})* goals?\b/.test(hubN + homeN.replace(/Persely/g, '')) && !/\d+-week streak/.test(hubN + homeN) && !/110 000/.test(hubN + homeN) && spNew,
        [spNew, nw.seed, nw.goals.length, nw.onboarded, hubN.slice(0, 160)]);
      S = ex; const hubEL = txt7(legacyR(vHub)), hubE = SPF ? txt7(vHub()) + ' ' + txt7(moreHTML()) + ' ' + txt7(habitsHTML()) : hubEL, homeE = txt7(vFooldal());   // flag on: the simple tab plus its More and Habits pages; the old tab (legacy) too
      const oldTabE = /Summer holiday/.test(hubEL) && /8-week streak/.test(hubEL + homeE) && !/What are you saving for\?/.test(hubEL);
      ok('chk-seed-existing: fresh(\'existing\') is the current seed (3 goals, Summer holiday 64 000 Ft, 8-week streak, onboarded) and keeps the old tab' + (SPF ? ' (?simple=0) and its goals and streak on the simple tab, More and Habits' : '') + ' and Home', ex.seed === 'existing' && ex.goals.length === 3 && ex.onboarded && ex.streak === 8 && acc('persely').v === 64000 && oldTabE && /Summer holiday/.test(hubE) && /8-week streak/.test(hubE + homeE) && !/What are you saving for\?/.test(hubE) && !/Start your first goal/.test(homeE)
        && typeof loadSeed === 'function' && /data-dseed/.test($('#demoPanel').innerHTML), [ex.seed, ex.goals.length, ex.streak]);
      S = nw; cur = 'hub'; legacyR(() => renderView('hub')); let tiles = [], fold = null;
      const v = $('#v-hub'), first = v.children[1], hubH = v.innerHTML; tiles = [...v.querySelectorAll('#setupcard [data-tilepick]')].map(b => b.textContent.trim());
      const prevOn = v.classList.contains('on'); v.classList.add('on'); document.querySelectorAll('.view').forEach(x => { if(x !== v) x.dataset.chk7 = x.classList.contains('on') ? '1' : ''; x.classList.remove('on'); });
      const last = v.querySelector('#setupcard [data-tilepick="custom"]'), tb = $('#tabbar'), nl = v.querySelector('#setupcard .later');
      if(last && tb && nl){ const r = nl.getBoundingClientRect(), t = tb.getBoundingClientRect(); fold = {bottom:Math.round(r.bottom), tabbarTop:Math.round(t.top), vh:innerHeight}; }
      let spFold = true; if(SPF){ renderView('hub'); const sm = v.querySelector('.spmore'), spT = [...v.querySelectorAll('.spfirst [data-tilepick]')].map(b => b.textContent.trim()).join('|'), r = sm && sm.getBoundingClientRect(), t = tb.getBoundingClientRect();
        spFold = v.children[1] && v.children[1].classList.contains('spfirst') && spT === 'Trip|Phone or tech|Safety net|Something else' && !!r && r.bottom <= t.top && !v.querySelector('#setupcard'); fold = {...(fold || {}), spT, spFold}; }
      document.querySelectorAll('.view').forEach(x => { if(x !== v && x.dataset.chk7 === '1') x.classList.add('on'); delete x.dataset.chk7; }); if(!prevOn) v.classList.remove('on');
      ok('chk-setup-above-fold: the setup card is the first block, with the 6 tiles (Own home, Travel, Driving licence, Safety net, Studies, Something else), no "Trending", Not now, the Junior line and the OTP marker, all above the tab bar', first && first.id === 'setupcard' && tiles.join('|') === 'Own home|Travel|Driving licence|Safety net|Studies|Something else' && !/Trending/.test(hubH) && /<!-- CONFIRM WITH OTP -->/.test(hubH) && /3\.0% a year on up to 500 000 Ft with your Junior account until \d/.test(txt7(hubH)) && /Not now/.test(txt7(hubH)) && (!fold || fold.bottom === undefined || fold.bottom <= fold.tabbarTop) && spFold, [tiles, fold]);
      const lf = launchFlow.toString(), svU = S.updateSeen; S.updateSeen = false; launchFlow(0); const popOn = $('#wn').classList.contains('on') || !!$('#wn').innerHTML.trim(); S.updateSeen = svU;
      ok('chk-no-autopopup: nothing opens at launch (no what\'s-new modal), both seeds start with the pop-up already seen, and Home is where the app starts', !popOn && !/showWhatsNew/.test(lf) && nw.updateSeen === true && ex.updateSeen === true && TABS[0][0] === 'fooldal', [popOn, nw.updateSeen]);
      // hints: a hint is not seen when it is only rendered, nor when the tab is left, nor when it is off screen; it is seen after it stood on screen for 1 s
      S = JSON.parse(JSON.stringify(F)); S.hints = {}; S.onboarded = true; HINT_SHOWN.clear(); cur = 'hub'; renderView('hub');
      const drawn = [...document.querySelectorAll('#v-hub .hint[data-hk]')].map(e => e.dataset.hk), seenAtRender = Object.keys(S.hints).length, watching = !!HINT_OBS;
      const stk7 = stack.splice(0), dh7 = demo.locked; demo.locked = false;   // no page and no lock screen over the tab for this check
      cur = 'fooldal'; const offTab = hintSeenAfter1s('total'), afterOff = !!S.hints.total; cur = 'hub';
      const onTab = hintSeenAfter1s('total'), afterOn = !!S.hints.total; stack.push(...stk7); demo.locked = dh7; const tabSrc = tab.toString() + pushPage.toString();
      ok(SIMPLE_PERSELY ? 'chk-hint-seen-on-screen (simple tab): no hint strip is drawn on the tab with a goal (no observer, nothing seen at render); the 1 s on-screen rule is kept (not when the tab is left or a page opens)' : 'chk-hint-seen-on-screen: a hint counts as seen only after 1 s on screen (observer on every hint; not at render, not when the tab is left or a page opens)', (SIMPLE_PERSELY ? drawn.length === 0 && !watching : drawn.includes('total') && watching) && seenAtRender === 0 && offTab === false && afterOff === false && onTab === true && afterOn && !/S\.hints\[/.test(tabSrc) && /IntersectionObserver/.test(watchHints.toString()) && /1000/.test(watchHints.toString()), [drawn, seenAtRender, watching, offTab, onTab]);
    } catch(e){ ok('chk-phase1a: the new checks ran without errors', false, String(e && e.stack || e)); }
    finally { S = sv7; cur = cur7; HINT_SHOWN.clear(); try{ renderAll(); }catch(e){} }
  }
  { // Phase 1b: glossary, formats, Junior transparency, Good to know, tap sizes, dialogs
    const sv8 = S, cur8 = cur, stk8 = stack.splice(0), lock8 = demo.locked, O8 = JSON.stringify(O), views8 = [...document.querySelectorAll('.view')].map(v => v.classList.contains('on')); demo.locked = false;
    const pl = h => String(h).replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' '), lab = h => (String(h).match(/aria-label="[^"]*"/g) || []).join(' ');
    const errs = [], surfaces = kind => {   // the rendered HTML of Home, Persely tab, goal page, both wizards, More, Transfer, the Junior page and the sheets
      const m = {}; S = fresh(kind); if(S.goals[0]) S._detail = S.goals[0].id;
      const add = (k, f) => { try{ m[k] = f(); }catch(e){ errs.push(kind + '/' + k + ': ' + e); m[k] = ''; } };
      add('home', vFooldal); add('hub', () => legacyR(vHub)); add('more', vTovabbiak);
      // the Simple Persely tab is scanned too: the first run (no goal) or the simple tab with its More and Habits pages (goals)
      if(SPF){ add('sphub', vHub); add('spconfirm', () => spProbe('travel')); if(S.goals.length){ add('persmore', () => PAGES.persmore.html()); add('habits', () => PAGES.habits.html()); } } add('transfer', vUtalas); add('grad', () => PAGES.grad.html()); add('regular', () => SHEETS.saverules());
      if(S.goals[0]) add('goal', () => PAGES.goal.html());
      ['goodtoknow', 'whyp', 'how', 'befizet', 'kivesz', 'newgoal'].concat(S.goals.length ? ['hubsave', 'hubout'] : []).forEach(k => add('sheet-' + k, () => SHEETS[k]()));
      add('titles', () => Object.keys(PAGES).map(k => typeof PAGES[k].title === 'function' ? PAGES[k].title() : PAGES[k].title).join(' | '));
      try{ startOnb('travel'); STEPS.forEach((_, i) => { O.i = i; renderOnb(); m['onb' + (i + 1)] = m['wizard' + (i + 1)] = $('#onb').innerHTML; }); }catch(e){ errs.push(kind + '/onb: ' + e); } finally { try{ closeOnb(); }catch(e){} }
      S._draft = null; return m;
    };
    try{
      const A = surfaces('new'), B = surfaces('existing'), all = {...Object.fromEntries(Object.entries(A).map(([k, v]) => ['n-' + k, v])), ...Object.fromEntries(Object.entries(B).map(([k, v]) => ['e-' + k, v]))};
      const txts = Object.entries(all).map(([k, h]) => [k, pl(h) + ' ' + lab(h)]), every = f => txts.filter(([k, t]) => f(t));
      // glossary: the listed synonyms never appear; the glossary words do
      const BANNED = /take out|taken out|take money out|spending tracker|create persely|new persely|(?<!scheduled and )recurring transfer/i, hits = every(t => BANNED.test(t)).map(([k, t]) => k + ': ' + (t.match(BANNED) || [])[0]);
      const gl = pl(vTovabbiak() + vFooldal() + vHub()), noCar = !/\bCar\b/.test(Object.values(GOAL_PRESETS).map(g => g.label + ' ' + g.name).join(' ') + pl(SHEETS.newgoal()));
      ok('chk-glossary-terms: no "Take out", "Take money out", "Spending tracker", "Create Persely", "New Persely" or "Recurring transfer" in the text or labels of Home, Persely tab, goal page, both wizards, More, Transfer and the sheets; Withdraw, Spending and Weekly transfer are the words used; "Car" is Driving licence', hits.length === 0 && /Withdraw/.test(pl(A.hub + B.hub + B.goal + B['sheet-kivesz'])) && /Spending/.test(pl(B.more)) && /Weekly transfer/.test(pl(B.persely + B.regular)) && /Create goal/.test(pl(B.wizard3)) && /New goal/.test(B.wizard3) && noCar && /Driving licence/.test(pl(A.hub)) && (!SPF || (/More goals/.test(pl(A.sphub)) && /data-spmore/.test(A.sphub) && /Driving licence/.test(pl(spOldNewgoal())) && /Withdraw any time/.test(pl(A.spconfirm)))), [hits, errs]);
      // dates and amounts
      const MON = 'January|February|March|April|May|June|July|August|September|October|November|December', SHORT = /\b\d{1,2} (Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b|\b(Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec) \d{4}\b/, noYear = new RegExp('\\b\\d{1,2} (' + MON + ')\\b(?! \\d{4})'), ago = every(t => SHORT.test(t) || noYear.test(t)).map(([k, t]) => k + ': ' + (t.match(SHORT) || t.match(noYear))[0]);
      const JREND = SIMPLE_PERSELY ? /(Junior package until|Your 3\.0% ends on) \d{1,2} [A-Z][a-z]+ \d{4}/ : /Junior package until \d{1,2} [A-Z][a-z]+ \d{4}/;   // flag on: plan 2f item 6
      const spDates = !SPF || (/until \d{1,2} [A-Z][a-z]+ \d{4}/.test(pl(A.spconfirm)) && /\d{3} Ft · [A-Z][a-z]+ \d{4}/.test(pl(A.spconfirm)) && /until \d{1,2} [A-Z][a-z]+ \d{4}/.test(pl(B.sphub)) && /Your 3\.0% ends on \d{1,2} [A-Z][a-z]+ \d{4}/.test(pl(B.persmore)) && !/\bsoon\b/i.test(pl(A.sphub + B.sphub + B.persmore)));   // the simple tab: its honesty line, More > Keep my 3.0%
      ok('chk-date-format: full dates read "1 June 2029", month dates "June 2029", the Junior end date is one concrete day, and no short or year-less dates on the screens', fDate('2029-06-01') === '1 June 2029' && /^\d{1,2} [A-Z][a-z]+ \d{4}$/.test(juniorEndLabel()) && /^[A-Z][a-z]+ \d{4}$/.test(inMonths(5)) && ago.length === 0 && JREND.test(pl(A.home)) && JREND.test(pl(A.hub)) && JREND.test(pl(B.hub)) && !/\bsoon\b/i.test(pl(A.hub + A.home + B.grad + B.hub)) && spDates, [ago, inMonths(5), juniorEndLabel(), spDates]);
      const bad$ = every(t => /\b\d{1,3} ?k\b(?! ?m)|\b\d+(\.\d+)? ?M Ft|\b\d+ ?M\b(?!\w)|\d{4,} ?Ft|\d{1,3},\d{3} ?Ft/.test(t)).map(([k, t]) => k + ': ' + (t.match(/\b\d{1,3} ?k\b(?! ?m)|\b\d+(\.\d+)? ?M Ft|\b\d+ ?M\b(?!\w)|\d{4,} ?Ft|\d{1,3},\d{3} ?Ft/) || [])[0]);
      const chipsTxt = pl(A.wizard1 + A.onb1 + B.wizard1);
      ok('chk-amount-format: amounts read "87 450 Ft" with a space, chips "50 000 Ft", never "50k", "1 M" or digits stuck together, on every screen', ft(87450).replace(/\s/g, ' ') === '87 450 Ft' && ft(500000).replace(/\s/g, ' ') === '500 000 Ft' && /50 000 Ft/.test(chipsTxt) && bad$.length === 0, [bad$, chipsTxt.slice(0, 200)]);
      // Junior transparency: every 3.0% mention has its cap and a date in the same block, or points to Good to know
      const rateBad = []; Object.entries(all).forEach(([k, h]) => { if(/titles$/.test(k) || !/3\.0%/.test(pl(h))) return; if(SIMPLE_PERSELY && /sheet-(goodtoknow|whyp|ratesafe)$/.test(k)) return; const box = document.createElement('div'); box.innerHTML = h;
        const w = document.createTreeWalker(box, NodeFilter.SHOW_TEXT); let n; while((n = w.nextNode())){ if(!/3\.0%/.test(n.nodeValue)) continue;
          const el = (n.parentElement && n.parentElement.closest('.card,.row,.ptot,li,button,.note,.sumcard,.opt,.hint,.setupcard,.lst,.li,.wn-card')) || box, t = el.textContent.replace(/\s+/g, ' ');
          const toRs = SIMPLE_PERSELY && el.nodeType === 1 && (el.matches('[data-sheet="ratesafe"],[data-sheet="goodtoknow"],[data-sheet="whyp"],[data-go="grad"]') || !!el.querySelector('[data-sheet="ratesafe"]'));   // flag on: the line opens Rate and safety (or the Junior page)
          if(!((/500 000 Ft/.test(t) && /\d{1,2} [A-Z][a-z]+ \d{4}/.test(t)) || /Good to know/.test(t) || toRs)) rateBad.push(k + ': ' + n.nodeValue.trim().slice(0, 70)); } });
      const gr = pl(B.grad), headIdx = B.grad.indexOf('</h2>'), afterHead = B.grad.slice(headIdx, headIdx + 140);
      ok('chk-rate-has-cap: every 3.0% mention carries its 500 000 Ft cap and a date (or Good to know); the "Your 3.0% rate" headline is followed by its conditions (marked CONFIRM WITH OTP); Copy account number is on step 1', rateBad.length === 0 && /class="gcond"/.test(afterHead) && /<!-- CONFIRM WITH OTP -->/.test(B.grad.slice(headIdx - 120, headIdx + 140)) && /On the first 500 000 Ft · 28% tax · Without a salary at OTP the rate returns to standard after 30 days' notice/.test(gr) && /data-copyacc/.test(B.grad) && /Copy account number/.test(gr), [rateBad.slice(0, 6), errs]);
      // Good to know and Why Persely?
      S = fresh('existing'); sheet(SHEETS.goodtoknow()); const gk = $('#sheet'), gkli = gk.querySelector('.gtk li'), gkfs = gkli ? parseFloat(getComputedStyle(gkli).fontSize) : 0, gkt = pl(SHEETS.goodtoknow()); closeSheet();
      if(SIMPLE_PERSELY) ok('chk-good-to-know (simple): Good to know is now Rate and safety: rate and cap, 28% tax, withdraw any time, no fees, a Deposit protection link (CONFIRM WITH OTP) and the Junior end date, in 14 px text or more; wizard step 3 (both wizards) and the Persely tab open it, How Persely works links to it',
        /Rate and safety/.test(gkt) && /3\.0% a year on up to 500 000 Ft/.test(gkt) && /28% tax/.test(gkt) && /Withdraw any time/i.test(gkt) && /No fees/.test(gkt) && /Deposit protection/.test(gkt) && /It ends on \d{1,2} [A-Z][a-z]+ \d{4}/.test(gkt) && /<!-- CONFIRM WITH OTP -->/.test(SHEETS.goodtoknow()) && gkfs >= 13.99 && /data-sheet="ratesafe"/.test(A.wizard3 === undefined ? '' : B.wizard3) && /data-sheet="ratesafe"/.test(B.onb3) && /data-sheet="(goodtoknow|ratesafe)"/.test(A.hub) && /data-sheet="(goodtoknow|ratesafe)"/.test(B.hub) && /data-sheet="ratesafe"/.test(B['sheet-how']) && (!SPF || (/data-sheet="spgtk"/.test(A.spconfirm) && /data-sheet="spgtk"/.test(B.spconfirm) && /3\.0% a year on the first 500 000 Ft/.test(pl(SHEETS.spgtk())) && /28% tax/.test(pl(SHEETS.spgtk())) && /<!-- CONFIRM WITH OTP -->/.test(SHEETS.spgtk()))), [gkfs]);
      else ok('chk-good-to-know: rate and cap, 28% tax, withdraw any time, no fees, a Deposit protection link (CONFIRM WITH OTP) and the Junior end date, in 14 px text or more; on wizard step 3 (both wizards), the Persely tab trust line and How Persely works', /3\.0% a year on the first 500 000 Ft/.test(gkt) && /28% tax/.test(gkt) && /Withdraw any time/.test(gkt) && /No fees/.test(gkt) && /Deposit protection/.test(gkt) && /Junior package until \d/.test(gkt) && /<!-- CONFIRM WITH OTP -->/.test(SHEETS.goodtoknow()) && gkfs >= 13.99 && /Good to know/.test(pl(A.wizard3 === undefined ? '' : B.wizard3)) && /Good to know/.test(pl(B.onb3)) && /data-sheet="goodtoknow"/.test(A.hub) && /data-sheet="goodtoknow"/.test(B.hub) && /data-sheet="goodtoknow"/.test(B['sheet-how']), [gkfs]);
      const wy = SHEETS.whyp(), bars = [...wy.matchAll(/class="why-bar"><i style="width:([\d.]+)%/g)].map(m => +m[1]), wyt = pl(wy);
      if(SIMPLE_PERSELY) ok('chk-why-persely (simple): "Why Persely?" on the Savings account card on Home opens Rate and safety, which compares per 100 000 Ft after tax on one bar scale (Persely 3.0% 2 160 Ft, Savings 3.5% 2 520 Ft, old 0.01% 7 Ft) with the plan sentence, marked CONFIRM WITH OTP, and never says Persely beats 3.5%',
        /data-sheet="whyp"[^>]*>Why Persely\?/.test(B.home) && SHEETS.whyp === SHEETS.ratesafe && /100 000 Ft/.test(wyt) && bars.length === 3 && Math.abs(bars[0] / bars[1] - 2160 / 2520) < .01 && bars[1] === 100 && bars[2] < bars[0] && /2 160 Ft a year after tax/.test(wyt) && /2 520 Ft a year after tax/.test(wyt) && /\b7 Ft a year after tax/.test(wyt) && /The Savings account pays a bit more: 3\.5%\. Persely pays 3\.0%\. Both are taxed\. Persely keeps each goal apart\. You can withdraw any time, for free\./.test(wyt) && /<!-- CONFIRM WITH OTP -->/.test(wy) && !/more than the Savings|beats|better than 3\.5/i.test(wyt), [bars]);
      else ok('chk-why-persely: "Why Persely?" sits on the Savings account card on Home and compares per 100 000 Ft on one bar scale (Persely 3.0%, Savings 3.5%, old 0.01%) with one sentence on rate, tax and access, marked CONFIRM WITH OTP, and never says Persely beats 3.5%', /data-sheet="whyp"[^>]*>Why Persely\?/.test(B.home) && /100 000 Ft/.test(wyt) && bars.length === 3 && Math.abs(bars[0] / bars[1] - 3 / 3.5) < .01 && bars[1] === 100 && bars[2] < bars[0] && /3\.0%/.test(wyt) && /3\.5%/.test(wyt) && /0\.01%/.test(wyt) && /<!-- CONFIRM WITH OTP -->/.test(wy) && /rate|a year/.test(wyt) && /taxed at 28%/.test(wyt) && /withdraw any time/.test(wyt) && !/more than the Savings|beats|better than 3\.5/i.test(wyt), [bars]);
      // N5: no hard-coded name
      S = fresh('existing'); S.name = 'Kiss Réka'; S.juniorDays = 0; const nm = pl(PAGES.grad.html()) + pl(shareCard());
      ok('chk-no-hardcoded-name: the Junior page and the share card use the name field (Réka), never "Anna", and no congratulation at 0 days', /Réka/.test(nm) && !/Anna/.test(nm) && !/Congratulations/.test(pl(PAGES.grad.html())), nm.slice(0, 160));
      // N1 tap sizes: measured on Home and the Persely tab at the phone width
      const ph = $('#phone'), sc = ph.getBoundingClientRect().width / ph.offsetWidth || 1, small = [], SEL = '.sec a, .link, .hhead .mail, .tg, .later, .trust, .whyl, .hint-x, .rem-b, .onb-back, .onb-skip, [data-setuplater]' + (SIMPLE_PERSELY ? ', .sp-out, .sp-honest, .sp-jar, .sp-say, .sp-more' : '');   // SIMPLE_PERSELY: the simple tab's Withdraw link, honesty line, jars, Persi line and More row
      const measure = (label, root) => root.querySelectorAll(SEL).forEach(el => { const r = el.getBoundingClientRect(); if(r.width === 0 && r.height === 0) return; if(r.height / sc < 43.5 || r.width / sc < 43.5) small.push(`${label}: ${(el.className || el.tagName)} ${Math.round(r.width / sc)}x${Math.round(r.height / sc)}`); });
      const viewsBefore = views8;
      const showOnly = id => document.querySelectorAll('.view').forEach(v => v.classList.toggle('on', v.id === 'v-' + id));
      [['new', 'fooldal'], ['new', 'hub'], ['existing', 'fooldal'], ['existing', 'hub']].forEach(([kind, id]) => { S = fresh(kind); cur = id; renderView(id); showOnly(id); measure(kind + '/' + id, $('#v-' + id)); });
      S = fresh('new'); renderView('hub'); S.hints = {}; S.onboarded = true; HINT_SHOWN.clear(); HINT_FORCE = true; renderView('hub'); showOnly('hub'); measure('new/hub with hint', $('#v-hub')); HINT_FORCE = false; HINT_SHOWN.clear();
      try{ S = fresh('new'); startOnb('travel'); O.i = 1; renderOnb(); measure('onboarding', $('#onb')); O.i = 2; renderOnb(); measure('onboarding 3', $('#onb')); } catch(e){ errs.push('tap/onb ' + e); } finally { try{ closeOnb(); }catch(e){} }
      document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', viewsBefore[i]));
      const cssTxt = [...document.querySelectorAll('style')].map(x => x.textContent).join(' ');
      ok('chk-tap-44: New +, All accounts, Details, text links, mail icon, switches, Not now, Back, trust line and Why Persely? measure 44 px or more on Home and the Persely tab at the phone width; no 9.5 px text', small.length === 0 && !/0\.59375rem|9\.5px/.test(cssTxt), [small.slice(0, 8), sc]);
      // N2 dialogs
      S = fresh('existing'); const stT = openStory.toString(), sh0 = $('#sheet');
      sheet(SHEETS.goodtoknow()); const closeBtn = $('#sheet [data-closesheet]'), focusIn = document.activeElement === sh0 || sh0.contains(document.activeElement), on1 = sheetOpen();
      document.dispatchEvent(new KeyboardEvent('keydown', {key:'Escape', bubbles:true})); const escClosed = !sheetOpen();
      sheet(SHEETS.how()); const x2 = $('#sheet [data-closesheet]'); x2.click(); const xClosed = !sheetOpen();
      const rl = id => { const e = $('#' + id); return e.getAttribute('role') === 'dialog' && e.getAttribute('aria-modal') === 'true' && !!e.getAttribute('aria-label'); }, tt = $('#toast');
      ok('chk-dialog-roles: the sheet, set-up flow, pop-up, lock screen, fast-forward and story are role="dialog" aria-modal="true" with a label; every sheet has a Close button, takes focus and closes on Esc; the toast is role="status" aria-live="polite"', rl('sheet') && rl('onb') && rl('wn') && rl('lock') && rl('ff') && /setAttribute\('role', 'dialog'\)/.test(stT) && !!closeBtn && closeBtn.getAttribute('aria-label') === 'Close' && on1 && focusIn && escClosed && xClosed && tt.getAttribute('role') === 'status' && tt.getAttribute('aria-live') === 'polite', [!!closeBtn, focusIn, escClosed, xClosed]);
    } catch(e){ ok('chk-phase1b: the new checks ran without errors', false, String(e && e.stack || e)); }
    finally { S = sv8; cur = cur8; stack.push(...stk8); demo.locked = lock8; try{ Object.keys(O).forEach(k => delete O[k]); Object.assign(O, JSON.parse(O8)); closeSheet(); renderAll(); }catch(e){} document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', views8[i])); }
  }
  // the stylesheet and the app script text: css/app.css and js/*.js are separate files (read once, synchronously, from the same origin); the offline build inlines them, then they are read from the page
  const srcFile = u => { try{ const x = new XMLHttpRequest(); x.open('GET', u, false); x.send(); return x.status === 200 || (x.status === 0 && x.responseText) ? x.responseText : ''; }catch(e){ return ''; } };
  let srcMemo = null;
  const appSrc = () => srcMemo || (srcMemo = {
    css: [...document.querySelectorAll('style')].map(x => x.textContent).concat([...document.querySelectorAll('link[rel="stylesheet"]')].filter(x => /^css\//.test(x.getAttribute('href'))).map(x => srcFile(x.getAttribute('href')))).join('\n'),
    js: [...document.scripts].map(x => x.src ? (/^js\//.test(x.getAttribute('src')) ? srcFile(x.getAttribute('src')) : '') : (x.textContent.includes('const PALETTE') ? x.textContent : '')).filter(Boolean).join('\n')   // the app script only (three.js is left out)
  });
  const dmoveSrc = () => document.documentElement.innerHTML + '\n' + appSrc().css + '\n' + appSrc().js;
  { // Phase 2: money move safety (D6): empty forms, review above 20 000 Ft, one error wording, Pay now beneficiary, one 10 s Undo chip that reverses one move
    const sv9 = S, cur9 = cur, stk9 = stack.splice(0), lock9 = demo.locked, views9 = [...document.querySelectorAll('.view')].map(v => v.classList.contains('on')); demo.locked = false;
    const pl = h => String(h).replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' '), nt = t => String(t).replace(/\s+/g, ' ').trim(), setf = (id, v) => { const f = $('#' + id); f.value = v; f.dispatchEvent(new Event('input', {bubbles:true})); }, clk = sel => { const b = $(sel); if(b) b.click(); return !!b; }, errT = id => { const e = $('#e-' + id); return e ? nt(e.textContent) : ''; };
    try{
      S = fresh('existing'); hideChip(true); PEND = null;
      const gOut = S.goals.find(g => !g.shared && !isEur(g) && gSaved(g) > 0), empty = [];
      ['kivesz', 'befizet', 'sajat', 'hubsave', 'hubout'].forEach(k => { S._out = gOut.id; sheet(SHEETS[k]()); const f = $('#mv'); if(!f || f.value !== (SIMPLE_PERSELY && k === 'hubsave' ? '1000' : '')) empty.push(k); closeSheet(); });   // flag on: Add money starts with the last amount, 1 000 Ft the first time (D5)
      S._out = gOut.id; sheet(SHEETS.hubout()); const t0 = S.tx.length; clk('[data-hubout]'); const emptyErr = errT('mv'), noMove = S.tx.length === t0; closeSheet();
      ok('chk-withdraw-empty: Add money, Withdraw, Between my accounts and the goal Withdraw sheet open with an empty amount (no 5 000 Ft); amount chips stay; tapping the button with no amount says "Enter an amount" under the field and moves nothing', empty.length === 0 && emptyErr === E_AMT && noMove && /data-setv="1000"/.test(SHEETS.kivesz()) && /data-setv="1000"/.test(SHEETS.befizet()), [empty, emptyErr]);
      // Withdraw all: a chip, then a one line confirm with the real amount and account
      S = fresh('existing'); hideChip(true); const g1 = S.goals.find(g => !g.shared && !isEur(g) && gSaved(g) > 0), max1 = mine(g1), j0 = acc('junior').v; S._out = g1.id; sheet(SHEETS.hubout());
      const hasAll = !!$('[data-wall="out"]'); clk('[data-wall="out"]'); const cf1 = nt($('#cfm').textContent), want1 = `Withdraw all ${money(g1, max1)} to Junior account?`, held = acc('junior').v === j0 && mine(g1) === max1;
      clk('[data-cfmback]'); const backOk = !$('#cfm').innerHTML.trim() && $('#sheet .pbtn').style.display !== 'none'; clk('[data-wall="out"]'); clk('[data-cfmok]');
      const done1 = mine(g1) === 0 && acc('junior').v === j0 + max1; hideChip(true);
      S = fresh('existing'); sheet(SHEETS.kivesz()); const moveAll = !!$('[data-wall="move"]'); closeSheet();
      const g2 = S.goals.find(g => !g.shared && !isEur(g) && gSaved(g) > 0); S._outall = g2.id; sheet(SHEETS.outallc()); const oc = nt($('#sheet').textContent), outAllBtn = /data-outall="/.test(PAGES.goal.html.toString()) || true;
      ok('chk-withdraw-all-confirm: "Withdraw all" is a chip on both Withdraw sheets; it asks "Withdraw all 59 000 Ft to Junior account?" (real amount) before anything moves, Back keeps the form, Confirm moves it; the per goal "Take all out" button asks the same line', hasAll && cf1.startsWith(nt(want1)) && held && backOk && done1 && moveAll && oc.includes(`Withdraw all ${nt(money(g2, gSaved(g2)))} to Junior account?`) && !!$('#sheet [data-outallok]'), [hasAll, cf1, want1, held, backOk, done1, moveAll, oc.slice(0, 120)]); closeSheet(); hideChip(true);
      // New transfer: empty, validated inline, one wording
      S = fresh('existing'); hideChip(true); sheet(SHEETS.uj()); const uEmpty = ['un', 'ua', 'uv'].every(id => $('#' + id).value === ''), uHtml = SHEETS.uj(); closeSheet();
      ok('chk-transfer-empty: New transfer opens with empty Name, Account number and Amount (no "Nagy Péter", no 5 000), with amount chips and an inline error line under each field', uEmpty && !/Nagy|11111111|value="5000"/.test(uHtml) && (uHtml.match(/class="ferr"/g) || []).length === 3 && /data-setv="5000" data-into="uv"/.test(uHtml));
      const jb = acc('junior').v, tx0 = S.tx.length, tryT = (n, a, v) => { sheet(SHEETS.uj()); setf('un', n); setf('ua', a); setf('uv', v); clk('[data-dout]'); const r = {un:errT('un'), ua:errT('ua'), uv:errT('uv'), open:sheetOpen(), cfm:nt(($('#cfm') || {}).textContent || '')}; return r; };
      const r1 = tryT('', '1177311910066592', '5000'); closeSheet(); const r2 = tryT('Péter', 'abc', '5000'); closeSheet(); const r3 = tryT('Péter', '1177311910066592', ''); closeSheet(); const r4 = tryT('Péter', '1177311910066592', String(jb + 1)); closeSheet(); const r5 = tryT('Péter', '12345', '5000'); closeSheet();
      const blocked = S.tx.length === tx0 && acc('junior').v === jb;
      const r6 = tryT('Péter', '11773119-10066592', '5000'); const sent = S.tx.length === tx0 + 1 && acc('junior').v === jb - 5000 && !sheetOpen() && UCH.on; hideChip(true);
      ok('chk-transfer-validate: a blank name, "abc" or a short account number, no amount, or more than the Junior account holds cannot be sent; each error shows under its field in one wording ("Enter a name", "Check the account number (16 or 24 digits)", "Enter an amount", "Not enough money on Junior account"); a valid transfer goes through', r1.un === E_NAME && r2.ua === E_ACC && r3.uv === E_AMT && r4.uv === E_FUNDS && r5.ua === E_ACC && r1.open && blocked && sent, [r1, r2, r3, r4, r5, sent]);
      // review above 20 000 Ft
      S = fresh('existing'); hideChip(true); const k0 = S.tx.length, jb2 = acc('junior').v; sheet(SHEETS.uj()); setf('un', 'Kiss Anna'); setf('ua', '1177311910066592'); setf('uv', '25000'); clk('[data-dout]');
      const rv = nt($('#cfm').textContent), rvOk = rv.startsWith('Review: Send 25 000 Ft to Kiss Anna, 1177311910066592?') && /Confirm/.test(rv) && /Back/.test(rv) && S.tx.length === k0 && acc('junior').v === jb2;
      clk('[data-cfmback]'); const rvBack = sheetOpen() && !$('#cfm').innerHTML.trim() && $('#uv').value === '25000'; clk('[data-dout]'); clk('[data-cfmok]'); const rvSent = S.tx.length === k0 + 1 && acc('junior').v === jb2 - 25000; hideChip(true);
      sheet(SHEETS.uj()); setf('un', 'Kiss Anna'); setf('ua', '1177311910066592'); setf('uv', '20000'); clk('[data-dout]'); const at20 = S.tx.length === k0 + 2 && !sheetOpen(); hideChip(true);
      S = fresh('existing'); const gW = S.goals.find(g => !g.shared && !isEur(g) && g.id !== 'holiday'); gW.saved = 40000; const w0 = mine(gW); S._out = gW.id; sheet(SHEETS.hubout()); setf('mv', '25000'); clk('[data-hubout]'); const wr = nt($('#cfm').textContent), wrOk = wr.startsWith('Review: Withdraw 25 000 Ft to Junior account?') && mine(gW) === w0; clk('[data-cfmok]'); const wDone = mine(gW) === w0 - 25000 && !sheetOpen() && UCH.on; closeSheet(); hideChip(true);
      S = fresh('existing'); S.tx = S.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); S._bill = 'szab-d-ra'; const bj = acc('junior').v, bp = pocketBal(); sheet(SHEETS.paybill()); clk('[data-dopay]'); const br = nt($('#cfm').textContent), brOk = /^Review: Send 42 000 Ft to SZABÓ DÓRA, \d{8}-\d{8}-\d{8}\?/.test(br) && acc('junior').v === bj; clk('[data-cfmok]'); const bPaid = (acc('junior').v === bj - 42000 || pocketBal() === bp - 42000) && UCH.on; hideChip(true);
      ok('chk-review-over-20000: a money out above 20 000 Ft (transfer, withdraw, Pay now) shows "Review: Send 25 000 Ft to [name], [account]?" with Confirm and Back before anything moves; Back keeps the form; 20 000 Ft itself goes straight through; the limit is one constant (REVIEW_OVER)', rvOk && rvBack && rvSent && at20 && wrOk && wDone && brOk && bPaid && REVIEW_OVER === 20000 && (dmoveSrc().match(/REVIEW_OVER/g) || []).length >= 4, [rv, rvOk, rvBack, rvSent, at20, wr, wrOk, wDone, br, brOk, bPaid]);
      // Pay now shows who gets the money
      S = fresh('existing'); S.tx = S.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); S._bill = 'szab-d-ra'; const pn = nt(pl(SHEETS.paybill())), amtL = billStatus(billById('szab-d-ra')).left;
      ok('chk-paynow-beneficiary: the Pay now sheet shows To (name and account number), Reference, From and Amount, the line "Nothing is sent until you tap Pay", and the button "Pay 42 000 Ft" with the real amount', /To SZABÓ DÓRA · \d{8}-\d{8}-\d{8}/.test(pn) && /Reference \S/.test(pn) && /From (Bills pocket|Junior account)/.test(pn) && /Amount 42 000 Ft/.test(pn) && /Nothing is sent until you tap Pay/.test(pn) && /Pay 42 000 Ft/.test(pn) && amtL === 42000 && payeeAcct('SZABÓ DÓRA') === payeeAcct('SZABÓ DÓRA'), pn.slice(0, 260));
      // Undo chip: 10 s, survives tab and page changes, announced
      S = fresh('existing'); hideChip(true); sheet(SHEETS.uj()); setf('un', 'Kiss Anna'); setf('ua', '1177311910066592'); setf('uv', '3000'); clk('[data-dout]');
      const on0 = UCH.on && $('#uchip').classList.contains('on') && !!$('#uchip [data-undo]'), live = $('#uchip').getAttribute('aria-live') === 'polite' && $('#uchip').getAttribute('role') === 'status';
      tab('hub'); const afterTab = UCH.on && $('#uchip').classList.contains('on'); pushPage('bills'); const afterPage = UCH.on && $('#uchip').classList.contains('on'); popPage(true); tab('tovabbiak'); const afterTab2 = UCH.on; const jb3 = acc('junior').v;
      clk('#uchip [data-undo]'); const undone = acc('junior').v === jb3 + 3000 && !UCH.on && !S.tx.some(t => t.note === '1177311910066592'); tab('fooldal');
      ok('chk-undo-10s-persist: after a money move one Undo chip shows for 10 s (UNDO_MS), it is announced (role status, aria-live polite), it stays across a tab change and a page change, and one tap reverses the move', UNDO_MS === 10000 && on0 && live && afterTab && afterPage && afterTab2 && undone && !/UCH\.t = setTimeout\([^)]*\b5000\b/.test(showChip.toString()) && /UNDO_MS/.test(showChip.toString()), [on0, live, afterTab, afterPage, afterTab2, undone]);
      // Undo reverses only its own move
      S = fresh('existing'); hideChip(true); const base = acc('junior').v, txN = S.tx.length;
      sheet(SHEETS.uj()); setf('un', 'Anna A'); setf('ua', '1177311910066592'); setf('uv', '3000'); clk('[data-dout]'); const undoA = UCH.fn;
      sheet(SHEETS.uj()); setf('un', 'Bela B'); setf('ua', '1177311910066592'); setf('uv', '4000'); clk('[data-dout]'); const undoB = UCH.fn;
      const both = acc('junior').v === base - 7000 && S.tx.length === txN + 2; undoA(); const onlyA = acc('junior').v === base - 4000 && S.tx.length === txN + 1 && S.tx[0].n === 'BELA B' && !S.tx.some(t => t.n === 'ANNA A');
      undoB(); const allBack = acc('junior').v === base && S.tx.length === txN; hideChip(true);
      const n0 = S.goals.length; S.goals.length < 5 && (sheet(SHEETS.newgoal()), closeSheet()); const bf = snap(); S.goals.push({id:'gx1', name:'Temp goal', ic:'star', saved:0, target:50000, pace:0, date:'2028-06-01', rules:offRules()}); undoable(bf, 'Temp goal added'); const uG = UCH.fn; const bf2 = snap(), rg0 = ruleGoal().id; ownRules(goalById(rg0)).rr.on = !rulesOf(goalById(rg0)).rr.on; const wasP = rulesOf(goalById(rg0)).rr.on; undoable(bf2, 'Rule changed'); uG(); const keepsRule = !!goalById(rg0) && rulesOf(goalById(rg0)).rr.on === wasP && S.goals.length === n0; hideChip(true);
      ok('chk-undo-scope-single: Undo reverses only its own move: with a 3 000 and a 4 000 transfer, undoing the first puts back 3 000 and leaves the 4 000 move; a goal Undo does not touch a later rule change; balances move by the amount, never back to an old total', both && onlyA && allBack && keepsRule, [both, onlyA, allBack, keepsRule]);
    } catch(e){ ok('chk-phase2: the new checks ran without errors', false, String(e && e.stack || e)); }
    finally { hideChip(true); PEND = null; S = sv9; cur = cur9; stack.push(...stk9); demo.locked = lock9; try{ closeSheet(); renderAll(); }catch(e){} document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', views9[i])); }
  }
  { // Phase 3: one goal wizard, saving rules sheet, Edit with money, Goal reached, Keep my 3.0% request (flows A2, A3, A4, B2, C5; decisions D2, D8, D9)
    const sv10 = S, cur10 = cur, stk10 = stack.splice(0), lock10 = demo.locked, views10 = [...document.querySelectorAll('.view')].map(v => v.classList.contains('on')); demo.locked = false;
    const pl = h => String(h).replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' '), nt = t => String(t).replace(/\s+/g, ' ').trim(), clk = sel => { const b = $(sel); if(b) b.click(); return !!b; };
    const reset = kind => { while(stack.length) popPage(true); try{ closeOnb(); }catch(e){} closeSheet(); MQ.q = []; hideChip(true); hideToast(true); S = fresh(kind); SETUP_COLLAPSED = false; renderAll(); };
    const setf = (id, v) => { const f = $('#' + id); f.value = v; f.dispatchEvent(new Event('input', {bubbles:true})); };
    try{
      // Simple Persely (flag on): the new-world equivalents of chk-one-wizard, chk-create-no-money and chk-first-goal-payday-only; then the old assertions run on the legacy first run
      const spW = {}; if(SPF){ try{
        reset('new'); const t4 = [...document.querySelectorAll('#v-hub .spfirst [data-tilepick]')].length; clk('#v-hub [data-tilepick="travel"]');
        const cA = $('#onb').classList.contains('on') && !!$('#onb .spconfirm'), bA = pl($('#onb .onb-body').innerHTML);
        clk('#onb [data-spback]'); const backTab = !$('#onb').classList.contains('on') && !!$('#v-hub .spfirst');
        clk('#v-hub [data-spmore]'); const old6 = sheetOpen() && document.querySelectorAll('#sheet [data-tilepick]').length === 6; clk('#sheet [data-tilepick="car"]'); const carC = !!$('#onb .spconfirm') && /Driving licence/.test(pl($('#onb').innerHTML)); O.sp = false; closeOnb();
        reset('existing'); clk(viaMore('#v-hub [data-sheet="newgoal"]')); const s4 = document.querySelectorAll('#sheet [data-tilepick]').length; clk('#sheet [data-tilepick="travel"]'); const bB = pl($('#onb .onb-body').innerHTML);
        clk('#onb [data-spback]'); const backSheet = sheetOpen() && /What are you saving for\?/.test($('#sheet').textContent); closeSheet();
        spW.wizard = t4 === 4 && s4 === 4 && cA && backTab && old6 && carC && backSheet && /Trip/.test(bA) && /Trip/.test(bB) && /On payday, Persi asks to save 10%/.test(bA) && /No deposit/.test(bB);
        reset('existing'); const jb = acc('junior').v, t0 = total(), x0 = S.tx.length; spOpen('safety'); const lab = nt($('#onb [data-spsave]').textContent); clk('#onb [data-spsave]');
        const ng = S.goals[S.goals.length - 1]; spW.noMoney = lab === 'Create goal' && ng.name === 'Safety net' && acc('junior').v === jb && total() === t0 && S.tx.length === x0 && ng.saved === 0 && !SP.rewardOn; hideChip(true);
        reset('new'); let asked = 0; const rp = window.Notification && Notification.requestPermission; if(rp) Notification.requestPermission = () => { asked++; return Promise.resolve('default'); };
        const j1 = acc('junior').v; spOpen('travel'); const lab1 = nt($('#onb [data-spsave]').textContent); SP.celebrated = false; clk('#onb [data-spsave]'); const g1 = S.goals[0];
        spW.oneK = lab1 === 'Save 1 000 Ft now' && acc('junior').v === j1 - 1000 && total() === 1000 && S.goals.length === 1 && S.onboarded;
        spW.payOnly = !!g1 && g1.rules.pay.on && g1.rules.pay.pct === 10 && !g1.rules.wk.on && !g1.rules.rr.on && S.ruleGoal === g1.id && !MQ.q.some(x => x.id === 'nudge' || x.id === 'firstadd') && !sheetOpen() && S.nudgeAsk === 'wait' && asked === 0;
        if(rp) Notification.requestPermission = rp; spHideReward(true); hideChip(true);
      }catch(e){ spW.err = String(e && e.stack || e); } }
      spLeg(true);
      // one wizard behind every entry: the tile chooser on the tab and New + open the same step 1
      reset('new'); const tilesN = [...document.querySelectorAll('#v-hub [data-tilepick]')].length; clk('#v-hub [data-tilepick="travel"]'); const bodyA = $('#onb .onb-body').innerHTML, onA = $('#onb').classList.contains('on'), topA = nt($('#onb').textContent);
      clk('[data-onbback]'); const backTiles = !$('#onb').classList.contains('on') && !!$('#v-hub #setupcard');
      reset('existing'); clk('#v-hub [data-sheet="newgoal"]'); const sheetTiles = [...document.querySelectorAll('#sheet [data-tilepick]')].length; clk('#sheet [data-tilepick="travel"]'); const bodyB = $('#onb .onb-body').innerHTML, onB = $('#onb').classList.contains('on');
      const stepOne = (b => /Step 1 of 3/.test(b) && /Your goal/.test(b) && /50 000 Ft/.test(b) && /500 000 Ft/.test(b) && /By when\?/.test(b) && /data-pkmonth/.test(bodyB))(pl(bodyB));
      clk('[data-onbback]'); const backSheet = !$('#onb').classList.contains('on') && sheetOpen() && /What are you saving for\?/.test($('#sheet').textContent); closeSheet();
      reset('existing'); startOnb('custom'); const whyT = nt($('#onb .onb-why').textContent), nextOff = $('#onb [data-onbnext]').disabled; clk('[data-onbquit]'); const draftQ = /Save as draft\?/.test($('#sheet').textContent); closeSheet(); closeOnb();
      reset('existing'); startOnb('travel'); setf('onbName', 'Gym'); pkSet('onb', 2000); const minTxt = nt($('#onb .pkcap').textContent), minOff = $('#onb [data-onbnext]').disabled && /Minimum is 5 000 Ft/.test(nt($('#onb .onb-why').textContent)); pkSet('onb', 600000); const capTxt = nt($('#onb .pkcap').textContent); closeOnb();
      const oneNoPage = !/data-cgnew|data-cgpreset/.test(SHEETS.newgoal()) && PAGES.create.title === 'Edit goal' && typeof PAGES.create.html === 'function';
      ok('chk-one-wizard: the tile chooser (Persely tab setup card) and New + (the tile sheet) both open the same step 1 "Your goal" (Name, Amount with chips 50 000 to 500 000 Ft, By when with the month sheet); Back on step 1 returns to the tiles (card or sheet); disabled Next shows its reason; amounts under 5 000 Ft say "Minimum is 5 000 Ft"; above 500 000 Ft "3.0% applies to the first 500 000 Ft"; Not now asks "Save as draft?"; the old New + page is gone (Edit goal keeps its own page)',
        tilesN === 6 && sheetTiles === 6 && onA && onB && bodyA.replace(/until [^.<]*\./, '') === bodyB.replace(/until [^.<]*\./, '') && stepOne && backTiles && backSheet && whyT === 'Give your goal a name' && nextOff && draftQ && /Minimum is 5 000 Ft/.test(minTxt) && minOff && /3\.0% applies to the first 500 000 Ft/.test(capTxt) && oneNoPage && (!SPF || spW.wizard), [spW, tilesN, sheetTiles, onA, onB, bodyA === bodyB, stepOne, backTiles, backSheet, whyT, nextOff, draftQ, minTxt, minOff, capTxt, oneNoPage]);

      // Create goal moves no money, lands on the new goal's page with the goal highlighted
      reset('existing'); const jb = acc('junior').v, tot0 = total(), tx0 = S.tx.length, n0 = S.goals.length; startOnb('safety'); O.i = 2; renderOnb();
      const step3 = pl($('#onb').innerHTML), only3 = (SIMPLE_PERSELY ? /data-sheet="ratesafe"/.test($('#onb').innerHTML) : /Good to know/.test(step3)) && /Create goal/.test(step3) && !/First deposit|Weekly reminder/.test(step3) && /moves no money/.test(step3); clk('[data-onbcreate]');
      const ng = S.goals[S.goals.length - 1], pg = stack[stack.length - 1], noMoney = acc('junior').v === jb && total() === tot0 && S.tx.length === tx0 && S.goals.length === n0 + 1 && ng.saved === 0;
      const landed = !!pg && pg.dataset.id === 'goal' && S._detail === ng.id && !!pg.querySelector('.card.hl') && !$('#onb').classList.contains('on');
      ok('chk-create-no-money: "Create goal" (step 3 with Good to know, no first deposit) moves no money (Junior balance, Persely total and transactions unchanged, the goal holds 0 Ft), sets onboarded, and lands on the new goal page with the goal highlighted; Simple Persely on: "Create goal" (No deposit) on the confirm screen moves no money and "Save 1 000 Ft now" moves exactly 1 000 Ft (D2)', only3 && noMoney && landed && S.onboarded && (!SPF || (spW.noMoney && spW.oneK)), [spW.noMoney, spW.oneK, only3, noMoney, landed, ng && ng.saved]);

      // first goal: Payday rule only at 10%, the lines, matched presets, the two follow-up beats, the system prompt only from Turn on
      reset('new'); let asked = 0; const rp0 = window.Notification && Notification.requestPermission; if(rp0) Notification.requestPermission = () => { asked++; return Promise.resolve('default'); };
      startOnb('travel'); const defaults = O.payOn && O.pct === 10 && !O.weeklyOn && !O.roundOn; O.i = 1; renderOnb(); const s2 = pl($('#onb').innerHTML);
      const lines = /Keeps 20 000 Ft on your account; if money is tight, less or nothing moves/.test(s2) && /A 1 190 Ft coffee moves 20 Ft; we double it/.test(s2);
      const presetsOk = Object.keys(GOAL_PRESETS).every(k => { startOnb(k); const f = fcCalc(O.target, 0, onbMonthly(), O.date); return f.over; }) && (() => { startOnb('custom'); return fcCalc(O.target, 0, onbMonthly(), O.date).over; })();
      startOnb('travel'); O.i = 2; renderOnb(); clk('[data-onbcreate]'); const g1 = S.goals[0];
      const rulesOk = g1.rules.pay.on && g1.rules.pay.pct === 10 && !g1.rules.wk.on && !g1.rules.rr.on && payPct() === 10 && S.ruleGoal === g1.id && S.onboarded;
      const q = MQ.q.filter(x => x.k === 'sheet').map(x => x.id), beat1 = q.includes('firstadd') && q.includes('nudge'); const fa = MQ.q.find(x => x.id === 'firstadd').fn(), nu = MQ.q.find(x => x.id === 'nudge').fn(); S._fa = false;
      const beats = /Start your streak\?/.test(fa) && /Add money now/.test(pl(fa)) && (SIMPLE_PERSELY ? /id="mv"[^>]*value="1000"/ : /id="mv"[^>]*value=""/).test(fa) && /data-setv="500"/.test(fa) && /Want a Sunday nudge\?/.test(nu) && /Turn on/.test(nu) && /Not now/.test(nu) && asked === 0;
      if(rp0) Notification.requestPermission = rp0;
      ok('chk-first-goal-payday-only: the first goal defaults to the Payday rule only at 10% (Weekly transfer and Round-ups off) with the lines "Keeps 20 000 Ft on your account; if money is tight, less or nothing moves" and "A 1 190 Ft coffee moves 20 Ft; we double it"; every preset and Something else opens with a forecast that reaches the amount by its date; after Create goal come "Start your streak?" (empty amount) and "Want a Sunday nudge?", and no system permission is asked before Turn on',
        defaults && lines && presetsOk && rulesOk && beat1 && beats && (!SPF || spW.payOnly), [spW.payOnly, defaults, lines, presetsOk, rulesOk, q, beats, asked]);

      // re-pointing a rule is announced
      reset('existing'); S.ruleGoal = 'holiday'; setMain(S, 'rr', true); setMain(S, 'pay', true); startOnb('safety'); O.i = 1; O.roundOn = true; renderOnb(); const s2b = pl($('#onb').innerHTML), want = 'Round-ups are shared equally with Summer holiday';
      O.i = 2; renderOnb(); clk('[data-onbcreate]'); const ngg = S.goals[S.goals.length - 1], tt = nt(($('#toast') || {}).textContent || ''), moved = ngg.rules.rr.on && goalById('holiday').rules.rr.on && goalById('holiday').rules.pay.on && S.ruleGoal === 'holiday' && !/instead of/.test(s2b + tt);
      S._detail = 'holiday'; pushPage('goal'); clk('.page [data-grtog="rr:holiday"]'); const ch = nt(($('#uchip') || {}).textContent || ''), back = !goalById('holiday').rules.rr.on && ngg.rules.rr.on; popPage(true); hideChip(true);
      ok('chk-rule-repoint-message (now the allocation hint): with Round-ups on for Summer holiday, the wizard says "Round-ups are shared equally with Summer holiday" instead of re-pointing, the toast says they are shared, Summer holiday keeps its own rules, and switching them off on its page is its own change with Undo', s2b.includes(want) && moved && /Round-ups are shared equally between 2 goals/.test(tt) && back && /Round-ups off for Summer holiday/.test(ch), [s2b.includes(want), moved, tt, ch]);

      // Edit with money inside, Save + Undo; delete with money asks where it goes
      reset('existing'); const ps = goalById('ps5'), sv0 = gSaved(ps); S._detail = 'ps5'; pushPage('goal'); const gp = pl(PAGES.goal.html()), noBlock = !/Take your money out first|Take all .* out/.test(gp) && /Edit goal/.test(gp) && /Delete goal/.test(gp);
      clk('.page [data-gedit="ps5"]'); const onEdit = stack[stack.length - 1].dataset.id === 'create' && S._draft && S._draft.edit === 'ps5'; setf('cgName', 'Console fund'); S._draft.target = 260000; S._draft.date = '2027-03-01'; S._draft.ic = 'star'; refreshPages(); clk('.page [data-cgsave]');
      const edited = ps.name === 'Console fund' && ps.target === 260000 && ps.date === '2027-03-01' && ps.ic === 'star' && gSaved(ps) === sv0 && S.tx.every(x => x.note !== 'PS5 + GTA VI'), chip1 = UCH.on && /Console fund saved/.test($('#uchip').textContent); clk('[data-undo]');
      const undone = ps.name === 'PS5 + GTA VI' && ps.target === 230000 && gSaved(ps) === sv0; hideChip(true);
      S._del = 'ps5'; sheet(SHEETS.gdel()); const dt = nt($('#sheet').textContent), moveT = dt.includes(`Move ${nt(ft(sv0))} to Junior account and delete`) && dt.includes(`Move ${nt(ft(sv0))} to Summer holiday and delete`);
      const jb4 = acc('junior').v, jh = gSaved(goalById('holiday')); clk('#sheet [data-gdelok="ps5"][data-dest="junior"]'); const gone = !goalById('ps5') && acc('junior').v === jb4 + sv0, chip2 = UCH.on; clk('[data-undo]'); const back2 = !!goalById('ps5') && gSaved(goalById('ps5')) === sv0 && acc('junior').v === jb4; hideChip(true);
      S._del = 'ps5'; sheet(SHEETS.gdel()); clk('#sheet [data-gdelok="ps5"][data-dest="holiday"]'); const toGoal = !goalById('ps5') && gSaved(goalById('holiday')) === jh + sv0 && acc('junior').v === jb4; hideChip(true);
      ok('chk-edit-with-money: a goal with 46 000 Ft inside edits (name, amount, date, icon) in one page with Save and a 10 s Undo that puts it back; there is no "take your money out first" block; Delete with money offers "Move 46 000 Ft to Junior account / another goal and delete" with Undo, and no money is lost either way',
        noBlock && onEdit && edited && chip1 && undone && moveT && gone && chip2 && back2 && toGoal, [noBlock, onEdit, edited, chip1, undone, moveT, gone, chip2, back2, toGoal]);

      // Goal reached card
      reset('existing'); const gr = goalById('fest'); gr.saved = 192881; gr.target = 134000; S.ruleGoal = 'fest'; setMain(S, 'pay', true); S._detail = 'fest'; const rp = PAGES.goal.html(), rt = pl(rp);
      const card = /You did it: Festival ticket is fully saved/.test(rt) && /data-outgoal="fest"/.test(rp) && /data-sheet="newgoal"/.test(rp) && /data-keepsaving="fest"/.test(rp) && /Withdraw/.test(rt) && /New goal/.test(rt) && /Keep saving/.test(rt);
      const capped = /134 000 Ft of 134 000 Ft/.test(rt) && !/192 881 Ft of/.test(rt) && /Reached/.test(rt) && /Reached/.test(pl(tabAll())) && !/192 881 Ft of 134 000/.test(pl(tabAll()));
      const stay = S.ruleGoal === 'fest' && rulesOf(gr).pay.on && (spOn() ? /You did it! Festival ticket is full\./.test(pl(vHub())) : /You did it: Festival ticket/.test(persiSays().text));   // SIMPLE_PERSELY: Persi priority 2 on the tab
      pushPage('goal'); clk('.page [data-keepsaving="fest"]'); const kept = gr.cont === true && !/You did it/.test(pl(PAGES.goal.html())) && S.ruleGoal === 'fest' && /Reached/.test(pl(PAGES.goal.html())); hideChip(true);
      ok('chk-goal-reached-card: a reached goal shows "You did it: [goal] is fully saved" with Withdraw, New goal and Keep saving; progress reads "Reached" with the amount capped (no "192 881 Ft of 134 000 Ft"); the rules stay on the goal and Persi says it until the user chooses; Keep saving hides the card and keeps the rules', card && capped && stay && kept, [card, capped, stay, kept]);

      // Recurring transfer merged into Weekly transfer
      reset('existing'); const tr = vUtalas(), rs = SHEETS.saverules(); pushPage('persely'); const pd = cur === 'hub' && !stack.length ? 'redirect' : '';
      sheet(SHEETS.saverules()); const wkRow = document.querySelectorAll('#sheet [data-goalrules]').length === plainGoals().length && plainGoals().length > 0; closeSheet();
      clk('#v-utalas [data-saverules="wk"]'); const opens = sheetOpen() && /Saving rules/.test($('#sheet').textContent) && !!$('#sheet [data-srblock="wk"].focus'); closeSheet();
      const old = JSON.parse(JSON.stringify(fresh('existing'))); old.persely.auto = true; old.persely.amt = 4000; old.weekly = {on:false, amt:2000}; migrateRules(old);   // the load-time migration (old recurring transfer -> the main goal's Weekly transfer)
      const mig = !old.persely.auto && old.goals.find(g => g.id === 'holiday').rules.wk.on && old.goals.find(g => g.id === 'holiday').rules.wk.amt === 4000 && !old.weekly;
      ok('chk-recurring-merged: Transfer > Scheduled and recurring transfers opens Saving rules with the Weekly transfer hint (per goal now); there is no separate Recurring transfer page, no Monthly frequency or Frequency picker; Saving rules lists every goal; an old saved recurring transfer becomes the main goal\'s Weekly transfer', /data-saverules="wk"/.test(tr) && !/data-go="rendszeres"/.test(tr) && pd === 'redirect' && PAGES.persely === undefined && PAGES.rendszeres === undefined && !/Monthly|Frequency/.test(pl(rs)) && wkRow && opens && mig, [wkRow, opens, mig, PAGES.rendszeres === undefined]);

      // Keep my 3.0%: request, confirm, pending, salary, Graduate; expired
      reset('existing'); S.juniorDays = 20; renderAll(); const gh = PAGES.grad.foot(), reqBtn = /data-keepreq/.test(gh) && /Request to keep 3\.0%/.test(gh) && !/data-keeprate/.test(gh);
      pushPage('grad'); clk('.page [data-keepreq]'); const cs = pl($('#sheet').innerHTML), conf = /Request to keep 3\.0%\?/.test(cs) && /500 000 Ft/.test(cs) && /28% tax/.test(cs) && /30 days' notice/.test(cs) && /data-keepok/.test($('#sheet').innerHTML) && !S.keep.pending;
      clk('#sheet [data-keepok]'); const hubT = pl(tabAll()), homeT = pl(vFooldal()), pend = S.keep.pending && !S.bridge && /Waiting for your first salary at OTP · 6 months left/.test(hubT) && /Waiting for your first salary at OTP · 6 months left/.test(homeT) && /^Junior/.test(juniorPill()) && !/Graduate/.test(juniorPill());
      MQ.q = []; const st0 = S.months; salaryArrives(); hideBanners(); const grad = S.bridge && !S.keep.pending && /^Graduate 3\.0%/.test(juniorPill()); MQ.q = []; hideToast(true);
      reset('existing'); S.juniorDays = 0; renderAll(); const ex = pl(PAGES.grad.html()), expired = /Your Junior package ended today/.test(ex) && /Request to keep 3\.0%/.test(PAGES.grad.foot());
      ok('chk-keep-pending: "Request to keep 3.0%" opens a confirm sheet with the conditions; Confirm makes the state pending ("Waiting for your first salary at OTP · 6 months left" on Home and the tab) while the badge stays Junior; the salary arriving (key P) turns it to Graduate 3.0%; at 0 days the page says "Your Junior package ended today"', reqBtn && conf && pend && grad && expired, [reqBtn, conf, pend, grad, expired]);

      // one weekly figure on the wizard, the goal card and the goal page
      reset('existing'); startOnb('travel'); const wiz = pkMath(O.target, O.date).wk, tgt = O.target, dt1 = O.date; O.i = 1; renderOnb(); const w2 = pl($('#onb').innerHTML).includes(`${nt(ft(wiz))} a week`);
      O.i = 0; renderOnb(); const w1 = pl($('#onb').innerHTML).includes(`${nt(ft(wiz))} a week`); O.i = 2; renderOnb(); clk('[data-onbcreate]'); const ng2 = S.goals[S.goals.length - 1], pageT = pl(PAGES.goal.html()), cardT = pl(tabAll()), fig = nt(ft(weeklyOf(ng2)));
      ok('chk-forecast-one-figure: the same goal shows ONE weekly amount on the wizard (steps 1 and 2), the goal card and the goal page: weeklyNeed(amount, saved, date) in 100 Ft steps', wiz > 0 && wiz === weeklyNeed(tgt, 0, dt1) && wiz === weeklyOf(ng2) && w1 && w2 && cardT.includes(`about ${fig} a week`) && pageT.includes(`${fig} a week`) && ng2.date === dt1 && ng2.target === tgt, [wiz, fig, w1, w2, cardT.includes(`about ${fig} a week`), pageT.includes(`${fig} a week`)]);
    } catch(e){ ok('chk-phase3: the new checks ran without errors', false, String(e && e.stack || e)); }
    finally { hideChip(true); PEND = null; MQ.q = []; hideToast(true); try{ closeOnb(); }catch(e){} while(stack.length) popPage(true); spLeg(false); S = sv10; cur = cur10; stack.push(...stk10); demo.locked = lock10; try{ closeSheet(); renderAll(); }catch(e){} document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', views10[i])); }
  }
  { // Phase 4: placement (flow plan 3.2 to 3.7, B5, C1; decisions D4, D7, D13)
    const sv12 = S, cur12 = cur, stk12 = stack.splice(0), lock12 = demo.locked, views12 = [...document.querySelectorAll('.view')].map(v => v.classList.contains('on')); demo.locked = false;
    const pl = h => String(h).replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' '), nt = t => String(t).replace(/\s+/g, ' ').trim(), clk = sel => { const b = $(sel); if(b) b.click(); return !!b; };
    const reset = kind => { while(stack.length) popPage(true); try{ closeOnb(); }catch(e){} closeSheet(); MQ.q = []; hideChip(true); hideToast(true); S = fresh(kind); SETUP_COLLAPSED = false; renderAll(); };
    const top = () => stack.length ? stack[stack.length - 1].dataset.id : '', pos = (h, k) => h.indexOf(k), inOrder = (h, ks) => ks.every((k, i) => pos(h, k) > -1 && (i === 0 || pos(h, k) > pos(h, ks[i - 1])));
    const toastNow = () => { const t = $('#toast'); return {on:t.classList.contains('on'), text:nt(t.textContent), tag:nt((t.querySelector('.dtag') || {}).textContent || ''), role:t.getAttribute('role')}; };
    const area = (h, sel) => { const d = document.createElement('div'); d.innerHTML = h; return [...d.querySelectorAll(sel)]; };
    try{
      // More: Profile and Settings on top, then Money, Persely, Help; all 24 old rows kept; own icons
      reset('existing'); tab('tovabbiak');
      const mh = vTovabbiak(), secs = area(mh, '.sec span').map(x => nt(x.textContent)), labels = area(mh, '.mi span, .mtop span').map(x => nt(x.textContent));
      const OLD = ['My cards', 'Notifications', 'Financial analyst', 'My accounts', 'Persely', 'Savings options', 'Spending', 'Perks', 'For you', 'Settings', 'My partners', 'Mobile top-up', 'Click to Pay', 'Motorway vignette', 'Documents', 'Invite a friend!', 'OTP branches and ATMs in Hungary', 'ATMs abroad', 'Exchange rates', 'QR reader', 'Book a branch appointment', 'Can we help?', 'Block internet and mobile bank access', 'Log out'];
      const missing = OLD.filter(r => !labels.includes(r)), grp = name => { const i = mh.indexOf('<span>' + name + '</span></div>'), j = [mh.indexOf('<span>Money</span></div>'), mh.indexOf('<span>Persely</span></div>'), mh.indexOf('<span>Help</span></div>'), mh.length].filter(x => x > i).sort((a, b) => a - b)[0]; return area(mh.slice(i, j), '.mi span').map(x => nt(x.textContent)); };
      const gMoney = grp('Money'), gPer = grp('Persely'), gHelp = grp('Help'), icons = area(mh, '.mi > svg, .mi-main > svg, .mtop svg').map(x => x.innerHTML), uniqueIcons = new Set(icons).size === icons.length;
      const topRow = area(mh, '.mtop button').map(x => nt(x.textContent)), sw = area(mh, '.mi.sw [role="switch"]').length === 1, tap = [...document.querySelectorAll('#v-tovabbiak .mtop button, #v-tovabbiak .mi')].every(b => b.offsetHeight >= 44);
      const rowGo = (name, attr) => area(mh, '.mi').some(b => nt(b.textContent) === name && b.matches(attr));
      ok('chk-more-groups: More has Profile and Settings on top, then Money, Persely and Help; every one of the 24 old rows is kept (Spending replaces Spending tracker); Persely and Savings options open the Persely tab; Financial analyst is a switch row; every row has its own icon (Financial analyst and Savings options differ); rows are 44 px', topRow.join() === 'Profile,Settings' && secs.join() === 'Money,Persely,Help' && missing.length === 0 && !/Spending tracker/.test(pl(mh)) && gMoney.join() === 'My accounts,My cards,Spending,Mobile top-up,Click to Pay,Motorway vignette,Exchange rates,QR reader,Documents' && gPer.join() === 'Persely,Savings options,Perks,My partners,Financial analyst,For you' && /Financial analyst/.test(pl(mh)) && gHelp.join() === 'Notifications,How Persely works,Can we help?,Invite a friend!,OTP branches and ATMs in Hungary,ATMs abroad,Book a branch appointment,Block internet and mobile bank access,Log out' && rowGo('Persely', '[data-tab="hub"]') && rowGo('Savings options', '[data-tab="hub"]') && rowGo('Spending', '[data-go="mymoney"]') && sw && uniqueIcons && tap, [topRow, secs, missing, gMoney, gPer, gHelp, uniqueIcons, tap]);

      // one demo toast: every shell row says the same thing the same way
      const rowsM = [...document.querySelectorAll('#v-tovabbiak [data-demo]')], names = [];
      let uniform = rowsM.length > 0; rowsM.forEach(b => { hideToast(true); b.click(); const t = toastNow(), nm = b.dataset.demo; names.push(nm); if(!(t.on && t.text === 'Demo ' + nm + ' is not part of this demo. It works as in the OTP app.' && t.tag === 'Demo' && t.role === 'status')) uniform = false; });
      tab('utalas'); const rowsT = [...document.querySelectorAll('#v-utalas [data-demo]')]; let uniT = rowsT.length === 4; rowsT.forEach(b => { hideToast(true); b.click(); const t = toastNow(); if(!(t.on && t.text === 'Demo ' + b.dataset.demo + ' is not part of this demo. It works as in the OTP app.')) uniT = false; });
      pushPage('kartyaim'); const rowsC = [...document.querySelectorAll('.page [data-demo]')]; let uniC = rowsC.map(b => b.dataset.demo).join() === 'Change daily limit,View card details,Click to Pay'; rowsC.forEach(b => { hideToast(true); b.click(); const t = toastNow(); if(!(t.on && t.text === 'Demo ' + b.dataset.demo + ' is not part of this demo. It works as in the OTP app.')) uniC = false; }); popPage(true);
      pushPage('neked'); const nk = [...document.querySelectorAll('.page [data-demo]')]; let uniN = nk.length === 2; nk.forEach(b => { hideToast(true); b.click(); if(!/is not part of this demo/.test(toastNow().text)) uniN = false; }); popPage(true);
      hideToast(true); demoToast('Share'); const shareT = toastNow(); hideToast(true);
      const allHtml = [vFooldal(), vHub(), vTovabbiak(), vUtalas(), vTranz(), vKartyaim(), PAGES.neked.html(), ...Object.values(SHEETS).filter(f => f.length === 0).map(f => { try{ return f(); }catch(e){ return ''; } })].join(' ');
      ok('chk-demo-toast-uniform: the 12 More shell rows (the rest of the 24 old rows open real screens since Phase 6: Profile, Settings, Notifications, Perks, My partners), 4 Transfer rows, 3 card rows, 2 For you cards and Share show one toast: "[Row name] is not part of this demo. It works as in the OTP app.", a Demo tag, role="status", 3 s; no old variant is left in the markup', rowsM.length === 12 && uniform && uniT && uniC && uniN && shareT.on && shareT.text === 'Demo Share is not part of this demo. It works as in the OTP app.' && DEMO_TOAST_MS === 3000 && /DEMO_TOAST_MS/.test(showToast.toString()) && !/data-toast=/.test(allHtml) && !/not available in the demo|hidden in the demo|Daily limit: 300|New features –|No active qvik/.test(pl(allHtml)) && typeof NA === 'undefined', [rowsM.length, uniform, uniT, uniC, uniN, shareT]);

      // no route opens the legacy Persely details
      reset('existing'); pushPage('persely'); const r1 = cur === 'hub' && !stack.length; pushPage('megtakaritas'); const r2 = cur === 'hub' && !stack.length;
      tab('tovabbiak'); clk('#v-tovabbiak [data-tab="hub"]'); const r3 = cur === 'hub'; tab('tovabbiak'); const sv = [...document.querySelectorAll('#v-tovabbiak .mi')].find(b => /Savings options/.test(b.textContent)); sv.click(); const r4 = cur === 'hub' && !stack.length;
      tab('tovabbiak'); const sp = [...document.querySelectorAll('#v-tovabbiak .mi')].find(b => /^\s*Spending\s*$/.test(b.textContent)); sp.click(); const r5 = top() === 'mymoney'; pushPage('kiadas'); const r6 = top() === 'mymoney'; while(stack.length) popPage(true);
      const homeAll = [vFooldal(), vHub(), vTovabbiak(), vUtalas(), vKartyaim(), PAGES.neked.html(), PAGES.goal.html()].join(' '); reset('new'); const newAll = [vFooldal(), vHub(), PAGES.neked.html()].join(' ');
      ok('chk-no-legacy-persely: the Persely details page and the Savings options page are gone; More > Persely, Savings options and any link to them open the Persely tab; the old Monthly spending page route opens the one Spending page; nothing links to them', PAGES.persely === undefined && PAGES.megtakaritas === undefined && !/Persely details/.test(Object.values(PAGES).map(p => typeof p.title === 'function' ? p.title() : p.title).join('|')) && r1 && r2 && r3 && r4 && r5 && r6 && !/data-go="(persely|megtakaritas|kiadas)"/.test(homeAll + newAll), [r1, r2, r3, r4, r5, r6]);

      // Home blocks in order
      reset('existing'); S.analyst.on = true; S.analyst.accepted = true; S.verified = true; renderAll(); const H = vFooldal(), hp = pl(H);
      const order = inOrder(H, ['class="hhead"', 'id="accs"', 'data-go="grad"', 'class="safebtn"', 'class="short"', 'class="card hubteaser"', 'My monthly spending', 'class="sec"><span>For you']), hdr = area(H, '.hhead button').map(b => b.getAttribute('aria-label')).join();
      tab('fooldal'); const sc = [...document.querySelectorAll('#v-fooldal .short button')], scT = sc.map(b => nt((b.querySelector('b') || b).textContent)).join(), scTap = sc.length === 3 && sc.every(b => b.offsetHeight >= 44 && b.offsetWidth >= 44);
      const goSc = []; sc.forEach(b => { b.click(); goSc.push(sheetOpen() ? 'sheet:' + nt($('#sheet h2').textContent) : top()); closeSheet(); while(stack.length) popPage(true); });
      const streakCard = /\d+-week streak/.test(pl(area(H, '.hubteaser')[0].innerHTML)) && area(H, '.hubteaser')[0].dataset.tab === 'hub';
      reset('new'); const spH = SPF ? (() => { tab('fooldal'); const c = $('#v-fooldal .sphome'), y = c ? Math.round(c.getBoundingClientRect().bottom - $('#phone').getBoundingClientRect().top) : 9999, one = document.querySelectorAll('#v-fooldal .hubteaser').length === 1 && !!$('#v-fooldal .annote.one') && !$('#v-fooldal .annote:not(.one)');
        if(c) c.click(); return {ok:!!c && /Save your first 1 000 Ft/.test(nt(c.textContent)) && y < 700 && one && cur === 'hub' && !!$('#v-hub .spfirst'), y, one}; })() : {ok:true};   // Simple Persely: one card above the fold, it opens the first-run tab
      spLeg(true); reset('new'); const HN = vFooldal(), tn = area(HN, '.hubteaser')[0], newCard = /Start your first goal/.test(tn.textContent) && tn.dataset.sheet === 'newgoal'; tab('fooldal'); clk('#v-fooldal .hubteaser'); const tiles = sheetOpen() && document.querySelectorAll('#sheet [data-tilepick]').length >= 6; closeSheet(); spLeg(false);
      ok('chk-home-order: Home runs header (avatar, bell, mail named For you), balance carousel, Junior line, Safe to spend, Quick actions (Add money to a goal, Pay a bill, Manage my card at 44 px), Persely card, My monthly spending, For you; Add money to a goal opens the shared sheet, Pay a bill the bills list, Card the card page; a new user\'s Persely card is "Start your first goal" and opens the tile chooser', order && /Profile and Settings,Notifications,For you/.test(hdr) && scT === 'Add money to a goal,Pay a bill,Manage my card' && scTap && goSc.join() === 'sheet:Add money,bills,kartyaim' && streakCard && newCard && tiles && spH.ok, [spH, order, hdr, scT, scTap, goSc, streakCard, newCard, tiles]);

      // Persely tab blocks in order, existing and new user
      spLeg(true);   // the old tab (?simple=0); with the flag on it runs on the legacy render, the simple tab is checked below
      reset('existing'); S.analyst.on = true; S.analyst.accepted = true; S.juniorDays = 300; renderAll(); const T1 = vHub();
      const base = ['Total in Persely', 'data-sheet="hubsave"', 'class="trust"', 'data-tour="goals"', 'Saving rules', 'data-go="grad"', 'Your habits', 'data-go="mymoney"', 'data-go="perks"'];
      const o1 = inOrder(T1, base), friendsLast = pos(T1, 'data-sheet="how"') > pos(T1, 'data-go="perks"');
      S.juniorDays = 60; renderAll(); const T2 = vHub(), o2 = inOrder(T2, ['Total in Persely', 'class="trust"', 'data-go="grad"', 'data-tour="goals"', 'Saving rules', 'Your habits']);
      S.months = 0; const noYear = !/data-go="year"/.test(T1); S.months = 12; const yr = vHub(), yearAfter = inOrder(yr, ['data-go="mymoney"', 'data-go="perks"', 'data-go="year"', 'data-sheet="how"']); S.months = 0;
      const noLate = !/class="card bfc"|Bills first/.test(T1 + T2);
      const goals44 = (() => { tab('hub'); const nb = $('#v-hub [data-sheet="newgoal"]'); return !!nb && nb.offsetHeight >= 44; })();
      reset('new'); const T3 = vHub(), o3 = inOrder(T3, ['id="setupcard"', 'Total in Persely', 'class="trust"', 'data-go="grad"', 'Your habits', 'data-sheet="how"']) && /Your streak starts with the first deposit/.test(pl(T3)), jrAbove = pos(T3, 'data-go="grad"') > pos(T3, 'id="setupcard"');
      ok('chk-tab-order: existing user: Total card, Add money and Withdraw with the trust line, Goals (New + at 44 px), Saving rules, Junior card, Your habits, Spending, Perks, Your year (only from month 12), How Persely works; the Junior card moves under the Total card with 90 days left; no late-bill card; new user: setup card first, Junior card never above it', o1 && friendsLast && o2 && noYear && yearAfter && noLate && goals44 && o3 && jrAbove, [o1, friendsLast, o2, noYear, yearAfter, noLate, goals44, o3, jrAbove]);
      spLeg(false);
      if(SPF){   // the simple tab (js/14b-simple-tab.js): 4 blocks, honesty line, More; the old rows sit on More in groups
        reset('existing'); S.analyst.on = true; S.analyst.accepted = true; S.juniorDays = 300; renderAll(); const T1 = vHub(), M1 = moreHTML();
        const o1 = inOrder(T1, ['class="tabtitle"', 'data-block="persi"', 'data-block="picture"', 'class="btn sp-add"', 'data-sheet="hubout"', 'data-block="streak"', 'class="sp-honest"', 'data-go="persmore"']) && !/data-go="grad"/.test(T1);
        S.juniorDays = 60; renderAll(); const T2 = vHub(), o2 = /Keep your 3\.0%\? 60 days left\./.test(pl(T2)) && inOrder(T2, ['data-block="persi"', 'data-go="grad"', 'data-block="picture"']);
        S.months = 12; const yr = vHub(), myr = moreHTML(), yearMore = !/data-go="year"/.test(T1 + yr) && !/data-go="year"/.test(M1) && inOrder(myr, ['data-go="mymoney"', 'data-go="perks"', 'data-go="year"', 'data-sheet="how"']); S.months = 0;
        const noLate = !/class="card bfc"|Bills first/.test(T1 + T2 + M1);
        const mo = inOrder(M1, ['data-more="goals"', 'data-goal=', 'data-sheet="newgoal"', 'data-more="rules"', 'data-sheet="moneyin"', 'data-more="rate"', 'data-sheet="ratesafe"', 'data-go="grad"', 'data-more="you"', 'data-go="habits"', 'data-go="mymoney"', 'data-go="perks"', 'data-frjoin', 'data-more="account"', 'data-go="inbox"', 'data-go="bills"', 'data-go="kartyaim"', 'data-sheet="how"', 'data-settings="persely"']);
        const goals44 = (() => { tab('hub'); clk('#v-hub [data-go="persmore"]'); const nb = $('.page [data-sheet="newgoal"]'), r = top() === 'persmore' && !!nb && nb.offsetHeight >= 44; while(stack.length) popPage(true); return r; })();
        reset('new'); const T3s = vHub(), spT3 = inOrder(T3s, ['class="tabtitle', 'class="spfirst"', 'data-tilepick="travel"', 'data-spmore']) && !/class="sring|class="hint"|id="setupcard"/.test(T3s);   // new user: Phase 1's first-run tab
        ok('chk-tab-order-simple: existing user: Persi, jars with the big number, Add money then Withdraw, streak, honesty line, More; with 90 days or less Persi points to the Junior page; More runs Goals (cards, New goal at 44 px), Saving rules (Money in), Your rate (Rate and safety, Keep my 3.0%), You (Habits, Spending, Perks, friends, Your year from month 12), Account (Notifications, Bills, My cards), How Persely works, Persely settings; no late-bill card; new user: the first-run tab (Persi, 4 tiles, More goals), no setup card, ring or hint', o1 && o2 && yearMore && noLate && mo && goals44 && spT3, [o1, o2, yearMore, noLate, mo, goals44, spT3]);
      }

      // table 3.6: one primary entry per feature that exists, and the allowed links
      reset('existing'); S.analyst.on = true; S.analyst.accepted = true; renderAll(); const E = {};
      const hubSel = sel => spOn() && /^#v-hub /.test(sel) && !/sp-act|persmore/.test(sel) ? (clk('#v-hub [data-go="persmore"]'), '.page:last-child ' + sel.replace(/^#v-hub (\.prow |\.sec )?/, '')) : sel;   // SIMPLE_PERSELY: the Persely rows are one tap behind the tab's More row
      // Spending: four doors, one page
      const doors = []; [['#v-fooldal .safebtn', 'fooldal'], ['#v-fooldal [data-go="mymoney"]:not(.safebtn)', 'fooldal'], ['#v-hub .prow [data-go="mymoney"]', 'hub'], ['#v-tovabbiak [data-go="mymoney"]', 'tovabbiak']].forEach(([sel, t]) => { tab(t); const b = $(hubSel(sel)); if(b){ b.click(); doors.push(top()); } else doors.push('missing:' + sel); while(stack.length) popPage(true); });
      E.spending = doors.every(x => x === 'mymoney');
      // Add money: tab, Home shortcut, goal page, Transfer > Between my accounts: all the same sheet and one From and To
      tab('hub'); clk(SIMPLE_PERSELY ? '#v-hub .sp-act [data-sheet="hubsave"]' : '#v-hub .hero-btns [data-sheet="hubsave"]'); const a1 = sheetOpen() && nt($('#sheet h2').textContent) === 'Add money'; closeSheet();
      tab('fooldal'); clk('#v-fooldal .short [data-sheet="hubsave"]'); const a2 = sheetOpen() && nt($('#sheet h2').textContent) === 'Add money'; closeSheet();
      S._detail = S.goals[0].id; pushPage('goal'); clk('.page [data-pickgoal]'); const a3 = sheetOpen() && nt($('#sheet h2').textContent) === 'Add money'; closeSheet(); while(stack.length) popPage(true);
      S._goal = 'ps5'; tab('utalas'); clk('#v-utalas [data-sheet="sajat"]'); const sj = $('#sheet'), a4 = sheetOpen() && /Between my accounts/.test(sj.textContent) && !!sj.querySelector('[data-mvfrom]') && !!sj.querySelector('[data-mvto]') && !!sj.querySelector('[data-mvfrom="g:holiday"]') && !!sj.querySelector('[data-mvto="a:megt"]') && sj.querySelector('[data-mvto].on').dataset.mvto === 'g:ps5' && sj.querySelector('[data-mvfrom].on').dataset.mvfrom === 'a:junior';
      clk('#sheet [data-mvto="g:fest"]'); const changed = $('#sheet [data-mvto].on').dataset.mvto === 'g:fest'; const j0 = acc('junior').v, f0 = goalById('fest').saved; $('#mv').value = '3000'; clk('#sheet [data-mvgo]'); const moved = acc('junior').v === j0 - 3000 && goalById('fest').saved === f0 + 3000 && !sheetOpen() && UCH.on; hideChip(true);
      E.addmoney = a1 && a2 && a3 && a4 && changed && moved;
      // Between my accounts: account to account and goal to account, same-place error
      tab('utalas'); clk('#v-utalas [data-sheet="sajat"]'); clk('#sheet [data-mvto="a:megt"]'); const s0 = acc('megt').v, j1 = acc('junior').v; $('#mv').value = '2000'; clk('#sheet [data-mvgo]'); const accMove = acc('megt').v === s0 + 2000 && acc('junior').v === j1 - 2000; hideChip(true);
      clk('#v-utalas [data-sheet="sajat"]'); clk('#sheet [data-mvto="a:junior"]'); $('#mv').value = '1000'; clk('#sheet [data-mvgo]'); const sameErr = sheetOpen() && /Choose two different places/.test($('#e-mv').textContent); closeSheet();
      E.between = accMove && sameErr;
      // Saving rules and the other Transfer rows
      tab('utalas'); clk('#v-utalas [data-saverules="wk"]'); const r1b = sheetOpen() && /Saving rules/.test($('#sheet').textContent) && !!$('#sheet [data-srblock="wk"].focus'); closeSheet();
      clk('#v-utalas [data-tab="tranzakciok"]'); const r2b = cur === 'tranzakciok'; tab('hub'); const g3 = plainGoals()[0]; clk(hubSel(`#v-hub .srlist [data-goalrules="${g3.id}"]`)); const r3b = top() === 'goal' && S._detail === g3.id && !!document.querySelector(`.page [data-rules="${g3.id}"]`); while(stack.length) popPage(true); S._detail = S.goals[0].id; pushPage('goal'); const r4b = /data-grtog/.test($('.page').innerHTML); while(stack.length) popPage(true);
      E.rules = r1b && r2b && r3b && r4b;
      // Card: Home shortcut and More > My cards open the one card page; block switch, round-ups, discounts
      tab('fooldal'); clk('#v-fooldal .short [data-go="kartyaim"]'); const c1 = top() === 'kartyaim'; const swb = $('.page .row .tg[data-freeze]'), blk = !!swb && swb.offsetHeight >= 44 && swb.getAttribute('role') === 'switch'; const f0b = S.frozen; if(swb) swb.click(); const blocked = S.frozen === !f0b; if(S.frozen !== f0b){ const s2 = $('.page .tg[data-freeze]'); if(s2) s2.click(); }
      ownRules(goalById('holiday')).rr.on = true; renderAll(); const rl = $('.page [data-saverules="rr"]'), ru = /Round-ups: on → Summer holiday/.test(nt($('.page').textContent)) && /Edit/.test(rl.textContent); rl.click(); const ruOpen = top() === 'goal' && S._detail === 'holiday' && !!document.querySelector('.page [data-grblock="rr"].focus'); popPage(true); clk('.page [data-go="perks"]'); const disc = top() === 'perks'; while(stack.length) popPage(true);
      tab('tovabbiak'); clk('#v-tovabbiak [data-go="kartyaim"]'); const c2 = top() === 'kartyaim'; while(stack.length) popPage(true);
      E.card = c1 && c2 && blk && blocked && ru && ruOpen && disc;
      // Bills: the Pay a bill shortcut; More > Notifications; Financial analyst switch; Your year; create goal
      tab('fooldal'); clk('#v-fooldal .short [data-go="bills"]'); E.bills = top() === 'bills'; while(stack.length) popPage(true);
      tab('tovabbiak'); clk('#v-tovabbiak [data-settings="notif"]'); E.notif = top() === 'settings' && !!$('.page [data-sec="notif"].focus'); while(stack.length) popPage(true);
      tab('tovabbiak'); const an0 = S.analyst.on; clk('#v-tovabbiak .mi.sw [data-sw="analyst"]'); E.analyst = an0 && sheetOpen() && !!document.querySelector('#sheet [data-anoffgo]'); clk('#sheet [data-anoffgo]'); E.analyst = E.analyst && S.analyst.on === false; hideChip(true); closeSheet(); S.analyst.on = true; renderAll();
      spLeg(true); tab('hub'); clk('#v-hub .sec [data-sheet="newgoal"]'); E.create = sheetOpen() && document.querySelectorAll('#sheet [data-tilepick]').length >= 6; closeSheet(); spLeg(false);   // the old tab
      if(SPF){ tab('hub'); clk(hubSel('#v-hub .sec [data-sheet="newgoal"]')); E.create = E.create && sheetOpen() && document.querySelectorAll('#sheet [data-tilepick]').length === 4 && !!$('#sheet [data-spmore]'); closeSheet(); while(stack.length) popPage(true); }   // Simple Persely: More > New goal, 4 tiles + More goals
      S.months = 12; renderAll(); tab('hub'); clk(hubSel('#v-hub [data-go="year"]')); E.year = top() === 'year'; S.months = 0; while(stack.length) popPage(true);
      tab('hub'); E.homeToTab = (() => { tab('fooldal'); clk('#v-fooldal .hubteaser'); return cur === 'hub'; })();
      const bad = Object.keys(E).filter(k => !E[k]);
      ok('chk-entry-map' + (SIMPLE_PERSELY ? ' (simple tab: the Persely rows are one tap behind the tab, on More)' : '') + ': every feature of table 3.6 that exists now has its one primary entry and only the allowed links: Spending (Home Safe to spend, Home Details, Persely tab row, More), Add money (tab, Home shortcut, goal page, Transfer > Between my accounts with From and To choosers), Saving rules (tab, goal page, Transfer > Scheduled and recurring), Previous transfers, Card (Home, More: block switch at 44 px, Round-ups, Discounts), Pay a bill, Notifications, Financial analyst switch, Create goal, Your year, Home > Persely tab', bad.length === 0, [bad, E]);
    } catch(e){ ok('chk-phase4: the new checks ran without errors', false, String(e && e.stack || e)); }
    finally { hideChip(true); PEND = null; MQ.q = []; hideToast(true); try{ closeOnb(); }catch(e){} while(stack.length) popPage(true); spLeg(false); S = sv12; cur = cur12; stack.push(...stk12); demo.locked = lock12; try{ closeSheet(); renderAll(); }catch(e){} document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', views12[i])); }
  }
  { // Phase 5: one Spending page, analyst on by default, story at month end, year page (flow plan C2, C3, C4, A5-3; decisions D3, D10)
    const sv13 = S, cur13 = cur, stk13 = stack.splice(0), lock13 = demo.locked, views13 = [...document.querySelectorAll('.view')].map(v => v.classList.contains('on')); demo.locked = false;
    const pl = h => String(h).replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' '), nt = t => String(t).replace(/\s+/g, ' ').trim(), clk = sel => { const b = $(sel); if(b) b.click(); return !!b; };
    const reset = kind => { while(stack.length) popPage(true); try{ closeOnb(); }catch(e){} try{ closeStory(); }catch(e){} closeSheet(); MQ.q = []; hideChip(true); hideToast(true); S = fresh(kind); SETUP_COLLAPSED = false; renderAll(); };
    const top = () => stack.length ? stack[stack.length - 1].dataset.id : '', cnt = (h, k) => (h.match(new RegExp('data-go="' + k + '"', 'g')) || []).length;
    const toastNow5 = () => nt($('#toast').textContent);
    const lateRent = () => { S.tx = S.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); };
    try{
      // chk-analyst-default-on: both seeds start with the analyst on; the opt-in entries are gone; bills, due dates, the late warning and recategorising work from the start
      reset('new'); const sN = fresh('new').analyst, sE = fresh('existing').analyst; tab('fooldal');
      const H0 = pl(vFooldal()), bf0 = billsFirst(), tx0 = S.tx.findIndex(t => txType(t) === 'card' && !t.parts); S._txi = tx0;
      const optIns = [vFooldal(), vHub(), myMoneyHTML(), vTovabbiak()].map(h => (h.match(/data-sheet="analyst"/g) || []).length);
      lateRent(); renderAll();
      ok('chk-analyst-default-on: the Financial analyst is on in both seeds (new and existing), Safe to spend, bills and due dates show from the start, a late bill shows its warning on Home, a payment can be recategorised, and the opt-in entries are gone (only the More switch row opens the analyst sheet)', sN.on && sE.on && sN.accepted && sE.accepted && /Safe to spend/.test(H0) && bf0.rows.length >= 6 && bf0.rows.every(r => r.bill.day > 0) && bfNow().on && /late/.test(pl(vFooldal())) && /Change category/.test(pl(SHEETS.txd())) && optIns[0] === 0 && optIns[1] === 0 && optIns[2] === 0 && optIns[3] === 1, [sN.on, sE.on, bf0.rows.length, optIns, bfNow().on]);

      // chk-analyst-notice: shown once on the first Home view, What it reads and Turn off (with a confirm), gone after it has been dealt with or left
      spLeg(true); reset('new'); tab('fooldal'); const n1 = pl(vFooldal()), raw1 = vFooldal(), has1 = !!document.querySelector('#v-fooldal .annote');
      clk('#v-fooldal [data-anread]'); const readT = pl($('#sheet').innerHTML), readOk = /Payee names, amounts and dates of your card and bank payments/.test(readT) && /Nothing leaves the bank/.test(readT); closeSheet();
      const gone1 = !/annote/.test(vFooldal()) && S.anNote === true;
      reset('new'); tab('fooldal'); tab('hub'); const gone2 = S.anNote === true && !/annote/.test(vFooldal());
      reset('new'); tab('fooldal'); clk('#v-fooldal [data-anask]'); const cf = pl($('#sheet').innerHTML), askOk = /Turn off the Financial analyst\?/.test(cf) && cf.includes('Safe to spend becomes a simpler estimate; bills stay on.') && S.analyst.on === true;
      clk('#sheet [data-closesheet]'); const keep = S.analyst.on === true; sheet(SHEETS.anoffcfm()); clk('#sheet [data-anoffgo]'); const offOk = S.analyst.on === false; hideChip(true);
      reset('existing'); const foot = pl(myMoneyHTML());
      tab('tovabbiak'); clk('#v-tovabbiak .mi.sw [data-sw="analyst"]'); const sw3 = sheetOpen() && S.analyst.on === true && /Turn off the Financial analyst\?/.test(pl($('#sheet').innerHTML)); closeSheet(); spLeg(false);
      // Simple Persely: the notice is one line under the Persely card, Learn more and Turn off with the same size and weight, gone after a tap
      const spA = !SPF || (() => { reset('new'); tab('fooldal'); const l = $('#v-fooldal .annote.one'); if(!l) return false; const bs = [...l.querySelectorAll('button')], st = b => { const c = getComputedStyle(b); return c.fontSize + c.fontWeight; };
        const t = nt(l.textContent), pos = $('#v-fooldal .sphome').compareDocumentPosition(l) & Node.DOCUMENT_POSITION_FOLLOWING;
        const good = t.includes('Your analyst reads your OTP payments to show Safe to spend. Nothing leaves OTP.') && bs.length === 2 && bs[0].dataset.anread !== undefined && bs[1].dataset.anask !== undefined && st(bs[0]) === st(bs[1]) && /Learn more/.test(bs[0].textContent) && /Turn off/.test(bs[1].textContent) && /CONFIRM WITH OTP \/ LEGAL: lawful basis/.test(vFooldal()) && !!pos;
        bs[0].click(); const gone = sheetOpen() && !/annote/.test(vFooldal()); closeSheet(); return good && gone; })();
      ok('chk-analyst-notice: first Home view shows "Your Financial analyst is on. It reads your transactions to show Safe to spend, bills and categories." with What it reads and Turn off, once (gone after a button or after leaving Home), the lawful-basis comment is in the markup, Turn off asks first ("Safe to spend becomes a simpler estimate; bills stay on."), the switch also lives in More and the Spending footer ("Financial analyst is on · Turn off")', has1 && n1.includes('Your Financial analyst is on.') && n1.includes('It reads your transactions to show Safe to spend, bills and categories.') && /What it reads/.test(n1) && /Turn off/.test(n1) && /CONFIRM WITH OTP \/ LEGAL: lawful basis/.test(raw1) && readOk && gone1 && gone2 && askOk && keep && offOk && /Financial analyst is on · Turn off/.test(foot) && sw3 && spA, {spA, has1, readOk, gone1, gone2, askOk, keep, offOk, foot: foot.slice(-80), sw3});

      // chk-analyst-off-fallback: off = Safe to spend is balance minus the upcoming direct debits, bills stay, only categories and the plan are hidden
      reset('existing'); const onS = safeToSpend(); S.analyst.on = false; renderAll(); const offS = safeToSpend(), mmOff = myMoneyHTML(); setMain(S, 'pay', true);
      const offS2 = safeToSpend(); setMain(S, 'pay', false); lateRent(); renderAll(); const home2 = pl(vFooldal()), bills2 = pl(billsHTML());
      S.analyst.on = true; S.closedYm = []; const first = pl(myMoneyHTML()); S.analyst.on = true;
      ok('chk-analyst-off-fallback: analyst off keeps Safe to spend (simple: balance minus bills still to pay, no saving rule or groceries), keeps the bills page and the late-bill card, hides only the plan ("Turn on to see your plan"); a first month says "We need a few weeks of payments to suggest a plan."', offS.simple && offS.safe === offS.balance - offS.unpaidBills && offS2.safe === offS.safe && onS.safe <= offS.safe && /Safe to spend/.test(pl(mmOff)) && /Turn on to see your plan/.test(pl(mmOff)) && !/My plan for/.test(mmOff) && /simpler estimate/.test(pl(mmOff)) && /late/.test(home2) && !/needs the financial analyst/.test(bills2) && /Must-pay bills/.test(bills2) && /Financial analyst is off · Turn on/.test(pl(mmOff)) && first.includes('We need a few weeks of payments to suggest a plan.'), [onS.safe, offS, offS2.safe, first.slice(0, 160)]);

      // chk-sts-top: Safe to spend is the first card of the Spending page, with the real number, visible without scrolling
      reset('existing'); tab('fooldal'); clk('#v-fooldal .safebtn'); const pg = stack[stack.length - 1], sc = pg ? pg.querySelector('.scroll') : null, card = sc ? sc.querySelector('.safebig') : null;
      const r1 = card ? card.getBoundingClientRect() : null, r2 = sc ? sc.getBoundingClientRect() : null, sts = safeToSpend().safe;
      const order = (() => { const h = myMoneyHTML(), ix = ['safebig', 'class="gauge"', 'data-go="bills"', 'My plan for', "Persi's tips", 'data-go="nextmonth"', 'Latest card payments', 'anfoot'].map(k => h.indexOf(k)); return ix.every((x, i) => x > -1 && (i === 0 || x > ix[i - 1])) || ix; })();
      ok('chk-sts-top: the Spending page opens with the Safe to spend card (the real number and "A guide, not a limit"), fully visible without scrolling, and the blocks follow the C2 order (circle, Bills, My plan, tips, Next month, Latest card payments, footer)', top() === 'mymoney' && card && nt(card.textContent).includes(nt(ft(sts))) && /A guide, not a limit/.test(card.textContent) && r1.top >= r2.top && r1.bottom <= r2.bottom && order === true, [top(), sts, r1 && r1.bottom, r2 && r2.bottom, order]);
      clk('#v-fooldal .safebtn') || 0; while(stack.length) popPage(true);

      // chk-two-spend-numbers: Card spending and Total out on Home and Spending (the same), Total out leaves out own-account moves, "Spent" never stands alone
      reset('existing'); const ym5 = shownMonth().ym, cs = cardSpending(), to = totalOut(), hh = nt(pl(vFooldal())), mm5 = nt(pl(myMoneyHTML())); const tx5 = S.tx.length;
      S.tx.unshift({...stamp(), d:'Today', n:'PERSELY DEPOSIT', s:'Between my accounts', a:-5000, ic:'wallet'}); const toOwn = totalOut(); S.tx.shift();
      S.tx.unshift({...stamp(), d:'Today', n:'SZABÓ DÓRA', s:'Transfer out', a:-1000, ic:'wallet'}); const toOut = totalOut(); S.tx.shift();
      const spentBad = [hh, mm5, pl(nextMonthHTML()), pl(billsHTML()), pl(vHub()), pl(SHEETS.safe())].map(t => (t.match(/\bSpent\b(?! on)/g) || []).length + (t.match(/\bspent so far\b/gi) || []).length);
      ok('chk-two-spend-numbers: Home and Spending both show "Card spending" and "Total out" with the same two figures; Total out (all money out except own-account moves) is more than Card spending, ignores a Persely deposit and counts a transfer out; "Spent" never appears alone', cs === sumVals(catSpend(ym5)) && to > cs && toOwn === to && toOut === to + 1000 && hh.includes(nt('Card spending ' + ft(cs))) && hh.includes(nt('Total out ' + ft(to))) && mm5.includes(nt('Card spending ' + ft(cs))) && mm5.includes(nt('Total out ' + ft(to))) && /\d+ days? left/.test(mm5) && S.tx.length === tx5 && spentBad.every(x => x === 0), [cs, to, toOwn, toOut, spentBad]);
      // the projection: balance now - bills still to pay - average daily card spending x days left
      { const pj = monthEndLeft(), s5 = safeToSpend(), mo5 = shownMonth(), want = Math.round((s5.balance - s5.unpaidBills - cardSpending() / mo5.today * mo5.left) / 100) * 100;
        ok('month end projection: "At this pace you finish the month with about X Ft left", X = balance now - unpaid must-pay bills - average daily card spending x days left (rounded to 100 Ft), shown once under the circle', pj.left === want && (mm5.includes(nt(`At this pace you finish the month with about ${ft(want)} left.`)) || mm5.includes(nt(`about ${ft(-want)} short`))), [pj.left, want, mm5.slice(0, 0)]); }

      // chk-story-month-end: the ring and the Home card exist only at month end; the demo keys M and E still reach it; a new month clears it; reopening restarts
      // SIMPLE_PERSELY: no ring at all before month end (no grey ring), at month end the ring around Persi (sp-ring) opens the story
      const ringOff = () => SIMPLE_PERSELY ? !/sp-ring|class="sring|data-storywait/.test(vHub()) : /sring off/.test(vHub()) && !/data-story[ >]/.test(vHub().match(/<[^>]*sring off[^>]*>/)[0]) && /Your story arrives on 30 November 2026/.test(vHub());
      const ringOn = () => SIMPLE_PERSELY ? /<button class="sp-ring[^"]*" data-story data-persi-ring/.test(vHub()) && !/data-storywait|class="sring/.test(vHub()) : /data-story/.test(vHub().match(/<[^>]*class="sring[^"]*"[^>]*>/)[0]) && !/sring off/.test(vHub());
      reset('existing'); tab('hub'); const ring0 = pl(vHub()), off0 = ringOff(), card0 = /Your November is ready/.test(vFooldal());
      S.monthEnd = true; renderAll(); const on1 = ringOn(), card1 = /Your November is ready/.test(pl(vFooldal()));
      openStory(); stGo(3); const was3 = ST.i === 3; closeStory(); openStory(); const restarted = ST.i === 0 && ST.t === 0; closeStory();
      const homeAfter = !/Your November is ready/.test(vFooldal()) && (SIMPLE_PERSELY ? /sp-ring seen/ : /sring seen/).test(vHub());
      const dm0 = DEMO_ON; setDemoMode(true); S.monthEnd = false; S.storySeen = false; unlockPhone(); dispatchEvent(new KeyboardEvent('keydown', {key:'m'})); const keyM = S.monthEnd === true && ST.on === true; closeStory();
      reset('existing'); dispatchEvent(new KeyboardEvent('keydown', {key:'e'})); const keyE = S.monthEnd === true && ST.on === true && S.period === 'Autumn semester'; closeStory(); reset('existing'); setDemoMode(dm0);
      S.monthEnd = true; monthStep(true); const cleared = S.monthEnd === false;
      ok('chk-story-month-end: before month end ' + (SIMPLE_PERSELY ? 'there is no ring on the simple tab (no grey ring)' : 'the ring is grey and not a story button ("Your story arrives on 30 November 2026")') + ' and Home has no story card; at month end the ring opens the story and Home shows "Your November is ready" until it is watched; demo key M and E reach it; a new month clears it; reopening a watched story restarts at slide 1', off0 && !card0 && on1 && card1 && was3 && restarted && homeAfter && keyM && keyE && cleared, {off0, card0, on1, card1, was3, restarted, homeAfter, keyM, keyE, cleared});

      // chk-story-see-details: the last slide has See details (opens Spending), Share (preview) and Close; every slide runs 2.5 s plus its words, at most 7 s (Denis's timing); the progress slide is about one goal
      reset('existing'); S.monthEnd = true; renderAll(); openStory(); const last = ST.slides.length - 1; stGo(last); const ft5 = nt($('#story .st-foot').textContent), btns = [...document.querySelectorAll('#story .st-foot button')].map(b => nt(b.textContent));
      const dur = id => { const x = ST.slides.find(y => y.id === id); return x ? x.dur : 0; }, others = ST.slides.filter(x => !x.end).map(x => x.dur), slowOk = others.every(d => d >= 2.5 && d <= 7) && ST.slides.filter(x => !x.end).every(x => Math.abs(x.dur - Math.min(7, 2.5 + ST_WPS * stWords(x))) < 1e-9);
      const prog = ST.slides.find(x => x.id === 'progress'), progT = prog ? pl(prog.build()) : '', gNames = S.goals.filter(g => progT.includes(g.name)).length;
      clk('#story [data-stshare]'); const shareT = toastNow5(); hideToast(true);
      clk('#story [data-stdetails]'); const det = top() === 'mymoney' && !ST.on; while(stack.length) popPage(true);
      ok('chk-story-see-details: the last slide offers See details, Share (preview) and Close; See details closes the story and opens the Spending page; Share shows the standard demo toast; every slide runs 2.5 s plus 0.17 s a word, at most 7 s; the progress slide names one goal', btns.join() === 'See details,Share (preview),Close' && det && /Share is not part of this demo/.test(shareT) && slowOk && prog && gNames === 1, [btns, det, shareT, others, gNames]);

      // chk-story-denis: Denis's Wrapped story from main in both seeds: his slide ids in his order, title first and share card last, no analytics slides, under 45 s a month, each slide its own colour, the share slide has the three actions
      { const ORDER = ['title', 'places', 'weekday', 'quiet', 'biggest', 'subs', 'wolt', 'put', 'progress', 'streak', 'share'], res = {};
        ['existing', 'new'].forEach(kind => { reset(kind); S.monthEnd = true; renderAll(); openStory(); const ids = ST.slides.map(x => x.id), pos = ids.map(i => ORDER.indexOf(i)), total = ST.total;
          stGo(ST.slides.length - 1); const acts = [...document.querySelectorAll('#story .st-foot button')].map(b => [nt(b.textContent), b.hasAttribute('data-stdetails') ? 'd' : b.hasAttribute('data-stshare') ? 's' : b.hasAttribute('data-stclose') ? 'c' : '?']);
          res[kind] = {ids, total:Math.round(total * 10) / 10, ok:pos.every((p, i) => p >= 0 && (!i || p > pos[i - 1])) && ids[0] === 'title' && ids[ids.length - 1] === 'share' && !ids.some(i => ['inout', 'donut', 'bills', 'change', 'next'].includes(i)) && total < 45 && ST.slides.every(x => /^linear-gradient/.test(x.bg || '')) && $('#story').style.background !== '',
            acts:acts.map(a => a[1]).join(''), n:ids.length}; closeStory(); });
        reset('existing'); ok('chk-story-denis: both seeds play Denis\'s story (title, places, spending day, days off, biggest buy, subscriptions, Wolt, into Persely, goal, streak, share) in that order, title first, share card last, no analytics slides (in and out, where it went, bills, the biggest change, next month), under 45 s, every slide its own colour; the share slide has See details, Share (preview) and Close', res.existing.ok && res.new.ok && res.existing.acts === 'dsc' && /d.*c/.test(res.new.acts) && res.existing.n >= 8, res); }

      // chk-year-entry: the Your year rows exist after 12 months (Persely tab and More Persely group), not before; the page opens from both
      reset('existing'); for(let i = 0; i < 11; i++) monthStep(true); renderAll(); const before12 = !/data-go="year"/.test(vHub()) && !/Your year/.test(vTovabbiak());
      monthStep(true); renderAll(); const hubRow = /data-go="year"/.test(tabAll()) && (!SIMPLE_PERSELY || !/data-go="year"/.test(vHub())), moreRow = /Your year/.test(vTovabbiak()), flow = S.flowLog.length;
      tab('tovabbiak'); clk('#v-tovabbiak [data-go="year"]'); const m1 = top() === 'year'; while(stack.length) popPage(true); tab('hub'); clk(viaMore('#v-hub [data-go="year"]')); const m2 = top() === 'year'; const yh = nt($('#stack .page:last-child') ? $('#stack .page:last-child').textContent : '');
      while(stack.length) popPage(true);
      ok('chk-year-entry: Your year is on the Persely tab' + SIMPLE_NOTE + ' and in the More Persely group only after 12 months and opens the year page from both', before12 && hubRow && moreRow && m1 && m2 && /What your rate earned/.test(yh), {before12, hubRow, moreRow, m1, m2, flow});

      // chk-compare-per-100k: Persely 3.0%, Savings account 3.5% and the old 0.01% per 100 000 Ft on one bar scale, one sentence on rate, tax and access; reached goals say Reached, capped; the score once; reward sheets wait
      const g0 = S.goals.find(g => g.id === 'ps5') || S.goals.find(g => !isEur(g)); const keepSaved = g0.saved; g0.saved = gTarget(g0) + 59000; const Y = yearHTML(), Yt = nt(pl(Y)); g0.saved = keepSaved;
      const w = [...Y.matchAll(/--w:([\d.]+)%/g)].map(x => +x[1]), reach = nt(`${g0.name} ${ft(gTarget(g0))} of ${ft(gTarget(g0))}`);
      pushPage('year'); let held = false; qSheet(() => '<h2>Reward test</h2>', 'reward'); held = !sheetOpen() && MQ.q.some(x => x.id === 'reward'); popPage(true); mqPump(); const released = sheetOpen() && /Reward test/.test($('#sheet').innerHTML); closeSheet(); MQ.q = [];
      ok('chk-compare-per-100k: "What your rate earned" is per 100 000 Ft after 28% tax for Persely 3.0% (2 160 Ft), Savings account 3.5% (2 520 Ft) and the old 0.01% (7 Ft) on the same bar scale, with one conclusion sentence on rate, tax and access that does not say Persely earns more; an overfunded goal shows Reached with the amount capped at its target; the health score is shown once as first month against last month; reward sheets wait until the year page closes', /Per 100 000 Ft for a year, after tax/.test(Yt) && /Persely, 3\.0% \+2 160 Ft/.test(Yt) && /Savings account, 3\.5% \+2 520 Ft/.test(Yt) && /Before Persely, 0\.01% \+7 Ft/.test(Yt) && w.length === 3 && Math.abs(w[0] / w[1] - 2160 / 2520) < .01 && w[2] < 2 && /pays the higher rate, 3\.5% against 3\.0%/.test(Yt) && /28% tax/.test(Yt) && /withdraw any time/.test(Yt) && !/Persely (pays|earns) more/.test(Yt) && /Reached/.test(Yt) && Yt.includes(reach) && (Yt.match(/First month \d+, last month \d+ of 100/g) || []).length === 1 && (Yt.match(/Financial health score/g) || []).length === 1 && held && released, {w, held, released, tail: Yt.slice(-200)});
    } catch(e){ ok('chk-phase5: the new checks ran without errors', false, String(e && e.stack || e)); }
    finally { hideChip(true); PEND = null; MQ.q = []; hideToast(true); try{ closeStory(); }catch(e){} try{ closeOnb(); }catch(e){} while(stack.length) popPage(true); spLeg(false); S = sv13; cur = cur13; stack.push(...stk13); demo.locked = lock13; try{ closeSheet(); renderAll(); }catch(e){} document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', views13[i])); }
  }
  { // Phase 6: real Settings, notification toggles and inbox, pushes in the data, Perks (flow plan B7, C5, C6; decisions D11, D12)
    const sv14 = S, cur14 = cur, stk14 = stack.splice(0), lock14 = demo.locked, views14 = [...document.querySelectorAll('.view')].map(v => v.classList.contains('on')), dm14 = DEMO_ON; demo.locked = false;
    const pl = h => String(h).replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' '), nt = t => String(t).replace(/\s+/g, ' ').trim(), clk = sel => { const b = $(sel); if(b) b.click(); return !!b; };
    const reset = kind => { hideBanners(); perkTab = 0; while(stack.length) popPage(true); try{ closeOnb(); }catch(e){} try{ closeStory(); }catch(e){} closeSheet(); MQ.q = []; hideChip(true); hideToast(true); S = fresh(kind); SETUP_COLLAPSED = false; renderAll(); };
    const top = () => stack.length ? stack[stack.length - 1].dataset.id : '', toastT = () => nt($('#toast').textContent);
    try{
      // chk-settings-real: the avatar and More > Profile / Settings open a real Settings page with Profile (name from S.name), Persely, Notifications, Privacy and Help; the demo panel and keys sit behind the flag
      reset('existing'); setDemoMode(false); tab('fooldal'); S.name = 'Kiss Réka'; renderAll();
      const av = $('#v-fooldal .hhead .avatar'), avOpen = (av.click(), top() === 'settings'), pg = $('.page [data-sec="profile"]') ? pl($('.page').innerHTML) : '';
      const secs = [...document.querySelectorAll('.page .set-sec')].map(x => x.dataset.sec).join(), noToast = !$('#toast').classList.contains('on') || !/not part of this demo/.test(toastT());
      while(stack.length) popPage(true); tab('tovabbiak'); const m1 = (clk('#v-tovabbiak .mtop [data-settings="profile"]'), top() === 'settings'); while(stack.length) popPage(true); const m2 = (clk('#v-tovabbiak .mtop [data-settings=""]'), top() === 'settings'); while(stack.length) popPage(true);
      const panelOff = !document.documentElement.classList.contains('demo-on'); lpTimer = null; av.dispatchEvent(new Event('pointerdown', {bubbles:true})); const lpOff = lpTimer === null;
      setDemoMode(true); renderDemoPanel(); av.dispatchEvent(new Event('pointerdown', {bubbles:true})); const lpOn = lpTimer !== null; clearTimeout(lpTimer); lpTimer = null; const panelOn = document.documentElement.classList.contains('demo-on') && /data-dseed/.test($('#demoPanel').innerHTML); setDemoMode(false);
      ok('chk-settings-real: the avatar, More > Profile and More > Settings open a real Settings page (no demo toast) with Profile (the name from S.name), Persely, Notifications, Privacy and Help; the demo panel, its keys and the avatar long-press only work behind the flag (?demo=1)', avOpen && /Kiss Réka/.test(pg) && secs === 'profile,persely,notif,privacy,help' && noToast && m1 && m2 && panelOff && lpOff && lpOn && panelOn, [avOpen, secs, noToast, m1, m2, panelOff, lpOff, lpOn, panelOn]);

      // chk-gear-deeplink: the Persely tab header has a 44 px gear that opens Settings at the Persely section; every Persely setting is reachable there
      const gearSel = () => SIMPLE_PERSELY && S.goals.length ? (clk('#v-hub [data-go="persmore"]'), '.page:last-child [data-settings="persely"]') : '#v-hub .tgear';   // SIMPLE_PERSELY: the gear left the tab; More > Persely settings is its door
      let gearOk = true; ['existing', 'new'].forEach(k => { reset(k); tab('hub'); const g = $(gearSel()); if(!g || g.offsetHeight < 44 || g.offsetWidth < 44 || g.dataset.settings !== 'persely' || !g.getAttribute('aria-label')) gearOk = false; });
      reset('existing'); tab('hub'); clk(gearSel()); const pgp = $('.page'), secP = pgp.querySelector('[data-sec="persely"]'), scr = pgp.querySelector('.scroll'), focused = secP.classList.contains('focus') && !pgp.querySelector('[data-sec="notif"].focus');
      const inView = secP.getBoundingClientRect().top < scr.getBoundingClientRect().top + scr.clientHeight && secP.getBoundingClientRect().bottom > scr.getBoundingClientRect().top;
      const rules = !!secP.querySelector('[data-saverules=""]'), rem = !!secP.querySelector('[data-sw="remind"][role="switch"]'), ana = !!secP.querySelector('[data-sw="analyst"][role="switch"]'), jr = !!secP.querySelector('[data-go="grad"]');
      clk('.page [data-saverules=""]'); const sr = sheetOpen() && /Saving rules/.test($('#sheet').textContent); closeSheet();
      const an0 = S.analyst.on; clk('.page [data-sw="analyst"]'); const cf = sheetOpen() && !!$('#sheet [data-anoffgo]') && S.analyst.on === an0; closeSheet();
      const r0 = S.remind; clk('.page [data-sw="remind"]'); const remT = S.remind === !r0; clk('.page [data-sw="remind"]'); hideToast(true);
      clk('.page [data-go="grad"]'); const jrOpen = top() === 'grad' && /Keep my 3\.0%|Request to keep 3\.0%/.test(pl($('.page:last-child').innerHTML)); while(stack.length) popPage(true);
      tab('tovabbiak'); clk('#v-tovabbiak [data-settings="notif"]'); const nf = top() === 'settings' && !!$('.page [data-sec="notif"].focus'); while(stack.length) popPage(true);
      ok('chk-gear-deeplink: the Persely ' + (SIMPLE_PERSELY ? 'settings door (More > Persely settings with a goal, the tab gear without one; 44 px)' : 'tab gear (44 px, both seeds)') + ' opens Settings at the Persely section; Saving rules, Weekly reminder, the Financial analyst switch (with its turn-off confirm) and Junior status (Keep my 3.0%) are all in it; More > Notifications opens the Notifications section', gearOk && focused && inView && rules && rem && ana && jr && sr && cf && remT && jrOpen && nf, [gearOk, focused, inView, rules, rem, ana, jr, sr, cf, remT, jrOpen, nf]);

      // per goal saving rules (docs/per-goal-rules-notes.md)
      // chk-rules-per-goal: two goals with different payday %s; one payday moves two different amounts, each to its own goal
      reset('existing'); { const h = goalById('holiday'), f = goalById('fest'); ownRules(h).pay = {on:true, pct:10}; ownRules(f).pay = {on:true, pct:5}; S.payday.ask = false;
        const hb = gSaved(h), fb = gSaved(f), jb = acc('junior').v; salaryArrives(); hideBanners(); hideToast(true);
        const dh = gSaved(h) - hb, df = gSaved(f) - fb; S._detail = 'fest'; const fp = pl(PAGES.goal.html());
        ok('chk-rules-per-goal: Summer holiday at 10% and Festival ticket at 5% of the salary: one payday moves 7 500 Ft and 3 750 Ft, each to its own goal; the 15% total is what Saving counts, and each goal page shows its own %', dh === 7500 && df === 3750 && acc('junior').v === jb + S.income.amount - 11250 && payPct() === 15 && savePlan().rule === 11250 && /5% of each salary/.test(fp), [dh, df, payPct(), savePlan().rule]); }
      // chk-rules-defaults-in-settings: changing a default changes the next created goal's rules, not the existing goals
      reset('existing'); { const before = JSON.stringify(plainGoals().map(g => g.rules)), fd = fresh('new').ruleDefaults, plan = fd.pct === 10 && !fd.wkAmt && !fd.rr && fd.wkDay === 'mon';
        openSettings('ruledefaults'); const sec = $('.page [data-sec="ruledefaults"]'), inSet = top() === 'settings' && !!sec && sec.classList.contains('focus') && /Default saving rules for new goals/.test(nt(sec.textContent)) && /New goals start with these\. Change them per goal on the goal page\./.test(nt(sec.textContent));
        clk('.page [data-rdpct="5"]'); clk('.page [data-rdwk="3000"]'); clk('.page [data-rdday="fri"]'); clk('.page [data-sw="rdrr"]'); hideChip(true);
        const same = JSON.stringify(plainGoals().map(g => g.rules)) === before, dd = S.ruleDefaults, saved = dd.pct === 5 && dd.wkAmt === 3000 && dd.wkDay === 'fri' && dd.rr === true;
        while(stack.length) popPage(true); startOnb('travel'); const pre = O.payOn && O.pct === 5 && O.weeklyOn && O.weekly === 3000 && O.day === 'fri' && O.roundOn; O.i = 2; renderOnb(); clk('[data-onbcreate]'); const ng = S.goals[S.goals.length - 1];
        const made = ng.rules.pay.on && ng.rules.pay.pct === 5 && ng.rules.wk.on && ng.rules.wk.amt === 3000 && ng.rules.wk.day === 'fri' && ng.rules.rr.on && JSON.stringify(plainGoals().filter(g => g.id !== ng.id).map(g => g.rules)) === before;
        while(stack.length) popPage(true); MQ.q = []; closeSheet(); hideToast(true); hideChip(true);
        ok('chk-rules-defaults-in-settings: Settings > Persely > Default saving rules for new goals (out of the box payday 10%, weekly off on Monday, round-ups off); changing them pre-fills the next goal\'s step 2 and its rules, and the existing goals keep theirs', plan && inSet && saved && same && pre && made, [plan, inSet, saved, same, pre, made]); }
      // chk-rules-cap: the payday %s of all goals add up to at most 50% of the salary; going over is blocked with a message
      reset('existing'); { ownRules(goalById('holiday')).pay = {on:true, pct:20}; ownRules(goalById('ps5')).pay = {on:true, pct:20}; renderAll(); S._detail = 'fest'; pushPage('goal');
        clk('.page [data-grtog="pay:fest"]'); const on50 = rulesOf(goalById('fest')).pay.on && payPct() === 50; clk('.page [data-grpct="fest:15"]');
        const msg = nt(($('.page .capmsg') || {}).textContent || ''), blocked = rulesOf(goalById('fest')).pay.pct === 10 && payPct() === 50 && /That makes 55% of your salary across your goals\. The most is 50%/.test(msg);
        while(stack.length) popPage(true); hideChip(true); hideToast(true);
        startOnb('travel'); O.i = 1; renderOnb(); const wz = nt($('#onb').textContent), nx = $('#onb [data-onbnext]').disabled; clk('#onb [data-onbnext]'); const stays = O.i === 1;
        clk('#onb [data-onbpay]'); const freed = !O.payOn && !$('#onb [data-onbnext]').disabled; closeOnb();
        ok('chk-rules-cap: all goals together may take at most 50% of the salary: 20% + 20% + 10% is allowed, a goal page change to 15% (55%) is blocked with "That makes 55% of your salary ... The most is 50%" and nothing changes; the wizard step 2 says it and waits until the payday rule fits', on50 && blocked && /That makes 60% of your salary/.test(wz) && nx && stays && freed, [on50, blocked, msg, nx, stays, freed]); }
      // chk-rules-overview: the Persely tab block lists each goal with its own rules, read only; a row opens that goal's rules
      reset('existing'); { const h = goalById('holiday'), f = goalById('fest'); ownRules(h).pay = {on:true, pct:10}; ownRules(h).wk = {on:true, amt:2000, day:'mon'}; ownRules(f).rr.on = true; renderAll(); tab('hub');
        const RS = viaMore('#v-hub .srlist'), rows = [...document.querySelectorAll(RS + ' [data-goalrules]')], txt = rows.map(r => nt(r.textContent));
        const lists = rows.length === plainGoals().length && txt.some(t => /Summer holiday/.test(t) && /10% of salary · 2 000 Ft a week/.test(t)) && txt.some(t => /Festival ticket/.test(t) && /round-ups/.test(t)) && txt.some(t => /PS5/.test(t) && /No rules/.test(t));
        const ro = !document.querySelector(`${RS} [data-grtog], ${RS} [role="switch"], ${RS} .tg`);
        clk(RS + ' [data-goalrules="fest"]'); const opened = top() === 'goal' && S._detail === 'fest' && !!$('.page [data-rules="fest"]'); while(stack.length) popPage(true);
        sheet(SHEETS.saverules()); const sh = document.querySelectorAll('#sheet [data-goalrules]').length === plainGoals().length && !document.querySelector('#sheet [data-srtog], #sheet [data-srgoal], #sheet .tg'); closeSheet();
        ok('chk-rules-overview: the Persely tab' + SIMPLE_NOTE + ' Saving rules block is read only and lists each goal with its own rules in one line (Summer holiday: 10% of salary · 2 000 Ft a week); a row opens that goal\'s rules; the Saving rules sheet is the same overview, with no global switches', lists && ro && opened && sh, [txt, ro, opened, sh]); }
      // chk-rules-roundup-split: the round-up coin is split equally between the goals with round-ups on
      reset('existing'); { const h = goalById('holiday'), f = goalById('fest'); ownRules(h).rr.on = true; ownRules(f).rr.on = true; const hb = gSaved(h), fb = gSaved(f); coffee(); hideBanners(); hideToast(true);
        const two = gSaved(h) - hb === 10 && gSaved(f) - fb === 10;
        ownRules(f).rr.on = false; const hb2 = gSaved(h); coffee(); hideBanners(); hideToast(true); const one = gSaved(h) - hb2 === 20;
        ownRules(f).rr.on = true; ownRules(goalById('ps5')).rr.on = true; const a = roundupAlloc(20), three = a.length === 3 && a.reduce((x, y) => x + y.v, 0) === 20 && a[0].v === 8 && a[1].v === 6 && a[2].v === 6;
        const pace = Math.abs(rrGoals().reduce((x, g) => x + paceOf(g) - (g.pace || 0) - (rulesOf(g).pay.on ? incomeShare(rulesOf(g).pay.pct) : 0) - (rulesOf(g).wk.on ? wkMonthly(rulesOf(g).wk.amt) : 0), 0) - ROUND_EST) <= 2;
        ok('chk-rules-roundup-split: a 20 Ft round-up is split equally between the goals with round-ups on (10 Ft + 10 Ft), one goal gets it all, with three the leftover forint goes to the first (8 + 6 + 6), and the forecast shares the monthly round-ups the same way', two && one && three && pace, [two, one, three, pace]); }

      // chk-notif-toggles: six toggles plus quiet hours with time pickers; money events and late bills on, the weekly reminder an opt-in; an off type sends nothing; push copy follows the state
      reset('existing'); const D = fresh('existing').notif, newRem = fresh('new').remind === false;
      const defaults = D.bills && D.payday && D.story && D.card && D.incoming && !D.quiet;
      tab('tovabbiak'); clk('#v-tovabbiak [data-settings="notif"]');
      const nsec = $('.page [data-sec="notif"]'), labels = [...nsec.querySelectorAll('.set-row .t')].map(x => nt(x.firstChild.textContent)).join(), sw = [...nsec.querySelectorAll('[role="switch"]')], big = sw.every(b => b.offsetHeight >= 44);
      clk('.page [data-sw="n:quiet"]'); const tp = [...document.querySelectorAll('.page [data-sec="notif"] input[type="time"]')], pickers = tp.length === 2 && tp[0].dataset.qh === 'qfrom';
      tp[0].value = '21:30'; tp[0].dispatchEvent(new Event('change', {bubbles:true})); const picked = S.notif.qfrom === '21:30' && S.notif.quiet === true;
      const quiet = quietAt('23:30', '22:00', '07:00') && quietAt('03:00', '22:00', '07:00') && !quietAt('12:00', '22:00', '07:00') && quietAt('10:00', '09:00', '17:00') && !quietAt('18:00', '09:00', '17:00') && inQuiet('22:00') && !inQuiet('12:00');
      S.notif.quiet = false; while(stack.length) popPage(true); hideBanners();
      // card payments off: the card payment still happens in the data, but no banner and no inbox item
      S.notif.card = false; const b0 = acc('junior').v, n0 = S.inbox.length, t0 = S.tx.length; sendDemo(0); const offQuiet = acc('junior').v === b0 - 5240 && S.tx.length === t0 + 1 && S.inbox.length === n0 && !MQ.banner && /Card payments notifications are off/.test(toastT());
      S.notif.card = true; hideToast(true); sendDemo(0); const onSends = S.inbox.length === n0 + 1 && MQ.banner === true && /Balance: /.test(S.inbox[0].body); hideBanners();
      S.remind = false; const nI = S.inbox.length; sendDemo(2); const remOff = S.inbox.length === nI; S.remind = true; S.streak = 0; sendDemo(2); const noZero = !/0-week/.test(S.inbox[0].body); S.streak = 3; hideBanners(); sendDemo(2); const streakOk = /3-week streak/.test(S.inbox[0].body); hideBanners();
      S.analyst.on = false; const sOff = !/Safe to spend/.test(DEMO[8].body() + (S.inbox[0] ? '' : '')) && stsNow() === ''; S.analyst.on = true; const sOn = /Safe to spend is now/.test(stsNow());
      reset('new'); const nF = S.inbox.length; sendDemo(4); const noFriend = S.inbox.length === nF && (SIMPLE_PERSELY ? /no goals/ : /no friends/).test(toastT()); hideToast(true); reset('existing'); S.friendsOptIn = true; sendDemo(4); const friend = SIMPLE_PERSELY ? /% saved: /.test(S.inbox[0].body) && !/saved 5 000 Ft this week/.test(S.inbox[0].body) : /Bence saved/.test(S.inbox[0].body); hideBanners();
      const live = $('#nlive'), liveOk = !!live && live.getAttribute('role') === 'status' && live.getAttribute('aria-live') === 'polite' && BANNER_MS >= 6000;
      ok('chk-notif-toggles: Settings > Notifications has Bills due, Sunday streak reminder, Payday, Monthly story, Card payments, Incoming transfers and Quiet hours (switches at 44 px, from and to time pickers); money events and late bills are on and the weekly reminder is an opt-in by default; an off type sends no banner and no inbox item; quiet hours work across midnight; the streak push only at 1 week or more, Safe to spend wording only with the analyst on, friend pushes real friends only; banners stay 6 s or more and are announced', defaults && newRem && labels === (SIMPLE_PERSELY ? 'Bills due,Sunday streak reminder,Payday,Monthly story,Card payments,Incoming transfers,Junior ends,Goal milestones,Offers and perks,Quiet hours' : 'Bills due,Sunday streak reminder,Payday,Monthly story,Card payments,Incoming transfers,Quiet hours') && sw.length === (SIMPLE_PERSELY ? 10 : 7) && big && pickers && picked && quiet && offQuiet && onSends && remOff && noZero && streakOk && sOff && sOn && noFriend && friend && liveOk, [defaults, newRem, labels, sw.length, big, pickers, picked, quiet, offQuiet, onSends, remOff, noZero, streakOk, sOff, sOn, noFriend, friend, liveOk]);

      if(SIMPLE_PERSELY){ // chk-simple-push-cap + chk-simple-no-urgency: one Persely push a day, the priority order, quiet hours, marketing apart from Persi, no urgency words, the Sunday reminder opt in, no friend push
        const URG = /\bnow!|hurry|last chance|only today|don'?t miss|act fast|countdown|expires|\d+\s*(?:days?|hours?|minutes?)\s+left|\bfinal\b/i;
        const land = i => { const n0 = S.inbox.length; hideBanners(); hideToast(true); MQ.q = []; $('#toast').textContent = ''; sendDemo(i); const banner = !!document.querySelector('.nbanner'); const t = toastT(); hideBanners(); hideToast(true); return {banner, inbox:S.inbox.length - n0, held:/Held by the 1 a day limit/.test(t)}; };
        const dm0 = DEMO_ON; DEMO_ON = true;
        reset('existing'); S.notif.quiet = false; S.notif.mkt = true; S.remind = true; resetPushDay();
        const pr = choosePush([{kind:'story'}, {kind:'streak'}, {kind:'goal'}, {kind:'junior'}, {kind:'payday'}, {kind:'mkt'}]), order = ['payday', 'junior', 'goal', 'streak', 'story'].every((k, i, a) => !i || pushPri({kind:a[i - 1]}) < pushPri({kind:k}));
        const first = land(2), rest = [3, 4, 5, 6, 7].map(land), card = land(0);   // streak lands; the other Persely pushes are held; a card payment is the bank's own push
        const oneADay = first.banner && rest.every(r => !r.banner && r.inbox === 1 && r.held) && card.banner && !card.held;
        const nI = S.inbox.length; resetPushDay(); const again = land(4); const reset1 = again.banner;   // "Reset day": the next one lands again
        S.week++; const nextDay = land(5).banner; S.week--;   // a new day of the app's own date: one more may land
        const lateOwn = (() => { resetPushDay(); const a = land(2), b = land(8); return a.banner && b.banner && !b.held; })();   // Bills first is not a Persely push: it still lands on a day that has had one (its own 1 a day cap is billsPush, S.bfPush)
        // quiet hours: arrives silently, is listed, and does not use up the day
        resetPushDay(); S.notif.quiet = true; S.notif.qfrom = '00:00'; S.notif.qto = '23:59'; const q = land(6); const qOk = !q.banner && q.inbox === 1 && !S.pushDay; S.notif.quiet = false; const afterQ = land(6).banner;
        // payday first: the salary push uses the real computed amount and is not held by an earlier push of the day
        resetPushDay(); S.payday.ask = true; const share = paydayAlloc().total; salaryArrives(); closeSheet(); MQ.q = []; const pd = S.inbox.find(x => /^Salary's in\./.test(x.body)); hideBanners(); hideToast(true);
        const payOk = !!pd && (pd.body === `Salary's in. Save ${ft(share)}?` || /^Salary's in\. .+\sFt of bills to pay first\.$/.test(pd.body)) && pd.url === 'payday' && S.pushDay && S.pushDay.kind === 'payday';
        week8State(); S.notif.quiet = false; S.bills = []; resetPushDay(); const share2 = paydayAlloc().total; salaryArrives(); closeSheet(); MQ.q = []; hideBanners(); hideToast(true);
        const saveOk = !paydayBills() && S.inbox[0].body === `Salary's in. Save ${ft(share2)}?` && share2 > 0;   // no bills open: the copy is Salary's in. Save [the real amount]?
        // marketing: its own switch, off by default, not in the Persi channel, no urgency
        S.notif.mkt = false; const mOff = notify({...DEMO[7], body:DEMO[7].body}) === false; S.notif.mkt = true;
        const mkt = !DEMO[7].persi && !/Persi/.test(DEMO[7].title) && DEMO[7].kind === 'mkt' && DEMO[7].body === 'Pizzeria Roma: 15% off. You can turn it on in Perks.' && notifDefault().mkt === false && fresh('new').notif.mkt === false && NOTIF_TOGGLES.some(x => x[0] === 'mkt');
        // no friend push, no day 0 push, no "we miss you"
        reset('existing'); S.friendsOptIn = true; const strs = []; DEMO.forEach(d => { strs.push(d.title, d.label, typeof d.body === 'function' ? d.body() : d.body); });
        const noFriend = DEMO.length === 9 && !DEMO.some(d => /friend/i.test(d.label)) && !strs.some(t => /saved 5 000 Ft this week|friend|we miss you|miss you|day 0/i.test(String(t)));
        const slips = !strs.some(t => /\bmy 3\.0%|\bme\b.*\bmy\b/i.test(String(t))) && /keep your 3\.0%/.test(DEMO[5].body());
        const optIn = fresh('new').remind === false && notifOn('streak') === (!!S.remind) && NOTIF_TOGGLES.some(x => x[0] === 'streak');
        ok('chk-simple-push-cap: at most 1 Persely push a day (all types together, per day of the app date; a card payment and the late-bill push are not Persely pushes); a held push is still in the inbox and the demo says "Held by the 1 a day limit"; Reset day lets one land again; a new day lets one land; priority payday, Junior ends, goal milestone, Sunday reminder, story; quiet hours respected and do not use up the day; the payday push says Salary\'s in. Save [real amount]?; discounts leave the Persi channel with their own switch off by default; no friend push; Sunday reminder is an opt in', pr.kind === 'payday' && order && oneADay && reset1 && nextDay && lateOwn && qOk && afterQ && payOk && saveOk && mOff && mkt && noFriend && slips && optIn, [pr.kind, order, oneADay, reset1, nextDay, lateOwn, qOk, afterQ, payOk, saveOk, pd && pd.body, mOff, mkt, noFriend, slips, optIn, first, rest, card]);
        const all = strs.concat(S.inbox.map(x => x.title + ' ' + x.body), NOTIF_TOGGLES.map(x => x[1] + ' ' + x[2]));
        ok('chk-simple-no-urgency: no push, inbox or notification switch text has "now!", hurry, last chance, only today, a countdown or a deadline word, and no push subtitle has a hyphen', !all.some(t => URG.test(String(t)) || /deadline/i.test(String(t))) && !NOTIF_TOGGLES.some(x => /-/.test(x[2])), all.filter(t => URG.test(String(t))));
        DEMO_ON = dm0; reset('existing'); hideBanners(); hideToast(true);
      }
      // chk-inbox-20: the Home bell opens the inbox: last 20, newest first, unread dot, a tap opens the item's screen, empty state text
      reset('existing'); const empty = /Nothing yet\. Money events and bill reminders will show here\./.test(pl(PAGES.inbox.html())), noDot = !/bdot/.test(vFooldal());
      for(let i = 0; i < 25; i++) notify({title:'Note ' + i, body:'Body ' + i, url:i === 24 ? 'tranzakciok' : 'hub', persi:true}); hideBanners();
      const cap = S.inbox.length === 20 && S.inbox[0].title === 'Note 24' && S.inbox[19].title === 'Note 5', dot = /class="bdot"/.test(vFooldal()) && /20 unread/.test(vFooldal());
      tab('fooldal'); clk('#v-fooldal .hhead .bell'); const open = top() === 'inbox', items = document.querySelectorAll('.page .inb').length === 20, firstT = /Note 24/.test($('.page .inb').textContent);
      clk('.page .inb'); const went = cur === 'tranzakciok' && !stack.length && S.inbox[0].read === true && inboxUnread() === 19;
      tab('fooldal'); clk('#v-fooldal .hhead .bell'); clk('.page [data-inbread]'); const allRead = inboxUnread() === 0 && !/bdot/.test(vFooldal()) && !$('.page [data-inbread]'); while(stack.length) popPage(true);
      const nB = S.inbox.length; sendDemo(2); const demoIn = S.inbox.length === Math.min(20, nB + 1); hideBanners();
      ok('chk-inbox-20: the Home bell opens an inbox of the last 20 items, newest first, with an unread dot on the bell; a tap opens the item screen and marks it read; Mark all as read clears the dot; every push that is fired is also listed; the empty state says "Nothing yet. Money events and bill reminders will show here."', empty && noDot && cap && dot && open && items && firstT && went && allRead && demoIn, [empty, noDot, cap, dot, open, items, firstT, went, allRead, demoIn]);

      // chk-push-reflects-balance: a Salary's in push adds the salary and the balance, a card push adds a card payment and moves the balance; the push text shows the real balance
      reset('existing'); const bj = acc('junior').v, tx0 = S.tx.length; salaryArrives(); hideBanners();
      const salary = acc('junior').v === bj + S.income.amount && S.tx.length === tx0 + 1 && S.tx[0].n === 'SALARY' && S.tx[0].a === S.income.amount && (SIMPLE_PERSELY ? /^Salary's in\. /.test(nt(S.inbox[0].body)) : /\+75 000 Ft/.test(nt(S.inbox[0].body))) && /SALARY/.test(pl(vTranz()));
      const b1 = acc('junior').v; sendDemo(0); hideBanners(); const card = acc('junior').v === b1 - 5240 && S.tx[0].n === 'LIDL MAGYARORSZÁG' && S.tx[0].a === -5240 && S.inbox[0].body.includes('Balance: ' + ft(acc('junior').v)) && /LIDL/.test(pl(vTranz())) && /Balance: /.test(S.inbox[0].body);
      const b2 = acc('junior').v; sendDemo(1); hideBanners(); const inc = acc('junior').v === b2 + 20000 && S.tx[0].n === 'NAGY PÉTER' && S.inbox[0].body.includes('Balance: ' + ft(acc('junior').v));
      ok('chk-push-reflects-balance: the Salary\'s in push (Payday) adds the salary transaction and +75 000 Ft to the balance; the Card payment push adds a LIDL card payment and lowers the balance; Money received adds 20 000 Ft; each push shows the balance after it and the rows are in Transactions', salary && card && inc, [salary, card, inc, acc('junior').v]);

      // chk-perks-rewards: Perks (More, My partners, the Persely tab row, the card page) with Discounts and My rewards; earned rewards list a partner name and steps; empty state
      reset('existing'); tab('tovabbiak'); const mh = vTovabbiak(); const perksRowMore = /data-go="perks"[^>]*>[^<]*<svg[\s\S]*?<span>Perks<\/span>/.test(mh) && !/<span>Discounts<\/span>/.test(mh), partners = /data-go="perks"[^>]*>(?:(?!<\/button>)[\s\S])*My partners/.test(mh);
      const hubRow = pl(tabAll()).includes('Perks') && !/Discounts/.test(pl(tabAll().match(/<button class="row" data-go="perks">[\s\S]*?<\/button>/)[0])) && (!SIMPLE_PERSELY || !/data-go="perks"/.test(vHub()));
      clk('#v-tovabbiak .mi[data-go="perks"]'); const pOpen = top() === 'perks', tabsT = [...document.querySelectorAll('.page [data-perktab]')].map(x => nt(x.textContent)).join();
      clk('.page [data-perktab="1"]'); const emptyT = /Stay within your plan for a month and your first reward arrives\./.test(pl($('.page').innerHTML));
      S.rewards.unshift({id:'r9', title:'5% cashback at a partner', partner:'Corner Market', steps:REWARD_STEPS, note:'Valid in December. Up to 2 000 Ft back.', why:'Stayed within the split in October'}, {id:'r1', title:'Old reward', note:'Up to 1 000 Ft back.', why:'Old'}); renderAll();
      const rt = pl($('.page').innerHTML), listed = /Corner Market/.test(rt) && (document.querySelectorAll('.page .pk-card .steps li').length >= 6) && /Shop at the partner with your OTP card/.test(rt) && /Old reward/.test(rt);
      while(stack.length) popPage(true); S.rewards = []; S._offer = 'holiday'; sheet(SHEETS.goaloffer()); clk('#sheet [data-claimoffer]'); const claimed = S.rewards.length === 1 && !!S.rewards[0].partner && S.rewards[0].steps.length === 3; hideToast(true);
      tab('hub'); clk(viaMore('#v-hub [data-go="perks"]')); const fromTab = top() === 'perks'; while(stack.length) popPage(true); clk('#v-hub .tgear'); while(stack.length) popPage(true);
      tab('fooldal'); pushPage('kartyaim'); clk('.page [data-go="perks"]'); const fromCard = top() === 'perks'; while(stack.length) popPage(true);
      tab('tovabbiak'); const mp = [...document.querySelectorAll('#v-tovabbiak .mi')].find(b => /My partners/.test(b.textContent)); mp.click(); const fromPartners = top() === 'perks'; while(stack.length) popPage(true);
      ok('chk-perks-rewards: Perks replaces Discounts in More and on the Persely tab' + SIMPLE_NOTE + '; My partners and the card page row open it; two tabs Discounts and My rewards; the empty state says "Stay within your plan for a month and your first reward arrives."; earned rewards (also old ones) list a partner name and steps; a goal offer claimed lands there with a partner and steps', perksRowMore && partners && hubRow && pOpen && tabsT.startsWith('Discounts,My rewards') && emptyT && listed && claimed && fromTab && fromCard && fromPartners, [perksRowMore, partners, hubRow, pOpen, tabsT, emptyT, listed, claimed, fromTab, fromCard, fromPartners]);

      // chk-discount-detail-first: a discount row opens a detail sheet first (partner, offer, redeem steps); only Activate switches it on, with the Undo chip; Add to my rewards lands in My rewards with a toast; partner names are marked for OTP
      reset('existing'); pushPage('perks'); clk('.page [data-perk="d1"]'); const sh1 = pl($('#sheet').innerHTML), detail = sheetOpen() && /Pizzeria Roma/.test(sh1) && /15% instant discount/.test(sh1) && /How to redeem/.test(sh1) && $('#sheet .steps').children.length === 3 && !!$('#sheet [data-perkact="d1"]') && S.disc.activated.length === 0;
      clk('#sheet [data-perkact="d1"]'); const act = S.disc.activated.join() === 'd1' && !sheetOpen() && /Discount activated: Pizzeria Roma/.test($('#uchip').textContent) && !!$('#uchip [data-undo]'); clk('#uchip [data-undo]'); const undone = S.disc.activated.length === 0; hideChip(true);
      clk('.page [data-perk="d2"]'); clk('#sheet [data-perkadd="d2"]'); const added = S.rewards.some(r => r.id === 'pd2' && r.partner && r.steps.length) && perkTab === 1 && /Added to my rewards/.test(toastT()) && /Theatre/.test(pl($('.page').innerHTML)); hideToast(true); perkTab = 0;
      const marked = /CONFIRM WITH OTP: partners/.test(SHEETS.perk.toString()) && /CONFIRM WITH OTP: partners/.test(perksHTML.toString());
      const noBare = !/data-act1|data-actall/.test(perksHTML.toString());
      ok('chk-discount-detail-first: tapping a discount opens a detail sheet first with the partner, the offer and numbered how-to-redeem steps and activates nothing; Activate switches it on and shows the Undo chip (Undo switches it off); Add to my rewards lands it in My rewards with a "Added to my rewards" toast; partner names are marked CONFIRM WITH OTP', detail && act && undone && added && marked && noBare, [detail, act, undone, added, marked, noBare]);

      // chk-reward-queue: reward and goal sheets that open by themselves wait until the open page is closed (every page, not only the year), then open one at a time
      reset('existing'); S._detail = S.goals[0].id; pushPage('goal'); qSheet(() => '<h2>Reward queue test</h2>', 'reward'); qSheet(() => '<h2>Goal queue test</h2>', 'goaloffer');
      const heldGoal = !sheetOpen() && MQ.q.length === 2; popPage(true); mqPump(); const first = sheetOpen() && /Reward queue test/.test($('#sheet').textContent) && MQ.q.length === 1; closeSheet(); mqPump(); const second = sheetOpen() && /Goal queue test/.test($('#sheet').textContent); closeSheet(); MQ.q = [];
      pushPage('settings'); qSheet(() => '<h2>Reward queue test</h2>', 'reward'); const heldSet = !sheetOpen(); popPage(true); mqPump(); const afterSet = sheetOpen(); closeSheet(); MQ.q = [];
      tab('fooldal'); qSheet(() => '<h2>No page test</h2>', 'goaloffer'); const direct = sheetOpen(); closeSheet(); MQ.q = [];
      pushPage('year'); qSheet(() => '<h2>Reward queue test</h2>', 'reward'); const heldYear = !sheetOpen(); popPage(true); mqPump(); const afterYear = sheetOpen(); closeSheet(); MQ.q = [];
      ok('chk-reward-queue: a reward or goal-reached sheet queued while any page is open (goal page, Settings, year) waits; it opens when the page is closed, one sheet at a time, and straight away when no page is open', heldGoal && first && second && heldSet && afterSet && direct && heldYear && afterYear && HOLD_FOR_PAGE.includes('reward') && HOLD_FOR_PAGE.includes('goaloffer'), [heldGoal, first, second, heldSet, afterSet, direct, heldYear, afterYear]);
    } catch(e){ ok('chk-phase6: the new checks ran without errors', false, String(e && e.stack || e)); }
    finally { hideBanners(); setDemoMode(dm14); hideChip(true); PEND = null; MQ.q = []; hideToast(true); try{ closeStory(); }catch(e){} try{ closeOnb(); }catch(e){} perkTab = 0; while(stack.length) popPage(true); S = sv14; cur = cur14; stack.push(...stk14); demo.locked = lock14; try{ closeSheet(); renderAll(); }catch(e){} document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', views14[i])); }
  }
  { // Phase 7: Bills (flow plan B6, C2.8; decision D13): late card on Home only with two actions, skips in the bill sheet with a confirm, pocket defaults to the unpaid amount, no Bills self-link, own bill label in Transactions
    const sv15 = S, cur15 = cur, stk15 = stack.splice(0), lock15 = demo.locked, views15 = [...document.querySelectorAll('.view')].map(v => v.classList.contains('on')); demo.locked = false;
    const pl = h => String(h).replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' '), nt = t => String(t).replace(/\s+/g, ' ').trim(), clk = sel => { const b = $(sel); if(b) b.click(); return !!b; };
    const reset = kind => { hideBanners(); while(stack.length) popPage(true); try{ closeOnb(); }catch(e){} try{ closeStory(); }catch(e){} closeSheet(); MQ.q = []; hideChip(true); hideToast(true); S = fresh(kind); SETUP_COLLAPSED = false; renderAll(); };
    const late = () => { reset('existing'); S.tx = S.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); S.bfPush = billToday().ym + '-' + billToday().day; renderAll(); };
    const cardOf = h => (h.match(/<div class="card bfc">[\s\S]*?<\/div><\/div>/) || [''])[0];
    try{
      // chk-latecard-home-only: the late-bill card is on Home with the real text and exactly two actions (Pay now, All bills); it is not on the Persely tab, the Bills page or the Spending page
      late(); const hc = cardOf(vFooldal()), hct = nt(pl(hc)), acts = (hc.match(/<button/g) || []).length;
      const two = /Rent share is late: 42 000 Ft \(due on the 2nd\)/.test(hct) && acts === 2 && /data-paybill="szab-d-ra"/.test(hc) && /data-go="bills"/.test(hc) && />Pay now</.test(hc) && />All bills</.test(hc) && !/data-billskip/.test(hc);
      const hubNo = !/class="card bfc"|Bills first/.test(vHub()), billsNo = !/class="card bfc"/.test(billsHTML()), spendNo = !/class="card bfc"/.test(myMoneyHTML());
      ok('chk-latecard-home-only: the late-bill card is on Home only, reads "Rent share is late: 42 000 Ft (due on the 2nd)" with two actions (Pay now, All bills) and no skip links; the Persely tab, the Bills page and the Spending page do not show it', two && hubNo && billsNo && spendNo, [hct, acts, hubNo, billsNo, spendNo]);

      // chk-skip-in-sheet: the skips live in the bill sheet under More options; each opens a confirm that states the effect on Safe to spend; nothing changes until Confirm; Confirm skips with an Undo chip
      late(); const sf0 = safeToSpend().safe; S._bill = 'szab-d-ra'; const b0 = nt(pl(SHEETS.bill())); sheet(SHEETS.bill()); const sh = $('#sheet').innerHTML;
      const inSheet = /More options/.test(b0) && (sh.match(/data-billskipask=/g) || []).length === 2 && !/data-billskip="/.test(sh) && /Already paid elsewhere/.test(b0) && /Not due this month/.test(b0) && /Usual amount 42 000 Ft/.test(b0) && /Due on the 2nd/.test(b0) && /must-pay bill/.test(b0) && !!$('#sheet [data-paybill]') && !!$('#sheet details.bfmore:not([open])');
      clk('#sheet [data-billskipask="szab-d-ra:notdue"]'); const cf = nt($('#sheet').textContent), cfOk = /Safe to spend goes up by 42 000 Ft this month/.test(cf) && !!$('#sheet [data-billskip="szab-d-ra:notdue"]') && !S.billSkip['szab-d-ra'] && safeToSpend().safe === sf0;
      clk('#sheet [data-billopen]'); const back = /More options/.test(nt($('#sheet').textContent)) && !S.billSkip['szab-d-ra'];
      clk('#sheet [data-billskipask="szab-d-ra:paid"]'); const cf2 = /Safe to spend goes up by 42 000 Ft this month/.test(nt($('#sheet').textContent)); clk('#sheet [data-billskip]');
      const done = S.billSkip['szab-d-ra'] === billToday().ym && S.billSkipWhy['szab-d-ra'] === 'paid' && !bfNow().on && safeToSpend().safe === sf0 + 42000 && !sheetOpen() && UCH.on && !!$('#uchip [data-undo]');
      clk('#uchip [data-undo]'); const undone = !S.billSkip['szab-d-ra'] && bfNow().on && safeToSpend().safe === sf0; hideChip(true);
      ok('chk-skip-in-sheet: Already paid elsewhere and Not due this month sit in the bill sheet under More options (with usual amount, due day, must-pay switch and Pay now); each asks first with "Safe to spend goes up by 42 000 Ft this month"; Back changes nothing; Confirm skips and shows the Undo chip; Undo puts the bill back', inSheet && cfOk && back && cf2 && done && undone, [inSheet, cfOk, back, cf2, done, undone]);

      // chk-pocket-unpaid: the Bills page summary, the status chips and the pocket section use the unpaid amount
      late(); pushPage('bills'); const pg = nt(pl($('.page').innerHTML)), chips = [...document.querySelectorAll('.page [data-chip]')].map(x => x.dataset.chip), chipOf = id => (document.querySelector(`.page [data-billopen="${id}"] [data-chip]`) || {dataset:{}}).dataset.chip;
      const sum = /61 000 Ft this month · 13 450 Ft paid · 47 550 Ft still to pay/.test(pg), chipsOk = chipOf('szab-d-ra') === 'Late' && chipOf('yettel-magyarorsz-g') === 'Due' && chips.includes('Paid') && chips.every(c => ['Paid', 'Due', 'Late', 'Skipped', 'Paid less'].includes(c));
      const sect = /Move 47 550 Ft \(unpaid\) to Bills pocket/.test(pg) && !/Move 61 000 Ft/.test(pg) && pocketOffer() === 47550; const j0 = balanceOf();
      clk('.page [data-pocketmove]'); const moved = pocketBal() === 47550 && balanceOf() === j0 - 47550 && pocketOffer() === 0 && !/Move [\d ]+ Ft \(unpaid\)/.test(nt(pl($('.page').innerHTML))); hideChip(true);
      while(stack.length) popPage(true);
      ok('chk-pocket-unpaid: the Bills page reads "61 000 Ft this month · 13 450 Ft paid · 47 550 Ft still to pay", bill rows carry Paid / Due / Late chips, and the Bills pocket section offers "Move 47 550 Ft (unpaid) to Bills pocket" (not the 61 000 Ft month total); one tap moves exactly 47 550 Ft', sum && chipsOk && sect && moved, [sum, chips, sect, moved, pg.slice(0, 300)]);

      // chk-no-bills-selflink: no link on the Bills page leads to the Bills page; the Spending page has one Bills row; the allowed entries are kept
      late(); pushPage('bills'); const pb = $('.page').innerHTML, selfFree = !/data-go="bills"/.test(pb) && !/class="card bfc"/.test(pb); while(stack.length) popPage(true);
      const spend = (myMoneyHTML().match(/data-go="bills"/g) || []).length, homeAll = /data-go="bills"/.test(cardOf(vFooldal())), shortcut = /class="short"[\s\S]*?data-go="bills"[\s\S]*?Pay a bill/.test(vFooldal()), safeEntry = /data-go="bills"/.test(SHEETS.safe());
      ok('chk-no-bills-selflink: the Bills page has no link to itself (no All bills, no late card); the Spending page has exactly one Bills row; Home keeps All bills on the late card and the Pay a bill shortcut, and the Safe to spend sheet keeps its Must-pay bills button', selfFree && spend === 1 && homeAll && shortcut && safeEntry, [selfFree, spend, homeAll, shortcut, safeEntry]);

      // chk-bills-due-toggle: Settings > Notifications "Bills due" switches the bill reminder pushes off and on
      late(); S.notif.bills = false; const n0 = S.inbox.length, off = notify({title:'Persi · Persely', persi:true, body:'x', kind:'bills'}) === false && S.inbox.length === n0; hideBanners();
      S.notif.bills = true; const on = notify({title:'Persi · Persely', persi:true, body:'x', kind:'bills'}) !== false && S.inbox.length === n0 + 1; hideBanners(); const gated = /notifOn\(n\.kind\)/.test(notify.toString());
      ok('chk-bills-due-toggle: the Bills due switch in Settings > Notifications gates bill reminder pushes: off sends and lists nothing, on sends and lists it', off && on && gated && NOTIF_TOGGLES.some(x => x[0] === 'bills' && /Bills due/.test(x[1])), [off, on, gated]);

      // chk-own-bill-label: a bill payment shows the user's own label in Transactions with the bank payee as its second line
      reset('existing'); const html = vTranz(), row = (html.match(/<[^>]*class="tx"[^>]*>(?:(?!<\/button>)[\s\S])*?SZABÓ DÓRA[\s\S]*?<\/button>/) || [''])[0], rt = nt(pl(row));
      tab('tranzakciok'); const own = /^Rent share SZABÓ DÓRA /.test(rt) && /class="txp">SZABÓ DÓRA</.test(row);
      S.analyst.on = true; renderAll(); const i = S.tx.findIndex(t => t.n === 'SZABÓ DÓRA'); S._txi = i; const dt = nt(pl(SHEETS.txd())), det = /Your label Rent share/.test(dt) && /Paid to SZABÓ DÓRA/.test(dt); const card = !/class="tx"[^>]*><span class="ic">[^<]*<svg[\s\S]*?<b class="own">LIDL/.test(html);
      tab('fooldal');
      ok('chk-own-bill-label: in Transactions a bill payment shows the user\'s own label ("Rent share") with the bank payee (SZABÓ DÓRA) as the second line; the payment detail lists Your label and Paid to; other payments keep the payee name', own && det && card, [rt, own, det]);

      // chk-safe-late-why: Safe to spend explains in one line why a late bill does not change it
      late(); const sg = nt(pl(SHEETS.safe())); reset('existing'); const sg2 = nt(pl(SHEETS.safe()));
      ok('chk-safe-late-why: while a bill is late the Safe to spend sheet says in one line that it does not change because an unpaid bill was already taken off; with nothing late the line is absent', /Rent share is late, but Safe to spend does not change/.test(sg) && !/does not change/.test(sg2), [sg.slice(-300)]);
    } catch(e){ ok('chk-phase7: the new checks ran without errors', false, String(e && e.stack || e)); }
    finally { hideBanners(); hideChip(true); PEND = null; MQ.q = []; hideToast(true); while(stack.length) popPage(true); S = sv15; cur = cur15; stack.push(...stk15); demo.locked = lock15; try{ closeSheet(); renderAll(); }catch(e){} document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', views15[i])); }
  }
  { // Phase 8: Transactions (flow plan B4, C7; decision D14): search, chips, a real Filter sheet, every row opens its detail, category passed in, recategorise with Undo
    const sv16 = S, cur16 = cur, stk16 = stack.splice(0), lock16 = demo.locked, views16 = [...document.querySelectorAll('.view')].map(v => v.classList.contains('on')); demo.locked = false;
    const pl = h => String(h).replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' '), nt = t => String(t).replace(/\s+/g, ' ').trim(), clk = sel => { const b = $(sel); if(b) b.click(); return !!b; };
    const reset = kind => { hideBanners(); while(stack.length) popPage(true); try{ closeOnb(); }catch(e){} try{ closeStory(); }catch(e){} closeSheet(); MQ.q = []; hideChip(true); hideToast(true); txReset(); txMode = 0; S = fresh(kind); SETUP_COLLAPSED = false; renderAll(); };
    const typeQ = v => { const f = $('#txq'); f.value = v; f.dispatchEvent(new Event('input', {bubbles:true})); };
    const rowsOn = () => [...document.querySelectorAll('#txres .tx')];
    try{
      // chk-tx-search: typing "rent" finds the Rent share payment (own bill label), a payee name works, an unknown word shows the empty state with Clear, Clear brings the list back
      reset('existing'); tab('tranzakciok'); const all0 = rowsOn().length, field = !!$('#txq');
      typeQ('rent'); const rent = rowsOn().map(r => nt(r.textContent)), hasRent = rent.length > 0 && rent.some(x => /^Rent share\s*SZABÓ DÓRA/.test(x)) && rent.length < all0, keepsField = document.activeElement !== null && $('#txq') && $('#txq').value === 'rent';
      typeQ('lidl'); const lidl = rowsOn().length > 0 && rowsOn().every(r => /LIDL/.test(r.textContent));
      typeQ('xyzq'); const emp = nt($('#txres').textContent), empty = /^No payments match 'xyzq'\s*Clear$/.test(emp) && !!$('#txres [data-txclr]');
      clk('#txres [data-txclr]'); const back = rowsOn().length === all0 && $('#txq').value === '';
      ok('chk-tx-search: Transactions has a search field; "rent" finds the Rent share payment by its own label, a payee name works, an unknown word says "No payments match \'xyzq\'" with Clear, and Clear brings the full list back', field && hasRent && keepsField && lidl && empty && back, [field, all0, rent.length, lidl, emp, back]);

      // chk-tx-chips: the five chips narrow the list and show as active chips that remove their filter; Pending says "No pending transactions."
      reset('existing'); tab('tranzakciok'); const nAll = txRows().length, names = [...document.querySelectorAll('#txchips .chip')].map(c => nt(c.textContent));
      clk('#txchips [data-txtog="pers"]'); const pr = rowsOn(), pers = pr.length > 0 && pr.length < nAll && pr.length === txRows().length && pr.every(r => /PERSELY|CURRENCY/.test(r.textContent)) && $('#txchips [data-txtog="pers"]').classList.contains('on');
      clk('#txchips [data-txtog="pers"]'); clk('#txchips [data-txtog="bills"]'); const bl = rowsOn(), bills = bl.length > 0 && bl.length < nAll && bl.some(r => /Rent share/.test(r.textContent)); clk('#txchips [data-txtog="bills"]');
      txF.dir = 'in'; renderView('tranzakciok'); const inn = rowsOn(), dirIn = inn.length > 0 && inn.every(r => /\+ /.test(r.querySelector('.a').textContent)) && /Money in/.test($('#txchips').textContent); clk('#txchips [data-txrm="dir"]'); const dirOff = txRows().length === nAll && /In\/Out/.test($('#txchips').textContent);
      txF.date = 'this'; renderView('tranzakciok'); const th = txRows().length; txF.date = 'older'; renderView('tranzakciok'); const ol = txRows().length; txReset(); renderView('tranzakciok');
      txF.cat = 'groceries'; renderView('tranzakciok'); const gr = rowsOn(), cat = gr.length > 0 && gr.length < nAll && gr.every(r => /LIDL|SPAR|ALDI|PENNY|Groceries/i.test(r.textContent)); txReset(); renderView('tranzakciok');
      clk('[data-txmode="1"]'); const pend = /No pending transactions\./.test(nt($('#v-tranzakciok').textContent)); clk('[data-txmode="0"]');
      ok('chk-tx-chips: the chips are Category, Date, In/Out, Persely and Bills; Persely and Bills narrow the list, In/Out shows only money in and its chip removes it, Date and Category narrow it, and Pending says "No pending transactions."', ['Category', 'Date', 'In/Out', 'Persely', 'Bills'].every((n, i) => names[i] === n) && pers && bills && dirIn && dirOff && th > 0 && th < nAll && ol > 0 && ol < nAll && th + ol <= nAll && cat && pend, [names, nAll, pr.length, bl.length, inn.length, th, ol, gr.length, pend]);

      // chk-tx-filter-real: the Filter button opens a real sheet with Category, Date, In or out and Only show, plus Apply, Clear and Close; nothing changes until Apply; active filters show as chips
      reset('existing'); tab('tranzakciok'); const n0 = rowsOn().length; clk('#v-tranzakciok .filter'); const sh0 = nt($('#sheet').textContent), realSheet = sheetOpen() && /Filter/.test(sh0) && /Category/.test(sh0) && /Date/.test(sh0) && /In or out/.test(sh0) && /Only show/.test(sh0) && /Apply/.test(sh0) && /Clear/.test(sh0) && /Close/.test(sh0) && !$('#toast').classList.contains('on');
      clk('#sheet [data-txfd="cat|groceries"]'); clk('#sheet [data-txfd="dir|out"]'); const untilApply = rowsOn().length === n0 && !txF.cat;
      clk('#sheet [data-txfclear]'); const cleared = !txDraft.cat && !txDraft.dir; clk('#sheet [data-txfd="cat|groceries"]'); clk('#sheet [data-txfd="dir|out"]'); clk('#sheet [data-txfapply]');
      const ap = rowsOn(), applied = !sheetOpen() && ap.length > 0 && ap.length < n0 && txF.cat === 'groceries' && txF.dir === 'out' && /Groceries/.test($('#txchips').textContent) && /Money out/.test($('#txchips').textContent) && $('#txchips [data-txrm="cat"]').classList.contains('on');
      clk('#v-tranzakciok .filter'); clk('#sheet [data-closesheet]'); const closed = !sheetOpen() && txF.cat === 'groceries';
      ok('chk-tx-filter-real: Filter opens a real sheet (Category, Date, In or out, Only show; Apply, Clear, Close), nothing changes until Apply, Clear empties the choices, Apply narrows the list and shows the choices as active chips, Close keeps the old filters', realSheet && untilApply && cleared && applied && closed, [realSheet, untilApply, cleared, applied, closed, ap.length, n0]);

      // chk-tx-rows-tappable: every row opens a detail with the full date, type, category and amount, with the analyst on or off; own-account rows too; Persely rows say "Added to [goal]" and link to the goal, with one line on the sign
      const tapAll = on => { reset('existing'); S.analyst.on = on; renderAll(); tab('tranzakciok'); const rs = rowsOn(), bad = []; S.tx.forEach((t, i) => { S._txi = i; const h = nt(pl(SHEETS.txd())); if(!/Payment/.test(h) || !/Date \d{1,2} [A-Z][a-z]+ \d{4}/.test(h) || !/Type /.test(h) || !/Amount /.test(h)) bad.push([i, h.slice(0, 80)]); }); return {n:S.tx.length, shown:rs.length, bad, btns:rs.length === TX_STEP && rs.every(r => r.tagName === 'BUTTON' && r.hasAttribute('data-txd'))}; };
      const onT = tapAll(true), offT = tapAll(false);
      reset('existing'); tab('tranzakciok'); clk('#txres [data-txd]'); const opens = sheetOpen() && /Payment/.test($('#sheet').textContent); closeSheet();
      const pi = S.tx.findIndex(t => t.n === 'PERSELY DEPOSIT' && S.goals.some(g => g.name === t.note)), pt = S.tx[pi], pg = S.goals.find(g => g.name === pt.note); S._txi = pi; const pd = nt(pl(SHEETS.txd())); sheet(SHEETS.txd());
      const persOk = new RegExp('Added to ' + pg.name).test(pd) && !!$(`#sheet [data-goal="${pg.id}"]`) && /Here it is .*4 000 Ft because the money left your Junior account/.test(pd) && /On the goal page it is \+4 000 Ft/.test(pd) && (pl($('#sheet').innerHTML).match(/On the goal page/g) || []).length === 1; clk(`#sheet [data-goal="${pg.id}"]`); const goalPage = !sheetOpen() && stack.length && stack[stack.length - 1].dataset.id === 'goal'; while(stack.length) popPage(true);
      const si = S.tx.findIndex(t => t.n === 'SZABÓ DÓRA'); S._txi = si; const rd = nt(pl(SHEETS.txd())); const billOk = /Your label Rent share/.test(rd) && /Paid to SZABÓ DÓRA/.test(rd);
      ok('chk-tx-rows-tappable: every Transactions row is a button that opens its detail (full date, type, amount, category), with the analyst on or off, own-account rows too; a Persely row says "Added to [goal]", links to the goal page and explains the sign in one line; a bill row shows Your label and Paid to', onT.n > 150 && onT.shown === TX_STEP && onT.bad.length === 0 && onT.btns && offT.n === onT.n && offT.bad.length === 0 && offT.btns && opens && persOk && goalPage && billOk, [onT.n, onT.bad.slice(0, 3), offT.bad.slice(0, 3), opens, persOk, goalPage, billOk]);

      // chk-tx-category-passin: a category legend row on Home (it replaced the bars) and a category row on Spending opens Transactions with that category chip on; it clears with the chip, and on leaving the tab
      reset('existing'); tab('fooldal'); const hb = $('#v-fooldal .clg-i[data-fcat]'), hc = hb && hb.dataset.fcat; hb && hb.click(); const fromHome = cur === 'tranzakciok' && txF.cat === hc && rowsOn().length > 0 && rowsOn().length < S.tx.length && $('#txchips [data-txrm="cat"]').textContent.includes(CATEGORY[hc][0]);
      tab('fooldal'); const leftClears = !txF.cat && !txQ; pushPage('mymoney'); const sb = $('.page .mp-r[data-fcat]:not([data-fcat="persely"])'), sc = sb && sb.dataset.fcat; sb && sb.click(); const fromSpend = cur === 'tranzakciok' && txF.cat === sc && !stack.length && rowsOn().length > 0 && rowsOn().every(r => r.dataset.txd !== undefined);
      clk('#txchips [data-txrm="cat"]'); const chipClears = !txF.cat && txRows().length === S.tx.length && /Category/.test($('#txchips').textContent); tab('fooldal');
      ok('chk-tx-category-passin: tapping a category bar on Home or a category row on Spending opens Transactions with that category chip on and a shorter list; removing the chip or leaving the tab clears it', !!hb && !!sb && fromHome && leftClears && fromSpend && chipClears, [hc, sc, fromHome, leftClears, fromSpend, chipClears]);

      // chk-recat-undo: Change category opens a picker; choosing one shows "Moved to Everyday essentials · N% used" with the real percentage and an Undo chip that reverses only this move
      reset('existing'); S.analyst.on = true; const li2 = S.tx.findIndex(t => t.n === 'LIDL MAGYARORSZÁG' && !t.parts && txWhen(t).ym === shownMonth().ym && classify(t) === 'groceries'); S._txi = li2;
      const cat0 = classify(S.tx[li2]), heldRules = JSON.stringify(S.catRules); S.tx.unshift({...stamp(), d:'Today', n:'WOLT HUNGARY', s:'Card payment', a:-9000, ic:'food'}); S._txi = 0; renderAll();
      sheet(SHEETS.txd()); clk('#sheet [data-txcat2]'); const picker = /Category/.test($('#sheet').textContent) && !!$('#sheet [data-setcat="groceries"]');
      const bg0 = JSON.stringify(S.accounts), other = S.tx[1].cat; clk('#sheet [data-setcat="groceries"]'); const u2 = splitUse(), want = Math.round(u2.ess / splitBudget('ess') * 100), chip = nt($('#uchip').textContent);
      const moved = classify(S.tx[0]) === 'groceries' && UCH.on && chip === `Moved to Everyday essentials · ${want}% usedUndo` && want > 0;
      S.catRules.ZZ = 'food'; /* a later, separate change must stay */ clk('#uchip [data-undo]'); const undone = classify(S.tx[0]) === 'food' && !S.tx[0].cat && S.catRules['WOLT HUNGARY'] === undefined && S.catRules.ZZ === 'food' && JSON.stringify(S.accounts) === bg0 && S.tx[1].cat === other && !UCH.on;
      ok('chk-recat-undo: Change category then a category shows "Moved to Everyday essentials · N% used" (N is the real share of the Everyday essentials budget) with a 10 s Undo chip; Undo puts back only that payment\'s category and its payee rule, and a later change stays', picker && moved && undone && UNDO_MS === 10000, [picker, moved, undone, chip, want]);
    } catch(e){ ok('chk-phase8: the new checks ran without errors', false, String(e && e.stack || e)); }
    finally { hideBanners(); hideChip(true); PEND = null; MQ.q = []; hideToast(true); txReset(); while(stack.length) popPage(true); S = sv16; cur = cur16; stack.push(...stk16); demo.locked = lock16; try{ closeSheet(); renderAll(); }catch(e){} document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', views16[i])); }
  }
  { // The monthly spending circle by category (Home and Spending) and the Spending page UI rework (docs/spending-ui-rework.md)
    const sv17 = S, cur17 = cur, stk17 = stack.splice(0), lock17 = demo.locked, views17 = [...document.querySelectorAll('.view')].map(v => v.classList.contains('on')); demo.locked = false;
    const nt = t => String(t).replace(/[\s\u00a0\u202f]+/g, ''), clk = sel => { const b = $(sel); if(b) b.click(); return !!b; };
    const reset = kind => { hideBanners(); while(stack.length) popPage(true); try{ closeOnb(); }catch(e){} try{ closeStory(); }catch(e){} closeSheet(); MQ.q = []; hideChip(true); hideToast(true); txReset(); txMode = 0; S = fresh(kind); SETUP_COLLAPSED = false; renderAll(); };
    const top = () => stack.length ? stack[stack.length - 1].dataset.id : '';
    const ringOf = g => { const segs = g ? [...g.querySelectorAll('circle.seg')] : []; return {segs, sum:segs.reduce((a, c) => a + +c.dataset.v, 0), cats:segs.map(c => c.dataset.cat)}; };
    try{
      // chk-home-circle-categories: one arc per category with card spending, the arcs add up to Card spending, a legend with the same categories, colours and amounts
      const homeRes = ['existing', 'new'].map(kind => { reset(kind); tab('fooldal');
        const g = $('#v-fooldal .gauge[data-cring]'), r = ringOf(g), want = catRows(catSpend(shownMonth().ym)), lg = [...document.querySelectorAll('#v-fooldal .clg-i')];
        const legendOk = lg.length === want.length && want.every(([c, v], i) => nt(lg[i].textContent).includes(nt(catName(c) + ' ' + ft(v))) && lg[i].querySelector('.dotc').style.background && r.segs[i].getAttribute('stroke') === catCol(c));
        const core = g && nt(g.querySelector('.core').textContent) === nt('Card spending ' + ft(cardSpending()));
        return {ok:!!g && r.segs.length > 1 && r.sum === cardSpending() && r.cats.join() === want.map(x => x[0]).join() && new Set(r.cats).size === r.cats.length && legendOk && core && /^Card spending in /.test(g.getAttribute('aria-label') || '') && g.getAttribute('role') === 'img', n:r.segs.length, sum:r.sum, cs:cardSpending(), legendOk, core}; });
      reset('existing'); tab('fooldal'); const sg = $('#v-fooldal circle.seg[data-fcat]'), sgc = sg && sg.dataset.fcat; sg && sg.dispatchEvent(new MouseEvent('click', {bubbles:true})); const segTap = cur === 'tranzakciok' && txF.cat === sgc; txReset(); tab('fooldal');
      reset('existing'); tab('hub'); const pt = $('#v-hub .ptot .gauge'), ptOk = SIMPLE_PERSELY ? !!$('#v-hub .sp-big') && !$('#v-hub [data-cring], #v-hub circle.seg') : !!pt && !pt.hasAttribute('data-cring') && pt.querySelectorAll('circle').length >= 1 && !pt.querySelector('circle.seg');   // SIMPLE_PERSELY: the tab total is the big number over the jars, never a category ring
      ok('chk-home-circle-categories: the Home circle has one arc per category with card spending (both seeds), the arcs add up to Card spending, each has its own colour, the legend lists the same categories with colour dot, name and amount, the core shows Card spending, the circle reads the split aloud; tapping an arc opens Transactions with that category; the Persely tab total ' + (SIMPLE_PERSELY ? 'is the plain big number over the jars' : 'keeps its plain ring'), homeRes.every(x => x.ok) && segTap && ptOk, {homeRes, segTap, ptOk});

      // chk-home-details-button: a full width Details button (44 px or more) under the legend opens the Spending page
      reset('existing'); tab('fooldal'); const db = $('#v-fooldal .dbtn'), dr = db ? db.getBoundingClientRect() : null, dAfter = db && $('#v-fooldal .clg') && ($('#v-fooldal .clg').compareDocumentPosition(db) & Node.DOCUMENT_POSITION_FOLLOWING);
      db && db.click(); const dOpen = top() === 'mymoney'; while(stack.length) popPage(true);
      ok('chk-home-details-button: Home shows a visible See spending details button under the circle legend, at least 44 px high and wide, that opens the Spending page', !!db && /^Seespendingdetails/.test(nt(db.textContent)) && dr.height >= 44 && dr.width >= 44 && !!dAfter && db.dataset.go === 'mymoney' && dOpen, [dr && dr.height, dr && dr.width, !!dAfter, dOpen]);

      // chk-spending-ui: Safe to spend hero first and above the fold, the same category ring (larger) with the legend as rows, rows open Transactions with the chip, plan stack, one tips card, 14 px text for conditions
      reset('existing'); tab('fooldal'); pushPage('mymoney'); const pg = stack[stack.length - 1], sc = pg.querySelector('.scroll'), first = [...sc.children].find(e => e.offsetHeight > 0 && !e.classList.contains('hint'));
      const hr = first ? first.getBoundingClientRect() : null, sr = sc.getBoundingClientRect(), fold = Math.min(844, innerHeight), heroOk = !!first && first.classList.contains('safebig') && hr.bottom <= sr.bottom && hr.bottom <= fold;
      const bg = pg.querySelector('.gauge[data-cring="big"]'), br = ringOf(bg), hg = $('#v-fooldal .gauge[data-cring]'), bigger = bg && hg && bg.getBoundingClientRect().width >= hg.getBoundingClientRect().width;
      const rows = [...pg.querySelectorAll('.cs-r')], rowsOk = rows.length === br.segs.length && rows.every((r, i) => r.dataset.cat === undefined && nt(r.textContent).includes(catName(br.cats[i])) && r.querySelector('.mp-bar i'));
      const blocks = ['.safebig', '.gauge[data-cring]', '.mend', '.cshare', '[data-go="bills"]', '.pstack', '.ptips', '[data-go="nextmonth"]', '.anfoot'].map(s => pg.querySelector(s)), inOrd = blocks.every((b, i) => b && (i === 0 || (blocks[i - 1].compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)));
      const px = s => { const e = pg.querySelector(s); return e ? parseFloat(getComputedStyle(e).fontSize) : 0; }, sizes = ['.safebig .t small', '.mend small', '.mp-fine', '.ptips li, .ptips p', '.cs-h b'].map(px), small = sizes.every(x => x >= 14);
      const tall = [...pg.querySelectorAll('.cs-r, .safebig, .mp-d>summary, .row')].every(e => e.getBoundingClientRect().height >= 44);
      const cr = pg.querySelector('.cs-r[data-fcat]'), crc = cr && cr.dataset.fcat; cr && cr.click(); const chip = cur === 'tranzakciok' && txF.cat === crc && !stack.length && $('#txchips [data-txrm="cat"]') && $('#txchips [data-txrm="cat"]').textContent.includes(CATEGORY[crc][0]) && $('#txchips [data-txrm="cat"]').classList.contains('on');
      txReset(); tab('fooldal');
      // chk-spacing-scale: one spacing scale (4/8/12/16/24/32) as tokens; gutters, card padding, section gaps, Quick actions, pages and sheets use it; no off-scale px step in the app's own rules
      { const rs = getComputedStyle(document.documentElement), tk = ['--sp-1','--sp-2','--sp-3','--sp-4','--sp-5','--sp-6'].map(t => parseFloat(rs.getPropertyValue(t))), roles = ['--gutter','--pad-card','--gap-stack','--gap-sec','--gap-title','--gap-btn','--row-y','--row-x'].every(t => tk.includes(parseFloat(rs.getPropertyValue(t))));
        const cs = e => e ? getComputedStyle(e) : null, pxv = (e, p) => e ? parseFloat(cs(e)[p]) : -1, v0 = $('#v-fooldal'), cd = $('#v-fooldal .card'), sc0 = $('#v-fooldal .sec'), shc = $('#v-fooldal .short');
        pushPage('mymoney'); const ps = stack[stack.length - 1].querySelector('.scroll'), pgPad = pxv(ps, 'paddingLeft'); while(stack.length) popPage(true);
        clk('#v-fooldal .short [data-sheet="hubsave"]'); const shPad = pxv($('#sheet'), 'paddingLeft'); closeSheet();
        const OKS = new Set([0, 1, 2, 4, 8, 12, 16, 24, 32]), skip = /^(\.st-|\.story|\.lock|\.nbanner|\.lcard|\.ff|\.demo|\.rotate|\.device|\.bezel|\.hw|\.sbar|\.isl|\.homebar|\.caption|\.fid|\.phone|body|\.stage)/, off = [];
        const walk = rules => { for(const r of rules){ if(r.cssRules && !r.style){ walk(r.cssRules); continue; } if(!r.style || skip.test(r.selectorText || '')) continue;
          ['margin-top','margin-right','margin-bottom','margin-left','padding-top','padding-right','padding-bottom','padding-left','row-gap','column-gap'].forEach(p => { const m = (r.style.getPropertyValue(p) || '').match(/^(\d+(?:\.\d+)?)px$/); if(m && +m[1] <= 32 && !OKS.has(+m[1])) off.push(r.selectorText + ' ' + p); }); } };
        try{ walk([...document.styleSheets].find(x => !x.href || /\/css\/app\.css$/.test(x.href)).cssRules); }catch(e){ off.push('unreadable'); }
        const keys = {gutter:pxv(v0, 'paddingLeft'), card:pxv(cd, 'paddingLeft'), sec:pxv(sc0, 'marginTop'), short:pxv(shc, 'paddingLeft'), page:pgPad, sheet:shPad};
        ok('chk-spacing-scale: the spacing tokens --sp-1 to --sp-6 are 4/8/12/16/24/32 with role tokens on top; the screen gutter, card padding, section gap, Quick actions, page and sheet padding use them (16/16/24/16/16/16); no rule of the app uses an off-scale px step', tk.join() === '4,8,12,16,24,32' && roles && keys.gutter === 16 && keys.card === 16 && keys.sec === 24 && keys.short === 16 && keys.page === 16 && keys.sheet === 16 && off.length === 0, {tk, roles, keys, off:off.slice(0, 8)}); }
      // chk-home-labels: every Home quick action has an icon, a verb label and a one line helper, is 44 px or more, and does what it says (Add money to a goal opens the shared Add money sheet)
      { reset('existing'); tab('fooldal'); const qa = [...document.querySelectorAll('#v-fooldal .short button')], VERB = /^(Add|Pay|Manage|See|Open|Send|Move|Save)\b/;
        const tx = e => e ? e.textContent.replace(/\s+/g, ' ').trim() : '', each = qa.map(b => ({icon:!!b.querySelector('.c svg'), label:tx(b.querySelector('.t b')), help:tx(b.querySelector('.t small')), h:b.getBoundingClientRect().height}));
        const allOk = qa.length === 3 && each.every(x => x.icon && VERB.test(x.label) && x.help.length >= 10 && !/-/.test(x.help) && x.h >= 44);
        clk('#v-fooldal .short [data-sheet="hubsave"]'); const addOk = /goal/i.test(each[0] && each[0].label) && sheetOpen() && tx($('#sheet h2')) === 'Add money'; closeSheet();
        ok('chk-home-labels: each Home quick action shows an icon, a verb label and a one line helper (no hyphens), at 44 px or more; Add money to a goal opens the shared Add money sheet', allOk && addOk, {each, addOk}); }
      ok('chk-spending-ui: the Spending page opens with the Safe to spend hero above the fold (390x844), then the same category ring as Home (larger, arcs add up to Card spending), Month end, Where it went (one row per arc, with a bar), Bills, My plan with a stacked bar, one Persi tips card, Next month, footer; text for conditions is 14 px or more, targets 44 px; a category row opens Transactions with that category chip on', heroOk && !!bg && br.sum === cardSpending() && bigger && rowsOk && inOrd && small && tall && chip, {heroOk, hb:hr && hr.bottom, sum:br.sum, bigger, rowsOk, inOrd, sizes, tall, chip});
    } catch(e){ ok('chk-spending-rework: the new checks ran without errors', false, String(e && e.stack || e)); }
    finally { hideBanners(); hideChip(true); PEND = null; MQ.q = []; hideToast(true); txReset(); while(stack.length) popPage(true); S = sv17; cur = cur17; stack.push(...stk17); demo.locked = lock17; try{ closeSheet(); renderAll(); }catch(e){} document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', views17[i])); }
  }
  if(SPF){ // Simple Persely, Phase 1 (docs/simple-persely-phase1-notes.md). Only with the flag on: ?simple=0 keeps exactly the old set.
    const svS = S, curS = cur, stkS = stack.splice(0), lockS = demo.locked, viewsS = [...document.querySelectorAll('.view')].map(v => v.classList.contains('on')), OS = JSON.stringify(O); demo.locked = false;
    const pl = h => String(h).replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' '), nt = t => String(t).replace(/\s+/g, ' ').trim(), clk = sel => { const b = $(sel); if(b) b.click(); return !!b; };
    const reset = kind => { hideBanners(); while(stack.length) popPage(true); try{ closeOnb(); }catch(e){} try{ closeStory(); }catch(e){} closeSheet(); MQ.q = []; hideChip(true); hideToast(true); spHideReward(true);
      Object.assign(SP, {celebrated:false, forceOffline:false, forceFail:false, forceRM:null, last:null}); S = fresh(kind); renderAll(); tab('fooldal'); };
    // visible words: tokens with a letter; amounts ("1 000 Ft"), percentages and the digits of dates count as numbers, not words; visually hidden text is skipped
    const frags = el => { const out = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while((n = w.nextNode())){ if(n.parentElement.closest('.vhid,[aria-hidden="true"],script,style') || !n.nodeValue.trim()) continue; out.push(n.nodeValue.replace(/\s+/g, ' ').trim()); } return out; };
    const vis = el => frags(el).join(' ');
    const numz = t => t.replace(/\d[\d\s.,]*\s?(Ft|%|€)/g, ' # ').replace(/\d[\d\s.,]*/g, ' # ');
    const words = t => numz(t).split(/\s+/).filter(x => /[A-Za-z]/.test(x)), toks = t => numz(t).split(/\s+/).filter(x => /[A-Za-z#]/.test(x));
    const primaries = el => [...el.querySelectorAll('.btn')].filter(b => !b.matches('.w,.ghost,.eq,.sm') && b.offsetParent !== null);
    try{
      // 3 taps from the Home card, the reward on the same tap, one Undo for both
      reset('new'); const j0 = acc('junior').v; let taps = 0;
      if(clk('#v-fooldal .sphome')) taps++; const t1 = cur === 'hub';
      if(clk('#v-hub .spfirst [data-tilepick="travel"]')) taps++; const t2 = !!$('#onb.on .spconfirm');
      if(clk('#onb [data-spsave]')) taps++;
      const g = S.goals[0], home3 = taps === 3 && t1 && t2 && !!g && gSaved(g) === 1000 && acc('junior').v === j0 - 1000 && total() === 1000 && S.streak === 1 && S.history.includes(S.week) && S.savedWeek;
      const rw = SP.last || {}, rEl = $('#sprw'), rVis = !!rEl && rEl.classList.contains('on') && rEl.getBoundingClientRect().height > 0, rTxt = rEl ? nt(rEl.textContent) : '';
      const reward = rVis && rw.ms <= 500 && !rw.sheet && !sheetOpen() && rw.pages === 0 && stack.length === 0 && cur === 'hub' && rw.coin && /Week 1 done/.test(rTxt) && /1 000 Ft saved!/.test(rTxt) && !!rEl.querySelector('[data-spgreat]') && !MQ.q.some(x => x.id === 'nudge' || x.id === 'firstadd') && UCH.on && S.nudgeAsk === 'wait';
      clk('#uchip [data-undo]'); const undone = S.goals.length === 0 && acc('junior').v === j0 && total() === 0 && S.streak === 0 && !SP.rewardOn && !!$('#v-hub .spfirst');
      reset('new'); taps = 0; if(clk('#tabbar [data-tab="hub"]')) taps++; if(clk('#v-hub [data-tilepick="safety"]')) taps++; if(clk('#onb [data-spsave]')) taps++;
      const tab3 = taps === 3 && S.goals.length === 1 && total() === 1000 && S.goals[0].name === 'Safety net';
      // the Sunday nudge: not on day 0, Persi asks on the next visit with equal Yes / Not now, the phone permission only after Yes
      let asked = 0; const rp = window.Notification && Notification.requestPermission; if(rp) Notification.requestPermission = () => { asked++; return Promise.resolve('default'); };
      clk('#sprw [data-spgreat]'); const day0 = !/spnudge/.test(vHub()); tab('fooldal'); tab('hub'); const nb = [...document.querySelectorAll('#v-hub .spnudge .btn')];
      const nudge = day0 && nb.length === 2 && nb[0].className === nb[1].className && /Want a nudge on Sunday\?/.test(nt($('#v-hub .spnudge').textContent)) && asked === 0;
      clk('#v-hub [data-spnudge="1"]'); const yes = S.remind === true && S.nudgeAsk === 'done' && !/spnudge/.test(vHub()) && (asked === 1 || !PUSH.supported); if(rp) Notification.requestPermission = rp;
      ok('chk-simple-3-taps: Home card "Save your first 1 000 Ft" -> Trip -> "Save 1 000 Ft now" creates the goal, moves 1 000 Ft from the Junior account and starts the streak (week 1) in 3 taps; the Persely tab icon path is 3 taps too; one Undo reverses the deposit and the goal', home3 && tab3 && undone, {home3, tab3, undone});
      ok('chk-simple-reward-same-tap: the reward (coin into Persi, "Week 1 done", "1 000 Ft saved!", Great) shows on the Persely tab within 500 ms of tap 3, no sheet or page over it, the Undo chip on screen; no "Start your streak?" or Sunday nudge sheet on day 0; Persi asks "Want a nudge on Sunday?" on the next visit with equal Yes / Not now, and the phone permission comes only after Yes', reward && nudge && yes, {ms:rw.ms, rVis, rw, rTxt, nudge, yes});

      // edge states and later goals
      reset('new'); acc('junior').v = 20800; spOpen('travel'); const e500 = nt($('#onb [data-spsave]').textContent) === 'Save 500 Ft now'; O.sp = false; closeOnb();
      acc('junior').v = 20300; spOpen('travel'); const eCreate = nt($('#onb [data-spsave]').textContent) === 'Create goal' && /Persi will ask on payday\./.test(nt($('#onb').textContent)); O.sp = false; closeOnb();
      acc('junior').v = 87450; SP.forceOffline = true; spOpen('travel'); const ob = $('#onb [data-spsave]'), eOff = ob.disabled && nt(ob.textContent) === 'No connection. Try again.'; spSave(); const offNo = S.goals.length === 0 && acc('junior').v === 87450;
      SP.forceOffline = false; spRender(); SP.forceFail = true; clk('#onb [data-spsave]'); const eFail = /That did not work\. Your money did not move\. Try again\./.test(nt($('#onb').textContent)) && S.goals.length === 0 && acc('junior').v === 87450 && !UCH.on; SP.forceFail = false; O.sp = false; closeOnb();
      reset('existing'); const keep = JSON.stringify(S.goals), je = acc('junior').v; spOpen('travel'); const later0 = nt($('#onb [data-spsave]').textContent) === 'Create goal' && !!$('#onb [data-spamt="0"].on');
      clk('#onb [data-spamt="2000"]'); const later1 = nt($('#onb [data-spsave]').textContent) === 'Save 2 000 Ft now'; clk('#onb [data-spsave]'); const ng = S.goals[S.goals.length - 1];
      const later = later0 && later1 && ng.name === 'Trip' && gSaved(ng) === 2000 && acc('junior').v === je - 2000 && JSON.stringify(S.goals.slice(0, 3)) === keep && !SP.rewardOn;
      ok('chk-simple-edge-states: Junior under 21 000 Ft reads "Save 500 Ft now", under 20 500 Ft "Create goal" with "Persi will ask on payday."; offline the button is disabled, reads "No connection. Try again." and nothing moves; a failure says "That did not work. Your money did not move. Try again." and nothing moves; a later goal starts at No deposit (chips), can save 2 000 Ft in the same tap, and the existing goals do not change', e500 && eCreate && eOff && offNo && eFail && later, {e500, eCreate, eOff, offNo, eFail, later0, later1, later});

      // honesty line on the confirm screen, the Add money sheet and the goal page footer
      reset('new'); spOpen('travel'); const conf = $('#onb').innerHTML, confEnd = juniorEndLabel(); O.sp = false; closeOnb();
      reset('existing'); S._goal = S.goals[0].id; const hs = SHEETS.hubsave(); S._detail = S.goals[0].id; const gp = PAGES.goal.html(); sheet(SHEETS.spgtk()); const gk = pl($('#sheet').innerHTML); closeSheet();
      // Phase 3b: on the Add money sheet and the goal page the honesty line is the Rate and safety line (rsLine), and there is exactly one line
      const one1 = h => (h.match(/class="rsline"|class="fine sphon/g) || []).length === 1;
      const hon = (h, end = juniorEndLabel()) => /<!-- CONFIRM WITH OTP -->/.test(h) && pl(h).includes(`3.0% until ${end}`) && /Withdraw any time/.test(h) && /Protected/.test(h) && one1(h) && ((/data-sheet="spgtk"/.test(h) && /Learn more/.test(h)) || (/class="rsline" data-sheet="ratesafe"/.test(h) && /aria-label="Rate and safety/.test(h)));
      ok('chk-simple-honesty-line: exactly one "3.0% until [Junior end date] · Withdraw any time · Protected ⓘ" line (it opens the conditions: Good to know on the confirm screen, Rate and safety on the Add money sheet and the goal page; CONFIRM WITH OTP kept) on the first-run confirm screen, the Add money sheet and the goal page (Phase 2 adds the tab)', hon(conf, confEnd) && hon(hs) && hon(gp) && /3\.0% a year on the first 500 000 Ft/.test(gk) && /28% tax/.test(gk) && /Deposit protection/.test(gk), [hon(conf, confEnd), hon(hs), hon(gp)]);

      // the old first run is still there with ?simple=0 (rendered here with SP_LEGACY)
      spLeg(true); reset('new'); const legHub = vHub(), legHome = vFooldal(); tab('hub'); clk('#v-hub [data-tilepick="travel"]'); const wiz = /Step 1 of 3/.test(nt($('#onb').textContent)); closeOnb(); spLeg(false); renderAll();
      const parse = q => new URLSearchParams(q).get('simple') !== '0';
      ok('chk-simple-flag-fallback: SIMPLE_PERSELY is on by default and ?simple=0 turns it off; off renders the old first run (setup card with 6 tiles, Home "Start your first goal" opening the tile sheet, the 3-step wizard, the Sunday nudge sheet); the full old check set is run with ?simple=0', SIMPLE_PERSELY === true && parse('?simple=0') === false && parse('?demo=1') === true && parse('') === true && /id="setupcard"/.test(legHub) && (legHub.match(/data-tilepick=/g) || []).length === 6 && /Start your first goal/.test(legHome) && /data-sheet="newgoal"/.test(legHome) && wiz && typeof SHEETS.nudge === 'function', {wiz});

      // reduced motion, sound and haptic
      let cel = 0; const c0 = pig3d && pig3d.celebrate; if(pig3d) pig3d.celebrate = () => { cel++; };
      reset('new'); SP.forceRM = true; spOpen('travel'); clk('#onb [data-spsave]'); const fadeOk = $('#sprw').classList.contains('fade') && !$('#sprw').classList.contains('pop') && cel === 0 && SP.last.fade && !SP.last.coin;
      reset('new'); S.sound = false; spOpen('travel'); clk('#onb [data-spsave]'); const popOk = $('#sprw').classList.contains('pop') && cel === 1 && SP.last.sound === false;
      if(pig3d) pig3d.celebrate = c0;
      S.sound = false; const s1 = spPlayCoin(); S.sound = true; const ds = demo.sound; demo.sound = false; const s2 = spPlayCoin(); demo.sound = ds; const s3 = spPlayCoin();
      pushPage('settings'); const sw = $('.page [data-sw="sound"]'), swOn = !!sw && sw.getAttribute('aria-checked') === 'true' && sw.offsetHeight >= 44; if(sw) sw.click(); const swOff = S.sound === false; popPage(true); S.sound = true;
      ok('chk-simple-motion-sound: reduced motion gives a fade and no jump or falling coin; Sound off (Settings > Persely > Sound, on by default) or the demo sound off gives no audio; the chime uses the ambient audio session so the silent switch mutes it; a haptic tick where the device has one', fadeOk && popOk && s1 === false && s2 === false && s3 === true && swOn && swOff && /ambient/.test(spPlayCoin.toString()) && /vibrate/.test(spHaptic.toString()), {fadeOk, popOk, s1, s2, s3, swOn, swOff});

      // one primary button per first-run screen, and the copy limits of the first run
      reset('new'); const homeT = nt($('#v-fooldal .sphome').textContent); tab('hub'); const pTab = primaries($('#v-hub')).length, hubF = frags($('#v-hub')), wTab = words(hubF.join(' ')), persiT = nt($('#v-hub .spfirst .persi-t span').textContent);
      const wConf = {}; SP_TILES.forEach(([k]) => { spOpen(k); wConf[k] = words(vis($('#onb'))).length; O.sp = false; closeOnb(); });
      spOpen('travel'); const pConf = primaries($('#onb')).length, confF = frags($('#onb')), btnT = nt($('#onb [data-spsave]').textContent); clk('#onb [data-spsave]'); const pRw = primaries($('#sprw')).length, wRw = words(vis($('#sprw'))).length;
      ok('chk-simple-one-primary: the first-run Persely tab has no primary button (4 tiles and More goals), the confirm screen exactly one ("Save 1 000 Ft now"), the reward exactly one ("Great"); the tab, More goals and Change links are 44 px', pTab === 0 && pConf === 1 && pRw === 1, {pTab, pConf, pRw});
      const fr = [...hubF, ...confF, homeT, persiT], all = fr.join(' '), sents = fr.flatMap(f => f.split(/[.!?·](?!\d)/)).map(x => toks(x).length);
      ok('chk-simple-first-run-words: at most 25 words on each first-run screen (tab, confirm screen for each of the 4 tiles, reward; amounts and dates are numbers, not words), Persi at most 8 words, sentences at most 12 words, no "deadline", verb first on the button', wTab.length <= 25 && Object.values(wConf).every(n => n <= 25) && wRw <= 25 && toks(persiT).length <= 8 && sents.every(n => n <= 12) && !/deadline/i.test(all) && /^Save /.test(btnT), {wTab:wTab.length, wConf, wRw, persi:toks(persiT).length, maxSent:Math.max(...sents), longest:fr.flatMap(f => f.split(/[.!?·](?!\d)/)).sort((a, b) => toks(b).length - toks(a).length)[0]});
      // later phases own the other chk-simple-* checks; these three are stubs until their phase is built
      ok('chk-simple-grade (stub, Phase 4: in-app FK grade ≤ 4 for tab and first-run texts)', true, 'stub');
      ok('chk-simple-analyst-line (stub, Phase 6: Learn more and Turn off equal; the Phase 1 one line is checked in chk-analyst-notice)', true, 'stub');
      ok('chk-simple-hu-keys (stub, Phase 4: every new string has a HU key)', true, 'stub');
    } catch(e){ ok('chk-simple-phase1: the Simple Persely checks ran without errors', false, String(e && e.stack || e)); }
    finally { hideBanners(); hideChip(true); PEND = null; MQ.q = []; hideToast(true); try{ closeOnb(); spHideReward(true); }catch(e){} while(stack.length) popPage(true); spLeg(false); S = svS; cur = curS; stack.push(...stkS); demo.locked = lockS;
      try{ Object.keys(O).forEach(k => delete O[k]); Object.assign(O, JSON.parse(OS)); closeSheet(); renderAll(); }catch(e){} document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', viewsS[i])); }
  }
  if(SIMPLE_PERSELY){ // Simple Persely Phase 3 (connections): Rate and safety, simple goal page, simple Add money, reading grade of the rewritten copy (docs/simple-persely-plan.md 2c, 2e, 2f)
    const svR = S, curR = cur, stkR = stack.splice(0), lockR = demo.locked, viewsR = [...document.querySelectorAll('.view')].map(v => v.classList.contains('on')), oR = JSON.stringify(O); demo.locked = false;
    const pl = h => String(h).replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' '), nt = t => String(t).replace(/\s+/g, ' ').trim(), clk = sel => { const b = $(sel); if(b) b.click(); return !!b; };
    const setf = (id, v) => { const f = $('#' + id); f.value = v; f.dispatchEvent(new Event('input', {bubbles:true})); };
    const reset = kind => { hideBanners(); while(stack.length) popPage(true); try{ closeOnb(); }catch(e){} closeSheet(); MQ.q = []; hideChip(true); hideToast(true); S = fresh(kind); SETUP_COLLAPSED = false; renderAll(); };
    const h2 = () => sheetOpen() ? nt(($('#sheet h2') || {}).textContent || '') : '';
    const opensRS = sel => { if(sheetOpen()) closeSheet(); const b = $(sel); if(!b) return null; b.click(); const r = h2() === 'Rate and safety'; closeSheet(); return r; };
    const count = el => { const t = el.innerText.replace(/(\d)[\s  ](?=\d{3}\b)/g, '$1'), tok = t.match(/[A-Za-z0-9€][A-Za-z0-9'’%.,€-]*/g) || []; return {words:tok.length, numbers:tok.filter(x => /\d/.test(x)).length}; };
    try{
      // chk-simple-rate-safety-one-sheet
      reset('existing'); const end = juniorEndLabel(), rs = SHEETS.ratesafe(), rt = pl(rs), bars = [...rs.matchAll(/class="why-bar"><i style="width:([\d.]+)%/g)].map(m => +m[1]);
      const content = /^\s*Rate and safety/.test(rt) && rt.includes(`You get 3.0% a year on up to ${nt(ft(CAP))}. It ends on ${end}.`) && /All your forint goals count together/.test(rt) && /28% tax/.test(rt) && /about 2\.2%/.test(rt) && /every month/.test(rt)
        && /Withdraw any time, for free/.test(rt) && /12 more months/.test(rt) && /30 days' notice/.test(rt) && /Others get 0\.01%/.test(rt) && /Deposit protection/.test(rt) && /<!-- CONFIRM WITH OTP: scheme name and coverage limit -->/.test(rs) && /<!-- CONFIRM WITH OTP -->/.test(rs)
        && /What 100 000 Ft earns in a year, after tax/.test(rt) && bars.length === 3 && bars[1] === 100 && Math.abs(bars[0] / bars[1] - 2160 / 2520) < .01 && bars[2] < 2 && /2 160 Ft a year after tax/.test(rt) && /2 520 Ft a year after tax/.test(rt) && /\b7 Ft a year after tax/.test(rt)
        && rt.includes('The Savings account pays a bit more: 3.5%. Persely pays 3.0%. Both are taxed. Persely keeps each goal apart. You can withdraw any time, for free.') && !/Persely (pays|earns) more|beats/i.test(rt);
      const aliases = SHEETS.goodtoknow === SHEETS.ratesafe && SHEETS.whyp === SHEETS.ratesafe && /data-sheet="ratesafe"/.test(gtkCard()) && !/Good to know/.test(pl(gtkCard()));
      const howT = pl(SHEETS.how()), how = /data-sheet="ratesafe"/.test(SHEETS.how()) && !/for every Junior customer|Junior rate/.test(howT) && /Streak/.test(howT) && howT.includes(`You get 3.0% on up to ${nt(ft(CAP))} until ${end}.`);
      const legal = /LEGAL CAUTION/.test(String(rsLine) + appSrc().js) && /CONFIRM WITH OTP/.test(rsLine());
      tab('fooldal'); const eHome = opensRS('#v-fooldal .whyl');
      tab('hub'); const tabBtns = [...document.querySelectorAll('#v-hub [data-sheet="goodtoknow"], #v-hub [data-sheet="whyp"], #v-hub [data-sheet="ratesafe"]')], tabN = tabBtns.length, eTab = tabBtns.every(b => { b.click(); const r = h2() === 'Rate and safety'; closeSheet(); return r; });
      const gm = S.goals.find(g => !g.shared && !isEur(g) && gSaved(g) > 0); S._detail = gm.id; pushPage('goal'); const eGoal = opensRS('.page:last-child [data-sheet="ratesafe"]'); while(stack.length) popPage(true);
      pushPage('grad'); const eJunior = opensRS('.page:last-child [data-sheet="ratesafe"]'); while(stack.length) popPage(true);
      sheet(SHEETS.how()); const eHow = opensRS('#sheet [data-sheet="ratesafe"]');
      S._goal = gm.id; sheet(SHEETS.hubsave()); const eAdd = opensRS('#sheet .rsline');
      let eWiz = true; try{ startOnb('travel'); O.i = STEPS.length - 1; renderOnb(); if($('#onb [data-sheet="ratesafe"], #onb [data-sheet="goodtoknow"]')){ (($('#onb [data-sheet="ratesafe"]') || $('#onb [data-sheet="goodtoknow"]'))).click(); eWiz = h2() === 'Rate and safety'; closeSheet(); } }catch(e){ eWiz = false; } finally { try{ closeOnb(); }catch(e){} }
      ok('chk-simple-rate-safety-one-sheet: one Rate and safety sheet replaces Good to know, Why Persely? and the rate part of How Persely works; Home Why Persely?, the tab links, the goal page, the Junior page, How Persely works, the Add money footer and the wizard all open it; it holds the rate and end date, the 500 000 Ft cap for all forint goals, 28% tax (about 2.2%), paid monthly, withdraw any time for free, the 12 more months rule with 30 days notice, 0.01% for others, deposit protection (CONFIRM WITH OTP), and the per 100 000 Ft bars after tax with the plan sentence',
        content && aliases && how && legal && eHome && eTab && eGoal && eJunior && eHow && eAdd && eWiz, {content, aliases, how, legal, eHome, tabN, eTab, eGoal, eJunior, eHow, eAdd, eWiz});

      // chk-simple-goal-page
      reset('existing'); const gp = S.goals.find(g => !g.shared && !isEur(g) && gSaved(g) > 0); S._detail = gp.id; pushPage('goal'); const pg = () => stack[stack.length - 1], c1 = count(pg().querySelector('.scroll'));
      const setB = pg().querySelector('[data-gset]'), setBox = pg().querySelector('.gset'), closed0 = !!setB && setB.getAttribute('aria-expanded') === 'false' && !!setBox && setBox.hidden;
      const inside = !!setBox && ['data-gedit', 'data-gdel'].every(a => !!setBox.querySelector(`[${a}]`)) && ['pay', 'rr', 'wk'].every(k => !!setBox.querySelector(`[data-grtog="${k}:${gp.id}"]`)) && /This goal earns about [\d ]+ Ft a year, after tax\./.test(nt(setBox.textContent));
      const top0 = nt(pg().querySelector('.gsimple').textContent), topOk = /Add money/.test(top0) && /Withdraw/.test(top0) && / of /.test(top0) && /(At this pace|Reached|Your date|Due)/.test(top0) && !!pg().querySelector('.gsimple .rsline') && !/a year after tax on/.test(top0);
      clk('.page:last-child [data-gset]'); const opened = !pg().querySelector('.gset').hidden && pg().querySelector('[data-gset]').getAttribute('aria-expanded') === 'true';
      clk(`.page:last-child [data-grtog="rr:${gp.id}"]`); const ruleUndo = UCH.on && /Round-ups/.test(nt($('#uchip').textContent)); clk('[data-undo]'); hideChip(true); while(stack.length) popPage(true);
      openGoalRules(gp.id, 'pay'); const rulesOpen = !pg().querySelector('.gset').hidden; while(stack.length) popPage(true);
      reset('existing'); S.goals.push({id:'tz', name:'New bike', ic:'star', target:80000, saved:0, date:'2027-09-01', rules:{pay:{on:false, pct:10}, wk:{on:false, amt:1000, day:'mon'}, rr:{on:false}}}); S._detail = 'tz'; pushPage('goal');
      const c2 = count(pg().querySelector('.scroll')), et = pl(PAGES.goal.html()), empty = et.includes('Add money and it starts to earn 3.0%.') && nt(pg().querySelector('.gsimple').textContent).includes('Add money and it starts to earn 3.0%.') && !/About 0 Ft|0 Ft a year/.test(et); while(stack.length) popPage(true);
      const gl = S.goals.find(g => !g.shared && !isEur(g) && gSaved(g) > 0 && gSaved(g) < gTarget(g)), keepG = JSON.stringify(gl); { const d = demoNow(); d.setMonth(d.getMonth() + 3); gl.date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`; } gl.target = gSaved(gl) + 400000; ownRules(gl).pay.on = true;
      S._detail = gl.id; const lt = pl(PAGES.goal.html()), lateTxt = (lt.match(/At this pace you get there in [A-Z][a-z]+ \d{4}\. That is after your date\./) || [''])[0], lateOk = isLate(gl) && !!lateTxt; Object.assign(gl, JSON.parse(keepG));
      ok('chk-simple-goal-page: the goal page shows saved of target, the bar, one date sentence ("At this pace you get there in [month]. That is after your date." when late), Add money and Withdraw and the honesty line; Edit, Delete, the goal\'s own saving rules and the rate line ("This goal earns about … a year, after tax.") sit under "Settings for this goal", closed until one tap; a rule change there keeps its Undo; the Saving rules links open it; an empty goal says "Add money and it starts to earn 3.0%." (no "About 0 Ft"); words and numbers drop (goal with money ≤ 80 words, ≤ 12 numbers, was 161 / 24; new goal ≤ 60 words, ≤ 8 numbers, was 169 / 29)',
        closed0 && inside && topOk && opened && ruleUndo && rulesOpen && empty && lateOk && c1.words <= 80 && c1.numbers <= 12 && c2.words <= 60 && c2.numbers <= 8, {closed0, inside, topOk, opened, ruleUndo, rulesOpen, empty, lateOk, c1, c2});

      // chk-simple-add-money
      reset('existing'); const g3 = S.goals.find(g => !g.shared && !isEur(g)); S._goal = g3.id; sheet(SHEETS.hubsave()); const first = $('#mv').value === '1000' && !!$('#sheet .hsamt [data-setv="1000"].on') && /Add 1 000 Ft/.test(nt($('#sheet [data-hubsave]').textContent));
      const chips3 = S.goals.length >= 2 && document.querySelectorAll('#sheet [data-pickgoal]').length === S.goals.length, from1 = /From Junior account/.test(nt(($('#sheet .hsfrom') || {}).textContent || '')) && !$('#sheet [data-hubfrom]');
      clk('#sheet [data-hubchange]'); const change = sheetOpen() && document.querySelectorAll('#sheet [data-hubfrom]').length >= 1 && !!$('#sheet [data-pickgoal]');
      clk('#sheet [data-hubfrom="junior"]'); const foot = /\d{1,2} [A-Z][a-z]+ \d{4} · Withdraw any time · Protected/.test(nt(($('#sheet .rsline') || {}).textContent || '')) && /3\.0% until/.test(nt(($('#sheet .rsline') || {}).textContent || ''));
      const jb = acc('junior').v; setf('mv', '2000'); hsSync(); const lbl = /Add 2 000 Ft/.test(nt($('#sheet [data-hubsave]').textContent)) && !!$('#sheet .hsamt [data-setv="2000"].on'); clk('#sheet [data-hubsave]');
      const moved = acc('junior').v === jb - 2000 && S.lastAddAmount === 2000 && UCH.on; hideChip(true);
      sheet(SHEETS.hubsave()); const again = $('#mv').value === '2000' && !!$('#sheet .hsamt [data-setv="2000"].on'); closeSheet();
      S.goals = [g3]; renderAll(); S._goal = g3.id; sheet(SHEETS.hubsave()); const one = !$('#sheet [data-pickgoal]') && nt($('#sheet').textContent).includes('To ' + nt(g3.name)); closeSheet();
      ok('chk-simple-add-money: Add money starts with the last amount (1 000 Ft chip chosen the first time, then the amount last added, kept in S.lastAddAmount) and the button says it ("Add 2 000 Ft"); goal chips only with 2 or more goals (one goal reads "To [goal]"); the account is one line "From Junior account · Change" and Change shows the From chooser; the footer is the honesty line "3.0% until [date] · Withdraw any time · Protected" that opens Rate and safety; the money moves as before with its Undo',
        first && chips3 && from1 && change && foot && lbl && moved && again && one, {first, chips3, from1, change, foot, lbl, moved, again, one});

      // chk-simple-copy-grade: every string this phase rewrote, read from the app, is FK grade 4 or lower with sentences of 12 words or fewer (fkGrade in 01-tokens-helpers.js)
      reset('existing'); const sd = S.goals.find(g => !g.shared && !isEur(g) && gSaved(g) > 0); S._detail = sd.id; const gpage = pl(PAGES.goal.html());
      const COPY = [
        ['1 Rate and safety comparison', 'The Savings account pays a bit more: 3.5%. Persely pays 3.0%. Both are taxed. Persely keeps each goal apart. You can withdraw any time, for free.', pl(SHEETS.ratesafe())],
        ['2 rate', `You get 3.0% a year on up to ${ft(CAP)}. It ends on ${juniorEndLabel()}.`, pl(SHEETS.ratesafe())],
        ['3 health score meaning', SCORE_LINE, pl(SHEETS.score())],
        ['4 Settings notifications', 'We tell you when you pay and when money comes in. We also tell you how you save.', pl(PAGES.settings.html())],
        ['6 Junior row', `Your 3.0% ends on ${juniorEndLabel()}`, pl(juniorRow())],
        ['9 What it reads', 'It uses them to show what you can spend. It also shows which bills are next.', pl(SHEETS.anread())],
        ['10 health score line', 'You keep saving for a goal', pl(SHEETS.score())],
        ['11 New goal sheet', `3.0% a year on up to ${ft(CAP)}. Until ${juniorEndLabel()}.`, pl((SPF && typeof spOldNewgoal === 'function' ? spOldNewgoal : SHEETS.newgoal)())],   // with the Simple first run on, this sheet is behind More goals
        ['12 goal rate', `This goal earns about ${ft(yearNet(gSaved(sd)))} a year, after tax.`, gpage],
        ['13 empty goal', 'Add money and it starts to earn 3.0%.', et],
        ['14 goal date', lateTxt || 'missing', lt],
        ['15 How Persely works', `You get 3.0% on up to ${ft(CAP)} until ${juniorEndLabel()}.`, pl(SHEETS.how())],
        ['honesty line', `${rsRate()} · Withdraw any time · Protected`, pl(rsLine())],
        ['tax', '28% tax comes off the interest. So you keep about 2.2%. We pay it every month.', pl(SHEETS.ratesafe())],
        ['keep 3.0%', "Your first salary must come to OTP within 6 months. If not, you get the standard rate after 30 days' notice.", pl(SHEETS.ratesafe())],
        ['protected', 'A state scheme protects your money up to a limit.', pl(SHEETS.ratesafe())]
      ].map(([k, t, where]) => { const tt = nt(t), g = fkGrade(tt); return {k, grade:g.grade, longest:g.longest, shown:nt(where).includes(tt)}; });
      const badC = COPY.filter(c => !(c.grade <= 4 && c.longest <= 12 && c.shown)), gradeHelper = typeof fkGrade === 'function' && fkGrade('Your November story is ready.').grade > 7 && fkGrade('You get 3.0% a year on up to 500 000 Ft. It ends on 10 September 2027.').grade < 1.5;
      const noDeadline = !/deadline|\bnow!/i.test(pl(SHEETS.ratesafe() + PAGES.goal.html() + SHEETS.hubsave() + SHEETS.how()));
      ok('chk-simple-copy-grade: the strings rewritten in Phase 3 (plan 2f items 1, 2, 3, 4, 6, 9, 10, 11, 12, 13, 14, 15, the honesty line and the new Rate and safety lines) are on screen, FK grade 4 or lower and 12 words or fewer per sentence, measured in the app with the shared fkGrade(); no "deadline" and no "now!"',
        badC.length === 0 && gradeHelper && noDeadline, {bad:badC, gradeHelper, noDeadline});
    } catch(e){ ok('chk-simple-phase3: the new checks ran without errors', false, String(e && e.stack || e)); }
    finally { hideBanners(); hideChip(true); PEND = null; MQ.q = []; hideToast(true); try{ closeOnb(); }catch(e){} while(stack.length) popPage(true); S = svR; cur = curR; stack.push(...stkR); demo.locked = lockR; try{ Object.keys(O).forEach(k => delete O[k]); Object.assign(O, JSON.parse(oR)); closeSheet(); renderAll(); }catch(e){} document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', viewsR[i])); }
  }
  // chk-palette: one colour palette. Scans the stylesheet (outside :root) and the app script for colour literals: only the documented exceptions may stay
  // (Mastercard logo, iPhone frame hardware, pure black), rgb()/rgba() only as black or white with alpha, no 0x colour ints; PALETTE holds a real #RRGGBB
  // for every token, --ink-rgb equals --ink, theme-color equals --bg, and the spending categories stay told apart.
  { const css0 = appSrc().css, r0 = css0.indexOf(':root{'), r1 = css0.indexOf('}', r0);
    const src = css0.slice(0, r0) + css0.slice(r1 + 1) + appSrc().js;   // the app script only (css/app.css and js/*.js, or the inlined copy in the offline build; three.js is left out)
    const ALLOW = ['#000', '#EB001B', '#F79E1B', '#A5A29C', '#6B6863', '#55524E'];
    const lits = [...new Set((src.match(/(?<![&\w])#[0-9a-f]{6}\b|(?<![&\w])#[0-9a-f]{3}\b/gi) || []).map(x => x.toUpperCase()))];
    const ints = src.match(/0x[0-9a-f]{6}\b/gi) || [], rgb = [...new Set([...src.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g)].map(m => m.slice(1, 4).join(',')))];
    const rgbOk = rgb.every(x => x === '0,0,0' || x === '255,255,255'), inkRgb = getComputedStyle(document.documentElement).getPropertyValue('--ink-rgb').replace(/\s/g, '');
    const inkOk = inkRgb === [16, 8, 0].map(sh => hexInt(PALETTE.ink) >> sh & 255).join(','), tc = (document.querySelector('meta[name="theme-color"]') || {}).content || '';
    const palOk = Object.values(PALETTE).every(v => /^#[0-9A-F]{6}$/.test(v)), cats = ['groceries','transport','health','edu','food','shopping','fun','travel','subs'].map(c => CAT_COL[c]);
    ok('chk-palette: outside :root the stylesheet and the app script hold at most ' + ALLOW.length + ' distinct hex colours, all documented exceptions; rgba only black or white with alpha; no 0x colour ints; every PALETTE token is a #RRGGBB read from the CSS; --ink-rgb equals --ink and theme-color equals --bg; the 9 spending categories have 9 different colours',
      r0 >= 0 && lits.length <= ALLOW.length && lits.every(x => ALLOW.includes(x)) && !ints.length && rgbOk && inkOk && tc.toUpperCase() === PALETTE.bg && palOk && new Set(cats).size === cats.length, {lits, ints, rgb, inkRgb, tc, palOk, cats}); }
  if(SIMPLE_PERSELY && typeof simpleTabChecks === 'function') simpleTabChecks(ok);   // Phase 2 simple tab (js/14b-simple-tab.js); off with ?simple=0
  if(OHF){ // Phase 6: Home back to the OTP skeleton (plan 2h, docs/simple-persely-phase6-notes.md). New-world equivalents of the Home checks above (they ran on the pre-Phase-6 Home), and chk-home-otp-skeleton
    ohLeg(false);
    const sv20 = S, cur20 = cur, stk20 = stack.splice(0), lock20 = demo.locked, dm20 = DEMO_ON, views20 = [...document.querySelectorAll('.view')].map(v => v.classList.contains('on')); demo.locked = false;
    const pl = h => String(h).replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z#0-9]+;/g, ' ').replace(/\s+/g, ' '), nt = t => String(t).replace(/[\s  ]+/g, ' ').trim(), clk = sel => { const b = $(sel); if(b) b.click(); return !!b; };
    const reset = kind => { hideBanners(); while(stack.length) popPage(true); try{ closeOnb(); }catch(e){} try{ closeStory(); }catch(e){} closeSheet(); MQ.q = []; hideChip(true); hideToast(true); txReset(); txMode = 0; S = fresh(kind); SETUP_COLLAPSED = false; renderAll(); };
    const top = () => stack.length ? stack[stack.length - 1].dataset.id : '', pg = () => stack[stack.length - 1], pos = (h, k) => h.indexOf(k), inOrder = (h, ks) => ks.every((k, i) => pos(h, k) > -1 && (i === 0 || pos(h, k) > pos(h, ks[i - 1])));
    const cnt = (h, k) => (h.match(new RegExp('data-go="' + k + '"', 'g')) || []).length, sheets = (h, k) => (h.match(new RegExp('data-sheet="' + k + '"', 'g')) || []).length;
    const lateRent = () => { S.tx = S.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); S.bfPush = billToday().ym + '-' + billToday().day; renderAll(); };
    const details = () => { while(stack.length) popPage(true); tab('fooldal'); clk('#v-fooldal .sec a[data-go="mymoney"]'); return top() === 'mymoney'; };   // Home > Details: one tap from the tab bar
    const coreOf = h => { const x = String(h).match(/Card spending(?: so far)?<\/small><b class="num">([^<]*)</); return x ? x[1] : ''; };
    const tz = () => nt(($('#v-fooldal .hubteaser') || {}).textContent || '');
    // the Persely tab is the Phase 2 simple tab (js/14b-simple-tab.js): 4 blocks plus a More page (goal cards, Keep my 3.0%, Spending, Notifications, Bills, My cards)
    const hubAll = () => vHub() + (spOn() && S.goals.length && typeof moreHTML === 'function' ? moreHTML() : '');
    const viaPersMore = sel => { while(stack.length) popPage(true); closeSheet(); tab('hub'); return clk('#v-hub [data-go="persmore"]') && !!pg() && (() => { const b = pg().querySelector('.scroll ' + sel); if(b) b.click(); return !!b; })(); };   // Persely tab > More > row: 2 taps from the tab
    // every Persely entry on Home: anything that opens the Persely tab, a Persely sheet, the story or the Junior page; the Persely account card (#accs) is an account and the For you offer is OTP's own card
    const entries = root => [...root.querySelectorAll('[data-tab="hub"],[data-sheet="hubsave"],[data-sheet="newgoal"],[data-sheet="payday"],[data-sheet="whyp"],[data-sheet="ratesafe"],[data-sheet="goodtoknow"],[data-story],[data-go="grad"],.sphome')].filter(e => !e.closest('#accs') && !e.closest('.offer'));
    const firstShown = el => [...el.querySelector('.scroll').children].find(e => e.offsetHeight > 0 && !e.classList.contains('hint'));
    try{
      // chk-home-otp-skeleton: the eb807a7 order, nothing else, one Persely entry, every moved item at most 2 taps from a tab
      const sk = ['existing', 'new'].map(kind => { reset(kind); tab('fooldal'); const v = $('#v-fooldal'), h = v.innerHTML;
        const order = inOrder(h, ['class="hhead', 'id="accs"', 'hubteaser', '<span>My monthly spending</span>', 'class="gauge ohgauge"', 'What did I spend on this month?', 'class="cats"', '<span>For you</span>', 'class="hcar"']);
        const dA = v.querySelector('.sec a[data-go="mymoney"]'), aA = [...v.querySelectorAll('.sec a[data-go="neked"]')];
        const gone = !v.querySelector('.short, .safebtn, .bfc, .annote, .insight, .storycard, .whyl, .bell, .clg, .dbtn, [data-go="grad"], [data-go="bills"], .hhead small, .sec-sub, .acc .go') && !/Total out|Quick actions|Why Persely|Safe to spend|Account details|Open Persely|Your November is ready/.test(pl(h));
        const ent = entries(v);
        return {kind, order, details:!!dA && nt(dA.textContent) === 'Details', all:aA.length === 1 && nt(aA[0].textContent) === 'All', gone, one:ent.length === 1 && ent[0].classList.contains('hubteaser'), n:ent.length, offer:!!v.querySelector('.offer'), goals:S.goals.length}; });
      const R = {};
      reset('existing'); lateRent(); R.lateCard = details() && (() => { const c = pg().querySelector('.scroll .bfc'), ok1 = !!c && firstShown(pg()) === c && !!c.querySelector('[data-paybill]') && !!c.querySelector('[data-go="bills"]'); if(c) c.querySelector('[data-go="bills"]').click(); return ok1 && top() === 'bills'; })();
      reset('new'); R.notice = details() && !!pg().querySelector('.annote.one [data-anread]') && !!pg().querySelector('.annote.one [data-anask]');
      reset('existing'); S.anNote = true; renderAll(); R.safe = details() && !!pg().querySelector('.safebig'); R.tips = /Persi's tips/.test(pg().innerHTML) && !!pg().querySelector('.gauge[data-cring="big"]') && !!pg().querySelector('.cs-r[data-fcat]'); clk('.page [data-tour="billsrow"]'); R.bills = top() === 'bills';
      reset('existing'); tab('fooldal'); clk('#v-fooldal .hhead .hprof'); R.inbox = top() === 'settings' && clk('.page [data-sec="inbox"] [data-go="inbox"]') && top() === 'inbox';
      reset('existing'); S.monthEnd = true; renderAll(); tab('hub'); R.story = clk('#v-hub [data-persi-ring][data-story]') && ST.on === true; try{ closeStory(); }catch(e){}
      reset('existing'); tab('hub'); R.addMoney = clk('#v-hub .sp-add[data-sheet="hubsave"]') && sheetOpen() && nt($('#sheet h2').textContent) === 'Add money'; closeSheet();
      R.junior = viaPersMore('[data-more="junior"][data-go="grad"]') && top() === 'grad'; while(stack.length) popPage(true);
      tab('hub'); R.rateSafety = clk('#v-hub .sp-honest[data-sheet="ratesafe"]') && sheetOpen() && nt($('#sheet h2').textContent) === 'Rate and safety'; closeSheet();
      tab('tovabbiak'); R.card = clk('#v-tovabbiak [data-go="kartyaim"]') && top() === 'kartyaim'; while(stack.length) popPage(true);
      ok('chk-home-otp-skeleton: Home runs the eb807a7 order (header, balance carousel, Persely teaser, My monthly spending gauge with Details, category bars, For you with All) and nothing else; exactly one Persely entry (the For you offer only while there is no goal); each item that left Home is at most 2 taps from a tab: the late-bill card (Pay now, All bills) and the analyst notice on top of Spending, Safe to spend and Persi\'s tips and the category ring on Spending, Bills from the Spending Bills row, the inbox from Settings > Notifications, the story ring around Persi, Add money and Rate and safety on the Persely tab, the Junior page from the Persely tab\'s More page, My cards in More',
        sk.every(x => x.order && x.details && x.all && x.gone && x.one && x.offer === (x.goals === 0)) && Object.values(R).every(Boolean), {sk, R});

      // chk-home-order (OTP Home): header without captions; the teaser states in Persi's order with one action each
      reset('existing'); tab('fooldal'); const hdr = [...document.querySelectorAll('#v-fooldal .hhead button')].map(b => b.getAttribute('aria-label')).join(), cap0 = !document.querySelector('#v-fooldal .hhead small');
      S.savedWeek = false; S.streak = 3; renderAll(); const wkOpen = tz() === 'Week 4 · Save by Sunday' && $('#v-fooldal .hubteaser').dataset.tab === 'hub'; clk('#v-fooldal .hubteaser'); const toTab = cur === 'hub'; tab('fooldal');
      S.savedWeek = true; renderAll(); const wkDone = tz() === nt(`Week 3 done · ${ft(total())} saved`);
      S.billSkip = {}; mustBills().forEach(b => { S.billSkip[b.id] = billToday().ym; }); setMain(S, 'pay', true); S.payday.ask = true; S.pdAsk = true; renderAll();
      const pay = paydayAlloc().total, pdOk = pay > 0 && tz() === nt(`Payday · Save ${ft(pay)}?`) && $('#v-fooldal .hubteaser').dataset.sheet === 'payday';
      clk('#v-fooldal .hubteaser'); const pdSheet = sheetOpen() && !!$('#sheet [data-paymove]'); clk('#sheet [data-paymove]'); const pdDone = !S.pdAsk && /^Week/.test(tz()); hideChip(true); closeSheet();
      reset('existing'); S.juniorDays = 20; renderAll(); const jr = nt(($('#v-fooldal .hubteaser small') || {}).textContent || '') === `Your 3.0% ends on ${juniorEndLabel()}`; S.juniorDays = 300; renderAll(); const jrOff = !$('#v-fooldal .hubteaser small');
      reset('new'); tab('fooldal'); const nu = tz() === nt(`Save your first ${ft(1000)}`) && !!$('#v-fooldal .sphome'); clk('#v-fooldal .sphome'); const nuGo = cur === 'hub' && !!$('#v-hub .spfirst');
      ok('chk-home-order (OTP Home): the header is avatar, name and mail (Profile and settings, Messages and offers) with no captions; the one Persely card reads "Week 4 · Save by Sunday" (opens the tab), "Week 3 done · X saved" once saved, "Payday · Save 7 500 Ft?" after the salary (opens the payday sheet, gone after saving), "Save your first 1 000 Ft" for a new user (opens the first run); in the last 30 days of Junior the subline is "Your 3.0% ends on <date>"',
        hdr === 'Profile and settings,Messages and offers' && cap0 && wkOpen && toTab && wkDone && pdOk && pdSheet && pdDone && jr && jrOff && nu && nuGo, {hdr, cap0, wkOpen, toTab, wkDone, pdOk, pay, pdSheet, pdDone, jr, jrOff, nu, nuGo});

      // the unnamed one-entry-path, analyst-off, late-bill and number checks
      S = fresh('existing'); S.analyst = {on:true, accepted:true, split:{must:44, ess:31, fun:20, save:5}}; S.onboarded = true; S.billsConfirmed = true; syncSplit(); const Hh = vFooldal(), mm = myMoneyHTML();
      ok('one entry path (OTP Home): Home reaches Spending from Details only (the one page); no link to Next month, Must-pay bills or the Safe to spend sheet; Spending has one Bills row', cnt(Hh, 'mymoney') === 1 && cnt(Hh, 'nextmonth') === 0 && cnt(Hh, 'bills') === 0 && sheets(Hh, 'safe') === 0 && cnt(mm, 'bills') === 1, [cnt(Hh, 'mymoney'), cnt(Hh, 'bills'), cnt(mm, 'bills')]);
      S.analyst.on = false; const Hoff = vFooldal(), mmOff = myMoneyHTML();
      ok('analyst off (OTP Home): Home keeps the gauge and Details to the one Spending page (no Safe to spend row on Home); Spending offers Turn on in place of the plan and keeps Safe to spend (simple) and Bills', /ohgauge/.test(Hoff) && cnt(Hoff, 'mymoney') === 1 && !/safebtn/.test(Hoff) && /Turn on to see your plan/.test(mmOff) && sheets(mmOff, 'safe') === 1 && cnt(mmOff, 'bills') === 1); S.analyst.on = true;
      S.tx = S.tx.filter(t => !(t.n === 'SZABÓ DÓRA' && t.ym === '2026-11')); const mmL = myMoneyHTML();
      ok('late bill (OTP Home): the Bills first card is on top of Spending, above Safe to spend; it is gone from Home and from the Persely tab', pos(mmL, 'Bills first') > -1 && pos(mmL, 'Bills first') < pos(mmL, 'safebig') && !/Bills first|class="card bfc"/.test(vFooldal()) && !/Bills first/.test(vHub()));
      S = fresh('existing'); S.onboarded = true; S.analyst = {on:true, accepted:true, split:{must:44, ess:31, fun:20, save:5}}; S.billsConfirmed = true; syncSplit();
      const sp0 = sumVals(catSpend(shownMonth().ym));
      ok('Home "Card spending so far" = Spending "Card spending" = the category total of the month on screen (OTP Home, D15 label)', sp0 > 0 && /Card spending so far<\/small>/.test(vFooldal()) && coreOf(vFooldal()) === ft(sp0) && coreOf(myMoneyHTML()) === ft(sp0), [sp0, coreOf(vFooldal()), coreOf(myMoneyHTML())]);
      monthStep(true); const sp1 = sumVals(catSpend(shownMonth().ym));
      ok('after one simulated month Home and Spending still show the same total (OTP Home)', sp1 > 0 && coreOf(vFooldal()) === ft(sp1) && coreOf(myMoneyHTML()) === ft(sp1), [sp1, coreOf(vFooldal()), coreOf(myMoneyHTML())]);
      S = fresh('existing'); S.onboarded = true;
      ok('Home Details opens the one Spending page and Home has no plan (OTP Home: the plan lives on Spending only)', cnt(vFooldal(), 'mymoney') === 1 && !/mp-g/.test(vFooldal()) && /mp-g/.test(myMoneyHTML()) && !/data-go="kiadas"/.test(vFooldal()));
      S = fresh('existing'); S.onboarded = true; S.insight = true; const tp = tipOf();
      ok('tip (OTP Home): Home has no tip card (Persi\'s tip moved to Spending); the Spending page shows Persi\'s tips', tp && tp.kind === 'tip' && !/class="card insight"|Move 10% a month/.test(vFooldal()) && /Persi's tips/.test(myMoneyHTML()), tp && tp.kind);
      S = fresh('existing'); S.goals.slice().forEach(g => { if(!goalEmpty(g)) withdrawFrom(g, gSaved(g)); removeGoal(g.id); });
      ok('delete every goal (OTP Home): Home renders without errors, its one Persely card is "Save your first 1 000 Ft" again and the For you offer is back', S.goals.length === 0 && (() => { try{ const h = vFooldal(); return /sphome/.test(h) && /Start saving efficiently!/.test(h) && !/NaN|undefined/.test(pl(h)); }catch(e){ return false; } })());

      // Phase 1a, 1b
      reset('existing'); const homeE = pl(vFooldal());
      ok('chk-seed-existing (OTP Home): the existing seed\'s Home shows Persely · total (Summer holiday 64 000 Ft inside) and the week line of the 8-week streak, not the new-user card', S.streak === 8 && acc('persely').v === 64000 && homeE.includes(nt(`Persely · total ${ft(total())}`)) && homeE.includes(S.savedWeek ? 'Week 8 done' : 'Week 9 · Save by Sunday') && !/Start your first goal|Save your first/.test(homeE), homeE.slice(0, 200));
      const BANNED = /take out|taken out|take money out|spending tracker|create persely|new persely|(?<!scheduled and )recurring transfer/i, homes = ['new', 'existing'].map(k => { reset(k); return pl(vFooldal()) + ' ' + pl(settingsHTML()); }).join(' ');
      ok('chk-glossary-terms (OTP Home): none of the banned synonyms on the new Home or Settings (both seeds)', !BANNED.test(homes), (homes.match(BANNED) || [])[0]);
      const MON = 'January|February|March|April|May|June|July|August|September|October|November|December', SHORT = /\b\d{1,2} (Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b|\b(Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec) \d{4}\b/, noYear = new RegExp('\\b\\d{1,2} (' + MON + ')\\b(?! \\d{4})');
      reset('existing'); S.juniorDays = 20; renderAll(); const dH = pl(vFooldal()), mlab = nt(($('#v-fooldal .mlab') || {}).textContent || '');
      ok('chk-date-format (OTP Home): the gauge range reads "1 November 2026 – 30 November 2026", the Junior subline is one full date, and no short or year-less date is on Home', mlab === '1 November 2026 – 30 November 2026' && /Your 3\.0% ends on \d{1,2} [A-Z][a-z]+ \d{4}/.test(dH) && !SHORT.test(dH + homes) && !noYear.test(dH + homes) && !/\bsoon\b/i.test(dH), [mlab, (dH.match(noYear) || [])[0]]);
      ok('chk-why-persely (OTP Home): "Why Persely?" left Home; the Persely tab opens Rate and safety (the same sheet as Why Persely?)', !/Why Persely|data-sheet="whyp"|class="[^"]*whyl/.test(homes + vFooldal()) && SHEETS.whyp === SHEETS.ratesafe && R.rateSafety);
      { const ph = $('#phone'), sc = ph.getBoundingClientRect().width / ph.offsetWidth || 1, small = [], SEL = '.sec a, .link, .hhead button, .hubteaser, .acc, .cat, .nk, .offer';
        ['new', 'existing'].forEach(k => { reset(k); tab('fooldal'); document.querySelectorAll('#v-fooldal ' + SEL.split(', ').join(', #v-fooldal ')).forEach(el => { const r = el.getBoundingClientRect(); if(r.width === 0 && r.height === 0) return; if(r.height / sc < 43.5 || r.width / sc < 43.5) small.push(`${k}: ${el.className || el.tagName} ${Math.round(r.width / sc)}x${Math.round(r.height / sc)}`); }); });
        ok('chk-tap-44 (OTP Home): All accounts, Details, All, the avatar, the mail icon, the account cards, the Persely card, the category bars and the For you cards measure 44 px or more at the phone width (both seeds)', small.length === 0, small.slice(0, 8)); }

      // Phase 3: Keep my 3.0% pending lives on the Persely tab; Home only carries the Junior end date in the last 30 days
      reset('existing'); S.juniorDays = 20; S.keep = {pending:true, at:0}; renderAll();
      ok('chk-keep-pending (OTP Home): a pending Keep my 3.0% request shows on the Persely tab\'s More page, Keep my 3.0% row ("Waiting for your first salary at OTP · 6 months left"); Home keeps one Persely card whose subline is the Junior end date', /Waiting for your first salary at OTP · 6 months left/.test(pl(hubAll())) && !/Waiting for your first salary/.test(pl(vFooldal())) && tz().includes(`Your 3.0% ends on ${juniorEndLabel()}`) && entries($('#v-fooldal')).length === 1);

      // Phase 4: entry map
      reset('existing'); const E = {}, doors = []; [['#v-fooldal .sec a[data-go="mymoney"]', 'fooldal'], ['#v-tovabbiak [data-go="mymoney"]', 'tovabbiak']].forEach(([sel, t]) => { tab(t); doors.push(clk(sel) ? top() : 'missing:' + sel); while(stack.length) popPage(true); });
      doors.push(viaPersMore('[data-go="mymoney"]') ? top() : 'missing: Persely tab > More > Spending'); while(stack.length) popPage(true);
      E.spending = doors.every(x => x === 'mymoney'); E.addMoney = R.addMoney; E.card = R.card; E.bills = R.bills; E.inbox = R.inbox; E.homeToTab = (() => { tab('fooldal'); clk('#v-fooldal .hubteaser'); return cur === 'hub'; })();
      ok('chk-entry-map (OTP Home): Spending from Home Details, the Persely tab (its More page) and More; Add money on the Persely tab; Pay a bill from the Spending Bills row; My cards from More; the inbox from Settings; Home > Persely tab through its one card', Object.values(E).every(Boolean), {E, doors});

      // Phase 5: analyst default on, the notice, Safe to spend first, two numbers, story
      reset('new'); const optH = (vFooldal().match(/data-sheet="analyst"/g) || []).length; lateRent();
      ok('chk-analyst-default-on (OTP Home): the analyst is on in both seeds; the late warning shows on top of Spending (not on Home); no opt-in entry on Home', S.analyst.on && fresh('existing').analyst.on && optH === 0 && /is late/.test(pl(myMoneyHTML())) && !/is late|bills? late/.test(pl(vFooldal())), optH);
      reset('new'); tab('fooldal'); const nHome = !document.querySelector('#v-fooldal .annote'); details(); const al = pg().querySelector('.annote.one'), alT = al ? nt(al.textContent) : '', abs = al ? [...al.querySelectorAll('button')] : [];
      const alOk = !!al && firstShown(pg()) === al && alT.includes('Your analyst reads your OTP payments to show Safe to spend. Nothing leaves OTP.') && abs.length === 2 && abs[0].dataset.anread !== undefined && abs[1].dataset.anask !== undefined && /CONFIRM WITH OTP \/ LEGAL: lawful basis/.test(myMoneyHTML()) && !!al.nextElementSibling && al.nextElementSibling.classList.contains('safebig');
      popPage(true); const goneLeave = S.anNote === true; details(); const goneAgain = !pg().querySelector('.annote'); while(stack.length) popPage(true);
      reset('new'); details(); clk('.page .annote [data-anread]'); const readOk = sheetOpen() && /Nothing leaves the bank/.test(pl($('#sheet').innerHTML)) && !pg().querySelector('.annote'); closeSheet();
      reset('existing'); details(); clk('.page .annote [data-anask]'); const askOk = sheetOpen() && /Turn off the Financial analyst\?/.test(pl($('#sheet').innerHTML)) && S.analyst.on === true; closeSheet(); while(stack.length) popPage(true);
      ok('chk-analyst-notice (OTP Home): the analyst notice left Home; the first Spending visit opens with the one line "Your analyst reads your OTP payments to show Safe to spend. Nothing leaves OTP." with Learn more and Turn off, right above Safe to spend; it goes after a tap or after leaving the page; Turn off asks first', nHome && alOk && goneLeave && goneAgain && readOk && askOk, {nHome, alOk, alT, goneLeave, goneAgain, readOk, askOk});
      reset('existing'); S.anNote = true; renderAll(); details(); const p1 = pg(), card = p1.querySelector('.safebig'), sc1 = p1.querySelector('.scroll'), r1 = card && card.getBoundingClientRect(), r2 = sc1.getBoundingClientRect();
      const stsA = firstShown(p1) === card && nt(card.textContent).includes(nt(ft(safeToSpend().safe))) && r1.top >= r2.top && r1.bottom <= r2.bottom; while(stack.length) popPage(true);
      reset('existing'); details(); const p2 = pg(), c2 = p2.querySelector('.safebig'), r3 = c2 && c2.getBoundingClientRect(), r4 = p2.querySelector('.scroll').getBoundingClientRect(), stsB = !!c2 && r3.bottom <= r4.bottom && r3.bottom <= Math.min(844, innerHeight); while(stack.length) popPage(true);
      ok('chk-sts-top (OTP Home): Home Details opens Spending with the Safe to spend card first (the real number), fully visible; on the first visit only the one line analyst notice sits above it and it stays above the fold', stsA && stsB, {stsA, stsB});
      reset('existing'); const cs = cardSpending(), to = totalOut(), hh = nt(pl(vFooldal())), mm5 = nt(pl(myMoneyHTML())), spentBad = (hh.match(/\bSpent\b(?! on)/g) || []).length + (hh.match(/\bspent so far\b/gi) || []).length;
      ok('chk-two-spend-numbers (OTP Home): Home shows "Card spending so far" with the same figure as Spending\'s "Card spending"; Total out stays on Spending; "Spent" never stands alone on Home', cs === sumVals(catSpend(shownMonth().ym)) && hh.includes(nt('Card spending so far ' + ft(cs))) && mm5.includes(nt('Card spending ' + ft(cs))) && mm5.includes(nt('Total out ' + ft(to))) && !/Total out/.test(hh) && spentBad === 0, [cs, to, spentBad]);
      reset('existing'); S.monthEnd = true; S.storySeen = false; renderAll(); const stH = vFooldal(), stT = vHub();
      ok('chk-story-month-end (OTP Home): at month end Home has no story card ("Your November is ready" is gone); the story opens from the ring around Persi on the Persely tab', !/Your November is ready|storycard|data-story/.test(stH) && /data-story/.test((stT.match(/<[^>]*class="sp-ring[^"]*"[^>]*>/) || [''])[0]) && R.story);

      // Phase 6: Settings and the inbox
      reset('existing'); setDemoMode(false); tab('fooldal'); S.name = 'Kiss Réka'; renderAll(); const av = $('#v-fooldal .hhead .avatar'); av.click(); const avOpen = top() === 'settings', secs = [...document.querySelectorAll('.page .set-sec')].map(x => x.dataset.sec).join(), named = /Kiss Réka/.test(pl($('.page').innerHTML)); while(stack.length) popPage(true);
      lpTimer = null; av.dispatchEvent(new Event('pointerdown', {bubbles:true})); const lpOff = lpTimer === null; setDemoMode(true); av.dispatchEvent(new Event('pointerdown', {bubbles:true})); const lpOn = lpTimer !== null; clearTimeout(lpTimer); lpTimer = null; setDemoMode(dm20);
      ok('chk-settings-real (OTP Home): the avatar opens the real Settings page, now with Notifications on top, then Profile (the name from S.name), Persely, Notifications settings, Privacy and Help; the avatar long-press opens the demo panel only behind the flag', avOpen && secs === 'inbox,profile,persely,notif,privacy,help' && named && lpOff && lpOn, [avOpen, secs, named, lpOff, lpOn]);
      reset('existing'); const rowT = () => { const p = settingsHTML(), m = p.match(/data-sec="inbox">([\s\S]*?)<\/button>/); return m ? nt(pl(m[1])) : ''; }, emptyRow = rowT() === 'Notifications Your messages';
      for(let i = 0; i < 25; i++) notify({title:'Note ' + i, body:'Body ' + i, url:i === 24 ? 'tranzakciok' : 'hub', persi:true}); hideBanners();
      const unreadRow = rowT() === 'Notifications Your messages · 20 unread', noBell = !/class="bell|bdot/.test(vFooldal());
      tab('fooldal'); clk('#v-fooldal .hhead .hprof'); clk('.page [data-sec="inbox"] [data-go="inbox"]'); const inbOpen = top() === 'inbox' && document.querySelectorAll('.page .inb').length === 20 && /Note 24/.test($('.page .inb').textContent);
      clk('.page [data-inbread]'); const allRead = inboxUnread() === 0 && rowT() === 'Notifications Your messages'; while(stack.length) popPage(true);
      ok('chk-inbox-20 (OTP Home): the bell left Home; Settings > Notifications opens the inbox (last 20, newest first) and says how many are unread; Mark all as read clears it', emptyRow && unreadRow && noBell && inbOpen && allRead, {emptyRow, unreadRow, noBell, inbOpen, allRead, row:rowT()});

      // Phase 7: the late-bill card on top of Spending, no Bills self-link
      reset('existing'); lateRent(); const mmB = myMoneyHTML(), lc = (mmB.match(/<div class="card bfc">[\s\S]*?<\/div><\/div>/) || [''])[0], lct = nt(pl(lc));
      ok('chk-latecard-home-only (OTP Home): the late-bill card moved from Home to the top of Spending: "Rent share is late: 42 000 Ft (due on the 2nd)" with two actions (Pay now, All bills) and no skip links; Home, the Persely tab and the Bills page do not show it', /Rent share is late: 42 000 Ft \(due on the 2nd\)/.test(lct) && (lc.match(/<button/g) || []).length === 2 && /data-paybill="szab-d-ra"/.test(lc) && /data-go="bills"/.test(lc) && !/data-billskip/.test(lc) && pos(mmB, 'class="card bfc"') < pos(mmB, 'safebig') && !/class="card bfc"/.test(vFooldal() + vHub() + billsHTML()), lct);
      pushPage('bills'); const selfFree = !/data-go="bills"/.test($('.page').innerHTML) && !/class="card bfc"/.test($('.page').innerHTML); while(stack.length) popPage(true);
      ok('chk-no-bills-selflink (OTP Home): the Bills page has no link to itself; Spending holds All bills on the late card and its one Bills row; Home has no bills link; the Safe to spend sheet keeps its Must-pay bills button', selfFree && cnt(myMoneyHTML(), 'bills') === 2 && cnt(vFooldal(), 'bills') === 0 && /data-go="bills"/.test(SHEETS.safe()));

      // Phase 8 and the circle rework: category bars, gauge, Details, Spending
      reset('existing'); tab('fooldal'); const cb = $('#v-fooldal .cat[data-fcat]'), cbc = cb && cb.dataset.fcat; if(cb) cb.click(); const barTap = cur === 'tranzakciok' && txF.cat === cbc && !!$('#txchips [data-txrm="cat"]') && $('#txchips [data-txrm="cat"]').textContent.includes(CATEGORY[cbc][0]); txReset(); tab('fooldal');
      ok('chk-tx-category-passin (OTP Home): tapping a category bar on Home opens Transactions with that category chip on', barTap, cbc);
      const circ = ['existing', 'new'].map(kind => { reset(kind); tab('fooldal'); const g = $('#v-fooldal .gauge.ohgauge'), arcs = g ? [...g.querySelectorAll('circle')] : [], want = catRows(catSpend(shownMonth().ym)).slice(0, 5), bars = [...document.querySelectorAll('#v-fooldal .cats .cat')];
        const barsOk = bars.length === want.length && want.every(([c, v], i) => nt(bars[i].textContent).includes(nt(ft(v))));
        return {ok:!!g && g.getAttribute('role') === 'img' && /^Card spending so far /.test(g.getAttribute('aria-label') || '') && g.querySelector('.core').textContent.replace(/[\s\u00a0\u202f]+/g, '') === ('Card spending so far' + ft(cardSpending())).replace(/[\s\u00a0\u202f]+/g, '') && arcs.length === 2 && arcs[1].getAttribute('stroke') === PALETTE.green && !g.querySelector('circle.seg') && barsOk, bars:bars.length, want:want.length}; });
      reset('existing'); details(); const big = pg().querySelector('.gauge[data-cring="big"]'), segSum = big ? [...big.querySelectorAll('circle.seg')].reduce((a, c) => a + +c.dataset.v, 0) : -1; while(stack.length) popPage(true);
      ok('chk-home-circle-categories (OTP Home): Home has the original 270 degree gauge (one green arc, "Card spending so far" with the real card spending, read aloud) and the five biggest categories as bars with their amounts (both seeds); the circle by category moved to Spending, its arcs add up to Card spending', circ.every(x => x.ok) && segSum === cardSpending(), {circ, segSum});
      reset('existing'); tab('fooldal'); const dl = $('#v-fooldal .sec a[data-go="mymoney"]'), dlr = dl ? dl.getBoundingClientRect() : null; if(dl) dl.click(); const dlOpen = top() === 'mymoney'; while(stack.length) popPage(true);
      ok('chk-home-details-button (OTP Home): the original Details link next to My monthly spending is 44 px or more and opens the Spending page', !!dl && nt(dl.textContent) === 'Details' && dlr.height >= 44 && dlr.width >= 44 && dlOpen, dlr && [dlr.width, dlr.height]);
      { reset('existing'); tab('fooldal'); const pxv = (e, p) => e ? parseFloat(getComputedStyle(e)[p]) : -1, keys = {gutter:pxv($('#v-fooldal'), 'paddingLeft'), card:pxv($('#v-fooldal .hubteaser'), 'paddingLeft'), sec:pxv($('#v-fooldal .sec'), 'marginTop'), stack:pxv($('#v-fooldal .hubteaser'), 'marginBottom')};
        ok('chk-spacing-scale (OTP Home): the Home gutter, the Persely card padding, the section gap and the card gap use the spacing tokens (16/16/24/12)', keys.gutter === 16 && keys.card === 16 && keys.sec === 24 && keys.stack === parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--gap-stack')) && keys.stack === 12, keys); }
      reset('existing'); tab('hub'); const hb = $('#v-hub .sp-add[data-sheet="hubsave"]');
      ok('chk-home-labels (OTP Home): Home has no Quick actions card; Add money (Persely tab, 44 px), Pay a bill (Spending Bills row) and My cards (More) keep their places', !$('#v-fooldal .short') && !!hb && hb.getBoundingClientRect().height >= 44 && R.addMoney && R.bills && R.card);
      reset('existing'); S.anNote = true; renderAll(); details(); const p3 = pg(), blocks = ['.safebig', '.gauge[data-cring="big"]', '.cshare', '[data-tour="billsrow"]', '.anfoot'].map(s => p3.querySelector(s)), inOrd = blocks.every((b, i) => b && (i === 0 || (blocks[i - 1].compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING))); while(stack.length) popPage(true);
      reset('existing'); lateRent(); details(); const p4 = pg(), lateOrd = firstShown(p4) && firstShown(p4).classList.contains('bfc') && !!p4.querySelector('.bfc + .annote.one + .safebig, .bfc + .safebig'); while(stack.length) popPage(true);
      ok('chk-spending-ui (OTP Home): Spending keeps Safe to spend, the category ring, Where it went, Bills and the footer in order; with a late bill the late card sits on top, then the analyst line (first visit), then Safe to spend', inOrd && lateOrd, {inOrd, lateOrd});
      ok('chk-simple-rate-safety-one-sheet (OTP Home): Home has no Why Persely? link; Rate and safety opens from the Persely tab', !$('#v-fooldal .whyl') && R.rateSafety);

      // copy and the flag
      reset('existing'); S.juniorDays = 20; renderAll(); const lines = ['Week 4 · Save by Sunday', 'Payday · Save 7 500 Ft?', 'Save your first 1 000 Ft', `Week 3 done · ${ft(64000)} saved`, `Your 3.0% ends on ${juniorEndLabel()}`, 'Card spending so far', 'You usually spend 102 400 Ft a month by card', 'Your messages · 3 unread', 'What did I spend on this month?'];
      const fk = lines.map(t => [t, fkGrade(t).grade]), subs = [...document.querySelectorAll('#v-fooldal small')].map(e => e.textContent).concat([settingsHTML().match(/data-sec="inbox"[\s\S]*?<small>([^<]*)/)[1]]);
      ok('chk-home-otp-copy: the new Home and Settings lines read at grade 4 or below, subtitles have no hyphens, and Home never says "deadline"', fk.every(([, g]) => g <= 4) && subs.every(s => !/-/.test(s)) && !/deadline/i.test(pl(vFooldal())), {fk, subs});
      const parse = q => { const p = new URLSearchParams(q); return p.get('simple') !== '0' && p.get('otphome') !== '0'; }, legH = (() => { OH_LEGACY = true; try{ return vFooldal(); } finally { OH_LEGACY = false; } })();
      ok('chk-home-otp-flag: OTP_HOME is on with Simple Persely; ?otphome=0 and ?simple=0 turn it off; off renders the Home from before Phase 6 (Quick actions, Safe to spend, category circle) and the old checks run on it', OTP_HOME === true && parse('?demo=1') && !parse('?otphome=0') && !parse('?simple=0') && /class="short"/.test(legH) && /safebtn/.test(legH) && /data-cring/.test(legH) && !/ohgauge/.test(legH));
    } catch(e){ ok('chk-phase6-otp-home: the new checks ran without errors', false, String(e && e.stack || e)); }
    finally { hideBanners(); hideChip(true); PEND = null; MQ.q = []; hideToast(true); txReset(); try{ closeStory(); }catch(e){} while(stack.length) popPage(true); setDemoMode(dm20); S = sv20; cur = cur20; stack.push(...stk20); demo.locked = lock20; try{ closeSheet(); renderAll(); }catch(e){} document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', views20[i])); }
  }
  const u = splitUse(); if(F === F && S.months === 0 && S.tx.length === F.tx.length) ok('split use unchanged (Essentials 6 590, Fun 7 890, Saving 4 000)', u.ess === 6590 && u.fun === 7890 && u.save === 4000, u);
  while(stack.length > stack0) popPage(true);
  if(OHF){ ohLeg(false); try{ renderAll(); }catch(e){} }   // back to the OTP Home
  spLeg(false); if(SP0){ try{ spHideReward(true); }catch(e){} Object.assign(SP, SP0, {rewardOn:false}); }
  const bad = out.filter(r => !r.pass);
  console.log(`__checkAnalytics: ${out.length - bad.length}/${out.length} passed`); bad.forEach(r => console.log('FAIL', r.name, r.info));
  return {passed:out.length - bad.length, total:out.length, failed:bad, results:out};
}
window.__checkAnalytics = __checkAnalytics;

