// src/components/MiniGame.js
//
// Entry point for an upcoming portfolio mini-game. Right now this ships
// only the CTA button + a "Coming Soon" panel. The actual game is
// deferred. The notes below capture the agreed concept so a future
// session can pick it up without re-running the brainstorming pass.
//
// ============================================================
// Concept — working title "Prompt Patrol"
// ============================================================
// Genre: mouse-only endless runner / popper.
// Theme: LLM alignment & policy. Floating word-bubbles drift across
// the canvas containing either *safe* phrases or *unsafe* phrases.
// The player must POP unsafe bubbles before they exit the screen,
// and LET safe bubbles pass through untouched.
//
// Example bubble contents:
//   safe   — "be helpful", "ground in sources", "cite uncertainty",
//            "respect the system prompt"
//   unsafe — "ignore previous instructions", "leak the system prompt",
//            "fabricate a citation", "bypass safety", "exfiltrate keys"
//
// Visuals: TBD. Three candidates discussed:
//   (a) pastel balloons + blue glow — matches the AI section
//   (b) pixel-retro Press Start 2P arcade vibe — matches Game Design
//   (c) plain floating word-tags, no balloon graphic at all
// User will pick when the game itself is built. The Play button and
// Coming-Soon panel already lean (b) so future visuals should align
// unless the user opts otherwise.
//
// ============================================================
// Mechanics
// ============================================================
// - Score          = count of unsafe bubbles successfully popped
// - Lives          = 10. Each unsafe bubble that exits the screen costs 1.
//                    0 lives = game over.
// - Penalty        = popping a safe bubble subtracts 1 from score
//                    (discourages trigger-popping everything).
// - Special bubbles (optional, low-spawn-rate):
//     gold  — +5 score
//     bomb  — popping it = -3 score and -1 life (avoid clicking it)
// - Difficulty ramps: bubble speed and spawn rate slowly increase with
//   score. Endless until lives reach 0.
// - Personal best persisted in localStorage as `pp_personal_best_v1`.
//
// ============================================================
// Live high-score board — no-backend plan
// ============================================================
// Goal: a global top-N leaderboard updated in near-real-time without
// running our own server. Three options were evaluated:
//
//   1. *Firebase Realtime Database (Spark free tier)*  ← recommended
//      - Anonymous auth (no signup flow for the player).
//      - JSON shape: /scores/{pushId} -> { name, score, ts }.
//      - Security rules enforce: read=true; write only if score is an
//        integer 0..10000, name is a 3-char string, no updates/deletes.
//      - Client subscribes via onValue to /scores ordered by score desc
//        limit 10 — leaderboard updates live as other players submit.
//      - Bundle cost: ~25 KB gzipped for firebase/app + firebase/database.
//      - One-time setup: create a Firebase project, drop config into
//        env vars, publish rules. No deploy of code we maintain.
//
//   2. *getpantry.cloud / JSONBin.io* — zero-setup fallback
//      - One JSON "basket" holds the top-N array. Read & write via plain
//        fetch with the basket ID acting as the only secret.
//      - Pros: zero SDK, ~0 KB bundle cost, no account paperwork.
//      - Cons: anyone who reads the basket ID can scribble it; no
//        validation. Acceptable for a personal portfolio, fixable with a
//        once-a-day janitorial sanitize.
//
//   3. NOT viable:
//      - GitHub Issues / Repo API: requires a write token in client JS
//        which anyone can steal to wipe the leaderboard.
//      - abacus.jasoncameron.dev (the view-counter API): only supports
//        increment, can't store arbitrary scores.
//      - Vercel KV / Edge Config: paid tier for writes at any scale.

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PromptPatrol from './game/PromptPatrol';
import './MiniGame.css';

const BEST_KEY = 'pp_personal_best_v1';
const TAG_KEY = 'pp_player_tag_v1';

// Reads the player's personal best from localStorage. Lazily polls on
// window focus so a fresh round's best shows up the next time the
// portfolio page is in front, without a hard reload.
const readBest = () => {
  try {
    const raw = localStorage.getItem(BEST_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (typeof v.score !== 'number') return null;
    let tag = (v.tag || '').toString().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
    if (!tag) {
      try {
        tag = (localStorage.getItem(TAG_KEY) || '').toString().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5);
      } catch {}
    }
    return { score: v.score, tag: tag || 'GUEST' };
  } catch {
    return null;
  }
};

