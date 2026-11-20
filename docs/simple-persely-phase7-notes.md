# Simple Persely, Phase 7: existing users opt in, with a Classic view way back

Plan: `docs/simple-persely-plan.md`, section 3, row 7, and risk 1 (change aversion: P42, E1-002, where session time is up on day 2 and back near control by day 14).

Scope: only the Persely **tab** follows the view. The first run, Home and the Phase 3 sheets keep following `SIMPLE_PERSELY`. Nothing migrates. The view is a setting: the money, goals and streak are the same in both views.

## Flag

- `?simple=0` still gives today's whole app. Nothing in `js/14c-simple-optin.js` runs then: no card, no Classic row, no panel button, no new checks.
- The view applies only while `spOn()` is true. `SP_LEGACY` therefore still renders the legacy screens.

## The setting: `S.persely`

The seeds already carry `S.persely`, the old Persely details. Phase 7 adds these fields to that object:

| Field | Meaning |
|---|---|
| `view` | `'classic'` or `'simple'` |
| `since` | App day of first sight |
| `old` | The student had a goal at first sight |
| `asks`, `askedAt` | How many times Not now was tapped, and the app day of the last tap |
| `tried`, `switchedAt` | Try it was used, and the app day of the switch |
| `why` | The "What did not work?" answers, as `[{a, day}]`. Kept in the state only, never sent anywhere |

- **App day** is `S.week * 7`.
  - N (next week) adds 7.
  - A fast-forward month (O, Q, Y) adds 28.
  - It is the demo clock, so it is the same in every run.
- **First sight** is the first time the Persely tab renders with no view stored. `vHub()` calls `spView()` on every render with the flag on.
  - A student with a goal starts in `classic`.
  - A student without a goal starts in `simple` and stays there after the first goal.
  - Old saved state from before Phase 7 is treated the same way: with goals it starts in `classic` and shows the card.

## What was built (`js/14c-simple-optin.js`, CSS block at the end of `css/app.css`)

**The classic tab** (`vHub()` in `js/08`, the same tab as `?simple=0`) shows one card right under the title:

- Title: "Try the new Persely"
- Line: "Simpler. Your money and goals stay the same."
- Buttons: **Try it** and **Not now**, with the same class (`btn sm eq`) and the same width, 44 px high.

What the buttons do:

- **Try it** switches the tab to the simple view straight away and shows the toast "New Persely is on. Classic view is in More." It sets `tried` and `switchedAt`.
- **Not now** hides the card for 7 app days. The card then comes back once. After a second Not now it never shows again.
- After Try it, the card never comes back. The way back from then on is the Classic view row and the Settings switch.

**More page** (`PAGES.persmore`, wrapped):

- The last row of "Help and settings" is **Classic view** ("Go back to the old tab").
- It shows for 14 app days after `switchedAt`.

**Settings > Persely**: a switch, **Classic view**.

- It shows for students who had a goal at first sight, or who tried the new tab.
- Its subtitle is "The old Persely tab. Your money stays the same."
- After the 14 days the subtitle becomes "The old Persely tab. It moved here from More." This is the short note.
- Switching it on to the simple view does the same as Try it.

**Going back** (the More row or the switch) turns the tab classic first. Then the sheet **"What did not work?"** opens, with the subtitle "One tap. It stays on this phone." It has 5 chips of the same class and height:

- Hard to find things
- I like the old one
- I miss some info
- Some parts broke
- Skip

The answer, including Skip, is pushed to `S.persely.why`.

**Demo panel**: a "🔀 Persely view: classic · 2 answers" button, placed before Reset app.

- It toggles the view with no question asked.
- The count of answers is for the presenter.
- It is laptop only, like the rest of the panel.

**Addresses**:

- `?view=classic` and `?view=simple` set the view at load and win over the stored one.
- The same value is used for every first sight in that page, so key X, U and Reset follow it.
  - Without `?view=`, key X shows the classic tab with the card.
  - With `?view=simple`, key X shows the simple tab with no card. The Classic view row is there, because an existing user put in the simple tab still gets the way back.
- `?simple=0` beats both.

Copy rules: every string is FK grade 4 or less, with 12 words or less a sentence. There are no hyphens and no "deadline". The check measures this with `fkGrade()`.

