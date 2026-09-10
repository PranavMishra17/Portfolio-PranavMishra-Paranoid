// Variant 3 — rewritten copy, keyed by the ids in src/data/*.
// Facts (metrics, dates, venues, links, image paths) come from the data files;
// only the wording lives here, in plain first person.

export const arrival = {
  headline:
    'I work on the part of an AI assistant that has to be trustworthy: what it remembers, what it is allowed to do, and how quickly it gets back to you.',
  sub:
    'Founding LLM engineer at Alfred_ in New York, since April 2026. Before that, research software at the University of Illinois Chicago — virtual patients, audio models, and a couple of hackathon wins in XR. Home is Metuchen, New Jersey.',
};

// The current role, written as a short lede plus a register of measurements.
// Every number below is taken from the Alfred_ bullets in src/data/experience.js.
export const experienceCopy = {
  'alfred-founding-llm': {
    lede:
      'Alfred_ runs your email, your calendar and the small obligations in between, over text message, chat and voice. Around five thousand people subscribe. I own the reliability layer: the evaluation harness, a scanner that reads live conversations for failures, the gating that decides what the agent may do, and the working memory I rebuilt so the model cannot state something it was never told — enforced by tests, not by hoping.',
    measures: [
      { label: 'People on it', value: '5,000+', note: 'active subscribers in production' },
      { label: 'Email to text message', value: '90 s → 3 s', note: 'about thirty times faster, by moving from polling to event-triggered dispatch' },
      { label: 'Security codes, p90', value: '189 s → instant', note: 'the same change, extended to the OTP path' },
      { label: 'Cost of the rules engine, per user', value: '−30%', note: 'a deterministic three-stage matcher instead of a model call on every message' },
      { label: 'Rules people create by chatting', value: '~98%', note: 'the stickiest feature in the product, and it now writes itself' },
      { label: 'Made-up facts about your inbox', value: 'none', note: 'working memory rebuilt so fabrication is structurally impossible; the tests fail if it drifts' },
    ],
  },
  'wheelprice-intern': {
    line:
      'A computer-vision prototype for wheel and part fitment in PyTorch, and a CMS blog system in React, TypeScript and Node that lifted daily viewership by 10–20k. Shipped the OTP verification system to production.',
  },
  'research-software-engineer-uic': {
    line:
      'A virtual patient in Unreal Engine 5 and C++ for bias research, with a Python REST backend. An audio pipeline comparing MFCC, CNN and Transformer models — 98.52% accuracy, with real-time inference and voice-activity detection.',
  },
  'bipolar-factory-intern': {
    line:
      'A MERN streaming platform on AWS with Jenkins CI, and an in-game chat feature in Unity and C# that raised retention by 10%.',
  },
};

// The seven that go on the page, in order. Everything else lives in the overlay.
export const featuredIds = [
  'snaider-cut',
  'virtual-van-gogh',
  'stellarium',
  'mockflow-ai',
  'big5-agents',
  'snakeai-mlops',
  'equity-project',
];

