// v14 — "Lined script"
// A script supervisor's lined page. The portfolio is one scene of prose; each vertical
// line in the gutter is one camera setup, straight where that setup has the subject on
// camera and wavy where it does not. Picking a setup re-frames the scene: a wide shot
// shows everything, a close-up shows one thing, large. Cuts are hard cuts.
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './v14.css';

/* ------------------------------------------------------------------ content */

const SECTIONS = [
  {
    id: 'about',
    slug: 'DARA, at the window',
    note: 'CONT: same grey jacket as Sc. 11. Cuff still rolled.',
    body: [
      'Dara Whitlock builds the parts of software nobody photographs: queues, schedulers, the thing that retries. Eight years of it, most recently at a payments company in Glasgow; before that, the records system of a hospital that could not be allowed to go down.',
      'Watches around three hundred films a year and keeps a log. Not of scores. Of cuts.',
    ],
  },
  {
    id: 'work',
    slug: 'THE WORK, on the desk',
    note: 'PROPS: the notebook, open to p.63. Pen uncapped.',
    items: [
      {
        title: 'Reconciler',
        meta: 'Go · Postgres · 2024–25',
        text: 'Compares two ledgers overnight and explains, in plain sentences, every penny it cannot match. Replaced a spreadsheet and three people’s Mondays.',
      },
      {
        title: 'Theatre schedule',
        meta: 'Python · OR-Tools · 2021–23',
        text: 'Scheduling for fourteen operating theatres and surgeons who cannot be in two of them. A constraint solver that a charge nurse can overrule by hand, and does.',
      },
      {
        title: 'Shotlog',
        meta: 'Rust · 40 kB binary · ongoing',
        text: 'A keyboard-only tool for noting where a cut falls while a film is running, without looking away from it. Nine thousand entries so far.',
      },
    ],
  },
  {
    id: 'hands',
    slug: 'HANDS, insert',
    note: 'SOUND: fridge hum under. Wild track taken.',
    body: [
      'Go and Rust for the machines. Python when there is a deadline. SQL always. Reads query plans for pleasure and prefers any system she can draw on one page.',
      'Has never once liked a microservice diagram.',
    ],
  },
  {
    id: 'watching',
    slug: 'THE LOG, on the sofa arm',
    note: 'CONT: mug moved between takes. Handle now faces camera.',
    body: [
      'Seen this year: 214. Rewatched: 31. Walked out: 1, and not the film’s fault; that was the fire alarm.',
      'Keeps no ratings. Notes instead where a cut lands early, when a scene is held a beat past comfort, which films end on a sound rather than an image. Favourite object in cinema: the reaction shot they did not need.',
    ],
  },
  {
    id: 'contact',
    slug: 'THE CARD, by the phone',
    note: '',
    links: [
      { label: 'dara@whitlock.dev', href: 'mailto:dara@whitlock.dev' },
      { label: 'github.com/darawhitlock', href: 'https://github.com/' },
      { label: 'Glasgow · GMT', href: null },
    ],
    body: [
      'Replies to email within a day. Available from November for full-time backend work; available any evening for a double bill.',
    ],
  },
];

const ALL = SECTIONS.map((s) => s.id);

