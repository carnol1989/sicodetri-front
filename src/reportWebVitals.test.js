import reportWebVitals from './reportWebVitals';
import * as webVitals from 'web-vitals';

// Mockeamos todo el módulo 'web-vitals'
jest.mock('web-vitals', () => ({
  getCLS: jest.fn(),
  getFID: jest.fn(),
  getFCP: jest.fn(),
  getLCP: jest.fn(),
  getTTFB: jest.fn(),
}));

describe('reportWebVitals', () => {
  beforeEach(() => {
    // Limpiamos los mocks antes de cada test
    jest.clearAllMocks();
  });

  it('no hace nada si no se pasa ningún argumento', () => {
    expect(() => reportWebVitals()).not.toThrow();
    expect(webVitals.getCLS).not.toHaveBeenCalled();
    expect(webVitals.getFID).not.toHaveBeenCalled();
    expect(webVitals.getFCP).not.toHaveBeenCalled();
    expect(webVitals.getLCP).not.toHaveBeenCalled();
    expect(webVitals.getTTFB).not.toHaveBeenCalled();
  });

  it('no hace nada si el argumento no es función', () => {
    expect(() => reportWebVitals(123)).not.toThrow();
    expect(webVitals.getCLS).not.toHaveBeenCalled();
    expect(webVitals.getFID).not.toHaveBeenCalled();
    expect(webVitals.getFCP).not.toHaveBeenCalled();
    expect(webVitals.getLCP).not.toHaveBeenCalled();
    expect(webVitals.getTTFB).not.toHaveBeenCalled();
  });

  it('importa dinámicamente web-vitals y llama a todas las métricas', async () => {
    const mockEntry = jest.fn();

    // Llamamos al helper
    reportWebVitals(mockEntry);

    // Esperamos a que se resuelvan las microtareas del import dinámico
    await Promise.resolve();

    // Verificamos que cada métrica reciba nuestro callback
    expect(webVitals.getCLS).toHaveBeenCalledWith(mockEntry);
    expect(webVitals.getFID).toHaveBeenCalledWith(mockEntry);
    expect(webVitals.getFCP).toHaveBeenCalledWith(mockEntry);
    expect(webVitals.getLCP).toHaveBeenCalledWith(mockEntry);
    expect(webVitals.getTTFB).toHaveBeenCalledWith(mockEntry);
  });
});
