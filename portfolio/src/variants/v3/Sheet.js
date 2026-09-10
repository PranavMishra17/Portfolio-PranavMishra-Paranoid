// Variant 3 — what a room object opens. A side sheet on desktop, a bottom
// sheet on phones. Monitors, laptop and wall screen render the same panels as
// sections 2 and 3; everything else is personal and appears only here.
import React, { useEffect, useRef } from 'react';
import { AboutPanel, WorkPanel, PapersPanel, ProjectsPanel } from './panels';
import { HOTSPOTS } from './Room';
import { SUNRISE, hourAt } from './sky';
import { trophies } from './copy';
import { SAMPLE_NOTICE, films, books, games, magnets, familyPhoto, football } from './personal';

function Sample() {
  return <p className="v3-sample">{SAMPLE_NOTICE}</p>;
}

function Body({ id, onSeeEverything, onGoTop }) {
  switch (id) {
    case 'window':
      return (
        <div className="v3-window">
          <div
            className="v3-window-sky"
            style={{ background: `linear-gradient(180deg, ${SUNRISE.top}, ${SUNRISE.mid} 55%, ${SUNRISE.bot})` }}
            aria-hidden="true"
          >
            <i style={{ background: SUNRISE.sun }} />
          </div>
          <p className="v3-window-time">Tomorrow, {hourAt(0)}.</p>
          <p>The page runs from morning to sunset. The window in the room is already on the next day, sun just up. If you want the morning back, it is at the top.</p>
          <p><button type="button" className="v3-link" onClick={onGoTop}>Back to the morning</button></p>
        </div>
      );
    case 'posters':
      return (
        <div>
          <Sample />
          <ul className="v3-plist">
            {films.map((f) => (
              <li key={f.title}>
                <span className="v3-swatch" style={{ background: f.hue }} aria-hidden="true" />
                <div>
                  <p className="v3-plist-title">{f.title} <span className="v3-plist-meta">{f.year}</span></p>
                  <p className="v3-plist-note">{f.why}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'books':
      return (
        <div>
          <Sample />
          <h4 className="v3-h4">Reading now</h4>
          <ul className="v3-plist">
            {books.reading.map((b) => (
              <li key={b.title}><span className="v3-swatch" style={{ background: b.hue }} aria-hidden="true" /><div><p className="v3-plist-title">{b.title}</p><p className="v3-plist-note">{b.author}</p></div></li>
            ))}
          </ul>
          <h4 className="v3-h4">Recently finished</h4>
          <ul className="v3-plist">
            {books.finished.map((b) => (
              <li key={b.title}><span className="v3-swatch" style={{ background: b.hue }} aria-hidden="true" /><div><p className="v3-plist-title">{b.title}</p><p className="v3-plist-note">{b.author}</p></div></li>
            ))}
          </ul>
        </div>
      );
    case 'games':
      return (
        <div>
          <Sample />
          <ul className="v3-plist">
            {games.map((g) => (
              <li key={g.title}><span className="v3-swatch" style={{ background: g.hue }} aria-hidden="true" /><div><p className="v3-plist-title">{g.title}</p><p className="v3-plist-note">{g.note}</p></div></li>
            ))}
          </ul>
        </div>
      );
    case 'magnets':
      return (
        <div>
          <Sample />
          <ul className="v3-plist">
            {magnets.map((m) => (
              <li key={m.place}>
                <span className={`v3-swatch${m.shape === 'round' ? ' is-round' : ''}`} style={{ background: m.hue }} aria-hidden="true" />
                <div><p className="v3-plist-title">{m.place}</p><p className="v3-plist-note">{m.memory}</p></div>
              </li>
            ))}
          </ul>
        </div>
      );
    case 'trophies':
      return (
        <div className="v3-trophies">
          {trophies.map((t) => (
            <figure key={t.id}>
              <img src={t.image} alt={t.title} loading="lazy" />
              <figcaption><p className="v3-plist-title">{t.title}</p><p className="v3-plist-note">{t.line}</p></figcaption>
            </figure>
          ))}
        </div>
      );
    case 'photo':
      return (
        <div>
          <Sample />
          <div className="v3-photo-frame" aria-hidden="true" />
          <p>{familyPhoto.caption}</p>
        </div>
      );
    case 'football':
      return (
        <div>
          <p className="v3-headline">{football.line}</p>
          <Sample />
          <p>{football.detail}</p>
        </div>
      );
    case 'monitorA':
      return <WorkPanel inRoom />;
    case 'monitorB':
      return <PapersPanel />;
    case 'laptop':
      return <AboutPanel inRoom />;
    case 'screen':
      return <ProjectsPanel inRoom onSeeEverything={onSeeEverything} />;
    default:
      return null;
  }
}

export default function Sheet({ id, onClose, onSeeEverything, onGoTop }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!id) return undefined;
    const prev = document.activeElement;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('v3-locked');
    if (closeRef.current) closeRef.current.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('v3-locked');
      if (prev && prev.focus) prev.focus();
    };
  }, [id, onClose]);

  if (!id) return null;
  const meta = HOTSPOTS[id];
  return (
    <div className="v3-sheet-wrap" role="presentation">
      <button type="button" className="v3-scrim" aria-label="Close" onClick={onClose} />
      <section className="v3-sheet" role="dialog" aria-modal="true" aria-labelledby="v3-sheet-title">
        <header className="v3-sheet-head">
          <div>
            <h2 id="v3-sheet-title">{meta.label}</h2>
            <p className="v3-sheet-opens">{meta.opens}</p>
          </div>
          <button type="button" ref={closeRef} className="v3-close" onClick={onClose} aria-label="Close">×</button>
        </header>
        <div className="v3-sheet-body">
          <Body id={id} onSeeEverything={onSeeEverything} onGoTop={onGoTop} />
        </div>
      </section>
    </div>
  );
}
