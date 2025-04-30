// src/components/TrophyButton.js
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './TrophyButton.css';

const TrophyButton = ({ onStoryOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const [rotation, setRotation] = useState(0);
  
  useEffect(() => {
    const rotationInterval = setInterval(() => {
      setRotation(prev => prev + 0.5);
    }, 50);
    return () => clearInterval(rotationInterval);
  }, []);
  
  const achievements = [
    {
      id: 'hint',
      icon: '/assets/images/achievements/hint.png',
      title: 'HINT 5.0 Hackathon - First Place',
      description: 'Won first place at HINT 5.0 (Hack in the North) with Virtual Van Gogh, an interactive NFT museum using Unity and Ethereum blockchain.',
      image: '/assets/images/achievements/hint_story.jpg',
      link: 'https://github.com/PranavMishra17/Virtual-Van-Gogh'
    },
    {
      id: 'mit',
      icon: '/assets/images/achievements/mit.png',
      title: 'MIT XR Hackathon - Best Location AR',
      description: 'Won Best Location AR at MIT XR Reality Hackathon 2024 with SnAIder-Cut, using Mixed Reality and Generative AI to create movie scenes.',
      image: '/assets/images/achievements/mit_story.jpg',
      link: 'https://github.com/PranavMishra17/snaider-cut'
    },
    {
      id: 'ai',
      icon: '/assets/images/achievements/ai.png',
      title: 'ACL 2024 Research Paper',
      description: 'Published research paper on InBedder, an instruction-following text embedder, at the Association for Computational Linguistics (ACL) 2024 conference.',
      image: '/assets/images/achievements/acl_story.jpg',
      link: 'https://github.com/Hjhirp/InBedder'
    },
    {
      id: 'unity',
      icon: '/assets/images/achievements/unity.png',
      title: 'Unity Student Ambassador',
      description: 'Selected as Unity Student Ambassador, representing Unity at campus events and conducting workshops for students.',
      image: '/assets/images/achievements/unity_story.jpg',
      link: 'https://unity.com/education/ambassadors'
    }
  ];
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (activeStory && isOpen) {
      setActiveStory(null);
    }
  };
  
  const openStory = (id) => {
    setActiveStory(id);
    onStoryOpen && onStoryOpen(true);
  };
  
  const closeStory = () => {
    setActiveStory(null);
    onStoryOpen && onStoryOpen(false);
  };
  
  return (
    <div className={`trophy-container ${isOpen ? 'open' : ''}`}>

<motion.div 
  className="trophy-button"
  style={{ 
    left: "100px", // Keep fixed position
    position: "absolute"
  }}
  animate={{ rotate: 0 }}
  whileHover={{ scale: 1.1 }}
  onClick={toggleOpen}
>
  <img 
    src={isOpen ? '/assets/images/icons/close.png' : '/assets/images/icons/trophy.png'} 
    alt={isOpen ? "Close" : "Achievements"} 
  />
  {!isOpen && (
    <div className="click-me-hint">
      <span>Click me</span>
    </div>
  )}
</motion.div>
      
{isOpen && (
  <div className="satellite-buttons">
    {achievements.map((achievement, index) => {
      // Calculate row and position
      const row = Math.floor(index / 2);
      const isLeft = index % 2 === 0;
      
      return (
        <motion.div
          key={achievement.id}
          className="satellite-button"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            rotate: isLeft ? -10 : 10, // Rotate left/right based on position
          }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          style={{
            marginTop: row * 80, // Space between rows
            marginLeft: isLeft ? 0 : 10 // Slight offset for right items
          }}
          whileHover={{ scale: 1.1 }}
          onClick={() => openStory(achievement.id)}
        >
          <img src={achievement.icon} alt={achievement.title} />
        </motion.div>
      );
    })}
  </div>
)}
      
      {activeStory && (
        <motion.div 
          className="story-card"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="story-header">
            <h3>{achievements.find(a => a.id === activeStory).title}</h3>
            <button className="close-button" onClick={closeStory}>✕</button>
          </div>
          <div className="story-content">
            <div className="story-image">
              <img src={achievements.find(a => a.id === activeStory).image} alt={achievements.find(a => a.id === activeStory).title} />
            </div>
            <div className="story-text">
              <p>{achievements.find(a => a.id === activeStory).description}</p>
              <a href={achievements.find(a => a.id === activeStory).link} target="_blank" rel="noopener noreferrer" className="story-link">
                View Project
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TrophyButton;