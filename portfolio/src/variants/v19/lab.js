// v19 — the Lab.
//
// One small dot in the corner and a compact popover of chips. It never reflows the page, and
// every choice is a swap of one class or one strategy, not a different route.
//
// The rule for what goes in here, after his last round: a variant has to be a different
// design, not the same design with one value changed. Anything that failed that test came out.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'v19.lab';

export const DEFAULTS = {
  land: 'plate',      // how the first screen is arranged
  surface: 'plaster', // what the wall is made of — its look, its cursor, its failure
  grid: 'hidden',     // the plaster's block rule at rest
  projects: 'frame',  // how the projects are laid out
  papers: 'pages',    // how the papers are shown
  room: 'warm',       // the room's light
  type: 'technical',  // the type pairing
  plant: 'stems',     // how the plant grows
  snap: false,        // free scrolling
};

const OPTIONS = [
  {
    key: 'land',
    title: 'The first screen',
    choices: [
      { v: 'plate', label: 'Plate', hint: 'The face beside the name.' },
      { v: 'masthead', label: 'Masthead', hint: 'The name runs the full width; the face sits under it.' },
      { v: 'centred', label: 'Centred', hint: 'Everything on one axis. The quietest.' },
      { v: 'split', label: 'Split', hint: 'The face is the whole left half of the screen.' },
      { v: 'ledger', label: 'Ledger', hint: 'The role is the hero; the name is a letterhead.' },
    ],
  },
  {
    key: 'surface',
    title: 'The wall is made of',
    choices: [
      { v: 'plaster', label: 'Plaster', hint: 'Off-white. The blocks under the dynamite draw themselves in. It bursts.' },
      { v: 'graph', label: 'Graph paper', hint: 'Blue-grey lines. The cursor is a lens that bends them. It tears into leaves that flip.' },
      { v: 'dots', label: 'Halftone', hint: 'A field of dots that swell and back away from you. It dissolves.' },
      { v: 'iso', label: 'Isometric', hint: 'A tile floor. Tiles rise under the cursor, and are pulled off one by one.' },
      { v: 'ink', label: 'Ink', hint: 'No grid. You leave wet ink on the paper. The blast opens a ragged hole.' },
    ],
  },
  {
    key: 'projects',
    title: 'The projects',
    choices: [
      { v: 'frame', label: 'Frame', hint: 'One frame above, two rows of tiles below.' },
      { v: 'beside', label: 'Beside', hint: 'The frame is a tall column on the left; the tiles stack beside it.' },
      { v: 'fill', label: 'Fill', hint: 'No frame. Whatever you point at becomes the ground under all the tiles.' },
      { v: 'spec', label: 'Spec', hint: 'No big picture. A spec sheet — name, stack, links — beside the tiles.' },
      { v: 'wall', label: 'Wall', hint: 'A mosaic of tiles at two sizes. Click one and it grows in place.' },
      { v: 'reel', label: 'Reel', hint: 'Two strips moving past each other. Stop one with the cursor.' },
    ],
  },
  {
    key: 'papers',
    title: 'The papers',
    choices: [
      { v: 'pages', label: 'Pages', hint: 'The front page of each.' },
      { v: 'abstract', label: 'Abstract', hint: 'The abstract is the layout — typeset, numbers picked out.' },
      { v: 'cv', label: 'CV', hint: 'One bibliographic line each, the count in the margin.' },
      { v: 'figure', label: 'Figure', hint: 'The result, drawn. Data first, title second.' },
    ],
  },
  {
    key: 'room',
    title: 'The room',
    choices: [
      { v: 'warm', label: 'Evening', hint: 'Lamp and string lights on, dusk outside.' },
      { v: 'day', label: 'Morning', hint: 'Window open, daylight, nothing switched on.' },
      { v: 'night', label: 'Late', hint: 'Only the screens and the string lights. Deep blue.' },
      { v: 'mono', label: 'Paper', hint: 'The room in the page’s own ink and paper — it belongs to the site.' },
    ],
  },
  {
    key: 'type',
    title: 'Type',
    choices: [
      { v: 'technical', label: 'Technical', hint: 'JetBrains Mono over Public Sans.' },
      { v: 'grotesk', label: 'Grotesk', hint: 'Bricolage Grotesque over Public Sans.' },
      { v: 'editorial', label: 'Editorial', hint: 'Instrument Serif over Public Sans.' },
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
    title: 'Plaster, before the blast',
    choices: [
      { v: 'hidden', label: 'Hidden', hint: 'The field is the only way to see the seams.' },
      { v: 'faint', label: 'Hinted', hint: 'A faint rule where the wall will break.' },
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
    const merged = { ...DEFAULTS, ...(parsed && typeof parsed === 'object' ? parsed : {}) };
    // a stored choice from a variant that no longer exists falls back to the default
    OPTIONS.forEach((o) => {
      if (!o.choices.some((c) => c.v === merged[o.key])) merged[o.key] = DEFAULTS[o.key];
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
