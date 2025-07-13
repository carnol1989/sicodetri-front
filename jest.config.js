/** @type {import('ts-jest').JestConfigWithTsJest} */
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

    // Carpetas donde buscar __tests__
    testMatch: [
        '<rootDir>/src/**/*.test.(js|jsx|ts|tsx)',
        '<rootDir>/src/**/__tests__/*.(js|jsx|ts|tsx)',
        '<rootDir>/src/**/__tests__/**/*.(js|jsx|ts|tsx)'
    ],

    // Archivos de configuración que se cargan antes de cada test
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

    // Cobertura
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },

    // Si decides usar alias
    // moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
};