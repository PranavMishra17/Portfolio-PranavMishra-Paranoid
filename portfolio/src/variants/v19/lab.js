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
  projects: 'frame',  // how the frame and its tiles are dressed
  papers: 'figure',   // how a paper is shown
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
      { v: 'stacked', label: 'Stacked', hint: 'No paper. One wide band per paper, set on the page.' },
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
