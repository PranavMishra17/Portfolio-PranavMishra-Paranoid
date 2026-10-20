// v19 — my story at alfred_, two ways of telling it, and a picker for choosing between them.
//
// The picker is for Pranav, not for visitors: it shows on localhost, or when the URL has ?pick.
// The choice is kept in this browser. Once he has chosen, set DEFAULT and the picker can go.
// **Words like this** are set in alfred_'s colour.

import React, { useEffect, useState } from 'react';

export const STORY = {
  // compact: three short beats, a label in the margin of each
  a: [
    ['Then', 'I joined as a founding engineer and built the **eval harness** and the **production scanner**: a number for every version of the agent, and an eye on what it does with real users.'],
    ['Now', "**Working memory**: your whole workday on one screen, kept current across email, calendar, meeting notes, Slack and Teams. A really interesting data problem."],
    ['Also', 'Making alfred_ the layer that **orchestrates and delegates**: routine workers, MCP apps, long-running tasks and workflows.'],
  ],
  // told straight through, as one paragraph
  b: [
    [null, "I joined alfred_ as a founding engineer. First I built the **eval harness** and the **production scanner**, so we could say in numbers which version of the agent was better, and see what it did with real users. Now I'm on **working memory**, a really interesting data problem: everything about your work, from email, calendar, meeting notes, Slack and Teams, condensed onto one screen and kept current. And I'm making alfred_ the layer that **orchestrates and delegates**: routine workers, MCP apps, long-running tasks and workflows."],
  ],
};


export const DEFAULT = { story: 'a' };

const KEY = 'v19.pick.3';
const EVENT = 'v19-pick';

function read() {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) || '{}');
    return { story: STORY[v.story] ? v.story : DEFAULT.story };
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
  return (
    <div className="v19-pick" role="group" aria-label="Choose a draft">
      <span className="v19-pick-row">
        <b>alfred_</b>
        {Object.keys(STORY).map((o) => (
          <button type="button" key={o} className={pick.story === o ? 'on' : ''} onClick={() => set('story', o)}>
            {o.toUpperCase()}
          </button>
        ))}
      </span>
    </div>
  );
}
