// Variant 1 — rewritten copy, keyed by the ids in src/data/*.
// Facts (numbers, dates, venues, links, image paths) come from the data files; only the wording is mine.
import { projects, contactInfo, getImageWithFallback } from '../../data/projects';
import experiences from '../../data/experience';
import { publications } from '../../data/publications';

// ---------- projects ----------

// The seven that go on the page, in this order. Everything else lives in the overlay.
export const FEATURED_IDS = [
  'snaider-cut',
  'stellarium',
  'snakeai-mlops',
  'big5-agents',
  'mockflow-ai',
  'equity-project',
  'virtual-van-gogh',
];

// One plain line each, first person, facts preserved.
const PROJECT_LINES = {
  'snaider-cut': 'Say what you want changed and the augmented room changes around you. Won at MIT XR 2024.',
  stellarium: '107,000 astronomical objects rendered in real time inside CAVE2, a room whose walls are screens.',
  'snakeai-mlops': 'Four reinforcement-learning methods racing on one Snake game: Q-learning, DQN, PPO and actor-critic. Live and playable.',
  'big5-agents': 'The TeamMedAgents paper as runnable code. The Big Five teamwork model built as real mechanisms between agents.',
  'mockflow-ai': 'A voice mock-interview platform with four tracks and under 400 ms from your words to its reply. Live.',
  'equity-project': 'A virtual patient built in Unreal Engine 5 with MetaHuman, made for research into bias in medicine.',
  'virtual-van-gogh': 'A museum you can walk through, with the paintings held as NFTs. First place at HINT 5.0.',
  'mafia-agents': 'Language models playing a game about lying to each other.',
  'neon-bites': 'Cyberpunk food delivery with the physics taken seriously.',
  'rusty-ant': 'Ants evolving, written in Rust.',
  'metadata-enrichment': 'The retrieval paper as a working system: metadata written by a model before anything is stored.',
};

// Which word goes on the link.
const PROJECT_ACTIONS = {
  'snakeai-mlops': 'Play it',
  'mockflow-ai': 'Open it',
  'resume-craft-pro': 'Open it',
  clausecraft: 'Open it',
  'flow-planner': 'Open it',
};

const BUCKETS = [
  ['gameDesign', 'Game design'],
  ['aiMl', 'ML'],
  ['misc', 'Odds and ends'],
];

function tagsFor(p, bucketTag) {
  const t = new Set();
  if (bucketTag === 'Game design' || bucketTag === 'ML') t.add(bucketTag);
  const hay = `${p.category} ${p.title} ${(p.techStack || []).join(' ')}`.toLowerCase();
  if (/agent/.test(hay)) t.add('Agents');
  if (/xr|mixed reality|cave|virtual|augmented|metahuman|spatial/.test(hay)) t.add('XR');
  if (/machine learning|pytorch|tensorflow|reinforcement|computer vision|deep learning|transformer|rag|embedding|llm|nlp|voice/.test(hay)) t.add('ML');
  if (['big5-agents', 'metadata-enrichment', 'inbedder', 'transformer-nmt', 'streaming-digit-classifier'].includes(p.id)) t.add('Research');
  return [...t];
}

function firstSentence(s) {
  if (!s) return '';
  const m = s.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : s).trim();
}

function primaryLink(p) {
  return p.websiteLink || p.demoLink || p.githubLink || '';
}

function actionFor(p) {
  if (PROJECT_ACTIONS[p.id]) return PROJECT_ACTIONS[p.id];
  if (p.websiteLink) return 'Open it';
  if (p.demoLink && /youtu/.test(p.demoLink)) return 'Watch it';
  if (p.demoLink) return 'Open it';
  if (p.githubLink) return 'Read the code';
  return '';
}

// Every project, deduped by id, with tags and rewritten line where I have one.
export const ALL_PROJECTS = (() => {
  const seen = new Set();
  const out = [];
  for (const [key, bucketTag] of BUCKETS) {
    for (const p of projects[key] || []) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      const cat = key === 'gameDesign' ? 'game-design' : key === 'aiMl' ? 'ai-ml' : 'misc';
      out.push({
        id: p.id,
        title: p.title,
        line: PROJECT_LINES[p.id] || firstSentence(p.description),
        rewritten: Boolean(PROJECT_LINES[p.id]),
        image: getImageWithFallback(p.mainImage, cat),
        square: /van gogh/i.test(p.mainImage || ''),
        tags: tagsFor(p, bucketTag),
        link: primaryLink(p),
        action: actionFor(p),
        github: p.githubLink && !/tab=repositories/.test(p.githubLink) ? p.githubLink : '',
        tech: p.techStack || [],
      });
    }
  }
  return out;
})();

