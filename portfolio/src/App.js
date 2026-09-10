// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPortfolio from './MainPortfolio';
import ResumeViewer from './components/ResumeViewer';
import VariantsHub from './variants/hub';
import V1 from './variants/v1';
import V2 from './variants/v2';
import V3 from './variants/v3';
import V4 from './variants/v4';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPortfolio />} />
        <Route path="/resume" element={<ResumeViewer />} />
        {/* Revamp proposals — see PORTFOLIO-BRIEF.md at the repo root. Each variant is additive and self-contained. */}
        <Route path="/variants" element={<VariantsHub />} />
        <Route path="/v1" element={<V1 />} />
        <Route path="/v2" element={<V2 />} />
        <Route path="/v3" element={<V3 />} />
        <Route path="/v4" element={<V4 />} />
      </Routes>
    </Router>
  );
}

export default App;
