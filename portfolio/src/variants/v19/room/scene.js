// v19 — the room, re-proportioned.
//
// Everything is sized against him now, and he is a person rather than a toy: 21 wide, 42
// tall to the desk. Two landscape monitors with the laptop at the right end, the posters
// small above them, one shelf on the left, the window and the fridge on the right. No door.
//
// The wall is the page's own paper and there is no cornice, so the top of the room can be
// masked straight into the page above it. Draw order carries the depth; he is drawn last.

import { painter, W, H, OY } from './engine';
import { BOOKS, GAMES, MAGNETS, POSTERS } from '../personal';
import { SIT, WAVE, SLEEP, LEGEND } from './sprites';

const FLOOR_Y = 130;
const SKIRT_Y = 126;

/* The rectangles the Room component paints real, pixelated images into. */
export const SCREENS = {
  monitorA: { x: 86, y: 60, w: 46, h: 29 },
  monitorB: { x: 140, y: 60, w: 46, h: 29 },
};

export const HIM = { x: 121, y: 35, w: 31, h: 63 };

/* Hit-test order: first match wins, so small things in front come first. */
export const HOTSPOTS = [
  { id: 2, key: 'me', label: 'Me', kind: 'hand', x: 119, y: 33, w: 36, h: 65 },
  { id: 1, key: 'lamp', label: 'The lamp', kind: 'hand', x: 60, y: 54, w: 24, h: 16 },
  { id: 3, key: 'photo', label: 'Family', kind: 'zoom', x: 72, y: 80, w: 20, h: 19 },
  { id: 4, key: 'mug', label: 'Tea', kind: 'hand', x: 92, y: 87, w: 12, h: 12 },
  { id: 5, key: 'laptop', label: 'Where I have worked', kind: 'zoom', x: 190, y: 78, w: 36, h: 22 },
  { id: 6, key: 'monitorA', label: 'Everything I have made', kind: 'zoom', x: 82, y: 56, w: 52, h: 36 },
  { id: 7, key: 'monitorB', label: 'Two papers', kind: 'zoom', x: 136, y: 56, w: 52, h: 36 },
  { id: 8, key: 'pc', label: 'The tower', kind: 'hand', x: 62, y: 106, w: 20, h: 26 },
  { id: 9, key: 'games', label: 'Games', kind: 'zoom', x: 86, y: 116, w: 24, h: 16 },
  { id: 10, key: 'poster1', label: POSTERS[0].title, kind: 'zoom', x: 100, y: 10, w: 24, h: 30 },
  { id: 11, key: 'poster2', label: POSTERS[1].title, kind: 'zoom', x: 132, y: 10, w: 24, h: 30 },
  { id: 12, key: 'poster3', label: POSTERS[2].title, kind: 'zoom', x: 164, y: 10, w: 24, h: 30 },
  { id: 13, key: 'trophies', label: 'MIT XR 2024 and HINT 5.0', kind: 'zoom', x: 40, y: 26, w: 26, h: 18 },
  { id: 14, key: 'medals', label: 'Medals', kind: 'zoom', x: 50, y: 46, w: 18, h: 24 },
  { id: 15, key: 'books', label: 'Books', kind: 'zoom', x: 8, y: 22, w: 32, h: 22 },
  { id: 16, key: 'fridge', label: 'The fridge', kind: 'zoom', x: 252, y: 78, w: 36, h: 74 },
  { id: 17, key: 'plant', label: 'A plant', kind: 'hand', x: 228, y: 86, w: 22, h: 46 },
  { id: 18, key: 'ball', label: 'Football and boots', kind: 'hand', x: 10, y: 134, w: 58, h: 24 },
  { id: 19, key: 'window', label: 'The window', kind: 'hand', x: 212, y: 12, w: 64, h: 56 },
  { id: 20, key: 'lights', label: 'String lights', kind: 'hand', x: 6, y: -34, w: 276, h: 13 },
];

