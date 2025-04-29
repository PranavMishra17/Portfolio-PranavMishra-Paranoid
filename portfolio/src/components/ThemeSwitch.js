// ThemeSwitch.js
// Add this component to toggle between light and dark mode
import React, { useState, useEffect } from 'react';

const ThemeSwitch = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);
  
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
  
  return (
    <button 
      onClick={toggleTheme}
      className="theme-switch"
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        zIndex: 1000,
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: isDarkMode ? '#f5f5f5' : '#0a0a0a',
        border: '2px solid ' + (isDarkMode ? '#0a0a0a' : '#f5f5f5'),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      aria-label="Toggle theme"
    >
      <div style={{
        color: isDarkMode ? '#0a0a0a' : '#f5f5f5',
        fontSize: '18px'
      }}>
        {isDarkMode ? '☀️' : '🌙'}
      </div>
    </button>
  );
};

export default ThemeSwitch;