export const FEATURED = FEATURED_IDS.map((id) => ALL_PROJECTS.find((p) => p.id === id)).filter(Boolean);

export const TAGS = ['ML', 'Game design', 'Agents', 'XR', 'Research'];

// ---------- papers ----------

const PAPER_LINES = {
  metarag: 'Have the model write the metadata before anything is stored. Precision went from 73.3% to 82.5%.',
  teammedagents: 'The Big Five model of how human teams work, built as real mechanisms between language-model agents. Better on 7 of 8 medical benchmarks.',
  'slm-teammedagents': 'Whether small models can do the same clinical reasoning, across text and images, for a fraction of the cost.',
};

const PAPER_SHORT = {
  metarag: 'A systematic framework for enterprise knowledge retrieval',
  teammedagents: 'TeamMedAgents',
  'slm-teammedagents': 'SLM-TeamMedAgents',
};

const STATUS_WORD = {
  ACCEPTED: 'Accepted',
  'Under Review': 'Under review',
  'Under Preparation': 'In preparation',
};

export const PAPERS = publications.map((p) => ({
  id: p.id,
  title: p.title,
  short: PAPER_SHORT[p.id] || p.title,
  line: PAPER_LINES[p.id] || '',
  status: STATUS_WORD[p.status] || p.status,
  accepted: p.status === 'ACCEPTED',
  venue: p.venue,
  citations: p.citationCount || 0,
  pdf: p.pdfLink,
  code: p.codeLink,
  tags: ['Research', ...(/agent/i.test(p.title) ? ['Agents'] : []), 'ML'],
}));

// ---------- work ----------

const BANNED = /execution decision layer|five.verdict|deterministic risk scoring/i;

const ROLE_LINES = {
  'alfred-founding-llm':
    'I own the reliability side of a multi-agent assistant that runs 5,000+ people’s email, calendar and daily obligations over text message, chat and voice.',
  'wheelprice-intern':
    'A computer-vision prototype for part fitment, and a content system that grew daily readership by 10–20k. I also shipped the OTP verification to production.',
  'research-software-engineer-uic':
    'Virtual patients in Unreal Engine 5, a Python backend behind REST APIs, and an audio ML pipeline that reached 98.52% accuracy with real-time inference.',
  'bipolar-factory-intern':
    'A MERN streaming platform on AWS with Jenkins CI, and in-game chat in Unity that lifted retention by 10%.',
};

const ROLE_DETAILS = {
  'alfred-founding-llm': [
    'Rebuilt the assistant’s working memory so it cannot state something nobody told it. Tests fail if it drifts.',
    'Replaced a model call on every message with a deterministic three-stage matcher. About 30% cheaper per user, and roughly 98% of rules now get made by chatting.',
    'Moved notifications from polling to event-triggered dispatch. Email to text message went from about 90 seconds to about 3. Security codes went from 189 seconds at p90 to instant.',
    'Hardened Postgres on Supabase: row-level security and SECURITY DEFINER RPCs, which caught a cross-user data-leak class on default PUBLIC grants, plus collision-safe idempotent migrations.',
    'Built the eval harness from scratch, and a scanner that reads live conversations for production failures before a person has to report them.',
  ],
  'wheelprice-intern': [
    'End-to-end ML prototype for automotive part fitment in PyTorch, using computer-vision models.',
    'A CMS blog system in React and TypeScript on Node.js and MongoDB, with the SEO work that scaled daily readership by 10–20k.',
  ],
  'research-software-engineer-uic': [
    'Virtual patient system in Unreal Engine 5 and C++, with a Python backend and REST APIs for the data analysis.',
    'Audio ML pipeline on Flask comparing MFCC features, CNNs and Transformers. 98.52% accuracy, real-time inference with voice-activity detection and robustness testing.',
    'TeamMedAgents: a modular multi-agent system on Google ADK for medical QA across 8 benchmarks. 77.63% accuracy on LLMs and a 3.1× inference speedup on 4B models.',
  ],
  'bipolar-factory-intern': [
    'Data-driven streaming platform on the MERN stack with TypeScript, deployed to AWS with Jenkins CI/CD on Linux.',
    'In-game chat in C# and Unity for Metawood, with MongoDB and SQL tuning. Retention up 10%.',
  ],
};

