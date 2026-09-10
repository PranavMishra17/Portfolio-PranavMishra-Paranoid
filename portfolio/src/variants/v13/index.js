// v13 — "Scope"
// The page costs more than you have. You are given 100 units of attention; the page
// costs 160. Every section has a price and a reason for the price. What you do not open
// is the cut list. The only game-shaped thing here is the structure: a scarce resource
// and choices that do not come back.
import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import './v13.css';

const BUDGET = 100;

const ITEMS = [
  {
    id: 'who',
    name: 'Who I am',
    cost: 15,
    why: 'Short. I have had a lot of practice cutting this one.',
    body: (
      <>
        <p>
          Ines Varga. Game designer, nine years, systems and levels. Four shipped games, one on a shelf, one
          in a drawer. Lisbon most of the year, Malmö when a studio needs me in the room.
        </p>
        <p>
          I am the person who says what is not going in. Scope is the only design tool that has never once
          failed me, and this page is built out of it: you cannot read all of it, so you will have to decide
          what matters. That is the job.
        </p>
      </>
    )
  },
  {
    id: 'tidewater',
    name: 'Tidewater',
    cost: 35,
    why: 'The longest. If I could keep only one, it would be this, so I let it be expensive.',
    body: (
      <>
        <p className="v13-meta">Co-op village sim · lead designer · 2024 · team of nine · 14 months</p>
        <p>
          Two people share one boat, one village, one winter. The pitch said players would share the catch.
          They hoarded, all of them, including the couples. Rather than write a rule about sharing I made the
          hold too small for two people’s fish. Sharing became the only way home, and co-op retention more than
          doubled without a single tutorial line.
        </p>
        <p>
          I owned the economy, the weather, and the calendar. The weather was cut in build 14 to buy the
          calendar three more weeks. It was the right cut. Nobody asked where it went.
        </p>
        <p>
          What I would do again: build the boat before the village. What I would not: write a design document
          longer than the playtest plan.
        </p>
      </>
    )
  },
  {
    id: 'ledger',
    name: 'Hollow Ledger',
    cost: 30,
    why: 'A system I got wrong for six months and right in an afternoon.',
    body: (
      <>
        <p className="v13-meta">Deckbuilder · systems designer · 2023 · team of four · 11 months</p>
        <p>
          Every card is a debt. You play them to survive the round and then someone comes to collect. For six
          months the collector arrived off-screen, and testers called the game “fine”, which is the word you
          hear right before nobody buys it.
        </p>
        <p>
          The fix was information, not rules. The collector walks the board from turn one, a single tile
          closer each round. Same numbers, same cards. Caution appeared on its own. I also deleted the rarity
          system outright, which cost a week of art and saved the game.
        </p>
      </>
    )
  },
  {
    id: 'rooms',
    name: 'Sixteen Rooms',
    cost: 25,
    why: 'Level work. Nine rooms, twenty-two doors, one cut I still think about.',
    body: (
      <>
        <p className="v13-meta">Stealth puzzle · level designer · 2022 · team of six · 9 months</p>
        <p>
          Whiteboxed the whole map three times. The lesson from the first pass was that players do not feel
          space, they feel doors: every doorway is a decision and decisions are what fill your head. The
          shipped map has nine rooms and twenty-two doors and feels larger than the sixteen-room version.
        </p>
        <p>
          Room 11 was cut on the last day. It was the best room. It was also the only one nobody needed to
          walk through, and a room nobody needs is a room nobody visits.
        </p>
      </>
    )
  },
  {
    id: 'ferry',
    name: 'Ferry',
    cost: 10,
    why: 'Student work. Cheap because it is short, not because it is bad.',
    body: (
      <>
        <p className="v13-meta">Student project · everything · 2020 · team of one · 6 weeks</p>
        <p>
          An eleven-minute game meant to be played on a ferry crossing. The logs said everybody played it in
          bed, between eleven and one. I learned to read the logs before I believe the pitch, and that the
          pitch was mine made it a better lesson. Still up.
        </p>
      </>
    )
  },
  {
    id: 'method',
    name: 'How I work',
    cost: 25,
    why: 'Nobody reads these. This one is priced honestly.',
    body: (
      <>
        <p>
          <strong>Whitebox before words.</strong> If it cannot be walked in grey boxes, art will not save it.
        </p>
        <p>
          <strong>One number per build.</strong> Decide which number this build has to move. Watch only that.
          The rest is a story you tell yourself afterwards.
        </p>
        <p>
          <strong>Cut on Thursday.</strong> Friday cuts get argued about all weekend. Thursday cuts get tested
          on Friday.
        </p>
        <p>
          <strong>Price everything.</strong> A feature with no cost attached is a feature nobody has thought
          about. This page has prices for the same reason.
        </p>
      </>
    )
  },
  {
    id: 'cuts',
    name: 'What I cut',
    cost: 20,
    why: 'The cut list. Yes, it is on the cut list.',
    body: (
      <>
        <p>
          Weather, from Tidewater. Rarity, from Hollow Ledger. Room 11, from Sixteen Rooms. A second act, from
          the game on the shelf. A crafting system I spent four months on and cannot remember the name of.
        </p>
        <p>
          None of these were bad. All of them were cheaper to lose than to finish, and the thing that shipped
          instead was better for the room they left. If I am proud of anything it is this list, and it is
          longer than the list of things I kept.
        </p>
      </>
    )
  },
  {
    id: 'contact',
    name: 'Contact',
    cost: 0,
    why: 'Free. The only thing I would never cut.',
    body: (
      <>
        <p className="v13-contact">
          <a href="mailto:ines@example.com">ines@example.com</a>
        </p>
        <p>
          If you have a build that is bigger than the time you have to finish it, that is the conversation I
          am good at. Write and tell me what it costs.
        </p>
      </>
    )
  }
];

