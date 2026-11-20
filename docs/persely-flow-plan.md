# Persely flow plan (final)

Branch: **Tamas-branch, commit 2a31431**. Plan only, no code. Sources: `decisions.md`, `A-first-run.md`, `B-daily-use.md`, `C-insight-nav.md`, screenshots in `shots/`. Finding IDs follow `decisions.md` (C file "F2.1" = C2.1). "Confirm with OTP" marks facts not in the files.

---

## 1. Summary

- **Scope:** every workflow of the Persely student-savings prototype inside the copied OTP mobile bank, for Hungarian students aged 18-29: first run (A1-A6), daily use (B1-B8), insight and navigation (C1-C7). That is 21 flows.
- **How it was done:** three flow walks ran in parallel on the real build (Playwright, 390x844, touch, with the source read where screens could not show behaviour). They logged 154 findings: 19 at severity 3, 85 at severity 2, 50 at severity 1. Their 58 decision questions were merged into 14 decisions (D1-D14), and the product owner has now settled all 14.
- **What changes for the user:**
  - Each feature has one home and one name.
  - A brand-new user lands on a calm Home with a visible first step.
  - Money never moves from a prefilled one-tap form, and every move has a 10 s Undo that survives page changes.
  - There is one goal wizard, one place for saving rules and one Spending page whose first line answers "how much can I spend".
  - Bills and Safe to spend work from day one (the analyst is on by default, with a clear switch-off).
  - Settings, Perks, Transactions search and Filter are real.
  - The other OTP-shell rows stay, with one consistent "not in the demo" message.

## 2. Design principles

1. **First step above the fold.** The one thing a new user should do is the first block they see. Evidence: the call to action sits at y=763 of 779 px (A6-1), and the modal opens before Home (A1-3).
2. **Data matches the story.** The seed state never contradicts the copy. Evidence: 110 000 Ft and 2 goals appear next to "Let's pick a goal" (A1-2, B1-4, C1.7).
3. **One feature, one entry, one name.**
   - There are 4 ways to add money (C1.8) and 3 "Persely" pages (C1.2).
   - The same concept appears under 3-8 names (A5-5, B6-8, naming table in C).
4. **Money moves only on purpose.**
   - Forms start empty, and anything above 20 000 Ft gets a review step.
   - Undo lasts 10 s and persists across pages.
   - Evidence: Withdraw is prefilled with 5 000 Ft (B2-1), the transfer form accepts a blank name (B3-1), and Undo vanishes on any tap (B8-2).
5. **Benefit and limit side by side.** No rate claim appears without its cap, tax and end date. Evidence: 3.0% is shown without the 500 000 Ft cap (A3-3), "Keep" flips the badge before the condition is met (A4-2), and no terms appear anywhere (A5-1).
6. **The answer first, details after.** Each page opens with the number it exists for. Evidence: Safe to spend sits 1 590 px down a 2 921 px page (C2.1), and the four buckets appear three times (C2.2).
7. **Every success has a next step.** Evidence: reaching a goal is a dead end (B2-4, C4.3), the story has no "See details" (C3.2), and the year page is an orphan (C4.1).
8. **The demo shell is honest.** Rows that are not built say so in one consistent, intentional voice. Evidence: 14 of 24 More rows and 4 Transfer rows show mixed "not available" toasts (C1.1, B8-3).

## 3. Target information architecture

### 3.1 Tab bar (unchanged, 5)

