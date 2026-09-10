// Variant 3 — the day. One function of scroll position, t in [0, 1], that yields
// the sky, the sun, the ridge tint and the paper tint. Everything visual reads
// from the CSS variables this writes; nothing else animates on its own.
import { useEffect } from 'react';

const hex = (s) => [parseInt(s.slice(1, 3), 16), parseInt(s.slice(3, 5), 16), parseInt(s.slice(5, 7), 16)];
const rgb = (c) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
const lerp = (a, b, t) => a + (b - a) * t;
const mix = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };

// Weather's intensity, Vantage's arc: morning → noon → afternoon → golden → sunset.
const KEYS = [
  { t: 0.0, top: '#cfe0ee', mid: '#e6eef2', bot: '#f3efe6' },
  { t: 0.3, top: '#c6dcec', mid: '#e2ecef', bot: '#f1ece2' },
  { t: 0.55, top: '#d3d8e2', mid: '#e9dfd3', bot: '#f2dcc5' },
  { t: 0.8, top: '#d7cbd3', mid: '#ecd3bf', bot: '#f1c39c' },
  { t: 1.0, top: '#c9b8c9', mid: '#e9bfa6', bot: '#efb489' },
].map((k) => ({ t: k.t, top: hex(k.top), mid: hex(k.mid), bot: hex(k.bot) }));

// The next morning, as seen through the room's window. Sun low and visible.
export const SUNRISE = { top: '#b9c9dc', mid: '#efd6bb', bot: '#f6c48f', sun: '#fff0c2' };

export function skyAt(t) {
  t = clamp(t);
  let i = 0;
  while (i < KEYS.length - 2 && t > KEYS[i + 1].t) i += 1;
  const a = KEYS[i];
  const b = KEYS[i + 1];
  const f = smooth(a.t, b.t, t);
  return { top: mix(a.top, b.top, f), mid: mix(a.mid, b.mid, f), bot: mix(a.bot, b.bot, f) };
}

// Sun position in the viewport, as percentages. Rises from the left, sets on the right.
export function sunAt(t) {
  t = clamp(t);
  const x = 14 + t * 72;
  const peak = 0.4;
  const y = t < peak ? 10 + 52 * Math.pow((peak - t) / peak, 2) : 10 + 58 * Math.pow((t - peak) / (1 - peak), 2);
  return { x, y };
}

export function hourAt(t) {
  const h = 6.6 + clamp(t) * (19.2 - 6.6);
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

const PAPER = hex('#fffdf9');
const RIDGE_FAR = [hex('#a9bccb'), hex('#8d6f7c')];
const RIDGE_NEAR = [hex('#8fa6b8'), hex('#6d5361')];
const GLOW = [hex('#fff6dc'), hex('#ffd2a0')];

export function applyDay(root, t) {
  const s = skyAt(t);
  const sun = sunAt(t);
  const st = root.style;
  st.setProperty('--t', t.toFixed(4));
  st.setProperty('--sky-top', rgb(s.top));
  st.setProperty('--sky-mid', rgb(s.mid));
  st.setProperty('--sky-bot', rgb(s.bot));
  st.setProperty('--sun-x', `${sun.x.toFixed(2)}%`);
  st.setProperty('--sun-y', `${sun.y.toFixed(2)}%`);
  st.setProperty('--sun-glow', rgb(mix(GLOW[0], GLOW[1], smooth(0.45, 1, t))));
  st.setProperty('--sun-o', (0.55 + 0.3 * smooth(0.5, 1, t)).toFixed(3));
  st.setProperty('--paper', rgb(mix(PAPER, s.bot, 0.14)));
  const ro = smooth(0.12, 0.5, t);
  st.setProperty('--ridge-far', rgb(mix(RIDGE_FAR[0], RIDGE_FAR[1], t)));
  st.setProperty('--ridge-near', rgb(mix(RIDGE_NEAR[0], RIDGE_NEAR[1], t)));
  st.setProperty('--ridge-o', (ro * 0.34).toFixed(3));
  const clock = root.querySelector('[data-v3-clock]');
  if (clock) clock.textContent = hourAt(t);
}

// Drives the day from scroll, reports the active section, and measures where
// each section sits along the day so the rail can place its stations honestly.
export function useDay(rootRef, sectionRefs, onActive, onStations) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    let queued = false;
    let lastT = -1;
    let lastActive = -1;
    let lastKey = '';

    const paint = () => {
      queued = false;
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const y = window.scrollY || doc.scrollTop || 0;
      const t = max > 0 ? clamp(y / max) : 0;
      if (Math.abs(t - lastT) > 0.0004) {
        lastT = t;
        applyDay(root, t);
      }
      const probe = y + window.innerHeight * 0.38;
      let idx = 0;
      const fr = [];
      sectionRefs.forEach((r, i) => {
        const el = r.current;
        if (!el) return;
        const top = el.getBoundingClientRect().top + y;
        if (top <= probe) idx = i;
        fr.push(max > 0 ? clamp(top / max) : 0);
      });
      if (t >= 0.985 && fr.length) idx = fr.length - 1; // at the very bottom, the room is where you are
      if (idx !== lastActive) { lastActive = idx; onActive(idx); }
      const key = fr.map((v) => v.toFixed(3)).join(',');
      if (key !== lastKey) { lastKey = key; onStations(fr); }
    };
    const request = () => { if (!queued) { queued = true; window.requestAnimationFrame(paint); } };

    applyDay(root, 0);
    paint();
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(request);
      ro.observe(document.body);
    }
    return () => {
      window.removeEventListener('scroll', request);
      window.removeEventListener('resize', request);
      if (ro) ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
