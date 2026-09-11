// v19 — the papers, five ways. Different objects, not one card restyled.
//
//   figure   — the result, drawn. Data first, the title second.
//   abstract — a real sheet of paper, opaque, with the opening of the abstract set on it and
//              the rest a click away. Nothing shows through from the page behind.
//   brief    — one sheet carrying both: every figure down the left, the title, the one line and
//              two lines of the abstract on the right, the rest a click away — inline, on the
//              last line, so the sheet has no gaps in it.
//   plates   — the abstract sheet, and under it two figures as plates, side by side, the same
//              size, captions beneath: symmetrical, the way a figures page is.
//   stacked  — one sheet per paper, full width: the figures beside the title, the whole abstract
//              in one justified column. Papers stack.
//
// Every figure is a table from the paper itself, redrawn. Nothing is invented and nothing is
// there for decoration: each one shows the thing the paper is actually about.

import React, { useState } from 'react';
import { PAPERS, ALL_PROJECTS } from '../copy';
import { TROPHIES } from '../personal';
import { useLab } from '../lab';

const STATE = {
  ACCEPTED: { label: 'Accepted', cls: 'is-acc' },
  'Under Review': { label: 'Preprint', cls: 'is-rev' },
  'Under Preparation': { label: 'In preparation', cls: 'is-prep' },
};

/* ── the figures, from the papers' own tables ──────────────────────── */

