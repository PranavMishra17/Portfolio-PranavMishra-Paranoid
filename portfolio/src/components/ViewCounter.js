// src/components/ViewCounter.js
//
// No-backend live view counter for the header.
//
// Hits abacus.jasoncameron.dev — a free, open-source, no-auth atomic
// counter API. First call to /hit creates the counter and returns 1;
// every subsequent call increments and returns the new value.
//
// To make the displayed number start at 1,001 (per the original launch
// baseline) we add a static OFFSET on top of the API value. A localStorage
// timestamp throttles increments to once every SESSION_HOURS per browser
// so refresh-spam doesn't inflate the count — refreshes within the window
// read via /get without bumping.
//
// If the API is blocked (ad-blocker, network) the component silently
// renders nothing — no broken UI in the header.

import React, { useEffect, useState } from 'react';
import './ViewCounter.css';

const API = 'https://abacus.jasoncameron.dev';
const NAMESPACE = 'pranavmishra-portfolio';
const KEY = 'site-views';
const OFFSET = 1000;
const SESSION_STORAGE_KEY = 'pmportfolio_vc_lasthit_v1';
const SESSION_HOURS = 6;

const formatCount = (n) => n.toLocaleString('en-US');

const ViewCounter = () => {
  const [count, setCount] = useState(null);

  useEffect(() => {
    let cancelled = false;

    let lastHitTs = null;
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      const ts = raw ? parseInt(raw, 10) : NaN;
      if (!Number.isNaN(ts)) lastHitTs = ts;
    } catch {
      // localStorage may be unavailable (private mode); fall through
    }

    const sessionFresh =
      !lastHitTs || Date.now() - lastHitTs > SESSION_HOURS * 3600 * 1000;

    const endpoint = sessionFresh ? 'hit' : 'get';
    const url = `${API}/${endpoint}/${NAMESPACE}/${KEY}`;

    fetch(url, { mode: 'cors' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data || typeof data.value !== 'number') return;
        setCount(OFFSET + data.value);
        if (sessionFresh) {
          try {
            localStorage.setItem(SESSION_STORAGE_KEY, String(Date.now()));
          } catch {}
        }
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
      title={`${formatCount(count)} unique views since launch`}
      aria-label={`${formatCount(count)} unique views`}
    >
      <span className="view-counter-dot" aria-hidden="true" />
      <span className="view-counter-num">{formatCount(count)}</span>
      <span className="view-counter-label">views</span>
    </div>
  );
};

export default ViewCounter;
