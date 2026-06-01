// portfolio/src/components/game/engine.js
//
// Plain-JS Prompt Patrol engine. No React, no DOM beyond the canvas
// element it's handed. The React wrapper drives this with rAF, feeds
// input, listens for state events.

import { CONFIG } from './config';
import { BLUE, RED, BLACK, GREY, GREY_BY_HIDDEN } from './phrasebook';
import { renderFrame } from './sprites';
import { sfx } from './audio';

const STATE = {
  TITLE: 'title',
  PLAYING: 'playing',
  GAMEOVER_LIVES: 'gameover_lives',
  GAMEOVER_BOMB: 'gameover_bomb',
};

// ============================================================
// Utility
// ============================================================

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const randSign = () => (Math.random() < 0.5 ? -1 : 1);

const weightedPick = (entries) => {
  // entries: array of [key, weight]
  const total = entries.reduce((s, e) => s + e[1], 0);
  let r = Math.random() * total;
  for (const [key, w] of entries) {
    r -= w;
    if (r <= 0) return key;
  }
  return entries[entries.length - 1][0];
};

// ============================================================
// Engine
// ============================================================

export class Engine {
  constructor({ canvas, onStateChange = () => {}, onScoreChange = () => {} }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.onStateChange = onStateChange;
    this.onScoreChange = onScoreChange;

    // logical canvas size — we render at this size and scale via CSS.
    // 960x600 gives a wider 16:10 play area so the cannon's arc has room
    // to breathe and capsules don't clump near the right edge.
    this.W = 960;
    this.H = 600;

    this.state = STATE.TITLE;
    this.reset();
  }

  // ----------------------------------------------------------
  // State setup
  // ----------------------------------------------------------

  reset() {
    this.score = 0;
    this.lives = CONFIG.lives.initial;
    this.wave = 0;
    this.loopCount = 0;
    this.time = 0;

    this.capsules = [];
    this.projectiles = [];
    this.particles = [];
    this.floats = []; // tiny floating-number popups

    // wind state machine
    const startLevel = 'still';
    this.wind = {
      current: startLevel,
      next: startLevel,
      ax: 0,
      targetAx: 0,
      phaseTimeLeft: rand(CONFIG.wind.phaseMinSec, CONFIG.wind.phaseMaxSec),
      transitioning: false,
      transitionMsLeft: 0,
      label: CONFIG.wind.levels[startLevel].label,
      changeBannerMs: 0,
    };

    // spawn state
    const firstWave = CONFIG.spawn.rotation[0];
    this.spawner = {
      waveName: firstWave,
      waveTimeLeft: CONFIG.spawn.waveDurationSec,
      tokensToSpawn: CONFIG.spawn.waveTokenCount[firstWave],
      nextSpawnIn: 0.4,
      lastClass: null,
      waveMilestoneShownMs: 0,
    };

    // cannon
    this.cannon = { x: 90, y: this.H - 90, barrelLen: 36, recoilMs: 0 };
    this.aim = { x: this.W * 0.6, y: this.H * 0.3 };

    // charge state
    this.charge = {
      held: false,
      heldMs: 0,
      ready: true,
      cooldownLeft: 0,
      lastChargeSoundMs: 0,
    };

    // gibberish vector output emitted by the model on safe escapes
    this.gibberish = [];

    // model device (top center). Cylon-style scanner + status LEDs; no
    // smiley face. The state machine animates the scanner line, status
    // dot ticker, antenna light, and power LED.
    this.claude = {
      x: this.W / 2,
      y: 38,
      w: 168,
      h: 78,
      scannerPhase: 0,           // 0..1, drives the sweeping line
      scannerSpeed: 0.6,         // cycles per second
      statusDotPhase: 0,         // 0..1, drives the .  .. ... ticker
      ledOn: true,
      ledLeftMs: 800,
      antennaOn: true,
      antennaLeftMs: 600,
      hitFlashMs: 0,
      celebrateMs: 0,            // boosts scanner speed briefly
      dead: false,
    };

    // keyboard — bigger, anchored bottom-right, capsules now spawn
    // FROM the keyboard's top edge (see spawnCapsule).
    this.keyboard = {
      x: this.W - 120,
      y: this.H - 70,
      w: 168,
      h: 60,
      keysLit: new Array(39).fill(0),     // ms remaining per key (3 rows x 13)
      spawnBurstX: 0,
      spawnBurstMs: 0,
      shimmerLeftMs: rand(CONFIG.animations.keyboardShimmerMinSec, CONFIG.animations.keyboardShimmerMaxSec) * 1000,
    };

    // screen shake
    this.shakeMs = 0;
    this.shakeMag = 0;
  }

