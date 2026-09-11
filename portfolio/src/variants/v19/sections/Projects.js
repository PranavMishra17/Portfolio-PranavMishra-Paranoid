// v19 — the projects, four ways, all of them the grid.
//
// He picked the grid. So the four layouts here are four things the grid can be, not four
// different objects:
//
//   frame   — one fixed frame above, two rows of tiles below. The one he liked.
//   beside  — the frame is a tall column on the left; the tiles stack four-wide beside it.
//   fill    — no frame at all. Whatever you point at becomes the ground under every tile,
//             and the tiles float on it as glass. Pointing changes the whole block.
//   spec    — no big picture. A spec sheet — name, stack, links, in a monospace ledger —
//             sits beside the tiles, and the tile is the only picture you get.
//
// In every one of them: nothing moves on hover, nothing changes size, nothing scrolls
// inside anything else. No counts and no numbers anywhere.
//
// Once you have opened something, three filters appear top right, outside the frame.

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

function useCols(base = 1) {
  const [cols, setCols] = useState(9);
  useEffect(() => {
    const read = () => {
      const w = window.innerWidth;
      const hit = COLS.find(([min]) => w >= min) || COLS[COLS.length - 1];
      setCols(Math.max(2, Math.round(hit[1] * base)));
    };
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, [base]);
  return cols;
}

function Tile({ p, live, picked, onPeek, onRest, onPick, glass }) {
  return (
    <button
      type="button"
      className={`v19-tile${live ? ' is-live' : ''}${picked ? ' is-picked' : ''}${glass ? ' is-glass' : ''}`}
      onMouseEnter={() => onPeek(p.id)}
      onFocus={() => onPeek(p.id)}
      onMouseLeave={onRest}
      onBlur={onRest}
      onClick={() => onPick(p.id)}
      aria-label={`${p.name} — ${p.tag}`}
      data-keep-open=""
    >
      <span className="v19-tile-shot" aria-hidden="true" style={{ backgroundImage: `url("${p.image}")` }} />
      {glass ? <span className="v19-tile-name">{p.name}</span> : null}
      <span className="v19-tile-rule" aria-hidden="true" />
    </button>
  );
}

function More({ hidden, all, setAll }) {
  if (hidden <= 0 || all) return null;
  return (
    <button type="button" className="v19-tile v19-tile-more" onClick={() => setAll(true)} data-keep-open="">
      <span className="v19-tile-more-l">Show all</span>
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
function Frame({ shown, mode, onClose, tall }) {
  return (
    <div className={`v19-view${tall ? ' is-tall' : ''} v19-view-${mode}`} data-keep-open="">
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

/* The spec sheet: no picture, a ledger of what it is. */
function Spec({ shown, mode, onClose }) {
  return (
    <div className={`v19-spec v19-view-${mode}`} data-keep-open="">
      <p className="v19-view-eye">
        <span>{mode === 'auto' ? 'Building right now' : shown.tag}</span>
        {mode === 'detail' ? (
          <button type="button" className="v19-view-close" onClick={onClose} data-keep-open="">Close</button>
        ) : null}
      </p>
      <h3 className="v19-view-name">{shown.name}</h3>
      <p className="v19-view-line">{shown.line}</p>
      <dl className="v19-spec-rows">
        <div><dt>Kind</dt><dd>{shown.category}</dd></div>
        <div><dt>Built with</dt><dd>{shown.tech.slice(0, 6).join(' · ') || '—'}</dd></div>
        <div><dt>Also</dt><dd>{mode === 'detail' ? shown.description : '—'}</dd></div>
      </dl>
      <Links p={shown} />
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
  const cols = useCols(look === 'beside' ? 0.5 : look === 'spec' ? 0.66 : 1);

  const test = (FILTERS.find((f) => f.id === filter) || FILTERS[0]).test;
  const list = useMemo(() => ALL_PROJECTS.filter(test), [test]);
  const rows = look === 'beside' || look === 'spec' ? 4 : 2;
  const perPage = Math.max(3, cols * rows - 1);
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

  const head = (
    <header className="v19-rack-head">
      <div>
        <p className="v19-eye">
          <span className="v19-dot" aria-hidden="true" />
          Made
        </p>
        <h2 className="v19-h2 v19-h2-tight">Things I made.</h2>
      </div>
      <div className={`v19-filters${browsing ? ' on' : ''}`} role="group" aria-label="Show only" data-keep-open="">
        {FILTERS.map((f) => (
          <button
            type="button"
            key={f.id}
            className={filter === f.id ? 'on' : ''}
            onClick={() => { setFilter(f.id); }}
            data-keep-open=""
          >
            {f.label}
          </button>
        ))}
      </div>
    </header>
  );

  const tiles = (glass) => (
    <>
      {visible.map((p) => (
        <Tile key={p.id} p={p} live={peek === p.id} picked={open === p.id} onPeek={onPeek} onRest={onRest} onPick={onPick} glass={glass} />
      ))}
      <More hidden={hidden} all={all} setAll={setAll} />
    </>
  );

  const fewer = all ? (
    <button type="button" className="v19-fewer" onClick={() => setAll(false)} data-keep-open="">Show fewer</button>
  ) : null;

  if (look === 'beside') {
    return (
      <section className="v19-slab v19-projects is-beside" ref={sectionRef} id="projects" aria-label="Projects">
        <div className="v19-slab-in v19-projects-in" ref={wrapRef}>
          {head}
          <div className="v19-beside">
            <Frame shown={shown} mode={mode} onClose={close} tall />
            <div>
              <div className="v19-grid" style={{ '--cols': cols }}>{tiles(false)}</div>
              {fewer}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (look === 'fill') {
    return (
      <section className="v19-slab v19-projects is-fill" ref={sectionRef} id="projects" aria-label="Projects">
        <div className="v19-slab-in v19-projects-in" ref={wrapRef}>
          {head}
          <div className={`v19-fill v19-view-${mode}`} data-keep-open="">
            <div className="v19-fill-ground" aria-hidden="true">
              <img key={shown.id} src={shown.image} alt="" className={shown.square ? 'is-square' : ''} />
            </div>
            <div className="v19-fill-words">
              <p className="v19-view-eye">
                <span>{mode === 'auto' ? 'Building right now' : shown.category}</span>
                {mode === 'detail' ? (
                  <button type="button" className="v19-view-close" onClick={close} data-keep-open="">Close</button>
                ) : null}
              </p>
              <h3 className="v19-view-name">{shown.name}</h3>
              <p className="v19-view-line">{shown.line}</p>
              <Links p={shown} />
            </div>
            <div className="v19-grid is-glass" style={{ '--cols': cols }}>{tiles(true)}</div>
          </div>
          {fewer}
        </div>
      </section>
    );
  }

  if (look === 'spec') {
    return (
      <section className="v19-slab v19-projects is-spec" ref={sectionRef} id="projects" aria-label="Projects">
        <div className="v19-slab-in v19-projects-in" ref={wrapRef}>
          {head}
          <div className="v19-specwrap">
            <div>
              <div className="v19-grid" style={{ '--cols': cols }}>{tiles(false)}</div>
              {fewer}
            </div>
            <Spec shown={shown} mode={mode} onClose={close} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="v19-slab v19-projects is-frame" ref={sectionRef} id="projects" aria-label="Projects">
      <div className="v19-slab-in v19-projects-in" ref={wrapRef}>
        {head}
        <Frame shown={shown} mode={mode} onClose={close} />
        <div className="v19-grid" style={{ '--cols': cols }}>{tiles(false)}</div>
        {fewer}
      </div>
    </section>
  );
}
