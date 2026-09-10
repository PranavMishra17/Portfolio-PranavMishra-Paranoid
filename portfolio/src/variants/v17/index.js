// v17 — "Under the plaster."
//
// The portfolio is a plain, light page of type. Over it lies one sheet of pale plaster with the
// name written on it. The cursor is a bomb: press and hold anywhere and the wick burns down; when
// it reaches the bomb the sheet comes apart in big squares, in a wave outward from that point, and
// the page is underneath. Nothing about the sheet says "grid" until the moment it breaks.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { projects, contactInfo, getImageWithFallback } from '../../data/projects';
import experiences from '../../data/experience';
import { publications } from '../../data/publications';
import Surface, { paintSurface, cellSize } from './surface';
import { INTRO, PICKS, PROJECT_COPY, EXPERIENCE_COPY, PAPER_NOTES, INTERESTS_LINE } from './copy';
import './v17.css';

const FUSE_MS = 1400;

async function loadFonts() {
  if (!document.fonts) return;
  const load = Promise.all([
    document.fonts.load("600 96px 'Instrument Sans'"),
    document.fonts.load("500 13px 'IBM Plex Mono'"),
  ]);
  const cap = new Promise((resolve) => setTimeout(resolve, 2500));
  await Promise.race([load, cap]).catch(() => {});
}