Colours: tokens only. The new CSS uses `--card`, `--sh`, `--muted-t`, `--fs-s` and `--sp-*`. `chk-palette` passes.

## Self-checks

**Pattern for older checks.** The existing seed now starts in the Classic view for a real student. Older checks assumed the new tab shows for seed X.

- `__checkAnalytics` sets `SP_CHECK_VIEW = 'simple'` for the whole run, so every older check runs under an explicit simple view. Their assertions are unchanged, and none were deleted.
- The value is restored at the end.
- `spView()` returns `SP_CHECK_VIEW` before the stored view.
- `spOptinChecks` sets `SP_CHECK_VIEW` and the `?view=` value to `null`. Each state then sets or deletes `S.persely.view` explicitly, so it tests the real first sight.
- A new check that needs a given view should do the same: clear `SP_CHECK_VIEW` and set `S.persely.view`.

**New checks.** They run with the flag on, from one line after `simpleTabChecks`.

- `chk-simple-optin`
  - The existing seed shows the classic tab with exactly one card, at the top.
  - Try it and Not now are equal and 44 px.
  - Copy is grade 4 or less.
  - Try it switches the view. Balances, goals, streak, transactions and total are identical before and after.
  - Classic view on More brings the classic tab back, with the question, and the card does not return.
  - Not now hides the card on the same app day. It shows again 7 app days later. After a second Not now it never shows.
- `chk-simple-optin-new-user`
  - The new-user seed goes straight to the simple view with no card.
  - After a first goal it is still simple, and there is no Classic view row.
- `chk-simple-classic-window`
  - The More row is there on day 0 and day 7, and gone on day 14 and day 28.
  - The Settings switch is there on day 0 and day 14, with the note on day 14.
  - Both ways back open the sheet. It has 5 equal chips with Skip last.
  - Both an answer and a Skip are recorded.
  - The demo panel reads "classic · 2 answers".
- `chk-simple-view-overrides`
  - `spViewUrl()` parses `?view=classic`, `?view=simple` and ignores anything else.
  - First sight of the existing seed gives:
    - `?view=classic`: classic with the card
    - `?view=simple`: simple with no card
    - no `?view=`: classic with the card
  - The live page's own address matches what was read.
  - The demo panel button toggles both ways without the sheet.

**Results** (headless Chromium, 390 x 844, fresh context, service workers blocked, port 8110):

| Address | Over http | Offline build (`dist/otp-persely-demo.html`, file://) |
|---|---|---|
| `?demo=1` | 242 of 242 | 242 of 242 |
| `?demo=1&simple=0` | 212 of 212 | 212 of 212 |
| `?demo=1&view=simple` | 242 of 242 | 242 of 242 |

There were zero console errors in all of these runs.

**Driven by hand in headless Chromium, with no page errors:**

- Boot is the new user, in the simple view.
- X shows classic with the card.
- Try it shows the simple tab with a total of 140 000 Ft, unchanged.
- More > Classic view opens the sheet. The answer is recorded.
- O, Q and Y in classic reach month 12.
- The panel toggle goes to simple.
- U gives the new user in simple. X then gives classic with the card again.
- With `?view=simple`:
  - X shows simple, with the Classic row on More.
  - O, Q and Y reach month 12.
- With `?simple=0&view=simple`: X shows the old tab with no card. O works.

## Files

- New: `js/14c-simple-optin.js`. It loads after `14b-simple-tab.js` and is listed in `index.html` and `sw.js`. `server.js` needs a restart to serve it.
- `js/08-persely-pages-sheets.js`: `vHub()` records first sight, picks the view and shows the card on the classic tab. That is 3 lines.
- `js/13-settings-demo.js`: one line for the Settings switch.
- `js/03-selfchecks.js`: `SP_CHECK_VIEW` set and restored, and one call to `spOptinChecks`.
- `css/app.css`: `.spoptin` and `.spwhy`.
- `sw.js`: the cache is now `otp-demo-v65` (another agent uses v64).
- `dist/otp-persely-demo.html` was rebuilt.

## Open

- The two week judgement (plan risk 1) needs real usage data. The answers stay on the phone, so nothing is collected yet.
- The app day only moves with the demo clock (weeks and months), not with real days.
- The classic tab is today's tab, including its Persi hint strip. It was not simplified.
- Not checked on a real iPhone.
