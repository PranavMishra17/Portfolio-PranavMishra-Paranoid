// src/components/ViewCounter.js
//
// No-backend live view counter for the header.
//
// Hits abacus.jasoncameron.dev — a free, open-source, no-auth atomic
// counter API. Every page load increments and displays the new value.
//
// The displayed number is offset by REACT_APP_VIEW_OFFSET so the
// counter's "starting" baseline isn't visible as a literal in this
// public repo. The env var is set in `.env.local` (gitignored) for
// dev and in the Vercel dashboard for prod. If the var is missing the
// component falls back to the raw API value with no offset — so a
// fresh clone still shows a working counter, just one that starts at 1.
//
// Caveat the user explicitly accepted: the build bundle is shipped to
// the browser, so anyone reading the minified JS could still discover
// the offset. The env-var split only hides it from casual repo readers.

import React, { useEffect, useState } from 'react';
import './ViewCounter.css';

const API = 'https://abacus.jasoncameron.dev';
const NAMESPACE = 'pranavmishra-portfolio';
const KEY = 'site-views';

const RAW_OFFSET = process.env.REACT_APP_VIEW_OFFSET;
const OFFSET = (() => {
  const n = parseInt(RAW_OFFSET, 10);
  return Number.isFinite(n) ? n : 0;
})();

const formatCount = (n) => n.toLocaleString('en-US');

const ViewCounter = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const url = `${API}/hit/${NAMESPACE}/${KEY}`;

    fetch(url, { mode: 'cors' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data || typeof data.value !== 'number') return;
        setCount(OFFSET + data.value);
      })
      .catch(() => {
        // silent — counter just doesn't render
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (count === null) return null;

  return (
    <div
      className="view-counter"
      title={`${formatCount(count)} views since launch`}
      aria-label={`${formatCount(count)} views`}
    >
      <span className="view-counter-dot" aria-hidden="true" />
      <span className="view-counter-num">{formatCount(count)}</span>
      <span className="view-counter-label">views</span>
    </div>
  );
};

export default ViewCounter;
