



// TechStackBadge.js
// Add this component to your project cards to show the technologies used
import React from 'react';

const TechStackBadge = ({ tech, theme }) => {
  const getColor = () => {
    const colors = {
      // Game Development
      Unity: '#000000',
      'Unreal': '#0e1128',
      'C#': '#239120',
      'C++': '#00599c',
      VR: '#ff6b35',
      AR: '#ff8c42',
      'Game Development': '#8e44ad',
      'Mobile': '#34495e',
      
      // Web Development
      React: '#61dafb',
      'React.js': '#61dafb',
      JavaScript: '#f7df1e',
      'JavaScript ES6+': '#f7df1e',
      'CSS3': '#1572b6',
      'HTML5': '#e34f26',
      
      // AI/ML
      Python: '#3776ab',
      'TensorFlow': '#ff6f00',
      'PyTorch': '#ee4c2c',
      'Scikit-learn': '#f7931e',
      'OpenAI': '#10a37f',
      'AI Agents': '#9c27b0',
      'Multi-Agent Systems': '#673ab7',
      NLP: '#2196f3',
      'LangChain': '#00b894',
      'Vector Embeddings': '#6c5ce7',
      'Transformer Models': '#e74c3c',
      'Machine Learning': '#27ae60',
      'Deep Learning': '#8e44ad',
      'Computer Vision': '#f39c12',
      'Neural Networks': '#e67e22',
      LGBM: '#3498db',
      'Random Forest': '#16a085',
      'Bayesian Networks': '#9b59b6',
      'Decision Theory': '#34495e',
      'Sports Analytics': '#1abc9c',
      
      // Cloud & Services
      Azure: '#0078d4',
      'Azure OpenAI': '#0078d4',
      'Azure Speech Services': '#0078d4',
      'Cosmos DB': '#0078d4',
      Flask: '#000000',
      
      // Blockchain
      'Solana': '#9945ff',
      'Ethereum': '#627eea',
      'Web3': '#f16822',
      'Blockchain': '#21bf73',
      'NFT': '#ff6b6b',
      
      // Databases & Tools
      'Pinecone': '#000000',
      'Context API': '#61dafb',
      'SerpAPI': '#4285f4',
      'Cargo': '#dea584',
      'Rust': '#ce422b',
      'MetaHuman': '#313131',
      'Omniverse': '#76b900',
      'Healthcare': '#e74c3c',
      'DPT': '#3498db',
      'UNet': '#9b59b6',
      'ResNet': '#e67e22',
      
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