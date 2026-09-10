// v15 — "Blocking"
// A top-down floor plan of one room with five tape marks on the floor. The subject walks
// to whichever mark you pick; a camera on a dolly track slides and turns to cover her.
// The panel beside the plan is what that camera sees: one part of the portfolio per mark.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import './v15.css';

/* ------------------------------------------------------------------ content */

const MARKS = [
  {
    n: 1, id: 'about', x: 210, y: 118, tape: '#f5d90a', lens: 35, fov: 54,
    place: 'the window',
    direction: 'enters, stops at the window, does not turn round yet',
    title: 'Noor Haddad',
    body: [
      'Designs products for people who are in a hurry: check-in flows, ticket machines, the screen in the back of a taxi. Nine years of it. Lisbon since 2021, Beirut before that.',
      'Sees four films a week. Fourth row, aisle seat. Keeps a notebook of where people stood.',
    ],
  },
  {
    n: 2, id: 'work', x: 600, y: 205, tape: '#ff5ca8', lens: 50, fov: 40,
    place: 'the desk',
    direction: 'crosses to the desk, does not sit',
    title: 'The work',
    items: [
      { title: 'Metro ticket machine', meta: 'Lisbon · 2024', text: 'A ticket flow rebuilt around one question, asked once. Median time to a ticket went from 71 seconds to 19. The old machine had eleven screens; this one has three.' },
      { title: 'Pharmacy queue board', meta: 'Porto · 2023', text: 'A display for a chain of pharmacies that tells you how long you will wait, in a form you believe. The trick was showing who is ahead of you, not a number.' },
      { title: 'Seat picker with sightlines', meta: 'Cinema Ideal · 2022', text: 'A seat map for an independent cinema that shows what the screen will look like from the seat, not just where the seat is. Sales of the first three rows fell; complaints fell further.' },
    ],
  },
  {
    n: 3, id: 'watching', x: 215, y: 282, tape: '#5ef58a', lens: 85, fov: 24,
    place: 'the sofa',
    direction: 'sits; the only time in the scene she sits',
    title: 'How she watches',
    body: [
      'Fourth row, aisle: the screen fills the eyes and the aisle is an exit. No phone. A pencil.',
      'The notebook is a record of blocking. Who stood where, who moved first, how long the camera waited before it followed. Her working belief is that most of a scene is decided before anyone speaks, and that most of a product is too.',
    ],
  },
  {
    n: 4, id: 'kit', x: 655, y: 330, tape: '#5aa9ff', lens: 50, fov: 40,
    place: 'the shelf',
    direction: 'stands, pulls a book from the shelf, puts it back',
    title: 'The kit',
    body: [
      'Paper before any screen. Figma after. A stopwatch, because a flow that feels fast and a flow that is fast are different things and only one can be argued for.',
      'Interviews users in Portuguese, Arabic, English and French, and writes the copy herself in the first two.',
    ],
  },
  {
    n: 5, id: 'contact', x: 150, y: 430, tape: '#f2f2f2', lens: 24, fov: 74,
    place: 'the door',
    direction: 'to the door; turns back for the last line',
    title: 'Before she goes',
    body: [
      'Available for product work from January, in Lisbon or remote across two time zones. Available this week for a film, if it starts after seven.',
    ],
    links: [
      { label: 'noor@haddad.design', href: 'mailto:noor@haddad.design' },
      { label: 'read.cv/noorhaddad', href: 'https://read.cv/' },
      { label: 'Lisbon · WET', href: null },
    ],
  },
];

/* ------------------------------------------------------------------ geometry */

