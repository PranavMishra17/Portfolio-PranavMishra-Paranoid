



// TechStackBadge.js
// Add this component to your project cards to show the technologies used
import React from 'react';

const TechStackBadge = ({ tech, theme }) => {
  const getColor = () => {
    const colors = {
      Unity: '#000000',
      React: '#61dafb',
      Python: '#3776ab',
      'C#': '#239120',
      'TensorFlow': '#ff6f00',
      'PyTorch': '#ee4c2c',
      'Unreal': '#0e1128',
      'Solana': '#9945ff',
      'Azure': '#0078d4',
      'OpenAI': '#10a37f',
      'Ethereum': '#627eea',
      default: '#888888'
    };
    
    return colors[tech] || colors.default;
  };
  
  const getTextColor = (bgColor) => {
    // Simple function to determine if text should be white or black based on background brightness
    const r = parseInt(bgColor.substr(1, 2), 16);
    const g = parseInt(bgColor.substr(3, 2), 16);
    const b = parseInt(bgColor.substr(5, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 125 ? '#000000' : '#ffffff';
  };
  
  const bgColor = getColor();
  const textColor = getTextColor(bgColor);
  
  return (
    <span 
      style={{
        display: 'inline-block',
        padding: '2px 8px',
        margin: '2px',
        borderRadius: '4px',
        fontSize: '10px',
        fontWeight: 'bold',
        backgroundColor: bgColor,
        color: textColor,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}
    >
      {tech}
    </span>
  );
};

export default TechStackBadge;