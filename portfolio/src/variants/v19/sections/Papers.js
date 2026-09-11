// v19 — the papers, four ways. Different objects, not the same card restyled.
//
//   pages    — each paper as its front page: venue, authors, the finding, the figures, links.
//   abstract — the abstract is the layout: the full text typeset in two columns under a
//              running head, with the numbers in it picked out. You read the paper, not a card.
//   cv       — a curriculum vitae: one bibliographic line per paper, the citation count as a
//              large numeral in the margin, nothing else. The quietest.
//   figure   — each paper is its own result, drawn: a bar for MetaRAG's 82.5 against 73.3,
//              seven of eight for TeamMedAgents. Data first, title second.

import React from 'react';
import { PAPERS } from '../copy';
import { TROPHIES } from '../personal';
import { useLab } from '../lab';
import { useOpener } from '../hooks';

const STATE = {
  ACCEPTED: { label: 'Accepted', cls: 'is-acc' },
  'Under Review': { label: 'Preprint', cls: 'is-rev' },
  'Under Preparation': { label: 'In preparation', cls: 'is-prep' },
};

// The one number each paper is about. Kept beside the copy so the figure variant has a truth.
const RESULT = {
  metarag: { kind: 'bars', label: 'Retrieval precision', a: { v: 82.5, k: 'With generated metadata' }, b: { v: 73.3, k: 'Without' }, unit: '%' },
  teammedagents: { kind: 'count', label: 'Medical benchmarks improved', a: 7, of: 8 },
};

function authorsOf(p) {
  if (!p.authors) return [];
  return Array.isArray(p.authors) ? p.authors : String(p.authors).split(/,\s*/);
}

function Authors({ p, inline }) {
  const list = authorsOf(p);
  if (!list.length) return null;
  return (
    <p className={`v19-pp-authors${inline ? ' is-inline' : ''}`}>
      {list.map((a, i) => (
        <span key={a} className={/mishra/i.test(a) ? 'is-me' : undefined}>
          {a}
          {i < list.length - 1 ? ', ' : ''}
        </span>
      ))}
    </p>
  );
}

function Links({ p }) {
  return (
    <p className="v19-view-links">
      {p.pdf ? <a href={p.pdf} target="_blank" rel="noreferrer">PDF</a> : null}
      {p.doi ? <a href={p.doi} target="_blank" rel="noreferrer">DOI</a> : null}
      {p.code ? <a href={p.code} target="_blank" rel="noreferrer">Code</a> : null}
    </p>
  );
}

/* Numbers in a run of prose, picked out. */
function Marked({ text }) {
  const parts = String(text).split(/(\d+(?:\.\d+)?%?)/g);
  return (
    <>
      {parts.map((s, i) => (/^\d/.test(s) ? <mark key={i}>{s}</mark> : <React.Fragment key={i}>{s}</React.Fragment>))}
    </>
  );
}

function Head({ eye, title }) {
  return (
    <header className="v19-head">
      <p className="v19-eye">
        <span className="v19-dot" aria-hidden="true" />
        {eye}
      </p>
      <h2 className="v19-h2 v19-h2-tight">{title}</h2>
    </header>
  );
}

function Won() {
  return (
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
  );
}

