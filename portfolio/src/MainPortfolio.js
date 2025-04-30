// src/MainPortfolio.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from './components/ParticleBackground';
import PixelText from './components/PixelText';
import ThemeSwitch from './components/ThemeSwitch';
import ProjectTabs from './components/ProjectTabs';
import ProjectCard from './components/ProjectCard';
import { projects, contactInfo, getImageWithFallback } from './data/projects';

function MainPortfolio() {
  const [activeSection, setActiveSection] = useState('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionsRef = useRef({});

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
          className="about-section"
          ref={(el) => registerSection('about', el)}
        >
          <ParticleBackground />
          <div className="container">
            <div className="about-content">
              <div className="profile-image">
                <div className="profile-img-container">
                  <img src={getImageWithFallback("", "profile")} alt={contactInfo.name} />
                </div>
              </div>
              <div className="about-text">
                <h1 className="fade-in">{contactInfo.name}</h1>
                <h2 className="fade-in delay-1">{contactInfo.title}</h2>
                <p className="fade-in delay-2">{contactInfo.bio}</p>
                <div className="cta-buttons fade-in delay-4">
                  <button className="primary-btn" onClick={() => scrollToSection('game-design')}>
                    View Projects
                  </button>
                  <button className="secondary-btn" onClick={() => scrollToSection('contact')}>
                    Connect
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="scroll-indicator" onClick={() => scrollToSection('game-design')}>
            <div className="mouse">
              <div className="wheel"></div>
            </div>
            <div>
              <span className="scroll-arrow"></span>
            </div>
          </div>
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