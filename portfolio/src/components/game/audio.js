// portfolio/src/components/game/audio.js
//
// Tiny synth for Prompt Patrol. Pure Web Audio — no samples, no
// network, no licensing risk. Each sfx is a short blip with a pitch
// ramp and an exponential gain envelope. Default master volume is
// intentionally quiet (single-digit %); the audio stays in the
// background of the gameplay.

let ctx = null;
let master = null;
let muted = false;

// Browsers block AudioContext until a user gesture. The React wrapper
// calls `unlock()` on the first mouse/touch down. Subsequent calls are
// cheap.
export function unlock() {
  if (ctx) {
    if (ctx.state === 'suspended') ctx.resume();
    return;
  }
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 0.07; // very subtle
  master.connect(ctx.destination);
}

export function setMuted(m) {
  muted = m;
  if (master) master.gain.value = m ? 0 : 0.07;
}

// Core building block — a single oscillator with a frequency ramp and
// a gain envelope.
function blip({
  freq,
  freqTo,
  duration = 80,
  type = 'square',
  volume = 1,
  attackMs = 4,
  curve = 'exp',
}) {
  if (!ctx || muted) return;
  const t = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  if (freqTo !== undefined) {
    if (curve === 'exp') {
      osc.frequency.exponentialRampToValueAtTime(Math.max(freqTo, 0.01), t + duration / 1000);
    } else {
      osc.frequency.linearRampToValueAtTime(freqTo, t + duration / 1000);
    }
  }
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(volume, t + attackMs / 1000);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration / 1000);
  osc.connect(gain).connect(master);
  osc.start(t);
  osc.stop(t + duration / 1000 + 0.05);
}

// Layered noise click for "explosions" / hits.
function noise({ duration = 120, volume = 1, freq = 200 }) {
  if (!ctx || muted) return;
  const t = ctx.currentTime;
  const bufferSize = Math.floor(ctx.sampleRate * (duration / 1000));
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = freq;
  filter.Q.value = 0.6;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + duration / 1000);
  src.connect(filter).connect(gain).connect(master);
  src.start(t);
  src.stop(t + duration / 1000 + 0.02);
}

// Defer a callback by N ms (used to layer multi-blip effects).
const later = (ms, fn) => setTimeout(fn, ms);

// ============================================================
// Named effects
// ============================================================

export const sfx = {
  launch: () => blip({ freq: 880, freqTo: 220, duration: 90, type: 'square', volume: 0.8 }),

  launchHot: () => {
    // hot-red: rising whine then a low boom + noise
    blip({ freq: 440, freqTo: 1200, duration: 200, type: 'sawtooth', volume: 0.9 });
    later(160, () => blip({ freq: 180, freqTo: 60, duration: 220, type: 'square', volume: 1.1 }));
    later(160, () => noise({ duration: 220, volume: 0.6, freq: 220 }));
  },

  charging: () => blip({ freq: 660, freqTo: 990, duration: 100, type: 'sine', volume: 0.4 }),

  overcharge: () => blip({ freq: 770, freqTo: 1320, duration: 80, type: 'sawtooth', volume: 0.5 }),

  popUnsafe: () => {
    blip({ freq: 1320, freqTo: 660, duration: 60, type: 'square', volume: 0.7 });
    later(40, () => blip({ freq: 1760, duration: 40, type: 'square', volume: 0.4 }));
  },

  popSafe: () => blip({ freq: 220, freqTo: 110, duration: 120, type: 'sine', volume: 0.7 }),

  popBomb: () => {
    // triumphant: rising arpeggio + small noise burst
    blip({ freq: 523, duration: 60, type: 'square', volume: 0.8 });
    later(60, () => blip({ freq: 659, duration: 60, type: 'square', volume: 0.8 }));
    later(120, () => blip({ freq: 880, duration: 90, type: 'square', volume: 0.9 }));
    later(60, () => noise({ duration: 120, volume: 0.4, freq: 400 }));
  },

  thinking: () => {
    // tiny 2-note tingle when model receives a safe prompt
    blip({ freq: 1320, duration: 50, type: 'sine', volume: 0.4 });
    later(60, () => blip({ freq: 1760, duration: 50, type: 'sine', volume: 0.35 }));
  },

  hit: () => {
    // dull thud — unsafe slipped through
    blip({ freq: 110, freqTo: 55, duration: 220, type: 'square', volume: 0.9 });
    noise({ duration: 160, volume: 0.5, freq: 140 });
  },

  windChange: () => blip({ freq: 330, freqTo: 660, duration: 140, type: 'sine', volume: 0.45 }),

  gameOverLives: () => {
    blip({ freq: 220, freqTo: 55, duration: 600, type: 'sawtooth', volume: 0.9 });
    later(400, () => noise({ duration: 400, volume: 0.4, freq: 120 }));
  },

  gameOverBomb: () => {
    // explosion + descending wail
    noise({ duration: 400, volume: 0.9, freq: 200 });
    blip({ freq: 1320, freqTo: 55, duration: 700, type: 'sawtooth', volume: 0.9 });
  },

  start: () => {
    blip({ freq: 523, duration: 60, type: 'square', volume: 0.6 });
    later(60, () => blip({ freq: 659, duration: 60, type: 'square', volume: 0.6 }));
    later(120, () => blip({ freq: 880, duration: 90, type: 'square', volume: 0.7 }));
  },
};
