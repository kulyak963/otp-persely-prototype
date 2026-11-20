/* ================= colour palette: read ONCE from the CSS tokens in :root (single source of truth, see docs/palette.md) =================
   JS never types a colour: SVG attributes, the 3D pig, canvas-like tables and inline styles that need a real hex value use PALETTE;
   inline styles that can take var(--token) use the token. mixHex() derives tints and shades from a token (story backgrounds, Persi's details). */
const PALETTE = (() => {
  const cs = getComputedStyle(document.documentElement), o = {};
  ['white','bg','fill','line','line-2','muted','muted-t','ink2','ink','green','green-i','act','act-d','green-dk','green-lt','green-l',
   'orange','orange-lt','orange-l','orange-t','blue','blue-i','blue-t','blue-l','yellow','yellow-t','yellow-l','red','red-t','red-l',
   'c-blue','c-cyan','c-violet','c-mint','c-coral','c-pink','c-yellow','c-orange','c-slate']
    .forEach(k => { o[k.replace(/-(\w)/g, (m, c) => c.toUpperCase())] = cs.getPropertyValue('--' + k).trim().toUpperCase(); });
  return Object.freeze(o);
})();
// mix a #RRGGBB token towards white (k > 0) or black (k < 0); k = 0.3 is 30% of the way. Returns #RRGGBB.
const mixHex = (hex, k) => { const n = parseInt(hex.slice(1), 16), t = k > 0 ? 255 : 0, a = Math.abs(k);
  return '#' + [16, 8, 0].map(sh => Math.round(((n >> sh) & 255) * (1 - a) + t * a).toString(16).padStart(2, '0')).join('').toUpperCase(); };
