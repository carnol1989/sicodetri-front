// src/__tests__/integration/FileUpload.integration.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import FinancialFixedAssetService from '../../services/FinancialFixedAssetService';
import fs from 'fs';
import path from 'path';

// Mocks
jest.mock('../../components/CustomDatePicker', () => ({ selected, onChange }) => (
  <input
    data-testid="period-input"
    type="date"
    value={selected ? selected.toISOString().split('T')[0] : ''}
    onChange={e => onChange(new Date(e.target.value))}
  />
));
jest.mock('../../services/FinancialFixedAssetService', () => ({
  uploadService: jest.fn(),
  saveService: jest.fn(),
}));

describe('Navegación Home → Cargar Archivo → Subir y Guardar', () => {
  let testFile;
  const periodValue = '2025-07-01';

  beforeAll(() => {
    const filePath = path.resolve(__dirname, 'data', 'assets.xlsx');
    const fileBuffer = fs.readFileSync(filePath);
    testFile = new File(
      [fileBuffer],
      'assets.xlsx',
      { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    window.history.pushState({}, 'Home page', '/');
  });

  test('desde Home navega a Cargar Archivo y luego sube y guarda correctamente con mensajes personalizados', async () => {
    // Mock uploadService
    FinancialFixedAssetService.uploadService.mockImplementation((file, period, onProgress) => {
      onProgress({ loaded: 100, total: 100 });
      return Promise.resolve({
        data: {
          timestamp: '2024-09-07T23:04:16.4889082',
          code: '00',
          message: `Archivo subido correctamente: ${file.name}`,
          response: 1,
          exception: null
        }
      });
    });
    // Mock saveService
    FinancialFixedAssetService.saveService.mockImplementation((period, onProgress) => {
      onProgress({ loaded: 100, total: 100 });
      return Promise.resolve({
        data: {
          timestamp: '2024-09-07T23:04:36.4697453',
          code: '00',
          message: `Información guardada correctamente para el periodo: ${period}`,
          response: 1,
          exception: null
        }
      });
    });

    // 1) Render App
    const { container } = render(<App />);

    // 2) Click en "Cargar Archivo" desde Home
    const cargarLink = await screen.findByRole('link', { name: /cargar archivo/i });
    userEvent.click(cargarLink);

    // 3) Llega a FileUpload
    await waitFor(() =>
      expect(
        screen.getByRole('heading', { name: /cargar excel de activo fijos/i })
      ).toBeInTheDocument()
    );

    // 4) Selecciona periodo
    fireEvent.change(screen.getByTestId('period-input'), {
      target: { value: periodValue }
    });

    // 5) Sube el archivo
    const fileInput = container.querySelector('input[type="file"]');
    userEvent.upload(fileInput, testFile);

    // 6) Espera y click en "Subir Archivo"
    const uploadButton = screen.getByRole('button', { name: /subir archivo/i });
    await waitFor(() => expect(uploadButton).toBeEnabled());
    userEvent.click(uploadButton);

    // 7) Verifica alerta de subida
    const uploadAlert = await screen.findByRole('alert');
    expect(uploadAlert).toHaveClass('alert', 'alert-success');
    expect(uploadAlert).toHaveTextContent(
      `Archivo subido correctamente: ${testFile.name}`
    );

    // 8) Click en "Guardar Información"
    const saveButton = screen.getByRole('button', { name: /guardar información/i });
    await waitFor(() => expect(saveButton).toBeEnabled());
    userEvent.click(saveButton);

    // 9) Espera explícita al cambio de texto en el mismo alert
    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        `Información guardada correctamente para el periodo: ${periodValue}`
      )
    );
    // Y sigue siendo alerta de éxito
    expect(screen.getByRole('alert')).toHaveClass('alert', 'alert-success');

    // 10) Aserciones finales
    expect(FinancialFixedAssetService.uploadService).toHaveBeenCalledWith(
      testFile,
      periodValue,
      expect.any(Function)
    );
    expect(FinancialFixedAssetService.saveService).toHaveBeenCalledWith(
      periodValue,
      expect.any(Function)
    );
  });
});
