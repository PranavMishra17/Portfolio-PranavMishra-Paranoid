// src/components/ResumeViewer.js
//
// The live resume is hosted on Pranav's profile repo and is the source
// of truth. Local PDFs in /resumes/{ai,game} are fallbacks; their
// filenames are discovered at build time by
// scripts/generate-resume-manifest.js, so any PDF dropped into either
// folder is picked up without code changes.
//
// === Why the live PDF goes through a blob URL ===
// raw.githubusercontent.com serves PDFs with `Content-Disposition:
// attachment`, which makes Chrome trigger an auto-download instead of
// rendering inline when set as an iframe src. To force inline render
// we fetch the PDF as a Blob client-side, re-tag it as
// application/pdf, and hand a same-origin object URL to the iframe.
// The browser then renders it in its built-in viewer the same way it
// would a local PDF.

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './ResumeViewer.css';

const GITHUB_PDF_URL =
  'https://raw.githubusercontent.com/PranavMishra17/PranavMishra17/main/RESUME%20Pranav_Mishra.pdf';
const GITHUB_VIEW_URL =
  'https://github.com/PranavMishra17/PranavMishra17/blob/main/RESUME%20Pranav_Mishra.pdf';

const localPath = (folder, file) =>
  file ? `/resumes/${folder}/${encodeURIComponent(file)}` : null;

const ResumeViewer = () => {
  const [manifest, setManifest] = useState({ ai: null, game: null });
  const [liveAvailable, setLiveAvailable] = useState(null); // null = probing
  const [liveBlobUrl, setLiveBlobUrl] = useState(null);
  const [liveFetchError, setLiveFetchError] = useState(false);
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

  // Probe the GitHub-hosted PDF with a HEAD so the tab knows whether to
  // even attempt the live source.
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

  // Fetch the live PDF as a Blob and hand the iframe a same-origin
  // object URL — bypasses GitHub's attachment disposition.
  useEffect(() => {
    if (liveAvailable !== true) return;
    let cancelled = false;
    let createdUrl = null;

    fetch(GITHUB_PDF_URL, { mode: 'cors' })
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error('bad status'))))
      .then((blob) => {
        if (cancelled) return;
        const pdfBlob =
          blob.type === 'application/pdf'
            ? blob
            : new Blob([blob], { type: 'application/pdf' });
        createdUrl = URL.createObjectURL(pdfBlob);
        setLiveBlobUrl(createdUrl);
      })
      .catch(() => {
        if (!cancelled) setLiveFetchError(true);
      });

    return () => {
      cancelled = true;
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [liveAvailable]);

  // If live fails (probe or blob fetch), auto-switch to the first
  // available backup.
  useEffect(() => {
    const liveBroken = liveAvailable === false || liveFetchError;
    if (liveBroken && activeKey === 'live') {
      if (manifest.ai) setActiveKey('ai');
      else if (manifest.game) setActiveKey('game');
    }
  }, [liveAvailable, liveFetchError, manifest, activeKey]);

  const sources = {
    live: {
      label: 'Live Resume',
      sublabel: 'GitHub',
      // iframe gets the blob URL (renders inline); download/external
      // still point at GitHub so the user can grab the canonical file.
      iframeSrc: liveBlobUrl,
      downloadHref: GITHUB_PDF_URL,
      externalHref: GITHUB_VIEW_URL,
      externalLabel: 'Open on GitHub',
      available: liveAvailable !== false && !liveFetchError,
    },
    ai: {
      label: 'AI / ML',
      sublabel: 'Local backup',
      iframeSrc: localPath('ai', manifest.ai),
      downloadHref: localPath('ai', manifest.ai),
      externalHref: localPath('ai', manifest.ai),
      externalLabel: 'Open in new tab',
      available: !!manifest.ai,
    },
    game: {
      label: 'Game Design',
      sublabel: 'Local backup',
      iframeSrc: localPath('game', manifest.game),
      downloadHref: localPath('game', manifest.game),
      externalHref: localPath('game', manifest.game),
      externalLabel: 'Open in new tab',
      available: !!manifest.game,
    },
  };

  const tabOrder = ['live', 'ai', 'game'];
  const active = sources[activeKey];
  const probing = liveAvailable === null && activeKey === 'live';
  const liveLoading =
    activeKey === 'live' &&
    liveAvailable === true &&
    !liveBlobUrl &&
    !liveFetchError;

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
          {activeKey === 'live' && liveAvailable === true && liveBlobUrl && (
            <span className="resume-status-pill live">
              <span className="resume-status-dot" /> Live · streaming from GitHub
            </span>
          )}
          {(probing || liveLoading) && (
            <span className="resume-status-pill">Loading live resume…</span>
          )}
          {(liveAvailable === false || liveFetchError) && (
            <span className="resume-status-pill warn">
              Live resume unreachable — showing local backup
            </span>
          )}
          {activeKey !== 'live' && !liveFetchError && liveAvailable !== false && (
            <span className="resume-status-pill">Local backup</span>
          )}
        </div>

        <div className="resume-content">
          {liveLoading ? (
            <div className="resume-empty">Fetching the latest resume…</div>
          ) : active.iframeSrc ? (
            <iframe
              key={activeKey + (active.iframeSrc || '')}
              src={active.iframeSrc}
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
