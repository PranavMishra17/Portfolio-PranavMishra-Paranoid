// v19 — drafts still being chosen on the landing, and a picker for choosing between them.
//
// The picker is for Pranav, not for visitors: it shows on localhost, or when the URL has ?pick.
// The choice is kept in this browser. Once he has chosen, set DEFAULT and the picker can go.

import React, { useEffect, useState } from 'react';

// the first sentence of the landing intro
export const OPEN = {
  1: 'I build the way games taught me to: make it, play it, find where it breaks.',
  2: 'Games taught me how to build: make it, play it, find where it breaks. I still work that way, just with AI now.',
  3: 'I learned to build by making games: make it, play it, find where it breaks. I do the same with AI.',
  4: 'Everything I know about building, I learned making games: make it, play it, find where it breaks.',
  5: 'I started out making games, and I never stopped building like that: make it, play it, find where it breaks.',
  6: 'I make things the way you make a game: build it, play it, find where it breaks.',
};

// where Letterboxd lives on the landing
export const FILMS = {
  a: 'Marquee: pointing at "watching films" lights a little cinema sign',
  b: 'Inline: the three dots sit after "films" and open into the name',
  c: 'Button: a Films button in the row with GitHub and LinkedIn',
};

export const DEFAULT = { open: '1', films: 'a' };

const KEY = 'v19.pick.4';
const EVENT = 'v19-pick';

function read() {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) || '{}');
    return {
      open: OPEN[v.open] ? String(v.open) : DEFAULT.open,
      films: FILMS[v.films] ? v.films : DEFAULT.films,
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
          title={opts[o]}
        >
          {o.toUpperCase()}
        </button>
      ))}
    </span>
  );
  return (
    <div className="v19-pick" role="group" aria-label="Choose a draft">
      {row('open', 'Opening', OPEN)}
      {row('films', 'Films', FILMS)}
    </div>
  );
}