// ---------------------------------------------------------------------------------------------
// The cover: canvas, physics, bomb.
// ---------------------------------------------------------------------------------------------
function Cover({ onGone, enter }) {
  const canvasRef = useRef(null);
  const stageRef = useRef(null);
  const bombRef = useRef(null);
  const bombInRef = useRef(null);
  const glowRef = useRef(null);
  const wickRef = useRef(null);
  const emberRef = useRef(null);
  const surf = useRef(null);
  const size = useRef({ W: 0, H: 0, dpr: 1 });
  const hold = useRef(null);
  const fx = useRef([]);
  const nudge = useRef(0);
  const ticked = useRef(false);
  const goneRef = useRef(onGone);
  goneRef.current = onGone;
  const [ready, setReady] = useState(false);
  const [holding, setHolding] = useState(false);
  const [seen, setSeen] = useState(false);

  const build = useCallback((entering) => {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const s = cellSize(W);
    const TH = Math.ceil(H / s) * s;
    size.current = { W, H, dpr };
    const texture = paintSurface({ W, H, TH, dpr });
    surf.current = new Surface({ texture, W, H, TH, s, dpr });
    if (entering) surf.current.rebuild(performance.now());
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
    }
  }, []);

  // paint, with a guard: if for any reason the sheet is not ready soon, it is not there at all
  useEffect(() => {
    let alive = true;
    const guard = setTimeout(() => {
      if (alive && !surf.current) goneRef.current();
    }, 5000);
    (async () => {
      await loadFonts();
      if (!alive) return;
      build(enter);
      setReady(true);
    })();
    const onResize = () => {
      if (!surf.current || surf.current.state !== 'intact') return;
      build(false);
    };
    window.addEventListener('resize', onResize);
    return () => {
      alive = false;
      clearTimeout(guard);
      window.removeEventListener('resize', onResize);
    };
  }, [build, enter]);

  const rest = useCallback(() => {
    const inn = bombInRef.current;
    if (inn) inn.style.transform = '';
    if (glowRef.current) glowRef.current.style.opacity = '0';
    if (wickRef.current) wickRef.current.style.strokeDasharray = '1 1';
    if (emberRef.current) emberRef.current.style.opacity = '0';
  }, []);

  const burn = useCallback((p) => {
    const inn = bombInRef.current;
    const amp = 1 + p * 7.5;
    const jx = (Math.random() - 0.5) * 2 * amp;
    const jy = (Math.random() - 0.5) * 2 * amp;
    if (inn) inn.style.transform = `translate(${jx.toFixed(1)}px, ${jy.toFixed(1)}px) scale(${(1 + 0.13 * p).toFixed(3)})`;
    if (glowRef.current) glowRef.current.style.opacity = String(0.35 + 0.55 * p);
    const wick = wickRef.current;
    const ember = emberRef.current;
    if (wick && ember) {
      const left = Math.max(0, 1 - p);
      wick.style.strokeDasharray = `${left} 1`;
      const L = wick.getTotalLength();
      const pt = wick.getPointAtLength(left * L);
      ember.setAttribute('transform', `translate(${pt.x.toFixed(2)} ${pt.y.toFixed(2)})`);
      ember.style.opacity = '1';
    }
  }, []);

  const fire = useCallback(
    (x, y, now) => {
      hold.current = null;
      setHolding(false);
      rest();
      const S = surf.current;
      if (!S || S.state !== 'intact') return;
      S.explode(x, y, now);
      fx.current.push({ x, y, t0: now });
      nudge.current = 200;
    },
    [rest],
  );

  // the loop, with a guard: if it never ticks (hidden document, no rAF), the sheet is removed
  useEffect(() => {
    if (!ready) return undefined;
    let raf = 0;
    let last = performance.now();
    const guard = setTimeout(() => {
      if (!ticked.current) goneRef.current();
    }, 2200);
    const loop = (now) => {
      raf = window.requestAnimationFrame(loop);
      ticked.current = true;
      const dt = Math.min(64, now - last);
      last = now;
      const canvas = canvasRef.current;
      const S = surf.current;
      if (!canvas || !S) return;
      const { W, H, dpr } = size.current;
      const ctx = canvas.getContext('2d');
      S.update(now, dt);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      S.draw(ctx, now);
      // plaster dust: a pale bloom that opens and thins
      fx.current = fx.current.filter((f) => now - f.t0 < 700);
      for (const f of fx.current) {
        const p = (now - f.t0) / 700;
        const rad = 40 + p * S.s * 3.2;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, rad);
        g.addColorStop(0, `rgba(255,252,246,${0.55 * (1 - p)})`);
        g.addColorStop(0.55, `rgba(255,252,246,${0.22 * (1 - p)})`);
        g.addColorStop(1, 'rgba(255,252,246,0)');
        ctx.fillStyle = g;
        ctx.fillRect(f.x - rad, f.y - rad, rad * 2, rad * 2);
      }
      const stage = stageRef.current;
      if (stage) {
        if (nudge.current > 0) {
          nudge.current -= dt;
          const k = Math.max(0, nudge.current / 200) * 3.5;
          stage.style.transform = `translate(${((Math.random() - 0.5) * k).toFixed(1)}px, ${((Math.random() - 0.5) * k).toFixed(1)}px)`;
        } else if (stage.style.transform) {
          stage.style.transform = '';
        }
      }
      if (S.state === 'gone') {
        window.cancelAnimationFrame(raf);
        goneRef.current();
        return;
      }
      if (hold.current) {
        const p = Math.min(1, (now - hold.current.t0) / FUSE_MS);
        burn(p);
        if (p >= 1) fire(hold.current.x, hold.current.y, now);
      }
    };
    raf = window.requestAnimationFrame(loop);
    return () => {
      clearTimeout(guard);
      window.cancelAnimationFrame(raf);
    };
  }, [ready, burn, fire]);

  // the bomb follows the pointer; press and hold lights it
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return undefined;
    const place = (e) => {
      const b = bombRef.current;
      if (b) b.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    const move = (e) => {
      place(e);
      setSeen(true);
      if (hold.current) {
        hold.current.x = e.clientX;
        hold.current.y = e.clientY;
      }
    };
    const down = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      if (e.target && e.target.closest && e.target.closest('button, a')) return;
      const S = surf.current;
      if (!S || S.state !== 'intact') return;
      place(e);
      setSeen(true);
      hold.current = { x: e.clientX, y: e.clientY, t0: performance.now() };
      setHolding(true);
    };
    const up = () => {
      if (hold.current) {
        hold.current = null;
        setHolding(false);
        rest();
      }
    };
    window.addEventListener('pointermove', move, { passive: true });
    stage.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    window.addEventListener('blur', up);
    return () => {
      window.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      window.removeEventListener('blur', up);
    };
  }, [ready, rest]);

  return (
    <div className={`v17-cover${holding ? ' holding' : ''}`}>
      <div className="v17-stage" ref={stageRef}>
        <canvas ref={canvasRef} className="v17-sheet" aria-hidden="true" />
        <button type="button" className="v17-skip" onClick={() => goneRef.current()}>
          Skip
        </button>
      </div>
      <div className={`v17-bomb${seen ? ' seen' : ''}`} ref={bombRef} aria-hidden="true">
        <div className="v17-bomb-in" ref={bombInRef}>
          <div className="v17-glow" ref={glowRef} />
          <svg viewBox="0 0 56 56" width="56" height="56">
            <path d="M33 20 C 37 13, 43 15, 50 6" fill="none" stroke="rgba(27,27,25,0.14)" strokeWidth="2" strokeLinecap="round" />
            <path
              ref={wickRef}
              d="M33 20 C 37 13, 43 15, 50 6"
              fill="none"
              stroke="#8c8983"
              strokeWidth="2"
              strokeLinecap="round"
              pathLength="1"
              style={{ strokeDasharray: '1 1' }}
            />
            <rect x="28" y="15" width="8" height="7" rx="1.5" fill="#44423e" transform="rotate(-32 32 18.5)" />
            <circle cx="24" cy="32" r="14" fill="#1c1c1a" />
            <circle cx="19" cy="27" r="3.5" fill="rgba(255,255,255,0.12)" />
            <g ref={emberRef} style={{ opacity: 0 }}>
              <circle r="6" fill="rgba(255,150,60,0.35)" />
              <circle r="2.4" fill="#ff9a3c" />
              <circle r="1" fill="#fff3d6" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
// The page underneath.
// ---------------------------------------------------------------------------------------------
function split(title) {
  const i = title.indexOf(':');
  return i > 0 ? title.slice(0, i) : title;
}

function Ext({ href, children }) {
  if (!href) return null;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

function Page({ onReseal, canReseal }) {
  const picks = useMemo(() => {
    const all = [...projects.aiMl, ...projects.gameDesign, ...projects.misc];
    return PICKS.map((id) => all.find((p) => p.id === id)).filter(Boolean);
  }, []);
  const year = new Date().getFullYear();

  return (
    <div className="v17-page">
      <header className="v17-top">
        <a className="v17-brand" href="#top">
          Pranav Mishra
        </a>
        <nav className="v17-nav mono" aria-label="Sections">
          <a href="#work">Work</a>
          <a href="#papers">Papers</a>
          <a href="#experience">Experience</a>
          <a href="#interests">Interests</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main id="top">
        <section className="v17-intro">
          <p className="v17-lede">{INTRO}</p>
          <p className="v17-meta mono">
            {contactInfo.location} · <a href={`mailto:${contactInfo.email.personal}`}>{contactInfo.email.personal}</a>
          </p>
        </section>

        <section className="v17-sec" id="work">
          <div className="v17-label mono">
            <span>Work</span>
            <span className="v17-sub">{picks.length} of many</span>
          </div>
          <ol className="v17-list">
            {picks.map((p, i) => {
              const c = PROJECT_COPY[p.id] || {};
              const img = getImageWithFallback(p.mainImage, 'ai-ml');
              return (
                <li className="v17-row" key={p.id}>
                  <div className="v17-row-txt">
                    <div className="v17-kicker mono">
                      {String(i + 1).padStart(2, '0')} — {c.kicker || p.category}
                    </div>
                    <h3>{c.name || split(p.title)}</h3>
                    <p>{c.body || p.description}</p>
                    <div className="v17-tags mono">{(c.tags || p.techStack.slice(0, 4)).join(' · ')}</div>
                    <div className="v17-links mono">
                      <Ext href={p.githubLink}>Code</Ext>
                      <Ext href={p.demoLink}>Demo</Ext>
                      {p.websiteLink && p.websiteLink !== p.demoLink ? <Ext href={p.websiteLink}>Site</Ext> : null}
                    </div>
                  </div>
                  <a className="v17-thumb" href={p.demoLink || p.websiteLink || p.githubLink} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
                    <img src={img} alt="" loading="lazy" />
                  </a>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="v17-sec" id="papers">
          <div className="v17-label mono">
            <span>Papers</span>
            <span className="v17-sub">{publications.length}</span>
          </div>
          <ol className="v17-list">
            {publications.map((pub) => (
              <li className="v17-paper" key={pub.id}>
                <div className="v17-kicker mono">
                  {pub.venue} · {pub.status.toLowerCase()} · {pub.publicationDate}
                </div>
                <h3>{pub.title}</h3>
                <p className="v17-authors mono">
                  {pub.authors.map((a, i) => (
                    <span key={a} className={a.startsWith('Pranav') ? 'me' : ''}>
                      {a}
                      {i < pub.authors.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
                <p>{PAPER_NOTES[pub.id]}</p>
                <div className="v17-links mono">
                  <Ext href={pub.pdfLink}>PDF</Ext>
                  <Ext href={pub.codeLink}>Code</Ext>
                  <Ext href={pub.doi}>DOI</Ext>
                  {pub.citationCount > 0 ? <span className="v17-cite">{pub.citationCount} citations</span> : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="v17-sec" id="experience">
          <div className="v17-label mono">
            <span>Experience</span>
          </div>
          <ol className="v17-list">
            {experiences.map((e) => (
              <li className="v17-job" key={e.id}>
                <div className="v17-when mono">{e.duration}</div>
                <div>
                  <h3>
                    {e.title} <span className="v17-at">at {e.company}</span>
                  </h3>
                  <div className="v17-kicker mono">
                    {e.location} · {e.workMode} · {e.employmentType}
                  </div>
                  <p>{EXPERIENCE_COPY[e.id]}</p>
                  {e.links && e.links.website ? (
                    <div className="v17-links mono">
                      <Ext href={e.links.website}>{e.company}</Ext>
                    </div>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="v17-sec" id="interests">
          <div className="v17-label mono">
            <span>Interests</span>
          </div>
          <div>
            <div className="v17-slots">
              {['Books', 'Films', 'Games'].map((n) => (
                <div className="v17-slot" key={n}>
                  <span className="mono">{n}</span>
                  <span className="v17-dash" aria-hidden="true">
                    —
                  </span>
                </div>
              ))}
            </div>
            <p className="v17-note">{INTERESTS_LINE}</p>
          </div>
        </section>

        <section className="v17-sec" id="contact">
          <div className="v17-label mono">
            <span>Contact</span>
          </div>
          <ul className="v17-contact mono">
            <li>
              <a href={`mailto:${contactInfo.email.personal}`}>{contactInfo.email.personal}</a>
            </li>
            <li>
              <a href={`mailto:${contactInfo.email.academic}`}>{contactInfo.email.academic}</a>
            </li>
            <li>
              <Ext href={contactInfo.github}>GitHub</Ext>
            </li>
            <li>
              <Ext href={contactInfo.linkedin}>LinkedIn</Ext>
            </li>
            <li>
              <Ext href={contactInfo.googleScholar}>Google Scholar</Ext>
            </li>
            <li>
              <Ext href={contactInfo.huggingFace}>Hugging Face</Ext>
            </li>
            <li>
              <a href="/resume">Resume →</a>
            </li>
          </ul>
        </section>
      </main>

      <footer className="v17-foot mono">
        <span>
          © {year} {contactInfo.name}
        </span>
        {canReseal ? (
          <button type="button" className="v17-reseal" onClick={onReseal}>
            Cover it again
          </button>
        ) : null}
      </footer>
    </div>
  );
}

// ---------------------------------------------------------------------------------------------
export default function V17() {
  const reduced = useMemo(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const [sealed, setSealed] = useState(!reduced);
  const [enter, setEnter] = useState(false);

  useEffect(() => {
    document.title = 'Pranav Mishra';
  }, []);

  const reseal = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    setEnter(true);
    setSealed(true);
  }, []);

  return (
    <div className={`v17${sealed ? ' sealed' : ''}`}>
      <Page onReseal={reseal} canReseal={!reduced} />
      {sealed ? <Cover onGone={() => setSealed(false)} enter={enter} /> : null}
    </div>
  );
}
