// Diagnostics and a stress test for the site, driven through a real Chromium.
//
//   node scripts/stress.js [url] [dpr] [--quick]
//
// e.g. node scripts/stress.js http://localhost:3000/ 2 --quick
//
// It loads the page and reports, at each step: frames per second, how many animation loops
// are running per frame (must stay at 1 on the wall, 0 with nothing animating), JS time per
// frame, long frames, heap, DOM nodes, listeners, canvases and page errors. The steps: idle on
// the wall; the pointer on it and moving; five main-thread stalls; twenty seconds in a
// background tab; a resize storm; the blast; a scroll to the room; hovering in the room; three
// rebuild-and-blast cycles; then (without --quick) three minutes idle, sampling the heap.
//
// Needs playwright-core and a Chromium. Either `npm i -D playwright-core && npx playwright
// install chromium`, or point PLAYWRIGHT_CORE at a playwright-core directory and CHROME at a
// chrome executable.

const fs = require('fs');
const path = require('path');

function findPlaywright() {
  if (process.env.PLAYWRIGHT_CORE) return require(process.env.PLAYWRIGHT_CORE);
  try { return require('playwright-core'); } catch (e) { /* look in the npx cache */ }
  try { return require('playwright'); } catch (e) { /* as above */ }
  const cache = path.join(process.env.LOCALAPPDATA || '', 'npm-cache', '_npx');
  if (fs.existsSync(cache)) {
    for (const d of fs.readdirSync(cache)) {
      const p = path.join(cache, d, 'node_modules', 'playwright-core');
      if (fs.existsSync(p)) return require(p);
    }
  }
  throw new Error('playwright-core not found: npm i -D playwright-core, or set PLAYWRIGHT_CORE');
}

function findChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const roots = [path.join(process.env.LOCALAPPDATA || '', 'ms-playwright'), path.join(process.env.HOME || '', '.cache', 'ms-playwright')];
  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    const builds = fs.readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse();
    for (const b of builds) {
      for (const exe of ['chrome-win64/chrome.exe', 'chrome-win/chrome.exe', 'chrome-linux/chrome', 'chrome-mac/Chromium.app/Contents/MacOS/Chromium']) {
        const p = path.join(root, b, exe);
        if (fs.existsSync(p)) return p;
      }
    }
  }
  return undefined; // playwright's own default, if it has one installed
}

const pw = findPlaywright();
const URL = process.argv[2] || 'http://127.0.0.1:4600/';
const DPR = Number(process.argv[3] || 1);
const EXE = findChrome();

