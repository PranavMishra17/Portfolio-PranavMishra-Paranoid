// Variant 2 — its own rewritten copy, keyed by the ids in src/data/*.
// Facts come from the data files. Only the wording is new, and it is first person.
import { projects, contactInfo, getImageWithFallback } from '../../data/projects';
import experiences from '../../data/experience';
import { publications } from '../../data/publications';

// ---------- projects ----------

export const FEATURED_IDS = ['snaider-cut', 'stellarium', 'snakeai-mlops', 'mockflow-ai', 'big5-agents', 'virtual-van-gogh'];

const LINES = {
  'snaider-cut': 'You describe the change out loud and the augmented room makes it. Won at MIT XR 2024.',
  stellarium: '107,000 stars and planets in CAVE2, the room at UIC whose walls are screens.',
  'snakeai-mlops': 'Q-learning, DQN, PPO and actor-critic racing each other at Snake. Playable in the browser.',
  'mockflow-ai': 'A mock interview that talks back. Four tracks, under 400 milliseconds between you and it.',
  'big5-agents': 'The teamwork paper as code you can run. The Big Five, built as mechanisms between agents.',
  'virtual-van-gogh': 'A museum you walk through, paintings held on a chain. First place at HINT 5.0.',
  'equity-project': 'An Unreal Engine 5 patient, built with MetaHuman, for research into bias in medicine.',
  'mafia-agents': 'Language models playing a game whose whole point is lying to each other.',
  'neon-bites': 'Cyberpunk food delivery where the physics matter.',
  'rusty-ant': 'Ants evolving, in Rust.',
  'metadata-enrichment': 'The retrieval paper as a working system.',
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

const PAPER_LINES = {
  metarag: 'Let the model write the metadata before anything is stored. Precision 82.5% against 73.3% without it.',
  teammedagents: 'How human teams work, built into how agents work. Better on 7 of 8 medical benchmarks. Cited 4 times so far.',
  'slm-teammedagents': 'The same clinical reasoning from small models, across text and images, at a fraction of the cost.',
};
const PAPER_SHORT = { metarag: 'Enterprise knowledge retrieval with LLM-written metadata', teammedagents: 'TeamMedAgents', 'slm-teammedagents': 'SLM-TeamMedAgents' };
const STATUS = { ACCEPTED: 'Accepted', 'Under Review': 'Under review', 'Under Preparation': 'In preparation' };

export const PAPERS = publications.map((p) => ({
  id: p.id,
  title: p.title,
  short: PAPER_SHORT[p.id] || p.title,
  line: PAPER_LINES[p.id] || '',
  status: STATUS[p.status] || p.status,
  accepted: p.status === 'ACCEPTED',
  venue: p.venue,
  citations: p.citationCount || 0,
  pdf: p.pdfLink,
  code: p.codeLink,
  tags: ['Research', 'ML', ...(/agent/i.test(p.title) ? ['Agents'] : [])],
}));

// ---------- work ----------

const BANNED = /execution decision layer|five.verdict|deterministic risk scoring/i;

const ROLE = {
  'alfred-founding-llm': {
    company: 'Alfred_',
    title: 'Founding LLM engineer',
    year: '2026',
    when: 'April 2026 to now',
    where: 'New York City',
    line: 'An assistant that runs 5,000+ people’s email, calendar and small obligations over text, chat and voice. I own the part that has to be reliable.',
    details: [
      'Rebuilt working memory so the assistant cannot state a thing nobody told it. The tests fail if it drifts.',
      'Took the model out of the email-rules engine. A deterministic three-stage matcher does the job, about 30% cheaper per user, and roughly 98% of rules are now made by chatting.',
      'Email to text message: about 90 seconds down to about 3, by moving from polling to event-triggered dispatch. Security codes: 189 seconds at p90 down to instant.',
      'Postgres on Supabase hardened with row-level security and SECURITY DEFINER RPCs. That work caught a cross-user data-leak class on default PUBLIC grants.',
      'An eval harness from scratch, and a scanner that reads live conversations for failures before anyone has to report them.',
    ],
  },
  'wheelprice-intern': {
    company: 'WheelPrice',
    title: 'AI engineer',
    year: '2025',
    when: 'July 2025 to March 2026',
    where: 'Charlotte, remote',
    line: 'Computer vision for part fitment, and a content system that added 10–20k readers a day.',
    details: [
      'An end-to-end PyTorch prototype that predicts whether a part fits a car from images.',
      'A CMS blog system in React and TypeScript on Node and MongoDB, with the SEO work behind the readership growth.',
      'Shipped the OTP verification flow to production.',
    ],
  },
  'research-software-engineer-uic': {
    company: 'V-ARE Labs, UIC',
    title: 'Research software engineer',
    year: '2024',
    when: 'February 2024 to now',
    where: 'Chicago',
    line: 'Virtual patients in Unreal Engine 5, and an audio ML pipeline that reached 98.52% accuracy.',
    details: [
      'The virtual patient system in Unreal Engine 5 and C++, with a Python backend behind REST APIs.',
      'An audio pipeline on Flask comparing MFCC features, CNNs and Transformers, with real-time inference and voice-activity detection.',
      'TeamMedAgents on Google ADK across 8 medical benchmarks: 77.63% accuracy on LLMs and a 3.1× speedup on 4B models.',
    ],
  },
  'bipolar-factory-intern': {
    company: 'Bipolar Factory',
    title: 'Software developer intern',
    year: '2023',
    when: 'March to May 2023',
    where: 'Bengaluru',
    line: 'A MERN streaming platform on AWS, and in-game chat in Unity that lifted retention by 10%.',
    details: [
      'The streaming platform on the MERN stack with TypeScript, deployed to AWS with Jenkins CI/CD.',
      'In-game chat for Metawood in C# and Unity, with MongoDB and SQL tuning behind it.',
    ],
  },
};

export const ROLES = experiences.map((e) => {
  const r = ROLE[e.id] || {};
  return {
    id: e.id,
    company: r.company || e.company,
    title: r.title || e.title,
    year: r.year || e.duration.slice(-4),
    when: r.when || e.duration,
    where: r.where || e.location,
    current: Boolean(e.isCurrent) || /present/i.test(e.duration),
    line: r.line || '',
    details: (r.details || e.description || []).filter((b) => !BANNED.test(b)),
    website: e.links && e.links.website,
  };
});

// Oldest first, so the timeline reads left to right like the horizon.
export const TIMELINE = [...ROLES].reverse();

export const MEASUREMENTS = [
  { value: '5,000+', what: 'people running their email and calendar through it' },
  { before: '90 s', after: '3 s', what: 'from an email arriving to the text about it' },
  { before: '189 s', after: 'instant', what: 'for a security code to reach you, at p90' },
  { value: '30%', suffix: 'cheaper', what: 'per user, with a deterministic matcher instead of a model call' },
  { value: '98%', what: 'of email rules made by chatting' },
];

// ---------- about ----------

export const ABOUT = {
  name: 'Pranav Pushkar Mishra',
  short: 'Pranav Mishra',
  place: 'Metuchen, New Jersey',
  opening: 'I make the parts of an AI assistant you never have to think about.',
  line: 'Founding LLM engineer at Alfred_, New York. Computer science, University of Illinois Chicago. Rooms whose walls are screens, before that.',
  longer: [
    'I’m Pranav Pushkar Mishra. I live in Metuchen, New Jersey, and I studied computer science at the University of Illinois Chicago.',
    'Since April 2026 I have been the founding LLM engineer at Alfred_. It is an assistant that runs your email, calendar and small obligations over text message, chat and voice, and my job is the part that has to be boring: the memory that does not invent, the rule that fires without a model call, the notification that arrives in three seconds.',
    'Before that I built for CAVE2, for headsets and for game engines. I still do, after hours.',
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/PranavMishra17' },
    { label: 'LinkedIn', href: contactInfo.linkedin },
    { label: 'Hugging Face', href: contactInfo.huggingFace },
    { label: 'Google Scholar', href: contactInfo.googleScholar },
    { label: 'Email', href: `mailto:${contactInfo.email.personal}` },
    { label: 'Resume', href: '/resume' },
  ],
};

export const TROPHIES = [
  { id: 'mit', title: 'MIT XR 2024', line: 'Won, with SnAIder-Cut.', image: '/assets/images/achievements/mit.png' },
  { id: 'hint', title: 'HINT 5.0', line: 'First place, with Virtual Van Gogh.', image: '/assets/images/achievements/hint.png' },
];
