// v19 — the detonator: the wall, whatever the cursor is today, and the one loop driving both.
//
// The cursor is a choice now (the Lab):
//   charge   — no object at all. A ring that fills, reddens and gets angry in your hand.
//   dynamite — the stick, for when the cartoon is the point.
//   pin      — a crosshair that tightens to a point and goes red.
//
// Every one of them is driven by a single custom property, --p, written once a frame. The art
// is CSS and SVG reacting to it, so adding a fourth is a stylesheet, not a rewrite.
//
// Nothing here gates the page on requestAnimationFrame. A watchdog hand-cranks the loop if
// frames stop arriving, and a guard removes the wall outright if they never start.

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Wall from './Wall';
import { SURFACES } from './surfaces';

const FUSE_MS = 880;
const WICK = 'M26 15 C 30 7.5, 37 10, 38 2.5';

const Detonator = forwardRef(function Detonator(
  { surface = 'plaster', blast = 'burst', trigger = 'charge', armed, onBlast, reduced },
  ref
) {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const shakeElRef = useRef(null);
  const wickRef = useRef(null);
  const emberRef = useRef(null);
  const flashRef = useRef(null);
  const wallRef = useRef(null);
  const holdRef = useRef(null);
  const pointRef = useRef({ x: null, y: null });
  const heatRef = useRef(0);
  const surfaceRef = useRef(surface);
  const trailRef = useRef([]);
  const lastTrailRef = useRef(0);
  const armedRef = useRef(armed);
  const shakeRef = useRef(0);
  const [held, setHeld] = useState(false);
  const [dead, setDead] = useState(false); // frames never arrived; the wall is not survivable

  armedRef.current = armed;
  surfaceRef.current = surface;

  /* one write per frame: the fuse, everywhere it shows */
  const rest = useCallback((p = 0) => {
    heatRef.current = p;
    const root = cursorRef.current;
    if (root) root.style.setProperty('--p', p.toFixed(3));

    const wick = wickRef.current;
    const ember = emberRef.current;
    if (wick && ember) {
      try {
        const len = wick.getTotalLength();
        const pt = wick.getPointAtLength(len * (1 - p));
        ember.setAttribute('cx', pt.x.toFixed(2));
        ember.setAttribute('cy', pt.y.toFixed(2));
        ember.setAttribute('r', (2.2 + p * 2.8).toFixed(2));
      } catch (err) {
        // getPointAtLength throws on a detached node mid-unmount; the ember stays put
      }
    }
    const body = shakeElRef.current;
    if (body) {
      if (p <= 0) {
        body.style.transform = 'translate(0,0) rotate(0deg)';
      } else {
        const amp = 0.5 + p * p * 7;
        body.style.transform =
          `translate(${(Math.random() - 0.5) * amp * 2}px, ${(Math.random() - 0.5) * amp * 2}px)` +
          ` rotate(${(Math.random() - 0.5) * p * 9}deg)`;
      }
    }
  }, []);

  /* ── one loop: the wall, the field, the fuse and the shake ── */
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    let raf = 0;
    let alive = true;
    let ticked = false;
    let lastFrame = 0;
    let slow = 0; // on a slow machine the field pass is the first thing to go

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = window.innerWidth;
      const H = window.innerHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!wallRef.current) wallRef.current = new Wall({ W, H, dpr, surface, blast });
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
      if (dt > 42) slow = Math.min(30, slow + 1);
      else if (slow > 0) slow -= 1;
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
            shakeRef.current = 260;
            const flash = flashRef.current;
            if (flash) {
              flash.style.setProperty('--bx', `${hold.x}px`);
              flash.style.setProperty('--by', `${hold.y}px`);
              flash.classList.remove('go');
              void flash.offsetWidth; // reflow, so a second detonation replays it
              flash.classList.add('go');
            }
            if (onBlast) onBlast({ x: hold.x, y: hold.y });
          }
        }
      }

      wall.step(now, dt);
      wall.draw(ctx);
      trailRef.current = trailRef.current.filter((p) => now - p.t0 < 2200);
      if (slow < 12) wall.drawField(ctx, pointRef.current.x, pointRef.current.y, heatRef.current, now, trailRef.current);

      if (shakeRef.current > 0) {
        shakeRef.current -= dt;
        const k = Math.max(0, shakeRef.current / 260) ** 1.6 * 9;
        cv.style.transform = `translate(${(Math.random() - 0.5) * k}px, ${(Math.random() - 0.5) * k}px)`;
      } else if (cv.style.transform) {
        cv.style.transform = '';
      }

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

  /* ── the Lab can change the material and the failure underneath ── */
  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    wall.setSurface(surface);
    wall.setBlast(blast);
    trailRef.current = [];
  }, [surface, blast]);

  /* ── pointer ── */
  useEffect(() => {
    if (dead) return undefined;
    const move = (e) => {
      const c = cursorRef.current;
      if (c) c.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      pointRef.current = { x: e.clientX, y: e.clientY };
      const s = SURFACES[surfaceRef.current];
      if (s && s.trail) {
        const now = performance.now();
        if (now - lastTrailRef.current > 34 && trailRef.current.length < 64) {
          lastTrailRef.current = now;
          trailRef.current.push({ x: e.clientX, y: e.clientY, t0: now });
        }
      }
      if (holdRef.current) {
        holdRef.current.x = e.clientX;
        holdRef.current.y = e.clientY;
      }
    };
    const leave = () => {
      pointRef.current = { x: null, y: null };
    };
    const down = (e) => {
      if (!armedRef.current) return;
      if (e.button !== undefined && e.button !== 0) return;
      if (e.target && e.target.closest && e.target.closest('a, button, .v19-lab')) return;
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
    window.addEventListener('pointerout', leave);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    window.addEventListener('blur', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerout', leave);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      window.removeEventListener('blur', up);
    };
  }, [dead, reduced, rest, onBlast]);

  useImperativeHandle(ref, () => ({
    fire(x, y) {
      const wall = wallRef.current;
      if (!wall || dead || wall.state !== 'intact') return false;
      holdRef.current = null;
      setHeld(false);
      rest(0);
      const now = performance.now();
      if (!wall.explode(x, y, now)) return false;
      shakeRef.current = 260;
      const flash = flashRef.current;
      if (flash) {
        flash.style.setProperty('--bx', `${x}px`);
        flash.style.setProperty('--by', `${y}px`);
        flash.classList.remove('go');
        void flash.offsetWidth;
        flash.classList.add('go');
      }
      if (onBlast) onBlast({ x, y });
      return true;
    },
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
  }), [dead, onBlast, rest]);

  if (dead) return null;

  return (
    <>
      <canvas ref={canvasRef} className="v19-wall-canvas" aria-hidden="true" />
      <div className="v19-flash" ref={flashRef} aria-hidden="true" />

      <div className={`v19-cur k-${trigger}${held ? ' is-held' : ''}`} ref={cursorRef} aria-hidden="true">
        <div className="v19-cur-body" ref={shakeElRef}>
          {trigger === 'dynamite' ? (
            <>
              <span className="v19-cur-halo" />
              <svg width="68" height="68" viewBox="0 0 54 54">
                <g transform="rotate(-14 27 33)">
                  <rect x="13" y="18" width="9" height="30" rx="2.2" fill="#a8372a" />
                  <rect x="22" y="15" width="9" height="33" rx="2.2" fill="#c1412f" />
                  <rect x="31" y="18" width="9" height="30" rx="2.2" fill="#8e2d22" />
                  <rect x="22" y="15" width="3" height="33" fill="rgba(255,255,255,.16)" />
                  <rect x="11" y="26" width="31" height="5" fill="#3a3430" />
                  <rect x="11" y="37" width="31" height="5" fill="#3a3430" />
                  <rect x="11" y="26" width="31" height="1.4" fill="rgba(255,255,255,.14)" />
                  <rect x="22" y="27" width="9" height="3" fill="#d8c9a6" />
                </g>
                <path ref={wickRef} d={WICK} fill="none" stroke="rgba(58,52,48,.34)" strokeWidth="2.6" strokeLinecap="round" pathLength="1" />
                <path className="v19-cur-burnt" d={WICK} fill="none" stroke="#3a3430" strokeWidth="2.6" strokeLinecap="round" pathLength="1" strokeDasharray="1" />
                <circle ref={emberRef} className="v19-cur-ember" cx="38" cy="2.5" r="2.2" />
              </svg>
            </>
          ) : null}

          {trigger === 'pin' ? (
            <span className="v19-cur-pin">
              <i className="v19-cur-pin-n" />
              <i className="v19-cur-pin-e" />
              <i className="v19-cur-pin-s" />
              <i className="v19-cur-pin-w" />
              <i className="v19-cur-pin-c" />
            </span>
          ) : null}

          {trigger !== 'dynamite' && trigger !== 'pin' ? (
            <span className="v19-cur-charge">
              <i className="v19-cur-ring" />
              <i className="v19-cur-core" />
              <i className="v19-cur-brow is-l" />
              <i className="v19-cur-brow is-r" />
            </span>
          ) : null}
        </div>
      </div>
    </>
  );
});

export default Detonator;
