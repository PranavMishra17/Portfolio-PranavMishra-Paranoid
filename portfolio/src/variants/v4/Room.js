// Variant 4 — the room. Flat, straight on, drawn in ink on paper. The only
// colour in it is the sky through the window, which shows the next morning.
// Every object is a hotspot: hover names it in the caption bar, click opens it.
import React from "react";
import { films, books, games, magnets } from "./personal";

const INK = "#24303a";
const WALL = "#f3f0e9";
const FLOOR = "#e6dfd2";
const WOOD = "#d9c4a5";
const SCREEN = "#2a3239";
const PAPER = "#fbfaf6";
const GOLD = "#d9b45f";

function Hot({ k, label, box, onOpen, onHover, off, extra, children }) {
  if (off) {
    return <g className="v4-obj is-off">{children}</g>;
  }
  const [x, y, w, h] = box;
  const open = () => onOpen({ key: k, ...(extra || {}) });
  return (
    <g
      className="v4-hs"
      tabIndex={0}
      role="button"
      aria-label={label}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      onMouseEnter={() => onHover(label)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(label)}
      onBlur={() => onHover(null)}
    >
      {children}
      <rect className="v4-hl" x={x - 7} y={y - 7} width={w + 14} height={h + 14} rx="7" />
    </g>
  );
}

function Poster({ x, y, i, tone }) {
  const w = 92;
  const h = 130;
  let art = null;
  if (i === 0) art = <circle cx={x + 46} cy={y + 58} r="30" fill={tone} />;
  if (i === 1)
    art = (
      <g fill={tone}>
        <rect x={x + 14} y={y + 30} width="64" height="10" />
        <rect x={x + 14} y={y + 54} width="64" height="10" />
        <rect x={x + 14} y={y + 78} width="64" height="10" />
      </g>
    );
  if (i === 2) art = <path d={`M${x + 16} ${y + 104} L${x + 76} ${y + 26}`} stroke={tone} strokeWidth="12" strokeLinecap="round" />;
  if (i === 3) art = <rect x={x + 22} y={y + 30} width="48" height="48" fill={tone} />;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={PAPER} stroke={INK} strokeWidth="2" />
      {art}
      <rect x={x + 12} y={y + 112} width={w - 24} height="4" fill={INK} opacity=".3" />
      <rect x={x + 12} y={y + 120} width={w - 44} height="3" fill={INK} opacity=".18" />
    </g>
  );
}

function Monitor({ x, y, children }) {
  return (
    <g>
      <rect className="v4-screen" x={x} y={y} width="170" height="110" rx="3" fill={SCREEN} stroke={INK} strokeWidth="2" />
      {children}
      <rect x={x + 75} y={y + 110} width="20" height="12" fill={INK} />
      <rect x={x + 50} y={y + 122} width="70" height="6" rx="2" fill={INK} />
    </g>
  );
}

