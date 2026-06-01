// portfolio/src/components/game/sprites.js
//
// All canvas drawing for Prompt Patrol. Pure functions that take
// (ctx, engine) and paint. Engine owns state; sprites paints it.

import { CONFIG } from './config';
import { STATE } from './engine';

const C = CONFIG.colors;

// ============================================================
// Entry
// ============================================================

export function renderFrame(ctx, eng) {
  const { W, H } = eng;

  // background fill
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  // screen shake
  let shakeX = 0;
  let shakeY = 0;
  if (eng.shakeMs > 0) {
    const t = eng.shakeMs / 220;
    shakeX = (Math.random() - 0.5) * 2 * eng.shakeMag * t;
    shakeY = (Math.random() - 0.5) * 2 * eng.shakeMag * t;
  }

  ctx.save();
  ctx.translate(shakeX, shakeY);

  drawGrid(ctx, eng);
  drawModelDevice(ctx, eng);
  drawWindFlag(ctx, eng);
  drawKeyboard(ctx, eng);
  drawCannon(ctx, eng);

  if (eng.state === STATE.PLAYING) {
    drawAimIndicator(ctx, eng);
    drawChargeRing(ctx, eng);
  }

  drawCapsules(ctx, eng);
  drawProjectiles(ctx, eng);
  drawParticles(ctx, eng);
  drawFloats(ctx, eng);

  drawHUD(ctx, eng);
  drawWindBanner(ctx, eng);
  drawWaveBanner(ctx, eng);

  ctx.restore();

  // game-over overlays (drawn without shake)
  if (eng.state === STATE.GAMEOVER_BOMB) drawBombOverlay(ctx, eng);
  if (eng.state === STATE.GAMEOVER_LIVES) drawLivesOverlay(ctx, eng);
  if (eng.state === STATE.TITLE) drawTitleOverlay(ctx, eng);
}

// ============================================================
// Background
// ============================================================

function drawGrid(ctx, eng) {
  const { W, H } = eng;
  ctx.strokeStyle = C.grid;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x < W; x += 24) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, H);
  }
  for (let y = 0; y < H; y += 24) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(W, y + 0.5);
  }
  ctx.stroke();
}

// ============================================================
// Model device — rectangular frame with internal Cylon-style
// scanner, status dots, blinking power LED, antenna light. No
// smiley face. The animations sell "processing model", not
// "cartoon character".
// ============================================================

