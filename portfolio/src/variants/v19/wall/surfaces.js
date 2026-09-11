// v19 — five surfaces for the first screen. Not five layouts: five different materials, each
// with its own way of showing the cursor and its own way of coming apart.
//
//   plaster — off-white, hidden blocks; the blocks under the dynamite draw themselves in;
//             it bursts toward you and leaves up and to the left.
//   graph   — real graph paper, blue-grey ink; the cursor is a lens that bends the lines;
//             the sheet tears into large leaves that flip over as they go.
//   dots    — a halftone field; the dots under the cursor swell and back away from it;
//             the surface dissolves — each block shrinks to nothing as it drifts off.
//   iso     — an isometric tile floor; tiles under the cursor rise on their side faces;
//             on the blast they are pulled off the floor, one after another.
//   ink     — no grid at all; the cursor leaves ink that spreads and fades on the paper;
//             the blast opens a ragged iris and the page is simply there behind it.

const INK = '30,30,28';

function rnd(seed) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function wash(ctx, W, H, top, mid, low) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, top);
  g.addColorStop(0.6, mid);
  g.addColorStop(1, low);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
}

function grain(ctx, W, H, seed, alpha, dark) {
  const r = rnd(seed);
  ctx.globalAlpha = alpha;
  for (let i = 0; i < Math.round((W * H) / 1100); i += 1) {
    ctx.fillStyle = r() < 0.5 ? '#ffffff' : dark;
    ctx.fillRect(r() * W, r() * H, 1.4, 1.4);
  }
  ctx.globalAlpha = 1;
}

function squareGrid(W, H, size) {
  const cols = Math.max(3, Math.round(W / size));
  const rows = Math.max(3, Math.round(H / size));
  const bw = W / cols;
  const bh = H / rows;
  const rects = [];
  for (let r = 0; r < rows; r += 1) for (let c = 0; c < cols; c += 1) rects.push({ x: c * bw, y: r * bh, w: bw, h: bh, r, c });
  return { rects, bw, bh };
}

/* ─────────────────────────── plaster ─────────────────────────── */

