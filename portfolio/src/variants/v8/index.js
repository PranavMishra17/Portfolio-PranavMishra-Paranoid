// src/variants/v8/index.js — "Monograph"
//
// A proposal, not a replacement. Mounted at /v8. Imports nothing from src/components.
//
// The idea: his work presented the way a small art book presents an artist. Wide margins,
// numbered figure plates, a running head that tells you which chapter you are in, and type
// doing almost all of the work. Four acts, and it ends rather than trailing off.
//
// The memorable device is the plate numbering — fig. 01 through fig. 06 — and the fact that
// the screenshots are finally shown at a size worth looking at.

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { projects, contactInfo, getImageWithFallback } from '../../data/projects';
import experiences from '../../data/experience';
import { publications } from '../../data/publications';
import './v8.css';

/* ── data ─────────────────────────────────────────────────────────────────── */

const BUCKET = [
  ['aiMl', 'AI / ML'],
  ['gameDesign', 'Games & XR'],
  ['misc', 'Other'],
];

function useAllProjects() {
  return useMemo(() => {
    const out = [];
    BUCKET.forEach(([key, label]) => {
      (projects[key] || []).forEach((p) => {
        out.push({ ...p, bucket: label, live: Boolean(p.websiteLink || p.demoLink) });
      });
    });
    return out;
  }, []);
}

const PLATES = [
  { id: 'stellarium', name: 'Stellarium',       sub: 'Extended reality — 2024',
    say: 'A hundred and seven thousand astronomical objects, rendered inside CAVE2, a room whose walls are screens. The astronomy was never the difficulty. Holding real-time frame rates while that many objects are up and a person is physically turning their head is the difficulty.' },
  { id: 'snaider-cut', name: 'SnAIder-Cut',      sub: 'Mixed reality — 2024 — won MIT XR',
    say: 'You say what you want changed and the augmented room changes around you while you are standing in it. Spatial mapping to read the room, gestures to take the instruction, and a rendering budget tight enough that none of it feels like waiting.' },
  { id: 'equity-project', name: 'EQUITY',   sub: 'Medical simulation — 2024',
    say: 'A virtual patient in Unreal Engine, built so researchers can study how doctors treat people differently. The facial animation is good enough that clinicians respond to it as a person, which is the entire point.' },
  { id: 'big5-agents', name: 'Big5-Agents',      sub: 'Research code — 2025',
    say: 'Six teamwork behaviours taken out of organisational psychology and built as switchable mechanisms between agents, so you can turn each one off and find out which was actually carrying the result.' },
  { id: 'snakeai-mlops', name: 'SnakeAI-MLOps',    sub: 'Reinforcement learning — 2025 — live',
    say: 'Four ways of learning the same game, racing each other. Gameplay in C++, training in PyTorch, inference back through LibTorch, and a pipeline that retrains and redeploys without me touching it.' },
  { id: 'virtual-van-gogh', name: 'Virtual Van Gogh', sub: 'Web3 — 2023 — first at HINT 5.0',
    say: 'A museum you can walk through, where the paintings are on a chain. The interesting engineering was keeping ownership state and the walkable world agreeing with one another.' },
];

const VALUES = [
  { k: 'Email arriving as a text message', was: '90 s', now: '3 s' },
  { k: 'Security codes, ninetieth percentile', was: '189 s', now: '0' },
  { k: 'Model cost per user in the rules engine', was: null, now: '−30%' },
  { k: 'Rules made just by talking to it', was: null, now: '98%' },
];

const ROLE_LINE = {
  'wheelprice-intern': 'Computer vision for automotive part fitment, and a content system that took the site to ten or twenty thousand readers a day.',
  'research-software-engineer-uic': 'Virtual patients in Unreal Engine with a Python service behind them, and an audio pipeline that reached 98.52% accuracy with real-time inference.',
  'bipolar-factory-intern': 'A streaming platform on the MERN stack with an AWS pipeline behind it, and in-game chat in Unity that moved retention about ten percent.',
};

const PAPER_LINE = {
  metarag: 'Retrieval improves if you let a model write metadata about each chunk before you store it. 82.5% precision against 73.3% for the content alone.',
  teammedagents: 'The Big Five teamwork model out of organisational psychology, built as real mechanisms between agents. Better on seven of eight medical benchmarks.',
  'slm-teammedagents': 'Whether several small models talking to each other can stand in for one large one on medical images, and what that trade costs.',
};

const ACTS = [
  { id: 'title', name: 'Title' },
  { id: 'work',  name: 'The work' },
  { id: 'plates', name: 'Plates' },
  { id: 'colophon', name: 'Colophon' },
];

/* ── a reveal that cannot get stuck ───────────────────────────────────────── */
// IntersectionObserver does not fire in a hidden document, and a page that never reveals is
// worse than one that never animates. So: observe, but also give up and show after a moment.
function useRevealed(ref) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    let io;
    if (el && typeof IntersectionObserver !== 'undefined' && window.innerHeight > 0) {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }),
        { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
      );
      io.observe(el);
    }
    const bail = setTimeout(() => setOn(true), 1400);
    return () => { if (io) io.disconnect(); clearTimeout(bail); };
  }, [ref]);
  return on;
}

