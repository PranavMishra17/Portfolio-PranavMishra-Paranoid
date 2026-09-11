// v19 — the room, rebuilt.
//
// What changed, all of it his:
//   · the bookshelf is gone. One long plank with a single row of books, the trophies standing
//     on top of it and two medals hanging off the end.
//   · the games moved off the shelf and onto the floor beside the tower, where games live.
//   · the laptop moved to the right of the desk and the family photo to the left, under the lamp.
//   · the football is a football — a proper panelled ball, not a white circle.
//   · the rug is a woven kilim rather than a slab of colour.
//   · he is half again as big, sits higher, and reacts when you point at him or click him.
//   · the big monitor shows a real screenshot, pixelated, which the Room component blits over
//     the grid. This file only reserves the rectangle for it — see SCREENS.

import { painter, W, H } from './engine';
import { BOOKS, GAMES, MAGNETS, POSTERS } from '../personal';
import { SIT, WAVE, LEAN, WALK, STAND, LEGEND } from './sprites';

const FLOOR_Y = 130;
const SKIRT_Y = 126;

/* The rectangles the Room component paints real, pixelated images into. */
export const SCREENS = {
  monitorA: { x: 118, y: 61, w: 40, h: 28 },
  monitorB: { x: 165, y: 55, w: 19, h: 30 },
};

/* Hit-test order: first match wins, so small things in front come first. */
export const HOTSPOTS = [
  { id: 1, key: 'lamp', label: 'The lamp', kind: 'hand', x: 70, y: 52, w: 24, h: 18 },
  { id: 2, key: 'me', label: 'Me', kind: 'zoom', x: 128, y: 62, w: 26, h: 38 },
  { id: 3, key: 'photo', label: 'Family', kind: 'zoom', x: 84, y: 80, w: 20, h: 19 },
  { id: 4, key: 'mug', label: 'Tea', kind: 'hand', x: 106, y: 87, w: 11, h: 12 },
  { id: 5, key: 'laptop', label: 'Where I have worked', kind: 'zoom', x: 186, y: 82, w: 28, h: 18 },
  { id: 6, key: 'monitorA', label: 'Everything I have made', kind: 'zoom', x: 114, y: 58, w: 46, h: 34 },
  { id: 7, key: 'monitorB', label: 'Two papers', kind: 'zoom', x: 162, y: 52, w: 25, h: 40 },
  { id: 8, key: 'pc', label: 'The tower', kind: 'hand', x: 72, y: 104, w: 20, h: 28 },
  { id: 9, key: 'games', label: 'Games', kind: 'zoom', x: 96, y: 114, w: 22, h: 18 },
  { id: 10, key: 'poster1', label: POSTERS[0].title, kind: 'zoom', x: 74, y: 10, w: 36, h: 42 },
  { id: 11, key: 'poster2', label: POSTERS[1].title, kind: 'zoom', x: 116, y: 10, w: 36, h: 42 },
  { id: 12, key: 'poster3', label: POSTERS[2].title, kind: 'zoom', x: 158, y: 10, w: 36, h: 42 },
  { id: 13, key: 'trophies', label: 'MIT XR 2024 and HINT 5.0', kind: 'zoom', x: 41, y: 20, w: 26, h: 17 },
  { id: 14, key: 'medals', label: 'Medals', kind: 'zoom', x: 48, y: 34, w: 18, h: 26 },
  { id: 15, key: 'books', label: 'Books', kind: 'zoom', x: 10, y: 16, w: 30, h: 21 },
  { id: 16, key: 'fridge', label: 'The fridge', kind: 'zoom', x: 240, y: 80, w: 48, h: 74 },
  { id: 17, key: 'plant', label: 'A plant', kind: 'hand', x: 218, y: 88, w: 22, h: 46 },
  { id: 18, key: 'ball', label: 'Football and boots', kind: 'hand', x: 10, y: 132, w: 58, h: 26 },
  { id: 19, key: 'window', label: 'The window', kind: 'hand', x: 216, y: 14, w: 58, h: 56 },
  { id: 20, key: 'lights', label: 'String lights', kind: 'hand', x: 6, y: 0, w: 276, h: 11 },
  { id: 21, key: 'door', label: 'The door', kind: 'hand', x: 0, y: 40, w: 8, h: 92 },
];

