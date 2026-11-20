# Simple Persely, Phase 4 (copy pass): notes

Plan: `docs/simple-persely-plan.md` 2f, 2g, 3 (Phase 4). Decisions: `docs/simple-persely-decisions.md` (D11, D14). Hungarian: `docs/simple-persely-hu.md`.
Every copy change is behind `SIMPLE_PERSELY`. `?simple=0` shows the old words, and the 212 old checks pass.

## Copy changed (flag on), 16 strings
Phase 3b had already done plan 2f items 1, 2, 3, 4, 6, 8 (push), 9, 10, 11 (New goal sheet), 12, 13, 14 and 15. Checked in the code before editing.

| Where | Before | Now |
|---|---|---|
| Fast-forward stop line (`js/14-fastforward.js`) | "... and keep my 3.0% ..." | "... and keep your 3.0% ..." |
| Settings > Persely > Junior status | "Junior package until [date] · Keep my 3.0%" | "Your 3.0% ends on [date] · Keep your 3.0%" (item 6) |
| Settings > Notifications > Monthly story | "When your month story is ready" | "When your month story is here" |
| Monthly story push (and so the inbox) | "Your November story is ready. Take a look." | "Your November story is here." (month from `S.period`) |
| Home story card | "Your November is ready" | "Your November story is here" (month from `S.period`) |
| Perks row (More) | "5 offers waiting for activation · 0 rewards" | "5 deals to turn on" (item 7; rewards are in Habits > My rewards) |
| My cards > Discounts row | "5 offers waiting for activation" | "5 deals to turn on" |
| Setup card (only when the classic first run shows with the flag on) | "3.0% a year on up to 500 000 Ft with your Junior account until [date]" | "3.0% a year on up to 500 000 Ft. Until [date]." (item 11) |
| More > Persely settings | "Reminders and default rules" (FK 9.6) | "Sunday nudge and rules for new goals" (2.3) |
| More > Add friends | "Compare weekly streaks. Nobody sees your balance" (6.0) | "See your friends' streaks. Nobody sees your money" (2.2) |
| More > Save in euro | "For Erasmus and travel. No Junior rate" (4.3) | "For Erasmus and trips. No Junior rate" (2.6) |
| Habits, first bullet | "Save any amount once a week. Automatic savings count too." (4.1) | "Save any amount once a week. Your saving rules count too." |
| Add money > Change, account rows | "87 450 Ft available" (9.2) | "You have 87 450 Ft" |
| Habits reminder notice, notifications blocked | "No reminders: ... To get them back, allow notifications for this app in your phone Settings." (13 words) | "No reminders. You can still save any time. To get them back, turn on notifications in your phone Settings." (11) |
| Habits reminder notice, off | "Reminders are off. Turn on notifications to get your Sunday reminder." (8.0) | "Reminders are off. Turn them on to get a nudge on Sunday." (1.5) |

- "Persely pays ..." (Why Persely?) only shows with `?simple=0`: with the flag on, Why Persely? is Rate and safety.
- The Perks push and its inbox entry were fixed in Phase 3a ("Pizzeria Roma: 15% off. You can turn it on in Perks.").
- "deadline": the 5 places in the code are comments or self-check text, never on screen. Nothing to change.
- Kept on purpose: "Keep my 3.0%" as the name of the action (More row, the Rate and safety link, the Junior page button). It is a button the student presses, so it speaks as the student. The instruction named only the fast-forward line and the Settings row.

## Checks
In `js/14c-simple-copy.js`, called from `__checkAnalytics` with the flag on. The two Phase 1 stubs are gone.

**`chk-simple-grade`** reads the screens in the app. It does not use a list of strings.
- Screens:
  - first run tab; confirm screen for the 4 tiles (with Change open); reward; New goal sheet
  - the tab after the first deposit and in 8 states: existing seed, welcome back, week open, goal reached, payday asked, month end, one goal, Graduate
  - More, Habits
  - Rate and safety (Junior and Graduate)
  - goal page with its settings open: 2 goals with money, 1 empty goal
  - Add money (with Change open, and with one goal)
  - every sentence Persi's priority can say