// A setup spans a range of the scene. Within its span it is "on" (straight line: the
// subject is in frame) or "off" (wavy line: camera rolling, subject off-screen).
const SETUPS = [
  { id: '1', size: 'WIDE', lens: '24mm', desc: 'the whole flat, from the door', span: ['about', 'contact'], on: ALL,
    takes: [{ n: 1, note: 'NG · boom in frame' }, { n: 2, note: 'circled' }] },
  { id: '2', size: 'MED', lens: '35mm', desc: 'two-shot, Dara and the desk', span: ['about', 'work'], on: ['about', 'work'],
    takes: [{ n: 1, note: 'circled' }] },
  { id: '2A', size: 'MED', lens: '35mm', desc: 'over the desk', span: ['work', 'watching'], on: ['work', 'hands'],
    takes: [{ n: 1, note: 'NG · plane' }, { n: 2, note: 'NG · plane' }, { n: 3, note: 'circled' }] },
  { id: '3', size: 'CU', lens: '50mm', desc: 'Dara', span: ['about', 'contact'], on: ['about', 'watching', 'contact'],
    takes: [
      { n: 1, note: 'NG · laughed at “unhurried”', alt: {
        about: [
          'Dara Whitlock builds — sorry. Dara Whitlock builds the boring parts. Queues. The thing that retries when the — can we go again? I said “unhurried” and then I laughed, because nobody has ever described a Monday at a payments company that way.',
          'Three hundred films a year. Roughly. I don’t count the ones I fall asleep in, which is a rule I made for myself and have not told anyone until now.',
        ],
      } },
      { n: 2, note: 'circled' },
    ] },
  { id: '3A', size: 'CU', lens: '85mm', desc: 'hands, insert', span: ['work', 'hands'], on: ['hands'],
    takes: [{ n: 1, note: 'circled' }] },
  { id: '4', size: 'CU', lens: '50mm', desc: 'the log', span: ['watching', 'watching'], on: ['watching'],
    takes: [{ n: 1, note: 'NG · focus' }, { n: 2, note: 'circled' }] },
  { id: '5', size: 'INSERT', lens: '85mm', desc: 'the card', span: ['contact', 'contact'], on: ['contact'],
    takes: [{ n: 1, note: 'circled' }] },
];

const SIZE_CLASS = { WIDE: 'wide', MED: 'med', CU: 'cu', INSERT: 'cu' };

/* ------------------------------------------------------------------ helpers */

const idx = (id) => ALL.indexOf(id);

// The tightest setup that has a given section on camera.
function bestSetupFor(id) {
  return SETUPS.filter((s) => s.on.includes(id)).sort((a, b) => a.on.length - b.on.length)[0] || SETUPS[0];
}

function wavy(x, y0, y1) {
  // Quadratic zig-zag between y0 and y1 at column x.
  const amp = 3.2;
  const step = 7;
  let d = `M${x} ${y0}`;
  let y = y0;
  let sign = 1;
  while (y + step < y1) {
    d += ` Q${x + sign * amp} ${y + step / 2} ${x} ${y + step}`;
    y += step;
    sign = -sign;
  }
  d += ` L${x} ${y1}`;
  return d;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );
  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fn = (e) => setReduced(e.matches);
    mq.addEventListener ? mq.addEventListener('change', fn) : mq.addListener(fn);
    return () => (mq.removeEventListener ? mq.removeEventListener('change', fn) : mq.removeListener(fn));
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ gutter */

