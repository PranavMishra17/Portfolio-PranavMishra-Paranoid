// Variant 4 — rewritten copy, keyed by the ids in src/data/*.
// Facts (dates, venues, metrics, links, image paths) stay in the data files.
// Only the wording lives here.

export const arrival = {
  headline: "I build the parts of an AI assistant that must not guess.",
  line: "Founding LLM engineer at Alfred_ in New York. Before that, and still, research software at UIC's V-ARE Labs in Chicago. I came up through game engines, and it shows.",
};

// The Alfred_ block. Bullet 4 of the data file is never rendered (see data.js).
export const alfred = {
  intro:
    "Alfred_ is an assistant that runs your email, calendar and daily obligations over text message, web chat and voice. About 5,000 people subscribe. I own the reliability layer: the risk-scored gate in front of every action, an eval harness written from nothing, a scanner that reads live conversations for failures, and a working memory rebuilt so the model cannot fabricate. That last one is enforced by tests, not by hoping.",
  measures: [
    { value: "90 s", to: "3 s", label: "An email reaching you as a text message", note: "polling replaced with event-triggered dispatch, about thirty times faster" },
    { value: "189 s", to: "instant", label: "A security code arriving, at the 90th percentile", note: "the same fix, extended to the login path" },
    { value: "30%", label: "Less spent on the model per person", note: "a deterministic three-stage matcher now does what a model call per message used to" },
    { value: "98%", label: "Of email rules made just by talking to it", note: "the product's stickiest feature, kept reliable at scale" },
    { value: "5,000+", label: "People it runs for", note: "TypeScript, Deno and Node, on Postgres" },
  ],
  aside:
    "Along the way I caught a class of cross-user data leaks in Postgres row security before it shipped, and made the migrations safe to run twice.",
};

// One line per earlier role, in his voice. Structure comes from experience.js.
export const roles = {
  "wheelprice-intern":
    "A computer-vision prototype for wheel and part fitment in PyTorch, and a blog CMS in React and Node that added 10 to 20 thousand daily readers. I also shipped the OTP verification to production.",
  "research-software-engineer-uic":
    "Virtual patients in Unreal Engine 5 and C++ with a Python REST backend, and an audio pipeline comparing MFCC, CNN and Transformer models that reached 98.52% accuracy with real-time inference.",
  "bipolar-factory-intern":
    "A streaming platform on the MERN stack, deployed to AWS with Jenkins, and an in-game chat in Unity for Metawood that lifted retention by 10%.",
};

// The projects on the page, in order. Five to eight; this is six.
export const picks = ["snaider-cut", "virtual-van-gogh", "stellarium", "mockflow-ai", "snakeai-mlops", "big5-agents"];

// One plain line per project, for the page and the overlay.
export const lines = {
  "snaider-cut": "Say what you want changed and the augmented room changes around you. Won the MIT XR Hackathon, 2024.",
  "virtual-van-gogh": "A museum you can walk through, with the paintings held as NFTs. First place at HINT 5.0.",
  stellarium: "107,000 astronomical objects rendered in real time inside CAVE2, a room whose walls are screens.",
  "mockflow-ai": "A voice mock interview you can take right now. Speech in, questions out, under 400 ms round trip.",
  "snakeai-mlops": "Four reinforcement-learning methods racing on one Snake game, in C++. Playable in the browser.",
  "big5-agents": "The TeamMedAgents paper as code you can run: agents that work as a team the way people do.",
  "mafia-agents": "Language models playing Mafia, a game about lying to each other convincingly.",
  "neon-bites": "A cyberpunk delivery game where the physics are taken seriously.",
  "equity-project": "A MetaHuman patient in Unreal Engine 5, built for research into bias in medicine.",
  "kill-motherboard": "A networked multiplayer game with its own client-server sync and lag compensation.",
  "sign-smash": "An Android first-person shooter that had to run well on cheap phones.",
  upsurge: "A mobile platformer with generated levels and a cloud leaderboard.",
  cracking: "An Android rail shooter, shipped to the Play Store.",
  "resume-craft-pro": "One-click resume tailoring, or a full LaTeX studio with an agent beside you.",
  soulengine: "A framework for game characters with memory, motive and the ability to act on their own.",
  "auto-prompting": "Object segmentation with no training, using clustering and a depth transformer to write the prompts.",
  "ai-avatar": "IVORY: a production retrieval system behind talking avatars for healthcare education.",
  "metadata-enrichment": "The enterprise retrieval paper as a working system: metadata written by a model before storage.",
  "realestate-ai": "A multilingual real-estate assistant with map-aware search.",
  "streaming-digit-classifier": "Spoken digits recognised as you say them; 98.52% accurate, under two milliseconds per guess.",
  "voicepersona-dataset": "80,000 voice samples paired with written character profiles, published on Hugging Face.",
  inbedder: "Text embeddings that follow an instruction, so the same sentence can mean different things to different queries.",
  "voiceforge-architecture": "A character's voice generated from a written description alone, with no recordings.",
  "youtube-comments-analysis": "Thousands of comments searched by meaning and sorted into what people actually said.",
  "flow-planner": "A browser agent that watches a workflow being done and writes it up.",
  clausecraft: "A document editor you talk to, with citations down to the line.",
  "resumecraft-optimizer": "LaTeX resumes rebuilt around a job description without breaking the layout.",
  "healthcare-automation-pipeline": "Patient triage and scheduling wired up as workflows, with the PHI kept encrypted.",
  "lunar-survival": "Pairs of agents arguing their way through NASA's lunar survival exercise.",
  "transformer-nmt": "A Transformer written from scratch, translating English to German.",
  microscopy: "A UNet finding hippocampus structures in electron microscopy.",
  "market-volatility": "Predicting trading volatility with an ensemble, and monitoring whether it keeps working.",
  "football-bayesian-analysis": "Expected goals, modelled with Bayesian networks.",
  unetplus: "UNet++ segmenting oral cancer in clinical images.",
  "pixel-punks": "Collaborative pixel art where every pixel is a transaction on Solana.",
  "complaint-hub-pro": "A complaint tracker with an admin side, public tracking, and the security middleware done properly.",
  "portfolio-website": "This site, in its previous life.",
  "rusty-ant": "Ants evolving, written in Rust, mostly to watch it happen.",
};

