// v17 — the surface. One sheet of pale plaster painted once to an offscreen canvas and blitted
// whole while it is intact, so there are no seams to see. Underneath it is cut into big squares,
// each a matter-js body carrying its own slice of the texture. When the bomb goes off the squares
// are released in a wave outward from the blast; a square that has not been released yet is still
// drawn as part of the seamless sheet, so the grid only shows at the wave front.
import Matter from 'matter-js';

const { Engine, Bodies, Body, Composite, World } = Matter;

function rnd(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Square size so that an exact number of squares spans the width. */
export function cellSize(W) {
  const target = W < 640 ? W / 3 : W < 1100 ? W / 5 : W / 8;
  const cols = Math.max(2, Math.round(W / target));
  return W / cols;
}

export function squareGrid(W, H, s) {
  const cols = Math.round(W / s);
  const rows = Math.ceil(H / s);
  const out = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      out.push({ x: c * s, y: r * s, w: s, h: s, r, c });
    }
  }
  return out;
}

function grainTile(dpr) {
  const n = 160;
  const t = document.createElement('canvas');
  t.width = n;
  t.height = n;
  const x = t.getContext('2d');
  const img = x.createImageData(n, n);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = 110 + ((Math.random() * 145) | 0);
    d[i] = v;
    d[i + 1] = v;
    d[i + 2] = v;
    d[i + 3] = 255;
  }
  x.putImageData(img, 0, 0);
  return t;
}

/**
 * Paint the sheet. W×H is the viewport (for the composition); TH ≥ H is the texture height so the
 * bottom row of squares is whole. Returns a canvas at device resolution.
 */
export function paintSurface({ W, H, TH, dpr }) {
  const c = document.createElement('canvas');
  c.width = Math.round(W * dpr);
  c.height = Math.round(TH * dpr);
  const ctx = c.getContext('2d');
  ctx.scale(dpr, dpr);

  // the material: a pale stone, lit from above
  const g = ctx.createLinearGradient(0, 0, 0, TH);
  g.addColorStop(0, '#ece9e3');
  g.addColorStop(1, '#dcd8cf');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, TH);

  // large, soft tonal variation — the kind a poured surface has
  const r = rnd(1917);
  for (let i = 0; i < 10; i += 1) {
    const x = r() * W;
    const y = r() * TH;
    const rad = (0.22 + r() * 0.38) * Math.max(W, TH);
    const rg = ctx.createRadialGradient(x, y, 0, x, y, rad);
    if (r() < 0.5) {
      rg.addColorStop(0, 'rgba(90,80,64,0.055)');
    } else {
      rg.addColorStop(0, 'rgba(255,255,255,0.11)');
    }
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, TH);
  }

  // fine grain
  const tile = grainTile(dpr);
  const pat = ctx.createPattern(tile, 'repeat');
  if (pat && pat.setTransform && typeof DOMMatrix !== 'undefined') {
    pat.setTransform(new DOMMatrix().scale(1 / dpr));
  }
  ctx.save();
  ctx.globalAlpha = 0.075;
  ctx.fillStyle = pat;
  ctx.fillRect(0, 0, W, TH);
  ctx.restore();

  // the composition: a horizon, the name on it, two whispers in mono
  const mobile = W < 640;
  const m = Math.max(22, Math.min(64, W * 0.05));
  const yH = Math.round(H * (mobile ? 0.56 : 0.6)) + 0.5;
  ctx.strokeStyle = 'rgba(27,27,25,0.34)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, yH);
  ctx.lineTo(W, yH);
  ctx.stroke();

  const size = Math.max(42, Math.min(132, W * 0.088));
  ctx.fillStyle = '#1b1b19';
  ctx.textBaseline = 'alphabetic';
  ctx.font = `600 ${size}px 'Instrument Sans', system-ui, -apple-system, sans-serif`;
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${-size * 0.035}px`;
  ctx.fillText('Pranav Mishra', m - size * 0.05, yH - size * 0.16);

  const mono = `500 13px 'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace`;
  ctx.font = mono;
  if ('letterSpacing' in ctx) ctx.letterSpacing = '1.6px';
  ctx.fillStyle = '#4f4e49';
  if (mobile) {
    ctx.fillText('FOUNDING LLM ENGINEER', m, m + 12);
    ctx.fillText('ALFRED_ — NEW YORK', m, m + 32);
  } else {
    ctx.fillText('FOUNDING LLM ENGINEER, ALFRED_ — NEW YORK', m, m + 12);
  }
  ctx.fillText('PRESS AND HOLD ANYWHERE', m, yH + 36);
  return c;
}

export default class Surface {
  constructor({ texture, W, H, TH, s, dpr }) {
    this.texture = texture;
    this.W = W;
    this.H = H;
    this.TH = TH;
    this.s = s;
    this.dpr = dpr;
    this.rects = squareGrid(W, H, s);
    this.state = 'intact'; // intact | falling | fading | gone | building
    this.alpha = 1;
    this.engine = null;
    this.bodies = [];
    this.pending = [];
    this.released = new Set();
    this.lastRelease = 0;
    this.acc = 0;
    this.build = null;
  }

  _makeWorld() {
    this.engine = Engine.create({ enableSleeping: false });
    this.engine.gravity.y = 1.5;
    this.bodies = this.rects.map((rc) => {
      const b = Bodies.rectangle(rc.x + rc.w / 2, rc.y + rc.h / 2, rc.w, rc.h, {
        friction: 0.42,
        frictionStatic: 0.5,
        restitution: 0.1,
        density: 0.004,
        chamfer: { radius: 1 },
      });
      Body.setStatic(b, true);
      b.rect = rc;
      return b;
    });
    World.add(this.engine.world, this.bodies);
  }

