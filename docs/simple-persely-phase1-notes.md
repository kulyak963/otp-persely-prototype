# Simple Persely: Phase 0 and Phase 1 notes

Plan: `docs/simple-persely-plan.md` (2a, 3). Decisions: `docs/simple-persely-decisions.md` (D1, D2, D3, D7, D10, D13 used here). Branch: Tamas-branch.

## Flag

- `SIMPLE_PERSELY` in `js/01-tokens-helpers.js`: on by default, `?simple=0` in the address turns it off (read once at load).
- Off = the pre-Simple first run, unchanged: setup card with 6 tiles, Home "Start your first goal", the 3-step wizard, "Create goal moves no money", "Start your streak?" and the "Want a Sunday nudge?" sheet.
- `SP_LEGACY` (js/14b) is for the self-checks only: it renders the off state in the same page, because the flag itself is a constant.
- Everything new goes through `spOn()` / `spFirstRun()`.

## What was built (Phase 1)

New file `js/14b-simple-persely.js` (loaded before `js/15-boot.js`; listed in `sw.js`, picked up by `server.js` and the offline build).

| Plan item | Built |
|---|---|
| Home, new user | One card "Save your first 1 000 Ft" right under the account carousel (bottom at about 387 px at 390 x 844). It opens the Persely tab. The analyst first-run notice is one line under it: "Your analyst reads your OTP payments to show Safe to spend. Nothing leaves OTP. Learn more · Turn off" (both links the same style; lawful-basis marker kept). The Quick action "Add money to a goal" stays (Home revert is Phase 6). Existing users' Home is unchanged. |
| Persely tab, no goal | Persi: "Hi! Let's save your first 1 000 Ft." Then "What are you saving for?", 4 tiles (Trip, Phone or tech, Safety net, Something else) and a "More goals" link that opens the existing tile sheet (Own home, Driving licence, Studies, Shared, Euro). No hints, no grey story ring, no Junior row on this screen (22 words). |
| Confirm screen | In the `#onb` layer. Tile icon and name; "150 000 Ft · August 2028"; "1 000 Ft now"; "From your Junior account"; switch "On payday, Persi asks to save 10%" (on, asks first, keeps the 20 000 Ft floor as before); honesty line "3.0% until 10 September 2027 · Withdraw any time · Protected ⓘ" (CONFIRM WITH OTP marker kept; ⓘ opens a short "Good to know" sheet with the existing conditions); one green button "Save 1 000 Ft now". 24 or 25 words. |
| Change links | Name (inline field), target and date (one row, one Change: the existing amount slider and month picker open inline), amount (chips 500 / 1 000 / 2 000 / 5 000 Ft; chips that would break the 20 000 Ft floor are disabled). |
| Edge states | Junior under 21 000 Ft: "Save 500 Ft now". Under 20 500 Ft: "Create goal" and "Persi will ask on payday.". Offline: button disabled, "No connection. Try again.". Failure: "That did not work. Your money did not move. Try again." and the state is put back. `__simple.forceOffline` / `__simple.forceFail` simulate them. |
| One tap | `spSave()`: `applyOnb()` (goal and its rules) + `depositTo()` (balances, transaction, streak) in ONE `undoable()` entry. The first deposit starts the streak (week 1). Undo removes the deposit and the goal together. No "Start your streak?" sheet, no nudge sheet. |
| Reward | Same tap, on the Persely tab, no page or sheet over it (queued sheets wait while it shows). Card above the Undo chip: 3D Persi with `pig3d.celebrate()` coin drop, flame "Week 1 done", "1 000 Ft saved!", one button "Great". Coin chime (`coinSound`) unless Settings > Persely > Sound is off (new switch, default on) or the demo sound is off; the `ambient` audio session makes iPhone's silent switch mute it. Haptic tick via `navigator.vibrate` where it exists. Reduced motion: a fade, no jump, no coin. At most one celebration per app open. Measured: 41 to 216 ms from tap 3 to the reward. |
| Sunday nudge | After the first deposit `S.nudgeAsk = 'wait'`; the next visit to the Persely tab (or the next app open) turns it into Persi's line "Want a nudge on Sunday?" with equal Yes / Not now buttons. The phone permission is asked only after Yes. Hook: `spNudgeHTML()` in the Persi line of `vHub()` (Phase 2's Persi engine should call it). |
| Later goals | New goal (New +, Goal reached, Add money without a goal) opens the same 4 tiles + More goals and the same confirm screen. The deposit is optional there: chips start at "No deposit" ("Create goal"); a chip makes it "Save 2 000 Ft now" in the same tap. Existing goals do not change. |
| Honesty footer | Add money sheet (footer only) and the goal page footer (replaces "Withdraw any time, free of charge."). The tab gets it in Phase 2. |

