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
// Room is 288 × 144. The floor is at 106; the desk surface at 84.

import { painter, W, ROOM_H as H, ROOF } from './engine';
import { BOOKS, GAMES, MAGNETS, POSTERS } from '../personal';

const FLOOR_Y = 106;
const DESK_Y = 84;

/* The rectangles the Room component paints real, pixelated images into. */
export const SCREENS = {
  monitorA: { x: 96, y: 58, w: 34, h: 20 },
  monitorB: { x: 158, y: 58, w: 34, h: 20 },
};


/* Hit-test order: first match wins, so what is nearest to you comes first. */
export const HOTSPOTS = [
  { id: 2, key: 'chair', label: 'The chair', kind: 'hand', x: 118, y: 68, w: 52, h: 48 },
  { id: 4, key: 'mug', label: 'Tea', kind: 'hand', x: 195, y: 72, w: 14, h: 14 },
  { id: 5, key: 'laptop', label: 'Where I have worked', kind: 'zoom', x: 208, y: 56, w: 38, h: 30 },
  { id: 1, key: 'lamp', label: 'The lamp', kind: 'hand', x: 50, y: 32, w: 36, h: 16 },
  { id: 6, key: 'monitorA', label: 'Everything I have built', kind: 'zoom', x: 92, y: 54, w: 42, h: 30 },
  { id: 7, key: 'monitorB', label: 'Two papers', kind: 'zoom', x: 154, y: 54, w: 42, h: 30 },
  { id: 8, key: 'pc', label: 'The tower', kind: 'hand', x: 50, y: 86, w: 28, h: 34 },
  { id: 9, key: 'games', label: 'Video games', kind: 'zoom', x: 78, y: 96, w: 32, h: 24 },
  // 28 by 42: the three pictures are all two by three, so the frame is too, and nothing is cropped
  { id: 10, key: 'poster1', label: POSTERS[0].title, kind: 'zoom', x: 85, y: 6, w: 28, h: 42 },
  { id: 11, key: 'poster2', label: POSTERS[1].title, kind: 'zoom', x: 125, y: 6, w: 28, h: 42 },
  { id: 12, key: 'poster3', label: POSTERS[2].title, kind: 'zoom', x: 165, y: 6, w: 28, h: 42 },
  { id: 13, key: 'trophies', label: 'MIT XR 2024 and HINT 5.0', kind: 'zoom', x: 38, y: 36, w: 24, h: 20 },
  { id: 14, key: 'medals', label: 'Medals', kind: 'zoom', x: 40, y: 56, w: 20, h: 18 },
  { id: 15, key: 'books', label: 'Books', kind: 'zoom', x: 6, y: 32, w: 32, h: 24 },
  { id: 21, key: 'clock', label: 'The clock', kind: 'zoom', x: 20, y: 12, w: 20, h: 20 },
  { id: 18, key: 'ball', label: 'Football and boots', kind: 'hand', x: 8, y: 118, w: 70, h: 26 },
  { id: 22, key: 'bin', label: 'The bin', kind: 'hand', x: 262, y: 87, w: 24, h: 20 },
  { id: 23, key: 'disco', label: 'A button', kind: 'hand', x: 264, y: 91, w: 20, h: 13 },
  { id: 19, key: 'window', label: 'The window', kind: 'hand', x: 208, y: -2, w: 64, h: 46 },
  { id: 20, key: 'lights', label: 'String lights', kind: 'hand', x: 4, y: -7, w: 280, h: 12 },
];

// the bin stands against the wall in the right corner; the plate is what it hides
export const BIN = { x: 264, y: 89, w: 20, h: 17 };
export const PLATE = { x: 264, y: 91, w: 20, h: 13 };

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

function windowUnit(g, openT, t) {
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
  g.disc(x + 38, sunY, 5, 'sun');
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

function monitors(g, on) {
  const a = SCREENS.monitorA;
  const b = SCREENS.monitorB;
  g.setId(6);
  panel(g, a.x, a.y, a.w, a.h, on);
  g.rect(a.x + 14, a.y + a.h + 4, 7, 4, 'grey3');
  g.rect(a.x + 7, a.y + a.h + 8, 21, 2, 'grey3');
  g.px(a.x + a.w + 1, a.y + a.h + 1, on ? 'led' : 'ledRed');
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

function games(g) {
  g.setId(9);
  const CASE = ['purple2', 'blue2', 'orange2', 'red2', 'green2'];
  GAMES.forEach((it, i) => {
    const y = 118 - (i + 1) * 4;
    g.rect(80, y, 22, 4, 'ink2');
    g.rect(81, y + 1, 20, 2, CASE[i % CASE.length]);
    g.px(99, y + 1, 'cream');
  });
  g.rect(104, 104, 5, 14, 'ink2');
  g.rect(104, 105, 4, 12, 'green2');
  g.rect(105, 107, 2, 5, 'ink2');
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
  const y = 116;
  const w = 210;
  const h = 26;
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
    g.px(dx, 140, 'floorDark');
    if (Math.abs(i - sw / 2) < sw / 3) g.px(dx, 141, 'floorDark');
  }
  g.setId(18);
  const cx = 20;
  const by = 132 - bounce;
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
    g.rect(bx, 131, 13, 6, 'boot');
    g.rect(heelX, 126, 5, 6, 'boot');
    g.rect(heelX + (flip ? -1 : 0), 125, 6, 1, 'grey3'); // the collar
    g.rect(toeX, 133, 5, 4, 'boot');
    g.px(toeX + (flip ? 0 : 4), 132, 'boot');
    g.rect(heelX + (flip ? -2 : 4), 128, 3, 2, 'cream'); // the tongue
    g.px(heelX + (flip ? -1 : 5), 130, 'cream'); // laces
    g.px(heelX + (flip ? -2 : 6), 131, 'cream');
    g.px(bx + 2, 134, 'grey3'); // the stripe
    g.px(bx + 4, 134, 'grey3');
    g.rect(bx, 137, 13, 1, 'bootSole');
    g.px(bx + 2, 138, 'bootSole'); // studs
    g.px(bx + 6, 138, 'bootSole');
    g.px(bx + 10, 138, 'bootSole');
  });
  g.setId(0);
}

