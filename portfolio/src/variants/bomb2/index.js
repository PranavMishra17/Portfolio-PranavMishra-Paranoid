// Bomb, second pass — same detonation, a modern surface.
//
// Square tiles on a dark ground. The cursor is a bomb until it is over something you can act on:
// a finger over links and controls, a magnifier over projects, papers and anything that opens.
// Holding lights the fuse only while the cursor is the bomb. The checkpoint control is pinned to the
// bottom left, where no wall ever puts anything; the depth sits bottom right.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Wall from './wall';
import { PAINTERS } from './murals';
import Room from './Room';
import { INTRO, FEATURED } from './copy';
import './bomb2.css';

const FONTS = 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Manrope:wght@400;500;600;700&display=swap';
const FUSE_MS = 1100;
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
  await Promise.all([document.fonts.load(`600 40px 'Space Grotesk'`), document.fonts.load(`400 18px 'Manrope'`), document.fonts.load(`600 12px 'Manrope'`)]).catch(() => {});
}

export default function Bomb2() {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const bombRef = useRef(null);
  const fuseRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [layer, setLayer] = useState(0);
  const [links, setLinks] = useState([]);
  const [holding, setHolding] = useState(false);
  const [cursor, setCursor] = useState('bomb'); // bomb | hand | zoom | native
  const walls = useRef([]);
  const paints = useRef([]);
  const size = useRef({ W: 0, H: 0 });
  const hold = useRef(null);
  const fxs = useRef([]);
  const shake = useRef(0);
  const assets = useRef(null);
  const layerRef = useRef(0);
  const cursorRef = useRef('bomb');
  const pointer = useRef({ x: -100, y: -100 });
  layerRef.current = layer;
  cursorRef.current = cursor;

  const build = useCallback(() => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    size.current = { W, H };
    const tile = Math.max(56, Math.min(108, W / 15));
    paints.current = PAINTERS.map((paint) => paint({ W, H, size: tile, images: assets.current || {} }));
    walls.current = paints.current.map((p) => new Wall({ texture: p.texture, W, H, bw: tile, bh: tile }));
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = W;
      canvas.height = H;
    }
    setLinks(paints.current[layerRef.current] ? paints.current[layerRef.current].links : []);
  }, []);

  useEffect(() => {
    document.body.classList.add('bomb2-body');
    document.title = 'Pranav Mishra';
    let link = document.getElementById('bomb2-fonts');
    if (!link) {
      link = document.createElement('link');
      link.id = 'bomb2-fonts';
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
      if (assets.current) build();
    };
    window.addEventListener('resize', onResize);
    return () => {
      alive = false;
      window.removeEventListener('resize', onResize);
      document.body.classList.remove('bomb2-body');
    };
  }, [build]);

  const fire = (x, y, now) => {
    hold.current = null;
    setHolding(false);
    const front = walls.current[layerRef.current];
    if (!front || front.state !== 'intact') return;
    front.explode(x, y, now);
    setLinks([]);
    shake.current = 380;
    const sparks = [];
    for (let k = 0; k < 40; k += 1) {
      const a = Math.random() * Math.PI * 2;
      const v = 0.3 + Math.random() * 0.9;
      sparks.push({ vx: Math.cos(a) * v, vy: Math.sin(a) * v - 0.4, s: 2 + Math.random() * 3, c: Math.random() < 0.6 ? '126,224,198' : '243,245,249' });
    }
    fxs.current.push({ x, y, t0: now, sparks });
  };

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
      if (ws[i + 1]) ws[i + 1].draw(ctx, now);
      if (front) front.draw(ctx, now);
      // while the fuse burns, the tiles under the bomb warm up
      if (hold.current && front && front.state === 'intact') {
        const p = Math.min(1, (now - hold.current.t0) / FUSE_MS);
        const g = ctx.createRadialGradient(hold.current.x, hold.current.y, 0, hold.current.x, hold.current.y, 90 + p * 160);
        g.addColorStop(0, `rgba(126,224,198,${0.22 * p})`);
        g.addColorStop(1, 'rgba(126,224,198,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, W, H);
      }
      fxs.current = fxs.current.filter((f) => now - f.t0 < 900);
      for (const f of fxs.current) {
        const p = (now - f.t0) / 900;
        const ring = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 60 + p * 420);
        ring.addColorStop(0, `rgba(230,255,246,${0.5 * (1 - p)})`);
        ring.addColorStop(0.6, `rgba(126,224,198,${0.16 * (1 - p)})`);
        ring.addColorStop(1, 'rgba(126,224,198,0)');
        ctx.fillStyle = ring;
        ctx.fillRect(0, 0, W, H);
        ctx.save();
        ctx.strokeStyle = `rgba(126,224,198,${0.5 * (1 - p)})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(f.x, f.y, 30 + p * 520, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
        for (const s of f.sparks) {
          const t = p * 0.9;
          const x = f.x + s.vx * t * 420;
          const y = f.y + s.vy * t * 420 + 900 * t * t * 0.5;
          ctx.fillStyle = `rgba(${s.c},${1 - p})`;
          ctx.fillRect(x, y, s.s, s.s);
        }
      }
      if (shake.current > 0) {
        shake.current -= dt;
        const k = Math.max(0, shake.current / 380) * 8;
        stageRef.current.style.transform = `translate(${(Math.random() - 0.5) * k}px, ${(Math.random() - 0.5) * k}px)`;
      } else if (stageRef.current && stageRef.current.style.transform) {
        stageRef.current.style.transform = '';
      }
      if (front && front.state === 'gone') {
        const next = i + 1;
        setLayer(next);
        setLinks(paints.current[next] ? paints.current[next].links : []);
      }
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

  // what the cursor should be, from what is under it
  const kindFor = (el) => {
    if (!el || !el.closest) return 'bomb';
    if (el.closest('.bomb2-panel, .bomb2-scrim')) return 'native';
    const hit = el.closest('.bomb2-hit');
    if (hit) return hit.dataset.cursor || 'hand';
    if (el.closest('a, button')) return 'hand';
    if (el.closest('.bomb2-pixels')) return el.dataset.roomCursor || 'bomb';
    return 'bomb';
  };

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const move = (e) => {
      pointer.current = { x: e.clientX, y: e.clientY };
      const b = bombRef.current;
      if (b) b.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      if (hold.current) {
        hold.current.x = e.clientX;
        hold.current.y = e.clientY;
      }
      const k = kindFor(e.target);
      if (k !== cursorRef.current) setCursor(k);
    };
    const down = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      if (kindFor(e.target) !== 'bomb') return;
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
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
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
  const roomCursor = useCallback((kind) => {
    // the room reports what is under the pointer: '' for nothing, 'hand' for toggles, 'zoom' for things that open
    const c = kind || 'bomb';
    if (c !== cursorRef.current) setCursor(c);
  }, []);

  return (
    <div className={`bomb2 c-${cursor}${holding ? ' holding' : ''}${inRoom ? ' in-room' : ''}`}>
      <Room active={inRoom} onCursor={roomCursor} />
      <div className="bomb2-stage" ref={stageRef} style={{ pointerEvents: inRoom ? 'none' : 'auto' }}>
        <canvas ref={canvasRef} className="bomb2-wall" aria-hidden="true" />
        {links.map((l) => (
          <a
            key={`${l.href}-${l.x}-${l.y}`}
            className="bomb2-hit"
            data-cursor={l.cursor || 'hand'}
            href={l.href}
            target={l.href.startsWith('/') || l.href.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            aria-label={l.label}
            style={{ left: l.x, top: l.y, width: l.w, height: l.h }}
          />
        ))}
      </div>

      <div className="bomb2-cursor" ref={bombRef} aria-hidden="true">
        <div className="bomb2-bomb" ref={fuseRef}>
          <svg viewBox="0 0 48 48" width="48" height="48">
            <circle className="bomb2-ring" cx="24" cy="24" r="21" fill="none" stroke="#7ee0c6" strokeWidth="2" pathLength="1" strokeLinecap="round" transform="rotate(-90 24 24)" />
            <circle cx="24" cy="24" r="11" fill="#0f1218" stroke="#f3f5f9" strokeWidth="1.5" />
            <circle cx="20" cy="20" r="2.5" fill="rgba(255,255,255,0.5)" />
            <path d="M31 16 C 33 12, 37 12, 38 9" fill="none" stroke="#f3f5f9" strokeWidth="1.6" strokeLinecap="round" />
            <circle className="bomb2-spark" cx="38" cy="9" r="2.4" fill="#7ee0c6" />
          </svg>
        </div>
        <div className="bomb2-hand">
          <svg viewBox="0 0 32 32" width="32" height="32">
            <path d="M12 4.5 a2 2 0 0 1 4 0 V14 h1 V9.5 a2 2 0 0 1 4 0 V15 h1 V11.5 a2 2 0 0 1 4 0 V17 h1 V14 a2 2 0 0 1 3.5 0 v8 c0 4 -3 7 -7 7 h-4 c-2.5 0 -4.5 -1 -6 -3 l-6 -8 a2 2 0 0 1 3.2 -2.4 L12 19 Z" fill="#f3f5f9" stroke="#0f1218" strokeWidth="1.4" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="bomb2-zoom">
          <svg viewBox="0 0 32 32" width="32" height="32">
            <circle cx="13" cy="13" r="8.5" fill="rgba(15,18,24,0.55)" stroke="#f3f5f9" strokeWidth="2" />
            <path d="M19.5 19.5 L28 28" stroke="#f3f5f9" strokeWidth="3" strokeLinecap="round" />
            <path d="M9.5 13 h7 M13 9.5 v7" stroke="#7ee0c6" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      <div className="bomb2-dock">
        <button type="button" className="bomb2-checkpoint" onClick={checkpoint} disabled={layer === 0} aria-label="Load checkpoint, put the last wall back">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path d="M10 6 L4 12 L10 18 M4 12 H20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Load checkpoint</span>
        </button>
      </div>

      <ol className="bomb2-depth" aria-label="Walls">
        {NAMES.map((n, i) => (
          <li key={n} className={i === layer ? 'on' : i < layer ? 'down' : ''}>
            <span className="bomb2-depth-dot" aria-hidden="true" />
            <span className="bomb2-depth-name">{n}</span>
          </li>
        ))}
      </ol>

      {!ready ? <div className="bomb2-loading" aria-hidden="true" /> : null}
    </div>
  );
}
