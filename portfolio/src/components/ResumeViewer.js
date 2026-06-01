// src/components/ResumeViewer.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ResumeViewer.css';

// Live resume: single source of truth lives on Pranav's profile repo.
// Local PDFs in /resumes/{ai,game} are fallbacks for when the live PDF
// is unavailable. The manifest is generated at build/start time by
// scripts/generate-resume-manifest.js so any PDF dropped in those
// folders is picked up regardless of filename.
const GITHUB_PDF_URL =
  'https://raw.githubusercontent.com/PranavMishra17/PranavMishra17/main/RESUME%20Pranav_Mishra.pdf';
const GITHUB_VIEW_URL =
  'https://github.com/PranavMishra17/PranavMishra17/blob/main/RESUME%20Pranav_Mishra.pdf';

const localPath = (folder, file) =>
  file ? `/resumes/${folder}/${encodeURIComponent(file)}` : null;

const ResumeViewer = () => {
  const [manifest, setManifest] = useState({ ai: null, game: null });
  const [liveAvailable, setLiveAvailable] = useState(null); // null = probing
  const [activeKey, setActiveKey] = useState('live');

  // Load the build-time manifest (whatever PDF lives in each folder).
  useEffect(() => {
    let cancelled = false;
    fetch('/resumes/manifest.json', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) setManifest(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Probe the GitHub-hosted PDF. raw.githubusercontent.com sends CORS
  // headers so a HEAD request succeeds when the file exists.
  useEffect(() => {
    let cancelled = false;
    fetch(GITHUB_PDF_URL, { method: 'HEAD', mode: 'cors' })
      .then((r) => {
        if (!cancelled) setLiveAvailable(r.ok);
      })
      .catch(() => {
        if (!cancelled) setLiveAvailable(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // If live fails, auto-switch to the first available backup.
  useEffect(() => {
    if (liveAvailable === false && activeKey === 'live') {
      if (manifest.ai) setActiveKey('ai');
      else if (manifest.game) setActiveKey('game');
    }
  }, [liveAvailable, manifest, activeKey]);

  const sources = {
    live: {
      label: 'Live Resume',
      sublabel: 'GitHub',
      src: GITHUB_PDF_URL,
      downloadHref: GITHUB_PDF_URL,
      externalHref: GITHUB_VIEW_URL,
      externalLabel: 'Open on GitHub',
      available: liveAvailable !== false,
    },
    ai: {
      label: 'AI / ML',
      sublabel: 'Local backup',
      src: localPath('ai', manifest.ai),
      downloadHref: localPath('ai', manifest.ai),
      externalHref: localPath('ai', manifest.ai),
      externalLabel: 'Open in new tab',
      available: !!manifest.ai,
    },
    game: {
      label: 'Game Design',
      sublabel: 'Local backup',
      src: localPath('game', manifest.game),
      downloadHref: localPath('game', manifest.game),
      externalHref: localPath('game', manifest.game),
      externalLabel: 'Open in new tab',
      available: !!manifest.game,
    },
  };

  const tabOrder = ['live', 'ai', 'game'];
  const active = sources[activeKey];
  const probing = liveAvailable === null && activeKey === 'live';

  return (
    <div className="resume-page">
      <header className="resume-header">
        <Link to="/" className="back-button">
          <span className="back-icon">←</span> Back to Portfolio
        </Link>
        <h1>My Resume</h1>
      </header>

      <div className="resume-viewer">
        <div className="resume-tabs">
          {tabOrder.map((key) => {
            const s = sources[key];
            const disabled = !s.available;
            return (
              <button
                key={key}
                className={`resume-tab${activeKey === key ? ' active' : ''}${
                  disabled ? ' disabled' : ''
                }`}
                onClick={() => !disabled && setActiveKey(key)}
                disabled={disabled}
                type="button"
              >
                <span className="resume-tab-label">{s.label}</span>
                <span className="resume-tab-sub">{s.sublabel}</span>
              </button>
            );
          })}
        </div>

        <div className="resume-status">
          {activeKey === 'live' && liveAvailable === true && (
            <span className="resume-status-pill live">
              <span className="resume-status-dot" /> Live · streaming from GitHub
            </span>
          )}
          {activeKey === 'live' && probing && (
            <span className="resume-status-pill">Checking live resume…</span>
          )}
          {liveAvailable === false && (
            <span className="resume-status-pill warn">
              Live resume unreachable — showing local backup
            </span>
          )}
          {activeKey !== 'live' && liveAvailable !== false && (
            <span className="resume-status-pill">Local backup</span>
          )}
        </div>

        <div className="resume-content">
          {active.src ? (
            <iframe
              key={activeKey}
              src={active.src}
              title={`${active.label} Resume`}
              className="resume-frame"
            />
          ) : (
            <div className="resume-empty">
              No PDF available for this tab. Drop a .pdf file into
              <code> public/resumes/{activeKey}/</code> and restart the dev server.
            </div>
          )}
        </div>

        <div className="resume-actions">
          {active.externalHref && (
            <a
              href={active.externalHref}
              target="_blank"
              rel="noopener noreferrer"
              className="ghost-button"
            >
              {active.externalLabel}
            </a>
          )}
          {active.downloadHref && (
            <a href={active.downloadHref} download className="download-button">
              Download {active.label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;
