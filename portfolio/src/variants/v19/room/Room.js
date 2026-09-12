// v19 — the room. The bottom of the page, not a picture of a room.
//
// It fills the screen — the canvas covers the viewport the way a background image would, and
// its top edge is masked into the page so the wall of the room is the page's own paper
// continuing down. Nothing is drawn around it and nothing sits under it except the way back
// up, which stands on the rug.
//
// Nobody is in it. The chair is empty; click it and it spins.
//
// The room keeps the page's clock. It is as dark in here as it is outside at this hour — never
// darker than a blue evening — and the lamp and the string lights come on when it is. Open the
// window and the day comes in, whatever the hour.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createGrid, rasterize, W, H, ROOF } from './engine';
import { nightAt } from '../hooks';
import { drawScene, HOTSPOTS, LIGHTS, SCREENS } from './scene';
import { BOOKS, GAMES, POSTERS, TROPHIES, MEDALS } from '../personal';
import { ALL_PROJECTS, PAPERS, ROLES, ALFRED, LINKS, MORE_LINKS } from '../copy';

// which project each trophy came out of
const FROM = { mit: 'snaider-cut', hint: 'virtual-van-gogh' };
const isYouTube = (u) => /youtu\.?be/i.test(u || '');

const FRAME_MS = 42;
const SCREEN_MS = 4600;
const SPIN_MS = 1500;

const TOGGLES = new Set(['lamp', 'lights', 'pc', 'window', 'ball', 'mug', 'chair', 'clock', 'disco']);

// the four colours the disco throws round the room
const DISCO = [[255, 84, 196], [84, 214, 255], [255, 222, 84], [128, 255, 140]];

const EVENING = { night: 0.5, lamp: true, string: true, pc: true, windowOpen: false, mono: false, hour: 19 };

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

