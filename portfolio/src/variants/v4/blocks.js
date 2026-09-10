// Variant 4 — the content blocks. Each is rendered once in the page and again
// inside the room (monitors, laptop, wall screen). One source, two places.
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { alfred, roles as roleCopy, papers as paperCopy, statusLabel, about, trophies } from "./copy";
import { currentRole, earlierRoles, pickedProjects, papers, links, shortTitle, primaryLink } from "./data";

/* ---------- The work: Alfred_ measurements + earlier roles ---------- */

export function WorkRegister({ compact = false }) {
  return (
    <div className={`v4-work${compact ? " is-compact" : ""}`}>
      <div className="v4-role-head">
        <h3 className="v4-h3">
          {currentRole.company}
          {links.alfred && (
            <a className="v4-quiet-link" href={links.alfred} target="_blank" rel="noopener noreferrer">
              get-alfred.ai
            </a>
          )}
        </h3>
        <p className="v4-role-meta">
          {currentRole.title}. {currentRole.duration}, {currentRole.location}.
        </p>
      </div>
      <p className="v4-body">{alfred.intro}</p>

      <dl className="v4-register">
        {alfred.measures.map((m) => (
          <div className="v4-cell" key={m.label}>
            <dt>{m.label}</dt>
            <dd>
              <span className="v4-num">
                {m.to ? (
                  <>
                    <s>{m.value}</s> <b>{m.to}</b>
                  </>
                ) : (
                  <b>{m.value}</b>
                )}
              </span>
              <span className="v4-cell-note">{m.note}</span>
            </dd>
          </div>
        ))}
      </dl>
      <p className="v4-body v4-aside">{alfred.aside}</p>

      <h4 className="v4-h4">Before that</h4>
      <ol className="v4-roles">
        {earlierRoles.map((r) => (
          <li key={r.id}>
            <div className="v4-role-line">
              <span className="v4-role-company">
                {r.company}
                <span className="v4-role-title">{r.title}</span>
              </span>
              <span className="v4-role-when">
                {r.duration}
                <br />
                {r.location}
                {r.workMode === "Remote" ? ", remote" : ""}
              </span>
            </div>
            <p className="v4-body v4-role-desc">{roleCopy[r.id]}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Built: six projects, static, revealing on hover ---------- */

export function ProjectCard({ p, wide = false }) {
  const [src, setSrc] = useState(p.image);
  const link = primaryLink(p);
  return (
    <article className={`v4-proj${p.square ? " is-square" : ""}${wide ? " is-wide" : ""}`}>
      <div className="v4-shot">
        <img src={src} alt="" loading="lazy" decoding="async" onError={() => src !== p.fallback && setSrc(p.fallback)} />
      </div>
      <div className="v4-proj-text">
        <h4 className="v4-proj-title">{shortTitle(p.title)}</h4>
        <p className="v4-proj-line">{p.line}</p>
        <div className="v4-proj-links">
          {link && (
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
            </a>
          )}
          {p.githubLink && link && link.href !== p.githubLink && (
            <a href={p.githubLink} target="_blank" rel="noopener noreferrer">
              Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProjectGrid({ onSeeAll, compact = false }) {
  return (
    <div className={`v4-grid-wrap${compact ? " is-compact" : ""}`}>
      <div className="v4-grid">
        {pickedProjects.map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>
      <p className="v4-seeall">
        <span>Six of about forty.</span>
        <button type="button" className="v4-btn" onClick={onSeeAll}>
          See everything
        </button>
      </p>
    </div>
  );
}

/* ---------- Written: the three papers, quietly ---------- */

export function PaperRow({ pub, compact = false }) {
  const c = paperCopy[pub.id] || {};
  return (
    <li className="v4-paper">
      <div className="v4-paper-top">
        <span className={`v4-status is-${pub.status.replace(/\s+/g, "-").toLowerCase()}`}>
          {statusLabel[pub.status] || pub.status}
        </span>
        <span className="v4-paper-venue">
          {pub.venue}
          {pub.citationCount > 0 ? `, cited ${pub.citationCount} times` : ""}
        </span>
      </div>
      <h4 className="v4-paper-title">{c.short || pub.title}</h4>
      {!compact && <p className="v4-paper-full">{pub.title}</p>}
      <p className="v4-body v4-paper-line">{c.line}</p>
      <div className="v4-proj-links">
        {pub.pdfLink && (
          <a href={pub.pdfLink} target="_blank" rel="noopener noreferrer">
            Read the paper
          </a>
        )}
        {pub.codeLink && (
          <a href={pub.codeLink} target="_blank" rel="noopener noreferrer">
            Code
          </a>
        )}
      </div>
    </li>
  );
}

export function Papers({ compact = false }) {
  return (
    <ol className="v4-papers">
      {papers.map((pub) => (
        <PaperRow key={pub.id} pub={pub} compact={compact} />
      ))}
    </ol>
  );
}

/* ---------- About: the laptop ---------- */

export function About() {
  return (
    <div className="v4-about">
      {about.paras.map((t, i) => (
        <p className="v4-body" key={i}>
          {t}
        </p>
      ))}
      <ul className="v4-linklist">
        <li>
          <a href={`mailto:${links.email}`}>{links.email}</a>
        </li>
        <li>
          <a href={`mailto:${links.academicEmail}`}>{links.academicEmail}</a>
        </li>
        <li>
          <a href={links.github} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </li>
        <li>
          <a href={links.linkedin} target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </li>
        <li>
          <a href={links.huggingface} target="_blank" rel="noopener noreferrer">
            Hugging Face
          </a>
        </li>
        <li>
          <a href={links.scholar} target="_blank" rel="noopener noreferrer">
            Google Scholar
          </a>
        </li>
        <li>
          <Link to="/resume">Resume</Link>
        </li>
      </ul>
    </div>
  );
}

/* ---------- Trophies ---------- */

export function Trophies() {
  return (
    <ul className="v4-trophies">
      {trophies.map((t) => (
        <li key={t.id}>
          <div className="v4-trophy-shot">
            <img src={t.image} alt={t.title} loading="lazy" decoding="async" />
          </div>
          <h4 className="v4-h4">{t.title}</h4>
          <p className="v4-body">
            <b>{t.result}.</b> {t.line}
          </p>
        </li>
      ))}
    </ul>
  );
}