export const LIGHTS = {
  lamp: { x: 84, y: 70, r: 78, warm: 1, strength: 0.95 },
  screens: { x: 146, y: 74, r: 58, warm: 0.15, strength: 0.7 },
  string: [
    { x: 40, y: 10, r: 44, warm: 1, strength: 0.5 },
    { x: 108, y: 14, r: 44, warm: 1, strength: 0.5 },
    { x: 180, y: 14, r: 44, warm: 1, strength: 0.5 },
    { x: 248, y: 10, r: 44, warm: 1, strength: 0.5 },
  ],
};

/* ── the shell ─────────────────────────────────────────────────────── */

function shell(g) {
  g.setId(0);
  g.rect(0, 0, W, FLOOR_Y, 'wall');
  for (let x = 150; x < W; x += 1) {
    const k = (x - 150) / (W - 150);
    for (let y = 0; y < SKIRT_Y; y += 1) {
      if (k > 0.66) g.px(x, y, 'wallLit');
      else if (k > 0.28 && (x * 3 + y * 5) % 7 === 0) g.px(x, y, 'wallLit');
    }
  }
  for (let x = 0; x < 54; x += 1) {
    const k = 1 - x / 54;
    for (let y = 0; y < SKIRT_Y; y += 1) {
      if (k > 0.76) g.px(x, y, 'wallDim');
      else if (k > 0.32 && (x * 3 + y * 5) % 7 === 0) g.px(x, y, 'wallDim');
    }
  }
  g.rect(0, 0, W, 3, 'cornice');
  g.hline(0, 3, W, 'wallDim');
  g.rect(0, SKIRT_Y, W, 4, 'skirt');
  g.hline(0, SKIRT_Y, W, 'wallDim');

  g.rect(0, FLOOR_Y, W, H - FLOOR_Y, 'floor');
  for (let y = FLOOR_Y; y < H; y += 1) {
    if (Math.floor((y - FLOOR_Y) / 5) % 2) g.hline(0, y, W, 'floor2');
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
    g.rect(1, 36, 4, SKIRT_Y - 38, 'ink2');
    g.rect(5, 36, 2, SKIRT_Y - 38, 'wood2');
  }
  g.setId(0);
}

function stringLights(g, on, t) {
  g.setId(20);
  const bulbs = [];
  const SPANS = 4;
  for (let x = 6; x < W - 4; x += 1) {
    const p = (x - 6) / (W - 10);
    const sag = Math.sin(((p * SPANS) % 1) * Math.PI) * 7;
    const y = 3 + Math.round(sag);
    g.px(x, y, 'cable');
    if ((x - 6) % 12 === 6) bulbs.push([x, y + 1]);
  }
  bulbs.forEach(([x, y], i) => {
    const lit = on && Math.sin(t / 320 + i * 1.7) > -0.86;
    const c = lit ? 'bulb' : 'bulbOff';
    g.px(x, y, c);
    g.px(x - 1, y + 1, c);
    g.px(x, y + 1, c);
    g.px(x + 1, y + 1, c);
    g.px(x, y + 2, c);
  });
  g.setId(0);
}

/* ── the shelf: one plank, one row of books, trophies on top, medals off the end ── */

