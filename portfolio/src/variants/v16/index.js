// src/variants/v16/index.js — "Daylight"
//
// Keeps the mechanic that worked — press and hold, the fuse burns, the face comes apart — and
// throws away everything about how it looked.
//
//   · Light. A day behind the wall rather than a dark room.
//   · The grid is invisible while the wall is whole. It only becomes a grid as it breaks, and
//     the pieces are big slabs, not rubble.
//   · No loader anywhere. The state of the fuse IS the burning point travelling down the wick,
//     with a small pool of torchlight under it.
//   · Holding makes the bomb swell slightly and shake hard, so there is no question that
//     something is happening.
//   · The instant it goes off the bomb drops back to rest — no leftover glow, scale or highlight.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { projects, contactInfo, getImageWithFallback } from '../../data/projects';
import experiences from '../../data/experience';
import { publications } from '../../data/publications';
import Wall from './wall';
import './v16.css';

const FUSE_MS = 1100;

const PALETTE = {
  top:  '#f7f4ee',
  mid:  '#efebe3',
  foot: '#e6e1d7',
  edge: 'rgba(60,54,44,.16)',
};

const FEATURED = [
  { id: 'stellarium', name: 'Stellarium', line: 'A hundred and seven thousand astronomical objects, rendered in a room whose walls are screens.' },
  { id: 'snaider-cut', name: 'SnAIder-Cut', line: 'Say what you want changed and the augmented room changes around you. Won MIT XR 2024.' },
  { id: 'equity-project', name: 'EQUITY', line: 'A virtual patient in Unreal Engine, built so researchers can study how doctors treat people differently.' },
  { id: 'big5-agents', name: 'Big5-Agents', line: 'Six teamwork behaviours from psychology, each a switch you can turn off to see which carried the result.' },
  { id: 'snakeai-mlops', name: 'SnakeAI-MLOps', line: 'Four ways of learning the same game, racing each other. You can go and play it.' },
  { id: 'virtual-van-gogh', name: 'Virtual Van Gogh', line: 'A museum you walk through, where the paintings are on a chain. First at HINT 5.0.' },
];

const VALUES = [
  { k: 'Email arriving as a text message', was: '90 s', now: '3 s' },
  { k: 'Security codes, at p90', was: '189 s', now: '0' },
  { k: 'Model cost per user, rules engine', was: null, now: '−30%' },
  { k: 'Rules made just by talking to it', was: null, now: '98%' },
];

const ROLE_LINE = {
  'wheelprice-intern': 'Computer vision for part fitment, and a content system that took the site to ten or twenty thousand readers a day.',
  'research-software-engineer-uic': 'Virtual patients in Unreal Engine, and an audio pipeline that reached 98.52% accuracy with real-time inference.',
  'bipolar-factory-intern': 'A streaming platform on the MERN stack, and in-game chat in Unity that moved retention about ten percent.',
};

const PAPER_LINE = {
  metarag: 'Retrieval improves if a model writes metadata about each chunk before you store it. 82.5% precision against 73.3%.',
  teammedagents: 'The Big Five teamwork model built as real mechanisms between agents. Better on seven of eight medical benchmarks.',
  'slm-teammedagents': 'Whether several small models can stand in for one large one on medical images, and what that trade costs.',
};

