// Bomb, second pass — the walls, painted. Square tiles on a dark surface, one accent, modern type.
// Each painter returns the texture and the rectangles that should be clickable, with a cursor kind.
import { brickGrid } from './wall';
import { INTRO, ALFRED, BEFORE, FEATURED, PAPERS, LINKS } from './copy';

export const DISPLAY = "'Space Grotesk', 'Segoe UI', system-ui, sans-serif";
export const BODY = "'Manrope', 'Segoe UI', system-ui, sans-serif";
const WHITE = '#f3f5f9';
const MUTED = 'rgba(243,245,249,0.68)';
const DIM = 'rgba(243,245,249,0.42)';
export const ACCENT = '#7ee0c6';

function rnd(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Square tiles with a hairline gap, on a deep tinted ground. */
function paintTiles(ctx, W, H, size, hue, seed) {
  const r = rnd(seed);
  ctx.fillStyle = `hsl(${hue}, 22%, 5%)`;
  ctx.fillRect(0, 0, W, H);
  for (const t of brickGrid(W, H, size, size)) {
    const l = 9 + r() * 3.5;
    const g = ctx.createLinearGradient(t.x, t.y, t.x + t.w, t.y + t.h);
    g.addColorStop(0, `hsl(${hue}, 18%, ${l + 1.5}%)`);
    g.addColorStop(1, `hsl(${hue}, 20%, ${l - 1.5}%)`);
    ctx.fillStyle = g;
    ctx.fillRect(t.x + 1, t.y + 1, t.w - 2, t.h - 2);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fillRect(t.x + 1, t.y + 1, t.w - 2, 1);
    ctx.fillRect(t.x + 1, t.y + 1, 1, t.h - 2);
    if (r() < 0.06) {
      ctx.fillStyle = `rgba(126,224,198,${0.25 + r() * 0.35})`;
      ctx.fillRect(t.x + t.w - 8, t.y + t.h - 8, 3, 3);
    }
  }
}

function wrap(ctx, text, maxW) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const t = line ? `${line} ${w}` : w;
    if (ctx.measureText(t).width > maxW && line) {
      lines.push(line);
      line = w;
    } else line = t;
  }
  if (line) lines.push(line);
  return lines;
}

function paragraph(ctx, text, x, y, maxW, lh) {
  const lines = wrap(ctx, text, maxW);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
  return y + lines.length * lh;
}

function title(ctx, text, x, y, size) {
  ctx.save();
  ctx.font = `600 ${size}px ${DISPLAY}`;
  ctx.fillStyle = WHITE;
  ctx.textBaseline = 'alphabetic';
  ctx.letterSpacing = '-0.02em';
  ctx.fillText(text, x, y);
  ctx.restore();
}

function label(ctx, text, x, y, size = 13, color = DIM) {
  ctx.save();
  ctx.font = `600 ${size}px ${BODY}`;
  ctx.fillStyle = color;
  ctx.letterSpacing = '0.08em';
  ctx.fillText(text, x, y);
  ctx.restore();
}

