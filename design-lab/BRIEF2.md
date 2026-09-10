# Brief 2 — the real one

The first twelve variants failed. They were atmospheres with text scrolling in front of
them. Variants 13–15 improved but still failed, because they were *presentation styles*
rather than *portfolios*: three of the six data models below did not appear at all.

Read this whole file before designing anything.

## The client's own words, this round

> "Each variant should have certain types for each of the data models that I have."
> "I want the website to feel alien. By alien, I mean I want the website to not feel
> like a website. I want a completely different map, but it should also be intuitively
> easy to navigate. It should not be some weird puzzle that I am figuring out."
> "It should be simplistic. I don't want flashy things. I don't want to clog it up with
> 5 different things."
> "Think of real life. It could be a cabinet. It could be a dossier. It could be like a
> building with different balconies and windows. It could be like a picture of my room:
> this is my computer, there's a couch, posters on the wall, trophies and a medal at one
> place, and in the closet there are my work clothes."
> "I'm not going for 'oh my God, what a website'. I'm going for a look and a style that
> is personal to me, that speaks to me, that is simple enough, but that speaks about
> the work."

He liked variant 01 (Vantage) and 03 (Strata) — the sunset, the travelling light — and
his single complaint about them was **readability**. Light that changes as you move is a
mechanic worth reusing. Unreadable text is not.

## THE RULE: six data models, six homes

Every variant must give **all six** of these a home that makes sense inside its world.
If your concept cannot house one of them naturally, the concept is wrong — pick another.
A data model must never be "a section lower down the page."

1. **The intro / about** — who he is, in one or two plain sentences.
2. **Work experience** — four roles (below).
3. **Projects** — things he built, and the ones that are live and clickable.
4. **Research publications** — three papers.
5. **Personal interests** — books, films, games. He reads.
6. **The surprises** — awards and trophies, what he is playing or reading right now,
   a small delight. This is the slot for something unexpected. It should feel found,
   not announced.

Write down, before you code, one line per model saying where it lives in your world.
E.g. for a room: *experience = the clothes in the closet; publications = the papers
stacked on the desk; interests = the bookshelf and the posters.*

## Alien, but obvious

"Alien" means it should not read as a web page: no header bar, no nav row, no stack of
full-width sections, no hero-then-cards. The map should be unfamiliar.

"Intuitive" means a person knows what to do within about two seconds, without a tutorial,
because the object is one they already understand. Drawers pull out. Windows light up.
Books come off a shelf. Never make him hunt for the interaction. If something is
clickable, it must look clickable at rest, not only on hover.

Both are required. An alien thing that needs explaining is a failure. A familiar web page
is also a failure.

## Simple

One idea, executed cleanly. Not five effects competing. A limited palette. Few materials.
If a decoration does not carry information, delete it. His existing portfolio is cluttered
with particles, trophies, arcade buttons and badge walls — the thing he is running from.

Restraint does not mean empty. Twelve of the first variants were empty and he hated them.
Every screen must have something real to read or look at.

## Readability is a hard requirement

His one complaint about the variants he liked. So:
- Body text at 15px or larger, line-height at least 1.55, max 70 characters per line.
- Text never sits directly on a busy image or a gradient without a solid or near-solid
  backing plate behind it. Contrast at least 4.5:1 against whatever is actually behind it.
- No thin light-grey type on a light ground. No text over the busiest part of a picture.

## Real content — use it, do not invent it

**Pranav Pushkar Mishra.** Metuchen, New Jersey. Computer science, University of Illinois
Chicago.

**Now — Founding LLM Engineer, Alfred_ (New York City, April 2026 to present).** A consumer
AI assistant managing people's email, calendar and daily obligations over text message,
chat and voice. 5,000+ subscribers in production. What he did there:
- Cut notification latency: email to text message from about 90 seconds to about 3. The
  security-code path from 189 seconds at p90 to instant.
- Replaced per-message model calls in the email-rules engine with a deterministic
  three-stage matcher. About 30% cheaper per user; ~98% of rules now created by chatting.
- Rebuilt working memory so the assistant cannot fabricate facts about your inbox —
  enforced by tests rather than by hoping the model behaves.
- Built an eval harness from scratch and a scanner that reads live production failures.

**DO NOT mention the "Execution Decision Layer" or "five verdicts" or "deterministic risk
scoring."** It was a small take-home assignment, the framing does not match shipped code,
and he is actively annoyed that it keeps surfacing. Leave it out entirely.

