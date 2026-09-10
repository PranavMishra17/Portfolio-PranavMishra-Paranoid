// Variant 5 — the room, drawn. 192 by 108 pixels, straight on. Composed from his description, not
// from the blueprint: a tall window on the right with curtains and a plant, a mini fridge under it
// with magnets, the desk in the middle with two monitors (one turned portrait), a laptop, a mug, the
// family photo, him in the chair with his back to us, a clamp lamp; the bookshelf on the left with
// trophies on top, books, game cases and a controller; posters over the desk; football and boots on
// the floor by the rug. The window panes are left transparent so the page's real sky shows through.
import { W, H } from './engine';

export const HOTSPOTS = [
  // order matters for hit-testing: first match wins, so smaller and nearer things come first
  { id: 1, key: 'lamp', label: 'The lamp. Click to switch it.', x: 112, y: 44, w: 22, h: 24 },
  { id: 2, key: 'me', label: 'That is me, at the desk.', x: 72, y: 48, w: 26, h: 26 },
  { id: 3, key: 'photo', label: 'A family photo.', x: 56, y: 55, w: 11, h: 12 },
  { id: 4, key: 'mug', label: 'Tea. Always tea.', x: 66, y: 58, w: 8, h: 9 },
  { id: 5, key: 'laptop', label: 'The laptop. About me.', x: 116, y: 54, w: 17, h: 13 },
  { id: 6, key: 'monitorA', label: 'Monitor one. Where I have worked.', x: 66, y: 40, w: 34, h: 27 },
  { id: 7, key: 'monitorB', label: 'Monitor two. Three papers, stacked.', x: 100, y: 34, w: 16, h: 33 },
  { id: 8, key: 'poster1', label: 'A poster. Sample title.', x: 58, y: 8, w: 22, h: 28 },
  { id: 9, key: 'poster2', label: 'A poster. Sample title.', x: 83, y: 8, w: 22, h: 28 },
  { id: 10, key: 'poster3', label: 'A poster. Sample title.', x: 108, y: 8, w: 22, h: 28 },
  { id: 11, key: 'trophies', label: 'Two trophies. MIT XR 2024 and HINT 5.0.', x: 8, y: 12, w: 42, h: 18 },
  { id: 12, key: 'books', label: 'Books. Sample titles for now.', x: 8, y: 31, w: 42, h: 18 },
  { id: 13, key: 'games', label: 'Games I play. Sample titles for now.', x: 8, y: 49, w: 42, h: 18 },
  { id: 14, key: 'books2', label: 'More books. Sample titles for now.', x: 8, y: 67, w: 42, h: 18 },
  { id: 15, key: 'fridge', label: 'The mini fridge. A memory behind each magnet.', x: 149, y: 67, w: 29, h: 21 },
  { id: 16, key: 'plant', label: 'A plant on the sill.', x: 139, y: 44, w: 13, h: 20 },
  { id: 17, key: 'ball', label: 'Football and boots. I used to play.', x: 10, y: 92, w: 34, h: 15 },
  { id: 18, key: 'window', label: 'The window. That is the real sky behind this page.', x: 130, y: 4, w: 62, h: 62 },
];

export const LAMP = { x: 121, y: 53, r: 62 };

const legend = {
  k: 'ink',
  K: 'ink2',
  w: 'white',
  p: 'paper',
  g: 'gold',
  G: 'gold2',
  r: 'red',
  R: 'red2',
  b: 'blue',
  B: 'blue2',
  y: 'yellow',
  Y: 'yellow2',
  e: 'green',
  E: 'green2',
  o: 'orange',
  t: 'teal',
  T: 'teal2',
  u: 'purple',
  n: 'pink',
  s: 'skin',
  h: 'hair',
  d: 'hoodie',
  D: 'hoodie2',
  m: 'metal',
  M: 'metal2',
  q: 'grey',
  Q: 'grey2',
  z: 'grey3',
  c: 'cream',
  l: 'lamp',
  L: 'lampoff',
  x: 'screen',
  X: 'screen2',
  i: 'screenlite',
  I: 'screentext',
  v: 'led',
  W: 'wood',
  V: 'wood2',
  U: 'wood3',
};

