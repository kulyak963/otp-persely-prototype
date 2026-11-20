# CLAUDE.md: OTP Persely prototype (Team 3)

Handoff for any Claude session that opens this repo. Read it fully before changing anything.

## What this is

A clickable prototype for the **OTP Bank × Corvinus seminar** (Budapest), built by Team 3. The brief: OTP loses students at 24, when the *Junior* package ends. Our answer: a new **Persely** tab in the OTP mobile app that makes saving a habit and keeps students with OTP after 24.

- The app copies the look of the real OTP MobilBank (Home, Transfer, Transactions, More). Our additions sit on top of it.
- UI language is **English**. Demo money only: no real accounts, logins or payments.
- The owner is **Denis** (GitHub `kulyak963`). He talks to Claude in **Russian**. Answer him in simple Russian, no jargon, short. He is not a developer.
- Teammates with write access: `tothlevente330` (Levente) and `JegesmaciELIT`. Tamás also worked on a branch that was merged as PR #1.

## Links

| What | Where |
|---|---|
| Live app | https://otp-persely-prototype.onrender.com (Render free plan: sleeps after 15 min, first open takes ~50 s) |
| Repo | https://github.com/kulyak963/otp-persely-prototype (public, branch `main`) |
| Team guide (how everything works) | `prototype-guide.html`, also live at `/guide.html` |
| Demo run sheet for the pitch | `demo-script.html`, also live at `/demo-script.html` |
| Presenter push panel | `/push.html` (needs the admin key, see below) |

Render **auto-deploys every push to `main`**. Push to `main` only when Denis says so (he says "выкладывай").

## Run it

```bash
npm install
node server.js          # http://localhost:8090
```

- Laptop demo: open in a **wide** browser window. From 760 px the app shows inside an iPhone frame with the demo panel on the left. From 980 px the **Behind the app** panel appears on the right. A narrow window (like an IDE preview pane) shows the plain phone screen without any panels.
- iPhone: open the live link in Safari, then Share → Add to Home Screen. Web push needs https and the Home Screen install.
- Offline single file: `node tools/build-standalone.mjs` writes `dist/otp-persely-demo.html` (no server, no push).

## Secrets: never commit them

- `data/` is git-ignored: `data/vapid.json` holds the VAPID keys, `data/subs.json` the phone subscriptions. On Render they come from the env vars `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` and `ADMIN_KEY`.
- `ADMIN_KEY`: the presenter opens the app once as `/?key=<ADMIN_KEY>`, and the app remembers it in localStorage. Only then do "Also send to iPhone" and `/push.html` work from a non-local address. Do not write the key into the repo or into chat.
- `pig-happy.png` and `pig-worried.png` are cut from OTP ads. They are ignored and must never be published. Persi is our **own** three.js piggy; do not recreate OTP's ad pig.

## Files

| File | Role |
|---|---|
| `index.html` | **The whole app**: HTML, CSS and JS in one file, about 5,000 lines |
| `server.js` | Node static server with a path whitelist, plus web-push (`/api/vapid`, `/api/subscribe`, `/api/push`, `/api/subs`, `/api/clear`), admin check |
| `sw.js` | Service worker: offline cache and push display. **Bump `NAME` (`otp-demo-vNN`) on every change**, or phones keep the old version |
| `push.html` | Presenter panel for real pushes |
| `prototype-guide.html`, `demo-script.html` | Docs for the team. Update them when features change |
| `tools/build-standalone.mjs` | Builds `dist/` |
| `render.yaml` | Blueprint (not used: the Render service was created by hand) |
| `three.min.js` | Local three.js for Persi |
| `custdev/` | Local only (not committed): a printable A4 sheet with a QR code for student testing |
| `docs/`, `team-plan.md`, `BRANCHES.md` | The team's planning notes from 18–19 Nov |

## How index.html is organised (search for these)

- State: `fresh()` (demo data), `updateDayState()` (demo start, key U), `week8State()` (key J). localStorage key `otp-clone-en-v5`.
- Home `vFooldal()`: the original OTP spending gauge and category bars; our additions are `ltsLine()` (Left to spend), `homeScore()` (health score) and the tappable bars (`data-catd`).
- Persely tab `vHub()`: Persi strip with the story circle, the white total card, the streak card, goals, `moneyInPanel()` and the Junior row.
- Pages `PAGES`: `goal`, `create`, `grad`, `year`, `mymoney` (Left to spend), `advanced` (Full analysis, `fullAnalysisHTML()`), `catd` (category page, `catDetailHTML()`), `kiadas` (Details), plus the copied OTP pages.
- Sheets `SHEETS`: `hubsave`, `hubout`, `payday`, `moneyin`, `payrule`, `newgoal`, `score`, `how` and others.
- Splits: `presetSplit()`, `catLimit()`, `splitPresetsSheet()`, `splitEditSheet()` (draggable bar). Stored in `S.splitPreset` and `S.splitCustom`.
- Payday income sources: `paydayExtras()`, `extraRule()`, `S.payday.extra`; onboarding `onbSrcRow()`, `onbAddSrc()`.
- Onboarding: `startOnb()`, `renderOnb()` (3 steps), `applyOnb()`. Tour: `TOUR`, `tourStart()` (spotlight).
- Story: `storySlides()`, `stFacts()`, engine `openStory()` / `stGo()`.
- Persi: `pig3d` (mount, setMood, jump, celebrate, spin, snapshot), `persiSays()`.
- Analytics engine (from the team): `detectRecurring()`, `billsFirst()`, `safeToSpend()`, `splitView()`, `spreadCats()`, `project()`, `planModel()`, `tipOf()`, `scoreNow()`.
- Behind the app: search `Behind the app`: `beEp()`, `beStep()`, `beRender()`. Wrappers around app functions only write the log.
- Demo: `DEMO` pushes, `renderDemoPanel()`, the key handler (`else if(k === ...)`), `fastForward()`, `monthStep()`.
- Self-checks: `__checkAnalytics()`.

