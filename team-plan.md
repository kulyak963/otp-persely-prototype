# OTP student savings – cohesive plan

Nov 18, 2026 · @Tamas · Pitch: Friday 20 November

One service, one app, one story. This plan merges the Savings handoff, the business concept, the Rewards & Financial Analyst brief, the opening script and the HW1 research into a single plan. Rates, rewards and money figures are our proposals, not OTP facts.

## 0. Where the team prototype stands (checked 18 Nov)

Repo kulyak963/otp-persely-prototype, last commit by Denis on 16 Nov, live at otp-persely-prototype.onrender.com. Levente's Savings section is **already merged**, with these changes:

- The tab is called **Persely**: Home | Transfer | Persely | Transactions | More. My cards is in More.
- **No student verification:** 3.0% comes automatically with the Junior package (first 500,000 Ft, 28% tax).
- **Persi**, a 3D green piggy (three.js), in the tab, the update pop-up, onboarding, stories, graduation and push notifications. The mascot question is settled.
- Onboarding: update pop-up "What are you saving for?" with 6 goal tiles (PS5 + GTA 6 first), 3-step goal setup with an honest forecast, first deposit, tour.
- Weekly streak with a flame and skip weeks; Friends ranking by streak or goal progress, never by money.
- Monthly and semester stories, Persi's tip card on Home, graduation bridge, real iPhone pushes, laptop demo panel with keys.
- Anna: Junior 87,450 Ft, Savings account 120,000 Ft; goals Summer holiday 64,000 of 134,000 Ft, PS5 + GTA 6 46,000 of 230,000 Ft (late), Festival ticket 30,000 of 45,000 Ft.
- Its own guide (prototype-guide.html) and an 11-step, 6-minute demo script (demo-script.html).

**Missing against the pitch:** the financial analyst, the monthly split, the health score and rewards. None of it is in the code.

**What this changes:** merge step A is done. The remaining build is only the analyst, split, score and rewards, written straight into the team app (index.html: vHub(), monthStep(), storySlides(), fresh()). The safety net is now the live app plus localhost:8090; Levente's reference build is a last resort.

## 1. Unified problem statement (for HW1, still blank)

Working students aged 18–30 want to save for concrete goals, but they earn small, irregular incomes (median about 75,000 Ft a month), fear that limited financial knowledge will lead them to a wrong choice, and get almost nothing back from the saving tool they already have at OTP (Persely, 0.01%). So saving is put off or moves to Revolut, and when Junior ends at 24 and the first salary arrives, nothing ties them to OTP.

**How might we make saving for a first real goal simple, guided and rewarding inside OTP, so students build the habit here and bring their first salary with them?**

## 2. The service in one line

A student savings tab in the OTP app that **pays** (3.0% on Persely), **guides** (an opt-in financial analyst and a monthly split) and **rewards better habits**, then **keeps them at graduation** (the rate continues 12 months if the first salary comes to OTP).

| Part | What the student gets | Built on | Status in team app |
| --- | --- | --- | --- |
| Earn | Persely at 3.0% on the first 500,000 Ft for Junior customers (about 2.2% after tax), payday rule, round-ups, weekly transfers | Persely | Built |
| Save together / travel | Shared Persely (2–5 people), Euro Persely | Persely, referral programme | Built |
| Habit | Weekly streak, monthly and semester stories, Persi | – | Built |
| Guide | Financial analyst (opt-in): monthly split Essentials / Fun / Saving, one insight a month with one action | App spending tracker | Only Persi's tip card on Home |
| Reward | Financial health score (0–100) and rewards for improvement, not for balance | Partner cashback network | Not built |
| Stay | Graduation bridge: 3.0% for 12 more months if the first salary is paid into OTP | OTP GO | Built |

The link that makes it one service: **the Saving bucket of the split is the payday rule.** 10% of a 75,000 Ft salary is 7,500 Ft, which is both the Saving share in a 60/30/10 split and the amount the payday sheet offers. One setting, shown in two places.

