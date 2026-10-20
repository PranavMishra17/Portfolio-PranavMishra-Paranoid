// v19 — the first screen.
//
// The face with where I work as its caption, the name, a short intro that ends on what I love,
// and the buttons. Two faces only: the display face for the name and the buttons, the body face
// for everything else.

import React from 'react';
import { Link } from 'react-router-dom';
import { ME, LINKS, GO, LETTERBOXD, ALFRED } from '../copy';
import { OPEN, usePick } from '../pick';

const LB = '/assets/images/icons/letterboxd.svg';

function Links({ onGo, films }) {
  return (
    <nav className="v19-land-links" aria-label="Elsewhere">
      {LINKS.map((l) =>
        l.href.startsWith('http') ? (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
        ) : (
          <Link key={l.label} to={l.href}>{l.label}</Link>
        )
      )}
      {films === 'c' ? (
        <a className="v19-land-film" href={LETTERBOXD} target="_blank" rel="noreferrer" title="paranoid_critic on Letterboxd">
          <img src={LB} alt="" />
          Films
        </a>
      ) : null}
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

/* "watching films", three ways of saying it goes to Letterboxd */
function Films({ v }) {
  if (v === 'a') {
    return (
      <a className="v19-int is-film is-marquee" href={LETTERBOXD} target="_blank" rel="noreferrer">
        watching films
        <span className="v19-marquee" aria-hidden="true">
          <span className="v19-marquee-k">Now showing</span>
          <span className="v19-marquee-v">paranoid_critic</span>
          <span className="v19-marquee-s">on Letterboxd</span>
        </span>
      </a>
    );
  }
  if (v === 'b') {
    return (
      <span className="v19-filmset">
        <a className="v19-int is-film" href={LETTERBOXD} target="_blank" rel="noreferrer">watching films</a>
        <a className="v19-lbdots" href={LETTERBOXD} target="_blank" rel="noreferrer" aria-label="paranoid_critic on Letterboxd">
          <img src={LB} alt="" />
          <span>paranoid_critic</span>
        </a>
      </span>
    );
  }
  return <a className="v19-int is-film" href={LETTERBOXD} target="_blank" rel="noreferrer">watching films</a>;
}

function Name() {
  return (
    <h1 className="v19-land-name">
      <span>{ME.first}</span>
      <span>{ME.last}</span>
    </h1>
  );
}

function Face() {
  return (
    <figure className="v19-land-face">
      <img src={ME.photo} alt={ME.photoAlt} />
      {/* where I work: a caption on the photo, the way a badge says it, not a tagline */}
      <figcaption className="v19-land-badge">
        <img src={ALFRED.logo} alt="" />
        <span>{ME.role}</span>
      </figcaption>
    </figure>
  );
}

export default function Landing({ hint, onGo }) {
  const pick = usePick();
  return (
    <div className="v19-land is-plate">
      <div className="v19-land-in">
        <Face />
        <div className="v19-land-words">
          <Name />
          <p className="v19-land-intro">
            {OPEN[pick.open]} {ME.intro}{' '}
            <span className="v19-int is-games" tabIndex={0}>designing games</span>,{' '}
            <Films v={pick.films} />, or{' '}
            <span className="v19-int is-ball" tabIndex={0}>playing football</span>.
          </p>
          <Links onGo={onGo} films={pick.films} />
        </div>
      </div>
      <p className="v19-land-hint">
        <span className="v19-land-hint-key" aria-hidden="true">
          <i />
        </span>
        {hint}
      </p>
    </div>
  );
}
