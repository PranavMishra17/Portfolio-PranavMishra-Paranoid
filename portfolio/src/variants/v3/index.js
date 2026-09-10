// Variant 3 — "A day, kept on the left."
//
// One sky runs from morning to sunset with scroll. The left rail is a sundial:
// each section sits at the hour it occupies, and a small sun travels down the
// line as you read. The room is the footer; its window is the next morning.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import './v3.css';
import Rail from './Rail';
import Room, { HOTSPOTS } from './Room';
import Sheet from './Sheet';
import Everything from './Everything';
import { AboutPanel, WorkPanel, PapersPanel, ProjectsPanel } from './panels';
import { useDay } from './sky';

const STATIONS = [
  { id: 'arrival', label: 'Arrival' },
  { id: 'work', label: 'The work' },
  { id: 'built', label: 'Built, written' },
  { id: 'room', label: 'The room' },
];

export default function V3() {
  const rootRef = useRef(null);
  const refs = useRef(STATIONS.map(() => React.createRef())).current;
  const [active, setActive] = useState(0);
  const [fracs, setFracs] = useState([]);
  const [sheet, setSheet] = useState(null);
  const [every, setEvery] = useState(false);
  const [hover, setHover] = useState(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    document.body.classList.add('v3-body');
    const prevTitle = document.title;
    document.title = 'Pranav Mishra';
    return () => {
      document.body.classList.remove('v3-body', 'v3-locked');
      document.title = prevTitle;
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 860px)');
    const sync = () => setCompact(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useDay(rootRef, refs, setActive, setFracs);

  const go = useCallback((i) => {
    const el = refs[i] && refs[i].current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'instant' : 'smooth', block: 'start' });
  }, [refs]);

  const openEverything = useCallback(() => setEvery(true), []);
  const closeEverything = useCallback(() => setEvery(false), []);
  const closeSheet = useCallback(() => setSheet(null), []);
  const goTop = useCallback(() => { setSheet(null); go(0); }, [go]);

  const caption = hover
    ? `${HOTSPOTS[hover].label} — ${HOTSPOTS[hover].opens}`
    : compact ? 'Tap anything to open it.' : 'Hover anything. Click to open it.';

  return (
    <div className="v3" ref={rootRef}>
      <div className="v3-sky" aria-hidden="true"><i className="v3-sunglow" /></div>
      <svg className="v3-ridge" viewBox="0 0 1440 160" preserveAspectRatio="none" aria-hidden="true">
        <path className="far" d="M0 96 C140 70 230 92 360 78 C500 62 560 40 700 58 C820 74 900 52 1020 66 C1160 82 1260 60 1440 84 L1440 160 L0 160 Z" />
        <path className="near" d="M0 128 C120 118 220 132 340 122 C470 112 540 96 680 110 C800 122 880 106 1000 118 C1140 132 1280 110 1440 126 L1440 160 L0 160 Z" />
      </svg>

      <Rail stations={STATIONS} fracs={fracs} active={active} onGo={go} />

      <main className="v3-main">
        <section className="v3-section v3-arrival" id="v3-arrival" ref={refs[0]}>
          <div className="v3-pane v3-arrival-pane">
            <h1 className="v3-h1">Pranav Pushkar Mishra</h1>
            <AboutPanel />
          </div>
        </section>

        <section className="v3-section" id="v3-work" ref={refs[1]} aria-labelledby="v3-work-h">
          <div className="v3-pane">
            <h2 className="v3-h2" id="v3-work-h">The work</h2>
            <WorkPanel />
          </div>
        </section>

        <section className="v3-section" id="v3-built" ref={refs[2]} aria-labelledby="v3-built-h">
          <div className="v3-pane">
            <h2 className="v3-h2" id="v3-built-h">Built</h2>
            <ProjectsPanel onSeeEverything={openEverything} />
          </div>
          <div className="v3-pane v3-pane-papers">
            <h2 className="v3-h2">Written</h2>
            <PapersPanel />
          </div>
        </section>

        <footer className="v3-section v3-roomsec" id="v3-room" ref={refs[3]} aria-labelledby="v3-room-h">
          <div className="v3-pane v3-room-pane">
            <div className="v3-room-head">
              <h2 className="v3-h2" id="v3-room-h">The room</h2>
              <p>
                How my room was in my bachelor days. Everything in it opens something.
                {compact ? ' On a phone the screens are off; the work and the projects are above.' : ' The monitors, laptop and wall screen show the same things as the sections above — nothing is written twice.'}
              </p>
            </div>
            <Room compact={compact} onOpen={setSheet} onHover={setHover} />
            <p className="v3-caption" aria-live="polite">{caption}</p>
            <p className="v3-colophon">
              Sunset. The window in the room is already on tomorrow morning. Computer science, University of Illinois Chicago. Metuchen, New Jersey.
            </p>
          </div>
        </footer>
      </main>

      <Sheet id={sheet} onClose={closeSheet} onSeeEverything={openEverything} onGoTop={goTop} />
      <Everything open={every} onClose={closeEverything} />
    </div>
  );
}
