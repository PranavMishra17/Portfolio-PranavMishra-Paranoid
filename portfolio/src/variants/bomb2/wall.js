// Bomb — a wall of bricks with real physics. The wall is painted once as a texture (bricks,
// mortar and whatever mural is on it); every brick is a rigid body that carries its patch of that
// texture. Static until the bomb goes off, then released in a wave outward from the blast so the
// collapse spreads the way a wall actually comes down. A rebuild flies the bricks back into place.
import Matter from 'matter-js';

const { Engine, Bodies, Body, Composite, World } = Matter;

/** The brick grid, shared by the painter and the physics so the pieces are bricks. */
export function brickGrid(W, H, bw, bh) {
  const out = [];
  const rows = Math.ceil(H / bh) + 1;
  for (let r = 0; r < rows; r += 1) {
    const y = r * bh;
    const off = 0; // a square grid, no running bond
    const cols = Math.ceil(W / bw) + 2;
    for (let c = 0; c < cols; c += 1) {
      const x = c * bw + off;
      const x0 = Math.max(0, x);
      const x1 = Math.min(W, x + bw);
      const y1 = Math.min(H, y + bh);
      if (x1 - x0 < 6 || y1 - y < 6) continue;
      out.push({ x: x0, y, w: x1 - x0, h: y1 - y, r, c });
    }
  }
  return out;
}

