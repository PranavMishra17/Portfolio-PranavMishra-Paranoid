// PixelText.js
// Use this component for game project titles to create a pixel animation effect
import React, { useState, useEffect } from 'react';

const PixelText = ({ text, color = "#ff2d55", delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [isAnimating, setIsAnimating] = useState(true);
  
  useEffect(() => {
    let timeout;
    let index = 0;
    
    const animateText = () => {
      if (index <= text.length) {
        setDisplayText(text.substring(0, index));
        index++;
        timeout = setTimeout(animateText, 100);
      } else {
        setIsAnimating(false);
      }
    };
    
    const startAnimation = () => {
      setTimeout(() => {
        animateText();
      }, delay);
    };
    
    startAnimation();
    
    return () => clearTimeout(timeout);
  }, [text, delay]);
  
  return (
    <span 
      style={{ 
        fontFamily: "'Press Start 2P', cursive",
        color: color,
        position: 'relative',
        display: 'inline-block'
      }}
    >
      {displayText}
      {isAnimating && (
        <span 
          style={{ 
            display: 'inline-block',
            width: '10px',
            height: '15px',
            backgroundColor: color,
            animation: 'blink 0.7s infinite',
            marginLeft: '2px',
            verticalAlign: 'middle'
          }}
        ></span>
      )}
    </span>
  );
};

export default PixelText;