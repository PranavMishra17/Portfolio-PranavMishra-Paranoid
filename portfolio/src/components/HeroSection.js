// src/components/HeroSection.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import TrophyButton from './TrophyButton';
import './HeroSection.css';

const HeroSection = () => {
  const [storyOpen, setStoryOpen] = useState(false);
  
  return (
    <section id="hero" className={`hero-section ${storyOpen ? 'story-open' : ''}`}>
      <div className="container">
        <div className="hero-content">
          <TrophyButton onStoryOpen={setStoryOpen} />
          
          <motion.div 
            className={`profile-image-container ${storyOpen ? 'centered' : ''}`}
            animate={{ 
              x: storyOpen ? "50%" : 0,
              marginLeft: storyOpen ? "-150px" : 0
            }}
            transition={{ duration: 0.5 }}
          >
            <img src="/assets/images/profile.jpg" alt="Pranav Pushkar Mishra" className="profile-image" />
          </motion.div>
          
          <motion.div 
            className="hero-text"
            animate={{ 
              opacity: storyOpen ? 0 : 1,
              x: storyOpen ? 50 : 0
            }}
            transition={{ duration: 0.5 }}
          >
            <h1>Pranav Pushkar Mishra</h1>
            <h2>Game Developer & ML Engineer</h2>
            <p>
              I'm a Computer Science graduate from the University of Illinois at Chicago,
              specializing in game development and machine learning, with hands-on
              experience in creating immersive applications and enhancing data-driven
              models.
            </p>
            <div className="hero-buttons">
              <Link to="/projects" className="btn primary-btn">
                VIEW PROJECTS
              </Link>
              <Link to="/contact" className="btn secondary-btn">
                CONNECT
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;