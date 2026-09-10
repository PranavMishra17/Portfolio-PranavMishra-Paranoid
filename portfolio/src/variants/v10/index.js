// v10 — RECEIVER: the portfolio as a radio band. Drag the needle; content tunes in.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import './v10.css';

const LO = 88.0;
const HI = 108.0;
const CAPTURE = 1.4; // MHz either side of a station where signal > 0
const SNAP = 0.7; // release within this and the needle settles on the station

const STATIONS = [
  {
    freq: 91.3,
    call: 'ABT',
    name: 'About',
    band: 'Voice · continuous',
    blocks: [
      { k: 'h', t: 'Ilse Marrow' },
      { k: 'p', t: 'Staff engineer at Fathom Instruments, Lisbon. I write software for instruments that measure things: loggers, calibration rigs, the quiet programs that decide whether a number can be trusted.' },
      { k: 'p', t: 'Twelve years in, most of it near hardware and the people who carry it into the rain. Currently leading the calibration platform at Fathom with one other engineer and a very patient oscilloscope.' },
      { k: 'p', t: 'Off the clock: tide tables, bad bread on a good schedule, cold-water swimming, opinions about pencils.' },
    ],
  },
  {
    freq: 94.7,
    call: 'WRK',
    name: 'Work',
    band: 'Employment · three transmitters',
    blocks: [
      { k: 'h', t: 'Where the signal has come from' },
      { k: 'li', t: '2024 – now · Fathom Instruments · Staff engineer. Drift models, field-calibration workflows, and the audit trail that proves a billed number was honest.' },
      { k: 'li', t: '2021 – 2024 · Halyard Labs · Senior engineer. The software half of a hardware company: firmware update paths, sync over bad satellite links, a desktop app for ancient laptops.' },
      { k: 'li', t: '2016 – 2019 · Ostrander & Co. · Engineer. Software for survey crews. Learned that a crew in the rain does not read error messages.' },
      { k: 'li', t: '2012 – 2016 · University of Tromsø · BSc Physics and a year of a PhD that became a data pipeline instead.' },
    ],
  },
  {
    freq: 98.1,
    call: 'PRJ',
    name: 'Projects',
    band: 'Data · four carriers',
    blocks: [
      { k: 'h', t: 'Things that shipped' },
      { k: 'li', t: 'Ledger — a drift-correcting time-series store where every sample keeps its calibration lineage. Rust core, Postgres.', href: 'https://example.com/ledger', a: 'Source ↗' },
      { k: 'li', t: 'Sieve — anomaly triage for 40,000 water meters. A ranked list of physically implausible readings with the reason attached. Halved false dispatches.', href: 'https://example.com/sieve', a: 'Write-up ↗' },
      { k: 'li', t: 'Windrow — resumable sync for loggers that see the internet four minutes a day. Chunked, content-addressed, boring on purpose.', href: 'https://example.com/windrow', a: 'Design notes ↗' },
      { k: 'li', t: 'Plumb — a one-screen levelling app that replaced a 40-page manual with one large number and a colour.' },
    ],
  },
  {
    freq: 101.5,
    call: 'WRT',
    name: 'Writing',
    band: 'Spoken word · occasional',
    blocks: [
      { k: 'h', t: 'Essays that held up' },
      { k: 'li', t: '“The Thermometer Was Fine” — a season of impossible readings at a coastal station, and the four months it took to blame the spreadsheet.', href: 'https://example.com/thermometer', a: 'Read · 9 min ↗' },
      { k: 'li', t: '“Significant Figures Are a Promise” — what it means to print 12.40 instead of 12.4, and why software keeps breaking the promise.', href: 'https://example.com/sigfigs', a: 'Read · 6 min ↗' },
      { k: 'li', t: '“A Field Guide to Wrong Numbers” — stuck sensors, wrap-arounds, timezone folds, and the ones that are right but nobody believes.', href: 'https://example.com/wrong', a: 'Read · 14 min ↗' },
      { k: 'li', t: 'Talk: “Everything is a units bug”, SensorConf 2025.', href: 'https://example.com/units', a: 'Slides ↗' },
    ],
  },
  {
    freq: 104.9,
    call: 'CTC',
    name: 'Contact',
    band: 'Two-way · open',
    blocks: [
      { k: 'h', t: 'Transmit back' },
      { k: 'p', t: 'Email is the reliable channel. I answer slowly and completely.' },
      { k: 'li', t: 'ilse@marrow.example', href: 'mailto:ilse@marrow.example', a: 'Open mail ↗' },
      { k: 'li', t: 'github.com/ilsemarrow', href: 'https://example.com/github', a: 'Open ↗' },
      { k: 'li', t: 'CV as a PDF, one page, no colour.', href: 'https://example.com/cv.pdf', a: 'Download ↗' },
    ],
  },
];

const GLYPHS = '▓▒░╳/|<>=+*#%&@~^';

function scramble(text, amount) {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === ' ' || ch === '\n') { out += ch; continue; }
    out += Math.random() < amount ? GLYPHS[Math.floor(Math.random() * GLYPHS.length)] : ch;
  }
  return out;
}

