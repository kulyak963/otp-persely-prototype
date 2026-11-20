# Simple Persely: hallway test kit (Phase 5)

Plan: `docs/simple-persely-plan.md` section 3 (Hallway test, acceptance criteria) and P45 / A029 in section 5. Decisions: `docs/simple-persely-decisions.md` (D14: round 1 in English, round 2 in Hungarian).

Five people find most of the common problems (A029: 91%) but only about 38% of all problems. So this is a small, repeated test: run round 1, fix, run round 2.

## 1. Sign off before the test

The pass thresholds below are the plan's proposal. **The product owner signs them off before the first session** and does not change them after seeing the results.

| Item | Proposed | Signed off (name, date) |
|---|---|---|
| Thresholds T1 to T8 (section 4) | As in the table | |
| T1 time limit | Median 30 s or less from first open | |
| SEQ limit for T1 | 5.5 of 7 or more (mean) | |
| What counts as "unaided" | No hint, no question answered by the moderator | |
| Round 2 language | Hungarian strings (`js/hu-strings.js`, checked by a native speaker first) | |

## 2. People

- 5 people, aged 18 to 29.
- At least 3 not in finance or business studies.
- At least 2 who do not use OTP.
- Nobody from the team, and nobody who has seen the pitch.
- Note for each: age, study field, bank used, saves now (yes / no / sometimes). Nothing else, no names on the sheets (use P1 to P5).

## 3. Set-up

- Phone or laptop at 390 × 844. Laptop: Chrome device mode or the app's iPhone frame.
- Address: `http://localhost:8090/?demo=1&view=simple`, panel hidden with `H` (the keys still work for the moderator).
- Before each person: press `U` (new user, fresh data). For T3 to T8 the moderator sets the state named in the task.
- Sound on (the reward chime is part of T2).
- No hints, no help, no tour. The moderator reads each task aloud once, from this sheet, and may repeat it word for word.
- Think aloud: "Please say what you look at and what you expect."
- One observer writes the sheet (section 6). A second person times with a stopwatch, or record the screen.
- About 15 minutes a person.

## 4. Tasks and pass thresholds

| Task (said aloud) | State before | Pass if |
|---|---|---|
| T1 "Put your first money aside for something you want." | `U`, Home | 4 or more of 5 finish unaided in 3 taps or fewer; median 30 s or less from first open; SEQ 5.5 of 7 or more |
| T2 "What just happened?" (right after T1) | Reward on screen | 4 or more of 5 say money was saved **and** it can be taken back |
| T3 Five second test on the existing user tab: show it for 5 s, hide it, ask "How much is saved? What should you do next?" | `X` (existing user, simple view), Persely tab | 4 or more of 5 give the amount (140 000 Ft) and "add money" |
| T4 "Take 500 Ft back out." | After T1 or `X`, Persely tab | 4 or more of 5 in 2 taps or fewer (Withdraw, then the amount) |
| T5 "What interest do you get, and until when?" | Persely tab | 4 or more of 5 say 3% and the date (10 September 2027), with or without Learn more |
| T6 "Is this money safe? Can you get it any time?" | Persely tab | 4 or more of 5 answer yes and give a reason |
| T7 "Change how much moves in on payday." (behind More) | `X`, Persely tab | 3 or more of 5 in 3 taps or fewer |
| T8 "Read Persi's sentence and say it in your own words." | Persely tab | 4 or more of 5 correct |
| Exit question "Would you open this again this week? Why?" | | Qualitative only, not pass or fail |

Shortest paths the app has today (for the observer, not for the person):
- T1: Home card "Save your first 1 000 Ft" → a tile → "Save 1 000 Ft now" (3 taps).
- T4: "Withdraw" under Add money → a chip or the typed amount → the Withdraw button. That is 3 taps with a chip. The plan's "2 taps or fewer" only holds if the amount entry is not counted: decide how to count before the test.
- T5: the honesty line "3.0% until 10 September 2027" is on the tab; "Learn more" opens Rate and safety.
- T7: "More: goals, rules, rate" → a goal's Saving rules row (opens the goal's settings) → Payday rule % (3 taps).

## 5. SEQ (Single Ease Question)

Right after T1, and after T4 and T7, ask: "Overall, how easy or hard was this task?" and show a 7 point scale: 1 Very hard … 7 Very easy. Write the number only. Report the mean per task (and the lowest score). The T1 limit is a mean of 5.5 or more.

## 6. Observer sheet (one page per person)

| | P_ | Age / field / bank / saves |  |  |  |
|---|---|---|---|---|---|
| **Task** | **Taps** | **Time (s)** | **Unaided? (Y/N)** | **SEQ (1 to 7)** | **Pass? (Y/N)** |
| T1 first money aside | | | | | |
| T2 what happened (saved? can take back?) | | n/a | | n/a | |
| T3 5 s test: amount / next action | n/a | n/a | | n/a | |
| T4 take 500 Ft out | | | | | |
| T5 rate and date | | | | n/a | |
| T6 safe? any time? reason | n/a | n/a | | n/a | |
| T7 payday amount | | | | | |
| T8 Persi in own words | n/a | n/a | | n/a | |

Notes for every task: where they looked first, where they hesitated (more than 3 s), what they said, wrong taps.

| Problem seen | Screen | Task | Severity (1 cosmetic, 2 slows, 3 blocks) |
|---|---|---|---|
| | | | |
| | | | |

Exit question (their words):

## 7. How to read the results

