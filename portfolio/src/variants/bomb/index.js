// Bomb — "Bring the wall down."
//
// The whole portfolio is four brick walls, one behind the other, with the pixel room behind the last.
// The cursor is a bomb. Hold anywhere for a moment and the fuse burns down; when it goes off the
// bricks nearest the blast fly, the rest of the wall loses its footing and comes down in a spreading
// collapse, and the pile settles and clears to show the next wall. A checkpoint button puts the last
// wall back, brick by brick.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Wall from './wall';
import { PAINTERS } from './murals';
import Room from './Room';
import { INTRO, FEATURED } from './copy';
import './bomb.css';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Commissioner:wght@400..700&display=swap';
const FUSE_MS = 1150;
const NAMES = ['Hey', 'What I do', 'Things I made', 'Three papers', 'My room'];

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

async function loadAssets() {
  const [photo, ...rest] = await Promise.all([loadImage(INTRO.photo), ...FEATURED.map((p) => loadImage(p.image))]);
  const images = { photo };
  FEATURED.forEach((p, i) => {
    images[p.id] = rest[i];
  });
  return images;
}

async function loadFonts() {
  if (!document.fonts) return;
  await Promise.all([
    document.fonts.load(`italic 500 60px 'Fraunces'`),
    document.fonts.load(`500 40px 'Fraunces'`),
    document.fonts.load(`400 18px 'Commissioner'`),
    document.fonts.load(`700 14px 'Commissioner'`),
  ]).catch(() => {});
}

