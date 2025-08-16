// src/__tests__/integration/ReportDetailDepreciation.integration.test.jsx
import React from 'react';
import { render, screen, waitFor, cleanup, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import fs from 'fs';
import path from 'path';

// 0) Sólo mockeamos window.open —no tocamos URL.createObjectURL—
window.open = jest.fn();

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

jest.mock('../../services/FinancialFixedAssetService', () => ({
  __esModule: true,
  default: {
    uploadService: jest.fn(),
    saveService: jest.fn(),
    generateReportsService: jest.fn(),
  },
}));
import FinancialFixedAssetService from '../../services/FinancialFixedAssetService';

jest.mock('../../hooks/useReport');
import useReport from '../../hooks/useReport';

import NavBar from '../../components/NavBar';
import Home from '../../views/Home';
import FileUpload from '../../views/FileUpload';
import ReportDetailDepreciation from '../../views/ReportDetailDepreciation';

describe('Flujo completo Reporte: Detalle de Depreciación Financiera y Tributaria', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  afterEach(() => {
    cleanup();
  });

  test('Home → Upload → Save → Report → Exporta Excel con los 8 args', async () => {
    // STAGE 1: UPLOAD + SAVE
    FinancialFixedAssetService.uploadService.mockResolvedValue({
      data: { code: '00', message: 'Archivo subido correctamente.' },
    });
    FinancialFixedAssetService.saveService.mockResolvedValue({
      data: { code: '00', message: 'Información guardada correctamente.' },
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<FileUpload />} />
          <Route path="/report-detail-depreciation" element={<ReportDetailDepreciation />} />
        </Routes>
      </MemoryRouter>,
    );

    // Ir a /upload
    await userEvent.click(screen.getByRole('link', { name: /cargar archivo/i }));

    // Seleccionar periodo
    fireEvent.change(screen.getByLabelText(/select-period/i), {
      target: { value: '2023-07' },
    });

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

    // STAGE 2: REPORT + EXPORT
    cleanup(); // desmontar el upload

    const fakeBlob = new Blob(['dummy'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

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
        // 1) Simular progreso
        onUploadProgress({ lengthComputable: true, loaded: 100, total: 100 });
        // 2) Directamente abrimos la "URL" fake
        window.open('blob:fake-url');
        // 3) Devolver el blob como si viniera del servidor
        return Promise.resolve({ data: fakeBlob, code: '00', message: 'Reporte OK' });
      },
    );

    // Stub del hook en ReportTaxBook
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
          '2',
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

    render(
      <MemoryRouter initialEntries={['/report-detail-depreciation']}>
        <NavBar />
        <Routes>
          <Route path="/report-detail-depreciation" element={<ReportDetailDepreciation />} />
        </Routes>
      </MemoryRouter>,
    );

    // Pulsar “Exportar”
    const exportBtn = screen.getByRole('button', { name: /exportar/i });
    await waitFor(() => expect(exportBtn).toBeEnabled());
    userEvent.click(exportBtn);

    // Verificar que el servicio se llamó con los 8 args
    await waitFor(() =>
      expect(FinancialFixedAssetService.generateReportsService).toHaveBeenCalledWith(
        '2',
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
