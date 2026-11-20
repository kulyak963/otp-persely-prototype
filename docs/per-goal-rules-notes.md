# Saving rules per goal

Request: "change automatic saving rules to differ by goal, put the defaults in the settings."

Before (Phase 3, decision D9): three global rules (`S.payday`, `S.weekly`, `S.roundup`), each pointing at one goal, edited in one Saving rules sheet. Goal pages only showed status rows.

Now every plain forint goal owns its rules. Shared and euro goals have none.

## Data

```
g.rules = {
  pay: {on, pct},          // Payday rule: % of each salary or scholarship
  wk:  {on, amt, day},     // Weekly transfer: amount, day 'mon'..'sun'
  rr:  {on}                // Round-ups
}
S.payday       = {ask, floor}   // account wide: ask first, keep 20 000 Ft
S.ruleDefaults = {pct, wkAmt, wkDay, rr}   // Settings > Default saving rules for new goals
S.ruleGoal     // the remembered main goal (Persi, insights, the payday sheet title). It no longer routes money
```

Out of the box `ruleDefaults` = payday 10%, weekly off (0 Ft), Monday, round-ups off. That is the plan for the first goal: Payday rule only, at 10%.

## How the money is shared

| Rule | Several goals |
| --- | --- |
| Payday rule | Each goal takes its own % of each salary. The %s add up. All goals together may take at most **50%** of the salary (`PAY_CAP`). A change that would pass it is blocked with: "That makes 55% of your salary across your goals. The most is 50%, so lower this or another goal's payday rule first." |
| Weekly transfer | Each goal moves its own amount on its own day. The amounts add up. |
| Round-ups | The rounded coin of a card payment is split equally between the goals with round-ups on. The forint left over after rounding goes to the first goal. One goal gets it all. The forecast shares the monthly round-up estimate the same way. |

**Keep 20 000 Ft on my account** (on by default) applies to the total of one payday or one week: at most the Junior balance minus 20 000 Ft moves. When that is less than the total, each goal gets its share of what can move (in proportion to its % or amount), and nothing moves when nothing is free. This is the "if money is tight, less or nothing moves" line.

Code: `paydayAlloc()`, `weeklyAlloc()`, `roundupAlloc()`, `splitBy()` in `index.html`, next to `ruleGoal()`. Every money move uses them: the payday push (key P), the payday sheet and Bills first, a demo week, the month step (keys O, Q, Y), the coffee round-up (key C).

## Screens

- **Goal page**: "Saving rules for this goal" with three switches; Payday % chips, Weekly amount and day chips. Each change saves at once with the 10 s Undo chip. One line under them: "On time with these rules · needs about 1 700 Ft a week, your rules add about 1 700 Ft", from the one `weeklyNeed` definition.
- **Wizard step 2** "How should money get in?" sets the new goal's rules, pre-filled from the defaults. "[Rule] now goes to X instead of Y" is gone; instead it shows how the rules add up with the other goals ("All goals together: 30% of your salary (the most is 50%)", "Weekly transfers add up: 3 000 Ft a week across your goals", "Round-ups are shared equally with Summer holiday"). Over the cap it shows the message and Next waits.
- **Persely tab, Saving rules**: read only, one row per goal ("New laptop · 15% of salary · 2 000 Ft a week on Friday"); a row opens that goal's rules.
- **Saving rules sheet**: the same overview, plus Ask first / keep 20 000 Ft and a link to the defaults. Old links still work: Settings > Persely > Saving rules, Money in, Transfer > Scheduled and recurring transfers, the card page Round-ups row and My plan "Linked to your payday rule · Edit". A link that names one rule opens the goal that has it when only one goal does; otherwise the overview.
- **Settings > Persely > Default saving rules for new goals**: payday % (Off, 5 to 20%), weekly amount (Off, 1 000 to 5 000 Ft), weekly day, round-ups. "New goals start with these. Change them per goal on the goal page." Existing goals never change.
- **Delete a goal**: its own rules stop with it; the other goals keep theirs (before, they moved to the next goal).
- **My split**: Saving is the sum of every goal's rules. Saving the split with a new payday total changes the main goal's % (the other goals keep theirs), within the cap.

## Migration

`migrateRules(st)` runs at load (and on the seeds). Old saved state: the payday rule goes to the goal it pointed at (`S.ruleGoal`), the weekly transfer to `S.weekly.goal` (else the payday goal), round-ups to `S.roundup.goal`; an old per goal `g.weekly` and an old Recurring transfer (`S.persely.auto`) become that goal's weekly transfer. Then `S.weekly` and `S.roundup` are removed and `S.payday` keeps only ask and floor. Key J (8 weeks later) gives the main goal Payday 10% and Round-ups, the other goals' payday and round-ups off, so the demo money moves are the same as before (one year run: Summer holiday ends at 192 881 Ft as before).

## Self-checks

New: chk-rules-per-goal, chk-rules-defaults-in-settings, chk-rules-cap, chk-rules-overview, chk-rules-roundup-split. Older checks that assumed global rules now set the main goal's rule (`setMain`) and check the per goal shape. 207 of 207 pass at 390 x 844.
