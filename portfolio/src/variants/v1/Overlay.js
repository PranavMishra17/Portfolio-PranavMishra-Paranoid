// Variant 1 — "See everything". A popup, not a page. Tag chips along the top, no search box.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ALL_PROJECTS, PAPERS, TAGS } from './copy';

const ENTRIES = [
  ...PAPERS.map((p) => ({
    id: `paper-${p.id}`,
    title: p.short,
    line: p.line,
    tags: p.tags,
    link: p.pdf || p.code,
    action: p.pdf ? 'Paper' : 'Code',
    meta: `${p.status}, ${p.venue}`,
    image: '',
  })),
  ...ALL_PROJECTS.map((p) => ({
    id: p.id,
    title: p.title,
    line: p.line,
    tags: p.tags,
    link: p.link,
    action: p.action,
    meta: p.tech.slice(0, 3).join(', '),
    image: p.image,
    square: p.square,
  })),
];

export default function Overlay({ open, onClose }) {
  const [tag, setTag] = useState('All');
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    if (closeRef.current) closeRef.current.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const shown = useMemo(() => (tag === 'All' ? ENTRIES : ENTRIES.filter((e) => e.tags.includes(tag))), [tag]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="v1-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Everything I have built or written"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <div className="v1-overlay-in">
            <div className="v1-overlay-top">
              <h2 className="v1-h2">Everything</h2>
              <button type="button" className="v1-close" onClick={onClose} ref={closeRef}>
                Close
              </button>
            </div>
            <div className="v1-chips" role="group" aria-label="Filter by tag">
              {['All', ...TAGS].map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`v1-chip${tag === t ? ' on' : ''}`}
                  aria-pressed={tag === t}
                  onClick={() => setTag(t)}
                >
                  {t}
                </button>
              ))}
              <span className="v1-count">{shown.length} shown</span>
            </div>
            <ul className="v1-ogrid">
              {shown.map((e) => (
                <li className="v1-oentry" key={e.id}>
                  {e.image ? (
                    <div className={`v1-othumb${e.square ? ' sq' : ''}`}>
                      <img src={e.image} alt="" loading="lazy" />
                    </div>
                  ) : (
                    <div className="v1-othumb paper">
                      <span>Paper</span>
                    </div>
                  )}
                  <h3 className="v1-oentry-t">{e.title}</h3>
                  <p className="v1-oentry-line">{e.line}</p>
                  <p className="v1-oentry-meta">{e.meta}</p>
                  {e.link ? (
                    <a className="v1-link" href={e.link} target="_blank" rel="noopener noreferrer">
                      {e.action}
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