export default function V16() {
  const canvasRef = useRef(null);
  const bombRef = useRef(null);
  const innerRef = useRef(null);
  const fuseRef = useRef(null);
  const emberRef = useRef(null);
  const torchRef = useRef(null);
  const wallRef = useRef(null);
  const holdRef = useRef(null);
  const wickRef = useRef(null);

  const [blown, setBlown] = useState(false);
  const [failsafe, setFailsafe] = useState(false);

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const featured = useMemo(() => {
    const all = [...(projects.aiMl || []), ...(projects.gameDesign || []), ...(projects.misc || [])];
    return FEATURED.map((f) => {
      const p = all.find((x) => x.id === f.id);
      return p ? { ...p, ...f } : null;
    }).filter(Boolean);
  }, []);

  const history = experiences.filter((e) => e.id !== 'alfred-founding-llm');

  /* ── the wall, the fuse and the bomb all live on one loop ── */
  useEffect(() => {
    if (reduced) { setFailsafe(true); return undefined; }

    const cv = canvasRef.current;
    if (!cv) return undefined;
    const ctx = cv.getContext('2d');
    let raf = null;
    let alive = true;
    let ticked = false;

    const sizeIt = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const W = window.innerWidth;
      const H = window.innerHeight;
      cv.width = Math.round(W * dpr);
      cv.height = Math.round(H * dpr);
      cv.style.width = `${W}px`;
      cv.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const size = Math.max(110, Math.min(200, Math.round(W / 8)));
      if (!wallRef.current) wallRef.current = new Wall({ W, H, size, palette: PALETTE });
      else wallRef.current.resize(W, H, size);
    };

    sizeIt();

    let watchdog = null;
    let lastFrame = 0;
    const loop = (now) => {
      if (!alive) return;
      ticked = true;
      lastFrame = now;
      const wall = wallRef.current;

      // fuse — the burning point, not a progress bar
      const hold = holdRef.current;
      if (hold) {
        const p = Math.min(1, (now - hold.t0) / FUSE_MS);
        paintFuse(p);
        if (p >= 1) {
          const ok = wall.explode(hold.x, hold.y, now);
          holdRef.current = null;
          rest();                       // straight back to rest, nothing left lit
          if (ok) setBlown(true);
        }
      }

      wall.step(now);
      wall.draw(ctx);
      raf = window.requestAnimationFrame(loop);
    };
    raf = window.requestAnimationFrame(loop);

    // requestAnimationFrame stops in a hidden or backgrounded document — and it can stop
    // PART WAY THROUGH, which once left a half-collapsed wall frozen over the whole page.
    // So a watchdog keeps checking that frames are still arriving, and hand-cranks the same
    // loop whenever they are not. It heals itself when rAF comes back.
    const watch = () => {
      if (!alive) return;
      const now = performance.now();
      if (now - lastFrame > 300) loop(now);
    };
    const guard = window.setTimeout(() => { if (!ticked && alive) loop(performance.now()); }, 400);
    watchdog = window.setInterval(watch, 250);

    window.addEventListener('resize', sizeIt);
    return () => {
      alive = false;
      if (raf) window.cancelAnimationFrame(raf);
      if (watchdog) window.clearInterval(watchdog);
      window.clearTimeout(guard);
      window.removeEventListener('resize', sizeIt);
    };
  }, [reduced]);

  /* ── drawing the fuse: the ember walks the wick, the torch pools under it ── */
  const paintFuse = useCallback((p) => {
    const wick = wickRef.current;
    const fuse = fuseRef.current;
    const ember = emberRef.current;
    const torch = torchRef.current;
    const inner = innerRef.current;

    if (fuse) {
      // the unburnt part of the wick shortens from the tip down
      fuse.style.strokeDasharray = '1';
      fuse.style.strokeDashoffset = String(-p);
    }
    if (wick && ember) {
      const len = wick.getTotalLength();
      const pt = wick.getPointAtLength(len * (1 - p));
      ember.setAttribute('cx', pt.x);
      ember.setAttribute('cy', pt.y);
      ember.setAttribute('r', String(2.2 + p * 1.8));
    }
    if (torch) {
      const glow = 0.25 + p * 0.75;
      torch.style.setProperty('--torch', String(glow));   // drives the scale
      torch.style.opacity = String(glow);                 // and the light itself
    }
    if (inner) {
      // swells a little, and shakes harder the closer it gets
      const amp = 1.2 + p * p * 7.5;
      const jx = (Math.random() - 0.5) * amp * 2;
      const jy = (Math.random() - 0.5) * amp * 2;
      const rot = (Math.random() - 0.5) * p * 9;
      inner.style.transform = `translate(${jx}px, ${jy}px) rotate(${rot}deg) scale(${1 + p * 0.16})`;
    }
  }, []);

  const rest = useCallback(() => {
    const fuse = fuseRef.current;
    const ember = emberRef.current;
    const torch = torchRef.current;
    const inner = innerRef.current;
    if (fuse) { fuse.style.strokeDasharray = '1'; fuse.style.strokeDashoffset = '0'; }
    if (ember) { ember.setAttribute('r', '0'); }
    if (torch) { torch.style.setProperty('--torch', '0'); torch.style.opacity = '0'; }
    if (inner) inner.style.transform = 'translate(0,0) rotate(0deg) scale(1)';
  }, []);

  /* ── pointer: the bomb follows you; press and hold lights it ── */
  useEffect(() => {
    if (reduced) return undefined;

    const move = (e) => {
      const b = bombRef.current;
      if (b) b.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      if (holdRef.current) { holdRef.current.x = e.clientX; holdRef.current.y = e.clientY; }
    };
    const down = (e) => {
      if (e.target && e.target.closest && e.target.closest('a,button')) return;
      holdRef.current = { x: e.clientX, y: e.clientY, t0: performance.now() };
    };
    const up = () => { if (holdRef.current) { holdRef.current = null; rest(); } };

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    window.addEventListener('blur', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      window.removeEventListener('blur', up);
    };
  }, [reduced, rest]);

  const again = () => {
    const wall = wallRef.current;
    if (wall) { wall.reset(); setBlown(false); }
  };

  const wallHidden = failsafe || reduced;   // failsafe now only trips under reduced motion

  return (
    <div className="v16">
      <div className="v16-sky" aria-hidden="true" />
      <div className="v16-sun" aria-hidden="true" />

      <div className="v16-page">
        <div className="v16-wrap">
          <header className="v16-open">
            <h1>Pranav<br /><em>Mishra</em></h1>
            <p className="say">I build the parts of AI systems that have to be right — usually the unglamorous half.</p>
            <p className="where">
              Founding LLM Engineer, Alfred_ — New York City<br />
              Computer Science, University of Illinois Chicago<br />
              {contactInfo.location}
            </p>
          </header>

          <section className="v16-band">
            <p className="v16-eye">The work</p>
            <h2 className="v16-h2">Five thousand people rely on it, so it cannot be wrong.</h2>
            <div className="v16-col">
              <p>
                Alfred_ runs people’s email, calendar and daily obligations over text message,
                chat and voice. I own the side where being wrong is expensive.
              </p>
              <p>
                <b>I rebuilt its working memory so it cannot invent a fact about your inbox</b>,
                enforced by tests rather than by hoping the model behaves. I replaced a model call
                on every message in the rules engine with a matcher that simply decides. And I
                moved notifications off polling.
              </p>
            </div>
            <div className="v16-vals">
              {VALUES.map((v) => (
                <div className="v16-val" key={v.k}>
                  <span className="k">{v.k}</span>
                  <span className="was">{v.was || ''}</span>
                  <span className="now">{v.now}</span>
                </div>
              ))}
            </div>
            <div className="v16-roles">
              {history.map((e) => (
                <div className="v16-role" key={e.id}>
                  <span className="yr">{e.duration}</span>
                  <div>
                    <h3>{e.title}, {e.company}</h3>
                    <p>{ROLE_LINE[e.id] || e.description[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="v16-band">
            <p className="v16-eye">Six of about thirty</p>
            <h2 className="v16-h2">Things I finished.</h2>
            <div className="v16-work">
              {featured.map((p) => (
                <article className="v16-item" key={p.id}>
                  <div className="shot">
                    <img src={getImageWithFallback(p.mainImage, 'ai-ml')} alt={p.name} loading="lazy" />
                  </div>
                  <h3>{p.name}</h3>
                  <p>{p.line}</p>
                  <p className="lk">
                    {p.demoLink && <a href={p.demoLink} target="_blank" rel="noreferrer">Watch it</a>}
                    {p.websiteLink && <a href={p.websiteLink} target="_blank" rel="noreferrer">Use it</a>}
                    {p.githubLink && <a href={p.githubLink} target="_blank" rel="noreferrer">Source</a>}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="v16-band">
            <p className="v16-eye">Written, won, and otherwise</p>
            <h2 className="v16-h2">The rest of it.</h2>
            {publications.map((p) => (
              <div className="v16-paper" key={p.id}>
                <p className={'st' + (p.status === 'ACCEPTED' ? ' acc' : '')}>
                  {p.status === 'ACCEPTED' ? 'Accepted' : p.status}{p.venue ? ` — ${p.venue}` : ''}
                </p>
                <h3>{p.title}</h3>
                <p>{PAPER_LINE[p.id]}</p>
                {p.pdfLink && <p style={{ marginTop: '.4rem' }}><a href={p.pdfLink} target="_blank" rel="noreferrer">Read it</a></p>}
              </div>
            ))}
            <div className="v16-paper">
              <p className="st">Off the clock</p>
              <h3>I read, I watch, I play.</h3>
              <div className="v16-slots">
                <div className="v16-slot"><span>Reading</span><b>—</b></div>
                <div className="v16-slot"><span>Watching</span><b>—</b></div>
                <div className="v16-slot"><span>Playing</span><b>—</b></div>
              </div>
              <p className="v16-note">Empty on purpose — yours to fill in.</p>
            </div>
          </section>

          <footer className="v16-foot">
            <span>{contactInfo.location}</span>
            <a href={contactInfo.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={contactInfo.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={`mailto:${contactInfo.email.personal}`}>{contactInfo.email.personal}</a>
          </footer>
        </div>
      </div>

      {!wallHidden && (
        <canvas
          ref={canvasRef}
          className={`v16-wall${blown ? ' gone' : ''}`}
          aria-hidden="true"
        />
      )}

      {!wallHidden && (
        <div className="v16-bomb" ref={bombRef} aria-hidden="true">
          <div className="v16-bomb-in" ref={innerRef}>
            <div className="v16-torch" ref={torchRef} />
            <svg width="44" height="44" viewBox="0 0 44 44">
              {/* the wick, and the unburnt length drawn over it */}
              <path
                ref={wickRef}
                d="M25 15 C 29 8, 35 10, 36 3"
                fill="none" stroke="rgba(60,54,44,.35)" strokeWidth="2.4" strokeLinecap="round"
                pathLength="1"
              />
              <path
                ref={fuseRef}
                d="M25 15 C 29 8, 35 10, 36 3"
                fill="none" stroke="#3a342b" strokeWidth="2.4" strokeLinecap="round"
                pathLength="1" strokeDasharray="1" strokeDashoffset="0"
              />
              <circle cx="20" cy="26" r="11" fill="#23201b" />
              <circle cx="16.6" cy="22.4" r="3" fill="rgba(255,255,255,.16)" />
              <circle ref={emberRef} className="v16-ember" cx="36" cy="3" r="0" />
            </svg>
          </div>
        </div>
      )}

      {!wallHidden && !blown && (
        <p className="v16-hint">Press and hold anywhere</p>
      )}
      {!wallHidden && blown && (
        <button className="v16-again" onClick={again}>Put it back</button>
      )}
    </div>
  );
}
