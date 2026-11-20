/* ================= Simple Persely, Phase 4: the copy pass checks (docs/simple-persely-plan.md 2f, 2g; docs/simple-persely-phase4-notes.md) =================
   Only with SIMPLE_PERSELY on (called from __checkAnalytics in js/03). Nothing here changes the app; it reads the screens.
   chk-simple-grade: every visible text of the new screens is FK grade 4 or lower (fkGrade, js/01), 12 words or fewer per sentence,
     Persi 8 words or fewer, no hyphen in a subtitle, no "deadline", no urgency words, full dates, amounts as "50 000 Ft".
   chk-simple-hu-keys: every string of the simple version in SP_STRINGS (js/hu-strings.js) has a Hungarian draft in HU. */

// Texts that keep a grade above 4 on purpose. FK is not reliable for very short labels, and these are fixed terms (glossary, legal, OTP product names).
// Each entry: [exact text or regex, reason]. Texts of one word are never graded (FK of one word says nothing: "Withdraw" is 8.4).
const SP_GRADE_WL = [
  [/^(Rate and safety|Settings for this goal|Persely settings|Deposit protection|Standard rate|How Persely works)$/, 'name of a screen or a fixed term (glossary)'],
  [/^(Payday rule|Weekly transfer|Round-ups)( for this goal)?$/, 'name of a saving rule (glossary, chk-glossary-terms)'],
  [/^Notifications$|^Your messages$|^New messages$/, 'standard label'],
  [/^Junior account$|^From Junior account$|^OTP Junior account$/, 'OTP product name'],
  [/^Save in euro$/, 'short label; "euro" counts 3 syllables in FK'],
  [/^(Saving rules|Savings account|Financial health score|Between my accounts)$/, 'fixed term: a screen or product name used across the app'],
  [/^(Trip|Phone or tech|Safety net|Something else|New phone)$/, 'first-run tile names (decision D10)'],
  [/^\d{1,2} [A-Z][a-z]+ \d{4}$/, 'a full date on its own (the glossary asks for full dates; month names inflate FK)'],
  [/^\d\.\d% until \d{1,2} [A-Z][a-z]+ \d{4}$/, 'the rate and its end date, one part of the honesty line (the whole line is FK 3.4, plan 2f)'],
  [/^Your [A-Z][a-z]+( semester)? story is here\.?$/, 'plan 2f wording ("Your November story is here."); FK 5.2 only from the 3 syllable month name in 5 words'],
];
const spWL = t => SP_GRADE_WL.some(([r]) => r instanceof RegExp ? r.test(t) : r === t);