export default function Room({ onOpen, onHover, hideDupes = false }) {
  const spinesTop = books.slice(0, 4);
  const spinesBottom = books.slice(4);
  let sx = 86;
  const rowTop = spinesTop.map((b, i) => {
    const w = [22, 28, 20, 26][i];
    const el = { x: sx, w, h: b.h, tone: b.tone };
    sx += w + 4;
    return el;
  });
  sx = 86;
  const rowBottom = spinesBottom.map((b, i) => {
    const w = [24, 22, 26][i] || 22;
    const el = { x: sx, w, h: b.h, tone: b.tone };
    sx += w + 4;
    return el;
  });

  return (
    <svg className="v4-room-svg" viewBox="0 0 1200 720" role="group" aria-label="My room, from the bachelor days">
      <defs>
        <linearGradient id="v4-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9d6e8" />
          <stop offset=".55" stopColor="#f0d6c6" />
          <stop offset="1" stopColor="#f4c79a" />
        </linearGradient>
        <radialGradient id="v4-dawn-sun" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset=".6" stopColor="#ffe9b8" />
          <stop offset="1" stopColor="#ffe0a0" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* wall and floor */}
      <rect x="0" y="0" width="1200" height="560" fill={WALL} />
      <rect x="0" y="560" width="1200" height="160" fill={FLOOR} />
      <line x1="0" y1="560" x2="1200" y2="560" stroke={INK} strokeWidth="2" />
      <line x1="0" y1="574" x2="1200" y2="574" stroke={INK} strokeWidth="1" opacity=".18" />

      {/* 1 window */}
      <Hot k="window" label="The window, showing the next morning" box={[60, 62, 290, 240]} onOpen={onOpen} onHover={onHover}>
        <rect x="70" y="70" width="270" height="220" fill="url(#v4-dawn)" />
        <circle cx="150" cy="232" r="46" fill="url(#v4-dawn-sun)" />
        <circle cx="150" cy="232" r="22" fill="#fff3d0" />
        <path d="M70 252 Q140 234 205 250 T340 246 L340 290 L70 290 Z" fill="#d9c3b1" />
        <path d="M70 268 Q120 256 180 268 T340 262 L340 290 L70 290 Z" fill="#c9b09a" opacity=".85" />
        <rect x="70" y="70" width="270" height="220" fill="none" stroke={INK} strokeWidth="4" />
        <line x1="205" y1="70" x2="205" y2="290" stroke={INK} strokeWidth="4" />
        <line x1="70" y1="180" x2="340" y2="180" stroke={INK} strokeWidth="4" />
        <rect x="60" y="290" width="290" height="10" fill={WOOD} stroke={INK} strokeWidth="2" />
      </Hot>

      {/* 2 posters */}
      <Hot k="posters" label="Four films on the wall" box={[420, 70, 428, 130]} onOpen={onOpen} onHover={onHover}>
        {films.map((f, i) => (
          <Poster key={f.title} x={420 + i * 112} y={70} i={i} tone={f.tone} />
        ))}
      </Hot>

      {/* 9 wall screen: projects */}
      <Hot k="projects" label="The wall screen, with what I have built" box={[900, 80, 230, 142]} onOpen={onOpen} onHover={onHover} off={hideDupes}>
        <rect className="v4-screen" x="900" y="80" width="230" height="130" rx="4" fill={SCREEN} stroke={INK} strokeWidth="2" />
        <g fill="#4b555e">
          <rect x="914" y="94" width="64" height="40" rx="2" />
          <rect x="983" y="94" width="64" height="40" rx="2" />
          <rect x="1052" y="94" width="64" height="40" rx="2" />
          <rect x="914" y="146" width="120" height="5" />
          <rect x="914" y="158" width="90" height="5" />
          <rect x="914" y="170" width="140" height="5" />
        </g>
        <rect x="1005" y="210" width="20" height="12" fill={INK} />
      </Hot>

      {/* 10 games shelf */}
      <Hot k="games" label="The games shelf" box={[900, 250, 230, 60]} onOpen={onOpen} onHover={onHover}>
        {games.map((g, i) => (
          <rect key={g.title} x={915 + i * 26} y="254" width="20" height="46" fill={g.tone} stroke={INK} strokeWidth="1.5" />
        ))}
        <rect x="900" y="300" width="230" height="8" fill={WOOD} stroke={INK} strokeWidth="2" />
      </Hot>

      {/* 5 trophies */}
      <Hot k="trophies" label="Two trophies: MIT XR 2024 and HINT 5.0" box={[100, 312, 130, 48]} onOpen={onOpen} onHover={onHover}>
        <path d="M118 316 h34 v14 a17 17 0 0 1 -34 0 z" fill={GOLD} stroke={INK} strokeWidth="1.5" />
        <path d="M118 320 q-10 2 -8 12 q2 8 10 8 M152 320 q10 2 8 12 q-2 8 -10 8" fill="none" stroke={INK} strokeWidth="1.5" />
        <rect x="131" y="346" width="8" height="8" fill={INK} />
        <rect x="121" y="354" width="28" height="6" fill={INK} />
        <rect x="180" y="324" width="48" height="36" rx="2" fill="#c9c2a6" stroke={INK} strokeWidth="1.5" />
        <circle cx="204" cy="340" r="9" fill={GOLD} stroke={INK} strokeWidth="1.5" />
      </Hot>

      {/* 4 bookshelf */}
      <Hot k="books" label="The bookshelf" box={[70, 360, 260, 200]} onOpen={onOpen} onHover={onHover}>
        <rect x="70" y="360" width="260" height="200" fill={PAPER} stroke={INK} strokeWidth="2" />
        <line x1="70" y1="460" x2="330" y2="460" stroke={INK} strokeWidth="2" />
        {rowTop.map((s, i) => (
          <rect key={i} x={s.x} y={456 - s.h} width={s.w} height={s.h} fill={s.tone} stroke={INK} strokeWidth="1.5" />
        ))}
        {rowBottom.map((s, i) => (
          <rect key={i} x={s.x} y={556 - s.h} width={s.w} height={s.h} fill={s.tone} stroke={INK} strokeWidth="1.5" />
        ))}
        {/* one book lying flat on the lower shelf */}
        <rect x="192" y="536" width="60" height="20" fill="#e0c9a3" stroke={INK} strokeWidth="1.5" />
      </Hot>

      {/* desk */}
      <ellipse cx="630" cy="562" rx="240" ry="6" fill={INK} opacity=".08" />
      <rect x="415" y="442" width="10" height="118" fill={WOOD} stroke={INK} strokeWidth="2" />
      <rect x="835" y="442" width="10" height="118" fill={WOOD} stroke={INK} strokeWidth="2" />
      <rect x="400" y="430" width="460" height="12" fill={WOOD} stroke={INK} strokeWidth="2" />

      {/* 6 monitor: work */}
      <Hot k="work" label="The left monitor, with my work history" box={[420, 300, 170, 130]} onOpen={onOpen} onHover={onHover} off={hideDupes}>
        <Monitor x={420} y={300}>
          <g fill="#6b7680">
            <rect x="434" y="314" width="60" height="6" />
            <rect x="434" y="328" width="110" height="6" />
            <rect x="434" y="342" width="84" height="6" />
            <rect x="434" y="364" width="130" height="6" />
            <rect x="434" y="378" width="70" height="6" />
          </g>
        </Monitor>
      </Hot>

      {/* 7 monitor: papers */}
      <Hot k="papers" label="The right monitor, with the three papers" box={[610, 300, 170, 130]} onOpen={onOpen} onHover={onHover} off={hideDupes}>
        <Monitor x={610} y={300}>
          <g fill="#e8e3d6">
            <rect x="628" y="314" width="38" height="52" />
            <rect x="676" y="314" width="38" height="52" />
            <rect x="724" y="314" width="38" height="52" />
          </g>
          <g fill="#8a949a">
            <rect x="634" y="322" width="26" height="3" />
            <rect x="634" y="330" width="20" height="3" />
            <rect x="682" y="322" width="26" height="3" />
            <rect x="682" y="330" width="20" height="3" />
            <rect x="730" y="322" width="26" height="3" />
            <rect x="730" y="330" width="20" height="3" />
          </g>
        </Monitor>
      </Hot>

      {/* 8 laptop: about */}
      <Hot k="about" label="The laptop, about me" box={[458, 372, 154, 70]} onOpen={onOpen} onHover={onHover} off={hideDupes}>
        <path d="M478 372 H592 L598 432 H472 Z" fill="#3a434b" stroke={INK} strokeWidth="2" />
        <rect className="v4-screen" x="484" y="380" width="102" height="44" fill="#55606a" />
        <path d="M464 432 H606 L612 442 H458 Z" fill="#cfd2d6" stroke={INK} strokeWidth="2" />
      </Hot>

      {/* 11 family photo */}
      <Hot k="family" label="The family photo" box={[798, 380, 62, 52]} onOpen={onOpen} onHover={onHover}>
        <rect x="800" y="384" width="56" height="46" fill={PAPER} stroke={INK} strokeWidth="2" />
        <rect x="806" y="390" width="44" height="34" fill="#dfe4e6" />
        <circle cx="820" cy="404" r="6" fill="#9aa4aa" />
        <circle cx="836" cy="406" r="5" fill="#9aa4aa" />
        <path d="M810 424 q10 -12 20 0 M826 424 q10 -10 20 0" fill="#9aa4aa" />
      </Hot>

      {/* 3 fridge with magnets */}
      <g>
        <rect x="920" y="330" width="200" height="230" rx="6" fill="#f4f3ef" stroke={INK} strokeWidth="2" />
        <line x1="920" y1="410" x2="1120" y2="410" stroke={INK} strokeWidth="2" />
        <rect x="1098" y="350" width="6" height="40" rx="3" fill={INK} />
        <rect x="1098" y="430" width="6" height="64" rx="3" fill={INK} />
      </g>
      {magnets.map((m) => (
        <Hot
          key={m.place}
          k="magnets"
          label={`A magnet from ${m.place}`}
          box={[m.x - 9, m.y - 9, 18, 18]}
          onOpen={onOpen}
          onHover={onHover}
          extra={{ focus: m.place }}
        >
          <circle cx={m.x} cy={m.y} r="9" fill={m.tone} stroke={INK} strokeWidth="1.5" />
        </Hot>
      ))}

      {/* 12 football and boots */}
      <Hot k="football" label="A football and a pair of boots" box={[388, 578, 190, 62]} onOpen={onOpen} onHover={onHover}>
        <circle cx="420" cy="608" r="28" fill={PAPER} stroke={INK} strokeWidth="2" />
        <path d="M420 590 l14 10 l-5 16 h-18 l-5 -16 z" fill={INK} />
        <path d="M406 600 l-10 -6 M434 600 l10 -6 M411 616 l-8 12 M429 616 l8 12" stroke={INK} strokeWidth="1.5" />
        <path d="M476 630 V606 Q490 596 504 606 L522 618 Q538 622 548 630 Z" fill="#2b3439" />
        <path d="M514 632 V608 Q528 598 542 608 L560 620 Q576 624 586 632 Z" fill="#3e4a54" />
        <line x1="476" y1="630" x2="586" y2="630" stroke={INK} strokeWidth="2" />
      </Hot>
    </svg>
  );
}
