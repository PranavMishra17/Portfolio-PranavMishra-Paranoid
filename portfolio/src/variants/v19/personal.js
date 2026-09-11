// v19 — the personal shelf.
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

// Real cover art lives in public/assets/images/room/<id>.jpg, one flat folder for posters and
// books alike. If a file is there it is pixelated onto the wall or the shelf and clears to the
// real picture when pointed at; if it is not, the drawn one stays.
const bookCover = (id) => `/assets/images/room/${id}.jpg`;
const posterArt = (id) => `/assets/images/room/${id}.jpg`;

export const BOOKS = [
  {
    id: 'dune',
    cover: bookCover('dune'),
    title: 'Dune',
    author: 'Frank Herbert',
    note: 'Reading it now. I want to finish all three before Dune: Part Three comes out this December.',
    status: 'Reading',
    spine: '#9c6b3a',
    sample: false,
  },
  {
    id: 'antimemetics',
    cover: bookCover('antimemetics'),
    title: 'There Is No Antimemetics Division',
    author: 'qntm',
    note: 'One of the best science fiction books I have read. I really enjoy cosmic horror, and this whole genre.',
    status: 'Recent',
    spine: '#2f4858',
    sample: false,
  },
  {
    id: 'hitchhikers',
    cover: bookCover('hitchhikers'),
    title: 'The Hitchhiker’s Guide to the Galaxy',
    author: 'Douglas Adams',
    note: '“Once you know what the question actually is, you’ll know what the answer means.” That line has stuck with me since I read it years ago. I still stop and ask whether I am asking the right question, whatever I am working on, whether I am talking to myself or to the agents I write code with.',
    status: 'Favourite',
    spine: '#3f7d4f',
    sample: false,
  },
  {
    id: 'stranger',
    cover: bookCover('stranger'),
    title: 'The Stranger',
    author: 'Albert Camus',
    note: 'I like philosophy, and this was one of the best books to get into it. I loved the narrator: indifferent to everything around him, even his own life. Reading through his thought process, and wondering what that would be like, was really something.',
    status: 'Favourite',
    spine: '#b8452f',
    sample: false,
  },
];

export const POSTERS = [
  {
    id: 'hollywood',
    image: posterArt('hollywood'),
    title: 'Once Upon a Time in Hollywood',
    by: 'Quentin Tarantino',
    year: '2019',
    note: 'One of my comfort films. So well made, and it looks so beautiful; every scene is perfect. I can watch it any time.',
    palette: ['#e0a53c', '#8a2f22', '#f3e2c0'],
    sample: false,
  },
  {
    id: 'wasseypur',
    image: posterArt('wasseypur'),
    title: 'Gangs of Wasseypur',
    by: 'Anurag Kashyap',
    year: '2012',
    note: 'One of my all-time favourites, ever since I was a kid. It really hits home. It pays homage to the gangster films before it, but it has a place of its own.',
    palette: ['#b8352a', '#22201d', '#d9c9a8'],
    sample: false,
  },
  {
    id: 'dune2',
    image: posterArt('dune2'),
    title: 'Dune: Part Two',
    by: 'Denis Villeneuve',
    year: '2024',
    note: 'The best thing there is right now. I am waiting for Part Three, and I trust Villeneuve and his vision. Really excited to see where he takes it.',
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

// Two medals hanging off the end of the shelf: school.
export const MEDALS = [
  { id: 'md1', name: 'Swimming', note: 'High school swimming team.', sample: false },
  { id: 'md2', name: 'Football', note: 'High school football team.', sample: false },
];

export const FOOTBALL = {
  note: 'I played. The boots are still by the door.',
  sample: false,
};
