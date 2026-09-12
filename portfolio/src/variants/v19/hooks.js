// v19 — the behaviours the whole page leans on: the clock, the sky, the opener.

import { useCallback, useEffect, useRef, useState } from 'react';

/* ────────────────────────── the clock and the sky ──────────────────────────
   The page is painted for the time of day it is opened. One palette per hour of the day,
   interpolated, so the colour is never a step. Every stop stays light enough for dark ink on
   it: the darkest night is a dusty blue, not black. Scrolling drifts the hour forward a little
   — the bottom of the page is about an hour and a half later than the top — so the colour
   moves as you go without ever becoming a different day. */

const HOURS = [
  [0, [118, 132, 182], [150, 160, 198], [178, 178, 204]], // night
  [3, [110, 124, 176], [142, 152, 192], [172, 172, 200]], // the deep of it
  [5, [156, 160, 202], [196, 190, 210], [222, 204, 204]], // before dawn
  [7, [198, 200, 222], [236, 214, 200], [246, 208, 178]], // sunrise
  [9, [206, 224, 236], [234, 238, 232], [246, 240, 228]], // morning
  [12, [196, 220, 238], [230, 238, 236], [244, 240, 230]], // midday
  [15, [210, 224, 232], [238, 234, 220], [246, 232, 208]], // afternoon
  [17, [216, 214, 222], [240, 222, 196], [244, 208, 164]], // golden
  [19, [200, 192, 216], [236, 204, 186], [236, 182, 150]], // sunset
  [21, [150, 158, 204], [184, 182, 208], [204, 190, 196]], // dusk
  [24, [118, 132, 182], [150, 160, 198], [178, 178, 204]], // and round
];

const lerp = (a, b, t) => Math.round(a + (b - a) * t);
// every colour is pulled most of the way toward the paper, so the hour is a tint, not a wash —
// less so at night, so the dark actually reads as dark. `deep` is how much less: 0.2 leaves
// the deepest night at 35% of the way to paper, 0.32 at 23%.
const PAPER = [240, 238, 233];
const FADE = 0.55;
const fade = (c, f) => c.map((v, i) => v + (PAPER[i] - v) * f);
const mix3 = (a, b, t, f) => {
  const fa = fade(a, f);
  const fb = fade(b, f);
  return `rgb(${lerp(fa[0], fb[0], t)},${lerp(fa[1], fb[1], t)},${lerp(fa[2], fb[2], t)})`;
};

