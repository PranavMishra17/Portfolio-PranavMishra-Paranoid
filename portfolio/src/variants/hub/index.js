// /variants — the one page that links every proposal. Run `npm start` and open http://localhost:3000/variants
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './hub.css';

const VARIANTS = [
  { path: '/v5', name: 'Variant five', note: 'A day outside, then home. Computed sky, colour taken from it, a hand-drawn pixel room with a real window.' },
  { path: '/v1', name: 'Variant one', note: 'The day is the navigation. A timetable rail, a sky that keeps its time, a drawn room at dusk.' },
  { path: '/v2', name: 'Variant two', note: 'The horizon. Sky above, ground below, words only on the ground; the room typeset in HTML.' },
  { path: '/v3', name: 'Variant three', note: 'The rail is a sundial. Sections sit at their hour on one line; a sun slides down it with a clock.' },
  { path: '/v4', name: 'Variant four', note: 'A sundial rail with a horizon line the sun sinks below; an ink-on-paper room.' },
];

export default function VariantsHub() {
  useEffect(() => {
    document.body.classList.add('hub-body');
    return () => document.body.classList.remove('hub-body');
  }, []);

  return (
    <main className="hub">
      <header className="hub-head">
        <h1>Four proposals for pranavmishra.dev</h1>
        <p>
          One sky, four screens, a room at the bottom. Each route below is a separate take on the same
          brief. The current site is untouched at <Link to="/">/</Link>; the resume is still at{' '}
          <Link to="/resume">/resume</Link>.
        </p>
      </header>
      <ol className="hub-list">
        {VARIANTS.map((v) => (
          <li key={v.path}>
            <Link to={v.path} className="hub-card">
              <span className="hub-route">{v.path}</span>
              <span className="hub-name">{v.name}</span>
              <span className="hub-note">{v.note}</span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
