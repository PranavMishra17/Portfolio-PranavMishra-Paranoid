// src/components/TrophyButton.js
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './TrophyButton.css';

const TrophyButton = ({ onStoryOpen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const [hintVisible, setHintVisible] = useState(true);
  const [hintPulse, setHintPulse] = useState(false);

  // Pulsing effect for the hint
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setHintPulse(prev => !prev);
    }, 2000);
    
    // Auto-hide hint after 8 seconds
    const hideTimeout = setTimeout(() => {
      setHintVisible(false);
    }, 8000);
    
    return () => {
      clearInterval(pulseInterval);
      clearTimeout(hideTimeout);
    };
  }, []);
  
  const achievements = [
    {
      id: 'hint',
      icon: '/assets/images/achievements/virtual van.png',
      title: 'HINT 5.0 Hackathon - First Place',
      description: 'Won first place at HINT 5.0 (Hack in the North) with Virtual Van Gogh, an interactive NFT museum using Unity and Ethereum blockchain.',
      image: '/assets/images/achievements/vvg.png',
      link: 'https://github.com/TheGreatFellow/virtual-van-gogh'
    },
    {
      id: 'mit',
      icon: '/assets/images/achievements/mitout.jpg',
      title: 'MIT XR Hackathon - Best Location AR',
      description: 'Won Best Location AR at MIT XR Reality Hackathon 2024 with SnAIder-Cut, using Mixed Reality and Generative AI to create movie scenes.',
      image: '/assets/images/achievements/mit.jpeg',
      link: 'https://codeberg.org/reality-hack-2024/SnAIder-CUT-MIT-XR-Hackathon-Winner-2024'
    },
{
  id: 'informs',
  icon: '/assets/images/achievements/informs.jpeg',
  title: 'INFORMS Analytics+ 2025 Conference',
  description: 'Presented MetaRAG research at the INFORMS Analytics+ Conference in Indianapolis, April 6-8, 2025. Showcased metadata enrichment framework using LLMs for improved RAG systems in internal knowledge retrieval, among 700+ analytics professionals and industry leaders.',
  image: '/assets/images/achievements/informs1.jpeg',
  link: 'https://github.com/PranavMishra17/Metadata-Enrichment-with-LLMs-for-RAGs-Internal-Knowledge-Retrieval'
},
{
  id: 'solana-hackerhouse',
  icon: '/assets/images/achievements/piix.png',
  title: 'Solana Hacker House - Pixel Punks Demo',
  description: 'Showcased Pixel Punks at Solana Hacker House in May 2022, pioneering collaborative pixel art NFTs with blockchain integration. Community-driven platform where users paint NxN pixel grids collectively, with completed artworks auctioned and proceeds distributed among contributors.',
  image: '/assets/images/achievements/solana.jpeg',
  link: 'https://github.com/PranavMishra17/pixel-punks'
}
  ];
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    setHintVisible(false);
    
    if (activeStory && isOpen) {
      setActiveStory(null);
      onStoryOpen && onStoryOpen(false);
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
  
  
  // Calculate position for each achievement
  const getButtonPosition = (index) => {
    // If we have 4 or fewer achievements, position them in two groups
    if (achievements.length <= 4) {
      if (index < 2) {
        // First two items - above trophy button
        return { top: -((index + 1) * 120), left: 0 };
      } else {
        // Next items - below trophy button
        return { top: ((index - 1) * 120), left: 0 };
      }
    } else {
      // Multiple achievements - grid layout
      return {}; // Will use CSS grid
    }
  };
  
  return (
    <div className={`trophy-container ${isOpen ? 'open' : ''}`}>
      {/* Animated Hint */}
      <AnimatePresence>
        {hintVisible && !isOpen && !activeStory && (
          <motion.div 
            className="achievement-hint"
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              scale: hintPulse ? 1.05 : 1
            }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ 
              duration: 0.5,
              scale: { duration: 1, ease: "easeInOut" }
            }}
          >
            <span className="hint-text"></span>
            <span className="hint-arrow">→</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Trophy Button */}
      <motion.div 
        className="trophy-button"
        whileHover={{ scale: 1.1, rotate: [0, -5, 5, -5, 0] }}
        transition={{ rotate: { duration: 0.5 } }}
        onClick={toggleOpen}
      >
        <motion.div
          className="trophy-inner"
          animate={{ rotate: isOpen ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={isOpen ? '/assets/images/icons/close.png' : '/assets/images/icons/trophy.png'} 
            alt={isOpen ? "Close" : "Achievements"} 
          />
        </motion.div>
      </motion.div>
      
      {/* Achievement Icons */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={`satellite-buttons ${achievements.length > 4 ? 'multi-column' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                className="satellite-button"
                initial={{ opacity: 0, scale: 0, x: -50 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: 0,
                  ...getButtonPosition(index)
                }}
                exit={{ opacity: 0, scale: 0, x: -50 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.15,
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                whileHover={{ 
                  scale: 1.05,
                  transition: { duration: 0.3 } 
                }}
                onClick={() => openStory(achievement.id)}
              >
                <img src={achievement.icon} alt={achievement.title} />
                <div className="achievement-tooltip">
                  {achievement.title}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Story Card */}
      <AnimatePresence>
        {activeStory && (
          <motion.div 
            className="story-card"
            initial={{ opacity: 0, scale: 0.8, x: -50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: -50 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 25 
            }}
          >
            <div className="story-header">
              <h3>{achievements.find(a => a.id === activeStory).title}</h3>
              <motion.button 
                className="close-button"
                whileHover={{ scale: 1.2, rotate: 90 }}
                transition={{ duration: 0.3 }}
                onClick={closeStory}
              >
                ✕
              </motion.button>
            </div>
            <div className="story-content">
              <motion.div 
                className="story-image"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <img src={achievements.find(a => a.id === activeStory).image} alt={achievements.find(a => a.id === activeStory).title} />
              </motion.div>
              <motion.div 
                className="story-text"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p>{achievements.find(a => a.id === activeStory).description}</p>
                <motion.a 
                  href={achievements.find(a => a.id === activeStory).link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="story-link"
                  whileHover={{ scale: 1.05, y: -3 }}
                  transition={{ duration: 0.2 }}
                >
                  View Project
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrophyButton;