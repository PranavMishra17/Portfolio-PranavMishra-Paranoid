// Variant 3 — the room. Flat, drawn straight on, in SVG. Every object is a
// focusable hotspot. Hover names it in the caption strip; click opens it.
// The window is the sky system again, one morning later.
import React from 'react';
import { SUNRISE } from './sky';
import { featured } from './content';
import { films, books, games, magnets } from './personal';

export const HOTSPOTS = {
  window: { label: 'The window', opens: 'tomorrow’s sunrise' },
  posters: { label: 'Film posters', opens: 'four favourites, and why (sample titles)' },
  screen: { label: 'Wall screen', opens: 'projects', dup: true },
  games: { label: 'Games shelf', opens: 'what I play (sample titles)' },
  magnets: { label: 'Fridge magnets', opens: 'a memory behind each' },
  trophies: { label: 'Trophies', opens: 'MIT XR 2024, HINT 5.0' },
  books: { label: 'Bookshelf', opens: 'reading now, recently finished' },
  monitorA: { label: 'Left monitor', opens: 'work history', dup: true },
  monitorB: { label: 'Right monitor', opens: 'the three papers', dup: true },
  laptop: { label: 'Laptop', opens: 'about me', dup: true },
  photo: { label: 'Family photo', opens: 'where I come from' },
  football: { label: 'Football and boots', opens: 'I used to play' },
};

function Hotspot({ id, box, onOpen, onHover, children }) {
  const meta = HOTSPOTS[id];
  const [x, y, w, h] = box;
  const open = () => onOpen(id);
  return (
    <g
      className="v3-hs"
      tabIndex={0}
      role="button"
      aria-label={`${meta.label}: ${meta.opens}`}
      onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(id)}
      onBlur={() => onHover(null)}
    >
      <title>{meta.label}</title>
      <rect className="v3-hs-ring" x={x - 8} y={y - 8} width={w + 16} height={h + 16} rx={8} />
      {children}
      <rect className="v3-hs-hit" x={x - 6} y={y - 6} width={w + 12} height={h + 12} />
    </g>
  );
}

const WOOD = '#a98a66';
const WOOD_DARK = '#7d6449';
const INK = '#2b3138';

export default function Room({ compact, onOpen, onHover }) {
  const shelfTop = [...books.reading, ...books.finished].slice(0, 7);
  const shelfBottom = [...books.finished].slice(2).concat(books.reading).slice(0, 6);
  const spinesTop = layoutSpines(shelfTop, 88, 322, 232, 425);
  const spinesBottom = layoutSpines(shelfBottom, 88, 322, 232, 512);

  return (
    <svg className="v3-room" viewBox="0 0 1200 660" role="group" aria-label="My room, from my bachelor days. Everything in it opens something.">
      <defs>
        <linearGradient id="v3-sunrise" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={SUNRISE.top} />
          <stop offset="0.55" stopColor={SUNRISE.mid} />
          <stop offset="1" stopColor={SUNRISE.bot} />
        </linearGradient>
        <radialGradient id="v3-sunglow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff4d0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#fff4d0" stopOpacity="0" />
        </radialGradient>
        <clipPath id="v3-pane"><rect x="82" y="72" width="246" height="206" /></clipPath>
        <pattern id="v3-floorlines" width="120" height="140" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="1" height="140" fill="#b39d78" opacity="0.7" />
        </pattern>
      </defs>

      {/* wall and floor */}
      <rect x="0" y="0" width="1200" height="520" fill="#ede4d5" />
      <rect x="0" y="514" width="1200" height="10" fill="#dbcdb1" />
      <rect x="0" y="520" width="1200" height="140" fill="#cdb791" />
      <rect x="0" y="520" width="1200" height="140" fill="url(#v3-floorlines)" />

      {/* 1 · window */}
      <Hotspot id="window" box={[64, 56, 284, 246]} onOpen={onOpen} onHover={onHover}>
        <rect x="70" y="60" width="270" height="230" fill="#6f5f4e" />
        <rect x="82" y="72" width="246" height="206" fill="url(#v3-sunrise)" />
        <g clipPath="url(#v3-pane)">
          <circle cx="292" cy="196" r="48" fill="url(#v3-sunglow)" />
          <circle cx="292" cy="196" r="19" fill={SUNRISE.sun} />
          <path d="M82 262 C130 240 160 250 200 244 C240 238 270 252 328 236 L328 278 L82 278 Z" fill="#b39c9a" opacity="0.55" />
          <path d="M82 272 C120 262 150 268 190 264 C240 258 280 270 328 262 L328 278 L82 278 Z" fill="#8f7b7a" opacity="0.6" />
        </g>
        <rect x="201" y="72" width="8" height="206" fill="#6f5f4e" />
        <rect x="82" y="156" width="246" height="8" fill="#6f5f4e" />
        <rect x="60" y="290" width="290" height="12" fill="#8a7a66" />
      </Hotspot>

      {/* 2 · posters */}
      <Hotspot id="posters" box={[420, 60, 368, 118]} onOpen={onOpen} onHover={onHover}>
        {films.map((f, i) => {
          const x = 420 + i * 96;
          return (
            <g key={f.title}>
              <rect x={x} y="60" width="80" height="118" fill="#f7f2ea" stroke="#8a7a66" strokeWidth="2" />
              <rect x={x + 8} y="68" width="64" height="78" fill={f.hue} />
              <circle cx={x + 40} cy="100" r="14" fill="#f7f2ea" opacity="0.35" />
              <rect x={x + 8} y="150" width="64" height="4" fill={INK} opacity="0.55" />
              <rect x={x + 8} y="160" width="40" height="3" fill={INK} opacity="0.3" />
            </g>
          );
        })}
      </Hotspot>

      {/* 9 · wall screen */}
      {!compact && (
        <Hotspot id="screen" box={[870, 60, 260, 150]} onOpen={onOpen} onHover={onHover}>
          <rect x="870" y="60" width="260" height="150" rx="4" fill="#20262c" />
          {featured.slice(0, 6).map((p, i) => {
            const x = 882 + (i % 3) * 80;
            const y = 72 + Math.floor(i / 3) * 63;
            return <image key={p.id} href={p.image} x={x} y={y} width="72" height="52" preserveAspectRatio="xMidYMid slice" />;
          })}
        </Hotspot>
      )}

      {/* 10 · games shelf */}
      <Hotspot id="games" box={[870, 226, 260, 56]} onOpen={onOpen} onHover={onHover}>
        <rect x="870" y="272" width="260" height="10" fill={WOOD} />
        {games.map((g, i) => (
          <g key={g.title}>
            <rect x={884 + i * 30} y="228" width="22" height="44" rx="2" fill={g.hue} />
            <rect x={884 + i * 30} y="236" width="22" height="3" fill="#ffffff" opacity="0.5" />
          </g>
        ))}
      </Hotspot>

      {/* 3 · fridge with magnets */}
      <Hotspot id="magnets" box={[965, 300, 165, 220]} onOpen={onOpen} onHover={onHover}>
        <rect x="965" y="300" width="165" height="220" rx="6" fill="#e7e5de" stroke="#b7b2a6" strokeWidth="2" />
        <rect x="965" y="372" width="165" height="2" fill="#b7b2a6" />
        <rect x="1108" y="318" width="6" height="36" rx="3" fill="#9c978c" />
        <rect x="1108" y="390" width="6" height="60" rx="3" fill="#9c978c" />
        {magnets.map((m, i) => {
          const pts = [[996, 404], [1044, 420], [1086, 398], [1010, 462], [1072, 472], [1042, 500]];
          const [cx, cy] = pts[i % pts.length];
          return m.shape === 'round'
            ? <circle key={m.place} cx={cx} cy={cy} r="9" fill={m.hue} />
            : <rect key={m.place} x={cx - 8} y={cy - 8} width="16" height="16" rx="3" fill={m.hue} />;
        })}
      </Hotspot>

      {/* 5 · trophies, on top of the bookshelf */}
      <Hotspot id="trophies" box={[110, 262, 190, 68]} onOpen={onOpen} onHover={onHover}>
        <g fill="#d3a64a" stroke="#9c7a2e" strokeWidth="1.5">
          <path d="M132 276 h32 q0 30 -16 34 q-16 -4 -16 -34 z" />
          <path d="M126 280 q-10 4 -4 16 q4 6 12 4" fill="none" />
          <path d="M170 280 q10 4 4 16 q-4 6 -12 4" fill="none" />
          <rect x="142" y="310" width="12" height="10" />
          <rect x="132" y="320" width="32" height="8" rx="1" />
        </g>
        <g fill="#d3a64a" stroke="#9c7a2e" strokeWidth="1.5">
          <rect x="236" y="268" width="56" height="60" rx="4" fill="#5b4a3a" />
          <circle cx="264" cy="296" r="16" />
          <rect x="236" y="320" width="56" height="8" rx="1" />
        </g>
      </Hotspot>

      {/* 4 · bookshelf */}
      <Hotspot id="books" box={[70, 330, 270, 190]} onOpen={onOpen} onHover={onHover}>
        <rect x="70" y="330" width="270" height="190" fill={WOOD_DARK} />
        <rect x="80" y="340" width="250" height="170" fill="#e6dcc8" />
        <rect x="80" y="425" width="250" height="8" fill={WOOD} />
        {spinesTop.map((s) => <Spine key={`t-${s.title}`} {...s} />)}
        {spinesBottom.map((s) => <Spine key={`b-${s.title}`} {...s} />)}
      </Hotspot>

      {/* desk */}
      <rect x="400" y="430" width="470" height="14" fill="#b48f66" />
      <rect x="412" y="444" width="12" height="76" fill="#8f6f4d" />
      <rect x="846" y="444" width="12" height="76" fill="#8f6f4d" />

      {/* 6 · monitor A — work */}
      {!compact && (
        <Hotspot id="monitorA" box={[430, 310, 180, 120]} onOpen={onOpen} onHover={onHover}>
          <rect x="430" y="310" width="180" height="110" rx="4" fill="#1f262c" />
          <rect x="438" y="318" width="164" height="94" fill="#2b343c" />
          <g fill="#dfe6ec" opacity="0.85">
            <rect x="448" y="330" width="60" height="6" /><rect x="448" y="342" width="90" height="4" opacity="0.5" />
            <rect x="448" y="358" width="140" height="10" /><rect x="448" y="374" width="100" height="10" />
            <rect x="448" y="390" width="120" height="10" />
          </g>
          <rect x="512" y="420" width="16" height="8" fill="#3a434c" />
          <rect x="490" y="426" width="60" height="4" rx="2" fill="#3a434c" />
        </Hotspot>
      )}

      {/* 7 · monitor B — papers */}
      {!compact && (
        <Hotspot id="monitorB" box={[640, 310, 180, 120]} onOpen={onOpen} onHover={onHover}>
          <rect x="640" y="310" width="180" height="110" rx="4" fill="#1f262c" />
          <rect x="648" y="318" width="164" height="94" fill="#2b343c" />
          <g>
            <rect x="660" y="330" width="40" height="56" fill="#f3efe6" />
            <rect x="710" y="330" width="40" height="56" fill="#f3efe6" />
            <rect x="760" y="330" width="40" height="56" fill="#f3efe6" opacity="0.7" />
            <rect x="660" y="392" width="30" height="6" fill="#d3a64a" />
          </g>
          <rect x="722" y="420" width="16" height="8" fill="#3a434c" />
          <rect x="700" y="426" width="60" height="4" rx="2" fill="#3a434c" />
        </Hotspot>
      )}

      {/* 8 · laptop — about me */}
      {!compact && (
        <Hotspot id="laptop" box={[548, 372, 150, 60]} onOpen={onOpen} onHover={onHover}>
          <path d="M560 372 L686 372 L694 428 L552 428 Z" fill="#2b3138" />
          <path d="M568 380 L678 380 L684 420 L562 420 Z" fill="#cfe0ee" />
          <rect x="540" y="428" width="166" height="6" rx="2" fill="#464e56" />
          <rect x="600" y="384" width="40" height="4" fill="#2b3138" opacity="0.6" />
          <rect x="600" y="394" width="60" height="3" fill="#2b3138" opacity="0.35" />
        </Hotspot>
      )}

      {/* 11 · family photo */}
      <Hotspot id="photo" box={[778, 386, 60, 44]} onOpen={onOpen} onHover={onHover}>
        <rect x="780" y="388" width="56" height="42" fill="#f4efe6" stroke="#6f5f4e" strokeWidth="3" />
        <circle cx="798" cy="404" r="6" fill="#c9b8a5" />
        <circle cx="814" cy="402" r="7" fill="#c9b8a5" />
        <circle cx="826" cy="408" r="5" fill="#c9b8a5" />
        <rect x="786" y="412" width="44" height="12" fill="#c9b8a5" opacity="0.6" />
      </Hotspot>

      {/* 12 · football and boots */}
      <Hotspot id="football" box={[126, 574, 190, 66]} onOpen={onOpen} onHover={onHover}>
        <circle cx="160" cy="610" r="30" fill="#f4efe6" stroke={INK} strokeWidth="2" />
        <path d="M160 588 l14 10 l-5 16 l-18 0 l-5 -16 z" fill={INK} />
        <path d="M133 604 l10 -10 M187 604 l-10 -10 M147 636 l6 -14 M173 636 l-6 -14" stroke={INK} strokeWidth="2" fill="none" />
        <path d="M222 630 q8 -28 40 -22 q22 4 28 16 l16 6 l0 8 l-84 0 z" fill="#3d4a57" />
        <path d="M262 632 q8 -24 36 -20 q16 4 20 12 l12 8 l0 6 l-68 0 z" fill="#4a5867" />
        <rect x="222" y="636" width="84" height="4" fill="#2b3138" />
      </Hotspot>
    </svg>
  );
}

function layoutSpines(list, x0, x1, baseY, bottomY) {
  const n = list.length;
  if (!n) return [];
  const gap = 3;
  const w = Math.floor((x1 - x0 - gap * (n - 1)) / n);
  return list.map((b, i) => ({
    title: b.title,
    hue: b.hue,
    x: x0 + i * (w + gap),
    w,
    h: 62 + ((i * 7) % 16),
    bottom: bottomY,
  }));
}

function Spine({ title, hue, x, w, h, bottom }) {
  const y = bottom - h;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={hue} rx="1" />
      <rect x={x} y={y} width={w} height="3" fill="#ffffff" opacity="0.35" />
      <text
        className="v3-spine"
        transform={`translate(${x + w / 2 + 3.5} ${bottom - 5}) rotate(-90)`}
        fontSize="9.5"
        fill="#fffdf9"
      >
        {title.length > 22 ? `${title.slice(0, 21)}…` : title}
      </text>
    </g>
  );
}
