# Persely UX review: decisions, severity-3 list, no-decision fixes

Source: A-first-run.md, B-daily-use.md, C-insight-nav.md (only their content is used). ID convention: A and B use the files' own IDs (A3-16, B2-1). C findings are written C<flow>.<n>, i.e. file ID F2.1 = C2.1. Open items that need OTP input are marked "confirm with OTP".

Conflicts between the files and how they are resolved: (1) legacy Recurring transfer: B suggests a general scheduler, A and C suggest merging into Weekly transfer, so the recommendation merges it (D9). (2) Dead ends: C suggests hiding, B suggests a disabled "Soon" state, so the recommendation does both by case (D7). (3) Home spending number: B suggests "all outflows", C suggests two named numbers, so the recommendation names both (D3).

## 1) DECISIONS (14), ordered by number of sub-flows affected

"Resolves" lists findings of severity 1-2 counted in this section. Severity-3 findings the decision also fixes are shown as "Also fixes sev-3" and are counted in section 2 only.

### D1. Who is the first-run user in the prototype, and what do they see first?

Flows affected: 7 (A1, A2, A3, A6, B1, B2, C1)

Options:
- (a) A brand-new user: empty seed (no goals, 0 Ft), no auto pop-up at launch (inline setup card as the first block of the Persely tab), "Not now" re-asks after the first tab visit, hints shown once per block.
- (b) An existing Persely user: keep seeded goals and change all "pick a goal" copy to "Add another goal".
- (c) Two selectable seeds, (a) for first-run flows and (b) as a second demo state.

**Recommendation:** Recommend (c) with (a) as the pitch default. The seed (110 000 Ft, 2 goals) contradicts every first-run line, and one seed cannot tell both stories.

Resolves (11): A1-3, A2-1, A2-7, A3-13, A6-2, A6-3, A6-4, A6-5, B1-4, B2-11, C1.7

Also fixes sev-3 (counted in section 2): A1-2, A6-1

### D2. How do we state, commit and explain the Junior end and the 3.0% promise (end date, "Keep" action, conditions, legal info, comparison with the 3.5% savings account)?

Flows affected: 7 (A2, A3, A4, A5, A6, B1, C4)

Options:
- (a) Full transparency: end date at any distance (age 24 vs graduation as one concrete date, needs the OTP rule), Junior line on Home, "Keep" becomes a pending request that turns into "Graduate" when the salary arrives with a copy-account-number button, conditions (500 000 Ft cap, 28% tax, 30 days) beside the headline, a short "Good to know" block with a deposit-protection link on the summary step, and the Persely vs Savings 3.5% difference explained per 100 000 Ft.
- (b) Minimal: keep the one-tap Keep and only move the conditions text up.
- (c) Keep as is.

**Recommendation:** Recommend (a). The badge flips to "Graduate 3.0%" before the condition is met and the limits sit below the fold; whether Persely may outrank the 3.5% account and the exact end rule must be confirmed with OTP (not in the files).

Resolves (10): A2-5, A3-3, A4-3, A4-4, A4-5, A4-6, A4-8, A6-7, B1-3, C4.2

Also fixes sev-3 (counted in section 2): A4-1, A4-2, A5-1

### D3. How are the insight pages structured and what do "Spent", "plan" and the story mean?

Flows affected: 6 (B1, B6, C1, C2, C3, C4)

Options:
- (a) One Spending page: Safe to spend first, one-line month projection, one "My plan" block, two named numbers ("Card spending" vs "Total out"), story ends with "See details" and appears only at month end (entry card on Home), year page reachable after 12 months.
- (b) Keep Monthly spending and Spending analysis and cross-link them.
- (c) Keep as is.

**Recommendation:** Recommend (a). The same four buckets appear three times, "Spent" has three meanings, and the headline answer sits 1 590 px down a 2 921 px page; B suggested "all outflows" and C "two named numbers", and naming both is consistent with each.

Resolves (9): B1-2, B6-7, C1.3, C2.2, C2.3, C2.4, C3.1, C3.2, C3.5

Also fixes sev-3 (counted in section 2): C2.1, C4.1

### D4. Where does each feature live (Home, Persely tab, More, Transfer) and which single entry point does it keep?

Flows affected: 6 (A6, B2, B3, B5, C1, C7)

Options:
- (a) One entry per feature: Home = status and shortcuts (incl. a card shortcut), Persely tab = goals, money and rules only, More = grouped (Money, Persely, Help); legacy "Persely details" and "Savings options" rows redirect to the Persely tab; one shared Add-money sheet (goal and account choosers) used by tab, goal page and Between my accounts.
- (b) Keep all current entries and add cross-links.
- (c) Promote Cards (and more) to the tab bar.