export const LIGHTS = {
  lamp: { x: 74, y: 70, r: 80, warm: 1, strength: 0.95 },
  screens: { x: 136, y: 76, r: 66, warm: 0.15, strength: 0.7 },
  string: [
    { x: 40, y: 10, r: 46, warm: 1, strength: 0.5 },
    { x: 108, y: 14, r: 46, warm: 1, strength: 0.5 },
    { x: 180, y: 14, r: 46, warm: 1, strength: 0.5 },
    { x: 248, y: 10, r: 46, warm: 1, strength: 0.5 },
  ],
};

/* ── the shell ─────────────────────────────────────────────────────── */

function shell(g) {
  g.setId(0);
  // the wall: lighter toward the top, so the mask into the page has nothing to hide
  for (let y = -OY; y < FLOOR_Y; y += 1) {
    const k = (y + OY) / (FLOOR_Y + OY);
    const c = k < 0.3 ? 'wallLit' : k < 0.5 ? (((y + OY) * 7) % 5 < 2 ? 'wallLit' : 'wall') : 'wall';
    g.hline(0, y, W, c);
  }
  // light off the window, right; the shelf corner, left, a touch dimmer
  for (let x = 160; x < W; x += 1) {
    const k = (x - 160) / (W - 160);
    for (let y = 0; y < SKIRT_Y; y += 1) {
      if (k > 0.7) g.px(x, y, 'wallLit');
      else if (k > 0.3 && (x * 3 + y * 5) % 7 === 0) g.px(x, y, 'wallLit');
    }
  }
  for (let x = 0; x < 40; x += 1) {
    const k = 1 - x / 40;
    for (let y = 20; y < SKIRT_Y; y += 1) {
      if (k > 0.8) g.px(x, y, 'wallDim');
      else if (k > 0.35 && (x * 3 + y * 5) % 7 === 0) g.px(x, y, 'wallDim');
    }
  }
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

function stringLights(g, on, t) {
  g.setId(20);
  const bulbs = [];
  const SPANS = 4;
  for (let x = 6; x < W - 4; x += 1) {
    const p = (x - 6) / (W - 10);
    const sag = Math.sin(((p * SPANS) % 1) * Math.PI) * 7;
    const y = 3 - OY + Math.round(sag);
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

/* ── the shelf ─────────────────────────────────────────────────────── */

function shelf(g, sparkle, t) {
  const x = 8;
  const y = 44;
  const w = 60;

  g.setId(0);
  g.rect(x, y, w, 3, 'woodTop');
  g.rect(x, y + 3, w, 2, 'wood');
  g.hline(x, y + 5, w, 'wood3');
  g.rect(x + 4, y + 5, 2, 4, 'wood3');
  g.rect(x + w - 6, y + 5, 2, 4, 'wood3');

  g.setId(15);
  let cx = x + 2;
  const PAL = ['paper', 'cream', 'blue2', 'green2', 'red2', 'sand', 'purple2'];
  for (let i = 0; i < 6; i += 1) {
    const bw = 4 + (i % 3 === 0 ? 1 : 0);
    const bh = 20 - (i % 4);
    const top = y - bh;
    g.rect(cx, top, bw, bh, PAL[i % PAL.length]);
    g.rect(cx, top, bw, 1, 'ink2');
    g.rect(cx, top + 3, bw, 1, 'ink2');
    g.vline(cx + bw - 1, top, bh, 'ink2');
    cx += bw + 1;
  }
  g.line(cx + 1, y - 14, cx + 5, y - 1, 'wood3');
  g.line(cx + 2, y - 14, cx + 6, y - 1, 'red3');
  g.line(cx + 3, y - 14, cx + 7, y - 1, 'red');
  g.setId(0);

  g.setId(13);
  g.rect(44, y - 15, 10, 6, 'gold');
  g.rect(45, y - 9, 8, 1, 'gold2');
  g.rect(47, y - 8, 3, 5, 'gold');
  g.rect(44, y - 3, 10, 3, 'gold2');
  g.px(42, y - 14, 'gold');
  g.px(42, y - 13, 'gold');
  g.px(55, y - 14, 'gold');
  g.px(55, y - 13, 'gold');
  g.rect(57, y - 11, 9, 8, 'wood3');
  g.rect(58, y - 10, 7, 6, 'gold2');
  g.hline(59, y - 8, 5, 'wood3');
  g.hline(59, y - 6, 5, 'wood3');
  if (sparkle) {
    const sp = Math.floor(t / 220) % 3;
    g.px(48 + sp, y - 19, 'white');
    g.px(61 - sp, y - 15, 'white');
  }
  g.setId(0);

  g.setId(14);
  [[52, 'red', 'blue'], [60, 'blue', 'green']].forEach(([mx, r1, r2], i) => {
    const swing = Math.round(Math.sin(t / 1400 + i * 2));
    g.rect(mx, y + 5, 2, 10, r1);
    g.rect(mx + 2, y + 5, 2, 10, r2);
    g.disc(mx + 1 + swing, y + 19, 4, 'gold');
    g.disc(mx + 1 + swing, y + 19, 2, 'gold2');
    g.px(mx + 1 + swing, y + 19, 'wood3');
  });
  g.setId(0);
}

/* ── posters, small ────────────────────────────────────────────────── */

function poster(g, id, x, y, which) {
  const w = 24;
  const h = 30;
  g.setId(id);
  g.rect(x - 1, y - 1, w + 2, h + 2, 'ink2');
  if (which === 0) {
    g.rect(x, y, w, h, 'poster1');
    g.rect(x, y, w, 10, 'orange2');
    g.disc(x + 16, y + 10, 5, 'yellow2');
    g.rect(x, y + 16, w, h - 16, 'orange');
    g.hline(x, y + 15, w, 'red3');
    g.rect(x + 6, y + 8, 3, 9, 'ink');
    g.rect(x + 5, y + 10, 5, 4, 'ink');
    g.rect(x + 12, y + 9, 3, 8, 'ink');
    g.rect(x + 11, y + 11, 5, 3, 'ink');
    g.rect(x + 3, y + 21, 14, 3, 'ink2');
    g.rect(x + 6, y + 19, 7, 2, 'ink2');
    g.rect(x + 2, y + 26, 20, 2, 'cream');
  } else if (which === 1) {
    g.rect(x, y, w, h, 'poster2');
    g.rect(x, y, w, 6, 'red3');
    g.rect(x + 9, y + 9, 6, 14, 'ink');
    g.rect(x + 10, y + 6, 4, 4, 'ink');
    g.rect(x + 7, y + 12, 2, 7, 'ink');
    g.rect(x + 15, y + 12, 2, 7, 'ink');
    g.rect(x + 3, y + 24, 18, 2, 'cream');
    g.rect(x + 3, y + 27, 12, 1, 'sand');
  } else {
    g.rect(x, y, w, h, 'poster3');
    g.rect(x, y, w, 14, 'sand');
    g.disc(x + 12, y + 8, 6, 'orange2');
    g.disc(x + 12, y + 8, 4, 'yellow2');
    for (let i = 0; i < w; i += 1) {
      const r1 = 17 + Math.round(Math.sin((i / w) * Math.PI * 1.6) * 3);
      g.rect(x + i, y + r1, 1, h - r1, 'wood2');
      const r2 = 23 + Math.round(Math.sin((i / w) * Math.PI * 2.2 + 1) * 2);
      g.rect(x + i, y + r2, 1, h - r2, 'wood3');
    }
    g.px(x + 8, y + 16, 'ink');
    g.px(x + 10, y + 17, 'ink');
    g.rect(x + 4, y + 26, 16, 2, 'cream');
  }
  g.setId(0);
}

/* ── the window, which opens rather than flips ─────────────────────── */

function windowUnit(g, openT, t) {
  const x = 212;
  const y = 12;
  const w = 64;
  const h = 56;
  const e = openT < 0.5 ? 2 * openT * openT : 1 - (-2 * openT + 2) ** 2 / 2;
  g.setId(19);
  g.rect(x - 2, y - 2, w + 4, h + 4, 'wood3');
  for (let i = 0; i < h; i += 1) {
    const k = i / h;
    g.hline(x, y + i, w, k < 0.34 ? 'sky1' : k < 0.62 ? 'sky2' : 'sky3');
  }
  const sunY = y + 34 - Math.round(Math.sin(t / 4200) * 2);
  g.disc(x + 42, sunY, 6, 'sun');
  for (let i = 0; i < w; i += 1) {
    const hh = 42 + Math.round(Math.sin(i / 9) * 3 + Math.sin(i / 21) * 4);
    g.rect(x + i, y + hh, 1, h - hh, 'hill');
    const hh2 = 47 + Math.round(Math.sin(i / 13 + 2) * 3);
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
    // a breath of curtain caught in the gap
    const lift = Math.round(Math.sin(t / 380) * 2 * e);
    g.px(x + 3, sashY + 5 + lift, 'cream');
    g.px(x + 4, sashY + 6 + lift, 'cream');
  }

  g.setId(0);
  const pull = Math.round(e * 4);
  for (let i = 0; i < 9 - pull; i += 1) g.rect(x - 6 + i, y - 4, 1, h + 6, i % 2 ? 'cream' : 'sand');
  for (let i = 0; i < 9 - pull; i += 1) g.rect(x + w + 5 - i, y - 4, 1, h + 6, i % 2 ? 'cream' : 'sand');
  g.rect(x - 8, y - 6, w + 16, 2, 'wood3');
}

/* ── the desk ──────────────────────────────────────────────────────── */

function desk(g) {
  g.setId(0);
  g.rect(58, 98, 172, 3, 'woodTop');
  g.rect(58, 101, 172, 5, 'wood');
  g.hline(58, 105, 172, 'wood3');
  g.rect(62, 106, 4, 24, 'wood3');
  g.rect(222, 106, 4, 24, 'wood3');
  g.rect(62, 128, 164, 2, 'wood3');
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
  g.rect(a.x + 19, a.y + a.h + 3, 8, 5, 'grey3');
  g.rect(a.x + 11, a.y + a.h + 7, 24, 2, 'grey3');
  g.px(a.x + a.w + 1, a.y + a.h + 1, on ? 'led' : 'ledRed');
  g.setId(7);
  panel(g, b.x, b.y, b.w, b.h, on);
  g.rect(b.x + 19, b.y + b.h + 3, 8, 5, 'grey3');
  g.rect(b.x + 11, b.y + b.h + 7, 24, 2, 'grey3');
  g.px(b.x + b.w + 1, b.y + b.h + 1, on ? 'led' : 'ledRed');
  g.setId(0);
}

function laptop(g, on) {
  g.setId(5);
  g.rect(192, 78, 32, 19, 'metal');
  g.rect(193, 79, 30, 17, 'ink');
  g.rect(194, 80, 28, 15, on ? 'screen2' : 'screen');
  if (on) {
    g.rect(195, 81, 26, 2, 'screenLit');
    for (let i = 0; i < 4; i += 1) g.rect(196, 85 + i * 2, 10 + i * 4, 1, i === 1 ? 'screenGrn' : 'screenTxt');
  }
  g.rect(190, 96, 36, 2, 'metal2');
  g.rect(190, 98, 36, 1, 'metal3');
  g.setId(0);
}

function lamp(g, on) {
  g.setId(1);
  g.rect(58, 92, 10, 6, 'metal3');
  g.rect(62, 62, 2, 31, 'metal');
  g.line(63, 62, 70, 58, 'metal');
  g.rect(66, 54, 16, 8, on ? 'lampOn' : 'lampOff');
  g.rect(67, 62, 14, 2, on ? 'bulb' : 'lampOff');
  g.frame(66, 54, 16, 8, 'metal3');
  g.setId(0);
}

function photo(g) {
  g.setId(3);
  g.rect(72, 80, 20, 18, 'wood2');
  g.rect(73, 81, 18, 16, 'paper');
  g.rect(74, 89, 18, 8, 'blue2');
  g.disc(77, 87, 2, 'skin');
  g.disc(82, 86, 2, 'skin');
  g.disc(87, 87, 2, 'skin');
  g.rect(75, 89, 5, 7, 'red2');
  g.rect(80, 88, 5, 8, 'cream');
  g.rect(85, 89, 5, 7, 'green2');
  g.rect(72, 97, 20, 2, 'wood3');
  g.setId(0);
}

function mug(g, steaming, t) {
  g.setId(4);
  g.rect(94, 89, 8, 9, 'red');
  g.rect(95, 90, 6, 2, steaming ? 'wood3' : 'ink2');
  g.px(102, 91, 'red');
  g.px(103, 92, 'red');
  g.px(102, 93, 'red');
  g.rect(94, 98, 8, 1, 'red3');
  if (steaming) {
    const s = Math.floor(t / 260) % 3;
    g.px(96 + s, 87 - s, 'grey2');
    g.px(99 - s, 86 - s, 'grey2');
  }
  g.setId(0);
}

function tower(g, on, t) {
  g.setId(8);
  g.rect(62, 106, 20, 26, 'grey3');
  g.rect(63, 107, 18, 24, 'ink2');
  g.rect(65, 109, 14, 3, 'grey3');
  g.rect(65, 114, 14, 2, 'grey3');
  g.px(78, 120, on ? 'led' : 'ledRed');
  g.px(78, 123, on ? 'screenGrn' : 'grey3');
  for (let y = 126; y < 131; y += 2) for (let x = 65; x < 79; x += 2) g.px(x, y, 'grey3');
  if (on && Math.sin(t / 700) > 0.4) g.px(78, 120, 'white');
  g.setId(0);
  g.line(72, 132, 78, 136, 'cable');
  g.line(78, 136, 110, 136, 'cable');
}

function games(g) {
  g.setId(9);
  const CASE = ['purple2', 'blue2', 'orange2', 'red2'];
  GAMES.forEach((it, i) => {
    const y = 130 - (i + 1) * 4;
    g.rect(87, y, 20, 4, 'ink2');
    g.rect(88, y + 1, 18, 2, CASE[i % CASE.length]);
    g.px(104, y + 1, 'cream');
  });
  g.rect(108, 114, 5, 16, 'ink2');
  g.rect(108, 115, 4, 14, 'green2');
  g.rect(109, 117, 2, 6, 'ink2');
  g.setId(0);
}

function chair(g) {
  g.setId(0);
  // the back stops at his shoulders and a narrow headrest sits behind his head — so the chair
  // reads as big without standing in front of the posters
  g.rect(114, 52, 44, 62, 'ink2');
  g.rect(116, 54, 40, 58, 'grey3');
  for (let y = 58; y < 110; y += 4) g.hline(117, y, 38, 'ink2');
  g.rect(126, 40, 20, 12, 'ink2');     // headrest, behind his head only
  g.rect(128, 42, 16, 8, 'grey3');
  g.rect(108, 86, 6, 22, 'ink2');      // arms
  g.rect(158, 86, 6, 22, 'ink2');
  g.rect(110, 114, 52, 5, 'ink2');     // seat edge
  g.rect(133, 119, 6, 8, 'metal3');
  g.rect(120, 126, 32, 3, 'metal3');
  g.px(119, 129, 'ink');
  g.px(152, 129, 'ink');
}

/* ── the right corner ──────────────────────────────────────────────── */

function plant(g, grown, t, style) {
  g.setId(17);
  const sway = Math.round(Math.sin(t / 900));
  const sway2 = Math.round(Math.sin(t / 620 + 1));
  const px0 = 230;
  g.rect(px0, 116, 18, 14, 'pot');
  g.rect(px0, 116, 18, 3, 'wood2');
  g.rect(px0 + 1, 130, 16, 2, 'wood3');
  g.rect(px0 + 2, 119, 14, 2, 'floorDark');
  const cx = px0 + 9;
  if (style === 'fern') {
    for (let f = 0; f < 5; f += 1) {
      const dir = f % 2 ? 1 : -1;
      const lean = dir * (2 + f);
      const top = 114 - (grown ? 24 : 17) + f;
      for (let k = 0; k < 18; k += 1) {
        const p = k / 18;
        const x = cx + Math.round(lean * p * p) + (k > 10 ? sway * dir : 0);
        const y = 116 - Math.round(k * (grown ? 1.35 : 1));
        if (y < top) break;
        g.px(x, y, k > 12 ? 'leaf' : 'leaf2');
        if (k % 2 === 0 && k > 3) {
          g.px(x - 1, y, 'leaf2');
          g.px(x + 1, y, 'leaf2');
        }
      }
    }
  } else if (style === 'succulent') {
    const cy = 110;
    for (let a = 0; a < 8; a += 1) {
      const ang = (a / 8) * Math.PI * 2 + t / 9000;
      const len = grown ? 7 : 5;
      for (let k = 1; k <= len; k += 1) {
        g.px(cx + sway + Math.round(Math.cos(ang) * k), cy + Math.round((Math.sin(ang) * k) / 1.6), k > len - 2 ? 'leaf' : 'leaf2');
      }
    }
    g.disc(cx + sway, cy, 2, 'leaf2');
  } else {
    [[cx - 2, 0], [cx, 3], [cx + 2, 1]].forEach(([sx, drop], si) => {
      const top = (grown ? 90 : 98) + drop;
      g.rect(sx, top, 1, 116 - top, 'green3');
      const leaves = (grown ? 5 : 4) - (si % 2);
      for (let i = 0; i < leaves; i += 1) {
        const y = top + 2 + i * 4;
        const dir = (i + si) % 2 ? 1 : -1;
        const len = 4 + ((i + si) % 3);
        for (let k = 1; k <= len; k += 1) {
          const x = sx + dir * k + (i % 2 ? sway : sway2);
          g.px(x, y + Math.round(k / 3), k > len - 2 ? 'leaf' : 'leaf2');
          if (k < len - 1) g.px(x, y + 1 + Math.round(k / 3), 'leaf2');
        }
      }
    });
  }
  g.setId(0);
}

function fridge(g, open, t) {
  const x = 252;
  const y = 78;
  const w = 36;
  const h = 74;
  g.setId(16);
  g.rect(x, y, w, h, 'fridge2');
  g.rect(x + 1, y + 1, w - 2, h - 2, 'fridge');
  g.hline(x + 1, y + 24, w - 2, 'fridge2');
  g.rect(x + w - 7, y + 6, 3, 14, 'metal2');
  g.rect(x + w - 7, y + 30, 3, 22, 'metal2');
  if (open) {
    g.rect(x + 3, y + 26, w - 10, h - 32, 'ink2');
    g.rect(x + 5, y + 28, w - 14, h - 36, 'screen2');
    g.hline(x + 5, y + 44, w - 14, 'metal2');
    g.hline(x + 5, y + 60, w - 14, 'metal2');
    g.rect(x + 7, y + 36, 4, 8, 'green');
    g.rect(x + 13, y + 34, 4, 10, 'red');
    g.rect(x + 8, y + 52, 6, 8, 'blue2');
    g.rect(x + 16, y + 50, 4, 10, 'orange');
    g.px(x + w - 12, y + 30, 'bulb');
  }
  const MTINT = ['orange', 'green', 'yellow', 'blue2', 'pink'];
  MAGNETS.forEach((m, i) => {
    const mx = x + 4 + (i % 2) * 14;
    const my = y + 4 + Math.floor(i / 2) * 9;
    if (my > y + 22) return;
    const wob = i === Math.floor(t / 1100) % MAGNETS.length ? 1 : 0;
    const c = MTINT[i % MTINT.length];
    if (i % 2) {
      g.rect(mx, my - wob, 8, 7, c);
      g.rect(mx + 1, my + 1 - wob, 6, 5, 'cream');
      g.rect(mx + 2, my + 3 - wob, 4, 1, 'ink2');
    } else {
      g.disc(mx + 3, my + 3 - wob, 3, c);
      g.disc(mx + 3, my + 3 - wob, 1, 'cream');
    }
  });
  g.rect(x + 10, y + 32, 16, 13, 'paper');
  g.rect(x + 11, y + 33, 14, 11, 'sky2');
  g.rect(x + 12, y + 39, 12, 5, 'hill');
  g.rect(x + 16, y + 30, 4, 3, 'yellow2');
  g.setId(0);
}

/* ── the floor ─────────────────────────────────────────────────────── */

function rug(g) {
  g.setId(0);
  const x = 54;
  const y = 134;
  const w = 180;
  const h = 24;
  g.rect(x, y, w, h, 'rug');
  g.frame(x, y, w, h, 'rug3');
  g.rect(x + 2, y + 2, w - 4, 2, 'rug2');
  g.rect(x + 2, y + h - 4, w - 4, 2, 'rug2');
  for (let i = 0; i < w - 8; i += 4) {
    g.px(x + 4 + i, y + 3, 'rug4');
    g.px(x + 6 + i, y + h - 3, 'rug4');
  }
  for (let d = 0; d < 8; d += 1) {
    const cx = x + 16 + d * 21;
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
  const sw = 16 - Math.round(bounce / 3);
  for (let i = 0; i < sw; i += 1) {
    const dx = 22 - Math.round(sw / 2) + i;
    g.px(dx, 155, 'floorDark');
    if (Math.abs(i - sw / 2) < sw / 3) g.px(dx, 156, 'floorDark');
  }
  g.setId(18);
  const by = 146 - bounce;
  g.disc(22, by, 9, 'ball');
  g.rect(19, by - 3, 7, 2, 'ballDark');
  g.rect(18, by - 1, 9, 2, 'ballDark');
  g.rect(19, by + 1, 7, 2, 'ballDark');
  g.px(20, by + 3, 'ballDark');
  g.px(24, by + 3, 'ballDark');
  g.line(19, by - 3, 16, by - 6, 'ballDark');
  g.line(26, by - 3, 29, by - 6, 'ballDark');
  g.line(18, by + 1, 14, by + 3, 'ballDark');
  g.line(27, by + 1, 31, by + 3, 'ballDark');
  g.line(22, by + 4, 22, by + 8, 'ballDark');
  g.rect(15, by - 7, 3, 2, 'ballDark');
  g.rect(27, by - 7, 3, 2, 'ballDark');
  g.rect(20, by + 6, 4, 2, 'ballDark');
  g.px(17, by - 4, 'white');
  g.px(18, by - 5, 'white');
  g.px(17, by - 5, 'white');
  [40, 54].forEach((bx) => {
    g.rect(bx, 149, 12, 5, 'boot');
    g.rect(bx + 1, 147, 10, 2, 'boot');
    g.rect(bx + 7, 144, 5, 4, 'boot');
    g.rect(bx + 7, 143, 5, 1, 'grey3');
    g.rect(bx, 154, 13, 2, 'bootSole');
    g.px(bx, 153, 'bootSole');
    for (let i = 0; i < 3; i += 1) g.px(bx + 8, 145 + i, 'cream');
    g.px(bx + 2, 150, 'cream');
    g.px(bx + 4, 150, 'cream');
  });
  g.setId(0);
}

/* ── him ───────────────────────────────────────────────────────────── */

function person(g, mode, frame, t) {
  g.setId(2);
  if (mode === 'wave') g.sprite(HIM.x, HIM.y, WAVE[frame % 2], LEGEND);
  else if (mode === 'sleep') {
    g.sprite(HIM.x, HIM.y, SLEEP, LEGEND);
    // three z's drifting up and to the right
    const k = Math.floor(t / 600) % 3;
    for (let i = 0; i < 3; i += 1) {
      if (i > k) break;
      const zx = HIM.x + 24 + i * 4;
      const zy = HIM.y + 4 - i * 5;
      g.px(zx, zy, 'ink2');
      g.px(zx + 1, zy, 'ink2');
      g.px(zx + 1, zy + 1, 'ink2');
      g.px(zx, zy + 2, 'ink2');
      g.px(zx + 1, zy + 2, 'ink2');
    }
  } else {
    // a slow breath: the shoulders rise one pixel every couple of seconds
    const breathe = Math.sin(t / 1400) > 0.6 ? -1 : 0;
    g.sprite(HIM.x, HIM.y + breathe, SIT, LEGEND);
  }
  g.setId(0);
}

/* ── the whole thing ───────────────────────────────────────────────── */

export function drawScene(grid, state) {
  const g = painter(grid, OY);
  const t = state.t || 0;
  shell(g);
  stringLights(g, state.string, t);
  shelf(g, state.sparkle, t);
  POSTERS.forEach((p, i) => poster(g, 10 + i, 100 + i * 32, 10, i));
  windowUnit(g, state.windowT || 0, t);
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
  person(g, state.mode, state.frame, t);
  return grid;
}

export { W, H };
