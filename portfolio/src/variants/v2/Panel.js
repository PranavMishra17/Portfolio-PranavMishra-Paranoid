// Variant 2 — the slide-over that opens from the room and the timeline.
import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Panel({ open, title, onClose, children }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    if (closeRef.current) closeRef.current.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div className="v2-scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} />
          <motion.aside
            className="v2-panel"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 24, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 360, damping: 34, mass: 0.7 }}
          >
            <div className="v2-panel-top">
              <h2 className="v2-panel-title">{title}</h2>
              <button type="button" className="v2-close" onClick={onClose} ref={closeRef}>
                Close
              </button>
            </div>
            <div className="v2-panel-body">{children}</div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
