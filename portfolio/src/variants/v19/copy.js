// v19 — the words.
//
// Every fact, metric, date, venue, link and image path is read from src/data/*. Only the
// phrasing is mine to change, and it is rewritten here in plain first person. Nothing in
// src/data/ is edited: the one bullet and the one project entry he is sick of seeing are
// filtered out at render time by BANNED below.

import { projects, contactInfo, getImageWithFallback } from '../../data/projects';
import experiences from '../../data/experience';
import { publications } from '../../data/publications';

const BANNED = /execution decision layer|five.?verdict|deterministic risk scoring/i;

/* ────────────────────────────── who ────────────────────────────── */

export const ME = {
  first: 'Pranav',
  last: 'Mishra',
  // the whole of the landing page's prose, on purpose
  role: 'Founding Engineer at Alfred_',
  short: 'Founding Engineer at Alfred_',
  photo: '/assets/images/default/profile_default.jpg',
  photoAlt: 'Pranav Mishra',
  city: 'New York',
  lede:
    'I build the half of an AI system that has to be right — memory that cannot invent things, evals that fail loudly, and the plumbing underneath.',
  lines: [
    'Before Alfred_: voice agents, computer vision, virtual patients in Unreal, and a long tail of games. Computer science at UIC.',
  ],
};

// Three places, and one red button that goes into the site. Nothing else on the landing.
export const LINKS = [
  { label: 'GitHub', href: 'https://github.com/PranavMishra17' },
  { label: 'LinkedIn', href: contactInfo.linkedin },
  { label: 'Résumé', href: '/resume' },
];
export const GO = { label: 'See my work', target: 'work' };

// The rest of the places, for the room's card
export const MORE_LINKS = [
  { label: 'Scholar', href: contactInfo.googleScholar },
  { label: 'Hugging Face', href: contactInfo.huggingFace },
  { label: 'Email', href: `mailto:${contactInfo.email.personal}` },
];

/* ────────────────────────────── the work ────────────────────────────── */

const alfredRole = experiences.find((e) => e.id === 'alfred-founding-llm') || {};

export const ALFRED = {
  company: 'Alfred_',
  title: alfredRole.title || 'Founding LLM Engineer',
  when: alfredRole.duration || '',
  where: alfredRole.location || '',
  url: (alfredRole.links && alfredRole.links.website) || 'https://get-alfred.ai/',
  logo: '/assets/images/companies/alfred.svg',
  hello: 'Hi there, I am a founding engineer at Alfred_.',
  lede: 'It reads your email, keeps your calendar and does the small obligations — over text message, chat and voice. I own the side of it where being wrong is expensive.',
  // the raw bullets, minus the one he is done with
  bullets: (alfredRole.description || []).filter((b) => !BANNED.test(b)),
};

// The numbers, and what actually changed. `path` drives the little signal diagram.
export const FIGURES = [
  {
    id: 'latency',
    was: '90 s',
    now: '3 s',
    label: 'Email lands as a text message',
    note: 'It used to poll. Now the mail event dispatches straight through, so the message arrives while you are still looking at your phone.',
    path: ['inbox', 'event', 'dispatch', 'you'],
  },
  {
    id: 'otp',
    was: '189 s',
    now: 'instant',
    label: 'Security codes, at p90',
    note: 'The same change, carried to the one path where waiting three minutes for a login code is unacceptable.',
    path: ['inbox', 'otp', 'you'],
  },
  {
    id: 'cost',
    was: 'per message',
    now: '−30%',
    label: 'Model cost per user',
    note: 'The email-rules engine used to ask a model about every single message. I replaced it with a three-stage matcher that simply decides, and kept a model in the loop only where judgement is genuinely needed.',
    path: ['message', 'matcher', 'rule'],
  },
  {
    id: 'rules',
    was: 'a form',
    now: '98%',
    label: 'Rules made just by talking to it',
    note: 'Almost nobody opens the rule builder any more. You say what you want and it writes the rule.',
    path: ['you', 'chat', 'rule'],
  },
  {
    id: 'memory',
    was: 'hope',
    now: 'tests',
    label: 'Invented facts about your inbox',
    note: 'Working memory is rebuilt so the assistant cannot state something nobody told it. That is enforced by tests, not by a prompt asking it nicely.',
    path: ['ledger', 'memory', 'answer'],
  },
];

