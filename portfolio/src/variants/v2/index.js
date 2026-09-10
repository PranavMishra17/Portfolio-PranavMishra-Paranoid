// Variant 2 — "The horizon."
//
// One idea: a fixed horizon line divides every screen. Sky above, solid ground below. Words only ever
// sit on the ground. The sky is for the sun, and for a screenshot when you hover a project. The day
// passes as you scroll; the ground warms with it. The rail stands on the ground at the left, name
// first, then the four parts of the day. The room is the footer, typeset in HTML so every spine and
// poster carries a real label.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Overlay from './Overlay';
import Panel from './Panel';
import Room from './Room';
import { ABOUT, FEATURED, MEASUREMENTS, PAPERS, TIMELINE, ALL_PROJECTS } from './copy';
import './v2.css';

const FONTS = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,300..800&display=swap';

const PARTS = [
  { id: 'morning', label: 'Morning' },
  { id: 'noon', label: 'Noon' },
  { id: 'afternoon', label: 'Afternoon' },
  { id: 'dusk', label: 'Dusk' },
];

const SKY = [
  { top: [170, 200, 228], bot: [232, 240, 244] }, // morning
  { top: [188, 212, 232], bot: [240, 238, 228] }, // noon
  { top: [206, 204, 200], bot: [244, 220, 186] }, // afternoon
  { top: [188, 150, 148], bot: [240, 184, 134] }, // dusk
];
const GROUND = [
  [240, 235, 222],
  [236, 228, 210],
  [228, 210, 182],
  [206, 176, 140],
];

function lerp(a, b, t) {
  return a + (b - a) * t;
}
function rgb(stops, t, key) {
  const n = stops.length - 1;
  const s = Math.min(Math.max(t, 0), 0.9999) * n;
  const i = Math.floor(s);
  const f = s - i;
  const a = key ? stops[i][key] : stops[i];
  const b = key ? stops[Math.min(i + 1, n)][key] : stops[Math.min(i + 1, n)];
  return `rgb(${Math.round(lerp(a[0], b[0], f))}, ${Math.round(lerp(a[1], b[1], f))}, ${Math.round(lerp(a[2], b[2], f))})`;
}