## Features as they are now

- **3.0% for every Junior customer**, automatically. No student verification (removed on purpose). Badge "Junior 3.0%"; after Junior ends, "Keep my 3.0%" for 12 months if the salary comes to OTP (`grad` page).
- **Persely tab**: Persi (84 px) with one line, a green "NOV" story circle, the total in a white card, a compact streak card, goals (Summer holiday; PS5 + GTA VI due 7 days from today so it is always "Behind"; shared Balaton trip waiting for Dóri, key D), Money in, Junior ends.
- **Onboarding**: goal → money in (income sources: salary, family transfer, add a scholarship or job; each with 5/10/15/20% or Custom; weekly transfer with Custom; round-ups) → first deposit → Persi's spotlight tour (5 steps, Next/Skip, key T repeats it).
- **Streak**: weekly, 1 skip week per 4 weeks; milestones at 10 weeks and a goal at 50%.
- **Home**: the real OTP gauge and categories, plus one line "Left to spend this month" and a slim "Financial health" row. Tap a category bar: the category page shows spent as % of income, the limit, used %, left this month and per day, then "Change your split" (two suggestions plus "Set it yourself" with a draggable bar).
- **Left to spend** page: the number, a ladder that adds up (balance − bills − saving − groceries), bills still to pay with Pay now, Persi's tip, a link to **Full analysis** (the team's full analyst, hidden one level down).
- **Monthly story**, Spotify Wrapped style: top places, spending day, days off, biggest buy, subscriptions, "Your Wolt week" (7 orders in one week), into Persely, goal, streak, share card. Monthly only (no semester or year story).
- **Behind the app** (laptop): a diagram of 8 boxes; each action draws its path with arrows and one big line says what happens. Simulated, except pushes (real, marked REAL).
- **Fast-forward**: O (+1 month), Q (+2), Y (to month 12, stops at month 10 when Junior ends).

## Demo keys (laptop panel; long-press Anna's photo on the phone)

`U` demo start (Face ID → pop-up) · `J` 8 weeks later · `P` payday · `C` coffee round-up · `D` Dóri joins · `N` next week · `B` rent missed · `O` / `Q` / `Y` fast-forward · `G` Junior ends · `M` story · `T` Persi's tour · `A` Behind the app · `L` lock phone · `H` hide panel · `1`–`9` pushes (Card payment, Money received, Week still open, Interest paid, Friend saved too, Junior ends, Monthly story, New discount, Bill late).

Pitch numbers after a run from U (Own home, 500,000 Ft by June 2029, boost 1,500 Ft/week, first deposit 1,000): 147,766 Ft after +1 month, 188,913 Ft after +2, 341,837 Ft after a year, +5,340 Ft at 3.0% vs +18 Ft at 0.01%. Re-run and update `demo-script.html` if anything changes them.

## How to work on it

1. Edit `index.html`. For bigger edits, a small Node script that does exact string replacements and fails loudly works best (the file has very long lines).
2. Syntax check: `node -e "const s=require('fs').readFileSync('index.html','utf8');[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach(m=>new Function(m[1]));console.log('ok')"`
3. In the browser console: `__checkAnalytics()` must return `failed: []` (about 120 checks). Note: running it can pop a reward sheet in the live UI; close it.
4. Check at phone width (375 px) and on a wide laptop window.
5. Bump `sw.js` (`otp-demo-vNN`), run `node tools/build-standalone.mjs`, update `prototype-guide.html` and `demo-script.html` when behaviour changes.
6. Commit with a message file on Windows (`git commit -F msg.txt`): PowerShell breaks quoted here-strings.
7. Push to `main` only when Denis asks. Then check the live site from a phone on mobile data: some venue Wi-Fi networks intercept `onrender.com` (untrusted certificate), so the laptop may not reach it. Present the laptop from `localhost:8090` in that case.

Safety nets: tag `backup-2026-11-16` (Denis's version before the team's changes), tag `team-2026-11-19` (the team's full version before the simplification).

## What Denis wants (decisions; do not undo)

- User-friendly first. Short text everywhere. No childish tone, no Duolingo-style jokes, no nagging. "A bank, not a reminder app."
- Keep the name **Junior** (OTP's package). No Neptun or student verification.
- Do not duplicate what the real OTP app already has (spending gauge, category bars). Add only what is ours, and keep heavy analysis one level down.
- Home: no Persi tip card, no orange late-bill strip.
- Persely tab top stays as our first design: Persi strip, green story circle, total in a white card. He rejected the big pig with a bubble and the pig inside the story ring.
- Stories are fun facts about her own habits (Wrapped style), not analytics, and only monthly. No "your food = a trip" comparisons. BKK, MÁV, Bolt and Wolt are not "places".
- No drawn money stack in the amount picker. Amount chips with "k"/"M" are fine.
- Splits: suggestions plus a draggable bar, never a wall of +/- buttons.
- Behind the app: a simple diagram in plain words for non-programmers.
- Ask before pushing (deploying). Show screenshots of what changed.

## Known limits

- Wolt orders in the demo history are 600–1,100 Ft (unrealistic). Making them realistic flags them as one-off payments and shifts the analyst's projection, split and tip. The story shows counts only.
- Own income sources after onboarding: only the salary % can be changed in the rule sheet; other sources are set in onboarding.
- Custom split and presets change the category limits only, not the split shown in Full analysis.
- The app is a prototype: no backend for bank data; every bank number is computed from the demo transactions in the browser.
