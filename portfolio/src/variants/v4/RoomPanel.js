// Variant 4 — what opens when you click something in the room. A sheet from
// the right, on paper. Objects 6 to 9 render the same blocks as the page.
import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WorkRegister, ProjectGrid, Papers, About, Trophies } from "./blocks";
import { SAMPLE_NOTE, films, books, games, magnets, familyPhoto, football } from "./personal";
import { skyAt, rgb } from "./Sky";

function Sample() {
  return <span className="v4-sample">sample</span>;
}

function WindowView() {
  const s = skyAt(0.06);
  return (
    <div>
      <div
        className="v4-window-big"
        aria-label="The next morning's sky"
        style={{ background: `linear-gradient(180deg, ${rgb(s.top)} 0%, #f0d6c6 58%, #f4c79a 100%)` }}
      >
        <i className="v4-window-sun" />
        <i className="v4-window-hill" />
      </div>
      <p className="v4-body">
        The next morning. It is the same sky as the top of this page, one day later, with the sun just up.
      </p>
      <p className="v4-body">
        <a href="#v4-arrival" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
          Back to the top of the day
        </a>
      </p>
    </div>
  );
}

function Films() {
  return (
    <div>
      <p className="v4-note">{SAMPLE_NOTE}</p>
      <ul className="v4-list">
        {films.map((f) => (
          <li key={f.title}>
            <i className="v4-swatch" style={{ background: f.tone }} aria-hidden="true" />
            <div>
              <h4 className="v4-h4">
                {f.title} <span className="v4-dim">{f.year}</span> {f.sample && <Sample />}
              </h4>
              <p className="v4-body">{f.why}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Books() {
  const now = books.filter((b) => b.status === "reading");
  const done = books.filter((b) => b.status !== "reading");
  const Row = ({ b }) => (
    <li>
      <i className="v4-swatch is-spine" style={{ background: b.tone }} aria-hidden="true" />
      <div>
        <h4 className="v4-h4">
          {b.title} {b.sample && <Sample />}
        </h4>
        <p className="v4-body v4-dim">{b.author}</p>
      </div>
    </li>
  );
  return (
    <div>
      <p className="v4-note">{SAMPLE_NOTE}</p>
      <h4 className="v4-h4 v4-sub">Reading now</h4>
      <ul className="v4-list">{now.map((b) => <Row key={b.title} b={b} />)}</ul>
      <h4 className="v4-h4 v4-sub">Recently finished</h4>
      <ul className="v4-list">{done.map((b) => <Row key={b.title} b={b} />)}</ul>
    </div>
  );
}

function Games() {
  return (
    <div>
      <p className="v4-note">{SAMPLE_NOTE}</p>
      <ul className="v4-list">
        {games.map((g) => (
          <li key={g.title}>
            <i className="v4-swatch is-case" style={{ background: g.tone }} aria-hidden="true" />
            <div>
              <h4 className="v4-h4">
                {g.title} {g.sample && <Sample />}
              </h4>
              <p className="v4-body">{g.note}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Magnets({ focus }) {
  return (
    <div>
      <p className="v4-note">{SAMPLE_NOTE}</p>
      <ul className="v4-list">
        {magnets.map((m) => (
          <li key={m.place} className={focus === m.place ? "is-focus" : ""}>
            <i className="v4-swatch is-round" style={{ background: m.tone }} aria-hidden="true" />
            <div>
              <h4 className="v4-h4">
                {m.place} {m.sample && <Sample />}
              </h4>
              <p className="v4-body">{m.memory}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Family() {
  return (
    <div>
      <div className="v4-photo-empty" aria-hidden="true">
        <span>photo</span>
      </div>
      <p className="v4-body">
        {familyPhoto.caption} {familyPhoto.sample && <Sample />}
      </p>
    </div>
  );
}

function Football() {
  return (
    <div>
      <p className="v4-body v4-lede">{football.line}</p>
      <p className="v4-body">
        {football.detail} {football.sample && <Sample />}
      </p>
    </div>
  );
}

const TITLES = {
  window: "The window",
  posters: "Films on the wall",
  magnets: "Fridge magnets",
  books: "The bookshelf",
  trophies: "Two trophies",
  work: "The work",
  papers: "Written",
  about: "About me",
  projects: "Built",
  games: "Games I play",
  family: "Family photo",
  football: "Football and boots",
};

export default function RoomPanel({ item, onClose, onSeeAll }) {
  const closeRef = useRef(null);
  const open = Boolean(item);
  const key = item && item.key;

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

  const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let body = null;
  switch (key) {
    case "window": body = <WindowView />; break;
    case "posters": body = <Films />; break;
    case "magnets": body = <Magnets focus={item.focus} />; break;
    case "books": body = <Books />; break;
    case "trophies": body = <Trophies />; break;
    case "work": body = <WorkRegister compact />; break;
    case "papers": body = <Papers />; break;
    case "about": body = <About />; break;
    case "projects": body = <ProjectGrid compact onSeeAll={onSeeAll} />; break;
    case "games": body = <Games />; break;
    case "family": body = <Family />; break;
    case "football": body = <Football />; break;
    default: body = null;
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            className="v4-scrim"
            aria-label="Close"
            onClick={onClose}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.aside
            className="v4-panel"
            role="dialog"
            aria-modal="true"
            aria-label={TITLES[key]}
            initial={reduce ? false : { x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.9 }}
          >
            <div className="v4-panel-head">
              <h2 className="v4-h2">{TITLES[key]}</h2>
              <button ref={closeRef} type="button" className="v4-btn v4-close" onClick={onClose}>
                Close
              </button>
            </div>
            <div className="v4-panel-body">{body}</div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
