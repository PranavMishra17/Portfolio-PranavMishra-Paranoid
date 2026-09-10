// Variant 6 — "everything": a popup with tag chips and every project as a card with its image.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ALL_PROJECTS, PAPERS, TAGS } from './copy';

const ENTRIES = [
  ...ALL_PROJECTS.map((p) => ({ id: p.id, title: p.title, line: p.line, tags: p.tags, link: p.link, action: p.action, meta: p.tech.slice(0, 3).join(', '), image: p.image, square: p.square })),
  ...PAPERS.map((p) => ({ id: `paper-${p.id}`, title: p.short, line: p.line, tags: p.tags, link: p.pdf || p.code, action: p.pdf ? 'Paper' : 'Code', meta: `${p.status}, ${p.venue}`, image: '' })),
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
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [open, onClose]);

  const shown = useMemo(() => (tag === 'All' ? ENTRIES : ENTRIES.filter((e) => e.tags.includes(tag))), [tag]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div className="v6-overlay" role="dialog" aria-modal="true" aria-label="Everything" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }}>
          <div className="v6-overlay-in">
            <div className="v6-overlay-top">
              <h2 className="v6-h2">Everything I have made</h2>
              <button type="button" className="v6-close" onClick={onClose} ref={closeRef}>
                Close
              </button>
            </div>
            <div className="v6-chips" role="group" aria-label="Filter by tag">
              {['All', ...TAGS].map((t) => (
                <button key={t} type="button" className={`v6-chip${tag === t ? ' on' : ''}`} aria-pressed={tag === t} onClick={() => setTag(t)}>
                  {t}
                </button>
              ))}
              <span className="v6-count">{shown.length}</span>
            </div>
            <ul className="v6-ogrid">
              {shown.map((e) => (
                <li className="v6-card" key={e.id}>
                  {e.image ? (
                    <div className={`v6-card-img${e.square ? ' sq' : ''}`}>
                      <img src={e.image} alt="" loading="lazy" />
                    </div>
                  ) : (
                    <div className="v6-card-img paper">Paper</div>
                  )}
                  <h3 className="v6-card-t">{e.title}</h3>
                  <p className="v6-card-line">{e.line}</p>
                  <p className="v6-card-meta">{e.meta}</p>
                  {e.link ? (
                    <a className="v6-link" href={e.link} target="_blank" rel="noopener noreferrer">
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
