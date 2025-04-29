// AnimatedSkillBar.js
// Add this component to your About section to showcase your skills with animated bars
import React, { useEffect, useState, useRef } from 'react';

const AnimatedSkillBar = ({ skill, percentage, color }) => {
  const [width, setWidth] = useState(0);
  const skillRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setTimeout(() => {
            setWidth(percentage);
          }, 300);
        }
      },
      { threshold: 0.1 }
    );
    
    if (skillRef.current) {
      observer.observe(skillRef.current);
    }
    
    return () => {
      if (skillRef.current) {
        observer.unobserve(skillRef.current);
      }
    };
  }, [percentage]);
  
  return (
    <div 
      ref={skillRef}
      className="skill-bar"
      style={{
        marginBottom: '15px'
      }}
    >
      <div 
        className="skill-info"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '5px'
        }}
      >
        <span 
          className="skill-name"
          style={{
            fontWeight: 500
          }}
        >
          {skill}
        </span>
        <span 
          className="skill-percentage"
          style={{
            opacity: 0.7
          }}
        >
          {percentage}%
        </span>
      </div>
      <div 
        className="skill-progress-bg"
        style={{
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          overflow: 'hidden'
        }}
      >
        <div 
          className="skill-progress-fill"
          style={{
            height: '100%',
            width: `${width}%`,
            backgroundColor: color || '#3d5afe',
            borderRadius: '4px',
            transition: 'width 1s ease-out'
          }}
        ></div>
      </div>
    </div>
  );
};

export default AnimatedSkillBar;