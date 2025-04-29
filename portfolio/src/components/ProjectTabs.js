import React, { useState } from 'react';

const ProjectTabs = ({ activeTab, onTabChange }) => {
  const [hoveredTab, setHoveredTab] = useState(null);
  
  const tabs = [
    {
      id: 'game-design',
      label: 'GD PROJECTS',
      image: '/api/placeholder/120/120', // Replace with actual game design image
      color: '#ff2d55',
      hoverColor: 'rgba(255, 45, 85, 0.9)'
    },
    {
      id: 'ai-ml',
      label: 'AIML PROJECTS',
      image: '/api/placeholder/120/120', // Replace with actual AI/ML image
      color: '#3d5afe',
      hoverColor: 'rgba(61, 90, 254, 0.9)'
    },
    {
      id: 'misc',
      label: 'MISC PROJECTS',
      image: '/api/placeholder/120/120', // Replace with actual misc image
      color: '#00c853',
      hoverColor: 'rgba(0, 200, 83, 0.9)'
    }
  ];
  
  return (
    <div className="project-tabs-container">
      <div className="tabs-wrapper">
        {tabs.map((tab) => (
          <button
            key={tab.id}
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
              borderRadius: hoveredTab === tab.id ? '4px' : '24px'
            }}
          >
            <span className="tab-text">{tab.label}</span>
            
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
        ))}
      </div>
    </div>
  );
};

export default ProjectTabs;