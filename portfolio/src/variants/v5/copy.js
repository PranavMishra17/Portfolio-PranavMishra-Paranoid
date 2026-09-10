// Variant 5 — copy. Conversational, first person, his own framing. Facts from src/data/*.
import { projects, contactInfo, getImageWithFallback } from '../../data/projects';
import experiences from '../../data/experience';
import { publications } from '../../data/publications';

export const INTRO = {
  hello: 'Hey, I’m Pranav.',
  paragraphs: [
    'I’m an AI engineer. Right now I’m the founding LLM engineer at Alfred_, an assistant that runs people’s email, calendar and small obligations over text, chat and voice. Most of my time there goes into agentic systems and the evaluation harnesses and loops around them, which has been the heavy part.',
    'I’ve also built voice agents, chat agents, computer-vision features, and a long tail of small ML projects. Before all that I made games, and things for rooms whose walls are screens. I still do.',
    'Computer science at the University of Illinois Chicago. I live in Metuchen, New Jersey.',
  ],
  scrollHint: 'The sky keeps going as you scroll. My room is at the bottom.',
  photo: '/assets/images/default/profile_default.jpg',
  photoAlt: 'Pranav Mishra, smiling, with the Chicago skyline behind him in winter',
};

export const LINKS = [
  { label: 'GitHub', href: 'https://github.com/PranavMishra17' },
  { label: 'LinkedIn', href: contactInfo.linkedin },
  { label: 'Hugging Face', href: contactInfo.huggingFace },
  { label: 'Google Scholar', href: contactInfo.googleScholar },
  { label: 'Resume', href: '/resume' },
  { label: 'Email', href: `mailto:${contactInfo.email.personal}` },
];

// ---------- work ----------

const BANNED = /execution decision layer|five.verdict|deterministic risk scoring/i;

export const ALFRED = {
  lead: 'Alfred_ is a consumer assistant with 5,000+ subscribers. It reads your email, keeps your calendar and does the small obligations, over text message, chat and voice. I own the part that has to be reliable, which in practice means the memory, the rules engine, the eval harness and the speed.',
  figures: [
    { big: '90 s', to: '3 s', what: 'email to text message' },
    { big: '189 s', to: 'instant', what: 'security codes, at p90' },
    { big: '30%', what: 'cheaper per user, a matcher instead of a model call' },
    { big: '98%', what: 'of email rules made by chatting' },
    { big: '0', what: 'invented facts about your inbox, enforced by tests' },
  ],
  more: [
    'The working memory is rebuilt so the assistant cannot state a thing nobody told it. Tests fail if it drifts.',
    'The email-rules engine went from a model call on every message to a deterministic three-stage matcher.',
    'Notifications moved from polling to event-triggered dispatch, which is where the 90 seconds went.',
    'Postgres on Supabase is hardened with row-level security and SECURITY DEFINER RPCs. That work caught a cross-user data-leak class on default PUBLIC grants.',
    'The eval harness is mine from scratch, plus a scanner that reads live conversations for failures before anyone reports them.',
  ],
  url: 'https://get-alfred.ai/',
};

const ROLE = {
  'wheelprice-intern': {
    company: 'WheelPrice',
    title: 'AI engineer',
    when: 'July 2025 to March 2026, remote from Charlotte',
    line: 'Computer vision for part fitment, a content system that added 10–20k readers a day, and the OTP flow to production.',
  },
  'research-software-engineer-uic': {
    company: 'V-ARE Labs, UIC',
    title: 'Research software engineer',
    when: 'February 2024 to now, Chicago',
    line: 'Virtual patients in Unreal Engine 5, and an audio ML pipeline that reached 98.52% accuracy with real-time inference.',
  },
  'bipolar-factory-intern': {
    company: 'Bipolar Factory',
    title: 'Software developer intern',
    when: 'March to May 2023, Bengaluru',
    line: 'A MERN streaming platform on AWS, and in-game chat in Unity that lifted retention by 10%.',
  },
};

export const BEFORE = experiences
  .filter((e) => e.id !== 'alfred-founding-llm')
  .map((e) => ({
    id: e.id,
    company: (ROLE[e.id] || {}).company || e.company,
    title: (ROLE[e.id] || {}).title || e.title,
    when: (ROLE[e.id] || {}).when || `${e.duration}, ${e.location}`,
    line: (ROLE[e.id] || {}).line || '',
    details: (e.description || []).filter((b) => !BANNED.test(b)),
    website: e.links && e.links.website,
  }));

export const ALFRED_ROLE = experiences.find((e) => e.id === 'alfred-founding-llm');

// ---------- projects ----------

export const FEATURED_IDS = ['snaider-cut', 'mockflow-ai', 'stellarium', 'snakeai-mlops', 'soulengine', 'virtual-van-gogh'];

