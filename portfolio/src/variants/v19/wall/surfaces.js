// v19 — what the wall is made of.
//
// A surface owns three things and nothing else: how it looks at rest, what the cursor does to
// it, and how it is cut into pieces. How it comes apart lives in Wall.js and is the same for
// both: a burst.
//
// The rule for both of them: plain at rest. A blank canvas, no grid, no pattern you could call
// decoration. Everything only happens under your hand.
//
//   plaster — off-white. Blocks draw themselves in under the cursor.
//   iso     — nothing at all until you move: tiles lift out of the blank wall under the cursor.

const rnd = (seed) => {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

function wash(ctx, W, H, top, mid, low) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(0.6, mid);
  g.addColorStop(1, low);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function speckle(ctx, W, H, seed, alpha, light, dark, size = 1.4, density = 1100) {
  const r = rnd(seed);
  ctx.globalAlpha = alpha;
  for (let i = 0; i < Math.round((W * H) / density); i += 1) {
    ctx.fillStyle = r() < 0.5 ? light : dark;
    ctx.fillRect(r() * W, r() * H, size, size);
  }
  ctx.globalAlpha = 1;
}

function squareGrid(W, H, size) {
  const cols = Math.max(3, Math.round(W / size));
  const rows = Math.max(3, Math.round(H / size));
  const bw = W / cols;
  const bh = H / rows;
  const rects = [];
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) rects.push({ x: c * bw, y: r * bh, w: bw, h: bh, r, c });
  }
  return { rects, bw, bh };
}

/* ── plaster ──────────────────────────────────────────────────────────
   The blocks under the cursor draw themselves in, so you can see the seams the wall will fail
   along without them ever being decoration. */

const plaster = {
  key: 'plaster',
  grid(W, H) {
    return squareGrid(W, H, Math.max(118, Math.min(230, Math.round(Math.min(W, H) / 5.2))));
  },
  paint(ctx, W, H) {
    wash(ctx, W, H, '#f4f3f0', '#eeedea', '#e8e7e3');
    speckle(ctx, W, H, 90210, 0.04, '#ffffff', '#3c3c3a');
  },
  field(ctx, g, px, py, heat) {
    if (px == null) return;
    const reach = Math.min(g.W, g.H) * (0.26 + heat * 0.22);
    ctx.lineWidth = 1;
    for (const rc of g.rects) {
      const d = Math.hypot(rc.x + rc.w / 2 - px, rc.y + rc.h / 2 - py);
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
  },
};

/* ── iso: nothing until you move ──────────────────────────────────────
   A blank wall that turns out to be a tile floor only where your hand is. The tiles lift on
   their side faces; two steps away there is no grid at all. */

const iso = {
  key: 'iso',
  rhombus: true,
  liftFirst: true,
  grid(W, H) {
    const tw = Math.max(120, Math.round(Math.min(W, H) / 4.2));
    const th = tw / 2;
    const rects = [];
    let r = 0;
    for (let y = -th; y < H + th; y += th / 2) {
      const off = r % 2 ? tw / 2 : 0;
      for (let x = -tw + off; x < W + tw; x += tw) rects.push({ x, y, w: tw, h: th, r, c: Math.round(x / tw) });
      r += 1;
    }
    return { rects, bw: tw, bh: th };
  },
  paint(ctx, W, H) {
    wash(ctx, W, H, '#f3f2ef', '#eeede9', '#e7e6e1');
    speckle(ctx, W, H, 5150, 0.035, '#ffffff', '#3c3c3a');
  },
  field(ctx, g, px, py, heat) {
    if (px == null) return;
    const R = Math.min(g.W, g.H) * (0.24 + heat * 0.16);
    for (const rc of g.rects) {
      const cx = rc.x + rc.w / 2;
      const cy = rc.y + rc.h / 2;
      const d = Math.hypot(cx - px, cy - py);
      if (d > R) continue;
      const k = (1 - d / R) ** 1.5;
      iso.drawTile(ctx, rc, k * (10 + heat * 16), Math.min(1, k * 1.9));
    }
  },
  drawTile(ctx, rc, lift, alpha, face, dpr) {
    const { x, y, w, h } = rc;
    const top = y - lift;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = 'rgba(30,30,28,0.15)';
    ctx.beginPath();
    ctx.moveTo(x, top + h / 2); ctx.lineTo(x + w / 2, top + h); ctx.lineTo(x + w / 2, y + h); ctx.lineTo(x, y + h / 2); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(30,30,28,0.25)';
    ctx.beginPath();
    ctx.moveTo(x + w / 2, top + h); ctx.lineTo(x + w, top + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.lineTo(x + w / 2, y + h); ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x + w / 2, top); ctx.lineTo(x + w, top + h / 2); ctx.lineTo(x + w / 2, top + h); ctx.lineTo(x, top + h / 2); ctx.closePath();
    if (face) {
      ctx.save();
      ctx.clip();
      ctx.drawImage(face, x * dpr, y * dpr, w * dpr, h * dpr, x, top, w, h);
      ctx.restore();
    } else {
      ctx.fillStyle = '#f7f6f3';
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(30,30,28,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
  },
};

export const SURFACES = { plaster, iso };
