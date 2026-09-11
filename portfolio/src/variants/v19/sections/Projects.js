// v19 — the work I have built.
//
// He picked the frame and kept it: one fixed picture above, two rows of tiles below, everything
// in a box that cannot change size. So the variants here are not layouts, they are how the
// thing is dressed:
//
//   frame  — the plain one. Off-white card, picture left, words right.
//   poster — the name set large on ink beside the picture, the way a one-sheet is set.
//
// In all of them: nothing lifts, recolours or moves on hover; the frame is a fixed box so
// nothing can reflow; nothing scrolls inside anything else; no counts and no numbers.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ALL_PROJECTS, NOW_BUILDING } from '../copy';
import { useLab } from '../lab';
import { useOnScreen, useOpener } from '../hooks';

const AUTOPLAY_MS = 5200;
const COLS = [
  [1240, 9],
  [1040, 8],
  [860, 7],
  [680, 5],
  [0, 4],
];

const FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  { id: 'ai', label: 'AI · ML', test: (p) => p.bucket === 'aiMl' },
  { id: 'games', label: 'Games · XR', test: (p) => p.bucket === 'gameDesign' },
  { id: 'applied', label: 'Applied', test: (p) => p.bucket === 'misc' },
];

function useCols() {
  const [cols, setCols] = useState(9);
  useEffect(() => {
    const read = () => {
      const w = window.innerWidth;
      const hit = COLS.find(([min]) => w >= min) || COLS[COLS.length - 1];
      setCols(Math.max(2, hit[1]));
    };
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);
  return cols;
}

function Tile({ p, live, picked, onPeek, onRest, onPick }) {
  return (
    <button
      type="button"
      className={`v19-tile${live ? ' is-live' : ''}${picked ? ' is-picked' : ''}`}
      onMouseEnter={() => onPeek(p.id)}
      onFocus={() => onPeek(p.id)}
      onMouseLeave={onRest}
      onBlur={onRest}
      onClick={() => onPick(p.id)}
      aria-label={`${p.name} — ${p.tag}`}
      data-keep-open=""
    >
      <span className="v19-tile-shot" aria-hidden="true" style={{ backgroundImage: `url("${p.image}")` }} />
      <span className="v19-tile-rule" aria-hidden="true" />
    </button>
  );
}

function Links({ p }) {
  return (
    <p className="v19-view-links">
      {p.demo ? <a href={p.demo} target="_blank" rel="noreferrer">Watch it</a> : null}
      {p.site ? <a href={p.site} target="_blank" rel="noreferrer">Use it</a> : null}
      {p.github ? <a href={p.github} target="_blank" rel="noreferrer">Source</a> : null}
    </p>
  );
}

/* The frame. Every part of it is a fixed box, so nothing on this page can move. */
function Frame({ shown, mode, onClose, look }) {
  return (
    <div className={`v19-view is-${look} v19-view-${mode}`} data-keep-open="">
      <div className="v19-view-frame">
        <img key={shown.id} src={shown.image} alt="" loading="lazy" className={shown.square ? 'is-square' : ''} />
        <span className="v19-view-tag">{shown.tag}</span>
      </div>
      <div className="v19-view-words">
        <p className="v19-view-eye">
          <span>{mode === 'auto' ? 'Building right now' : shown.category}</span>
          {mode === 'detail' ? (
            <button type="button" className="v19-view-close" onClick={onClose} data-keep-open="">Close</button>
          ) : null}
        </p>
        <h3 className="v19-view-name">{shown.name}</h3>
        <p className="v19-view-line">{shown.line}</p>
        <p className="v19-view-body">{mode === 'detail' ? shown.description : ''}</p>
        <p className="v19-chiprow">
          {(mode === 'detail' ? shown.tech.slice(0, 5) : []).map((t) => (
            <span className="v19-chip" key={t}>{t}</span>
          ))}
        </p>
        <Links p={shown} />
      </div>
    </div>
  );
}

export default function Projects({ sectionRef }) {
  const { lab } = useLab();
  const look = lab.projects;
  const wrapRef = useRef(null);
  const seen = useOnScreen(wrapRef, '-10%');
  const { open, toggle, close } = useOpener();
  const [peek, setPeek] = useState(null);
  const [auto, setAuto] = useState(0);
  const [all, setAll] = useState(false);
  const [filter, setFilter] = useState('all');
  const cols = useCols();

  const test = (FILTERS.find((f) => f.id === filter) || FILTERS[0]).test;
  const list = useMemo(() => ALL_PROJECTS.filter(test), [test]);
  const perPage = Math.max(3, cols * 2 - 1);
  const visible = all ? list : list.slice(0, perPage);
  const hidden = list.length - perPage;

  useEffect(() => {
    if (peek || open || !seen || NOW_BUILDING.length < 2) return undefined;
    const t = window.setInterval(() => setAuto((a) => (a + 1) % NOW_BUILDING.length), AUTOPLAY_MS);
    return () => window.clearInterval(t);
  }, [peek, open, seen]);

  const onPeek = useCallback((id) => setPeek(id), []);
  const onRest = useCallback(() => setPeek(null), []);
  const onPick = useCallback((id) => { setPeek(null); toggle(id); }, [toggle]);

  const shown =
    (open && ALL_PROJECTS.find((p) => p.id === open)) ||
    (peek && ALL_PROJECTS.find((p) => p.id === peek)) ||
    NOW_BUILDING[auto % Math.max(1, NOW_BUILDING.length)] ||
    ALL_PROJECTS[0];
  const mode = open ? 'detail' : peek ? 'peek' : 'auto';
  const browsing = Boolean(open) || all;

  return (
    <section className={`v19-slab v19-projects is-${look}`} ref={sectionRef} id="projects" aria-label="Projects">
      <div className="v19-slab-in v19-projects-in" ref={wrapRef}>
        <header className="v19-rack-head">
          <div>
            <p className="v19-eye">
              <span className="v19-dot" aria-hidden="true" />
              Built
            </p>
            <h2 className="v19-h2 v19-h2-tight">Everything I have built.</h2>
          </div>
          <div className={`v19-filters${browsing ? ' on' : ''}`} role="group" aria-label="Show only" data-keep-open="">
            {FILTERS.map((f) => (
              <button
                type="button"
                key={f.id}
                className={filter === f.id ? 'on' : ''}
                onClick={() => setFilter(f.id)}
                data-keep-open=""
              >
                {f.label}
              </button>
            ))}
          </div>
        </header>

        <Frame shown={shown} mode={mode} onClose={close} look={look} />

        <div className="v19-grid" style={{ '--cols': cols }}>
          {visible.map((p) => (
            <Tile key={p.id} p={p} live={peek === p.id} picked={open === p.id} onPeek={onPeek} onRest={onRest} onPick={onPick} />
          ))}
          {hidden > 0 ? (
            <button type="button" className="v19-tile v19-tile-more" onClick={() => setAll((a) => !a)} data-keep-open="">
              <span className="v19-tile-more-l">{all ? 'Show fewer' : 'Show all'}</span>
              <span className="v19-tile-rule" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