export default function Bomb() {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const bombRef = useRef(null);
  const fuseRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [layer, setLayer] = useState(0); // index of the wall in front, 4 = the room
  const [links, setLinks] = useState([]);
  const [holding, setHolding] = useState(false);
  const [maxLayer, setMaxLayer] = useState(0);
  const walls = useRef([]); // Wall instances, one per panel
  const paints = useRef([]); // {texture, links}
  const size = useRef({ W: 0, H: 0 });
  const hold = useRef(null); // {x, y, t0}
  const fxs = useRef([]); // explosion effects
  const shake = useRef(0);
  const assets = useRef(null);
  const layerRef = useRef(0);
  layerRef.current = layer;

  // ---- build the walls for the current viewport
  const build = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    size.current = { W, H };
    const bw = Math.max(72, Math.min(136, W / 12));
    const bh = Math.round(bw * 0.42);
    paints.current = PAINTERS.map((paint) => paint({ W, H, bw, bh, images: assets.current || {} }));
    walls.current = paints.current.map((p) => new Wall({ texture: p.texture, W, H, bw, bh }));
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = W;
      canvas.height = H;
    }
    setLinks(paints.current[layerRef.current] ? paints.current[layerRef.current].links : []);
  }, []);

  useEffect(() => {
    document.body.classList.add('bomb-body');
    document.title = 'Pranav Mishra';
    let link = document.getElementById('bomb-fonts');
    if (!link) {
      link = document.createElement('link');
      link.id = 'bomb-fonts';
      link.rel = 'stylesheet';
      link.href = FONTS;
      document.head.appendChild(link);
    }
    let alive = true;
    (async () => {
      const [images] = await Promise.all([loadAssets(), loadFonts()]);
      if (!alive) return;
      assets.current = images;
      build();
      setReady(true);
    })();
    const onResize = () => {
      if (!assets.current) return;
      build();
    };
    window.addEventListener('resize', onResize);
    return () => {
      alive = false;
      window.removeEventListener('resize', onResize);
      document.body.classList.remove('bomb-body');
    };
  }, [build]);

  // ---- the draw loop
  useEffect(() => {
    if (!ready) return undefined;
    let raf = 0;
    let last = performance.now();
    const loop = (now) => {
      raf = window.requestAnimationFrame(loop);
      const dt = now - last;
      last = now;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const { W, H } = size.current;
      const i = layerRef.current;
      const ws = walls.current;
      const front = ws[i];
      if (front) front.update(now, dt);
      ctx.clearRect(0, 0, W, H);
      // the wall behind, intact, unless the front is the last wall (then the room shows through)
      if (ws[i + 1]) ws[i + 1].draw(ctx, now);
      if (front) front.draw(ctx, now);
      // explosion effects
      fxs.current = fxs.current.filter((f) => now - f.t0 < 900);
      for (const f of fxs.current) {
        const p = (now - f.t0) / 900;
        const ring = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 60 + p * 420);
        ring.addColorStop(0, `rgba(255,240,200,${0.55 * (1 - p)})`);
        ring.addColorStop(0.6, `rgba(255,200,120,${0.18 * (1 - p)})`);
        ring.addColorStop(1, 'rgba(255,200,120,0)');
        ctx.fillStyle = ring;
        ctx.fillRect(0, 0, W, H);
        for (const s of f.sparks) {
          const t = p * 0.9;
          const x = f.x + s.vx * t * 420;
          const y = f.y + s.vy * t * 420 + 900 * t * t * 0.5;
          ctx.fillStyle = `rgba(${s.c},${1 - p})`;
          ctx.fillRect(x, y, s.s, s.s);
        }
      }
      // the fuse, drawn on the bomb by CSS; the shake, on the stage
      if (shake.current > 0) {
        shake.current -= dt;
        const k = Math.max(0, shake.current / 420) * 9;
        stageRef.current.style.transform = `translate(${(Math.random() - 0.5) * k}px, ${(Math.random() - 0.5) * k}px)`;
      } else if (stageRef.current && stageRef.current.style.transform) {
        stageRef.current.style.transform = '';
      }
      // advance when the front wall is gone
      if (front && front.state === 'gone') {
        const next = i + 1;
        setLayer(next);
        setMaxLayer((m) => Math.max(m, next));
        setLinks(paints.current[next] ? paints.current[next].links : []);
      }
      // the fuse
      if (hold.current) {
        const p = Math.min(1, (now - hold.current.t0) / FUSE_MS);
        if (fuseRef.current) fuseRef.current.style.setProperty('--fuse', String(p));
        if (p >= 1) fire(hold.current.x, hold.current.y, now);
      }
    };
    raf = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  const fire = (x, y, now) => {
    hold.current = null;
    setHolding(false);
    const front = walls.current[layerRef.current];
    if (!front || front.state !== 'intact') return;
    front.explode(x, y, now);
    setLinks([]);
    shake.current = 420;
    const sparks = [];
    for (let k = 0; k < 46; k += 1) {
      const a = Math.random() * Math.PI * 2;
      const v = 0.3 + Math.random() * 0.9;
      sparks.push({ vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.4, s: 2 + Math.random() * 4, c: Math.random() < 0.5 ? '255,214,120' : '245,120,70' });
    }
    fxs.current.push({ x, y, t0: now, sparks });
  };

  // ---- the bomb: follows the pointer; press and hold lights it
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const move = (e) => {
      const b = bombRef.current;
      if (b) b.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      if (hold.current) {
        hold.current.x = e.clientX;
        hold.current.y = e.clientY;
      }
    };
    const down = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      if (layerRef.current >= walls.current.length) return;
      const front = walls.current[layerRef.current];
      if (!front || front.state !== 'intact') return;
      hold.current = { x: e.clientX, y: e.clientY, t0: performance.now() };
      setHolding(true);
    };
    const up = () => {
      if (hold.current) {
        hold.current = null;
        setHolding(false);
        if (fuseRef.current) fuseRef.current.style.setProperty('--fuse', '0');
      }
    };
    window.addEventListener('pointermove', move, { passive: true });
    stage.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [ready]);

  const checkpoint = () => {
    const now = performance.now();
    const back = layer - 1;
    if (back < 0) return;
    const w = walls.current[back];
    if (!w) return;
    // rebuild the walls in front of the one we go back to, so the stack is whole again
    w.rebuild(now);
    for (let k = back + 1; k < walls.current.length; k += 1) {
      const wk = walls.current[k];
      if (wk.state !== 'intact') {
        wk.state = 'intact';
        wk.alpha = 1;
        wk.engine = null;
        wk.bodies = [];
      }
    }
    setLayer(back);
    setLinks(paints.current[back].links);
  };

  const inRoom = layer >= walls.current.length && ready;

  return (
    <div className={`bomb${holding ? ' holding' : ''}${inRoom ? ' in-room' : ''}`}>
      <Room active={inRoom} />
      <div className="bomb-stage" ref={stageRef} style={{ pointerEvents: inRoom ? 'none' : 'auto' }}>
        <canvas ref={canvasRef} className="bomb-wall" aria-hidden="true" />
        {links.map((l) => (
          <a key={`${l.href}-${l.x}-${l.y}`} className="bomb-hit" href={l.href} target={l.href.startsWith('/') || l.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer" aria-label={l.label} style={{ left: l.x, top: l.y, width: l.w, height: l.h }} />
        ))}
      </div>

      <div className="bomb-bomb" ref={bombRef} aria-hidden="true">
        <div className="bomb-bomb-in" ref={fuseRef}>
          <svg viewBox="0 0 40 40" width="40" height="40">
            <path className="bomb-fuse-line" d="M26 10 C 30 4, 36 6, 37 2" fill="none" stroke="#e8dcc4" strokeWidth="2.2" strokeLinecap="round" pathLength="1" />
            <circle className="bomb-spark" cx="37" cy="2" r="2.6" fill="#ffd36a" />
            <circle cx="18" cy="24" r="14" fill="#1c1a1f" />
            <circle cx="13" cy="19" r="4" fill="#4a4550" />
            <rect x="22" y="7" width="7" height="6" rx="1.5" fill="#6b6570" transform="rotate(35 25 10)" />
          </svg>
        </div>
      </div>

      {layer > 0 ? (
        <button type="button" className="bomb-checkpoint" onClick={checkpoint}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path d="M11 5 L4 12 L11 19 M4 12 H20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Load checkpoint
        </button>
      ) : null}

      <ol className="bomb-depth" aria-label="Walls">
        {NAMES.map((n, i) => (
          <li key={n} className={i === layer ? 'on' : i < layer ? 'down' : ''}>
            {n}
          </li>
        ))}
      </ol>

      {!ready ? <div className="bomb-loading" aria-hidden="true" /> : null}
    </div>
  );
}
