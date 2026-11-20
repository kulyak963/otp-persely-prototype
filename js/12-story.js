/* ================= monthly story, Wrapped style (Denis's story from main: bc2cabc, 290edfd, cf22f60, cd0a87c, d46350c) =================
   Every figure is computed from the transactions, nothing is typed in. Up to 11 slides, each its own colour (ST_BG), one big fact and one short line:
   title · top places · spending day · days off · biggest buy · subscriptions · Wolt week · into Persely · the goal · streak · share card.
   No analytics slides (in and out, where it went, bills, the biggest change, next month): those live on Spending and Bills.
   Slide length = 2.5 s + 0.17 s per word on screen, at most 7 s. The story exists only at month end (storyReady, S.monthEnd).
   Recording hooks: window.__story (open, go, seek, step, pause, play, manual, record, info). Semester and year: the same slides over those months. */
const ST_END = 2.2;   // seconds until every entrance has landed
const ST_WPS = .17;   // seconds per word to read on a slide, on top of 2.5 s for the picture (a slide is at most 7 s)
const stClamp = x => Math.min(1, Math.max(0, x));
const stEz = x => 1 - Math.pow(1 - stClamp(x), 3);                                            // ease-out, no bounce on numbers
const stBack = x => { x = stClamp(x); return 1 + 2.4 * Math.pow(x - 1, 3) + 1.4 * Math.pow(x - 1, 2); };   // a small overshoot, callouts only
const stPh = (t, a, b) => stClamp((t - a) / (b - a));
const stRed = () => window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;
const stSet = (el, o) => { if(el) for(const k in o) el.setAttribute(k, o[k]); };
const stShort = ym => MONTHN[+ym.slice(5) - 1].slice(0, 3);
// the months the story covers: this month, or the finished months of the semester (September to now; the month the demo skips is not in S.closedYm)
function stRange(){
  const last = ymAt(S.months || 0);
  if(S._yearStory){ const ys = (S.closedYm || []).filter(y => y >= ymAt(1) && y <= last).slice(-12), f = ys[0] || last;
    return {sem:true, year:true, yms:ys.length ? ys : [last], name:`${stShort(f)} ${f.slice(0, 4)} – ${stShort(last)} ${last.slice(0, 4)}`}; }
  const sem = S.period === 'Autumn semester';
  if(!sem) return {sem, yms:[last], name:S.period};
  const ys = (S.closedYm || []).filter(y => y >= '2026-09' && y <= last).slice(-5);
  return {sem, yms:ys.length ? ys : [last], name:'Autumn semester'};
}
// money in, money out by bucket, and what was put aside, over some months. out = must-pay + essentials + fun + other + saving; left = in - out
function stAgg(yms){
  const locked = new Set(mustBills().map(b => b.key)), A = {inc:0, must:0, ess:0, fun:0, other:0, save:0, rules:0, round:0, manual:0, interest:0, by:{}};
  yms.forEach(y => A.by[y] = {inc:0, out:0});
  S.tx.forEach(t => {
    const w = txWhen(t), m = A.by[w.ym]; if(!m) return;
    const ty = txType(t), add = (k, v) => { A[k] += v; m.out += v; };
    if(ty === 'in'){ A.inc += t.a; m.inc += t.a; }
    else if(ty === 'own'){
      if(/^INTEREST/i.test(t.n)){ if(t.a > 0) A.interest += t.a; }
      else if(/^(BILLS POCKET|CURRENCY)/i.test(t.n) || t.a >= 0) return;
      else { add('save', -t.a); A[/^(Payday|Weekly)/i.test(t.s) ? 'rules' : /^Round/i.test(t.s) ? 'round' : 'manual'] += -t.a; }
    }
    else if(ty === 'cash' || ty === 'topup') add('ess', -t.a);   // cash and money moved elsewhere count in Everyday essentials, as in the split
    else if(t.parts){ const f = t.parts.fun || 0; add('ess', -t.a - f); add('fun', f); }
    else { const g = CATEGORY[classify(t)][2]; add(locked.has(payeeKey(t)) && t.a < 0 ? 'must' : g === 'fun' || g === 'subs' ? 'fun' : 'ess', -t.a); }
  });
  A.out = A.must + A.ess + A.fun + A.other + A.save; A.left = A.inc - A.out; A.put = A.save + A.interest;
  return A;
}
// the biggest category that is 25% or more above its average of the 3 months before (and at least 2 000 Ft more). Only rises count: the demo months are not full of every category, so a "drop" would be false.
function stDrift(ym){
  const base = (S.closedYm || []).filter(y => y < ym).slice(-3); if(base.length < 2) return null;
  const cur = monthUse(ym).spend, hist = base.map(y => monthUse(y).spend); let best = null;
  Object.keys(cur).forEach(c => { const g = CATEGORY[c] && CATEGORY[c][2]; if(!g || ['must', 'save', 'other', 'in'].includes(g) || /^mix_/.test(c)) return;
    const vals = hist.map(h => h[c] || 0), avg = vals.reduce((a, b) => a + b, 0) / vals.length, amt = cur[c];
    if(avg > 0 && amt >= avg * 1.25 && amt - avg >= 2000 && (!best || amt - avg > best.amt - best.avg)) best = {cat:c, label:CATEGORY[c][0], amt, avg, up:Math.round((amt / avg - 1) * 100), pts:vals.concat(amt), yms:base.concat(ym), names:base.map(stShort).concat(stShort(ym))}; });
  return best;
}
function stFrame(k, vis, big, sub, note, warn){   // note: one small line under the sub; warn = it is bad news (warning colour and an icon, never colour alone)
  const c = big.length > 24 ? 's' : big.length > 9 ? 'm' : '';
  return `<div class="st-k">${k}</div><div class="st-vis">${vis}</div><div class="st-big ${c}" data-big>${big}</div><div class="st-sub">${sub}</div>${note ? `<div class="st-n${warn ? ' w' : ''}">${warn ? I('cal', 14) : ''}${note}</div>` : ''}`;
}
// The story, Wrapped style: a few facts about her own habits (no analytics: that lives on Left to spend and Full analysis),
// then the savings slides. One big fact and one short line per slide, each slide its own colour, the pig reacts on some.
// 1 title · 2 top places · 3 her day · 4 no-spend days · 5 biggest buy · 6 subscriptions · 7 Wolt · 8 into Persely · 9 the goal · 10 streak · 11 share
// story backgrounds: each slide its own hue, all from palette tokens (dark end = token mixed 55% to black, light end = 20% to black; white text sits on the dark half, and every light end is at least as dark as the old literal it replaced)
const stGrad = (dark, light) => `linear-gradient(160deg,${dark},${light})`, stHue = hex => stGrad(mixHex(hex, -.55), mixHex(hex, -.2));
const ST_GREEN = stGrad(mixHex(PALETTE.greenDk, -.3), PALETTE.act), ST_BLUE = stGrad(mixHex(PALETTE.blueT, -.5), PALETTE.blueI), ST_ORANGE = stHue(PALETTE.orange),
  ST_VIOLET = stHue(PALETTE.cViolet), ST_MINT = stHue(PALETTE.cMint), ST_PINK = stHue(PALETTE.cPink);