// star tiles for the night, two of them so the twinkle is a second layer breathing over the first
export const STARS = ["data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='460'%3E%3Ccircle cx='316.7' cy='257.5' r='1.6' fill='%23fff' fill-opacity='0.61'/%3E%3Ccircle cx='411.2' cy='84.9' r='1.1' fill='%23fff' fill-opacity='0.61'/%3E%3Ccircle cx='130.3' cy='205.4' r='0.7' fill='%23fff' fill-opacity='0.4'/%3E%3Ccircle cx='485.4' cy='19.3' r='0.9' fill='%23fff' fill-opacity='0.88'/%3E%3Cpath d='M430.9 70.48l0.5376000000000001 1.3823999999999999l1.3823999999999999 0.5376000000000001l-1.3823999999999999 0.5376000000000001l-0.5376000000000001 1.3823999999999999l-0.5376000000000001 -1.3823999999999999l-1.3823999999999999 -0.5376000000000001Z' fill='%23fff' fill-opacity='0.81'/%3E%3Ccircle cx='25.0' cy='404.6' r='1.1' fill='%23fff' fill-opacity='0.37'/%3E%3Ccircle cx='308.4' cy='387.5' r='1.1' fill='%23fff' fill-opacity='0.48'/%3E%3Ccircle cx='3.2' cy='39.1' r='1.3' fill='%23fff' fill-opacity='0.5'/%3E%3Ccircle cx='697.0' cy='386.5' r='1.3' fill='%23fff' fill-opacity='0.49'/%3E%3Ccircle cx='359.0' cy='13.7' r='1.1' fill='%23fff' fill-opacity='0.77'/%3E%3Cpath d='M592.6 175.88000000000002l0.5376000000000001 1.3823999999999999l1.3823999999999999 0.5376000000000001l-1.3823999999999999 0.5376000000000001l-0.5376000000000001 1.3823999999999999l-0.5376000000000001 -1.3823999999999999l-1.3823999999999999 -0.5376000000000001Z' fill='%23fff' fill-opacity='0.82'/%3E%3Ccircle cx='146.8' cy='418.7' r='0.9' fill='%23fff' fill-opacity='0.56'/%3E%3Ccircle cx='293.9' cy='260.5' r='0.7' fill='%23fff' fill-opacity='0.78'/%3E%3Cpath d='M61.0 150.12l0.8064000000000001 2.0736000000000003l2.0736000000000003 0.8064000000000001l-2.0736000000000003 0.8064000000000001l-0.8064000000000001 2.0736000000000003l-0.8064000000000001 -2.0736000000000003l-2.0736000000000003 -0.8064000000000001Z' fill='%23fff' fill-opacity='0.77'/%3E%3Ccircle cx='172.5' cy='46.5' r='0.6' fill='%23fff' fill-opacity='0.61'/%3E%3Ccircle cx='477.5' cy='86.7' r='1.1' fill='%23fff' fill-opacity='0.45'/%3E%3Ccircle cx='91.7' cy='296.1' r='0.6' fill='%23fff' fill-opacity='0.57'/%3E%3Ccircle cx='0.3' cy='397.6' r='1.6' fill='%23fff' fill-opacity='0.68'/%3E%3Ccircle cx='13.7' cy='86.2' r='1.6' fill='%23fff' fill-opacity='0.68'/%3E%3Ccircle cx='29.5' cy='67.3' r='0.9' fill='%23fff' fill-opacity='0.49'/%3E%3Ccircle cx='230.3' cy='136.3' r='0.6' fill='%23fff' fill-opacity='0.39'/%3E%3Ccircle cx='445.6' cy='7.1' r='0.8' fill='%23fff' fill-opacity='0.55'/%3E%3Ccircle cx='671.4' cy='222.5' r='1.1' fill='%23fff' fill-opacity='0.42'/%3E%3Ccircle cx='439.1' cy='143.0' r='0.7' fill='%23fff' fill-opacity='0.8'/%3E%3Ccircle cx='132.9' cy='340.1' r='1.1' fill='%23fff' fill-opacity='0.46'/%3E%3Cpath d='M617.5 274.72l0.8064000000000001 2.0736000000000003l2.0736000000000003 0.8064000000000001l-2.0736000000000003 0.8064000000000001l-0.8064000000000001 2.0736000000000003l-0.8064000000000001 -2.0736000000000003l-2.0736000000000003 -0.8064000000000001Z' fill='%23fff' fill-opacity='0.38'/%3E%3Ccircle cx='358.6' cy='117.4' r='1.3' fill='%23fff' fill-opacity='0.74'/%3E%3Ccircle cx='576.6' cy='274.4' r='0.8' fill='%23fff' fill-opacity='0.64'/%3E%3Ccircle cx='684.0' cy='58.1' r='0.9' fill='%23fff' fill-opacity='0.66'/%3E%3Cpath d='M430.0 126.66000000000001l0.6272 1.6127999999999998l1.6127999999999998 0.6272l-1.6127999999999998 0.6272l-0.6272 1.6127999999999998l-0.6272 -1.6127999999999998l-1.6127999999999998 -0.6272Z' fill='%23fff' fill-opacity='0.76'/%3E%3Ccircle cx='288.0' cy='114.6' r='0.6' fill='%23fff' fill-opacity='0.45'/%3E%3Ccircle cx='400.5' cy='60.5' r='0.8' fill='%23fff' fill-opacity='0.43'/%3E%3Ccircle cx='231.7' cy='337.1' r='1.1' fill='%23fff' fill-opacity='0.67'/%3E%3Ccircle cx='24.6' cy='8.2' r='0.8' fill='%23fff' fill-opacity='0.74'/%3E%3Ccircle cx='14.9' cy='292.6' r='0.9' fill='%23fff' fill-opacity='0.39'/%3E%3Ccircle cx='95.6' cy='33.3' r='0.9' fill='%23fff' fill-opacity='0.65'/%3E%3Ccircle cx='630.1' cy='339.1' r='1.3' fill='%23fff' fill-opacity='0.42'/%3E%3Ccircle cx='239.1' cy='39.1' r='0.9' fill='%23fff' fill-opacity='0.85'/%3E%3Cpath d='M292.0 358.48l1.4336000000000004 3.686400000000001l3.686400000000001 1.4336000000000004l-3.686400000000001 1.4336000000000004l-1.4336000000000004 3.686400000000001l-1.4336000000000004 -3.686400000000001l-3.686400000000001 -1.4336000000000004Z' fill='%23fff' fill-opacity='0.62'/%3E%3Cpath d='M463.6 172.48000000000002l0.5376000000000001 1.3823999999999999l1.3823999999999999 0.5376000000000001l-1.3823999999999999 0.5376000000000001l-0.5376000000000001 1.3823999999999999l-0.5376000000000001 -1.3823999999999999l-1.3823999999999999 -0.5376000000000001Z' fill='%23fff' fill-opacity='0.68'/%3E%3Ccircle cx='447.6' cy='456.9' r='0.9' fill='%23fff' fill-opacity='0.75'/%3E%3Ccircle cx='514.5' cy='267.2' r='0.9' fill='%23fff' fill-opacity='0.6'/%3E%3Ccircle cx='363.1' cy='236.7' r='0.8' fill='%23fff' fill-opacity='0.68'/%3E%3Ccircle cx='161.2' cy='321.2' r='0.9' fill='%23fff' fill-opacity='0.78'/%3E%3Ccircle cx='340.4' cy='412.4' r='0.8' fill='%23fff' fill-opacity='0.52'/%3E%3Ccircle cx='141.8' cy='78.0' r='0.8' fill='%23fff' fill-opacity='0.71'/%3E%3C/svg%3E", "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='560'%3E%3Cpath d='M493.3 188.57999999999998l1.4336000000000004 3.686400000000001l3.686400000000001 1.4336000000000004l-3.686400000000001 1.4336000000000004l-1.4336000000000004 3.686400000000001l-1.4336000000000004 -3.686400000000001l-3.686400000000001 -1.4336000000000004Z' fill='%23fff' fill-opacity='0.68'/%3E%3Cpath d='M834.5 218.08l0.5376000000000001 1.3823999999999999l1.3823999999999999 0.5376000000000001l-1.3823999999999999 0.5376000000000001l-0.5376000000000001 1.3823999999999999l-0.5376000000000001 -1.3823999999999999l-1.3823999999999999 -0.5376000000000001Z' fill='%23fff' fill-opacity='0.89'/%3E%3Ccircle cx='400.2' cy='125.9' r='0.8' fill='%23fff' fill-opacity='0.4'/%3E%3Ccircle cx='825.7' cy='303.7' r='1.6' fill='%23fff' fill-opacity='0.75'/%3E%3Ccircle cx='153.4' cy='243.0' r='0.9' fill='%23fff' fill-opacity='0.72'/%3E%3Ccircle cx='471.1' cy='304.4' r='0.9' fill='%23fff' fill-opacity='0.51'/%3E%3Ccircle cx='197.9' cy='230.0' r='1.6' fill='%23fff' fill-opacity='0.61'/%3E%3Ccircle cx='276.4' cy='167.6' r='1.3' fill='%23fff' fill-opacity='0.7'/%3E%3Ccircle cx='556.2' cy='435.3' r='0.6' fill='%23fff' fill-opacity='0.75'/%3E%3Cpath d='M771.7 143.74l1.1648 2.9952l2.9952 1.1648l-2.9952 1.1648l-1.1648 2.9952l-1.1648 -2.9952l-2.9952 -1.1648Z' fill='%23fff' fill-opacity='0.54'/%3E%3Ccircle cx='358.1' cy='232.4' r='1.3' fill='%23fff' fill-opacity='0.58'/%3E%3Ccircle cx='555.7' cy='87.2' r='1.3' fill='%23fff' fill-opacity='0.83'/%3E%3Ccircle cx='870.6' cy='411.2' r='1.3' fill='%23fff' fill-opacity='0.46'/%3E%3Ccircle cx='875.1' cy='12.3' r='0.9' fill='%23fff' fill-opacity='0.85'/%3E%3Ccircle cx='135.7' cy='512.9' r='1.6' fill='%23fff' fill-opacity='0.83'/%3E%3Ccircle cx='683.8' cy='172.4' r='0.6' fill='%23fff' fill-opacity='0.87'/%3E%3Ccircle cx='52.7' cy='21.6' r='1.6' fill='%23fff' fill-opacity='0.35'/%3E%3Ccircle cx='404.2' cy='129.1' r='0.6' fill='%23fff' fill-opacity='0.75'/%3E%3Cpath d='M20.1 105.04l1.1648 2.9952l2.9952 1.1648l-2.9952 1.1648l-1.1648 2.9952l-1.1648 -2.9952l-2.9952 -1.1648Z' fill='%23fff' fill-opacity='0.44'/%3E%3Ccircle cx='705.2' cy='484.8' r='0.7' fill='%23fff' fill-opacity='0.46'/%3E%3Ccircle cx='479.1' cy='528.3' r='0.7' fill='%23fff' fill-opacity='0.83'/%3E%3Ccircle cx='559.0' cy='444.6' r='1.1' fill='%23fff' fill-opacity='0.49'/%3E%3Ccircle cx='373.3' cy='544.4' r='0.8' fill='%23fff' fill-opacity='0.58'/%3E%3Ccircle cx='147.0' cy='228.2' r='0.6' fill='%23fff' fill-opacity='0.59'/%3E%3Ccircle cx='450.0' cy='501.2' r='1.3' fill='%23fff' fill-opacity='0.53'/%3E%3Ccircle cx='153.3' cy='347.7' r='0.9' fill='%23fff' fill-opacity='0.71'/%3E%3Ccircle cx='292.4' cy='526.5' r='0.6' fill='%23fff' fill-opacity='0.59'/%3E%3Ccircle cx='210.7' cy='515.9' r='0.7' fill='%23fff' fill-opacity='0.83'/%3E%3Ccircle cx='305.8' cy='98.5' r='1.3' fill='%23fff' fill-opacity='0.6'/%3E%3Cpath d='M829.3 402.53999999999996l1.1648 2.9952l2.9952 1.1648l-2.9952 1.1648l-1.1648 2.9952l-1.1648 -2.9952l-2.9952 -1.1648Z' fill='%23fff' fill-opacity='0.52'/%3E%3C/svg%3E"];

