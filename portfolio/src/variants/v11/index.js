// v11 — TISSUE: the portfolio as a sewing-pattern sheet. Each piece is a section; cut them out.
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './v11.css';

// Shape outlines for a w×h box. Curved intrusions are clamped in pixels (relative to width) so
// they never reach the text, whose padding is also width-relative.
const SHAPES = {
  front: (w, h) => {
    const neck = Math.min(0.18 * h, 0.18 * w); // deepest point of the neckline
    const arm = Math.min(0.38 * h, 0.5 * w); // where the armhole meets the side seam
    const t = 0.02 * h;
    return {
      d: `M ${0.02 * w} ${Math.min(0.12 * h, 0.1 * w)}
          L ${0.30 * w} ${t}
          Q ${0.44 * w} ${2 * neck - t} ${0.58 * w} ${t}
          L ${0.86 * w} ${t + 0.04 * w}
          C ${0.80 * w} ${t + 0.3 * arm} ${0.84 * w} ${t + 0.8 * arm} ${0.98 * w} ${arm}
          L ${0.98 * w} ${0.98 * h}
          L ${0.02 * w} ${0.98 * h} Z`,
      notches: [
        { x: 0.98 * w, y: arm + 0.35 * (0.98 * h - arm), d: 'l' },
        { x: 0.98 * w, y: arm + 0.35 * (0.98 * h - arm) + 22, d: 'l' },
        { x: 0.5 * w, y: 0.98 * h, d: 'u' },
      ],
    };
  },
  sleeve: (w, h) => {
    const cap = Math.min(0.36 * h, 0.3 * w);
    const t = 0.02 * h;
    return {
      d: `M ${0.02 * w} ${cap}
          C ${0.18 * w} ${t} ${0.82 * w} ${t} ${0.98 * w} ${cap}
          L ${0.90 * w} ${0.98 * h}
          L ${0.10 * w} ${0.98 * h} Z`,
      notches: [
        { x: 0.5 * w, y: 0.25 * cap + 0.75 * t, d: 'd' },
        { x: 0.3 * w, y: 0.98 * h, d: 'u' },
        { x: 0.7 * w, y: 0.98 * h, d: 'u' },
      ],
    };
  },
  collar: (w, h) => {
    const rise = Math.min(0.3 * h, 0.14 * w);
    const t = 0.02 * h;
    const dip = Math.min(0.2 * h, 0.12 * w);
    return {
      d: `M ${0.02 * w} ${rise}
          Q ${0.50 * w} ${t} ${0.98 * w} ${rise}
          L ${0.98 * w} ${0.98 * h}
          Q ${0.50 * w} ${0.98 * h - dip} ${0.02 * w} ${0.98 * h} Z`,
      notches: [
        { x: 0.5 * w, y: 0.5 * rise + 0.5 * t, d: 'd' },
        { x: 0.5 * w, y: 0.98 * h - 0.5 * dip, d: 'u' },
      ],
    };
  },
  pocket: (w, h) => {
    const r = Math.min(0.18 * h, 0.18 * w);
    return {
      d: `M ${0.02 * w} ${0.02 * h}
          L ${0.98 * w} ${0.02 * h}
          L ${0.98 * w} ${0.98 * h - r}
          Q ${0.98 * w} ${0.98 * h} ${0.98 * w - r} ${0.98 * h}
          L ${0.02 * w + r} ${0.98 * h}
          Q ${0.02 * w} ${0.98 * h} ${0.02 * w} ${0.98 * h - r} Z`,
      notches: [
        { x: 0.02 * w, y: 0.3 * h, d: 'r' },
        { x: 0.98 * w, y: 0.3 * h, d: 'l' },
      ],
    };
  },
  facing: (w, h) => ({
    d: `M ${0.10 * w} ${0.02 * h}
        L ${0.90 * w} ${0.02 * h}
        L ${0.98 * w} ${0.98 * h}
        L ${0.02 * w} ${0.98 * h} Z`,
    notches: [
      { x: 0.06 * w, y: 0.5 * h, d: 'r' },
      { x: 0.94 * w, y: 0.5 * h, d: 'l' },
    ],
  }),
};

function notchPoints(n, s) {
  const { x, y } = n;
  switch (n.d) {
    case 'l': return `${x},${y - s} ${x - s},${y} ${x},${y + s}`;
    case 'r': return `${x},${y - s} ${x + s},${y} ${x},${y + s}`;
    case 'd': return `${x - s},${y} ${x},${y + s} ${x + s},${y}`;
    default: return `${x - s},${y} ${x},${y - s} ${x + s},${y}`;
  }
}