function drawModelDevice(ctx, eng) {
  const c = eng.claude;
  const x = c.x - c.w / 2;
  const y = c.y;
  const w = c.w;
  const h = c.h;

  // ground glow
  const grad = ctx.createLinearGradient(0, y + h, 0, y + h + 30);
  grad.addColorStop(0, 'rgba(65, 255, 126, 0.16)');
  grad.addColorStop(1, 'rgba(65, 255, 126, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(x - 40, y + h, w + 80, 30);

  const dead = c.dead;
  const bombDead = dead && eng.state === STATE.GAMEOVER_BOMB;
  const livesDead = dead && eng.state === STATE.GAMEOVER_LIVES;

  // body / frame
  let stroke = C.crt;
  if (c.hitFlashMs > 0) stroke = C.red;
  else if (bombDead) stroke = '#ff5d6c';
  else if (livesDead) stroke = '#f4c062';

  roundRect(ctx, x, y, w, h, 6);
  ctx.fillStyle = bombDead ? '#0a0405' : '#070c10';
  ctx.fill();
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.8;
  ctx.stroke();

  // inset bezel
  ctx.strokeStyle = withAlpha(stroke, 0.35);
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 4.5, y + 4.5, w - 9, h - 9);

  // === antenna with blinking light ===
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(c.x, y);
  ctx.lineTo(c.x, y - 10);
  ctx.stroke();
  if (c.antennaOn && !bombDead) {
    ctx.fillStyle = stroke;
    ctx.fillRect(c.x - 2, y - 14, 4, 4);
    ctx.globalAlpha = 0.4;
    ctx.fillRect(c.x - 4, y - 16, 8, 8);
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = withAlpha(stroke, 0.3);
    ctx.fillRect(c.x - 1.5, y - 13, 3, 3);
  }

  // === inner content ===
  const innerX = x + 12;
  const innerY = y + 12;
  const innerW = w - 24;
  const innerH = h - 24;

  // LLM model label, top-left
  ctx.fillStyle = bombDead ? '#7a3a3a' : stroke;
  ctx.font = '7px "Press Start 2P", monospace';
  ctx.textAlign = 'left';
  ctx.fillText('LLM-3.5', innerX, innerY + 7);

  // power LED, top-right of inner
  const ledOn = c.ledOn && !bombDead && !livesDead;
  ctx.fillStyle = ledOn ? stroke : withAlpha(stroke, 0.2);
  ctx.fillRect(innerX + innerW - 6, innerY + 1, 5, 5);
  if (ledOn) {
    ctx.globalAlpha = 0.5;
    ctx.fillRect(innerX + innerW - 8, innerY - 1, 9, 9);
    ctx.globalAlpha = 1;
  }

  // === scanner line (Cylon visor) ===
  const scannerY = innerY + 22;
  const scannerH = 14;
  // base channel
  ctx.fillStyle = bombDead ? '#1a0a0a' : '#02100a';
  ctx.fillRect(innerX, scannerY, innerW, scannerH);
  ctx.strokeStyle = withAlpha(stroke, 0.45);
  ctx.lineWidth = 1;
  ctx.strokeRect(innerX + 0.5, scannerY + 0.5, innerW - 1, scannerH - 1);

  if (!bombDead && !livesDead) {
    // sweep position — triangle wave 0..1..0
    const t = c.scannerPhase;
    const ping = t < 0.5 ? t * 2 : (1 - t) * 2;
    const cx = innerX + 2 + ping * (innerW - 16);
    // trail (12 px) fading backward
    for (let i = 0; i < 12; i++) {
      const trailX = cx - i * 1.2;
      if (trailX < innerX) break;
      ctx.fillStyle = withAlpha(stroke, 0.6 * (1 - i / 12));
      ctx.fillRect(trailX, scannerY + 3, 1.5, scannerH - 6);
    }
    // bright head
    ctx.fillStyle = stroke;
    ctx.fillRect(cx, scannerY + 2, 12, scannerH - 4);
    // hot pixel
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.7;
    ctx.fillRect(cx + 3, scannerY + 4, 3, scannerH - 8);
    ctx.globalAlpha = 1;
  } else {
    // dead: flat amber line for lives, dark for bomb
    ctx.fillStyle = withAlpha(stroke, 0.55);
    ctx.fillRect(innerX + 4, scannerY + 6, innerW - 8, 2);
  }

  // === status dots ticker ===
  const dotsY = innerY + innerH - 6;
  const dotsX = innerX;
  const phase = Math.floor(c.statusDotPhase * 4); // 0..3
  for (let i = 0; i < 3; i++) {
    const on = !bombDead && !livesDead && i < phase;
    ctx.fillStyle = on ? stroke : withAlpha(stroke, 0.18);
    ctx.fillRect(dotsX + i * 7, dotsY, 4, 4);
  }

  // MODEL label below frame
  ctx.fillStyle = bombDead ? '#7a3a3a' : C.fgDeep;
  ctx.font = '6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(bombDead ? '— OFFLINE —' : 'MODEL', c.x, y + h + 14);
}

// ============================================================
// Wind flag
// ============================================================

function drawWindFlag(ctx, eng) {
  const ax = eng.wind.ax;
  const cx = eng.W / 2;
  const cy = 110;
  const dir = ax === 0 ? 0 : ax > 0 ? 1 : -1;

  // pole
  ctx.strokeStyle = C.fgDeep;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy + 30);
  ctx.stroke();

  // pole top knob
  ctx.fillStyle = C.fgDeep;
  ctx.beginPath();
  ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // pennant
  const magAbs = Math.abs(ax);
  const flapLen = magAbs > 30 ? 26 : magAbs > 10 ? 22 : 18;
  if (dir === 0) {
    // droop
    ctx.fillStyle = C.gold;
    ctx.beginPath();
    ctx.moveTo(cx, cy + 2);
    ctx.lineTo(cx + 2, cy + 16);
    ctx.lineTo(cx - 4, cy + 22);
    ctx.lineTo(cx + 2, cy + 26);
    ctx.lineTo(cx, cy + 14);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(dir, 1);
    ctx.fillStyle = C.gold;
    ctx.beginPath();
    ctx.moveTo(0, 4);
    ctx.lineTo(flapLen, 8);
    ctx.lineTo(flapLen - 4, 12);
    ctx.lineTo(flapLen, 16);
    ctx.lineTo(0, 14);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // small label
  ctx.fillStyle = C.gold;
  ctx.font = '7px "Space Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`WIND ${dir > 0 ? '▸' : dir < 0 ? '◂' : '·'}`, cx + 12, cy - 4);
}

