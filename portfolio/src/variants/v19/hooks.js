// v19 — the behaviours the whole page leans on: the clock, the sky, the opener.

import { useCallback, useEffect, useRef, useState } from 'react';

/* ────────────────────────── the clock and the sky ──────────────────────────
   The page is painted for the time of day it is opened. One palette per hour of the day,
   interpolated, so the colour is never a step. Every stop stays light enough for dark ink on
   it: the darkest night is a dusty blue, not black. Scrolling drifts the hour forward a little
   — the bottom of the page is about an hour and a half later than the top — so the colour
   moves as you go without ever becoming a different day. */

const HOURS = [
  [0, [168, 180, 206], [190, 196, 214], [206, 204, 214]], // night
  [3, [160, 172, 200], [182, 190, 210], [200, 200, 212]], // the deep of it
  [5, [178, 180, 208], [206, 198, 214], [226, 208, 206]], // before dawn
  [7, [198, 200, 222], [236, 214, 200], [246, 208, 178]], // sunrise
  [9, [206, 224, 236], [234, 238, 232], [246, 240, 228]], // morning
  [12, [196, 220, 238], [230, 238, 236], [244, 240, 230]], // midday
  [15, [210, 224, 232], [238, 234, 220], [246, 232, 208]], // afternoon
  [17, [216, 214, 222], [240, 222, 196], [244, 208, 164]], // golden
  [19, [200, 192, 216], [236, 204, 186], [236, 182, 150]], // sunset
  [21, [178, 182, 212], [204, 196, 214], [216, 196, 196]], // dusk
  [24, [168, 180, 206], [190, 196, 214], [206, 204, 214]], // and round
];

const lerp = (a, b, t) => Math.round(a + (b - a) * t);
// every colour is pulled most of the way toward the paper, so the hour is a tint, not a wash
const PAPER = [240, 238, 233];
const FADE = 0.55;
const fade = (c) => c.map((v, i) => v + (PAPER[i] - v) * FADE);
const mix3 = (a, b, t) => {
  const fa = fade(a);
  const fb = fade(b);
  return `rgb(${lerp(fa[0], fb[0], t)},${lerp(fa[1], fb[1], t)},${lerp(fa[2], fb[2], t)})`;
};

/** The three sky colours at a fractional hour of the day, and where the sun or the moon is:
    a faint glow that rises in the east and sets in the west, so the hour reads even when the
    colours are this quiet. */
export function skyAt(hour) {
  const h = ((hour % 24) + 24) % 24;
  let i = 0;
  while (i < HOURS.length - 2 && HOURS[i + 1][0] <= h) i += 1;
  const a = HOURS[i];
  const b = HOURS[i + 1];
  const t = (h - a[0]) / (b[0] - a[0]);
  const day = h >= 5.5 && h <= 19;
  const p = day ? (h - 5.5) / 13.5 : (((h + 24 - 19) % 24) / 10.5);
  const arc = Math.sin(Math.PI * Math.min(1, Math.max(0, p)));
  return {
    top: mix3(a[1], b[1], t),
    mid: mix3(a[2], b[2], t),
    bot: mix3(a[3], b[3], t),
    sunX: `${Math.round(8 + p * 84)}%`,
    sunY: `${Math.round(70 - arc * 58)}%`,
    sunA: day ? (0.16 + arc * 0.2).toFixed(3) : (0.06 + arc * 0.08).toFixed(3),
    sunC: day ? '255, 226, 170' : '214, 222, 248',
  };
}

/** How dark the room is at that hour, 0..1. It never goes past 0.72: the darkest night is still
    a blue room with the lamp on, not a black one. */
export function nightAt(hour) {
  const h = ((hour % 24) + 24) % 24;
  const pts = [
    [0, 0.72], [4, 0.72], [5.5, 0.55], [7, 0.25], [8.5, 0.04], [16.5, 0.04],
    [18, 0.2], [19.5, 0.45], [21, 0.62], [22.5, 0.72], [24, 0.72],
  ];
  let i = 0;
  while (i < pts.length - 2 && pts[i + 1][0] <= h) i += 1;
  const [h0, v0] = pts[i];
  const [h1, v1] = pts[i + 1];
  return v0 + (v1 - v0) * ((h - h0) / (h1 - h0));
}

// how far the hour drifts from the top of the page to the bottom
export const DRIFT = 1.5;

/** The hour to paint for: the real clock, kept current, or a fixed hour from the Lab. */
export function useClock(fixed) {
  const read = () => {
    const d = new Date();
    return d.getHours() + d.getMinutes() / 60;
  };
  const [now, setNow] = useState(read);
  useEffect(() => {
    if (fixed !== 'now') return undefined;
    setNow(read());
    const t = window.setInterval(() => setNow(read()), 60000);
    return () => window.clearInterval(t);
  }, [fixed]);
  return fixed === 'now' ? now : Number(fixed);
}

export function useSky(ref, hour) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let ticking = false;

    const apply = (p) => {
      const c = skyAt(hour + p * DRIFT);
      el.style.setProperty('--sky-top', c.top);
      el.style.setProperty('--sky-mid', c.mid);
      el.style.setProperty('--sky-bot', c.bot);
      el.style.setProperty('--sun-x', c.sunX);
      el.style.setProperty('--sun-y', c.sunY);
      el.style.setProperty('--sun-a', c.sunA);
      el.style.setProperty('--sun-c', c.sunC);
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
  }, [ref, hour]);
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
