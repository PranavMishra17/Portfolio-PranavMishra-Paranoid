// v19 — the room, rebuilt.
//
// What was wrong: the screens stood in front of the chair, the chair stood behind a man who was
// standing in front of it, and the posters were up where the viewport crop ate them. So the
// whole thing is re-laid-out around two rules.
//
// One: depth is the draw order, and the draw order is the truth. You are behind him. Nearest to
// you is the chair, then him, then the desk with everything on it, then the wall. That is why
// the chair back covers his back and only his head and shoulders clear it, and why the mug and
// the photograph sit beside the screens rather than through them.
//
// Two: the middle of the room is the middle of the picture. The three posters are centred on the
// wall, the two screens are centred under them with the gap between them over his head, and the
// things that can afford to be cropped — curtain, shelf edge, floor — are at the sides.
//
// Room is 288 × 144. The floor is at 110; the desk surface at 84.

import { painter, createGrid, W, ROOM_H as H, ROOF } from './engine';
import { BOOKS, POSTERS } from '../personal';

const FLOOR_Y = 110; // low enough that the wall under the desk can carry the party button
const DESK_Y = 84;

/* The rectangles the Room component paints real, pixelated images into. */
export const SCREENS = {
  monitorA: { x: 96, y: 58, w: 34, h: 20 },
  monitorB: { x: 158, y: 58, w: 34, h: 20 },
};


/* Hit-test order: first match wins, so what is nearest to you comes first. */
export const HOTSPOTS = [
  { id: 2, key: 'chair', label: 'The chair', kind: 'hand', x: 118, y: 68, w: 52, h: 48 },
  { id: 4, key: 'mug', label: 'Coffee', kind: 'hand', x: 195, y: 72, w: 14, h: 14 },
  { id: 24, key: 'chess', label: 'Chess', kind: 'zoom', x: 79, y: 68, w: 16, h: 17 },
  { id: 5, key: 'laptop', label: 'Where I have worked', kind: 'zoom', x: 208, y: 56, w: 38, h: 30 },
  { id: 1, key: 'lamp', label: 'The lamp', kind: 'hand', x: 50, y: 32, w: 36, h: 16 },
  { id: 6, key: 'monitorA', label: 'Everything I have built', kind: 'zoom', x: 92, y: 54, w: 42, h: 30 },
  { id: 7, key: 'monitorB', label: 'Two papers', kind: 'zoom', x: 154, y: 54, w: 42, h: 30 },
  { id: 8, key: 'pc', label: 'The tower', kind: 'hand', x: 50, y: 86, w: 28, h: 34 },
  { id: 9, key: 'games', label: 'Gaming console', kind: 'zoom', x: 80, y: 92, w: 32, h: 32 },
  // 28 by 42: the three pictures are all two by three, so the frame is too, and nothing is cropped
  { id: 10, key: 'poster1', label: POSTERS[0].title, kind: 'zoom', x: 85, y: 6, w: 28, h: 42 },
  { id: 11, key: 'poster2', label: POSTERS[1].title, kind: 'zoom', x: 125, y: 6, w: 28, h: 42 },
  { id: 12, key: 'poster3', label: POSTERS[2].title, kind: 'zoom', x: 165, y: 6, w: 28, h: 42 },
  { id: 13, key: 'trophies', label: 'MIT XR 2024 and HINT 5.0', kind: 'zoom', x: 38, y: 36, w: 24, h: 20 },
  { id: 14, key: 'medals', label: 'Medals', kind: 'zoom', x: 40, y: 56, w: 20, h: 18 },
  { id: 15, key: 'books', label: 'Books', kind: 'zoom', x: 6, y: 32, w: 32, h: 24 },
  { id: 21, key: 'clock', label: 'The clock', kind: 'zoom', x: 20, y: 12, w: 20, h: 20 },
  { id: 18, key: 'ball', label: 'Football and boots', kind: 'hand', x: 8, y: 104, w: 70, h: 22 },
  { id: 23, key: 'disco', label: 'A button', kind: 'hand', x: 192, y: 90, w: 17, h: 17 },
  { id: 19, key: 'window', label: 'The window', kind: 'hand', x: 208, y: -2, w: 64, h: 46 },
  { id: 20, key: 'lights', label: 'String lights', kind: 'hand', x: 4, y: -7, w: 280, h: 12 },
];

// the party button: on the wall under the right of the desk, across the chair from the console,
// in a small case with a glass front
export const BUTTON = { x: 200, y: 98, r: 3 };

/* On a phone held upright the room is walked along from its middle, so what has to be seen goes
   there: the right screen is a stack of books. */
