/* ================= financial analytics: history, categories, bills, projection (plan section 14, steps 1-5) =================
   Pure functions (they take the state as an optional last argument, default S). Screens and alerts are built on these later.
   Month keys are 'YYYY-MM' anchored on November 2026 + S.months (like the story and the goal dates). Every transaction has
   ym + day (legacy ones are read from t.d). Transaction types (txType): in, card, refund, out, debit, own, cash, topup. */
const MONTHN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const ymAt = n => { const d = new Date(2026, 10 + n, 1); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
const billToday = (st = S) => ({ym: ymAt(st.months || 0), day: st.demoDay || 14});   // the demo "today" is the 14th (same in every run)
const stamp = () => ({ym: ymAt(S.months || 0), day: S.demoDay || 14});             // spread into every new transaction
// category: [label, split bucket (ess / fun / null), group]. Groups: must (locked by default), flex, fun, subs, save, other, in
const CATEGORY = {
  groceries:['Groceries','ess','flex'], transport:['Transport','ess','flex'], edu:['Education','ess','flex'], health:['Health and pharmacy','ess','flex'],
  food:['Food and drink','fun','fun'], shopping:['Shopping','fun','fun'], fun:['Entertainment','fun','fun'], travel:['Travel','fun','fun'], subs:['Subscriptions','fun','subs'],
  housing:['Housing','ess','must'], utilities:['Utilities','ess','must'], pass:['Transport pass','ess','must'], phone:['Phone','ess','must'], insurance:['Insurance, loan, tuition','ess','must'],
  mix_ess:['Everyday essentials','ess','flex'], mix_fun:['Everyday fun','fun','fun'],   // monthStep's one-line "card payments" row (t.parts)
  saving:['Saving',null,'save'], other:['Other',null,'other'], income:['Income',null,'in']
};
// categories a card payment can be moved to in the recategorise sheet
const SPLIT_CATS = {}; ['groceries','transport','edu','health','food','shopping','fun','travel','subs'].forEach(k => SPLIT_CATS[k] = [CATEGORY[k][0], CATEGORY[k][1]]);
const payeeKey = t => (t.n || '').toUpperCase().replace(/\s+/g, ' ').trim();
function txWhen(t, st = S){
  if(t.ym) return {ym:t.ym, day:t.day || 1};
  const m = /^(\d+) (\w+)/.exec(t.d || ''), i = m ? MONTHN.indexOf(m[2]) : -1;
  return i >= 0 ? {ym:'2026-' + String(i + 1).padStart(2, '0'), day:+m[1]} : billToday(st);
}
function txType(t){
  const n = (t.n || '').toUpperCase(), s = t.s || '';
  if(/^(PERSELY|CURRENCY EXCHANGE|INTEREST|BILLS POCKET)|SAVINGS ACCOUNT/.test(n) || s === 'Between my accounts') return 'own';   // own-account moves: never income, never spending
  if(/card refund/i.test(s)) return 'refund';
  if(t.parts || s === 'Card payment') return 'card';
  if(s === 'Cash withdrawal') return 'cash';
  if(s === 'Top-up to another app') return 'topup';
  if(s === 'Direct debit' || s === 'Standing order') return 'debit';
  return t.a > 0 ? 'in' : 'out';
}
// category rules, in order: the student's own choice (t.cat) -> a remembered rule for the payee (S.catRules) -> merchant name -> card category (icon) -> transfer reference text -> Other
const PAYEE_RULES = [
  [/MVM|ÁRAMSZOLG|FŐGÁZ|\bGÁZ\b|DIGI|VÍZMŰ|KÖZÖS KÖLTSÉG/, 'utilities'], [/BKK.*(BÉRLET|PASS)/, 'pass'], [/YETTEL|VODAFONE|TELEKOM|TELENOR/, 'phone'],
  [/BIZTOSÍT|ALLIANZ|GENERALI|HITEL|TÖRLESZT|TANDÍJ/, 'insurance'], [/NETFLIX|SPOTIFY|HBO|DISNEY|YOUTUBE|ICLOUD/, 'subs'],
  [/LIDL|\bSPAR\b|ALDI|PENNY|TESCO|AUCHAN|\bCOOP\b/, 'groceries'], [/BKK|\bBOLT\b|UBER|^MOL\b|TAXI/, 'transport'], [/MÁV|FLIXBUS|RYANAIR|WIZZ/, 'travel'],
  [/^DM\b|BENU|GYÓGYSZER|ROSSMANN|PATIKA/, 'health'], [/LIBRI|JEGYZET|KÖNYV|COPY/, 'edu'], [/WOLT|FOODPANDA|MCDONALD|\bKFC\b|STARBUCKS|CAFE|PIZZA|BURGER|ESPRESSO/, 'food'],
  [/CINEMA|STEAM|PLAYSTATION|SZÍNHÁZ|BOWLING/, 'fun'], [/H&M|ZARA|DECATHLON|MEDIAMARKT|IKEA|NEW YORKER/, 'shopping']
];
const REF_RULES = [[/albérlet|lakbér|\brent\b|közös költség/i, 'housing'], [/rezsi|áram|gáz|\bvíz\b|internet/i, 'utilities'], [/bérlet/i, 'pass'], [/telefon|mobil/i, 'phone'], [/biztosít|hitel|részlet|tandíj/i, 'insurance']];
const CARD_IC = {cart:'groceries', bus:'transport', edu:'edu', food:'food', fun:'fun'};   // card category from the icon (older rows)
function classify(t, st = S){
  if(t.cat && CATEGORY[t.cat]) return t.cat;
  const ty = txType(t);
  if(ty === 'own') return 'saving';
  if(ty === 'in') return 'income';
  if(t.parts) return 'mix_ess';
  const k = payeeKey(t), r = st.catRules && st.catRules[k]; if(r && CATEGORY[r]) return r;
  for(const [re, c] of PAYEE_RULES) if(re.test(k)) return c;
  if(CARD_IC[t.ic] && (ty === 'card' || ty === 'refund')) return CARD_IC[t.ic];
  for(const [re, c] of REF_RULES) if(re.test(t.ref || '')) return c;
  return ty === 'card' || ty === 'refund' ? 'shopping' : 'other';   // unknown card payments stay "Shopping" as before; transfers, cash and top-ups are "Other"
}
const FAMILY_AMT = 67000;   // Anna's regular family transfer on the 1st (parental rent contribution), used by the demo history and every simulated month
/* ---------- demo history: fixed list, same in every reset ----------
   August-October (about 60 rows a month) plus the existing November seed and the November bills/income. Newest first.
   Per month: salary 75 000 (5th) + family transfer 67 000 (1st), rent share 42 000, utilities 10 000, BKK pass 3 450, phone 5 550 (= 61 000 of bills),
   everyday essentials 36 900 and Fun (food, fun, shopping, travel + 2 subscriptions) 27 000 on the card. */
function demoHistory(){
  let seed = 20261118; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  const MN = {'2026-08':'August', '2026-09':'September', '2026-10':'October', '2026-11':'November'};
  const mk = (ym, day, n, s, a, ic, ref) => ({ym, day, d:day + ' ' + MN[ym], n, s, a, ic, ...(ref ? {ref} : {})});
  const hist = [];
  const spread = (ym, total, count, payees, ic) => {
    const w = Array.from({length:count}, () => 0.6 + rnd() * 0.8), sw = w.reduce((a,b) => a + b, 0); let left = total;
    w.forEach((x, i) => { const a = i === count - 1 ? left : Math.round(total * x / sw / 10) * 10; left -= a;
      hist.push(mk(ym, 1 + Math.floor(rnd() * 28), payees[Math.floor(rnd() * payees.length)], 'Card payment', -a, ic)); });
  };
  // [payees, icon, count, [Aug, Sep, Oct totals]]. Essentials add up to 36 900 and Fun to 21 720 every month
  const SPEC = [
    [['LIDL MAGYARORSZÁG','SPAR MAGYARORSZÁG','ALDI','PENNY MARKET'], 'cart', 12, [25400, 23800, 24600]],
    [['BKK BUDAPEST','BOLT'], 'bus', 8, [6800, 7500, 7100]],
    [['BENU GYÓGYSZERTÁR'], 'shield', 2, [2700, 3200, 2900]],
    [['LIBRI KÖNYVESBOLT'], 'edu', 2, [2000, 2400, 2300]],
    [['WOLT HUNGARY',"MCDONALD'S",'STARBUCKS','KFC'], 'food', 14, [11200, 12400, 10800]],
    [['CINEMA CITY'], 'fun', 2, [4600, 3200, 5000]],
    [['H&M'], 'tag', 3, [4120, 5820, 3120]],
    [['MÁV-START'], 'plane', 2, [1800, 1800, 2800]]
  ];
  const BILL = {elec:[3400, 3700, 3600], gas:[2300, 2400, 2400], phone:[5490, 5550, 5550]};
  ['2026-08', '2026-09', '2026-10'].forEach((ym, i) => {
    const mn = MN[ym].toLowerCase();
    SPEC.forEach(([p, ic, c, tot]) => spread(ym, tot[i], c, p, ic));
    hist.push(mk(ym, 21, 'NETFLIX', 'Card payment', -3490, 'fun'), mk(ym, 26, 'SPOTIFY', 'Card payment', -1790, 'fun'));
    hist.push(mk(ym, 1, 'KISS ISTVÁN', 'Incoming transfer', FAMILY_AMT, 'money', 'havi támogatás'), mk(ym, 5, 'SALARY', 'Incoming transfer', 75000, 'money'));
    hist.push(mk(ym, 1, 'BKK ZRT. DIÁKBÉRLET', 'Direct debit', -3450, 'bus', 'bérlet ' + mn), mk(ym, 2, 'SZABÓ DÓRA', 'Transfer out', -42000, 'wallet', 'albérlet ' + mn),
      mk(ym, 9, 'DIGI KFT.', 'Direct debit', -4000, 'wallet', 'internet'), mk(ym, 12, 'MVM NEXT ENERGIAKERESKEDŐ', 'Direct debit', -BILL.elec[i], 'wallet', 'áram'),
      mk(ym, 13, 'FŐGÁZ ZRT.', 'Direct debit', -BILL.gas[i], 'wallet', 'gáz'), mk(ym, 20, 'YETTEL MAGYARORSZÁG', 'Direct debit', -BILL.phone[i], 'wallet', 'telefon'));
    hist.push(mk(ym, 10, 'PERSELY DEPOSIT', 'Between my accounts', -4000, 'piggy'));
  });
  hist.push(mk('2026-09', 7, 'ATM WITHDRAWAL OTP', 'Cash withdrawal', -1000, 'money'));   // the only cash withdrawal. "Other" (cash, small transfers, one top-up) averages 1 000 Ft a month, so the main demo state (payday rule and round-ups on) leaves about 1 300 Ft
  hist.push(mk('2026-08', 6, 'TRANSFER TO SAVINGS ACCOUNT', 'Between my accounts', -5000, 'piggy'), mk('2026-08', 17, 'KOVÁCS BENCE', 'Instant transfer', 3000, 'money', 'vacsora'),
    mk('2026-08', 19, 'TÓTH LILI', 'Instant transfer', -1000, 'money', 'mozi'),
    mk('2026-09', 22, 'FEKETE MÁRK', 'Instant transfer', 5000, 'money', 'jegy'),
    mk('2026-09', 8, 'REVOLUT TOP-UP', 'Top-up to another app', -1000, 'money'), mk('2026-09', 15, 'H&M REFUND', 'Card refund', 1500, 'tag'), mk('2026-09', 18, 'MEDIAMARKT', 'Card payment', -24900, 'tag'),
    mk('2026-10', 9, 'NAGY DÓRI', 'Instant transfer', 4000, 'money', 'kávé'), mk('2026-10', 23, 'TÓTH LILI', 'Instant transfer', -1000, 'money', 'taxi'));
  { let k = 0; hist.forEach(t => { if(k < 7 && t.ym === '2026-10' && t.ic === 'food' && t.n !== 'WOLT HUNGARY'){ t.n = 'WOLT HUNGARY'; t.day = 12 + k; t.d = (12 + k) + ' October'; k++; } }); }   // the "Wolt week" for the story (from main, d46350c): 7 food payments change payee and day only, so every total stays the same
  hist.forEach((t, i) => t.i = i);
  hist.sort((a, b) => b.ym < a.ym ? -1 : b.ym > a.ym ? 1 : b.day - a.day || a.i - b.i);
  hist.forEach(t => delete t.i);
  // November so far: the original seed rows plus the bills and the family transfer (x = added with the history)
  const nov = [
    {d:'13 November', n:'LIDL MAGYARORSZÁG', s:'Card payment', a:-5240, ic:'cart', day:13},
    {d:'12 November', n:'NAGY PÉTER', s:'Instant transfer', a:20000, ic:'money', day:12},
    {d:'12 November', n:'BKK BUDAPEST', s:'Card payment', a:-1350, ic:'bus', day:12},
    {d:'10 November', n:'PERSELY DEPOSIT', s:'Between my accounts', a:-4000, ic:'piggy', note:'Summer holiday', day:10},
    {d:'8 November', n:'WOLT HUNGARY', s:'Card payment', a:-4690, ic:'food', day:8},
    {d:'5 November', n:'SALARY', s:'Incoming transfer', a:75000, ic:'money', day:5},
    {d:'3 November', n:'CINEMA CITY', s:'Card payment', a:-3200, ic:'fun', day:3}
  ].concat([mk('2026-11', 13, 'FŐGÁZ ZRT.', 'Direct debit', -2400, 'wallet', 'gáz'), mk('2026-11', 12, 'MVM NEXT ENERGIAKERESKEDŐ', 'Direct debit', -3600, 'wallet', 'áram'),
    mk('2026-11', 9, 'DIGI KFT.', 'Direct debit', -4000, 'wallet', 'internet'), mk('2026-11', 2, 'SZABÓ DÓRA', 'Transfer out', -42000, 'wallet', 'albérlet november'),
    mk('2026-11', 1, 'KISS ISTVÁN', 'Incoming transfer', FAMILY_AMT, 'money', 'havi támogatás'), mk('2026-11', 1, 'BKK ZRT. DIÁKBÉRLET', 'Direct debit', -3450, 'bus', 'bérlet november')].map(t => ({...t, x:1})));
  nov.forEach((t, i) => { t.ym = '2026-11'; t.i = i; });
  nov.sort((a, b) => b.day - a.day || a.i - b.i); nov.forEach(t => delete t.i);
  return {tx:nov.concat(hist), old:hist.length, nov:nov.filter(t => t.x), hist};
}
/* ---------- recurring payments and bills ---------- */
const absDay = (ym, day) => new Date(+ym.slice(0, 4), +ym.slice(5) - 1, day).getTime() / 864e5;
const titleCase = s => s.toLowerCase().replace(/(^|\s)\S/g, c => c.toUpperCase());
const BILL_LABELS = [[/MVM|ÁRAM/, 'Electricity'], [/FŐGÁZ|\bGÁZ\b/, 'Gas'], [/DIGI|INTERNET/, 'Internet'], [/BKK/, 'BKK student pass'], [/YETTEL|VODAFONE|TELEKOM|TELENOR/, 'Phone'], [/NETFLIX/, 'Netflix'], [/SPOTIFY/, 'Spotify']];
function billName(cat, key, kind){
  if(kind === 'in') return key === 'SALARY' ? 'Salary' : 'Transfer from ' + titleCase(key);
  for(const [re, l] of BILL_LABELS) if(re.test(key)) return l;
  return cat === 'housing' ? 'Rent share' : titleCase(key);
}
// a payment is recurring when the same payee has exactly one payment in each month it appears, in at least 2 neighbouring months of the window (consecutive calendar months: 25-35 days apart), amounts within 15% of the latest.
// Looks at the last 3 finished months (S.closedYm) plus the current month so far. Returns {bills:[outgoing], income:[incoming]}, each {id,key,kind,cat,name,exp,day,win,months,last}
const ymOrd = ym => +ym.slice(0, 4) * 12 + +ym.slice(5);
function detectRecurring(st = S){
  const cur = billToday(st).ym, closed = (st.closedYm || []).slice(-3), months = closed.includes(cur) ? closed : closed.concat(cur), G = {};
  st.tx.forEach(t => {
    const ty = txType(t); if(t.parts || !['card', 'debit', 'out', 'in'].includes(ty)) return;
    const w = txWhen(t, st); if(!months.includes(w.ym)) return;
    const gk = (ty === 'in' ? 'in' : 'out') + '|' + payeeKey(t); (G[gk] = G[gk] || []).push({t, w});
  });
  const res = {bills:[], income:[]};
  Object.entries(G).forEach(([gk, arr]) => {
    if(new Set(arr.map(x => x.w.ym)).size !== arr.length) return;   // two payments in one month: shopping, not a bill
    arr.sort((a, b) => absDay(b.w.ym, b.w.day) - absDay(a.w.ym, a.w.day));
    const L = Math.abs(arr[0].t.a); let n = 1, prev = arr[0];
    for(let i = 1; i < arr.length; i++){ const e = arr[i], gap = absDay(prev.w.ym, prev.w.day) - absDay(e.w.ym, e.w.day);
      const between = months.some(m => m > e.w.ym && m < prev.w.ym);   // a window month in between with no payment breaks the chain; months outside the window (the simulated +1 month skips November) do not
      if(between || (ymOrd(prev.w.ym) - ymOrd(e.w.ym) === 1 && (gap < 25 || gap > 35)) || Math.abs(Math.abs(e.t.a) - L) / L > .15) break; n++; prev = e; }
    if(n < 2) return;
    const kind = gk.slice(0, 2) === 'in' ? 'in' : 'out', key = gk.slice(gk.indexOf('|') + 1), days = arr.slice(0, n).map(x => x.w.day).sort((a, b) => a - b), cat = classify(arr[0].t, st);
    (kind === 'in' ? res.income : res.bills).push({id:key.toLowerCase().replace(/[^a-z0-9]+/g, '-'), key, kind, cat, name:billName(cat, key, kind), exp:L, day:days[Math.floor(days.length / 2)], win:5, months:n, last:arr[0].w});
  });
  res.bills.sort((a, b) => a.day - b.day); res.income.sort((a, b) => a.day - b.day);
  return res;
}
// S.bills = the bill list the student sees: detected payments plus their choices (locked / ignored) that survive a refresh
function mergeBills(old, found){
  const res = (old || []).filter(b => b.src === 'user');
  found.forEach(f => { const o = (old || []).find(b => b.key === f.key && b.src !== 'user');
    res.push({id:f.id, key:f.key, name:o ? o.name : f.name, cat:f.cat, exp:f.exp, day:f.day, win:f.win, months:f.months,
      locked:o ? o.locked : CATEGORY[f.cat][2] === 'must', ignored:o ? !!o.ignored : false, src:'auto'}); });
  return res.sort((a, b) => a.day - b.day);
}
const refreshBills = (st = S) => { st.bills = mergeBills(st.bills, detectRecurring(st).bills); return st.bills; };
const mustBills = (st = S) => (st.bills || []).filter(b => b.locked && !b.ignored);
/* ---------- one month, every transaction counted once ----------
   monthUse(ym) = {income, spend:{cat:amt}, spendTotal, own, cash, topup, sumA}: in -> income; card/debit/out/refund -> spend by category (refunds net against it);
   own-account moves (Persely, Savings, Bills pocket, interest) -> own (net outflow, never income or spending); cash and top-ups -> their own lines. income - spendTotal - own - cash - topup === sumA */
function monthUse(ym, st = S){
  const u = {income:0, spend:{}, spendTotal:0, own:0, cash:0, topup:0, sumA:0, count:0};
  const sp = (c, v) => { u.spend[c] = (u.spend[c] || 0) + v; u.spendTotal += v; };
  st.tx.forEach(t => { if(txWhen(t, st).ym !== ym) return; u.count++; u.sumA += t.a; const ty = txType(t);
    if(ty === 'in') u.income += t.a; else if(ty === 'own') u.own -= t.a; else if(ty === 'cash') u.cash -= t.a; else if(ty === 'topup') u.topup -= t.a;
    else if(t.parts){ const f = t.parts.fun || 0; sp('mix_ess', -t.a - f); sp('mix_fun', f); }
    else sp(classify(t, st), -t.a); });
  return u;
}
/* ---------- card spending per category, for any month (Home, Monthly spending page, the monthly plan) ----------
   Card payments only: bills, transfers, cash and own-account moves are not "spending" here. A fast-forwarded month books its card
   payments as one row with parts {ess, fun}; monthStep also stores parts.cats (the same totals spread like Anna's August-October history),
   so the categories work in every month. Rows from before parts.cats existed fall back to two lines: Everyday / Fun card payments. */
const SPEND_CATS = ['groceries','transport','health','edu','food','shopping','fun','travel','subs'];
const SPEND_IC = {groceries:'cart', transport:'bus', health:'shield', edu:'edu', food:'food', shopping:'tag', fun:'fun', travel:'plane', subs:'fun', mix_ess:'cart', mix_fun:'food'};
const SPEND_SHORT = {groceries:'Groceries', transport:'Transport', health:'Health', edu:'Education', food:'Food', shopping:'Shopping', fun:'Entertainment', travel:'Travel', subs:'Streaming', mix_ess:'Everyday', mix_fun:'Fun'};
const HIST_YM = ['2026-08','2026-09','2026-10'];   // the real demo history the category shares come from
function catSpend(ym, st = S){
  const out = {};
  st.tx.forEach(t => { if(txWhen(t, st).ym !== ym) return;
    if(t.parts){ if(t.parts.cats) Object.entries(t.parts.cats).forEach(([c, v]) => out[c] = (out[c] || 0) + v);
      else { out.mix_ess = (out.mix_ess || 0) + (t.parts.ess || 0); out.mix_fun = (out.mix_fun || 0) + (t.parts.fun || 0); } return; }
    const ty = txType(t); if(ty !== 'card' && ty !== 'refund') return;
    const c = classify(t, st); if(SPEND_CATS.includes(c)) out[c] = (out[c] || 0) - t.a; });
  Object.keys(out).forEach(c => { if(out[c] <= 0) delete out[c]; });
  return out;
}
const sumVals = o => Object.values(o).reduce((a, b) => a + b, 0);
// each category's share of its bucket (Everyday essentials or Fun) in the August-October history
function catShares(bucket, st = S){
  const tot = {}; HIST_YM.forEach(ym => Object.entries(catSpend(ym, st)).forEach(([c, v]) => { if(CATEGORY[c] && CATEGORY[c][1] === bucket) tot[c] = (tot[c] || 0) + v; }));
  const all = sumVals(tot); return all ? Object.fromEntries(Object.entries(tot).map(([c, v]) => [c, v / all])) : {};
}
// spread an amount over a bucket's categories by those shares, in whole 10 Ft, adding up exactly
function spreadCats(amount, bucket, st = S){
  // subscriptions are fixed amounts (Netflix + Spotify): they keep their usual total, and the rest of Fun is spread over the other categories
  const subs = bucket === 'fun' ? Math.round(HIST_YM.reduce((a, ym) => a + (catSpend(ym, st).subs || 0), 0) / HIST_YM.length / 10) * 10 : 0, fixed = subs && amount > subs ? subs : 0;
  const sh = Object.entries(catShares(bucket, st)).filter(([c]) => !(fixed && c === 'subs')), w = sh.reduce((a, x) => a + x[1], 0), left = amount - fixed;
  if(!sh.length || left <= 0) return fixed ? {subs:fixed} : {};
  const units = Math.round(left / 10), raw = sh.map(([, x]) => units * x / w), fl = raw.map(Math.floor); let rest = units - fl.reduce((a, b) => a + b, 0);
  raw.map((r, i) => [r - fl[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if(rest > 0){ fl[i]++; rest--; } });
  const out = {}; sh.forEach(([c], i) => { if(fl[i] > 0) out[c] = fl[i] * 10; }); out[sh[0][0]] = (out[sh[0][0]] || 0) + (left - units * 10);
  if(fixed) out.subs = fixed; return out;
}
// the month on screen: its name, first and last day, and the demo "today" (the 14th)
function shownMonth(){
  const n = S.months || 0, d = new Date(2026, 10 + n, 1), name = MONTHN[d.getMonth()], last = new Date(2026, 11 + n, 0).getDate(), today = S.demoDay || 14;
  return {ym:ymAt(n), name, year:d.getFullYear(), last, today, left:Math.max(0, last - today), label:`${name} ${d.getFullYear()}`};
}
// average card spending of the last 3 finished months before the one on screen
function avgSpend(){
  const ym = ymAt(S.months || 0), yms = (S.closedYm || []).filter(y => y < ym).slice(-3);
  return yms.length ? Math.round(yms.reduce((a, y) => a + sumVals(catSpend(y)), 0) / yms.length / 100) * 100 : 0;
}
// Card spending = card payments of the month (catSpend). Total out = all money that left the Junior account that month except own-account moves
// (Persely, Bills pocket, currency, interest): card, direct debits, transfers out, cash. The two are always shown with these two names (D3).
const cardSpending = (ym = shownMonth().ym) => sumVals(catSpend(ym));
function totalOut(ym = shownMonth().ym){ let v = 0; S.tx.forEach(t => { if(t.a < 0 && txWhen(t).ym === ym && txType(t) !== 'own') v -= t.a; }); return v; }
/* Month end projection (C2.2), from data the app already has:
     left at month end = balance now (Junior account)
                       - must-pay bills still unpaid this month (what Safe to spend subtracts, less the Bills pocket)
                       - average daily card spending x days left in the month
     average daily card spending = card spending so far this month / the day of the month it is now (the demo "today").
   Income still to come is not counted (salary and family money have arrived by then); a late bill counts as unpaid. Rounded to 100 Ft. A guide, not a promise. */
function monthEndLeft(){
  const mo = shownMonth(), s = safeToSpend(), daily = mo.today ? cardSpending(mo.ym) / mo.today : 0;
  return {left:Math.round((s.balance - s.unpaidBills - daily * mo.left) / 100) * 100, daily, mo};
}
const projLine = () => { const p = monthEndLeft(); return p.left >= 0 ? `At this pace you finish the month with about ${ft(p.left)} left.` : `At this pace you finish the month about ${ft(-p.left)} short.`; };
// the line under the month circle on Home and Spending: Total out, the days left
const outLine = () => { const mo = shownMonth(); return `<div class="avg spair"><span>Total out <b class="num">${ft(totalOut(mo.ym))}</b></span><span class="sd" aria-hidden="true">·</span><span>${mo.left === 0 ? 'Last day' : plural(mo.left, 'day') + ' left'}</span></div>`; };
// category bars ("What did I spend on this month?"): the five biggest this month
function catBars(sp){
  const rows = Object.entries(sp).sort((a, b) => b[1] - a[1]).slice(0, 5), max = Math.max(1, ...rows.map(r => r[1]));
  if(!rows.length) return `<div class="card fine" style="padding:var(--sp-4) var(--sp-4)">No card payments yet this month.</div>`;
  return `<div class="cats" style="--n:${rows.length}">${rows.map(([c, v], i) => `<button class="cat ${i === 0 ? 'on' : ''}" ${CATEGORY[c] && SPEND_CATS.includes(c) ? `data-fcat="${c}" aria-label="${CATEGORY[c][0]} ${ft(v)}. See these payments"` : ''}><span class="ic">${I(SPEND_IC[c] || 'tag', 26)}</span><span class="cl">${SPEND_SHORT[c] || CATEGORY[c][0]}</span><span class="col"><i style="height:${v / max * 100}%"></i></span><span class="num">${ft(v)}</span></button>`).join('')}</div>`;
}
/* ---------- the category circle (Home and Spending) ----------
   One arc per spending category (catSpend), each sized by its share of this month's Card spending, so the arcs add up to Card spending
   and fill the 270 degree ring. One colour per category on every screen (ring, legend dots, Where it went bars, My plan rows):
   a bright, young palette (electric blue, violet, mint, sky, coral, hot pink, sunny yellow, tangerine, slate), every hue far from its neighbours;
   OTP green is kept for the centre number only. Colour is never the only signal: the legend (dot, name, amount) says the same in text,
   and each row opens Transactions with that category. The Persely tab total keeps its own green ring. */
const CAT_COL = {groceries:PALETTE.cBlue, transport:PALETTE.cViolet, health:PALETTE.cMint, edu:PALETTE.cCyan, mix_ess:PALETTE.cBlue, food:PALETTE.cCoral, shopping:PALETTE.cPink, fun:PALETTE.cYellow, travel:PALETTE.cOrange, subs:PALETTE.cSlate, mix_fun:PALETTE.cCoral};   // the --c-* tokens
const catCol = c => CAT_COL[c] || PALETTE.muted;
const catName = c => SPEND_SHORT[c] || (CATEGORY[c] ? CATEGORY[c][0] : c);
const catRows = sp => Object.entries(sp).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]);
function catRing(sp, mo, big){
  const rows = catRows(sp), tot = rows.reduce((a, r) => a + r[1], 0), R = 104, C = 2 * Math.PI * R, arc = C * .75, gap = rows.length > 1 ? 3 : 0;
  let at = 0;
  const segs = rows.map(([c, v]) => { const len = arc * v / tot, go = SPEND_CATS.includes(c);
    const s = `<circle class="seg" data-cat="${c}" data-v="${v}"${go ? ` data-fcat="${c}"` : ''} cx="125" cy="125" r="${R}" fill="none" stroke="${catCol(c)}" stroke-width="16" stroke-dasharray="${Math.max(.6, len - gap).toFixed(2)} ${C.toFixed(2)}" stroke-dashoffset="${(-at).toFixed(2)}"/>`; at += len; return s; }).join('');
  const lab = tot ? `Card spending in ${mo.label}: ${ft(tot)}. ` + rows.map(([c, v]) => `${catName(c)} ${ft(v)}`).join(', ') : `Card spending in ${mo.label}: no card payments yet`;
  return `<div class="gauge" data-cring="${big ? 'big' : 'home'}" role="img" aria-label="${esc(lab)}">
    <svg viewBox="0 0 250 250" style="transform:rotate(135deg)" aria-hidden="true"><circle cx="125" cy="125" r="${R}" fill="none" stroke="${PALETTE.line}" stroke-width="16" stroke-linecap="${tot ? 'butt' : 'round'}" stroke-dasharray="${arc} ${C}"/>${segs}</svg>
    <div class="core" aria-hidden="true"><small>Card spending</small><b class="num">${ft(tot)}</b></div>
  </div>`;
}
// Home: the legend under the circle, two columns, each one opens Transactions with that category
function catLegend(sp){
  const rows = catRows(sp);
  if(!rows.length) return `<div class="card fine" style="padding:var(--sp-4) var(--sp-4);margin-top:var(--sp-3)">No card payments yet this month.</div>`;
  return `<div class="clg">${rows.map(([c, v]) => { const go = SPEND_CATS.includes(c), tg = go ? 'button' : 'div';
    return `<${tg} class="clg-i" ${go ? `data-fcat="${c}" aria-label="${esc(catName(c))} ${ft(v)}. See these payments"` : ''}><span class="dotc" style="background:${catCol(c)}"></span><span class="t"><b>${catName(c)}</b><span class="num">${ft(v)}</span></span></${tg}>`; }).join('')}</div>`;
}
// Spending: the same legend as rows with a share bar, biggest first
function catShareRows(sp){
  const rows = catRows(sp), tot = rows.reduce((a, r) => a + r[1], 0);
  if(!rows.length) return `<div class="card fine" style="padding:var(--sp-4) var(--sp-4)">No card payments yet this month.</div>`;
  const pc = lrPct(rows.map(r => r[1]), tot);
  return `<div class="card cshare">${rows.map(([c, v], i) => { const go = SPEND_CATS.includes(c), tg = go ? 'button' : 'div';
    return `<${tg} class="cs-r" ${go ? `data-fcat="${c}" aria-label="${esc(catName(c))} ${ft(v)}, ${pc[i]}% of card spending. See these payments"` : ''}><span class="cs-h"><span class="dotc" style="background:${catCol(c)}"></span><b>${catName(c)}</b><span class="num">${ft(v)}</span><span class="pc num">${pc[i]}%</span>${go ? `<span class="chev" aria-hidden="true">${I('chev', 16)}</span>` : ''}</span><span class="mp-bar" aria-hidden="true"><i style="width:${v / tot * 100}%;background:${catCol(c)}"></i></span></${tg}>`; }).join('')}</div>`;
}
/* ---------- next-month projection ---------- */
const lrPct = (vals, total) => { const raw = vals.map(v => v / total * 100), fl = raw.map(Math.floor); let rest = 100 - fl.reduce((a, b) => a + b, 0);
  raw.map((r, i) => [r - fl[i], i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if(rest > 0){ fl[i]++; rest--; } }); return fl; };
