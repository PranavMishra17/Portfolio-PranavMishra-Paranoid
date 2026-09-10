// v18 — the first screen. It is a landing page that happens to be painted on a wall, not a
// blank surface with a hint on it: name, face, what I do, where to find me. All of it real
// DOM, so it is selectable, focusable and readable by a screen reader while the wall is up.

import React from 'react';
import { ME, LINKS } from '../copy';

export default function Landing({ hint }) {
  return (
    <div className="v18-land">
      <div className="v18-land-in">
        <figure className="v18-land-face" data-blow>
          <img src={ME.photo} alt={ME.photoAlt} />
          <span className="v18-land-ring" aria-hidden="true" />
        </figure>

        <div className="v18-land-words">
          <p className="v18-land-eye" data-blow>
            <span className="v18-dot" aria-hidden="true" />
            {ME.now}
          </p>

          <h1 className="v18-land-name" data-blow>
            {ME.first}
            <br />
            <span>{ME.last}</span>
          </h1>

          <p className="v18-land-lede" data-blow>{ME.lede}</p>

          <div className="v18-land-lines" data-blow>
            {ME.lines.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>

          <nav className="v18-land-links" aria-label="Elsewhere" data-blow>
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
          </nav>
        </div>
      </div>

      <p className="v18-land-hint" data-blow>
        <span className="v18-land-hint-key" aria-hidden="true" />
        {hint}
      </p>

      <p className="v18-land-where" data-blow>{ME.location}</p>
    </div>
  );
}
