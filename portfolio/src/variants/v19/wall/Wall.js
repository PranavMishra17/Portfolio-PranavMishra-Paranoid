// v19 — the wall itself.
//
// The face is painted ONCE into an offscreen canvas by the surface. Every block then blits its
// own region of that canvas, so a block carries exactly the paper it was cut from. The surface
// owns the look and the cursor; the blast owns the failure. Changing either changes the whole
// feel without touching the other.

import { SURFACES } from './surfaces';
import { BLASTS, DEFAULT_BLAST } from './blasts';

const EDGE_LIGHT = 'rgba(255, 255, 253, 0.75)';
const EDGE_DARK = 'rgba(40, 40, 38, 0.18)';
const SIDE = 'rgba(52, 52, 50, 0.11)';

function rnd(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const easeOutCubic = (t) => 1 - (1 - t) ** 3;
const easeOutBack = (t) => 1 + 2.2 * (t - 1) ** 3 + 1.4 * (t - 1) ** 2;

export default class Wall {
  constructor({ W, H, dpr, surface = 'plaster', blast = DEFAULT_BLAST }) {
    this.dpr = dpr;
    this.state = 'intact'; // intact | failing | gone | returning
    this.face = document.createElement('canvas');
    this.surface = SURFACES[surface] || SURFACES.plaster;
    this.blastKind = BLASTS[blast] || BLASTS[DEFAULT_BLAST];
    this.layout(W, H);
  }

  setSurface(key) {
    const next = SURFACES[key];
    if (!next || next === this.surface) return;
    this.surface = next;
    if (this.W) this.layout(this.W, this.H);
  }

  setBlast(key) {
    this.blastKind = BLASTS[key] || BLASTS[DEFAULT_BLAST];
  }

  layout(W, H) {
    this.W = W;
    this.H = H;
    const g = this.surface.grid(W, H);
    this.rects = g.rects;
    this.bw = g.bw;
    this.bh = g.bh;
    this.paintFace();
    this.resetBlocks();
  }

  resize(W, H) {
    const wasIntact = this.state === 'intact';
    this.layout(W, H);
    if (!wasIntact) {
      this.state = 'gone';
      this.alpha = 0;
    }
  }

  resetBlocks() {
    const r = rnd(7717);
    this.blocks = this.rects.map((rc) => ({
      rc,
      cx: rc.x + rc.w / 2,
      cy: rc.y + rc.h / 2,
      x: rc.x + rc.w / 2,
      y: rc.y + rc.h / 2,
      vx: 0, vy: 0, rot: 0, va: 0, z: 0,
      scale: 1, alpha: 1, lift: 0,
      seed: r(),
      at: 0,
      live: false,
    }));
    this.alpha = 1;
    this.t0 = 0;
    this.cleared = false;
  }

  reset() {
    this.state = 'intact';
    this.resetBlocks();
  }

  paintFace() {
    const { W, H, dpr, face } = this;
    face.width = Math.max(1, Math.round(W * dpr));
    face.height = Math.max(1, Math.round(H * dpr));
    const ctx = face.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    this.surface.paint(ctx, W, H, { rects: this.rects, bw: this.bw, bh: this.bh, W, H });
  }

  drawField(ctx, px, py, heat, t, trail) {
    if (this.state !== 'intact') return;
    ctx.save();
    try {
      this.surface.field(ctx, { rects: this.rects, bw: this.bw, bh: this.bh, W: this.W, H: this.H }, px, py, heat, t, trail || []);
    } catch (err) {
      // the field is decoration; one bad frame of it must never stop the wall drawing
    }
    ctx.restore();
  }

  /* ── failure ──────────────────────────────────────────────────────── */

  explode(x, y, now) {
    if (this.state !== 'intact') return false;
    this.state = 'failing';
    this.t0 = now;
    this.blast = { x, y };
    const near = Math.max(this.bw, this.bh) * 1.35;
    const lifts = Boolean(this.surface.liftFirst);
    this.blocks.forEach((b) => {
      const dx = b.cx - x;
      const dy = b.cy - y;
      const d = Math.hypot(dx, dy) || 1;
      b.ux = dx / d;
      b.uy = dy / d;
      const close = Math.max(0, 1 - d / near);
      const k = this.blastKind.kick(b, close, d, near, b.seed);
      b.at = now + k.at;
      b.vx = k.vx;
      b.vy = k.vy;
      b.vz = k.vz || 0;
      b.va = k.va || 0;
      b.shrinkRate = k.shrink || 0;
      b.riseRate = lifts ? 1 : 0;
      b.fadeBy = k.fade || 0;
    });
    return true;
  }

  rebuild(now) {
    if (this.state === 'intact' || this.state === 'returning') return;
    const far = Math.hypot(this.W, this.H);
    this.state = 'returning';
    this.t0 = now;
    this.alpha = 1;
    this.blocks.forEach((b) => {
      const off = !Number.isFinite(b.x) || !Number.isFinite(b.y);
      b.from = {
        x: off ? -this.bw * 2 : b.x,
        y: off ? -this.bh * 2 : b.y,
        rot: Number.isFinite(b.rot) ? b.rot : 0,
        scale: Number.isFinite(b.scale) ? Math.max(0.05, b.scale) : 1,
      };
      const d = this.blast ? Math.hypot(b.cx - this.blast.x, b.cy - this.blast.y) : 0;
      b.back = 150 + (1 - d / far) * 210 + b.seed * 60;
      b.live = true;
    });
  }

  step(now, dt) {
    if (this.state === 'intact' || this.state === 'gone') return;
    const t = now - this.t0;
    const s = Math.min(0.034, dt / 1000);

    if (this.state === 'returning') {
      let done = true;
      for (const b of this.blocks) {
        const p = Math.min(1, Math.max(0, (t - b.back * 0.28) / 460));
        if (p < 1) done = false;
        const e = easeOutBack(p);
        b.x = b.from.x + (b.cx - b.from.x) * e;
        b.y = b.from.y + (b.cy - b.from.y) * e;
        b.rot = b.from.rot * (1 - easeOutCubic(p));
        b.scale = b.from.scale + (1 - b.from.scale) * easeOutCubic(p);
        b.lift = 0;
        b.alpha = Math.min(1, 0.25 + p * 1.4);
      }
      if (done || t > 1700) { this.state = 'intact'; this.resetBlocks(); }
      return;
    }

    const G = this.blastKind.gravity;
    let visible = false;
    for (const b of this.blocks) {
      if (!b.live) {
        if (now < b.at) { visible = true; continue; }
        b.live = true;
      }
      if (b.riseRate && b.lift < 26) {
        // the tile comes up off the floor before it goes anywhere
        b.lift += 160 * s;
        visible = true;
        continue;
      }
      b.z += b.vz * s * 60;
      b.vx += G.x * s;
      b.vy += G.y * s;
      b.x += b.vx * s;
      b.y += b.vy * s;
      b.rot += b.va * s;
      if (b.shrinkRate) b.scale = Math.max(0, b.scale - b.shrinkRate * s);
      else if (b.vz) b.scale = 1 + b.z * 0.062;
      if (b.fadeBy) b.alpha = Math.max(0, 1 - b.z / b.fadeBy);
      const on =
        b.alpha > 0.01 && b.scale > 0.02 && b.scale < 22 &&
        b.y > -this.bh * 2.4 && b.x > -this.bw * 2.4 &&
        b.y < this.H + this.bh * 2.4 && b.x < this.W + this.bw * 2.4;
      if (on) visible = true;
    }
    if ((!visible && t > 200) || t > 2400) { this.state = 'gone'; this.alpha = 0; }
  }

  /* ── drawing ──────────────────────────────────────────────────────── */

  draw(ctx) {
    const { W, H, dpr } = this;
    if (this.state === 'gone') {
      if (!this.cleared) { ctx.clearRect(0, 0, W, H); this.cleared = true; }
      return;
    }
    this.cleared = false;
    ctx.clearRect(0, 0, W, H);

    if (this.state === 'intact') {
      ctx.drawImage(this.face, 0, 0, W, H);
      return;
    }

    for (const b of this.blocks) {
      if (b.alpha <= 0.01 || b.scale <= 0.02) continue;
      const rc = b.rc;
      const out =
        b.y < -this.bh * 2.4 || b.x < -this.bw * 2.4 ||
        b.y > this.H + this.bh * 2.4 || b.x > this.W + this.bw * 2.4;
      if (out && this.state !== 'returning') continue;

      if (this.surface.rhombus) {
        ctx.save();
        ctx.translate(b.x - b.cx, b.y - b.cy);
        this.surface.drawTile(ctx, rc, b.lift, b.alpha, this.face, dpr);
        ctx.restore();
        continue;
      }

      ctx.save();
      ctx.globalAlpha = b.alpha;
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.scale(b.scale, b.scale);
      ctx.drawImage(this.face, rc.x * dpr, rc.y * dpr, rc.w * dpr, rc.h * dpr, -rc.w / 2, -rc.h / 2, rc.w, rc.h);
      const hw = rc.w / 2;
      const hh = rc.h / 2;
      ctx.fillStyle = EDGE_LIGHT;
      ctx.fillRect(-hw, -hh, rc.w, 1.25);
      ctx.fillRect(-hw, -hh, 1.25, rc.h);
      ctx.fillStyle = EDGE_DARK;
      ctx.fillRect(-hw, hh - 1.6, rc.w, 1.6);
      ctx.fillRect(hw - 1.6, -hh, 1.6, rc.h);
      ctx.fillStyle = SIDE;
      ctx.fillRect(hw - 4.5, -hh + 2, 4.5, rc.h - 2);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
}
