// v19 — the first screen.
//
// The face, the name, a short intro, four buttons, and where I work, last. Two faces only: the
// display face for the name and the buttons, the body face for everything else.

import React from 'react';
import { Link } from 'react-router-dom';
import { ME, LINKS, GO, LETTERBOXD, ALFRED } from '../copy';

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
      <button type="button" className="v19-land-go" onClick={onGo} aria-label={GO.label}>
        <span className="v19-go-roll" aria-hidden="true">
          <span>{GO.label}</span>
          <span>Light the fuse</span>
        </span>
        <i className="v19-go-spark" aria-hidden="true" />
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
      {/* films: a ticket stub tucked on the corner of the photo */}
      <a className="v19-ticket" href={LETTERBOXD} target="_blank" rel="noreferrer" aria-label="My films on Letterboxd">
        <span className="v19-ticket-k">Admit one</span>
        <span className="v19-ticket-v">
          <img src="/assets/images/icons/letterboxd.svg" alt="" />
          paranoid_critic
        </span>
      </a>
      {/* where I work: a caption on the photo, the way a badge says it, not a tagline */}
      <figcaption className="v19-land-badge">
        <img src={ALFRED.logo} alt="" />
        <span>{ME.role}</span>
      </figcaption>
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
          <p className="v19-land-intro">
            {ME.intro}{' '}
            <span className="v19-int is-games" tabIndex={0}>designing games</span>,{' '}
            <a className="v19-int is-film" href={LETTERBOXD} target="_blank" rel="noreferrer" title="What I've been watching, on Letterboxd">watching films</a>, or{' '}
            <span className="v19-int is-ball" tabIndex={0}>playing football</span>.
          </p>
          <Links onGo={onGo} />
        </div>
      </div>
      {Hint}
    </div>
  );
}
