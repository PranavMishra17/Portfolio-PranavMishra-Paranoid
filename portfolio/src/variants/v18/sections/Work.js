// v18 — the work.
//
// The rule here was: not much text, show it instead, and let anything open if you want the
// detail. So the numbers are the section — five dials, each one a "before" struck through and
// an "after" that counts up — and under them a signal path that redraws to whatever you are
// pointing at, with a pulse running down it. The prose is one paragraph and then it stops.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALFRED, FIGURES, HARDENING, ROLES } from '../copy';
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

/* The signal path. Nodes come from whichever figure is live; a pulse runs the line. */
function Signal({ nodes }) {
  const gap = 100 / Math.max(1, nodes.length - 1);
  return (
    <div className="v18-signal" aria-hidden="true">
      <svg viewBox="0 0 400 44" preserveAspectRatio="none" className="v18-signal-line">
        <line x1="10" y1="22" x2="390" y2="22" className="v18-signal-track" />
        <line x1="10" y1="22" x2="390" y2="22" className="v18-signal-pulse" />
      </svg>
      <div className="v18-signal-nodes">
        {nodes.map((n, i) => (
          <span key={`${n}-${i}`} className="v18-signal-node" style={{ left: `${i * gap}%` }}>
            <i />
            <b>{n}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Work({ sectionRef }) {
  const ref = useRef(null);
  const seen = useOnScreen(ref);
  const { open, toggle } = useOpener();
  const [live, setLive] = useState(FIGURES[0].id);
  const figure = FIGURES.find((f) => f.id === live) || FIGURES[0];

  return (
    <section className="v18-slab v18-work" ref={sectionRef} id="work" aria-label="What I do now">
      <div className="v18-slab-in" ref={ref}>
        <header className="v18-head v18-head-split">
          <div>
            <p className="v18-eye">
              <span className="v18-dot is-live" aria-hidden="true" />
              {ALFRED.when} · {ALFRED.where}
            </p>
            <h2 className="v18-h2">
              {ALFRED.title} at{' '}
              <a className="v18-h2-link" href={ALFRED.url} target="_blank" rel="noreferrer">
                {ALFRED.company}
              </a>
            </h2>
            <p className="v18-lede">{ALFRED.lede}</p>
          </div>

          <aside className="v18-glance">
            <p className="v18-mini">At a glance</p>
            <dl>
              <div><dt>People relying on it</dt><dd>5,000+</dd></div>
              <div><dt>Reaches you by</dt><dd>text · chat · voice</dd></div>
              <div><dt>Mine to keep right</dt><dd>memory · rules</dd></div>
            </dl>
            <a className="v18-glance-go" href={ALFRED.url} target="_blank" rel="noreferrer">
              get-alfred.ai
            </a>
          </aside>
        </header>

        <div className="v18-dials" onMouseLeave={() => setLive(FIGURES[0].id)}>
          {FIGURES.map((f) => {
            const isOpen = open === f.id;
            return (
              <div
                className={`v18-dial${live === f.id ? ' is-live' : ''}${isOpen ? ' is-open' : ''}`}
                key={f.id}
                onMouseEnter={() => setLive(f.id)}
                data-keep-open={isOpen ? '' : undefined}
              >
                <button
                  type="button"
                  className="v18-dial-face"
                  onClick={() => {
                    setLive(f.id);
                    toggle(f.id);
                  }}
                  aria-expanded={isOpen}
                  data-keep-open=""
                >
                  <span className="v18-dial-was">{f.was}</span>
                  <span className="v18-dial-now">
                    <Tick value={f.now} run={seen} />
                  </span>
                  <span className="v18-dial-label">{f.label}</span>
                  <span className="v18-dial-more" aria-hidden="true">
                    {isOpen ? 'Close' : 'Why'}
                  </span>
                </button>
                <div className="v18-dial-note" hidden={!isOpen}>
                  <p>{f.note}</p>
                </div>
              </div>
            );
          })}
        </div>

        <Signal nodes={figure.path} />

        <div className="v18-work-foot">
          <div className="v18-work-under">
            <p className="v18-mini">Underneath</p>
            <ul className="v18-ticks">
              {HARDENING.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>

          <div className="v18-roles">
            <p className="v18-mini">Before that</p>
            {ROLES.map((r) => {
              const isOpen = open === r.id;
              return (
                <div className={`v18-role${isOpen ? ' is-open' : ''}`} key={r.id} data-keep-open={isOpen ? '' : undefined}>
                  <button type="button" className="v18-role-line" onClick={() => toggle(r.id)} aria-expanded={isOpen} data-keep-open="">
                    <span className="v18-role-when">{r.when}</span>
                    <span className="v18-role-who">
                      <b>{r.company}</b>
                      <i>{r.title}</i>
                    </span>
                    <span className="v18-role-say">{r.line}</span>
                    <span className="v18-role-chev" aria-hidden="true" />
                  </button>
                  <div className="v18-role-more" hidden={!isOpen}>
                    <ul>
                      {r.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <p className="v18-chiprow">
                      {r.tech.slice(0, 10).map((t) => (
                        <span className="v18-chip" key={t}>
                          {t}
                        </span>
                      ))}
                    </p>
                    {r.url ? (
                      <p>
                        <a href={r.url} target="_blank" rel="noreferrer" className="v18-a">
                          {r.company}
                        </a>
                      </p>
                    ) : null}
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
