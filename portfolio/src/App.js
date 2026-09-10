// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPortfolio from './MainPortfolio';
import ResumeViewer from './components/ResumeViewer';
import './App.css';

// Revamp proposals — see PORTFOLIO-BRIEF.md at the repo root. Each variant is additive and
// self-contained, and lazy-loaded so one variant's chunk never affects another route.
const VariantsHub = lazy(() => import('./variants/hub'));
const V1 = lazy(() => import('./variants/v1'));
const V2 = lazy(() => import('./variants/v2'));
const V3 = lazy(() => import('./variants/v3'));
const V4 = lazy(() => import('./variants/v4'));
const V5 = lazy(() => import('./variants/v5'));

const wait = <div style={{ minHeight: '100vh' }} />;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPortfolio />} />
        <Route path="/resume" element={<ResumeViewer />} />
        <Route path="/variants" element={<Suspense fallback={wait}><VariantsHub /></Suspense>} />
        <Route path="/v1" element={<Suspense fallback={wait}><V1 /></Suspense>} />
        <Route path="/v2" element={<Suspense fallback={wait}><V2 /></Suspense>} />
        <Route path="/v3" element={<Suspense fallback={wait}><V3 /></Suspense>} />
        <Route path="/v4" element={<Suspense fallback={wait}><V4 /></Suspense>} />
        <Route path="/v5" element={<Suspense fallback={wait}><V5 /></Suspense>} />
      </Routes>
    </Router>
  );
}

export default App;
