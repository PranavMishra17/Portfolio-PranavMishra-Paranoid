// v19 — the first screen.
//
// Four things — the face, the name, one line, four buttons — and never a fifth. The face beside
// the name, set in mono.

import React from 'react';
import { ME, LINKS, GO } from '../copy';

function Links({ onGo }) {
  return (
    <nav className="v19-land-links" aria-label="Elsewhere">
      {LINKS.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target={l.href.startsWith('http') ? '_blank' : undefined}
          rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
        >
          {l.label}
        </a>
      ))}
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
          <Links onGo={onGo} />
        </div>
      </div>
      {Hint}
    </div>
  );
}
