// scripts/jsdoc-smoke.js
// Genera un archivo temporal con un tipo import("axios") y ejecuta JSDoc
// para confirmar que el parser jsdoc-type-pratt-parser está activo.

const fs = require("fs");
const { execSync } = require("child_process");
const path = require("path");

const tmpFile = path.join(process.cwd(), "jsdoc-smoke-test.js");
const code = `
/**
 * @file Smoke test for jsdoc-type-pratt-parser
 */

/**
 * @type {import("axios").AxiosInstance}
 */
const client = /** @type {any} */ ({});

/**
 * @returns {Promise<import("axios").AxiosResponse>}
 */
async function ping() {
  return /** @type {any} */ ({ status: 200 });
}

export {};
`;

fs.writeFileSync(tmpFile, code, "utf8");

try {
  // Ejecuta el jsdoc local del proyecto, no uno global
  execSync(`npx jsdoc ${tmpFile} -c jsdoc.json -d ./docs-smoke`, {
    stdio: "inherit"
  });
  console.log("✅ Smoke test OK: el parser está activo.");
} catch (e) {
  console.error("❌ Smoke test FALLÓ. El parser no está cargando.");
  process.exit(1);
} finally {
  try { fs.unlinkSync(tmpFile); } catch {}
}