const ST_BG = [ST_GREEN, ST_BLUE, ST_ORANGE, ST_VIOLET, ST_MINT, ST_PINK, ST_ORANGE, ST_MINT, ST_VIOLET, ST_ORANGE, ST_GREEN];
// shop names as people say them
const SHOP = {'LIDL MAGYARORSZÁG':'Lidl', 'SPAR MAGYARORSZÁG':'Spar', 'PENNY MARKET':'Penny', 'ALDI':'Aldi', 'WOLT HUNGARY':'Wolt', 'BKK BUDAPEST':'BKK', 'MÁV-START':'MÁV', 'BENU GYÓGYSZERTÁR':'Benu', 'LIBRI KÖNYVESBOLT':'Libri', 'CINEMA CITY':'Cinema City', 'STARBUCKS':'Starbucks', "MCDONALD'S":"McDonald's", 'MEDIAMARKT':'MediaMarkt', 'BOLT':'Bolt', 'KFC':'KFC', 'H&M':'H&M', 'NETFLIX':'Netflix', 'SPOTIFY':'Spotify'};
const shopName = n => SHOP[n] || n.split(/\s+/)[0].replace(/^(.)(.*)$/, (m, x, y) => n.split(/\s+/)[0].length <= 4 ? m : x + y.toLowerCase());
const WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// the card payments the facts are built from: the story's months, or, when they hold too few (a month that just started, fast-forwarded months),
// the latest months that have single card payments. The slides say which months they cover.
function stFacts(R){
  const rows = ym => S.tx.filter(t => !t.parts && txType(t) === 'card' && t.a < 0 && txWhen(t).ym === ym);
  // one month: the story month if it has enough single card payments, else the latest full month that has (the demo's November has only started)
  const full = y => rows(y).length >= 15, all = [...new Set(S.tx.filter(t => !t.parts && txType(t) === 'card').map(t => txWhen(t).ym))].sort().filter(full);
  const yms = [R.yms.slice().reverse().find(full) || all[all.length - 1] || R.yms[R.yms.length - 1]];
  const tx = yms.flatMap(rows), cur = ymAt(S.months || 0), today = shownMonth().today;
  const label = yms.length > 1 ? `${stShort(yms[0])} – ${stShort(yms[yms.length - 1])}` : MONTHN[+yms[0].slice(5) - 1];
  const sub = t => classify(t) === 'subs';
  // top places by visits: shops and cafés only (subscriptions, transport tickets and passes like BKK or MÁV, rides and delivery are not places)
  const place = t => !sub(t) && classify(t) !== 'transport' && !/WOLT|FOODPANDA|BOLT/i.test(t.n), visits = {}; tx.filter(place).forEach(t => { visits[t.n] = (visits[t.n] || 0) + 1; });
  const top = Object.entries(visits).sort((x, y) => y[1] - x[1]).slice(0, 3);
  // the weekday with the biggest share of card spending
  const wd = Array(7).fill(0); tx.forEach(t => { const w = txWhen(t); wd[new Date(+w.ym.slice(0, 4), +w.ym.slice(5) - 1, w.day).getDay()] += -t.a; });
  const tot = wd.reduce((x, y) => x + y, 0), wi = wd.indexOf(Math.max(...wd));
  // days without a single card payment (this month: up to today)
  let days = 0, quiet = 0; yms.forEach(y => { const n = y === cur ? today : new Date(+y.slice(0, 4), +y.slice(5), 0).getDate(), spent = new Set(tx.filter(t => txWhen(t).ym === y).map(t => txWhen(t).day));
    days += n; for(let d = 1; d <= n; d++) if(!spent.has(d)) quiet++; });
  const big = tx.filter(t => !sub(t)).sort((x, y) => x.a - y.a)[0];
  const subsLast = {}; tx.filter(sub).forEach(t => { if(!subsLast[t.n]) subsLast[t.n] = -t.a; });   // S.tx is newest first: the latest amount of each subscription
  const subsM = Object.values(subsLast).reduce((x, y) => x + y, 0), subsN = Object.keys(subsLast).map(shopName);
  const wolt = tx.filter(t => /WOLT|FOODPANDA/i.test(t.n)), wdays = wolt.map(t => txWhen(t).day), woltWeek = wdays.reduce((m, d) => Math.max(m, wdays.filter(x => x >= d && x < d + 7).length), 0);
  return {yms, label, top, weekday:tot ? {name:WEEKDAY[wi], pct:Math.round(wd[wi] / tot * 100)} : null, quiet, days, big, subsM, subsN, wolt:{week:woltWeek, n:wolt.length, perWeek:days ? wolt.length / (days / 7) : 0, perMonth:days ? Math.round(wolt.length / (days / 30.4)) : 0, avg:wolt.length ? Math.round(wolt.reduce((x, t) => x - t.a, 0) / wolt.length / 100) * 100 : 0}};
}
function storySlides(){
  const R = stRange(), A = stAgg(R.yms), unit = R.year ? 'year' : R.sem ? 'semester' : 'month', out = [], F = stFacts(R), k = t => t;   // one month, so no date range on the slides
  const inM = !R.sem && F.yms[0] === R.yms[R.yms.length - 1] ? 'this month' : `in ${MONTHN[+F.yms[0].slice(5) - 1]} ${F.yms[0].slice(0, 4)}`;   // the facts month: the story month, or the latest full month before it (the line then names it, never a wrong "this month")
  // 1 title
  out.push({id:'title', bg:ST_BG[0], pig:'jump', build:() => `<div class="st-k">Your ${unit}</div><div class="st-vis st-c">${pig('happy', matchMedia('(max-height:700px)').matches ? 120 : 164)}</div><div class="st-big ${R.name.length > 9 ? 'm' : ''}">${R.name}</div><div class="st-sub">A few things about you.</div>`});
  // 2 top places, like top artists
  if(F.top.length) out.push({id:'places', bg:ST_BG[1], build:() => stFrame(k('Your top places'), `<ol class="st-top">${F.top.map(([n, c], i) => `<li><b>${i + 1}</b><span>${esc(shopName(n))}</span><small>${plural(c, 'visit')}</small></li>`).join('')}</ol>`, esc(shopName(F.top[0][0])), `Your number one. ${plural(F.top[0][1], 'visit')}.`)});
  // 3 her day of the week
  if(F.weekday && F.weekday.pct >= 18) out.push({id:'weekday', bg:ST_BG[2], build:() => stFrame(k('Your spending day'), `<div class="st-wd">${WEEKDAY.slice(1).concat(WEEKDAY[0]).map(d => `<i class="${d === F.weekday.name ? 'on' : ''}">${d[0]}</i>`).join('')}</div>`, F.weekday.name, `${F.weekday.pct}% of your card spending happens on ${F.weekday.name}s.`)});
  // 4 no-spend days
  if(F.quiet > 0) out.push({id:'quiet', bg:ST_BG[3], pig:'jump', build:() => stFrame(k('Days off'), `<div class="st-c">${pig('proud', 120)}</div>`, plural(F.quiet, 'day'), 'without a single card payment.')});
  // 5 biggest single buy
  if(F.big) out.push({id:'biggest', bg:ST_BG[4], build:() => stFrame(k('Your biggest buy'), `<div class="st-tag" data-say="${ft(-F.big.a)}">${ft(-F.big.a)}</div>`, esc(shopName(F.big.n)), `Your biggest single card payment ${inM}.`)});
  // 6 subscriptions
  if(F.subsM > 0) out.push({id:'subs', bg:ST_BG[5], build:() => stFrame(k('Your subscriptions'), `<div class="st-chips">${F.subsN.map(n => `<span>${esc(n)}</span>`).join('')}</div>`, `${ft(F.subsM)} a month`, `That is ${ft(F.subsM * 12)} a year, on autopilot.`)});
  // 7 food delivery
  if(F.wolt.week >= 4) out.push({id:'wolt', bg:ST_BG[6], pig:'jump', build:() => stFrame(k('Your Wolt week'), `<div class="st-big-n">${F.wolt.week}</div>`, `${F.wolt.week} Wolt orders in one week`, F.wolt.week >= 7 ? 'Every single day. The couriers know your door by now.' : 'The couriers know your door by now.')});
  else if(F.wolt.n >= 3) out.push({id:'wolt', bg:ST_BG[6], build:() => stFrame(k('Delivered to your door'), `<div class="st-big-n">${F.wolt.n}</div>`, `${F.wolt.n} Wolt orders`, `${inM}.`)});
  // 8 into Persely
  if((A.save > 0 || A.interest > 0) && total() > 0) out.push({id:'put', bg:ST_BG[7], pig:'celebrate', build:() => stFrame('Into Persely', `<div class="st-c">${pig('happy', 120)}</div>`,
    ft(A.save), A.interest > 0 ? `saved, plus ${ft(A.interest)} interest. Persely now holds ${ft(total())}.` : `saved. Persely now holds ${ft(total())}.`)});
  // 9 the goal
  { const g0 = ruleGoal(), g = g0 && S.goals.includes(g0) ? g0 : null;   // a real goal only (with no goals ruleGoal() is a placeholder)
    if(g){ const pc = Math.min(100, Math.round(gSaved(g) / Math.max(1, gTarget(g)) * 100)), gm = gMonths(g), tight = isTight(g);
      const sub = tight ? `Behind. Pick a new date: your ${ft(gSaved(g))} is safe.` : gm > 0 ? `On pace for ${inMonths(gm)}.` : gm === 0 ? 'You reached it.' : 'Add a saving rule to see the date.';
      out.push({id:'progress', bg:ST_BG[8], btn:tight ? {label:'Pick a new date', attr:`data-stgoal="${g.id}"`} : null,
        build:() => stFrame(esc(g.name), `<div class="st-sx"><div class="st-sx-r"><span>${ft(gSaved(g))}</span><b class="num">${ft(gTarget(g))}</b><i class="big"><em style="width:${Math.max(2, pc)}%;background:var(--green-lt)"></em></i></div></div>`, `${pc}%`, sub, '', tight)}); } }
  // 10 the streak
  if(S.streak > 0) out.push({id:'streak', bg:ST_BG[9], build:() => stFrame('Your streak', `<div class="st-c">${flame(110, true)}</div>`, plural(S.streak, 'week'), `in a row with some saving. Best so far: ${plural(S.best || S.streak, 'week')}.`)});
  // 11 share card
  const sh = shareData(), shareSay = `Share your ${unit}. Amounts stay private. ${sh.empty ? `Nothing to share this ${unit} yet.` : `${sh.streak > 0 ? `${sh.streak} week streak. ` : ''}${sh.goals.map(x => `${x.g.name} ${x.p} percent.`).join(' ')}`}`;
  out.push({id:'share', bg:ST_BG[10], share:true, end:true, empty:sh.empty, say:shareSay});
  return out;
}
// last slide: a card to share, with progress but no amounts. Nothing sad goes on it: no streak of 0, no goal whose date has passed
function shareData(){
  const goals = S.goals.filter(g => !isEur(g) && !(isExact(g) && daysTo(g) < 0)).map(g => ({g, p:Math.min(100, Math.round(gSaved(g) / gTarget(g) * 100))})).sort((a,b) => b.p - a.p).slice(0, 2);
  return {streak:S.streak, goals, empty:!(S.streak > 0) && !goals.length};
}
function shareCard(){
  const {streak, goals, empty} = shareData(), unit = S._yearStory ? 'year' : S.period === 'Autumn semester' ? 'semester' : 'month';
  if(empty) return `<div class="st-share"><div class="st-sub" style="text-align:center">Nothing to share this ${unit} yet.</div></div>`;
  const row = ({g,p}) => `<div style="display:flex;justify-content:space-between;font-size:0.875rem;color:var(--ink)"><b class="u-fw6">${esc(g.name)}</b><b class="u-c-gt">${p}%</b></div><div class="prog" style="margin:var(--sp-2) 0 var(--sp-3)"><i style="width:${p}%"></i></div>`;
  const lead = streak > 0 ? `<div style="display:flex;align-items:center;gap:var(--sp-2);margin:var(--sp-2) 0 2px">${flame(40)}<b style="font-size:2.5rem;line-height:1;color:var(--ink)">${streak}</b></div>
      <div style="font-size:var(--fs-m);font-weight:600;color:var(--ink)">week streak, without a break</div>`
    : `<div style="display:flex;align-items:center;gap:var(--sp-2);margin:var(--sp-2) 0 2px"><b style="font-size:2.5rem;line-height:1;color:var(--ink)">${goals[0].p}%</b></div>
      <div style="font-size:var(--fs-m);font-weight:600;color:var(--ink)">of ${esc(goals[0].g.name)} saved</div>`;
  const rest = streak > 0 ? goals : goals.slice(1);
  return `<div class="st-share"><div class="st-sub" style="text-align:center;margin-bottom:var(--sp-4)">Share your ${unit}. Amounts stay private.</div>
    <div class="sharec"><span class="k">${esc(userFirst())}'s ${S._yearStory ? 'first year with Persely' : S.period}</span>
      ${lead}
      ${rest.length ? `<div style="height:1px;background:var(--line);margin:var(--sp-4) 0"></div>${rest.map(row).join('')}` : '<div style="height:12px"></div>'}
      <div style="display:flex;align-items:center;gap:var(--sp-2);font-size:var(--fs-xs);font-weight:700;color:var(--green-t)">${I('piggy',18)} Saving with OTP Persely</div></div></div>`;
}
/* ---------- the story engine ----------
   ST.t is the time in the slide (s). Every frame: advance (unless held, paused, away or in manual mode), seek the slide to min(t, ST_END), update the bars.
   Slide length = 2.5 s + ST_WPS s per word on screen (a figure like 145 000 Ft is one word), at most 7 s. What VoiceOver reads is built from the same screen text (stSay), one slide at most about 20 words. Hold (press 220 ms) pauses; tap left/right = back/next; swipe down closes.
   Reasons to pause are kept in ST.hold (touch, btn, user, api, hidden): the story runs when it is empty. */
