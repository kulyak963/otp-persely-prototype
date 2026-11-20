/* ================= Simple Persely, Phase 7: existing users opt in, with a Classic view way back (docs/simple-persely-plan.md, Rollout 7, risk 1: P42, E1-002) =================
   Behind SIMPLE_PERSELY (?simple=0 keeps today's whole app; nothing here runs then). Only the Persely TAB follows the view. First run, Home and the
   phase 3 sheets keep following the flag. Nothing migrates: the view is a setting, the money and goals are the same in both.
   S.persely (the object the seeds already carry) gets: view 'classic' | 'simple', since (app day of first sight), old (had a goal at first sight),
   askedAt / asks (the "Try the new Persely" card: Not now hides it for 7 app days, then it may come back once), tried / switchedAt (Try it),
   why: [{a, day}] (the "What did not work?" answers, kept in the state only, never sent).
   App day = S.week * 7: N (next week) is +7, a fast-forward month (O, Q, Y) is +28. The demo clock, the same in every run.
   First sight = the first time the view is needed and none is stored: a student with a goal starts in 'classic' (+ the card), one without in 'simple'.
   ?view=classic / ?view=simple (presenter) set the view at load and are used for every first sight in that page (key X, U, Reset).
   Self-checks: __checkAnalytics sets SP_CHECK_VIEW = 'simple' for the whole run, so every older check that reads the new tab for the existing seed
   runs under an explicit simple view (their assertions are unchanged). spOptinChecks clears it and sets S.persely.view per state. */
const SP_DAY = () => (S.week || 0) * 7;
const SP_WINDOW = 14, SP_SNOOZE = 7;
let SP_CHECK_VIEW = null;   // self-checks only (see above)
const spViewUrl = q => { const v = new URLSearchParams(q || '').get('view'); return v === 'classic' || v === 'simple' ? v : null; };
let SP_VIEW_URL = spViewUrl(location.search);   // the self-checks clear it while they run
const spP = () => S.persely || (S.persely = {});
function spFirstSight(urlView = SP_VIEW_URL){
  const p = spP(), old = (S.goals || []).length > 0;
  p.view = urlView || (old ? 'classic' : 'simple'); p.since = SP_DAY(); p.old = old;
  if(p.view === 'simple' && old){ p.tried = true; p.switchedAt = SP_DAY(); }   // an existing user put in the new tab (?view=simple) still gets the way back
  try{ save(); }catch(e){}
}
function spView(){ if(SP_CHECK_VIEW) return SP_CHECK_VIEW; const p = spP(); if(p.view !== 'classic' && p.view !== 'simple') spFirstSight(); return p.view; }
const spSimpleView = () => spView() === 'simple';
// the card on the classic tab: never tried, asked fewer than 2 times, and 7 app days since the last Not now
const spCardDue = () => { if(!spOn() || !S.goals.length || spView() !== 'classic') return false; const p = spP();
  return !p.tried && (p.asks || 0) < 2 && (p.askedAt == null || SP_DAY() >= p.askedAt + SP_SNOOZE); };
// the Classic view row on More: 14 app days from the switch
const spInWindow = () => { const p = spP(); return p.switchedAt != null && SP_DAY() - p.switchedAt < SP_WINDOW; };
const SP_COPY = {cardT:'Try the new Persely', cardL:'Simpler. Your money and goals stay the same.', yes:'Try it', no:'Not now',
  on:'New Persely is on. Classic view is in More.', rowT:'Classic view', rowL:'Go back to the old tab',
  setIn:'The old Persely tab. Your money stays the same.', setOut:'The old Persely tab. It moved here from More.',
  q:'What did not work?', qSub:'One tap. It stays on this phone.', thanks:'Thanks. Classic view is on.', back:'Classic view is on.'};
const SP_WHY = [['find', 'Hard to find things'], ['old', 'I like the old one'], ['info', 'I miss some info'], ['bug', 'Some parts broke']];

