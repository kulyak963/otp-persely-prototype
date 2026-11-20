# Simple Persely: plan to make the Persely tab work for a 10-second attention span

Plan only. Nothing here is built. Measured on `dist/otp-persely-demo.html` (branch Tamas-branch + 1 commit), 390 x 844, deviceScaleFactor 2, Playwright Chromium, 20 November 2026. Screenshots: `shots/`. Evidence: playbook P01-P45 (strengths copied, not upgraded). Anything without a pattern ID is marked **hypothesis**.

## Summary

1. **Biggest change: first saved forint in 3 taps instead of 7.** The path becomes Persely card, goal tile, "Save 1 000 Ft now". One tap creates the goal and moves 1 000 Ft (Undo for 10 s). The reward (coin into Persi, flame, sound if the phone is not on silent) plays on that tap. Today the first visible reward comes at tap 8, as a toast hidden behind the "Want a Sunday nudge?" sheet.
2. The Persely tab becomes 4 blocks with no scroll: Persi's one sentence, a picture of the jars with one big number, one big "Add money" button (with a Withdraw link), and the streak as dots. Everything else goes behind one "More" row. Today an existing user scrolls 2 631 px past 345 words, 45 numbers and 25 controls.
3. Targets: at most 40 words and 3 numbers (plus the rate) on the tab. Every text at grade 4 or lower. No sentence over 12 words.
4. Cut from the first run: wizard steps 2 and 3, the 4 Persi hint strips, the Sunday-nudge sheet straight after the deposit, and the 6 Persely entries on Home (5 for a new user plus the first-run analyst card).
5. Rules that stay visible as one honest line plus "Learn more": the 3.0% rate and its end date, withdraw any time, deposit protection, and the analyst data notice. Notifications: at most 1 Persely push a day, no fake urgency, no marketing under Persi's name.
6. Home goes back to the original OTP skeleton (commit `eb807a7`) **later**, after the tab is simplified. The single Persely entry is the original teaser card slot. Every later Home addition gets a new home, so no feature is left without an entry point.
7. Rollout: 7 phases (S/M) behind a `SIMPLE_PERSELY` flag, with 14 new self-checks named here. About 38 existing checks are gated or rewritten (12 for the tab, 29 for Home, 3 overlap). A 5-person hallway test with pass thresholds agreed in advance.
8. 15 decisions for the product owner are listed with options and a recommendation each.

---

## 1. Measured current state

Method:
- The counts come from the DOM of each screen's top layer: the view, page, sheet or wizard.
- "Above fold" means visible without scrolling. That is 778 px for tabs (844 minus the 66 px tab bar) and 844 px for pages and sheets.
- For sheets, the scroll / height column is the sheet's own height.
- Numbers are digit groups such as "64 000 Ft", "3.0%" or "300".
- Reading grade is Flesch-Kincaid, from a script in this session (`/home/claude/sp/analyse.py`). Syllables use a vowel-group heuristic, because textstat could not load its dictionary offline. Each UI fragment counts as one sentence.
- **Limitation:** FK is an English formula. Students use the app in Hungarian, and FK does not transfer to Hungarian (see 3g).

### 1.1 First run (new-user seed, X = new): first open to first saved forint

| Step | Screen (screenshot) | Taps so far | Words on screen | Numbers | Controls |
|---|---|---|---|---|---|
| 0 | Home, first launch (`01-home-new-user`). The analyst card is on top. The "Start your first goal" card sits at y = 913 px, **below the fold** (`01c`) | 0 | 238 (126 above fold) | 21 | 25 |
| 1 | Persely tab (`02-persely-tab-new-user`): 6 tiles, Persi, a 0 Ft gauge | 1 | 104 | 12 | 12 |
| 2 | Wizard step 1, Goal (`03`) | 2 | 71 | 16 | 13 |
| 3 | Wizard step 2, Money in: 3 rules (`04`) | 3 | 107 | 16 | 10 |
| 4 | Wizard step 3, Check and create plus Good to know (`05`) | 4 | 103 | 18 | 4 |
| 5 | Goal page plus sheet "Start your streak?" with an **empty** amount (`06`, `07`) | **5 = first goal** | 53 (sheet) | 7 | 10 |
| 6-7 | 1 000 Ft chip, then Add money | **7 = first saved forint** | | | |
| 8 | Sheet "Want a Sunday nudge?" covers the reward toast (`08a`, `08`). The reward shows only after Turn on or Not now, as 2 stacked toasts (`08b-…-1`) | **8 = first visible reward** | 26 | 2 | 3 |

- **Screens to first goal:** 5 after Home (tab, 3 wizard steps, goal page). **Screens to first forint:** 6 (plus the sheet).
- **Words passed on the way:** 438 (104 + 71 + 107 + 103 + 53). **Numbers passed:** 69.
- **Reward moment:**
  - No sound. `chime()` plays only for push banners, and `coinSound()` only on slider release.
  - `pig3d.celebrate()` drops a coin into Persi on the Persely tab, but the goal page covers the tab at that moment (`08b`).
  - The streak toast "🔥 1-week streak. 1 000 Ft added to Erasmus in Lisbon" shares the screen with "No reminder. You can turn it on from the streak card".
- **First return to the tab** (`09`): 2 295 px scroll, 293 words, 36 numbers, 19 controls, 4 Persi hint strips.

### 1.2 Persely tab

| Metric | New user, before goal (`02`) | New user, after first deposit (`09`) | Existing user, seed X (`10`, `10b`) |
|---|---|---|---|
| Scroll length | 1 156 px (1.5 screens) | 2 295 px (2.9) | **2 631 px (3.4)** |
| Top-level blocks | 5 + header | 15 incl. 4 hint strips | **17** (13 content blocks + 4 hint strips) + header |
| Text elements, total / above fold | 28 / 20 | 59 / 21 | 78 / 21 |
| Words, total / above fold | 104 / 67 | 293 / 104 | **345 / 105** |
| Numbers, total / above fold | 12 / 7 | 36 / 14 | **45 / 14** |
| Controls (no tab bar), total / above fold | 12 / 11 | 19 / 8 | 25 / 8 |
| Repeats of "3.0%" / "Junior package" / "500 000" | 2 / 2 / 2 | 4 / 3 / 3 | 4 / 3 / 3 |
| Persi voices at once | 1 | 1 line + 4 hint strips | 1 + 4 hint strips |

Existing-user tab order (`10b`):
- hint
- Persi + story ring (grey, "At month end") + Total gauge + 3.0% line + Add money / Withdraw + trust line + fine print
- hint
- Goals (3 cards, 2 with fix buttons)
- Saving rules (3 rows) + note
- hint
- Money in each month
- Junior row
- hint
- Your habits: streak, 8 dots, reminder notice, health score 50 of 100
- Spending row, Perks row
- How Persely works, Add friends

### 1.3 Connected screens

| Screen (screenshot) | Height / scroll px | Words | Numbers | Controls | Concept terms* |
|---|---|---|---|---|---|
| Home, new user (`01b`): Persely shows in 5 places (Persely total card, Why Persely?, Junior row, Add money to a goal, Start your first goal) | 2 036 | 238 | 21 | 25 | 6 |
| Home, existing user (`11b`): 5 Persely places (total card, Why Persely?, Junior row, Add money to a goal, 8-week streak card) | 1 762 | 201 | 23 | 22 | 5 |
| Goal page, new goal (`06`) | 1 130 | 169 | 29 | 12 | 11 |
| Goal page, existing user (`12b`) | 1 074 | 161 | 24 | 9 | 10 |
| Add money sheet (`13`) | 630 | 47 | 7 | 12 | 1 |
| Saving rules sheet (`14`) | 595 | 86 | 3 | 7 | 6 |
| Money in each month sheet (`15`) | 515 | 51 | 3 | 7 | 3 |
| Settings, Persely section and the rest (`16b`) | 2 084 | 237 | 19 | 35 | 13 |
| Perks (`17`) | 844 | 74 | 16 | 8 | 2 |
| Health score sheet (`18`) | 721 | 144 | 22 | 2 | 4 |
| Your 3.0% rate / Junior page (`19`) | ~984 | 111 | 21 | 3 | 12 |
| Why Persely? (`20`) | 601 | 104 | 20 | 2 | 7 |
| Good to know (`21`) | 548 | 50 | 8 | 3 | 9 |
| How Persely works (`22`) | 764 | 124 | 13 | 3 | 17 |
| Analyst "What it reads" (`23`) | 481 | 109 | 1 | 3 | 7 |
| Notifications inbox (`24`) | 844 | 43 | 8 | 5 | 4 |
| Monthly story (`25`): 11 slides, **40.8 s** (`__story.info()`) | | | | | |

