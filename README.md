# Portfolio — Pranav Pushkar Mishra

Founding LLM Engineer @ Alfred\_. Single-page React portfolio with a built-in arcade mini-game and a few opinions baked in. No backend; everything that looks live runs on free third-party endpoints.

![Preview](./preview.png)

## What's in it

- **Sections** — About · Work Experience modal · Research / Publications · AI · ML, Game Design, Misc project galleries
- **Live view counter** in the header — abacus.jasoncameron.dev, no backend
- **Live resume** fetched from a sibling GitHub repo, with a local-PDF fallback
- **Prompt Patrol** — a mouse-only LLM-themed shooter with a real global leaderboard

## Stack

React 19 · react-router 7 · framer-motion 12 · react-scripts 5 · plain CSS · Canvas 2D + Web Audio API for the game · getpantry.cloud for the leaderboard · abacus.jasoncameron.dev for the view counter. No server.

## File structure

```
portfolio/
├── public/
│   ├── assets/images/
│   │   ├── {ai_ml,game_design,misc}/        # project art
│   │   ├── companies/heros/                 # workspace photos for exp modal
│   │   └── default/                         # category fallbacks
│   └── resumes/{ai,game}/                   # drop any .pdf here
├── scripts/
│   └── generate-resume-manifest.js          # runs via prestart / prebuild
└── src/
    ├── data/
    │   ├── projects.js                      # all project entries + bio + contactInfo
    │   ├── experience.js                    # work history
    │   └── publications.js                  # research papers
    ├── components/
    │   ├── ExperienceModal.{js,css}         # workspace-bay launcher modal
    │   ├── ProjectCard.{js,css}
    │   ├── PublicationsSection.js
    │   ├── ResumeViewer.{js,css}            # GitHub-live PDF + local fallback
    │   ├── ConnectSlate.{js,css}            # floating socials slate
    │   ├── TrophyButton.{js,css}            # achievements pop-up
    │   ├── ParticleBackground.js            # About-section canvas
    │   ├── ViewCounter.{js,css}             # header view-count pill
    │   ├── MiniGame.{js,css}                # Play CTA + game host modal
    │   └── game/                            # Prompt Patrol
    │       ├── PromptPatrol.{js,css}        # React wrapper, title, game-over
    │       ├── engine.js                    # physics, spawn, scoring, state
    │       ├── sprites.js                   # canvas draw helpers
    │       ├── config.js                    # tunable numbers
    │       ├── phrasebook.js                # token text per class
    │       ├── audio.js                     # Web Audio SFX synth
    │       ├── leaderboard.js               # Pantry submit / fetch
    │       └── profanity.js                 # tag-name banlist (base64)
    ├── MainPortfolio.js                     # top-level page
    └── App.js                               # routes: "/" and "/resume"
```

Architecture details and the "where do I edit X" map live in [CLAUDE.md](./CLAUDE.md).

## Quick start

```bash
cd portfolio
npm install
cp .env.example .env.local        # fill the values — see below
npm start                         # http://localhost:3000
```

Other scripts (run from `portfolio/`):

| script | what it does |
|---|---|
| `npm run build` | Production build. Bash sets `CI=false`; on Windows CMD use `set CI=false && npx react-scripts build`. |
| `npm run resume-manifest` | Scans `public/resumes/{ai,game}/` and writes `manifest.json`. Auto-runs on `prestart` / `prebuild`. |
| `npm test` | Jest via react-scripts. |
| `npm run check` | `npm install && npm run build` — CI sanity check. |

## Environment variables

| var | purpose |
|---|---|
| `REACT_APP_VIEW_OFFSET` | Added to the raw API counter so the header pill starts at a chosen baseline. Default 0. |
| `REACT_APP_PANTRY_ID` | UUID from [getpantry.cloud](https://getpantry.cloud) — global leaderboard backend. If missing, leaderboard UI hides and the game still works. |
| `REACT_APP_PANTRY_BASKET` | Basket name. Defaults to `prompt-patrol-scores`. |

`.env.local` is gitignored. For Vercel: set the same vars under Project Settings → Environment Variables.

## Content updates

| To change... | Edit |
|---|---|
| Projects | `src/data/projects.js` + drop images in `public/assets/images/<bucket>/` |
| Experience | `src/data/experience.js` + hero photos in `public/assets/images/companies/heros/<id>.jpg` |
| Publications | `src/data/publications.js` |
| Resume | live PDF from `PranavMishra17/PranavMishra17`; local backup = any `.pdf` in `public/resumes/ai/` |
| Game numbers | `src/components/game/config.js` |
| Game phrases | `src/components/game/phrasebook.js` |

## Prompt Patrol

Mouse-only endless runner themed around LLM prompts. Phosphor-CRT aesthetic.

**How it works**

User prompts rise as token capsules from a keyboard at the bottom-right toward a model device at the top. Identify them on the fly. Pop the dangerous ones; let the safe ones reach the model.

| Token | Color / shape | Action | Miss penalty |
|---|---|---|---|
| Safe prompts | Blue pill | let it pass | none — model "thinks" (gibberish vector output) |
| Unsafe prompts | Red pill | pop it | −1 life |
| Grey prompts | Grey pill | read the text + decide | varies (text always self-identifies as safe / unsafe / bomb) |
| Bombs | Black orb with fuse | pop = +5 score | **instant game over** |

A cannon at the bottom-left fires projectiles that arc under gravity + a wind field that shifts every 20–30 s. Hold the mouse for a charged shot (longer aim trail, more wind-resistant). Hold 3 s for an auto-fired **HOT RED** megashot. Reds have a forgiving hitbox; greys and bombs are tighter.

Top 50 scores live in a free Pantry basket — top 5 shown on the title screen and game-over panel. 5-char tag, pre-filtered through a base64-encoded banlist with leetspeak normalization. Mobile play gets a built-in difficulty bump to match desktop intensity.

Full design doc: [docs/prompt-patrol-gdd.html](./docs/prompt-patrol-gdd.html).

## Deployment

Configured for Vercel via [portfolio/vercel.json](./portfolio/vercel.json). Build output is `portfolio/build/`. Push to `main` and Vercel rebuilds — make sure both `REACT_APP_*` env vars are set in the project dashboard or the view counter and leaderboard will silently disable in prod.

## License

MIT — see [LICENSE](./LICENSE).

## Contact

Pranav Pushkar Mishra · [pmishr23@uic.edu](mailto:pmishr23@uic.edu) · [LinkedIn](https://www.linkedin.com/in/pranavgamedev/) · [GitHub](https://github.com/PranavMishra17) · [YouTube](https://www.youtube.com/@parano1dgames)
