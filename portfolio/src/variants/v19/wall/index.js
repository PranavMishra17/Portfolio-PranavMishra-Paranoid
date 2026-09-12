// v19 — the detonator: the wall, the crosshair in your hand, and the one loop driving both.
//
// The cursor is four marks that close on a point and go red as you hold. It is driven by a
// single custom property, --p, written once a frame; the art is CSS reacting to it.
//
// Nothing here gates the page on requestAnimationFrame. A watchdog hand-cranks the loop if
// frames stop arriving while the page is visible, and a guard removes the wall outright if
// they never start. Exactly one frame is ever pending: rAF callbacks queue up in a hidden tab
// rather than run, and every extra one would come back as a loop of its own.

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
    let lost = false; // the canvas has lost its backing store (GPU reset, memory pressure)
    // what the last frame was drawn from; an identical frame is not drawn again, so a wall
    // nobody is touching costs nothing
    const drawn = { x: undefined, y: undefined, heat: -1, w: 0, h: 0, gen: 0 };
    let gen = 0;

    // the only way a frame is ever asked for: whatever was pending is dropped first
    const schedule = () => {
      if (raf) window.cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(loop);
    };

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
      gen += 1;
    };

    try {
      size();
    } catch (err) {
      setDead(true);
      if (onBlast) onBlast(null);
      return undefined;
    }

    function loop(now) {
      if (!alive) return;
      ticked = true;
      const dt = lastFrame ? now - lastFrame : 16.7;
      lastFrame = now;
      if (dt > 42) slow = Math.min(30, slow + 1);
      else if (slow > 0) slow -= 1;
      const wall = wallRef.current;
      if (!wall) return;

      // a lost context ignores every draw; when it comes back, the face and the atlas were
      // canvases too and are blank, so the wall is painted again before the next frame
      if (typeof ctx.isContextLost === 'function') {
        const isLost = ctx.isContextLost();
        if (isLost) {
          lost = true;
          schedule();
          return;
        }
        if (lost) {
          lost = false;
          try { size(); } catch (err) { /* the next resize will */ }
        }
      }

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

      const pt = pointRef.current;
      const still =
        wall.state === 'intact' && !holdRef.current && shakeRef.current <= 0 &&
        pt.x === drawn.x && pt.y === drawn.y && heatRef.current === drawn.heat &&
        cv.width === drawn.w && cv.height === drawn.h && gen === drawn.gen;
      if (!still) {
        wall.step(now, dt);
        wall.draw(ctx);
        if (slow < 12) wall.drawField(ctx, pt.x, pt.y, heatRef.current, now);
        drawn.x = pt.x;
        drawn.y = pt.y;
        drawn.heat = heatRef.current;
        drawn.w = cv.width;
        drawn.h = cv.height;
        drawn.gen = gen;
      }

      if (shakeRef.current > 0) {
        shakeRef.current -= dt;
        const k = Math.max(0, shakeRef.current / 260) ** 1.6 * 9;
        cv.style.transform = `translate(${(Math.random() - 0.5) * k}px, ${(Math.random() - 0.5) * k}px)`;
      } else if (cv.style.transform) {
        cv.style.transform = '';
      }

      schedule();
    }

    schedule();

    // rAF can stop part way through a collapse while the page is still visible; this cranks
    // it. In a hidden tab nothing runs at all — the one pending frame fires on the way back.
    const watchdog = window.setInterval(() => {
      if (!alive || document.hidden) return;
      const now = performance.now();
      if (now - lastFrame > 320) loop(now);
    }, 240);

    const onVisible = () => {
      if (document.hidden || !alive) return;
      lastFrame = performance.now();
      schedule();
    };
    document.addEventListener('visibilitychange', onVisible);

    // the browser restores a lost 2D context on its own unless the event is cancelled; the
    // loop repaints when it sees the context back. This is the same thing for browsers
    // without isContextLost().
    const onRestored = () => {
      lost = false;
      try { size(); } catch (err) { /* as above */ }
      schedule();
    };
    cv.addEventListener('contextrestored', onRestored);

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
      document.removeEventListener('visibilitychange', onVisible);
      cv.removeEventListener('contextrestored', onRestored);
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
