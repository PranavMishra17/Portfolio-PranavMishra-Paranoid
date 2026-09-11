// v19 — the room's pixel engine, at 288×152.
//
// The old room ran at 192×108 and his complaint was fair: at that size a book is three pixels
// and a poster is a coloured rectangle. Half again in each direction is 2.25× the pixels, which
// is the difference between "a shelf" and "books on a shelf", while still unmistakably pixel art.
//
// The buffer is palette indices, not colour, with a parallel id map so hit-testing and hover
// outlines are exact and free. Every colour carries a day value and a night value; lights blend
// back toward day locally, so turning the lamp on genuinely lights the corner it stands in.

export const W = 288;
// The room proper is 152 tall. Above it is a roof band: ceiling and the top of the wall, so
// that when the canvas covers a wide viewport and crops the top, what goes is wall and not
// the posters. Everything in scene.js is drawn in room coordinates; the painter adds ROOF.
export const ROOM_H = 152;
export const ROOF = 26;
export const H = ROOM_H + ROOF;
// The canvas covers the viewport, so a wide window crops the top and a narrow one crops the
// sides. Everything that matters is inside this box; outside it is wall, floor and curtain.
export const SAFE = { top: 20, side: 16 };

// name: [day, night]. Anything self-lit keeps its colour after dark.
export const PALETTE = {
  wall: ['#efeeea', '#5a5468'],
  wallLit: ['#f4f3f0', '#655f74'],
  wallDim: ['#e4e2dc', '#4e4860'],
  skirt: ['#c9b69c', '#3b3546'],
  cornice: ['#f4f3f0', '#655f74'],
  floor: ['#b78d5f', '#463640'],
  floor2: ['#a97f53', '#3e2f39'],
  floorDark: ['#8c6743', '#2f2430'],
  rug: ['#a2604b', '#4a3040'],
  rug2: ['#d9a173', '#6a4d55'],
  rug3: ['#6d3a2c', '#31212a'],
  rug4: ['#f0dcbb', '#7a6a66'],
  wood: ['#8b6040', '#3b2c33'],
  wood2: ['#ac7b50', '#4a3840'],
  wood3: ['#6a4830', '#2c2028'],
  woodTop: ['#c08f5f', '#54404a'],
  ink: ['#2b2430', '#181420'],
  ink2: ['#463c4a', '#221d2c'],
  white: ['#fbf6ec', '#a096a8'],
  paper: ['#f0e8da', '#9a9096'],
  grey: ['#9a919c', '#585062'],
  grey2: ['#c5bdc6', '#786f82'],
  grey3: ['#6e6572', '#3c3542'],
  metal: ['#8c97a6', '#525a6a'],
  metal2: ['#bbc5d1', '#757e8e'],
  metal3: ['#5f6976', '#373d49'],
  screen: ['#16222f', '#0e1824'],
  screen2: ['#22374f', '#182b42'],
  screenLit: ['#7bb0e0', '#7bb0e0'],
  screenTxt: ['#d2e8fa', '#d2e8fa'],
  screenGrn: ['#91d38c', '#91d38c'],
  screenWarm: ['#e8c07a', '#e8c07a'],
  red: ['#c34a3f', '#7a332f'],
  red2: ['#e07a6b', '#91473f'],
  red3: ['#8e3229', '#57231f'],
  orange: ['#e08b3d', '#96602c'],
  orange2: ['#f4b169', '#a97a44'],
  yellow: ['#e6b33c', '#9a7a2c'],
  yellow2: ['#f6d886', '#b19653'],
  green: ['#5f9b5d', '#3a5f3e'],
  green2: ['#93cc86', '#598358'],
  green3: ['#3d6b41', '#27442d'],
  blue: ['#3d6f9c', '#274661'],
  blue2: ['#77a6cd', '#4a6c8b'],
  blue3: ['#28486a', '#1a2f45'],
  purple: ['#7a5a9c', '#4e3a67'],
  purple2: ['#a486c4', '#6a5680'],
  teal: ['#4e9a95', '#32615f'],
  pink: ['#db8fa5', '#8b5a6d'],
  cream: ['#f4e8c8', '#a79c85'],
  sand: ['#d9b483', '#7a6558'],
  skin: ['#c98b5b', '#7d5940'],
  skin2: ['#a86e45', '#6a4a35'],
  hair: ['#1d1a1e', '#141116'],
  shirt: ['#3a4b6d', '#28344e'],
  shirt2: ['#2b3a56', '#1d283d'],
  denim: ['#41506b', '#2a3448'],
  lampOn: ['#fff2c0', '#fff2c0'],
  lampOff: ['#e6dec6', '#8a8478'],
  bulb: ['#ffe9a8', '#ffe9a8'],
  bulbOff: ['#cfc7b4', '#6e6a62'],
  gold: ['#d6a63a', '#8d6d2b'],
  gold2: ['#f2d06c', '#ae934d'],
  led: ['#7fe08a', '#7fe08a'],
  ledRed: ['#ff6a5a', '#ff6a5a'],
  glass: ['#cfe2ef', '#3d4a63'],
  sky1: ['#bcd8ec', '#1d2a45'],
  sky2: ['#e7cfae', '#28324e'],
  sky3: ['#f2b57a', '#333a58'],
  sun: ['#ffd98a', '#e8e6ff'],
  hill: ['#7d8f7a', '#25304a'],
  hill2: ['#5e7060', '#1d2740'],
  fridge: ['#dfe3e6', '#666a7c'],
  fridge2: ['#c9ced3', '#575b6c'],
  leaf: ['#5c9557', '#375c3e'],
  leaf2: ['#7bb872', '#48734c'],
  pot: ['#b9714a', '#5d3d3c'],
  ball: ['#f6f2e8', '#9a94a0'],
  ballDark: ['#2b2430', '#181420'],
  boot: ['#2f3a4a', '#1e2632'],
  bootSole: ['#d9d2c4', '#7a7480'],
  cable: ['#3a3440', '#231f2b'],
  poster1: ['#e0a53c', '#8c6a34'],
  poster2: ['#b8352a', '#722a26'],
  poster3: ['#c98a4b', '#7c5a38'],
};