const FIGURES = {
  metarag: [
    {
      kind: 'grid3',
      n: 1,
      label: 'NDCG@10, the full 3 × 3',
      caption:
        'Three chunking strategies against three ways of folding the metadata in. Fixed-size chunks with the metadata written into the text is the best cell, and the same metadata makes some cells worse. The interaction is the finding.',
      cols: ['Semantic', 'Naive', 'Recursive'],
      rows: [
        { k: 'Content only', v: [0.73, 0.669, 0.782] },
        { k: 'Prefix-fusion', v: [0.699, 0.813, 0.8] },
        { k: 'TF-IDF 90:10', v: [0.617, 0.687, 0.695] },
      ],
      best: [1, 1],
    },
    {
      kind: 'steps',
      n: 2,
      label: 'Adding the metadata one category at a time',
      caption:
        'Semantic chunks, prefix-fusion. Hit Rate@10 stops moving after the first category while NDCG keeps climbing: the metadata is improving the order of what is found, not how much is found.',
      steps: [
        { k: 'none', a: 0.615, b: 0.7 },
        { k: 'technical', a: 0.66, b: 0.775 },
        { k: '+ semantic', a: 0.683, b: 0.775 },
        { k: '+ content', a: 0.699, b: 0.775 },
      ],
      series: ['NDCG@10', 'Hit Rate@10'],
    },
    {
      kind: 'matrix',
      n: 3,
      label: 'Which pairing, for which objective',
      caption:
        'The practitioner\'s table. There is no single best configuration: the right pairing depends on what you are optimising for, which is why all nine were run.',
      rows: [
        { k: 'best ranking', v: 'naive · prefix-fusion', n: 'NDCG 0.813' },
        { k: 'most found', v: 'naive · either', n: 'hit rate 0.900' },
        { k: 'most stable', v: 'recursive · content only', n: 'precision 0.783' },
        { k: 'fastest', v: 'content only', n: 'P50 about 12 ms' },
      ],
    },
  ],
  teammedagents: [
    {
      kind: 'count',
      n: 1,
      label: 'On the accuracy-per-token frontier',
      caption:
        'Optimal or near-optimal on seven of eight benchmarks. The exception is PathVQA, where ReConcile is more accurate at a similar cost.',
      a: 7,
      of: 8,
    },
    {
      kind: 'tokens',
      n: 2,
      label: 'Tokens per question, Gemma-3-4B',
      caption:
        'TeamMedAgents averages 2,748 tokens a question. The other multi-agent frameworks spend 2.1 to 7.6 times that for comparable accuracy.',
      bars: [
        { k: 'TeamMedAgents', x: 1, t: '2,748', hot: true },
        { k: 'ReConcile', x: 2.1, t: '2.1×' },
        { k: 'DyLAN', x: 2.6, t: '2.6×' },
        { k: 'MedAgents', x: 7.0, t: '7.0×' },
        { k: 'MDAgents', x: 7.6, t: '7.6×' },
      ],
    },
    {
      kind: 'gap',
      n: 3,
      label: 'Accuracy, 4B against frontier, same teamwork',
      caption:
        'Gemma-3-4B against GPT-4o on the eight benchmarks. The gap is narrow where the task is reasoning over evidence you are given, and wide where it is recall. Coordination helps a model reason; it cannot help it remember.',
      rows: [
        { k: 'DDXPlus', a: 65.3, b: 74.9 },
        { k: 'PMC-VQA', a: 43.2, b: 56.4 },
        { k: 'PathVQA', a: 59.7, b: 76.8 },
        { k: 'PubMedQA', a: 59.0, b: 78.3 },
        { k: 'MedMCQA', a: 53.3, b: 85.4 },
        { k: 'MMLU-Pro', a: 35.6, b: 79.7 },
        { k: 'MedBullets', a: 33.9, b: 78.8 },
        { k: 'MedQA', a: 45.5, b: 90.7 },
      ],
      series: ['Gemma-3-4B', 'GPT-4o'],
    },
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
      {p.doi ? <a href={p.doi} target="_blank" rel="noreferrer">{p.arxiv ? `arXiv ${p.arxiv}` : 'DOI'}</a> : null}
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
  const parts = String(text).split(/((?<![A-Za-z])\d+(?:[.,]\d+)?%?)/g);
  return (
    <>
      {parts.map((s, i) => (/^\d/.test(s) ? <mark key={i}>{s}</mark> : <React.Fragment key={i}>{s}</React.Fragment>))}
    </>
  );
}

/* ── the drawings ──────────────────────────────────────────────────── */

/* A 3 × 3 of numbers, shaded by value, the best cell picked out. */
function Grid3({ f }) {
  const all = f.rows.flatMap((r) => r.v);
  const lo = Math.min(...all);
  const hi = Math.max(...all);
  return (
    <div className="v19-g3" role="img" aria-label={`${f.label}: best ${hi}`}>
      <span className="v19-g3-corner" />
      {f.cols.map((c) => (
        <span className="v19-g3-h" key={c}>{c}</span>
      ))}
      {f.rows.map((r, ri) => (
        <React.Fragment key={r.k}>
          <span className="v19-g3-k">{r.k}</span>
          {r.v.map((v, ci) => {
            const k = (v - lo) / (hi - lo || 1);
            const best = f.best[0] === ri && f.best[1] === ci;
            return (
              <span
                className={`v19-g3-c${best ? ' is-best' : ''}`}
                key={ci}
                style={{ '--k': k.toFixed(2), '--i': ri * 3 + ci }}
              >
                {v.toFixed(3)}
              </span>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

/* Two series over four steps: bars for the one that moves, a line for the one that does not. */
function Steps({ f }) {
  const W = 300;
  const H = 96;
  const L = 34;
  const B = 18;
  const n = f.steps.length;
  const slot = (W - L) / n;
  const bw = slot * 0.42;
  const y = (v) => H - B - ((v - 0.55) / 0.3) * (H - B - 10);
  return (
    <svg className="v19-steps" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${f.series[0]} rises from ${f.steps[0].a} to ${f.steps[n - 1].a}; ${f.series[1]} stays at ${f.steps[n - 1].b}`}>
      {[0.6, 0.7, 0.8].map((g) => (
        <g key={g}>
          <line x1={L} x2={W} y1={y(g)} y2={y(g)} className="v19-steps-grid" />
          <text x={L - 5} y={y(g) + 3} className="v19-steps-ax">{g.toFixed(1)}</text>
        </g>
      ))}
      {f.steps.map((s, i) => {
        const x = L + slot * i + (slot - bw) / 2;
        return (
          <g key={s.k}>
            <rect x={x} y={y(s.a)} width={bw} height={H - B - y(s.a)} className="v19-steps-bar" style={{ '--i': i }} />
            <text x={x + bw / 2} y={y(s.a) - 4} className="v19-steps-v" textAnchor="middle">{s.a.toFixed(3)}</text>
            <text x={L + slot * i + slot / 2} y={H - 4} className="v19-steps-ax" textAnchor="middle">{s.k}</text>
          </g>
        );
      })}
      <polyline
        className="v19-steps-line"
        points={f.steps.map((s, i) => `${L + slot * i + slot / 2},${y(s.b)}`).join(' ')}
      />
      {f.steps.map((s, i) => (
        <circle key={s.k} cx={L + slot * i + slot / 2} cy={y(s.b)} r="3" className="v19-steps-dot" />
      ))}
      <text x={W - 2} y={10} className="v19-steps-v is-line" textAnchor="end">{f.series[1]} (line) · {f.series[0]} (bars)</text>
      <text x={L + slot * (n - 1) + slot / 2 + 8} y={y(f.steps[n - 1].b) - 6} className="v19-steps-v is-line" textAnchor="middle">{f.steps[n - 1].b}</text>
    </svg>
  );
}

/* Cells, most of them lit. */
function Count({ f }) {
  return (
    <div className="v19-fig-count" role="img" aria-label={`${f.a} of ${f.of}`}>
      <div className="v19-fig-cells">
        {Array.from({ length: f.of }).map((_, i) => (
          <span key={i} className={i < f.a ? 'on' : ''} />
        ))}
      </div>
      <b className="v19-fig-v">{f.a} of {f.of}</b>
    </div>
  );
}

/* Horizontal bars, the first one the unit. */
function Tokens({ f }) {
  const max = Math.max(...f.bars.map((b) => b.x));
  return (
    <div className="v19-fig-bars is-tokens" role="img" aria-label={f.bars.map((b) => `${b.k} ${b.t}`).join(', ')}>
      {f.bars.map((bar, i) => (
        <div className="v19-fig-bar" key={bar.k}>
          <span className="v19-fig-k">{bar.k}</span>
          <span className="v19-fig-track">
            <span className={`v19-fig-fill${bar.hot ? ' is-hot' : ''}`} style={{ '--w': `${(bar.x / max) * 100}%`, '--i': i }} />
          </span>
          <b className="v19-fig-v">{bar.t}</b>
        </div>
      ))}
    </div>
  );
}

/* Two dots per row joined by a line: the small model and the large one. */
function Gap({ f }) {
  return (
    <div className="v19-gap" role="img" aria-label={f.rows.map((r) => `${r.k} ${r.a} against ${r.b}`).join(', ')}>
      <div className="v19-gap-legend">
        <span><i className="is-a" />{f.series[0]}</span>
        <span><i className="is-b" />{f.series[1]}</span>
      </div>
      {f.rows.map((r, i) => (
        <div className="v19-gap-row" key={r.k} style={{ '--i': i }}>
          <span className="v19-gap-k">{r.k}</span>
          <span className="v19-gap-track">
            <i className="v19-gap-line" style={{ '--a': `${r.a}%`, '--b': `${r.b}%` }} />
            <i className="v19-gap-dot is-a" style={{ '--x': `${r.a}%` }} />
            <i className="v19-gap-dot is-b" style={{ '--x': `${r.b}%` }} />
          </span>
          <b className="v19-gap-v">{r.a.toFixed(1)} · {r.b.toFixed(1)}</b>
        </div>
      ))}
    </div>
  );
}

/* Objective, pairing, number: the table a practitioner takes away. */
function Matrix({ f }) {
  return (
    <div className="v19-mx" role="img" aria-label={f.rows.map((r) => `${r.k}: ${r.v}, ${r.n}`).join('; ')}>
      {f.rows.map((r, i) => (
        <div className="v19-mx-row" key={r.k} style={{ '--i': i }}>
          <span className="v19-mx-k">{r.k}</span>
          <span className="v19-mx-v">{r.v}</span>
          <b className="v19-mx-n">{r.n}</b>
        </div>
      ))}
    </div>
  );
}

function Drawing({ f }) {
  if (!f) return null;
  if (f.kind === 'matrix') return <Matrix f={f} />;
  if (f.kind === 'grid3') return <Grid3 f={f} />;
  if (f.kind === 'steps') return <Steps f={f} />;
  if (f.kind === 'tokens') return <Tokens f={f} />;
  if (f.kind === 'gap') return <Gap f={f} />;
  return <Count f={f} />;
}

/* One numbered plate: the drawing and its caption. */
function Plate({ f, small }) {
  return (
    <figure className={`v19-plate is-${f.kind}${small ? ' is-small' : ''}`}>
      <div className="v19-plate-art">
        <Drawing f={f} />
      </div>
      <figcaption className="v19-plate-cap">
        <b>Fig. {f.n}</b> {f.caption}
      </figcaption>
    </figure>
  );
}

/* The opening of an abstract, with the rest a click away. With `inline` the link sits on the
   last line of the text itself rather than on a line of its own. */
function Abstract({ p, marked, opening = OPENING, inline = false }) {
  const [full, setFull] = useState(false);
  const text = p.abstract || '';
  const long = opening > 0 && text.length > opening + 40;
  const cut = full || !long ? text : `${text.slice(0, text.lastIndexOf(' ', opening))}…`;
  const more = long ? (
    <button type="button" className={`v19-abs-more${inline ? ' is-inline' : ''}`} onClick={() => setFull((f) => !f)} aria-expanded={full} data-keep-open="">
      {full ? 'Less' : 'Read the whole abstract'}
    </button>
  ) : null;
  return (
    <>
      <p className="v19-abs-text">
        {marked ? <Marked text={cut} /> : cut}
        {inline && more ? <> {more}</> : null}
      </p>
      {!inline ? more : null}
    </>
  );
}

/* ── the awards, which open — each on its own ────────────────────────── */

function Won({ look }) {
  const [open, setOpen] = useState(() => new Set());
  const flip = (id) =>
    setOpen((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  return (
    <div className={`v19-won is-${look}`}>
      <p className="v19-mini">Won</p>
      <div className="v19-won-row">
        {TROPHIES.map((t) => {
          const isOpen = open.has(t.id);
          const project = ALL_PROJECTS.find((p) => p.id === FROM[t.id]);
          return (
            <article className={`v19-won-one${isOpen ? ' is-open' : ''}`} key={t.id}>
              <button type="button" className="v19-won-face" onClick={() => flip(t.id)} aria-expanded={isOpen}>
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
                    <p className="v19-view-eye"><span>{project.category}</span></p>
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

function SheetHead({ p }) {
  return (
    <p className="v19-sheet-head">
      <span>{p.venue}</span>
      <Status p={p} />
    </p>
  );
}

export default function Papers({ sectionRef }) {
  const { lab } = useLab();
  const look = lab.papers;
  const first = (p) => (FIGURES[p.id] || [])[0];

  /* ── abstract: real paper, the opening lines, the rest on request ── */
  if (look === 'abstract') {
    return (
      <section className="v19-slab v19-papers is-abstract" ref={sectionRef} id="papers" aria-label="Papers">
        <div className="v19-slab-in">
          <Head title="Read the abstracts." />
          <div className="v19-abs-row">
            {PAPERS.map((p) => (
              <article className="v19-sheet" key={p.id}>
                <SheetHead p={p} />
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
            {PAPERS.map((p) => (
              <article className="v19-brief" key={p.id}>
                <div className="v19-brief-fig">
                  {(FIGURES[p.id] || []).map((f) => (
                    <Plate key={f.n} f={f} small />
                  ))}
                </div>
                <div className="v19-brief-words">
                  <SheetHead p={p} />
                  <h3 className="v19-sheet-title">{p.title}</h3>
                  <p className="v19-brief-line">{p.line}</p>
                  <Abstract p={p} opening={190} inline />
                  <div className="v19-sheet-foot">
                    <Cite n={p.citations} />
                    <Links p={p} />
                  </div>
                </div>
              </article>
            ))}
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
                <SheetHead p={p} />
                <h3 className="v19-sheet-title">{p.title}</h3>
                <Authors p={p} />
                <div className="v19-sheet-rule" aria-hidden="true" />
                <p className="v19-abs-label">Abstract</p>
                <Abstract p={p} marked />
                <div className="v19-plates">
                  {(FIGURES[p.id] || []).slice(0, 2).map((f) => (
                    <Plate key={f.n} f={f} />
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

  /* ── stacked: one sheet per paper, the figures beside the title, the abstract in one column ── */
  if (look === 'stacked') {
    return (
      <section className="v19-slab v19-papers is-stacked" ref={sectionRef} id="papers" aria-label="Papers">
        <div className="v19-slab-in">
          <Head title="Two papers." />
          <div className="v19-stack">
            {PAPERS.map((p) => (
              <article className="v19-band" key={p.id}>
                <div className="v19-band-words">
                  <div className="v19-band-head">
                    <SheetHead p={p} />
                    <Cite n={p.citations} />
                  </div>
                  <h3 className="v19-band-title">{p.title}</h3>
                  <Authors p={p} />
                  <p className="v19-brief-line">{p.line}</p>
                  <div className="v19-sheet-rule" aria-hidden="true" />
                  <p className="v19-abs-label">Abstract</p>
                  <div className="v19-band-body">
                    <Abstract p={p} marked opening={0} />
                  </div>
                  <Links p={p} />
                </div>
                <div className="v19-band-figs">
                  {(FIGURES[p.id] || []).map((f) => (
                    <Plate key={f.n} f={f} small />
                  ))}
                </div>
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
            const f = first(p);
            return (
              <article className="v19-fig" key={p.id}>
                <p className="v19-fig-label">{f ? f.label : 'Result'}</p>
                <Drawing f={f} />
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
