/** @type {import('ts-jest').JestConfigWithTsJest} */
const publicPath = process.env.JEST_HTML_REPORTERS_PUBLIC_PATH || 'coverage';
const htmlFilename = process.env.JEST_HTML_REPORTERS_FILENAME || 'report.html';
const coverageDir = process.env.COVERAGE_DIRECTORY || 'coverage';

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