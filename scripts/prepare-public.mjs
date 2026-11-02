import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const publicDir = path.join(rootDir, 'docs', 'public');

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function copyFileSafe(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`[prepare-public] Warning: source file not found: ${src}`);
    return;
  }
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function copyDirRecursive(srcDir, destDir, filterFn = () => true) {
  if (!fs.existsSync(srcDir)) {
    return;
  }
  ensureDir(destDir);
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const srcPath = path.join(srcDir, entry.name);
    const destPath = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, filterFn);
    } else if (entry.isFile() && filterFn(entry.name)) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 1. Copy root Masu (00) app files -> docs/public/demo/
const demoDir = path.join(publicDir, 'demo');
ensureDir(demoDir);
for (const file of ['index.html', 'styles.css', 'app.js']) {
  copyFileSafe(path.join(rootDir, file), path.join(demoDir, file));
}

// 2. Copy concepts (01 shiori, 02 pulse, 03 tokonoma) -> docs/public/demo/concepts/
const conceptsSrc = path.join(rootDir, 'concepts');
const conceptsDest = path.join(demoDir, 'concepts');
copyDirRecursive(conceptsSrc, conceptsDest);

// 3. Copy screenshots/*.png -> docs/public/screenshots/*.png
const screenshotsSrc = path.join(rootDir, 'screenshots');
const screenshotsDest = path.join(publicDir, 'screenshots');
copyDirRecursive(screenshotsSrc, screenshotsDest, (name) => name.endsWith('.png'));

// 4. Copy assets/*.svg -> docs/public/assets/*.svg (if assets/ exists)
const assetsSrc = path.join(rootDir, 'assets');
const assetsDest = path.join(publicDir, 'assets');
if (fs.existsSync(assetsSrc)) {
  copyDirRecursive(assetsSrc, assetsDest, (name) => name.endsWith('.svg'));
}

console.log('[prepare-public] Synced live demo apps, screenshots, and SVG assets into docs/public/.');