// ============================================================
// Keyboard
// ============================================================

function drawKeyboard(ctx, eng) {
  const k = eng.keyboard;
  const w = k.w;
  const h = k.h;
  const x = k.x - w / 2;
  const y = k.y - h / 2;

  // spawn-burst sparks rising from the keyboard top — drawn FIRST so
  // they sit behind the capsule, which is already at the same x.
  if (k.spawnBurstMs > 0) {
    const t = k.spawnBurstMs / 260; // 1 → 0
    ctx.fillStyle = withAlpha(C.crt, t * 0.85);
    for (let i = 0; i < 4; i++) {
      const off = (i - 1.5) * 4;
      const lift = (1 - t) * 14;
      ctx.fillRect(k.spawnBurstX + off, y - 2 - lift, 2, 2);
    }
  }

  // tilted perspective bezel (subtle 3D)
  ctx.fillStyle = '#050c14';
  ctx.beginPath();
  ctx.moveTo(x + 4, y + h);
  ctx.lineTo(x - 6, y + h + 6);
  ctx.lineTo(x + w + 6, y + h + 6);
  ctx.lineTo(x + w - 4, y + h);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#3a4a5e';
  ctx.lineWidth = 1;
  ctx.stroke();

  // base
  ctx.fillStyle = '#0e1722';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#3a4a5e';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

  // inner bevel highlight on top
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(x + 2, y + 2, w - 4, 1);

  // 3 rows of 13 keys + a spacebar
  const cols = 13;
  const rows = 3;
  const padX = 6;
  const padY = 6;
  const keyGap = 1.5;
  const innerW = w - padX * 2;
  const keyW = (innerW - keyGap * (cols - 1)) / cols;
  const keyH = 8;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const idx = row * cols + col;
      const kx = x + padX + col * (keyW + keyGap);
      const ky = y + padY + row * (keyH + 2);
      const lit = k.keysLit[idx] || 0;
      if (lit > 0) {
        const a = clamp01(lit / 280);
        ctx.fillStyle = withAlpha(C.crt, a);
        ctx.fillRect(kx, ky, keyW, keyH);
        // tiny halo for very fresh keystrokes
        if (a > 0.7) {
          ctx.globalAlpha = a * 0.45;
          ctx.fillRect(kx - 1, ky - 1, keyW + 2, keyH + 2);
          ctx.globalAlpha = 1;
        }
      } else {
        ctx.fillStyle = '#1c2a3a';
        ctx.fillRect(kx, ky, keyW, keyH);
        ctx.fillStyle = 'rgba(255,255,255,0.04)';
        ctx.fillRect(kx, ky, keyW, 1);
      }
    }
  }

  // spacebar — long
  const sbY = y + h - 8;
  ctx.fillStyle = '#1c2a3a';
  ctx.fillRect(x + padX + 12, sbY, innerW - 24, 4);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(x + padX + 12, sbY, innerW - 24, 1);

  // label
  ctx.fillStyle = C.fgDeep;
  ctx.font = '6px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('USER INPUT', k.x, y + h + 18);

  // small "spawn port" marker on top edge so the player visually
  // associates capsules with this device
  ctx.fillStyle = withAlpha(C.crt, 0.45);
  ctx.fillRect(x + w * 0.18, y - 1, 4, 1);
  ctx.fillRect(x + w * 0.50 - 2, y - 1, 4, 1);
  ctx.fillRect(x + w * 0.82 - 4, y - 1, 4, 1);
}

// ============================================================
// Cannon
// ============================================================

function drawCannon(ctx, eng) {
  const cn = eng.cannon;
  const dx = eng.aim.x - cn.x;
  const dy = eng.aim.y - cn.y;
  const angle = Math.atan2(dy, dx);

  // base
  ctx.fillStyle = '#0e1722';
  ctx.fillRect(cn.x - 22, cn.y - 14, 44, 28);
  ctx.strokeStyle = C.crt;
  ctx.lineWidth = 1.4;
  ctx.strokeRect(cn.x - 21.5, cn.y - 13.5, 44, 28);

  // glow pad
  ctx.fillStyle = C.crt;
  ctx.beginPath();
  ctx.arc(cn.x, cn.y - 4, 3, 0, Math.PI * 2);
  ctx.fill();

  // barrel rotated
  ctx.save();
  ctx.translate(cn.x, cn.y - 4);
  ctx.rotate(angle);
  ctx.fillStyle = '#0e1722';
  ctx.fillRect(4, -4, cn.barrelLen, 8);
  ctx.strokeStyle = eng.charge.cooldownLeft > 0 ? C.crtDeep : C.crt;
  ctx.lineWidth = 1.4;
  ctx.strokeRect(4.5, -3.5, cn.barrelLen, 8);
  ctx.restore();

  // label
  ctx.fillStyle = C.fgDeep;
  ctx.font = '5px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CANNON', cn.x, cn.y + 22);
}

