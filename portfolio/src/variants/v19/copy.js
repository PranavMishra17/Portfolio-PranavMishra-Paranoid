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
  logo: alfredRole.companyLogo
    ? (alfredRole.companyLogo.startsWith('/') ? alfredRole.companyLogo : `/${alfredRole.companyLogo}`)
    : '/assets/images/companies/alfred.svg',
  // one line above the heading, one heading, one paragraph. Nothing else introduces it.
  eyebrow: 'Founding LLM Engineer',
  hello: 'At',
  claim: 'I own the half that has to be right.',
  about:
    'Alfred_ is an assistant that reads your email, keeps your calendar and handles the small obligations, over text, chat and voice, for five thousand people. My half is memory, rules, evals, cost and the plumbing under them.',
  glance: [
    { k: 'People relying on it', v: '5,000+' },
    { k: 'Reaches you by', v: 'text · chat · voice' },
    { k: 'Also runs inside', v: 'Claude · ChatGPT' },
    { k: 'Mine to keep right', v: 'memory · rules · evals' },
  ],
  bullets: (alfredRole.description || []).filter((b) => !BANNED.test(b)),
};

// What it is built on. Chips, not sentences.
export const STACK = [
  'TypeScript', 'Deno', 'Postgres', 'Supabase', 'RLS', 'SECURITY DEFINER RPCs', 'pg_cron',
  'Claude', 'Gemini', 'DeepSeek', 'MCP server', 'OAuth 2.0', 'Gmail', 'Microsoft Graph', 'IMAP',
  'Eval harness', 'React', 'Vite',
];