function frame(ctx, x, y, w, h, radius = 8, fill = 'rgba(255,255,255,0.04)') {
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function accentRule(ctx, x, y, w) {
  ctx.fillStyle = ACCENT;
  ctx.fillRect(x, y, w, 2);
}

function makeCanvas(W, H) {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  return c;
}

function circleImage(ctx, img, cx, cy, r) {
  ctx.save();
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 8, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  const s = Math.min(img.width, img.height);
  ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

// the bottom-left corner is reserved for the checkpoint control, the bottom-right for the depth
const RESERVED = 92;

// ---------- panel 1: hey ----------
export function paintIntro({ W, H, size, images }) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  paintTiles(ctx, W, H, size, 222, 11);
  const m = Math.max(40, W * 0.07);
  const narrow = W < 820;
  const r = Math.min(104, H * 0.14, W * 0.11);
  const tx = narrow ? m : m + r * 2 + 64;
  const maxW = Math.min(600, W - tx - m);
  const ts = Math.max(38, Math.min(68, W * 0.046));
  ctx.font = `400 18px ${BODY}`;
  const paraH = INTRO.paragraphs.reduce((h, p) => h + wrap(ctx, p, maxW).length * 30 + 14, 0);
  const blockH = ts + 30 + paraH;
  const top = narrow ? m + r * 2 + 36 : Math.max(m, (H - RESERVED - blockH) / 2);
  if (images.photo) circleImage(ctx, images.photo, m + r, narrow ? m + r : top + ts / 2 + 20, r);
  label(ctx, 'AI ENGINEER', tx, top - 14, 12, ACCENT);
  title(ctx, INTRO.hello, tx, top + ts * 0.86, ts);
  accentRule(ctx, tx, top + ts + 10, 44);
  ctx.font = `400 18px ${BODY}`;
  ctx.fillStyle = MUTED;
  let y = top + ts + 44;
  for (const p of INTRO.paragraphs) {
    ctx.fillStyle = y === top + ts + 44 ? WHITE : MUTED;
    y = paragraph(ctx, p, tx, y, maxW, 30) + 14;
  }
  label(ctx, 'HOLD ANYWHERE TO LIGHT THE FUSE', W / 2 - ctx.measureText('HOLD ANYWHERE TO LIGHT THE FUSE').width / 2 + 40, H - 34, 11.5, DIM);
  return { texture: c, links: [] };
}

// ---------- panel 2: what I do ----------
export function paintWork({ W, H, size }) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  paintTiles(ctx, W, H, size, 238, 23);
  const m = Math.max(40, W * 0.07);
  const ts = Math.max(32, Math.min(54, W * 0.038));
  label(ctx, 'NOW', m, m + 4, 12, ACCENT);
  title(ctx, 'What I do at Alfred_', m, m + ts + 10, ts);
  const links = [{ x: m, y: m, w: Math.min(W - 2 * m, ts * 10.2), h: ts * 1.4, href: ALFRED.url, label: 'Alfred_', cursor: 'hand' }];

  const figs = ALFRED.figures;
  const fy = m + ts + 62;
  const colW = (W - 2 * m) / figs.length;
  figs.forEach((f, i) => {
    const x = m + i * colW;
    accentRule(ctx, x, fy, 28);
    ctx.font = `600 ${Math.min(46, colW * 0.32)}px ${DISPLAY}`;
    ctx.fillStyle = WHITE;
    ctx.letterSpacing = '-0.02em';
    ctx.fillText(f.to ? f.to : f.big, x, fy + 58);
    ctx.letterSpacing = '0';
    if (f.to) label(ctx, `WAS ${f.big.toUpperCase()}`, x, fy + 80, 11, DIM);
    ctx.font = `400 14px ${BODY}`;
    ctx.fillStyle = MUTED;
    paragraph(ctx, f.what, x, fy + (f.to ? 104 : 84), colW - 24, 20);
  });

  const px = m;
  const pw = Math.min(760, W - 2 * m);
  const py = fy + 160;
  ctx.font = `400 17px ${BODY}`;
  const leadH = wrap(ctx, ALFRED.lead, pw - 48).length * 28;
  ctx.font = `400 15px ${BODY}`;
  const roleH = BEFORE.reduce((h, r) => h + wrap(ctx, r.line, pw - 48 - 160).length * 23 + 40, 0);
  const ph = 24 + leadH + 26 + 22 + roleH;
  const availH = H - py - RESERVED;
  const scale = availH < ph ? availH / ph : 1;
  frame(ctx, px, py, pw, Math.min(ph, availH), 10);
  ctx.save();
  if (scale < 1) {
    ctx.translate(px, py);
    ctx.scale(1, scale);
    ctx.translate(-px, -py);
  }
  ctx.font = `400 17px ${BODY}`;
  ctx.fillStyle = WHITE;
  let y = paragraph(ctx, ALFRED.lead, px + 24, py + 24 + 17, pw - 48, 28);
  y += 22;
  label(ctx, 'BEFORE', px + 24, y, 11.5, ACCENT);
  y += 26;
  for (const r of BEFORE) {
    ctx.font = `600 16px ${DISPLAY}`;
    ctx.fillStyle = WHITE;
    ctx.fillText(r.company, px + 24, y + 12);
    ctx.font = `400 15px ${BODY}`;
    ctx.fillStyle = MUTED;
    const after = paragraph(ctx, r.line, px + 24 + 160, y + 12, pw - 48 - 160, 23);
    ctx.font = `400 12.5px ${BODY}`;
    ctx.fillStyle = DIM;
    ctx.fillText(`${r.title}. ${r.when}`, px + 24 + 160, after + 2);
    y = after + 26;
  }
  ctx.restore();
  return { texture: c, links };
}

