// v19 — the work. Alfred_ takes the whole first screen and nothing else is on it.
//
// One mono line, one heading, one paragraph. Then five figures: a before struck through, an
// after that counts up, a line saying what it is. Point at one and the number counts again and
// the drawing underneath changes to that one specific thing. Click and the why opens BESIDE the
// drawing, never over it: from the left two boxes the note takes the left and the drawing moves
// right; from the other three the drawing stays left and the note takes the right.
//
// Each box has three candidate drawings (A, B, C in copy.js); the picker in the corner chooses
// until he has chosen, and then the losers go.
//
// Underneath the fold: WheelPrice, shut, as one bar with a car on it. Point at the car and its
// wheels spin up, it tears off to the left, comes back in from the right and stops where it was.
// It opens into the same shape at half the size, with its own drawings. Everything before that
// is one after-note, shut.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALFRED, AFTER, AFTER_LINE, FIGURES, WHEELPRICE } from '../copy';
import { useLab } from '../lab';
import { useOnScreen, useOpener } from '../hooks';

/* A number that counts to itself when it first arrives on screen, and again whenever you point
   at it. */
function Tick({ value, run, again }) {
  const [shown, setShown] = useState(value);
  const numeric = useMemo(() => {
    const m = String(value).match(/^(−?-?\$?)(\d+(?:[.,]\d+)?)(.*)$/);
    return m ? { sign: m[1], n: parseFloat(m[2].replace(',', '')), tail: m[3], comma: m[2].includes(',') } : null;
  }, [value]);

  useEffect(() => {
    if (!run || !numeric) {
      setShown(value);
      return undefined;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 780;
    const fmt = (v) => {
      const s = numeric.n % 1 ? v.toFixed(1) : String(Math.round(v));
      return numeric.comma ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s;
    };
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - (1 - t) ** 3;
      setShown(`${numeric.sign}${fmt(numeric.n * e)}${numeric.tail}`);
      if (t < 1) raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    // rAF may never run; land the real value regardless
    const guard = window.setTimeout(() => setShown(value), 1200);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(guard);
    };
  }, [run, again, numeric, value]);

  return <span>{shown}</span>;
}

/* ── the drawings ─────────────────────────────────────────────────────
   Small, line-drawn, and about one figure only. A handful of shared shapes — cells, a flow,
   bars, a rise — and a bespoke drawing wherever the figure deserves one. */

const T = ({ x, y, cls, children, anchor }) => (
  <text className={`v19-sk-t${cls ? ` ${cls}` : ''}`} x={x} y={y} textAnchor={anchor}>{children}</text>
);

const SVG = ({ alt, children }) => (
  <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label={alt}>{children}</svg>
);

/* A run of cells; some are the ones that matter. */
function Cells({ s }) {
  const n = s.n || 12;
  const hot = new Set(s.hot || []);
  const bw = Math.min(18, Math.floor(400 / n) - 4);
  return (
    <SVG alt={s.alt}>
      <T x={0} y={20}>{s.head}</T>
      {Array.from({ length: n }).map((_, i) => (
        <rect key={i} className={`v19-sk-tick-box${hot.has(i) ? ' is-hot' : ''}`} style={{ '--i': i }} x={4 + i * (bw + 4)} y={30} width={bw} height={bw} rx="2" />
      ))}
      <T x={n * (bw + 4) + 14} y={30 + bw * 0.7} cls="is-hot">{s.tail}</T>
      <T x={0} y={66} cls={s.strike ? 'is-was' : 'is-small'}>{s.foot}</T>
    </SVG>
  );
}

/* Boxes joined by arrows; a bead runs the path; the last box is the point. */
function Flow({ s }) {
  const nodes = s.nodes;
  const widths = nodes.map((nd) => Math.max(58, Math.round(nd.length * 6.6 + 20)));
  const total = widths.reduce((acc, v) => acc + v, 0);
  const gap = Math.max(14, Math.floor((520 - total) / Math.max(1, nodes.length - 1)));
  const xs = [];
  let cur = 0;
  widths.forEach((bw) => { xs.push(cur); cur += bw + gap; });
  const last = nodes.length - 1;
  return (
    <SVG alt={s.alt}>
      {nodes.map((nd, i) => (
        <g key={nd}>
          <rect className={`v19-sk-box${i === last ? ' is-end' : ''}`} x={xs[i]} y="18" width={widths[i]} height="30" rx="3" />
          <T x={xs[i] + widths[i] / 2} y={37} cls="is-mid is-centre">{nd}</T>
          {i < last ? <path className="v19-sk-path" d={`M${xs[i] + widths[i]} 33 H${xs[i + 1]}`} /> : null}
        </g>
      ))}
      {[0, 1, 2].map((i) => (
        <circle key={i} className="v19-sk-bead is-run" style={{ '--i': i, '--to': `${xs[last] - xs[0] - widths[0]}px` }} cx={xs[0] + widths[0]} cy="33" r="3.4" />
      ))}
      {s.drop ? (
        <g className="v19-sk-fail">
          <path className="v19-sk-cross" d={`M${xs[1] + widths[1] + 6} 56 l10 10 M${xs[1] + widths[1] + 16} 56 l-10 10`} />
          <T x={xs[1] + widths[1] + 30} y={66} cls="is-small is-was">{s.drop}</T>
        </g>
      ) : (
        <T x={0} y={66} cls="is-small">{s.foot}</T>
      )}
    </SVG>
  );
}

