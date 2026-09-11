// v19 — the work. Alfred_ takes the whole first screen and nothing else is on it.
//
// Three kinds of text and no more: one mono line, one heading, one paragraph. Then the figures:
// a before struck through, an after that counts up, a line saying what it is. Point at one and
// the number counts again and the drawing underneath changes to that one specific thing. Click
// and the why opens BESIDE the drawing, never over it: from the left two boxes the note takes
// the left and the drawing moves right; from the other three the drawing stays left and the
// note takes the right. Five show by default; the Lab can show ten, or all fifteen.
//
// Underneath the fold: WheelPrice, shut, as one bar with a wheel rolling along it. It opens into
// the same shape at half the size, with its own drawings. Everything before that is an
// after-note, one line each.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALFRED, AFTER, AFTER_LINE, FIGURES, WHEELPRICE } from '../copy';
import { useLab } from '../lab';
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
   Small, line-drawn, and about one figure only. Four are bespoke; the rest are built from a
   handful of shapes — a run of cells, a flow, a set of bars, a rise — each described in copy.js
   next to the figure it belongs to, so a sixteenth figure is a line of data, not a component. */

const T = ({ x, y, cls, children, anchor }) => (
  <text className={`v19-sk-t${cls ? ` ${cls}` : ''}`} x={x} y={y} textAnchor={anchor}>{children}</text>
);

/* A run of cells; some are the ones that matter. */
function Cells({ s }) {
  const n = s.n || 12;
  const hot = new Set(s.hot || []);
  const bw = Math.min(18, Math.floor(400 / n) - 4);
  return (
    <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label={s.alt}>
      <T x={0} y={20}>{s.head}</T>
      {Array.from({ length: n }).map((_, i) => (
        <rect key={i} className={`v19-sk-tick-box${hot.has(i) ? ' is-hot' : ''}`} style={{ '--i': i }} x={4 + i * (bw + 4)} y={30} width={bw} height={bw} rx="2" />
      ))}
      <T x={n * (bw + 4) + 14} y={30 + bw * 0.7} cls="is-hot">{s.tail}</T>
      <T x={0} y={66} cls={s.strike ? 'is-was' : 'is-small'}>{s.foot}</T>
    </svg>
  );
}

/* Boxes joined by arrows; a bead runs the path; the last box is the point. */
function Flow({ s }) {
  const nodes = s.nodes;
  // each box is as wide as its words, and the row is spread to fill the drawing
  const widths = nodes.map((nd) => Math.max(58, Math.round(nd.length * 6.6 + 20)));
  const total = widths.reduce((acc, v) => acc + v, 0);
  const gap = Math.max(14, Math.floor((520 - total) / Math.max(1, nodes.length - 1)));
  const xs = [];
  let cur = 0;
  widths.forEach((bw) => { xs.push(cur); cur += bw + gap; });
  const last = nodes.length - 1;
  return (
    <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label={s.alt}>
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
    </svg>
  );
}

/* Bars, side by side, growing to their value. */
function Bars({ s }) {
  const rows = s.rows;
  const rh = Math.min(16, Math.floor(60 / rows.length) - 4);
  return (
    <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label={s.alt}>
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
    </svg>
  );
}

/* A rise: columns climbing left to right, to a number. */
function Rise({ s }) {
  const cols = s.cols;
  const cw = Math.floor(360 / cols.length) - 5;
  return (
    <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label={s.alt}>
      <T x={0} y={40}>{s.head}</T>
      {cols.map((h, i) => (
        <rect key={i} className={`v19-sk-col${i === cols.length - 1 ? ' is-hot' : ''}`} style={{ '--i': i }} x={100 + i * (cw + 5)} y={60 - Math.round(h * 52)} width={cw} height={Math.round(h * 52)} rx="1.5" />
      ))}
      <T x={470} y={20} cls="is-hot">{s.tail}</T>
      <T x={100} y={72} cls="is-small">{s.foot}</T>
    </svg>
  );
}

/* Eleven weeks, each one wrong, and then the week it was found. */
function Weeks({ s }) {
  const n = s.n || 11;
  const bw = 30;
  return (
    <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label={s.alt}>
      <T x={0} y={16}>week</T>
      {Array.from({ length: n }).map((_, i) => (
        <g key={i} style={{ '--i': i }} className="v19-sk-week">
          <rect x={4 + i * (bw + 6)} y={24} width={bw} height={22} rx="2" className="v19-sk-week-box" />
          <T x={4 + i * (bw + 6) + bw / 2} y={39} cls="is-small is-centre">{i + 1}</T>
          <path className="v19-sk-week-x" d={`M${4 + i * (bw + 6) + 9} 30 l12 10 M${4 + i * (bw + 6) + 21} 30 l-12 10`} />
        </g>
      ))}
      <g className="v19-sk-pass" style={{ '--i': n }}>
        <path className="v19-sk-tick" d={`M${8 + n * (bw + 6)} 36 l7 7 l13 -16`} />
        <T x={8 + n * (bw + 6) + 26} y={40} cls="is-hot">found</T>
      </g>
      <T x={0} y={66} cls="is-small">{s.foot}</T>
    </svg>
  );
}

