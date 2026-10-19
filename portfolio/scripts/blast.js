// Frame timing across the blast only: hold to detonate, then record every frame interval for
// the collapse. Reports p50 / p95 / worst interval and frames over 25 ms, at 1x and 4x CPU.
//
//   PLAYWRIGHT_CORE=<dir> node scripts/blast.js [url] [dpr]

const path = require('path');
const fs = require('fs');

const pw = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const URL = process.argv[2] || 'http://127.0.0.1:4600/';
const DPR = Number(process.argv[3] || 2);
const root = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');
const build = fs.readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse()[0];
const EXE = path.join(root, build, 'chrome-win64', 'chrome.exe');

(async () => {
  const browser = await pw.chromium.launch({ executablePath: EXE, headless: false, args: ['--window-size=1500,950'] });
  for (const rate of [1, 4]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 860 }, deviceScaleFactor: DPR });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await page.goto(URL, { waitUntil: 'load' });
    await page.waitForTimeout(1200);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate });
    await page.mouse.move(700, 430);
    await page.waitForTimeout(300);
    await page.evaluate(() => {
      const t = (window.__t = []);
      let last = performance.now();
      const raw = window.requestAnimationFrame.bind(window);
      const tick = (now) => { t.push(now - last); last = now; if (t.length < 400) raw(tick); };
      raw(tick);
    });
    await page.mouse.down();
    await page.waitForTimeout(1000);
    await page.mouse.up();
    await page.waitForTimeout(2600);
    const t = await page.evaluate(() => window.__t.slice());
    let acc = 0;
    const after = t.filter((d) => (acc += d) > 950); // the collapse, not the fuse
    const s = after.slice().sort((a, b) => a - b);
    const q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))].toFixed(1);
    console.log(`cpu x${rate}  frames ${after.length}  p50 ${q(0.5)}  p95 ${q(0.95)}  worst ${s[s.length - 1].toFixed(1)}  >25ms ${after.filter((d) => d > 25).length}`);
    await ctx.close();
  }
  await browser.close();
})();
