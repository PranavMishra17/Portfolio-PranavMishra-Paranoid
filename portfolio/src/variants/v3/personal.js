// Variant 3 — the personal objects in the room.
//
// EVERYTHING IN THIS FILE IS SAMPLE CONTENT. Pranav has not yet said which books,
// films, games, memories or photo caption are his. The titles below are well-known
// placeholders so the furniture can be seen with something on it. Each entry is
// flagged `sample: true` and the UI labels it as a sample. Replace, don't trust.

export const SAMPLE_NOTICE = 'Sample entries — not Pranav’s real picks. He hasn’t written this part yet.';

export const films = [
  { sample: true, title: 'Blade Runner 2049', year: 2017, why: 'Sample note. Why this is a favourite goes here — two sentences at most.', hue: '#5b7c99' },
  { sample: true, title: 'Spirited Away', year: 2001, why: 'Sample note. Why this is a favourite goes here.', hue: '#b8654a' },
  { sample: true, title: 'The Social Network', year: 2010, why: 'Sample note. Why this is a favourite goes here.', hue: '#3f5a6b' },
  { sample: true, title: 'Interstellar', year: 2014, why: 'Sample note. Why this is a favourite goes here.', hue: '#8a7d64' },
];

export const books = {
  reading: [
    { sample: true, title: 'Project Hail Mary', author: 'Andy Weir', hue: '#c96a4a' },
    { sample: true, title: 'The Pragmatic Programmer', author: 'Hunt & Thomas', hue: '#4a6b8a' },
  ],
  finished: [
    { sample: true, title: 'Dune', author: 'Frank Herbert', hue: '#b3904f' },
    { sample: true, title: 'Gödel, Escher, Bach', author: 'Douglas Hofstadter', hue: '#6d6f7d' },
    { sample: true, title: 'Sapiens', author: 'Yuval Noah Harari', hue: '#7e8f6c' },
    { sample: true, title: 'Snow Crash', author: 'Neal Stephenson', hue: '#9a5d6e' },
    { sample: true, title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', hue: '#5f7a86' },
  ],
};

export const games = [
  { sample: true, title: 'Outer Wilds', note: 'Sample note.', hue: '#d19a4b' },
  { sample: true, title: 'Hades', note: 'Sample note.', hue: '#a94848' },
  { sample: true, title: 'Portal 2', note: 'Sample note.', hue: '#5a8fb0' },
  { sample: true, title: 'Rocket League', note: 'Sample note.', hue: '#4f7bd0' },
  { sample: true, title: 'Celeste', note: 'Sample note.', hue: '#c96f9c' },
];

export const magnets = [
  { sample: true, place: 'Chicago', memory: 'Sample memory. A sentence or two about this place.', hue: '#c85a4c', shape: 'round' },
  { sample: true, place: 'Bengaluru', memory: 'Sample memory. A sentence or two about this place.', hue: '#e0a43a', shape: 'square' },
  { sample: true, place: 'Metuchen', memory: 'Sample memory. A sentence or two about this place.', hue: '#4d7fb3', shape: 'round' },
  { sample: true, place: 'New York', memory: 'Sample memory. A sentence or two about this place.', hue: '#5c8a5e', shape: 'square' },
  { sample: true, place: 'Cambridge, MA', memory: 'Sample memory. A sentence or two about this place.', hue: '#8a5f9e', shape: 'round' },
  { sample: true, place: 'Charlotte', memory: 'Sample memory. A sentence or two about this place.', hue: '#c07a52', shape: 'square' },
];

export const familyPhoto = {
  sample: true,
  caption: 'Sample caption. Where I come from — a few plain sentences about family and the place, written by Pranav, go here.',
};

export const football = {
  // "He used to play" is in the brief. The detail is still his to write.
  line: 'I used to play.',
  sample: true,
  detail: 'Sample detail. Position, the years, the team, the boots — whatever he wants to say about it.',
};
