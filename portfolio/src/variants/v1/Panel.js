// Variant 1 — the slide-over that opens when you click something in the room.
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
          <motion.div
            className="v1-scrim"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
          <motion.aside
            className="v1-panel"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32, mass: 0.8 }}
          >
            <div className="v1-panel-top">
              <h2 className="v1-h2 v1-panel-title">{title}</h2>
              <button type="button" className="v1-close" onClick={onClose} ref={closeRef}>
                Close
              </button>
            </div>
            <div className="v1-panel-body">{children}</div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
