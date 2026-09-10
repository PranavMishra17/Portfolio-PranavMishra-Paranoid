// Variant 1 — screen two. The Alfred_ measurements as a register, then the four roles as compact rows.
// Rendered on the page and again inside the room's first monitor. One source, two places.
import React, { useState } from 'react';
import { ALFRED, MEASUREMENTS, ROLES } from './copy';

export function Measurements() {
  return (
    <dl className="v1-reg">
      {MEASUREMENTS.map((m) => (
        <div className="v1-cell" key={m.what}>
          <dt className="v1-what">{m.what}</dt>
          <dd className="v1-val">
            {m.value}
            {m.unit ? <span className="unit"> {m.unit}</span> : null}
            {m.arrow ? (
              <>
                <span className="to"> to </span>
                <span className="after">{m.arrow}</span>
              </>
            ) : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function History({ compact = false }) {
  const [open, setOpen] = useState(null);
  return (
    <ul className="v1-roles">
      {ROLES.map((r) => {
        const isOpen = open === r.id;
        return (
          <li className={`v1-role${isOpen ? ' open' : ''}`} key={r.id}>
            <button
              type="button"
              className="v1-role-btn"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : r.id)}
            >
              <span className="v1-role-co">
                {r.company}
                {r.current ? <span className="v1-now"> now</span> : null}
              </span>
              <span className="v1-role-when">{r.when}</span>
              <span className="v1-role-title">
                {r.title}, {r.where}
              </span>
            </button>
            <p className="v1-role-line">{r.line}</p>
            {isOpen ? (
              <div className="v1-role-more">
                <ul className="v1-bullets">
                  {r.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
                {r.website ? (
                  <a className="v1-link" href={r.website} target="_blank" rel="noopener noreferrer">
                    {r.company === 'Alfred_' ? 'get-alfred.ai' : r.company}
                  </a>
                ) : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export default function Work() {
  return (
    <>
      <h2 className="v1-h2">The work</h2>
      <p className="v1-p">
        Since April 2026 I have been the founding LLM engineer at{' '}
        <a className="v1-link" href="https://get-alfred.ai/" target="_blank" rel="noopener noreferrer">
          Alfred_
        </a>
        , in New York. {ALFRED.line} What changed while I was there:
      </p>
      <Measurements />
      <h3 className="v1-h3">Where I have worked</h3>
      <History />
    </>
  );
}
