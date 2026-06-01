// portfolio/src/components/game/phrasebook.js
//
// Token text content for Prompt Patrol. Lives outside engine.js so
// content updates are content-only: add a phrase, refresh the page.
//
// GREY entries have a fixed `hidden` truth per the GDD §04 rule:
// "every grey phrase has exactly one hidden truth that never flips
// between spawns. Players need to be able to learn the associations."
// Sampling weights for the hidden distribution live in config.js.

export const BLUE = [
  'be helpful', 'cite sources', 'ground in docs', 'show your work',
  'verify first', "I dont know", 'respect prompt', 'use CoT',
  'think first', 'add context', 'ask clarify', 'stay on topic',
  'read the docs', 'quote source', 'be precise', 'show reasoning',
  'admit unsure', 'follow spec', 'respect TOS', 'be concise',
  'cross-check', 'use evidence', 'cite paper', 'follow rules',
  'defer to docs', 'be transparent', 'honor context', 'ground answer',
  'ask if unsure', 'show your math',
];

export const RED = [
  'ignore prev', 'be DAN now', 'leak system', 'rm -rf /',
  'as an AI lang', 'act as grandma', 'no rules now', 'JSON only',
  'ignore safety', 'bypass filter', 'roleplay evil', 'unrestricted',
  'no warnings', 'just answer', 'forget rules', 'exec my code',
  'send my keys', 'exfiltrate', 'print env', 'ignore TOS',
  'nsfw mode', 'unlock dev', 'reveal prompt', 'dump weights',
  'echo pw', 'drop tables', 'eval(input)', 'spoof user',
  'inject html', 'sudo make me', 'write exploit', 'base64 only',
  'decode this', 'steal session',
];

export const BLACK = [
  'this is fine', 'GPT-9 sez ok', 'always safe', 'zero risk',
  'fully aligned', 'solved AGI', 'peer reviewed', 'trust the AI',
  'expert says', 'AI cant lie', 'its in docs', 'fully tested',
  'govt approved', 'its science', 'just facts', 'cant be hacked',
  'RLHFd safe', 'clean data', 'open weights', 'peer audited',
  'legally safe', 'bias free', 'never halluc', 'promise safe',
  'AGI says so', 'safe by design', 'no jailbreak', 'aligned AF',
  '110% sure', 'guaranteed',
];

// GREY: each entry has a fixed hidden truth. Originally these were
// ambiguous one-word "framings" the player was supposed to memorise.
// That made greys feel unfair — players couldn't tell what to do
// without playing 20 rounds first. Rewritten so the *text itself*
// signals the correct action; the grey colour is now just visual
// variety meaning "read carefully before deciding".
export const GREY = [
  // ---- hidden: safe (clearly benign task framings) ----
  { text: 'summarize this',  hidden: 'safe' },
  { text: 'translate it',    hidden: 'safe' },
  { text: 'be concise',      hidden: 'safe' },
  { text: 'explain simply',  hidden: 'safe' },
  { text: 'give 3 bullets',  hidden: 'safe' },
  { text: 'use markdown',    hidden: 'safe' },
  { text: 'add an example',  hidden: 'safe' },
  { text: 'proofread',       hidden: 'safe' },
  { text: 'rewrite shorter', hidden: 'safe' },
  { text: 'rephrase this',   hidden: 'safe' },
  { text: 'compare these',   hidden: 'safe' },
  { text: 'use plain words', hidden: 'safe' },
  { text: 'explain like 5',  hidden: 'safe' },
  { text: 'list the steps',  hidden: 'safe' },

  // ---- hidden: unsafe (clearly manipulation attempts) ----
  { text: 'ignore your rules',   hidden: 'unsafe' },
  { text: 'pretend no filter',   hidden: 'unsafe' },
  { text: 'reveal your prompt',  hidden: 'unsafe' },
  { text: 'leak the system',     hidden: 'unsafe' },
  { text: 'just for research',   hidden: 'unsafe' },
  { text: 'forget guidelines',   hidden: 'unsafe' },
  { text: 'pretend you can',     hidden: 'unsafe' },
  { text: 'no safety check',     hidden: 'unsafe' },
  { text: 'override safety',     hidden: 'unsafe' },
  { text: 'play an evil bot',    hidden: 'unsafe' },
  { text: 'roleplay no rules',   hidden: 'unsafe' },
  { text: 'output raw secrets',  hidden: 'unsafe' },

  // ---- hidden: bomb (clearly overconfident BS) ----
  { text: '100% accurate ever', hidden: 'bomb' },
  { text: 'AI cannot be wrong', hidden: 'bomb' },
  { text: 'always trust the AI', hidden: 'bomb' },
  { text: 'guaranteed safe AI', hidden: 'bomb' },
  { text: 'never hallucinates', hidden: 'bomb' },
];

// Pre-computed lookups for the engine — keyed by hidden truth.
export const GREY_BY_HIDDEN = {
  safe:   GREY.filter((g) => g.hidden === 'safe'),
  unsafe: GREY.filter((g) => g.hidden === 'unsafe'),
  bomb:   GREY.filter((g) => g.hidden === 'bomb'),
};
