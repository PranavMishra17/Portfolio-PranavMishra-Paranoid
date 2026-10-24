// v19 — the whole page.
//
// One wall, once. Behind it the real site, scrolling freely. The sky drifts as you go, in
// the register of design-lab/12-weather.html — slight gradients of colour, nothing more.
//
// The header is the home. His face in the corner is the way back to the wall — the way a
// logo takes you home — and the middle of the bar says where on the page you are, in words.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { prefetchResume, prefetchResumePage } from './resumeCache';
import Detonator from './wall';
import Landing from './sections/Landing';
import Work from './sections/Work';
import Projects from './sections/Projects';
import Papers from './sections/Papers';
import Room from './room/Room';
import { useSky, useClock, usePhone, STARS } from './hooks';
import { ME, LINKS } from './copy';
import './v19.css';

import { FONTS } from './fonts';

// what the middle of the header says, per section
const WHERE = [
  { id: 'work', label: 'Now — at alfred_' },
  { id: 'projects', label: 'Everything I built' },
  { id: 'papers', label: 'Two papers' },
  { id: 'room', label: 'My room' },
];

// the phone landings being tried: now, the fuse, the cover, the statement
const LANDS = ['now', 'fuse', 'cover', 'say'];

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
  // a phone held upright gets a layout of its own (and the fuse is its only way in: no tap)
  const phone = usePhone();
  // the phone landing has variants while it is being chosen: ?land=<name> shows one, ?pick adds
  // a switcher; a pick is remembered on this device
  const [land, setLand] = useState(() => {
    try {
      const q = new URLSearchParams(window.location.search).get('land');
      if (LANDS.includes(q)) return q;
      const saved = window.localStorage.getItem('v19-land');
      return LANDS.includes(saved) ? saved : LANDS[0];
    } catch (err) {
      return LANDS[0];
    }
  });
  const picking = typeof window !== 'undefined' && /[?&]pick\b/.test(window.location.search);
  const pickLand = (l) => {
    setLand(l);
    try { window.localStorage.setItem('v19-land', l); } catch (err) { /* a private window keeps it for now */ }
  };

  // the real clock, unless the clock in the room has been clicked: then it is flipped to the
  // other half of the day, and clicked again, back
  const real = useClock('now');
  const [flip, setFlip] = useState(false);
  const [disco, setDisco] = useState(false); // the button in the room
  const hour = flip ? (real >= 6 && real < 18 ? 22 : 10) : real;
  useSky(skyRef, hour, 0.32);

  /* body, fonts, and the scroll the browser must not restore under a wall */
  useEffect(() => {
    document.body.classList.add('v19-body');
    document.documentElement.classList.add('v19-html');
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
      document.documentElement.classList.remove('v19-html');
    };
  }, []);

  useEffect(() => {
    if (!blown) window.scrollTo(0, 0);
  }, [blown]);

  /* where the page comes to rest when the wall goes: with the alfred_ heading in view. On a touch
     screen the browser's own snap does it (v19.css) and nothing here pushes the scroll, so a
     finger is never fought. With a mouse there is no finger: the page is put on the heading and
     held there a moment, so a wheel's last notches do not carry it past. And a wall held away at
     the very top leaves the page there, which would read as scrolled back up and bring the wall
     straight back, so that moves to the work on any screen. */
  const settleRef = useRef(null);
  const settle = useCallback((hold) => {
    const work = document.getElementById('work');
    if (!work) return;
    const top = work.getBoundingClientRect().top + window.scrollY;
    if (hold) settleRef.current = { top, until: performance.now() + 600 };
    window.scrollTo({ top, behavior: 'instant' });
  }, []);

  /* the fuse, on every screen: the page scrolls from the start, and the first part of the scroll
     lifts the tiles and the landing with it; past FUSE of a screen it blows. Back at the top, the
     wall is rebuilt. On a desktop the held mouse button still works as well. */
  useEffect(() => {
    const FUSE = 0.4;
    let ticking = false;
    const read = () => {
      ticking = false;
      const y = window.scrollY;
      const held = settleRef.current;
      if (held && performance.now() < held.until) {
        if (Math.abs(y - held.top) > 2) window.scrollTo({ top: held.top, behavior: 'instant' });
        return;
      }
      if (blown) {
        if (y <= 2) {
          setBlown(false);
          if (detRef.current) detRef.current.rebuild();
        }
        return;
      }
      const face = document.querySelector('.v19-face');
      if (face) {
        face.style.setProperty('--lift', `${Math.round(y)}px`);
        face.style.setProperty('--fuse', Math.min(1, y / (window.innerHeight * FUSE)).toFixed(3));
      }
      // the wall wakes the page itself once its tiles are clear (onBlast); with no wall, this does
      if (detRef.current) {
        const fired = detRef.current.fuse(y / (window.innerHeight * FUSE));
        if (fired && !window.matchMedia('(pointer: coarse)').matches) settle(true);
      } else if (y > window.innerHeight * FUSE) setBlown(true);
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [blown, settle]);

  /* when the wall comes back after the page was open, it comes back as a movement: the tiles
     drop in and the landing settles after them */
  const [entering, setEntering] = useState(false);
  const wasBlown = useRef(false);
  useEffect(() => {
    if (blown) {
      wasBlown.current = true;
      return undefined;
    }
    if (!wasBlown.current) return undefined;
    wasBlown.current = false;
    setEntering(true);
    const t = window.setTimeout(() => setEntering(false), 1500);
    return () => window.clearTimeout(t);
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

  /* animations run only where they can be seen: under the wall nothing in the page animates,
     and once it is open a section animates only while some of it is in the viewport. The Work
     drawings alone are a few dozen CSS animations, and a page left on the wall was painting
     them sixty times a second behind it. */
  useEffect(() => {
    const els = sections.current.filter(Boolean);
    if (!('IntersectionObserver' in window) || !els.length) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.removeAttribute('data-off');
        else e.target.setAttribute('data-off', '');
      });
    }, { rootMargin: '10% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

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

  const onBlast = useCallback(() => {
    // a wall held or tapped away at the very top of the page: bring the page to the work (one
    // scrolled away is already on its way there)
    if (window.scrollY <= 2) settle();
    setBlown(true);
    // the résumé, quietly, so the link is instant when it is wanted
    window.setTimeout(() => {
      prefetchResumePage();
      prefetchResume();
    }, 1500);
  }, [settle]);

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
    <div className={`v19 land-plate lv-${land}${blown ? ' is-open' : ' is-shut'}${disco ? ' is-disco' : ''} has-sun`}>
      <div className="v19-sky" ref={skyRef} aria-hidden="true">
        <i className="v19-stars" style={{ backgroundImage: `url("${STARS[0]}")` }} />
        <i className="v19-stars is-b" style={{ backgroundImage: `url("${STARS[1]}")` }} />
        <i className="v19-moon" />
        <i className="v19-sun" />
      </div>
      {disco ? <div className="v19-disco" aria-hidden="true"><i /><i /><i /></div> : null}
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
          {LINKS.map((l) =>
            l.href.startsWith('http') ? (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
            ) : (
              <Link key={l.label} to={l.href}>{l.label}</Link>
            )
          )}
        </nav>
      </header>

      <main className="v19-main">
        <div className="v19-lead" aria-hidden="true" />
        <Work sectionRef={(el) => { sections.current[0] = el; }} />
        <Projects sectionRef={(el) => { sections.current[1] = el; }} />
        <Papers sectionRef={(el) => { sections.current[2] = el; }} />
        <Room sectionRef={(el) => { sections.current[3] = el; }} onTop={home} hour={hour} flipped={flip} onClock={() => setFlip((f) => !f)} onJump={jump} onDisco={setDisco} />
      </main>

      {landing ? (
        <div
          className={`v19-face${blown ? ' is-blown' : ''}${entering ? ' is-entering' : ''}`}
          aria-hidden={blown ? 'true' : undefined}
        >
          <Detonator
            ref={detRef}
            surface="iso2"
            armed={!blown}
            reduced={reduced}
            onBlast={onBlast}
            scroll={phone}
            enter={entering}
          />
          {/* the fuse cord, for the landing that shows it: the spark climbs it as you scroll */}
          {phone ? <i className="v19-fuse" aria-hidden="true"><b /></i> : null}
          <Landing
            onGo={go}
            hint="Scroll down"
          />
          {picking && phone && !blown ? (
            <nav className="v19-pick" aria-label="Landing">
              {LANDS.map((l) => (
                <button type="button" key={l} className={land === l ? 'on' : ''} onClick={() => pickLand(l)}>{l}</button>
              ))}
            </nav>
          ) : null}
        </div>
      ) : null}

    </div>
  );
}

export default function V19() {
  return <Page />;
}