const hexInt = hex => parseInt(hex.slice(1), 16);   // for three.js materials and lights
const rgbaHex = (hex, a) => { const n = hexInt(hex); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };   // a token with alpha, for canvas
/* ================= icons (simple line icons) ================= */
const P = {
  home:'<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5V20h4.5v-5.5h4V20h4.5V9.5"/>',
  money:'<rect x="2.5" y="6" width="17" height="11" rx="1.5"/><circle cx="11" cy="11.5" r="2.6"/><path d="M5.5 9v.01M16.5 14v.01M21.5 9v10.5H6"/>',
  list:'<circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/><rect x="8" y="4" width="13" height="4" rx="2"/><rect x="8" y="10" width="13" height="4" rx="2"/><rect x="8" y="16" width="13" height="4" rx="2"/>',
  cards:'<rect x="3" y="8" width="16" height="11" rx="1.5"/><path d="M3 12h16M6 5h15v10M7 16h3"/>',
  menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
  mail:'<rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>',
  chev:'<path d="m9 5.5 6.5 6.5L9 18.5"/>',
  back:'<path d="M20 12H4.5M10.5 5.5 4 12l6.5 6.5"/>',
  close:'<path d="M6 6l12 12M18 6 6 18"/>',
  backc:'<path d="M14.5 5.5 8 12l6.5 6.5"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  swap:'<path d="M5 9h14l-3.5-3.5M19 15H5l3.5 3.5"/>',
  euro:'<path d="M17.5 6.5A6.5 6.5 0 1 0 17.5 17.5M5 10.5h9M5 13.5h9"/>',
  plane:'<path d="M20.5 3.5 3.5 11l6.5 2.5 2.5 6.5z"/><path d="M10 13.5 15 9"/>',
  req:'<rect x="3" y="5" width="14" height="10" rx="1.5"/><circle cx="10" cy="10" r="2"/><path d="M3 18h9M17 13.5l4 2.5-4 2.5"/>',
  sched:'<rect x="3" y="5" width="15" height="14" rx="1.5"/><path d="M3 9.5h15M7 3v3.5M14 3v3.5"/><circle cx="17.5" cy="17" r="4" fill="' + PALETTE.white + '"/><path d="M17.5 15v2.2l1.4 1"/>',
  hist:'<rect x="3" y="7" width="14" height="12" rx="1.5"/><path d="M7 11h6M7 15h4M15 3.5l3 2.5-3 2.5M18 6h-6"/>',
  filter:'<path d="M4 5h16l-6 7.5V19l-4-2v-4.5z"/>',
  search:'<circle cx="11" cy="11" r="6"/><path d="m15.5 15.5 5 5"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.01"/>',
  gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M4.2 7.5l2.1 1.2M17.7 15.3l2.1 1.2M4.2 16.5l2.1-1.2M17.7 8.7l2.1-1.2"/><circle cx="12" cy="12" r="6.6"/>',
  user:'<circle cx="10" cy="8" r="3.5"/><path d="M3.5 19c.8-3.3 3.4-5 6.5-5"/><path d="M14 15h7M14 18h7"/>',
  phone:'<rect x="6.5" y="2.5" width="11" height="19" rx="2"/><path d="M10.5 18.5h3"/>',
  ctp:'<path d="M3 7h12l3 5-3 5H3z"/><path d="m14 7 3 5-3 5M18 7l3 5-3 5"/>',
  road:'<path d="M9 3 5 21M15 3l4 18M12 5v2.5M12 11v2.5M12 17v2.5"/>',
  doc:'<path d="M5 3.5h14v11l-5 5H5z"/><path d="M14 19.5v-5h5M8 8h8M8 11.5h5"/>',
  invite:'<path d="M16 3.5c-1.5 0-2.5 1.2-2.5 1.2S12.5 3.5 11 3.5 8.5 5 8.5 6.3c0 2.7 5 5.7 5 5.7s5-3 5-5.7C18.5 5 17.5 3.5 16 3.5z"/><path d="M3 21v-4.5h3.5c1.5 0 2 1 3.5 1h3.5M6.5 21H17l4-4"/>',
  mapq:'<path d="M3 6.5 8 4l5 2.5L18 4v6M3 6.5V20l5-2.5 4 2M8 4v13.5"/><circle cx="16.5" cy="15.5" r="3"/><path d="m18.7 17.7 2.3 2.3"/>',
  mapp:'<path d="M3 6.5 8 4l5 2.5L18 4v6M3 6.5V20l5-2.5 4 2M8 4v13.5"/><path d="M17 21s-3.5-3.2-3.5-5.8a3.5 3.5 0 0 1 7 0C20.5 17.8 17 21 17 21z"/><circle cx="17" cy="15.2" r="1"/>',
  rate:'<path d="m3 17 5-5 3.5 3.5L20 7M14.5 7H20v5.5"/><path d="m3 11 4-4 3 3"/>',
  qr:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 14h3v3h-3zM20 14v2M14 20h2M18 18h3v3"/>',
  cal:'<rect x="3" y="5" width="18" height="15" rx="1.5"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  help:'<path d="M4 15.5A6.5 6.5 0 1 1 9.5 18H4z"/><path d="M14.5 9.5A5.5 5.5 0 0 1 20 15v5h-5a5.5 5.5 0 0 1-4.6-2.5"/>',
  lock:'<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3M12 14.5v2.5"/>',
  logout:'<circle cx="12" cy="12" r="9"/><path d="M8 12h9M13.5 8.5 17 12l-3.5 3.5"/>',
  wallet:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 14.5h2"/>',
  piggy:'<path d="M5 11.5c0-3.3 3.1-5.5 7-5.5 3.5 0 6.5 1.7 7.2 4.5H21v3.5h-1.8c-.5 1.3-1.4 2.3-2.7 3V20h-3v-1.5h-3V20h-3v-3.3C6 15.6 5 13.8 5 11.5z"/><path d="M5 11.5H3.5M10 6.5 9 3.5l3 2.2M16 10.5v.01"/>',
  tag:'<path d="M3.5 12.5V4.5h8l9 9-8 8z"/><circle cx="8" cy="8.5" r="1.4"/>',
  chart:'<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5V12l6 6"/>',
  star:'<path d="m12 3.5 2.6 5.5 6 .8-4.4 4.1 1.1 6-5.3-3-5.3 3 1.1-6L3.4 9.8l6-.8z"/>',
  food:'<path d="M5 3v6a2.5 2.5 0 0 0 5 0V3M7.5 11.5V21M17 3c-2 1.5-3 4-3 7h3v11"/>',
  cart:'<path d="M2.5 4H5l2.3 10.5h10.2L20 7H6.2"/><circle cx="9" cy="19" r="1.5"/><circle cx="16.5" cy="19" r="1.5"/>',
  bus:'<rect x="4" y="3.5" width="16" height="14" rx="2.5"/><path d="M4 11h16M7 17.5V20M17 17.5V20M7.5 14.5h.01M16.5 14.5h.01"/>',
  fun:'<path d="M4 7.5 20 4l-1 5.5H5zM5 9.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V9.5"/><path d="M9 4.5l1.5 4.5M14 3.6 15.5 8.6"/>',
  edu:'<path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v5c0 1.5 2.5 3 5.5 3s5.5-1.5 5.5-3v-5M21.5 9v5"/>',
  eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  snow:'<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9"/>',
  limit:'<path d="M4 17a8 8 0 1 1 16 0"/><path d="m12 17 4-5"/>',
  check:'<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.8 2.7L16 9.5"/>',
  bell:'<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
  game:'<path d="M7.5 8.5h9a4.5 4.5 0 0 1 4.4 5.5l-.6 2.6a2.1 2.1 0 0 1-3.7.9l-1.9-2.5H9.3l-1.9 2.5a2.1 2.1 0 0 1-3.7-.9L3.1 14a4.5 4.5 0 0 1 4.4-5.5z"/><path d="M8 11v3M6.5 12.5h3M15.5 11.6h.01M17.5 13.4h.01"/>',
  car:'<path d="M4 16.5V12l2.2-5h11.6l2.2 5v4.5z"/><path d="M4 12h16"/><circle cx="7.8" cy="16.5" r="1.8"/><circle cx="16.2" cy="16.5" r="1.8"/>',
  gift:'<rect x="3.5" y="9" width="17" height="11" rx="1.5"/><path d="M3.5 12.5h17M12 9v11M12 9C10.5 5 7 5 7 7.5 7 9 10 9 12 9zM12 9c1.5-4 5-4 5-1.5 0 1.5-3 1.5-5 1.5z"/>',
  analyst:'<path d="M5 20v-7M12 20V5M19 20v-10M3 20.5h18"/>',
  coins:'<ellipse cx="12" cy="6.5" rx="7" ry="3"/><path d="M5 6.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5M5 11.5v5c0 1.7 3.1 3 7 3s7-1.3 7-3v-5"/>',
  shield:'<path d="M12 3.5 19 6v5.5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6z"/><path d="m9 12 2.2 2.2L15.5 10"/>'
};
const I = (n,s) => `<svg class="i" viewBox="0 0 24 24"${s?` style="width:${s}px;height:${s}px"`:''}>${P[n]}</svg>`;
const ft = n => (n<0?'-':'') + Math.abs(Math.round(n)).toLocaleString('en-US').replace(/,/g,' ') + ' Ft';
const sft = n => (n>0?'+ ':'') + ft(n).replace('-','- ');
const $ = s => document.querySelector(s);
/* Simple Persely (docs/simple-persely-plan.md): on by default, ?simple=0 falls back to the pre-Simple behaviour (wizard, setup card, Sunday nudge sheet). */
const SIMPLE_PERSELY = new URLSearchParams(location.search).get('simple') !== '0';
// the one switch used everywhere (same look as in onboarding): the switch toggles, the row next to it opens the settings
const swBtn = (on, attr, label) => `<button class="tg ${on ? 'on' : ''}" role="switch" aria-checked="${on ? 'true' : 'false'}" aria-label="${label}" ${attr}></button>`;
/* Reading grade for English UI copy (Flesch-Kincaid), shared by the self-checks and anyone who wants to measure a string.
   fkGrade(text) -> {grade, words, sentences, longest}. "longest" = words in the longest sentence (target: 12 or fewer).
   Rules: "500 000" is one word; a number is one syllable; "·", ".", "!", "?" and ":" end a sentence. Matches the plan's script within 0.5. */
const fkSyl = w => { w = w.toLowerCase().replace(/[^a-z]/g, ''); if(w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|[^laeiouy]ed|[^laeiouy]e)$/, '').replace(/^y/, ''); const m = w.match(/[aeiouy]{1,2}/g); return Math.max(1, m ? m.length : 1); };
const fkGrade = text => {
  const t = String(text).replace(/(\d)[\s  ](?=\d{3}\b)/g, '$1').replace(/\s*[·•|]\s*/g, '. ').trim();
  const sents = t.split(/(?<=[.!?:])\s+(?=\S)/).map(s => s.trim()).filter(s => /[A-Za-z0-9]/.test(s));
  const words = sents.map(s => s.match(/[A-Za-z0-9][A-Za-z0-9'’%.,-]*/g) || []);
  const W = words.reduce((a, w) => a + w.length, 0) || 1, S = sents.length || 1, Y = words.flat().reduce((a, w) => a + (/^\d/.test(w) ? 1 : fkSyl(w)), 0);
  return {grade: Math.round((0.39 * W / S + 11.8 * Y / W - 15.59) * 10) / 10, words: W, sentences: S, longest: Math.max(0, ...words.map(w => w.length))};
};