\* Concept terms are hits of 3.0%, 500 000, tax, Junior package, deposit protection, payday rule, weekly transfer, round-ups, saving rules, money in, streak, skip, health score, Safe to spend, analyst, perks, rewards, split, planned, card spending, cap and salary.

**Notifications (code and guide):**
- 10 demo push types (keys 1-9 and P). 7 are signed "Persi · Persely".
- Settings has 6 toggles plus quiet hours.
- Only the late-bill push has a cap (1 a day). There is no overall daily cap.
- Push 8 says "Activate it now!" (urgency on a marketing message).
- Push 6 says "keep my 3.0%" inside Persi's sentence (wrong person).

**Readability (133 unique texts of 6 or more words on the screens above):**
- Median grade 2.5. 24 texts are above grade 5.
- Grade is **not** the main problem. **Volume** is: 345 words, 45 numbers and 24 concept hits on one tab.
- All 363 unique strings measured (2 122 words) are English only.

**15 worst texts** (FK grade, words; one demo-only string left out: "Real push notifications are switched off in this offline demo file", 7.2):

| # | Screen | Text | FK | Words |
|---|---|---|---|---|
| 1 | Why Persely? | "The Savings account pays more a year (3.5% against 3.0%) and both are taxed at 28%, while Persely adds goals and lets you withdraw any time with no fees, so check how you reach your money in the Savings account." | 15.4 | 40 |
| 2 | How Persely works | "3.0% a year for every Junior customer, automatically, on the first 500 000 Ft, until 10 September 2027" | 11.8 | 18 |
| 3 | Tab, Your habits | "Spending under income · no overdraft · a buffer · regular saving" | 8.9 | 9 |
| 4 | Settings | "We let you know right away about card payments, incoming transfers and how your Persely is doing." | 8.4 | 17 |
| 5 | Home, Quick actions | "Put money into your Persely savings" | 8.4 | 6 |
| 6 | Home / tab | "Junior package until 10 September 2027" | 8.4 | 6 |
| 7 | Tab, Perks row | "5 offers waiting for activation · 0 rewards" | 7.7 | 7 |
| 8 | Push 8 / inbox | "15% instant discount at Pizzeria Roma. Activate it now!" | 7.1 | 9 |
| 9 | What it reads | "It uses them to show Safe to spend, your regular bills, your categories and a plan for next month" | 6.7 | 19 |
| 10 | Health score | "Saves regularly toward a named goal" | 6.4 | 6 |
| 11 | Tab setup card | "3.0% a year on up to 500 000 Ft with your Junior account until 10 September 2027" | 6.3 | 17 |
| 12 | Goal page | "About 1 380 Ft a year after tax on 64 000 Ft, until 10 September 2027" | 5.9 | 16 |
| 13 | Goal page, new goal | "About 0 Ft a year after tax on 0 Ft, until 10 September 2027" (also a content bug) | 5.9 | 14 |
| 14 | Goal page | "At your pace (about 6 000 Ft a month) you get there in November 2027, after your goal date." | 5.9 | 19 |
| 15 | Why Persely? | "Persely pays 3.0% on the first 500 000 Ft until 10 September 2027." | 5.8 | 13 |

### 1.4 Findings used below (M = measured here)

| ID | Finding | Patterns |
|---|---|---|
| M01 | 7 taps and 438 words to the first forint. The deposit amount starts empty. | P02, P04, P28 |
| M02 | The reward is not seen: no sound, the coin is hidden behind the goal page, and the toast is queued behind a second question. | P36; celebration itself is a hypothesis |
| M03 | A permission-style question (Sunday nudge) comes right after the first deposit. | P32 |
| M04 | The new-user Persely card on Home is below the fold (913 px). | P18, P20 |
| M05 | The tab has 17 blocks, 4 hint strips and 3.4 screens of scroll. | P03, P16, P19 |
| M06 | 45 numbers and 4 repeats of the rate on one tab. | P41, P11 |
| M07 | The story ring sits on the tab all month as a grey, inactive control ("At month end"). | P40 |
| M08 | An unexplained "50 of 100" health score and a Perks row on the savings tab. | P41, P19 |
| M09 | Urgency in marketing copy and a grammar slip in a push. Only one push type is capped. | P13, P33 |
| M10 | Persely shows in 5 places on Home. | P16, P19 |

Earlier findings that touch this plan (`docs/ux-audit-persely.md`): F04 (Bills first headline on the Home card), F06 (tab overload, two entry points), F07 (notification permission dead end), F08 (two Persi messages at once), F10 (first-goal progress), F11 (score unexplained), F12 (friends).

---

## 2. Design

### a) The first 30 seconds

**Rule:** one purpose per screen, one primary button, Persi as the only voice.

**The 3-tap path** (from first open of the app):

| Tap | Where | What the user sees | Defaults chosen for them |
|---|---|---|---|
| 1 | Home: one Persely card above the fold, "Save your first 1 000 Ft". Or the Persely tab icon. | Persely tab, first-run state: Persi says "Hi! Let's save your first 1 000 Ft." Below it, "What are you saving for?" with **4 icon tiles** (Trip, Phone or tech, Safety net, Something else). | None yet |
| 2 | A tile, e.g. Trip | **One confirm screen**: tile icon + name ("Trip"); big amount "1 000 Ft now"; "From your Junior account"; switch "On payday, Persi asks to save 10%" (on, asks first); honesty line; small "Change" links for name, target, date and amount; one green button. | Goal name, target and date from the tile preset (as today, `GOAL_PRESETS`). First deposit 1 000 Ft. Payday rule 10%, asks first, keeps 20 000 Ft (as today). Weekly transfer and round-ups off. |
| 3 | **"Save 1 000 Ft now"** | Goal created **and** 1 000 Ft moved. The reward plays straight away on the Persely tab. Undo chip for 10 s. | |

**Reward moment** (same tap, starts within 500 ms):
- Persi jumps and a coin drops in. The existing `celebrate()` is used, with the Persely tab in front instead of the goal page.
- A short coin chime (`coinSound`) plays, following the phone's silent switch and an in-app sound setting.
- A haptic tick plays where the device supports it.
- The flame lights: "Week 1 done 🔥".
- Text: "1 000 Ft saved!" and one button, "Great".
- `prefers-reduced-motion` gives a fade instead of the jump.
- No second question on this screen.
- Celebration, sound and haptic are a **hypothesis**: the library has no evidence for celebration moments.

**Edge states:**

| State | What shows |
|---|---|
| Junior balance under 21 000 Ft (1 000 + the 20 000 Ft floor) | The button reads "Save 500 Ft now". Under 20 500 Ft it reads "Create goal". Persi: "Persi will ask on payday." |
| Offline | The button is disabled and reads "No connection. Try again." Nothing moves. |
| Error | "That did not work. Your money did not move. Try again." (P29) |
| Second and later goals | "New goal" in More opens the same tiles and confirm screen. The first deposit is optional there and has its own chips. |

