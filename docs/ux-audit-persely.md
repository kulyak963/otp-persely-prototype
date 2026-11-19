# UX audit: Persely (the parts Team 3 built)

Date: 19 November 2026. Method: ux-redesign-audit, evidence from the UX Redesign Pattern Playbook (P01–P45, read in full from Google Drive).

## 1. Scope

- **App:** OTP Persely prototype, branch `Tamas-branch` (latest local build, including the live fast-forward).
- **Flow:** only what the team built inside Persely, not the copied OTP MobilBank skeleton:
  - the update pop-up and the 3-step goal onboarding;
  - the Persely tab, goal pages, and the Add money, Withdraw, payday rule and New goal sheets;
  - the financial analyst: consent sheet, My split, Next month, Must-pay bills, Bills first alert, payday "Bills first" sheet, Bills pocket and Safe to spend;
  - the monthly story;
  - the graduation screen.
- **User:** students and young adults 18–29 (persona Kiss Anna, 75,000 Ft salary).
- **How it was inspected:** the real build in Chrome at 390 × 844 (iPhone 15 size) with touch. The run started with the demo key U, then went through onboarding, turned the analyst on, triggered a missed bill (B) and a payday (P), then opened the story and the graduation screen. Screenshots and screen text were captured for every step.
- **Not inspected:**
  - a real iPhone;
  - VoiceOver or TalkBack;
  - larger system text;
  - landscape;
  - the Shared and Euro Persely flows beyond their entry points;
  - real push delivery;
  - load performance.

  The fast-forward, demo panel and Face ID screen are presentation tools, not user features, so they are out of scope.

## 2. Flow map (observed)

| # | Task | Screens in order | Taps | Fields | Decisions |
|---|---|---|---|---|---|
| T1 | Set a first goal from the pop-up | Pop-up → Step 1 Your goal → Step 2 Money in → Step 3 Check and create → Persely tab | 4 (tile, Next, Next, Create goal); +1 for the one-tap "on time" fix | 0 required (name, amount, date prefilled from the tile) | Amount, date, rules, first deposit (all prefilled) |
| T2 | Add money | Persely tab → Add money sheet | 3 (Add money, amount chip, Add money) | 0 (chips) | Goal, amount, account |
| T3 | Withdraw | Persely tab → Withdraw sheet | 4 (Withdraw, goal, type amount, Withdraw) | 1 | Goal, amount |
| T4 | Change the payday rule | Persely tab → Money in row → Payday rule sheet | 3 (row, % chip, Save) | 0 | %, goal, ask first, keep 20,000 Ft |
| T5 | Turn the analyst on | Home tip link or goal page → Financial analyst sheet | 2 | 0 | Accept split / turn on only / not now |
| T6 | Confirm must-pay bills | Persely tab or Home → Must-pay bills page | 2 (Check my bills, Confirm my must-pay bills) | 0 | One switch per bill |
| T7 | Pay a missed bill | Home Bills first card → Pay sheet | 2 (Pay now, Pay 42,000 Ft) | 0 (prefilled) | – |
| T8 | Payday with bills unpaid | Push banner → Bills first sheet | 2 (banner, one of three buttons) | 0 | Bills pocket / saving rule / not this time |
| T9 | Watch the monthly story | Persely tab → story ring → 8 slides | 2 (ring, tap to start), then auto | 0 | Optional Pay now / Set it up on slides |
| T10 | Keep 3.0% at graduation | Junior ends row → Graduation screen | 2 | 0 | Keep my 3.0% / raise rule to 15% |

## 3. Findings

Severity: High = can lead to a wrong money decision or breaks trust; Medium = slows the task or confuses; Low = polish.

