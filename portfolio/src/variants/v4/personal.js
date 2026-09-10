// Variant 4 — personal content for the room.
//
// EVERYTHING in this file marked `sample: true` is a stand-in. Pranav has not
// chosen his books, films, games, magnet memories or the family-photo caption
// yet. These entries exist only so the furniture can be seen with something on
// it. The UI labels each one "sample". Replace them; nothing here is presented
// as his real favourite.

export const SAMPLE_NOTE =
  "These are sample entries so the shelf can be seen with something on it. Pranav hasn't chosen his own yet.";

export const films = [
  { sample: true, title: "Blade Runner 2049", year: 2017, why: "Sample line: a film picked for how it looks when nothing is happening.", tone: "#b9c7d3" },
  { sample: true, title: "Spirited Away", year: 2001, why: "Sample line: the kind of film you rewatch on a Sunday and notice a new corner of.", tone: "#c9c2a6" },
  { sample: true, title: "The Social Network", year: 2010, why: "Sample line: two hours of people typing, and somehow a thriller.", tone: "#d6b7a8" },
  { sample: true, title: "Interstellar", year: 2014, why: "Sample line: an excuse to talk about time, which he apparently likes doing.", tone: "#a9b8a4" },
];

export const books = [
  { sample: true, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", status: "reading", tone: "#b9c7d3", h: 84 },
  { sample: true, title: "Designing Data-Intensive Applications", author: "Martin Kleppmann", status: "reading", tone: "#c8a97e", h: 78 },
  { sample: true, title: "The Left Hand of Darkness", author: "Ursula K. Le Guin", status: "finished", tone: "#a8a0b8", h: 72 },
  { sample: true, title: "Norwegian Wood", author: "Haruki Murakami", status: "finished", tone: "#d6b7a8", h: 68 },
  { sample: true, title: "The Pragmatic Programmer", author: "Hunt & Thomas", status: "finished", tone: "#a9b8a4", h: 80 },
  { sample: true, title: "Dune", author: "Frank Herbert", status: "finished", tone: "#c9c2a6", h: 82 },
  { sample: true, title: "Klara and the Sun", author: "Kazuo Ishiguro", status: "finished", tone: "#e0c9a3", h: 70 },
];

export const games = [
  { sample: true, title: "Outer Wilds", note: "Sample line: a solar system that resets every twenty-two minutes.", tone: "#b9c7d3" },
  { sample: true, title: "Hollow Knight", note: "Sample line: patience, mostly.", tone: "#a8a0b8" },
  { sample: true, title: "Portal 2", note: "Sample line: still the best-written game about a room.", tone: "#c9c2a6" },
  { sample: true, title: "FIFA", note: "Sample line: played badly, with friends, for years.", tone: "#a9b8a4" },
  { sample: true, title: "Celeste", note: "Sample line: a game about climbing that is really about something else.", tone: "#d6b7a8" },
];

export const magnets = [
  { sample: true, place: "Bengaluru", memory: "Sample line: the first job, and a city that never really cooled down.", tone: "#c8a97e", x: 950, y: 440 },
  { sample: true, place: "Chicago", memory: "Sample line: the lake in February, which is a specific kind of cold.", tone: "#b9c7d3", x: 1010, y: 470 },
  { sample: true, place: "Metuchen", memory: "Sample line: home, and the train into the city.", tone: "#a9b8a4", x: 1080, y: 445 },
  { sample: true, place: "Cambridge", memory: "Sample line: a hackathon weekend that ended better than expected.", tone: "#d6b7a8", x: 970, y: 510 },
  { sample: true, place: "New York", memory: "Sample line: the current chapter.", tone: "#a8a0b8", x: 1050, y: 520 },
  { sample: true, place: "Goa", memory: "Sample line: one holiday that everybody still talks about.", tone: "#e0c9a3", x: 1005, y: 400 },
];

export const familyPhoto = {
  sample: true,
  caption: "Sample caption: where I come from, and who I call on Sundays. Pranav will write this one himself.",
};

export const football = {
  // The fact that he used to play is from the brief. The detail is a sample.
  line: "I used to play.",
  sample: true,
  detail: "Sample line: which position, which club, and why the boots are still by the door.",
};
