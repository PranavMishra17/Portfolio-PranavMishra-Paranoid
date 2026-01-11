// src/MainPortfolio.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ParticleBackground from './components/ParticleBackground';
import PixelText from './components/PixelText';
import ThemeSwitch from './components/ThemeSwitch';
import ProjectTabs from './components/ProjectTabs';
import ProjectCard from './components/ProjectCard';
import TrophyButton from './components/TrophyButton';
import PublicationsSection from './components/PublicationsSection';
import MinimalContactBelt from './components/MinimalContactBelt';
import CollapsibleSectionTabs from './components/CollapsibleSectionTabs';
import ExperienceModal from './components/ExperienceModal';
import { projects, contactInfo, getImageWithFallback } from './data/projects';
import ConnectSlate, { ConnectButton } from './components/ConnectSlate';
import './styles/About.css';

function MainPortfolio() {
  const [activeSection, setActiveSection] = useState('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionsRef = useRef({});
  const [storyOpen, setStoryOpen] = useState(false);
  const [experienceModalOpen, setExperienceModalOpen] = useState(false);
  const [connectSlateOpen, setConnectSlateOpen] = useState(false);

  const toggleConnectSlate = useCallback(() => {
    console.log('[MainPortfolio] toggleConnectSlate called, current state:', connectSlateOpen);
    setConnectSlateOpen((prev) => {
      console.log('[MainPortfolio] Setting connectSlateOpen from', prev, 'to', !prev);
      return !prev;
    });
  }, [connectSlateOpen]);

  const closeConnectSlate = useCallback(() => {
    console.log('[MainPortfolio] closeConnectSlate called');
    setConnectSlateOpen(false);
  }, []);

  const scrollToSection = (sectionId) => {
    if (sectionId === 'contact') {
      console.log('[MainPortfolio] Opening connect slate via nav');
      setConnectSlateOpen(true);
      setMenuOpen(false);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 60,
        behavior: 'smooth',
      });
      setActiveSection(sectionId);
      setMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      const sections = Object.keys(sectionsRef.current);

      for (const section of sections) {
        const element = sectionsRef.current[section];
        if (element) {
          const { offsetTop, offsetHeight } = element;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const registerSection = (id, element) => {
    sectionsRef.current[id] = element;
  };

  useEffect(() => {
    console.log('[MainPortfolio] connectSlateOpen changed to:', connectSlateOpen);
  }, [connectSlateOpen]);

  return (
    <div className="portfolio-app">
      <ThemeSwitch />

      <header className="header">
        <div className="header-left">
          <a
            href="https://github.com/sponsors/PranavMishra17"
            target="_blank"
            rel="noopener noreferrer"
            className="sponsor-btn"
            title="Sponsor me"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </a>
          <div className="logo">
            <span className="logo-first">Pranav P. Mishra</span>
            <span className="logo-last"> | AI/ML Intern @ WheelPrice</span>
          </div>
        </div>
        <div
          className={`mobile-menu-button ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <nav className={`nav-menu ${menuOpen ? 'open' : ''}`}>
          <ul>
            <li className={activeSection === 'about' ? 'active' : ''}>
              <button onClick={() => scrollToSection('about')}>About Me</button>
            </li>

            <li className={activeSection === 'ai-ml' ? 'active' : ''}>
              <button onClick={() => scrollToSection('ai-ml')}>AI / ML</button>
            </li>

            <li className={activeSection === 'research' ? 'active' : ''}>
              <button onClick={() => scrollToSection('research')}>
                Research
              </button>
            </li>

            <li className={activeSection === 'game-design' ? 'active' : ''}>
              <button onClick={() => scrollToSection('game-design')}>
                Game Design
              </button>
            </li>

            <li className={activeSection === 'misc' ? 'active' : ''}>
              <button onClick={() => scrollToSection('misc')}>Misc</button>
            </li>

            <li className={activeSection === 'contact' ? 'active' : ''}>
              <button onClick={() => scrollToSection('about')}>Connect</button>
            </li>
            <li>
              <Link to="/resume" className="nav-link">
                Resume
              </Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <section
          id="about"
          className={`about-section ${storyOpen ? 'story-active' : ''}`}
          ref={(el) => registerSection('about', el)}
        >
          <ParticleBackground />
          <div className="container">
            <div className="about-content">
              <div className="profile-container" style={{ position: 'relative' }}>
                <TrophyButton onStoryOpen={setStoryOpen} />
                <motion.div
                  className="profile-image"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    type: 'spring',
                    stiffness: 100,
                  }}
                >
                  {/* Wrapper for connect button positioning - does NOT affect image styles */}
                  <div className="profile-img-wrapper" style={{ position: 'relative' }}>
                    <div className="profile-img-container">
                      <img
                        src={getImageWithFallback('', 'profile')}
                        alt={contactInfo.name}
                      />
                      <div className="profile-img-glow"></div>
                    </div>

                    {/* Connect Button - positioned relative to wrapper */}
                    <ConnectButton
                      isOpen={connectSlateOpen}
                      onClick={toggleConnectSlate}
                    />

                    {/* Connect Slate - appears below */}
                    <ConnectSlate
                      open={connectSlateOpen}
                      onClose={closeConnectSlate}
                      inline={true}
                    />
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
                      boxShadow: '0 10px 25px rgba(61, 90, 254, 0.3)',
                    }}
                    onClick={() => scrollToSection('ai-ml')}
                  >
                    View Projects
                  </motion.button>
                  <motion.button
                    className="secondary-btn"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                    }}
                    onClick={toggleConnectSlate}
                  >
                    Connect
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </div>
          <motion.div
            className="scroll-indicator"
            onClick={() => scrollToSection('ai-ml')}
            animate={{
              y: [0, 10, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              repeat: Infinity,
              duration: 2,
              ease: 'easeInOut',
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

        <CollapsibleSectionTabs
          experienceSection={{
            isOpen: false,
            component: <div></div>,
          }}
          publicationsSection={{
            isOpen: false,
            component: null,
          }}
          onExperienceToggle={() => setExperienceModalOpen(true)}
          onPublicationsToggle={() => {}}
        />

        <div className="projects-navigation-section">
          <div className="container">
            <ProjectTabs
              activeTab={activeSection}
              onTabChange={(tabId) => scrollToSection(tabId)}
            />
          </div>
        </div>

        <section
          id="ai-ml"
          className="ai-ml-section"
          ref={(el) => registerSection('ai-ml', el)}
        >
          <div className="container">
            <h2 className="section-title ai-title">AI-ML Projects</h2>
            <div className="projects-grid">
              {projects.aiMl.map((project) => (
                <ProjectCard key={project.id} project={project} theme="ai-ml" />
              ))}
            </div>
          </div>
        </section>

        <PublicationsSection ref={(el) => registerSection('research', el)} />

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

        <section
          id="misc"
          className="misc-section"
          ref={(el) => registerSection('misc', el)}
        >
          <div className="container">
            <h2 className="section-title misc-title">Miscellaneous Projects</h2>
            <div className="projects-grid">
              {projects.misc.map((project) => (
                <ProjectCard key={project.id} project={project} theme="misc" />
              ))}
            </div>
          </div>
        </section>

        <MinimalContactBelt ref={(el) => registerSection('contact', el)} />

        <ExperienceModal
          isOpen={experienceModalOpen}
          onClose={() => setExperienceModalOpen(false)}
        />
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} {contactInfo.name}. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MainPortfolio;