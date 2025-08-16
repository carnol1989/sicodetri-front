// src/tests/integration/ReportTaxBook.integration.test.jsx
import React from 'react';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fs from 'fs';
import path from 'path';

// 0) Sólo mockeamos window.open —no tocamos URL.createObjectURL—
window.open = jest.fn();

// DatePicker stub usado por /upload
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

// Servicio
jest.mock('../../services/FinancialFixedAssetService', () => ({
  __esModule: true,
  default: {
    uploadService: jest.fn(),
    saveService: jest.fn(),
    generateReportsService: jest.fn(),
  },
}));
import FinancialFixedAssetService from '../../services/FinancialFixedAssetService';

// Hook de la vista de reporte
jest.mock('../../hooks/useReport');
import useReport from '../../hooks/useReport';

// App real (ErrorBoundary + TokenBridge + GlobalRouter + PrivateRoute + NavBar + Footer)
import App from '../../App';

// Autenticación como en ReportDetailDepreciation
jest.mock('../../hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));
const { useAuth } = require('../../hooks/useAuth');

// (Opcional) polyfill si tu app decodifica tokens
if (typeof global.atob !== 'function') {
  global.atob = (input) => Buffer.from(input, 'base64').toString('binary');
}

describe('Flujo completo Reporte: Libro Tributario de Activo Fijos (autenticado)', () => {
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

  afterEach(() => {
    cleanup();
  });

  test('Upload → Save → Report → Exporta Excel con los 8 args (rutas protegidas reales)', async () => {
    // ===== STAGE 1: UPLOAD + SAVE (ruta protegida /upload vía App) =====
    FinancialFixedAssetService.uploadService.mockResolvedValue({
      data: { code: '00', message: 'Archivo subido correctamente.' },
    });
    FinancialFixedAssetService.saveService.mockResolvedValue({
      data: { code: '00', message: 'Información guardada correctamente.' },
    });

    window.history.pushState({}, 'Upload', '/upload');
    render(<App />);

    // TokenBridge debió persistir token
    expect(sessionStorage.getItem('pkce_token')).toBe('access-token-fake');

    // Seleccionar periodo
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /cargar excel de activo fijos/i }),
      ).toBeInTheDocument(),
    );
    fireEvent.change(screen.getByLabelText(/select-period/i), { target: { value: '2023-07' } });

    // Subir archivo
    const buf = fs.readFileSync(path.resolve(__dirname, 'data/assets.xlsx'));
    const file = new File([buf], 'assets.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    await userEvent.upload(screen.getByLabelText(/subir archivo/i), file);
    userEvent.click(screen.getByRole('button', { name: /subir archivo/i }));

    await waitFor(() =>
      expect(FinancialFixedAssetService.uploadService).toHaveBeenCalledWith(
        file,
        '2023-07-01',
        expect.any(Function),
      ),
    );

    // Guardar info
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /guardar información/i })).toBeEnabled(),
    );
    userEvent.click(screen.getByRole('button', { name: /guardar información/i }));
    await waitFor(() =>
      expect(FinancialFixedAssetService.saveService).toHaveBeenCalledWith(
        '2023-07-01',
        expect.any(Function),
      ),
    );

    // ===== STAGE 2: REPORT + EXPORT (ruta protegida /report-tax-book) =====
    cleanup(); // desmontamos /upload

    const fakeBlob = new Blob(['dummy'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Mock del servicio que genera el reporte
    FinancialFixedAssetService.generateReportsService.mockImplementation(
      (
        opt,
        yearFmt,
        mainCode,
        acctAcc,
        startAcqFmt,
        endAcqFmt,
        startUseFmt,
        endUseFmt,
        onUploadProgress,
      ) => {
        onUploadProgress?.({ lengthComputable: true, loaded: 100, total: 100 });
        window.open('blob:fake-url');
        return Promise.resolve({ data: fakeBlob, code: '00', message: 'Reporte OK' });
      },
    );

    // Stub del hook usado por ReportTaxBook (para no interactuar con su UI interna)
    useReport.mockReturnValue({
      progress: 0,
      year: new Date('2025-01-01'),
      setYear: () => {},
      mainCode: 'AF-001',
      setMainCode: () => {},
      accountingAccount: 'AC-123',
      setAccountingAccount: () => {},
      startAcq: new Date('2024-01-01'),
      setStartAcq: () => {},
      endAcq: new Date('2024-12-01'),
      setEndAcq: () => {},
      startUse: new Date('2023-01-01'),
      setStartUse: () => {},
      endUse: new Date('2023-12-01'),
      setEndUse: () => {},
      disabled: false,
      generate: () =>
        FinancialFixedAssetService.generateReportsService(
          '1',
          '2025',
          'AF-001',
          'AC-123',
          '2024-01-01',
          '2024-12-01',
          '2023-01-01',
          '2023-12-01',
          () => {},
        ),
    });

    // Ir a la ruta real del reporte y renderizar App
    window.history.pushState({}, 'ReportTaxBook', '/report-tax-book');
    render(<App />);

    // Pulsar “Exportar”
    const exportBtn = screen.getByRole('button', { name: /exportar/i });
    await waitFor(() => expect(exportBtn).toBeEnabled());
    userEvent.click(exportBtn);

    // Verificar que el servicio se llamó con los 8 args + callback
    await waitFor(() =>
      expect(FinancialFixedAssetService.generateReportsService).toHaveBeenCalledWith(
        '1',
        '2025',
        'AF-001',
        'AC-123',
        '2024-01-01',
        '2024-12-01',
        '2023-01-01',
        '2023-12-01',
        expect.any(Function),
      ),
    );

    // Y que open recibió la URL fake
    expect(window.open).toHaveBeenCalledWith('blob:fake-url');
  });
});