**Recommendation:** Recommend (a). It removes the duplicate paths A, B and C each found (4 ways to add money, 3 "Persely" pages, 2 Persely-in-More rows) without adding tabs; B recommends a Home card shortcut plus More.

Resolves (10): A6-6, B2-13, B3-2, B5-1, B5-3, C1.2, C1.4, C1.5, C1.8, C7.2

### D5. Which single word set (and language/format) does the whole app use for the same concepts?

Flows affected: 6 (A3, A5, B1, B2, B6, C1)

Options:
- (a) One English glossary now (Persely = product, "goal" = one pot, Add money / Withdraw, Saving rules, Spending, Bills, Financial analyst, Monthly story), one date and amount format, Hungarian equivalents listed alongside.
- (b) Decide the Hungarian terms first and derive the English strings from them.
- (c) Keep the current mixed wording.

**Recommendation:** Recommend (a). The files show the same idea under 3-8 names in every flow, and C notes the guide plans English only while students are Hungarian, so fix the words once and map them early.

Resolves (9): A3-4, A3-15, A3-20, A5-3, A5-5, B1-6, B2-9, B6-8, C1.6

### D6. Which money-out/money-moving actions need review or confirmation, and how long and where does Undo live?

Flows affected: 6 (A3, A5, B2, B3, B6, B8)

Options:
- (a) Withdraw starts empty (with a "Withdraw all" chip and one-line confirm), transfers start empty and get a review step above a threshold (e.g. 20 000 Ft), first deposit is a separate step after the goal exists, Pay now shows the beneficiary, and every money move has a 10 s Undo that survives page changes (persistent chip).
- (b) A confirm sheet for every money move.
- (c) Keep today (prefilled values, 5 s Undo toast).

**Recommendation:** Recommend (a). Prefilled one-tap sends/withdrawals plus an Undo that disappears on any tap are the risky combination; (a) keeps the fast Undo habit and removes accidental cases. Block-card stays a reversible toggle (B).

Resolves (4): A3-11, A5-4, B6-5, B8-2

Also fixes sev-3 (counted in section 2): B2-1, B3-1, B8-1

### D7. How does the pitch build treat dead ends and demo-only scaffolding?

Flows affected: 6 (A1, B5, B8, C1, C3, C6)

Options:
- (a) Hide rows the prototype does not demonstrate; keep a few as disabled "Soon" rows where the jury should see the full OTP shell; make Settings and Filter real (see their decisions).
- (b) Keep everything as a realistic shell with "not available in the demo" toasts.
- (c) Hide all non-working rows.

**Recommendation:** Recommend (a). 14 of 24 More rows, 4 Transfer rows, Share, For you tabs and card toasts read as broken app errors in a live pitch (B and C agree); the Face ID/login step stays demo-only and is said so in the demo script (A).

Resolves (5): A1-1, B5-2, B8-3, C3.3, C6.4

Also fixes sev-3 (counted in section 2): C1.1

### D8. Do goals have one create/edit flow and a defined end state (edit or delete with money inside, goal reached)?

Flows affected: 5 (A2, A3, A6, B2, C4)

Options:
- (a) One wizard behind every entry (shared tile chooser; first deposit and reminder only for the first goal; same landing with the new goal highlighted), in-place edit sheet even when money is inside, and a "Goal reached" card (Withdraw / New goal / Keep saving).
- (b) Keep both wizards and add only a celebration card.
- (c) Keep as is.

**Recommendation:** Recommend (a). Two parallel wizards teach different behaviour (headings, rules, landing differ), renaming needs withdrawing everything, and the biggest success moment is a dead end.

Resolves (7): A2-3, A3-12, A6-9, B2-2, B2-3, B2-4, C4.3

Also fixes sev-3 (counted in section 2): A3-16

### D9. Are the saving rules (payday rule, round-ups, weekly transfer) one global set managed in one place, and which are on by default for a first goal?

Flows affected: 4 (A3, B2, B3, C5)

Options:
- (a) Global rules managed from one "Saving rules" sheet (tab is master, goal pages show the target goal); first goal defaults to payday rule only; the legacy "Recurring transfer" is merged into Weekly transfer.
- (b) Rules stay per goal on the goal page.
- (c) Keep both places and make the legacy Recurring transfer a general scheduler.

**Recommendation:** Recommend (a). Rules are global in the code but look per goal (silent re-pointing), and B, C and A all find a second, dead automatic-saving path; B suggested (c), C and A suggest merging, and merging avoids two systems.

Resolves (8): A3-8, A3-14, A3-17, B2-6, B2-7, B3-5, C5.3, C5.4

