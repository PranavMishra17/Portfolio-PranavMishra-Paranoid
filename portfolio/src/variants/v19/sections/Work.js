// v19 — the work. Alfred_ takes the whole first screen and nothing else is on it.
//
// One mono line, one heading, one paragraph. Then five figures: a before struck through, an
// after that counts up, a line saying what it is. Point at one and the number counts again and
// the drawing underneath changes to that one specific thing. Click and the why opens BESIDE the
// drawing, never over it: from the left two boxes the note takes the left and the drawing moves
// right; from the other three the drawing stays left and the note takes the right.
//
// Underneath the fold: WheelPrice, shut, as one bar with a car on it. Point at the car and its
// wheels spin up, it tears off to the left, comes back in from the right and slides to a stop
// where it was. It opens into the same shape at half the size, with its own drawings. Everything
// before that is one after-note, shut.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALFRED, AFTER, AFTER_LINE, FIGURES, WHEELPRICE } from '../copy';
import { useOnScreen, useOpener } from '../hooks';

/* A number that counts to itself when it first arrives on screen, and again whenever you point
   at it. */
function Tick({ value, run, again }) {
  const [shown, setShown] = useState(value);
  const numeric = useMemo(() => {
    const m = String(value).match(/^(−?-?\$?)(\d+(?:[.,]\d+)?)(.*)$/);
    return m ? { sign: m[1], n: parseFloat(m[2].replace(',', '')), tail: m[3], comma: m[2].includes(',') } : null;
  }, [value]);

  useEffect(() => {
    if (!run || !numeric) {
      setShown(value);
      return undefined;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 780;
    const fmt = (v) => {
      const s = numeric.n % 1 ? v.toFixed(1) : String(Math.round(v));
      return numeric.comma ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s;
    };
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - (1 - t) ** 3;
      setShown(`${numeric.sign}${fmt(numeric.n * e)}${numeric.tail}`);
      if (t < 1) raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    // rAF may never run; land the real value regardless
    const guard = window.setTimeout(() => setShown(value), 1200);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(guard);
    };
  }, [run, again, numeric, value]);

  return <span>{shown}</span>;
}

/* ── the drawings ─────────────────────────────────────────────────────
   Small, line-drawn, and about one figure only. A handful of shared shapes — cells, a flow,
   bars, a rise — and a bespoke drawing wherever the figure deserves one. */

/* **these** are bold. Nothing else is markup. */
function Rich({ text }) {
  const parts = String(text).split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) => (i % 2 ? <b key={i}>{p}</b> : <React.Fragment key={i}>{p}</React.Fragment>))}
    </>
  );
}

const T = ({ x, y, cls, children, anchor }) => (
  <text className={`v19-sk-t${cls ? ` ${cls}` : ''}`} x={x} y={y} textAnchor={anchor}>{children}</text>
);

const SVG = ({ alt, children }) => (
  <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label={alt}>{children}</svg>
);

/* A run of cells; some are the ones that matter. */
function Cells({ s }) {
  const n = s.n || 12;
  const hot = new Set(s.hot || []);
  const bw = Math.min(18, Math.floor(400 / n) - 4);
  return (
    <SVG alt={s.alt}>
      <T x={0} y={20}>{s.head}</T>
      {Array.from({ length: n }).map((_, i) => (
        <rect key={i} className={`v19-sk-tick-box${hot.has(i) ? ' is-hot' : ''}`} style={{ '--i': i }} x={4 + i * (bw + 4)} y={30} width={bw} height={bw} rx="2" />
      ))}
      <T x={n * (bw + 4) + 14} y={30 + bw * 0.7} cls="is-hot">{s.tail}</T>
      <T x={0} y={66} cls={s.strike ? 'is-was' : 'is-small'}>{s.foot}</T>
    </SVG>
  );
}

