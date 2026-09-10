// Variant 6 — the sky. A single-scattering atmosphere (Rayleigh + Mie), solved on a coarse grid and
// scaled up, so the day is computed rather than cross-faded. This is Vantage's engine, kept to the
// daylight hours only and lifted toward pastel so it never competes with the words. Scroll is the
// only clock. Three ridges of seeded value noise sit at the bottom; the light tints them.
//
// It also lets the light into the page: it reports the zenith, horizon and sun colours so the rail,
// headings and accents can take their colour from the sky that is actually behind them.
import React, { useEffect, useRef } from 'react';

const GW = 84;
const GH = 132;
const bR = [0.009, 0.0212, 0.053]; // Rayleigh, ∝ 1/λ⁴
const bM = [0.0122 * 0.3, 0.0112 * 0.3, 0.0102 * 0.3]; // Mie, nearly grey, forward-throwing, kept thin
const G = 0.7;
const HORIZON = 0.66;
const FOV_V = 0.62;
const FOV_H = 2.6; // wide, so the glare around the sun stays a glare and not the whole sky

// the sun's day, as a function of scroll: up at the top, high in the middle, on the horizon at the end
const EL_TRACK = [[0, 15], [0.16, 24], [0.36, 40], [0.5, 47], [0.64, 36], [0.82, 15], [0.94, 3.5], [1, -0.8]];
const AZ_TRACK = [[0, 0.4], [0.5, 0.6], [1, 0.9]];