function useScramble(text, amount, active) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!active || amount <= 0.02) { setOut(text); return undefined; }
    const tick = () => setOut(scramble(text, amount));
    tick();
    const id = setInterval(tick, 90);
    return () => clearInterval(id);
  }, [text, amount, active]);
  return out;
}

function Sig({ text, amount, active, as: Tag = 'span' }) {
  const out = useScramble(text, amount, active);
  return <Tag>{out}</Tag>;
}

function nearest(freq) {
  let best = STATIONS[0];
  let bd = Infinity;
  for (const s of STATIONS) {
    const d = Math.abs(s.freq - freq);
    if (d < bd) { bd = d; best = s; }
  }
  return { station: best, dist: bd };
}

function Noise({ level, reduced }) {
  const ref = useRef(null);
  useEffect(() => {
    if (reduced || level <= 0.02) return undefined;
    const c = ref.current;
    if (!c) return undefined;
    const ctx = c.getContext('2d');
    const W = 120;
    const H = 72;
    c.width = W;
    c.height = H;
    const img = ctx.createImageData(W, H);
    const draw = () => {
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = v; d[i + 1] = v * 0.85; d[i + 2] = v * 0.6; d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
    };
    draw();
    const id = setInterval(draw, 70);
    return () => clearInterval(id);
  }, [level, reduced]);
  if (reduced) return null;
  return <canvas ref={ref} className="v10-noise" style={{ opacity: Math.min(0.6, level) }} aria-hidden="true" />;
}