/* Boxes joined by arrows; a bead runs the path; the last box is the point. */
function Flow({ s }) {
  const nodes = s.nodes;
  const widths = nodes.map((nd) => Math.max(58, Math.round(nd.length * 6.6 + 20)));
  const total = widths.reduce((acc, v) => acc + v, 0);
  const gap = Math.max(14, Math.floor((520 - total) / Math.max(1, nodes.length - 1)));
  const xs = [];
  let cur = 0;
  widths.forEach((bw) => { xs.push(cur); cur += bw + gap; });
  const last = nodes.length - 1;
  return (
    <SVG alt={s.alt}>
      {nodes.map((nd, i) => (
        <g key={nd}>
          <rect className={`v19-sk-box${i === last ? ' is-end' : ''}`} x={xs[i]} y="18" width={widths[i]} height="30" rx="3" />
          <T x={xs[i] + widths[i] / 2} y={37} cls="is-mid is-centre">{nd}</T>
          {i < last ? <path className="v19-sk-path" d={`M${xs[i] + widths[i]} 33 H${xs[i + 1]}`} /> : null}
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <circle key={i} className="v19-sk-bead is-run" style={{ '--i': i, '--to': `${xs[last] - xs[0] - widths[0]}px` }} cx={xs[0] + widths[0]} cy="33" r="3.4" />
      ))}
      {s.drop ? (
        <g className="v19-sk-fail">
          <path className="v19-sk-cross" d={`M${xs[1] + widths[1] + 6} 56 l10 10 M${xs[1] + widths[1] + 16} 56 l-10 10`} />
          <T x={xs[1] + widths[1] + 30} y={66} cls="is-small is-was">{s.drop}</T>
        </g>
      ) : (
        <T x={0} y={66} cls="is-small">{s.foot}</T>
      )}
    </SVG>
  );
}

/* Bars, side by side, growing to their value. */
function Bars({ s }) {
  const rows = s.rows;
  const rh = Math.min(16, Math.floor(60 / rows.length) - 4);
  return (
    <SVG alt={s.alt}>
      {rows.map((r, i) => {
        const y = 6 + i * (rh + 6);
        return (
          <g key={r.k}>
            <T x={0} y={y + rh - 3}>{r.k}</T>
            <rect className={`v19-sk-grow${r.hot ? ' is-hot' : ''}`} style={{ '--i': i }} x="150" y={y} width={Math.round(300 * r.w)} height={rh} rx="2" />
            <T x={156 + Math.round(300 * r.w)} y={y + rh - 3} cls={r.hot ? 'is-hot' : 'is-small'}>{r.v}</T>
          </g>
        );
      })}
    </SVG>
  );
}

/* A rise: columns climbing left to right, to a number. */
function Rise({ s }) {
  const cols = s.cols;
  const cw = Math.floor(360 / cols.length) - 5;
  return (
    <SVG alt={s.alt}>
      <T x={0} y={40}>{s.head}</T>
      {cols.map((h, i) => (
        <rect key={i} className={`v19-sk-col${i === cols.length - 1 ? ' is-hot' : ''}`} style={{ '--i': i }} x={100 + i * (cw + 5)} y={60 - Math.round(h * 52)} width={cw} height={Math.round(h * 52)} rx="1.5" />
      ))}
      <T x={470} y={20} cls="is-hot">{s.tail}</T>
      <T x={100} y={72} cls="is-small">{s.foot}</T>
    </SVG>
  );
}

/* A wheel coming off a car, and a different one going on. */
function Swap({ s }) {
  return (
    <SVG alt={s.alt}>
      <path className="v19-sk-path is-body" d="M60 44 L90 20 H200 L240 44 H300 V56 H40 V44 Z" />
      <circle className="v19-sk-wheel is-old" cx="100" cy="56" r="12" />
      <g className="v19-sk-wheel is-new">
        <circle cx="240" cy="56" r="12" />
        <path d="M240 44 V68 M228 56 H252 M231.5 47.5 L248.5 64.5 M248.5 47.5 L231.5 64.5" />
      </g>
      <T x={330} y={40} cls="is-was">{s.head}</T>
      <T x={330} y={60} cls="is-small">{s.foot}</T>
    </SVG>
  );
}