**Cut from the first run, and where it goes:**

| Cut | Goes to |
|---|---|
| Wizard step 2 (3 rule switches) | Defaults. The goal page's "Settings for this goal" |
| Wizard step 3 (summary table + Good to know, 103 words) | Honesty line + Learn more on the confirm screen |
| Amount slider, month sheet, name field | "Change" on the confirm screen |
| "Start your streak?" sheet with empty amount | Merged into tap 3 |
| "Want a Sunday nudge?" right after the deposit | Persi's line on the **second** visit: "Want a nudge on Sunday? [Yes]". The phone permission is asked only after Yes (P32). |
| 4 hint strips | Deleted. Persi's one line replaces them (P03). |
| 2 of the 6 tiles (Own home, Driving licence, Studies are folded into Something else or More goals) | **Decision D10** |
| Analyst notice as the top Home card | One line, see 2e |

**Patterns:**
- P04 (moderate): goal plus concrete first action. H3 (hypothesis) for students.
- P02 (moderate): short steps. Note the caveat: one screen can beat several.
- P28 (strong, but form evidence is e-commerce, so an extrapolation): pre-fill what we know.
- P03 (strong): no tutorials.
- P26 (moderate): low friction for a low-risk, reversible move into your own savings.
- P30 (moderate): Undo, not a confirm dialog.
- P32 (moderate): permission in context.
- **Changes a decided rule:** "Create goal moves no money" (Phase 3 of persely-flow-plan, `chk-create-no-money`). See D2.

### b) The Persely tab as one glance

**N = 4 blocks + one "More" row. No scroll at 390 x 844: content height ≤ 778 px.**

| # | Block | Content | Limit |
|---|---|---|---|
| 1 | **Persi says** | 3D Persi, small, + one sentence. At month end a ring around Persi opens the story. There is no grey ring the rest of the month. | ≤ 8 words, 1 sentence |
| 2 | **Picture + the big number** | Up to 3 jars side by side, one per goal. Each jar has the goal icon and fills to its progress, with no numbers inside. A 4th goal or more shows "+2". Above the jars, the **one big number**: total saved, "12 000 Ft", caption "Saved". | Number 1 of 3 |
| 3 | **One big button** | "Add money": full width, 56 px, opens the Add money sheet with the last amount pre-selected (D5). Under it the text link "Withdraw" at 44 px. It stays one tap from the tab, so taking money out is as easy as putting it in (P13). | 1 primary, 1 link |
| 4 | **Streak** | Flame + "Week 4", 4 dots (this week ringed), caption "Save once a week". There is no "skips left" number. Skips are used automatically and explained in More. | Number 2 of 3 |
| - | **Honesty line** | "3.0% until 10 September 2027 · Withdraw any time · Protected ⓘ". It opens "Rate and safety" (see 2e). | The rate is not counted in the 3 |
| - | **More** | One row: "More: goals, rules, rate". It opens one page (1 level, P16, B027). | |

- **Number 3 of 3** is optional: the main goal's target ("of 150 000 Ft"), under the jar that is tapped or that is closest to done.
- **Removed from the tab:** gauge, "34% of what your goals need", the interest line in Ft, fine print, goal cards with dates, fix buttons, Saving rules list, Money in panel, Junior row, reminders notice, health score, Spending row, Perks row, links, the gear icon. All of them sit in More.

**Persi's sentence**, picked by a fixed priority (P19: explicit priority rules):

| Priority | When | Sentence |
|---|---|---|
| 1 | No goal | "Hi! Let's save your first 1 000 Ft." |
| 2 | A goal just reached | "You did it! Summer holiday is full." |
| 3 | Payday asked and still open | "Payday! Save 7 500 Ft?" (tap opens the payday sheet) |
| 4 | Junior ends in ≤ 90 days | "Keep your 3.0%? 85 days left." (tap opens the Junior page) |
| 5 | Story ready | "Your November story is ready." |
| 6 | Week open, Friday to Sunday | "Add any amount to keep week 4." |
| 7 | Default | "Nice! Your money is safe here." |
| 8 | Back after 3 or more days away | "Welcome back. Your 1 000 Ft is safe." |

A goal that is behind is never named on the tab. Its fix lives on the goal page, so the student meets it when they open that goal.

**More page** (one scroll page, grouped, icon + 1-3 word label):
- **Goals:** list of goal cards as today, plus New goal, Shared, Euro.
- **Saving rules:** read-only overview, plus "7 500 Ft a month moves in by itself". This merges the Money in panel.
- **Rate and safety.**
- **Keep my 3.0%.**
- **Habits:** streak detail, skips, health score with its one-line meaning.
- **Spending.**
- **Perks.**
- **Friends:** opt-in, as today.
- **Your year:** after 12 months.
- **How Persely works.**
- **Persely settings.**

**Copy limits for the tab and the first run:**
- FK grade ≤ 4 per text (English).
- Sentence ≤ 12 words. Persi ≤ 8 words.
- ≤ 40 words on the tab above More. Today: 345 (existing user), 104 (new user).
- ≤ 25 words per first-run screen. Today: 71-107 per wizard step.
- Labels are icon first, then 1-3 words, verb first ("Add money", "Withdraw", "New goal").

**Patterns:**
- P16 (moderate) and P18 (moderate): shallow IA, balance on top. B027: more than 2 disclosure levels usually hurts.
- P19 (moderate): one contextual message with a priority order.
- P41 (moderate): plain language. Its caveat: education alone does not change behaviour.
- P15 (strong): button at the thumb, 56 px.
- P40 (moderate): tappable looks tappable.
- P35 (moderate): a simple mode with a stable core.
- **Hypotheses (no library evidence):** N = 4, the 40-word limit, the grade-4 target, jars as a picture.
- Gap 8: empty states and tone of voice have only gallery-level evidence.

### c) Connections: keep, merge, hide behind More, delete

| Connected screen | Decision | Reason (measure, pattern) |
|---|---|---|
| Home Persely teaser card ("Start your first goal" / streak) | **Keep, move above the fold.** It is the only Persely entry on Home. | It sits at 913 px today (M04). P18, P20 |
| Home "Persely · total" card in the Balance carousel | **Keep.** It is an account balance, part of the OTP skeleton, not a promo. | P18 |
| Home Quick actions "Add money to a goal" | **Delete.** It duplicates the teaser card's action. | M10. P16 |
| Home "Why Persely?" | **Hide behind More** (Rate and safety) | 104 words, worst text (FK 15.4). P41 |
| Home Junior row (300 days) | **Merge** into the honesty line + Persi priority 4. On Home only in the last 30 days, as the teaser card's subline. | Compliance is kept (2e). P19 |
| Goal wizard (3 steps) | **Merge** into tile + one confirm screen. The step-2 detail moves to the goal page settings. | M01. P02, P04, P28 |
| Add money sheet | **Keep, simplify.** Goal chips only when there are 2 or more goals. The last amount is pre-selected (D5). The account choice collapses to "From Junior account · Change". | 47 words, 12 controls. P25, P28 |
| Goal page | **Keep, simplify.** Jar + saved / target + date sentence + Add money / Withdraw. Edit, Delete, rules and rate go under "Settings for this goal". | 161-169 words, 24-29 numbers. P16 |
| Saving rules sheet | **Hide behind More.** It merges with the Money in sheet. | Same content shown twice (14, 15). P16 |
| Money in each month panel + sheet | **Merge** into Saving rules. Delete from the tab. | M05 |
| Settings > Persely | **Keep** (it is already in Settings). The tab gear icon goes; a "Persely settings" row goes into More. | 35 controls on one page. P16 |
| Perks / rewards | **Hide behind More.** A new reward is announced once by Persi (priority 2 slot). | M08. P19 |
| Health score sheet | **Hide behind More > Habits.** | 144 words, 22 numbers, unexplained on the tab (M08, F11). P41 |
| Story entry | **Keep, month end only:** a ring around Persi + Persi priority 5. Delete the grey ring. Shorter first-month story: D11. | M07. 40.8 s today |
| Notifications | **Keep the types, cap at 1 Persely push a day,** with a fixed priority (2d). "Activate it now!" goes. Discounts leave the Persi channel. | M09. P33, P13 |
| Junior page (Keep my 3.0%) | **Keep** as an action page. Reached from the honesty line, Persi priority 4 and More. | Compliance. P41 |
| Good to know, How Persely works, Why Persely? | **Merge** into one "Rate and safety" sheet (2e). "How Persely works" stays in More as the streak and rules explainer only. | 3 sheets repeat rate, cap and tax (278 words together). P16, P41 |
| Persi hint strips (4) | **Delete** | M05, F08. P03 |
| Friends | **Hide behind More** (opt-in as today) | C004 caveat in P36: a social message raised clicks, not saving |
| Spending row on the tab | **Hide behind More** (Spending is reached from Home) | P16 |

