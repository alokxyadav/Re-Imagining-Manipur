# Re-Imagining Manipur — Imphal Travel Guide

A working prototype travel guide built for the **Re-Imagining Manipur Hackathon 2026** (World Tourism Day, organised by the Dept. of Information Technology and Dept. of Tourism, Govt. of Manipur, with ManipurTech Innovation Foundation as knowledge partner).

**Live demo:** add your GitHub Pages URL here once deployed.

---

## Deploy in 2 minutes

**Easiest (no GitHub, no install):** use `manipur-site-upload.zip` from the download. It already contains only the site files.
1. Unzip it.
2. Go to **app.netlify.com/drop** and drag the unzipped folder onto the page.
3. Sign in when asked (free) so the site is kept, then open the link Netlify gives you.

Cloudflare Pages ("Direct Upload") and any static host work the same way: upload the folder contents. Because that build has no site address baked in, it leaves out the canonical link, share image and sitemap. To include them, run `npm install && npm run build -- https://your-site-address` and upload the new `dist/` folder.

**GitHub Pages (updates on every push):** see [Deploying to GitHub Pages](#deploying-to-github-pages). The workflow tests, builds with your real address, and publishes.

## Quick start

**Run it locally — no install, no build step:**
```bash
git clone https://github.com/<your-username>/re-imagining-manipur.git
cd re-imagining-manipur
python3 -m http.server 8000
# open http://localhost:8000
```
Or just double-click `index.html` to open it directly in a browser (the service worker and calendar export need a real server or `https://` to fully work — see [Local development](#local-development)).

**Deploy it for free on GitHub Pages:** see [Deploying to GitHub Pages](#deploying-to-github-pages) below — five steps, auto-deploys on every push via the included GitHub Actions workflow.

---

## Features

**Guide (`index.html`)**
- 14 curated places around Imphal — searchable, filterable by category, each with an original bespoke illustration (no stock photography, so zero copyright exposure)
- Trip planner: pick days + interests, get a generated day-by-day schedule, a budget estimate, and one-click curated circuits
- **Add to calendar** (`.ics` download) and **Print / Save as PDF** for the generated itinerary
- **Packing checklist** with progress saved on-device
- **Emergency & safety contacts** — India-wide helplines plus the regional tourism office
- Verified hotel directory — five real Imphal properties, tap-to-call booking
- Getting around: real airport transport costs and a distance/travel-time table
- History timeline, culture & cuisine notes, an FAQ covering Inner Line Permit requirements
- Festival-dates notice ticker with sourced 2026 dates
- Traveller reviews — seeded examples plus a working submission form
- WhatsApp share for your saved trip list, and a self-referencing QR code in the footer
- Accessibility toolbar — text scaling + high-contrast mode
- Sign in / Register, tied into the review form
- **Installable (PWA)** — add to home screen, works offline for previously visited pages
- Light/dark theme toggle, scroll-spy navigation, mobile menu

**Admin panel (`admin.html`)**
- Passcode-gated dashboard for managing hotel listings and moderating reviews
- Live stats: hotels listed, traveller notes, registered accounts, current trip size

## ⚠️ What's real and what's a demo

This is a **static, front-end-only site** — no server, no database.

- **Sign in** uses an emailed 6-digit code (see *Email verification* below). With no email service connected it runs in **demo mode**: the code is generated in the browser and shown on screen, which proves nothing about the email address and is **not secure**.
- **`admin.html`** is gated by a passcode visible in the page's own source (`manipur2026`) — it demonstrates an admin workflow, not real access control.
- All data (accounts, reviews, saved trips, admin-added hotels, packing checklist) lives **only in one browser, on one device**. `index.html` and `admin.html` only share data when deployed to the **same origin**.
- User-submitted content is HTML-escaped before rendering, closing the stored-XSS path between a public review and the admin panel that reads it.
- The **calendar export** schedules your trip starting next Monday as a placeholder — there's no date picker, so adjust the dates after importing into your calendar app.
- The **service worker** only activates once deployed with `sw.js` reachable at the same path (e.g. on GitHub Pages) — it's a no-op anywhere `sw.js` isn't served, including most live-preview sandboxes.

**To make any of this real**, wire the same UI to a backend — Supabase, Firebase, or a small custom API are the fastest paths. Say this plainly in a hackathon pitch — judges tend to reward the honest version over a prototype dressed up as finished infrastructure.

## Deploying to GitHub Pages

This repo ships a GitHub Actions workflow (`.github/workflows/deploy.yml`) that deploys automatically on every push to `main`.

1. **Create a new repository** on GitHub (e.g. `re-imagining-manipur`).
2. **Push this folder** to it:
   ```bash
   git init
   git add .
   git commit -m "Initial commit — Re-Imagining Manipur hackathon prototype"
   git branch -M main
   git remote add origin https://github.com/<your-username>/re-imagining-manipur.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**, and under **Build and deployment → Source**, choose **GitHub Actions**.
4. The push already triggered the workflow — check the **Actions** tab. Your site publishes at `https://<your-username>.github.io/re-imagining-manipur/` within a minute or two.
5. **Nothing to edit for the URL** — the workflow swaps the placeholder link in `index.html`, `robots.txt` and `sitemap.xml` for your real GitHub Pages address on every deploy. (On Netlify or another host, replace `your-username.github.io/re-imagining-manipur` in those three files yourself.)
6. Visit `/admin.html` on your published site to confirm it shares `localStorage` with `index.html` — add a hotel there, then check it appears on the main page in the same browser.

**Prefer the simpler branch-deploy method?** Delete `.github/workflows/deploy.yml`, then in Settings → Pages set Source to "Deploy from a branch", branch `main`, folder `/ (root)`.

**Using a custom domain instead of `github.io`?** Add a `CNAME` file containing just your domain, point your DNS at GitHub's Pages IPs, then set it under Settings → Pages → Custom domain.

## Local development

No build step. Two ways to run it:

```bash
# Option A — Python (built into most systems)
python3 -m http.server 8000

# Option B — Node, if you have it
npx serve .
```
Then visit `http://localhost:8000`.

**Why not just double-click `index.html`?** Two features need a real server (or `https://`) to work: the Web Crypto password hashing and the service worker both require a "secure context" (`https://` or `localhost`), which a bare `file://` URL isn't. Everything else works fine opened directly — password hashing falls back to a clearly-marked insecure mode, and the service worker registration just silently no-ops.

## File structure

```
.
├── .github/workflows/deploy.yml   # auto-deploy to GitHub Pages on push
├── index.html                     # the public-facing guide
├── admin.html                     # companion admin panel
├── manifest.json                  # PWA manifest (installable, app icon, theme color)
├── sw.js                          # service worker — offline app-shell caching
├── icon.svg                       # app icon, referenced by manifest.json and favicons
├── 404.html                       # custom not-found page matching the site's design
├── robots.txt                     # SEO
├── scripts/build.js               # builds dist/: 14 static place pages, sitemap, real URLs
├── LICENSE                        # MIT — update the copyright holder name
├── CHANGELOG.md                   # build history
└── README.md                      # this file
```

### A note on the app icon

`icon.svg` is used as-is in the manifest and works in essentially all modern browsers (Chrome, Edge, Firefox, and recent Safari all support SVG manifest icons). If you need PNG fallbacks for older Android/iOS home-screen rendering, export `icon.svg` at 192×192 and 512×512 using any vector tool (Inkscape, Figma, or `npx svgexport icon.svg icon-512.png 512:512`) and add matching entries to `manifest.json`.

## Email verification (free OTP)

Sign-in and account creation both require a 6-digit code sent to the user's email. A static page cannot send or check codes securely on its own, so live mode uses **Supabase Auth** (free tier), where the server emails and verifies the code.

1. Create a free project at supabase.com.
2. **Authentication → Providers**: make sure *Email* is enabled.
3. **Authentication → Email Templates**: edit the *Magic Link* and *Confirm signup* templates so the body contains `{{ .Token }}` (this puts the 6-digit code in the email).
4. **Authentication → SMTP Settings**: Supabase's built-in sender is only for testing and is heavily limited. For real users, connect a free SMTP provider (for example Brevo or Resend).
5. **Project Settings → API**: copy the *Project URL* and the *anon public* key into `AUTH_CONFIG` at the top of the auth section in `index.html`. Never put the `service_role` key in the page.
6. Set `allowDemo: false` in `AUTH_CONFIG` so the on-screen demo code can never appear on your live site.
7. Redeploy. The "Demo mode" notice disappears and codes are emailed.

Limits to be aware of: the demo-mode code check runs in the browser and can be bypassed; the rest of the app (reviews, trips, admin) still stores data per browser, so a verified email does not yet sync across devices.

## Search (SEO)

What is built in: an indexable home page with a concise title and description, one **static page per place** (own title, description, schema.org `TouristAttraction` data, breadcrumbs, links to the other places), a generated `sitemap.xml`, canonical links, and a share image. These give search engines real, separate pages to rank for searches like each place's name.

Nobody can promise a first-place ranking. After you deploy: (1) add the site to **Google Search Console** and **Bing Webmaster Tools** and submit `/sitemap.xml`; (2) add your own photos with descriptive `alt` text; (3) get links from local sites such as tourism pages, hotels and community groups; (4) keep the facts current. Ranking takes weeks and depends on competition.

## Tests & CI

`npm install && npm test` runs `tests/smoke.js`: it loads the guide and admin page in a simulated browser and checks rendering, the trip counter, search, email-code sign-in, the `allowDemo` switch, and that hostile saved data is shown as plain text. The deploy workflow runs these first and **stops the deploy if any check fails**, then publishes only the site files (not `tests/` or `node_modules/`). Using Netlify Drop? Drag the folder in before running `npm install`, or drag just the site files.

## Before you launch

Replace `[contact email]` in `privacy.html` and `terms.html` with a real address. These pages describe what the prototype actually does; have them reviewed if you collect real user data.

## Production notes

- `_headers` sets security headers (CSP incl. `frame-ancestors`, nosniff, referrer and permissions policies) on Netlify. GitHub Pages cannot send custom headers, so the page's CSP meta tag is the fallback there.
- `.nojekyll` stops GitHub from processing files with Jekyll if you use branch-deploy.
- The deploy workflow validates `manifest.json` and fails the build if any placeholder URL is left.
- `og-image.png` is the social-preview image used by `og:image`; replace it with your own artwork any time (keep 1200×630).

## Credits & sources

- Hotel names, room counts and phone numbers: Imphal East district administration's public accommodation directory.
- Airport transport costs and Inner Line Permit process: Imphal Airport authority and the Manipur ILP portal.
- Festival dates: publicly published 2026 Manipur government holiday calendars.
- Emergency numbers: standard all-India helplines (police 100, ambulance 108, fire 101, women's helpline 1091) and the Incredible India tourist infoline.
- Design patterns referenced from the public tourism sites of Manipur, Nagaland, Delhi, Bihar, and Kerala (India's top-ranked state tourism site) — accessibility toolbar, distance charts, notice tickers, destination filtering, hotel/homestay directories.

This is an **independent hackathon prototype**, not an official government publication. Verify opening hours, fees, and permit rules directly with official sources before travelling.
