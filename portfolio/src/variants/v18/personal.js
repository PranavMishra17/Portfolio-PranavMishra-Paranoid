// v18 — the personal shelf.
//
// Two kinds of entry live here and the difference matters:
//
//   sample: false  →  he told me this. Books and posters below are his, from his own words.
//   sample: true   →  furniture, so the shelf is not empty while he decides. Every one of these
//                     is drawn with a visible SAMPLE mark in the UI. Nothing here is presented
//                     as his actual favourite.
//
// One correction worth flagging: he asked for "There Is No Antimatter Division". The book is
// qntm's *There Is No Antimemetics Division* — spelled correctly below. If he meant a different
// book, this is the line to change.

export const BOOKS = [
  {
    id: 'dune',
    title: 'Dune',
    author: 'Frank Herbert',
    note: 'Working through the trilogy right now.',
    status: 'Reading',
    spine: '#9c6b3a',
    sample: false,
  },
  {
    id: 'antimemetics',
    title: 'There Is No Antimemetics Division',
    author: 'qntm',
    note: 'Read it recently. A horror novel about things you cannot remember having read.',
    status: 'Recent',
    spine: '#2f4858',
    sample: false,
  },
  {
    id: 'hitchhikers',
    title: 'The Hitchhiker’s Guide to the Galaxy',
    author: 'Douglas Adams',
    note: 'The one I actually love.',
    status: 'Favourite',
    spine: '#3f7d4f',
    sample: false,
  },
  {
    id: 'stranger',
    title: 'The Stranger',
    author: 'Albert Camus',
    note: 'Short, and it stays with you longer than its page count deserves.',
    status: 'Favourite',
    spine: '#b8452f',
    sample: false,
  },
];

export const POSTERS = [
  {
    id: 'hollywood',
    title: 'Once Upon a Time in Hollywood',
    by: 'Quentin Tarantino',
    year: '2019',
    note: 'Tarantino.',
    palette: ['#e0a53c', '#8a2f22', '#f3e2c0'],
    sample: false,
  },
  {
    id: 'wasseypur',
    title: 'Gangs of Wasseypur',
    by: 'Anurag Kashyap',
    year: '2012',
    note: 'Kashyap.',
    palette: ['#b8352a', '#22201d', '#d9c9a8'],
    sample: false,
  },
  {
    id: 'dune2',
    title: 'Dune: Part Two',
    by: 'Denis Villeneuve',
    year: '2024',
    note: 'Villeneuve.',
    palette: ['#c98a4b', '#3a2b21', '#e8d3ae'],
    sample: false,
  },
];

export const GAMES = [
  { id: 'g1', title: 'Disco Elysium', note: 'Sample — waiting on his real list.', spine: '#7a4b86', sample: true },
  { id: 'g2', title: 'Hollow Knight', note: 'Sample — waiting on his real list.', spine: '#2b4a6f', sample: true },
  { id: 'g3', title: 'Outer Wilds', note: 'Sample — waiting on his real list.', spine: '#c07a2e', sample: true },
  { id: 'g4', title: 'Hades', note: 'Sample — waiting on his real list.', spine: '#a33a3a', sample: true },
];

// The fridge. Each magnet is a small memory. All samples until he writes his own.
export const MAGNETS = [
  { id: 'm1', glyph: '✈', label: 'A ticket stub', note: 'Sample memory — his to replace.', tint: '#e2603a', sample: true },
  { id: 'm2', glyph: '⚽', label: 'A five-a-side league', note: 'Sample memory — his to replace.', tint: '#3f7d4f', sample: true },
  { id: 'm3', glyph: '★', label: 'A first demo that worked', note: 'Sample memory — his to replace.', tint: '#c08a3e', sample: true },
  { id: 'm4', glyph: '☕', label: 'A very long night', note: 'Sample memory — his to replace.', tint: '#2f4858', sample: true },
  { id: 'm5', glyph: '❒', label: 'A postcard from home', note: 'Sample memory — his to replace.', tint: '#8a4b6f', sample: true },
];

export const FAMILY = {
  caption: 'Sample caption — the family photo on the desk, and whatever he wants to say about it.',
  sample: true,
};

export const TROPHIES = [
  {
    id: 'mit',
    name: 'MIT XR 2024',
    what: 'First, for SnAIder-Cut — a mixed-reality room you edit by saying what you want changed.',
    image: '/assets/images/achievements/mit.png',
    sample: false,
  },
  {
    id: 'hint',
    name: 'HINT 5.0',
    what: 'First, for Virtual Van Gogh — a museum you walk through where the paintings are on a chain.',
    image: '/assets/images/achievements/hint.png',
    sample: false,
  },
];

export const FOOTBALL = {
  note: 'I played. The boots are still by the door.',
  sample: false,
};
