# Portfolio brief — the thing Pranav actually wants

Written 2026-09-09, after thirty-five discarded prototypes. This is the settled direction.
Hand this whole file to any agent that is going to build it.

**Formal blueprint of the layout:** [`design-lab/room-blueprint.svg`](design-lab/room-blueprint.svg)
— open it in a browser. Panel A is the page; Panel B is the room and its twelve hotspots.

---

## 0. READ THIS FIRST — you are building VARIANTS, not the website

This is still an exploration. Nothing here is a commission to replace the live site.

- **You are producing three or four VARIANTS to be compared and chosen between.** They are
  proposals. Pranav will look at them, take pieces from several, and only then will one become
  the real site.
- **Do not overwrite the existing portfolio.** `src/MainPortfolio.js`, the `/` route, and every
  component currently under `src/components/` stay exactly as they are and keep working. If `/`
  looks or behaves differently after your change, you have failed the task regardless of how
  good your variant is.
- **Each variant is additive**: its own folder, its own route, its own CSS. Nothing shared is
  edited in place.
- **Do not delete anything.** Not the mini-game, not `ThemeSwitch`, not the particle background,
  not the old sections. Cleanup is a separate job for later, after a direction is picked.

### Two things you must do before designing

1. **Read the actual repo.** Do not build from this document alone. Open the real components,
   the real CSS, `package.json`, and the routing. Understand what already exists and how it is
   put together before you add to it.
2. **Use the real data files.** Import from `src/data/projects.js`, `src/data/experience.js` and
   `src/data/publications.js`. Do not retype the content into your variant, and do not invent
   projects. **You are free — encouraged — to rewrite the wording**, since the current copy is
   stuffed with keywords and reads badly. Rewrite it in plain first person. Just keep every
   fact, metric, link, date and image path true to what is in those files.

---

## 1. The shape of it, in one paragraph

One page. **One continuous sky** behind everything, moving from a bright morning at the top,
through noon, into sunset at the bottom — driven by scroll position. **Four screens of scroll
and no more.** The last screen is a drawn room — his desk setup from his bachelor days — where
every object is hoverable and clickable, and the window in that room shows the sky again, one
morning later.

---

## 2. Hard rules

These are settled. Do not relitigate them.

| Rule | Detail |
|---|---|
| **Four sections, maximum** | On a normal desktop screen. Not four "areas" that each scroll for three screens — four screens total. If content does not fit, cut content. |
| **Five to eight projects on the page** | Never the full ~32. Top five preferred, eight is the ceiling. |
| **"See everything" is an overlay** | A popup holding the complete set. Not another page, not a route. |
| **Tag filters, not search** | Chips along the top of the overlay: ML, game design, agents, XR, research. Clicking narrows. No search box. |
| **Work history must not eat a screen** | It appears, compactly, inside section 2. It is not its own section and not a modal you have to hunt for. |
| **Readability is the one hard technical gate** | Body text ≥15px, line-height ≥1.55, ≤70 characters per line, contrast ≥4.5:1, never sitting directly on the sky or on a screenshot. Every earlier attempt he liked was rejected for exactly this. |
| **The sky is gentle** | Slow gradient shifts. Not a dramatic light show. See §3. |

---

## 3. The sky — what he means, precisely

He was specific, and the distinction matters:

- **`design-lab/12-weather.html` is the right intensity.** "Slight gradients of colour changing.
  That's it. That's the background I am thinking of." Quiet, almost imperceptible, never
  competing with the text.
- **`design-lab/01-vantage.html` is the right *idea* but too much.** "It's just a horizon and a
  whole day, I like the effect. It's a little too much for my liking. And it's not readable."

So: take Vantage's concept — one horizon, one day passing — and execute it at Weather's volume.
Bright morning → noon → sunset across four screens. Optionally a skyline silhouette appears as
you descend. The room's window at the bottom then shows **sunrise of the next day**, which closes
the loop.

**The sky must never be the reason a word is hard to read.** Text lives on solid ground, always.

---

## 4. Design references — open these before designing

Serve the folder and look at them. Do not work from the descriptions alone.

```bash
python -m http.server 4458 --directory .
```

Then `http://localhost:4458/design-lab/index.html`.

| Ref | File | What he wants from it | What he does NOT want |
|---|---|---|---|
| **Vantage** | `design-lab/01-vantage.html` | The horizon-as-a-day concept | Its intensity; its readability |
| **Weather** | `design-lab/12-weather.html` | The exact gentleness of the gradient shift | Its emptiness |
| **Ikeda** | `design-lab/33-ikeda.html` | The **minimalism of the data layout** — how the "Measurements" band arranges information. And **§4**: a small fixed set of projects, static, revealing on hover | The giant numbers, the count-to-zero opening, the black |
| **Bass** | `design-lab/32-bass.html` | How **easily you switch sections**; the **left panel**; the title treatment; the colour confidence | The overall direction — he is not going here |
| **Rams** | `design-lab/29-rams.html` | The minimalism; **section list on the left with links beneath it**; **his name always visible** | — |

