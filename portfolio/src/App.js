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
const V6 = lazy(() => import('./variants/v6'));
const Bomb = lazy(() => import('./variants/bomb'));
const V8 = lazy(() => import('./variants/v8'));
const V9 = lazy(() => import('./variants/v9'));
const V10 = lazy(() => import('./variants/v10'));
const V11 = lazy(() => import('./variants/v11'));
const V12 = lazy(() => import('./variants/v12'));
const V13 = lazy(() => import('./variants/v13'));
const V14 = lazy(() => import('./variants/v14'));
const V15 = lazy(() => import('./variants/v15'));

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
        <Route path="/v6" element={<Suspense fallback={wait}><V6 /></Suspense>} />
        <Route path="/bomb" element={<Suspense fallback={wait}><Bomb /></Suspense>} />
        <Route path="/v8" element={<Suspense fallback={wait}><V8 /></Suspense>} />
        <Route path="/v9" element={<Suspense fallback={wait}><V9 /></Suspense>} />
        <Route path="/v10" element={<Suspense fallback={wait}><V10 /></Suspense>} />
        <Route path="/v11" element={<Suspense fallback={wait}><V11 /></Suspense>} />
        <Route path="/v12" element={<Suspense fallback={wait}><V12 /></Suspense>} />
        <Route path="/v13" element={<Suspense fallback={wait}><V13 /></Suspense>} />
        <Route path="/v14" element={<Suspense fallback={wait}><V14 /></Suspense>} />
        <Route path="/v15" element={<Suspense fallback={wait}><V15 /></Suspense>} />
      </Routes>
    </Router>
  );
}

export default App;
