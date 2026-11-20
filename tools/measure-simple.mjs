// Simple Persely measure script (plan docs/simple-persely-plan.md section 1 and 3): words, numbers, controls and scroll height per screen.
// Run:  node tools/measure-simple.mjs                      -> measures dist/otp-persely-demo.html (run node tools/build-standalone.mjs first)
//       APP_URL=http://localhost:8090/ node tools/measure-simple.mjs   -> measures the served app
//       SIMPLE=0 node tools/measure-simple.mjs              -> the same with ?simple=0 (the pre-Simple first run), for a before/after table
// Uses what tools/record-story.mjs uses: the global @playwright/cli's playwright and the cached headless Chromium shell (nothing is downloaded).
// Viewport 390 x 844, deviceScaleFactor 2, service workers blocked, fresh localStorage. Both seeds (new user, existing user).
// Rules (same as the in-app chk-simple-first-run-words): only visible text (visually hidden and aria-hidden text is skipped);
//   a "word" is a token with a letter; amounts ("1 000 Ft"), percentages and the digits of dates are numbers, not words;
//   "numbers" are digit groups; "controls" are visible buttons, links, inputs and switches outside the tab bar;
//   "scroll" is the scroll height of the screen's own scroll area (tab view, #onb body, reward card).
// Taps to the first saved forint cannot be fully measured by a script (people scroll and hesitate); the script clicks the 3-tap path
// (Home card -> Trip -> Save 1 000 Ft now) and prints the taps it needed and the time from the 3rd tap to the reward (SP.last.ms).
// Last line: window.__checkAnalytics() on the same page ({passed}/{total}), so the standalone build is checked too.
import { createRequire } from 'module';
import { readdirSync, existsSync } from 'fs';
import { homedir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const simple = process.env.SIMPLE === '0' ? '0' : '1';
const dist = join(root, 'dist/otp-persely-demo.html');
const base = process.env.APP_URL || (existsSync(dist) ? pathToFileURL(dist).href : 'http://localhost:8090/');
const APP = base + (base.includes('?') ? '&' : '?') + 'simple=' + simple;
const pwDir = process.env.PW_DIR || join(homedir(), '.local/node/lib/node_modules/@playwright/cli/');
const { chromium } = createRequire(pwDir)('playwright');
const cache = join(homedir(), 'Library/Caches/ms-playwright');
const shell = readdirSync(cache).filter(d => d.startsWith('chromium_headless_shell-')).sort().pop();
const CHROME = process.env.CHROME || join(cache, shell, 'chrome-headless-shell-mac-arm64/chrome-headless-shell');

const browser = await chromium.launch({ executablePath: CHROME, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
const p = await ctx.newPage();
p.on('pageerror', e => console.log('page error:', e.message));
await p.goto(APP); await p.waitForTimeout(2000);

// the measuring function runs in the page; sel is the root of one screen
const measure = (label, sel) => p.evaluate(([label, sel]) => {
  const el = document.querySelector(sel); if(!el) return {label, missing:true};
  const out = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n;
  while((n = w.nextNode())){ const pe = n.parentElement; if(!pe || pe.closest('.vhid,[aria-hidden="true"],script,style,.tabbar')) continue; const r = pe.getBoundingClientRect(); if(!r.width && !r.height) continue; out.push(n.nodeValue); }
  const t = out.join(' ').replace(/\s+/g, ' ');
  const words = t.replace(/\d[\d\s.,]*\s?(Ft|%|€)/g, ' # ').replace(/\d[\d\s.,]*/g, ' # ').split(' ').filter(x => /[A-Za-z]/.test(x)).length;
  const numbers = (t.match(/\d[\d\s.,]*\d|\d/g) || []).length;
  const controls = [...el.querySelectorAll('button,a,input,[role="switch"]')].filter(b => !b.closest('.tabbar') && b.getBoundingClientRect().height > 0).length;
  const sc = el.querySelector('.onb-body') || el;
  return {label, words, numbers, controls, scroll:Math.round(sc.scrollHeight)};
}, [label, sel]);

const rows = [];
for(const kind of ['new', 'existing']){
  await p.evaluate(k => { localStorage.clear(); S = fresh(k); renderAll(); tab('fooldal'); }, kind); await p.waitForTimeout(300);
  rows.push(await measure(`${kind}: Home`, '#v-fooldal'));
  await p.evaluate(() => tab('hub')); await p.waitForTimeout(300);
  rows.push(await measure(`${kind}: Persely tab`, '#v-hub'));
}
// first run: confirm screen, then the 3-tap path from the Home card
await p.evaluate(() => { S = fresh('new'); renderAll(); tab('fooldal'); });
let taps = 0, ms = null, path = 'n/a';
if(simple === '1'){
  if(await p.$('#v-fooldal .sphome')){ await p.click('#v-fooldal .sphome'); taps++; }
  if(await p.$('#v-hub [data-tilepick="travel"]')){ await p.click('#v-hub [data-tilepick="travel"]'); taps++; }
  await p.waitForTimeout(300); rows.push(await measure('new: confirm screen (Trip)', '#onb'));
  if(await p.$('#onb [data-spsave]')){ await p.click('#onb [data-spsave]'); taps++; }
  await p.waitForTimeout(400); rows.push(await measure('new: reward', '#sprw .sprw-card'));
  const r = await p.evaluate(() => ({ms:SP.last && SP.last.ms, saved:total(), streak:S.streak}));
  ms = r.ms; path = `${taps} taps, reward after ${ms} ms, saved ${r.saved} Ft, week ${r.streak}`;
  await p.evaluate(() => { spHideReward(true); hideChip(true); }); await p.waitForTimeout(300);
  rows.push(await measure('new: Persely tab after the deposit', '#v-hub'));
}
// the in-app self-checks on the same page (all must pass; ?simple=0 runs the pre-Simple set)
const chk = await p.evaluate(() => { localStorage.clear(); S = fresh(); renderAll(); tab('fooldal'); const r = __checkAnalytics(); return {passed:r.passed, total:r.total, failed:r.failed.map(f => f.name.slice(0, 70))}; });
await browser.close();

const pad = (s, n) => String(s).padEnd(n), lp = (s, n) => String(s).padStart(n);
console.log(`Simple Persely measure · ${APP} · 390x844`);
console.log(pad('screen', 36) + lp('words', 7) + lp('numbers', 9) + lp('controls', 10) + lp('scroll px', 11));
rows.forEach(r => console.log(r.missing ? pad(r.label, 36) + '  (not on screen)' : pad(r.label, 36) + lp(r.words, 7) + lp(r.numbers, 9) + lp(r.controls, 10) + lp(r.scroll, 11)));
console.log('3-tap path (Home card -> Trip -> Save 1 000 Ft now): ' + path);
console.log(`self-checks: ${chk.passed}/${chk.total}${chk.failed.length ? ' FAILED: ' + chk.failed.join(' | ') : ''}`);