export const NAMES = Object.keys(PALETTE);
const INDEX = {};
NAMES.forEach((n, i) => {
  INDEX[n] = i + 1;
});

function hexToRgb(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}
const DAY = [null].concat(NAMES.map((n) => hexToRgb(PALETTE[n][0])));
const NIGHT = [null].concat(NAMES.map((n) => hexToRgb(PALETTE[n][1])));
const SELF_LIT = new Set(
  ['screenLit', 'screenTxt', 'screenGrn', 'screenWarm', 'lampOn', 'bulb', 'led', 'ledRed', 'sun'].map((n) => INDEX[n])
);

export function createGrid() {
  return { buf: new Uint8Array(W * H), ids: new Uint8Array(W * H) };
}

/** Drawing helpers bound to a grid. Everything drawn while an id is set is tagged with it. */
export function painter(grid, oy = 0) {
  let id = 0;
  const g = {
    setId(v) {
      id = v || 0;
    },
    px(x, y, c) {
      x |= 0;
      y = (y | 0) + oy;
      if (x < 0 || y < 0 || x >= W || y >= H) return;
      const i = y * W + x;
      if (c === 0 || c === null || c === undefined) {
        grid.buf[i] = 0;
        grid.ids[i] = 0;
        return;
      }
      const idx = INDEX[c];
      if (!idx) return;
      grid.buf[i] = idx;
      grid.ids[i] = id;
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
    /** A filled circle, which at this resolution is what makes balls and lamps read. */
    disc(cx, cy, r, c) {
      const rr = r * r;
      for (let yy = -r; yy <= r; yy += 1) {
        for (let xx = -r; xx <= r; xx += 1) {
          if (xx * xx + yy * yy <= rr) g.px(cx + xx, cy + yy, c);
        }
      }
    },
    ring(cx, cy, r, c) {
      const outer = r * r;
      const inner = (r - 1) * (r - 1);
      for (let yy = -r; yy <= r; yy += 1) {
        for (let xx = -r; xx <= r; xx += 1) {
          const d = xx * xx + yy * yy;
          if (d <= outer && d > inner) g.px(cx + xx, cy + yy, c);
        }
      }
    },
    line(x0, y0, x1, y1, c) {
      let dx = Math.abs(x1 - x0);
      let dy = -Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx + dy;
      let x = x0;
      let y = y0;
      for (let guard = 0; guard < 4000; guard += 1) {
        g.px(x, y, c);
        if (x === x1 && y === y1) break;
        const e2 = 2 * err;
        if (e2 >= dy) {
          err += dy;
          x += sx;
        }
        if (e2 <= dx) {
          err += dx;
          y += sy;
        }
      }
    },
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

function isEdge(ids, i, x, y, hover) {
  if (ids[i] === hover) return false;
  return (
    (x > 0 && ids[i - 1] === hover) ||
    (x < W - 1 && ids[i + 1] === hover) ||
    (y > 0 && ids[i - W] === hover) ||
    (y < H - 1 && ids[i + W] === hover)
  );
}

/**
 * Grid → RGBA.
 *   night 0..1  blends every colour toward its night value
 *   lights      [{x, y, r, on, warm}] pull a neighbourhood back toward daylight
 *   hover       an object id: lifted a little, and outlined by one pixel
 */
// Five tones of the page's own paper and ink, for the monochrome look.
const MONO = [
  [244, 243, 240],
  [214, 212, 206],
  [163, 161, 155],
  [104, 103, 99],
  [38, 38, 36],
];

export function rasterize(grid, out, { night = 0, lights = [], hover = 0, mono = false }) {
  const { buf, ids } = grid;
  const d = out.data;
  const n = Math.max(0, Math.min(1, night));
  const live = lights.filter((l) => l && l.on && l.r > 0);

  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const i = y * W + x;
      const o = i * 4;
      const idx = buf[i];

      if (idx === 0) {
        d[o] = 0;
        d[o + 1] = 0;
        d[o + 2] = 0;
        d[o + 3] = 0;
        if (hover && isEdge(ids, i, x, y, hover)) {
          d[o] = 255;
          d[o + 1] = 232;
          d[o + 2] = 178;
          d[o + 3] = 170;
        }
        continue;
      }

      const day = DAY[idx];
      let r;
      let gg;
      let b;

      if (SELF_LIT.has(idx) || n === 0) {
        r = day[0];
        gg = day[1];
        b = day[2];
      } else {
        const nite = NIGHT[idx];
        r = day[0] + (nite[0] - day[0]) * n;
        gg = day[1] + (nite[1] - day[1]) * n;
        b = day[2] + (nite[2] - day[2]) * n;
        for (let li = 0; li < live.length; li += 1) {
          const l = live[li];
          const dx = x - l.x;
          const dy = (y - l.y) * 1.12;
          let k = 1 - Math.sqrt(dx * dx + dy * dy) / l.r;
          if (k <= 0) continue;
          k = k * k * n * (l.strength === undefined ? 0.95 : l.strength);
          const warm = l.warm === undefined ? 1 : l.warm;
          r += (day[0] * (1 + 0.08 * warm) - r) * k;
          gg += (day[1] * (1 - 0.02 * warm) - gg) * k;
          b += (day[2] * (1 - 0.22 * warm) - b) * k;
        }
      }

      if (mono) {
        // luminance, quantised to the page's five tones; the hover lift still applies after
        const lum = (r * 0.299 + gg * 0.587 + b * 0.114) / 255;
        const step = MONO[Math.min(4, Math.max(0, Math.round((1 - lum) * 4.2)))];
        r = step[0];
        gg = step[1];
        b = step[2];
      }

      if (hover) {
        if (ids[i] === hover) {
          r += (255 - r) * 0.12;
          gg += (255 - gg) * 0.11;
          b += (255 - b) * 0.07;
        } else if (isEdge(ids, i, x, y, hover)) {
          r += (255 - r) * 0.62;
          gg += (232 - gg) * 0.62;
          b += (178 - b) * 0.62;
        }
      }

      d[o] = r > 255 ? 255 : r < 0 ? 0 : r;
      d[o + 1] = gg > 255 ? 255 : gg < 0 ? 0 : gg;
      d[o + 2] = b > 255 ? 255 : b < 0 ? 0 : b;
      d[o + 3] = 255;
    }
  }
}
