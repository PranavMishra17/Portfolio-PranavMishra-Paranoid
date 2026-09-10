# Variants — the map

**Start here.** This file tells you what exists, how to look at it, and what the rules are.
Everything on this branch is a *proposal*. Nothing here has been chosen and nothing here
replaces the live site.

Branch: `claude/portfolio-revamp-alignment-a7dad8` · never merge to `main`, never commit to `main`.

## The other three docs, and when to read them

| File | What it is |
|---|---|
| [`PORTFOLIO-BRIEF.md`](PORTFOLIO-BRIEF.md) | The spec. What Pranav actually wants, the six data models, the hard rules, the stack contract. **Read §0 first — it governs everything.** |
| [`VARIANT-AGENT-NOTES.md`](VARIANT-AGENT-NOTES.md) | The mechanics a variant must implement, and how to report back. |
| [`HANDOFF.md`](HANDOFF.md) | Where things stand, his taste in his own words, and how `/bomb2` is put together. |
| [`design-lab/room-blueprint.svg`](design-lab/room-blueprint.svg) | His hand sketch, formalised: the page structure and the room's twelve hotspots. |

---

## How to look at them

```bash
cd portfolio && npm start
```

Dev server on `http://localhost:3000`. Every variant is its own route. **`/` is the live site —
open it once to confirm you have not broken it, then leave it alone.**

If port 3000 is taken by another agent's session, build once and serve the output instead —
there is a tiny SPA-fallback server in the repo so client-side routes resolve:

```bash
cd portfolio && CI=false npx react-scripts build
```
```bash
python .claude/spa_server.py 4600 portfolio/build
```

`.claude/launch.json` has both of these wired as named configurations.

The 35 earlier static prototypes are plain HTML and need no build:

```bash
python -m http.server 4458
```

Then `http://localhost:4458/design-lab/index.html`.

---

## Routes

### Not proposals — do not modify

| Route | What |
|---|---|
| `/` | The live portfolio. Untouched, and must stay untouched. |
| `/resume` | Resume viewer. Untouched. |
| `/variants` | A hub listing the proposals. |

### The React variants

| Route | What it is | By |
|---|---|---|
| `/v1` | The day is the navigation | earlier session |
| `/v2` | The horizon | earlier session |
| `/v3` | The rail is a sundial | earlier session |
| `/v4` | Sundial rail with a horizon line | earlier session |
| `/v5` | Words on the sky, minimal rail, prints and stamps, a room that reacts | earlier session |
| `/v6` | The same sky and room, set like Weather | earlier session |
| `/bomb` | The cursor is a bomb; hold to bring a brick wall down | earlier session |
| `/bomb2` | Second pass — square tiles, a cursor that changes | earlier session |
| `/v8` | **Monograph** — an art book. Numbered figure plates, running head, dark and warm | this session |
| `/v9` | **Core** — a drill core pulled out of the ground; depth is time, bedrock is childhood | Fable |
| `/v10` | **Receiver** — a radio dial you tune; between stations there is static and no carrier | Fable |
| `/v11` | **Tissue** — a sewing pattern sheet; each section is a garment piece you cut out | Fable |
| `/v12` | **Session 47** — the page is under playtest and *you* are the tester; a live observer log | Fable |
| `/v13` | **Scope** — you have 100 units of attention, the page costs 160; what you skip is cut | Fable |
| `/v14` | **Lined script** — a script supervisor's lined page; pick a camera setup, the page hard-cuts | Fable |
| `/v15` | **Blocking** — a top-down floor plan; click a mark, the camera dollies and the lens changes | Fable |
| `/v16` | **Daylight** — the bomb mechanic rebuilt light: plaster over a daylit sky, big slabs | this session |
| `/v17` | **Plaster sheet** — same mechanic, a colder and more typographic take | Fable |

**`/v7` no longer exists.** It was an editorial "Index" variant — fixed Bodoni masthead, four
parts, no scrolling — and its folder and route were replaced by `bomb`. It is recoverable from
this session's transcript if anyone wants it back.

---

## What to expect when you open one

- **`/v16` and `/v17` open covered by a surface.** That is intended. Press and hold anywhere;
  a fuse burns down a wick and the surface breaks apart into big squares. If you see the page
  immediately with no surface, the animation loop never started and the guard removed it — that
  is the failsafe working, not a bug.
- **`/v10` and `/v14`** have no scroll at all. You tune, or you cut. If nothing happens on
  scroll, that is the design.
- **`/v13`** deliberately will not let you open everything.
- Several variants use **placeholder identities** ("Ilse Marrow", "Dara", "Noor", "Ines Varga")
  because they were built to explore form, without real data. `/v8`, `/v16` and `/v17` use the
  real data files.

## Verification status — be honest about this

| Verified end to end | Renders + compiles, interaction not confirmed |
|---|---|
| `/v8`, `/v12`, `/v13`, `/v16` | `/v17`, and the detonation in `/bomb`, `/bomb2` |

The browser pane used in these sessions frequently does not tick `requestAnimationFrame`, so
anything canvas- or physics-driven could not always be watched. **Check those in a real browser
before claiming they work.**

---

## Rules for adding a variant

1. **Additive only.** New folder `portfolio/src/variants/vNN/`, its own CSS scoped under a root
   class (`.vNN`). The **only** existing file you may edit is `portfolio/src/App.js`, and only
   to lazy-import your component and add its route.
2. **Delete nothing.** Not other variants, not the mini-game, not `ThemeSwitch`. Cleanup is a
   separate job, later, once a direction is picked. A variant slot being reused is how `/v7`
   was lost.
3. **Do not edit the three files in `src/data/`.** `/` and every other variant read them. Import
   them and map over them; put rewritten copy in your own folder.
4. **Rewrite the words freely, keep every fact.** The existing project copy is keyword-stuffed.
   Metrics, dates, venues, links and image paths must stay exactly true.
5. **Never mention** "Execution Decision Layer", "five verdicts" or "deterministic risk scoring".
   It was a small take-home and he is sick of seeing it. It is still present in
   `src/data/experience.js` — filter it out at render time rather than editing that file.
6. **Interests are empty on purpose.** He has not said what he reads, watches or plays. Leave
   visible empty slots and one honest line. Invent nothing.
7. **Never gate first paint on `requestAnimationFrame`, `load`, or `IntersectionObserver`
   alone.** rAF does not tick in a hidden document and it can stop *part way through*;
   `IntersectionObserver` cannot fire when the viewport has zero height. This has silently
   killed more variants on this branch than every other cause combined. Always leave a timeout
   that lands the final state, and if you drive a canvas, add a watchdog that keeps the loop
   alive when frames stop arriving.
8. **Readability is the one hard gate.** Body text ≥15px, line-height ≥1.55, contrast ≥4.5:1,
   never over artwork or a gradient without something solid behind it. His single complaint
   about the variants he liked was that he could not read them.
9. Run `cd portfolio && CI=false npx react-scripts build` before you report.

## The stack

React 19 · framer-motion 12 · react-router-dom 7 · react-scripts 5 · plain CSS.

Also already installed, added by earlier sessions: `matter-js` 0.20 (the physics behind the
bomb variants), and `three` 0.186 with `@react-three/fiber` 9 and `@react-three/drei` 10 —
so a genuinely 3D variant is possible without adding anything.

No TypeScript, no Tailwind, no CSS-in-JS. Do not add a dependency without saying why first.
