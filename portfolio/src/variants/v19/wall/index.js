// v19 — the detonator: the wall, the crosshair in your hand, and the one loop driving both.
//
// The cursor is four marks that close on a point and go red as you hold. It is driven by a
// single custom property, --p, written once a frame; the art is CSS reacting to it.
//
// Nothing here gates the page on requestAnimationFrame. A watchdog hand-cranks the loop if
// frames stop arriving, and a guard removes the wall outright if they never start.

import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Wall from './Wall';

const FUSE_MS = 880;

const Detonator = forwardRef(function Detonator(
  { surface = 'iso2', armed, onBlast, reduced },
  ref
) {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const shakeElRef = useRef(null);
  const flashRef = useRef(null);
  const wallRef = useRef(null);
  const holdRef = useRef(null);
  const pointRef = useRef({ x: null, y: null });
  const heatRef = useRef(0);
  const armedRef = useRef(armed);
  const shakeRef = useRef(0);
  const [held, setHeld] = useState(false);
  const [dead, setDead] = useState(false); // frames never arrived; the wall is not survivable

  armedRef.current = armed;

  /* one write per frame: the fuse, everywhere it shows */
  const rest = useCallback((p = 0) => {
    heatRef.current = p;
    const root = cursorRef.current;
    if (root) root.style.setProperty('--p', p.toFixed(3));

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
      if (!wallRef.current) wallRef.current = new Wall({ W, H, dpr, surface });
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
      if (slow < 12) wall.drawField(ctx, pointRef.current.x, pointRef.current.y, heatRef.current, now);

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

  /* ── the Lab can change the material underneath ── */
  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    wall.setSurface(surface);
  }, [surface]);

  /* ── pointer ── */
  useEffect(() => {
    if (dead) return undefined;
    const move = (e) => {
      const c = cursorRef.current;
      if (c) c.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      pointRef.current = { x: e.clientX, y: e.clientY };
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

      <div className={`v19-cur${held ? ' is-held' : ''}`} ref={cursorRef} aria-hidden="true">
        <div className="v19-cur-body" ref={shakeElRef}>
          <span className="v19-cur-pin">
            <i className="v19-cur-pin-n" />
            <i className="v19-cur-pin-e" />
            <i className="v19-cur-pin-s" />
            <i className="v19-cur-pin-w" />
            <i className="v19-cur-pin-c" />
          </span>
        </div>
      </div>
    </>
  );
});

export default Detonator;
