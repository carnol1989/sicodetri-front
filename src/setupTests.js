// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock global de axios para que Jest nunca intente parsear node_modules/axios
jest.mock('axios', () => ({
  // axios.create() devolverá un objeto con las llamadas que necesiten tus servicios,
  // pero al menos no provoca que Jest abra el index.js de ESM.
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
