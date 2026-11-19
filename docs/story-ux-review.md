# Story review: the monthly, semester and yearly story

A review of the story: the analysis of Anna's money told as swipeable slides. It uses two methods:

- the **ux-redesign-audit** method (scope, flow map, audit, evidence matching against the Drive library, prioritised changes);
- the **Apple design principles** critique (eight principles, tensions, Responsibility, Agency and accessibility first).

This review builds on two earlier documents and does not repeat what they already fixed:

- `ux-audit-persely.md` and `ux-change-plan-persely.md`. F13 (consistent bucket colours) and F14 (no "Tap to start") are built and working.
- F02 (one income base), F04 (late vs due soon), F10 (forints under 1%) and F11 (say what the score measures) are built on Home and My money. The story only partly follows them; see S05, S06 and S17.

Date of review: 19 Nov 2026. Build: working copy of `index.html` served at port 8090. Another agent was editing the file in parallel, so line numbers may shift. Function names are stable.

---

## Status (19 Nov 2026)

**Implemented in `index.html`:** STORY-01 to STORY-12.

- STORY-01 state-aware tip (`tipOf()` has four outcomes: late bill, overspent month, normal tip, none)
- STORY-02 "left over" after the bills still due
- STORY-03 late bill goes first
- STORY-04 one percentage base (money in), actionable donut hero, "plan N%" per row
- STORY-05 progress slide: one message, score shown once, "Pick a new date"
- STORY-06 one text for screen and VoiceOver, timing follows it, arrow keys pause
- STORY-07 goal dates on the demo clock
- STORY-08 put-aside copy for every mix
- STORY-09 share card guards
- STORY-10 overspend drawn on the Out bar
- STORY-11 bills copy aligned with the Home card
- STORY-12 small accuracy fixes

**Not implemented:** STORY-13 (year story ends with an action), STORY-14 (Must-pay with the analyst off), STORY-15 (first-run hint) and STORY-16 (validation with students). They come after the pitch.

**Measured on the running app:** demo story 29.8 s, rent unpaid 31.3 s, semester 36.7 s, year story 23.9 s. `window.__checkAnalytics()` passes 103 of 103.

**Reading this document.** The sections below describe the story as it was before these fixes, with the numbers of that build (for example "15 150 Ft left over", "Move 600 Ft", 43/28/21/8 of money out). They are kept as the evidence behind STORY-01 to STORY-12 and no longer match the app. The current numbers are in the demo script and the prototype guide.

**Acceptance now met:** STORY-04 (State B: the donut and the plan both say Saving 7%, and every row shows "plan N%").

**Test D needs a card payment of 15 000 Ft or less with rent paid.** With rent unpaid the late bill comes first and the tip becomes Pay now, so state D no longer shows the food-and-drink tip.

---

## 1. Scope, and what was and was not inspected

**Product and user.** OTP Persely prototype, a junior savings and money add-on. The user is Anna, a student aged 18–29.

**Flow.** Open the story → 7–9 timed slides → share card → close. Three variants:

- monthly;
- semester (key E);
- yearly (Y path, then the year story from "See your year").

**Evidence library.**

- Read through the Google Drive connector. The Playbook was read in full (P01–P45, Evidence gaps, Student lens).
- Study IDs I cite (A/B/C/D) were confirmed against the Studies sheet.
- I did not open the Examples sheet row by row. E-IDs are quoted only as the playbook cites them.

**How it was inspected.**

- The real running app in the Claude browser pane at 375×812, 375×667 and 440×956.
- Each slide was frozen with `window.__story.open(0,{pause:true,manual:true})`, `go(n)` and `seek(3)` (after every entrance has landed).
- Each frozen slide was screenshotted and looked at.
- Every slide's on-screen text, VoiceOver sentence (`say`), duration and word count was dumped with `info()` and `stWords()`.
- Contrast was computed from the CSS colours: `#0F3D1E`→`#1E5410` background, `--st-dim`, `--st-warn` and the `ST_SEG` tints.
- Screenshots are in `/private/tmp/claude-501/-Users-tamaspinter-Documents-GitHub-otp-persely-prototype/d08aacec-c462-4c7c-b07e-be67880bcdba/scratchpad/story-shots/` (23 files, named by state and slide).

**Isolation note.**

- I started on `http://localhost:8090`. While I worked, the app state there changed under me (the month jumped from 1 to 9 to 12), so another session was probably driving that origin.
- I moved to `http://127.0.0.1:8090`, which has its own localStorage, and did all the recorded inspection there.
- At the start I had already cleared localStorage on `localhost` and loaded the J state there. The other agent may see that.
- At the end I cleared storage on `127.0.0.1`, reset the viewport to desktop and closed my two tabs.

**States inspected.**

| # | State | How | Slides |
|---|---|---|---|
| A | J (8 weeks later), analyst off | `week8State()` | title, in/out, donut, put aside, progress, tip, share (7) |
| B | J + analyst on + split accepted + O (+1 month): **the demo story** | `data-anon`, `data-anaccept`, `fastForward(1)` | + bills (8 + share), 30.1 s |
| C | B + rent unpaid | `billMissed()` (key B) | bills slide becomes "Rent share is late", Pay now |
| D | C + a 20 000 Ft Wolt card payment | added a transaction | + "The biggest change" (Food and drink +74%), 33.9 s |
| E | Semester | `endSemester()` (key E) after J + analyst | 9 slides incl. best/hardest month, 35.2 s |
| F | Year at month 12 | `demoStart()` → `fastForward(12,'year')` → Keep my 3.0% → year story | 7 slides, no bills, no tip (analyst off) |
| G | F + a 150 000 Ft shopping payment: **overspent month** | added a transaction | negative left-over, tip still offered |

