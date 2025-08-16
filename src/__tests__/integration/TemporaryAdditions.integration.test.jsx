// src/__tests__/integration/TemporaryAdditions.integration.test.jsx
import React from 'react';
import { render, screen, waitFor, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import path from 'path';
import fs from 'fs';

// 1) Stub de CustomDatePicker en todos los stages
jest.mock('../../components/CustomDatePicker', () => ({ selected, onChange }) => (
  <input
    aria-label="select-period"
    type="month"
    value={selected ? selected.toISOString().slice(0, 7) : ''}
    onChange={(e) => {
      const [y, m] = e.target.value.split('-');
      onChange(new Date(y, m - 1, 1));
    }}
  />
));

// 2) Mock de servicios
jest.mock('../../services/FinancialFixedAssetService', () => ({
  __esModule: true,
  default: {
    uploadService: jest.fn(),
    saveService: jest.fn(),
    generateProjectionService: jest.fn(),
    generateTemporaryAdditionsService: jest.fn(),
  },
}));
import FinancialFixedAssetService from '../../services/FinancialFixedAssetService';

// 3) Componentes reales
import App from '../../App';
import ProjectionGenerator from '../../components/ProjectionGenerator';

// 4) Mock de useAuth para pasar PrivateRoute y activar TokenBridge
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));
const { useAuth } = require('../../hooks/useAuth');

// (Opcional) Polyfill si tu app decodifica tokens
if (typeof global.atob !== 'function') {
  global.atob = (input) => Buffer.from(input, 'base64').toString('binary');
}

describe('Flujo completo de Adiciones Temporales con autenticación (PrivateRoute)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();

    // Usuario autenticado: PrivateRoute deja pasar y TokenBridge persiste pkce_token
    useAuth.mockReturnValue({
      token: 'access-token-fake',
      idToken: 'fake-idtoken',
      idTokenData: { sub: 'user-123', email: 'user@example.com' },
      isAuthenticated: true,
      isPending: false,
      login: jest.fn(),
      logout: jest.fn(),
      error: null,
    });
  });

  afterEach(cleanup);

  test('Subir → Guardar → Generar Proyección → Adiciones Temporales (con rutas protegidas reales)', async () => {
    // —— Respuestas mock ——
    FinancialFixedAssetService.uploadService.mockResolvedValue({
      data: { code: '00', message: 'Archivo subido correctamente.' },
    });
    FinancialFixedAssetService.saveService.mockResolvedValue({
      data: { code: '00', message: 'Información guardada correctamente.' },
    });
    FinancialFixedAssetService.generateProjectionService.mockResolvedValue({
      data: {
        timestamp: '2024-09-07T23:09:06.2970708',
        code: '00',
        message: 'Proyección generada correctamente.',
        response: 1,
        exception: null,
      },
    });
    FinancialFixedAssetService.generateTemporaryAdditionsService.mockResolvedValue({
      data: {
        timestamp: '2024-09-07T23:10:00.0000000',
        code: '00',
        message: 'Adiciones temporales generadas correctamente.',
        response: [{ concept: 'Ajuste', amount: 100 }],
        exception: null,
      },
    });

    // ===== STAGE 1: /upload (ruta protegida real via App + GlobalRouter + PrivateRoute) =====
    window.history.pushState({}, 'Upload', '/upload');
    render(<App />);

    expect(sessionStorage.getItem('pkce_token')).toBe('access-token-fake');

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /cargar excel de activo fijos/i }),
      ).toBeInTheDocument(),
    );

    const periodUp = screen.getByLabelText(/select-period/i);
    await userEvent.type(periodUp, '2022-12');

    const buf = fs.readFileSync(path.resolve(__dirname, 'data/assets.xlsx'));
    const file = new File([buf], 'assets.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const inputFile = screen.getByLabelText(/subir archivo/i);
    await userEvent.upload(inputFile, file);
    await userEvent.click(screen.getByRole('button', { name: /subir archivo/i }));

    await waitFor(() =>
      expect(FinancialFixedAssetService.uploadService).toHaveBeenCalledWith(
        file,
        '2022-12-01',
        expect.any(Function),
      ),
    );

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /guardar información/i })).toBeEnabled(),
    );
    await userEvent.click(screen.getByRole('button', { name: /guardar información/i }));

    await waitFor(() =>
      expect(FinancialFixedAssetService.saveService).toHaveBeenCalledWith(
        '2022-12-01',
        expect.any(Function),
      ),
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Información guardada correctamente.');

    cleanup();

    // ===== STAGE 2: /generate-projection (no existe en App; usamos MemoryRouter) =====
    render(
      <MemoryRouter initialEntries={['/generate-projection']}>
        <Routes>
          <Route
            path="/generate-projection"
            element={
              <ProjectionGenerator
                title="Generación de Proyección"
                serviceFn={FinancialFixedAssetService.generateProjectionService}
                param={{ fileId: 'file-123' }}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    const periodProj = screen.getByLabelText(/select-period/i);
    await userEvent.type(periodProj, '2022-12');
    await userEvent.click(screen.getByRole('button', { name: /generar proyección/i }));

    await waitFor(() =>
      expect(FinancialFixedAssetService.generateProjectionService).toHaveBeenCalledWith(
        '2022-12-01',
        { fileId: 'file-123' },
        expect.any(Function),
      ),
    );
    const alertProj = await screen.findByRole('alert');
    expect(alertProj).toHaveClass('alert alert-success');
    expect(alertProj).toHaveTextContent('Proyección generada correctamente.');

    cleanup();

    // ===== STAGE 3: /temporary-addition (ruta protegida real) =====
    window.history.pushState({}, 'TemporaryAddition', '/temporary-addition');
    render(<App />);

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /generación de adiciones temporales/i }),
      ).toBeInTheDocument(),
    );

    const periodAdd = screen.getByLabelText(/select-period/i);
    await userEvent.type(periodAdd, '2022-12');

    // ⬇️ Desambiguar contra el dropdown del navbar
    const main = screen.getByRole('main');
    const generarBtn = within(main).getByRole('button', { name: /generar proyección/i });
    await userEvent.click(generarBtn);

    await waitFor(() =>
      expect(FinancialFixedAssetService.generateTemporaryAdditionsService).toHaveBeenCalledWith(
        '2022-12-01',
        'ALL',
        expect.any(Function),
      ),
    );

    const alertAdd = await screen.findByRole('alert');
    expect(alertAdd).toHaveClass('alert alert-success');
    expect(alertAdd).toHaveTextContent('Adiciones temporales generadas correctamente.');
  });
});