/* The migration: three providers on lanes, polled on a timer, switched to events over one week. */
function Migrate() {
  const lanes = ['Gmail', 'Graph', 'IMAP'];
  return (
    <SVG alt="Three mail providers moved from polling to event-driven ingress in one week">
      {lanes.map((l, i) => {
        const y = 12 + i * 18;
        return (
          <g key={l}>
            <T x={0} y={y + 4}>{l}</T>
            <line className="v19-sk-rule is-dash" x1="48" y1={y} x2="212" y2={y} />
            {[0, 1, 2].map((k) => (
              <circle key={k} className="v19-sk-poll" style={{ '--i': i * 3 + k }} cx={70 + k * 60} cy={y} r="2.6" />
            ))}
            <line className="v19-sk-rule is-live" x1="300" y1={y} x2="470" y2={y} />
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <rect key={k} className="v19-sk-pulse" style={{ '--i': i * 6 + k }} x={306 + k * 28} y={y - 4} width="3" height="8" rx="1" />
            ))}
          </g>
        );
      })}
      <rect className="v19-sk-cut" x="228" y="4" width="58" height="52" rx="3" />
      <T x={257} y={26} cls="is-mid is-centre">one</T>
      <T x={257} y={40} cls="is-mid is-centre">week</T>
      <T x={48} y={66} cls="is-was">polled, about 90 s late</T>
      <T x={470} y={66} cls="is-hot" anchor="end">on the event, about 3 s</T>
    </SVG>
  );
}

/* Working memory, the pipeline. Code builds the menu, the model only picks and writes prose, code puts the facts back. */
function Strict() {
  const rows = ['the lease renewal', 'invoice 4471', 'Tuesday with Ana'];
  return (
    <SVG alt="The model chooses from real candidates behind opaque handles and never writes an identifier">
      <T x={0} y={12} cls="is-small">real threads, from code</T>
      {rows.map((r, i) => (
        <g key={r} className="v19-sk-row" style={{ '--i': i }}>
          <rect className={`v19-sk-tag${i === 1 ? ' is-hot' : ''}`} x="0" y={18 + i * 16} width="22" height="11" rx="2" />
          <T x={11} y={26 + i * 16} cls="is-tag is-centre">{['#a', '#b', '#c'][i]}</T>
          <T x={28} y={27 + i * 16} cls={i === 1 ? 'is-mid' : undefined}>{r}</T>
        </g>
      ))}
      <path className="v19-sk-path" d="M170 34 H220" />
      <rect className="v19-sk-box" x="220" y="19" width="70" height="30" rx="3" />
      <T x={255} y={38} cls="is-mid is-centre">model</T>
      <path className="v19-sk-path" d="M290 34 H340" />
      <rect className="v19-sk-bubble" x="340" y="12" width="176" height="44" rx="5" />
      <T x={352} y={30} cls="is-say">“you still owe them a reply”</T>
      <g className="v19-sk-pass">
        <rect className="v19-sk-tag is-hot" x="352" y="36" width="22" height="11" rx="2" />
        <T x={363} y={44} cls="is-tag is-centre">#b</T>
        <T x={380} y={45} cls="is-small">re-attached by code</T>
      </g>
      <T x={220} y={66} cls="is-small">picks a handle, writes words, never an id</T>
    </SVG>
  );
}

/* The connector: the anatomy of one call, before and after. */
function CallTime() {
  return (
    <SVG alt="One call: 721 milliseconds of booting before, one lookup after">
      <T x={0} y={18}>one call, before</T>
      <rect className="v19-sk-grow" style={{ '--i': 0 }} x="120" y="8" width="360" height="12" rx="2" />
      <T x={126} y={17} cls="is-tag">booting a 30 MB dependency tree</T>
      <rect className="v19-sk-grow is-hot" style={{ '--i': 1 }} x="480" y="8" width="8" height="12" rx="2" />
      <T x={492} y={17} cls="is-small">work</T>
      <T x={0} y={46}>one call, now</T>
      <rect className="v19-sk-grow is-hot" style={{ '--i': 2 }} x="120" y="36" width="12" height="12" rx="2" />
      <rect className="v19-sk-grow is-hot" style={{ '--i': 3 }} x="136" y="36" width="8" height="12" rx="2" />
      <T x={150} y={45} cls="is-hot">lookup · work</T>
      <T x={0} y={68} cls="is-small">98.3% of all traffic was the grey bar</T>
    </SVG>
  );
}

