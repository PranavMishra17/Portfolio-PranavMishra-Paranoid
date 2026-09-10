// v18 — the room. It is the footer, not a section.
//
// Everything in it does something. Toggles change the room (the lamp, the string lights, the
// tower, the window, the door, the ball, the plant, the tea); the screens and the shelf open
// a card. The cursor says which is which before you click: a switch over a toggle, a loupe
// over something that opens.
//
// He walks in the first time you get here, and sits down.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createGrid, rasterize, W, H } from './engine';
import { drawScene, HOTSPOTS, LIGHTS } from './scene';
import { BOOKS, GAMES, MAGNETS, POSTERS, TROPHIES, FAMILY, FOOTBALL } from '../personal';
import { ALL_PROJECTS, PAPERS, ROLES, ALFRED, ME, LINKS } from '../copy';
import { useOnScreen } from '../hooks';

const FRAME_MS = 42; // ~24fps; pixel art does not want 60
const WALK_FROM = 2;
const WALK_TO = 126;
const WALK_MS = 2600;

const TOGGLES = new Set(['lamp', 'lights', 'pc', 'window', 'door', 'ball', 'plant', 'mug']);

const NOTE = {};
POSTERS.forEach((p, i) => {
  NOTE[`poster${i + 1}`] = `${p.title} — ${p.by}, ${p.year}`;
});

function Card({ hotspot, onClose }) {
  if (!hotspot) return null;
  const { key } = hotspot;

  const body = () => {
    switch (key) {
      case 'monitorA':
        return (
          <>
            <p className="v18-card-eye">{ALL_PROJECTS.length} projects</p>
            <h3>Everything I have made</h3>
            <ul className="v18-card-list">
              {ALL_PROJECTS.map((p) => (
                <li key={p.id}>
                  <b>{p.name}</b>
                  <span>{p.line}</span>
                </li>
              ))}
            </ul>
          </>
        );
      case 'monitorB':
        return (
          <>
            <p className="v18-card-eye">Three papers</p>
            <h3>Written down properly</h3>
            <ul className="v18-card-list">
              {PAPERS.map((p) => (
                <li key={p.id}>
                  <b>{p.title}</b>
                  <span>
                    {p.status} · {p.venue}
                  </span>
                  <span>{p.line}</span>
                </li>
              ))}
            </ul>
          </>
        );
      case 'laptop':
        return (
          <>
            <p className="v18-card-eye">Work</p>
            <h3>Where I have worked</h3>
            <ul className="v18-card-list">
              <li>
                <b>
                  {ALFRED.title}, {ALFRED.company}
                </b>
                <span>{ALFRED.when}</span>
                <span>{ALFRED.lede}</span>
              </li>
              {ROLES.map((r) => (
                <li key={r.id}>
                  <b>
                    {r.title}, {r.company}
                  </b>
                  <span>
                    {r.when} · {r.where}
                  </span>
                  <span>{r.line}</span>
                </li>
              ))}
            </ul>
          </>
        );
      case 'me':
        return (
          <>
            <p className="v18-card-eye">Hello</p>
            <h3>{ME.first} {ME.last}</h3>
            <p className="v18-card-p">{ME.lede}</p>
            {ME.lines.map((l) => (
              <p className="v18-card-p" key={l}>{l}</p>
            ))}
            <p className="v18-card-links">
              {LINKS.map((l) => (
                <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                  {l.label}
                </a>
              ))}
            </p>
          </>
        );
      case 'photo':
        return (
          <>
            <p className="v18-card-eye">On the desk</p>
            <h3>Family</h3>
            <p className="v18-card-p">{FAMILY.caption}</p>
            {FAMILY.sample ? <p className="v18-sample">Sample — his caption goes here.</p> : null}
          </>
        );
      case 'trophies':
        return (
          <>
            <p className="v18-card-eye">On top of the shelf</p>
            <h3>Won</h3>
            <ul className="v18-card-list">
              {TROPHIES.map((t) => (
                <li key={t.id}>
                  <b>{t.name}</b>
                  <span>{t.what}</span>
                </li>
              ))}
            </ul>
          </>
        );
      case 'books':
      case 'shelf3':
        return (
          <>
            <p className="v18-card-eye">The shelf</p>
            <h3>Books</h3>
            <ul className="v18-card-list">
              {BOOKS.map((b) => (
                <li key={b.id}>
                  <b>
                    {b.title} <i>{b.author}</i>
                  </b>
                  <span>{b.note}</span>
                  <em className="v18-card-tag">{b.status}</em>
                </li>
              ))}
            </ul>
          </>
        );
      case 'games':
        return (
          <>
            <p className="v18-card-eye">The shelf</p>
            <h3>Games</h3>
            <ul className="v18-card-list">
              {GAMES.map((b) => (
                <li key={b.id}>
                  <b>{b.title}</b>
                  <span>{b.note}</span>
                </li>
              ))}
            </ul>
            <p className="v18-sample">All samples — his real list replaces these.</p>
          </>
        );
      case 'fridge':
        return (
          <>
            <p className="v18-card-eye">On the fridge</p>
            <h3>Magnets</h3>
            <ul className="v18-card-list">
              {MAGNETS.map((m) => (
                <li key={m.id}>
                  <b>
                    <span className="v18-magnet" style={{ background: m.tint }} aria-hidden="true">
                      {m.glyph}
                    </span>
                    {m.label}
                  </b>
                  <span>{m.note}</span>
                </li>
              ))}
            </ul>
            <p className="v18-sample">All samples — one memory each, his to write.</p>
          </>
        );
      case 'poster1':
      case 'poster2':
      case 'poster3': {
        const p = POSTERS[Number(key.slice(-1)) - 1];
        return (
          <>
            <p className="v18-card-eye">On the wall</p>
            <h3>{p.title}</h3>
            <p className="v18-card-p">
              {p.by}, {p.year}.
            </p>
            <p className="v18-card-p">{p.note}</p>
          </>
        );
      }
      default:
        return null;
    }
  };

  return (
    <aside className="v18-card" data-keep-open="" role="dialog" aria-label={hotspot.label}>
      <button type="button" className="v18-card-x" onClick={onClose} aria-label="Close">
        Close
      </button>
      {body()}
    </aside>
  );
}

