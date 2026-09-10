// Variant 4 — the sky. One gradient, four gentle keyframes, driven by the day
// scalar p (0 = morning, 1 = sunset). The sun is a soft glow that rises and
// sets along an arc; the only hard sun disc on the page is in the room's window.
import React from "react";

const STOPS = [
  { at: 0.0, top: [200, 222, 240], mid: [232, 238, 240], bot: [244, 240, 232], sun: [255, 250, 235] },
  { at: 0.35, top: [188, 213, 236], mid: [226, 234, 236], bot: [242, 236, 226], sun: [255, 248, 225] },
  { at: 0.7, top: [206, 204, 222], mid: [236, 218, 204], bot: [244, 220, 192], sun: [255, 228, 190] },
  { at: 1.0, top: [196, 178, 202], mid: [230, 186, 166], bot: [240, 178, 130], sun: [255, 200, 150] },
];

const lerp = (a, b, t) => a + (b - a) * t;
const mix = (a, b, t) => a.map((v, i) => Math.round(lerp(v, b[i], t)));
const smooth = (t) => t * t * (3 - 2 * t);

export function skyAt(p) {
  const t = Math.min(1, Math.max(0, p));
  let i = 0;
  while (i < STOPS.length - 2 && t > STOPS[i + 1].at) i++;
  const a = STOPS[i];
  const b = STOPS[i + 1];
  const k = smooth((t - a.at) / (b.at - a.at));
  return {
    top: mix(a.top, b.top, k),
    mid: mix(a.mid, b.mid, k),
    bot: mix(a.bot, b.bot, k),
    sun: mix(a.sun, b.sun, k),
    x: 0.18 + 0.64 * t,
    y: 0.68 - 0.6 * Math.sin(Math.PI * t),
  };
}

export const rgb = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;

export default function Sky({ p }) {
  const s = skyAt(p);
  return (
    <div
      className="v4-sky"
      aria-hidden="true"
      style={{ background: `linear-gradient(180deg, ${rgb(s.top)} 0%, ${rgb(s.mid)} 48%, ${rgb(s.bot)} 100%)` }}
    >
      <div
        className="v4-sun"
        style={{
          left: `${s.x * 100}%`,
          top: `${s.y * 100}%`,
          background: `radial-gradient(closest-side, rgba(${s.sun.join(",")},.72), rgba(${s.sun.join(",")},0))`,
        }}
      />
    </div>
  );
}