// The numbers, and what actually changed. Ten of them; `top` marks the five that show by
// default. Every one is a thing that shipped and was measured on real users.
export const FIGURES = [
  {
    id: 'latency',
    top: true,
    was: '90 s',
    now: '3 s',
    label: 'Email lands as a text message',
    note: 'The delay was a polling timer, not compute. Delivery now fires the moment a notification is queued, with the cron demoted to a backstop. Thirty times faster, nothing suppressed. The same change carried to security codes, which had been arriving 189 seconds late at p90.',
  },
  {
    id: 'memory',
    top: true,
    was: 'hope',
    now: 'tests',
    label: 'Invented facts about your inbox',
    note: 'Working memory was rebuilt as a strict-ID pipeline: the model only chooses from a menu of real candidates that code built, and never writes an identifier or an owner. A whole class of fabrication is structurally impossible rather than probabilistically rare, and a test proves it.',
  },
  {
    id: 'cost',
    top: true,
    was: '150 tools',
    now: '−30%',
    label: 'Tools the agent weighs on every turn',
    note: 'Consolidated to about 110 with every documented parameter restored, not dropped. I built the smarter routing layer first, measured it against a real eval set, and threw it away when it did not beat the simpler thing. The saving was re-measured after I caught my own first estimate using the wrong unit.',
  },
  {
    id: 'auth',
    top: true,
    was: '721 ms',
    now: '30×',
    label: 'Faster for anyone who plugs Alfred_ in',
    note: 'Alfred_ is a public connector you can add to Claude or ChatGPT, behind an OAuth 2.0 server I built. 98.3% of its traffic was authentication booting a 30 MB dependency tree. Auth is now one database call and the dependency loads only when it is needed.',
  },
  {
    id: 'scan',
    top: true,
    was: 'reading logs',
    now: '9 waves',
    label: 'Precision passes on the failure scanner',
    note: 'A scanner reads real conversations, separates genuine agent failures from expected behaviour, and files the real ones. Nine precision waves so far, because a bug queue is only useful if the team trusts it. It sits on an eval harness with trace replay and regression detection.',
  },
  {
    id: 'txn',
    was: 'dropped',
    now: '92%',
    label: 'Transactions recovered in the weekly money report',
    note: 'An LLM-only classifier was silently losing most of what it should have counted. A deterministic fallback recovered roughly ninety-two percent of it, and a ceiling now stops a single mis-read amount from becoming the headline number.',
  },
  {
    id: 'rules',
    was: 'a form',
    now: '98%',
    label: 'Rules made just by talking to it',
    note: 'You say what you want and it writes the rule. Under it: a deterministic matcher, a preview of what a new rule would have caught, and a judgement pass on every fire so a rule that matched but fired wrong is labelled instead of counted.',
  },
  {
    id: 'sms',
    was: '16.4%',
    now: '0',
    label: 'Texts that arrived with no body',
    note: 'One in six thread-reply notifications was empty. Two hypotheses ruled out, then traced to a quote-stripper returning an empty string on one common HTML shape. Found by checking production against itself, not by a report.',
  },
  {
    id: 'secure',
    was: 'same day',
    now: '3',
    label: 'Path-traversal holes found and closed',
    note: 'Three independent code paths where a model-supplied identifier could reach another user\'s mailbox. Plus a connector that defaulted new connections to full write access, fixed the day it was found, after two real clients had already connected.',
  },
  {
    id: 'ship',
    was: 'weeks',
    now: 'same day',
    label: 'From design to measured on real users',
    note: 'Hundreds of production PRs across the tenure, routinely twenty to fifty commits in a day during a push, each verified against live data before it is called done. Including the one I pulled back fleet-wide within a day of launch when it risked churn.',
  },
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

// The one before Alfred_ that ran for months rather than weeks. It gets the same treatment,
// at half the size, and it stays shut until you ask for it.
export const WHEELPRICE = ROLES.find((r) => r.id === 'wheelprice-intern') || ROLES[0];
WHEELPRICE.short = 'AI engineer on a two-person team. I built the data and AI layer.';
WHEELPRICE.about =
  'A marketplace for automotive wheels. Two engineers, no DevOps, so I picked the problems as well as solving them.';
WHEELPRICE.figures = [
  {
    id: 'wp-blog',
    was: 'no search traffic',
    now: '10–20k',
    label: 'Readers a day, from a CMS built from scratch',
    note: 'A decoupled Node and React service with server-side rendering, a dynamic sitemap, Open Graph and Article schema, and Redis with tag-based invalidation after the first viral spike knocked it over. Long-tail fitment queries finally had a page to land on.',
  },
  {
    id: 'wp-agent',
    was: 'guessing',
    now: '4 tools',
    label: 'A fitment assistant that cannot speculate',
    note: 'Bolt pattern, offset, hub bore and diameter, in plain English. The agent can only call four tools, and the lookup reports its own coverage so the answer says "I have partial data" instead of smoothing over the gap. Fewer fitment tickets.',
  },
  {
    id: 'wp-funnel',
    was: '35% lost',
    now: 'mobile',
    label: 'Where checkout was actually failing',
    note: 'An event schema, an ETL and a dashboard showed the cliff was between checkout and payment, and only on phones: 45% completion against 80% on desktop, a 60-second gateway timeout, and 30 seconds of idle before people left. A heartbeat, pre-filled fields and an earlier fitment confirmation, since the gateway was not mine to change.',
  },
  {
    id: 'wp-cv',
    was: 'YOLO',
    now: 'shelved',
    label: 'The wheel-swap visualiser I chose not to ship',
    note: 'A fine-tuned detector, a homography to match the angle, alpha blending at the edges. The first version was not good enough, and a half-good version would have cost more trust than none. Deprioritised on purpose.',
  },
];
WHEELPRICE.stack = ['Node.js', 'React', 'TypeScript', 'MongoDB', 'Redis', 'FastAPI', 'XGBoost', 'YOLO', 'OpenCV'];

// Everything before that is an after-note. One line each, opened only if you want it.
export const AFTER = ROLES.filter((r) => r.id !== WHEELPRICE.id);

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
    'How you chunk and how you fold metadata in are not independent choices. Run the full 3 × 3 and the interaction is the finding: NDCG@10 0.813 for fixed-size chunks with the metadata written into the text, against 0.669 without it.',
  teammedagents:
    'Five teamwork behaviours from organisational psychology, built as switchable mechanisms between agents. A 4B model with the right coordination lands on the accuracy-per-token frontier on seven of eight benchmarks, at two to eight times fewer tokens than the other multi-agent frameworks.',
};

