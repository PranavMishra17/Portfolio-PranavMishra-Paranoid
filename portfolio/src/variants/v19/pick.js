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


// The landing intro: three drafts, all starting from the line he said is actually him.
export const INTRO = {
  a: "I came to AI from making games, and I still build that way: make it, play it, find where it breaks. Most of what I know I picked up mid-project: virtual patients in Unreal, computer vision, voice agents, two research papers, and now agents that five thousand people use every day. Outside of that, I love game development, film and football.",
  b: "I came to AI from making games, and I still build that way: make it, play it, find where it breaks. I usually start something before I know how to finish it, and learn what it needs on the way. That's how I ended up shipping voice agents, virtual patients in Unreal, two papers, and agents five thousand people rely on. I also love game development, film and football.",
  c: "I came to AI from making games, and I still build that way: make it, play it, find where it breaks. There's always something half-built on my desk, and it usually teaches me the next thing I need. Away from the desk: game development, film, football.",
};

export const DEFAULT = { story: 'a', intro: 'a' };

const KEY = 'v19.pick.3';
const EVENT = 'v19-pick';

function read() {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) || '{}');
    return {
      story: STORY[v.story] ? v.story : DEFAULT.story,
      intro: INTRO[v.intro] ? v.intro : DEFAULT.intro,
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
  return (
    <div className="v19-pick" role="group" aria-label="Choose a draft">
      <span className="v19-pick-row">
        <b>Landing</b>
        {Object.keys(INTRO).map((o) => (
          <button type="button" key={o} className={pick.intro === o ? 'on' : ''} onClick={() => set('intro', o)}>
            {o.toUpperCase()}
          </button>
        ))}
      </span>
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
