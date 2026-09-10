// v18 — written, and won. Three papers with their status stated plainly, and the two trophies.
// Same opener as everywhere else: the line is the button, the abstract slides under it.

import React from 'react';
import { PAPERS } from '../copy';
import { TROPHIES } from '../personal';
import { useOpener } from '../hooks';

const STATE = {
  ACCEPTED: { label: 'Accepted', cls: 'is-acc' },
  'Under Review': { label: 'Under review', cls: 'is-rev' },
  'Under Preparation': { label: 'In preparation', cls: 'is-prep' },
};

export default function Papers({ sectionRef }) {
  const { open, toggle } = useOpener();

  return (
    <section className="v18-slab v18-papers" ref={sectionRef} id="papers" aria-label="Papers">
      <div className="v18-slab-in">
        <header className="v18-head">
          <p className="v18-eye">
            <span className="v18-dot" aria-hidden="true" />
            Three papers
          </p>
          <h2 className="v18-h2 v18-h2-tight">Written down properly.</h2>
        </header>

        <div className="v18-paperlist">
          {PAPERS.map((p) => {
            const st = STATE[p.status] || { label: p.status, cls: '' };
            const isOpen = open === p.id;
            return (
              <article className={`v18-paper${isOpen ? ' is-open' : ''}`} key={p.id} data-keep-open={isOpen ? '' : undefined}>
                <button type="button" className="v18-paper-line" onClick={() => toggle(p.id)} aria-expanded={isOpen} data-keep-open="">
                  <span className={`v18-status ${st.cls}`}>{st.label}</span>
                  <span className="v18-paper-mid">
                    <b>{p.title}</b>
                    <i>{p.line}</i>
                  </span>
                  <span className="v18-paper-meta">
                    {p.venue}
                    {p.citations ? <em>{p.citations} citations</em> : null}
                  </span>
                  <span className="v18-role-chev" aria-hidden="true" />
                </button>

                <div className="v18-paper-more" hidden={!isOpen}>
                  <p className="v18-paper-abs">{p.abstract}</p>
                  <p className="v18-view-links">
                    {p.pdf ? <a href={p.pdf} target="_blank" rel="noreferrer">Read it</a> : null}
                    {p.doi ? <a href={p.doi} target="_blank" rel="noreferrer">DOI</a> : null}
                    {p.code ? <a href={p.code} target="_blank" rel="noreferrer">Code</a> : null}
                  </p>
                  {p.authors ? <p className="v18-paper-who">{Array.isArray(p.authors) ? p.authors.join(', ') : p.authors}</p> : null}
                </div>
              </article>
            );
          })}
        </div>

        <div className="v18-trophies">
          <p className="v18-mini">Won</p>
          <div className="v18-trophy-row">
            {TROPHIES.map((t) => (
              <article className="v18-trophy" key={t.id}>
                <img src={t.image} alt="" loading="lazy" />
                <div>
                  <h3>{t.name}</h3>
                  <p>{t.what}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
