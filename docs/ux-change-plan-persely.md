# UX change plan: Persely (the parts Team 3 built)

Goes with `ux-audit-persely.md`. Ranked by Impact (1–5), then evidence strength, then lower effort. **QW** = quick win (Impact 4 or more, effort S).

## Backlog

| Rank | Change | Fixes | Impact | Effort | Evidence | Patterns | Metric |
|---|---|---|---|---|---|---|---|
| 1 | Payday "Bills first" sheet: one recommended action with the exact amount and the result shown before confirming | F01 | 5 | S | Moderate (P22 extrapolated from checkout) | P22, P26 | Bill-pocket moves that cover exactly the unpaid amount; payday sheet abandonment |
| 2 | One income base for the split, Next month and the story | F02 | 5 | M | Moderate | P11, P21 | Comprehension test: % of users who can say what share they save; "numbers don't match" comments |
| 3 | **QW** Bills first headline separates "late" from "due soon" | F04 | 4 | S | Strong (P29 guidance) / moderate | P29, P19 | Correct answer to "which bill is late?" in a usability task; Pay now tap rate |
| 4 | **QW** Analyst consent: two equal choices, shorter text | F03 | 4 | S | Strong prevalence / weak remedy | P13, P40, P41 | Opt-in rate and opt-out within 7 days (watch both) |
| 5 | Persely tab order and one home for analytics | F06 | 4 | M | Moderate | P16, P18, P19, P42 | Taps and time to reach a goal and to reach Next month; first-click success |
| 6 | Label the must-pay switches and use one name for the action | F05 | 3 | S | Strong (P37) / moderate | P40, P37 | Errors in "mark rent as must-pay" task; screen-reader label check |
| 7 | Notification permission: explain and offer a way to turn it on | F07 | 3 | S | Moderate / weak | P32, P31 | Rate of turning notifications on after the explainer |
| 8 | One Persi message at a time on the first visit | F08 | 2 | S | Strong | P03 | Hint dismiss rate; first-session task success |
| 9 | Undo toast placement while navigating | F09 | 2 | S | Moderate | P30 | Undo use; mis-taps under the toast |
| 10 | New goal progress in forints, not "<1%" / "0%" | F10 | 2 | S | Strong (P36) for the goal-pot pattern; this copy is a hypothesis (H3) | P36 | Second deposit within 14 days |
| 11 | Say what the health score measures where it appears | F11 | 2 | S | Moderate | P41 | Comprehension; score sheet opens |
| 12 | Friends: opt-in only, off by default | F12 | 2 | S | Moderate (P24) / hypothesis for effect | P24, P36 caveat | Friends opt-in rate; saving per user with and without friends |
| 13 | Story: consistent colours across slides | F13 | 1 | S | Moderate | P11 | – |
| 14 | Story: start on open, no "Tap to start" | F14 | 1 | S | Hypothesis (no library evidence) | – | Story completion rate |

## 1. Payday "Bills first" sheet (F01)

**What to change:** the sheet shows three stacked actions with different amounts (61,000 / 7,500 / not this time). It moves a whole month of bills when only 47,550 Ft is unpaid, and it does not show the result of each choice.

**How:**
1. Compute `unpaid` = the must-pay bills not yet paid this month. Offer exactly that: "Move 47,550 Ft to Bills pocket".
2. Under the button, show the result before confirming: "Then: bills covered · 7,500 Ft to First home fund · 19,950 Ft free for Fun".
3. Make the one recommended path a single button that does both moves (bills pocket + saving rule): **"Cover bills and save 7,500 Ft"**.
4. Put "Only cover the bills" as a secondary option, and "Not this time" as a text link.
5. States:
   - **No unpaid bills:** the normal payday sheet.
   - **Salary does not cover the bills:** "Your salary covers 2 of 3 bills. Move 47,550 Ft to Bills pocket; the saving rule waits this month." Use plain, blame-free copy (P29).
   - **Pocket already holds enough:** "Your bills are covered by Bills pocket", and the saving action only.
6. The Undo toast after the move restores both moves.

**Acceptance:**
- The amount moved equals the unpaid amount.
- The text under the button matches the balances after the move.
- One tap completes the recommended path.

**Test:** usability task "Your salary just came in. Make sure the rent is covered." Success = the student picks the recommended path and can state what is left for Fun. Five users per round (P45).

