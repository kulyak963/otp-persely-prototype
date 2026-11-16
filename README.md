# OTP Persely prototype (Team 3)

Concept prototype for the OTP Bank × Corvinus service design seminar. It copies the look of the OTP mobile app and adds a new **Persely** tab that helps students save and keeps them with OTP after the Junior package ends at 24.

> Prototype with demo data only. Not a real banking app, not affiliated with or published by OTP Bank. No real accounts, logins or payments.

**Live app:** https://otp-persely-prototype.onrender.com (free plan: the first visit after 15 idle minutes takes about 30–50 seconds). Every push to `main` deploys it again.

**Full guide to every screen and rule:** open [`prototype-guide.html`](prototype-guide.html) (or `/guide.html` on the running app).
**Step-by-step presentation:** [`demo-script.html`](demo-script.html) (or `/demo-script.html`).

## What is inside

- 3.0% a year for every Junior customer, automatically, no sign-up (first 500,000 Ft, 28% tax); 0.01% otherwise
- Payday rule that asks first ("Move 10%?"), weekly transfers, round-ups ×2
- Goals with a date and an honest forecast, shared Persely (2–5 friends), euro Persely
- Weekly streak with a flame and skip weeks; it never changes the rate
- Persi, a 3D green piggy, in the tab and in push notifications
- Monthly and semester stories, insight card on Home, graduation bridge ("Keep my 3.0%")
- Laptop demo panel and real push notifications to an iPhone

## Run it on your computer

Needs [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm start
```

Open http://localhost:8090. On a wide screen the app is shown inside an iPhone frame, with the demo panel on the left. Keys: `U` update day, `J` 8 weeks later, `P` payday, `C` card purchase, `D` Dóri joins, `N` next week, `O` +1 month, `E` end of semester, `G` Junior ends, `M` story, `T` tour, `L` lock, `1`–`8` notifications, `H` hide panel.

Presenter panel for real pushes: http://localhost:8090/push.html (works on the computer running the server).

## Put it online (Render)

The repository has a `render.yaml`, so Render can create the service in a few clicks.

1. Sign in at [render.com](https://render.com) with GitHub.
2. **New → Blueprint**, choose this repository.
3. Render asks for two secret values: `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` (the push keys). Ask Denis for them. `ADMIN_KEY` is created automatically; find it later under **Environment**.
4. Deploy. The app is at `https://<name>.onrender.com`. Every push to `main` deploys again automatically.

Free Render services sleep after 15 minutes without visitors. Open the link a minute before presenting. Phones that turned on notifications register again automatically when the app is opened.

Presenter access on the hosted app: open `https://<name>.onrender.com/?key=ADMIN_KEY` once on the presenting laptop (the panel's "Also send to iPhone" then works), and `…/push.html?key=ADMIN_KEY` for the push panel.

## On an iPhone

Open the link in Safari → Share → Add to Home Screen → open the app from the icon → More → Notifications → Turn on notifications.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole app: styles, screens, rules, onboarding, story, 3D piggy, demo panel |
| `server.js` | Small Node server: serves the app, stores push subscriptions, sends pushes |
| `sw.js` | Service worker: offline cache and notifications. Bump `NAME` after changes |
| `push.html` | Presenter panel for real pushes |
| `manifest.webmanifest`, icons, splash | Home Screen install |
| `three.min.js` | 3D library for Persi |
| `render.yaml` | Render setup |

Never commit `data/` (push keys and subscribed phones). It is in `.gitignore`.

## Working together

- Make a branch, change things, open a pull request; merge to `main` to deploy.
- Where to change what (rates, goal tiles, story texts, Persi's lines, notifications): see the "How to change things" section in `prototype-guide.html`.
- After changing the app, bump `NAME` in `sw.js` so phones pick up the new version.
