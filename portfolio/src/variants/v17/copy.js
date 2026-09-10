// v17 — the words. Everything factual (titles, links, images, dates, venues, numbers) comes from
// src/data; this file only rewrites the descriptions in plain first person and picks which
// projects to show. Nothing here is invented.

export const INTRO =
  "I'm Pranav Mishra. I'm the founding LLM engineer at Alfred_ in New York, where I make a multi-agent assistant behave — evals, gating, memory, the parts that have to be right. Before that: research at UIC's V-ARE lab, a stretch of ML work at WheelPrice, and several years of making games.";

// ids from src/data/projects.js, in the order they appear on the page
export const PICKS = [
  'mockflow-ai',
  'soulengine',
  'big5-agents',
  'metadata-enrichment',
  'ai-avatar',
  'snakeai-mlops',
  'stellarium',
  'equity-project',
];

export const PROJECT_COPY = {
  'mockflow-ai': {
    name: 'MockFlow-AI',
    kicker: 'Voice interviews, live',
    body:
      'A voice mock-interview platform. Four tracks — intro, behavioural, technical voice, technical coding — run by a state machine that decides when a stage is actually done, rather than a timer. Streaming STT → LLM → TTS over WebSockets keeps the round trip under 400 ms, about 5× faster than the polling version I started with.',
    tags: ['Python', 'LiveKit', 'Deepgram', 'Silero VAD', 'Supabase'],
  },
  soulengine: {
    name: 'SoulEngine',
    kicker: 'NPCs that remember',
    body:
      'A TypeScript framework for game characters with memory, motive and agency. Layered memory on scheduled cycles (daily, weekly, and a slower personality drift), four voice conversation modes, tool calls into the game world over MCP, and a web editor to test it all live. Works with Gemini, OpenAI, Anthropic or Grok.',
    tags: ['TypeScript', 'Hono', 'MCP', 'Deepgram', 'Cartesia'],
  },
  'big5-agents': {
    name: 'Big5 Agents',
    kicker: 'The code behind TeamMedAgents',
    body:
      'Several LLM agents diagnose together using six teamwork behaviours borrowed from organisational psychology — leadership, mutual monitoring, closed-loop communication and the rest — each one a mechanism you can switch on or off. Improved results on 7 of 8 medical benchmarks.',
    tags: ['Python', 'Multi-agent', 'Healthcare AI'],
  },
  'metadata-enrichment': {
    name: 'MetaRAG',
    kicker: 'The system from my accepted paper',
    body:
      'LLM-generated metadata attached to document chunks before they are embedded, then a proper comparison of chunking strategies. Recursive chunking with TF-IDF-weighted embeddings reached 82.5% precision against 73.3% for content-only retrieval, and the enriched index was faster to query, not slower.',
    tags: ['LangChain', 'Vector embeddings', 'Information retrieval'],
  },
  'ai-avatar': {
    name: 'IVORY',
    kicker: 'A conversational avatar for healthcare education',
    body:
      "A production RAG system for UIC's V-ARE lab. Documents go in, a talking avatar comes out, with Azure Speech for the voice and a deployment pipeline the lab still runs.",
    tags: ['Python', 'Azure AI', 'Production RAG'],
  },
  'snakeai-mlops': {
    name: 'SnakeAI-MLOps',
    kicker: 'Four kinds of agent, one old game',
    body:
      'Snake, played by Q-learning, DQN, PPO and actor-critic agents. The game is C++ and SFML, training is PyTorch, and inference runs through LibTorch so the trained agents play inside the real game rather than a Python stand-in.',
    tags: ['C++', 'PyTorch', 'LibTorch', 'Docker'],
  },
  stellarium: {
    name: 'Stellarium',
    kicker: 'A space simulation for the CAVE2',
    body:
      'A VR space simulation rendering 107,000+ astronomical objects on the CAVE2 wall. Most of the work was keeping it real-time: culling and GPU instancing so the whole catalogue could be on screen at once.',
    tags: ['Unity', 'C#', 'CAVE2', 'GPU instancing'],
  },
  'equity-project': {
    name: 'EQUITY',
    kicker: 'A virtual patient for bias research',
    body:
      'A virtual patient built in Unreal Engine 5 with MetaHuman, used in a study on bias in medicine. Facial animation, branching dialogue, and a performance budget that has to hold on ordinary lab machines.',
    tags: ['Unreal Engine 5', 'MetaHuman', 'C++'],
  },
};

// ids from src/data/experience.js
export const EXPERIENCE_COPY = {
  'alfred-founding-llm':
    'I own the reliability layer of a multi-agent assistant with 5,000+ subscribers: risk-scored gating on what the agent is allowed to do, an eval harness built from scratch, a scanner for production failures, and a re-architected working memory. I rebuilt the email-rules engine as a deterministic matcher (about 30% less LLM cost per user) and moved notifications from polling to events — email-to-SMS went from ~90 s to ~3 s.',
  'wheelprice-intern':
    'An ML prototype for automotive part-fitment prediction in PyTorch, plus a fair amount of full-stack work: a CMS blog system in React, TypeScript, Node and MongoDB that grew daily viewership by 10–20k, and the OTP verification system.',
  'research-software-engineer-uic':
    'A virtual patient in Unreal Engine and C++ with a Python REST backend, and an audio ML pipeline comparing MFCC features, CNNs and Transformers — 98.52% accuracy, deployed with real-time inference. Also where TeamMedAgents came from: 77.63% accuracy and a 3.1× inference speedup on 4B models through structured deliberation.',
  'bipolar-factory-intern':
    'A streaming platform on the MERN stack with TypeScript, deployed to AWS with Jenkins. And an in-game chat feature in Unity and C# for Metawood, which lifted retention by 10%.',
};

// ids from src/data/publications.js
export const PAPER_NOTES = {
  metarag: 'LLM-written metadata on document chunks makes retrieval both better and faster; compares three chunking strategies.',
  teammedagents: 'Human teamwork theory implemented as agent mechanisms, evaluated across eight medical benchmarks.',
  'slm-teammedagents': 'The same idea with small models (500M–27B parameters), matching much larger ones on text and beating them on medical images.',
};

export const INTERESTS_LINE =
  "These are empty on purpose. I haven't written them yet, and I'd rather leave a blank than make something up.";
