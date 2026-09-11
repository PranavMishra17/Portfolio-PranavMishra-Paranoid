// v19 — the whole page.
//
// One wall, once. Behind it the real site, scrolling freely. The sky drifts as you go, in
// the register of design-lab/12-weather.html — slight gradients of colour, nothing more.
//
// The header is the home. His face in the corner is the way back to the wall — the way a
// logo takes you home — and the middle of the bar says where on the page you are, in words.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Detonator from './wall';
import Landing from './sections/Landing';
import Work from './sections/Work';
import Projects from './sections/Projects';
import Papers from './sections/Papers';
import Room from './room/Room';
import Lab, { LabProvider } from './lab';
import { useSky, useClock } from './hooks';
import { ME, LINKS } from './copy';
import './v19.css';

import { FONTS } from './fonts';

// what the middle of the header says, per section
const WHERE = [
  { id: 'work', label: 'Now — at Alfred_' },
  { id: 'projects', label: 'Everything I built' },
  { id: 'papers', label: 'Two papers' },
  { id: 'room', label: 'My room' },
];

function Page() {
  const skyRef = useRef(null);
  const detRef = useRef(null);
  const sections = useRef([]);
  const [blown, setBlown] = useState(false);
  const [landing, setLanding] = useState(true); // the landing is unmounted once it has gone
  const [where, setWhere] = useState(WHERE[0].id);

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(pointer: coarse)').matches;

  // the real clock, unless the clock in the room has been clicked: then it is flipped to the
  // other half of the day, and clicked again, back
  const real = useClock('now');
  const [flip, setFlip] = useState(false);
  const hour = flip ? (real >= 6 && real < 18 ? 22 : 10) : real;
  useSky(skyRef, hour);

  /* body, fonts, and the scroll the browser must not restore under a wall */
  useEffect(() => {
    document.body.classList.add('v19-body');
    document.title = `${ME.first} ${ME.last} — ${ME.role}`;
    let link = document.getElementById('v19-fonts');
    if (!link) {
      link = document.createElement('link');
      link.id = 'v19-fonts';
      link.rel = 'stylesheet';
      link.href = FONTS;
      document.head.appendChild(link);
    }
    // a refresh part way down the page used to restore that scroll behind the wall, so the
    // landing ended up sitting over the middle of the site. The page always starts at the top.
    let previous = 'auto';
    try {
      if ('scrollRestoration' in window.history) {
        previous = window.history.scrollRestoration;
        window.history.scrollRestoration = 'manual';
      }
    } catch (err) {
      // a locked-down history object is not a reason to fail the page
    }
    window.scrollTo(0, 0);
    const settle = window.setTimeout(() => window.scrollTo(0, 0), 60);
    return () => {
      window.clearTimeout(settle);
      try {
        if ('scrollRestoration' in window.history) window.history.scrollRestoration = previous;
      } catch (err) {
        // as above
      }
      document.body.classList.remove('v19-body', 'v19-locked');
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('v19-locked', !blown);
    if (!blown) window.scrollTo(0, 0);
  }, [blown]);

  /* once the landing has been blown away it is taken out of the page entirely */
  useEffect(() => {
    if (!blown) {
      setLanding(true);
      return undefined;
    }
    const t = window.setTimeout(() => setLanding(false), 620);
    return () => window.clearTimeout(t);
  }, [blown]);

  /* the header's middle: which section owns the top of the viewport */
  useEffect(() => {
    if (!blown) return undefined;
    let ticking = false;
    const read = () => {
      ticking = false;
      const line = window.innerHeight * 0.4;
      let cur = WHERE[0].id;
      for (const el of sections.current) {
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) cur = el.id;
      }
      setWhere(cur);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [blown]);

  const onBlast = useCallback(() => setBlown(true), []);

  const home = useCallback(() => {
    window.scrollTo(0, 0);
    setBlown(false);
    if (detRef.current) detRef.current.rebuild();
  }, []);

  const jump = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top, behavior: 'smooth' });
  }, []);

  /* the red button on the landing: it fires the wall from where the button is */
  const go = useCallback(
    (e) => {
      const r = e && e.currentTarget ? e.currentTarget.getBoundingClientRect() : null;
      const x = r ? r.left + r.width / 2 : window.innerWidth / 2;
      const y = r ? r.top + r.height / 2 : window.innerHeight / 2;
      const fired = detRef.current ? detRef.current.fire(x, y) : false;
      if (!fired) setBlown(true);
      window.setTimeout(() => jump('work'), 60);
    },
    [jump]
  );

  const current = WHERE.find((w) => w.id === where) || WHERE[0];

  return (
    <div className={`v19 land-plate${blown ? ' is-open' : ''}`}>
      <div className="v19-sky" ref={skyRef} aria-hidden="true" />
      <div className="v19-grain" aria-hidden="true" />

      <header className={`v19-bar${blown ? ' on' : ''}`}>
        <button type="button" className="v19-bar-home" onClick={home} title="Put the wall back">
          <img className="v19-bar-face" src={ME.photo} alt="" />
          <span className="v19-bar-who">
            <b>
              {ME.first} {ME.last}
            </b>
            <i>{ME.short}</i>
          </span>
        </button>

        <div className="v19-bar-where" aria-live="polite">
          <button
            type="button"
            className="v19-bar-step is-prev"
            onClick={() => jump(WHERE[Math.max(0, WHERE.findIndex((w) => w.id === where) - 1)].id)}
            aria-label="Previous section"
            title="Previous section"
          />
          <span key={current.id}>{current.label}</span>
          <ol className="v19-bar-dots" aria-label="Sections">
            {WHERE.map((w) => (
              <li key={w.id}>
                <button
                  type="button"
                  className={w.id === where ? 'on' : ''}
                  onClick={() => jump(w.id)}
                  aria-label={w.label}
                  title={w.label}
                />
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="v19-bar-step is-next"
            onClick={() => jump(WHERE[Math.min(WHERE.length - 1, WHERE.findIndex((w) => w.id === where) + 1)].id)}
            aria-label="Next section"
            title="Next section"
          />
        </div>

        <nav className="v19-bar-links" aria-label="Elsewhere">
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
      </header>

      <main className="v19-main">
        <Work sectionRef={(el) => { sections.current[0] = el; }} />
        <Projects sectionRef={(el) => { sections.current[1] = el; }} />
        <Papers sectionRef={(el) => { sections.current[2] = el; }} />
        <Room sectionRef={(el) => { sections.current[3] = el; }} onTop={home} hour={hour} flipped={flip} onClock={() => setFlip((f) => !f)} onJump={jump} />
      </main>

      {landing ? (
        <div
          className={`v19-face${blown ? ' is-blown' : ''}`}
          aria-hidden={blown ? 'true' : undefined}
        >
          <Detonator
            ref={detRef}
            surface="iso2"
            armed={!blown}
            reduced={reduced}
            onBlast={onBlast}
          />
          <Landing
            onGo={go}
            hint={reduced ? 'Tap anywhere' : touch ? 'Press and hold' : 'Hold the left mouse button'}
          />
        </div>
      ) : null}

      <Lab />
    </div>
  );
}

export default function V19() {
  return (
    <LabProvider>
      <Page />
    </LabProvider>
  );
}