function rnd(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export default class Wall {
  constructor({ texture, W, H, bw, bh }) {
    this.texture = texture;
    this.W = W;
    this.H = H;
    this.bw = bw;
    this.bh = bh;
    this.rects = brickGrid(W, H, bw, bh);
    this.state = 'intact'; // intact | falling | fading | gone | building
    this.alpha = 1;
    this.engine = null;
    this.bodies = [];
    this.pending = [];
    this.lastRelease = 0;
    this.t0 = 0;
    this.build = null;
  }

  _makeWorld() {
    this.engine = Engine.create({ enableSleeping: false });
    this.engine.gravity.y = 1.35;
    const world = this.engine.world;
    // no floor: the bottom of the screen is the edge of the world, and bricks tumble out of it
    this.bodies = this.rects.map((rc) => {
      // built dynamic and then frozen, so matter keeps the real mass to give back when it is released
      const b = Bodies.rectangle(rc.x + rc.w / 2, rc.y + rc.h / 2, rc.w, rc.h, {
        friction: 0.5,
        frictionStatic: 0.6,
        restitution: 0.22,
        density: 0.004,
        chamfer: { radius: 1.5 },
      });
      Body.setStatic(b, true);
      b.rect = rc;
      return b;
    });
    World.add(world, this.bodies);
  }

  /** Light the wall up from a point. Bricks near it fly; the rest come down in a spreading wave. */
  explode(x, y, now) {
    if (this.state !== 'intact') return;
    this._makeWorld();
    this.state = 'falling';
    this.t0 = now;
    const r = rnd(Math.floor(x * 7 + y * 13));
    this.pending = this.bodies
      .map((b) => {
        const dx = b.position.x - x;
        const dy = b.position.y - y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const near = Math.max(0, 1 - d / 210);
        const mid = Math.max(0, 1 - d / 700);
        const delay = near > 0 ? r() * 60 : (d - 210) * (1.15 + r() * 0.55);
        const kick = near > 0 ? 16 + near * 14 + r() * 6 : 1.5 + mid * 4;
        return {
          b,
          at: now + delay,
          blasted: near > 0,
          vx: (dx / d) * kick + (r() - 0.5) * 2.2,
          vy: (dy / d) * kick - near * 10 - (1 - near) * r() * 2 + (r() - 0.5) * 1.5,
          va: (r() - 0.5) * (0.2 + near * 0.6 + mid * 0.2),
        };
      })
      .sort((a, c) => a.at - c.at);
  }

  /** Put the wall back: bricks fly in from below and settle in place. */
  rebuild(now) {
    this.state = 'building';
    this.alpha = 1;
    this.engine = null;
    this.bodies = [];
    const r = rnd(99);
    this.build = {
      t0: now,
      dur: 780,
      from: this.rects.map(() => ({ dy: this.H * 0.5 + r() * this.H * 0.6, dx: (r() - 0.5) * 220, a: (r() - 0.5) * 1.6, delay: r() * 260 })),
    };
  }

  update(now, dt) {
    if (this.state === 'building') {
      if (now - this.build.t0 > this.build.dur + 280) {
        this.state = 'intact';
        this.build = null;
      }
      return;
    }
    if (this.state !== 'falling' && this.state !== 'fading') return;
    while (this.pending.length && this.pending[0].at <= now) {
      const p = this.pending.shift();
      Body.setStatic(p.b, false);
      Body.setVelocity(p.b, { x: p.vx, y: p.vy });
      Body.setAngularVelocity(p.b, p.va);
      if (p.blasted) {
        // blasted bricks pass straight through their neighbours for a moment, which is what makes the hole
        p.b.collisionFilter = { category: 2, mask: 0, group: 0 };
        p.b.restoreAt = now + 380;
      }
      this.lastRelease = now;
    }
    // fixed steps, at most three a frame, so a slow frame never launches a brick
    this.acc = (this.acc || 0) + Math.min(dt, 50);
    let steps = 0;
    while (this.acc >= 16.67 && steps < 3) {
      Engine.update(this.engine, 16.67);
      this.acc -= 16.67;
      steps += 1;
    }
    if (steps === 3) this.acc = 0;
    // drop bricks that have left the world; give blasted ones their collisions back
    let left = 0;
    for (const b of this.bodies) {
      if (b.gone) continue;
      if (b.restoreAt && now > b.restoreAt) {
        b.collisionFilter = { category: 1, mask: 0xffffffff, group: 0 };
        b.restoreAt = 0;
      }
      const m = this.bh * 3;
      if (b.position.y > this.H + m || b.position.x < -m * 2 || b.position.x > this.W + m * 2) {
        b.gone = true;
        Composite.remove(this.engine.world, b);
      } else left += 1;
    }
    if (this.state === 'falling' && !this.pending.length && (left === 0 || now - this.lastRelease > 3800)) {
      this.state = 'fading';
      this.fadeAt = now;
    }
    if (this.state === 'fading') {
      this.alpha = Math.max(0, 1 - (now - this.fadeAt) / 450);
      if (this.alpha === 0) this.state = 'gone';
    }
  }

  draw(ctx, now) {
    const { texture, state } = this;
    if (state === 'gone') return;
    if (state === 'intact') {
      ctx.drawImage(texture, 0, 0);
      return;
    }
    if (state === 'building') {
      const { t0, dur, from } = this.build;
      for (let i = 0; i < this.rects.length; i += 1) {
        const rc = this.rects[i];
        const f = from[i];
        const p = Math.min(1, Math.max(0, (now - t0 - f.delay) / dur));
        const e = 1 - Math.pow(1 - p, 3);
        const cx = rc.x + rc.w / 2 + f.dx * (1 - e);
        const cy = rc.y + rc.h / 2 + f.dy * (1 - e);
        this._brick(ctx, rc, cx, cy, f.a * (1 - e));
      }
      return;
    }
    ctx.save();
    ctx.globalAlpha = this.alpha;
    for (const b of this.bodies) {
      if (b.gone) continue;
      this._brick(ctx, b.rect, b.position.x, b.position.y, b.angle);
    }
    ctx.restore();
  }

  _brick(ctx, rc, cx, cy, angle) {
    ctx.save();
    ctx.translate(cx, cy);
    if (angle) ctx.rotate(angle);
    ctx.drawImage(this.texture, rc.x, rc.y, rc.w, rc.h, -rc.w / 2, -rc.h / 2, rc.w, rc.h);
    ctx.strokeStyle = 'rgba(4,6,10,0.55)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-rc.w / 2 + 0.5, -rc.h / 2 + 0.5, rc.w - 1, rc.h - 1);
    ctx.restore();
  }
}