/* The harness: scenarios by run, a grid, a few cells wrong. */
function Scenarios() {
  const rows = 4;
  const cols = 14;
  const bad = new Set([9, 30, 47]);
  return (
    <SVG alt="A grid of scenarios against runs; three cells fail">
      <T x={0} y={14} cls="is-small">scenarios</T>
      <T x={500} y={14} cls="is-small" anchor="end">runs</T>
      {Array.from({ length: rows * cols }).map((_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        return <rect key={i} className={`v19-sk-tick-box${bad.has(i) ? ' is-hot' : ' is-ok'}`} style={{ '--i': i }} x={4 + c * 35} y={20 + r * 11} width="31" height="8" rx="1.5" />;
      })}
      <T x={0} y={72} cls="is-small">every change runs the whole grid; a red cell is a regression</T>
    </SVG>
  );
}

/* Context: the turn's time budget, and how little of it retrieval takes now. */
function Budget() {
  return (
    <SVG alt="The time a turn has, and how little of it retrieval takes now">
      <T x={0} y={12} cls="is-small">the time a turn has</T>
      <rect className="v19-sk-tape" x="0" y="18" width="500" height="16" rx="3" />
      <rect className="v19-sk-grow is-was-bar" style={{ '--i': 0 }} x="0" y="18" width="290" height="16" rx="3" />
      <T x={8} y={29} cls="is-tag">retrieval, on request</T>
      <T x={300} y={29} cls="is-was">left for the answer</T>
      <rect className="v19-sk-tape" x="0" y="48" width="500" height="16" rx="3" />
      <rect className="v19-sk-grow is-hot" style={{ '--i': 1 }} x="0" y="48" width="26" height="16" rx="3" />
      <T x={34} y={59} cls="is-hot">ahead of the turn</T>
      <T x={496} y={59} cls="is-small" anchor="end">the rest is the answer</T>
    </SVG>
  );
}

function Sketch({ s }) {
  if (!s) return null;
  switch (s.kind) {
    case 'cells': return <Cells s={s} />;
    case 'flow': return <Flow s={s} />;
    case 'bars': return <Bars s={s} />;
    case 'rise': return <Rise s={s} />;
    case 'swap': return <Swap s={s} />;
    case 'migrate': return <Migrate />;
    case 'strict': return <Strict />;
    case 'calltime': return <CallTime />;
    case 'scenarios': return <Scenarios />;
    case 'budget': return <Budget />;
    default: return null;
  }
}

/* One figure: the before, the after, the line. */
function Dial({ f, live, isOpen, run, onLive, onPick }) {
  return (
    <div
      className={`v19-dial${live ? ' is-live' : ''}${isOpen ? ' is-open' : ''}`}
      onMouseEnter={() => onLive(f.id)}
      data-keep-open={isOpen ? '' : undefined}
    >
      <button
        type="button"
        className="v19-dial-face"
        onClick={() => {
          onLive(f.id);
          onPick(f.id);
        }}
        aria-expanded={isOpen}
        data-keep-open=""
      >
        <span className="v19-dial-was">{f.was}</span>
        <span className={`v19-dial-now${String(f.now).length > 9 ? ' is-long' : ''}`}>
          <Tick value={f.now} run={run} again={live} />
        </span>
        <span className="v19-dial-label">{f.label}</span>
        <span className="v19-dial-mark" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
    </div>
  );
}

/* The row under the dials: the drawing, and the note beside it when one is open. Once a box
   is open, pointing at another box shows that one's drawing and note, so you can read across
   the row without clicking again. Which side the note takes depends on which column the shown
   box is in, so it never covers the drawing. */
function Row({ figures, live, open, cols = 5 }) {
  const opened = figures.find((f) => f.id === open);
  const hovered = figures.find((f) => f.id === live);
  const figure = (opened && hovered) || opened || hovered || figures[0];
  const col = opened ? figures.indexOf(figure) % cols : -1;
  const noteLeft = opened && col < 2;
  const s = figure.sketch;
  return (
    <div className={`v19-sk-row${opened ? ' has-note' : ''}${noteLeft ? ' note-left' : ''}`}>
      {opened ? (
        <div className="v19-sk-note" key={`n-${figure.id}`} data-keep-open="">
          <p><Rich text={figure.note} /></p>
        </div>
      ) : null}
      <div className="v19-sk-wrap" key={`${figure.id}-${s ? s.kind : ''}`}>
        <Sketch s={s} />
      </div>
    </div>
  );
}

