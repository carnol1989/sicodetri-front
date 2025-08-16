// src/__tests__/integration/FileUpload.integration.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import FinancialFixedAssetService from '../../services/FinancialFixedAssetService';
import fs from 'fs';
import path from 'path';

// ---------- Mocks UI auxiliares ----------
jest.mock('../../components/CustomDatePicker', () => ({ selected, onChange }) => (
  <input
    data-testid="period-input"
    type="date"
    value={selected ? selected.toISOString().split('T')[0] : ''}
    onChange={(e) => onChange(new Date(e.target.value))}
  />
));

// ---------- Mock de servicios ----------
jest.mock('../../services/FinancialFixedAssetService', () => ({
  uploadService: jest.fn(),
  saveService: jest.fn(),
}));

// ---------- Polyfill por si la app decodifica tokens ----------
if (typeof global.atob !== 'function') {
  global.atob = (input) => Buffer.from(input, 'base64').toString('binary');
}

// Helper JWT "none" (fuera de cualquier factory)
function makeJwt(payloadObj) {
  const header = { alg: 'none', typ: 'JWT' };
  const b64 = (obj) =>
    Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  return `${b64(header)}.${b64(payloadObj)}.`; // firma vacía
}

// ---------- Mock del hook useAuth (declaración base) ----------
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

describe('Integración con PrivateRoute + CallbackPage (implícito) + ErrorBoundary', () => {
  let testFile;
  const periodValue = '2025-07-01';
  const { useAuth } = require('../../hooks/useAuth');

  beforeAll(() => {
    const filePath = path.resolve(__dirname, 'data', 'assets.xlsx');
    const fileBuffer = fs.readFileSync(filePath);
    testFile = new File([fileBuffer], 'assets.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();

    const now = Math.floor(Date.now() / 1000);
    useAuth.mockReturnValue({
      token: 'access-token-fake',
      idToken: makeJwt({
        sub: 'user-123',
        email: 'user@example.com',
        iat: now,
        exp: now + 3600,
        iss: 'https://auth.example.com',
        aud: 'sicodetri-front',
      }),
      idTokenData: { sub: 'user-123', email: 'user@example.com' },
      isAuthenticated: true,
      isPending: false,
      login: jest.fn(),
      logout: jest.fn(),
      error: null,
    });
  });

  afterEach(() => {
    cleanup();
    // ¡No llames jest.resetModules() aquí!
  });

  test('flujo feliz autenticado: /upload → subir y guardar con alertas', async () => {
    window.history.pushState({}, 'Upload', '/upload');

    FinancialFixedAssetService.uploadService.mockImplementation((file, period, onProgress) => {
      onProgress?.({ loaded: 100, total: 100 });
      return Promise.resolve({
        data: {
          code: '00',
          message: `Archivo subido correctamente: ${file.name}`,
          response: 1,
        },
      });
    });
    FinancialFixedAssetService.saveService.mockImplementation((period, onProgress) => {
      onProgress?.({ loaded: 100, total: 100 });
      return Promise.resolve({
        data: {
          code: '00',
          message: `Información guardada correctamente para el periodo: ${period}`,
          response: 1,
        },
      });
    });

    const { container } = render(<App />);

    expect(sessionStorage.getItem('pkce_token')).toBe('access-token-fake');

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /cargar excel de activo fijos/i }),
      ).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByTestId('period-input'), { target: { value: periodValue } });

    const fileInput = container.querySelector('input[type="file"]');
    userEvent.upload(fileInput, testFile);

    const uploadButton = screen.getByRole('button', { name: /subir archivo/i });
    await waitFor(() => expect(uploadButton).toBeEnabled());
    userEvent.click(uploadButton);

    const uploadAlert = await screen.findByRole('alert');
    expect(uploadAlert).toHaveClass('alert', 'alert-success');
    expect(uploadAlert).toHaveTextContent(`Archivo subido correctamente: ${testFile.name}`);

    const saveButton = screen.getByRole('button', { name: /guardar información/i });
    await waitFor(() => expect(saveButton).toBeEnabled());
    userEvent.click(saveButton);

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        `Información guardada correctamente para el periodo: ${periodValue}`,
      ),
    );
    expect(screen.getByRole('alert')).toHaveClass('alert', 'alert-success');

    expect(FinancialFixedAssetService.uploadService).toHaveBeenCalledWith(
      testFile,
      periodValue,
      expect.any(Function),
    );
    expect(FinancialFixedAssetService.saveService).toHaveBeenCalledWith(
      periodValue,
      expect.any(Function),
    );
  });

  test('cuando FileUpload falla al renderizar, ErrorBoundary muestra su fallback real', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    jest.isolateModules(() => {
      window.history.pushState({}, 'Upload', '/upload');

      const now = Math.floor(Date.now() / 1000);
      jest.doMock('../../hooks/useAuth', () => ({
        useAuth: jest.fn(() => ({
          token: 'access-token-fake',
          idToken: 'fake-idtoken',
          idTokenData: { sub: 'user-123', email: 'user@example.com' },
          isAuthenticated: true,
          isPending: false,
          login: jest.fn(),
          logout: jest.fn(),
          error: null,
        })),
      }));

      jest.doMock('../../views/FileUpload', () => {
        const Boom = () => {
          throw new Error('Render crash en FileUpload');
        };
        return { __esModule: true, default: Boom };
      });

      const FreshApp = require('../../App').default;
      render(<FreshApp />);

      // A) Fallback UI visible
      expect(screen.getByText(/la aplicación encontró un problema/i)).toBeInTheDocument();

      // B) <pre> con algún mensaje
      const pre = screen.getByText((_, node) => {
        return node?.tagName?.toLowerCase() === 'pre' && !!node.textContent?.trim();
      });
      expect(pre).toBeInTheDocument();

      // C) Botón de recarga
      expect(screen.getByRole('button', { name: /recargar/i })).toBeInTheDocument();
    });

    // D) Validar que console.error fue llamado al menos una vez con un Error
    expect(consoleErrorSpy).toHaveBeenCalled();
    const hadErrorObj = consoleErrorSpy.mock.calls.some(([err]) => err instanceof Error);
    expect(hadErrorObj).toBe(true);

    consoleErrorSpy.mockRestore();
    jest.dontMock('../../views/FileUpload');
    jest.dontMock('../../hooks/useAuth');
  });
});
