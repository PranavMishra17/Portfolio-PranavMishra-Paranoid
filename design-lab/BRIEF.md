# Design lab brief — Pranav Mishra, personal site

You are building ONE THROWAWAY VISUAL PROTOTYPE per concept. The client will look at
all 12 side by side and pick a direction. Your job is to make yours the one he picks.

## The client, in his own words

> "emptiness, landscape and me — simplified serene"
> "just the talking points, in my own words, no tags, no buzz, no flashes"
> "I want my personal website to look like a landscape — to feel like a beautiful
> sunset, or sunrise, or an alien world — away from all the noise of the internet"
> "Reject standard SaaS grid layouts, typical navigation sidebars, and predictable
> component styling. Design an experience-first, highly atmospheric interface.
> Elements must not simply fade in; choreograph their layout transitions with a
> heavy, fast spring-physics motion that gives components tangible mass and impact."
> "I love movies, games, idk what — surprise me, inspire me"

He is a Founding LLM Engineer. He has an existing portfolio he is sick of: three neon
section colors, four typefaces, a canvas particle field, an arcade CTA, trophy pop-ups,
walls of tech-stack badges, and project copy stuffed with industry keywords. Do not
produce anything that rhymes with that.

## The one tension — resolve it, don't dodge it

"Serene, no flashes" and "heavy fast spring physics" are not opposites here.
He wants **MASS, not sparkle**. Things should arrive with weight and settle — like a
heavy door closing, a slab of stone landing, a camera rig locking into position. One
overshoot, one settle, done. Never: twinkles, glitch, neon flicker, confetti, looping
ambient shimmer on twelve elements at once, or a fade-and-slide-up on every section.

Motion budget: ONE choreographed page-load sequence, and motion that answers what the
person actually does (scroll, open, hover a specific thing). That's it.

## Real content — use it verbatim in spirit, rewrite the phrasing into plain first person

He is **Pranav Pushkar Mishra**. Based in Metuchen, NJ. CS, University of Illinois Chicago.

**Now — Founding LLM Engineer, Alfred_ (New York City, April 2026 – present).**
Alfred_ is a consumer AI executive assistant: a multi-agent LLM system that manages
people's email, calendar and daily obligations over SMS, web chat and voice. 5,000+
active subscribers in production. What he owns there:
- The reliability layer. Risk-scored gating, an eval harness built from scratch, a
  production-failure scanner that reads live conversations, and a re-architected working
  memory that makes LLM fabrication structurally impossible — enforced by tests, not by
  hoping the model behaves.
- The email-rules engine, the product's stickiest feature. He replaced per-message LLM
  calls with a deterministic three-stage matcher: ~30% cheaper per user, and ~98% of
  rules now get created just by talking to it.
- Notification latency: email to SMS went from ~90 seconds to ~3. The security/OTP path
  went from 189s at p90 to instant.
- The Execution Decision Layer: every action the agent wants to take passes a five-verdict
  router — SILENT, NOTIFY, CONFIRM, CLARIFY, REFUSE — with deterministic risk scoring
  (not an LLM judging itself), a pending-obligations queue, and a bounded undo window.

**Before:** AI Engineer at WheelPrice (remote, Charlotte NC, Jul 2025 – Mar 2026).
Research Software Engineer at UIC's V-ARE Labs (Chicago, Feb 2024 – present) — virtual
patient systems in Unreal Engine 5, and an audio ML pipeline at 98.52% accuracy.
Software Developer Intern at Bipolar Factory (Bengaluru, 2023).

**Research — 3 papers.**
- "A Systematic Framework for Enterprise Knowledge Retrieval" — LLM-generated metadata to
  improve RAG. ACCEPTED, CAI 2026 / IEEE. arXiv 2512.05411.
- "TeamMedAgents: Enhancing Medical Decision-Making of LLMs Through Teamwork" — porting
  Salas's Big Five teamwork model into a multi-agent system; improvements on 7 of 8
  medical benchmarks. Under review, PAKDD 2026. arXiv 2508.08115. 4 citations.
- A third paper on cost-efficient multi-modal medical reasoning with small language models.

**Things he built** (~32 total; these are the ones worth showing):
- **Stellarium** — a CAVE2 VR application rendering 107,000+ astronomical objects in real time.
- **SnAIder-Cut** — generative AI editing an AR scene live. Won MIT XR Hackathon 2024.
- **Virtual Van Gogh** — a walkable NFT museum. First place, HINT 5.0.
- **EQUITY** — an Unreal Engine 5 MetaHuman virtual patient, used for bias research in medicine.
- **TeamMedAgents / Big5-Agents** — the research system above, as running code.
- **SnakeAI-MLOps** — four reinforcement learning techniques racing each other in a C++ game.
- **Neon-Bites** — a cyberpunk delivery game.
- **Rusty ANT** — ant evolution simulated in Rust.

**Links:** github.com/PranavMishra17 · linkedin.com/in/pranavgamedev · huggingface.co/Paranoiid

### Copy rules
Write it as HIM, in plain sentences, first person, no salesmanship. "I made the assistant
stop making things up" beats "Architected enterprise-grade hallucination mitigation."
No tech-stack badge lists. No keyword soup. No exclamation marks. Short is better.
You may invent connective copy, but never invent a fact, a metric, or an employer.

## Hard technical constraints

- ONE self-contained `.html` file. No build step, no framework, no bundler.
- The ONLY permitted external resource is Google Fonts (`fonts.googleapis.com` +
  `fonts.gstatic.com`). NO images from the internet — every visual must be made with
  CSS, SVG, or `<canvas>`. Pick fonts deliberately; do not reach for Inter.
- Implement motion in vanilla JS/CSS, but this ports to React 19 + framer-motion 12 later.
  So: wherever you use a spring, leave a comment with the framer-motion equivalent, e.g.
  `/* framer: { type:'spring', stiffness: 420, damping: 26, mass: 1.4 } */`
- Honour `prefers-reduced-motion: reduce` — the page must be complete and beautiful with
  every animation switched off.
- Works down to 375px wide. Visible keyboard focus. Sufficient contrast on body text.
- Full page, roughly 4–6 distinct moments as you move through it. The opening moment
  must be the strongest thing in the file.
- Put a `<title>` on it and keep total file size under ~250KB.

## Banned — these are the tells of a generated page

- Cream `#F4F1EA` background + terracotta `#D97757`-ish accent. Instant disqualification.
- Near-black + one acid-green/vermilion accent.
- Identical rounded cards in a grid, all with the same `rgba(0,0,0,.1)` shadow.
- Tracked-out ALL-CAPS eyebrow labels above headings.
- Meta strings joined with middle dots (`A · B · C`).
- `LABEL — fragment` with a spaced em dash as a design device.
- Tinted near-black (`#0B0B0B`, `#111`) standing in for real black.
- Monospace for small data labels, by default.
- `→` appended to button and link text.
- `01 / 02 / 03` numbered markers unless the content is genuinely a sequence.
- Accenting exactly one word of a headline in a different color or italic.
- A hero that is a big number with a small label under it.

## Deliverable

Write your file(s) to `design-lab/` with the exact filename you are given.
Then reply with, per concept: 2 sentences on what the idea is, the palette hexes, the
typefaces, and the one motion moment you're most proud of. Do not paste the code back.
