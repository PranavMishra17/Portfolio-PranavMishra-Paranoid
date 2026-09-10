// Variant 5 — the room as the page's footer. A pixel-art canvas with transparent window panes, so the
// sky that runs behind the whole page is the sky in the window. Hover names things, click opens
// them, the lamp switches, the screens scroll, the tea steams, and now and then a bird goes past.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { W, H, createGrid, painter, rasterize } from './pixel/engine';
import { drawRoom, HOTSPOTS, LAMP } from './pixel/scene';
import Panel from './Panel';
import { ABOUT_LONG, ALFRED, ALFRED_ROLE, BEFORE, FEATURED, LINKS, PAPERS, TROPHIES } from './copy';
import { BOOKS, FILMS, GAMES, MAGNETS, FAMILY_PHOTO, FOOTBALL, SAMPLE_NOTE } from './personal';

const TITLES = {
  lamp: 'The lamp',
  me: 'About me',
  photo: 'A family photo',
  mug: 'Tea',
  laptop: 'About me',
  monitorA: 'Where I have worked',
  monitorB: 'Three papers',
  poster1: 'A poster',
  poster2: 'A poster',
  poster3: 'A poster',
  trophies: 'Two trophies',
  books: 'Books',
  games: 'Games',
  books2: 'Books',
  fridge: 'Fridge magnets',
  plant: 'The plant',
  ball: 'Football',
  window: 'The window',
};

// on phones the room stays, but only the personal things are listed as buttons under it
const PERSONAL = ['window', 'poster1', 'poster2', 'poster3', 'trophies', 'books', 'games', 'fridge', 'photo', 'ball', 'plant', 'mug', 'lamp'];

function Sample() {
  return <p className="v5-sample">{SAMPLE_NOTE}</p>;
}

