# Simple Persely, Phase 3 (connections, not push): notes

Plan: `docs/simple-persely-plan.md` (1.3, 2c, 2e, 2f). Decisions: `docs/simple-persely-decisions.md` (D5, D9).
Everything here is behind `SIMPLE_PERSELY` (`js/01-tokens-helpers.js`). `?simple=0` shows the screens as they were, and the 212 checks from before still pass.

## What changed (flag on)

### 1. One "Rate and safety" sheet (`SHEETS.ratesafe`, `js/08-persely-pages-sheets.js`)
- It replaces Good to know, Why Persely? and the rate part of How Persely works.
- `SHEETS.goodtoknow` and `SHEETS.whyp` point to `SHEETS.ratesafe`. So every old entry opens it with no change to the code that holds the entry: Home "Why Persely?", the Persely tab trust line, wizard step 3, the goal page, the Junior page (new "Rate and safety" row), How Persely works, and the Add money footer.
- Content:
  - 3.0% a year on up to 500 000 Ft, all forint goals together, the real end date (`juniorEndLabel()`).
  - 28% tax, about 2.2% kept, paid every month.
  - Withdraw any time, for free, no fees.
  - Keep 3.0% for 12 more months: first salary at OTP within 6 months, otherwise the standard rate after 30 days' notice. Includes a link to the Junior page.
  - Others get 0.01%.
  - Deposit protection: one line, the existing Deposit protection link, and a `CONFIRM WITH OTP: scheme name and coverage limit` marker.
  - The per 100 000 Ft bars after tax: Persely 3.0% = 2 160 Ft, Savings account 3.5% = 2 520 Ft, old 0.01% = 7 Ft.
  - The plan's comparison sentence.
- How Persely works keeps only Money in and Streak. A "Rate and safety" row at the top carries plan item 15.
- **Honesty line** `rsLine()` (`js/06-persely-goals.js`): "3.0% until [date] · Withdraw any time · Protected ⓘ". The whole line is a 44 px button that opens Rate and safety. It is used on the goal page, the Add money sheet and wizard step 3 (`gtkCard()`). If the tab agent builds its own honesty line, the two can be merged into one helper.

### 2. Goal page (`goalPageSimple()`)
- **On top:**
  - The Goal reached card, as before.
  - Saved of target and the bar.
  - One date sentence (`goalDateLine()`, plan item 14): "At this pace you get there in November 2027. That is after your date."
  - The late or behind fix buttons, as before.
  - Add money and Withdraw.
  - The honesty line.
- **Under "Settings for this goal"** (one tap; `S._gset`, screen state only):
  - The rate line (item 12: "This goal earns about 1 380 Ft a year, after tax.").
  - The goal date and the weekly figure.
  - The goal's own saving rules (`ruleRowsHTML`, unchanged, with Undo).
  - Edit and Delete (`goalManageHTML`, unchanged, Delete with Move).
- `openGoalRules()` opens the section, so the Saving rules links still land on the rules.
- **Empty goal:** "Add money and it starts to earn 3.0%." is on the card and in the settings rate line. This fixes the "About 0 Ft a year after tax on 0 Ft" content bug.
- **Measured** at 390 x 844 (visible words / numbers):

  | Goal | Flag on | `?simple=0` |
  |---|---|---|
  | Summer holiday | 56 / 10 | 146 / 24 |
  | PS5 | 55 / 9 | 141 / 20 |
  | A new goal from the wizard | 43 / 6 | 156 / 29 |

### 3. Add money (`hubsaveSimple()`)
- **Goal chips:** only with 2 or more goals. With one goal it reads "To [goal]".
- **Account:** one line, "From Junior account · Change". Change shows the existing From chooser (the account list in this sheet) and the goal chips. It does not open Between my accounts, so money moves exactly as before.
- **Amount (D5):** the last amount used is chosen (`S.lastAddAmount`, set in the `data-hubsave` handler after the Undo snapshot). The first open chooses the 1 000 Ft chip.
  - The chosen chip and the button label ("Add 2 000 Ft") follow the field (`hsSync()`). This is ethical guardrail 7: the button says what moves.
