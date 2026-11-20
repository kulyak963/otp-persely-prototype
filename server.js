// Small demo server: serves the app and sends push notifications to the iPhone.
// Run:  node server.js     then open http://localhost:8090 (app) and http://localhost:8090/push.html (presenter panel)
const http = require('http');
const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

const ROOT = __dirname;
const PORT = process.env.PORT || 8090;
const DATA = path.join(ROOT, 'data');
fs.mkdirSync(DATA, { recursive: true });

// Keys that prove the pushes come from this server.
// On a host (Render): set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in its settings so they never change.
// Locally: created once in data/vapid.json, then reused. Never commit that file.
const VAPID_FILE = path.join(DATA, 'vapid.json');
let vapid;
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  vapid = { publicKey: process.env.VAPID_PUBLIC_KEY, privateKey: process.env.VAPID_PRIVATE_KEY };
} else {
  try { vapid = JSON.parse(fs.readFileSync(VAPID_FILE, 'utf8')); }
  catch { vapid = webpush.generateVAPIDKeys(); fs.writeFileSync(VAPID_FILE, JSON.stringify(vapid, null, 2)); }
}
webpush.setVapidDetails('mailto:team3-demo@example.com', vapid.publicKey, vapid.privateKey);

// Phones that turned notifications on.
const SUBS_FILE = path.join(DATA, 'subs.json');
let subs = [];
try { subs = JSON.parse(fs.readFileSync(SUBS_FILE, 'utf8')); } catch {}
const saveSubs = () => fs.writeFileSync(SUBS_FILE, JSON.stringify(subs, null, 2));

// Only these files are public. Keys in /data are never served.
const PUBLIC = {
  '/': 'index.html', '/index.html': 'index.html',
  '/guide.html': 'prototype-guide.html', '/demo-script.html': 'demo-script.html',
  '/sw.js': 'sw.js', '/manifest.webmanifest': 'manifest.webmanifest',
  '/icon-180.png': 'icon-180.png', '/icon-512.png': 'icon-512.png',
  '/splash-1320x2868.png': 'splash-1320x2868.png', '/splash-logo.png': 'splash-logo.png',
  '/splash-light-1320x2868.png': 'splash-light-1320x2868.png', '/splash-logo-green.png': 'splash-logo-green.png',
  '/three.min.js': 'three.min.js',
  '/css/app.css': 'css/app.css',
  ...Object.fromEntries(fs.readdirSync(path.join(__dirname, 'js')).filter(f => f.endsWith('.js')).map(f => ['/js/' + f, 'js/' + f]))
};
const LOCAL_ONLY = { '/push.html': 'push.html' };
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.css': 'text/css; charset=utf-8' };

// Requests through the internet tunnel carry this header; the presenter panel stays local.
const isLocal = req => !req.headers['cf-connecting-ip'] && ['127.0.0.1', '::1', '::ffff:127.0.0.1'].includes(req.socket.remoteAddress);
// On a host there is no "this laptop": the presenter panel then needs the ADMIN_KEY (as ?key=… or the x-admin-key header).
const ADMIN_KEY = process.env.ADMIN_KEY || '';
const isAdmin = (req, url) => isLocal(req) || (ADMIN_KEY.length >= 8 && (url.searchParams.get('key') === ADMIN_KEY || req.headers['x-admin-key'] === ADMIN_KEY));

function readBody(req) {
  return new Promise(resolve => {
    let d = '';
    req.on('data', c => { d += c; if (d.length > 100000) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(d || '{}')); } catch { resolve({}); } });
  });
}
const json = (res, code, obj) => { res.writeHead(code, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(obj)); };

async function sendTo(list, msg) {
  const payload = JSON.stringify(msg);
  let ok = 0; const gone = []; const errors = [];
  await Promise.all(list.map(s => webpush.sendNotification(s, payload, { TTL: 600, urgency: 'high' })
    .then(() => { ok++; })
    .catch(e => {
      if (e.statusCode === 404 || e.statusCode === 410) gone.push(s.endpoint);
      errors.push(`${e.statusCode || ''} ${e.body || e.message}`.trim());
    })));
  if (gone.length) { subs = subs.filter(s => !gone.includes(s.endpoint)); saveSubs(); }
  if (errors.length) console.log('push errors:', errors);
  return { sent: ok, failed: list.length - ok, errors };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const p = url.pathname;

  if (p === '/api/vapid') return json(res, 200, { publicKey: vapid.publicKey });

  if (p === '/api/subscribe' && req.method === 'POST') {
    const s = await readBody(req);
    if (!s.endpoint || !s.keys) return json(res, 400, { error: 'bad subscription' });
    subs = subs.filter(x => x.endpoint !== s.endpoint);
    subs.push({ endpoint: s.endpoint, keys: s.keys, added: new Date().toISOString(), ua: String(req.headers['user-agent'] || '').slice(0, 120) });
    saveSubs();
    console.log('phone subscribed, total:', subs.length);
    return json(res, 200, { ok: true, total: subs.length });
  }

  // The phone asks for a test push to itself (a fixed message, after a short delay).
  if (p === '/api/test' && req.method === 'POST') {
    const b = await readBody(req);
    const s = subs.find(x => x.endpoint === b.endpoint);
    if (!s) return json(res, 404, { error: 'not subscribed' });
    const delay = Math.min(30, Math.max(0, Number(b.delay) || 0));
    setTimeout(() => sendTo([s], { title: 'OTP demo', body: 'Test notification: push notifications work ✓', url: './#ertesitesek', tag: 'test' }), delay * 1000);
    return json(res, 200, { ok: true, delay });
  }

  // Presenter panel actions (only from this computer).
  if (p === '/api/subs') { if (!isAdmin(req, url)) return json(res, 403, {}); return json(res, 200, { total: subs.length, list: subs.map(s => ({ added: s.added, ua: s.ua })) }); }
  if (p === '/api/push' && req.method === 'POST') {
    if (!isAdmin(req, url)) return json(res, 403, { error: 'presenter only' });
    const b = await readBody(req);
    const msg = { title: String(b.title || 'OTP demo').slice(0, 80), body: String(b.body || '').slice(0, 240), url: b.url || './', tag: b.tag };
    const delay = Math.min(60, Math.max(0, Number(b.delay) || 0));
    if (delay) { setTimeout(() => sendTo(subs, msg), delay * 1000); return json(res, 200, { scheduled: true, delay, total: subs.length }); }
    return json(res, 200, await sendTo(subs, msg));
  }
  if (p === '/api/clear' && req.method === 'POST') { if (!isAdmin(req, url)) return json(res, 403, {}); subs = []; saveSubs(); return json(res, 200, { ok: true }); }

  const file = PUBLIC[p] || (isAdmin(req, url) && LOCAL_ONLY[p]);
  if (!file) { res.writeHead(404); return res.end('Not found'); }
  fs.readFile(path.join(ROOT, file), (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-cache', 'x-robots-tag': 'noindex' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Demo app:        http://localhost:${PORT}`);
  console.log(`Presenter panel: http://localhost:${PORT}/push.html`);
  console.log(`Phones subscribed: ${subs.length}`);
});