/* ── the car on the WheelPrice bar ────────────────────────────────────
   A low coupe in profile. Point at it and its wheels spin up for a beat, then it tears off to
   the left, comes back in from the right and slides the last stretch to a stop exactly where
   it was, with a puff of smoke off the tyres. */
function Car({ go }) {
  return (
    <span className={`v19-car is-drift${go ? ' go' : ''}`} aria-hidden="true">
      <span className="v19-car-smoke">
        <i /><i /><i /><i />
      </span>
      <svg viewBox="0 0 120 44" className="v19-car-body">
        {/* a low coupe, nose to the left, the way it drives */}
        <path d="M4 32 Q2 26 8 24 L20 22 L32 13 Q38 8 50 8 L74 8 Q86 8 96 15 L106 24 L114 26 Q118 28 117 33 L114 36 H100 Q100 30 92 30 Q84 30 84 36 H38 Q38 30 30 30 Q22 30 22 36 H8 Q4 36 4 32 Z" className="v19-car-shell is-dark" />
        <path d="M36 21 L42 12 H58 V21 Z M62 21 V12 H74 Q82 12 90 20 L91 21 Z" className="v19-car-glass" />
        <path d="M20 22 H104 M60 12 V21" className="v19-car-line" />
        <rect x="6" y="25" width="8" height="4" rx="1" className="v19-car-lamp" />
        <rect x="108" y="27" width="8" height="3" rx="1" className="v19-car-lamp is-rear" />
      </svg>
      <svg viewBox="0 0 24 24" className="v19-car-wheel is-rear">
        <circle cx="12" cy="12" r="11" className="v19-car-tyre" />
        <circle cx="12" cy="12" r="6.5" className="v19-car-rim" />
        <path d="M12 5.5 V18.5 M5.5 12 H18.5 M7.4 7.4 L16.6 16.6 M16.6 7.4 L7.4 16.6" className="v19-car-spoke" />
      </svg>
      <svg viewBox="0 0 24 24" className="v19-car-wheel is-front">
        <circle cx="12" cy="12" r="11" className="v19-car-tyre" />
        <circle cx="12" cy="12" r="6.5" className="v19-car-rim" />
        <path d="M12 5.5 V18.5 M5.5 12 H18.5 M7.4 7.4 L16.6 16.6 M16.6 7.4 L7.4 16.6" className="v19-car-spoke" />
      </svg>
    </span>
  );
}

