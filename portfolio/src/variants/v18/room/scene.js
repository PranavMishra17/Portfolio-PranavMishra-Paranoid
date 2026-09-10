// v18 — the room, redrawn.
//
// Straight on, one scene, at 288×162. Everything is drawn procedurally so a shelf is actually
// shelves with books standing on them, a poster is actually a composition, and the window is a
// window with panes and a sunrise behind it.
//
// Draw order carries the depth: the wall, then the furniture against it, then whatever stands
// in front of that. He is drawn last, so he sits in front of the desk.

import { painter, W, H } from './engine';
import { BOOKS, GAMES, MAGNETS, POSTERS, TROPHIES } from '../personal';
import { SIT, WAVE, WALK, STAND, LEGEND } from './sprites';

/* Hit-test order: first match wins, so small things in front come first. */
export const HOTSPOTS = [
  { id: 1, key: 'lamp', label: 'The lamp', kind: 'hand', x: 69, y: 53, w: 26, h: 20 },
  { id: 2, key: 'me', label: 'Me', kind: 'zoom', x: 130, y: 68, w: 22, h: 30 },
  { id: 3, key: 'photo', label: 'Family', kind: 'zoom', x: 102, y: 82, w: 18, h: 17 },
  { id: 4, key: 'mug', label: 'Tea', kind: 'hand', x: 159, y: 88, w: 11, h: 11 },
  { id: 5, key: 'laptop', label: 'Where I have worked', kind: 'zoom', x: 74, y: 83, w: 26, h: 16 },
  { id: 6, key: 'monitorA', label: 'Everything I have made', kind: 'zoom', x: 118, y: 58, w: 48, h: 36 },
  { id: 7, key: 'monitorB', label: 'Three papers', kind: 'zoom', x: 170, y: 52, w: 26, h: 42 },
  { id: 8, key: 'pc', label: 'The tower', kind: 'hand', x: 78, y: 104, w: 20, h: 28 },
  { id: 9, key: 'poster1', label: POSTERS[0].title, kind: 'zoom', x: 78, y: 12, w: 36, h: 42 },
  { id: 10, key: 'poster2', label: POSTERS[1].title, kind: 'zoom', x: 120, y: 12, w: 36, h: 42 },
  { id: 11, key: 'poster3', label: POSTERS[2].title, kind: 'zoom', x: 162, y: 12, w: 36, h: 42 },
  { id: 12, key: 'trophies', label: 'MIT XR 2024 and HINT 5.0', kind: 'zoom', x: 10, y: 6, w: 58, h: 17 },
  { id: 13, key: 'books', label: 'Books', kind: 'zoom', x: 12, y: 26, w: 56, h: 23 },
  { id: 14, key: 'games', label: 'Games', kind: 'zoom', x: 12, y: 52, w: 56, h: 23 },
  { id: 15, key: 'shelf3', label: 'The rest of the shelf', kind: 'zoom', x: 12, y: 78, w: 56, h: 23 },
  { id: 16, key: 'fridge', label: 'The fridge', kind: 'zoom', x: 232, y: 82, w: 52, h: 72 },
  { id: 17, key: 'plant', label: 'A plant', kind: 'hand', x: 204, y: 90, w: 22, h: 42 },
  { id: 18, key: 'ball', label: 'Football and boots', kind: 'hand', x: 10, y: 132, w: 50, h: 26 },
  { id: 19, key: 'window', label: 'The window', kind: 'hand', x: 210, y: 14, w: 60, h: 56 },
  { id: 20, key: 'lights', label: 'String lights', kind: 'hand', x: 6, y: 0, w: 276, h: 12 },
  { id: 21, key: 'door', label: 'The door', kind: 'hand', x: 0, y: 40, w: 8, h: 92 },
];

export const LIGHTS = {
  lamp: { x: 86, y: 70, r: 78, warm: 1, strength: 0.95 },
  screens: { x: 128, y: 76, r: 56, warm: 0.15, strength: 0.7 },
  string: [
    { x: 40, y: 10, r: 44, warm: 1, strength: 0.5 },
    { x: 108, y: 14, r: 44, warm: 1, strength: 0.5 },
    { x: 180, y: 14, r: 44, warm: 1, strength: 0.5 },
    { x: 248, y: 10, r: 44, warm: 1, strength: 0.5 },
  ],
};

