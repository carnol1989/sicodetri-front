// src/__tests__/integration/PermanentAdditions.integration.test.jsx
import React from 'react';
import { render, screen, waitFor, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import path from 'path';
import fs from 'fs';

// 1) Stub de CustomDatePicker (igual que tu versión)
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

// 2) Mock de servicios (mantenemos default como objeto con métodos)
jest.mock('../../services/FinancialFixedAssetService', () => ({
  __esModule: true,
  default: {
    uploadService: jest.fn(),
    saveService: jest.fn(),
    generateProjectionService: jest.fn(),
    generatePermanentAdditionsService: jest.fn(),
  },
}));
import FinancialFixedAssetService from '../../services/FinancialFixedAssetService';

// 3) Componentes reales
import App from '../../App';
import ProjectionGenerator from '../../components/ProjectionGenerator';

// ---------- Mock del hook useAuth para que PrivateRoute deje pasar ----------
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));
const { useAuth } = require('../../hooks/useAuth');

// (Opcional) Si tu app decodifica tokens y usa atob en algún lado, polyfill:
if (typeof global.atob !== 'function') {
  global.atob = (input) => Buffer.from(input, 'base64').toString('binary');
}

describe('Flujo completo de Adiciones Permanentes con autenticación (PrivateRoute)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();

    // Usuario autenticado: TokenBridge guardará pkce_token y PrivateRoute permitirá el acceso
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

  test('Subir → Guardar → Generar Proyección → Adiciones Permanentes (con rutas protegidas reales)', async () => {
    // —— 1) Mockeos de respuesta ——
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
    FinancialFixedAssetService.generatePermanentAdditionsService.mockResolvedValue({
      data: {
        timestamp: '2024-09-07T23:10:00.0000000',
        code: '00',
        message: 'Adiciones permanentes generadas correctamente.',
        response: [{ concept: 'Ajuste', amount: 332 }],
        exception: null,
      },
    });

    // ===== STAGE 1: /upload (ruta protegida real a través de App + GlobalRouter + PrivateRoute) =====
    window.history.pushState({}, 'Upload', '/upload');
    render(<App />);

    // (Opcional) TokenBridge persistido
    expect(sessionStorage.getItem('pkce_token')).toBe('access-token-fake');

    // Debe estar en la pantalla de FileUpload (encabezado real)
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /cargar excel de activo fijos/i }),
      ).toBeInTheDocument(),
    );

    // Selección periodo
    const periodUp = screen.getByLabelText(/select-period/i);
    await userEvent.type(periodUp, '2022-12');

    // Archivo
    const buf = fs.readFileSync(path.resolve(__dirname, 'data/assets.xlsx'));
    const file = new File([buf], 'assets.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Subir archivo
    const inputFile = screen.getByLabelText(/subir archivo/i);
    await userEvent.upload(inputFile, file);
    await userEvent.click(screen.getByRole('button', { name: /subir archivo/i }));

    // Espera al mock y a la llamada correcta
    await waitFor(() =>
      expect(FinancialFixedAssetService.uploadService).toHaveBeenCalledWith(
        file,
        '2022-12-01',
        expect.any(Function),
      ),
    );

    // Guardar información
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

    // ===== STAGE 2: /generate-projection (no existe en App: usamos MemoryRouter como antes) =====
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

    // ===== STAGE 3: /permanent-addition (ruta protegida real) =====
    window.history.pushState({}, 'PermanentAddition', '/permanent-addition');
    render(<App />);

    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /generación de adiciones permanentes/i }),
      ).toBeInTheDocument(),
    );

    const periodDed = screen.getByLabelText(/select-period/i);
    await userEvent.type(periodDed, '2022-12');

    // Opción A: scoping al <main> si tu plantilla usa landmark
    const main = screen.getByRole('main');
    const generarBtn = within(main).getByRole('button', { name: /generar proyección/i });
    await userEvent.click(generarBtn);

    // Opción B (si no tienes <main>): usa getAllByRole('button', ...) y filtra por visibilidad/posición

    await waitFor(() =>
      expect(FinancialFixedAssetService.generatePermanentAdditionsService).toHaveBeenCalledWith(
        '2022-12-01',
        '332',
        expect.any(Function),
      ),
    );

    const alertDed = await screen.findByRole('alert');
    expect(alertDed).toHaveClass('alert alert-success');
    expect(alertDed).toHaveTextContent('Adiciones permanentes generadas correctamente.');
  });
});
