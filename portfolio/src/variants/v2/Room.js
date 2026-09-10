// Variant 2 — the room, typeset. Built from HTML, not a drawing, so every spine, poster, case and
// magnet carries its own readable label and is its own button. Straight on. The footer of the page.
import React, { useCallback, useState } from 'react';
import Panel from './Panel';
import { ABOUT, FEATURED, PAPERS, TIMELINE, TROPHIES } from './copy';
import { BOOKS, FILMS, GAMES, MAGNETS, FAMILY_PHOTO, FOOTBALL, SAMPLE_NOTE } from './personal';

function Sample() {
  return <p className="v2-sample">{SAMPLE_NOTE}</p>;
}

// What the panel shows for each key. Keys with an index open one item from a list.
function Content({ k, i, onSeeAll }) {
  switch (k) {
    case 'window':
      return (
        <>
          <div className="v2-window-sky big" aria-hidden="true">
            <span className="v2-window-sun" />
          </div>
          <p className="v2-p">The same sky, one day later. Sunrise, sun just up. It starts over.</p>
        </>
      );
    case 'film': {
      const f = FILMS[i];
      return (
        <>
          <Sample />
          <p className="v2-p">{f.why}</p>
        </>
      );
    }
    case 'book': {
      const b = BOOKS[i];
      return (
        <>
          <Sample />
          <p className="v2-p">
            {b.author}. {b.state}.
          </p>
        </>
      );
    }
    case 'game': {
      const g = GAMES[i];
      return (
        <>
          <Sample />
          <p className="v2-p">{g.note}.</p>
        </>
      );
    }
    case 'magnet': {
      const m = MAGNETS[i];
      return (
        <>
          <Sample />
          <p className="v2-p">{m.memory}</p>
        </>
      );
    }
    case 'trophy': {
      const t = TROPHIES[i];
      return (
        <>
          <div className="v2-trophy-img">
            <img src={t.image} alt="" loading="lazy" />
          </div>
          <p className="v2-p">{t.line}</p>
        </>
      );
    }
    case 'work':
      return (
        <ul className="v2-plist">
          {[...TIMELINE].reverse().map((r) => (
            <li key={r.id}>
              <h3 className="v2-plist-t">
                {r.company}
                <span className="v2-plist-when">{r.when}</span>
              </h3>
              <p className="v2-plist-sub">
                {r.title}, {r.where}
              </p>
              <p className="v2-plist-line">{r.line}</p>
              <ul className="v2-bullets">
                {r.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      );
    case 'papers':
      return (
        <ul className="v2-plist">
          {PAPERS.map((p) => (
            <li key={p.id}>
              <h3 className="v2-plist-t">{p.short}</h3>
              <p className="v2-plist-sub">
                <span className={`v2-status${p.accepted ? ' acc' : ''}`}>{p.status}</span>, {p.venue}
                {p.citations ? `, ${p.citations} citations` : ''}
              </p>
              <p className="v2-plist-line">{p.line}</p>
              <p className="v2-links">
                {p.pdf ? (
                  <a className="v2-link" href={p.pdf} target="_blank" rel="noopener noreferrer">
                    Paper
                  </a>
                ) : null}
                {p.code ? (
                  <a className="v2-link" href={p.code} target="_blank" rel="noopener noreferrer">
                    Code
                  </a>
                ) : null}
              </p>
            </li>
          ))}
        </ul>
      );
    case 'about':
      return (
        <>
          {ABOUT.longer.map((l) => (
            <p className="v2-p" key={l}>
              {l}
            </p>
          ))}
          <p className="v2-links">
            {ABOUT.links.map((l) => (
              <a className="v2-link" key={l.label} href={l.href} target={l.href.startsWith('/') ? undefined : '_blank'} rel="noopener noreferrer">
                {l.label}
              </a>
            ))}
          </p>
        </>
      );
    case 'projects':
      return (
        <>
          <ul className="v2-plist">
            {FEATURED.map((p) => (
              <li key={p.id}>
                <div className={`v2-pthumb${p.square ? ' sq' : ''}`}>
                  <img src={p.image} alt="" loading="lazy" />
                </div>
                <h3 className="v2-plist-t">{p.title}</h3>
                <p className="v2-plist-line">{p.line}</p>
                <p className="v2-links">
                  {p.link ? (
                    <a className="v2-link" href={p.link} target="_blank" rel="noopener noreferrer">
                      {p.action}
                    </a>
                  ) : null}
                  {p.github && p.github !== p.link ? (
                    <a className="v2-link" href={p.github} target="_blank" rel="noopener noreferrer">
                      Code
                    </a>
                  ) : null}
                </p>
              </li>
            ))}
          </ul>
          <p className="v2-links">
            <button type="button" className="v2-link" onClick={onSeeAll}>
              See everything
            </button>
          </p>
        </>
      );
    case 'photo':
      return (
        <>
          <div className="v2-photo-big" aria-hidden="true" />
          <Sample />
          <p className="v2-p">{FAMILY_PHOTO.caption}</p>
        </>
      );
    case 'ball':
      return (
        <>
          <p className="v2-p">{FOOTBALL.line}</p>
          <Sample />
          <p className="v2-p">{FOOTBALL.extra}</p>
        </>
      );
    default:
      return null;
  }
}

function titleFor(k, i) {
  switch (k) {
    case 'window':
      return 'The next morning';
    case 'film':
      return FILMS[i].title;
    case 'book':
      return BOOKS[i].title;
    case 'game':
      return GAMES[i].title;
    case 'magnet':
      return MAGNETS[i].place;
    case 'trophy':
      return TROPHIES[i].title;
    case 'work':
      return 'Where I have worked';
    case 'papers':
      return 'Three papers';
    case 'about':
      return 'About me';
    case 'projects':
      return 'Things I built';
    case 'photo':
      return 'A family photo';
    case 'ball':
      return 'Football';
    default:
      return '';
  }
}

export default function Room({ onSeeAll }) {
  const [hover, setHover] = useState('');
  const [open, setOpen] = useState(null); // { k, i }
  const close = useCallback(() => setOpen(null), []);
  const go = (k, i) => () => setOpen({ k, i });
  const hv = (label) => ({ onMouseEnter: () => setHover(label), onMouseLeave: () => setHover(''), onFocus: () => setHover(label), onBlur: () => setHover('') });

  return (
    <footer className="v2-room" id="dusk">
      <div className="v2-room-head">
        <h2 className="v2-h2">The room</h2>
        <p className="v2-p v2-soft">My desk from my bachelor days. Everything is a button. The shelves hold sample titles until I write my own.</p>
        <p className="v2-room-caption" aria-live="polite">
          {hover || ' '}
        </p>
      </div>

      <div className="v2-stage" role="group" aria-label="The room">
        <div className="v2-wall" aria-hidden="true" />
        <div className="v2-floor" aria-hidden="true" />

        <button type="button" className="v2-ob v2-window" onClick={go('window')} {...hv('The window. The next morning.')} aria-label="The window, showing the next morning">
          <span className="v2-window-sky" aria-hidden="true">
            <span className="v2-window-sun" />
          </span>
          <span className="v2-ob-label">Window</span>
        </button>

        <div className="v2-posters">
          {FILMS.map((f, i) => (
            <button type="button" key={f.title} className="v2-ob v2-poster" style={{ background: f.tone, color: f.ink }} onClick={go('film', i)} {...hv(`Poster: ${f.title}`)}>
              <span className="v2-poster-t">{f.title}</span>
              <span className="v2-poster-s">sample</span>
            </button>
          ))}
        </div>

        <button type="button" className="v2-ob v2-wallscreen dup" onClick={go('projects')} {...hv('The wall screen. Things I built.')}>
          <span className="v2-screen-t">Things I built</span>
          <span className="v2-screen-lines" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>

        <div className="v2-games">
          <span className="v2-plank" aria-hidden="true" />
          {GAMES.map((g, i) => (
            <button type="button" key={g.title} className="v2-ob v2-case" style={{ background: g.tone }} onClick={go('game', i)} {...hv(`Game: ${g.title}`)}>
              <span>{g.title}</span>
            </button>
          ))}
        </div>

        <div className="v2-fridge" aria-label="Fridge with magnets">
          <span className="v2-fridge-line" aria-hidden="true" />
          {MAGNETS.map((m, i) => (
            <button
              type="button"
              key={m.place}
              className="v2-ob v2-magnet"
              style={{ background: m.tone, left: `${[14, 46, 74, 20, 62, 42][i]}%`, top: `${[16, 12, 20, 52, 50, 74][i]}%` }}
              onClick={go('magnet', i)}
              {...hv(`Magnet: ${m.place}`)}
              aria-label={`Magnet, ${m.place}`}
            />
          ))}
          <span className="v2-ob-label v2-fridge-label">Fridge</span>
        </div>

        <div className="v2-trophies">
          {TROPHIES.map((t, i) => (
            <button type="button" key={t.id} className="v2-ob v2-trophy" onClick={go('trophy', i)} {...hv(`${t.title}. ${t.line}`)}>
              <span className={`v2-trophy-shape ${i === 0 ? 'cup' : 'medal'}`} aria-hidden="true" />
              <span className="v2-trophy-t">{t.title}</span>
            </button>
          ))}
        </div>

        <div className="v2-shelf">
          {BOOKS.map((b, i) => (
            <button type="button" key={b.title} className="v2-ob v2-spine" style={{ background: b.spine, color: b.ink, height: `${[92, 84, 96, 80, 90, 86, 94][i]}%` }} onClick={go('book', i)} {...hv(`Book: ${b.title}`)}>
              <span>{b.title}</span>
            </button>
          ))}
          <span className="v2-ob-label v2-shelf-label">Bookshelf, sample titles</span>
        </div>

        <span className="v2-desk" aria-hidden="true" />
        <span className="v2-leg l" aria-hidden="true" />
        <span className="v2-leg r" aria-hidden="true" />

        <button type="button" className="v2-ob v2-monitor a dup" onClick={go('work')} {...hv('Monitor one. Where I have worked.')}>
          <span className="v2-screen-t">Where I have worked</span>
          <span className="v2-tiles" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </span>
        </button>
        <button type="button" className="v2-ob v2-monitor b dup" onClick={go('papers')} {...hv('Monitor two. Three papers.')}>
          <span className="v2-screen-t">Three papers</span>
          <span className="v2-pages" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </button>
        <button type="button" className="v2-ob v2-laptop dup" onClick={go('about')} {...hv('The laptop. About me.')}>
          <span className="v2-screen-t">About me</span>
        </button>
        <button type="button" className="v2-ob v2-photo" onClick={go('photo')} {...hv('A family photo. Where I come from.')} aria-label="A family photo">
          <span aria-hidden="true" />
        </button>

        <button type="button" className="v2-ob v2-ball" onClick={go('ball')} {...hv('Football and boots. I used to play.')} aria-label="Football and boots">
          <span className="v2-ball-shape" aria-hidden="true" />
          <span className="v2-boots" aria-hidden="true" />
        </button>
      </div>

      <div className="v2-colophon">
        <p>
          {ABOUT.name}. {ABOUT.place}. Every title on the shelves is a sample.
        </p>
      </div>

      <Panel open={Boolean(open)} title={open ? titleFor(open.k, open.i) : ''} onClose={close}>
        {open ? <Content k={open.k} i={open.i} onSeeAll={onSeeAll} /> : null}
      </Panel>
    </footer>
  );
}