function shelf(g, sparkle, t) {
  const x = 8;
  const y = 36;
  const w = 58;

  // the plank
  g.setId(0);
  g.rect(x, y, w, 3, 'woodTop');
  g.rect(x, y + 3, w, 2, 'wood');
  g.hline(x, y + 5, w, 'wood3');
  g.rect(x + 4, y + 5, 2, 4, 'wood3');
  g.rect(x + w - 6, y + 5, 2, 4, 'wood3');

  // one row of books, standing on the left half of the plank
  g.setId(15);
  let cx = x + 3;
  const PAL = ['paper', 'cream', 'blue2', 'green2', 'red2', 'sand', 'purple2', 'teal', 'orange2'];
  for (let i = 0; i < 6 && cx < x + 30; i += 1) {
    const bw = 4 + (i % 3 === 0 ? 1 : 0);
    const bh = 20 - (i % 4);
    const top = y - bh;
    g.rect(cx, top, bw, bh, PAL[i % PAL.length]);
    g.rect(cx, top, bw, 1, 'ink2');
    g.rect(cx, top + 3, bw, 1, 'ink2');
    g.vline(cx + bw - 1, top, bh, 'ink2');
    cx += bw + 1;
  }
  // two leaning, because a shelf is never neat
  g.line(cx + 1, y - 14, cx + 5, y - 1, 'wood3');
  g.line(cx + 2, y - 14, cx + 6, y - 1, 'red3');
  g.line(cx + 3, y - 14, cx + 7, y - 1, 'red');
  g.setId(0);

  // the trophies stand on the right half, where no book reaches
  g.setId(13);
  g.rect(44, y - 15, 10, 6, 'gold');
  g.rect(45, y - 9, 8, 1, 'gold2');
  g.rect(47, y - 8, 3, 5, 'gold');
  g.rect(44, y - 3, 10, 3, 'gold2');
  g.px(42, y - 14, 'gold');
  g.px(42, y - 13, 'gold');
  g.px(55, y - 14, 'gold');
  g.px(55, y - 13, 'gold');
  g.rect(57, y - 11, 8, 8, 'wood3');
  g.rect(58, y - 10, 6, 6, 'gold2');
  g.hline(59, y - 8, 4, 'wood3');
  g.hline(59, y - 6, 4, 'wood3');
  if (sparkle) {
    const sp = Math.floor(t / 220) % 3;
    g.px(48 + sp, y - 19, 'white');
    g.px(61 - sp, y - 15, 'white');
  }
  g.setId(0);

  // medals, hanging off the end of the plank on their ribbons
  g.setId(14);
  [[52, 'red', 'blue'], [59, 'blue', 'green']].forEach(([mx, r1, r2], i) => {
    const swing = Math.round(Math.sin(t / 1400 + i * 2) * 1);
    g.rect(mx, y + 5, 2, 9, r1);
    g.rect(mx + 2, y + 5, 2, 9, r2);
    g.disc(mx + 1 + swing, y + 18, 4, 'gold');
    g.disc(mx + 1 + swing, y + 18, 2, 'gold2');
    g.px(mx + 1 + swing, y + 18, 'wood3');
  });
  g.setId(0);
}

/* ── posters ───────────────────────────────────────────────────────── */

