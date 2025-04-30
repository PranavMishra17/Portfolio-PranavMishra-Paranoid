// src/components/ProjectTabs.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';


const ProjectTabs = ({ activeTab, onTabChange }) => {
  const [hoveredTab, setHoveredTab] = useState(null);
  const [randomAngles, setRandomAngles] = useState({});
  
  // Generate random angles on component mount
  useEffect(() => {
    const angles = {};
    tabs.forEach(tab => {
      angles[`${tab.id}-left`] = Math.random() * 20 - 10; // -10 to +10 degrees
      angles[`${tab.id}-right`] = Math.random() * 20 - 10;
    });
    setRandomAngles(angles);
  }, []);
  
  const tabs = [
    {
      id: 'game-design',
      label: 'GAME DESIGN PROJECTS',
      image: '/assets/images/default/game_design_default.jpg',
      floatingImages: {
        left: '/assets/images/icons/game_floating.png',
        right: '/assets/images/icons/game_floating2.png'
      },
      color: '#ff2d55',
      hoverColor: 'rgba(255, 45, 85, 0.9)'
    },
    {
      id: 'ai-ml',
      label: 'AI-ML PROJECTS',
      image: '/assets/images/default/ai_ml_default.jpg',
      floatingImages: {
        left: '/assets/images/icons/ai_floating.png',
        right: '/assets/images/icons/ai_floating2.png'
      },
      color: '#3d5afe',
      hoverColor: 'rgba(61, 90, 254, 0.9)'
    },
    {
      id: 'misc',
      label: 'MISC PROJECTS',
      image: '/assets/images/default/misc_default.jpg',
      floatingImages: {
        left: '/assets/images/icons/misc_floating.png',
        right: '/assets/images/icons/misc_floating2.png'
      },
      color: '#00c853',
      hoverColor: 'rgba(0, 200, 83, 0.9)'
    }
  ];
  
  return (
    <div className="project-tabs-container">
      <div className="tabs-wrapper">
        {tabs.map((tab) => (
          <div key={tab.id} className="tab-wrapper">
            {/* Floating images that appear on hover */}
            <AnimatePresence>
              {hoveredTab === tab.id && (
                <>
                  <motion.div 
                    className="floating-image floating-left"
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{ 
                      opacity: 0.9, 
                      scale: 1, 
                      rotate: randomAngles[`${tab.id}-left`] || 0,
                      x: -20
                    }}
                    exit={{ opacity: 0, scale: 0, x: 0 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    style={{
                      backgroundImage: `url(${tab.floatingImages.left})`
                    }}
                  />
                  
                  <motion.div 
                    className="floating-image floating-right"
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{ 
                      opacity: 0.9, 
                      scale: 1, 
                      rotate: randomAngles[`${tab.id}-right`] || 0,
                      x: 20
                    }}
                    exit={{ opacity: 0, scale: 0, x: 0 }}
                    transition={{ duration: 0.4, type: "spring", delay: 0.1 }}
                    style={{
                      backgroundImage: `url(${tab.floatingImages.right})`
                    }}
                  />
                </>
              )}
            </AnimatePresence>
            
            <motion.button
              className={`project-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 10px 25px ${tab.color}50`
              }}
              style={{
                background: `linear-gradient(to right, ${tab.color}, ${tab.color}E0)`,
                boxShadow: activeTab === tab.id ? `0 4px 12px ${tab.color}80` : 'none',
                overflow: 'hidden',
                position: 'relative',
                borderRadius: '50px',
                transition: 'all 0.3s ease',
              }}
              data-tab={tab.id}
            >
              {/* Background image - always visible now */}
              <div 
                className="tab-image-container"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0.15,
                  zIndex: 0
                }}
              >
                <img 
                  src={tab.image} 
                  alt=""
                  className="tab-image"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'grayscale(30%)'
                  }}
                />
              </div>
              
              {/* Tab text with hover effect */}
              <motion.span 
                className="tab-text"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  color: 'white',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  textShadow: hoveredTab === tab.id ? '0 2px 10px rgba(0,0,0,0.5)' : 'none'
                }}
                whileHover={{ scale: 1.05 }}
              >
                {tab.label}
              </motion.span>
              
              {/* Animated icon that appears on hover */}
              <AnimatePresence>
                {hoveredTab === tab.id && (
                  <motion.div
                    className="tab-icon"
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 20 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 500, 
                      damping: 20,
                      delay: 0.1
                    }}
                    style={{
                      position: 'absolute',
                      bottom: -20,
                      right: 15,
                      zIndex: 2
                    }}
                  >

                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Active tab indicator */}
              {activeTab === tab.id && (
                <motion.div
                  className="active-indicator"
                  layoutId="activeTabIndicator"
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    width: '100%',
                    height: '3px',
                    background: 'white',
                    boxShadow: '0 0 10px rgba(255,255,255,0.8)'
                  }}
                />
              )}
            </motion.button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTabs;