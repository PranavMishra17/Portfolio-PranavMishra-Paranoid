// v19 — the first screen.
//
// The face with where I work as its caption, the name, a short intro that ends on what I love,
// and the buttons. Two faces only: the display face for the name and the buttons, the body face
// for everything else.

import React from 'react';
import { Link } from 'react-router-dom';
import { ME, LINKS, GO, LETTERBOXD, ALFRED } from '../copy';

const LB = '/assets/images/icons/letterboxd.svg';

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

/* "watching films" and the Letterboxd dots are one link with a target much bigger than the words:
   the wall has no cursor, so the box around them has to be easy to land in */
function Films() {
  return (
    <a className="v19-filmset" href={LETTERBOXD} target="_blank" rel="noreferrer" aria-label="watching films: paranoid_critic on Letterboxd">
      <span className="v19-int is-film">watching films</span>
      <span className="v19-lbdots" aria-hidden="true">
        <img src={LB} alt="" />
        <span>paranoid_critic</span>
      </span>
    </a>
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

export default function Landing({ hint, onGo, scroll }) {
  return (
    <div className="v19-land is-plate">
      <div className="v19-land-in">
        <Face />
        <div className="v19-land-words">
          <Name />
          <p className="v19-land-intro">{ME.intro}</p>
          {/* what I love, on its own line, in the same voice and colour as the rest */}
          <p className="v19-land-intro is-away">
            Away from the desk, I'm{' '}
            <span className="v19-int">playing and designing games</span>,{' '}
            <Films />, or{' '}
            <span className="v19-int is-ball" tabIndex={0}>out on a football pitch</span>.
          </p>
          <Links onGo={onGo} />
        </div>
      </div>
      <p className="v19-land-hint">
        <span className={`v19-land-hint-key${scroll ? ' is-scroll' : ''}`} aria-hidden="true">
          <i />
        </span>
        {hint}
      </p>
    </div>
  );
}