export function WorkHistory() {
  return (
    <ul className="v5-plist">
      <li>
        <h3 className="v5-plist-t">
          Alfred_ <span className="v5-plist-when">{ALFRED_ROLE.duration.replace('Present', 'now')}</span>
        </h3>
        <p className="v5-plist-sub">
          {ALFRED_ROLE.title}, {ALFRED_ROLE.location}
        </p>
        <p className="v5-plist-line">{ALFRED.lead}</p>
        <ul className="v5-bullets">
          {ALFRED.more.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </li>
      {BEFORE.map((r) => (
        <li key={r.id}>
          <h3 className="v5-plist-t">
            {r.company} <span className="v5-plist-when">{r.when}</span>
          </h3>
          <p className="v5-plist-sub">{r.title}</p>
          <p className="v5-plist-line">{r.line}</p>
        </li>
      ))}
    </ul>
  );
}

export function PaperList() {
  return (
    <ul className="v5-plist">
      {PAPERS.map((p) => (
        <li key={p.id}>
          <h3 className="v5-plist-t">{p.short}</h3>
          <p className="v5-plist-sub">
            <span className={`v5-status${p.accepted ? ' acc' : ''}`}>{p.status}</span>, {p.venue}
            {p.citations ? `, ${p.citations} citations` : ''}
          </p>
          <p className="v5-plist-line">{p.line}</p>
          <p className="v5-links">
            {p.pdf ? (
              <a className="v5-link" href={p.pdf} target="_blank" rel="noopener noreferrer">
                Paper
              </a>
            ) : null}
            {p.code ? (
              <a className="v5-link" href={p.code} target="_blank" rel="noopener noreferrer">
                Code
              </a>
            ) : null}
          </p>
        </li>
      ))}
    </ul>
  );
}

function Content({ k, onSeeAll, lampOn, toggleLamp }) {
  switch (k) {
    case 'window':
      return (
        <>
          <p className="v5-p">That is not a picture. The panes are transparent, so what you see through them is the sky that has been behind this whole page, wherever you have scrolled it to. Scroll back up and it is morning in the window again.</p>
          <p className="v5-links">
            <button type="button" className="v5-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              Back to the morning
            </button>
          </p>
        </>
      );
    case 'lamp':
      return (
        <>
          <p className="v5-p">It comes on by itself when the sky goes down. You can also just switch it.</p>
          <p className="v5-links">
            <button type="button" className="v5-link" onClick={toggleLamp}>
              {lampOn ? 'Switch it off' : 'Switch it on'}
            </button>
          </p>
        </>
      );
    case 'me':
    case 'laptop':
      return (
        <>
          {ABOUT_LONG.map((l) => (
            <p className="v5-p" key={l}>
              {l}
            </p>
          ))}
          <p className="v5-links">
            {LINKS.map((l) => (
              <a className="v5-link" key={l.label} href={l.href} target={l.href.startsWith('/') || l.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer">
                {l.label}
              </a>
            ))}
          </p>
        </>
      );
    case 'monitorA':
      return <WorkHistory />;
    case 'monitorB':
      return <PaperList />;
    case 'poster1':
    case 'poster2':
    case 'poster3': {
      const f = FILMS[Number(k.slice(-1)) - 1];
      return (
        <>
          <Sample />
          <h3 className="v5-plist-t">{f.title}</h3>
          <p className="v5-p">{f.why}</p>
        </>
      );
    }
    case 'trophies':
      return (
        <ul className="v5-plist">
          {TROPHIES.map((t) => (
            <li key={t.id}>
              <div className="v5-card-img">
                <img src={t.image} alt="" loading="lazy" />
              </div>
              <h3 className="v5-plist-t">{t.title}</h3>
              <p className="v5-plist-line">{t.line}</p>
            </li>
          ))}
        </ul>
      );
    case 'books':
    case 'books2':
      return (
        <>
          <Sample />
          <ul className="v5-plist">
            {BOOKS.map((b) => (
              <li key={b.title}>
                <h3 className="v5-plist-t">{b.title}</h3>
                <p className="v5-plist-sub">
                  {b.author}. {b.state}.
                </p>
              </li>
            ))}
          </ul>
        </>
      );
    case 'games':
      return (
        <>
          <Sample />
          <ul className="v5-plist">
            {GAMES.map((g) => (
              <li key={g.title}>
                <h3 className="v5-plist-t">{g.title}</h3>
                <p className="v5-plist-sub">{g.note}</p>
              </li>
            ))}
          </ul>
        </>
      );
    case 'fridge':
      return (
        <>
          <Sample />
          <ul className="v5-plist">
            {MAGNETS.map((m) => (
              <li key={m.place}>
                <h3 className="v5-plist-t">{m.place}</h3>
                <p className="v5-plist-sub">{m.memory}</p>
              </li>
            ))}
          </ul>
        </>
      );
    case 'photo':
      return (
        <>
          <Sample />
          <p className="v5-p">{FAMILY_PHOTO.caption}</p>
        </>
      );
    case 'ball':
      return (
        <>
          <p className="v5-p">{FOOTBALL.line}</p>
          <Sample />
          <p className="v5-p">{FOOTBALL.extra}</p>
        </>
      );
    case 'plant':
      return (
        <>
          <Sample />
          <p className="v5-p">It does not have a name yet. That is the kind of thing that goes here.</p>
        </>
      );
    case 'mug':
      return <p className="v5-p">There is always a mug on the desk. What is in it is a detail for later.</p>;
    case 'projects':
      return (
        <>
          <ul className="v5-plist">
            {FEATURED.map((p) => (
              <li key={p.id}>
                <div className={`v5-card-img${p.square ? ' sq' : ''}`}>
                  <img src={p.image} alt="" loading="lazy" />
                </div>
                <h3 className="v5-plist-t">{p.title}</h3>
                <p className="v5-plist-line">{p.line}</p>
              </li>
            ))}
          </ul>
          <p className="v5-links">
            <button type="button" className="v5-link" onClick={onSeeAll}>
              See everything
            </button>
          </p>
        </>
      );
    default:
      return null;
  }
}

export default function Room({ t, onSeeAll }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const grid = useMemo(() => createGrid(), []);
  const g = useMemo(() => painter(grid), [grid]);
  const off = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    return c;
  }, []);
  const img = useMemo(() => off.getContext('2d').createImageData(W, H), [off]);

  const [hover, setHover] = useState(null); // hotspot object
  const [open, setOpen] = useState(null); // key
  const [lampOverride, setLampOverride] = useState(null);
  const frame = useRef(0);
  const bird = useRef(null);
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  const night = Math.max(0, Math.min(1, (t - 0.7) / 0.28));
  const lampOn = lampOverride === null ? night > 0.45 : lampOverride;

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawRoom(g, { frame: frame.current, lampOn, bird: bird.current });
    rasterize(grid, img, { night, lamp: { ...LAMP, on: lampOn }, hover: hover ? hover.id : 0 });
    off.getContext('2d').putImageData(img, 0, 0);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(off, 0, 0, W, H, 0, 0, canvas.width, canvas.height);
  }, [g, grid, img, off, night, lampOn, hover]);

  // size the canvas to its box in whole pixels per grid cell where possible
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return undefined;
    const fit = () => {
      const w = wrap.clientWidth;
      const scale = Math.max(1, Math.floor(w / W));
      const cw = Math.min(w, scale * W);
      canvas.width = cw;
      canvas.height = Math.round((cw * H) / W);
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${canvas.height}px`;
      render();
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [render]);

  useEffect(() => {
    render();
  }, [render]);

  // the small animations: steam, typing, scrolling code, an occasional bird
  useEffect(() => {
    if (reduce) return undefined;
    let last = 0;
    let raf = 0;
    const tick = (now) => {
      raf = window.requestAnimationFrame(tick);
      if (now - last < 170) return;
      last = now;
      frame.current += 1;
      if (bird.current) {
        bird.current.x += 2;
        bird.current.f += 1;
        if (bird.current.x > 184) bird.current = null;
      } else if (Math.random() < 0.012) {
        bird.current = { x: 139, y: 16 + Math.floor(Math.random() * 14), f: 0 };
      }
      render();
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [render, reduce]);

  const hit = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const r = canvas.getBoundingClientRect();
    const gx = ((e.clientX - r.left) / r.width) * W;
    const gy = ((e.clientY - r.top) / r.height) * H;
    return HOTSPOTS.find((h) => gx >= h.x && gx < h.x + h.w && gy >= h.y && gy < h.y + h.h) || null;
  };
  const onMove = (e) => {
    const h = hit(e);
    if ((h && h.id) !== (hover && hover.id)) setHover(h);
  };
  const onClick = (e) => {
    const h = hit(e);
    if (!h) return;
    if (h.key === 'lamp') {
      setLampOverride(!lampOn);
      return;
    }
    setOpen(h.key);
  };
  const toggleLamp = useCallback(() => setLampOverride((v) => (v === null ? !(night > 0.45) : !v)), [night]);
  const close = useCallback(() => setOpen(null), []);

  return (
    <footer className="v5-room" id="room">
      <div className="v5-room-head">
        <h2 className="v5-h2">My room</h2>
        <p className="v5-p v5-soft">How it was in my bachelor days. Everything in it opens something. The window is not a picture.</p>
      </div>
      <div className="v5-stage" ref={wrapRef}>
        <canvas
          ref={canvasRef}
          className={`v5-pixels${hover ? ' hot' : ''}`}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          onClick={onClick}
          aria-label="A pixel-art drawing of my room. Use the list below to open each thing."
          role="img"
        />
      </div>
      <p className="v5-caption" aria-live="polite">
        {hover ? hover.label : 'Hover over anything. Click to open it.'}
      </p>

      <ul className="v5-room-list" aria-label="Everything in the room">
        {HOTSPOTS.filter((h) => PERSONAL.includes(h.key)).map((h) => (
          <li key={h.key} className={PERSONAL.includes(h.key) ? 'personal' : ''}>
            <button
              type="button"
              className="v5-room-item"
              onClick={() => (h.key === 'lamp' ? setLampOverride(!lampOn) : setOpen(h.key))}
              onFocus={() => setHover(h)}
              onBlur={() => setHover(null)}
            >
              {h.label}
            </button>
          </li>
        ))}
      </ul>

      <div className="v5-colophon">
        <p>Pranav Pushkar Mishra. Metuchen, New Jersey. The books, posters, games and magnets are samples until I write my own.</p>
      </div>

      <Panel open={Boolean(open)} title={open ? TITLES[open] || '' : ''} onClose={close}>
        {open ? <Content k={open} onSeeAll={onSeeAll} lampOn={lampOn} toggleLamp={toggleLamp} /> : null}
      </Panel>
    </footer>
  );
}
