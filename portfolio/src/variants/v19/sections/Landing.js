// v19 — the first screen, in five arrangements.
//
// The same four things every time — the face, the name, one line, four buttons — and never a
// fifth. What changes between them is the hierarchy: which of the four is the thing you see
// first, and where your eye goes after that. All of them are quiet.
//
//   plate     — the face beside the name. The one he said was the best so far.
//   masthead  — the name runs the full width like a newspaper title; the face sits under it.
//   centred   — everything on one axis, the face above the name. The quietest.
//   split     — the face is the whole left half of the screen; the wall is the right half.
//   ledger    — the role is the hero, set huge; the name becomes a small letterhead.

import React from 'react';
import { ME, LINKS, GO } from '../copy';

function Links({ onGo, vertical }) {
  return (
    <nav className={`v19-land-links${vertical ? ' is-vertical' : ''}`} aria-label="Elsewhere">
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

function Name({ oneLine }) {
  return oneLine ? (
    <h1 className="v19-land-name is-line">
      {ME.first} {ME.last}
    </h1>
  ) : (
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

export default function Landing({ hint, look = 'plate', onGo }) {
  const Hint = (
    <p className="v19-land-hint">
      <span className="v19-land-hint-key" aria-hidden="true">
        <i />
      </span>
      {hint}
    </p>
  );

  if (look === 'masthead') {
    return (
      <div className="v19-land is-masthead">
        <Name oneLine />
        <div className="v19-land-under">
          <div>
            <p className="v19-land-role">{ME.role}</p>
            <Links onGo={onGo} />
          </div>
          <Face className="is-small" />
        </div>
        {Hint}
      </div>
    );
  }

  if (look === 'centred') {
    return (
      <div className="v19-land is-centred">
        <div className="v19-land-axis">
          <Face className="is-medium" />
          <Name />
          <p className="v19-land-role">{ME.role}</p>
          <Links onGo={onGo} />
        </div>
        {Hint}
      </div>
    );
  }

  if (look === 'split') {
    return (
      <div className="v19-land is-split">
        <Face className="is-half" />
        <div className="v19-land-half">
          <Name />
          <p className="v19-land-role">{ME.role}</p>
          <Links onGo={onGo} />
        </div>
        {Hint}
      </div>
    );
  }

  if (look === 'ledger') {
    return (
      <div className="v19-land is-ledger">
        <p className="v19-land-letterhead">
          {ME.first} {ME.last}
        </p>
        <h1 className="v19-land-hero">{ME.role}</h1>
        <div className="v19-land-foot">
          <Links onGo={onGo} vertical />
          <Face className="is-small" />
        </div>
        {Hint}
      </div>
    );
  }

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