| ID | Screen / step | Observed symptom | Why it matters | Severity | Patterns | Evidence strength (as in playbook) |
|---|---|---|---|---|---|---|
| F01 | Payday "Bills first" sheet (T8) | Three stacked actions. The primary moves **61,000 Ft** to the Bills pocket, while the sheet's own line says **47,550 Ft** still to pay (61,000 is the whole month, including bills already paid). The sheet does not show what is left for Fun after each choice; it only shows "Left for Fun 19,950 Ft" for the saving-rule path. | A money move whose amount does not match the problem it solves; the student cannot predict the result before confirming. | High | P22, P26 | P22: strong for cost transparency in checkout, moderate for banking transfers (extrapolation from e-commerce). P26: moderate |
| F02 | Analyst sheet, My split, Next month, story slide 7 | Two income bases. The split uses the **75,000 Ft salary** (Essentials 50%, Fun 40%, Saving 10%). Next month uses **about 138,000 Ft of all income** (Must-pay 44%, essentials 27%, Fun 20%, Saving 5%). So Saving is 10% on one screen and 5% on the next, and the two sets of percentages cannot be reconciled. | Contradicting numbers in a money feature read as errors; trust comes from consistency. | High | P11, P21 | P11: moderate. P21: strong that insights raise engagement but not behaviour; moderate for design elements |
| F03 | Financial analyst consent sheet (T5) | The accept button is large and green ("Turn on and use this split"). Decline ("Not now") is plain text at the bottom. A third, unclear option sits between them: "Only turn it on, I will choose later". There are about 110 words before the first button. | Unequal weight on accept vs decline is a listed dark-pattern symptom, and three choices slow the decision. | Medium | P13, P40, P41 | P13: strong that dark patterns are common; weak for remedy effects. P40: moderate. P41: moderate |
| F04 | Home Bills first card, push, Fun bucket | The headline "Bills first: 47,550 Ft still to pay" adds an **overdue** rent share (42,000 Ft, due on the 2nd) to a phone bill **not due for 6 days** (5,550 Ft). The same total drives the push and the Fun hold-off. | Urgency is overstated, and the student cannot tell what is late and what is upcoming. | Medium | P19, P29 | P19: moderate. P29: strong (guidance) |
| F05 | Must-pay bills page (T6) | Every bill has an unlabelled switch next to a "Paid" chip; the switch means "count as must-pay", which is said nowhere at the control. The entry button says "Check my bills"; the page button says "Confirm my must-pay bills". | A student may read the switch as "pay automatically" or "mark paid". Mismatched labels for one action. | Medium | P40, P37 | P40: moderate. P37: strong (prevalence of unlabeled controls; web data) |
| F06 | Persely tab with the analyst on | 11 blocks over about 3 screens: Persi + total, goals, Money in, My split, Safe to spend, Bills and next month (3 rows), Your habits + score, Junior ends, Friends, How Persely works. Next month and Must-pay bills are also linked from Home. | Savings, the core purpose of the tab, gets pushed down by analytics; two entry points for the same pages. | Medium | P16, P18, P19 | P16: moderate. P18: moderate. P19: moderate |
| F07 | Persely tab, first visit after onboarding | A permission message, "Notifications are not allowed", appears as a toast with no explanation or action (seen in a browser without notification permission). | A dead end: the student cannot fix it from here and does not know what stops working. | Medium | P32, P31 | P32: moderate. P31: weak |
| F08 | Persely tab, first visit | Two Persi messages at once: a hint strip ("Your savings. 3.0% a year…", Got it) above Persi's own line ("PS5 + GTA VI is behind…"). | Competing messages on the first screen after setup. | Low | P03 | Strong |
| F09 | Undo toasts (analyst on, money moves) | The toast "Analyst on. Split 50 / 40 / 10… Undo" stays over Next month rows and the Must-pay list while the student navigates to them. | Covers content right after the action. Undo itself is right. | Low | P30 | Moderate |
| F10 | New goal card, story slide 6 | After a 1,000 Ft first deposit the goal shows "<1%" on the card and "0%" as the story's hero number. | A discouraging first signal on the first goal. | Low | P36 (judge savings by money saved); H3 | P36: strong (field experiments). H3 is a hypothesis |
| F11 | Habits card, story slide 6 | "Financial health score 50 of 100 ▲9" is shown without saying what it measures (the explanation is one tap away). | An unexplained score in a money context. | Low | P41 | Moderate |
| F12 | Friends block in the Persely tab | The tab offers comparing weekly streaks with friends. Amounts are hidden, but it is still peer comparison. | Social comparison may add pressure. In C004 (cited in P36) a social-norm message raised clicks but not saving. | Low | P24 (privacy defaults), P36 caveat | P24: moderate. Effect on young users: hypothesis |
| F13 | Story slide 2 "In and out" | The Out bar is drawn in the saving green (with a blue band), while the next slide's legend uses green for Saving. | Colour meaning changes between slides. | Low | P11 | Moderate |
| F14 | Story slide 1 | Requires an extra tap ("Tap to start") before the story runs. | One more tap before any content. | Low | Hypothesis (no library evidence) | – |

### What works (keep)

- **Short onboarding.** 3 steps with a check-and-create page, prefilled from the goal tile, and it ends with a concrete first action (4 taps). P02, P04.
- **Honest forecast with a one-tap fix.** "+1,500 Ft a week → on time" and "New date: Sept 2027 · +2,000 Ft a week". Goal pots, round-ups and reminders are all present. P36, P29.
- **Undo instead of confirmation dialogs** on money moves and rule changes. P30.
- **Trust and reversibility copy** throughout: "Withdraw any time · No fees · Insured", "Nothing is sent until you tap Pay", "Bills first only tells you: nothing is blocked". P11, P26, P13.
- **Analyst is opt-in** and says what it measures before asking. P13, P32 (benefit first).
- **Share card shows no amounts.** P24 (private by default).
- **Prefilled bill payment** from the last payment, 2 taps. P25, P26.

## 4. Evidence notes

- **Thin evidence base.** Banking outcome data in the library is thin. Most patterns used here are moderate. P22's strong rating comes from e-commerce checkout and is an extrapolation to transfers.
- **Young users.** No library study tests a bank app's savings or budgeting screens with 18–29 users (playbook evidence gap 1). Findings F10 and F12 rest partly on hypotheses H3 and the P36 caveat.
- **Empty states and tone of voice** have only gallery-level evidence (gap 8). F07 rests on P31, which is weak.