  /** Go off at a point. Nearby slabs are thrown; the rest let go in a wave outward. */
  explode(x, y, now) {
    if (this.state !== 'intact') return;
    this._makeWorld();
    this.state = 'falling';
    this.released = new Set();
    const s = this.s;
    const r = rnd(Math.floor(x * 7 + y * 13) + 1);
    this.pending = this.bodies
      .map((b) => {
        const dx = b.position.x - x;
        const dy = b.position.y - y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const reach = s * 1.7;
        const near = Math.max(0, 1 - d / reach);
        const delay = near > 0 ? r() * 50 : (d - reach) * 0.95 + r() * 110;
        const kick = near > 0 ? 11 + near * 12 + r() * 4 : 0.5 + r() * 1.2;
        return {
          b,
          at: now + delay,
          blasted: near > 0,
          vx: (dx / d) * kick + (r() - 0.5) * 1.4,
          vy: (dy / d) * kick - near * 6 - (1 - near) * r() * 0.8,
          va: (r() - 0.5) * (0.06 + near * 0.3 + 0.06),
        };
      })
      .sort((a, c) => a.at - c.at);
  }

  /** Put the sheet back: slabs rise from below and settle. */
  rebuild(now) {
    this.state = 'building';
    this.alpha = 1;
    this.engine = null;
    this.bodies = [];
    this.pending = [];
    this.released = new Set();
    const r = rnd(41);
    this.build = {
      t0: now,
      dur: 820,
      from: this.rects.map(() => ({
        dy: this.H * 0.55 + r() * this.H * 0.7,
        dx: (r() - 0.5) * 120,
        a: (r() - 0.5) * 0.5,
        delay: r() * 320,
      })),
    };
  }

  update(now, dt) {
    if (this.state === 'building') {
      if (now - this.build.t0 > this.build.dur + 340) {
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
        p.b.collisionFilter = { category: 2, mask: 0, group: 0 };
        p.b.restoreAt = now + 360;
      }
      this.released.add(p.b);
      this.lastRelease = now;
    }
    this.acc += Math.min(dt, 50);
    let steps = 0;
    while (this.acc >= 16.67 && steps < 3) {
      Engine.update(this.engine, 16.67);
      this.acc -= 16.67;
      steps += 1;
    }
    if (steps === 3) this.acc = 0;
    let left = 0;
    const m = this.s * 2;
    for (const b of this.bodies) {
      if (b.gone) continue;
      if (b.restoreAt && now > b.restoreAt) {
        b.collisionFilter = { category: 1, mask: 0xffffffff, group: 0 };
        b.restoreAt = 0;
      }
      if (b.position.y > this.H + m || b.position.x < -m * 2 || b.position.x > this.W + m * 2) {
        b.gone = true;
        Composite.remove(this.engine.world, b);
      } else left += 1;
    }
    if (this.state === 'falling' && !this.pending.length && (left === 0 || now - this.lastRelease > 4200)) {
      this.state = 'fading';
      this.fadeAt = now;
    }
    if (this.state === 'fading') {
      this.alpha = Math.max(0, 1 - (now - this.fadeAt) / 520);
      if (this.alpha === 0) this.state = 'gone';
    }
  }

  _sheet(ctx) {
    ctx.drawImage(this.texture, 0, 0, this.texture.width, this.texture.height, 0, 0, this.W, this.TH);
  }

  draw(ctx, now) {
    const { state } = this;
    if (state === 'gone') return;
    if (state === 'intact') {
      this._sheet(ctx);
      return;
    }
    if (state === 'building') {
      const { t0, dur, from } = this.build;
      for (let i = 0; i < this.rects.length; i += 1) {
        const rc = this.rects[i];
        const f = from[i];
        const p = Math.min(1, Math.max(0, (now - t0 - f.delay) / dur));
        const e = 1 - Math.pow(1 - p, 3);
        this._piece(ctx, rc, rc.x + rc.w / 2 + f.dx * (1 - e), rc.y + rc.h / 2 + f.dy * (1 - e), f.a * (1 - e));
      }
      return;
    }
    ctx.save();
    ctx.globalAlpha = this.alpha;
    // the sheet, with the released squares cut out of it
    this._sheet(ctx);
    for (const b of this.released) {
      const rc = b.rect;
      ctx.clearRect(rc.x, rc.y, rc.w, rc.h);
    }
    for (const b of this.bodies) {
      if (b.gone || !this.released.has(b)) continue;
      this._piece(ctx, b.rect, b.position.x, b.position.y, b.angle);
    }
    ctx.restore();
  }

  _piece(ctx, rc, cx, cy, angle) {
    const { w, h } = rc;
    const k = this.dpr;
    ctx.save();
    ctx.translate(cx, cy);
    if (angle) ctx.rotate(angle);
    ctx.fillStyle = 'rgba(30,28,24,0.09)';
    ctx.fillRect(-w / 2 + 5, -h / 2 + 7, w, h);
    ctx.drawImage(this.texture, rc.x * k, rc.y * k, rc.w * k, rc.h * k, -w / 2, -h / 2, w, h);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(27,27,25,0.18)';
    ctx.strokeRect(-w / 2 + 0.5, -h / 2 + 0.5, w - 1, h - 1);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 1.5, h / 2 - 1.5);
    ctx.lineTo(-w / 2 + 1.5, -h / 2 + 1.5);
    ctx.lineTo(w / 2 - 1.5, -h / 2 + 1.5);
    ctx.stroke();
    ctx.restore();
  }
}
