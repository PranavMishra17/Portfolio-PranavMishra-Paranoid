// v19 — the work. Alfred_ takes the whole first screen and nothing else is on it.
//
// Three kinds of text and no more: one mono line, one heading, one paragraph. Then the figures:
// a before struck through, an after that counts up, a line saying what it is. Point at one and
// the drawing underneath changes to that one specific thing. Click and it tells you why. Five
// show by default; the Lab can show all ten.
//
// Underneath the fold: WheelPrice, shut, as one bar. It opens into the same shape at half the
// size. Everything before that is an after-note, one line each.

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ALFRED, AFTER, FIGURES, STACK, WHEELPRICE } from '../copy';
import { useLab } from '../lab';
import { useOnScreen, useOpener } from '../hooks';

/* A number that counts to itself once, when it first arrives on screen. */
function Tick({ value, run }) {
  const [shown, setShown] = useState(value);
  const numeric = useMemo(() => {
    const m = String(value).match(/^(−?-?)(\d+(?:\.\d+)?)(.*)$/);
    return m ? { sign: m[1], n: parseFloat(m[2]), tail: m[3] } : null;
  }, [value]);

  useEffect(() => {
    if (!run || !numeric) {
      setShown(value);
      return undefined;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 780;
    const tick = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - (1 - t) ** 3;
      const v = numeric.n * e;
      setShown(`${numeric.sign}${numeric.n % 1 ? v.toFixed(1) : Math.round(v)}${numeric.tail}`);
      if (t < 1) raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);
    // rAF may never run; land the real value regardless
    const guard = window.setTimeout(() => setShown(value), 1200);
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(guard);
    };
  }, [run, numeric, value]);

  return <span>{shown}</span>;
}

/* ── one drawing per figure ──────────────────────────────────────────────
   Small, line-drawn, and about that figure only. They are SVG with the motion in CSS, so a
   sixth costs a stylesheet block rather than a component. */