// runs before any page script: counts rAF callbacks scheduled and run, per frame, plus long tasks
const INIT = `(() => {
  const d = (window.__diag = { ran: 0, scheduled: 0, perFrame: [], busy: [], busyAcc: 0, longTasks: 0, longTaskMs: 0, worst: 0, loaf: 0, loafWorst: 0, errors: [] });
  const raw = window.requestAnimationFrame.bind(window);
  window.__rawRAF = raw;
  window.requestAnimationFrame = (cb) => { d.scheduled += 1; return raw((t) => { d.ran += 1; const s = performance.now(); try { return cb(t); } finally { d.busyAcc += performance.now() - s; } }); };
  let last = 0;
  const sample = () => { d.perFrame.push(d.ran - last); d.busy.push(d.busyAcc); d.busyAcc = 0; if (d.perFrame.length > 4000) { d.perFrame.shift(); d.busy.shift(); } last = d.ran; raw(sample); };
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) { d.loaf += 1; d.loafWorst = Math.max(d.loafWorst, e.duration); } }).observe({ type: 'long-animation-frame', buffered: true }); } catch (e) {}
  raw(sample);
  window.addEventListener('error', (e) => d.errors.push(String(e.message)));
  window.addEventListener('unhandledrejection', (e) => d.errors.push('rejection: ' + String(e.reason)));
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) { d.longTasks += 1; d.longTaskMs += e.duration; d.worst = Math.max(d.worst, e.duration); } }).observe({ type: 'longtask', buffered: true });
  } catch (e) {}
})();`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function snapshot(page, cdp, label) {
  const m = await cdp.send('Performance.getMetrics');
  const get = (n) => { const x = m.metrics.find((k) => k.name === n); return x ? x.value : null; };
  const inPage = await page.evaluate(() => {
    const d = window.__diag;
    const recent = d.perFrame.slice(-60);
    const mode = {};
    recent.forEach((v) => { mode[v] = (mode[v] || 0) + 1; });
    const top = Object.entries(mode).sort((a, b) => b[1] - a[1])[0];
    const busy = d.busy.slice(-60);
    const busyAvg = busy.length ? busy.reduce((a, b) => a + b, 0) / busy.length : 0;
    const busyMax = busy.length ? Math.max(...busy) : 0;
    return {
      busyAvgMs: Number(busyAvg.toFixed(2)),
      busyMaxMs: Number(busyMax.toFixed(1)),
      loaf: d.loaf,
      loafWorstMs: Math.round(d.loafWorst),
      hidden: document.hidden,
      loopsPerFrame: top ? Number(top[0]) : null,
      loopsPerFrameHist: mode,
      scheduled: d.scheduled,
      ran: d.ran,
      longTasks: d.longTasks,
      longTaskMs: Math.round(d.longTaskMs),
      worstTaskMs: Math.round(d.worst),
      canvases: document.querySelectorAll('canvas').length,
      errors: d.errors.slice(-5),
      wall: !!document.querySelector('.v19-wall-canvas'),
      landing: !!document.querySelector('.v19-face'),
      blown: document.querySelector('.v19')?.classList.contains('is-open') || false,
    };
  });
  // frame rate over one second, measured with the raw rAF so our own count is not inflated
  const fps = await page.evaluate(() => new Promise((res) => {
    const t0 = performance.now(); let n = 0;
    const f = () => { n += 1; if (performance.now() - t0 < 1000) window.__rawRAF(f); else res(n); };
    window.__rawRAF(f);
  }));
  const row = {
    label,
    fps,
    loopsPerFrame: inPage.loopsPerFrame,
    jsPerFrameMs: inPage.busyAvgMs,
    jsPerFrameMaxMs: inPage.busyMaxMs,
    longFrames: inPage.loaf,
    longFrameWorstMs: inPage.loafWorstMs,
    heapMB: Math.round(get('JSHeapUsedSize') / 1048576),
    heapTotalMB: Math.round(get('JSHeapTotalSize') / 1048576),
    nodes: get('Nodes'),
    listeners: get('JSEventListeners'),
    layouts: get('LayoutCount'),
    styleRecalcs: get('RecalcStyleCount'),
    longTasks: inPage.longTasks,
    longTaskMs: inPage.longTaskMs,
    worstTaskMs: inPage.worstTaskMs,
    canvases: inPage.canvases,
    wall: inPage.wall,
    blown: inPage.blown,
    errors: inPage.errors,
  };
  console.log(`${row.label.padEnd(44)} fps ${String(row.fps).padStart(3)}  loops/frame ${row.loopsPerFrame}  js/frame ${row.jsPerFrameMs} ms (max ${row.jsPerFrameMaxMs})  heap ${row.heapMB} MB  nodes ${row.nodes}  listeners ${row.listeners}  errors ${row.errors.length}`);
  return row;
}