// project() -> {ym (next month), months, confidence:{months,label}, income:{recurring,irregular,total}, mustPay, everyday, fun, other, saving, spend, left, deficit,
//   pct:{must,everyday,fun,other,saving,left} (the raw projection, whole numbers, sum 100: the screens use splitView() below, which folds Other and Left over into Everyday essentials), cats:[...], oneOffs:[...], plan:{rule,weekly,round,total}}
// what the saving rules move in a month: the payday rule (share of the salary) + the weekly transfer + round-ups
// per goal rules (see migrateRules): the payday %s of all goals add up, so do the weekly transfers; round-ups are one stream shared between goals.
// st._rulePct = a draft payday total (My split editor); withRule = count the payday rule as on (at the total, or the default for new goals when none is on)
function savePlan(st = S, withRule = false){
  const on = payOn(st), rulePct = st._rulePct !== undefined ? st._rulePct : on ? payPct(st) : ruleDefaults(st).pct || 10;
  const rule = (on || withRule) ? Math.round(st.income.amount * rulePct / 100) : 0, weekly = wkGoals(st).reduce((n, g) => n + wkMonthly(g.rules.wk.amt), 0), round = rrGoals(st).length ? ROUND_EST : 0;
  return {rule, weekly, round, total:rule + weekly + round, rulePct};
}
function project(st = S, o = {}){
  const closed = (st.closedYm || []).slice(-3), n = closed.length, rec = detectRecurring(st), locked = new Set(mustBills(st).map(b => b.key));
  const W = n === 3 ? [.2, .3, .5] : n === 2 ? [.375, .625] : n === 1 ? [1] : [], avg = a => a.reduce((s, v, i) => s + v * W[i], 0);
  const recKeys = new Set(rec.income.map(i => i.key)), per = {}, items = {}, inc = closed.map(() => 0), sav = closed.map(() => 0);
  st.tx.forEach(t => {
    const mi = closed.indexOf(txWhen(t, st).ym); if(mi < 0) return; const ty = txType(t);
    if(ty === 'in'){ if(!recKeys.has(payeeKey(t))) inc[mi] += t.a; return; }
    if(ty === 'own'){ if(!/^INTEREST/i.test(t.n)) sav[mi] -= t.a; return; }
    if(t.a < 0 && locked.has(payeeKey(t))) return;   // locked bills enter at their expected amount below
    const add = (cat, amt) => { (per[cat] = per[cat] || closed.map(() => 0))[mi] += amt; if(amt > 0 && CATEGORY[cat][2] !== 'other') (items[cat] = items[cat] || []).push({t, amt, mi}); };
    if(t.parts){ const f = t.parts.fun || 0; add('mix_ess', -t.a - f); add('mix_fun', f); return; }
    add(classify(t, st), -t.a);
  });
  const oneOffs = [];   // one big payment (> 3 x the category's median) is left out and listed
  Object.entries(items).forEach(([cat, arr]) => { if(arr.length < 4) return;
    const s = arr.map(x => x.amt).sort((a, b) => a - b), med = s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
    arr.forEach(x => { if(x.amt > 3 * med){ per[cat][x.mi] -= x.amt; oneOffs.push({cat, label:CATEGORY[cat][0], name:x.t.n, amt:x.amt, ym:closed[x.mi]}); } }); });
  const cats = Object.entries(per).map(([cat, h]) => ({cat, label:CATEGORY[cat][0], bucket:CATEGORY[cat][1], group:CATEGORY[cat][2], amt:Math.max(0, Math.round(avg(h))), hist:h.map(Math.round)}));
  const g = k => cats.filter(c => k.includes(c.group)).reduce((s, c) => s + c.amt, 0);
  const mustPay = mustBills(st).reduce((s, b) => s + b.exp, 0), everyday = g(['flex']), fun = g(['fun', 'subs']), other = g(['other']);
  const plan = savePlan(st, o.rule), saving = plan.total > 0 ? plan.total : Math.round(avg(sav.map(x => Math.max(0, x))));   // no rule on: what you usually move
  const recurring = rec.income.reduce((s, i) => s + i.exp, 0), irregular = n ? Math.max(0, Math.min(...inc)) : 0, income = recurring + irregular;
  const spend = mustPay + everyday + fun + other + saving, left = Math.max(0, income - spend), deficit = Math.max(0, spend - income), base = Math.max(income, spend) || 1;
  const p = lrPct([mustPay, everyday, fun, other, saving, left], base);
  return {ym:ymAt((st.months || 0) + 1), months:n, confidence:{months:n, label:n >= 3 ? 'Based on 3 months' : n === 2 ? 'Based on 2 months, still rough' : n === 1 ? 'Based on 1 month, a rough guess' : 'No history yet, a rough guess'},
    income:{recurring, irregular, total:income}, mustPay, everyday, fun, other, saving, plan, spend, left, deficit,
    pct:{must:p[0], everyday:p[1], fun:p[2], other:p[3], saving:p[4], left:p[5]}, cats:cats.sort((a, b) => b.amt - a.amt), oneOffs};
}
/* ---------- bill status, bills first, safe to spend ---------- */
const balanceOf = (st = S) => st.accounts.find(a => a.id === 'junior').v;
// billStatus(bill) -> {id, st:'paid'|'less'|'due'|'late'|'skipped', paid, left, days (to the due day, negative = past), over (window passed), label}
function billStatus(b, st = S){
  const now = billToday(st); let paid = 0;
  st.tx.forEach(t => { if(t.a < 0 && ['card', 'debit', 'out'].includes(txType(t)) && payeeKey(t) === b.key && txWhen(t, st).ym === now.ym) paid -= t.a; });
  const days = b.day - now.day, over = now.day > b.day + b.win, o = {id:b.id, paid, days, over, left:b.exp};
  if(st.billSkip && st.billSkip[b.id] === now.ym) return {...o, st:'skipped', left:0, label:'Not due this month'};
  if(paid >= b.exp * .85) return {...o, st:'paid', left:0, label:'Paid'};
  if(paid > 0) return {...o, st:'less', left:b.exp - paid, label:'Paid less than usual'};
  return {...o, st:over ? 'late' : 'due', label:over || days < 0 ? 'Not paid yet' : days === 0 ? 'Due today' : `Due in ${days} day${days === 1 ? '' : 's'}`};
}
// billsFirst() -> {on, warn, total (every unpaid must-pay bill this month), count, rows, late:[...], soon:[...], lateTotal, soonTotal, urgent, text}
// "late" = a bill is not paid and its window (usual day + 5) has passed. on = at least one bill is late: only late bills drive the Bills first card, the Fun hold-off and the push.
// "due soon" = due within 7 days (or past its day but inside the window). It lowers Safe to spend, never switches Bills first on. warn = nothing is late, but the soon bills are more than the balance.
function billsFirst(st = S){
  const rows = mustBills(st).map(b => ({bill:b, s:billStatus(b, st)})), open = rows.filter(r => r.s.left > 0);
  const late = open.filter(r => r.s.over), soon = open.filter(r => !r.s.over && r.s.days <= 7), total = open.reduce((s, r) => s + r.s.left, 0);
  const lateTotal = late.reduce((s, r) => s + r.s.left, 0), soonTotal = soon.reduce((s, r) => s + r.s.left, 0), on = late.length > 0, warn = !on && soon.length > 0 && balanceOf(st) < soonTotal;
  const text = !on ? '' : late.length === 1 ? `${late[0].bill.name} is late: ${ft(lateTotal)} (due on the ${ordinal(late[0].bill.day)})` : `${late.length} bills are late: ${ft(lateTotal)}`;
  return {on, warn, total, count:open.length, rows, late, soon, lateTotal, soonTotal, urgent:late.concat(soon), text};
}
// groceries are not a bill: the lowest of the last 3 finished months' grocery spending is protected
function groceriesOf(ym, st = S){ let v = 0; st.tx.forEach(t => { if(txWhen(t, st).ym !== ym) return; const ty = txType(t);
  if(t.parts) v += -t.a - (t.parts.fun || 0); else if((ty === 'card' || ty === 'refund') && classify(t, st) === 'groceries') v -= t.a; }); return v; }