The through-line: **a persistent left rail that names the sections and never moves, with his name
pinned above it**, over a sky that changes as you go, with a small amount of very well-set
information on the right.

---

## 5. The four sections

Exact copy is not fixed; the shape is.

1. **Arrival.** Name, one or two plain sentences, the brightest part of the day. Mostly sky.
2. **The work.** Alfred_ and what changed there — the numbers belong here. Work history sits in
   this section, compact. Reference: Ikeda's measurement register for the *layout*, not the content.
3. **Built & written.** Five to eight projects, static, revealing on hover. "See everything" opens
   the tag-filtered overlay. The three papers live here too, quietly, with their status.
4. **The room.** See below.

---

## 6. The room — the last screen

His own description, condensed: *"How my room was during my bachelor days. My work setup: screens,
a laptop. My bookshelf, my books, trophies on top, movie posters, a window, a fridge with magnets,
my football and boots, and a family photo on the table. That's it."*

One scene, drawn flat and seen straight on. Everything is a hotspot. Hover names it; click opens
what he has written about it.

| # | Object | Opens |
|---|---|---|
| 1 | Window | The sky system again — **sunrise of the next day**, sun visible |
| 2 | Movie posters (×4) | Each film, and why it is a favourite |
| 3 | Fridge magnets | A small memory behind each |
| 4 | Bookshelf | Vertical spines, small but legible. Reading now / recently finished |
| 5 | Trophies | MIT XR 2024, HINT 5.0 |
| 6 | Monitor A | Work history |
| 7 | Monitor B | The three papers |
| 8 | Laptop | About me |
| 9 | Wall screen | Projects |
| 10 | Games shelf | Games he plays |
| 11 | Family photo | Where he comes from |
| 12 | Football & boots | He used to play |

**The reuse rule.** Objects 6, 7, 8 and 9 open **the exact same content** as sections 2 and 3 —
one source of truth, rendered twice. Nothing is written twice. Everything else in the room is
personal and appears nowhere else on the site.

**Do not** build this as a 3D scene unless you have explicitly agreed to add `three.js`. Flat,
drawn, straight-on, in SVG or CSS, is the assumption.

---

## 7. The stack — this is not negotiable

**Build in the real repo, in the real stack. Not a standalone HTML file.**
Everything in `design-lab/` is a throwaway sketch. These variants are real React, but they are
still proposals — see §0.

```
portfolio/                      Create React App. Run everything from here.
  npm start                     dev server on :3000
  npm run build                 production build (CI=false)
```

- **React 19.1** · **framer-motion 12.9** · **react-router-dom 7.12** · **react-scripts 5** · **plain CSS**
- No TypeScript. No Tailwind. No CSS-in-JS. No new build tooling.
- Adding a dependency requires a reason stated up front. `three.js` is the only one currently
  under discussion, and only if the room becomes genuinely 3D.
- Routes today: `/` → `MainPortfolio`, `/resume` → `ResumeViewer`. **Both keep working, unchanged.**

### How a variant is wired in

The only file you may edit that already exists is `src/App.js`, and only to add routes:

```jsx
<Route path="/" element={<MainPortfolio />} />        {/* untouched */}
<Route path="/resume" element={<ResumeViewer />} />   {/* untouched */}
<Route path="/v1" element={<V1 />} />                 {/* yours */}
<Route path="/v2" element={<V2 />} />                 {/* yours */}
<Route path="/v3" element={<V3 />} />                 {/* yours */}
```

Everything else you write lives in its own folder — `src/variants/v1/`, `src/variants/v2/`, and
so on — with its own CSS. Do not import from `src/components/`, do not edit anything in it, and
do not touch `src/index.css`. If two variants want the same helper, copy it; duplication between
throwaway proposals is cheaper than coupling them.

**Content is data-driven and stays that way.** Import it; never retype it. All copy lives in:

- `portfolio/src/data/projects.js` — `projects.{aiMl, gameDesign, misc}`, plus `contactInfo`, `socialIcons`
- `portfolio/src/data/experience.js` — the four roles
- `portfolio/src/data/publications.js` — the three papers, plus derived `publicationStats`

Image paths in `projects.js` are **relative** (no leading slash) and pass through
`getImageWithFallback`. Everywhere else uses leading-slash paths. Real screenshots live under
`portfolio/public/assets/images/{ai_ml,game_design,misc,companies,achievements}/`.

