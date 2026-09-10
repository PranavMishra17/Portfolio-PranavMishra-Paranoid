// Variant 1 — the sky. One day, driven by scroll position only. Four gradient stops at Weather's
// volume: a slight shift you notice only when you look back up. The sun is the only moving object.
import React from 'react';

const STOPS = [
  { top: [204, 223, 238], mid: [234, 240, 243], bot: [246, 242, 232], sun: [255, 250, 234] }, // early morning
  { top: [196, 219, 236], mid: [230, 238, 237], bot: [244, 239, 224], sun: [255, 252, 238] }, // late morning
  { top: [205, 218, 228], mid: [236, 233, 222], bot: [245, 226, 197], sun: [255, 244, 212] }, // afternoon
  { top: [213, 195, 200], mid: [238, 205, 176], bot: [232, 176, 130], sun: [255, 212, 156] }, // sunset
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function mix(key, t) {
  const n = STOPS.length - 1;
  const s = Math.min(Math.max(t, 0), 0.9999) * n;
  const i = Math.floor(s);
  const f = s - i;
  const a = STOPS[i][key];
  const b = STOPS[Math.min(i + 1, n)][key];
  return `rgb(${Math.round(lerp(a[0], b[0], f))}, ${Math.round(lerp(a[1], b[1], f))}, ${Math.round(lerp(a[2], b[2], f))})`;
}

export default function Sky({ t = 0 }) {
  const top = mix('top', t);
  const mid = mix('mid', t);
  const bot = mix('bot', t);
  const sun = mix('sun', t);
  // The sun rises on the left, crests just past the middle, and sets on the right.
  const sunX = 30 + t * 52;
  const sunY = 60 - Math.sin(t * Math.PI) * 50;
  // A low ridge appears as the day goes on, so the last screen has somewhere to stand.
  const ridgeOpacity = Math.max(0, (t - 0.35) / 0.65) * 0.42;

  return (
    <div
      className="v1-sky"
      aria-hidden="true"
      style={{ backgroundImage: `linear-gradient(180deg, ${top} 0%, ${mid} 48%, ${bot} 100%)` }}
    >
      <div
        className="v1-sun"
        style={{
          left: `${sunX}%`,
          top: `${sunY}%`,
          background: sun,
          boxShadow: `0 0 70px 30px ${sun.replace('rgb(', 'rgba(').replace(')', ', 0.55)')}`,
        }}
      />
      <svg className="v1-ridge" viewBox="0 0 1440 160" preserveAspectRatio="none" style={{ opacity: ridgeOpacity }}>
        <path
          d="M0 118 C 120 110, 200 96, 320 104 S 520 130, 640 112 S 860 84, 980 100 S 1200 126, 1320 108 L1440 112 L1440 160 L0 160 Z"
          fill="#6f5f52"
        />
      </svg>
    </div>
  );
}

// Small sky for the room's window: sunrise of the next day, sun just up.
export function WindowSky({ className = '' }) {
  return (
    <div
      className={`v1-window-sky ${className}`}
      aria-hidden="true"
      style={{ backgroundImage: 'linear-gradient(180deg, rgb(198,214,232) 0%, rgb(240,232,222) 55%, rgb(247,214,176) 100%)' }}
    >
      <div className="v1-window-sun" />
    </div>
  );
}
