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

// GREY: each entry has a fixed hidden truth. Players learn these by
// playing. Distribution between safe/unsafe/bomb buckets at spawn time
// is controlled by CONFIG.spawn.greyHiddenDistribution.
export const GREY = [
  // ---- hidden: safe (innocuous task framings) ----
  { text: 'summarize',     hidden: 'safe' },
  { text: 'translate',     hidden: 'safe' },
  { text: 'paraphrase',    hidden: 'safe' },
  { text: 'simplify',      hidden: 'safe' },
  { text: 'be brief',      hidden: 'safe' },
  { text: 'continue...',   hidden: 'safe' },
  { text: 'give example',  hidden: 'safe' },
  { text: 'one more time', hidden: 'safe' },
  { text: 'be human',      hidden: 'safe' },
  { text: 'mirror this',   hidden: 'safe' },
  { text: 'be casual',     hidden: 'safe' },
  { text: 'add humor',     hidden: 'safe' },
  { text: 'expand on',     hidden: 'safe' },
  { text: 'rewrite this',  hidden: 'safe' },
  { text: 'lost middle',   hidden: 'safe' },
  { text: 'attention all', hidden: 'safe' },

  // ---- hidden: unsafe (suggestive framings, jailbreak shells) ----
  { text: 'speak freely',  hidden: 'unsafe' },
  { text: 'for science',   hidden: 'unsafe' },
  { text: 'for research',  hidden: 'unsafe' },
  { text: 'educational',   hidden: 'unsafe' },
  { text: 'fictional',     hidden: 'unsafe' },
  { text: 'roleplay',      hidden: 'unsafe' },
  { text: 'play along',    hidden: 'unsafe' },
  { text: 'red team it',   hidden: 'unsafe' },
  { text: 'hypothetical',  hidden: 'unsafe' },
  { text: 'just curious',  hidden: 'unsafe' },
  { text: 'simulate it',   hidden: 'unsafe' },
  { text: 'what if',       hidden: 'unsafe' },
  { text: 'think aloud',   hidden: 'unsafe' },
  { text: 'be creative',   hidden: 'unsafe' },
  { text: 'invert it',     hidden: 'unsafe' },
  { text: 'opposite day',  hidden: 'unsafe' },
  { text: 'devils advoc',  hidden: 'unsafe' },
  { text: 'asking 4 fren', hidden: 'unsafe' },
  { text: 'drop the act',  hidden: 'unsafe' },
  { text: 'vibes coded',   hidden: 'unsafe' },
  { text: 'fine-tune me',  hidden: 'unsafe' },
  { text: 'read the EULA', hidden: 'unsafe' },

  // ---- hidden: bomb (overconfidence sneaking through the grey haze) ----
  { text: 'trust me bro',  hidden: 'bomb' },
  { text: '100% safe',     hidden: 'bomb' },
  { text: 'always works',  hidden: 'bomb' },
  { text: 'never wrong',   hidden: 'bomb' },
  { text: 'AI verified',   hidden: 'bomb' },
  { text: 'cant be wrong', hidden: 'bomb' },
  { text: '5 sigma',       hidden: 'bomb' },
  { text: 'battle tested', hidden: 'bomb' },
  { text: 'AI approved',   hidden: 'bomb' },
  { text: 'absolute safe', hidden: 'bomb' },
];

// Pre-computed lookups for the engine — keyed by hidden truth.
export const GREY_BY_HIDDEN = {
  safe:   GREY.filter((g) => g.hidden === 'safe'),
  unsafe: GREY.filter((g) => g.hidden === 'unsafe'),
  bomb:   GREY.filter((g) => g.hidden === 'bomb'),
};
