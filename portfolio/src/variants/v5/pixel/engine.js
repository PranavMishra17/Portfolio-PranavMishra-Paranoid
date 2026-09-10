// Variant 5 — a tiny pixel-art engine. A 192×108 grid of palette indices, an id map for hit-testing
// and hover outlines, day and night columns for every colour, and a lamp that lights the room.
export const W = 192;
export const H = 108;

// name: [day, night]. Self-lit things keep their colour at night.
export const PALETTE = {
  wall: ['#ebe1d1', '#4f4657'],
  wall2: ['#e2d6c3', '#493f51'],
  skirt: ['#cdbca1', '#3f3542'],
  floor: ['#b98f60', '#4a3838'],
  floor2: ['#ab8154', '#423033'],
  floor3: ['#8f6a44', '#33262a'],
  rug: ['#8f5b6d', '#4e3344'],
  rug2: ['#c58aa1', '#6a4a60'],
  rug3: ['#5f3a49', '#33222d'],
  wood: ['#8d6140', '#3f2e2a'],
  wood2: ['#b07d50', '#4d3a33'],
  wood3: ['#6b4830', '#2e211f'],
  ink: ['#2a232c', '#17131a'],
  ink2: ['#463c47', '#221c25'],
  white: ['#fbf6ec', '#a39aa4'],
  paper: ['#f1e9db', '#9d948f'],
  grey: ['#9a9199', '#5a5260'],
  grey2: ['#c6bec3', '#7a727f'],
  grey3: ['#6f666f', '#3d3640'],
  screen: ['#182432', '#101a26'],
  screen2: ['#233a52', '#1a2e44'],
  screenlite: ['#79aede', '#79aede'],
  screentext: ['#cfe6f8', '#cfe6f8'],
  screengreen: ['#8fd18a', '#8fd18a'],
  red: ['#c74a3f', '#7d332f'],
  red2: ['#e37a6b', '#94473f'],
  yellow: ['#e7b33c', '#9c7a2c'],
  yellow2: ['#f6d886', '#b39653'],
  green: ['#5f9b5d', '#3a5f3e'],
  green2: ['#95cc88', '#5b8358'],
  blue: ['#3e6f9b', '#274661'],
  blue2: ['#78a6cc', '#4b6c8a'],
  purple: ['#7b5a9b', '#4f3a66'],
  teal: ['#4f9a94', '#33615f'],
  teal2: ['#3b7873', '#274c4a'],
  orange: ['#e28b3d', '#985e2c'],
  pink: ['#dc8fa4', '#8c5a6c'],
  cream: ['#f5e9c9', '#a89d84'],
  skin: ['#c98b5b', '#7f5a3f'],
  hair: ['#1d1a1e', '#141115'],
  hoodie: ['#3a4b6d', '#28344d'],
  hoodie2: ['#2c3a56', '#1e283c'],
  lamp: ['#fff0b8', '#fff0b8'],
  lampoff: ['#e8e0c8', '#8a8478'],
  metal: ['#8d98a4', '#545c68'],
  metal2: ['#bcc6cf', '#77818c'],
  gold: ['#d8a83b', '#8f6f2b'],
  gold2: ['#f2d06c', '#b0954d'],
  led: ['#7fe08a', '#7fe08a'],
  glassline: ['#ffffff', '#c9d2dc'],
};

export const NAMES = Object.keys(PALETTE);
const INDEX = Object.fromEntries(NAMES.map((n, i) => [n, i + 1]));

function hexToRgb(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}
const DAY = [null, ...NAMES.map((n) => hexToRgb(PALETTE[n][0]))];
const NIGHT = [null, ...NAMES.map((n) => hexToRgb(PALETTE[n][1]))];
const SELF_LIT = new Set(['screenlite', 'screentext', 'screengreen', 'lamp', 'led'].map((n) => INDEX[n]));

export function createGrid() {
  return { buf: new Uint8Array(W * H), ids: new Uint8Array(W * H) };
}

