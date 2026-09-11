// v19 — the first screen, cut back.
//
// v18 had six things competing: an eyebrow, a name, a lede, two more paragraphs, a link row
// and a hint, across two families and five sizes. It read as noise. This is four things, one
// family, three sizes: the face, the name, one line, the links. Nothing else.

import React from 'react';
import { ME, LINKS } from '../copy';

export default function Landing({ hint }) {
  return (
    <div className="v19-land">
      <div className="v19-land-in">
        <figure className="v19-land-face">
          <img src={ME.photo} alt={ME.photoAlt} />
        </figure>

        <div className="v19-land-words">
          <h1 className="v19-land-name">
            <span>{ME.first}</span>
            <span>{ME.last}</span>
          </h1>
          <p className="v19-land-role">{ME.role}</p>
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
          </nav>
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
