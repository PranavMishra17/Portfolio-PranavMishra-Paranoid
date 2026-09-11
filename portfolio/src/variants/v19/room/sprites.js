// v19 — the figure, drawn bigger.
//
// He was 13 pixels wide in v18 and read as a smudge behind a chair. This one is 17 wide and
// 28 tall, with a face you can see, and he sits high enough to clear the chair back.
//
// legend: h hair · s skin · S shadowed skin · e eye · d shirt · D shirt shadow
//         j denim · J denim shadow · k ink (shoes, line) · w collar

export const LEGEND = {
  h: 'hair',
  s: 'skin',
  S: 'skin2',
  e: 'ink',
  d: 'shirt',
  D: 'shirt2',
  j: 'denim',
  J: 'ink2',
  k: 'ink',
  w: 'white',
};

const HEAD = [
  '.....hhhhh.....',
  '...hhhhhhhhh...',
  '..hhhhhhhhhhh..',
  '..hhsssssssSh..',
  '..hsssssssssS..',
  '..hssessesssS..',
  '..hssssssssSS..',
  '...ssssssssS...',
  '....SssssSS....',
  '.....sssss.....',
];

const TORSO = [
  '....wwwwww.....',
  '..dddddddddd...',
  '.dddddddddddd..',
  'sdddddddddddds.',
  'sdddddDDddddds.',
  'SdddddDDdddddS.',
  '.ddddddDDdddd..',
  '.ddddddDDdddd..',
  '..dddddddddd...',
];

const LEGS = {
  stand: ['..jjjjjjjjjj...', '..jjjjjjjjjj...', '...jjjj.jjjj...', '...jjj...jjj...', '...jjj...jjj...', '...jjj...jjj...', '..kkkk..kkkk...', '..kkkk..kkkk...'],
  stride1: ['..jjjjjjjjjj...', '..jjjjjjjjjj...', '..jjj.....jjj..', '.jjj.......jjj.', 'jjj.........jjj', 'jj...........jj', 'kkk.........kkk', 'kkk.........kkk'],
  stride2: ['..jjjjjjjjjj...', '..jjjjjjjjjj...', '..jjj....jjjj..', '..jjj.....jjj..', '.jjj.......jjj.', '.jj.........jj.', 'kkk.........kkk', '.kk.........kk.'],
};

const figure = (legs) => HEAD.concat(TORSO, legs);

export const WALK = [figure(LEGS.stride1), figure(LEGS.stand), figure(LEGS.stride2), figure(LEGS.stand)];
export const STAND = figure(LEGS.stand);

// Seated, seen from behind and a little to the side: the back of his head, shoulders, and a
// thigh going forward under the desk.
export const SIT = [
  '.....hhhhhh....',
  '...hhhhhhhhhh..',
  '..hhhhhhhhhhhh.',
  '..hhhhhhhhhhhh.',
  '..hhhssssshhh..',
  '..hhsssssshhh..',
  '...hsssssshh...',
  '....ssssss.....',
  '.....ssss......',
  '...wwwwwwww....',
  '..dddddddddd...',
  '.dddddddddddd..',
  '.dddddddddddd..',
  'Sddddd DDddddS.',
  'sdddddDDDddddS.',
  'sddddDDDDDdddd.',
  's.dddDDDDDddd.s',
  '..dddddddddd..s',
  '..jjjjjjjjjjj..',
  '..jjjjjjjjjjjj.',
  '..jjjjjjjjjjjj.',
  '...JJJ.....jjj.',
  '...JJJ.....jjj.',
  '...JJJ.....jjj.',
  '...kkk.....kkk.',
];

// The near arm comes up when you point at him.
export const WAVE = SIT.map((row, i) => {
  if (i === 11) return '.dddddddddddd.s';
  if (i === 12) return '.ddddddddddddss';
  if (i === 13) return 'Sddddd DDddddss';
  return row;
});

// Leaning back, hands behind the head — what he does when you click him.
export const LEAN = SIT.map((row, i) => {
  if (i === 9) return '.swwwwwwwwwws..';
  if (i === 10) return 'sddddddddddds..';
  if (i === 11) return 'sdddddddddddds.';
  return row;
});