/* Bars, side by side, growing to their value. */
function Bars({ s }) {
  const rows = s.rows;
  const rh = Math.min(16, Math.floor(60 / rows.length) - 4);
  return (
    <SVG alt={s.alt}>
      {rows.map((r, i) => {
        const y = 6 + i * (rh + 6);
        return (
          <g key={r.k}>
            <T x={0} y={y + rh - 3}>{r.k}</T>
            <rect className={`v19-sk-grow${r.hot ? ' is-hot' : ''}`} style={{ '--i': i }} x="150" y={y} width={Math.round(300 * r.w)} height={rh} rx="2" />
            <T x={156 + Math.round(300 * r.w)} y={y + rh - 3} cls={r.hot ? 'is-hot' : 'is-small'}>{r.v}</T>
          </g>
        );
      })}
    </SVG>
  );
}

/* A rise: columns climbing left to right, to a number. */
function Rise({ s }) {
  const cols = s.cols;
  const cw = Math.floor(360 / cols.length) - 5;
  return (
    <SVG alt={s.alt}>
      <T x={0} y={40}>{s.head}</T>
      {cols.map((h, i) => (
        <rect key={i} className={`v19-sk-col${i === cols.length - 1 ? ' is-hot' : ''}`} style={{ '--i': i }} x={100 + i * (cw + 5)} y={60 - Math.round(h * 52)} width={cw} height={Math.round(h * 52)} rx="1.5" />
      ))}
      <T x={470} y={20} cls="is-hot">{s.tail}</T>
      <T x={100} y={72} cls="is-small">{s.foot}</T>
    </SVG>
  );
}

/* A wheel coming off a car, and a different one going on. */
function Swap({ s }) {
  return (
    <SVG alt={s.alt}>
      <path className="v19-sk-path is-body" d="M60 44 L90 20 H200 L240 44 H300 V56 H40 V44 Z" />
      <circle className="v19-sk-wheel is-old" cx="100" cy="56" r="12" />
      <g className="v19-sk-wheel is-new">
        <circle cx="240" cy="56" r="12" />
        <path d="M240 44 V68 M228 56 H252 M231.5 47.5 L248.5 64.5 M248.5 47.5 L231.5 64.5" />
      </g>
      <T x={330} y={40} cls="is-was">{s.head}</T>
      <T x={330} y={60} cls="is-small">{s.foot}</T>
    </SVG>
  );
}

/* ── the migration, three ways ── */

/* A: three providers on lanes, polled on a timer, switched to events over one week. */
function Migrate() {
  const lanes = ['Gmail', 'Graph', 'IMAP'];
  return (
    <SVG alt="Three mail providers moved from polling to event-driven ingress in one week">
      {lanes.map((l, i) => {
        const y = 12 + i * 18;
        return (
          <g key={l}>
            <T x={0} y={y + 4}>{l}</T>
            <line className="v19-sk-rule is-dash" x1="48" y1={y} x2="212" y2={y} />
            {[0, 1, 2].map((k) => (
              <circle key={k} className="v19-sk-poll" style={{ '--i': i * 3 + k }} cx={70 + k * 60} cy={y} r="2.6" />
            ))}
            <line className="v19-sk-rule is-live" x1="300" y1={y} x2="470" y2={y} />
            {[0, 1, 2, 3, 4, 5].map((k) => (
              <rect key={k} className="v19-sk-pulse" style={{ '--i': i * 6 + k }} x={306 + k * 28} y={y - 4} width="3" height="8" rx="1" />
            ))}
          </g>
        );
      })}
      <rect className="v19-sk-cut" x="228" y="4" width="58" height="52" rx="3" />
      <T x={257} y={26} cls="is-mid is-centre">one</T>
      <T x={257} y={40} cls="is-mid is-centre">week</T>
      <T x={48} y={66} cls="is-was">polled, about 90 s late</T>
      <T x={470} y={66} cls="is-hot" anchor="end">on the event, about 3 s</T>
    </SVG>
  );
}

