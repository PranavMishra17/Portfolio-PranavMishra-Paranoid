// src/components/CollapsibleSectionTabs.js
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './CollapsibleSectionTabs.css';

const CollapsibleSectionTabs = ({ 
  experienceSection, 
  publicationsSection, 
  onExperienceToggle, 
  onPublicationsToggle 
}) => {
  const [hoveredTab, setHoveredTab] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const experienceButtonRef = useRef(null);

  // Track mouse position for googly eyes
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (experienceButtonRef.current) {
        const rect = experienceButtonRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        setMousePos({
          x: e.clientX - centerX,
          y: e.clientY - centerY
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const sections = [
    {
      id: 'experience',
      label: 'EXPERIENCE',
      isOpen: experienceSection.isOpen,
      onToggle: onExperienceToggle,
      color: '#4a3c6b',
      hoverColor: 'rgba(74, 60, 107, 0.9)'
    },
    {
      id: 'publications',
      label: 'RESEARCH AND PUBLICATIONS',
      isOpen: publicationsSection.isOpen,
      onToggle: onPublicationsToggle,
      color: 'white',
      hoverColor: 'rgba(255, 255, 255, 0.9)'
    }
  ].filter(section => 
    (section.id === 'experience' && experienceSection.component !== null) ||
    (section.id === 'publications' && publicationsSection.component !== null)
  );

  return (
    <div className="collapsible-tabs-container">
      <div className="collapsible-tabs-wrapper">
        {sections.map((section) => (
          <div key={section.id} className="collapsible-tab-wrapper">
            <motion.button
              ref={section.id === 'experience' ? experienceButtonRef : null}
              className={`collapsible-tab ${section.isOpen ? 'open' : ''}`}
              onClick={section.onToggle}
              onMouseEnter={() => setHoveredTab(section.id)}
              onMouseLeave={() => setHoveredTab(null)}
              whileHover={{ 
                scale: 1.02,
                boxShadow: `0 8px 20px ${section.color}40`
              }}
              style={{
                background: section.id === 'experience' ? 
                  `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url('/assets/images/ex_back.png')` :
                  section.color,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: section.isOpen ? `0 4px 12px ${section.color}60` : 'none',
                color: section.id === 'publications' ? 'black' : 'white'
              }}
            >
              <div className="collapsible-tab-content">
                {section.id === 'experience' && (
                  <div className="googly-eyes">
                    <div className="eye eye-left">
                      <div 
                        className="eyeball"
                        style={{
                          transform: `translate(calc(-50% + ${Math.max(-3, Math.min(3, mousePos.x * 0.05))}px), calc(-50% + ${Math.max(-3, Math.min(3, mousePos.y * 0.05))}px))`
                        }}
                      />
                    </div>
                    <div className="eye eye-right">
                      <div 
                        className="eyeball"
                        style={{
                          transform: `translate(calc(-50% + ${Math.max(-3, Math.min(3, mousePos.x * 0.05))}px), calc(-50% + ${Math.max(-3, Math.min(3, mousePos.y * 0.05))}px))`
                        }}
                      />
                    </div>
                  </div>
                )}
                <span className="collapsible-tab-label">{section.label}</span>
              </div>

              {/* Active indicator */}
              {section.isOpen && (
                <motion.div
                  className="collapsible-active-indicator"
                  layoutId={`collapsible-${section.id}`}
                />
              )}
            </motion.button>

            {/* Collapsible content */}
            <AnimatePresence>
              {section.isOpen && (
                <motion.div
                  className="collapsible-content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ 
                    duration: 0.4, 
                    ease: [0.4, 0, 0.2, 1]
                  }}
                >
                  <div className="collapsible-content-inner">
                    {section.id === 'experience' && experienceSection.component}
                    {section.id === 'publications' && publicationsSection.component}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollapsibleSectionTabs;