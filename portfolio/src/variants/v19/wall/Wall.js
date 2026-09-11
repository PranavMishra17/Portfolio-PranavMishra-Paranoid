// v19 — the wall.
//
// One layer, and only one. It is plaster with a warm spotlight thrown across it from above and,
// if you want it, the faintest rule where the big blocks meet — the graph-paper hint, at block
// scale rather than graph scale. Nothing about it says "tiles" until it fails.
//
// The face is painted ONCE into an offscreen canvas. Every block then blits its own region of
// that canvas, so a block carries exactly the plaster, the light and the rule it had while it
// was part of the wall. That is the whole reason this looks like a wall coming apart rather
// than a grid of coloured rectangles falling over.
//
// Three ways for it to fail, chosen in the Lab:
//   shatter  — matter-js. Real collisions; blocks knock each other aside.
//   collapse — a ring of failure travels outward, gravity takes each block as it is reached.
//   burst    — the face comes at you: blocks accelerate toward the viewer and past the frame.

import Matter from 'matter-js';

const { Engine, Bodies, Body, Composite } = Matter;

// Off-white, and only off-white. No spotlight, no warm corner, no cool corner — he asked for
// the wall to stop being an atmosphere and start being a wall.
const SURFACE = {
  high: '#f4f3f0',
  mid: '#eeedea',
  low: '#e8e7e3',
  rule: 'rgba(30, 30, 28, 0.07)',
  ruleLive: 'rgba(30, 30, 28, 0.30)',
  edgeLight: 'rgba(255, 255, 253, 0.75)',
  edgeDark: 'rgba(40, 40, 38, 0.18)',
  side: 'rgba(52, 52, 50, 0.11)',
};

// Blocks leave up and to the left, toward the corner the "put it back" control lives in.
const GRAVITY = { x: -640, y: -1180 };

function rnd(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const easeOutCubic = (t) => 1 - (1 - t) ** 3;
const easeOutBack = (t) => 1 + 2.2 * (t - 1) ** 3 + 1.4 * (t - 1) ** 2;

export function blockGrid(W, H, size) {
  // Whole blocks only, sized so the wall divides evenly — a half block at the edge reads as a
  // mistake the moment the wall breaks.
  const cols = Math.max(3, Math.round(W / size));
  const rows = Math.max(3, Math.round(H / size));
  const bw = W / cols;
  const bh = H / rows;
  const out = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      out.push({ x: c * bw, y: r * bh, w: bw, h: bh, r, c });
    }
  }
  return { rects: out, bw, bh, cols, rows };
}

export default class Wall {
  constructor({ W, H, dpr, mode = 'shatter', grid = 'faint' }) {
    this.mode = mode;
    this.grid = grid;
    this.dpr = dpr;
    this.state = 'intact'; // intact | failing | gone | returning
    this.face = document.createElement('canvas');
    this.layout(W, H);
  }