/* B: one week as a timeline; each provider cuts over on its day and the latency line falls. */
function Cutover() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dx = 62;
  const cuts = [{ k: 'Gmail', d: 1 }, { k: 'Graph', d: 3 }, { k: 'IMAP', d: 5 }];
  const pts = [];
  for (let d = 0; d <= 6; d += 1) {
    const live = cuts.filter((c) => c.d <= d).length;
    const y = 14 + (1 - live / 3) * 26;
    pts.push(`${40 + d * dx},${y}`);
  }
  return (
    <SVG alt="One week; three providers cut over on their day; latency falls from ninety seconds to three">
      {days.map((d, i) => (
        <g key={d}>
          <line className="v19-sk-rule" x1={40 + i * dx} y1="8" x2={40 + i * dx} y2="48" />
          <T x={40 + i * dx} y={60} cls="is-small is-centre">{d}</T>
        </g>
      ))}
      <polyline className="v19-sk-steps-line is-hot" points={pts.join(' ')} />
      {cuts.map((c, i) => (
        <g key={c.k} className="v19-sk-pass" style={{ '--i': i }}>
          <circle cx={40 + c.d * dx} cy={14 + (1 - (i + 1) / 3) * 26} r="4" className="v19-sk-cutdot" />
          <T x={40 + c.d * dx + 8} y={14 + (1 - (i + 1) / 3) * 26 + 4} cls="is-mid">{c.k}</T>
        </g>
      ))}
      <T x={0} y={18} cls="is-was">90 s</T>
      <T x={0} y={44} cls="is-hot">3 s</T>
      <T x={470} y={72} cls="is-small" anchor="end">thousands of users, live, nothing suppressed</T>
    </SVG>
  );
}

/* C: two stopwatches, ninety seconds against three. */
function Stopwatch() {
  const Watch = ({ cx, secs, hot }) => {
    const a = (secs / 120) * Math.PI * 2 - Math.PI / 2;
    const r = 22;
    const x = cx + Math.cos(a) * r;
    const y = 36 + Math.sin(a) * r;
    const big = secs / 120 > 0.5 ? 1 : 0;
    return (
      <g>
        <circle cx={cx} cy="36" r="26" className="v19-sk-watch" />
        <rect x={cx - 3} y="4" width="6" height="5" rx="1" className="v19-sk-watch-btn" />
        <path d={`M${cx} 14 A22 22 0 ${big} 1 ${x.toFixed(1)} ${y.toFixed(1)}`} className={`v19-sk-watch-arc${hot ? ' is-hot' : ''}`} />
        <line x1={cx} y1="36" x2={x.toFixed(1)} y2={y.toFixed(1)} className={`v19-sk-watch-hand${hot ? ' is-hot' : ''}`} />
        <circle cx={cx} cy="36" r="2" className="v19-sk-watch-pin" />
      </g>
    );
  };
  return (
    <SVG alt="A stopwatch reading ninety seconds beside one reading three">
      <Watch cx={90} secs={90} />
      <T x={130} y={32} cls="is-was">90 s, polling</T>
      <T x={130} y={48} cls="is-small">before the migration</T>
      <Watch cx={330} secs={3} hot />
      <T x={370} y={32} cls="is-hot">3 s, on the event</T>
      <T x={370} y={48} cls="is-small">after one week</T>
    </SVG>
  );
}

/* ── working memory, three ways ── */