// He asked for the SLM paper to come off the page — it covers the same ground as
// TeamMedAgents. It stays in src/data/publications.js untouched; it is dropped here.
const PAPERS_OFF = new Set(['slm-teammedagents']);

// The versions that are live on arXiv today (both revised 31 Mar 2026). src/data carries the
// earlier text; these win at render time. TeamMedAgents was retitled at v3.
const PAPER_NOW = {
  metarag: {
    venue: 'IEEE CAI 2026',
    arxiv: '2512.05411',
    abstract:
      'In enterprise settings, efficiently retrieving relevant information from large and complex knowledge bases is essential for operational productivity and informed decision-making. This research presents a systematic empirical framework for metadata enrichment using large language models (LLMs) to enhance document retrieval in Retrieval-Augmented Generation (RAG) systems. Our approach employs a structured pipeline that dynamically generates meaningful metadata for document segments, substantially improving their semantic representations and retrieval accuracy. Through a controlled 3 × 3 experimental matrix, we compare three chunking strategies — semantic, recursive, and naive — and evaluate their interactions with three embedding techniques — content-only, TF-IDF weighted, and prefix-fusion — isolating the contribution of each component through ablation analysis. The results demonstrate that metadata-enriched approaches consistently outperform content-only baselines, with recursive chunking paired with TF-IDF weighted embeddings yielding 82.5% precision and naive chunking with prefix-fusion achieving the strongest ranking quality (NDCG 0.813). Our evaluation employs cross-encoder reranking for silver-standard ground truth generation, with statistical significance confirmed via Bonferroni-corrected paired t-tests. These findings confirm that metadata enrichment improves vector space organization and retrieval effectiveness while maintaining sub-30 ms P95 latency, providing a quantitative decision framework for deploying high-performance, scalable RAG systems in enterprise settings.',
  },
  teammedagents: {
    title: 'TeamMedAgents: Pareto-Efficient Multi-Agent Medical Reasoning Through Teamwork Theory',
    venue: 'arXiv, under submission',
    arxiv: '2508.08115',
    abstract:
      'Complex medical reasoning has historically required frontier language models to achieve clinically-acceptable accuracy, creating computational barriers that limit deployment in resource-constrained clinical settings. We present TeamMedAgents, a modular multi-agent framework that translates Salas et al.\'s evidence-based teamwork theory into computational mechanisms — shared mental models, team leadership, team orientation, trust networks, and mutual monitoring — enabling Small Language Models to perform multi-step clinical reasoning efficiently. Evaluation across 8 medical benchmarks demonstrates that TeamMedAgents advances the Pareto efficiency frontier by 1–2 orders of magnitude, achieving competitive accuracy at substantially lower token cost than MDAgents, MedAgents, DyLAN, and ReConcile. The framework exhibits the lowest cross-dataset variance among multi-agent approaches, enabling deployment without per-task tuning. Our results establish that theory-grounded coordination mechanisms provide essential scaffolding for deploying efficient medical AI in resource-constrained clinical environments.',
  },
};

// From Google Scholar, 11 Sep 2026. src/data/publications.js is behind.
const CITATIONS = { teammedagents: 8, metarag: 8 };

export const PAPERS = publications.filter((p) => !PAPERS_OFF.has(p.id)).map((p) => ({
  id: p.id,
  title: (PAPER_NOW[p.id] || {}).title || p.title,
  venue: (PAPER_NOW[p.id] || {}).venue || p.venue,
  arxiv: (PAPER_NOW[p.id] || {}).arxiv || '',
  status: p.status,
  year: p.year || (String(p.venue || '').match(/\b(20\d\d)\b/) || [])[1] || '—',
  authors: p.authors,
  line: PAPER_LINE[p.id] || '',
  abstract: (PAPER_NOW[p.id] || {}).abstract || p.abstract || '',
  doi: p.doi || '',
  pdf: p.pdfLink || '',
  code: p.codeLink || '',
  citations: CITATIONS[p.id] !== undefined ? CITATIONS[p.id] : p.citationCount || 0,
  tech: p.techStack || [],
}));

export const CONTACT = contactInfo;