function Slip({ hotspot, onClose, onJump }) {
  if (!hotspot) return null;
  const { key } = hotspot;
  const sc = hotspot.screen;
  const content = body(key);
  if (!content) return null;
  let place = null;
  if (sc) {
    const w = Math.min(content && content.wide ? 560 : 380, sc.stageW * (content && content.wide ? 0.6 : 0.42));
    const gap = 18;
    const right = sc.left + sc.width + gap;
    const fitsRight = right + w < sc.stageW - 12;
    const left = fitsRight ? right : Math.max(12, sc.left - gap - w);
    const top = Math.max(12, Math.min(sc.top + sc.height / 2 - 120, sc.stageH - 12 - (content && content.wide ? 560 : 300)));
    place = { left, top, width: w, side: fitsRight ? 'right' : 'left', pointerY: Math.max(18, Math.min(sc.top + sc.height / 2 - top, 280)) };
  }
  function body(k) {
    switch (k) {
      case 'monitorA':
        return {
          eye: 'On this screen',
          title: 'Everything I have built',
          node: (
            <>
              <p className="v19-slip-p">{ALL_PROJECTS.length} projects, from a CAVE you stand inside to an interviewer that talks back.</p>
              <button type="button" className="v19-slip-go" onClick={() => onJump && onJump('projects')}>Go and see them</button>
            </>
          ),
        };
      case 'monitorB':
        return {
          eye: 'On this screen',
          title: 'Two papers',
          node: (
            <>
              <p className="v19-slip-p">{PAPERS.map((p) => p.title.split(':')[0]).join(' and ')}. {PAPERS.reduce((n, p) => n + p.citations, 0)} citations between them.</p>
              <button type="button" className="v19-slip-go" onClick={() => onJump && onJump('papers')}>Go and read them</button>
            </>
          ),
        };
      case 'laptop':
        return {
          eye: 'On this screen',
          title: 'Where I have worked',
          node: (
            <>
              <p className="v19-slip-p">{ALFRED.company} now, and {ROLES.map((x) => x.company).join(', ')} before it.</p>
              <button type="button" className="v19-slip-go" onClick={() => onJump && onJump('work')}>Go and see the work</button>
              <p className="v19-slip-links">
                {LINKS.concat(MORE_LINKS).map((l) => (
                  <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">{l.label}</a>
                ))}
              </p>
            </>
          ),
        };
      case 'trophies':
        return {
          eye: 'On the shelf',
          title: 'Won',
          wide: true,
          node: (
            <div className="v19-slip-cards">
              {TROPHIES.map((t) => {
                const project = ALL_PROJECTS.find((p) => p.id === FROM[t.id]);
                return (
                  <div className="v19-slip-card" key={t.id}>
                    <img src={t.image} alt="" />
                    <div>
                      <b>{t.name}</b>
                      <p>{t.what}</p>
                      {project ? (
                        <p className="v19-slip-links">
                          {project.github ? <a href={project.github} target="_blank" rel="noreferrer">GitHub</a> : null}
                          {project.site ? <a href={project.site} target="_blank" rel="noreferrer">Website</a> : null}
                          {project.demo ? <a href={project.demo} target="_blank" rel="noreferrer">{isYouTube(project.demo) ? 'YouTube' : 'Demo'}</a> : null}
                        </p>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          ),
        };
      case 'medals':
        return {
          eye: 'Hanging off the end',
          title: 'Medals',
          node: (
            <>
              <List items={MEDALS.map((m) => ({ k: m.name, v: m.note }))} />
            </>
          ),
        };
      case 'books':
        return {
          eye: 'One shelf',
          title: 'Books',
          wide: true,
          node: (
            <div className="v19-slip-cards is-books">
              {BOOKS.map((b) => (
                <div className="v19-slip-card" key={b.id}>
                  {b.cover ? <img src={b.cover} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} /> : null}
                  <div>
                    <b>{b.title}</b>
                    <i>{b.author} · {b.status}</i>
                    <p>{b.note}</p>
                  </div>
                </div>
              ))}
            </div>
          ),
        };
      case 'games':
        return {
          eye: 'Video games',
          title: 'My favourites',
          wide: true,
          node: (
            <div className="v19-slip-cards is-games">
              {GAMES.map((gm) => (
                <div className="v19-slip-card" key={gm.id}>
                  {gm.cover ? <img src={gm.cover} alt="" onError={(e) => { e.currentTarget.style.display = 'none'; }} /> : null}
                  <div>
                    <b>{gm.title}</b>
                    <i>{gm.by}</i>
                    {gm.note ? <p>{gm.note}</p> : null}
                  </div>
                </div>
              ))}
            </div>
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
  }
  return (
    <aside
      className={`v19-slip${place ? ` is-${place.side}` : ''}${content.wide ? ' is-wide' : ''}`}
      style={place ? { left: place.left, top: place.top, width: place.width, '--py': `${place.pointerY}px` } : undefined}
      data-keep-open=""
      role="dialog"
      aria-label={hotspot.label}
    >
      <span className="v19-slip-pin" aria-hidden="true" />
      <button type="button" className="v19-slip-x" onClick={onClose} aria-label="Close">×</button>
      <p className="v19-slip-eye">{content.eye}</p>
      <h3 className="v19-slip-title">{content.title}</h3>
      <div className="v19-slip-body">{content.node}</div>
    </aside>
  );
}

/* ── the room ───────────────────────────────────────────────────────── */

export default function Room({ sectionRef, onTop, hour = 19, flipped = false, onClock, onJump, onDisco }) {
  const canvasRef = useRef(null);
  const artRef = useRef({ posters: [], books: [] });
  const hoverScreenRef = useRef(null);
  const [hoverScreen, setHoverScreen] = useState(null);
  const cursorRef = useRef(null);
  const gridRef = useRef(null);
  const imgRef = useRef(null);
  const shotsRef = useRef([]);
  const stateRef = useRef({
    ...EVENING,
    windowT: 0,
    grown: false,
    cold: false,
    sparkle: false,
    bounce: 0,
    spin: 0,
    spinAt: null,
    disco: false,
    t: 0,
  });
  const hoverRef = useRef(0);
  const bounceRef = useRef(null);

  const [hover, setHover] = useState(0);
  const [openKey, setOpenKey] = useState(null);
  const [kind, setKind] = useState('');

  /* the hour, from the page: how dark, and whether the lights are on */
  useEffect(() => {
    const st = stateRef.current;
    st.night = nightAt(hour);
    st.hour = hour;
    st.lamp = st.night > 0.15;
    st.string = st.night > 0.15;
  }, [hour]);

  /* the real pictures, if they are there: pixelated onto the wall and the shelf */
  useEffect(() => {
    let alive = true;
    Promise.all(POSTERS.map((p) => (p.image ? load(p.image) : Promise.resolve(null)))).then((imgs) => {
      if (alive) artRef.current.posters = imgs;
    });
    Promise.all(BOOKS.map((b) => (b.cover ? load(b.cover) : Promise.resolve(null)))).then((imgs) => {
      if (alive) artRef.current.books = imgs;
    });
    return () => { alive = false; };
  }, []);

  const hotspot = useMemo(() => HOTSPOTS.find((h) => h.id === hover) || null, [hover]);
  const openHotspot = useMemo(() => HOTSPOTS.find((h) => h.key === openKey) || null, [openKey]);

  useEffect(() => {
    let alive = true;
    Promise.all(ON_SCREEN.map((p) => load(p.image)))
      .then((imgs) => { if (alive) shotsRef.current = imgs.filter(Boolean); })
      .catch(() => {});
    return () => { alive = false; };
  }, []);

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
    let onScreen = true; // the room is the bottom of the page; behind the wall it is not drawn

    // the only way a frame is ever asked for: whatever was pending is dropped first, so a
    // hidden tab never comes back with a queue of them
    const schedule = () => {
      if (raf) window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(loop);
    };

    /* the real posters and covers, downsampled onto the drawn ones */
    const paintArt = () => {
      const st = stateRef.current;
      const tint = st.night > 0.6 ? 'rgba(196,202,222,1)' : st.night > 0.2 ? 'rgba(220,222,230,1)' : 'rgba(244,244,242,1)';
      const blit = (img, x, y, w, h) => {
        if (!img || !img.width) return;
        // a 2,500-pixel poster brought straight down to thirty is noise; come down in steps
        // once, then keep the small one
        if (!img.__small) {
          // contain, never cover: the whole picture, on a dark mount if the shape is off
          const scale = Math.min(w / img.width, h / img.height);
          let cur = img;
          let cw = img.width;
          let ch = img.height;
          let sx = 0;
          let sy = 0;
          while (cw > w * 2.5) {
            const nw = Math.max(w, Math.round(cw / 2));
            const nh = Math.max(h, Math.round(ch / 2));
            const c = document.createElement('canvas');
            c.width = nw;
            c.height = nh;
            const cx = c.getContext('2d');
            cx.imageSmoothingEnabled = true;
            cx.imageSmoothingQuality = 'high';
            cx.drawImage(cur, sx, sy, cw, ch, 0, 0, nw, nh);
            cur = c;
            cw = nw;
            ch = nh;
            sx = 0;
            sy = 0;
          }
          const small = document.createElement('canvas');
          small.width = w;
          small.height = h;
          const scx = small.getContext('2d');
          scx.fillStyle = '#2b2430';
          scx.fillRect(0, 0, w, h);
          scx.imageSmoothingEnabled = true;
          scx.imageSmoothingQuality = 'high';
          const dw = Math.round(img.width * scale);
          const dh = Math.round(img.height * scale);
          scx.drawImage(cur, sx, sy, cw, ch, Math.floor((w - dw) / 2), Math.floor((h - dh) / 2), dw, dh);
          img.__small = small; // eslint-disable-line no-param-reassign
        }
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.clip();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img.__small, x, y);
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = tint;
        ctx.fillRect(x, y, w, h);
        ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
      };
      artRef.current.posters.forEach((img, i) => {
        const hs = HOTSPOTS.find((h) => h.key === `poster${i + 1}`);
        if (hs) blit(img, hs.x, hs.y + ROOF, hs.w, hs.h);
      });
      // the chair is in front of the wall: put its pixels back over any art that landed on it
      const grid = gridRef.current;
      const frame = imgRef.current;
      if (!grid || !frame) return;
      HOTSPOTS.filter((h) => h.key.startsWith('poster')).forEach((hs) => {
        for (let y = hs.y + ROOF; y < hs.y + ROOF + hs.h; y += 1) {
          for (let x = hs.x; x < hs.x + hs.w; x += 1) {
            const k = y * W + x;
            if (grid.ids[k] !== 2) continue;
            const o = k * 4;
            ctx.fillStyle = `rgb(${frame.data[o]},${frame.data[o + 1]},${frame.data[o + 2]})`;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
    };

    const paintScreens = (now) => {
      const st = stateRef.current;
      paintArt();
      if (!st.pc) return;
      const a = { ...SCREENS.monitorA, y: SCREENS.monitorA.y + ROOF };
      const b = { ...SCREENS.monitorB, y: SCREENS.monitorB.y + ROOF };
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
          ctx.globalCompositeOperation = 'multiply';
          ctx.fillStyle = st.mono ? 'rgba(200,200,196,1)' : st.night > 0.6 ? 'rgba(150,164,200,1)' : st.night > 0.2 ? 'rgba(186,196,218,1)' : 'rgba(232,236,240,1)';
          ctx.fillRect(a.x, a.y, a.w, a.h);
          ctx.restore();
          ctx.globalCompositeOperation = 'source-over';
        }
      }
      // the second screen: a paper, two columns
      ctx.fillStyle = st.mono ? '#d6d4ce' : '#e8e6df';
      ctx.fillRect(b.x + 1, b.y + 1, b.w - 2, b.h - 2);
      ctx.fillStyle = '#3b3a38';
      ctx.fillRect(b.x + 3, b.y + 3, b.w - 6, 2);
      ctx.fillRect(b.x + 3, b.y + 6, b.w - 14, 1);
      ctx.fillStyle = '#8a8782';
      for (let i = 0; i < 6; i += 1) {
        ctx.fillRect(b.x + 3, b.y + 9 + i * 2, 12, 1);
        ctx.fillRect(b.x + 18, b.y + 9 + i * 2, 10 + ((i * 3) % 3), 1);
      }
      ctx.fillStyle = st.mono ? '#68676a' : '#2f6a8f';
      ctx.fillRect(b.x + 3, b.y + b.h - 3, 7, 1);

      // the chair is nearer than the screens: put its pixels back over whatever landed on them
      const grid = gridRef.current;
      const frame = imgRef.current;
      if (!grid || !frame) return;
      [a, b].forEach((r) => {
        for (let y = r.y; y < r.y + r.h; y += 1) {
          for (let x = r.x; x < r.x + r.w; x += 1) {
            const i = y * W + x;
            if (grid.ids[i] !== 2) continue;
            const o = i * 4;
            ctx.fillStyle = `rgb(${frame.data[o]},${frame.data[o + 1]},${frame.data[o + 2]})`;
            ctx.fillRect(x, y, 1, 1);
          }
        }
      });
    };

    const paint = (now, dt) => {
      const st = stateRef.current;
      st.t = now;
      // the window opens over half a second rather than flipping
      const target = st.windowOpen ? 1 : 0;
      if (st.windowT !== target) {
        const step = dt / 520;
        st.windowT = target > st.windowT ? Math.min(1, st.windowT + step) : Math.max(0, st.windowT - step);
      }
      // the spin: two turns, easing out, ending where it started
      if (st.spinAt != null) {
        const p = Math.min(1, (now - st.spinAt) / SPIN_MS);
        const e = 1 - (1 - p) ** 3;
        st.spin = e * Math.PI * 4;
        if (p >= 1) {
          st.spin = 0;
          st.spinAt = null;
        }
      }

      // the window open lets the day in
      const night = Math.max(0, st.night - st.windowT * st.night * 0.85);
      const lights = [];
      if (st.lamp) lights.push({ ...LIGHTS.lamp, y: LIGHTS.lamp.y + ROOF, on: true });
      if (st.pc) lights.push({ ...LIGHTS.screens, y: LIGHTS.screens.y + ROOF, on: true });
      if (st.string) LIGHTS.string.forEach((l) => lights.push({ ...l, y: l.y + ROOF, on: true }));
      // the disco: four colours sweeping round the room off the mirror ball
      if (st.disco) {
        const a = now / 1100;
        DISCO.forEach((tint, i) => {
          const ang = a + (i * Math.PI) / 2;
          lights.push({ x: 144 + Math.cos(ang) * 96, y: ROOF + 66 + Math.sin(ang * 1.7 + i) * 34, r: 72, on: true, tint, strength: 0.85 });
        });
      }

      drawScene(gridRef.current, st);
      rasterize(gridRef.current, imgRef.current, { night, lights, hover: hoverRef.current, mono: st.mono });
      ctx.putImageData(imgRef.current, 0, 0);
      paintScreens(now);
    };

    function loop(now) {
      if (!alive) return;
      if (!onScreen || document.hidden) return; // it is picked up again when it is seen
      lastFrame = now;
      if (now - lastDraw >= FRAME_MS) {
        const dt = lastDraw ? now - lastDraw : FRAME_MS;
        lastDraw = now;
        try {
          paint(now, dt);
        } catch (err) {
          // one bad frame must not take the room down
        }
      }
      schedule();
    }

    paint(performance.now(), FRAME_MS);
    schedule();
    const watchdog = window.setInterval(() => {
      if (!alive || !onScreen || document.hidden) return;
      const now = performance.now();
      if (now - lastFrame > 400) {
        lastDraw = 0;
        loop(now);
      }
    }, 300);

    const wake = () => {
      if (!alive || !onScreen || document.hidden) return;
      lastDraw = 0;
      lastFrame = performance.now();
      schedule();
    };
    document.addEventListener('visibilitychange', wake);
    let io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver((entries) => {
        onScreen = entries.some((e) => e.isIntersecting);
        if (onScreen) wake();
      }, { rootMargin: '120px 0px' });
      io.observe(cv);
    }
    // after a GPU reset the small copies of the posters are blank canvases: made again
    const onRestored = () => {
      (artRef.current.posters || []).forEach((img) => { if (img) delete img.__small; }); // eslint-disable-line no-param-reassign
      wake();
    };
    cv.addEventListener('contextrestored', onRestored);

    return () => {
      alive = false;
      window.cancelAnimationFrame(raf);
      window.clearInterval(watchdog);
      document.removeEventListener('visibilitychange', wake);
      cv.removeEventListener('contextrestored', onRestored);
      if (io) io.disconnect();
      if (bounceRef.current) window.clearInterval(bounceRef.current);
    };
  }, []);

  /* pointer → room coordinates, accounting for the canvas covering the viewport */
  const at = useCallback((e) => {
    const cv = canvasRef.current;
    if (!cv) return null;
    const r = cv.getBoundingClientRect();
    if (!r.width || !r.height) return null;
    const scale = Math.max(r.width / W, r.height / H);
    const drawnW = W * scale;
    const drawnH = H * scale;
    const offX = (r.width - drawnW) / 2;
    const offY = r.height - drawnH; // anchored to the bottom, so the floor is always there
    const x = (e.clientX - r.left - offX) / scale;
    const gy = (e.clientY - r.top - offY) / scale;
    if (x < 0 || gy < 0 || x >= W || gy >= H) return null;
    const y = gy - ROOF; // hotspots are in room coordinates; the roof sits above them
    const hit = HOTSPOTS.find((h) => x >= h.x && x < h.x + h.w && y >= h.y && y < h.y + h.h) || null;
    if (hit) {
      // where the object sits on screen, relative to the stage — the slip is placed beside it
      hit.screen = {
        left: offX + hit.x * scale,
        top: offY + (hit.y + ROOF) * scale,
        width: hit.w * scale,
        height: hit.h * scale,
        stageW: r.width,
        stageH: r.height,
      };
    }
    return hit;
  }, []);

  const onMove = useCallback(
    (e) => {
      const h = at(e);
      const id = h ? h.id : 0;
      if (id !== hoverRef.current) {
        hoverRef.current = id;
        setHover(id);
        setKind(h ? h.kind : '');
        stateRef.current.sparkle = h ? h.key === 'trophies' || h.key === 'medals' : false;
        const art = h && h.key.startsWith('poster') ? { key: h.key, ...h.screen } : null;
        hoverScreenRef.current = art;
        setHoverScreen(art);
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
    setHoverScreen(null);
    stateRef.current.sparkle = false;
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
          case 'chair':
            if (st.spinAt == null) st.spinAt = performance.now();
            break;
          case 'lamp': st.lamp = !st.lamp; break;
          case 'lights': st.string = !st.string; break;
          case 'pc': st.pc = !st.pc; break;
          case 'window': st.windowOpen = !st.windowOpen; break;
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
          case 'mug': st.cold = !st.cold; break;
          case 'clock': if (onClock) onClock(); break;
          case 'disco':
            st.disco = !st.disco;
            if (onDisco) onDisco(st.disco);
            break;
          default: break;
        }
        return;
      }
      setOpenKey((cur) => (cur === h.key ? null : h.key));
    },
    [at, onClock, onDisco]
  );

  useEffect(() => {
    if (!openKey) return undefined;
    const away = (e) => {
      if (e.target && e.target.closest && e.target.closest('[data-keep-open], .v19-room-canvas')) return;
      setOpenKey(null);
    };
    const key = (e) => { if (e.key === 'Escape') setOpenKey(null); };
    window.addEventListener('pointerdown', away);
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('pointerdown', away);
      window.removeEventListener('keydown', key);
    };
  }, [openKey]);

  const caption = (() => {
    if (!hotspot) return '';
    if (hotspot.key.startsWith('poster')) {
      const p = POSTERS[Number(hotspot.key.slice(-1)) - 1];
      return `${p.title} — ${p.note}`;
    }
    if (hotspot.key === 'books') return BOOKS.map((b) => b.title).join(' · ');
    if (hotspot.key === 'chair') return 'The chair';
    if (hotspot.key === 'disco') return stateRef.current.disco ? 'Enough' : 'Press it';
    if (hotspot.key === 'pc') return stateRef.current.pc ? 'The tower — switch it off and see' : 'The tower';
    if (hotspot.key === 'clock') return flipped ? 'The clock — put the day back' : 'The clock — flip the day';
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
        <Slip hotspot={openHotspot} onClose={() => setOpenKey(null)} onJump={(id) => { setOpenKey(null); if (onJump) onJump(id); }} />

        {/* the real picture, over the pixelated one, while you point at it */}
        {hoverScreen && hoverScreen.key.startsWith('poster') && POSTERS[Number(hoverScreen.key.slice(-1)) - 1].image ? (
          <img
            className="v19-room-art"
            src={POSTERS[Number(hoverScreen.key.slice(-1)) - 1].image}
            alt=""
            style={{ left: hoverScreen.left, top: hoverScreen.top, width: hoverScreen.width, height: hoverScreen.height }}
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        ) : null}

        {/* the way back up, standing on the rug */}
        <button type="button" className="v19-top" onClick={onTop} data-keep-open="">
          <span aria-hidden="true">↑</span>
          Back to the top
        </button>
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