/* The migration: three providers, polled on a timer, switched to events over one week. */
function Migrate() {
  const lanes = ['Gmail', 'Graph', 'IMAP'];
  return (
    <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="Three mail providers moved from polling to event-driven ingress in one week">
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
    </svg>
  );
}

/* Strict IDs: code builds the menu, the model only picks and writes prose, code puts the facts back. */
function Strict() {
  const rows = ['the lease renewal', 'invoice 4471', 'Tuesday with Ana'];
  return (
    <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="The model chooses from real candidates behind opaque handles and never writes an identifier">
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
    </svg>
  );
}

/* A wheel coming off a car, and a different one going on. */
function Swap({ s }) {
  return (
    <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label={s.alt}>
      <path className="v19-sk-path is-body" d="M60 44 L90 20 H200 L240 44 H300 V56 H40 V44 Z" />
      <circle className="v19-sk-wheel is-old" cx="100" cy="56" r="12" />
      <g className="v19-sk-wheel is-new">
        <circle cx="240" cy="56" r="12" />
        <path d="M240 44 V68 M228 56 H252 M231.5 47.5 L248.5 64.5 M248.5 47.5 L231.5 64.5" />
      </g>
      <T x={330} y={40} cls="is-was">{s.head}</T>
      <T x={330} y={60} cls="is-small">{s.foot}</T>
    </svg>
  );
}

function Sketch({ f }) {
  const s = f.sketch;
  if (!s) return null;
  if (s.kind === 'cells') return <Cells s={s} />;
  if (s.kind === 'flow') return <Flow s={s} />;
  if (s.kind === 'bars') return <Bars s={s} />;
  if (s.kind === 'rise') return <Rise s={s} />;
  if (s.kind === 'swap') return <Swap s={s} />;
  if (s.kind === 'weeks') return <Weeks s={s} />;
  if (s.kind === 'migrate') return <Migrate />;
  if (s.kind === 'strict') return <Strict />;

  if (s.kind === 'cost') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="A hundred and fifty tools folded into a hundred and ten">
        {Array.from({ length: 15 }).map((_, i) => (
          <rect key={i} className={`v19-sk-tick-box${i >= 11 ? ' is-gone' : ''}`} style={{ '--i': i }} x={4 + i * 22} y={26} width={16} height={16} rx="2" />
        ))}
        <T x={350} y={38} cls="is-hot">110, every parameter kept</T>
        <T x={0} y={66} cls="is-was">150 tools weighed on every turn</T>
      </svg>
    );
  }

  if (s.kind === 'rules') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="A sentence becoming a rule">
        <rect className="v19-sk-bubble" x="0" y="10" width="230" height="38" rx="6" />
        <T x={14} y={34} cls="is-say">“file anything from my landlord”</T>
        <path className="v19-sk-path is-short" d="M240 30 H300" />
        <g className="v19-sk-rule-row">
          <rect className="v19-sk-box is-wide" x="306" y="10" width="200" height="38" rx="3" />
          <T x={322} y={34} cls="is-mid">from: landlord → Home</T>
          <path className="v19-sk-tick" d="M478 30 l7 7 l13 -16" />
        </g>
        <T x={0} y={66} cls="is-was">it used to be a form with nine fields</T>
      </svg>
    );
  }

  if (s.kind === 'memory') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="Answers checked against the ledger">
        <T x={0} y={16}>the ledger</T>
        {[0, 1, 2].map((i) => (
          <g key={i} className="v19-sk-row" style={{ '--i': i }}>
            <rect className="v19-sk-line" x="0" y={26 + i * 16} width={120 - i * 18} height="6" rx="3" />
          </g>
        ))}
        <path className="v19-sk-path" d="M150 42 H250" />
        <rect className="v19-sk-box is-wide" x="250" y="22" width="150" height="34" rx="3" />
        <T x={266} y={44} cls="is-mid">stated in an answer</T>
        <g className="v19-sk-pass"><path className="v19-sk-tick" d="M420 32 l7 7 l13 -16" /><T x={452} y={40} cls="is-small">kept</T></g>
        <g className="v19-sk-fail"><path className="v19-sk-cross" d="M420 50 l14 14 M434 50 l-14 14" /><T x={452} y={64} cls="is-small is-was">dropped</T></g>
      </svg>
    );
  }

  // latency, the race
  return (
    <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="Mail reaching you in three seconds instead of ninety">
      <T x={0} y={26}>inbox</T>
      <T x={474} y={26}>you</T>
      <line className="v19-sk-rule" x1="52" y1="38" x2="462" y2="38" />
      <circle className="v19-sk-run is-slow" cx="52" cy="38" r="5" />
      <circle className="v19-sk-run is-fast" cx="52" cy="38" r="6" />
      <T x={52} y={64} cls="is-was">90 s, polling</T>
      <T x={462} y={64} cls="is-hot" anchor="end">3 s, dispatched</T>
    </svg>
  );
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
        <span className="v19-dial-now">
          <Tick value={f.now} run={run} again={live} />
        </span>
        <span className="v19-dial-label">{f.label}</span>
        <span className="v19-dial-mark" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
    </div>
  );
}

