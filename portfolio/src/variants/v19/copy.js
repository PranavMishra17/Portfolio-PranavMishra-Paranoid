// v19 — the words.
//
// Every fact, metric, date, venue, link and image path is read from src/data/*. Only the
// phrasing is mine to change, and it is rewritten here in plain first person. Nothing in
// src/data/ is edited: the one bullet and the one project entry he is sick of seeing are
// filtered out at render time by BANNED below.

import { projects, contactInfo, getImageWithFallback } from '../../data/projects';
import { githubProjects } from '../../data/projectsGithub';
import { projectImagesWeb } from '../../data/projectImagesWeb';
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
  photo: '/assets/images/web/profile.jpg',
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
  eyebrow: 'April 2026 – present · New York',
  hello: 'Founding LLM Engineer at',
  claim: '',
  about:
    'Alfred_ is a multi-agent assistant over email, calendar, SMS and voice, for five thousand people. I own working memory, the rules engine, the eval harness, inference cost, and the Postgres and ingestion underneath.',
  glance: [
    { k: 'People relying on it', v: '5,000+' },
    { k: 'Reaches you by', v: 'text · chat · voice' },
    { k: 'Also runs inside', v: 'Claude Code · Codex' },
    { k: 'Mine', v: 'memory · rules · evals' },
  ],
  tryLabel: 'Try it for free',
  bullets: (alfredRole.description || []).filter((b) => !BANNED.test(b)),
};

// The five figures. Every one shipped and was measured on real users. `sketch` names the
// drawing under the box.
export const FIGURES = [
  {
    id: 'migrate',
    was: 'polling',
    now: '3 s',
    label: 'Moved every user onto event-driven ingress, live, in one week',
    note: '**Migrated all email ingress** — Gmail, Microsoft Graph, IMAP — from timer polling to **per-provider event triggers**, for thousands of live users, in one week, with zero suppressed notifications. Email-to-text latency **~90 s to ~3 s (30×)**; login codes from **189 s at p90 to instant**.',
    sketch: { kind: 'migrate' },
  },
  {
    id: 'memory',
    was: 'LLM recall',
    now: 'working memory',
    label: 'Working memory that cannot invent your inbox',
    note: 'Rebuilt working memory as a **strict-ID pipeline**: code assembles real candidates behind opaque handles, the model only **selects and writes prose**, and code re-attaches every identifier and owner. Fabricated threads and inverted ownership are **structurally impossible**, enforced by tests, for **5,000+ users\' briefs**.',
    sketch: { kind: 'strict' },
  },
  {
    id: 'auth',
    was: '721 ms',
    now: '30×',
    label: 'Alfred_ inside Claude Code, Codex, and any agent that speaks MCP',
    note: 'Alfred_ is a public **MCP server** behind an **OAuth 2.0 authorization server** I built, usable from Claude Code, Codex, Antigravity or any MCP client. Auth was **98.3% of connector traffic** at 721 ms p50; it is now **one database lookup**, ~30× faster. Also designed the **graduated permission model**: standing grants for send, per-use scoped grants for calendar writes.',
    sketch: { kind: 'calltime' },
  },
  {
    id: 'harness',
    was: 'read it back',
    now: 'replayed',
    label: 'Every agent turn, replayable and scored before it ships',
    note: 'A **deterministic eval harness** for the SMS agent surface: **trace replay** against fixtures, every scenario scored across the full range of outcomes, and **regression detection** on tool-calling reliability. Every change to the agent, and every cost cut, is **measured against production behaviour before it ships**.',
    sketch: { kind: 'scenarios' },
  },
  {
    id: 'context',
    was: 'on request',
    now: 'ahead of the turn',
    label: 'Context that is there before the agent needs it',
    note: 'Alfred_ answers over SMS and voice, where a pause is a failure. I own the **low-latency context retrieval** on those real-time pipelines, assembled **ahead of the turn** rather than inside it, and the **tool-calling stability** that keeps a multi-agent turn deterministic under load, retries and partial failures included. **Cartesia TTS** on the voice surface.',
    sketch: { kind: 'budget' },
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
    note: 'Built a **CMS from scratch** as a decoupled Node/React service: **server-side rendering**, a dynamic sitemap, Open Graph and Article schema, **Redis with tag-based invalidation** after the first viral spike. Organic search finally had a page to land on: **10–20k readers a day**.',
    sketch: { kind: 'rise', alt: 'Readers a day, rising after the blog shipped', head: 'readers a day', cols: [0.04, 0.05, 0.05, 0.2, 0.42, 0.6, 0.78, 1], tail: '10–20k', foot: 'search traffic, once there was a page to land on' },
  },
  {
    id: 'wp-agent',
    was: 'guessing',
    now: '4 tools',
    label: 'A fitment assistant that cannot speculate',
    note: 'A **constrained fitment agent**: it can only call **four tools** (fitment lookup, classification, lingo, search) and never answers from memory. The lookup reports its own **coverage score**, so partial data is said out loud instead of smoothed over. **Fewer fitment support tickets.**',
    sketch: { kind: 'flow', alt: 'A question about a car, classified, looked up, answered from data', nodes: ['your car, in words', 'classify', 'lookup', 'fits · 92% coverage'], foot: 'it can only answer from the four tools, never from memory' },
  },
  {
    id: 'wp-funnel',
    was: '35% lost',
    now: 'mobile',
    label: 'Where checkout was actually failing',
    note: 'Designed the **event schema, ETL and dashboard** that found the real cliff: **35% lost between checkout and payment**, mobile at **45% against 80% on desktop**, a 60 s gateway timeout. Shipped a **session heartbeat**, pre-filled fields and earlier fitment confirmation, since the gateway was third-party.',
    sketch: { kind: 'bars', alt: 'Checkout completion by device', rows: [{ k: 'desktop, paid', w: 0.8, v: '80%' }, { k: 'mobile, paid', w: 0.45, v: '45%', hot: true }, { k: 'idle before leaving', w: 0.5, v: '30 s, on a 60 s timeout' }] },
  },
  {
    id: 'wp-cv',
    was: 'YOLO',
    now: 'shelved',
    label: 'The wheel-swap visualiser I chose not to ship',
    note: 'A **fine-tuned YOLO** detector, a **homography** to match the angle, alpha blending at the edges: swap a wheel onto a photo of your car. The first version was not good enough, and a half-good one costs more trust than none. **Deprioritised on purpose** for the work that moved conversions.',
    sketch: { kind: 'swap', alt: 'A wheel on a car photo, swapped for another', head: 'detect, warp, blend', foot: 'not good enough to ship, so it did not' },
  },
];
WHEELPRICE.stack = ['Node.js', 'React', 'TypeScript', 'MongoDB', 'Redis', 'FastAPI', 'XGBoost', 'YOLO', 'OpenCV'];

