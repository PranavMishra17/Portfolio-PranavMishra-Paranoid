// Variant 3 — the rail. His name pinned above a vertical line that is the day:
// each section sits at the hour it occupies (measured, not hard-coded), and a
// small sun travels down the line as you scroll, reading the time as it goes.
import React from 'react';
import { Link } from 'react-router-dom';
import { hourAt } from './sky';
import { links } from './copy';

export default function Rail({ stations, fracs, active, onGo }) {
  return (
    <aside className="v3-rail" aria-label="Sections">
      <a className="v3-name" href="#v3-arrival" onClick={(e) => { e.preventDefault(); onGo(0); }}>
        <span>Pranav</span>
        <span>Mishra</span>
      </a>
      <span className="v3-now" aria-hidden="true">{stations[active] ? stations[active].label : ''}</span>

      <div className="v3-day" role="navigation">
        <span className="v3-day-line" aria-hidden="true" />
        <span className="v3-day-sun" aria-hidden="true">
          <i />
          <b data-v3-clock>06:36</b>
        </span>
        {stations.map((s, i) => {
          const f = fracs[i] == null ? i / Math.max(1, stations.length - 1) : fracs[i];
          return (
            <button
              type="button"
              key={s.id}
              className={`v3-station${i === active ? ' is-active' : ''}`}
              style={{ '--f': f }}
              aria-current={i === active ? 'true' : undefined}
              onClick={() => onGo(i)}
            >
              <span className="v3-station-hour">{hourAt(f)}</span>
              <span className="v3-station-name">{s.label}</span>
            </button>
          );
        })}
      </div>

      <nav className="v3-rail-links" aria-label="Elsewhere">
        <a href={links.github} target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href={links.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={links.huggingface} target="_blank" rel="noopener noreferrer">Hugging Face</a>
        <Link to={links.resume}>Resume</Link>
      </nav>
    </aside>
  );
}
