// v9 — CORE: the portfolio as a drill core. Depth is time. Read downward.
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import './v9.css';

const TOTAL_DEPTH = 14.2; // metres, ≈ years

const WAVES = [
  'M0,30 C50,6 110,34 170,12 S300,30 360,8 S470,32 540,10 S620,30 660,6 L660,30 Z',
  'M0,30 C40,14 90,4 150,20 S260,34 330,10 S440,4 500,22 S600,30 660,12 L660,30 Z',
  'M0,30 C70,26 100,2 160,8 S250,30 320,18 S420,2 480,14 S580,30 660,16 L660,30 Z',
];

const STRATA = [
  {
    id: 'topsoil',
    unit: 'Unit 1 · Topsoil',
    lith: 'dark loam, root traces, still moving',
    from: 0, to: 1.1, years: '2026',
    color: '#5f6e45', wave: 0,
    title: 'Ilse Marrow',
    sub: 'Staff engineer at Fathom Instruments · Lisbon',
    body: 'I write software for instruments that measure things: loggers, calibration rigs, the quiet programs that decide whether a number can be trusted. Twelve years of it, laid down in layers. This page is the core we pulled.',
    inclusions: [
      { id: 'now', label: 'Currently', kind: 'note', text: 'Leading the calibration platform at Fathom. Two engineers, one very patient oscilloscope, and a growing suspicion that most bugs are units errors.' },
      { id: 'reach', label: 'Reach me', kind: 'contact', text: 'Email is best. I answer slowly and completely.', href: 'mailto:ilse@marrow.example', linkLabel: 'ilse@marrow.example' },
    ],
  },
  {
    id: 'loam',
    unit: 'Unit 2 · Clay loam',
    lith: 'dense, iron-banded, well compacted',
    from: 1.1, to: 3.6, years: '2024 – 2026',
    color: '#8a5a3c', wave: 1,
    title: 'Fathom Instruments',
    sub: 'Staff engineer · calibration & data integrity',
    body: 'Fathom makes pressure and flow sensors for water utilities. I own the software that turns a raw sensor into a number a city will bill against: drift models, field-calibration workflows, and the audit trail that proves the number was honest.',
    inclusions: [
      { id: 'ledger', label: 'Ledger', kind: 'project', text: 'A drift-correcting time-series store. Every sample keeps its calibration lineage, so a reading from 2019 can be re-derived under today’s model without touching the original. Rust core, Postgres, a small web UI nobody asked for and everybody uses.', href: 'https://example.com/ledger', linkLabel: 'Source' },
      { id: 'sieve', label: 'Sieve', kind: 'project', text: 'Anomaly triage for 40,000 meters. Not machine learning: a ranked list of physically implausible readings with the reason attached. Cut false dispatches by a little over half.', href: 'https://example.com/sieve', linkLabel: 'Write-up' },
      { id: 'talk-units', label: 'Talk: “Everything is a units bug”', kind: 'talk', text: 'Forty minutes at SensorConf 2025 on the cases where the code was right and the dimension was wrong. Slides and a transcript.', href: 'https://example.com/units', linkLabel: 'Slides' },
    ],
  },
  {
    id: 'clay',
    unit: 'Unit 3 · Silty clay',
    lith: 'grey, plastic, occasional shell fragments',
    from: 3.6, to: 6.4, years: '2021 – 2024',
    color: '#6f7480', wave: 2,
    title: 'Halyard Labs',
    sub: 'Senior engineer · field data tooling',
    body: 'A twelve-person shop building rugged data loggers for hydrologists. I was the software half of a hardware company: firmware update paths, sync over bad satellite links, and a desktop app that ran on laptops older than the interns.',
    inclusions: [
      { id: 'windrow', label: 'Windrow', kind: 'project', text: 'Resumable sync for loggers that see the internet for four minutes a day. Chunked, content-addressed, and boring on purpose. Still shipping in the current product line.', href: 'https://example.com/windrow', linkLabel: 'Design notes' },
      { id: 'tally', label: 'Tally', kind: 'project', text: 'An offline-first desktop app for downloading and eyeballing logger data in the field. Electron, then not Electron, then a very small Tauri build that fit on a USB stick with room to spare.' },
    ],
  },
  {
    id: 'peat',
    unit: 'Unit 4 · Peat',
    lith: 'compressed organic matter, still legible',
    from: 6.4, to: 8.0, years: '2019 – 2021',
    color: '#3f3328', wave: 0,
    title: 'The writing layer',
    sub: 'Essays, mostly about measurement and the people who do it',
    body: 'Two years of writing on the side, some of which held up. The pieces that still get read:',
    inclusions: [
      { id: 'e1', label: '“The Thermometer Was Fine”', kind: 'essay', text: 'On a season of impossible readings at a coastal station, and the four months it took to admit the fault was in the spreadsheet.', href: 'https://example.com/thermometer', linkLabel: 'Read (9 min)' },
      { id: 'e2', label: '“Significant Figures Are a Promise”', kind: 'essay', text: 'What it means to print 12.40 instead of 12.4, and why software keeps breaking the promise without noticing.', href: 'https://example.com/sigfigs', linkLabel: 'Read (6 min)' },
      { id: 'e3', label: '“A Field Guide to Wrong Numbers”', kind: 'essay', text: 'A taxonomy: stuck sensors, wrap-arounds, timezone folds, and the ones that are right but nobody believes.', href: 'https://example.com/wrong', linkLabel: 'Read (14 min)' },
    ],
  },
  {
    id: 'sand',
    unit: 'Unit 5 · Fine sandstone',
    lith: 'buff, cross-bedded, friable',
    from: 8.0, to: 10.8, years: '2016 – 2019',
    color: '#c19a5b', wave: 1,
    title: 'Ostrander & Co.',
    sub: 'Engineer · shipping software for survey crews',
    body: 'First real job. Ostrander sold total stations and the software that went with them. I learned that a crew in the rain does not read error messages, and that the fastest code review is the one done by a surveyor holding a tripod.',
    inclusions: [
      { id: 'plumb', label: 'Plumb', kind: 'project', text: 'A one-screen levelling app. Replaced a 40-page manual with a single, large number and a colour. Used by roughly two thousand crews until the product was retired.' },
      { id: 'lesson', label: 'What stuck', kind: 'note', text: 'Big type. Few states. Say what you know and what you don’t. Most of my taste comes from this layer.' },
    ],
  },
  {
    id: 'shale',
    unit: 'Unit 6 · Shale',
    lith: 'thinly laminated, fissile, fossiliferous',
    from: 10.8, to: 13.0, years: '2012 – 2016',
    color: '#4b4a55', wave: 2,
    title: 'University of Tromsø',
    sub: 'BSc Physics, then a year that was supposed to be a PhD',
    body: 'I went in to study glaciers and came out writing software, because the software for studying glaciers was worse than the glaciers. Left the doctorate after a year with a finished data pipeline and an unfinished thesis, which turned out to be the right ratio.',
    inclusions: [
      { id: 'thesis', label: 'The pipeline that outlived the thesis', kind: 'note', text: 'A radar-echo processing chain in Python and Fortran. Still cited in the department README, which is more than can be said for the thesis.' },
    ],
  },
  {
    id: 'bedrock',
    unit: 'Unit 7 · Granite',
    lith: 'basement rock, unweathered',
    from: 13.0, to: TOTAL_DEPTH, years: 'before 2012',
    color: '#2e2a2b', wave: 0,
    title: 'Basement',
    sub: 'Things that were here before the work',
    body: 'Grew up on a stretch of Norwegian coast where the tide table was the most-read book in the house. I still keep one. I bake bread badly and on schedule, I swim in water that people describe as “bracing”, and I have opinions about pencil hardness.',
    inclusions: [
      { id: 'tide', label: 'The tide table', kind: 'note', text: 'A printed one, every year, from the harbour office. Probably where the interest in trustworthy numbers comes from.' },
    ],
  },
];

