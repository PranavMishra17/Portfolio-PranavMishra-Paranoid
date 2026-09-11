// v19 — the rack, rebuilt.
//
// Everything he said was wrong with v18's version, and what replaced it:
//
//   circles                    → rectangles. Tiles, not rounds.
//   everything at once         → two rows, and the last cell of the second row opens the rest.
//   tiles lift and saturate    → nothing moves and nothing changes colour on hover. A rule
//                                appears along the bottom edge of the tile, inside it.
//   the viewbox jittered       → it is a fixed frame now. The image is a 16:9 crop that never
//                                changes size, the text sits in fixed rows, and switching is
//                                a crossfade. No element ever changes height.
//   two scrollbars             → nothing inside the viewbox scrolls. The detail is clamped to
//                                what fits, and the links are always on the same line.
//
// Three rackings, and they are different designs rather than different shapes:
//   grid    — the viewbox above, two rows of thumbnails below
//   index   — no thumbnails at all; a typographic index beside a portrait viewbox
//   sheet   — no viewbox; the tiles are the page, and the detail opens as a band beneath them

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

function useCols() {
  const [cols, setCols] = useState(9);
  useEffect(() => {
    const read = () => {
      const w = window.innerWidth;
      const hit = COLS.find(([min]) => w >= min) || COLS[COLS.length - 1];
      setCols(hit[1]);
    };
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, []);
  return cols;
}

/* One tile. It never transforms and it never changes colour — the only thing that happens is
   a rule along its bottom edge, drawn inside its own box. */
function Tile({ p, i, live, picked, onPeek, onRest, onPick, showName }) {
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
      <span className="v19-tile-no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
      {showName ? <span className="v19-tile-name">{p.name}</span> : null}
      <span className="v19-tile-rule" aria-hidden="true" />
    </button>
  );
}

