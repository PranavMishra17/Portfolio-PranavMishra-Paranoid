// v19 — him, at a size that reads.
//
// 21 wide and 42 tall from the top of his head to where the desk hides him, which at 288×162
// makes him a person in a room rather than a figure on a shelf. Seen from behind and a little
// above, the way you see someone at a desk from the door.
//
// legend: h hair · s skin · S shadowed skin · d shirt · D shirt shadow · j denim · w collar · k ink

export const LEGEND = {
  h: 'hair',
  s: 'skin',
  S: 'skin2',
  d: 'shirt',
  D: 'shirt2',
  j: 'denim',
  w: 'white',
  k: 'ink',
};

const HEAD = [
  '.......hhhhhhh.......',
  '.....hhhhhhhhhhh.....',
  '....hhhhhhhhhhhhh....',
  '...hhhhhhhhhhhhhhh...',
  '...hhhhhhhhhhhhhhh...',
  '...hhhhhhhhhhhhhhh...',
  '..shhhhhhhhhhhhhhhS..',
  '..sshhhhhhhhhhhhhSS..',
  '...sshhhhhhhhhhhSS...',
  '....ssssssssssSSS....',
  '.....sssssssssSS.....',
  '.......sssssss.......',
  '........sssss........',
];

const BODY = [
  '......wwwwwwwww......',
  '....ddddddddddddd....',
  '...ddddddddddddddd...',
  '..ddddddddddddddddd..',
  '.ddddddddddddddddddd.',
  '.ddddDDDDDDDDDDDdddd.',
  'sddddDDDDDDDDDDDddddS',
  'sddddDDDDDDDDDDDddddS',
  'sdddddDDDDDDDDDdddddS',
  '.ddddddddddddddddddd.',
  '.ddddddddddddddddddd.',
  '.ddddddddddddddddddd.',
  '..ddddddddddddddddd..',
  '..ddddddddddddddddd..',
  '..ddddddddddddddddd..',
  '...ddddddddddddddd...',
  '...ddddddddddddddd...',
  '...jjjjjjjjjjjjjjj...',
  '...jjjjjjjjjjjjjjj...',
  '...jjjjjjjjjjjjjjj...',
  '...jjjjjjjjjjjjjjj...',
  '...jjjjjjjjjjjjjjj...',
  '...jjjjjjjjjjjjjjj...',
  '...jjjjjjjjjjjjjjj...',
  '...jjjjjjjjjjjjjjj...',
  '...jjjjjjjjjjjjjjj...',
  '...jjjjjjjjjjjjjjj...',
  '...jjjjjjjjjjjjjjj...',
  '...jjjjjjjjjjjjjjj...',
];

export const SIT = HEAD.concat(BODY);

// The near arm comes up and out. Two frames, so it moves.
function wave(frame) {
  const rows = SIT.map((r) => r.split(''));
  const up = frame === 0 ? 0 : 2;
  // sleeve rising from the right shoulder, hand at the top
  for (let i = 0; i < 9; i += 1) {
    const y = 19 - i - up;
    if (y < 2) continue;
    rows[y][19] = 'd';
    rows[y][20] = 'd';
  }
  const hy = 10 - up;
  if (hy >= 0) {
    rows[hy][19] = 's';
    rows[hy][20] = 's';
    if (hy - 1 >= 0) {
      rows[hy - 1][19] = 's';
      rows[hy - 1][20] = 's';
    }
  }
  // the arm no longer rests on the desk on that side
  for (let y = 19; y <= 21; y += 1) rows[y][20] = '.';
  return rows.map((r) => r.join(''));
}
export const WAVE = [wave(0), wave(1)];

// Asleep: the head has dropped forward and to one side, the shoulders have sagged.
export const SLEEP = (() => {
  const rows = SIT.map((r) => r.split(''));
  const out = rows.map((r) => r.slice());
  // head rows shift down four and right two
  for (let y = 0; y < 13; y += 1) for (let x = 0; x < 21; x += 1) out[y][x] = '.';
  for (let y = 0; y < 13; y += 1) {
    for (let x = 0; x < 21; x += 1) {
      const c = rows[y][x];
      if (c === '.') continue;
      const ny = y + 4;
      const nx = x + 2;
      if (ny < out.length && nx < 21) out[ny][nx] = c;
    }
  }
  // shoulders sag: the collar row goes
  for (let x = 0; x < 21; x += 1) if (out[13][x] === 'w') out[13][x] = 'd';
  return out.map((r) => r.join(''));
})();
