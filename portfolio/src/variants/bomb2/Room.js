// Bomb — the room, behind the last wall. Same pixel engine and scene as v5, filling the screen.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { W, H, createGrid, painter, rasterize } from './pixel/engine';
import { drawRoom, HOTSPOTS, LAMP } from './pixel/scene';
import Panel from './Panel';
import { ABOUT_LONG, ALFRED, ALFRED_ROLE, BEFORE, LINKS, PAPERS, TROPHIES } from './copy';
import { BOOKS, FILMS, GAMES, MAGNETS, FAMILY_PHOTO, FOOTBALL } from './personal';

const TITLES = {
  me: 'About me', photo: 'A family photo', laptop: 'About me', monitorA: 'Where I have worked', monitorB: 'Three papers',
  poster1: 'A poster', poster2: 'A poster', poster3: 'A poster', trophies: 'Two trophies', books: 'Books', games: 'Games',
  books2: 'Books', fridge: 'Fridge magnets', ball: 'Football',
};

function Sample() {
  return <p className="bomb2-sample">Sample titles.</p>;
}

function Content({ k }) {
  switch (k) {
    case 'me':
    case 'laptop':
      return (
        <>
          {ABOUT_LONG.map((l) => (
            <p className="bomb2-p" key={l}>
              {l}
            </p>
          ))}
          <p className="bomb2-links">
            {LINKS.map((l) => (
              <a className="bomb2-link" key={l.label} href={l.href} target={l.href.startsWith('/') || l.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer">
                {l.label}
              </a>
            ))}
          </p>
        </>
      );
    case 'monitorA':
      return (
        <ul className="bomb2-plist">
          <li>
            <h3 className="bomb2-plist-t">
              Alfred_ <span className="bomb2-plist-when">{ALFRED_ROLE.duration.replace('Present', 'now')}</span>
            </h3>
            <p className="bomb2-plist-sub">
              {ALFRED_ROLE.title}, {ALFRED_ROLE.location}
            </p>
            <p className="bomb2-plist-line">{ALFRED.lead}</p>
            <ul className="bomb2-bullets">
              {ALFRED.more.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </li>
          {BEFORE.map((r) => (
            <li key={r.id}>
              <h3 className="bomb2-plist-t">
                {r.company} <span className="bomb2-plist-when">{r.when}</span>
              </h3>
              <p className="bomb2-plist-sub">{r.title}</p>
              <p className="bomb2-plist-line">{r.line}</p>
            </li>
          ))}
        </ul>
      );
    case 'monitorB':
      return (
        <ul className="bomb2-plist">
          {PAPERS.map((p) => (
            <li key={p.id}>
              <h3 className="bomb2-plist-t">{p.short}</h3>
              <p className="bomb2-plist-sub">
                {p.status}, {p.venue}
                {p.citations ? `, ${p.citations} citations` : ''}
              </p>
              <p className="bomb2-plist-line">{p.line}</p>
              <p className="bomb2-links">
                {p.pdf ? (
                  <a className="bomb2-link" href={p.pdf} target="_blank" rel="noopener noreferrer">
                    Paper
                  </a>
                ) : null}
                {p.code ? (
                  <a className="bomb2-link" href={p.code} target="_blank" rel="noopener noreferrer">
                    Code
                  </a>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      );
    case 'poster1':
    case 'poster2':
    case 'poster3': {
      const f = FILMS[Number(k.slice(-1)) - 1];
      return (
        <>
          <h3 className="bomb2-plist-t">{f.title}</h3>
          <p className="bomb2-p">{f.why}</p>
          <Sample />
        </>
      );
    }
    case 'trophies':
      return (
        <ul className="bomb2-plist">
          {TROPHIES.map((t) => (
            <li key={t.id}>
              <div className="bomb2-print">
                <img src={t.image} alt="" loading="lazy" />
              </div>
              <h3 className="bomb2-plist-t">{t.title}</h3>
              <p className="bomb2-plist-line">{t.line}</p>
            </li>
          ))}
        </ul>
      );
    case 'books':
    case 'books2':
      return (
        <>
          <ul className="bomb2-plist">
            {BOOKS.map((b) => (
              <li key={b.title}>
                <h3 className="bomb2-plist-t">{b.title}</h3>
                <p className="bomb2-plist-sub">
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
          <ul className="bomb2-plist">
            {GAMES.map((g) => (
              <li key={g.title}>
                <h3 className="bomb2-plist-t">{g.title}</h3>
                <p className="bomb2-plist-sub">{g.note}</p>
              </li>
            ))}
          </ul>
          <Sample />
        </>
      );
    case 'fridge':
      return (
        <>
          <ul className="bomb2-plist">
            {MAGNETS.map((mg) => (
              <li key={mg.place}>
                <h3 className="bomb2-plist-t">{mg.place}</h3>
                <p className="bomb2-plist-sub">{mg.memory}</p>
              </li>
            ))}
          </ul>
          <Sample />
        </>
      );
    case 'photo':
      return (
        <>
          <p className="bomb2-p">{FAMILY_PHOTO.caption}</p>
          <Sample />
        </>
      );
    case 'ball':
      return (
        <>
          <p className="bomb2-p">{FOOTBALL.line}</p>
          <p className="bomb2-p bomb2-soft">{FOOTBALL.extra}</p>
        </>
      );
    default:
      return null;
  }
}

const TOGGLES = new Set(['lamp', 'window', 'mug', 'plant', 'pc']);

export default function Room({ active, onCursor }) {
  const canvasRef = useRef(null);
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
  const [lampOn, setLampOn] = useState(true);
  const [st, setSt] = useState({ curtains: false, fridgeOpen: false, pcOn: true, plant: 0, mugHot: true });
  const fx = useRef({ wave: 0, bounce: 0, sparkle: 0 });
  const frame = useRef(0);
  const bird = useRef(null);
  const reduce = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const night = 0.62;

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
  }, [g, grid, img, off, lampOn, hover, st]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const fit = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // fit inside the screen: the bars above and below are where the controls live
      let cw = vw;
      let ch = Math.round((vw * H) / W);
      if (ch > vh - 120) {
        ch = vh - 120;
        cw = Math.round((ch * W) / H);
      }
      canvas.width = cw;
      canvas.height = ch;
      canvas.style.width = `${cw}px`;
      canvas.style.height = `${ch}px`;
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
    if (reduce || !active) return undefined;
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
  }, [render, reduce, active]);

  const hit = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const r = canvas.getBoundingClientRect();
    const gx = ((e.clientX - r.left) / r.width) * W;
    const gy = ((e.clientY - r.top) / r.height) * H;
    return HOTSPOTS.find((h) => gx >= h.x && gx < h.x + h.w && gy >= h.y && gy < h.y + h.h) || null;
  };

  const act = useCallback((key) => {
    switch (key) {
      case 'lamp':
        setLampOn((v) => !v);
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
  }, []);

  const onMove = (e) => {
    const h = hit(e);
    // tell the page what the cursor should be, synchronously, before the window hears the same event
    const kind = !h ? '' : TOGGLES.has(h.key) ? 'hand' : 'zoom';
    if (canvasRef.current) canvasRef.current.dataset.roomCursor = kind;
    if (onCursor) onCursor(kind);
    if ((h && h.id) !== (hover && hover.id)) setHover(h);
  };
  const onClick = (e) => {
    const h = hit(e);
    if (h) act(h.key);
  };
  const close = useCallback(() => setOpen(null), []);

  return (
    <div className={`bomb22-room${active ? ' live' : ''}`}>
      <canvas ref={canvasRef} className={`bomb22-pixels${hover ? ' hot' : ''}`} onPointerMove={onMove} onMouseLeave={() => { setHover(null); if (onCursor) onCursor(''); }} onClick={onClick} aria-label="A pixel-art drawing of my room" role="img" />
      <p className="bomb2-caption" aria-live="polite">
        {hover ? hover.label : ''}
      </p>
      <Panel open={Boolean(open)} title={open ? TITLES[open] || '' : ''} onClose={close}>
        {open ? <Content k={open} /> : null}
      </Panel>
    </div>
  );
}
