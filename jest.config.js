/**
 * Jest configuration for SICODETRI-FRONT. <br/>
 * Provides a unified testing setup for JS/TS + React (JSDOM), HTML reporting,
 * CSS module mocking, transforms for TS via ts-jest and JS/JSX via babel-jest,
 * and coverage thresholds. <br/>
 *
 * Environment variables: <br/>
 * - <b>JEST_HTML_REPORTERS_PUBLIC_PATH</b>: Output directory for HTML test report (default: `coverage`). <br/>
 * - <b>JEST_HTML_REPORTERS_FILENAME</b>: HTML report filename (default: `report.html`). <br/>
 * - <b>COVERAGE_DIRECTORY</b>: Coverage output directory (default: `coverage`). <br/>
 *
 * <b>Config</b>: {@link JestConfig} <br/>
 * <b>Company</b>: EPS Grau. <br/>
 * <b>C​opyright</b>: &copy; 2024 EPS Grau. <br/>
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
 * @module jest.config
 * @requires module: ts-jest
 * @requires module: babel-jest
 * @requires module: jsdom
 * @requires module: identity-obj-proxy
 * @requires module: jest-html-reporters
 */

/**
 * @typedef {Object} JestHtmlReportersOptions
 * @property {string} publicPath - Directory where the HTML report is saved.
 * @property {string} filename - Report file name (e.g., `report.html`).
 * @property {boolean} expand - Expand all test suites by default.
 * @property {string} pageTitle - Page title for the HTML report.
 * @property {boolean} hideIcon - Hide plugin favicon/icon in the report.
 */

/**
 * @typedef {Object} JestConfig
 * @property {string} preset - Base preset (e.g., `ts-jest`).
 * @property {string} testEnvironment - Test environment (e.g., `jsdom`).
 * @property {string[]} moduleFileExtensions - Extensions resolved in tests.
 * @property {Record<string,string>} transform - File transformers (regex → transformer).
 * @property {string[]} transformIgnorePatterns - Modules to ignore when transforming.
 * @property {Record<string,string>} moduleNameMapper - Mappers for non-JS imports (e.g., CSS).
 * @property {string[]} testMatch - Glob patterns for test discovery.
 * @property {string[]} setupFilesAfterEnv - Files executed after the test env is set up.
 * @property {boolean} collectCoverage - Whether to collect coverage.
 * @property {string} coverageDirectory - Folder for coverage output.
 * @property {Array<'html'|'lcov'|'text-summary'|string>} coverageReporters - Coverage reporters.
 * @property {{global:{branches:number,functions:number,lines:number,statements:number}}} coverageThreshold - Global coverage thresholds.
 * @property {(string|[string,JestHtmlReportersOptions])[]} reporters - Jest reporters (default + HTML).
 *
 * @example
 * // package.json
 * // {
 * //   "scripts": {
 * //     "test": "jest",
 * //     "test:watch": "jest --watch",
 * //     "test:ci": "jest --coverage"
 * //   }
 * // }
 */

/** @type {import('ts-jest').JestConfigWithTsJest} */
const publicPath = process.env.JEST_HTML_REPORTERS_PUBLIC_PATH || 'coverage';

/** @type {string} */
const htmlFilename = process.env.JEST_HTML_REPORTERS_FILENAME || 'report.html';

/** @type {string} */
const coverageDir = process.env.COVERAGE_DIRECTORY || 'coverage';

/** @type {JestConfig} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',

    // Extensiones de archivos que testear
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],

    // Transformadores: TS por ts-jest, JS/JSX por babel-jest
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^.+\\.(js|jsx)$': 'babel-jest',
    },

    // esta regla le dice a Jest que **no ignore** axios,
    // transformándolo con Babel como el resto de tu código
    transformIgnorePatterns: [
        "node_modules/(?!(axios)/)"
    ],

    // --- MOCKEAR CSS y demás estilos ---
    moduleNameMapper: {
        '\\.(css|less|sass|scss)$': 'identity-obj-proxy'
    },

    // Carpetas donde buscar __tests__
    testMatch: [
        '<rootDir>/src/**/__tests__/unit/**/*.test.(js|jsx|ts|tsx)',
        '<rootDir>/src/**/__tests__/integration/**/*.integration.test.(js|jsx|ts|tsx)'
    ],

    // Archivos de configuración que se cargan antes de cada test
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

    // Cobertura
    collectCoverage: true,
    coverageDirectory: coverageDir,
    coverageReporters: ['html','lcov','text-summary'],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },

    reporters: [
        'default',
        ['jest-html-reporters', {
            publicPath,
            filename: htmlFilename,
            expand: true,
            pageTitle: htmlFilename.replace('.html',''),
            hideIcon: true
        }]
    ]

    // Si decides usar alias
    // moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
};