function spOptinCard(){
  if(!spCardDue()) return '';
  return `<div class="spoptin" data-spoptin role="region" aria-label="${SP_COPY.cardT}"><b>${SP_COPY.cardT}</b><span>${SP_COPY.cardL}</span>
    <span class="spyn"><button class="btn sm eq" data-spview-try>${SP_COPY.yes}</button><button class="btn sm eq" data-spview-later>${SP_COPY.no}</button></span></div>`;
}
const spClassicRow = () => !spOn() || !S.goals.length || spView() !== 'simple' || !spInWindow() ? '' :
  `<button class="row" data-spview-classic data-more="classic" aria-label="${SP_COPY.rowT}. ${SP_COPY.rowL}"><span class="ic">${I('list')}</span><span class="t"><b>${SP_COPY.rowT}</b><small>${SP_COPY.rowL}</small></span><span class="chev">${I('chev', 20)}</span></button>`;
// Settings > Persely: the switch, for a student who had Persely before (or who has tried the new tab)
const spViewSetting = srow => { if(!spOn() || !S.goals.length) return ''; const p = spP(); if(!p.old && !p.tried && spView() !== 'classic') return '';
  return srow('list', SP_COPY.rowT, p.switchedAt != null && !spInWindow() ? SP_COPY.setOut : SP_COPY.setIn, spView() === 'classic', 'data-sw="spview"'); };
SHEETS.spwhy = () => `<h2>${SP_COPY.q}</h2><div class="u-sheet-sub2">${SP_COPY.qSub}</div>
  <div class="spwhy" role="group" aria-label="${SP_COPY.q}">${SP_WHY.map(([k, t]) => `<button class="chip" data-spwhy="${k}">${t}</button>`).join('')}<button class="chip" data-spwhy="skip">Skip</button></div>`;
// the More page ends with the Classic view row while the window is open (Help and settings group)
if(PAGES.persmore){ const spMore0 = PAGES.persmore.html; PAGES.persmore.html = () => spMore0() + spClassicRow(); }

function spSetView(v, how){
  const p = spP(); p.view = v;
  if(v === 'simple' && (how === 'try' || p.switchedAt == null)){ p.tried = true; p.switchedAt = SP_DAY(); }
  renderAll(); try{ renderDemoPanel(); }catch(e){}
}
function spToClassic(ask){   // the student goes back: the tab turns classic now, then one question with 4 answers and Skip
  while(stack.length && stack[stack.length - 1].dataset.id === 'persmore') popPage(true);
  spSetView('classic'); if(ask) sheet(SHEETS.spwhy());
}
const spWhyCount = () => (spP().why || []).length;
document.addEventListener('click', e => {
  const t = e.target && e.target.closest ? e.target.closest('button') : null; if(!t || !SIMPLE_PERSELY) return; const d = t.dataset;
  if('spviewTry' in d){ e.stopPropagation(); spSetView('simple', 'try'); toast(SP_COPY.on); return; }
  if('spviewLater' in d){ e.stopPropagation(); const p = spP(); p.asks = (p.asks || 0) + 1; p.askedAt = SP_DAY(); renderAll(); return; }
  if('spviewClassic' in d){ e.stopPropagation(); spToClassic(true); return; }
  if(d.sw === 'spview'){ e.stopPropagation(); if(spView() === 'classic'){ spSetView('simple'); toast(SP_COPY.on); } else spToClassic(true); return; }
  if(d.spwhy){ e.stopPropagation(); const p = spP(); (p.why = p.why || []).push({a:d.spwhy, day:SP_DAY()}); save(); closeSheet(); toast(d.spwhy === 'skip' ? SP_COPY.back : SP_COPY.thanks); try{ renderDemoPanel(); }catch(x){} return; }
  if('dview' in d){ e.stopPropagation(); spSetView(spView() === 'classic' ? 'simple' : 'classic'); toast('Demo: Persely view ' + spView()); return; }
}, true);
// demo panel: "Persely view" toggles it (no question asked); the count of "What did not work?" answers is for the presenter
if(typeof renderDemoPanel === 'function'){ const spRdp0 = renderDemoPanel;
  renderDemoPanel = function(){ spRdp0.apply(this, arguments); if(!SIMPLE_PERSELY) return; const p = $('#demoPanel'), r = p && p.querySelector('[data-dreset]'); if(!r) return;
    const n = spWhyCount(), b = document.createElement('button'); b.dataset.dview = ''; b.textContent = `🔀 Persely view: ${spView()}${n ? ` · ${n} answer${n > 1 ? 's' : ''}` : ''}`; r.before(b); };
  try{ renderDemoPanel(); }catch(e){} }