/* ── the right corner: a bin, and what it was standing in front of ──── */

// three-by-five letters for the plate
const GLYPH = {
  D: ['##.', '#.#', '#.#', '#.#', '##.'],
  I: ['###', '.#.', '.#.', '.#.', '###'],
  S: ['.##', '#..', '.#.', '..#', '##.'],
  C: ['.##', '#..', '#..', '#..', '.##'],
  O: ['.#.', '#.#', '#.#', '#.#', '.#.'],
};

// the plate on the wall: a word and a round red button. Lit when the disco is on.
function plate(g, on, t) {
  const { x, y, w, h } = PLATE;
  g.setId(23);
  g.rect(x, y, w, h, 'grey2');
  g.frame(x, y, w, h, 'ink2');
  'DISCO'.split('').forEach((ch, i) => {
    g.sprite(x + 1 + i * 4, y + 2, GLYPH[ch], { '#': on ? 'ledRed' : 'ink' });
  });
  const cx = x + Math.floor(w / 2);
  const cy = y + h - 3;
  g.disc(cx, cy, 2, on && Math.floor(t / 180) % 2 ? 'ledRed' : 'red');
  g.px(cx - 1, cy - 1, 'red2');
  g.setId(0);
}

// the bin. `fall` is the time since it was clicked, or null: it leans, goes over, and rolls
// away to the right until it is off the edge of the room.
function bin(g, fall) {
  const { x, y, w, h } = BIN;
  const stripes = (bx, by, bw, bh, vertical, phase) => {
    g.rect(bx, by, bw, bh, 'metal');
    if (vertical) for (let i = 2 + (phase % 3); i < bw - 1; i += 3) g.vline(bx + i, by + 1, bh - 1, 'metal3');
    else for (let i = 2 + (phase % 3); i < bh - 1; i += 3) g.hline(bx + 1, by + i, bw - 1, 'metal3');
  };
  g.setId(22);
  if (fall == null || fall < 140) {
    // standing: a shadow, the body, the rim, the lid handle
    g.rect(x - 1, y + h, w + 3, 1, 'floorDark');
    stripes(x, y, w, h, true, 0);
    g.frame(x, y, w, h, 'metal3');
    g.rect(x - 1, y - 1, w + 2, 2, 'metal3');
    g.rect(x + Math.floor(w / 2) - 3, y - 3, 6, 2, 'ink');
  } else if (fall < 420) {
    // leaning to the right, more with every step
    const lean = Math.min(6, Math.floor((fall - 140) / 40));
    for (let r = 0; r < h; r += 1) {
      const dx = Math.round(((h - r) / h) * lean * 2);
      g.hline(x + dx, y + r, w, r === 0 ? 'metal3' : 'metal');
      if (r > 0) for (let i = 2; i < w - 1; i += 3) g.px(x + dx + i, y + r, 'metal3');
    }
    g.rect(x - 1 + lean * 2, y - 1, w + 2, 2, 'metal3');
  } else {
    // on its side and rolling right, out of the room
    const p = Math.min(1, (fall - 420) / 1100);
    const eased = p * p;
    const bx = x + Math.round(eased * 60);
    const by = FLOOR_Y - w;
    const phase = Math.floor(fall / 70);
    if (bx < W) {
      g.rect(bx, FLOOR_Y, h + 2, 1, 'floorDark');
      stripes(bx, by, h, w, false, phase);
      g.frame(bx, by, h, w, 'metal3');
      g.rect(bx + h - 2, by - 1, 2, w + 2, 'metal3'); // the rim, now on the right
      g.rect(bx + h, by + Math.floor(w / 2) - 3, 2, 6, 'ink'); // and the handle
    }
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

export function drawScene(grid, state) {
  const g = painter(grid, ROOF);
  const t = state.t || 0;
  shell(g);
  stringLights(g, state.string, t);
  if (state.disco) mirrorBall(g, t);
  POSTERS.forEach((p, i) => poster(g, 10 + i, 85 + i * 40, 6, i));
  plate(g, state.disco, t);
  clock(g, state.hour || 0);
  windowUnit(g, state.windowT || 0, t);
  shelf(g, state.sparkle, t);
  rug(g);
  desk(g);
  tower(g, state.pc, t);
  games(g);
  monitors(g, state.pc);
  laptop(g, state.pc);
  lamp(g, state.lamp);
  mug(g, !state.cold, t);
  chair(g, state.spin || 0);
  ball(g, state.bounce || 0);
  if (!state.binGone) bin(g, state.binAt == null ? null : t - state.binAt);
  return grid;
}

export { W, H };
