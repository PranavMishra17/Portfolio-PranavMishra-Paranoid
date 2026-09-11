// v19 — the work. Alfred_ takes the whole first screen and nothing else is on it.
//
// Five boxes: a before struck through, an after that counts up, a line saying what it is. Point
// at one and the drawing underneath changes to that one specific thing — not a generic diagram
// with the labels swapped. Click and it tells you why.
//
// Underneath the fold: WheelPrice, shut, as one bar. It opens into the same shape at half the
// size. Everything before that is an after-note, one line each.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALFRED, AFTER, FIGURES, HARDENING, WHEELPRICE } from '../copy';
import { useOnScreen, useOpener } from '../hooks';

/* A number that counts to itself once, when it first arrives on screen. */
function Tick({ value, run }) {
  const [shown, setShown] = useState(value);
  const numeric = useMemo(() => {
    const m = String(value).match(/^(−?-?)(\d+(?:\.\d+)?)(.*)$/);
    return m ? { sign: m[1], n: parseFloat(m[2]), tail: m[3] } : null;
  }, [value]);

  useEffect(() => {
    if (!run || !numeric) {
      setShown(value);
      return undefined;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 780;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - (1 - t) ** 3;
      const v = numeric.n * e;
      setShown(`${numeric.sign}${numeric.n % 1 ? v.toFixed(1) : Math.round(v)}${numeric.tail}`);
      if (t < 1) raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    // rAF may never run; land the real value regardless
    const guard = window.setTimeout(() => setShown(value), 1200);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(guard);
    };
  }, [run, numeric, value]);

  return <span>{shown}</span>;
}

/* ── one drawing per figure ──────────────────────────────────────────────
   Small, line-drawn, and about that figure only. They are SVG with the motion in CSS, so a
   sixth costs a stylesheet block rather than a component. */

function Sketch({ id }) {
  if (id === 'otp') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="A security code arriving instantly">
        <text className="v19-sk-t" x="0" y="20">code arrives</text>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i} className="v19-sk-cell" style={{ '--i': i }}>
            <rect className="v19-sk-box" x={186 + i * 40} y="26" width="32" height="34" rx="3" />
            <text className="v19-sk-d" x={202 + i * 40} y="51">{[4, 9, 1, 8, 2, 7][i]}</text>
          </g>
        ))}
        <text className="v19-sk-t is-hot" x="418" y="51">now</text>
        <line className="v19-sk-rule" x1="0" y1="43" x2="176" y2="43" />
        <text className="v19-sk-t is-was" x="0" y="60">189 s ago</text>
      </svg>
    );
  }

  if (id === 'cost') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="Most messages decided by a matcher, a few by a model">
        <text className="v19-sk-t" x="0" y="44">every message</text>
        <path className="v19-sk-path" d="M110 40 H210" />
        <path className="v19-sk-path" d="M284 40 H430" />
        <path className="v19-sk-path" d="M284 40 C 320 40, 330 14, 368 14" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <circle key={i} className="v19-sk-bead" style={{ '--i': i }} cx="110" cy="40" r="3.4" />
        ))}
        <circle className="v19-sk-bead is-up" cx="110" cy="40" r="3.4" />
        <rect className="v19-sk-gate" x="210" y="26" width="74" height="30" rx="3" />
        <text className="v19-sk-t is-mid is-centre" x="247" y="45">matcher</text>
        <rect className="v19-sk-model" x="368" y="2" width="58" height="24" rx="3" />
        <text className="v19-sk-t is-small is-centre" x="397" y="18">model</text>
        <text className="v19-sk-t is-hot" x="438" y="44">rule</text>
      </svg>
    );
  }

  if (id === 'rules') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="A sentence becoming a rule">
        <rect className="v19-sk-bubble" x="0" y="10" width="230" height="38" rx="6" />
        <text className="v19-sk-t is-say" x="14" y="34">“file anything from my landlord”</text>
        <path className="v19-sk-path is-short" d="M240 30 H300" />
        <g className="v19-sk-rule-row">
          <rect className="v19-sk-box is-wide" x="306" y="10" width="200" height="38" rx="3" />
          <text className="v19-sk-t is-mid" x="322" y="34">from: landlord → Home</text>
          <path className="v19-sk-tick" d="M478 30 l7 7 l13 -16" />
        </g>
        <text className="v19-sk-t is-was" x="0" y="66">it used to be a form with nine fields</text>
      </svg>
    );
  }

  if (id === 'memory') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="Answers checked against the ledger">
        <text className="v19-sk-t" x="0" y="16">the ledger</text>
        {[0, 1, 2].map((i) => (
          <g key={i} className="v19-sk-row" style={{ '--i': i }}>
            <rect className="v19-sk-line" x="0" y={26 + i * 16} width={120 - i * 18} height="6" rx="3" />
          </g>
        ))}
        <path className="v19-sk-path" d="M150 42 H250" />
        <rect className="v19-sk-box is-wide" x="250" y="22" width="150" height="34" rx="3" />
        <text className="v19-sk-t is-mid" x="266" y="44">stated in an answer</text>
        <g className="v19-sk-pass"><path className="v19-sk-tick" d="M420 32 l7 7 l13 -16" /><text className="v19-sk-t is-small" x="452" y="40">kept</text></g>
        <g className="v19-sk-fail"><path className="v19-sk-cross" d="M420 50 l14 14 M434 50 l-14 14" /><text className="v19-sk-t is-small is-was" x="452" y="64">dropped</text></g>
      </svg>
    );
  }

  // latency, and the default
  return (
    <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="Mail reaching you in three seconds instead of ninety">
      <text className="v19-sk-t" x="0" y="26">inbox</text>
      <text className="v19-sk-t" x="474" y="26">you</text>
      <line className="v19-sk-rule" x1="52" y1="38" x2="462" y2="38" />
      <circle className="v19-sk-run is-slow" cx="52" cy="38" r="5" />
      <circle className="v19-sk-run is-fast" cx="52" cy="38" r="6" />
      <text className="v19-sk-t is-was" x="52" y="64">90 s, polling</text>
      <text className="v19-sk-t is-hot" x="462" y="64" textAnchor="end">3 s, dispatched</text>
    </svg>
  );
}

