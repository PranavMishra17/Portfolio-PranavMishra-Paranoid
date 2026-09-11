// v19 — what is still to be picked.
//
// The design is settled: plate first screen, the second isometric wall, three-plus-two
// figures, the frame, the brief, the real clock. Two things are still his to choose, and only
// those two are in here: which drawing each Alfred_ box carries, and what the car does on the
// WheelPrice bar. One dot in the corner, one small popover, state in localStorage. When he has
// chosen, this file and the losing drawings go.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FIGURES } from './copy';

const KEY = 'v19.pick';

export const DEFAULTS = FIGURES.reduce(
  (acc, f) => ({ ...acc, [`sk_${f.id}`]: 'a' }),
  { car: 'race' }
);

const OPTIONS = FIGURES.map((f) => ({
  key: `sk_${f.id}`,
  title: `${f.now} — ${f.label}`,
  choices: Object.keys(f.sketches).map((k) => ({ v: k, label: f.sketches[k].name, hint: '' })),
})).concat([
  {
    key: 'car',
    title: 'The car on WheelPrice',
    choices: [
      { v: 'race', label: 'Race', hint: 'Wheels spin up, it tears off left, comes back in from the right and stops where it was.' },
      { v: 'burnout', label: 'Burnout', hint: 'Smoke off the back wheel first, then the same lap.' },
      { v: 'drift', label: 'Drift', hint: 'The lap, and it slides the last stretch to a stop.' },
    ],
  },
]);

const Ctx = createContext({ lab: DEFAULTS, set: () => {} });

export function useLab() {
  return useContext(Ctx);
}

function read() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    const merged = { ...DEFAULTS, ...(parsed && typeof parsed === 'object' ? parsed : {}) };
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
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
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
      <button type="button" className="v19-lab-dot" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label="Still to pick" title="Still to pick">
        <span />
        <span />
        <span />
      </button>
      <div className="v19-lab-pop" role="dialog" aria-label="Still to pick" hidden={!open}>
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
