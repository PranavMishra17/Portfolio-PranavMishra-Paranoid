// Bomb — the walls, painted. Each panel is one brick wall with its content on it: big words
// painted straight onto the brick, paragraphs on patches of plaster, project images pasted up like
// posters. Every painter returns the texture and the rectangles that should be clickable.
import { brickGrid } from './wall';
import { INTRO, ALFRED, BEFORE, FEATURED, PAPERS, LINKS } from './copy';

export const SERIF = "'Fraunces', 'Iowan Old Style', Georgia, serif";
export const SANS = "'Commissioner', 'Segoe UI', system-ui, sans-serif";
const CREAM = '#f7efe1';
const INK = '#24262b';

function rnd(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function hsl(h, s, l, a = 1) {
  return `hsla(${h}, ${s}%, ${l}%, ${a})`;
}

/** Bricks and mortar over the whole canvas, in one hue. */
function paintBricks(ctx, W, H, bw, bh, hue, sat, light, seed) {
  const r = rnd(seed);
  ctx.fillStyle = hsl(hue, Math.max(6, sat - 18), Math.max(10, light - 22));
  ctx.fillRect(0, 0, W, H);
  for (const b of brickGrid(W, H, bw, bh)) {
    const dl = (r() - 0.5) * 9;
    const ds = (r() - 0.5) * 8;
    ctx.fillStyle = hsl(hue + (r() - 0.5) * 6, sat + ds, light + dl);
    ctx.fillRect(b.x + 1.5, b.y + 1.5, b.w - 3, b.h - 3);
    // a lit top edge and a shaded bottom edge, one pixel each
    ctx.fillStyle = hsl(hue, sat, light + dl + 9, 0.55);
    ctx.fillRect(b.x + 1.5, b.y + 1.5, b.w - 3, 1);
    ctx.fillStyle = hsl(hue, sat, light + dl - 12, 0.5);
    ctx.fillRect(b.x + 1.5, b.y + b.h - 2.5, b.w - 3, 1);
    // a few pocks
    if (r() < 0.35) {
      ctx.fillStyle = hsl(hue, sat, light + dl - 7, 0.6);
      ctx.fillRect(b.x + 6 + r() * (b.w - 14), b.y + 4 + r() * (b.h - 8), 2, 2);
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

function plaster(ctx, x, y, w, h) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.28)';
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = 'rgba(247, 242, 233, 0.96)';
  ctx.fillRect(x, y, w, h);
  ctx.restore();
  ctx.strokeStyle = 'rgba(36,38,43,0.18)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}

function mural(ctx, text, x, y, size, { italic = true, align = 'left' } = {}) {
  ctx.save();
  ctx.font = `${italic ? 'italic ' : ''}500 ${size}px ${SERIF}`;
  ctx.textAlign = align;
  ctx.textBaseline = 'alphabetic';
  ctx.shadowColor = 'rgba(0,0,0,0.42)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = CREAM;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function smallOnBrick(ctx, text, x, y, size = 15, alpha = 0.9, align = 'left') {
  ctx.save();
  ctx.font = `400 ${size}px ${SANS}`;
  ctx.textAlign = align;
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = `rgba(247,239,225,${alpha})`;
  ctx.fillText(text, x, y);
  ctx.restore();
}

function measureParagraphs(ctx, paras, maxW, lh, gap) {
  let h = 0;
  for (const p of paras) h += wrap(ctx, p, maxW).length * lh + gap;
  return h - gap;
}

function makeCanvas(W, H) {
  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  return c;
}

function circleImage(ctx, img, cx, cy, r) {
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 24;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = CREAM;
  ctx.beginPath();
  ctx.arc(cx, cy, r + 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.clip();
  const s = Math.min(img.width, img.height);
  ctx.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

// ---------- panel 1: hey ----------
export function paintIntro({ W, H, bw, bh, images }) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  paintBricks(ctx, W, H, bw, bh, 14, 46, 44, 11);
  const m = Math.max(36, W * 0.06);
  const narrow = W < 820;
  const r = Math.min(118, H * 0.15, W * 0.12);
  const tx = narrow ? m : m + r * 2 + 64;
  const maxW = Math.min(620, W - tx - m);
  const size = Math.max(40, Math.min(74, W * 0.05));
  ctx.font = `400 19px ${SANS}`;
  const paraH = measureParagraphs(ctx, INTRO.paragraphs, maxW - 52, 30, 14);
  const blockH = size + 36 + paraH + 52;
  const top = narrow ? m + r * 2 + 40 : Math.max(m, (H - blockH) / 2);
  if (images.photo) circleImage(ctx, images.photo, narrow ? m + r : m + r, narrow ? m + r : top + size / 2 + 40, r);
  mural(ctx, INTRO.hello, tx, top + size * 0.9, size);
  const py = top + size + 22;
  plaster(ctx, tx, py, maxW, paraH + 52);
  ctx.fillStyle = INK;
  ctx.font = `400 19px ${SANS}`;
  ctx.textBaseline = 'alphabetic';
  let y = py + 26 + 19;
  for (const p of INTRO.paragraphs) {
    y = paragraph(ctx, p, tx + 26, y, maxW - 52, 30) + 14;
  }
  smallOnBrick(ctx, 'Hold anywhere to light the fuse.', W - m, H - m * 0.7, 15, 0.85, 'right');
  return { texture: c, links: [] };
}

// ---------- panel 2: what I do ----------
export function paintWork({ W, H, bw, bh }) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  paintBricks(ctx, W, H, bw, bh, 212, 26, 38, 23);
  const m = Math.max(36, W * 0.06);
  const size = Math.max(36, Math.min(60, W * 0.042));
  mural(ctx, 'What I do at Alfred_', m, m + size, size, { italic: false });
  const links = [{ x: m, y: m, w: Math.min(W - 2 * m, size * 10.5), h: size * 1.2, href: ALFRED.url, label: 'Alfred_' }];

  // figures painted on the brick
  const figs = ALFRED.figures;
  const fy = m + size + 70;
  const colW = (W - 2 * m) / figs.length;
  figs.forEach((f, i) => {
    const x = m + i * colW;
    const big = f.to ? f.to : f.big;
    mural(ctx, big, x, fy + 48, Math.min(52, colW * 0.34), { italic: false });
    if (f.to) smallOnBrick(ctx, `was ${f.big}`, x, fy + 72, 14, 0.75);
    ctx.save();
    ctx.font = `400 14.5px ${SANS}`;
    ctx.fillStyle = 'rgba(247,239,225,0.9)';
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.shadowBlur = 6;
    paragraph(ctx, f.what, x, fy + (f.to ? 96 : 76), colW - 22, 20);
    ctx.restore();
  });

  // lead paragraph and the earlier roles, on plaster
  const px = m;
  const pw = Math.min(760, W - 2 * m);
  const py = fy + 150;
  ctx.font = `400 18px ${SANS}`;
  const leadH = wrap(ctx, ALFRED.lead, pw - 52).length * 29;
  ctx.font = `400 16px ${SANS}`;
  const roleH = BEFORE.reduce((h, r) => h + 26 + wrap(ctx, r.line, pw - 52 - 150).length * 24 + 12, 0);
  const ph = 26 + leadH + 30 + 30 + roleH + 10;
  const availH = H - py - m * 0.6;
  const scale = availH < ph ? availH / ph : 1;
  plaster(ctx, px, py, pw, Math.min(ph, availH));
  ctx.save();
  if (scale < 1) {
    ctx.translate(px, py);
    ctx.scale(1, scale);
    ctx.translate(-px, -py);
  }
  ctx.fillStyle = INK;
  ctx.font = `400 18px ${SANS}`;
  let y = paragraph(ctx, ALFRED.lead, px + 26, py + 26 + 18, pw - 52, 29);
  y += 26;
  ctx.font = `500 22px ${SERIF}`;
  ctx.fillText('Before Alfred_', px + 26, y);
  y += 24;
  for (const r of BEFORE) {
    ctx.font = `500 18px ${SERIF}`;
    ctx.fillText(r.company, px + 26, y + 14);
    ctx.font = `400 16px ${SANS}`;
    ctx.fillStyle = 'rgba(36,38,43,0.8)';
    const after = paragraph(ctx, r.line, px + 26 + 150, y + 14, pw - 52 - 150, 24);
    ctx.fillStyle = 'rgba(36,38,43,0.55)';
    ctx.font = `400 13.5px ${SANS}`;
    ctx.fillText(`${r.title}. ${r.when}`, px + 26 + 150, after + 2);
    ctx.fillStyle = INK;
    y = after + 22;
  }
  ctx.restore();
  return { texture: c, links };
}

// ---------- panel 3: things I made ----------
export function paintMade({ W, H, bw, bh, images }) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  paintBricks(ctx, W, H, bw, bh, 172, 28, 33, 37);
  const m = Math.max(36, W * 0.06);
  const size = Math.max(36, Math.min(60, W * 0.042));
  mural(ctx, 'Things I made', m, m + size, size);
  const links = [];
  const cols = W < 720 ? 1 : W < 1100 ? 2 : 3;
  const rows = Math.ceil(FEATURED.length / cols);
  const gap = 28;
  const top = m + size + 34;
  const availH = H - top - m * 0.6;
  const cellW = (W - 2 * m - gap * (cols - 1)) / cols;
  let imgW = cellW - 16;
  let imgH = imgW * 0.6;
  let labelH = 76;
  let cellH = imgH + labelH + 12;
  if (rows * cellH + (rows - 1) * gap > availH) {
    const k = (availH - (rows - 1) * gap) / (rows * cellH);
    imgW *= k;
    imgH *= k;
    cellH = imgH + labelH + 12;
  }
  const r = rnd(5);
  FEATURED.forEach((p, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = m + col * (cellW + gap) + (cellW - imgW) / 2;
    const y = top + row * (cellH + gap);
    const tilt = (r() - 0.5) * 0.05;
    const img = images[p.id];
    ctx.save();
    ctx.translate(x + imgW / 2, y + imgH / 2);
    ctx.rotate(tilt);
    ctx.shadowColor = 'rgba(0,0,0,0.42)';
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 6;
    ctx.fillStyle = '#fbf7ef';
    ctx.fillRect(-imgW / 2 - 7, -imgH / 2 - 7, imgW + 14, imgH + 14);
    ctx.shadowColor = 'transparent';
    if (img) {
      if (p.square) {
        ctx.fillStyle = '#efe9dc';
        ctx.fillRect(-imgW / 2, -imgH / 2, imgW, imgH);
        const s = imgH;
        ctx.drawImage(img, -s / 2, -imgH / 2, s, s);
      } else {
        const ar = img.width / img.height;
        let sw = img.width;
        let sh = img.width / (imgW / imgH);
        if (sh > img.height) {
          sh = img.height;
          sw = img.height * (imgW / imgH);
        }
        ctx.drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, -imgW / 2, -imgH / 2, imgW, imgH);
      }
    } else {
      ctx.fillStyle = '#d9d2c4';
      ctx.fillRect(-imgW / 2, -imgH / 2, imgW, imgH);
    }
    ctx.restore();
    // label strip on plaster
    const ly = y + imgH + 16;
    plaster(ctx, x, ly, imgW, labelH - 8);
    ctx.fillStyle = INK;
    ctx.font = `italic 500 21px ${SERIF}`;
    ctx.fillText(p.name, x + 14, ly + 27);
    ctx.font = `400 14px ${SANS}`;
    ctx.fillStyle = 'rgba(36,38,43,0.78)';
    const lines = wrap(ctx, p.line, imgW - 28).slice(0, 2);
    lines.forEach((l, k) => ctx.fillText(l, x + 14, ly + 47 + k * 18));
    links.push({ x, y: y - 8, w: imgW, h: imgH + labelH + 8, href: p.link, label: `${p.name}, ${p.action}` });
  });
  return { texture: c, links };
}

// ---------- panel 4: papers and where to find me ----------
export function paintPapers({ W, H, bw, bh }) {
  const c = makeCanvas(W, H);
  const ctx = c.getContext('2d');
  paintBricks(ctx, W, H, bw, bh, 302, 18, 34, 41);
  const m = Math.max(36, W * 0.06);
  const size = Math.max(36, Math.min(60, W * 0.042));
  mural(ctx, 'Three papers', m, m + size, size);
  const links = [];
  const cols = W < 900 ? 1 : 3;
  const gap = 24;
  const cw = (W - 2 * m - gap * (cols - 1)) / cols;
  const top = m + size + 34;
  const ch = cols === 1 ? 150 : Math.min(250, H * 0.34);
  PAPERS.forEach((p, i) => {
    const x = m + (i % cols) * (cw + gap);
    const y = top + Math.floor(i / cols) * (ch + gap);
    plaster(ctx, x, y, cw, ch);
    // the stamp
    ctx.save();
    ctx.translate(x + cw - 20, y + 26);
    ctx.rotate(-0.12);
    ctx.font = `700 13px ${SANS}`;
    const sw = ctx.measureText(p.status).width + 18;
    ctx.strokeStyle = p.accepted ? '#8a4a12' : 'rgba(36,38,43,0.5)';
    ctx.lineWidth = 2;
    ctx.strokeRect(-sw, -12, sw, 24);
    ctx.fillStyle = p.accepted ? '#8a4a12' : 'rgba(36,38,43,0.6)';
    ctx.textAlign = 'center';
    ctx.fillText(p.status, -sw / 2, 5);
    ctx.restore();
    ctx.fillStyle = INK;
    ctx.font = `500 20px ${SERIF}`;
    let y2 = paragraph(ctx, p.short, x + 20, y + 62, cw - 40, 25);
    ctx.font = `400 15px ${SANS}`;
    ctx.fillStyle = 'rgba(36,38,43,0.8)';
    y2 = paragraph(ctx, p.line, x + 20, y2 + 8, cw - 40, 22);
    ctx.font = `400 13.5px ${SANS}`;
    ctx.fillStyle = 'rgba(36,38,43,0.55)';
    ctx.fillText(`${p.venue}${p.citations ? `. ${p.citations} citations` : ''}`, x + 20, y2 + 8);
    if (p.pdf) links.push({ x, y, w: cw, h: ch, href: p.pdf, label: `${p.short}, paper` });
  });

  // where to find me, painted straight on the brick
  const fy = top + (cols === 1 ? 3 * (ch + gap) : ch + gap) + 60;
  mural(ctx, 'Find me', m, fy, Math.min(44, size * 0.8));
  ctx.font = `400 19px ${SANS}`;
  let x = m;
  const ly = fy + 44;
  for (const l of LINKS) {
    const w = ctx.measureText(l.label).width;
    smallOnBrick(ctx, l.label, x, ly, 19, 0.95);
    ctx.save();
    ctx.strokeStyle = 'rgba(247,239,225,0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x, ly + 5.5);
    ctx.lineTo(x + w, ly + 5.5);
    ctx.stroke();
    ctx.restore();
    links.push({ x: x - 6, y: ly - 22, w: w + 12, h: 34, href: l.href, label: l.label });
    x += w + 34;
    if (x > W - m - 120) {
      x = m;
    }
  }
  return { texture: c, links };
}

export const PAINTERS = [paintIntro, paintWork, paintMade, paintPapers];
