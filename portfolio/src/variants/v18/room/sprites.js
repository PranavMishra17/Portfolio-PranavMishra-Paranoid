// v18 — the figure. Four walking frames, one sitting, drawn small enough to read at 288 wide.
//
// legend: h hair · s skin · S shadowed skin · d shirt · D shirt shadow · j denim · J denim shadow
//         k ink (shoes, line) · w white (collar)

export const LEGEND = {
  h: 'hair',
  s: 'skin',
  S: 'skin2',
  d: 'shirt',
  D: 'shirt2',
  j: 'denim',
  J: 'ink2',
  k: 'ink',
  w: 'white',
};

const HEAD = [
  '...hhhhh...',
  '..hhhhhhh..',
  '..hssssSh..',
  '..hssssSh..',
  '..ksssssS..',
  '...ssSss...',
  '....sss....',
];

const TORSO_A = [
  '..wwwwww...',
  '.dddddddd..',
  'sdddddddds.',
  'sdddddddds.',
  'SdddDDdddS.',
  '.dddDDddd..',
  '.dddDDddd..',
  '.ddddddd...',
];

const TORSO_B = [
  '..wwwwww...',
  '.dddddddd..',
  '.ddddddddd.',
  'sdddddddds.',
  'SdddDDdddS.',
  '.dddDDddd..',
  '.dddDDddd..',
  '.ddddddd...',
];

function figure(head, torso, legs) {
  return head.concat(torso, legs);
}

const LEGS = {
  stride1: ['..jjjjjjj..', '..jjjjjjj..', '..jj...jj..', '.jj.....jj.', '.jj.....jj.', 'jj.......jj', 'jj.......jj', 'kkk.....kkk'],
  pass: ['..jjjjjjj..', '..jjjjjjj..', '...jjjjj...', '...jj.jj...', '...jj.jj...', '...jj.jj...', '...jj.jj...', '..kkk.kkk..'],
  stride2: ['..jjjjjjj..', '..jjjjjjj..', '..jj...jj..', '..jj....jj.', '.jj.....jj.', '.jj......jj', 'jj.......jj', 'kkk.....kkk'],
  stand: ['..jjjjjjj..', '..jjjjjjj..', '...jjjjj...', '...jj.jj...', '...jj.jj...', '...jj.jj...', '...jj.jj...', '..kkk.kkk..'],
};

export const WALK = [
  figure(HEAD, TORSO_A, LEGS.stride1),
  figure(HEAD, TORSO_B, LEGS.pass),
  figure(HEAD, TORSO_A, LEGS.stride2),
  figure(HEAD, TORSO_B, LEGS.pass),
];

export const STAND = figure(HEAD, TORSO_A, LEGS.stand);

// Seated, seen from behind and slightly to the side: shoulders, head, a thigh going forward.
export const SIT = [
  '....hhhhh....',
  '...hhhhhhh...',
  '...hhssshh...',
  '...hssssss...',
  '....sssss....',
  '.....sss.....',
  '...wwwwww....',
  '..dddddddd...',
  '.dddddddddd..',
  '.dddddddddd..',
  'SdddDDDdddS..',
  'sdddDDDddds..',
  's.ddDDDdd..s.',
  '..ddddddd....',
  '..jjjjjjjjj..',
  '..jjjjjjjjjj.',
  '..jjjjjjjjjj.',
  '...JJ....jj..',
  '...JJ....jj..',
  '...JJ....jj..',
  '...kk....kk..',
];

// The same, with the near arm raised — used once, when you point at him.
export const WAVE = SIT.map((row, i) => {
  if (i === 10) return 'SdddDDDdddss';
  if (i === 9) return '.ddddddddd.s';
  if (i === 8) return '.dddddddddss';
  return row;
});