function Sketch({ id }) {
  if (id === 'otp') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="A security code arriving instantly">
        <text className="v19-sk-t" x="0" y="20">code arrives</text>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <g key={i} className="v19-sk-cell" style={{ '--i': i }}>
            <rect className="v19-sk-box" x={186 + i * 40} y="26" width="32" height="34" rx="3" />
            <text className="v19-sk-d" x={202 + i * 40} y="51">{[4, 9, 1, 8, 2, 7][i]}</text>
          </g>
        ))}
        <text className="v19-sk-t is-hot" x="418" y="51">now</text>
        <line className="v19-sk-rule" x1="0" y1="43" x2="176" y2="43" />
        <text className="v19-sk-t is-was" x="0" y="60">189 s ago</text>
      </svg>
    );
  }

  if (id === 'cost') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="Most messages decided by a matcher, a few by a model">
        <text className="v19-sk-t" x="0" y="44">every message</text>
        <path className="v19-sk-path" d="M110 40 H210" />
        <path className="v19-sk-path" d="M284 40 H430" />
        <path className="v19-sk-path" d="M284 40 C 320 40, 330 14, 368 14" />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <circle key={i} className="v19-sk-bead" style={{ '--i': i }} cx="110" cy="40" r="3.4" />
        ))}
        <circle className="v19-sk-bead is-up" cx="110" cy="40" r="3.4" />
        <rect className="v19-sk-gate" x="210" y="26" width="74" height="30" rx="3" />
        <text className="v19-sk-t is-mid is-centre" x="247" y="45">matcher</text>
        <rect className="v19-sk-model" x="368" y="2" width="58" height="24" rx="3" />
        <text className="v19-sk-t is-small is-centre" x="397" y="18">model</text>
        <text className="v19-sk-t is-hot" x="438" y="44">rule</text>
      </svg>
    );
  }

  if (id === 'rules') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="A sentence becoming a rule">
        <rect className="v19-sk-bubble" x="0" y="10" width="230" height="38" rx="6" />
        <text className="v19-sk-t is-say" x="14" y="34">“file anything from my landlord”</text>
        <path className="v19-sk-path is-short" d="M240 30 H300" />
        <g className="v19-sk-rule-row">
          <rect className="v19-sk-box is-wide" x="306" y="10" width="200" height="38" rx="3" />
          <text className="v19-sk-t is-mid" x="322" y="34">from: landlord → Home</text>
          <path className="v19-sk-tick" d="M478 30 l7 7 l13 -16" />
        </g>
        <text className="v19-sk-t is-was" x="0" y="66">it used to be a form with nine fields</text>
      </svg>
    );
  }

  if (id === 'memory') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="Answers checked against the ledger">
        <text className="v19-sk-t" x="0" y="16">the ledger</text>
        {[0, 1, 2].map((i) => (
          <g key={i} className="v19-sk-row" style={{ '--i': i }}>
            <rect className="v19-sk-line" x="0" y={26 + i * 16} width={120 - i * 18} height="6" rx="3" />
          </g>
        ))}
        <path className="v19-sk-path" d="M150 42 H250" />
        <rect className="v19-sk-box is-wide" x="250" y="22" width="150" height="34" rx="3" />
        <text className="v19-sk-t is-mid" x="266" y="44">stated in an answer</text>
        <g className="v19-sk-pass"><path className="v19-sk-tick" d="M420 32 l7 7 l13 -16" /><text className="v19-sk-t is-small" x="452" y="40">kept</text></g>
        <g className="v19-sk-fail"><path className="v19-sk-cross" d="M420 50 l14 14 M434 50 l-14 14" /><text className="v19-sk-t is-small is-was" x="452" y="64">dropped</text></g>
      </svg>
    );
  }

  if (id === 'auth') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="Authentication cost, before and after">
        <text className="v19-sk-t" x="0" y="20">each call</text>
        <rect className="v19-sk-line" x="90" y="10" width="360" height="12" rx="2" />
        <text className="v19-sk-t is-was" x="458" y="20">721 ms, booting</text>
        <rect className="v19-sk-fill is-hot" x="90" y="40" width="12" height="12" rx="2" />
        <text className="v19-sk-t is-hot" x="110" y="50">one lookup</text>
        <text className="v19-sk-t is-small" x="0" y="66">98.3% of the traffic was this</text>
      </svg>
    );
  }

  if (id === 'scan') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="Conversations sorted into real failures and expected behaviour">
        <text className="v19-sk-t" x="0" y="20">conversations</text>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <rect key={i} className={`v19-sk-tick-box${i % 5 === 2 ? ' is-hot' : ''}`} style={{ '--i': i }} x={4 + i * 14} y="30" width="10" height="10" rx="1.5" />
        ))}
        <path className="v19-sk-path" d="M190 35 H260" />
        <rect className="v19-sk-gate" x="260" y="20" width="84" height="30" rx="3" />
        <text className="v19-sk-t is-mid is-centre" x="302" y="39">scanner</text>
        <path className="v19-sk-path" d="M344 35 H400" />
        <rect className="v19-sk-fill is-hot" x="400" y="25" width="10" height="10" rx="1.5" />
        <rect className="v19-sk-fill is-hot" x="414" y="25" width="10" height="10" rx="1.5" />
        <text className="v19-sk-t is-hot" x="432" y="34">real</text>
        <text className="v19-sk-t is-small" x="400" y="62">the rest never reach the queue</text>
      </svg>
    );
  }

  if (id === 'txn') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="Transactions recovered">
        <text className="v19-sk-t" x="0" y="20">receipts</text>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
          <rect key={i} className={`v19-sk-tick-box${i < 12 ? ' is-hot' : ''}`} style={{ '--i': i }} x={90 + i * 22} y="26" width="16" height="20" rx="2" />
        ))}
        <text className="v19-sk-t is-hot" x="386" y="40">counted</text>
        <text className="v19-sk-t is-was" x="90" y="66">the model alone was dropping most of them</text>
      </svg>
    );
  }

  if (id === 'sms') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="A text with no body, then with one">
        <rect className="v19-sk-bubble" x="0" y="10" width="150" height="34" rx="6" />
        <text className="v19-sk-t is-was" x="14" y="31">(nothing)</text>
        <path className="v19-sk-path is-short" d="M160 27 H220" />
        <rect className="v19-sk-bubble" x="226" y="10" width="270" height="34" rx="6" />
        <text className="v19-sk-t is-say" x="240" y="31">Re: the lease, "Tuesday works, see you at 3"</text>
        <text className="v19-sk-t is-small" x="0" y="66">a quote-stripper returning an empty string</text>
      </svg>
    );
  }

  if (id === 'secure') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="An identifier reaching only its own mailbox">
        <text className="v19-sk-t" x="0" y="34">a model-supplied id</text>
        <path className="v19-sk-path" d="M150 30 H230" />
        <rect className="v19-sk-gate" x="230" y="14" width="70" height="30" rx="3" />
        <text className="v19-sk-t is-mid is-centre" x="265" y="33">check</text>
        <path className="v19-sk-path" d="M300 30 H360" />
        <rect className="v19-sk-box" x="360" y="14" width="60" height="30" rx="3" />
        <text className="v19-sk-t is-mid is-centre" x="390" y="33">yours</text>
        <g className="v19-sk-fail"><path className="v19-sk-cross" d="M300 46 l14 14 M314 46 l-14 14" /><text className="v19-sk-t is-small is-was" x="322" y="60">anyone else's</text></g>
      </svg>
    );
  }

  if (id === 'ship') {
    return (
      <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="Commits across a day">
        <text className="v19-sk-t" x="0" y="20">one day</text>
        {Array.from({ length: 34 }).map((_, i) => (
          <rect key={i} className="v19-sk-tick-box is-hot" style={{ '--i': i }} x={70 + i * 13} y={26 + ((i * 7) % 3) * 3} width="8" height={18 - ((i * 7) % 3) * 3} rx="1.5" />
        ))}
        <text className="v19-sk-t is-small" x="70" y="66">each one checked against production before it counts</text>
      </svg>
    );
  }

  if (id && id.startsWith('wp-')) return null;

  // latency, and the default
  return (
    <svg className="v19-sk" viewBox="0 0 520 74" role="img" aria-label="Mail reaching you in three seconds instead of ninety">
      <text className="v19-sk-t" x="0" y="26">inbox</text>
      <text className="v19-sk-t" x="474" y="26">you</text>
      <line className="v19-sk-rule" x1="52" y1="38" x2="462" y2="38" />
      <circle className="v19-sk-run is-slow" cx="52" cy="38" r="5" />
      <circle className="v19-sk-run is-fast" cx="52" cy="38" r="6" />
      <text className="v19-sk-t is-was" x="52" y="64">90 s, polling</text>
      <text className="v19-sk-t is-hot" x="462" y="64" textAnchor="end">3 s, dispatched</text>
    </svg>
  );
}

