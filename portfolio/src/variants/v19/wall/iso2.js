// v19 — iso2: the isometric wall, pre-cut.
//
// Same idea as `iso` in surfaces.js: a blank plaster wall that turns out to be a tile floor
// only where your hand is, and whose tiles rise and are thrown when the wall fails. The
// difference is how it is drawn.
//
//   iso   cuts every tile out of the face on every frame: a path clip plus a drawImage per
//         tile, for every tile, at 60 fps. On a 2x display that is ~200 masked blits a frame
//         and the blast alone costs the whole frame budget. Its edges also sit on quarter
//         pixels (th = 128.5, row step 64.25), so the 1px outlines shimmer as tiles lift.
//
//   iso2  cuts each tile ONCE, at layout time, into a sprite atlas (one slot per row, since
//         every tile in a row carries the same band of the face), and blits that. A tile at
//         rest is one drawImage; a lifted tile is one drawImage plus two flat quads for its
//         sides. No clip, no shadow, no stroke per frame. The grid is integer-aligned (tw is
//         a multiple of 4) and lifts are rounded, so nothing sits on a half pixel. The field
//         pass only visits the rows the cursor can reach instead of every rect.
//
// Interface is the one Wall.js consumes: key, rhombus, liftFirst, grid, paint, field,
// drawTile. drawTile accepts an optional seventh argument, the block itself, and uses its
// rotation and scale so the tiles come at you the way plaster blocks do; without it the
// tiles just slide, exactly as `iso` does.

const LIFT_MAX = 26; // Wall.step stops raising a tile at 26px; the skirt never needs more
const PAD = 1; // sprite bleed so the outline stroke is not cut at the vertices

const SIDE_L = 'rgba(30,30,28,0.15)';
const SIDE_R = 'rgba(30,30,28,0.25)';
const OUTLINE = 'rgba(30,30,28,0.2)';
const LIGHT = 'rgba(255,255,253,0.55)';

// layout cache keyed by the rects array Wall keeps; each rect also carries a back-reference
const LAYOUTS = new WeakMap();

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

function rhombusPath(ctx, x, y, w, h) {
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y);
  ctx.lineTo(x + w, y + h / 2);
  ctx.lineTo(x + w / 2, y + h);
  ctx.lineTo(x, y + h / 2);
  ctx.closePath();
}

// the two visible side faces of a tile raised `lift` above its footprint at (x, y)
function skirt(ctx, x, y, w, h, lift) {
  const top = y - lift;
  const hw = w / 2;
  const hh = h / 2;
  ctx.fillStyle = SIDE_L;
  ctx.beginPath();
  ctx.moveTo(x, top + hh); ctx.lineTo(x + hw, top + h); ctx.lineTo(x + hw, y + h); ctx.lineTo(x, y + hh); ctx.closePath();
  ctx.fill();
  ctx.fillStyle = SIDE_R;
  ctx.beginPath();
  ctx.moveTo(x + hw, top + h); ctx.lineTo(x + w, top + hh); ctx.lineTo(x + w, y + hh); ctx.lineTo(x + hw, y + h); ctx.closePath();
  ctx.fill();
}

// one blit of the pre-cut tile: sprite slot `slot`, footprint (x, y), raised `lift`
function blitTile(ctx, L, slot, x, y, lift) {
  const { atlas, dpr, tw, th, slotW, slotH } = L;
  // a face painted while the canvas was 0x0 leaves an empty atlas; drawing from it throws
  if (!atlas || !atlas.width || !atlas.height) return;
  ctx.drawImage(
    atlas,
    0, slot * slotH * dpr, slotW * dpr, slotH * dpr,
    x - PAD, y - lift - PAD, tw + 2 * PAD, th + 2 * PAD
  );
}

// build the atlas from the freshly painted face: one rhombus per row, outline baked in
function buildAtlas(faceCtx, W, H, L) {
  const dpr = (faceCtx.canvas.width / W) || 1;
  const { tw, th, rows } = L;
  const slotW = tw + 2 * PAD;
  const slotH = th + 2 * PAD;

  const atlas = document.createElement('canvas');
  atlas.width = Math.max(1, Math.ceil(slotW * dpr));
  atlas.height = Math.max(1, Math.ceil(slotH * dpr * rows.length));
  const a = atlas.getContext('2d');
  a.clearRect(0, 0, atlas.width, atlas.height);
  rows.forEach((row, i) => {
    // cut from a tile fully inside the face so the sprite is never blank at the edges
    const src = row.find((rc) => rc.x >= 0 && rc.x + tw <= W) || row[Math.floor(row.length / 2)];
    a.setTransform(dpr, 0, 0, dpr, 0, i * slotH * dpr);
    a.save();
    rhombusPath(a, PAD, PAD, tw, th);
    a.clip();
    a.drawImage(faceCtx.canvas, src.x * dpr, src.y * dpr, tw * dpr, th * dpr, PAD, PAD, tw, th);
    a.restore();
    rhombusPath(a, PAD, PAD, tw, th);
    a.strokeStyle = OUTLINE;
    a.lineWidth = 1;
    a.stroke();
  });

  // the light a raised tile catches: one sprite, drawn over the tile at the lift strength
  const light = document.createElement('canvas');
  light.width = Math.ceil(slotW * dpr);
  light.height = Math.ceil(slotH * dpr);
  const l = light.getContext('2d');
  l.setTransform(dpr, 0, 0, dpr, 0, 0);
  rhombusPath(l, PAD, PAD, tw, th);
  l.fillStyle = LIGHT;
  l.fill();

  L.atlas = atlas;
  L.light = light;
  L.dpr = dpr;
  L.slotW = slotW;
  L.slotH = slotH;
}

