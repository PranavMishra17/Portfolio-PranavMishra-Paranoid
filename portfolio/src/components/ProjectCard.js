// src/components/ProjectCard.js - Updated with Fullscreen Lightbox
import React, { useState } from 'react';
import TechStackBadge from './TechStackBadge';
import FullscreenLightbox from './FullscreenLightbox';

const ProjectCard = ({ project, theme }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageSrc, setImageSrc] = useState(project.mainImage?.startsWith('/') ? project.mainImage : `/${project.mainImage}`);
  const [imageError, setImageError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Feature flag: toggle LIVE badge display site-wide
  // Set to `false` to keep badge disabled even when project.websiteLink exists
  const SHOW_LIVE_BADGE = false;

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

  // Get all images for lightbox (main image + gallery)
  const getAllImages = () => {
    const images = [imageSrc];
    if (project.gallery && project.gallery.length > 0) {
      project.gallery.forEach(img => {
        images.push(getGalleryImageSrc(img));
      });
    }
    return images;
  };

  // Open lightbox from main image
  const openLightboxFromMain = () => {
    setLightboxIndex(0);
    setLightboxOpen(true);
  };

  // Open lightbox from gallery image
  const openLightboxFromGallery = (galleryIndex) => {
    setLightboxIndex(galleryIndex + 1); // +1 because main image is at index 0
    setLightboxOpen(true);
  };

  // Open lightbox from gallery button (show all images starting from first gallery image)
  const openFullGallery = () => {
    setLightboxIndex(1); // Start from first gallery image
    setLightboxOpen(true);
  };
  
  return (
    <>
      <div className={`project-card ${getThemeClasses()}`}>
        <div className="project-image">
          {/* LIVE Badge - shown only if feature flag enabled and websiteLink exists */}
          {SHOW_LIVE_BADGE && project.websiteLink && project.websiteLink !== "" && (
            <div className="live-badge">LIVE</div>
          )}
          <img 
            src={imageSrc} 
            alt={project.title}
            onError={handleImageError}
            onLoad={() => setImageError(false)}
            onClick={openLightboxFromMain}
            style={{ cursor: 'pointer' }}
          />

          <div className="project-links">
            {project.githubLink && (
              <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link github">
                <img src="/assets/images/icons/github.png" alt="GitHub" className="icon-img" />
              </a>
            )}
            {project.demoLink && project.demoLink !== "" && (
              <a href={project.demoLink} target="_blank" rel="noopener noreferrer" className="project-link demo">
                <img src="/assets/images/icons/demo.png" alt="Demo" className="icon-img" />
              </a>
            )}
            {project.youtubeLink && project.youtubeLink !== "" && (
              <a href={project.youtubeLink} target="_blank" rel="noopener noreferrer" className="project-link youtube">
                <img src="/assets/images/icons/youtube.png" alt="YouTube" className="icon-img" />
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
              <div className="gallery-controls" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                marginBottom: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <h4 style={{ margin: 0, color: 'white', fontSize: '1.1rem' }}>Gallery</h4>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <span style={{ fontSize: '1.2rem' }}>🔍</span>
                  <button 
                    onClick={openFullGallery}
                    className="fullscreen-gallery-btn"
                    style={{
                      background: 'linear-gradient(135deg, #3d5afe 0%, #304ffe 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 20px',
                      borderRadius: '25px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 4px 15px rgba(61, 90, 254, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1)',
                      minWidth: '140px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #304ffe 0%, #3d5afe 100%)';
                      e.target.style.transform = 'translateY(-2px) scale(1.02)';
                      e.target.style.boxShadow = '0 8px 25px rgba(61, 90, 254, 0.5), 0 4px 8px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #3d5afe 0%, #304ffe 100%)';
                      e.target.style.transform = 'translateY(0) scale(1)';
                      e.target.style.boxShadow = '0 4px 15px rgba(61, 90, 254, 0.4), 0 2px 4px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseDown={(e) => {
                      e.target.style.transform = 'translateY(0) scale(0.98)';
                    }}
                    onMouseUp={(e) => {
                      e.target.style.transform = 'translateY(-2px) scale(1.02)';
                    }}
                  >
                    View Fullscreen
                  </button>
                </div>
              </div>
              
              <div className="gallery-grid">
                {project.gallery.map((image, index) => (
                  <img 
                    key={index} 
                    src={getGalleryImageSrc(image)} 
                    alt={`${project.title} gallery ${index + 1}`} 
                    className="gallery-image"
                    style={{ cursor: 'pointer' }}
                    onClick={() => openLightboxFromGallery(index)}
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

      {/* Fullscreen Lightbox */}
      <FullscreenLightbox
        images={getAllImages()}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        initialIndex={lightboxIndex}
      />
    </>
  );
};

export default ProjectCard;