export default function Room({ sectionRef }) {
  const hostRef = useRef(null);
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const gridRef = useRef(null);
  const imgRef = useRef(null);
  const stateRef = useRef({
    lamp: true,
    string: true,
    pc: true,
    windowOpen: false,
    doorOpen: false,
    fridgeOpen: false,
    grown: false,
    cold: false,
    sparkle: false,
    bounce: 0,
    mode: 'idle',      // idle | walk | stand | wave
    frame: 0,
    walkX: WALK_FROM,
    t: 0,
  });
  const hoverRef = useRef(0);
  const walkRef = useRef(null);
  const bounceRef = useRef(null);

  const seen = useOnScreen(sectionRef, '-25%');
  const [hover, setHover] = useState(0);
  const [openKey, setOpenKey] = useState(null);
  const [kind, setKind] = useState('');

  const hotspot = useMemo(() => HOTSPOTS.find((h) => h.id === hover) || null, [hover]);
  const openHotspot = useMemo(() => HOTSPOTS.find((h) => h.key === openKey) || null, [openKey]);

  /* ── he walks in, once ── */
  useEffect(() => {
    if (!seen) return undefined;
    const st = stateRef.current;
    if (st.mode !== 'idle' || walkRef.current) return undefined;
    st.mode = 'walk';
    st.doorOpen = true;
    walkRef.current = { t0: performance.now() };
    // whatever happens to the loop, he ends up in the chair
    const land = window.setTimeout(() => {
      st.mode = 'sit';
      st.doorOpen = false;
      walkRef.current = null;
    }, WALK_MS + 700);
    return () => window.clearTimeout(land);
  }, [seen]);

  /* ── the loop ── */
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    cv.width = W;
    cv.height = H;
    gridRef.current = createGrid();
    imgRef.current = ctx.createImageData(W, H);

    let raf = 0;
    let alive = true;
    let lastDraw = 0;
    let lastFrame = 0;

    const paint = (now) => {
      const st = stateRef.current;
      st.t = now;

      const walk = walkRef.current;
      if (walk) {
        const p = Math.min(1, (now - walk.t0) / WALK_MS);
        st.walkX = Math.round(WALK_FROM + (WALK_TO - WALK_FROM) * p);
        st.frame = Math.floor(now / 130) % 4;
        st.mode = p >= 1 ? 'sit' : 'walk';
        if (p >= 1) {
          st.doorOpen = false;
          walkRef.current = null;
        }
      }

      const night = st.windowOpen ? 0.1 : 0.56;
      const lights = [];
      if (st.lamp) lights.push({ ...LIGHTS.lamp, on: true });
      if (st.pc) lights.push({ ...LIGHTS.screens, on: true });
      if (st.string) LIGHTS.string.forEach((l) => lights.push({ ...l, on: true }));

      drawScene(gridRef.current, st);
      rasterize(gridRef.current, imgRef.current, { night, lights, hover: hoverRef.current });
      ctx.putImageData(imgRef.current, 0, 0);
    };

    const loop = (now) => {
      if (!alive) return;
      lastFrame = now;
      if (now - lastDraw >= FRAME_MS) {
        lastDraw = now;
        try {
          paint(now);
        } catch (err) {
          // one bad frame must not take the room down; the next one will try again
        }
      }
      raf = window.requestAnimationFrame(loop);
    };

    paint(performance.now()); // first paint is never owed to rAF
    raf = window.requestAnimationFrame(loop);
    const watchdog = window.setInterval(() => {
      if (!alive) return;
      const now = performance.now();
      if (now - lastFrame > 400) {
        lastDraw = 0;
        loop(now);
      }
    }, 300);

    return () => {
      alive = false;
      window.cancelAnimationFrame(raf);
      window.clearInterval(watchdog);
      if (bounceRef.current) window.clearInterval(bounceRef.current);
    };
  }, []);

  /* ── pointer ── */
  const at = useCallback((e) => {
    const cv = canvasRef.current;
    if (!cv) return null;
    const r = cv.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    const x = ((e.clientX - r.left) / r.width) * W;
    const y = ((e.clientY - r.top) / r.height) * H;
    if (x < 0 || y < 0 || x >= W || y >= H) return null;
    return HOTSPOTS.find((h) => x >= h.x && x < h.x + h.w && y >= h.y && y < h.y + h.h) || null;
  }, []);

  const onMove = useCallback(
    (e) => {
      const h = at(e);
      const id = h ? h.id : 0;
      if (id !== hoverRef.current) {
        hoverRef.current = id;
        setHover(id);
        setKind(h ? h.kind : '');
        const st = stateRef.current;
        st.sparkle = h ? h.key === 'trophies' : false;
        if (h && h.key === 'me' && st.mode === 'sit') st.mode = 'wave';
        else if (st.mode === 'wave' && (!h || h.key !== 'me')) st.mode = 'sit';
      }
      const c = cursorRef.current;
      if (c) c.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    },
    [at]
  );

  const onLeave = useCallback(() => {
    hoverRef.current = 0;
    setHover(0);
    setKind('');
    const st = stateRef.current;
    st.sparkle = false;
    if (st.mode === 'wave') st.mode = 'sit';
  }, []);

  const onClick = useCallback(
    (e) => {
      const h = at(e);
      if (!h) {
        setOpenKey(null);
        return;
      }
      const st = stateRef.current;
      if (TOGGLES.has(h.key)) {
        setOpenKey(null);
        switch (h.key) {
          case 'lamp':
            st.lamp = !st.lamp;
            break;
          case 'lights':
            st.string = !st.string;
            break;
          case 'pc':
            st.pc = !st.pc;
            break;
          case 'window':
            st.windowOpen = !st.windowOpen;
            break;
          case 'door':
            st.doorOpen = !st.doorOpen;
            if (st.doorOpen && st.mode === 'sit') {
              st.mode = 'stand';
              st.walkX = WALK_TO;
              walkRef.current = { t0: performance.now() - WALK_MS * 0.02, out: true };
              // he gets up and leaves, then comes back — the loop only walks him in, so
              // send him out by hand and let the walk bring him home
              window.setTimeout(() => {
                walkRef.current = { t0: performance.now() };
                st.mode = 'walk';
              }, 500);
            }
            break;
          case 'ball': {
            if (bounceRef.current) window.clearInterval(bounceRef.current);
            let n = 0;
            bounceRef.current = window.setInterval(() => {
              n += 1;
              const decay = Math.max(0, 1 - n / 26);
              st.bounce = Math.round(Math.abs(Math.sin(n / 2.1)) * 16 * decay);
              if (n > 26) {
                st.bounce = 0;
                window.clearInterval(bounceRef.current);
                bounceRef.current = null;
              }
            }, 42);
            break;
          }
          case 'plant':
            st.grown = !st.grown;
            break;
          case 'mug':
            st.cold = !st.cold;
            break;
          default:
            break;
        }
        return;
      }
      if (h.key === 'fridge') st.fridgeOpen = !st.fridgeOpen;
      setOpenKey((cur) => (cur === h.key ? null : h.key));
    },
    [at]
  );

  useEffect(() => {
    if (!openKey) return undefined;
    const away = (e) => {
      if (e.target && e.target.closest && e.target.closest('[data-keep-open], .v18-room-canvas')) return;
      setOpenKey(null);
    };
    const key = (e) => {
      if (e.key === 'Escape') setOpenKey(null);
    };
    window.addEventListener('pointerdown', away);
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('pointerdown', away);
      window.removeEventListener('keydown', key);
    };
  }, [openKey]);

  const caption = hotspot ? NOTE[hotspot.key] || hotspot.label : '';

  return (
    <section className="v18-slab v18-room" ref={sectionRef} id="room" aria-label="My room">
      <div className="v18-room-in" ref={hostRef}>
        <header className="v18-room-head">
          <p className="v18-eye">
            <span className="v18-dot" aria-hidden="true" />
            Where all of it happened
          </p>
          <h2 className="v18-h2 v18-h2-tight">My room.</h2>
          <p className="v18-room-say">Everything in here does something. Some of it opens.</p>
        </header>

        <div className={`v18-room-stage${kind ? ` k-${kind}` : ''}`}>
          <canvas
            ref={canvasRef}
            className="v18-room-canvas"
            onPointerMove={onMove}
            onPointerLeave={onLeave}
            onClick={onClick}
            aria-label="An interactive drawing of my room"
            role="img"
          />
          <p className={`v18-room-cap${caption ? ' on' : ''}`}>{caption}</p>
          <Card hotspot={openHotspot} onClose={() => setOpenKey(null)} />
        </div>

        <ul className="v18-room-list" aria-label="What is in the room">
          {HOTSPOTS.filter((h) => h.kind === 'zoom').map((h) => (
            <li key={h.id}>{h.label}</li>
          ))}
          <li>{FOOTBALL.note}</li>
        </ul>
      </div>

      <div className={`v18-room-cursor${kind ? ` k-${kind}` : ''}`} ref={cursorRef} aria-hidden="true">
        <svg className="v18-rc-zoom" viewBox="0 0 32 32" width="30" height="30">
          <circle cx="13" cy="13" r="8.5" fill="rgba(255,252,246,.45)" stroke="#241f1b" strokeWidth="2" />
          <path d="M19.4 19.4 L28 28" stroke="#241f1b" strokeWidth="3" strokeLinecap="round" />
          <path d="M9.5 13 h7 M13 9.5 v7" stroke="#e2603a" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <svg className="v18-rc-hand" viewBox="0 0 32 32" width="30" height="30">
          <rect x="8" y="5" width="16" height="22" rx="7" fill="rgba(255,252,246,.9)" stroke="#241f1b" strokeWidth="2" />
          <circle cx="16" cy="11" r="3.4" fill="#e2603a" />
          <path d="M12 21 h8" stroke="#241f1b" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}