const iso2 = {
  key: 'iso2',
  rhombus: true,
  liftFirst: true,

  grid(W, H) {
    // tw a multiple of 4 so tw/2, th and th/2 are all integers: every edge on a whole pixel
    const tw = Math.max(160, Math.min(280, Math.round(Math.min(W, H) / 4 / 4) * 4));
    const th = tw / 2;
    const hs = tw / 2;
    const vs = th / 2;
    const rects = [];
    const rows = [];
    let r = 0;
    for (let y = -th; y < H + th; y += vs) {
      const off = r % 2 ? hs : 0;
      const row = [];
      let c = 0;
      for (let x = -tw + off; x < W + tw; x += tw) {
        const rc = { x, y, w: tw, h: th, r, c, cx: x + hs, cy: y + vs };
        rects.push(rc);
        row.push(rc);
        c += 1;
      }
      rows.push(row);
      r += 1;
    }
    const L = { tw, th, hs, vs, rows, W, H, atlas: null, light: null, dpr: 1, slotW: tw, slotH: th };
    rects.forEach((rc) => { rc.L = L; });
    LAYOUTS.set(rects, L);
    return { rects, bw: tw, bh: th };
  },

  paint(ctx, W, H, g) {
    wash(ctx, W, H, '#f3f2ef', '#eeede9', '#e7e6e1');
    speckle(ctx, W, H, 6021, 0.035, '#ffffff', '#3c3c3a');
    const L = g && g.rects ? LAYOUTS.get(g.rects) : null;
    if (L) buildAtlas(ctx, W, H, L);
  },

  field(ctx, g, px, py, heat) {
    if (px == null) return;
    const L = LAYOUTS.get(g.rects);
    if (!L || !L.atlas) return;
    const { rows, th, vs, dpr, slotW, slotH } = L;
    const R = Math.min(g.W, g.H) * (0.24 + heat * 0.16);
    const liftMax = 10 + heat * 16;

    // only the rows whose centres can be within reach; row r has centre y = -th + r*vs + vs
    const r0 = Math.max(0, Math.floor((py - R + th - vs) / vs));
    const r1 = Math.min(rows.length - 1, Math.ceil((py + R + th - vs) / vs));

    for (let r = r0; r <= r1; r += 1) {
      const row = rows[r];
      for (let i = 0; i < row.length; i += 1) {
        const rc = row[i];
        const dx = rc.cx - px;
        if (dx > R || dx < -R) continue;
        const d = Math.hypot(dx, rc.cy - py);
        if (d > R) continue;
        const k = (1 - d / R) ** 1.5;
        const lift = Math.round(k * liftMax);
        const a = Math.min(1, k * 1.9);
        ctx.globalAlpha = a;
        if (lift > 0) skirt(ctx, rc.x, rc.y, rc.w, rc.h, lift);
        blitTile(ctx, L, r, rc.x, rc.y, lift);
        if (k > 0.03) {
          ctx.globalAlpha = a * k;
          ctx.drawImage(L.light, 0, 0, slotW * dpr, slotH * dpr, rc.x - PAD, rc.y - lift - PAD, rc.w + 2 * PAD, rc.h + 2 * PAD);
        }
      }
    }
    ctx.globalAlpha = 1;
  },

  // Wall.draw wraps this in save/translate/restore; `b` (the block) is optional
  drawTile(ctx, rc, lift, alpha, face, dpr, b) {
    const L = rc.L;
    const { x, y, w, h } = rc;
    const l = Math.min(LIFT_MAX, Math.round(lift || 0));
    ctx.globalAlpha = alpha;

    if (b && (b.rot || (b.scale && b.scale !== 1))) {
      ctx.translate(rc.cx, rc.cy);
      ctx.rotate(b.rot || 0);
      ctx.scale(b.scale, b.scale);
      ctx.translate(-rc.cx, -rc.cy);
    }

    if (l > 0) skirt(ctx, x, y, w, h, l);

    if (L && L.atlas) {
      blitTile(ctx, L, rc.r, x, y, l);
    } else {
      // never happens once paint has run; kept so a tile is still a tile
      rhombusPath(ctx, x, y - l, w, h);
      ctx.fillStyle = '#f4f3f0';
      ctx.fill();
      ctx.strokeStyle = OUTLINE;
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  },
};

export default iso2;
