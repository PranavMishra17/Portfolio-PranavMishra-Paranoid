// src/variants/v16/wall.js
//
// A pale plaster surface that is secretly a grid of big squares.
//
// The whole trick is that you must not be able to see the grid while the wall is whole. So at
// rest the squares are painted flush — no strokes, no mortar, only a slow light wash down the
// face and a fraction of a percent of tone variation per square, which reads as plaster rather
// than as tiles. Edges are drawn ONLY once a square has come loose, at which point its own
// silhouette does the work and the grid becomes obvious for the first time.

import Matter from 'matter-js';

const { Engine, Bodies, Body, Composite } = Matter;

function rnd(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Big squares. Deliberately large — this should read as slabs, not rubble. */
export function squareGrid(W, H, size) {
  const cols = Math.ceil(W / size);
  const rows = Math.ceil(H / size);
  const out = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const x = c * size;
      const y = r * size;
      const w = Math.min(size, W - x);
      const h = Math.min(size, H - y);
      if (w < 8 || h < 8) continue;
      out.push({ x, y, w, h, r, c });
    }
  }
  return out;
}

export default class Wall {
  constructor({ W, H, size, palette }) {
    this.W = W;
    this.H = H;
    this.size = size;
    this.pal = palette;
    this.rects = squareGrid(W, H, size);
    const r = rnd(9161);
    // Per-square tone is used ONLY once a square is loose — see draw().
    this.tone = this.rects.map(() => (r() - 0.5) * 0.02);
    // Large soft blooms, placed without reference to the grid, so the whole face reads as
    // one uneven plaster surface and gives nothing away.
    this.blooms = [
      { x: 0.22, y: 0.18, r: 0.62, a: 0.055, up: true },
      { x: 0.78, y: 0.34, r: 0.55, a: 0.040, up: true },
      { x: 0.58, y: 0.82, r: 0.70, a: 0.030, up: false },
      { x: 0.10, y: 0.72, r: 0.48, a: 0.022, up: false },
    ];
    this.state = 'intact'; // intact | falling | gone | building
    this.alpha = 1;
    this.engine = null;
    this.bodies = [];
    this.pending = [];
    this.t0 = 0;
  }

  resize(W, H, size) {
    this.W = W; this.H = H; this.size = size;
    this.rects = squareGrid(W, H, size);
    const r = rnd(9161);
    this.tone = this.rects.map(() => (r() - 0.5) * 0.02);
    if (this.state !== 'intact') this.reset();
  }

  reset() {
    this.state = 'intact';
    this.alpha = 1;
    this.engine = null;
    this.bodies = [];
    this.pending = [];
  }

  _world() {
    this.engine = Engine.create({ enableSleeping: false });
    this.engine.gravity.y = 1.15;
    this.bodies = this.rects.map((rc) => {
      const b = Bodies.rectangle(rc.x + rc.w / 2, rc.y + rc.h / 2, rc.w, rc.h, {
        isStatic: true,
        friction: 0.42,
        frictionAir: 0.012,
        restitution: 0.08,
      });
      b.plugin = { rc };
      return b;
    });
    Composite.add(this.engine.world, this.bodies);
  }

  /** Let go from the blast point outward, so the face comes apart as a wave, not all at once. */
  explode(x, y, now) {
    if (this.state !== 'intact') return false;
    this._world();
    this.state = 'falling';
    this.t0 = now;
    const r = rnd(Math.floor(x * 7 + y * 13) + 1);
    const reach = Math.max(this.W, this.H);

    this.pending = this.bodies
      .map((b) => {
        const dx = b.position.x - x;
        const dy = b.position.y - y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const near = Math.max(0, 1 - d / (this.size * 2.1));
        const mid = Math.max(0, 1 - d / reach);
        const delay = near > 0 ? r() * 70 : (d - this.size * 2.1) * (1.05 + r() * 0.5);
        const kick = near > 0 ? 15 + near * 13 + r() * 5 : 1.4 + mid * 3.6;
        return {
          b,
          at: now + delay,
          vx: (dx / d) * kick + (r() - 0.5) * 2,
          vy: (dy / d) * kick - near * 9 - (1 - near) * r() * 2 + (r() - 0.5) * 1.4,
          va: (r() - 0.5) * (0.16 + near * 0.5 + mid * 0.18),
        };
      })
      .sort((a, c) => a.at - c.at);
    return true;
  }