/* A: the pipeline. Code builds the menu, the model only picks and writes prose, code puts the facts back. */
function Strict() {
  const rows = ['the lease renewal', 'invoice 4471', 'Tuesday with Ana'];
  return (
    <SVG alt="The model chooses from real candidates behind opaque handles and never writes an identifier">
      <T x={0} y={12} cls="is-small">real threads, from code</T>
      {rows.map((r, i) => (
        <g key={r} className="v19-sk-row" style={{ '--i': i }}>
          <rect className={`v19-sk-tag${i === 1 ? ' is-hot' : ''}`} x="0" y={18 + i * 16} width="22" height="11" rx="2" />
          <T x={11} y={26 + i * 16} cls="is-tag is-centre">{['#a', '#b', '#c'][i]}</T>
          <T x={28} y={27 + i * 16} cls={i === 1 ? 'is-mid' : undefined}>{r}</T>
        </g>
      ))}
      <path className="v19-sk-path" d="M170 34 H220" />
      <rect className="v19-sk-box" x="220" y="19" width="70" height="30" rx="3" />
      <T x={255} y={38} cls="is-mid is-centre">model</T>
      <path className="v19-sk-path" d="M290 34 H340" />
      <rect className="v19-sk-bubble" x="340" y="12" width="176" height="44" rx="5" />
      <T x={352} y={30} cls="is-say">“you still owe them a reply”</T>
      <g className="v19-sk-pass">
        <rect className="v19-sk-tag is-hot" x="352" y="36" width="22" height="11" rx="2" />
        <T x={363} y={44} cls="is-tag is-centre">#b</T>
        <T x={380} y={45} cls="is-small">re-attached by code</T>
      </g>
      <T x={220} y={66} cls="is-small">picks a handle, writes words, never an id</T>
    </SVG>
  );
}

/* B: a menu. The only things the model can say are on it. */
function Menu() {
  const items = ['the lease renewal', 'invoice 4471', 'Tuesday with Ana', 'the offer from Sam'];
  return (
    <SVG alt="A menu of real threads; the model can only point at one">
      <rect className="v19-sk-card" x="0" y="2" width="230" height="70" rx="4" />
      <T x={12} y={16} cls="is-small">menu, built by code</T>
      {items.map((it, i) => (
        <g key={it} className="v19-sk-row" style={{ '--i': i }}>
          {i === 2 ? <rect className="v19-sk-pick" x="8" y={22 + i * 12 - 9} width="214" height="12" rx="2" /> : null}
          <T x={14} y={22 + i * 12} cls={i === 2 ? 'is-mid' : undefined}>{it}</T>
        </g>
      ))}
      <path className="v19-sk-path" d="M240 36 H290" />
      <rect className="v19-sk-box" x="290" y="21" width="62" height="30" rx="3" />
      <T x={321} y={40} cls="is-mid is-centre">model</T>
      <path className="v19-sk-path" d="M352 36 H396" />
      <g className="v19-sk-pass">
        <T x={400} y={30} cls="is-hot">points at one</T>
        <T x={400} y={46} cls="is-small">writes a sentence</T>
      </g>
      <g className="v19-sk-fail">
        <path className="v19-sk-cross" d="M400 56 l9 9 M409 56 l-9 9" />
        <T x={416} y={65} cls="is-small is-was">a thread that does not exist</T>
      </g>
    </SVG>
  );
}

/* C: before and after. What the old summary could say; what the new one can. */
function Verdict() {
  return (
    <SVG alt="Before: invented threads and inverted owners. After: only real ones, owners from code.">
      <T x={0} y={12} cls="is-was">before</T>
      {['“they owe you a reply”', 'a thread nobody sent', 'closed, shown open'].map((s, i) => (
        <g key={s} className="v19-sk-fail" style={{ '--i': i }}>
          <path className="v19-sk-cross" d={`M2 ${22 + i * 16} l7 7 M9 ${22 + i * 16} l-7 7`} />
          <T x={16} y={29 + i * 16} cls="is-small is-was">{s}</T>
        </g>
      ))}
      <line className="v19-sk-rule" x1="250" y1="4" x2="250" y2="70" />
      <T x={270} y={12} cls="is-hot">after</T>
      {['#b, you owe them', 'every thread is real', 'closed means closed'].map((s, i) => (
        <g key={s} className="v19-sk-pass" style={{ '--i': i }}>
          <path className="v19-sk-tick" d={`M272 ${24 + i * 16} l5 5 l9 -11`} />
          <T x={292} y={29 + i * 16} cls="is-small">{s}</T>
        </g>
      ))}
      <T x={470} y={72} cls="is-small" anchor="end">proved by a test on every build</T>
    </SVG>
  );
}

/* ── the connector, two more ways (A is bars) ── */