function smooth(a, b, x) {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}
function lerp(a, b, t) {
  return a + (b - a) * t;
}
function track(keys, t) {
  for (let i = 0; i < keys.length - 1; i += 1) {
    const [t0, v0] = keys[i];
    const [t1, v1] = keys[i + 1];
    if (t <= t1) return lerp(v0, v1, smooth(t0, t1, t));
  }
  return keys[keys.length - 1][1];
}
function airmass(elRad) {
  const s = Math.sin(elRad);
  const d = (elRad * 180) / Math.PI;
  return 1 / (Math.max(s, 0) + 0.15 * Math.pow(Math.max(d, -2.6) + 3.885, -1.253));
}
function rnd(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
function ridgeProfile(seed, octaves) {
  const r = rnd(seed);
  const N = 240;
  const layers = [];
  for (let o = 0; o < octaves; o += 1) {
    const pts = 3 + o * o * 2 + o * 3;
    const arr = [];
    for (let i = 0; i <= pts; i += 1) arr.push(r());
    layers.push(arr);
  }
  const out = new Array(N);
  for (let i = 0; i < N; i += 1) {
    const x = i / (N - 1);
    let v = 0;
    let amp = 1;
    let tot = 0;
    for (let o = 0; o < octaves; o += 1) {
      const arr = layers[o];
      const p = x * (arr.length - 1);
      const i0 = Math.floor(p);
      const f = p - i0;
      const a = arr[i0];
      const b = arr[Math.min(arr.length - 1, i0 + 1)];
      const s = f * f * (3 - 2 * f);
      v += (a + (b - a) * s) * amp;
      tot += amp;
      amp *= 0.46;
    }
    out[i] = v / tot;
  }
  return out;
}
const RIDGES = [
  { p: ridgeProfile(9137, 4), base: 0.02, amp: 0.1, haze: 0.82, seat: 0.0 },
  { p: ridgeProfile(4421, 5), base: -0.01, amp: 0.08, haze: 0.6, seat: 0.1 },
  { p: ridgeProfile(7788, 5), base: -0.05, amp: 0.09, haze: 0.36, seat: 0.22 },
];

function hex(r, g, b) {
  const f = (v) => `0${Math.max(0, Math.min(255, Math.round(v * 255))).toString(16)}`.slice(-2);
  return `#${f(r)}${f(g)}${f(b)}`;
}
function lum(c) {
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
// scale a colour to a target luminance, keeping its hue
function toLum(c, target) {
  const l = Math.max(lum(c), 0.02);
  return c.map((v) => Math.min(1, (v * target) / l));
}

/**
 * Solves and paints the sky for a scroll fraction t. Returns the colours the page should borrow.
 */
function makeEngine(canvas) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const low = document.createElement('canvas');
  low.width = GW;
  low.height = GH;
  const lctx = low.getContext('2d');
  const field = lctx.createImageData(GW, GH);
  let W = 0;
  let H = 0;

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }

  function solve(t) {
    const elDeg = track(EL_TRACK, t);
    const el = (elDeg * Math.PI) / 180;
    const sunX = track(AZ_TRACK, t);
    // the eye adapts: a low sun gets more exposure, so morning and evening stay light
    const E = 9 * (1 + 1.3 * (1 - smooth(-2, 30, elDeg)));
    const dusk = 1 - smooth(0, 14, elDeg); // warms the grade as the sun gets low
    let ms = airmass(Math.max(el, 0));
    if (elDeg < 0) ms += -elDeg * 5.4;
    const Ts = [0, 1, 2].map((i) => Math.exp(-(bR[i] + bM[i] * 0.62) * ms));
    const d = field.data;
    const sS = Math.sin(el);
    const sC = Math.cos(el);
    for (let gy = 0; gy < GH; gy += 1) {
      const yn = (gy + 0.5) / GH;
      const phi = (HORIZON - yn) * FOV_V;
      const mv = airmass(Math.max(phi, 0.0016));
      const pS = Math.sin(Math.max(phi, 0));
      const pC = Math.cos(Math.max(phi, 0));
      for (let gx = 0; gx < GW; gx += 1) {
        const xn = (gx + 0.5) / GW;
        const dAz = (xn - sunX) * FOV_H;
        const cosG = pS * sS + pC * sC * Math.cos(dAz);
        const pR = 0.0596831 * (1 + cosG * cosG);
        const den = 1 + G * G - 2 * G * cosG;
        const pM = (0.0795775 * (1 - G * G)) / Math.max(den * Math.sqrt(den), 1e-4);
        const o = (gy * GW + gx) * 4;
        const v = [0, 0, 0];
        for (let i = 0; i < 3; i += 1) {
          const bt = bR[i] + bM[i];
          const depth = (1 - Math.exp(-bt * mv)) / bt;
          const L = Ts[i] * (bR[i] * pR + bM[i] * pM) * depth;
          let c = 1 - Math.exp(-E * L);
          c = Math.pow(Math.max(c, 0), 1 / 2.2);
          v[i] = c;
        }
        // the grade: more colour than the physics gives at this exposure, then lifted to pastel
        const m = (v[0] + v[1] + v[2]) / 3;
        for (let i = 0; i < 3; i += 1) {
          let c = m + (v[i] - m) * 2.4;
          c = Math.min(1, Math.max(0, c));
          c = lerp(c, 1, 0.52);
          if (i === 0) c += 0.09 * dusk;
          if (i === 1) c -= 0.02 * dusk;
          if (i === 2) c += 0.07 * dusk * (1 - yn);
          c = c * 255 + (Math.random() - 0.5) * 1.4;
          d[o + i] = c < 0 ? 0 : c > 255 ? 255 : c;
        }
        d[o + 3] = 255;
      }
    }
    lctx.putImageData(field, 0, 0);
    const hRow = Math.min(GH - 1, Math.round(HORIZON * GH) - 1);
    const readAt = (xn, row) => {
      const gx = Math.min(GW - 1, Math.max(0, Math.round(xn * GW)));
      const o = (row * GW + gx) * 4;
      return [d[o] / 255, d[o + 1] / 255, d[o + 2] / 255];
    };
    return { elDeg, el, sunX, Ts, readAt, hRow };
  }

  function paint(t) {
    if (!W) resize();
    const sky = solve(t);
    ctx.drawImage(low, 0, 0, GW, GH, 0, 0, W, H + 1);

    // the sun itself: a soft disc, only where the air is thin enough to see it
    const sunYn = HORIZON - sky.el / FOV_V;
    const sx = sky.sunX * W;
    const sy = sunYn * H;
    const mx = Math.max(sky.Ts[0], sky.Ts[1], sky.Ts[2]) || 1;
    const warm = sky.Ts.map((v) => v / mx);
    const r = Math.max(26, Math.min(W, H) * 0.045);
    const g = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 3.2);
    g.addColorStop(0, `rgba(${warm.map((v) => Math.round(lerp(v, 1, 0.75) * 255)).join(',')},0.95)`);
    g.addColorStop(0.28, `rgba(${warm.map((v) => Math.round(lerp(v, 1, 0.55) * 255)).join(',')},0.55)`);
    g.addColorStop(1, `rgba(${warm.map((v) => Math.round(lerp(v, 1, 0.4) * 255)).join(',')},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(sx - r * 3.2, sy - r * 3.2, r * 6.4, r * 6.4);

    // ridges, tinted by the horizon behind them
    const hy = H * HORIZON;
    const horiz = sky.readAt(0.5, sky.hRow);
    const rock = [0.36, 0.33, 0.36];
    for (let i = 0; i < RIDGES.length; i += 1) {
      const R = RIDGES[i];
      const P = R.p;
      const n = P.length;
      const drift = t * (10 + i * 30);
      const scaleY = H * (0.5 + 0.2 * i);
      ctx.beginPath();
      ctx.moveTo(0, H + 2);
      for (let k = 0; k < n; k += 1) {
        const x = (k / (n - 1)) * W;
        const y = hy + R.base * H * 0.3 + R.seat * H * 0.2 + H * 0.16 - (P[k] - 0.5) * R.amp * scaleY * 0.6 + drift;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H + 2);
      ctx.closePath();
      const col = [0, 1, 2].map((c) => lerp(rock[c], horiz[c] * 0.96, R.haze));
      ctx.fillStyle = hex(col[0], col[1], col[2]);
      ctx.fill();
    }

    // colours for the page
    const zenith = sky.readAt(0.5, 4);
    const railBg = [0, 1, 2].map((c) => lerp(toLum(zenith, 0.17)[c], [0.1, 0.12, 0.24][c], 0.35));
    const accentInk = toLum(warm.map((v) => lerp(v, 0.55, 0.25)), 0.16);
    const accent = toLum(warm, 0.62);
    return {
      t,
      elDeg: sky.elDeg,
      sunX: sky.sunX,
      zenith: hex(...zenith),
      horizon: hex(...horiz),
      sun: hex(...warm.map((v) => lerp(v, 1, 0.3))),
      railBg: hex(...railBg),
      accentInk: hex(...accentInk),
      accent: hex(...accent),
    };
  }

  return { resize, paint };
}

export default function Atmosphere({ t, onLight }) {
  const ref = useRef(null);
  const engine = useRef(null);
  const shown = useRef(-1);

  useEffect(() => {
    if (!ref.current) return undefined;
    engine.current = makeEngine(ref.current);
    const onResize = () => {
      engine.current.resize();
      shown.current = -1;
      const light = engine.current.paint(shown.current < 0 ? t : shown.current);
      if (onLight) onLight(light);
    };
    engine.current.resize();
    shown.current = t;
    const first = engine.current.paint(t);
    if (onLight) onLight(first);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!engine.current) return;
    if (Math.abs(t - shown.current) < 0.0008) return;
    shown.current = t;
    const light = engine.current.paint(t);
    if (onLight) onLight(light);
  }, [t, onLight]);

  return <canvas className="v6-sky" ref={ref} aria-hidden="true" />;
}