const FLOOR_Y = 130;
const SKIRT_Y = 126;

/* ── the shell ─────────────────────────────────────────────────────── */

function shell(g) {
  g.setId(0);
  g.rect(0, 0, W, FLOOR_Y, 'wall');
  // light falls from the window side, so the right of the wall is warmer
  // light off the window: a wide, quiet wash. Every fourth pixel at the edge of the falloff,
  // every pixel in the middle of it — a dither this size reads as dirt, not as light.
  for (let x = 140; x < W; x += 1) {
    const k = (x - 140) / (W - 140);
    for (let y = 0; y < SKIRT_Y; y += 1) {
      if (k > 0.62) g.px(x, y, 'wallLit');
      else if (k > 0.26 && (x * 3 + y * 5) % 7 === 0) g.px(x, y, 'wallLit');
    }
  }
  for (let x = 0; x < 54; x += 1) {
    const k = 1 - x / 54;
    for (let y = 0; y < SKIRT_Y; y += 1) {
      if (k > 0.74) g.px(x, y, 'wallDim');
      else if (k > 0.3 && (x * 3 + y * 5) % 7 === 0) g.px(x, y, 'wallDim');
    }
  }
  // cornice
  g.rect(0, 0, W, 3, 'cornice');
  g.hline(0, 3, W, 'wallDim');
  // skirting
  g.rect(0, SKIRT_Y, W, 4, 'skirt');
  g.hline(0, SKIRT_Y, W, 'wallDim');
  // floorboards, running away from you
  g.rect(0, FLOOR_Y, W, H - FLOOR_Y, 'floor');
  for (let y = FLOOR_Y; y < H; y += 1) {
    const band = Math.floor((y - FLOOR_Y) / 5);
    if (band % 2) g.hline(0, y, W, 'floor2');
  }
  for (let x = 0; x < W; x += 26) {
    const off = ((x / 26) % 2) * 3;
    for (let y = FLOOR_Y + off; y < H; y += 10) g.vline(x, y, 5, 'floorDark');
  }
  g.hline(0, FLOOR_Y, W, 'floorDark');
}

function door(g, open) {
  g.setId(21);
  g.rect(0, 34, 8, SKIRT_Y - 34, 'wood3');
  g.rect(1, 36, 6, SKIRT_Y - 38, open ? 'ink' : 'wood2');
  if (!open) {
    g.rect(2, 60, 4, 22, 'wood3');
    g.px(6, 84, 'gold');
  } else {
    // a slice of the hallway
    g.rect(1, 36, 4, SKIRT_Y - 38, 'ink2');
    g.rect(5, 36, 2, SKIRT_Y - 38, 'wood2');
  }
  g.setId(0);
}

/* ── string lights ─────────────────────────────────────────────────── */

function stringLights(g, on, t) {
  g.setId(20);
  const bulbs = [];
  const SPANS = 4;
  for (let x = 6; x < W - 4; x += 1) {
    const p = (x - 6) / (W - 10);
    const seg = (p * SPANS) % 1;             // where we are inside this swag
    const sag = Math.sin(seg * Math.PI) * 7; // each swag hangs and comes back to the pin
    const y = 3 + Math.round(sag);
    g.px(x, y, 'cable');
    if ((x - 6) % 12 === 6) bulbs.push([x, y + 1]);
  }
  bulbs.forEach(([x, y], i) => {
    const flicker = on && Math.sin(t / 320 + i * 1.7) > -0.86;
    const c = on ? (flicker ? 'bulb' : 'bulbOff') : 'bulbOff';
    g.px(x, y, c);
    g.px(x - 1, y + 1, c);
    g.px(x, y + 1, c);
    g.px(x + 1, y + 1, c);
    g.px(x, y + 2, c);
  });
  g.setId(0);
}

/* ── the shelf ─────────────────────────────────────────────────────── */

function bay(g, x, y, w, h) {
  g.rect(x, y, w, h, 'wood3');
  g.rect(x + 1, y, w - 2, h - 2, 'ink2');
}

