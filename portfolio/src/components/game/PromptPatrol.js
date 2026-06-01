// portfolio/src/components/game/PromptPatrol.js
//
// React wrapper: mounts the canvas, runs the rAF loop, routes mouse +
// touch input to the engine, and renders the DOM overlays for title /
// game-over / leaderboard panels.

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Engine, STATE } from './engine';
import { unlock as unlockAudio } from './audio';
import './PromptPatrol.css';

const PERSONAL_BEST_KEY = 'pp_personal_best_v1';

const readPersonalBest = () => {
  try {
    const raw = localStorage.getItem(PERSONAL_BEST_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (typeof v.score !== 'number') return null;
    return v;
  } catch {
    return null;
  }
};

const writePersonalBest = (entry) => {
  try {
    localStorage.setItem(PERSONAL_BEST_KEY, JSON.stringify(entry));
  } catch {}
};

const PromptPatrol = ({ onClose }) => {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const engineRef = useRef(null);
  const rafRef = useRef(0);
  const lastTimeRef = useRef(0);

  const [gameState, setGameState] = useState(STATE.TITLE);
  const [scoreSnap, setScoreSnap] = useState({ score: 0, lives: 3, wave: 1 });
  const [personalBest, setPersonalBest] = useState(() => readPersonalBest());
  const [initials, setInitials] = useState('');

  // ----------------------------------------------------------
  // Boot engine + rAF loop
  // ----------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const eng = new Engine({
      canvas,
      onStateChange: (next, snap) => {
        setGameState(next);
        setScoreSnap(snap);
      },
      onScoreChange: (snap) => setScoreSnap(snap),
    });
    engineRef.current = eng;

    const setupSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.round(eng.W * dpr);
      canvas.height = Math.round(eng.H * dpr);
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };
    setupSize();
    const onResize = () => setupSize();
    window.addEventListener('resize', onResize);

    const loop = (now) => {
      const last = lastTimeRef.current || now;
      const dtMs = Math.min(48, now - last); // clamp at ~20fps min to avoid huge dt
      lastTimeRef.current = now;
      eng.tick(dtMs);
      eng.render();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // ----------------------------------------------------------
  // Personal best on game over
  // ----------------------------------------------------------
  useEffect(() => {
    if (gameState !== STATE.GAMEOVER_LIVES && gameState !== STATE.GAMEOVER_BOMB) return;
    const score = scoreSnap.score;
    if (!personalBest || score > personalBest.score) {
      const next = { score, wave: scoreSnap.wave, ts: Date.now() };
      writePersonalBest(next);
      setPersonalBest(next);
    }
  }, [gameState, scoreSnap, personalBest]);

  // ----------------------------------------------------------
  // Input
  // ----------------------------------------------------------

  const canvasToLogical = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = engineRef.current.W / rect.width;
    const scaleY = engineRef.current.H / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const onMouseMove = useCallback((e) => {
    if (!engineRef.current) return;
    const { x, y } = canvasToLogical(e.clientX, e.clientY);
    engineRef.current.setAim(x, y);
  }, []);

  const onMouseDown = useCallback((e) => {
    if (!engineRef.current) return;
    if (e.button !== 0 && e.button !== undefined) return;
    // Browsers gate AudioContext on a real user gesture — unlock on
    // every mousedown so the very first interaction starts audio.
    unlockAudio();
    if (gameState === STATE.TITLE) {
      engineRef.current.start();
      return;
    }
    if (gameState === STATE.PLAYING) {
      engineRef.current.inputDown();
    }
  }, [gameState]);

  const onMouseUp = useCallback(() => {
    if (!engineRef.current) return;
    if (gameState === STATE.PLAYING) {
      engineRef.current.inputUp();
    }
  }, [gameState]);

  const onTouchStart = useCallback((e) => {
    if (e.touches.length === 0) return;
    unlockAudio();
    const t = e.touches[0];
    const pt = canvasToLogical(t.clientX, t.clientY);
    engineRef.current.setAim(pt.x, pt.y);
    if (gameState === STATE.TITLE) {
      engineRef.current.start();
    } else if (gameState === STATE.PLAYING) {
      engineRef.current.inputDown();
    }
    e.preventDefault();
  }, [gameState]);

  const onTouchMove = useCallback((e) => {
    if (e.touches.length === 0) return;
    const t = e.touches[0];
    const pt = canvasToLogical(t.clientX, t.clientY);
    engineRef.current.setAim(pt.x, pt.y);
    e.preventDefault();
  }, []);

  const onTouchEnd = useCallback((e) => {
    if (gameState === STATE.PLAYING) engineRef.current.inputUp();
    e.preventDefault();
  }, [gameState]);

  const handleRestart = () => {
    setInitials('');
    engineRef.current.start();
  };

  const handleInitialsChange = (e) => {
    const v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 3);
    setInitials(v);
  };

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------

  const isGameOver = gameState === STATE.GAMEOVER_LIVES || gameState === STATE.GAMEOVER_BOMB;
  const isBombDeath = gameState === STATE.GAMEOVER_BOMB;

  return (
    <div className="pp-wrap" ref={wrapRef}>
      <canvas
        ref={canvasRef}
        className="pp-canvas"
        onMouseMove={onMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />

      {onClose && (
        <button
          type="button"
          className="pp-close"
          onClick={onClose}
          aria-label="Close game"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}

      {isGameOver && (
        <div className={`pp-gameover${isBombDeath ? ' pp-gameover--bomb' : ' pp-gameover--lives'}`}>
          <div className="pp-gameover-card">
            <div className="pp-gameover-eyebrow">
              {isBombDeath ? '/ BOMB POPPED /' : '/ ALL LIVES LOST /'}
            </div>
            <h3 className="pp-gameover-title">GAME OVER</h3>

            <div className="pp-stats">
              <div className="pp-stat">
                <span className="pp-stat-label">Score</span>
                <span className="pp-stat-value">{String(scoreSnap.score).padStart(3, '0')}</span>
              </div>
              <div className="pp-stat">
                <span className="pp-stat-label">Wave</span>
                <span className="pp-stat-value">{scoreSnap.wave}</span>
              </div>
              <div className="pp-stat">
                <span className="pp-stat-label">Cause</span>
                <span className="pp-stat-value">{isBombDeath ? 'BOMB' : 'ESCAPES'}</span>
              </div>
            </div>

            {personalBest && (
              <div className="pp-pb">
                <span>Personal best</span>
                <span className="pp-pb-score">
                  {String(personalBest.score).padStart(3, '0')}
                  <span className="pp-pb-wave"> · wave {personalBest.wave}</span>
                </span>
              </div>
            )}

            <div className="pp-initials">
              <label htmlFor="pp-initials-input">YOUR TAG</label>
              <input
                id="pp-initials-input"
                className="pp-initials-input"
                value={initials}
                onChange={handleInitialsChange}
                maxLength={3}
                placeholder="___"
                autoComplete="off"
                spellCheck={false}
              />
              <p className="pp-leaderboard-note">
                Global leaderboard coming with v1.1 — three-char tag will travel with your score.
              </p>
            </div>

            <button type="button" className="pp-restart" onClick={handleRestart}>
              <span className="pp-restart-arrow">▸</span> PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptPatrol;