**Rewrite the words, keep the facts.** The existing descriptions are keyword-stuffed and read
badly — "immersive spatial computing interfaces", "advanced prompt engineering". Rewrite them in
plain first person, as him. What you may not change: the metrics, dates, venues, statuses, links
and image paths. Every one of those is real and he will notice.

Where to put your rewritten copy: keep the source files as the record and map over them inside
your variant, or add a sibling file (`src/data/copy.v1.js`) keyed by the existing project `id`s.
**Do not edit the three data files in place** — other variants and the live `/` route read them.

The room needs data that does not exist yet — books, films, games, magnet memories, the family
photo caption. Add it as a **new** file, e.g. `src/data/personal.js`, with visibly empty
placeholder entries. Never invent a title he might be asked about.

### Two data notes that will bite you
- Every screenshot in the repo is **landscape**, mostly 16:9. One, `game_design/van gogh.jpg`,
  is only 400×400 — never render it above ~380px.
- The current `ThemeSwitch` writes `data-theme` to `<html>` and **zero CSS reads it** — light mode
  is dead code today. Leave it alone (§0: delete nothing). Just know that if your variant wants a
  light/dark switch, you are building it, not inheriting it.

### Never write
"Execution Decision Layer", "five verdicts", "deterministic risk scoring". It was a small
take-home, the framing does not match shipped code, and he is actively sick of seeing it.

It currently appears in `src/data/experience.js` — as a bullet under Alfred_ and as a named
entry in that role's `projects` array. **Do not edit that file to remove it** (see above); just
filter it out in your variant and never surface it.

### Interests are empty on purpose
He reads, watches films, plays games. **He has not said which ones.** Build the furniture — the
shelf, the posters, the magnets — and leave visibly empty slots with one honest line saying they
are placeholders. Do not invent a single title.

---

## 8. The prompt for the building agent

Paste this, along with the whole file above.

> You are a frontend designer of the first rank — and an inventor. You do not decorate; you
> construct. You have a point of view and you defend it. You are an absolutist about three
> things and you will not trade them away for anything: **legibility**, **restraint**, and
> **the idea being singular**. One idea, executed completely, beats five ideas hedged.
>
> Read `PORTFOLIO-BRIEF.md` end to end — **§0 first, it governs everything** — then open
> `design-lab/room-blueprint.svg` and the five referenced prototypes in a browser. Look at them.
> Do not work from the descriptions.
>
> Then **read the actual repository**: `portfolio/src/MainPortfolio.js`, the components, the CSS,
> `package.json`, and all three files in `src/data/`. You are adding to a working codebase, not
> starting one. Know what is there first.
>
> Then build **three or four distinct VARIANTS** — proposals to be compared, not a replacement
> for the site. React 19 with framer-motion, each in its own folder under `src/variants/`, each
> mounted on its own route (`/v1`, `/v2`, `/v3`). **The `/` route and every existing component
> must still work exactly as they do now when you are finished.** Delete nothing.
>
> Pull all content by importing the real data files. Do not retype it and do not invent projects.
> **Rewrite the wording freely** — the existing copy is keyword-stuffed and reads badly; put it in
> plain first person. Keep every metric, date, venue, link and image path exactly true.
>
> Every variant obeys the hard rules in §2 and houses all six kinds of content: the intro, the
> work history, the projects, the papers, the personal interests, and the odds and ends. The
> variants differ in **how**, not in **what**.
>
> The client has rejected thirty-five prototypes. His three standing complaints, in his words:
> they read like blogs; the text is not readable; and they are "just words stuck together"
> with no visual instinct behind them. Assume he will look at each one for about five seconds.
> Earn the sixth.
>
> Where the brief is silent, decide. Where it is specific, obey it exactly. Do not ask
> permission to have taste — but do not invent facts about his life, ever.

---

## 9. Open questions — worth answering before building

1. **The room's fidelity.** Flat drawn SVG, or a real 3D scene with `three.js`? Flat is the
   current assumption and is much cheaper; 3D is closer to how he described picturing it.
2. **Where the resume lives.** `/resume` still exists and is unaddressed by this brief.
3. **The four-screen budget vs. the room.** The room is one screen but is dense. Confirm it
   counts as section four rather than becoming a fifth.
4. **Mobile.** A straight-on room scene at 375px is hard. Does the room degrade to a list of
   its twelve objects, or is it desktop-only with something else on phones?
5. **The personal content itself.** Books, films, games, magnet memories, the family photo
   caption — none of this exists yet. The furniture can be built empty, but the site is not
   finished until he writes it.
