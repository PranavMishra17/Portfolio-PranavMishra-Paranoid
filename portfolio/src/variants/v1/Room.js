// Variant 1 — the room, drawn flat and straight on, as the page's footer. Twelve hotspots.
// Monitors, laptop and wall screen reuse the page's own components. Everything else is personal.
import React, { useState, useCallback } from 'react';
import Panel from './Panel';
import { History } from './Work';
import { Projects, Papers } from './Built';
import { WindowSky } from './Sky';
import { ABOUT, TROPHIES } from './copy';
import { BOOKS, FILMS, GAMES, MAGNETS, FAMILY_PHOTO, FOOTBALL, SAMPLE_NOTE } from './personal';

const LABELS = {
  window: 'The window. The next morning.',
  posters: 'Four films',
  screen: 'The wall screen. Things I built.',
  games: 'Games I play',
  fridge: 'The fridge. A memory behind each magnet.',
  shelf: 'The bookshelf',
  trophies: 'Two trophies',
  monitorA: 'Monitor one. Where I have worked.',
  monitorB: 'Monitor two. Three papers.',
  laptop: 'The laptop. About me.',
  photo: 'A family photo',
  ball: 'Football and boots',
};

const TITLES = {
  window: 'The next morning',
  posters: 'Four films',
  screen: 'Things I built',
  games: 'Games',
  fridge: 'Fridge magnets',
  shelf: 'Bookshelf',
  trophies: 'Two trophies',
  monitorA: 'Where I have worked',
  monitorB: 'Three papers',
  laptop: 'About me',
  photo: 'A family photo',
  ball: 'Football',
};

// Only these survive on a phone. The rest already appear higher on the page.
const PERSONAL_KEYS = ['window', 'posters', 'shelf', 'trophies', 'games', 'fridge', 'photo', 'ball'];

function Hot({ id, label, x, y, w, h, onHover, onOpen, children }) {
  return (
    <g
      className="hs"
      role="button"
      tabIndex={0}
      aria-label={label}
      onMouseEnter={() => onHover(label)}
      onMouseLeave={() => onHover('')}
      onFocus={() => onHover(label)}
      onBlur={() => onHover('')}
      onClick={() => onOpen(id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(id);
        }
      }}
    >
      {children}
      <rect className="ring" x={x - 7} y={y - 7} width={w + 14} height={h + 14} rx="3" />
    </g>
  );
}

function SampleNote() {
  return <p className="v1-sample">{SAMPLE_NOTE}</p>;
}

