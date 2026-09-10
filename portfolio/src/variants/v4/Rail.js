// Variant 4 — the rail. His name pinned above a single vertical line; the sun
// travels down the line with scroll and carries the hour. Section names sit
// beside it. The hairline near the bottom is the horizon; the sun sinks below
// it as you reach the room. The links live under the horizon.
import React from "react";
import { Link } from "react-router-dom";
import { SECTIONS, KEYS, formatHour } from "./useDay";
import { contact, links } from "./data";

const HORIZON = 0.9; // fraction of the line where the horizon rule sits

function go(e, id) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export default function Rail({ p, active, hour }) {
  const below = p > HORIZON - 0.025;
  const sunTop = `${Math.min(1, p) * 100}%`;
  return (
    <aside className="v4-rail" aria-label="Sections">
      <div className="v4-rail-name">
        <span className="v4-rail-who">{contact.name}</span>
        <span className="v4-rail-what">Founding LLM engineer, Alfred_</span>
        <span className="v4-rail-where">New York, from {contact.location.replace(", USA", "")}</span>
      </div>

      <nav className="v4-rail-nav">
        <div className="v4-rail-track" aria-hidden="true">
          <span className="v4-rail-line" style={{ height: `${HORIZON * 100}%` }} />
          <span className="v4-rail-horizon" style={{ top: `${HORIZON * 100}%` }} />
          <span className={`v4-rail-sun${below ? " is-below" : ""}`} style={{ top: sunTop }} />
          <span className={`v4-rail-hour${below ? " is-below" : ""}`} style={{ top: sunTop }}>
            {formatHour(hour)}
          </span>
        </div>
        <ul className="v4-rail-list">
          {SECTIONS.map((s, i) => (
            <li key={s.id} style={{ top: `${KEYS[i] * 100}%` }}>
              <a href={`#${s.id}`} onClick={(e) => go(e, s.id)} aria-current={active === i ? "true" : undefined}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="v4-rail-foot">
        <a href={links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={links.huggingface} target="_blank" rel="noopener noreferrer">Hugging Face</a>
        <Link to="/resume">Resume</Link>
        <a href={`mailto:${links.email}`}>{links.email}</a>
      </div>
    </aside>
  );
}

// Phone: the rail folds into a bar at the top. Same name, same hour, same sun.
export function RailBar({ p, active, hour }) {
  return (
    <div className="v4-bar">
      <div className="v4-bar-top">
        <span className="v4-bar-who">{contact.name}</span>
        <span className="v4-bar-hour" aria-live="off">
          <i className="v4-bar-sun" style={{ opacity: 1 - Math.max(0, p - 0.85) * 6 }} aria-hidden="true" />
          {formatHour(hour)}
        </span>
      </div>
      <nav className="v4-bar-nav" aria-label="Sections">
        {SECTIONS.map((s, i) => (
          <a key={s.id} href={`#${s.id}`} onClick={(e) => go(e, s.id)} aria-current={active === i ? "true" : undefined}>
            {s.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