const PIECES = [
  {
    n: 1, shape: 'front', name: 'Front', section: 'About', cut: 'Cut 1 · on fold', area: 'front',
    body: (
      <>
        <h2>Ilse Marrow</h2>
        <p className="v11-lead">Staff engineer at Fathom Instruments, Lisbon. I write software for instruments that measure things: loggers, calibration rigs, the quiet programs that decide whether a number can be trusted.</p>
        <p>Twelve years in, most of it close to hardware and the people who carry it into the rain. Currently leading the calibration platform at Fathom with one other engineer and a very patient oscilloscope.</p>
        <div className="v11-lengthen"><span>Lengthen or shorten here</span></div>
        <p>Off the clock: tide tables, bad bread on a good schedule, cold-water swimming, firm opinions about pencil hardness.</p>
      </>
    ),
  },
  {
    n: 2, shape: 'sleeve', name: 'Sleeve', section: 'Work', cut: 'Cut 2', area: 'sleeve',
    body: (
      <>
        <h2>Where I have worked</h2>
        <dl className="v11-dl">
          <dt>2024 – now</dt><dd><b>Fathom Instruments</b> · Staff engineer. Drift models, field-calibration workflows, the audit trail that proves a billed number was honest.</dd>
          <dt>2021 – 2024</dt><dd><b>Halyard Labs</b> · Senior engineer. The software half of a hardware company: firmware update paths, sync over bad satellite links.</dd>
          <dt>2016 – 2019</dt><dd><b>Ostrander &amp; Co.</b> · Engineer. Software for survey crews. A crew in the rain does not read error messages.</dd>
          <dt>2012 – 2016</dt><dd><b>University of Tromsø</b> · BSc Physics, then a year of a PhD that became a data pipeline.</dd>
        </dl>
      </>
    ),
  },
  {
    n: 3, shape: 'pocket', name: 'Pocket', section: 'Projects', cut: 'Cut 4', area: 'pocket',
    body: (
      <>
        <h2>Things that shipped</h2>
        <ul className="v11-ul">
          <li><b>Ledger</b> — a drift-correcting time-series store; every sample keeps its calibration lineage. <a href="https://example.com/ledger" target="_blank" rel="noreferrer">Source</a></li>
          <li><b>Sieve</b> — anomaly triage for 40,000 water meters, with the reason attached. <a href="https://example.com/sieve" target="_blank" rel="noreferrer">Write-up</a></li>
          <li><b>Windrow</b> — resumable sync for loggers that see the internet four minutes a day. <a href="https://example.com/windrow" target="_blank" rel="noreferrer">Notes</a></li>
          <li><b>Plumb</b> — a one-screen levelling app: one large number and a colour.</li>
        </ul>
      </>
    ),
  },
  {
    n: 4, shape: 'collar', name: 'Collar', section: 'Writing', cut: 'Cut 1 · interfacing', area: 'collar',
    body: (
      <>
        <h2>Essays that held up</h2>
        <ul className="v11-ul v11-ul-inline">
          <li><a href="https://example.com/thermometer" target="_blank" rel="noreferrer">“The Thermometer Was Fine”</a> <span>2020 · 9 min</span></li>
          <li><a href="https://example.com/sigfigs" target="_blank" rel="noreferrer">“Significant Figures Are a Promise”</a> <span>2020 · 6 min</span></li>
          <li><a href="https://example.com/wrong" target="_blank" rel="noreferrer">“A Field Guide to Wrong Numbers”</a> <span>2021 · 14 min</span></li>
          <li><a href="https://example.com/units" target="_blank" rel="noreferrer">Talk: “Everything is a units bug”</a> <span>SensorConf 2025</span></li>
        </ul>
      </>
    ),
  },
  {
    n: 5, shape: 'facing', name: 'Facing', section: 'Contact', cut: 'Cut 1', area: 'facing',
    body: (
      <>
        <h2>Get in touch</h2>
        <p>Email is the reliable seam. I answer slowly and completely.</p>
        <ul className="v11-ul v11-ul-links">
          <li><a href="mailto:ilse@marrow.example">ilse@marrow.example</a></li>
          <li><a href="https://example.com/github" target="_blank" rel="noreferrer">github.com/ilsemarrow</a></li>
          <li><a href="https://example.com/cv.pdf" target="_blank" rel="noreferrer">CV, one page, PDF</a></li>
        </ul>
      </>
    ),
  },
];

function useSize(ref) {
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize((s) => (Math.abs(s.w - r.width) > 0.5 || Math.abs(s.h - r.height) > 0.5 ? { w: r.width, h: r.height } : s));
    };
    measure();
    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(measure);
      ro.observe(el);
    }
    const t1 = setTimeout(measure, 300);
    const t2 = setTimeout(measure, 1200); // fonts landing late
    window.addEventListener('resize', measure);
    return () => {
      if (ro) ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', measure);
    };
  }, [ref]);
  return size;
}