function drawAimIndicator(ctx, eng) {
  const cn = eng.cannon;
  const dx = eng.aim.x - cn.x;
  const dy = eng.aim.y - cn.y;
  const dist = Math.hypot(dx, dy) || 1;
  const nx = dx / dist;
  const ny = dy / dist;

  const startX = cn.x + nx * (cn.barrelLen + 4);
  const startY = cn.y - 4 + ny * (cn.barrelLen + 4);
  const endX = startX + nx * CONFIG.ui.aimIndicatorPx;
  const endY = startY + ny * CONFIG.ui.aimIndicatorPx;

  ctx.strokeStyle = withAlpha(C.crt, 0.7);
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 5]);
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = withAlpha(C.crt, 0.8);
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(endX, endY, 3.5, 0, Math.PI * 2);
  ctx.stroke();
}

function drawChargeRing(ctx, eng) {
  if (!eng.charge.held) return;
  if (eng.charge.heldMs < CONFIG.charge.minHoldMs) return;

  const cn = eng.cannon;
  const t = Math.min(1, eng.charge.heldMs / CONFIG.charge.maxHoldMs);
  const segments = CONFIG.ui.chargeRingSegments;
  const cx = cn.x;
  const cy = cn.y - 4;
  const r = 10;

  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * Math.PI * 2 - Math.PI / 2;
    const a1 = ((i + 0.85) / segments) * Math.PI * 2 - Math.PI / 2;
    const filled = (i + 1) / segments <= t + 0.01;
    ctx.strokeStyle = filled ? C.crt : C.crtDeep;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, a0, a1);
    ctx.stroke();
  }
}

// ============================================================
// Capsules
// ============================================================

function drawCapsules(ctx, eng) {
  for (const cap of eng.capsules) drawCapsule(ctx, cap);
}

function drawCapsule(ctx, cap) {
  let bg, fg, border;
  if (cap.cls === 'blue') { bg = C.blueBg; fg = C.blue; border = C.blue; }
  else if (cap.cls === 'red') { bg = C.redBg; fg = C.red; border = C.red; }
  else if (cap.cls === 'black') { bg = C.blackBg; fg = C.black; border = '#3a3340'; }
  else { bg = C.greyBg; fg = '#b5c0cc'; border = '#7c8a9a'; }

  // pill
  const r = cap.h / 2;
  roundRect(ctx, cap.x, cap.y, cap.w, cap.h, r);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  ctx.stroke();

  // text
  ctx.fillStyle = fg;
  ctx.font = '11px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(cap.text, cap.x + cap.w / 2, cap.y + cap.h / 2 + 1);
  ctx.textBaseline = 'alphabetic';
}

// ============================================================
// Projectiles
// ============================================================

