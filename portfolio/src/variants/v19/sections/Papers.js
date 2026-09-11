// v19 — the papers, five ways. Different objects, not one card restyled.
//
//   figure   — the result, drawn: a bar for MetaRAG's 82.5 against 73.3, seven of eight cells
//              for TeamMedAgents. Data first, the title second. The one he liked.
//   abstract — a real sheet of paper, opaque, with the opening of the abstract set on it and
//              the rest a click away. Nothing shows through from the page behind.
//   brief    — one sheet carrying both: the drawing on the left, the first lines on the right.
//   plates   — the abstract sheet, and under it the figures as numbered plates with captions,
//              the way they sit under an abstract in a preprint.
//   stacked  — no paper at all. Each paper is one wide band set straight on the page: the
//              title, a strip of figures, the opening in two columns. Papers stack.
//
// Every figure is drawn from a number that is in the abstract. Nothing is invented.
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

// The figures for each paper, all straight from its abstract.
const FIGURES = {
  metarag: [
    { kind: 'bars', n: 1, caption: 'Retrieval precision: recursive chunking with TF-IDF weighted embeddings against a content-only semantic baseline.' },
    { kind: 'gauge', n: 2, caption: 'Hit Rate@10 for naive chunking with prefix-fusion, the best of the three chunking strategies.', label: 'Hit Rate@10', v: 0.925, of: 1 },
  ],
  teammedagents: [
    { kind: 'count', n: 1, caption: 'Benchmarks improved: MedQA, MedMCQA, MMLU-Pro Medical, PubMedQA, DDXPlus, MedBullets, Path-VQA and PMC-VQA.' },
    { kind: 'ring', n: 2, caption: 'The six teamwork components of the Big Five model, each built as a mechanism between agents and switched on or off in ablation.', label: 'Six components', items: ['Leadership', 'Monitoring', 'Orientation', 'Shared models', 'Closed loop', 'Trust'] },
  ],
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

/* A ruler from nothing to one, with the result marked on it. */
function Gauge({ f }) {
  const pct = (f.v / f.of) * 100;
  return (
    <div className="v19-fig-gauge" role="img" aria-label={`${f.label} ${f.v}`}>
      <span className="v19-fig-rule">
        {Array.from({ length: 11 }).map((_, i) => (
          <i key={i} className={i % 5 === 0 ? 'is-major' : undefined} style={{ left: `${i * 10}%` }} />
        ))}
        <b className="v19-fig-mark" style={{ '--x': `${pct}%` }} />
      </span>
      <span className="v19-fig-ends"><i>0</i><i>1</i></span>
      <b className="v19-fig-v">{f.v}</b>
    </div>
  );
}

/* Six things around a table, every one joined to every other. */
function Ring({ f }) {
  const n = f.items.length;
  const R = 58;
  const cx = 130;
  const cy = 78;
  const pts = f.items.map((_, i) => {
    const a = -Math.PI / 2 + (i / n) * Math.PI * 2;
    return { x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R, a };
  });
  return (
    <svg className="v19-fig-ring" viewBox="0 0 260 156" role="img" aria-label={f.items.join(', ')}>
      {pts.map((p, i) =>
        pts.slice(i + 1).map((q, j) => (
          <line key={`${i}-${j}`} x1={p.x} y1={p.y} x2={q.x} y2={q.y} className="v19-fig-ring-l" />
        ))
      )}
      {pts.map((p, i) => {
        const c = Math.cos(p.a);
        const anchor = Math.abs(c) < 0.2 ? 'middle' : c > 0 ? 'start' : 'end';
        return (
          <g key={f.items[i]}>
            <circle cx={p.x} cy={p.y} r="5.5" className="v19-fig-ring-n" style={{ animationDelay: `${i * 70}ms` }} />
            <text x={p.x + c * 12} y={p.y + Math.sin(p.a) * 12 + 3.5} textAnchor={anchor} className="v19-fig-ring-t">
              {f.items[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* One numbered plate: the drawing and its caption. */
function Plate({ p, f }) {
  return (
    <figure className={`v19-plate is-${f.kind}`}>
      <div className="v19-plate-art">
        {f.kind === 'gauge' ? <Gauge f={f} /> : f.kind === 'ring' ? <Ring f={f} /> : <Drawing p={p} />}
      </div>
      <figcaption className="v19-plate-cap">
        <b>Fig. {f.n}</b> {f.caption}
      </figcaption>
    </figure>
  );
}

/* The opening of an abstract, with the rest a click away. */
function Abstract({ p, marked, opening = OPENING }) {
  const [full, setFull] = useState(false);
  const text = p.abstract || '';
  const long = text.length > opening + 40;
  const cut = full || !long ? text : `${text.slice(0, text.lastIndexOf(' ', opening))}…`;
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

  /* ── plates: the sheet, and the figures under it ── */
  if (look === 'plates') {
    return (
      <section className="v19-slab v19-papers is-plates" ref={sectionRef} id="papers" aria-label="Papers">
        <div className="v19-slab-in">
          <Head title="Abstracts, with figures." />
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
                <div className="v19-plates">
                  {(FIGURES[p.id] || []).map((f) => (
                    <Plate key={f.n} p={p} f={f} />
                  ))}
                </div>
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

  /* ── stacked: no paper, one wide band per paper, set on the page ── */
  if (look === 'stacked') {
    return (
      <section className="v19-slab v19-papers is-stacked" ref={sectionRef} id="papers" aria-label="Papers">
        <div className="v19-slab-in">
          <Head title="Two papers." />
          <div className="v19-stack">
            {PAPERS.map((p) => (
              <article className="v19-band" key={p.id}>
                <div className="v19-band-head">
                  <p className="v19-sheet-head">
                    <span>{p.venue}</span>
                    <Status p={p} />
                  </p>
                  <Cite n={p.citations} />
                </div>
                <h3 className="v19-band-title">{p.title}</h3>
                <p className="v19-brief-line">{p.line}</p>
                <div className="v19-band-strip">
                  {(FIGURES[p.id] || []).map((f) => (
                    <Plate key={f.n} p={p} f={f} />
                  ))}
                </div>
                <div className="v19-band-body">
                  <Abstract p={p} opening={520} />
                </div>
                <Links p={p} />
              </article>
            ))}
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
