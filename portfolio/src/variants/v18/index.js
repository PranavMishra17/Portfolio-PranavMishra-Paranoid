// v18 — the whole page.
//
// One wall, once. Behind it the real site, which is ordinary scrolling with one manner: commit
// a fifth of the way into the next slab and it takes the screen. The sky drifts as you go, in
// the register of design-lab/12-weather.html — slight gradients of colour, nothing more.
//
// The header is the home. Press it and the wall comes back.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Detonator from './wall';
import Landing from './sections/Landing';
import Work from './sections/Work';
import Projects from './sections/Projects';
import Papers from './sections/Papers';
import Room from './room/Room';
import Lab, { LabProvider, useLab } from './lab';
import { useSky, useSnap } from './hooks';
import { ME, LINKS, CONTACT } from './copy';
import './v18.css';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&family=Public+Sans:ital,wght@0,300..700;1,400&display=swap';

const NAV = [
  { id: 'work', label: 'Now' },
  { id: 'projects', label: 'Made' },
  { id: 'papers', label: 'Written' },
  { id: 'room', label: 'Room' },
];

function Page() {
  const { lab } = useLab();
  const skyRef = useRef(null);
  const landRef = useRef(null);
  const detRef = useRef(null);
  const sections = useRef([]);
  const [blown, setBlown] = useState(false);

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(pointer: coarse)').matches;

  useSky(skyRef, true);
  useSnap(lab.snap && blown, useCallback(() => sections.current, []));

  /* body, fonts, and the scroll lock that only exists while the wall is up */
  useEffect(() => {
    document.body.classList.add('v18-body');
    document.title = `${ME.first} ${ME.last} — ${ME.role}`;
    let link = document.getElementById('v18-fonts');
    if (!link) {
      link = document.createElement('link');
      link.id = 'v18-fonts';
      link.rel = 'stylesheet';
      link.href = FONTS;
      document.head.appendChild(link);
    }
    return () => {
      document.body.classList.remove('v18-body', 'v18-locked');
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('v18-locked', !blown);
    if (!blown) window.scrollTo(0, 0);
  }, [blown]);

  /* The landing is on the wall, so the blast has to take it with the wall. Each element is
     given a direction away from the blast and a delay by distance, then CSS does the rest. */
  const blowAway = useCallback((at) => {
    const root = landRef.current;
    if (!root) return;
    const bits = root.querySelectorAll('[data-blow]');
    const bx = at ? at.x : window.innerWidth / 2;
    const by = at ? at.y : window.innerHeight / 2;
    const far = Math.hypot(window.innerWidth, window.innerHeight);
    bits.forEach((el) => {
      const r = el.getBoundingClientRect();
      const dx = r.left + r.width / 2 - bx;
      const dy = r.top + r.height / 2 - by;
      const d = Math.hypot(dx, dy) || 1;
      const push = 90 + (1 - d / far) * 240;
      el.style.setProperty('--bx', `${((dx / d) * push).toFixed(1)}px`);
      el.style.setProperty('--by', `${((dy / d) * push - 40).toFixed(1)}px`);
      el.style.setProperty('--br', `${((dx / d) * 7).toFixed(2)}deg`);
      el.style.setProperty('--bd', `${Math.round(Math.min(260, d * 0.24))}ms`);
    });
  }, []);

  const onBlast = useCallback(
    (at) => {
      blowAway(at);
      setBlown(true);
    },
    [blowAway]
  );

  const home = useCallback(() => {
    const root = landRef.current;
    if (root) {
      root.querySelectorAll('[data-blow]').forEach((el) => {
        el.style.removeProperty('--bx');
        el.style.removeProperty('--by');
        el.style.removeProperty('--br');
        el.style.removeProperty('--bd');
      });
    }
    window.scrollTo(0, 0);
    setBlown(false);
    if (detRef.current) detRef.current.rebuild();
  }, []);

  const jump = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top, behavior: 'smooth' });
  };

  return (
    <div className={`v18 t-${lab.type}${blown ? ' is-open' : ''}`}>
      <div className="v18-sky" ref={skyRef} aria-hidden="true" />
      <div className="v18-grain" aria-hidden="true" />

      <header className={`v18-bar${blown ? ' on' : ''}`}>
        <button type="button" className="v18-bar-home" onClick={home} title="Put the wall back">
          <span className="v18-bar-fuse" aria-hidden="true" />
          <span className="v18-bar-name">
            {ME.first} {ME.last}
          </span>
          <span className="v18-bar-role">{ME.role}</span>
        </button>
        <nav className="v18-bar-nav" aria-label="Sections">
          {NAV.map((n) => (
            <button type="button" key={n.id} onClick={() => jump(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>
        <nav className="v18-bar-links" aria-label="Elsewhere">
          {LINKS.slice(0, 5).map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith('http') ? '_blank' : undefined}
              rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
              title={l.label}
            >
              {l.short}
            </a>
          ))}
        </nav>
      </header>

      <main className="v18-main">
        <Work sectionRef={(el) => { sections.current[0] = el; }} />
        <Projects sectionRef={(el) => { sections.current[1] = el; }} />
        <Papers sectionRef={(el) => { sections.current[2] = el; }} />
        <Room sectionRef={(el) => { sections.current[3] = el; }} />

        <footer className="v18-foot">
          <p className="v18-foot-name">
            {ME.first} {ME.last}
          </p>
          <p className="v18-foot-where">{CONTACT.location}</p>
          <nav className="v18-foot-links" aria-label="Elsewhere">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel={l.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <button type="button" className="v18-foot-again" onClick={home}>
            Put the wall back
          </button>
        </footer>
      </main>

      <div className={`v18-face${blown ? ' is-blown' : ''}`} ref={landRef} aria-hidden={blown ? 'true' : undefined}>
        <Detonator
          ref={detRef}
          mode={lab.blast}
          grid={lab.grid}
          armed={!blown}
          reduced={reduced}
          onBlast={onBlast}
          onBack={() => {}}
        />
        <Landing hint={reduced ? 'Tap anywhere to continue' : touch ? 'Press and hold' : 'Hold the left mouse button'} />
      </div>

      <Lab />
    </div>
  );
}

export default function V18() {
  return (
    <LabProvider>
      <Page />
    </LabProvider>
  );
}
