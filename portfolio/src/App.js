// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPortfolio from './MainPortfolio';
import ResumeViewer from './components/ResumeViewer';
import './App.css';

// The revamp lives at /v19 — see HANDOFF.md at the repo root. Lazy so its chunk never
// touches the shipping site at /.
const V19 = lazy(() => import('./variants/v19'));

const wait = <div style={{ minHeight: '100vh' }} />;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPortfolio />} />
        <Route path="/resume" element={<ResumeViewer />} />
        <Route path="/v19" element={<Suspense fallback={wait}><V19 /></Suspense>} />
      </Routes>
    </Router>
  );
}

export default App;
