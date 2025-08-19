// scripts/fix-jsdoc.js
/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');
const FILES = [];

// Recolecta .js/.jsx/.ts/.tsx en src
function collect(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      collect(p);
    } else if (/\.(js|jsx|ts|tsx)$/.test(f)) {
      FILES.push(p);
    }
  }
}
collect(SRC);

// ► Incluye archivos fuera de src que JSdoc también analiza
const EXTRA_FILES = [
  path.join(ROOT, 'webpack.config.js'),
];

for (const f of EXTRA_FILES) {
  if (fs.existsSync(f)) FILES.push(f);
}

// Reemplazos dentro de bloques JSDoc:
/**
 * 1) Promise<T>  -> Promise.<T>
 * 2) import("...").Tipo -> Tipo
 */
const rxPromise = /Promise<([^>]+)>/g;
const rxImportType = /import\(\s*["'][^"']+["']\s*\)\.([A-Za-z0-9_$]+)/g;

let patched = 0;

for (const file of FILES) {
  let code = fs.readFileSync(file, 'utf8');
  const before = code;

  code = code.replace(/\/\*\*[\s\S]*?\*\//g, (block) => {
    let b = block;
    b = b.replace(rxPromise, 'Promise.<$1>');
    b = b.replace(rxImportType, '$1');
    return b;
  });

  if (code !== before) {
    fs.writeFileSync(file, code, 'utf8');
    console.log('Patched:', path.relative(ROOT, file));
    patched++;
  }
}

console.log(`Done. Patched files: ${patched}`);