/* One figure: the before, the after, the line, and the why on request. */
function Dial({ f, live, isOpen, run, onLive, onPick }) {
  return (
    <div
      className={`v19-dial${live ? ' is-live' : ''}${isOpen ? ' is-open' : ''}`}
      onMouseEnter={() => onLive(f.id)}
      data-keep-open={isOpen ? '' : undefined}
    >
      <button
        type="button"
        className="v19-dial-face"
        onClick={() => {
          onLive(f.id);
          onPick(f.id);
        }}
        aria-expanded={isOpen}
        data-keep-open=""
      >
        <span className="v19-dial-was">{f.was}</span>
        <span className="v19-dial-now">
          <Tick value={f.now} run={run} />
        </span>
        <span className="v19-dial-label">{f.label}</span>
        <span className="v19-dial-mark" aria-hidden="true">{isOpen ? '−' : '+'}</span>
      </button>
      <div className="v19-dial-note" hidden={!isOpen}>
        <p>{f.note}</p>
      </div>
    </div>
  );
}

export default function Work({ sectionRef }) {
  const { lab } = useLab();
  const ref = useRef(null);
  const seen = useOnScreen(ref);
  const { open, toggle } = useOpener();
  const shown = lab.now === 'ten' ? FIGURES : FIGURES.filter((f) => f.top);
  const [live, setLive] = useState(shown[0].id);
  const [past, setPast] = useState(false);
  const figure = shown.find((f) => f.id === live) || shown[0];

  return (
    <section className="v19-work" ref={sectionRef} id="work" aria-label="What I do now">
      <div className="v19-now">
        <div className="v19-slab-in" ref={ref}>
          <header className="v19-head-split">
            <div>
              <p className="v19-eye">
                <span className="v19-dot is-live" aria-hidden="true" />
                {ALFRED.eyebrow} · {ALFRED.when}
              </p>
              <h2 className="v19-h2">
                {ALFRED.hello}{' '}
                <a className="v19-mark" href={ALFRED.url} target="_blank" rel="noreferrer">
                  <img src={ALFRED.logo} alt="" />
                  <span>{ALFRED.company}</span>
                </a>
                , {ALFRED.claim}
              </h2>
              <p className="v19-lede">{ALFRED.about}</p>
            </div>

            <aside className="v19-glance">
              <p className="v19-mini">At a glance</p>
              <dl>
                {ALFRED.glance.map((g) => (
                  <div key={g.k}><dt>{g.k}</dt><dd>{g.v}</dd></div>
                ))}
              </dl>
              <a className="v19-glance-go" href={ALFRED.url} target="_blank" rel="noreferrer">
                get-alfred.ai
              </a>
            </aside>
          </header>

          <div className={`v19-dials${shown.length > 5 ? ' is-ten' : ''}`} onMouseLeave={() => setLive(shown[0].id)}>
            {shown.map((f) => (
              <Dial key={f.id} f={f} live={live === f.id} isOpen={open === f.id} run={seen} onLive={setLive} onPick={toggle} />
            ))}
          </div>

          <div className="v19-sk-wrap" key={figure.id}>
            <Sketch id={figure.id} />
          </div>

          <div className="v19-work-under">
            <p className="v19-mini">Built on</p>
            <p className="v19-chiprow is-stack">
              {STACK.map((t) => (
                <span className="v19-chip" key={t}>{t}</span>
              ))}
            </p>
          </div>
        </div>
      </div>

      {/* below the fold: the one before Alfred_, shut */}
      <div className="v19-past">
        <div className="v19-slab-in">
          <div className={`v19-wp${past ? ' is-open' : ''}`} data-keep-open="">
            <button
              type="button"
              className="v19-wp-bar"
              onClick={() => setPast((p) => !p)}
              aria-expanded={past}
              data-keep-open=""
            >
              {WHEELPRICE.logo ? <img className="v19-wp-logo" src={WHEELPRICE.logo} alt="" /> : null}
              <span className="v19-wp-who">
                <b>{WHEELPRICE.company}</b>
                <i>{WHEELPRICE.title}</i>
              </span>
              <span className="v19-wp-say">{WHEELPRICE.short}</span>
              <span className="v19-wp-when">{WHEELPRICE.when}</span>
              <span className="v19-wp-chev" aria-hidden="true" />
            </button>

            <div className="v19-wp-open" hidden={!past}>
              <p className="v19-lede">{WHEELPRICE.about}</p>
              <div className="v19-dials is-small">
                {WHEELPRICE.figures.map((f) => (
                  <Dial key={f.id} f={f} live={false} isOpen={open === f.id} run={past} onLive={() => {}} onPick={toggle} />
                ))}
              </div>
              <p className="v19-chiprow is-stack">
                {WHEELPRICE.stack.map((t) => (
                  <span className="v19-chip" key={t}>{t}</span>
                ))}
              </p>
            </div>
          </div>

          <div className="v19-after">
            <p className="v19-mini">Also</p>
            {AFTER.map((r) => {
              const isOpen = open === r.id;
              return (
                <div className={`v19-role${isOpen ? ' is-open' : ''}`} key={r.id} data-keep-open={isOpen ? '' : undefined}>
                  <button type="button" className="v19-role-line" onClick={() => toggle(r.id)} aria-expanded={isOpen} data-keep-open="">
                    <span className="v19-role-when">{r.when}</span>
                    <span className="v19-role-who">
                      <b>{r.company}</b>
                      <i>{r.title}</i>
                    </span>
                    <span className="v19-role-say">{r.line}</span>
                    <span className="v19-role-chev" aria-hidden="true" />
                  </button>
                  <div className="v19-role-more" hidden={!isOpen}>
                    <ul>
                      {r.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                    <p className="v19-chiprow">
                      {r.tech.slice(0, 10).map((t) => (
                        <span className="v19-chip" key={t}>{t}</span>
                      ))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
