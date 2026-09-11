// v19 — the papers, three ways. Different objects, not one card restyled.
//
//   figure   — the result, drawn: a bar for MetaRAG's 82.5 against 73.3, seven of eight cells
//              for TeamMedAgents. Data first, the title second. The one he liked.
//   abstract — a real sheet of paper, opaque, with the opening of the abstract set on it and
//              the rest a click away. Nothing shows through from the page behind.
//   brief    — one sheet carrying both: the drawing on the left, the first lines on the right.
//
// The citation count is a figure in all three, never a footnote, and the awards underneath open
// the same way everything else on this site opens.

import React, { useState } from 'react';
import { PAPERS, ALL_PROJECTS } from '../copy';
import { TROPHIES } from '../personal';
import { useLab } from '../lab';
import { useOpener } from '../hooks';

const STATE = {
  ACCEPTED: { label: 'Accepted', cls: 'is-acc' },
  'Under Review': { label: 'Preprint', cls: 'is-rev' },
  'Under Preparation': { label: 'In preparation', cls: 'is-prep' },
};

// The one number each paper is about, kept beside the copy so the drawing has a truth.
const RESULT = {
  metarag: { kind: 'bars', label: 'Retrieval precision', a: { v: 82.5, k: 'With generated metadata' }, b: { v: 73.3, k: 'Without' }, unit: '%' },
  teammedagents: { kind: 'count', label: 'Medical benchmarks improved', a: 7, of: 8 },
};

// which project each award came out of, so the award can show its own work
const FROM = { mit: 'snaider-cut', hint: 'virtual-van-gogh' };

const OPENING = 260;

function authorsOf(p) {
  if (!p.authors) return [];
  return Array.isArray(p.authors) ? p.authors : String(p.authors).split(/,\s*/);
}