function poster(g, id, x, y, which) {
  const w = 36;
  const h = 42;
  g.setId(id);
  g.rect(x - 1, y - 1, w + 2, h + 2, 'ink2');

  if (which === 0) {
    // Hollywood: a low gold sun, two figures, a car, a title band
    g.rect(x, y, w, h, 'poster1');
    g.rect(x, y, w, 14, 'orange2');
    g.disc(x + 25, y + 14, 7, 'yellow2');
    g.rect(x, y + 22, w, h - 22, 'orange');
    g.hline(x, y + 21, w, 'red3');
    g.rect(x + 9, y + 11, 4, 13, 'ink');
    g.rect(x + 8, y + 14, 6, 5, 'ink');
    g.px(x + 10, y + 10, 'ink');
    g.rect(x + 17, y + 13, 4, 11, 'ink');
    g.rect(x + 16, y + 15, 6, 4, 'ink');
    g.rect(x + 4, y + 29, 20, 4, 'ink2');
    g.rect(x + 8, y + 26, 10, 3, 'ink2');
    g.disc(x + 7, y + 33, 2, 'ink');
    g.disc(x + 21, y + 33, 2, 'ink');
    g.rect(x + 3, y + 37, 30, 2, 'cream');
    g.rect(x + 7, y + 40, 22, 1, 'cream');
  } else if (which === 1) {
    // Wasseypur: red field, one silhouette, hard type
    g.rect(x, y, w, h, 'poster2');
    g.rect(x, y, w, 8, 'red3');
    for (let i = 0; i < w; i += 3) g.px(x + i, y + 9, 'red3');
    g.rect(x + 14, y + 13, 9, 19, 'ink');
    g.rect(x + 15, y + 8, 7, 6, 'ink');
    g.rect(x + 11, y + 17, 3, 9, 'ink');
    g.rect(x + 23, y + 17, 3, 9, 'ink');
    g.px(x + 16, y + 10, 'skin2');
    g.px(x + 20, y + 10, 'skin2');
    g.rect(x + 4, y + 34, 28, 3, 'cream');
    g.rect(x + 4, y + 38, 18, 2, 'sand');
    g.px(x + 30, y + 14, 'yellow2');
  } else {
    // Dune: two ridges, a vast sun, two specks on the crest
    g.rect(x, y, w, h, 'poster3');
    g.rect(x, y, w, 20, 'sand');
    g.disc(x + 18, y + 12, 9, 'orange2');
    g.disc(x + 18, y + 12, 6, 'yellow2');
    for (let i = 0; i < w; i += 1) {
      const r1 = 24 + Math.round(Math.sin((i / w) * Math.PI * 1.6) * 4);
      g.rect(x + i, y + r1, 1, h - r1, 'wood2');
      g.px(x + i, y + r1, 'sand');
      const r2 = 32 + Math.round(Math.sin((i / w) * Math.PI * 2.2 + 1) * 3);
      g.rect(x + i, y + r2, 1, h - r2, 'wood3');
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
  const x = 216;
  const y = 14;
  const w = 58;
  const h = 56;
  g.setId(19);
  g.rect(x - 2, y - 2, w + 4, h + 4, 'wood3');
  for (let i = 0; i < h; i += 1) {
    const k = i / h;
    g.hline(x, y + i, w, k < 0.34 ? 'sky1' : k < 0.62 ? 'sky2' : 'sky3');
  }
  const sunY = y + 34 - Math.round(Math.sin(t / 4200) * 2);
  g.disc(x + 38, sunY, 6, 'sun');
  for (let i = 0; i < w; i += 1) {
    const hh = 42 + Math.round(Math.sin(i / 9) * 3 + Math.sin(i / 21) * 4);
    g.rect(x + i, y + hh, 1, h - hh, 'hill');
    const hh2 = 47 + Math.round(Math.sin(i / 13 + 2) * 3);
    g.rect(x + i, y + hh2, 1, h - hh2, 'hill2');
  }
  g.rect(x + Math.round(w / 2) - 1, y, 2, h, 'wood2');
  g.rect(x, y + Math.round(h / 2) - 1, w, 2, 'wood2');
  g.frame(x, y, w, h, 'wood2');
  const sash = open ? y - 1 : y + Math.round(h / 2) - 1;
  g.rect(x + 1, sash, w - 2, 3, 'wood3');
  g.px(x + Math.round(w / 2), sash + 1, 'metal2');

  g.setId(0);
  const pull = open ? 4 : 0;
  for (let i = 0; i < 9 - pull; i += 1) g.rect(x - 6 + i, y - 4, 1, h + 6, i % 2 ? 'cream' : 'sand');
  for (let i = 0; i < 9 - pull; i += 1) g.rect(x + w + 5 - i, y - 4, 1, h + 6, i % 2 ? 'cream' : 'sand');
  g.rect(x - 8, y - 6, w + 16, 2, 'wood3');
}

/* ── the desk ──────────────────────────────────────────────────────── */

function desk(g) {
  g.setId(0);
  g.rect(66, 98, 152, 3, 'woodTop');
  g.rect(66, 101, 152, 4, 'wood');
  g.hline(66, 104, 152, 'wood3');
  g.rect(70, 105, 4, 25, 'wood3');
  g.rect(210, 105, 4, 25, 'wood3');
  g.rect(70, 128, 144, 2, 'wood3');
}

/* A dark screen with a bezel. The Room component paints the real picture into SCREENS. */
function panel(g, x, y, w, h, on) {
  g.rect(x - 2, y - 3, w + 4, h + 6, 'ink2');
  g.rect(x - 1, y - 2, w + 2, h + 4, 'ink');
  g.rect(x, y, w, h, on ? 'screen2' : 'screen');
  if (!on) g.dither(x, y, w, h, 'screen', 'screen2');
}

function monitors(g, on) {
  const a = SCREENS.monitorA;
  const b = SCREENS.monitorB;
  g.setId(6);
  panel(g, a.x, a.y, a.w, a.h, on);
  g.rect(133, 92, 10, 6, 'grey3');
  g.rect(126, 97, 24, 2, 'grey3');
  g.px(a.x + a.w + 1, a.y + a.h + 1, on ? 'led' : 'ledRed');

  g.setId(7);
  panel(g, b.x, b.y, b.w, b.h, on);
  g.rect(171, 88, 6, 10, 'grey3');
  g.rect(166, 97, 16, 2, 'grey3');
  g.setId(0);
}

function laptop(g, on) {
  // moved to the right end of the desk
  g.setId(5);
  g.rect(188, 83, 26, 15, 'metal');
  g.rect(189, 84, 24, 13, 'ink');
  g.rect(190, 85, 22, 11, on ? 'screen2' : 'screen');
  if (on) {
    g.rect(191, 86, 20, 2, 'screenLit');
    for (let i = 0; i < 3; i += 1) g.rect(192, 90 + i * 2, 8 + i * 4, 1, i === 1 ? 'screenGrn' : 'screenTxt');
  }
  g.rect(186, 97, 30, 2, 'metal2');
  g.rect(186, 99, 30, 1, 'metal3');
  g.setId(0);
}

function lamp(g, on) {
  g.setId(1);
  g.rect(66, 92, 10, 6, 'metal3');
  g.rect(70, 62, 2, 31, 'metal');
  g.line(71, 62, 79, 57, 'metal');
  g.rect(77, 54, 14, 7, on ? 'lampOn' : 'lampOff');
  g.rect(78, 61, 12, 2, on ? 'bulb' : 'lampOff');
  g.frame(77, 54, 14, 7, 'metal3');
  g.setId(0);
}

function photo(g) {
  // moved to the left of the desk, under the lamp
  g.setId(3);
  g.rect(84, 80, 20, 18, 'wood2');
  g.rect(85, 81, 18, 16, 'paper');
  g.rect(86, 89, 18, 8, 'blue2');
  g.disc(89, 87, 2, 'skin');
  g.disc(94, 86, 2, 'skin');
  g.disc(99, 87, 2, 'skin');
  g.rect(87, 89, 5, 7, 'red2');
  g.rect(92, 88, 5, 8, 'cream');
  g.rect(97, 89, 5, 7, 'green2');
  g.rect(84, 97, 20, 2, 'wood3');
  g.setId(0);
}

function mug(g, steaming, t) {
  g.setId(4);
  g.rect(107, 89, 8, 9, 'red');
  g.rect(108, 90, 6, 2, steaming ? 'wood3' : 'ink2');
  g.px(115, 91, 'red');
  g.px(116, 92, 'red');
  g.px(115, 93, 'red');
  g.rect(107, 98, 8, 1, 'red3');
  if (steaming) {
    const s = Math.floor(t / 260) % 3;
    g.px(109 + s, 87 - s, 'grey2');
    g.px(112 - s, 86 - s, 'grey2');
  }
  g.setId(0);
}

function tower(g, on, t) {
  g.setId(8);
  g.rect(72, 104, 20, 28, 'grey3');
  g.rect(73, 105, 18, 26, 'ink2');
  g.rect(75, 107, 14, 3, 'grey3');
  g.rect(75, 112, 14, 2, 'grey3');
  g.px(88, 118, on ? 'led' : 'ledRed');
  g.px(88, 121, on ? 'screenGrn' : 'grey3');
  for (let y = 124; y < 130; y += 2) for (let x = 75; x < 89; x += 2) g.px(x, y, 'grey3');
  if (on && Math.sin(t / 700) > 0.4) g.px(88, 118, 'white');
  g.setId(0);
  g.line(82, 132, 88, 136, 'cable');
  g.line(88, 136, 118, 136, 'cable');
}

/* Games live on the floor beside the tower, where games live. */
function games(g) {
  g.setId(9);
  const CASE = ['purple2', 'blue2', 'orange2', 'red2'];
  GAMES.forEach((it, i) => {
    const y = 130 - (i + 1) * 4;
    g.rect(97, y, 20, 4, 'ink2');
    g.rect(98, y + 1, 18, 2, CASE[i % CASE.length]);
    g.px(114, y + 1, 'cream');
  });
  // one standing up against the stack
  g.rect(118, 114, 5, 16, 'ink2');
  g.rect(118, 115, 4, 14, 'green2');
  g.rect(119, 117, 2, 6, 'ink2');
  g.setId(0);
}

function chair(g) {
  g.setId(0);
  g.rect(124, 86, 30, 30, 'ink2');
  g.rect(126, 88, 26, 26, 'grey3');
  for (let y = 90; y < 113; y += 3) g.hline(127, y, 24, 'ink2');
  g.rect(126, 88, 26, 2, 'ink2');
  g.rect(121, 94, 3, 13, 'ink2');
  g.rect(154, 94, 3, 13, 'ink2');
  g.rect(122, 114, 34, 4, 'ink2');
  g.rect(137, 118, 4, 8, 'metal3');
  g.rect(128, 126, 22, 2, 'metal3');
  g.px(127, 128, 'ink');
  g.px(149, 128, 'ink');
}

/* ── the right corner ──────────────────────────────────────────────── */

function plant(g, grown, t, style) {
  g.setId(17);
  const sway = Math.round(Math.sin(t / 900));
  const sway2 = Math.round(Math.sin(t / 620 + 1));
  g.rect(219, 116, 18, 14, 'pot');
  g.rect(219, 116, 18, 3, 'wood2');
  g.rect(220, 130, 16, 2, 'wood3');
  g.rect(221, 119, 14, 2, 'floorDark');

  if (style === 'fern') {
    // arching fronds that breathe
    for (let f = 0; f < 5; f += 1) {
      const dir = f % 2 ? 1 : -1;
      const lean = dir * (2 + f);
      const top = 114 - (grown ? 24 : 17) + f;
      for (let k = 0; k < 18; k += 1) {
        const p = k / 18;
        const px = 228 + Math.round(lean * p * p) + (k > 10 ? sway * dir : 0);
        const py = 116 - Math.round(k * (grown ? 1.35 : 1));
        if (py < top) break;
        g.px(px, py, k > 12 ? 'leaf' : 'leaf2');
        if (k % 2 === 0 && k > 3) {
          g.px(px - 1, py, 'leaf2');
          g.px(px + 1, py, 'leaf2');
        }
      }
    }
  } else if (style === 'succulent') {
    // a tight rosette that turns very slowly toward the window
    const cx = 228 + sway;
    const cy = 110;
    for (let a = 0; a < 8; a += 1) {
      const ang = (a / 8) * Math.PI * 2 + t / 9000;
      const len = grown ? 7 : 5;
      for (let k = 1; k <= len; k += 1) {
        g.px(cx + Math.round(Math.cos(ang) * k), cy + Math.round((Math.sin(ang) * k) / 1.6), k > len - 2 ? 'leaf' : 'leaf2');
      }
    }
    g.disc(cx, cy, 2, 'leaf2');
  } else {
    // three stems with overlapping leaves — the default
    [[226, 0], [228, 3], [230, 1]].forEach(([sx, drop], si) => {
      const top = (grown ? 90 : 98) + drop;
      g.rect(sx, top, 1, 116 - top, 'green3');
      const leaves = (grown ? 5 : 4) - (si % 2);
      for (let i = 0; i < leaves; i += 1) {
        const y = top + 2 + i * 4;
        const dir = (i + si) % 2 ? 1 : -1;
        const len = 4 + ((i + si) % 3);
        for (let k = 1; k <= len; k += 1) {
          const px = sx + dir * k + (i % 2 ? sway : sway2);
          g.px(px, y + Math.round(k / 3), k > len - 2 ? 'leaf' : 'leaf2');
          if (k < len - 1) g.px(px, y + 1 + Math.round(k / 3), 'leaf2');
        }
      }
    });
  }
  g.setId(0);
}

function fridge(g, open, t) {
  const x = 240;
  const y = 80;
  const w = 48;
  const h = 74;
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

  const MTINT = ['orange', 'green', 'yellow', 'blue2', 'pink'];
  MAGNETS.forEach((m, i) => {
    const mx = x + 6 + (i % 3) * 13;
    const my = y + 5 + Math.floor(i / 3) * 12;
    const wob = i === Math.floor(t / 1100) % MAGNETS.length ? 1 : 0;
    const c = MTINT[i % MTINT.length];
    if (i % 2) {
      g.rect(mx, my - wob, 9, 8, c);
      g.rect(mx + 1, my + 1 - wob, 7, 6, 'cream');
      g.rect(mx + 2, my + 3 - wob, 5, 1, 'ink2');
      g.rect(mx + 2, my + 5 - wob, 3, 1, 'ink2');
    } else {
      g.disc(mx + 4, my + 3 - wob, 4, c);
      g.disc(mx + 4, my + 3 - wob, 2, 'cream');
      g.px(mx + 4, my + 3 - wob, 'ink2');
    }
  });
  g.rect(x + 28, y + 30, 16, 14, 'paper');
  g.rect(x + 29, y + 31, 14, 12, 'sky2');
  g.rect(x + 30, y + 38, 12, 5, 'hill');
  g.rect(x + 34, y + 28, 4, 3, 'yellow2');
  g.setId(0);
}

/* ── the floor ─────────────────────────────────────────────────────── */

function rug(g) {
  // a kilim: a border, a run of diamonds down the middle, and fringe at both ends
  g.setId(0);
  const x = 64;
  const y = 134;
  const w = 148;
  const h = 24;
  g.rect(x, y, w, h, 'rug');
  g.frame(x, y, w, h, 'rug3');
  g.rect(x + 2, y + 2, w - 4, 2, 'rug2');
  g.rect(x + 2, y + h - 4, w - 4, 2, 'rug2');
  for (let i = 0; i < w - 8; i += 4) {
    g.px(x + 4 + i, y + 3, 'rug4');
    g.px(x + 6 + i, y + h - 3, 'rug4');
  }
  for (let d = 0; d < 7; d += 1) {
    const cx = x + 14 + d * 20;
    const cy = y + Math.round(h / 2);
    for (let k = 0; k <= 4; k += 1) {
      g.px(cx - k, cy - 4 + k, 'rug4');
      g.px(cx + k, cy - 4 + k, 'rug4');
      g.px(cx - k, cy + 4 - k, 'rug4');
      g.px(cx + k, cy + 4 - k, 'rug4');
    }
    g.disc(cx, cy, 1, 'rug2');
  }
  for (let i = 0; i < w; i += 2) {
    g.px(x + i, y - 1, 'rug3');
    g.px(x + i, y + h, 'rug3');
  }
}

/* A real football: white panels with black pentagons, and a shadow that is a shadow. */
function ball(g, bounce) {
  g.setId(0);
  const sw = 16 - Math.round(bounce / 3);
  for (let i = 0; i < sw; i += 1) {
    const dx = 22 - Math.round(sw / 2) + i;
    g.px(dx, 155, 'floorDark');
    if (Math.abs(i - sw / 2) < sw / 3) g.px(dx, 156, 'floorDark');
  }
  g.setId(18);
  const by = 146 - bounce;
  g.disc(22, by, 9, 'ball');
  // the centre panel, flat-topped, the way a football actually reads at this size
  g.rect(19, by - 3, 7, 2, 'ballDark');
  g.rect(18, by - 1, 9, 2, 'ballDark');
  g.rect(19, by + 1, 7, 2, 'ballDark');
  g.px(20, by + 3, 'ballDark');
  g.px(24, by + 3, 'ballDark');
  // seams running out to the rim panels
  g.line(19, by - 3, 16, by - 6, 'ballDark');
  g.line(26, by - 3, 29, by - 6, 'ballDark');
  g.line(18, by + 1, 14, by + 3, 'ballDark');
  g.line(27, by + 1, 31, by + 3, 'ballDark');
  g.line(22, by + 4, 22, by + 8, 'ballDark');
  // three rim panels, so it curves away
  g.rect(15, by - 7, 3, 2, 'ballDark');
  g.rect(27, by - 7, 3, 2, 'ballDark');
  g.rect(20, by + 6, 4, 2, 'ballDark');
  // a highlight, so it is round and not a disc
  g.px(17, by - 4, 'white');
  g.px(18, by - 5, 'white');
  g.px(17, by - 5, 'white');

  // boots, laced
  [40, 54].forEach((bx) => {
    g.rect(bx, 149, 12, 5, 'boot');
    g.rect(bx + 1, 147, 10, 2, 'boot');
    g.rect(bx + 7, 144, 5, 4, 'boot');      // the ankle
    g.rect(bx + 7, 143, 5, 1, 'grey3');     // the cuff
    g.rect(bx, 154, 13, 2, 'bootSole');
    g.px(bx, 153, 'bootSole');
    for (let i = 0; i < 3; i += 1) g.px(bx + 8, 145 + i, 'cream');
    g.px(bx + 2, 150, 'cream');
    g.px(bx + 4, 150, 'cream');
  });
  g.setId(0);
}

function person(g, mode, frame, x) {
  g.setId(2);
  if (mode === 'walk') g.sprite(x, 98, WALK[frame % WALK.length], LEGEND);
  else if (mode === 'stand') g.sprite(x, 98, STAND, LEGEND);
  else if (mode === 'lean') g.sprite(130, 64, LEAN, LEGEND);
  else g.sprite(130, 64, mode === 'wave' ? WAVE : SIT, LEGEND);
  g.setId(0);
}

/* ── the whole thing ───────────────────────────────────────────────── */

export function drawScene(grid, state) {
  const g = painter(grid);
  const t = state.t || 0;
  shell(g);
  door(g, state.doorOpen);
  stringLights(g, state.string, t);
  shelf(g, state.sparkle, t);
  POSTERS.forEach((p, i) => poster(g, 10 + i, 74 + i * 42, 10, i));
  windowUnit(g, state.windowOpen, t);
  plant(g, state.grown, t, state.plantStyle);
  fridge(g, state.fridgeOpen, t);
  rug(g);
  ball(g, state.bounce || 0);
  desk(g);
  monitors(g, state.pc);
  laptop(g, state.pc);
  lamp(g, state.lamp);
  tower(g, state.pc, t);
  games(g);
  chair(g);
  photo(g);
  mug(g, !state.cold, t);
  person(g, state.mode, state.frame, state.walkX);
  return grid;
}

export { W, H };
