// src/App.js
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// The site is src/variants/v19. The page it replaced is kept at /classic, loaded only if asked for.
const MainPortfolio = lazy(() => import('./MainPortfolio'));
const ResumeViewer = lazy(() => import('./components/ResumeViewer'));
const V19 = lazy(() => import('./variants/v19'));
const V19Resume = lazy(() => import('./variants/v19/Resume'));

const wait = <div style={{ minHeight: '100vh' }} />;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Suspense fallback={wait}><V19 /></Suspense>} />
        <Route path="/resume" element={<Suspense fallback={wait}><V19Resume /></Suspense>} />
        <Route path="/v19" element={<Navigate to="/" replace />} />
        <Route path="/v19/resume" element={<Navigate to="/resume" replace />} />
        <Route path="/classic" element={<Suspense fallback={wait}><MainPortfolio /></Suspense>} />
        <Route path="/classic/resume" element={<Suspense fallback={wait}><ResumeViewer /></Suspense>} />
      </Routes>
    </Router>
  );
}

export default App;