**Before:** AI Engineer at WheelPrice (remote, Charlotte NC, July 2025 – March 2026) —
computer-vision part fitment, and a CMS that took the site to 10–20k daily readers.
Research Software Engineer at UIC's V-ARE Labs (Chicago, Feb 2024 – present) — virtual
patients in Unreal Engine 5, and an audio ML pipeline at 98.52% accuracy.
Software Developer Intern at Bipolar Factory (Bengaluru, 2023) — a streaming platform on
the MERN stack, and in-game chat in Unity.

**Papers, three.**
- *A systematic framework for enterprise knowledge retrieval* — letting a model write
  metadata for each chunk before storing it. 82.5% precision against 73.3% for content
  alone. **Accepted, CAI 2026 at IEEE.** arxiv.org/pdf/2512.05411
- *TeamMedAgents* — the Big Five teamwork model from organisational psychology, built as
  real mechanisms between agents. Better on seven of eight medical benchmarks. **Under
  review, PAKDD 2026**, four citations. arxiv.org/pdf/2508.08115
- *Cost-efficient multi-modal medical reasoning with small models* — in preparation.

**Things he built** (real screenshots exist for all of these — use them):
| Thing | What it is | Image path under `/portfolio/public/assets/images/` |
|---|---|---|
| Stellarium | 107,000 astronomical objects in CAVE2, a room whose walls are screens | `game_design/stellarium.png`, `game_design/st1.png`, `game_design/st2.png` |
| SnAIder-Cut | Generative AI editing an augmented scene you stand inside. **Won MIT XR 2024** | `game_design/snaider.png`, `game_design/mit.jpeg` |
| EQUITY | An Unreal Engine 5 virtual patient for bias research in medicine | `game_design/equity.png`, `game_design/eq1.png`, `game_design/eq2.png` |
| Virtual Van Gogh | A walkable museum where the paintings are on a chain. **First at HINT 5.0** | `game_design/van%20gogh.jpg`, `game_design/virtual%20van.png` |
| Neon-Bites | Cyberpunk food delivery with the physics taken seriously | `game_design/neon.png`, `game_design/neon1.png` |
| AI Mafia | Language models playing a game about lying to each other | `game_design/mafia.png`, `game_design/mafia2.png` |
| Big5-Agents | The teamwork paper, as runnable code | `ai_ml/big5.png`, `ai_ml/big51.png` |
| SnakeAI-MLOps | Four RL methods racing on the same game. **Live and playable** | `ai_ml/snake.png` |
| Rusty ANT | Ants evolving, in Rust | `game_design/rust.png` |

**Live and clickable:** SnakeAI-MLOps (pranavmishra17.github.io/SnakeAI-MLOps/),
Alfred_ (get-alfred.ai), and the demo videos on the projects above.

**Links:** github.com/PranavMishra17 · linkedin.com/in/pranavgamedev · huggingface.co/Paranoiid

### Interests — the one place you must NOT invent

He has told us only this much: he **reads books**, he **loves films**, he **loves games**.
He has not told us which ones. Do not put specific titles in his mouth as favourites.

Build the interests furniture for real, then fill it with entries that are visibly slots,
and put one small honest line near them such as *"placeholders — swap these for the real
ones."* A believable-looking fake favourite is worse than an obvious empty shelf.

## Technical

- One self-contained `.html` file per variant, no build step, no framework.
- Served from the repo root at `http://localhost:4458`. Images live at
  `/portfolio/public/assets/images/...`. Filenames with spaces need `%20`.
- Google Fonts allowed. No other external resources. All other artwork must be CSS, SVG
  or canvas.
- Motion has mass: one overshoot, one settle. Leave the framer-motion spring config in a
  comment at each call site. No looping ambient effects on twelve elements at once.
- **`requestAnimationFrame` does not run in a hidden document.** Never gate first paint or
  a reveal solely on rAF, `load`, or `IntersectionObserver`. Always add a timeout fallback
  that lands the final state. This broke four variants last round.
- Honour `prefers-reduced-motion`. Works at 375px. Visible keyboard focus. Real `<button>`
  and `<a>` elements for anything interactive.
- Complete valid document ending in `</html>`.

## Banned

Cream `#F4F1EA` with terracotta `#D97757`. Near-black plus one acid accent. Identical
rounded cards in a grid. Tracked-out all-caps eyebrows above every heading. Meta strings
joined with middle dots. `LABEL — fragment` em-dash constructions. `→` on buttons.
`01 / 02 / 03` numbering unless it is genuinely a sequence. Monospace as the default for
small labels. Accenting one word of a headline in a different colour. A hero that is a big
number with a small label. Tech-stack badge walls. Keyword-soup project copy.
