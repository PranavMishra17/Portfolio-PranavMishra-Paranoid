// v19 — the Lab.
//
// One small dot in the corner and a compact popover of chips. It never reflows the page, and
// every choice is a swap of one class or one strategy, not a different route.
//
// Trimmed on his word to the choices he kept. The cursor is the crosshair, the wall fails by
// bursting, the page has grain, the room is evening: none of those are choices any more.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'v19.lab';

export const DEFAULTS = {
  land: 'plate',      // the first screen — each one brings its own type with it
  surface: 'plaster', // what the wall is made of: its look, its cursor
  now: 'five',        // how many of the Alfred_ figures show
  projects: 'frame',  // how the frame and its tiles are dressed
  papers: 'plates',   // how a paper is shown
  hour: 'now',        // the clock: real time, or a fixed hour to preview
};

const OPTIONS = [
  {
    key: 'land',
    title: 'The first screen',
    choices: [
      { v: 'plate', label: 'Plate', hint: 'The face beside the name, set in mono.' },
      { v: 'quiet', label: 'Quiet', hint: 'One column, one axis, nothing but the four things.' },
    ],
  },
  {
    key: 'surface',
    title: 'The wall is made of',
    choices: [
      { v: 'plaster', label: 'Plaster', hint: 'Off-white. Blocks draw themselves in under your hand.' },
      { v: 'iso', label: 'Isometric', hint: 'Blank until you move — then tiles lift out of it.' },
      { v: 'iso2', label: 'Isometric 2', hint: 'The same tiles, pre-cut once and blitted, so it holds 60 fps.' },
    ],
  },
  {
    key: 'now',
    title: 'Alfred_, in numbers',
    choices: [
      { v: 'five', label: 'Five', hint: 'The five that matter most.' },
      { v: 'ten', label: 'Ten', hint: 'Ten.' },
      { v: 'all', label: 'Fifteen', hint: 'All of them, to pick from.' },
    ],
  },
  {
    key: 'projects',
    title: 'The work, framed',
    choices: [
      { v: 'frame', label: 'Frame', hint: 'One fixed frame above, two rows of tiles below.' },
      { v: 'poster', label: 'Poster', hint: 'The name set large on ink beside the picture.' },
    ],
  },
  {
    key: 'papers',
    title: 'The papers',
    choices: [
      { v: 'figure', label: 'Figure', hint: 'The result, drawn. Data first, title second.' },
      { v: 'abstract', label: 'Abstract', hint: 'Set on real paper, the first lines only.' },
      { v: 'brief', label: 'Brief', hint: 'The figure and the abstract on one sheet.' },
      { v: 'plates', label: 'Plates', hint: 'The sheet, and the figures under it as numbered plates.' },
      { v: 'stacked', label: 'Stacked', hint: 'One sheet per paper, the figures beside the title, the abstract in one column.' },
    ],
  },
  {
    key: 'hour',
    title: 'The time of day',
    choices: [
      { v: 'now', label: 'Now', hint: 'The real clock. The sky and the room follow it.' },
      { v: 5, label: '05', hint: 'Before dawn.' },
      { v: 7, label: '07', hint: 'Sunrise.' },
      { v: 10, label: '10', hint: 'Morning.' },
      { v: 13, label: '13', hint: 'Midday.' },
      { v: 16, label: '16', hint: 'Afternoon.' },
      { v: 18, label: '18', hint: 'Golden hour.' },
      { v: 20, label: '20', hint: 'Dusk.' },
      { v: 23, label: '23', hint: 'Night. Still blue.' },
    ],
  },
];

const LabCtx = createContext({ lab: DEFAULTS, set: () => {} });

export function useLab() {
  return useContext(LabCtx);
}

function read() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULTS, ...(parsed && typeof parsed === 'object' ? parsed : {}) };
    // a stored choice from a variant that no longer exists falls back to the default
    OPTIONS.forEach((o) => {
      if (!o.choices.some((c) => c.v === merged[o.key])) merged[o.key] = DEFAULTS[o.key];
    });
    Object.keys(merged).forEach((k) => {
      if (!(k in DEFAULTS)) delete merged[k];
    });
    return merged;
  } catch (err) {
    return DEFAULTS;
  }
}

export function LabProvider({ children }) {
  const [lab, setLab] = useState(DEFAULTS);
  useEffect(() => {
    setLab(read());
  }, []);
  const set = useCallback((key, value) => {
    setLab((prev) => {
      const next = { ...prev, [key]: value };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch (err) {
        // not being able to remember the choice is not a reason to refuse it
      }
      return next;
    });
  }, []);
  const value = useMemo(() => ({ lab, set }), [lab, set]);
  return <LabCtx.Provider value={value}>{children}</LabCtx.Provider>;
}

export default function Lab() {
  const { lab, set } = useLab();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const away = (e) => {
      if (e.target.closest && e.target.closest('.v19-lab')) return;
      setOpen(false);
    };
    const esc = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', away);
    window.addEventListener('keydown', esc);
    return () => {
      window.removeEventListener('pointerdown', away);
      window.removeEventListener('keydown', esc);
    };
  }, [open]);

  return (
    <div className={`v19-lab${open ? ' is-open' : ''}`}>
      <button type="button" className="v19-lab-dot" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Pick a variation" title="Variations">
        <span />
        <span />
        <span />
      </button>
      <div className="v19-lab-pop" role="dialog" aria-label="Variations" hidden={!open}>
        {OPTIONS.map((group) => (
          <div className="v19-lab-row" key={group.key}>
            <p className="v19-lab-title">{group.title}</p>
            <div className="v19-lab-chips">
              {group.choices.map((c) => (
                <button type="button" key={String(c.v)} className={`v19-lab-chip${lab[group.key] === c.v ? ' on' : ''}`} onClick={() => set(group.key, c.v)} title={c.hint}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
