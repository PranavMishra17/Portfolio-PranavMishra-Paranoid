// v19 — the résumé, on the same paper as the rest of the site.
//
// The live PDF lives in the PranavMishra17/PranavMishra17 repo on GitHub. raw.githubusercontent
// serves it as an attachment, so it is fetched as a blob and handed to the frame as a same-origin
// URL, which renders inline. If GitHub cannot be reached, the most recent PDF dropped into
// public/resumes/ai/ (found by the build-time manifest) is shown instead. Nothing else on the
// page: the same header as the site, one sheet, two buttons.

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ME, LINKS } from './copy';
import { useSky, useClock } from './hooks';
import { FONTS } from './fonts';
import { cachedResume, prefetchResume, GITHUB_VIEW } from './resumeCache';
import './v19.css';


export default function Resume() {
  const skyRef = React.useRef(null);
  const hour = useClock();
  useSky(skyRef, hour);
  const [src, setSrc] = useState(() => cachedResume());
  const [href, setHref] = useState(GITHUB_VIEW);
  const [state, setState] = useState(() => (cachedResume() ? 'live' : 'loading')); // loading | live | local | none

  useEffect(() => {
    document.body.classList.add('v19-body');
    document.title = `${ME.first} ${ME.last} — Résumé`;
    let link = document.getElementById('v19-fonts');
    if (!link) {
      link = document.createElement('link');
      link.id = 'v19-fonts';
      link.rel = 'stylesheet';
      link.href = FONTS;
      document.head.appendChild(link);
    }
    return () => document.body.classList.remove('v19-body');
  }, []);

  useEffect(() => {
    if (cachedResume()) return undefined;
    let alive = true;
    const local = async () => {
      try {
        const res = await fetch('/resumes/manifest.json', { cache: 'no-store' });
        const m = await res.json();
        const file = m.ai || m.game;
        if (!file) throw new Error('no local pdf');
        const path = `/resumes/${m.ai ? 'ai' : 'game'}/${encodeURIComponent(file)}`;
        if (!alive) return;
        setSrc(path);
        setHref(path);
        setState('local');
      } catch (err) {
        if (alive) setState('none');
      }
    };
    prefetchResume().then((u) => {
      if (!alive) return;
      if (u) {
        setSrc(u);
        setState('live');
      } else {
        local();
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="v19 land-plate is-open v19-resume">
      <div className="v19-sky" ref={skyRef} aria-hidden="true" />
      <div className="v19-grain" aria-hidden="true" />

      <header className="v19-bar on">
        <Link to="/v19" className="v19-bar-home" title="Back to the site">
          <img className="v19-bar-face" src={ME.photo} alt="" />
          <span className="v19-bar-who">
            <b>
              {ME.first} {ME.last}
            </b>
            <i>{ME.short}</i>
          </span>
        </Link>
        <div className="v19-bar-where">
          <span>Résumé</span>
        </div>
        <nav className="v19-bar-links" aria-label="Elsewhere">
          {LINKS.filter((l) => l.label !== 'Résumé').map((l) => (
            <a key={l.label} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>
          ))}
        </nav>
      </header>

      <main className="v19-main v19-resume-main">
        <div className="v19-resume-head">
          <p className="v19-eye">
            <span className="v19-dot" aria-hidden="true" />
            {state === 'live' ? 'The current one' : state === 'local' ? 'A saved copy' : state === 'none' ? 'Not reachable right now' : 'Fetching'}
          </p>
          <div className="v19-resume-acts">
            <a className="v19-land-go" href={href} download={state === 'local' ? '' : undefined} target="_blank" rel="noreferrer">
              {state === 'local' ? 'Download' : 'Open on GitHub'}
            </a>
            {state === 'live' && src ? (
              <a className="v19-resume-dl" href={src} download="Pranav Mishra — Résumé.pdf">Download</a>
            ) : null}
          </div>
        </div>
        <div className="v19-resume-sheet">
          {src ? (
            <iframe title="Résumé" src={`${src}#view=FitH&toolbar=0`} className="v19-resume-frame" />
          ) : (
            <p className="v19-resume-empty">
              {state === 'none' ? (
                <>The résumé could not be loaded here. It is always at <a className="v19-a" href={GITHUB_VIEW} target="_blank" rel="noreferrer">GitHub</a>.</>
              ) : 'Fetching the PDF.'}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
