// Variant 6 — the same sky and the same room, set the way Weather was set: one centred column of
// serif, a single line of navigation at the top, nothing else on the page but the words and the
// light. Projects are a list of names that reveal each image as you move over them.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Atmosphere from './Atmosphere';
import Overlay from './Overlay';
import Panel from './Panel';
import Room from './Room';
import { ALFRED, BEFORE, FEATURED, INTRO, LINKS, PAPERS, ALL_PROJECTS } from './copy';
import './v6.css';

const FONTS = 'https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&display=swap';

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

function Nav({ active }) {
  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  return (
    <nav className={`v6-nav${active === 'room' ? ' off' : ''}`} aria-label="Sections">
      <a href="#hey" className="v6-nav-name" onClick={go('hey')}>
        Pranav Mishra
      </a>
      {TABS.map((s) => (
        <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'on' : ''} onClick={go(s.id)} aria-current={active === s.id ? 'true' : undefined}>
          {s.label}
        </a>
      ))}
    </nav>
  );
}

export default function V6() {
  const { t, active } = useScroll();
  const rootRef = useRef(null);
  const [overlay, setOverlay] = useState(false);
  const [role, setRole] = useState(null);
  const [more, setMore] = useState(false);
  const [pick, setPick] = useState(0);
  const openOverlay = useCallback(() => setOverlay(true), []);
  const closeOverlay = useCallback(() => setOverlay(false), []);
  const closeRole = useCallback(() => setRole(null), []);

  const onLight = useCallback((l) => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty('--accent', l.accent);
    el.style.setProperty('--accent-ink', l.accentInk);
  }, []);

  useEffect(() => {
    document.body.classList.add('v6-body');
    document.title = 'Pranav Mishra';
    let link = document.getElementById('v6-fonts');
    if (!link) {
      link = document.createElement('link');
      link.id = 'v6-fonts';
      link.rel = 'stylesheet';
      link.href = FONTS;
      document.head.appendChild(link);
    }
    return () => document.body.classList.remove('v6-body');
  }, []);

  const current = FEATURED[pick] || FEATURED[0];

  return (
    <div className="v6" ref={rootRef}>
      <Atmosphere t={t} onLight={onLight} />
      <Nav active={active} />

      <main className="v6-main">
        <section className="v6-screen" id="hey">
          <div className="v6-face">
            <img src={INTRO.photo} alt={INTRO.photoAlt} />
          </div>
          <h1 className="v6-hello">{INTRO.hello}</h1>
          {INTRO.paragraphs.map((p) => (
            <p className="v6-p" key={p}>
              {p}
            </p>
          ))}
          <p className="v6-inline-links">
            {LINKS.map((l) => (
              <a key={l.label} href={l.href} target={l.href.startsWith('/') || l.href.startsWith('mailto') ? undefined : '_blank'} rel="noopener noreferrer">
                {l.label}
              </a>
            ))}
          </p>
        </section>

        <section className="v6-screen" id="work">
          <h2 className="v6-h2">
            What I do at{' '}
            <a className="v6-link" href={ALFRED.url} target="_blank" rel="noopener noreferrer">
              Alfred_
            </a>
          </h2>
          <p className="v6-p">{ALFRED.lead}</p>
          <dl className="v6-figures">
            {ALFRED.figures.map((f) => (
              <div key={f.what}>
                <dt className="v6-fig">
                  {f.to ? (
                    <>
                      <s>{f.big}</s> {f.to}
                    </>
                  ) : (
                    f.big
                  )}
                </dt>
                <dd className="v6-fig-what">{f.what}</dd>
              </div>
            ))}
          </dl>
          <button type="button" className="v6-more" aria-expanded={more} onClick={() => setMore((v) => !v)}>
            {more ? 'Less' : 'More about that'}
          </button>
          {more ? (
            <ul className="v6-bullets">
              {ALFRED.more.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          ) : null}
          <h3 className="v6-h3">Before Alfred_</h3>
          <ul className="v6-before">
            {BEFORE.map((r) => (
              <li key={r.id}>
                <button type="button" className="v6-before-btn" onClick={() => setRole(r)}>
                  <span className="v6-before-co">{r.company}</span>
                  <span className="v6-before-when">{r.when}</span>
                  <span className="v6-before-line">{r.line}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="v6-screen v6-made" id="made">
          <h2 className="v6-h2">Things I made</h2>
          <div className="v6-reveal">
            <ul className="v6-names" onMouseLeave={() => setPick(0)}>
              {FEATURED.map((p, i) => (
                <li key={p.id} className={i === pick ? 'on' : ''} onMouseEnter={() => setPick(i)}>
                  <a className="v6-name" href={p.link} target="_blank" rel="noopener noreferrer" onFocus={() => setPick(i)}>
                    <span className="v6-name-t">{p.name}</span>
                    <span className="v6-name-line">{p.line}</span>
                    <span className="v6-name-go">{p.action}</span>
                  </a>
                  <span className={`v6-thumb${p.square ? ' sq' : ''}`} aria-hidden="true">
                    <img src={p.image} alt="" loading="lazy" />
                  </span>
                </li>
              ))}
            </ul>
            <figure className="v6-viewer" aria-hidden="true">
              <span className={`v6-viewer-img${current.square ? ' sq' : ''}`}>
                <img src={current.image} alt="" />
              </span>
              <figcaption>{current.name}</figcaption>
            </figure>
          </div>
          <p className="v6-links v6-seeall">
            <button type="button" className="v6-link" onClick={openOverlay}>
              See everything, {ALL_PROJECTS.length} things and {PAPERS.length} papers
            </button>
          </p>

          <h3 className="v6-h3">Three papers</h3>
          <ul className="v6-papers">
            {PAPERS.map((p) => (
              <li key={p.id}>
                <span className={`v6-status${p.accepted ? ' acc' : ''}`}>{p.status}</span>
                <span className="v6-paper-t">
                  {p.pdf ? (
                    <a className="v6-link" href={p.pdf} target="_blank" rel="noopener noreferrer">
                      {p.short}
                    </a>
                  ) : (
                    p.short
                  )}
                </span>
                <span className="v6-paper-line">{p.line}</span>
                <span className="v6-paper-venue">
                  {p.venue}
                  {p.citations ? `. ${p.citations} citations` : ''}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <Room t={t} onSeeAll={openOverlay} />
      <p className="v6-end">
        Pranav Pushkar Mishra.{' '}
        <a className="v6-link" href={LINKS[5].href}>
          Email
        </a>{' '}
        <a className="v6-link" href="/resume">
          Resume
        </a>
      </p>

      <Overlay open={overlay} onClose={closeOverlay} />
      <Panel open={Boolean(role)} title={role ? role.company : ''} onClose={closeRole}>
        {role ? (
          <>
            <p className="v6-plist-sub">
              {role.title}. {role.when}.
            </p>
            <p className="v6-p">{role.line}</p>
            <ul className="v6-bullets">
              {role.details.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
            {role.website ? (
              <p className="v6-links">
                <a className="v6-link" href={role.website} target="_blank" rel="noopener noreferrer">
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
