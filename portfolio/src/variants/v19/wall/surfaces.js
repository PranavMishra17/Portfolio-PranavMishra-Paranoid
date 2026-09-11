// v19 — what the wall is made of.
//
// A surface owns three things and nothing else: how it looks at rest, what the cursor does to
// it, and how it is cut into pieces. How it comes apart is a separate choice (blasts.js), so
// any material can fail in any way.
//
// The rule for every one of them: plain at rest. A blank canvas, no grid, no pattern you could
// call decoration. Everything only happens under your hand.
//
//   plaster — off-white. Blocks draw themselves in under the cursor.
//   clay    — the same wall in warm putty, and the seams are shadow rather than line.
//   slate   — the same wall in graphite. The seams are light. The landing inverts with it.
//   iso     — nothing at all until you move: tiles lift out of the blank wall under the cursor.
//   film    — photographic paper, grain and a vignette. The cursor is a light leak.
//   frost   — cold glass, fogged. The cursor wipes it clear, and the fog creeps back.

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

/* ── the plaster family ───────────────────────────────────────────────
   One material, three tempers. Same mechanic: the blocks under the cursor draw themselves in,
   so you can see the seams the wall will fail along without them ever being decoration. */

function plasterFamily({ key, dark = false, tones, seam, grainAlpha = 0.04, grainDark = '#3c3c3a', grainLight = '#ffffff', divisor = 5.2 }) {
  return {
    key,
    dark,
    grid(W, H) {
      return squareGrid(W, H, Math.max(118, Math.min(230, Math.round(Math.min(W, H) / divisor))));
    },
    paint(ctx, W, H) {
      wash(ctx, W, H, tones[0], tones[1], tones[2]);
      speckle(ctx, W, H, 90210, grainAlpha, grainLight, grainDark);
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
        ctx.strokeStyle = `rgba(${seam},${(0.05 + k * 0.26 + heat * 0.14 * k).toFixed(3)})`;
        ctx.strokeRect(
          Math.round(rc.x + inset) + 0.5,
          Math.round(rc.y + inset) + 0.5,
          Math.round(rc.w - inset * 2) - 1,
          Math.round(rc.h - inset * 2) - 1
        );
      }
    },
  };
}

const plaster = plasterFamily({
  key: 'plaster',
  tones: ['#f4f3f0', '#eeedea', '#e8e7e3'],
  seam: '30,30,28',
});

const clay = plasterFamily({
  key: 'clay',
  tones: ['#efe8dd', '#e9e0d2', '#e2d7c6'],
  seam: '92,64,38',
  grainAlpha: 0.05,
  grainDark: '#6d5334',
});

const slate = plasterFamily({
  key: 'slate',
  dark: true,
  tones: ['#2b2b30', '#26262b', '#202025'],
  seam: '235,235,238',
  grainAlpha: 0.05,
  grainDark: '#101014',
  grainLight: '#8d8d96',
});

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

/* ── film: paper, grain, and a light leak for a cursor ────────────────
   The only surface with real tooth in it. Pointing at it is a lamp held behind the sheet: the
   paper warms, the grain lifts, and the frame lines of the sheet show for as long as you are
   there. */

const film = {
  key: 'film',
  grid(W, H) {
    return squareGrid(W, H, Math.max(150, Math.round(Math.min(W, H) / 3.4)));
  },
  paint(ctx, W, H) {
    wash(ctx, W, H, '#eeebe4', '#e9e5dd', '#e2ded5');
    // the vignette a lens leaves, and the tooth of the stock
    const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.28, W / 2, H / 2, Math.max(W, H) * 0.78);
    g.addColorStop(0, 'rgba(60,52,40,0)');
    g.addColorStop(1, 'rgba(60,52,40,0.16)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    speckle(ctx, W, H, 2489, 0.13, '#ffffff', '#5d5347', 1.2, 420);
  },
  field(ctx, g, px, py, heat) {
    if (px == null) return;
    const R = Math.min(g.W, g.H) * (0.3 + heat * 0.2);
    const leak = ctx.createRadialGradient(px, py, 0, px, py, R);
    leak.addColorStop(0, `rgba(255,236,196,${0.3 + heat * 0.3})`);
    leak.addColorStop(0.45, `rgba(255,214,158,${0.12 + heat * 0.16})`);
    leak.addColorStop(1, 'rgba(255,200,140,0)');
    ctx.fillStyle = leak;
    ctx.fillRect(px - R, py - R, R * 2, R * 2);
    // the frame lines of the sheet, only where the light falls
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, R, 0, Math.PI * 2);
    ctx.clip();
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(74,60,42,${0.18 + heat * 0.2})`;
    for (const rc of g.rects) ctx.strokeRect(Math.round(rc.x) + 0.5, Math.round(rc.y) + 0.5, Math.round(rc.w) - 1, Math.round(rc.h) - 1);
    ctx.restore();
  },
};

/* ── frost: cold glass, and a hand wiping it ──────────────────────────
   The one surface that remembers where you have been: the fog clears under the cursor and
   closes over again behind you. */

const frost = {
  key: 'frost',
  trail: true,
  grid(W, H) {
    return squareGrid(W, H, Math.max(74, Math.round(Math.min(W, H) / 8)));
  },
  paint(ctx, W, H) {
    wash(ctx, W, H, '#f4f7f8', '#eef2f3', '#e8eeef');
    speckle(ctx, W, H, 8123, 0.3, '#ffffff', '#cfdadd', 1.6, 240);
    speckle(ctx, W, H, 4417, 0.18, '#ffffff', '#c2d0d4', 2.8, 800);
  },
  field(ctx, g, px, py, heat, t, trail) {
    const clear = (x, y, r, a) => {
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, `rgba(122,152,163,${a})`);
      grad.addColorStop(0.62, `rgba(140,168,178,${a * 0.55})`);
      grad.addColorStop(1, 'rgba(160,184,192,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(x - r, y - r, r * 2, r * 2);
    };
    for (const p of trail) {
      const age = (t - p.t0) / 2200;
      if (age > 1) continue;
      clear(p.x, p.y, 34 + heat * 10, (1 - age) ** 1.6 * 0.46);
    }
    if (px != null) {
      clear(px, py, 40 + heat * 26, 0.5 + heat * 0.18);
      ctx.strokeStyle = `rgba(255,255,255,${0.5 + heat * 0.3})`;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(px, py, 40 + heat * 26, 0, Math.PI * 2);
      ctx.stroke();
    }
  },
};

export const SURFACES = { plaster, clay, slate, iso, film, frost };