**One rule for Home:** Persely appears on Home in **one card only**, in the teaser slot above the fold.
- Its subline shows one state, in Persi's priority order: no goal / week open / payday / Junior ending in the last 30 days.
- It has one action.
- The Persely balance in the account carousel is an account, not an entry, and is allowed.
- Nothing else about Persely on Home.
- The same rule holds after the Home revert (section 2h).

### d) Engagement loop for low engagement, without manipulation

**First day:**
- The reward on the first deposit (2a).
- On the next app open the same day, Persi's line confirms "Nice! Your money is safe here." No push on day 0.

**Return triggers:** at most **1 Persely push a day** (all types counted together), quiet hours respected, every type its own switch in Settings (P33). Priority when two are due:

| Priority | Push | When | Evidence |
|---|---|---|---|
| 1 | Payday: "Salary's in. Save 7 500 Ft?" opens the payday sheet | Salary event | P36 (strong: reminders, C024 SMS +28-43% over 12 months; caveat C003, the effect was among high-responding customers) |
| 2 | Junior ends: 90, 30 and 7 days | Date | P41 / compliance |
| 3 | Goal milestone 25 / 50 / 75 / 100% | Deposit | P36 (goals with progress) |
| 4 | Week still open: Sunday 18:00, **opt-in only** | Weekly | P36 reminders; the streak framing is a **hypothesis** |
| 5 | Story ready | Month end | **Hypothesis** (no library evidence for stories) |
| - | Friend saved | **Removed** from pushes; stays in More if opted in | P36 caveat C004 (**weak** for saving) |
| - | Discounts | **Out of the Persi channel**. Only with marketing consent, separate toggle | P13, P33 |

**Streak, kept simple:**
- Any deposit in a Monday-to-Sunday week counts, automatic ones included (as today).
- Skips (1 per 4 weeks, max 2) are used silently. The tab shows only the flame, "Week N" and 4 dots.
- A broken streak shows "New week, new start", never a loss message.
- The streak never changes the rate (keep the existing line).
- No library evidence for streaks: **hypothesis**. P36 covers reminders, goals, round-ups and challenges.
- Risk H5: student income is irregular.

**Celebration moments (all hypothesis):**
- First deposit.
- Each milestone (jar fills to 25 / 50 / 75%).
- Goal reached: full-screen Persi + "Withdraw / New goal / Keep saving", as today.
- Each new streak week: small flame flash.
- At most one celebration per app open.

**The user does nothing for 3 days:**

| Day | What happens |
|---|---|
| Day 0 | Deposit |
| Days 1-2 | Nothing |
| Day 3, no open since day 0 | No "we miss you" push. If the Sunday reminder is on and the week is open, it fires on Sunday as normal. Otherwise silence until the next payday push. |
| Next open | Persi priority 8: "Welcome back. Your 1 000 Ft is safe." |
| Started a goal but never deposited, day 3 | One in-app Persi line, "Start with 500 Ft?". **No push.** |

**Ethical guardrails** (P13: strong that dark patterns are common, weak for remedy effects):
1. No fake urgency, no countdowns, no "now!" in any Persely text. Only real dates: payday, Junior end.
2. Equal weight for yes and no in every question. "Not now" is a full button, not grey text.
3. Withdraw stays one tap from the tab and free. No retention screen on Withdraw (P13 caveat: save flows can manipulate).
4. Honest money: interest shown after tax. "3.0% is a proposal" stays marked in the demo. No "earn more than Savings" claims (`chk-compare-per-100k` kept).
5. Rewards never depend on balance size (as today). Peer comparison only by opt-in, never by amounts.
6. 1 push a day, quiet hours on by default, every type can be switched off, marketing separate (P33).
7. Defaults that move money always say so on the button ("Save 1 000 Ft now"). The payday rule asks first. Undo for 10 s (P26, P30).
8. Sound follows the silent switch. Motion follows reduced motion (P37, strong for prevalence of failures; the evidence is web data).
9. Success is measured by money saved and comprehension, not taps or sessions (P36, P21 caveat, P44).

### e) Compliance: what must stay visible in the simple version

| Item | Where it must show | Simplest honest form | Learn more holds |
|---|---|---|---|
| Junior 3.0% rate and conditions | Tab honesty line; first-run confirm screen; goal page; Add money sheet footer | "3.0% until 10 September 2027 · Withdraw any time · Protected ⓘ" | 3.0% a year on up to 500 000 Ft (all forint goals together). 28% tax, about 2.2% after tax. Paid monthly. Junior package ends 10 September 2027. To keep 3.0% for 12 more months, your first salary must arrive at OTP within 6 months. Without it the rate returns to standard after 30 days' notice. Others get 0.01%. Marked CONFIRM WITH OTP. |
| Deposit protection | In the same line ("Protected ⓘ") | One word + ⓘ | Name of the scheme and coverage limit: **CONFIRM WITH OTP** (the existing marker stays) |
| Analyst data use (default on; D10 legal sign-off still open) | First Home view (or the Spending page after the revert), Settings > Privacy, Spending footer | One line: "Your analyst reads your OTP payments to show Safe to spend. Nothing leaves OTP. **Learn more · Turn off**". Both links the same size and weight (P13). | The current "What it reads" content, rewritten (items 9 and 10 in 2f), plus the lawful-basis marker |
| No fees, withdraw any time | Honesty line | As above | |
| Money moves | Every button that moves money | Amount + source on the button. Undo chip. Review above 20 000 Ft as today (P26). | |

"Rate and safety" is one sheet. It replaces Good to know, Why Persely? and the rate part of How Persely works.
- It keeps the per 100 000 Ft comparison (Persely 3.0% = 2 160 Ft, Savings 3.5% = 2 520 Ft, old 0.01% = 7 Ft after tax). The bars stay.
- Comparison copy: "The Savings account pays a bit more: 3.5%. Persely pays 3.0%. …" (see 2f).
- **Regulatory caution:** the sheet's wording and the move from a 3-step check page to one line need OTP legal review before real use.

### f) Copy: before → after

The same FK script was used. English only.