**Not inspected.**

- A real iPhone, Safari or iOS WebKit.
- VoiceOver or any screen reader. The VO findings come from the `say` strings, the `aria-live` region and timing in code, not from listening.
- Dynamic Type or browser text zoom.
- Real `prefers-reduced-motion`. It was checked in code only (`stRed()` lands every slide at its final frame).
- Real touch gestures (hold to pause, swipe down to close) and the laptop iPhone frame (pane width under 760 px).
- Real users. No usability round was run.
- The parallel edit another agent is making to `index.html`: not looked at.

---

## 2. Slide by slide (demo story, state B, 375×812)

Durations come from `stDur()`: 2.5 s + 0.2 s per on-screen word, at most 5 s. "Words" counts what `stWords()` counts (the big number, sub and note); chart labels and the plan legend are not counted. "VO words" is the length of the `say` sentence read on that slide.

| # | Slide (`id`) | The question it should answer | What it shows now (real numbers) | Words / VO words / s | Issues |
|---|---|---|---|---|---|
| 1 | `title` | "What is this?" | Pig, "Your month", **December**, "In about 30 seconds." | 5 / 12 / 2.0 | Fine. With the semester variant, "Your semester" plus "Autumn semester" says the same thing twice. |
| 2 | `inout` | "Did I spend more than came in?" | In 145 000 / Out 129 850, stacked in bucket colours; hero **15 150 Ft** "left over this month." | 7 / 20 / 3.9 | **In state C the hero is 57 150 Ft "left over" while 42 000 Ft rent and 5 550 Ft phone are still unpaid (S02).** When overspent (G), the deficit is an orange block stacked on the *In* bar, which reads as extra income (S12). |
| 3 | `donut` | "Where did it go?" | Donut of 129 850 Ft out: Must-pay 43%, Essentials 28%, Fun 21%, Saving 8%; hero **43%** "Must-pay was the biggest part. Fun was 21%." | 9 / 22 / 4.3 | Percentages are of money *out*. Slide 7 uses money *in* (Must-pay 42, Essentials 31, Fun 20, Saving 7). Same names and colours, different numbers, two slides apart (S05). The hero is the bucket she cannot change, every month (S14). |
| 4 | `bills` | "Are my bills OK?" | Receipt of 6 bills, Total 61 000 Ft; hero **5 of 6 bills paid**; "Phone is due later: 5 550 Ft." | 12 / 13 / 4.9 | Good chart choice. In state C it shows "Rent share is late: 42 000 Ft (due on the 2nd)", but this is slide 4 of 8, about 10 s in (S03). Sub "Rent share and Phone still open. Bills first." lists Phone, which is not due, and "Bills first." is jargon (S17). Row tag "Not paid" vs headline "late"; "In 6 d" abbreviation. |
| 5 | `put` | "How much did I save?" | Coin stack; Your rules 7 500, Round-ups 3 000, Interest 271; hero **10 771 Ft** | 14 / 20 / 5.0 | The counters repeat the hero. When nothing was added (F, G) the copy says "All of it was added by you. Interest added 2 400 Ft." (S10). |
| 6 | `progress` | "Am I getting there?" | Ring 56% Summer holiday; Streak 12 weeks; Health score 75 of 100 ▲25; hero **56%** "On pace for March 2027."; orange note "75 of 100: 3 of 4 habits held this month / PS5 + GTA VI: date passed, 183 917 Ft to go." | **26 / 62** / 5.0 | Four messages in 5 s. The score appears twice. A positive line is in the warning colour. The late goal has no fix on screen; the fix ("A new date, like Sept 2027") is only in VO. At month 12 the pace date is wrong (S06, S07, S09). |
| 7 | `next` | "What should I do next month?" | Header "Based on about 145 000 Ft a month in", plan bar 42/31/20/7; hero **Move 600 Ft**, "10% of food and drink each month to Summer holiday: 1 week sooner." + **Set it up** | 16 (+ ~20 legend) / 42 / 5.0 | Two messages: a plan and a tip. The tip is 600 Ft (200 Ft in the semester). It ignores the 20 000 Ft food rise on slide 5 (D). It is offered even when rent is late (C) and after a 124 450 Ft overspend (G: "Move 7 500 Ft … 28 weeks sooner", from a one-off purchase) (S01, S04). |
| 8 | `share` | "Can I show this?" | Card: streak, top 2 goals with %, "Saving with OTP Persely", no amounts | – / 13 / – | No amounts: good. Year state shows "**0** week streak, without a break" and a goal 20% done with a passed date (S11). Share only toasts "Share card saved". |

**Other variants.**