export const HARDENING = [
  'Postgres on Supabase, hardened with row-level security and SECURITY DEFINER RPCs — which caught a cross-user data-leak class sitting on default PUBLIC grants.',
  'An eval harness written from scratch, plus a scanner that reads live conversations for failures before a user reports one.',
  'Idempotent, collision-safe migrations, and a memory store tuned for how Postgres actually stores it.',
];

const ROLE_LINE = {
  'wheelprice-intern':
    'Computer vision for automotive part fitment, a CMS that took the site to 10–20k readers a day, and the OTP flow shipped to production.',
  'research-software-engineer-uic':
    'Virtual patients in Unreal Engine 5 for medical research, and an audio pipeline that reached 98.52% accuracy with real-time inference.',
  'bipolar-factory-intern':
    'A streaming platform on the MERN stack and AWS, and in-game chat in Unity that moved retention about ten percent.',
};

export const ROLES = experiences
  .filter((e) => e.id !== 'alfred-founding-llm')
  .map((e) => ({
    id: e.id,
    company: e.company,
    title: e.title,
    when: e.duration,
    where: e.location,
    logo: e.companyLogo ? (e.companyLogo.startsWith('/') ? e.companyLogo : `/${e.companyLogo}`) : '',
    line: ROLE_LINE[e.id] || (e.description || [])[0] || '',
    bullets: (e.description || []).filter((b) => !BANNED.test(b)),
    tech: e.techStack || [],
    url: (e.links && e.links.website) || '',
  }));

/* ────────────────────────────── projects ────────────────────────────── */

// One short honest line per project, keyed by the id in src/data/projects.js. Anything without
// an entry falls back to the first sentence of its own description.
const LINE = {
  stellarium: '107,000 astronomical objects, rendered on the walls of a CAVE2 room you stand inside.',
  'mafia-agents': 'Agents play social deduction against each other. They lie, and they get caught.',
  'snakeai-mlops': 'Four ways of learning the same game, racing each other. You can go and play it.',
  'neon-bites': 'A small cross-platform arcade game about eating things that are faster than you.',
  'snaider-cut': 'Say what you want changed and the mixed-reality room changes around you. Won MIT XR 2024.',
  'virtual-van-gogh': 'A museum you walk through where the paintings are on a chain. First at HINT 5.0.',
  'equity-project': 'A virtual patient in Unreal, built so researchers can study how differently doctors treat people.',
  'kill-motherboard': 'Multiplayer built the hard way — authoritative server, lag compensation, the lot.',
  'sign-smash': 'Sign language, made into a game that runs on a phone that is not new.',
  upsurge: 'A cloud-saved survival game. The save system was most of the work.',
  cracking: 'A mobile puzzle game about safes, and the one satisfying click.',
  'mockflow-ai': 'A voice interviewer that actually interrupts you, orchestrated across several agents.',
  'resume-craft-pro': 'It reads the job posting and tells you what your résumé is missing.',
  soulengine: 'NPCs with memory, motive and agency, so they want something before you arrive.',
  'auto-prompting': 'Segmentation that prompts itself, so nobody has to click the object first.',
  'big5-agents': 'Six teamwork behaviours from psychology, each a switch — so you can see which one carried the result.',
  'ai-avatar': 'A medical RAG avatar you can talk to, grounded so it will say it does not know.',
  'metadata-enrichment': 'Have the model write metadata about a chunk before you store it. Retrieval gets better. 82.5% against 73.3%.',
  'realestate-ai': 'An agent that does the tedious half of buying property.',
  'streaming-digit-classifier': 'Digits recognised from a live audio stream. 98.52%, in real time.',
  'voicepersona-dataset': 'A dataset of voices with characters attached, because the open ones all sound the same.',
  inbedder: 'An implementation of instruction-following embeddings, to see whether the claim held up.',
  'voiceforge-architecture': 'Text in, a voice out, with the architecture written down properly.',
  'youtube-comments-analysis': 'Points a sentiment and multi-modal search at a comment section, which is a brave thing to do.',
  'flow-planner': 'Watches a workflow and writes the documentation nobody wrote.',
  clausecraft: 'An agentic editor for contracts that shows you what it changed and why.',
  'resumecraft-optimizer': 'The document pipeline underneath the résumé work.',
  'lunar-survival': 'NASA’s survival ranking exercise, run by a committee of agents.',
  'transformer-nmt': 'A transformer for translation, written from the paper rather than imported.',
  microscopy: 'Segmenting microscopy slides, where the interesting thing is usually very small.',
  'market-volatility': 'A pipeline that predicts volatility and is honest about how often it is wrong.',
  'football-bayesian-analysis': 'Bayesian analysis of football, because I played and I wanted to know.',
  unetplus: 'UNet++ for oral cancer detection, deployed rather than left in a notebook.',
  'pixel-punks': 'Collaborative pixel art on a chain. Everyone draws one pixel.',
  'complaint-hub-pro': 'A full-stack complaints system that routes the complaint to whoever can fix it.',
  'portfolio-website': 'This, before it looked like this.',
  'rusty-ant': 'A small game in Rust, mostly to argue with the borrow checker.',
};