function useDay() {
  const [t, setT] = useState(0);
  const [active, setActive] = useState('morning');
  const tick = useRef(false);
  useEffect(() => {
    const paint = () => {
      tick.current = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY || 0;
      setT(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
      const probe = y + window.innerHeight * 0.45;
      let cur = PARTS[0].id;
      for (const p of PARTS) {
        const el = document.getElementById(p.id);
        if (el && el.offsetTop <= probe) cur = p.id;
      }
      setActive(cur);
    };
    const onScroll = () => {
      if (tick.current) return;
      tick.current = true;
      window.requestAnimationFrame(paint);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    paint();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return { t, active };
}

function Horizon({ t, active, image, square }) {
  const sunX = 10 + t * 80;
  const sunY = 96 - Math.sin(t * Math.PI) * 80;
  return (
    <>
      <div className="v2-sky" aria-hidden="true" style={{ backgroundImage: `linear-gradient(180deg, ${rgb(SKY, t, 'top')} 0%, ${rgb(SKY, t, 'bot')} 100%)` }}>
        <span className="v2-sun" style={{ left: `${sunX}%`, top: `${sunY}%` }} />
        <AnimatePresence>
          {active === 'afternoon' && image ? (
            <motion.div
              key={image}
              className={`v2-billboard${square ? ' sq' : ''}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <img src={image} alt="" />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="v2-ground" aria-hidden="true" style={{ background: rgb(GROUND, t) }} />
    </>
  );
}

function Rail({ active }) {
  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  return (
    <aside className="v2-rail">
      <a href="#morning" className="v2-name" onClick={go('morning')}>
        {ABOUT.short}
      </a>
      <nav aria-label="Parts of the day">
        <ul className="v2-parts">
          {PARTS.map((p) => (
            <li key={p.id} className={active === p.id ? 'on' : ''}>
              <a href={`#${p.id}`} onClick={go(p.id)} aria-current={active === p.id ? 'true' : undefined}>
                {p.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <ul className="v2-rail-links">
        {ABOUT.links.slice(0, 3).map((l) => (
          <li key={l.label}>
            <a href={l.href} target="_blank" rel="noopener noreferrer">
              {l.label}
            </a>
          </li>
        ))}
        <li>
          <a href="/resume">Resume</a>
        </li>
      </ul>
    </aside>
  );
}

export default function V2() {
  const { t, active } = useDay();
  const [hoverIdx, setHoverIdx] = useState(0);
  const [overlay, setOverlay] = useState(false);
  const [role, setRole] = useState(null);
  const openOverlay = useCallback(() => setOverlay(true), []);
  const closeOverlay = useCallback(() => setOverlay(false), []);
  const closeRole = useCallback(() => setRole(null), []);

  useEffect(() => {
    document.body.classList.add('v2-body');
    document.title = 'Pranav Mishra';
    let link = document.getElementById('v2-fonts');
    if (!link) {
      link = document.createElement('link');
      link.id = 'v2-fonts';
      link.rel = 'stylesheet';
      link.href = FONTS;
      document.head.appendChild(link);
    }
    return () => document.body.classList.remove('v2-body');
  }, []);

  const current = FEATURED[hoverIdx] || FEATURED[0];

  return (
    <div className="v2">
      <Horizon t={t} active={active} image={current && current.image} square={current && current.square} />
      <Rail active={active} />

      <main className="v2-main">
        <section className="v2-screen" id="morning">
          <div className="v2-content">
            <h1 className="v2-title">{ABOUT.name}</h1>
            <p className="v2-lead">{ABOUT.opening}</p>
            <p className="v2-p v2-soft v2-narrow">{ABOUT.line}</p>
          </div>
        </section>

        <section className="v2-screen" id="noon">
          <div className="v2-content">
            <h2 className="v2-h2">
              What changed at{' '}
              <a className="v2-link" href="https://get-alfred.ai/" target="_blank" rel="noopener noreferrer">
                Alfred_
              </a>
            </h2>
            <ol className="v2-band">
              {MEASUREMENTS.map((m) => (
                <li key={m.what}>
                  <span className="v2-fig">
                    {m.value ? m.value : null}
                    {m.suffix ? <small> {m.suffix}</small> : null}
                    {m.before ? (
                      <>
                        <s>{m.before}</s> {m.after}
                      </>
                    ) : null}
                  </span>
                  <span className="v2-figwhat">{m.what}</span>
                </li>
              ))}
            </ol>
            <p className="v2-p v2-soft v2-narrow">And the working memory rebuilt so it cannot invent a fact about your inbox. Enforced by tests.</p>

            <ol className="v2-timeline" aria-label="Where I have worked, oldest first">
              {TIMELINE.map((r) => (
                <li key={r.id} className={r.current ? 'now' : ''}>
                  <button type="button" className="v2-stop" onClick={() => setRole(r)}>
                    <span className="v2-stop-year">{r.year}</span>
                    <span className="v2-stop-dot" aria-hidden="true" />
                    <span className="v2-stop-co">{r.company}</span>
                    <span className="v2-stop-title">{r.title}</span>
                    <span className="v2-stop-where">{r.where}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="v2-screen" id="afternoon">
          <div className="v2-content">
            <h2 className="v2-h2">Six things I built</h2>
            <ul className="v2-tiles-row" onMouseLeave={() => setHoverIdx(0)}>
              {FEATURED.map((p, i) => (
                <li key={p.id} className={i === hoverIdx ? 'on' : ''} onMouseEnter={() => setHoverIdx(i)} onFocus={() => setHoverIdx(i)}>
                  <a className="v2-tile" href={p.link} target="_blank" rel="noopener noreferrer">
                    <span className="v2-tile-t">{p.name}</span>
                    <span className="v2-tile-line">{p.line}</span>
                    <span className="v2-tile-go">{p.action}</span>
                  </a>
                  <span className={`v2-tile-thumb${p.square ? ' sq' : ''}`} aria-hidden="true">
                    <img src={p.image} alt="" loading="lazy" />
                  </span>
                </li>
              ))}
            </ul>
            <p className="v2-links v2-seeall-row">
              <button type="button" className="v2-link" onClick={openOverlay}>
                See everything, {ALL_PROJECTS.length} things and {PAPERS.length} papers
              </button>
            </p>
            <ul className="v2-papers" aria-label="Three papers">
              {PAPERS.map((p) => (
                <li key={p.id}>
                  <span className={`v2-status${p.accepted ? ' acc' : ''}`}>{p.status}</span>
                  <span className="v2-paper-t">
                    {p.pdf ? (
                      <a className="v2-link" href={p.pdf} target="_blank" rel="noopener noreferrer">
                        {p.short}
                      </a>
                    ) : (
                      p.short
                    )}
                  </span>
                  <span className="v2-paper-venue">
                    {p.venue}
                    {p.citations ? `, ${p.citations} citations` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Room onSeeAll={openOverlay} />
      <Overlay open={overlay} onClose={closeOverlay} />
      <Panel open={Boolean(role)} title={role ? role.company : ''} onClose={closeRole}>
        {role ? (
          <>
            <p className="v2-plist-sub">
              {role.title}, {role.where}. {role.when}.
            </p>
            <p className="v2-p">{role.line}</p>
            <ul className="v2-bullets">
              {role.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            {role.website ? (
              <p className="v2-links">
                <a className="v2-link" href={role.website} target="_blank" rel="noopener noreferrer">
                  {role.company === 'Alfred_' ? 'get-alfred.ai' : 'Website'}
                </a>
              </p>
            ) : null}
          </>
        ) : null}
      </Panel>
    </div>
  );
}
