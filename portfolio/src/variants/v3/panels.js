// Variant 3 — the content, as components. Each panel is rendered once in its
// section and again inside the room (monitor A, monitor B, laptop, wall screen).
// One source of truth, two places on the page.
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { arrival, links, tagList } from './copy';
import { currentRole, pastRoles, featured, papers, contact, stats } from './content';

const ext = { target: '_blank', rel: 'noopener noreferrer' };

export function AboutPanel({ inRoom }) {
  return (
    <div className="v3-about">
      {inRoom && <p className="v3-kicker">Pranav Pushkar Mishra</p>}
      <p className="v3-headline">{arrival.headline}</p>
      <p className="v3-sub">{arrival.sub}</p>
      <ul className="v3-reach">
        <li><a href={links.github} {...ext}>GitHub</a></li>
        <li><a href={links.linkedin} {...ext}>LinkedIn</a></li>
        <li><a href={links.huggingface} {...ext}>Hugging Face</a></li>
        <li><a href={contact.googleScholar} {...ext}>Scholar</a></li>
        <li><a href={`mailto:${contact.email.personal}`}>Email</a></li>
        <li><Link to={links.resume}>Resume</Link></li>
      </ul>
    </div>
  );
}

export function WorkPanel({ inRoom }) {
  const r = currentRole;
  const c = r.copy || {};
  return (
    <div className="v3-work">
      <div className="v3-role-head">
        <h3 className="v3-role-title">{r.title}, <a href={r.links && r.links.website} {...ext}>{r.company}</a></h3>
        <p className="v3-role-meta">{r.duration} · {r.location}</p>
      </div>
      <p className="v3-lede">{c.lede}</p>
      {c.measures && (
        <dl className="v3-measures">
          {c.measures.map((m) => (
            <div className="v3-measure" key={m.label}>
              <dt>{m.label}</dt>
              <dd className="v3-measure-value">{m.value}</dd>
              <dd className="v3-measure-note">{m.note}</dd>
            </div>
          ))}
        </dl>
      )}
      <h4 className="v3-before-head">Before, and alongside</h4>
      <div className="v3-before">
        {pastRoles.map((p) => (
          <div className="v3-before-row" key={p.id}>
            <div className="v3-before-who">
              <p className="v3-before-company">{p.company}</p>
              <p className="v3-before-title">{p.title}</p>
              <p className="v3-before-meta">{p.duration}<br />{p.location}{p.workMode ? `, ${p.workMode.toLowerCase()}` : ''}</p>
            </div>
            <p className="v3-before-line">{(p.copy && p.copy.line) || p.description[0]}</p>
          </div>
        ))}
      </div>
      {!inRoom && (
        <p className="v3-aside">Full detail is on the <Link to={links.resume}>resume</Link>.</p>
      )}
    </div>
  );
}

export function PapersPanel() {
  return (
    <div className="v3-papers">
      {papers.map((p) => (
        <article className="v3-paper" key={p.id}>
          <div className="v3-paper-status">
            <span className={`v3-status${p.accepted ? ' is-accepted' : ''}`}>{p.statusLabel}</span>
            <span className="v3-paper-venue">{p.venue}</span>
            {p.citationCount > 0 && <span className="v3-paper-cites">{p.citationCount} citation{p.citationCount === 1 ? '' : 's'}</span>}
          </div>
          <h3 className="v3-paper-title">{p.title}</h3>
          <p className="v3-paper-line">{p.line}</p>
          <p className="v3-paper-links">
            {p.pdfLink && <a href={p.pdfLink} {...ext}>PDF</a>}
            {p.codeLink && <a href={p.codeLink} {...ext}>Code</a>}
            {p.doi && <a href={p.doi} {...ext}>DOI</a>}
          </p>
        </article>
      ))}
      <p className="v3-aside">{stats.totalPublications} papers, {stats.totalCitations} citations so far.</p>
    </div>
  );
}

// Ikeda §4: a fixed, static set, revealing on hover. Names on the left,
// one still viewer on the right that shows whichever you are on.
export function ProjectsPanel({ onSeeEverything, inRoom }) {
  const [active, setActive] = useState(0);
  const cur = featured[active] || featured[0];
  return (
    <div className={`v3-works${inRoom ? ' in-room' : ''}`}>
      <ol className="v3-work-list">
        {featured.map((p, i) => (
          <li key={p.id} className={i === active ? 'is-on' : ''}>
            <a
              href={p.href}
              {...ext}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="v3-work-item"
            >
              <span className="v3-work-name">{p.name}</span>
              <span className="v3-work-cta">{p.cta}</span>
              <span className="v3-work-line">{p.line}</span>
              <span className="v3-work-tags">{p.tags.map((t) => (tagList.find((x) => x.key === t) || {}).label).filter(Boolean).join(', ')}</span>
              <span className={`v3-work-thumb${p.square ? ' is-square' : ''}`} aria-hidden="true">
                <img src={p.image} alt="" loading="lazy" />
              </span>
            </a>
          </li>
        ))}
      </ol>
      <div className="v3-viewer" aria-hidden="true">
        <div className={`v3-viewer-frame${cur.square ? ' is-square' : ''}`}>
          {featured.map((p, i) => (
            <img key={p.id} src={p.image} alt="" className={i === active ? 'is-on' : ''} loading={i === 0 ? 'eager' : 'lazy'} />
          ))}
        </div>
        <p className="v3-viewer-cap"><span>{cur.name}</span><span>{cur.category}</span></p>
      </div>
      <div className="v3-works-foot">
        <button type="button" className="v3-btn" onClick={onSeeEverything}>See everything</button>
        <span className="v3-aside">Seven of about forty. The rest are behind that button, by tag.</span>
      </div>
    </div>
  );
}
