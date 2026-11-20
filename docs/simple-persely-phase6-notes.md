# Simple Persely, Phase 6: Home back to the OTP skeleton (notes)

Plan: `docs/simple-persely-plan.md` 2c ("One rule for Home") and 2h (all of it). Decisions: `docs/simple-persely-decisions.md` D7, D9, D15.

Flag: `OTP_HOME` in `js/01-tokens-helpers.js`.
- `OTP_HOME = SIMPLE_PERSELY && ?otphome !== '0'`.
- `?otphome=0` keeps the Home from before Phase 6. `?simple=0` turns everything old.
- In code, `ohOn()` (`js/05-home-transactions.js`) is the switch. It is `OTP_HOME && !OH_LEGACY`. `OH_LEGACY` is for the self-checks only.

## Home (`vHomeOtp()`, `js/05-home-transactions.js`)

`vFooldal()` returns `vHomeOtp()` with the flag on and `vHomeOld()` (the Home before Phase 6, unchanged) with it off. The order is the `eb807a7` order:

1. **Header.** Avatar and name (one button, opens Settings), mail icon (opens For you). There are no captions and no bell. The demo long-press on the avatar is unchanged: it still needs `?demo=1`.
2. **Balance + All accounts.** The carousel shows Junior account, Persely · total and Savings account. The "Account details" and "Open Persely" lines are gone, and so is "Why Persely?".
3. **One Persely card** (`ohTeaser()`), in the original teaser slot. It has Persi, one line and a chevron, and one action. It is about 260 px from the top. States, in Persi's order:
   - No goal: the Phase 1 card "Save your first 1 000 Ft" (`spHomeCard()`, reused). It opens the first run.
   - Payday: "Payday · Save 7 500 Ft?". It opens the payday sheet.
     - `S.pdAsk` is set when the salary arrives and the payday rule asks first.
     - It is cleared by saving (`data-paymove`), by the next week and by +1 month.
     - It only shows when no bill has to be paid first. With bills open, the Bills first sheet and the late card on Spending lead.
   - Week open: "Week 4 · Save by Sunday" (with the flame). It opens the Persely tab.
   - Week saved: "Week 3 done · 140 000 Ft saved". The plan only names the first three states, so this one is my addition.
   - Junior ending (last 30 days, not Graduate): the subline "Your 3.0% ends on 4 December 2026".
4. **My monthly spending + Details.** Details opens the one Spending page. Under it:
   - the full date range "1 November 2026 – 30 November 2026";
   - the original 270° gauge (one green arc, fed by the real `catSpend` total), labelled "Card spending so far" (D15);
   - the line "You usually spend 72 200 Ft a month by card", which is the 3-month average.
5. **What did I spend on this month?** The five biggest categories as bars (`catBars()`, real data). Each bar opens Transactions with that category.
6. **For you + All.** There is no caption. The offer "Start saving efficiently!" already hides once there is a goal (`nekedCards`), so it never becomes a second Persely entry.

The existing user's Home now scrolls 1 234 px. Before this phase it was 1 762 px, and the original was 1 365 px.

## Where each removed item went (all gated by `ohOn()`)

| Item | New place |
|---|---|
| Late-bill card (Bills first, Pay now / All bills) | Top of the Spending page, above Safe to spend (`myMoneyHTML()`, `js/07`) |
| Analyst first-run notice | Top of the Spending page as the one line (`spAnLine()`). The same line is used for the new and the existing seed. It goes after Learn more or Turn off, or when the page is left (`popPage` sets `S.anNote`). |
| Safe to spend card | Spending hero (unchanged), reached from Home through Details |
| Bills (Pay a bill) | Spending Bills row and All bills on the late card |
| Notifications inbox (bell) | Settings: a new "Notifications" row on top ("Your messages · 3 unread"). The avatar opens Settings, so the inbox is 2 taps from Home. The More page gets its own row when Phase 2 is merged. |
| Add money to a goal | Persely tab big button (unchanged) |
| Manage my card | More > My cards (unchanged) |
| Persi's tip card | Spending "Persi's tips" (unchanged) |
| Category ring, legend, See spending details, Total out | Spending page (unchanged) |
| Story card "Your November is ready" | Persely tab ring (unchanged, not touched) |
| Junior row, pending state | Persely tab. Home only shows the Junior end date in the last 30 days, as the card subline. |
| Why Persely? | Persely tab > Rate and safety (unchanged) |

## Self-checks (`js/03-selfchecks.js`)
- With `OTP_HOME` on, every check written before Phase 6 runs **unchanged** on the pre-Phase-6 Home. That Home is rendered in the same page by setting `OH_LEGACY = true` at the start of `__checkAnalytics()`, and the flag is put back at the end. No old check was deleted or weakened.
- A new block, "Phase 6: OTP Home", runs with `OH_LEGACY` off. It holds:
  - `chk-home-otp-skeleton`: the eb807a7 order, nothing else on Home, exactly one Persely entry, and every moved item at most 2 taps from a tab;
  - a new-world equivalent for each of the 29 Home checks in plan 2h item 4. They are named "… (OTP Home)";
  - `chk-home-otp-copy` (FK grade 4 or less, no hyphens in subtitles, no "deadline");
  - `chk-home-otp-flag`.
- Results at 390 x 844, fresh context, service workers blocked:
  - `?demo=1`: 264 / 264
  - `?demo=1&otphome=0`: 229 / 229
  - `?demo=1&simple=0`: 212 / 212
  - no console errors on any of them.

## Open points
- **Merge with Phase 2.** Some new-world checks click into the Persely tab and More. They use these selectors: `#v-hub [data-sheet="hubsave"]`, `[data-go="grad"]`, `[data-sheet="ratesafe"|"goodtoknow"|"whyp"]`, `[data-story]`, `[data-go="mymoney"]`, and `#v-tovabbiak [data-go="kartyaim"]`, `[data-go="mymoney"]`. If the Phase 2 tab or More page drops one of these, update the selector in the "Phase 6: OTP Home" block. Add the More > Notifications row then too.
- **Demo script.** Beats 7 and 8 (the Safe to spend card and the late card on Home) now start from Home > Details. The demo script and the guide were not re-timed in this phase.
- **D9 and D13.** Legal still has to accept the analyst notice on Spending (D9). D13 ("late card on Home only") is reversed by this phase.
- **Docs.** `home-clarity-notes.md`, `spending-ui-rework.md` and `persely-home-ui-plan.md` still describe the old Home. They are not updated here.