**Risks:** making one button do two moves hides the saving step. Keep both lines visible in the "Then:" summary.

## 2. One income base (F02)

**What to change:** the split's percentages use the 75,000 Ft salary; Next month uses about 138,000 Ft of all income. Saving reads 10% in one place and 5% in another.

**How:**
1. Use one base everywhere: **projected monthly income** from Next month (regular income plus the lowest of the last 3 months of other transfers).
2. Express the split in that base: Must-pay (locked), Everyday essentials, Fun, Saving.
3. The suggested split is the projection itself, rounded to 5%.
4. Keep the payday rule as "10% of each salary". Where the split shows Saving, add "7,500 Ft = 10% of your salary".
5. Use the same four bucket names and colours in the analyst sheet, My split, Next month and the story (slides 3 and 7).
6. Say the base once at the top of each screen: "Based on about 138,000 Ft a month in".
7. Empty or low-confidence state (under 3 months of data): "Based on 1 month, a rough guess", with no percentages until a second month exists.

**Acceptance:**
- For the same month, every screen shows identical bucket percentages and amounts.
- Saving's forint amount equals the payday rule plus the weekly transfer and round-ups (or shows how the two differ).

**Test:**
- Comprehension task: "How much of your money goes to saving each month?" Answers should match across screens.
- Ask what each % refers to (P21: measure understanding, not spending cuts).

**Risks:** the reference build and the demo script quote 50 / 40 / 10, so update both. The split moves to 4 buckets, so check that the reward rule ("stayed within your split") still works.

## 3. Bills first headline: late vs due soon (F04)

**What to change:** one total mixes an overdue rent share with a phone bill due in 6 days.

**How:**
1. Card headline counts only **late** bills: "Rent share is late: 42,000 Ft (due on the 2nd)". Buttons stay as now: Pay now, Already paid elsewhere, Not due this month.
2. Add a second line for upcoming bills: "Coming up: Phone 5,550 Ft on the 20th".
3. The Fun bucket hold-off and the push use only late bills. Due-soon bills reduce Safe to spend but do not trigger "Bills first".
4. States:
   - **Several late bills:** "2 bills are late: 47,550 Ft", with each listed on tap.
   - **None late, but due soon and the balance cannot cover them:** "Phone 5,550 Ft on the 20th: your balance won't cover it", in the orange style without the word "late".

**Acceptance:**
- The headline amount equals the sum of late bills only.
- No "Bills first" push when nothing is late.

**Test:** task "Which bill is late and what should you do?" with 5 users. Success = they name the bill and use Pay now.

**Risks:** the demo script quotes "Bills first: 47,550 Ft still to pay". Update act 8 to "Rent share is late: 42,000 Ft".

## 4. Analyst consent (F03)

**What to change:** a large green accept button, a plain-text decline and a third unclear option.

**How:**
1. Cut the text to 3 lines:
   - "Sorts your payments, finds your regular bills and suggests a monthly split."
   - "Only from this OTP account. Nothing moves without your tap."
   - "Turn it off any time."
2. Put the suggested split under it, as now.
3. Two buttons of equal size and weight: **Turn on** and **Not now**.
4. Remove "Only turn it on, I will choose later". After Turn on, the split appears with "Use this split" and "Change it", so choosing later still works.
5. Link "What it reads" to the full list, which keeps the detail for those who want it.

**Acceptance:**
- Both buttons are the same size and style family.
- There are at most about 40 words before the buttons.

**Test:** compare opt-in rate and opt-out within 7 days against the current sheet. A higher opt-in with more quick opt-outs would mean users did not understand it (P13).

**Risks:** the opt-in rate may fall. That is acceptable for consent: the brief's rule is "a suggestion, never a restriction".

## 5. Persely tab order and one home for analytics (F06)

**What to change:** the tab has 11 blocks over about 3 screens, and the analytics are linked from both Home and Persely.

**How:**
1. Keep the tab about saving: Total → Goals → Money in → Your habits (streak + score) → Junior ends (moves to the top in the last 90 days) → How Persely works.
2. Move My split, Safe to spend, Next month, Must-pay bills and Bills pocket to one **"My money"** page. Reach it from:
   - one Home card (Safe to spend + Bills first state);
   - one row in the Persely tab: "My split · Fun 26% used · Safe to spend 59,840 Ft".
