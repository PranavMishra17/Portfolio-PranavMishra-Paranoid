// Variant 4 — "Sundial".
// One day in one scroll. The rail is a clock: the sun slides down the line
// beside his name and carries the hour; the sky reads from the same number.
// The room at the bottom is the footer, and its window shows the next morning.
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sky from "./Sky";
import Rail, { RailBar } from "./Rail";
import useDay from "./useDay";
import { WorkRegister, ProjectGrid, Papers } from "./blocks";
import Room from "./Room";
import RoomPanel from "./RoomPanel";
import Overlay from "./Overlay";
import { arrival, room } from "./copy";
import { contact } from "./data";
import "./v4.css";

const FONTS =
  "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Hanken+Grotesk:wght@400;500;600&display=swap";

function useMedia(query) {
  const get = () => typeof window !== "undefined" && window.matchMedia && window.matchMedia(query).matches;
  const [on, setOn] = useState(get);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const fn = () => setOn(mq.matches);
    fn();
    mq.addEventListener ? mq.addEventListener("change", fn) : mq.addListener(fn);
    return () => (mq.removeEventListener ? mq.removeEventListener("change", fn) : mq.removeListener(fn));
  }, [query]);
  return on;
}

export default function V4() {
  const day = useDay();
  const [overlay, setOverlay] = useState(false);
  const [item, setItem] = useState(null);
  const [hover, setHover] = useState(null);
  const phone = useMedia("(max-width: 760px)");

  // Fonts and the body ground, scoped to this route.
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS;
    document.head.appendChild(link);
    document.body.classList.add("v4-ground-body");
    const prevTitle = document.title;
    document.title = `${contact.name}`;
    return () => {
      document.head.removeChild(link);
      document.body.classList.remove("v4-ground-body");
      document.title = prevTitle;
    };
  }, []);

  // Lock the page behind an open sheet.
  useEffect(() => {
    const locked = overlay || Boolean(item);
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [overlay, item]);

  const openOverlay = useCallback(() => setOverlay(true), []);
  const closeOverlay = useCallback(() => setOverlay(false), []);
  const closeItem = useCallback(() => setItem(null), []);

  const caption = hover
    ? `${hover}. ${phone ? "Tap" : "Click"} to open.`
    : phone
    ? "Scroll sideways to see the whole room. Tap anything."
    : "Hover over anything in the room.";

  return (
    <div className="v4">
      <Sky p={day.p} />
      {phone ? <RailBar p={day.p} active={day.active} hour={day.hour} /> : <Rail p={day.p} active={day.active} hour={day.hour} />}

      <main className="v4-main">
        <section id="v4-arrival" className="v4-arrival" aria-label="Arrival">
          <div className="v4-ground v4-arrival-band">
            <h1 className="v4-h1">{arrival.headline}</h1>
            <p className="v4-body v4-arrival-line">{arrival.line}</p>
          </div>
        </section>

        <section id="v4-work" className="v4-section" aria-labelledby="v4-work-h">
          <div className="v4-ground">
            <h2 className="v4-h2" id="v4-work-h">
              The work
            </h2>
            <WorkRegister />
          </div>
        </section>

        <section id="v4-built" className="v4-section" aria-labelledby="v4-built-h">
          <div className="v4-ground is-wide">
            <h2 className="v4-h2" id="v4-built-h">
              Built and written
            </h2>
            <ProjectGrid onSeeAll={openOverlay} />
            <h3 className="v4-h3 v4-written">Written</h3>
            <Papers />
          </div>
        </section>

        <section id="v4-room" className="v4-roomsec" aria-label="The room">
          <div className="v4-room-intro">
            <p>{room.intro}</p>
          </div>
          <div className={`v4-room${phone ? " is-phone" : ""}`}>
            <div className="v4-room-scroll">
              <Room onOpen={setItem} onHover={setHover} hideDupes={phone} />
            </div>
          </div>
          <p className="v4-caption" aria-live="polite">
            {caption}
          </p>
          <footer className="v4-foot">
            <span>
              {contact.name}, {new Date().getFullYear()}.
            </span>
            <Link to="/resume">Resume</Link>
            <Link to="/">The current site</Link>
          </footer>
        </section>
      </main>

      <RoomPanel item={item} onClose={closeItem} onSeeAll={openOverlay} />
      <Overlay open={overlay} onClose={closeOverlay} />
    </div>
  );
}
