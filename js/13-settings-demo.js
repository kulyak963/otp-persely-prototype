/* ================= Settings, inbox, Perks (Phase 6: D11, D12) ================= */
const NOTIF_TOGGLES = [   // [key, title, subtitle]; "streak" is the weekly reminder (S.remind)
  ['bills', 'Bills due', 'Late bills and bills coming up'], ['streak', 'Sunday streak reminder', 'Sunday 18:00, only if the week is still open'], ['payday', 'Payday', 'When your salary arrives'],
  ['story', 'Monthly story', 'When your month story is ready'], ['card', 'Card payments', 'Each card payment and your balance'], ['incoming', 'Incoming transfers', 'Money that arrives on your account']];
const notifOn = kind => !kind ? true : kind === 'streak' ? !!S.remind : S.notif[kind] !== false;
const hhmm = (d = new Date()) => String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
// quiet hours: from/to as HH:MM; the window may cross midnight
const quietAt = (t, from, to) => from === to ? false : from < to ? (t >= from && t < to) : (t >= from || t < to);
const inQuiet = (t = hhmm()) => !!S.notif.quiet && quietAt(t, S.notif.qfrom, S.notif.qto);
const inboxUnread = () => (S.inbox || []).filter(x => !x.read).length;
let INB_N = 0, VER_TAPS = 0;
function addInbox(n){   // every push and banner is kept: last 20, newest first
  const it = {id:Date.now() * 100 + (INB_N++ % 100), title:n.title, body:n.body, url:n.url, persi:!!n.persi, at:'Today, ' + hhmm(), read:false};
  S.inbox = [it].concat(S.inbox || []).slice(0, 20); save();
  try{ renderView('fooldal'); refreshPages(); }catch(e){}
  return it;
}
const NOTE_KIND_OFF = {card:'Card payments', incoming:'Incoming transfers', bills:'Bills due', payday:'Payday', story:'Monthly story', streak:'Sunday streak reminder'};
function inboxHTML(){
  const L = S.inbox || [];
  if(!L.length) return `<div class="card" style="text-align:center;color:var(--muted-t);padding:var(--sp-6)">Nothing yet. Money events and bill reminders will show here.</div>`;
  return `${inboxUnread() ? `<div style="text-align:right"><button class="link lnk44" data-inbread>Mark all as read</button></div>` : ''}
  <div class="card set-card">${L.map((n, i) => `<button class="inb ${n.read ? 'read' : ''}" data-inb="${i}"><span class="ic">${I(n.persi ? 'piggy' : 'bell', 22)}</span><span class="t"><b>${esc(n.title)}</b><span>${esc(n.body)}</span><small>${esc(n.at)}${n.read ? '' : ' · Unread'}</small></span>${n.read ? '' : '<i class="udot" aria-hidden="true"></i>'}</button>`).join('')}</div>`;
}
function openSettings(sec){
  const top = stack.length ? stack[stack.length - 1] : null;
  if(!top || top.dataset.id !== 'settings'){ while(stack.length) popPage(true); pushPage('settings'); }
  const el = stack[stack.length - 1]; if(!sec || !el) return;
  const t = el.querySelector(`[data-sec="${sec}"]`); if(!t) return;
  el.querySelectorAll('.set-sec.focus,.set-sub.focus').forEach(x => x.classList.remove('focus')); t.classList.add('focus');
  const sc = el.querySelector('.scroll'); if(sc) sc.scrollTop = Math.max(0, t.offsetTop - 8);
  try{ t.scrollIntoView({block:'start'}); }catch(e){}
}
function pushStatusBlock(){
  let status, action = '';
  if(PUSH.on){ status = `<span class="ok">${I('check',18)} On</span>`;
    action = `<button class="btn" data-pushtest>Send a test notification in 5 seconds</button>
      <p style="font-size:var(--fs-s);color:var(--muted-t);text-align:center;margin:var(--sp-3) 0 0">Tap it, then lock your phone. The notification shows up on the lock screen too.</p>`;
  } else if(PUSH.ios && !PUSH.standalone){ status = '<span class="badge">Not available</span>';
    action = `<div class="note"><b>To get notifications, add the app to your Home Screen:</b><br>1. Tap the Share button<br>2. Choose “Add to Home Screen”<br>3. Open the app from the icon and come back here.</div>`;
  } else if(!PUSH.supported){ status = '<span class="badge">Not supported</span>';
    action = `<div class="note">This browser doesn't support push notifications. On iPhone, open the link in Safari and add it to your Home Screen.</div>`;
  } else if(PUSH.perm === 'denied'){ status = '<span class="badge">Blocked</span>';
    action = `<div class="note">Notifications are blocked. Turn them on in iPhone Settings → Notifications → OTP demo.</div>`;
  } else { status = '<span class="badge" style="background:var(--fill);color:var(--muted-t)">Off</span>';
    action = `<button class="btn" data-pushon>Turn on notifications</button>`; }
  return `<div class="card u-p18"><div style="display:flex;align-items:center;justify-content:space-between;gap:var(--sp-3)"><b class="u-fs-m">Push notifications</b>${status}</div>
    <p style="margin:var(--sp-3) 0 0;font-size:var(--fs-s);color:var(--muted-t);line-height:1.5">${SIMPLE_PERSELY ? 'We tell you when you pay and when money comes in. We also tell you how you save.' : 'We let you know right away about card payments, incoming transfers and how your Persely is doing.'}</p></div>${action}`;
}
// Settings > Persely > Default saving rules for new goals: what the wizard's step 2 starts with. Existing goals keep their own rules
function ruleDefaultsHTML(srow){
  const dd = ruleDefaults(), ch = (attr, v, on, label, aria) => `<button class="chip ${on ? 'on' : ''}" ${attr}="${v}" aria-pressed="${on}"${aria ? ` aria-label="${aria}"` : ''}>${label}</button>`;
  return `<div class="set-sub" data-sec="ruledefaults"><div class="sec"><span>Default saving rules for new goals</span></div>
    <div class="card u-p18 rdef">
      <div class="flabel u-mt0">Payday rule</div><div class="chips eq u-m0" style="--n:5" role="group" aria-label="Payday rule for new goals">${[0, ...RULE_PCTS].map(x => ch('data-rdpct', x, dd.pct === x, x ? x + '%' : 'Off', x ? `${x}% of each salary` : 'Payday rule off')).join('')}</div>
      <div class="flabel">Weekly transfer</div><div class="chips eq u-m0" style="--n:5" role="group" aria-label="Weekly transfer for new goals">${[0, ...WK_AMTS].map(x => ch('data-rdwk', x, dd.wkAmt === x, x ? ft(x).replace(/\s*Ft$/, '') : 'Off', x ? `${ft(x)} a week` : 'Weekly transfer off')).join('')}</div>
      <div class="fine" style="margin-top:var(--sp-1)">Amounts in Ft, every week</div>
      <div class="flabel">Weekly transfer day</div><div class="chips eq u-m0" role="group" aria-label="Weekly transfer day for new goals">${WK_DAYS.map(([k, n]) => ch('data-rdday', k, dd.wkDay === k, n.slice(0, 3), n)).join('')}</div>
    </div>
    <div class="card set-card" style="margin-top:var(--sp-3)">${srow('piggy', 'Round-ups', 'A 1 190 Ft coffee moves 20 Ft; we double it', !!dd.rr, 'data-sw="rdrr"')}</div>
    <div class="fine" style="padding:var(--sp-2) var(--sp-1) 0">New goals start with these. Change them per goal on the goal page.</div></div>`;
}
function settingsHTML(){
  const n = S.notif, ch = `<span class="chev">${I('chev', 18)}</span>`;
  const row = (ic, title, sub, attr) => `<button class="set-row" ${attr}><span class="ic">${I(ic, 22)}</span><span class="t">${title}${sub ? `<small>${sub}</small>` : ''}</span>${ch}</button>`;
  const srow = (ic, title, sub, on, attr) => `<div class="set-row"><span class="ic">${I(ic, 22)}</span><span class="t">${title}${sub ? `<small>${sub}</small>` : ''}</span>${swBtn(on, attr, title)}</div>`;
  const junior = S.bridge ? `Keeping 3.0% until ${juniorEndLabel(12)}` : `Junior package until ${juniorEndLabel()}`;
  const quiet = n.quiet ? `<div class="qh"><label>From<input type="time" value="${n.qfrom}" data-qh="qfrom" aria-label="Quiet hours from"></label><label>To<input type="time" value="${n.qto}" data-qh="qto" aria-label="Quiet hours to"></label></div>
    <div class="fine" style="padding:0 var(--sp-4) var(--sp-3)">Between ${n.qfrom} and ${n.qto} notifications arrive silently. You can still read them in the inbox.</div>` : '';
  return `<div class="set-sec" data-sec="profile"><div class="sec"><span>Profile</span></div>
    <div class="card set-prof"><span class="avatar" aria-hidden="true">${esc(S.ini)}</span><span class="t"><b class="u-fs-m">${esc(S.name)}</b><div class="k">Junior account · ${esc((S.accounts.find(a => a.id === 'junior') || {}).no || '')}</div></span></div></div>
  <div class="set-sec" data-sec="persely"><div class="sec"><span>Persely</span></div>
    <div class="card set-card">${row('piggy', 'Saving rules', 'Each goal has its own. See them all', 'data-saverules=""')}
      ${srow('sched', 'Weekly reminder', 'Sunday 18:00, only if the week is still open', !!S.remind, 'data-sw="remind"')}
      ${srow('analyst', 'Financial analyst', S.analyst.on ? 'On. It reads your transactions for Safe to spend and bills' : 'Off. Safe to spend is a simpler estimate', S.analyst.on, 'data-sw="analyst"')}
      ${row('star', 'Junior status', junior + ' · Keep my 3.0%', 'data-go="grad"')}</div>
  ${ruleDefaultsHTML(srow)}</div>
  <div class="set-sec" data-sec="notif"><div class="sec"><span>Notifications</span></div>
    ${pushStatusBlock()}
    <div class="card set-card" style="margin-top:var(--sp-3)">${NOTIF_TOGGLES.map(([k, t, sub]) => srow(k === 'streak' ? 'piggy' : k === 'card' ? 'cards' : k === 'incoming' ? 'money' : k === 'payday' ? 'wallet' : k === 'story' ? 'star' : 'list', t, sub, notifOn(k), k === 'streak' ? 'data-sw="remind"' : `data-sw="n:${k}"`)).join('')}
      ${srow('bell', 'Quiet hours', n.quiet ? `Silent from ${n.qfrom} to ${n.qto}` : 'Off', !!n.quiet, 'data-sw="n:quiet"')}${quiet}</div></div>
  <div class="set-sec" data-sec="privacy"><div class="sec"><span>Privacy</span></div>
    <div class="card set-card">${row('lock', 'What the analyst reads', 'Payments, transfers and income on this OTP account', 'data-sheet="anread"')}</div></div>
  <div class="set-sec" data-sec="help"><div class="sec"><span>Help</span></div>
    <div class="card set-card">${row('info', 'How Persely works', '', 'data-sheet="how"')}${row('lock', 'What the analyst reads', '', 'data-sheet="anread"')}${row('help', 'Can we help?', '', 'data-demo="Can we help?"')}</div></div>
  <button class="link lnk44" data-ver style="display:block;margin:var(--sp-3) auto 0;color:var(--muted-t)">Persely prototype</button>`;
}
function perksHTML(){
  const seg = `<div class="seg" role="tablist" aria-label="Perks"><button role="tab" aria-selected="${perkTab === 0}" class="${perkTab === 0 ? 'on' : ''}" data-perktab="0">Discounts</button><button role="tab" aria-selected="${perkTab === 1}" class="${perkTab === 1 ? 'on' : ''}" data-perktab="1">My rewards${S.rewards.length ? ` (${S.rewards.length})` : ''}</button></div>`;
  if(perkTab === 0) return seg + DISC.map(d => { const on = S.disc.activated.includes(d.id);
    return `<button class="card disc" data-perk="${d.id}"><span class="t"><span class="u-rowc"><span class="lg" style="background:${d.bg};color:${d.c}">${d.lg}</span><b>${esc(d.n)}</b></span><p>${esc(d.t)}</p><small>${on ? 'Activated · ' : ''}Valid until 31 December 2026</small></span><span class="u-c-g">${on ? I('check', 22) : I('chev', 20)}</span></button>`; }).join('') + '<!-- CONFIRM WITH OTP: partners -->';
  if(!S.rewards.length) return seg + `<div class="card" style="text-align:center;color:var(--muted-t);padding:var(--sp-6)">Stay within your plan for a month and your first reward arrives.</div>`;
  return seg + S.rewards.map(r => `<div class="card pk-card"><div class="u-rowc"><span class="u-ico-g">${I('star', 26)}</span><span><b class="u-bk-m">${esc(r.title)}</b><span class="fine">${esc(rewardPartner(r))} · ${esc(r.note || '')}</span></span></div>
    <div class="k" style="margin-top:var(--sp-3)">How to use it</div><ol class="steps">${rewardSteps(r).map(x => `<li>${esc(x)}</li>`).join('')}</ol></div>`).join('');
}
/* the demo panel and the keys sit behind a flag: ?demo=1 in the address (remembered; ?demo=0 clears it) or five taps on "Persely prototype" at the bottom of Settings */
let DEMO_ON = (() => { try{ const q = new URLSearchParams(location.search).get('demo'); if(q === '1') localStorage.setItem('otp-demo', '1'); else if(q === '0') localStorage.removeItem('otp-demo'); return localStorage.getItem('otp-demo') === '1'; }catch(e){ return false; } })();
function setDemoMode(on){ DEMO_ON = !!on; try{ if(on) localStorage.setItem('otp-demo', '1'); else localStorage.removeItem('otp-demo'); }catch(e){} document.documentElement.classList.toggle('demo-on', DEMO_ON); }
document.documentElement.classList.toggle('demo-on', DEMO_ON);

/* ================= laptop demo: fake iOS notifications + lock screen =================
   Small panel left of the phone (laptop only). Keys: 1–7 send a notification, L locks/unlocks, H hides the panel. */
const DEMO = [
  {e:'💳', label:'Card payment',      title:'Card payment', kind:'card', url:'tranzakciok',   // the push is real: the card payment is booked and the balance moves (N6)
    fx:() => { acc('junior').v -= 5240; S.tx.unshift({...stamp(), d:'Today', n:'LIDL MAGYARORSZÁG', s:'Card payment', a:-5240, ic:'food'}); renderAll(); },
    body:() => `-5 240 Ft · LIDL MAGYARORSZÁG. Balance: ${ft(acc('junior').v)}`},
  {e:'💸', label:'Money received',    title:'Money received', kind:'incoming', url:'tranzakciok',
    fx:() => { acc('junior').v += 20000; S.tx.unshift({...stamp(), d:'Today', n:'NAGY PÉTER', s:'Instant transfer', a:20000, ic:'money'}); renderAll(); },
    body:() => `+20 000 Ft from NAGY PÉTER, instant transfer. Balance: ${ft(acc('junior').v)}`},
  {e:'🐷', label:'Week still open',   title:'Persi · Persely', persi:true, kind:'streak', body:()=>S.streak >= 1 ? `🔥 Your ${S.streak}-week streak ends Sunday. Drop in any amount and it keeps going.` : 'A new week is open. Drop in any amount and your streak starts.', url:'hub'},
  {e:'💚', label:'Interest paid',     title:'Persi · Persely', persi:true, body:()=>`Your Junior rate (3.0% on the first 500 000 Ft) paid ${ft(Math.max(130, Math.round(Math.min(total(),CAP)*RATE/100/12*(1-TAX))))} this month, after tax.`, url:'hub'},
  {e:'👯', label:'Friend saved too',  title:'Persi · Persely', persi:true, body:()=>{ const f = realFriends()[0]; return f ? `${f} saved 5 000 Ft this week. Your turn?` : null; }, none:'You have no friends in Persely yet. Add one first.', url:'hub'},   // real friends only
  {e:'🎓', label:'Junior ends',       title:'Persi · Persely', persi:true, body:()=>`Your Junior package ends on ${juniorEndLabel()}. Get your salary paid to OTP and keep my 3.0% on the first 500 000 Ft for 12 more months.`, url:'grad'},
  {e:'📊', label:'Monthly story',     title:'Persi · Persely', persi:true, kind:'story', body:()=>`Your ${S.period} story is ready. Take a look.`, url:'story'},
  {e:'🏷️', label:'New discount',      title:'New discount',            body:'15% instant discount at Pizzeria Roma. Activate it now!', url:'perks'},
  {e:'🧾', label:'Bills first',       title:'Persi · Persely', persi:true, kind:'bills', body:()=>{ const bf = billsFirst(); return bf.on ? `${bf.text}.${stsNow()}` : bf.total ? `Nothing is late.${stsNow() || ' Your bills are on track.'}` : 'All your must-pay bills are paid. Fun is back on.'; }, url:'hub'}
];
// Safe to spend wording only with the analyst on
const stsNow = () => S.analyst.on ? ` Safe to spend is now ${ft(safeToSpend().safe)}.` : '';
// friends that really exist: the Friends list once it is on, and members of a shared Persely
const realFriends = () => (S.friendsOptIn ? (S.friends || []).map(f => f.n) : []).concat((S.goals || []).filter(g => g.shared).flatMap(g => (g.members || []).filter(m => !m.me).map(m => m.n))).filter(Boolean);
const demo = { delay:0, sound:true, phone:false, locked:false, hidden:false };
let audioCtx;
function chime(){
  if(!demo.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const t = audioCtx.currentTime;
    [[1318,0],[1760,.11]].forEach(([f,d])=>{
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, t+d); g.gain.linearRampToValueAtTime(.18, t+d+.01); g.gain.exponentialRampToValueAtTime(.001, t+d+.35);
      o.connect(g).connect(audioCtx.destination); o.start(t+d); o.stop(t+d+.4);
    });
  }catch(e){}
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const noteHTML = n => `<img src="${n.persi && pig3d ? pig3d.snapshot() : 'icon-180.png'}" class="${n.persi ? 'persi-av' : ''}" alt=""><div class="nb"><div class="nh"><b>${esc(n.title)}</b><small>now</small></div><p>${esc(n.body)}</p></div>`;
function openFromNote(url){
  unlockPhone();
  if(url === 'story'){ tab('hub'); openStory(); return; }
  if(url === 'payday'){ tab('hub'); mqDrop('payday'); if(payOn() || paydayBills()) sheet(SHEETS.payday()); return; }
  if(url === 'grad'){ tab('hub'); pushPage('grad'); return; }
  if(TABS.some(t=>t[0]===url)) tab(url); else if(PAGES[url]){ tab('fooldal'); pushPage(url); }
}
let bannerTimer; const BANNER_MS = 6500;   // a banner stays at least 6 s or until it is tapped
function hideBanners(){ clearTimeout(bannerTimer); document.querySelectorAll('.nbanner').forEach(b=>b.remove()); MQ.banner = false; }
function showBanner(n){
  document.querySelectorAll('.nbanner').forEach(b=>b.remove());
  hideToast(true); MQ.banner = true;   // while the banner shows, sheets and toasts wait
  const b = document.createElement('div'); b.className = 'nbanner'; b.innerHTML = noteHTML(n);
  const lv = $('#nlive'); if(lv){ lv.textContent = ''; setTimeout(() => { lv.textContent = `${n.title}. ${n.body}`; }, 60); }   // announced through the live region
  b.addEventListener('click', ()=>{ markRead(n.id); hideBanners(); openFromNote(n.url); setTimeout(mqPump, 300); });
  $('#phone').appendChild(b);
  b.getBoundingClientRect();                 // let the start position apply, then slide in
  setTimeout(()=>b.classList.add('in'), 20);
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(()=>{ b.classList.remove('in'); setTimeout(()=>{ if(!b.isConnected) return; b.remove(); MQ.banner = false; mqPump(); }, 500); }, BANNER_MS);   // the next sheet or toast waits until the banner has slid away
}
function markRead(id){ const it = (S.inbox || []).find(x => x.id === id); if(it && !it.read){ it.read = true; save(); try{ renderView('fooldal'); refreshPages(); }catch(e){} } }
function addLockCard(n){
  const c = document.createElement('div'); c.className = 'lcard'; c.innerHTML = noteHTML(n);
  c.addEventListener('click', e=>{ e.stopPropagation(); markRead(n.id); openFromNote(n.url); });
  $('#lockNotes').prepend(c);
}
function lockClock(){
  const d = new Date();
  $('#lockTime').textContent = d.getHours() + ':' + String(d.getMinutes()).padStart(2,'0');
  $('#lockDate').textContent = d.toLocaleDateString('en-GB',{weekday:'long', day:'numeric', month:'long'});
}
function lockPhone(){
  closeSheet(); lockClock(); $('#lockNotes').innerHTML = '';
  hideBanners();
  const l = $('#lock'); l.classList.remove('out'); l.classList.add('on'); $('#phone').classList.add('locked');
  demo.locked = true; renderDemoPanel();
}
function unlockPhone(){
  if(!demo.locked) return;
  const l = $('#lock'); l.classList.add('out'); $('#phone').classList.remove('locked');
  setTimeout(()=>{ l.classList.remove('on','out'); }, 350);
  demo.locked = false; renderDemoPanel(); setTimeout(mqPump, 400);
}
$('#lock').addEventListener('click', unlockPhone);
setInterval(()=>{ if(demo.locked) lockClock(); }, 15000);

function sendDemo(i){
  const d = DEMO[i]; if(!d) return;
  const go = () => {
    if(d.fx) d.fx();   // the money event really happens (balance, Transactions) whether or not the push is switched on
    const body = typeof d.body === 'function' ? d.body() : d.body;
    if(body === null){ toast(d.none || 'Nothing to show right now'); return; }
    if(!notify({...d, body})) toast(`${NOTE_KIND_OFF[d.kind]} notifications are off. Turn them on in Settings.`);
  };
  if(demo.delay) setTimeout(go, demo.delay*1000); else go();
}
// presenter key for the hosted version: open the app once as …/?key=YOUR_ADMIN_KEY on the laptop, it is remembered
const ADMIN_KEY = (() => { try{ const k = new URLSearchParams(location.search).get('key'); if(k) localStorage.setItem('otp-admin-key', k); return k || localStorage.getItem('otp-admin-key') || ''; }catch(e){ return ''; } })();
function realPush(n){
  fetch('api/push',{method:'POST',headers:{'content-type':'application/json', ...(ADMIN_KEY ? {'x-admin-key':ADMIN_KEY} : {})},body:JSON.stringify({title:n.title, body:n.body, url:'./#'+n.url})})
    .then(r => { if(r.status === 403) toast('Real push needs the presenter key: open the app as ?key=…'); }).catch(()=>{});
}
// a notification from the demo (banner or lock screen, optionally a real push to the iPhone)
function notify(n){
  if(!notifOn(n.kind)) return false;   // switched off in Settings > Notifications: nothing is sent and nothing is listed
  n.id = addInbox(n).id;               // every push is kept in the inbox
  if(inQuiet()) return true;           // quiet hours: it arrives silently
  if(demo.locked) addLockCard(n); else showBanner(n);
  chime();
  if(demo.phone) realPush(n);
  return true;
}
// salary arrives: the payday rule asks first (or moves automatically if the user chose that)
function salaryArrives(){
  const inc = S.income.amount; acc('junior').v += inc;
  S.tx.unshift({...stamp(), d:'Today', n:'SALARY', s:'Incoming transfer', a:inc, ic:'money'});
  if(keepSalary()) setTimeout(() => notify({title:'Persely', persi:true, body:`Your first salary is at OTP. You are now Graduate 3.0% on the first ${ft(CAP)} until ${juniorEndLabel(12)}.`, url:'grad'}), 4500);
  const g = ruleGoal(), share = paydayAlloc().total, many = payGoals().length > 1;
  if((payOn() && S.payday.ask) || paydayBills()){   // with bills open the sheet is "Bills first": salary, bills, saving rule, left for Fun
    renderAll();
    const bfv = paydayBills(), ps = payOn() && S.payday.ask;
    notify({title:'Persi · Persely', persi:true, body: bfv ? `Salary's in: +${ft(inc)}. ${ft(billsFirst().total)} of bills still to pay.${ps ? ' Then Persely.' : ''}` : `Salary's in: +${ft(inc)}. Move ${ft(share)} to ${many ? 'your goals' : g.name}?`, url:'payday', kind:'payday'});
    if(!demo.locked){ tab('hub'); qSheet(() => SHEETS.payday(), 'payday'); }   // after the banner
    return;
  }
  let body = `+${ft(inc)} arrived on your Junior account.`, persi = false;
  if(payOn()){   // automatic: every goal its own %, the 20 000 Ft floor on the total
    const A = paydayAlloc(); let counted = false; A.rows.forEach(r => { if(r.v > 0) counted = depositTo(r.g, r.v, 'junior', `Payday rule: ${r.pct}%`) || counted; });
    if(A.total > 0){ const to = A.rows.filter(r => r.v > 0); body = `Salary's in: +${ft(inc)}. I moved ${to.length > 1 ? to.map(r => `${ft(r.v)} to ${r.g.name}`).join(' and ') : `${ft(A.total)} to ${to[0].g.name}`}.${counted ? ' This week is done.' : ''}`; persi = true; }
  }
  renderAll();
  notify({title: persi ? 'Persi · Persely' : 'Salary arrived', body, url:'hub', persi, kind:'payday'});
}
// card purchase: a 1 190 Ft coffee, the round-up (×2) goes to its Persely
function coffee(){
  unlockPhone(); acc('junior').v -= 1190; S.tx.unshift({...stamp(), d:'Today', n:'ESPRESSO BAR', s:'Card payment', a:-1190, ic:'food'});
  if(rrGoals().length){   // the coin is split equally between the goals with round-ups on
    const r = ((100 - 1190 % 100) % 100) * 2, parts = roundupAlloc(r).filter(x => x.v > 0); let counted = false;
    parts.forEach(x => { counted = depositTo(x.g, x.v, 'junior', 'Round-up ×2') || counted; }); S.roundCount++; S.roundSum += r; renderAll();
    toast(`Coffee 1 190 Ft. Round-up ${ft(r)} → ${parts.map(x => parts.length > 1 ? `${ft(x.v)} ${x.g.name}` : x.g.name).join(', ')}.${counted ? ` 🔥 ${S.streak}-week streak` : ''}`);
  } else { renderAll(); toast('Coffee 1 190 Ft paid. Turn on round-ups to save the change'); }
  billsPush(2600);
}
// one push a day at most (never at night) after a Fun card payment while a bill is open: "Bills first: X Ft still to pay. Safe to spend is now Y Ft."
function billsPush(delay){
  const bf = bfNow(), day = billToday().ym + '-' + billToday().day; if(!bf.on || S.bfPush === day) return; S.bfPush = day; save();
  setTimeout(() => notify({title:'Persi · Persely', persi:true, body:`${bf.text}.${stsNow()}`, url:'hub', kind:'bills'}), delay || 0);
}
// demo key B: this month's rent is not paid. The analyst goes on if it was off; the bills-first card, the Fun hold-off, Persi and a push appear. Pay now clears it.
function billMissed(){
  unlockPhone(); closeSheet(); closeOnb(); closeWhatsNew(); while(stack.length) popPage(true);
  if(!S.analyst.on){ S.analyst.on = true; if(!S.analyst.accepted){ const sg = suggestSplit(); S.analyst.split = {must:sg.must, ess:sg.ess, fun:sg.fun, save:sg.save}; S.analyst.accepted = true; mainPayOn(); } }
  const now = billToday(), b = mustBills().find(x => x.cat === 'housing') || mustBills()[0]; if(!b) return;
  const i = S.tx.findIndex(t => t.a < 0 && payeeKey(t) === b.key && txWhen(t).ym === now.ym);
  if(i >= 0){ const t = S.tx.splice(i, 1)[0]; if(t.note === 'Paid from Bills pocket') S.billsPocket.bal += -t.a; else acc('junior').v += -t.a; }   // the rent was not sent: the money is still here
  delete S.billSkip[b.id]; S.bfDone = false; S.bfPush = now.ym + '-' + now.day; renderAll(); tab('fooldal');
  notify({title:'Persi · Persely', persi:true, body:`${billsFirst().text}.${stsNow()}`, url:'hub', kind:'bills'});
}
// a friend joins the shared Persely
function doriJoins(){
  unlockPhone();
  const g = S.goals.find(x => x.shared);
  if(!g){ toast('Create a shared Persely first: Persely → New → Shared Persely'); return; }
  if(g.members.some(m => m.n === 'Dóri')){ toast('Dóri has already joined'); return; }
  g.members.push({n:'Dóri', amt:15000, c:PALETTE.blueT}); S.friendsOptIn = true; renderAll();   // a friend joined a shared Persely: Friends turns on
  notify({title:'Persi · Persely', persi:true, body:`Dóri joined ${g.name} and added 15 000 Ft. Together: ${ft(gSaved(g))}.`, url:'hub'});
  tab('hub'); S._detail = g.id; pushPage('goal');
}
// end of the autumn semester: two months pass, then the semester story opens
// demo key M: jump to month end (the story is ready), then play it. The story is not offered before month end otherwise (C3.1).
function demoStory(){ unlockPhone(); S.monthEnd = true; renderAll(); tab('hub'); openStory(); }
function endSemester(){
  unlockPhone(); closeSheet();
  monthStep(true); monthStep(true);
  S.period = 'Autumn semester'; S.storySeen = false; S.monthEnd = true; renderAll(); tab('hub'); openStory();
}
// graduation / the Junior package ends: the bridge offer
function graduation(){ unlockPhone(); closeSheet(); S.juniorDays = 0; renderAll(); tab('hub'); pushPage('grad'); }
// replay the launch: Face ID, splash, then Home (no pop-up)
function demoUpdateDay(){ demoStart(); }   // U: the presentation start (Face ID, splash, Home), from the new-user seed