  setState(next) {
    if (this.state === next) return;
    this.state = next;
    this.onStateChange(next, this.snapshot());
  }

  snapshot() {
    return {
      state: this.state,
      score: this.score,
      lives: this.lives,
      wave: this.wave + 1,
      loopCount: this.loopCount,
    };
  }

  // ----------------------------------------------------------
  // Public lifecycle
  // ----------------------------------------------------------

  start() {
    this.reset();
    this.setState(STATE.PLAYING);
    sfx.start();
  }

  endGame(reason) {
    this.setState(reason === 'bomb' ? STATE.GAMEOVER_BOMB : STATE.GAMEOVER_LIVES);
    this.claude.dead = true;
    if (reason === 'bomb') sfx.gameOverBomb();
    else sfx.gameOverLives();
  }

  // ----------------------------------------------------------
  // Input
  // ----------------------------------------------------------

  setAim(x, y) {
    this.aim.x = x;
    this.aim.y = y;
    this.claude.watchTargetX = x;
  }

  inputDown() {
    if (this.state !== STATE.PLAYING) return;
    this.charge.held = true;
    this.charge.heldMs = 0;
  }

  inputUp() {
    if (this.state !== STATE.PLAYING) return;
    if (!this.charge.held) return;
    const held = this.charge.heldMs;
    this.charge.held = false;
    const useCharge = CONFIG.charge.enabled && held >= CONFIG.charge.minHoldMs;
    const chargeT = useCharge ? clamp(held / CONFIG.charge.maxHoldMs, 0, 1) : 0;
    this.fire(chargeT, /*hotRed=*/ false);
    this.charge.heldMs = 0;
  }

  fire(chargeT, hotRed = false) {
    if (!this.charge.ready) return;
    if (this.charge.cooldownLeft > 0) return;

    const c = this.cannon;
    const dx = this.aim.x - c.x;
    const dy = this.aim.y - c.y;
    const dist = Math.hypot(dx, dy) || 1;
    const nx = dx / dist;
    const ny = dy / dist;

    const muzzleX = c.x + nx * c.barrelLen;
    const muzzleY = c.y + ny * c.barrelLen;

    let speedMult, sizeMult, windResist;
    if (hotRed) {
      speedMult = CONFIG.charge.hotRedSpeedMult;
      sizeMult = CONFIG.charge.hotRedSizeMult;
      windResist = CONFIG.charge.hotRedWindResist;
    } else {
      speedMult = CONFIG.charge.affectsSpeed
        ? lerp(1, CONFIG.charge.speedMultMax, chargeT)
        : 1;
      sizeMult = lerp(1, CONFIG.charge.sizeMultMax, chargeT);
      windResist = lerp(0, CONFIG.charge.windResistMax, chargeT);
    }
    const speed = CONFIG.physics.baseProjectileSpeed * speedMult;

    this.projectiles.push({
      x: muzzleX,
      y: muzzleY,
      vx: nx * speed,
      vy: ny * speed,
      size: CONFIG.physics.projectileSize * sizeMult,
      chargeT,
      hotRed,
      windResist,
      trail: [],
      lifeMs: 5000,
    });

    this.charge.cooldownLeft = CONFIG.physics.cooldownMs;
    this.cannon.recoilMs = 140;
    if (hotRed) sfx.launchHot();
    else sfx.launch();
  }

  // ----------------------------------------------------------
  // Main tick
  // ----------------------------------------------------------

  tick(dtMs) {
    const dt = dtMs / 1000;
    this.time += dt;

    if (this.state === STATE.PLAYING) {
      if (this.charge.held) {
        this.charge.heldMs += dtMs;
        // 3-second overcharge auto-fire — HOT RED megashot
        if (this.charge.heldMs >= CONFIG.charge.hotRedHoldMs) {
          this.charge.held = false;
          this.fire(1, /*hotRed=*/ true);
          this.charge.heldMs = 0;
        } else if (this.charge.heldMs > CONFIG.charge.maxHoldMs) {
          // play a periodic overcharge whine past max charge
          this.charge.lastChargeSoundMs += dtMs;
          if (this.charge.lastChargeSoundMs > 280) {
            sfx.overcharge();
            this.charge.lastChargeSoundMs = 0;
          }
        }
      } else {
        this.charge.lastChargeSoundMs = 0;
      }
      if (this.charge.cooldownLeft > 0) this.charge.cooldownLeft -= dtMs;
      if (this.cannon.recoilMs > 0) this.cannon.recoilMs -= dtMs;

      this.updateWind(dt, dtMs);
      this.updateSpawner(dt);
      this.updateCapsules(dt);
      this.updateProjectiles(dt, dtMs);
      this.checkCollisions();
      this.updateParticles(dtMs);
      this.updateFloats(dtMs);
      this.updateGibberish(dtMs);
      this.updateClaude(dtMs);
      this.updateKeyboard(dtMs);

      if (this.shakeMs > 0) this.shakeMs -= dtMs;
      if (this.wind.changeBannerMs > 0) this.wind.changeBannerMs -= dtMs;
      if (this.spawner.waveMilestoneShownMs > 0) this.spawner.waveMilestoneShownMs -= dtMs;
    } else {
      // game over: keep claude visible, update its expressions, no spawns
      this.updateClaude(dtMs);
      this.updateParticles(dtMs);
      this.updateFloats(dtMs);
      this.updateGibberish(dtMs);
      if (this.shakeMs > 0) this.shakeMs -= dtMs;
      if (this.cannon.recoilMs > 0) this.cannon.recoilMs -= dtMs;
    }
  }

  // ----------------------------------------------------------
  // Wind
  // ----------------------------------------------------------

  pickNewWindLevel(exclude) {
    const entries = Object.entries(CONFIG.wind.levels)
      .filter(([k]) => k !== exclude)
      .map(([k, v]) => [k, v.weight]);
    return weightedPick(entries);
  }

  updateWind(dt, dtMs) {
    const w = this.wind;
    if (w.transitioning) {
      w.transitionMsLeft -= dtMs;
      const t = 1 - clamp(w.transitionMsLeft / CONFIG.wind.transitionMs, 0, 1);
      const fromAx = CONFIG.wind.levels[w.current].ax;
      const toAx = CONFIG.wind.levels[w.next].ax;
      w.ax = lerp(fromAx, toAx, t);
      if (w.transitionMsLeft <= 0) {
        w.transitioning = false;
        w.current = w.next;
        w.ax = toAx;
        w.label = CONFIG.wind.levels[w.next].label;
        w.changeBannerMs = 1500;
        w.phaseTimeLeft = rand(CONFIG.wind.phaseMinSec, CONFIG.wind.phaseMaxSec);
        sfx.windChange();
      }
    } else {
      w.phaseTimeLeft -= dt;
      if (w.phaseTimeLeft <= 0) {
        w.next = this.pickNewWindLevel(w.current);
        w.transitioning = true;
        w.transitionMsLeft = CONFIG.wind.transitionMs;
      }
    }
  }

  // ----------------------------------------------------------
  // Spawner
  // ----------------------------------------------------------

  updateSpawner(dt) {
    const sp = this.spawner;
    sp.waveTimeLeft -= dt;
    sp.nextSpawnIn -= dt;

    if (sp.nextSpawnIn <= 0 && sp.tokensToSpawn > 0) {
      this.spawnCapsule();
      sp.tokensToSpawn -= 1;
      const wave = sp.waveName;
      const tokenCount = CONFIG.spawn.waveTokenCount[wave];
      const avgSpacing = CONFIG.spawn.waveDurationSec / tokenCount;
      sp.nextSpawnIn = rand(avgSpacing * 0.7, avgSpacing * 1.3);
    }

    if (sp.waveTimeLeft <= 0 && sp.tokensToSpawn <= 0) {
      // next wave
      this.wave += 1;
      const rot = CONFIG.spawn.rotation;
      const nextIndex = this.wave % rot.length;
      if (nextIndex === 0) this.loopCount += 1;
      const nextWave = rot[nextIndex];
      sp.waveName = nextWave;
      sp.waveTimeLeft = CONFIG.spawn.waveDurationSec;
      sp.tokensToSpawn = CONFIG.spawn.waveTokenCount[nextWave];
      sp.lastClass = null;
      sp.waveMilestoneShownMs = nextWave === 'rush' ? 1500 : 0;
    }
  }

  pickClass() {
    const wave = this.spawner.waveName;
    const dist = CONFIG.spawn.classDistribution[wave];
    const entries = Object.entries(dist);
    let cls = weightedPick(entries);
    if (cls === this.spawner.lastClass && Math.random() < 0.5) {
      cls = weightedPick(entries);
    }
    this.spawner.lastClass = cls;
    return cls;
  }

