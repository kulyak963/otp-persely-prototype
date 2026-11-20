# Home clarity, spacing and ring colours: short review

Lens: Apple HIG design principles (apple-design-principles skill). Branch: Tamas-branch.

## Purpose (as understood)
Home is the student's first view: see the money, see what is safe to spend, and get to the three most common actions without guessing what a control does.

## Top issues found (before)
1. Simplicity: the Shortcuts row was bare words ("Add money", "Pay a bill", "Card"). "Add money" did not say *to where*; it opens the Add money sheet that moves money into a savings goal. Fix: a Quick actions card, each row = icon, verb label, one helper line, chevron. "Add money to a goal / Put money into your Persely savings", "Pay a bill / See what is due and pay it", "Manage my card / Block it and see your Discounts".
2. Familiarity: header icons had no visible names (the envelope meant "For you"). Fix: small captions "Notifications" and "For you" (gift icon); the avatar and name are one button with "Profile and settings" under the name.
3. Familiarity: account cards gave no sign that they are tappable or where they go. Fix: a green "Account details" or "Open Persely" line with a chevron.
4. Simplicity: "Safe to spend" had no definition on Home. Fix: helper "What you can spend until payday" above the bills line.
5. Simplicity: the Persely streak card ("8-week streak / Safe this week") did not say it is about Persely. Fix: "Persely savings. Safe this week" / "Persely savings. Save by Sunday to keep it".
6. Simplicity: "Details" under the ring did not say details of what. Fix: "See spending details"; the month line now says "November 2026. What you paid by card, by category"; For you gets "Offers, tips and news from OTP"; "All" became "See all".
7. Craft: spacing used about 20 different px steps (6, 10, 14, 18, 22...), so stacks looked uneven. Fix: one scale as tokens (`--sp-1`..`--sp-6` = 4/8/12/16/24/32) plus role tokens (`--gutter`, `--pad-card`, `--gap-stack`, `--gap-sec`, `--gap-title`, `--gap-btn`, `--row-y`, `--row-x`). Every app rule and inline style snapped to the scale (story, lock screen, device frame and demo panel left alone). Home blocks now stack with one 12 px gap and 24 px before each section title. The wizard gutter changed from 20 to 16 px to match the app.
8. Delight / Flexibility: the category ring used muted blues and browns. Fix: a bright palette for young users (electric blue, violet, mint, sky, coral, hot pink, sunny yellow, tangerine, slate). It is used the same way in the ring, legend dots, Where it went bars and My plan rows. OTP green stays for the centre number, and the Persely tab ring stays green. Colour is never the only signal: the legend text stays.

## Trade-offs
- Simplicity vs. height: the Quick actions card is about 70 px taller than the old row. We kept it because the request was "clear on first sight". It still works at 320 px with no horizontal scroll.
- Caption "Notifications" is long at 320 px, so the name block wraps to two lines there. This is acceptable; the label matches the page title and the screen reader name.
- Sunny yellow is under 3:1 on white. That is acceptable because the legend and rows carry the name and amount as text.

## Checks
- chk-spacing-scale: the tokens exist and resolve to 4/8/12/16/24/32; gutter, card, section, Quick actions, page and sheet use them; no rule of the app uses an off-scale px step.
- chk-home-labels: each quick action has an icon, a verb label and a helper line with no hyphens, is 44 px or taller, and Add money to a goal opens the shared Add money sheet.
- Adapted: chk-home-order (new labels), chk-home-details-button (new button text).
