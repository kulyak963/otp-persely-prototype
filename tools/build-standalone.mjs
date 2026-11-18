// Builds ONE self-contained, offline HTML file of the prototype (no server, no network):
//   node tools/build-standalone.mjs        -> dist/otp-persely-demo.html
// Open it by double-click (file://) or host it on any static host. Plain Node, no dependencies.
// What it does (on a copy; index.html is never modified):
//   - inlines three.min.js as an inline <script>, and icon-180.png / splash-logo-green.png as data: URIs
//   - drops the web manifest, the iOS splash image and the Google Fonts links (system font stack is used, see --font)
//   - sets window.__STANDALONE = true and switches off the server-backed parts: service worker registration,
//     push subscribe/test (/api/*), "Also send to iPhone" (button hidden, realPush is a no-op).
//     In-page banners, lock-screen cards, the demo panel and the iPhone frame work as before.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const rd = f => readFileSync(join(root, f));
const dataUri = (f, mime = 'image/png') => `data:${mime};base64,${rd(f).toString('base64')}`;
let html = rd('index.html').toString('utf8');

// replace exactly one (or `n`) occurrence(s), fail loudly when index.html changed and the pattern vanished
function sub(find, repl, n = 1) {
  const parts = html.split(find);
  if (parts.length - 1 !== n) throw new Error(`build-standalone: expected ${n} match(es), found ${parts.length - 1} for: ${find.slice(0, 80)}`);
  html = parts.join(repl);   // split/join: no "$&" replacement-pattern surprises
}

// 1) head: no manifest, no splash image, no external fonts; icon as data URI; flag first
sub('<link rel="manifest" href="manifest.webmanifest">\n', '');
html = html.replace(/<link rel="apple-touch-startup-image"[^>]*>\n/, '');
html = html.replace(/<link rel="preconnect"[^>]*>\n/g, '');
html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com[^>]*>\n/, '');
sub('<link rel="apple-touch-icon" href="icon-180.png">', `<link rel="apple-touch-icon" href="${dataUri('icon-180.png')}">`);
sub('<style>', '<script>window.__STANDALONE = true;</script>\n<style>');

// 2) images in markup / JS strings
sub('src="splash-logo-green.png"', `src="${dataUri('splash-logo-green.png')}"`);
sub("'icon-180.png'", `'${dataUri('icon-180.png')}'`);

// 3) three.js inline ("</script" inside the library must not end the tag)
const three = rd('three.min.js').toString('utf8').replace(/<\/script/gi, '<\\/script');
html = html.replace('<script src="three.min.js"></script>', () => `<script>${three}</script>`);

// 4) standalone guards (string replacements on the copy)
sub("PUSH.supported = 'serviceWorker' in navigator", "PUSH.supported = !window.__STANDALONE && 'serviceWorker' in navigator");
sub("if('serviceWorker' in navigator && (location.protocol==='https:'", "if(!window.__STANDALONE && 'serviceWorker' in navigator && (location.protocol==='https:'");
sub('function realPush(n){', 'function realPush(n){ if(window.__STANDALONE) return;');
html = html.replace(/    <button data-dphone[^\n]*\n/, () => '');   // "Also send to iPhone" needs the server
if (html.includes('data-dphone class')) throw new Error('build-standalone: dphone button still present');
sub("This browser doesn't support push notifications. On iPhone, open the link in Safari and add it to your Home Screen.",
    'Real push notifications are switched off in this offline demo file. In-app banners and lock-screen notifications still work.');

// 5) leftover local references would break offline: fail the build
const left = [...html.matchAll(/(?:src|href)="(?!data:|#)([^"]+)"|fetch\('([^']+)'|serviceWorker\.register\('([^']+)'/g)].map(m => m[1] || m[2] || m[3]);
const guarded = left.filter(x => !/^api\//.test(x) && x !== 'sw.js' && !x.startsWith('${') && !x.startsWith('data:'));   // api/* and sw.js are only reachable when not standalone
if (guarded.length) throw new Error('build-standalone: unresolved references: ' + guarded.map(x => x.slice(0, 60)).join(', '));

mkdirSync(join(root, 'dist'), { recursive: true });
const out = join(root, 'dist/otp-persely-demo.html');
writeFileSync(out, html);
console.log(`wrote ${out} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`);
