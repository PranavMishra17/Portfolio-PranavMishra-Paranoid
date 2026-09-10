// Variant 1 — screen three. Seven things, static, revealing on hover (Ikeda §4), then the three papers.
// Rendered on the page and again inside the room's wall screen and second monitor.
import React, { useState } from 'react';
import { FEATURED, PAPERS, ALL_PROJECTS } from './copy';

export function Projects({ onSeeAll, inPanel = false }) {
  const [active, setActive] = useState(0);
  const current = FEATURED[active] || FEATURED[0];

  return (
    <div className={`v1-works${inPanel ? ' in-panel' : ''}`}>
      <ul className="v1-list">
        {FEATURED.map((p, i) => (
          <li
            key={p.id}
            className={`v1-item${i === active ? ' on' : ''}`}
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
          >
            <h3 className="v1-item-t">{p.title}</h3>
            <p className="v1-item-line">{p.line}</p>
            <div className="v1-item-links">
              {p.link ? (
                <a className="v1-link" href={p.link} target="_blank" rel="noopener noreferrer">
                  {p.action}
                </a>
              ) : null}
              {p.github && p.github !== p.link ? (
                <a className="v1-link" href={p.github} target="_blank" rel="noopener noreferrer">
                  Code
                </a>
              ) : null}
            </div>
            <div className={`v1-thumb${p.square ? ' sq' : ''}`}>
              <img src={p.image} alt="" loading="lazy" />
            </div>
          </li>
        ))}
      </ul>
      {!inPanel ? (
        <figure className="v1-viewer" aria-hidden="true">
          <div className={`v1-frame${current.square ? ' sq' : ''}`}>
            <img src={current.image} alt="" />
          </div>
          <figcaption>{current.title}</figcaption>
        </figure>
      ) : null}
      {onSeeAll ? (
        <p className="v1-seeall-row">
          <button type="button" className="v1-seeall" onClick={onSeeAll}>
            See everything, all {ALL_PROJECTS.length} of them
          </button>
        </p>
      ) : null}
    </div>
  );
}

export function Papers() {
  return (
    <ul className="v1-papers">
      {PAPERS.map((p) => (
        <li className="v1-paper" key={p.id}>
          <div className="v1-paper-meta">
            <span className={`v1-status${p.accepted ? ' acc' : ''}`}>{p.status}</span>
            <span className="v1-venue">{p.venue}</span>
            {p.citations ? <span className="v1-cites">{p.citations} citations</span> : null}
          </div>
          <div>
            <h3 className="v1-paper-t">{p.short}</h3>
            <p className="v1-paper-line">{p.line}</p>
            <div className="v1-item-links">
              {p.pdf ? (
                <a className="v1-link" href={p.pdf} target="_blank" rel="noopener noreferrer">
                  Paper
                </a>
              ) : null}
              {p.code ? (
                <a className="v1-link" href={p.code} target="_blank" rel="noopener noreferrer">
                  Code
                </a>
              ) : null}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function Built({ onSeeAll }) {
  return (
    <>
      <h2 className="v1-h2">Built and written</h2>
      <p className="v1-p v1-muted">Seven things I would show you first. Move over one to see it.</p>
      <Projects onSeeAll={onSeeAll} />
      <h3 className="v1-h3">Three papers</h3>
      <Papers />
    </>
  );
}