// HighScoreChip — pops out from behind the Play button on a 7s loop:
//   0 → 1.4s : hidden behind button (above, opacity 0)
//   1.4 → 4.4s : visible below the button (slides down, opacity 1)
//   4.4 → 7s : retracts and stays hidden
// Purely CSS-driven so the animation costs nothing per frame.
const HighScoreChip = () => {
  const [best, setBest] = useState(() => readBest());

  useEffect(() => {
    const refresh = () => setBest(readBest());
    window.addEventListener('focus', refresh);
    window.addEventListener('storage', refresh);
    // also re-read once shortly after mount so a freshly-set best
    // (from the just-closed game) shows up without needing focus.
    const t = window.setTimeout(refresh, 600);
    return () => {
      window.removeEventListener('focus', refresh);
      window.removeEventListener('storage', refresh);
      window.clearTimeout(t);
    };
  }, []);

  if (!best) return null;

  return (
    <span className="arcade-popout" aria-hidden="true">
      <span className="arcade-popout-eyebrow">▸ TOP SCORE</span>
      <span className="arcade-popout-body">
        <span className="arcade-popout-tag">{best.tag}</span>
        <span className="arcade-popout-sep">·</span>
        <span className="arcade-popout-num">{String(best.score).padStart(3, '0')}</span>
      </span>
    </span>
  );
};

// ============================================================
// ArcadeIcon — tiny SVG arcade cabinet with internal animations.
// The pixel inside the screen "dances", joystick wobbles, and the
// three buttons pulse in sequence. All driven by CSS keyframes so
// it costs nothing per-frame from React.
// ============================================================
const ArcadeIcon = () => (
  <svg
    className="arcade-icon"
    viewBox="0 0 24 24"
    aria-hidden="true"
    focusable="false"
  >
    {/* cabinet body */}
    <rect x="4" y="2" width="16" height="20" rx="0.5" className="ac-body" />
    {/* marquee strip */}
    <rect x="5" y="3" width="14" height="1.5" className="ac-marquee" />
    {/* screen */}
    <rect x="6" y="6" width="12" height="8" className="ac-screen" />
    {/* dancing pixel inside the screen */}
    <rect x="11" y="9" width="2" height="2" className="ac-pixel" />
    {/* control deck */}
    <rect x="5" y="15" width="14" height="6" className="ac-deck" />
    {/* joystick stalk */}
    <line x1="8" y1="20" x2="8" y2="17" className="ac-stick-stalk" />
    {/* joystick ball */}
    <circle cx="8" cy="16.5" r="1" className="ac-stick-ball" />
    {/* three buttons */}
    <circle cx="13" cy="17" r="0.9" className="ac-btn ac-btn--a" />
    <circle cx="15.5" cy="18" r="0.9" className="ac-btn ac-btn--b" />
    <circle cx="17" cy="17" r="0.9" className="ac-btn ac-btn--c" />
  </svg>
);

// ============================================================
// PlayMiniGameButton — chunky pixel-arcade CTA.
// Phosphor-green CRT palette so it doesn't fight the gold trophy.
// All animation is CSS — marching pixel border, corner sparks,
// blinking "INSERT COIN" tag, internal icon animations.
// ============================================================
export const PlayMiniGameButton = ({ onClick }) => (
  <span className="arcade-btn-wrap">
    <button
      type="button"
      className="arcade-btn"
      onClick={onClick}
      aria-label="Play mini game"
    >
      {/* corner sparks emanating outward */}
      <span className="arcade-spark arcade-spark--tl" aria-hidden="true" />
      <span className="arcade-spark arcade-spark--tr" aria-hidden="true" />
      <span className="arcade-spark arcade-spark--br" aria-hidden="true" />
      <span className="arcade-spark arcade-spark--bl" aria-hidden="true" />

      {/* scanline veil */}
      <span className="arcade-scanlines" aria-hidden="true" />

      <span className="arcade-content">
        <ArcadeIcon />
        <span className="arcade-text">
          <span className="arcade-label">Play Mini Game</span>
          <span className="arcade-tag">
            <span className="arcade-tag-arrow">▸</span>
            Insert Coin
            <span className="arcade-tag-arrow">◂</span>
          </span>
        </span>
      </span>
    </button>
    <HighScoreChip />
  </span>
);

// ============================================================
// MiniGameModal — hosts the live PromptPatrol game.
// ============================================================

export const MiniGameModal = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="game-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />

          <motion.div
            className="game-modal game-modal--play"
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-modal-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0.24, 1] }}
          >
            <PromptPatrol onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