- **Analyst off (A):** 7 slides, no bills. Slide 7 is titled "Next month · December" but shows only the pig and the tip (S13). The donut still shows a locked "Must-pay 75%" bucket built from `mustBills()` (S22).
- **Biggest change (D):** line chart Aug, Sep, Oct, **Dec**. November (the skipped demo month) is missing but the points are evenly spaced. The callout "20 000 Ft, up from 11 467 Ft" repeats the hero "+74%". The sub "That is 2 weeks of Summer holiday saving" is a fair translation into goal terms.
- **Semester (E):**
  - Bills: "All 6 bills paid … 22 payments", with the total row labelled "Months paid 22 of 22" and Phone at "2 of 2".
  - Best and hardest month: bars carry no values; meaning is carried by colour and the sub line.
  - The tip is "Move 200 Ft".
- **Year (F):**
  - Put aside "2 400 Ft – All of it was added by you".
  - Progress "49% · On pace for **November 2027**", although it is November 2027 in the demo.
  - Streak 0. No bills slide. No action slide: the year ends without a next step.

---

## 3. Apple design principles critique

### Purpose (as understood)

Once a month, in about 30 seconds, tell Anna in plain words how her money went and what one thing to do next, so she trusts the app and acts. The story is a summary with **one** action, not a dashboard.

### Top issues (most important first)

1. **Responsibility.** Slide 7 suggests moving money to savings in exactly the states where that is bad advice:
   - rent is late (C);
   - the month is 124 450 Ft overspent (G);
   - the "monthly" 10% is computed from a one-off 150 000 Ft purchase.
   
   → Make `tipOf()` state-aware. Late bill: the action is Pay now. Overspent: no move-money tip. Only recurring categories count. (STORY-01)
2. **Responsibility.** "57 150 Ft left over" while 47 550 Ft of bills are still due this month. → Show what is left *after* bills still due this month. (STORY-02)
3. **Purpose / Familiarity.** Slide 3 and slide 7 show the same four buckets with different percentages (of money out vs of money in). → One base: money in. (STORY-04)
4. **Flexibility (accessibility).**
   - VO sentences run to 62 words on a slide that advances after 5 s.
   - The VO text and the screen differ: the fix and the reward are VO-only.
   - The progress slide has 26 words on screen in 5 s.
   
   → One text source for screen and VO, at most about 20 words, and timing tied to it. (STORY-05, STORY-06)
5. **Purpose.** The single insight is weak and disconnected. "Move 600 Ft" follows a slide that says food rose 74% to 20 000 Ft. → The tip uses the biggest-change category when there is one, with a realistic amount. (STORY-01)
6. **Responsibility (priority).** A late bill is slide 4 of 8. → When a bill is late it goes first. (STORY-03)
7. **Craft.**
   - The goal date uses the real calendar, not the simulated month.
   - "All of it was added by you" when nothing was added.
   - "0 week streak, without a break" on the share card.
   
   → STORY-07, STORY-08, STORY-09.
8. **Simplicity.** The progress slide carries five things (goal %, pace, streak, score twice, late goal). → One message plus one small supporting line. (STORY-05)

### By principle

| Principle | Verdict | Note |
|---|---|---|
| Purpose | **weak** | Each slide answers a real question and there is one action button, but the action is often not the right one (S01, S04). The donut hero repeats the fixed bucket every month (S14). |
| Agency | OK | Pause button, tap back/next, hold, swipe down, Escape and arrow keys. Set it up has Undo. "Pay now" opens the sheet and returns to the story. Auto-advance can outrun reading on dense slides (S08). |
| Responsibility | **weak** | Saving tip while rent is late or after overspending (S01). "Left over" ignores bills still due (S02). Share card amounts are private (good), but it shows goal names and a 0 streak (S11). Must-pay classification shows with the analyst off (S22, open question). |
| Familiarity | OK | Story pattern (top bars, tap zones, corner pause and close) is a known convention. Bucket names and colours match My money (F13 done). The percentage base does not (S05). |
| Flexibility | **weak** | Contrast passes (text 5.3–9:1, graphics 3.3–5:1 on `#1E5410`) and reduced motion is handled. VO is a live region racing a 5 s timer, with VO-only content (S07). Several charts use colour alone: the overspend block, best/hardest bars (S12, S16). Fits 375×667 and 440×956. |
| Simplicity | OK→weak | Most slides follow "one number + one line". Progress (26 words) and Next (plan + tip, ~36 words with legend) do not. |
| Craft | OK | Time-driven `seek()` engine, no bounce on numbers, recordable. Data and copy bugs in edge states (S09, S10, S11, S16) undo the polish. |
| Delight | OK | Pig, counters, coin stack, receipt metaphor. The happy pig on the tip slide after a 124 450 Ft overspend is off-key (S21). |

### Trade-offs to decide

- **Delight vs Simplicity.** Counters and coin stacks repeat the hero number (put aside, progress). → Keep one animated hero per slide and drop the duplicate counters where they repeat it.
- **Agency (auto-advance) vs Flexibility (screen readers).** Auto-advance is the format, but VO users cannot keep up. → Keep auto-advance and make the spoken text short and equal to the screen. Stop auto-advance once the user moves by keyboard. Longer term, test with VO users (P37).
- **Engagement vs Responsibility.** A "Move X Ft" button converts better on every slide-7 render. → Accept fewer tips. Show a tip only when it is safe and recurring. Measure understanding, not tip taps (P21: C028).
- **Completeness vs length.** 8–9 slides at 30–35 s. → Do not add slides. When the bills slide is the urgent one, move it up instead.
- **Social share vs privacy.** → Amounts stay off. Default to hiding goal names (hypothesis, H2).