/* B: coding agents plugging into one socket. */
function Socket() {
  const agents = ['Claude Code', 'Codex', 'Antigravity', 'any MCP client'];
  return (
    <SVG alt="Coding agents plugging into Alfred_ through one MCP socket">
      {agents.map((a, i) => (
        <g key={a} className="v19-sk-row" style={{ '--i': i }}>
          <rect className="v19-sk-box" x="0" y={4 + i * 17} width="120" height="13" rx="2" />
          <T x={60} y={13.5 + i * 17} cls="is-tag is-centre">{a}</T>
          <path className="v19-sk-path" d={`M120 ${10.5 + i * 17} H170 L200 37`} />
        </g>
      ))}
      <rect className="v19-sk-box is-end" x="200" y="22" width="86" height="30" rx="3" />
      <T x={243} y={41} cls="is-mid is-centre">MCP · OAuth 2.0</T>
      <path className="v19-sk-path" d="M286 37 H330" />
      <rect className="v19-sk-cut" x="330" y="14" width="80" height="46" rx="4" />
      <T x={370} y={33} cls="is-mid is-centre">Alfred_</T>
      <T x={370} y={49} cls="is-small is-centre">your mail</T>
      <T x={430} y={30} cls="is-hot">one lookup</T>
      <T x={430} y={46} cls="is-was">721 ms boot</T>
    </SVG>
  );
}

/* C: the anatomy of one call, before and after. */
function CallTime() {
  return (
    <SVG alt="One call: 721 milliseconds of booting before, one lookup after">
      <T x={0} y={18}>one call, before</T>
      <rect className="v19-sk-grow" style={{ '--i': 0 }} x="120" y="8" width="360" height="12" rx="2" />
      <T x={126} y={17} cls="is-tag">booting a 30 MB dependency tree</T>
      <rect className="v19-sk-grow is-hot" style={{ '--i': 1 }} x="480" y="8" width="8" height="12" rx="2" />
      <T x={492} y={17} cls="is-small">work</T>
      <T x={0} y={46}>one call, now</T>
      <rect className="v19-sk-grow is-hot" style={{ '--i': 2 }} x="120" y="36" width="12" height="12" rx="2" />
      <rect className="v19-sk-grow is-hot" style={{ '--i': 3 }} x="136" y="36" width="8" height="12" rx="2" />
      <T x={150} y={45} cls="is-hot">lookup · work</T>
      <T x={0} y={68} cls="is-small">98.3% of all traffic was the grey bar</T>
    </SVG>
  );
}

/* ── the harness, three ways ── */

/* A: a tape of real turns, replayed, each one scored. */
function Replay() {
  const marks = ['ok', 'ok', 'x', 'ok', 'ok', 'ok', 'x', 'ok', 'ok', 'ok', 'ok', 'ok'];
  return (
    <SVG alt="A tape of real agent turns replayed and scored">
      <T x={0} y={16} cls="is-small">real traces, replayed</T>
      <rect className="v19-sk-tape" x="0" y="22" width="500" height="24" rx="3" />
      {marks.map((m, i) => (
        <g key={i} className="v19-sk-row" style={{ '--i': i }}>
          <rect x={8 + i * 41} y="27" width="34" height="14" rx="2" className="v19-sk-frame" />
          {m === 'ok' ? <path className="v19-sk-tick is-small" d={`M${18 + i * 41} 34 l4 4 l8 -8`} /> : <path className="v19-sk-cross is-small" d={`M${20 + i * 41} 30 l8 8 M${28 + i * 41} 30 l-8 8`} />}
        </g>
      ))}
      <T x={0} y={66} cls="is-hot">two regressions, caught before the ship</T>
      <T x={500} y={66} cls="is-small" anchor="end">fixtures · scoring · tool-calling reliability</T>
    </SVG>
  );
}

/* B: scenarios by run, a grid, a few cells wrong. */
function Scenarios() {
  const rows = 4;
  const cols = 14;
  const bad = new Set([9, 30, 47]);
  return (
    <SVG alt="A grid of scenarios against runs; three cells fail">
      <T x={0} y={14} cls="is-small">scenarios</T>
      <T x={500} y={14} cls="is-small" anchor="end">runs</T>
      {Array.from({ length: rows * cols }).map((_, i) => {
        const r = Math.floor(i / cols);
        const c = i % cols;
        return <rect key={i} className={`v19-sk-tick-box${bad.has(i) ? ' is-hot' : ' is-ok'}`} style={{ '--i': i }} x={4 + c * 35} y={20 + r * 11} width="31" height="8" rx="1.5" />;
      })}
      <T x={0} y={72} cls="is-small">every change runs the whole grid; a red cell is a regression</T>
    </SVG>
  );
}