// Tag filters for the overlay. Chips: ml, game, agents, xr, research.
export const tags = {
  stellarium: ["game", "xr"],
  "mafia-agents": ["game", "agents"],
  "snakeai-mlops": ["ml", "game"],
  "neon-bites": ["game"],
  "snaider-cut": ["game", "xr"],
  "virtual-van-gogh": ["game", "xr"],
  "equity-project": ["game", "xr", "research"],
  "kill-motherboard": ["game"],
  "sign-smash": ["game"],
  upsurge: ["game"],
  cracking: ["game"],
  "mockflow-ai": ["agents", "ml"],
  "resume-craft-pro": ["agents"],
  soulengine: ["agents", "game"],
  "auto-prompting": ["ml", "research"],
  "big5-agents": ["agents", "research", "ml"],
  "ai-avatar": ["ml", "agents", "research"],
  "metadata-enrichment": ["ml", "research"],
  "realestate-ai": ["agents"],
  "streaming-digit-classifier": ["ml"],
  "voicepersona-dataset": ["ml"],
  inbedder: ["ml", "research"],
  "voiceforge-architecture": ["ml"],
  "youtube-comments-analysis": ["agents", "ml"],
  "flow-planner": ["agents"],
  clausecraft: ["agents"],
  "resumecraft-optimizer": ["agents"],
  "healthcare-automation-pipeline": ["agents"],
  "lunar-survival": ["agents"],
  "transformer-nmt": ["ml"],
  microscopy: ["ml"],
  "market-volatility": ["ml"],
  "football-bayesian-analysis": ["ml"],
  unetplus: ["ml"],
  "pixel-punks": [],
  "complaint-hub-pro": [],
  "portfolio-website": [],
  "rusty-ant": ["game"],
};

export const chips = [
  { key: "all", label: "Everything" },
  { key: "ml", label: "Machine learning" },
  { key: "game", label: "Game design" },
  { key: "agents", label: "Agents" },
  { key: "xr", label: "XR" },
  { key: "research", label: "Research" },
];

// Papers, one line each. Titles, venues, statuses and links come from publications.js.
export const papers = {
  metarag: {
    short: "Enterprise knowledge retrieval with metadata written by the model",
    line: "Have a language model write the metadata before anything is stored. Precision went to 82.5% against 73.3% without it.",
  },
  teammedagents: {
    short: "TeamMedAgents",
    line: "The Big Five model of how human teams work, built as real mechanisms between agents. Better on seven of eight medical benchmarks.",
  },
  "slm-teammedagents": {
    short: "SLM-TeamMedAgents",
    line: "Small models, 500 million to 27 billion parameters, working as a team and matching far larger ones at a fraction of the cost.",
  },
};

export const statusLabel = {
  ACCEPTED: "Accepted",
  "Under Review": "Under review",
  "Under Preparation": "In preparation",
};

export const about = {
  paras: [
    "I'm Pranav Pushkar Mishra. I studied computer science at the University of Illinois Chicago, and I'm now the founding LLM engineer at Alfred_ in New York, where I own the reliability side of a multi-agent assistant that 5,000 people depend on.",
    "I still work with UIC's V-ARE Labs on virtual patients and on multi-agent research for medical decision-making, which is where the papers come from.",
    "I came up through game development: Unity, Unreal, XR, a few things that won hackathons. It still shapes how I want software to feel when you touch it.",
  ],
};

export const trophies = [
  {
    id: "mit-xr-2024",
    title: "MIT XR Hackathon, 2024",
    result: "Winner, with SnAIder-Cut",
    line: "Generative AI editing an augmented-reality scene while you stand in it.",
    image: "/assets/images/achievements/mit.png",
    projectId: "snaider-cut",
  },
  {
    id: "hint-5",
    title: "HINT 5.0",
    result: "First place, with Virtual Van Gogh",
    line: "A walkable museum with the paintings held on a chain.",
    image: "/assets/images/achievements/hint.png",
    projectId: "virtual-van-gogh",
  },
];

export const room = {
  intro: "My room, from the bachelor days. Everything in it opens.",
};