### What's working

- The engine: pure `seek(t)`, deterministic, recordable. Reduced motion lands slides at their final state. Pause has state reasons (`ST.hold`). Hidden tab pauses.
- One palette with checked contrast (comment at CSS line ~387 matches my calculation). Consistent bucket colours (F13).
- The receipt chart for bills is the right metaphor. The line chart with a dashed 3-month average is the right chart for "the biggest change".
- Rises only (no fake drops). The 25% and 2 000 Ft thresholds in `stDrift()` keep the slide honest.
- Late-goal copy already has a fix in VO ("Your 46 166 Ft is safe. A new date … fixes it.") and avoids blame. It just needs to be on screen.
- The share card shows no amounts.
- Set it up → Undo toast (P30). Pay now → returns to the story.

---

## 4. Findings

Severity is based on how often the state happens in the demo and in real use, and how much it misleads. The evidence strength is copied from the playbook pattern and not upgraded.

| ID | Slide / state | Observed symptom | Why it matters | Severity | Patterns | Evidence strength |
|---|---|---|---|---|---|---|
| S01 | Next (C, G) | Slide 7 offers "Move 600 Ft" with rent late, and "Move 7 500 Ft … each month … 28 weeks sooner" after a one-off 150 000 Ft purchase in a month 124 450 Ft overspent. Pig is happy. | Advice that moves money to savings while a bill is unpaid or the account is short. The amount is extrapolated from a one-off. A trust and harm issue. | High | P19 (priority rules, no disguised promotion), P13 (keep friction where it protects), P36 caveat | P19 moderate; P13 strong prevalence / weak remedy |
| S02 | In and out (C) | "57 150 Ft left over this month" while 47 550 Ft of must-pay bills are still due this month. | The hero number overstates free money. The Bills-first logic elsewhere already subtracts these. | High | P19, P11; P22 (show the full cost up front; extrapolated from checkout) | P19 moderate; P11 moderate; P22 strong for checkout, extrapolation |
| S03 | Order (C) | A late bill is shown on slide 4, about 10 s in, after in/out and donut. | The most urgent fact comes after two slides that suggest everything is fine. | Med-high | P19 | Moderate |
| S04 | Next (B, D, E) | The tip comes from `project()` Fun categories: 600 Ft (monthly), 200 Ft (semester). In D the change slide says food rose to 20 000 Ft, yet the tip is still 600 Ft from the projection. | The one actionable insight is trivial or disconnected from the story it ends. | High | P21 (plain-language insight, targets), P36 | P21 strong (engagement not behaviour) / moderate design; P36 strong |
| S05 | Donut vs Next (B) | Donut: Must-pay 43, Essentials 28, Fun 21, Saving 8 (% of out). Next: 42 / 31 / 20 / 7 (% of in). Same names and colours. | F02 fixed this on Home/My money but not in the story. Two sets of percentages two slides apart read as an error. | High | P11, P21 | Moderate |
| S06 | Progress (B–F) | 26 words on screen in 5 s; score shown twice; "75 of 100: 3 of 4 habits held" in warning orange; "date passed" with no visible fix; reward is VO-only. | Overload, and colour signals the wrong valence. Bad news without a next step (P29). | High | P41, P29, P37 | P41 moderate; P29 strong (guidance); P37 strong |
| S07 | All (code) | `.st-body` is `aria-hidden`. A polite live region reads "Slide n of N. {say}", up to 62 words, while the slide advances after at most 5 s. `say` differs from the screen (fix, reward, plan legend). | VO users are likely to hear cut-off or queued sentences and miss the action. Not verified with VO. | High | P37 | Strong (prevalence and the limits of automated tests); native-app data is thin |
| S08 | Progress, Next, Put aside | `stDur()` caps at 5 s regardless of words. 14–26 words plus a chart in 5 s. | Reading load. Pause exists, so it is not blocking. | Med | P37; reading-speed claim is a hypothesis (no library evidence) | Strong / hypothesis |
| S09 | Progress (F; also B) | `inMonths()` uses `new Date()`, not the simulated month: at month 12 "On pace for November 2027" while the demo is in November 2027 at 49%. | A wrong date on the Y demo path. Trust. | Med-high (demo) | P11 | Moderate |
| S10 | Put aside (F, G) | `A.save = 0`, `A.interest > 0` → "All of it was added by you. Interest added 2 400 Ft." | Contradictory copy. | Med | P11, P31 | Moderate / weak |
| S11 | Share (F) | "0 week streak, without a break"; a late goal (PS5 20%) shown; goal names shown; Share only toasts "saved". | Sharing a zero and a missed goal. Goal names may be personal. | Med | P24 (private by default: E8-047, E1-020), H2 | Moderate / hypothesis |
| S12 | In and out (G) | Overspend drawn as an orange block on top of the In bar; colour is the only signal on the chart. | Reads as extra income. | Med | P37, P21 | Strong / moderate |
| S13 | Next, analyst off (A, F) | Header "Next month · December" over a pig and a tip; no forecast. | The label promises something the slide does not show. | Low-med | P40 | Moderate |
| S14 | Donut (all) | The hero is the biggest bucket, which is Must-pay almost every month (43–75%). | A fixed cost is not news. The hero should be what Anna can steer (Fun vs split, or left over). | Med | P21 | Strong / moderate |
| S15 | Biggest change (D) | X axis Aug, Sep, Oct, Dec, evenly spaced (Nov missing). The callout repeats the hero. | Misleading time axis; duplicated text. | Low-med | P11 | Moderate |
| S16 | Semester bills, best/hardest (E) | "Months paid 22 of 22" (they are payments); Phone "2 of 2"; best/hardest bars have no value labels; good/bad by colour only. | Small inaccuracies; colour-only meaning. | Low-med | P11, P37 | Moderate / strong |
| S17 | Bills (C) | Sub "Rent share and Phone still open. Bills first." (Phone not due for 6 days). Row tag "Not paid" vs "late"; "In 6 d". | Same mix of late and due-soon that F04 fixed on Home. | Med | P29, P41, P19 | Strong / moderate |
| S18 | Controls | Pause and close in the top-right corner; tap zones are invisible; no first-run hint. | Familiar convention; reach is a minor issue. | Low | P15, P03 | Strong / strong |
| S19 | Year (F) | With the analyst off, the year story has no bills slide and no action. It ends at Share. | A year summary with no next step. | Low-med | P04 (end with a concrete action, extrapolated) | Moderate |
| S20 | Next after Set it up | The plan bar still shows Saving 7% after +600 Ft/month; "Tip is on" is app jargon. | Small inconsistency after an action. | Low | P11, P40 | Moderate |
| S21 | Next (G) | Happy pig and "Move 7 500 Ft" right after "124 450 Ft more went out than came in". | Tone: cheerful upsell after a bad month. | Low (folds into S01) | P13; tone has no library evidence (Evidence gap 8) | Hypothesis |
| S22 | Donut, analyst off (A) | The donut shows a locked "Must-pay 75%" bucket built from `mustBills()` while the analyst is off. | Possibly shows analyst-derived classification without consent; needs a product decision. | Open | P13 | Strong prevalence / weak remedy |