const TOTAL = ITEMS.reduce((n, i) => n + i.cost, 0);

export default function V13() {
  const [opened, setOpened] = useState([]);
  const reduce = useReducedMotion();

  const spent = useMemo(() => opened.reduce((n, id) => n + (ITEMS.find((i) => i.id === id)?.cost || 0), 0), [opened]);
  const left = BUDGET - spent;

  const affordable = ITEMS.filter((i) => !opened.includes(i.id) && i.cost > 0 && i.cost <= left);
  const cut = ITEMS.filter((i) => !opened.includes(i.id) && i.cost > 0 && i.cost > left);
  const done = affordable.length === 0;

  const open = (id) => {
    const item = ITEMS.find((i) => i.id === id);
    if (!item) return;
    // Guard inside the updater so a burst of clicks cannot overspend a stale budget.
    setOpened((o) => {
      const spentNow = o.reduce((n, oid) => n + (ITEMS.find((i) => i.id === oid)?.cost || 0), 0);
      if (o.includes(id) || item.cost > BUDGET - spentNow) return o;
      return [...o, id];
    });
  };

  const reset = () => setOpened([]);

  // The number gets physically smaller as it is spent. No bar, no meter: the size is the meter.
  const scale = 0.18 + (left / BUDGET) * 0.82;

  const expand = reduce
    ? { initial: false, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 1, height: 'auto' }, transition: { duration: 0 } }
    : {
        initial: { opacity: 0, height: 0 },
        animate: { opacity: 1, height: 'auto' },
        exit: { opacity: 0, height: 0 },
        transition: { duration: 0.42, ease: [0.2, 0.8, 0.2, 1] }
      };

  return (
    <div className="v13">
      <div className="v13-page">
        <header className="v13-top">
          <div className="v13-ident">
            <p className="v13-kicker">Ines Varga · game designer</p>
            <h1 className="v13-title">
              You have <span className="v13-inline-num">{left}</span> units of attention. This page costs {TOTAL}.
            </h1>
            <p className="v13-lede">
              Every section below has a price. Open what you think matters. What you cannot afford is cut, and
              cuts do not come back until you leave. This is how I make games, so it is how I made this.
            </p>
          </div>
          <div className="v13-counter" aria-hidden="true">
            <span className="v13-big" style={{ '--v13-s': scale }}>
              {left}
            </span>
            <span className="v13-big-label">left</span>
          </div>
        </header>

        <ol className="v13-ledger">
          {ITEMS.map((item, idx) => {
            const isOpen = opened.includes(item.id);
            const canOpen = !isOpen && item.cost <= left;
            const isCut = !isOpen && !canOpen;
            const free = item.cost === 0;
            return (
              <li
                key={item.id}
                className={
                  'v13-row' + (isOpen ? ' is-open' : '') + (isCut ? ' is-cut' : '') + (free ? ' is-free' : '')
                }
              >
                <div className="v13-row-head">
                  <span className="v13-idx">{String(idx + 1).padStart(2, '0')}</span>
                  <div className="v13-row-name">
                    <h2>{item.name}</h2>
                    <p className="v13-why">{item.why}</p>
                  </div>
                  <span className="v13-cost">
                    <span className="v13-cost-num">{item.cost}</span>
                    <span className="v13-cost-lbl">{isOpen ? 'spent' : isCut ? 'short' : free ? 'free' : 'cost'}</span>
                  </span>
                  <div className="v13-act">
                    {isOpen && <span className="v13-state">Open</span>}
                    {isCut && <span className="v13-state v13-state-cut">Cut — you have {left}</span>}
                    {!isOpen && !isCut && (
                      <button type="button" className="v13-btn" onClick={() => open(item.id)}>
                        {free ? 'Open' : `Spend ${item.cost}`}
                      </button>
                    )}
                  </div>
                </div>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div key="body" className="v13-body-wrap" {...expand} style={{ overflow: 'hidden' }}>
                      <div className="v13-body">{item.body}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ol>

        {done && (
          <section className="v13-end">
            <p className="v13-kicker">End of budget</p>
            <h2 className="v13-end-title">
              {spent === BUDGET ? 'Spent to zero.' : `${left} left, nothing left to buy with it.`} That is what shipping feels like.
            </h2>
            {cut.length > 0 ? (
              <p>
                Your cut list: {cut.map((c) => c.name).join(', ')}. Every game I have shipped has a list like
                this. It is usually longer.
              </p>
            ) : (
              <p>You opened everything you could. There is no cut list this time. That never happens on a real project.</p>
            )}
            <p>
              Contact is still free, above.{' '}
              <button type="button" className="v13-link" onClick={reset}>
                Start a new session
              </button>{' '}
              and everything comes back, which it never does in real life.
            </p>
          </section>
        )}

        <footer className="v13-foot">
          <span>Spent {spent} · Opened {opened.length} · Cut {cut.length}</span>
          {opened.length > 0 && !done && (
            <button type="button" className="v13-link" onClick={reset}>
              Start over
            </button>
          )}
        </footer>
      </div>
    </div>
  );
}
