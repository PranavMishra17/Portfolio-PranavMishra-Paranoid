// src/components/MiniGame.js
//
// Entry point for an upcoming portfolio mini-game. Right now this ships
// only the CTA button + a "Coming Soon" panel. The actual game is
// deferred. The notes below capture the agreed concept so a future
// session (or future me) can pick it up without re-running the
// brainstorming pass.
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
// User will pick when the game itself is built.
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
//
// Either Firebase or Pantry satisfies "live + no backend we host."
// Default plan is Firebase for the security-rule validation; switch to
// Pantry if Firebase setup feels heavy.

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './MiniGame.css';

// ---------------- CTA button ----------------

export const PlayMiniGameButton = ({ onClick }) => (
  <motion.button
    type="button"
    className="play-game-btn"
    onClick={onClick}
    whileHover={{ scale: 1.04, y: -2 }}
    whileTap={{ scale: 0.98 }}
    aria-label="Play mini game"
  >
    <svg
      className="play-game-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="6" width="20" height="12" rx="4" />
      <path d="M6 12h4M8 10v4" />
      <circle cx="15" cy="11" r="1.2" fill="currentColor" />
      <circle cx="17.5" cy="13.5" r="1.2" fill="currentColor" />
    </svg>
    <span>Play Mini Game</span>
    <span className="play-game-tag">Soon</span>
  </motion.button>
);

// ---------------- Coming-soon modal ----------------

const PLACEHOLDER_LEADERS = [
  { rank: 1 },
  { rank: 2 },
  { rank: 3 },
  { rank: 4 },
  { rank: 5 },
];

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
            className="game-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="game-modal-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0.24, 1] }}
          >
            <button
              type="button"
              className="game-modal-close"
              onClick={onClose}
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="game-modal-body">
              <span className="game-modal-eyebrow">Mini Game</span>
              <h2 id="game-modal-title" className="game-modal-title">
                Prompt Patrol
              </h2>
              <span className="game-modal-soon" role="status">
                <span className="game-modal-soon-dot" />
                Coming Soon
              </span>

              <p className="game-modal-teaser">
                A one-page, mouse-only endless runner. Word-bubbles drift
                across the screen — pop the unsafe prompts before they slip
                past you and let the safe ones float by. Miss ten unsafe
                bubbles and the round is over.
              </p>

              <div className="game-modal-leaders">
                <div className="game-modal-leaders-header">
                  <span className="game-modal-leaders-title">Global High Scores</span>
                  <span className="game-modal-leaders-status">live · once shipped</span>
                </div>
                <ol className="game-modal-leaders-list" aria-label="Leaderboard placeholder">
                  {PLACEHOLDER_LEADERS.map((row) => (
                    <li key={row.rank} className="game-modal-leader-row is-empty">
                      <span className="rank">#{row.rank}</span>
                      <span className="name">— — —</span>
                      <span className="score">—</span>
                    </li>
                  ))}
                </ol>
                <p className="game-modal-leaders-note">
                  Backed by a free realtime DB so the board updates the moment
                  another player posts a run. No personal backend required.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
