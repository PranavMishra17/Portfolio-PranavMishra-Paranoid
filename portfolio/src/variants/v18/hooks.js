// v18 — the three behaviours the whole page leans on.

import { useCallback, useEffect, useRef, useState } from 'react';

/* ────────────────────────── the sky ──────────────────────────
   Weather, not Vantage. Slight gradients of colour changing as you scroll — no sun, no show.
   Four stops across the page, lerped, written straight onto one fixed element. */

const STOPS = [
  { top: [217, 230, 239], mid: [238, 240, 233], bot: [246, 239, 228] }, // pale morning
  { top: [207, 224, 234], mid: [234, 238, 230], bot: [244, 234, 217] }, // clear midday
  { top: [216, 219, 230], mid: [238, 229, 217], bot: [242, 220, 196] }, // warm afternoon
  { top: [220, 208, 218], mid: [239, 220, 201], bot: [238, 201, 168] }, // golden
  { top: [203, 194, 214], mid: [228, 207, 194], bot: [223, 181, 151] }, // dusk, at the room
];

const lerp = (a, b, t) => Math.round(a + (b - a) * t);
const mix = (a, b, t, k) => `rgb(${lerp(a[k][0], b[k][0], t)},${lerp(a[k][1], b[k][1], t)},${lerp(a[k][2], b[k][2], t)})`;

export function useSky(ref, enabled = true) {
  useEffect(() => {
    if (!enabled) return undefined;
    const el = ref.current;
    if (!el) return undefined;
    let ticking = false;

    const apply = (p) => {
      const n = STOPS.length - 1;
      const scaled = Math.min(Math.max(p, 0), 0.9999) * n;
      const i = Math.floor(scaled);
      const t = scaled - i;
      const a = STOPS[i];
      const b = STOPS[Math.min(i + 1, n)];
      el.style.setProperty('--sky-top', mix(a, b, t, 'top'));
      el.style.setProperty('--sky-mid', mix(a, b, t, 'mid'));
      el.style.setProperty('--sky-bot', mix(a, b, t, 'bot'));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        apply(max > 0 ? window.scrollY / max : 0);
        ticking = false;
      });
    };

    apply(0);
    // and once more on a timeout, so the first paint is right even if rAF never runs
    const settle = window.setTimeout(onScroll, 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, enabled]);
}

/* ────────────────────────── the opener ──────────────────────────
   One primitive for every click-to-open on the page. It has to feel instant and it has to get
   out of the way without being asked: anywhere outside closes it, Escape closes it, and
   scrolling far enough that you have clearly moved on closes it too. */

export function useOpener() {
  const [open, setOpen] = useState(null);
  const openRef = useRef(null);
  openRef.current = open;

  const toggle = useCallback((id) => {
    setOpen((cur) => (cur === id ? null : id));
  }, []);
  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    if (open == null) return undefined;
    const from = window.scrollY;
    const away = (e) => {
      if (e.target && e.target.closest && e.target.closest('[data-keep-open]')) return;
      setOpen(null);
    };
    const key = (e) => {
      if (e.key === 'Escape') setOpen(null);
    };
    const scrolled = () => {
      if (Math.abs(window.scrollY - from) > window.innerHeight * 0.3) setOpen(null);
    };
    window.addEventListener('pointerdown', away);
    window.addEventListener('keydown', key);
    window.addEventListener('scroll', scrolled, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', away);
      window.removeEventListener('keydown', key);
      window.removeEventListener('scroll', scrolled);
    };
  }, [open]);

  return { open, toggle, close, setOpen };
}

/* ────────────────────────── the pull-in ──────────────────────────
   "If I have scrolled past twenty percent of the new block, it will just scroll me down so all
   of it is in my screen." So: commit a fifth of the way into the next slab and it takes the
   screen; stop short and you are put back where you were. The same threshold going up.

   It is a tween we own rather than scroll-behavior, so that the first thing the user does
   cancels it. Nothing here ever traps the page. */

export function useSnap(enabled, getSections) {
  const raf = useRef(0);
  const busy = useRef(false);

  useEffect(() => {
    if (!enabled) return undefined;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let idle = 0;
    let last = window.scrollY;
    let dir = 1;

    const cancel = () => {
      if (raf.current) window.cancelAnimationFrame(raf.current);
      raf.current = 0;
      busy.current = false;
    };

    const glide = (to) => {
      const from = window.scrollY;
      const span = to - from;
      if (Math.abs(span) < 3) return;
      const dur = Math.min(620, 200 + Math.abs(span) * 0.42);
      const t0 = performance.now();
      busy.current = true;
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        const e = t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
        window.scrollTo(0, Math.round(from + span * e));
        if (t < 1 && busy.current) raf.current = window.requestAnimationFrame(tick);
        else cancel();
      };
      raf.current = window.requestAnimationFrame(tick);
    };

    const decide = () => {
      const els = (getSections() || []).filter(Boolean);
      if (els.length < 2) return;
      const vh = window.innerHeight;
      const tops = els.map((el) => el.getBoundingClientRect().top);
      let k = 0;
      for (let i = 0; i < tops.length; i += 1) if (tops[i] <= 1) k = i;
      const b = k + 1 < tops.length ? tops[k + 1] : null;

      let target = k;
      if (dir > 0) {
        if (b !== null && b < vh * 0.8) target = k + 1;
      } else if (b !== null && b < vh * 0.2) {
        target = k + 1;
      }
      const el = els[target];
      if (!el) return;
      const to = window.scrollY + el.getBoundingClientRect().top;
      const max = document.documentElement.scrollHeight - vh;
      glide(Math.max(0, Math.min(max, to)));
    };

    const onScroll = () => {
      const y = window.scrollY;
      if (!busy.current) {
        if (y !== last) dir = y > last ? 1 : -1;
        window.clearTimeout(idle);
        idle = window.setTimeout(decide, 110);
      }
      last = y;
    };

    const interrupt = () => {
      if (busy.current) cancel();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', interrupt, { passive: true });
    window.addEventListener('touchstart', interrupt, { passive: true });
    window.addEventListener('keydown', interrupt);
    return () => {
      window.clearTimeout(idle);
      cancel();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', interrupt);
      window.removeEventListener('touchstart', interrupt);
      window.removeEventListener('keydown', interrupt);
    };
  }, [enabled, getSections]);
}

/** Fires once, the first time an element is properly on screen. Never gates content — the
    caller always has a timeout that lands the same state. */
export function useOnScreen(ref, margin = '-18%') {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return undefined;
    if (!('IntersectionObserver' in window)) {
      setSeen(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: `0px 0px ${margin} 0px` }
    );
    io.observe(el);
    // an observer cannot fire in a zero-height viewport; this lands the same state anyway
    const guard = window.setTimeout(() => setSeen(true), 4000);
    return () => {
      io.disconnect();
      window.clearTimeout(guard);
    };
  }, [ref, seen, margin]);
  return seen;
}
