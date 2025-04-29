// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPortfolio from './MainPortfolio';
import ResumeViewer from './components/ResumeViewer';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPortfolio />} />
        <Route path="/resume" element={<ResumeViewer />} />
      </Routes>
    </Router>
  );
}

export default App;