| # | Before | FK | After | FK |
|---|---|---|---|---|
| 1 | "The Savings account pays more a year (3.5% against 3.0%) and both are taxed at 28%, while Persely adds goals and lets you withdraw any time with no fees, so check how you reach your money in the Savings account." | 15.4 | "The Savings account pays a bit more: 3.5%. Persely pays 3.0%. Both are taxed. Persely keeps each goal apart. You can withdraw any time, for free." | 1.4 |
| 2 | "3.0% a year for every Junior customer, automatically, on the first 500 000 Ft, until 10 September 2027" | 11.8 | "You get 3.0% a year on up to 500 000 Ft. It ends on 10 September 2027." | 0.9 |
| 3 | "Spending under income · no overdraft · a buffer · regular saving" | 8.9 | "Spend less than you get. Stay above zero. Keep a little extra. Save often." | 1.8 |
| 4 | "We let you know right away about card payments, incoming transfers and how your Persely is doing." | 8.4 | "We tell you when you pay, when money comes in, and how you save." | 2.5 |
| 5 | "Put money into your Persely savings" | 8.4 | "Save for a goal" (the row is deleted from Home in 2c; this text is for More) | -2.2 |
| 6 | "Junior package until 10 September 2027" | 8.4 | "Your 3.0% ends on 10 September 2027" | 2.3 |
| 7 | "5 offers waiting for activation · 0 rewards" | 7.7 | "5 deals to turn on" | -1.8 |
| 8 | "15% instant discount at Pizzeria Roma. Activate it now!" | 7.1 | "Pizzeria Roma: 15% off. You can turn it on in Perks." | 0.9 |
| 9 | "It uses them to show Safe to spend, your regular bills, your categories and a plan for next month" | 6.7 | "It uses them to show what you can spend and which bills are next." | 1.7 |
| 10 | "Saves regularly toward a named goal" | 6.4 | "You keep saving for a goal" | 0.5 |
| 11 | "3.0% a year on up to 500 000 Ft with your Junior account until 10 September 2027" | 6.3 | "3.0% a year on up to 500 000 Ft. Until 10 September 2027." | 1.5 |
| 12 | "About 1 380 Ft a year after tax on 64 000 Ft, until 10 September 2027" | 5.9 | "This goal earns about 1 380 Ft a year, after tax." | 2.5 |
| 13 | "About 0 Ft a year after tax on 0 Ft, until 10 September 2027" | 5.9 | "Add money and it starts to earn 3.0%." (empty state; fixes "About 0 Ft") | 1.0 |
| 14 | "At your pace (about 6 000 Ft a month) you get there in November 2027, after your goal date." | 5.9 | "At this pace you get there in November 2027. That is after your date." | 1.5 |
| 15 | "Persely pays 3.0% on the first 500 000 Ft until 10 September 2027." | 5.8 | "You get 3.0% on up to 500 000 Ft until 10 September 2027." | 4.0 |

**Main labels of the simple tab and first run** (FK; one-word labels give unreliable FK, e.g. "Withdraw" 8.4, kept because it is the glossary term from `chk-glossary-terms`):

| Label | FK |
|---|---|
| "Hi! Let's save your first 1 000 Ft." | -2.4 |
| "What are you saving for?" | 0.5 |
| "Save 1 000 Ft now" | -2.2 |
| "From your Junior account" | 3.7 |
| "On payday, Persi asks to save 10%." | 2.3 |
| "1 000 Ft saved!" / "Week 1 done" | -2.6 / -2.6 |
| "Saved" | -3.4 |
| "Add money" | 2.9 |
| "Withdraw" | (8.4, one word) |
| "Week 4" / "Save once a week" | -3.0 / -2.2 |
| "More: goals, rules, rate" | -0.1 |
| "3.0% until 10 September 2027 · Withdraw any time · Protected" | 3.4 |
| Persi lines: "Nice! Your money is safe here." | -0.7 |
| "Add any amount to keep week 4." | 0.6 |
| "Payday! Save 7 500 Ft?" | -0.1 |
| "You did it! Summer holiday is full." | 2.6 |
| "Your November story is ready." | 7.6 → change to "Your November story is here." |
| "Welcome back. Your 1 000 Ft is safe." | -0.7 |
| Analyst line: "Your analyst reads your OTP payments to show Safe to spend. Nothing leaves OTP." | 2.3 |
| "Learn more" / "Change" | -3.0 / -3.4 |

Also fix in push 6: "keep my 3.0%" → "keep your 3.0%".

### g) Demo-ability and Hungarian

**Pitch demo script (`demo-script.html`, 6:00): what changes**

