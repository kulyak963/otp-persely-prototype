# Simple Persely, Phase 3a: notifications

Plan: `docs/simple-persely-plan.md` section 1.3, 2d and 2f. Everything is behind `SIMPLE_PERSELY` (on by default, `?simple=0` is today's app).

## What changed
- **One Persely push a day.** All Persely push types count together per day of the app's date (`billToday()` plus the simulated week). `S.pushDay` holds the day key. Code: `notify()` in `js/13-settings-demo.js`.
- **Not counted:** card payment and incoming transfer (the bank's own pushes) and the late-bill push (keeps its own cap, `S.bfPush`).
- **Held, not lost.** A second push the same day is still written to the inbox. It is not shown as a banner and has no sound or real push.
- **Quiet hours** still win: the push goes to the inbox silently and does not use up the day.
- **Priority** (`choosePush`, `PUSH_PRI`): 1 payday, 2 Junior ends, 3 goal milestone, 4 Sunday reminder, 5 story, 6 anything else (interest, rewards), 7 marketing. Pushes are sent as they happen, so priority decides only when several are due at the same moment. A push already sent is never taken back.
- **Switches.** Every type has its own switch. New: Junior ends, Goal milestones, Offers and perks (marketing, off by default). The Sunday reminder stays an opt in.
- **Removed:** the "friend saved" push. Demo key 5 is now the goal milestone push. No day 0 push and no "we miss you" push exist.
- **Marketing out of the Persi channel.** Title "Perks", no Persi signature, kind `mkt`: "Pizzeria Roma: 15% off. You can turn it on in Perks."
- **Copy.** Payday: "Salary's in. Save 7 500 Ft?" (the real computed amount; with bills open: "Salary's in. 5 550 Ft of bills to pay first."). Junior ends: "keep your 3.0%". No urgency words anywhere.
- **Demo.** Keys 1-9 and P work. A push held by the cap shows the toast "Held by the 1 a day limit" (demo flag only). The panel has **Reset day** (key Z).

## Checks
`chk-simple-push-cap` and `chk-simple-no-urgency` (flag on only). `chk-notif-toggles`, `chk-push-reflects-balance` have a flag-on branch; `chk-inbox-20` and `chk-bills-due-toggle` pass unchanged.

## Not done here
- Real triggers for goal milestones (on deposit), Junior ends at 90, 30 and 7 days and the Sunday 18:00 reminder are still fired by the demo keys only.
- Quiet hours are not on by default (the plan says they should be); a demo run at night would be silent.
- `js/14-fastforward.js` line "keep my 3.0%" on the fast-forward screen is not a push and was left to the copy pass.