  layout(W, H) {
    this.W = W;
    this.H = H;
    const size = Math.max(118, Math.min(230, Math.round(Math.min(W, H) / 5.2)));
    const g = blockGrid(W, H, size);
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
      // mid-collapse resizes cannot be reconciled honestly; land the final state instead
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
      vx: 0,
      vy: 0,
      rot: 0,
      va: 0,
      scale: 1,
      alpha: 1,
      seed: r(),
      at: 0,
      live: false,
    }));
    this.alpha = 1;
    this.engine = null;
    this.bodies = null;
    this.t0 = 0;
    this.cleared = false;
  }

  reset() {
    this.state = 'intact';
    this.resetBlocks();
  }

  /* ── the surface, painted once ────────────────────────────────────── */

  paintFace() {
    const { W, H, dpr, face } = this;
    face.width = Math.max(1, Math.round(W * dpr));
    face.height = Math.max(1, Math.round(H * dpr));
    const ctx = face.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    // one very slow wash, top to bottom, entirely neutral
    const wash = ctx.createLinearGradient(0, 0, 0, H);
    wash.addColorStop(0, SURFACE.high);
    wash.addColorStop(0.6, SURFACE.mid);
    wash.addColorStop(1, SURFACE.low);
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, W, H);

    // the block rule, if it is wanted: one hairline where the wall will fail, nothing more
    if (this.grid === 'faint') {
      ctx.strokeStyle = SURFACE.rule;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = this.bw; x < W - 0.5; x += this.bw) {
        ctx.moveTo(Math.round(x) + 0.5, 0);
        ctx.lineTo(Math.round(x) + 0.5, H);
      }
      for (let y = this.bh; y < H - 0.5; y += this.bh) {
        ctx.moveTo(0, Math.round(y) + 0.5);
        ctx.lineTo(W, Math.round(y) + 0.5);
      }
      ctx.stroke();
    }

    // fine tooth, in grey only, so it is a surface rather than a gradient
    const grain = rnd(90210);
    ctx.globalAlpha = 0.04;
    for (let i = 0; i < Math.round((W * H) / 1100); i += 1) {
      const gx = grain() * W;
      const gy = grain() * H;
      ctx.fillStyle = grain() < 0.5 ? '#ffffff' : '#3c3c3a';
      ctx.fillRect(gx, gy, 1.4, 1.4);
    }
    ctx.globalAlpha = 1;
  }

  /**
   * The field under the cursor. Blocks near the pointer draw themselves in, so the wall
   * tightens where the dynamite is and you can see the seams it is going to fail along.
   * Drawn live over the face — never baked in, so moving the pointer costs one pass over
   * the handful of blocks actually inside the radius.
   */
  drawField(ctx, px, py, heat) {
    if (px == null || this.state !== 'intact') return;
    const reach = Math.min(this.W, this.H) * (0.26 + heat * 0.22);
    ctx.save();
    ctx.lineWidth = 1;
    for (const rc of this.rects) {
      const cx = rc.x + rc.w / 2;
      const cy = rc.y + rc.h / 2;
      const d = Math.hypot(cx - px, cy - py);
      if (d > reach) continue;
      const k = (1 - d / reach) ** 1.7;
      const inset = k * (3 + heat * 7);
      ctx.strokeStyle = `rgba(30,30,28,${(0.05 + k * 0.26 + heat * 0.14 * k).toFixed(3)})`;
      ctx.strokeRect(
        Math.round(rc.x + inset) + 0.5,
        Math.round(rc.y + inset) + 0.5,
        Math.round(rc.w - inset * 2) - 1,
        Math.round(rc.h - inset * 2) - 1
      );
    }
    ctx.restore();
  }

  /* ── failure ──────────────────────────────────────────────────────── */

  explode(x, y, now) {
    if (this.state !== 'intact') return false;
    this.state = 'failing';
    this.t0 = now;
    this.blast = { x, y };
    const r = rnd(Math.round(x * 13 + y * 7) + 3);
    const near = Math.max(this.bw, this.bh) * 1.35;

    if (this.mode === 'shatter') {
      this.engine = Engine.create({ enableSleeping: false });
      // reversed: everything is pulled up and to the left, out past the corner
      this.engine.gravity.x = -0.62;
      this.engine.gravity.y = -1.15;
      // NOTE: created dynamic, then frozen. Building them with isStatic:true in the options
      // gives infinite mass, and releasing one then produces NaN positions.
      this.bodies = this.blocks.map((b) => {
        const body = Bodies.rectangle(b.cx, b.cy, b.rc.w, b.rc.h, {
          friction: 0.38,
          frictionAir: 0.008,
          restitution: 0.12,
        });
        Body.setStatic(body, true);
        body.plugin = { block: b };
        return body;
      });
      Composite.add(this.engine.world, this.bodies);
    }

    this.blocks.forEach((b, i) => {
      const dx = b.cx - x;
      const dy = b.cy - y;
      const d = Math.hypot(dx, dy) || 1;
      const ux = dx / d;
      const uy = dy / d;
      const close = Math.max(0, 1 - d / near);
      const reach = Math.max(0, 1 - d / Math.hypot(this.W, this.H));
      b.close = close;
      b.ux = ux;
      b.uy = uy;

      if (this.mode === 'burst') {
        // toward the viewer, and carried off to the top left. Delay is almost nothing near
        // the blast and grows with distance — but the whole thing is over inside a second.
        b.at = now + (close > 0 ? b.seed * 26 : (d - near) * 0.34 + b.seed * 34);
        b.vz = 3.2 + close * 6.4 + b.seed * 1.1;
        b.vx = ux * (60 + close * 290 + b.seed * 60) - 130;
        b.vy = uy * (60 + close * 290 + b.seed * 60) - 190;
        b.va = (b.seed - 0.5) * (1.1 + close * 3);
      } else if (this.mode === 'collapse') {
        // a ring of failure travelling outward, everything drawn up and to the left
        b.at = now + (d / 2.6) + b.seed * 26;
        b.vx = ux * (90 + close * 700 + b.seed * 90) - 210;
        b.vy = uy * (90 + close * 620) - (260 + close * 620 + b.seed * 110);
        b.va = (b.seed - 0.5) * (2 + close * 5.5);
      } else {
        const body = this.bodies[i];
        b.body = body;
        b.at = now + (close > 0 ? b.seed * 34 : (d - near) * 0.5 + b.seed * 34);
        b.kick = {
          x: ux * (close > 0 ? 17 + close * 19 + r() * 5 : 1.6 + reach * 4.2) - 5,
          y: uy * (close > 0 ? 16 + close * 17 : 1.4 + reach * 3.4) - (close * 12 + reach * r() * 3 + 6),
          a: (r() - 0.5) * (0.22 + close * 0.7),
        };
      }
    });
    return true;
  }

  /** Put it back. Whatever a block's transform is right now, it flies home from there. */
  rebuild(now) {
    if (this.state === 'intact' || this.state === 'returning') return;
    if (this.mode === 'shatter' && this.bodies) {
      this.blocks.forEach((b) => {
        if (b.body) {
          b.x = b.body.position.x;
          b.y = b.body.position.y;
          b.rot = b.body.angle;
        }
      });
      this.engine = null;
      this.bodies = null;
    }
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
        alpha: 1,
      };
      // furthest from the blast left first, so it comes back the way it went
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
        b.alpha = Math.min(1, 0.25 + p * 1.4);
      }
      if (done || t > 1700) {
        this.state = 'intact';
        this.resetBlocks();
      }
      return;
    }

    if (this.mode === 'shatter') {
      for (const b of this.blocks) {
        if (!b.live && now >= b.at && b.body) {
          b.live = true;
          Body.setStatic(b.body, false);
          Body.setVelocity(b.body, b.kick);
          Body.setAngularVelocity(b.body, b.kick.a);
        }
      }
      Engine.update(this.engine, 1000 / 60);
      let visible = false;
      for (const b of this.blocks) {
        if (!b.body) continue;
        b.x = b.body.position.x;
        b.y = b.body.position.y;
        b.rot = b.body.angle;
        if (b.y > -this.bh * 2.2 && b.x > -this.bw * 2.2) visible = true;
      }
      if ((!visible && t > 320) || t > 2400) {
        this.state = 'gone';
        this.alpha = 0;
      }
      return;
    }

    let visible = false;
    for (const b of this.blocks) {
      if (!b.live) {
        if (now < b.at) {
          visible = true;
          continue;
        }
        b.live = true;
      }
      if (this.mode === 'burst') {
        b.z = (b.z || 0) + b.vz * s * 60;
        b.scale = 1 + b.z * 0.062;
        b.vx += GRAVITY.x * s;
        b.vy += GRAVITY.y * s;
        b.x += b.vx * s;
        b.y += b.vy * s;
        b.rot += b.va * s;
        b.alpha = Math.max(0, 1 - b.z / 11);
        if (b.alpha > 0.01 && b.scale < 22) visible = true;
      } else {
        b.vx += GRAVITY.x * 1.9 * s;
        b.vy += GRAVITY.y * 1.9 * s;
        b.x += b.vx * s;
        b.y += b.vy * s;
        b.rot += b.va * s;
        if (b.y > -this.bh * 2.4 && b.x > -this.bw * 2.4) visible = true;
      }
    }
    if ((!visible && t > 200) || t > 2400) {
      this.state = 'gone';
      this.alpha = 0;
    }
  }

  /* ── drawing ──────────────────────────────────────────────────────── */

  draw(ctx) {
    const { W, H } = this;
    if (this.state === 'gone') {
      if (!this.cleared) {
        ctx.clearRect(0, 0, W, H);
        this.cleared = true;
      }
      return;
    }
    this.cleared = false;
    ctx.clearRect(0, 0, W, H);

    if (this.state === 'intact') {
      ctx.drawImage(this.face, 0, 0, W, H);
      return;
    }

    const { dpr } = this;
    for (const b of this.blocks) {
      if (b.alpha <= 0.01) continue;
      const rc = b.rc;
      if ((b.y < -this.bh * 2.4 || b.x < -this.bw * 2.4) && this.state !== 'returning') continue;
      ctx.save();
      ctx.globalAlpha = b.alpha;
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.scale(b.scale, b.scale);
      ctx.drawImage(
        this.face,
        rc.x * dpr, rc.y * dpr, rc.w * dpr, rc.h * dpr,
        -rc.w / 2, -rc.h / 2, rc.w, rc.h
      );
      // the block only gets edges once it is a block: a lit top-left, a shaded bottom-right,
      // and a sliver of the depth it turns out to have had
      const hw = rc.w / 2;
      const hh = rc.h / 2;
      ctx.fillStyle = SURFACE.edgeLight;
      ctx.fillRect(-hw, -hh, rc.w, 1.25);
      ctx.fillRect(-hw, -hh, 1.25, rc.h);
      ctx.fillStyle = SURFACE.edgeDark;
      ctx.fillRect(-hw, hh - 1.6, rc.w, 1.6);
      ctx.fillRect(hw - 1.6, -hh, 1.6, rc.h);
      ctx.fillStyle = SURFACE.side;
      ctx.fillRect(hw - 4.5, -hh + 2, 4.5, rc.h - 2);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }
}
