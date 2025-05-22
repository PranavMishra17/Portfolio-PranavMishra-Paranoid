// Updated ProjectCard.js with proper image loading
import React, { useState } from 'react';
import TechStackBadge from './TechStackBadge';

const ProjectCard = ({ project, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageSrc, setImageSrc] = useState(project.mainImage?.startsWith('/') ? project.mainImage : `/${project.mainImage}`);
  const [imageError, setImageError] = useState(false);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Get fallback image based on theme
  const getFallbackImage = () => {
    if (theme === 'game-design') return '/assets/images/default/game_design_default.jpg';
    if (theme === 'ai-ml') return '/assets/images/default/ai_ml_default.jpg';
    if (theme === 'misc') return '/assets/images/default/misc_default.jpg';
    return '/assets/images/default/project_default.jpg';
  };

  // Handle image error
  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setImageSrc(getFallbackImage());
    }
  };

  // Get theme-specific classes
  const getThemeClasses = () => {
    if (theme === 'game-design') return 'game-card font-pixel';
    if (theme === 'ai-ml') return 'ai-card font-sans';
    if (theme === 'misc') return 'misc-card font-mono';
    return '';
  };

  // Handle gallery image with fallback
  const getGalleryImageSrc = (galleryImage) => {
    return galleryImage?.startsWith('/') ? galleryImage : `/${galleryImage}`;
  };
  
  return (
    <div className={`project-card ${getThemeClasses()}`}>
      <div className="project-image">
        <img 
          src={imageSrc} 
          alt={project.title}
          onError={handleImageError}
          onLoad={() => setImageError(false)}
        />

        <div className="project-links">
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link github">
              <img src="/assets/images/icons/github.png" alt="GitHub" className="icon-img" />
            </a>
          )}
          {project.demoLink && project.demoLink !== "" && (
            <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="project-link demo">
              <img src="/assets/images/icons/yt.png" alt="Demo" className="icon-img" />
            </a>
          )}
          {project.youtubeLink && project.youtubeLink !== "" && (
            <a href={project.youtubeLink} target="_blank" rel="noopener noreferrer" className="project-link youtube">
              <img src="/assets/images/icons/yt.png" alt="YouTube" className="icon-img" />
            </a>
          )}
          {project.websiteLink && project.websiteLink !== "" && (
            <a href={project.websiteLink} target="_blank" rel="noopener noreferrer" className="project-link website">
              <img src="/assets/images/icons/website.png" alt="Website" className="icon-img" />
            </a>
          )}
          {project.gallery && project.gallery.length > 0 && (
            <button onClick={toggleExpand} className="project-link gallery">
              <img src="/assets/images/icons/gallery.png" alt="Gallery" className="icon-img" />
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
                  src={getGalleryImageSrc(image)} 
                  alt={`${project.title} gallery ${index + 1}`} 
                  className="gallery-image"
                  onError={(e) => {
                    e.target.src = getFallbackImage();
                  }}
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