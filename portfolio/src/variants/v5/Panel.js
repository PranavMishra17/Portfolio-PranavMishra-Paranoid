// Variant 5 — the slide-over for the room and the roles.
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
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div className="v5-scrim" onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.16 }} />
          <motion.aside
            className="v5-panel"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: 32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 32, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 34, mass: 0.7 }}
          >
            <div className="v5-panel-top">
              <h2 className="v5-panel-title">{title}</h2>
              <button type="button" className="v5-close" onClick={onClose} ref={closeRef}>
                Close
              </button>
            </div>
            <div className="v5-panel-body">{children}</div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