const groceriesProtected = (st = S) => { const m = (st.closedYm || []).slice(-3).map(y => groceriesOf(y, st)); return m.length ? Math.max(0, Math.min(...m)) : 0; };
// safeToSpend() -> {safe, balance, unpaidBills, savingRule, groceries (protected amount still to be spent this month), pocket (held outside the balance, never counted)}
// safe = Junior balance - unpaid must-pay bills (less what the Bills pocket covers) - the saving rule not yet moved this month - groceries still protected
// analyst off (D10 fallback): the simpler estimate, balance minus the upcoming direct debits (the unpaid bills). Bills stay; the saving rule and the groceries are not read.
function safeToSpend(st = S){
  const now = billToday(st), bal = balanceOf(st), bf = billsFirst(st), pocket = st.billsPocket && st.billsPocket.on ? st.billsPocket.bal : 0, simple = !!(st.analyst && !st.analyst.on);
  let rule = 0; if(payOn(st) && !simple){ let moved = 0; st.tx.forEach(t => { if(txType(t) === 'own' && t.a < 0 && /^PERSELY DEPOSIT/.test(t.n) && txWhen(t, st).ym === now.ym) moved -= t.a; });
    rule = Math.max(0, Math.round(st.income.amount * payPct(st) / 100) - moved); }
  const groceries = simple ? 0 : Math.max(0, groceriesProtected(st) - groceriesOf(now.ym, st)), unpaid = Math.max(0, bf.total - pocket);
  return {safe:bal - unpaid - rule - groceries, balance:bal, unpaidBills:unpaid, savingRule:rule, groceries, pocket, simple};
}
