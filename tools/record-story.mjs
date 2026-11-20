// Records Anna's monthly story (the pitch backup) as a vertical H.264 MP4, frame by frame.
// Re-run:  1) start the app (npm start, default http://localhost:8090 or set APP_URL)
//          2) node tools/record-story.mjs            -> media/story-november.mp4
// Needs only what is already installed: the global @playwright/cli's playwright-core, a cached Playwright Chromium
// (~/Library/Caches/ms-playwright/chromium_headless_shell-*), and macOS AVFoundation via tools/encode-frames.swift. Nothing is downloaded.
// Env: APP_URL, PW_DIR (folder that contains node_modules/playwright), CHROME (browser executable), FRAMES (temp dir), DPR (default 3 = 1170x2532).
// State recorded: Reset (8 weeks later) -> analyst on with the split accepted (consent flow: Turn on, then Use this split) -> +1 month (key O, same as the demo) -> story from slide 1, relabelled November (display only, see below).
// The story's clock is stepped by 1/30 s per screenshot (manual mode); only the 3D Persi on slide 1 runs on real time.
// The story is Denis's Wrapped story from main (11 screens, about 41 s for the month after +1 month); the tool only uses window.__story (open, step, info), not slide ids.
// media/story-november.mp4 still holds the older analytics story until this tool is re-run.
import { createRequire } from 'module';
import { execFileSync } from 'child_process';
import { readdirSync, mkdirSync, rmSync, existsSync } from 'fs';
import { homedir } from 'os';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const APP = process.env.APP_URL || 'http://localhost:8090/';
const FPS = 30, DPR = +(process.env.DPR || 3), HOLD_SHARE = 2;   // seconds on the final share card
const pwDir = process.env.PW_DIR || join(homedir(), '.local/node/lib/node_modules/@playwright/cli/');
const { chromium } = createRequire(pwDir)('playwright');
const cache = join(homedir(), 'Library/Caches/ms-playwright');
const shell = readdirSync(cache).filter(d => d.startsWith('chromium_headless_shell-')).sort().pop();
const CHROME = process.env.CHROME || join(cache, shell, 'chrome-headless-shell-mac-arm64/chrome-headless-shell');
const FRAMES = process.env.FRAMES || join(root, 'media/.frames');
const OUT = join(root, 'media/story-november.mp4');

rmSync(FRAMES, { recursive: true, force: true }); mkdirSync(FRAMES, { recursive: true });
const browser = await chromium.launch({ executablePath: CHROME, args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: DPR, hasTouch: true, isMobile: true, serviceWorkers: 'block' });
const p = await ctx.newPage();
p.on('pageerror', e => console.log('page error:', e.message));
await p.goto(APP); await p.waitForTimeout(2500);
await p.evaluate(() => { S = fresh(); week8State(); S.billsConfirmed = true; sheet(SHEETS.analyst()); });   // billsConfirmed first: Use this split would otherwise open the Bills page
await p.waitForTimeout(400); await p.click('[data-anon]'); await p.waitForTimeout(800);        // consent: Turn on
await p.click('[data-anaccept]'); await p.waitForTimeout(800);                                  // then Use this split
await p.keyboard.press('o'); await p.waitForTimeout(6000);   // +1 month, reward sheet and toasts come one at a time
await p.evaluate(() => { closeSheet(); hideToast(true); if (window.__story.info().on) window.__story.close(); }); await p.waitForTimeout(1500);
await p.evaluate(() => { hideToast(true); });
await p.addStyleTag({ content: "[data-stshare],[data-stclose]{visibility:hidden!important} #story{margin:0!important}" });   // record mode: no Share/Close buttons on the share card; margin:0 removes a 6 px strip at the left edge (the story had margin-left 6px)
// Display only: the story reads the month just simulated (data month 2026-12). Show it as November: period label, and month names shifted back one.
await p.evaluate(() => { S.period = "November"; MONTHN.unshift(MONTHN.pop()); });
const info = await p.evaluate(() => window.__story.open(0, { pause: true, manual: true, record: true }));
console.log(`story: ${info.n} slides, ${info.total} s, period ${await p.evaluate(() => S.period)}`);

const dt = 1 / FPS, total = Math.round((info.total + HOLD_SHARE) * FPS);
for (let f = 0; f < total; f++) {
  await p.evaluate(() => hideToast(true));
  await p.screenshot({ path: join(FRAMES, `frame-${String(f).padStart(5, '0')}.jpg`), type: 'jpeg', quality: 95 });
  await p.evaluate(dt => window.__story.step(dt), dt);
  if (f % 150 === 0) console.log(`frame ${f}/${total}`);
}
await browser.close();
execFileSync('swift', [join(root, 'tools/encode-frames.swift'), FRAMES, OUT, String(FPS)], { stdio: 'inherit' });
rmSync(FRAMES, { recursive: true, force: true });
console.log('done', OUT);
