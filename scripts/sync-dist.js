const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', 'dist');
const destDir = path.resolve(__dirname, '..', 'demo', 'dist');

if (!fs.existsSync(srcDir)) {
  console.error('dist directory not found; run build first');
  process.exit(1);
}

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

for (const entry of fs.readdirSync(srcDir)) {
  copyRecursive(path.join(srcDir, entry), path.join(destDir, entry));
  console.log('copied', entry);
}

console.log('sync complete');