/* C: reliability over releases; one drop, flagged. */
function Regress() {
  const pts = [0.9, 0.92, 0.93, 0.91, 0.95, 0.96, 0.7, 0.97, 0.97, 0.98];
  const x = (i) => 30 + i * 50;
  const y = (v) => 56 - (v - 0.6) * 100;
  return (
    <SVG alt="Tool-calling reliability by release, one regression flagged and fixed">
      <line className="v19-sk-rule" x1="30" y1="56" x2="480" y2="56" />
      <polyline className="v19-sk-steps-line" points={pts.map((v, i) => `${x(i)},${y(v).toFixed(1)}`).join(' ')} />
      {pts.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v).toFixed(1)} r={i === 6 ? 4 : 2.5} className={i === 6 ? 'v19-sk-cutdot' : 'v19-sk-watch-pin'} />
      ))}
      <T x={x(6)} y={y(0.7) + 16} cls="is-hot is-centre">caught</T>
      <T x={0} y={20} cls="is-small">reliability</T>
      <T x={480} y={70} cls="is-small" anchor="end">by release</T>
    </SVG>
  );
}

/* ── context, two more ways (B is a flow) ── */

/* A: a turn on a timeline; the context is assembled before the turn asks. */
function Ahead() {
  return (
    <SVG alt="Context assembled before the turn; the answer follows without a pause">
      <line className="v19-sk-rule" x1="0" y1="40" x2="500" y2="40" />
      <rect className="v19-sk-grow is-hot" style={{ '--i': 0 }} x="20" y="20" width="150" height="12" rx="2" />
      <T x={20} y={16} cls="is-small">context, assembled ahead</T>
      <line className="v19-sk-rule is-live" x1="190" y1="28" x2="190" y2="52" />
      <T x={190} y={64} cls="is-mid is-centre">message arrives</T>
      <rect className="v19-sk-grow" style={{ '--i': 1 }} x="196" y="34" width="40" height="12" rx="2" />
      <T x={244} y={44} cls="is-small">the turn</T>
      <rect className="v19-sk-grow is-hot" style={{ '--i': 2 }} x="300" y="34" width="24" height="12" rx="2" />
      <T x={332} y={44} cls="is-hot">answer</T>
      <T x={500} y={16} cls="is-was" anchor="end">retrieval inside the turn: a pause on the phone</T>
    </SVG>
  );
}

/* C: the turn's time budget, and how little of it retrieval takes now. */
function Budget() {
  return (
    <SVG alt="The time a turn has, and how little of it retrieval takes now">
      <T x={0} y={18}>what a turn can spend</T>
      <rect className="v19-sk-tape" x="0" y="26" width="500" height="18" rx="3" />
      <rect className="v19-sk-grow is-was-bar" style={{ '--i': 0 }} x="0" y="26" width="290" height="18" rx="3" />
      <T x={8} y={39} cls="is-tag">retrieval, on request</T>
      <rect className="v19-sk-grow is-hot" style={{ '--i': 1 }} x="0" y="52" width="26" height="14" rx="2" />
      <T x={34} y={63} cls="is-hot">retrieval, ahead of the turn</T>
      <T x={500} y={63} cls="is-small" anchor="end">the rest is the answer</T>
    </SVG>
  );
}

function Sketch({ s }) {
  if (!s) return null;
  switch (s.kind) {
    case 'cells': return <Cells s={s} />;
    case 'flow': return <Flow s={s} />;
    case 'bars': return <Bars s={s} />;
    case 'rise': return <Rise s={s} />;
    case 'swap': return <Swap s={s} />;
    case 'migrate': return <Migrate />;
    case 'cutover': return <Cutover />;
    case 'stopwatch': return <Stopwatch />;
    case 'strict': return <Strict />;
    case 'menu': return <Menu />;
    case 'verdict': return <Verdict />;
    case 'socket': return <Socket />;
    case 'calltime': return <CallTime />;
    case 'replay': return <Replay />;
    case 'scenarios': return <Scenarios />;
    case 'regress': return <Regress />;
    case 'ahead': return <Ahead />;
    case 'budget': return <Budget />;
    default: return null;
  }
}

/* One figure: the before, the after, the line. */
function Dial({ f, live, isOpen, run, onLive, onPick }) {
  return (
    <div
      className={`v19-dial${live ? ' is-live' : ''}${isOpen ? ' is-open' : ''}`}
      onMouseEnter={() => onLive(f.id)}
      data-keep-open={isOpen ? '' : undefined}
    >
      <button
        type="button"
        className="v19-dial-face"
        onClick={() => {
          onLive(f.id);
          onPick(f.id);
        }}
        aria-expanded={isOpen}
        data-keep-open=""
      >
        <span className="v19-dial-was">{f.was}</span>
        <span className={`v19-dial-now${String(f.now).length > 9 ? ' is-long' : ''}`}>
          <Tick value={f.now} run={run} again={live} />
        </span>
        <span className="v19-dial-label">{f.label}</span>
        <span className="v19-dial-mark" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
    </div>
  );
}