const SPR = {
  cup: ['gGGGGGGg', 'gGgggggg', '.gggggg.', '.gggggg.', '..gggg..', '...gg...', '...gg...', '..gggg..', '.kkkkkk.', 'kkkkkkkk'],
  medal: ['..r.b..', '..r.b..', '..rrb..', '..ggg..', '.ggGgg.', '.gGGGg.', '.ggGgg.', '..ggg..'],
  plaque: ['kkkkkkkkkkkk', 'kppppppppppk', 'kpkkkkkkkppk', 'kppppppppppk', 'kpkkkkkkkkpk', 'kppppppppppk', 'kpkkkkkppppk', 'kkkkkkkkkkkk'],
  mug: ['rrrrr..', 'rwwwrr.', 'rwwwr.r', 'rwwwrr.', 'rrrrr..', '.rrrr..'],
  steam: [
    ['..Q..', '.Q...', '..Q..', '.....'],
    ['.Q.Q.', '..Q..', '.Q...', '.....'],
    ['..Q..', '...Q.', '..Q..', '.Q...'],
  ],
  controller: ['.kkkkkkkkk.', 'kkwkkkkkrkk', 'kwwwkkkkkek', 'kkwkkkkkbkk', '.kk.....kk.'],
  plant: ['....ee.....', '...eEee....', '..eEEEEe...', '.eEEeEEEe..', '..eeeEee...', '....ee.....', '....ee.....', '...ooooo...', '...oWWWo...', '...oWWWo...', '...oWWWo...', '....ooo....'],
  ball: ['..wwwwww..', '.wwwkkwwww', 'wwwkkkkwww', 'wkwwkkwwkw', 'wkwwwwwwkw', 'wwkwwwwkww', 'wwwwkkwwww', '.wwkkkkww.', '..wwwwww..'],
  boot: ['..kkk...', '..kkk...', '..kkkk..', '.kkkkkk.', 'kkkkkkkk', 'QQQQQQQQ'],
  head: ['..hhhhhh..', '.hhhhhhhh.', 'hhhhhhhhhh', 'hhhhhhhhhh', 'hhhhhhhhhh', 'hhhhhhhhhh', '.hhhhhhhh.', '..hhssss..', '...ssss...'],
  bird: [
    ['k...k', '.k.k.', '..k..'],
    ['.....', 'kk.kk', '..k..'],
  ],
  photo: ['kkkkkkkkk', 'kpppppppk', 'kppsppspk', 'kppsppspk', 'kpsssssspk'.slice(0, 9), 'kppdddddk'.slice(0, 9), 'kpppppppk', 'kkkkkkkkk', '...kkk...'],
  camera: ['.kkkkkk.', 'kkkwwkkk', 'kkwqqwkk', 'kkwqqwkk', 'kkkwwkkk', '.kkkkkk.'],
  keyboardRow: ['QkQkQkQkQkQkQkQkQkQkQk'],
};

