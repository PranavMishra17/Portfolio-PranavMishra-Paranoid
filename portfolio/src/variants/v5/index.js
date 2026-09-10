// Variant 5 — "A day outside, then home."
//
// The page is a day spent outdoors: a computed sky with a real sun and low ridges, running the full
// length of the page and driven by scroll alone. It ends at home: a pixel-art room, drawn by hand,
// whose window is transparent to that same sky. The left rail is a solid column that takes its
// colour from the sky, with my face and name pinned at the top and four big tabs. Text always sits
// on paper. Headings take their colour from the sun.
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

function dayWord(light) {
  if (!light) return 'morning';
  const e = light.elDeg;
  if (light.t < 0.5) return e < 12 ? 'early morning' : e < 34 ? 'morning' : 'almost noon';
  return e < 4 ? 'sunset' : e < 16 ? 'evening' : 'afternoon';
}

function Rail({ active, light }) {
  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  return (
    <aside className="v5-rail">
      <a href="#hey" className="v5-rail-me" onClick={go('hey')}>
        <img className="v5-rail-photo" src={INTRO.photo} alt="" />
        <span className="v5-rail-name">Pranav Mishra</span>
        <span className="v5-rail-role">AI engineer, New York</span>
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
      <div className="v5-day" aria-hidden="true">
        <span className="v5-day-word">It is {dayWord(light)}.</span>
        <span className="v5-day-bar">
          <i style={{ left: `${((light && light.sunX) || 0.16) * 100}%`, bottom: `${Math.max(0, Math.min(100, ((light ? light.elDeg : 7) / 50) * 100))}%` }} />
        </span>
      </div>
    </aside>
  );
}

export default function V5() {
  const { t, active } = useScroll();
  const rootRef = useRef(null);
  const [light, setLight] = useState(null);
  const [overlay, setOverlay] = useState(false);
  const [role, setRole] = useState(null);
  const [more, setMore] = useState(false);
  const openOverlay = useCallback(() => setOverlay(true), []);
  const closeOverlay = useCallback(() => setOverlay(false), []);
  const closeRole = useCallback(() => setRole(null), []);

  const onLight = useCallback((l) => {
    setLight(l);
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty('--rail-bg', l.railBg);
    el.style.setProperty('--accent', l.accent);
    el.style.setProperty('--accent-ink', l.accentInk);
    el.style.setProperty('--sun', l.sun);
    el.style.setProperty('--zenith', l.zenith);
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
      <Rail active={active} light={light} />

      <main className="v5-main">
        <section className="v5-screen" id="hey">
          <div className="v5-slab v5-hey">
            <div className="v5-face">
              <img src={INTRO.photo} alt={INTRO.photoAlt} />
            </div>
            <div className="v5-hey-text">
              <h1 className="v5-hello">{INTRO.hello}</h1>
              {INTRO.paragraphs.map((p) => (
                <p className="v5-p" key={p}>
                  {p}
                </p>
              ))}
              <p className="v5-p v5-soft v5-hint">{INTRO.scrollHint}</p>
            </div>
          </div>
        </section>

        <section className="v5-screen" id="work">
          <div className="v5-slab">
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
              {more ? 'Less about that' : 'More about that'}
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
          <div className="v5-slab wide">
            <h2 className="v5-h2">Things I made</h2>
            <ul className="v5-cards">
              {FEATURED.map((p) => (
                <li className="v5-card" key={p.id}>
                  <a className="v5-card-link" href={p.link} target="_blank" rel="noopener noreferrer">
                    <div className={`v5-card-img${p.square ? ' sq' : ''}`}>
                      <img src={p.image} alt="" loading="lazy" />
                    </div>
                    <h3 className="v5-card-t">{p.name}</h3>
                    <p className="v5-card-line">{p.line}</p>
                    <span className="v5-card-go">{p.action}</span>
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
            <ul className="v5-papers">
              {PAPERS.map((p) => (
                <li key={p.id}>
                  <span className={`v5-status${p.accepted ? ' acc' : ''}`}>{p.status}</span>
                  <span className="v5-paper-t">
                    {p.pdf ? (
                      <a className="v5-link" href={p.pdf} target="_blank" rel="noopener noreferrer">
                        {p.short}
                      </a>
                    ) : (
                      p.short
                    )}
                  </span>
                  <span className="v5-paper-venue">
                    {p.venue}
                    {p.citations ? `, ${p.citations} citations` : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <Room t={t} onSeeAll={openOverlay} />
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

