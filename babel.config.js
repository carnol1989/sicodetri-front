/**
 * Babel configuration for SICODETRI-FRONT. <br/>
 * Transpiles modern JavaScript and JSX for browser compatibility and enables React automatic runtime. <br/>
 *
 * Presets: <br/>
 * - {@link module:@babel/preset-env} — Targets appropriate JS features based on browserslist. <br/>
 * - {@link module:@babel/preset-react} — Transforms JSX; uses `runtime: "automatic"` to avoid explicit React imports in JSX files. <br/>
 *
 * Plugins: <br/>
 * - {@link module:@babel/plugin-transform-runtime} — Deduplicates helpers and enables regenerator/runtime where needed. <br/>
 * - {@link module:@babel/plugin-proposal-optional-chaining} — Supports `?.` operator. <br/>
 * - {@link module:@babel/plugin-proposal-nullish-coalescing-operator} — Supports `??` operator. <br/>
 *
 * <b>Config</b>: {@link BabelConfig} <br/>
 * <b>Company</b>: EPS Grau. <br/>
 * <b>Copyright</b>: &copy; 2024 EPS Grau. <br/>
 *
 * @author EPS Grau
 * <br/>
 * <u>Service Provider</u>: Consultor TI <br/>
 * <u>Developed by</u>:
 * <ul>
 *   <li>Carlos Augusto Nole Machaca</li>
 * </ul>
 * <u>Changes</u>:
 * <ul>
 *   <li>Jun 06, 2025 (JS) Config creation.</li>
 * </ul>
 *
 * @version 1.0
 *
 * @module babel.config
 * @requires module:@babel/preset-env
 * @requires module:@babel/preset-react
 * @requires module:@babel/plugin-transform-runtime
 * @requires module:@babel/plugin-proposal-optional-chaining
 * @requires module:@babel/plugin-proposal-nullish-coalescing-operator
 */

/**
 * @typedef {Object} BabelConfig
 * @property {Array<(string|Array)>} presets
 *   List of presets. Accepts preset names or `[name, options]` tuples. <br/>
 *   Example item: `['@babel/preset-react', { runtime: 'automatic' }]`.
 * @property {Array<(string|Array)>} plugins
 *   List of plugins. Accepts plugin names or `[name, options]` tuples.
 *
 * @example
 * // CLI usage
 * // npx babel src --out-dir dist --extensions ".js,.jsx"
 *
 * @example
 * // Via package.json
 * // {
 * //   "scripts": {
 * //     "build": "babel src --out-dir dist --extensions .js,.jsx"
 * //   }
 * // }
 */

/** @type {BabelConfig} */
module.exports = {
    presets: [
        '@babel/preset-env',
        ['@babel/preset-react', { runtime: 'automatic' }]
    ],
    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-proposal-optional-chaining',
        '@babel/plugin-proposal-nullish-coalescing-operator'
    ]
};