---

## 5. Prioritised changes

Ranked by Impact (1–5), then evidence, then lower effort.

- **Ready now:** small or medium edits inside `storySlides()` / `tipOf()` / `shareCard()` / `inMonths`. Low risk before Friday's pitch.
- **Later:** needs a product decision or a test first.
- After any change, re-run `window.__checkAnalytics()`. One check compares the `next` slide with `splitView()` (around line 1256).

| Rank | Change | Fixes | Impact | Effort | Evidence | Patterns | When |
|---|---|---|---|---|---|---|---|
| STORY-01 | State-aware tip: no move-money tip when a bill is late or the month is overspent; tip from recurring categories and linked to the biggest change | S01, S04, S21 | 5 | M | Moderate | P19, P13, P21, P36 | Ready now |
| STORY-02 | "Left over" minus must-pay bills still due this month | S02 | 5 | S | Moderate | P19, P11, P22 (extrapolation) | **Ready now, quick win** |
| STORY-03 | Late bill goes first | S03 | 4 | S | Moderate | P19 | **Ready now, quick win** |
| STORY-04 | One percentage base (money in) for the donut and the plan; actionable donut hero | S05, S14 | 4 | M | Moderate | P11, P21 | Ready now (touches demo-script numbers) |
| STORY-05 | Progress slide: one message, fix visible, no duplicate score, colour by meaning | S06 | 4 | S | Strong / moderate | P29, P41, P37 | **Ready now, quick win** |
| STORY-06 | One text source for screen and VoiceOver, about 20 words max; timing follows it | S07, S08 | 4 | S–M | Strong | P37 | Ready now (S part); VO test later |
| STORY-07 | Goal dates on the simulated clock | S09 | 4 | S | Moderate | P11 | **Ready now, quick win** |
| STORY-08 | Put-aside copy for every mix, including "nothing added" | S10 | 3 | S | Moderate / weak | P11, P31 | Ready now |
| STORY-09 | Share card guards: no 0 streak, no late goals, goal names hidden by default | S11 | 3 | S | Moderate / hypothesis | P24, H2 | Ready now |
| STORY-10 | Overspend drawn on the Out bar with a label and pattern; supportive copy | S12 | 3 | S | Strong / moderate | P37, P29 | Ready now |
| STORY-11 | Bills slide copy aligned with F04 | S17 | 3 | S | Strong / moderate | P29, P41, P19 | Ready now |
| STORY-12 | Small accuracy fixes: change-slide axis, semester labels, bar values, analyst-off title, plan after tip | S13, S15, S16, S20 | 2 | S | Moderate | P11, P40, P37 | Ready now |
| STORY-13 | Year story ends with an action | S19 | 2 | S | Moderate (extrapolated) | P04 | Later |
| STORY-14 | Must-pay bucket with the analyst off: decide | S22 | ? | S | Strong prevalence / weak remedy | P13 | Later (decision) |
| STORY-15 | First-run hint for tap/hold; reach | S18 | 1 | S | Strong (P03 for short in-context hints) | P03, P15 | Later |
| STORY-16 | Validate with 5 students per round | all | – | M | Strong | P45, P44, P21 | After the pitch |

