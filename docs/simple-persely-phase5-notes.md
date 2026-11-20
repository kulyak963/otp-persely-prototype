# Simple Persely, Phase 5: demo script, guide, hallway test (notes)

Plan: `docs/simple-persely-plan.md` 2g (pitch demo script), 3 (Phase 5 row, hallway test, acceptance). Branch: Tamas-branch. No app code changed, so `sw.js` stays at `otp-demo-v67`.

## What was done
- `demo-script.html`: the one year run was played in headless Chromium (390 × 844, `http://localhost:8113/?demo=1&view=simple`, 20 November 2026) and every figure, label and timing in the script is what the app showed. Scenes 0 to 13 kept, close at 7:30.
- `prototype-guide.html`: User journey, Persely tab, Persi and notifications, Home, Settings, Demo controls, Flags and addresses (new), file layout and check counts brought up to date.
- `docs/simple-persely-hallway-test.md`: the 5 person kit and the acceptance table measured now.

## Findings from the run (things the presenter must know)
- **Own home is under More goals** (D10): Home card → More goals → Own home → confirm screen, 3 taps. Something else would need a typed name and a target and date change.
- **Use Change → 2 000 Ft** in act 3 so every later figure matches the earlier script and the MP4 summaries (9 517, 17 017, 32 119, 85 405, 100 753 Ft). The 1 000 Ft default figures are listed in the script.
- **Press Z before P.** The "Reward earned" push after O uses up the day's one Persely push, so without Z the salary push is held (toast "Held by the 1 a day limit") and no banner shows; the payday sheet still opens.
- **Nudge question:** on the second visit (the payday beat) Persi asks "Want a nudge on Sunday?" and this replaces Persi's payday line on the tab. Tap Not now.
- **B leaves Home unchanged**: the late bill card is on Spending; tap the push banner (or Home > Details).
- **M plays the month story, not the year story.** The year story starts from Your year in Persely.

## Measured
| Act | App time |
|---|---|
| U to Home | 2.5 s (Face ID 1.6 s, splash 0.9 s) |
| Tap 3 to reward | 126 to 176 ms |
| O | 4.8 s fast forward |
| Q | 7.6 s |
| Y to the month 10 stop | 10.6 s |
| The rest of the year after Confirm | 7.8 s |
| Year story | 11 screens, 42.2 s |
| Month story (existing user) / semester / new user first month | 41.5 s / 37.0 s / 28.7 s (8 screens) |

Self-checks: 277 of 277 (`?demo=1`, also `&view=simple` and `&view=classic`), 242 of 242 (`?otphome=0`), 212 of 212 (`?simple=0`), no console errors.

## MP4 backups: stale, not re-recorded
`tools/record-story.mjs` no longer runs: it opens `SHEETS.analyst()` and waits for `[data-anon]` (the old opt in consent), which never appears now that the analyst is on by default (timeout after 30 s). There is no tool for the fast forward videos. Nothing was deleted or overwritten.

| File | Recorded | Why it is stale |
|---|---|---|
| `media/ff-1-month.mp4` | 19 November 2026 (38afb54) | Old Home: Safe to spend card, Quick actions, analyst card; numbers on the summary still match the 2 000 Ft path |
| `media/ff-2-months.mp4` | same | Old Home and the old long Persely tab (goal cards, interest line) |
| `media/ff-year-1-to-junior-ends.mp4` | same | Old Persely tab; the stop line said "keep my 3.0%" |
| `media/ff-year-2-to-month-12.mp4` | same | Old Persely tab and old Home |
| `media/story-november.mp4` | 19 November 2026 (a981e9c) | The team's earlier story, before Denis's Wrapped story (b63f72b); also the recorder above is broken |

To refresh: fix the set-up in `tools/record-story.mjs` (drop the consent clicks, the analyst is on) and write a small recorder for the fast forwards, then record with `?view=simple`.

## Open
- D11 (first month story at most 5 slides and 20 s) is not built: a new user's first month story is 8 screens, 28.7 s.
- New user Home has two Persely entries: the card and OTP's original For you offer (hides after the first goal).
- Quiet hours are still off by default (plan 2d says on). Real push triggers for milestones, Junior 90 / 30 / 7 days and the Sunday reminder are demo keys only.
- Hallway test thresholds need sign off before round 1; T4 "2 taps" needs a counting rule (a chip makes it 3).
- Not checked on a real iPhone.
