// src/components/ResumeViewer.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ResumeViewer.css';

const ResumeViewer = () => {
  const [activeResume, setActiveResume] = useState('game');
  
  return (
    <div className="resume-page">
      <header className="resume-header">
        <Link to="/" className="back-button">
          <span className="back-icon">←</span> Back to Portfolio
        </Link>
        <h1>My Resume</h1>
      </header>
      
      <div className="resume-viewer">
        <div className="resume-tabs">
          <button 
            className={`resume-tab ${activeResume === 'game' ? 'active' : ''}`}
            onClick={() => setActiveResume('game')}
          >
            Game Design Resume
          </button>
          <button 
            className={`resume-tab ${activeResume === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveResume('ai')}
          >
            AI/ML Resume
          </button>
        </div>
        
        <div className="resume-content">
          <iframe 
            src={activeResume === 'game' ? 'resume_game.pdf' : 'resume_ai.pdf'} 
            title={`${activeResume === 'game' ? 'Game Design' : 'AI/ML'} Resume`}
            className="resume-frame"
          />
        </div>
        
        <div className="resume-actions">
          <a 
            href={activeResume === 'game' ? 'resume_game.pdf' : 'resume_ai.pdf'} 
            download
            className="download-button"
          >
            Download Resume
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;