/* The viewbox. Every part of it is a fixed box, so nothing on this page can move. */
function View({ shown, mode, onClose, portrait }) {
  return (
    <div className={`v19-view${portrait ? ' is-portrait' : ''} v19-view-${mode}`} data-keep-open="">
      <div className="v19-view-frame">
        <img key={shown.id} src={shown.image} alt="" loading="lazy" className={shown.square ? 'is-square' : ''} />
        <span className="v19-view-tag">{shown.tag}</span>
      </div>

      <div className="v19-view-words">
        <p className="v19-view-eye">
          <span>{mode === 'auto' ? 'Building right now' : shown.category}</span>
          {mode === 'detail' ? (
            <button type="button" className="v19-view-close" onClick={onClose} data-keep-open="">
              Close
            </button>
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

        <p className="v19-view-links">
          {shown.demo ? <a href={shown.demo} target="_blank" rel="noreferrer">Watch it</a> : null}
          {shown.site ? <a href={shown.site} target="_blank" rel="noreferrer">Use it</a> : null}
          {shown.github ? <a href={shown.github} target="_blank" rel="noreferrer">Source</a> : null}
        </p>
      </div>
    </div>
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
  const [all, setAll] = useState(false);
  const cols = useCols();

  const list = ALL_PROJECTS;
  // two rows, and the last cell of the second row is the way to the rest
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
    (open && list.find((p) => p.id === open)) ||
    (peek && list.find((p) => p.id === peek)) ||
    NOW_BUILDING[auto % Math.max(1, NOW_BUILDING.length)] ||
    list[0];
  const mode = open ? 'detail' : peek ? 'peek' : 'auto';

  const head = useMemo(
    () => (
      <header className="v19-rack-head">
        <p className="v19-eye">
          <span className="v19-dot" aria-hidden="true" />
          {list.length} of them
        </p>
        <h2 className="v19-h2 v19-h2-tight">Things I made.</h2>
      </header>
    ),
    [list.length]
  );

  const more = hidden > 0 && !all ? (
    <button type="button" className="v19-tile v19-tile-more" onClick={() => setAll(true)} data-keep-open="">
      <span className="v19-tile-more-n">+{hidden}</span>
      <span className="v19-tile-more-l">Show all</span>
      <span className="v19-tile-rule" aria-hidden="true" />
    </button>
  ) : null;

  const fewer = all ? (
    <button type="button" className="v19-fewer" onClick={() => setAll(false)} data-keep-open="">
      Show fewer
    </button>
  ) : null;

  /* ── sheet: no viewbox. The tiles carry their own label, and the detail opens beneath. ── */
  if (rack === 'sheet') {
    return (
      <section className="v19-slab v19-projects is-sheet" ref={sectionRef} id="projects" aria-label="Projects">
        <div className="v19-slab-in v19-projects-in" ref={wrapRef}>
          {head}
          <div className="v19-grid is-sheet" style={{ '--cols': cols }}>
            {visible.map((p, i) => (
              <Tile
                key={p.id}
                p={p}
                i={list.indexOf(p)}
                live={peek === p.id}
                picked={open === p.id}
                onPeek={onPeek}
                onRest={onRest}
                onPick={onPick}
                showName
              />
            ))}
            {more}
          </div>
          {fewer}
          <div className={`v19-band${open ? ' is-open' : ''}`} data-keep-open="">
            {open ? (
              <>
                <div className="v19-band-frame">
                  <img src={shown.image} alt="" className={shown.square ? 'is-square' : ''} />
                </div>
                <div className="v19-band-words">
                  <p className="v19-view-eye">
                    <span>{shown.category}</span>
                    <button type="button" className="v19-view-close" onClick={close} data-keep-open="">Close</button>
                  </p>
                  <h3 className="v19-view-name">{shown.name}</h3>
                  <p className="v19-view-line">{shown.line}</p>
                  <p className="v19-view-links">
                    {shown.demo ? <a href={shown.demo} target="_blank" rel="noreferrer">Watch it</a> : null}
                    {shown.site ? <a href={shown.site} target="_blank" rel="noreferrer">Use it</a> : null}
                    {shown.github ? <a href={shown.github} target="_blank" rel="noreferrer">Source</a> : null}
                  </p>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  /* ── index: a typographic list beside a portrait viewbox. No thumbnails anywhere. ── */
  if (rack === 'index') {
    return (
      <section className="v19-slab v19-projects is-index" ref={sectionRef} id="projects" aria-label="Projects">
        <div className="v19-slab-in v19-projects-in" ref={wrapRef}>
          {head}
          <div className="v19-index">
            <View shown={shown} mode={mode} onClose={close} portrait />
            <div className="v19-index-list">
              <ol style={{ '--cols': Math.max(2, Math.round(cols / 3)) }}>
                {visible.map((p) => (
                  <li key={p.id}>
                    <button
                      type="button"
                      className={`v19-index-row${peek === p.id ? ' is-live' : ''}${open === p.id ? ' is-picked' : ''}`}
                      onMouseEnter={() => onPeek(p.id)}
                      onFocus={() => onPeek(p.id)}
                      onMouseLeave={onRest}
                      onBlur={onRest}
                      onClick={() => onPick(p.id)}
                      data-keep-open=""
                    >
                      <i>{String(list.indexOf(p) + 1).padStart(2, '0')}</i>
                      <b>{p.name}</b>
                    </button>
                  </li>
                ))}
                {hidden > 0 && !all ? (
                  <li>
                    <button type="button" className="v19-index-row is-more" onClick={() => setAll(true)} data-keep-open="">
                      <i>++</i>
                      <b>Show all {list.length}</b>
                    </button>
                  </li>
                ) : null}
              </ol>
              {fewer}
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── grid: the default. Viewbox above, two rows of thumbnails below. ── */
  return (
    <section className="v19-slab v19-projects is-grid" ref={sectionRef} id="projects" aria-label="Projects">
      <div className="v19-slab-in v19-projects-in" ref={wrapRef}>
        {head}
        <View shown={shown} mode={mode} onClose={close} />
        <div className="v19-grid" style={{ '--cols': cols }}>
          {visible.map((p) => (
            <Tile
              key={p.id}
              p={p}
              i={list.indexOf(p)}
              live={peek === p.id}
              picked={open === p.id}
              onPeek={onPeek}
              onRest={onRest}
              onPick={onPick}
            />
          ))}
          {more}
        </div>
        {fewer}
      </div>
    </section>
  );
}