const KIND = { gameDesign: 'game-design', aiMl: 'ai-ml', misc: 'misc' };
const TAG = { gameDesign: 'Games & XR', aiMl: 'AI / ML', misc: 'Odds & ends' };

function shortName(title) {
  return title.split(/[:—-]/)[0].trim();
}

// Everything, deduped by id — projects.js lists snakeai-mlops twice.
export const ALL_PROJECTS = (() => {
  const seen = new Set();
  const out = [];
  ['aiMl', 'gameDesign', 'misc'].forEach((bucket) => {
    (projects[bucket] || []).forEach((p) => {
      if (!p || !p.id || seen.has(p.id) || BANNED.test(p.title || '')) return;
      seen.add(p.id);
      out.push({
        id: p.id,
        name: shortName(p.title),
        full: p.title,
        category: p.category,
        bucket,
        tag: TAG[bucket],
        line: LINE[p.id] || (p.description || '').split('. ')[0],
        description: p.description || '',
        image: getImageWithFallback(p.mainImage, KIND[bucket]),
        gallery: (p.gallery || []).map((g) => getImageWithFallback(g, KIND[bucket])),
        tech: p.techStack || [],
        github: p.githubLink || '',
        demo: p.demoLink || '',
        site: p.websiteLink || '',
        // one screenshot in the repo is 400×400; never let it stretch
        square: (p.mainImage || '').includes('van gogh'),
      });
    });
  });
  return out;
})();

const byId = (id) => ALL_PROJECTS.find((p) => p.id === id);

// What the viewbox cycles through when nobody is pointing at anything.
export const NOW_BUILDING = ['mockflow-ai', 'big5-agents', 'soulengine']
  .map(byId)
  .filter(Boolean);

/* ────────────────────────────── papers ────────────────────────────── */

const PAPER_LINE = {
  metarag:
    'If the model writes metadata about a chunk before you store it, retrieval gets measurably better — 82.5% precision against 73.3%.',
  teammedagents:
    'The Big Five teamwork model, built as real mechanisms between agents rather than a prompt asking them to cooperate. Better on seven of eight medical benchmarks.',
};

// He asked for the SLM paper to come off the page — it covers the same ground as
// TeamMedAgents. It stays in src/data/publications.js untouched; it is dropped here.
const PAPERS_OFF = new Set(['slm-teammedagents']);

// NEEDS CONFIRMATION — he said the citation counts are now "10 or 6 in each" and the numbers
// in src/data/publications.js are stale. These two are my reading of that and should be
// checked against Scholar before this goes anywhere near live.
const CITATIONS = { teammedagents: 10, metarag: 6 };

export const PAPERS = publications.filter((p) => !PAPERS_OFF.has(p.id)).map((p) => ({
  id: p.id,
  title: p.title,
  venue: p.venue,
  status: p.status,
  year: p.year || (String(p.venue || '').match(/\b(20\d\d)\b/) || [])[1] || '—',
  authors: p.authors,
  line: PAPER_LINE[p.id] || '',
  abstract: p.abstract || '',
  doi: p.doi || '',
  pdf: p.pdfLink || '',
  code: p.codeLink || '',
  citations: CITATIONS[p.id] !== undefined ? CITATIONS[p.id] : p.citationCount || 0,
  tech: p.techStack || [],
}));

export const CONTACT = contactInfo;
