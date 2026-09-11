// v19 — the Lab.
//
// One small dot in the corner and a compact popover of chips. It never reflows the page, and
// every choice is a swap of one class or one strategy, not a different route.
//
// The rule for what goes in here: a variant has to be a different design — a different
// material, a different metaphor, a different motion. Anything that was the same design with
// one value changed has been taken out, and the ones he ruled out are gone for good.

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const KEY = 'v19.lab';

export const DEFAULTS = {
  land: 'plate',      // the first screen — each one brings its own type with it
  surface: 'plaster', // what the wall is made of: its look, its cursor
  trigger: 'charge',  // what is in your hand, and how it goes off
  blast: 'burst',     // how the wall comes apart
  texture: 'grain',   // the tooth over the whole page
  projects: 'frame',  // how the frame and its tiles are dressed
  papers: 'figure',   // how a paper is shown
  room: 'warm',       // the room's light
  snap: false,        // free scrolling
};

const OPTIONS = [
  {
    key: 'land',
    title: 'The first screen',
    choices: [
      { v: 'plate', label: 'Plate', hint: 'The face beside the name, set in mono. The one he kept.' },
      { v: 'masthead', label: 'Masthead', hint: 'A newspaper title: the name runs the full width in grotesque.' },
      { v: 'ledger', label: 'Ledger', hint: 'Serif. The role is the hero; the name is a letterhead.' },
      { v: 'quiet', label: 'Quiet', hint: 'One column, one axis, nothing but the four things.' },
    ],
  },
  {
    key: 'surface',
    title: 'The wall is made of',
    choices: [
      { v: 'plaster', label: 'Plaster', hint: 'Off-white. Blocks draw themselves in under your hand.' },
      { v: 'clay', label: 'Clay', hint: 'The same wall in warm putty; the seams are shadow, not line.' },
      { v: 'slate', label: 'Slate', hint: 'Graphite. Light seams, and the landing turns over with it.' },
      { v: 'iso', label: 'Isometric', hint: 'Blank until you move — then tiles lift out of it.' },
      { v: 'film', label: 'Film', hint: 'Photographic paper and grain. The cursor is a light leak.' },
      { v: 'frost', label: 'Frost', hint: 'Fogged glass. You wipe it clear and it closes behind you.' },
    ],
  },
  {
    key: 'trigger',
    title: 'In your hand',
    choices: [
      { v: 'charge', label: 'Charge', hint: 'No object. A ring that fills, reddens and gets angry.' },
      { v: 'dynamite', label: 'Dynamite', hint: 'The stick, for when the cartoon is the point.' },
      { v: 'pin', label: 'Crosshair', hint: 'Four marks closing on a point.' },
    ],
  },
  {
    key: 'blast',
    title: 'How it fails',
    choices: [
      { v: 'burst', label: 'Burst', hint: 'Past you, then up and left toward the way back.' },
      { v: 'drop', label: 'Drop', hint: 'It stops holding itself up. Straight down.' },
      { v: 'sweep', label: 'Sweep', hint: 'One flat wipe, nearest piece first.' },
      { v: 'fade', label: 'Dissolve', hint: 'Nothing is thrown. Each piece shrinks where it stands.' },
    ],
  },
  {
    key: 'texture',
    title: 'The page',
    choices: [
      { v: 'grain', label: 'Grain', hint: 'A fine tooth over everything.' },
      { v: 'film', label: 'Film', hint: 'Grain and a lens vignette. Warmer.' },
      { v: 'plain', label: 'Plain', hint: 'Nothing at all.' },
    ],
  },
  {
    key: 'projects',
    title: 'The work, framed',
    choices: [
      { v: 'frame', label: 'Frame', hint: 'One fixed frame above, two rows of tiles below.' },
      { v: 'gallery', label: 'Gallery', hint: 'The frame gets a mat and an engraved label.' },
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
    ],
  },
  {
    key: 'room',
    title: 'The room',
    choices: [
      { v: 'warm', label: 'Evening', hint: 'Lamp and string lights on, dusk outside.' },
      { v: 'day', label: 'Morning', hint: 'Window open, daylight, nothing switched on.' },
      { v: 'night', label: 'Late', hint: 'Only the screens and the string lights. Deep blue.' },
      { v: 'mono', label: 'Paper', hint: 'The room in the page’s own ink and paper.' },
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