/* The row under the dials: the drawing, and the note beside it when one is open. Which side
   the note takes depends on which column the open box is in, so it never covers the drawing. */
function Row({ figures, live, open, cols = 5 }) {
  const figure = figures.find((f) => f.id === open) || figures.find((f) => f.id === live) || figures[0];
  const opened = figures.find((f) => f.id === open);
  const col = opened ? figures.indexOf(opened) % cols : -1;
  const noteLeft = opened && col < 2;
  return (
    <div className={`v19-sk-row${opened ? ' has-note' : ''}${noteLeft ? ' note-left' : ''}`}>
      {opened ? (
        <div className="v19-sk-note" key={`n-${opened.id}`} data-keep-open="">
          <p>{opened.note}</p>
        </div>
      ) : null}
      <div className="v19-sk-wrap" key={figure.id}>
        <Sketch f={figure} />
      </div>
    </div>
  );
}

/* The wheel that rolls along the WheelPrice bar. */
function Wheel() {
  return (
    <svg className="v19-wp-wheel" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" className="v19-wp-tyre" />
      <circle cx="20" cy="20" r="11" className="v19-wp-rim" />
      <path d="M20 9 V31 M9 20 H31 M12.2 12.2 L27.8 27.8 M27.8 12.2 L12.2 27.8" className="v19-wp-spoke" />
      <circle cx="20" cy="20" r="2.4" className="v19-wp-hub" />
    </svg>
  );
}

export default function Work({ sectionRef }) {
  const { lab } = useLab();
  const ref = useRef(null);
  const seen = useOnScreen(ref);
  const { open, toggle } = useOpener();
  const shown = lab.now === 'all' ? FIGURES : lab.now === 'ten' ? FIGURES.slice(0, 10) : FIGURES.filter((f) => f.top);
  const [alsoOpen, setAlsoOpen] = useState(false);
  const [live, setLive] = useState(shown[0].id);
  const [past, setPast] = useState(false);
  const [wpLive, setWpLive] = useState(WHEELPRICE.figures[0].id);
  const pastRef = useRef(null);
  const pastSeen = useOnScreen(pastRef, '-30%');

  return (
    <section className="v19-work" ref={sectionRef} id="work" aria-label="What I do now">
      <div className="v19-now">
        <div className="v19-slab-in" ref={ref}>
          <header className="v19-head-split">
            <div>
              <p className="v19-eye">
                <span className="v19-dot is-live" aria-hidden="true" />
                {ALFRED.eyebrow} · {ALFRED.when}
              </p>
              <h2 className="v19-h2">
                {ALFRED.hello}{' '}
                <a className="v19-mark" href={ALFRED.url} target="_blank" rel="noreferrer">
                  <img src={ALFRED.logo} alt="" />
                  <span>{ALFRED.company}</span>
                </a>
                , {ALFRED.claim}
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
                get-alfred.ai
              </a>
            </aside>
          </header>

          <div className={`v19-dials${shown.length > 5 ? ' is-many' : ''}${shown.length <= 3 ? ' is-three' : ''}`} onMouseLeave={() => setLive(shown[0].id)}>
            {shown.map((f) => (
              <Dial key={f.id} f={f} live={live === f.id} isOpen={open === f.id} run={seen} onLive={setLive} onPick={toggle} />
            ))}
          </div>

          <Row figures={shown} live={live} open={open} />

        </div>
      </div>

      {/* below the fold: the one before Alfred_, shut, with a wheel rolling along it */}
      <div className="v19-past" ref={pastRef}>
        <div className="v19-slab-in">
          <div className={`v19-wp w-${lab.wheel}${past ? ' is-open' : ''}${pastSeen ? ' is-seen' : ''}`} data-keep-open="">
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
              {lab.wheel === 'spin' ? (
                <span className="v19-wp-spin" aria-hidden="true"><Wheel /></span>
              ) : lab.wheel === 'tread' ? (
                <span className="v19-wp-tread" aria-hidden="true" />
              ) : (
                <span className="v19-wp-road" aria-hidden="true"><Wheel /></span>
              )}
            </button>

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
