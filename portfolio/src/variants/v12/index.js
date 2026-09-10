// v12 — "Session 47"
// The page is a build under playtest, and the visitor is the tester. The right-hand
// column is the designer's observation log, written live from what the visitor actually
// does. Everything is local; nothing is sent anywhere.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './v12.css';

const BUILD = '0.9.4';
const SESSION = 47;

const PROJECTS = [
  {
    id: 'tidewater',
    title: 'Tidewater',
    meta: 'Co-op village sim · lead designer · 2024 · team of nine',
    thought: 'Two players sharing one boat will naturally share the catch.',
    did: 'They hoarded. All eleven pairs. Even the couples. One tester built a second boat so she would never have to see the first.',
    changed: 'Shrunk the hold until it fit one person’s haul. Sharing stopped being a virtue and became the only way home. Co-op retention went from 31% to 68% over the next three builds, and nobody was told to be nice.',
    note: 'Weather was cut in build 14. Not one tester mentioned it once it was gone.',
    log: 'Lingered on Tidewater. The card with a percentage in it always wins. Noted, again.'
  },
  {
    id: 'hollow-ledger',
    title: 'Hollow Ledger',
    meta: 'Deckbuilder · systems designer · 2023 · team of four',
    thought: 'If the cards are debts instead of powers, players will play carefully.',
    did: 'They played like nothing was at stake. Debt felt abstract until the collector arrived, and by then the run was already over. Testers called the game “fine”. Fine is the worst word in a playtest.',
    changed: 'Put the collector on the board from turn one, walking a single tile closer every round. Same rules, different information. Caution showed up on its own. “Fine” became “stressful”, which was the design.',
    note: 'The rarity system was wrong for six months. Deleting rarity altogether fixed it in an afternoon.',
    log: 'Lingered on Hollow Ledger. That one has the word “wrong” in it. People stop for that.'
  },
  {
    id: 'sixteen-rooms',
    title: 'Sixteen Rooms',
    meta: 'Stealth puzzle · level designer · 2022 · team of six',
    thought: 'Sixteen small rooms will feel bigger than four large ones.',
    did: 'True, but for the wrong reason. Testers did not feel space, they felt doors. Every door is a decision, and decisions take up room in your head.',
    changed: 'Whiteboxed the whole map twice more, moving doors instead of walls. The shipped map has nine rooms and twenty-two doors. The name stayed because the name tested well.',
    note: 'Room 11 was cut on the last day. It was my favourite. Nobody missed it.',
    log: 'Lingered on Sixteen Rooms. Level designers stop here. Everyone else stops at the boat.'
  },
  {
    id: 'ferry',
    title: 'Ferry',
    meta: 'Student project · everything · 2020 · team of one',
    thought: 'A game you can finish in the time a ferry crossing takes will be played on ferries.',
    did: 'It was played in bed. Every session log said 23:00 to 01:00. Nobody plays on ferries. They look at the water.',
    changed: 'Nothing. It shipped as it was. I learned to read the logs before I believe the pitch, including my own.',
    note: 'Still up. Still eleven minutes long.',
    log: 'Lingered on Ferry. The small one. Testers who read the small one usually write.'
  }
];

const SECTION_LINES = {
  about: 'Reached ABOUT. Most testers get here. This is where I find out if the name was enough.',
  work: 'Reached WORK. Four findings, not four pitches. Watching which one you stop on.',
  method: 'Reached METHOD. Sessions 1 to 46 say almost nobody reads this. It stays, because the ones who do are the ones I want.',
  debrief: 'Reached DEBRIEF. About one in three testers get this far. Thank you, 47.'
};

function fmt(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

function initialLines() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 0;
  const h = typeof window !== 'undefined' ? window.innerHeight : 0;
  return [
    { id: 0, t: '0:00', text: `Tester #${SESSION} opened build ${BUILD}. Viewport ${w}×${h}. Observer present.` },
    { id: 1, t: '0:00', text: 'Nothing is recorded. This log is drawn on your screen and dies with the tab.' }
  ];
}