function spines(g, x, y, h, items, hoverColours) {
  // Real spines: each book gets a width, a band, and a couple of lines where the title is.
  let cx = x;
  items.forEach((it, i) => {
    const bw = 4 + (i % 3 === 0 ? 1 : 0);
    const bh = h - (i % 4);
    const top = y + h - bh;
    const c = hoverColours ? hoverColours(it, i) : 'paper';
    g.rect(cx, top, bw, bh, c.body);
    g.rect(cx, top, bw, 1, c.cap);
    g.rect(cx, top + 3, bw, 1, c.cap);
    if (bw > 4) g.px(cx + 2, top + Math.round(bh / 2), c.cap);
    g.vline(cx + bw - 1, top, bh, 'ink2');
    cx += bw + 1;
  });
  return cx;
}

function shelfUnit(g, state) {
  const x = 8;
  const y = 22;
  const w = 62;
  const h = SKIRT_Y - y;
  g.setId(0);
  g.rect(x, y, w, h, 'wood');
  g.rect(x, y, w, 3, 'woodTop');
  g.frame(x, y, w, h, 'wood3');

  const bays = [
    { id: 13, top: 26, items: BOOKS, kind: 'book' },
    { id: 14, top: 52, items: GAMES, kind: 'game' },
    { id: 15, top: 78, items: BOOKS.slice(0, 2), kind: 'book' },
  ];

  bays.forEach((b) => {
    g.setId(0);
    bay(g, x + 2, b.top - 2, w - 4, 25);
    g.setId(b.id);
    if (b.kind === 'game') {
      let cx = x + 5;
      const CASE = ['purple2', 'blue2', 'orange2', 'red2'];
      b.items.forEach((it, i) => {
        const bw = 8;
        const bh = 19 - (i % 2);
        const top = b.top + 21 - bh;
        g.rect(cx, top, bw, bh, 'ink2');
        g.rect(cx + 1, top + 1, bw - 2, bh - 2, 'cream');
        g.rect(cx + 1, top + 1, bw - 2, 4, CASE[i % CASE.length]);
        g.rect(cx + 2, top + 7, bw - 4, 5, CASE[i % CASE.length]);
        g.rect(cx + 2, top + 14, bw - 4, 1, 'grey3');
        g.vline(cx + bw - 1, top, bh, 'ink2');
        cx += bw + 2;
      });
      // a small stack lying flat on the right
      g.rect(x + w - 18, b.top + 16, 14, 2, 'red');
      g.rect(x + w - 18, b.top + 13, 14, 2, 'blue');
      g.rect(x + w - 18, b.top + 10, 14, 2, 'green');
    } else {
      const end = spines(g, x + 5, b.top + 2, 19, b.items.concat(b.items).slice(0, 9), (it, i) => {
        const pal = ['paper', 'cream', 'sand', 'blue2', 'green2', 'red2', 'purple2', 'teal', 'orange2'];
        return { body: pal[i % pal.length], cap: 'ink2' };
      });
      // one leaning, because a shelf is never neat
      g.line(end + 1, b.top + 4, end + 5, b.top + 20, 'wood3');
      g.line(end + 2, b.top + 4, end + 6, b.top + 20, 'red3');
      g.line(end + 3, b.top + 4, end + 7, b.top + 20, 'red');
    }
    g.setId(0);
    g.rect(x + 2, b.top + 21, w - 4, 2, 'wood2');
  });

  // bottom bay: a record crate and a small speaker, no hotspot
  g.setId(0);
  bay(g, x + 2, 104, w - 4, 20);
  g.rect(x + 6, 108, 22, 14, 'wood2');
  g.frame(x + 6, 108, 22, 14, 'wood3');
  for (let i = 0; i < 7; i += 1) g.vline(x + 8 + i * 2, 110, 11, i % 2 ? 'ink2' : 'grey3');
  g.rect(x + 34, 108, 14, 14, 'ink2');
  g.disc(x + 41, 115, 4, 'grey3');
  g.disc(x + 41, 115, 2, 'ink');
  g.px(x + 47, 110, 'led');
}