export default function Work({ sectionRef }) {
  const ref = useRef(null);
  const seen = useOnScreen(ref);
  const { open, toggle } = useOpener();
  const [live, setLive] = useState(FIGURES[0].id);
  const [past, setPast] = useState(false);
  const figure = FIGURES.find((f) => f.id === live) || FIGURES[0];

  return (
    <section className="v19-work" ref={sectionRef} id="work" aria-label="What I do now">
      <div className="v19-now">
        <div className="v19-slab-in" ref={ref}>
          <header className="v19-head-split">
            <div>
              <p className="v19-eye">
                <span className="v19-dot is-live" aria-hidden="true" />
                {ALFRED.when} · {ALFRED.where}
              </p>
              <h2 className="v19-h2">
                {ALFRED.hello}{' '}
                <a className="v19-mark" href={ALFRED.url} target="_blank" rel="noreferrer">
                  <img src={ALFRED.logo} alt="" />
                  <span>{ALFRED.company}</span>
                </a>
              </h2>
              <p className="v19-lede">{ALFRED.about}</p>
              <p className="v19-lede is-mine">{ALFRED.mine}</p>
            </div>

            <aside className="v19-glance">
              <p className="v19-mini">At a glance</p>
              <dl>
                <div><dt>People relying on it</dt><dd>5,000+</dd></div>
                <div><dt>Reaches you by</dt><dd>text · chat · voice</dd></div>
                <div><dt>Mine to keep right</dt><dd>memory · rules</dd></div>
              </dl>
              <a className="v19-glance-go" href={ALFRED.url} target="_blank" rel="noreferrer">
                get-alfred.ai
              </a>
            </aside>
          </header>

          <div className="v19-dials" onMouseLeave={() => setLive(FIGURES[0].id)}>
            {FIGURES.map((f) => {
              const isOpen = open === f.id;
              return (
                <div
                  className={`v19-dial${live === f.id ? ' is-live' : ''}${isOpen ? ' is-open' : ''}`}
                  key={f.id}
                  onMouseEnter={() => setLive(f.id)}
                  data-keep-open={isOpen ? '' : undefined}
                >
                  <button
                    type="button"
                    className="v19-dial-face"
                    onClick={() => {
                      setLive(f.id);
                      toggle(f.id);
                    }}
                    aria-expanded={isOpen}
                    data-keep-open=""
                  >
                    <span className="v19-dial-was">{f.was}</span>
                    <span className="v19-dial-now">
                      <Tick value={f.now} run={seen} />
                    </span>
                    <span className="v19-dial-label">{f.label}</span>
                    <span className="v19-dial-more" aria-hidden="true">
                      {isOpen ? 'Close' : 'Why'}
                    </span>
                  </button>
                  <div className="v19-dial-note" hidden={!isOpen}>
                    <p>{f.note}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="v19-sk-wrap" key={figure.id}>
            <Sketch id={figure.id} />
          </div>

          <div className="v19-work-under">
            <p className="v19-mini">Underneath</p>
            <ul className="v19-ticks">
              {HARDENING.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* below the fold: the one before Alfred_, shut */}
      <div className="v19-past">
        <div className="v19-slab-in">
          <div className={`v19-wp${past ? ' is-open' : ''}`} data-keep-open="">
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

            <div className="v19-wp-open" hidden={!past}>
              <ol className="v19-story">
                {WHEELPRICE.story.map((s, i) => (
                  <li key={s} style={{ '--i': i }}>
                    <span className="v19-story-dot" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ol>
              <div className="v19-wp-side">
                <p className="v19-chiprow">
                  {WHEELPRICE.tech.slice(0, 8).map((t) => (
                    <span className="v19-chip" key={t}>{t}</span>
                  ))}
                </p>
                {WHEELPRICE.url ? (
                  <p>
                    <a className="v19-a" href={WHEELPRICE.url} target="_blank" rel="noreferrer">
                      {WHEELPRICE.company}
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          <div className="v19-after">
            <p className="v19-mini">Also</p>
            {AFTER.map((r) => {
              const isOpen = open === r.id;
              return (
                <div className={`v19-role${isOpen ? ' is-open' : ''}`} key={r.id} data-keep-open={isOpen ? '' : undefined}>
                  <button type="button" className="v19-role-line" onClick={() => toggle(r.id)} aria-expanded={isOpen} data-keep-open="">
                    <span className="v19-role-when">{r.when}</span>
                    <span className="v19-role-who">
                      <b>{r.company}</b>
                      <i>{r.title}</i>
                    </span>
                    <span className="v19-role-say">{r.line}</span>
                    <span className="v19-role-chev" aria-hidden="true" />
                  </button>
                  <div className="v19-role-more" hidden={!isOpen}>
                    <ul>
                      {r.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <p className="v19-chiprow">
                      {r.tech.slice(0, 10).map((t) => (
                        <span className="v19-chip" key={t}>{t}</span>
                      ))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
