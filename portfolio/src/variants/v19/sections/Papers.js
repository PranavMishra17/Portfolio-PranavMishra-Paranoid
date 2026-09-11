// v19 — the papers.
//
// Two of them, not three: the SLM paper covers the same ground as TeamMedAgents and came off
// at his request. With only two left there is room to show them as what they are — the front
// page of a paper — rather than as two rows in a list.

import React from 'react';
import { PAPERS } from '../copy';
import { TROPHIES } from '../personal';
import { useOpener } from '../hooks';

const STATE = {
  ACCEPTED: { label: 'Accepted', cls: 'is-acc' },
  'Under Review': { label: 'Preprint', cls: 'is-rev' },
  'Under Preparation': { label: 'In preparation', cls: 'is-prep' },
};

function Authors({ authors }) {
  if (!authors) return null;
  const list = Array.isArray(authors) ? authors : String(authors).split(/,\s*/);
  return (
    <p className="v19-pp-authors">
      {list.map((a, i) => (
        <span key={a} className={/mishra/i.test(a) ? 'is-me' : undefined}>
          {a}
          {i < list.length - 1 ? ', ' : ''}
        </span>
      ))}
    </p>
  );
}

export default function Papers({ sectionRef }) {
  const { open, toggle } = useOpener();

  return (
    <section className="v19-slab v19-papers" ref={sectionRef} id="papers" aria-label="Papers">
      <div className="v19-slab-in">
        <header className="v19-head">
          <p className="v19-eye">
            <span className="v19-dot" aria-hidden="true" />
            Peer review
          </p>
          <h2 className="v19-h2 v19-h2-tight">Two papers, and what they found.</h2>
        </header>

        <div className="v19-pp-row">
          {PAPERS.map((p) => {
            const st = STATE[p.status] || { label: p.status, cls: '' };
            const isOpen = open === p.id;
            return (
              <article className={`v19-pp${isOpen ? ' is-open' : ''}`} key={p.id} data-keep-open={isOpen ? '' : undefined}>
                <header className="v19-pp-top">
                  <span className={`v19-status ${st.cls}`}>{st.label}</span>
                  <span className="v19-pp-venue">{p.venue}</span>
                </header>

                <h3 className="v19-pp-title">{p.title}</h3>
                <Authors authors={p.authors} />

                <p className="v19-pp-line">{p.line}</p>

                <dl className="v19-pp-figs">
                  <div>
                    <dt>Citations</dt>
                    <dd>{p.citations}</dd>
                  </div>
                  <div>
                    <dt>Year</dt>
                    <dd>{p.year}</dd>
                  </div>
                  <div>
                    <dt>Code</dt>
                    <dd>{p.code ? 'Open' : '—'}</dd>
                  </div>
                </dl>

                <div className="v19-pp-foot">
                  <button type="button" className="v19-pp-more" onClick={() => toggle(p.id)} aria-expanded={isOpen} data-keep-open="">
                    {isOpen ? 'Hide the abstract' : 'Read the abstract'}
                  </button>
                  <p className="v19-view-links">
                    {p.pdf ? <a href={p.pdf} target="_blank" rel="noreferrer">PDF</a> : null}
                    {p.doi ? <a href={p.doi} target="_blank" rel="noreferrer">DOI</a> : null}
                    {p.code ? <a href={p.code} target="_blank" rel="noreferrer">Code</a> : null}
                  </p>
                </div>

                <div className="v19-pp-abs" hidden={!isOpen}>
                  <p>{p.abstract}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="v19-trophies">
          <p className="v19-mini">Won</p>
          <div className="v19-trophy-row">
            {TROPHIES.map((t) => (
              <article className="v19-trophy" key={t.id}>
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
