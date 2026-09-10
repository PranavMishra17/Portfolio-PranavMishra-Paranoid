// v18 — the detonator: the wall, the bomb that is your cursor, and the loop that drives both.
//
// The bomb is lit the whole time it is on the wall, because a lit fuse is what makes you want
// to press. Pressing does not start the fire, it makes it run: the ember accelerates down the
// wick, the halo swells and warms, and the bomb starts to shake. At the end of the wick the
// wall fails.
//
// Nothing here gates the page on requestAnimationFrame. A watchdog hand-cranks the loop if
// frames stop arriving, and a guard removes the wall outright if they never start — a stuck
// wall over an unreachable page is the one failure mode that cannot be allowed.

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Wall from './Wall';

const FUSE_MS = 1150;
const WICK = 'M27.5 15.5 C 32 8.5, 38.5 11, 39.5 3.5';

const Detonator = forwardRef(function Detonator(
  { mode, grid, armed, onBlast, onBack, reduced },
  ref
) {
  const canvasRef = useRef(null);
  const bombRef = useRef(null);
  const bodyRef = useRef(null);
  const haloRef = useRef(null);
  const burntRef = useRef(null);
  const wickRef = useRef(null);
  const emberRef = useRef(null);
  const flashRef = useRef(null);
  const wallRef = useRef(null);
  const holdRef = useRef(null);
  const armedRef = useRef(armed);
  const shakeRef = useRef(0);
  const [held, setHeld] = useState(false);
  const [dead, setDead] = useState(false); // frames never arrived; the wall is not survivable

  armedRef.current = armed;

  const rest = useCallback((p = 0) => {
    const burnt = burntRef.current;
    const ember = emberRef.current;
    const halo = haloRef.current;
    const body = bodyRef.current;
    const wick = wickRef.current;
    if (burnt) burnt.style.strokeDashoffset = String(-p);
    if (wick && ember) {
      try {
        const len = wick.getTotalLength();
        const pt = wick.getPointAtLength(len * (1 - p));
        ember.setAttribute('cx', pt.x.toFixed(2));
        ember.setAttribute('cy', pt.y.toFixed(2));
      } catch (err) {
        // getPointAtLength throws on a detached node mid-unmount; the ember simply stays put
      }
      ember.setAttribute('r', (2.1 + p * 2.6).toFixed(2));
    }
    if (halo) {
      halo.style.setProperty('--heat', String(0.34 + p * 0.66));
      halo.style.setProperty('--spread', String(1 + p * 1.5));
    }
    if (body) {
      if (p <= 0) {
        body.style.transform = 'translate(0,0) rotate(0deg) scale(1)';
      } else {
        const amp = 0.7 + p * p * 8;
        body.style.transform =
          `translate(${(Math.random() - 0.5) * amp * 2}px, ${(Math.random() - 0.5) * amp * 2}px)` +
          ` rotate(${(Math.random() - 0.5) * p * 10}deg) scale(${1 + p * 0.17})`;
      }
    }
  }, []);

  /* ── one loop: the wall, the fuse and the shake ── */
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    let raf = 0;
    let alive = true;
    let ticked = false;
    let lastFrame = 0;

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = window.innerWidth;
      const H = window.innerHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!wallRef.current) wallRef.current = new Wall({ W, H, dpr, mode, grid });
      else wallRef.current.resize(W, H);
    };

    try {
      size();
    } catch (err) {
      setDead(true);
      if (onBlast) onBlast(null);
      return undefined;
    }

    const loop = (now) => {
      if (!alive) return;
      ticked = true;
      const dt = lastFrame ? now - lastFrame : 16.7;
      lastFrame = now;
      const wall = wallRef.current;
      if (!wall) return;

      const hold = holdRef.current;
      if (hold && wall.state === 'intact') {
        const p = Math.min(1, (now - hold.t0) / FUSE_MS);
        rest(p);
        if (p >= 1) {
          holdRef.current = null;
          setHeld(false);
          rest(0);
          if (wall.explode(hold.x, hold.y, now)) {
            shakeRef.current = 460;
            const flash = flashRef.current;
            if (flash) {
              flash.style.setProperty('--bx', `${hold.x}px`);
              flash.style.setProperty('--by', `${hold.y}px`);
              flash.classList.remove('go');
              // reflow, so a second detonation replays the animation
              void flash.offsetWidth;
              flash.classList.add('go');
            }
            if (onBlast) onBlast({ x: hold.x, y: hold.y });
          }
        }
      }

      wall.step(now, dt);
      wall.draw(ctx);

      if (shakeRef.current > 0) {
        shakeRef.current -= dt;
        const k = Math.max(0, shakeRef.current / 460) ** 1.6 * 9;
        cv.style.transform = `translate(${(Math.random() - 0.5) * k}px, ${(Math.random() - 0.5) * k}px)`;
      } else if (cv.style.transform) {
        cv.style.transform = '';
      }

      if (wall.state === 'intact' && wall.wasReturning) {
        wall.wasReturning = false;
        if (onBack) onBack();
      }
      if (wall.state === 'returning') wall.wasReturning = true;

      raf = window.requestAnimationFrame(loop);
    };

    raf = window.requestAnimationFrame(loop);

    // rAF does not tick in a hidden document, and it can stop part way through a collapse.
    const watchdog = window.setInterval(() => {
      if (!alive) return;
      const now = performance.now();
      if (now - lastFrame > 320) loop(now);
    }, 240);

    // and if it never ticked at all, the wall is a lid over the page — take it off.
    const guard = window.setTimeout(() => {
      if (!ticked && alive) {
        try {
          loop(performance.now());
        } catch (err) {
          // fall through to the failsafe below
        }
        if (!ticked) {
          setDead(true);
          if (onBlast) onBlast(null);
        }
      }
    }, 900);

    window.addEventListener('resize', size);
    return () => {
      alive = false;
      window.cancelAnimationFrame(raf);
      window.clearInterval(watchdog);
      window.clearTimeout(guard);
      window.removeEventListener('resize', size);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── the Lab can change how it fails, and whether the blocks are hinted ── */
  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    wall.mode = mode;
    if (wall.grid !== grid) {
      wall.grid = grid;
      wall.paintFace();
    }
  }, [mode, grid]);

  /* ── pointer ── */
  useEffect(() => {
    if (dead) return undefined;
    const move = (e) => {
      const b = bombRef.current;
      if (b) b.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      if (holdRef.current) {
        holdRef.current.x = e.clientX;
        holdRef.current.y = e.clientY;
      }
    };
    const down = (e) => {
      if (!armedRef.current) return;
      if (e.button !== undefined && e.button !== 0) return;
      if (e.target && e.target.closest && e.target.closest('a, button, .v18-lab')) return;
      const wall = wallRef.current;
      if (!wall || wall.state !== 'intact') return;
      if (reduced) {
        // no fuse, no physics — one press takes the wall away
        wall.state = 'gone';
        wall.alpha = 0;
        if (onBlast) onBlast({ x: e.clientX, y: e.clientY });
        return;
      }
      holdRef.current = { x: e.clientX, y: e.clientY, t0: performance.now() };
      setHeld(true);
    };
    const up = () => {
      if (holdRef.current) {
        holdRef.current = null;
        setHeld(false);
        rest(0);
      }
    };
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    window.addEventListener('blur', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      window.removeEventListener('blur', up);
    };
  }, [dead, reduced, rest, onBlast]);

  useImperativeHandle(ref, () => ({
    rebuild() {
      const wall = wallRef.current;
      if (!wall || dead) return false;
      if (wall.state === 'intact') return true;
      wall.rebuild(performance.now());
      return true;
    },
    state() {
      return wallRef.current ? wallRef.current.state : 'gone';
    },
  }), [dead]);

  if (dead) return null;

  return (
    <>
      <canvas ref={canvasRef} className="v18-wall-canvas" aria-hidden="true" />
      <div className="v18-flash" ref={flashRef} aria-hidden="true" />
      <div className={`v18-bomb${held ? ' is-held' : ''}`} ref={bombRef} aria-hidden="true">
        <div className="v18-bomb-body" ref={bodyRef}>
          <div className="v18-bomb-halo" ref={haloRef} />
          <svg width="52" height="52" viewBox="0 0 52 52">
            <ellipse cx="25" cy="42" rx="13" ry="3" fill="rgba(40,28,18,.16)" />
            <path ref={wickRef} d={WICK} fill="none" stroke="rgba(52,42,32,.34)" strokeWidth="2.6" strokeLinecap="round" pathLength="1" />
            <path
              ref={burntRef}
              d={WICK}
              fill="none"
              stroke="#3a2f24"
              strokeWidth="2.6"
              strokeLinecap="round"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset="0"
            />
            <circle cx="22" cy="27" r="12.5" fill="#241f1b" />
            <circle cx="22" cy="27" r="12.5" fill="url(#v18BombLight)" />
            <path d="M25.6 16.6 h4.2 a1.6 1.6 0 0 1 0 3.2 h-4.2 z" fill="#3a2f24" />
            <circle cx="17.4" cy="22.6" r="3.4" fill="rgba(255,246,232,.20)" />
            <circle ref={emberRef} className="v18-ember" cx="39.5" cy="3.5" r="2.1" />
            <defs>
              <radialGradient id="v18BombLight" cx="0.32" cy="0.28" r="0.85">
                <stop offset="0" stopColor="#5a4d42" />
                <stop offset="0.55" stopColor="#241f1b" />
                <stop offset="1" stopColor="#15110e" />
              </radialGradient>
            </defs>
          </svg>
        </div>
      </div>
    </>
  );
});

export default Detonator;
