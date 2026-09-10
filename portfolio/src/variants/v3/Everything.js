// Variant 3 — "See everything". An overlay, not a route: the complete set of
// projects and the three papers, narrowed by tag chips. No search box.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { allProjects, papers } from './content';
import { tagList } from './copy';

const ext = { target: '_blank', rel: 'noopener noreferrer' };

export default function Everything({ open, onClose }) {
  const [tag, setTag] = useState(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prev = document.activeElement;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('v3-locked');
    if (closeRef.current) closeRef.current.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('v3-locked');
      if (prev && prev.focus) prev.focus();
    };
  }, [open, onClose]);

  const items = useMemo(() => {
    const all = [...allProjects, ...papers];
    return tag ? all.filter((it) => it.tags.includes(tag)) : all;
  }, [tag]);

  if (!open) return null;
  const total = allProjects.length + papers.length;

  return (
    <div className="v3-every-wrap" role="presentation">
      <button type="button" className="v3-scrim" aria-label="Close" onClick={onClose} />
      <section className="v3-every" role="dialog" aria-modal="true" aria-labelledby="v3-every-title">
        <header className="v3-every-head">
          <div>
            <h2 id="v3-every-title">Everything</h2>
            <p className="v3-every-count">{items.length} of {total}</p>
          </div>
          <div className="v3-chips" role="group" aria-label="Filter by tag">
            <button type="button" className={`v3-chip${tag === null ? ' is-on' : ''}`} onClick={() => setTag(null)}>All</button>
            {tagList.map((t) => (
              <button type="button" key={t.key} className={`v3-chip${tag === t.key ? ' is-on' : ''}`} onClick={() => setTag(t.key)}>{t.label}</button>
            ))}
          </div>
          <button type="button" ref={closeRef} className="v3-close" onClick={onClose} aria-label="Close">×</button>
        </header>
        <ul className="v3-every-grid">
          {items.map((it) => (
            <li key={`${it.kind}-${it.id}`} className={`v3-card${it.kind === 'paper' ? ' is-paper' : ''}`}>
              {it.kind === 'project' ? (
                <a href={it.href || it.githubLink} {...ext} className="v3-card-link">
                  <span className={`v3-card-shot${it.square ? ' is-square' : ''}`}><img src={it.image} alt="" loading="lazy" /></span>
                  <span className="v3-card-name">{it.name}</span>
                  <span className="v3-card-line">{it.line}</span>
                  <span className="v3-card-cta">{it.cta}</span>
                </a>
              ) : (
                <div className="v3-card-link">
                  <span className={`v3-status${it.accepted ? ' is-accepted' : ''}`}>{it.statusLabel}</span>
                  <span className="v3-card-name">{it.title}</span>
                  <span className="v3-card-line">{it.line}</span>
                  <span className="v3-card-cta">
                    <span className="v3-card-venue">{it.venue}</span>
                    {it.pdfLink && <a href={it.pdfLink} {...ext}>PDF</a>}
                    {it.codeLink && <a href={it.codeLink} {...ext}>Code</a>}
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