// Everything before that is one after-note, shut: the two roles on one line, opened together.
export const AFTER = ROLES.filter((r) => r.id !== WHEELPRICE.id);
export const AFTER_LINE = AFTER.map((r) => `${r.id === 'research-software-engineer-uic' ? 'Research SWE' : r.title} at ${r.company}`).join(' · ');

/* ────────────────────────────── projects ────────────────────────────── */

// One short honest line per project, keyed by the id in src/data/projects.js. Anything without
// an entry falls back to the first sentence of its own description.
// One line per project, each checked against the README of the repo it links to.
const LINE = {
  'mockflow-ai': 'A mock interviewer that talks, watches the code you type and hands back a scored report. Under 400 ms a turn, on your own keys.',
  soulengine: 'NPCs that remember you, change over time, speak in their own voice and act on their own through MCP.',
  stellarium: '107,000 stars and their constellations, placed as seen from Earth, on the walls of a CAVE2 room you stand inside.',
  'snakeai-mlops': 'Four ways of learning the same game, racing each other. You can go and play it.',
  'auto-prompting': 'Segmentation that prompts itself: k-means and a depth map make the masks, so nobody has to click the object first.',
  'virtual-van-gogh': 'A Unity gallery of NFTs. Your entry fee is split among the artists by how long you stood in front of each. Won HINT 5.0.',
  'big5-agents': 'The Big Five teamwork model, five behaviours and three coordinating mechanisms, each a switch, so you can see which one carried the answer.',
  'ai-avatar': 'Upload your documents and get a talking avatar that answers from them. Azure speech and avatar, RAG on Cosmos DB, streamed over WebRTC.',
  quorum: 'A shared chat workspace of DMs and group rooms with a single AI teammate present everywhere. It decides for itself when a room needs it to speak.',
  'streaming-digit-classifier': 'Spoken digits recognised from a live audio stream, four approaches compared. MFCC and a dense net won: 98.52%.',
  'kill-motherboard': 'Two or three players as mice on a motherboard, cooperating to overheat the CPU. Unity Netcode.',
  'voicepersona-dataset': 'Voice descriptions and personality profiles, written by audio-language models, so a voice can be picked from words alone. Trained Alaap.',
  medbrief: 'Enter a medical condition and get a four-section research report with verified citations, streamed to the browser as it is written.',
  autocallai: 'A voice agent that books medical appointments, then reads its own call and rewrites its prompt for the next one.',
  'sign-smash': 'A small Android FPS where you blast signs. One level, a tutorial, a final boss, and a revive if you watch an ad.',
  upsurge: 'A casual arcade platformer for Android: procedural levels and a cloud leaderboard. Shipped to the Play Store.',
  cracking: 'A mobile rail shooter with Google Play leaderboards and achievements. Shipped to the Play Store.',
  clausecraft: 'An agentic document editor: say what to change in plain words, and every edit comes back with a line citation.',
  'equity-project': 'MetaHuman patients in Unreal 5 with branching dialogue, built to train medical learners to notice their own racial bias.',
  'neon-bites': 'A cyberpunk food-delivery game: run, jump and ride through a neon city to get the order there on time.',
  'snaider-cut': 'Block a film scene in mixed reality and it becomes a script; edit the script and the scene replays. Won at MIT Reality Hack 2024.',
  'resumecraft-optimizer': 'Rewrites a LaTeX résumé for a job posting: only the parts that may change, inside strict character limits, then compiles the PDF.',
  'lunar-survival': 'NASA’s lunar survival ranking exercise, run by paired teams of agents.',
  'transformer-nmt': 'A transformer for English to German, written from the paper rather than imported.',
  microscopy: 'Segmenting electron-microscopy volumes of the hippocampus, scored on IoU, then tracking cell bodies through the stack.',
  unetplus: 'U-Net and UNet++ on oral cancer images, with ResNet, Inception and EfficientNet backbones compared.',
  'mafia-agents': 'Agents with distinct personalities play Mafia against each other. They lie, and they get caught.',
  hoverhelp: 'Someone on a phone sees what you see in the headset and points at things in your kitchen. Built at MIT Reality Hack 2026.',
  'pixel-punks': 'A community paints one pixel grid, it is auctioned as an NFT, and the money is split among everyone who painted. On Solana.',
};