function trophies(g, sparkle) {
  g.setId(12);
  const y = 22;
  // cup one
  g.rect(16, y - 12, 10, 6, 'gold');
  g.rect(17, y - 6, 8, 1, 'gold2');
  g.rect(19, y - 5, 4, 3, 'gold');
  g.rect(16, y - 2, 10, 2, 'gold2');
  g.px(14, y - 11, 'gold');
  g.px(14, y - 10, 'gold');
  g.px(27, y - 11, 'gold');
  g.px(27, y - 10, 'gold');
  // plaque
  g.rect(32, y - 10, 16, 10, 'wood3');
  g.rect(33, y - 9, 14, 8, 'gold2');
  for (let i = 0; i < 4; i += 1) g.hline(35, y - 7 + i * 2, 10, 'wood3');
  // cup two
  g.rect(54, y - 10, 8, 5, 'gold');
  g.rect(56, y - 5, 4, 3, 'gold');
  g.rect(53, y - 2, 10, 2, 'gold2');
  if (sparkle) {
    g.px(21, y - 15, 'white');
    g.px(58, y - 13, 'white');
    g.px(40, y - 13, 'white');
  }
  g.setId(0);
}

/* ── posters ───────────────────────────────────────────────────────── */

function posterFrame(g, x, y, w, h) {
  g.rect(x - 1, y - 1, w + 2, h + 2, 'ink2');
}

function poster(g, id, x, y, which) {
  const w = 36;
  const h = 42;
  g.setId(id);
  posterFrame(g, x, y, w, h);

  if (which === 0) {
    // Hollywood: a low gold sun, two figures, a title band
    g.rect(x, y, w, h, 'poster1');
    g.rect(x, y, w, 14, 'orange2');
    g.disc(x + 24, y + 14, 7, 'yellow2');
    g.rect(x, y + 22, w, h - 22, 'orange');
    g.rect(x, y + 21, w, 1, 'red3');
    // two figures
    g.rect(x + 9, y + 12, 4, 12, 'ink');
    g.rect(x + 8, y + 15, 6, 4, 'ink');
    g.rect(x + 17, y + 14, 4, 10, 'ink');
    g.rect(x + 16, y + 16, 6, 4, 'ink');
    // a car, low and wide
    g.rect(x + 4, y + 30, 18, 4, 'ink2');
    g.rect(x + 8, y + 27, 9, 3, 'ink2');
    g.px(x + 6, y + 34, 'ink');
    g.px(x + 20, y + 34, 'ink');
    g.rect(x + 3, y + 37, 30, 2, 'cream');
    g.rect(x + 7, y + 40, 22, 1, 'cream');
  } else if (which === 1) {
    // Wasseypur: red field, one silhouette, hard type
    g.rect(x, y, w, h, 'poster2');
    g.rect(x, y, w, 8, 'red3');
    for (let i = 0; i < w; i += 3) g.px(x + i, y + 9, 'red3');
    g.rect(x + 13, y + 12, 10, 20, 'ink');
    g.rect(x + 14, y + 8, 8, 5, 'ink');
    g.rect(x + 10, y + 16, 3, 9, 'ink');
    g.rect(x + 23, y + 16, 3, 9, 'ink');
    g.rect(x + 4, y + 34, 28, 3, 'cream');
    g.rect(x + 4, y + 38, 18, 2, 'sand');
    g.px(x + 30, y + 14, 'yellow2');
  } else {
    // Dune: a dune ridge, a vast sun, two specks
    g.rect(x, y, w, h, 'poster3');
    g.rect(x, y, w, 20, 'sand');
    g.disc(x + 18, y + 12, 9, 'orange2');
    g.disc(x + 18, y + 12, 6, 'yellow2');
    for (let i = 0; i < w; i += 1) {
      const ridge = 24 + Math.round(Math.sin((i / w) * Math.PI * 1.6) * 4);
      g.rect(x + i, y + ridge, 1, h - ridge, 'wood2');
      g.px(x + i, y + ridge, 'sand');
    }
    for (let i = 0; i < w; i += 1) {
      const ridge = 32 + Math.round(Math.sin((i / w) * Math.PI * 2.2 + 1) * 3);
      g.rect(x + i, y + ridge, 1, h - ridge, 'wood3');
    }
    g.px(x + 12, y + 23, 'ink');
    g.px(x + 12, y + 22, 'ink');
    g.px(x + 15, y + 24, 'ink');
    g.rect(x + 6, y + 37, 24, 2, 'cream');
  }
  g.setId(0);
}