## 3. Why each feature exists (research → feature)

| Insight | Source | Feature |
| --- | --- | --- |
| 84% say income is not enough to save; median 75k | OTP youth research | Small automatic amounts: payday 10%, round-ups, proportions not amounts |
| 57% fear a wrong decision; people learn money from friends and family (35%) more than banks (27%) | OTP research | Analyst insight with one action; Shared Persely |
| Persely pays 0.01%; Revolut pays 2.5% gross / 1.8% net | OTP rate notice, Bank360 | 3.0% student rate (about 2.2% net, above Revolut) |
| 65% prefer a low guaranteed rate | OTP research | Guaranteed rate, no investing in v1 |
| Fee cliff at 24; salaries can now go straight to Revolut | Denis, Levente | Graduation bridge tied to the first salary |
| Neobank entry points are foreign shops (68%) and travel (60%) | Mastercard survey | Euro Persely |
| OTP already has a one-time referral bonus | Kriszti | Shared Persely instead of a bigger bonus |
| Forced "young" tone puts them off | OTP communication research | Plain copy; mascot only at big moments, dry, no slang |
| Peer comparison adds stress | Analyst brief | No leaderboard; streaks are personal and never change the rate |

## 4. Where the documents disagree, and the fix

| # | Conflict | Proposed decision |
| --- | --- | --- |
| 1 | The app has a **Friends ranking** (by streak or goal %); the analyst brief drops peer comparison because it adds stress | Keep it only as opt-in, or drop it. Team decision |
| 2 | Opening script says Persely money "doesn't earn interest"; it earns 0.01% | Say "earns almost nothing, 0.01% a year" |
| 3 | Rewards include a **fee waiver**, but Junior accounts are already free until 24 | Fee waiver only for OTP GO customers (24–28). For students: boosted partner cashback and goal-linked partner offers |
| 4 | The app gives 3.0% to **every Junior customer**, not only students aged 18–30; a student aged 24–30 who is past Junior gets 0.01% until graduation | Either keep a student condition after 24, or say in the business case that the cost base is all Junior customers, wider than the model's 10,000 users |
| 5 | Analyst brief adds 1% card cashback; Kriszti adds capped cash cashback and a lower OTP GO limit (70k) | Out of v1 demo; one "next steps" line in the pitch |
| 6 | Opening script promises an analyst; the app has only Persi's tip card | Build B1–B4 (section 6) or cut the claim from the script |
| 7 | Script never names OTP's own problem (churn at 24, Revolut close: 61% vs OTP 64%) | Add one sentence before the handover; the app's guide already says it |
| 8 | Handoff quotes MNB base rate 5.50% with a decision on 17 November, which has passed | Check the new figure before quoting it |
| 9 | Anna's Fun spending (food and drink + shopping, 52,500 Ft) is about 70% of her salary, so any split looks like failure | Suggested split from her history: Essentials 50% (37,500), Fun 40% (30,000), Saving 10% (7,500). Tune the +1 month card payments in monthStep() so Fun lands at about 27,000 Ft |
| 10 | Two demo runs: Levente's handoff (8 scenes) and Denis's demo-script (11 steps) | Use Denis's script; add the analyst beats (section 7) |
| 11 | The app calls the tab and service "Persely"; the handoff calls it "Savings" | "Persely" ties to the existing product. Confirm |

## 5. Savings tab, final structure

The Persely tab as built, top to bottom, with the new parts marked:

1. **Persi + story ring** (built).
2. **Savings card:** total, Junior 3.0% badge, yearly interest after tax, Add money / Withdraw (built).
3. **Streak** (built) with the **health score and its change since last month** beside it (new).
4. **Goals** (built).
5. **My split** (new, shown when the analyst is on): three buckets with live use, e.g. "Fun: 70% used, 12 days left", and an edit sheet with the suggested starting point.
6. **Money in** (built): the payday rule doubles as the Saving bucket.
7. **Junior ends soon** (built).
8. **Friends** (built; see conflict 1).
9. **How Persely works** (built).

