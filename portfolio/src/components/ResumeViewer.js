// src/components/ResumeViewer.js
import React, { useState } from 'react';

const ResumeViewer = () => {
  const [activeResume, setActiveResume] = useState('game'); // Default to game design resume
  
  return (
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
        {activeResume === 'game' ? (
          <iframe 
            src="/assets/resume_game.pdf" 
            title="Game Design Resume" 
            className="resume-frame"
          />
        ) : (
          <iframe 
            src="/assets/resume_ai.pdf" 
            title="AI/ML Resume" 
            className="resume-frame"
          />
        )}
      </div>
      
      <div className="resume-actions">
        <a 
          href={activeResume === 'game' ? '/assets/resume_game.pdf' : '/assets/resume_ai.pdf'} 
          download
          className="download-button"
        >
          Download Resume
        </a>
      </div>
    </div>
  );
};

export default ResumeViewer;