| Beat | Today | With Simple Persely |
|---|---|---|
| 1 First login (U) | The Home card "Start your first goal" is below the analyst card. The script says "tap the Persely card". | The card is above the fold. The analyst card becomes one line. Same words to say. |
| 2 House plan | Own home tile, then step 1 with the slider, then Next | Own home tile, then **one confirm screen**. "Change" opens the old amount and date pickers if the presenter wants the slider moment. Own home stays a tile if D10 keeps it; otherwise it moves to More goals. |
| 3 Auto savings | Steps 2 and 3, Good to know, Create goal, Start your streak 2 000 Ft, Sunday nudge, Not now | **"Save 1 000 Ft now"** (or Change → 2 000 Ft to keep the script's numbers), then the reward. No nudge sheet. Speaker line: "One tap, and saving runs on its own." Home figures change if 1 000 Ft is used: Junior 86 450 Ft, Persely total 1 000 Ft. |
| 4, 6, 9 Fast-forward (O, Q, Y) | "the total, the yearly interest line and the goal bars grow" | The big number and the jars grow. The interest line lives in More > Rate and safety. Summary sheets unchanged. |
| 5 Payday (P) | Push + Bills first sheet | Unchanged. Persi priority 3 shows on the tab. |
| 7 Analytics, 8 Bill missed | Safe to spend card on Home | Unchanged until the Home revert (2h), then they start from Spending. |
| 10 Junior ends | "See what's next" | Unchanged. Also reachable from the honesty line. |
| 11-12 Year page and story | | Unchanged |

- Keep the demo keys (U, X, O, Q, Y, P, B, M, G, 1-9).
- Add `SIMPLE_PERSELY` (default on) with `?simple=0` to fall back to today's tab, like `NEW_PERSELY_IA`.
- Re-record `media/ff-*.mp4` only if beat 9 is shown on the tab.
- Update `prototype-guide.html` sections "Persely tab", "User journey", "Persi and notifications".

**Hungarian:**
- The prototype is English only (guide: "English UI"). 363 unique strings (2 122 words) were measured on these screens.
- FK does not apply to Hungarian. Proposed proxy, **team-chosen, not a validated index:** ≤ 8 words per sentence, ≤ 1 word over 12 letters per sentence, native-speaker read-aloud check.
- Hungarian formats: decimal comma "3,0%", dates "2027. szeptember 10.", non-breaking space in "1 000 Ft". Hungarian text runs longer, so test layouts with HU strings before any UI freeze.

**Strings that need Hungarian first.** Drafts are for a native speaker and OTP's terms to check. "Persely" and "Persi" stay as names.

| English | HU draft (verify) |
|---|---|
| Hi! Let's save your first 1 000 Ft. | Szia! Tegyük félre az első 1 000 Ft-ot! |
| What are you saving for? | Mire gyűjtesz? |
| Trip / Phone or tech / Safety net / Something else | Utazás / Telefon, kütyü / Tartalék / Valami más |
| Save 1 000 Ft now | Félreteszek 1 000 Ft-ot |
| From your Junior account | A Junior számládról |
| On payday, Persi asks to save 10%. | Fizetésnapon Persi megkérdezi, félretegyen-e 10%-ot. |
| 1 000 Ft saved! / Week 1 done | 1 000 Ft félretéve! / Az első hét megvan |
| Saved | Félretéve |
| Add money / Withdraw | Befizetés / Kivétel (match the OTP app's wording) |
| Week 4 / Save once a week | 4. hét / Hetente egyszer tegyél félre |
| More: goals, rules, rate | Továbbiak: célok, szabályok, kamat |
| 3.0% until 10 September 2027 · Withdraw any time · Protected | 3,0% 2027. szeptember 10-ig · Bármikor kiveheted · Betétbiztosítás |
| Learn more / Change | Részletek / Módosítás |
| Nice! Your money is safe here. | Szuper! Itt biztonságban van a pénzed. |
| Add any amount to keep week 4. | Bármennyi is jó, és megvan a 4. hét. |
| Payday! Save 7 500 Ft? | Fizetésnap! Félreteszel 7 500 Ft-ot? |
| You did it! Summer holiday is full. | Megcsináltad! A Nyaralás cél teljesült. |
| Your November story is here. | Itt a novemberi történeted. |
| Welcome back. Your 1 000 Ft is safe. | Szia újra! Az 1 000 Ft-od biztonságban van. |
| Analyst line (2e) | Az elemző az OTP-s fizetéseidből számolja, mennyit költhetsz. Semmi nem hagyja el az OTP-t. Részletek · Kikapcsolás |
| Rate and safety sheet (2e) | Full text by OTP |
| The 15 rewrites in 2f | To translate |
| Push copy (2d) | To translate |

### h) Home back to the OTP skeleton (scheduled **later**, after the tab is simplified)

**1. What the original Home contained.**
- Verified in git: the root commit is `57100ea` (16 November 2026, "OTP Persely prototype: Team 3 seminar app"). The last commit before the team-plan additions is `eb807a7` (16 November); they differ by 77 lines, mostly the student check.
- There is no commit before Persely. The copied OTP Home already came with three small Persely items.
- Rendered from `eb807a7` at 390 x 844: `shots/30-home-original-otp-eb807a7.png`, full page `30b-…-full.png`. Scroll 1 365 px, about 125 words. Today: 2 036 px / 238 words (new user) and 1 762 px / 201 words (existing user).

Top to bottom:
1. Header: avatar, name, mail icon (Messages / For you).
2. "Balance" + "All accounts".
3. Account carousel: Junior account, a Persely account card ("Persely – Summer holiday 64 000 Ft, Goal: 134 000 Ft"), Savings account. Dots under it.
4. Persely teaser card: Persi + "New in Persely: goals with bonus interest / Set up in 1 minute", or the streak line. *Persely addition, root commit.*
5. "My monthly spending" + **Details**, date range, 270° gauge "Spent so far 89 400 Ft", "Average monthly spending 102 400 Ft".
6. "What did I spend on this month?": 5 category bars with icons.
7. (Persi's tip card: only when an insight exists. *Persely addition.*)
8. "For you" + All: carousel (New features in MobilBank, How well prepared are you against fraud?) and the offer card "Start saving efficiently! Create your Persely…".

**2. What we added to Home since, and where each goes** (commits `eef644f` … `d978b24`):

| Added to Home | Goes to |
|---|---|
| Header captions "Profile and settings", "Notifications", "For you" | Delete the captions. The avatar still opens Settings (no visual change). |
| Bell + inbox (20 items) | **More > Notifications** (inbox at top). Pushes still land there. |
| Analyst first-run notice card | **Spending page**, first visit, as the one-line notice (2e) + Settings > Privacy. Legal must accept the move (D9). |
| Late-bill card (Bills first, Pay now / All bills) | **Spending page**, top, above Safe to spend + Bills page + the existing push. Persi line on the Persely tab only when it affects payday. |
| "Account details" / "Open Persely" lines on carousel cards | Delete (original cards). The Persely card shows "Persely · total" (there are several goals now). |
| "Why Persely?" link | **Persely tab > More > Rate and safety** |
| Junior row (300 days, Keep my 3.0%), pending state "Waiting for your first salary" | **Persely tab**: honesty line, Persi priority 4, More > Keep my 3.0%. Last 30 days: subline of the Persely teaser card. |
| Safe to spend card | **Spending page** hero (already there). Home reaches Spending by the original **Details** link. |
| Quick actions card: Add money to a goal | **Persely tab** big button (and the teaser card) |
| Quick actions card: Pay a bill | **Spending page** Bills row + **More > Bills** (new row) |
| Quick actions card: Manage my card | **More > My cards** (exists) |
| Persely streak card / "Start your first goal" card | Back into the **original teaser slot** (see 3 below) |
| Persi's tip card (Move 10% of food and drink) | **Spending page** "Persi's tips" (exists). Delete from Home. |
| Category ring with legend + "See spending details" button + "Total out" line | **Spending page** (already has the larger ring). Home returns to the original gauge and category bars, fed by real `catSpend` data, so "Card spending" stays the same number on both screens (`chk-two-spend-numbers`). Label "Card spending so far" instead of "Spent so far" (D15). Category bars still open Transactions. |
| "Your November is ready" story card (month end) | **Persely tab**: ring around Persi + Persi priority 5 + the push |
| For you caption "Offers, tips and news from OTP", "See all" | Back to "All" with no caption |
| Spacing tokens, 44 px targets, contrast | **Keep** (they are not Home features) |
| Demo long-press on the avatar | **Keep** (presenter only, behind the demo flag) |

**3. Minimal Persely entry on the original Home.** Decision: **one card, the original teaser slot.**
- Today the slot reads "New in Persely…". It becomes the 2c Home rule card: Persi + one line + chevron.
  - New user: "Save your first 1 000 Ft".
  - Week open: "Week 4 · Save by Sunday".
  - Payday: "Payday · Save 7 500 Ft?".
- Why:
  - It is the original OTP position, so the revert adds nothing new.
  - It sits above the fold in the original layout. It renders at about y = 260 px against 913 px today (`30-…png`).
  - One entry fits P16 and P19.
  - It keeps the 3-tap first-forint path (2a).
- The Persely balance in the carousel stays as an account card (OTP original). The For you offer card "Start saving efficiently!" is hidden once the user has a goal, so it does not become a second entry.

**4. Affected flows, findings and checks.**
- **Flows (audit T-numbers):**
  - T1: the first goal starts from the teaser.
  - T5: analyst notice and switch move to Spending and Settings.
  - T7: Pay a missed bill starts from Spending, not the Home card.
  - Demo beats 1, 3 (Home figures), 7 (Safe to spend card), 8 (late-bill card on Home), 9 (start on the tab).
- **Findings:** F04 (late vs due-soon headline moves with the card to Spending), F06 (one entry point), M04, M10.
- **Docs to update:** `home-clarity-notes.md`, `spending-ui-rework.md` (Home circle), `persely-home-ui-plan.md`, decision D13 (late card on Home only) reversed.
- **Self-checks that reference Home elements and must be rewritten or removed:**
  - `chk-home-order`
  - `chk-home-labels`
  - `chk-home-details-button`
  - `chk-home-circle-categories`
  - `chk-two-spend-numbers`
  - `chk-why-persely`
  - `chk-tap-44` (Home part)
  - `chk-analyst-notice`
  - `chk-analyst-default-on` (the warning on Home)
  - `chk-latecard-home-only`
  - `chk-no-bills-selflink` (Home keeps All bills and Pay a bill)
  - `chk-entry-map` (Home rows)
  - `chk-inbox-20` (Home bell)
  - `chk-keep-pending` (pending on Home)
  - `chk-story-month-end` (Home story card)
  - `chk-tx-category-passin` (Home category taps; keep with bars)
  - `chk-seed-existing` ("keeps the old … Home")
  - `chk-glossary-terms` (scope list)
  - `chk-spacing-scale` (Home blocks)
  - The unnamed checks:
    - "one entry path: Home reaches Spending from Safe to spend and Details only…"
    - "analyst off: … Home keeps its Safe to spend row"
    - "late bill: the Bills first card stays on top of Home and is gone from the Persely tab (D13)"
    - "Home 'Card spending' = Spending 'Card spending'…"
    - "after one simulated month Home and Spending still show the same total"
    - "Home Details page has no plan"
    - "tip: the Home card shows the amount…"
    - "overspent month: no saving tip on Home…"
    - "late bill: Home has no tip card and the late card has Pay now…"
    - "delete every goal: … tab, Home, story … render without errors" (keep; only the expected Home content changes)
- New check: `chk-home-otp-skeleton`.
  - Home blocks equal the `eb807a7` order: header, balance carousel, Persely teaser, monthly spending gauge + Details, category bars, For you.
  - Exactly one Persely entry.
  - Every item in the table above is reachable from its new place in ≤ 2 taps from the tab bar.

**5. Effort and order:** **M.**
- One `vFooldal()` rewrite.
- The late card and analyst notice moved to Spending.
- More gets Notifications inbox and Bills rows.
- About 29 checks adjusted.
- Demo beats 7-8 re-timed.
- Scheduled as **Phase 6**, after Phases 1-5 (the tab is simple and the More page exists, so every moved item has a place). Run it behind its own flag `OTP_HOME` (`?otphome=0` falls back) so the pitch can choose.

---

## 3. Rollout

| Phase | What | Effort | Depends on |
|---|---|---|---|
| 0 | Flag `SIMPLE_PERSELY` + `?simple=0`. Measure script in repo (`tools/measure-simple.mjs`, from this session's harness). New checks as failing stubs. | S | |
| 1 | First 30 seconds: Home card above the fold (interim, before Phase 6), 4 tiles, confirm screen, one-tap create + deposit with Undo, reward on the tab (coin, chime, haptic, reduced motion), nudge moved to the second visit | M | 0, D1-D3, D10, D13 |
| 2 | Simple tab: 4 blocks + honesty line + More page. Persi priority engine. Delete hints and the grey ring. Jars picture. | M | 1, D4-D6 |
| 3 | Connections: Rate and safety sheet (merges 3 sheets), goal page and Add money simplified, Saving rules + Money in merged, push cap and priority, push copy fixes | M | 2 |
| 4 | Copy pass (2f), HU string table, HU proxy check, FK check in the app | S | 2 |
| 5 | Demo script, guide, MP4 if needed. Hallway test round 1. Fixes. | S | 1-4 |
| 6 | Home back to the OTP skeleton (2h) behind `OTP_HOME` | M | 2, 3 |
| 7 | Existing users: simple tab behind an opt-in "Try the new Persely" with a 2-week "Classic view" way back (P42) | S | 2 |

**Acceptance criteria** (measured with the same harness at 390 x 844; today's value in brackets):

| Criterion | Target |
|---|---|
| Taps from first open to first saved forint | **3** (7 from the Persely tab icon; +scroll from the Home card) |
| Taps to the first visible reward | **3, same tap** (8) |
| Time from the 3rd tap to the start of the reward animation | **≤ 500 ms** (no visible reward until a sheet is closed) |
| First run, from first open: median time to first saved forint in the hallway test | **≤ 30 s** (not measured with people; agree before the test) |
| Words on the Persely tab above More | **≤ 40** (345 existing / 104 new / 293 after first deposit) |
| Words per first-run screen | **≤ 25** (71 / 107 / 103 per wizard step) |
| Numbers on the tab | **≤ 3 + the rate** (45; 14 above the fold) |
| Controls on the tab (no tab bar) | **≤ 4**: Add money, Withdraw, Learn more, More (25) |
| Scroll length of the tab | **No scroll, content ≤ 778 px** (2 631 / 1 156 / 2 295 px) |
| Reading grade | **Every text on the tab and first run ≤ FK 4**, sentences ≤ 12 words, Persi ≤ 8 words (24 texts above 5 today, worst 15.4) |
| Persi voices at once | **1** (5) |
| Persely pushes | **≤ 1 a day**, no "now!" (no cap except bills) |
| Home Persely entries | **1 card** (5) |
| Self-checks | All pass with `SIMPLE_PERSELY` on; `?simple=0` still passes today's set (212 of 212 on a fresh 390 x 844 load) |

**New self-checks** (in `window.__checkAnalytics()`):

| Check | What it asserts |
|---|---|
| `chk-simple-3-taps` | Home card → tile → "Save 1 000 Ft now" creates the goal, moves 1 000 Ft, and starts the streak, in 3 clicks |
| `chk-simple-reward-same-tap` | The reward layer is visible within 500 ms of tap 3 with no sheet over it. The nudge sheet does not open on day 0. |
| `chk-simple-tab-blocks` | ≤ 4 blocks + honesty line + More, content height ≤ 778 px at 390 x 844 |
| `chk-simple-words-numbers` | ≤ 40 words and ≤ 3 numbers + the rate on the tab, both seeds |
| `chk-simple-grade` | In-app FK ≤ 4 for every tab and first-run text, sentences ≤ 12 words |
| `chk-simple-one-primary` | One primary-styled button per first-run screen and on the tab |
| `chk-simple-honesty-line` | Rate + end date, Withdraw any time, deposit protection and Learn more on the tab, confirm screen, goal page and Add money sheet. The CONFIRM WITH OTP marker is kept. |
| `chk-simple-analyst-line` | One line, Learn more and Turn off with equal size and weight |
| `chk-simple-push-cap` | ≤ 1 Persely push a day, the priority order, quiet hours, no discount under Persi, no "now!" |
| `chk-simple-no-hints` | No hint strips and no grey story ring |
| `chk-simple-more-complete` | Every block removed from the tab is reachable from More in 1 tap (entry map) |
| `chk-simple-flag-fallback` | `SIMPLE_PERSELY=false` renders today's tab and today's checks pass |
| `chk-simple-motion-sound` | Reduced motion gives a fade. Sound off or silent gives no audio. |
| `chk-simple-hu-keys` | Every new string has a HU key |
| (Phase 6) `chk-home-otp-skeleton` | See 2h |

**Existing checks to change for Phases 1-3:**
- `chk-setup-above-fold` (6 tiles → 4)
- `chk-tab-order`
- `chk-one-wizard`
- `chk-create-no-money`
- `chk-first-goal-payday-only` (nudge timing)
- `chk-good-to-know` (wizard step 3 → confirm screen)
- `chk-hint-seen-on-screen`
- `chk-story-month-end` (grey ring)
- `chk-tap-44` (New + location)
- `chk-entry-map`
- The unnamed checks "Persely tab: no rule switches, … one Spending row" and "Persely tab row shows what is spent of what is planned".

Gate them on the flag rather than deleting them.

**Hallway test** (P45: rounds of about 5. A029: five users find 91% of common problems but only 38% of all. Repeat after fixes.)
- **People:** 5, aged 18-29. At least 3 not in finance or business studies, at least 2 who do not use OTP.
- **Set-up:** phone at 390 x 844, new-user seed, no hints, no help.
- **Language:** English strings in round 1. Hungarian strings in round 2 (D14).
- **Pass thresholds:** to be signed off **before** the test.

| Task (said aloud) | Pass if |
|---|---|
| T1 "Put your first money aside for something you want." | ≥ 4 of 5 finish unaided in ≤ 3 taps; median ≤ 30 s; SEQ ≥ 5.5 of 7 |
| T2 "What just happened?" (asked right after T1) | ≥ 4 of 5 say money was saved **and** it can be taken back |
| T3 5-second test on the existing-user tab: "How much is saved? What should you do next?" | ≥ 4 of 5 give the amount and "add money" |
| T4 "Take 500 Ft back out." | ≥ 4 of 5 in ≤ 2 taps |
| T5 "What interest do you get, and until when?" | ≥ 4 of 5 say 3% and the date, with or without Learn more |
| T6 "Is this money safe? Can you get it any time?" | ≥ 4 of 5 answer yes and give a reason |
| T7 "Change how much moves in on payday." (behind More) | ≥ 3 of 5 in ≤ 3 taps (checks that hiding things behind More does not make them hard to find) |
| T8 "Read Persi's sentence and say it in your own words." | ≥ 4 of 5 correct |
| Exit question: "Would you open this again this week? Why?" | Qualitative only; not a pass/fail |

**Risks:**
1. **Change aversion** for existing users (P42, moderate; E1-002: session time up 11% on day 2, back near control by day 14). Mitigation: Phase 7 opt-in, Classic view, judge after 2 weeks.
2. **One-tap money move:** a deposit by mistake. Mitigation: amount on the button, 10 s Undo, free Withdraw one tap away (P26, P30). Legal must accept that creating a goal now moves money.
3. **Hiding too much:** rate details and rules out of sight could read as less transparent (P11, trust from usability). Mitigation: honesty line on every money screen, T5, T7.
4. **Defaults as pressure:** a payday rule on by default could feel imposed. It asks first each payday and has a visible switch on the confirm screen (D3).
5. **Streak stress** with irregular income (H5). Mitigation: silent skips, no loss messages, no streak push unless opted in.
6. **Sound in public:** follows the silent switch, off in the settings toggle.
7. **FK misleads on UI fragments** and does not apply to Hungarian. Use the HU proxy and read-aloud checks.
8. **5-person test misses rare problems** (A029). Repeat the rounds.
9. **Demo regressions before the pitch:** about 38 checks to gate. The flag fallback keeps today's demo.
10. **Thin evidence:** most patterns here are moderate. Streak, celebration, N = 4 and the push cap are hypotheses (playbook gaps 1, 2, 4, 8).

---

## 4. Decisions needed (product owner)

| # | Question | Options | Recommendation |
|---|---|---|---|
| D1 | Default first deposit? | a) 500 Ft · b) 1 000 Ft · c) 2 000 Ft (demo today) | **b**: an existing chip, low enough for a student. The demo can tap Change. |
| D2 | Does one tap create the goal **and** move money? | a) Yes, "Save 1 000 Ft now" + Undo · b) Keep "Create goal moves no money" + the prompt · c) One screen with amount chips, nothing pre-selected | **a**: it is the only way to 3 taps; the move is reversible and to the user's own savings (P26). Needs legal OK. |
| D3 | Payday rule for the first goal? | a) On, 10%, asks first (today) · b) Off, offered on the first payday · c) On, 5% | **a**, shown as a visible switch on the confirm screen |
| D4 | How many blocks on the tab? | a) 3 · b) 4 · c) 5 | **b** (hypothesis; check with T3) |
| D5 | Add money sheet amount | a) Empty (today's safety decision) · b) Last amount pre-selected · c) 1 000 Ft pre-selected | **b** (P28; low risk, Undo) |
| D6 | Where does Withdraw live? | a) Link under Add money on the tab · b) Behind More · c) Goal page only | **a** (P13: leaving must be as easy as entering) |
| D7 | Persely on Home before the revert | a) One card above the fold · b) Card + Quick action · c) Today's 5 entries | **a** |
| D8 | Big number on the tab | a) Total saved · b) Main goal saved · c) Streak weeks | **a**: it matches Home's Persely balance |
| D9 | Analyst notice placement | a) One line on first Home, later the Spending page · b) First Spending visit only · c) Today's card | **a** now, **b** after the Home revert, only with legal sign-off (D10 of the earlier plan is still open) |
| D10 | Goal tiles on first run | a) 3 · b) 4 incl. Something else · c) 6 (today) | **b** (hypothesis). Own home, Driving licence and Studies stay under "More goals". |
| D11 | First-month story | a) Keep 11 slides, 40.8 s · b) Cap at 5 slides, ≤ 20 s · c) No story in month 1 | **b** (hypothesis; Denis's story stays intact for later months) |
| D12 | Health score and rewards | a) On the tab · b) Behind More > Habits · c) Removed from the student version | **b** |
| D13 | Reward sound | a) On, follows silent switch · b) Off by default · c) Ask | **a**, with a Settings toggle |
| D14 | Hungarian timing | a) Translate the ~45 new strings before hallway round 1 · b) Before round 2 · c) After the pitch | **b**: round 1 in English to fix structure, round 2 in Hungarian |
| D15 | Home gauge label after the revert | a) Original "Spent so far" · b) "Card spending so far" · c) No label | **b**: keeps one meaning for the number across Home and Spending (P11) |

