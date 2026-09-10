// Variant 1 — the personal objects in the room.
//
// EVERYTHING BELOW MARKED `sample: true` IS A PLACEHOLDER. Pranav has not said which books he reads,
// which films he loves, which games he plays, or what the magnets remember. These entries exist so
// the shelves are not empty while he looks at the layout. Replace them with his own; delete the
// `sample` flag when you do. Nothing here should be read as a fact about him.

export const SAMPLE_NOTE = 'Sample content. These are placeholders until Pranav fills the shelves himself.';

export const BOOKS = [
  { title: 'Dune', author: 'Frank Herbert', state: 'reading now', sample: true, spine: '#8c6a3f' },
  { title: 'The Left Hand of Darkness', author: 'Ursula K. Le Guin', state: 'recently finished', sample: true, spine: '#3f5f7a' },
  { title: 'Gödel, Escher, Bach', author: 'Douglas Hofstadter', state: 'recently finished', sample: true, spine: '#b8503f' },
  { title: 'The Design of Everyday Things', author: 'Don Norman', state: 'on the shelf', sample: true, spine: '#e2b13c' },
  { title: 'Snow Crash', author: 'Neal Stephenson', state: 'on the shelf', sample: true, spine: '#2f3b45' },
  { title: 'The Elements of Typographic Style', author: 'Robert Bringhurst', state: 'on the shelf', sample: true, spine: '#6d7c68' },
  { title: 'Invisible Cities', author: 'Italo Calvino', state: 'on the shelf', sample: true, spine: '#a9887b' },
];

export const FILMS = [
  { title: 'Blade Runner 2049', why: 'Sample. Why this one is a favourite goes here.', sample: true, tone: '#c9863f' },
  { title: 'Spirited Away', why: 'Sample. Why this one is a favourite goes here.', sample: true, tone: '#5b8f8a' },
  { title: 'Interstellar', why: 'Sample. Why this one is a favourite goes here.', sample: true, tone: '#3d4a63' },
  { title: 'The Grand Budapest Hotel', why: 'Sample. Why this one is a favourite goes here.', sample: true, tone: '#d98ca0' },
];

export const GAMES = [
  { title: 'Outer Wilds', note: 'playing now', sample: true, case: '#3b5b7d' },
  { title: 'Hades', note: 'finished', sample: true, case: '#a63d3d' },
  { title: 'Portal 2', note: 'replayed', sample: true, case: '#e08a2c' },
  { title: 'FIFA', note: 'with friends', sample: true, case: '#2e7d4f' },
  { title: 'Celeste', note: 'finished', sample: true, case: '#7a4e8f' },
];

export const MAGNETS = [
  { place: 'Chicago', memory: 'Sample. A small memory behind this magnet goes here.', sample: true, color: '#c96a5a' },
  { place: 'New York', memory: 'Sample. A small memory behind this magnet goes here.', sample: true, color: '#3f6f9a' },
  { place: 'Bengaluru', memory: 'Sample. A small memory behind this magnet goes here.', sample: true, color: '#e0b43c' },
  { place: 'Cambridge, MA', memory: 'Sample. A small memory behind this magnet goes here.', sample: true, color: '#5b8f6a' },
  { place: 'Metuchen', memory: 'Sample. A small memory behind this magnet goes here.', sample: true, color: '#8a5a9a' },
  { place: 'Charlotte', memory: 'Sample. A small memory behind this magnet goes here.', sample: true, color: '#d97a4a' },
];

export const FAMILY_PHOTO = {
  caption: 'Sample caption. Where I come from goes here, in my own words.',
  sample: true,
};

export const FOOTBALL = {
  line: 'I used to play. The boots stay by the door out of habit.',
  // "He used to play" is in the brief; the second sentence is mine and should be replaced by his.
  sample: true,
};
