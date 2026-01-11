



// TechStackBadge.js
// Add this component to your project cards to show the technologies used
import React from 'react';

const TechStackBadge = ({ tech, theme }) => {
  const getColor = () => {
    const colors = {
      // Game Development & Engines
      Unity: '#000000',
      'Unreal Engine 5': '#0e1128',
      'C#': '#239120',
      'C++': '#00599c',
      'SFML': '#8cc84b',
      Blender: '#f5792a',
      Rust: '#ce422b',

      // XR Technologies
      'XR Development': '#ff6b35',
      'Mixed Reality': '#ff8c42',

      // Web Development
      React: '#61dafb',
      'React 18': '#61dafb',
      'Next.js': '#000000',
      'Next.js 14': '#000000',
      JavaScript: '#f7df1e',
      TypeScript: '#3178c6',
      'Node.js': '#68a063',
      Express: '#000000',
      Flask: '#000000',
      Hono: '#e36002',
      'Tailwind CSS': '#06b6d4',

      // AI/ML Core
      Python: '#3776ab',
      'PyTorch': '#ee4c2c',
      'TensorFlow': '#ff6f00',
      LibTorch: '#ee4c2c',

      // AI/ML - LLMs & APIs
      'OpenAI': '#10a37f',
      'Gemini': '#4285f4',
      'Gemini API': '#4285f4',
      'Anthropic': '#cc9b7a',
      Deepgram: '#13ef93',

      // AI/ML - Frameworks & Tools
      'LangChain': '#00b894',
      'MCP': '#7c3aed',
      'AI-Agents': '#9c27b0',
      'Agentic AI': '#9c27b0',
      'Multi-Agent Systems': '#673ab7',
      'LiveKit': '#5b8def',

      // AI/ML - Specialized
      'Computer Vision': '#f39c12',
      'Transformer Models': '#e74c3c',
      'Vector Embeddings': '#6c5ce7',
      'Reinforcement Learning': '#27ae60',
      'Deep Learning': '#8e44ad',
      'Machine Learning': '#16a085',
      'MLOps': '#2ecc71',
      'Production RAG': '#00b894',

      // Medical & Healthcare
      'Medical Simulation': '#e74c3c',
      'Healthcare AI': '#c0392b',
      'Medical Imaging': '#e67e22',

      // Databases & Storage
      'Supabase': '#3ecf8e',
      'PostgreSQL': '#336791',
      'Redis': '#dc382d',

      // Cloud & DevOps
      'Azure AI Services': '#0078d4',
      'Docker': '#2496ed',
      'CICD Pipeline': '#2088ff',

      // Real-Time & Communication
      'WebRTC': '#333333',
      'WebSocket': '#010101',

      // Blockchain & Web3
      'Solana': '#9945ff',
      'Web3': '#f16822',
      'Web3 Integration': '#f16822',
      'Blockchain': '#21bf73',
      'Blockchain Technology': '#21bf73',
      'Smart Contracts': '#627eea',

      // Specialized Technologies
      'MetaHuman': '#313131',
      'Generative AI': '#9c27b0',
      'n8n': '#ff6d5a',

      // Authentication
      'JWT Authentication': '#000000',
      'Google OAuth': '#4285f4',

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