export default function Papers({ sectionRef }) {
  const { lab } = useLab();
  const look = lab.papers;
  const { open, toggle } = useOpener();

  /* ── abstract: the paper itself, typeset ── */
  if (look === 'abstract') {
    return (
      <section className="v19-slab v19-papers is-abstract" ref={sectionRef} id="papers" aria-label="Papers">
        <div className="v19-slab-in">
          <Head eye="Peer review" title="Read the abstracts." />
          <div className="v19-abs-row">
            {PAPERS.map((p) => {
              const st = STATE[p.status] || { label: p.status, cls: '' };
              return (
                <article className="v19-abs" key={p.id}>
                  <p className="v19-abs-head">
                    <span>{p.venue}</span>
                    <span className={`v19-status ${st.cls}`}>{st.label}</span>
                  </p>
                  <h3 className="v19-abs-title">{p.title}</h3>
                  <Authors p={p} inline />
                  <p className="v19-abs-label">Abstract</p>
                  <p className="v19-abs-text">
                    <Marked text={p.abstract} />
                  </p>
                  <div className="v19-abs-foot">
                    <span className="v19-abs-cite">{p.citations} citations</span>
                    <Links p={p} />
                  </div>
                </article>
              );
            })}
          </div>
          <Won />
        </div>
      </section>
    );
  }

  /* ── cv: one line each, the count in the margin ── */
  if (look === 'cv') {
    return (
      <section className="v19-slab v19-papers is-cv" ref={sectionRef} id="papers" aria-label="Papers">
        <div className="v19-slab-in">
          <Head eye="Peer review" title="Publications." />
          <ol className="v19-cv">
            {PAPERS.map((p, i) => {
              const st = STATE[p.status] || { label: p.status, cls: '' };
              const list = authorsOf(p);
              return (
                <li className="v19-cv-row" key={p.id}>
                  <span className="v19-cv-n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <div className="v19-cv-body">
                    <p className="v19-cv-line">
                      {list.map((a, k) => (
                        <span key={a} className={/mishra/i.test(a) ? 'is-me' : undefined}>
                          {a}
                          {k < list.length - 1 ? ', ' : '. '}
                        </span>
                      ))}
                      <i>{p.title}.</i> <b>{p.venue}</b>, {p.year}. <span className={`v19-status ${st.cls}`}>{st.label}</span>
                    </p>
                    <p className="v19-cv-says">{p.line}</p>
                    <Links p={p} />
                  </div>
                  <div className="v19-cv-cite">
                    <b>{p.citations}</b>
                    <span>citations</span>
                  </div>
                </li>
              );
            })}
          </ol>
          <Won />
        </div>
      </section>
    );
  }

  /* ── figure: the result, drawn ── */
  if (look === 'figure') {
    return (
      <section className="v19-slab v19-papers is-figure" ref={sectionRef} id="papers" aria-label="Papers">
        <div className="v19-slab-in">
          <Head eye="Peer review" title="What each paper found." />
          <div className="v19-fig-row">
            {PAPERS.map((p) => {
              const r = RESULT[p.id];
              const st = STATE[p.status] || { label: p.status, cls: '' };
              return (
                <article className="v19-fig" key={p.id}>
                  <p className="v19-fig-label">{r ? r.label : 'Result'}</p>
                  {r && r.kind === 'bars' ? (
                    <div className="v19-fig-bars" role="img" aria-label={`${r.a.k} ${r.a.v}${r.unit}, ${r.b.k} ${r.b.v}${r.unit}`}>
                      {[r.a, r.b].map((bar, i) => (
                        <div className="v19-fig-bar" key={bar.k}>
                          <span className="v19-fig-k">{bar.k}</span>
                          <span className="v19-fig-track">
                            <span className={`v19-fig-fill${i === 0 ? ' is-hot' : ''}`} style={{ '--w': `${bar.v}%` }} />
                          </span>
                          <b className="v19-fig-v">{bar.v}{r.unit}</b>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {r && r.kind === 'count' ? (
                    <div className="v19-fig-count" role="img" aria-label={`${r.a} of ${r.of}`}>
                      <div className="v19-fig-cells">
                        {Array.from({ length: r.of }).map((_, i) => (
                          <span key={i} className={i < r.a ? 'on' : ''} />
                        ))}
                      </div>
                      <b className="v19-fig-v">{r.a} of {r.of}</b>
                    </div>
                  ) : null}
                  <h3 className="v19-fig-title">{p.title}</h3>
                  <p className="v19-fig-meta">
                    <span className={`v19-status ${st.cls}`}>{st.label}</span>
                    <span>{p.venue}</span>
                    <span>{p.citations} citations</span>
                  </p>
                  <Links p={p} />
                </article>
              );
            })}
          </div>
          <Won />
        </div>
      </section>
    );
  }

  /* ── pages: the front page of each ── */
  return (
    <section className="v19-slab v19-papers" ref={sectionRef} id="papers" aria-label="Papers">
      <div className="v19-slab-in">
        <Head eye="Peer review" title="Two papers, and what they found." />
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
                <Authors p={p} />
                <p className="v19-pp-line">{p.line}</p>
                <dl className="v19-pp-figs">
                  <div><dt>Citations</dt><dd>{p.citations}</dd></div>
                  <div><dt>Year</dt><dd>{p.year}</dd></div>
                  <div><dt>Code</dt><dd>{p.code ? 'Open' : '—'}</dd></div>
                </dl>
                <div className="v19-pp-foot">
                  <button type="button" className="v19-pp-more" onClick={() => toggle(p.id)} aria-expanded={isOpen} data-keep-open="">
                    {isOpen ? 'Hide the abstract' : 'Read the abstract'}
                  </button>
                  <Links p={p} />
                </div>
                <div className="v19-pp-abs" hidden={!isOpen}>
                  <p>{p.abstract}</p>
                </div>
              </article>
            );
          })}
        </div>
        <Won />
      </div>
    </section>
  );
}