const LINES = {
  'snaider-cut': 'Say what you want changed and the augmented room changes. Won at MIT XR 2024.',
  'mockflow-ai': 'A mock interview that talks back. Four tracks, under 400 ms between you and it. Live.',
  stellarium: '107,000 astronomical objects in CAVE2, the room at UIC whose walls are screens.',
  'snakeai-mlops': 'Four reinforcement-learning methods racing at Snake. Q-learning, DQN, PPO, actor-critic. Playable.',
  soulengine: 'Game characters with memory, motives and their own agency. A TypeScript framework, any model.',
  'virtual-van-gogh': 'A museum you walk through, paintings held on a chain. First place at HINT 5.0.',
  'big5-agents': 'The teamwork paper as runnable code.',
  'equity-project': 'An Unreal Engine 5 patient, built with MetaHuman, for research into bias in medicine.',
  'mafia-agents': 'Language models playing a game about lying to each other.',
  'neon-bites': 'Cyberpunk food delivery with the physics taken seriously.',
  'rusty-ant': 'Ants evolving, in Rust.',
  'metadata-enrichment': 'The retrieval paper as a working system.',
  'auto-prompting': 'Segmentation with no training: cluster, then let a depth transformer draw the mask.',
  'streaming-digit-classifier': 'Spoken digits recognised as you say them. 98.52% accurate, under 2 ms.',
};
const ACTIONS = { 'snakeai-mlops': 'Play', 'mockflow-ai': 'Open', 'resume-craft-pro': 'Open', clausecraft: 'Open', 'flow-planner': 'Open' };

function first(s) {
  if (!s) return '';
  const m = s.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : s).trim();
}
function tagsFor(p, bucket) {
  const t = new Set();
  if (bucket === 'gameDesign') t.add('Game design');
  if (bucket === 'aiMl') t.add('ML');
  const hay = `${p.category} ${p.title} ${(p.techStack || []).join(' ')}`.toLowerCase();
  if (/agent/.test(hay)) t.add('Agents');
  if (/xr|mixed reality|cave|virtual|augmented|metahuman|spatial/.test(hay)) t.add('XR');
  if (/machine learning|pytorch|tensorflow|reinforcement|computer vision|deep learning|transformer|rag|embedding|llm|nlp|voice/.test(hay)) t.add('ML');
  if (['big5-agents', 'metadata-enrichment', 'inbedder', 'transformer-nmt', 'streaming-digit-classifier'].includes(p.id)) t.add('Research');
  return [...t];
}
function action(p) {
  if (ACTIONS[p.id]) return ACTIONS[p.id];
  if (p.websiteLink) return 'Open';
  if (p.demoLink && /youtu/.test(p.demoLink)) return 'Watch';
  if (p.demoLink) return 'Open';
  if (p.githubLink) return 'Code';
  return '';
}

export const ALL_PROJECTS = (() => {
  const seen = new Set();
  const out = [];
  for (const bucket of ['gameDesign', 'aiMl', 'misc']) {
    for (const p of projects[bucket] || []) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      const cat = bucket === 'gameDesign' ? 'game-design' : bucket === 'aiMl' ? 'ai-ml' : 'misc';
      out.push({
        id: p.id,
        title: p.title,
        name: p.title.split(':')[0].trim(),
        line: LINES[p.id] || first(p.description),
        image: getImageWithFallback(p.mainImage, cat),
        square: /van gogh/i.test(p.mainImage || ''),
        tags: tagsFor(p, bucket),
        link: p.websiteLink || p.demoLink || p.githubLink || '',
        action: action(p),
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

const PAPER = {
  metarag: { short: 'Enterprise knowledge retrieval with LLM-written metadata', line: 'Let the model write the metadata before anything is stored. Precision 82.5% against 73.3%.' },
  teammedagents: { short: 'TeamMedAgents', line: 'How human teams work, built into how agents work. Better on 7 of 8 medical benchmarks.' },
  'slm-teammedagents': { short: 'SLM-TeamMedAgents', line: 'The same clinical reasoning from small models, across text and images, for a fraction of the cost.' },
};
const STATUS = { ACCEPTED: 'Accepted', 'Under Review': 'Under review', 'Under Preparation': 'In preparation' };

export const PAPERS = publications.map((p) => ({
  id: p.id,
  title: p.title,
  short: (PAPER[p.id] || {}).short || p.title,
  line: (PAPER[p.id] || {}).line || '',
  status: STATUS[p.status] || p.status,
  accepted: p.status === 'ACCEPTED',
  venue: p.venue,
  citations: p.citationCount || 0,
  pdf: p.pdfLink,
  code: p.codeLink,
  tags: ['Research', 'ML', ...(/agent/i.test(p.title) ? ['Agents'] : [])],
}));

export const TROPHIES = [
  { id: 'mit', title: 'MIT XR 2024', line: 'Won, with SnAIder-Cut.', image: '/assets/images/achievements/mit.png' },
  { id: 'hint', title: 'HINT 5.0', line: 'First place, with Virtual Van Gogh.', image: '/assets/images/achievements/hint.png' },
];

export const ABOUT_LONG = [
  'I’m Pranav Pushkar Mishra. I live in Metuchen, New Jersey, and I studied computer science at the University of Illinois Chicago.',
  'Since April 2026 I have been the founding LLM engineer at Alfred_. My job is the part of an assistant that has to be boring: the memory that does not invent, the rule that fires without a model call, the notification that arrives in three seconds.',
  'Before that I built for CAVE2, for headsets and for game engines. I still do, in the evenings, in the room at the bottom of this page.',
];
