import React, { useCallback } from 'react';
import './ConnectSlate.css';

const BUTTONS = [
  {
    label: 'Github',
    type: 'github',
    url: 'https://github.com/PranavMishra17',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    type: 'linkedin',
    url: 'https://www.linkedin.com/in/pranavgamedev/',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Resume',
    type: 'resume',
    url: 'https://portfolio-pranav-mishra-paranoid.vercel.app/resume',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 12h8v2H8v-2zm0 4h8v2H8v-2zm0-8h3v2H8V8z"/>
      </svg>
    ),
  },
  {
    label: 'YouTube',
    type: 'youtube',
    url: 'https://www.youtube.com/@parano1dgames/featured',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    label: 'HuggingFace',
    type: 'huggingface',
    url: 'https://huggingface.co/Paranoiid',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 1.5c4.687 0 8.5 3.813 8.5 8.5s-3.813 8.5-8.5 8.5S3.5 16.687 3.5 12 7.313 3.5 12 3.5zm-2.5 7a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm5 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm-5.5 4.5s1 2 3 2 3-2 3-2"/>
      </svg>
    ),
  },
  {
    label: 'Scholar',
    type: 'scholar',
    url: 'https://scholar.google.com/citations?hl=en&user=_Twn_owAAAAJ',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 24a7 7 0 110-14 7 7 0 010 14zm0-24L0 9.5l4.838 3.94A8 8 0 0112 9a8 8 0 017.162 4.44L24 9.5 12 0z"/>
      </svg>
    ),
  },
];

export default function ConnectSlate({ open, onClose, inline = false }) {
  console.log('[ConnectSlate] Render - open:', open, 'inline:', inline);

  if (!open) {
    console.log('[ConnectSlate] Not rendering - open is false');
    return null;
  }

  const handleOverlayClick = (e) => {
    console.log('[ConnectSlate] Overlay clicked');
    if (e.target === e.currentTarget) {
      console.log('[ConnectSlate] Closing via overlay');
      onClose();
    }
  };

  const handleCloseClick = (e) => {
    console.log('[ConnectSlate] Close button clicked');
    e.stopPropagation();
    onClose();
  };

  const handleSlateClick = (e) => {
    console.log('[ConnectSlate] Slate container clicked');
    e.stopPropagation();
  };

  const gridContent = (
    <div className="connect-slate-grid">
      {BUTTONS.map((btn) => (
        <a
          key={btn.label}
          href={btn.url}
          target="_blank"
          rel="noopener noreferrer"
          className="connect-slate-btn"
          data-type={btn.type}
          onClick={() => console.log('[ConnectSlate] Button clicked:', btn.label)}
        >
          {btn.icon}
          <span>{btn.label}</span>
        </a>
      ))}
    </div>
  );

  if (inline) {
    console.log('[ConnectSlate] Rendering inline mode');
    return (
      <div
        className="connect-slate connect-slate--inline"
        onClick={handleSlateClick}
      >
        <button className="close-btn" onClick={handleCloseClick}>
          &times;
        </button>
        {gridContent}
      </div>
    );
  }

  console.log('[ConnectSlate] Rendering modal mode');
  return (
    <div className="connect-slate-overlay" onClick={handleOverlayClick}>
      <div className="connect-slate" onClick={handleSlateClick}>
        <button className="close-btn" onClick={handleCloseClick}>
          &times;
        </button>
        {gridContent}
      </div>
    </div>
  );
}

export function ConnectButton({ isOpen, onClick }) {
  const handleClick = useCallback(
    (e) => {
      console.log('[ConnectButton] Button clicked!');
      console.log('[ConnectButton] Event:', e.type);
      console.log('[ConnectButton] Current isOpen state:', isOpen);
      e.preventDefault();
      e.stopPropagation();
      onClick();
    },
    [isOpen, onClick]
  );

  console.log('[ConnectButton] Render - isOpen:', isOpen);

  return (
    <button
      type="button"
      className={`floating-connect-btn ${isOpen ? 'active' : ''}`}
      title={isOpen ? 'Close connections' : 'Connect with me'}
      onClick={handleClick}
      onMouseDown={() => console.log('[ConnectButton] MouseDown detected')}
      aria-label={isOpen ? 'Close connections panel' : 'Open connections panel'}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ pointerEvents: 'none' }}
      >
        {isOpen ? (
          <>
            <path
              d="M18 6L6 18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        ) : (
          <>
            <path
              d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="8.5"
              cy="7"
              r="4"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20 8V14"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23 11H17"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}
      </svg>
    </button>
  );
}