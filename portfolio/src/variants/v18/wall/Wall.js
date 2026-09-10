// v18 — the wall.
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

const SURFACE = {
  high: '#f5efe4',
  mid: '#ece5d8',
  low: '#e2dacb',
  rule: 'rgba(38, 30, 22, 0.055)',
  edgeLight: 'rgba(255, 252, 245, 0.62)',
  edgeDark: 'rgba(46, 36, 26, 0.20)',
  side: 'rgba(58, 45, 33, 0.13)',
};

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

    // plaster: a slow wash down the face
    const wash = ctx.createLinearGradient(0, 0, 0, H);
    wash.addColorStop(0, SURFACE.high);
    wash.addColorStop(0.58, SURFACE.mid);
    wash.addColorStop(1, SURFACE.low);
    ctx.fillStyle = wash;
    ctx.fillRect(0, 0, W, H);

    // the spotlight — thrown from above and slightly right, warm, and quite soft. This is the
    // one thing on the wall you are meant to notice before you notice anything else.
    const lx = W * 0.62;
    const ly = -H * 0.16;
    const spot = ctx.createRadialGradient(lx, ly, H * 0.06, lx, ly, H * 1.22);
    spot.addColorStop(0, 'rgba(255, 214, 152, 0.50)');
    spot.addColorStop(0.32, 'rgba(255, 198, 133, 0.20)');
    spot.addColorStop(0.62, 'rgba(232, 158, 96, 0.07)');
    spot.addColorStop(1, 'rgba(210, 132, 74, 0)');
    ctx.fillStyle = spot;
    ctx.fillRect(0, 0, W, H);

    // a cool fall-off in the far corners so the light has somewhere to fall off to
    const cool = ctx.createRadialGradient(W * 0.1, H * 1.05, H * 0.1, W * 0.1, H * 1.05, H * 1.1);
    cool.addColorStop(0, 'rgba(48, 58, 74, 0.11)');
    cool.addColorStop(1, 'rgba(48, 58, 74, 0)');
    ctx.fillStyle = cool;
    ctx.fillRect(0, 0, W, H);

    // uneven plaster — a few very large, very soft blooms, deliberately NOT on the grid, so
    // nothing about the mottling gives the block edges away
    const r = rnd(4242);
    for (let i = 0; i < 5; i += 1) {
      const bx = r() * W;
      const by = r() * H;
      const br = (0.35 + r() * 0.4) * Math.max(W, H);
      const up = r() < 0.5;
      const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      const base = up ? 'rgba(255,255,255,' : 'rgba(60,48,36,';
      g.addColorStop(0, `${base}${0.018 + r() * 0.028})`);
      g.addColorStop(1, `${base}0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

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

    // fine tooth, so it is a surface rather than a gradient
    const grain = rnd(90210);
    ctx.globalAlpha = 0.045;
    for (let i = 0; i < Math.round((W * H) / 900); i += 1) {
      const gx = grain() * W;
      const gy = grain() * H;
      ctx.fillStyle = grain() < 0.5 ? '#ffffff' : '#4a3d30';
      ctx.fillRect(gx, gy, 1.4, 1.4);
    }
    ctx.globalAlpha = 1;
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
      this.engine.gravity.y = 1.25;
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
        // toward the viewer. Delay is almost nothing near the blast and grows with distance.
        b.at = now + (close > 0 ? b.seed * 40 : (d - near) * 0.62 + b.seed * 60);
        b.vz = 1.9 + close * 4.4 + b.seed * 0.8;
        b.vx = ux * (34 + close * 190 + b.seed * 40);
        b.vy = uy * (34 + close * 190 + b.seed * 40) - 40;
        b.va = (b.seed - 0.5) * (0.7 + close * 2.2);
      } else if (this.mode === 'collapse') {
        // a ring of failure travelling outward at a constant speed
        b.at = now + (d / 1.55) + b.seed * 45;
        b.vx = ux * (60 + close * 620 + b.seed * 70);
        b.vy = uy * (60 + close * 520) - (140 + close * 520 + b.seed * 90);
        b.va = (b.seed - 0.5) * (1.6 + close * 4.5);
      } else {
        const body = this.bodies[i];
        b.body = body;
        b.at = now + (close > 0 ? b.seed * 60 : (d - near) * 0.95 + b.seed * 55);
        b.kick = {
          x: ux * (close > 0 ? 14 + close * 15 + r() * 4 : 1.2 + reach * 3.4),
          y: uy * (close > 0 ? 13 + close * 13 : 1.1 + reach * 2.8) - (close * 9 + reach * r() * 2.4),
          a: (r() - 0.5) * (0.18 + close * 0.55),
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
        x: off ? b.cx + (b.seed - 0.5) * this.W : b.x,
        y: off ? this.H + this.bh * 2 : b.y,
        rot: Number.isFinite(b.rot) ? b.rot : 0,
        scale: Number.isFinite(b.scale) ? Math.max(0.05, b.scale) : 1,
        alpha: 1,
      };
      // furthest from the blast left first, so it comes back the way it went
      const d = this.blast ? Math.hypot(b.cx - this.blast.x, b.cy - this.blast.y) : 0;
      b.back = 260 + (1 - d / far) * 340 + b.seed * 90;
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
        const p = Math.min(1, Math.max(0, (t - b.back * 0.28) / 620));
        if (p < 1) done = false;
        const e = easeOutBack(p);
        b.x = b.from.x + (b.cx - b.from.x) * e;
        b.y = b.from.y + (b.cy - b.from.y) * e;
        b.rot = b.from.rot * (1 - easeOutCubic(p));
        b.scale = b.from.scale + (1 - b.from.scale) * easeOutCubic(p);
        b.alpha = Math.min(1, 0.25 + p * 1.4);
      }
      if (done || t > 2400) {
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
        if (b.y < this.H + this.bh * 2.2) visible = true;
      }
      if ((!visible && t > 700) || t > 5200) {
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
        b.scale = 1 + b.z * 0.055;
        b.x += b.vx * s;
        b.y += b.vy * s;
        b.vy += 420 * s;
        b.rot += b.va * s;
        b.alpha = Math.max(0, 1 - b.z / 17);
        if (b.alpha > 0.01 && b.scale < 26) visible = true;
      } else {
        b.vy += 2350 * s;
        b.x += b.vx * s;
        b.y += b.vy * s;
        b.rot += b.va * s;
        if (b.y < this.H + this.bh * 2.4) visible = true;
      }
    }
    if ((!visible && t > 420) || t > 5200) {
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
      if (b.y > H + this.bh * 2.4 && this.state !== 'returning') continue;
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