function yearAt(depth) {
  const s = STRATA.find((st) => depth >= st.from && depth < st.to) || STRATA[STRATA.length - 1];
  return s.years;
}

function Edge({ color, wave }) {
  return (
    <svg className="v9-edge" viewBox="0 0 660 30" preserveAspectRatio="none" aria-hidden="true">
      <path d={WAVES[wave]} fill={color} />
    </svg>
  );
}

function Stratum({ s, index, open, setOpen, reduced }) {
  return (
    <section className="v9-stratum" style={{ '--c': s.color }} id={s.id} aria-labelledby={`v9-${s.id}-h`}>
      {index > 0 && <Edge color={s.color} wave={s.wave} />}
      <div className="v9-unit v9-mono">
        <span>{s.unit}</span>
        <span className="v9-lith">{s.lith}</span>
      </div>
      <article className="v9-tag">
        <div className="v9-tag-meta v9-mono">
          <span>{s.from.toFixed(1)} – {s.to.toFixed(1)} m</span>
          <span>{s.years}</span>
        </div>
        <h2 id={`v9-${s.id}-h`}>{s.title}</h2>
        <p className="v9-sub">{s.sub}</p>
        <p className="v9-body">{s.body}</p>
        {s.inclusions.length > 0 && (
          <>
            <div className="v9-incl-head v9-mono">Inclusions ({s.inclusions.length})</div>
            <ul className="v9-incl">
              {s.inclusions.map((inc) => {
                const isOpen = open === inc.id;
                return (
                  <li key={inc.id}>
                    <button
                      type="button"
                      className={`v9-incl-btn v9-mono${isOpen ? ' is-open' : ''}`}
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : inc.id)}
                    >
                      <span className="v9-pebble" aria-hidden="true" />
                      <span className="v9-incl-label">{inc.label}</span>
                      <em>{inc.kind}</em>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          className="v9-incl-body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: reduced ? 0 : 0.28, ease: [0.2, 0.7, 0.2, 1] }}
                        >
                          <div className="v9-incl-inner">
                            <p>{inc.text}</p>
                            {inc.href && (
                              <a href={inc.href} target="_blank" rel="noreferrer" className="v9-mono">
                                {inc.linkLabel || 'Open'} ↗
                              </a>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </article>
    </section>
  );
}

export default function V9() {
  const reduced = useReducedMotion();
  const [depth, setDepth] = useState(0);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    document.title = 'Ilse Marrow — core sample';
    const onScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const p = Math.min(1, Math.max(0, window.scrollY / max));
      setDepth(p * TOTAL_DEPTH);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const ticks = [];
  for (let m = 0; m <= 14; m += 2) ticks.push(m);
  const pct = (depth / TOTAL_DEPTH) * 100;

  return (
    <div className="v9">
      <header className="v9-head">
        <div className="v9-mono v9-kicker">
          <span>Core sample No. 7</span>
          <span>Logged 2026-09-09</span>
          <span>Scale 1 m ≈ 1 yr</span>
        </div>
        <h1>Ilse Marrow</h1>
        <p className="v9-lede">
          Engineer. Fourteen metres of it, read top-down: the surface is today, the bedrock is where it
          started. Every layer has a tag; every tag has inclusions you can open.
        </p>
        <nav className="v9-jump v9-mono" aria-label="Jump to a layer">
          {STRATA.map((s) => (
            <a key={s.id} href={`#${s.id}`}>
              <i style={{ background: s.color }} aria-hidden="true" /> {s.years}
            </a>
          ))}
        </nav>
      </header>

      <div className="v9-rig">
        <aside className="v9-rail" aria-hidden="true">
          <div className="v9-scale">
            {ticks.map((m) => (
              <div key={m} className="v9-tick v9-mono" style={{ top: `${(m / TOTAL_DEPTH) * 100}%` }}>
                <span>{m} m</span>
              </div>
            ))}
            <div className="v9-marker v9-mono" style={{ top: `${pct}%` }}>
              <b>{depth.toFixed(1)} m</b>
              <i>{yearAt(depth)}</i>
            </div>
          </div>
          <div className="v9-pill v9-mono">
            ▼ {depth.toFixed(1)} m · {yearAt(depth)}
          </div>
        </aside>

        <main className="v9-core">
          <div className="v9-grass" aria-hidden="true" />
          {STRATA.map((s, i) => (
            <Stratum key={s.id} s={s} index={i} open={open} setOpen={setOpen} reduced={reduced} />
          ))}
          <footer className="v9-eoh">
            <div className="v9-mono v9-eoh-line">End of hole · {TOTAL_DEPTH} m</div>
            <p>Nothing below this but rock. If you want to add a layer:</p>
            <div className="v9-eoh-links v9-mono">
              <a href="mailto:ilse@marrow.example">ilse@marrow.example</a>
              <a href="https://example.com/github" target="_blank" rel="noreferrer">github</a>
              <a href="https://example.com/notes" target="_blank" rel="noreferrer">notes</a>
              <a href="https://example.com/cv.pdf" target="_blank" rel="noreferrer">cv (pdf)</a>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