const TRACK = { y: 528, x0: 120, x1: 680 };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function wedgePath(fov, len) {
  const h = (fov / 2) * (Math.PI / 180);
  const x = len * Math.cos(h);
  const y = len * Math.sin(h);
  return `M0 0 L${x.toFixed(1)} ${(-y).toFixed(1)} A${len} ${len} 0 0 1 ${x.toFixed(1)} ${y.toFixed(1)} Z`;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fn = (e) => setReduced(e.matches);
    mq.addEventListener ? mq.addEventListener('change', fn) : mq.addListener(fn);
    return () => (mq.removeEventListener ? mq.removeEventListener('change', fn) : mq.removeListener(fn));
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ the plan */

function Tape({ m, active, onPick }) {
  return (
    <g
      className={`v15-mark${active ? ' is-active' : ''}`}
      transform={`translate(${m.x} ${m.y})`}
      onClick={() => onPick(m.n)}
      style={{ cursor: 'pointer' }}
    >
      <circle r="30" className="v15-mark-hit" />
      {active && <circle r="24" className="v15-mark-ring" />}
      {/* a T of gaffer tape */}
      <rect x="-13" y="-4" width="26" height="7" rx="1" fill={m.tape} transform="rotate(-6)" />
      <rect x="-3.5" y="2" width="7" height="15" rx="1" fill={m.tape} transform="rotate(-6)" />
      <text x="18" y="-8" className="v15-mark-num">{m.n}</text>
      <text x="18" y="8" className="v15-mark-place">{m.place}</text>
    </g>
  );
}

function Plan({ current, onPick }) {
  const m = MARKS[current - 1];
  const camX = clamp(m.x, TRACK.x0 + 12, TRACK.x1 - 12);
  const angle = (Math.atan2(m.y - TRACK.y, m.x - camX) * 180) / Math.PI;

  return (
    <svg className="v15-plan" viewBox="0 0 800 600" role="img" aria-label="Floor plan of the room with five tape marks, the subject, and a camera on a track">
      {/* floor */}
      <rect x="60" y="40" width="680" height="440" className="v15-floor" />
      {/* floor grid, faint */}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`gx${i}`} x1={60 + i * 56.67} y1="40" x2={60 + i * 56.67} y2="480" className="v15-grid" />
      ))}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={`gy${i}`} x1="60" y1={40 + i * 62.86} x2="740" y2={40 + i * 62.86} className="v15-grid" />
      ))}

      {/* camera coverage wedge — drawn under the furniture so text stays clean */}
      <g className="v15-cam-turn" style={{ transform: `translate(${camX}px, ${TRACK.y}px) rotate(${angle}deg)` }}>
        <path d={wedgePath(m.fov, 720)} className="v15-wedge" />
        <line x1="0" y1="0" x2="720" y2="0" className="v15-axis" />
      </g>

      {/* walls */}
      <rect x="60" y="40" width="680" height="440" className="v15-wall" />
      {/* window in the top wall */}
      <line x1="130" y1="40" x2="300" y2="40" className="v15-window" />
      <line x1="130" y1="34" x2="300" y2="34" className="v15-window" />
      <line x1="130" y1="46" x2="300" y2="46" className="v15-window" />
      {/* door, bottom-left, with swing */}
      <line x1="100" y1="480" x2="170" y2="480" className="v15-doorgap" />
      <line x1="100" y1="480" x2="100" y2="410" className="v15-door" />
      <path d="M100 410 A70 70 0 0 1 170 480" className="v15-swing" />

      {/* furniture */}
      <g className="v15-furn">
        <rect x="520" y="82" width="180" height="70" />                       {/* desk */}
        <text x="610" y="122" className="v15-furn-lbl">desk</text>
        <circle cx="610" cy="176" r="14" />                                    {/* chair */}
        <rect x="112" y="300" width="205" height="76" rx="8" />                {/* sofa */}
        <line x1="180" y1="300" x2="180" y2="376" />
        <line x1="249" y1="300" x2="249" y2="376" />
        <text x="214" y="345" className="v15-furn-lbl">sofa</text>
        <rect x="706" y="150" width="30" height="260" />                       {/* shelf */}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1="706" y1={186 + i * 32} x2="736" y2={186 + i * 32} />
        ))}
        <rect x="380" y="255" width="150" height="90" rx="45" className="v15-rug" />
        <text x="455" y="305" className="v15-furn-lbl">rug</text>
      </g>

      {/* the planned crosses, mark to mark */}
      <g className="v15-cross">
        {MARKS.slice(0, -1).map((a, i) => {
          const b = MARKS[i + 1];
          const dx = b.x - a.x; const dy = b.y - a.y; const L = Math.hypot(dx, dy);
          const ux = dx / L; const uy = dy / L;
          const sx = a.x + ux * 34; const sy = a.y + uy * 34;
          const ex = b.x - ux * 34; const ey = b.y - uy * 34;
          const ah = 7;
          const px = -uy; const py = ux;
          return (
            <g key={a.n}>
              <line x1={sx} y1={sy} x2={ex} y2={ey} />
              <path d={`M${ex} ${ey} L${ex - ux * ah + px * ah * 0.6} ${ey - uy * ah + py * ah * 0.6} L${ex - ux * ah - px * ah * 0.6} ${ey - uy * ah - py * ah * 0.6} Z`} className="v15-arrow" />
            </g>
          );
        })}
      </g>

      {/* tape marks */}
      {MARKS.map((mk) => <Tape key={mk.n} m={mk} active={mk.n === current} onPick={onPick} />)}

      {/* the subject */}
      <g className="v15-actor" style={{ transform: `translate(${m.x}px, ${m.y}px)` }}>
        <circle r="17" className="v15-actor-dot" />
        <text y="5.5" className="v15-actor-lbl">N</text>
      </g>

      {/* dolly track */}
      <g className="v15-track">
        <line x1={TRACK.x0} y1={TRACK.y - 7} x2={TRACK.x1} y2={TRACK.y - 7} />
        <line x1={TRACK.x0} y1={TRACK.y + 7} x2={TRACK.x1} y2={TRACK.y + 7} />
        {Array.from({ length: 20 }, (_, i) => (
          <line key={i} x1={TRACK.x0 + i * 29.5} y1={TRACK.y - 12} x2={TRACK.x0 + i * 29.5} y2={TRACK.y + 12} />
        ))}
        <text x={TRACK.x0} y={TRACK.y + 32} className="v15-track-lbl">dolly track</text>
      </g>

      {/* camera body slides along the track and turns with the wedge */}
      <g className="v15-cam" style={{ transform: `translate(${camX}px, ${TRACK.y}px)` }}>
        <g style={{ transform: `rotate(${angle}deg)` }} className="v15-cam-turn">
          <rect x="-14" y="-11" width="28" height="22" rx="3" className="v15-cam-body" />
          <rect x="14" y="-5" width="12" height="10" className="v15-cam-lens" />
        </g>
        <text y="-20" className="v15-cam-lbl">{m.lens}mm</text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ page */