Home keeps Persi's tip card, which becomes the analyst's one monthly headline with one action. The analyst switch goes in More, next to Notifications.

**Health score (proposal):** four indicators, 25 points each, measured over a rolling 3 months: spends less than earns; no overdraft or failed payment; keeps a buffer of about one month of spending; saves regularly toward a named goal. Rewards trigger on improvement or staying within the split, never on balance size.

## 6. Build plan to Friday

| Step | Work | Owner | When |
| --- | --- | --- | --- |
| A | Merge the Savings section into the team app | Denis | Done 16 Nov |
| B1 | My split card and edit sheet in vHub(); Saving bucket linked to the payday rule | TBD | Wed–Thu |
| B2 | Analyst switch in More (opt-in, shows what it measures, can be turned off); Persi's Home tip follows the analyst copy rules; recategorise a transaction | TBD | Thu |
| B3 | Health score beside the streak; "reward earned" sheet after +1 month (O); goal-reached reward (boosted cashback, travel partner offer) | TBD | Thu |
| B4 | Score-change slide in storySlides(); demo data tuned in fresh() and monthStep() (conflict 9) | TBD | Thu |
| B5 | Bump the cache name in sw.js, push to main (Render redeploys), test on the iPhone | TBD | Thu evening |
| C | Freeze Friday morning. Fallback: localhost:8090, then the reference build | All | Fri a.m. |
| D | Fix the opening script (conflicts 2, 6, 7), one business-case slide, rehearse twice with timing | TBD | Thu–Fri |

The whole app is one file (index.html, about 190 KB), so only one person edits it at a time, on a branch, merged by Denis. Every push to main redeploys the live link.

## 7. Pitch run (about 9 minutes; check the slot length)

1. **Opening, 2 min:** the script, fixed per section 4.
2. **Demo, about 6 min:** Kiss Anna, 87,450 Ft, Summer holiday 64,000 of 134,000 Ft.

Run Denis's demo script (demo-script.html: update pop-up, 3.0% with Junior, goal and forecast, first deposit, payday, round-up, shared Persely, a month later, streak push, end of semester, Junior ends). Add two analyst beats:

| Where | New beat | Time |
| --- | --- | --- |
| After step 4, first deposit | Turn on the analyst; it suggests a split from her last 3 months, 50 / 40 / 10, and the Saving share is the payday rule she already has. She accepts | about 30 s |
| Step 8, a month later (O) | After Persi's food tip: "You stayed within your split." Score goes up, reward earned | about 20 s |

To stay near 6 minutes, shorten step 9 (streak push) or step 6 (round-up), never step 8 or 11: they carry the analyst and the retention story.

3. **Business case, 1 min:** 10,000 users × 100,000 Ft = 1 billion Ft deposits; about 30 million Ft interest, about 20 million Ft funding value, net about 10 million Ft; about 500 extra retained customers (5% of users) break even before build costs.
4. **Close:** "Students choose it, it builds on Persely, and it keeps them with OTP."

## 8. Decisions needed from the team (today)

1. Confirm "Persely" as the service and tab name.
2. Friends ranking: keep as opt-in, or drop.
3. 3.0% for all Junior customers, or a student condition (conflict 4).
4. Build B1–B4, or cut the analyst claim from the script.
5. Owners for B1–B5 and D, and who edits index.html when.
6. Who presents which part.

## 9. Check before presenting

- Persely's current rate with OTP colleagues.
- The MNB base rate after the 17 November decision.
- What OTP's app already offers in spending analytics, so we say what is new.
- GDPR: explicit consent and profiling for the analyst and habit-based rewards.
- Consumer-protection and tax rules for rewards in Hungary.
- Quote OTP research figures as OTP's own data (youth research on full-time students, 2025).
