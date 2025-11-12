// src/utils/resumeUtils.js
// Utility functions for handling resume PDFs

/**
 * Get the first available PDF from a folder
 * Since we can't dynamically read directories in React, we'll check for common filenames
 */
export const getResumeFromFolder = async (folderPath) => {
  // Common PDF filename patterns to check
  const commonFilenames = [
    'resume.pdf',
    'cv.pdf',
    'Resume.pdf',
    'CV.pdf',
    'resume_ai.pdf',
    'resume_game.pdf',
    'ai_resume.pdf',
    'game_resume.pdf',
    'Pranav_Resume.pdf',
    'Pranav_CV.pdf',
    'resume_latest.pdf',
    'latest_resume.pdf'
  ];

  // Try each filename until one is found
  for (const filename of commonFilenames) {
    const fullPath = `${folderPath}/${filename}`;
    try {
      // Try to fetch the file to see if it exists
      const response = await fetch(fullPath, { method: 'HEAD' });
      if (response.ok) {
        return fullPath;
      }
    } catch (error) {
      // File doesn't exist, continue to next
      continue;
    }
  }

  // Fallback to a default path if no PDF is found
  return `${folderPath}/resume.pdf`;
};

/**
 * Get resume paths for both AI and Game Design
 */
export const getResumeConfig = async () => {
  const aiResume = await getResumeFromFolder('/resumes/ai');
  const gameResume = await getResumeFromFolder('/resumes/game');

  return {
    ai: aiResume,
    game: gameResume,
    default: 'ai' // AI resume as default
  };
};

/**
 * Synchronous version for immediate use (checks predefined filenames)
 */
export const getResumeConfigSync = () => {
  return {
    ai: '/resumes/ai/resume.pdf', // Will look for any PDF in this folder
    game: '/resumes/game/resume.pdf', // Will look for any PDF in this folder
    default: 'ai'
  };
};