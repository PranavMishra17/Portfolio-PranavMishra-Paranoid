// src/components/ExperienceModal.js
//
// "Workspace Bay" experience modal. Each role is a substantial card
// with a brand-colored hero strip, a sticker-tag date label, and a
// large circular logo badge that overlaps the hero/body boundary.
// The intent: each role reads as its own workplace, not a list row.
//
// Per-role visual is data-driven from experience.js:
//   - `heroColor` tints the gradient hero (always present)
//   - `heroImage` optionally replaces the gradient with a workplace
//     photo (1600x600 recommended); drop into
//     public/assets/images/companies/heros/<id>.jpg

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TechStackBadge from './TechStackBadge';
import experiences, { getCompanyLogoWithFallback } from '../data/experience';
import './ExperienceModal.css';

const FALLBACK_LOGO = '/assets/images/default/company_default.png';

const Icons = {
  website: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 4 9 14 14 0 0 1-4 9 14 14 0 0 1-4-9 14 14 0 0 1 4-9z" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  ),
  demo: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <polygon points="6 4 20 12 6 20 6 4" />
    </svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="9 7 17 7 17 15" />
    </svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
};

const handleLogoError = (e) => {
  if (e.target.dataset.fallbackApplied) return;
  e.target.src = FALLBACK_LOGO;
  e.target.dataset.fallbackApplied = '1';
};

const ExperienceModal = ({ isOpen, onClose }) => {
  // Esc to close + body scroll lock
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="experience-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
          />

          <motion.div
            className="experience-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="exp-modal-title"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.22, ease: [0.32, 0.72, 0.24, 1] }}
          >
            <header className="experience-modal-header">
              <div className="experience-modal-heading">
                <span className="experience-modal-eyebrow">Career · {experiences.length} workplaces</span>
                <h2 id="exp-modal-title">Workspaces I've shipped from</h2>
              </div>
              <button
                className="experience-modal-close"
                onClick={onClose}
                aria-label="Close"
                type="button"
              >
                {Icons.close}
              </button>
            </header>

            <div className="experience-modal-content">
              <div className="workbay-stack">
                {experiences.map((exp, i) => {
                  const links = exp.links || {};
                  const hasLinks = links.website || links.github || links.demo;
                  const heroImgSrc = exp.heroImage
                    ? `/${exp.heroImage.replace(/^\//, '')}`
                    : null;
                  const brand = exp.heroColor || '#3d5afe';

                  return (
                    <motion.article
                      key={exp.id}
                      className={`workbay${exp.isCurrent ? ' workbay--current' : ''}${
                        exp.heroImage ? ' workbay--photo' : ''
                      }`}
                      style={{ '--brand': brand }}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.26, delay: 0.05 + i * 0.08, ease: 'easeOut' }}
                    >
                      <div className="workbay-hero">
                        {heroImgSrc && (
                          <img
                            className="workbay-hero-img"
                            src={heroImgSrc}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            aria-hidden="true"
                          />
                        )}
                        <div className="workbay-hero-veil" aria-hidden="true" />
                        <div className="workbay-hero-grid" aria-hidden="true" />
                        <div className="workbay-hero-glow" aria-hidden="true" />

                        {exp.isCurrent && (
                          <div className="workbay-now">
                            <span className="workbay-now-dot" aria-hidden="true" />
                            <span>Current Role</span>
                          </div>
                        )}

                        <div className="workbay-tag" aria-hidden="true">
                          <span className="workbay-tag-punch" />
                          <span className="workbay-tag-date">{exp.duration}</span>
                        </div>
                      </div>

                      <div className="workbay-body">
                        <div className="workbay-badge">
                          <span className="workbay-badge-ring" aria-hidden="true" />
                          <img
                            className="workbay-logo"
                            src={getCompanyLogoWithFallback(exp.companyLogo, exp.company)}
                            alt=""
                            onError={handleLogoError}
                            loading="lazy"
                          />
                        </div>

                        <div className="workbay-titles">
                          <h3 className="workbay-title">{exp.title}</h3>
                          <div className="workbay-meta-row">
                            <span className="workbay-company">{exp.company}</span>
                            <span className="workbay-loc-sep" aria-hidden="true">·</span>
                            <span className="workbay-loc">{exp.location}</span>
                          </div>
                        </div>

                        <ul className="workbay-bullets">
                          {exp.description.map((bullet, j) => (
                            <li key={j}>{bullet}</li>
                          ))}
                        </ul>

                        {exp.techStack && exp.techStack.length > 0 && (
                          <div className="workbay-tags">
                            {exp.techStack.map((tech, k) => (
                              <TechStackBadge key={k} tech={tech} />
                            ))}
                          </div>
                        )}

                        {hasLinks && (
                          <div className="workbay-links">
                            {links.website && (
                              <a
                                href={links.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="workbay-link"
                              >
                                {Icons.website}
                                <span>Visit site</span>
                                <span className="workbay-link-arrow">{Icons.arrow}</span>
                              </a>
                            )}
                            {links.github && (
                              <a
                                href={links.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="workbay-link"
                              >
                                {Icons.github}
                                <span>View code</span>
                                <span className="workbay-link-arrow">{Icons.arrow}</span>
                              </a>
                            )}
                            {links.demo && (
                              <a
                                href={links.demo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="workbay-link"
                              >
                                {Icons.demo}
                                <span>Demo</span>
                                <span className="workbay-link-arrow">{Icons.arrow}</span>
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExperienceModal;
