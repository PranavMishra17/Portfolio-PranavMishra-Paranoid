// src/components/ProjectTabs.js
import React, { useState, useEffect } from 'react';

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
      label: 'GD PROJECTS',
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
      label: 'AIML PROJECTS',
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
            {/* Left floating image */}
            <div 
              className={`floating-image floating-left ${hoveredTab === tab.id ? 'hidden' : ''}`}
              style={{
                backgroundImage: `url(${tab.floatingImages.left})`,
                transform: `rotate(${randomAngles[`${tab.id}-left`] || 0}deg)`,
                opacity: hoveredTab === tab.id ? 0 : 0.7,
                transition: 'opacity 0.3s ease, transform 0.3s ease'
              }}
            />
            
            {/* Right floating image */}
            <div 
              className={`floating-image floating-right ${hoveredTab === tab.id ? 'hidden' : ''}`}
              style={{
                backgroundImage: `url(${tab.floatingImages.right})`,
                transform: `rotate(${randomAngles[`${tab.id}-right`] || 0}deg)`,
                opacity: hoveredTab === tab.id ? 0 : 0.7,
                transition: 'opacity 0.3s ease, transform 0.3s ease'
              }}
            />
            
            <button
              className={`project-tab ${activeTab === tab.id ? 'active' : ''} ${hoveredTab === tab.id ? 'hovered' : ''}`}
              onClick={() => onTabChange(tab.id)}
              onMouseEnter={() => setHoveredTab(tab.id)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                backgroundColor: tab.color,
                boxShadow: activeTab === tab.id ? `0 4px 12px ${tab.color}80` : 'none',
                transition: 'all 0.3s ease',
                overflow: 'hidden',
                position: 'relative',
                borderRadius: hoveredTab === tab.id ? '4px' : '24px',
                height: hoveredTab === tab.id ? '65px' : '50px',
                zIndex: 2
              }}
              data-tab={tab.id}
            >
              <span 
                className="tab-text"
                style={{
                  fontWeight: hoveredTab === tab.id ? '800' : '700',
                  transition: 'all 0.3s ease'
                }}
              >
                {tab.label}
              </span>
              
              {hoveredTab === tab.id && (
                <div 
                  className="tab-image-container"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '100%',
                    width: '100%',
                    height: '100%',
                    transform: 'translateX(-100%)',
                    opacity: 0.3,
                    transition: 'all 0.3s ease',
                    zIndex: 0
                  }}
                >
                  <img 
                    src={tab.image} 
                    alt={tab.label}
                    className="tab-image"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: 'grayscale(30%)'
                    }}
                  />
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectTabs;