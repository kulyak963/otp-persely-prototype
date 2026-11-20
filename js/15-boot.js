/* ================= loading screen =================
   Shown on every start, then fades out. The status bar stays light (full-screen mode, see the head). */
let splashTimer;
function showSplash(ms=1300){
  const sp = $('#splash'), ph = $('#phone');
  clearTimeout(splashTimer);               // a new start cancels the old hide
  sp.style.visibility = ''; sp.classList.remove('hide'); ph.classList.add('splashing');
  splashTimer = setTimeout(()=>{
    sp.classList.add('hide'); ph.classList.remove('splashing');
    splashTimer = setTimeout(()=>{ sp.style.visibility = 'hidden'; }, 400);   // fully gone even if the fade did not run
  }, ms);
}
showSplash();
$('#splash').addEventListener('click', () => { clearTimeout(splashTimer); const sp = $('#splash'); sp.classList.add('hide'); $('#phone').classList.remove('splashing'); splashTimer = setTimeout(() => { sp.style.visibility = 'hidden'; }, 400); });   // a tap skips the splash

renderAll();
routeHash();
if('serviceWorker' in navigator && (location.protocol==='https:'||location.hostname==='localhost')) navigator.serviceWorker.register('sw.js').then(pushRefresh).catch(()=>{});
else pushInfo();
document.addEventListener('visibilitychange', ()=>{ if(!document.hidden) pushRefresh(); });
