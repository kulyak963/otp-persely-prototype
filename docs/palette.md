# Colour palette

One palette for the whole prototype. The tokens live in `:root` at the top of `index.html`. JavaScript reads the same tokens once into `PALETTE` (top of the main script), so the category ring, plan buckets, friends, Persi (flat and 3D), the streak flame and the story backgrounds all use these values. `mixHex(token, k)` makes tints (k > 0, towards white) and shades (k < 0, towards black) from a token, for example Persi's belly and the story gradients.

Rules

- `-t` colours are for text. They pass WCAG AA (4.5:1) on white and on their own `-l` fill.
- `--green`, `--orange`, `--blue`, `--yellow`, `--red` and the `--c-*` colours are for bars, rings, icons, dots and fills. Never use them for small text on white.
- Grey text is `--muted-t` or `--ink2`. `--muted` is for decoration only.
- Do not type a colour anywhere else. In CSS and inline styles use `var(--token)`. In SVG attributes and three.js use `PALETTE.name` (camelCase of the token, for example `PALETTE.greenI`).
- `window.__checkAnalytics()` includes `chk-palette`: outside `:root` the stylesheet may hold at most 8 distinct colour literals, all from the exception list below, every `PALETTE` value must be a `#RRGGBB`, and the 9 spending categories must have 9 different colours.

## Neutrals

| Token | Value | Use | On white |
| --- | --- | --- | --- |
| `--card` | #FFFFFF | Cards, sheets, tab bar | |
| `--white` | var(--card) | White text and glyphs on colour, white rings | |
| `--ink-on-dark` | var(--white) | Text on dark surfaces | |
| `--bg` | #EEF0F5 | App background, theme-color, splash | 1.14 |
| `--fill` | #E9ECF1 | Chips, pills, step buttons, tracks on `--bg` | 1.18 |
| `--line` | #E2E5EB | Borders, dividers, ring and bar tracks on white | 1.26 |
| `--line-2` | #C9CED6 | Strong lines: switch off track, sheet handle, radio ring, off dots, input underline | 1.58 |
| `--muted` | #8C919B | Decoration only (sleepy z, Old account bar, unknown category) | 3.16 |
| `--muted-t` | #62676F | Secondary text (4.99 on `--bg`, 4.81 on `--fill`) | 5.69 |
| `--ink2` | #4A505A | Section titles, captions on grey, slate category | 8.12 |
| `--ink` | #2B3038 | Body text, toast and note background, status bar | 13.27 |

## Green

| Token | Value | Use | On white |
| --- | --- | --- | --- |
| `--green` | #52AE30 | Bars, rings, progress, Persi's body, Saving bucket | 2.82 |
| `--green-i` | #43982A | Icons and fills with a white glyph (non text 3:1) | 3.64 |
| `--green-d` | var(--green-i) | Old name, kept | |
| `--act` | #2F7A1B | Buttons with text, green text (white on it 5.36) | 5.36 |
| `--green-t` | var(--act) | Green text | 5.36 |
| `--act-d` | #286A17 | Pressed state, card gradient end, 3D pig slot | 6.64 |
| `--green-dk` | #1E5410 | Dark green surfaces: story, story thumbs (white on it 9.0) | 9.01 |
| `--green-lt` | #8FDB6B | Green on dark surfaces (toast Undo 7.9 on `--ink`), Persi's snout | 1.68 |
| `--green-l` | #EAF5E4 | Light green fills, selected options (`--act` on it 4.76) | 1.12 |

## Orange, blue, yellow, red

