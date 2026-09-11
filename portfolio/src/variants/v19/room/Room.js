// v19 — the room. Full bleed, no frame, no heading: it is the bottom of the page, not a
// picture of a room sitting in a box.
//
// New here:
//   · the big monitor shows a real screenshot of a real project, pixelated down to the room's
//     own resolution and cycled. The second shows a paper page. Both are painted over the grid
//     after it rasterises, so they cost nothing in the pixel engine.
//   · he is bigger, waves when you point at him, and leans back when you click him.
//   · the plant has three growth habits, and the Lab picks which.
//   · the cards are a different object: a paper slip pinned to the room rather than a panel.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createGrid, rasterize, W, H } from './engine';
import { drawScene, HOTSPOTS, LIGHTS, SCREENS } from './scene';
import { BOOKS, GAMES, MAGNETS, POSTERS, TROPHIES, FAMILY, MEDALS } from '../personal';
import { ALL_PROJECTS, PAPERS, ROLES, ALFRED, ME, LINKS } from '../copy';
import { useLab } from '../lab';
import { useOnScreen } from '../hooks';

const FRAME_MS = 42; // ~24fps; pixel art does not want 60
const WALK_FROM = 2;
const WALK_TO = 128;
const WALK_MS = 2400;
const SCREEN_MS = 4600;

const TOGGLES = new Set(['lamp', 'lights', 'pc', 'window', 'door', 'ball', 'plant', 'mug']);

// what the big monitor cycles through
const ON_SCREEN = ['stellarium', 'mockflow-ai', 'snaider-cut', 'big5-agents', 'equity-project']
  .map((id) => ALL_PROJECTS.find((p) => p.id === id))
  .filter(Boolean);

