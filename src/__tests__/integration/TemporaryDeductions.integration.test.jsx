// src/__tests__/integration/TemporaryDeductions.integration.test.jsx
import React from 'react';
import {
  render,
  screen,
  waitFor,
  cleanup
} from '@testing-library/react';
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
    onChange={e => {
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
    generateTemporaryDeductionsService: jest.fn(),
  },
}));
import FinancialFixedAssetService from '../../services/FinancialFixedAssetService';

// 3) Componentes reales
import FileUpload from '../../views/FileUpload';
import ProjectionGenerator from '../../components/ProjectionGenerator';
import TemporaryDeductions from '../../views/TemporaryDeductions';

describe('Flujo completo de Deducciones Temporales', () => {
  beforeEach(() => jest.clearAllMocks());
  afterEach(cleanup);

  test('Subir → Guardar → Generar Proyección → Deducciones Temporales', async () => {
    // —— 1) Mockeos de respuesta —
    FinancialFixedAssetService.uploadService.mockResolvedValue({
      data: { code: '00', message: 'Archivo subido correctamente.' }
    });
    FinancialFixedAssetService.saveService.mockResolvedValue({
      data: { code: '00', message: 'Información guardada correctamente.' }
    });
    FinancialFixedAssetService.generateProjectionService.mockResolvedValue({
      data: {
        timestamp: '2024-09-07T23:09:06.2970708',
        code: '00',
        message: 'Proyección generada correctamente.',
        response: 1,
        exception: null,
      }
    });
    // **Stage 3: devolvemos mensaje exitoso para deducciones**
    FinancialFixedAssetService.generateTemporaryDeductionsService.mockResolvedValue({
      data: {
        timestamp: '2024-09-07T23:10:00.0000000',
        code: '00',
        message: 'Deducciones temporales generadas correctamente.',
        response: [
          { concept: 'Ajuste', amount: 100 }
        ],
        exception: null
      }
    });

    // ===== STAGE 1: /upload =====
    render(
      <MemoryRouter initialEntries={['/upload']}>
        <Routes>
          <Route path="/upload" element={<FileUpload />} />
        </Routes>
      </MemoryRouter>
    );
    // Selección de periodo, upload y save (igual que antes)…
    const periodUp = screen.getByLabelText(/select-period/i);
    await userEvent.type(periodUp, '2022-12');
    const buf = fs.readFileSync(path.resolve(__dirname, 'data/assets.xlsx'));
    const file = new File(
      [buf],
      'assets.xlsx',
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );
    const inputFile = screen.getByLabelText(/subir archivo/i);
    await userEvent.upload(inputFile, file);
    userEvent.click(screen.getByRole('button', { name: /subir archivo/i }));
    await waitFor(() =>
      expect(FinancialFixedAssetService.uploadService)
        .toHaveBeenCalledWith(file, '2022-12-01', expect.any(Function))
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /guardar información/i }))
        .toBeEnabled()
    );
    userEvent.click(screen.getByRole('button', { name: /guardar información/i }));
    await waitFor(() =>
      expect(FinancialFixedAssetService.saveService)
        .toHaveBeenCalledWith('2022-12-01', expect.any(Function))
    );
    expect(screen.getByRole('alert'))
      .toHaveTextContent('Información guardada correctamente.');

    cleanup();

    // ===== STAGE 2: /generate-projection =====
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
      </MemoryRouter>
    );
    // Selección de periodo y click Generar Proyección
    const periodProj = screen.getByLabelText(/select-period/i);
    await userEvent.type(periodProj, '2022-12');
    userEvent.click(screen.getByRole('button', { name: /generar proyección/i }));
    await waitFor(() =>
      expect(FinancialFixedAssetService.generateProjectionService)
        .toHaveBeenCalledWith('2022-12-01', { fileId: 'file-123' }, expect.any(Function))
    );
    const alertProj = await screen.findByRole('alert');
    expect(alertProj).toHaveClass('alert alert-success');
    expect(alertProj).toHaveTextContent('Proyección generada correctamente.');

    cleanup();

    // ===== STAGE 3: /temporary-deductions =====
    render(
      <MemoryRouter initialEntries={['/temporary-deductions']}>
        <Routes>
          <Route path="/temporary-deductions" element={<TemporaryDeductions />} />
        </Routes>
      </MemoryRouter>
    );
    // Seleccionar periodo para habilitar el botón
    const periodDed = screen.getByLabelText(/select-period/i);
    await userEvent.type(periodDed, '2022-12');
    userEvent.click(screen.getByRole('button', { name: /generar proyección/i }));

    await waitFor(() =>
      expect(FinancialFixedAssetService.generateTemporaryDeductionsService)
        .toHaveBeenCalledWith('2022-12-01', '332', expect.any(Function))
    );

    // 📣 **Aquí solo comprobamos el alert de éxito**:
    const alertDed = await screen.findByRole('alert');
    expect(alertDed).toHaveClass('alert alert-success');
    expect(alertDed).toHaveTextContent(
      'Deducciones temporales generadas correctamente.'
    );
  });
});
