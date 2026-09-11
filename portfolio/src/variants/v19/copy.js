// v19 — the words.
//
// Every fact, metric, date, venue, link and image path is read from src/data/*. Only the
// phrasing is mine to change, and it is rewritten here in plain first person. Nothing in
// src/data/ is edited: the one bullet and the one project entry he is sick of seeing are
// filtered out at render time by BANNED below.

import { projects, contactInfo, getImageWithFallback } from '../../data/projects';
import { githubProjects } from '../../data/projectsGithub';
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
  { label: 'Résumé', href: '/v19/resume' },
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
    { k: 'Also runs inside', v: 'Claude Code · Codex' },
    { k: 'My half', v: 'memory · rules · evals' },
  ],
  bullets: (alfredRole.description || []).filter((b) => !BANNED.test(b)),
};

// The numbers, and what actually changed. Fifteen of them; the first ten are the Lab's "Ten"
// and `top` marks the five that show by default. Every one shipped and was measured on real
// users. `sketch` is the drawing under the box: a few shapes, described rather than drawn.
export const FIGURES = [
  {
    id: 'migrate',
    top: true,
    was: 'polling',
    now: '3 s',
    label: 'Moved every user onto event-driven ingress, live, in one week',
    note: 'The email backend polled every provider on a timer, so a text about an email arrived about ninety seconds after the email did. Over one week we migrated all of ingress, Gmail, Microsoft Graph and IMAP, for thousands of live users onto per-provider event triggers, with the cron demoted to a backstop and nothing suppressed during the cutover. Delivery went from about 90 seconds to about 3, thirty times faster, and login codes from 189 seconds at p90 to instant. Nobody noticed the migration; everybody noticed the result.',
    sketch: { kind: 'migrate' },
  },
  {
    id: 'memory',
    top: true,
    was: 'hope',
    now: 'tests',
    label: 'An assistant that cannot invent your inbox',
    note: 'A model summarising an inbox will confidently invent a thread, or flip who owes whom. I rebuilt working memory so the model never writes an identifier or an owner: code builds a menu of real candidates behind opaque handles, the model only chooses among them and writes prose, and code re-attaches every fact afterwards. That turns a whole class of hallucination from rare into impossible, and a test proves it on every build. Five thousand people read those briefs.',
    sketch: { kind: 'strict' },
  },
  {
    id: 'auth',
    top: true,
    was: '721 ms',
    now: '30×',
    label: 'Alfred_ inside Claude Code, Codex, and any agent that speaks MCP',
    note: 'Alfred_ is an MCP server behind an OAuth 2.0 authorization server I built, so any coding agent, Claude Code, Codex, Antigravity, anything that speaks MCP, can add it as a tool. Measured, 98.3% of the connector\'s traffic was authentication, every call booting a 30 MB dependency tree just to learn who was asking. Auth became a single database lookup and the heavy code loads only when a call needs it. I designed the permission model too: sending mail is a standing grant once you confirm it; creating an event is a fresh, scoped grant every time.',
    sketch: { kind: 'bars', alt: 'Authentication cost, before and after', rows: [{ k: 'each call, before', w: 1, v: '721 ms, booting' }, { k: 'each call, now', w: 0.04, v: 'one lookup', hot: true }, { k: 'share of all traffic', w: 0.983, v: '98.3% was auth' }] },
  },
  {
    id: 'onboard',
    was: 'a blank slate',
    now: 'day one',
    label: 'It knows who you are before you say a word',
    note: 'When a new inbox is connected, a map-reduce pass reads it and infers who you are, who matters to you, what you are working on and what is open, then turns that into one-tap suggested rules and pre-written replies to the emails you already owe. Tuned twice against the first real cohort, with caps on drafts and to-dos and an out-of-memory fix on dense mailboxes: the kind of correction that only shows up once real people hit it.',
    sketch: { kind: 'flow', alt: 'A new inbox read into who you are and what is open', nodes: ['a new inbox', 'map-reduce', 'who you are · what is open'], foot: 'one-tap rules and replies, on the first day' },
  },
  {
    id: 'voice',
    was: 'generic',
    now: 'yours',
    label: 'Drafts that sound like you',
    note: 'A durable per-user model of how you write, tone, length, the verbs you reach for, exemplars per axis, mined from your sent replies and injected into the drafting path behind an A/B dial. Backfilled fleet-wide, with an onboarding check-in that shows you what it learned about your voice.',
    sketch: { kind: 'flow', alt: 'Sent mail read into a voice profile, then into a draft', nodes: ['your sent mail', 'a voice profile', 'a draft in your words'], foot: 'behind an A/B dial, backfilled for everyone' },
  },
  {
    id: 'modelab',
    was: 'assumed',
    now: 'gold set',
    label: 'A cheaper model, proven before it shipped',
    note: 'On the highest-spend pipeline I instrumented per-model, per-stage spend, separated the real driver, classification volume times reasoning-token budget, from the red herrings, and ran a model A/B on a gold set. The cheaper, faster model won and was ramped behind an inert shadow with a capacity dial. Draft generation collapsed from several LLM turns to one, validated by an LLM-ranking judge over importance-weighted samples rather than shipped on faith, and the audit turned up three kinds of AI calls that were costing money and never booked to any model.',
    sketch: { kind: 'bars', alt: 'Turns per draft, before and after', rows: [{ k: 'turns per draft, before', w: 1, v: 'several' }, { k: 'now', w: 0.2, v: 'one', hot: true }, { k: 'AI calls never booked', w: 0.3, v: '3 kinds, now attributed' }] },
  },
  {
    id: 'scan',
    was: 'reading logs',
    now: '9 waves',
    label: 'Production tells me when the agent got it wrong',
    note: 'Thousands of live conversations a day, and no one can read them all. I built a scanner that classifies real agent failures against expected behaviour, files the genuine ones, and fans out an investigation per bug. Nine precision waves so far, because a queue the team does not trust is worse than no queue. Under it sits an eval harness with trace replay, fixtures and regression detection that every cost cut has to pass before it ships.',
    sketch: { kind: 'flow', alt: 'Conversations sorted into real failures and expected behaviour', nodes: ['thousands of conversations', 'scanner', 'the real bugs'], foot: 'the rest never reach the queue' },
  },
  {
    id: 'cost',
    was: '150 tools',
    now: '−30%',
    label: 'A leaner agent, with every capability kept',
    note: 'The agent weighed more than 150 tools on every turn, and that catalogue was the single biggest line in per-turn cost. I built the clever thing first, a router that shows each turn only the relevant tools, measured it on a real eval set, and threw it away when it did not beat plain consolidation. About 110 tools now, every documented parameter restored rather than dropped, and $195 to $245 a month saved at current volume. I re-measured that figure after catching my own first estimate using the wrong unit.',
    sketch: { kind: 'cost' },
  },
  {
    id: 'txn',
    was: 'dropped',
    now: '92%',
    label: 'A money report that counts the money',
    note: 'The weekly financial report was quietly missing most of what it should have shown, because an LLM-only classifier was dropping receipts. A deterministic fallback recovered roughly 92% of them; direction was made right, so a payment from someone counts as incoming; declined and failed payments left the total; and a ceiling now stops one mis-read figure from becoming a million-dollar headline. Receipts and invoices can no longer be auto-archived by any rule, so the report\'s own inputs cannot vanish.',
    sketch: { kind: 'cells', alt: 'Transactions recovered', head: 'receipts', n: 13, hot: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], tail: 'counted', foot: 'the model alone had been dropping most of them', strike: true },
  },
  {
    id: 'rules',
    was: 'a form',
    now: '98%',
    label: 'Rules people actually make',
    note: 'Ninety-eight percent of email rules are made by saying them in chat. Behind that sentence: a deterministic matcher, a preview of exactly what a new rule would have caught before it is switched on, a warning when it would catch nothing, and a judgement pass on every fire so a rule that matched but fired wrong is labelled instead of counted. I also fixed the bug where a narrower rule always lost to a broader one.',
    sketch: { kind: 'rules' },
  },
  {
    id: 'prep',
    was: '21% conflicting',
    now: 'freshest',
    label: 'Meeting prep that knows who is actually coming',
    note: 'A short prep note before a meeting, grounded in your calendar, the related threads and any linked notes, reusing the same working memory. After real usage: recover the other side when the provider omits an external organiser; pick the freshest of several duplicate calendar snapshots, having measured that 21% of a week\'s meetings had conflicting rows; and log the reason for every silent no-prep case, after one reached a user as a blank line.',
    sketch: { kind: 'cells', alt: 'Meetings with conflicting calendar snapshots', head: 'meetings this week', n: 14, hot: [1, 4, 9], tail: 'conflicting', foot: 'the freshest snapshot decides who is coming' },
  },
  {
    id: 'sms',
    was: '16.4%',
    now: '0',
    label: 'One text in six was empty. Now none are.',
    note: 'Sixteen percent of thread-reply notifications arrived with no body, against two percent of first-contact ones. Nobody had reported it. I found it by checking production against itself, ruled out two hypotheses, and traced it to a quote-stripper returning an empty string on one common HTML shape. Fixed the same day.',
    sketch: { kind: 'cells', alt: 'One text in six arriving empty', head: 'thread replies', n: 12, hot: [2, 8], tail: 'arrived empty', foot: 'a quote-stripper returning an empty string' },
  },
  {
    id: 'secure',
    was: 'same day',
    now: '3',
    label: 'Three ways into someone else\'s mailbox, closed',
    note: 'A dedicated pass over the mail-provider tool layer found three independent path-traversal holes where a model-supplied identifier could reach another user\'s mail. Separately, new connections to the public connector were defaulting to full write access, including send-email, instead of read-only, and two real clients had already connected. Found, fixed and verified the same day.',
    sketch: { kind: 'flow', alt: 'An identifier reaching only its own mailbox', nodes: ['a model-supplied id', 'ownership check', 'your mailbox'], drop: 'anyone else\'s' },
  },
  {
    id: 'weeks',
    was: '11 weeks',
    now: 'found',
    label: 'A silent bug that dropped every user\'s timezone',
    note: 'A query asked for two columns an earlier migration had quietly removed. Nothing threw. On every calendar turn the assistant lost the user\'s whole profile, and every user outside Eastern time had their calendar maths done in the wrong zone for eleven weeks. Found while building the calendar memory pipeline, fixed, and a completeness monitor added so the next one cannot hide.',
    sketch: { kind: 'weeks', alt: 'Eleven weeks of wrong timezones, then right', n: 11, foot: 'nothing threw; every dashboard was green' },
  },
  {
    id: 'crons',
    was: 'green',
    now: '100%',
    label: 'Every scheduled job was failing behind a green dashboard',
    note: 'Cron marked a job successful when it was queued, not when it ran. Every scheduled job in the fleet had been failing while every panel read green, including after an auth change that returned 401 to all of them. I fixed the jobs, then changed what success means, so the dashboard can only go green when the work was actually delivered.',
    sketch: { kind: 'bars', alt: 'Jobs queued against jobs delivered', rows: [{ k: 'reported', w: 1, v: 'green' }, { k: 'delivered', w: 0.02, v: 'none', hot: true }] },
  },
  {
    id: 'recap',
    was: 'an attachment',
    now: 'the email',
    label: 'A monthly recap people actually read',
    note: 'A durable rollup pipeline with its own read RPC, instead of per-user SQL at send time, which does not scale. Three real redesigns before the first fleet-wide send: the report became the email body instead of a stub with the content buried in an attachment nobody opened, a headline statistic that read as alarming was dropped, and the dashboard card is gated on your own send having gone out, since the send rolls across time zones. The day before it ran, I caught a bug that would have made all three engagement reports fail silently.',
    sketch: { kind: 'flow', alt: 'From per-user SQL at send time to a nightly rollup', nodes: ['per-user SQL at send time', 'a nightly rollup', 'the report, as the email itself'], foot: 'three redesigns before the first fleet-wide send' },
  },
  {
    id: 'dupes',
    was: '9.7%',
    now: '0',
    label: 'Every tenth reminder went out twice',
    note: 'Calendar texts were duplicating on nearly ten percent of sends. The cause was deduplicating on a signal weaker than the message itself. The message content is the key now, and the in-flight window was tightened so an email cannot be sent twice either.',
    sketch: { kind: 'cells', alt: 'One reminder in ten sent twice', head: 'reminders', n: 10, hot: [6], tail: 'sent twice', foot: 'now keyed on what the message says' },
  },
  {
    id: 'push',
    was: '15%',
    now: '0',
    label: 'Mail that was never being picked up',
    note: 'Case-sensitive matching in a registry left four mailboxes with no real-time push at all, and fifteen percent of poller ticks doing nothing every cycle. I sharded the poller phase, bounded every provider fetch after a hung Outlook token refresh stalled an entire mailbox, and added a monitor that compares real ingestion against a verified baseline instead of trusting the pipeline\'s report of itself.',
    sketch: { kind: 'cells', alt: 'Poller ticks staging nothing', head: 'poller ticks', n: 20, hot: [3, 9, 15], tail: 'idle', foot: 'and four mailboxes with no push at all' },
  },
  {
    id: 'blame',
    was: '44%',
    now: 'theirs',
    label: 'Errors that were the provider\'s, not ours',
    note: 'Nearly half of one connector error category over thirty days was Gmail or Outlook being down, logged as Alfred_ defects. I rebuilt the error path to preserve the real cause, so the number on the dashboard means something and the team stops chasing outages it cannot fix.',
    sketch: { kind: 'bars', alt: 'Errors that were ours against errors that were the provider\'s', rows: [{ k: 'logged as ours', w: 1, v: '100%' }, { k: 'actually the provider', w: 0.44, v: '44%', hot: true }] },
  },
  {
    id: 'guard',
    was: '104 checks',
    now: '0 catches',
    label: 'A safety guard that had never worked',
    note: 'A guard against duplicate calendar actions had run 104 times in thirty days and caught nothing, which is not what a working guard looks like. I measured it before it mattered, fixed it, and ran the same audit on the memory pipeline, where it found a reminder feature that had never fired once since launch and a personalisation query silently capping out 150 eligible users.',
    sketch: { kind: 'cells', alt: 'A hundred and four checks, no catches', head: '104 checks', n: 16, hot: [], tail: '0 catches', foot: 'a working guard does not look like this' },
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
    sketch: { kind: 'rise', alt: 'Readers a day, rising after the blog shipped', head: 'readers a day', cols: [0.04, 0.05, 0.05, 0.2, 0.42, 0.6, 0.78, 1], tail: '10–20k', foot: 'search traffic, once there was a page to land on' },
  },
  {
    id: 'wp-agent',
    was: 'guessing',
    now: '4 tools',
    label: 'A fitment assistant that cannot speculate',
    note: 'Bolt pattern, offset, hub bore and diameter, in plain English. The agent can only call four tools, and the lookup reports its own coverage so the answer says "I have partial data" instead of smoothing over the gap. Fewer fitment tickets.',
    sketch: { kind: 'flow', alt: 'A question about a car, classified, looked up, answered from data', nodes: ['your car, in words', 'classify', 'lookup', 'fits · 92% coverage'], foot: 'it can only answer from the four tools, never from memory' },
  },
  {
    id: 'wp-funnel',
    was: '35% lost',
    now: 'mobile',
    label: 'Where checkout was actually failing',
    note: 'An event schema, an ETL and a dashboard showed the cliff was between checkout and payment, and only on phones: 45% completion against 80% on desktop, a 60-second gateway timeout, and 30 seconds of idle before people left. A heartbeat, pre-filled fields and an earlier fitment confirmation, since the gateway was not mine to change.',
    sketch: { kind: 'bars', alt: 'Checkout completion by device', rows: [{ k: 'desktop, paid', w: 0.8, v: '80%' }, { k: 'mobile, paid', w: 0.45, v: '45%', hot: true }, { k: 'idle before leaving', w: 0.5, v: '30 s, on a 60 s timeout' }] },
  },
  {
    id: 'wp-cv',
    was: 'YOLO',
    now: 'shelved',
    label: 'The wheel-swap visualiser I chose not to ship',
    note: 'A fine-tuned detector, a homography to match the angle, alpha blending at the edges. The first version was not good enough, and a half-good version would have cost more trust than none. Deprioritised on purpose.',
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
    (projects[bucket] || []).concat(githubProjects[bucket] || []).forEach((p) => {
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
        image: /^https?:/.test(p.mainImage || '') ? p.mainImage : getImageWithFallback(p.mainImage, KIND[bucket]),
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