function Gutter({ boxes, height, current, onPick, narrow }) {
  const spacing = narrow ? 9 : 21;
  const x0 = narrow ? 10 : 22;
  return (
    <svg
      className="v14-gutter"
      width="100%"
      height={height}
      viewBox={`0 0 ${narrow ? 64 : 172} ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {SETUPS.map((s, i) => {
        const x = x0 + i * spacing;
        const a = idx(s.span[0]);
        const b = idx(s.span[1]);
        const first = boxes[ALL[a]];
        const last = boxes[ALL[b]];
        if (!first || !last) return null;
        const stagger = (i % 4) * 14;
        const y0 = first.top + 14 + stagger;
        const y1 = last.bottom - 6;
        const parts = [];
        for (let k = a; k <= b; k += 1) {
          const box = boxes[ALL[k]];
          if (!box) continue;
          const top = Math.max(box.top, y0);
          const bottom = Math.min(box.bottom, y1);
          if (bottom <= top) continue;
          const isOn = s.on.includes(ALL[k]);
          parts.push(
            <path
              key={ALL[k]}
              d={isOn ? `M${x} ${top} L${x} ${bottom}` : wavy(x, top, bottom)}
              className={isOn ? 'v14-ln on' : 'v14-ln off'}
            />
          );
        }
        const active = s.id === current;
        return (
          <g
            key={s.id}
            className={active ? 'v14-setup active' : 'v14-setup'}
            onClick={() => onPick(s.id)}
            style={{ cursor: 'pointer' }}
          >
            {/* wide invisible hit area */}
            <path d={`M${x} ${y0 - 14} L${x} ${y1}`} className="v14-hit" />
            {parts}
            {/* the cap: a short cross-bar and the setup number */}
            <path d={`M${x - 4} ${y0} L${x + 4} ${y0}`} className="v14-cap" />
            <path d={`M${x - 4} ${y1} L${x + 4} ${y1}`} className="v14-cap" />
            <text x={x} y={y0 - 4} className="v14-num" textAnchor="middle">{s.id}</text>
            {!narrow && (
              <text
                className="v14-lbl"
                transform={`translate(${x + 4} ${y0 + 12}) rotate(90)`}
              >
                {`${s.size} · ${s.desc}`.length * 7.3 < y1 - y0 - 24 ? `${s.size} · ${s.desc}` : s.size}
              </text>
            )}
            {active && <circle cx={x} cy={y0 - 8} r={narrow ? 7 : 8.5} className="v14-ring" />}
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ page */

export default function V14() {
  const [current, setCurrent] = useState('1');
  const [take, setTake] = useState(null); // null → the circled take
  const [flash, setFlash] = useState(false);
  const [boxes, setBoxes] = useState({});
  const [height, setHeight] = useState(600);
  const [narrow, setNarrow] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 720 : false));
  const reduced = usePrefersReducedMotion();
  const sceneRef = useRef(null);
  const sectionRefs = useRef({});
  const flashTimer = useRef(null);

  const setup = useMemo(() => SETUPS.find((s) => s.id === current), [current]);
  const activeTake = useMemo(() => {
    if (!setup) return null;
    if (take == null) return setup.takes.find((t) => t.note === 'circled') || setup.takes[setup.takes.length - 1];
    return setup.takes.find((t) => t.n === take) || setup.takes[0];
  }, [setup, take]);

  const cutTo = useCallback((id) => {
    if (id === current) return;
    setTake(null);
    setCurrent(id);
    if (!reduced) {
      setFlash(true);
      clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setFlash(false), 70);
    }
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }, [current, reduced]);

  useEffect(() => () => clearTimeout(flashTimer.current), []);

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 720);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Measure section boxes so the gutter lines can span them. Re-measure on resize and
  // whenever the framing changes. A timeout fallback lands a measurement even if fonts
  // are slow or the observer never fires.
  const measure = useCallback(() => {
    const scene = sceneRef.current;
    if (!scene) return;
    const next = {};
    ALL.forEach((id) => {
      const el = sectionRefs.current[id];
      if (!el) return;
      next[id] = { top: el.offsetTop, bottom: el.offsetTop + el.offsetHeight };
    });
    setBoxes(next);
    setHeight(Math.max(scene.offsetHeight, 200));
  }, []);

  useLayoutEffect(() => {
    measure();
    const t1 = setTimeout(measure, 120);
    const t2 = setTimeout(measure, 900);
    let ro;
    if (typeof ResizeObserver !== 'undefined' && sceneRef.current) {
      ro = new ResizeObserver(() => measure());
      ro.observe(sceneRef.current);
    }
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      if (ro) ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, current, take, narrow]);

  // keyboard: digits jump to setups, arrows step
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && /^(input|textarea|select)$/i.test(e.target.tagName)) return;
      const i = SETUPS.findIndex((s) => s.id === current);
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        cutTo(SETUPS[Math.min(SETUPS.length - 1, i + 1)].id);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        cutTo(SETUPS[Math.max(0, i - 1)].id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current, cutTo]);

  const totalTakes = SETUPS.reduce((n, s) => n + s.takes.length, 0);

  return (
    <div className={`v14 size-${SIZE_CLASS[setup.size]}`}>
      <a className="v14-skip" href="#v14-scene">Skip to the scene</a>

      <header className="v14-head">
        <div className="v14-head-row">
          <span className="v14-kicker">Lined script</span>
          <span className="v14-meta">Sc. 12 &nbsp;·&nbsp; pg 1 of 1 &nbsp;·&nbsp; Day 4 / 9</span>
        </div>
        <h1 className="v14-slug">INT. DARA’S FLAT — NIGHT</h1>
        <p className="v14-how">
          One scene, seven camera setups. Each vertical line in the margin is a setup:
          straight where Dara is on camera, wavy where she is not. Pick a setup to see the
          scene the way that camera saw it.
        </p>

        <div className="v14-setups" role="tablist" aria-label="Camera setups">
          {SETUPS.map((s) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={s.id === current}
              className={`v14-tab${s.id === current ? ' is-on' : ''}`}
              onClick={() => cutTo(s.id)}
            >
              <b>{s.id}</b>
              <span>{s.size}</span>
              <small>{s.desc}</small>
            </button>
          ))}
        </div>

        <div className="v14-slate" aria-live="polite">
          <span className="v14-slate-now">
            Setup <b>{setup.id}</b> · {setup.size} · {setup.lens} · {setup.desc}
          </span>
          <span className="v14-takes">
            {setup.takes.map((t) => {
              const on = activeTake && activeTake.n === t.n;
              const circled = t.note === 'circled';
              return (
                <button
                  key={t.n}
                  type="button"
                  className={`v14-take${on ? ' is-on' : ''}${circled ? ' is-circled' : ''}`}
                  onClick={() => setTake(t.n)}
                  title={t.note}
                  aria-pressed={on}
                >
                  <i>{t.n}</i>
                  <span>{circled ? 'circled' : t.note.replace(/^NG\s*·\s*/, 'NG, ')}</span>
                </button>
              );
            })}
          </span>
        </div>
      </header>

      <main className="v14-page" id="v14-scene">
        <div className="v14-gutter-wrap" style={{ height }}>
          <Gutter boxes={boxes} height={height} current={current} onPick={cutTo} narrow={narrow} />
        </div>

        <div className="v14-scene" ref={sceneRef}>
          {SECTIONS.map((sec) => {
            const on = setup.on.includes(sec.id);
            const body = (activeTake && activeTake.alt && activeTake.alt[sec.id]) || sec.body;
            return (
              <section
                key={sec.id}
                id={`v14-${sec.id}`}
                ref={(el) => { sectionRefs.current[sec.id] = el; }}
                className={on ? 'v14-sec on' : 'v14-sec off'}
                aria-label={sec.slug}
              >
                {on ? (
                  <>
                    <h2 className="v14-h2">{sec.slug}</h2>
                    {sec.note && !narrow && <aside className="v14-note">{sec.note}</aside>}
                    {body && body.map((p, i) => <p key={i} className="v14-p">{p}</p>)}
                    {sec.items && (
                      <ul className="v14-items">
                        {sec.items.map((it) => (
                          <li key={it.title}>
                            <h3>{it.title}</h3>
                            <span className="v14-item-meta">{it.meta}</span>
                            <p className="v14-p">{it.text}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                    {sec.links && (
                      <ul className="v14-links">
                        {sec.links.map((l) => (
                          <li key={l.label}>
                            {l.href ? <a href={l.href}>{l.label}</a> : <span>{l.label}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                    {sec.note && narrow && <aside className="v14-note">{sec.note}</aside>}
                  </>
                ) : (
                  <button
                    type="button"
                    className="v14-off-row"
                    onClick={() => cutTo(bestSetupFor(sec.id).id)}
                    title="Cut to a setup that covers this"
                  >
                    <span className="v14-off-dash" />
                    <span>off camera — {sec.slug}</span>
                    <span className="v14-off-dash" />
                  </button>
                )}
              </section>
            );
          })}

          <footer className="v14-foot">
            <span>END OF SCENE</span>
            <span>{SETUPS.length} setups · {totalTakes} takes · {SETUPS.length} circled</span>
            <span>Pages shot today: 1 3⁄8 · Wrap 21:40</span>
            <span className="v14-foot-keys">← → step through setups</span>
          </footer>
        </div>
      </main>

      {flash && <div className="v14-flash" aria-hidden="true" />}
    </div>
  );
}