export default function V10() {
  const reduced = useReducedMotion();
  const [freq, setFreq] = useState(89.2);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => { document.title = 'Ilse Marrow — receiver'; }, []);

  // Land on the first station shortly after mount (timeout, never rAF-gated).
  useEffect(() => {
    const id = setTimeout(() => setFreq(STATIONS[0].freq), reduced ? 0 : 500);
    return () => clearTimeout(id);
  }, [reduced]);

  const freqFromClientX = useCallback((x) => {
    const el = trackRef.current;
    if (!el) return freq;
    const r = el.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (x - r.left) / r.width));
    return Math.round((LO + p * (HI - LO)) * 10) / 10;
  }, [freq]);

  const snap = useCallback((f) => {
    const { station, dist } = nearest(f);
    return dist <= SNAP ? station.freq : f;
  }, []);

  const onPointerDown = (e) => {
    e.preventDefault();
    trackRef.current?.setPointerCapture?.(e.pointerId);
    setDragging(true);
    setFreq(freqFromClientX(e.clientX));
    trackRef.current?.focus?.();
  };
  const onPointerMove = (e) => {
    if (!dragging) return;
    setFreq(freqFromClientX(e.clientX));
  };
  const onPointerUp = (e) => {
    if (!dragging) return;
    setDragging(false);
    setFreq((f) => snap(f));
  };
  const onKeyDown = (e) => {
    const step = e.shiftKey ? 1 : 0.2;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setFreq((f) => Math.min(HI, Math.round((f + step) * 10) / 10)); }
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setFreq((f) => Math.max(LO, Math.round((f - step) * 10) / 10)); }
    else if (e.key === 'Home') { e.preventDefault(); setFreq(LO); }
    else if (e.key === 'End') { e.preventDefault(); setFreq(HI); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFreq((f) => snap(f)); }
    else if (e.key === 'PageDown' || e.key === 'PageUp') {
      e.preventDefault();
      const dir = e.key === 'PageDown' ? 1 : -1;
      setFreq((f) => {
        const next = STATIONS.filter((s) => (dir > 0 ? s.freq > f + 0.05 : s.freq < f - 0.05));
        if (!next.length) return f;
        return dir > 0 ? next[0].freq : next[next.length - 1].freq;
      });
    }
  };

  const { station, dist } = nearest(freq);
  const signal = Math.max(0, Math.min(1, 1 - dist / CAPTURE));
  const lost = signal < 0.35;
  const amount = reduced ? 0 : Math.round((1 - signal) * 0.85 * 20) / 20; // quantised so intervals don't churn
  const active = !reduced && signal < 0.98;
  const pct = ((freq - LO) / (HI - LO)) * 100;

  const ticks = useMemo(() => {
    const t = [];
    for (let f = LO; f <= HI + 0.001; f += 0.5) t.push(Math.round(f * 10) / 10);
    return t;
  }, []);

  const bars = 9;
  const lit = Math.round(signal * bars);

  return (
    <div className="v10">
      <div className="v10-set">
        <header className="v10-top">
          <div className="v10-brand">
            <span className="v10-mono v10-model">Model P-1 · band II</span>
            <h1>Ilse Marrow</h1>
            <p className="v10-hint">
              A receiver. Drag the needle along the dial, or press a preset. Five stations carry the
              whole portfolio; between them there is only static.
            </p>
          </div>
          <div className="v10-mono v10-freqbox" aria-live="polite">
            <span className="v10-freq">{freq.toFixed(1)}</span>
            <span className="v10-mhz">MHz</span>
          </div>
        </header>

        <div className="v10-glass">
          <div
            ref={trackRef}
            className={`v10-track${dragging ? ' is-dragging' : ''}`}
            role="slider"
            tabIndex={0}
            aria-label="Tuning dial"
            aria-valuemin={LO}
            aria-valuemax={HI}
            aria-valuenow={freq}
            aria-valuetext={`${freq.toFixed(1)} megahertz, ${lost ? 'no station' : station.name}`}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={onKeyDown}
          >
            <div className="v10-stations">
              {STATIONS.map((s) => (
                <span
                  key={s.call}
                  className={`v10-station v10-mono${s === station && !lost ? ' is-live' : ''}`}
                  style={{ left: `${((s.freq - LO) / (HI - LO)) * 100}%` }}
                >
                  <b>{s.call}</b>
                  <i aria-hidden="true" />
                </span>
              ))}
            </div>
            <svg className="v10-scale" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
              {ticks.map((f) => {
                const x = ((f - LO) / (HI - LO)) * 1000;
                const major = Math.abs(f - Math.round(f)) < 0.01 && Math.round(f) % 2 === 0;
                const mid = !major && Math.abs(f - Math.round(f)) < 0.01;
                return (
                  <line
                    key={f}
                    x1={x} x2={x}
                    y1={major ? 8 : mid ? 22 : 34}
                    y2={60}
                    stroke="currentColor"
                    strokeWidth={major ? 2 : 1}
                    vectorEffect="non-scaling-stroke"
                  />
                );
              })}
            </svg>
            <div className="v10-numbers v10-mono" aria-hidden="true">
              {[88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108].map((n) => (
                <span key={n} style={{ left: `${((n - LO) / (HI - LO)) * 100}%` }}>{n}</span>
              ))}
            </div>
            <div className="v10-needle" style={{ left: `${pct}%` }} aria-hidden="true">
              <span className="v10-knob" />
            </div>
          </div>
        </div>

        <div className="v10-presets" role="group" aria-label="Station presets">
          {STATIONS.map((s, i) => (
            <button
              key={s.call}
              type="button"
              className={`v10-preset v10-mono${s === station && !lost ? ' is-live' : ''}`}
              onClick={() => setFreq(s.freq)}
              aria-pressed={s === station && !lost}
            >
              <span className="v10-preset-n">{i + 1}</span>
              <span className="v10-preset-name">{s.name}</span>
              <span className="v10-preset-f">{s.freq.toFixed(1)}</span>
            </button>
          ))}
        </div>

        <section className="v10-display" aria-live="polite" aria-atomic="false">
          <div className="v10-readout v10-mono">
            <span className="v10-readout-name">
              {lost ? '— no carrier —' : `${station.call} · ${station.name}`}
            </span>
            <span className="v10-readout-band">{lost ? `nearest: ${station.name} at ${station.freq.toFixed(1)}` : station.band}</span>
            <span className="v10-meter" aria-label={`Signal ${Math.round(signal * 100)} percent`}>
              {Array.from({ length: bars }).map((_, i) => (
                <i key={i} className={i < lit ? 'on' : ''} />
              ))}
            </span>
          </div>

          <div className="v10-content">
            {lost ? (
              <div className="v10-lost">
                <p className="v10-mono">
                  {reduced ? 'Static.' : 'Static. Keep tuning —'} the nearest carrier is{' '}
                  <button type="button" className="v10-inline" onClick={() => setFreq(station.freq)}>
                    {station.name} at {station.freq.toFixed(1)}
                  </button>
                  .
                </p>
              </div>
            ) : (
              <div className="v10-blocks">
                {station.blocks.map((b, i) => {
                  if (b.k === 'h') {
                    return <h2 key={i}><Sig text={b.t} amount={amount} active={active} /></h2>;
                  }
                  if (b.k === 'p') {
                    return <p key={i}><Sig text={b.t} amount={amount} active={active} /></p>;
                  }
                  return (
                    <div key={i} className="v10-li">
                      <span className="v10-bullet v10-mono" aria-hidden="true">{String(i).padStart(2, '0')}</span>
                      <div>
                        <p><Sig text={b.t} amount={amount} active={active} /></p>
                        {b.href && (
                          <a
                            href={b.href}
                            target={b.href.startsWith('mailto:') ? undefined : '_blank'}
                            rel="noreferrer"
                            className="v10-mono v10-link"
                            tabIndex={signal < 0.7 ? -1 : 0}
                            aria-hidden={signal < 0.7}
                          >
                            <Sig text={b.a} amount={amount} active={active} />
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <Noise level={lost ? 0.9 : 1 - signal} reduced={!!reduced} />
        </section>

        <footer className="v10-foot v10-mono">
          <span>← → tune · shift for coarse · PgUp/PgDn next station · Enter to lock</span>
          <span>No signal is stored. Nothing here is broadcast.</span>
        </footer>
      </div>
    </div>
  );
}