function load(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/* ── the slip ───────────────────────────────────────────────────────── */

function List({ items }) {
  return (
    <ul className="v19-slip-list">
      {items.map((it) => (
        <li key={it.k}>
          <b>{it.k}</b>
          {it.v ? <span>{it.v}</span> : null}
          {it.extra ? <em>{it.extra}</em> : null}
        </li>
      ))}
    </ul>
  );
}

function Slip({ hotspot, onClose }) {
  if (!hotspot) return null;
  const { key } = hotspot;

  const body = () => {
    switch (key) {
      case 'monitorA':
        return {
          eye: `${ALL_PROJECTS.length} projects`,
          title: 'Everything I have made',
          node: <List items={ALL_PROJECTS.map((p) => ({ k: p.name, v: p.line }))} />,
        };
      case 'monitorB':
        return {
          eye: 'Peer review',
          title: 'Two papers',
          node: <List items={PAPERS.map((p) => ({ k: p.title, v: p.line, extra: `${p.status} · ${p.venue} · ${p.citations} citations` }))} />,
        };
      case 'laptop':
        return {
          eye: 'Work',
          title: 'Where I have worked',
          node: (
            <List
              items={[{ k: `${ALFRED.title}, ${ALFRED.company}`, v: ALFRED.lede, extra: ALFRED.when }].concat(
                ROLES.map((r) => ({ k: `${r.title}, ${r.company}`, v: r.line, extra: `${r.when} · ${r.where}` }))
              )}
            />
          ),
        };
      case 'me':
        return {
          eye: 'Hello',
          title: `${ME.first} ${ME.last}`,
          node: (
            <>
              <p className="v19-slip-p">{ME.lede}</p>
              {ME.lines.map((l) => (
                <p className="v19-slip-p" key={l}>{l}</p>
              ))}
              <p className="v19-slip-links">
                {LINKS.map((l) => (
                  <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                    {l.label}
                  </a>
                ))}
              </p>
            </>
          ),
        };
      case 'photo':
        return {
          eye: 'On the desk',
          title: 'Family',
          node: (
            <>
              <p className="v19-slip-p">{FAMILY.caption}</p>
              {FAMILY.sample ? <p className="v19-sample">Sample — his caption goes here.</p> : null}
            </>
          ),
        };
      case 'trophies':
        return { eye: 'On the shelf', title: 'Won', node: <List items={TROPHIES.map((t) => ({ k: t.name, v: t.what }))} /> };
      case 'medals':
        return {
          eye: 'Hanging off the end',
          title: 'Medals',
          node: (
            <>
              <List items={MEDALS.map((m) => ({ k: m.name, v: m.note }))} />
              <p className="v19-sample">Samples — his own go here.</p>
            </>
          ),
        };
      case 'books':
        return { eye: 'One shelf', title: 'Books', node: <List items={BOOKS.map((b) => ({ k: b.title, v: b.note, extra: `${b.author} · ${b.status}` }))} /> };
      case 'games':
        return {
          eye: 'On the floor by the tower',
          title: 'Games',
          node: (
            <>
              <List items={GAMES.map((b) => ({ k: b.title, v: b.note }))} />
              <p className="v19-sample">All samples — his real list replaces these.</p>
            </>
          ),
        };
      case 'fridge':
        return {
          eye: 'On the fridge',
          title: 'Magnets',
          node: (
            <>
              <List items={MAGNETS.map((m) => ({ k: m.label, v: m.note }))} />
              <p className="v19-sample">All samples — one memory each, his to write.</p>
            </>
          ),
        };
      case 'poster1':
      case 'poster2':
      case 'poster3': {
        const p = POSTERS[Number(key.slice(-1)) - 1];
        return {
          eye: 'On the wall',
          title: p.title,
          node: (
            <>
              <p className="v19-slip-p">{p.by}, {p.year}.</p>
              <p className="v19-slip-p">{p.note}</p>
              {p.placeholder ? <p className="v19-sample">Placeholder — his own line about it goes here.</p> : null}
            </>
          ),
        };
      }
      default:
        return null;
    }
  };

  const content = body();
  if (!content) return null;

  return (
    <aside className="v19-slip" data-keep-open="" role="dialog" aria-label={hotspot.label}>
      <span className="v19-slip-pin" aria-hidden="true" />
      <button type="button" className="v19-slip-x" onClick={onClose} aria-label="Close">×</button>
      <p className="v19-slip-eye">{content.eye}</p>
      <h3 className="v19-slip-title">{content.title}</h3>
      <div className="v19-slip-body">{content.node}</div>
    </aside>
  );
}

/* ── the room ───────────────────────────────────────────────────────── */

export default function Room({ sectionRef }) {
  const { lab } = useLab();
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const gridRef = useRef(null);
  const imgRef = useRef(null);
  const shotsRef = useRef([]);
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
    mode: 'idle', // idle | walk | stand | sit | wave | lean
    frame: 0,
    walkX: WALK_FROM,
    plantStyle: 'stems',
    t: 0,
  });
  const hoverRef = useRef(0);
  const walkRef = useRef(null);
  const bounceRef = useRef(null);
  const leanRef = useRef(null);

  const seen = useOnScreen(sectionRef, '-20%');
  const [hover, setHover] = useState(0);
  const [openKey, setOpenKey] = useState(null);
  const [kind, setKind] = useState('');

  stateRef.current.plantStyle = lab.plant;

  const hotspot = useMemo(() => HOTSPOTS.find((h) => h.id === hover) || null, [hover]);
  const openHotspot = useMemo(() => HOTSPOTS.find((h) => h.key === openKey) || null, [openKey]);

  /* real screenshots, loaded once */
  useEffect(() => {
    let alive = true;
    Promise.all(ON_SCREEN.map((p) => load(p.image)))
      .then((imgs) => {
        if (alive) shotsRef.current = imgs.filter(Boolean);
      })
      .catch(() => {
        // a screen with nothing in it still reads as a screen
      });
    return () => {
      alive = false;
    };
  }, []);

  /* he walks in, once */
  useEffect(() => {
    if (!seen) return undefined;
    const st = stateRef.current;
    if (st.mode !== 'idle' || walkRef.current) return undefined;
    st.mode = 'walk';
    st.doorOpen = true;
    walkRef.current = { t0: performance.now() };
    const land = window.setTimeout(() => {
      st.mode = 'sit';
      st.doorOpen = false;
      walkRef.current = null;
    }, WALK_MS + 700);
    return () => window.clearTimeout(land);
  }, [seen]);

  /* the loop */
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    cv.width = W;
    cv.height = H;
    ctx.imageSmoothingEnabled = false;
    gridRef.current = createGrid();
    imgRef.current = ctx.createImageData(W, H);

    let raf = 0;
    let alive = true;
    let lastDraw = 0;
    let lastFrame = 0;

    /* the picture inside the big monitor — a real screenshot, cropped and pixelated */
    const paintScreens = (now) => {
      const st = stateRef.current;
      const a = SCREENS.monitorA;
      const b = SCREENS.monitorB;
      if (!st.pc) return;
      const shots = shotsRef.current;
      if (shots.length) {
        const img = shots[Math.floor(now / SCREEN_MS) % shots.length];
        if (img && img.width) {
          const scale = Math.max(a.w / img.width, a.h / img.height);
          const sw = a.w / scale;
          const sh = a.h / scale;
          ctx.save();
          ctx.beginPath();
          ctx.rect(a.x, a.y, a.w, a.h);
          ctx.clip();
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, a.x, a.y, a.w, a.h);
          // let the room's evening sit over the screenshot so it belongs in the room
          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = st.windowOpen ? 'rgba(226,232,238,1)' : 'rgba(178,190,214,1)';
          ctx.fillRect(a.x, a.y, a.w, a.h);
          ctx.restore();
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      // the second monitor: a paper, in portrait, with a title block and two columns
      ctx.fillStyle = '#e8e6df';
      ctx.fillRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2);
      ctx.fillStyle = '#3b3a38';
      ctx.fillRect(b.x + 3, b.y + 3, b.w - 6, 2);
      ctx.fillRect(b.x + 3, b.y + 6, b.w - 11, 1);
      ctx.fillStyle = '#8a8782';
      for (let i = 0; i < 9; i += 1) {
        ctx.fillRect(b.x + 3, b.y + 11 + i * 2, 6, 1);
        ctx.fillRect(b.x + 11, b.y + 11 + i * 2, 5 + ((i * 3) % 3), 1);
      }
      ctx.fillStyle = '#2f6a8f';
      ctx.fillRect(b.x + 3, b.y + b.h - 5, 7, 1);

      // He sits in front of the big monitor, so the screenshot lands on top of him. Put his
      // own pixels back — the grid tags every pixel he owns with his hotspot id, so this is
      // exact rather than a guess at a bounding box.
      const grid = gridRef.current;
      const frame = imgRef.current;
      if (!grid || !frame) return;
      for (let y = a.y; y < a.y + a.h; y += 1) {
        for (let x = a.x; x < a.x + a.w; x += 1) {
          const i = y * W + x;
          if (grid.ids[i] !== 2) continue;
          const o = i * 4;
          ctx.fillStyle = `rgb(${frame.data[o]},${frame.data[o + 1]},${frame.data[o + 2]})`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    };

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

      const night = st.windowOpen ? 0.1 : 0.54;
      const lights = [];
      if (st.lamp) lights.push({ ...LIGHTS.lamp, on: true });
      if (st.pc) lights.push({ ...LIGHTS.screens, on: true });
      if (st.string) LIGHTS.string.forEach((l) => lights.push({ ...l, on: true }));

      drawScene(gridRef.current, st);
      rasterize(gridRef.current, imgRef.current, { night, lights, hover: hoverRef.current });
      ctx.putImageData(imgRef.current, 0, 0);
      paintScreens(now);
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
      if (leanRef.current) window.clearTimeout(leanRef.current);
    };
  }, []);

  /* pointer */
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
        st.sparkle = h ? h.key === 'trophies' || h.key === 'medals' : false;
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

      if (h.key === 'me') {
        // he leans back, and then goes back to work
        st.mode = 'lean';
        if (leanRef.current) window.clearTimeout(leanRef.current);
        leanRef.current = window.setTimeout(() => {
          if (stateRef.current.mode === 'lean') stateRef.current.mode = 'sit';
        }, 2600);
      }

      if (TOGGLES.has(h.key)) {
        setOpenKey(null);
        switch (h.key) {
          case 'lamp': st.lamp = !st.lamp; break;
          case 'lights': st.string = !st.string; break;
          case 'pc': st.pc = !st.pc; break;
          case 'window': st.windowOpen = !st.windowOpen; break;
          case 'door':
            st.doorOpen = !st.doorOpen;
            if (st.doorOpen && (st.mode === 'sit' || st.mode === 'lean')) {
              st.mode = 'stand';
              st.walkX = WALK_TO;
              window.setTimeout(() => {
                walkRef.current = { t0: performance.now() };
                st.mode = 'walk';
              }, 480);
            }
            break;
          case 'ball': {
            if (bounceRef.current) window.clearInterval(bounceRef.current);
            let n = 0;
            bounceRef.current = window.setInterval(() => {
              n += 1;
              const decay = Math.max(0, 1 - n / 26);
              st.bounce = Math.round(Math.abs(Math.sin(n / 2.1)) * 17 * decay);
              if (n > 26) {
                st.bounce = 0;
                window.clearInterval(bounceRef.current);
                bounceRef.current = null;
              }
            }, 42);
            break;
          }
          case 'plant': st.grown = !st.grown; break;
          case 'mug': st.cold = !st.cold; break;
          default: break;
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
      if (e.target && e.target.closest && e.target.closest('[data-keep-open], .v19-room-canvas')) return;
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

  // posters and books say what they are without opening anything
  const caption = (() => {
    if (!hotspot) return '';
    if (hotspot.key.startsWith('poster')) {
      const p = POSTERS[Number(hotspot.key.slice(-1)) - 1];
      return `${p.title} — ${p.note}`;
    }
    if (hotspot.key === 'books') return BOOKS.map((b) => b.title).join(' · ');
    return hotspot.label;
  })();

  return (
    <section className="v19-room" ref={sectionRef} id="room" aria-label="My room">
      <div className={`v19-room-stage${kind ? ` k-${kind}` : ''}`}>
        <canvas
          ref={canvasRef}
          className="v19-room-canvas"
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          onClick={onClick}
          aria-label="An interactive drawing of my room. Everything in it does something."
          role="img"
        />
        <p className={`v19-room-cap${caption ? ' on' : ''}`}>{caption}</p>
        <Slip hotspot={openHotspot} onClose={() => setOpenKey(null)} />
      </div>

      <div className={`v19-room-cursor${kind ? ` k-${kind}` : ''}`} ref={cursorRef} aria-hidden="true">
        <svg className="v19-rc-zoom" viewBox="0 0 32 32" width="30" height="30">
          <circle cx="13" cy="13" r="8.5" fill="rgba(255,255,253,.45)" stroke="#1f1f1d" strokeWidth="2" />
          <path d="M19.4 19.4 L28 28" stroke="#1f1f1d" strokeWidth="3" strokeLinecap="round" />
          <path d="M9.5 13 h7 M13 9.5 v7" stroke="#c1412f" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <svg className="v19-rc-hand" viewBox="0 0 32 32" width="30" height="30">
          <rect x="8" y="5" width="16" height="22" rx="7" fill="rgba(255,255,253,.92)" stroke="#1f1f1d" strokeWidth="2" />
          <circle cx="16" cy="11" r="3.4" fill="#c1412f" />
          <path d="M12 21 h8" stroke="#1f1f1d" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}
