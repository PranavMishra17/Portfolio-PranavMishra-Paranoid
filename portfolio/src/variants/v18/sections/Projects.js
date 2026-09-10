// v18 — the rack.
//
// Every project at once, on one screen, loaded like rounds in a cylinder. Nothing scrolls
// sideways and nothing is hidden behind a filter. Above them sits one viewbox:
//
//   · nobody pointing  → it cycles what I am building right now
//   · pointing         → it becomes that project, instantly
//   · clicked          → it opens into the detail, in the same frame, without moving anything
//
// Hovering only ever transforms a chamber. It never changes a size, a gap or a position, so
// the rack cannot ripple.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ALL_PROJECTS, NOW_BUILDING } from '../copy';
import { useLab } from '../lab';
import { useOnScreen, useOpener } from '../hooks';

const AUTOPLAY_MS = 4200;

/* Where each chamber sits, per rack. Positions are percentages so nothing reflows on hover. */
function ringLayout(n) {
  // A speed loader: two concentric rings, the outer one carrying roughly two thirds.
  const outerCount = Math.ceil(n * 0.62);
  const innerCount = n - outerCount;
  const place = (i, count, radius, offset) => {
    const a = (i / count) * Math.PI * 2 - Math.PI / 2 + offset;
    return { left: 50 + Math.cos(a) * radius, top: 50 + Math.sin(a) * radius * 0.98 };
  };
  const out = [];
  for (let i = 0; i < outerCount; i += 1) out.push(place(i, outerCount, 44, 0));
  for (let i = 0; i < innerCount; i += 1) out.push(place(i, innerCount, 23, Math.PI / innerCount));
  return out;
}

function Chamber({ p, i, style, onPeek, onRest, onPick, active, picked }) {
  return (
    <button
      type="button"
      className={`v18-round${active ? ' is-live' : ''}${picked ? ' is-picked' : ''}`}
      style={style}
      onMouseEnter={() => onPeek(p.id)}
      onFocus={() => onPeek(p.id)}
      onMouseLeave={onRest}
      onBlur={onRest}
      onClick={() => onPick(p.id)}
      aria-label={`${p.name} — ${p.tag}`}
      data-keep-open=""
    >
      <span className="v18-round-rim" aria-hidden="true" />
      <span className="v18-round-shot" aria-hidden="true" style={{ backgroundImage: `url("${p.image}")` }} />
      <span className="v18-round-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
    </button>
  );
}

export default function Projects({ sectionRef }) {
  const { lab } = useLab();
  const rack = lab.chambers;
  const wrapRef = useRef(null);
  const seen = useOnScreen(wrapRef, '-10%');
  const { open, toggle, close } = useOpener();
  const [peek, setPeek] = useState(null);
  const [auto, setAuto] = useState(0);

  const list = ALL_PROJECTS;
  const positions = useMemo(() => (rack === 'cylinder' ? ringLayout(list.length) : null), [rack, list.length]);

  // the default reel — only runs when nothing else is claiming the viewbox
  useEffect(() => {
    if (peek || open || !seen || NOW_BUILDING.length < 2) return undefined;
    const t = window.setInterval(() => setAuto((a) => (a + 1) % NOW_BUILDING.length), AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [peek, open, seen]);

  const onPeek = useCallback((id) => setPeek(id), []);
  const onRest = useCallback(() => setPeek(null), []);
  const onPick = useCallback((id) => { setPeek(null); toggle(id); }, [toggle]);

  const shown =
    (open && list.find((p) => p.id === open)) ||
    (peek && list.find((p) => p.id === peek)) ||
    NOW_BUILDING[auto % Math.max(1, NOW_BUILDING.length)] ||
    list[0];

  const mode = open ? 'detail' : peek ? 'peek' : 'auto';

  return (
    <section className="v18-slab v18-projects" ref={sectionRef} id="projects" aria-label="Projects">
      <div className="v18-slab-in v18-projects-in" ref={wrapRef}>
        <header className="v18-rack-head">
          <p className="v18-eye">
            <span className="v18-dot" aria-hidden="true" />
            {list.length} of them, all here
          </p>
          <h2 className="v18-h2 v18-h2-tight">Things I made.</h2>
        </header>

        <div className={`v18-view v18-view-${mode}`} data-keep-open="">
          <figure className={`v18-view-shot${shown.square ? ' is-square' : ''}`}>
            {/* keyed so React swaps the node and the CSS fade re-runs on every change */}
            <img key={shown.id} src={shown.image} alt="" loading="lazy" />
            <figcaption className="v18-view-tag">{shown.tag}</figcaption>
          </figure>

          <div className="v18-view-words" key={`${shown.id}-${mode}`}>
            {mode === 'auto' ? <p className="v18-view-eye">Building right now</p> : null}
            {mode === 'peek' ? <p className="v18-view-eye">{shown.category}</p> : null}
            {mode === 'detail' ? (
              <p className="v18-view-eye">
                {shown.category}
                <button type="button" className="v18-view-close" onClick={close} data-keep-open="">
                  Close
                </button>
              </p>
            ) : null}

            <h3 className="v18-view-name">{shown.name}</h3>
            <p className="v18-view-line">{shown.line}</p>

            {mode === 'detail' ? (
              <div className="v18-view-detail">
                <p className="v18-view-body">{shown.description}</p>
                <p className="v18-chiprow">
                  {shown.tech.slice(0, 12).map((t) => (
                    <span className="v18-chip" key={t}>{t}</span>
                  ))}
                </p>
                <p className="v18-view-links">
                  {shown.demo ? <a href={shown.demo} target="_blank" rel="noreferrer">Watch it</a> : null}
                  {shown.site ? <a href={shown.site} target="_blank" rel="noreferrer">Use it</a> : null}
                  {shown.github ? <a href={shown.github} target="_blank" rel="noreferrer">Source</a> : null}
                </p>
              </div>
            ) : (
              <p className="v18-view-cue">{mode === 'peek' ? 'Click to open it' : 'Point at a round'}</p>
            )}
          </div>
        </div>

        <div className={`v18-rack is-${rack}`} role="list">
          {list.map((p, i) => (
            <Chamber
              key={p.id}
              p={p}
              i={i}
              style={positions ? { left: `${positions[i].left}%`, top: `${positions[i].top}%` } : undefined}
              onPeek={onPeek}
              onRest={onRest}
              onPick={onPick}
              active={peek === p.id}
              picked={open === p.id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