/* the drawing a figure carries: its picked one, or its only one */
const sketchOf = (f, lab) => (f.sketches ? f.sketches[lab[`sk_${f.id}`]] || f.sketches.a : f.sketch);

/* The row under the dials: the drawing, and the note beside it when one is open. Which side
   the note takes depends on which column the open box is in, so it never covers the drawing. */
function Row({ figures, live, open, cols = 5, lab }) {
  const figure = figures.find((f) => f.id === open) || figures.find((f) => f.id === live) || figures[0];
  const opened = figures.find((f) => f.id === open);
  const col = opened ? figures.indexOf(opened) % cols : -1;
  const noteLeft = opened && col < 2;
  const s = sketchOf(figure, lab);
  return (
    <div className={`v19-sk-row${opened ? ' has-note' : ''}${noteLeft ? ' note-left' : ''}`}>
      {opened ? (
        <div className="v19-sk-note" key={`n-${opened.id}`} data-keep-open="">
          <p>{opened.note}</p>
        </div>
      ) : null}
      <div className="v19-sk-wrap" key={`${figure.id}-${s ? s.kind : ''}`}>
        <Sketch s={s} />
      </div>
    </div>
  );
}

/* ── the car on the WheelPrice bar ────────────────────────────────────
   A low coupe in profile. Point at it and its wheels spin up for a beat, then it tears off to
   the left, comes back in from the right and stops exactly where it was. The variant decides
   what else happens: smoke off the back wheel first, or a slide at the end. */
function Car({ go, kind }) {
  return (
    <span className={`v19-car is-${kind}${go ? ' go' : ''}`} aria-hidden="true">
      <span className="v19-car-smoke">
        <i /><i /><i /><i />
      </span>
      <svg viewBox="0 0 120 44" className="v19-car-body">
        <path d="M6 30 L14 18 Q20 10 34 9 L62 8 Q78 8 88 16 L98 24 L110 27 Q116 29 114 34 L110 36 H8 Q4 34 6 30 Z" className="v19-car-shell" />
        <path d="M30 18 L36 11 H58 L62 18 Z M64 18 L66 11 H74 Q82 12 88 18 Z" className="v19-car-glass" />
        <rect x="8" y="27" width="10" height="3" rx="1" className="v19-car-lamp is-rear" />
        <rect x="104" y="26" width="9" height="4" rx="1" className="v19-car-lamp" />
      </svg>
      <svg viewBox="0 0 24 24" className="v19-car-wheel is-rear">
        <circle cx="12" cy="12" r="11" className="v19-car-tyre" />
        <circle cx="12" cy="12" r="6.5" className="v19-car-rim" />
        <path d="M12 5.5 V18.5 M5.5 12 H18.5 M7.4 7.4 L16.6 16.6 M16.6 7.4 L7.4 16.6" className="v19-car-spoke" />
      </svg>
      <svg viewBox="0 0 24 24" className="v19-car-wheel is-front">
        <circle cx="12" cy="12" r="11" className="v19-car-tyre" />
        <circle cx="12" cy="12" r="6.5" className="v19-car-rim" />
        <path d="M12 5.5 V18.5 M5.5 12 H18.5 M7.4 7.4 L16.6 16.6 M16.6 7.4 L7.4 16.6" className="v19-car-spoke" />
      </svg>
    </span>
  );
}

