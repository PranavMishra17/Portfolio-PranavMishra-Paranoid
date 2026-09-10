# Handoff — the portfolio revamp, where it stands on 2026-09-10

For the next agent. Read this, then `PORTFOLIO-BRIEF.md` (the original brief), then
`VARIANT-AGENT-NOTES.md` (Pranav's answers to the clarification round). This file is the one that
tells you what he actually liked, because the brief predates most of it.

## Where everything is

- **Worktree:** `.claude/worktrees/portfolio-revamp-alignment-a7dad8/`, branch
  `claude/portfolio-revamp-alignment-a7dad8`. Nothing is pushed. `main` is untouched.
- **App:** `portfolio/` inside the worktree (Create React App, React 19, plain CSS). Run from there:
  `npm start` → http://localhost:3000. A dev server was left running on port 3000 from this session.
- **Routes:** `/` and `/resume` are the old site, untouched. `/variants` is a hub page listing every
  proposal. Each proposal is a folder in `portfolio/src/variants/` and a lazy route in
  `portfolio/src/App.js`. Add a proposal = add a folder + one route + one hub line.
- **Data:** never edited. Everything reads `portfolio/src/data/{projects,experience,publications}.js`
  and rewrites the wording in its own `copy.js`. The Alfred_ entry has a bullet and a `projects`
  item about an "Execution Decision Layer" — it is filtered out at render time everywhere and must
  never appear.
- **Deps added:** `matter-js` (the collapse physics), and `three`, `@react-three/fiber`,
  `@react-three/drei` (installed for the first round, never used; leave or remove).
- **Commits:** one per variant. His pre-commit hook rejects any AI attribution line in a commit
  message, so write plain messages. Earlier commits still carry a co-author trailer; he hasn't asked
  to rewrite them.

## The current direction, in order of his approval

1. **`/bomb2` — the one to build on.** Four walls of square tiles, one behind the other, the
   pixel room behind the last. The cursor is a bomb. Hold ~1.1 s anywhere on the wall, it goes off,
   the nearest tiles fly through the wall, the rest come down in a spreading collapse with real
   physics, and the next wall is there. "Load checkpoint" (bottom-left pill) flies the previous wall
   back. Dark, minimal, one mint accent. Cursor becomes a finger over links and controls, a magnifier
   over projects, papers and room objects that open. He said the *effect* is right; the second pass
   was purely the surface.
2. **`/bomb`** — same mechanics, painted brick look. Superseded by `/bomb2`; keep for reference.
3. **`/v5`** and **`/v6`** — the earlier scrolling-sky pages. He loved the pixel room and the lamp
   there; everything else about them he'd moved past by the time the bomb idea arrived.
4. **`/v1`–`/v4`** — rejected outright ("horrible"). Ignore them.

## How `/bomb2` is put together (`portfolio/src/variants/bomb2/`)

- `index.js` — the stage. Loads fonts and images, paints every wall once, runs one
  `requestAnimationFrame` loop that updates and draws the front wall over the intact wall behind it,
  handles the fuse (pointerdown/up on `window`, only when the cursor kind is `bomb`), the checkpoint,
  the depth dots, and the custom cursor element. Cursor kind comes from `kindFor(e.target)`:
  `.bomb2-panel` → native, `.bomb2-hit[data-cursor]` → that kind, `a, button` → hand, the room canvas →
  whatever the room reported.
- `murals.js` — one painter per wall. Each returns `{ texture, links }` where `links` are the
  clickable rectangles (rendered as invisible `<a class="bomb2-hit">` with `data-cursor`). Text is
  drawn with canvas `fillText`; there is a `wrap()` helper. **The bottom-left corner is reserved**
  for the checkpoint pill (`RESERVED = 92`), bottom-right for the depth dots. Keep it that way.
- `wall.js` — the physics. `brickGrid()` makes the square grid (no running bond in bomb2; `/bomb`
  offsets alternate rows). Each tile is a matter-js body created dynamic, then frozen with
  `Body.setStatic(b, true)` — **creating them with `isStatic: true` in options gives infinite mass
  and NaN positions when released; that bug cost an hour, don't reintroduce it.** `explode(x, y)`
  schedules every tile: within ~210 px → thrown immediately with collisions off for 380 ms so they
  pass through neighbours; farther → released in a wave, delay ∝ distance, with a shove and a spin.
  There is no floor: tiles fall out of the bottom. `rebuild()` tweens tiles in from below.
  Fixed 16.67 ms steps, at most three per frame.
- `Room.js` + `pixel/` — the pixel room, copied from `/v5`. `pixel/engine.js` is a 192×108
  palette-index buffer with an id map (for hover outlines and hit-testing), day/night columns per
  colour and a lamp falloff. `pixel/scene.js` draws the room and holds `HOTSPOTS` (hit-test order
  matters: first match wins, nearest things first). Interactions: lamp, curtains, fridge door, PC
  switches screens, plant grows, tea goes cold, he waves, ball bounces, trophies sparkle; the rest
  open a `Panel`. The room reports the cursor kind via `onCursor` and a `data-room-cursor`
  attribute set synchronously on `pointermove`.
- `Panel.js` — the slide-over; light paper so reading is easy.
- `copy.js`, `personal.js` — the words. Everything in `personal.js` is a **sample** (books, films,
  games, magnet memories, family caption). He has not supplied his own. Keep the flags.

## His taste, as stated, in his words where possible

- "Portfolio is a personal thing. It has to be unique. Different than any internet website
  standards." He gives a page about five seconds.
- Sketches and reference files are **inspiration, never a spec**. The first room was rejected as
  "a clear copy of the SVG that I gave." Compose from his description, don't trace.
- **No meta copy.** Nothing that explains the mechanism ("everything here opens something", "the
  window is not a picture", "it is morning"). The one exception he tolerated is the single fuse hint
  on the first wall.
- **No blocks** behind text, no bland type, some colour. He hated dark side panels and slabs; the
  dark surface of `/bomb2` is fine because it's the whole surface, not a panel.
- Projects: **always name, one short line, and the image.** He pointed at his current site's cards
  as the minimum bar.
- Intro: **starts with his face**, conversational: "Hey, I'm an AI engineer, founding engineer at
  Alfred_, agentic systems, eval harnesses and loops have been heavy, voice agents, chat agents, CV
  features, small ML projects." Not resume-like.
- The room: "love it." Make it react. Every new object should do something on click. Dim highlights.
- Interactions and polish over breadth. Four variants at once bought nothing; one thing iterated did.
- Don't use subagents for this; he asked for one author.

## How to check your work

`node` + `playwright-core` from the npx cache drives Edge headless; the scripts I used are in the
session scratchpad and are trivial to rewrite: navigate, `mouse.down()`, wait 1.4 s, `mouse.up()`,
screenshot at intervals, click `.bomb2-checkpoint`. Look at the screenshots yourself; the collapse
is the thing that goes wrong silently. `CI=false npx react-scripts build` must pass (warnings are
from the old components, not ours).

## Unfinished and known gaps

- Wall text is canvas-painted, so screen readers get only link labels and the room. If this ships,
  add a visually-hidden text copy per wall.
- Phones: the bomb works with touch, but wall layouts below ~720 px are only roughly handled (single
  column for projects and papers). Not tuned.
- The room's window shows a CSS starfield in `/bomb2`; in `/v5` it showed the live sky. There is no
  sky here.
- `personal.js` samples need his real titles before anything goes live.
- `three` and friends are installed and unused.
- He has not said whether `/bomb2` should replace `/`. The brief said never to touch `/`; do not
  swap routes without an explicit instruction.

## If you change the look

Keep the mechanic exactly: hold to light, blast through, spreading collapse, checkpoint rebuild,
room last. Change surfaces, type, spacing, the walls' content, the cursor art. Test the collapse
after any change to tile size or grid, and never give a tile a floor to stand on unless you also
handle the standing wall (a released wall on a floor just wobbles).