(async () => {
  const browser = await pw.chromium.launch({ executablePath: EXE, headless: true, args: ['--enable-gpu', '--ignore-gpu-blocklist'] });
  console.log('chromium', EXE || '(playwright default)');
  const context = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: DPR });
  const page = await context.newPage();
  await page.addInitScript(INIT);
  page.on('pageerror', (e) => console.log('PAGE ERROR', String(e)));
  page.on('crash', () => console.log('PAGE CRASHED'));
  const cdp = await context.newCDPSession(page);
  await cdp.send('Performance.enable');

  const t0 = Date.now();
  await page.goto(URL, { waitUntil: 'load' });
  const gpu = await page.evaluate(() => { try { const c = document.createElement('canvas'); const gl = c.getContext('webgl'); const x = gl.getExtension('WEBGL_debug_renderer_info'); return gl.getParameter(x.UNMASKED_RENDERER_WEBGL); } catch (e) { return String(e); } });
  console.log('GPU', gpu, 'dpr', DPR);
  const nav = await page.evaluate(() => {
    const n = performance.getEntriesByType('navigation')[0];
    const p = performance.getEntriesByType('paint');
    const fcp = p.find((x) => x.name === 'first-contentful-paint');
    return { domContentLoaded: Math.round(n.domContentLoadedEventEnd), load: Math.round(n.loadEventEnd), fcp: fcp ? Math.round(fcp.startTime) : null, transferKB: Math.round(performance.getEntriesByType('resource').reduce((a, r) => a + (r.transferSize || 0), 0) / 1024) };
  });
  console.log('LOAD', JSON.stringify(nav), 'wall clock', Date.now() - t0, 'ms');
  await sleep(2500);
  await snapshot(page, cdp, '1 baseline: wall up, pointer outside');
  await page.mouse.move(800, 450);
  await sleep(1200);
  await snapshot(page, cdp, '1b wall up, pointer resting on it');
  for (let i = 0; i < 40; i += 1) { await page.mouse.move(400 + i * 20, 300 + (i % 7) * 30); await sleep(16); }
  await snapshot(page, cdp, '1c wall up, pointer moving');
  await page.mouse.move(-10, -10).catch(() => {});

  // ── 2. five main-thread stalls longer than the watchdogs' thresholds ──
  for (let i = 0; i < 5; i += 1) {
    await page.evaluate(() => { const t = performance.now(); while (performance.now() - t < 600) { /* block */ } });
    await sleep(150);
  }
  await sleep(800);
  await snapshot(page, cdp, '2 after 5 x 600 ms stalls');

  // ── 3. the tab goes to the background for 20 s ──
  const other = await context.newPage();
  await other.goto('about:blank');
  await other.bringToFront();
  await sleep(20000);
  const hiddenInfo = await page.evaluate(() => ({ hidden: document.hidden, scheduled: window.__diag.scheduled, ran: window.__diag.ran }));
  console.log('while hidden', JSON.stringify(hiddenInfo));
  await page.bringToFront();
  await other.close();
  await sleep(1500);
  await snapshot(page, cdp, '3 back from 20 s in the background');

  // ── 4. a resize storm: 40 sizes in quick succession ──
  for (let i = 0; i < 40; i += 1) {
    await page.setViewportSize({ width: 1200 + (i % 8) * 60, height: 800 + (i % 5) * 40 });
    await sleep(25);
  }
  await page.setViewportSize({ width: 1600, height: 900 });
  await sleep(1200);
  await snapshot(page, cdp, '4 after a 40-step resize storm');

  // ── 5. blow the wall, then scroll the whole page ──
  await page.mouse.move(800, 450);
  await page.mouse.down();
  await sleep(1100);
  await page.mouse.up();
  await sleep(1500);
  await snapshot(page, cdp, '5 wall blown, landing gone');
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const scrollT0 = Date.now();
  for (let y = 0; y < height; y += 120) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await sleep(16);
  }
  console.log('scrolled', height, 'px in', Date.now() - scrollT0, 'ms');
  await sleep(600);
  await snapshot(page, cdp, '6 after scrolling to the room');
  // hover about the room and click a few things
  const room = await page.$('#room canvas');
  if (room) {
    const b = await room.boundingBox();
    for (let i = 0; i < 30; i += 1) { await page.mouse.move(b.x + (i * 37) % b.width, b.y + (i * 53) % b.height); await sleep(30); }
  }
  await sleep(800);
  await snapshot(page, cdp, '7 room, after hovering');

  // ── 8. home (wall back), blow it again, three times ──
  for (let i = 0; i < 3; i += 1) {
    await page.click('.v19-bar-home').catch(() => {});
    await sleep(1800);
    await page.mouse.move(700, 400);
    await page.mouse.down();
    await sleep(1100);
    await page.mouse.up();
    await sleep(1800);
  }
  await snapshot(page, cdp, '8 after three wall rebuild + blast cycles');

  // ── 9. soak: three minutes idle on the wall, sampling heap ──
  await page.click('.v19-bar-home').catch(() => {});
  await sleep(1500);
  const soakMinutes = process.argv.includes('--quick') ? 0 : 3;
  for (let i = 1; i <= soakMinutes; i += 1) {
    await sleep(60000);
    await snapshot(page, cdp, `9 soak, minute ${i}, wall up`);
  }

  await browser.close();
})().catch((e) => { console.error('HARNESS ERROR', e); process.exit(1); });
