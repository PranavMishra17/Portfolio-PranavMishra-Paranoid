// Variant 6 — the room as the page's footer. A pixel-art canvas with transparent window panes, so the
// sky that runs behind the whole page is the sky in the window. Hover names things. Click does
// something to most of them, and opens the rest.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { W, H, createGrid, painter, rasterize } from './pixel/engine';
import { drawRoom, HOTSPOTS, LAMP } from './pixel/scene';
import Panel from './Panel';
import { ABOUT_LONG, ALFRED, ALFRED_ROLE, BEFORE, FEATURED, LINKS, PAPERS, TROPHIES } from './copy';
import { BOOKS, FILMS, GAMES, MAGNETS, FAMILY_PHOTO, FOOTBALL } from './personal';

const TITLES = {
  me: 'About me',
  photo: 'A family photo',
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
  ball: 'Football',
};

// on phones the drawing stays, and these get buttons under it
const PERSONAL = ['window', 'lamp', 'poster1', 'poster2', 'poster3', 'trophies', 'books', 'games', 'fridge', 'photo', 'ball', 'plant', 'mug', 'pc'];

function Sample() {
  return <p className="v6-sample">Sample titles.</p>;
}

export function WorkHistory() {
  return (
    <ul className="v6-plist">
      <li>
        <h3 className="v6-plist-t">
          Alfred_ <span className="v6-plist-when">{ALFRED_ROLE.duration.replace('Present', 'now')}</span>
        </h3>
        <p className="v6-plist-sub">
          {ALFRED_ROLE.title}, {ALFRED_ROLE.location}
        </p>
        <p className="v6-plist-line">{ALFRED.lead}</p>
        <ul className="v6-bullets">
          {ALFRED.more.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </li>
      {BEFORE.map((r) => (
        <li key={r.id}>
          <h3 className="v6-plist-t">
            {r.company} <span className="v6-plist-when">{r.when}</span>
          </h3>
          <p className="v6-plist-sub">{r.title}</p>
          <p className="v6-plist-line">{r.line}</p>
        </li>
      ))}
    </ul>
  );
}

export function PaperList() {
  return (
    <ul className="v6-plist">
      {PAPERS.map((p) => (
        <li key={p.id}>
          <h3 className="v6-plist-t">{p.short}</h3>
          <p className="v6-plist-sub">
            <span className={`v6-status${p.accepted ? ' acc' : ''}`}>{p.status}</span>, {p.venue}
            {p.citations ? `, ${p.citations} citations` : ''}
          </p>
          <p className="v6-plist-line">{p.line}</p>
          <p className="v6-links">
            {p.pdf ? (
              <a className="v6-link" href={p.pdf} target="_blank" rel="noopener noreferrer">
                Paper
              </a>
            ) : null}
            {p.code ? (
              <a className="v6-link" href={p.code} target="_blank" rel="noopener noreferrer">
                Code
              </a>
            ) : null}
          </p>
        </li>
      ))}
    </ul>
  );
}

function Content({ k, onSeeAll }) {
  switch (k) {
    case 'me':
    case 'laptop':
      return (
        <>
          {ABOUT_LONG.map((l) => (
            <p className="v6-p" key={l}>
              {l}
            </p>
          ))}
          <p className="v6-links">
            {LINKS.map((l) => (
              <a className="v6-link" key={l.label} href={l.href} target={l.href.startsWith('/') || l.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer">
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
          <h3 className="v6-plist-t">{f.title}</h3>
          <p className="v6-p">{f.why}</p>
          <Sample />
        </>
      );
    }
    case 'trophies':
      return (
        <ul className="v6-plist">
          {TROPHIES.map((t) => (
            <li key={t.id}>
              <div className="v6-print">
                <img src={t.image} alt="" loading="lazy" />
              </div>
              <h3 className="v6-plist-t">{t.title}</h3>
              <p className="v6-plist-line">{t.line}</p>
            </li>
          ))}
        </ul>
      );
    case 'books':
    case 'books2':
      return (
        <>
          <ul className="v6-plist">
            {BOOKS.map((b) => (
              <li key={b.title}>
                <h3 className="v6-plist-t">{b.title}</h3>
                <p className="v6-plist-sub">
                  {b.author}. {b.state}.
                </p>
              </li>
            ))}
          </ul>
          <Sample />
        </>
      );
    case 'games':
      return (
        <>
          <ul className="v6-plist">
            {GAMES.map((g) => (
              <li key={g.title}>
                <h3 className="v6-plist-t">{g.title}</h3>
                <p className="v6-plist-sub">{g.note}</p>
              </li>
            ))}
          </ul>
          <Sample />
        </>
      );
    case 'fridge':
      return (
        <>
          <ul className="v6-plist">
            {MAGNETS.map((m) => (
              <li key={m.place}>
                <h3 className="v6-plist-t">{m.place}</h3>
                <p className="v6-plist-sub">{m.memory}</p>
              </li>
            ))}
          </ul>
          <Sample />
        </>
      );
    case 'photo':
      return (
        <>
          <p className="v6-p">{FAMILY_PHOTO.caption}</p>
          <Sample />
        </>
      );
    case 'ball':
      return (
        <>
          <p className="v6-p">{FOOTBALL.line}</p>
          <p className="v6-p v6-soft">{FOOTBALL.extra}</p>
        </>
      );
    case 'projects':
      return (
        <>
          <ul className="v6-plist">
            {FEATURED.map((p) => (
              <li key={p.id}>
                <div className={`v6-print${p.square ? ' sq' : ''}`}>
                  <img src={p.image} alt="" loading="lazy" />
                </div>
                <h3 className="v6-plist-t">{p.title}</h3>
                <p className="v6-plist-line">{p.line}</p>
              </li>
            ))}
          </ul>
          <p className="v6-links">
            <button type="button" className="v6-link" onClick={onSeeAll}>
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

  const [hover, setHover] = useState(null);
  const [open, setOpen] = useState(null);
  const [lampOverride, setLampOverride] = useState(null);
  const [st, setSt] = useState({ curtains: false, fridgeOpen: false, pcOn: true, plant: 0, mugHot: true });
  const fx = useRef({ wave: 0, bounce: 0, sparkle: 0 }); // short animations, counted down by the loop
  const frame = useRef(0);
  const bird = useRef(null);
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);

  const night = Math.max(0, Math.min(1, (t - 0.7) / 0.28));
  const lampOn = lampOverride === null ? night > 0.45 : lampOverride;

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawRoom(g, { frame: frame.current, lampOn, bird: bird.current, st: { ...st, ...fx.current } });
    rasterize(grid, img, { night, lamp: { ...LAMP, on: lampOn }, hover: hover ? hover.id : 0 });
    off.getContext('2d').putImageData(img, 0, 0);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(off, 0, 0, W, H, 0, 0, canvas.width, canvas.height);
  }, [g, grid, img, off, night, lampOn, hover, st]);

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

  useEffect(() => {
    if (reduce) return undefined;
    let last = 0;
    let raf = 0;
    const tick = (now) => {
      raf = window.requestAnimationFrame(tick);
      if (now - last < 170) return;
      last = now;
      frame.current += 1;
      const f = fx.current;
      if (f.wave > 0) f.wave -= 1;
      if (f.bounce > 0) f.bounce -= 1;
      if (f.sparkle > 0) f.sparkle -= 1;
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

  const act = useCallback(
    (key) => {
      switch (key) {
        case 'lamp':
          setLampOverride(!lampOn);
          return;
        case 'window':
          setSt((s) => ({ ...s, curtains: !s.curtains }));
          return;
        case 'mug':
          setSt((s) => ({ ...s, mugHot: !s.mugHot }));
          return;
        case 'plant':
          setSt((s) => ({ ...s, plant: (s.plant + 1) % 3 }));
          return;
        case 'pc':
          setSt((s) => ({ ...s, pcOn: !s.pcOn }));
          return;
        case 'fridge':
          setSt((s) => ({ ...s, fridgeOpen: !s.fridgeOpen }));
          setOpen('fridge');
          return;
        case 'me':
          fx.current.wave = 8;
          setOpen('me');
          return;
        case 'trophies':
          fx.current.sparkle = 12;
          setOpen('trophies');
          return;
        case 'ball':
          fx.current.bounce = 8;
          setOpen('ball');
          return;
        default:
          setOpen(key);
      }
    },
    [lampOn],
  );

  const onMove = (e) => {
    const h = hit(e);
    if ((h && h.id) !== (hover && hover.id)) setHover(h);
  };
  const onClick = (e) => {
    const h = hit(e);
    if (h) act(h.key);
  };
  const close = useCallback(() => setOpen(null), []);

  return (
    <footer className="v6-room" id="room">
      <div className="v6-stage" ref={wrapRef}>
        <canvas
          ref={canvasRef}
          className={`v6-pixels${hover ? ' hot' : ''}`}
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          onClick={onClick}
          aria-label="A pixel-art drawing of my room"
          role="img"
        />
      </div>
      <p className="v6-caption" aria-live="polite">
        {hover ? hover.label : ''}
      </p>

      <ul className="v6-room-list" aria-label="Everything in the room">
        {HOTSPOTS.filter((h) => PERSONAL.includes(h.key)).map((h) => (
          <li key={h.key}>
            <button type="button" className="v6-room-item" onClick={() => act(h.key)} onFocus={() => setHover(h)} onBlur={() => setHover(null)}>
              {h.label}
            </button>
          </li>
        ))}
      </ul>

      <Panel open={Boolean(open)} title={open ? TITLES[open] || '' : ''} onClose={close}>
        {open ? <Content k={open} onSeeAll={onSeeAll} /> : null}
      </Panel>
    </footer>
  );
}
