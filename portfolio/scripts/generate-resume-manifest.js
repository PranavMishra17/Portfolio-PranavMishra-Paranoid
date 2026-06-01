// portfolio/scripts/generate-resume-manifest.js
// Scans public/resumes/{ai,game} for any *.pdf file and writes
// public/resumes/manifest.json so ResumeViewer can find the file
// regardless of its name. Most-recently-modified PDF wins per folder.
//
// Wired to `prestart` and `prebuild` in package.json — drop a PDF
// into a resume folder and `npm start` / `npm run build` pick it up.

const fs = require('fs');
const path = require('path');

const RESUMES_DIR = path.resolve(__dirname, '..', 'public', 'resumes');
const FOLDERS = ['ai', 'game'];

const pickPdf = (folderName) => {
  const dir = path.join(RESUMES_DIR, folderName);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return null;

  const pdfs = fs
    .readdirSync(dir)
    .filter((f) => f.toLowerCase().endsWith('.pdf'))
    .map((f) => ({ name: f, mtime: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);

  return pdfs.length ? pdfs[0].name : null;
};

const manifest = {};
for (const folder of FOLDERS) {
  manifest[folder] = pickPdf(folder);
}

if (!fs.existsSync(RESUMES_DIR)) {
  fs.mkdirSync(RESUMES_DIR, { recursive: true });
}

const outPath = path.join(RESUMES_DIR, 'manifest.json');
fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n');

const summary = FOLDERS.map((f) => `${f}=${manifest[f] || '(none)'}`).join(', ');
console.log(`[resume-manifest] ${summary}`);