export default function V15() {
  const [current, setCurrent] = useState(1);
  const [running, setRunning] = useState(false);
  const reduced = usePrefersReducedMotion();
  const runTimer = useRef(null);
  const panelRef = useRef(null);
  const m = useMemo(() => MARKS[current - 1], [current]);

  const stopRun = useCallback(() => {
    clearTimeout(runTimer.current);
    setRunning(false);
  }, []);

  const pick = useCallback((n) => {
    stopRun();
    setCurrent(n);
    if (window.innerWidth < 900 && panelRef.current) {
      const top = panelRef.current.getBoundingClientRect().top + window.scrollY - 12;
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    }
  }, [reduced, stopRun]);

  // "Run the blocking": step through the marks in order, like a rehearsal.
  const run = useCallback(() => {
    clearTimeout(runTimer.current);
    setRunning(true);
    setCurrent(1);
    let i = 1;
    const gap = reduced ? 1800 : 2600;
    const step = () => {
      i += 1;
      if (i > MARKS.length) { setRunning(false); return; }
      setCurrent(i);
      runTimer.current = setTimeout(step, gap);
    };
    runTimer.current = setTimeout(step, gap);
  }, [reduced]);

  useEffect(() => () => clearTimeout(runTimer.current), []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.target && /^(input|textarea|select|button|a)$/i.test(e.target.tagName)) return;
      if (/^[1-5]$/.test(e.key)) pick(Number(e.key));
      else if (e.key === 'ArrowRight') pick(Math.min(MARKS.length, current + 1));
      else if (e.key === 'ArrowLeft') pick(Math.max(1, current - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, pick]);

  return (
    <div className="v15" style={{ '--mark': m.tape }}>
      <header className="v15-head">
        <div className="v15-head-top">
          <span className="v15-kicker">Blocking</span>
          <span className="v15-meta">Sc. 7 · INT. NOOR’S FLAT — DUSK · rehearsal</span>
        </div>
        <p className="v15-how">
          Five tape marks on the floor. Pick one; Noor walks to it and the camera on the track
          swings to cover her. What that camera sees is in the frame beside the plan.
        </p>
      </header>

      <div className="v15-stage">
        <div className="v15-planwrap">
          <Plan current={current} onPick={pick} />

          <ol className="v15-sheet" aria-label="Blocking sheet">
            {MARKS.map((mk) => (
              <li key={mk.n}>
                <button
                  type="button"
                  className={`v15-sheet-btn${mk.n === current ? ' is-on' : ''}`}
                  onClick={() => pick(mk.n)}
                  aria-current={mk.n === current ? 'true' : undefined}
                >
                  <span className="v15-sheet-tape" style={{ background: mk.tape }} />
                  <b>{mk.n}</b>
                  <span className="v15-sheet-dir">{mk.direction}</span>
                  <span className="v15-sheet-what">{mk.title}</span>
                </button>
              </li>
            ))}
          </ol>

          <div className="v15-controls">
            <button type="button" className="v15-run" onClick={running ? stopRun : run} aria-pressed={running}>
              {running ? 'Stop' : 'Run the blocking'}
            </button>
            <span className="v15-keys">keys 1–5, ← →</span>
          </div>
        </div>

        <section className="v15-frame" ref={panelRef} aria-live="polite" aria-label={`What the camera sees at mark ${m.n}`}>
          <div className="v15-frame-bar">
            <span className="v15-frame-mark"><i style={{ background: m.tape }} />mark {m.n}</span>
            <span className="v15-frame-lens">{m.lens}mm · {m.fov}° · {m.place}</span>
          </div>
          <p className="v15-direction">({m.direction})</p>
          <h1 className="v15-title">{m.title}</h1>
          {m.body && m.body.map((p, i) => <p key={i} className="v15-p">{p}</p>)}
          {m.items && (
            <ul className="v15-items">
              {m.items.map((it) => (
                <li key={it.title}>
                  <h2>{it.title}</h2>
                  <span className="v15-item-meta">{it.meta}</span>
                  <p className="v15-p">{it.text}</p>
                </li>
              ))}
            </ul>
          )}
          {m.links && (
            <ul className="v15-links">
              {m.links.map((l) => (
                <li key={l.label}>{l.href ? <a href={l.href}>{l.label}</a> : <span>{l.label}</span>}</li>
              ))}
            </ul>
          )}
          <div className="v15-frame-foot">
            <button type="button" className="v15-step" onClick={() => pick(Math.max(1, current - 1))} disabled={current === 1}>← mark {Math.max(1, current - 1)}</button>
            <span>{current} / {MARKS.length}</span>
            <button type="button" className="v15-step" onClick={() => pick(Math.min(MARKS.length, current + 1))} disabled={current === MARKS.length}>mark {Math.min(MARKS.length, current + 1)} →</button>
          </div>
        </section>
      </div>
    </div>
  );
}