// Tag keys: ml · game · agents · xr · research
export const projectCopy = {
  'snaider-cut': { name: 'SnAIder-Cut', line: 'Describe a change and the augmented room changes around you. Won the MIT XR Hackathon, 2024.', tags: ['xr', 'agents', 'game'], cta: 'Watch' },
  'virtual-van-gogh': { name: 'Virtual Van Gogh', line: 'A museum you can walk through, with the works held on-chain. First place at HINT 5.0.', tags: ['xr', 'game'], cta: 'Watch' },
  stellarium: { name: 'Stellarium', line: '107,000 astronomical objects rendered in real time inside CAVE2, a room whose walls are screens.', tags: ['xr'], cta: 'Watch' },
  'mockflow-ai': { name: 'MockFlow-AI', line: 'Voice mock interviews with a multi-agent interviewer — under 400 ms from your words to its reply.', tags: ['agents', 'ml'], cta: 'Watch' },
  'big5-agents': { name: 'Big5-Agents', line: 'The TeamMedAgents paper as runnable code: a Big Five teamwork model between diagnosing agents.', tags: ['agents', 'ml', 'research'], cta: 'Code' },
  'snakeai-mlops': { name: 'SnakeAI-MLOps', line: 'Four reinforcement-learning methods racing on one Snake board. Live and playable.', tags: ['ml', 'game'], cta: 'Play' },
  'equity-project': { name: 'EQUITY', line: 'A MetaHuman patient in Unreal Engine 5, built for research into bias in medicine.', tags: ['xr', 'research'], cta: 'Watch' },
  'mafia-agents': { name: 'AI Mafia', line: 'Language models playing a social-deduction game against each other.', tags: ['agents', 'game'], cta: 'Code' },
  'neon-bites': { name: 'Neon-Bites', line: 'A cyberpunk delivery game with the physics taken seriously.', tags: ['game'], cta: 'Watch' },
  'rusty-ant': { name: 'Rusty ANT', line: 'Ants evolving in a 2D simulation, written in Rust.', tags: ['game'], cta: 'Code' },
  soulengine: { name: 'SoulEngine', line: 'A TypeScript framework for game NPCs with memory, motives and the ability to act in the world.', tags: ['agents', 'game'], cta: 'Code' },
  'resume-craft-pro': { name: 'Resume-Craft-Pro', line: 'One-click resume optimisation, or a LaTeX studio with an AI editor beside you.', tags: ['agents'], cta: 'Open' },
  'auto-prompting': { name: 'Auto-Prompting for PaintSeg', line: 'Training-free segmentation: k-means prompts feeding a dense-prediction transformer.', tags: ['ml'], cta: 'Code' },
  'ai-avatar': { name: 'IVORY', line: 'A production RAG system behind conversational avatars for healthcare education.', tags: ['ml', 'research'], cta: 'Watch' },
  'metadata-enrichment': { name: 'MetaRAG', line: 'The paper’s pipeline: metadata written by a language model before anything is stored.', tags: ['ml', 'research'], cta: 'Code' },
  'realestate-ai': { name: 'KEYA', line: 'A multilingual, agentic real-estate search with geospatial analysis.', tags: ['agents'], cta: 'Code' },
  'streaming-digit-classifier': { name: 'Streaming Digit Classifier', line: 'Spoken-digit recognition in real time — 98.52% accuracy, under 2 ms inference.', tags: ['ml', 'research'], cta: 'Code' },
  'voicepersona-dataset': { name: 'VoicePersona', line: '80,000+ voice samples with character profiles, published on Hugging Face.', tags: ['ml'], cta: 'Dataset' },
  inbedder: { name: 'InBedder', line: 'Instruction-following text embeddings, implemented and evaluated across tasks.', tags: ['ml', 'research'], cta: 'Code' },
  'voiceforge-architecture': { name: 'VoiceForge', line: 'Character voices from a text description alone, no voice actor required.', tags: ['ml'], cta: 'Code' },
  'youtube-comments-analysis': { name: 'Comments Probe', line: 'Semantic search and LLM categorisation over comment threads.', tags: ['ml', 'agents'], cta: 'Code' },
  'flow-planner': { name: 'Flow Planner', line: 'Browser agents that watch a workflow and write the documentation for it.', tags: ['agents'], cta: 'Open' },
  clausecraft: { name: 'ClauseCraft', line: 'A document editor you talk to, with line-level citations.', tags: ['agents'], cta: 'Open' },
  'resumecraft-optimizer': { name: 'ResumeCraft', line: 'LLM-driven LaTeX resume optimisation with keyword tracking.', tags: ['ml'], cta: 'Code' },
  'healthcare-automation-pipeline': { name: 'Patient Care Automation', line: 'HIPAA-conscious triage and scheduling automation built on n8n.', tags: ['agents'], cta: 'Code' },
  'lunar-survival': { name: 'NASA Lunar Survival', line: 'Paired agents reasoning through NASA’s lunar survival exercise.', tags: ['agents'], cta: 'Code' },
  'transformer-nmt': { name: 'Transformer NMT', line: 'A Transformer for English–German translation, written from the paper.', tags: ['ml'], cta: 'Code' },
  microscopy: { name: 'Microscopy Segmentation', line: 'UNet segmentation of hippocampus electron-microscopy images.', tags: ['ml'], cta: 'Code' },
  'market-volatility': { name: 'Market Volatility', line: 'Ensemble models predicting trading volatility.', tags: ['ml'], cta: 'Code' },
  'football-bayesian-analysis': { name: 'Football Analytics', line: 'Bayesian networks and expected goals for football decisions.', tags: ['ml'], cta: 'Code' },
  unetplus: { name: 'UNet++ Oral Cancer', line: 'UNet++ segmentation for oral-cancer detection.', tags: ['ml', 'research'], cta: 'Code' },
  'kill-motherboard': { name: 'Kill the Motherboard', line: 'A networked multiplayer game with a client-server architecture.', tags: ['game'], cta: 'Watch' },
  'sign-smash': { name: 'Sign Smash', line: 'An Android first-person shooter with adaptive difficulty.', tags: ['game'], cta: 'Watch' },
  upsurge: { name: 'Upsurge', line: 'A mobile platformer with procedural levels and cloud leaderboards.', tags: ['game'], cta: 'Watch' },
  cracking: { name: 'Cracking', line: 'An Android rail shooter on the Play Store.', tags: ['game'], cta: 'Watch' },
  'pixel-punks': { name: 'Pixel Punks', line: 'Collaborative pixel art on Solana, drawn by many hands at once.', tags: [], cta: 'Code' },
  'complaint-hub-pro': { name: 'Complaint Hub Pro', line: 'A complaint-tracking system with an admin dashboard and public tracking.', tags: [], cta: 'Watch' },
  'portfolio-website': { name: 'Portfolio', line: 'The site before this one.', tags: [], cta: 'Code' },
};

export const paperCopy = {
  metarag: { line: 'Have the model write the metadata before anything is stored. Retrieval precision went from 73.3% to 82.5%.' },
  teammedagents: { line: 'Salas’s Big Five model of how human teams work, built as mechanisms between agents. Better on 7 of 8 medical benchmarks.' },
  'slm-teammedagents': { line: 'Whether small models, 500M to 27B parameters, working as a team can match 100B+ models on clinical reasoning at a fraction of the cost.' },
};

export const statusLabel = {
  ACCEPTED: 'Accepted',
  'Under Review': 'Under review',
  'Under Preparation': 'In preparation',
};

export const tagList = [
  { key: 'ml', label: 'ML' },
  { key: 'game', label: 'Game design' },
  { key: 'agents', label: 'Agents' },
  { key: 'xr', label: 'XR' },
  { key: 'research', label: 'Research' },
];

// The two trophies. Both are facts already in src/data/projects.js.
export const trophies = [
  { id: 'mit-xr-2024', title: 'MIT XR Hackathon 2024', line: 'Winner, with SnAIder-Cut.', projectId: 'snaider-cut', image: '/assets/images/achievements/mit.png' },
  { id: 'hint-5', title: 'HINT 5.0', line: 'First place, with Virtual Van Gogh.', projectId: 'virtual-van-gogh', image: '/assets/images/achievements/hint.png' },
];

export const links = {
  github: 'https://github.com/PranavMishra17',
  linkedin: 'https://www.linkedin.com/in/pranavgamedev/',
  huggingface: 'https://huggingface.co/Paranoiid',
  alfred: 'https://get-alfred.ai/',
  resume: '/resume',
};
