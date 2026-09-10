// Variant 1 — "The day is the navigation."
//
// One idea: the left rail is a timetable. Four entries, four times of day. The sky keeps that time as
// you scroll, from early morning at the top to sunset at the room. Text lives on paper plates that sit
// in front of the sky, never on it. The room is the footer, at dusk, and its window shows the next
// morning.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Sky from './Sky';
import Work from './Work';
import Built from './Built';
import Overlay from './Overlay';
import Room from './Room';
import { ABOUT } from './copy';
import './v1.css';

const FONTS =
  'https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&display=swap';

const STOPS = [
  { id: 'arrival', time: '06:00', label: 'Arrival' },
  { id: 'work', time: '11:00', label: 'The work' },
  { id: 'built', time: '15:00', label: 'Built and written' },
  { id: 'room', time: '19:00', label: 'The room' },
];

function dayWord(t) {
  if (t < 0.18) return 'early morning';
  if (t < 0.42) return 'late morning';
  if (t < 0.66) return 'afternoon';
  if (t < 0.88) return 'evening';
  return 'sunset';
}

function useDay() {
  const [t, setT] = useState(0);
  const [active, setActive] = useState('arrival');
  const ticking = useRef(false);

  useEffect(() => {
    const paint = () => {
      ticking.current = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY || 0;
      setT(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
      const probe = y + window.innerHeight * 0.38;
      let cur = STOPS[0].id;
      for (const s of STOPS) {
        const el = document.getElementById(s.id);
        if (el && el.offsetTop <= probe) cur = s.id;
      }
      setActive(cur);
    };
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
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

function Rail({ active, t }) {
  const go = (id) => (e) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };
  return (
    <aside className="v1-rail">
      <div className="v1-rail-name">
        <a href="#arrival" onClick={go('arrival')} className="v1-name">
          {ABOUT.short}
        </a>
        <span className="v1-place">{ABOUT.place}</span>
      </div>
      <nav className="v1-day" aria-label="Sections, as times of day">
        <ul>
          {STOPS.map((s) => (
            <li key={s.id} className={active === s.id ? 'on' : ''}>
              <a href={`#${s.id}`} onClick={go(s.id)} aria-current={active === s.id ? 'true' : undefined}>
                <span className="v1-time">{s.time}</span>
                <span className="v1-label">{s.label}</span>
                <span className="v1-dot" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <p className="v1-now-line">It is {dayWord(t)}.</p>
      <ul className="v1-rail-links">
        <li>
          <a href="https://github.com/PranavMishra17" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/in/pranavgamedev/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a href="https://huggingface.co/Paranoiid" target="_blank" rel="noopener noreferrer">
            Hugging Face
          </a>
        </li>
        <li>
          <a href="/resume">Resume</a>
        </li>
      </ul>
    </aside>
  );
}

export default function V1() {
  const { t, active } = useDay();
  const [overlay, setOverlay] = useState(false);
  const openOverlay = useCallback(() => setOverlay(true), []);
  const closeOverlay = useCallback(() => setOverlay(false), []);

  useEffect(() => {
    document.body.classList.add('v1-body');
    document.title = 'Pranav Mishra';
    let link = document.getElementById('v1-fonts');
    if (!link) {
      link = document.createElement('link');
      link.id = 'v1-fonts';
      link.rel = 'stylesheet';
      link.href = FONTS;
      document.head.appendChild(link);
    }
    return () => {
      document.body.classList.remove('v1-body');
    };
  }, []);

  return (
    <div className="v1">
      <Sky t={t} />
      <Rail active={active} t={t} />

      <main className="v1-main">
        <section className="v1-screen v1-arrival" id="arrival">
          <div className="v1-plate v1-plate-arrival">
            <h1 className="v1-opening">{ABOUT.opening}</h1>
            {ABOUT.lines.map((l) => (
              <p className="v1-p" key={l}>
                {l}
              </p>
            ))}
            <p className="v1-p v1-muted v1-hint">The sky keeps time as you scroll. The room is at the end of the day.</p>
          </div>
        </section>

        <section className="v1-screen" id="work">
          <div className="v1-plate">
            <Work />
          </div>
        </section>

        <section className="v1-screen" id="built">
          <div className="v1-plate wide">
            <Built onSeeAll={openOverlay} />
          </div>
        </section>
      </main>

      <Room onSeeAll={openOverlay} />
      <Overlay open={overlay} onClose={closeOverlay} />
    </div>
  );
}
