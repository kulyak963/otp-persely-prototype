# Simple Persely: Hungarian

Plan: `docs/simple-persely-plan.md` 2g. Decision D14: Hungarian before hallway round 2 (round 1 runs in English).

## Where the strings are
- `js/hu-strings.js` holds two tables:
  - `SP_STRINGS`: every English string of the simple version, by key (first run, the tab, Persi, More, Habits, Rate and safety, goal page, Add money, the Phase 3 pushes, the Phase 4 fixes).
  - `HU`: a Hungarian draft for every key.
- It is **data only**. The app does not read `HU` yet and there is no language switch.
- `spT(key, fallback)` returns the English string. It is there for a later switch; the UI is not wired to it.
- Every value in `HU` is a machine draft: **DRAFT: native speaker and OTP terms to verify**.
  - "Befizetés" (Add money) and "Kivétel" (Withdraw) must match the OTP app's own words.
  - The Rate and safety lines need OTP's own legal text (the plan says "Full text by OTP").
- "Persely" and "Persi" stay as names. Hungarian suffixes go on them as usual ("a Perselyben").

## Placeholders
- The app fills `{amount}` ("1 000 Ft"), `{date}`, `{goal}`, `{n}`, `{month}`, `{rate}`, `{pct}`, `{days}`, `{account}`, `{list}`.
- In Hungarian the suffix comes after the placeholder:
  - `{amount}-ot` gives "1 000 Ft-ot".
  - `{date}-ig` gives "2027. szeptember 10-ig".
- `{month}` in Hungarian is the adjective form ("novemberi"), so "Itt a {month} történeted." reads "Itt a novemberi történeted."
- The article "a" or "az" depends on the first sound of the word after it ("az 1. hét", "a 4. hét", "az Utazás"). The drafts avoid an article before a placeholder where they can. A switch must pick the article in code.

## Formats
| What | English | Hungarian |
|---|---|---|
| Decimal | 3.0% | 3,0% (decimal comma) |
| Date | 10 September 2027 | 2027. szeptember 10. |
| Date with "until" | until 10 September 2027 | 2027. szeptember 10-ig |
| Money | 1 000 Ft | 1&nbsp;000&nbsp;Ft (non breaking spaces: the number and "Ft" never split over two lines) |
| Week | Week 4 | 4. hét |

The app's `ft()` uses plain spaces today. A Hungarian switch should use `ft(n).replace(/ /g, ' ')`.

## The proxy for reading ease
FK (Flesch-Kincaid) does not work for Hungarian. The team uses a proxy. It is team-chosen, **not a validated index**:
1. 8 words or fewer per sentence.
2. At most 1 word over 12 letters per sentence ("Betétbiztosítás" is one).
3. A native speaker reads every string aloud before a test.

`chk-simple-hu-keys` checks rules 1 and 2 on the strings people see at a glance: Persi, first run, the tab, the honesty line, Add money and More. The Rate and safety, goal page and Habits drafts are longer. They need the read-aloud check and OTP's text.

## What `chk-simple-hu-keys` checks
- Every `SP_STRINGS` key has a `HU` value, and none is empty.
- "Persely" and "Persi" stay in the Hungarian text.
- The `{placeholders}` are the same in both.
- No "3.0%" style decimal point and no English month names in `HU`.
- The proxy rules 1 and 2 on the glance strings.
- Every sentence Persi can say (`persiLine`) is a registered string.
- The table carries the draft marker.

## Before a Hungarian test
- A native speaker reads every string aloud and fixes it in `HU`.
- OTP gives the product words (Befizetés / Kivétel, Junior, Betétbiztosítás) and the Rate and safety text.
- Test the layouts with Hungarian text. It runs longer than English (the tab must still fit 390 x 844 with no scroll).
