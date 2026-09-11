# Notes for the agent building a variant — read after PORTFOLIO-BRIEF.md

Written 2026-09-09 by the lead agent after a clarification round with Pranav. These are his answers,
verbatim in spirit. They override the brief where they differ.

## What Pranav said, this round

- **Surprise him.** "Each agent needs to surprise me — but also keep and maintain the ask roughly as I
  ask. Iterate over the design and polish as you like. Do not direct — let all variants take on as they
  like on their own." He asked that every agent be told explicitly: **believe in yourself, have
  conviction, design.** The brief is "a detailed guide as to how I want it", not a list of hard
  limits. Where you have a better idea that still serves the guide, do it and defend it.
- **Room fidelity is your call.** Flat SVG, CSS, three.js — "or more, surprise me." `three`,
  `@react-three/fiber` and `@react-three/drei` are already installed. Do not install anything else.
- **The room is the footer, not a section.** "The room is basically the footer in my webpage — not a
  SECTION — and it's not a hard limit, so do not worry." The four-screen budget is a guide, not a gate.
- **On a phone, the room drops the duplicated stuff** (projects, experience, papers screens) and
  **keeps the personal objects**: posters, books, games shelf, magnets, family photo, football, trophies,
  window.
- **Each variant writes its own copy.** Rewrite the site's wording in plain first person, as him. Keep
  every metric, date, venue, status, link and image path true to `src/data/`.
- **Pick the best five to eight projects yourself** from `src/data/projects.js`.
- **Trophies: MIT XR 2024 and HINT 5.0 only.**
- **Resume: find a place for it, no need to wire it** — a link to `/resume` is enough.
- **Personal content: place sample content so he can see what it will eventually look like.** He has
  not told us his books, films, games, magnet memories or the family-photo caption. Put obviously
  sample entries in — real, well-known titles are fine — and mark them visibly as samples in the UI
  and in the data file. Never present a sample as his actual favourite.
- **Light palette. The sky is the theme.** No dark mode, no theme switch.
- **Sky driven by scroll position only**, still at rest.
- **No screenshots or comparison verdicts are wanted.** What matters: it runs, it compiles, it is yours.

## Mechanics — these are hard

- **Repo root for you:** `portfolio/` inside this worktree. `node_modules` is installed.
- **Your folder only:** `src/variants/vN/` (N is your number). Put everything there: components, CSS,
  your copy file, your personal-data file, SVG assets. **Do not edit any other file.** Not `App.js`
  (already routes `/vN` to your `src/variants/vN/index.js` default export), not `index.css`, not
  `src/data/*`, not `src/components/*`, not `package.json`.
- **Do not run git.** The lead commits your folder when you report done.
- **Dev server:** `PORT=300N npm start` from `portfolio/` (v3 → 3003, v4 → 3004). Never kill node
  processes you did not start; other agents are running theirs. Stop your own when done.
- **Compile check before you report:** `CI=false npx react-scripts build` must succeed. Warnings are
  fine, errors are not.
- **Global CSS leaks into your route.** `src/index.css` sets `body { background:#0a0a0a; color:#f5f5f5;
  font-family: Roboto }`, `h1-h6 { margin-bottom }`, `p { margin-bottom }`, `a { color: #3d5afe }`,
  `img { display:block }`. Scope everything under your root class and reset what you need. Set body
  background by adding a class to `document.body` in a `useEffect` and removing it on unmount.
- **Fonts:** load Google Fonts with a `<link>` injected in a `useEffect`, or `@import` at the top of
  your CSS file. Choose deliberately; do not reuse Roboto/Inter/Press Start 2P from the current site.
- **Data quirks:** `projects.js` lists `snakeai-mlops` twice — dedupe by id. `mainImage` paths have no
  leading slash — pass them through `getImageWithFallback`. `experience.js` and `publications.js`
  paths already have a leading slash or none; check before you render. `game_design/van gogh.jpg` is
  400×400 — never render it above ~380px. Every other screenshot is landscape.
- **Never write** "Execution Decision Layer", "five verdicts", or "deterministic risk scoring". Filter
  the fourth Alfred_ bullet and the Alfred_ `projects` entry out at render time. Do not edit the data
  file to do it.
- **Readability gate:** body ≥15px, line-height ≥1.55, ≤70 characters per line, contrast ≥4.5:1, text
  never directly on the sky or on a screenshot. Visible keyboard focus. `prefers-reduced-motion`
  respected.
- **Assets:** screenshots live in `public/assets/images/{ai_ml,game_design,misc,achievements,companies}`.
  Refer to them by absolute path from `/assets/...`. Achievement images: `achievements/mit.png`,
  `achievements/hint.png`.
- **Links:** GitHub `https://github.com/PranavMishra17`, LinkedIn `https://www.linkedin.com/in/pranavgamedev/`,
  Hugging Face `https://huggingface.co/Paranoiid`, Alfred_ `https://get-alfred.ai/`, emails in `contactInfo`.

## When you report back

Three short paragraphs: what your variant's single idea is and why, what you decided where the brief
was silent, and anything you left unfinished or would do next. State that the build passed. No
screenshots.
