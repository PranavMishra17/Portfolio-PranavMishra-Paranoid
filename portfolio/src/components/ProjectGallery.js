


// ProjectGallery.js
// Create a lightbox gallery for each project to showcase multiple screenshots
import React, { useState } from 'react';

const ProjectGallery = ({ images }) => {
  const [activeImage, setActiveImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  
  const openLightbox = (index) => {
    setActiveImage(index);
    setIsLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  const closeLightbox = () => {
    setIsLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };
  
  return (
    <div className="project-gallery">
      <div className="thumbnail-grid">
        {images.map((image, index) => (
          <div 
            key={index} 
            className="thumbnail"
            onClick={() => openLightbox(index)}
            style={{
              width: '80px',
              height: '50px',
              margin: '2px',
              cursor: 'pointer',
              overflow: 'hidden',
              borderRadius: '4px'
            }}
          >
            <img 
              src={image} 
              alt={`Project screenshot ${index + 1}`} 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        ))}
      </div>
      
      {isLightboxOpen && (
        <div 
          className="lightbox"
          onClick={closeLightbox}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
          }}
        >
          <button 
            className="close-button"
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            &times;
          </button>
          
          <button 
            className="nav-button prev"
            onClick={prevImage}
            style={{
              position: 'absolute',
              left: '20px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            &#10094;
          </button>
          
          <div 
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90%',
              maxHeight: '80%'
            }}
          >
            <img 
              src={images[activeImage]} 
              alt={`Project screenshot ${activeImage + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
          
          <button 
            className="nav-button next"
            onClick={nextImage}
            style={{
              position: 'absolute',
              right: '20px',
              background: 'none',
              border: 'none',
              fontSize: '24px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            &#10095;
          </button>
          
          <div 
            className="image-counter"
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              color: 'white',
              fontSize: '14px'
            }}
          >
            {activeImage + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectGallery;