/* ── the window ────────────────────────────────────────────────────── */

function windowUnit(g, open, t) {
  const x = 210;
  const y = 14;
  const w = 60;
  const h = 56;
  g.setId(19);
  g.rect(x - 2, y - 2, w + 4, h + 4, 'wood3');
  g.rect(x, y, w, h, 'sky1');
  // sunrise: bands, warmest at the horizon
  for (let i = 0; i < h; i += 1) {
    const k = i / h;
    const c = k < 0.34 ? 'sky1' : k < 0.62 ? 'sky2' : 'sky3';
    g.hline(x, y + i, w, c);
  }
  const sunY = y + 34 - Math.round(Math.sin(t / 4200) * 2);
  g.disc(x + 40, sunY, 6, 'sun');
  g.disc(x + 40, sunY, 4, 'sun');
  // hills
  for (let i = 0; i < w; i += 1) {
    const hh = 42 + Math.round(Math.sin(i / 9) * 3 + Math.sin(i / 21) * 4);
    g.rect(x + i, y + hh, 1, h - hh, 'hill');
    const hh2 = 47 + Math.round(Math.sin(i / 13 + 2) * 3);
    g.rect(x + i, y + hh2, 1, h - hh2, 'hill2');
  }
  // panes
  g.rect(x + w / 2 - 1, y, 2, h, 'wood2');
  g.rect(x, y + h / 2 - 1, w, 2, 'wood2');
  g.frame(x, y, w, h, 'wood2');
  // the sash, up when open
  const sash = open ? y - 1 : y + h / 2 - 1;
  g.rect(x + 1, sash, w - 2, 3, 'wood3');
  g.px(x + w / 2, sash + 1, 'metal2');

  // curtains, drawn back at the sides; they part further when the window is open
  const pull = open ? 4 : 0;
  g.setId(0);
  for (let i = 0; i < 9 - pull; i += 1) {
    const cx = x - 6 + i;
    g.rect(cx, y - 4, 1, h + 6, i % 2 ? 'cream' : 'sand');
  }
  for (let i = 0; i < 9 - pull; i += 1) {
    const cx = x + w + 5 - i;
    g.rect(cx, y - 4, 1, h + 6, i % 2 ? 'cream' : 'sand');
  }
  g.rect(x - 8, y - 6, w + 16, 2, 'wood3');
}

/* ── the desk and everything on it ─────────────────────────────────── */

function desk(g) {
  g.setId(0);
  g.rect(70, 98, 136, 3, 'woodTop');
  g.rect(70, 101, 136, 4, 'wood');
  g.hline(70, 104, 136, 'wood3');
  g.rect(74, 105, 4, 25, 'wood3');
  g.rect(198, 105, 4, 25, 'wood3');
  g.rect(74, 128, 128, 2, 'wood3');
}

function screenGlow(g, x, y, w, h, on, t) {
  if (!on) {
    g.rect(x, y, w, h, 'screen');
    g.dither(x, y, w, h, 'screen', 'screen2');
    return;
  }
  g.rect(x, y, w, h, 'screen2');
  g.rect(x, y, w, 3, 'screen');
  // a window with a title bar and some lines of something
  g.rect(x + 2, y + 4, w - 4, h - 6, 'screen');
  g.rect(x + 2, y + 4, w - 4, 2, 'screenLit');
  const rows = Math.floor((h - 12) / 3);
  for (let i = 0; i < rows; i += 1) {
    const len = 4 + ((i * 7 + Math.floor(t / 900)) % (w - 10));
    g.rect(x + 4, y + 9 + i * 3, Math.max(4, len), 1, i % 4 === 0 ? 'screenGrn' : 'screenTxt');
  }
  const caret = Math.sin(t / 260) > 0;
  if (caret) g.rect(x + 5, y + h - 5, 3, 1, 'screenWarm');
}