Copy rules checked in the app: at most 25 words per first-run screen, Persi at most 8 words, sentences at most 12 words, no "deadline", verb first on buttons, amounts "1 000 Ft", full dates. Words are tokens with a letter; amounts, percentages and the digits of dates count as numbers.

## Measure script (Phase 0)

`node tools/build-standalone.mjs && node tools/measure-simple.mjs` (or `APP_URL=http://localhost:8090/`, `SIMPLE=0` for the before table). It prints words, numbers, controls and scroll height for Home and the Persely tab (both seeds), the confirm screen, the reward and the tab after the deposit, then clicks the 3-tap path and runs `__checkAnalytics()` on the same page.

| Screen (390 x 844) | Before (`?simple=0`) | After |
|---|---|---|
| New user, Persely tab | 88 words, 12 numbers, 12 controls, 1 128 px | 22 words, 1 number, 6 controls, 781 px |
| New user, Home | 190 words, 1 978 px, Persely card below the fold | 179 words, 1 903 px, card at about 387 px |
| Confirm screen | (3 wizard steps, 71 to 107 words each) | 24 words, 7 controls |
| Reward | (toast behind the nudge sheet) | 4 words, 1 control |
| Taps to first saved forint | 7 | 3, reward on the same tap |

## Self-checks

- Flag on: 223 of 223. `?simple=0`: 212 of 212 (exactly the old set; the new checks run only with the flag on). Same numbers in the offline build.
- New, real: `chk-simple-3-taps`, `chk-simple-reward-same-tap` (incl. the nudge on the next visit), `chk-simple-edge-states`, `chk-simple-honesty-line`, `chk-simple-flag-fallback`, `chk-simple-motion-sound`, `chk-simple-one-primary` (first-run screens), `chk-simple-first-run-words`.
- New, stubs (pass with a "stub" note): `chk-simple-grade` (Phase 4), `chk-simple-analyst-line` (Phase 6), `chk-simple-hu-keys` (Phase 4). The other plan checks (tab blocks, words and numbers on the tab, no hints, More complete, push cap) belong to the Phase 2 and 3 tracks.
- Gated (old assertion on the legacy first run + a new-world assertion when the flag is on, nothing deleted): `chk-seed-new-default`, `chk-setup-above-fold`, `chk-glossary-terms`, `chk-date-format`, `chk-good-to-know`, `chk-one-wizard`, `chk-create-no-money`, `chk-first-goal-payday-only`, `chk-home-order`, `chk-tab-order`, `chk-entry-map`, `chk-analyst-notice`.

## Calls made (deviations from the plan text)

- Phone or tech has no `GOAL_PRESETS` entry; it uses its own preset (New phone, 120 000 Ft). The 4 tiles use short names (Trip, New phone, Safety net, My goal); More goals keeps the old preset names. `GOAL_PRESETS` itself is unchanged so the `?simple=0` setup card keeps its 6 tiles.
- Target and date share one row and one Change link (3 Change links, not 4): with 4 the confirm screen goes over 25 words for two-word goal names.
- Hint strips are marked seen when the first goal is created through the simple path, so the reward lands on a clean tab. The Persely tab for users with goals is otherwise untouched (Phase 2).
- The deposit keeps the 20 000 Ft floor, so the edge states follow it.

## What remains (Phase 2 and later)

- Phase 2: the 4-block tab, jars and the big number, More page, Persi priority engine (call `spNudgeHTML()` from it), delete hints and the grey ring, honesty line on the tab.
- Phase 3: Rate and safety sheet (the ⓘ should open it instead of `spgtk`), Add money and goal page simplified (D5 last amount), Saving rules + Money in, push cap and copy fixes.
- Phase 4: copy pass, HU keys, in-app FK. Phase 5: demo script, hallway test. Phase 6: Home back to the OTP skeleton (removes the Quick action). Phase 7: opt-in for existing users.
- Not verified: the chime against a real iPhone silent switch and the haptic on a device (Chromium only here).
