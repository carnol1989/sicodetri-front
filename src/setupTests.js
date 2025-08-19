/**
 * Global Jest setup for SICODETRI-FRONT test environment. <br/>
 * Extends Jest with custom DOM matchers from `@testing-library/jest-dom` and
 * stubs the `axios` module to avoid importing ESM bundles during tests. <br/>
 * Path: src/setupTests.js
 *
 * @module setupTests
 * @requires module:@testing-library/jest-dom
 * @requires module: axios
 *
 * <b>Component</b>: {@link setupTests} <br/>
 * <b>Copyright</b>: &copy; 2024 EPS Grau. <br/>
 * <b>Company</b>: EPS Grau. <br/>
 *
 * @author EPS Grau
 * <br/>
 * <u>Service Provider</u>: Consultor TI <br/>
 * <u>Developed by</u>: <br/>
 * <ul>
 *   <li>Carlos Augusto Nole Machaca</li>
 * </ul>
 * <u>Changes</u>: <br/>
 * <ul>
 *   <li>Jun 06, 2025 (JS) Test setup creation.</li>
 * </ul>
 *
 * @version 1.0
 */
import '@testing-library/jest-dom';

/**
 * Lightweight axios factory mock returned by `axios.create()`. <br/>
 * Provides common HTTP methods and interceptor hooks used by the app's services.
 *
 * @typedef {Object} AxiosInstanceMock
 * @property {jest.Mock} get - Mocked GET method.
 * @property {jest.Mock} post - Mocked POST method.
 * @property {jest.Mock} put - Mocked PUT method.
 * @property {jest.Mock} delete - Mocked DELETE method.
 * @property {{request:{use:jest.Mock},response:{use:jest.Mock}}} interceptors - Mocked interceptors registry.
 */

/**
 * Global mock for the `axios` module. <br/>
 * Ensures Jest never attempts to parse the real ESM build of axios (avoids loading `index.js` of ESM),
 * and keeps service tests isolated/deterministic by providing a stubbed client factory.
 *
 * @example
 * // In a service file:
 * // import http from '../http-common';
 * // await http.get('/path'); // resolves to the mocked get()
 */
jest.mock('axios', () => ({
  /**
   * Mimics `axios.create()` returning a minimal client with spies for HTTP methods and interceptors.
   * @returns {AxiosInstanceMock} */
  create: () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    // si tu código usa interceptors, también los simulas aquí
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  }),
}));
