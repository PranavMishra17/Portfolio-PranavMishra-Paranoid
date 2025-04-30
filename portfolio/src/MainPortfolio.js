// src/MainPortfolio.js
// Add these imports at the top of your MainPortfolio.js file
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion'; // Removed AnimatePresence since it's unused
import { Link } from 'react-router-dom';
import ParticleBackground from './components/ParticleBackground';
import PixelText from './components/PixelText';
import ThemeSwitch from './components/ThemeSwitch';
import ProjectTabs from './components/ProjectTabs';
import ProjectCard from './components/ProjectCard';
import TrophyButton from './components/TrophyButton';
import { projects, contactInfo, getImageWithFallback } from './data/projects';
import './styles/About.css';

function MainPortfolio() {
  const [activeSection, setActiveSection] = useState('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionsRef = useRef({});
  const [storyOpen, setStoryOpen] = useState(false);

  // Handle smooth scrolling
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 60,
        behavior: 'smooth'
      });
      setActiveSection(sectionId);
      setMenuOpen(false);
    }
  };

  // Handle scroll events to update active section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const sections = Object.keys(sectionsRef.current);

      for (const section of sections) {
        const element = sectionsRef.current[section];
        if (element) {
          const { offsetTop, offsetHeight } = element;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Register section refs
  const registerSection = (id, element) => {
    sectionsRef.current[id] = element;
  };

  return (
    <div className="portfolio-app">
      {/* Theme Switch */}
      <ThemeSwitch />
      
      {/* Header */}
      <header className="header">
        <div className="logo">
          <span>{contactInfo.name}</span>
        </div>
        <div className={`mobile-menu-button ${menuOpen ? 'active' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li className={activeSection === 'about' ? 'active' : ''}>
              <button onClick={() => scrollToSection('about')}>About Me</button>
            </li>
            <li className={activeSection === 'game-design' ? 'active' : ''}>
              <button onClick={() => scrollToSection('game-design')}>Game Design</button>
            </li>
            <li className={activeSection === 'ai-ml' ? 'active' : ''}>
              <button onClick={() => scrollToSection('ai-ml')}>AI / ML</button>
            </li>
            <li className={activeSection === 'misc' ? 'active' : ''}>
              <button onClick={() => scrollToSection('misc')}>Misc</button>
            </li>
            <li className={activeSection === 'contact' ? 'active' : ''}>
              <button onClick={() => scrollToSection('contact')}>Connect</button>
            </li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main>

               {/* About Section */}
               <section 
          id="about" 
          className={`about-section ${storyOpen ? 'story-active' : ''}`}
          ref={(el) => registerSection('about', el)}
        >
          <ParticleBackground />
          <div className="container">
            <div className="about-content">
              <div className="profile-container">
                <TrophyButton onStoryOpen={setStoryOpen} />
                
                <motion.div 
                  className="profile-image"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
                >
                  <div className="profile-img-container">
                    <img src={getImageWithFallback("", "profile")} alt={contactInfo.name} />
                    <div className="profile-img-glow"></div>
                  </div>
                </motion.div>
              </div>
              
              <div className="about-text">
                <motion.h1 
                  className="name-title"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {contactInfo.name}
                </motion.h1>
                
                <motion.h2 
                  className="profession-title"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {contactInfo.title}
                </motion.h2>
                
                <motion.p 
                  className="bio-text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {contactInfo.bio}
                </motion.p>
                
                <motion.div 
                  className="cta-buttons"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <motion.button 
                    className="primary-btn"
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 10px 25px rgba(61, 90, 254, 0.3)"
                    }}
                    onClick={() => scrollToSection('game-design')}
                  >
                    View Projects
                  </motion.button>
                  
                  <motion.button 
                    className="secondary-btn"
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)"
                    }}
                    onClick={() => scrollToSection('contact')}
                  >
                    Connect
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="scroll-indicator" 
            onClick={() => scrollToSection('game-design')}
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.6, 1, 0.6] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 2,
              ease: "easeInOut" 
            }}
          >
            <div className="mouse">
              <div className="wheel"></div>
            </div>
            <div>
              <span className="scroll-arrow"></span>
            </div>
          </motion.div>
        </section>

        {/* Project Navigation Tabs */}
        <div className="projects-navigation-section">
          <div className="container">
            <ProjectTabs
              activeTab={activeSection}
              onTabChange={(tabId) => scrollToSection(tabId)}
            />
          </div>
        </div>

        {/* Game Design Projects Section */}
        <section 
          id="game-design" 
          className="game-design-section"
          ref={(el) => registerSection('game-design', el)}
        >
          <div className="container">
            <h2 className="section-title game-title">
              <PixelText text="Game Design Projects" color="#ff2d55" />
            </h2>
            <div className="projects-grid">
              {projects.gameDesign.map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  theme="game-design"
                />
              ))}
            </div>
          </div>
        </section>

        {/* AI/ML Projects Section */}
        <section 
          id="ai-ml" 
          className="ai-ml-section"
          ref={(el) => registerSection('ai-ml', el)}
        >
          <div className="container">
            <h2 className="section-title ai-title">Machine Learning Projects</h2>
            <div className="projects-grid">
              {projects.aiMl.map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  theme="ai-ml"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Miscellaneous Projects Section */}
        <section 
          id="misc" 
          className="misc-section"
          ref={(el) => registerSection('misc', el)}
        >
          <div className="container">
            <h2 className="section-title misc-title">Miscellaneous Projects</h2>
            <div className="projects-grid">
              {projects.misc.map((project) => (
                <ProjectCard 
                  key={project.id}
                  project={project}
                  theme="misc"
                />
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section 
          id="contact" 
          className="contact-section"
          ref={(el) => registerSection('contact', el)}
        >
          <div className="container">
            <h2 className="section-title">Connect With Me</h2>
            <div className="contact-links">
              <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="contact-item linkedin">
                <div className="icon-container">
                  <i className="icon linkedin-icon"></i>
                </div>
                <span>LinkedIn</span>
              </a>
              <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="contact-item github">
                <div className="icon-container">
                  <i className="icon github-icon"></i>
                </div>
                <span>GitHub</span>
              </a>
              <Link to="/resume" className="contact-item resume">
                <div className="icon-container">
                  <i className="icon resume-icon"></i>
                </div>
                <span>Resume</span>
              </Link>
              <a href={`mailto:${contactInfo.email.personal}`} className="contact-item email">
                <div className="icon-container">
                  <i className="icon email-icon"></i>
                </div>
                <span>Email</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} {contactInfo.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default MainPortfolio;