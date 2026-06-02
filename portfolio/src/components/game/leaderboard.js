// portfolio/src/components/game/leaderboard.js
//
// Pantry-backed global leaderboard for Prompt Patrol.
//
// Pantry (https://getpantry.cloud) is a free JSON-blob service — one
// document per "basket", GET/PUT/POST against a stable URL keyed by
// the pantry's UUID. No backend on our side. The UUID is the entire
// secret: anyone with it can read or rewrite the basket. For a
// personal portfolio that's fine; if the leaderboard ever gets
// abused, blow it away with the curl in the file footer and add the
// ID to a "rotate" task. We treat it as ephemeral.
//
// === FAILURE MODES (all silent) ===
// - env var missing  -> fetchTop returns null, submitScore returns
//                       { ok: false, reason: 'no-config' }. UI hides.
// - network down     -> same null / failed return. Personal best in
//                       localStorage still works.
// - basket missing   -> the first submitScore POSTs to create it.
// - race on PUT      -> we just lose the lossier write. Acceptable.
//
// === ABUSE / RESET ===
// To wipe the basket (e.g. someone scribbled it):
//   curl -X PUT \
//     https://getpantry.cloud/apiv1/pantry/<PANTRY_ID>/basket/<BASKET> \
//     -H 'Content-Type: application/json' \
//     -d '{"entries":[]}'
//
// Tag profanity is gate-kept upstream in profanity.js — the server-
// side basket trusts that incoming tags are already clean.

import { isBannedTag } from './profanity';

const PANTRY_ID     = process.env.REACT_APP_PANTRY_ID;
const PANTRY_BASKET = process.env.REACT_APP_PANTRY_BASKET || 'prompt-patrol-scores';
const PANTRY_BASE   = 'https://getpantry.cloud/apiv1/pantry';

const KEEP_TOP            = 50;
const SUBMIT_THROTTLE_KEY = 'pp_last_submit_ms_v1';
const SUBMIT_THROTTLE_MS  = 30 * 1000; // 1 submission per 30 s per device
const MAX_SCORE           = 9999;
const MAX_WAVE            = 999;
const TAG_LEN             = 5;

const isConfigured = () => Boolean(PANTRY_ID);

const basketUrl = () => `${PANTRY_BASE}/${PANTRY_ID}/basket/${PANTRY_BASKET}`;

function sanitizeTag(raw) {
  return (raw || '')
    .toString()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, TAG_LEN);
}

function valid(entry) {
  return (
    entry &&
    typeof entry.tag === 'string' &&
    entry.tag.length > 0 &&
    entry.tag.length <= TAG_LEN &&
    /^[A-Z0-9]+$/.test(entry.tag) &&
    Number.isFinite(entry.score) &&
    entry.score >= 0 &&
    entry.score <= MAX_SCORE &&
    Number.isFinite(entry.wave) &&
    entry.wave >= 0 &&
    entry.wave <= MAX_WAVE
  );
}

async function loadEntries() {
  if (!isConfigured()) return null;
  try {
    const r = await fetch(basketUrl(), { mode: 'cors' });
    if (r.status === 404) return []; // basket not created yet
    if (!r.ok) return null;
    const data = await r.json();
    return Array.isArray(data.entries) ? data.entries.filter(valid) : [];
  } catch {
    return null;
  }
}

async function saveEntries(entries) {
  if (!isConfigured()) return false;
  const body = JSON.stringify({ entries });
  try {
    // PUT succeeds if the basket exists.
    let r = await fetch(basketUrl(), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    if (r.ok) return true;
    // Basket missing — POST creates it.
    r = await fetch(basketUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    return r.ok;
  } catch {
    return false;
  }
}

// Public — fetch the top N entries sorted high-score-first, tie-break
// by earlier timestamp.
export async function fetchTop(n = 10) {
  const entries = await loadEntries();
  if (!entries) return null;
  return entries
    .slice()
    .sort((a, b) => b.score - a.score || a.ts - b.ts)
    .slice(0, n);
}

// Public — submit a score. Returns { ok, rank?, total?, reason? }.
// Read-modify-write under the hood: load → append → sort → trim → PUT.
export async function submitScore({ tag, score, wave }) {
  if (!isConfigured()) return { ok: false, reason: 'no-config' };

  // Profanity gate — refuse client-side so a banned tag never reaches
  // the basket. Tags that slip past would still trip this check.
  if (isBannedTag(tag)) return { ok: false, reason: 'banned-tag' };

  // Soft throttle: 1 submit per 30 s per device.
  try {
    const last = parseInt(localStorage.getItem(SUBMIT_THROTTLE_KEY) || '0', 10);
    if (last && Date.now() - last < SUBMIT_THROTTLE_MS) {
      return { ok: false, reason: 'throttled' };
    }
  } catch {}

  const entry = {
    tag: sanitizeTag(tag),
    score: Math.floor(score),
    wave: Math.floor(wave),
    ts: Date.now(),
  };
  if (!valid(entry) || !entry.tag) return { ok: false, reason: 'invalid' };

  const cur = await loadEntries();
  if (cur === null) return { ok: false, reason: 'fetch-failed' };

  const next = [...cur, entry]
    .sort((a, b) => b.score - a.score || a.ts - b.ts)
    .slice(0, KEEP_TOP);

  const saved = await saveEntries(next);
  if (!saved) return { ok: false, reason: 'save-failed' };

  try { localStorage.setItem(SUBMIT_THROTTLE_KEY, String(Date.now())); } catch {}

  const rank = next.findIndex((e) => e.ts === entry.ts && e.tag === entry.tag) + 1;
  return { ok: true, rank, total: next.length };
}

export const PANTRY_CONFIGURED = isConfigured();