- **Footer:** the honesty line.
- **Unchanged:** the deposit code, the streak line, euro goals (no pre-selected amount, no honesty line) and Undo.

### 4. Copy (plan 2f)
| # | Where | Now |
|---|---|---|
| 1 | Rate and safety | "The Savings account pays a bit more: 3.5%. Persely pays 3.0%. Both are taxed. Persely keeps each goal apart. You can withdraw any time, for free." |
| 2 | Rate and safety | "You get 3.0% a year on up to 500 000 Ft. It ends on [date]." |
| 3 | `SCORE_LINE` (health score sheet, also the tab score row) | "Spend less than you get. Stay above zero. Keep a little extra. Save often." |
| 4 | Settings > Push notifications | "We tell you when you pay and when money comes in. We also tell you how you save." (split: the plan's one sentence has 14 words) |
| 6 | `juniorRow()` (Home and tab Junior row) | "Your 3.0% ends on [date]" |
| 9 | What it reads | "It uses them to show what you can spend. It also shows which bills are next." (split: 14 words) |
| 10 | Health score indicator | "You keep saving for a goal" |
| 11 | New goal sheet | "3.0% a year on up to 500 000 Ft. Until [date]." |
| 12, 13, 14 | Goal page | As in the plan |
| 15 | How Persely works, Rate and safety row | "You get 3.0% on up to 500 000 Ft until [date]." |

- **New lines** (all FK ≤ 4, 12 words or fewer per sentence):
  - "28% tax comes off the interest. So you keep about 2.2%. We pay it every month."
  - "Your first salary must come to OTP within 6 months. If not, you get the standard rate after 30 days' notice."
  - "A state scheme protects your money up to a limit."
- **Not changed:**
  - "Your November story is ready": it lives in a push string and the Home story card, both out of this scope.
  - Item 11 on the Persely tab setup card: tab text belongs to the tab agent. Only the New goal sheet copy was changed.

## Self-checks
`fkGrade(text)` in `js/01-tokens-helpers.js` returns `{grade, words, sentences, longest}`. It matches the plan's FK script within 0.5.

**New, flag on only:**
- `chk-simple-rate-safety-one-sheet`
- `chk-simple-goal-page`
- `chk-simple-add-money`
- `chk-simple-copy-grade`

**Gated, old assertion with `?simple=0`, equivalent with the flag on:**
- `chk-good-to-know`
- `chk-why-persely`
- `chk-date-format`: the Junior row wording.
- `chk-rate-has-cap`: a 3.0% mention may point to Rate and safety. The sheet itself holds the full conditions.
- `chk-withdraw-empty`: Add money starts at 1 000 Ft.
- `chk-create-no-money`: step 3 has the honesty line.
- `chk-first-goal-payday-only`: "Start your streak?" starts at 1 000 Ft.

**Results:**
- Flag on: 216 of 216.
- `?simple=0`: 212 of 212.
- The same counts hold for the standalone build opened from `file://`.

## Legal caution (keep before real use)
- The Rate and safety wording, and showing one honesty line in place of the full conditions on the money screens, need **OTP legal review**. The same caution is a code comment above `rsLine()` and `SHEETS.ratesafe`.
- **CONFIRM WITH OTP:**
  - the rate and the 500 000 Ft cap across all forint goals
  - monthly payment
  - the 12 month extension rule and the 30 days' notice
  - the 0.01% standard rate
  - the Savings account rate (3.5%) and its access terms
  - the deposit protection scheme name and coverage limit (the sheet only says "a state scheme ... up to a limit")
- The existing `<!-- CONFIRM WITH OTP -->` markers are kept on every block that had them.