### STORY-01 State-aware tip, linked to the story (S01, S04, S21)

**What.** Slide 7's action must never suggest moving money to savings when Anna is short. It should also come from a regular habit, not a one-off, and connect to what the story just showed.

**How (in `index.html`).**

1. Extend `tipOf()` with a guard argument, or add `storyTip(A, d)` used only by `storySlides()`:
   - `const bf = bfNow(); if(bf.on) return {kind:'bill', row:bf.late[0]}`, so the slide-7 action becomes Pay now.
   - `if(A.left < 0) return {kind:'short'}`: no money-move action.
   - Recurring only: keep a Fun category only if `monthUse(y).spend[c] > 0` in at least 2 of the last 3 `S.closedYm`.
   - Compute the 10% from the **3-month average** (`avg` as in `stDrift()`), not from `project()` or this month's one-off.
   - If `stDrift(ym)` returned a Fun-group category, use that category so slides 5 and 7 tell one story.
   - Minimum tip: if `ten < 1000`, return null. Do not show "Move 200 Ft".
2. In `storySlides()` slide 8, branch on `kind`:
   - **bill:**
     - key `Next step`;
     - big `Pay rent share first`;
     - sub `42 000 Ft, due on the 2nd. Your saving tips wait until it is paid.`;
     - `btn:{label:'Pay now', attr:'data-stpay="…"'}` (the handler already exists);
     - plan bar kept.
   - **short:**
     - key `Next month · {mn}`;
     - big `A tighter month`;
     - sub `{ft(-A.left)} more went out than came in. No saving tip this month.`;
     - no button, or `See where it went` opening My money (`data-go` to the page that holds My split);
     - pig `pig('calm')` or no pig. **Never `happy`.**
   - **tip:** as now, but from the recurring average: `Move {ft(ten)} a month` and `10% of food and drink, about {ft(avg)} a month, to {goal}.` Add the weeks line only if `wk >= 2`.
   - **none:** if analyst on, show the plan only, with big `{V.by.save.pct}% saving` (the existing branch).
3. `stInsight()` is unchanged (Undo stays).

**Copy rules.** Plain and dry. No "you should", no time-pressure words. Supportive when short.

**States.** Late bill; overspent; tip; no tip; tip already on (`S.insightUsed`); analyst off.

**Acceptance.**

- State C → slide 7 shows Pay now, not Set it up.
- State G → no money-move suggestion, and the pig is not happy.
- State D (needs a card payment of 15 000 Ft or less with rent paid) → the tip names food and drink and uses about 10% of the 3-month average (about 1 100 Ft), not 600 Ft.
- No tip under 1 000 Ft.
- `__checkAnalytics()` passes.

**Test.** Run states B, C, D, G with `__story.info()` and compare the `next` `say`. Usability question: "What does the app suggest you do now, and why?" Success means the student names the action and the reason (P21 metric: comprehension, not tip taps).

**Risk.** Fewer Set it up taps in the demo. The demo script's act that taps Set it up must use state B, where there is no late bill.

### STORY-02 "Left over" after bills still due (S02)

**How.**

1. In slide 2 (`inout`), compute `const due = an ? billsFirst().rows.filter(r => r.s.left > 0).reduce((a, r) => a + r.s.left, 0) : 0, free = A.left - due`. Only for the monthly story (`!sem`), the current month.
2. Hero:
   - `ft(free)` when `free >= 0`, with sub `left after the bills still due ({ft(due)}).`
   - When `due === 0`, keep `left over this month.`
   - When `free < 0` but `A.left >= 0`, use big `ft(-free)` in `--st-warn` and sub `short for the bills still due.`
3. Chart: draw `due` as an outlined (stroke only, `stroke-dasharray="4 3"`) segment inside the gap area, labelled "Bills due" (SVG `<text>`), so colour is not the only signal.
4. `say`: `{in} came in, {out} went out. {free} is left after {due} of bills still due.`

**Acceptance.**

- State C → hero 9 600 Ft (57 150 − 42 000 − 5 550), sub names 47 550 Ft.
- State B → 15 150 − 5 550 = 9 600 Ft, "bills still due (5 550 Ft)".
- The number equals `safeToSpend()`'s bill deduction logic for the month.

**Test.** Compare with the Bills first card on Home in the same state.

**Risk.** The demo narration that quotes "left over" changes.

### STORY-03 Late bill first (S03)

**How.**

1. At the end of `storySlides()`, before `return out`: if `bfNow().on`, move the `bills` slide to index 1 (right after `title`): `const bi = out.findIndex(s => s.id === 'bills'); if(bi > 1){ out.splice(1, 0, out.splice(bi, 1)[0]); }`.
2. Title sub becomes `One thing first, then the rest of {month}.` (no amounts).

**Acceptance.** State C: the slide order is title, bills, in/out, … `info()` shows `bills` at index 1. With no late bill, the order is unchanged.

**Test.** First-click/timing task: "Is anything wrong this month?" answered before 5 s.

### STORY-04 One base for the percentages; an actionable donut hero (S05, S14)

**How.**