/** Drawing helpers bound to a grid. `id` tags every pixel drawn while set (for hover and hit-test). */
export function painter(grid) {
  let id = 0;
  const g = {
    setId(v) {
      id = v;
    },
    px(x, y, c) {
      if (x < 0 || y < 0 || x >= W || y >= H) return;
      const i = y * W + x;
      grid.buf[i] = c === 0 ? 0 : INDEX[c];
      grid.ids[i] = c === 0 ? 0 : id;
    },
    rect(x, y, w, h, c) {
      for (let yy = y; yy < y + h; yy += 1) for (let xx = x; xx < x + w; xx += 1) g.px(xx, yy, c);
    },
    frame(x, y, w, h, c) {
      g.rect(x, y, w, 1, c);
      g.rect(x, y + h - 1, w, 1, c);
      g.rect(x, y, 1, h, c);
      g.rect(x + w - 1, y, 1, h, c);
    },
    hline(x, y, w, c) {
      g.rect(x, y, w, 1, c);
    },
    vline(x, y, h, c) {
      g.rect(x, y, 1, h, c);
    },
    dither(x, y, w, h, a, b) {
      for (let yy = y; yy < y + h; yy += 1) for (let xx = x; xx < x + w; xx += 1) g.px(xx, yy, (xx + yy) % 2 ? a : b);
    },
    // rows of characters; legend maps a char to a colour name; '.' is skipped
    sprite(x, y, rows, legend) {
      for (let r = 0; r < rows.length; r += 1) {
        const row = rows[r];
        for (let c = 0; c < row.length; c += 1) {
          const ch = row[c];
          if (ch === '.' || ch === ' ') continue;
          const name = legend[ch];
          if (name) g.px(x + c, y + r, name);
        }
      }
    },
    clear(x, y, w, h) {
      for (let yy = y; yy < y + h; yy += 1) for (let xx = x; xx < x + w; xx += 1) g.px(xx, yy, 0);
    },
  };
  return g;
}

/**
 * Turns the grid into RGBA. night 0..1 blends day and night columns. lamp {x,y,r,on} adds warm light.
 * hover is an object id: its pixels are lifted and it gets a one-pixel bright outline.
 */
export function rasterize(grid, out, { night = 0, lamp = null, hover = 0 }) {
  const { buf, ids } = grid;
  const d = out.data;
  const n = Math.max(0, Math.min(1, night));
  const lampOn = lamp && lamp.on;
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const i = y * W + x;
      const o = i * 4;
      const idx = buf[i];
      if (idx === 0) {
        // transparent: the sky behind the page shows through here
        d[o] = 0;
        d[o + 1] = 0;
        d[o + 2] = 0;
        d[o + 3] = 0;
        // but an outline can still be drawn around a hovered object into a transparent pixel
        if (hover && isEdge(ids, i, x, y, hover)) {
          d[o] = 240;
          d[o + 1] = 226;
          d[o + 2] = 190;
          d[o + 3] = 150;
        }
        continue;
      }
      const day = DAY[idx];
      const nite = NIGHT[idx];
      let r;
      let gg;
      let b;
      if (SELF_LIT.has(idx) || n === 0) {
        [r, gg, b] = day;
      } else {
        r = day[0] + (nite[0] - day[0]) * n;
        gg = day[1] + (nite[1] - day[1]) * n;
        b = day[2] + (nite[2] - day[2]) * n;
        if (lampOn && n > 0) {
          const dx = x - lamp.x;
          const dy = (y - lamp.y) * 1.15;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let k = 1 - dist / lamp.r;
          if (k > 0) {
            k = k * k * n * 0.95;
            r += (day[0] * 1.06 - r) * k;
            gg += (day[1] * 0.97 - gg) * k;
            b += (day[2] * 0.78 - b) * k;
          }
        }
      }
      if (hover) {
        if (ids[i] === hover) {
          r += (255 - r) * 0.09;
          gg += (255 - gg) * 0.09;
          b += (255 - b) * 0.06;
        } else if (isEdge(ids, i, x, y, hover)) {
          r += (244 - r) * 0.5;
          gg += (230 - gg) * 0.5;
          b += (190 - b) * 0.5;
        }
      }
      d[o] = r > 255 ? 255 : r;
      d[o + 1] = gg > 255 ? 255 : gg;
      d[o + 2] = b > 255 ? 255 : b;
      d[o + 3] = 255;
    }
  }
}

function isEdge(ids, i, x, y, hover) {
  if (ids[i] === hover) return false;
  return (x > 0 && ids[i - 1] === hover) || (x < W - 1 && ids[i + 1] === hover) || (y > 0 && ids[i - W] === hover) || (y < H - 1 && ids[i + W] === hover);
}