  step(now) {
    if (this.state === 'intact' || this.state === 'gone') return;

    while (this.pending.length && this.pending[0].at <= now) {
      const p = this.pending.shift();
      Body.setStatic(p.b, false);
      Body.setVelocity(p.b, { x: p.vx, y: p.vy });
      Body.setAngularVelocity(p.b, p.va);
    }

    Engine.update(this.engine, 1000 / 60);

    // Once everything has fallen out of the world, stop drawing entirely.
    const elapsed = now - this.t0;
    if (elapsed > 900) {
      const live = this.bodies.some((b) => b.position.y < this.H + this.size * 2);
      if (!live) { this.state = 'gone'; this.alpha = 0; }
    }
    if (elapsed > 5200) { this.state = 'gone'; this.alpha = 0; }
  }

  draw(ctx) {
    if (this.state === 'gone') {
      // clear once, or the final frame stays painted over the page for good
      if (!this.cleared) { ctx.clearRect(0, 0, this.W, this.H); this.cleared = true; }
      return;
    }
    this.cleared = false;
    const { pal } = this;
    ctx.clearRect(0, 0, this.W, this.H);
    ctx.globalAlpha = this.alpha;

    // the light wash down the face — one soft gradient, the only thing you notice at rest
    const wash = ctx.createLinearGradient(0, 0, 0, this.H);
    wash.addColorStop(0, pal.top);
    wash.addColorStop(0.62, pal.mid);
    wash.addColorStop(1, pal.foot);

    if (this.state === 'intact') {
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, this.W, this.H);
      // Mottling, deliberately NOT aligned to the grid — a few very large, very soft blooms.
      // Per-square tone would betray the squares before they break, which is the one thing
      // this surface must never do.
      for (let i = 0; i < this.blooms.length; i += 1) {
        const b = this.blooms[i];
        const g = ctx.createRadialGradient(
          b.x * this.W, b.y * this.H, 0,
          b.x * this.W, b.y * this.H, b.r * Math.max(this.W, this.H)
        );
        const a = b.up ? 'rgba(255,255,255,' : 'rgba(58,52,42,';
        g.addColorStop(0, `${a}${b.a})`);
        g.addColorStop(1, `${a}0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, this.W, this.H);
      }
      ctx.globalAlpha = 1;
      return;
    }

    // loose: now each square is its own object, and the grid finally shows
    for (let i = 0; i < this.bodies.length; i += 1) {
      const b = this.bodies[i];
      const rc = b.plugin.rc;
      if (b.position.y > this.H + this.size * 2) continue;
      ctx.save();
      ctx.translate(b.position.x, b.position.y);
      ctx.rotate(b.angle);

      const g = ctx.createLinearGradient(0, -rc.h / 2, 0, rc.h / 2);
      const k = rc.y / this.H;
      g.addColorStop(0, k < 0.62 ? pal.top : pal.mid);
      g.addColorStop(1, k < 0.62 ? pal.mid : pal.foot);
      ctx.fillStyle = g;
      ctx.fillRect(-rc.w / 2, -rc.h / 2, rc.w, rc.h);

      const t = this.tone[i] || 0;
      ctx.fillStyle = t > 0 ? `rgba(255,255,255,${t * 4})` : `rgba(40,36,30,${-t * 2.6})`;
      ctx.fillRect(-rc.w / 2, -rc.h / 2, rc.w, rc.h);

      // the edge, drawn only now — this is the moment it stops being a wall and becomes squares
      ctx.strokeStyle = pal.edge;
      ctx.lineWidth = 1;
      ctx.strokeRect(-rc.w / 2 + 0.5, -rc.h / 2 + 0.5, rc.w - 1, rc.h - 1);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
}