export default function Work({ sectionRef }) {
  const { lab } = useLab();
  const ref = useRef(null);
  const seen = useOnScreen(ref);
  const { open, toggle } = useOpener();
  const [live, setLive] = useState(FIGURES[0].id);
  const [past, setPast] = useState(false);
  const [wpLive, setWpLive] = useState(WHEELPRICE.figures[0].id);
  const [alsoOpen, setAlsoOpen] = useState(false);
  const pastRef = useRef(null);
  const pastSeen = useOnScreen(pastRef, '-30%');
  const [go, setGo] = useState(false);
  const goRef = useRef(null);

  // the lap: wheels spin up, off left, back from the right, stop. Not again until it has stopped.
  const lap = () => {
    if (goRef.current) return;
    setGo(true);
    goRef.current = window.setTimeout(() => {
      setGo(false);
      goRef.current = null;
    }, 3600);
  };
  useEffect(() => () => { if (goRef.current) window.clearTimeout(goRef.current); }, []);

  return (
    <section className="v19-work" ref={sectionRef} id="work" aria-label="What I do now">
      <div className="v19-now">
        <div className="v19-slab-in" ref={ref}>
          <header className="v19-head-split">
            <div>
              <p className="v19-eye">
                <span className="v19-dot is-live" aria-hidden="true" />
                {ALFRED.eyebrow}
              </p>
              <h2 className="v19-h2">
                {ALFRED.hello}{' '}
                <a className="v19-mark" href={ALFRED.url} target="_blank" rel="noreferrer">
                  <img src={ALFRED.logo} alt="" />
                  <span>{ALFRED.company}</span>
                </a>
                .
              </h2>
              <p className="v19-lede">{ALFRED.about}</p>
            </div>

            <aside className="v19-glance">
              <p className="v19-mini">At a glance</p>
              <dl>
                {ALFRED.glance.map((g) => (
                  <div key={g.k}><dt>{g.k}</dt><dd>{g.v}</dd></div>
                ))}
              </dl>
              <a className="v19-glance-go" href={ALFRED.url} target="_blank" rel="noreferrer">
                {ALFRED.tryLabel}
              </a>
            </aside>
          </header>

          <div className="v19-dials" onMouseLeave={() => setLive(FIGURES[0].id)}>
            {FIGURES.map((f) => (
              <Dial key={f.id} f={f} live={live === f.id} isOpen={open === f.id} run={seen} onLive={setLive} onPick={toggle} />
            ))}
          </div>

          <Row figures={FIGURES} live={live} open={open} lab={lab} />
        </div>
      </div>

      {/* below the fold: the one before Alfred_, shut, with a car on it */}
      <div className="v19-past" ref={pastRef}>
        <div className="v19-slab-in">
          <div className={`v19-wp${past ? ' is-open' : ''}${pastSeen ? ' is-seen' : ''}`} data-keep-open="">
            <button
              type="button"
              className="v19-wp-bar"
              onClick={() => setPast((p) => !p)}
              aria-expanded={past}
              data-keep-open=""
            >
              {WHEELPRICE.logo ? <img className="v19-wp-logo" src={WHEELPRICE.logo} alt="" /> : null}
              <span className="v19-wp-who">
                <b>{WHEELPRICE.company}</b>
                <i>{WHEELPRICE.title}</i>
              </span>
              <span className="v19-wp-say">{WHEELPRICE.short}</span>
              <span className="v19-wp-when">{WHEELPRICE.when}</span>
              <span className="v19-wp-chev" aria-hidden="true" />
            </button>
            <span className="v19-wp-drive" onMouseEnter={lap} onClick={lap} aria-hidden="true">
              <Car go={go} kind={lab.car} />
            </span>

            <div className="v19-wp-open" hidden={!past}>
              <p className="v19-lede">{WHEELPRICE.about}</p>
              <div className="v19-dials is-small" onMouseLeave={() => setWpLive(WHEELPRICE.figures[0].id)}>
                {WHEELPRICE.figures.map((f) => (
                  <Dial key={f.id} f={f} live={wpLive === f.id} isOpen={open === f.id} run={past} onLive={setWpLive} onPick={toggle} />
                ))}
              </div>
              <Row figures={WHEELPRICE.figures} live={wpLive} open={open} cols={4} lab={lab} />
            </div>
          </div>

          <div className="v19-after">
            <p className="v19-mini">Also</p>
            <div className={`v19-role${alsoOpen ? ' is-open' : ''}`} data-keep-open="">
              <button type="button" className="v19-role-line" onClick={() => setAlsoOpen((o) => !o)} aria-expanded={alsoOpen} data-keep-open="">
                <span className="v19-role-when">{AFTER.map((r) => r.when.split(/\s[–-]\s/)[0]).join(' · ')}</span>
                <span className="v19-role-who">
                  <b>{AFTER_LINE}</b>
                </span>
                <span className="v19-role-say">{AFTER.map((r) => r.line).join(' ')}</span>
                <span className="v19-role-chev" aria-hidden="true" />
              </button>
              <div className="v19-role-more" hidden={!alsoOpen}>
                {AFTER.map((r) => (
                  <div className="v19-role-one" key={r.id}>
                    <p className="v19-role-head">
                      <b>{r.company}</b>
                      <i>{r.title}</i>
                      <span>{r.when}</span>
                    </p>
                    <ul>
                      {r.bullets.map((bl) => (
                        <li key={bl}>{bl}</li>
                      ))}
                    </ul>
                    <p className="v19-chiprow">
                      {r.tech.slice(0, 10).map((t) => (
                        <span className="v19-chip" key={t}>{t}</span>
                      ))}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
