// src/components/ProjectCard.js
import React, { useState } from 'react';
import { getImageWithFallback } from '../data/projects';
import TechStackBadge from './TechStackBadge';

const ProjectCard = ({ project, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Get image with fallback
  const mainImage = getImageWithFallback(project.mainImage, theme);
  
  return (
    <div className={`project-card ${theme}-card`}>
      <div className="project-image">
        <img src={mainImage} alt={project.title} />
        <div className="project-links">
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link github">
              <i className="icon github-icon"></i>
            </a>
          )}
          {project.demoLink && project.demoLink !== "" && (
            <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="project-link demo">
              <i className="icon demo-icon"></i>
            </a>
          )}
          {project.websiteLink && project.websiteLink !== "" && (
            <a href={project.websiteLink} target="_blank" rel="noopener noreferrer" className="project-link website">
              <i className="icon website-icon"></i>
            </a>
          )}
          {project.gallery && project.gallery.length > 0 && (
            <button onClick={toggleExpand} className="project-link gallery">
              <i className="icon gallery-icon"></i>
            </button>
          )}
        </div>
      </div>
      <div className="project-info">
        <h3 className="project-title">{project.title}</h3>
        <span className="project-category">{project.category}</span>
        
        {/* Tech Stack */}
        <div className="tech-stack">
          {project.techStack && project.techStack.map((tech, i) => (
            <TechStackBadge key={i} tech={tech} theme={theme} />
          ))}
        </div>
        
        <p className="project-description">{project.description}</p>
        
        {/* Expanded Gallery View */}
        {isExpanded && project.gallery && project.gallery.length > 0 && (
          <div className="expanded-view">
            <div className="gallery-grid">
              {project.gallery.map((image, index) => (
                <img 
                  key={index} 
                  src={getImageWithFallback(image, theme)} 
                  alt={`${project.title} gallery ${index + 1}`} 
                  className="gallery-image"
                />
              ))}
            </div>
            <button className="close-gallery" onClick={toggleExpand}>
              Close Gallery
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;