// visible texts of a screen: text nodes grouped by their nearest ancestor that is not display:inline (so "about <b>1 380 Ft</b> a year" stays one text)
function spScreenTexts(root, where){
  if(!root) return [];
  const m = new Map(), w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
  while((n = w.nextNode())){
    const p = n.parentElement; if(!p || !n.nodeValue.trim()) continue;
    if(p.closest('.vhid,[aria-hidden="true"],script,style,svg,.pig3d,[hidden],.num-only') || !p.getClientRects().length) continue;
    let b = p; while(b !== root && b.parentElement && getComputedStyle(b).display === 'inline') b = b.parentElement;
    const r = m.get(b) || {t:'', small:b.tagName === 'SMALL' || b.classList.contains('fine') || b.classList.contains('k'), persi:!!b.closest('.sp-say,.persi-t,.spnudge')}; r.t += n.nodeValue; m.set(b, r);
  }
  return [...m.values()].map(r => ({where, t:r.t.replace(/\s+/g, ' ').trim(), small:r.small, persi:r.persi})).filter(x => /[A-Za-z]/.test(x.t));
}
// one text against the copy rules; goal names are the student's own words, so they are read as "goal"
function spCopyIssues(x, names){
  let t = x.t; names.forEach(nm => { if(nm) t = t.split(nm).join('goal'); });
  const g = fkGrade(t), out = [];
  if(g.words > 1 && g.grade > 4 && !spWL(x.t)) out.push('grade ' + g.grade);
  if(g.longest > 12) out.push(g.longest + ' words');
  if(x.persi && g.longest > 8) out.push('Persi ' + g.longest + ' words');
  if(x.small && /[A-Za-z]-[A-Za-z]|\s-\s/.test(t.replace(/Round-ups/g, ''))) out.push('hyphen');
  if(/deadline/i.test(t)) out.push('deadline');
  if(/\bnow!|hurry|last chance|only today|don't miss|act fast|expires soon/i.test(t)) out.push('urgency');
  if(/\b\d{1,2} (Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)\b/.test(t)) out.push('short date');
  if(/\d{4,}\s?Ft|\bHUF\b|\d,\d{3}\s?Ft/.test(t)) out.push('amount format');
  return out.length ? {where:x.where, t:x.t, grade:g.grade, why:out.join(', ')} : null;
}

function spGradeChecks(ok){
  const sv = S, cur0 = cur, stk = stack.splice(0), lock0 = demo.locked, views = [...document.querySelectorAll('.view')].map(v => v.classList.contains('on')), o0 = JSON.stringify(O), away0 = SP_AWAY; demo.locked = false;
  const clk = sel => { const b = $(sel); if(b) b.click(); return !!b; };
  const reset = kind => { hideBanners(); while(stack.length) popPage(true); try{ closeOnb(); }catch(e){} try{ spHideReward(true); }catch(e){} closeSheet(); MQ.q = []; hideChip(true); hideToast(true);
    Object.assign(SP, {celebrated:false, forceOffline:false, forceFail:false, forceRM:null, last:null}); S = fresh(kind); SETUP_COLLAPSED = false; SP_AWAY = 0; renderAll(); tab('fooldal'); };
  const showHub = () => { closeSheet(); while(stack.length) popPage(true); renderAll(); tab('hub'); renderView('hub'); return $('#v-hub'); };
  const top = () => stack.length ? stack[stack.length - 1] : null;
  const all = [], add = (root, where) => { all.push(...spScreenTexts(root, where)); };
  try{
    // first run: the tab, the confirm screen for each tile, the New goal sheet, the reward
    reset('new'); add(showHub(), 'first run tab');
    SP_TILES.forEach(([k]) => { spOpen(k); add($('#onb'), 'confirm ' + k); clk('#onb [data-spchg="amt"]'); add($('#onb'), 'confirm ' + k + ', Change'); O.sp = false; closeOnb(); });
    spOpen('travel'); clk('#onb [data-spsave]'); add($('#sprw'), 'reward'); spHideReward(true);
    sheet(SHEETS.newgoal()); add($('#sheet'), 'New goal sheet'); closeSheet();
    tab('fooldal'); add(showHub(), 'tab after the first deposit (nudge)');
    // the tab with goals, in several states
    const states = [['existing seed', () => {}], ['welcome back', () => { S.juniorDays = 300; S.savedWeek = true; SP_AWAY = 5; }], ['week open', () => { S.juniorDays = 300; S.savedWeek = false; }],
      ['goal reached', () => { const f = goalById('fest'); f.saved = f.target; }], ['payday asked', () => { setMain(S, 'pay', true); S.payOpen = true; }], ['month end', () => { S.juniorDays = 300; S.monthEnd = true; }],
      ['one goal', () => { S.goals = [S.goals.find(g => g.id === 'fest')]; S.ruleGoal = 'fest'; S.juniorDays = 300; }], ['Graduate', () => { S.bridge = true; }]];
    states.forEach(([n, f]) => { reset('existing'); f(); add(showHub(), 'tab: ' + n); });
    // More, Habits, Rate and safety, goal page, Add money
    reset('existing'); S.analyst.on = true; S.months = 12; showHub(); clk('#v-hub [data-go="persmore"]'); add(top(), 'More');
    clk('.page:last-child .scroll [data-go="habits"]'); add(top(), 'Habits'); while(stack.length) popPage(true);
    reset('existing'); sheet(SHEETS.ratesafe()); add($('#sheet'), 'Rate and safety'); closeSheet();
    reset('existing'); S.bridge = true; sheet(SHEETS.ratesafe()); add($('#sheet'), 'Rate and safety (Graduate)'); closeSheet();
    reset('existing'); const gs = S.goals.filter(g => !g.shared && !isEur(g)).slice(0, 2);
    gs.forEach(g => { S._detail = g.id; S._gset = g.id; pushPage('goal'); add(top(), 'goal page ' + g.id); while(stack.length) popPage(true); });
    S.goals.push({id:'tz', name:'New bike', ic:'star', target:80000, saved:0, date:'2027-09-01', rules:{pay:{on:false, pct:10}, wk:{on:false, amt:1000, day:'mon'}, rr:{on:false}}}); S._detail = 'tz'; S._gset = 'tz'; pushPage('goal'); add(top(), 'goal page, empty goal'); while(stack.length) popPage(true);
    reset('existing'); showHub(); clk('#v-hub .sp-add'); add($('#sheet'), 'Add money'); clk('#sheet [data-hubchange]'); add($('#sheet'), 'Add money, Change'); closeSheet();
    reset('existing'); S.goals = [S.goals[0]]; renderAll(); showHub(); clk('#v-hub .sp-add'); add($('#sheet'), 'Add money, one goal'); closeSheet();
    // Persi: every sentence the priority can say (the same constructed states as chk-simple-persi-priority)
    const base = {goals:2, reached:'', payAsk:0, juniorDays:300, bridge:false, keepPending:false, storyNew:false, period:'November', savedWeek:true, weekday:3, weekN:4, awayDays:0, total:12000};
    [{goals:0}, {reached:'Summer holiday'}, {payAsk:7500}, {juniorDays:85}, {juniorDays:0}, {storyNew:true}, {savedWeek:false, weekday:0}, {}, {awayDays:3, total:1000}, {reached:'A very long goal name for my trip'}]
      .forEach(o => all.push({where:'Persi priority', t:persiLine({...base, ...o}).text, persi:true}));
    const names = [...new Set([...fresh('existing').goals.map(g => g.name), 'New bike', 'Summer holiday', 'A very long goal name for my trip'])].sort((a, b) => b.length - a.length);
    const uniq = [...new Map(all.map(x => [x.t + '|' + !!x.persi + '|' + !!x.small, x])).values()];
    const bad = uniq.map(x => spCopyIssues(x, names)).filter(Boolean).sort((a, b) => b.grade - a.grade);
    const graded = uniq.filter(x => fkGrade(x.t).words > 1 && !spWL(x.t)).map(x => fkGrade(x.t).grade).sort((a, b) => b - a);
    const screens = new Set(uniq.map(x => x.where.replace(/ \w+$|,.*$/, ''))).size;
    ok('chk-simple-grade: every visible text on the new screens (first run tab, confirm screen for the 4 tiles, reward, the tab in 8 states, More, Habits, Rate and safety, goal page with its settings open, Add money, every Persi priority sentence) is FK grade 4 or lower (one-word labels and the documented SP_GRADE_WL terms excepted), 12 words or fewer per sentence, Persi 8 or fewer, no hyphen in a subtitle, no "deadline", no urgency words, full dates, amounts as "50 000 Ft"',
      bad.length === 0 && uniq.length > 80, {texts:uniq.length, screens, worst:bad.slice(0, 8).map(b => `${b.where}: "${b.t.slice(0, 48)}" (${b.why})`), nBad:bad.length, maxGraded:graded[0]});
    window.__spGradeLast = {bad, uniq};   // demo and docs: the full list of the last run
  } catch(e){ ok('chk-simple-grade: the copy checks ran without errors', false, String(e && e.stack || e)); }
  finally { hideBanners(); hideChip(true); PEND = null; MQ.q = []; hideToast(true); try{ closeOnb(); spHideReward(true); }catch(e){} while(stack.length) popPage(true); SP_AWAY = away0; S = sv; cur = cur0; stack.push(...stk); demo.locked = lock0;
    Object.assign(SP, {celebrated:false, forceOffline:false, forceFail:false, forceRM:null});
    try{ Object.keys(O).forEach(k => delete O[k]); Object.assign(O, JSON.parse(o0)); closeSheet(); renderAll(); }catch(e){} document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', views[i])); }
  spHuChecks(ok);
}

// chk-simple-hu-keys: SP_STRINGS (English) and HU (Hungarian drafts) live in js/hu-strings.js
function spHuChecks(ok){
  try{
    const en = typeof SP_STRINGS === 'object' ? SP_STRINGS : {}, hu = typeof HU === 'object' ? HU : {}, keys = Object.keys(en);
    const missing = keys.filter(k => !(k in hu)), empty = keys.filter(k => k in hu && !String(hu[k]).trim());
    const names = keys.filter(k => ['Persely', 'Persi'].some(nm => new RegExp('\\b' + nm + '\\b').test(en[k]) && !new RegExp(nm).test(hu[k] || '')));
    const ph = keys.filter(k => { const a = (en[k].match(/\{\w+\}/g) || []).sort().join(), b = (String(hu[k] || '').match(/\{\w+\}/g) || []).sort().join(); return a !== b; });
    const fmt = keys.filter(k => /\d\.\d%/.test(hu[k] || '') || /\b(January|September|November)\b/.test(hu[k] || ''));   // HU uses "3,0%" and Hungarian month names
    // the strings on screen are the registered ones: every Persi priority sentence matches a registered template
    const tpl = s => new RegExp('^' + s.replace(/[.*+?^$()|[\]\\]/g, '\\$&').replace(/\{\w+\}/g, '.+') + '$');
    const base = {goals:2, reached:'', payAsk:0, juniorDays:300, bridge:false, keepPending:false, storyNew:false, period:'November', savedWeek:true, weekday:3, weekN:4, awayDays:0, total:12000};
    const persi = [{goals:0}, {reached:'Trip'}, {reached:'A very long goal name for my trip'}, {payAsk:7500}, {juniorDays:85}, {juniorDays:0}, {storyNew:true}, {savedWeek:false, weekday:0}, {}, {awayDays:3}].map(o => persiLine({...base, ...o}).text);
    const unreg = persi.filter(t => !Object.values(en).some(s => tpl(s).test(t)));
    const draft = typeof HU_DRAFT === 'string' && /DRAFT: native speaker and OTP terms to verify/.test(HU_DRAFT);
    // the HU proxy (plan 2g, team-chosen, not a validated index) on the glance strings: 8 words or fewer per sentence, at most 1 word over 12 letters per sentence
    const sentsHU = s => String(s).split(/(?<=[!?]|[^\d}]\.)\s+|\s*·\s*/).map(x => x.trim()).filter(x => /\p{L}/u.test(x));
    const proxy = keys.filter(k => /^(persi|fr|tab|hon|common|add|more)\./.test(k)).filter(k => sentsHU(hu[k]).some(x => { const w = x.split(/\s+/).filter(Boolean); return w.length > 8 || w.filter(y => (y.match(/\p{L}/gu) || []).length > 12).length > 1; }));
    ok('chk-simple-hu-keys: every string of the simple version registered in SP_STRINGS (js/hu-strings.js) has a Hungarian draft in HU, none empty; "Persely" and "Persi" stay as names; {placeholders} match; HU uses the decimal comma and Hungarian month names; the glance strings (Persi, first run, tab, honesty line, Add money, More) keep the HU proxy (8 words or fewer per sentence, at most 1 word over 12 letters); every Persi priority sentence is a registered string; the table is marked as a draft to verify',
      keys.length >= 60 && !missing.length && !empty.length && !names.length && !ph.length && !fmt.length && !proxy.length && !unreg.length && draft, {keys:keys.length, missing:missing.slice(0, 6), empty, names, ph, fmt, proxy, unreg, draft});
  } catch(e){ ok('chk-simple-hu-keys: the check ran without errors', false, String(e && e.stack || e)); }
}
