# Spending page notes (Phase 5)

One Spending page (flow plan C2). Order: Safe to spend card, month circle, Bills row, My plan, Persi's tips, Next month row, Latest card payments, analyst footer.

## Two named spend numbers
- **Card spending**: card payments of the month (`cardSpending()`, same data as the category bars).
- **Total out**: all money that left the Junior account that month except moves between the student's own accounts (Persely, Bills pocket, currency, interest). Card payments, direct debits, transfers out and cash count (`totalOut()`).
- "Spent" is never shown on its own.

## Month end projection
Shown as: "At this pace you finish the month with about X Ft left." (or "about X Ft short" when negative). Code: `monthEndLeft()` in `index.html`.

    X = balance now (Junior account)
        - must-pay bills still unpaid this month (less what the Bills pocket covers)
        - average daily card spending x days left in the month
    average daily card spending = card spending so far this month / the day of the month (the demo "today")

Rounded to 100 Ft. Income still to come is not counted (salary and family money have arrived by then). A late bill counts as unpaid. It is a guide, not a promise.

## Analyst on by default (D10)
Open for OTP and legal: lawful basis for default-on processing (`CONFIRM WITH OTP / LEGAL` comments in `index.html`). Off fallback: Safe to spend = balance minus the bills still to pay; bills stay; the plan and categories are hidden.

## Story at month end
`S.monthEnd` is the demo month clock. Demo keys M (month end, then play) and E (semester) set it; `monthStep()` (key O) clears it.