export default function V12() {
  const [lines, setLines] = useState(initialLines);
  const [observing, setObserving] = useState(true);
  const [logOpen, setLogOpen] = useState(false);

  const start = useRef(Date.now());
  const nextId = useRef(2);
  const fired = useRef(new Set());
  const observingRef = useRef(true);
  const scrolled = useRef(false);
  const maxY = useRef(0);
  const lastY = useRef(0);
  const lastYAt = useRef(Date.now());
  const idleTimer = useRef(null);
  const hiddenAt = useRef(null);
  const logRef = useRef(null);
  const sections = useRef({});

  observingRef.current = observing;

  const push = useCallback((text, key) => {
    if (!observingRef.current) return;
    if (key) {
      if (fired.current.has(key)) return;
      fired.current.add(key);
    }
    const t = fmt(Date.now() - start.current);
    const id = nextId.current++;
    setLines((prev) => [...prev, { id, t, text }]);
  }, []);

  const armIdle = useCallback(() => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      push('Idle 20s. Reading, or gone. From here a log cannot tell the difference. That is the limit of logs.', 'idle-' + Math.floor((Date.now() - start.current) / 60000));
    }, 20000);
  }, [push]);

  useEffect(() => {
    // Re-stamp the opening line with the real viewport; some hosts report 0×0 at first render.
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (w && h) {
      setLines((prev) =>
        prev.map((l) =>
          l.id === 0 ? { ...l, text: `Tester #${SESSION} opened build ${BUILD}. Viewport ${w}×${h}. Observer present.` } : l
        )
      );
    }
    const t3 = setTimeout(() => {
      if (!scrolled.current) push('3s, no scroll. Reading the name, or deciding whether to. Both fine.', 'noscroll3');
    }, 3000);
    const t9 = setTimeout(() => {
      if (!scrolled.current) push('9s, still at the top. Either the first line is doing a lot of work, or none.', 'noscroll9');
    }, 9000);
    const t60 = setTimeout(() => {
      push('One minute. That is a long time on a portfolio. Either it is working or you are polite.', 'min1');
    }, 60000);
    const t180 = setTimeout(() => {
      push('Three minutes. I am going to stop narrating and let you read.', 'min3');
    }, 180000);

    const onScroll = () => {
      const y = window.scrollY;
      const now = Date.now();
      if (!scrolled.current && y > 24) {
        scrolled.current = true;
        push('First scroll. The top did its job, or it did not and this is you leaving. Cannot tell yet.', 'firstscroll');
      }
      if (y - lastY.current > 1800 && now - lastYAt.current < 400) {
        push('Jumped a long way in one go. Skimming is data too.', 'jump');
      }
      if (maxY.current > 900 && y < 120) {
        push('Scrolled back to the top. Missed something, or checking the name again. It is Ines.', 'backtop');
      }
      maxY.current = Math.max(maxY.current, y);
      lastY.current = y;
      lastYAt.current = now;

      const probe = y + window.innerHeight * 0.45;
      ['about', 'work', 'method', 'debrief'].forEach((key) => {
        const el = sections.current[key];
        if (el && el.offsetTop <= probe) push(SECTION_LINES[key], 'sec-' + key);
      });

      if (window.innerHeight + y >= document.documentElement.scrollHeight - 48) {
        push('Bottom of the build. There is nothing under here. I checked.', 'bottom');
      }
      armIdle();
    };

    const onVisibility = () => {
      if (document.hidden) {
        hiddenAt.current = Date.now();
        push('Tab left.', undefined);
      } else if (hiddenAt.current) {
        const away = Math.round((Date.now() - hiddenAt.current) / 1000);
        hiddenAt.current = null;
        push(`Tab back after ${away}s. Something else was more interesting. Not offended; that is the whole industry.`);
      }
    };

    let resizeT = null;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => push('Resized the window. Testing the build back. Fair.', 'resize'), 400);
    };

    let selT = null;
    const onSelect = () => {
      clearTimeout(selT);
      selT = setTimeout(() => {
        const s = window.getSelection && window.getSelection();
        if (s && s.toString().trim().length > 12) {
          push('Selected text. Copying, or reading with the cursor. Both count as reading.', 'select');
        }
      }, 500);
    };

    const onActivity = () => armIdle();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('pointermove', onActivity, { passive: true });
    window.addEventListener('keydown', onActivity);
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('selectionchange', onSelect);
    armIdle();
    // Land the section state for whatever the initial scroll position is, without
    // waiting on any observer.
    const t0 = setTimeout(onScroll, 50);

    return () => {
      [t0, t3, t9, t60, t180, idleTimer.current, resizeT, selT].forEach((t) => t && clearTimeout(t));
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onActivity);
      window.removeEventListener('keydown', onActivity);
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('selectionchange', onSelect);
    };
  }, [push, armIdle]);

  // Keep the log pinned to its newest line.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, logOpen]);

  const setSection = (key) => (el) => {
    sections.current[key] = el;
  };

  const toggleObserve = () => {
    if (observing) {
      push('Observer asked to stop. Stopping. The build is yours.');
      setObserving(false);
    } else {
      setObserving(true);
      observingRef.current = true;
      push('Observer back. Missed whatever happened in between, which is how playtests usually go.');
    }
  };

  const latest = lines[lines.length - 1];

  return (
    <div className="v12">
      <div className="v12-frame">
        <main className="v12-build" aria-label="Portfolio">
          <header className="v12-hero">
            <p className="v12-tag">Build {BUILD} · under test · session {SESSION}</p>
            <h1 className="v12-name">Ines Varga</h1>
            <p className="v12-line">
              Game designer. Systems and levels. Lisbon, sometimes Malmö. I ship the version that testers
              proved, not the one I pitched.
            </p>
            <p className="v12-pencil">
              You are the tester. The observer notes on this page are me watching you read it. It is a habit.
            </p>
          </header>

          <section className="v12-section" ref={setSection('about')} id="v12-about">
            <p className="v12-tag">Section 01 · About</p>
            <h2>What I do, in the words that survived forty-six sessions</h2>
            <p>
              I design the rules, the spaces the rules happen in, and the numbers that make both feel fair.
              Nine years, four shipped games, one still on a shelf. I write the playtest plan before I write
              the design doc, because the plan tells me what the doc is for.
            </p>
            <p>
              The thing I am best at is being wrong quickly. Every project below is a hypothesis that did
              not survive contact with a person, and what I did about it.
            </p>
          </section>

          <section className="v12-section" ref={setSection('work')} id="v12-work">
            <p className="v12-tag">Section 02 · Work</p>
            <h2>Four findings</h2>
            <div className="v12-findings">
              {PROJECTS.map((p, i) => (
                <article
                  key={p.id}
                  className="v12-finding"
                  onMouseEnter={() => push(p.log, 'proj-' + p.id)}
                  onClick={() => push(p.log, 'proj-' + p.id)}
                >
                  <div className="v12-finding-head">
                    <span className="v12-finding-num">{String(i + 1).padStart(2, '0')}</span>
                    <h3>{p.title}</h3>
                    <p className="v12-meta">{p.meta}</p>
                  </div>
                  <dl className="v12-rows">
                    <div className="v12-row">
                      <dt>We thought</dt>
                      <dd>{p.thought}</dd>
                    </div>
                    <div className="v12-row">
                      <dt>They did</dt>
                      <dd>{p.did}</dd>
                    </div>
                    <div className="v12-row">
                      <dt>We changed</dt>
                      <dd>{p.changed}</dd>
                    </div>
                  </dl>
                  <p className="v12-pencil v12-note">{p.note}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="v12-section" ref={setSection('method')} id="v12-method">
            <p className="v12-tag">Section 03 · Method</p>
            <h2>How a build gets from me to you</h2>
            <ol className="v12-method">
              <li>
                <strong>Whitebox before words.</strong> If a space cannot be walked in grey boxes, no amount of
                art will make it walkable.
              </li>
              <li>
                <strong>One number per session.</strong> Pick the number the build has to move. Watch only
                that. Everything else is a story you tell yourself afterwards.
              </li>
              <li>
                <strong>Cut on Thursday.</strong> Cuts made on Friday get argued about all weekend. Cuts made
                on Thursday get tested on Friday.
              </li>
              <li>
                <strong>Read the log, not the tester.</strong> Testers are kind. Logs are not.
              </li>
            </ol>
          </section>

          <section className="v12-section v12-debrief" ref={setSection('debrief')} id="v12-debrief">
            <p className="v12-tag">Section 04 · Debrief</p>
            <h2>What forty-six sessions taught me about this page</h2>
            <p>
              The name has to be first. Projects need a number in them. Nobody reads the method section, and
              the ones who do are the ones I want to work with. The contact line has to be a sentence, not a
              button.
            </p>
            <p className="v12-contact">
              If you have a build that is not doing what you thought it would, write to{' '}
              <a href="mailto:ines@example.com" onClick={() => push('Clicked the email. Session ends here; the rest happens off the log.', 'mail')}>
                ines@example.com
              </a>
              . I read logs for a living, and I would like to read yours.
            </p>
            <p className="v12-links">
              <a href="#v12-about" onClick={() => push('Opened the CV link. Checking the years line up. They do.', 'cv')}>CV</a>
              <span aria-hidden="true"> · </span>
              <a href="#v12-work" onClick={() => push('Opened the notes link. That is the good stuff.', 'notes')}>Playtest notes</a>
              <span aria-hidden="true"> · </span>
              <a href="#v12-debrief" onClick={() => push('Opened the talk link. Forty minutes on doors.', 'talk')}>A talk about doors</a>
            </p>
          </section>
        </main>

        <aside className={'v12-log' + (logOpen ? ' is-open' : '')} aria-label="Observation log">
          <div className="v12-log-head">
            <button type="button" className="v12-log-toggle" onClick={() => setLogOpen((o) => !o)} aria-expanded={logOpen}>
              <span className="v12-log-title">Observer notes · session {SESSION}</span>
              <span className="v12-log-latest">
                <span className="v12-stamp">{latest.t}</span> {latest.text}
              </span>
              <span className="v12-log-chev" aria-hidden="true">{logOpen ? '▾' : '▴'}</span>
            </button>
            <p className="v12-log-sub">
              Written live from what you do on this page. Local only.
              <button type="button" className="v12-observe" onClick={toggleObserve}>
                {observing ? 'Stop observing' : 'Resume'}
              </button>
            </p>
          </div>
          <ol className="v12-log-lines" ref={logRef}>
            {lines.map((l) => (
              <li key={l.id} className="v12-log-line">
                <span className="v12-stamp">{l.t}</span>
                <span className="v12-log-text">{l.text}</span>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
