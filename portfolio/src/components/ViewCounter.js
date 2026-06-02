// src/components/ViewCounter.js
//
// No-backend live view counter for the header. Hits
// abacus.jasoncameron.dev — a free, open-source, no-auth atomic
// counter API. Every page load increments and displays the new value.

import React, { useEffect, useState } from 'react';
import './ViewCounter.css';

const API = 'https://abacus.jasoncameron.dev';
const NAMESPACE = 'pranavmishra-portfolio';
const KEY = 'site-views';

const _RAW = process.env.REACT_APP_VIEW_OFFSET;
const OFFSET = (() => {
  const n = parseInt(_RAW, 10);
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
