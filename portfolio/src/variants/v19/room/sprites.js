// v19 — him, as you actually see him: from behind, sunk into a chair that is bigger than he is.
//
// The old sprite was a whole standing person pasted in front of the chair, which is why he read
// as a toy. This one is a bust — head, neck, collar, shoulders — and the chair back is drawn
// over it, so what you see above the chair is a head and the top of two shoulders. That is what
// somebody at a desk looks like from the door.
//
// 28 wide, 28 tall — a head eighteen pixels across in a room two hundred and eighty-eight
// across, which is a person rather than a doll and still leaves the chair bigger than him.
//
// legend: h hair · H lighter hair, the strands · s skin · S shadowed skin · d shirt · D shirt shadow · w collar

export const LEGEND = {
  o: 'hood',
  O: 'hood2',
  s: 'skin',
  S: 'skin2',
  d: 'shirt',
  D: 'shirt2',
};

// The hood is up. From behind that is what you see: the hood over the head, coming to a point at
// the top, its seam down the middle, the jaw showing either side of it, the collar where it meets
// the shoulders, and the hoodie below.
const BUST = [
  '.............oo.............',
  '...........oooooo...........',
  '..........ooooOOoo..........',
  '.........ooooooOOooo........',
  '........oooooooOOoooo.......',
  '.......ooooooooOOooooo......',
  '.......ooooooooOOooooo......',
  '......oooooooooOOoooooo.....',
  '......oooooooooOOoooooo.....',
  '.....ssooooooooOOooooooSS...',
  '.....ssooooooooOOooooooSS...',
  '......soooooooooooooooS.....',
  '.......OOOOOOOOOOOOOOO......',
  '........oooooooooooOO.......',
  '........oooooooooooOO.......',
  '.......OOOOOOOOOOOOOOOO.....',
  '.....oooooooooooooooooooo...',
  '...ooooooooooooooooooooooo..',
  '..ddddoooooooooooooooooddddd',
  '.ddddddoooooooooooooooddddd.',
  'ddddddddddddDDddddddddddddd.',
  'ddddddddddddDDddddddddddddd.',
  'ddddddddddddDDddddddddddddd.',
  'ddddddddddddDDddddddddddddd.',
  'ddddddddddddDDddddddddddddd.',
  'ddddddddddddDDddddddddddddd.',
  'ddddddddddddDDddddddddddddd.',
  'ddddddddddddDDddddddddddddd.',
];

export const SIT = BUST;

// Asleep: the head has gone forward and to one side, so barely any of it clears the chair.
export const SLEEP = (() => {
  const rows = BUST.map((r) => r.split(''));
  const out = rows.map((r) => r.slice());
  const W = BUST[0].length;
  for (let y = 0; y < 15; y += 1) for (let x = 0; x < W; x += 1) out[y][x] = '.';
  for (let y = 0; y < 15; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const c = rows[y][x];
      if (c === '.') continue;
      const ny = y + 5;
      const nx = x + 3;
      if (ny < out.length && nx < W) out[ny][nx] = c;
    }
  }
  return out.map((r) => r.join(''));
})();

export const BUST_W = BUST[0].length;
export const COLLAR_ROW = 15; // where the shoulders start, for anything that needs to know