const ST = {on:false, i:0, t:0, slides:[], total:0, hold:new Set(), raf:0, last:0, manual:false, away:false, down:null, settled:false};
// one text for the screen and for VoiceOver: the slide is built and landed (seek to its final frame) off screen, then its words are read. Nothing is typed twice, so the spoken text cannot drift from the screen.
const stRoot = s => { const d = document.createElement('div'); d.className = 'st-body'; d.innerHTML = s.share ? shareCard() : s.build(); if(s.seek) s.seek(d, ST_END); return d; };
const stNum = t => t.replace(/-?\d[\d \u00a0]*\d( Ft)?|\d( Ft)?/g, 'N');   // a figure such as 145 000 Ft is one word to read
const stWords = s => stNum([...stRoot(s).querySelectorAll('.st-big,.st-sub,.st-n')].map(e => e.textContent).join(' ')).split(/\s+/).filter(Boolean).length;   // the words to read on screen
const stDur = s => s.end ? 0 : Math.min(7, 2.5 + ST_WPS * stWords(s));   // 2.5 s for the picture plus the words, at most 7 s
function stSay(s){
  if(s.share) return s.say;   // the share card reads from its own data (shareData), the same one that draws it
  const piece = e => (e.dataset && e.dataset.say ? e.dataset.say : e.textContent).replace(/▲/g, 'up').replace(/▼/g, 'down').replace(/\s*·\s*/g, ', ').replace(/\s+/g, ' ').trim();
  const parts = [...stRoot(s).querySelectorAll('.st-k,.st-big,.st-sub,.st-n,[data-say]')].filter(e => !e.closest('[data-say]') || e.dataset.say).map(piece).filter(Boolean);
  let t = parts.reduce((a, x) => !a ? x : a + (/^[a-z(]/.test(x) ? ' ' : /[.!?]$/.test(a) ? ' ' : '. ') + x, '');
  if(!/[.!?]$/.test(t)) t += '.';
  return s.btn ? `${t} Button: ${s.btn.label}.` : t;
}
function stBuild(){
  ST.slides = storySlides(); ST.slides.forEach(s => s.dur = s.fixed || stDur(s)); ST.total = ST.slides.reduce((a, s) => a + s.dur, 0);
  ST.slides.forEach(s => s.fin && s.fin(ST.total)); ST.slides.forEach(s => { s.say = stSay(s); });
}
function openStory(n){
  closeSheet(); stBuild(); const el = $('#story'), nn = ST.slides.length;
  ST.on = true; ST.away = false; window.__stAway = false; ST.hold.clear(); ST.manual = false; ST.last = 0; el.classList.add('on'); el.classList.remove('away', 'held');
  el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', `Your ${S.period} story`);
  el.innerHTML = `<div class="st-bars" aria-hidden="true">${ST.slides.map(() => '<i><b></b></i>').join('')}</div>
    <button class="st-pz" data-stpause aria-label="Pause the story"></button><button class="st-x" data-stclose aria-label="Close the story">×</button>
    <p class="st-sr" aria-live="polite"></p><div class="st-body"></div><div class="st-foot"></div>`;
  stPauseIcon(); stGo(Math.max(0, Math.min(nn - 1, +n || 0)));
  if(!S.storySeen){ S.storySeen = true; save(); renderView('hub'); }
  if(!ST.raf) ST.raf = requestAnimationFrame(stTick);
}
function closeStory(){
  S._yearStory = false;
  const el = $('#story'); ST.on = false; ST.away = false; window.__stAway = false; ST.hold.clear(); cancelAnimationFrame(ST.raf); ST.raf = 0; clearTimeout(ST.pt);
  el.classList.remove('on', 'away', 'held', 'rec'); el.style.transform = ''; el.style.transition = ''; el.style.background = ''; el.innerHTML = ''; mountPig();
}
function stGo(i){
  if(i >= ST.slides.length) return closeStory();
  ST.i = Math.max(0, i); ST.t = 0; ST.settled = false; stRender();
}
function stRender(){
  const s = ST.slides[ST.i], el = $('#story'), body = el.querySelector('.st-body'), foot = el.querySelector('.st-foot');
  body.innerHTML = s.share ? shareCard() : s.build(); body.setAttribute('aria-hidden', s.share ? 'false' : 'true'); body.classList.toggle('share', !!s.share);
  foot.innerHTML = s.end ? `<button class="btn" style="background:var(--white);color:var(--green-t)" data-stdetails>See details</button>${s.empty ? '' : `<button class="btn w" style="background:rgba(255,255,255,.18);box-shadow:none;color:var(--white)" data-stshare>Share (preview)</button>`}<button class="btn w" style="background:none;box-shadow:none;color:var(--white)" data-stclose>Close</button>`
    : s.btn ? `<button class="btn" data-stbtn ${s.btn.attr}>${s.btn.label}</button>` : '';
  el.querySelector('.st-sr').textContent = `Slide ${ST.i + 1} of ${ST.slides.length}. ${s.say}${s.end ? (s.empty ? ' Buttons: See details, Close.' : ' Buttons: See details, Share, Close.') : ''}`;
  el.dataset.slide = s.id; el.style.background = s.bg || ''; mountPig(); stPaint(true);   // each slide its own colour (ST_BG)
  clearTimeout(ST.pigT); if(s.pig && pig3d && pig3d[s.pig] && !stRed()) ST.pigT = setTimeout(() => { if(ST.on && ST.slides[ST.i] === s) pig3d[s.pig](); }, 450);   // Persi reacts on the title, days off, the Wolt week and Into Persely
}
function stPaint(force){
  if(!ST.on || !ST.slides[ST.i]) return;
  const s = ST.slides[ST.i], el = $('#story'), t = stRed() ? ST_END : Math.min(ST.t, ST_END);
  if(s.seek && (force || !ST.settled || t < ST_END)){ s.seek(el.querySelector('.st-body'), t); ST.settled = t >= ST_END; }
  el.querySelectorAll('.st-bars b').forEach((b, k) => { b.style.width = (k < ST.i ? 100 : k === ST.i ? (s.end ? 100 : Math.min(100, ST.t / s.dur * 100)) : 0) + '%'; });
}
function stStep(dt){ if(!ST.on) return; const s = ST.slides[ST.i]; ST.t += dt; stPaint(); if(!s.end && ST.t >= s.dur) stGo(ST.i + 1); }
function stTick(now){
  ST.raf = 0; if(!ST.on) return;
  const dt = ST.last ? Math.min(.1, (now - ST.last) / 1000) : 0; ST.last = now;
  if(!ST.manual && !ST.hold.size && !ST.away) stStep(dt);
  ST.raf = requestAnimationFrame(stTick);
}
function stHold(why, on){
  on ? ST.hold.add(why) : ST.hold.delete(why);
  const el = $('#story'); el.classList.toggle('held', ST.hold.has('touch')); stPauseIcon();
}
function stPauseIcon(){ const b = $('#story .st-pz'); if(!b) return; const p = ST.hold.has('user');
  b.innerHTML = p ? '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="' + PALETTE.white + '"/></svg>' : '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><rect x="6.5" y="5" width="4" height="14" rx="1" fill="' + PALETTE.white + '"/><rect x="13.5" y="5" width="4" height="14" rx="1" fill="' + PALETTE.white + '"/></svg>';
  b.setAttribute('aria-label', p ? 'Play the story' : 'Pause the story'); b.setAttribute('aria-pressed', p); }
// rebuild the slides from the current data (after a bill is paid or a tip is set) and stay on the same slide, at the same time
function stRefresh(keep){
  if(!ST.on) return; const id = ST.slides[ST.i] && ST.slides[ST.i].id, t = ST.t; stBuild(); const k = ST.slides.findIndex(s => s.id === id);
  const el = $('#story'); el.querySelector('.st-bars').innerHTML = ST.slides.map(() => '<i><b></b></i>').join('');
  ST.i = k >= 0 ? k : Math.min(ST.i, ST.slides.length - 1); ST.t = keep ? t : 0; ST.settled = false; stRender();
}
function stReturn(){ if(!ST.on) return; ST.away = false; window.__stAway = false; $('#story').classList.remove('away'); ST.hold.delete('btn'); stRefresh(true); }
function stAway(){ ST.away = true; window.__stAway = true; $('#story').classList.add('away'); }   // a sheet (Pay now) opens over the story; closeSheet brings it back
(function(){
  const el = $('#story');
  el.addEventListener('pointerdown', e => {
    if(e.button > 0 || e.target.closest('button,a,input')) return;
    ST.down = {x:e.clientX, y:e.clientY, held:false, drag:false, id:e.pointerId};
    try{ el.setPointerCapture(e.pointerId); }catch(_){}
    clearTimeout(ST.ht); ST.ht = setTimeout(() => { if(ST.down && !ST.down.drag){ ST.down.held = true; stHold('touch', true); } }, 220);
  });
  el.addEventListener('pointermove', e => {
    const d = ST.down; if(!d || d.held) return; const dy = e.clientY - d.y, dx = e.clientX - d.x;
    if(!d.drag && dy > 14 && dy > Math.abs(dx) * 1.5){ d.drag = true; clearTimeout(ST.ht); }
    if(d.drag){ el.style.transition = 'none'; el.style.transform = `translateY(${Math.max(0, dy)}px)`; }
  });
  const end = e => {
    const d = ST.down; if(!d) return; ST.down = null; clearTimeout(ST.ht);
    if(d.held){ stHold('touch', false); return; }
    if(d.drag){ const dy = e.clientY - d.y;
      if(e.type === 'pointerup' && dy > 90){ el.style.transition = stRed() ? 'none' : 'transform .2s ease-in'; el.style.transform = 'translateY(100%)'; setTimeout(closeStory, stRed() ? 0 : 200); }
      else { el.style.transition = stRed() ? 'none' : 'transform .2s ease-out'; el.style.transform = ''; }
      return; }
    if(e.type !== 'pointerup') return;
    const r = el.getBoundingClientRect(); if(e.clientX - r.left < r.width / 3) stGo(ST.i - 1); else stGo(ST.i + 1);
  };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  el.addEventListener('contextmenu', e => e.preventDefault());
  document.addEventListener('keydown', e => {
    if(!ST.on || ST.away) return; const k = e.key;
    if(k === 'ArrowRight' || k === 'ArrowLeft'){ e.preventDefault(); stHold('user', true); stGo(ST.i + (k === 'ArrowRight' ? 1 : -1)); }   // stepping by keyboard stops the auto-advance (the pause button then shows Play); it never races a screen reader else if(k === 'Escape'){ e.preventDefault(); closeStory(); }
  });
  document.addEventListener('visibilitychange', () => { if(ST.on) stHold('hidden', document.hidden); });
})();
// recording hooks (build step 10 uses them): drive the story from code, frame by frame. The 3D Persi on slide 1 is the only part that runs on its own clock.
window.__story = {
  open:(n = 0, o = {}) => { openStory(n); if(o.pause) stHold('api', true); if(o.manual) ST.manual = true; if(o.record) $('#story').classList.add('rec'); return window.__story.info(); },   // slide n (0 = first); pause: hold the clock; manual: only step() moves it; record: hide the pause and close buttons
  go:n => { stGo(n); return ST.i; },                 // jump to slide n at t = 0
  seek:t => { ST.t = Math.max(0, t); stPaint(true); return ST.t; },   // set the time in the current slide (s), painted at once
  step:dt => { stStep(dt); return {i:ST.i, t:ST.t}; },                   // advance by dt seconds, as the real clock would (advances to the next slide at the end)
  next:() => stGo(ST.i + 1), prev:() => stGo(ST.i - 1),
  pause:() => stHold('api', true), play:() => stHold('api', false),
  manual:on => { ST.manual = !!on; },                 // true: the real-time clock stops, call step(1/30) per frame
  record:on => { $('#story').classList.toggle('rec', !!on); },
  close:() => closeStory(),
  info:() => ({on:ST.on, i:ST.i, t:ST.t, n:ST.slides.length, total:ST.total, slides:ST.slides.map(s => ({id:s.id, dur:s.dur, say:s.say}))})
};