const WHEN = {
  'alfred-founding-llm': 'April 2026 to now',
  'wheelprice-intern': 'July 2025 to March 2026',
  'research-software-engineer-uic': 'February 2024 to now',
  'bipolar-factory-intern': 'March to May 2023',
};

const WHERE = {
  'alfred-founding-llm': 'New York City',
  'wheelprice-intern': 'Charlotte, remote',
  'research-software-engineer-uic': 'Chicago',
  'bipolar-factory-intern': 'Bengaluru',
};

const COMPANY = {
  'alfred-founding-llm': 'Alfred_',
  'wheelprice-intern': 'WheelPrice',
  'research-software-engineer-uic': 'V-ARE Labs, UIC',
  'bipolar-factory-intern': 'Bipolar Factory',
};

const TITLE = {
  'wheelprice-intern': 'AI Engineer',
};

export const ROLES = experiences.map((e) => ({
  id: e.id,
  company: COMPANY[e.id] || e.company,
  title: TITLE[e.id] || e.title,
  when: WHEN[e.id] || e.duration,
  where: WHERE[e.id] || e.location,
  current: Boolean(e.isCurrent) || /present/i.test(e.duration),
  line: ROLE_LINES[e.id] || '',
  details: (ROLE_DETAILS[e.id] || e.description || []).filter((b) => !BANNED.test(b)),
  website: e.links && e.links.website,
  tech: e.techStack || [],
}));

export const ALFRED = ROLES.find((r) => r.id === 'alfred-founding-llm');

// The register on screen two. Every figure is in the Alfred_ entry of experience.js.
export const MEASUREMENTS = [
  { value: '5,000+', unit: '', what: 'people whose email, calendar and daily obligations run through it' },
  { value: '90 s', arrow: '3 s', what: 'from an email arriving to the text message about it' },
  { value: '189 s', arrow: 'instant', what: 'for a security code to reach you, at the 90th percentile' },
  { value: '30%', unit: 'less', what: 'model cost per user, after a deterministic matcher replaced a model call on every message' },
  { value: '98%', unit: '', what: 'of email rules made by chatting, not by filling in a form' },
  { value: '0', unit: 'invented facts', what: 'working memory rebuilt so fabrication is structurally impossible, enforced by tests' },
];

// ---------- about ----------

export const ABOUT = {
  name: 'Pranav Pushkar Mishra',
  short: 'Pranav Mishra',
  place: 'Metuchen, New Jersey',
  opening: 'I build the parts of an AI assistant that have to be right.',
  lines: [
    'Founding LLM engineer at Alfred_ in New York. Computer science at the University of Illinois Chicago. Before that, rooms whose walls are screens, and games.',
  ],
  longer: [
    'I’m Pranav Pushkar Mishra. I live in Metuchen, New Jersey, and I studied computer science at the University of Illinois Chicago.',
    'Since April 2026 I’ve been the founding LLM engineer at Alfred_, an assistant that runs people’s email, calendar and small obligations over text message, chat and voice. My job is the part that has to be reliable: the memory that cannot make things up, the rules engine that does not need a model call, the notification that arrives in three seconds instead of ninety.',
    'Before that I built for rooms whose walls are screens, for headsets, and for game engines. I still do, in the evenings.',
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/PranavMishra17' },
    { label: 'LinkedIn', href: contactInfo.linkedin },
    { label: 'Hugging Face', href: contactInfo.huggingFace },
    { label: 'Google Scholar', href: contactInfo.googleScholar },
    { label: 'Email', href: `mailto:${contactInfo.email.personal}` },
  ],
  alfredUrl: 'https://get-alfred.ai/',
};

export const TROPHIES = [
  {
    id: 'mit-xr',
    title: 'MIT XR 2024',
    line: 'Won, for SnAIder-Cut: generative AI editing an augmented room while you stand in it.',
    image: '/assets/images/achievements/mit.png',
    project: 'snaider-cut',
  },
  {
    id: 'hint',
    title: 'HINT 5.0',
    line: 'First place, for Virtual Van Gogh: a walkable museum with the paintings held as NFTs.',
    image: '/assets/images/achievements/hint.png',
    project: 'virtual-van-gogh',
  },
];