  spawnCapsule() {
    const cls = this.pickClass();
    let text;
    let hidden = null;

    if (cls === 'blue') {
      text = BLUE[Math.floor(Math.random() * BLUE.length)];
    } else if (cls === 'red') {
      text = RED[Math.floor(Math.random() * RED.length)];
    } else if (cls === 'black') {
      text = BLACK[Math.floor(Math.random() * BLACK.length)];
    } else {
      // GREY: sample hidden bucket, then phrase from that bucket
      const distEntries = Object.entries(CONFIG.spawn.greyHiddenDistribution);
      hidden = weightedPick(distEntries);
      const pool = GREY_BY_HIDDEN[hidden];
      const entry = pool[Math.floor(Math.random() * pool.length)];
      text = entry.text;
    }

    // measure approx capsule width — engine doesn't have font metrics
    // available at spawn; sprites.js does final measure on draw, but
    // for hit-test we approximate with a glyph width of 7 px in Space Mono.
    const charW = 7;
    const innerW = Math.min(text.length * charW, CONFIG.ui.capsuleWidthCap - 2 * CONFIG.ui.capsulePadding);
    const w = innerW + 2 * CONFIG.ui.capsulePadding;
    const h = CONFIG.ui.capsuleHeight;

    // spawn FROM the keyboard's top edge so the capsule appears to
    // emerge between keys. Random x within the keyboard's inner width.
    const kbInner = this.keyboard.w / 2 - 18;
    const spawnLocalX = rand(-kbInner, kbInner);
    const x = this.keyboard.x + spawnLocalX - w / 2;
    const y = this.keyboard.y - this.keyboard.h / 2 - h - 2;

    // trigger an upward spark burst at the spawn location
    this.keyboard.spawnBurstX = this.keyboard.x + spawnLocalX;
    this.keyboard.spawnBurstMs = 260;

    // rise speed with per-loop ramp, jitter
    const baseRise = CONFIG.spawn.capsuleRiseSpeed;
    const ramp = Math.min(this.loopCount * CONFIG.spawn.perLoopRamp.riseSpeed, CONFIG.spawn.perLoopRamp.cap);
    const vy = -(baseRise * (1 + ramp)) + rand(-CONFIG.spawn.capsuleRiseJitter, CONFIG.spawn.capsuleRiseJitter);
    const vx = -CONFIG.spawn.capsuleHorizDrift + rand(-2, 2);

    this.capsules.push({ cls, text, hidden, x, y, w, h, vx, vy });

    // light up some keys on the keyboard for the typing ripple
    this.rippleKeyboard(text.length);
  }

  // ----------------------------------------------------------
  // Capsules
  // ----------------------------------------------------------

  updateCapsules(dt) {
    for (let i = this.capsules.length - 1; i >= 0; i--) {
      const c = this.capsules[i];
      c.x += c.vx * dt;
      c.y += c.vy * dt;

      // escape = capsule top has reached the model zone
      if (c.y < this.claude.y + this.claude.h * 0.4) {
        this.handleEscape(c);
        this.capsules.splice(i, 1);
      } else if (c.x + c.w < -20) {
        // drifted off-screen — quiet despawn, no penalty
        this.capsules.splice(i, 1);
      }
    }
  }

  handleEscape(c) {
    const truth = this.resolveTruth(c);
    if (truth === 'unsafe') {
      this.lives -= 1;
      this.shake(CONFIG.ui.screenShakePx);
      this.claude.hitFlashMs = CONFIG.animations.hitFlashMs;
      sfx.hit();
      this.onScoreChange(this.snapshot());
      if (this.lives <= 0) this.endGame('lives');
    } else if (truth === 'bomb') {
      // BOMB ESCAPED = catastrophic. Big shake + game over.
      this.shake(CONFIG.ui.screenShakePx * 3);
      this.emitParticles(c.x + c.w / 2, c.y, CONFIG.colors.red, 28);
      this.claude.hitFlashMs = CONFIG.animations.hitFlashMs * 2;
      this.endGame('bomb');
    } else if (truth === 'safe') {
      // SAFE REACHED MODEL = good. Tingle + gibberish vector output.
      this.spawnGibberish();
      sfx.thinking();
      this.claude.celebrateMs = CONFIG.animations.popCelebrationMs;
    }
  }

  resolveTruth(c) {
    if (c.cls === 'blue') return 'safe';
    if (c.cls === 'red') return 'unsafe';
    if (c.cls === 'black') return 'bomb';
    return c.hidden; // grey
  }

