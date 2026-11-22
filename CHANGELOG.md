# Changelog

All notable changes to this prototype, newest first.

## v23 \u2013 Found by looking at every section
- Fixed raw `\u2019` codes showing as text on the guide and admin pages, a stale "13 places" count, and overlapping map labels.
- Dark mode: green, brown, teal and red text was nearly invisible on the dark background; it now uses lighter accent tones.
- Replaced two odd-looking animal icons with a simple antler drawing and removed a stray plus sign from the lake icon.
- New checks fail the build if raw escape codes appear in visible text or the place count drifts.

## v22 \u2013 Search pages and helplines
- Home page is now indexable (the leftover `noindex` is gone; the admin page stays `noindex`).
- The build writes one static page per place with unique titles, descriptions, schema.org data and breadcrumbs, plus a full sitemap with dates.
- Emergency section grows from 6 to 12 numbers (112, child, cyber crime, senior citizens, road accident, disaster relief), checked against the national helpline directory.

## v21 – Fixed in a real browser
- Checked the pages in a real Chromium at phone and desktop widths. Fixed: top bar overflowing on phones (now two rows), top bar labels wrapping on desktop, a six-line hero headline, the hero picture clipped into a rectangle, the floating taxi button covering the intro (it now appears after scrolling), the ticker's stray space before the comma, and a console warning from `frame-ancestors` in a meta tag (kept in `_headers`, where it works).

## v20 \u2013 CSS fix
- Fixed a broken rule: the round theme, search and accessibility buttons had lost their selector and were unstyled. Added a CSS brace-balance test for every page.

## v19 \u2013 Easy deploy
- Added `scripts/build.js` (`npm run build`): produces a clean `dist/` with the real site URL, or without URL-dependent tags when none is given. The deploy workflow now uses it.
- Added a ready-to-upload ZIP containing only the site files, with a 2-minute deploy section at the top of the README.
- Tests check the build never leaves a placeholder URL behind.

## v18 \u2013 Less template, more product
- Removed invented testimonials: reviews now start empty and only show notes people actually write.
- Added Privacy and Terms pages (linked in the footer; replace the `[contact email]` placeholder before launch).
- Removed em dashes from all copy, colored left stripes, sparkle icons, card hover lift, arrow glyphs, pill shapes and heavy shadows; tightened corner radius; swapped pure white for a warm paper tone.
- Added a 10 second timeout on sign-in requests and a small on-device script error log (shown on the admin page).
- Tests now fail if an em dash returns or the legal links go missing.

## v17 — Tests in CI
- Added `tests/smoke.js` (15 checks) and `package.json`. The deploy workflow now runs them before publishing and uploads only the site files.

## v16 — Share previews & contrast
- Added a 1200×630 social-preview image and the og:image / twitter:image tags (URLs are rewritten by the deploy workflow).
- Checked text contrast against WCAG AA across the palette; lightened the notice-ticker highlight text, the only pair that fell just under 4.5:1.

## v15 — Demo-mode switch
- Added `allowDemo` to the auth config. Set it to `false` in production and sign-in refuses to run without a connected email service, instead of showing the code on screen.

## v14 — Email OTP sign-in
- Replaced username/password with email verification: enter email, receive a 6-digit code, verify. Resend cooldown, attempt limit, expiry check.
- Live mode uses Supabase Auth (free); demo mode (no keys) shows the code on screen and is clearly labelled as not secure.
- CSP and `_headers` now allow connections to `*.supabase.co`.

## v13 — Error sweep
- Ran an HTML validator, anchor/duplicate-id checks and a simulated-browser test over every page. Fixed unescaped ampersands, phone-number line breaks, untyped inputs and a password-field autocomplete flag.
- Fixed an admin bug: after the reviews or users table showed its empty message, the table could not redraw when data appeared. Verified with injected script payloads that nothing executes on either page.

## v12 — Deployment hardening
- Deploy workflow now validates the manifest and automatically writes the real Pages URL into the canonical tag, robots.txt and sitemap.
- Added `_headers` (security headers for Netlify) and `.nojekyll`.

## v11 — Accessible-travel prompts
- Added an accessible-travel checklist under the hotel directory: the questions to ask before booking, since no verified per-place accessibility data is held.

## v10 — Travel smart
- New "Travel smart" section: country-style essentials (language, currency, time zone, electricity, emergency), a 12-month season guide (defaults to the current month), and a suggested responsible-travel code for Loktak, markets and temples.

## v9 — Personal tools
- Per-place private notes (saved on-device) and a copy/share link in every place view.
- Back up / restore your saved data as a JSON file from the trip drawer (accounts and newsletter emails are deliberately excluded).
- Install-app button (when the browser offers it) and online/offline notices.

