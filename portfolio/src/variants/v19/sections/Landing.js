// v19 — the first screen.
//
// The face, the name, one line, a short intro, four buttons. The face beside the name, set in
// mono. The intro is what I do and what I love; where I work comes after the wall.

import React from 'react';
import { Link } from 'react-router-dom';
import { ME, LINKS, GO } from '../copy';
import { INTRO, usePick } from '../pick';

function Links({ onGo }) {
  return (
    <nav className="v19-land-links" aria-label="Elsewhere">
      {LINKS.map((l) =>
        l.href.startsWith('http') ? (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
        ) : (
          <Link key={l.label} to={l.href}>{l.label}</Link>
        )
      )}
      <button type="button" className="v19-land-go" onClick={onGo}>
        {GO.label}
      </button>
    </nav>
  );
}

function Name() {
  return (
    <h1 className="v19-land-name">
      <span>{ME.first}</span>
      <span>{ME.last}</span>
    </h1>
  );
}

function Face({ className }) {
  return (
    <figure className={`v19-land-face ${className || ''}`}>
      <img src={ME.photo} alt={ME.photoAlt} />
    </figure>
  );
}

export default function Landing({ hint, onGo }) {
  const pick = usePick();
  const Hint = (
    <p className="v19-land-hint">
      <span className="v19-land-hint-key" aria-hidden="true">
        <i />
      </span>
      {hint}
    </p>
  );

  return (
    <div className="v19-land is-plate">
      <div className="v19-land-in">
        <Face />
        <div className="v19-land-words">
          <Name />
          <p className="v19-land-role">{ME.role}</p>
          <p className="v19-land-intro">{INTRO[pick.intro]}</p>
          <Links onGo={onGo} />
        </div>
      </div>
      {Hint}
    </div>
  );
}