// ---------- panel 3: things I made ----------
export function paintMade({ W, H, size, images }) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  paintTiles(ctx, W, H, size, 190, 37);
  const m = Math.max(40, W * 0.07);
  const ts = Math.max(32, Math.min(54, W * 0.038));
  label(ctx, 'SELECTED WORK', m, m + 4, 12, ACCENT);
  title(ctx, 'Things I made', m, m + ts + 10, ts);
  const links = [];
  const cols = W < 720 ? 1 : W < 1100 ? 2 : 3;
  const rows = Math.ceil(FEATURED.length / cols);
  const gap = 24;
  const top = m + ts + 44;
  const availH = H - top - RESERVED;
  const cellW = (W - 2 * m - gap * (cols - 1)) / cols;
  let imgW = cellW;
  let imgH = imgW * 0.58;
  const labelH = 70;
  let cellH = imgH + labelH;
  if (rows * cellH + (rows - 1) * gap > availH) {
    const k = (availH - (rows - 1) * gap) / (rows * cellH);
    imgW *= k;
    imgH *= k;
    cellH = imgH + labelH;
  }
  FEATURED.forEach((p, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = m + col * (cellW + gap);
    const y = top + row * (cellH + gap);
    const img = images[p.id];
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, imgW, imgH, 10);
    ctx.clip();
    ctx.fillStyle = '#12161e';
    ctx.fillRect(x, y, imgW, imgH);
    if (img) {
      if (p.square) {
        const s = imgH;
        ctx.drawImage(img, x + (imgW - s) / 2, y, s, s);
      } else {
        const ar = imgW / imgH;
        let sw = img.width;
        let sh = img.width / ar;
        if (sh > img.height) {
          sh = img.height;
          sw = img.height * ar;
        }
        ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, x, y, imgW, imgH);
      }
    }
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x + 0.5, y + 0.5, imgW - 1, imgH - 1, 10);
    ctx.strokeStyle = 'rgba(255,255,255,0.18)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
    ctx.font = `600 19px ${DISPLAY}`;
    ctx.fillStyle = WHITE;
    ctx.fillText(p.name, x, y + imgH + 28);
    ctx.font = `400 14px ${BODY}`;
    ctx.fillStyle = MUTED;
    const lines = wrap(ctx, p.line, imgW - 10).slice(0, 2);
    lines.forEach((l, k) => ctx.fillText(l, x, y + imgH + 48 + k * 19));
    links.push({ x, y, w: imgW, h: imgH + labelH, href: p.link, label: `${p.name}, ${p.action}`, cursor: 'zoom' });
  });
  return { texture: c, links };
}

// ---------- panel 4: papers and where to find me ----------
export function paintPapers({ W, H, size }) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  paintTiles(ctx, W, H, size, 262, 41);
  const m = Math.max(40, W * 0.07);
  const ts = Math.max(32, Math.min(54, W * 0.038));
  label(ctx, 'RESEARCH', m, m + 4, 12, ACCENT);
  title(ctx, 'Three papers', m, m + ts + 10, ts);
  const links = [];
  const cols = W < 900 ? 1 : 3;
  const gap = 22;
  const cw = (W - 2 * m - gap * (cols - 1)) / cols;
  const top = m + ts + 44;
  const ch = cols === 1 ? 140 : Math.min(232, H * 0.32);
  PAPERS.forEach((p, i) => {
    const x = m + (i % cols) * (cw + gap);
    const y = top + Math.floor(i / cols) * (ch + gap);
    frame(ctx, x, y, cw, ch, 10, p.accepted ? 'rgba(126,224,198,0.06)' : 'rgba(255,255,255,0.04)');
    // status pill
    ctx.save();
    ctx.font = `600 11.5px ${BODY}`;
    ctx.letterSpacing = '0.08em';
    const st = p.status.toUpperCase();
    const sw = ctx.measureText(st).width + 22;
    ctx.beginPath();
    ctx.roundRect(x + 20, y + 18, sw, 24, 12);
    ctx.fillStyle = p.accepted ? ACCENT : 'rgba(255,255,255,0.1)';
    ctx.fill();
    ctx.fillStyle = p.accepted ? '#0b1410' : MUTED;
    ctx.fillText(st, x + 31, y + 34);
    ctx.restore();
    ctx.font = `600 19px ${DISPLAY}`;
    ctx.fillStyle = WHITE;
    let y2 = paragraph(ctx, p.short, x + 20, y + 74, cw - 40, 24);
    ctx.font = `400 14.5px ${BODY}`;
    ctx.fillStyle = MUTED;
    y2 = paragraph(ctx, p.line, x + 20, y2 + 8, cw - 40, 21);
    ctx.font = `400 12.5px ${BODY}`;
    ctx.fillStyle = DIM;
    ctx.fillText(`${p.venue}${p.citations ? ` · ${p.citations} citations` : ''}`, x + 20, y2 + 10);
    if (p.pdf) links.push({ x, y, w: cw, h: ch, href: p.pdf, label: `${p.short}, paper`, cursor: 'zoom' });
  });

  const fy = top + (cols === 1 ? 3 * (ch + gap) : ch + gap) + 50;
  label(ctx, 'FIND ME', m, fy, 12, ACCENT);
  ctx.font = `500 17px ${BODY}`;
  let x = m;
  const ly = fy + 38;
  for (const l of LINKS) {
    const w = ctx.measureText(l.label).width;
    ctx.fillStyle = WHITE;
    ctx.fillText(l.label, x, ly);
    ctx.fillStyle = 'rgba(126,224,198,0.7)';
    ctx.fillRect(x, ly + 6, w, 1);
    links.push({ x: x - 6, y: ly - 20, w: w + 12, h: 32, href: l.href, label: l.label, cursor: 'hand' });
    x += w + 32;
  }
  return { texture: c, links };
}

export const PAINTERS = [paintIntro, paintWork, paintMade, paintPapers];