function Authors({ p }) {
  const list = authorsOf(p);
  if (!list.length) return null;
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

function Links({ p }) {
  return (
    <p className="v19-view-links">
      {p.pdf ? <a href={p.pdf} target="_blank" rel="noreferrer">PDF</a> : null}
      {p.doi ? <a href={p.doi} target="_blank" rel="noreferrer">DOI</a> : null}
      {p.code ? <a href={p.code} target="_blank" rel="noreferrer">Code</a> : null}
    </p>
  );
}

function Cite({ n }) {
  return (
    <span className="v19-cite" title="Citations">
      <b>{n}</b>
      <i>citations</i>
    </span>
  );
}

function Status({ p }) {
  const st = STATE[p.status] || { label: p.status, cls: '' };
  return <span className={`v19-status ${st.cls}`}>{st.label}</span>;
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

/* The drawing. Shared by figure and brief. */
function Drawing({ p }) {
  const r = RESULT[p.id];
  if (!r) return null;
  if (r.kind === 'bars') {
    return (
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
    );
  }
  return (
    <div className="v19-fig-count" role="img" aria-label={`${r.a} of ${r.of}`}>
      <div className="v19-fig-cells">
        {Array.from({ length: r.of }).map((_, i) => (
          <span key={i} className={i < r.a ? 'on' : ''} />
        ))}
      </div>
      <b className="v19-fig-v">{r.a} of {r.of}</b>
    </div>
  );
}

/* The opening of an abstract, with the rest a click away. */
function Abstract({ p, marked }) {
  const [full, setFull] = useState(false);
  const text = p.abstract || '';
  const long = text.length > OPENING + 40;
  const cut = full || !long ? text : `${text.slice(0, text.lastIndexOf(' ', OPENING))}…`;
  return (
    <>
      <p className="v19-abs-text">{marked ? <Marked text={cut} /> : cut}</p>
      {long ? (
        <button type="button" className="v19-abs-more" onClick={() => setFull((f) => !f)} aria-expanded={full} data-keep-open="">
          {full ? 'Less' : 'Read the whole abstract'}
        </button>
      ) : null}
    </>
  );
}

/* ── the awards, which open ─────────────────────────────────────────── */

function Won({ look }) {
  const { open, toggle, close } = useOpener();
  return (
    <div className={`v19-won is-${look}`}>
      <p className="v19-mini">Won</p>
      <div className="v19-won-row">
        {TROPHIES.map((t) => {
          const isOpen = open === t.id;
          const project = ALL_PROJECTS.find((p) => p.id === FROM[t.id]);
          return (
            <article className={`v19-won-one${isOpen ? ' is-open' : ''}`} key={t.id} data-keep-open={isOpen ? '' : undefined}>
              <button type="button" className="v19-won-face" onClick={() => toggle(t.id)} aria-expanded={isOpen} data-keep-open="">
                <img src={t.image} alt="" loading="lazy" />
                <span>
                  <b>{t.name}</b>
                  <i>{t.what}</i>
                </span>
                <span className="v19-won-mark" aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && project ? (
                <div className="v19-won-open">
                  <div className="v19-won-shot">
                    <img src={project.image} alt="" loading="lazy" />
                  </div>
                  <div>
                    <p className="v19-view-eye"><span>{project.category}</span>
                      <button type="button" className="v19-view-close" onClick={close} data-keep-open="">Close</button>
                    </p>
                    <h4 className="v19-won-name">{project.name}</h4>
                    <p className="v19-won-line">{project.line}</p>
                    <p className="v19-chiprow">
                      {project.tech.slice(0, 5).map((x) => (
                        <span className="v19-chip" key={x}>{x}</span>
                      ))}
                    </p>
                    <p className="v19-view-links">
                      {project.demo ? <a href={project.demo} target="_blank" rel="noreferrer">Watch it</a> : null}
                      {project.site ? <a href={project.site} target="_blank" rel="noreferrer">Use it</a> : null}
                      {project.github ? <a href={project.github} target="_blank" rel="noreferrer">Source</a> : null}
                    </p>
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function Head({ title }) {
  return (
    <header className="v19-head">
      <p className="v19-eye">
        <span className="v19-dot" aria-hidden="true" />
        Peer review
      </p>
      <h2 className="v19-h2 v19-h2-tight">{title}</h2>
    </header>
  );
}

export default function Papers({ sectionRef }) {
  const { lab } = useLab();
  const look = lab.papers;

  /* ── abstract: real paper, the opening lines, the rest on request ── */
  if (look === 'abstract') {
    return (
      <section className="v19-slab v19-papers is-abstract" ref={sectionRef} id="papers" aria-label="Papers">
        <div className="v19-slab-in">
          <Head title="Read the abstracts." />
          <div className="v19-abs-row">
            {PAPERS.map((p) => (
              <article className="v19-sheet" key={p.id}>
                <p className="v19-sheet-head">
                  <span>{p.venue}</span>
                  <Status p={p} />
                </p>
                <h3 className="v19-sheet-title">{p.title}</h3>
                <Authors p={p} />
                <div className="v19-sheet-rule" aria-hidden="true" />
                <p className="v19-abs-label">Abstract</p>
                <Abstract p={p} marked />
                <div className="v19-sheet-foot">
                  <Cite n={p.citations} />
                  <Links p={p} />
                </div>
              </article>
            ))}
          </div>
          <Won look={look} />
        </div>
      </section>
    );
  }

  /* ── brief: the drawing and the opening on one sheet ── */
  if (look === 'brief') {
    return (
      <section className="v19-slab v19-papers is-brief" ref={sectionRef} id="papers" aria-label="Papers">
        <div className="v19-slab-in">
          <Head title="Two papers, briefly." />
          <div className="v19-brief-row">
            {PAPERS.map((p) => {
              const r = RESULT[p.id];
              return (
                <article className="v19-brief" key={p.id}>
                  <div className="v19-brief-fig">
                    <p className="v19-fig-label">{r ? r.label : 'Result'}</p>
                    <Drawing p={p} />
                    <Cite n={p.citations} />
                  </div>
                  <div className="v19-brief-words">
                    <p className="v19-sheet-head">
                      <span>{p.venue}</span>
                      <Status p={p} />
                    </p>
                    <h3 className="v19-sheet-title">{p.title}</h3>
                    <p className="v19-brief-line">{p.line}</p>
                    <Abstract p={p} />
                    <Links p={p} />
                  </div>
                </article>
              );
            })}
          </div>
          <Won look={look} />
        </div>
      </section>
    );
  }

  /* ── figure: the result, drawn ── */
  return (
    <section className="v19-slab v19-papers is-figure" ref={sectionRef} id="papers" aria-label="Papers">
      <div className="v19-slab-in">
        <Head title="What each paper found." />
        <div className="v19-fig-row">
          {PAPERS.map((p) => {
            const r = RESULT[p.id];
            return (
              <article className="v19-fig" key={p.id}>
                <p className="v19-fig-label">{r ? r.label : 'Result'}</p>
                <Drawing p={p} />
                <h3 className="v19-fig-title">{p.title}</h3>
                <div className="v19-fig-meta">
                  <Status p={p} />
                  <span>{p.venue}</span>
                  <Cite n={p.citations} />
                </div>
                <Links p={p} />
              </article>
            );
          })}
        </div>
        <Won look={look} />
      </div>
    </section>
  );
}
