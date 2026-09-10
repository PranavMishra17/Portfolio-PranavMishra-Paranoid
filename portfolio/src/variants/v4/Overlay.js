// Variant 4 — "See everything". A full-screen sheet with tag chips along the
// top; the complete set of projects, plus the papers under Research.
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { chips } from "./copy";
import { allProjects } from "./data";
import { ProjectCard, Papers } from "./blocks";

export default function Overlay({ open, onClose }) {
  const [chip, setChip] = useState("all");
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const t = setTimeout(() => closeRef.current && closeRef.current.focus(), 30);
    return () => {
      document.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open, onClose]);

  const shown = useMemo(
    () => (chip === "all" ? allProjects : allProjects.filter((p) => p.tags.includes(chip))),
    [chip]
  );
  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="v4-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Everything I have built"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <div className="v4-overlay-head">
            <div className="v4-chips" role="group" aria-label="Filter by tag">
              {chips.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  className="v4-chip"
                  aria-pressed={chip === c.key}
                  onClick={() => setChip(c.key)}
                >
                  {c.label}
                </button>
              ))}
            </div>
            <button ref={closeRef} type="button" className="v4-btn v4-close" onClick={onClose}>
              Close
            </button>
          </div>

          <div className="v4-overlay-body">
            <p className="v4-count">
              {shown.length} {shown.length === 1 ? "project" : "projects"}
              {chip === "research" ? ", and the three papers" : ""}
            </p>
            <div className="v4-grid is-all">
              {shown.map((p) => (
                <ProjectCard key={p.id} p={p} wide />
              ))}
            </div>
            {chip === "research" && (
              <div className="v4-overlay-papers">
                <h3 className="v4-h3">Written</h3>
                <Papers compact />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
