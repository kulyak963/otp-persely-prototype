# Spending page UI rework (and the Home circle by category)

Branch: Tamas-branch. Review lens: Apple HIG design principles (Purpose, Agency, Familiarity, Flexibility, Simplicity, Craft).

## Purpose
Spending answers one question for a student mid-month: "How much can I still spend, and where did my money go?" Safe to spend is the answer; the circle and the plan explain it.

## Top issues found (most important first)
1. Simplicity: the circle only showed two colours (Everyday essentials, Fun) against the plan, so "where did it go" needed a second chart further down. Home repeated this with a separate bar chart.
2. Simplicity / hierarchy: under the circle sat four lines of similar grey text (Total out, plan line, projection, a legend), all at the same weight. The month end projection, the most useful forecast, did not stand out.
3. Familiarity: My plan mixed group rows, expandable rows and bars with no overview of how the month is split.
4. Simplicity: Persi's tips were a list card with separate rows, heavy for one to three sentences.
5. Flexibility: several labels were 12 to 13 px; conditions ("A plan, not a limit") were small grey text.
6. Agency: Home had only a small "Details" text link to reach Spending.

## What changes
- One shared category circle (`catRing`) on Home and Spending: one coloured arc per spending category (same categories as `catSpend`), a fixed colour per category (`CAT_COL`, blues for Everyday essentials, warm colours for Fun), Card spending in the centre, an aria-label that reads the split.
- Home: legend grid under the circle (dot, name, amount; each opens Transactions with that category), then a full-width 44 px "Details" button to Spending. The old bar chart is replaced by the legend.
- Spending, top to bottom: Safe to spend hero; the larger circle with Total out and days left; a Month end card with the projection and the plan or average line; "Where it went" category rows with share bars (tap to Transactions); Bills row; My plan with a stacked bar of the four groups plus rows; Persi's tips as one compact card; Next month; Latest card payments; analyst footer.
- My plan category rows use the same category colours as the circle.
- Text for conditions and row values at 14 px or more. All targets 44 px.

## Trade-offs
- The circle now shows the split of this month's card spending (a full ring), not progress against the average or plan. Progress moves to text right under it ("Planned for everyday and fun", "Average card spending a month") and to the My plan bars. Reason: with only a few days of spending, a progress ring split into many colours becomes slivers nobody can read.
- The Persely tab total keeps its single green progress ring; only Home and Spending use the category ring (`.cring`).
- Spending shows categories twice (circle legend and My plan rows). They answer different questions: "where did it go" versus "how am I doing against the plan".
- The app has no dark theme (color-scheme light); the new colours use the existing light tokens.