Also fixes sev-3 (counted in section 2): B3-3

### D10. Which daily-value features work without the analyst opt-in?

Flows affected: 4 (B1, B4, B6, C2)

Options:
- (a) A simple free-to-spend figure on Home, bill due dates and the late-bill warning (read-only, always on), and recategorising work without opt-in; the analyst only adds analysis, and the opt-in ends on the analysis page.
- (b) Everything stays behind the opt-in as today.
- (c) Show them blurred with "Turn on to see".

**Recommendation:** Recommend (a). Safe to spend and bills are the daily value and the consent text concerns categorising, not balance minus bills (B); a student who never opts in gets no due dates or late warning.

Resolves (3): B1-1, B4-2, C2.6

Also fixes sev-3 (counted in section 2): B6-1

### D11. Is there a real Settings, and what notification, reminder and inbox controls does it hold?

Flows affected: 3 (A5, B7, C5)

Options:
- (a) Real Settings with a Persely section (payday rule, reminders, analyst, notifications), per-type notification toggles (bills, Sunday streak reminder, payday, monthly story), quiet hours, a 20-item notification inbox, a soft pre-prompt for push after the first goal exists, avatar tap opens profile/Settings (demo panel behind a flag).
- (b) A Persely gear icon only.
- (c) Nothing in the prototype.

**Recommendation:** Recommend (a), with a Persely gear that deep-links into Settings (C). Persely settings are spread over 5 places and push cannot be configured or re-read.

Resolves (8): A5-2, B7-2, B7-4, B7-6, C5.2, C5.5, C5.6, C5.7

Also fixes sev-3 (counted in section 2): C5.1

### D12. Where do rewards and discounts live?

Flows affected: 3 (B2, B5, C6)

Options:
- (a) One "Perks" page (Discounts + My rewards) from More and a row on the Persely tab, partners named with redemption steps, rows open a detail sheet before activating.
- (b) Rewards stay inside the health-score sheet.
- (c) Rewards become a second tab inside Discounts.

**Recommendation:** Recommend (a) (or (c)). Earned rewards have no wallet and three partner concepts do not link (C), and the sheet is only reachable with the analyst on (B).

Resolves (4): B2-12, B5-4, C6.2, C6.3

Also fixes sev-3 (counted in section 2): C6.1

### D13. How do the late-bill card and the bills pages behave?

Flows affected: 2 (B6, C2)

Options:
- (a) The late-bill card lives on Home only with Pay now and All bills; the two skip actions move into the bill sheet; one bills row on the analysis page (pocket as a section); Bills pocket move defaults to the unpaid amount.
- (b) Keep as is (card on Home and Persely tab, four buttons).
- (c) Keep both cards but only change the pocket default.

**Recommendation:** Recommend (a). Five entries open one page, two skip links silence the warning with no evidence, and the pocket moves the whole month (61 000 Ft) although only 47 550 Ft is unpaid.

Resolves (4): B6-2, B6-4, C2.5, C2.7

### D14. What does Transactions get: search, filters, always-tappable rows?

Flows affected: 2 (B4, C7)

Options:
- (a) Search by name plus category/date chips, category passed in from the analysis, rows always open a detail sheet.
- (b) Filter chips only.
- (c) Nothing for the prototype.

**Recommendation:** Recommend (a) (B: (a) then date/category; C: (a)). About 60 payments a month in uppercase payee names cannot be scanned.

Resolves (1): C7.3

Also fixes sev-3 (counted in section 2): B4-1, C7.1

## 2) SEVERITY-3 LIST (19)

- A1-2: First screen shows 110 000 Ft and 2 goals while the pop-up treats the user as new. Fix: D1
- A3-16: Two goal-creation flows with different headings, buttons, rules, defaults and landing. Fix: D8
- A3-18: Goals made via New + never set `onboarded`, so the tab still says "Let's pick a goal" and no hints run. Fix: no decision needed: just fix (set `onboarded` whenever a first goal is created, by any path)
- A4-1: Junior end trigger unclear ("41 days or when you graduate"; age 24 never stated). Fix: D2
- A4-2: "Keep my 3.0%" is one tap and flips the badge to Graduate before the salary condition is met. Fix: D2
- A5-1: No terms, privacy, rate conditions or deposit-protection info anywhere in setup. Fix: D2
- A6-1: First-run call to action ("Set a goal...") sits below the fold on first visit. Fix: D1
- B2-1: Withdraw is prefilled with 5 000 Ft and moves money in one tap; "Take all out" has no confirm. Fix: D6
- B3-1: Transfer form prefilled, accepts blank name/bad account, no review and no Undo. Fix: D6
- B3-3: "Scheduled and recurring transfers" is a dead feature that moves no money. Fix: D9
- B4-1: Transactions Filter is a dead toast on a 191-row history. Fix: D14
- B6-1: Bills (due dates, late warning, Pay now) exist only behind the analyst opt-in. Fix: D10
- B8-1: Money-out actions cannot be undone or reviewed (repeats B2-1, B3-1). Fix: D6
- C1.1: 14 of 24 More rows and 4 Transfer rows look live but only toast "not available". Fix: D7
- C2.1: Safe to spend sits about 1 590 px down a 2 921 px Spending analysis page. Fix: D3
- C4.1: Year page has no in-product entry (demo fast-forward only). Fix: D3
- C5.1: No working Settings; Persely settings spread over 5 places. Fix: D11
- C6.1: Earned rewards live only inside the health-score sheet, no wallet. Fix: D12
- C7.1: No search and a dead Filter on a long list of uppercase payee names. Fix: D14