Home · Transfer · Persely · Transactions · More. The orange dot on Persely stays (shown while this week's saving is open). Second-level pages keep Back. No new tabs (D4).

### 3.2 Home, blocks in order

1. **Header:**
   - Avatar opens Profile and Settings (D11). The demo panel moves behind a flag (C5.5).
   - Bell with an unread dot opens the Notifications inbox, last 20 items (D11).
   - The mail icon is named "For you" in both its label and the page title (B1-6, C1.6).
2. **Late-bill card**, shown only while a bill is late. It has two actions: Pay now and All bills (D13).
3. **Balance:**
   - The account carousel shows Junior, Persely (total, number of goals) and Savings.
   - The Junior card carries one line: "Junior package until [date] · Keep my 3.0% ›" (D2, A4-6).
   - The Savings card carries a "Why Persely?" link that opens the per-100 000 Ft comparison (D2, A6-7, B1-3).
4. **Safe to spend:** for example "Safe to spend 59 840 Ft · Next: Phone 5 550 Ft on the 20th". It opens the Spending page (D3, D10).
5. **Shortcuts row:** Add money · Pay a bill · Card (D4, B1 fix, B5 decision).
6. **Persely card:**
   - New user: "Start your first goal" opens the tile chooser (D1, A6-9).
   - With goals: the streak card ("1-week streak ...") opens the Persely tab.
7. **Monthly story card:** "Your [month] is ready", shown only at month end (D3, C3.1).
8. **My monthly spending:** two named numbers, Card spending and Total out (D3, B1-2, C2.3), with "Details" opening the Spending page.
9. **For you** cards (OTP shell, D7).

### 3.3 Persely tab, blocks in order

The header holds the title and a gear that opens Settings > Persely (D11).

| # | New user (no goal) | Existing user |
|---|---|---|
| 1 | **Setup card:** "What are you saving for?" with the 6 tiles inline and "Not now" (D1, A6-1) | Persi line (state-aware: N5) + Total card with the story ring (active at month end only) |
| 2 | Total card at 0 Ft with the trust line "Withdraw any time · No fees · Insured ›" (tappable, opens Good to know) | Add money / Withdraw + trust line |
| 3 | Junior card: date at any distance, "Keep my 3.0% ›" (D2) | Goals (each card opens the goal page; "New +" at 44 px) |
| 4 | Your habits, empty state: "Your streak starts with the first deposit" (A6-4) | **Saving rules** block: all 3 rules, each with its target goal and status; "Edit" opens the Saving rules sheet (D9) |
| 5 | How Persely works | Junior card (from 90 days left it moves up under the Total card, never above the setup card) |
| 6 | - | Your habits (streak, health score row) |
| 7 | - | Rows: Spending ›, Perks ›, Your year › (only after 12 months, C4.1) |
| 8 | - | Friends · How Persely works |

The late-bill card no longer appears on the Persely tab (D13). The Spending row stays.

### 3.4 More, grouped (all current rows kept, D7)

The top row is Profile and Settings (real, D11). Rows with † are shell rows: they keep their place and show the standard demo toast (see 3.7).

| Group | Rows |
|---|---|
| **Money** | My accounts · My cards · Spending (opens the Spending page; replaces "Spending tracker") · Mobile top-up† · Click to Pay† · Motorway vignette† · Exchange rates† · QR reader† · Documents† |
| **Persely** | Persely (opens the Persely tab) · Savings options (opens the Persely tab, "Savings options" section anchor) · Perks (Discounts + My rewards; "My partners" opens Perks) · Financial analyst (switch row, same switch as Settings) · For you |
| **Help** | Settings · Notifications (opens Settings > Notifications) · How Persely works · Can we help?† · Invite a friend!† · OTP branches and ATMs in Hungary† · ATMs abroad† · Book a branch appointment† · Block internet and mobile bank access† · Log out |

Each group gets its own icons. "Financial analyst" and "Savings options" no longer share the pie-clock icon (C1.5).

### 3.5 Transfer

Its four round buttons stay: New transfer, Between my accounts, Currency transfer†, New qvik request†.

| Row | Behaviour |
|---|---|
| New transfer | Starts empty, validates its fields, shows a review above 20 000 Ft, then Undo for 10 s (D6) |
| Between my accounts | Opens the **shared Add-money sheet** with From and To choosers covering accounts and goals (D4) |
| Scheduled and recurring transfers | Opens Saving rules > Weekly transfer (the legacy Recurring transfer is merged, D9) |
| Previous transfers | Opens Transactions |
| Request money easily†, qvik requests†, Currency transfer†, New qvik request† | Standard demo toast (D7) |

### 3.6 Where every feature lives

| Feature | Single entry point | Other links allowed |
|---|---|---|
| Goals list, Total, Add money / Withdraw | Persely tab | Home Persely card and streak card, Home "Add money" shortcut, More > Persely (redirect) |
| Create goal (one wizard) | Tile chooser (Persely tab setup card or "New +") | Home "Start your first goal" card |
| Edit / delete goal | Goal page (edit sheet) | none |
| Add money (one shared sheet) | Persely tab "Add money" | Goal page, Home shortcut, Transfer > Between my accounts |
| Saving rules (Payday rule, Weekly transfer, Round-ups) | Persely tab > Saving rules sheet | Goal page rows (read-only status + "Edit" opens the same sheet), Settings > Persely, Transfer > Scheduled and recurring |
| Junior status / Keep my 3.0% | Persely tab Junior card | Home Junior line, savings badge (tappable), push |
| Good to know (rate, cap, tax, protection) | Wizard summary step | Trust line, How Persely works |
| Spending (Safe to spend, plan, bills summary, next month) | Spending page | Home Safe to spend line, Home "Details", Persely tab row, More > Spending |
| My plan (edit) | Spending page "My plan" > Edit | none (the gear on the old Monthly spending page is gone) |
| Bills list, Bills pocket | Spending page > Bills row | Home late-bill card "All bills", Home "Pay a bill" shortcut, Safe to spend sheet |
| Pay a bill | Bill sheet | Late-bill card Pay now, story bills slide |
| Monthly story | Persely tab story ring (month end) | Home story card (month end), push |
| Year page | Persely tab "Your year" row (12 months+) | More > Persely group row, year story |
| Transactions search / filter | Transactions tab | Spending page category taps (category passed in) |
| Card (block, limit, details) | More > My cards | Home "Card" shortcut |
| Perks (Discounts + My rewards) | More > Perks | Persely tab row, My cards "Discounts" row, push |
| Financial health score | Persely tab habits row | none |
| Settings (incl. Persely section) | Avatar / More > Settings | Persely tab gear (deep link to Settings > Persely) |
| Notifications inbox | Home bell | none |
| Notification settings | Settings > Notifications | More > Notifications |
| Financial analyst switch | Settings > Persely | More switch row, Spending page footer "Turn off" |
| Help | More > Help | Persely tab "How Persely works" |

### 3.7 One demo-toast rule (D7)

- All shell rows use one wording and one look, for example: "**[Row name] is not part of this demo.** It works as in the OTP app."
- The toast carries a small "Demo" tag, `role="status"`, and lasts 3 s.
- It replaces every current variant: "X - not available in the demo", "Card details are hidden in the demo", "Daily limit: 300 000 Ft", "New features - details".
- Story "Share" is labelled "Share (preview)" and uses the same toast (C3.3).

### 3.8 Glossary (D5)

- **Formats:** amounts "87 450 Ft" with a space separator, also on chips ("50 000 Ft", never "50k" or "1 M"). Full date "1 June 2029", month date "June 2029". Relative dates say "Today" only when the date base is the same everywhere (N6).
- **Hungarian column:** draft only, to confirm with the team and OTP (see section 10).

| Term | Meaning | Where used | Hungarian (draft) |
|---|---|---|---|
| Persely | The product: goals + rules + streak | Tab, Home card, More | Persely |
| Goal | One saving pot inside Persely ("Up to 5 goals") | Goal cards, wizard, Add money | Cél |
| Add money | Move money into a goal | Persely tab, goal page, shortcut, Transfer | Befizetés |
| Withdraw | Move money from a goal to an account | Persely tab, goal page | Kivét |
| Saving rules | The 3 automatic rules as one set | Persely tab block, sheet, Settings | Megtakarítási szabályok |
| Payday rule | % of each salary to a goal, asks first or moves automatically | Saving rules, payday sheet | Fizetésnapi szabály |
| Weekly transfer | Fixed amount every week to a goal (replaces "Recurring transfer") | Saving rules, Transfer row | Heti átutalás |
| Round-ups | Card payments rounded up to 100 Ft, doubled, to a goal | Saving rules, card page | Kerekítés |
| Safe to spend | Balance minus bills still to pay, saving rule and essentials kept free; "A guide, not a limit" | Home, Spending page | Szabadon költhető |
| Spending | The one insight page | Home, Persely row, More | Költések |
| Card spending | Card payments, everyday + fun | Home gauge, Spending page | Kártyás költés |
| Total out | All money out except own-account moves | Home gauge, Spending page, story | Összes kiadás |
| My plan | Monthly split: must-pay, essentials, fun, saving | Spending page | Havi tervem |
| Bills | Regular must-pay payments | Spending page, Home shortcut | Számlák |
| Late bill | A bill past its due day, unpaid | Home card, push | Késésben lévő számla |
| Bills pocket | Money set aside for unpaid bills | Bills page section | Számlazseb |
| Financial analyst | Reads transactions to categorise and plan (on by default) | Settings, Spending page | Pénzügyi elemző |
| Monthly story | 8-slide month-end recap | Persely ring, Home card | Havi összefoglaló |
| Financial health score | Score of habits held | Habits row, year page | Pénzügyi egészség pontszám |
| Perks | Discounts (card offers) + My rewards (earned) | More, Persely row | Előnyök |
| Junior package | Account package with 3.0% Persely rate until the end date | Home, Persely tab | Junior csomag |
| Keep my 3.0% | Request to keep 3.0% for 12 months once salary arrives at OTP | Junior page | Megtartom a 3,0%-ot |
| Weekly reminder | Sunday 18:00 nudge if the week is open | Wizard pre-prompt, Settings | Heti emlékeztető |
| Notifications | Push + inbox (last 20) | Bell, Settings | Értesítések |
| Undo | Reverse the last money move within 10 s | Undo chip | Visszavonás |
| Goal reached | A goal at 100% | Goal card, goal page | Cél elérve |

## 4. Flow by flow

Format for each flow: **Now** (what happens today) → **Target** (numbered steps, key copy, states) → **Taps** (before → after) → **Resolves** (finding IDs). Target tap counts are design targets to verify in section 9.

### A1. App start

- **Now:** 0 taps. The splash (1.3 s) cannot be skipped. A modal opens over Home at 1.5 s. Face ID exists only in the demo reset, in the wrong order (lock → splash). Stray keys reset the data.
- **Target:**
  1. Splash; a tap skips it.
  2. Home opens with no modal.
  3. The new-user seed shows the Persely card "Start your first goal" in Home block 6.
- **States:**
  - Loading: splash only.
  - Demo: Face ID stays demo-only and the demo script says so.
  - The lock screen always layers above sheets.
  - Hotkeys work only while the demo panel is open.
- **Taps:** 0 → 0. The forced wait drops from 1.5 s (modal) or about 2.5 s (reset) to splash only, which can be skipped.
- **Resolves:** A1-1, A1-2, A1-3, A1-4, A1-5, A1-6.

### A2. What's-new pop-up → tile chooser

- **Now:** an automatic modal 1.5 s after launch, dismissed forever by "Not now" or a backdrop tap. The tile cannot be changed later. Restarting from the tab gives a hard-coded Travel preset. The modal has no dialog semantics.
- **Target:** the pop-up is retired. The **tile chooser** is the single entry to goal setup.
  1. It appears inline as the setup card on the Persely tab, reachable from the Home card "Start your first goal", "New +" and the tab card.
  2. It shows the title "What are you saving for?" and one line: "3.0% a year on up to 500 000 Ft with your Junior account until [date]" (conditions to confirm with OTP).
  3. The 6 tiles: Own home, Travel, Car → renamed "Driving licence", Safety net, Studies, Something else. "Trending" is removed.
  4. "Not now" collapses the card to one row: "Pick a goal when you're ready". The full card returns on the next tab visit.
- **States:**
  - Default: tiles.
  - Empty: not applicable.
  - Error: none.
  - If a sheet variant is kept, it gets `role="dialog"`, `aria-modal`, focus trap and Esc.
- **Taps:** Home → wizard step 1: 3 via the teaser (A6-9), or 1 via the modal tile → 2 (Home card, tile).
- **Resolves:** A2-1, A2-2 (Back on step 1 returns to the tiles), A2-3, A2-4, A2-5, A2-6, A2-7.

### A3. Create a goal (one wizard)

- **Now:**
  - Two wizards exist: 4 taps from the pop-up and 5 via New +. They differ in headings, rules, deposit, reminder and landing.
  - Goals created through New + never set `onboarded`.
  - "Create goal" silently moves the preselected 1 000 Ft.
  - Full customisation takes about 12-14 taps.
- **Target (D8, D9, D6):**
  1. Tile, then **Step 1 of 3 "Your goal"**: Name, Amount (chips "50 000 Ft … 500 000 Ft"; above 500 000 Ft the line "3.0% applies to the first 500 000 Ft"), and By when (chips + month sheet with a Close control). A Back arrow returns to the tiles.
  2. **Step 2 of 3 "How should money get in?"**:
     - The first goal defaults to the Payday rule only, at 10%, with a visible line "Keeps 20 000 Ft on your account; if money is tight, less or nothing moves".
     - Weekly transfer and Round-ups are off. Round-ups carry the example "A 1 190 Ft coffee moves 20 Ft; we double it". The fixed estimate is not shown as personal.
     - If a rule already points at another goal: "Round-ups now go to [goal] instead of [old goal]".
     - Preset amounts and dates are matched to the default rules so the forecast does not open with a shortfall.
  3. **Step 3 of 3 "Check and create"**: summary, a **Good to know** block (rate and cap, 28% tax, withdraw any time, no fees, deposit protection link, Junior end date), and the button **"Create goal"**. The button moves no money.
  4. The user lands on the new goal's page with the goal highlighted. The toast sits above the tab bar and does not cover the goal.
  5. First-goal-only next beat: "Start your streak? Add money now" with empty amount chips and Add. Then a soft reminder pre-prompt: "Want a Sunday nudge?" Turn on / Not now.
  6. `onboarded` is set by any path.
- **States:**
  - Disabled Next shows its reason ("Give your goal a name").
  - Amounts below 5 000 Ft show "Minimum is 5 000 Ft" instead of a silent clamp. Amounts above the upper limit (team to set) are flagged.
  - "Not now" asks "Save as draft?".
  - Back targets are 44 px.
- **Taps:** default path 4 (pop-up) / 5 (New +) → 4 from the tile chooser, plus 2 for an optional first deposit. New + becomes 5 through the same wizard.
- **Resolves:** A3-1, A3-2, A3-3, A3-4, A3-5, A3-6, A3-7, A3-8, A3-9, A3-10, A3-11, A3-12, A3-13, A3-14, A3-15, A3-16, A3-17, A3-18, A3-19, A3-20.

### A4. Junior status and Keep my 3.0%

- **Now:**
  - 3 taps, and only from the Persely tab.
  - The end trigger is "41 days, or when you graduate".
  - One tap flips the badge to "Graduate 3.0%".
  - The step says to copy the account number but there is no copy button.
  - Conditions sit at the bottom. "Congratulations, Anna" is hard-coded.
- **Target (D2):**
  1. Home Junior line, the tab card and the badge all show "Junior package until [one concrete date]" (end rule to confirm with OTP), at any distance. No "soon".
  2. "Your 3.0% rate" page: the headline is followed directly by its conditions: "On the first 500 000 Ft · 28% tax · Without a salary at OTP the rate returns to standard after 30 days' notice" (confirm with OTP).
  3. Step 1 has **Copy account number**.
  4. **"Request to keep 3.0%"** opens a confirm sheet with the conditions and Confirm.
  5. Pending state on the card: "Waiting for your first salary at OTP · [months] left". The badge stays "Junior 3.0%" until the salary arrives, then becomes "Graduate 3.0%".
- **States:**
  - Pending, success (salary arrived), expired (deadline passed).
  - At 0 days the copy reads "Your Junior package ended today", with the user's own name and no congratulation.
- **Taps:** 3 (tab, card, Keep) → 3 (Home line, Request, Confirm), plus 1 to copy the account number.
- **Resolves:** A4-1, A4-2, A4-3, A4-4, A4-5, A4-6, A4-7, A4-8.

### A5. Permissions, consent, terms, information

- **Now:**
  - No terms or protection info anywhere.
  - The push prompt is bundled into "Create goal".
  - The reminder status row reads as an error.
  - The analyst is opt-in from 6 entries.
  - The toast is not announced to screen readers.
  - Conditions are in 12 px text.
- **Target:**
  1. A **Good to know** block on the wizard summary (A3 step 3). The trust line on the tab opens the same content.
  2. A push pre-prompt **after** the goal exists (A3 step 5). The system prompt fires only from "Turn on".
  3. **Analyst default-on notice (D10):**
     - Shown once on first Home view, as a card: "Your Financial analyst is on. It reads your transactions to show Safe to spend, bills and categories. [What it reads] [Turn off]".
     - The switch also lives in Settings > Persely and the Spending page footer.
     - Wording and lawful basis are subject to OTP/legal (section 10).
  4. One word per concept (glossary). Condition text is at least 14 px. Sheets get an explicit Close. The toast gets `role="status"` and `aria-live="polite"`.
- **States:**
  - Reminder status: "Reminders on · Sunday 18:00", "Reminders off · Turn on", or "Notifications are blocked in phone Settings" (the last only after a denial).
- **Taps:** analyst on: 3 → 0. Switch off: 2 (card "Turn off", confirm). Push: 0 hidden → 1 explicit.
- **Resolves:** A5-1, A5-2, A5-3, A5-4, A5-5, A5-6, A5-7.

### A6. Home → Persely tab and back, first-visit hints

- **Now:**
  - The setup row is below the fold.
  - 4 hints take 4 visits, and two of them are marked seen without ever being on screen.
  - The tab opens with a 0-week streak and a "New story" ring.
  - More > Persely opens a legacy one-goal page.
  - Home shows Savings 3.5% next to "bonus interest".
- **Target:**
  1. The tab opens with the setup card first (3.3).
  2. Hints show once per block, on that block's first appearance, inside the visible area, and count as seen only after 1 s on screen.
  3. Empty states use plain copy ("Your streak starts with the first deposit"). The story ring is inactive until month end.
  4. More > Persely and Savings options open the tab.
  5. Savings 3.5% gets the "Why Persely?" comparison.
  6. Return path: tab bar (unchanged).
- **Taps:** setup from the tab: 2 + scroll → 1 (tile visible). Home → tab: 1 → 1.
- **Resolves:** A6-1, A6-2, A6-3, A6-4, A6-5, A6-6, A6-7, A6-8, A6-9.

### B1. Home

- **Now:**
  - No total and no free-to-spend figure without the analyst.
  - "Spent so far 14 480 Ft" counts card payments only, while about 70 000 Ft went out this month.
  - No quick actions.
  - Stale "Set up in 1 minute" copy.
  - Small targets.
- **Target:** the block order in 3.2.
  - "Safe to spend" appears from the start (D10).
  - Two named numbers: "Card spending 14 480 Ft" and "Total out" (D3).
  - Shortcuts: Add money, Pay a bill, Card.
  - Teaser copy follows the state (new user vs streak).
  - Tap targets "All accounts", "Details" and the bell are at least 44 px.
- **States:**
  - Loading: skeleton per card.
  - Empty Persely: the "Start your first goal" card.
  - Late bill: the card at the top.
- **Taps:** Add money from Home 3 → 3 (shortcut, chip, Add). Safe to spend 4 (opt-in) → 0 (visible). Card 2 → 1.
- **Resolves:** B1-1, B1-2, B1-3, B1-4, B1-5, B1-6.

### B2. Persely tab: goals, money in/out, rules, streak, friends, rewards

- **Now:**
  - Withdraw is prefilled with 5 000 Ft and takes one tap.
  - "Take all out" has no confirm.
  - A goal with money cannot be edited.
  - Editing is a 3-step wizard (6-7 taps).
  - Delete takes 5 taps.
  - A reached goal is a dead end.
  - Rules are global but switched per goal.
  - Rewards are hidden. The tab is about 2.3 screens long.
- **Target:**
  1. **Withdraw** (D6): the amount starts empty. Chips include "Withdraw all". "All" asks a one-line confirm: "Withdraw all 59 000 Ft to Junior account?". A review step appears above 20 000 Ft, then the 10 s Undo chip.
  2. **Add money:** the shared sheet with goal and account choosers. The amount starts empty, with chips. The streak hint shows in every context.
  3. **Goal page:** progress, one forecast with one weekly figure (N6), Add money / Withdraw, rule status rows ("Payday rule → this goal · Edit"), Activity labels "Added" / "Withdrawn".
  4. **Edit** (D8): a single edit sheet for name, amount, date and photo, even with money inside. Save. Undo 10 s.
  5. **Delete:** the sheet offers "Move 59 000 Ft to [account / another goal] and delete", with Undo 10 s.
  6. **Goal reached card:** "You did it: [goal] is fully saved" with Withdraw / New goal / Keep saving. The rules stay pointed at the goal until the user chooses. Persi's line updates. The progress shows "Reached" with the amount capped.
  7. **Saving rules sheet** (D9): all 3 rules with switch, amount and target goal. The tab is the master copy.
  8. The Perks row is on the tab (D12). The tab is shorter because the late-bill card is removed and the Spending, Perks and Year rows are compact.
- **States:**
  - No goals: "Add money" opens the tile chooser ("Create a goal first").
  - Validation: amount fields accept digits only (B2-8). An emptied goal is not flagged late.
  - Switches are 44 px.
- **Taps:**
  - Withdraw 3 → 4 (Withdraw, chip, Withdraw, plus review above 20 000 Ft).
  - Edit 6-7 → 3 (goal, Edit, Save).
  - Delete with money 5 → 3.
  - See all rules: needs each goal page → 2.
- **Resolves:** B2-1, B2-2, B2-3, B2-4, B2-5, B2-6, B2-7, B2-8, B2-9, B2-10, B2-11, B2-12, B2-13.

### B3. Transfer

- **Now:**
  - New transfer is prefilled ("Nagy Péter", 5 000 Ft) and sends in 3 taps with no review and no Undo.
  - A blank name and "abc" as the account number are accepted.
  - "Between my accounts" goes to a hidden default goal.
  - "Recurring transfer" saves a setting but never moves money.
  - Transfer dates are "13 November".
- **Target (D6, D4, D9):**
  1. New transfer starts empty: Name, Account number (format checked), Amount, Reference.
  2. Send, then "Review: Send 25 000 Ft to [name], [account]?" when above 20 000 Ft, then the 10 s Undo chip.
  3. Between my accounts opens the shared Add-money sheet (From: Junior or Savings; To: a goal, last used preselected with one-tap change).
  4. Scheduled and recurring transfers opens Saving rules > Weekly transfer.
  5. After an incoming transfer of 10 000 Ft or more, the payday sheet behaves as today (when a payday rule exists).
- **States:**
  - Errors are shown inline: "Enter a name", "Check the account number (16 or 24 digits)", "Enter an amount", "Not enough money on Junior account" (one wording).
  - The date base is the same everywhere.
- **Taps:** New transfer 3 (prefilled) → 2 + 3 fields (+1 review above 20 000 Ft). Between my accounts 3 → 3 with an explicit goal.
- **Resolves:** B3-1, B3-2, B3-3, B3-4, B3-5 (via the shared sheet and the post-transfer prompt), B3-6.

### B4. Transactions

- **Now:**
  - Filter is a dead toast on 191 rows. There is no search.
  - Rows can only be tapped with the analyst on.
  - Recategorising takes 4 taps and has no Undo.
  - "PERSELY DEPOSIT" shows -4 000 Ft while the goal page shows +4 000.
- **Target (D14, D10):**
  1. A search field at the top (payee name and the user's own bill label, such as "Rent share").
  2. Chips: Category, Date, In/Out, Persely, Bills. A Filter sheet with the same options.
  3. Every row opens a detail sheet (date, type, category, Change category; Persely rows link to their goal).
  4. Change category, then a toast "Moved to Everyday essentials · 14% used · Undo" (10 s).
  5. Category taps on the Spending page open Transactions with that chip preselected.
- **States:**
  - Empty search: "No payments match '[text]'" with Clear.
  - Pending: "No pending transactions."
  - Persely rows show "Added to [goal]" with the account-view sign explained.
- **Taps:** find a payment by name: scroll → 1 + typing. Recategorise 4 → 3 (row, Change category, category) plus Undo.
- **Resolves:** B4-1, B4-2, B4-3, B4-4, B4-5.

### B5. Cards

- **Now:** only via More > My cards (2 taps); blocking takes 3. Daily limit and details are mixed toasts. The block toggle is 50x30 px. Round-ups are not shown. Discounts appears in two places.
- **Target:**
  1. Home "Card" shortcut, or More > My cards.
  2. The card page shows: card image, a **Temporary block** switch at 44 px (reversible, no confirm), "Round-ups: on → Summer holiday · Edit" (opens Saving rules), and Change daily limit† / View card details† / Click to Pay†, all with the standard demo toast.
  3. The "Discounts" row opens Perks.
- **Taps:** block 3 → 2. Card page 2 → 1.
- **Resolves:** B5-1, B5-2, B5-3, B5-4.

### B6. Bills

- **Now:**
  - Bills exist only behind the analyst.
  - The late card shows on Home and on the Persely tab with 4 actions, and two of them skip without confirmation.
  - The Bills page links to itself.
  - The pocket moves 61 000 Ft while only 47 550 Ft is unpaid.
  - Pay now is prefilled with no visible beneficiary.
- **Target (D13, D10, D6):**
  1. Bills run from the start (analyst on by default). On first sight: "We found 8 regular payments · Confirm my bills".
  2. **Late-bill card on Home only:** "Rent share is late: 42 000 Ft (due on the 2nd)" with **Pay now** and **All bills**.
  3. **Pay now sheet:** To (name + account), Reference, From, Amount; "Nothing is sent until you tap Pay"; then "Pay 42 000 Ft", then Undo 10 s.
  4. **Bill sheet:** usual amount, due day, must-pay switch, Pay now, and under "More options" the entries "Already paid elsewhere" and "Not due this month", each with a confirm that states its effect on Safe to spend.
  5. **Bills page:**
     - The summary reads "61 000 Ft this month · 13 450 Ft paid · 47 550 Ft still to pay".
     - Bill rows have status chips. Other regular payments follow. The Bills pocket is a section: "Move 47 550 Ft (unpaid) to Bills pocket".
     - The self-link is removed.
  6. Settings > Notifications gains a "Bills due" toggle.
- **States:**
  - No bills found: "No regular bills yet. We'll show them after your first month."
  - Safe to spend explains why it does not change when a bill is late.
- **Taps:** Pay now 2 → 2 (beneficiary now visible). Skip a bill 1 → 4 (card, bill, More options, confirm), on purpose. Pocket move 1 → 1 (correct amount).
- **Resolves:** B6-1, B6-2, B6-3, B6-4, B6-5, B6-6, B6-7, B6-8.

### B7. Notifications

- **Now:** pushes do not match balances. There is no inbox. Copy bugs: "0-week streak", Safe to spend shown with the analyst off, a goal the user does not own. Settings hold 3 non-tappable rows. Banners vanish after 4-5 s.
- **Target (D11):**
  1. The **Home bell** with an unread dot opens the inbox (last 20, newest first). Tapping an item opens its screen.
  2. **Settings > Notifications** has 4 toggles (Bills due, Sunday streak reminder, Payday, Monthly story) plus Card payments and Incoming transfers, and quiet hours.
  3. Push copy depends on state:
     - The streak push only fires when the streak is 1 or more.
     - Safe to spend wording only appears when the analyst is on.
     - Friend pushes use real friends only.
     - Demo pushes update the balance and Transactions.
- **States:**
  - Empty inbox: "Nothing yet. Money events and bill reminders will show here."
  - Push blocked by the OS: a status line with steps.
- **Taps:** re-read a missed push: impossible → 2.
- **Resolves:** B7-1, B7-2, B7-3, B7-4, B7-5, B7-6.

### B8. Undo, errors, empty and confirmation states

- **Now:**
  - Undo is a 5 s toast that hides on any page change and restores the whole saved state.
  - Transfers and recategorising have no Undo.
  - Demo toasts vary. Error wording varies.
- **Target (D6, D7):**
  1. Every money move and every rule change shows the **Undo chip** for 10 s. The chip persists across tabs and pages, reverses only that action, and is announced via `aria-live`.
  2. Undo extends to Create goal, recategorise and story "Set it up".
  3. One error style: inline under the field, one wording per error.
  4. One demo-toast rule (3.7).
  5. The empty "Saving rules" panel links straight to the sheet.
- **Taps:** Undo after changing page: impossible → 1.
- **Resolves:** B8-1, B8-2, B8-3, B8-4, B8-5.

### C1. Tab bar and More

- **Now:** 24 unsorted More rows, 14 of them dead toasts, plus 4 dead Transfer rows. "Persely" opens three different pages. Two unlinked spending pages. Four ways to add money. Duplicate icons.
- **Target (D4, D7):**
  1. The tab bar stays at 5.
  2. More: the Settings row at the top, then the Money, Persely and Help groups (3.4). Every current row is kept. Shell rows get the standard toast.
  3. Legacy Persely details is removed. Its rows redirect to the tab.
  4. One Spending page and one Add-money sheet.
- **States:** a demo toast appears for each shell row (consistent).
- **Taps:** find Settings: dead → 2 (More, Settings) or 1 (avatar). Spending from More 2 → 2 (one destination).
- **Resolves:** C1.1, C1.2, C1.3, C1.4 (tab bar stays hidden on sub-pages; Back depth is reduced because the Bills self-link is removed), C1.5, C1.6, C1.7, C1.8.

### C2. Spending page (plan, Safe to spend, forecast, bills, warning)

- **Now:**
  - "Spending analysis" is 2 921 px long, with Safe to spend at 1 590 px.
  - The four buckets appear three times.
  - "Spent" has three meanings.
  - The forecast is far away.
  - Five entries lead to the Bills page.
  - Opting in takes 4 taps and lands on Home.
  - The late warning is duplicated.
- **Target (D3, D10, D13):** one **Spending** page, in this order:
  1. **Safe to spend** card: "59 840 Ft · A guide, not a limit". It opens the breakdown sheet.
  2. Month circle with two named numbers (Card spending / Total out), "16 days left" and a one-line projection for month end (formula to define from existing data).
  3. **Bills** row: late and upcoming items, then the Bills page.
  4. **My plan:** one block with categories expandable and one Edit. The saving amount is shown in Ft only ("7 500 Ft a month").
  5. Persi's tips.
  6. Next month (row, links back to My plan).
  7. Latest card payments: "All" opens Transactions.
  8. Footer: "Financial analyst is on · Turn off".
- **States:**
  - Default on, so no opt-in sheet.
  - Analyst switched off: Safe to spend falls back to "balance minus upcoming direct debits" and bills stay. Only categories and plan are hidden, with "Turn on to see your plan".
  - First month: "We need a few weeks of payments to suggest a plan."
- **Taps:** Safe to spend 4 (first time) / 1 + about 2 screens of scroll → 1 with no scroll. Bills 2 + scroll → 2.
- **Resolves:** C2.1, C2.2, C2.3, C2.4, C2.5, C2.6, C2.7, C2.8 (own label in Transactions), C2.9, C2.10 (kept).

### C3. Monthly story

- **Now:**
  - The only entry is the small ring on the tab.
  - It is offered mid-month with full-month figures.
  - It ends with Share (toast) and Close only.
  - "Pick a new date" loses the story. "Set it up" has no Undo.
  - Dense timed slides. The progress slide mixes goals.
- **Target (D3):**
  1. Available only at month end: the ring on the Persely tab plus the Home card "Your [month] is ready".
  2. 8 slides as today. The bills receipt and progress slides get longer timing. The progress slide refers to one goal only.
  3. The last slide has **See details** (opens the Spending page), Share (preview) with the standard demo toast, and Close.
  4. After "Pick a new date", Back returns to the story at the same slide. "Set it up" shows the Undo chip.
- **States:** not ready: the ring is grey ("Your story arrives on [date]"). Seen: grey ring, and reopening restarts.
- **Taps:** open 2 → 1 (Home card). From the story to details: 0 → 1.
- **Resolves:** C3.1, C3.2, C3.3, C3.4, C3.5, C3.6, C3.7 (kept).

### C4. Year page and savings comparison

- **Now:**
  - Reachable only through the demo fast-forward.
  - A reward sheet interrupts it.
  - The comparison uses different balances.
  - The overfunded goal shows "192 881 Ft of 134 000 Ft".
  - The health score is shown twice.
- **Target (D3, D2, D8):**
  1. The Persely tab "Your year" row and the More Persely-group row appear after 12 months, plus the year story.
  2. "What your rate earned", **per 100 000 Ft**: Persely 3.0%, Savings account 3.5% and the old 0.01% on the same bar scale, with one conclusion sentence covering rate, tax and access. Whether Persely may outrank 3.5% is to confirm with OTP.
  3. Reached goals show "Reached" with the amount capped.
  4. The score shows first month vs last month.
  5. Reward sheets queue until after the page.
- **Taps:** open the year page: impossible → 2.
- **Resolves:** C4.1, C4.2, C4.3, C4.4.

### C5. Settings, profile, payday rule, notifications, help

- **Now:**
  - Settings is a dead toast.
  - Persely settings are spread over 5 places.
  - The payday rule is 3 taps deep and also edited through My split.
  - Two automatic-saving systems.
  - The avatar does nothing; a long-press opens the demo panel.
  - Help is one sheet at the bottom of the tab.
- **Target (D11, D9):**
  1. Avatar or More > Settings opens Settings.
  2. Sections: Profile, **Persely** (Saving rules, Weekly reminder, Financial analyst switch, Junior status), Notifications (3.8 toggles + quiet hours), Privacy, Help (How Persely works, What the analyst reads, Can we help?†).
  3. The Persely tab gear deep-links to Settings > Persely.
  4. My plan's saving bucket shows "Linked to your payday rule · Edit" (one place to edit).
  5. The legacy Recurring transfer is merged into Weekly transfer.
  6. The demo panel sits behind a flag.
- **States:** the analyst switch shows a confirm on turn-off ("Safe to spend becomes a simpler estimate; bills stay on").
- **Taps:** payday rule 3 → 2 (Saving rules, Payday rule). Settings: dead → 1 (avatar).
- **Resolves:** C5.1, C5.2, C5.3, C5.4, C5.5, C5.6, C5.7.

### C6. Perks (rewards and partners)

- **Now:**
  - Earned rewards exist only inside the health-score sheet.
  - Three partner concepts are not linked; "My partners" is dead.
  - Discount rows promise details but activate on tap.
  - For you tabs do nothing.
  - Reward sheets pop up by themselves.
- **Target (D12, D7):**
  1. **Perks** page, reached from More > Perks or the Persely tab row. It has two tabs: **Discounts** and **My rewards**.
  2. Partners are named, with redemption steps (partner list to confirm with OTP).
  3. Tapping a row opens a detail sheet with Activate, then Undo.
  4. "Add to my rewards" lands in My rewards with a confirmation.
  5. The For you tabs stay (OTP shell), and cards and tabs show the standard demo toast.
  6. Reward sheets queue after the current page.
- **States:** no rewards yet: "Stay within your plan for a month and your first reward arrives."
- **Taps:** find an earned reward 2 (analyst on) or impossible → 2 (More, Perks) / 2 (tab row, My rewards).
- **Resolves:** C6.1, C6.2, C6.3, C6.4, C6.5.

### C7. Search and finding things

- **Now:** no search anywhere. Filter is dead. Category context is lost when moving from the analysis to Transactions.
- **Target (D14):**
  1. Transactions search and chips (see B4).
  2. Categories on the Spending page and Home category bars are tappable and pass their filter.
  3. Settings and grouped More solve feature finding. Global search is not now (C7 DQ2).
- **Taps:** find the rent payment: scroll to 2 November → 1 + typing "rent".
- **Resolves:** C7.1, C7.2, C7.3.

## 5. Decision log

| # | Chosen option | One-line consequence |
|---|---|---|
| D1 | (c) Two seeds; brand-new user (0 Ft, no goals) is the pitch default, existing user is the 2nd demo state | The demo panel needs a seed switch, and every first-run line is written for an empty start |
| D2 | (a) Full transparency | Home and tab show one end date, Keep becomes a pending request, conditions sit beside the headline, Good to know appears on the summary, the comparison is per 100 000 Ft. The end rule and conditions must come from OTP before the copy is final |
| D3 | (a) One Spending page, story only at month end | Monthly spending and Spending analysis merge. Two named spend numbers. The year page gets an entry |
| D4 | (a) One entry per feature, shared Add-money sheet | Legacy Persely details is removed. More is grouped Money / Persely / Help. Home gets status + shortcuts |
| D5 | (a) One English glossary now, Hungarian alongside | All strings are renamed in one pass. The Hungarian column is draft until confirmed |
| D6 | (a) Empty-start money moves, review above 20 000 Ft, 10 s persistent Undo | One Undo component for all moves. The transfer gets validation and review |
| **D7** | **CHANGED from recommendation (a) to (b):** keep all rows as a realistic OTP shell with "not in the demo" toasts. Only Settings and Filter become real | One consistent, clearly intentional toast replaces all variants. **Risk:** C1.1 (sev 3) is only partly fixed. A jury tapping 14 More rows and 4 Transfer rows still hits toasts, which B and C both found read as broken in a live pitch. Mitigation: uniform "Demo" tag, demo script avoids shell rows, grouped More puts real rows first in each group |
| D8 | (a) One wizard, edit sheet, Goal reached card | The New + page is removed. Edit no longer requires withdrawing |
| D9 | (a) Global saving rules in one sheet. First goal: payday rule only. Recurring merged into Weekly transfer | Goal pages show status only. One automatic-saving system |
| **D10** | **CHANGED from recommendation (a) to analyst ON BY DEFAULT with opt-out:** Safe to spend, bills, due dates, late-bill warning and recategorising work from the start | Daily value with zero setup; 6 opt-in entries collapse to one switch. **Risk:** default-on processing of transaction data needs a **lawful-basis / consent check with OTP and legal**. The app must state it clearly in-app (first-run notice, "What it reads") and offer an easy switch-off (Settings > Persely, More row, Spending footer). If legal requires opt-in, fall back to the recommended (a): Safe to spend (simple), bills and recategorising stay without the analyst |
| D11 | (a) Real Settings with a Persely section, per-type toggles, quiet hours, 20-item inbox, push pre-prompt after first goal | Avatar becomes functional and the demo panel moves behind a flag |
| D12 | (a) One Perks page (Discounts + My rewards) | Rewards get a wallet and partners are named (OTP list needed) |
| D13 | (a) Late-bill card on Home only; skips move into the bill sheet; one bills row; pocket defaults to the unpaid amount | Persely tab loses the card. The Bills page loses its self-link |
| D14 | (a) Search + category/date chips, category passed in, rows always tappable | Transactions becomes the find-anything list for payments |

## 6. Severity-3 findings

| ID | Fix | Phase |
|---|---|---|
| A1-2 | New-user seed (0 Ft, no goals) as the default; existing-user seed as the 2nd state (D1) | 1 |
| A3-16 | One wizard behind every entry (D8) | 3 |
| A3-18 | Set `onboarded` when the first goal is created by any path (pure bug) | 0 |
| A4-1 | One concrete end date with its reason, at any distance (D2; rule from OTP) | 1 |
| A4-2 | Keep becomes request → pending → Graduate on salary arrival (D2) | 3 |
| A5-1 | Good to know block on the summary, trust line tappable, deposit-protection link (D2) | 1 |
| A6-1 | Setup card as the first block of the tab (D1) | 1 |
| B2-1 | Withdraw starts empty, "Withdraw all" confirm, review above 20 000 Ft, Undo 10 s (D6) | 2 |
| B3-1 | Transfer starts empty, validates, review above 20 000 Ft, Undo 10 s (D6) | 2 |
| B3-3 | Recurring transfer merged into Weekly transfer (D9) | 3 |
| B4-1 | Real Filter sheet + search (D14) | 7 |
| B6-1 | Bills on from the start (D10 default-on) | 5 (with the analyst default) |
| B8-1 | Same as B2-1 and B3-1 (D6) | 2 |
| C1.1 | All rows kept; one consistent intentional demo toast; grouped More (D7 changed, partial fix) | 4 |
| C2.1 | Safe to spend first on the one Spending page (D3) | 5 |
| C4.1 | Year page row on the Persely tab and in More after 12 months (D3) | 5 |
| C5.1 | Real Settings with a Persely section (D11) | 6 |
| C6.1 | Perks page with My rewards (D12) | 6 |
| C7.1 | Transactions search + chips (D14) | 7 |

## 7. Remaining no-decision fixes

| Theme | What | IDs | Phase |
|---|---|---|---|
| N1 Tap sizes (44 px minimum) | "New +", setup Back and Not now, text links, mail/bell icon, 50x30 switches, 9.5 px text | A3-19, A6-8, B1-5, B2-10, B6-6, B7-5, C2.9 | 1 (tab/Home/wizard), rest with each phase |
| N2 Accessibility semantics | Dialog role, aria-modal, focus, Esc on sheets/overlays; aria-live toast; larger condition text, explicit Close | A2-4, A5-6, A5-7 | 1 |
| N3 Back / exit / undo recovery | Back to tiles; save-draft on Not now; Close on sheets; skippable splash; Undo on recategorise and story "Set it up"; story resumes after "Pick a new date" | A1-4, A2-2, A3-5, A3-9, B4-3, C3.4 | 1-3 |
| N4 Broken states, validation, layering | Disabled-Next reason; clamp/empty messages; field validation; remove the Bills self-link; direct link from the empty rules panel; lock-screen layering; hotkeys gated | A1-5, A1-6, A3-1, A3-2, B2-8, B3-6, B6-3, B8-5 | 0 (A1-5, B2-8), 1 (A1-6, A3-1, A3-2), 2 (B3-6, B8-5), 7 (B6-3 is a bills fix, see phase 7) |
| N5 Copy and labels | Explain "x2"/estimate; reminder row not an error; remove "Trending", Car → Driving licence; no hard-coded "Anna"; state-dependent push copy; one error wording; user's own bill label in Transactions | A2-6, A3-7, A3-10, A4-7, B7-3, B8-4, C2.8 | 0 (B7-3 0-week streak only), 1 (rest), 7 (C2.8) |
| N6 Numbers, seed, dates consistent | Preset vs default rules (no instant shortfall); one weekly-amount definition; one date base; same sign for Persely moves; pushes reflected in balances | A3-6, B2-5, B3-4, B4-4, B4-5, B7-1 | 1 (seed/dates), 3 (forecast), 6 (pushes) |
| N7 Layout, density, timing | Longer timing on dense story slides; health score once; queue auto-opening reward and goal sheets | C3.6, C4.4, C6.5 | 5-6 |
| N8 Keep (no change) | "A plan, not a limit", "A guide, not a limit", Undo after Pay, per-bill screen-reader labels, status chips, story accessibility | C2.10, C3.7 | - (protect with checks) |

Phase 7 also takes B6-3 (Bills self-link).

## 8. Phased rollout

Effort: S = under a day, M = 1-3 days, L = more than 3 days (team estimate, to adjust). Every phase keeps the **existing 125 self-checks green** and adds the named checks.

### Phase 0: Pitch freeze (today, 20 Nov)

- **Scope:** nothing new is built before the pitch.
- **Pure bugs only:**
  - A3-18: set `onboarded` on any first goal.
  - A1-5: lock screen above the pop-up.
  - B2-8: Add-money field accepts only digits.
  - B7-3: no push for a 0-week streak.
- **Demo script notes (no build):**
  - Face ID is demo-only.
  - Use the pop-up tile path, not New +.
  - Avoid shell rows and Withdraw/Transfer one-taps on stage.
  - Show the Spending page from the Home Safe to spend card.
- **Areas:** onboarding state, lock layer, Add-money sheet, push copy. **Effort:** S.
- **Acceptance:**
  - After New + → Create, the tab no longer shows "Let's pick a goal" and the hints start.
  - The 4 bugs are reproducibly gone.
  - No other diff.
- **Test:** 125 self-checks, plus `chk-onboarded-any-path`, `chk-lock-over-popup`, `chk-addmoney-digits`, `chk-push-zero-streak`. One full pitch run-through on the presenting device.
- **Risks:** any change on pitch day. Mitigation: freeze at commit, keep a rollback to 2a31431.

### Phase 1: First-run user, glossary, Junior transparency (D1, D5, D2 copy)

- **Scope:**
  - Two seeds with a switch in the demo panel, new user as default.
  - No auto pop-up; setup card first on the tab; Home "Start your first goal" card.
  - Hints per block (seen after 1 s on screen) and empty states.
  - Glossary pass on all strings and formats.
  - Junior date everywhere, conditions beside the headline, Good to know block, "Why Persely?" comparison copy.
  - Tap sizes and dialog semantics (N1, N2).
- **Areas:** seed data, Home, Persely tab, wizard step 3, all string tables, sheets.
- **Effort:** M-L. **Depends on:** OTP answers for the end rule and conditions (placeholders allowed, marked).
- **Acceptance:**
  - New-user seed: tile chooser visible without scrolling on the first tab visit at 390x844.
  - No string outside the glossary for the listed concepts.
  - Every 3.0% mention is accompanied by its cap and date.
  - All targets are at least 44 px.
- **Test:** 125 + `chk-seed-new-default`, `chk-seed-existing`, `chk-setup-above-fold`, `chk-no-autopopup`, `chk-hint-seen-on-screen`, `chk-glossary-terms` (string scan for banned synonyms: "Take out", "Take money out", "Spending tracker", "Create Persely", "New Persely", "Recurring transfer"), `chk-date-format`, `chk-amount-format`, `chk-rate-has-cap`, `chk-tap-44`, `chk-dialog-roles`.
- **Risks:** OTP rule not confirmed (copy stays placeholder); the Hungarian terms are not final.

### Phase 2: Money-move safety (D6)

- **Scope:**
  - Withdraw, Transfer and Add money start empty.
  - "Withdraw all" confirm.
  - Review above 20 000 Ft.
  - Transfer field validation.
  - Pay now shows the beneficiary.
  - One persistent 10 s Undo chip that reverses one action only.
  - One error wording.
- **Areas:** Add money, Withdraw, Transfer, Pay sheets; the toast/Undo component.
- **Effort:** M. **Depends on:** Phase 1 glossary.
- **Acceptance:**
  - No money sheet opens with an amount.
  - A blank name or invalid account cannot be sent.
  - Above 20 000 Ft always shows a review.
  - Undo survives a tab change and restores only its own move.
- **Test:** 125 + `chk-withdraw-empty`, `chk-withdraw-all-confirm`, `chk-transfer-empty`, `chk-transfer-validate`, `chk-review-over-20000`, `chk-undo-10s-persist`, `chk-undo-scope-single`, `chk-paynow-beneficiary`.
- **Risks:**
  - Undo scope changes the state model (today it restores the whole snapshot, B8-2).
  - One extra tap on Withdraw.

### Phase 3: Goal wizard and saving rules (D8, D9, D2 Keep flow)

- **Scope:**
  - One wizard behind all entries.
  - First deposit and reminder pre-prompt after creation.
  - Edit sheet; delete with "Move money and delete".
  - Goal reached card.
  - Saving rules sheet as the master; goal pages show status only.
  - Legacy Recurring transfer merged.
  - Keep my 3.0% request → pending → Graduate.
  - Single forecast figure.
- **Areas:** create/edit pages, goal page, rules sheets, Transfer row, Junior page, forecast.
- **Effort:** L. **Depends on:** Phases 1 and 2 (Undo, empty amounts).
- **Acceptance:**
  - Every entry lands on the same step 1.
  - "Create goal" moves no money.
  - Rule re-pointing is announced.
  - The badge stays Junior until the salary arrives.
  - A reached goal shows 3 next actions.
- **Test:** 125 + `chk-one-wizard`, `chk-create-no-money`, `chk-first-goal-payday-only`, `chk-rule-repoint-message`, `chk-edit-with-money`, `chk-goal-reached-card`, `chk-recurring-merged`, `chk-keep-pending`, `chk-forecast-one-figure`.
- **Risks:** migrating existing-user seed rules. The pending state needs a salary event in the demo.

### Phase 4: IA and placement (D4, D7)

- **Scope:**
  - Home blocks in order with shortcuts (Add money, Pay a bill, Card).
  - Persely tab order.
  - Grouped More with all rows kept.
  - Legacy Persely details removed and its rows redirected.
  - Shared Add-money sheet in Transfer.
  - One demo-toast component and wording.
- **Areas:** Home, Persely tab, More, Transfer, toast.
- **Effort:** M. **Depends on:** Phase 3 (shared sheets).
- **Acceptance:**
  - Each feature in 3.6 has exactly one primary entry and the allowed links only.
  - Every shell row uses the standard toast.
  - No route opens Persely details.
- **Test:** 125 + `chk-entry-map` (walks table 3.6), `chk-more-groups`, `chk-demo-toast-uniform`, `chk-no-legacy-persely`, `chk-home-order`, `chk-tab-order`.
- **Risks:** D7 risk (section 5). Muscle memory for the existing-user demo state.

### Phase 5: Spending page and analyst default-on (D3, D10)

- **Scope:**
  - Merge into one Spending page in the order of section C2.
  - Two named spend numbers.
  - Month-end projection line.
  - Story only at month end, with the Home card and "See details".
  - Year page entries and per-100 000 Ft comparison.
  - Analyst on by default with the first-run notice and switch-off in 3 places.
  - Fallback behaviour when switched off.
- **Areas:** Spending page, Home spending block, story, year page, analyst state.
- **Effort:** L. **Depends on:** Phase 4. **Legal sign-off on D10 before any user test with real-looking data.**
- **Acceptance:**
  - Safe to spend is visible without scrolling on the Spending page.
  - "Spent" no longer appears unqualified.
  - The story is not offered before month end.
  - Turning the analyst off keeps Safe to spend (simple) and bills.
- **Test:** 125 + `chk-sts-top`, `chk-two-spend-numbers`, `chk-story-month-end`, `chk-story-see-details`, `chk-year-entry`, `chk-compare-per-100k`, `chk-analyst-default-on`, `chk-analyst-notice`, `chk-analyst-off-fallback`.
- **Risks:** lawful basis (D10). The projection formula is not defined in the files.

### Phase 6: Settings, notifications, Perks (D11, D12)

- **Scope:**
  - Real Settings with a Persely section; avatar opens it; Persely gear deep-links.
  - Notification toggles and quiet hours.
  - Bell inbox (20).
  - Pushes reflected in data.
  - Perks page with Discounts and My rewards; detail sheet before Activate.
  - Reward sheets queued.
- **Areas:** Settings, Home header, notifications, Discounts, score sheet.
- **Effort:** M. **Depends on:** Phase 4.
- **Acceptance:**
  - Every Persely setting is reachable from Settings > Persely.
  - Each missed push can be re-read.
  - Earned rewards are listed with a partner name and steps.
- **Test:** 125 + `chk-settings-real`, `chk-gear-deeplink`, `chk-notif-toggles`, `chk-inbox-20`, `chk-push-reflects-balance`, `chk-perks-rewards`, `chk-discount-detail-first`, `chk-reward-queue`.
- **Risks:** the partner names need OTP input.

### Phase 7: Bills (D13)

- **Scope:**
  - Late-bill card on Home only, with 2 actions.
  - Skips in the bill sheet with a confirm.
  - One bills row; pocket as a section with the unpaid default.
  - Self-link removed.
  - "Bills due" toggle.
  - Own bill label in Transactions.
- **Areas:** Home card, Bills page, bill sheet, Persely tab.
- **Effort:** S-M. **Depends on:** Phases 5 and 6.
- **Acceptance:**
  - The late card does not appear on the Persely tab.
  - The pocket proposes 47 550 Ft in the seed state.
  - Skipping requires a confirm.
- **Test:** 125 + `chk-latecard-home-only`, `chk-skip-in-sheet`, `chk-pocket-unpaid`, `chk-no-bills-selflink`.
- **Risks:** low.

### Phase 8: Transactions (D14)

- **Scope:**
  - Search and chips (Category, Date, In/Out, Persely, Bills); real Filter sheet.
  - Every row tappable, with a detail sheet.
  - Category passed in from Spending.
  - Recategorising gets Undo.
  - Persely rows link to their goal.
- **Areas:** Transactions tab, Spending category taps.
- **Effort:** M. **Depends on:** Phase 5 (categories on by default).
- **Acceptance:**
  - Typing "rent" finds the Rent share payment.
  - A category tap opens a filtered list.
  - No row is inert.
- **Test:** 125 + `chk-tx-search`, `chk-tx-chips`, `chk-tx-filter-real`, `chk-tx-rows-tappable`, `chk-tx-category-passin`, `chk-recat-undo`.
- **Risks:** search performance on 191 rows is not measured; check on device.

## 9. Validation plan

**Thresholds** are drafts. The team must agree them before the first test and must not change them afterwards.

| Flow | Metric | Before (from files) | Draft threshold |
|---|---|---|---|
| A1 | Time to usable Home | 1.5 s to modal / ~2.5 s reset | Home visible at splash end; 5/5 notice no modal |
| A2 | Taps Home → wizard step 1 | 3 via teaser | ≤ 2; 5/5 find it unaided |
| A3 | Create first goal: task success, taps | 4 (5 via New +) | ≤ 4 from the chooser; 5/5 succeed; 5/5 can say whether money moved |
| A4 | Can state the end date and condition | Not possible (A4-1) | 4/5 state date + salary condition after the page |
| A5 | Can find the cap/tax and switch off the analyst | Cap: bottom sheet only | 4/5 find conditions; 5/5 switch off the analyst in ≤ 3 taps |
| A6 | First-visit: sees the next step without scrolling | Below the fold | 5/5 |
| B1 | "How much can I spend?" answered from Home | Not shown without the analyst | 5/5 within 10 s |
| B2 | Withdraw 3 000 Ft correctly; rename a goal with money | 1-tap 5 000 Ft; rename impossible | 5/5 exact amount; rename ≤ 3 taps |
| B3 | Send a transfer and catch a wrong amount at review | No review | 5/5 see review above 20 000 Ft |
| B4 | Find the rent payment | Scroll | ≤ 20 s, 5/5 |
| B5 | Block the card from Home | 3 taps | ≤ 2 taps |
| B6 | Pay the late bill and name the recipient before paying | Recipient not reviewed | 5/5 name the recipient |
| B7 | Re-read a missed notification | Impossible | 4/5 within 2 taps |
| B8 | Undo a withdrawal after switching tab | Impossible | 5/5 |
| C1 | Find Settings; tell a demo row from a broken one | Settings dead | 5/5 find Settings; 4/5 read the toast as intentional |
| C2 | Read Safe to spend on the Spending page | ~1 590 px scroll | No scroll; 5/5 |
| C3 | From the story to details | No path | 4/5 |
| C4 | Say which rate earns more per 100 000 Ft | Cannot be read | 4/5 |
| C5 | Change the payday rule % | 3 taps, 3 places | ≤ 2 taps from the tab, 5/5 |
| C6 | Find an earned reward | Hidden in the score sheet | 4/5 within 2 taps |
| C7 | Find a payment by name | No search | 5/5 |

**5-person hallway test script.** Recruit students aged 18-29, ideally Hungarian. Use a phone at 390x844 with the new-user seed (tasks 1-6), then switch to the existing-user seed (tasks 7-14). Use think-aloud and give no hints. Record taps, time and success. Total about 20 min.

1. "Open the app. What can you do here?" (A1, A6)
2. "Start saving for a trip." (A2, A3)
3. "Did any money move? How much, from where?" (A3, A5)
4. "When does your 3.0% end, and how can you keep it?" (A4)
5. "What does the app read about you, and how do you stop it?" (A5, D10)
6. "Put 2 000 Ft into your goal." (B2)
7. "How much can you spend until the end of the month?" (B1, C2)
8. "Take 3 000 Ft out of Summer holiday, then change your mind." (B2, B8)
9. "Send 25 000 Ft to a friend." Supply a wrong account number. (B3)
10. "Your rent is late. Pay it. Who receives the money?" (B6)
11. "Find last month's rent payment." (B4, C7)
12. "Your card is lost. Block it." (B5)
13. "Change how much of your salary goes to savings." (C5, B2)
14. "Find a reward you earned. Then open 'Exchange rates'. What happened?" (C6, C1/D7)

Closing questions: "What was confusing?" and "Which word didn't you understand?" (feeds the glossary).

## 10. Open questions (OTP, legal, team)

1. **Junior end rule (OTP):** age 24, university graduation, or whichever comes first? Give one concrete date rule to show on Home and the tab (A4-1, D2).
2. **3.0% vs 3.5% (OTP):**
   - May Persely be shown next to the Savings account at 3.5%, and may the comparison per 100 000 Ft conclude in either direction?
   - Confirm the 500 000 Ft cap, 28% tax, "about 2.2% net", 30-day notice, the 12-month bridge and its 6-month salary window (A3-3, A4-4, A6-7, C4.2).
3. **Analyst default-on (OTP, legal):**
   - What is the lawful basis for processing transaction data by default for categorising, plan, Safe to spend and bills?
   - What exact notice text, and is a one-time in-app notice plus an easy switch-off enough, or is explicit opt-in required (fallback: recommended D10 (a))?
   - Does the same apply to bill detection?
4. **Hungarian terms (team, OTP brand/legal):** confirm the draft column in 3.8, especially Persely vs "cél" for one goal, Safe to spend, Bills pocket, Perks, Monthly story. Also confirm the Hungarian date and amount formats ("50 e Ft", A3-15).
5. **Deposit protection (OTP):** the link and wording for "Insured" in Good to know (A5-1).
6. **Partners (OTP):** partner names and redemption steps for Perks (C6.1, D12).
7. **Notification defaults (team):** which pushes are on by default? B7 recommends money events and late bills on, the weekly reminder as an explicit opt-in.
8. **Thresholds (team):** confirm 20 000 Ft as the review threshold for all money-out (transfer, withdraw, bill pay), the upper sanity limit on goal amounts (A3-2), and the section 9 test thresholds.
9. **Month-end projection (team):** the formula for the one-line projection on the Spending page (C2.4). It is not defined in the files.
