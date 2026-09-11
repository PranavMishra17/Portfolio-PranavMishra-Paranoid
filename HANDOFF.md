# Handoff — the portfolio revamp, as of 2026-09-11

For the next agent. Read this first, then skim `PORTFOLIO-BRIEF.md` (the original brief) and
`VARIANT-AGENT-NOTES.md` (Pranav's answers to the clarification round). Both predate the current
direction; this file is the one that reflects what he actually asked for last.

The live work is `/v19`. Everything else in `src/variants/` is history you may read and must not
break.

---

## 1. Where things are

- **Repo:** `PranavMishra17/Portfolio-PranavMishra-Paranoid`.
- **Branch:** `claude/portfolio-revamp-alignment-a7dad8`. Develop and push there, nowhere else.
- **PR:** https://github.com/PranavMishra17/Portfolio-PranavMishra-Paranoid/pull/1 —
  draft and open. The only check is the Vercel preview deploy; there is no test CI.
- **App:** `portfolio/` (Create React App, React 19, react-router-dom 7, plain CSS, no TypeScript,
  no Tailwind). All commands run from inside `portfolio/`.
- **Run it:** `npm install` then `BROWSER=none HOST=0.0.0.0 PORT=3000 npm start`. Then
  http://localhost:3000/v19.
- **Build gate:** `CI=false npx react-scripts build` must pass. Warnings come from the old
  components, not from the variants.

The preview deployment is reachable from a browser but **not from inside this container** (the
agent proxy returns 403 for it). Verify with local screenshots, and say so honestly rather than
claiming you checked the deploy.

## 2. The two current variants

- **`/v18`** — the first build of his spoken spec. **Frozen. Do not edit it.** He said explicitly:
  copy it into v19 and edit there. It exists so he can compare.
- **`/v19`** — the live one. A copy of v18 plus four rounds of his critique. This is where all
  new work goes.

Older routes (`/v1`–`/v17`, `/bomb`, `/bomb2`, `/variants` hub) still build and still work. `/v1`–`/v4`
he called horrible; `/bomb2` was the direction that led to v18; `/v16` is where the plaster wall
came from. Leave all of them alone.

`/` and `/resume` are the real, shipping site. **Never touch them.** Nothing here replaces them
without an explicit instruction from him.

## 3. How `/v19` is put together

Everything lives in `portfolio/src/variants/v19/`. The only shared file any variant may edit is
`portfolio/src/App.js`, and only to add a lazy import and one route.

```
v19/
  index.js          Page shell: header, Detonator, Landing, and the four sections
  copy.js           All words drawn from src/data/*, rewritten. Never edits src/data.
  personal.js       Books, posters, games, magnets, medals, family. Some real, some sample.
  lab.js            The Lab: context + localStorage, DEFAULTS and OPTIONS
  hooks.js          useSky, useOpener, useSnap, useOnScreen
  v19.css           All styling. Every class is prefixed .v19-
  wall/
    surfaces.js     What the wall is made of: grid, paint, field, and for iso drawTile
    blasts.js       How it comes apart: burst, drop, sweep, dissolve. Independent of material
    Wall.js         One class driven by a surface and a blast: explode, rebuild, step, draw
    index.js        Detonator — three cursors driven by one custom property, --p
  sections/
    Landing.js      Four first screens, each carrying its own typeface for the whole site
    Work.js         Alfred_ on the first screen; WheelPrice shut below it; a drawing per figure
    Projects.js     One frame layout, three dresses; filters; the viewbox
    Papers.js       Three designs, and the awards, which open
  room/
    engine.js       288x144 palette-index buffer, id map, painter, mono tones
    scene.js        Every object in the room, HOTSPOTS, drawScene, back to front
    sprites.js      His bust — head, neck, collar, shoulders — and the asleep version
    Room.js         Looks, hit-testing, slips, toggles, back-to-top
```


Section order on the page: **Landing → Work → Projects → Papers → Room.**

### The wall

The bomb goes off **once**, on the landing. Hold the left mouse button (`FUSE_MS` 880 ms) anywhere,
or press the red "See my work" button, and the wall blows apart and the site is underneath. The
header's face chip rebuilds it. Blocks exit up and to the left, toward that chip, so the way back is
implied instead of explained.

Mechanics worth knowing before you change anything:

- The wall face is painted **once** into an offscreen canvas; each block blits its own region of
  it. That is why six materials cost almost nothing at runtime.
- `surfaces.js` owns the look: `grid()`, `paint()`, `field()` (what the cursor does at rest), and
  optionally `drawTile` (the isometric rhombus) or `trail: true` (frost remembers where you went).
  Every surface is **plain at rest** — no pattern, no grid, nothing until your hand is on it.
- `blasts.js` owns the failure: gravity plus a per-block kick. Material and failure are separate,
  so any wall can come apart any way.
- `slate` sets `dark: true`, and the page puts `is-dark` on the landing so the type turns over
  with it. Any new dark material must do the same or the contrast gate fails.
- The detonator loop has a watchdog and a 900 ms guard failsafe, so a dropped frame can never
  leave the page stuck behind a wall. Keep both.
- The three cursors are one element driven by a single custom property, `--p`, written once a
  frame. A fourth is a stylesheet block, not a component.
- **Never gate first paint on `requestAnimationFrame` or IntersectionObserver alone.** Content must
  render even if the observer never fires; `useOnScreen` has a timeout guard for exactly this.
- The page forces `history.scrollRestoration = 'manual'` while it is mounted. Without it a refresh
  part way down the page restored that scroll behind the wall, and the landing ended up sitting
  over the middle of the site.
- If you reintroduce matter-js anywhere: create bodies dynamic, then `Body.setStatic(b, true)`.
  Passing `isStatic: true` in the options gives infinite mass and NaN positions on release. That
  bug cost an hour in an earlier round.

### The Lab

A single dot in the corner opens a small popover of chips — his words: a tiny popup, not tabs, not a
panel. State lives in React context and `localStorage` under `v19.lab`; unknown stored values fall
back to `DEFAULTS`.

| Key | Default | Choices |
| --- | --- | --- |
| `land` | `plate` | plate, masthead, ledger, quiet — each sets the site's typeface too |
| `surface` | `plaster` | plaster, clay, slate, iso, film, frost |
| `trigger` | `charge` | charge, dynamite, pin — what is in your hand |
| `blast` | `burst` | burst, drop, sweep, fade |
| `texture` | `grain` | grain, film, plain — the tooth over the whole page |
| `projects` | `frame` | frame, gallery, poster — three dresses on one layout |
| `papers` | `figure` | figure, abstract, brief |
| `room` | `warm` | warm, day, night, mono |
| `snap` | `false` | free scrolling by default |

The bar he set for a new option, in his own words: **"I WANNA SEE THE EFFORT."** A variant has to be
a different design — different material, different metaphor, different motion — not the same design
with one value changed. He rejected a whole round of layout-only variants. If you cannot describe
your new option in one sentence that does not mention spacing or columns, it is not a variant.

### The room

A pixel room, 288x144, palette-index grid plus an id map for hit-testing. It is full-bleed at the
bottom of the page, not in a box, and has no heading.

- **Depth is the draw order and the draw order is the truth.** You are standing behind him.
  Nearest to you is the chair, then him, then the desk and everything on it, then the wall. That
  is why the chair back covers his back and only his head and the tops of his shoulders clear it,
  and why the mug and the photograph sit beside the screens instead of through them. Changing the
  order in `drawScene` is how you break the room.
- The middle of the room is the middle of the picture: three posters centred on the wall, two
  screens centred under them, and the gap between the screens is where his head is.
- The canvas is `object-fit: cover; object-position: center bottom` at roughly 2:1, so a wide
  window crops a little off the top and a narrow one a little off each side. Keep anything that
  matters inside x 16–272 and below y 14. The top mask is 5%.
- Hit-testing inverts the cover geometry; there is no safe-band offset any more.
- Slips are positioned **beside** the object you clicked, left or right depending on which side
  has room, with a pointer. Centred popups were rejected as unintuitive.
- Real project screenshots are blitted onto the left monitor. His pixels (id 2) are repainted over
  the screen rect afterwards so he is never hidden behind his own screenshot.
- Interactions: click him to wave (the arm comes up over the chair), the tower to sleep and wake,
  the window to open, the ball to bounce, the lamp, the string lights, the plant, the mug. No
  walking, no door — both cut on his instruction.
- Back to top is the button on the carpet.

## 4. His rules — follow these literally

Constraints that are not negotiable:

- Build **additively** in `src/variants/vNN/`. Delete nothing.
- Never edit `portfolio/src/data/*`. Filter at render time instead. The Alfred_ entry contains an
  "Execution Decision Layer" bullet and project; it is filtered everywhere and **must never appear**.
  The same goes for the phrases "five verdicts" and "deterministic risk scoring".
- Never touch `/` or `/resume`.
- No new dependencies without saying why.
- Readability gate: body text at least 15px, line-height at least 1.55, contrast at least 4.5:1, and
  no text sitting on top of artwork.
- No emojis, anywhere — in the UI, in code, in commits.
- No markdown files or written summaries unless he asks. This file is the exception; he asked for it.

Taste, in his words or close to it:

- **Minimalism, always.** He gives a page about five seconds.
- "Portfolio is a personal thing. It has to be unique. Different than any internet website
  standards."
- **No meta copy.** Nothing that explains the mechanism to the reader.
- The heading introduces him and then the company: "Right now I am a founding engineer at
  Alfred_", with Alfred's own mark beside it, then one line on what Alfred_ is and one on which
  half is his. He rejected "Hi there". The tagline is "Founding Engineer at Alfred_".
- Links reduced to three — GitHub, LinkedIn, Résumé — plus the red "See my work" button.
- Projects: **no circles, no hover elevation, no motion on hover, no numbering, no counts.**
  Rectangular tiles, two rows, then Show all. The viewbox must not resize when you point at things.
- Papers: status reads "Preprint". Two papers. SLM/TeamMedAgents entry stays hidden. The citation
  count is a figure in every design, never a footnote.
- Type is not a switch of its own. He did not want to pick a font; each first screen brings its
  own, and the site follows it.
- Click-open everywhere; clicking outside, pressing Escape, or scrolling past closes it.
- Sketches and reference files are inspiration, never a spec. Compose from his description.
- He asked for one author on this work. Do not fan it out to subagents.

Things he has already rejected, so do not bring them back: circular project tiles, scroll pull-in
snapping by default, index and sheet layouts, dark side panels and slabs, a dynamite icon in the
header, small buttons in the top-right corner, a "Now Made" nav, the walking sprite, the door, a
boxed room, a "My Room" heading, footer content under the room, and — from the last round — the
graph-paper and halftone walls, the ink wall, the beside/fill/spec/mosaic/reel project layouts, the
CV and front-page paper designs, and the plant as a variant.

## 5. How to verify

1. `CI=false npx react-scripts build` from `portfolio/`.
2. Dev server, then screenshots. `playwright-core@1.49.1` installs transiently
   (`npm i -D playwright-core@1.49.1`) and Chromium is already on the box at
   `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. The script must run **from `portfolio/`**
   or the module will not resolve. **Revert `package.json` and the lockfile before committing.**
3. Sweep at 1600x900: every surface at rest and mid-fuse, every blast, every landing, all three
   project dresses, all three paper designs, every room look. Look at the images yourself. The wall
   and the room fail silently — nothing throws, it just looks wrong.
4. Check the refresh case: blast, scroll to the bottom, reload. You must land at the top with the
   wall intact and nothing of the landing over the page.
5. Phones are roughed in, not tuned. If you touch layout, check ~420px width too.

## 6. Open questions for him

These are unresolved and marked in the code as needing confirmation. Do not invent answers.

- **Citation counts.** `copy.js` carries `CITATIONS = { teammedagents: 10, metarag: 6 }`. He said
  "10 or 6 in each" and never confirmed which is which.
- **The corrected paper title.** He said one of the TeamMedAgents/MetaRAG titles is wrong. He has
  not given the correction.
- **Cover art.** The posters and books in the room are drawn, not real cover images. He wants real
  images pixelated. No assets have been supplied.
- **Sample content.** In `personal.js`, entries flagged `sample: true` (games, magnets, family
  caption, medals) are placeholders. The books and posters are his real titles. Keep the flags
  until he replaces the content.

## 7. Polish candidates

Nothing here is blocking; this is where the next hours are best spent.

- A mobile pass on v19. The wall works with touch, but the sections below ~720px were only roughly
  handled and never tuned.
- Accessibility: the wall face is canvas-painted, so the landing has no readable text for a screen
  reader until the wall is gone. A visually-hidden copy of the landing text would fix it.
- A cover-art pipeline for posters and books once he supplies images: load, downsample to the room
  palette, blit. The plumbing for screenshots on the monitor already does most of this.
- The room's window shows a drawn sky, not the live scroll-driven one from `useSky`. Wiring them
  together is an obvious win.
- The floor reads as a wooden wall rather than a floor in some lights; a little perspective in the
  boards would sell the depth.
- The five drawings under the dials are on infinite loops. They could run once when the figure is
  picked and then rest, which would be quieter.
- A fourth cursor, and a wall material that uses the trail mechanic for something other than fog.

## 8. The PR routine

PR #1 is subscribed for activity, and an hourly self check-in re-reads its state. Keep that going
until the PR is merged or closed. On each check: current head, CI (Vercel preview only), merge
conflicts, review threads. If nothing changed, re-arm silently — do not comment and do not message
him for the sake of it.

---

### Earlier history, in one paragraph

Four rounds preceded v18. `/v1`–`/v4` were rejected outright. `/v5` and `/v6` introduced the
scroll-driven sky and the pixel room he loved. `/bomb` and `/bomb2` introduced the wall: hold to
light a fuse, blow through, walk deeper. He approved the *effect* there, then asked for it to happen
**once** instead of four times, with the real site behind it. That became `/v18`, and `/v19` is v18
after his critique. If you want the detail on `/bomb2`'s four-wall physics, read
`src/variants/bomb2/wall.js`; it is commented.