---

## 5. Evidence / pattern table

| Pattern | Strength (as in playbook) | Caveat copied | Used for |
|---|---|---|---|
| P02 Short steps with progress | Moderate | Square / E4-033 moved to single-page flows; B027: more than 2 disclosure levels hurts; no controlled study isolates splitting | Wizard → one confirm screen |
| P03 No generic tutorials, hints in context | Strong | B021 n = 16; onboarding helped complex apps; B003 not banking | Delete 4 hint strips, one Persi voice |
| P04 Goal + concrete first action | Moderate | E8-041 correlation; E3-018 meditation app | 3-tap first forint |
| P11 Usability as trust | Moderate | Small studies, perception not behaviour | Honesty line, consistent numbers |
| P13 Dark-pattern audit | Strong (prevalence), Weak (remedies) | Retention flows can work commercially; judge manipulation | Guardrails, equal-weight choices, Withdraw on the tab, no urgency |
| P15 Thumb reach, target size | Strong | A027 heatmaps later called inaccurate | 56 px bottom-half button |
| P16 Goal-based, shallow IA | Moderate | Outcomes from whole redesigns | More page, max 2 levels, merges |
| P18 Balance on home, user control | Moderate | N26 backlash (news); customisation adds complexity | One big number, Home card |
| P19 Contextual priority cards | Moderate | No banking outcome data | Persi priority engine, Home card states |
| P20 Top actions one tap from home | Moderate | Bundled, company-stated outcomes | Add money one tap from the tab and the Home card |
| P21 Insights raise engagement, not behaviour | Strong (engagement) / Moderate (design) | Do not promise behaviour change | Spending moved off the tab; metrics |
| P25 Cut typing | Moderate | A033 is an old e-commerce benchmark | Pre-selected amounts |
| P26 Friction matched to risk | Moderate | No misdirected-payment data | One-tap own-savings move with Undo |
| P28 Fewer fields, pre-fill | Strong | Mostly web checkout forms (extrapolation) | Tile presets, defaults |
| P29 Plain error messages | Strong (guidance) | No banking error-copy study | Error states |
| P30 Undo for reversible actions | Moderate | Mostly non-finance examples | Undo on first deposit |
| P31 Empty states with one action | **Weak** | Galleries only | "Add money and it starts to earn 3.0%." |
| P32 Permissions in context | Moderate | No grant-rate data | Nudge on the second visit, permission after Yes |
| P33 Alerts, granular controls, marketing separate | Moderate | No frequency or fatigue study | 1 push a day cap (the cap itself is a **hypothesis**), discounts out of Persi |
| P35 Optional simple mode, stable core | Moderate | D011 desktop lab; change aversion | Simple tab + Classic view |
| P36 Savings nudges and goals | Strong | C004: a social message raised clicks, not saving; C003 effect among high responders | Payday push, goals, milestones; friends push dropped |
| P37 Accessibility basics | Strong (prevalence) | Web data | Reduced motion, sound off |
| P40 Clear labels, tappable look | Moderate | E8-002 changed label and placement together | Icon-first verb labels |
| P41 Plain and local language | Moderate | C024: education messages had no effect | Rewrites, Hungarian, Rate and safety |
| P42 Change aversion, staged rollout | Moderate | Session time can mean struggle; backlash cases news-only | Phase 7, flags |
| P44 Metrics before redesign | Strong | Big redesigns may not move key metrics | Acceptance targets, money saved as the outcome |
| P45 Small repeated test rounds | Strong | Five users miss rare problems | Hallway test |
| H3 Goal-first onboarding for students | Hypothesis | Basis E3-018, C024 from other contexts | First run |
| H5 Irregular student income | Hypothesis | No evidence | Silent skips, no loss messages |
| Streak, celebration, sound, mascot, N = 4, 40-word limit, grade-4 target, jars picture, 1 push a day | **Hypothesis (no library evidence)** | Validate in T1-T3 and in the first 2 weeks of use | 2a, 2b, 2d |
