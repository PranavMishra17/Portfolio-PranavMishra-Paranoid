// Variant 5 — "A day outside, then home."
//
// A computed sky runs the length of the page, driven by scroll alone. Words sit straight on it, as in
// Weather: no plates, thin rules, generous space. A slim text rail on the left. It ends at home: a
// pixel-art room whose window is transparent to that same sky, and where nearly everything reacts.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Atmosphere from './Atmosphere';
import Overlay from './Overlay';
import Panel from './Panel';
import Room from './Room';
import { ALFRED, BEFORE, FEATURED, INTRO, LINKS, PAPERS, ALL_PROJECTS } from './copy';
import './v5.css';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..800,0..100,0..1;1,9..144,300..800,0..100,0..1&family=Commissioner:wght@300..800&display=swap';

const TABS = [
  { id: 'hey', label: 'Hey' },
  { id: 'work', label: 'What I do' },
  { id: 'made', label: 'Things I made' },
  { id: 'room', label: 'My room' },
];

function useScroll() {
  const [t, setT] = useState(0);
  const [active, setActive] = useState('hey');
  const tick = useRef(false);
  useEffect(() => {
    const paint = () => {
      tick.current = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY || 0;
      setT(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
      const probe = y + window.innerHeight * 0.42;
      let cur = TABS[0].id;
      for (const s of TABS) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= probe) cur = s.id;
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

function Rail({ active }) {
  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  return (
    <aside className={`v5-rail${active === 'room' ? ' off' : ''}`}>
      <a href="#hey" className="v5-rail-name" onClick={go('hey')}>
        Pranav Mishra
      </a>
      <nav aria-label="Sections">
        <ul className="v5-tabs">
          {TABS.map((s) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className={active === s.id ? 'on' : ''} onClick={go(s.id)} aria-current={active === s.id ? 'true' : undefined}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <ul className="v5-rail-links">
        {LINKS.map((l) => (
          <li key={l.label}>
            <a href={l.href} target={l.href.startsWith('/') || l.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// each print gets its own small tilt and drop, like photographs laid on a table
const TILT = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.9];
const DROP = [0, 34, 12, 26, 0, 40];

export default function V5() {
  const { t, active } = useScroll();
  const rootRef = useRef(null);
  const [overlay, setOverlay] = useState(false);
  const [role, setRole] = useState(null);
  const [more, setMore] = useState(false);
  const openOverlay = useCallback(() => setOverlay(true), []);
  const closeOverlay = useCallback(() => setOverlay(false), []);
  const closeRole = useCallback(() => setRole(null), []);

  const onLight = useCallback((l) => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty('--accent', l.accent);
    el.style.setProperty('--accent-ink', l.accentInk);
    el.style.setProperty('--sun', l.sun);
  }, []);

  useEffect(() => {
    document.body.classList.add('v5-body');
    document.title = 'Pranav Mishra';
    let link = document.getElementById('v5-fonts');
    if (!link) {
      link = document.createElement('link');
      link.id = 'v5-fonts';
      link.rel = 'stylesheet';
      link.href = FONTS;
      document.head.appendChild(link);
    }
    return () => document.body.classList.remove('v5-body');
  }, []);

  return (
    <div className="v5" ref={rootRef}>
      <Atmosphere t={t} onLight={onLight} />
      <Rail active={active} />

      <main className="v5-main">
        <section className="v5-screen" id="hey">
          <div className="v5-hey">
            <div className="v5-face">
              <img src={INTRO.photo} alt={INTRO.photoAlt} />
            </div>
            <div>
              <h1 className="v5-hello">{INTRO.hello}</h1>
              {INTRO.paragraphs.map((p) => (
                <p className="v5-p" key={p}>
                  {p}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="v5-screen" id="work">
          <div className="v5-col">
            <h2 className="v5-h2">
              What I do at{' '}
              <a className="v5-link" href={ALFRED.url} target="_blank" rel="noopener noreferrer">
                Alfred_
              </a>
            </h2>
            <p className="v5-p">{ALFRED.lead}</p>
            <ul className="v5-figures">
              {ALFRED.figures.map((f) => (
                <li key={f.what}>
                  <span className="v5-fig">
                    {f.to ? (
                      <>
                        <s>{f.big}</s> {f.to}
                      </>
                    ) : (
                      f.big
                    )}
                  </span>
                  <span className="v5-fig-what">{f.what}</span>
                </li>
              ))}
            </ul>
            <button type="button" className="v5-more" aria-expanded={more} onClick={() => setMore((v) => !v)}>
              {more ? 'Less' : 'More about that'}
            </button>
            {more ? (
              <ul className="v5-bullets">
                {ALFRED.more.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            ) : null}
            <h3 className="v5-h3">Before Alfred_</h3>
            <ul className="v5-before">
              {BEFORE.map((r) => (
                <li key={r.id}>
                  <button type="button" className="v5-before-btn" onClick={() => setRole(r)}>
                    <span className="v5-before-co">{r.company}</span>
                    <span className="v5-before-line">{r.line}</span>
                    <span className="v5-before-when">
                      {r.title}. {r.when}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="v5-screen" id="made">
          <div className="v5-col wide">
            <h2 className="v5-h2">Things I made</h2>
            <ul className="v5-prints">
              {FEATURED.map((p, i) => (
                <li className="v5-print-item" key={p.id} style={{ '--tilt': `${TILT[i % TILT.length]}deg`, '--drop': `${DROP[i % DROP.length]}px` }}>
                  <a className="v5-print-link" href={p.link} target="_blank" rel="noopener noreferrer">
                    <span className={`v5-print${p.square ? ' sq' : ''}`}>
                      <img src={p.image} alt="" loading="lazy" />
                    </span>
                    <span className="v5-print-t">{p.name}</span>
                    <span className="v5-print-line">{p.line}</span>
                    <span className="v5-print-go">{p.action}</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="v5-links v5-seeall">
              <button type="button" className="v5-link" onClick={openOverlay}>
                See everything, {ALL_PROJECTS.length} things and {PAPERS.length} papers
              </button>
            </p>

            <h3 className="v5-h3">Three papers</h3>
            <ul className="v5-offprints">
              {PAPERS.map((p, i) => (
                <li className="v5-offprint" key={p.id} style={{ '--tilt': `${[-0.8, 0.6, -0.4][i]}deg` }}>
                  <span className={`v5-stamp${p.accepted ? ' acc' : ''}`}>{p.status}</span>
                  <h4 className="v5-offprint-t">{p.short}</h4>
                  <p className="v5-offprint-line">{p.line}</p>
                  <p className="v5-offprint-venue">
                    {p.venue}
                    {p.citations ? `. ${p.citations} citations` : ''}
                  </p>
                  <p className="v5-links">
                    {p.pdf ? (
                      <a className="v5-link" href={p.pdf} target="_blank" rel="noopener noreferrer">
                        Paper
                      </a>
                    ) : null}
                    {p.code ? (
                      <a className="v5-link" href={p.code} target="_blank" rel="noopener noreferrer">
                        Code
                      </a>
                    ) : null}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Room t={t} onSeeAll={openOverlay} />
      <p className="v5-end">
        Pranav Pushkar Mishra.{' '}
        <a className="v5-link" href={LINKS[5].href}>
          Email
        </a>{' '}
        <a className="v5-link" href="/resume">
          Resume
        </a>
      </p>

      <Overlay open={overlay} onClose={closeOverlay} />
      <Panel open={Boolean(role)} title={role ? role.company : ''} onClose={closeRole}>
        {role ? (
          <>
            <p className="v5-plist-sub">
              {role.title}. {role.when}.
            </p>
            <p className="v5-p">{role.line}</p>
            <ul className="v5-bullets">
              {role.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            {role.website ? (
              <p className="v5-links">
                <a className="v5-link" href={role.website} target="_blank" rel="noopener noreferrer">
                  Website
                </a>
              </p>
            ) : null}
          </>
        ) : null}
      </Panel>
    </div>
  );
}