// ?view= at load: the presenter's choice wins over the stored view
if(SIMPLE_PERSELY && SP_VIEW_URL){ const p = spP(); if(p.view !== SP_VIEW_URL){ p.view = SP_VIEW_URL; if(p.since == null) p.since = SP_DAY(); if(SP_VIEW_URL === 'simple' && S.goals.length && p.switchedAt == null){ p.tried = true; p.switchedAt = SP_DAY(); } } try{ save(); }catch(e){} }

/* ---------- self-checks (called from __checkAnalytics when SIMPLE_PERSELY is on) ---------- */
function spOptinChecks(ok){
  const sv = S, cur0 = cur, stk = stack.splice(0), lock0 = demo.locked, views = [...document.querySelectorAll('.view')].map(v => v.classList.contains('on')), cv0 = SP_CHECK_VIEW, url0 = SP_VIEW_URL;
  demo.locked = false; SP_CHECK_VIEW = null; SP_VIEW_URL = null;   // first sight as a real student without ?view=; test 4 passes the address in
  const showHub = () => { closeSheet(); cur = 'hub'; document.querySelectorAll('.view').forEach(v => v.classList.toggle('on', v.id === 'v-hub')); renderView('hub'); $('#v-hub').scrollTop = 0; return $('#v-hub'); };
  const isSimple = () => !!$('#v-hub [data-block="persi"]') && !$('#v-hub .gauge'), isClassic = () => !!$('#v-hub .gauge') && !$('#v-hub [data-block]');
  const cards = () => $('#v-hub').querySelectorAll('[data-spoptin]').length;
  const data = () => JSON.stringify({acc:S.accounts.map(a => [a.id, a.v]), goals:S.goals, streak:[S.streak, S.best, S.skips, S.history, S.skipped, S.week, S.savedWeek], tx:S.tx.length, total:total()});
  const h44 = el => !!el && el.getBoundingClientRect().height >= 44;
  const openMore = () => { while(stack.length) popPage(true); showHub(); const m = $('#v-hub [data-go="persmore"]'); if(m) m.click(); return stack.length ? stack[stack.length - 1] : null; };
  try{
    // 1 existing seed: classic tab + exactly one card; Try it keeps every number; Classic view comes back; Not now hides it for 7 days, then once more
    S = fresh('existing'); delete S.persely.view; let v = showHub(); const first = S.persely.view === 'classic' && S.persely.since === SP_DAY() && isClassic() && cards() === 1;
    const cd = v.querySelector('[data-spoptin]'), yb = cd && cd.querySelector('[data-spview-try]'), nb = cd && cd.querySelector('[data-spview-later]');
    const eq = yb && nb && yb.className === nb.className && getComputedStyle(yb).backgroundColor === getComputedStyle(nb).backgroundColor && Math.abs(yb.getBoundingClientRect().width - nb.getBoundingClientRect().width) <= 1 && h44(yb) && h44(nb);
    const copy = [SP_COPY.cardT + '.', SP_COPY.cardL, SP_COPY.on, SP_COPY.rowL, SP_COPY.setIn, SP_COPY.setOut, SP_COPY.q, SP_COPY.qSub, SP_COPY.thanks, ...SP_WHY.map(x => x[1] + '.')].map(t => [t, fkGrade(t)]);
    const copyOk = copy.every(([t, g]) => g.grade <= 4 && g.longest <= 12 && !/deadline|-/.test(t));
    const top = v.children[1] && v.children[1].hasAttribute('data-spoptin');
    const before = data(); yb.click(); hideToast(true); v = showHub(); const tried = S.persely.view === 'simple' && isSimple() && cards() === 0 && before === data();
    const pg = openMore(), row = pg && pg.querySelector('[data-spview-classic]'); if(row) row.click();
    const back = S.persely.view === 'classic' && sheetOpen() && /What did not work\?/.test($('#sheet').textContent); closeSheet(); v = showHub(); const backOk = back && isClassic() && cards() === 0 && before === data();   // tried once: the card does not come back
    S = fresh('existing'); delete S.persely.view; showHub(); $('#v-hub [data-spview-later]').click(); const d0 = SP_DAY(); showHub();
    const nn = [cards() === 0 && S.persely.asks === 1 && S.persely.view === 'classic'];
    S.week = (d0 + 7) / 7 - 1; showHub(); nn.push(cards() === 0); S.week = (d0 + 7) / 7; showHub(); nn.push(cards() === 1);
    $('#v-hub [data-spview-later]').click(); S.week += 20; showHub(); nn.push(cards() === 0 && S.persely.asks === 2);
    ok('chk-simple-optin: the existing seed opens on the classic Persely tab with exactly one "Try the new Persely" card at the top (Try it / Not now equal, 44 px, copy grade 4 or less, 12 words or less a sentence); Try it switches to the simple tab with balances, goals and streak unchanged; Classic view on More brings the classic tab back; Not now hides the card for 7 app days, then it comes back once',
      first && top && eq && copyOk && tried && backOk && nn.every(Boolean), {first, top, eq, copy:copy.filter(([t, g]) => !(g.grade <= 4 && g.longest <= 12)), tried, backOk, nn});
    // 2 a new user (no goal at first sight): simple straight away, no card, still simple after the first goal
    S = fresh('new'); delete S.persely.view; showHub(); const nu1 = S.persely.view === 'simple' && cards() === 0 && !S.persely.old;
    S.goals.push({id:'x1', name:'Trip', ic:'plane', saved:1000, target:50000, pace:1000, date:'2027-09-01', rules:offRules()}); showHub();
    const nu2 = isSimple() && cards() === 0 && S.persely.view === 'simple', pgN = openMore(), nu3 = pgN && !pgN.querySelector('[data-spview-classic]');
    ok('chk-simple-optin-new-user: a user with no goals at first sight goes straight to the simple view (no card), and stays there after the first goal with no Classic view row', nu1 && nu2 && nu3, {nu1, nu2, nu3});
    // 3 the Classic view row: on More for 14 app days after the switch, then only in Settings with a note; the one question sheet records the answer
    S = fresh('existing'); delete S.persely.view; showHub(); $('#v-hub [data-spview-try]').click(); hideToast(true); const sw = S.persely.switchedAt;
    const rowAt = dd => { S.week = (sw + dd) / 7; const m = openMore(); return !!(m && m.querySelector('[data-spview-classic]')); };
    const win = [rowAt(0), rowAt(7), !rowAt(14), !rowAt(28)];
    const setAt = dd => { S.week = (sw + dd) / 7; while(stack.length) popPage(true); openSettings('persely'); const pgS = stack[stack.length - 1], r = pgS && pgS.querySelector('[data-sw="spview"]'), row = r && r.closest('.set-row'); const t = row ? row.textContent : ''; return {on:!!r, txt:t, h:h44(r && r.closest('.set-row'))}; };
    const s0 = setAt(0), s1 = setAt(14), sets = s0.on && s0.txt.includes(SP_COPY.setIn) && s1.on && s1.txt.includes(SP_COPY.setOut) && s0.h;
    S.week = sw / 7; const m2 = openMore(); m2.querySelector('[data-spview-classic]').click(); const sh = $('#sheet'), chips = sh ? [...sh.querySelectorAll('[data-spwhy]')] : [];
    const chipOk = chips.length === 5 && chips.every(c => c.className === chips[0].className && h44(c)) && chips[4].dataset.spwhy === 'skip' && new Set(chips.map(c => Math.round(c.getBoundingClientRect().height))).size === 1;
    const n0 = spWhyCount(); chips[1] && chips[1].click(); hideToast(true); const rec = spWhyCount() === n0 + 1 && S.persely.why[S.persely.why.length - 1].a === 'old' && !sheetOpen() && S.persely.view === 'classic';
    while(stack.length) popPage(true); openSettings('persely'); const sb = stack[stack.length - 1].querySelector('[data-sw="spview"]'); sb && sb.click(); hideToast(true); const viaSet = S.persely.view === 'simple'; while(stack.length) popPage(true); openSettings('persely'); const sb2 = stack[stack.length - 1].querySelector('[data-sw="spview"]'); sb2 && sb2.click();
    const setAsk = S.persely.view === 'classic' && sheetOpen() && /What did not work\?/.test($('#sheet').textContent); $('#sheet [data-spwhy="skip"]') && $('#sheet [data-spwhy="skip"]').click(); hideToast(true);
    const skipRec = spWhyCount() === n0 + 2 && S.persely.why[S.persely.why.length - 1].a === 'skip';
    renderDemoPanel(); const panel = /Persely view: classic · 2 answers/.test(($('#demoPanel [data-dview]') || {}).textContent || '');
    ok('chk-simple-classic-window: after Try it the More page has a Classic view row for 14 app days (day 0 and 7 yes, 14 and 28 no), Settings > Persely keeps the Classic view switch (with a note after 14 days); going back opens "What did not work?" with 4 answers and Skip of equal weight, the answer is kept in the state and counted in the demo panel',
      win.every(Boolean) && sets && chipOk && rec && viaSet && setAsk && skipRec && panel, {win, s0, s1, chipOk, rec, viaSet, setAsk, skipRec, panel});
    // 4 the presenter overrides: ?view=classic / ?view=simple pick the view at first sight; the demo panel button toggles it
    const ov = {};
    ov.parse = spViewUrl('?demo=1&view=classic') === 'classic' && spViewUrl('?view=simple') === 'simple' && spViewUrl('?view=x') === null && spViewUrl('') === null;
    const firstWith = (url, kind) => { S = fresh(kind); delete S.persely.view; spFirstSight(spViewUrl(url)); showHub(); return {v:S.persely.view, simple:isSimple(), classic:isClassic(), card:cards()}; };
    const ec = firstWith('?view=classic', 'existing'), es = firstWith('?view=simple', 'existing'), en = firstWith('', 'existing');
    ov.urls = ec.classic && ec.card === 1 && es.simple && es.card === 0 && en.classic && en.card === 1;
    ov.live = url0 === spViewUrl(location.search) && (!url0 || !!(sv.persely && sv.persely.view));
    S = fresh('existing'); delete S.persely.view; showHub(); renderDemoPanel(); const db = $('#demoPanel [data-dview]'); db && db.click(); hideToast(true); const t1 = S.persely.view === 'simple' && isSimple() && !sheetOpen();
    const db2 = $('#demoPanel [data-dview]'); db2 && db2.click(); hideToast(true); ov.panel = t1 && S.persely.view === 'classic' && isClassic() && !sheetOpen() && /Persely view: classic/.test(($('#demoPanel [data-dview]') || {}).textContent || '');
    ok('chk-simple-view-overrides: ?view=classic and ?view=simple are read from the address and decide the existing seed\'s first sight (classic with the card, simple without it; no ?view = classic with the card); the demo panel "Persely view" button toggles the view without asking', ov.parse && ov.urls && ov.live && ov.panel, ov);
  } catch(e){ ok('chk-simple-optin: the opt in checks ran without errors', false, String(e && e.stack || e)); }
  finally { SP_CHECK_VIEW = cv0; SP_VIEW_URL = url0; hideChip(true); hideToast(true); closeSheet(); while(stack.length) popPage(true); S = sv; cur = cur0; stack.push(...stk); demo.locked = lock0; try{ renderAll(); renderDemoPanel(); }catch(e){} document.querySelectorAll('.view').forEach((v, i) => v.classList.toggle('on', views[i])); }
}
