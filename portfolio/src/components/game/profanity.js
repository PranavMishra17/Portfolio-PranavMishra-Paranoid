// portfolio/src/components/game/profanity.js
//
// Tag-name pre-filter. Rejects tags that resolve to common slurs or
// abusive terms after leetspeak normalisation. The banlist is
// base64-encoded so the words don't appear as literal strings in
// `git grep` / GitHub code search — anyone determined can decode
// them, but the public repo doesn't surface slurs.
//
// To extend: take the lowercase normalised form of the word and pass
// it through `btoa` in a JS console, then add the result to
// BANNED_B64 below. To wipe a false-positive, just remove the line.

// Curated set of common offensive 3-5 character tokens (lowercase
// + leetspeak-normalised). Covers the most likely abusive tags
// people try to slip in. Not exhaustive — false positives prefer
// "miss" over "block legitimate input".
const BANNED_B64 = [
  // common profanity (4 chars)
  'ZnVjaw==', 'c2hpdA==', 'Y3VudA==', 'dHdhdA==',
  // common profanity (5 chars)
  'Yml0Y2g=', 'd2hvcmU=', 'YXJzZWg=',
  // n-word and close variants
  'bmlnZ2E=', 'bmlnZ3M=', 'bmlncg==',
  // anti-LGBTQ slurs
  'ZmFn', 'ZmFnZw==', 'ZmFnZ3k=', 'ZHlrZQ==',
  // racial / ethnic slurs (4-5 chars)
  'Y2hpbms=', 'c3BpYw==', 'YzAwbg==', 'Y29vbg==', 'Z29vaw==',
  'a2lrZQ==', 'cGFraQ==', 'd2V0Yg==',
  // ableist
  'cmV0YXI=', 'dGFyZA==',
  // misc abusive / hate
  'bmF6aQ==', 'a2tr', 'aGl0bGE=',
];

let BANNED = null;
const ensureBanned = () => {
  if (BANNED) return BANNED;
  BANNED = new Set();
  for (const b of BANNED_B64) {
    try {
      const w = atob(b).toLowerCase();
      if (w) BANNED.add(w);
    } catch {}
  }
  return BANNED;
};

// Common leetspeak substitutions — collapses to a-z so a single
// banned-word entry catches the obvious variants.
const LEET = {
  '0': 'o', '1': 'i', '3': 'e', '4': 'a',
  '5': 's', '6': 'g', '7': 't', '8': 'b',
  '@': 'a', '$': 's', '!': 'i', '|': 'i',
};

export function normalize(tag) {
  const s = (tag || '').toString().toLowerCase();
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    out += Object.prototype.hasOwnProperty.call(LEET, ch) ? LEET[ch] : ch;
  }
  return out.replace(/[^a-z0-9]/g, '');
}

// `true` if the normalised tag is, or contains, a banned token.
// Substring scan starts at length 4 to avoid false positives like
// "PASS" → "ass" tripping a 3-char ban. 3-char slurs in the list
// only match the tag exactly.
export function isBannedTag(tag) {
  const banned = ensureBanned();
  const norm = normalize(tag);
  if (!norm) return false;
  if (banned.has(norm)) return true;
  for (let len = 4; len <= norm.length; len++) {
    for (let i = 0; i + len <= norm.length; i++) {
      if (banned.has(norm.slice(i, i + len))) return true;
    }
  }
  return false;
}