function Outline({ shape, w, h, tone }) {
  if (w < 4 || h < 4) return null;
  const { d, notches } = SHAPES[shape](w, h);
  const cx = w / 2;
  const cy = h / 2;
  const s = 9;
  const gx = 0.90 * w;
  return (
    <svg className={`v11-svg v11-svg-${tone}`} width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden="true">
      <path d={d} className="v11-cutline" />
      {tone === 'piece' && (
        <>
          <g transform={`translate(${cx} ${cy}) scale(0.935) translate(${-cx} ${-cy})`}>
            <path d={d} className="v11-stitchline" />
          </g>
          {notches.map((n, i) => (
            <polygon key={i} points={notchPoints(n, s)} className="v11-notch" />
          ))}
          <g className="v11-grain">
            <line x1={gx} y1={0.32 * h} x2={gx} y2={0.72 * h} />
            <polygon points={`${gx},${0.30 * h} ${gx - 5},${0.30 * h + 9} ${gx + 5},${0.30 * h + 9}`} />
            <polygon points={`${gx},${0.74 * h} ${gx - 5},${0.74 * h - 9} ${gx + 5},${0.74 * h - 9}`} />
            <text x={gx - 6} y={0.52 * h} transform={`rotate(-90 ${gx - 6} ${0.52 * h})`}>grainline</text>
          </g>
          {shape === 'front' && (
            <text className="v11-fold" x={0.02 * w + 12} y={0.55 * h} transform={`rotate(-90 ${0.02 * w + 12} ${0.55 * h})`}>
              ◀ place on fold ▶
            </text>
          )}
        </>
      )}
    </svg>
  );
}

function Piece({ p, cut, onToggle, reduced }) {
  const ref = useRef(null);
  const { w, h } = useSize(ref);
  return (
    <div className={`v11-slot v11-slot-${p.shape}${cut ? ' is-cut' : ''}`} style={{ gridArea: p.area }}>
      <div className="v11-hole" aria-hidden="true">
        <Outline shape={p.shape} w={w} h={h} tone="hole" />
      </div>
      <motion.div
        ref={ref}
        className={`v11-piece v11-piece-${p.shape}`}
        animate={cut ? { x: 22, y: -30, rotate: -2.6 } : { x: 0, y: 0, rotate: 0 }}
        transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 22 }}
      >
        <Outline shape={p.shape} w={w} h={h} tone="piece" />
        <div className="v11-body">
          <div className="v11-label">
            <span className="v11-num v11-cond" aria-hidden="true">{p.n}</span>
            <div className="v11-label-text">
              <div className="v11-cond v11-piece-name">
                {p.name} <span className="v11-sep">·</span> {p.section}
              </div>
              <div className="v11-cond v11-cutnote">{p.cut} · piece {p.n} of {PIECES.length}</div>
            </div>
            <button type="button" className="v11-scissors v11-cond" onClick={onToggle} aria-pressed={cut}>
              <span aria-hidden="true">✂</span> {cut ? 'Lay back' : 'Cut out'}
            </button>
          </div>
          {p.body}
        </div>
      </motion.div>
    </div>
  );
}

export default function V11() {
  const reduced = useReducedMotion();
  const [cut, setCut] = useState({});
  useEffect(() => { document.title = 'Ilse Marrow — pattern 1140'; }, []);
  const toggle = (n) => setCut((c) => ({ ...c, [n]: !c[n] }));
  const cutCount = Object.values(cut).filter(Boolean).length;

  return (
    <div className="v11">
      <div className="v11-sheet">
        <header className="v11-title">
          <div className="v11-title-main">
            <div className="v11-cond v11-brand">Pattern</div>
            <div className="v11-cond v11-number">1140</div>
            <h1 className="v11-cond">Ilse Marrow</h1>
            <p className="v11-cond v11-sub">Engineer · writer · maker of small tools</p>
          </div>
          <div className="v11-title-side">
            <p className="v11-cond v11-spec">
              5 pieces · one size · seam allowance 1.5 cm included · printed on tissue
            </p>
            <p className="v11-howto">
              This is a sewing pattern of a person. Each piece is one section of the portfolio, printed
              on the sheet. Press <b>✂ Cut out</b> on any piece to lift it from the tissue; press again
              to lay it back. Nothing needs assembling.
            </p>
            <dl className="v11-key" aria-label="Key">
              <dt><i className="v11-k-dash" /></dt><dd>cutting line</dd>
              <dt><i className="v11-k-solid" /></dt><dd>stitching line</dd>
              <dt><i className="v11-k-notch" /></dt><dd>notch, match to neighbour</dd>
              <dt><i className="v11-k-grain" /></dt><dd>grainline, keep parallel to selvage</dd>
            </dl>
            <p className="v11-cond v11-count" aria-live="polite">
              {cutCount === 0 ? 'No pieces cut yet' : `${cutCount} of ${PIECES.length} pieces cut`}
            </p>
          </div>
        </header>

        <main className="v11-grid">
          {PIECES.map((p) => (
            <Piece key={p.n} p={p} cut={!!cut[p.n]} onToggle={() => toggle(p.n)} reduced={reduced} />
          ))}
        </main>

        <div className="v11-selvage v11-cond" aria-hidden="true">
          <span>
            {Array.from({ length: 12 }).map((_, i) => (
              <React.Fragment key={i}>Ilse Marrow · pattern 1140 · 2026 · selvage · </React.Fragment>
            ))}
          </span>
        </div>
      </div>
    </div>
  );
}