  // ----------------------------------------------------------
  // Projectiles
  // ----------------------------------------------------------

  updateProjectiles(dt, dtMs) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const p = this.projectiles[i];
      const windResist = p.windResist != null ? p.windResist : 0;
      p.vx += this.wind.ax * (1 - windResist) * dt;
      p.vy += CONFIG.physics.gravity * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      p.trail.push({ x: p.x, y: p.y });
      const trailLen = p.hotRed ? 16 : (p.chargeT > 0.2 ? 8 : 4);
      if (p.trail.length > trailLen) p.trail.shift();

      p.lifeMs -= dtMs;
      if (
        p.x < -24 || p.x > this.W + 24 ||
        p.y > this.H + 24 || p.lifeMs <= 0
      ) {
        this.projectiles.splice(i, 1);
      }
    }
  }

  // ----------------------------------------------------------
  // Collision
  // ----------------------------------------------------------

  checkCollisions() {
    const hbMap = CONFIG.ui.hitboxMult;
    for (let pi = this.projectiles.length - 1; pi >= 0; pi--) {
      const p = this.projectiles[pi];
      for (let ci = this.capsules.length - 1; ci >= 0; ci--) {
        const c = this.capsules[ci];
        const m = (hbMap && hbMap[c.cls]) || 1;
        // expand the bounding box by (m-1)/2 on each side
        const padX = (c.w * (m - 1)) / 2;
        const padY = (c.h * (m - 1)) / 2;
        if (
          p.x >= c.x - padX &&
          p.x <= c.x + c.w + padX &&
          p.y >= c.y - padY &&
          p.y <= c.y + c.h + padY
        ) {
          this.projectiles.splice(pi, 1);
          this.capsules.splice(ci, 1);
          this.handlePop(c);
          break;
        }
      }
    }
  }

  handlePop(c) {
    const truth = this.resolveTruth(c);
    const sc = CONFIG.scoring;
    let scoreDelta = 0;
    let particleColor = CONFIG.colors.crt;
    let particleCount = CONFIG.animations.popParticleCount;

    if (truth === 'bomb') {
      // BOMB POPPED = saved the model. +5 score, big celebration.
      scoreDelta = sc.blackPop.score;
      particleColor = '#ff5d6c';
      particleCount = 22;
      this.claude.celebrateMs = CONFIG.animations.popCelebrationMs * 1.6;
      this.shake(CONFIG.ui.screenShakePx * 0.6);
      sfx.popBomb();
    } else if (truth === 'unsafe') {
      scoreDelta = sc.redPop.score;
      particleColor = CONFIG.colors.red;
      this.claude.celebrateMs = CONFIG.animations.popCelebrationMs;
      sfx.popUnsafe();
    } else if (truth === 'safe') {
      scoreDelta = sc.bluePop.score;
      particleColor = CONFIG.colors.blue;
      sfx.popSafe();
    }

    this.score += scoreDelta;
    this.emitParticles(c.x + c.w / 2, c.y + c.h / 2, particleColor, particleCount);
    this.spawnFloat(c.x + c.w / 2, c.y, scoreDelta);
    this.onScoreChange(this.snapshot());

    if (this.lives <= 0) this.endGame('lives');
  }

  // ----------------------------------------------------------
  // Particles + floating numbers
  // ----------------------------------------------------------

  emitParticles(x, y, color, count) {
    const life = CONFIG.animations.popParticleLifeMs;
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = rand(80, 220);
      this.particles.push({
        x, y,
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        life, lifeMax: life,
        color,
        size: rand(2, 4),
      });
    }
  }

  updateParticles(dtMs) {
    const dt = dtMs / 1000;
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 200 * dt; // mild gravity
      p.life -= dtMs;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  spawnFloat(x, y, delta) {
    if (delta === 0) return;
    this.floats.push({
      x, y,
      text: delta > 0 ? `+${delta}` : `${delta}`,
      color: delta > 0 ? CONFIG.colors.crt : CONFIG.colors.red,
      lifeMs: 700,
      lifeMaxMs: 700,
    });
  }

  updateFloats(dtMs) {
    for (let i = this.floats.length - 1; i >= 0; i--) {
      const f = this.floats[i];
      f.y -= 30 * (dtMs / 1000);
      f.lifeMs -= dtMs;
      if (f.lifeMs <= 0) this.floats.splice(i, 1);
    }
  }

  // ----------------------------------------------------------
  // Model gibberish (vector output on safe-through)
  // ----------------------------------------------------------

  genVector() {
    const dims = 3;
    const parts = [];
    for (let i = 0; i < dims; i++) {
      const v = (Math.random() - 0.5) * 1.9;
      const s = (v >= 0 ? ' ' : '') + v.toFixed(3);
      parts.push(s);
    }
    return '[' + parts.join('  ') + ']';
  }

  spawnGibberish() {
    const c = this.claude;
    // emit 1-2 lines just to the left of the model, drifting left
    const lines = Math.random() < 0.7 ? 1 : 2;
    for (let i = 0; i < lines; i++) {
      this.gibberish.push({
        text: this.genVector(),
        x: c.x - c.w / 2 - 10,
        y: c.y + 14 + i * 12,
        vx: -34 + rand(-6, 6),
        vy: -8,
        lifeMs: 1500,
        lifeMaxMs: 1500,
      });
    }
  }

  updateGibberish(dtMs) {
    const dt = dtMs / 1000;
    for (let i = this.gibberish.length - 1; i >= 0; i--) {
      const g = this.gibberish[i];
      g.x += g.vx * dt;
      g.y += g.vy * dt;
      g.lifeMs -= dtMs;
      if (g.lifeMs <= 0 || g.x < -160) this.gibberish.splice(i, 1);
    }
  }

  // ----------------------------------------------------------
  // Model device animations (no smiley — just scanner / LEDs)
  // ----------------------------------------------------------

  updateClaude(dtMs) {
    const c = this.claude;
    const dt = dtMs / 1000;

    // scanner sweep — speed boosted briefly after a pop
    const boost = c.celebrateMs > 0 ? 2.4 : 1.0;
    c.scannerPhase = (c.scannerPhase + c.scannerSpeed * boost * dt) % 1;

    // status dot ticker — cycles 0 → 1 → 2 → 3 → 0 dots
    c.statusDotPhase = (c.statusDotPhase + 0.9 * dt) % 1;

    // power LED + antenna light blinking on independent timers
    c.ledLeftMs -= dtMs;
    if (c.ledLeftMs <= 0) {
      c.ledOn = !c.ledOn;
      c.ledLeftMs = c.ledOn ? rand(1200, 1800) : rand(80, 140);
    }

    c.antennaLeftMs -= dtMs;
    if (c.antennaLeftMs <= 0) {
      c.antennaOn = !c.antennaOn;
      c.antennaLeftMs = c.antennaOn ? rand(900, 1400) : rand(120, 200);
    }

    if (c.celebrateMs > 0) c.celebrateMs -= dtMs;
    if (c.hitFlashMs > 0) c.hitFlashMs -= dtMs;
  }

  // ----------------------------------------------------------
  // Keyboard ripple
  // ----------------------------------------------------------

  rippleKeyboard(charCount) {
    // "type out" the phrase: light a key per character, staggered, with
    // decreasing brightness so the last keystroke is the loudest.
    const keys = Math.min(this.keyboard.keysLit.length, Math.max(4, charCount));
    for (let i = 0; i < keys; i++) {
      const idx = Math.floor(Math.random() * this.keyboard.keysLit.length);
      this.keyboard.keysLit[idx] = 280 + i * 18;
    }
  }

  updateKeyboard(dtMs) {
    for (let i = 0; i < this.keyboard.keysLit.length; i++) {
      if (this.keyboard.keysLit[i] > 0) {
        this.keyboard.keysLit[i] -= dtMs;
      }
    }
    if (this.keyboard.spawnBurstMs > 0) this.keyboard.spawnBurstMs -= dtMs;

    this.keyboard.shimmerLeftMs -= dtMs;
    if (this.keyboard.shimmerLeftMs <= 0) {
      const idx = Math.floor(Math.random() * this.keyboard.keysLit.length);
      this.keyboard.keysLit[idx] = Math.max(this.keyboard.keysLit[idx], 200);
      this.keyboard.shimmerLeftMs = rand(CONFIG.animations.keyboardShimmerMinSec, CONFIG.animations.keyboardShimmerMaxSec) * 1000;
    }
  }

  // ----------------------------------------------------------
  // Screen shake
  // ----------------------------------------------------------

  shake(magnitude) {
    this.shakeMs = 220;
    this.shakeMag = magnitude;
  }

  // ----------------------------------------------------------
  // Render — delegates to sprites.js
  // ----------------------------------------------------------

  render() {
    renderFrame(this.ctx, this);
  }
}

export { STATE };
