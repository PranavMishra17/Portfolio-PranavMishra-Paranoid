// src/components/ExperienceCard.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import TechStackBadge from './TechStackBadge';
import { getCompanyLogoWithFallback } from '../data/experience';

const ExperienceCard = ({ experience, index }) => {
  const [logoSrc, setLogoSrc] = useState(
    getCompanyLogoWithFallback(experience.companyLogo, experience.company)
  );
  const [logoError, setLogoError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle logo error
  const handleLogoError = () => {
    if (!logoError) {
      setLogoError(true);
      setLogoSrc('/assets/images/default/company_default.png');
    }
  };

  const handleCardClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div 
      className={`experience-card ${isExpanded ? 'expanded' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.2
      }}
    >
      {/* Company Logo Section */}
      <div className="experience-logo-section" onClick={handleCardClick}>
        <div className="experience-logo-container">
            <div className="logo-overlay">
            <div className="company-name-overlay">
              {experience.company}
            </div>
            <div className="job-title-overlay">
              {experience.title}
            </div>
          </div>
          <img 
            src={logoSrc}
            alt={`${experience.company} logo`}
            className="experience-logo"
            onError={handleLogoError}
            onLoad={() => setLogoError(false)}
          />
        </div>
      </div>
      
      {/* Content Section */}
      <div className="experience-content">
        <div className="experience-header">
          <div className="experience-title-section">
            <h3 className="experience-title">
              {experience.title}
            </h3>
            <h4 className="experience-company-text">{experience.company}</h4>
          </div>
          <div className="experience-meta">
            <span className="experience-duration">{experience.duration}</span>
            <span className="experience-location">{experience.location}</span>
          </div>
        </div>

        <div className="experience-description">
          <ul className="experience-bullets">
            {experience.description.map((item, itemIndex) => (
              <li key={itemIndex}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="tech-stack">
          {experience.techStack && experience.techStack.slice(0, 8).map((tech, i) => (
            <TechStackBadge key={i} tech={tech} />
          ))}
        </div>

        {/* Action Links */}
        <div className="experience-links">
          {experience.links?.website && (
            <a 
              href={experience.links.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="experience-link website"
              title="Visit Website"
            >
              <img src="/assets/images/icons/website.png" alt="Website" />
            </a>
          )}
          {experience.links?.github && (
            <a 
              href={experience.links.github} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="experience-link github"
              title="View on GitHub"
            >
              <img src="/assets/images/icons/github.png" alt="GitHub" />
            </a>
          )}
          {experience.links?.demo && experience.links.demo !== "" && (
            <a 
              href={experience.links.demo} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="experience-link demo"
              title="View Demo"
            >
              <img src="/assets/images/icons/demo.png" alt="Demo" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ExperienceCard;