const PHONE_SPOTS = {
  monitorB: { id: 25, key: 'books', label: 'Books', kind: 'zoom', x: 152, y: 62, w: 31, h: 22 },
};
export function hotspotsFor(phone) {
  if (!phone) return HOTSPOTS;
  return HOTSPOTS.map((h) => PHONE_SPOTS[h.key] || h);
}

export const LIGHTS = {
  lamp: { x: 68, y: 52, r: 78, warm: 1, strength: 0.95 },
  screens: { x: 144, y: 66, r: 70, warm: 0.15, strength: 0.7 },
  string: [
    { x: 36, y: 0, r: 46, warm: 1, strength: 0.5 },
    { x: 108, y: 3, r: 46, warm: 1, strength: 0.5 },
    { x: 180, y: 3, r: 46, warm: 1, strength: 0.5 },
    { x: 252, y: 0, r: 46, warm: 1, strength: 0.5 },
  ],
};

/* ── the shell ─────────────────────────────────────────────────────── */

function shell(g) {
  g.setId(0);
  // the roof band: a ceiling line, then wall, above everything that matters
  g.rect(0, -ROOF, W, ROOF, 'wallLit');
  g.hline(0, -ROOF, W, 'wallDim');
  g.hline(0, -ROOF + 1, W, 'wallDim');
  g.hline(0, -ROOF + 2, W, 'wall');
  for (let y = 0; y < FLOOR_Y; y += 1) {
    const k = y / FLOOR_Y;
    const c = k < 0.22 ? 'wallLit' : k < 0.42 ? ((y * 7) % 5 < 2 ? 'wallLit' : 'wall') : 'wall';
    g.hline(0, y, W, c);
  }
  // light off the window on the right; the shelf corner on the left a touch dimmer
  for (let x = 170; x < W; x += 1) {
    const k = (x - 170) / (W - 170);
    for (let y = -ROOF + 3; y < FLOOR_Y - 4; y += 1) {
      if (k > 0.7) g.px(x, y, 'wallLit');
      else if (k > 0.3 && (x * 3 + y * 5) % 7 === 0) g.px(x, y, 'wallLit');
    }
  }
  for (let x = 0; x < 40; x += 1) {
    const k = 1 - x / 40;
    for (let y = 14; y < FLOOR_Y - 4; y += 1) {
      if (k > 0.8) g.px(x, y, 'wallDim');
      else if (k > 0.35 && (x * 3 + y * 5) % 7 === 0) g.px(x, y, 'wallDim');
    }
  }
  g.rect(0, FLOOR_Y - 4, W, 4, 'skirt');
  g.hline(0, FLOOR_Y - 4, W, 'wallDim');

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

// the string lights hang a little above the posters, level with the top of the window frame,
// so a wide screen that crops the roof band still shows them
const LIGHT_Y = -4;

function stringLights(g, on, t) {
  g.setId(20);
  const bulbs = [];
  const SPANS = 4;
  for (let x = 4; x < W - 2; x += 1) {
    const p = (x - 4) / (W - 6);
    const sag = Math.sin(((p * SPANS) % 1) * Math.PI) * 4;
    const y = LIGHT_Y + Math.round(sag);
    g.px(x, y, 'cable');
    if ((x - 4) % 12 === 6) bulbs.push([x, y + 1]);
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

/* ── the left wall: one shelf, books, what he won ──────────────────── */

function shelf(g, sparkle, t) {
  const x = 6;
  const y = 54;
  const w = 56;

  g.setId(0);
  g.rect(x, y, w, 3, 'woodTop');
  g.rect(x, y + 3, w, 2, 'wood');
  g.hline(x, y + 5, w, 'wood3');
  g.rect(x + 3, y + 5, 2, 4, 'wood3');
  g.rect(x + w - 5, y + 5, 2, 4, 'wood3');

  // books, standing on it
  g.setId(15);
  let cx = x + 3;
  const SPINE = ['sand', 'blue2', 'green2', 'red2', 'cream', 'purple2'];
  BOOKS.concat(BOOKS.slice(0, 1)).slice(0, 6).forEach((b, i) => {
    const bw = 4 + (i % 3 === 0 ? 1 : 0);
    const bh = 18 - (i % 4) * 2;
    const top = y - bh;
    g.rect(cx, top, bw, bh, SPINE[i % SPINE.length]);
    g.rect(cx, top, bw, 1, 'ink2');
    g.rect(cx, top + 3, bw, 1, 'ink2');
    g.vline(cx + bw - 1, top, bh, 'ink2');
    cx += bw + 1;
  });
  // one leaning against the rest
  g.line(cx + 1, y - 12, cx + 4, y - 1, 'wood3');
  g.line(cx + 2, y - 12, cx + 5, y - 1, 'red3');
  g.setId(0);

  // the two trophies, to the right of the books
  g.setId(13);
  g.rect(40, y - 14, 9, 6, 'gold');
  g.rect(41, y - 8, 7, 1, 'gold2');
  g.rect(43, y - 7, 3, 4, 'gold');
  g.rect(40, y - 3, 9, 3, 'gold2');
  g.px(38, y - 13, 'gold');
  g.px(38, y - 12, 'gold');
  g.px(50, y - 13, 'gold');
  g.px(50, y - 12, 'gold');
  g.rect(52, y - 11, 9, 8, 'wood3');
  g.rect(53, y - 10, 7, 6, 'gold2');
  g.hline(54, y - 8, 5, 'wood3');
  g.hline(54, y - 6, 5, 'wood3');
  if (sparkle) {
    const sp = Math.floor(t / 220) % 3;
    g.px(44 + sp, y - 18, 'white');
    g.px(57 - sp, y - 14, 'white');
  }
  g.setId(0);

  // medals, hanging off the underside
  g.setId(14);
  [[42, 'red', 'blue'], [50, 'blue', 'green']].forEach(([mx, r1, r2], i) => {
    const swing = Math.round(Math.sin(t / 1400 + i * 2));
    g.rect(mx, y + 5, 2, 8, r1);
    g.rect(mx + 2, y + 5, 2, 8, r2);
    g.disc(mx + 1 + swing, y + 16, 3, 'gold');
    g.disc(mx + 1 + swing, y + 16, 1, 'gold2');
  });
  g.setId(0);
}

/* ── posters, centred on the wall ──────────────────────────────────── */

function poster(g, id, x, y, which) {
  const w = 28;
  const h = 42;
  g.setId(id);
  g.rect(x - 1, y - 1, w + 2, h + 2, 'ink2');
  if (which === 0) {
    g.rect(x, y, w, h, 'poster1');
    g.rect(x, y, w, 11, 'orange2');
    g.disc(x + 20, y + 11, 5, 'yellow2');
    g.rect(x, y + 17, w, h - 17, 'orange');
    g.hline(x, y + 16, w, 'red3');
    g.rect(x + 7, y + 8, 3, 10, 'ink');
    g.rect(x + 6, y + 10, 5, 4, 'ink');
    g.rect(x + 14, y + 9, 3, 9, 'ink');
    g.rect(x + 13, y + 11, 5, 3, 'ink');
    g.rect(x + 4, y + 23, 16, 3, 'ink2');
    g.rect(x + 8, y + 21, 8, 2, 'ink2');
    g.rect(x + 3, y + 28, 24, 2, 'cream');
  } else if (which === 1) {
    g.rect(x, y, w, h, 'poster2');
    g.rect(x, y, w, 7, 'red3');
    g.rect(x + 12, y + 10, 7, 15, 'ink');
    g.rect(x + 13, y + 7, 5, 4, 'ink');
    g.rect(x + 9, y + 13, 3, 8, 'ink');
    g.rect(x + 19, y + 13, 3, 8, 'ink');
    g.rect(x + 4, y + 26, 22, 2, 'cream');
    g.rect(x + 4, y + 29, 14, 1, 'sand');
  } else {
    g.rect(x, y, w, h, 'poster3');
    g.rect(x, y, w, 15, 'sand');
    g.disc(x + 15, y + 9, 6, 'orange2');
    g.disc(x + 15, y + 9, 4, 'yellow2');
    for (let i = 0; i < w; i += 1) {
      const r1 = 18 + Math.round(Math.sin((i / w) * Math.PI * 1.6) * 3);
      g.rect(x + i, y + r1, 1, h - r1, 'wood2');
      const r2 = 24 + Math.round(Math.sin((i / w) * Math.PI * 2.2 + 1) * 2);
      g.rect(x + i, y + r2, 1, h - r2, 'wood3');
    }
    g.px(x + 10, y + 17, 'ink');
    g.px(x + 12, y + 18, 'ink');
    g.rect(x + 5, y + 28, 20, 2, 'cream');
  }
  g.setId(0);
}

/* ── the window, which opens ───────────────────────────────────────── */

function windowUnit(g, openT, t, night) {
  const x = 212;
  const y = 2;
  const w = 54;
  const h = 40;
  const e = openT < 0.5 ? 2 * openT * openT : 1 - (-2 * openT + 2) ** 2 / 2;
  g.setId(19);
  g.rect(x - 2, y - 2, w + 4, h + 4, 'wood3');
  for (let i = 0; i < h; i += 1) {
    const k = i / h;
    g.hline(x, y + i, w, k < 0.34 ? 'sky1' : k < 0.62 ? 'sky2' : 'sky3');
  }
  const sunY = y + 22 - Math.round(Math.sin(t / 4200) * 2);
  if (night) {
    // a crescent moon, and three stars
    g.disc(x + 38, sunY, 5, 'sun');
    g.disc(x + 41, sunY - 1, 4, 'sky1');
    g.px(x + 12, y + 6, 'white');
    g.px(x + 22, y + 11, 'white');
    g.px(x + 47, y + 4, 'white');
  } else {
    g.disc(x + 38, sunY, 5, 'sun');
  }
  for (let i = 0; i < w; i += 1) {
    const hh = 28 + Math.round(Math.sin(i / 9) * 3 + Math.sin(i / 21) * 4);
    g.rect(x + i, y + hh, 1, h - hh, 'hill');
    const hh2 = 33 + Math.round(Math.sin(i / 13 + 2) * 3);
    g.rect(x + i, y + hh2, 1, h - hh2, 'hill2');
  }
  g.rect(x + Math.round(w / 2) - 1, y, 2, h, 'wood2');
  g.frame(x, y, w, h, 'wood2');
  // the lower sash rises; the fixed upper rail stays
  g.rect(x, y + Math.round(h / 2) - 1, w, 2, 'wood2');
  const sashY = Math.round(y + h / 2 - 1 - e * (h / 2 - 2));
  g.rect(x + 1, sashY, w - 2, 3, 'wood3');
  g.px(x + Math.round(w / 2), sashY + 1, 'metal2');
  g.rect(x + 1, sashY + 3, 1, y + h - 1 - (sashY + 3), 'wood2');
  g.rect(x + w - 2, sashY + 3, 1, y + h - 1 - (sashY + 3), 'wood2');
  if (e > 0.05) {
    const lift = Math.round(Math.sin(t / 380) * 2 * e);
    g.px(x + 3, sashY + 5 + lift, 'cream');
    g.px(x + 4, sashY + 6 + lift, 'cream');
  }

  g.setId(0);
  const pull = Math.round(e * 3);
  for (let i = 0; i < 5 - pull; i += 1) g.rect(x - 3 + i, y - 4, 1, h + 6, i % 2 ? 'cream' : 'sand');
  for (let i = 0; i < 7 - pull; i += 1) g.rect(x + w + 4 - i, y - 4, 1, h + 6, i % 2 ? 'cream' : 'sand');
  g.rect(x - 4, y - 6, w + 11, 2, 'wood3');
}

/* ── the desk and what stands on it ────────────────────────────────── */

function desk(g) {
  g.setId(0);
  g.rect(46, DESK_Y, 200, 3, 'woodTop');
  g.rect(46, DESK_Y + 3, 200, 4, 'wood');
  g.hline(46, DESK_Y + 7, 200, 'wood3');
  g.rect(50, DESK_Y + 7, 4, 26, 'wood3');
  g.rect(238, DESK_Y + 7, 4, 26, 'wood3');
  g.rect(50, DESK_Y + 31, 192, 2, 'wood3');
}

function panel(g, x, y, w, h, on) {
  g.rect(x - 2, y - 3, w + 4, h + 6, 'ink2');
  g.rect(x - 1, y - 2, w + 2, h + 4, 'ink');
  g.rect(x, y, w, h, on ? 'screen2' : 'screen');
  if (!on) g.dither(x, y, w, h, 'screen', 'screen2');
}

function monitors(g, on, phone) {
  const a = SCREENS.monitorA;
  const b = SCREENS.monitorB;
  g.setId(6);
  panel(g, a.x, a.y, a.w, a.h, on);
  g.rect(a.x + 14, a.y + a.h + 4, 7, 4, 'grey3');
  g.rect(a.x + 7, a.y + a.h + 8, 21, 2, 'grey3');
  g.px(a.x + a.w + 1, a.y + a.h + 1, on ? 'led' : 'ledRed');
  g.setId(0);
  if (phone) return;
  g.setId(7);
  panel(g, b.x, b.y, b.w, b.h, on);
  g.rect(b.x + 14, b.y + b.h + 4, 7, 4, 'grey3');
  g.rect(b.x + 7, b.y + b.h + 8, 21, 2, 'grey3');
  g.px(b.x + b.w + 1, b.y + b.h + 1, on ? 'led' : 'ledRed');
  g.setId(0);
}

function laptop(g, on) {
  g.setId(5);
  g.rect(210, 58, 34, 24, 'metal');
  g.rect(211, 59, 32, 22, 'ink');
  g.rect(212, 60, 30, 20, on ? 'screen2' : 'screen');
  if (on) {
    g.rect(213, 61, 28, 2, 'screenLit');
    for (let i = 0; i < 6; i += 1) g.rect(214, 65 + i * 2, 8 + ((i * 5) % 17), 1, i === 2 ? 'screenGrn' : 'screenTxt');
  }
  g.rect(208, 81, 38, 2, 'metal2');
  g.rect(208, 83, 38, 1, 'metal3');
  g.setId(0);
}

function lamp(g, on) {
  g.setId(1);
  g.rect(62, 78, 12, 6, 'metal3');
  g.rect(67, 46, 2, 33, 'metal');
  g.line(68, 46, 74, 42, 'metal');
  g.rect(62, 34, 18, 9, on ? 'lampOn' : 'lampOff');
  g.rect(63, 43, 16, 2, on ? 'bulb' : 'lampOff');
  g.frame(62, 34, 18, 9, 'metal3');
  g.setId(0);
}

function mug(g, steaming, t) {
  g.setId(4);
  g.rect(196, 76, 8, 8, 'red');
  g.rect(197, 77, 6, 2, steaming ? 'wood3' : 'ink2');
  g.px(204, 78, 'red');
  g.px(205, 79, 'red');
  g.px(204, 80, 'red');
  g.rect(196, 84, 8, 1, 'red3');
  if (steaming) {
    const s = Math.floor(t / 260) % 3;
    g.px(198 + s, 74 - s, 'grey2');
    g.px(201 - s, 73 - s, 'grey2');
  }
  g.setId(0);
}

function tower(g, on, t) {
  g.setId(8);
  g.rect(52, 88, 24, 30, 'grey3');
  g.rect(53, 89, 22, 28, 'ink2');
  g.rect(56, 92, 16, 3, 'grey3');
  g.rect(56, 97, 16, 2, 'grey3');
  g.px(71, 104, on ? 'led' : 'ledRed');
  g.px(71, 107, on ? 'screenGrn' : 'grey3');
  for (let y = 110; y < 116; y += 2) for (let x = 56; x < 72; x += 2) g.px(x, y, 'grey3');
  if (on && Math.sin(t / 700) > 0.4) g.px(71, 104, 'white');
  g.setId(0);
  // the cable, away behind it to the wall
  g.line(56, 116, 49, 118, 'cable');
}

// a games console standing on the floor, white wings round a black core, and its two controllers
function games(g) {
  g.setId(9);
  g.rect(82, 117, 13, 1, 'ink2');
  g.rect(83, 94, 3, 23, 'white');
  g.px(83, 94, 'wallDim');
  g.rect(86, 96, 4, 21, 'ink');
  g.rect(87, 97, 2, 1, 'blue2');
  g.rect(90, 94, 3, 23, 'white');
  g.px(92, 94, 'wallDim');
  g.vline(86, 99, 15, 'ink2');
  // the controllers: white, a black middle, two grips; one lying in front of the other
  [[96, 113], [99, 118]].forEach(([cx, cy]) => {
    g.rect(cx, cy, 11, 3, 'white');
    g.rect(cx + 4, cy, 3, 2, 'ink');
    g.px(cx + 1, cy + 3, 'white');
    g.px(cx + 2, cy + 3, 'white');
    g.px(cx + 8, cy + 3, 'white');
    g.px(cx + 9, cy + 3, 'white');
    g.px(cx + 2, cy + 1, 'grey3');
    g.px(cx + 8, cy + 1, 'blue2');
    g.hline(cx, cy + 4, 11, 'floorDark');
  });
  g.setId(0);
}

// a king and a knight standing together: a brown king, a black knight, a little taller than a
// mug so they read against the wall
function chess(g, x, y) {
  g.setId(24);
  // the king: base, body, collar, cross
  g.rect(x, y - 2, 6, 2, 'wood3');
  g.rect(x + 1, y - 3, 4, 1, 'wood');
  g.rect(x + 1, y - 9, 4, 6, 'wood');
  g.vline(x + 4, y - 9, 6, 'wood3');
  g.rect(x, y - 10, 6, 1, 'wood3');
  g.rect(x + 1, y - 11, 4, 1, 'wood');
  g.vline(x + 2, y - 14, 3, 'wood3');
  g.hline(x + 1, y - 13, 3, 'wood3');
  // the knight: base, neck, head looking left, ear, eye
  const k = x + 7;
  g.rect(k, y - 2, 7, 2, 'ink');
  g.rect(k + 1, y - 7, 5, 5, 'ink');
  g.rect(k + 2, y - 10, 4, 3, 'ink');
  g.rect(k, y - 10, 2, 2, 'ink');
  g.px(k + 5, y - 11, 'ink');
  g.px(k + 3, y - 9, 'grey3');
  g.setId(0);
}

// the phone's right screen: books standing on the desk, spines out, one leaning. The chess stays
// where it is on the desk, between the lamp and the left screen
function bookStack(g) {
  g.setId(25);
  const SPINE = ['blue2', 'red2', 'sand', 'green2', 'purple2', 'orange2'];
  let bx = 154;
  [[5, 19], [4, 16], [6, 20], [4, 17], [5, 15], [4, 18]].forEach(([bw, bh], i) => {
    const top = DESK_Y - bh;
    g.rect(bx, top, bw, bh, SPINE[i]);
    g.hline(bx, top, bw, 'ink2');
    g.hline(bx, top + 3, bw, 'cream');
    g.hline(bx, top + bh - 4, bw, 'cream');
    g.vline(bx + bw - 1, top, bh, 'ink2');
    bx += bw + 1;
  });
  // one leaning against the rest
  g.line(bx + 1, DESK_Y - 14, bx + 5, DESK_Y - 1, 'wood3');
  g.line(bx + 2, DESK_Y - 14, bx + 6, DESK_Y - 1, 'red3');
  g.setId(0);
}

/* ── him, and the chair he is inside ───────────────────────────────── */

/* The chair, empty, and it spins when you click it. `angle` is where it has turned to: at zero
   its back is to you; a quarter turn on and it is side-on; half way round and you see the seat. */
function chair(g, angle) {
  g.setId(2);
  const c = Math.cos(angle || 0);
  const k = Math.abs(c);
  const cx = 144;
  const bw = Math.max(6, Math.round(36 * k));   // the back, foreshortened
  const aw = Math.round(24 * k);                 // where the arms sit
  // the base, which does not turn
  g.rect(140, 102, 7, 10, 'metal3');
  g.rect(126, 112, 36, 3, 'metal3');
  g.px(124, 115, 'ink');
  g.px(163, 115, 'ink');
  if (c >= 0) {
    // the back is toward you
    g.rect(118 + (24 - aw), 86, 8, 12, 'ink2');
    g.rect(162 - (24 - aw), 86, 8, 12, 'ink2');
    g.rect(120 + (24 - aw), 98, 48 - 2 * (24 - aw), 4, 'ink2');
    g.rect(cx - Math.round(bw / 2), 72, bw, 34, 'ink2');
    if (bw > 8) {
      g.rect(cx - Math.round(bw / 2) + 2, 74, bw - 4, 30, 'grey3');
      for (let y = 78; y < 102; y += 4) g.hline(cx - Math.round(bw / 2) + 3, y, bw - 6, 'ink2');
    }
    const hw = Math.max(4, Math.round(26 * k));
    g.rect(cx - Math.round(hw / 2), 68, hw, 6, 'ink2');
    if (hw > 6) g.rect(cx - Math.round(hw / 2) + 2, 69, hw - 4, 4, 'grey3');
  } else {
    // it has turned to face you: the seat, the front of the back, the cushion
    const sw = Math.max(8, Math.round(48 * k));
    g.rect(cx - Math.round(sw / 2), 96, sw, 8, 'ink2');
    g.rect(cx - Math.round(sw / 2) + 2, 97, sw - 4, 5, 'grey3');
    g.rect(cx - Math.round(bw / 2), 72, bw, 26, 'ink2');
    if (bw > 8) {
      g.rect(cx - Math.round(bw / 2) + 2, 74, bw - 4, 22, 'grey2');
      g.rect(cx - Math.round(bw / 2) + 4, 77, bw - 8, 3, 'grey3');
    }
    const hw = Math.max(4, Math.round(26 * k));
    g.rect(cx - Math.round(hw / 2), 68, hw, 6, 'ink2');
    g.rect(118 + (24 - aw), 88, 8, 10, 'ink2');
    g.rect(162 - (24 - aw), 88, 8, 10, 'ink2');
  }
  g.setId(0);
}

/* ── the right corner and the floor ────────────────────────────────── */

/* The clock on the wall keeps the real time. */
function clock(g, hour) {
  g.setId(21);
  const cx = 30;
  const cy = 22;
  g.disc(cx, cy, 8, 'ink2');
  g.disc(cx, cy, 7, 'cream');
  [[0, -5], [5, 0], [0, 5], [-5, 0]].forEach(([dx, dy]) => g.px(cx + dx, cy + dy, 'ink2'));
  const hm = ((hour % 12) / 12) * Math.PI * 2 - Math.PI / 2;
  const mm = ((hour % 1)) * Math.PI * 2 - Math.PI / 2;
  g.line(cx, cy, cx + Math.round(Math.cos(hm) * 3), cy + Math.round(Math.sin(hm) * 3), 'ink');
  g.line(cx, cy, cx + Math.round(Math.cos(mm) * 5), cy + Math.round(Math.sin(mm) * 5), 'ink');
  g.px(cx, cy, 'red');
  g.setId(0);
}

function rug(g) {
  g.setId(0);
  const x = 40;
  const y = 113;
  const w = 210;
  const h = 16; // the floor is lower now; the rug still ends at the bottom of the room
  g.rect(x, y, w, h, 'rug');
  g.frame(x, y, w, h, 'rug3');
  g.rect(x + 2, y + 2, w - 4, 2, 'rug2');
  g.rect(x + 2, y + h - 4, w - 4, 2, 'rug2');
  for (let i = 0; i < w - 8; i += 4) {
    g.px(x + 4 + i, y + 3, 'rug4');
    g.px(x + 6 + i, y + h - 3, 'rug4');
  }
  for (let d = 0; d < 9; d += 1) {
    const cx = x + 16 + d * 22;
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

function ball(g, bounce) {
  g.setId(0);
  const sw = 14 - Math.round(bounce / 3);
  for (let i = 0; i < sw; i += 1) {
    const dx = 20 - Math.round(sw / 2) + i;
    g.px(dx, 123, 'floorDark');
    if (Math.abs(i - sw / 2) < sw / 3) g.px(dx, 124, 'floorDark');
  }
  g.setId(18);
  const cx = 20;
  const by = 115 - bounce;
  g.disc(cx, by, 8, 'ball');
  // the shade on the underside, and the panels: one in the middle, five around it
  for (let yy = 4; yy <= 8; yy += 1) for (let xx = -6; xx <= 6; xx += 1) if (xx * xx + yy * yy <= 64 && (xx + yy) % 2 === 0) g.px(cx + xx, by + yy, 'grey2');
  g.rect(cx - 2, by - 2, 4, 3, 'ballDark');
  g.px(cx - 1, by - 3, 'ballDark');
  g.px(cx, by - 3, 'ballDark');
  g.rect(cx - 6, by - 5, 2, 2, 'ballDark');
  g.rect(cx + 4, by - 5, 2, 2, 'ballDark');
  g.rect(cx - 7, by + 1, 2, 2, 'ballDark');
  g.rect(cx + 5, by + 1, 2, 2, 'ballDark');
  g.rect(cx - 1, by + 5, 3, 2, 'ballDark');
  g.line(cx - 2, by - 2, cx - 5, by - 4, 'ballDark');
  g.line(cx + 1, by - 2, cx + 4, by - 4, 'ballDark');
  g.line(cx - 2, by, cx - 6, by + 1, 'ballDark');
  g.line(cx + 1, by, cx + 5, by + 1, 'ballDark');
  g.line(cx, by + 1, cx, by + 5, 'ballDark');
  g.px(cx - 4, by - 6, 'white');
  g.px(cx - 5, by - 5, 'white');
  g.px(cx - 3, by - 7, 'white');

  // the boots: a toe, a tongue, laces, a sole with studs
  [40, 55].forEach((bx, i) => {
    const flip = i === 1;
    const heelX = flip ? bx + 9 : bx;
    const toeX = flip ? bx : bx + 8;
    g.rect(bx, 117, 13, 6, 'boot');
    g.rect(heelX, 112, 5, 6, 'boot');
    g.rect(heelX + (flip ? -1 : 0), 111, 6, 1, 'grey3'); // the collar
    g.rect(toeX, 119, 5, 4, 'boot');
    g.px(toeX + (flip ? 0 : 4), 118, 'boot');
    g.rect(heelX + (flip ? -2 : 4), 114, 3, 2, 'cream'); // the tongue
    g.px(heelX + (flip ? -1 : 5), 116, 'cream'); // laces
    g.px(heelX + (flip ? -2 : 6), 117, 'cream');
    g.px(bx + 2, 120, 'grey3'); // the stripe
    g.px(bx + 4, 120, 'grey3');
    g.rect(bx, 123, 13, 1, 'bootSole');
    g.px(bx + 2, 124, 'bootSole'); // studs
    g.px(bx + 6, 124, 'bootSole');
    g.px(bx + 10, 124, 'bootSole');
  });
  g.setId(0);
}

/* ── the right corner: a bin, and what it was standing in front of ──── */

// the party button, in a case on the floor with a glass front. The round glossy button itself is
// a DOM element Room lays over this spot, so it can be a true circle; the pixels under it are a
// fallback. The first press breaks the glass and the pieces fall to the floor; after that it is
// the button. Glitter while the disco is on.
const CASE = { x: 194, y: 92, w: 13, h: 13 };
// where each piece of glass starts on the front, and how far it falls and slides on the floor
const SHARDS = [[2, 2, -4, 22], [6, 1, -1, 23], [10, 3, 4, 22], [3, 8, -5, 24], [8, 9, 2, 24], [11, 10, 6, 23]];
function button(g, on, broken, brokeAt, t) {
  const { x, y } = BUTTON;
  const c = CASE;
  g.setId(23);
  // the case: a dark frame round a plate, half again the button's size
  g.rect(c.x, c.y, c.w, c.h, 'ink2');
  g.rect(c.x + 1, c.y + 1, c.w - 2, c.h - 2, 'grey2');
  for (let i = 1; i < c.w - 1; i += 1) g.px(c.x + i, c.y + c.h - 2, Math.floor(i / 2) % 2 ? 'yellow' : 'ink');
  g.disc(x, y, 2, on ? 'ledRed' : 'red');
  g.px(x - 1, y - 1, on ? 'pink' : 'red2');
  g.px(x, y + 1, 'red3');
  if (!broken) {
    // the glass: a sheen and a glint across the front
    for (let yy = c.y + 1; yy < c.y + c.h - 2; yy += 1) {
      for (let xx = c.x + 1; xx < c.x + c.w - 1; xx += 1) {
        const d = (xx - c.x) - (yy - c.y);
        if (d === 2 || d === 6) g.px(xx, yy, 'white');
        else if ((xx + yy) % 4 === 0) g.px(xx, yy, 'glass');
      }
    }
  } else {
    // a few pieces left in the corners; the rest falling, then lying on the floor under it
    g.px(c.x + 1, c.y + 1, 'glass'); g.px(c.x + 2, c.y + 1, 'glass');
    g.px(c.x + c.w - 2, c.y + c.h - 3, 'glass');
    const p = Math.min(1, (t - (brokeAt || 0)) / 420);
    const e = p * p;
    SHARDS.forEach(([sx, sy, dx, dy]) => {
      const px = Math.round(c.x + sx + dx * e);
      const py = Math.round(c.y + sy + (dy - sy) * e);
      g.px(px, py, p < 1 ? 'white' : 'glass');
      if (p >= 1) g.px(px + 1, py, 'white');
    });
  }
  if (on) {
    const k = Math.floor(t / 220) % 3;
    const sparks = [[x - 12, y - 10], [x + 12, y - 7], [x + 11, y + 9]];
    sparks.forEach(([sx, sy], i) => {
      const lit = i === k;
      const col = lit ? 'white' : (i + 1) % 3 === k ? 'gold2' : null;
      if (!col) return;
      g.px(sx, sy, col);
      if (lit) { g.px(sx - 1, sy, 'gold2'); g.px(sx + 1, sy, 'gold2'); g.px(sx, sy - 1, 'gold2'); g.px(sx, sy + 1, 'gold2'); }
    });
  }
  g.setId(0);
}

// a mirror ball, down from the ceiling between the posters and the window, for the disco
function mirrorBall(g, t) {
  g.setId(0);
  const cx = 201;
  const cy = 3;
  g.vline(cx, -ROOF, cy + ROOF - 4, 'cable');
  g.disc(cx, cy, 4, 'metal2');
  const k = Math.floor(t / 90);
  for (let yy = -3; yy <= 3; yy += 1) {
    for (let xx = -3; xx <= 3; xx += 1) {
      if (xx * xx + yy * yy > 12) continue;
      const on = (xx + yy + k) % 3 === 0;
      g.px(cx + xx, cy + yy, on ? 'white' : (xx + yy + k) % 3 === 1 ? 'metal' : 'metal2');
    }
  }
}

/* ── the whole thing, back to front ────────────────────────────────── */

// The parts of the room that do not move — the shell, the posters, the stripes, the rug, the
// desk, the games, the clock — are drawn once into a grid of their own and copied in at the
// start of every frame; only what animates is drawn on top. Nothing in the still set overlaps
// anything drawn after it, so the order is safe. The clock face carries the hour, so the still
// set is made again when the hour changes.
let still = null;
let stillHour = null;
function stillParts(hour) {
  if (still && stillHour === hour) return still;
  still = createGrid();
  stillHour = hour;
  const g = painter(still, ROOF);
  shell(g);
  POSTERS.forEach((p, i) => poster(g, 10 + i, 85 + i * 40, 6, i));
  clock(g, hour);
  rug(g);
  desk(g);
  games(g);
  return still;
}

export function drawScene(grid, state) {
  const base = stillParts(state.hour || 0);
  grid.buf.set(base.buf);
  grid.ids.set(base.ids);
  const g = painter(grid, ROOF);
  const t = state.t || 0;
  stringLights(g, state.string, t);
  if (state.disco) mirrorBall(g, t);
  windowUnit(g, state.windowT || 0, t, (state.night || 0) > 0.45);
  shelf(g, state.sparkle, t);
  tower(g, state.pc, t);
  monitors(g, state.pc, state.phone);
  if (state.phone) bookStack(g);
  chess(g, 80, DESK_Y);
  laptop(g, state.pc);
  lamp(g, state.lamp);
  mug(g, !state.cold, t);
  button(g, state.disco, state.glassBroken, state.glassAt, t);
  chair(g, state.spin || 0);
  ball(g, state.bounce || 0);
  return grid;
}

export { W, H };
