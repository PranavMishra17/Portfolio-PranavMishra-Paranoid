// v19 — the Lab.
//
// He asked for the alternatives to live in "a little pop-up that you can pick one of these,
// keep it very small so I don't mess with what I'm viewing" — not a tab strip, not a side rail.
// So: one small dot in the corner, and a compact popover of chips. It never reflows the page,
// and every choice is a swap of one class or one strategy, not a different route.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'v19.lab';

export const DEFAULTS = {
  blast: 'burst',     // how the wall comes apart — burst is quick, and he liked quick
  chambers: 'grid',   // how the projects are laid out
  type: 'technical',  // the type pairing he picked
  grid: 'faint',      // whether the wall's blocks are hinted at rest
  plant: 'stems',     // how the plant grows
  snap: false,        // free scrolling; the pull-in is opt-in now
};

const OPTIONS = [
  {
    key: 'blast',
    title: 'The wall comes apart',
    choices: [
      { v: 'burst', label: 'Burst', hint: 'It comes at you, then away to the top left.' },
      { v: 'collapse', label: 'Collapse', hint: 'A ring of failure spreads outward and the face gives way.' },
      { v: 'shatter', label: 'Shatter', hint: 'Real collisions. Slabs knock each other out of the way.' },
    ],
  },
  {
    key: 'chambers',
    title: 'The projects',
    choices: [
      { v: 'grid', label: 'Grid', hint: 'One frame above, two rows of tiles below.' },
      { v: 'index', label: 'Index', hint: 'No thumbnails at all — a typeset list beside one tall frame.' },
      { v: 'sheet', label: 'Sheet', hint: 'No frame. The tiles are the page; the detail opens beneath them.' },
    ],
  },
  {
    key: 'type',
    title: 'Type',
    choices: [
      { v: 'grotesk', label: 'Grotesk', hint: 'Bricolage Grotesque over Public Sans.' },
      { v: 'editorial', label: 'Editorial', hint: 'Instrument Serif over Public Sans.' },
      { v: 'technical', label: 'Technical', hint: 'JetBrains Mono over Public Sans.' },
    ],
  },
  {
    key: 'plant',
    title: 'The plant',
    choices: [
      { v: 'stems', label: 'Stems', hint: 'Three stems, leaves that drift.' },
      { v: 'fern', label: 'Fern', hint: 'Arching fronds that breathe.' },
      { v: 'succulent', label: 'Succulent', hint: 'A rosette that turns toward the window.' },
    ],
  },
  {
    key: 'grid',
    title: 'The blocks, before the blast',
    choices: [
      { v: 'faint', label: 'Hinted', hint: 'A faint rule where the wall will break.' },
      { v: 'hidden', label: 'Hidden', hint: 'Plaster. No warning at all.' },
    ],
  },
  {
    key: 'snap',
    title: 'Scrolling',
    choices: [
      { v: false, label: 'Free', hint: 'Plain scrolling. Nothing grabs the page.' },
      { v: true, label: 'Pulls in', hint: 'Commit a fifth of the way and the next slab takes the screen.' },
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
    return { ...DEFAULTS, ...(parsed && typeof parsed === 'object' ? parsed : {}) };
  } catch (err) {
    // private mode, blocked storage, corrupt value — the defaults are always a valid answer
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
      <button
        type="button"
        className="v19-lab-dot"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-label="Pick a variation"
        title="Variations"
      >
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
                <button
                  type="button"
                  key={String(c.v)}
                  className={`v19-lab-chip${lab[group.key] === c.v ? ' on' : ''}`}
                  onClick={() => set(group.key, c.v)}
                  title={c.hint}
                >
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
