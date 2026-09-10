// Variant 4 — the day scalar. Scroll position is mapped piecewise through the
// four section tops so that the sun in the rail lines up with the section
// labels exactly, and the sky and the hour read from the same number.
import { useEffect, useState } from "react";

export const SECTIONS = [
  { id: "v4-arrival", label: "Arrival", hour: 7.17 },
  { id: "v4-work", label: "The work", hour: 12.0 },
  { id: "v4-built", label: "Built and written", hour: 16.67 },
  { id: "v4-room", label: "The room", hour: 19.5 },
];
// Where each label sits along the rail line (fraction of its height).
export const KEYS = [0, 0.27, 0.54, 0.81];
const END_HOUR = 20.4; // where the sun is when the page bottom is reached

export function formatHour(h) {
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${hh}:${mm < 10 ? "0" : ""}${mm}`;
}

export default function useDay() {
  const [day, setDay] = useState({ p: 0, active: 0, hour: SECTIONS[0].hour });

  useEffect(() => {
    let raf = 0;
    let points = [];
    let max = 1;

    const measure = () => {
      const vh = window.innerHeight;
      points = SECTIONS.map((s, i) => {
        const el = document.getElementById(s.id);
        const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
        return i === 0 ? 0 : Math.max(0, top - vh * 0.3);
      });
      max = Math.max(1, document.documentElement.scrollHeight - vh);
      points.push(max);
    };

    const compute = () => {
      raf = 0;
      const y = Math.min(max, Math.max(0, window.scrollY));
      const keys = KEYS.concat([1]);
      const hours = SECTIONS.map((s) => s.hour).concat([END_HOUR]);
      let i = 0;
      while (i < points.length - 2 && y >= points[i + 1]) i++;
      const span = Math.max(1, points[i + 1] - points[i]);
      const local = Math.min(1, Math.max(0, (y - points[i]) / span));
      const p = keys[i] + (keys[i + 1] - keys[i]) * local;
      const hour = hours[i] + (hours[i + 1] - hours[i]) * local;
      const active = Math.min(SECTIONS.length - 1, i);
      setDay((d) => (Math.abs(d.p - p) < 0.0005 && d.active === active ? d : { p, active, hour }));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(onResize) : null;
    if (ro) ro.observe(document.documentElement);
    const t = setTimeout(onResize, 400);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (ro) ro.disconnect();
      clearTimeout(t);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return day;
}