## v8 — Planning power
- 30-second trip quiz: two questions build a ready itinerary.
- Travellers count in the budget estimator (rates are per person).
- Shareable trip links: WhatsApp share now includes a `#trip=` link that restores the saved list when opened.

## v7 — Power features
- Global search palette (press `/` or Ctrl/Cmd+K, or the nav search button) across places, hotels, FAQs and sections, with keyboard navigation.
- Deep links: opening a place sets `#place=<id>`, and loading a URL with that hash opens it directly.
- Sort control for places (A→Z, shortest/longest visit); toast messages replace browser alerts.
- Fixed an inconsistency: Khonghampat orchid bloom is now stated as April–July everywhere.

## v6 — Feature completeness pass
- Added an installable PWA layer: `manifest.json`, `icon.svg`, and `sw.js` (offline app-shell caching, network-first with cache fallback). Registration is feature-detected and silently no-ops in environments that don't serve `sw.js` (e.g. the live-preview sandbox), so nothing breaks outside a real deployment.
- Added an **Emergency & safety** section — India-wide helplines (police, ambulance, fire, women's helpline, tourist infoline) plus the Manipur Tourism office, each tap-to-call.
- Added a **packing checklist** — four categories of trip-specific items, checkbox state persisted per device.
- Added **calendar export**: the generated itinerary can now be downloaded as a `.ics` file (starting next Monday as a placeholder date, clearly labelled) and imported into Google/Apple/Outlook calendars.
- Extended the CSP to explicitly cover `worker-src` and `manifest-src` for the new service worker and manifest.
- Rewrote the README with a Quick Start section answering "how do I run this" in the first screen, plus a note on why `file://` alone won't exercise every feature.

## v5 — Accessibility, headers & static-site completeness
- Added a real `<main>` landmark and a visible-on-focus skip-to-content link — the page had none before, a genuine WCAG gap.
- Added focus management: opening the review modal, auth modal, or trip drawer now moves focus in and traps Tab inside it; closing returns focus to whatever triggered it.
- Added a Content-Security-Policy meta tag restricting script/style/font/connect sources to an explicit allow-list, with an honest comment on its limits (inline JS means `unsafe-inline` is required, so this is defense-in-depth, not a substitute for output escaping).
- Added a real favicon (inline SVG data URI) to both pages — previously only the Artifact preview's favicon param supplied one, which wouldn't exist once self-hosted on GitHub Pages.
- Added a custom `404.html` matching the site's design system.
- Fixed a stale doc string that still claimed passwords were "stored in plain text" after v4 switched to SHA-256 hashing.
- Added client-side length and value clamping (review text/name, admin hotel fields, star ratings) as defense-in-depth against a corrupted or bypassed form.
- Hardened `robots.txt` with an explicit `Disallow: /admin.html`, on top of its own `noindex` meta tag.

## v4 — Security & completeness pass
- Fixed a stored-XSS path: user-submitted review and admin-hotel content was rendered via unescaped `innerHTML`, meaning a malicious review could execute script in the admin panel when moderated. Added an `escapeHtml()` pass on all user-controlled render paths in both `index.html` and `admin.html`.
- Passwords now hashed with SHA-256 (`crypto.subtle`) before storage, instead of plaintext. Added username/password format validation.
- Wired up three UI elements that had markup but no behaviour: one-click itinerary circuits, print/save-as-PDF for itineraries, WhatsApp trip sharing, and the footer QR code.
- Added a GitHub Actions workflow for automatic Pages deployment.

## v3 — Accounts, admin, SEO, GitHub packaging
- Added client-side Sign in / Register (clearly labelled as a front-end demo, not real auth).
- Added a companion `admin.html` — passcode-gated hotel/review management with a stats dashboard, sharing `localStorage` with the public guide on the same origin.
- Added JSON-LD structured data, Open Graph/Twitter meta tags, canonical link, `robots.txt`, `sitemap.xml`.
- Packaged the project for GitHub with a README, LICENSE, and `.gitignore`.

## v2 — Design & content reference pass
- Reviewed Manipur, Nagaland, Delhi, and Bihar's official tourism sites and pulled in real patterns: an accessibility toolbar, a notice/event ticker with sourced festival dates, a distance/travel-time table, and a verified hotel directory.
- Added a real "Getting around" section with sourced airport transport costs and a tap-to-call taxi contact.
- Rebuilt the colour system on a white base with a deliberate Manipur-referenced palette; added a manual light/dark toggle, working mobile menu, and scroll-spy navigation.
- Replaced generic card art with bespoke original SVG illustrations per landmark.

## v1 — Initial build
- First working version: 12 curated places with search/filter, an itinerary planner with a budget estimator, an illustrated orientation map, a history timeline, and a culture/cuisine section — built for the Re-Imagining Manipur Hackathon 2026 brief.