function monitors(g, on, t) {
  // wide monitor — everything I have made
  g.setId(6);
  g.rect(118, 58, 48, 36, 'ink2');
  g.rect(120, 60, 44, 32, 'ink');
  screenGlow(g, 121, 61, 42, 30, on, t);
  g.rect(137, 94, 10, 4, 'grey3');
  g.rect(129, 97, 26, 2, 'grey3');
  g.px(163, 92, on ? 'led' : 'ledRed');

  // portrait monitor — the papers
  g.setId(7);
  g.rect(170, 52, 26, 42, 'ink2');
  g.rect(172, 54, 22, 38, 'ink');
  screenGlow(g, 173, 55, 20, 36, on, t);
  g.rect(180, 94, 6, 4, 'grey3');
  g.rect(175, 97, 16, 2, 'grey3');
  g.setId(0);
}

function laptop(g, on, t) {
  g.setId(5);
  g.rect(76, 84, 22, 13, 'metal');
  g.rect(77, 85, 20, 11, 'ink');
  screenGlow(g, 78, 86, 18, 9, on, t);
  g.rect(74, 96, 26, 2, 'metal2');
  g.rect(74, 98, 26, 1, 'metal3');
  g.setId(0);
}

function lamp(g, on) {
  // clamped to the left end of the desk, arm reaching back over the laptop
  g.setId(1);
  g.rect(70, 92, 10, 6, 'metal3');
  g.rect(74, 62, 2, 31, 'metal');
  g.line(75, 62, 82, 57, 'metal');
  g.rect(80, 55, 13, 7, on ? 'lampOn' : 'lampOff');
  g.rect(81, 62, 11, 2, on ? 'bulb' : 'lampOff');
  g.frame(80, 55, 13, 7, 'metal3');
  g.setId(0);
}

function photo(g) {
  g.setId(3);
  g.rect(102, 82, 18, 16, 'wood2');
  g.rect(103, 83, 16, 14, 'paper');
  g.rect(104, 90, 16, 7, 'blue2');
  g.disc(107, 88, 2, 'skin');
  g.disc(112, 87, 2, 'skin');
  g.disc(117, 88, 2, 'skin');
  g.rect(105, 90, 5, 6, 'red2');
  g.rect(110, 89, 5, 7, 'cream');
  g.rect(115, 90, 5, 6, 'green2');
  g.rect(102, 97, 18, 2, 'wood3');
  g.setId(0);
}

function mug(g, steaming, t) {
  g.setId(4);
  g.rect(160, 90, 8, 8, 'red');
  g.rect(161, 91, 6, 2, steaming ? 'wood3' : 'ink2');
  g.px(168, 92, 'red');
  g.px(169, 93, 'red');
  g.px(168, 94, 'red');
  g.rect(160, 98, 8, 1, 'red3');
  if (steaming) {
    const s = Math.floor(t / 260) % 3;
    g.px(162 + s, 88 - s, 'grey2');
    g.px(165 - s, 87 - s, 'grey2');
  }
  g.setId(0);
}

function tower(g, on, t) {
  g.setId(8);
  g.rect(78, 104, 20, 28, 'grey3');
  g.rect(79, 105, 18, 26, 'ink2');
  g.rect(81, 107, 14, 3, 'grey3');
  g.rect(81, 112, 14, 2, 'grey3');
  g.px(94, 118, on ? 'led' : 'ledRed');
  g.px(94, 121, on ? 'screenGrn' : 'grey3');
  // the mesh
  for (let y = 124; y < 130; y += 2) for (let x = 81; x < 95; x += 2) g.px(x, y, 'grey3');
  // the cable, out and along the skirting
  g.setId(0);
  g.line(88, 132, 94, 136, 'cable');
  g.line(94, 136, 122, 136, 'cable');
  if (on && Math.sin(t / 700) > 0.4) g.px(94, 118, 'white');
  g.setId(0);
}