function drawProjectiles(ctx, eng) {
  for (const p of eng.projectiles) {
    // trail
    for (let i = 0; i < p.trail.length; i++) {
      const t = p.trail[i];
      const alpha = ((i + 1) / p.trail.length) * 0.45;
      ctx.fillStyle = withAlpha(C.crt, alpha);
      const sz = p.size * ((i + 1) / p.trail.length) * 0.7;
      ctx.fillRect(t.x - sz / 2, t.y - sz / 2, sz, sz);
    }
    // chevron body
    ctx.fillStyle = C.crt;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
}

// ============================================================
// Particles
// ============================================================

function drawParticles(ctx, eng) {
  for (const p of eng.particles) {
    const alpha = clamp01(p.life / p.lifeMax);
    ctx.fillStyle = withAlpha(p.color, alpha);
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  }
}

// ============================================================
// Floating numbers
// ============================================================

function drawFloats(ctx, eng) {
  ctx.font = 'bold 12px "Space Mono", monospace';
  ctx.textAlign = 'center';
  for (const f of eng.floats) {
    const alpha = clamp01(f.lifeMs / f.lifeMaxMs);
    ctx.fillStyle = withAlpha(f.color, alpha);
    ctx.fillText(f.text, f.x, f.y);
  }
}

// ============================================================
// HUD
// ============================================================

function drawHUD(ctx, eng) {
  // hearts top-left
  const heartCount = CONFIG.ui.heartCount;
  const hx = 18;
  const hy = 22;
  for (let i = 0; i < heartCount; i++) {
    const alive = i < eng.lives;
    drawHeart(ctx, hx + i * 22, hy, alive ? C.heart : C.heartDim);
  }

  // score top-right
  ctx.fillStyle = C.crt;
  ctx.font = '16px "Press Start 2P", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(String(eng.score).padStart(3, '0'), eng.W - 18, 28);

  // wave subtitle
  ctx.fillStyle = C.fgDim;
  ctx.font = '8px "Space Mono", monospace';
  ctx.fillText(`WAVE ${eng.wave + 1} · ${eng.spawner.waveName.toUpperCase()}`, eng.W - 18, 44);
}

function drawHeart(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + 8, y + 14);
  ctx.bezierCurveTo(x + 8, y + 11, x + 4, y + 7, x + 4, y + 4);
  ctx.bezierCurveTo(x + 4, y + 1, x + 7, y + 1, x + 8, y + 4);
  ctx.bezierCurveTo(x + 9, y + 1, x + 12, y + 1, x + 12, y + 4);
  ctx.bezierCurveTo(x + 12, y + 7, x + 8, y + 11, x + 8, y + 14);
  ctx.fill();
}

// ============================================================
// Banners
// ============================================================

function drawWindBanner(ctx, eng) {
  if (eng.wind.changeBannerMs <= 0) return;
  const t = eng.wind.changeBannerMs / 1500;
  const alpha = clamp01(t * 1.4);
  ctx.fillStyle = withAlpha(C.gold, alpha);
  ctx.font = '11px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`WIND ▸ ${eng.wind.label}`, eng.W / 2, 160);
}

function drawWaveBanner(ctx, eng) {
  if (eng.spawner.waveMilestoneShownMs <= 0) return;
  const alpha = clamp01(eng.spawner.waveMilestoneShownMs / 1500 * 1.4);
  ctx.fillStyle = withAlpha(C.red, alpha);
  ctx.font = '14px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('RUSH WAVE', eng.W / 2, 200);
}

// ============================================================
// Title screen
// ============================================================

function drawTitleOverlay(ctx, eng) {
  const { W, H } = eng;
  ctx.fillStyle = 'rgba(2, 5, 10, 0.78)';
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = C.crt;
  ctx.font = '28px "Press Start 2P", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PROMPT PATROL', W / 2, H / 2 - 36);

  ctx.fillStyle = C.crtDim;
  ctx.font = '9px "Space Mono", monospace';
  ctx.fillText('AIM ▸ TAP ▸ HOLD TO CHARGE ▸ DON\'T POP BLACK', W / 2, H / 2 - 6);

  // blinking start hint
  if (Math.floor(eng.time * 1.5) % 2 === 0) {
    ctx.fillStyle = C.crt;
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillText('▸ CLICK TO INSERT COIN ◂', W / 2, H / 2 + 32);
  }
}

// ============================================================
// Game over overlays
// ============================================================

function drawLivesOverlay(ctx, eng) {
  ctx.fillStyle = 'rgba(56, 30, 8, 0.55)';
  ctx.fillRect(0, 0, eng.W, eng.H);
}

function drawBombOverlay(ctx, eng) {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.82)';
  ctx.fillRect(0, 0, eng.W, eng.H);
}

// ============================================================
// Helpers
// ============================================================

function roundRect(ctx, x, y, w, h, r) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.lineTo(x + w - rr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + rr);
  ctx.lineTo(x + w, y + h - rr);
  ctx.quadraticCurveTo(x + w, y + h, x + w - rr, y + h);
  ctx.lineTo(x + rr, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - rr);
  ctx.lineTo(x, y + rr);
  ctx.quadraticCurveTo(x, y, x + rr, y);
  ctx.closePath();
}

function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

function withAlpha(hex, a) {
  // assumes hex is #rrggbb or rgba/rgb already
  if (hex.startsWith('#') && hex.length === 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${a})`;
  }
  return hex;
}