1. In slide 3 (`donut`), use **money in** as the base: segments `must, ess, fun, save` + `left` (when `A.left > 0`, colour `ST_SEG.left`).
   - Percentages via `lrPct(values, A.inc)`.
   - Centre label `came in` / `ft(A.inc)`.
   - When `A.left < 0`, keep the out base and say so: centre `went out`, sub ends `% of what went out`.
2. With the analyst on and accepted, show each legend row as `Fun 21% · plan 20%`, using `curView().by[k].pct` (the same numbers slide 7 shows).
3. Hero:
   - **analyst on:** the bucket with the largest positive gap to plan among `ess, fun` (`Fun: 3% over plan`). If none is over, `Within your plan` with sub `Fun {x}%, plan {y}%.`
   - **analyst off:** `Fun: {p}%` with sub `of the money that came in.`
   - Must-pay is never the hero.
4. Keep colours (F13).

**Acceptance.**

- State B: donut Saving 7% and plan Saving 7% (10 500 / 145 000). Met.
- No slide shows two different percentages for the same bucket and month without a label saying which ("this month" vs "plan").

**Test.** Comprehension: "What share of your money did you save in December?" Answers match across slides 3 and 7 and My money.

**Risk.** The demo script quotes donut numbers. Update it. Re-run the agree() self-check.

### STORY-05 Progress slide: one message, visible fix (S06)

**How (slide `progress` in `storySlides()`).**

1. Hero stays: goal % (or forints when `tiny`, as F10). Sub: `On pace for {date}.`
2. Remove the score from the `note`. It already sits in the stat list (`st-cn`). Keep it there as `75 of 100` and add `3 of 4 habits` as the small unit (`st-u`).
3. Late goal (`tight`):
   - the note becomes `{name} needs a new date. Your {ft(saved)} is safe.`;
   - add `btn:{label:'Pick a new date', attr:'data-go-goal="…"'}`, reusing whatever opens the goal's date step;
   - drop "date passed" and the "to go" amount.
4. `.st-n` colour: use `--st-dim` for neutral or positive lines. Keep `--st-warn` only for the late-goal line, and prefix it with an icon (`I('clock',14)`) so colour is not the only signal.
5. Reward line: show it on screen when there is room (no tight goal), the same as VO.

**Acceptance.** At most 16 words in `stWords()`. The score appears once. No positive line in orange. The fix text is on screen.

**Test.** `__story.info()` word counts. Ask a student what to do about the PS5 goal after the slide.

### STORY-06 One text for screen and VoiceOver; timing follows it (S07, S08)

**How.**

1. Build `say` from the same strings as the screen: in `stFrame()`, return the HTML, and set `s.say = [k, big, sub, note, button label]` joined. Or add `stSay(root)` that reads `.st-k,.st-big,.st-sub,.st-n` and the foot button text after the slide has landed (`ST_END`). Delete the hand-written `say` strings that add extra content.
2. Keep each slide at or below about 20 words on screen. STORY-04 and STORY-05 do the trimming.
3. `stDur()`: `Math.min(7, 2.5 + 0.3 * words)` for slides with a chart, keeping the 5 s cap only for title-like slides. Hypothesis; check against completion.
4. Stop auto-advance after the first keyboard navigation (`ArrowLeft`/`ArrowRight`): set `ST.manual = true` in the keydown handler and show "Paused" on the pause button. A user who steps by keyboard no longer races the timer.
5. Put the slide's button inside the announced text, e.g. "Button: Pay now".

**Acceptance.** `say` equals the visible text for every slide in states A–G. No `say` longer than about 25 words.

**Test.** Real VoiceOver on an iPhone (not done here). Swipe through all slides, and confirm each sentence finishes and the button can be reached (P37: test manually with screen readers).

### STORY-07 Goal dates on the simulated clock (S09)

**How.**

- Change `inMonths` (line ~1608) to use the app's month: `const inMonths = m => { const y = ymAt((S.months || 0) + m); return MONTHN[+y.slice(5) - 1] + ' ' + y.slice(0, 4); };`.
- Check the other callers of `inMonths` (goal cards, forecast) still read right. They should, since every other date in the demo already uses `ymAt`.

**Acceptance.** At month 12 with 12 months to go, the slide says "November 2028". In state B, the dates match the goal card on the Persely tab.

### STORY-08 Put-aside copy for every mix (S10)

**How.** In slide `put`, build the sub from the parts that are non-zero:

- rules/round-ups `> 0` → `Rules and round-ups moved {by}.`
- manual `> 0` → `You added {manual}.`
- interest `> 0` → `Interest added {interest}.`
- only interest → big `ft(interest)`, sub `Interest only. Nothing moved in this {unit}.` Hide the coin stack: interest is not a deposit.
- zero → the existing `No money moved to a goal. Even 500 Ft starts a streak.`

Drop the counters that equal the hero (single-row case).

**Acceptance.** States F and G never say "added by you" when `A.manual === 0`.

### STORY-09 Share card guards (S11)

**How (`shareCard()`).**

1. If `S.streak === 0`, hide the flame block and lead with the best goal.
2. Only list goals that are not late: `!(isExact(g) && daysTo(g) < 0)`.
3. Default goal names hidden: show `Goal 1 · 49%` with a small toggle `Show goal names` (per-share, not saved). This is a hypothesis (H2, P24 private by default).
4. If nothing is left to show, the share slide says `Nothing to share this {unit} yet.` and offers only Close.
5. Toast copy: `Share card ready. It shows no amounts`. The prototype does not save a file.