const plaster = {
  key: 'plaster',
  gravity: { x: -640, y: -1180 },
  grid(W, H) {
    return squareGrid(W, H, Math.max(118, Math.min(230, Math.round(Math.min(W, H) / 5.2))));
  },
  paint(ctx, W, H, g, hint) {
    wash(ctx, W, H, '#f4f3f0', '#eeedea', '#e8e7e3');
    if (hint) {
      ctx.strokeStyle = `rgba(${INK},0.07)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = g.bw; x < W - 0.5; x += g.bw) { ctx.moveTo(Math.round(x) + 0.5, 0); ctx.lineTo(Math.round(x) + 0.5, H); }
      for (let y = g.bh; y < H - 0.5; y += g.bh) { ctx.moveTo(0, Math.round(y) + 0.5); ctx.lineTo(W, Math.round(y) + 0.5); }
      ctx.stroke();
    }
    grain(ctx, W, H, 90210, 0.04, '#3c3c3a');
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
      ctx.strokeStyle = `rgba(${INK},${(0.05 + k * 0.26 + heat * 0.14 * k).toFixed(3)})`;
      ctx.strokeRect(Math.round(rc.x + inset) + 0.5, Math.round(rc.y + inset) + 0.5, Math.round(rc.w - inset * 2) - 1, Math.round(rc.h - inset * 2) - 1);
    }
  },
  kick(b, close, d, near, seed) {
    return {
      at: close > 0 ? seed * 26 : (d - near) * 0.34 + seed * 34,
      vz: 3.2 + close * 6.4 + seed * 1.1,
      vx: b.ux * (60 + close * 290 + seed * 60) - 130,
      vy: b.uy * (60 + close * 290 + seed * 60) - 190,
      va: (seed - 0.5) * (1.1 + close * 3),
      fade: 11,
    };
  },
};

/* ─────────────────────────── graph ─────────────────────────── */

const graph = {
  key: 'graph',
  gravity: { x: -420, y: -900 },
  grid(W, H) {
    return squareGrid(W, H, Math.max(160, Math.round(Math.min(W, H) / 3.6)));
  },
  paint(ctx, W, H) {
    wash(ctx, W, H, '#f7f7f4', '#f3f3ef', '#eeeee9');
    // minor every 12, major every 60 — the proportions of real graph paper
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 12) { ctx.moveTo(Math.round(x) + 0.5, 0); ctx.lineTo(Math.round(x) + 0.5, H); }
    for (let y = 0; y <= H; y += 12) { ctx.moveTo(0, Math.round(y) + 0.5); ctx.lineTo(W, Math.round(y) + 0.5); }
    ctx.strokeStyle = 'rgba(80,110,150,0.16)';
    ctx.stroke();
    ctx.beginPath();
    for (let x = 0; x <= W; x += 60) { ctx.moveTo(Math.round(x) + 0.5, 0); ctx.lineTo(Math.round(x) + 0.5, H); }
    for (let y = 0; y <= H; y += 60) { ctx.moveTo(0, Math.round(y) + 0.5); ctx.lineTo(W, Math.round(y) + 0.5); }
    ctx.strokeStyle = 'rgba(80,110,150,0.34)';
    ctx.stroke();
  },
  // a lens: every minor line inside the radius is redrawn bent away from the cursor
  field(ctx, g, px, py, heat) {
    if (px == null) return;
    const R = 150 + heat * 90;
    const bend = 16 + heat * 22;
    // paint over the straight lines inside the lens with the paper colour, then redraw bent
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, R, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#f5f5f1';
    ctx.fillRect(px - R, py - R, R * 2, R * 2);
    const warp = (x, y) => {
      const dx = x - px;
      const dy = y - py;
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.max(0, 1 - d / R);
      const m = k * k * bend;
      return [x + (dx / d) * m, y + (dy / d) * m];
    };
    const draw = (major) => {
      const step = major ? 60 : 12;
      ctx.beginPath();
      const x0 = Math.floor((px - R) / step) * step;
      const y0 = Math.floor((py - R) / step) * step;
      for (let x = x0; x <= px + R; x += step) {
        for (let y = py - R; y <= py + R; y += 6) {
          const [wx, wy] = warp(x + 0.5, y);
          if (y === py - R) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
        }
      }
      for (let y = y0; y <= py + R; y += step) {
        for (let x = px - R; x <= px + R; x += 6) {
          const [wx, wy] = warp(x, y + 0.5);
          if (x === px - R) ctx.moveTo(wx, wy); else ctx.lineTo(wx, wy);
        }
      }
      ctx.strokeStyle = major ? 'rgba(80,110,150,0.42)' : 'rgba(80,110,150,0.2)';
      ctx.lineWidth = 1;
      ctx.stroke();
    };
    draw(false);
    draw(true);
    ctx.restore();
    // the rim of the lens
    ctx.beginPath();
    ctx.arc(px, py, R, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(80,110,150,${0.18 + heat * 0.2})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  },
  kick(b, close, d, near, seed) {
    // a slow tear: leaves come away in order from the blast, and they flip
    return {
      at: close > 0 ? seed * 60 : (d - near) * 0.6 + seed * 80,
      vz: 0,
      vx: b.ux * (40 + close * 120) - 160 - seed * 60,
      vy: b.uy * (40 + close * 120) - 120 - seed * 60,
      va: 0,
      flip: 2.2 + seed * 2.4 + close * 2,
      fade: 0,
    };
  },
};

/* ─────────────────────────── dots ─────────────────────────── */

const DOT = 14;
const dots = {
  key: 'dots',
  gravity: { x: -300, y: -520 },
  grid(W, H) {
    return squareGrid(W, H, Math.max(110, Math.round(Math.min(W, H) / 5.5)));
  },
  paint(ctx, W, H) {
    wash(ctx, W, H, '#f5f4f1', '#f0efec', '#eae9e5');
    ctx.fillStyle = `rgba(${INK},0.26)`;
    for (let y = DOT / 2; y < H; y += DOT) {
      for (let x = DOT / 2; x < W; x += DOT) {
        ctx.beginPath();
        ctx.arc(x, y, 1.15, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
  // dots inside the radius swell and back away from the cursor
  field(ctx, g, px, py, heat) {
    if (px == null) return;
    const R = 130 + heat * 80;
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, R, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = '#f2f1ee';
    ctx.fillRect(px - R, py - R, R * 2, R * 2);
    const x0 = Math.floor((px - R) / DOT) * DOT + DOT / 2;
    const y0 = Math.floor((py - R) / DOT) * DOT + DOT / 2;
    ctx.fillStyle = `rgba(${INK},${0.3 + heat * 0.25})`;
    for (let y = y0; y <= py + R; y += DOT) {
      for (let x = x0; x <= px + R; x += DOT) {
        const dx = x - px;
        const dy = y - py;
        const d = Math.hypot(dx, dy) || 1;
        const k = Math.max(0, 1 - d / R);
        const push = k * k * (10 + heat * 8);
        ctx.beginPath();
        ctx.arc(x + (dx / d) * push, y + (dy / d) * push, 1.15 + k * (3.2 + heat * 2), 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();
  },
  kick(b, close, d, near, seed) {
    return {
      at: close > 0 ? seed * 30 : (d - near) * 0.42 + seed * 60,
      vz: 0,
      vx: b.ux * (30 + close * 90) - 90 - seed * 40,
      vy: b.uy * (30 + close * 90) - 70 - seed * 40,
      va: (seed - 0.5) * 0.9,
      shrink: 1.2 + close * 1.4 + seed * 0.6,
      fade: 0,
    };
  },
};

/* ─────────────────────────── iso ─────────────────────────── */

const iso = {
  key: 'iso',
  gravity: { x: -380, y: -760 },
  rhombus: true,
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
  paint(ctx, W, H, g) {
    wash(ctx, W, H, '#f3f2ef', '#eeede9', '#e7e6e1');
    ctx.lineWidth = 1;
    for (const rc of g.rects) {
      ctx.beginPath();
      ctx.moveTo(rc.x + rc.w / 2, rc.y);
      ctx.lineTo(rc.x + rc.w, rc.y + rc.h / 2);
      ctx.lineTo(rc.x + rc.w / 2, rc.y + rc.h);
      ctx.lineTo(rc.x, rc.y + rc.h / 2);
      ctx.closePath();
      ctx.fillStyle = (rc.r + rc.c) % 2 ? 'rgba(255,255,255,0.28)' : 'rgba(30,30,28,0.025)';
      ctx.fill();
      ctx.strokeStyle = `rgba(${INK},0.09)`;
      ctx.stroke();
    }
  },
  // tiles near the cursor rise, and show the side they rise on
  field(ctx, g, px, py, heat) {
    if (px == null) return;
    const R = Math.min(g.W, g.H) * (0.24 + heat * 0.16);
    for (const rc of g.rects) {
      const cx = rc.x + rc.w / 2;
      const cy = rc.y + rc.h / 2;
      const d = Math.hypot(cx - px, cy - py);
      if (d > R) continue;
      const k = (1 - d / R) ** 1.5;
      const lift = k * (10 + heat * 16);
      iso.drawTile(ctx, rc, lift, 1);
    }
  },
  drawTile(ctx, rc, lift, alpha, face, dpr) {
    const { x, y, w, h } = rc;
    const top = y - lift;
    // side faces first, then the top
    ctx.globalAlpha = alpha;
    ctx.fillStyle = `rgba(${INK},0.16)`;
    ctx.beginPath();
    ctx.moveTo(x, top + h / 2); ctx.lineTo(x + w / 2, top + h); ctx.lineTo(x + w / 2, y + h); ctx.lineTo(x, y + h / 2); ctx.closePath();
    ctx.fill();
    ctx.fillStyle = `rgba(${INK},0.26)`;
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
      ctx.fillStyle = '#f6f5f2';
      ctx.fill();
    }
    ctx.strokeStyle = `rgba(${INK},0.22)`;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.globalAlpha = 1;
  },
  kick(b, close, d, near, seed) {
    return {
      at: close > 0 ? seed * 40 : (d - near) * 0.5 + seed * 70,
      vz: 0,
      vx: b.ux * (30 + close * 80) - 110 - seed * 50,
      vy: -(120 + close * 260 + seed * 80),
      va: 0,
      rise: 1,
      fade: 0,
    };
  },
};

/* ─────────────────────────── ink ─────────────────────────── */

const ink = {
  key: 'ink',
  wipe: true,
  grid(W, H) {
    return { rects: [], bw: W, bh: H };
  },
  paint(ctx, W, H) {
    wash(ctx, W, H, '#f6f5f2', '#f1f0ec', '#ebeae5');
    // a few very large, very pale blooms — ink that dried a long time ago
    const r = rnd(1337);
    for (let i = 0; i < 4; i += 1) {
      const bx = r() * W;
      const by = r() * H;
      const br = (0.3 + r() * 0.5) * Math.max(W, H);
      const g = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      g.addColorStop(0, `rgba(${INK},${0.03 + r() * 0.03})`);
      g.addColorStop(1, `rgba(${INK},0)`);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }
    grain(ctx, W, H, 4711, 0.05, '#2a2a28');
  },
  // the trail: wet ink that spreads and fades where the cursor has been
  field(ctx, g, px, py, heat, t, trail) {
    for (const p of trail) {
      const age = (t - p.t0) / 1500;
      if (age > 1) continue;
      const r = 14 + age * 90 + heat * 20;
      const a = (1 - age) ** 2 * (0.14 + heat * 0.12);
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      grad.addColorStop(0, `rgba(${INK},${a})`);
      grad.addColorStop(0.55, `rgba(${INK},${a * 0.45})`);
      grad.addColorStop(1, `rgba(${INK},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2);
    }
    if (px != null) {
      const r = 22 + heat * 30;
      const grad = ctx.createRadialGradient(px, py, 0, px, py, r);
      grad.addColorStop(0, `rgba(${INK},${0.22 + heat * 0.3})`);
      grad.addColorStop(1, `rgba(${INK},0)`);
      ctx.fillStyle = grad;
      ctx.fillRect(px - r, py - r, r * 2, r * 2);
    }
  },
};

export const SURFACES = { plaster, graph, dots, iso, ink };
