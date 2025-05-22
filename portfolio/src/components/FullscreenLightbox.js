// src/components/FullscreenLightbox.js
import React, { useState, useEffect } from 'react';

const FullscreenLightbox = ({ images, isOpen, onClose, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;
      
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          navigatePrev();
          break;
        case 'ArrowRight':
          navigateNext();
          break;
      }
    };

    const handleBodyScroll = () => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'auto';
      }
    };

    handleBodyScroll();
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isOpen]);

  const navigateNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const navigatePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!isOpen || !images.length) return null;

  return (
    <div 
      className="fullscreen-lightbox"
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        animation: 'fadeIn 0.3s ease'
      }}
    >
      {/* Close Button */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          border: 'none',
          color: 'white',
          fontSize: '24px',
          cursor: 'pointer',
          padding: '10px',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backdropFilter: 'blur(5px)',
          transition: 'all 0.3s ease',
          zIndex: 10001
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.2)';
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'rgba(255, 255, 255, 0.1)';
          e.target.style.transform = 'scale(1)';
        }}
      >
        ✕
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigatePrev();
            }}
            style={{
              position: 'absolute',
              left: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '15px 20px',
              borderRadius: '50px',
              backdropFilter: 'blur(5px)',
              transition: 'all 0.3s ease',
              zIndex: 10001
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            &#10094;
          </button>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              navigateNext();
            }}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '15px 20px',
              borderRadius: '50px',
              backdropFilter: 'blur(5px)',
              transition: 'all 0.3s ease',
              zIndex: 10001
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.2)';
              e.target.style.transform = 'translateY(-50%) scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'translateY(-50%) scale(1)';
            }}
          >
            &#10095;
          </button>
        </>
      )}

      {/* Main Image */}
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: '90vw',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <img 
          src={images[currentIndex]} 
          alt={`Image ${currentIndex + 1}`}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            borderRadius: '8px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
          }}
        />
        
        {/* Image Counter */}
        {images.length > 1 && (
          <div 
            style={{
              marginTop: '20px',
              color: 'white',
              fontSize: '16px',
              background: 'rgba(0, 0, 0, 0.7)',
              padding: '8px 16px',
              borderRadius: '20px',
              backdropFilter: 'blur(5px)'
            }}
          >
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div 
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '8px',
            maxWidth: '80vw',
            overflowX: 'auto',
            padding: '10px',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '30px',
            backdropFilter: 'blur(5px)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((image, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              style={{
                width: '60px',
                height: '40px',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: currentIndex === index ? '2px solid #3d5afe' : '2px solid transparent',
                opacity: currentIndex === index ? 1 : 0.6,
                transition: 'all 0.3s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                if (currentIndex !== index) {
                  e.target.style.opacity = '0.8';
                }
              }}
              onMouseLeave={(e) => {
                if (currentIndex !== index) {
                  e.target.style.opacity = '0.6';
                }
              }}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default FullscreenLightbox;