// v19 — the papers, briefly. One sheet each: every figure down the left, the title, the one
// line and two lines of the abstract on the right with the rest a click away, inline on the
// last line, so the sheet has no gaps in it.
//
// Every figure is a table from the paper itself, redrawn. Nothing is invented and nothing is
// there for decoration: each one shows the thing the paper is actually about.

import React, { useState } from 'react';
import { PAPERS } from '../copy';

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
function Abstract({ p, marked, opening = OPENING, inline = false, full: fullProp, onFull }) {
  const [fullState, setFullState] = useState(false);
  const full = fullProp === undefined ? fullState : fullProp;
  const setFull = onFull || setFullState;
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

/* One paper: two figures beside the brief; the third comes with the whole abstract. */
function Brief({ p }) {
  const [full, setFull] = useState(false);
  const figs = (FIGURES[p.id] || []).slice(0, full ? 3 : 2);
  return (
    <article className={`v19-brief${full ? ' is-full' : ''}`}>
      <div className="v19-brief-fig">
        {figs.map((f) => (
          <Plate key={f.n} f={f} small />
        ))}
      </div>
      <div className="v19-brief-words">
        <SheetHead p={p} />
        <h3 className="v19-sheet-title">{p.title}</h3>
        <p className="v19-brief-line">{p.line}</p>
        <Abstract p={p} opening={190} inline full={full} onFull={setFull} />
        <div className="v19-sheet-foot">
          <Cite n={p.citations} />
          <Links p={p} />
        </div>
      </div>
    </article>
  );
}

export default function Papers({ sectionRef }) {
  return (
    <section className="v19-slab v19-papers is-brief" ref={sectionRef} id="papers" aria-label="Papers">
      <div className="v19-slab-in">
        <Head title="Two papers, briefly." />
        <div className="v19-brief-row">
          {PAPERS.map((p) => (
            <Brief p={p} key={p.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