3. Friends: collapsed and opt-in (change 12).
4. Bills first alerts still show on top of Home and the Persely tab when a bill is late (P19 priority rule).

**Acceptance:**
- With the analyst on, the Persely tab is no longer than about 2 screens.
- Each analytics page has one entry path from each tab.

**Test:**
- First-click test: "See next month's plan" and "Add money to your home fund".
- Compare time and success with the current layout (P44).

**Risks:** change aversion for team members who learned the current order. The demo script's analytics steps change. Stage it (P42) and keep the old order behind a flag until the run-through.

## 6. Label the must-pay switches (F05)

**How:**
1. Add a column label above the switches, "Must-pay", and set each switch's aria-label to "Count Rent share as must-pay".
2. Give the paid state its own chip ("Paid 2 Nov"), never next to the switch alone.
3. Use one name for the action everywhere: the entry button and the page button both say **"Confirm my bills"**.

**Acceptance:**
- VoiceOver reads "Count Rent share as must-pay, switch, on".
- The entry and page buttons use the same wording.

**Test:** task "Netflix is not a must-pay bill; make sure it isn't counted". Success without hesitation.

## 7. Notification permission (F07)

**How:**
1. Never show "Notifications are not allowed" on its own.
2. Where reminders matter (the streak card and the weekly reminder in onboarding step 3), show an inline row: "Reminders are off. Turn on notifications to get your Sunday reminder." Add a **Turn on** button that opens the browser or system prompt, or explains how to enable it in Settings if it was denied.
3. Permission-denied state: keep the streak working and say "No reminders: you can still save any time".

**Acceptance:**
- No toast without an action.
- The denied state is explained where the feature lives.

**Test:** check the grant rate after the explainer (P32 metric).

## 8–14. Smaller fixes

- **8. One Persi message (F08):**
  - On the first visit show only the hint strip.
  - Persi's line starts after "Got it".
  - At most one Persi message on screen.
- **9. Undo toast (F09):**
  - Close the toast when the user navigates to another page; Undo stays available for 5 s on the page where the action happened.
  - Toasts never cover list rows or buttons.
- **10. Progress copy (F10):**
  - Below 1%, show "1,000 Ft in · first step" on the card instead of a percentage, as the card already partly does.
  - Story slide 6 uses the forint amount as the hero when the percentage is under 1.
- **11. Score explanation (F11):**
  - Add one line under the score: "Spending under income · no overdraft · a buffer · regular saving".
  - On the story slide, use "50 of 100: 2 of 4 habits held this month".
- **12. Friends opt-in (F12):**
  - Hidden until the student taps "Add friends".
  - Never shown on the first visit.
  - Ranking by streak only.
- **13. Story colours (F13):**
  - Slide 2 uses neutral white for In and the bucket colours for Out (same as the donut on slide 3).
- **14. Story start (F14):**
  - The story starts on open.
  - Slide 1 becomes a 2-second title.
  - This is a hypothesis: measure story completion.

## Phased rollout

| Phase | Changes | Why first |
|---|---|---|
| 1 (before Friday) | 1, 3, 4, 6, 8, 9, 13 | Small edits, directly visible in the demo (payday, bills, consent), low risk |
| 2 (before Friday if time) | 2, 7, 10, 11, 14 | Number consistency (2) is the biggest trust fix but touches the analyst maths; re-run the self-checks |
| 3 (after the pitch) | 5, 12 | IA change with change-aversion risk; needs a first-click test with students first (P42, P45) |

After each phase:
- re-run the analytics self-checks;
- update `demo-script.html` (act 5 payday sheet, act 7 split numbers, act 8 bill wording);
- re-record the MP4 backups.

## Open questions

1. **Split base:** should the split use all income (salary + family transfer) or the salary only? The plan proposes all regular income. For students the family transfer can be large and irregular.
2. **Bills pocket:** should it be one pot or per-bill, and should leftovers return to the Junior account at month end?
3. **Friends:** keep in the product at all, or only for Shared Persely partners?
4. **Late threshold:** is a bill "late" on its usual day + 1, or after the 5-day window the analytics already use?
5. **Testing:** can we run a 5-student usability round (tasks T5–T8) before Friday, or only after?