function PanelContent({ id, onSeeAll }) {
  switch (id) {
    case 'window':
      return (
        <>
          <WindowSky className="big" />
          <p className="v1-p">The window looks out on the same sky, one day later. Sunrise, sun just up. The day starts over.</p>
        </>
      );
    case 'posters':
      return (
        <>
          <SampleNote />
          <ul className="v1-plist">
            {FILMS.map((f) => (
              <li key={f.title}>
                <span className="v1-swatch" style={{ background: f.tone }} />
                <div>
                  <h3 className="v1-plist-t">{f.title}</h3>
                  <p className="v1-plist-line">{f.why}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      );
    case 'screen':
      return <Projects inPanel onSeeAll={onSeeAll} />;
    case 'games':
      return (
        <>
          <SampleNote />
          <ul className="v1-plist">
            {GAMES.map((g) => (
              <li key={g.title}>
                <span className="v1-swatch tall" style={{ background: g.case }} />
                <div>
                  <h3 className="v1-plist-t">{g.title}</h3>
                  <p className="v1-plist-line">{g.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      );
    case 'fridge':
      return (
        <>
          <SampleNote />
          <ul className="v1-plist">
            {MAGNETS.map((m) => (
              <li key={m.place}>
                <span className="v1-swatch round" style={{ background: m.color }} />
                <div>
                  <h3 className="v1-plist-t">{m.place}</h3>
                  <p className="v1-plist-line">{m.memory}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      );
    case 'shelf':
      return (
        <>
          <SampleNote />
          <ul className="v1-plist">
            {BOOKS.map((b) => (
              <li key={b.title}>
                <span className="v1-swatch tall" style={{ background: b.spine }} />
                <div>
                  <h3 className="v1-plist-t">{b.title}</h3>
                  <p className="v1-plist-line">
                    {b.author}. {b.state}.
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </>
      );
    case 'trophies':
      return (
        <ul className="v1-trophies">
          {TROPHIES.map((t) => (
            <li key={t.id}>
              <div className="v1-trophy-img">
                <img src={t.image} alt="" loading="lazy" />
              </div>
              <h3 className="v1-plist-t">{t.title}</h3>
              <p className="v1-plist-line">{t.line}</p>
            </li>
          ))}
        </ul>
      );
    case 'monitorA':
      return <History compact />;
    case 'monitorB':
      return <Papers />;
    case 'laptop':
      return (
        <>
          {ABOUT.longer.map((l) => (
            <p className="v1-p" key={l}>
              {l}
            </p>
          ))}
          <ul className="v1-about-links">
            {ABOUT.links.map((l) => (
              <li key={l.label}>
                <a className="v1-link" href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a className="v1-link" href="/resume">
                Resume
              </a>
            </li>
          </ul>
        </>
      );
    case 'photo':
      return (
        <>
          <div className="v1-photo-frame" aria-hidden="true" />
          <p className="v1-p">{FAMILY_PHOTO.caption}</p>
          {FAMILY_PHOTO.sample ? <SampleNote /> : null}
        </>
      );
    case 'ball':
      return (
        <>
          <p className="v1-p">{FOOTBALL.line}</p>
          {FOOTBALL.sample ? <p className="v1-sample">The first sentence is his. The second is a sample.</p> : null}
        </>
      );
    default:
      return null;
  }
}

export default function Room({ onSeeAll }) {
  const [hover, setHover] = useState('');
  const [openId, setOpenId] = useState(null);
  const close = useCallback(() => setOpenId(null), []);

  return (
    <footer className="v1-room" id="room">
      <div className="v1-room-in">
        <div className="v1-room-head">
          <h2 className="v1-h2">The room</h2>
          <p className="v1-p v1-muted">
            My desk from my bachelor days, at the end of the day. Everything here can be clicked.
          </p>
          <p className="v1-room-caption" aria-live="polite">
            {hover || ' '}
          </p>
        </div>

        <svg className="v1-scene" viewBox="0 0 1200 560" role="group" aria-label="The room, drawn flat">
          <defs>
            <linearGradient id="v1dawn" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#c6d6e8" />
              <stop offset="55%" stopColor="#f0e8de" />
              <stop offset="100%" stopColor="#f7d6b0" />
            </linearGradient>
          </defs>

          {/* wall and floor */}
          <rect x="0" y="0" width="1200" height="430" fill="#efe9df" />
          <rect x="0" y="430" width="1200" height="130" fill="#d8cdb9" />
          <line x1="0" y1="430" x2="1200" y2="430" stroke="#8a7f6e" strokeWidth="2" />

          {/* 1 window */}
          <Hot id="window" label={LABELS.window} x={60} y={50} w={250} h={190} onHover={setHover} onOpen={setOpenId}>
            <rect x="60" y="50" width="250" height="190" fill="url(#v1dawn)" stroke="#5f6569" strokeWidth="3" />
            <circle cx="245" cy="152" r="18" fill="#fff3d0" />
            <line x1="185" y1="50" x2="185" y2="240" stroke="#5f6569" strokeWidth="3" />
            <line x1="60" y1="145" x2="310" y2="145" stroke="#5f6569" strokeWidth="3" />
            <rect x="52" y="240" width="266" height="8" fill="#cfc6b6" stroke="#8a7f6e" strokeWidth="1.5" />
          </Hot>

          {/* 2 posters */}
          <Hot id="posters" label={LABELS.posters} x={380} y={40} w={346} h={108} onHover={setHover} onOpen={setOpenId}>
            {FILMS.map((f, i) => (
              <g key={f.title}>
                <rect x={380 + i * 90} y="40" width="76" height="108" fill={f.tone} stroke="#5f6569" strokeWidth="2" />
                <rect x={380 + i * 90} y="120" width="76" height="28" fill="rgba(255,255,255,0.6)" />
                <rect x={392 + i * 90} y="58" width="52" height="4" fill="rgba(255,255,255,0.7)" />
                <rect x={392 + i * 90} y="68" width="36" height="4" fill="rgba(255,255,255,0.45)" />
              </g>
            ))}
          </Hot>

          {/* 9 wall screen */}
          <Hot id="screen" label={LABELS.screen} x={960} y={50} w={190} h={115} onHover={setHover} onOpen={setOpenId}>
            <rect x="960" y="50" width="190" height="115" rx="3" fill="#23292e" stroke="#5f6569" strokeWidth="2" />
            <g stroke="#8b969c" strokeWidth="2">
              <line x1="980" y1="78" x2="1094" y2="78" />
              <line x1="980" y1="98" x2="1072" y2="98" />
              <line x1="980" y1="118" x2="1100" y2="118" />
              <line x1="980" y1="138" x2="1050" y2="138" />
            </g>
          </Hot>

          {/* 10 games shelf */}
          <Hot id="games" label={LABELS.games} x={960} y={192} w={190} h={50} onHover={setHover} onOpen={setOpenId}>
            <rect x="960" y="236" width="190" height="6" fill="#b99a72" stroke="#8a7f6e" strokeWidth="1.5" />
            {GAMES.map((g, i) => (
              <rect key={g.title} x={972 + i * 26} y="196" width="18" height="40" fill={g.case} stroke="#2b3439" strokeWidth="1.2" />
            ))}
          </Hot>

          {/* 3 fridge */}
          <Hot id="fridge" label={LABELS.fridge} x={990} y={262} w={150} h={168} onHover={setHover} onOpen={setOpenId}>
            <rect x="990" y="262" width="150" height="168" rx="4" fill="#f3f2ed" stroke="#6b7378" strokeWidth="2" />
            <line x1="990" y1="318" x2="1140" y2="318" stroke="#6b7378" strokeWidth="2" />
            <rect x="1122" y="290" width="6" height="18" rx="2" fill="#6b7378" />
            <rect x="1122" y="330" width="6" height="30" rx="2" fill="#6b7378" />
            {[[1020, 300], [1060, 292], [1100, 304], [1030, 362], [1088, 352], [1060, 398]].map(([cx, cy], i) => (
              <circle key={MAGNETS[i].place} cx={cx} cy={cy} r="8" fill={MAGNETS[i].color} stroke="#2b3439" strokeWidth="1" />
            ))}
          </Hot>

          {/* 5 trophies */}
          <Hot id="trophies" label={LABELS.trophies} x={84} y={246} w={110} h={44} onHover={setHover} onOpen={setOpenId}>
            <path d="M92 254 h28 v10 a14 14 0 0 1 -28 0 z" fill="#d9a93a" stroke="#8a6a34" strokeWidth="1.5" />
            <rect x="102" y="276" width="8" height="8" fill="#8a6a34" />
            <rect x="96" y="284" width="20" height="6" fill="#8a6a34" />
            <circle cx="160" cy="272" r="13" fill="#d9a93a" stroke="#8a6a34" strokeWidth="1.5" />
            <path d="M154 258 l6 -10 l6 10" fill="none" stroke="#b8503f" strokeWidth="3" />
            <rect x="150" y="284" width="20" height="6" fill="#8a6a34" />
          </Hot>

          {/* 4 bookshelf */}
          <Hot id="shelf" label={LABELS.shelf} x={60} y={290} w={230} h={140} onHover={setHover} onOpen={setOpenId}>
            <rect x="60" y="290" width="230" height="140" fill="#f6f2e9" stroke="#6b7378" strokeWidth="2" />
            <line x1="60" y1="360" x2="290" y2="360" stroke="#6b7378" strokeWidth="2" />
            {BOOKS.map((b, i) => {
              const h = [56, 50, 58, 48, 56, 52, 58][i % 7];
              return <rect key={b.title} x={72 + i * 29} y={360 - h} width="22" height={h} fill={b.spine} stroke="#2b3439" strokeWidth="1" />;
            })}
            {BOOKS.slice(0, 5).map((b, i) => {
              const h = [52, 58, 46, 56, 50][i];
              return <rect key={`${b.title}-2`} x={76 + i * 32} y={430 - h} width="24" height={h} fill={b.spine} opacity="0.8" stroke="#2b3439" strokeWidth="1" />;
            })}
          </Hot>

          {/* desk */}
          <rect x="380" y="350" width="520" height="12" fill="#b99a72" stroke="#6b7378" strokeWidth="2" />
          <rect x="392" y="362" width="6" height="68" fill="#8a7f6e" />
          <rect x="882" y="362" width="6" height="68" fill="#8a7f6e" />

          {/* 6 monitor A */}
          <Hot id="monitorA" label={LABELS.monitorA} x={400} y={252} w={170} h={96} onHover={setHover} onOpen={setOpenId}>
            <rect x="400" y="252" width="170" height="96" rx="3" fill="#23292e" stroke="#5f6569" strokeWidth="2" />
            <g fill="#8b969c">
              <rect x="416" y="268" width="34" height="24" />
              <rect x="458" y="268" width="34" height="24" />
              <rect x="500" y="268" width="34" height="24" />
              <rect x="416" y="300" width="60" height="6" />
              <rect x="416" y="314" width="90" height="6" />
            </g>
            <rect x="462" y="346" width="46" height="4" fill="#5f6569" />
          </Hot>

          {/* 7 monitor B */}
          <Hot id="monitorB" label={LABELS.monitorB} x={590} y={252} w={170} h={96} onHover={setHover} onOpen={setOpenId}>
            <rect x="590" y="252" width="170" height="96" rx="3" fill="#23292e" stroke="#5f6569" strokeWidth="2" />
            <g fill="#e8e3d6">
              <rect x="610" y="270" width="36" height="48" />
              <rect x="656" y="270" width="36" height="48" />
              <rect x="702" y="270" width="36" height="48" />
            </g>
            <rect x="652" y="346" width="46" height="4" fill="#5f6569" />
          </Hot>

          {/* 8 laptop */}
          <Hot id="laptop" label={LABELS.laptop} x={490} y={300} w={112} h={50} onHover={setHover} onOpen={setOpenId}>
            <rect x="498" y="300" width="94" height="44" rx="2" fill="#2b3439" stroke="#5f6569" strokeWidth="1.5" />
            <rect x="504" y="305" width="82" height="34" fill="#4e5a66" />
            <path d="M490 344 L602 344 L608 350 L484 350 Z" fill="#3b4550" stroke="#5f6569" strokeWidth="1.5" />
          </Hot>

          {/* 11 family photo */}
          <Hot id="photo" label={LABELS.photo} x={810} y={306} w={54} h={44} onHover={setHover} onOpen={setOpenId}>
            <rect x="810" y="306" width="54" height="44" fill="#f7f4ec" stroke="#6b7378" strokeWidth="2" />
            <circle cx="829" cy="324" r="7" fill="#c3ccd1" />
            <circle cx="846" cy="326" r="6" fill="#c3ccd1" />
            <rect x="816" y="334" width="42" height="10" fill="#dfe5e8" />
          </Hot>

          {/* 12 football and boots */}
          <Hot id="ball" label={LABELS.ball} x={122} y={466} w={170} h={60} onHover={setHover} onOpen={setOpenId}>
            <circle cx="150" cy="496" r="28" fill="#f7f4ec" stroke="#2b3439" strokeWidth="2" />
            <path d="M150 470 l14 12 l-5 16 h-18 l-5 -16 z" fill="#2b3439" />
            <path d="M205 518 q26 -22 54 -6 q16 8 12 14 l-66 0 z" fill="#2b3439" />
            <path d="M232 522 q26 -22 54 -6 q16 8 12 8 l-66 0 z" fill="#4a4f55" />
          </Hot>
        </svg>

        {/* Phones: the personal objects only. Work, papers and projects are already above. */}
        <ul className="v1-room-list">
          {PERSONAL_KEYS.map((k) => (
            <li key={k}>
              <button type="button" className="v1-room-item" onClick={() => setOpenId(k)}>
                {TITLES[k]}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="v1-colophon">
        <p>
          {ABOUT.name}. {ABOUT.place}. The shelves, posters and magnets hold sample content until I write my own.
        </p>
      </div>

      <Panel open={Boolean(openId)} title={openId ? TITLES[openId] : ''} onClose={close}>
        {openId ? <PanelContent id={openId} onSeeAll={onSeeAll} /> : null}
      </Panel>
    </footer>
  );
}
