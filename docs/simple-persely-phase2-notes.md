# Simple Persely, Phase 2: the Persely tab with a goal

Plan: `docs/simple-persely-plan.md` (2b tab, 2c connections, 2d Persi priority and streak, 3 acceptance). Decisions: `docs/simple-persely-decisions.md` (D4, D5, D6, D8, D12).

Scope: a student who **already has at least one goal**. The tab without a goal (`vHubNew`), Home, the goal wizard, the reward moment, pushes and the Rate and safety / Good to know / Why Persely / How Persely works sheets are other phases and were not changed.

## Flag

- `const SIMPLE_PERSELY = new URLSearchParams(location.search).get('simple') !== '0';` at the end of `js/01-tokens-helpers.js` (same line as the main checkout).
- On (default): `vHub()` returns `vHubSimple()` when there is a goal.
- `?simple=0`: `vHub()` renders today's tab unchanged, and `__checkAnalytics()` runs today's 212 checks unchanged (no new checks run).

## What was built (`js/14b-simple-tab.js`, CSS block at the end of `css/app.css`)

**The tab**: 4 blocks, the honesty line and one More row. No scroll at 390 x 844: the content is 643 px, the limit is 778 px.

1. **Persi + one sentence.** `persiLine(st)` is a pure function. `persiState()` builds its input from `S`. The rules, in order:
   - 1 No goal: "Hi! Let's save your first 1 000 Ft."
   - 2 A goal just reached: "You did it! Summer holiday is full." A long name becomes "Your goal". Tapping opens the goal.
   - 3 Payday asked and still open: "Payday! Save 7 500 Ft?" Tapping opens the payday sheet. `S.payOpen` is set by a wrapper around `salaryArrives`. It clears on Move, Cover, Not this time or closing the payday sheet.
   - 4 Junior ends in 90 days or less, and nothing is requested yet: "Keep your 3.0%? 41 days left." At 0 days it says "It ends today." Tapping opens the Junior page.
   - 5 Story ready: "Your November story is here." Tapping opens the story.
   - 6 Week open, Friday to Sunday: "Add any amount to keep week 9." Tapping opens Add money.
   - 8 Back after 3 or more days: "Welcome back. Your 140 000 Ft is safe." Days away = real days + simulated months. It is measured once at app start (`S.seenDay`).
   - 7 Default: "Nice! Your money is safe here."
   - **Order note:** rule 8 is checked before the default 7, because the default always matches.
   - At month end a ring (`.sp-ring`) sits around Persi and opens the story, from the ring or from Persi inside it. There is no ring the rest of the month.
2. **Picture + big number.**
   - Up to 3 SVG jars. Each has the goal icon and fills to its progress, with no numbers inside. With more than 3 goals a "+2" badge shows.
   - The big number is `total()`, the same figure as Home's "Persely · total", captioned "Saved".
   - The optional third number, "of 45 000 Ft", sits under the tapped jar, or else the one closest to done. It shows only when Persi's sentence has no number, so the tab never has more than 3 numbers.
   - The first tap on a jar moves the target under it. A tap on the jar that already shows it, or a tap when no target can show, opens that goal.
3. **Add money** is one full-width 56 px button. It opens the existing Add money sheet with the **last amount** pre-filled (D5). `S.lastAmt` is stored after a forint deposit goes through. Under it is a 44 px **Withdraw** text link that opens the existing withdraw sheet (D6).
4. **Streak**: flame, "Week N", 4 dots with this week ringed, and "Save once a week".
   - N is the streak week you are in now: the streak, plus 1 while this week is still open. It never shows "Week 0".
   - There is no skips number. The skips logic in `nextWeek` is unchanged.
- **Honesty line**: "3.0% until [Junior end date] · Withdraw any time · Protected ⓘ Learn more".
  - It is built from `rateLabel()` and `juniorEndLabel()`, or the Graduate date when bridged.
  - It is one button that opens the existing **Good to know** sheet.
  - It is marked `<!-- CONFIRM WITH OTP -->`.
- **More row**: "More: goals, rules, rate" opens `PAGES.persmore`.

**More page** (`PAGES.persmore`): one scroll page, one level deep, grouped. The labels in quotes are what the page shows.

- **Goals**
  - The "34% of what your goals need" line.
  - The goal cards as before, with their fix buttons. This uses `goalCardHTML(g)`, now shared with the classic tab.
  - "New goal", "Share a goal" and "Save in euro".
- **Saving rules**
  - The read-only list per goal.
  - "7 500 Ft a month moves in by itself", which opens the Money in sheet. This merges the old panel.
- **Your rate**
  - "Rate and safety" with the interest line in Ft. It opens the existing **Why Persely?** sheet.
  - "Keep my 3.0%" opens the Junior page.
- **You**
  - "Habits" opens `PAGES.habits` (D12): the 8-week streak card with best and skips, the reminders notice, the health score with its one line, a short streak explainer and "My rewards".
  - "Spending" (`analysisRow`).
  - "Perks".
  - Friends, opt-in as before ("Add friends", or the card once opted in).
  - "Your year", from month 12.
- **Help and settings**
  - "How Persely works".
  - "Persely settings", which is where the old gear went.

**Removed from the tab** and now on More, each one tap away (`SP_MORE_MAP`):

- The gauge and "% of what your goals need".
- The interest line in Ft and the fine print.
- The goal cards, their dates and fix buttons. A goal that is behind is never named on the tab.
- The Saving rules list and the Money in panel.
- The Junior row.
- The reminders notice, the health score and the Spending row.
- The Perks row and the Your year row.
- The How Persely works and Add friends links, and the friends card.
- The gear.