export default function Work({ sectionRef }) {
  const ref = useRef(null);
  const seen = useOnScreen(ref);
  const { open, toggle } = useOpener();
  const [live, setLive] = useState(FIGURES[0].id);
  const [past, setPast] = useState(false);
  const [wpLive, setWpLive] = useState(WHEELPRICE.figures[0].id);
  const [alsoOpen, setAlsoOpen] = useState(false);
  const pastRef = useRef(null);
  const pastSeen = useOnScreen(pastRef, '-30%');
  const [go, setGo] = useState(false);
  const goRef = useRef(null);

  // the lap: wheels spin up, off left, back from the right, stop. Not again until it has stopped.
  const lap = () => {
    if (goRef.current) return;
    setGo(true);
    goRef.current = window.setTimeout(() => {
      setGo(false);
      goRef.current = null;
    }, 3600);
  };
  useEffect(() => () => { if (goRef.current) window.clearTimeout(goRef.current); }, []);

  return (
    <section className="v19-work" ref={sectionRef} id="work" aria-label="What I do now">
      <div className="v19-now">
        <div className="v19-slab-in" ref={ref}>
          <header className="v19-head-split">
            <div>
              <p className="v19-eye">
                <span className="v19-dot is-live" aria-hidden="true" />
                {ALFRED.eyebrow}
              </p>
              <h2 className="v19-h2">
                {ALFRED.hello}{' '}
                <a className="v19-mark" href={ALFRED.url} target="_blank" rel="noreferrer">
                  <img src={ALFRED.logo} alt="" />
                  <span>{ALFRED.company}</span>
                </a>
                .
              </h2>
              <p className="v19-lede">{ALFRED.about}</p>
            </div>

            <aside className="v19-glance">
              <p className="v19-mini">At a glance</p>
              <dl>
                {ALFRED.glance.map((g) => (
                  <div key={g.k}><dt>{g.k}</dt><dd>{g.v}</dd></div>
                ))}
              </dl>
              <a className="v19-glance-go" href={ALFRED.url} target="_blank" rel="noreferrer">
                {ALFRED.tryLabel}
              </a>
            </aside>
          </header>

          <div className="v19-dials" onMouseLeave={() => setLive(FIGURES[0].id)}>
            {FIGURES.map((f) => (
              <Dial key={f.id} f={f} live={live === f.id} isOpen={open === f.id} run={seen} onLive={setLive} onPick={toggle} />
            ))}
          </div>

          <Row figures={FIGURES} live={live} open={open} />
        </div>
      </div>

      {/* below the fold: the one before Alfred_, shut, with a car on it */}
      <div className="v19-past" ref={pastRef}>
        <div className="v19-slab-in">
          <div className={`v19-wp${past ? ' is-open' : ''}${pastSeen ? ' is-seen' : ''}`} data-keep-open="">
            <button
              type="button"
              className="v19-wp-bar"
              onClick={() => setPast((p) => !p)}
              aria-expanded={past}
              data-keep-open=""
            >
              {WHEELPRICE.logo ? <img className="v19-wp-logo" src={WHEELPRICE.logo} alt="" /> : null}
              <span className="v19-wp-who">
                <b>{WHEELPRICE.company}</b>
                <i>{WHEELPRICE.title}</i>
              </span>
              <span className="v19-wp-say">{WHEELPRICE.short}</span>
              <span className="v19-wp-when">{WHEELPRICE.when}</span>
              <span className="v19-wp-chev" aria-hidden="true" />
            </button>
            <span className="v19-wp-drive" onMouseEnter={lap} onClick={lap} aria-hidden="true">
              <Car go={go} />
            </span>

            <div className="v19-wp-open" hidden={!past}>
              <p className="v19-lede">{WHEELPRICE.about}</p>
              <div className="v19-dials is-small" onMouseLeave={() => setWpLive(WHEELPRICE.figures[0].id)}>
                {WHEELPRICE.figures.map((f) => (
                  <Dial key={f.id} f={f} live={wpLive === f.id} isOpen={open === f.id} run={past} onLive={setWpLive} onPick={toggle} />
                ))}
              </div>
              <Row figures={WHEELPRICE.figures} live={wpLive} open={open} cols={4} />
            </div>
          </div>

          <div className="v19-after">
            <p className="v19-mini">Also</p>
            <div className={`v19-role${alsoOpen ? ' is-open' : ''}`} data-keep-open="">
              <button type="button" className="v19-role-line" onClick={() => setAlsoOpen((o) => !o)} aria-expanded={alsoOpen} data-keep-open="">
                <span className="v19-role-when">{AFTER.map((r) => r.when.split(/\s[–-]\s/)[0]).join(' · ')}</span>
                <span className="v19-role-who">
                  {AFTER.map((r) => (r.logo ? <img className="v19-role-logo" src={r.logo} alt="" key={r.id} /> : null))}
                  <b>{AFTER_LINE}</b>
                </span>
                <span className="v19-role-say">{AFTER.map((r) => r.line).join(' ')}</span>
                <span className="v19-role-chev" aria-hidden="true" />
              </button>
              <div className="v19-role-more" hidden={!alsoOpen}>
                {AFTER.map((r) => (
                  <div className="v19-role-one" key={r.id}>
                    <p className="v19-role-head">
                      <b>{r.company}</b>
                      <i>{r.title}</i>
                      <span>{r.when}</span>
                    </p>
                    <ul>
                      {r.bullets.map((bl) => (
                        <li key={bl}>{bl}</li>
                      ))}
                    </ul>
                    <p className="v19-chiprow">
                      {r.tech.slice(0, 10).map((t) => (
                        <span className="v19-chip" key={t}>{t}</span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