function Rise({ children, className, delay = 0 }) {
  const reduced = useReducedMotion();
  const ref = useRef(null);
  const on = useRevealed(ref);

  // requestAnimationFrame is paused in a hidden document, so a component that mounts hidden
  // would keep whatever `initial` set — i.e. opacity 0, forever. Only opt into the entrance
  // when we are actually visible; otherwise just render the finished state.
  const canAnimate =
    !reduced && typeof document !== 'undefined' && !document.hidden && window.innerHeight > 0;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={canAnimate ? { opacity: 0, y: 20 } : false}
      animate={on || !canAnimate ? { opacity: 1, y: 0 } : {}}
      transition={
        canAnimate
          ? { type: 'spring', stiffness: 240, damping: 30, mass: 1.2, delay }
          : { duration: 0 }
      }
    >
      {children}
    </motion.div>
  );
}

/* ── overlay ──────────────────────────────────────────────────────────────── */

function AllProjects({ all, onClose }) {
  const [tag, setTag] = useState('All');
  const tags = ['All', 'AI / ML', 'Games & XR', 'Other', 'Live'];
  const shown = all.filter((p) => (tag === 'All' ? true : tag === 'Live' ? p.live : p.bucket === tag));

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <>
      <div className="v8-scrim" onClick={onClose} />
      <div className="v8-modal" role="dialog" aria-modal="true" aria-label="Every project">
        <div className="v8-mhead">
          <div className="row">
            <h2>The complete list</h2>
            <button className="v8-shut" onClick={onClose}>Close</button>
          </div>
          <div className="v8-chips">
            {tags.map((t) => (
              <button key={t} aria-pressed={t === tag} onClick={() => setTag(t)}>{t}</button>
            ))}
          </div>
          <p className="v8-count">{shown.length} of {all.length}</p>
        </div>
        <div className="v8-mbody">
          <div className="v8-grid">
            {shown.map((p) => (
              <article className="v8-card" key={p.id}>
                <div className="shot">
                  <img src={getImageWithFallback(p.mainImage, 'ai-ml')} alt={p.title} loading="lazy" />
                </div>
                <h4>{p.title}</h4>
                <p className="tag">{p.bucket}{p.live && <em> — live</em>}</p>
                <p>{p.category}</p>
                <p className="lk">
                  {p.demoLink && <a href={p.demoLink} target="_blank" rel="noreferrer">Watch</a>}
                  {p.githubLink && <a href={p.githubLink} target="_blank" rel="noreferrer">Source</a>}
                  {p.websiteLink && <a href={p.websiteLink} target="_blank" rel="noreferrer">Visit</a>}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── the whole thing ──────────────────────────────────────────────────────── */

export default function V8() {
  const all = useAllProjects();
  const [showAll, setShowAll] = useState(false);
  const [act, setAct] = useState(0);
  const actRefs = useRef([]);

  const plates = useMemo(
    () => PLATES.map((f) => {
      const found = all.find((p) => p.id === f.id);
      return found ? { ...found, ...f } : null;
    }).filter(Boolean),
    [all]
  );

  const history = experiences.filter((e) => e.id !== 'alfred-founding-llm');

  // running head follows the scroll, on a plain listener — no observer to get stuck
  const onScroll = useCallback(() => {
    const top =
      window.scrollY ||
      (document.scrollingElement && document.scrollingElement.scrollTop) ||
      document.documentElement.scrollTop ||
      0;
    const y = top + window.innerHeight * 0.34;
    let i = 0;
    actRefs.current.forEach((el, idx) => { if (el && el.offsetTop <= y) i = idx; });
    setAct(i);
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    const t = setTimeout(onScroll, 600);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      clearTimeout(t);
    };
  }, [onScroll]);

  const setRef = (i) => (el) => { actRefs.current[i] = el; };

  return (
    <div className="v8">
      <div className="v8-head">
        <span>Pranav Pushkar Mishra</span>
        <span className="now">{ACTS[act].name}</span>
      </div>

      <div className="v8-wrap">

        {/* ── act one ── */}
        <section className="v8-title" ref={setRef(0)}>
          <h1>Pranav<br /><em>Mishra</em></h1>
          <div className="v8-rule" />
          <p className="say">I build the parts of AI systems that have to be right — which is usually the unglamorous half.</p>
          <p className="meta">
            Founding LLM Engineer, Alfred_ — New York City<br />
            Computer Science, University of Illinois Chicago<br />
            {contactInfo.location}
          </p>
        </section>

        {/* ── act two ── */}
        <section className="v8-act" ref={setRef(1)}>
          <Rise>
            <p className="v8-actno">One — the work</p>
            <h2 className="v8-h2">Five thousand people rely on it, so it cannot be wrong.</h2>
            <div className="v8-col">
              <p>
                Alfred_ runs people’s email, calendar and daily obligations over text message,
                chat and voice. I own the side where being wrong is expensive.
              </p>
              <p>
                <b>I rebuilt its working memory so it cannot invent a fact about your inbox</b>,
                enforced by tests rather than by hoping the model behaves. I replaced a model call
                on every message in the rules engine with a matcher that simply decides. And I
                moved notifications off polling, which is where these came from.
              </p>
            </div>
          </Rise>

          <Rise delay={0.05}>
            <div className="v8-table">
              {VALUES.map((v) => (
                <div className="v8-tr" key={v.k}>
                  <span className="k">{v.k}</span>
                  <span className="was">{v.was || ''}</span>
                  <span className="now">{v.now}</span>
                </div>
              ))}
            </div>
          </Rise>

          <Rise delay={0.08}>
            <div className="v8-hist">
              {history.map((e) => (
                <div className="v8-hrow" key={e.id}>
                  <span className="yr">{e.duration}</span>
                  <div>
                    <h4>{e.title}, {e.company}</h4>
                    <p>{ROLE_LINE[e.id] || e.description[0]}</p>
                  </div>
                </div>
              ))}
            </div>
          </Rise>
        </section>

        {/* ── act three ── */}
        <section className="v8-act" ref={setRef(2)}>
          <Rise>
            <p className="v8-actno">Two — plates</p>
            <h2 className="v8-h2">Six of about thirty.</h2>
          </Rise>

          <div className="v8-plates">
            {plates.map((p, i) => (
              <Rise className="v8-fig" key={p.id}>
                <div className="shot">
                  <img src={getImageWithFallback(p.mainImage, 'ai-ml')} alt={p.title} loading="lazy" />
                </div>
                <div className="cap">
                  <span className="no">fig. {String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{p.name || p.title}</h3>
                    <p className="sub">{p.sub}</p>
                    <p className="say">{p.say}</p>
                    <p className="lk">
                      {p.demoLink && <a href={p.demoLink} target="_blank" rel="noreferrer">Watch it run</a>}
                      {p.websiteLink && <a href={p.websiteLink} target="_blank" rel="noreferrer">Use it</a>}
                      {p.githubLink && <a href={p.githubLink} target="_blank" rel="noreferrer">Source</a>}
                    </p>
                  </div>
                </div>
              </Rise>
            ))}
          </div>

          <p className="v8-all">
            <button onClick={() => setShowAll(true)}>See all {all.length}</button>
          </p>
        </section>

        {/* ── act four ── */}
        <section className="v8-act" ref={setRef(3)}>
          <Rise>
            <p className="v8-actno">Three — colophon</p>
            <h2 className="v8-h2">Written, won, and otherwise.</h2>
          </Rise>

          <Rise delay={0.04}>
            <div className="v8-two">
              <div>
                {publications.map((p) => (
                  <div className="v8-entry" key={p.id}>
                    <p className={'st' + (p.status === 'ACCEPTED' ? ' acc' : '')}>
                      {p.status === 'ACCEPTED' ? 'Accepted' : p.status}{p.venue ? ` — ${p.venue}` : ''}
                    </p>
                    <h4>{p.title}</h4>
                    <p>{PAPER_LINE[p.id]}</p>
                    {p.pdfLink && <p style={{ marginTop: '.45rem' }}><a href={p.pdfLink} target="_blank" rel="noreferrer">Read it</a></p>}
                  </div>
                ))}
              </div>

              <div>
                <div className="v8-entry">
                  <p className="st acc">Two I am pleased about</p>
                  <h4>MIT XR, 2024. First at HINT 5.0.</h4>
                  <p>For SnAIder-Cut and for the Van Gogh museum. Also four citations, which is a small number I think about more than I should.</p>
                </div>
                <div className="v8-entry">
                  <p className="st">Off the clock</p>
                  <h4>I read, I watch, I play.</h4>
                  <p>Not entirely separate from the work, since half of what I have built is a world of some kind.</p>
                  <div className="v8-slots">
                    <div className="v8-slot"><span>Reading</span><b>—</b></div>
                    <div className="v8-slot"><span>Watching</span><b>—</b></div>
                    <div className="v8-slot"><span>Playing</span><b>—</b></div>
                  </div>
                  <p className="v8-note">Left empty on purpose. Yours to fill in.</p>
                </div>
              </div>
            </div>
          </Rise>

          <div className="v8-foot">
            <span>{contactInfo.location}</span>
            <a href={contactInfo.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={contactInfo.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href={contactInfo.huggingFace} target="_blank" rel="noreferrer">Hugging Face</a>
            <a href={`mailto:${contactInfo.email.personal}`}>{contactInfo.email.personal}</a>
          </div>
        </section>
      </div>

      {showAll && <AllProjects all={all} onClose={() => setShowAll(false)} />}
    </div>
  );
}