// Five entries in projects.js point their GitHub button at the profile page. These are the repos.
const REPO = {
  stellarium: 'https://github.com/PranavMishra17/Stellarium-A-Space-Odyssey-VR-star-system',
  cracking: 'https://github.com/PranavMishra17/Cracking-Android-Game-Unity3D',
  'neon-bites': 'https://github.com/PranavMishra17/NeonBites_CS426',
  'snaider-cut': 'https://codeberg.org/reality-hack-2024/TABLE_62',
  upsurge: '', // no public repo
};

// The thirty he kept, in the order he ranked them. Anything not in this list is not shown.
const KEEP = [
  'mockflow-ai', 'soulengine', 'voiceforge-architecture', 'stellarium', 'snakeai-mlops', 'auto-prompting',
  'virtual-van-gogh', 'big5-agents', 'ai-avatar', 'quorum', 'streaming-digit-classifier', 'kill-motherboard',
  'voicepersona-dataset', 'medbrief', 'autocallai', 'sign-smash', 'upsurge', 'cracking', 'clausecraft',
  'equity-project', 'neon-bites', 'snaider-cut', 'resumecraft-optimizer', 'lunar-survival', 'transformer-nmt',
  'microscopy', 'unetplus', 'mafia-agents', 'hoverhelp', 'pixel-punks',
];

// VoiceForge became Alaap: same pictures, new name, new repo.
const RENAME = {
  'voiceforge-architecture': {
    name: 'Alaap',
    full: 'Alaap: Text-to-Voice Design',
    github: 'https://github.com/PranavMishra17/alaap',
    line: 'Describe a character in words and get a persistent voice for it, in English, Hindi, Bengali and Tamil. Every experiment written up with what it did not establish.',
  },
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
    (projects[bucket] || []).concat(githubProjects[bucket] || []).forEach((p) => {
      if (!p || !p.id || seen.has(p.id) || BANNED.test(p.title || '') || !KEEP.includes(p.id)) return;
      seen.add(p.id);
      const re = RENAME[p.id] || {};
      out.push({
        id: p.id,
        name: re.name || shortName(p.title),
        full: re.full || p.title,
        category: p.category,
        bucket,
        tag: TAG[bucket],
        line: re.line || LINE[p.id] || (p.description || '').split('. ')[0],
        description: p.description || '',
        image: projectImagesWeb[p.id]
          ? `/${projectImagesWeb[p.id]}`
          : /^https?:/.test(p.mainImage || '') ? p.mainImage : getImageWithFallback(p.mainImage, KIND[bucket]),
        gallery: (p.gallery || []).map((g) => getImageWithFallback(g, KIND[bucket])),
        tech: p.techStack || [],
        github: re.github || (p.id in REPO ? REPO[p.id] : p.githubLink || ''),
        demo: p.demoLink || '',
        site: p.websiteLink || '',
        // one screenshot in the repo is 400×400; never let it stretch
        square: (p.mainImage || '').includes('van gogh'),
      });
    });
  });
  out.sort((x, y) => KEEP.indexOf(x.id) - KEEP.indexOf(y.id));
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
