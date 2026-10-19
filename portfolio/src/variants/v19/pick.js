// v19 — the two intros, three drafts of each, and a picker for choosing between them.
//
// The picker is for Pranav, not for visitors: it shows on localhost, or when the URL has ?pick. The choice
// is kept in this browser. Once he has chosen, set DEFAULT and the picker can go.

import React, { useEffect, useState } from 'react';

// on the landing, beside the face: what I do and what I love, not where I work
export const INTRO = {
  a: "I build AI that does real work: agentic apps, voice agents, and the memory and evals underneath that keep them honest. Off the clock it's football, and a lot of movies. Have a look around, or just say hi.",
  b: 'Applied AI is what I do: agents that take actions, voices that answer, and the plumbing that makes both reliable. I really love football, and I love movies. Explore the work, or get in touch.',
  c: "Agents, voice, and applied AI that ships. That's most of my days; the rest is football and films. The projects are all here, and so am I if you want to talk.",
};

// above Alfred_: what I have been doing there, in my words
export const NOW = {
  a: [
    'I joined Alfred_ and built the eval harness and the production scanner, so we could say in numbers which version of the agent was better.',
    "Now I'm on working memory, a really interesting data problem: everything about your work, from email, calendar, meeting notes, Slack and Teams, condensed onto one screen and kept current. And I'm making Alfred_ the layer that orchestrates and delegates: routine workers, MCP apps, long-running tasks and workflows.",
  ],
  b: [
    'First thing I built here: an eval harness and a production scanner, so every version of the agent came with a number.',
    "Now it's working memory, your whole workday on one screen and kept current across email, calendar, meetings, Slack and Teams, and making Alfred_ the layer that hands work to routines, MCP apps and long-running workflows.",
  ],
  c: [
    ['Then', 'the eval harness and the production scanner. A number for every version of the agent.'],
    ['Now', 'working memory. Email, calendar, meeting notes, Slack and Teams, condensed onto one screen and kept current.'],
    ['And', 'Alfred_ as the layer that orchestrates and delegates: routine workers, MCP apps, long-running tasks, workflows.'],
  ],
};

export const DEFAULT = { intro: 'a', now: 'a' };

const KEY = 'v19.pick';
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
        <button type="button" key={o} className={pick[k] === o ? 'on' : ''} onClick={() => set(k, o)}>
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
