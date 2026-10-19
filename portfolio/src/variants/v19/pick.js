// v19 — the two intros, and a picker for choosing between drafts of them.
//
// The picker is for Pranav, not for visitors: it shows on localhost, or when the URL has ?pick.
// The choice is kept in this browser. Once he has chosen, set DEFAULT and the picker can go.

import React, { useEffect, useState } from 'react';

// On the landing, beside the face: what I do, one more line, what I'm into. Never where I work.
// All three keep the same first line (draft B, his pick); they differ in the line after it and
// in how the interests are set.
const SAY = 'Applied AI is what I do: agents that take actions, voices that answer, and the plumbing that makes both reliable.';
const INTO = ['Game development', 'Film', 'Football'];
const CLOSE = 'Explore the work, or get in touch.';

export const INTRO = {
  a: {
    say: SAY,
    more: "I care most about the part that has to be right: memory that doesn't invent things, and evals that fail loudly.",
    into: 'Outside of that: game development, film and football.',
    close: CLOSE,
  },
  b: {
    say: SAY,
    more: 'I came to AI from making games, and I still build that way: make it, play it, find where it breaks.',
    list: INTO,
    close: CLOSE,
  },
  c: {
    say: SAY,
    more: 'I like owning the whole thing, from the model call to the screen someone actually uses.',
    into: "I'm also into game development, film and football.",
    close: CLOSE,
  },
};

// Above the five figures at Alfred_: draft A, his pick, in three beats. Each beat names the
// drawing that goes with it (see AlfredHead in sections/Work.js).
export const BEATS = [
  {
    k: 'Joined',
    d: 'evals',
    t: 'I joined Alfred_ and built the eval harness and the production scanner, so we could say in numbers which version of the agent was better.',
  },
  {
    k: 'Now',
    d: 'memory',
    t: "Now I'm on working memory, a really interesting data problem: everything about your work, from email, calendar, meeting notes, Slack and Teams, condensed onto one screen and kept current.",
  },
  {
    k: 'Also',
    d: 'orchestrate',
    t: "And I'm making Alfred_ the layer that orchestrates and delegates: routine workers, MCP apps, long-running tasks and workflows.",
  },
];

// Three layouts for the Alfred_ section; the words are the same in all three.
export const NOW = {
  a: 'Words left, the site right',
  b: 'Three beats, each with a drawing',
  c: 'The site first, beats as rows',
};

export const DEFAULT = { intro: 'b', now: 'a' };

const KEY = 'v19.pick.2'; // a new key: the old drafts are gone, so old choices mean nothing
const EVENT = 'v19-pick';

function read() {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) || '{}');
    return {
      intro: INTRO[v.intro] ? v.intro : DEFAULT.intro,
      now: NOW[v.now] ? v.now : DEFAULT.now,
    };
  } catch (err) {
    return DEFAULT;
  }
}

export function usePick() {
  const [pick, setPick] = useState(read);
  useEffect(() => {
    const on = () => setPick(read());
    window.addEventListener(EVENT, on);
    return () => window.removeEventListener(EVENT, on);
  }, []);
  return pick;
}

function set(k, v) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify({ ...read(), [k]: v }));
  } catch (err) {
    // no storage: the choice lasts until the page reloads
  }
  window.dispatchEvent(new Event(EVENT));
}

export function Picker() {
  const pick = usePick();
  const on =
    typeof window !== 'undefined' &&
    (/[?&]pick\b/.test(window.location.search) || /^(localhost|127\.0\.0\.1)$/.test(window.location.hostname));
  if (!on) return null;
  const row = (k, label, opts) => (
    <span className="v19-pick-row">
      <b>{label}</b>
      {Object.keys(opts).map((o) => (
        <button
          type="button"
          key={o}
          className={pick[k] === o ? 'on' : ''}
          onClick={() => set(k, o)}
          title={typeof opts[o] === 'string' ? opts[o] : undefined}
        >
          {o.toUpperCase()}
        </button>
      ))}
    </span>
  );
  return (
    <div className="v19-pick" role="group" aria-label="Choose a draft">
      {row('intro', 'Landing', INTRO)}
      {row('now', 'Alfred_', NOW)}
    </div>
  );
}
