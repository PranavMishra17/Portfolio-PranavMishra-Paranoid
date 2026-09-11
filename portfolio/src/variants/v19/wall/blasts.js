// v19 — how the wall comes apart.
//
// Separate from what it is made of, so any material can fail in any of these ways. Each one
// returns, per block: when it starts moving, where it is thrown, how it spins, and how it
// leaves the screen. Nothing takes longer than a second.
//
//   burst  — it comes at you and past you, then up and to the left, toward the way back.
//   drop   — the wall simply stops holding itself up. Straight down, out of frame.
//   sweep  — one flat wipe to the upper left, nearest first: a hand clearing a table.
//   fade   — nothing is thrown. Every piece shrinks where it stands, from the blast outward.

export const BLASTS = {
  burst: {
    key: 'burst',
    gravity: { x: -640, y: -1180 },
    kick(b, close, d, near, seed) {
      return {
        at: close > 0 ? seed * 26 : (d - near) * 0.34 + seed * 34,
        vz: 3.2 + close * 6.4 + seed * 1.1,
        vx: b.ux * (60 + close * 290 + seed * 60) - 130,
        vy: b.uy * (60 + close * 290 + seed * 60) - 190,
        va: (seed - 0.5) * (1.1 + close * 3),
        fade: 11,
      };
    },
  },

  drop: {
    key: 'drop',
    gravity: { x: 0, y: 2600 },
    kick(b, close, d, near, seed) {
      return {
        at: close > 0 ? seed * 30 : (d - near) * 0.5 + seed * 90,
        vz: 0,
        vx: b.ux * (20 + close * 90) + (seed - 0.5) * 40,
        vy: -(30 + close * 120) + seed * 20,
        va: (seed - 0.5) * (0.6 + close * 1.6),
        fade: 0,
      };
    },
  },

  sweep: {
    key: 'sweep',
    gravity: { x: -180, y: -120 },
    kick(b, close, d, near, seed) {
      // ordered strictly by distance from the blast, so it reads as one movement
      return {
        at: d * 0.5 + seed * 18,
        vz: 0,
        vx: -(760 + close * 260 + seed * 120),
        vy: -(430 + close * 150 + seed * 80),
        va: (seed - 0.5) * 0.5,
        fade: 0,
      };
    },
  },

  fade: {
    key: 'fade',
    gravity: { x: -40, y: -70 },
    kick(b, close, d, near, seed) {
      return {
        at: d * 0.7 + seed * 40,
        vz: 0,
        vx: b.ux * (10 + close * 26),
        vy: b.uy * (10 + close * 26) - 14,
        va: (seed - 0.5) * 0.25,
        shrink: 1.5 + seed * 0.7,
        fade: 0,
      };
    },
  },
};

export const DEFAULT_BLAST = 'burst';
