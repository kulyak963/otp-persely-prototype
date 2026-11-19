# Persely home: Money in panel and Spending analysis (UI plan)

Scope: `index.html` Persely tab (`vHub()`), one new sheet, one renamed page, Levente's monthly plan ported in.
Lens: Apple HIG design principles. Plan only, nothing built yet.
Branch for the build (global rule): `feature/persely-money-in-analysis`, off `Tamas-branch`; add it to `BRANCHES.md`.

## 0. What Levente changed (desktop file vs our `index.html`)

Diffed the app `<script>` and `<style>` of `~/Desktop/otp-persely-demo-with-plan.html` against ours. Everything else is the same (plus `window.__STANDALONE` guards for push, which only matter in the single file build).

| Added by Levente | Where in his file | We have |
|---|---|---|
| Real card spending per category for any month: `SPEND_CATS`, `SPEND_IC`, `SPEND_SHORT`, `HIST_YM`, `catSpend(ym)`, `sumVals`, `catShares`, `spreadCats`, `shownMonth()`, `avgSpend()`, `catBars(sp)` | after `CATEGORY`, ~50 lines | a fixed `CATS` array (38 200, 21 400 ...) and `avg = 102400` |
| Home "My monthly spending" gauge and bars driven by that real data (label `1 November – 30 November` from `shownMonth()`) | `vFooldal()` | fixed numbers |
| `monthStep()` writes `parts.cats` on the monthly card payments, so later months have categories | `monthStep` | `parts:{ess, fun}` only |
| **Monthly plan (Kriszti's idea)**: `tint`, `planModel()`, `planDonut()`, `planTips()`, `planHTML()`, `recentCards()`, CSS `.mp-top .mp-g .mp-r .mp-bar .mp-score` | after `SHEETS`, ~65 lines | nothing |
| Monthly spending page (`PAGES.kiadas`) shows `planHTML()` when the split is accepted, else `catBars` + "Plan your month" card; gear becomes `data-plangear` | `PAGES.kiadas` | static Wolt row |
| Split editor: "Of Saving, for investing" stepper (`data-splitinv`, `S.analyst.invest`), plan only | `SHEETS.splitedit`, click handler | nothing |
| Self-checks | none added | |

**The "spending analysis" he means is the monthly plan**: a donut of the month's plan by bucket and category (Must-pay, Everyday essentials split into Groceries, Transport ..., Fun split into Food, Entertainment, Streaming ..., Saving split into Persely and Investing), spent vs planned bars per category, the health score row, and up to 3 Persi tips (over its share, spending fast, the 10% tip). It is built on `splitView()`, so its numbers match My split, Next month and the story.

## 1. Review (apple-design-principles format)

### Purpose (as understood)
The Persely tab is where a student sees what they have saved, what goes in by itself, and how each goal is doing; spending insight is a secondary, optional layer.

### Top issues (most important first)
1. **Simplicity / Familiarity**: the tab shows the same three rules twice (tab "Money in" block and every goal page), with switches in both. Two places to change one thing, and the tab version hides which goal it feeds. -> Remove the tab block; keep the switches only on each goal page; on the tab show one read only summary of what comes in each month.
2. **Purpose**: the hero says what you have, nothing says what is coming in. -> A small panel directly under the hero, copied from Home "My monthly spending" (ring + amount + one comparison line), answers "how much goes in each month and is it enough".
3. **Agency**: payday rule percentage, asks first and the 20 000 Ft floor are one setting for the whole pocket, not per goal. -> Keep them reachable from the panel's sheet (one row to `payrule`) and from every goal page (already there).
4. **Simplicity**: Levente's plan would be a third analytics entry (Home Details page) next to My money. -> One row on the tab, renamed "Spending analysis", opens one page that holds the plan and the existing My money content. Home Details page shows spending only, no plan.
5. **Flexibility**: two new circles must read the same to VoiceOver as on screen, and work at 375 px and 320 px. -> Rings are `aria-hidden`; every number on them is also in visible text; no `aria-label` that differs from the text.

### By principle
| Principle | Verdict | Note |
|---|---|---|
| Purpose | OK -> strong | Hero = what you have, panel = what comes in, goals = where it goes, Spending analysis = optional. |
| Agency | OK | Every switch stays one tap from its goal; Undo on switches unchanged; analysis stays opt in. |
| Responsibility | strong | "A plan, not a limit. Nothing is blocked." stays; investing is plan only, starts at 0, never buys anything. |
| Familiarity | weak -> strong | Both circles reuse the Home `.gauge` geometry (270°, round caps, grey track, soft core), so the user already knows how to read them. |
| Flexibility | OK | 44 px targets, Dynamic text via rem, reduced motion, 375 and 320 px layouts specified below. No dark mode in the app (`color-scheme: light only`), so none is added; use existing tokens only. |
| Simplicity | weak -> OK | Removes 3 rows and 3 switches from the tab; adds 1 compact panel; My money row is renamed, not doubled. |
| Craft | OK | One number source each: `moneyIn()` for the panel, `catSpend()` for spending; checks prove screens agree. |
| Delight | OK | Ring filling toward "what your goals need" is quiet motivation; no confetti, no new animation. |

### Trade-offs to decide
- Panel shows rule money only vs rule money plus planned extra deposits (`g.pace`). -> Rules only: it is what moves without a tap.
- Plan lives on Spending analysis vs on Home Details (Levente). -> Spending analysis only; Home Details links nowhere new. One home for the plan, Home stays light.
- Keep the health score row on the plan (Levente) vs only in Your habits. -> Only in Your habits; the plan page would repeat it.

### What's working
- Goal page Money in block (`PAGES.goal`, three `li sw` rows with `data-gpay`, `data-grr`, `data-gwk`) already holds every per goal switch with "now goes to X" hints.
- Home gauge is clean and already understood; Levente's plan reuses `splitView()` so numbers agree.

## 2. Remove "Money in" from the Persely tab

Delete in `vHub()` the block from `${hintHTML('auto')}<div class="sec" data-tour="auto"><span>Money in</span></div>` through the closing `</div>` of its `card lst` (3 `li(...)` rows), and the now unused `li`, `rg`, `rgr` consts if nothing else uses them.

Where every setting still lives:
| Setting | Still reachable from |
|---|---|
| Payday rule on/off, target goal | each goal page `PAGES.goal` row "Payday rule" switch `data-gpay` (moves the rule to that goal) |
| Payday %, asks first, keep 20 000 Ft | `SHEETS.payrule`, opened from each goal page row and from the new Money in sheet row |
| Weekly transfer (rule goal and own `g.weekly`) | goal page row `data-gwk`, sheet `weeklyrule` |
| Round-ups on/off, target goal | goal page row `data-grr`, sheet `roundrule` |
| Setting rules while creating a goal | `PAGES.create` step 2 (unchanged) |
| Onboarding | `data-onbstart` setup card (unchanged) |

Shared and euro goals have no rules today (no change). With no goals: rules are already off (`removeGoal`), the panel hides, "No goals yet" card shows.

Copy that points at the removed block (change):
- `HINTS` `'auto'` -> `['auto','Money in each month','What moves in by itself. Change it on each goal.']` and move `hintHTML('auto')` + `data-tour="auto"` onto the new panel.
- Line ~1905 (split card fine print) "Turn it on in Money in." -> "Turn it on in a goal's Money in."
- Line ~2580 (`kiadas`/payday fine) "Change it in Persely → Money in." -> "Change it on your goal's page."

## 3. Money in panel under the balance (the pocket summary)

Position: in `vHub()` right after the hero card closes, before the setup card and Goals. Show only when `S.goals.length`.

Data (new helper next to `paceOf`):
```
moneyIn() -> {pay, wk, rnd, total, need, ask}
  pay  = S.payday.on ? incomeShare(S.payday.pct) : 0
  wk   = (S.weekly.on ? round(S.weekly.amt*52/12) : 0) + Σ round(g.weekly*52/12)
  rnd  = S.roundup.on ? ROUND_EST : 0
  need = Σ over forint, not shared goals with a date and toGo(g) > 0: ceil(toGo(g) / max(1, round(daysTo(g)/30.4)))
  ask  = S.payday.on && S.payday.ask
```
`total` must equal Σ `paceOf(g) - (g.pace||0)` over goals (check below).

Markup (copy of Home gauge, scaled; reuse `.gauge` SVG values exactly: viewBox 0 0 250 250, r 104, `rotate(135deg)`, track `#E3E6EC`, fill `#52AE30`, round caps; stroke 24 so it reads at small size):
```
<button class="card mgauge" data-sheet="moneyin" data-tour="auto">
  <span class="mg-ring"><svg aria-hidden="true" ...track + fill arc...></svg></span>
  <span class="t"><small>Money in each month</small><b class="num">19 170 Ft</b><small>Your goals need about 23 400 Ft</small></span>
  <span class="chev">${I('chev',20)}</span></button>
```
CSS (new, next to `.gauge`): `.mgauge{display:flex;align-items:center;gap:14px;width:100%;min-height:76px;padding:12px 16px;text-align:left}` `.mg-ring{flex:none;width:56px;height:56px;border-radius:50%;background:linear-gradient(145deg,#F6F7FA,#E7EAF0)}` (the Home soft core, as the ring's fill) `.mgauge .t b{font-size:1.25rem;color:var(--green-t);font-weight:700}` `.mgauge small{font-size:0.84375rem;color:var(--ink2)}` (same sizes as `.gauge .core small` and `.avg`).

Fill: `p = need ? min(1, total/need) : (total ? 1 : 0)`, arc length `arc*p` as Home.

States (screen text = VoiceOver text, the ring is decorative):
| State | Line 1 | Line 2 | Line 3 | Ring |
|---|---|---|---|---|
| Rules on, below need | Money in each month | 19 170 Ft | Your goals need about 23 400 Ft | partial |
| Rules on, at or above need | Money in each month | 25 000 Ft | Enough for every goal date | full |
| Rules on, no dated goal | Money in each month | 10 500 Ft | Payday rule and round-ups (names of the rules that are on) | full |
| Payday asks first | as above, line 3 gets " · payday asks first" appended | | | |
| All rules off | Money in each month | Nothing yet | Switch on a rule on a goal's page | track only |
| No goals | panel hidden | | | |

Tap target: the whole card (76 px high, full width). Opens new `SHEETS.moneyin`:
- `<h2>Money in each month</h2>`, then `card lst` with one `button.li` per forint, not shared goal: title goal name, sub "Payday rule 7 500 Ft · Round-ups 3 000 Ft" or "No rules yet", right `num` total, chev; `data-goal="id"` closes the sheet and opens the goal page.
- One row "Payday rule settings", sub "10% of each salary · asks first" (or "Off"), `data-sheet="payrule"`.
- Fine: "Each goal has its own rules. Open a goal to change them."
- `btn ghost` Close. No switches in this sheet (one place to switch).

## 4. Spending analysis row and page

Decision: **replace** the My money row, do not add a second row. The user's "spending analysis" contains what My money shows (Safe to spend, split, bills, Next month) plus Levente's plan; two rows would be two doors to overlapping numbers and would break the "one entry path" rule. Keep the route key `mymoney` so Home's Safe to spend button and the checks still point to one page; change titles only.

Row (`myMoneyRow()`, rename to `analysisRow()`, keep in the old spot after Goals):
| Analyst | Title | Subtitle |
|---|---|---|
| off | Spending analysis | Optional: see where your money goes · `data-sheet="analyst"` |
| on, split not chosen | Spending analysis | Safe to spend 31 450 Ft |
| on, split accepted | Spending analysis | 41 200 Ft spent of 52 000 Ft planned |
| Bills first on | Spending analysis | Fun on hold · Safe to spend 31 450 Ft |

Page `PAGES.mymoney` title -> "Spending analysis". New `myMoneyHTML()` order (375 px, one column):
1. `.sec` "Spent in November" with `1 November – 30 November` (from `shownMonth().label`) under it, same style as Home.
2. **Circle**, Home `.gauge` markup copied, but the fill is two arcs: Everyday essentials spent (`BKT_COL.ess`) then Fun spent (`BKT_COL.fun`), over planned ess + fun (track `#E3E6EC`). Core: `<small>Spent so far</small><b>41 200 Ft</b>`. Below, `.avg`: "Planned for everyday and fun: 52 000 Ft · 16 days left". SVG `aria-hidden`.
   - Over plan: arcs capped full; `.avg` reads "3 400 Ft over the plan · 16 days left" in `var(--orange-t)` (text, not colour alone).
   - Split not accepted: single green arc vs `avgSpend()` exactly like Home; `.avg` "Average monthly spending: X".
3. `.sec` "What did I spend on this month?" + `catBars(sp)` (Levente, top 5, uses `.cats`).
4. If accepted: `.sec` "My plan for November" + `a data-plangear` "Edit"; card with `planModel()` groups (`.mp-g`, `.mp-r`, `.mp-bar`), no `planDonut` (the circle above replaces it), no `.mp-score` (score lives in Your habits). Keep the fine "A plan, not a limit. Nothing is blocked and no money moves between categories."
   If not accepted: Levente's "Plan your month" card (`data-sheet="analyst"`).
5. `.sec` "Persi's tips for November" + `planTips(m)` (max 3), only if accepted.
6. Existing My money content unchanged: Safe to spend button, `splitCard()`, `billsBlock()` (Next month and Must-pay bills stay one level down, as now).
7. `recentCards()` "Latest card payments" with "All" -> Transactions tab.

States:
- Analyst off: `needAnalyst('Spending analysis')` (as now).
- Empty month (no card payments yet): ring track only, core "0 Ft", `catBars` shows "No card payments yet this month.", tips "Everything is within your plan so far." hidden (nothing to say), plan bars at 0.
- Little history (`closedYm` < 3): category shares come from `HIST_YM`; show under the plan card the existing `curView().label` ("Based on 1 month" style) when `v.rough || v.n < 3`. If `catShares` is empty, plan groups show without category rows.

Home tab (`vFooldal`, `PAGES.kiadas`): adopt Levente's real data (`catSpend`, `avgSpend`, `catBars`, `recentCards`, `shownMonth`) so the Home circle and the analysis circle show the same "Spent so far". Delete `CATS`. Home Details page shows the spending pill, `catBars`, `recentCards` and the existing "How does this fit your income?" card; **no `planHTML()` there**. Gear on Details: `data-plangear` (Levente) is fine, it opens the split editor or the analyst sheet.

Split editor: port Levente's "Of Saving, for investing" stepper as is (starts at 0 Ft, fine "A plan only: nothing is bought for you."); investing appears as a plan row under Saving.

## 5. Mobile, accessibility, motion

- 375 px: panel ring 56 px + text column `min-width:0`, amount on one line (`white-space:nowrap`); analysis gauge uses existing `clamp(200px,64vw,250px)` (240 px). `.mp-r` amounts `nowrap`, names wrap. At 320 to 359 px `.cats` already drops to 4 columns.
- Targets: panel 76 px; sheet rows `li` ≥ 44 px; "Edit" link uses `lnk44`; Levente's `±` chips ≥ `var(--tap)`.
- VoiceOver: rings and bar tracks `aria-hidden="true"`; buttons have no `aria-label`, so they read their visible text. Remove `role="img" aria-label` from `planDonut` (not used). Category bars: keep visible names + amounts.
- Text size: rem only, no fixed heights on text rows.
- Reduced motion: no new animation. If the builder adds an arc transition, add it to the existing `@media (prefers-reduced-motion:reduce)` block with `transition:none`. Fast forward number rolls unchanged.
- Dark mode: the app is light only (`<meta name="color-scheme" content="light only">`, no `prefers-color-scheme`). Out of scope; use existing tokens and the Home gauge colours only.

## 6. Build checklist (Sonnet builder, in order)

1. `git switch Tamas-branch && git switch -c feature/persely-money-in-analysis`; add a row to `BRANCHES.md` (in progress).
2. Port from Levente's file (copy the code verbatim from `/Users/tamaspinter/Desktop/otp-persely-demo-with-plan.html`, grep the names): `SPEND_CATS`, `SPEND_IC`, `SPEND_SHORT`, `HIST_YM`, `catSpend`, `sumVals`, `catShares`, `spreadCats`, `shownMonth`, `avgSpend`, `catBars` (after `CATEGORY` helpers); `tint`, `planModel`, `planTips`, `planHTML`, `recentCards` (after `SHEETS`); CSS `.mp-*` block; `monthStep` `parts.cats`; split editor investing block + `data-splitinv` handler + `S._split.inv` / `S.analyst.invest` in `splitopen`, `splitsuggest`, split save; `data-plangear` handlers. Skip the `__STANDALONE` push guards unless `tools/build-standalone.mjs` needs them.
3. `vFooldal()` and `PAGES.kiadas`: switch to Levente's versions, then remove `planHTML()` from `kiadas` (keep `catBars` + `recentCards` + income card). Delete `CATS`.
4. `planHTML()`: drop `planDonut` and the `.mp-score` card; add the analysis gauge (section 4 step 2) as a new `analysisGauge(m)`; add little history label.
5. `myMoneyHTML()`: new order from section 4; `PAGES.mymoney.title = 'Spending analysis'`; `needAnalyst('Spending analysis')`.
6. `myMoneyRow()` -> `analysisRow()` with the subtitle table; update its call in `vHub()`.
7. `vHub()`: delete the Money in block (section 2); insert `moneyInPanel()` after the hero; add `moneyIn()` helper and `SHEETS.moneyin`; add `.mgauge`, `.mg-ring` CSS.
8. Copy changes from section 2 (HINTS, ~1905, ~2580). Grep the whole file for `Money in` and `My money` and fix any tab pointing text; goal page "Money in" header stays.
9. `__checkAnalytics`: update and add checks (below); run `window.__checkAnalytics()` at http://127.0.0.1:8090 (`npm run start`), all pass.
10. `sw.js` `NAME` `otp-demo-v38` -> `otp-demo-v39`. Rebuild standalone with `node tools/build-standalone.mjs`.
11. Docs: `prototype-guide.html` lines ~121 (tab order: Savings card → Money in panel → Goals → Spending analysis → Your habits), ~129 (Money in row becomes the panel + sheet, switches only on goal pages), ~130 (My money row becomes Spending analysis, one row), ~151/169/187 (Home Details shows real spending; plan lives on Spending analysis; Levente's plan and investing line), self-check count; `demo-script.html` ~98 to 110 (My money beat now "Spending analysis": circle, categories, plan, tips, then Safe to spend). Plain copy, no hyphens in subtitles, never "deadline".
12. Check at 375 and 320 px, VoiceOver rotor reads the panel as its three lines, reduced motion on.

Acceptance criteria:
- Persely tab has no `data-sw="payday|weekly|round"` and no "Money in" section header; it has exactly one `.mgauge` (when goals exist) and one `data-go="mymoney"` row titled "Spending analysis".
- Every rule switch is on each forint goal page; the Money in sheet lists every such goal and links `payrule`.
- Home "Spent so far" = analysis "Spent so far" = `sumVals(catSpend(shownMonth().ym))`.
- Plan groups equal `splitView().by` amounts; category rows inside a group add up exactly to the group.

Self-checks to **update**:
- "one entry path: the Persely tab has one My money row ..." -> rename to "one entry path: the Persely tab has one Spending analysis row and no split, bills or Next month block"; logic same, also assert `cnt(P,'kiadas') === 0`.
- "analyst sheet (on): one button to My money ..." -> text only if the button label changes (keep "My money" label? see question 2).
- "analyst off: the Persely tab row offers the analyst sheet ..." -> unchanged logic, row text "Spending analysis".
- "delete every goal ... tab, Home ... render" -> also renders `SHEETS.moneyin()` and the analysis page without errors.
- "Saving = payday rule + weekly transfer + round-ups, shown the same on every screen" -> add the panel: `moneyIn().total === savePlan().total` when no goal has own `g.weekly`.

Self-checks to **add**:
1. Tab has no rule switches and no Money in header; goal page of each forint goal has `data-gpay`, `data-grr`, `data-gwk`.
2. Money in sheet has a `data-goal` for every forint, not shared goal and one `data-sheet="payrule"`; no `data-sw`.
3. `moneyIn().total === Σ(paceOf(g) - (g.pace||0))`; panel shows that amount.
4. Panel states: all rules off shows "Nothing yet"; no goals hides the panel; ring SVG has `aria-hidden`.
5. Home and analysis "Spent so far" match `sumVals(catSpend(...))`, also after +1 month (`monthStep`).
6. `spreadCats(a, b)` sums to `a` for ess and fun; plan groups equal `splitView().by`.
7. Home Details page has no `mp-g` (plan lives in one place).
8. Investing: default 0, never more than Saving, no transaction created by it.

## 7. Open questions (default in bold)

1. "Savings pocket itself": the Persely total card, or the separate Savings account (3.5%) on Home? **Default: the Persely total card on the Persely tab.**
2. Keep the label "My money" anywhere (Home Safe to spend, analyst sheet button)? **Default: rename every visible "My money" to "Spending analysis"; keep route key `mymoney`.**
3. Panel comparison line: "what your goals need" vs no comparison. **Default: show the need line; hide it when no goal has a date.**
4. Port Levente's investing stepper now? **Default: yes, plan only, starts at 0 Ft.**
5. Show Levente's plan on Home Details too? **Default: no; Details shows spending, the plan lives on Spending analysis.**