function seeded(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/**
 * Draws the whole room into the painter. frame drives the small animations; state.lampOn draws the
 * bulb lit; state.bird is {x,y,f} or null.
 */
export function drawRoom(g, { frame = 0, lampOn = false, bird = null } = {}) {
  g.setId(0);

  // ---- wall, skirting, floor
  g.rect(0, 0, W, 86, 'wall');
  const rnd = seeded(77);
  for (let i = 0; i < 260; i += 1) g.px(Math.floor(rnd() * W), Math.floor(rnd() * 84), 'wall2');
  g.rect(0, 84, W, 3, 'skirt');
  g.hline(0, 84, W, 'wood3');
  for (let y = 87; y < H; y += 1) {
    const band = Math.floor((y - 87) / 5);
    g.hline(0, y, W, band % 2 ? 'floor2' : 'floor');
    if ((y - 87) % 5 === 0) g.hline(0, y, W, 'floor3');
    const off = (band * 11) % 24;
    for (let x = off; x < W; x += 24) g.px(x, y, 'floor3');
  }

  // ---- rug under the chair
  g.rect(60, 90, 56, 14, 'rug');
  g.frame(60, 90, 56, 14, 'rug3');
  g.frame(62, 92, 52, 10, 'rug2');
  g.dither(66, 95, 44, 4, 'rug', 'rug2');

  // ---- bookshelf (left)
  g.setId(0);
  g.rect(6, 10, 46, 76, 'wood3');
  g.rect(8, 12, 42, 72, 'wood');
  g.rect(8, 12, 42, 1, 'wood2');
  for (const sy of [30, 48, 66]) {
    g.rect(8, sy, 42, 2, 'wood3');
    g.rect(8, sy, 42, 1, 'wood2');
  }
  g.rect(8, 84, 44, 2, 'wood3');

  // top shelf: trophies + plaque
  g.setId(11);
  g.sprite(10, 19, SPR.cup, legend);
  g.sprite(21, 21, SPR.medal, legend);
  g.sprite(34, 21, SPR.plaque, legend);

  // second shelf: books
  g.setId(12);
  const spines = [
    [3, 14, 'red'],
    [4, 12, 'blue'],
    [3, 15, 'green'],
    [5, 11, 'yellow'],
    [3, 13, 'purple'],
    [4, 14, 'teal'],
    [3, 10, 'orange'],
    [4, 13, 'ink2'],
    [3, 12, 'pink'],
  ];
  let bx = 10;
  for (const [w, h, c] of spines) {
    g.rect(bx, 30 - h, w, h, c);
    g.px(bx + 1, 30 - h + 2, 'white');
    g.px(bx + 1, 30 - h + 5, 'white');
    bx += w + 1;
  }
  g.rect(42, 27, 7, 3, 'cream'); // a book lying flat
  g.hline(42, 28, 7, 'paper');

  // third shelf: game cases + controller
  g.setId(13);
  const cases = ['blue', 'red', 'orange', 'green', 'purple'];
  cases.forEach((c, i) => {
    const x = 10 + i * 5;
    g.rect(x, 36, 4, 12, c);
    g.rect(x, 36, 4, 2, 'white');
    g.px(x + 1, 44, 'white');
  });
  g.sprite(37, 43, SPR.controller, legend);

  // fourth shelf: more books, a camera
  g.setId(14);
  const spines2 = [
    [4, 13, 'teal'],
    [3, 11, 'red2'],
    [5, 14, 'blue2'],
    [3, 12, 'green2'],
    [4, 10, 'gold'],
    [3, 14, 'purple'],
  ];
  bx = 10;
  for (const [w, h, c] of spines2) {
    g.rect(bx, 66 - h, w, h, c);
    g.px(bx + 1, 66 - h + 3, 'white');
    bx += w + 1;
  }
  g.rect(34, 62, 8, 2, 'cream');
  g.rect(34, 64, 8, 2, 'paper');
  g.sprite(41, 60, SPR.camera, legend);
  g.setId(0);
  // bottom shelf: a stack of boxes
  g.rect(10, 74, 14, 10, 'cream');
  g.frame(10, 74, 14, 10, 'wood3');
  g.rect(26, 78, 12, 6, 'paper');
  g.frame(26, 78, 12, 6, 'grey3');

  // ---- window (right), transparent panes
  g.setId(18);
  g.rect(134, 6, 54, 58, 'wood3');
  g.rect(136, 8, 50, 54, 'wood2');
  g.clear(139, 11, 44, 48); // the sky shows through here
  g.rect(160, 11, 2, 48, 'white'); // mullions
  g.rect(139, 34, 44, 2, 'white');
  g.px(140, 12, 'glassline');
  g.px(141, 13, 'glassline');
  g.px(142, 14, 'glassline');
  g.rect(132, 62, 58, 4, 'wood2'); // sill
  g.hline(132, 62, 58, 'cream');
  g.hline(132, 65, 58, 'wood3');
  // curtains and rod
  g.setId(0);
  g.rect(126, 4, 66, 2, 'metal');
  g.px(126, 3, 'metal2');
  g.px(191, 3, 'metal2');
  for (let x = 127; x < 134; x += 1) g.vline(x, 6, 60, (x - 127) % 3 === 1 ? 'teal2' : 'teal');
  for (let x = 185; x < 192; x += 1) g.vline(x, 6, 60, (x - 185) % 3 === 1 ? 'teal2' : 'teal');
  g.rect(127, 40, 7, 2, 'gold');
  g.rect(185, 40, 7, 2, 'gold');

  // plant on the sill
  g.setId(16);
  g.sprite(140, 50, SPR.plant, legend);

  // ---- mini fridge under the window
  g.setId(15);
  g.rect(149, 67, 29, 20, 'grey2');
  g.rect(150, 68, 27, 18, 'white');
  g.frame(149, 67, 29, 20, 'grey');
  g.hline(150, 74, 27, 'grey');
  g.rect(173, 76, 2, 6, 'metal');
  g.rect(173, 69, 2, 3, 'metal');
  const magnets = [
    [154, 77, 'red'],
    [160, 80, 'blue'],
    [166, 76, 'yellow'],
    [156, 83, 'green'],
    [168, 83, 'purple'],
  ];
  for (const [mx, my, c] of magnets) g.rect(mx, my, 2, 2, c);
  g.rect(150, 86, 27, 1, 'grey3');

  // ---- posters over the desk
  const posterAt = (id, x, draw) => {
    g.setId(id);
    g.rect(x, 8, 22, 28, 'white');
    g.frame(x, 8, 22, 28, 'grey2');
    draw(x + 2, 10);
  };
  posterAt(8, 58, (x, y) => {
    g.rect(x, y, 18, 24, 'screen');
    g.rect(x + 11, y + 3, 4, 4, 'yellow2');
    g.rect(x + 2, y + 14, 3, 10, 'ink2');
    g.rect(x + 6, y + 11, 4, 13, 'ink2');
    g.rect(x + 11, y + 16, 3, 8, 'ink2');
    g.rect(x + 15, y + 13, 2, 11, 'ink2');
    g.px(x + 7, y + 13, 'yellow');
    g.px(x + 12, y + 19, 'yellow');
    g.rect(x, y + 20, 18, 4, 'red');
    g.hline(x + 3, y + 22, 8, 'white');
  });
  posterAt(9, 83, (x, y) => {
    g.rect(x, y, 18, 24, 'cream');
    g.rect(x + 5, y + 5, 8, 8, 'red');
    g.rect(x + 6, y + 4, 6, 10, 'red');
    g.rect(x + 4, y + 6, 10, 6, 'red');
    g.rect(x, y + 20, 18, 4, 'ink');
    g.hline(x + 2, y + 22, 6, 'cream');
    g.hline(x + 10, y + 22, 4, 'cream');
  });
  posterAt(10, 108, (x, y) => {
    g.rect(x, y, 18, 24, 'teal');
    g.rect(x + 3, y + 3, 5, 5, 'orange');
    g.rect(x + 4, y + 2, 3, 7, 'orange');
    for (let i = 0; i < 18; i += 1) {
      const h = [6, 8, 11, 13, 10, 8, 9, 12, 14, 12, 9, 7, 9, 11, 8, 6, 5, 4][i];
      g.vline(x + i, y + 24 - h, h, 'purple');
    }
    g.rect(x, y + 20, 18, 4, 'purple');
    g.hline(x + 2, y + 22, 9, 'cream');
  });

  // ---- the desk
  g.setId(0);
  g.rect(56, 69, 78, 2, 'wood3');
  g.rect(56, 66, 78, 3, 'wood');
  g.hline(56, 66, 78, 'wood2');
  g.rect(58, 71, 3, 15, 'wood3');
  g.rect(129, 71, 3, 15, 'wood3');
  // pc tower under the desk
  g.rect(62, 72, 9, 14, 'grey3');
  g.frame(62, 72, 9, 14, 'ink2');
  g.px(64, 75, 'led');
  g.hline(64, 78, 5, 'grey');
  g.hline(64, 80, 5, 'grey');
  g.hline(71, 85, 10, 'ink2'); // a cable

  // family photo, standing at the desk's left end
  g.setId(3);
  g.sprite(57, 57, SPR.photo, legend);

  // mug and steam
  g.setId(4);
  g.sprite(66, 60, SPR.mug, legend);
  g.setId(0);
  g.sprite(67, 55, SPR.steam[frame % 3], legend);

  // monitor one (landscape): code, scrolling
  g.setId(6);
  g.rect(67, 41, 32, 21, 'ink');
  g.rect(68, 42, 30, 19, 'screen');
  const lines = [14, 20, 9, 24, 12, 18, 16, 22, 10];
  for (let i = 0; i < 6; i += 1) {
    const len = lines[(i + frame) % lines.length];
    g.hline(70, 44 + i * 3, len, i % 3 === 1 ? 'screenlite' : 'screentext');
    if (i % 2 === 0) g.px(70 + len + 1, 44 + i * 3, 'screengreen');
  }
  g.rect(82, 62, 3, 4, 'grey3');
  g.rect(78, 65, 11, 1, 'grey');

  // monitor two (portrait): three papers
  g.setId(7);
  g.rect(101, 35, 15, 27, 'ink');
  g.rect(102, 36, 13, 25, 'screen2');
  g.rect(104, 38, 9, 6, 'paper');
  g.rect(104, 46, 9, 6, 'paper');
  g.rect(104, 54, 9, 5, 'paper');
  for (const yy of [39, 41, 47, 49, 55, 57]) g.hline(105, yy, 6, 'grey2');
  g.rect(108, 62, 2, 4, 'grey3');
  g.rect(105, 65, 8, 1, 'grey');

  // keyboard and mouse
  g.setId(0);
  g.rect(72, 63, 22, 3, 'grey2');
  g.sprite(72, 64, SPR.keyboardRow, legend);
  g.rect(96, 63, 4, 3, 'grey2');
  g.px(97, 63, 'ink2');

  // laptop, on a stand, showing a chat
  g.setId(5);
  g.rect(117, 56, 15, 9, 'ink');
  g.rect(118, 57, 13, 7, 'screen2');
  g.rect(119, 58, 6, 2, 'screenlite');
  g.rect(124, 61, 6, 2, 'screentext');
  g.rect(116, 65, 17, 2, 'grey2');
  g.hline(118, 65, 13, 'grey');

  // the clamp lamp, arm from the desk edge, head over the laptop
  g.setId(1);
  g.rect(126, 63, 7, 3, 'metal');
  for (let i = 0; i < 12; i += 1) g.px(129 - Math.floor(i / 1.4), 62 - i, 'metal2');
  g.rect(114, 46, 12, 2, 'metal2');
  g.rect(115, 48, 10, 3, 'metal');
  g.rect(116, 51, 8, 2, 'metal2');
  g.rect(117, 53, 6, 1, lampOn ? 'lamp' : 'lampoff');
  if (lampOn) {
    g.rect(118, 54, 4, 1, 'lamp');
    g.px(119, 55, 'lamp');
    g.px(120, 55, 'lamp');
  }

  // him: head, hoodie, arms typing; the chair
  g.setId(2);
  g.sprite(80, 49, SPR.head, legend);
  g.rect(75, 58, 20, 3, 'hoodie2'); // hood
  g.rect(73, 60, 24, 12, 'hoodie');
  g.rect(73, 60, 24, 1, 'hoodie2');
  g.rect(74, 66, 22, 6, 'hoodie2');
  const wob = frame % 2;
  g.rect(70, 62 + wob, 4, 3, 'hoodie');
  g.rect(96, 62 + (1 - wob), 4, 3, 'hoodie');
  g.rect(70, 65 + wob, 3, 1, 'skin');
  g.rect(97, 65 + (1 - wob), 3, 1, 'skin');
  g.setId(0);
  g.rect(74, 72, 22, 14, 'grey3');
  g.frame(74, 72, 22, 14, 'ink2');
  g.rect(76, 74, 18, 10, 'grey');
  g.rect(83, 86, 4, 6, 'ink2');
  g.rect(78, 92, 14, 2, 'ink2');
  g.rect(77, 94, 3, 2, 'ink');
  g.rect(83, 94, 4, 2, 'ink');
  g.rect(90, 94, 3, 2, 'ink');

  // football and boots on the floor
  g.setId(17);
  g.sprite(12, 96, SPR.ball, legend);
  g.sprite(26, 100, SPR.boot, legend);
  g.sprite(34, 101, SPR.boot, legend);

  // a bird, sometimes, through the window
  g.setId(0);
  if (bird) g.sprite(bird.x, bird.y, SPR.bird[bird.f % 2], legend);
}