**Deleted from the tab:** the 4 Persi hint strips and the grey "At month end" ring. The hint code stays for `?simple=0`.

**Other changes:**

- `js/08-persely-pages-sheets.js`:
  - The goal card template moved into `goalCardHTML(g)`, with no change to the output.
  - One line at the top of `vHub()` sends the tab to `vHubSimple()`.
- Load order: `js/14b-simple-tab.js` loads after `14-fastforward.js` and before `15-boot.js`.
  - It is listed in `index.html` and `sw.js` FILES.
  - `server.js` picks it up from the `js/` folder, after a restart.
  - The offline build inlines it.
- The cache is now `otp-demo-v60`.

## Self-checks

**New checks:** they run only with the flag on, from `simpleTabChecks(ok)` in `js/14b-simple-tab.js`. `__checkAnalytics` calls it with one line.

- `chk-simple-tab-blocks`
  - The tab is exactly the blocks persi, picture, add and streak, then the honesty line and More.
  - Content is 778 px or less and there is no scroll.
  - Measured in 9 states: existing seed, 3 goals (week open), 3 goals (welcome back), 1 goal, 5 goals (+2), month end, goal reached with the target shown, payday asked, and the seed with hints forced on.
- `chk-simple-words-numbers`
  - 40 words or less: 32 to 38 measured. A number such as "12 000" counts as one word.
  - 3 numbers or less, plus the rate. The honesty line (rate and its date) and the "+2" picture badge are not counted.
  - 4 controls or less besides the jars and Persi.
- `chk-simple-no-hints`: no hint strips and no grey ring, even with hints forced. At month end the Persi ring opens the story.
- `chk-simple-one-primary`: one primary-styled button, at least 56 px, with the 44 px Withdraw link under it.
- `chk-simple-persi-priority`: 12 constructed states for the 8 rules, every sentence 8 words or less, and the tab shows exactly the `persiLine` sentence.
- `chk-simple-more-complete`
  - Every entry of `SP_MORE_MAP` is on the More page, reached from the tab's More row, and opens its destination in one tap.
  - Habits holds the streak, skips, health score and rewards.
  - None of the removed blocks is left on the tab.
- `chk-simple-add-last-amount` (extra): the sheet starts empty, a 2 500 Ft deposit is stored, the next Add money is pre-filled with 2 500, and Withdraw opens the withdraw sheet.

**Old checks gated on the flag:** none deleted. With `?simple=0` each runs its original assertion. With the flag on it runs the equivalent below.

| Check | Equivalent with the flag on |
|---|---|
| `chk-tab-order` | Block order on the simple tab, Persi pointing to the Junior page at 60 days, and the order of the More groups |
| `chk-hint-seen-on-screen` | No hint drawn on the tab and no observer; the 1 s on-screen rule still holds |
| `chk-story-month-end` | No ring before month end; the `sp-ring` opens the story at month end and turns `seen` after watching; keys M and E; a new month clears it |
| `chk-entry-map` | Persely rows are reached from the tab's More row |
| `chk-tap-44` | Also measures `.sp-out`, `.sp-honest`, `.sp-jar`, `.sp-say` and `.sp-more` |
| "Persely tab: no rule switches ... one Spending row" | The same on the tab plus More: one Money in row and one Spending row, none on the tab |
| "Persely tab row shows what is spent of what is planned" | The row is on More, not on the tab |
| "one entry path", "analyst off", Junior card at the end, both Friends checks, `chk-seed-existing`, `chk-date-format`, `chk-rate-has-cap`, `chk-goal-reached-card`, `chk-keep-pending`, `chk-forecast-one-figure`, `chk-gear-deeplink`, `chk-home-circle-categories` (tab part), `chk-year-entry`, `chk-rules-overview`, `chk-perks-rewards` | The same content is looked for on the tab plus its More page (`tabAll()`, `viaMore()`) |

- In `chk-rate-has-cap`, a 3.0% on the simple tab counts when its control opens Good to know, Why Persely? or the Junior page. Those hold the 500 000 Ft cap and the date.

**Results** (headless Chromium, 390 x 844, fresh context, `http://localhost:8102/?demo=1`):

| Flag | Over http | Offline build (`dist/otp-persely-demo.html`) |
|---|---|---|
| On | 219 of 219 | 219 of 219 |
| `?simple=0` | 212 of 212 | 212 of 212 |

**Driven by hand in headless Chromium, with no page errors:**

- Key X loads the existing seed.
- Add money from the tab, then Undo.
- O: +1 month.
- Q: +2 months.
- Y: stops at month 10 with "Your Junior package ends". After it, Y goes on to month 12.
- More > Your year > See your year story.
- Tapping Persi inside the month end ring opens the story.

## What remains

- **Rate and safety** is not one merged sheet yet. The honesty line opens Good to know and More > Rate and safety opens Why Persely? (Phase 3, other agent).
- **D5 outside the tab:** the last amount is pre-filled only from the tab's Add money button. The Home shortcut and the goal page still open the sheet empty. Phase 3 can make the sheet itself do it.
- **Hint button:** "Show me Persi's hints again" in How Persely works now leads to a tab with no hints. That sheet belongs to another agent.
- **Copy:** FK grade is not measured in the app (`chk-simple-grade` is Phase 4). The new strings follow the plan's sentences. The Habits page keeps the old score line "Spending under income · no overdraft · ...". The plan's simpler line is a Phase 4 copy change.
- **Not checked on a real iPhone:**
  - safe-area insets: the tab has 135 px to spare at 390 x 844 with no inset;
  - the 3D Persi inside the 72 px ring.
