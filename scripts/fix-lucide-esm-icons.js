const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '..', 'node_modules', 'lucide-react-native', 'dist');
const cjsIconsDir = path.join(baseDir, 'cjs', 'icons');
const esmIconsDir = path.join(baseDir, 'esm', 'icons');

function ensureDirExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function syncIcons() {
  if (!fs.existsSync(cjsIconsDir)) {
    console.warn('lucide-react-native not installed; skipping icon sync.');
    return;
  }

  ensureDirExists(esmIconsDir);

  const files = fs.readdirSync(cjsIconsDir);
  const copied = [];

  for (const file of files) {
    if (!file.endsWith('.js')) continue;
    const source = path.join(cjsIconsDir, file);
    const target = path.join(esmIconsDir, file);
    if (!fs.existsSync(target)) {
      fs.copyFileSync(source, target);
      copied.push(file);
    }
  }

  if (copied.length === 0) {
    console.log('Lucide ESM icons already complete. No files copied.');
  } else {
    console.log(`Copied ${copied.length} missing Lucide ESM icon(s):`);
    copied.forEach((file) => console.log(`- ${file}`));
  }
}

syncIcons();