| Token | Value | Use | On white |
| --- | --- | --- | --- |
| `--orange` | #F07D19 | Streak, flame, Fun bucket, new story ring, travel category (`--ink` on it 4.84) | 2.74 |
| `--orange-lt` | #FFB37A | Orange on dark surfaces, streak at risk ring (5.1 on `--green-dk`) | 1.75 |
| `--orange-l` | #FDEDE0 | Warm fills: late notes, blocked card, skipped day | 1.14 |
| `--orange-t` | #A94F08 | Orange text, Delete buttons (4.82 on `--orange-l`) | 5.51 |
| `--blue` | #4D9BD6 | Everyday essentials bucket | 3.01 |
| `--blue-i` | #3A86C4 | Blue icons, Savings account bar | 3.90 |
| `--blue-t` | #2467A0 | Blue text, Must-pay bucket (5.2 on `--blue-l`) | 5.96 |
| `--blue-l` | #E6F1FA | Light blue fills | 1.15 |
| `--yellow` | #C9971B | Card chip, a friend colour | 2.65 |
| `--yellow-t` | #7A5A00 | Yellow text (5.66 on `--yellow-l`) | 6.38 |
| `--yellow-l` | #FBF1D2 | Light yellow fills | 1.13 |
| `--red` | #FF5A5F | Red marks, food category, Persi's cheeks (never text) | 3.05 |
| `--red-t` | #B42318 | Error and warning text (5.76 on `--red-l`) | 6.57 |
| `--red-l` | #FDECEC | Warning fills | 1.14 |

## Spending categories

Bright and told apart by hue. Never text.

| Token | Value | Category |
| --- | --- | --- |
| `--c-blue` | #2F6BFF | Groceries, mixed essentials |
| `--c-cyan` | #00AEEF | Education |
| `--c-violet` | #8B5CF6 | Transport, Investing |
| `--c-mint` | #12C29A | Health |
| `--c-coral` | var(--red) | Food, mixed fun |
| `--c-pink` | #FF3EA5 | Shopping |
| `--c-yellow` | #FFB800 | Entertainment, Persi's sparkles, flame core |
| `--c-orange` | var(--orange) | Travel |
| `--c-slate` | var(--ink2) | Subscriptions |

## Derived in JS (from tokens, not typed)

- Story slide backgrounds (`ST_BG`): green `--green-dk` to `--act`, blue `--blue-t` to `--blue-i`, and orange, violet, mint and pink from `--orange`, `--c-violet`, `--c-mint`, `--c-pink` (55% to black at the top, 20% to black at the bottom).
- Persi (`PIG`, used by the flat SVG and the 3D pig): body `--green`, legs and ears `--green-i`, belly `--green` 12% lighter, slot `--act`, snout `--green-lt`, nostrils `--green-dk`, eyes and mouth `--green-dk` 35% darker, cheeks `--red` 40% lighter, sparkles `--c-yellow`. 3D lights use `--white` and `--green-l`.
- Friends and shared goal members: `--blue-i`, `--c-pink`, `--yellow`, `--c-coral`, `--c-mint`, `--green-i`, `--c-violet`, `--blue-t`; you are `--orange`.

## Documented exceptions (literal on purpose)

| Literal | Where | Why |
| --- | --- | --- |
| #EB001B, #F79E1B | Card art, Mastercard circles | Third party brand colours |
| #A5A29C, #6B6863, #55524E | Desktop iPhone frame and side buttons | Device hardware, not app UI |
| #000 | iPhone bezel, Dynamic Island, mask images, lock screen and story shading | Pure black for hardware and masks |
| rgba() with alpha | Shadows and scrims | Neutral transparency, no hue |
| #EEF0F5 | `theme-color` meta and the web manifest | Must be a literal there; equals `--bg` |

## Other pages

- `push.html` uses `--bg`, `--card`, `--ink`, `--muted` (= `--muted-t` #62676F), `--green` for the hover ring and `--green-t` #2F7A1B for green text and the button.
- `demo-script.html` and `prototype-guide.html` light theme: `--bg` #EEF0F5, `--surface` #FFFFFF, `--ink` #2B3038, `--muted` #62676F, `--line` #E2E5EB, `--green` #2F7A1B (text), `--green-soft` #EAF5E4, `--key` #E9ECF1, `--flame` #F07D19 (script, border only) or #A94F08 (guide, text), `--flame-soft` #FDEDE0.
- Their dark theme uses the same hues: `--bg` #1A1D22 (`--ink` 40% darker), `--surface` #2B3038, `--ink` #EEF0F5, `--muted` #C9CED6, `--line` and `--key` #4A505A, `--green` #8FDB6B, `--green-soft` #1E5410, `--flame` #FFB37A, `--flame-soft` #6C380B (`--orange` 55% darker).