function chair(g) {
  g.setId(0);
  // a task chair seen from behind: he covers most of it, which is the point
  g.rect(128, 88, 24, 26, 'ink2');
  g.rect(130, 90, 20, 22, 'grey3');
  for (let y = 92; y < 111; y += 3) g.hline(131, y, 18, 'ink2');
  g.rect(130, 90, 20, 2, 'ink2');
  g.rect(125, 96, 3, 12, 'ink2');   // arms
  g.rect(152, 96, 3, 12, 'ink2');
  g.rect(126, 112, 28, 4, 'ink2');  // seat
  g.rect(138, 116, 4, 10, 'metal3');
  g.rect(129, 126, 22, 2, 'metal3');
  g.px(128, 128, 'ink');
  g.px(151, 128, 'ink');
}

/* ── the right-hand corner ─────────────────────────────────────────── */

function plant(g, grown, t) {
  g.setId(17);
  const sway = Math.round(Math.sin(t / 900));
  g.rect(206, 116, 18, 14, 'pot');
  g.rect(206, 116, 18, 3, 'wood2');
  g.rect(207, 130, 16, 2, 'wood3');
  g.rect(208, 119, 14, 2, 'floorDark');
  const top = grown ? 92 : 100;
  // three stems, so it is a plant rather than a stick
  [[213, 0], [215, 3], [217, 1]].forEach(([sx, drop], si) => {
    g.rect(sx, top + drop, 1, 116 - top - drop, 'green3');
    const leaves = (grown ? 5 : 4) - si % 2;
    for (let i = 0; i < leaves; i += 1) {
      const y = top + drop + 2 + i * 4;
      const dir = (i + si) % 2 ? 1 : -1;
      const len = 4 + ((i + si) % 3);
      for (let k = 1; k <= len; k += 1) {
        const px = sx + dir * k + (i % 2 ? sway : 0);
        g.px(px, y + Math.round(k / 3), k > len - 2 ? 'leaf' : 'leaf2');
        if (k < len - 1) g.px(px, y + 1 + Math.round(k / 3), 'leaf2');
      }
    }
  });
  g.setId(0);
}

function fridge(g, open, t) {
  const x = 232;
  const y = 82;
  const w = 52;
  const h = 72;
  g.setId(16);
  g.rect(x, y, w, h, 'fridge2');
  g.rect(x + 1, y + 1, w - 2, h - 2, 'fridge');
  g.hline(x + 1, y + 24, w - 2, 'fridge2');
  g.rect(x + w - 7, y + 6, 3, 14, 'metal2');
  g.rect(x + w - 7, y + 30, 3, 22, 'metal2');

  if (open) {
    g.rect(x + 4, y + 26, w - 12, h - 32, 'ink2');
    g.rect(x + 6, y + 28, w - 16, h - 36, 'screen2');
    g.hline(x + 6, y + 44, w - 16, 'metal2');
    g.hline(x + 6, y + 60, w - 16, 'metal2');
    g.rect(x + 9, y + 36, 5, 8, 'green');
    g.rect(x + 17, y + 34, 4, 10, 'red');
    g.rect(x + 24, y + 37, 6, 7, 'cream');
    g.rect(x + 10, y + 52, 7, 8, 'blue2');
    g.rect(x + 22, y + 50, 5, 10, 'orange');
    g.px(x + w - 14, y + 30, 'bulb');
  }

  // magnets, and a photo held under one
  const MTINT = ['orange', 'green', 'yellow', 'blue2', 'pink'];
  const MSHAPE = ['disc', 'rect', 'disc', 'rect', 'disc'];
  MAGNETS.forEach((m, i) => {
    const mx = x + 7 + (i % 3) * 14;
    const my = y + 5 + Math.floor(i / 3) * 12;
    const wob = i === Math.floor(t / 1100) % MAGNETS.length ? 1 : 0;
    const c = MTINT[i % MTINT.length];
    if (MSHAPE[i] === 'disc') {
      g.disc(mx + 4, my + 3 - wob, 4, c);
      g.disc(mx + 4, my + 3 - wob, 2, 'cream');
      g.px(mx + 4, my + 3 - wob, 'ink2');
    } else {
      g.rect(mx, my - wob, 9, 8, c);
      g.rect(mx + 1, my + 1 - wob, 7, 6, 'cream');
      g.rect(mx + 2, my + 3 - wob, 5, 1, 'ink2');
      g.rect(mx + 2, my + 5 - wob, 3, 1, 'ink2');
    }
  });
  g.rect(x + 30, y + 30, 16, 14, 'paper');
  g.rect(x + 31, y + 31, 14, 12, 'sky2');
  g.rect(x + 32, y + 38, 12, 5, 'hill');
  g.rect(x + 36, y + 28, 4, 3, 'yellow2');
  g.setId(0);
}