/** The three sky colours at a fractional hour of the day, and where the sun or the moon is:
    a faint glow that rises in the east and sets in the west, so the hour reads even when the
    colours are this quiet. */
export function skyAt(hour, deep = 0.2) {
  const h = ((hour % 24) + 24) % 24;
  let i = 0;
  while (i < HOURS.length - 2 && HOURS[i + 1][0] <= h) i += 1;
  const a = HOURS[i];
  const b = HOURS[i + 1];
  const t = (h - a[0]) / (b[0] - a[0]);
  const day = h >= 5.5 && h <= 19;
  const p = day ? (h - 5.5) / 13.5 : (((h + 24 - 19) % 24) / 10.5);
  const arc = Math.sin(Math.PI * Math.min(1, Math.max(0, p)));
  const night = nightAt(h);
  const f = FADE - deep * (night / 0.72);
  return {
    night: night.toFixed(3),
    top: mix3(a[1], b[1], t, f),
    mid: mix3(a[2], b[2], t, f),
    bot: mix3(a[3], b[3], t, f),
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
export function useClock() {
  const read = () => {
    const d = new Date();
    return d.getHours() + d.getMinutes() / 60;
  };
  const [now, setNow] = useState(read);
  useEffect(() => {
    setNow(read());
    const t = window.setInterval(() => setNow(read()), 60000);
    return () => window.clearInterval(t);
  }, []);
  return now;
}

export function useSky(ref, hour, deep = 0.2) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let ticking = false;

    const apply = (p) => {
      const c = skyAt(hour + p * DRIFT, deep);
      el.style.setProperty('--night', c.night);
      el.style.setProperty('--sky-top', c.top);
      el.style.setProperty('--sky-mid', c.mid);
      el.style.setProperty('--sky-bot', c.bot);
      el.style.setProperty('--sun-x', c.sunX);
      el.style.setProperty('--sun-y', c.sunY);
      el.style.setProperty('--sun-a', c.sunA);
      el.style.setProperty('--sun-c', c.sunC);
    };

    // the drift is applied in 48 steps down the page, so a scroll repaints the sky a few times
    // on the way down rather than at every frame — a change of colour is a full-screen paint
    let step = -1;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        const s = Math.round(p * 48);
        if (s !== step) {
          step = s;
          apply(s / 48);
        }
        ticking = false;
      });
    };

    apply(0);
    step = 0;
    // and once more on a timeout, so the first paint is right even if rAF never runs
    const settle = window.setTimeout(onScroll, 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.clearTimeout(settle);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [ref, hour, deep]);
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
