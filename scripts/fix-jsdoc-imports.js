// scripts/fix-jsdoc-imports.js
// Arregla problemas comunes en anotaciones JSDoc:
// 1) import('pkg') -> import("pkg") dentro de { ... }
// 2) @r\neturns -> @returns
// 3) Une @returns {Tipo}\n Descripción -> @returns {Tipo} Descripción

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const TARGETS = [path.join(ROOT, "src"), path.join(ROOT, "webpack.config.js")];

function isDocFile(file) {
  return /\.(js|jsx|ts|tsx)$/.test(file) || /webpack\.config\.js$/.test(file);
}

function walk(entry, acc = []) {
  if (!fs.existsSync(entry)) return acc;
  const stat = fs.statSync(entry);
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(entry)) {
      walk(path.join(entry, name), acc);
    }
  } else if (stat.isFile() && isDocFile(entry)) {
    acc.push(entry);
  }
  return acc;
}

function fixContent(content) {
  let out = content;

  // 1) Dentro de { ... } cambia import('mod') -> import("mod")
  out = out.replace(
    /(\{\s*[^}]*?)import\('([^']+)'\)([^}]*\})/g,
    (m, a, mod, b) => `${a}import("${mod}")${b}`
  );

  // 2) @r\neturns -> @returns
  out = out.replace(/@r\s*\n\s*eturns/g, "@returns");

  // 3) Evita saltos entre tipo y descripción en @returns
  out = out.replace(/@returns\s+\{([^}]+)\}\s*\n\s*/g, "@returns {$1} ");

  return out;
}

function main() {
  const files = TARGETS.flatMap(t => walk(t));
  for (const f of files) {
    const orig = fs.readFileSync(f, "utf8");
    const fixed = fixContent(orig);
    if (fixed !== orig) {
      fs.writeFileSync(f, fixed, "utf8");
      console.log("Fixed:", path.relative(ROOT, f));
    }
  }
  console.log("Done.");
}

main();
