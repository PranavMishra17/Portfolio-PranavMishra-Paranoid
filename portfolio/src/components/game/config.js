// portfolio/src/components/game/config.js
//
// Single source of truth for every gameplay number in Prompt Patrol.
// Loaded once at boot, validated, frozen for the session.
//
// To tune the game: edit a number here, save, refresh the page.
// Adding new phrases: see ./phrasebook.js (the numbers here just
// weight how often each class spawns).
//
// Mirrors §14 of docs/prompt-patrol-gdd.html.

export const CONFIG = {
  lives: {
    initial: 3,
    bombInstaKill: true,
  },

  physics: {
    gravity: 620,              // px/s²
    baseProjectileSpeed: 720,  // px/s at charge=0
    projectileSize: 6,         // chevron px (scales up to 10 at full charge)
    cooldownMs: 250,
  },

  charge: {
    enabled: true,
    minHoldMs: 120,            // below this = tap, not charge
    maxHoldMs: 1000,           // full ring
    sizeMultMax: 1.6,
    windResistMax: 0.3,        // 30% wind dampening at full charge
    affectsSpeed: false,       // OPTIONAL second axis; default off
    speedMultMax: 1.8,
  },

  wind: {
    levels: {
      still:     { ax: 0,   weight: 0.25,  label: 'STILL' },
      lightL:    { ax: -18, weight: 0.225, label: 'LIGHT ◂' },
      lightR:    { ax: 18,  weight: 0.225, label: 'LIGHT ▸' },
      moderateL: { ax: -42, weight: 0.15,  label: 'MODERATE ◂' },
      moderateR: { ax: 42,  weight: 0.15,  label: 'MODERATE ▸' },
    },
    phaseMinSec: 20,
    phaseMaxSec: 30,
    transitionMs: 1500,
  },

  spawn: {
    waveDurationSec: 20,
    rotation: ['calm', 'mixed', 'rush', 'recovery'],
    perLoopRamp: { spawnRate: 0.04, riseSpeed: 0.02, cap: 0.40 },
    classDistribution: {
      calm:     { blue: 0.55, red: 0.15, grey: 0.28, black: 0.02 },
      mixed:    { blue: 0.30, red: 0.32, grey: 0.33, black: 0.05 },
      rush:     { blue: 0.18, red: 0.48, grey: 0.30, black: 0.04 },
      recovery: { blue: 0.45, red: 0.18, grey: 0.35, black: 0.02 },
    },
    waveTokenCount: { calm: 6, mixed: 10, rush: 16, recovery: 8 },
    greyHiddenDistribution: { safe: 0.55, unsafe: 0.30, bomb: 0.15 },
    capsuleRiseSpeed: 55,      // px/s baseline before per-loop ramp
    capsuleRiseJitter: 12,     // ± px/s randomization per capsule
    capsuleHorizDrift: 6,      // px/s, slight upward-left bias
  },

  scoring: {
    redPop:      { score: +1, life: 0  },
    bluePop:     { score: -1, life: 0  },
    redEscape:   { score: 0,  life: -1 },
    blueEscape:  { score: 0,  life: 0  },
    blackEscape: { score: 0,  life: 0  },
    bombPop:     { gameOver: true },
    streakBonus: { enabled: false, threshold: 5, mult: 2, decayMs: 10000 },
  },

  ui: {
    capsuleHeight:        24,
    capsuleHeightMobile:  28,
    capsuleWidthCap:      140,
    capsuleMaxChars:      14,
    capsulePadding:       10,
    aimIndicatorPx:       120,
    chargeRingSegments:   5,
    heartCount:           3,
    screenShakePx:        4,
    reducedMotion:        'auto', // 'auto' | 'on' | 'off'
  },

  animations: {
    claudeBlinkMinSec:       4,
    claudeBlinkMaxSec:       6,
    claudeIdleThoughtMinSec: 10,
    claudeIdleThoughtMaxSec: 20,
    keyboardShimmerMinSec:   3,
    keyboardShimmerMaxSec:   5,
    popParticleCount:        10,
    popParticleLifeMs:       500,
    hitFlashMs:              120,
    popCelebrationMs:        300,
  },

  leaderboard: {
    enabled:          false, // global leaderboard not wired yet — see MiniGame.js header comment
    primary:          'firebase',
    fallback:         'getpantry',
    submitThrottleMs: 3000,
    nameMaxChars:     3,
    scoreCap:         10000,
  },

  colors: {
    bg:        '#02050a',
    grid:      'rgba(65, 255, 126, 0.05)',
    crt:       '#41ff7e',
    crtDim:    '#2dd66c',
    crtDeep:   '#1a5530',
    blue:      '#6cb4ff',
    blueBg:    'rgba(108, 180, 255, 0.18)',
    red:       '#ff7a7a',
    redBg:     'rgba(255, 122, 122, 0.18)',
    grey:      '#b5c0cc',
    greyBg:    'rgba(124, 138, 154, 0.14)',
    black:     '#4a4550',
    blackBg:   'rgba(8, 8, 12, 0.85)',
    gold:      '#f4c062',
    fg:        '#e6edf3',
    fgDim:     '#9aa8b8',
    fgDeep:    '#5a6776',
    heart:     '#ff5d6c',
    heartDim:  '#2a1a1f',
  },
};

// ============================================================
// Validation — anti-foot-gun rules from GDD §14
// ============================================================

const sumWithin = (obj, target, tol = 0.001) => {
  const s = Object.values(obj).reduce((a, b) => a + (typeof b === 'number' ? b : 0), 0);
  return Math.abs(s - target) < tol;
};

const validate = (cfg) => {
  const warn = (msg) => console.warn(`[promptpatrol/config] ${msg}`);

  if (cfg.lives.initial < 1 || cfg.lives.initial > 99) warn('lives.initial out of [1,99]');
  if (cfg.physics.gravity <= 0) warn('physics.gravity must be > 0');
  if (cfg.physics.baseProjectileSpeed <= 0) warn('physics.baseProjectileSpeed must be > 0');
  if (cfg.charge.maxHoldMs < cfg.charge.minHoldMs) warn('charge.maxHoldMs < minHoldMs');

  for (const [name, dist] of Object.entries(cfg.spawn.classDistribution)) {
    if (!sumWithin(dist, 1)) warn(`spawn.classDistribution.${name} does not sum to 1.0`);
  }
  if (!sumWithin(cfg.spawn.greyHiddenDistribution, 1)) {
    warn('spawn.greyHiddenDistribution does not sum to 1.0');
  }

  const windWeights = Object.values(cfg.wind.levels).reduce((a, l) => a + l.weight, 0);
  if (Math.abs(windWeights - 1) > 0.001) warn('wind.levels weights do not sum to 1.0');
};

try {
  validate(CONFIG);
} catch (err) {
  console.error('[promptpatrol/config] validation crashed; using config anyway', err);
}

Object.freeze(CONFIG);
Object.values(CONFIG).forEach((v) => typeof v === 'object' && v !== null && Object.freeze(v));