/* ── the floor ─────────────────────────────────────────────────────── */

function rug(g) {
  g.setId(0);
  const x = 70;
  const y = 134;
  const w = 132;
  const h = 24;
  g.rect(x, y, w, h, 'rug');
  g.frame(x, y, w, h, 'rug3');
  g.frame(x + 2, y + 2, w - 4, h - 4, 'rug2');
  for (let i = 0; i < w - 12; i += 8) {
    g.px(x + 6 + i, y + 8, 'rug4');
    g.px(x + 7 + i, y + 9, 'rug4');
    g.px(x + 6 + i, y + 10, 'rug4');
    g.px(x + 5 + i, y + 9, 'rug4');
    g.px(x + 10 + i, y + 15, 'rug2');
  }
  for (let i = 0; i < w; i += 2) {
    g.px(x + i, y - 1, 'rug3');
    g.px(x + i, y + h, 'rug3');
  }
}

function ball(g, bounce) {
  g.setId(0);
  const sw = 15 - Math.round(bounce / 3);
  for (let i = 0; i < sw; i += 1) {
    const dy = Math.abs(i - sw / 2) > sw / 3 ? 0 : 1;
    g.px(22 - Math.round(sw / 2) + i, 155, 'floorDark');
    if (dy) g.px(22 - Math.round(sw / 2) + i, 156, 'floorDark');
  }
  g.setId(18);
  const by = 146 - bounce;
  g.disc(22, by, 8, 'ball');
  g.px(22, by - 4, 'ballDark');
  g.rect(20, by - 3, 5, 4, 'ballDark');
  g.px(17, by + 2, 'ballDark');
  g.px(27, by + 2, 'ballDark');
  g.px(22, by + 6, 'ballDark');
  // boots, side by side
  g.rect(38, 148, 11, 6, 'boot');
  g.rect(38, 154, 12, 2, 'bootSole');
  g.rect(46, 145, 4, 4, 'boot');
  g.rect(51, 148, 11, 6, 'boot');
  g.rect(51, 154, 12, 2, 'bootSole');
  g.rect(59, 145, 4, 4, 'boot');
  g.px(41, 150, 'cream');
  g.px(54, 150, 'cream');
  g.setId(0);
}

/* ── him ───────────────────────────────────────────────────────────── */

function person(g, mode, frame, x) {
  g.setId(2);
  if (mode === 'walk') g.sprite(x, 100, WALK[frame % WALK.length], LEGEND);
  else if (mode === 'stand') g.sprite(x, 100, STAND, LEGEND);
  else g.sprite(133, 70, mode === 'wave' ? WAVE : SIT, LEGEND);
  g.setId(0);
}

/* ── the whole thing ───────────────────────────────────────────────── */

export function drawScene(grid, state) {
  const g = painter(grid);
  const t = state.t || 0;
  shell(g);
  door(g, state.doorOpen);
  stringLights(g, state.string, t);
  shelfUnit(g, state);
  trophies(g, state.sparkle);
  POSTERS.forEach((p, i) => poster(g, 9 + i, 78 + i * 42, 12, i));
  windowUnit(g, state.windowOpen, t);
  plant(g, state.grown, t);
  fridge(g, state.fridgeOpen, t);
  rug(g);
  ball(g, state.bounce || 0);
  desk(g);
  monitors(g, state.pc, t);
  laptop(g, state.pc, t);
  lamp(g, state.lamp);
  chair(g);
  photo(g);
  mug(g, !state.cold, t);
  tower(g, state.pc, t);
  person(g, state.mode, state.frame, state.walkX);
  return grid;
}

export { W, H };