- A text is the visible text under one element that is not `display:inline`, so "about **1 380 Ft** a year" stays one text. Goal names are the student's own words and count as "goal".
- Rules:
  - FK grade 4 or lower (`fkGrade`), 12 words or fewer per sentence, Persi 8 words or fewer
  - no hyphen in a subtitle (`small`, `.fine`, `.k`), no "deadline", no urgency words
  - full dates (no "10 Sep"), amounts as "50 000 Ft" (no "50000 Ft", no "HUF")
- Not graded: one-word labels (FK of one word says nothing: "Withdraw" is 8.4), and the whitelist `SP_GRADE_WL`, each entry with its reason:
  - screen and term names: Rate and safety, Settings for this goal, Persely settings, Deposit protection, Standard rate, How Persely works, Saving rules, Savings account, Financial health score, Between my accounts
  - the rule names: Payday rule, Weekly transfer, Round-ups (glossary)
  - Notifications, Your messages, New messages; Junior account; Save in euro
  - the tile names (D10): Trip, Phone or tech, Safety net, Something else, New phone
  - a full date on its own; "3.0% until [date]" as one part of the honesty line (the whole line is FK 3.4)
  - "Your November story is here." (FK 5.2): the plan's wording; only the 3 syllable month name in 5 words lifts it
- The failure message lists the worst 8 texts: screen, text, why.
- `window.__spGradeLast` keeps the full list of the last run.
- **Last run:** 194 texts, 0 failing.
  - Highest graded text outside the whitelist: 3.9, the honesty line with a December date ("3.0% until 25 December 2026 · Withdraw any time · Protected").
  - Then 3.7: "From your Junior account", "A state scheme protects your money up to a limit.", "Streak and saving rules" and the weekly figure on the goal page.
  - Goal names score high ("Summer holiday" 14.7) but are the student's words, so the check reads them as "goal".

**`chk-simple-hu-keys`**:
- Every key in `SP_STRINGS` (177 keys) has a non-empty `HU` draft with the same placeholders.
- "Persely" and "Persi" are kept.
- Decimal comma; no English month names.
- The HU proxy on the glance strings.
- Every Persi priority sentence is a registered template.
- The draft marker is there.

**Results** (390 x 844, fresh context, service workers blocked):
- `?demo=1`: 238 of 238.
- `?demo=1&simple=0`: 212 of 212.
- No console errors.

## Files
- `js/14c-simple-copy.js` (new): the two checks and the whitelist.
- `js/hu-strings.js` (new): `SP_STRINGS`, `HU`, `HU_DRAFT`, `spT()`. Data only.
- Both are loaded after `js/14b-simple-tab.js` and before `js/15-boot.js` (`index.html`, `sw.js` FILES). `server.js` serves every `js/*.js`. The offline build inlines them.
- `sw.js` cache `otp-demo-v64`.
- String edits, all gated:
  - `js/05-home-transactions.js` (story card, card page Discounts row)
  - `js/07-spending-money.js` (Perks row)
  - `js/08-persely-pages-sheets.js` (setup card, Add money account rows)
  - `js/09-events-device.js` (reminder notice)
  - `js/13-settings-demo.js` (Settings Junior row, story switch, story push)
  - `js/14-fastforward.js`
  - `js/14b-simple-tab.js` (More subtitles, Habits bullet)
- `js/03-selfchecks.js`:
  - the 2 stubs are removed and one line calls `spGradeChecks`
  - `chk-story-month-end` expects the new card wording with the flag on

## Not done / to check
- Plan item 5 ("Put money into your Persely savings" → "Save for a goal") is the Home quick action. Home belongs to Phase 6, which removes that row (plan 2c). Not changed here.
- The Junior ends push ("... Get your salary paid to OTP to keep your 3.0% on the first 500 000 Ft for 12 more months.") is 21 words in one sentence. It is Phase 3a's text, and pushes are not in the grade check. It is registered in `SP_STRINGS` (push.junior).
- Not read by `chk-simple-grade`:
  - the Withdraw sheet
  - Good to know behind the confirm screen's ⓘ (the full legal conditions)
  - the old "More goals" tile sheet
- The Hungarian drafts are machine drafts. A native speaker and OTP must check them before hallway round 2 (D14).