## 3) NO-DECISION FIXES (8 themes)

### N1. Tap sizes (app minimum is 44 px) (7)

Enlarge targets: "New +" 47x18, setup Back icon 22x22 and "Not now" 58x19, text links ("All accounts", "Details", "Edit", "All"), mail icon 26x31, switches 50x30 (goal page, bills, notifications), 9.5 px text on Home/Spending analysis.

IDs: A3-19, A6-8, B1-5, B2-10, B6-6, B7-5, C2.9

### N2. Accessibility semantics (3)

Add dialog role/aria-modal, focus handling and Esc to pop-up, setup overlay and sheets; aria-live on the toast; larger condition text and explicit close controls on sheets.

IDs: A2-4, A5-6, A5-7

### N3. Back, exit, close and undo recovery (6)

Add Back to goal step 1 and the tile chooser; confirm or save-draft on setup "Not now"; explicit close on date/info sheets; skippable splash; Undo on recategorise and on the story "Set it up"; return to the story after "Pick a new date".

IDs: A1-4, A2-2, A3-5, A3-9, B4-3, C3.4

### N4. Broken states, validation and layering (8)

Disabled Next needs a visible reason; show a message when an amount is clamped or empty; validate amount/name/account fields; remove the Bills page self-link; give the empty "Money in each month" panel a direct link; fix pop-up over lock layering; gate demo hotkeys behind the demo panel.

IDs: A1-5, A1-6, A3-1, A3-2, B2-8, B3-6, B6-3, B8-5

### N5. Copy and labels (7)

Explain "x2" round-ups and the estimate; reword the reminder status row so the happy path is not an error; remove unsupported "Trending" and align the Car tile label; replace hard-coded "Anna"/congratulation text; fix state-dependent push copy (0-week streak, analyst-off Safe to spend, unowned goal "Balaton in July"); one error wording; show the user's own bill label ("Rent share") in Transactions.

IDs: A2-6, A3-7, A3-10, A4-7, B7-3, B8-4, C2.8

### N6. Numbers, seed data and dates consistent (6)

Preset amount/date vs default rules (no instant shortfall); one weekly-amount definition for forecast and fix; same date base everywhere ("Today" vs 13 November vs 20 November); same sign for a Persely deposit on both screens; push content reflected in balances and rows.

IDs: A3-6, B2-5, B3-4, B4-4, B4-5, B7-1

### N7. Layout, density and timing (3)

Slow or shorten dense timed story slides (bills receipt, progress slide with another goal's warning); show the health score once; queue auto-opening reward/goal sheets until after the page they interrupt.

IDs: C3.6, C4.4, C6.5

### N8. Positives to keep (no change) (2)

Keep: "A plan, not a limit" and "A guide, not a limit" notes, Undo after Pay, per-bill screen-reader labels, status chips; story screen-reader text, modal role, pause label, plain-language lines.

IDs: C2.10, C3.7

## 4) COVERAGE

| File | Findings | In section 1 (sev 1-2) | In section 2 (sev 3) | In section 3 | Sum |
|---|---|---|---|---|---|
| A (A-first-run) | 57 | 32 | 7 | 18 | 57 |
| B (B-daily-use) | 53 | 31 | 6 | 16 | 53 |
| C (C-insight-nav) | 44 | 30 | 6 | 8 | 44 |
| Total | 154 | 93 | 19 | 42 | 154 |

By severity: sev 3 = 19, sev 2 = 85, sev 1 = 50 (total 154). The files state A 57 (7/34/16), B 53 (6/26/21), C 44; counts above were produced by parsing the files and each finding ID is assigned exactly once.

Decision questions merged: A 18 + B 20 + C 20 (as listed in the files) into 14 decisions.