**Acceptance.** The year state (streak 0) never shows "0 week streak, without a break".

### STORY-10 Overspend on the Out bar (S12)

**How (slide `inout`, `!gap` branch).**

- Draw the over-part on the **Out** bar above the In level as a hatched block: an SVG `<pattern>` with 45° lines in `#FFB873`.
- Add a dashed line at the In height labelled `In`.
- Add the text `over by {ft(-A.left)}` next to it.
- Keep the In bar plain white.
- Sub: `more went out than came in. It happens; next month's plan starts from here.`

**Acceptance.** No orange block on the In bar. The deficit is readable in greyscale.

### STORY-11 Bills slide copy (S17)

**How (slide `bills`, monthly branch).**

- Late:
  - big `Rent share is late`;
  - sub `{ft(lateTotal)}, due on the {nth}.` plus, if `bf.soon.length`, `Phone {amt} is due in {n} days.`;
  - drop "Bills first.".
- Row tag:
  - `Late` (was "Not paid");
  - `In 6 days` (widen `.st-rc .tk` to 72px);
  - the shorter `6 days` if the width is tight.
- Not late: as now.

**Acceptance.** Headline wording matches the Home Bills first card (F04). Phone is never called late or open before its day.

### STORY-12 Small accuracy fixes (S13, S15, S16, S20)

- **Analyst off, slide 8:** key `One tip` instead of `Next month · {mn}` when `!P`.
- **Biggest change:** compute x from the real month index. Skip the missing month with a gap in the line (`M` move instead of `L`), or label it, so the spacing is honest. Drop the callout's second line, which repeats the hero.
- **Semester bills:** the total row is `Payments made` / `{paid} of {due}`.
- **Best/hardest bars:** add the forint value above or below each bar (`<text>`). Mark best and hardest with a small ▲/▼ glyph, not colour alone.
- **After Set it up:** recompute `V` in `stRefresh()`. It already rebuilds, but the plan shows the split, not the rule. Either show `Saving 7% + 600 Ft tip`, or say `Your tip adds {ft(ten)} a month to {goal}.` Rename big `Tip is on` to `Done: {ft(ten)} a month`.

### STORY-13 Year story ends with an action (S19) — later

When the year has no tip, end with one concrete next step before Share. For example: `Next year: turn on the payday rule` (`Set it up` → the payday rule sheet) or `Pick your next goal`. This is P04 extrapolated from onboarding. Decide which action OTP wants at month 12, after "Keep my 3.0%".

### STORY-14 Must-pay with the analyst off (S22) — decision

The donut groups locked bills (`mustBills()`) as "Must-pay" even when the analyst is off. Either:

- (a) with the analyst off, fold Must-pay into Everyday essentials and drop the lock icon; or
- (b) confirm that locking bills is the user's own act and not analyst output, and keep it.

This needs a product and legal call on what the analyst consent covers (P13).

### STORY-15 First-run hint (S18) — later

On the first story only (`!S.storySeen`), show one line under the bars for 2 s: `Tap right for next · hold to pause`. Skippable, in context, once (P03: B003, B021). Keep the pause and close buttons where they are: familiar story convention, and P15's reach issue is minor here.

### STORY-16 Validation (after the pitch)

- One round of 5 students (P45: D002; A029 warns that 5 users miss rare problems).
- Tasks:
  1. "Is anything wrong this month?"
  2. "How much did you save, and what share of your money is that?"
  3. "What does the app suggest, and would you do it?"
  4. VoiceOver run-through with at least one screen-reader user.
- Metrics (P21, P44: D001): comprehension and consistency of answers, story completion rate, action taps, and Undo within 24 h.
- Do not judge by spending change (C028).

### Rollout

| Phase | Changes | Why |
|---|---|---|
| Before Friday | STORY-02, 03, 05, 07, 08, 09, 11, then 01 and 04 if time | Small, local to `storySlides()` / `shareCard()` / `inMonths`; they fix what the demo path shows (B, C, Y). Re-run `__checkAnalytics()`, update `demo-script.html` numbers, re-record the story MP4. |
| Before Friday if time | STORY-06 (text source + keyboard stop), 10, 12 | Accessibility and chart honesty |
| After the pitch | STORY-13, 14, 15, 16 | Need a decision or a test |

---

## 6. Open questions

1. **Tip floor:** what is the smallest tip worth a button? This review proposes 1 000 Ft.
2. **Overspent month:** should slide 7 offer a non-money action (open My money, set a Fun reminder) or nothing?
3. **Donut base:** money in (proposed) or money out with a clear label? Money in matches My split and Next month.
4. **Must-pay with the analyst off (S22):** is locking bills covered by the analyst consent or not?
5. **Share card:** hide goal names by default? Should the share produce a real image (Web Share API with a canvas), or stay a toast in the prototype?
6. **Year story action:** which one next step at month 12?
7. **Timing:** keep auto-advance at all for screen-reader users, or always start paused when the story is opened by keyboard?
8. **Testing:** can a 5-student round with one VoiceOver user happen before or after Friday?
