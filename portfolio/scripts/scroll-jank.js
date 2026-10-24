// Scroll jank on a phone: flings the page down and up, through the wall and back, many times on
// a touch screen with the CPU slowed to a phone's, and reports the frames per stretch: the median
// and the 95th percentile frame, how many frames ran past 33 ms, and which scripts held the
// longest animation frames.
//
//   node scripts/scroll-jank.js [url] [cpu-slowdown]
//
// The page is moved by finger drags (CDP touch events), not synthesized flings, which do not
// scroll it in a headless phone; so there is no momentum after a lift.
//
// e.g. node scripts/scroll-jank.js http://localhost:3000/ 4
//
// Needs playwright-core and a Chromium, the same way scripts/stress.js does (PLAYWRIGHT_CORE /
// CHROME, or an installed playwright-core).

const fs = require('fs');
const path = require('path');

const pw = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const URL = process.argv[2] || 'http://localhost:3000/';
const SLOW = Number(process.argv[3] || 4);
// --hide=<css selectors>: take parts of the page out, to find which one the frames go to
const HIDE = (process.argv.find((a) => a.startsWith('--hide=')) || '').slice(7);
const CYCLES = Number((process.argv.find((a) => a.startsWith('--cycles=')) || '--cycles=3').slice(9));

function chrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const root = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');
  const b = fs.readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse()[0];
  return path.join(root, b, 'chrome-win64', 'chrome.exe');
}

(async () => {
  const br = await pw.chromium.launch({ executablePath: chrome(), headless: true });
  const ctx = await br.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e)));
  const cdp = await ctx.newCDPSession(p);
  await p.addInitScript(() => {
    window.__frames = [];
    window.__ys = [];
    let last = 0;
    const tick = (t) => { if (last) { window.__frames.push(t - last); window.__ys.push(Math.round(window.scrollY)); } last = t; requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
    window.__loaf = [];
    try {
      new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__loaf.push({
        d: Math.round(e.duration),
        block: Math.round(e.blockingDuration || 0),
        style: Math.round(e.styleAndLayoutStart ? e.startTime + e.duration - e.styleAndLayoutStart : 0),
        scripts: (e.scripts || []).map((s) => `${s.invoker || s.name} ${Math.round(s.duration)}ms`).slice(0, 3),
      }))).observe({ type: 'long-animation-frame', buffered: true });
    } catch (err) { /* no LoAF in this build */ }
  });
  await p.goto(URL, { waitUntil: 'networkidle' });
  if (HIDE) await p.addStyleTag({ content: `${HIDE} { display: none !important; }` });
  await p.waitForTimeout(1500);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: SLOW });

  // a finger drag (synthesizeScrollGesture does not move this page in a headless phone): dy > 0
  // scrolls down, in steps of about 24 px a frame
  const fling = async (dy) => {
    const n = Math.max(4, Math.round(Math.abs(dy) / 24));
    const y0 = dy > 0 ? 780 : 80;
    const step = -dy / n;
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: y0 }] });
    for (let i = 1; i <= n; i += 1) {
      const y = y0 + step * i;
      // the finger stays on the screen: past an edge it lifts and comes back for the rest
      if (y < 20 || y > 824) {
        await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
        return fling(dy > 0 ? dy - (y0 - 20) : dy + (824 - y0));
      }
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y }] });
      await p.waitForTimeout(16);
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    return undefined;
  };
  const take = () => p.evaluate(() => { const f = window.__frames; const l = window.__loaf; const y = window.__ys; window.__frames = []; window.__loaf = []; window.__ys = []; return { f, l, y }; });
  const report = [];
  const stretch = async (name, fn) => {
    await take();
    await fn();
    await p.waitForTimeout(400);
    const { f, l, y } = await take();
    // the page jumping: a frame that moves against the way the stretch is going, or by a lot
    const dys = y.slice(1).map((v, i) => v - y[i]);
    const way = Math.sign(dys.reduce((a, b) => a + b, 0));
    const back = dys.filter((d) => Math.sign(d) === -way && Math.abs(d) > 2);
    const jumps = dys.filter((d) => Math.abs(d) > 160);
    const s = [...f].sort((a, b) => a - b);
    const q = (k) => (s.length ? Math.round(s[Math.min(s.length - 1, Math.floor(s.length * k))]) : 0);
    report.push({ name, frames: f.length, p50: q(0.5), p95: q(0.95), max: Math.round(s[s.length - 1] || 0), over33: f.filter((x) => x > 33).length, back: back.length ? `${back.length} (${back.slice(0, 4).join(',')})` : 0, jumps: jumps.slice(0, 4).join(',') || 0, worst: l.sort((a, b) => b.d - a.d).slice(0, 2) });
  };

  for (let cycle = 1; cycle <= CYCLES; cycle += 1) {
    await stretch(`c${cycle} down through the wall`, async () => { await fling(500); await p.waitForTimeout(1500); });
    await stretch(`c${cycle} down the page`, async () => { for (let i = 0; i < 4; i += 1) await fling(1400); });
    await stretch(`c${cycle} up the page`, async () => { for (let i = 0; i < 4; i += 1) await fling(-1400); });
    await stretch(`c${cycle} up to the top (wall back)`, async () => { for (let i = 0; i < 4; i += 1) await fling(-2000); await p.waitForTimeout(1500); });
  }
  const page = report.filter((r) => /the page/.test(r.name));
  const sum = (k) => page.reduce((a, r) => a + r[k], 0);
  console.log(`scrolling the page: ${sum('over33')} of ${sum('frames')} frames past 33 ms${HIDE ? ` (hidden: ${HIDE})` : ''}`);
  if (process.argv.includes('--brief')) { await br.close(); return; }
  report.forEach((r) => {
    console.log(`${r.name.padEnd(32)} frames ${String(r.frames).padStart(4)}  p50 ${String(r.p50).padStart(3)}ms  p95 ${String(r.p95).padStart(3)}ms  max ${String(r.max).padStart(4)}ms  >33ms ${r.over33}  backwards ${r.back}  jumps ${r.jumps}`);
    r.worst.forEach((w) => console.log(`    long frame ${w.d}ms (blocking ${w.block}, style+layout ${w.style}): ${w.scripts.join(' | ')}`));
  });
  if (errs.length) console.log('errors:', errs);
  await br.close();
})();
