// src/components/ResumeViewer.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { contactInfo } from '../data/projects';
import './ResumeViewer.css';

const ResumeViewer = () => {
  const [activeResume, setActiveResume] = useState('ai'); // AI as default
  const [resumePaths, setResumePaths] = useState({
    ai: '/resumes/ai/RESUMEai Pranav Mishra.pdf',
    game: '/resumes/game/RESUMEgd Pranav Mishra.pdf'
  });

  // Function to find the first PDF in a folder
  const findPdfInFolder = async (folderPath) => {
    // Try the actual PDF filenames first
    const commonFilenames = [
      'RESUMEai Pranav Mishra.pdf', // AI resume
      'RESUMEgd Pranav Mishra.pdf', // Game design resume  
      'resume.pdf', 'cv.pdf', 'Resume.pdf', 'CV.pdf',
      'resume_ai.pdf', 'resume_game.pdf', 'ai_resume.pdf', 'game_resume.pdf',
      'Pranav_Resume.pdf', 'Pranav_CV.pdf', 'latest_resume.pdf'
    ];

    for (const filename of commonFilenames) {
      const fullPath = `${folderPath}/${filename}`;
      try {
        const response = await fetch(fullPath, { method: 'HEAD' });
        if (response.ok) {
          return fullPath;
        }
      } catch (error) {
        continue;
      }
    }
    return `${folderPath}/resume.pdf`; // fallback
  };

  // Load resume paths on component mount
  useEffect(() => {
    const loadResumePaths = async () => {
      try {
        const aiPath = await findPdfInFolder('/resumes/ai');
        const gamePath = await findPdfInFolder('/resumes/game');
        
        setResumePaths({
          ai: aiPath,
          game: gamePath
        });
      } catch (error) {
        console.log('Using default resume paths');
        // Keep default paths if detection fails
      }
    };

    loadResumePaths();
  }, []);
  
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
            className={`resume-tab ${activeResume === 'ai' ? 'active' : ''}`}
            onClick={() => setActiveResume('ai')}
          >
            AI/ML Resume
          </button>
          <button 
            className={`resume-tab ${activeResume === 'game' ? 'active' : ''}`}
            onClick={() => setActiveResume('game')}
          >
            Game Design Resume
          </button>
        </div>
        
        <div className="resume-content">
          <iframe 
            src={resumePaths[activeResume]} 
            title={`${activeResume === 'ai' ? 'AI/ML' : 'Game Design'} Resume`}
            className="resume-frame"
          />
        </div>
        
        <div className="resume-actions">
          <a 
            href={resumePaths[activeResume]} 
            download
            className="download-button"
          >
            Download {activeResume === 'ai' ? 'AI/ML' : 'Game Design'} Resume
          </a>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;