- Count passes per task across the 5 people and compare with section 4. A task passes or fails as a whole; do not average across tasks.
- A problem seen by 2 or more people is a fix for round 2. A severity 3 problem seen once is also a fix.
- T1 time: take the median of the 5 times. The plan's value (30 s or less) is a guess; it has not been measured with people.
- T3 and T8 test the picture and Persi's sentence (N = 4 blocks, the 40 word limit). These are hypotheses; a fail here questions the design, not only the copy.
- T7 checks that hiding things behind More does not make them hard to find. A fail means a row on More needs a better label or a shortcut.
- Do not read SEQ alone: a high SEQ with a failed task is a false sense of ease.
- Write the results into a short table (task, passes, median time, mean SEQ, top problems) next to this file, then list the fixes.
- Five people miss rare problems (A029). Do not call the design finished after one round.

## 8. Round 2 in Hungarian

- After the round 1 fixes, and only once a native speaker and OTP have checked `js/hu-strings.js` (D14, `docs/simple-persely-hu.md`). The app has no language switch yet: round 2 needs the strings wired in, or a paper or Figma version of the same screens.
- 5 new people, same criteria, same tasks said in Hungarian, same thresholds.
- Hungarian has no FK grade. Use the team's proxy (8 words or fewer per sentence, at most 1 word over 12 letters per sentence) and a read aloud check.
- Check layouts with the longer Hungarian text (buttons, the honesty line, the Home card) before the session.

## 9. Numeric acceptance (measured now, before any person)

How to measure:

```
PORT=8113 node server.js &                                   # or the normal server on 8090
APP_URL='http://localhost:8113/?view=simple' node tools/measure-simple.mjs
APP_URL='http://localhost:8113/' SIMPLE=0 node tools/measure-simple.mjs     # the "before" table
```

Without `APP_URL` the script measures the offline build (`node tools/build-standalone.mjs` first). Use `?view=simple`: since Phase 7 an existing user opens on the Classic tab, so without it the "existing: Persely tab" row measures the Classic tab (287 words). The script counts every visible word on the screen, including the title and the honesty line, so its numbers are higher than the in-app checks, which leave out the honesty line, the rate and its date.

Output on 20 November 2026 (headless Chromium, 390 × 844, flags on):

| Screen | Words | Numbers | Controls | Scroll px |
|---|---|---|---|---|
| new: Home | 83 | 15 | 16 | 1 376 |
| new: Persely tab | 22 | 1 | 6 | 778 (no scroll) |
| existing: Home | 67 | 16 | 15 | 1 234 |
| existing: Persely tab | 26 | 7 | 8 | 778 (no scroll) |
| new: confirm screen (Trip) | 24 | 8 | 7 | 688 |
| new: reward | 4 | 2 | 1 | 288 |
| new: Persely tab after the deposit | 29 | 6 | 5 | 778 (no scroll) |

With `SIMPLE=0`: new Persely tab 88 words, 12 numbers, 12 controls, 1 156 px; existing 269 / 46 / 25 / 2 633 px; Home 190 and 173 words.

Plan section 3 acceptance table, filled in:

| Criterion | Target | Measured now | Met? |
|---|---|---|---|
| Taps from first open to first saved forint | 3 | 3 (Home card → Trip → Save 1 000 Ft now), script and `chk-simple-3-taps` | Yes |
| Taps to the first visible reward | 3, same tap | 3, same tap | Yes |
| Time from the 3rd tap to the start of the reward | 500 ms or less | 126 to 176 ms over 5 runs (`SP.last.ms`) | Yes |
| First run median time to first saved forint, with people | 30 s or less | **Not measurable here**: needs the hallway test (T1) | Open |
| Words on the tab above More | 40 or less | Script: 22 (new), 29 (after the deposit), 26 (existing), all text counted. In-app `chk-simple-words-numbers` (honesty line not counted): 32 to 38 over 9 states, pass | Yes |
| Words per first run screen | 25 or less | Tab 22, confirm screen 24, reward 4 | Yes |
| Numbers on the tab | 3 or less + the rate | In-app check passes in every state. The script's 6 to 7 include the rate, its date (2 groups) and the week number | Yes (in-app rule) |
| Controls on the tab (no tab bar) | 4 or less | In-app check: 4 or fewer besides the jars and Persi (Add money, Withdraw, honesty line, More), pass. Script counts 5 to 8 because it adds the jars and Persi | Yes (in-app rule) |
| Scroll length of the tab | No scroll, content 778 px or less | Content 619 px (existing), 444 px (new); scroll height equals the 778 px view | Yes |
| Reading grade | FK 4 or less, sentences 12 words or less, Persi 8 words or less | `chk-simple-grade`: 194 texts, 0 failing; highest graded text 3.9 (the honesty line with a December date) | Yes |
| Persi voices at once | 1 | 1 Persi block on the tab (new and existing); no hint strips | Yes |
| Persely pushes | 1 a day or fewer, no "now!" | Three demo pushes on one app day: 1 banner, 3 in the inbox; `chk-simple-push-cap` and `chk-simple-no-urgency` pass. Real triggers for milestones, Junior 90 / 30 / 7 days and the Sunday reminder are still demo keys only | Yes (demo triggers) |
| Home Persely entries | 1 card | Existing user: 1 card (plus the Persely · total account card, allowed). New user: 1 card plus OTP's original For you offer "Start saving efficiently!", which hides after the first goal | Open (see decision below) |
| Self-checks | All pass | 277 of 277 (`?demo=1`, also with `?view=simple` and `?view=classic`); 242 of 242 (`?otphome=0`); 212 of 212 (`?simple=0`); no console errors | Yes |

Not measurable here: anything with people (time, SEQ, comprehension), the chime against a real iPhone silent switch, the haptic on a device, safe area insets on a real iPhone.

Open decision for the product owner: should the For you offer "Start saving efficiently!" also hide for a new user, so Home has exactly one Persely entry before the first goal? It is an original OTP card, which is why Phase 6 kept it.
